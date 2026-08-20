"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type ItemRow = {
  id: string;
  owner_id: string | null;
  tag_code: string | null;
  item_type: string | null;
  pet_type: string | null;
  item_name: string | null;
  active: boolean | null;
  owner_email: string | null;
  scan_count: number | null;
  lost_message: string | null;
  lost_seen_location: string | null;
  photo: string | null;
  created_at?: string | null;
  last_scanned_at: string | null;
};

const categories = [
  { id: "all", label: "ყველა" },
  { id: "dog", label: "ძაღლი" },
  { id: "cat", label: "კატა" },
  { id: "keys", label: "გასაღები" },
  { id: "wallet", label: "საფულე" },
  { id: "bag", label: "ჩანთა" },
  { id: "suitcase", label: "ჩემოდანი" },
  { id: "emergency", label: "Emergency" },
];

export default function AdminItemsPage() {
  const router = useRouter();

  const [items, setItems] = useState<ItemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [ownerFilter, setOwnerFilter] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);

      const owner = params.get("owner");
      const type = params.get("type");

      setOwnerFilter(owner);

      if (type) {
        setCategory(type);
      }
    }

    void loadItems();
  }, []);

  async function loadItems() {
    try {
      setLoading(true);
      setError("");

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        throw authError;
      }

      if (!user) {
        router.push("/login");
        return;
      }

      const {
        data: admin,
        error: adminError,
      } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (adminError) {
        throw adminError;
      }

      if (!admin) {
        setError("Admin Access Required");
        setLoading(false);
        return;
      }

      const params =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search)
          : null;

      const owner = params?.get("owner") || null;

      let query = supabase
        .from("item")
        .select(`
          id,
          owner_id,
          tag_code,
          item_type,
          pet_type,
          item_name,
          active,
          owner_email,
          scan_count,
          lost_message,
          lost_seen_location,
          photo,
          created_at,
          last_scanned_at
        `)
        .order("created_at", {
          ascending: false,
        });

      if (owner) {
        query = query.eq("owner_id", owner);
      }

      const {
        data,
        error,
      } = await query;

      if (error) {
        throw error;
      }

      setItems((data || []) as ItemRow[]);
    } catch (err) {
      console.error(
        "Admin items error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "QR პროფილების ჩატვირთვა ვერ მოხერხდა."
      );
    } finally {
      setLoading(false);
    }
  }

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();

    return items.filter((item) => {
      const type = getEffectiveType(item);

      const categoryMatch =
        category === "all" ||
        type === category;

      const text = [
        item.tag_code,
        item.item_name,
        item.owner_email,
        item.item_type,
        item.pet_type,
        item.owner_id,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const searchMatch =
        !q || text.includes(q);

      return categoryMatch && searchMatch;
    });
  }, [items, search, category]);

  const stats = useMemo(() => {
    return {
      total: items.length,

      active: items.filter(
        (item) => item.active === true
      ).length,

      lost: items.filter((item) =>
        Boolean(
          item.lost_message ||
            item.lost_seen_location
        )
      ).length,

      scans: items.reduce(
        (total, item) =>
          total +
          Number(item.scan_count || 0),
        0
      ),
    };
  }, [items]);

  if (loading) {
    return (
      <main className="state">
        QR პროფილები იტვირთება...

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
              QR პროფილები
            </h1>

            <p>
              ყველა რეგისტრირებული ძაღლი, კატა,
              ნივთი და Emergency პროფილი.
            </p>

            {ownerFilter && (
              <div className="ownerFilter">
                Owner filter:
                <strong>
                  {ownerFilter}
                </strong>

                <Link href="/admin/items">
                  Clear
                </Link>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() =>
              void loadItems()
            }
          >
            Refresh
          </button>
        </header>

        <section className="stats">
          <Stat
            label="TOTAL"
            value={stats.total}
          />

          <Stat
            label="ACTIVE"
            value={stats.active}
          />

          <Stat
            label="LOST"
            value={stats.lost}
          />

          <Stat
            label="TOTAL SCANS"
            value={stats.scans}
          />
        </section>

        <section className="controls">
          <div className="searchBox">
            <SearchIcon />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Tag code, name, email..."
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

          <div className="categories">
            {categories.map((item) => (
              <button
                key={item.id}
                type="button"
                className={
                  category === item.id
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setCategory(
                    item.id
                  )
                }
              >
                {item.label}
              </button>
            ))}
          </div>
        </section>

        {error && (
          <div className="error">
            <strong>
              QR Profiles Error
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
                RESULTS
              </span>

              <strong>
                {filteredItems.length}
              </strong>
            </div>

            {filteredItems.length === 0 ? (
              <div className="empty">
                <strong>
                  QR პროფილი ვერ მოიძებნა
                </strong>

                <p>
                  შეცვალეთ ძებნა ან კატეგორია.
                </p>
              </div>
            ) : (
              <div className="grid">
                {filteredItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                  />
                ))}
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
          max-width: 1180px;
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

        .header > button {
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

        .ownerFilter {
          margin-top: 11px;

          display: flex;
          flex-wrap: wrap;
          align-items: center;

          gap: 6px;

          color: #79848e;

          font-size: 8px;
        }

        .ownerFilter strong {
          color: #414d58;
        }

        .ownerFilter :global(a) {
          color: #225fc7;
          font-weight: 850;
          text-decoration: none;
        }

        .stats {
          margin-top: 32px;

          display: grid;

          grid-template-columns:
            repeat(
              4,
              minmax(0, 1fr)
            );

          gap: 10px;
        }

        .controls {
          margin-top: 24px;

          display: grid;

          gap: 12px;
        }

        .searchBox {
          min-height: 51px;

          padding: 0 15px;

          display: grid;

          grid-template-columns:
            auto
            minmax(0, 1fr)
            auto;

          align-items: center;

          gap: 10px;

          border: 1px solid #dfe4e8;

          border-radius: 13px;

          background: white;
        }

        .searchBox :global(svg) {
          width: 17px;
          height: 17px;
          color: #89939d;
        }

        .searchBox input {
          width: 100%;

          border: 0;
          outline: 0;

          color: #303c47;
          background: transparent;

          font-size: 10px;
        }

        .searchBox button {
          border: 0;

          color: #89939d;
          background: transparent;

          cursor: pointer;

          font-size: 18px;
        }

        .categories {
          display: flex;
          flex-wrap: wrap;

          gap: 6px;
        }

        .categories button {
          min-height: 31px;

          padding: 0 10px;

          border: 1px solid #dce1e4;
          border-radius: 999px;

          color: #66727d;
          background: white;

          cursor: pointer;

          font-size: 7px;
          font-weight: 850;
        }

        .categories button.active {
          color: white;

          border-color: #202b37;
          background: #202b37;
        }

        .resultHeader {
          margin-top: 29px;
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

          border: 1px solid #dfe4e8;
          border-radius: 999px;

          color: #61707c;
          background: white;

          font-size: 8px;
        }

        .grid {
          margin-top: 13px;

          display: grid;

          grid-template-columns:
            repeat(
              3,
              minmax(0, 1fr)
            );

          gap: 12px;
        }

        .error,
        .empty {
          margin-top: 22px;

          padding: 30px;

          border: 1px solid #e0e5e8;

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

        @media (max-width: 900px) {
          .grid {
            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );
          }

          .stats {
            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );
          }
        }

        @media (max-width: 600px) {
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

          .grid,
          .stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}

function ItemCard({
  item,
}: {
  item: ItemRow;
}) {
  const type =
    getEffectiveType(item);

  const lost =
    Boolean(
      item.lost_message ||
        item.lost_seen_location
    );

  return (
    <article className="card">
      <div className="visual">
        {item.photo ? (
          <img
            src={item.photo}
            alt={
              item.item_name ||
              type
            }
          />
        ) : (
          <div className="placeholder">
            {getTypeIcon(type)}
          </div>
        )}

        <span className="tag">
          {item.tag_code ||
            "NO TAG"}
        </span>
      </div>

      <div className="content">
        <div className="top">
          <div>
            <span className="type">
              {getTypeLabel(type)}
            </span>

            <h3>
              {item.item_name ||
                getTypeLabel(type)}
            </h3>
          </div>

          <span
            className={
              item.active
                ? "status active"
                : "status"
            }
          >
            {item.active
              ? "ACTIVE"
              : "INACTIVE"}
          </span>
        </div>

        <div className="infoGrid">
          <Data
            label="SCANS"
            value={String(
              item.scan_count || 0
            )}
          />

          <Data
            label="LOST"
            value={
              lost ? "YES" : "NO"
            }
          />

          <Data
            label="OWNER"
            value={
              item.owner_email || "—"
            }
          />

          <Data
            label="LAST SCAN"
            value={
              item.last_scanned_at
                ? new Date(
                    item.last_scanned_at
                  ).toLocaleDateString()
                : "—"
            }
          />
        </div>

        <div className="actions">
          {item.tag_code && (
            <Link
              href={`/scan/${item.tag_code}`}
              target="_blank"
            >
              Finder View ↗
            </Link>
          )}

          {item.owner_id && (
            <Link
              href={`/admin/users?search=${item.owner_id}`}
            >
              Owner →
            </Link>
          )}
        </div>
      </div>

      <style jsx>{`
        .card {
          overflow: hidden;

          border: 1px solid #e0e5e8;
          border-radius: 15px;

          background: white;
        }

        .visual {
          height: 175px;

          position: relative;

          overflow: hidden;

          background:
            linear-gradient(
              145deg,
              #eef1f3,
              #f8f9f8
            );
        }

        .visual img {
          width: 100%;
          height: 100%;

          object-fit: cover;
        }

        .placeholder {
          width: 100%;
          height: 100%;

          display: grid;
          place-items: center;

          font-size: 42px;
        }

        .tag {
          position: absolute;

          right: 10px;
          bottom: 10px;

          padding: 6px 8px;

          border-radius: 999px;

          color: #424f5b;

          background:
            rgba(
              255,
              255,
              255,
              0.92
            );

          font-size: 6px;
          font-weight: 900;
        }

        .content {
          padding: 15px;
        }

        .top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;

          gap: 10px;
        }

        .type {
          color: #c84a50;

          font-size: 6px;
          font-weight: 900;
          letter-spacing: 0.8px;
        }

        h3 {
          margin: 5px 0 0;

          color: #303c47;

          font-size: 13px;
          line-height: 1.3;
        }

        .status {
          padding: 5px 7px;

          border-radius: 999px;

          color: #7e8790;

          background: #f0f2f3;

          font-size: 6px;
          font-weight: 900;
        }

        .status.active {
          color: #276845;
          background: #edf8f2;
        }

        .infoGrid {
          margin-top: 17px;

          display: grid;

          grid-template-columns:
            repeat(
              2,
              minmax(0, 1fr)
            );

          gap: 11px;

          padding-top: 13px;

          border-top:
            1px solid #e8ebed;
        }

        .actions {
          margin-top: 16px;

          display: flex;
          flex-wrap: wrap;

          gap: 6px;
        }

        .actions :global(a) {
          min-height: 33px;

          padding: 0 10px;

          display: flex;
          align-items: center;

          border: 1px solid #dfe4e8;
          border-radius: 8px;

          color: #53606c;
          background: white;

          text-decoration: none;

          font-size: 7px;
          font-weight: 850;
        }
      `}</style>
    </article>
  );
}

function Stat({
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

          border: 1px solid #e0e5e8;
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

function getEffectiveType(
  item: ItemRow
) {
  if (item.item_type === "pet") {
    return (
      item.pet_type ||
      "pet"
    );
  }

  return (
    item.item_type ||
    item.pet_type ||
    "other"
  );
}

function getTypeLabel(
  type: string
) {
  const labels:
    Record<string, string> = {
      dog: "ძაღლი",
      cat: "კატა",
      pet: "Pet",
      keys: "გასაღები",
      wallet: "საფულე",
      bag: "ჩანთა",
      suitcase: "ჩემოდანი",
      luggage: "ჩემოდანი",
      emergency: "Emergency ID",
    };

  return (
    labels[type] ||
    type ||
    "QR Profile"
  );
}

function getTypeIcon(
  type: string
) {
  const icons:
    Record<string, string> = {
      dog: "🐕",
      cat: "🐈",
      pet: "🐾",
      keys: "🔑",
      wallet: "👛",
      bag: "🎒",
      suitcase: "🧳",
      luggage: "🧳",
      emergency: "🚑",
    };

  return (
    icons[type] ||
    "🏷️"
  );
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
