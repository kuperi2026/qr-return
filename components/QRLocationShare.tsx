"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  formatLocationAccuracy,
  getPreciseLocation,
  LocationAccuracyError,
} from "@/lib/geolocation";

type Props = {
  itemId: string;
  tagCode: string;
  language?: "ka" | "en";
};

export default function QRLocationShare({
  itemId,
  tagCode,
  language = "ka",
}: Props) {
  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  const ka =
    language === "ka";

  async function shareLocation() {
    setMessage("");
    setSuccess(false);

    if (!navigator.geolocation) {
      setMessage(
        ka
          ? "თქვენი მოწყობილობა ლოკაციის გაზიარებას არ უჭერს მხარს."
          : "Your device does not support location sharing."
      );
      return;
    }

    setLoading(true);

    try {
      const position =
        await getPreciseLocation();

      const {
        latitude,
        longitude,
        accuracy,
      } = position.coords;

      const { error } = await supabase.rpc(
        "share_qr_location",
        {
          p_item_id: itemId,
          p_tag_code: tagCode,
          p_latitude: latitude,
          p_longitude: longitude,
          p_accuracy: accuracy,
        }
      );

      if (error) {
        throw error;
      }

      setSuccess(true);
      setMessage(
        ka
          ? `✓ ზუსტი ლოკაცია გაიგზავნა (სიზუსტე დაახლოებით ${formatLocationAccuracy(
              accuracy
            )} მეტრი).`
          : `✓ Precise location shared (about ${formatLocationAccuracy(
              accuracy
            )} m accuracy).`
      );
    } catch (error) {
      console.error(
        "QR location sharing error:",
        error
      );

      if (
        error instanceof
        LocationAccuracyError
      ) {
        setMessage(
          ka
            ? "GPS-ის სიზუსტე არასაკმარისია. გადით ღია სივრცეში, ჩართეთ Precise Location და სცადეთ თავიდან."
            : "GPS accuracy is too low. Move outdoors, enable Precise Location, and try again."
        );
      } else if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === 1
      ) {
        setMessage(
          ka
            ? "ჩართეთ Location და Precise Location ნებართვა ბრაუზერის პარამეტრებში."
            : "Enable Location and Precise Location permission in your browser settings."
        );
      } else {
        setMessage(
          ka
            ? "ლოკაციის გაგზავნა ვერ მოხერხდა."
            : "Could not share location."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="locationCard">
      <div className="icon">
        📍
      </div>

      <div className="content">
        <span className="label">
          QR RETURN
        </span>

        <h3>
          {ka
            ? "გაუზიარეთ ლოკაცია მფლობელს"
            : "Share Location With Owner"}
        </h3>

        <p>
          {ka
            ? "თუ იპოვეთ ეს ნივთი ან შინაური ცხოველი, შეგიძლიათ ერთი ღილაკით გაუგზავნოთ მფლობელს ადგილი, სადაც QR დაასკანერეთ."
            : "If you found this item or pet, you can share the location where the QR code was scanned."}
        </p>

        <button
          type="button"
          onClick={
            shareLocation
          }
          disabled={
            loading
          }
        >
          <span>
            📍
          </span>

          {loading
            ? ka
              ? "ლოკაცია იგზავნება..."
              : "Sharing location..."
            : ka
            ? "ლოკაციის გაზიარება"
            : "Share Location"}
        </button>

        {message && (
          <div
            className={
              success
                ? "message success"
                : "message error"
            }
          >
            {message}
          </div>
        )}

        <small>
          🔒{" "}
          {ka
            ? "თქვენი ლოკაცია გაიგზავნება მხოლოდ ამ ღილაკზე დაჭერის შემდეგ."
            : "Your location is shared only after you press this button."}
        </small>
      </div>

      <style jsx>{`
        .locationCard {
          padding: 16px;

          display: grid;

          grid-template-columns:
            48px
            minmax(0, 1fr);

          gap: 13px;

          border:
            1px solid #d9e5ff;

          border-radius: 14px;

          background: #f6f9ff;
        }

        .icon {
          width: 48px;
          height: 48px;

          display: grid;
          place-items: center;

          border-radius: 13px;

          background: white;

          font-size: 22px;

          box-shadow:
            0 5px 18px
            rgba(
              30,
              80,
              150,
              0.08
            );
        }

        .label {
          color: #1465e8;

          font-size: 6px;
          font-weight: 900;

          letter-spacing: 1px;
        }

        h3 {
          margin: 5px 0 0;

          color: #293745;

          font-size: 16px;
        }

        p {
          margin: 7px 0 0;

          max-width: 480px;

          color: #687684;

          font-size: 9px;
          line-height: 1.65;
        }

        button {
          width: 100%;

          min-height: 46px;

          margin-top: 14px;

          padding: 0 15px;

          display: flex;
          align-items: center;
          justify-content: center;

          gap: 7px;

          border: 0;
          border-radius: 10px;

          color: white;

          background:
            linear-gradient(
              135deg,
              #1465e8,
              #7655f7
            );

          cursor: pointer;

          font-size: 9px;
          font-weight: 900;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .message {
          margin-top: 10px;

          padding: 10px 11px;

          border-radius: 9px;

          font-size: 8px;
          font-weight: 800;
        }

        .success {
          color: #027a48;
          background: #ecfdf3;
        }

        .error {
          color: #b42318;
          background: #fff1f0;
        }

        small {
          display: block;

          margin-top: 11px;

          color: #8a959f;

          font-size: 7px;
          line-height: 1.5;
        }

        @media (
          max-width: 520px
        ) {
          .locationCard {
            grid-template-columns:
              1fr;
          }
        }
      `}</style>
    </section>
  );
}
