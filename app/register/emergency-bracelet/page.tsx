"use client";

import { useState } from "react";

type ProfileFor =
  | "self"
  | "other"
  | "";

type Relationship =
  | "parent"
  | "child"
  | "spouse"
  | "sibling"
  | "grandparent"
  | "caregiver"
  | "guardian"
  | "other"
  | "";

export default function EmergencyBraceletPage() {
  const [
    profileFor,
    setProfileFor,
  ] =
    useState<ProfileFor>("");

  const [
    relationship,
    setRelationship,
  ] =
    useState<Relationship>("");

  const [
    customRelationship,
    setCustomRelationship,
  ] =
    useState("");

  function handleContinue() {
    if (!profileFor) {
      return;
    }

    if (
      profileFor === "other" &&
      !relationship
    ) {
      return;
    }

    if (
      profileFor === "other" &&
      relationship === "other" &&
      !customRelationship.trim()
    ) {
      return;
    }

    /*
      შემდეგ ეტაპზე აქ
      Step 2-ზე გადავიყვანთ.
    */

    console.log({
      profileFor,
      relationship,
      customRelationship,
    });
  }

  const canContinue =
    profileFor === "self" ||
    (
      profileFor === "other" &&
      relationship !== "" &&
      (
        relationship !== "other" ||
        customRelationship
          .trim()
          .length > 0
      )
    );

  return (
    <>
      <main className="page">
        <header className="topbar">
          <a
            href="/"
            className="brand"
          >
            <div className="brandMark">
              QR
            </div>

            <div className="brandText">
              <strong>
                QR RETURN
              </strong>

              <span>
                SMART LOST &amp; FOUND
              </span>
            </div>
          </a>

          <a
            href="/register"
            className="backLink"
          >
            ← პროდუქტები
          </a>
        </header>

        <section className="card">
          <div className="stepLabel">
            STEP 1 OF 5
          </div>

          <div className="heading">
            <div className="icon">
              +
            </div>

            <div>
              <h1>
                Emergency Bracelet
              </h1>

              <p>
                ვისთვის ქმნით Emergency პროფილს?
              </p>
            </div>
          </div>

          <div className="choiceGrid">
            <button
              type="button"
              className={
                profileFor === "self"
                  ? "choice active"
                  : "choice"
              }
              onClick={() => {
                setProfileFor(
                  "self"
                );

                setRelationship(
                  ""
                );

                setCustomRelationship(
                  ""
                );
              }}
            >
              <div className="choiceTop">
                <span className="choiceNumber">
                  01
                </span>

                <span className="choiceCheck">
                  {profileFor ===
                  "self"
                    ? "✓"
                    : "→"}
                </span>
              </div>

              <div className="choiceIcon">
                👤
              </div>

              <h2>
                ჩემთვის
              </h2>

              <p>
                Emergency პროფილი
                თქვენი პირადი
                ინფორმაციისთვის.
              </p>
            </button>

            <button
              type="button"
              className={
                profileFor === "other"
                  ? "choice active"
                  : "choice"
              }
              onClick={() =>
                setProfileFor(
                  "other"
                )
              }
            >
              <div className="choiceTop">
                <span className="choiceNumber">
                  02
                </span>

                <span className="choiceCheck">
                  {profileFor ===
                  "other"
                    ? "✓"
                    : "→"}
                </span>
              </div>

              <div className="choiceIcon">
                👥
              </div>

              <h2>
                სხვა პირისთვის
              </h2>

              <p>
                ბავშვის, ოჯახის წევრის
                ან სხვა პირის
                Emergency პროფილი.
              </p>
            </button>
          </div>

          {profileFor ===
            "other" && (
            <section className="relationshipSection">
              <div className="sectionTitle">
                <span>
                  RELATIONSHIP
                </span>

                <h3>
                  რა კავშირი გაქვთ ამ პირთან?
                </h3>
              </div>

              <div className="relationshipGrid">
                <RelationshipButton
                  label="მშობელი"
                  value="parent"
                  selected={
                    relationship ===
                    "parent"
                  }
                  onClick={() =>
                    setRelationship(
                      "parent"
                    )
                  }
                />

                <RelationshipButton
                  label="შვილი"
                  value="child"
                  selected={
                    relationship ===
                    "child"
                  }
                  onClick={() =>
                    setRelationship(
                      "child"
                    )
                  }
                />

                <RelationshipButton
                  label="მეუღლე"
                  value="spouse"
                  selected={
                    relationship ===
                    "spouse"
                  }
                  onClick={() =>
                    setRelationship(
                      "spouse"
                    )
                  }
                />

                <RelationshipButton
                  label="და / ძმა"
                  value="sibling"
                  selected={
                    relationship ===
                    "sibling"
                  }
                  onClick={() =>
                    setRelationship(
                      "sibling"
                    )
                  }
                />

                <RelationshipButton
                  label="ბებია / ბაბუა"
                  value="grandparent"
                  selected={
                    relationship ===
                    "grandparent"
                  }
                  onClick={() =>
                    setRelationship(
                      "grandparent"
                    )
                  }
                />

                <RelationshipButton
                  label="მომვლელი"
                  value="caregiver"
                  selected={
                    relationship ===
                    "caregiver"
                  }
                  onClick={() =>
                    setRelationship(
                      "caregiver"
                    )
                  }
                />

                <RelationshipButton
                  label="მეურვე"
                  value="guardian"
                  selected={
                    relationship ===
                    "guardian"
                  }
                  onClick={() =>
                    setRelationship(
                      "guardian"
                    )
                  }
                />

                <RelationshipButton
                  label="სხვა"
                  value="other"
                  selected={
                    relationship ===
                    "other"
                  }
                  onClick={() =>
                    setRelationship(
                      "other"
                    )
                  }
                />
              </div>

              {relationship ===
                "other" && (
                <div className="customField">
                  <label>
                    მიუთითეთ კავშირი
                  </label>

                  <input
                    type="text"
                    value={
                      customRelationship
                    }
                    onChange={(
                      event
                    ) =>
                      setCustomRelationship(
                        event.target.value
                      )
                    }
                    placeholder="მაგ. ოჯახის მეგობარი"
                  />
                </div>
              )}
            </section>
          )}

          <div className="infoBox">
            <div className="infoIcon">
              i
            </div>

            <div>
              <strong>
                ერთი ანგარიში — რამდენიმე Emergency პროფილი
              </strong>

              <p>
                შეგიძლიათ შექმნათ
                პროფილი თქვენთვის,
                ბავშვისთვის, ოჯახის
                წევრისთვის ან სხვა
                პირისთვის და ყველაფერი
                ერთი Owner Account-იდან
                მართოთ.
              </p>
            </div>
          </div>

          <div className="actions">
            <a
              href="/register"
              className="secondaryButton"
            >
              ← უკან
            </a>

            <button
              type="button"
              className="primaryButton"
              disabled={!canContinue}
              onClick={
                handleContinue
              }
            >
              გაგრძელება
              <span>
                →
              </span>
            </button>
          </div>
        </section>
      </main>

      <style jsx global>{`
        * {
          box-sizing:
            border-box;
        }

        body {
          margin: 0;
        }

        .page {
          min-height:
            100vh;

          padding:
            0 20px
            38px;

          background:
            #0747c9;

          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Arial,
            sans-serif;
        }

        .topbar {
          width:
            100%;

          max-width:
            940px;

          height:
            72px;

          margin:
            0 auto;

          display:
            flex;

          align-items:
            center;

          justify-content:
            space-between;

          gap:
            18px;

          border-bottom:
            1px solid
            rgba(
              255,
              255,
              255,
              0.2
            );
        }

        .brand {
          display:
            flex;

          align-items:
            center;

          gap:
            10px;

          text-decoration:
            none;
        }

        .brandMark {
          width:
            42px;

          height:
            42px;

          display:
            grid;

          place-items:
            center;

          border-radius:
            11px;

          background:
            #ffffff;

          color:
            #0747c9;

          font-size:
            13px;

          font-weight:
            950;
        }

        .brandText strong,
        .brandText span {
          display:
            block;
        }

        .brandText strong {
          color:
            #ffffff;

          font-size:
            18px;

          font-weight:
            950;
        }

        .brandText span {
          margin-top:
            2px;

          color:
            rgba(
              255,
              255,
              255,
              0.72
            );

          font-size:
            10px;

          font-weight:
            700;

          letter-spacing:
            0.8px;
        }

        .backLink {
          min-height:
            40px;

          padding:
            0 14px;

          display:
            inline-flex;

          align-items:
            center;

          justify-content:
            center;

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.34
            );

          border-radius:
            10px;

          background:
            rgba(
              255,
              255,
              255,
              0.08
            );

          color:
            #ffffff;

          font-size:
            13px;

          font-weight:
            800;

          text-decoration:
            none;
        }

        .card {
          width:
            100%;

          max-width:
            820px;

          margin:
            26px auto 0;

          padding:
            27px;

          border-radius:
            21px;

          background:
            #ffffff;

          box-shadow:
            0 24px
            56px
            rgba(
              0,
              24,
              77,
              0.25
            );
        }

        .stepLabel {
          color:
            #0747c9;

          font-size:
            11px;

          font-weight:
            900;

          letter-spacing:
            1px;
        }

        .heading {
          margin-top:
            8px;

          display:
            flex;

          align-items:
            center;

          gap:
            12px;
        }

        .icon {
          width:
            49px;

          height:
            49px;

          flex:
            0 0 49px;

          display:
            grid;

          place-items:
            center;

          border-radius:
            13px;

          background:
            #0747c9;

          color:
            #ffffff;

          font-size:
            28px;

          font-weight:
            400;
        }

        .heading h1 {
          margin:
            0;

          color:
            #203a55;

          font-size:
            29px;

          font-weight:
            900;

          line-height:
            1.15;
        }

        .heading p {
          margin:
            4px 0 0;

          color:
            #718397;

          font-size:
            14px;

          line-height:
            1.45;
        }

        .choiceGrid {
          margin-top:
            23px;

          display:
            grid;

          grid-template-columns:
            repeat(
              2,
              minmax(
                0,
                1fr
              )
            );

          gap:
            14px;
        }

        .choice {
          min-height:
            128px;

          padding:
            15px;

          display:
            flex;

          flex-direction:
            column;

          border:
            1.5px solid
            #0b52d6;

          border-radius:
            14px;

          background:
            #0b52d6;

          color:
            #ffffff;

          text-align:
            left;

          cursor:
            pointer;

          box-shadow:
            0 9px
            20px
            rgba(
              7,
              71,
              201,
              0.13
            );

          transition:
            transform
              0.18s ease,
            background
              0.18s ease,
            box-shadow
              0.18s ease;
        }

        .choice:hover {
          transform:
            translateY(
              -2px
            );

          background:
            #0643b6;

          box-shadow:
            0 13px
            26px
            rgba(
              7,
              71,
              201,
              0.2
            );
        }

        .choice.active {
          background:
            #063fae;

          border-color:
            #063fae;

          box-shadow:
            0 0 0
              4px
              rgba(
                7,
                71,
                201,
                0.11
              ),
            0 13px
              26px
              rgba(
                7,
                71,
                201,
                0.22
              );
        }

        .choiceTop {
          display:
            flex;

          align-items:
            center;

          justify-content:
            space-between;
        }

        .choiceNumber {
          color:
            rgba(
              255,
              255,
              255,
              0.7
            );

          font-size:
            10px;

          font-weight:
            900;
        }

        .choiceCheck {
          width:
            27px;

          height:
            27px;

          display:
            grid;

          place-items:
            center;

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.28
            );

          border-radius:
            50%;

          background:
            rgba(
              255,
              255,
              255,
              0.12
            );

          color:
            #ffffff;

          font-size:
            13px;

          font-weight:
            900;
        }

        .choiceIcon {
          margin-top:
            11px;

          font-size:
            25px;
        }

        .choice h2 {
          margin:
            8px 0 0;

          color:
            #ffffff;

          font-size:
            20px;

          font-weight:
            900;

          line-height:
            1.15;
        }

        .choice p {
          margin:
            5px 0 0;

          max-width:
            260px;

          color:
            rgba(
              255,
              255,
              255,
              0.82
            );

          font-size:
            13px;

          line-height:
            1.4;
        }

        .relationshipSection {
          margin-top:
            20px;

          padding-top:
            18px;

          border-top:
            1px solid
            #e1e8f0;
        }

        .sectionTitle > span {
          color:
            #0747c9;

          font-size:
            10px;

          font-weight:
            900;

          letter-spacing:
            0.9px;
        }

        .sectionTitle h3 {
          margin:
            4px 0 0;

          color:
            #304a65;

          font-size:
            17px;

          font-weight:
            850;
        }

        .relationshipGrid {
          margin-top:
            12px;

          display:
            grid;

          grid-template-columns:
            repeat(
              4,
              minmax(
                0,
                1fr
              )
            );

          gap:
            8px;
        }

        .relationshipButton {
          min-height:
            48px;

          padding:
            0 10px;

          border:
            1px solid
            #d7e2ed;

          border-radius:
            10px;

          background:
            #ffffff;

          color:
            #536a81;

          font-family:
            inherit;

          font-size:
            12px;

          font-weight:
            800;

          cursor:
            pointer;

          transition:
            border-color
              0.18s ease,
            background
              0.18s ease,
            color
              0.18s ease,
            box-shadow
              0.18s ease;
        }

        .relationshipButton:hover {
          border-color:
            #a9c5e8;

          background:
            #f7faff;
        }

        .relationshipButton.selected {
          border-color:
            #0747c9;

          background:
            #edf4ff;

          color:
            #0747c9;

          box-shadow:
            0 0 0
              3px
              rgba(
                7,
                71,
                201,
                0.07
              );
        }

        .customField {
          margin-top:
            13px;
        }

        .customField label {
          display:
            block;

          margin:
            0 0
            8px 2px;

          color:
            #344e68;

          font-size:
            13px;

          font-weight:
            800;
        }

        .customField input {
          width:
            100%;

          height:
            56px;

          padding:
            0 16px;

          border:
            1.5px solid
            #d5e0eb;

          border-radius:
            11px;

          background:
            #ffffff;

          color:
            #263f59;

          font-family:
            inherit;

          font-size:
            15px;

          outline:
            none;
        }

        .customField input:focus {
          border-color:
            #0747c9;

          box-shadow:
            0 0 0
              4px
              rgba(
                7,
                71,
                201,
                0.08
              );
        }

        .infoBox {
          margin-top:
            20px;

          padding:
            11px 13px;

          display:
            flex;

          align-items:
            center;

          gap:
            10px;

          border:
            1px solid
            #cbdcf4;

          border-radius:
            11px;

          background:
            #f2f6fc;
        }

        .infoIcon {
          width:
            29px;

          height:
            29px;

          flex:
            0 0 29px;

          display:
            grid;

          place-items:
            center;

          border-radius:
            50%;

          background:
            #0747c9;

          color:
            #ffffff;

          font-size:
            12px;

          font-weight:
            900;
        }

        .infoBox strong {
          display:
            block;

          color:
            #304a65;

          font-size:
            12px;

          font-weight:
            850;
        }

        .infoBox p {
          margin:
            2px 0 0;

          color:
            #718397;

          font-size:
            11px;

          line-height:
            1.4;
        }

        .actions {
          margin-top:
            20px;

          display:
            flex;

          align-items:
            center;

          justify-content:
            space-between;

          gap:
            10px;
        }

        .secondaryButton,
        .primaryButton {
          min-height:
            47px;

          padding:
            0 18px;

          display:
            inline-flex;

          align-items:
            center;

          justify-content:
            center;

          border-radius:
            10px;

          font-family:
            inherit;

          font-size:
            13px;

          font-weight:
            850;

          text-decoration:
            none;
        }

        .secondaryButton {
          border:
            1px solid
            #d6e1ec;

          background:
            #ffffff;

          color:
            #64788d;
        }

        .primaryButton {
          min-width:
            140px;

          gap:
            8px;

          border:
            0;

          background:
            #0747c9;

          color:
            #ffffff;

          cursor:
            pointer;

          box-shadow:
            0 8px
            18px
            rgba(
              7,
              71,
              201,
              0.16
            );
        }

        .primaryButton:disabled {
          background:
            #b8c5d5;

          cursor:
            not-allowed;

          box-shadow:
            none;
        }

        .primaryButton span {
          font-size:
            16px;
        }

        @media (
          max-width:
            760px
        ) {
          .relationshipGrid {
            grid-template-columns:
              repeat(
                2,
                minmax(
                  0,
                  1fr
                )
              );
          }
        }

        @media (
          max-width:
            600px
        ) {
          .page {
            padding:
              0 12px
              26px;
          }

          .topbar {
            height:
              66px;
          }

          .brandText span {
            display:
              none;
          }

          .brandText strong {
            font-size:
              16px;
          }

          .backLink {
            padding:
              0 10px;

            font-size:
              12px;
          }

          .card {
            margin-top:
              18px;

            padding:
              19px 15px;

            border-radius:
              16px;
          }

          .heading h1 {
            font-size:
              24px;
          }

          .heading p {
            font-size:
              13px;
          }

          .choiceGrid {
            grid-template-columns:
              1fr;
          }

          .choice {
            min-height:
              120px;
          }

          .relationshipGrid {
            grid-template-columns:
              1fr 1fr;
          }

          .actions {
            flex-direction:
              column-reverse;
          }

          .secondaryButton,
          .primaryButton {
            width:
              100%;
          }
        }
      `}</style>
    </>
  );
}

function RelationshipButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  value: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={
        selected
          ? "relationshipButton selected"
          : "relationshipButton"
      }
      onClick={
        onClick
      }
    >
      {label}
    </button>
  );
}
