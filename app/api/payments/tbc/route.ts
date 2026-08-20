import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  createClient,
} from "@supabase/supabase-js";

type TbcCheckoutBody = {
  productSlug?: string;
  quantity?: number;
  orderId?: string;
  language?: "KA" | "EN";
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

type TbcTokenResponse = {
  access_token?: string;
  token_type?: string;
  expires_in?: number;

  title?: string;
  detail?: string;
  message?: string;
};

type TbcPaymentLink = {
  uri?: string;
  method?: string;
  rel?: string;
};

type TbcPaymentResponse = {
  payId?: string;
  status?: string;

  links?: TbcPaymentLink[];

  transactionId?: string | null;

  title?: string;
  detail?: string;
  message?: string;

  developerMessage?: string | null;
  userMessage?: string | null;
};

export async function POST(
  request: NextRequest
) {
  try {
    /*
     * ==========================================
     * ENVIRONMENT VARIABLES
     * ==========================================
     */

    const apiKey =
      process.env.TBC_API_KEY;

    const clientId =
      process.env.TBC_CLIENT_ID;

    const clientSecret =
      process.env.TBC_CLIENT_SECRET;

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const supabaseServiceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (
      !apiKey ||
      !clientId ||
      !clientSecret
    ) {
      return NextResponse.json(
        {
          error:
            "TBC credentials are not configured.",
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
     * ==========================================
     * SUPABASE ADMIN
     * ==========================================
     */

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
     * ==========================================
     * REQUEST BODY
     * ==========================================
     */

    const body =
      (await request.json()) as
        TbcCheckoutBody;

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
     * ==========================================
     * QUANTITY
     * ==========================================
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
     * ==========================================
     * LOAD PRODUCT
     * ==========================================
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
        "TBC product lookup error:",
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
     * ==========================================
     * STOCK CHECK
     * ==========================================
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
     * ==========================================
     * VERIFY ORDER
     * ==========================================
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
        "TBC order lookup error:",
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
     * ==========================================
     * PAYMENT AMOUNT
     * ==========================================
     *
     * Current products table stores USD prices.
     *
     * For TBC we will initially request USD.
     * Merchant must have USD payments enabled.
     *
     * Later we can add separate GEL prices
     * to products table.
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

    const total =
      Number(
        (
          price *
          quantity
        ).toFixed(2)
      );

    const currency =
      (
        product.currency ||
        "USD"
      ).toUpperCase();

    if (
      ![
        "USD",
        "GEL",
        "EUR",
      ].includes(currency)
    ) {
      return NextResponse.json(
        {
          error:
            "This currency is not supported by TBC Checkout.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * ==========================================
     * STEP 1:
     * GET TBC ACCESS TOKEN
     * ==========================================
     */

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

    const tokenResponse =
      await fetch(
        "https://api.tbcbank.ge/v1/tpay/access-token",
        {
          method: "POST",

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

    const tokenData =
      (await tokenResponse.json()) as
        TbcTokenResponse;

    if (!tokenResponse.ok) {
      console.error(
        "TBC token error:",
        tokenData
      );

      return NextResponse.json(
        {
          error:
            tokenData.detail ||
            tokenData.message ||
            tokenData.title ||
            "Could not authenticate with TBC.",
        },
        {
          status:
            tokenResponse.status,
        }
      );
    }

    const accessToken =
      tokenData.access_token;

    if (!accessToken) {
      return NextResponse.json(
        {
          error:
            "TBC access token was not returned.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * ==========================================
     * STEP 2:
     * CREATE TBC PAYMENT
     * ==========================================
     */

    const origin =
      request.nextUrl.origin;

    const returnUrl =
      `${origin}/store/success` +
      `?provider=tbc` +
      `&order=${encodeURIComponent(
        String(orderId)
      )}`;

    const callbackUrl =
      `${origin}/api/payments/tbc/callback`;

    const description =
      product.design_name
        ? `${product.name} ${product.design_name}`
        : product.name;

    const paymentPayload = {
      amount: {
        currency,
        total,
      },

      returnurl:
        returnUrl,

      callbackUrl,

      preAuth:
        false,

      language:
        body.language === "EN"
          ? "EN"
          : "KA",

      merchantPaymentId:
        String(orderId),

      skipInfoMessage:
        false,

      saveCard:
        false,

      description:
        description.slice(
          0,
          30
        ),

      extra:
        String(orderId).slice(
          0,
          25
        ),
    };

    const paymentResponse =
      await fetch(
        "https://api.tbcbank.ge/v1/tpay/payments",
        {
          method: "POST",

          headers: {
            apikey:
              apiKey,

            Authorization:
              `Bearer ${accessToken}`,

            Accept:
              "application/json",

            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify(
              paymentPayload
            ),

          cache:
            "no-store",
        }
      );

    const paymentData =
      (await paymentResponse.json()) as
        TbcPaymentResponse;

    if (!paymentResponse.ok) {
      console.error(
        "TBC create payment error:",
        paymentData
      );

      return NextResponse.json(
        {
          error:
            paymentData.userMessage ||
            paymentData.detail ||
            paymentData.message ||
            paymentData.developerMessage ||
            paymentData.title ||
            "Could not create TBC payment.",
        },
        {
          status:
            paymentResponse.status,
        }
      );
    }

    /*
     * ==========================================
     * APPROVAL URL
     * ==========================================
     */

    const approvalLink =
      paymentData.links?.find(
        (link) =>
          link.rel ===
          "approval_url"
      );

    const approvalUrl =
      approvalLink?.uri;

    if (!approvalUrl) {
      console.error(
        "TBC approval URL missing:",
        paymentData
      );

      return NextResponse.json(
        {
          error:
            "TBC payment was created but approval URL was not returned.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * ==========================================
     * SAVE PAYMENT DATA TO ORDER
     * ==========================================
     */

    const {
      error:
        updateError,
    } = await supabaseAdmin
      .from("orders")
      .update({
        payment_provider:
          "tbc",

        payment_status:
          "pending",

        payment_id:
          paymentData.payId ||
          null,

        merchant_payment_id:
          String(orderId),

        transaction_id:
          paymentData.transactionId ||
          null,

        payment_currency:
          currency,

        payment_amount:
          total,

        payment_metadata: {
          provider:
            "tbc",

          pay_id:
            paymentData.payId ||
            null,

          initial_status:
            paymentData.status ||
            null,

          product_id:
            product.id,

          product_slug:
            product.slug,

          sku:
            product.sku,

          design_name:
            product.design_name,

          quantity,

          approval_url:
            approvalUrl,
        },
      })
      .eq(
        "id",
        orderId
      );

    if (updateError) {
      console.error(
        "TBC order update error:",
        updateError
      );
    }

    /*
     * ==========================================
     * RESPONSE
     * ==========================================
     */

    return NextResponse.json({
      success: true,

      provider:
        "tbc",

      orderId,

      payId:
        paymentData.payId ||
        null,

      status:
        paymentData.status ||
        null,

      productId:
        product.id,

      productSlug:
        product.slug,

      productName:
        product.name,

      designName:
        product.design_name,

      sku:
        product.sku,

      quantity,

      currency,

      total,

      approvalUrl,
    });
  } catch (error) {
    console.error(
      "TBC checkout error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not create TBC payment.",
      },
      {
        status: 500,
      }
    );
  }
}
