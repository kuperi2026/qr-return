"use client";

import { FormEvent, useState } from "react";

import OwnerInformationSection from "./OwnerInformationSection";
import AdminAccessSection, {
  type AdminPermissions,
} from "./AdminAccessSection";

import PetBasicInfo from "./PetBasicInfo";
import PetHealthSection from "./PetHealthSection";
import FinderVisibilitySection from "./FinderVisibilitySection";
import ContactOptionsSection from "./ContactOptionsSection";

type PetRegistrationFormProps = {
  type: "dog" | "cat";
};

const initialPermissions: AdminPermissions = {
  viewProfiles: true,
  editProfiles: false,
  editFinderSettings: false,
  editLiveChat: false,
  viewMessages: false,
  replyMessages: false,
  markLostFound: false,
  addProfiles: false,
};

export default function PetRegistrationForm({
  type,
}: PetRegistrationFormProps) {
  /* ================= OWNER ================= */

  const [ownerFirstName] = useState("Owner");
  const [ownerLastName] = useState("Account");
  const [ownerPhone] = useState("—");
  const [ownerEmail] = useState("—");

  /* ================= ADMIN ================= */

  const [adminEnabled, setAdminEnabled] =
    useState(false);

  const [adminEmail, setAdminEmail] =
    useState("");

  const [permissions, setPermissions] =
    useState<AdminPermissions>(
      initialPermissions
    );

  /* ================= PET ================= */

  const [itemName, setItemName] =
    useState("");

  const [colour, setColour] =
    useState("");

  const [sex, setSex] =
    useState("");

  const [dateOfBirth, setDateOfBirth] =
    useState("");

  const [weight, setWeight] =
    useState("");

  const [photo, setPhoto] =
    useState("");

  const [medicalInfo, setMedicalInfo] =
    useState("");

  const [
    behaviourNote,
    setBehaviourNote,
  ] = useState("");

  const [description, setDescription] =
    useState("");

  const [
    finderMessage,
    setFinderMessage,
  ] = useState("");

  /* ================= FINDER VIEW ================= */

  const [showEmail, setShowEmail] =
    useState(false);

  const [
    showAddress,
    setShowAddress,
  ] = useState(false);

  const [
    showPetPhoto,
    setShowPetPhoto,
  ] = useState(true);

  const [
    showMedicalInfo,
    setShowMedicalInfo,
  ] = useState(false);

  const [
    showBehaviourNote,
    setShowBehaviourNote,
  ] = useState(false);

  const [
    showDescription,
    setShowDescription,
  ] = useState(true);

  const [
    showFinderMessage,
    setShowFinderMessage,
  ] = useState(true);

  /* ================= CONTACT ================= */

  const [
    liveChatEnabled,
    setLiveChatEnabled,
  ] = useState(true);

  /* ================= STATUS ================= */

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const [saving, setSaving] =
    useState(false);

  const petLabel =
    type === "dog"
      ? "ძაღლი"
      : "კატა";

  function validateForm() {
    if (!itemName.trim()) {
      return "ცხოველის სახელი სავალდებულოა.";
    }

    if (
      adminEnabled &&
      !adminEmail.trim()
    ) {
      return "თუ Secondary Admin ჩართულია, Admin-ის ელფოსტა სავალდებულოა.";
    }

    if (adminEnabled) {
      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailPattern.test(
          adminEmail.trim()
        )
      ) {
        return "გთხოვთ მიუთითოთ Secondary Admin-ის სწორი ელფოსტა.";
      }

      if (
        ownerEmail !== "—" &&
        adminEmail
          .trim()
          .toLowerCase() ===
          ownerEmail
            .trim()
            .toLowerCase()
      ) {
        return "Owner და Secondary Admin ერთი და იგივე ელფოსტა ვერ იქნება.";
      }
    }

    return "";
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    const validationError =
      validateForm();

    if (validationError) {
      setErrorMessage(
        validationError
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    setSaving(true);

    try {
      const payload = {
        /* OWNER */

        owner: {
          first_name:
            ownerFirstName,
          last_name:
            ownerLastName,
          phone:
            ownerPhone,
          email:
            ownerEmail,
        },

        /* OPTIONAL SECONDARY ADMIN */

        secondary_admin:
          adminEnabled
            ? {
                enabled: true,
                email:
                  adminEmail
                    .trim()
                    .toLowerCase(),

                permissions: {
                  view_profiles:
                    permissions
                      .viewProfiles,

                  edit_profiles:
                    permissions
                      .editProfiles,

                  edit_finder_settings:
                    permissions
                      .editFinderSettings,

                  edit_live_chat:
                    permissions
                      .editLiveChat,

                  view_messages:
                    permissions
                      .viewMessages,

                  reply_messages:
                    permissions
                      .replyMessages,

                  mark_lost_found:
                    permissions
                      .markLostFound,

                  add_profiles:
                    permissions
                      .addProfiles,

                  add_admin:
                    false,

                  change_owner:
                    false,

                  change_account_security:
                    false,

                  delete_owner_account:
                    false,

                  change_category:
                    false,

                  change_own_permissions:
                    false,
                },
              }
            : {
                enabled: false,
              },

        /* LOCKED PROFILE CATEGORY */

        item_type: type,
        pet_type: type,

        /* PET DATA */

        item_name:
          itemName.trim(),

        colour:
          colour.trim() ||
          null,

        sex:
          sex || null,

        date_of_birth:
          dateOfBirth || null,

        weight:
          weight || null,

        photo:
          photo.trim() ||
          null,

        medical_info:
          medicalInfo.trim() ||
          null,

        behaviour_note:
          behaviourNote.trim() ||
          null,

        description:
          description.trim() ||
          null,

        finder_message:
          finderMessage.trim() ||
          null,

        /* FINDER VISIBILITY */

        show_owner_name: true,
        show_owner_phone: true,

        show_email:
          showEmail,

        show_address:
          showAddress,

        show_pet_photo:
          showPetPhoto,

        show_medical_info:
          showMedicalInfo,

        show_behaviour_note:
          showBehaviourNote,

        show_description:
          showDescription,

        show_finder_message:
          showFinderMessage,

        /* CONTACT */

        phone_enabled: true,

        live_chat_enabled:
          liveChatEnabled,
      };

      console.log(
        "PET PROFILE PAYLOAD:",
        payload
      );

      setSuccessMessage(
        `${petLabel} პროფილის ფორმა მზადაა. Owner, Secondary Admin, უფლებები და პროფილის მონაცემები წარმატებით შეიკრიბა. შემდეგ ეტაპზე ამას Supabase-ს დავუკავშირებთ.`
      );
    } catch (error) {
      console.error(
        "Profile form error:",
        error
      );

      setErrorMessage(
        "პროფილის დამუშავებისას მოხდა შეცდომა."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <form
        className="petForm"
        onSubmit={handleSubmit}
      >
        {errorMessage && (
          <div
            className="topMessage error"
            role="alert"
          >
            <span>!</span>

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

        {successMessage && (
          <div
            className="topMessage success"
            role="status"
          >
            <span>✓</span>

            <div>
              <strong>
                ფორმა მზადაა
              </strong>

              <p>
                {successMessage}
              </p>
            </div>
          </div>
        )}

        {/* ================= OWNER ================= */}

        <OwnerInformationSection
          firstName={
            ownerFirstName
          }
          lastName={
            ownerLastName
          }
          phone={
            ownerPhone
          }
          email={
            ownerEmail
          }
        />

        {/* ================= ADMIN ================= */}

        <AdminAccessSection
          adminEnabled={
            adminEnabled
          }
          setAdminEnabled={
            setAdminEnabled
          }
          adminEmail={
            adminEmail
          }
          setAdminEmail={
            setAdminEmail
          }
          permissions={
            permissions
          }
          setPermissions={
            setPermissions
          }
        />

        {/* ================= PET BASIC INFO ================= */}

        <PetBasicInfo
          itemName={
            itemName
          }
          setItemName={
            setItemName
          }
          colour={
            colour
          }
          setColour={
            setColour
          }
          sex={
            sex
          }
          setSex={
            setSex
          }
          dateOfBirth={
            dateOfBirth
          }
          setDateOfBirth={
            setDateOfBirth
          }
          weight={
            weight
          }
          setWeight={
            setWeight
          }
          photo={
            photo
          }
          setPhoto={
            setPhoto
          }
        />

        {/* ================= HEALTH ================= */}

        <PetHealthSection
          medicalInfo={
            medicalInfo
          }
          setMedicalInfo={
            setMedicalInfo
          }
          behaviourNote={
            behaviourNote
          }
          setBehaviourNote={
            setBehaviourNote
          }
          description={
            description
          }
          setDescription={
            setDescription
          }
          finderMessage={
            finderMessage
          }
          setFinderMessage={
            setFinderMessage
          }
        />

        {/* ================= FINDER VIEW ================= */}

        <FinderVisibilitySection
          showEmail={
            showEmail
          }
          setShowEmail={
            setShowEmail
          }
          showAddress={
            showAddress
          }
          setShowAddress={
            setShowAddress
          }
          showPetPhoto={
            showPetPhoto
          }
          setShowPetPhoto={
            setShowPetPhoto
          }
          showMedicalInfo={
            showMedicalInfo
          }
          setShowMedicalInfo={
            setShowMedicalInfo
          }
          showBehaviourNote={
            showBehaviourNote
          }
          setShowBehaviourNote={
            setShowBehaviourNote
          }
          showDescription={
            showDescription
          }
          setShowDescription={
            setShowDescription
          }
          showFinderMessage={
            showFinderMessage
          }
          setShowFinderMessage={
            setShowFinderMessage
          }
        />

        {/* ================= CONTACT ================= */}

        <ContactOptionsSection
          liveChatEnabled={
            liveChatEnabled
          }
          setLiveChatEnabled={
            setLiveChatEnabled
          }
        />

        {/* ================= SAVE ================= */}

        <section className="saveCard">
          <div className="saveText">
            <span>
              FINAL STEP
            </span>

            <h3>
              პროფილის შექმნა
            </h3>

            <p>
              ამ QR პროფილის
              კატეგორია იქნება
              <strong>
                {" "}
                {petLabel}
              </strong>
              . შექმნის შემდეგ
              კატეგორიის შეცვლა
              შეუძლებელი იქნება,
              თუმცა პროფილის სხვა
              მონაცემები მოგვიანებით
              შეგიძლიათ შეცვალოთ.
            </p>
          </div>

          <div className="saveActions">
            <a
              href="/register"
              className="cancelButton"
            >
              უკან
            </a>

            <button
              type="submit"
              className="saveButton"
              disabled={saving}
            >
              {saving
                ? "ინახება..."
                : "პროფილის შექმნა"}

              {!saving && (
                <span>→</span>
              )}
            </button>
          </div>
        </section>
      </form>

      <style jsx>{`
        .petForm {
          width: 100%;
        }

        .topMessage {
          margin-bottom: 16px;

          padding: 14px 15px;

          display: flex;
          align-items: flex-start;

          gap: 10px;

          border-radius: 12px;
        }

        .topMessage > span {
          width: 25px;
          height: 25px;

          flex: 0 0 25px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          font-size: 9px;
          font-weight: 950;
        }

        .topMessage strong {
          display: block;

          font-size: 10px;
          font-weight: 900;
        }

        .topMessage p {
          margin: 4px 0 0;

          font-size: 9px;
          line-height: 1.5;
        }

        .error {
          border:
            1px solid #f0c8cc;

          background: #fff7f8;

          color: #a13e47;
        }

        .error > span {
          background: #fce4e6;

          color: #bb3c47;
        }

        .success {
          border:
            1px solid #c6dfd1;

          background: #f6fbf8;

          color: #386f56;
        }

        .success > span {
          background: #e1f2e8;

          color: #386f56;
        }

        .saveCard {
          margin-top: 16px;

          padding: 23px 25px;

          display: flex;

          justify-content:
            space-between;

          align-items: center;

          gap: 25px;

          border:
            1px solid #cddff5;

          border-radius: 16px;

          background:
            linear-gradient(
              135deg,
              #f7faff 0%,
              #edf5ff 100%
            );

          box-shadow:
            0 12px 30px
            rgba(30,70,120,.05);
        }

        .saveText {
          max-width: 470px;
        }

        .saveText > span {
          color: #1266e9;

          font-size: 8px;
          font-weight: 900;

          letter-spacing: 1.2px;
        }

        .saveText h3 {
          margin: 6px 0 0;

          color: #233b55;

          font-size: 17px;
        }

        .saveText p {
          margin: 7px 0 0;

          color: #7c8a9a;

          font-size: 9px;
          line-height: 1.6;
        }

        .saveText p strong {
          color: #1266e9;
        }

        .saveActions {
          flex: 0 0 auto;

          display: flex;
          align-items: center;

          gap: 8px;
        }

        .cancelButton,
        .saveButton {
          min-height: 46px;

          padding: 0 16px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 10px;

          font-family: inherit;

          font-size: 9px;
          font-weight: 900;

          text-decoration: none;
        }

        .cancelButton {
          border:
            1px solid #ccdae9;

          background: #ffffff;

          color: #61758a;
        }

        .saveButton {
          min-width: 150px;

          gap: 8px;

          border:
            1px solid #1266e9;

          background: #1266e9;

          color: #ffffff;

          cursor: pointer;

          box-shadow:
            0 10px 20px
            rgba(18,102,233,.16);
        }

        .saveButton span {
          font-size: 14px;
        }

        .saveButton:disabled {
          opacity: .65;

          cursor: wait;
        }

        @media (max-width: 650px) {
          .saveCard {
            padding: 19px;

            flex-direction: column;

            align-items: stretch;
          }

          .saveActions {
            width: 100%;
          }

          .cancelButton,
          .saveButton {
            flex: 1;
          }
        }
      `}</style>
    </>
  );
}
