"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createClient,
  type SupabaseClient,
  type User,
} from "@supabase/supabase-js";

import PetBasicInfo from "./PetBasicInfo";
import PetHealthSection from "./PetHealthSection";
import FinderVisibilitySection from "./FinderVisibilitySection";
import ContactOptionsSection from "./ContactOptionsSection";

type PetRegistrationFormProps = {
  type: "dog" | "cat";
};

type OwnerData = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
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

export default function PetRegistrationForm({
  type,
}: PetRegistrationFormProps) {
  const router = useRouter();

  const [supabase, setSupabase] =
    useState<SupabaseClient | null>(null);

  const [currentUser, setCurrentUser] =
    useState<User | null>(null);

  const [authLoading, setAuthLoading] =
    useState(true);

  const [owner, setOwner] =
    useState<OwnerData>({
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
    });

  const [tagCode, setTagCode] =
    useState("");

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

  const [behaviourNote, setBehaviourNote] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [finderMessage, setFinderMessage] =
    useState("");

  const [showEmail, setShowEmail] =
    useState(false);

  const [showAddress, setShowAddress] =
    useState(false);

  const [showPetPhoto, setShowPetPhoto] =
    useState(true);

  const [showMedicalInfo, setShowMedicalInfo] =
    useState(false);

  const [showBehaviourNote, setShowBehaviourNote] =
    useState(false);

  const [showDescription, setShowDescription] =
    useState(true);

  const [showFinderMessage, setShowFinderMessage] =
    useState(true);

  const [liveChatEnabled, setLiveChatEnabled] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const petLabel =
    type === "dog"
      ? "ძაღლი"
      : "კატა";

  const petEmoji =
    type === "dog"
      ? "🐶"
      : "🐱";

  useEffect(() => {
    async function loadAccount() {
      try {
        const client =
          createSupabaseClient();

        if (!client) {
          setErrorMessage(
            "Supabase კავშირი არ არის კონფიგურირებული."
          );
          return;
        }

        setSupabase(client);

        const {
          data: { user },
          error: userError,
        } =
          await client.auth.getUser();

        if (
          userError ||
          !user
        ) {
          router.replace("/login");
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
          "Account load error:",
          error
        );

        setErrorMessage(
          "ანგარიშის ინფორმაციის ჩატვირთვა ვერ მოხერხდა."
        );
      } finally {
        setAuthLoading(false);
      }
    }

    loadAccount();
  }, [router]);

  function validateForm() {
    if (!currentUser) {
      return "მომხმარებლის ანგარიში ვერ მოიძებნა.";
    }

    if (
      !owner.firstName.trim() ||
      !owner.lastName.trim() ||
      !owner.phone.trim()
    ) {
      return "მფლობელის ინფორმაცია არასრულია. დაბრუნდით პირველ ეტაპზე.";
    }

    if (!tagCode.trim()) {
      return "QR / Tag Code სავალდებულოა.";
    }

    if (!itemName.trim()) {
      return "ცხოველის სახელი სავალდებულოა.";
    }

    return "";
  }

  async function handleSubmit(
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

    if (
      !supabase ||
      !currentUser
    ) {
      setErrorMessage(
        "ანგარიშთან კავშირი ვერ მოიძებნა."
      );
      return;
    }

    setSaving(true);

    try {
      const cleanTagCode =
        tagCode
          .trim()
          .toUpperCase();

      const {
        data: existingTag,
        error: tagCheckError,
      } =
        await supabase
          .from("item")
          .select(
            "tag_code, item_type"
          )
          .ilike(
            "tag_code",
            cleanTagCode
          )
          .maybeSingle();

      if (tagCheckError) {
        throw new Error(
          tagCheckError.message
        );
      }

      if (existingTag) {
        setErrorMessage(
          `QR კოდი ${cleanTagCode} უკვე დარეგისტრირებულია.`
        );

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

        return;
      }

      const {
        data: createdProfile,
        error: insertError,
      } =
        await supabase
          .from("item")
          .insert({
            tag_code:
              cleanTagCode,

            owner_id:
              currentUser.id,

            owner_first_name:
              owner.firstName.trim(),

            owner_last_name:
              owner.lastName.trim(),

            owner_phone:
              owner.phone.trim(),

            owner_email:
              owner.email.trim(),

            item_type:
              type,

            pet_type:
              type,

            item_name:
              itemName.trim(),

            colour:
              colour.trim() ||
              null,

            sex:
              sex || null,

            date_of_birth:
              dateOfBirth ||
              null,

            weight:
              weight
                ? Number(weight)
                : null,

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

            show_owner_name:
              true,

            show_owner_phone:
              true,

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

            phone_enabled:
              true,

            live_chat_enabled:
              liveChatEnabled,

            active:
              true,

            lost:
              false,
          })
          .select(
            "id, tag_code, item_type, item_name"
          )
          .single();

      if (insertError) {
        const lowerMessage =
          insertError.message
            .toLowerCase();

        if (
          lowerMessage.includes("duplicate") ||
          lowerMessage.includes("unique")
        ) {
          setErrorMessage(
            "ეს QR კოდი უკვე გამოყენებულია."
          );
          return;
        }

        throw new Error(
          insertError.message
        );
      }

      if (!createdProfile) {
        throw new Error(
          "პროფილის შექმნის შედეგი ვერ მოიძებნა."
        );
      }

      setSuccessMessage(
        `${petLabel}ს პროფილი წარმატებით შეიქმნა.`
      );

      setTimeout(() => {
        router.push(
          `/registration-success?type=${type}&tag=${encodeURIComponent(
            createdProfile.tag_code
          )}`
        );
      }, 700);
    } catch (error) {
      console.error(
        "Pet profile save error:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? `შენახვა ვერ მოხერხდა: ${error.message}`
          : "შენახვა ვერ მოხერხდა."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setSaving(false);
    }
  }

  if (authLoading) {
    return (
      <div className="loading">
        ანგარიშის ინფორმაცია იტვირთება...

        <style jsx>{`
          .loading {
            min-height: 250px;
            display: grid;
            place-items: center;
            border: 1px solid #dce6f1;
            border-radius: 16px;
            background: #ffffff;
            color: #718095;
            font-size: 11px;
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <form
        className="petForm"
        onSubmit={handleSubmit}
      >
        {errorMessage && (
          <div
            className="message error"
            role="alert"
          >
            <strong>
              მონაცემები გადაამოწმეთ
            </strong>

            <p>
              {errorMessage}
            </p>
          </div>
        )}

        {successMessage && (
          <div
            className="message success"
            role="status"
          >
            <strong>
              ✓ პროფილი შეიქმნა
            </strong>

            <p>
              {successMessage}
            </p>
          </div>
        )}

        <section className="productIntro">
          <div className="productIcon">
            {petEmoji}
          </div>

          <div>
            <span>
              STEP 02 · PRODUCT
            </span>

            <h2>
              {petLabel}ს პროფილი
            </h2>

            <p>
              მფლობელის ეტაპი დასრულებულია.
              ახლა შეავსეთ მხოლოდ{" "}
              {petLabel}ს ინფორმაცია.
            </p>
          </div>
        </section>

        <PetBasicInfo
          tagCode={tagCode}
          setTagCode={setTagCode}
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
          setBehaviourNote={setBehaviourNote}
          description={description}
          setDescription={setDescription}
          finderMessage={finderMessage}
          setFinderMessage={setFinderMessage}
        />

        <FinderVisibilitySection
          showEmail={showEmail}
          setShowEmail={setShowEmail}
          showAddress={showAddress}
          setShowAddress={setShowAddress}
          showPetPhoto={showPetPhoto}
          setShowPetPhoto={setShowPetPhoto}
          showMedicalInfo={showMedicalInfo}
          setShowMedicalInfo={setShowMedicalInfo}
          showBehaviourNote={showBehaviourNote}
          setShowBehaviourNote={setShowBehaviourNote}
          showDescription={showDescription}
          setShowDescription={setShowDescription}
          showFinderMessage={showFinderMessage}
          setShowFinderMessage={setShowFinderMessage}
        />

        <ContactOptionsSection
          liveChatEnabled={liveChatEnabled}
          setLiveChatEnabled={setLiveChatEnabled}
        />

        <section className="saveCard">
          <div>
            <span>
              FINAL STEP
            </span>

            <h3>
              {petEmoji}{" "}
              {petLabel}ს პროფილის შექმნა
            </h3>

            <p>
              ამ QR კოდის კატეგორია
              შექმნის შემდეგ აღარ
              შეიცვლება.
            </p>
          </div>

          <div className="actions">
            <a
              href={`/register-item/${type}`}
            >
              ← უკან
            </a>

            <button
              type="submit"
              disabled={saving}
            >
              {saving
                ? "ინახება..."
                : "პროფილის შექმნა"}
            </button>
          </div>
        </section>
      </form>

      <style jsx>{`
        .petForm {
          width: 100%;
        }

        .message {
          margin-bottom: 16px;
          padding: 14px;
          border-radius: 12px;
        }

        .message strong {
          display: block;
          font-size: 10px;
        }

        .message p {
          margin: 4px 0 0;
          font-size: 9px;
        }

        .error {
          border: 1px solid #efc7cb;
          background: #fff7f8;
          color: #a3434c;
        }

        .success {
          border: 1px solid #c5dfd1;
          background: #f5fbf7;
          color: #397057;
        }

        .productIntro {
          padding: 20px 22px;
          display: flex;
          align-items: center;
          gap: 13px;
          border: 1px solid #dce6f1;
          border-radius: 16px;
          background: #ffffff;
        }

        .productIcon {
          width: 50px;
          height: 50px;
          flex: 0 0 50px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: #edf4ff;
          font-size: 25px;
        }

        .productIntro span {
          color: #1266e9;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .productIntro h2 {
          margin: 5px 0 0;
          color: #29425d;
          font-size: 17px;
        }

        .productIntro p {
          margin: 5px 0 0;
          color: #7f8fa0;
          font-size: 8px;
        }

        .saveCard {
          margin-top: 16px;
          padding: 23px 25px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 20px;

          border: 1px solid #cddff5;
          border-radius: 16px;

          background:
            linear-gradient(
              135deg,
              #f7faff,
              #edf5ff
            );
        }

        .saveCard > div > span {
          color: #1266e9;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .saveCard h3 {
          margin: 6px 0 0;
          color: #233b55;
          font-size: 17px;
        }

        .saveCard p {
          margin: 7px 0 0;
          color: #7c8a9a;
          font-size: 9px;
        }

        .actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .actions a,
        .actions button {
          min-height: 44px;
          padding: 0 15px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 10px;

          font-family: inherit;
          font-size: 9px;
          font-weight: 900;

          text-decoration: none;
        }

        .actions a {
          border: 1px solid #ccd9e7;
          background: #ffffff;
          color: #64778b;
        }

        .actions button {
          min-width: 155px;
          border: 0;
          background: #1266e9;
          color: #ffffff;
          cursor: pointer;
        }

        .actions button:disabled {
          opacity: .6;
        }

        @media (max-width: 650px) {
          .saveCard {
            flex-direction: column;
            align-items: stretch;
          }

          .actions {
            width: 100%;
          }

          .actions a,
          .actions button {
            flex: 1;
          }
        }
      `}</style>
    </>
  );
}
