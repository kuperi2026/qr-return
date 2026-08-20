"use client";

type Props = {
  language?: "ka" | "en";
  title?: string;
  description?: string;
  videoUrl?: string;
  background?: string;
  paddingTop?: number;
  paddingBottom?: number;
  titleSize?: number;
  bodySize?: number;
};

export default function VideoSection({
  language = "ka",
  title,
  description,
  videoUrl = "",
  background = "#fbfbf9",
  paddingTop = 90,
  paddingBottom = 90,
  titleSize = 43,
  bodySize = 12,
}: Props) {
  const ka = language === "ka";

  const finalTitle =
    title ||
    (ka
      ? "ერთი სკანი. პირდაპირი კავშირი."
      : "One scan. A direct connection.");

  const finalDescription =
    description ||
    (ka
      ? "აქ განთავსდება მოკლე რეალური ვიდეო — როგორ ხედავს მპოვნელი QR RETURN-ს, როგორ ასკანერებს და როგორ იწყებს მფლობელთან დაკავშირებას."
      : "See how a finder scans QR RETURN and connects with the owner.");

  const embedUrl = getVideoEmbedUrl(videoUrl);

  return (
    <section
      id="video"
      className="videoSection"
      style={{
        background,
        paddingTop,
        paddingBottom,
      }}
    >
      <div className="shell">
        <div className="layout">
          <div className="copy">
            <span className="eyebrow">
              QR RETURN IN ACTION
            </span>

            <h2
              style={{
                fontSize: `${titleSize}px`,
              }}
            >
              {finalTitle}
            </h2>

            <p
              style={{
                fontSize: `${bodySize}px`,
              }}
            >
              {finalDescription}
            </p>
          </div>

          <div className="videoCard">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title="QR RETURN Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : videoUrl ? (
              <video
                src={videoUrl}
                controls
              />
            ) : (
              <>
                <div className="brand">
                  <QRIcon />
                  <span>
                    QR RETURN PRODUCT DEMO
                  </span>
                </div>

                <div className="play">
                  <PlayIcon />
                </div>

                <span className="soon">
                  {ka
                    ? "ვიდეო დაემატება"
                    : "Video coming soon"}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .videoSection {
          width: 100%;
        }

        .shell {
          width: calc(100% - 56px);
          max-width: 1180px;
          margin: 0 auto;
        }

        .layout {
          display: grid;
          grid-template-columns:
            0.75fr 1.25fr;

          align-items: center;
          gap: 65px;
        }

        .copy {
          min-width: 0;
        }

        .eyebrow {
          color: #c84a50;

          font-size: 8px;
          font-weight: 900;
          letter-spacing: 1.4px;
        }

        h2 {
          margin: 11px 0 0;

          color: #18222c;

          line-height: 1.07;
          letter-spacing: -2px;
          font-weight: 670;
        }

        p {
          margin: 15px 0 0;

          color: #6d7782;

          line-height: 1.72;
        }

        .videoCard {
          min-height: 340px;

          position: relative;

          overflow: hidden;

          display: grid;
          place-items: center;

          border: 1px solid #e0e4e7;
          border-radius: 24px;

          background:
            radial-gradient(
              circle at 80% 10%,
              rgba(50, 89, 140, 0.055),
              transparent 28%
            ),
            linear-gradient(
              135deg,
              #eef1f3,
              #fafaf8
            );
        }

        .videoCard iframe,
        .videoCard video {
          width: 100%;
          height: 340px;

          border: 0;

          object-fit: cover;
        }

        .brand {
          position: absolute;

          top: 20px;
          left: 20px;

          display: flex;
          align-items: center;

          gap: 8px;

          color: #59646f;

          font-size: 7px;
          font-weight: 900;
        }

        .brand :global(svg) {
          width: 18px;
        }

        .play {
          width: 64px;
          height: 64px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          color: white;
          background: #202b37;

          box-shadow:
            0 14px 30px
            rgba(
              32,
              43,
              55,
              0.15
            );
        }

        .play :global(svg) {
          width: 22px;
        }

        .soon {
          position: absolute;

          bottom: 18px;

          color: #8b949e;

          font-size: 8px;
        }

        @media (max-width: 900px) {
          .layout {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 650px) {
          .shell {
            width: calc(100% - 28px);
          }

          .videoCard {
            min-height: 270px;
          }

          .videoCard iframe,
          .videoCard video {
            height: 270px;
          }
        }
      `}</style>
    </section>
  );
}

function getVideoEmbedUrl(
  url: string
) {
  if (!url) return "";

  try {
    const parsed = new URL(url);

    if (
      parsed.hostname.includes(
        "youtube.com"
      )
    ) {
      const id =
        parsed.searchParams.get("v");

      if (id) {
        return `https://www.youtube.com/embed/${id}`;
      }

      if (
        parsed.pathname.startsWith(
          "/embed/"
        )
      ) {
        return url;
      }
    }

    if (
      parsed.hostname === "youtu.be"
    ) {
      const id =
        parsed.pathname.replace(
          "/",
          ""
        );

      if (id) {
        return `https://www.youtube.com/embed/${id}`;
      }
    }

    if (
      parsed.hostname.includes(
        "vimeo.com"
      )
    ) {
      const id =
        parsed.pathname
          .split("/")
          .filter(Boolean)[0];

      if (id) {
        return `https://player.vimeo.com/video/${id}`;
      }
    }

    return "";
  } catch {
    return "";
  }
}

function QRIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
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

function PlayIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="m9 6 9 6-9 6z" />
    </svg>
  );
}
