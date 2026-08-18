"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Lang = "ka" | "en";

type ItemRow = {
  id?: string | number;
  item_type?: string | null;
  active?: boolean | null;
  scan_count?: number | null;
};

type SupportMessage = {
  id: number;
  sender: string;
};

type DashboardStats = {
  totalProfiles: number;
  activeProfiles: number;
  totalScans: number;
  supportMessages: number;
};

type CategoryStat = {
  key: string;
  icon: string;
  ka: string;
  en: string;
  count: number;
};

const baseCategories = [
  {
    key: "dog",
    icon: "🐕",
    ka: "ძაღლი",
    en: "Dog",
  },
  {
    key: "cat",
    icon: "🐈",
    ka: "კატა",
    en: "Cat",
  },
  {
    key: "keys",
    icon: "🔑",
    ka: "გასაღები",
    en: "Keys",
  },
  {
    key: "wallet",
    icon: "👛",
    ka: "საფულე",
    en: "Wallet",
  },
  {
    key: "bag",
    icon: "🎒",
    ka: "ჩანთა",
    en: "Bag",
  },
  {
    key: "suitcase",
    icon: "🧳",
    ka: "ჩემოდანი",
    en: "Suitcase",
  },
  {
    key: "emergency",
    icon: "🚑",
    ka: "Emergency",
    en: "Emergency",
  },
];

function normalizeItemType(value?: string | null) {
  const text = (value || "")
    .trim()
    .toLowerCase();

  if (
    text === "dog" ||
    text.includes("ძაღ")
  ) {
    return "dog";
  }

  if (
    text === "cat" ||
    text.includes("კატ")
  ) {
    return "cat";
  }

  if (
    text === "keys" ||
    text === "key" ||
    text.includes("გასაღ")
  ) {
    return "keys";
  }

  if (
    text === "wallet" ||
    text.includes("საფულ")
  ) {
    return "wallet";
  }

  if (
    text === "bag" ||
    text.includes("ჩანთ")
  ) {
    return "bag";
  }

  if (
    text === "suitcase" ||
    text === "luggage" ||
    text.includes("ჩემოდ")
  ) {
    return "suitcase";
  }

  if (
    text === "emergency" ||
    text.includes("bracelet") ||
    text.includes("სამაჯ")
  ) {
    return "emergency";
  }

  return text || "other";
}

