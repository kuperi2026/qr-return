"use client";

import { useParams } from "next/navigation";

import RegistrationFlow from "@/app/components/registration-flow/RegistrationFlow";

import {
  isProductType,
} from "@/app/components/registration-flow/productConfig";

export default function RegisterItemPage() {
  const params = useParams();

  const rawType =
    typeof params?.type === "string"
      ? params.type.toLowerCase()
      : "";

  if (!isProductType(rawType)) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "24px",
          background: "#0647c8",
          color: "#ffffff",
          fontFamily:
            "Arial, Helvetica, sans-serif",
          textAlign: "center",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "28px",
            }}
          >
            QR RETURN
          </h1>

          <p
            style={{
              marginTop: "10px",
              fontSize: "15px",
              opacity: 0.82,
            }}
          >
            პროდუქტის კატეგორია ვერ მოიძებნა.
          </p>

          <a
            href="/register"
            style={{
              marginTop: "18px",
              minHeight: "44px",
              padding: "0 18px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "10px",
              background: "#ffffff",
              color: "#0647c8",
              fontSize: "14px",
              fontWeight: 800,
              textDecoration: "none",
            }}
          >
            პროდუქტის არჩევა
          </a>
        </div>
      </main>
    );
  }

  return (
    <RegistrationFlow
      type={rawType}
    />
  );
}
