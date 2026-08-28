"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createClient,
  type User,
} from "@supabase/supabase-js";

type ItemProfile = {
  id: string;
  tag_code: string | null;
  item_type: string | null;
  item_name: string | null;
  photo: string | null;
  active: boolean | null;
  scan_count: number | null;
  created_at?: string | null;
};

type OwnerData = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
};

type EmergencyProfileSummary = {
  id: string;
  tag_code: string;
  first_name: string;
  last_name: string;
  active: boolean;
  photo_url: string | null;
};

function createSupabase() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase კავშირი ვერ მოიძებნა."
    );
  }

  return createClient(url, key);
}

const productMeta: Record<
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

  bag: {
    label: "ჩანთა",
    emoji: "👜",
  },

  suitcase: {
    label: "ჩემოდანი",
    emoji: "🧳",
  },
};

export default function AccountPage() {
  const [user, setUser] =
    useState<User | null>(null);

  const [owner, setOwner] =
    useState<OwnerData | null>(null);

  const [profiles, setProfiles] =
    useState<ItemProfile[]>([]);

  const [emergencyProfiles, setEmergencyProfiles] =
    useState<EmergencyProfileSummary[]>([]);

  const [isSystemAdmin, setIsSystemAdmin] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const displayName = useMemo(() => {
    if (owner) {
      return `${owner.first_name} ${owner.last_name}`.trim();
    }

    const firstName =
      user?.user_metadata
        ?.first_name || "";

    const lastName =
      user?.user_metadata
        ?.last_name || "";

    const full =
      `${firstName} ${lastName}`.trim();

    return full || "მფლობელი";
  }, [owner, user]);

  useEffect(() => {
    let mounted = true;

    async function loadAccount() {
      try {
        const supabase =
          createSupabase();

        const {
          data: {
            session,
          },
          error:
            sessionError,
        } =
          await supabase.auth
            .getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (!session?.user) {
          window.location.replace(
            "/login"
          );

          return;
        }

        if (!mounted) {
          return;
        }

        setUser(
          session.user
        );

        const currentUser =
          session.user;

        const {
          data: adminRecord,
          error: adminError,
        } = await supabase
          .from("admin_users")
          .select("user_id")
          .eq("user_id", currentUser.id)
          .maybeSingle();

        if (adminError) {
          console.error(
            "Admin check:",
            adminError
          );
        }

        if (mounted) {
          setIsSystemAdmin(
            Boolean(adminRecord)
          );
        }

        /*
         * OWNER DATA
         */

        try {
          const {
            data:
              ownerData,
            error:
              ownerError,
          } =
            await supabase
              .from(
                "owner_accounts"
              )
              .select(
                "first_name,last_name,email,phone"
              )
              .eq(
                "user_id",
                currentUser.id
              )
              .maybeSingle();

          if (
            ownerError
          ) {
            console.error(
              "Owner load:",
              ownerError
            );
          }

          if (
            mounted &&
            ownerData
          ) {
            setOwner({
              first_name:
                ownerData.first_name ||
                "",

              last_name:
                ownerData.last_name ||
                "",

              email:
                ownerData.email ||
                currentUser.email ||
                "",

              phone:
                ownerData.phone ||
                "",
            });
          } else if (
            mounted
          ) {
            setOwner({
              first_name:
                currentUser
                  .user_metadata
                  ?.first_name ||
                "",

              last_name:
                currentUser
                  .user_metadata
                  ?.last_name ||
                "",

              email:
                currentUser.email ||
                "",

              phone:
                currentUser
                  .user_metadata
                  ?.phone ||
                "",
            });
          }
        } catch (
          ownerLoadError
        ) {
          console.error(
            "Owner load:",
            ownerLoadError
          );
        }

        /*
         * USER QR PROFILES
         *
         * First try owner_id because
         * this is the intended relation.
         */

        const {
          data:
            profileData,
          error:
            profileError,
        } =
          await supabase
            .from("item")
            .select(
              "id,tag_code,item_type,item_name,photo,active,scan_count,created_at"
            )
            .eq(
              "owner_id",
              currentUser.id
            )
            .order(
              "created_at",
              {
                ascending:
                  false,
              }
            );

        if (
          profileError
        ) {
          console.error(
            "Profile load:",
            profileError
          );

          /*
           * Dashboard itself still
           * loads even if profile query
           * needs schema adjustment.
           */

          if (mounted) {
            setProfiles(
              []
            );
          }
        } else if (
          mounted
        ) {
          setProfiles(
            (profileData ||
              []) as ItemProfile[]
          );
        }

        const {
          data: emergencyData,
          error: emergencyError,
        } = await supabase
          .from("emergency_profiles")
          .select("id,tag_code,first_name,last_name,active,photo_url")
          .eq("owner_id", currentUser.id)
          .order("created_at", { ascending: false });

        if (emergencyError) {
          console.error("Emergency profiles load:", emergencyError);
          if (mounted) setEmergencyProfiles([]);
        } else if (mounted) {
          setEmergencyProfiles(
            (emergencyData || []) as EmergencyProfileSummary[]
          );
        }
      } catch (error) {
        console.error(
          "Account load:",
          error
        );

        if (mounted) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "ანგარიშის ჩატვირთვა ვერ მოხერხდა."
          );
        }
      } finally {
        if (mounted) {
          setLoading(
            false
          );
        }
      }
    }

    void loadAccount();

    return () => {
      mounted =
        false;
    };
  }, []);

  async function signOut() {
    try {
      const supabase =
        createSupabase();

      await supabase.auth
        .signOut();
    } finally {
      window.location.replace(
        "/login"
      );
    }
  }

  if (loading) {
    return (
      <>
        <main className="loadingPage">
          <div className="loadingBox">
            <div className="loader" />

            <strong>
              ანგარიში იტვირთება...
            </strong>
          </div>
        </main>

        <style jsx>{`
          .loadingPage {
            min-height: 100vh;

            display: grid;

            place-items: center;

            background:
              #0647c8;

            font-family:
              Arial,
              Helvetica,
              sans-serif;
          }

          .loadingBox {
            display: grid;

            justify-items:
              center;

            gap: 13px;

            color: white;

            font-size: 14px;
          }

          .loader {
            width: 32px;
            height: 32px;

            border:
              3px solid
              rgba(
                255,
                255,
                255,
                0.25
              );

            border-top-color:
              white;

            border-radius:
              50%;

            animation:
              spin
              0.8s
              linear
              infinite;
          }

          @keyframes spin {
            to {
              transform:
                rotate(
                  360deg
                );
            }
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <main className="page">
        <div
          className="backgroundQr qr1"
          aria-hidden="true"
        >
          QR
        </div>

        <div
          className="backgroundQr qr2"
          aria-hidden="true"
        >
          QR
        </div>

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

              <small>
                MY ACCOUNT
              </small>
            </div>
          </a>

          <div className="headerActions">
            {isSystemAdmin && (
              <a
                href="/admin"
                className="adminButton"
              >
                Admin
              </a>
            )}

            <a
              href="/"
              className="homeButton"
            >
              მთავარი
            </a>

            <button
              type="button"
              className="logoutButton"
              onClick={
                signOut
              }
            >
              გასვლა
            </button>
          </div>
        </header>

        <section className="shell">
          {/* WELCOME */}

          <section className="welcome">
            <div>
              <span className="eyebrow">
                MY QR RETURN
              </span>

              <h1>
                გამარჯობა,{" "}
                {displayName}
              </h1>

              <p>
                აქ შეგიძლიათ
                მართოთ თქვენი
                ყველა QR პროფილი.
              </p>
            </div>

            <a
              href="/register"
              className="addButton"
            >
              <span className="plus">
                +
              </span>

              ახალი QR პროფილი
            </a>
          </section>

          {errorMessage && (
            <div className="error">
              {errorMessage}
            </div>
          )}

          {/* OWNER INFO */}

          <section className="ownerCard">
            <div className="ownerAvatar">
              {displayName
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="ownerMain">
              <span>
                მფლობელი
              </span>

              <strong>
                {displayName}
              </strong>
            </div>

            <div className="ownerDetails">
              <div>
                <span>
                  ელფოსტა
                </span>

                <strong>
                  {owner?.email ||
                    user?.email ||
                    "—"}
                </strong>
              </div>

              <div>
                <span>
                  ტელეფონი
                </span>

                <strong>
                  {owner?.phone ||
                    "—"}
                </strong>
              </div>
            </div>

            <a
              href="/account/profile"
              className="editOwner"
            >
              რედაქტირება
            </a>
          </section>

          {/* PROFILES */}

          <section className="profilesSection">
            <div className="sectionHeader">
              <div>
                <span className="sectionEyebrow">
                  QR PROFILES
                </span>

                <h2>
                  ჩემი პროფილები
                </h2>
              </div>

              <span className="count">
                {profiles.length + emergencyProfiles.length} პროფილი
              </span>
            </div>

            {profiles.length === 0 && emergencyProfiles.length === 0 ? (
              <section className="emptyState">
                <div className="emptyIcon">
                  QR
                </div>

                <h3>
                  ჯერ QR პროფილი
                  არ გაქვთ
                </h3>

                <p>
                  აირჩიეთ პროდუქტი და
                  შექმენით თქვენი პირველი
                  QR RETURN პროფილი.
                </p>

                <a
                  href="/register"
                  className="emptyButton"
                >
                  <span>
                    +
                  </span>

                  პროფილის დამატება
                </a>

                <div className="products">
                  <span>
                    🐶
                  </span>

                  <span>
                    🐱
                  </span>

                  <span>
                    🔑
                  </span>

                  <span>
                    👛
                  </span>

                  <span>
                    👜
                  </span>

                  <span>
                    🧳
                  </span>
                </div>
              </section>
            ) : (
              <div className="profileGrid">
                {profiles.map(
                  (
                    profile
                  ) => {
                    const type =
                      profile.item_type ||
                      "";

                    const meta =
                      productMeta[
                        type
                      ] || {
                        label:
                          type ||
                          "QR პროფილი",

                        emoji:
                          "QR",
                      };

                    return (
                      <article
                        className="profileCard"
                        key={
                          profile.id
                        }
                      >
                        <div className="photoArea">
                          {profile.photo ? (
                            <img
                              src={
                                profile.photo
                              }
                              alt={
                                profile.item_name ||
                                meta.label
                              }
                            />
                          ) : (
                            <div className="placeholder">
                              {
                                meta.emoji
                              }
                            </div>
                          )}

                          <span
                            className={
                              profile.active
                                ? "status active"
                                : "status"
                            }
                          >
                            <i />

                            {profile.active
                              ? "აქტიური"
                              : "შენახული"}
                          </span>
                        </div>

                        <div className="profileContent">
                          <span className="type">
                            {
                              meta.emoji
                            }{" "}
                            {
                              meta.label
                            }
                          </span>

                          <h3>
                            {profile.item_name ||
                              meta.label}
                          </h3>

                          <div className="tag">
                            <span>
                              QR CODE
                            </span>

                            <strong>
                              {profile.tag_code ||
                                "—"}
                            </strong>
                          </div>

                          <div className="stats">
                            <div>
                              <span>
                                სკანირება
                              </span>

                              <strong>
                                {profile.scan_count ||
                                  0}
                              </strong>
                            </div>
                          </div>

                          <div className="profileActions">
                            {profile.tag_code && (
                              <a
                                href={`/profile/${encodeURIComponent(
                                  profile.tag_code
                                )}`}
                                className="viewButton"
                              >
                                პროფილის ნახვა
                              </a>
                            )}

                            <a
                              href={`/edit-profile/${profile.id}`}
                              className="editButton"
                            >
                              რედაქტირება
                            </a>
                          </div>
                        </div>
                      </article>
                    );
                  }
                )}

                {emergencyProfiles.map((profile) => {
                  const fullName =
                    `${profile.first_name || ""} ${profile.last_name || ""}`.trim() ||
                    "Emergency ID";

                  return (
                    <article className="profileCard" key={`emergency-${profile.id}`}>
                      <div className="photoArea">
                        {profile.photo_url ? (
                          <img src={profile.photo_url} alt={fullName} />
                        ) : (
                          <div className="placeholder">✚</div>
                        )}

                        <span className={profile.active ? "status active" : "status"}>
                          <i />
                          {profile.active ? "აქტიური" : "შენახული"}
                        </span>
                      </div>

                      <div className="profileContent">
                        <span className="type">✚ Emergency ID</span>
                        <h3>{fullName}</h3>

                        <div className="tag">
                          <span>QR CODE</span>
                          <strong>{profile.tag_code || "—"}</strong>
                        </div>

                        <div className="profileActions">
                          <a
                            href={`/emergency/${encodeURIComponent(profile.tag_code)}`}
                            className="viewButton"
                          >
                            პროფილის ნახვა
                          </a>

                          <a
                            href={`/emergency/edit/${profile.id}`}
                            className="editButton"
                          >
                            რედაქტირება
                          </a>
                        </div>
                      </div>
                    </article>
                  );
                })}

                <a
                  href="/register"
                  className="addProfileCard"
                >
                  <div>
                    +
                  </div>

                  <strong>
                    ახალი პროფილი
                  </strong>

                  <span>
                    დაამატეთ კიდევ
                    ერთი QR პროფილი
                  </span>
                </a>
              </div>
            )}
          </section>
        </section>
      </main>

      <style jsx>{`
        * {
          box-sizing:
            border-box;
        }

        .page {
          position:
            relative;

          min-height:
            100vh;

          overflow:
            hidden;

          padding-bottom:
            55px;

          background:
            #f4f7fb;

          font-family:
            Arial,
            Helvetica,
            sans-serif;
        }

        .backgroundQr {
          position:
            fixed;

          z-index: 0;

          color:
            rgba(
              6,
              71,
              200,
              0.025
            );

          font-size:
            220px;

          font-weight:
            950;

          pointer-events:
            none;

          user-select:
            none;
        }

        .qr1 {
          left: -20px;
          bottom: 5%;
        }

        .qr2 {
          right: -30px;
          top: 18%;
        }

        /* HEADER */

        .header {
          position:
            relative;

          z-index: 5;

          width: 100%;

          min-height:
            72px;

          padding:
            0 34px;

          display: flex;

          align-items:
            center;

          justify-content:
            space-between;

          background:
            #0647c8;

          box-shadow:
            0 6px 22px
            rgba(
              15,
              56,
              110,
              0.13
            );
        }

        .brand {
          display: flex;

          align-items:
            center;

          gap: 10px;

          text-decoration:
            none;
        }

        .brandMark {
          width: 42px;
          height: 42px;

          display: grid;

          place-items:
            center;

          border-radius:
            11px;

          background:
            #ffffff;

          color:
            #0647c8;

          font-size:
            12px;

          font-weight:
            950;
        }

        .brand strong,
        .brand small {
          display:
            block;
        }

        .brand strong {
          color:
            #ffffff;

          font-size:
            17px;
        }

        .brand small {
          margin-top:
            2px;

          color:
            rgba(
              255,
              255,
              255,
              0.66
            );

          font-size:
            9px;

          font-weight:
            800;

          letter-spacing:
            0.8px;
        }

        .headerActions {
          display: flex;

          align-items:
            center;

          gap: 9px;
        }

        .adminButton,
        .homeButton,
        .logoutButton {
          min-height:
            39px;

          padding:
            0 14px;

          display:
            inline-flex;

          align-items:
            center;

          justify-content:
            center;

          border-radius:
            9px;

          font-family:
            inherit;

          font-size:
            12px;

          font-weight:
            800;

          cursor:
            pointer;

          text-decoration:
            none;
        }

        .adminButton {
          border:
            1px solid
            #ffffff;

          color:
            #0647c8;

          background:
            #ffffff;
        }

        .homeButton {
          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.24
            );

          color:
            #ffffff;

          background:
            rgba(
              255,
              255,
              255,
              0.07
            );
        }

        .logoutButton {
          border: 0;

          background:
            #ffffff;

          color:
            #0647c8;
        }

        /* SHELL */

        .shell {
          position:
            relative;

          z-index: 2;

          width: 100%;

          max-width:
            1180px;

          margin:
            0 auto;

          padding:
            42px
            24px 0;
        }

        /* WELCOME */

        .welcome {
          display: flex;

          align-items:
            flex-end;

          justify-content:
            space-between;

          gap: 30px;
        }

        .eyebrow,
        .sectionEyebrow {
          color:
            #0647c8;

          font-size:
            10px;

          font-weight:
            900;

          letter-spacing:
            1.1px;
        }

        .welcome h1 {
          margin:
            7px 0 0;

          color:
            #203a55;

          font-size:
            31px;

          line-height:
            1.2;

          letter-spacing:
            -0.5px;
        }

        .welcome p {
          margin:
            7px 0 0;

          color:
            #718397;

          font-size:
            14px;

          line-height:
            1.5;
        }

        .addButton {
          min-height:
            49px;

          padding:
            0 18px;

          display: flex;

          align-items:
            center;

          gap: 9px;

          border-radius:
            11px;

          background:
            #0647c8;

          color:
            #ffffff;

          font-size:
            13px;

          font-weight:
            900;

          text-decoration:
            none;

          box-shadow:
            0 9px 20px
            rgba(
              6,
              71,
              200,
              0.18
            );
        }

        .plus {
          width: 25px;
          height: 25px;

          display: grid;

          place-items:
            center;

          border-radius:
            7px;

          background:
            rgba(
              255,
              255,
              255,
              0.15
            );

          font-size:
            18px;
        }

        /* ERROR */

        .error {
          margin-top:
            20px;

          padding:
            12px 14px;

          border:
            1px solid
            #f0ced2;

          border-radius:
            10px;

          background:
            #fff3f4;

          color:
            #a3424a;

          font-size:
            12px;
        }

        /* OWNER CARD */

        .ownerCard {
          margin-top:
            28px;

          padding:
            19px 21px;

          display: grid;

          grid-template-columns:
            auto
            minmax(
              150px,
              1fr
            )
            minmax(
              280px,
              1.4fr
            )
            auto;

          align-items:
            center;

          gap: 17px;

          border:
            1px solid
            #e0e8f0;

          border-radius:
            15px;

          background:
            #ffffff;

          box-shadow:
            0 9px 26px
            rgba(
              30,
              60,
              100,
              0.05
            );
        }

        .ownerAvatar {
          width: 48px;
          height: 48px;

          display: grid;

          place-items:
            center;

          border-radius:
            13px;

          background:
            #eaf2ff;

          color:
            #0647c8;

          font-size:
            19px;

          font-weight:
            950;
        }

        .ownerMain span,
        .ownerDetails span {
          display:
            block;

          color:
            #8a98a7;

          font-size:
            10px;

          font-weight:
            800;

          text-transform:
            uppercase;

          letter-spacing:
            0.5px;
        }

        .ownerMain strong {
          display:
            block;

          margin-top:
            5px;

          color:
            #2c465f;

          font-size:
            15px;
        }

        .ownerDetails {
          display: grid;

          grid-template-columns:
            repeat(
              2,
              minmax(
                0,
                1fr
              )
            );

          gap: 20px;
        }

        .ownerDetails strong {
          display:
            block;

          margin-top:
            5px;

          overflow:
            hidden;

          color:
            #425a71;

          font-size:
            12px;

          font-weight:
            750;

          text-overflow:
            ellipsis;

          white-space:
            nowrap;
        }

        .editOwner {
          min-height:
            38px;

          padding:
            0 13px;

          display:
            inline-flex;

          align-items:
            center;

          border:
            1px solid
            #dce5ee;

          border-radius:
            9px;

          color:
            #526a81;

          font-size:
            11px;

          font-weight:
            850;

          text-decoration:
            none;
        }

        /* PROFILES */

        .profilesSection {
          margin-top:
            40px;
        }

        .sectionHeader {
          display: flex;

          align-items:
            flex-end;

          justify-content:
            space-between;

          gap: 20px;

          margin-bottom:
            17px;
        }

        .sectionHeader h2 {
          margin:
            5px 0 0;

          color:
            #243f59;

          font-size:
            23px;
        }

        .count {
          color:
            #78899a;

          font-size:
            12px;

          font-weight:
            750;
        }

        /* EMPTY */

        .emptyState {
          min-height:
            315px;

          padding:
            38px 25px;

          display: flex;

          flex-direction:
            column;

          align-items:
            center;

          justify-content:
            center;

          border:
            1px solid
            #dde6ef;

          border-radius:
            17px;

          background:
            #ffffff;

          box-shadow:
            0 10px 30px
            rgba(
              30,
              60,
              100,
              0.05
            );

          text-align:
            center;
        }

        .emptyIcon {
          width: 55px;
          height: 55px;

          display: grid;

          place-items:
            center;

          border-radius:
            15px;

          background:
            #eaf2ff;

          color:
            #0647c8;

          font-size:
            13px;

          font-weight:
            950;
        }

        .emptyState h3 {
          margin:
            16px 0 0;

          color:
            #29445e;

          font-size:
            19px;
        }

        .emptyState p {
          max-width:
            400px;

          margin:
            8px 0 0;

          color:
            #78899a;

          font-size:
            13px;

          line-height:
            1.55;
        }

        .emptyButton {
          min-height:
            46px;

          margin-top:
            19px;

          padding:
            0 17px;

          display: flex;

          align-items:
            center;

          gap: 8px;

          border-radius:
            10px;

          background:
            #0647c8;

          color:
            #ffffff;

          font-size:
            12px;

          font-weight:
            900;

          text-decoration:
            none;
        }

        .emptyButton span {
          font-size:
            18px;
        }

        .products {
          margin-top:
            19px;

          display: flex;

          gap: 8px;
        }

        .products span {
          width: 33px;
          height: 33px;

          display: grid;

          place-items:
            center;

          border:
            1px solid
            #e1e8ef;

          border-radius:
            9px;

          background:
            #f7f9fc;

          font-size:
            17px;
        }

        /* PROFILE GRID */

        .profileGrid {
          display: grid;

          grid-template-columns:
            repeat(
              3,
              minmax(
                0,
                1fr
              )
            );

          gap: 17px;
        }

        .profileCard {
          overflow:
            hidden;

          border:
            1px solid
            #dfe7ef;

          border-radius:
            16px;

          background:
            #ffffff;

          box-shadow:
            0 9px 25px
            rgba(
              30,
              60,
              100,
              0.055
            );
        }

        .photoArea {
          position:
            relative;

          height:
            150px;

          overflow:
            hidden;

          background:
            #edf3fb;
        }

        .photoArea img {
          width:
            100%;

          height:
            100%;

          object-fit:
            cover;
        }

        .placeholder {
          width:
            100%;

          height:
            100%;

          display:
            grid;

          place-items:
            center;

          font-size:
            46px;
        }

        .status {
          position:
            absolute;

          top: 11px;
          right: 11px;

          padding:
            6px 8px;

          display: flex;

          align-items:
            center;

          gap: 5px;

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.6
            );

          border-radius:
            999px;

          background:
            rgba(
              255,
              255,
              255,
              0.9
            );

          color:
            #6e7f8f;

          font-size:
            9px;

          font-weight:
            850;
        }

        .status i {
          width: 6px;
          height: 6px;

          border-radius:
            50%;

          background:
            #a3afba;
        }

        .status.active {
          color:
            #177445;
        }

        .status.active i {
          background:
            #25a864;
        }

        .profileContent {
          padding:
            17px;
        }

        .type {
          color:
            #0647c8;

          font-size:
            10px;

          font-weight:
            900;
        }

        .profileContent h3 {
          margin:
            6px 0 0;

          overflow:
            hidden;

          color:
            #29445e;

          font-size:
            18px;

          text-overflow:
            ellipsis;

          white-space:
            nowrap;
        }

        .tag {
          margin-top:
            15px;

          padding:
            10px 11px;

          border-radius:
            9px;

          background:
            #f4f7fb;
        }

        .tag span {
          display:
            block;

          color:
            #98a5b2;

          font-size:
            8px;

          font-weight:
            900;

          letter-spacing:
            0.7px;
        }

        .tag strong {
          display:
            block;

          margin-top:
            4px;

          color:
            #405970;

          font-size:
            12px;
        }

        .stats {
          margin-top:
            13px;

          padding-top:
            12px;

          border-top:
            1px solid
            #edf1f5;
        }

        .stats span {
          color:
            #8b99a7;

          font-size:
            9px;
        }

        .stats strong {
          margin-left:
            5px;

          color:
            #42596f;

          font-size:
            12px;
        }

        .profileActions {
          margin-top:
            15px;

          display: grid;

          grid-template-columns:
            repeat(
              2,
              minmax(
                0,
                1fr
              )
            );

          gap: 8px;
        }

        .viewButton,
        .editButton {
          min-height:
            38px;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          border-radius:
            9px;

          font-size:
            10px;

          font-weight:
            850;

          text-decoration:
            none;
        }

        .viewButton {
          background:
            #0647c8;

          color:
            #ffffff;
        }

        .editButton {
          border:
            1px solid
            #dce5ee;

          color:
            #52697f;
        }

        /* ADD PROFILE CARD */

        .addProfileCard {
          min-height:
            360px;

          display: flex;

          flex-direction:
            column;

          align-items:
            center;

          justify-content:
            center;

          border:
            1.5px dashed
            #cbd8e6;

          border-radius:
            16px;

          background:
            rgba(
              255,
              255,
              255,
              0.58
            );

          color:
            #5e7489;

          text-align:
            center;

          text-decoration:
            none;
        }

        .addProfileCard > div {
          width: 45px;
          height: 45px;

          display: grid;

          place-items:
            center;

          border-radius:
            12px;

          background:
            #eaf2ff;

          color:
            #0647c8;

          font-size:
            25px;
        }

        .addProfileCard strong {
          margin-top:
            12px;

          color:
            #345069;

          font-size:
            14px;
        }

        .addProfileCard span {
          margin-top:
            5px;

          color:
            #8997a5;

          font-size:
            11px;
        }

        /* RESPONSIVE */

        @media (
          max-width:
            900px
        ) {
          .profileGrid {
            grid-template-columns:
              repeat(
                2,
                minmax(
                  0,
                  1fr
                )
              );
          }

          .ownerCard {
            grid-template-columns:
              auto
              1fr
              auto;
          }

          .ownerDetails {
            grid-column:
              1 / -1;

            padding-top:
              12px;

            border-top:
              1px solid
              #edf1f5;
          }
        }

        @media (
          max-width:
            620px
        ) {
          .header {
            padding:
              0 14px;
          }

          .brand small {
            display:
              none;
          }

          .headerActions {
            gap: 5px;
          }

          .adminButton,
          .homeButton,
          .logoutButton {
            min-height:
              35px;

            padding:
              0 8px;

            font-size:
              10px;
          }

          .shell {
            padding:
              28px
              14px 0;
          }

          .welcome {
            align-items:
              stretch;

            flex-direction:
              column;
          }

          .welcome h1 {
            font-size:
              26px;
          }

          .addButton {
            width:
              100%;

            justify-content:
              center;
          }

          .ownerCard {
            grid-template-columns:
              auto
              1fr;

            padding:
              16px;
          }

          .ownerDetails {
            grid-template-columns:
              1fr;
          }

          .editOwner {
            grid-column:
              1 / -1;

            justify-content:
              center;
          }

          .sectionHeader {
            align-items:
              flex-start;

            flex-direction:
              column;
          }

          .profileGrid {
            grid-template-columns:
              1fr;
          }

          .addProfileCard {
            min-height:
              180px;
          }
        }
      `}</style>
    </>
  );
}
