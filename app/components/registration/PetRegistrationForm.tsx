"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  createClient,
  type SupabaseClient,
  type User,
} from "@supabase/supabase-js";

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

  /* ================= ADMIN ================= */

  const [
    adminEnabled,
    setAdminEnabled,
  ] = useState(false);

  const [
    adminEmail,
    setAdminEmail,
  ] = useState("");

  const [
    permissions,
    setPermissions,
  ] = useState<AdminPermissions>(
    initialPermissions
  );

  /* ================= QR / PET ================= */

  const [
    tagCode,
    setTagCode,
  ] = useState("");

  const [
    itemName,
    setItemName,
  ] = useState("");

  const [
    colour,
    setColour,
  ] = useState("");

  const [
    sex,
    setSex,
  ] = useState("");

  const [
    dateOfBirth,
    setDateOfBirth,
  ] = useState("");

  const [
    weight,
    setWeight,
  ] = useState("");

  const [
    photo,
    setPhoto,
  ] = useState("");

  const [
    medicalInfo,
    setMedicalInfo,
  ] = useState("");

  const [
    behaviourNote,
    setBehaviourNote,
  ] = useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [
    finderMessage,
    setFinderMessage,
  ] = useState("");

  /* ================= FINDER VIEW ================= */

  const [
    showEmail,
    setShowEmail,
  ] = useState(false);

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

  const [
    saving,
    setSaving,
  ] = useState(false);

  const petLabel =
    type === "dog"
      ? "ძაღლი"
      : "კატა";

  /* ================= LOAD ACCOUNT ================= */

  useEffect(() => {
    async function loadAccount() {
      try {
        const client =
          createSupabaseClient();

        if (!client) {
          setErrorMessage(
            "Supabase კავშირი არ არის კონფიგურირებული."
          );

          setAuthLoading(false);
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

        const {
          data: adminData,
          error: adminError,
        } = await client
          .from("secondary_admins")
          .select(
            `
              admin_email,
              view_profiles,
              edit_profiles,
              edit_finder_settings,
              edit_live_chat,
              view_messages,
              reply_messages,
              mark_lost_found,
              add_profiles
            `
          )
          .eq(
            "owner_id",
            user.id
          )
          .maybeSingle();

        if (adminError) {
          console.error(
            "Admin load error:",
            adminError
          );
        }

        if (adminData) {
          setAdminEnabled(true);

          setAdminEmail(
            adminData.admin_email || ""
          );

          setPermissions({
            viewProfiles:
              Boolean(
                adminData.view_profiles
              ),

            editProfiles:
              Boolean(
                adminData.edit_profiles
              ),

            editFinderSettings:
              Boolean(
                adminData.edit_finder_settings
              ),

            editLiveChat:
              Boolean(
                adminData.edit_live_chat
              ),

            viewMessages:
              Boolean(
                adminData.view_messages
              ),

            replyMessages:
              Boolean(
                adminData.reply_messages
              ),

            markLostFound:
              Boolean(
                adminData.mark_lost_found
              ),

            addProfiles:
              Boolean(
                adminData.add_profiles
              ),
          });
        }
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

  /* ================= VALIDATION ================= */

  function validateForm() {
    if (!currentUser) {
      return "მომხმარებლის ანგარიში ვერ მოიძებნა.";
    }

    if (!owner.firstName.trim()) {
      return "მფლობელის სახელი ვერ მოიძებნა.";
    }

    if (!owner.lastName.trim()) {
      return "მფლობელის გვარი ვერ მოიძებნა.";
    }

    if (!owner.phone.trim()) {
      return "მფლობელის ტელეფონის ნომერი ვერ მოიძებნა.";
    }

    if (!tagCode.trim()) {
      return "QR / Tag Code სავალდებულოა.";
    }

    if (!itemName.trim()) {
      return "ცხოველის სახელი სავალდებულოა.";
    }

    if (
      adminEnabled &&
      !adminEmail.trim()
    ) {
      return "Secondary Admin-ის ელფოსტა სავალდებულოა.";
    }

    if (adminEnabled) {
      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailPattern.test(
          adminEmail.trim()
        )
      ) {
        return "Secondary Admin-ის ელფოსტა არასწორია.";
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

  /* ================= SAVE ADMIN ================= */

  async function saveSecondaryAdmin(
    client: SupabaseClient,
    ownerId: string
  ) {
    if (!adminEnabled) {
      return;
    }

    const { error } = await client
      .from("secondary_admins")
      .upsert(
        {
          owner_id:
            ownerId,

          admin_email:
            adminEmail
              .trim()
              .toLowerCase(),

          view_profiles:
            permissions.viewProfiles,

          edit_profiles:
            permissions.editProfiles,

          edit_finder_settings:
            permissions.editFinderSettings,

          edit_live_chat:
            permissions.editLiveChat,

          view_messages:
            permissions.viewMessages,

          reply_messages:
            permissions.replyMessages,

          mark_lost_found:
            permissions.markLostFound,

          add_profiles:
            permissions.addProfiles,
        },
        {
          onConflict: "owner_id",
        }
      );

    if (error) {
      throw new Error(
        `Secondary Admin ვერ შეინახა: ${error.message}`
      );
    }
  }

  /* ================= SAVE PROFILE ================= */

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

      /* ================= CHECK QR ================= */

      const {
        data: existingTag,
        error: tagCheckError,
      } = await supabase
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

      /* ================= SAVE ADMIN ================= */

      await saveSecondaryAdmin(
        supabase,
        currentUser.id
      );

      /* ================= SAVE PROFILE ================= */

      const {
        data: createdProfile,
        error: insertError,
      } = await supabase
        .from("item")
        .insert({
          /* QR */

          tag_code:
            cleanTagCode,

          /* OWNER */

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

          /* LOCKED CATEGORY */

          item_type:
            type,

          pet_type:
            type,

          /* PET */

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

          /* FINDER VISIBILITY */

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

          /* CONTACT */

          phone_enabled:
            true,

          live_chat_enabled:
            liveChatEnabled,

          /* STATUS */

          active:
            true,
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
          lowerMessage.includes(
            "duplicate"
          ) ||
          lowerMessage.includes(
            "unique"
          )
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
          "/my-profiles"
        );
      }, 800);
    } catch (error) {
      console.error(
        "Profile save error:",
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

  /* ================= LOADING ================= */

  if (authLoading) {
    return (
      <div
        style={{
          minHeight: "320px",
          display: "grid",
          placeItems: "center",
          border: "1px solid #dce6f1",
          borderRadius: "16px",
          background: "#ffffff",
          color: "#718095",
          fontSize: "11px",
        }}
      >
        თქვენი ანგარიში იტვირთება...
      </div>
    );
  }

  /* ================= FORM ================= */

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
            className="message success"
            role="status"
          >
            <span>✓</span>

            <div>
              <strong>
                პროფილი შეიქმნა
              </strong>

              <p>
                {successMessage}
              </p>
            </div>
          </div>
        )}

        {/* OWNER */}

        <OwnerInformationSection
          firstName={
            owner.firstName
          }
          lastName={
            owner.lastName
          }
          phone={
            owner.phone
          }
          email={
            owner.email
          }
        />

        {/* ADMIN */}

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

        {/* PET BASIC */}

        <PetBasicInfo
          tagCode={
            tagCode
          }
          setTagCode={
            setTagCode
          }
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

        {/* HEALTH */}

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

        {/* FINDER VIEW */}

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

        {/* CONTACT */}

        <ContactOptionsSection
          liveChatEnabled={
            liveChatEnabled
          }
          setLiveChatEnabled={
            setLiveChatEnabled
          }
        />

        {/* SAVE */}

        <section className="saveCard">
          <div>
            <span>
              FINAL STEP
            </span>

            <h3>
              პროფილის შექმნა
            </h3>

            <p>
              QR კოდი{" "}
              <strong>
                {tagCode ||
                  "ჯერ არ არის მითითებული"}
              </strong>
              {" "}დაფიქსირდება{" "}
              <strong>
                {petLabel}
              </strong>
              -ის კატეგორიაზე.
            </p>
          </div>

          <button
            type="submit"
            disabled={
              saving
            }
          >
            {saving
              ? "ინახება..."
              : "პროფილის შექმნა"}
          </button>
        </section>
      </form>

      <style jsx>{`
        .petForm {
          width: 100%;
        }

        .message {
          margin-bottom: 16px;

          padding: 14px;

          display: flex;
          align-items: flex-start;

          gap: 10px;

          border-radius: 12px;
        }

        .message > span {
          width: 25px;
          height: 25px;

          flex: 0 0 25px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          font-size: 9px;
          font-weight: 950;
        }

        .message strong {
          display: block;

          font-size: 10px;
        }

        .message p {
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
        }

        .success {
          border:
            1px solid #c6dfd1;

          background: #f6fbf8;

          color: #386f56;
        }

        .success > span {
          background: #e1f2e8;
        }

        .saveCard {
          margin-top: 16px;

          padding: 23px 25px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 20px;

          border:
            1px solid #cddff5;

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

          letter-spacing: 1.2px;
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
          line-height: 1.6;
        }

        .saveCard p strong {
          color: #1266e9;
        }

        .saveCard button {
          min-width: 160px;
          min-height: 46px;

          padding: 0 16px;

          border: 0;
          border-radius: 10px;

          background: #1266e9;

          color: #ffffff;

          font-family: inherit;
          font-size: 9px;
          font-weight: 900;

          cursor: pointer;

          box-shadow:
            0 10px 20px
            rgba(
              18,
              102,
              233,
              0.16
            );
        }

        .saveCard button:disabled {
          opacity: 0.6;

          cursor: wait;
        }

        @media (max-width: 650px) {
          .saveCard {
            flex-direction: column;

            align-items: stretch;
          }

          .saveCard button {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}
