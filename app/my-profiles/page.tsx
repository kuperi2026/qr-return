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
  scan_count: number | null;
  last_scanned_at: string | null;
  last_scan_latitude: number | null;
  last_scan_longitude: number | null;
  last_scan_accuracy: number | null;

  active: boolean | null;
  lost: boolean | null;
  lost_at: string | null;
  trial_ends_at: string | null;
  service_starts_at: string | null;
  service_expires_at: string | null;
  service_status: string | null;
};

const PROFILES_PER_PAGE = 2;

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

  const [createdMessage, setCreatedMessage] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const created = new URLSearchParams(window.location.search).get("created");
    if (created) setCreatedMessage(`QR პროფილი ${created} წარმატებით შეიქმნა და შეინახა.`);

    async function loadProfiles() {
      try {
        setLoading(
          true
        );

        setErrorMessage(
          ""
        );

        const supabase =
          createSupabaseClient();

        if (!supabase) {
          throw new Error(
            "Supabase კავშირი არ არის კონფიგურირებული."
          );
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
          user.email ||
          ""
        );

        const {
          data,
          error,
        } =
          await supabase
            .from(
              "item"
            )
            .select(
              `
                id,
                tag_code,
                item_type,
                pet_type,
                item_name,
                photo,
                scan_count,
                last_scanned_at,
                last_scan_latitude,
                last_scan_longitude,
                last_scan_accuracy,
                active,
                lost,
                lost_at,
                trial_ends_at,
                service_starts_at,
                service_expires_at,
                service_status
              `
            )
            .eq(
              "owner_id",
              user.id
            );

        if (error) {
          console.error(
            "ITEM QUERY ERROR:",
            error
          );

          throw new Error(
            `პროფილების ჩატვირთვა ვერ მოხერხდა: ${error.message}`
          );
        }

        setProfiles(
          (
            data ||
            []
          ) as ItemRow[]
        );
      } catch (error) {
        console.error(
          "LOAD PROFILES ERROR:",
          error
        );

        setProfiles(
          []
        );

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "პროფილების ჩატვირთვა ვერ მოხერხდა."
        );
      } finally {
        setLoading(
          false
        );
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

    router.replace(
      "/login"
    );
  }

  const filteredProfiles =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return profiles.filter(
        (
          profile
        ) => {
          const type =
            (
              profile
                .item_type ||
              profile
                .pet_type ||
              ""
            ).toLowerCase();

          const petType =
            (
              profile
                .pet_type ||
              ""
            ).toLowerCase();

          const matchesFilter =
            filter ===
              "all" ||
            type ===
              filter ||
            petType ===
              filter;

          if (
            !matchesFilter
          ) {
            return false;
          }

          if (
            !query
          ) {
            return true;
          }

          return (
            profile
              .item_name
              ?.toLowerCase()
              .includes(
                query
              ) ||
            profile
              .tag_code
              ?.toLowerCase()
              .includes(
                query
              ) ||
            type.includes(
              query
            ) ||
            petType.includes(
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

  const cards:
    ProfileCardItem[] =
    filteredProfiles.map(
      (
        profile
      ) => ({
        id:
          profile.id,

        tagCode:
          profile
            .tag_code,

        type:
          profile
            .item_type,

        petType:
          profile
            .pet_type,

        name:
          profile
            .item_name,

        photo:
          profile
            .photo,

        active:
          profile
            .active,

        lost: profile.lost,
        lostAt: profile.lost_at,

        scanCount:
          profile
            .scan_count,

        lastScannedAt:
          profile
            .last_scanned_at,

        trialEndsAt: profile.trial_ends_at,
        serviceStartsAt: profile.service_starts_at,
        serviceExpiresAt: profile.service_expires_at,
        serviceStatus: profile.service_status,

        lastScanLatitude:
          profile.last_scan_latitude,

        lastScanLongitude:
          profile.last_scan_longitude,

        lastScanAccuracy:
          profile.last_scan_accuracy,
      })
    );

  const totalPages = Math.ceil(cards.length / PROFILES_PER_PAGE);

  const visibleCards = cards.slice(
    (currentPage - 1) * PROFILES_PER_PAGE,
    currentPage * PROFILES_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, Math.max(totalPages, 1)));
  }, [totalPages]);

  if (
    loading
  ) {
    return (
      <>
        <main className="loadingPage">
          <div className="loadingLogo">
            QR
          </div>

          <strong>
            QR RETURN
          </strong>

          <span>
            პროფილები იტვირთება...
          </span>
        </main>

        <style jsx>{`
          .loadingPage {
            min-height:
              100vh;

            display:
              flex;

            flex-direction:
              column;

            align-items:
              center;

            justify-content:
              center;

            gap:
              7px;

            background:
              #f5f8fd;

            font-family:
              Inter,
              -apple-system,
              BlinkMacSystemFont,
              "Segoe UI",
              Arial,
              sans-serif;
          }

          .loadingLogo {
            width:
              48px;

            height:
              48px;

            display:
              grid;

            place-items:
              center;

            border-radius:
              12px;

            background:
              #1266e9;

            color:
              #ffffff;

            font-size:
              12px;

            font-weight:
              950;
          }

          .loadingPage strong {
            color:
              #263f59;

            font-size:
              16px;
          }

          .loadingPage span {
            color:
              #8493a3;

            font-size:
              11px;
          }
        `}</style>
      </>
    );
  }

  async function handleDelete(item: ProfileCardItem) {
    const supabase = createSupabaseClient();
    if (!supabase) throw new Error("სერვერთან კავშირი ვერ მოიძებნა.");

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error("გთხოვთ, ხელახლა შეხვიდეთ ანგარიშზე.");

    const { data, error } = await supabase
      .from("item")
      .delete()
      .eq("id", item.id)
      .eq("owner_id", user.id)
      .select("id")
      .maybeSingle();

    if (error) throw new Error(`პროფილის წაშლა ვერ მოხერხდა: ${error.message}`);
    if (!data) throw new Error("პროფილის წაშლა ვერ დადასტურდა.");

    setProfiles((current) => current.filter((profile) => profile.id !== item.id));
  }

  async function handleLostChange(item: ProfileCardItem, nextLost: boolean) {
    const supabase = createSupabaseClient();
    if (!supabase) throw new Error("სერვერთან კავშირი ვერ მოიძებნა.");
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error("გთხოვთ, ხელახლა შეხვიდეთ ანგარიშზე.");

    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("item")
      .update({
        lost: nextLost,
        lost_at: nextLost ? now : null,
        found_at: nextLost ? null : now,
      })
      .eq("id", item.id)
      .eq("owner_id", user.id)
      .select("id,lost,lost_at")
      .maybeSingle();

    if (error) throw new Error(`დაკარგვის რეჟიმის შეცვლა ვერ მოხერხდა: ${error.message}`);
    if (!data) throw new Error("ცვლილების შენახვა ვერ დადასტურდა.");

    setProfiles((current) => current.map((profile) =>
      profile.id === item.id
        ? { ...profile, lost: data.lost, lost_at: data.lost_at }
        : profile
    ));
  }

  return (
    <>
      <main className="page">
        <header className="header">
          <Link
            href="/"
            className="brand"
          >
            <span className="brandStatement">
              დაცული QR კავშირი
            </span>
          </Link>

          <div className="headerRight">
            <Link href="/account/subscriptions" className="plansButton">
              მომსახურება და პაკეტები
            </Link>
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
              მფლობელის სივრცე
            </span>

            <p>
              მართეთ თქვენს მიერ შექმნილი პროფილები ერთ სივრცეში.
            </p>
          </div>

          <div className="totalBox">
            <span>
              პროფილების რაოდენობა
            </span>

            <strong>
              {profiles.length}
            </strong>
          </div>
        </section>

        {createdMessage && <section className="createdNotice">✓ {createdMessage}</section>}

        {errorMessage && (
          <section className="errorBox">
            <strong>
              პროფილების ჩატვირთვა ვერ მოხერხდა
            </strong>

            <span>
              {errorMessage}
            </span>
          </section>
        )}

        {!errorMessage &&
          profiles.length >
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
                      event
                        .target
                        .value
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
                    event
                      .target
                      .value
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

                <option value="parking">
                  ავტომობილი
                </option>
              </select>
            </section>
          )}

        {!errorMessage &&
          profiles.length ===
            0 && (
            <section className="emptyState">
              <div className="emptyIcon">
                QR
              </div>

              <h2>
                ჯერ არცერთი QR პროფილი არ გაქვთ
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
          )}

        {!errorMessage &&
          profiles.length >
            0 &&
          cards.length ===
            0 && (
            <section className="noResults">
              <strong>
                პროფილი ვერ მოიძებნა
              </strong>

              <span>
                შეცვალეთ ძიება ან
                ფილტრი.
              </span>
            </section>
          )}

        {!errorMessage &&
          cards.length >
            0 && (
            <section className="profileGrid">
              {visibleCards.map(
                (
                  profile
                ) => (
                  <ProfileCard
                    key={
                      profile.id
                    }
                    item={
                      profile
                    }
                    onLostChange={handleLostChange}
                    onDelete={handleDelete}
                  />
                )
              )}
            </section>
          )}

        {!errorMessage && totalPages > 1 && (
          <nav className="pagination" aria-label="პროფილების გვერდები">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              aria-label="წინა გვერდი"
            >
              ‹
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                type="button"
                className={page === currentPage ? "active" : ""}
                onClick={() => setCurrentPage(page)}
                aria-current={page === currentPage ? "page" : undefined}
                aria-label={`${page} გვერდი`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              aria-label="შემდეგი გვერდი"
            >
              ›
            </button>
          </nav>
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
            radial-gradient(circle at 21% 17%,rgba(78,166,238,.3),transparent 30%),
            linear-gradient(180deg,#0a4c8a 0%,#063b72 100%);

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

        .brandStatement {
          color: #ffffff;
          font-size: 17px;
          font-weight: 900;
          line-height: 1.3;
        }

        .headerRight {
          display:
            flex;

          align-items:
            center;

          gap:
            8px;
        }

        .plansButton{min-height:42px;padding:0 15px;display:inline-flex;align-items:center;border:1px solid #b8d2f4;border-radius:10px;background:#eaf3ff;color:#0647c8;text-decoration:none;font-size:14px;font-weight:900}
        .createdNotice{width:calc(100% - 48px);max-width:1120px;margin:0 auto 16px;padding:14px 16px;border:1px solid #9fd8bc;border-radius:12px;background:#eaf8f1;color:#087443;font-size:14px;font-weight:850}

        .email {
          max-width: 230px;
          min-height: 42px;
          padding: 0 13px;

          display: inline-flex;
          align-items: center;
          overflow: hidden;

          border: 1px solid rgba(255,255,255,.28);
          border-radius: 10px;
          background: rgba(255,255,255,.12);
          color: #ffffff;

          font-size: 13px;
          font-weight: 700;
          text-overflow: ellipsis;
          white-space: nowrap;
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
            13px;

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
            13px;

          font-weight:
            900;

          text-decoration:
            none;
        }

        .hero,
        .toolbar,
        .profileGrid,
        .pagination,
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
            #b9ddfc;

          font-size:
            13px;

          font-weight:
            900;

          letter-spacing:
            1.4px;
        }

         .hero p {
          margin:
            10px 0 0;

          color:
            #ffffff;

          font-size:
            17px;
          font-weight: 700;

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
            #263f59;

          font-size:
            12px;

          font-weight:
            900;
        }

        .totalBox strong {
          display:
            block;

          margin-top:
            3px;

          color:
            #0647c8;

          font-size:
            22px;

          font-weight:
            950;
        }

        .errorBox {
          margin-top:
            22px;

          padding:
            15px 16px;

          border:
            1px solid
            #efcbd0;

          border-radius:
            11px;

          background:
            #fff7f8;
        }

        .errorBox strong,
        .errorBox span {
          display:
            block;
        }

        .errorBox strong {
          color:
            #9f3844;

          font-size:
            12px;
        }

        .errorBox span {
          margin-top:
            5px;

          color:
            #a85c64;

          font-size:
            10px;

          line-height:
            1.45;
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

          outline:
            none;

          background:
            transparent;

          color:
            #304b66;

          font-family:
            inherit;

          font-size:
            15px;
          font-weight: 600;
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
            14px;

          font-weight:
            800;

          outline:
            none;
        }

        .profileGrid {
          max-width:
            1240px;

          margin-top:
            18px;

          display:
            grid;

          grid-template-columns:
            repeat(
              2,
              minmax(
                0,
                1fr
              )
            );

          gap:
            20px;
        }

        .pagination {
          margin-top: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 8px;
        }

        .pagination button {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.42);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.14);
          color: #ffffff;
          font: 900 15px/1 inherit;
          cursor: pointer;
          transition: background 160ms ease, color 160ms ease, transform 160ms ease;
        }

        .pagination button:hover:not(:disabled) {
          transform: translateY(-1px);
          background: rgba(255, 255, 255, 0.24);
        }

        .pagination button.active {
          border-color: #ffffff;
          background: #ffffff;
          color: #0a4c8a;
        }

        .pagination button:disabled {
          opacity: 0.38;
          cursor: not-allowed;
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

        .brandStatement,.email,.hero p{color:#fff}.eyebrow{color:#b9ddfc;font-size:11px}.hero p{font-size:14px}.header{border-bottom-color:rgba(255,255,255,.22)}.logout{border-color:rgba(255,255,255,.3);background:rgba(255,255,255,.12);color:#fff}.totalBox span{font-size:10px}.toolbar{border-radius:14px}.profileGrid{gap:18px}

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

          .email,
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
