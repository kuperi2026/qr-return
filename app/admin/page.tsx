"use client";

import Link from "next/link";

export default function AdminPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f7f8",
        padding: "60px 20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <p
          style={{
            color: "#c84a50",
            fontSize: "12px",
            fontWeight: 800,
            letterSpacing: "1.5px",
          }}
        >
          QR RETURN ADMIN
        </p>

        <h1
          style={{
            margin: "8px 0 10px",
            color: "#202b37",
            fontSize: "42px",
          }}
        >
          Admin Panel
        </h1>

        <p
          style={{
            color: "#75808b",
            marginBottom: "35px",
          }}
        >
          QR RETURN administration
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "15px",
          }}
        >
          <AdminLink
            href="/admin/orders"
            title="Orders"
            description="Manage customer orders"
          />

          <AdminLink
            href="/admin/users"
            title="Users"
            description="Manage users"
          />

          <AdminLink
            href="/admin/items"
            title="QR Profiles"
            description="Manage registered QR profiles"
          />

          <AdminLink
            href="/admin/support"
            title="Support"
            description="Support and customer messages"
          />

          <AdminLink
            href="/"
            title="Website"
            description="Open QR RETURN website"
          />
        </div>
      </div>
    </main>
  );
}

function AdminLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "block",
        padding: "22px",
        border: "1px solid #e0e5e8",
        borderRadius: "14px",
        background: "#ffffff",
        color: "#202b37",
        textDecoration: "none",
      }}
    >
      <strong
        style={{
          display: "block",
          fontSize: "16px",
          marginBottom: "7px",
        }}
      >
        {title}
      </strong>

      <span
        style={{
          color: "#7b8690",
          fontSize: "12px",
        }}
      >
        {description}
      </span>
    </Link>
  );
}
