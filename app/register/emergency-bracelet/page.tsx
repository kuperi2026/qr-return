"use client";

import { useState } from "react";

type ProfileFor = "self" | "other" | "";

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

const relationshipLabels: Record<Exclude<Relationship, "">, string> = {
  parent: "მშობელი",
  child: "შვილი",
  spouse: "მეუღლე",
  sibling: "და / ძმა",
  grandparent: "ბებია / ბაბუა",
  caregiver: "მომვლელი",
  guardian: "მეურვე",
  other: "სხვა",
};

export default function EmergencyBraceletPage() {
  const [step, setStep] = useState(1);

  // STEP 1 — ACCOUNT OWNER
  const [ownerFirstName, setOwnerFirstName] = useState("");
  const [ownerLastName, setOwnerLastName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");

  // STEP 2 — WHO IS THIS PROFILE FOR?
  const [profileFor, setProfileFor] = useState<ProfileFor>("");
  const [relationship, setRelationship] =
    useState<Relationship>("");
  const [customRelationship, setCustomRelationship] = useState("");

  const ownerReady =
    ownerFirstName.trim().length > 0 &&
    ownerLastName.trim().length > 0 &&
    ownerPhone.trim().length > 0 &&
    ownerEmail.trim().length > 0;

  const profileChoiceReady =
    profileFor === "self" ||
    (profileFor === "other" &&
      relationship !== "" &&
      (relationship !== "other" ||
        customRelationship.trim().length > 0));

  function goStep(number: number) {
    setStep(number);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <>
      <main className="page">
        <header className="topbar">
          <a href="/" className="brand">
            <div className="brandMark">QR</div>

            <div className="brandText">
              <strong>QR RETURN</strong>
              <span>SMART LOST &amp; FOUND</span>
            </div>
          </a>

          <a href="/register" className="topBack">
            ← პროდუქტები
          </a>
        </header>

        <section className="card">
          <div className="progressHeader">
            <span>STEP {step} OF 6</span>

            <div className="progressTrack">
              <div
                className="progressFill"
                style={{
                  width: `${(step / 6) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* STEP 1 — OWNER INFORMATION */}

          {step === 1 && (
            <>
              <div className="heading">
                <div className="headingIcon">👤</div>

                <div>
                  <span className="eyebrow">
                    ACCOUNT OWNER
                  </span>

                  <h1>მფლობელის ინფორმაცია</h1>

                  <p>
                    შეიყვანეთ იმ პირის მონაცემები, ვინც Emergency
                    პროფილს ქმნის და მართავს.
                  </p>
                </div>
              </div>

              <div className="ownerInfo">
                <div className="ownerInfoIcon">i</div>

                <div>
                  <strong>პროფილის მმართველი</strong>

                  <p>
                    ეს ინფორმაცია ეკუთვნის ანგარიშის მფლობელს და არა
                    აუცილებლად იმ ადამიანს, ვისაც სამაჯური ექნება.
                  </p>
                </div>
              </div>

              <div className="formGrid">
                <div className="field">
                  <label>სახელი *</label>

                  <input
                    type="text"
                    value={ownerFirstName}
                    onChange={(e) =>
                      setOwnerFirstName(e.target.value)
                    }
                    placeholder="სახელი"
                  />
                </div>

                <div className="field">
                  <label>გვარი *</label>

                  <input
                    type="text"
                    value={ownerLastName}
                    onChange={(e) =>
                      setOwnerLastName(e.target.value)
                    }
                    placeholder="გვარი"
                  />
                </div>

                <div className="field">
                  <label>ტელეფონის ნომერი *</label>

                  <input
                    type="tel"
                    value={ownerPhone}
                    onChange={(e) =>
                      setOwnerPhone(e.target.value)
                    }
                    placeholder="+1 000 000 0000"
                  />
                </div>

                <div className="field">
                  <label>ელფოსტა *</label>

                  <input
                    type="email"
                    value={ownerEmail}
                    onChange={(e) =>
                      setOwnerEmail(e.target.value)
                    }
                    placeholder="name@email.com"
                  />
                </div>
              </div>

              <div className="privacyNote">
                <div className="shield">✓</div>

                <div>
                  <strong>Account Information</strong>

                  <p>
                    ეს მონაცემები გამოიყენება პროფილის მართვისა და
                    თქვენთან დაკავშირებისთვის.
                  </p>
                </div>
              </div>

              <div className="actions">
                <a href="/register" className="secondaryButton">
                  ← უკან
                </a>

                <button
                  type="button"
                  className="primaryButton"
                  disabled={!ownerReady}
                  onClick={() => goStep(2)}
                >
                  გაგრძელება
                  <span>→</span>
                </button>
              </div>
            </>
          )}

          {/* STEP 2 — WHO IS THE PROFILE FOR */}

          {step === 2 && (
            <>
              <div className="heading">
                <div className="headingIcon">+</div>

                <div>
                  <span className="eyebrow">
                    EMERGENCY PROFILE
                  </span>

                  <h1>ვისთვის ქმნით პროფილს?</h1>

                  <p>
                    აირჩიეთ, Emergency Bracelet თქვენ გეკუთვნით თუ
                    სხვა პირს.
                  </p>
                </div>
              </div>

              <div className="ownerSummary">
                <div>
                  <span>ანგარიშის მფლობელი</span>

                  <strong>
                    {ownerFirstName} {ownerLastName}
                  </strong>
                </div>

                <div>
                  <span>საკონტაქტო ნომერი</span>
                  <strong>{ownerPhone}</strong>
                </div>

                <div>
                  <span>ელფოსტა</span>
                  <strong>{ownerEmail}</strong>
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
                    setProfileFor("self");
                    setRelationship("");
                    setCustomRelationship("");
                  }}
                >
                  <div className="choiceTop">
                    <span>01</span>

                    <div className="choiceCircle">
                      {profileFor === "self" ? "✓" : "→"}
                    </div>
                  </div>

                  <div className="choiceIcon">👤</div>

                  <h2>ჩემთვის</h2>

                  <p>
                    Emergency Bracelet ეკუთვნის ანგარიშის მფლობელს.
                  </p>
                </button>

                <button
                  type="button"
                  className={
                    profileFor === "other"
                      ? "choice active"
                      : "choice"
                  }
                  onClick={() => setProfileFor("other")}
                >
                  <div className="choiceTop">
                    <span>02</span>

                    <div className="choiceCircle">
                      {profileFor === "other" ? "✓" : "→"}
                    </div>
                  </div>

                  <div className="choiceIcon">👥</div>

                  <h2>სხვა პირისთვის</h2>

                  <p>
                    ბავშვის, ოჯახის წევრის ან სხვა პირის Emergency
                    Bracelet.
                  </p>
                </button>
              </div>

              {profileFor === "other" && (
                <section className="relationshipSection">
                  <div className="sectionHeading">
                    <span>RELATIONSHIP</span>

                    <h3>რა კავშირი გაქვთ ამ პირთან?</h3>
                  </div>

                  <div className="relationshipGrid">
                    {(
                      Object.keys(
                        relationshipLabels
                      ) as Exclude<Relationship, "">[]
                    ).map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={
                          relationship === value
                            ? "relationshipButton selected"
                            : "relationshipButton"
                        }
                        onClick={() => setRelationship(value)}
                      >
                        {relationshipLabels[value]}
                      </button>
                    ))}
                  </div>

                  {relationship === "other" && (
                    <div className="otherField">
                      <label>მიუთითეთ კავშირი *</label>

                      <input
                        type="text"
                        value={customRelationship}
                        onChange={(e) =>
                          setCustomRelationship(e.target.value)
                        }
                        placeholder="მაგ. ოჯახის მეგობარი"
                      />
                    </div>
                  )}
                </section>
              )}

              <div className="actions">
                <button
                  type="button"
                  className="secondaryButton"
                  onClick={() => goStep(1)}
                >
                  ← უკან
                </button>

                <button
                  type="button"
                  className="primaryButton"
                  disabled={!profileChoiceReady}
                  onClick={() => {
                    /*
                      STEP 3 შემდეგ დავამატებთ:
                      Bracelet Holder Information
                    */

                    console.log({
                      ownerFirstName,
                      ownerLastName,
                      ownerPhone,
                      ownerEmail,
                      profileFor,
                      relationship,
                      customRelationship,
                    });
                  }}
                >
                  გაგრძელება
                  <span>→</span>
                </button>
              </div>
            </>
          )}
        </section>
      </main>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
        }

        button,
        input {
          font: inherit;
        }

        .page {
          min-height: 100vh;
          padding: 0 20px 38px;
          background: #0747c9;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Arial,
            sans-serif;
        }

        /* HEADER */

        .topbar {
          width: 100%;
          max-width: 940px;
          height: 72px;
          margin: 0 auto;

          display: flex;
          align-items: center;
          justify-content: space-between;

          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .brandMark {
          width: 42px;
          height: 42px;

          display: grid;
          place-items: center;

          border-radius: 11px;
          background: #ffffff;
          color: #0747c9;

          font-size: 13px;
          font-weight: 950;
        }

        .brandText strong,
        .brandText span {
          display: block;
        }

        .brandText strong {
          color: #ffffff;
          font-size: 18px;
          font-weight: 950;
        }

        .brandText span {
          margin-top: 2px;
          color: rgba(255, 255, 255, 0.72);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.8px;
        }

        .topBack {
          min-height: 40px;
          padding: 0 14px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          border: 1px solid rgba(255, 255, 255, 0.34);
          border-radius: 10px;

          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;

          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
        }

        /* CARD */

        .card {
          width: 100%;
          max-width: 820px;

          margin: 26px auto 0;
          padding: 27px;

          border-radius: 21px;
          background: #ffffff;

          box-shadow: 0 24px 56px rgba(0, 24, 77, 0.25);
        }

        /* PROGRESS */

        .progressHeader {
          display: flex;
          align-items: center;
          gap: 12px;

          color: #0747c9;

          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.8px;
        }

        .progressTrack {
          flex: 1;
          height: 5px;

          overflow: hidden;

          border-radius: 20px;
          background: #e4ebf4;
        }

        .progressFill {
          height: 100%;
          border-radius: 20px;
          background: #0747c9;

          transition: width 0.25s ease;
        }

        /* HEADING */

        .heading {
          margin-top: 18px;

          display: flex;
          align-items: center;
          gap: 13px;
        }

        .headingIcon {
          width: 50px;
          height: 50px;

          flex: 0 0 50px;

          display: grid;
          place-items: center;

          border-radius: 13px;
          background: #0747c9;
          color: #ffffff;

          font-size: 24px;
          font-weight: 700;
        }

        .eyebrow {
          display: block;
          margin-bottom: 3px;

          color: #0747c9;

          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .heading h1 {
          margin: 0;

          color: #203a55;

          font-size: 29px;
          line-height: 1.15;
          font-weight: 900;
        }

        .heading p {
          margin: 4px 0 0;

          color: #718397;

          font-size: 14px;
          line-height: 1.45;
        }

        /* OWNER INFO */

        .ownerInfo,
        .privacyNote {
          margin-top: 20px;
          padding: 12px 14px;

          display: flex;
          align-items: center;
          gap: 11px;

          border: 1px solid #cbdcf4;
          border-radius: 11px;

          background: #f2f6fc;
        }

        .ownerInfoIcon,
        .shield {
          width: 30px;
          height: 30px;

          flex: 0 0 30px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          background: #0747c9;
          color: #ffffff;

          font-size: 12px;
          font-weight: 900;
        }

        .ownerInfo strong,
        .privacyNote strong {
          display: block;

          color: #304a65;

          font-size: 13px;
          font-weight: 850;
        }

        .ownerInfo p,
        .privacyNote p {
          margin: 2px 0 0;

          color: #718397;

          font-size: 12px;
          line-height: 1.4;
        }

        /* FORM */

        .formGrid {
          margin-top: 20px;

          display: grid;

          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 14px;
        }

        .field label,
        .otherField label {
          display: block;

          margin: 0 0 7px 2px;

          color: #344e68;

          font-size: 14px;
          font-weight: 850;
        }

        .field input,
        .otherField input {
          width: 100%;
          height: 56px;

          padding: 0 15px;

          border: 1.5px solid #d5e0eb;
          border-radius: 11px;

          background: #ffffff;
          color: #263f59;

          font-size: 15px;

          outline: none;
        }

        .field input:focus,
        .otherField input:focus {
          border-color: #0747c9;

          box-shadow:
            0 0 0 4px rgba(7, 71, 201, 0.08);
        }

        /* OWNER SUMMARY */

        .ownerSummary {
          margin-top: 20px;
          padding: 14px 16px;

          display: grid;

          grid-template-columns:
            1.1fr 1fr 1.2fr;

          gap: 12px;

          border-radius: 12px;

          background: #0747c9;
        }

        .ownerSummary span,
        .ownerSummary strong {
          display: block;
        }

        .ownerSummary span {
          color: rgba(255, 255, 255, 0.72);

          font-size: 10px;
          font-weight: 700;
        }

        .ownerSummary strong {
          margin-top: 4px;

          color: #ffffff;

          font-size: 13px;
          font-weight: 850;

          overflow-wrap: anywhere;
        }

        /* CHOICES */

        .choiceGrid {
          margin-top: 18px;

          display: grid;

          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 14px;
        }

        .choice {
          min-height: 145px;

          padding: 16px;

          display: flex;
          flex-direction: column;

          border: 1.5px solid #0b52d6;
          border-radius: 14px;

          background: #0b52d6;
          color: #ffffff;

          text-align: left;

          cursor: pointer;

          box-shadow:
            0 9px 20px rgba(7, 71, 201, 0.13);
        }

        .choice:hover {
          background: #0643b6;
        }

        .choice.active {
          background: #063fae;
          border-color: #063fae;

          box-shadow:
            0 0 0 4px rgba(7, 71, 201, 0.11),
            0 13px 26px rgba(7, 71, 201, 0.22);
        }

        .choiceTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .choiceTop > span {
          color: rgba(255, 255, 255, 0.72);

          font-size: 10px;
          font-weight: 900;
        }

        .choiceCircle {
          width: 28px;
          height: 28px;

          display: grid;
          place-items: center;

          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;

          background: rgba(255, 255, 255, 0.12);

          color: #ffffff;

          font-size: 13px;
          font-weight: 900;
        }

        .choiceIcon {
          margin-top: 11px;

          font-size: 24px;
        }

        .choice h2 {
          margin: 7px 0 0;

          color: #ffffff;

          font-size: 21px;
          font-weight: 900;
        }

        .choice p {
          margin: 5px 0 0;

          color: rgba(255, 255, 255, 0.86);

          font-size: 13px;
          line-height: 1.4;
        }

        /* RELATIONSHIP */

        .relationshipSection {
          margin-top: 20px;
          padding-top: 18px;

          border-top: 1px solid #e1e8f0;
        }

        .sectionHeading span {
          color: #0747c9;

          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.9px;
        }

        .sectionHeading h3 {
          margin: 4px 0 0;

          color: #304a65;

          font-size: 17px;
          font-weight: 850;
        }

        .relationshipGrid {
          margin-top: 12px;

          display: grid;

          grid-template-columns:
            repeat(4, minmax(0, 1fr));

          gap: 8px;
        }

        .relationshipButton {
          min-height: 48px;

          padding: 0 10px;

          border: 1px solid #d7e2ed;
          border-radius: 10px;

          background: #ffffff;
          color: #536a81;

          font-size: 13px;
          font-weight: 800;

          cursor: pointer;
        }

        .relationshipButton:hover {
          border-color: #a9c5e8;
          background: #f7faff;
        }

        .relationshipButton.selected {
          border-color: #0747c9;

          background: #edf4ff;
          color: #0747c9;

          box-shadow:
            0 0 0 3px rgba(7, 71, 201, 0.07);
        }

        .otherField {
          margin-top: 14px;
        }

        /* ACTIONS */

        .actions {
          margin-top: 22px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 10px;
        }

        .secondaryButton,
        .primaryButton {
          min-height: 48px;

          padding: 0 19px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          border-radius: 10px;

          font-size: 14px;
          font-weight: 850;

          text-decoration: none;
        }

        .secondaryButton {
          border: 1px solid #d6e1ec;

          background: #ffffff;
          color: #64788d;

          cursor: pointer;
        }

        .primaryButton {
          min-width: 145px;

          gap: 8px;

          border: 0;

          background: #0747c9;
          color: #ffffff;

          cursor: pointer;

          box-shadow:
            0 8px 18px rgba(7, 71, 201, 0.16);
        }

        .primaryButton:disabled {
          background: #b8c5d5;

          cursor: not-allowed;

          box-shadow: none;
        }

        .primaryButton span {
          font-size: 17px;
        }

        /* MOBILE */

        @media (max-width: 700px) {
          .ownerSummary {
            grid-template-columns: 1fr;
          }

          .relationshipGrid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 600px) {
          .page {
            padding: 0 12px 26px;
          }

          .topbar {
            height: 66px;
          }

          .brandText span {
            display: none;
          }

          .brandText strong {
            font-size: 16px;
          }

          .topBack {
            padding: 0 10px;

            font-size: 12px;
          }

          .card {
            margin-top: 18px;

            padding: 19px 15px;

            border-radius: 16px;
          }

          .heading h1 {
            font-size: 24px;
          }

          .heading p {
            font-size: 13px;
          }

          .formGrid,
          .choiceGrid {
            grid-template-columns: 1fr;
          }

          .choice {
            min-height: 135px;
          }

          .actions {
            flex-direction: column-reverse;
          }

          .secondaryButton,
          .primaryButton {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}
