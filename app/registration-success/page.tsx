const PRODUCT_META: Record<
  string,
  {
    label: string;
    emoji: string;
  }
> = {
  dog: {
    label: "ძაღლი",
    emoji: "🐶",
  },

  cat: {
    label: "კატა",
    emoji: "🐱",
  },

  keys: {
    label: "გასაღები",
    emoji: "🔑",
  },

  wallet: {
    label: "საფულე",
    emoji: "👛",
  },

  bag: {
    label: "ჩანთა",
    emoji: "👜",
  },

  suitcase: {
    label: "ჩემოდანი",
    emoji: "🧳",
  },
};

type RegistrationSuccessPageProps = {
  searchParams?: {
    type?: string;
    tag?: string;
  };
};

export default function RegistrationSuccessPage({
  searchParams,
}: RegistrationSuccessPageProps) {
  const type =
    searchParams?.type || "";

  const tagCode =
    searchParams?.tag || "";

  const meta =
    PRODUCT_META[type] || {
      label: "პროფილი",
      emoji: "QR",
    };

  return (
    <>
      <main className="page">
        <section className="card">
          <div className="successIcon">
            ✓
          </div>

          <span className="eyebrow">
            REGISTRATION COMPLETE
          </span>

          <h1>
            პროფილი წარმატებით შეიქმნა
          </h1>

          <p className="intro">
            {meta.emoji}{" "}
            <strong>
              {meta.label}
            </strong>{" "}
            უკვე დაკავშირებულია თქვენს
            QR RETURN ანგარიშთან.
          </p>

          {tagCode && (
            <div className="qrBox">
              <span>
                QR / TAG CODE
              </span>

              <strong>
                {tagCode}
              </strong>
            </div>
          )}

          <div className="info">
            <strong>
              რა შეგიძლიათ გააკეთოთ ახლა?
            </strong>

            <p>
              ნახეთ თქვენი არსებული პროფილები
              ან დაამატეთ კიდევ ერთი QR პროფილი
              იმავე ანგარიშზე.
            </p>
          </div>

          <div className="actions">
            <a
              href="/my-profiles"
              className="primary"
            >
              ჩემი პროფილების ნახვა
            </a>

            <a
              href="/register"
              className="secondary"
            >
              + ახალი პროფილის დამატება
            </a>
          </div>

          <a
            href="/"
            className="homeLink"
          >
            მთავარ გვერდზე დაბრუნება
          </a>
        </section>
      </main>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;

          padding: 30px;

          display: grid;
          place-items: center;

          background:
            radial-gradient(
              circle at 100% 0%,
              rgba(18, 102, 233, 0.08),
              transparent 28%
            ),
            linear-gradient(
              180deg,
              #ffffff,
              #f5f9ff
            );
        }

        .card {
          width: 100%;
          max-width: 560px;

          padding: 42px 34px;

          text-align: center;

          border: 1px solid #dce6f1;
          border-radius: 20px;

          background: #ffffff;

          box-shadow:
            0 18px 45px
            rgba(30, 70, 120, 0.07);
        }

        .successIcon {
          width: 64px;
          height: 64px;

          margin: auto;

          display: grid;
          place-items: center;

          border-radius: 18px;

          background: #1266e9;

          color: #ffffff;

          font-size: 22px;
          font-weight: 950;
        }

        .eyebrow {
          display: block;

          margin-top: 22px;

          color: #1266e9;

          font-size: 7px;
          font-weight: 900;

          letter-spacing: 1.4px;
        }

        h1 {
          margin: 9px 0 0;

          color: #213a54;

          font-size: 29px;

          line-height: 1.15;
        }

        .intro {
          max-width: 430px;

          margin: 12px auto 0;

          color: #7b8a9b;

          font-size: 10px;

          line-height: 1.65;
        }

        .intro strong {
          color: #1266e9;
        }

        .qrBox {
          margin-top: 22px;

          padding: 15px;

          border: 1px solid #cfe0f6;
          border-radius: 12px;

          background: #f7faff;
        }

        .qrBox span,
        .qrBox strong {
          display: block;
        }

        .qrBox span {
          color: #8e9baa;

          font-size: 7px;
          font-weight: 900;

          letter-spacing: 1px;
        }

        .qrBox strong {
          margin-top: 6px;

          color: #34506d;

          font-size: 12px;

          word-break: break-all;
        }

        .info {
          margin-top: 18px;

          padding: 16px;

          border-radius: 12px;

          background: #fafcff;
        }

        .info strong {
          display: block;

          color: #405972;

          font-size: 10px;
        }

        .info p {
          margin: 6px 0 0;

          color: #8090a0;

          font-size: 8px;

          line-height: 1.55;
        }

        .actions {
          margin-top: 22px;

          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 9px;
        }

        .actions a {
          min-height: 48px;

          padding: 0 15px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 11px;

          font-size: 9px;
          font-weight: 900;

          text-decoration: none;
        }

        .primary {
          background: #1266e9;

          color: #ffffff;

          box-shadow:
            0 10px 22px
            rgba(18, 102, 233, 0.17);
        }

        .secondary {
          border: 1px solid #cbd9e8;

          background: #ffffff;

          color: #536c85;
        }

        .homeLink {
          display: inline-block;

          margin-top: 20px;

          color: #8593a2;

          font-size: 8px;

          font-weight: 800;

          text-decoration: none;
        }

        @media (max-width: 550px) {
          .page {
            padding: 16px;
          }

          .card {
            padding: 34px 20px;
          }

          h1 {
            font-size: 25px;
          }

          .actions {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
