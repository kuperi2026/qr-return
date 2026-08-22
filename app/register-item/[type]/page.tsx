"use client";

import {
  useParams,
  useSearchParams,
} from "next/navigation";

import RegistrationShell from "../../components/registration/RegistrationShell";
import OwnerRegistrationStep from "../../components/registration/OwnerRegistrationStep";
import PetRegistrationForm from "../../components/registration/PetRegistrationForm";
import ItemRegistrationForm from "../../components/registration/ItemRegistrationForm";

type ProductType =
  | "dog"
  | "cat"
  | "keys"
  | "wallet"
  | "bag"
  | "suitcase";

type PetType =
  | "dog"
  | "cat";

type ItemType =
  | "keys"
  | "wallet"
  | "bag"
  | "suitcase";

const PRODUCT_CONFIG: Record<
  ProductType,
  {
    label: string;
    emoji: string;
    ownerTitle: string;
    ownerSubtitle: string;
    productTitle: string;
    productSubtitle: string;
  }
> = {
  dog: {
    label: "ძაღლი",
    emoji: "🐶",

    ownerTitle:
      "ძაღლის პროფილის რეგისტრაცია",

    ownerSubtitle:
      "პირველ ეტაპზე გადაამოწმეთ მფლობელის ინფორმაცია და სურვილის შემთხვევაში მართეთ Secondary Admin.",

    productTitle:
      "ძაღლის ინფორმაცია",

    productSubtitle:
      "მიუთითეთ QR კოდი, ძაღლის მონაცემები და მპოვნელისთვის ხილული ინფორმაცია.",
  },

  cat: {
    label: "კატა",
    emoji: "🐱",

    ownerTitle:
      "კატის პროფილის რეგისტრაცია",

    ownerSubtitle:
      "პირველ ეტაპზე გადაამოწმეთ მფლობელის ინფორმაცია და სურვილის შემთხვევაში მართეთ Secondary Admin.",

    productTitle:
      "კატის ინფორმაცია",

    productSubtitle:
      "მიუთითეთ QR კოდი, კატის მონაცემები და მპოვნელისთვის ხილული ინფორმაცია.",
  },

  keys: {
    label: "გასაღები",
    emoji: "🔑",

    ownerTitle:
      "გასაღების პროფილის რეგისტრაცია",

    ownerSubtitle:
      "პირველ ეტაპზე გადაამოწმეთ მფლობელის ინფორმაცია და სურვილის შემთხვევაში მართეთ Secondary Admin.",

    productTitle:
      "გასაღების ინფორმაცია",

    productSubtitle:
      "მიუთითეთ QR კოდი, ნივთის აღწერა და მპოვნელისთვის ხილული ინფორმაცია.",
  },

  wallet: {
    label: "საფულე",
    emoji: "👛",

    ownerTitle:
      "საფულის პროფილის რეგისტრაცია",

    ownerSubtitle:
      "პირველ ეტაპზე გადაამოწმეთ მფლობელის ინფორმაცია და სურვილის შემთხვევაში მართეთ Secondary Admin.",

    productTitle:
      "საფულის ინფორმაცია",

    productSubtitle:
      "მიუთითეთ QR კოდი, ნივთის აღწერა და მპოვნელისთვის ხილული ინფორმაცია.",
  },

  bag: {
    label: "ჩანთა",
    emoji: "👜",

    ownerTitle:
      "ჩანთის პროფილის რეგისტრაცია",

    ownerSubtitle:
      "პირველ ეტაპზე გადაამოწმეთ მფლობელის ინფორმაცია და სურვილის შემთხვევაში მართეთ Secondary Admin.",

    productTitle:
      "ჩანთის ინფორმაცია",

    productSubtitle:
      "მიუთითეთ QR კოდი, ნივთის აღწერა და მპოვნელისთვის ხილული ინფორმაცია.",
  },

  suitcase: {
    label: "ჩემოდანი",
    emoji: "🧳",

    ownerTitle:
      "ჩემოდნის პროფილის რეგისტრაცია",

    ownerSubtitle:
      "პირველ ეტაპზე გადაამოწმეთ მფლობელის ინფორმაცია და სურვილის შემთხვევაში მართეთ Secondary Admin.",

    productTitle:
      "ჩემოდნის ინფორმაცია",

    productSubtitle:
      "მიუთითეთ QR კოდი, ნივთის აღწერა და მპოვნელისთვის ხილული ინფორმაცია.",
  },
};

function isProductType(
  value: string
): value is ProductType {
  return (
    value === "dog" ||
    value === "cat" ||
    value === "keys" ||
    value === "wallet" ||
    value === "bag" ||
    value === "suitcase"
  );
}

