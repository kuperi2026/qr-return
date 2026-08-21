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
} from "@supabase/supabase-js";

type Profile = {
  id: string;
  tag_code: string;
  item_type: string;
  item_name: string | null;
  photo: string | null;
  active: boolean | null;

  scan_count: number | null;
  last_scanned_at: string | null;

  last_scan_latitude:
    number | null;

  last_scan_longitude:
    number | null;

  last_scan_accuracy:
    number | null;
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

function formatScanDate(
  value: string | null
) {
  if (!value) {
    return "ჯერ არ დასკანერებულა";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return date.toLocaleString();
}

export default function MyProfilesPage() {
  const router = useRouter();

  const [
    profiles,
    setProfiles,
  ] =
    useState<Profile[]>([]);

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
    async function loadProfiles() {
      try {
        const supabase =
          createSupabaseClient();

        if (!supabase) {
          setErrorMessage(
            "Supabase კავშირი არ არის კონფიგურირებული."
          );

          return;
        }

        const {
          data: {
            user,
          },
          error: userError,
        } =
          await supabase.auth.getUser();

        if (
          userError ||
          !user
        ) {
          router.replace(
            "/login"
          );

          return;
        }

        const {
          data,
          error,
        } =
          await supabase
            .from("item")
            .select(
              `
                id,
                tag_code,
                item_type,
                item_name,
                photo,
                active,
                scan_count,
                last_scanned_at,
                last_scan_latitude,
                last_scan_longitude,
                last_scan_accuracy
              `
            )
            .eq(
              "owner_id",
              user.id
            )
            .order(
              "id",
              {
                ascending:
                  false,
              }
            );

        if (error) {
          throw error;
        }

        setProfiles(
          data || []
        );
      } catch (error) {
        console.error(
          "Load profiles error:",
          error
        );

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "პროფილების ჩატვირთვა ვერ მოხერხდა."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfiles();
  }, [router]);

  if (loading) {
    return (
      <main className="loadingPage">
        <div className="loaderCard">
          თქვენი პროფილები იტვირთება...
        </div>

        <style jsx>{`
          .loadingPage {
            min-height: 100vh;

            display: grid;
            place-items: center;

            padding: 30px;

            background: #f7faff;
          }

          .loaderCard {
            padding: 22px 28px;

            border:
              1px solid #dce6f1;

            border-radius: 14px;

            background: #ffffff;

            color: #718095;

            font-size: 11px;
          }
        `}</style>
      </main>
    );
  }

  return (
    <>
      <main className="page">
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

          <div className="headerActions">
            <a
              href="/register"
              className="addTop"
            >
              + ახალი პროფილი
            </a>
          </div>
        </header>

        <section className="hero">
          <span>
            OWNER DASHBOARD
          </span>

          <h1>
            ჩემი QR პროფილები
          </h1>

          <p>
            აქ შეგიძლიათ მართოთ
            ყველა თქვენი QR RETURN
            პროფილი, ნახოთ ბოლო
            სკანირება და მპოვნელის
            გაზიარებული მდებარეობა.
          </p>
        </section>

        {errorMessage && (
          <div className="errorBox">
            {errorMessage}
          </div>
        )}

        {profiles.length === 0 ? (
          <section className="emptyState">
            <div className="emptyIcon">
              QR
            </div>

            <h2>
              ჯერ არცერთი პროფილი არ გაქვთ
            </h2>

            <p>
              დაამატეთ პირველი QR
              პროფილი ძაღლისთვის,
              კატისთვის ან თქვენი
              ნივთისთვის.
            </p>

            <a
              href="/register"
              className="primaryButton"
            >
              პირველი პროფილის დამატება
            </a>
          </section>
        ) : (
          <>
            <section className="summary">
              <div>
                <span>
                  TOTAL PROFILES
                </span>

                <strong>
                  {profiles.length}
                </strong>
              </div>

              <a href="/register">
                + ახალი პროფილის დამატება
              </a>
            </section>

            <section className="grid">
              {profiles.map(
                (profile) => {
                  const meta =
                    CATEGORY_META[
                      profile
                        .item_type
                    ] || {
                      label:
                        profile
                          .item_type,
                      emoji: "QR",
                    };

                  const hasLocation =
                    profile
                      .last_scan_latitude !==
                      null &&
                    profile
                      .last_scan_longitude !==
                      null;

                  const mapsUrl =
                    hasLocation
                      ? `https://www.google.com/maps?q=${profile.last_scan_latitude},${profile.last_scan_longitude}`
                      : "";

                  return (
                    <article
                      key={
                        profile.id
                      }
                      className="card"
                    >
                      <div className="cardTop">
                        <div className="categoryIcon">
                          {
                            meta.emoji
                          }
                        </div>

                        <div
                          className={
                            profile.active !==
                            false
                              ? "status active"
                              : "status"
                          }
                        >
                          {profile.active !==
                          false
                            ? "ACTIVE"
                            : "INACTIVE"}
                        </div>
                      </div>

                      <div className="category">
                        {
                          meta.label
                        }
                      </div>

                      <h2>
                        {profile.item_name ||
                          meta.label}
                      </h2>

                      <div className="tag">
                        <span>
                          QR CODE
                        </span>

                        <strong>
                          {
                            profile.tag_code
                          }
                        </strong>
                      </div>

                      <div className="scanBox">
                        <div className="scanHeader">
                          <div>
                            <span>
                              LAST SCAN
                            </span>

                            <strong>
                              {formatScanDate(
                                profile.last_scanned_at
                              )}
                            </strong>
                          </div>

                          <div className="scanCount">
                            <span>
                              SCANS
                            </span>

                            <strong>
                              {profile.scan_count ||
                                0}
                            </strong>
                          </div>
                        </div>

                        {hasLocation ? (
                          <>
                            <div className="locationData">
                              <div>
                                <span>
                                  LAT
                                </span>

                                <strong>
                                  {profile.last_scan_latitude?.toFixed(
                                    6
                                  )}
                                </strong>
                              </div>

                              <div>
                                <span>
                                  LNG
                                </span>

                                <strong>
                                  {profile.last_scan_longitude?.toFixed(
                                    6
                                  )}
                                </strong>
                              </div>
                            </div>

                            {profile.last_scan_accuracy !==
                              null && (
                              <div className="accuracy">
                                Accuracy:{" "}
                                <strong>
                                  {Math.round(
                                    profile.last_scan_accuracy
                                  )}{" "}
                                  m
                                </strong>
                              </div>
                            )}

                            <a
                              href={
                                mapsUrl
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="mapButton"
                            >
                              📍 Open Location
                            </a>
                          </>
                        ) : (
                          <div className="noLocation">
                            📍 მპოვნელს მდებარეობა ჯერ არ გაუზიარებია.
                          </div>
                        )}
                      </div>

                      <div className="actions">
                        <a
                          href={`/profile/${profile.tag_code}`}
                          className="viewButton"
                        >
                          ნახვა
                        </a>

                        <a
                          href={`/edit-profile/${profile.id}`}
                          className="editButton"
                        >
                          რედაქტირება
                        </a>
                      </div>
                    </article>
                  );
                }
              )}
            </section>
          </>
        )}
      </main>

      <style jsx>{`
        * {
          box-sizing:
            border-box;
        }

        .page {
          min-height:
            100vh;

          padding-bottom:
            80px;

          background:
            radial-gradient(
              circle at 100% 0%,
              rgba(
                18,
                102,
                233,
                .07
              ),
              transparent 26%
            ),
            linear-gradient(
              180deg,
              #ffffff 0%,
              #f6f9fe 100%
            );
        }

        .header {
          width:
            calc(
              100% - 60px
            );

          max-width:
            1200px;

          min-height:
            80px;

          margin:
            auto;

          display:
            flex;

          align-items:
            center;

          justify-content:
            space-between;

          gap:
            20px;

          border-bottom:
            1px solid #e5ebf2;
        }

        .brand {
          display:
            flex;

          align-items:
            center;

          gap:
            10px;

          text-decoration:
            none;
        }

        .brandMark {
          width:
            42px;

          height:
            42px;

          display:
            grid;

          place-items:
            center;

          border-radius:
            11px;

          background:
            #1266e9;

          color:
            #ffffff;

          font-size:
            10px;

          font-weight:
            950;
        }

        .brand strong,
        .brand span {
          display:
            block;
        }

        .brand strong {
          color:
            #172b43;

          font-size:
            15px;

          font-weight:
            950;
        }

        .brand span {
          margin-top:
            3px;

          color:
            #8b97a5;

          font-size:
            7px;

          font-weight:
            850;

          letter-spacing:
            1.3px;
        }

        .addTop {
          min-height:
            42px;

          padding:
            0 14px;

          display:
            inline-flex;

          align-items:
            center;

          border-radius:
            10px;

          background:
            #1266e9;

          color:
            #ffffff;

          font-size:
            9px;

          font-weight:
            900;

          text-decoration:
            none;
        }

        .hero,
        .summary,
        .grid,
        .errorBox {
          width:
            calc(
              100% - 60px
            );

          max-width:
            1200px;

          margin-left:
            auto;

          margin-right:
            auto;
        }

        .hero {
          margin-top:
            60px;
        }

        .hero > span {
          color:
            #1266e9;

          font-size:
            8px;

          font-weight:
            900;

          letter-spacing:
            1.5px;
        }

        .hero h1 {
          margin:
            9px 0 0;

          color:
            #172b43;

          font-size:
            40px;
        }

        .hero p {
          max-width:
            580px;

          margin:
            12px 0 0;

          color:
            #77869a;

          font-size:
            11px;

          line-height:
            1.65;
        }

        .errorBox {
          margin-top:
            24px;

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

          font-size:
            10px;
        }

        .summary {
          margin-top:
            34px;

          padding:
            16px 18px;

          display:
            flex;

          align-items:
            center;

          justify-content:
            space-between;

          gap:
            20px;

          border:
            1px solid #dce6f1;

          border-radius:
            14px;

          background:
            #ffffff;
        }

        .summary span {
          display:
            block;

          color:
            #8a97a6;

          font-size:
            7px;

          font-weight:
            900;
        }

        .summary strong {
          display:
            block;

          margin-top:
            4px;

          color:
            #172b43;

          font-size:
            22px;
        }

        .summary a {
          color:
            #1266e9;

          font-size:
            9px;

          font-weight:
            900;

          text-decoration:
            none;
        }

        .grid {
          margin-top:
            18px;

          display:
            grid;

          grid-template-columns:
            repeat(
              3,
              minmax(
                0,
                1fr
              )
            );

          gap:
            15px;
        }

        .card {
          min-height:
            400px;

          padding:
            20px;

          display:
            flex;

          flex-direction:
            column;

          border:
            1px solid #dce6f1;

          border-radius:
            16px;

          background:
            #ffffff;

          box-shadow:
            0 12px 28px
            rgba(
              30,
              70,
              120,
              .055
            );
        }

        .cardTop {
          display:
            flex;

          align-items:
            center;

          justify-content:
            space-between;

          gap:
            10px;
        }

        .categoryIcon {
          width:
            48px;

          height:
            48px;

          display:
            grid;

          place-items:
            center;

          border-radius:
            13px;

          background:
            #f0f5fd;

          font-size:
            24px;
        }

        .status {
          padding:
            5px 8px;

          border-radius:
            999px;

          background:
            #edf0f4;

          color:
            #8b97a5;

          font-size:
            6px;

          font-weight:
            900;
        }

        .status.active {
          background:
            #eaf2ff;

          color:
            #1266e9;
        }

        .category {
          margin-top:
            22px;

          color:
            #1266e9;

          font-size:
            8px;

          font-weight:
            900;
        }

        .card h2 {
          margin:
            7px 0 0;

          color:
            #263e57;

          font-size:
            19px;
        }

        .tag {
          margin-top:
            18px;

          padding:
            12px;

          border:
            1px solid #e1e8f0;

          border-radius:
            10px;

          background:
            #fafcff;
        }

        .tag span,
        .tag strong {
          display:
            block;
        }

        .tag span {
          color:
            #9aa6b4;

          font-size:
            7px;

          font-weight:
            900;
        }

        .tag strong {
          margin-top:
            5px;

          color:
            #536980;

          font-size:
            10px;

          word-break:
            break-all;
        }

        .scanBox {
          margin-top:
            12px;

          padding:
            13px;

          border:
            1px solid #d9e5f3;

          border-radius:
            11px;

          background:
            #f8fbff;
        }

        .scanHeader {
          display:
            flex;

          align-items:
            flex-start;

          justify-content:
            space-between;

          gap:
            10px;
        }

        .scanHeader span,
        .locationData span {
          display:
            block;

          color:
            #97a3b1;

          font-size:
            6px;

          font-weight:
            900;

          letter-spacing:
            .7px;
        }

        .scanHeader strong {
          display:
            block;

          margin-top:
            4px;

          color:
            #405974;

          font-size:
            8px;

          line-height:
            1.4;
        }

        .scanCount {
          min-width:
            48px;

          text-align:
            right;
        }

        .scanCount strong {
          color:
            #1266e9;

          font-size:
            15px;
        }

        .locationData {
          margin-top:
            12px;

          display:
            grid;

          grid-template-columns:
            1fr 1fr;

          gap:
            7px;
        }

        .locationData > div {
          padding:
            8px;

          border:
            1px solid #e0e8f1;

          border-radius:
            8px;

          background:
            #ffffff;
        }

        .locationData strong {
          display:
            block;

          margin-top:
            4px;

          color:
            #526b84;

          font-size:
            8px;
        }

        .accuracy {
          margin-top:
            8px;

          color:
            #8594a5;

          font-size:
            7px;
        }

        .mapButton {
          min-height:
            37px;

          margin-top:
            10px;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          border-radius:
            8px;

          background:
            #1266e9;

          color:
            #ffffff;

          font-size:
            8px;

          font-weight:
            900;

          text-decoration:
            none;
        }

        .noLocation {
          margin-top:
            10px;

          color:
            #8796a7;

          font-size:
            8px;

          line-height:
            1.45;
        }

        .actions {
          margin-top:
            auto;

          padding-top:
            18px;

          display:
            grid;

          grid-template-columns:
            1fr 1fr;

          gap:
            8px;
        }

        .actions a {
          min-height:
            40px;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          border-radius:
            9px;

          font-size:
            8px;

          font-weight:
            900;

          text-decoration:
            none;
        }

        .viewButton {
          background:
            #1266e9;

          color:
            #ffffff;
        }

        .editButton {
          border:
            1px solid #ccdae9;

          background:
            #ffffff;

          color:
            #61758a;
        }

        .emptyState {
          width:
            calc(
              100% - 60px
            );

          max-width:
            620px;

          margin:
            60px auto 0;

          padding:
            50px 30px;

          text-align:
            center;

          border:
            1px solid #dce6f1;

          border-radius:
            18px;

          background:
            #ffffff;
        }

        .emptyIcon {
          width:
            60px;

          height:
            60px;

          margin:
            auto;

          display:
            grid;

          place-items:
            center;

          border-radius:
            16px;

          background:
            #edf4ff;

          color:
            #1266e9;

          font-size:
            12px;

          font-weight:
            950;
        }

        .emptyState h2 {
          margin:
            20px 0 0;

          color:
            #263e57;

          font-size:
            22px;
        }

        .emptyState p {
          margin:
            10px auto 0;

          color:
            #7e8da0;

          font-size:
            10px;
        }

        .primaryButton {
          min-height:
            44px;

          margin-top:
            22px;

          padding:
            0 17px;

          display:
            inline-flex;

          align-items:
            center;

          border-radius:
            10px;

          background:
            #1266e9;

          color:
            #ffffff;

          font-size:
            9px;

          font-weight:
            900;

          text-decoration:
            none;
        }

        @media (
          max-width:
            900px
        ) {
          .grid {
            grid-template-columns:
              repeat(
                2,
                minmax(
                  0,
                  1fr
                )
              );
          }
        }

        @media (
          max-width:
            600px
        ) {
          .header,
          .hero,
          .summary,
          .grid,
          .errorBox,
          .emptyState {
            width:
              calc(
                100% - 30px
              );
          }

          .hero h1 {
            font-size:
              31px;
          }

          .grid {
            grid-template-columns:
              1fr;
          }

          .summary {
            flex-direction:
              column;

            align-items:
              flex-start;
          }
        }
      `}</style>
    </>
  );
}
