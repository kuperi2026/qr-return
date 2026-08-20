"use client";

type Language = "ka" | "en";

type Props = {
  language?: Language;

  name?: string;

  roleKa?: string;
  roleEn?: string;

  titleKa?: string;
  titleEn?: string;

  bioKa?: string;
  bioEn?: string;

  image?: string;

  locationKa?: string;
  locationEn?: string;

  linkedin?: string;
};

export default function FounderSection({
  language = "ka",

  name = "Nino Kuprava",

  roleKa = "დამფუძნებელი და CEO",
  roleEn = "Founder & CEO",

  titleKa = "QR RETURN-ის დამფუძნებელი",
  titleEn = "Founder of QR RETURN",

  bioKa =
    "QR RETURN შეიქმნა ერთი მარტივი იდეით — დაკარგული ნივთის, შინაური ცხოველის ან მნიშვნელოვანი ინფორმაციის დაბრუნება მაქსიმალურად მარტივი და სწრაფი უნდა იყოს. პლატფორმა აერთიანებს QR ტექნოლოგიას, Live Chat-ს, კონფიდენციალურობის კონტროლს და Emergency ID ფუნქციებს ერთ სისტემაში.",

  bioEn =
    "QR RETURN was created around a simple idea: reconnecting people with lost belongings, pets, or important information should be fast and simple. The platform brings QR technology, Live Chat, privacy controls, and Emergency ID features together in one system.",

  image = "",

  locationKa = "აშშ / საქართველო",
  locationEn = "USA / Georgia",

  linkedin = "",
}: Props) {
  const ka = language === "ka";

  return (
    <section
      id="founder"
      className="founderSection"
    >
      <div className="shell">
        <div className="layout">
          <div className="photoSide">
            <div className="photoCard">
              {image ? (
                <img
                  src={image}
                  alt={name}
                />
              ) : (
                <div className="placeholder">
                  <PersonIcon />

                  <span>
                    {ka
                      ? "Founder photo"
                      : "Founder photo"}
                  </span>
                </div>
              )}

              <div className="badge">
                FOUNDER
              </div>
            </div>
          </div>

          <div className="content">
            <span className="eyebrow">
              QR RETURN STORY
            </span>

            <h2>
              {ka
                ? titleKa
                : titleEn}
            </h2>

            <div className="identity">
              <strong>
                {name}
              </strong>

              <span>
                {ka
                  ? roleKa
                  : roleEn}
              </span>
            </div>

            <p className="bio">
              {ka ? bioKa : bioEn}
            </p>

            <div className="meta">
              <div>
                <span>
                  {ka
                    ? "როლი"
                    : "Role"}
                </span>

                <strong>
                  {ka
                    ? roleKa
                    : roleEn}
                </strong>
              </div>

              <div>
                <span>
                  {ka
                    ? "ლოკაცია"
                    : "Location"}
                </span>

                <strong>
                  {ka
                    ? locationKa
                    : locationEn}
                </strong>
              </div>
            </div>

            {linkedin && (
              <a
                href={linkedin}
                target="_blank"
                rel="noreferrer"
                className="linkedin"
              >
                LinkedIn ↗
              </a>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .founderSection {
          width: 100%;
          padding: 92px 0;

          background: #f7f8f6;
        }

        .shell {
          width:
            calc(100% - 56px);

          max-width: 1180px;

          margin: 0 auto;
        }

        .layout {
          display: grid;

          grid-template-columns:
            minmax(330px, 0.8fr)
            minmax(0, 1.2fr);

          align-items: center;

          gap: 70px;
        }

        .photoSide {
          min-width: 0;
        }

        .photoCard {
          width: 100%;
          max-width: 420px;

          aspect-ratio: 4 / 5;

          position: relative;

          overflow: hidden;

          border-radius: 24px;

          background:
            linear-gradient(
              145deg,
              #e8ecef,
              #f8f8f6
            );

          box-shadow:
            0 20px 45px
            rgba(
              32,
              43,
              55,
              0.08
            );
        }

        .photoCard img {
          width: 100%;
          height: 100%;

          object-fit: cover;
        }

        .placeholder {
          width: 100%;
          height: 100%;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          gap: 10px;

          color: #a2abb4;
        }

        .placeholder
          :global(svg) {
          width: 62px;
          height: 62px;
        }

        .placeholder span {
          font-size: 9px;
          font-weight: 800;
        }

        .badge {
          position: absolute;

          left: 18px;
          bottom: 18px;

          padding: 7px 10px;

          border-radius: 999px;

          color: white;
          background:
            rgba(
              32,
              43,
              55,
              0.9
            );

          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .content {
          max-width: 610px;
        }

        .eyebrow {
          color: #c84a50;

          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        h2 {
          margin: 10px 0 0;

          color: #202b37;

          font-size:
            clamp(
              36px,
              4vw,
              48px
            );

          font-weight: 680;
          line-height: 1.06;
          letter-spacing: -2px;
        }

        .identity {
          margin-top: 22px;
        }

        .identity strong,
        .identity span {
          display: block;
        }

        .identity strong {
          color: #303b46;

          font-size: 17px;
          font-weight: 800;
        }

        .identity span {
          margin-top: 4px;

          color: #c84a50;

          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.6px;
        }

        .bio {
          margin: 20px 0 0;

          color: #6f7a85;

          font-size: 11px;
          line-height: 1.8;
        }

        .meta {
          margin-top: 27px;

          padding-top: 20px;

          display: grid;
          grid-template-columns:
            repeat(
              2,
              minmax(0, 1fr)
            );

          gap: 18px;

          border-top:
            1px solid #dce1e4;
        }

        .meta span,
        .meta strong {
          display: block;
        }

        .meta span {
          color: #9aa2aa;

          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.6px;
        }

        .meta strong {
          margin-top: 5px;

          color: #44505b;

          font-size: 10px;
          font-weight: 800;
        }

        .linkedin {
          display: inline-block;

          margin-top: 24px;

          color: #225fc7;

          font-size: 9px;
          font-weight: 850;

          text-decoration: none;
        }

        @media (
          max-width: 900px
        ) {
          .layout {
            grid-template-columns:
              1fr;

            gap: 40px;
          }

          .photoCard {
            max-width: 360px;
          }
        }

        @media (
          max-width: 650px
        ) {
          .founderSection {
            padding: 65px 0;
          }

          .shell {
            width:
              calc(100% - 28px);
          }

          .photoCard {
            max-width: 100%;
          }

          .meta {
            grid-template-columns:
              1fr;
          }
        }
      `}</style>
    </section>
  );
}

function PersonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle
        cx="12"
        cy="8"
        r="4"
      />

      <path d="M4.5 21c.8-4.1 3.3-6.3 7.5-6.3s6.7 2.2 7.5 6.3" />
    </svg>
  );
}
