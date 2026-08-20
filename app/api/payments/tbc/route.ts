import {
  NextRequest,
  NextResponse,
} from "next/server";

type ProductId =
  | "tag"
  | "sticker";

type TbcCheckoutBody = {
  productId?: ProductId;
  quantity?: number;
  language?: "KA" | "EN";
  orderId?: string;
};

type TbcTokenResponse = {
  access_token?: string;
  token_type?: string;
  expires_in?: number;
};

type TbcPaymentLink = {
  uri?: string;
  method?: string;
  rel?: string;
};

type TbcPaymentResponse = {
  payId?: string;
  status?: string;
  currency?: string;
  amount?: number;

  links?: TbcPaymentLink[];

  transactionId?: string | null;

  httpStatusCode?: number;

  developerMessage?: string | null;
  userMessage?: string | null;
};

const PRODUCTS = {
  tag: {
    name: "QR Tag",
    priceGel: 27,
    sku: "QR-TAG-001",
  },

  sticker: {
    name: "QR Sticker",
    priceGel: 14,
    sku: "QR-STICKER-001",
  },
} satisfies Record<
  ProductId,
  {
    name: string;
    priceGel: number;
    sku: string;
  }
>;

function makeOrderId() {
  const time =
    Date.now().toString();

  const random =
    Math.random()
      .toString(36)
      .slice(2, 8)
      .toUpperCase();

  return `QR-${time}-${random}`;
}

export async function POST(
  request: NextRequest
) {
  try {
    /*
     * --------------------------------
     * TBC ENVIRONMENT VARIABLES
     * --------------------------------
     */

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
      return NextResponse.json(
        {
          error:
            "TBC payment credentials are not configured.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * --------------------------------
     * REQUEST BODY
     * --------------------------------
     */

    const body =
      (await request.json()) as TbcCheckoutBody;

    const productId: ProductId =
      body.productId ===
      "sticker"
        ? "sticker"
        : "tag";

    const product =
      PRODUCTS[productId];

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
     * TOTAL IN GEL
     * --------------------------------
     */

    const total =
      Number(
        (
          product.priceGel *
          quantity
        ).toFixed(2)
      );

    /*
     * --------------------------------
     * LANGUAGE
     * --------------------------------
     */

    const language =
      body.language === "EN"
        ? "EN"
        : "KA";

    /*
     * --------------------------------
     * ORDER ID
     * --------------------------------
     */

    const merchantPaymentId =
      body.orderId?.trim() ||
      makeOrderId();

    /*
     * --------------------------------
     * STEP 1
     * GET TBC ACCESS TOKEN
     * --------------------------------
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

          cache: "no-store",
        }
      );

    const tokenData =
      (await tokenResponse.json()) as
        TbcTokenResponse & {
          title?: string;
          detail?: string;
          message?: string;
        };

    if (
      !tokenResponse.ok
    ) {
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
      console.error(
        "TBC token missing:",
        tokenData
      );

      return NextResponse.json(
        {
          error:
            "TBC did not return an access token.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * --------------------------------
     * STEP 2
     * CREATE PAYMENT
     * --------------------------------
     */

    const origin =
      request.nextUrl.origin;

    const returnUrl =
      `${origin}/store/success` +
      `?provider=tbc` +
      `&order=${encodeURIComponent(
        merchantPaymentId
      )}`;

    const callbackUrl =
      `${origin}/api/payments/tbc/callback`;

    const paymentPayload = {
      amount: {
        currency: "GEL",
        total,
      },

      returnurl:
        returnUrl,

      callbackUrl,

      preAuth: false,

      language,

      merchantPaymentId,

      skipInfoMessage:
        false,

      saveCard:
        false,

      description:
        product.name.slice(
          0,
          30
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

          cache: "no-store",
        }
      );

    const paymentData =
      (await paymentResponse.json()) as
        TbcPaymentResponse & {
          title?: string;
          detail?: string;
          message?: string;
        };

    if (
      !paymentResponse.ok
    ) {
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
     * --------------------------------
     * FIND APPROVAL URL
     * --------------------------------
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
            "TBC payment was created, but approval URL was not returned.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * --------------------------------
     * SUCCESS
     * --------------------------------
     */

    return NextResponse.json({
      success: true,

      provider: "tbc",

      payId:
        paymentData.payId,

      status:
        paymentData.status,

      merchantPaymentId,

      productId,

      productName:
        product.name,

      sku:
        product.sku,

      quantity,

      currency: "GEL",

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
