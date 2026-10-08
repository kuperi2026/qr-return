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
import AiRecoveryCommandCenter from "@/app/components/account/AiRecoveryCommandCenter";
import InterfaceIcon from "@/app/components/ui/InterfaceIcon";
import styles from "@/components/account/owner-space.module.css";

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
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

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
    if (loggingOut) return;
    setLoggingOut(true);
    setLogoutError("");
    try {
      const supabase = createSupabaseClient();
      if (!supabase) throw new Error("კავშირი მიუწვდომელია.");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.replace("/login");
    } catch {
      setLogoutError("ანგარიშიდან გამოსვლა ვერ მოხერხდა. სცადეთ ხელახლა.");
    } finally {
      setLoggingOut(false);
    }
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
          const rawType =
            (
              profile
                .item_type ||
              profile
                .pet_type ||
              ""
            ).toLowerCase();
          const type = rawType === "key" ? "keys" : rawType === "luggage" ? "suitcase" : rawType;

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

  if (loading) {
    return <main className={styles.loading} role="status">
      <span className={styles.brandMark}>QR</span>
      <strong>პროფილები იტვირთება...</strong>
    </main>;
  }

  async function handleDelete(item: ProfileCardItem) {
    const supabase = createSupabaseClient();
    if (!supabase) throw new Error("სერვერთან კავშირი ვერ მოიძებნა.");

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error("გთხოვთ, ხელახლა შეხვიდეთ ანგარიშზე.");

    const { data, error } = await supabase
      .rpc("delete_owned_item", { p_item_id: Number(item.id) });

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
    <main className={styles.page}>
      <div className={styles.wrap}>
        <header className={styles.header}>
          <Link href="/" className={styles.brand}>
            <span className={styles.brandMark}>QR</span>დაცული QR კავშირი
          </Link>
          <div className={styles.headerActions}>
            <Link href="/account/subscriptions">მომსახურება და პაკეტები</Link>
            {email && <span className={styles.email} title={email}>{email}</span>}
            <button type="button" className={styles.logout} onClick={handleLogout} disabled={loggingOut}>{loggingOut ? "გადიხართ..." : "გამოსვლა"}</button>
          </div>
        </header>
        {logoutError && <div className={styles.error} role="alert">{logoutError}</div>}

        <section className={styles.heading}>
          <div>
            <h1>მფლობელის სივრცე</h1>
            <p>თქვენი პროფილები, სკანირებები და დაკარგვის რეჟიმი.</p>
          </div>
          <div className={styles.headingActions}>
            <Link href="/account/chat" className={styles.button}><InterfaceIcon name="chat" size={18}/>ჩათი</Link>
            <Link href="/register" className={styles.primaryButton}><InterfaceIcon name="plus" size={18}/>ახალი პროფილი</Link>
          </div>
        </section>

        {createdMessage && <div className={styles.notice} role="status">{createdMessage}</div>}
        {errorMessage ? (
          <section className={styles.error} role="alert">
            <strong>პროფილების ჩატვირთვა ვერ მოხერხდა</strong><span>{errorMessage}</span>
          </section>
        ) : profiles.length === 0 ? (
          <section className={styles.empty}>
            <h2>ჯერ არცერთი QR პროფილი არ გაქვთ</h2>
            <p>დაამატეთ ცხოველი ან ნივთი თქვენს ანგარიშზე.</p>
            <Link href="/register" className={styles.primaryButton}>პირველი პროფილის დამატება</Link>
          </section>
        ) : (
          <>
            <AiRecoveryCommandCenter profiles={profiles.map((profile) => ({
              id: profile.id, tagCode: profile.tag_code, name: profile.item_name,
              type: profile.item_type || profile.pet_type, scanCount: profile.scan_count,
              lastScannedAt: profile.last_scanned_at, latitude: profile.last_scan_latitude,
              longitude: profile.last_scan_longitude, lost: profile.lost,
            }))}/>
            <section aria-labelledby="profiles-heading">
              <div className={styles.sectionHeading}>
                <h2 id="profiles-heading">ჩემი პროფილები <span className={styles.count}>{profiles.length}</span></h2>
                <span className={styles.results} role="status">
                  {cards.length > 0 ? `${(currentPage - 1) * PROFILES_PER_PAGE + 1}–${Math.min(currentPage * PROFILES_PER_PAGE, cards.length)} / ${cards.length}` : "0 შედეგი"}
                </span>
              </div>
              <div className={styles.toolbar}>
                <label className={styles.search}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/></svg>
                  <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="სახელი ან QR კოდი" aria-label="პროფილის ძიება სახელით ან QR კოდით"/>
                </label>
                <select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="პროფილის ტიპი">
                  <option value="all">ყველა ტიპი</option>
                  <option value="dog">ძაღლი</option><option value="cat">კატა</option>
                  <option value="keys">გასაღები</option><option value="wallet">საფულე</option>
                  <option value="bag">ჩანთა</option><option value="suitcase">ჩემოდანი</option>
                  <option value="parking">ავტომობილი</option><option value="emergency">ემერჯენსი სამაჯური</option>
                </select>
              </div>
              {cards.length === 0 ? (
                <div className={styles.empty}>
                  <h2>პროფილი ვერ მოიძებნა</h2><p>შეცვალეთ საძიებო სიტყვა ან პროფილის ტიპი.</p>
                  <button type="button" className={styles.button} onClick={() => { setSearch(""); setFilter("all"); }}>ფილტრების გასუფთავება</button>
                </div>
              ) : (
                <div className={styles.grid}>
                  {visibleCards.map((profile) => <ProfileCard key={profile.id} item={profile} onLostChange={handleLostChange} onDelete={handleDelete}/>) }
                </div>
              )}
              {totalPages > 1 && (
                <nav className={styles.pagination} aria-label="პროფილების გვერდები">
                  <button type="button" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage === 1} aria-label="წინა გვერდი">‹</button>
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <button key={page} type="button" onClick={() => setCurrentPage(page)} aria-current={page === currentPage ? "page" : undefined} aria-label={`${page} გვერდი`}>{page}</button>
                  ))}
                  <button type="button" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={currentPage === totalPages} aria-label="შემდეგი გვერდი">›</button>
                </nav>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
