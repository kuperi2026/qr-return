"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

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

type OwnerData = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
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
  const router = useRouter();

  const [authLoading, setAuthLoading] =
    useState(true);

  const [owner, setOwner] =
    useState<OwnerData>({
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
    });

  /* ADMIN */

  const [adminEnabled, setAdminEnabled] =
    useState(false);

  const [adminEmail, setAdminEmail] =
    useState("");

  const [permissions, setPermissions] =
    useState<AdminPermissions>(
      initialPermissions
    );

  /* PET */

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

  /* FINDER */

  const [showEmail, setShowEmail] =
    useState(false);

  const [showAddress, setShowAddress] =
    useState(false);

  const [showPetPhoto, setShowPetPhoto] =
    useState(true);

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

  /* CONTACT */

  const [
    liveChatEnabled,
    setLiveChatEnabled,
  ] = useState(true);

  /* STATUS */

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

  useEffect(() => {
    async function loadOwner() {
      try {
        const supabaseUrl =
          process.env
            .NEXT_PUBLIC_SUPABASE_URL;

        const supabaseKey =
          process.env
            .NEXT_PUBLIC_SUPABASE_ANON_KEY ||
          process.env
            .NEXT_PUBLIC_SUPABASE_KEY;

        if (
          !supabaseUrl ||
          !supabaseKey
        ) {
          setErrorMessage(
            "Supabase კავშირი არ არის კონფიგურირებული."
          );

          setAuthLoading(false);
          return;
        }

        const supabase =
          createClient(
            supabaseUrl,
            supabaseKey
          );

        const {
          data: {
            user,
          },
          error,
        } =
          await supabase.auth.getUser();

        if (error || !user) {
          router.replace("/login");
          return;
        }

        setOwner({
          firstName:
            user.user_metadata
              ?.first_name || "",

          lastName:
            user.user_metadata
              ?.last_name || "",

          phone:
            user.user_metadata
              ?.phone || "",

          email:
            user.email || "",
        });
      } catch (error) {
        console.error(
          "Load owner error:",
          error
        );

        setErrorMessage(
          "Owner ინფორმაციის ჩატვირთვა ვერ მოხერხდა."
        );
      } finally {
        setAuthLoading(false);
      }
    }

    loadOwner();
  }, [router]);

  function validateForm() {
    if (!owner.firstName) {
      return "Owner-ის სახელი ვერ მოიძებნა.";
    }

    if (!owner.lastName) {
      return "Owner-ის გვარი ვერ მოიძებნა.";
    }

    if (!owner.phone) {
      return "Owner-ის ტელეფონის ნომერი ვერ მოიძებნა.";
    }

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
        adminEmail
          .trim()
          .toLowerCase() ===
        owner.email
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
        owner,

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

                  add_admin: false,
                  change_owner: false,
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

        item_type: type,
        pet_type: type,

        item_name:
          itemName.trim(),

        colour:
          colour.trim() || null,

        sex:
          sex || null,

        date_of_birth:
          dateOfBirth || null,

        weight:
          weight || null,

        photo:
          photo.trim() || null,

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

        phone_enabled: true,

        live_chat_enabled:
          liveChatEnabled,
      };

      console.log(
        "PET PROFILE PAYLOAD:",
        payload
      );

      setSuccessMessage(
        `${petLabel} პროფილის მონაცემები მზადაა. Owner account-იც სწორად არის მიბმული. შემდეგ ეტაპზე Supabase-ში შენახვას დავამატებთ.`
      );
    } catch (error) {
      console.error(
        "Profile error:",
        error
      );

      setErrorMessage(
        "პროფილის დამუშავებისას მოხდა შეცდომა."
      );
    } finally {
      setSaving(false);
    }
  }

  if (authLoading) {
    return (
      <div
        style={{
          minHeight: "300px",
          display: "grid",
          placeItems: "center",
          color: "#718095",
          fontSize: "11px",
        }}
      >
        Owner account იტვირთება...
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
    >
      {errorMessage && (
        <div
          style={{
            marginBottom: "16px",
            padding: "14px",
            border:
              "1px solid #f0c8cc",
            borderRadius: "12px",
            background: "#fff7f8",
            color: "#a13e47",
            fontSize: "10px",
          }}
        >
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div
          style={{
            marginBottom: "16px",
            padding: "14px",
            border:
              "1px solid #c6dfd1",
            borderRadius: "12px",
            background: "#f6fbf8",
            color: "#386f56",
            fontSize: "10px",
          }}
        >
          {successMessage}
        </div>
      )}

      <OwnerInformationSection
        firstName={owner.firstName}
        lastName={owner.lastName}
        phone={owner.phone}
        email={owner.email}
      />

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

      <PetBasicInfo
        itemName={itemName}
        setItemName={setItemName}
        colour={colour}
        setColour={setColour}
        sex={sex}
        setSex={setSex}
        dateOfBirth={dateOfBirth}
        setDateOfBirth={
          setDateOfBirth
        }
        weight={weight}
        setWeight={setWeight}
        photo={photo}
        setPhoto={setPhoto}
      />

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

      <FinderVisibilitySection
        showEmail={showEmail}
        setShowEmail={setShowEmail}
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

      <ContactOptionsSection
        liveChatEnabled={
          liveChatEnabled
        }
        setLiveChatEnabled={
          setLiveChatEnabled
        }
      />

      <section
        style={{
          marginTop: "16px",
          padding: "23px 25px",
          border:
            "1px solid #cddff5",
          borderRadius: "16px",
          background:
            "linear-gradient(135deg,#f7faff 0%,#edf5ff 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <span
              style={{
                color: "#1266e9",
                fontSize: "8px",
                fontWeight: 900,
              }}
            >
              FINAL STEP
            </span>

            <h3
              style={{
                margin: "6px 0 0",
                color: "#233b55",
                fontSize: "17px",
              }}
            >
              პროფილის შექმნა
            </h3>

            <p
              style={{
                margin: "7px 0 0",
                color: "#7c8a9a",
                fontSize: "9px",
              }}
            >
              კატეგორია შექმნის შემდეგ აღარ შეიცვლება.
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{
              minHeight: "46px",
              padding: "0 18px",
              border: 0,
              borderRadius: "10px",
              background: "#1266e9",
              color: "#ffffff",
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            {saving
              ? "ინახება..."
              : "პროფილის შექმნა"}
          </button>
        </div>
      </section>
    </form>
  );
}
