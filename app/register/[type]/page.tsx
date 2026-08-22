"use client";

import { useParams } from "next/navigation";

import RegistrationFlow from "@/app/components/registration-flow/RegistrationFlow";

import type {
  ProductType,
} from "@/app/components/registration-flow/registrationTypes";

const productTypes: ProductType[] = [
  "dog",
  "cat",
  "keys",
  "wallet",
  "bag",
  "suitcase",
];

function isProductType(
  value: string
): value is ProductType {
  return productTypes.includes(
    value as ProductType
  );
}

export default function RegisterProductPage() {
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
          background: "#0647c8",
          padding: "24px",
          fontFamily:
            "Arial, Helvetica, sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "420px",
            padding: "28px",
            borderRadius: "18px",
            background: "#ffffff",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              margin: 0,
              color: "#203a55",
              fontSize: "24px",
            }}
          >
            პროდუქტი ვერ მოიძებნა
          </h1>

          <p
            style={{
              margin: "9px 0 0",
              color: "#748699",
              fontSize: "13px",
              lineHeight: 1.5,
            }}
          >
            დაბრუნდით QR პროფილის ტიპის
            არჩევის გვერდზე.
          </p>

          <a
            href="/register"
            style={{
              minHeight: "46px",
              marginTop: "20px",
              padding: "0 18px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "10px",
              background: "#0647c8",
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: 800,
              textDecoration: "none",
            }}
          >
            პროდუქტების არჩევა
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
