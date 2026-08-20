import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

type ProductId = "tag" | "sticker";

type CheckoutBody = {
  productId?: ProductId;
  quantity?: number;

  customerEmail?: string;

  shippingName?: string;
  shippingPhone?: string;

  shippingAddress?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingZip?: string;
  shippingCountry?: string;
};

const PRODUCTS = {
  tag: {
    name: "QR Tag",
    unitAmount: 999,
    currency: "usd",
    sku: "QR-TAG-001",
    productType: "physical_qr_tag",
  },

  sticker: {
    name: "QR Sticker",
    unitAmount: 499,
    currency: "usd",
    sku: "QR-STICKER-001",
    productType: "physical_qr_sticker",
  },
} satisfies Record<
  ProductId,
  {
    name: string;
    unitAmount: number;
    currency: string;
    sku: string;
    productType: string;
  }
>;

export async function POST(
  request: NextRequest
) {
  try {
    const secretKey =
      process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
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

    const stripe =
      new Stripe(secretKey);

    const body =
      (await request.json()) as CheckoutBody;

    const productId: ProductId =
      body.productId === "sticker"
        ? "sticker"
        : "tag";

    const product =
      PRODUCTS[productId];

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

    const origin =
      request.nextUrl.origin;

    const session =
      await stripe.checkout.sessions.create({
        mode: "payment",

        payment_method_types: [
          "card",
        ],

        customer_email:
          body.customerEmail ||
          undefined,

        line_items: [
          {
            quantity,

            price_data: {
              currency:
                product.currency,

              unit_amount:
                product.unitAmount,

              product_data: {
                name:
                  product.name,

                metadata: {
                  sku:
                    product.sku,

                  product_type:
                    product.productType,
                },
              },
            },
          },
        ],

        success_url:
          `${origin}/store/success?session_id={CHECKOUT_SESSION_ID}`,

        cancel_url:
          `${origin}/store/checkout?product=${productId}&quantity=${quantity}`,

        metadata: {
          product_id:
            productId,

          sku:
            product.sku,

          product_type:
            product.productType,

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

    return NextResponse.json({
      url: session.url,
      sessionId:
        session.id,
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