export default function AdminDashboardPage() {
  const [lang, setLang] =
    useState<Lang>("ka");

  const [loading, setLoading] =
    useState(true);

  const [isAdmin, setIsAdmin] =
    useState(false);

  const [error, setError] =
    useState("");

  const [stats, setStats] =
    useState<DashboardStats>({
      totalProfiles: 0,
      activeProfiles: 0,
      totalScans: 0,
      supportMessages: 0,
    });

  const [items, setItems] =
    useState<ItemRow[]>([]);

  const ka = lang === "ka";

  /*
    ==========================================
    ADMIN CHECK + DASHBOARD DATA
    ==========================================
  */

  useEffect(() => {
    async function start() {
      setLoading(true);
      setError("");

      try {
        const {
          data: userData,
          error: userError,
        } =
          await supabase.auth.getUser();

        if (
          userError ||
          !userData.user
        ) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        const {
          data: adminData,
          error: adminError,
        } = await supabase
          .from("admin_users")
          .select("user_id")
          .eq(
            "user_id",
            userData.user.id
          )
          .maybeSingle();

        if (adminError) {
          throw new Error(
            adminError.message
          );
        }

        if (!adminData) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        setIsAdmin(true);

        /*
          QR PROFILES
        */

        const {
          data: itemData,
          error: itemError,
        } = await supabase
          .from("item")
          .select(`
            id,
            item_type,
            active,
            scan_count
          `);

        let loadedItems:
          ItemRow[] = [];

        if (!itemError) {
          loadedItems =
            (itemData ||
              []) as ItemRow[];

          setItems(
            loadedItems
          );
        }

        /*
          SUPPORT
        */

        const {
          data: supportData,
        } = await supabase
          .from(
            "support_messages"
          )
          .select(
            "id, sender"
          )
          .eq(
            "sender",
            "user"
          );

        const supportRows =
          (supportData ||
            []) as SupportMessage[];

        /*
          COUNTS
        */

        const totalProfiles =
          loadedItems.length;

        const activeProfiles =
          loadedItems.filter(
            (item) =>
              item.active !==
              false
          ).length;

        const totalScans =
          loadedItems.reduce(
            (total, item) =>
              total +
              Number(
                item.scan_count ||
                  0
              ),
            0
          );

        setStats({
          totalProfiles,
          activeProfiles,
          totalScans,
          supportMessages:
            supportRows.length,
        });
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : String(err);

        setError(message);
      } finally {
        setLoading(false);
      }
    }

    void start();
  }, []);

  /*
    ==========================================
    REALTIME SUPPORT COUNT
    ==========================================
  */

  useEffect(() => {
    if (!isAdmin) {
      return;
    }

    const channel = supabase
      .channel(
        "admin-control-center"
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table:
            "support_messages",
        },
        (payload) => {
          const next =
            payload.new as {
              sender?: string;
            };

          if (
            next.sender === "user"
          ) {
            setStats(
              (current) => ({
                ...current,

                supportMessages:
                  current.supportMessages +
                  1,
              })
            );
          }
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(
        channel
      );
    };
  }, [isAdmin]);

  /*
    ==========================================
    CATEGORY REGISTRATIONS
    ==========================================
  */

  const categoryStats =
    useMemo<CategoryStat[]>(
      () => {
        const counter =
          new Map<
            string,
            number
          >();

        for (const item of items) {
          const key =
            normalizeItemType(
              item.item_type
            );

          counter.set(
            key,
            (counter.get(key) ||
              0) + 1
          );
        }

        return baseCategories.map(
          (category) => ({
            ...category,

            count:
              counter.get(
                category.key
              ) || 0,
          })
        );
      },
      [items]
    );

  const topCategory =
    useMemo(() => {
      if (
        categoryStats.length ===
        0
      ) {
        return null;
      }

      return [
        ...categoryStats,
      ].sort(
        (a, b) =>
          b.count - a.count
      )[0];
    }, [categoryStats]);

  /*
    ==========================================
    LOADING
    ==========================================
  */

  if (loading) {
    return (
      <main className="statePage">
        <div className="loader" />

        <strong>
          {ka
            ? "Admin Control Center იტვირთება..."
            : "Loading Admin Control Center..."}
        </strong>

        <GlobalStyles />
      </main>
    );
  }

  /*
    ==========================================
    NO ADMIN
    ==========================================
  */

  if (!isAdmin) {
    return (
      <main className="statePage">
        <div className="lock">
          🔒
        </div>

        <h1>
          {ka
            ? "Admin წვდომაა საჭირო"
            : "Admin access required"}
        </h1>

        <p>
          {ka
            ? "ამ გვერდის მართვა მხოლოდ QR RETURN ადმინისტრატორს შეუძლია."
            : "Only a QR RETURN administrator can manage this page."}
        </p>

        <a
          href="/login"
          className="loginLink"
        >
          {ka
            ? "Admin ანგარიშით შესვლა"
            : "Sign in as Admin"}
        </a>

        <GlobalStyles />
      </main>
    );
  }

  return (
    <main className="page">
      {/* HEADER */}

      <header className="header">
        <a
          href="/"
          className="brand"
        >
          <div className="logo">
            QR
          </div>

          <div>
            <strong>
              QR RETURN
            </strong>

            <small>
              ADMIN CONTROL CENTER
            </small>
          </div>
        </a>

        <div className="headerRight">
          <a
            href="/"
            className="websiteButton"
          >
            🌐{" "}
            {ka
              ? "საიტი"
              : "Website"}
          </a>

          <div className="languages">
            <button
              type="button"
              className={
                ka
                  ? "active"
                  : ""
              }
              onClick={() =>
                setLang("ka")
              }
            >
              GEO
            </button>

            <button
              type="button"
              className={
                !ka
                  ? "active"
                  : ""
              }
              onClick={() =>
                setLang("en")
              }
            >
              ENG
            </button>
          </div>
        </div>
      </header>

      <section className="dashboard">
        {/* INTRO */}

        <div className="intro">
          <div>
            <span className="eyebrow">
              QR RETURN
            </span>

            <h1>
              Admin Control Center
            </h1>

            <p>
              {ka
                ? "მართეთ თქვენი პლატფორმა, QR პროფილები, ფორმები, Support და საიტის კონტენტი ერთი ადგილიდან."
                : "Manage your platform, QR profiles, forms, Support and website content from one place."}
            </p>
          </div>

          <div className="adminStatus">
            <i />

            {ka
              ? "Admin აქტიურია"
              : "Admin active"}
          </div>
        </div>

        {error && (
          <div className="errorBox">
            ⚠ {error}
          </div>
        )}

        {/* TOP STATISTICS */}

        <div className="statsGrid">
          <div className="stat">
            <span>
              🏷️
            </span>

            <strong>
              {
                stats.totalProfiles
              }
            </strong>

            <small>
              {ka
                ? "QR პროფილი"
                : "QR Profiles"}
            </small>
          </div>

          <div className="stat">
            <span>
              ✅
            </span>

            <strong>
              {
                stats.activeProfiles
              }
            </strong>

            <small>
              {ka
                ? "აქტიური"
                : "Active"}
            </small>
          </div>

          <div className="stat">
            <span>
              📱
            </span>

            <strong>
              {
                stats.totalScans
              }
            </strong>

            <small>
              {ka
                ? "QR Scan"
                : "QR Scans"}
            </small>
          </div>

          <div className="stat important">
            <span>
              💬
            </span>

            <strong>
              {
                stats.supportMessages
              }
            </strong>

            <small>
              {ka
                ? "Support შეტყობინება"
                : "Support Messages"}
            </small>
          </div>
        </div>

        {/* MAIN MANAGEMENT */}

        <SectionTitle
          ka={ka}
          icon="⚡"
          titleKa="ძირითადი მართვა"
          titleEn="Core Management"
        />

        <div className="managementGrid">
          <AdminCard
            href="/admin/support"
            icon="💬"
            title="Support Inbox"
            text={
              ka
                ? "ყველა მომხმარებლის Live Chat, პასუხები, ფოტოები და ფაილები."
                : "Customer Live Chat, replies, photos and files."
            }
            badge={
              stats.supportMessages
            }
            featured
          />

          <AdminCard
            href="/admin/search"
            icon="🔎"
            title={
              ka
                ? "QR ძებნა"
                : "QR Search"
            }
            text={
              ka
                ? "მოძებნეთ ნებისმიერი პროფილი QR კოდით ან Tag Code-ით."
                : "Find any profile using its QR or Tag Code."
            }
          />

          <AdminCard
            href="/admin/users"
            icon="👥"
            title={
              ka
                ? "მომხმარებლები"
                : "Users"
            }
            text={
              ka
                ? "ანგარიშები, დაკავშირებული პროფილები და მომხმარებლის ინფორმაცია."
                : "Accounts, linked profiles and user information."
            }
          />

          <AdminCard
            href="/admin/items"
            icon="🏷️"
            title={
              ka
                ? "QR პროფილები"
                : "QR Profiles"
            }
            text={
              ka
                ? "ძაღლი, კატა, ნივთები და Emergency პროფილები."
                : "Pets, items and Emergency profiles."
            }
          />

          <AdminCard
            href="/admin/lost-found"
            icon="📍"
            title="Lost & Found"
            text={
              ka
                ? "დაკარგულად მონიშნული პროფილები და მიმდინარე შემთხვევები."
                : "Lost profiles and active recovery cases."
            }
          />

          <AdminCard
            href="/admin/notifications"
            icon="🔔"
            title={
              ka
                ? "შეტყობინებები"
                : "Notifications"
            }
            text={
              ka
                ? "Support, QR Scan და სისტემური შეტყობინებების მართვა."
                : "Manage Support, QR scan and system notifications."
            }
          />
        </div>

        {/* CONTENT CONTROL */}

        <SectionTitle
          ka={ka}
          icon="🛠️"
          titleKa="საიტისა და ფორმების მართვა"
          titleEn="Website & Forms"
        />

        <div className="managementGrid">
          <AdminCard
            href="/admin/forms"
            icon="📝"
            title={
              ka
                ? "Registration Forms"
                : "Registration Forms"
            }
            text={
              ka
                ? "ველების დამატება, დამალვა, Required/Optional, ტექსტები და თანმიმდევრობა."
                : "Add fields, hide fields, required settings, labels and ordering."
            }
            featured
          />

          <AdminCard
            href="/admin/website"
            icon="🎨"
            title={
              ka
                ? "Website Editor"
                : "Website Editor"
            }
            text={
              ka
                ? "მთავარი გვერდის ტექსტები, სექციები, ღილაკები და კონტენტი."
                : "Homepage text, sections, buttons and content."
            }
          />

          <AdminCard
            href="/admin/media"
            icon="🖼️"
            title={
              ka
                ? "Media"
                : "Media"
            }
            text={
              ka
                ? "ფოტოების, ილუსტრაციების და სხვა მედიის მართვა."
                : "Manage photos, illustrations and other media."
            }
          />

          <AdminCard
            href="/admin/contact"
            icon="☎️"
            title={
              ka
                ? "Contact Settings"
                : "Contact Settings"
            }
            text={
              ka
                ? "Support email, ტელეფონი და სხვა საკონტაქტო მონაცემები."
                : "Support email, phone number and contact information."
            }
          />

          <AdminCard
            href="/admin/chat-settings"
            icon="👩‍💻"
            title={
              ka
                ? "Live Chat Settings"
                : "Live Chat Settings"
            }
            text={
              ka
                ? "ავტომატური პასუხი, Support ტექსტები და Chat პარამეტრები."
                : "Automatic replies, Support text and Chat settings."
            }
          />

          <AdminCard
            href="/admin/system"
            icon="⚙️"
            title={
              ka
                ? "System Settings"
                : "System Settings"
            }
            text={
              ka
                ? "QR RETURN-ის საერთო სისტემური პარამეტრები."
                : "General QR RETURN platform settings."
            }
          />
        </div>

        {/* REGISTRATIONS */}

        <SectionTitle
          ka={ka}
          icon="📊"
          titleKa="რეგისტრაციები კატეგორიების მიხედვით"
          titleEn="Registrations by Category"
        />

        <section className="registrationsPanel">
          <div className="registrationHeader">
            <div>
              <strong>
                {ka
                  ? "სულ რეგისტრირებული"
                  : "Total registrations"}
              </strong>

              <span>
                {
                  stats.totalProfiles
                }
              </span>
            </div>

            {topCategory &&
              topCategory.count >
                0 && (
                <div className="popular">
                  ⭐{" "}
                  {ka
                    ? "ყველაზე პოპულარული:"
                    : "Most popular:"}{" "}
                  <b>
                    {
                      topCategory.icon
                    }{" "}
                    {ka
                      ? topCategory.ka
                      : topCategory.en}
                  </b>
                </div>
              )}
          </div>

          <div className="categoryStats">
            {categoryStats.map(
              (category) => (
                <a
                  href={`/admin/items?type=${category.key}`}
                  className="categoryStat"
                  key={
                    category.key
                  }
                >
                  <div className="categoryIcon">
                    {
                      category.icon
                    }
                  </div>

                  <div>
                    <strong>
                      {ka
                        ? category.ka
                        : category.en}
                    </strong>

                    <span>
                      {
                        category.count
                      }
                    </span>
                  </div>
                </a>
              )
            )}
          </div>

          <a
            href="/admin/analytics"
            className="analyticsLink"
          >
            📈{" "}
            {ka
              ? "სრული Analytics-ის ნახვა"
              : "Open full Analytics"}{" "}
            →
          </a>
        </section>

        {/* BUSINESS / ANALYTICS */}

        <SectionTitle
          ka={ka}
          icon="📈"
          titleKa="ანალიტიკა და სისტემა"
          titleEn="Analytics & System"
        />

        <div className="managementGrid">
          <AdminCard
            href="/admin/analytics"
            icon="📊"
            title="Analytics"
            text={
              ka
                ? "რეგისტრაციები, QR Scan-ები, კატეგორიები და ზრდის სტატისტიკა."
                : "Registrations, QR scans, categories and growth statistics."
            }
          />

          <AdminCard
            href="/admin/activity"
            icon="🕒"
            title={
              ka
                ? "Activity Log"
                : "Activity Log"
            }
            text={
              ka
                ? "Admin ცვლილებებისა და მნიშვნელოვანი სისტემური მოქმედებების ისტორია."
                : "History of Admin changes and important system actions."
            }
          />

          <AdminCard
            href="/admin/admins"
            icon="🛡️"
            title={
              ka
                ? "Admin Accounts"
                : "Admin Accounts"
            }
            text={
              ka
                ? "Admin მომხმარებლების და მათი უფლებების მართვა."
                : "Manage administrator accounts and permissions."
            }
          />

          <AdminCard
            href="/admin/security"
            icon="🔐"
            title={
              ka
                ? "Security"
                : "Security"
            }
            text={
              ka
                ? "წვდომები, უსაფრთხოების პარამეტრები და დაცული ფუნქციები."
                : "Access rules, security settings and protected features."
            }
          />

          <AdminCard
            href="/admin/backup"
            icon="☁️"
            title={
              ka
                ? "Backup & Export"
                : "Backup & Export"
            }
            text={
              ka
                ? "მონაცემების ექსპორტი და სარეზერვო მართვა."
                : "Data export and backup management."
            }
          />

          <AdminCard
            href="/admin/help"
            icon="❓"
            title={
              ka
                ? "Admin Help"
                : "Admin Help"
            }
            text={
              ka
                ? "Admin პანელის გამოყენების ინსტრუქცია."
                : "Instructions for using the Admin panel."
            }
          />
        </div>

        <footer className="dashboardFooter">
          <a href="/">
            ←{" "}
            {ka
              ? "QR RETURN-ზე დაბრუნება"
              : "Back to QR RETURN"}
          </a>

          <span>
            QR RETURN • Admin Control Center
          </span>
        </footer>
      </section>

      <GlobalStyles />
    </main>
  );
}

