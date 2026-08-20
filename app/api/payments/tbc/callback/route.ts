import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  createClient,
} from "@supabase/supabase-js";

export const runtime =
  "nodejs";

type TbcTokenResponse = {
  access_token?: string;
  token_type?: string;
  expires_in?: number;

  title?: string;
  detail?: string;
  message?: string;
};

type TbcPaymentDetails = {
  payId?: string;

  status?: string;

  merchantPaymentId?: string;

  transactionId?: string | null;

  currency?: string;

  amount?: number | {
    currency?: string;
    total?: number;
    subTotal?: number;
    tax?: number;
  };

  title?: string;
  detail?: string;
  message?: string;

  developerMessage?: string | null;
  userMessage?: string | null;

  [key: string]: unknown;
};

type CallbackBody = {
  PaymentId?: string;
  paymentId?: string;
  payId?: string;

  status?: string;

  merchantPaymentId?: string;

  transactionId?: string;

  [key: string]: unknown;
};

function getSupabaseAdmin() {
  const supabaseUrl =
    process.env
      .NEXT_PUBLIC_SUPABASE_URL;

  const serviceRoleKey =
    process.env
      .SUPABASE_SERVICE_ROLE_KEY;

  if (
    !supabaseUrl ||
    !serviceRoleKey
  ) {
    throw new Error(
      "Supabase server credentials are not configured."
    );
  }

  return createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        persistSession:
          false,

        autoRefreshToken:
          false,
      },
    }
  );
}

async function getTbcAccessToken() {
  const apiKey =
    process.env.TBC_API_KEY;

  const clientId =
    process.env.TBC_CLIENT_ID;

  const clientSecret =
    process.env.TBC_CLIENT_SECRET;

  if (
    !apiKey ||
    !clientId ||
    !clientSecret
  ) {
    throw new Error(
      "TBC credentials are not configured."
    );
  }

  const tokenBody =
    new URLSearchParams();

  tokenBody.set(
    "client_id",
    clientId
  );

  tokenBody.set(
    "client_secret",
    clientSecret
  );

  const response =
    await fetch(
      "https://api.tbcbank.ge/v1/tpay/access-token",
      {
        method:
          "POST",

        headers: {
          apikey:
            apiKey,

          Accept:
            "application/json",

          "Content-Type":
            "application/x-www-form-urlencoded",
        },

        body:
          tokenBody.toString(),

        cache:
          "no-store",
      }
    );

  const data =
    (await response.json()) as
      TbcTokenResponse;

  if (!response.ok) {
    console.error(
      "TBC callback token error:",
      data
    );

    throw new Error(
      data.detail ||
        data.message ||
        data.title ||
        "Could not authenticate with TBC."
    );
  }

  if (!data.access_token) {
    throw new Error(
      "TBC access token was not returned."
    );
  }

  return {
    apiKey,
    accessToken:
      data.access_token,
  };
}

async function getTbcPayment(
  payId: string
) {
  const {
    apiKey,
    accessToken,
  } =
    await getTbcAccessToken();

  const response =
    await fetch(
      `https://api.tbcbank.ge/v1/tpay/payments/${encodeURIComponent(
        payId
      )}`,
      {
        method:
          "GET",

        headers: {
          apikey:
            apiKey,

          Authorization:
            `Bearer ${accessToken}`,

          Accept:
            "application/json",
        },

        cache:
          "no-store",
      }
    );

  const data =
    (await response.json()) as
      TbcPaymentDetails;

  if (!response.ok) {
    console.error(
      "TBC payment verification error:",
      data
    );

    throw new Error(
      data.userMessage ||
        data.detail ||
        data.message ||
        data.developerMessage ||
        data.title ||
        "Could not verify TBC payment."
    );
  }

  return data;
}

async function readCallbackBody(
  request: NextRequest
) {
  const contentType =
    request.headers.get(
      "content-type"
    ) || "";

  /*
   * JSON CALLBACK
   */

  if (
    contentType.includes(
      "application/json"
    )
  ) {
    try {
      return (
        (await request.json()) as
          CallbackBody
      );
    } catch {
      return {};
    }
  }

  /*
   * FORM CALLBACK
   */

  if (
    contentType.includes(
      "application/x-www-form-urlencoded"
    ) ||
    contentType.includes(
      "multipart/form-data"
    )
  ) {
    try {
      const formData =
        await request.formData();

      const result:
        CallbackBody = {};

      for (
        const [
          key,
          value,
        ] of formData.entries()
      ) {
        if (
          typeof value ===
          "string"
        ) {
          result[key] =
            value;
        }
      }

      return result;
    } catch {
      return {};
    }
  }

  /*
   * FALLBACK RAW TEXT
   */

  try {
    const raw =
      await request.text();

    if (!raw) {
      return {};
    }

    try {
      return JSON.parse(
        raw
      ) as CallbackBody;
    } catch {
      const params =
        new URLSearchParams(
          raw
        );

      const result:
        CallbackBody = {};

      params.forEach(
        (value, key) => {
          result[key] =
            value;
        }
      );

      return result;
    }
  } catch {
    return {};
  }
}

