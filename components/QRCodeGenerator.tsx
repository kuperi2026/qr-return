"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import QRCode from "qrcode";

type QRType =
  | "item"
  | "emergency";

type Props = {
  tagCode: string;
  type: QRType;

  title?: string;
};

export default function QRCodeGenerator({
  tagCode,
  type,
  title,
}: Props) {
  const canvasRef =
    useRef<HTMLCanvasElement | null>(
      null
    );

  const [error, setError] =
    useState("");

  const cleanTag =
    tagCode
      .trim()
      .toUpperCase();

  const profileUrl =
    type === "emergency"
      ? `https://qr-return.vercel.app/emergency/profile/${encodeURIComponent(
          cleanTag
        )}`
      : `https://qr-return.vercel.app/scan/${encodeURIComponent(
          cleanTag
        )}`;

  useEffect(() => {
    async function generateQR() {
      if (!cleanTag) {
        setError(
          "QR კოდი ვერ შეიქმნა — Tag Code ცარიელია."
        );

        return;
      }

      if (!canvasRef.current) {
        return;
      }

      try {
        setError("");

        await QRCode.toCanvas(
          canvasRef.current,
          profileUrl,
          {
            width: 260,

            margin: 2,

            errorCorrectionLevel:
              "H",

            color: {
              dark: "#10263f",
              light: "#ffffff",
            },
          }
        );
      } catch (err) {
        console.error(err);

        setError(
          "QR კოდის შექმნა ვერ მოხერხდა."
        );
      }
    }

    void generateQR();
  }, [
    cleanTag,
    profileUrl,
  ]);

  function downloadQR() {
    const canvas =
      canvasRef.current;

    if (!canvas) {
      return;
    }

    const image =
      canvas.toDataURL(
        "image/png"
      );

    const link =
      document.createElement("a");

    link.href = image;

    link.download =
      `QR-RETURN-${cleanTag}.png`;

    link.click();
  }

  function printQR() {
    const canvas =
      canvasRef.current;

    if (!canvas) {
      return;
    }

    const image =
      canvas.toDataURL(
        "image/png"
      );

    const printWindow =
      window.open(
        "",
        "_blank",
        "width=600,height=700"
      );

    if (!printWindow) {
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>

      <html>
        <head>
          <title>
            QR RETURN ${cleanTag}
          </title>

          <style>
            body {
              margin: 0;
              min-height: 100vh;

              display: flex;
              align-items: center;
              justify-content: center;

              font-family:
                Arial,
                Helvetica,
                sans-serif;

              background: white;
            }

            .label {
              width: 320px;

              padding: 25px;

              text-align: center;

              border:
                1px solid #dfe6ee;

              border-radius: 18px;
            }

            img {
              width: 260px;
              height: 260px;
            }

            h1 {
              margin:
                14px 0 0;

              color: #17304d;

              font-size: 22px;
            }

            .type {
              margin-top: 5px;

              color: #1266e9;

              font-size: 11px;
              font-weight: 800;

              letter-spacing: 1px;
            }

            .code {
              margin-top: 10px;

              color: #53667b;

              font-size: 14px;
              font-weight: 700;
            }

            p {
              margin:
                10px 0 0;

              color: #7d8998;

              font-size: 11px;
            }
          </style>
        </head>

        <body>
          <div class="label">
            <img
              src="${image}"
              alt="QR RETURN"
            />

            <h1>
              QR RETURN
            </h1>

            <div class="type">
              ${
                type ===
                "emergency"
                  ? "EMERGENCY ID"
                  : "SMART LOST & FOUND"
              }
            </div>

            <div class="code">
              ${cleanTag}
            </div>

            <p>
              Scan to open the
              QR RETURN profile.
            </p>
          </div>

          <script>
            window.onload = () => {
              window.print();
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(
        profileUrl
      );
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <section className="qrGenerator">
      <div className="qrCard">
        <div className="top">
          <div className="logo">
            QR
          </div>

          <div>
            <span className="brand">
              QR RETURN
            </span>

            <span className="type">
              {type ===
              "emergency"
                ? "EMERGENCY ID"
                : "SMART LOST & FOUND"}
            </span>
          </div>
        </div>

        <div className="qrArea">
          {error ? (
            <div className="error">
              {error}
            </div>
          ) : (
            <canvas
              ref={canvasRef}
              className="canvas"
            />
          )}
        </div>

        <div className="info">
          <span>
            TAG CODE
          </span>

          <strong>
            {cleanTag}
          </strong>
        </div>

        {title && (
          <div className="profileTitle">
            {title}
          </div>
        )}

        <p className="description">
          {type ===
          "emergency"
            ? "ამ QR-ის დასკანერებისას გაიხსნება Emergency პროფილი."
            : "ამ QR-ის დასკანერებისას გაიხსნება ნივთის ან ცხოველის საჯარო პროფილი."}
        </p>

        <div className="urlBox">
          <span>
            PROFILE LINK
          </span>

          <p>
            {profileUrl}
          </p>
        </div>

        <div className="actions">
          <button
            type="button"
            onClick={
              downloadQR
            }
            className="primary"
          >
            QR-ის შენახვა
          </button>

          <button
            type="button"
            onClick={
              printQR
            }
          >
            დაბეჭდვა
          </button>

          <button
            type="button"
            onClick={
              copyLink
            }
          >
            ლინკის კოპირება
          </button>
        </div>
      </div>

      <style jsx>{`
        .qrGenerator {
          width: 100%;

          display: flex;
          justify-content: center;
        }

        .qrCard {
          width: 100%;
          max-width: 430px;

          padding: 24px;

          border:
            1px solid #dfe7f0;

          border-radius: 18px;

          background: #ffffff;

          box-shadow:
            0 15px 45px
            rgba(
              28,
              54,
              84,
              0.07
            );
        }

        .top {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo {
          width: 42px;
          height: 42px;

          display: grid;
          place-items: center;

          border-radius: 10px;

          color: #ffffff;

          background:
            #1266e9;

          font-size: 12px;
          font-weight: 900;
        }

        .brand,
        .type {
          display: block;
        }

        .brand {
          color: #19324e;

          font-size: 16px;
          font-weight: 900;
        }

        .type {
          margin-top: 3px;

          color: #1266e9;

          font-size: 10px;
          font-weight: 850;

          letter-spacing: 1px;
        }

        .qrArea {
          min-height: 285px;

          margin-top: 22px;

          display: flex;
          align-items: center;
          justify-content: center;

          border:
            1px solid #e1e8f0;

          border-radius: 16px;

          background:
            #f8fbff;
        }

        .canvas {
          width: 260px !important;
          height: 260px !important;

          display: block;
        }

        .error {
          padding: 20px;

          color: #6d7d8e;

          font-size: 13px;

          text-align: center;
        }

        .info {
          margin-top: 17px;

          text-align: center;
        }

        .info span {
          display: block;

          color: #8b98a6;

          font-size: 11px;
          font-weight: 800;

          letter-spacing: 1px;
        }

        .info strong {
          display: block;

          margin-top: 5px;

          color: #1266e9;

          font-size: 19px;
          font-weight: 900;

          letter-spacing: 1px;
        }

        .profileTitle {
          margin-top: 9px;

          color: #263d57;

          font-size: 16px;
          font-weight: 800;

          text-align: center;
        }

        .description {
          max-width: 350px;

          margin:
            11px auto 0;

          color: #68798b;

          font-size: 13px;
          line-height: 1.55;

          text-align: center;
        }

        .urlBox {
          margin-top: 18px;
          padding: 12px 14px;

          border-radius: 10px;

          background: #f4f7fb;
        }

        .urlBox span {
          color: #8492a2;

          font-size: 10px;
          font-weight: 900;

          letter-spacing: 0.8px;
        }

        .urlBox p {
          margin: 5px 0 0;

          overflow-wrap:
            anywhere;

          color: #41566e;

          font-size: 12px;
          line-height: 1.45;
        }

        .actions {
          margin-top: 16px;

          display: grid;
          grid-template-columns:
            repeat(
              3,
              minmax(0, 1fr)
            );

          gap: 7px;
        }

        .actions button {
          min-height: 42px;

          padding: 0 9px;

          border:
            1px solid #d6e3f5;

          border-radius: 10px;

          color: #1266e9;
          background: #f4f8ff;

          cursor: pointer;

          font-family: inherit;
          font-size: 11px;
          font-weight: 850;
        }

        .actions .primary {
          border-color:
            #1266e9;

          color: #ffffff;
          background:
            #1266e9;
        }

        @media (
          max-width: 500px
        ) {
          .qrCard {
            padding: 18px;

            border-radius: 15px;
          }

          .qrArea {
            min-height: 260px;
          }

          .canvas {
            width:
              230px !important;

            height:
              230px !important;
          }

          .actions {
            grid-template-columns:
              1fr;
          }

          .actions button {
            font-size: 13px;
          }
        }
      `}</style>
    </section>
  );
}