/*
  ==========================================
  CARD
  ==========================================
*/

function AdminCard({
  href,
  icon,
  title,
  text,
  badge,
  featured = false,
}: {
  href: string;
  icon: string;
  title: string;
  text: string;
  badge?: number;
  featured?: boolean;
}) {
  return (
    <a
      href={href}
      className={
        featured
          ? "adminCard featured"
          : "adminCard"
      }
    >
      <div className="adminCardTop">
        <div className="adminCardIcon">
          {icon}
        </div>

        {Boolean(badge) && (
          <div className="cardBadge">
            {badge}
          </div>
        )}
      </div>

      <h3>
        {title}
      </h3>

      <p>
        {text}
      </p>

      <span className="cardOpen">
        Open →
      </span>
    </a>
  );
}

/*
  ==========================================
  SECTION TITLE
  ==========================================
*/

function SectionTitle({
  ka,
  icon,
  titleKa,
  titleEn,
}: {
  ka: boolean;
  icon: string;
  titleKa: string;
  titleEn: string;
}) {
  return (
    <div className="sectionTitle">
      <span>
        {icon}
      </span>

      <h2>
        {ka
          ? titleKa
          : titleEn}
      </h2>
    </div>
  );
}

/*
  ==========================================
  CSS
  ==========================================
*/

