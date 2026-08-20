import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

type BogCallbackBody = {
  id?: string;
  order_id?: string;
  external_order_id?: string;

  order_status?: {
    key?: string;
    value?: string;
  };

  purchase_units?: {
    currency?: string;
    total_amount?: number;
  };

  payment_detail?: {
    transaction_id?: string;
    transfer_method?: {
      key?: string;
      value?: string;
    };
  };

  [key: string]: unknown;
};

function getSupabaseAdmin() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Supabase server credentials are not configured."
    );
  }

  return createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}

function normalizeStatus(value?: string | null) {
  return (value || "").trim().toLowerCase();
}

function isPaidStatus(status: string) {
  return [
    "completed",
    "success",
    "succeeded",
    "paid",
    "approved",
  ].includes(status);
}

function isFailedStatus(status: string) {
  return [
    "failed",
    "rejected",
    "declined",
    "cancelled",
    "canceled",
    "expired",
  ].includes(status);
}

export async function POST(request: NextRequest) {
  try {
    /*
     * ==========================================
     * READ CALLBACK
     * ==========================================
     */

    let body: BogCallbackBody;

    try {
      body =
        (await request.json()) as BogCallbackBody;
    } catch {
      return NextResponse.json(
        {
          received: false,
          error: "Invalid callback body.",
        },
        {
          status: 400,
        }
      );
    }

    console.log(
      "BOG callback received:",
      JSON.stringify(body)
    );

    /*
     * ==========================================
     * BOG ORDER ID
     * ==========================================
     */

    const bogOrderId =
      String(
        body.id ||
          body.order_id ||
          ""
      ).trim();

    /*
     * This should be our Supabase orders.id.
     */

    const externalOrderId =
      String(
        body.external_order_id ||
          ""
      ).trim();

    /*
     * ==========================================
     * STATUS
     * ==========================================
     */

    const rawStatus =
      body.order_status?.key ||
      body.order_status?.value ||
      "";

    const status =
      normalizeStatus(rawStatus);

    /*
     * ==========================================
     * PAYMENT DATA
     * ==========================================
     */

    const transactionId =
      body.payment_detail
        ?.transaction_id ||
      null;

    const currency =
      body.purchase_units
        ?.currency ||
      null;

    const amount =
      typeof body.purchase_units
        ?.total_amount === "number"
        ? body.purchase_units.total_amount
        : null;

    /*
     * ==========================================
     * SUPABASE
     * ==========================================
     */

    const supabaseAdmin =
      getSupabaseAdmin();

    /*
     * ==========================================
     * FIND ORDER
     * ==========================================
     *
     * Prefer external_order_id because
     * when payment was created we set:
     *
     * external_order_id = orders.id
     */

    let orderQuery =
      supabaseAdmin
        .from("orders")
        .select(`
          id,
          status,
          payment_status,
          payment_provider,
          payment_id,
          merchant_payment_id,
          transaction_id,
          payment_amount,
          payment_currency
        `);

    if (externalOrderId) {
      orderQuery =
        orderQuery.eq(
          "id",
          externalOrderId
        );
    } else if (bogOrderId) {
      orderQuery =
        orderQuery.eq(
          "payment_id",
          bogOrderId
        );
    } else {
      return NextResponse.json(
        {
          received: true,
          updated: false,
          reason:
            "Order identifiers are missing.",
        }
      );
    }

    const {
      data: order,
      error: orderError,
    } =
      await orderQuery.maybeSingle();

    if (orderError) {
      console.error(
        "BOG callback order lookup error:",
        orderError
      );

      return NextResponse.json(
        {
          received: false,
          error:
            "Could not load order.",
        },
        {
          status: 500,
        }
      );
    }

    if (!order) {
      console.error(
        "BOG callback order not found:",
        {
          bogOrderId,
          externalOrderId,
        }
      );

      return NextResponse.json({
        received: true,
        updated: false,
        reason: "Order not found.",
      });
    }

    /*
     * ==========================================
     * SUCCESSFUL PAYMENT
     * ==========================================
     */

    if (isPaidStatus(status)) {
      /*
       * Callback can arrive more than once.
       */

      if (
        normalizeStatus(
          order.payment_status
        ) === "paid"
      ) {
        return NextResponse.json({
          received: true,
          updated: false,
          alreadyPaid: true,
          orderId: order.id,
          bogOrderId,
        });
      }

      const {
        error: updateError,
      } =
        await supabaseAdmin
          .from("orders")
          .update({
            status: "paid",

            payment_status:
              "paid",

            payment_provider:
              "bog",

            payment_id:
              bogOrderId ||
              order.payment_id,

            merchant_payment_id:
              String(order.id),

            transaction_id:
              transactionId,

            paid_at:
              new Date().toISOString(),

            payment_currency:
              currency ||
              order.payment_currency ||
              null,

            payment_amount:
              amount ??
              order.payment_amount ??
              null,

            payment_metadata: {
              provider: "bog",

              bog_order_id:
                bogOrderId || null,

              external_order_id:
                externalOrderId ||
                String(order.id),

              transaction_id:
                transactionId,

              status:
                rawStatus || null,

              callback_received:
                true,

              callback_received_at:
                new Date().toISOString(),

              payment_method:
                body.payment_detail
                  ?.transfer_method
                  ?.key ||
                null,

              bog_callback:
                body,
            },
          })
          .eq(
            "id",
            order.id
          );

      if (updateError) {
        console.error(
          "BOG paid update error:",
          updateError
        );

        return NextResponse.json(
          {
            received: true,
            updated: false,
            error:
              "Could not update paid order.",
          },
          {
            status: 500,
          }
        );
      }

      console.log(
        "BOG order marked PAID:",
        order.id
      );

      return NextResponse.json({
        received: true,
        updated: true,
        paid: true,

        orderId:
          order.id,

        bogOrderId,

        transactionId,
      });
    }

    /*
     * ==========================================
     * FAILED PAYMENT
     * ==========================================
     */

    if (isFailedStatus(status)) {
      const {
        error: updateError,
      } =
        await supabaseAdmin
          .from("orders")
          .update({
            payment_provider:
              "bog",

            payment_status:
              "failed",

            payment_id:
              bogOrderId ||
              order.payment_id,

            merchant_payment_id:
              String(order.id),

            transaction_id:
              transactionId,

            payment_currency:
              currency ||
              order.payment_currency ||
              null,

            payment_amount:
              amount ??
              order.payment_amount ??
              null,

            payment_metadata: {
              provider: "bog",

              bog_order_id:
                bogOrderId || null,

              external_order_id:
                externalOrderId ||
                String(order.id),

              transaction_id:
                transactionId,

              status:
                rawStatus || null,

              failed: true,

              callback_received:
                true,

              callback_received_at:
                new Date().toISOString(),

              bog_callback:
                body,
            },
          })
          .eq(
            "id",
            order.id
          );

      if (updateError) {
        console.error(
          "BOG failed update error:",
          updateError
        );
      }

      return NextResponse.json({
        received: true,

        updated:
          !updateError,

        paid: false,

        failed: true,

        orderId:
          order.id,

        bogOrderId,

        status:
          rawStatus,
      });
    }

    /*
     * ==========================================
     * PENDING / UNKNOWN STATUS
     * ==========================================
     */

    const {
      error: pendingError,
    } =
      await supabaseAdmin
        .from("orders")
        .update({
          payment_provider:
            "bog",

          payment_status:
            "pending",

          payment_id:
            bogOrderId ||
            order.payment_id,

          merchant_payment_id:
            String(order.id),

          transaction_id:
            transactionId,

          payment_currency:
            currency ||
            order.payment_currency ||
            null,

          payment_amount:
            amount ??
            order.payment_amount ??
            null,

          payment_metadata: {
            provider: "bog",

            bog_order_id:
              bogOrderId || null,

            external_order_id:
              externalOrderId ||
              String(order.id),

            transaction_id:
              transactionId,

            status:
              rawStatus || null,

            callback_received:
              true,

            callback_received_at:
              new Date().toISOString(),

            bog_callback:
              body,
          },
        })
        .eq(
          "id",
          order.id
        );

    if (pendingError) {
      console.error(
        "BOG pending update error:",
        pendingError
      );
    }

    return NextResponse.json({
      received: true,

      updated:
        !pendingError,

      paid: false,

      pending: true,

      orderId:
        order.id,

      bogOrderId,

      status:
        rawStatus || "unknown",
    });
  } catch (error) {
    console.error(
      "BOG callback error:",
      error
    );

    return NextResponse.json(
      {
        received: false,

        error:
          error instanceof Error
            ? error.message
            : "Could not process BOG callback.",
      },
      {
        status: 500,
      }
    );
  }
}
