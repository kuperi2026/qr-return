"use client";

import { useParams } from "next/navigation";

import RegistrationShell from "../../components/registration/RegistrationShell";
import PetRegistrationForm from "../../components/registration/PetRegistrationForm";

type PetType = "dog" | "cat";

const PET_CONFIG = {
  dog: {
    label: "ძაღლი",
    emoji: "🐶",
    title: "ძაღლის პროფილის რეგისტრაცია",
    subtitle:
      "შეავსეთ თქვენი ძაღლის ინფორმაცია და განსაზღვრეთ, რას დაინახავს QR კოდის მპოვნელი.",
  },

  cat: {
    label: "კატა",
    emoji: "🐱",
    title: "კატის პროფილის რეგისტრაცია",
    subtitle:
      "შეავსეთ თქვენი კატის ინფორმაცია და განსაზღვრეთ, რას დაინახავს QR კოდის მპოვნელი.",
  },
} satisfies Record<
  PetType,
  {
    label: string;
    emoji: string;
    title: string;
    subtitle: string;
  }
>;

const ITEM_CONFIG = {
  keys: {
    label: "გასაღები",
    emoji: "🔑",
  },

  wallet: {
    label: "საფულე",
    emoji: "👛",
  },

  suitcase: {
    label: "ჩემოდანი",
    emoji: "🧳",
  },

  bag: {
    label: "ჩანთა",
    emoji: "🎒",
  },
} as const;

export default function RegisterItemPage() {
  const params = useParams();

  const rawType = params?.type;

  const type =
    typeof rawType === "string"
      ? rawType.toLowerCase()
      : "";

  if (type === "dog" || type === "cat") {
    const petType = type as PetType;
    const config = PET_CONFIG[petType];

    return (
      <RegistrationShell
        title={config.title}
        subtitle={config.subtitle}
        categoryLabel={config.label}
        categoryEmoji={config.emoji}
      >
        <PetRegistrationForm
          type={petType}
        />
      </RegistrationShell>
    );
  }

  if (
    type === "keys" ||
    type === "wallet" ||
    type === "suitcase" ||
    type === "bag"
  ) {
    const config =
      ITEM_CONFIG[
        type as keyof typeof ITEM_CONFIG
      ];

    return (
      <RegistrationShell
        title={`${config.label} — რეგისტრაცია`}
        subtitle="ამ კატეგორიის რეგისტრაციის ფორმას შემდეგ ეტაპზე დავამატებთ."
        categoryLabel={config.label}
        categoryEmoji={config.emoji}
      >
        <div
          style={{
            padding: "32px",
            border: "1px solid #dce6f1",
            borderRadius: "16px",
            background: "#ffffff",
            color: "#53667a",
            boxShadow:
              "0 12px 30px rgba(30, 70, 120, 0.05)",
          }}
        >
          <div
            style={{
              fontSize: "34px",
              marginBottom: "14px",
            }}
          >
            {config.emoji}
          </div>

          <h3
            style={{
              margin: 0,
              color: "#223951",
              fontSize: "20px",
            }}
          >
            {config.label}
          </h3>

          <p
            style={{
              margin: "9px 0 0",
              maxWidth: "500px",
              fontSize: "11px",
              lineHeight: 1.65,
            }}
          >
            კატეგორია უკვე სწორად არის
            დაკავშირებული. მისი სრული ფორმა
            შემდეგ ეტაპზე დაემატება.
          </p>

          <a
            href="/register"
            style={{
              display: "inline-flex",
              marginTop: "20px",
              padding: "12px 16px",
              borderRadius: "10px",
              background: "#1266e9",
              color: "#ffffff",
              fontSize: "10px",
              fontWeight: 800,
              textDecoration: "none",
            }}
          >
            ← კატეგორიებზე დაბრუნება
          </a>
        </div>
      </RegistrationShell>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "30px",
        background: "#f8fbff",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          padding: "35px",
          textAlign: "center",
          border: "1px solid #dce6f1",
          borderRadius: "18px",
          background: "#ffffff",
        }}
      >
        <h1
          style={{
            margin: 0,
            color: "#223951",
            fontSize: "25px",
          }}
        >
          კატეგორია ვერ მოიძებნა
        </h1>

        <p
          style={{
            margin: "10px 0 0",
            color: "#7c8998",
            fontSize: "11px",
          }}
        >
          აირჩიეთ QR RETURN-ის ერთ-ერთი
          ხელმისაწვდომი პროდუქტი.
        </p>

        <a
          href="/register"
          style={{
            display: "inline-flex",
            marginTop: "22px",
            padding: "13px 18px",
            borderRadius: "10px",
            background: "#1266e9",
            color: "#ffffff",
            fontSize: "10px",
            fontWeight: 850,
            textDecoration: "none",
          }}
        >
          პროდუქტების არჩევა
        </a>
      </div>
    </main>
  );
}
