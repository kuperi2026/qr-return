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

import FinderVisibilitySection from "./FinderVisibilitySection";
import ContactOptionsSection from "./ContactOptionsSection";

type ItemType =
  | "keys"
  | "wallet"
  | "bag"
  | "suitcase";

type ItemRegistrationFormProps = {
  type: ItemType;
};

type OwnerData = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

const ITEM_META: Record<
  ItemType,
  {
    label: string;
    emoji: string;
  }
> = {
  keys: {
    label: "გასაღები",
    emoji: "🔑",
  },

  wallet: {
    label: "საფულე",
    emoji: "👛",
  },

  bag: {
    label: "ჩანთა",
    emoji: "👜",
  },

  suitcase: {
    label: "ჩემოდანი",
    emoji: "🧳",
  },
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

export default function ItemRegistrationForm({
  type,
}: ItemRegistrationFormProps) {
  const router = useRouter();

  const meta =
    ITEM_META[type];

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

  /* ================= ITEM ================= */

  const [
    tagCode,
    setTagCode,
  ] = useState("");

  const [
    itemName,
    setItemName,
  ] = useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [
    brand,
    setBrand,
  ] = useState("");

  const [
    model,
    setModel,
  ] = useState("");

  const [
    colour,
    setColour,
  ] = useState("");

  const [
    size,
    setSize,
  ] = useState("");

  const [
    material,
    setMaterial,
  ] = useState("");

  const [
    distinctiveFeatures,
    setDistinctiveFeatures,
  ] = useState("");

  const [
    finderMessage,
    setFinderMessage,
  ] = useState("");

  const [
    photo,
    setPhoto,
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
    showPhoto,
    setShowPhoto,
  ] = useState(true);

  const [
    showDescription,
    setShowDescription,
  ] = useState(true);

  const [
    showFinderMessage,
    setShowFinderMessage,
  ] = useState(true);

  /* Dummy pet-specific toggles,
     რადგან საერთო FinderVisibilitySection
     ამ props-ს ითხოვს */
  const [
    showMedicalInfo,
    setShowMedicalInfo,
  ] = useState(false);

  const [
    showBehaviourNote,
    setShowBehaviourNote,
  ] = useState(false);

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
      return "მფლობელის ტელეფონი ვერ მოიძებნა.";
    }

    if (!tagCode.trim()) {
      return "QR / Tag Code სავალდებულოა.";
    }

    if (!itemName.trim()) {
      return "პროფილის სახელი სავალდებულოა.";
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
          owner_id: ownerId,

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

        return;
      }

      await saveSecondaryAdmin(
        supabase,
        currentUser.id
      );

      const {
        data: createdProfile,
        error: insertError,
      } = await supabase
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
            null,

          item_name:
            itemName.trim(),

          description:
            description.trim() ||
            null,

          brand:
            brand.trim() ||
            null,

          model:
            model.trim() ||
            null,

          colour:
            colour.trim() ||
            null,

          size:
            size.trim() ||
            null,

          material:
            material.trim() ||
            null,

          distinctive_features:
            distinctiveFeatures.trim() ||
            null,

          finder_message:
            finderMessage.trim() ||
            null,

          photo:
            photo.trim() ||
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
            showPhoto,

          show_medical_info:
            false,

          show_behaviour_note:
            false,

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
        })
        .select(
          "id, tag_code, item_type, item_name"
        )
        .single();

      if (insertError) {
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
        `${meta.label} წარმატებით დარეგისტრირდა.`
      );

      setTimeout(() => {
        router.push(
          "/my-profiles"
        );
      }, 800);
    } catch (error) {
      console.error(
        "Item save error:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? `შენახვა ვერ მოხერხდა: ${error.message}`
          : "შენახვა ვერ მოხერხდა."
      );
    } finally {
      setSaving(false);
    }
  }

  if (authLoading) {
    return (
      <div
        style={{
          minHeight: "320px",
          display: "grid",
          placeItems: "center",
          border:
            "1px solid #dce6f1",
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

  return (
    <>
      <form
        className="itemForm"
        onSubmit={handleSubmit}
      >
        {errorMessage && (
          <div className="message error">
            <strong>
              მონაცემები გადაამოწმეთ
            </strong>

            <p>
              {errorMessage}
            </p>
          </div>
        )}

        {successMessage && (
          <div className="message success">
            <strong>
              პროფილი შეიქმნა
            </strong>

            <p>
              {successMessage}
            </p>
          </div>
        )}

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

        <section className="card">
          <div className="cardHeader">
            <div className="number">
              03
            </div>

            <div>
              <span>
                ITEM INFORMATION
              </span>

              <h2>
                {meta.emoji}{" "}
                {meta.label}
              </h2>

              <p>
                შეავსეთ QR პროდუქტთან
                დაკავშირებული ძირითადი
                ინფორმაცია.
              </p>
            </div>
          </div>

          <div className="qrBox">
            <label>
              QR / Tag Code *
            </label>

            <input
              value={tagCode}
              onChange={(event) =>
                setTagCode(
                  event.target.value
                    .toUpperCase()
                    .replace(/\s/g, "")
                )
              }
              placeholder="მაგ. QR-000123"
            />

            <small>
              ეს QR კოდი შეიძლება
              დარეგისტრირდეს მხოლოდ ერთხელ.
            </small>
          </div>

          <div className="grid">
            <Field
              label="პროფილის სახელი *"
              full
            >
              <input
                value={itemName}
                onChange={(event) =>
                  setItemName(
                    event.target.value
                  )
                }
                placeholder={
                  type === "keys"
                    ? "მაგ. სახლის გასაღები"
                    : type === "wallet"
                    ? "მაგ. ჩემი საფულე"
                    : type === "bag"
                    ? "მაგ. სამუშაო ჩანთა"
                    : "მაგ. სამგზავრო ჩემოდანი"
                }
              />
            </Field>

            <Field label="ბრენდი">
              <input
                value={brand}
                onChange={(event) =>
                  setBrand(
                    event.target.value
                  )
                }
                placeholder="Brand"
              />
            </Field>

            <Field label="მოდელი">
              <input
                value={model}
                onChange={(event) =>
                  setModel(
                    event.target.value
                  )
                }
                placeholder="Model"
              />
            </Field>

            <Field label="ფერი">
              <input
                value={colour}
                onChange={(event) =>
                  setColour(
                    event.target.value
                  )
                }
                placeholder="Colour"
              />
            </Field>

            <Field label="ზომა">
              <input
                value={size}
                onChange={(event) =>
                  setSize(
                    event.target.value
                  )
                }
                placeholder="Size"
              />
            </Field>

            <Field label="მასალა">
              <input
                value={material}
                onChange={(event) =>
                  setMaterial(
                    event.target.value
                  )
                }
                placeholder="Material"
              />
            </Field>

            <Field
              label="ფოტოს URL"
              full
            >
              <input
                type="url"
                value={photo}
                onChange={(event) =>
                  setPhoto(
                    event.target.value
                  )
                }
                placeholder="https://..."
              />
            </Field>

            <Field
              label="აღწერა"
              full
            >
              <textarea
                rows={4}
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                placeholder="აღწერეთ ნივთი..."
              />
            </Field>

            <Field
              label="განმასხვავებელი ნიშნები"
              full
            >
              <textarea
                rows={4}
                value={
                  distinctiveFeatures
                }
                onChange={(event) =>
                  setDistinctiveFeatures(
                    event.target.value
                  )
                }
                placeholder="მაგ. სტიკერი, ნაკაწრი, ინიციალები..."
              />
            </Field>

            <Field
              label="შეტყობინება მპოვნელისთვის"
              full
            >
              <textarea
                rows={4}
                value={finderMessage}
                onChange={(event) =>
                  setFinderMessage(
                    event.target.value
                  )
                }
                placeholder="მაგ. გთხოვთ დამიკავშირდეთ."
              />
            </Field>
          </div>
        </section>

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
            showPhoto
          }
          setShowPetPhoto={
            setShowPhoto
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
          <div>
            <span>
              FINAL STEP
            </span>

            <h3>
              {meta.label}ს პროფილის შექმნა
            </h3>

            <p>
              QR კოდი ამ კატეგორიაზე
              დაფიქსირდება და შემდეგ
              სხვა კატეგორიად ვერ შეიცვლება.
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
          >
            {saving
              ? "ინახება..."
              : "პროფილის შექმნა"}
          </button>
        </section>
      </form>

      <style jsx>{`
        .itemForm {
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

        .card {
          margin-top: 16px;
          padding: 25px;
          border: 1px solid #dce6f1;
          border-radius: 16px;
          background: #ffffff;
          box-shadow:
            0 12px 30px
            rgba(30,70,120,.05);
        }

        .cardHeader {
          display: grid;
          grid-template-columns: 42px 1fr;
          gap: 13px;
          padding-bottom: 20px;
          border-bottom:
            1px solid #e7edf4;
        }

        .number {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: #edf4ff;
          color: #1266e9;
          font-size: 10px;
          font-weight: 950;
        }

        .cardHeader span {
          color: #1266e9;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 1.2px;
        }

        .cardHeader h2 {
          margin: 5px 0 0;
          color: #223951;
          font-size: 18px;
        }

        .cardHeader p {
          margin: 6px 0 0;
          color: #8290a1;
          font-size: 9px;
        }

        .qrBox {
          margin-top: 22px;
          padding: 17px;
          border: 1px solid #cfe0f6;
          border-radius: 13px;
          background: #f7faff;
        }

        .qrBox label {
          display: block;
          margin-bottom: 7px;
          color: #344a62;
          font-size: 10px;
          font-weight: 850;
        }

        .qrBox input {
          width: 100%;
          min-height: 48px;
          padding: 0 13px;
          border: 1px solid #d5e0eb;
          border-radius: 10px;
          outline: none;
        }

        .qrBox small {
          display: block;
          margin-top: 6px;
          color: #8a98a8;
          font-size: 8px;
        }

        .grid {
          margin-top: 22px;
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0,1fr));
          gap: 16px 14px;
        }

        input,
        textarea {
          width: 100%;
          border: 1px solid #d5e0eb;
          border-radius: 10px;
          outline: none;
          background: #ffffff;
          color: #263e57;
          font-family: inherit;
          font-size: 11px;
        }

        input {
          min-height: 48px;
          padding: 0 13px;
        }

        textarea {
          padding: 12px 13px;
          resize: vertical;
          line-height: 1.5;
        }

        input:focus,
        textarea:focus {
          border-color: #1266e9;
          box-shadow:
            0 0 0 4px
            rgba(18,102,233,.08);
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

        .saveCard span {
          color: #1266e9;
          font-size: 8px;
          font-weight: 900;
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
        }

        .saveCard button:disabled {
          opacity: .6;
        }

        @media (max-width: 650px) {
          .grid {
            grid-template-columns: 1fr;
          }

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

function Field({
  label,
  full = false,
  children,
}: {
  label: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        gridColumn:
          full
            ? "1 / -1"
            : undefined,
      }}
    >
      <label
        style={{
          display: "block",
          marginBottom: "7px",
          color: "#344a62",
          fontSize: "9px",
          fontWeight: 850,
        }}
      >
        {label}
      </label>

      {children}
    </div>
  );
}
