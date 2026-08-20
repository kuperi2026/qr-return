"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type ReturnCase = {
  id: string;
  owner_id: string | null;

  tag_code: string | null;

  item_type: string | null;
  pet_type: string | null;

  item_name: string | null;

  active: boolean | null;

  owner_email: string | null;

  lost_message: string | null;
  lost_seen_location: string | null;
  lost_at: string | null;

  photo: string | null;

  scan_count: number | null;
  last_scanned_at: string | null;
};

export default function AdminReturnCasesPage() {
  const router = useRouter();

  const [items, setItems] =
    useState<ReturnCase[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    void loadReturnCases();
  }, []);

  async function loadReturnCases() {
    try {
      setLoading(true);
      setError("");

      const {
        data: { user },
        error: authError,
      } =
        await supabase.auth.getUser();

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

      const {
        data,
        error,
      } = await supabase
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
          lost_message,
          lost_seen_location,
          lost_at,
          photo,
          scan_count,
          last_scanned_at
        `)
        .or(
          "lost_message.not.is.null,lost_seen_location.not.is.null,lost_at.not.is.null"
        )
        .order("lost_at", {
          ascending: false,
          nullsFirst: false,
        });

      if (error) {
        throw error;
      }

      setItems(
        (data || []) as ReturnCase[]
      );
    } catch (err) {
      console.error(
        "Return Cases load error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Return Cases-ის ჩატვირთვა ვერ მოხერხდა."
      );
    } finally {
      setLoading(false);
    }
  }

  const filteredItems =
    useMemo(() => {
      const q =
        search
          .trim()
          .toLowerCase();

      if (!q) {
        return items;
      }

      return items.filter(
        (item) => {
          const text = [
            item.tag_code,
            item.item_name,
            item.owner_email,
            item.lost_message,
            item.lost_seen_location,
            item.item_type,
            item.pet_type,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          return text.includes(q);
        }
      );
    }, [items, search]);

  const totalScans =
    items.reduce(
      (total, item) =>
        total +
        Number(
          item.scan_count || 0
        ),
      0
    );

  if (loading) {
    return (
      <main className="state">
        Return Cases იტვირთება...

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
              Return Cases
            </h1>

            <p>
              დაკარგულად მონიშნული QR პროფილები
              და მიმდინარე დაბრუნების პროცესები.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              void loadReturnCases()
            }
          >
            Refresh
          </button>
        </header>

        <section className="stats">
          <Stat
            label="RETURN CASES"
            value={items.length}
          />

          <Stat
            label="ACTIVE QR"
            value={
              items.filter(
                (item) =>
                  item.active === true
              ).length
            }
          />

          <Stat
            label="TOTAL SCANS"
            value={totalScans}
          />
        </section>

        <section className="searchBox">
          <SearchIcon />

          <input
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Tag code, item name, location, owner email..."
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
        </section>

        {error && (
          <div className="error">
            <strong>
              Return Cases Error
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
                CURRENT RETURN CASES
              </span>

              <strong>
                {filteredItems.length}
              </strong>
            </div>

            {filteredItems.length ===
            0 ? (
              <div className="empty">
                <strong>
                  Return Case ვერ მოიძებნა
                </strong>

                <p>
                  მიმდინარე დაბრუნების შემთხვევა არ არის.
                </p>
              </div>
            ) : (
              <div className="cases">
                {filteredItems.map(
                  (item) => (
                    <ReturnCaseCard
                      key={item.id}
                      item={item}
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
          max-width: 1120px;
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

        .searchBox {
          min-height: 52px;

          margin-top: 24px;
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

        .resultHeader {
          margin-top: 30px;
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

        .cases {
          margin-top: 13px;

          display: grid;

          gap: 12px;
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

function ReturnCaseCard({
  item,
}: {
  item: ReturnCase;
}) {
  const type =
    getType(item);

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
            {getIcon(type)}
          </div>
        )}

        <span className="caseBadge">
          RETURN CASE
        </span>
      </div>

      <div className="content">
        <div className="identity">
          <span>
            {item.tag_code ||
              "NO TAG CODE"}
          </span>

          <h3>
            {item.item_name ||
              getLabel(type)}
          </h3>

          <small>
            {getLabel(type)}
          </small>
        </div>

        <div className="details">
          <Data
            label="STARTED"
            value={
              item.lost_at
                ? new Date(
                    item.lost_at
                  ).toLocaleString()
                : "—"
            }
          />

          <Data
            label="LAST SEEN"
            value={
              item.lost_seen_location ||
              "—"
            }
          />

          <Data
            label="SCANS"
            value={String(
              item.scan_count || 0
            )}
          />

          <Data
            label="OWNER"
            value={
              item.owner_email || "—"
            }
          />
        </div>

        {item.lost_message && (
          <div className="message">
            <span>
              OWNER MESSAGE
            </span>

            <p>
              {item.lost_message}
            </p>
          </div>
        )}

        <div className="actions">
          {item.tag_code && (
            <Link
              href={`/scan/${item.tag_code}`}
              target="_blank"
            >
              Finder View ↗
            </Link>
          )}

          <Link
            href="/admin/items"
          >
            QR Profile →
          </Link>
        </div>
      </div>

      <style jsx>{`
        .card {
          overflow: hidden;

          display: grid;

          grid-template-columns:
            180px
            minmax(0, 1fr);

          border:
            1px solid #e0e5e8;

          border-radius: 15px;

          background: white;
        }

        .visual {
          min-height: 210px;

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

          font-size: 45px;
        }

        .caseBadge {
          position: absolute;

          top: 12px;
          left: 12px;

          padding: 6px 8px;

          border-radius: 999px;

          color: white;
          background: #c84a50;

          font-size: 6px;
          font-weight: 900;
          letter-spacing: 0.8px;
        }

        .content {
          padding: 18px;
        }

        .identity > span {
          color: #c84a50;

          font-size: 7px;
          font-weight: 900;
        }

        h3 {
          margin: 5px 0 0;

          color: #303c47;

          font-size: 16px;
        }

        .identity small {
          display: block;

          margin-top: 4px;

          color: #8e98a1;

          font-size: 7px;
        }

        .details {
          margin-top: 18px;
          padding-top: 14px;

          display: grid;

          grid-template-columns:
            repeat(
              4,
              minmax(0, 1fr)
            );

          gap: 12px;

          border-top:
            1px solid #e8ebed;
        }

        .message {
          margin-top: 16px;

          padding: 12px;

          border-radius: 10px;

          background: #fff6f6;
        }

        .message span {
          color: #c84a50;

          font-size: 6px;
          font-weight: 900;
        }

        .message p {
          margin: 5px 0 0;

          color: #697581;

          font-size: 9px;
          line-height: 1.6;
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

          border:
            1px solid #dfe4e8;

          border-radius: 8px;

          color: #53606c;
          background: white;

          text-decoration: none;

          font-size: 7px;
          font-weight: 850;
        }

        @media (max-width: 700px) {
          .card {
            grid-template-columns: 1fr;
          }

          .details {
            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );
          }
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
      <span>{label}</span>
      <strong>{value}</strong>

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
      <span>{label}</span>
      <strong>{value}</strong>

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

          color: #53606c;
          font-size: 8px;
        }
      `}</style>
    </div>
  );
}

function getType(
  item: ReturnCase
) {
  if (item.item_type === "pet") {
    return item.pet_type || "pet";
  }

  return (
    item.item_type ||
    item.pet_type ||
    "other"
  );
}

function getLabel(
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

  return labels[type] || type || "QR Profile";
}

function getIcon(
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

  return icons[type] || "🏷️";
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
