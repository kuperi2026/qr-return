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

  const [profileFor, setProfileFor] = useState<ProfileFor>("");

  const [ownerFirstName, setOwnerFirstName] = useState("");
  const [ownerLastName, setOwnerLastName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");

  const [holderFirstName, setHolderFirstName] = useState("");
  const [holderLastName, setHolderLastName] = useState("");
  const [holderBirthDate, setHolderBirthDate] = useState("");
  const [holderSex, setHolderSex] = useState("");
  const [relationship, setRelationship] =
    useState<Relationship>("");
  const [customRelationship, setCustomRelationship] = useState("");

  const ownerReady =
    ownerFirstName.trim() !== "" &&
    ownerLastName.trim() !== "" &&
    ownerPhone.trim() !== "" &&
    ownerEmail.trim() !== "";

  const holderReady =
    holderFirstName.trim() !== "" &&
    holderLastName.trim() !== "" &&
    relationship !== "" &&
    (relationship !== "other" ||
      customRelationship.trim() !== "");

  function goToStep(number: number) {
    setStep(number);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function continueFromOwner() {
    if (!ownerReady) return;

    if (profileFor === "other") {
      goToStep(3);
      return;
    }

    /*
      თუ პროფილი "ჩემთვის" არის:
      Owner = Bracelet Holder.

      შემდეგ აქ დავამატებთ Emergency Information Step-ს.
    */

    console.log({
      profileFor,
      ownerFirstName,
      ownerLastName,
      ownerPhone,
      ownerEmail,
    });
  }

  function continueFromHolder() {
    if (!holderReady) return;

    /*
      შემდეგი ეტაპი:
      Emergency Information
    */

    console.log({
      profileFor,
      ownerFirstName,
      ownerLastName,
      ownerPhone,
      ownerEmail,
      holderFirstName,
      holderLastName,
      holderBirthDate,
      holderSex,
      relationship,
      customRelationship,
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

          <a href="/register" className="topButton">
            ← პროდუქტები
          </a>
        </header>

        <section className="card">
          <div className="progressRow">
            <span>EMERGENCY REGISTRATION</span>

            <div className="progressTrack">
              <div
                className="progressFill"
                style={{
                  width:
                    step === 1
                      ? "25%"
                      : step === 2
                        ? "50%"
                        : "75%",
                }}
              />
            </div>

            <strong>STEP {step}</strong>
          </div>

          {/* STEP 1 */}

          {step === 1 && (
            <>
              <div className="heading">
                <div className="headingIcon">+</div>

                <div>
                  <span className="eyebrow">EMERGENCY PROFILE</span>

                  <h1>ვისთვის ქმნით პროფილს?</h1>

                  <p>
                    აირჩიეთ, Emergency Bracelet თქვენთვისაა თუ სხვა
                    პირისთვის.
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
                  onClick={() => setProfileFor("self")}
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
                    Emergency Bracelet და პროფილი განკუთვნილია
                    თქვენთვის.
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

              <div className="infoBox">
                <div className="infoIcon">i</div>

                <div>
                  <strong>პროფილის ტიპი</strong>

                  <p>
                    შემდეგ ეტაპზე შეიყვანთ იმ ადამიანის ინფორმაციას,
                    ვინც ამ Emergency პროფილს ქმნის და მართავს.
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
                  disabled={!profileFor}
                  onClick={() => goToStep(2)}
                >
                  გაგრძელება <span>→</span>
                </button>
              </div>
            </>
          )}

          {/* STEP 2 */}

          {step === 2 && (
            <>
              <div className="heading">
                <div className="headingIcon">👤</div>

                <div>
                  <span className="eyebrow">PROFILE CREATOR</span>

                  <h1>შემქმნელის ინფორმაცია</h1>

                  <p>
                    შეიყვანეთ იმ პირის მონაცემები, ვინც ამ Emergency
                    პროფილს ქმნის და მართავს.
                  </p>
                </div>
              </div>

              <div className="selectedType">
                <div>
                  <span>პროფილი იქმნება</span>

                  <strong>
                    {profileFor === "self"
                      ? "ჩემთვის"
                      : "სხვა პირისთვის"}
                  </strong>
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
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    placeholder="+1 000 000 0000"
                  />
                </div>

                <div className="field">
                  <label>ელფოსტა *</label>

                  <input
                    type="email"
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                    placeholder="name@email.com"
                  />
                </div>
              </div>

              <div className="infoBox">
                <div className="infoIcon">i</div>

                <div>
                  <strong>ანგარიშის მმართველი</strong>

                  <p>
                    ეს არის იმ ადამიანის საკონტაქტო ინფორმაცია, ვინც
                    პროფილს მართავს.
                  </p>
                </div>
              </div>

              <div className="actions">
                <button
                  type="button"
                  className="secondaryButton"
                  onClick={() => goToStep(1)}
                >
                  ← უკან
                </button>

                <button
                  type="button"
                  className="primaryButton"
                  disabled={!ownerReady}
                  onClick={continueFromOwner}
                >
                  გაგრძელება <span>→</span>
                </button>
              </div>
            </>
          )}

          {/* STEP 3 — ONLY FOR OTHER PERSON */}

          {step === 3 && profileFor === "other" && (
            <>
              <div className="heading">
                <div className="headingIcon">👥</div>

                <div>
                  <span className="eyebrow">BRACELET HOLDER</span>

                  <h1>ვისთვის იქმნება პროფილი?</h1>

                  <p>
                    შეიყვანეთ იმ ადამიანის მონაცემები, ვისაც Emergency
                    Bracelet ეკუთვნის.
                  </p>
                </div>
              </div>

              <div className="creatorSummary">
                <div>
                  <span>პროფილის შემქმნელი</span>

                  <strong>
                    {ownerFirstName} {ownerLastName}
                  </strong>
                </div>

                <div>
                  <span>ტელეფონი</span>
                  <strong>{ownerPhone}</strong>
                </div>

                <div>
                  <span>ელფოსტა</span>
                  <strong>{ownerEmail}</strong>
                </div>
              </div>

              <div className="formGrid holderGrid">
                <div className="field">
                  <label>სახელი *</label>

                  <input
                    type="text"
                    value={holderFirstName}
                    onChange={(e) =>
                      setHolderFirstName(e.target.value)
                    }
                    placeholder="სახელი"
                  />
                </div>

                <div className="field">
                  <label>გვარი *</label>

                  <input
                    type="text"
                    value={holderLastName}
                    onChange={(e) =>
                      setHolderLastName(e.target.value)
                    }
                    placeholder="გვარი"
                  />
                </div>

                <div className="field">
                  <label>დაბადების თარიღი</label>

                  <input
                    type="date"
                    value={holderBirthDate}
                    onChange={(e) =>
                      setHolderBirthDate(e.target.value)
                    }
                  />
                </div>

                <div className="field">
                  <label>სქესი</label>

                  <select
                    value={holderSex}
                    onChange={(e) => setHolderSex(e.target.value)}
                  >
                    <option value="">აირჩიეთ</option>
                    <option value="female">ქალი</option>
                    <option value="male">კაცი</option>
                    <option value="other">სხვა</option>
                  </select>
                </div>
              </div>

              <section className="relationshipSection">
                <div className="sectionTitle">
                  <span>RELATIONSHIP</span>

                  <h3>
                    რა კავშირი აქვს პროფილის შემქმნელს ამ პირთან?
                  </h3>
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
                  <div className="customRelationship">
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

              <div className="actions">
                <button
                  type="button"
                  className="secondaryButton"
                  onClick={() => goToStep(2)}
                >
                  ← უკან
                </button>

                <button
                  type="button"
                  className="primaryButton"
                  disabled={!holderReady}
                  onClick={continueFromHolder}
                >
                  გაგრძელება <span>→</span>
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
        input,
        select {
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

        .topButton {
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

        .card {
          width: 100%;
          max-width: 820px;
          margin: 26px auto 0;
          padding: 27px;
          border-radius: 21px;
          background: #ffffff;
          box-shadow: 0 24px 56px rgba(0, 24, 77, 0.25);
        }

        .progressRow {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #0747c9;
          font-size: 10px;
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

        .progressRow strong {
          white-space: nowrap;
          font-size: 10px;
        }

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

        .choiceGrid {
          margin-top: 23px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .choice {
          min-height: 130px;
          padding: 15px 16px;
          display: flex;
          flex-direction: column;
          border: 1px solid #0b52d6;
          border-radius: 14px;
          background: #0b52d6;
          color: #ffffff;
          text-align: left;
          cursor: pointer;
          box-shadow: 0 9px 20px rgba(7, 71, 201, 0.13);
        }

        .choice:hover,
        .choice.active {
          background: #063fae;
        }

        .choice.active {
          box-shadow:
            0 0 0 4px rgba(7, 71, 201, 0.1),
            0 12px 25px rgba(7, 71, 201, 0.2);
        }

        .choiceTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .choiceTop > span {
          color: rgba(255, 255, 255, 0.7);
          font-size: 10px;
          font-weight: 900;
        }

        .choiceCircle {
          width: 27px;
          height: 27px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.12);
          font-size: 13px;
          font-weight: 900;
        }

        .choiceIcon {
          margin-top: 10px;
          font-size: 24px;
        }

        .choice h2 {
          margin: 7px 0 0;
          color: #ffffff;
          font-size: 20px;
          font-weight: 900;
        }

        .choice p {
          margin: 5px 0 0;
          color: rgba(255, 255, 255, 0.86);
          font-size: 13px;
          line-height: 1.4;
        }

        .infoBox {
          margin-top: 20px;
          padding: 11px 13px;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid #cbdcf4;
          border-radius: 11px;
          background: #f2f6fc;
        }

        .infoIcon {
          width: 29px;
          height: 29px;
          flex: 0 0 29px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #0747c9;
          color: #ffffff;
          font-size: 12px;
          font-weight: 900;
        }

        .infoBox strong {
          display: block;
          color: #304a65;
          font-size: 13px;
          font-weight: 850;
        }

        .infoBox p {
          margin: 2px 0 0;
          color: #718397;
          font-size: 12px;
          line-height: 1.4;
        }

        .selectedType {
          margin-top: 20px;
          padding: 11px 14px;
          border-radius: 11px;
          background: #0747c9;
        }

        .selectedType span,
        .selectedType strong {
          display: block;
        }

        .selectedType span {
          color: rgba(255, 255, 255, 0.7);
          font-size: 10px;
          font-weight: 700;
        }

        .selectedType strong {
          margin-top: 3px;
          color: #ffffff;
          font-size: 14px;
          font-weight: 850;
        }

        .formGrid {
          margin-top: 19px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .field label,
        .customRelationship label {
          display: block;
          margin: 0 0 7px 2px;
          color: #344e68;
          font-size: 14px;
          font-weight: 850;
        }

        .field input,
        .field select,
        .customRelationship input {
          width: 100%;
          height: 54px;
          padding: 0 15px;
          border: 1.5px solid #d5e0eb;
          border-radius: 10px;
          background: #ffffff;
          color: #263f59;
          font-size: 15px;
          outline: none;
        }

        .field input:focus,
        .field select:focus,
        .customRelationship input:focus {
          border-color: #0747c9;
          box-shadow: 0 0 0 4px rgba(7, 71, 201, 0.08);
        }

        .creatorSummary {
          margin-top: 20px;
          padding: 13px 15px;
          display: grid;
          grid-template-columns: 1.1fr 1fr 1.2fr;
          gap: 12px;
          border-radius: 11px;
          background: #0747c9;
        }

        .creatorSummary span,
        .creatorSummary strong {
          display: block;
        }

        .creatorSummary span {
          color: rgba(255, 255, 255, 0.7);
          font-size: 10px;
          font-weight: 700;
        }

        .creatorSummary strong {
          margin-top: 3px;
          color: #ffffff;
          font-size: 13px;
          font-weight: 850;
          overflow-wrap: anywhere;
        }

        .relationshipSection {
          margin-top: 20px;
          padding-top: 17px;
          border-top: 1px solid #e1e8f0;
        }

        .sectionTitle span {
          color: #0747c9;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.9px;
        }

        .sectionTitle h3 {
          margin: 4px 0 0;
          color: #304a65;
          font-size: 17px;
          font-weight: 850;
        }

        .relationshipGrid {
          margin-top: 12px;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 8px;
        }

        .relationshipButton {
          min-height: 47px;
          padding: 0 8px;
          border: 1px solid #d7e2ed;
          border-radius: 9px;
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
          box-shadow: 0 0 0 3px rgba(7, 71, 201, 0.07);
        }

        .customRelationship {
          margin-top: 13px;
        }

        .actions {
          margin-top: 21px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .secondaryButton,
        .primaryButton {
          min-height: 47px;
          padding: 0 18px;
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
          box-shadow: 0 8px 18px rgba(7, 71, 201, 0.16);
        }

        .primaryButton:disabled {
          background: #b8c5d5;
          cursor: not-allowed;
          box-shadow: none;
        }

        .primaryButton span {
          font-size: 17px;
        }

        @media (max-width: 700px) {
          .creatorSummary {
            grid-template-columns: 1fr;
          }

          .relationshipGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
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

          .card {
            margin-top: 18px;
            padding: 19px 15px;
            border-radius: 16px;
          }

          .progressRow > span {
            display: none;
          }

          .heading h1 {
            font-size: 24px;
          }

          .heading p {
            font-size: 13px;
          }

          .choiceGrid,
          .formGrid {
            grid-template-columns: 1fr;
          }

          .choice {
            min-height: 125px;
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