export default function RegisterItemPage() {
  const params =
    useParams();

  const searchParams =
    useSearchParams();

  const rawType =
    params?.type;

  const type =
    typeof rawType === "string"
      ? rawType.toLowerCase()
      : "";

  const step =
    searchParams.get("step");

  if (
    !isProductType(type)
  ) {
    return (
      <>
        <main className="errorPage">
          <div className="errorCard">
            <div className="errorIcon">
              QR
            </div>

            <span>
              QR RETURN
            </span>

            <h1>
              კატეგორია ვერ მოიძებნა
            </h1>

            <p>
              აირჩიეთ ერთ-ერთი
              ხელმისაწვდომი პროდუქტი.
            </p>

            <a href="/register">
              პროდუქტების არჩევა
            </a>
          </div>
        </main>

        <style jsx>{`
          .errorPage {
            min-height: 100vh;

            padding: 30px;

            display: grid;

            place-items: center;

            background:
              #f7faff;
          }

          .errorCard {
            width: 100%;

            max-width:
              480px;

            padding: 36px;

            text-align:
              center;

            border:
              1px solid #dce6f1;

            border-radius:
              18px;

            background:
              #ffffff;
          }

          .errorIcon {
            width: 58px;
            height: 58px;

            margin:
              0 auto 18px;

            display: grid;

            place-items:
              center;

            border-radius:
              15px;

            background:
              #1266e9;

            color:
              #ffffff;

            font-size:
              11px;

            font-weight:
              950;
          }

          .errorCard > span {
            color:
              #1266e9;

            font-size:
              8px;

            font-weight:
              900;
          }

          .errorCard h1 {
            margin:
              8px 0 0;

            color:
              #263e57;

            font-size:
              24px;
          }

          .errorCard p {
            margin:
              10px 0 0;

            color:
              #7e8da0;

            font-size:
              10px;
          }

          .errorCard a {
            min-height:
              44px;

            margin-top:
              22px;

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

  const config =
    PRODUCT_CONFIG[type];

  /*
    STEP 1
    თუ URL-ზე ?step=product არ წერია,
    ყოველთვის Owner/Admin გვერდს ვაჩვენებთ.
  */

  if (
    step !== "product"
  ) {
    return (
      <RegistrationShell
        title={
          config.ownerTitle
        }
        subtitle={
          config.ownerSubtitle
        }
        categoryLabel={
          config.label
        }
        categoryEmoji={
          config.emoji
        }
      >
        <OwnerRegistrationStep
          type={type}
        />
      </RegistrationShell>
    );
  }

  /*
    STEP 2 — PETS
  */

  if (
    type === "dog" ||
    type === "cat"
  ) {
    return (
      <RegistrationShell
        title={
          config.productTitle
        }
        subtitle={
          config.productSubtitle
        }
        categoryLabel={
          config.label
        }
        categoryEmoji={
          config.emoji
        }
      >
        <ProductStepHeader
          type={type}
          label={
            config.label
          }
          emoji={
            config.emoji
          }
        />

        <PetRegistrationForm
          type={
            type as PetType
          }
        />
      </RegistrationShell>
    );
  }

  /*
    STEP 2 — ITEMS
  */

  return (
    <RegistrationShell
      title={
        config.productTitle
      }
      subtitle={
        config.productSubtitle
      }
      categoryLabel={
        config.label
      }
      categoryEmoji={
        config.emoji
      }
    >
      <ProductStepHeader
        type={type}
        label={
          config.label
        }
        emoji={
          config.emoji
        }
      />

      <ItemRegistrationForm
        type={
          type as ItemType
        }
      />
    </RegistrationShell>
  );
}

function ProductStepHeader({
  type,
  label,
  emoji,
}: {
  type: ProductType;
  label: string;
  emoji: string;
}) {
  return (
    <>
      <section className="progressCard">
        <div className="progressTop">
          <div className="step complete">
            <div className="circle">
              ✓
            </div>

            <div>
              <span>
                STEP 01
              </span>

              <strong>
                მფლობელი
              </strong>
            </div>
          </div>

          <div className="line active" />

          <div className="step active">
            <div className="circle">
              02
            </div>

            <div>
              <span>
                STEP 02
              </span>

              <strong>
                {emoji}{" "}
                {label}
              </strong>
            </div>
          </div>
        </div>

        <div className="progressBar">
          <div />
        </div>

        <div className="stepActions">
          <a
            href={`/register-item/${type}`}
          >
            ← მფლობელის გვერდზე დაბრუნება
          </a>

          <span>
            ბოლო ეტაპი
          </span>
        </div>
      </section>

      <style jsx>{`
        .progressCard {
          margin-bottom:
            16px;

          padding:
            18px 20px;

          border:
            1px solid #dce6f1;

          border-radius:
            16px;

          background:
            #ffffff;

          box-shadow:
            0 10px 28px
            rgba(
              30,
              70,
              120,
              0.04
            );
        }

        .progressTop {
          display: flex;

          align-items:
            center;

          gap:
            13px;
        }

        .step {
          display: flex;

          align-items:
            center;

          gap:
            9px;
        }

        .circle {
          width:
            35px;

          height:
            35px;

          flex:
            0 0 35px;

          display:
            grid;

          place-items:
            center;

          border-radius:
            10px;

          font-size:
            8px;

          font-weight:
            950;
        }

        .complete
          .circle {
          background:
            #edf4ff;

          color:
            #1266e9;
        }

        .active
          .circle {
          background:
            #1266e9;

          color:
            #ffffff;
        }

        .step span,
        .step strong {
          display:
            block;
        }

        .step span {
          color:
            #8795a5;

          font-size:
            6px;

          font-weight:
            900;
        }

        .step strong {
          margin-top:
            3px;

          color:
            #334d68;

          font-size:
            9px;
        }

        .line {
          flex: 1;

          height:
            1px;

          background:
            #dce5ef;
        }

        .line.active {
          background:
            #1266e9;
        }

        .progressBar {
          height:
            4px;

          margin-top:
            15px;

          overflow:
            hidden;

          border-radius:
            999px;

          background:
            #edf1f6;
        }

        .progressBar div {
          width:
            100%;

          height:
            100%;

          background:
            #1266e9;
        }

        .stepActions {
          margin-top:
            13px;

          display:
            flex;

          align-items:
            center;

          justify-content:
            space-between;

          gap:
            10px;
        }

        .stepActions a {
          color:
            #61768d;

          font-size:
            8px;

          font-weight:
            850;

          text-decoration:
            none;
        }

        .stepActions span {
          color:
            #1266e9;

          font-size:
            7px;

          font-weight:
            900;
        }

        @media (
          max-width:
            550px
        ) {
          .step strong {
            font-size:
              8px;
          }
        }
      `}</style>
    </>
  );
}
