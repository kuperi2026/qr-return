"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  useRouter,
} from "next/navigation";

import {
  createClient,
} from "@supabase/supabase-js";

import ProfileCard, {
  type ProfileCardItem,
} from "@/components/account/ProfileCard";

type ItemRow = {
  id: string;

  tag_code: string | null;

  item_type: string | null;
  pet_type: string | null;

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
  const url =
    process.env
      .NEXT_PUBLIC_SUPABASE_URL;

  const key =
    process.env
      .NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env
      .NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env
      .NEXT_PUBLIC_SUPABASE_KEY;

  if (
    !url ||
    !key
  ) {
    return null;
  }

  return createClient(
    url,
    key
  );
}

export default function MyProfilesPage() {
  const router =
    useRouter();

  const [
    profiles,
    setProfiles,
  ] =
    useState<ItemRow[]>(
      []
    );

  const [
    email,
    setEmail,
  ] =
    useState("");

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

  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    filter,
    setFilter,
  ] =
    useState("all");

  useEffect(() => {
    async function loadProfiles() {
      try {
        setLoading(true);
        setErrorMessage("");

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
          error:
            userError,
        } =
          await supabase.auth
            .getUser();

        if (
          userError ||
          !user
        ) {
          router.replace(
            "/login"
          );

          return;
        }

        setEmail(
          user.email || ""
        );

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
                pet_type,
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
          (data ||
            []) as ItemRow[]
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

    void loadProfiles();
  }, [router]);

  async function handleLogout() {
    const supabase =
      createSupabaseClient();

    if (!supabase) {
      return;
    }

    await supabase.auth
      .signOut();

    window.location.href =
      "/login";
  }

  const filteredProfiles =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return profiles.filter(
        (profile) => {
          const type =
            (
              profile.item_type ||
              profile.pet_type ||
              ""
            ).toLowerCase();

          const matchesFilter =
            filter === "all" ||
            type === filter;

          if (
            !matchesFilter
          ) {
            return false;
          }

          if (!query) {
            return true;
          }

          return (
            profile.item_name
              ?.toLowerCase()
              .includes(
                query
              ) ||
            profile.tag_code
              ?.toLowerCase()
              .includes(
                query
              ) ||
            type.includes(
              query
            )
          );
        }
      );
    }, [
      profiles,
      search,
      filter,
    ]);

  const cardProfiles:
    ProfileCardItem[] =
    filteredProfiles.map(
      (profile) => ({
        id:
          profile.id,

        tagCode:
          profile.tag_code,

        type:
          profile.item_type,

        petType:
          profile.pet_type,

        name:
          profile.item_name,

        photo:
          profile.photo,

        active:
          profile.active,

        scanCount:
          profile.scan_count,

        lastScannedAt:
          profile
            .last_scanned_at,

        lastScanLatitude:
          profile
            .last_scan_latitude,

        lastScanLongitude:
          profile
            .last_scan_longitude,

        lastScanAccuracy:
          profile
            .last_scan_accuracy,
      })
    );

  if (loading) {
    return (
      <>
        <main className="loadingPage">
          <div className="loader">
            <div className="logo">
              QR
            </div>

            <strong>
              QR RETURN
            </strong>

            <span>
              პროფილები იტვირთება...
            </span>
          </div>
        </main>

        <style jsx>{`
          .loadingPage {
            min-height:
              100vh;

            display:
              grid;

            place-items:
              center;

            background:
              #f5f8fd;
          }

          .loader {
            text-align:
              center;
          }

          .logo {
            width:
              48px;

            height:
              48px;

            margin:
              0 auto 10px;

            display:
              grid;

            place-items:
              center;

            border-radius:
              12px;

            background:
              #1266e9;

            color:
              white;

            font-size:
              13px;

            font-weight:
              950;
          }

          .loader strong {
            display:
              block;

            color:
              #263f59;

            font-size:
              16px;
          }

          .loader span {
            display:
              block;

            margin-top:
              4px;

            color:
              #8392a2;

            font-size:
              11px;
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <main className="page">
        <header className="header">
          <Link
            href="/"
            className="brand"
          >
            <span className="brandMark">
              QR
            </span>

            <span className="brandText">
              <strong>
                QR RETURN
              </strong>

              <small>
                SMART LOST &amp; FOUND
              </small>
            </span>
          </Link>

          <div className="headerRight">
            {email && (
              <span className="email">
                {email}
              </span>
            )}

            <button
              type="button"
              className="logout"
              onClick={
                handleLogout
              }
            >
              გამოსვლა
            </button>

            <Link
              href="/register"
              className="addButton"
            >
              + ახალი QR პროფილი
            </Link>
          </div>
        </header>

        <section className="hero">
          <div>
            <span className="eyebrow">
              OWNER DASHBOARD
            </span>

            <h1>
              ჩემი QR პროფილები
            </h1>

            <p>
              მართეთ ყველა თქვენი
              QR RETURN პროფილი ერთ
              სივრცეში.
            </p>
          </div>

          <div className="totalBox">
            <span>
              TOTAL PROFILES
            </span>

            <strong>
              {profiles.length}
            </strong>
          </div>
        </section>

        {errorMessage && (
          <div className="errorBox">
            {errorMessage}
          </div>
        )}

        {profiles.length >
          0 && (
          <section className="toolbar">
            <div className="searchBox">
              <span>
                ⌕
              </span>

              <input
                type="search"
                value={
                  search
                }
                onChange={(
                  event
                ) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="მოძებნეთ სახელი ან QR კოდი"
              />
            </div>

            <select
              value={
                filter
              }
              onChange={(
                event
              ) =>
                setFilter(
                  event.target.value
                )
              }
            >
              <option value="all">
                ყველა
              </option>

              <option value="dog">
                ძაღლი
              </option>

              <option value="cat">
                კატა
              </option>

              <option value="keys">
                გასაღები
              </option>

              <option value="wallet">
                საფულე
              </option>

              <option value="bag">
                ჩანთა
              </option>

              <option value="suitcase">
                ჩემოდანი
              </option>
            </select>
          </section>
        )}

        {profiles.length ===
        0 ? (
          <section className="emptyState">
            <div className="emptyIcon">
              QR
            </div>

            <h2>
              ჯერ არცერთი QR პროფილი
              არ გაქვთ
            </h2>

            <p>
              დაამატეთ პირველი
              ცხოველი ან ნივთი თქვენს
              QR RETURN ანგარიშზე.
            </p>

            <Link
              href="/register"
              className="emptyButton"
            >
              + პირველი პროფილის დამატება
            </Link>
          </section>
        ) : cardProfiles.length ===
          0 ? (
          <section className="noResults">
            <strong>
              პროფილი ვერ მოიძებნა
            </strong>

            <span>
              შეცვალეთ ძიება ან
              ფილტრი.
            </span>
          </section>
        ) : (
          <section className="profileGrid">
            {cardProfiles.map(
              (profile) => (
                <ProfileCard
                  key={
                    profile.id
                  }
                  item={
                    profile
                  }
                />
              )
            )}
          </section>
        )}
      </main>

      <style jsx global>{`
        * {
          box-sizing:
            border-box;
        }

        body {
          margin: 0;
        }

        .page {
          min-height:
            100vh;

          padding-bottom:
            60px;

          background:
            radial-gradient(
              circle at
              100% 0%,
              rgba(
                18,
                102,
                233,
                0.07
              ),
              transparent
                26%
            ),
            linear-gradient(
              180deg,
              #ffffff
                0%,
              #f5f8fd
                100%
            );

          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Arial,
            sans-serif;
        }

        .header {
          width:
            calc(
              100% -
              48px
            );

          max-width:
            1120px;

          min-height:
            72px;

          margin:
            0 auto;

          display:
            flex;

          align-items:
            center;

          justify-content:
            space-between;

          gap:
            18px;

          border-bottom:
            1px solid
            #e5ebf2;
        }

        .brand {
          display:
            flex;

          align-items:
            center;

          gap:
            9px;

          text-decoration:
            none;
        }

        .brandMark {
          width:
            40px;

          height:
            40px;

          display:
            grid;

          place-items:
            center;

          border-radius:
            10px;

          background:
            #1266e9;

          color:
            #ffffff;

          font-size:
            11px;

          font-weight:
            950;
        }

        .brandText strong,
        .brandText small {
          display:
            block;
        }

        .brandText strong {
          color:
            #172b43;

          font-size:
            15px;

          font-weight:
            950;
        }

        .brandText small {
          margin-top:
            2px;

          color:
            #8a98a7;

          font-size:
            7px;

          font-weight:
            850;

          letter-spacing:
            1px;
        }

        .headerRight {
          display:
            flex;

          align-items:
            center;

          gap:
            8px;
        }

        .email {
          max-width:
            190px;

          overflow:
            hidden;

          color:
            #8391a0;

          font-size:
            9px;

          text-overflow:
            ellipsis;

          white-space:
            nowrap;
        }

        .logout {
          height:
            38px;

          padding:
            0 12px;

          border:
            1px solid
            #dce5ee;

          border-radius:
            9px;

          background:
            #ffffff;

          color:
            #657a8e;

          font-family:
            inherit;

          font-size:
            9px;

          font-weight:
            850;

          cursor:
            pointer;
        }

        .addButton {
          height:
            40px;

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
        .toolbar,
        .profileGrid,
        .errorBox,
        .emptyState,
        .noResults {
          width:
            calc(
              100% -
              48px
            );

          max-width:
            1120px;

          margin-left:
            auto;

          margin-right:
            auto;
        }

        .hero {
          margin-top:
            38px;

          display:
            flex;

          align-items:
            flex-end;

          justify-content:
            space-between;

          gap:
            20px;
        }

        .eyebrow {
          color:
            #1266e9;

          font-size:
            8px;

          font-weight:
            900;

          letter-spacing:
            1.4px;
        }

        .hero h1 {
          margin:
            7px 0 0;

          color:
            #172b43;

          font-size:
            32px;

          font-weight:
            950;
        }

        .hero p {
          margin:
            7px 0 0;

          color:
            #7b8b9c;

          font-size:
            11px;

          line-height:
            1.5;
        }

        .totalBox {
          min-width:
            104px;

          padding:
            11px 13px;

          border:
            1px solid
            #dce6f1;

          border-radius:
            11px;

          background:
            #ffffff;

          text-align:
            right;
        }

        .totalBox span {
          display:
            block;

          color:
            #8a98a7;

          font-size:
            7px;

          font-weight:
            900;
        }

        .totalBox strong {
          display:
            block;

          margin-top:
            3px;

          color:
            #1266e9;

          font-size:
            22px;

          font-weight:
            950;
        }

        .errorBox {
          margin-top:
            18px;

          padding:
            11px 13px;

          border:
            1px solid
            #efcbd0;

          border-radius:
            10px;

          background:
            #fff7f8;

          color:
            #a3444d;

          font-size:
            10px;
        }

        .toolbar {
          margin-top:
            22px;

          display:
            grid;

          grid-template-columns:
            minmax(
              0,
              1fr
            )
            170px;

          gap:
            9px;
        }

        .searchBox {
          height:
            44px;

          display:
            flex;

          align-items:
            center;

          gap:
            8px;

          padding:
            0 13px;

          border:
            1px solid
            #dce5ee;

          border-radius:
            10px;

          background:
            #ffffff;
        }

        .searchBox span {
          color:
            #8da0b3;

          font-size:
            17px;
        }

        .searchBox input {
          width:
            100%;

          border:
            0;

          background:
            transparent;

          color:
            #304b66;

          font-family:
            inherit;

          font-size:
            11px;

          outline:
            none;
        }

        .toolbar select {
          width:
            100%;

          height:
            44px;

          padding:
            0 11px;

          border:
            1px solid
            #dce5ee;

          border-radius:
            10px;

          background:
            #ffffff;

          color:
            #536b82;

          font-family:
            inherit;

          font-size:
            10px;

          font-weight:
            750;

          outline:
            none;
        }

        .profileGrid {
          margin-top:
            14px;

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
            14px;
        }

        .emptyState,
        .noResults {
          margin-top:
            32px;

          padding:
            46px 20px;

          border:
            1px solid
            #dfe7ef;

          border-radius:
            15px;

          background:
            #ffffff;

          text-align:
            center;

          box-shadow:
            0 12px
            28px
            rgba(
              30,
              70,
              120,
              0.04
            );
        }

        .emptyIcon {
          width:
            48px;

          height:
            48px;

          margin:
            0 auto;

          display:
            grid;

          place-items:
            center;

          border-radius:
            12px;

          background:
            #eef5ff;

          color:
            #1266e9;

          font-size:
            11px;

          font-weight:
            950;
        }

        .emptyState h2 {
          margin:
            13px 0 0;

          color:
            #263f59;

          font-size:
            19px;
        }

        .emptyState p {
          max-width:
            420px;

          margin:
            7px auto 0;

          color:
            #8291a1;

          font-size:
            10px;

          line-height:
            1.55;
        }

        .emptyButton {
          min-height:
            41px;

          margin-top:
            16px;

          padding:
            0 15px;

          display:
            inline-flex;

          align-items:
            center;

          justify-content:
            center;

          border-radius:
            9px;

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

        .noResults strong,
        .noResults span {
          display:
            block;
        }

        .noResults strong {
          color:
            #304b66;

          font-size:
            14px;
        }

        .noResults span {
          margin-top:
            4px;

          color:
            #8796a6;

          font-size:
            10px;
        }

        @media (
          max-width:
            920px
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
        }

        @media (
          max-width:
            650px
        ) {
          .header,
          .hero,
          .toolbar,
          .profileGrid,
          .errorBox,
          .emptyState,
          .noResults {
            width:
              calc(
                100% -
                24px
              );
          }

          .header {
            min-height:
              66px;
          }

          .brandText small,
          .email {
            display:
              none;
          }

          .logout {
            display:
              none;
          }

          .addButton {
            padding:
              0 10px;
          }

          .hero {
            margin-top:
              27px;

            align-items:
              flex-start;
          }

          .hero h1 {
            font-size:
              26px;
          }

          .totalBox {
            min-width:
              85px;
          }

          .toolbar {
            grid-template-columns:
              1fr;
          }

          .profileGrid {
            grid-template-columns:
              1fr;
          }
        }
      `}</style>
    </>
  );
}
