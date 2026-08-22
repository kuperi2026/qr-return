"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  createClient,
  type SupabaseClient,
  type User,
} from "@supabase/supabase-js";

import OwnerInformationSection from "./OwnerInformationSection";

import AdminAccessSection, {
  type AdminPermissions,
} from "./AdminAccessSection";

type ProductType =
  | "dog"
  | "cat"
  | "keys"
  | "wallet"
  | "bag"
  | "suitcase";

type OwnerRegistrationStepProps = {
  type: ProductType;
};

type OwnerData = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

const PRODUCT_META: Record<
  ProductType,
  {
    label: string;
    emoji: string;
  }
> = {
  dog: {
    label: "ძაღლი",
    emoji: "🐶",
  },

  cat: {
    label: "კატა",
    emoji: "🐱",
  },

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

  if (
    !supabaseUrl ||
    !supabaseKey
  ) {
    return null;
  }

  return createClient(
    supabaseUrl,
    supabaseKey
  );
}

export default function OwnerRegistrationStep({
  type,
}: OwnerRegistrationStepProps) {
  const router = useRouter();

  const meta =
    PRODUCT_META[type];

  const [
    supabase,
    setSupabase,
  ] =
    useState<SupabaseClient | null>(
      null
    );

  const [
    currentUser,
    setCurrentUser,
  ] =
    useState<User | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] =
    useState("");

  const [
    owner,
    setOwner,
  ] =
    useState<OwnerData>({
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
    });

  const [
    adminEnabled,
    setAdminEnabled,
  ] =
    useState(false);

  const [
    adminEmail,
    setAdminEmail,
  ] =
    useState("");

  const [
    permissions,
    setPermissions,
  ] =
    useState<AdminPermissions>(
      initialPermissions
    );

  useEffect(() => {
    async function loadOwner() {
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
          data: {
            user,
          },
          error: userError,
        } =
          await client.auth.getUser();

        if (
          userError ||
          !user
        ) {
          router.replace(
            "/login"
          );

          return;
        }

        setCurrentUser(
          user
        );

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
        } =
          await client
            .from(
              "secondary_admins"
            )
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
          setAdminEnabled(
            true
          );

          setAdminEmail(
            adminData
              .admin_email ||
              ""
          );

          setPermissions({
            viewProfiles:
              Boolean(
                adminData
                  .view_profiles
              ),

            editProfiles:
              Boolean(
                adminData
                  .edit_profiles
              ),

            editFinderSettings:
              Boolean(
                adminData
                  .edit_finder_settings
              ),

            editLiveChat:
              Boolean(
                adminData
                  .edit_live_chat
              ),

            viewMessages:
              Boolean(
                adminData
                  .view_messages
              ),

            replyMessages:
              Boolean(
                adminData
                  .reply_messages
              ),

            markLostFound:
              Boolean(
                adminData
                  .mark_lost_found
              ),

            addProfiles:
              Boolean(
                adminData
                  .add_profiles
              ),
          });
        }
      } catch (error) {
        console.error(
          "Owner load error:",
          error
        );

        setErrorMessage(
          "მფლობელის ინფორმაციის ჩატვირთვა ვერ მოხერხდა."
        );
      } finally {
        setLoading(
          false
        );
      }
    }

    loadOwner();
  }, [router]);

  function validate() {
    if (!currentUser) {
      return "მომხმარებლის ანგარიში ვერ მოიძებნა.";
    }

    if (
      !owner.firstName.trim()
    ) {
      return "მფლობელის სახელი ვერ მოიძებნა.";
    }

    if (
      !owner.lastName.trim()
    ) {
      return "მფლობელის გვარი ვერ მოიძებნა.";
    }

    if (
      !owner.phone.trim()
    ) {
      return "მფლობელის ტელეფონის ნომერი ვერ მოიძებნა.";
    }

    if (
      adminEnabled &&
      !adminEmail.trim()
    ) {
      return "Secondary Admin-ის ელფოსტა მიუთითეთ.";
    }

    if (
      adminEnabled
    ) {
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

  async function saveAdmin(
    client: SupabaseClient,
    ownerId: string
  ) {
    if (
      !adminEnabled
    ) {
      const {
        error,
      } =
        await client
          .from(
            "secondary_admins"
          )
          .delete()
          .eq(
            "owner_id",
            ownerId
          );

      if (error) {
        throw error;
      }

      return;
    }

    const {
      error,
    } =
      await client
        .from(
          "secondary_admins"
        )
        .upsert(
          {
            owner_id:
              ownerId,

            admin_email:
              adminEmail
                .trim()
                .toLowerCase(),

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
          },
          {
            onConflict:
              "owner_id",
          }
        );

    if (error) {
      throw error;
    }
  }

  async function continueToProduct() {
    setErrorMessage(
      ""
    );

    const validationError =
      validate();

    if (
      validationError
    ) {
      setErrorMessage(
        validationError
      );

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

    setSaving(
      true
    );

    try {
      await saveAdmin(
        supabase,
        currentUser.id
      );

      router.push(
        `/register-item/${type}?step=product`
      );
    } catch (error) {
      console.error(
        "Owner step save error:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "ინფორმაციის შენახვა ვერ მოხერხდა."
      );
    } finally {
      setSaving(
        false
      );
    }
  }

  if (loading) {
    return (
      <div className="loading">
        მფლობელის ინფორმაცია იტვირთება...

        <style jsx>{`
          .loading {
            min-height: 320px;

            display: grid;
            place-items: center;

            border:
              1px solid #dce6f1;

            border-radius: 16px;

            background:
              #ffffff;

            color:
              #718095;

            font-size:
              11px;
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <div className="flow">

        {/* PROGRESS */}

        <section className="progressCard">
          <div className="progressTop">
            <div className="step active">
              <div className="circle">
                01
              </div>

              <div>
                <span>
                  STEP 01
                </span>

                <strong>
                  მფლობელი
                </strong>
              </div>
            </div>

            <div className="line" />

            <div className="step">
              <div className="circle">
                02
              </div>

              <div>
                <span>
                  STEP 02
                </span>

                <strong>
                  {meta.label}
                </strong>
              </div>
            </div>
          </div>

          <div className="progressBar">
            <div />
          </div>
        </section>

        {/* TITLE */}

        <section className="intro">
          <div className="productIcon">
            {meta.emoji}
          </div>

          <div>
            <span>
              PRODUCT REGISTRATION
            </span>

            <h1>
              ჯერ გადაამოწმეთ
              მფლობელის ინფორმაცია
            </h1>

            <p>
              შემდეგ ეტაპზე შეავსებთ{" "}
              <strong>
                {meta.label}
              </strong>
              -ის პროფილს.
            </p>
          </div>
        </section>

        {errorMessage && (
          <div
            className="error"
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

        {/* CONTINUE */}

        <section className="continueCard">
          <div>
            <span>
              NEXT STEP
            </span>

            <h2>
              {meta.emoji}{" "}
              {meta.label}ს ინფორმაცია
            </h2>

            <p>
              შემდეგ გვერდზე შეიყვანთ
              QR კოდსა და პროდუქტის
              ინფორმაციას.
            </p>
          </div>

          <div className="buttons">
            <a href="/register">
              უკან
            </a>

            <button
              type="button"
              onClick={
                continueToProduct
              }
              disabled={
                saving
              }
            >
              {saving
                ? "ინახება..."
                : "გაგრძელება →"}
            </button>
          </div>
        </section>
      </div>

      <style jsx>{`
        .flow {
          width: 100%;
        }

        .progressCard {
          margin-bottom: 16px;

          padding: 18px 20px;

          border:
            1px solid #dce6f1;

          border-radius: 16px;

          background:
            #ffffff;

          box-shadow:
            0 10px 28px
            rgba(
              30,
              70,
              120,
              0.04
            );
        }

        .progressTop {
          display: flex;

          align-items: center;

          gap: 13px;
        }

        .step {
          display: flex;

          align-items: center;

          gap: 9px;

          opacity: 0.45;
        }

        .step.active {
          opacity: 1;
        }

        .circle {
          width: 35px;
          height: 35px;

          flex: 0 0 35px;

          display: grid;
          place-items: center;

          border-radius: 10px;

          background:
            #edf4ff;

          color:
            #1266e9;

          font-size:
            8px;

          font-weight:
            950;
        }

        .step.active
          .circle {
          background:
            #1266e9;

          color:
            #ffffff;
        }

        .step span,
        .step strong {
          display: block;
        }

        .step span {
          color:
            #8795a5;

          font-size:
            6px;

          font-weight:
            900;
        }

        .step strong {
          margin-top:
            3px;

          color:
            #334d68;

          font-size:
            9px;
        }

        .line {
          flex: 1;

          height: 1px;

          background:
            #dce5ef;
        }

        .progressBar {
          height: 4px;

          margin-top:
            15px;

          overflow: hidden;

          border-radius:
            999px;

          background:
            #edf1f6;
        }

        .progressBar div {
          width: 50%;
          height: 100%;

          border-radius:
            999px;

          background:
            #1266e9;
        }

        .intro {
          margin-bottom:
            16px;

          padding:
            22px;

          display: flex;

          align-items:
            center;

          gap:
            14px;

          border:
            1px solid #dce6f1;

          border-radius:
            16px;

          background:
            linear-gradient(
              135deg,
              #ffffff,
              #f5f9ff
            );
        }

        .productIcon {
          width: 55px;
          height: 55px;

          flex: 0 0 55px;

          display: grid;
          place-items: center;

          border-radius:
            15px;

          background:
            #edf4ff;

          font-size:
            27px;
        }

        .intro span {
          color:
            #1266e9;

          font-size:
            7px;

          font-weight:
            900;

          letter-spacing:
            1px;
        }

        .intro h1 {
          margin:
            5px 0 0;

          color:
            #223b55;

          font-size:
            20px;
        }

        .intro p {
          margin:
            6px 0 0;

          color:
            #7c8c9e;

          font-size:
            9px;
        }

        .intro p strong {
          color:
            #1266e9;
        }

        .error {
          margin-bottom:
            16px;

          padding:
            14px;

          border:
            1px solid #efc7cb;

          border-radius:
            12px;

          background:
            #fff7f8;

          color:
            #a3434c;
        }

        .error strong {
          display:
            block;

          font-size:
            10px;
        }

        .error p {
          margin:
            4px 0 0;

          font-size:
            9px;
        }

        .continueCard {
          margin-top:
            16px;

          padding:
            22px 24px;

          display: flex;

          align-items:
            center;

          justify-content:
            space-between;

          gap:
            20px;

          border:
            1px solid #cddff5;

          border-radius:
            16px;

          background:
            linear-gradient(
              135deg,
              #f7faff,
              #edf5ff
            );
        }

        .continueCard
          > div
          > span {
          color:
            #1266e9;

          font-size:
            7px;

          font-weight:
            900;

          letter-spacing:
            1px;
        }

        .continueCard h2 {
          margin:
            5px 0 0;

          color:
            #29425d;

          font-size:
            16px;
        }

        .continueCard p {
          margin:
            5px 0 0;

          color:
            #7e8da0;

          font-size:
            8px;
        }

        .buttons {
          display: flex;

          align-items:
            center;

          gap:
            8px;
        }

        .buttons a,
        .buttons button {
          min-height:
            44px;

          padding:
            0 16px;

          display: flex;

          align-items:
            center;

          justify-content:
            center;

          border-radius:
            10px;

          font-family:
            inherit;

          font-size:
            9px;

          font-weight:
            900;

          text-decoration:
            none;
        }

        .buttons a {
          border:
            1px solid #ccd9e7;

          background:
            #ffffff;

          color:
            #64778b;
        }

        .buttons button {
          min-width:
            135px;

          border: 0;

          background:
            #1266e9;

          color:
            #ffffff;

          cursor:
            pointer;
        }

        .buttons button:disabled {
          opacity:
            0.6;

          cursor:
            wait;
        }

        @media (
          max-width:
            650px
        ) {
          .intro {
            align-items:
              flex-start;
          }

          .continueCard {
            flex-direction:
              column;

            align-items:
              stretch;
          }

          .buttons {
            width:
              100%;
          }

          .buttons a,
          .buttons button {
            flex: 1;
          }

          .step strong {
            font-size:
              8px;
          }
        }
      `}</style>
    </>
  );
}
