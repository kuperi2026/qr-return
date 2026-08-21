"use client";

import { FormEvent, useState } from "react";

import PetBasicInfo from "./PetBasicInfo";
import PetHealthSection from "./PetHealthSection";
import FinderVisibilitySection from "./FinderVisibilitySection";
import ContactOptionsSection from "./ContactOptionsSection";

type PetRegistrationFormProps = {
  type: "dog" | "cat";
};

export default function PetRegistrationForm({
  type,
}: PetRegistrationFormProps) {
  const [itemName, setItemName] = useState("");
  const [colour, setColour] = useState("");
  const [sex, setSex] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [weight, setWeight] = useState("");
  const [photo, setPhoto] = useState("");

  const [medicalInfo, setMedicalInfo] = useState("");
  const [behaviourNote, setBehaviourNote] = useState("");
  const [description, setDescription] = useState("");
  const [finderMessage, setFinderMessage] = useState("");

  const [showEmail, setShowEmail] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [showPetPhoto, setShowPetPhoto] = useState(true);
  const [showMedicalInfo, setShowMedicalInfo] = useState(false);
  const [showBehaviourNote, setShowBehaviourNote] = useState(false);
  const [showDescription, setShowDescription] = useState(true);
  const [showFinderMessage, setShowFinderMessage] = useState(true);

  const [liveChatEnabled, setLiveChatEnabled] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const petLabel =
    type === "dog"
      ? "ძაღლი"
      : "კატა";

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!itemName.trim()) {
      setErrorMessage(
        "ცხოველის სახელი სავალდებულოა."
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
        item_type: type,
        pet_type: type,

        item_name: itemName.trim(),

        colour: colour.trim() || null,
        sex: sex || null,
        date_of_birth:
          dateOfBirth || null,
        weight:
          weight || null,
        photo:
          photo.trim() || null,

        medical_info:
          medicalInfo.trim() || null,

        behaviour_note:
          behaviourNote.trim() || null,

        description:
          description.trim() || null,

        finder_message:
          finderMessage.trim() || null,

        show_owner_name: true,
        show_owner_phone: true,

        show_email: showEmail,
        show_address: showAddress,
        show_pet_photo: showPetPhoto,
        show_medical_info:
          showMedicalInfo,
        show_behaviour_note:
          showBehaviourNote,
        show_description:
          showDescription,
        show_finder_message:
          showFinderMessage,

        phone_enabled: true,
        live_chat_enabled:
          liveChatEnabled,
      };

      console.log(
        "PET PROFILE PAYLOAD:",
        payload
      );

      setSuccessMessage(
        `${petLabel} პროფილის ფორმა მზადაა. შემდეგ ეტაპზე ამ მონაცემებს Supabase-ში შევინახავთ.`
      );
    } catch (error) {
      console.error(error);

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

        <PetBasicInfo
          itemName={itemName}
          setItemName={setItemName}
          colour={colour}
          setColour={setColour}
          sex={sex}
          setSex={setSex}
          dateOfBirth={dateOfBirth}
          setDateOfBirth={setDateOfBirth}
          weight={weight}
          setWeight={setWeight}
          photo={photo}
          setPhoto={setPhoto}
        />

        <PetHealthSection
          medicalInfo={medicalInfo}
          setMedicalInfo={setMedicalInfo}
          behaviourNote={behaviourNote}
          setBehaviourNote={
            setBehaviourNote
          }
          description={description}
          setDescription={setDescription}
          finderMessage={finderMessage}
          setFinderMessage={
            setFinderMessage
          }
        />

        <FinderVisibilitySection
          showEmail={showEmail}
          setShowEmail={setShowEmail}
          showAddress={showAddress}
          setShowAddress={
            setShowAddress
          }
          showPetPhoto={showPetPhoto}
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

        <ContactOptionsSection
          liveChatEnabled={
            liveChatEnabled
          }
          setLiveChatEnabled={
            setLiveChatEnabled
          }
        />

        <section className="saveCard">
          <div className="saveText">
            <span>
              FINAL STEP
            </span>

            <h3>
              პროფილის შექმნა
            </h3>

            <p>
              შექმნის შემდეგ კატეგორია
              <strong>
                {" "}
                {petLabel}
              </strong>
              -ზე დაფიქსირდება და სხვა
              კატეგორიად ვეღარ შეიცვლება.
              პროფილის სხვა მონაცემების
              რედაქტირება მოგვიანებით
              შესაძლებელი იქნება.
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
