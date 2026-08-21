"use client";

type OwnerInformationSectionProps = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

export default function OwnerInformationSection({
  firstName,
  lastName,
  phone,
  email,
}: OwnerInformationSectionProps) {
  return (
    <>
      <section className="sectionCard">
        <div className="sectionHeader">
          <div className="sectionNumber">01</div>

          <div>
            <span>OWNER INFORMATION</span>

            <h3>მფლობელის ინფორმაცია</h3>

            <p>
              ეს მონაცემები თქვენს ანგარიშს ეკუთვნის და ყველა თქვენს QR
              პროფილთან არის დაკავშირებული.
            </p>
          </div>
        </div>

        <div className="ownerNotice">
          <div className="noticeIcon">✓</div>

          <div>
            <strong>ინფორმაცია მიღებულია თქვენი ანგარიშიდან</strong>

            <p>
              პროდუქტის რეგისტრაციისას ანგარიშის შექმნა თავიდან აღარ არის
              საჭირო.
            </p>
          </div>
        </div>

        <div className="ownerGrid">
          <OwnerField
            label="სახელი"
            value={firstName}
            requiredVisible
          />

          <OwnerField
            label="გვარი"
            value={lastName}
            requiredVisible
          />

          <OwnerField
            label="ტელეფონის ნომერი"
            value={phone}
            requiredVisible
          />

          <OwnerField
            label="ელფოსტა"
            value={email}
          />
        </div>

        <div className="visibilityBox">
          <div className="visibilityIcon">i</div>

          <div>
            <strong>Finder View</strong>

            <p>
              სახელი, გვარი და ტელეფონის ნომერი მპოვნელისთვის ყოველთვის
              ხილულია. ელფოსტის ჩვენება მოგვიანებით შეგიძლიათ ჩართოთ ან
              გამორთოთ.
            </p>
          </div>
        </div>
      </section>

      <style jsx>{`
        .sectionCard {
          padding: 25px;

          border: 1px solid #dce6f1;
          border-radius: 16px;

          background: #ffffff;

          box-shadow:
            0 12px 30px
            rgba(30, 70, 120, 0.05);
        }

        .sectionHeader {
          display: grid;
          grid-template-columns: 42px 1fr;

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

        .ownerNotice {
          margin-top: 22px;

          padding: 13px 14px;

          display: flex;
          align-items: flex-start;

          gap: 9px;

          border:
            1px solid #d6e4f5;

          border-radius: 11px;

          background: #f7faff;
        }

        .noticeIcon {
          width: 24px;
          height: 24px;

          flex: 0 0 24px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          background: #1266e9;
          color: #ffffff;

          font-size: 9px;
          font-weight: 950;
        }

        .ownerNotice strong {
          display: block;

          color: #344c66;

          font-size: 9px;
          font-weight: 900;
        }

        .ownerNotice p {
          margin: 3px 0 0;

          color: #7f8da0;

          font-size: 8px;
          line-height: 1.5;
        }

        .ownerGrid {
          margin-top: 20px;

          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 12px;
        }

        .visibilityBox {
          margin-top: 18px;

          padding: 13px 14px;

          display: flex;
          align-items: flex-start;

          gap: 9px;

          border:
            1px solid #e0e8f1;

          border-radius: 11px;

          background: #fbfcfe;
        }

        .visibilityIcon {
          width: 23px;
          height: 23px;

          flex: 0 0 23px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          background: #eaf2ff;
          color: #1266e9;

          font-size: 9px;
          font-weight: 950;
        }

        .visibilityBox strong {
          display: block;

          color: #536981;

          font-size: 9px;
        }

        .visibilityBox p {
          margin: 3px 0 0;

          color: #8996a5;

          font-size: 8px;
          line-height: 1.5;
        }

        @media (max-width: 600px) {
          .sectionCard {
            padding: 19px;
          }

          .ownerGrid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}

function OwnerField({
  label,
  value,
  requiredVisible = false,
}: {
  label: string;
  value: string;
  requiredVisible?: boolean;
}) {
  return (
    <>
      <div className="ownerField">
        <div className="fieldTop">
          <span>{label}</span>

          {requiredVisible && (
            <small>
              ALWAYS VISIBLE
            </small>
          )}
        </div>

        <strong>
          {value || "—"}
        </strong>
      </div>

      <style jsx>{`
        .ownerField {
          min-height: 75px;

          padding: 13px 14px;

          border: 1px solid #dce6f1;
          border-radius: 11px;

          background: #ffffff;
        }

        .fieldTop {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 8px;
        }

        .fieldTop > span {
          color: #8a97a6;

          font-size: 8px;
          font-weight: 800;
        }

        .fieldTop small {
          padding: 3px 6px;

          border-radius: 999px;

          background: #edf4ff;

          color: #1266e9;

          font-size: 6px;
          font-weight: 900;
        }

        .ownerField > strong {
          display: block;

          margin-top: 11px;

          color: #2d455f;

          font-size: 12px;
          font-weight: 850;

          word-break: break-word;
        }
      `}</style>
    </>
  );
}
