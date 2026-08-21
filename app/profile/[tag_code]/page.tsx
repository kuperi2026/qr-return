"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

import {
  createClient,
} from "@supabase/supabase-js";

type PublicProfile = {
  id: string;

  tag_code: string;
  item_type: string;
  item_name: string | null;

  owner_first_name: string | null;
  owner_last_name: string | null;
  owner_phone: string | null;
  owner_email: string | null;

  photo: string | null;
  medical_info: string | null;
  behaviour_note: string | null;
  description: string | null;
  finder_message: string | null;

  show_owner_name: boolean | null;
  show_owner_phone: boolean | null;

  show_email: boolean | null;
  show_pet_photo: boolean | null;
  show_medical_info: boolean | null;
  show_behaviour_note: boolean | null;
  show_description: boolean | null;
  show_finder_message: boolean | null;

  phone_enabled: boolean | null;
  live_chat_enabled: boolean | null;

  active: boolean | null;
};

const CATEGORY_META: Record<
  string,
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

  suitcase: {
    label: "ჩემოდანი",
    emoji: "🧳",
  },

  bag: {
    label: "ჩანთა",
    emoji: "👜",
  },
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

export default function PublicProfilePage() {
  const params = useParams();

  const rawTag =
    params?.tag_code;

  const tagCode =
    typeof rawTag === "string"
      ? rawTag
      : "";

  const [
    profile,
    setProfile,
  ] =
    useState<PublicProfile | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    errorMessage,
    setErrorMessage,
  ] =
    useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const supabase =
          createSupabaseClient();

        if (!supabase) {
          setErrorMessage(
            "Supabase კავშირი არ არის კონფიგურირებული."
          );

          return;
        }

        if (!tagCode) {
          setErrorMessage(
            "QR კოდი ვერ მოიძებნა."
          );

          return;
        }

        const {
          data,
          error,
        } = await supabase
          .from("item")
          .select(
            `
              id,
              tag_code,
              item_type,
              item_name,

              owner_first_name,
              owner_last_name,
              owner_phone,
              owner_email,

              photo,
              medical_info,
              behaviour_note,
              description,
              finder_message,

              show_owner_name,
              show_owner_phone,

              show_email,
              show_pet_photo,
              show_medical_info,
              show_behaviour_note,
              show_description,
              show_finder_message,

              phone_enabled,
              live_chat_enabled,

              active
            `
          )
          .ilike(
            "tag_code",
            tagCode
          )
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (!data) {
          setErrorMessage(
            "ამ QR კოდზე პროფილი ვერ მოიძებნა."
          );

          return;
        }

        if (
          data.active === false
        ) {
          setErrorMessage(
            "ეს QR პროფილი ამჟამად არააქტიურია."
          );

          return;
        }

        setProfile(
          data as PublicProfile
        );
      } catch (error) {
        console.error(
          "Public profile load error:",
          error
        );

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "პროფილის ჩატვირთვა ვერ მოხერხდა."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [tagCode]);

  if (loading) {
    return (
      <main className="statePage">
        <div className="loadingBox">
          <div className="loadingMark">
            QR
          </div>

          <strong>
            QR პროფილი იტვირთება...
          </strong>
        </div>

        <style jsx>{`
          .statePage {
            min-height: 100vh;

            display: grid;
            place-items: center;

            padding: 25px;

            background: #f7faff;
          }

          .loadingBox {
            text-align: center;

            color: #718095;

            font-size: 10px;
          }

          .loadingMark {
            width: 52px;
            height: 52px;

            margin:
              0 auto 14px;

            display: grid;
            place-items: center;

            border-radius: 14px;

            background: #1266e9;

            color: #ffffff;

            font-size: 10px;
            font-weight: 950;
          }
        `}</style>
      </main>
    );
  }

  if (
    !profile ||
    errorMessage
  ) {
    return (
      <main className="statePage">
        <div className="errorCard">
          <div className="errorIcon">
            QR
          </div>

          <h1>
            პროფილი ვერ მოიძებნა
          </h1>

          <p>
            {errorMessage ||
              "QR კოდი არასწორია."}
          </p>

          <a href="/">
            QR RETURN
          </a>
        </div>

        <style jsx>{`
          .statePage {
            min-height: 100vh;

            display: grid;
            place-items: center;

            padding: 25px;

            background: #f7faff;
          }

          .errorCard {
            width: 100%;
            max-width: 450px;

            padding: 35px;

            text-align: center;

            border:
              1px solid #dce6f1;

            border-radius: 18px;

            background: #ffffff;
          }

          .errorIcon {
            width: 58px;
            height: 58px;

            margin: auto;

            display: grid;
            place-items: center;

            border-radius: 15px;

            background: #edf4ff;

            color: #1266e9;

            font-size: 11px;
            font-weight: 950;
          }

          h1 {
            margin: 20px 0 0;

            color: #253e58;

            font-size: 22px;
          }

          p {
            margin: 9px 0 0;

            color: #7d8b9c;

            font-size: 10px;
            line-height: 1.55;
          }

          a {
            display: inline-flex;

            margin-top: 20px;

            padding: 11px 15px;

            border-radius: 9px;

            background: #1266e9;

            color: #ffffff;

            font-size: 9px;
            font-weight: 900;

            text-decoration: none;
          }
        `}</style>
      </main>
    );
  }

  const meta =
    CATEGORY_META[
      profile.item_type
    ] || {
      label:
        profile.item_type,
      emoji: "QR",
    };

  const ownerFullName =
    [
      profile.owner_first_name,
      profile.owner_last_name,
    ]
      .filter(Boolean)
      .join(" ");

  const phoneHref =
    profile.owner_phone
      ? `tel:${profile.owner_phone}`
      : "#";

  return (
    <>
      <main className="page">
        <div className="container">

          {/* HEADER */}

          <header className="header">
            <a
              href="/"
              className="brand"
            >
              <div className="brandMark">
                QR
              </div>

              <div>
                <strong>
                  QR RETURN
                </strong>

                <span>
                  SMART LOST &amp; FOUND
                </span>
              </div>
            </a>

            <div className="verified">
              ✓ VERIFIED QR
            </div>
          </header>

          {/* PROFILE HERO */}

          <section className="profileHero">
            <div className="categoryIcon">
              {meta.emoji}
            </div>

            <div className="profileIntro">
              <span>
                {meta.label}
              </span>

              <h1>
                {profile.item_name ||
                  meta.label}
              </h1>

              <p>
                თქვენ დაასკანერეთ QR RETURN
                პროფილი. ქვემოთ მოცემული
                ინფორმაცია დაგეხმარებათ
                მფლობელთან სწრაფად
                დაკავშირებაში.
              </p>
            </div>
          </section>

          {/* OWNER */}

          <section className="ownerCard">
            <div className="sectionTitle">
              <span>
                OWNER INFORMATION
              </span>

              <h2>
                მფლობელის ინფორმაცია
              </h2>
            </div>

            <div className="ownerIdentity">
              <div className="avatar">
                {profile.owner_first_name
                  ?.charAt(0)
                  .toUpperCase() ||
                  "O"}
              </div>

              <div>
                <span>
                  OWNER
                </span>

                <strong>
                  {ownerFullName ||
                    "QR RETURN Owner"}
                </strong>
              </div>
            </div>

            <div className="alwaysVisible">
              <div>
                <span>
                  სახელი
                </span>

                <strong>
                  {profile.owner_first_name ||
                    "—"}
                </strong>
              </div>

              <div>
                <span>
                  გვარი
                </span>

                <strong>
                  {profile.owner_last_name ||
                    "—"}
                </strong>
              </div>

              <div>
                <span>
                  ტელეფონი
                </span>

                <strong>
                  {profile.owner_phone ||
                    "—"}
                </strong>
              </div>
            </div>

            <div className="requiredInfo">
              ✓ სახელი, გვარი და ტელეფონის ნომერი ყოველთვის ხილულია.
            </div>
          </section>

          {/* PHOTO */}

          {profile.show_pet_photo &&
            profile.photo && (
              <section className="photoCard">
                <img
                  src={profile.photo}
                  alt={
                    profile.item_name ||
                    meta.label
                  }
                />
              </section>
            )}

          {/* OWNER MESSAGE */}

          {profile.show_finder_message &&
            profile.finder_message && (
              <section className="finderMessage">
                <span>
                  OWNER MESSAGE
                </span>

                <p>
                  {profile.finder_message}
                </p>
              </section>
            )}

          {/* CONTACT */}

          <section className="contactCard">
            <div className="sectionTitle">
              <span>
                CONTACT OWNER
              </span>

              <h2>
                დაუკავშირდით მფლობელს
              </h2>

              <p>
                გამოიყენეთ თქვენთვის
                მოსახერხებელი დაკავშირების
                გზა.
              </p>
            </div>

            <div className="contactActions">

              {profile.owner_phone && (
                <a
                  href={phoneHref}
                  className="primaryAction"
                >
                  <div>
                    <strong>
                      ☎ დარეკვა
                    </strong>

                    <span>
                      {profile.owner_phone}
                    </span>
                  </div>

                  <b>→</b>
                </a>
              )}

              {profile.live_chat_enabled && (
                <a
                  href={`/chat/finder/${profile.tag_code}`}
                  className="secondaryAction"
                >
                  <div>
                    <strong>
                      ◌ QR RETURN Live Chat
                    </strong>

                    <span>
                      მისწერეთ მფლობელს
                    </span>
                  </div>

                  <b>→</b>
                </a>
              )}

            </div>

            {profile.show_email &&
              profile.owner_email && (
                <div className="emailRow">
                  <div>
                    <span>
                      EMAIL
                    </span>

                    <strong>
                      სურვილისამებრ ხილული
                    </strong>
                  </div>

                  <a
                    href={`mailto:${profile.owner_email}`}
                  >
                    {profile.owner_email}
                  </a>
                </div>
              )}
          </section>

          {/* ADDITIONAL INFORMATION */}

          {(profile.show_medical_info &&
            profile.medical_info) ||
          (profile.show_behaviour_note &&
            profile.behaviour_note) ||
          (profile.show_description &&
            profile.description) ? (
            <section className="detailsCard">
              <div className="sectionTitle">
                <span>
                  IMPORTANT INFORMATION
                </span>

                <h2>
                  დამატებითი ინფორმაცია
                </h2>
              </div>

              <div className="detailsList">

                {profile.show_medical_info &&
                  profile.medical_info && (
                    <InfoRow
                      title="სამედიცინო ინფორმაცია"
                      text={
                        profile.medical_info
                      }
                    />
                  )}

                {profile.show_behaviour_note &&
                  profile.behaviour_note && (
                    <InfoRow
                      title="ქცევის შესახებ ინფორმაცია"
                      text={
                        profile.behaviour_note
                      }
                    />
                  )}

                {profile.show_description &&
                  profile.description && (
                    <InfoRow
                      title="აღწერა"
                      text={
                        profile.description
                      }
                    />
                  )}

              </div>
            </section>
          ) : null}

          {/* QR INFO */}

          <section className="qrInfo">
            <div className="qrSmall">
              QR
            </div>

            <div>
              <span>
                QR CODE
              </span>

              <strong>
                {profile.tag_code}
              </strong>

              <p>
                QR RETURN · Smart Lost &amp; Found
              </p>
            </div>
          </section>

        </div>
      </main>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;

          padding-bottom: 60px;

          background:
            radial-gradient(
              circle at 100% 0%,
              rgba(18,102,233,.08),
              transparent 28%
            ),
            linear-gradient(
              180deg,
              #ffffff 0%,
              #f5f9ff 100%
            );
        }

        .container {
          width:
            calc(100% - 32px);

          max-width: 660px;

          margin: auto;
        }

        .header {
          min-height: 76px;

          display: flex;
          align-items: center;
          justify-content:
            space-between;

          gap: 15px;

          border-bottom:
            1px solid #e3eaf2;
        }

        .brand {
          display: flex;
          align-items: center;

          gap: 9px;

          text-decoration: none;
        }

        .brandMark {
          width: 40px;
          height: 40px;

          display: grid;
          place-items: center;

          border-radius: 10px;

          background: #1266e9;
          color: #ffffff;

          font-size: 9px;
          font-weight: 950;
        }

        .brand strong,
        .brand span {
          display: block;
        }

        .brand strong {
          color: #213a54;

          font-size: 13px;
          font-weight: 950;
        }

        .brand span {
          margin-top: 2px;

          color: #8c98a7;

          font-size: 6px;
          font-weight: 850;

          letter-spacing: 1px;
        }

        .verified {
          padding: 6px 9px;

          border-radius: 999px;

          background: #eaf2ff;

          color: #1266e9;

          font-size: 6px;
          font-weight: 900;

          letter-spacing: .5px;
        }

        .profileHero {
          padding: 45px 0 28px;

          display: flex;
          align-items: center;

          gap: 17px;
        }

        .categoryIcon {
          width: 72px;
          height: 72px;

          flex: 0 0 72px;

          display: grid;
          place-items: center;

          border-radius: 18px;

          border:
            1px solid #d8e4f2;

          background: #ffffff;

          font-size: 35px;

          box-shadow:
            0 10px 25px
            rgba(
              30,
              70,
              120,
              .05
            );
        }

        .profileIntro > span {
          color: #1266e9;

          font-size: 8px;
          font-weight: 900;

          letter-spacing: 1.2px;
        }

        .profileIntro h1 {
          margin: 6px 0 0;

          color: #1f3852;

          font-size: 31px;
          line-height: 1.08;
        }

        .profileIntro p {
          max-width: 480px;

          margin: 8px 0 0;

          color: #7b8b9d;

          font-size: 9px;
          line-height: 1.6;
        }

        .ownerCard,
        .contactCard,
        .detailsCard {
          margin-top: 14px;

          padding: 22px;

          border:
            1px solid #dce6f1;

          border-radius: 16px;

          background: #ffffff;

          box-shadow:
            0 12px 28px
            rgba(
              30,
              70,
              120,
              .045
            );
        }

        .sectionTitle > span {
          color: #1266e9;

          font-size: 7px;
          font-weight: 900;

          letter-spacing: 1.1px;
        }

        .sectionTitle h2 {
          margin: 6px 0 0;

          color: #29415b;

          font-size: 17px;
        }

        .sectionTitle p {
          margin: 5px 0 0;

          color: #8492a1;

          font-size: 8px;
        }

        .ownerIdentity {
          margin-top: 18px;

          display: flex;
          align-items: center;

          gap: 11px;
        }

        .avatar {
          width: 46px;
          height: 46px;

          flex: 0 0 46px;

          display: grid;
          place-items: center;

          border-radius: 13px;

          background: #1266e9;

          color: #ffffff;

          font-size: 16px;
          font-weight: 950;
        }

        .ownerIdentity span,
        .ownerIdentity strong {
          display: block;
        }

        .ownerIdentity span {
          color: #9aa5b2;

          font-size: 7px;
          font-weight: 900;

          letter-spacing: 1px;
        }

        .ownerIdentity strong {
          margin-top: 4px;

          color: #2d455f;

          font-size: 14px;
        }

        .alwaysVisible {
          margin-top: 18px;

          display: grid;

          grid-template-columns:
            repeat(
              3,
              minmax(0, 1fr)
            );

          gap: 8px;
        }

        .alwaysVisible > div {
          min-height: 70px;

          padding: 12px;

          border:
            1px solid #dae5f1;

          border-radius: 10px;

          background: #fafcff;
        }

        .alwaysVisible span,
        .alwaysVisible strong {
          display: block;
        }

        .alwaysVisible span {
          color: #95a1af;

          font-size: 7px;
          font-weight: 850;
        }

        .alwaysVisible strong {
          margin-top: 7px;

          color: #344c66;

          font-size: 9px;

          word-break:
            break-word;
        }

        .requiredInfo {
          margin-top: 11px;

          padding: 10px 11px;

          border-radius: 9px;

          background: #edf4ff;

          color: #1266e9;

          font-size: 7px;
          font-weight: 800;
        }

        .photoCard {
          margin-top: 14px;

          overflow: hidden;

          border:
            1px solid #dbe5f0;

          border-radius: 16px;

          background: #ffffff;
        }

        .photoCard img {
          width: 100%;
          max-height: 420px;

          display: block;

          object-fit: cover;
        }

        .finderMessage {
          margin-top: 14px;

          padding: 20px;

          border:
            1px solid #cddff5;

          border-radius: 15px;

          background:
            linear-gradient(
              135deg,
              #f8fbff,
              #eef5ff
            );
        }

        .finderMessage span {
          color: #1266e9;

          font-size: 7px;
          font-weight: 900;

          letter-spacing: 1.1px;
        }

        .finderMessage p {
          margin: 8px 0 0;

          color: #405972;

          font-size: 11px;
          line-height: 1.65;
        }

        .contactActions {
          margin-top: 17px;

          display: grid;

          gap: 9px;
        }

        .contactActions a {
          min-height: 65px;

          padding: 13px 15px;

          display: flex;
          align-items: center;
          justify-content:
            space-between;

          gap: 15px;

          border-radius: 12px;

          text-decoration: none;
        }

        .contactActions strong,
        .contactActions span {
          display: block;
        }

        .contactActions strong {
          font-size: 10px;
          font-weight: 900;
        }

        .contactActions span {
          margin-top: 4px;

          font-size: 8px;
        }

        .contactActions b {
          font-size: 16px;
        }

        .primaryAction {
          background: #1266e9;

          color: #ffffff;
        }

        .primaryAction span {
          color:
            rgba(
              255,
              255,
              255,
              .75
            );
        }

        .secondaryAction {
          border:
            1px solid #d2e0f1;

          background: #f7faff;

          color: #35506c;
        }

        .secondaryAction span {
          color: #8392a2;
        }

        .emailRow {
          margin-top: 13px;

          padding: 12px;

          display: flex;
          align-items: center;
          justify-content:
            space-between;

          gap: 12px;

          border:
            1px solid #e1e8f0;

          border-radius: 10px;

          background: #fbfcfe;
        }

        .emailRow span,
        .emailRow strong {
          display: block;
        }

        .emailRow span {
          color: #99a4b1;

          font-size: 7px;
          font-weight: 900;
        }

        .emailRow strong {
          margin-top: 3px;

          color: #6f8195;

          font-size: 7px;
        }

        .emailRow a {
          color: #1266e9;

          font-size: 9px;
          font-weight: 850;

          text-decoration: none;

          word-break:
            break-all;
        }

        .detailsList {
          margin-top: 15px;

          border-top:
            1px solid #e4eaf1;
        }

        .qrInfo {
          margin-top: 14px;

          padding: 17px;

          display: flex;
          align-items: center;

          gap: 12px;

          border:
            1px solid #dce6f1;

          border-radius: 14px;

          background: #ffffff;
        }

        .qrSmall {
          width: 42px;
          height: 42px;

          flex: 0 0 42px;

          display: grid;
          place-items: center;

          border-radius: 10px;

          background: #1266e9;

          color: #ffffff;

          font-size: 8px;
          font-weight: 950;
        }

        .qrInfo span,
        .qrInfo strong,
        .qrInfo p {
          display: block;
        }

        .qrInfo span {
          color: #9aa5b2;

          font-size: 7px;
          font-weight: 900;

          letter-spacing: 1px;
        }

        .qrInfo strong {
          margin-top: 4px;

          color: #324c68;

          font-size: 10px;

          word-break:
            break-all;
        }

        .qrInfo p {
          margin: 4px 0 0;

          color: #9aa5b2;

          font-size: 7px;
        }

        @media (
          max-width: 550px
        ) {
          .profileHero {
            align-items:
              flex-start;
          }

          .categoryIcon {
            width: 62px;
            height: 62px;

            flex-basis: 62px;

            font-size: 29px;
          }

          .profileIntro h1 {
            font-size: 26px;
          }

          .alwaysVisible {
            grid-template-columns:
              1fr;
          }

          .emailRow {
            align-items:
              flex-start;

            flex-direction:
              column;
          }
        }
      `}</style>
    </>
  );
}

function InfoRow({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div
      style={{
        padding: "14px 2px",

        borderBottom:
          "1px solid #e4eaf1",
      }}
    >
      <strong
        style={{
          display: "block",

          color: "#39516a",

          fontSize: "9px",
        }}
      >
        {title}
      </strong>

      <p
        style={{
          margin:
            "6px 0 0",

          color: "#7f8e9f",

          fontSize: "9px",

          lineHeight: 1.6,
        }}
      >
        {text}
      </p>
    </div>
  );
}
