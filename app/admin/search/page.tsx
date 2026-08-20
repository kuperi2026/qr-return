"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type ItemRow = {
  id: string;
  tag_code: string | null;

  item_type: string | null;
  pet_type: string | null;

  item_name: string | null;

  active: boolean | null;

  owner_email: string | null;

  scan_count: number | null;

  lost_message: string | null;
  lost_seen_location: string | null;

  last_scanned_at: string | null;
};

export default function AdminQRSearchPage() {
  const [query, setQuery] =
    useState("");

  const [results, setResults] =
    useState<ItemRow[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [searched, setSearched] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSearch() {
    const value =
      query.trim();

    setError("");
    setSearched(true);

    if (!value) {
      setResults([]);
      return;
    }

    setLoading(true);

    try {
      /*
        ვეძებთ:
        - tag_code
        - item_name
        - owner_email

        ilike = ნაწილობრივი ძებნა
      */

      const {
        data,
        error,
      } = await supabase
        .from("item")
        .select(`
          id,
          tag_code,
          item_type,
          pet_type,
          item_name,
          active,
          owner_email,
          scan_count,
          lost_message,
          lost_seen_location,
          last_scanned_at
        `)
        .or(
          `tag_code.ilike.%${value}%,item_name.ilike.%${value}%,owner_email.ilike.%${value}%`
        )
        .limit(50);

      if (error) {
        throw error;
      }

      setResults(
        (data || []) as ItemRow[]
      );
    } catch (err) {
      console.error(
        "QR search error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Search failed."
      );

      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(
    event:
      React.KeyboardEvent<HTMLInputElement>
  ) {
    if (
      event.key === "Enter"
    ) {
      void handleSearch();
    }
  }

  return (
    <main className="page">
      <div className="shell">

        {/* HEADER */}

        <header>
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
              QR ძებნა
            </h1>

            <p>
              მოძებნეთ QR პროფილი
              Tag Code-ით,
              სახელით ან
              Owner Email-ით.
            </p>
          </div>
        </header>

        {/* SEARCH */}

        <section className="searchBox">
          <div className="searchInput">
            <SearchIcon />

            <input
              value={query}
              onChange={(
                event
              ) =>
                setQuery(
                  event.target.value
                )
              }
              onKeyDown={
                handleKeyDown
              }
              placeholder="Tag Code, name or email..."
            />

            {query && (
              <button
                type="button"
                className="clear"
                onClick={() => {
                  setQuery("");
                  setResults(
                    []
                  );
                  setSearched(
                    false
                  );
                }}
              >
                ×
              </button>
            )}
          </div>

          <button
            type="button"
            className="searchButton"
            disabled={loading}
            onClick={() =>
              void handleSearch()
            }
          >
            {loading
              ? "Searching..."
              : "Search"}
          </button>
        </section>

        {/* INFO */}

        <div className="hint">
          <span>SEARCH BY</span>

          <div>
            <b>Tag Code</b>
            <b>Item Name</b>
            <b>Owner Email</b>
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div className="error">
            <strong>
              Search Error
            </strong>

            <span>
              {error}
            </span>
          </div>
        )}

        {/* RESULT HEADER */}

        {searched &&
          !loading &&
          !error && (
            <div className="resultHeader">
              <span>
                RESULTS
              </span>

              <strong>
                {
                  results.length
                }
              </strong>
            </div>
          )}

        {/* EMPTY */}

        {searched &&
          !loading &&
          !error &&
          results.length ===
            0 && (
            <div className="empty">
              <div className="emptyIcon">
                <SearchIcon />
              </div>

              <strong>
                პროფილი ვერ
                მოიძებნა
              </strong>

              <p>
                გადაამოწმეთ
                Tag Code,
                სახელი ან
                Email და
                სცადეთ თავიდან.
              </p>
            </div>
          )}

        {/* RESULTS */}

        {results.length >
          0 && (
          <div className="results">
            {results.map(
              (item) => (
                <ResultCard
                  key={
                    item.id
                  }
                  item={
                    item
                  }
                />
              )
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;

          padding:
            48px 0 90px;

          background:
            #f5f7f8;
        }

        .shell {
          width:
            calc(100% - 40px);

          max-width:
            1080px;

          margin:
            0 auto;
        }

        header {
          display:
            flex;

          justify-content:
            space-between;

          gap: 30px;
        }

        .back {
          display:
            inline-block;

          margin-bottom:
            24px;

          color:
            #697581;

          font-size:
            9px;

          font-weight:
            800;

          text-decoration:
            none;
        }

        .eyebrow {
          display:
            block;

          color:
            #c84a50;

          font-size:
            8px;

          font-weight:
            900;

          letter-spacing:
            1.4px;
        }

        h1 {
          margin:
            7px 0 0;

          color:
            #202b37;

          font-size:
            clamp(
              35px,
              4vw,
              46px
            );

          font-weight:
            780;

          letter-spacing:
            -1.8px;
        }

        header p {
          max-width:
            560px;

          margin:
            8px 0 0;

          color:
            #7c8792;

          font-size:
            10px;

          line-height:
            1.65;
        }

        .searchBox {
          margin-top:
            34px;

          padding:
            12px;

          display:
            grid;

          grid-template-columns:
            1fr auto;

          gap:
            10px;

          border:
            1px solid
            #dfe4e8;

          border-radius:
            15px;

          background:
            white;
        }

        .searchInput {
          min-height:
            48px;

          padding:
            0 14px;

          display:
            grid;

          grid-template-columns:
            auto
            minmax(0, 1fr)
            auto;

          align-items:
            center;

          gap:
            10px;

          border:
            1px solid
            #e0e4e7;

          border-radius:
            10px;

          background:
            #fafbfc;
        }

        .searchInput
          :global(svg) {
          width:
            17px;

          height:
            17px;

          color:
            #89939d;
        }

        input {
          width:
            100%;

          border:
            0;

          outline:
            0;

          color:
            #303c47;

          background:
            transparent;

          font-size:
            11px;
        }

        input::placeholder {
          color:
            #a1aab2;
        }

        .clear {
          border:
            0;

          color:
            #8c969f;

          background:
            transparent;

          cursor:
            pointer;

          font-size:
            19px;
        }

        .searchButton {
          min-width:
            110px;

          padding:
            0 17px;

          border:
            0;

          border-radius:
            10px;

          color:
            white;

          background:
            #202b37;

          cursor:
            pointer;

          font-size:
            9px;

          font-weight:
            850;
        }

        .searchButton:disabled {
          opacity:
            0.6;

          cursor:
            default;
        }

        .hint {
          margin-top:
            12px;

          display:
            flex;

          align-items:
            center;

          gap:
            13px;

          color:
            #8b959e;

          font-size:
            7px;
        }

        .hint > span {
          color:
            #a0a8b0;

          font-weight:
            900;

          letter-spacing:
            0.8px;
        }

        .hint div {
          display:
            flex;

          flex-wrap:
            wrap;

          gap:
            6px;
        }

        .hint b {
          padding:
            5px 8px;

          border:
            1px solid
            #e0e4e7;

          border-radius:
            999px;

          color:
            #707b85;

          background:
            white;

          font-weight:
            800;
        }

        .resultHeader {
          margin-top:
            35px;

          padding-bottom:
            10px;

          display:
            flex;

          align-items:
            center;

          justify-content:
            space-between;

          border-bottom:
            1px solid
            #dfe4e8;
        }

        .resultHeader span {
          color:
            #9aa2aa;

          font-size:
            7px;

          font-weight:
            900;

          letter-spacing:
            1px;
        }

        .resultHeader strong {
          min-width:
            27px;

          height:
            27px;

          display:
            grid;

          place-items:
            center;

          border:
            1px solid
            #dfe4e8;

          border-radius:
            999px;

          color:
            #64717d;

          background:
            white;

          font-size:
            8px;
        }

        .results {
          margin-top:
            13px;

          display:
            grid;

          gap:
            11px;
        }

        .empty {
          margin-top:
            20px;

          padding:
            55px 20px;

          border:
            1px solid
            #e0e5e8;

          border-radius:
            15px;

          background:
            white;

          text-align:
            center;
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
            13px;

          color:
            #87919a;

          background:
            #f1f3f5;
        }

        .emptyIcon
          :global(svg) {
          width:
            20px;
        }

        .empty strong {
          display:
            block;

          margin-top:
            13px;

          color:
            #3e4a55;

          font-size:
            12px;
        }

        .empty p {
          margin:
            6px 0 0;

          color:
            #8a949e;

          font-size:
            9px;
        }

        .error {
          margin-top:
            20px;

          padding:
            14px;

          border:
            1px solid
            #edd3d5;

          border-radius:
            11px;

          color:
            #963e43;

          background:
            #fff5f5;
        }

        .error strong,
        .error span {
          display:
            block;
        }

        .error strong {
          font-size:
            10px;
        }

        .error span {
          margin-top:
            4px;

          font-size:
            8px;
        }

        @media (
          max-width:
            650px
        ) {
          .page {
            padding-top:
              30px;
          }

          .shell {
            width:
              calc(
                100% -
                  24px
              );
          }

          .searchBox {
            grid-template-columns:
              1fr;
          }

          .searchButton {
            min-height:
              44px;
          }
        }
      `}</style>
    </main>
  );
}

function ResultCard({
  item,
}: {
  item: ItemRow;
}) {
  const lost =
    Boolean(
      item.lost_message ||
        item.lost_seen_location
    );

  return (
    <article className="card">
      <div className="main">
        <div className="icon">
          {getIcon(
            item.item_type,
            item.pet_type
          )}
        </div>

        <div className="identity">
          <span>
            {item.tag_code ||
              "NO TAG CODE"}
          </span>

          <strong>
            {item.item_name ||
              getTypeName(
                item.item_type,
                item.pet_type
              )}
          </strong>

          <small>
            {getTypeName(
              item.item_type,
              item.pet_type
            )}
          </small>
        </div>
      </div>

      <div className="details">
        <Info
          label="STATUS"
          value={
            item.active
              ? "Active"
              : "Inactive"
          }
        />

        <Info
          label="LOST"
          value={
            lost
              ? "Yes"
              : "No"
          }
        />

        <Info
          label="SCANS"
          value={String(
            item.scan_count ||
              0
          )}
        />

        <Info
          label="OWNER EMAIL"
          value={
            item.owner_email ||
            "—"
          }
        />

        <Info
          label="LAST SCAN"
          value={
            item.last_scanned_at
              ? new Date(
                  item.last_scanned_at
                ).toLocaleString()
              : "—"
          }
        />
      </div>

      <div className="actions">
        <Link
          href={`/admin/items?id=${item.id}`}
        >
          Admin View →
        </Link>

        {item.tag_code && (
          <Link
            href={`/scan/${item.tag_code}`}
            target="_blank"
          >
            Finder View ↗
          </Link>
        )}
      </div>

      <style jsx>{`
        .card {
          padding:
            17px;

          display:
            grid;

          grid-template-columns:
            210px
            minmax(
              0,
              1fr
            )
            auto;

          align-items:
            center;

          gap:
            20px;

          border:
            1px solid
            #e0e5e8;

          border-radius:
            14px;

          background:
            white;
        }

        .main {
          display:
            flex;

          align-items:
            center;

          gap:
            11px;
        }

        .icon {
          width:
            43px;

          height:
            43px;

          display:
            grid;

          place-items:
            center;

          flex:
            0 0 43px;

          border-radius:
            11px;

          background:
            #f2f4f6;

          font-size:
            19px;
        }

        .identity {
          min-width:
            0;
        }

        .identity span,
        .identity strong,
        .identity small {
          display:
            block;
        }

        .identity span {
          color:
            #c84a50;

          font-size:
            7px;

          font-weight:
            900;
        }

        .identity strong {
          margin-top:
            4px;

          overflow:
            hidden;

          color:
            #303c47;

          font-size:
            11px;

          text-overflow:
            ellipsis;

          white-space:
            nowrap;
        }

        .identity small {
          margin-top:
            3px;

          color:
            #9099a2;

          font-size:
            7px;
        }

        .details {
          display:
            grid;

          grid-template-columns:
            repeat(
              5,
              minmax(
                0,
                1fr
              )
            );

          gap:
            13px;
        }

        .actions {
          display:
            flex;

          flex-direction:
            column;

          gap:
            6px;
        }

        .actions
          :global(a) {
          min-height:
            32px;

          padding:
            0 10px;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          border:
            1px solid
            #dfe4e8;

          border-radius:
            8px;

          color:
            #52606c;

          background:
            white;

          text-decoration:
            none;

          font-size:
            7px;

          font-weight:
            850;

          white-space:
            nowrap;
        }

        @media (
          max-width:
            950px
        ) {
          .card {
            grid-template-columns:
              1fr;
          }

          .details {
            grid-template-columns:
              repeat(
                3,
                minmax(
                  0,
                  1fr
                )
              );
          }

          .actions {
            flex-direction:
              row;
          }
        }

        @media (
          max-width:
            600px
        ) {
          .details {
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
      `}</style>
    </article>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="info">
      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

      <style jsx>{`
        .info {
          min-width:
            0;
        }

        span,
        strong {
          display:
            block;
        }

        span {
          color:
            #9ba3ab;

          font-size:
            6px;

          font-weight:
            900;
        }

        strong {
          margin-top:
            4px;

          overflow:
            hidden;

          color:
            #53606c;

          font-size:
            8px;

          text-overflow:
            ellipsis;

          white-space:
            nowrap;
        }
      `}</style>
    </div>
  );
}

function getTypeName(
  itemType:
    | string
    | null,
  petType:
    | string
    | null
) {
  if (
    itemType === "pet"
  ) {
    if (
      petType === "dog"
    ) {
      return "Dog";
    }

    if (
      petType === "cat"
    ) {
      return "Cat";
    }

    return "Pet";
  }

  const map:
    Record<
      string,
      string
    > = {
    dog: "Dog",
    cat: "Cat",
    keys: "Keys",
    wallet: "Wallet",
    bag: "Bag",
    suitcase:
      "Suitcase",
    luggage:
      "Luggage",
    emergency:
      "Emergency ID",
  };

  return (
    map[
      itemType || ""
    ] ||
    itemType ||
    "QR Profile"
  );
}

function getIcon(
  itemType:
    | string
    | null,
  petType:
    | string
    | null
) {
  const type =
    itemType === "pet"
      ? petType
      : itemType;

  const icons:
    Record<
      string,
      string
    > = {
    dog: "🐕",
    cat: "🐈",
    keys: "🔑",
    wallet: "👛",
    bag: "🎒",
    suitcase: "🧳",
    luggage: "🧳",
    emergency: "🚑",
  };

  return (
    icons[type || ""] ||
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
