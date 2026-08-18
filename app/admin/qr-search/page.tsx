"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Lang = "ka" | "en";

type SearchResult = {
  source: string;
  data: Record<string, unknown>;
};

export default function AdminQrSearchPage() {
  const [lang, setLang] = useState<Lang>("ka");

  const [loadingAdmin, setLoadingAdmin] =
    useState(true);

  const [isAdmin, setIsAdmin] =
    useState(false);

  const [code, setCode] =
    useState("");

  const [searching, setSearching] =
    useState(false);

  const [results, setResults] =
    useState<SearchResult[]>([]);

  const [searched, setSearched] =
    useState(false);

  const [error, setError] =
    useState("");

  const ka = lang === "ka";

  useEffect(() => {
    async function checkAdmin() {
      setLoadingAdmin(true);
      setError("");

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
        setLoadingAdmin(false);
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
        setError(
          adminError.message
        );

        setLoadingAdmin(false);
        return;
      }

      setIsAdmin(
        Boolean(adminData)
      );

      setLoadingAdmin(false);
    }

    void checkAdmin();
  }, []);

  async function trySearch(
    table: string,
    column: string,
    value: string,
    label: string
  ): Promise<SearchResult[]> {
    try {
      const {
        data,
        error,
      } = await supabase
        .from(table)
        .select("*")
        .eq(column, value)
        .limit(20);

      /*
        თუ ეს table/column შენს ბაზაში
        არ არსებობს, უბრალოდ ვტოვებთ.
      */
      if (error) {
        console.log(
          `Skipped ${table}.${column}:`,
          error.message
        );

        return [];
      }

      if (!data?.length) {
        return [];
      }

      return data.map(
        (row) => ({
          source: label,
          data:
            row as Record<
              string,
              unknown
            >,
        })
      );
    } catch {
      return [];
    }
  }

  async function handleSearch(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const cleanCode =
      code.trim();

    if (!cleanCode) {
      return;
    }

    setSearching(true);
    setSearched(true);
    setResults([]);
    setError("");

    try {
      /*
        =================================================
        QR RETURN SEARCH

        ვცდით ყველაზე სავარაუდო ცხრილებსა
        და QR ველებს.

        თუ რომელიმე შენს Supabase-ში
        არ არსებობს, კოდი არ გაჩერდება.
        =================================================
      */

      const searchGroups =
        await Promise.all([
          /*
            მთავარი ნივთები / ცხოველები
          */

          trySearch(
            "items",
            "tag_code",
            cleanCode,
            "QR Profile"
          ),

          trySearch(
            "items",
            "qr_code",
            cleanCode,
            "QR Profile"
          ),

          /*
            თუ ცხრილს item ჰქვია
          */

          trySearch(
            "item",
            "tag_code",
            cleanCode,
            "QR Profile"
          ),

          trySearch(
            "item",
            "qr_code",
            cleanCode,
            "QR Profile"
          ),

          /*
            Emergency შესაძლო ცხრილები
          */

          trySearch(
            "emergency_profiles",
            "tag_code",
            cleanCode,
            "Emergency"
          ),

          trySearch(
            "emergency_profiles",
            "qr_code",
            cleanCode,
            "Emergency"
          ),

          trySearch(
            "emergency",
            "tag_code",
            cleanCode,
            "Emergency"
          ),

          trySearch(
            "emergency",
            "qr_code",
            cleanCode,
            "Emergency"
          ),

          /*
            ზოგჯერ profiles ერთიან
            ცხრილად გამოიყენება
          */

          trySearch(
            "profiles",
            "tag_code",
            cleanCode,
            "Profile"
          ),

          trySearch(
            "profiles",
            "qr_code",
            cleanCode,
            "Profile"
          ),
        ]);

      const all =
        searchGroups.flat();

      /*
        დუბლიკატების მოცილება.
      */

      const unique =
        new Map<
          string,
          SearchResult
        >();

      all.forEach(
        (result) => {
          const id =
            String(
              result.data.id ??
                result.data.tag_code ??
                result.data.qr_code ??
                JSON.stringify(
                  result.data
                )
            );

          unique.set(
            `${result.source}-${id}`,
            result
          );
        }
      );

      setResults(
        Array.from(
          unique.values()
        )
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : String(err);

      setError(message);
    } finally {
      setSearching(false);
    }
  }

  if (loadingAdmin) {
    return (
      <main className="statePage">
        <div className="loader" />

        <strong>
          {ka
            ? "QR Search იტვირთება..."
            : "Loading QR Search..."}
        </strong>

        <Styles />
      </main>
    );
  }

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
            ? "QR ძებნა ხელმისაწვდომია მხოლოდ QR RETURN ადმინისტრატორისთვის."
            : "QR Search is available only to a QR RETURN administrator."}
        </p>

        <a href="/admin">
          ←{" "}
          {ka
            ? "Admin Dashboard"
            : "Admin Dashboard"}
        </a>

        <Styles />
      </main>
    );
  }

  return (
    <main className="page">
      <header className="header">
        <a
          href="/admin"
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
              ADMIN • QR SEARCH
            </small>
          </div>
        </a>

        <div className="headerRight">
          <a
            href="/admin"
            className="dashboardLink"
          >
            ← Dashboard
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

      <section className="content">
        <div className="intro">
          <div className="eyebrow">
            🔎 QR RETURN DATABASE
          </div>

          <h1>
            {ka
              ? "QR კოდით ძებნა"
              : "Search by QR Code"}
          </h1>

          <p>
            {ka
              ? "შეიყვანეთ QR / Tag Code და მოძებნეთ შესაბამისი ცხოველი, ნივთი ან Emergency პროფილი."
              : "Enter a QR / Tag Code to find the related pet, item or Emergency profile."}
          </p>
        </div>

        <form
          className="searchBox"
          onSubmit={
            handleSearch
          }
        >
          <div className="inputWrap">
            <span>QR</span>

            <input
              value={code}
              onChange={(event) =>
                setCode(
                  event.target.value
                )
              }
              placeholder={
                ka
                  ? "მაგ: ABC123"
                  : "Example: ABC123"
              }
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={
              searching ||
              !code.trim()
            }
          >
            {searching
              ? ka
                ? "იძებნება..."
                : "Searching..."
              : ka
              ? "მოძებნა"
              : "Search"}
          </button>
        </form>

        {error && (
          <div className="error">
            ⚠ {error}
          </div>
        )}

        {searching && (
          <div className="searching">
            <div className="loader" />

            <span>
              {ka
                ? "ბაზაში ძიება..."
                : "Searching database..."}
            </span>
          </div>
        )}

        {!searching &&
          searched &&
          results.length ===
            0 && (
            <div className="notFound">
              <div>
                🔍
              </div>

              <h2>
                {ka
                  ? "პროფილი ვერ მოიძებნა"
                  : "Profile not found"}
              </h2>

              <p>
                {ka
                  ? `QR კოდით “${code.trim()}” ჩანაწერი ვერ მოიძებნა.`
                  : `No record was found for QR code “${code.trim()}”.`}
              </p>
            </div>
          )}

        {!searching &&
          results.length >
            0 && (
            <section className="results">
              <div className="resultsHeader">
                <div>
                  <span>
                    {ka
                      ? "ძიების შედეგი"
                      : "Search results"}
                  </span>

                  <h2>
                    {results.length}{" "}
                    {ka
                      ? "ჩანაწერი"
                      : results.length ===
                        1
                      ? "record"
                      : "records"}
                  </h2>
                </div>

                <div className="searchedCode">
                  QR •{" "}
                  {code.trim()}
                </div>
              </div>

              <div className="resultGrid">
                {results.map(
                  (
                    result,
                    index
                  ) => (
                    <ResultCard
                      key={
                        index
                      }
                      result={
                        result
                      }
                      ka={ka}
                    />
                  )
                )}
              </div>
            </section>
          )}
      </section>

      <Styles />
    </main>
  );
}

