"use client";

type ContactOptionsSectionProps = {
  liveChatEnabled: boolean;
  setLiveChatEnabled: (value: boolean) => void;
};

export default function ContactOptionsSection({
  liveChatEnabled,
  setLiveChatEnabled,
}: ContactOptionsSectionProps) {
  return (
    <>
      <section className="sectionCard">
        <div className="sectionHeader">
          <div className="sectionNumber">04</div>

          <div>
            <span>CONTACT OPTIONS</span>

            <h3>როგორ დაგიკავშირდეს მპოვნელი?</h3>

            <p>
              ტელეფონის ნომერი ყოველთვის ხელმისაწვდომია. სურვილის
              შემთხვევაში შეგიძლიათ დამატებით ჩართოთ QR RETURN Live Chat.
            </p>
          </div>
        </div>

        <div className="contactList">
          <div className="contactRow locked">
            <div className="contactIcon">
              ☎
            </div>

            <div className="contactText">
              <div className="contactTitle">
                <strong>ტელეფონი</strong>

                <span className="requiredBadge">
                  ყოველთვის აქტიური
                </span>
              </div>

              <p>
                მპოვნელს გამოუჩნდება თქვენი ტელეფონის ნომერი და
                დარეკვის შესაძლებლობა.
              </p>
            </div>

            <div
              className="statusIcon"
              aria-label="Phone enabled"
            >
              ✓
            </div>
          </div>

          <div className="contactRow">
            <div className="contactIcon">
              ◌
            </div>

            <div className="contactText">
              <div className="contactTitle">
                <strong>QR RETURN Live Chat</strong>

                <span
                  className={
                    liveChatEnabled
                      ? "statusBadge active"
                      : "statusBadge"
                  }
                >
                  {liveChatEnabled ? "ON" : "OFF"}
                </span>
              </div>

              <p>
                ჩართვის შემთხვევაში მპოვნელს შეეძლება QR RETURN-ის
                შიდა ჩათიდან მოგწეროთ თქვენი ტელეფონის ნომრის გამოყენების
                გარეშე.
              </p>
            </div>

            <button
              type="button"
              className={
                liveChatEnabled
                  ? "toggle active"
                  : "toggle"
              }
              onClick={() =>
                setLiveChatEnabled(
                  !liveChatEnabled
                )
              }
              aria-pressed={
                liveChatEnabled
              }
              aria-label="Toggle Live Chat"
            >
              <span />
            </button>
          </div>
        </div>

        <div className="finderPreview">
          <div className="previewHeader">
            <span>FINDER VIEW</span>

            <strong>
              მპოვნელს ექნება:
            </strong>
          </div>

          <div className="previewItems">
            <div className="previewItem">
              <span>✓</span>
              ტელეფონის ნომერი
            </div>

            <div className="previewItem">
              <span>✓</span>
              დარეკვის ღილაკი
            </div>

            <div
              className={
                liveChatEnabled
                  ? "previewItem"
                  : "previewItem disabled"
              }
            >
              <span>
                {liveChatEnabled
                  ? "✓"
                  : "—"}
              </span>

              Live Chat
            </div>
          </div>
        </div>

        <div className="infoNote">
          <div className="infoIcon">
            i
          </div>

          <p>
            Live Chat-ის ჩართვა ან გამორთვა მოგვიანებითაც შეგიძლიათ
            პროფილის პარამეტრებიდან. ტელეფონი კი ძირითადი საკონტაქტო
            მეთოდია და ყოველთვის აქტიური რჩება.
          </p>
        </div>
      </section>

      <style jsx>{`
        .sectionCard {
          margin-top: 16px;

          padding: 25px;

          border:
            1px solid #dce6f1;

          border-radius: 16px;

          background: #ffffff;

          box-shadow:
            0 12px 30px
            rgba(30, 70, 120, 0.05);
        }

        .sectionHeader {
          display: grid;

          grid-template-columns:
            42px 1fr;

          align-items:
            flex-start;

          gap: 13px;

          padding-bottom: 21px;

          border-bottom:
            1px solid #e7edf4;
        }

        .sectionNumber {
          width: 38px;
          height: 38px;

          display: grid;
          place-items: center;

          border-radius: 10px;

          background: #edf4ff;

          color: #1266e9;

          font-size: 10px;
          font-weight: 950;
        }

        .sectionHeader span {
          color: #1266e9;

          font-size: 8px;
          font-weight: 900;

          letter-spacing: 1.3px;
        }

        .sectionHeader h3 {
          margin: 5px 0 0;

          color: #223951;

          font-size: 18px;
        }

        .sectionHeader p {
          max-width: 590px;

          margin: 7px 0 0;

          color: #7c8998;

          font-size: 9px;
          line-height: 1.55;
        }

        .contactList {
          margin-top: 23px;

          display: grid;

          gap: 12px;
        }

        .contactRow {
          min-height: 92px;

          padding: 16px;

          display: grid;

          grid-template-columns:
            44px 1fr auto;

          align-items: center;

          gap: 13px;

          border:
            1px solid #dce6f1;

          border-radius: 13px;

          background: #ffffff;
        }

        .contactRow.locked {
          border-color: #cfe0f6;

          background: #f7faff;
        }

        .contactIcon {
          width: 42px;
          height: 42px;

          display: grid;
          place-items: center;

          border-radius: 11px;

          background: #edf4ff;

          color: #1266e9;

          font-size: 17px;
          font-weight: 900;
        }

        .contactText {
          min-width: 0;
        }

        .contactTitle {
          display: flex;

          align-items: center;

          gap: 8px;

          flex-wrap: wrap;
        }

        .contactTitle strong {
          color: #2d455f;

          font-size: 11px;
          font-weight: 900;
        }

        .contactText p {
          max-width: 540px;

          margin: 5px 0 0;

          color: #8491a0;

          font-size: 8px;
          line-height: 1.55;
        }

        .requiredBadge,
        .statusBadge {
          padding: 4px 7px;

          border-radius: 999px;

          font-size: 7px;
          font-weight: 900;

          letter-spacing: 0.3px;
        }

        .requiredBadge {
          background: #eaf2ff;

          color: #1266e9;
        }

        .statusBadge {
          background: #edf0f4;

          color: #8b97a5;
        }

        .statusBadge.active {
          background: #e8f2ff;

          color: #1266e9;
        }

        .statusIcon {
          width: 34px;
          height: 34px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          background: #1266e9;

          color: #ffffff;

          font-size: 10px;
          font-weight: 950;
        }

        .toggle {
          width: 47px;
          height: 27px;

          flex: 0 0 47px;

          padding: 3px;

          border: 0;

          border-radius: 999px;

          background: #dce4ed;

          cursor: pointer;

          transition:
            background 0.2s ease;
        }

        .toggle span {
          width: 21px;
          height: 21px;

          display: block;

          border-radius: 50%;

          background: #ffffff;

          box-shadow:
            0 2px 5px
            rgba(30, 50, 80, 0.18);

          transition:
            transform 0.2s ease;
        }

        .toggle.active {
          background: #1266e9;
        }

        .toggle.active span {
          transform:
            translateX(20px);
        }

        .finderPreview {
          margin-top: 22px;

          padding: 17px;

          border:
            1px solid #d7e4f3;

          border-radius: 13px;

          background: #fbfdff;
        }

        .previewHeader span {
          display: block;

          color: #1266e9;

          font-size: 7px;
          font-weight: 900;

          letter-spacing: 1.2px;
        }

        .previewHeader strong {
          display: block;

          margin-top: 5px;

          color: #344b64;

          font-size: 10px;
        }

        .previewItems {
          margin-top: 13px;

          display: flex;

          gap: 8px;

          flex-wrap: wrap;
        }

        .previewItem {
          min-height: 34px;

          padding: 0 10px;

          display: inline-flex;

          align-items: center;

          gap: 6px;

          border:
            1px solid #d8e4f2;

          border-radius: 9px;

          background: #ffffff;

          color: #536a82;

          font-size: 8px;
          font-weight: 800;
        }

        .previewItem span {
          color: #1266e9;

          font-weight: 950;
        }

        .previewItem.disabled {
          opacity: 0.48;
        }

        .infoNote {
          margin-top: 16px;

          padding: 13px 14px;

          display: flex;

          align-items: flex-start;

          gap: 9px;

          border:
            1px solid #d8e4f3;

          border-radius: 11px;

          background: #f8fbff;
        }

        .infoIcon {
          width: 23px;
          height: 23px;

          flex: 0 0 23px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          background: #e8f1ff;

          color: #1266e9;

          font-size: 9px;
          font-weight: 950;
        }

        .infoNote p {
          margin: 2px 0 0;

          color: #7e8da0;

          font-size: 8px;
          line-height: 1.55;
        }

        @media (
          max-width: 600px
        ) {
          .sectionCard {
            padding: 19px;
          }

          .contactRow {
            grid-template-columns:
              40px 1fr;

            align-items:
              flex-start;
          }

          .toggle,
          .statusIcon {
            grid-column: 2;

            justify-self:
              flex-start;
          }
        }
      `}</style>
    </>
  );
}
