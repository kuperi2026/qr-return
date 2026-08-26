type PageProps = {
  params: {
    code: string;
  };
};

export default function QRFinderPage({
  params,
}: PageProps) {
  const code = params.code;

  return (
    <main className="page">
      <section className="card">
        <div className="logo">
          <QRIcon />
        </div>

        <span className="brand">
          QR RETURN
        </span>

        <span className="status">
          QR FOUND
        </span>

        <h1>
          QR კოდი წარმატებით დასკანირდა
        </h1>

        <p className="description">
          თქვენ იპოვეთ QR RETURN-ით
          დაცული ნივთი ან ცხოველი.
          მფლობელთან დაკავშირებისთვის
          გამოიყენეთ ქვემოთ მოცემული
          ინფორმაცია.
        </p>

        <div className="codeBox">
          <span>TAG CODE</span>
          <strong>{code}</strong>
        </div>

        <div className="notice">
          ამ ეტაპზე ეს არის სატესტო QR.
          შემდეგ ეტაპზე ამ კოდს
          Supabase-ში შესაბამის პროფილს
          დავუკავშირებთ.
        </div>

        <button
          type="button"
          className="contactButton"
        >
          მფლობელთან დაკავშირება
        </button>

        <p className="privacy">
          QR RETURN არ აჩვენებს
          ინფორმაციას, რომლის გაზიარებაც
          მფლობელს არ აქვს არჩეული.
        </p>
      </section>

      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
        }

        .page {
          min-height: 100vh;

          padding: 32px 18px;

          display: flex;
          align-items: center;
          justify-content: center;

          font-family:
            Arial,
            Helvetica,
            sans-serif;

          background:
            #f4f8fd;
        }

        .card {
          width: 100%;
          max-width: 430px;

          padding: 34px 28px;

          text-align: center;

          border:
            1px solid #e1e9f2;

          border-radius: 22px;

          background: #ffffff;

          box-shadow:
            0 20px 60px
            rgba(19, 54, 92, 0.08);
        }

        .logo {
          width: 62px;
          height: 62px;

          margin: 0 auto 13px;

          display: grid;
          place-items: center;

          border-radius: 17px;

          color: #ffffff;
          background: #1266e9;
        }

        .brand {
          display: block;

          color: #17304d;

          font-size: 13px;
          font-weight: 900;

          letter-spacing: 1px;
        }

        .status {
          display: inline-block;

          margin-top: 20px;
          padding: 7px 11px;

          border-radius: 30px;

          color: #1266e9;
          background: #edf5ff;

          font-size: 9px;
          font-weight: 900;

          letter-spacing: 1px;
        }

        h1 {
          margin:
            15px auto 0;

          max-width: 330px;

          color: #172b43;

          font-size: 25px;
          line-height: 1.2;

          letter-spacing: -0.5px;
        }

        .description {
          margin:
            13px auto 0;

          max-width: 340px;

          color: #6e7d8e;

          font-size: 13px;
          line-height: 1.65;
        }

        .codeBox {
          margin-top: 24px;
          padding: 16px;

          border:
            1px solid #dce7f4;

          border-radius: 13px;

          background: #f8fbff;
        }

        .codeBox span,
        .codeBox strong {
          display: block;
        }

        .codeBox span {
          color: #8997a7;

          font-size: 8px;
          font-weight: 900;

          letter-spacing: 1.3px;
        }

        .codeBox strong {
          margin-top: 5px;

          color: #1266e9;

          font-size: 18px;
          letter-spacing: 1px;
        }

        .notice {
          margin-top: 13px;
          padding: 13px 15px;

          border-radius: 11px;

          color: #66778a;
          background: #f5f7fa;

          font-size: 10px;
          line-height: 1.6;
        }

        .contactButton {
          width: 100%;
          min-height: 48px;

          margin-top: 18px;

          border: 0;
          border-radius: 12px;

          color: #ffffff;
          background: #1266e9;

          cursor: pointer;

          font-size: 12px;
          font-weight: 800;
        }

        .privacy {
          margin:
            17px auto 0;

          max-width: 320px;

          color: #9aa6b3;

          font-size: 9px;
          line-height: 1.55;
        }
      `}</style>
    </main>
  );
}

function QRIcon() {
  return (
    <svg
      width="31"
      height="31"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <rect
        x="3"
        y="3"
        width="6"
        height="6"
        rx="1"
      />

      <rect
        x="15"
        y="3"
        width="6"
        height="6"
        rx="1"
      />

      <rect
        x="3"
        y="15"
        width="6"
        height="6"
        rx="1"
      />

      <path d="M14 14h3v3h4" />
      <path d="M14 21v-4" />
      <path d="M18 18h3v3" />
    </svg>
  );
}