function ResultCard({
  result,
  ka,
}: {
  result: SearchResult;
  ka: boolean;
}) {
  const data =
    result.data;

  function value(
    ...keys: string[]
  ) {
    for (const key of keys) {
      const current =
        data[key];

      if (
        current !==
          null &&
        current !==
          undefined &&
        String(
          current
        ).trim() !== ""
      ) {
        return String(
          current
        );
      }
    }

    return "";
  }

  const tagCode =
    value(
      "tag_code",
      "qr_code"
    );

  const itemName =
    value(
      "item_name",
      "name",
      "pet_name",
      "full_name"
    );

  const itemType =
    value(
      "item_type",
      "pet_type",
      "type",
      "category"
    );

  const ownerName =
    [
      value(
        "owner_first_name"
      ),
      value(
        "owner_last_name"
      ),
    ]
      .filter(Boolean)
      .join(" ") ||
    value(
      "owner_name"
    );

  const phone =
    value(
      "phone",
      "mobile",
      "owner_phone",
      "contact_phone"
    );

  const email =
    value(
      "email",
      "owner_email"
    );

  const description =
    value(
      "description",
      "additional_info",
      "medical_info",
      "chronic_diseases"
    );

  return (
    <article className="resultCard">
      <div className="resultTop">
        <div className="resultIcon">
          {result.source ===
          "Emergency"
            ? "🆘"
            : itemType
                .toLowerCase()
                .includes(
                  "dog"
                )
            ? "🐕"
            : itemType
                .toLowerCase()
                .includes(
                  "cat"
                )
            ? "🐈"
            : "🏷️"}
        </div>

        <div className="typeBadge">
          {result.source}
        </div>
      </div>

      <h3>
        {itemName ||
          itemType ||
          (ka
            ? "QR პროფილი"
            : "QR Profile")}
      </h3>

      {tagCode && (
        <div className="qrCode">
          <span>
            QR / TAG
          </span>

          <strong>
            {tagCode}
          </strong>
        </div>
      )}

      <div className="details">
        {itemType && (
          <Info
            label={
              ka
                ? "ტიპი"
                : "Type"
            }
            value={
              itemType
            }
          />
        )}

        {ownerName && (
          <Info
            label={
              ka
                ? "მფლობელი"
                : "Owner"
            }
            value={
              ownerName
            }
          />
        )}

        {phone && (
          <Info
            label={
              ka
                ? "ტელეფონი"
                : "Phone"
            }
            value={
              phone
            }
          />
        )}

        {email && (
          <Info
            label="Email"
            value={
              email
            }
          />
        )}

        {description && (
          <Info
            label={
              ka
                ? "ინფორმაცია"
                : "Information"
            }
            value={
              description
            }
            wide
          />
        )}
      </div>

      <details className="rawData">
        <summary>
          {ka
            ? "ყველა მონაცემის ნახვა"
            : "View all data"}
        </summary>

        <div className="rawGrid">
          {Object.entries(
            data
          ).map(
            ([key, val]) => {
              if (
                val ===
                  null ||
                val ===
                  undefined ||
                String(
                  val
                ).trim() ===
                  ""
              ) {
                return null;
              }

              return (
                <div
                  key={
                    key
                  }
                  className="rawRow"
                >
                  <span>
                    {key}
                  </span>

                  <strong>
                    {String(
                      val
                    )}
                  </strong>
                </div>
              );
            }
          )}
        </div>
      </details>
    </article>
  );
}

