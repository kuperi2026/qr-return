import {
  NextRequest,
  NextResponse,
} from "next/server";

type TbcCallbackBody = {
  PaymentId?: string;
  payId?: string;
  status?: string;
  merchantPaymentId?: string;
  transactionId?: string;
};

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

  currency?: string;
  amount?: number;

  merchantPaymentId?: string;

  transactionId?: string | null;

  title?: string;
  detail?: string;
  message?: string;
  developerMessage?: string;
  userMessage?: string;
};

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

  const body =
    new URLSearchParams();

  body.set(
    "client_id",
    clientId
  );

  body.set(
    "client_secret",
    clientSecret
  );

  const response =
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
          body.toString(),

        cache:
          "no-store",
      }
    );

  const data =
    (await response.json()) as
      TbcTokenResponse;

  if (!response.ok) {
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
    accessToken:
      data.access_token,

    apiKey,
  };
}

async function getPaymentDetails(
  payId: string
) {
  const {
    accessToken,
    apiKey,
  } =
    await getTbcAccessToken();

  const response =
    await fetch(
      `https://api.tbcbank.ge/v1/tpay/payments/${encodeURIComponent(
        payId
      )}`,
      {
        method: "GET",

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
    throw new Error(
      data.userMessage ||
        data.detail ||
        data.message ||
        data.developerMessage ||
        data.title ||
        "Could not read TBC payment details."
    );
  }

  return data;
}

export async function POST(
  request: NextRequest
) {
  try {
    let body:
      TbcCallbackBody = {};

    try {
      body =
        (await request.json()) as
          TbcCallbackBody;
    } catch {
      const text =
        await request.text();

      console.log(
        "TBC callback raw body:",
        text
      );
    }

    const payId =
      body.PaymentId ||
      body.payId ||
      "";

    if (!payId) {
      /*
       * Callback ფორმატი შეიძლება
       * merchant configuration-ის მიხედვით
       * განსხვავდებოდეს.
       *
       * HTTP 200-ს მაინც ვაბრუნებთ,
       * რომ provider-ს endless retries
       * არ გავუჩინოთ.
       */

      console.warn(
        "TBC callback received without payId:",
        body
      );

      return NextResponse.json({
        received: true,
        verified: false,
        reason:
          "payId was not provided",
      });
    }

    /*
     * არ ვენდობით მხოლოდ callback-ში
     * გამოგზავნილ status-ს.
     *
     * TBC API-დან ხელახლა ვკითხულობთ
     * payment details-ს.
     */

    const payment =
      await getPaymentDetails(
        payId
      );

    console.log(
      "TBC verified payment:",
      payment
    );

    const status =
      (
        payment.status ||
        ""
      ).toLowerCase();

    const paid =
      status ===
        "succeeded" ||
      status ===
        "success" ||
      status ===
        "completed" ||
      status ===
        "paid";

    /*
     * შემდეგ ეტაპზე აქ Supabase orders
     * table-ს განვაახლებთ:
     *
     * payment_provider = "tbc"
     * payment_id = payId
     * payment_status = payment.status
     * status = paid ? "paid" : ...
     *
     * ჯერ DB-ს არ ვეხებით,
     * სანამ orders table-ის არსებული
     * columns ზუსტად არ გადავამოწმეთ.
     */

    return NextResponse.json({
      received: true,
      verified: true,

      payId:
        payment.payId ||
        payId,

      merchantPaymentId:
        payment.merchantPaymentId ||
        body.merchantPaymentId ||
        null,

      transactionId:
        payment.transactionId ||
        body.transactionId ||
        null,

      status:
        payment.status ||
        body.status ||
        null,

      paid,
    });
  } catch (error) {
    console.error(
      "TBC callback error:",
      error
    );

    /*
     * აქ 500-ს ვაბრუნებთ,
     * რადგან verification რეალურად
     * ვერ დასრულდა.
     */

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
