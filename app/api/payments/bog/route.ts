import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  createClient,
} from "@supabase/supabase-js";

type BogCheckoutBody = {
  productSlug?: string;
  quantity?: number;
  orderId?: string;

  language?: "ka" | "en";

  customerEmail?: string;

  shipping?: {
    fullName?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
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

type BogTokenResponse = {
  access_token?: string;
  token_type?: string;
  expires_in?: number;

  error?: string;
  error_description?: string;
};

type BogOrderResponse = {
  id?: string;

  _links?: {
    redirect?: {
      href?: string;
    };
  };

  links?: {
    redirect?: {
      href?: string;
    };
  };

  status?: string;

  [key: string]: unknown;
};

function getSupabaseAdmin() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY;

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
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}

async function getBogAccessToken() {
  const clientId =
    process.env.BOG_CLIENT_ID;

  const clientSecret =
    process.env.BOG_CLIENT_SECRET;

  if (
    !clientId ||
    !clientSecret
  ) {
    throw new Error(
      "Bank of Georgia credentials are not configured."
    );
  }

  /*
   * BOG merchant OAuth token.
   *
   * Keep these credentials ONLY on server.
   */

  const basicAuth =
    Buffer.from(
      `${clientId}:${clientSecret}`
    ).toString("base64");

  const body =
    new URLSearchParams();

  body.set(
    "grant_type",
    "client_credentials"
  );

  const response =
    await fetch(
      "https://oauth2.bog.ge/auth/realms/bog/protocol/openid-connect/token",
      {
        method: "POST",

        headers: {
          Authorization:
            `Basic ${basicAuth}`,

          "Content-Type":
            "application/x-www-form-urlencoded",

          Accept:
            "application/json",
        },

        body:
          body.toString(),

        cache:
          "no-store",
      }
    );

  const data =
    (await response.json()) as
      BogTokenResponse;

  if (!response.ok) {
    console.error(
      "BOG token error:",
      data
    );

    throw new Error(
      data.error_description ||
        data.error ||
        "Could not authenticate with Bank of Georgia."
    );
  }

  if (!data.access_token) {
    throw new Error(
      "Bank of Georgia access token was not returned."
    );
  }

  return data.access_token;
}

export async function POST(
  request: NextRequest
) {
  try {
    /*
     * ==========================================
     * BODY
     * ==========================================
     */

    const body =
      (await request.json()) as
        BogCheckoutBody;

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
     * SUPABASE
     * ==========================================
     */

    const supabaseAdmin =
      getSupabaseAdmin();

    /*
     * ==========================================
     * PRODUCT
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
        "BOG product lookup error:",
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
     * ORDER
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
        total,
        payment_currency,
        payment_amount
      `)
      .eq(
        "id",
        orderId
      )
      .maybeSingle();

    if (orderError) {
      console.error(
        "BOG order lookup error:",
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
     * MONEY
     * ==========================================
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

    /*
     * ==========================================
     * BOG TOKEN
     * ==========================================
     */

    const accessToken =
      await getBogAccessToken();

    /*
     * ==========================================
     * CREATE BOG ORDER
     * ==========================================
     */

    const origin =
      request.nextUrl.origin;

    const callbackUrl =
      `${origin}/api/payments/bog/callback`;

    const successUrl =
      `${origin}/store/success` +
      `?provider=bog` +
      `&order=${encodeURIComponent(
        String(orderId)
      )}`;

    const failUrl =
      `${origin}/store/checkout` +
      `?product=${encodeURIComponent(
        product.slug
      )}` +
      `&quantity=${quantity}` +
      `&payment=failed`;

    const description =
      product.design_name
        ? `${product.name} — ${product.design_name}`
        : product.name;

    /*
     * Important:
     * exact merchant payload can differ
     * depending on BOG ecommerce product configuration.
     */

    const payload = {
      callback_url:
        callbackUrl,

      external_order_id:
        String(orderId),

      purchase_units: {
        currency,

        total_amount:
          total,

        basket: [
          {
            quantity,

            unit_price:
              price,

            product_id:
              product.id,

            description:
              description.slice(
                0,
                100
              ),
          },
        ],
      },

      redirect_urls: {
        success:
          successUrl,

        fail:
          failUrl,
      },
    };

    const bogResponse =
      await fetch(
        "https://api.bog.ge/payments/v1/ecommerce/orders",
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${accessToken}`,

            Accept:
              "application/json",

            "Content-Type":
              "application/json",

            "Accept-Language":
              body.language ===
              "en"
                ? "en"
                : "ka",
          },

          body:
            JSON.stringify(
              payload
            ),

          cache:
            "no-store",
        }
      );

    const bogData =
      (await bogResponse.json()) as
        BogOrderResponse;

    if (!bogResponse.ok) {
      console.error(
        "BOG create order error:",
        bogData
      );

      return NextResponse.json(
        {
          error:
            "Could not create Bank of Georgia payment.",

          details:
            bogData,
        },
        {
          status:
            bogResponse.status,
        }
      );
    }

    /*
     * ==========================================
     * REDIRECT URL
     * ==========================================
     */

    const redirectUrl =
      bogData._links
        ?.redirect
        ?.href ||
      bogData.links
        ?.redirect
        ?.href ||
      null;

    if (!redirectUrl) {
      console.error(
        "BOG redirect URL missing:",
        bogData
      );

      return NextResponse.json(
        {
          error:
            "Bank of Georgia payment was created, but redirect URL was not returned.",
        },
        {
          status: 500,
        }
      );
    }

    const bogPaymentId =
      bogData.id ||
      null;

    /*
     * ==========================================
     * SAVE TO ORDER
     * ==========================================
     */

    const {
      error:
        updateError,
    } = await supabaseAdmin
      .from("orders")
      .update({
        payment_provider:
          "bog",

        payment_status:
          "pending",

        payment_id:
          bogPaymentId,

        merchant_payment_id:
          String(orderId),

        payment_currency:
          currency,

        payment_amount:
          total,

        payment_metadata: {
          provider:
            "bog",

          bog_order_id:
            bogPaymentId,

          external_order_id:
            String(orderId),

          product_id:
            product.id,

          product_slug:
            product.slug,

          sku:
            product.sku,

          design_name:
            product.design_name,

          quantity,

          redirect_url:
            redirectUrl,

          bog_response:
            bogData,
        },
      })
      .eq(
        "id",
        orderId
      );

    if (updateError) {
      console.error(
        "BOG order update error:",
        updateError
      );
    }

    /*
     * ==========================================
     * SUCCESS
     * ==========================================
     */

    return NextResponse.json({
      success: true,

      provider:
        "bog",

      orderId,

      bogPaymentId,

      productId:
        product.id,

      productSlug:
        product.slug,

      productName:
        product.name,

      designName:
        product.design_name,

      quantity,

      currency,

      total,

      redirectUrl,
    });
  } catch (error) {
    console.error(
      "BOG checkout error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not create Bank of Georgia payment.",
      },
      {
        status: 500,
      }
    );
  }
}