function normalizeStatus(
  value?: string | null
) {
  return (
    value || ""
  )
    .trim()
    .toLowerCase();
}

function isPaidStatus(
  status: string
) {
  return [
    "succeeded",
    "success",
    "paid",
    "completed",
  ].includes(status);
}

function isFailedStatus(
  status: string
) {
  return [
    "failed",
    "declined",
    "cancelled",
    "canceled",
    "expired",
    "rejected",
  ].includes(status);
}

function getPaymentAmount(
  payment:
    TbcPaymentDetails
) {
  if (
    typeof payment.amount ===
    "number"
  ) {
    return payment.amount;
  }

  if (
    payment.amount &&
    typeof payment.amount ===
      "object" &&
    typeof payment.amount
      .total === "number"
  ) {
    return payment.amount
      .total;
  }

  return null;
}

function getPaymentCurrency(
  payment:
    TbcPaymentDetails
) {
  if (
    typeof payment.currency ===
    "string"
  ) {
    return payment.currency;
  }

  if (
    payment.amount &&
    typeof payment.amount ===
      "object" &&
    typeof payment.amount
      .currency === "string"
  ) {
    return payment.amount
      .currency;
  }

  return null;
}

export async function POST(
  request: NextRequest
) {
  try {
    const callbackBody =
      await readCallbackBody(
        request
      );

    console.log(
      "TBC callback received:",
      callbackBody
    );

    /*
     * =====================================
     * GET PAY ID
     * =====================================
     */

    const payId =
      String(
        callbackBody.PaymentId ||
          callbackBody.paymentId ||
          callbackBody.payId ||
          ""
      ).trim();

    if (!payId) {
      console.warn(
        "TBC callback without payId:",
        callbackBody
      );

      /*
       * We acknowledge callback receipt,
       * but payment cannot be verified.
       */

      return NextResponse.json({
        received: true,
        verified: false,
        reason:
          "Payment ID missing.",
      });
    }

    /*
     * =====================================
     * VERIFY PAYMENT DIRECTLY WITH TBC
     * =====================================
     */

    const payment =
      await getTbcPayment(
        payId
      );

    console.log(
      "Verified TBC payment:",
      payment
    );

    const verifiedPayId =
      payment.payId ||
      payId;

    const status =
      normalizeStatus(
        payment.status
      );

    const merchantPaymentId =
      String(
        payment.merchantPaymentId ||
          callbackBody.merchantPaymentId ||
          ""
      ).trim();

    /*
     * merchantPaymentId = our orders.id
     */

    if (
      !merchantPaymentId
    ) {
      console.error(
        "TBC payment has no merchantPaymentId:",
        payment
      );

      return NextResponse.json(
        {
          received: true,
          verified: true,
          updated: false,
          reason:
            "merchantPaymentId missing.",
        }
      );
    }

    /*
     * =====================================
     * LOAD ORDER
     * =====================================
     */

    const supabaseAdmin =
      getSupabaseAdmin();

    const {
      data: order,
      error: orderError,
    } = await supabaseAdmin
      .from("orders")
      .select(`
        id,
        user_id,
        status,
        payment_status,
        payment_provider,
        payment_id,
        merchant_payment_id,
        transaction_id,
        payment_amount,
        payment_currency
      `)
      .eq(
        "id",
        merchantPaymentId
      )
      .maybeSingle();

    if (orderError) {
      console.error(
        "TBC callback order lookup error:",
        orderError
      );

      return NextResponse.json(
        {
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
        "TBC order not found:",
        merchantPaymentId
      );

      return NextResponse.json({
        received: true,
        verified: true,
        updated: false,
        reason:
          "Order not found.",
      });
    }

    /*
     * =====================================
     * PAYMENT VALUES
     * =====================================
     */

    const amount =
      getPaymentAmount(
        payment
      );

    const currency =
      getPaymentCurrency(
        payment
      );

    const transactionId =
      payment.transactionId ||
      callbackBody.transactionId ||
      null;

    /*
     * =====================================
     * PAID
     * =====================================
     */

    if (
      isPaidStatus(
        status
      )
    ) {
      /*
       * Idempotency:
       * repeated callback should not hurt.
       */

      if (
        normalizeStatus(
          order.payment_status
        ) === "paid"
      ) {
        return NextResponse.json({
          received: true,
          verified: true,
          updated: false,
          alreadyPaid: true,

          orderId:
            order.id,

          payId:
            verifiedPayId,

          status:
            payment.status,
        });
      }

      const {
        error:
          updateError,
      } =
        await supabaseAdmin
          .from("orders")
          .update({
            status:
              "paid",

            payment_status:
              "paid",

            payment_provider:
              "tbc",

            payment_id:
              verifiedPayId,

            merchant_payment_id:
              merchantPaymentId,

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
              provider:
                "tbc",

              pay_id:
                verifiedPayId,

              merchant_payment_id:
                merchantPaymentId,

              transaction_id:
                transactionId,

              verified_status:
                payment.status ||
                null,

              callback_received:
                true,

              verified_at:
                new Date().toISOString(),

              tbc_payment:
                payment,
            },
          })
          .eq(
            "id",
            merchantPaymentId
          );

      if (
        updateError
      ) {
        console.error(
          "TBC paid order update error:",
          updateError
        );

        return NextResponse.json(
          {
            error:
              "Could not update paid order.",
          },
          {
            status: 500,
          }
        );
      }

      console.log(
        "TBC order marked PAID:",
        merchantPaymentId
      );

      return NextResponse.json({
        received: true,
        verified: true,
        updated: true,

        paid: true,

        orderId:
          merchantPaymentId,

        payId:
          verifiedPayId,

        status:
          payment.status,

        transactionId,
      });
    }

    /*
     * =====================================
     * FAILED / CANCELLED
     * =====================================
     */

    if (
      isFailedStatus(
        status
      )
    ) {
      const {
        error:
          updateError,
      } =
        await supabaseAdmin
          .from("orders")
          .update({
            payment_provider:
              "tbc",

            payment_status:
              "failed",

            payment_id:
              verifiedPayId,

            merchant_payment_id:
              merchantPaymentId,

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
              provider:
                "tbc",

              pay_id:
                verifiedPayId,

              merchant_payment_id:
                merchantPaymentId,

              transaction_id:
                transactionId,

              verified_status:
                payment.status ||
                null,

              failed:
                true,

              callback_received:
                true,

              verified_at:
                new Date().toISOString(),

              tbc_payment:
                payment,
            },
          })
          .eq(
            "id",
            merchantPaymentId
          );

      if (
        updateError
      ) {
        console.error(
          "TBC failed order update error:",
          updateError
        );
      }

      return NextResponse.json({
        received: true,
        verified: true,
        updated:
          !updateError,

        paid: false,

        orderId:
          merchantPaymentId,

        payId:
          verifiedPayId,

        status:
          payment.status,
      });
    }

    /*
     * =====================================
     * STILL PENDING
     * =====================================
     */

    const {
      error:
        pendingUpdateError,
    } = await supabaseAdmin
      .from("orders")
      .update({
        payment_provider:
          "tbc",

        payment_status:
          "pending",

        payment_id:
          verifiedPayId,

        merchant_payment_id:
          merchantPaymentId,

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
          provider:
            "tbc",

          pay_id:
            verifiedPayId,

          merchant_payment_id:
            merchantPaymentId,

          verified_status:
            payment.status ||
            null,

          callback_received:
            true,

          verified_at:
            new Date().toISOString(),

          tbc_payment:
            payment,
        },
      })
      .eq(
        "id",
        merchantPaymentId
      );

    if (
      pendingUpdateError
    ) {
      console.error(
        "TBC pending update error:",
        pendingUpdateError
      );
    }

    return NextResponse.json({
      received: true,
      verified: true,

      paid: false,

      pending: true,

      orderId:
        merchantPaymentId,

      payId:
        verifiedPayId,

      status:
        payment.status,
    });
  } catch (error) {
    console.error(
      "TBC callback error:",
      error
    );

    return NextResponse.json(
      {
        received: false,

        error:
          error instanceof Error
            ? error.message
            : "Could not process TBC callback.",
      },
      {
        status: 500,
      }
    );
  }
}
