"use client";

type Language = "ka" | "en";

type Props = {
  language?: Language;

  eyebrowKa?: string;
  eyebrowEn?: string;

  titleKa?: string;
  titleEn?: string;

  missionKa?: string;
  missionEn?: string;

  problemTitleKa?: string;
  problemTitleEn?: string;
  problemTextKa?: string;
  problemTextEn?: string;

  solutionTitleKa?: string;
  solutionTitleEn?: string;
  solutionTextKa?: string;
  solutionTextEn?: string;

  visionTitleKa?: string;
  visionTitleEn?: string;
  visionTextKa?: string;
  visionTextEn?: string;

  background?: string;
};

export default function MissionSection({
  language = "ka",

  eyebrowKa = "ჩვენი მისია",
  eyebrowEn = "OUR MISSION",

  titleKa =
    "დაკარგვა არ უნდა ნიშნავდეს კავშირის დაკარგვას.",

  titleEn =
    "Losing something should not mean losing the connection.",

  missionKa =
    "QR RETURN-ის მისიაა შექმნას მარტივი და ხელმისაწვდომი გზა, რომელიც ადამიანებს ეხმარება დაკარგულ ნივთებთან, შინაურ ცხოველებთან და მნიშვნელოვან საგანგებო ინფორმაციასთან სწრაფად დაკავშირებაში.",

  missionEn =
    "QR RETURN's mission is to create a simple and accessible way for people to reconnect with lost belongings, pets, and important emergency information.",

  problemTitleKa = "პრობლემა",
  problemTitleEn = "The Problem",

  problemTextKa =
    "დაკარგული ნივთის ან შინაური ცხოველის პოვნისას მპოვნელს ხშირად არ აქვს მარტივი და უსაფრთხო გზა მფლობელთან დასაკავშირებლად.",

  problemTextEn =
    "When someone finds a lost item or pet, there is often no simple and privacy-conscious way to connect with the owner.",

  solutionTitleKa = "ჩვენი მიდგომა",
  solutionTitleEn = "Our Approach",

  solutionTextKa =
    "ერთი QR კოდი ქმნის პირდაპირ გზას მპოვნელიდან შესაბამის პროფილამდე — აპის ჩამოტვირთვის გარეშე და მფლობელის მიერ კონტროლირებადი ინფორმაციის გამოყენებით.",

  solutionTextEn =
    "A single QR code creates a direct path from the finder to the relevant profile, without requiring an app and with information controlled by the owner.",

  visionTitleKa = "ხედვა",
  visionTitleEn = "The Vision",

  visionTextKa =
    "ჩვენ გვინდა QR RETURN გახდეს ერთი მოქნილი სისტემა, სადაც Lost & Found, Emergency ID, Live Chat, უსაფრთხო კონტაქტი და QR პროდუქტები ერთ სივრცეში მუშაობს.",

  visionTextEn =
    "Our vision is for QR RETURN to become one flexible system where Lost & Found, Emergency ID, Live Chat, secure contact, and QR products work together.",

  background = "#202b37",
}: Props) {
  const ka = language === "ka";

  const items = [
    {
      number: "01",
      title: ka
        ? problemTitleKa
        : problemTitleEn,
      text: ka
        ? problemTextKa
        : problemTextEn,
    },
    {
      number: "02",
      title: ka
        ? solutionTitleKa
        : solutionTitleEn,
      text: ka
        ? solutionTextKa
        : solutionTextEn,
    },
    {
      number: "03",
      title: ka
        ? visionTitleKa
        : visionTitleEn,
      text: ka
        ? visionTextKa
        : visionTextEn,
    },
  ];

  return (
    <section
      id="mission"
      className="missionSection"
      style={{ background }}
    >
      <div className="shell">
        <div className="top">
          <div className="copy">
            <span className="eyebrow">
              {ka
                ? eyebrowKa
                : eyebrowEn}
            </span>

            <h2>
              {ka
                ? titleKa
                : titleEn}
            </h2>

            <p>
              {ka
                ? missionKa
                : missionEn}
            </p>
          </div>

          <div className="mark">
            <div className="qr">
              <QRIcon />
            </div>

            <span>
              QR RETURN
            </span>
          </div>
        </div>

        <div className="grid">
          {items.map((item) => (
            <article
              key={item.number}
              className="card"
            >
              <span className="number">
                {item.number}
              </span>

              <strong>
                {item.title}
              </strong>

              <p>
                {item.text}
              </p>
            </article>
          ))}
        </div>
      </div>

      <style jsx>{`
        .missionSection {
          width: 100%;
          padding: 96px 0;

          color: white;
        }

        .shell {
          width:
            calc(100% - 56px);

          max-width: 1180px;

          margin: 0 auto;
        }

        .top {
          display: grid;

          grid-template-columns:
            minmax(0, 1fr)
            auto;

          align-items: end;

          gap: 60px;
        }

        .copy {
          max-width: 760px;
        }

        .eyebrow {
          color: #df8c90;

          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1.6px;
        }

        h2 {
          margin: 11px 0 0;

          color: white;

          font-size:
            clamp(
              37px,
              4vw,
              51px
            );

          font-weight: 650;
          line-height: 1.05;
          letter-spacing: -2.2px;
        }

        .copy p {
          max-width: 690px;

          margin: 18px 0 0;

          color: #a3acb6;

          font-size: 11px;
          line-height: 1.8;
        }

        .mark {
          min-width: 125px;

          padding-bottom: 5px;

          display: flex;
          flex-direction: column;
          align-items: center;

          gap: 9px;

          color: #77828e;
        }

        .qr {
          width: 58px;
          height: 58px;

          display: grid;
          place-items: center;

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.12
            );

          border-radius: 14px;

          color: #df8c90;

          background:
            rgba(
              255,
              255,
              255,
              0.045
            );
        }

        .qr :global(svg) {
          width: 28px;
          height: 28px;
        }

        .mark > span {
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .grid {
          margin-top: 55px;

          display: grid;

          grid-template-columns:
            repeat(
              3,
              minmax(0, 1fr)
            );

          border-top:
            1px solid
            rgba(
              255,
              255,
              255,
              0.11
            );

          border-bottom:
            1px solid
            rgba(
              255,
              255,
              255,
              0.11
            );
        }

        .card {
          min-height: 205px;

          padding: 24px;

          border-right:
            1px solid
            rgba(
              255,
              255,
              255,
              0.1
            );
        }

        .card:last-child {
          border-right: 0;
        }

        .number {
          color: #65717d;

          font-size: 7px;
          font-weight: 900;
        }

        .card strong {
          display: block;

          margin-top: 36px;

          color: white;

          font-size: 14px;
          font-weight: 800;
        }

        .card p {
          margin: 9px 0 0;

          color: #99a3ae;

          font-size: 9px;
          line-height: 1.7;
        }

        @media (
          max-width: 850px
        ) {
          .top {
            grid-template-columns:
              1fr;
          }

          .mark {
            display: none;
          }

          .grid {
            grid-template-columns:
              1fr;
          }

          .card {
            min-height: auto;

            border-right: 0;

            border-bottom:
              1px solid
              rgba(
                255,
                255,
                255,
                0.1
              );
          }

          .card:last-child {
            border-bottom: 0;
          }
        }

        @media (
          max-width: 650px
        ) {
          .missionSection {
            padding: 68px 0;
          }

          .shell {
            width:
              calc(100% - 28px);
          }
        }
      `}</style>
    </section>
  );
}

function QRIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
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

      <path d="M14 14h3v3h3v4h-6z" />
    </svg>
  );
}
