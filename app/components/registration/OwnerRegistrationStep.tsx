"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createClient,
  type User,
} from "@supabase/supabase-js";

import OwnerInformationSection from "./OwnerInformationSection";

type ProductType =
  | "dog"
  | "cat"
  | "keys"
  | "wallet"
  | "bag"
  | "suitcase";

type OwnerRegistrationStepProps = {
  type: ProductType;
};

type OwnerData = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

const PRODUCT_META: Record<
  ProductType,
  {
    label: string;
    emoji: string;
  }
> = {
  dog: {
    label: "ძაღლი",
    emoji: "🐶",
  },

  cat: {
    label: "კატა",
    emoji: "🐱",
  },

  keys: {
    label: "გასაღები",
    emoji: "🔑",
  },

  wallet: {
    label: "საფულე",
    emoji: "👛",
  },

  bag: {
    label: "ჩანთა",
    emoji: "👜",
  },

  suitcase: {
    label: "ჩემოდანი",
    emoji: "🧳",
  },
};

function createSupabaseClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createClient(
    supabaseUrl,
    supabaseKey
  );
}

export default function OwnerRegistrationStep({
  type,
}: OwnerRegistrationStepProps) {
  const router = useRouter();

  const meta =
    PRODUCT_META[type];

  const [
    currentUser,
    setCurrentUser,
  ] = useState<User | null>(
    null
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    owner,
    setOwner,
  ] = useState<OwnerData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    async function loadOwner() {
      try {
        const supabase =
          createSupabaseClient();

        if (!supabase) {
          setErrorMessage(
            "Supabase კავშირი არ არის კონფიგურირებული."
          );
          return;
        }

        const {
          data: { user },
          error,
        } =
          await supabase.auth.getUser();

        if (
          error ||
          !user
        ) {
          router.replace(
            "/login"
          );
          return;
        }

        setCurrentUser(user);

        setOwner({
          firstName:
            String(
              user.user_metadata
                ?.first_name || ""
            ),

          lastName:
            String(
              user.user_metadata
                ?.last_name || ""
            ),

          phone:
            String(
              user.user_metadata
                ?.phone ||
                user.phone ||
                ""
            ),

          email:
            String(
              user.email || ""
            ),
        });
      } catch (error) {
        console.error(
          "Owner load error:",
          error
        );

        setErrorMessage(
          "მფლობელის ინფორმაციის ჩატვირთვა ვერ მოხერხდა."
        );
      } finally {
        setLoading(false);
      }
    }

    loadOwner();
  }, [router]);

  function continueToProduct() {
    setErrorMessage("");

    if (!currentUser) {
      setErrorMessage(
        "მომხმარებლის ანგარიში ვერ მოიძებნა."
      );
      return;
    }

    if (!owner.firstName.trim()) {
      setErrorMessage(
        "მფლობელის სახელი ვერ მოიძებნა."
      );
      return;
    }

    if (!owner.lastName.trim()) {
      setErrorMessage(
        "მფლობელის გვარი ვერ მოიძებნა."
      );
      return;
    }

    if (!owner.phone.trim()) {
      setErrorMessage(
        "მფლობელის ტელეფონის ნომერი ვერ მოიძებნა."
      );
      return;
    }

    /*
      window.location.assign-ს ვიყენებთ,
      რომ Step 2-ზე გადასვლა აუცილებლად მოხდეს.
    */

    window.location.assign(
      `/register-item/${type}?step=product`
    );
  }

  if (loading) {
    return (
      <>
        <div className="loadingCard">
          <div className="loadingIcon">
            QR
          </div>

          <strong>
            მფლობელის ინფორმაცია იტვირთება...
          </strong>
        </div>

        <style jsx>{`
          .loadingCard {
            min-height: 280px;

            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            gap: 14px;

            border: 1px solid #dce6f1;
            border-radius: 18px;

            background: #ffffff;

            color: #65788d;

            font-size: 15px;
          }

          .loadingIcon {
            width: 52px;
            height: 52px;

            display: grid;
            place-items: center;

            border-radius: 14px;

            background: #1266e9;

            color: #ffffff;

            font-size: 13px;
            font-weight: 900;
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <div className="flow">

        {/* STEP PROGRESS */}

        <section className="progressCard">
          <div className="progressHeader">
            <div className="step active">
              <div className="stepNumber">
                01
              </div>

              <div>
                <span>
                  პირველი ეტაპი
                </span>

                <strong>
                  მფლობელი
                </strong>
              </div>
            </div>

            <div className="stepLine" />

            <div className="step">
              <div className="stepNumber">
                02
              </div>

              <div>
                <span>
                  მეორე ეტაპი
                </span>

                <strong>
                  {meta.emoji}{" "}
                  {meta.label}
                </strong>
              </div>
            </div>
          </div>

          <div className="progressTrack">
            <div className="progressFill" />
          </div>
        </section>

        {/* INTRO */}

        <section className="introCard">
          <div className="productIcon">
            {meta.emoji}
          </div>

          <div>
            <span className="eyebrow">
              OWNER INFORMATION
            </span>

            <h1>
              გადაამოწმეთ მფლობელის ინფორმაცია
            </h1>

            <p>
              ეს ინფორმაცია აღებულია თქვენი QR RETURN
              ანგარიშიდან. შემდეგ ეტაპზე შეავსებთ მხოლოდ{" "}
              <strong>
                {meta.label}
              </strong>
              -ის პროფილს.
            </p>
          </div>
        </section>

        {/* ERROR */}

        {errorMessage && (
          <div
            className="errorBox"
            role="alert"
          >
            <div className="errorIcon">
              !
            </div>

            <div>
              <strong>
                მონაცემები გადაამოწმეთ
              </strong>

              <p>
                {errorMessage}
              </p>
            </div>
          </div>
        )}

        {/* OWNER INFO */}

        <OwnerInformationSection
          firstName={
            owner.firstName
          }
          lastName={
            owner.lastName
          }
          phone={
            owner.phone
          }
          email={
            owner.email
          }
        />

        {/* INFO NOTE */}

        <section className="infoCard">
          <div className="infoIcon">
            i
          </div>

          <div>
            <strong>
              მფლობელის მონაცემების შეცვლა
            </strong>

            <p>
              პროფილის შექმნის შემდეგ თქვენი ანგარიშიდან
              შეძლებთ მფლობელის ინფორმაციის განახლებას.
              ასევე თითოეული QR პროფილი ცალკე იქნება
              რედაქტირებადი.
            </p>
          </div>
        </section>

        {/* NEXT */}

        <section className="continueCard">
          <div className="continueText">
            <span>
              NEXT STEP
            </span>

            <h2>
              {meta.emoji}{" "}
              {meta.label}ს პროფილი
            </h2>

            <p>
              შემდეგ გვერდზე შეავსებთ QR კოდსა და
              {type === "dog" || type === "cat"
                ? " ცხოველის ინფორმაციას."
                : " ნივთის ინფორმაციას."}
            </p>
          </div>

          <div className="actions">
            <a
              href="/register"
              className="backButton"
            >
              ← უკან
            </a>

            <button
              type="button"
              className="continueButton"
              onClick={
                continueToProduct
              }
            >
              გაგრძელება
              <span>→</span>
            </button>
          </div>
        </section>
      </div>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .flow {
          width: 100%;
        }

        .progressCard {
          margin-bottom: 18px;

          padding: 22px 24px;

          border: 1px solid #dbe5f0;
          border-radius: 18px;

          background: #ffffff;

          box-shadow:
            0 10px 28px
            rgba(30, 70, 120, 0.04);
        }

        .progressHeader {
          display: flex;
          align-items: center;

          gap: 16px;
        }

        .step {
          display: flex;
          align-items: center;

          gap: 11px;

          opacity: 0.5;
        }

        .step.active {
          opacity: 1;
        }

        .stepNumber {
          width: 42px;
          height: 42px;

          flex: 0 0 42px;

          display: grid;
          place-items: center;

          border-radius: 11px;

          background: #edf4ff;

          color: #1266e9;

          font-size: 13px;
          font-weight: 900;
        }

        .step.active .stepNumber {
          background: #1266e9;
          color: #ffffff;
        }

        .step span,
        .step strong {
          display: block;
        }

        .step span {
          color: #8493a4;

          font-size: 12px;
          font-weight: 700;
        }

        .step strong {
          margin-top: 3px;

          color: #29435d;

          font-size: 15px;
          font-weight: 850;
        }

        .stepLine {
          flex: 1;

          min-width: 35px;
          height: 2px;

          background: #dce5ef;
        }

        .progressTrack {
          height: 5px;

          margin-top: 18px;

          overflow: hidden;

          border-radius: 999px;

          background: #edf1f6;
        }

        .progressFill {
          width: 50%;
          height: 100%;

          border-radius: 999px;

          background: #1266e9;
        }

        .introCard {
          margin-bottom: 18px;

          padding: 26px;

          display: flex;
          align-items: center;

          gap: 17px;

          border: 1px solid #dbe5f0;
          border-radius: 18px;

          background:
            linear-gradient(
              135deg,
              #ffffff,
              #f3f7fd
            );
        }

        .productIcon {
          width: 64px;
          height: 64px;

          flex: 0 0 64px;

          display: grid;
          place-items: center;

          border-radius: 17px;

          background: #eaf2ff;

          font-size: 31px;
        }

        .eyebrow {
          color: #1266e9;

          font-size: 12px;
          font-weight: 900;

          letter-spacing: 1px;
        }

        .introCard h1 {
          margin: 7px 0 0;

          color: #20384f;

          font-size: 26px;
          line-height: 1.2;
        }

        .introCard p {
          max-width: 650px;

          margin: 9px 0 0;

          color: #718296;

          font-size: 15px;
          line-height: 1.65;
        }

        .introCard p strong {
          color: #1266e9;
        }

        .errorBox {
          margin-bottom: 18px;

          padding: 16px;

          display: flex;
          align-items: flex-start;

          gap: 11px;

          border: 1px solid #efc7cb;
          border-radius: 13px;

          background: #fff7f8;

          color: #a3434c;
        }

        .errorIcon {
          width: 28px;
          height: 28px;

          flex: 0 0 28px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          background: #f7dfe2;

          font-size: 14px;
          font-weight: 900;
        }

        .errorBox strong {
          display: block;

          font-size: 14px;
        }

        .errorBox p {
          margin: 4px 0 0;

          font-size: 13px;
          line-height: 1.5;
        }

        .infoCard {
          margin-top: 18px;

          padding: 17px 18px;

          display: flex;
          align-items: flex-start;

          gap: 12px;

          border: 1px solid #d9e4ef;
          border-radius: 14px;

          background: #fafcff;
        }

        .infoIcon {
          width: 30px;
          height: 30px;

          flex: 0 0 30px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          background: #eaf2ff;

          color: #1266e9;

          font-size: 13px;
          font-weight: 900;
        }

        .infoCard strong {
          display: block;

          color: #344e68;

          font-size: 14px;
        }

        .infoCard p {
          max-width: 680px;

          margin: 5px 0 0;

          color: #718296;

          font-size: 13px;
          line-height: 1.6;
        }

        .continueCard {
          margin-top: 18px;

          padding: 24px 26px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 22px;

          border: 1px solid #c5d9f3;
          border-radius: 18px;

          background:
            linear-gradient(
              135deg,
              #f4f8ff,
              #eaf3ff
            );
        }

        .continueText > span {
          color: #1266e9;

          font-size: 12px;
          font-weight: 900;

          letter-spacing: .9px;
        }

        .continueText h2 {
          margin: 6px 0 0;

          color: #27415b;

          font-size: 21px;
        }

        .continueText p {
          margin: 6px 0 0;

          color: #718397;

          font-size: 14px;
          line-height: 1.55;
        }

        .actions {
          display: flex;
          align-items: center;

          gap: 10px;
        }

        .backButton,
        .continueButton {
          min-height: 48px;

          padding: 0 18px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          border-radius: 11px;

          font-family: inherit;

          font-size: 14px;
          font-weight: 850;

          text-decoration: none;

          white-space: nowrap;
        }

        .backButton {
          border: 1px solid #c9d6e5;

          background: #ffffff;

          color: #596f86;
        }

        .continueButton {
          min-width: 155px;

          gap: 10px;

          border: 0;

          background: #1266e9;

          color: #ffffff;

          cursor: pointer;

          box-shadow:
            0 10px 22px
            rgba(18, 102, 233, .18);
        }

        .continueButton span {
          font-size: 18px;
        }

        .continueButton:hover {
          background: #0e58cc;
        }

        @media (max-width: 700px) {
          .introCard {
            align-items: flex-start;
          }

          .introCard h1 {
            font-size: 22px;
          }

          .continueCard {
            flex-direction: column;
            align-items: stretch;
          }

          .actions {
            width: 100%;
          }

          .backButton,
          .continueButton {
            flex: 1;
          }

          .progressHeader {
            gap: 9px;
          }

          .stepNumber {
            width: 36px;
            height: 36px;

            flex-basis: 36px;
          }

          .step span {
            font-size: 10px;
          }

          .step strong {
            font-size: 13px;
          }
        }

        @media (max-width: 480px) {
          .introCard {
            padding: 20px;
          }

          .productIcon {
            width: 52px;
            height: 52px;

            flex-basis: 52px;

            font-size: 25px;
          }

          .introCard h1 {
            font-size: 20px;
          }

          .introCard p {
            font-size: 14px;
          }

          .actions {
            flex-direction: column;
          }

          .backButton,
          .continueButton {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}
