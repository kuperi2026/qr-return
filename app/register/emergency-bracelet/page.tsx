"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

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

/* =========================================================
   SUPABASE
========================================================= */

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase =
  supabaseUrl && supabaseKey
    ? createClient(
        supabaseUrl,
        supabaseKey
      )
    : null;

/* =========================================================
   PAGE
========================================================= */

export default function EmergencyBraceletPage() {
  const [step, setStep] =
    useState(1);

  const [
    loadingAccount,
    setLoadingAccount,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    saveError,
    setSaveError,
  ] = useState("");

  /* OWNER */

  const [
    ownerId,
    setOwnerId,
  ] = useState("");

  const [
    ownerFirstName,
    setOwnerFirstName,
  ] = useState("");

  const [
    ownerLastName,
    setOwnerLastName,
  ] = useState("");

  const [
    ownerPhone,
    setOwnerPhone,
  ] = useState("");

  const [
    ownerEmail,
    setOwnerEmail,
  ] = useState("");

  /* STEP 1 */

  const [
    tagCode,
    setTagCode,
  ] = useState("");

  const [
    profileFor,
    setProfileFor,
  ] = useState<ProfileFor>("");

  /* HOLDER */

  const [
    holderFirstName,
    setHolderFirstName,
  ] = useState("");

  const [
    holderLastName,
    setHolderLastName,
  ] = useState("");

  const [
    holderBirthDate,
    setHolderBirthDate,
  ] = useState("");

  const [
    holderSex,
    setHolderSex,
  ] = useState("");

  const [
    relationship,
    setRelationship,
  ] = useState<Relationship>("");

  const [
    customRelationship,
    setCustomRelationship,
  ] = useState("");

  /* MEDICAL */

  const [
    bloodGroup,
    setBloodGroup,
  ] = useState("");

  const [
    allergies,
    setAllergies,
  ] = useState("");

  const [
    medicalConditions,
    setMedicalConditions,
  ] = useState("");

  const [
    medications,
    setMedications,
  ] = useState("");

  const [
    medicalNotes,
    setMedicalNotes,
  ] = useState("");

  /* CONTACT 1 */

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

  const [
    emergencyPhone,
    setEmergencyPhone,
  ] = useState("");

  const [
    emergencyRelationship,
    setEmergencyRelationship,
  ] = useState("");

  /* CONTACT 2 */

  const [
    secondContactEnabled,
    setSecondContactEnabled,
  ] = useState(false);

  const [
    secondFirstName,
    setSecondFirstName,
  ] = useState("");

  const [
    secondLastName,
    setSecondLastName,
  ] = useState("");

  const [
    secondPhone,
    setSecondPhone,
  ] = useState("");

  const [
    secondRelationship,
    setSecondRelationship,
  ] = useState("");

  /* VISIBILITY */

  const [
    showName,
    setShowName,
  ] = useState(true);

  const [
    showBirthDate,
    setShowBirthDate,
  ] = useState(true);

  const [
    showSex,
    setShowSex,
  ] = useState(false);

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

  /* =========================================================
     LOAD OWNER
  ========================================================= */

  useEffect(() => {
    loadOwnerAccount();
  }, []);

  async function loadOwnerAccount() {
    if (!supabase) {
      setSaveError(
        "Supabase configuration is missing."
      );

      setLoadingAccount(false);

      return;
    }

    try {
      setLoadingAccount(true);
      setSaveError("");

      const {
        data,
        error,
      } =
        await supabase.auth.getUser();

      if (error) {
        throw error;
      }

      const user =
        data.user;

      if (!user) {
        window.location.href =
          "/login";

        return;
      }

      const {
        data: owner,
        error: ownerError,
      } =
        await supabase
          .from("owner_accounts")
          .select(
            "user_id, first_name, last_name, phone, email"
          )
          .eq(
            "user_id",
            user.id
          )
          .single();

      if (ownerError) {
        throw ownerError;
      }

      setOwnerId(
        owner.user_id
      );

      setOwnerFirstName(
        owner.first_name || ""
      );

      setOwnerLastName(
        owner.last_name || ""
      );

      setOwnerPhone(
        owner.phone || ""
      );

      setOwnerEmail(
        owner.email || ""
      );
    } catch (error) {
      console.error(
        "LOAD OWNER ERROR:",
        error
      );

      setSaveError(
        "ანგარიშის ინფორმაციის ჩატვირთვა ვერ მოხერხდა."
      );
    } finally {
      setLoadingAccount(false);
    }
  }

  /* =========================================================
     HELPERS
  ========================================================= */

  const holderName =
    profileFor === "self"
      ? `${ownerFirstName} ${ownerLastName}`.trim()
      : `${holderFirstName} ${holderLastName}`.trim();

  function goToStep(
    number: number
  ) {
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
      setHolderFirstName(
        ownerFirstName
      );

      setHolderLastName(
        ownerLastName
      );

      setRelationship("");
      setCustomRelationship("");
    }
  }

  function continueFromCreator() {
    if (
      profileFor === "self"
    ) {
      setHolderFirstName(
        ownerFirstName
      );

      setHolderLastName(
        ownerLastName
      );

      goToStep(4);

      return;
    }

    goToStep(3);
  }

  /* =========================================================
     CREATE PROFILE
  ========================================================= */

  async function createEmergencyProfile() {
    if (!supabase) {
      alert(
        "Supabase configuration is missing."
      );

      return;
    }

    if (saving) {
      return;
    }

    try {
      setSaving(true);
      setSaveError("");

      if (!ownerId) {
        throw new Error(
          "Owner Account ვერ მოიძებნა."
        );
      }

      if (!profileFor) {
        throw new Error(
          "აირჩიეთ ვისთვის ქმნით პროფილს."
        );
      }

      const normalizedTag =
        tagCode
          .trim()
          .toUpperCase();

      if (!normalizedTag) {
        throw new Error(
          "QR კოდი სავალდებულოა."
        );
      }

      /* =====================================================
         QR CHECK
      ===================================================== */

      const {
        data: qrTag,
        error: qrError,
      } =
        await supabase
          .from("qr_tags")
          .select(
            `
              id,
              tag_code,
              category,
              status,
              assigned_profile_id,
              assigned_owner_id
            `
          )
          .ilike(
            "tag_code",
            normalizedTag
          )
          .maybeSingle();

      if (qrError) {
        console.error(
          "QR LOOKUP ERROR:",
          qrError
        );

        throw new Error(
          "QR კოდის შემოწმება ვერ მოხერხდა."
        );
      }

      if (!qrTag) {
        throw new Error(
          `QR კოდი "${normalizedTag}" სისტემაში ვერ მოიძებნა. ტესტისთვის გამოიყენეთ EMG-TEST001.`
        );
      }

      if (
        qrTag.status !==
        "unassigned"
      ) {
        throw new Error(
          "ეს QR კოდი უკვე გამოყენებულია."
        );
      }

      const qrCategory =
        String(
          qrTag.category || ""
        )
          .trim()
          .toLowerCase();

      const allowedCategories = [
        "emergency",
        "emergency_bracelet",
        "emergency bracelet",
      ];

      if (
        qrCategory &&
        !allowedCategories.includes(
          qrCategory
        )
      ) {
        throw new Error(
          "ეს QR კოდი Emergency Bracelet კატეგორიას არ ეკუთვნის."
        );
      }

      /* =====================================================
         HOLDER
      ===================================================== */

      const finalFirstName =
        profileFor === "self"
          ? ownerFirstName.trim()
          : holderFirstName.trim();

      const finalLastName =
        profileFor === "self"
          ? ownerLastName.trim()
          : holderLastName.trim();

      if (
        !finalFirstName ||
        !finalLastName
      ) {
        throw new Error(
          "სახელი და გვარი სავალდებულოა."
        );
      }

      if (
        profileFor === "other" &&
        !relationship
      ) {
        throw new Error(
          "შემქმნელსა და სამაჯურის მფლობელს შორის კავშირი სავალდებულოა."
        );
      }

      if (
        profileFor === "other" &&
        relationship === "other" &&
        !customRelationship.trim()
      ) {
        throw new Error(
          "მიუთითეთ კავშირი."
        );
      }

      const managerRelationship =
        profileFor === "other"
          ? relationship ===
            "other"
            ? customRelationship.trim()
            : relationship
          : null;

      /* =====================================================
         CONTACT VALIDATION
      ===================================================== */

      if (
        primaryContactEnabled &&
        (
          !emergencyFirstName.trim() ||
          !emergencyLastName.trim() ||
          !emergencyPhone.trim() ||
          !emergencyRelationship.trim()
        )
      ) {
        throw new Error(
          "შეავსეთ დამატებითი Emergency Contact-ის ყველა სავალდებულო ველი."
        );
      }

      if (
        secondContactEnabled &&
        (
          !secondFirstName.trim() ||
          !secondLastName.trim() ||
          !secondPhone.trim() ||
          !secondRelationship.trim()
        )
      ) {
        throw new Error(
          "შეავსეთ მეორე Emergency Contact-ის ყველა სავალდებულო ველი."
        );
      }

      /* =====================================================
         CREATE PROFILE
      ===================================================== */

      const {
        data: profile,
        error: profileError,
      } =
        await supabase
          .from(
            "emergency_profiles"
          )
          .insert({
            owner_id:
              ownerId,

            tag_code:
              normalizedTag,

            profile_for:
              profileFor,

            first_name:
              finalFirstName,

            last_name:
              finalLastName,

            date_of_birth:
              holderBirthDate ||
              null,

            sex:
              holderSex ||
              null,

            blood_type:
              bloodGroup ||
              null,

            allergies:
              allergies.trim() ||
              null,

            medical_conditions:
              medicalConditions.trim() ||
              null,

            medications:
              medications.trim() ||
              null,

            medical_note:
              medicalNotes.trim() ||
              null,

            owner_phone:
              ownerPhone,

            owner_email:
              ownerEmail,

            show_owner_phone:
              true,

            profile_manager_type:
              profileFor,

            manager_first_name:
              ownerFirstName,

            manager_last_name:
              ownerLastName,

            manager_relationship:
              managerRelationship,

            emergency_contact_enabled:
              primaryContactEnabled,

            emergency_contact_name:
              primaryContactEnabled
                ? `${emergencyFirstName} ${emergencyLastName}`.trim()
                : null,

            emergency_contact_phone:
              primaryContactEnabled
                ? emergencyPhone.trim()
                : null,

            emergency_contact_relationship:
              primaryContactEnabled
                ? emergencyRelationship.trim()
                : null,

            second_contact_enabled:
              secondContactEnabled,

            second_contact_name:
              secondContactEnabled
                ? `${secondFirstName} ${secondLastName}`.trim()
                : null,

            second_contact_phone:
              secondContactEnabled
                ? secondPhone.trim()
                : null,

            second_contact_relationship:
              secondContactEnabled
                ? secondRelationship.trim()
                : null,

            show_name:
              showName,

            show_date_of_birth:
              showBirthDate,

            show_sex:
              showSex,

            show_blood_type:
              showBloodGroup,

            show_allergies:
              showAllergies,

            show_medical_conditions:
              showConditions,

            show_medications:
              showMedications,

            show_medical_note:
              showMedicalNotes,

            show_emergency_contact:
              showPrimaryContact &&
              primaryContactEnabled,

            show_second_contact:
              showSecondContact &&
              secondContactEnabled,

            live_chat_enabled:
              true,

            location_sharing_enabled:
              false,

            missing_mode:
              false,

            missing_message:
              null,

            identity_edit_used:
              false,

            active:
              true,
          })
          .select(
            "id, tag_code"
          )
          .single();

      if (profileError) {
        console.error(
          "PROFILE INSERT ERROR:",
          profileError
        );

        throw new Error(
          profileError.message ||
          "Emergency პროფილის შექმნა ვერ მოხერხდა."
        );
      }

      /* =====================================================
         ACTIVATE QR
      ===================================================== */

      const {
        data: updatedTag,
        error: tagUpdateError,
      } =
        await supabase
          .from("qr_tags")
          .update({
            status:
              "activated",

            assigned_profile_id:
              profile.id,

            assigned_owner_id:
              ownerId,

            activated_at:
              new Date().toISOString(),
          })
          .eq(
            "id",
            qrTag.id
          )
          .eq(
            "status",
            "unassigned"
          )
          .select("id")
          .maybeSingle();

      if (
        tagUpdateError ||
        !updatedTag
      ) {
        await supabase
          .from(
            "emergency_profiles"
          )
          .delete()
          .eq(
            "id",
            profile.id
          );

        throw new Error(
          "QR კოდის გააქტიურება ვერ მოხერხდა."
        );
      }

      alert(
        "Emergency პროფილი წარმატებით შეიქმნა."
      );

      window.location.href =
        "/dashboard";
    } catch (error) {
      console.error(
        "CREATE EMERGENCY PROFILE ERROR:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Emergency პროფილის შექმნა ვერ მოხერხდა.";

      setSaveError(
        message
      );

      alert(
        message
      );
    } finally {
      setSaving(false);
    }
  }

  /* =========================================================
     LOADING
  ========================================================= */

  if (loadingAccount) {
    return (
      <main className="loadingPage">
        <div className="loadingBox">
          <div className="loadingLogo">
            QR
          </div>

          <strong>
            QR RETURN
          </strong>

          <span>
            ანგარიშის ჩატვირთვა...
          </span>
        </div>

        <style jsx>{`
          .loadingPage {
            min-height: 100vh;
            display: grid;
            place-items: center;
            background: #0747c9;
            font-family:
              Inter,
              Arial,
              sans-serif;
          }

          .loadingBox {
            text-align: center;
            color: #ffffff;
          }

          .loadingLogo {
            width: 54px;
            height: 54px;
            margin: 0 auto 10px;
            display: grid;
            place-items: center;
            border-radius: 14px;
            background: #ffffff;
            color: #0747c9;
            font-size: 14px;
            font-weight: 950;
          }

          .loadingBox strong,
          .loadingBox span {
            display: block;
          }

          .loadingBox strong {
            font-size: 18px;
          }

          .loadingBox span {
            margin-top: 4px;
            font-size: 13px;
            opacity: 0.82;
          }
        `}</style>
      </main>
    );
  }

  /* =========================================================
     UI
  ========================================================= */

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
            href="/dashboard"
            className="topButton"
          >
            ← ჩემი პროფილები
          </a>
        </header>

        <section className="card">
          {saveError && (
            <div className="errorBox">
              {saveError}
            </div>
          )}

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
              showName={showName}
              setShowName={
                setShowName
              }
              showBirthDate={
                showBirthDate
              }
              setShowBirthDate={
                setShowBirthDate
              }
              showSex={showSex}
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

          {saving && (
            <div className="savingOverlay">
              <div className="savingBox">
                <strong>
                  პროფილი იქმნება...
                </strong>

                <span>
                  გთხოვთ დაელოდოთ
                </span>
              </div>
            </div>
          )}
        </section>
      </main>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #0747c9;
        }

        button,
        input,
        select,
        textarea {
          font: inherit;
        }

        .page {
          min-height: 100vh;
          padding: 0 18px 34px;
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
          height: 68px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom:
            1px solid rgba(255,255,255,.2);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .brandMark {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border-radius: 10px;
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
          font-size: 17px;
          font-weight: 950;
        }

        .brandText span {
          margin-top: 2px;
          color: rgba(255,255,255,.82);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .7px;
        }

        .topButton {
          min-height: 38px;
          padding: 0 13px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border:
            1px solid rgba(255,255,255,.35);
          border-radius: 9px;
          background:
            rgba(255,255,255,.1);
          color: #ffffff;
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
        }

        .card {
          position: relative;
          width: 100%;
          max-width: 820px;
          margin: 24px auto 0;
          padding: 25px;
          border-radius: 19px;
          background: #ffffff;
          box-shadow:
            0 20px 48px rgba(0,24,77,.23);
        }

        .errorBox {
          margin-bottom: 14px;
          padding: 11px 13px;
          border: 1px solid #ffd0cc;
          border-radius: 9px;
          background: #fff3f3;
          color: #b42318;
          font-size: 13px;
          font-weight: 750;
          line-height: 1.45;
        }

        .progressRow {
          display: flex;
          align-items: center;
          gap: 11px;
          color: #0747c9;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .7px;
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
          transition: width .2s ease;
        }

        .heading {
          margin-top: 17px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .headingIcon {
          width: 46px;
          height: 46px;
          flex: 0 0 46px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: #0747c9;
          color: #ffffff !important;
          font-size: 20px;
          font-weight: 850;
        }

        .eyebrow {
          display: block;
          margin-bottom: 3px;
          color: #0747c9;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .9px;
        }

        .heading h1 {
          margin: 0;
          color: #203a55;
          font-size: 24px;
          font-weight: 900;
          line-height: 1.18;
        }

        .heading p {
          margin: 4px 0 0;
          color: #718397;
          font-size: 14px;
          line-height: 1.45;
        }

        .field {
          min-width: 0;
        }

        .field label {
          display: block;
          margin: 0 0 6px 2px;
          color: #344e68;
          font-size: 14px;
          font-weight: 850;
        }

        .field input,
        .field select {
          width: 100%;
          height: 52px;
          padding: 0 14px;
          border: 1.5px solid #d5e0eb;
          border-radius: 9px;
          background: #ffffff;
          color: #263f59;
          font-size: 14px;
          outline: none;
        }

        .field textarea {
          width: 100%;
          min-height: 90px;
          padding: 11px 13px;
          resize: vertical;
          border: 1.5px solid #d5e0eb;
          border-radius: 9px;
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
            0 0 0 3px rgba(7,71,201,.08);
        }

        .qrSection {
          margin-top: 19px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 13px;
          align-items: end;
        }

        .qrHelp {
          min-height: 78px;
          padding: 10px 12px;
          border: 1px solid #cbdcf4;
          border-radius: 10px;
          background: #f2f6fc;
        }

        .qrHelp span {
          color: #0747c9;
          font-size: 9px;
          font-weight: 900;
        }

        .qrHelp strong {
          display: block;
          margin-top: 3px;
          color: #304a65;
          font-size: 13px;
        }

        .qrHelp p {
          margin: 3px 0 0;
          color: #718397;
          font-size: 11px;
          line-height: 1.4;
        }

        .choiceGrid {
          margin-top: 17px;
          display: grid;
          grid-template-columns:
            repeat(2,minmax(0,1fr));
          gap: 13px;
        }

        .choice {
          min-height: 124px;
          padding: 14px 15px;
          display: flex;
          flex-direction: column;
          border: 1px solid #0b52d6;
          border-radius: 13px;
          background: #0b52d6;
          color: #ffffff !important;
          text-align: left;
          cursor: pointer;
        }

        .choice,
        .choice *,
        .creatorContact,
        .creatorContact *,
        .holderSummary,
        .holderSummary *,
        .topSummary,
        .topSummary *,
        .creatorSummary,
        .creatorSummary *,
        .lockedSummary,
        .lockedSummary *,
        .previewTop,
        .previewTop *,
        .savingBox,
        .savingBox * {
          color: #ffffff !important;
        }

        .choice.active {
          background: #063fae;
          box-shadow:
            0 0 0 4px rgba(7,71,201,.1);
        }

        .choice h2 {
          margin: 6px 0 0;
          font-size: 18px;
          font-weight: 900;
        }

        .choice p {
          margin: 4px 0 0;
          font-size: 13px;
          line-height: 1.4;
          opacity: .9;
        }

        .formGrid,
        .textareaGrid {
          margin-top: 16px;
          display: grid;
          grid-template-columns:
            repeat(2,minmax(0,1fr));
          gap: 13px;
        }

        .infoBox,
        .optionalNotice,
        .finalNotice,
        .nameWarning {
          margin-top: 17px;
          padding: 10px 12px;
          display: flex;
          align-items: center;
          gap: 9px;
          border: 1px solid #cbdcf4;
          border-radius: 9px;
          background: #f2f6fc;
        }

        .infoIcon,
        .optionalNotice > div,
        .finalNotice > div,
        .nameWarning > div {
          width: 27px;
          height: 27px;
          flex: 0 0 27px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #0747c9;
          color: #ffffff !important;
          font-size: 11px;
          font-weight: 900;
        }

        .infoBox strong {
          display: block;
          color: #304a65;
          font-size: 13px;
        }

        .infoBox p,
        .optionalNotice p,
        .finalNotice p,
        .nameWarning p {
          margin: 2px 0 0;
          color: #718397;
          font-size: 12px;
          line-height: 1.45;
        }

        .topSummary,
        .creatorSummary,
        .lockedSummary {
          margin-top: 18px;
          padding: 11px 13px;
          display: grid;
          gap: 9px;
          border-radius: 9px;
          background: #0747c9;
        }

        .topSummary {
          grid-template-columns:
            repeat(2,minmax(0,1fr));
        }

        .creatorSummary,
        .lockedSummary {
          grid-template-columns:
            repeat(3,minmax(0,1fr));
        }

        .summaryItem span,
        .summaryItem strong {
          display: block;
        }

        .summaryItem span {
          font-size: 9px;
          opacity: .75;
        }

        .summaryItem strong {
          margin-top: 3px;
          font-size: 12px;
          overflow-wrap: anywhere;
        }

        .subSection {
          margin-top: 17px;
          padding-top: 15px;
          border-top: 1px solid #e1e8f0;
        }

        .firstSection {
          margin-top: 19px;
        }

        .sectionTitle > span {
          color: #0747c9;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .8px;
        }

        .sectionTitle h3 {
          margin: 4px 0 0;
          color: #304a65;
          font-size: 16px;
          font-weight: 850;
        }

        .relationshipGrid {
          margin-top: 10px;
          display: grid;
          grid-template-columns:
            repeat(4,minmax(0,1fr));
          gap: 7px;
        }

        .relationshipButton {
          min-height: 44px;
          border: 1px solid #d7e2ed;
          border-radius: 8px;
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
          margin-top: 11px;
        }

        .holderSummary {
          margin-top: 18px;
          padding: 11px 13px;
          display: flex;
          align-items: center;
          gap: 10px;
          border-radius: 10px;
          background: #0747c9;
        }

        .holderAvatar {
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          background:
            rgba(255,255,255,.14);
        }

        .optionalBox {
          min-height: 54px;
          padding: 9px 11px;
          border: 1px solid #dce5ee;
          border-radius: 9px;
          background: #f8fafd;
        }

        .optionalBox span {
          color: #0747c9;
          font-size: 8px;
          font-weight: 900;
        }

        .optionalBox strong {
          display: block;
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
          margin-top: 18px;
          padding: 11px 13px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border-radius: 10px;
          background: #0747c9;
        }

        .sectionWithToggle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
        }

        .miniToggle {
          width: 66px;
          height: 32px;
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
          margin-top: 19px;
          display: grid;
          grid-template-columns: 1fr .9fr;
          gap: 13px;
          align-items: start;
        }

        .visibilityPanel,
        .previewPanel {
          border: 1px solid #dde6ef;
          border-radius: 12px;
          background: #ffffff;
        }

        .visibilityPanel {
          padding: 14px;
        }

        .visibilityGrid {
          margin-top: 11px;
          display: grid;
          gap: 7px;
        }

        .visibilityRow {
          min-height: 48px;
          padding: 7px 9px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          border: 1px solid #e1e8ef;
          border-radius: 8px;
          background: #fbfcfe;
        }

        .visibilityRow strong {
          color: #344e68;
          font-size: 12px;
        }

        .visibilityToggle {
          min-width: 62px;
          height: 29px;
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
        }

        .previewTop {
          padding: 12px 13px;
          display: flex;
          align-items: center;
          gap: 9px;
          background: #0747c9;
        }

        .previewMark {
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          border-radius: 8px;
          background: #ffffff;
          color: #0747c9 !important;
          font-size: 20px;
        }

        .previewPanel > h2 {
          margin: 13px 13px 0;
          color: #263f59;
          font-size: 18px;
        }

        .previewDetails {
          padding: 9px 13px 11px;
          display: grid;
          gap: 7px;
        }

        .previewRow {
          min-height: 40px;
          padding: 7px 9px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          border-radius: 8px;
          background: #f5f8fc;
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

        .contactPreview {
          margin: 0 13px 9px;
          padding: 9px;
          border: 1px solid #cfe0f5;
          border-radius: 8px;
          background: #f2f7ff;
        }

        .actions,
        .finalActions {
          margin-top: 19px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .secondaryButton,
        .primaryButton,
        .createButton {
          min-height: 44px;
          padding: 0 17px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 850;
          cursor: pointer;
          text-decoration: none;
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
        }

        .primaryButton:disabled {
          background: #b8c5d5;
          cursor: not-allowed;
        }

        .savingOverlay {
          position: absolute;
          inset: 0;
          z-index: 50;
          display: grid;
          place-items: center;
          border-radius: 19px;
          background:
            rgba(255,255,255,.9);
        }

        .savingBox {
          padding: 20px 27px;
          text-align: center;
          border-radius: 13px;
          background: #0747c9;
        }

        .savingBox strong,
        .savingBox span {
          display: block;
        }

        .savingBox strong {
          font-size: 16px;
        }

        .savingBox span {
          margin-top: 4px;
          font-size: 12px;
          opacity: .8;
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
              repeat(2,minmax(0,1fr));
          }
        }

        @media (max-width: 600px) {
          .page {
            padding: 0 11px 24px;
          }

          .card {
            margin-top: 17px;
            padding: 18px 14px;
            border-radius: 15px;
          }

          .heading h1 {
            font-size: 21px;
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
