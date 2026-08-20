"use client";

import { useMemo, useState } from "react";
import {
  faqCategories,
  faqItems,
  type FAQCategory,
} from "@/data/faq";

type Props = {
  language?: "ka" | "en";
};

export default function FAQSection({
  language = "ka",
}: Props) {
  const ka = language === "ka";

  const [search, setSearch] = useState("");
  const [category, setCategory] =
    useState<FAQCategory | "all">("all");

  const [openId, setOpenId] =
    useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = search
      .trim()
      .toLowerCase();

    return faqItems.filter((item) => {
      const categoryMatch =
        category === "all" ||
        item.category === category;

      const text = ka
        ? `${item.questionKa} ${item.answerKa}`
        : `${item.questionEn} ${item.answerEn}`;

      const searchMatch =
        !q ||
        text
          .toLowerCase()
          .includes(q);

      return (
        categoryMatch &&
        searchMatch
      );
    });
  }, [search, category, ka]);

  return (
    <section
      id="faq"
      className="faqSection"
    >
      <div className="shell">
        <div className="heading">
          <span>
            QR RETURN HELP CENTER
          </span>

          <h2>
            {ka
              ? "ხშირად დასმული კითხვები"
              : "Frequently asked questions"}
          </h2>

          <p>
            {ka
              ? "მოძებნეთ პასუხი QR RETURN-ის, პროდუქტების, Emergency ID-ის, ანგარიშის, შეკვეთებისა და უსაფრთხოების შესახებ."
              : "Find answers about QR RETURN, products, Emergency ID, accounts, orders, and privacy."}
          </p>
        </div>

        <div className="searchBox">
          <SearchIcon />

          <input
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder={
              ka
                ? "მოძებნეთ კითხვა..."
                : "Search questions..."
            }
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
          {faqCategories.map(
            (item) => (
              <button
                type="button"
                key={item.id}
                className={
                  category === item.id
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setCategory(
                    item.id as
                      | FAQCategory
                      | "all"
                  )
                }
              >
                {ka
                  ? item.ka
                  : item.en}
              </button>
            )
          )}
        </div>

        <div className="summary">
          <span>
            {filtered.length}
            {ka
              ? " კითხვა"
              : " questions"}
          </span>
        </div>

        <div className="faqList">
          {filtered.map(
            (item, index) => {
              const open =
                openId === item.id;

              return (
                <article
                  className={
                    open
                      ? "faq open"
                      : "faq"
                  }
                  key={item.id}
                >
                  <button
                    type="button"
                    className="question"
                    onClick={() =>
                      setOpenId(
                        open
                          ? null
                          : item.id
                      )
                    }
                    aria-expanded={
                      open
                    }
                  >
                    <span className="number">
                      {String(
                        index + 1
                      ).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    <strong>
                      {ka
                        ? item.questionKa
                        : item.questionEn}
                    </strong>

                    <span className="toggle">
                      {open
                        ? "−"
                        : "+"}
                    </span>
                  </button>

                  <div className="answer">
                    <div>
                      <p>
                        {ka
                          ? item.answerKa
                          : item.answerEn}
                      </p>
                    </div>
                  </div>
                </article>
              );
            }
          )}
        </div>

        {filtered.length === 0 && (
          <div className="empty">
            <strong>
              {ka
                ? "პასუხი ვერ მოიძებნა"
                : "No matching question"}
            </strong>

            <p>
              {ka
                ? "სცადეთ სხვა სიტყვით მოძებნა ან აირჩიეთ სხვა კატეგორია."
                : "Try another search term or select a different category."}
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        .faqSection {
          width: 100%;
          padding: 92px 0;

          background: #f7f8f6;
        }

        .shell {
          width:
            calc(100% - 56px);

          max-width: 1050px;

          margin: 0 auto;
        }

        .heading {
          max-width: 720px;
        }

        .heading > span {
          color: #c84a50;

          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        h2 {
          margin: 10px 0 0;

          color: #1f2a35;

          font-size:
            clamp(
              35px,
              4vw,
              47px
            );

          font-weight: 680;
          line-height: 1.06;
          letter-spacing: -2px;
        }

        .heading p {
          max-width: 650px;

          margin: 15px 0 0;

          color: #737e89;

          font-size: 11px;
          line-height: 1.7;
        }

        .searchBox {
          height: 55px;

          margin-top: 32px;
          padding: 0 17px;

          display: grid;
          grid-template-columns:
            auto 1fr auto;

          align-items: center;

          gap: 11px;

          border:
            1px solid #dfe3e6;

          border-radius: 14px;

          background: white;

          box-shadow:
            0 8px 25px
            rgba(
              31,
              42,
              53,
              0.035
            );
        }

        .searchBox
          :global(svg) {
          width: 17px;
          height: 17px;

          color: #89939d;
        }

        input {
          width: 100%;

          border: 0;
          outline: 0;

          color: #2b3742;
          background: transparent;

          font-size: 11px;
        }

        input::placeholder {
          color: #a3abb3;
        }

        .searchBox button {
          border: 0;

          color: #8e979f;
          background: transparent;

          cursor: pointer;

          font-size: 19px;
        }

        .categories {
          margin-top: 16px;

          display: flex;
          flex-wrap: wrap;

          gap: 6px;
        }

        .categories button {
          min-height: 32px;

          padding: 0 11px;

          border:
            1px solid #dce1e4;

          border-radius: 999px;

          color: #697480;
          background: white;

          cursor: pointer;

          font-size: 7px;
          font-weight: 800;

          transition:
            0.18s ease;
        }

        .categories button:hover {
          border-color: #bcc5cd;
        }

        .categories
          button.active {
          color: white;

          border-color: #202b37;

          background: #202b37;
        }

        .summary {
          margin-top: 34px;

          padding-bottom: 10px;

          border-bottom:
            1px solid #dce1e4;
        }

        .summary span {
          color: #9aa2aa;

          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.6px;
        }

        .faq {
          border-bottom:
            1px solid #dce1e4;
        }

        .question {
          width: 100%;
          min-height: 75px;

          padding: 0 4px;

          display: grid;
          grid-template-columns:
            43px
            minmax(0, 1fr)
            36px;

          align-items: center;

          gap: 12px;

          border: 0;

          color: #2c3742;
          background: transparent;

          text-align: left;

          cursor: pointer;
        }

        .number {
          color: #a7afb7;

          font-size: 7px;
          font-weight: 900;
        }

        .question strong {
          font-size: 12px;
          font-weight: 780;
          line-height: 1.4;
        }

        .toggle {
          width: 31px;
          height: 31px;

          display: grid;
          place-items: center;

          border:
            1px solid #d9dfe3;

          border-radius: 50%;

          color: #5e6974;
          background: white;

          font-size: 17px;
          font-weight: 400;

          transition:
            0.18s ease;
        }

        .faq.open
          .question strong {
          color: #1f5fc2;
        }

        .faq.open .toggle {
          color: #1f5fc2;

          border-color: #c5d3e7;

          background: #f5f8fd;
        }

        .answer {
          display: grid;

          grid-template-rows:
            0fr;

          transition:
            grid-template-rows
            0.25s ease;
        }

        .answer > div {
          overflow: hidden;
        }

        .answer p {
          max-width: 790px;

          margin: 0;

          padding:
            0
            65px
            0
            59px;

          color: #6f7a85;

          font-size: 10px;
          line-height: 1.75;
        }

        .faq.open .answer {
          grid-template-rows:
            1fr;
        }

        .faq.open
          .answer p {
          padding-bottom: 24px;
        }

        .empty {
          padding: 55px 20px;

          text-align: center;
        }

        .empty strong {
          color: #36424d;

          font-size: 13px;
        }

        .empty p {
          margin: 7px 0 0;

          color: #8a939c;

          font-size: 9px;
        }

        @media (
          max-width: 650px
        ) {
          .faqSection {
            padding: 65px 0;
          }

          .shell {
            width:
              calc(100% - 28px);
          }

          .question {
            grid-template-columns:
              29px
              minmax(0, 1fr)
              34px;

            gap: 8px;
          }

          .question strong {
            font-size: 11px;
          }

          .answer p {
            padding-left: 37px;
            padding-right: 10px;
          }

          .categories {
            flex-wrap: nowrap;

            overflow-x: auto;

            padding-bottom: 5px;
          }

          .categories button {
            flex: 0 0 auto;
          }
        }
      `}</style>
    </section>
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
