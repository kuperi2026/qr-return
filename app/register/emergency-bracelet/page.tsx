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
  const [relationship, setRelationship] =
    useState<Relationship>("");
  const [customRelationship, setCustomRelationship] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [sex, setSex] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);

  const stepOneReady =
    profileFor === "self" ||
    (profileFor === "other" &&
      relationship !== "" &&
      (relationship !== "other" ||
        customRelationship.trim().length > 0));

  const stepTwoReady =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0;

  function goToStepTwo() {
    if (!stepOneReady) return;
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function continueFromStepTwo() {
    if (!stepTwoReady) return;

    console.log({
      profileFor,
      relationship,
      customRelationship,
      firstName,
      lastName,
      dateOfBirth,
      sex,
      photo,
    });

    /*
      შემდეგ ეტაპზე აქ დავამატებთ STEP 3-ს:
      Emergency Contacts
    */
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

          <a href="/register" className="backLink">
            ← პროდუქტები
          </a>
        </header>

        <section className="card">
          <div className="progressRow">
            <span>STEP {step} OF 5</span>

            <div className="progressTrack">
              <div
                className="progressFill"
                style={{ width: `${step * 20}%` }}
              />
            </div>
          </div>

          {step === 1 && (
            <>
              <div className="heading">
                <div className="medicalIcon">+</div>

                <div>
                  <h1>Emergency Bracelet</h1>
                  <p>ვისთვის ქმნით Emergency პროფილს?</p>
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
                    <span className="choiceNumber">01</span>

                    <span className="choiceCheck">
                      {profileFor === "self" ? "✓" : "→"}
                    </span>
                  </div>

                  <div className="choiceIcon">👤</div>

                  <h2>ჩემთვის</h2>

                  <p>
                    შექმენით Emergency პროფილი თქვენი პირადი
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
                  onClick={() => setProfileFor("other")}
                >
                  <div className="choiceTop">
                    <span className="choiceNumber">02</span>

                    <span className="choiceCheck">
                      {profileFor === "other" ? "✓" : "→"}
                    </span>
                  </div>

                  <div className="choiceIcon">👥</div>

                  <h2>სხვა პირისთვის</h2>

                  <p>
                    შექმენით ბავშვის, ოჯახის წევრის ან სხვა პირის
                    Emergency პროფილი.
                  </p>
                </button>
              </div>

              {profileFor === "other" && (
                <section className="relationshipSection">
                  <div className="sectionTitle">
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
                    <div className="field fullField">
                      <label>მიუთითეთ კავშირი *</label>

                      <input
                        type="text"
                        value={customRelationship}
                        onChange={(event) =>
                          setCustomRelationship(event.target.value)
                        }
                        placeholder="მაგ. ოჯახის მეგობარი"
                      />
                    </div>
                  )}
                </section>
              )}

              <div className="infoBox">
                <div className="infoIcon">i</div>

                <div>
                  <strong>
                    ერთი ანგარიში — რამდენიმე Emergency პროფილი
                  </strong>

                  <p>
                    შეგიძლიათ მართოთ თქვენი და სხვა პირების Emergency
                    პროფილები ერთი ანგარიშიდან.
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
                  disabled={!stepOneReady}
                  onClick={goToStepTwo}
                >
                  გაგრძელება <span>→</span>
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="heading">
                <div className="medicalIcon personIcon">👤</div>

                <div>
                  <h1>პირადი ინფორმაცია</h1>

                  <p>
                    შეავსეთ იმ ადამიანის ინფორმაცია, ვისაც Emergency
                    Bracelet ეკუთვნის.
                  </p>
                </div>
              </div>

              {profileFor === "other" && (
                <div className="relationshipSummary">
                  <div>
                    <span>პროფილი იქმნება</span>
                    <strong>სხვა პირისთვის</strong>
                  </div>

                  <div>
                    <span>თქვენი კავშირი</span>

                    <strong>
                      {relationship === "other"
                        ? customRelationship
                        : relationship
                          ? relationshipLabels[
                              relationship as Exclude<
                                Relationship,
                                ""
                              >
                            ]
                          : ""}
                    </strong>
                  </div>
                </div>
              )}

              {profileFor === "self" && (
                <div className="selfNotice">
                  <div className="infoIcon">✓</div>

                  <div>
                    <strong>ეს თქვენი Emergency პროფილია</strong>

                    <p>
                      ქვემოთ შეავსეთ ინფორმაცია, რომელიც ამ სამაჯურის
                      მფლობელს ეკუთვნის.
                    </p>
                  </div>
                </div>
              )}

              <div className="formSection">
                <div className="sectionTitle">
                  <span>PROFILE HOLDER</span>
                  <h3>სამაჯურის მფლობელის მონაცემები</h3>
                </div>

                <div className="formGrid">
                  <div className="field">
                    <label>სახელი *</label>

                    <input
                      type="text"
                      value={firstName}
                      onChange={(event) =>
                        setFirstName(event.target.value)
                      }
                      placeholder="სახელი"
                    />
                  </div>

                  <div className="field">
                    <label>გვარი *</label>

                    <input
                      type="text"
                      value={lastName}
                      onChange={(event) =>
                        setLastName(event.target.value)
                      }
                      placeholder="გვარი"
                    />
                  </div>

                  <div className="field">
                    <label>დაბადების თარიღი</label>

                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(event) =>
                        setDateOfBirth(event.target.value)
                      }
                    />
                  </div>

                  <div className="field">
                    <label>სქესი</label>

                    <select
                      value={sex}
                      onChange={(event) => setSex(event.target.value)}
                    >
                      <option value="">აირჩიეთ</option>
                      <option value="female">ქალი</option>
                      <option value="male">კაცი</option>
                      <option value="other">სხვა</option>
                    </select>
                  </div>
                </div>

                <div className="photoSection">
                  <div className="photoText">
                    <strong>პროფილის ფოტო</strong>

                    <p>
                      დაამატეთ მკაფიო ფოტო, რათა საჭიროების შემთხვევაში
                      ადამიანის იდენტიფიცირება გამარტივდეს.
                    </p>
                  </div>

                  <label className="photoButton">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) =>
                        setPhoto(event.target.files?.[0] || null)
                      }
                    />

                    <span className="uploadIcon">+</span>

                    <span>
                      {photo ? photo.name : "ფოტოს დამატება"}
                    </span>
                  </label>
                </div>
              </div>

              <div className="actions">
                <button
                  type="button"
                  className="secondaryButton"
                  onClick={() => {
                    setStep(1);
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }}
                >
                  ← უკან
                </button>

                <button
                  type="button"
                  className="primaryButton"
                  disabled={!stepTwoReady}
                  onClick={continueFromStepTwo}
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
          gap: 18px;
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

        .backLink {
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

        .heading {
          margin-top: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .medicalIcon {
          width: 49px;
          height: 49px;
          flex: 0 0 49px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          background: #0747c9;
          color: #ffffff;
          font-size: 28px;
          line-height: 1;
        }

        .personIcon {
          font-size: 23px;
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
          min-height: 128px;
          padding: 15px;
          display: flex;
          flex-direction: column;
          border: 1.5px solid #0b52d6;
          border-radius: 14px;
          background: #0b52d6;
          color: #ffffff;
          text-align: left;
          cursor: pointer;
          box-shadow: 0 9px 20px rgba(7, 71, 201, 0.13);
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

        .choiceNumber {
          color: rgba(255, 255, 255, 0.7);
          font-size: 10px;
          font-weight: 900;
        }

        .choiceCheck {
          width: 27px;
          height: 27px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.28);
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.12);
          font-size: 13px;
          font-weight: 900;
        }

        .choiceIcon {
          margin-top: 11px;
          font-size: 25px;
        }

        .choice h2 {
          margin: 8px 0 0;
          color: #ffffff;
          font-size: 20px;
          line-height: 1.15;
          font-weight: 900;
        }

        .choice p {
          margin: 5px 0 0;
          color: rgba(255, 255, 255, 0.84);
          font-size: 13px;
          line-height: 1.4;
        }

        .relationshipSection,
        .formSection {
          margin-top: 22px;
          padding-top: 18px;
          border-top: 1px solid #e1e8f0;
        }

        .sectionTitle > span {
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
          min-height: 48px;
          padding: 0 10px;
          border: 1px solid #d7e2ed;
          border-radius: 10px;
          background: #ffffff;
          color: #536a81;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
        }

        .relationshipButton.selected {
          border-color: #0747c9;
          background: #edf4ff;
          color: #0747c9;
          box-shadow: 0 0 0 3px rgba(7, 71, 201, 0.07);
        }

        .relationshipSummary {
          margin-top: 20px;
          padding: 13px 15px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          border-radius: 12px;
          background: #0747c9;
        }

        .relationshipSummary span,
        .relationshipSummary strong {
          display: block;
        }

        .relationshipSummary span {
          color: rgba(255, 255, 255, 0.72);
          font-size: 11px;
          font-weight: 700;
        }

        .relationshipSummary strong {
          margin-top: 3px;
          color: #ffffff;
          font-size: 14px;
          font-weight: 850;
        }

        .selfNotice,
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

        .selfNotice strong,
        .infoBox strong {
          display: block;
          color: #304a65;
          font-size: 13px;
          font-weight: 850;
        }

        .selfNotice p,
        .infoBox p {
          margin: 2px 0 0;
          color: #718397;
          font-size: 12px;
          line-height: 1.4;
        }

        .formGrid {
          margin-top: 15px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .field label {
          display: block;
          margin: 0 0 7px 2px;
          color: #344e68;
          font-size: 13px;
          font-weight: 850;
        }

        .field input,
        .field select {
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
        .field select:focus {
          border-color: #0747c9;
          box-shadow: 0 0 0 4px rgba(7, 71, 201, 0.08);
        }

        .fullField {
          margin-top: 13px;
        }

        .photoSection {
          margin-top: 17px;
          padding: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          border: 1px solid #dce5ee;
          border-radius: 12px;
          background: #f8fafd;
        }

        .photoText strong {
          color: #304a65;
          font-size: 14px;
          font-weight: 850;
        }

        .photoText p {
          max-width: 430px;
          margin: 4px 0 0;
          color: #718397;
          font-size: 12px;
          line-height: 1.4;
        }

        .photoButton {
          min-width: 160px;
          min-height: 48px;
          padding: 0 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 10px;
          background: #0747c9;
          color: #ffffff;
          font-size: 12px;
          font-weight: 850;
          cursor: pointer;
        }

        .photoButton input {
          display: none;
        }

        .uploadIcon {
          font-size: 19px;
          line-height: 1;
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
          font-size: 13px;
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
          min-width: 140px;
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
          font-size: 16px;
        }

        @media (max-width: 760px) {
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

          .backLink {
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

          .choiceGrid,
          .formGrid,
          .relationshipSummary {
            grid-template-columns: 1fr;
          }

          .choice {
            min-height: 120px;
          }

          .relationshipGrid {
            grid-template-columns: 1fr 1fr;
          }

          .photoSection {
            align-items: stretch;
            flex-direction: column;
          }

          .photoButton {
            width: 100%;
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
