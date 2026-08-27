"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type UserProfile = {
  id: string;
  email?: string | null;
  full_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  created_at?: string | null;
};

type UserRow = UserProfile & {
  qrCount: number;
};

export default function AdminUsersPage() {
  const router = useRouter();

  const [users, setUsers] = useState<UserRow[]>([]);
  const [filteredUsers, setFilteredUsers] =
    useState<UserRow[]>([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void loadUsers();
  }, []);

  useEffect(() => {
    const q = search.trim().toLowerCase();

    if (!q) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter((user) => {
      const text = [
        user.email,
        user.full_name,
        user.first_name,
        user.last_name,
        user.phone,
        user.id,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return text.includes(q);
    });

    setFilteredUsers(filtered);
  }, [search, users]);

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");

      /*
        1. LOGIN CHECK
      */

      const {
        data: { user: currentUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        throw authError;
      }

      if (!currentUser) {
        router.push("/login");
        return;
      }

      /*
        2. ADMIN CHECK
      */

      const {
        data: admin,
        error: adminError,
      } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", currentUser.id)
        .maybeSingle();

      if (adminError) {
        throw adminError;
      }

      if (!admin) {
        setError("Admin Access Required");
        setLoading(false);
        return;
      }

      /*
        3. USERS

        აქ ვიყენებთ profiles table-ს.
        Account/Login-ის კოდს არ ვეხებით.
      */

      const {
        data: profileRows,
        error: profileError,
      } = await supabase
        .from("owner_accounts")
        .select("user_id, email, first_name, last_name, phone, created_at")
        .order("created_at", {
          ascending: false,
        });

      if (profileError) {
        throw profileError;
      }

      /*
        4. QR PROFILES

        item.owner_id-ს ვიყენებთ
        თითო მომხმარებლის QR რაოდენობისთვის.
      */

      const {
        data: itemRows,
        error: itemsError,
      } = await supabase
        .from("item")
        .select("owner_id");

      if (itemsError) {
        console.error(
          "QR count load error:",
          itemsError
        );
      }

      const { data: emergencyRows, error: emergencyError } = await supabase
        .from("emergency_profiles")
        .select("owner_id");

      if (emergencyError) {
        console.error("Emergency count load error:", emergencyError);
      }

      const counts: Record<string, number> = {};

      for (const item of itemRows || []) {
        if (!item.owner_id) continue;

        counts[item.owner_id] =
          (counts[item.owner_id] || 0) + 1;
      }

      for (const item of emergencyRows || []) {
        if (!item.owner_id) continue;
        counts[item.owner_id] = (counts[item.owner_id] || 0) + 1;
      }

      const rows: UserRow[] = (
        (profileRows || [])
      ).map((profile) => ({
        id: profile.user_id,
        email: profile.email,
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone: profile.phone,
        created_at: profile.created_at,
        qrCount: counts[profile.user_id] || 0,
      }));

      setUsers(rows);
      setFilteredUsers(rows);
    } catch (err) {
      console.error("Admin users error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Users-ის ჩატვირთვა ვერ მოხერხდა."
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="state">
        Users იტვირთება...

        <style jsx>{`
          .state {
            min-height: 100vh;

            display: grid;
            place-items: center;

            background: #f5f7f8;

            color: #697581;

            font-family: Arial, sans-serif;
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="shell">
        <header className="header">
          <div>
            <Link
              href="/admin"
              className="back"
            >
              ← Admin Control Center
            </Link>

            <span className="eyebrow">
              QR RETURN ADMIN
            </span>

            <h1>
              მომხმარებლები
            </h1>

            <p>
              QR RETURN ანგარიშები და მათთან
              დაკავშირებული QR პროფილები.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              void loadUsers()
            }
          >
            Refresh
          </button>
        </header>

        <div className="stats">
          <StatCard
            label="TOTAL USERS"
            value={users.length}
          />

          <StatCard
            label="WITH QR"
            value={
              users.filter(
                (user) =>
                  user.qrCount > 0
              ).length
            }
          />

          <StatCard
            label="TOTAL QR"
            value={users.reduce(
              (total, user) =>
                total + user.qrCount,
              0
            )}
          />
        </div>

        <div className="search">
          <SearchIcon />

          <input
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search name, email, phone or user ID..."
          />

          {search && (
            <button
              type="button"
              onClick={() =>
                setSearch("")
              }
            >
              ×
            </button>
          )}
        </div>

        {error && (
          <div className="error">
            <strong>
              Users Error
            </strong>

            <span>
              {error}
            </span>
          </div>
        )}

        {!error && (
          <>
            <div className="resultHeader">
              <span>
                USERS
              </span>

              <strong>
                {filteredUsers.length}
              </strong>
            </div>

            {filteredUsers.length === 0 ? (
              <div className="empty">
                <strong>
                  მომხმარებელი ვერ მოიძებნა
                </strong>

                <p>
                  სცადეთ სხვა სახელი,
                  Email ან ტელეფონი.
                </p>
              </div>
            ) : (
              <div className="users">
                {filteredUsers.map(
                  (user) => (
                    <UserCard
                      key={user.id}
                      user={user}
                    />
                  )
                )}
              </div>
            )}
          </>
        )}
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;

          padding: 48px 0 90px;

          background: #f5f7f8;
        }

        .shell {
          width: calc(100% - 40px);
          max-width: 1100px;

          margin: 0 auto;
        }

        .header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;

          gap: 25px;
        }

        .back {
          display: inline-block;

          margin-bottom: 22px;

          color: #697581;

          font-size: 9px;
          font-weight: 800;

          text-decoration: none;
        }

        .eyebrow {
          display: block;

          color: #c84a50;

          font-size: 8px;
          font-weight: 900;
          letter-spacing: 1.4px;
        }

        h1 {
          margin: 7px 0 0;

          color: #202b37;

          font-size: clamp(
            35px,
            4vw,
            46px
          );

          font-weight: 780;
          letter-spacing: -1.8px;
        }

        .header p {
          max-width: 600px;

          margin: 8px 0 0;

          color: #7c8792;

          font-size: 10px;
          line-height: 1.65;
        }

        .header button {
          min-height: 40px;

          padding: 0 14px;

          border: 0;
          border-radius: 9px;

          color: white;
          background: #202b37;

          cursor: pointer;

          font-size: 9px;
          font-weight: 850;
        }

        .stats {
          margin-top: 32px;

          display: grid;

          grid-template-columns:
            repeat(
              3,
              minmax(0, 1fr)
            );

          gap: 10px;
        }

        .search {
          min-height: 52px;

          margin-top: 25px;
          padding: 0 15px;

          display: grid;

          grid-template-columns:
            auto
            minmax(0, 1fr)
            auto;

          align-items: center;

          gap: 10px;

          border:
            1px solid #dfe4e8;

          border-radius: 13px;

          background: white;
        }

        .search :global(svg) {
          width: 17px;
          height: 17px;

          color: #89939d;
        }

        .search input {
          width: 100%;

          border: 0;
          outline: 0;

          color: #303c47;
          background: transparent;

          font-size: 10px;
        }

        .search button {
          border: 0;

          color: #89939d;
          background: transparent;

          cursor: pointer;

          font-size: 18px;
        }

        .resultHeader {
          margin-top: 32px;
          padding-bottom: 10px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          border-bottom:
            1px solid #dfe4e8;
        }

        .resultHeader span {
          color: #98a1a9;

          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .resultHeader strong {
          min-width: 28px;
          height: 28px;

          display: grid;
          place-items: center;

          border:
            1px solid #dfe4e8;

          border-radius: 999px;

          color: #61707c;
          background: white;

          font-size: 8px;
        }

        .users {
          margin-top: 12px;

          display: grid;

          gap: 10px;
        }

        .error,
        .empty {
          margin-top: 22px;

          padding: 30px;

          border:
            1px solid #e0e5e8;

          border-radius: 14px;

          background: white;
        }

        .error {
          color: #9b3d42;
        }

        .error strong,
        .error span {
          display: block;
        }

        .error span {
          margin-top: 5px;

          font-size: 9px;
        }

        .empty {
          text-align: center;
        }

        .empty strong {
          color: #3d4954;

          font-size: 12px;
        }

        .empty p {
          margin: 6px 0 0;

          color: #89939d;

          font-size: 9px;
        }

        @media (max-width: 650px) {
          .page {
            padding-top: 30px;
          }

          .shell {
            width:
              calc(100% - 24px);
          }

          .header {
            align-items: stretch;
            flex-direction: column;
          }

          .stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}

function UserCard({
  user,
}: {
  user: UserRow;
}) {
  const fullName =
    user.full_name ||
    [
      user.first_name,
      user.last_name,
    ]
      .filter(Boolean)
      .join(" ") ||
    "QR RETURN User";

  return (
    <article className="card">
      <div className="avatar">
        {getInitials(fullName)}
      </div>

      <div className="identity">
        <span>
          USER
        </span>

        <strong>
          {fullName}
        </strong>

        <small>
          {user.email || user.id}
        </small>
      </div>

      <div className="info">
        <Data
          label="PHONE"
          value={
            user.phone || "—"
          }
        />

        <Data
          label="QR PROFILES"
          value={String(
            user.qrCount
          )}
        />

        <Data
          label="JOINED"
          value={
            user.created_at
              ? new Date(
                  user.created_at
                ).toLocaleDateString()
              : "—"
          }
        />
      </div>

      <div className="actions">
        <Link
          href={`/admin/items?owner=${user.id}`}
        >
          QR Profiles →
        </Link>
      </div>

      <style jsx>{`
        .card {
          padding: 15px;

          display: grid;

          grid-template-columns:
            auto
            210px
            minmax(0, 1fr)
            auto;

          align-items: center;

          gap: 14px;

          border:
            1px solid #e0e5e8;

          border-radius: 13px;

          background: white;
        }

        .avatar {
          width: 42px;
          height: 42px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          color: #51606d;
          background: #eef1f3;

          font-size: 10px;
          font-weight: 900;
        }

        .identity {
          min-width: 0;
        }

        .identity span,
        .identity strong,
        .identity small {
          display: block;
        }

        .identity span {
          color: #c84a50;

          font-size: 6px;
          font-weight: 900;
        }

        .identity strong {
          margin-top: 4px;

          overflow: hidden;

          color: #303c47;

          font-size: 11px;

          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .identity small {
          margin-top: 3px;

          overflow: hidden;

          color: #8e98a1;

          font-size: 7px;

          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .info {
          display: grid;

          grid-template-columns:
            repeat(
              3,
              minmax(0, 1fr)
            );

          gap: 12px;
        }

        .actions :global(a) {
          min-height: 34px;

          padding: 0 10px;

          display: flex;
          align-items: center;

          border:
            1px solid #dfe4e8;

          border-radius: 8px;

          color: #53606c;
          background: white;

          text-decoration: none;

          font-size: 7px;
          font-weight: 850;

          white-space: nowrap;
        }

        @media (max-width: 850px) {
          .card {
            grid-template-columns:
              auto 1fr;
          }

          .info,
          .actions {
            grid-column: 1 / -1;
          }
        }
      `}</style>
    </article>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="stat">
      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

      <style jsx>{`
        .stat {
          min-height: 95px;

          padding: 15px;

          border:
            1px solid #e0e5e8;

          border-radius: 12px;

          background: white;
        }

        span {
          color: #959fa8;

          font-size: 7px;
          font-weight: 900;
        }

        strong {
          display: block;

          margin-top: 16px;

          color: #293540;

          font-size: 23px;
        }
      `}</style>
    </div>
  );
}

function Data({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

      <style jsx>{`
        span,
        strong {
          display: block;
        }

        span {
          color: #99a2aa;

          font-size: 6px;
          font-weight: 900;
        }

        strong {
          margin-top: 4px;

          overflow: hidden;

          color: #53606c;

          font-size: 8px;

          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}

function getInitials(
  name: string
) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0).toUpperCase()
    )
    .join("");
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <circle
        cx="10.5"
        cy="10.5"
        r="6"
      />

      <path d="m15 15 5 5" />
    </svg>
  );
}