function GlobalStyles() {
  return (
    <style jsx global>{`
      * {
        box-sizing:
          border-box;
      }

      html,
      body {
        margin: 0;
        padding: 0;
      }

      body {
        background:
          #f4f6fa;
      }

      button {
        font: inherit;
      }

      .page {
        min-height: 100vh;

        color: #101828;

        font-family:
          Inter,
          -apple-system,
          BlinkMacSystemFont,
          "Segoe UI",
          Arial,
          sans-serif;

        background:
          radial-gradient(
            circle at 98% 0%,
            rgba(
              111,
              81,
              244,
              0.12
            ),
            transparent 28%
          ),
          #f4f6fa;
      }

      /*
        HEADER
      */

      .header {
        width:
          calc(
            100% - 32px
          );

        max-width:
          1220px;

        min-height: 80px;

        margin: auto;

        display: flex;

        align-items:
          center;

        justify-content:
          space-between;

        gap: 20px;

        border-bottom:
          1px solid
          #e4e7ec;
      }

      .brand {
        display: flex;

        align-items:
          center;

        gap: 11px;

        text-decoration:
          none;
      }

      .logo {
        width: 46px;
        height: 46px;

        display: grid;

        place-items:
          center;

        border-radius:
          14px;

        background:
          linear-gradient(
            135deg,
            #1465e8,
            #7655f7
          );

        color: white;

        font-size: 12px;

        font-weight: 900;

        box-shadow:
          0 10px 24px
          rgba(
            64,
            74,
            220,
            0.2
          );
      }

      .brand strong,
      .brand small {
        display: block;
      }

      .brand strong {
        color:
          #1465e8;

        font-size:
          19px;

        font-weight: 950;
      }

      .brand small {
        margin-top: 3px;

        color:
          #7655f7;

        font-size: 8px;

        font-weight: 900;

        letter-spacing:
          1.8px;
      }

      .headerRight {
        display: flex;

        align-items:
          center;

        gap: 10px;
      }

      .websiteButton {
        padding:
          9px 12px;

        border:
          1px solid
          #e4e7ec;

        border-radius:
          9px;

        background:
          white;

        color:
          #475467;

        font-size: 10px;

        font-weight: 850;

        text-decoration:
          none;
      }

      .languages {
        padding: 4px;

        display: flex;

        border-radius:
          9px;

        background:
          #e9ecf2;
      }

      .languages button {
        padding:
          7px 9px;

        border: 0;

        border-radius:
          7px;

        background:
          transparent;

        color:
          #667085;

        font-size: 9px;

        font-weight: 900;

        cursor: pointer;
      }

      .languages
        button.active {
        background:
          white;

        color:
          #1465e8;
      }

      /*
        DASHBOARD
      */

      .dashboard {
        width:
          calc(
            100% - 32px
          );

        max-width:
          1120px;

        margin: auto;

        padding:
          52px 0 85px;
      }

      .intro {
        display: flex;

        align-items:
          flex-end;

        justify-content:
          space-between;

        gap: 30px;
      }

      .intro > div:first-child {
        max-width:
          760px;
      }

      .eyebrow {
        color:
          #7655f7;

        font-size:
          10px;

        font-weight:
          950;

        letter-spacing:
          2px;
      }

      .intro h1 {
        margin:
          9px 0 10px;

        font-size:
          clamp(
            38px,
            5vw,
            56px
          );

        line-height: 1;

        letter-spacing:
          -2.5px;
      }

      .intro p {
        margin: 0;

        color:
          #667085;

        font-size:
          14px;

        line-height:
          1.65;
      }

      .adminStatus {
        flex:
          0 0 auto;

        padding:
          9px 12px;

        border:
          1px solid
          #abefc6;

        border-radius:
          9px;

        background:
          #ecfdf3;

        color:
          #067647;

        font-size:
          9px;

        font-weight:
          850;
      }

      .adminStatus i {
        width: 7px;
        height: 7px;

        margin-right:
          5px;

        display:
          inline-block;

        border-radius:
          50%;

        background:
          #12b76a;
      }

      /*
        STATS
      */

      .statsGrid {
        margin-top:
          34px;

        display: grid;

        grid-template-columns:
          repeat(
            4,
            1fr
          );

        gap: 12px;
      }

      .stat {
        min-height:
          120px;

        padding: 18px;

        border:
          1px solid
          #e4e7ec;

        border-radius:
          16px;

        background:
          white;

        box-shadow:
          0 8px 28px
          rgba(
            16,
            24,
            40,
            0.035
          );
      }

      .stat.important {
        border-color:
          #d9d6fe;

        background:
          linear-gradient(
            135deg,
            #ffffff,
            #f5f3ff
          );
      }

      .stat > span {
        display: block;

        font-size:
          20px;
      }

      .stat strong {
        margin-top:
          10px;

        display: block;

        color:
          #101828;

        font-size:
          28px;

        letter-spacing:
          -1px;
      }

      .stat small {
        margin-top:
          2px;

        display: block;

        color:
          #667085;

        font-size:
          9px;

        font-weight:
          750;
      }

      /*
        SECTION
      */

      .sectionTitle {
        margin-top:
          48px;

        padding-bottom:
          12px;

        display: flex;

        align-items:
          center;

        gap: 8px;

        border-bottom:
          1px solid
          #e4e7ec;
      }

      .sectionTitle > span {
        font-size:
          18px;
      }

      .sectionTitle h2 {
        margin: 0;

        color:
          #344054;

        font-size:
          17px;

        letter-spacing:
          -0.3px;
      }

      /*
        CARDS
      */

      .managementGrid {
        margin-top:
          15px;

        display: grid;

        grid-template-columns:
          repeat(
            3,
            1fr
          );

        gap: 13px;
      }

      .adminCard {
        min-height:
          205px;

        padding: 20px;

        display: flex;

        flex-direction:
          column;

        border:
          1px solid
          #e4e7ec;

        border-radius:
          18px;

        background:
          white;

        color:
          inherit;

        text-decoration:
          none;

        box-shadow:
          0 9px 30px
          rgba(
            16,
            24,
            40,
            0.035
          );

        transition:
          transform
            0.18s ease,
          box-shadow
            0.18s ease,
          border-color
            0.18s ease;
      }

      .adminCard:hover {
        transform:
          translateY(
            -3px
          );

        border-color:
          #c9d7ef;

        box-shadow:
          0 16px 38px
          rgba(
            16,
            24,
            40,
            0.08
          );
      }

      .adminCard.featured {
        border-color:
          #d9d6fe;

        background:
          linear-gradient(
            135deg,
            #ffffff,
            #f6f4ff
          );
      }

      .adminCardTop {
        display: flex;

        align-items:
          flex-start;

        justify-content:
          space-between;
      }

      .adminCardIcon {
        width: 49px;
        height: 49px;

        display: grid;

        place-items:
          center;

        border-radius:
          14px;

        background:
          #eef4ff;

        font-size:
          23px;
      }

      .featured
        .adminCardIcon {
        background:
          linear-gradient(
            135deg,
            #e7efff,
            #eeeaff
          );
      }

      .cardBadge {
        min-width:
          27px;

        height: 27px;

        padding:
          0 7px;

        display: grid;

        place-items:
          center;

        border-radius:
          20px;

        background:
          #d92d20;

        color: white;

        font-size:
          9px;

        font-weight:
          900;
      }

      .adminCard h3 {
        margin:
          17px 0 7px;

        color:
          #344054;

        font-size:
          16px;
      }

      .adminCard p {
        flex: 1;

        margin: 0;

        color:
          #667085;

        font-size:
          10px;

        line-height:
          1.55;
      }

      .cardOpen {
        margin-top:
          17px;

        color:
          #1465e8;

        font-size:
          9px;

        font-weight:
          900;
      }

      /*
        REGISTRATION ANALYTICS
      */

      .registrationsPanel {
        margin-top:
          15px;

        padding: 22px;

        border:
          1px solid
          #e4e7ec;

        border-radius:
          18px;

        background:
          white;

        box-shadow:
          0 9px 30px
          rgba(
            16,
            24,
            40,
            0.035
          );
      }

      .registrationHeader {
        display: flex;

        align-items:
          center;

        justify-content:
          space-between;

        gap: 20px;
      }

      .registrationHeader
        > div:first-child
        strong {
        display: block;

        color:
          #667085;

        font-size:
          9px;

        text-transform:
          uppercase;

        letter-spacing:
          1px;
      }

      .registrationHeader
        > div:first-child
        span {
        margin-top:
          4px;

        display: block;

        color:
          #101828;

        font-size:
          30px;

        font-weight:
          950;
      }

      .popular {
        padding:
          9px 12px;

        border-radius:
          9px;

        background:
          #fffaeb;

        color:
          #93370d;

        font-size:
          9px;
      }

      .categoryStats {
        margin-top:
          20px;

        display: grid;

        grid-template-columns:
          repeat(
            7,
            1fr
          );

        gap: 8px;
      }

      .categoryStat {
        padding:
          13px 8px;

        display: flex;

        flex-direction:
          column;

        align-items:
          center;

        gap: 7px;

        border:
          1px solid
          #eaecf0;

        border-radius:
          12px;

        background:
          #fafbfc;

        color:
          inherit;

        text-align:
          center;

        text-decoration:
          none;
      }

      .categoryStat:hover {
        border-color:
          #b8cff3;

        background:
          #f4f8ff;
      }

      .categoryIcon {
        font-size:
          24px;
      }

      .categoryStat strong,
      .categoryStat span {
        display: block;
      }

      .categoryStat strong {
        color:
          #475467;

        font-size:
          8px;
      }

      .categoryStat span {
        margin-top:
          3px;

        color:
          #1465e8;

        font-size:
          16px;

        font-weight:
          950;
      }

      .analyticsLink {
        margin-top:
          18px;

        display:
          inline-block;

        color:
          #1465e8;

        font-size:
          9px;

        font-weight:
          900;

        text-decoration:
          none;
      }

      /*
        FOOTER
      */

      .dashboardFooter {
        margin-top:
          55px;

        padding-top:
          22px;

        display: flex;

        align-items:
          center;

        justify-content:
          space-between;

        gap: 20px;

        border-top:
          1px solid
          #dfe3ea;

        color:
          #98a2b3;

        font-size:
          9px;
      }

      .dashboardFooter a {
        color:
          #1465e8;

        font-weight:
          850;

        text-decoration:
          none;
      }

      /*
        ERROR
      */

      .errorBox {
        margin-top:
          20px;

        padding: 11px;

        border:
          1px solid
          #fecdca;

        border-radius:
          9px;

        background:
          #fff1f0;

        color:
          #b42318;

        font-size:
          9px;
      }

      /*
        STATE
      */

      .statePage {
        min-height:
          100vh;

        padding: 30px;

        display: flex;

        flex-direction:
          column;

        align-items:
          center;

        justify-content:
          center;

        background:
          #f4f6fa;

        color:
          #344054;

        font-family:
          Inter,
          Arial,
          sans-serif;

        text-align:
          center;
      }

      .statePage h1 {
        margin:
          12px 0 7px;
      }

      .statePage p {
        max-width:
          420px;

        color:
          #667085;

        font-size:
          11px;

        line-height:
          1.55;
      }

      .loginLink {
        margin-top:
          11px;

        padding:
          10px 15px;

        border-radius:
          9px;

        background:
          #1465e8;

        color:
          white;

        font-size:
          10px;

        font-weight:
          900;

        text-decoration:
          none;
      }

      .lock {
        font-size:
          42px;
      }

      .loader {
        width: 36px;
        height: 36px;

        margin-bottom:
          11px;

        border:
          3px solid
          #e4e7ec;

        border-top-color:
          #1465e8;

        border-radius:
          50%;

        animation:
          spin 0.8s
          linear infinite;
      }

      @keyframes spin {
        to {
          transform:
            rotate(
              360deg
            );
        }
      }

      /*
        TABLET
      */

      @media (
        max-width:
          900px
      ) {
        .statsGrid {
          grid-template-columns:
            repeat(
              2,
              1fr
            );
        }

        .managementGrid {
          grid-template-columns:
            repeat(
              2,
              1fr
            );
        }

        .categoryStats {
          grid-template-columns:
            repeat(
              4,
              1fr
            );
        }
      }

      /*
        MOBILE
      */

      @media (
        max-width:
          600px
      ) {
        .header {
          min-height:
            72px;
        }

        .brand small {
          display:
            none;
        }

        .websiteButton {
          display:
            none;
        }

        .dashboard {
          padding-top:
            35px;
        }

        .intro {
          display:
            block;
        }

        .adminStatus {
          margin-top:
            15px;

          display:
            inline-block;
        }

        .intro h1 {
          font-size:
            38px;

          letter-spacing:
            -2px;
        }

        .statsGrid {
          grid-template-columns:
            repeat(
              2,
              1fr
            );
        }

        .managementGrid {
          grid-template-columns:
            1fr;
        }

        .categoryStats {
          grid-template-columns:
            repeat(
              2,
              1fr
            );
        }

        .registrationHeader {
          display:
            block;
        }

        .popular {
          margin-top:
            12px;

          display:
            inline-block;
        }

        .dashboardFooter {
          flex-direction:
            column;

          align-items:
            flex-start;
        }
      }
    `}</style>
  );
}
