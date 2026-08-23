"use client";

import { useState } from "react";

import EmergencyStep1 from "./components/EmergencyStep1";
import EmergencyStep2 from "./components/EmergencyStep2";
import EmergencyStep3 from "./components/EmergencyStep3";
import EmergencyStep4 from "./components/EmergencyStep4";
import EmergencyStep5 from "./components/EmergencyStep5";
import EmergencyStep6 from "./components/EmergencyStep6";

import type {
  ProfileFor,
  Relationship,
} from "./components/emergencyTypes";

export default function EmergencyBraceletPage() {
  const [step, setStep] = useState(1);

  /* STEP 1 */

  const [tagCode, setTagCode] = useState("");

  const [profileFor, setProfileFor] =
    useState<ProfileFor>("");

  /* STEP 2 — CREATOR */

  const [ownerFirstName, setOwnerFirstName] =
    useState("");

  const [ownerLastName, setOwnerLastName] =
    useState("");

  const [ownerPhone, setOwnerPhone] =
    useState("");

  const [ownerEmail, setOwnerEmail] =
    useState("");

  /* STEP 3 — HOLDER */

  const [holderFirstName, setHolderFirstName] =
    useState("");

  const [holderLastName, setHolderLastName] =
    useState("");

  const [holderBirthDate, setHolderBirthDate] =
    useState("");

  const [holderSex, setHolderSex] =
    useState("");

  const [relationship, setRelationship] =
    useState<Relationship>("");

  const [
    customRelationship,
    setCustomRelationship,
  ] = useState("");

  /* STEP 4 — MEDICAL */

  const [bloodGroup, setBloodGroup] =
    useState("");

  const [allergies, setAllergies] =
    useState("");

  const [
    medicalConditions,
    setMedicalConditions,
  ] = useState("");

  const [medications, setMedications] =
    useState("");

  const [medicalNotes, setMedicalNotes] =
    useState("");

  /* STEP 5 — CONTACTS */

  const [
    primaryContactEnabled,
    setPrimaryContactEnabled,
  ] = useState(false);

  const [
    emergencyFirstName,
    setEmergencyFirstName,
  ] = useState("");

  const [
    emergencyLastName,
    setEmergencyLastName,
  ] = useState("");

  const [emergencyPhone, setEmergencyPhone] =
    useState("");

  const [
    emergencyRelationship,
    setEmergencyRelationship,
  ] = useState("");

  const [
    secondContactEnabled,
    setSecondContactEnabled,
  ] = useState(false);

  const [secondFirstName, setSecondFirstName] =
    useState("");

  const [secondLastName, setSecondLastName] =
    useState("");

  const [secondPhone, setSecondPhone] =
    useState("");

  const [
    secondRelationship,
    setSecondRelationship,
  ] = useState("");

  /* STEP 6 — VISIBILITY */

  const [showName, setShowName] =
    useState(true);

  const [
    showBirthDate,
    setShowBirthDate,
  ] = useState(true);

  const [showSex, setShowSex] =
    useState(false);

  const [
    showBloodGroup,
    setShowBloodGroup,
  ] = useState(true);

  const [
    showAllergies,
    setShowAllergies,
  ] = useState(true);

  const [
    showConditions,
    setShowConditions,
  ] = useState(true);

  const [
    showMedications,
    setShowMedications,
  ] = useState(true);

  const [
    showMedicalNotes,
    setShowMedicalNotes,
  ] = useState(false);

  const [
    showPrimaryContact,
    setShowPrimaryContact,
  ] = useState(true);

  const [
    showSecondContact,
    setShowSecondContact,
  ] = useState(false);

  const holderName =
    profileFor === "self"
      ? `${ownerFirstName} ${ownerLastName}`.trim()
      : `${holderFirstName} ${holderLastName}`.trim();

  function goToStep(number: number) {
    setStep(number);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleProfileForChange(
    value: ProfileFor
  ) {
    setProfileFor(value);

    if (value === "self") {
      setRelationship("");
      setCustomRelationship("");
    }
  }

  function continueFromCreator() {
    if (profileFor === "self") {
      setHolderFirstName(ownerFirstName);
      setHolderLastName(ownerLastName);

      goToStep(4);

      return;
    }

    goToStep(3);
  }

  function createEmergencyProfile() {
    const payload = {
      tagCode:
        tagCode.trim().toUpperCase(),

      profileType:
        "emergency_bracelet",

      profileFor,

      creator: {
        firstName:
          ownerFirstName.trim(),

        lastName:
          ownerLastName.trim(),

        phone:
          ownerPhone.trim(),

        email:
          ownerEmail.trim(),
      },

      holder: {
        firstName:
          profileFor === "self"
            ? ownerFirstName.trim()
            : holderFirstName.trim(),

        lastName:
          profileFor === "self"
            ? ownerLastName.trim()
            : holderLastName.trim(),

        birthDate:
          holderBirthDate,

        sex:
          holderSex,
      },

      relationship:
        profileFor === "other"
          ? relationship
          : null,

      customRelationship:
        profileFor === "other" &&
        relationship === "other"
          ? customRelationship.trim()
          : null,

      medical: {
        bloodGroup,
        allergies,
        medicalConditions,
        medications,
        medicalNotes,
      },

      contacts: {
        default: {
          firstName:
            ownerFirstName.trim(),

          lastName:
            ownerLastName.trim(),

          phone:
            ownerPhone.trim(),
        },

        primary:
          primaryContactEnabled
            ? {
                firstName:
                  emergencyFirstName.trim(),

                lastName:
                  emergencyLastName.trim(),

                phone:
                  emergencyPhone.trim(),

                relationship:
                  emergencyRelationship.trim(),
              }
            : null,

        secondary:
          secondContactEnabled
            ? {
                firstName:
                  secondFirstName.trim(),

                lastName:
                  secondLastName.trim(),

                phone:
                  secondPhone.trim(),

                relationship:
                  secondRelationship.trim(),
              }
            : null,
      },

      visibility: {
        showName,
        showBirthDate,
        showSex,
        showBloodGroup,
        showAllergies,
        showConditions,
        showMedications,
        showMedicalNotes,
        showPrimaryContact,
        showSecondContact,
      },

      security: {
        profileTypeLocked: true,
        profileForLocked: true,
        tagCodeLocked: true,
        holderIdentityLocked: true,

        holderFirstNameChangeUsed: false,
      },
    };

    console.log(
      "EMERGENCY PROFILE:",
      payload
    );

    alert(
      "Emergency პროფილის ფორმა მზადაა. შემდეგ ეტაპზე Supabase-ში შენახვას მივაბამთ."
    );
  }

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
            className="topButton"
          >
            ← პროდუქტები
          </a>
        </header>

        <section className="card">
          <div className="progressRow">
            <span>
              EMERGENCY REGISTRATION
            </span>

            <div className="progressTrack">
              <div
                className="progressFill"
                style={{
                  width:
                    `${(step / 6) * 100}%`,
                }}
              />
            </div>

            <strong>
              STEP {step} OF 6
            </strong>
          </div>

          {step === 1 && (
            <EmergencyStep1
              tagCode={tagCode}
              setTagCode={setTagCode}
              profileFor={profileFor}
              setProfileFor={
                handleProfileForChange
              }
              onBack={() => {
                window.location.href =
                  "/register";
              }}
              onNext={() =>
                goToStep(2)
              }
            />
          )}

          {step === 2 && (
            <EmergencyStep2
              profileFor={profileFor}
              ownerFirstName={
                ownerFirstName
              }
              ownerLastName={
                ownerLastName
              }
              ownerPhone={
                ownerPhone
              }
              ownerEmail={
                ownerEmail
              }
              setOwnerFirstName={
                setOwnerFirstName
              }
              setOwnerLastName={
                setOwnerLastName
              }
              setOwnerPhone={
                setOwnerPhone
              }
              setOwnerEmail={
                setOwnerEmail
              }
              tagCode={tagCode}
              onBack={() =>
                goToStep(1)
              }
              onNext={
                continueFromCreator
              }
            />
          )}

          {step === 3 &&
            profileFor === "other" && (
              <EmergencyStep3
                tagCode={tagCode}
                ownerFirstName={
                  ownerFirstName
                }
                ownerLastName={
                  ownerLastName
                }
                ownerPhone={
                  ownerPhone
                }
                ownerEmail={
                  ownerEmail
                }
                holderFirstName={
                  holderFirstName
                }
                holderLastName={
                  holderLastName
                }
                holderBirthDate={
                  holderBirthDate
                }
                holderSex={
                  holderSex
                }
                relationship={
                  relationship
                }
                customRelationship={
                  customRelationship
                }
                setHolderFirstName={
                  setHolderFirstName
                }
                setHolderLastName={
                  setHolderLastName
                }
                setHolderBirthDate={
                  setHolderBirthDate
                }
                setHolderSex={
                  setHolderSex
                }
                setRelationship={
                  setRelationship
                }
                setCustomRelationship={
                  setCustomRelationship
                }
                onBack={() =>
                  goToStep(2)
                }
                onNext={() =>
                  goToStep(4)
                }
              />
            )}

          {step === 4 && (
            <EmergencyStep4
              holderName={
                holderName
              }
              tagCode={tagCode}
              bloodGroup={
                bloodGroup
              }
              allergies={
                allergies
              }
              medicalConditions={
                medicalConditions
              }
              medications={
                medications
              }
              medicalNotes={
                medicalNotes
              }
              setBloodGroup={
                setBloodGroup
              }
              setAllergies={
                setAllergies
              }
              setMedicalConditions={
                setMedicalConditions
              }
              setMedications={
                setMedications
              }
              setMedicalNotes={
                setMedicalNotes
              }
              onBack={() =>
                goToStep(
                  profileFor === "other"
                    ? 3
                    : 2
                )
              }
              onNext={() =>
                goToStep(5)
              }
            />
          )}

          {step === 5 && (
            <EmergencyStep5
              holderName={
                holderName
              }
              tagCode={tagCode}
              ownerFirstName={
                ownerFirstName
              }
              ownerLastName={
                ownerLastName
              }
              ownerPhone={
                ownerPhone
              }
              primaryContactEnabled={
                primaryContactEnabled
              }
              setPrimaryContactEnabled={
                setPrimaryContactEnabled
              }
              emergencyFirstName={
                emergencyFirstName
              }
              emergencyLastName={
                emergencyLastName
              }
              emergencyPhone={
                emergencyPhone
              }
              emergencyRelationship={
                emergencyRelationship
              }
              setEmergencyFirstName={
                setEmergencyFirstName
              }
              setEmergencyLastName={
                setEmergencyLastName
              }
              setEmergencyPhone={
                setEmergencyPhone
              }
              setEmergencyRelationship={
                setEmergencyRelationship
              }
              secondContactEnabled={
                secondContactEnabled
              }
              setSecondContactEnabled={
                setSecondContactEnabled
              }
              secondFirstName={
                secondFirstName
              }
              secondLastName={
                secondLastName
              }
              secondPhone={
                secondPhone
              }
              secondRelationship={
                secondRelationship
              }
              setSecondFirstName={
                setSecondFirstName
              }
              setSecondLastName={
                setSecondLastName
              }
              setSecondPhone={
                setSecondPhone
              }
              setSecondRelationship={
                setSecondRelationship
              }
              onBack={() =>
                goToStep(4)
              }
              onNext={() =>
                goToStep(6)
              }
            />
          )}

          {step === 6 && (
            <EmergencyStep6
              tagCode={tagCode}
              profileFor={profileFor}
              holderName={
                holderName
              }
              holderBirthDate={
                holderBirthDate
              }
              holderSex={
                holderSex
              }
              ownerFirstName={
                ownerFirstName
              }
              ownerLastName={
                ownerLastName
              }
              ownerPhone={
                ownerPhone
              }
              relationship={
                relationship
              }
              customRelationship={
                customRelationship
              }
              bloodGroup={
                bloodGroup
              }
              allergies={
                allergies
              }
              medicalConditions={
                medicalConditions
              }
              medications={
                medications
              }
              medicalNotes={
                medicalNotes
              }
              primaryContactEnabled={
                primaryContactEnabled
              }
              emergencyFirstName={
                emergencyFirstName
              }
              emergencyLastName={
                emergencyLastName
              }
              emergencyPhone={
                emergencyPhone
              }
              emergencyRelationship={
                emergencyRelationship
              }
              secondContactEnabled={
                secondContactEnabled
              }
              secondFirstName={
                secondFirstName
              }
              secondLastName={
                secondLastName
              }
              secondPhone={
                secondPhone
              }
              secondRelationship={
                secondRelationship
              }
              showName={
                showName
              }
              setShowName={
                setShowName
              }
              showBirthDate={
                showBirthDate
              }
              setShowBirthDate={
                setShowBirthDate
              }
              showSex={
                showSex
              }
              setShowSex={
                setShowSex
              }
              showBloodGroup={
                showBloodGroup
              }
              setShowBloodGroup={
                setShowBloodGroup
              }
              showAllergies={
                showAllergies
              }
              setShowAllergies={
                setShowAllergies
              }
              showConditions={
                showConditions
              }
              setShowConditions={
                setShowConditions
              }
              showMedications={
                showMedications
              }
              setShowMedications={
                setShowMedications
              }
              showMedicalNotes={
                showMedicalNotes
              }
              setShowMedicalNotes={
                setShowMedicalNotes
              }
              showPrimaryContact={
                showPrimaryContact
              }
              setShowPrimaryContact={
                setShowPrimaryContact
              }
              showSecondContact={
                showSecondContact
              }
              setShowSecondContact={
                setShowSecondContact
              }
              onBack={() =>
                goToStep(5)
              }
              onCreate={
                createEmergencyProfile
              }
            />
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
        select,
        textarea {
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

          color:
            rgba(
              255,
              255,
              255,
              0.72
            );

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

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.34
            );

          border-radius: 10px;

          background:
            rgba(
              255,
              255,
              255,
              0.08
            );

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

          box-shadow:
            0 24px 56px
            rgba(
              0,
              24,
              77,
              0.25
            );
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

          transition: width 0.2s ease;
        }

        .progressRow strong {
          white-space: nowrap;
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

          font-size: 23px;
          font-weight: 800;
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
          font-weight: 900;
          line-height: 1.15;
        }

        .heading p {
          margin: 4px 0 0;

          color: #718397;

          font-size: 14px;
          line-height: 1.45;
        }

        .qrSection {
          margin-top: 21px;

          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;

          align-items: end;
        }

        .qrHelp {
          min-height: 83px;
          padding: 11px 13px;

          border: 1px solid #cbdcf4;
          border-radius: 11px;

          background: #f2f6fc;
        }

        .qrHelp span {
          color: #0747c9;

          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.8px;
        }

        .qrHelp strong {
          display: block;
          margin-top: 3px;

          color: #304a65;

          font-size: 12px;
          font-weight: 850;
        }

        .qrHelp p {
          margin: 3px 0 0;

          color: #718397;

          font-size: 10px;
          line-height: 1.4;
        }

        .choiceGrid {
          margin-top: 18px;

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
        }

        .choice.active {
          background: #063fae;

          box-shadow:
            0 0 0 4px
            rgba(
              7,
              71,
              201,
              0.1
            );
        }

        .choiceTop {
          display: flex;
          justify-content: space-between;
        }

        .choiceTop > span {
          color:
            rgba(
              255,
              255,
              255,
              0.72
            );

          font-size: 10px;
          font-weight: 900;
        }

        .choiceCircle {
          width: 27px;
          height: 27px;

          display: grid;
          place-items: center;

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.3
            );

          border-radius: 50%;

          background:
            rgba(
              255,
              255,
              255,
              0.12
            );
        }

        .choiceIcon {
          margin-top: 9px;
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

          color:
            rgba(
              255,
              255,
              255,
              0.86
            );

          font-size: 13px;
          line-height: 1.4;
        }

        .infoBox,
        .optionalNotice,
        .finalNotice,
        .nameWarning {
          margin-top: 18px;
          padding: 10px 12px;

          display: flex;
          align-items: center;
          gap: 9px;

          border: 1px solid #cbdcf4;
          border-radius: 10px;

          background: #f2f6fc;
        }

        .infoIcon,
        .optionalNotice > div,
        .finalNotice > div,
        .nameWarning > div {
          width: 28px;
          height: 28px;
          flex: 0 0 28px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          background: #0747c9;
          color: #ffffff;

          font-size: 11px;
          font-weight: 900;
        }

        .infoBox strong {
          display: block;
          color: #304a65;

          font-size: 13px;
          font-weight: 850;
        }

        .infoBox p,
        .optionalNotice p,
        .finalNotice p,
        .nameWarning p {
          margin: 2px 0 0;

          color: #718397;

          font-size: 12px;
          line-height: 1.4;
        }

        .topSummary,
        .creatorSummary,
        .lockedSummary {
          margin-top: 19px;
          padding: 12px 14px;

          display: grid;
          gap: 10px;

          border-radius: 10px;
          background: #0747c9;
        }

        .topSummary {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .creatorSummary,
        .lockedSummary {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .summaryItem span,
        .summaryItem strong {
          display: block;
        }

        .summaryItem span {
          color:
            rgba(
              255,
              255,
              255,
              0.68
            );

          font-size: 9px;
        }

        .summaryItem strong {
          margin-top: 3px;

          color: #ffffff;

          font-size: 12px;

          overflow-wrap: anywhere;
        }

        .formGrid,
        .textareaGrid {
          margin-top: 17px;

          display: grid;

          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .field {
          min-width: 0;
        }

        .field label {
          display: block;
          margin: 0 0 7px 2px;

          color: #344e68;

          font-size: 14px;
          font-weight: 850;
        }

        .field input,
        .field select {
          width: 100%;
          height: 56px;

          padding: 0 15px;

          border: 1.5px solid #d5e0eb;
          border-radius: 10px;

          background: #ffffff;
          color: #263f59;

          font-size: 15px;
          outline: none;
        }

        .field textarea {
          width: 100%;
          min-height: 94px;

          padding: 12px 14px;

          resize: vertical;

          border: 1.5px solid #d5e0eb;
          border-radius: 10px;

          background: #ffffff;
          color: #263f59;

          font-size: 14px;
          line-height: 1.45;
          outline: none;
        }

        .field input:focus,
        .field select:focus,
        .field textarea:focus {
          border-color: #0747c9;

          box-shadow:
            0 0 0 4px
            rgba(
              7,
              71,
              201,
              0.08
            );
        }

        .subSection {
          margin-top: 18px;
          padding-top: 16px;

          border-top: 1px solid #e1e8f0;
        }

        .firstSection {
          margin-top: 20px;
        }

        .sectionTitle > span {
          color: #0747c9;

          font-size: 9px;
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
          margin-top: 11px;

          display: grid;

          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 7px;
        }

        .relationshipButton {
          min-height: 46px;

          border: 1px solid #d7e2ed;
          border-radius: 9px;

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
        }

        .singleField {
          margin-top: 12px;
        }

        .holderSummary {
          margin-top: 19px;
          padding: 12px 14px;

          display: flex;
          align-items: center;
          gap: 10px;

          border-radius: 11px;

          background: #0747c9;
        }

        .holderAvatar {
          width: 38px;
          height: 38px;

          display: grid;
          place-items: center;

          border-radius: 10px;

          background:
            rgba(
              255,
              255,
              255,
              0.15
            );
        }

        .holderSummary span,
        .holderSummary strong,
        .holderSummary p {
          display: block;
        }

        .holderSummary span {
          color:
            rgba(
              255,
              255,
              255,
              0.68
            );

          font-size: 9px;
          font-weight: 900;
        }

        .holderSummary strong {
          margin-top: 2px;

          color: #ffffff;

          font-size: 15px;
        }

        .holderSummary p {
          margin: 2px 0 0;

          color:
            rgba(
              255,
              255,
              255,
              0.75
            );

          font-size: 10px;
        }

        .optionalBox {
          min-height: 56px;
          padding: 9px 12px;

          display: flex;
          flex-direction: column;
          justify-content: center;

          border: 1px solid #dce5ee;
          border-radius: 10px;

          background: #f8fafd;
        }

        .optionalBox span {
          color: #0747c9;

          font-size: 8px;
          font-weight: 900;
        }

        .optionalBox strong {
          margin-top: 2px;

          color: #304a65;

          font-size: 12px;
        }

        .optionalBox p {
          margin: 2px 0 0;

          color: #7a8999;

          font-size: 10px;
        }

        .creatorContact {
          margin-top: 19px;
          padding: 12px 14px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 12px;

          border-radius: 11px;
          background: #0747c9;
        }

        .creatorContact span,
        .creatorContact strong,
        .creatorContact p {
          display: block;
        }

        .creatorContact > div > span {
          color:
            rgba(
              255,
              255,
              255,
              0.7
            );

          font-size: 8px;
          font-weight: 900;
        }

        .creatorContact strong {
          margin-top: 2px;

          color: #ffffff;

          font-size: 14px;
        }

        .creatorContact p {
          margin: 2px 0 0;

          color:
            rgba(
              255,
              255,
              255,
              0.82
            );

          font-size: 12px;
        }

        .requiredBadge {
          padding: 6px 8px;

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.25
            );

          border-radius: 999px;

          background:
            rgba(
              255,
              255,
              255,
              0.12
            );

          color:
            #ffffff !important;

          font-size:
            8px !important;

          font-weight: 900;
        }

        .sectionWithToggle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
        }

        .miniToggle {
          width: 70px;
          height: 34px;

          border: 1px solid #d5e0eb;
          border-radius: 999px;

          background: #f4f6f9;
          color: #8090a0;

          font-size: 10px;
          font-weight: 900;

          cursor: pointer;
        }

        .miniToggle.on {
          border-color: #0747c9;

          background: #0747c9;
          color: #ffffff;
        }

        .visibilityLayout {
          margin-top: 20px;

          display: grid;

          grid-template-columns: 1fr 0.9fr;
          gap: 14px;

          align-items: start;
        }

        .visibilityPanel,
        .previewPanel {
          border: 1px solid #dde6ef;
          border-radius: 13px;

          background: #ffffff;
        }

        .visibilityPanel {
          padding: 15px;
        }

        .visibilityGrid {
          margin-top: 12px;

          display: grid;
          gap: 7px;
        }

        .visibilityRow {
          min-height: 50px;
          padding: 7px 9px;

          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;

          border: 1px solid #e1e8ef;
          border-radius: 9px;

          background: #fbfcfe;
        }

        .visibilityRow.disabled {
          opacity: 0.48;
        }

        .visibilityRow strong {
          color: #344e68;

          font-size: 12px;
          font-weight: 820;
        }

        .visibilityToggle {
          min-width: 64px;
          height: 30px;

          border: 1px solid #d3dde7;
          border-radius: 999px;

          background: #f3f5f8;
          color: #82909e;

          font-size: 9px;
          font-weight: 900;

          cursor: pointer;
        }

        .visibilityToggle.on {
          border-color: #0747c9;

          background: #0747c9;
          color: #ffffff;
        }

        .previewPanel {
          overflow: hidden;

          box-shadow:
            0 10px 24px
            rgba(
              30,
              70,
              120,
              0.06
            );
        }

        .previewTop {
          padding: 13px 14px;

          display: flex;
          align-items: center;
          gap: 9px;

          background: #0747c9;
          color: #ffffff;
        }

        .previewMark {
          width: 34px;
          height: 34px;

          display: grid;
          place-items: center;

          border-radius: 9px;

          background: #ffffff;
          color: #0747c9;

          font-size: 22px;
        }

        .previewTop span,
        .previewTop strong {
          display: block;
        }

        .previewTop span {
          color:
            rgba(
              255,
              255,
              255,
              0.7
            );

          font-size: 8px;
          font-weight: 900;
        }

        .previewTop strong {
          margin-top: 1px;
          font-size: 13px;
        }

        .previewPanel > h2 {
          margin: 14px 14px 0;

          color: #263f59;

          font-size: 19px;
        }

        .previewDetails {
          padding: 10px 14px 12px;

          display: grid;
          gap: 7px;
        }

        .previewRow {
          min-height: 42px;
          padding: 7px 9px;

          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;

          border-radius: 8px;

          background: #f5f8fc;
        }

        .previewRow.important {
          background: #edf4ff;
        }

        .previewRow span {
          color: #7b8b9c;

          font-size: 10px;
        }

        .previewRow strong {
          color: #304a65;

          font-size: 12px;
        }

        .previewBlock {
          padding: 8px 9px;

          border-radius: 8px;

          background: #f8fafc;
        }

        .previewBlock span,
        .previewBlock strong {
          display: block;
        }

        .previewBlock span {
          color: #8493a2;

          font-size: 9px;
          font-weight: 800;
        }

        .previewBlock strong {
          margin-top: 3px;

          color: #3b536b;

          font-size: 11px;
          line-height: 1.4;
        }

        .contactPreview {
          margin: 0 14px 10px;
          padding: 10px;

          border: 1px solid #cfe0f5;
          border-radius: 9px;

          background: #f2f7ff;
        }

        .contactPreview > span {
          color: #0747c9;

          font-size: 8px;
          font-weight: 900;
        }

        .contactPreview h3 {
          margin: 3px 0 0;

          color: #304a65;

          font-size: 13px;
        }

        .contactPreview p {
          margin: 2px 0 0;

          color: #718397;

          font-size: 10px;
        }

        .contactPreview a {
          margin-top: 7px;
          height: 34px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 8px;

          background: #0747c9;
          color: #ffffff;

          font-size: 10px;
          font-weight: 850;

          text-decoration: none;
        }

        .actions,
        .finalActions {
          margin-top: 20px;

          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .secondaryButton,
        .primaryButton,
        .createButton {
          min-height: 47px;
          padding: 0 18px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          border-radius: 10px;

          font-size: 14px;
          font-weight: 850;

          text-decoration: none;
          cursor: pointer;
        }

        .secondaryButton {
          border: 1px solid #d6e1ec;

          background: #ffffff;
          color: #64788d;
        }

        .primaryButton,
        .createButton {
          border: 0;

          background: #0747c9;
          color: #ffffff;

          box-shadow:
            0 8px 18px
            rgba(
              7,
              71,
              201,
              0.16
            );
        }

        .primaryButton {
          min-width: 145px;
        }

        .createButton {
          min-width: 170px;
        }

        .primaryButton:disabled {
          background: #b8c5d5;

          box-shadow: none;

          cursor: not-allowed;
        }

        @media (max-width: 760px) {
          .qrSection,
          .visibilityLayout {
            grid-template-columns: 1fr;
          }

          .creatorSummary,
          .lockedSummary {
            grid-template-columns: 1fr;
          }

          .relationshipGrid {
            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );
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
          .formGrid,
          .textareaGrid,
          .topSummary {
            grid-template-columns: 1fr;
          }

          .actions,
          .finalActions {
            flex-direction: column-reverse;
          }

          .secondaryButton,
          .primaryButton,
          .createButton {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}