function Info({
  label,
  value,
  wide = false,
}: {
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <div
      className={
        wide
          ? "info wide"
          : "info"
      }
    >
      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>
    </div>
  );
}

function Styles() {
  return (
    <style jsx global>{`
      * {
        box-sizing: border-box;
      }

      html,
      body {
        margin: 0;
        padding: 0;
      }

      body {
        background: #f5f7fb;
      }

      button,
      input {
        font: inherit;
      }

      .page {
        min-height: 100vh;

        color: #101828;

        font-family:
          Inter,
          Arial,
          sans-serif;

        background:
          radial-gradient(
            circle at 92% 4%,
            rgba(
              20,
              101,
              232,
              0.09
            ),
            transparent 25%
          ),
          #f5f7fb;
      }

      .header {
        width:
          calc(
            100% - 32px
          );

        max-width: 1160px;

        min-height: 78px;

        margin: auto;

        display: flex;

        align-items: center;

        justify-content:
          space-between;

        gap: 20px;

        border-bottom:
          1px solid #e4e7ec;
      }

      .brand {
        display: flex;

        align-items: center;

        gap: 11px;

        text-decoration: none;
      }

      .logo {
        width: 45px;
        height: 45px;

        display: grid;
        place-items: center;

        border-radius: 13px;

        background:
          linear-gradient(
            135deg,
            #1465e8,
            #7655f7
          );

        color: white;

        font-size: 12px;

        font-weight: 900;
      }

      .brand strong,
      .brand small {
        display: block;
      }

      .brand strong {
        color: #1465e8;

        font-size: 18px;

        font-weight: 900;
      }

      .brand small {
        margin-top: 3px;

        color: #7655f7;

        font-size: 8px;

        font-weight: 900;

        letter-spacing: 1.7px;
      }

      .headerRight {
        display: flex;

        align-items: center;

        gap: 12px;
      }

      .dashboardLink {
        color: #475467;

        font-size: 10px;

        font-weight: 800;

        text-decoration: none;
      }

      .languages {
        padding: 4px;

        display: flex;

        border-radius: 9px;

        background: #eaecf0;
      }

      .languages button {
        padding: 7px 9px;

        border: 0;

        border-radius: 7px;

        background: transparent;

        color: #667085;

        font-size: 9px;

        font-weight: 900;

        cursor: pointer;
      }

      .languages button.active {
        background: white;

        color: #1465e8;
      }

      .content {
        width:
          calc(
            100% - 32px
          );

        max-width: 920px;

        margin: auto;

        padding:
          55px 0 90px;
      }

      .intro {
        max-width: 720px;
      }

      .eyebrow {
        color: #1465e8;

        font-size: 9px;

        font-weight: 900;

        letter-spacing: 1.7px;
      }

      .intro h1 {
        margin:
          10px 0 10px;

        font-size:
          clamp(
            34px,
            5vw,
            50px
          );

        letter-spacing: -2px;
      }

      .intro p {
        margin: 0;

        color: #667085;

        font-size: 14px;

        line-height: 1.65;
      }

      .searchBox {
        margin-top: 32px;

        padding: 12px;

        display: flex;

        gap: 10px;

        border:
          1px solid #e4e7ec;

        border-radius: 17px;

        background: white;

        box-shadow:
          0 10px 32px
          rgba(
            16,
            24,
            40,
            0.05
          );
      }

      .inputWrap {
        min-width: 0;

        flex: 1;

        display: flex;

        align-items: center;

        border:
          1px solid #d0d5dd;

        border-radius: 11px;

        overflow: hidden;
      }

      .inputWrap span {
        align-self: stretch;

        padding:
          0 14px;

        display: grid;

        place-items: center;

        background: #eef4ff;

        color: #1465e8;

        font-size: 11px;

        font-weight: 900;
      }

      .inputWrap input {
        width: 100%;

        min-height: 48px;

        padding:
          0 14px;

        border: 0;

        outline: none;

        color: #101828;

        font-size: 14px;

        font-weight: 700;

        text-transform: uppercase;
      }

      .searchBox > button {
        min-width: 115px;

        min-height: 50px;

        padding:
          0 18px;

        border: 0;

        border-radius: 11px;

        background: #1465e8;

        color: white;

        font-size: 11px;

        font-weight: 900;

        cursor: pointer;
      }

      .searchBox > button:disabled {
        opacity: 0.45;

        cursor: not-allowed;
      }

      .searching {
        min-height: 240px;

        display: flex;

        flex-direction: column;

        align-items: center;

        justify-content: center;

        gap: 12px;

        color: #667085;

        font-size: 11px;
      }

      .loader {
        width: 34px;
        height: 34px;

        border:
          3px solid #e4e7ec;

        border-top-color:
          #1465e8;

        border-radius: 50%;

        animation:
          spin 0.8s
          linear infinite;
      }

      @keyframes spin {
        to {
          transform:
            rotate(360deg);
        }
      }

      .notFound {
        margin-top: 25px;

        padding:
          55px 20px;

        border:
          1px dashed #d0d5dd;

        border-radius: 18px;

        background: white;

        text-align: center;
      }

      .notFound > div {
        font-size: 40px;
      }

      .notFound h2 {
        margin:
          10px 0 5px;

        font-size: 18px;
      }

      .notFound p {
        margin: 0;

        color: #667085;

        font-size: 11px;
      }

      .results {
        margin-top: 30px;
      }

      .resultsHeader {
        margin-bottom: 14px;

        display: flex;

        align-items: flex-end;

        justify-content:
          space-between;

        gap: 20px;
      }

      .resultsHeader span {
        color: #667085;

        font-size: 9px;
      }

      .resultsHeader h2 {
        margin:
          4px 0 0;

        font-size: 21px;
      }

      .searchedCode {
        padding:
          7px 10px;

        border-radius: 8px;

        background: #eef4ff;

        color: #1465e8;

        font-size: 9px;

        font-weight: 900;
      }

      .resultGrid {
        display: grid;

        gap: 13px;
      }

      .resultCard {
        padding: 21px;

        border:
          1px solid #e4e7ec;

        border-radius: 18px;

        background: white;

        box-shadow:
          0 10px 30px
          rgba(
            16,
            24,
            40,
            0.04
          );
      }

      .resultTop {
        display: flex;

        align-items:
          flex-start;

        justify-content:
          space-between;
      }

      .resultIcon {
        width: 49px;
        height: 49px;

        display: grid;

        place-items: center;

        border-radius: 13px;

        background: #eef4ff;

        font-size: 24px;
      }

      .typeBadge {
        padding:
          5px 8px;

        border-radius: 7px;

        background: #f4f3ff;

        color: #5925dc;

        font-size: 8px;

        font-weight: 900;
      }

      .resultCard h3 {
        margin:
          17px 0 12px;

        color: #344054;

        font-size: 20px;
      }

      .qrCode {
        padding:
          10px 12px;

        display: flex;

        align-items: center;

        justify-content:
          space-between;

        gap: 15px;

        border-radius: 10px;

        background: #f8f9fc;
      }

      .qrCode span {
        color: #98a2b3;

        font-size: 8px;

        font-weight: 900;
      }

      .qrCode strong {
        color: #1465e8;

        font-size: 12px;

        letter-spacing: 1px;
      }

      .details {
        margin-top: 14px;

        display: grid;

        grid-template-columns:
          repeat(
            2,
            1fr
          );

        gap: 9px;
      }

      .info {
        padding:
          10px;

        border-radius: 10px;

        background: #fafbfc;
      }

      .info.wide {
        grid-column:
          1 / -1;
      }

      .info span,
      .info strong {
        display: block;
      }

      .info span {
        color: #98a2b3;

        font-size: 8px;
      }

      .info strong {
        margin-top: 4px;

        color: #344054;

        font-size: 11px;

        line-height: 1.45;

        word-break:
          break-word;
      }

      .rawData {
        margin-top: 15px;

        border-top:
          1px solid #eaecf0;

        padding-top: 12px;
      }

      .rawData summary {
        color: #1465e8;

        font-size: 9px;

        font-weight: 900;

        cursor: pointer;
      }

      .rawGrid {
        margin-top: 10px;

        display: grid;

        gap: 5px;
      }

      .rawRow {
        padding:
          7px 9px;

        display: grid;

        grid-template-columns:
          minmax(
            120px,
            0.35fr
          )
          1fr;

        gap: 10px;

        border-radius: 7px;

        background: #fafbfc;
      }

      .rawRow span {
        color: #98a2b3;

        font-size: 8px;

        word-break:
          break-word;
      }

      .rawRow strong {
        color: #475467;

        font-size: 9px;

        font-weight: 700;

        word-break:
          break-word;
      }

      .error {
        margin-top: 16px;

        padding: 11px;

        border:
          1px solid #fecdca;

        border-radius: 10px;

        background: #fff1f0;

        color: #b42318;

        font-size: 10px;
      }

      .statePage {
        min-height: 100vh;

        padding: 30px;

        display: flex;

        flex-direction:
          column;

        align-items: center;

        justify-content:
          center;

        background: #f5f7fb;

        color: #344054;

        font-family:
          Inter,
          Arial,
          sans-serif;

        text-align: center;
      }

      .statePage p {
        max-width: 430px;

        color: #667085;

        font-size: 12px;

        line-height: 1.55;
      }

      .statePage a {
        margin-top: 11px;

        padding:
          10px 14px;

        border-radius: 9px;

        background: #1465e8;

        color: white;

        font-size: 10px;

        font-weight: 900;

        text-decoration: none;
      }

      .lock {
        font-size: 40px;
      }

      @media (
        max-width: 650px
      ) {
        .header {
          min-height: 72px;
        }

        .dashboardLink {
          display: none;
        }

        .content {
          padding-top: 38px;
        }

        .searchBox {
          flex-direction:
            column;
        }

        .searchBox > button {
          width: 100%;
        }

        .details {
          grid-template-columns:
            1fr;
        }

        .info.wide {
          grid-column: auto;
        }

        .resultsHeader {
          align-items:
            flex-start;

          flex-direction:
            column;
        }

        .rawRow {
          grid-template-columns:
            1fr;
        }
      }
    `}</style>
  );
}
