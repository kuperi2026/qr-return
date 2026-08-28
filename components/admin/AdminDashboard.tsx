"use client";

import AdminSection, {
  type AdminSectionItem,
} from "./AdminSection";
import AdminIcon from "./AdminIcon";
import type { ReactNode } from "react";

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
      icon: <AdminIcon name="support" />,
      tone: "rose",
      badge: supportCount,
    },
    {
      href: "/admin/search",
      title: "გლობალური ძებნა",
      description:
        "მოძებნეთ მომხმარებლები, QR პროფილები, შეკვეთები და სხვა ჩანაწერები.",
      icon: <AdminIcon name="search" />,
      tone: "cyan",
    },
    {
      href: "/admin/qr-search",
      title: "QR ძებნა",
      description:
        "მოძებნეთ კონკრეტული QR პროფილი QR კოდით ან Tag Code-ით.",
      icon: <AdminIcon name="qr" />,
      tone: "violet",
    },
    {
      href: "/admin/users",
      title: "მომხმარებლები",
      description:
        "ანგარიშები, დაკავშირებული QR პროფილები და მომხმარებლის ინფორმაცია.",
      icon: <AdminIcon name="users" />,
      tone: "blue",
      badge: totalUsers,
    },
    {
      href: "/admin/items",
      title: "QR პროფილები",
      description:
        "ძაღლი, კატა, გასაღები, საფულე, ჩანთა, ჩემოდანი და სხვა QR პროფილები.",
      icon: <AdminIcon name="profiles" />,
      tone: "emerald",
      badge: totalProfiles,
    },
    {
      href: "/admin/return-cases",
      title: "Return Cases",
      description:
        "დაკარგულად მონიშნული QR პროფილები და მიმდინარე დაბრუნების პროცესები.",
      icon: <AdminIcon name="location" />,
      tone: "amber",
    },
    {
      href: "/admin/orders",
      title: "Orders",
      description:
        "პროდუქტის შეკვეთები, მომხმარებლის ინფორმაცია, მისამართი, სტატუსი და Tracking.",
      icon: <AdminIcon name="orders" />,
      tone: "violet",
      badge: totalOrders,
    },
    {
      href: "/admin/notifications",
      title: "შეტყობინებები",
      description:
        "QR Scan, Support, Location, Order და სისტემური შეტყობინებების მართვა.",
      icon: <AdminIcon name="notifications" />,
      tone: "rose",
    },
  ];

  const websiteItems: AdminSectionItem[] = [
    {
      href: "/admin/chat",
      title: "Admin Live Chat",
      description:
        "მომხმარებლებთან მიმდინარე Live Chat საუბრების ნახვა და პასუხების გაგზავნა.",
      icon: <AdminIcon name="chat" />,
      tone: "cyan",
    },
    {
      href: "/admin/forms",
      title: "Registration Forms",
      description:
        "სარეგისტრაციო ფორმების ველები, Required / Optional პარამეტრები და თანმიმდევრობა.",
      icon: <AdminIcon name="forms" />,
      tone: "blue",
    },
    {
      href: "/admin/website",
      title: "Website Editor",
      description:
        "მთავარი გვერდის ტექსტები, სექციები, ღილაკები და სხვა კონტენტი.",
      icon: <AdminIcon name="website" />,
      tone: "violet",
    },
    {
      href: "/admin/contact",
      title: "Contact Settings",
      description:
        "QR RETURN-ის ტელეფონი, Email და სხვა საკონტაქტო ინფორმაცია.",
      icon: <AdminIcon name="contact" />,
      tone: "emerald",
    },
    {
      href: "/admin/chat-settings",
      title: "Live Chat Settings",
      description:
        "Live Chat, Support ტექსტები, ავტომატური პასუხები და Chat პარამეტრები.",
      icon: <AdminIcon name="settings" />,
      tone: "amber",
    },
  ];


  return (
    <main className="dashboard">
      <div className="shell">
        <header className="header">
          <div className="headingGroup">
            <div className="brandMark" aria-hidden="true">
              <AdminIcon name="qr" />
            </div>

            <div className="titleBlock">
            <span className="eyebrow">
              QR RETURN ADMIN
            </span>

            <h1>Admin Control Center</h1>

            <p>
              მართეთ QR RETURN-ის მომხმარებლები,
              QR პროფილები, Return Cases, Support,
              Orders, Live Chat, ფორმები და საიტის კონტენტი.
            </p>
            </div>
          </div>

          <a href="/">
            ← QR RETURN-ზე დაბრუნება
          </a>
        </header>

        <section className="stats">
          <StatCard
            label="QR პროფილი"
            value={totalProfiles}
            icon={<AdminIcon name="profiles" />}
          />

          <StatCard
            label="აქტიური"
            value={activeProfiles}
            icon={<AdminIcon name="profiles" />}
          />

          <StatCard
            label="QR Scan"
            value={scanCount}
            icon={<AdminIcon name="qr" />}
          />

          <StatCard
            label="Support"
            value={supportCount}
            icon={<AdminIcon name="support" />}
          />

          <StatCard
            label="Orders"
            value={totalOrders}
            icon={<AdminIcon name="orders" />}
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
            description="მთავარი გვერდი, ფორმები, Contact და Live Chat-ის მართვა."
            items={websiteItems}
          />
        </div>
      </div>

      <style jsx>{`
        .dashboard {
          min-height: 100vh;
          padding: 38px 0 90px;
          background: #0647c8;
        }

        .shell {
          width: calc(100% - 40px);
          max-width: 1180px;
          margin: 0 auto;
        }

        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          padding: 27px 30px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 25px;
          background: #083fAD;
          box-shadow: 0 24px 60px rgba(0, 24, 88, 0.28);
        }

        .headingGroup {
          display: flex;
          align-items: center;
          gap: 19px;
        }

        .brandMark {
          flex: 0 0 auto;
          width: 92px;
          height: 92px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 25px;
          color: #ffffff;
          background: rgba(255, 255, 255, 0.12);
          box-shadow: 0 16px 30px rgba(5, 29, 69, 0.22);
        }

        .brandMark :global(.adminIcon) {
          width: 52px;
          height: 52px;
        }

        .eyebrow {
          color: #bcd6ff;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        h1 {
          margin: 8px 0 0;
          color: #ffffff;
          font-size: clamp(31px, 4vw, 45px);
          font-weight: 760;
          letter-spacing: -2px;
        }

        .header p {
          max-width: 680px;
          margin: 10px 0 0;
          color: rgba(255, 255, 255, 0.76);
          font-size: 11px;
          line-height: 1.7;
        }

        .header a {
          flex: 0 0 auto;
          padding: 11px 14px;
          border: 1px solid rgba(255, 255, 255, 0.24);
          border-radius: 12px;
          color: #ffffff;
          background: rgba(255, 255, 255, 0.11);
          font-size: 10px;
          font-weight: 800;
          text-decoration: none;
        }

        .stats {
          margin-top: 34px;
          display: grid;
          grid-template-columns:
            repeat(5, minmax(0, 1fr));
          gap: 14px;
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
            padding: 23px;
          }

          .headingGroup {
            align-items: flex-start;
          }

          .brandMark {
            width: 52px;
            height: 52px;
            border-radius: 16px;
          }

          .brandMark :global(.adminIcon) {
            width: 30px;
            height: 30px;
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
  icon: ReactNode;
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
          min-height: 122px;
          padding: 18px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 18px;
          background: #0b52d6;
          box-shadow: 0 14px 34px rgba(18, 102, 233, 0.19);
        }

        .top {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .icon {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          background: rgba(255, 255, 255, 0.12);
          color: #ffffff;
          font-size: 25px;
        }

        .label {
          color: rgba(255, 255, 255, 0.82);
          font-size: 9px;
          font-weight: 900;
        }

        strong {
          display: block;
          margin-top: 17px;
          color: #ffffff;
          font-size: 32px;
          font-weight: 800;
        }
        :global(.adminIcon) {
          width: 27px;
          height: 27px;
        }
      `}</style>
    </div>
  );
}
