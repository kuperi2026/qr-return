"use client";

import AdminSection, {
  type AdminSectionItem,
} from "./AdminSection";

type Props = {
  supportCount?: number;
  totalProfiles?: number;
  activeProfiles?: number;
  scanCount?: number;
  totalUsers?: number;
  totalOrders?: number;
};

export default function AdminDashboard({
  supportCount = 0,
  totalProfiles = 0,
  activeProfiles = 0,
  scanCount = 0,
  totalUsers = 0,
  totalOrders = 0,
}: Props) {
  const coreItems: AdminSectionItem[] = [
    {
      href: "/admin/support",
      title: "Support Inbox",
      description:
        "ყველა მომხმარებლის Live Chat, Support შეტყობინებები, ფოტოები და ფაილები.",
      icon: "💬",
      badge: supportCount,
    },
    {
      href: "/admin/search",
      title: "QR ძებნა",
      description:
        "მოძებნეთ ნებისმიერი QR პროფილი QR კოდით ან Tag Code-ით.",
      icon: "🔎",
    },
    {
      href: "/admin/users",
      title: "მომხმარებლები",
      description:
        "ანგარიშები, დაკავშირებული QR პროფილები და მომხმარებლის ინფორმაცია.",
      icon: "👥",
      badge: totalUsers,
    },
    {
      href: "/admin/items",
      title: "QR პროფილები",
      description:
        "ძაღლი, კატა, გასაღები, საფულე, ჩანთა, ჩემოდანი და სხვა QR პროფილები.",
      icon: "🏷️",
      badge: totalProfiles,
    },
    {
      href: "/admin/return-cases",
      title: "Return Cases",
      description:
        "დაკარგულად მონიშნული QR პროფილები და მიმდინარე დაბრუნების პროცესები.",
      icon: "📍",
    },
    {
      href: "/admin/orders",
      title: "Orders",
      description:
        "პროდუქტის შეკვეთები, მომხმარებლის ინფორმაცია, მისამართი, სტატუსი და Tracking.",
      icon: "🛒",
      badge: totalOrders,
    },
    {
      href: "/admin/notifications",
      title: "შეტყობინებები",
      description:
        "QR Scan, Support, Location, Order და სისტემური შეტყობინებების მართვა.",
      icon: "🔔",
    },
  ];

  const websiteItems: AdminSectionItem[] = [
    {
      href: "/admin/forms",
      title: "Registration Forms",
      description:
        "სარეგისტრაციო ფორმების ველები, Required / Optional პარამეტრები და თანმიმდევრობა.",
      icon: "📝",
    },
    {
      href: "/admin/website",
      title: "Website Editor",
      description:
        "მთავარი გვერდის ტექსტები, სექციები, ღილაკები და სხვა კონტენტი.",
      icon: "🎨",
    },
    {
      href: "/admin/media",
      title: "Media",
      description:
        "პროდუქტის ფოტოების, ილუსტრაციების და სხვა მედიის მართვა.",
      icon: "🖼️",
    },
    {
      href: "/admin/contact",
      title: "Contact Settings",
      description:
        "QR RETURN-ის ტელეფონი, Email, WhatsApp და სხვა საკონტაქტო ინფორმაცია.",
      icon: "☎️",
    },
    {
      href: "/admin/chat-settings",
      title: "Live Chat Settings",
      description:
        "Live Chat, Support ტექსტები, ავტომატური პასუხები და Chat პარამეტრები.",
      icon: "💬",
    },
    {
      href: "/admin/system",
      title: "System Settings",
      description:
        "QR RETURN-ის საერთო სისტემური პარამეტრები.",
      icon: "⚙️",
    },
  ];

  const analyticsItems: AdminSectionItem[] = [
    {
      href: "/admin/analytics",
      title: "Analytics",
      description:
        "რეგისტრაციები, QR Scan-ები, კატეგორიები, Orders და ზრდის სტატისტიკა.",
      icon: "📊",
    },
    {
      href: "/admin/activity",
      title: "Activity Log",
      description:
        "Admin ცვლილებებისა და მნიშვნელოვანი სისტემური მოქმედებების ისტორია.",
      icon: "🕒",
    },
    {
      href: "/admin/admins",
      title: "Admin Accounts",
      description:
        "Admin მომხმარებლები, როლები და მათი უფლებების მართვა.",
      icon: "🛡️",
    },
    {
      href: "/admin/security",
      title: "Security",
      description:
        "წვდომები, უსაფრთხოების პარამეტრები და დაცული ფუნქციები.",
      icon: "🔐",
    },
    {
      href: "/admin/backup",
      title: "Backup & Export",
      description:
        "QR RETURN მონაცემების ექსპორტი და სარეზერვო მართვა.",
      icon: "☁️",
    },
    {
      href: "/admin/help",
      title: "Admin Help",
      description:
        "Admin Control Center-ის გამოყენების ინსტრუქცია.",
      icon: "❓",
    },
  ];

  return (
    <main className="dashboard">
      <div className="shell">
        <header className="header">
          <div>
            <span className="eyebrow">
              QR RETURN ADMIN
            </span>

            <h1>Admin Control Center</h1>

            <p>
              მართეთ QR RETURN-ის მომხმარებლები,
              QR პროფილები, Return Cases, Support,
              Orders, კონტენტი და სისტემური პარამეტრები.
            </p>
          </div>

          <a href="/">
            ← QR RETURN-ზე დაბრუნება
          </a>
        </header>

        <section className="stats">
          <StatCard
            label="QR პროფილი"
            value={totalProfiles}
            icon="🏷️"
          />

          <StatCard
            label="აქტიური"
            value={activeProfiles}
            icon="✅"
          />

          <StatCard
            label="QR Scan"
            value={scanCount}
            icon="📱"
          />

          <StatCard
            label="Support"
            value={supportCount}
            icon="💬"
          />

          <StatCard
            label="Orders"
            value={totalOrders}
            icon="🛒"
          />
        </section>

        <div className="sections">
          <AdminSection
            eyebrow="CORE MANAGEMENT"
            title="ძირითადი მართვა"
            description="QR RETURN-ის ყოველდღიური ოპერაციების ძირითადი ფუნქციები."
            items={coreItems}
          />

          <AdminSection
            eyebrow="WEBSITE & CONTENT"
            title="საიტისა და ფორმების მართვა"
            description="მთავარი გვერდი, ფორმები, ფოტოები, Contact და Live Chat პარამეტრები."
            items={websiteItems}
          />

          <AdminSection
            eyebrow="SYSTEM & ANALYTICS"
            title="ანალიტიკა და სისტემა"
            description="სტატისტიკა, უსაფრთხოება, Admin Accounts და სისტემური მართვა."
            items={analyticsItems}
          />
        </div>
      </div>

      <style jsx>{`
        .dashboard {
          min-height: 100vh;
          padding: 54px 0 90px;
          background: #f5f7f8;
        }

        .shell {
          width: calc(100% - 40px);
          max-width: 1180px;
          margin: 0 auto;
        }

        .header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 30px;
        }

        .eyebrow {
          color: #c84a50;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        h1 {
          margin: 8px 0 0;
          color: #202b37;
          font-size: clamp(35px, 4vw, 48px);
          font-weight: 760;
          letter-spacing: -2px;
        }

        .header p {
          max-width: 680px;
          margin: 10px 0 0;
          color: #7b8691;
          font-size: 10px;
          line-height: 1.7;
        }

        .header a {
          flex: 0 0 auto;
          color: #5f6b77;
          font-size: 9px;
          font-weight: 800;
          text-decoration: none;
        }

        .stats {
          margin-top: 34px;
          display: grid;
          grid-template-columns:
            repeat(5, minmax(0, 1fr));
          gap: 10px;
        }

        .sections {
          margin-top: 42px;
          display: grid;
          gap: 46px;
        }

        @media (max-width: 950px) {
          .stats {
            grid-template-columns:
              repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 650px) {
          .dashboard {
            padding-top: 35px;
          }

          .shell {
            width: calc(100% - 24px);
          }

          .header {
            align-items: flex-start;
            flex-direction: column;
          }

          .stats {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>
    </main>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: string;
}) {
  return (
    <div className="card">
      <div className="top">
        <span className="icon">
          {icon}
        </span>

        <span className="label">
          {label}
        </span>
      </div>

      <strong>{value}</strong>

      <style jsx>{`
        .card {
          min-height: 105px;
          padding: 15px;
          border: 1px solid #e0e5e8;
          border-radius: 13px;
          background: white;
        }

        .top {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .icon {
          font-size: 15px;
        }

        .label {
          color: #89949e;
          font-size: 7px;
          font-weight: 900;
        }

        strong {
          display: block;
          margin-top: 18px;
          color: #293540;
          font-size: 24px;
          font-weight: 800;
        }
      `}</style>
    </div>
  );
}
