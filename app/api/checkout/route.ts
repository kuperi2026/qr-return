import {
  NextRequest,
  NextResponse,
} from "next/server";

import Stripe from "stripe";

import { createClient } from "@supabase/supabase-js";

type CheckoutBody = {
  productSlug?: string;
  quantity?: number;
  orderId?: string;

  customerEmail?: string;

  shippingName?: string;
  shippingPhone?: string;

  shippingAddress?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingZip?: string;
  shippingCountry?: string;
};

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  category: string;
  design_name: string | null;
  description: string | null;
  sku: string;
  price: number;
  currency: string;
  image_url: string | null;
  stock_quantity: number;
  active: boolean;
};

export async function POST(
  request: NextRequest
) {
  try {
    /*
     * --------------------------------
     * ENV
     * --------------------------------
     */

    const stripeSecretKey =
      process.env.STRIPE_SECRET_KEY;

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

    /*
     * --------------------------------
     * CLIENTS
     * --------------------------------
     */

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
     * --------------------------------
     * BODY
     * --------------------------------
     */

    const body =
      (await request.json()) as CheckoutBody;

    const productSlug =
      body.productSlug?.trim();

    if (!productSlug) {
      return NextResponse.json(
        {
          error:
            "Product slug is required.",
        },
        {
          status: 400,
        }
      );
    }

    const orderId =
      body.orderId?.trim();

    if (!orderId) {
      return NextResponse.json(
        {
          error:
            "Order ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * --------------------------------
     * QUANTITY
     * --------------------------------
     */

    const rawQuantity =
      Number(
        body.quantity || 1
      );

    const quantity =
      Number.isFinite(
        rawQuantity
      ) &&
      rawQuantity >= 1
        ? Math.min(
            99,
            Math.floor(
              rawQuantity
            )
          )
        : 1;

    /*
     * --------------------------------
     * LOAD PRODUCT FROM DATABASE
     * --------------------------------
     */

    const {
      data: productData,
      error: productError,
    } = await supabaseAdmin
      .from("products")
      .select(`
        id,
        slug,
        name,
        category,
        design_name,
        description,
        sku,
        price,
        currency,
        image_url,
        stock_quantity,
        active
      `)
      .eq(
        "slug",
        productSlug
      )
      .eq(
        "active",
        true
      )
      .maybeSingle();

    if (productError) {
      console.error(
        "Stripe product lookup error:",
        productError
      );

      return NextResponse.json(
        {
          error:
            "Could not load product.",
        },
        {
          status: 500,
        }
      );
    }

    if (!productData) {
      return NextResponse.json(
        {
          error:
            "Product not found.",
        },
        {
          status: 404,
        }
      );
    }

    const product =
      productData as ProductRow;

    /*
     * --------------------------------
     * STOCK CHECK
     * --------------------------------
     */

    if (
      product.stock_quantity <
      quantity
    ) {
      return NextResponse.json(
        {
          error:
            "Requested quantity is not available.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * --------------------------------
     * MONEY
     * --------------------------------
     */

    const price =
      Number(
        product.price
      );

    if (
      !Number.isFinite(price) ||
      price <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid product price.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * Stripe unit_amount uses
     * the smallest currency unit.
     *
     * USD 9.99 -> 999
     */

    const unitAmount =
      Math.round(
        price * 100
      );

    const currency =
      (
        product.currency ||
        "USD"
      ).toLowerCase();

    /*
     * --------------------------------
     * VERIFY ORDER
     * --------------------------------
     */

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
        product_id,
        quantity,
        total
      `)
      .eq(
        "id",
        orderId
      )
      .maybeSingle();

    if (orderError) {
      console.error(
        "Stripe order lookup error:",
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
      return NextResponse.json(
        {
          error:
            "Order not found.",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * Do not create another payment
     * for an already paid order.
     */

    if (
      String(
        order.payment_status ||
        ""
      ).toLowerCase() ===
      "paid"
    ) {
      return NextResponse.json(
        {
          error:
            "This order is already paid.",
        },
        {
          status: 409,
        }
      );
    }

    /*
     * --------------------------------
     * CREATE STRIPE CHECKOUT SESSION
     * --------------------------------
     */

    const origin =
      request.nextUrl.origin;

    const session =
      await stripe.checkout.sessions.create({
        mode: "payment",

        customer_email:
          body.customerEmail ||
          undefined,

        client_reference_id:
          String(orderId),

        line_items: [
          {
            quantity,

            price_data: {
              currency,

              unit_amount:
                unitAmount,

              product_data: {
                name:
                  product.design_name
                    ? `${product.name} — ${product.design_name}`
                    : product.name,

                description:
                  product.description ||
                  undefined,

                images:
                  product.image_url
                    ? [
                        product.image_url,
                      ]
                    : undefined,

                metadata: {
                  product_id:
                    product.id,

                  product_slug:
                    product.slug,

                  sku:
                    product.sku,

                  category:
                    product.category,

                  design_name:
                    product.design_name ||
                    "",
                },
              },
            },
          },
        ],

        success_url:
          `${origin}/store/success` +
          `?provider=stripe` +
          `&order=${encodeURIComponent(
            String(orderId)
          )}` +
          `&session_id={CHECKOUT_SESSION_ID}`,

        cancel_url:
          `${origin}/store/checkout` +
          `?product=${encodeURIComponent(
            product.slug
          )}` +
          `&quantity=${quantity}`,

        metadata: {
          provider:
            "stripe",

          order_id:
            String(orderId),

          product_id:
            product.id,

          product_slug:
            product.slug,

          sku:
            product.sku,

          category:
            product.category,

          design_name:
            product.design_name ||
            "",

          quantity:
            String(quantity),

          shipping_name:
            body.shippingName ||
            "",

          shipping_phone:
            body.shippingPhone ||
            "",

          shipping_address:
            body.shippingAddress ||
            "",

          shipping_city:
            body.shippingCity ||
            "",

          shipping_state:
            body.shippingState ||
            "",

          shipping_zip:
            body.shippingZip ||
            "",

          shipping_country:
            body.shippingCountry ||
            "",
        },
      });

    if (!session.url) {
      return NextResponse.json(
        {
          error:
            "Stripe Checkout URL was not returned.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * --------------------------------
     * SAVE STRIPE SESSION TO ORDER
     * --------------------------------
     */

    const {
      error:
        orderUpdateError,
    } = await supabaseAdmin
      .from("orders")
      .update({
        payment_provider:
          "stripe",

        payment_status:
          "pending",

        payment_id:
          session.id,

        merchant_payment_id:
          String(orderId),

        payment_currency:
          (
            product.currency ||
            "USD"
          ).toUpperCase(),

        payment_amount:
          Number(
            (
              price *
              quantity
            ).toFixed(2)
          ),

        payment_metadata: {
          provider:
            "stripe",

          stripe_session_id:
            session.id,

          product_slug:
            product.slug,

          product_id:
            product.id,

          sku:
            product.sku,

          quantity,
        },
      })
      .eq(
        "id",
        orderId
      );

    if (
      orderUpdateError
    ) {
      console.error(
        "Stripe order update error:",
        orderUpdateError
      );

      /*
       * Session უკვე შექმნილია,
       * ამიტომ Checkout-ს არ ვბლოკავთ.
       * webhook მოგვიანებით მაინც
       * დაადასტურებს payment-ს.
       */
    }

    /*
     * --------------------------------
     * RESPONSE
     * --------------------------------
     */

    return NextResponse.json({
      success: true,

      provider:
        "stripe",

      orderId,

      sessionId:
        session.id,

      url:
        session.url,
    });
  } catch (error) {
    console.error(
      "Stripe checkout error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not create Stripe Checkout session.",
      },
      {
        status: 500,
      }
    );
  }
}
