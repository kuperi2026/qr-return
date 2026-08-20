import {
  NextRequest,
  NextResponse,
} from "next/server";

import Stripe from "stripe";

import {
  createClient,
} from "@supabase/supabase-js";

export const runtime =
  "nodejs";

export async function POST(
  request: NextRequest
) {
  try {
    const stripeSecretKey =
      process.env.STRIPE_SECRET_KEY;

    const webhookSecret =
      process.env.STRIPE_WEBHOOK_SECRET;

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const supabaseServiceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!stripeSecretKey) {
      return NextResponse.json(
        {
          error:
            "STRIPE_SECRET_KEY is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    if (!webhookSecret) {
      return NextResponse.json(
        {
          error:
            "STRIPE_WEBHOOK_SECRET is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    if (
      !supabaseUrl ||
      !supabaseServiceKey
    ) {
      return NextResponse.json(
        {
          error:
            "Supabase server credentials are not configured.",
        },
        {
          status: 500,
        }
      );
    }

    const stripe =
      new Stripe(
        stripeSecretKey
      );

    const supabaseAdmin =
      createClient(
        supabaseUrl,
        supabaseServiceKey,
        {
          auth: {
            persistSession: false,
            autoRefreshToken:
              false,
          },
        }
      );

    /*
     * Stripe signature
     */

    const signature =
      request.headers.get(
        "stripe-signature"
      );

    if (!signature) {
      return NextResponse.json(
        {
          error:
            "Missing Stripe signature.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * IMPORTANT:
     * Stripe webhook signature
     * verification needs raw body.
     */

    const rawBody =
      await request.text();

    let event:
      Stripe.Event;

    try {
      event =
        stripe.webhooks.constructEvent(
          rawBody,
          signature,
          webhookSecret
        );
    } catch (error) {
      console.error(
        "Stripe webhook signature error:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Invalid Stripe webhook signature.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * ==================================
     * CHECKOUT COMPLETED
     * ==================================
     */

    if (
      event.type ===
      "checkout.session.completed"
    ) {
      const session =
        event.data.object as
          Stripe.Checkout.Session;

      const orderId =
        session.metadata
          ?.order_id ||
        session.client_reference_id;

      if (!orderId) {
        console.error(
          "Stripe completed session has no order ID:",
          session.id
        );

        return NextResponse.json({
          received: true,
          warning:
            "Order ID missing",
        });
      }

      /*
       * Only mark PAID when Stripe
       * confirms payment_status = paid.
       */

      if (
        session.payment_status ===
        "paid"
      ) {
        let transactionId:
          string | null = null;

        if (
          typeof session.payment_intent ===
          "string"
        ) {
          transactionId =
            session.payment_intent;
        }

        const {
          error: updateError,
        } =
          await supabaseAdmin
            .from("orders")
            .update({
              status:
                "paid",

              payment_status:
                "paid",

              payment_provider:
                "stripe",

              payment_id:
                session.id,

              merchant_payment_id:
                String(
                  orderId
                ),

              transaction_id:
                transactionId,

              paid_at:
                new Date().toISOString(),

              payment_currency:
                session.currency
                  ? session.currency.toUpperCase()
                  : null,

              payment_amount:
                typeof session.amount_total ===
                "number"
                  ? Number(
                      (
                        session.amount_total /
                        100
                      ).toFixed(2)
                    )
                  : null,

              payment_metadata: {
                provider:
                  "stripe",

                stripe_session_id:
                  session.id,

                stripe_payment_intent:
                  transactionId,

                stripe_payment_status:
                  session.payment_status,

                stripe_customer:
                  session.customer,

                product_id:
                  session.metadata
                    ?.product_id ||
                  null,

                product_slug:
                  session.metadata
                    ?.product_slug ||
                  null,

                sku:
                  session.metadata
                    ?.sku ||
                  null,

                quantity:
                  session.metadata
                    ?.quantity ||
                  null,
              },
            })
            .eq(
              "id",
              orderId
            );

        if (updateError) {
          console.error(
            "Stripe paid order update error:",
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
          "Stripe order marked paid:",
          orderId
        );
      }
    }

    /*
     * ==================================
     * ASYNC PAYMENT SUCCESS
     * ==================================
     *
     * Useful if Stripe payment methods
     * settle asynchronously later.
     */

    if (
      event.type ===
      "checkout.session.async_payment_succeeded"
    ) {
      const session =
        event.data.object as
          Stripe.Checkout.Session;

      const orderId =
        session.metadata
          ?.order_id ||
        session.client_reference_id;

      if (orderId) {
        const transactionId =
          typeof session.payment_intent ===
          "string"
            ? session.payment_intent
            : null;

        const {
          error: updateError,
        } =
          await supabaseAdmin
            .from("orders")
            .update({
              status:
                "paid",

              payment_status:
                "paid",

              payment_provider:
                "stripe",

              payment_id:
                session.id,

              merchant_payment_id:
                String(
                  orderId
                ),

              transaction_id:
                transactionId,

              paid_at:
                new Date().toISOString(),

              payment_currency:
                session.currency
                  ? session.currency.toUpperCase()
                  : null,

              payment_amount:
                typeof session.amount_total ===
                "number"
                  ? Number(
                      (
                        session.amount_total /
                        100
                      ).toFixed(2)
                    )
                  : null,

              payment_metadata: {
                provider:
                  "stripe",

                stripe_session_id:
                  session.id,

                stripe_payment_intent:
                  transactionId,

                stripe_payment_status:
                  session.payment_status,

                async_payment:
                  true,
              },
            })
            .eq(
              "id",
              orderId
            );

        if (updateError) {
          console.error(
            "Stripe async payment update error:",
            updateError
          );

          return NextResponse.json(
            {
              error:
                "Could not update async payment.",
            },
            {
              status: 500,
            }
          );
        }
      }
    }

    /*
     * ==================================
     * ASYNC PAYMENT FAILED
     * ==================================
     */

    if (
      event.type ===
      "checkout.session.async_payment_failed"
    ) {
      const session =
        event.data.object as
          Stripe.Checkout.Session;

      const orderId =
        session.metadata
          ?.order_id ||
        session.client_reference_id;

      if (orderId) {
        const {
          error: updateError,
        } =
          await supabaseAdmin
            .from("orders")
            .update({
              payment_status:
                "failed",

              payment_provider:
                "stripe",

              payment_id:
                session.id,

              payment_metadata: {
                provider:
                  "stripe",

                stripe_session_id:
                  session.id,

                stripe_payment_status:
                  session.payment_status,

                async_payment_failed:
                  true,
              },
            })
            .eq(
              "id",
              orderId
            );

        if (updateError) {
          console.error(
            "Stripe failed payment update error:",
            updateError
          );
        }
      }
    }

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error(
      "Stripe webhook error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Stripe webhook failed.",
      },
      {
        status: 500,
      }
    );
  }
}
