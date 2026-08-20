"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Props = {
  itemId: string;
  tagCode: string;
  language?: "ka" | "en";
};

export default function EmergencyLocationShare({
  itemId,
  tagCode,
  language = "ka",
}: Props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const ka = language === "ka";

  function shareLocation() {
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

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitude =
            position.coords.latitude;

          const longitude =
            position.coords.longitude;

          const accuracy =
            position.coords.accuracy;

          const { error } = await supabase
            .from("item")
            .update({
              last_scan_latitude: latitude,
              last_scan_longitude: longitude,
              last_scan_accuracy: accuracy,
              last_scanned_at:
                new Date().toISOString(),
            })
            .eq("id", itemId)
            .eq("tag_code", tagCode)
            .eq("item_type", "emergency");

          if (error) {
            throw error;
          }

          setSuccess(true);

          setMessage(
            ka
              ? "✓ ლოკაცია წარმატებით გაიგზავნა."
              : "✓ Location shared successfully."
          );
        } catch (error) {
          console.error(
            "Emergency location error:",
            error
          );

          setMessage(
            ka
              ? "ლოკაციის გაგზავნა ვერ მოხერხდა."
              : "Could not share location."
          );
        } finally {
          setLoading(false);
        }
      },

      (error) => {
        console.error(
          "Geolocation error:",
          error
        );

        setLoading(false);

        if (
          error.code ===
          error.PERMISSION_DENIED
        ) {
          setMessage(
            ka
              ? "ლოკაციის გასაზიარებლად საჭიროა Location Permission."
              : "Location permission is required."
          );
          return;
        }

        setMessage(
          ka
            ? "თქვენი ლოკაციის მიღება ვერ მოხერხდა."
            : "Could not get your location."
        );
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }

  return (
    <section className="locationCard">
      <div className="icon">
        📍
      </div>

      <div className="content">
        <span className="label">
          QR RETURN EMERGENCY
        </span>

        <h3>
          {ka
            ? "გაუზიარეთ თქვენი ლოკაცია"
            : "Share Your Location"}
        </h3>

        <p>
          {ka
            ? "თუ ამ Emergency ID-ის მფლობელს დახმარება სჭირდება, შეგიძლიათ ერთი ღილაკით გაუზიაროთ ადგილი, სადაც QR დაასკანერეთ."
            : "If the owner of this Emergency ID needs assistance, you can share the location where the QR was scanned."}
        </p>

        <button
          type="button"
          onClick={shareLocation}
          disabled={loading}
        >
          <span>📍</span>

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
            ? "ლოკაცია იგზავნება მხოლოდ ღილაკზე თქვენი დაჭერის შემდეგ."
            : "Your location is shared only after you press the button."}
        </small>
      </div>

      <style jsx>{`
        .locationCard {
          margin-top: 12px;

          padding: 18px;

          display: grid;
          grid-template-columns: 48px 1fr;

          gap: 13px;

          border: 1px solid #d9e5ff;
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
            rgba(30, 80, 150, 0.08);
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

        @media (max-width: 520px) {
          .locationCard {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
