"use client";

import { useParams } from "next/navigation";

import RegistrationShell from "../../components/registration/RegistrationShell";
import PetRegistrationForm from "../../components/registration/PetRegistrationForm";
import ItemRegistrationForm from "../../components/registration/ItemRegistrationForm";

type PetType =
  | "dog"
  | "cat";

type ItemType =
  | "keys"
  | "wallet"
  | "bag"
  | "suitcase";

const PET_CONFIG = {
  dog: {
    label: "ძაღლი",
    emoji: "🐶",
    title:
      "ძაღლის პროფილის რეგისტრაცია",
    subtitle:
      "შეავსეთ თქვენი ძაღლის ინფორმაცია და განსაზღვრეთ, რას დაინახავს QR კოდის მპოვნელი.",
  },

  cat: {
    label: "კატა",
    emoji: "🐱",
    title:
      "კატის პროფილის რეგისტრაცია",
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
    title:
      "გასაღების პროფილის რეგისტრაცია",
    subtitle:
      "დაარეგისტრირეთ თქვენი QR კოდი და მიუთითეთ გასაღების ძირითადი ინფორმაცია.",
  },

  wallet: {
    label: "საფულე",
    emoji: "👛",
    title:
      "საფულის პროფილის რეგისტრაცია",
    subtitle:
      "დაარეგისტრირეთ თქვენი QR კოდი და მიუთითეთ საფულის ძირითადი ინფორმაცია.",
  },

  bag: {
    label: "ჩანთა",
    emoji: "👜",
    title:
      "ჩანთის პროფილის რეგისტრაცია",
    subtitle:
      "დაარეგისტრირეთ თქვენი QR კოდი და მიუთითეთ ჩანთის ძირითადი ინფორმაცია.",
  },

  suitcase: {
    label: "ჩემოდანი",
    emoji: "🧳",
    title:
      "ჩემოდნის პროფილის რეგისტრაცია",
    subtitle:
      "დაარეგისტრირეთ თქვენი QR კოდი და მიუთითეთ ჩემოდნის ძირითადი ინფორმაცია.",
  },
} satisfies Record<
  ItemType,
  {
    label: string;
    emoji: string;
    title: string;
    subtitle: string;
  }
>;

export default function RegisterItemPage() {
  const params = useParams();

  const rawType =
    params?.type;

  const type =
    typeof rawType ===
      "string"
      ? rawType.toLowerCase()
      : "";

  if (
    type === "dog" ||
    type === "cat"
  ) {
    const petType =
      type as PetType;

    const config =
      PET_CONFIG[
        petType
      ];

    return (
      <RegistrationShell
        title={
          config.title
        }
        subtitle={
          config.subtitle
        }
        categoryLabel={
          config.label
        }
        categoryEmoji={
          config.emoji
        }
      >
        <PetRegistrationForm
          type={
            petType
          }
        />
      </RegistrationShell>
    );
  }

  if (
    type === "keys" ||
    type === "wallet" ||
    type === "bag" ||
    type === "suitcase"
  ) {
    const itemType =
      type as ItemType;

    const config =
      ITEM_CONFIG[
        itemType
      ];

    return (
      <RegistrationShell
        title={
          config.title
        }
        subtitle={
          config.subtitle
        }
        categoryLabel={
          config.label
        }
        categoryEmoji={
          config.emoji
        }
      >
        <ItemRegistrationForm
          type={
            itemType
          }
        />
      </RegistrationShell>
    );
  }

  return (
    <>
      <main className="page">
        <div className="card">
          <div className="icon">
            QR
          </div>

          <span>
            QR RETURN
          </span>

          <h1>
            კატეგორია ვერ მოიძებნა
          </h1>

          <p>
            აირჩიეთ QR RETURN-ის
            ერთ-ერთი ხელმისაწვდომი
            კატეგორია.
          </p>

          <a href="/register">
            პროდუქტების არჩევა
          </a>
        </div>
      </main>

      <style jsx>{`
        .page {
          min-height: 100vh;

          padding: 30px;

          display: grid;
          place-items: center;

          background: #f7faff;
        }

        .card {
          width: 100%;
          max-width: 480px;

          padding: 36px;

          text-align: center;

          border: 1px solid #dce6f1;
          border-radius: 18px;

          background: #ffffff;

          box-shadow:
            0 14px 32px
            rgba(
              30,
              70,
              120,
              0.06
            );
        }

        .icon {
          width: 58px;
          height: 58px;

          margin:
            0 auto 18px;

          display: grid;
          place-items: center;

          border-radius: 15px;

          background: #1266e9;

          color: #ffffff;

          font-size: 11px;
          font-weight: 950;
        }

        .card > span {
          color: #1266e9;

          font-size: 8px;
          font-weight: 900;

          letter-spacing:
            1.3px;
        }

        h1 {
          margin: 8px 0 0;

          color: #263e57;

          font-size: 24px;
        }

        p {
          margin: 10px 0 0;

          color: #7e8da0;

          font-size: 10px;

          line-height: 1.6;
        }

        a {
          min-height: 44px;

          margin-top: 22px;

          padding:
            0 17px;

          display:
            inline-flex;

          align-items:
            center;

          justify-content:
            center;

          border-radius:
            10px;

          background:
            #1266e9;

          color:
            #ffffff;

          font-size:
            9px;

          font-weight:
            900;

          text-decoration:
            none;
        }
      `}</style>
    </>
  );
}
