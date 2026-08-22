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
      <section className="ownerCard">
        <div className="cardHeader">
          <div className="checkIcon">
            ✓
          </div>

          <div>
            <span className="eyebrow">
              ACCOUNT INFORMATION
            </span>

            <h2>
              ინფორმაცია მიღებულია თქვენი ანგარიშიდან
            </h2>

            <p>
              პროდუქტის რეგისტრაციისას ანგარიშის შექმნა
              თავიდან აღარ არის საჭირო.
            </p>
          </div>
        </div>

        <div className="ownerGrid">
          <div className="infoBox">
            <div className="labelRow">
              <span className="label">
                სახელი
              </span>

              <span className="required">
                ALWAYS VISIBLE
              </span>
            </div>

            <strong>
              {firstName || "—"}
            </strong>
          </div>

          <div className="infoBox">
            <div className="labelRow">
              <span className="label">
                გვარი
              </span>

              <span className="required">
                ALWAYS VISIBLE
              </span>
            </div>

            <strong>
              {lastName || "—"}
            </strong>
          </div>

          <div className="infoBox">
            <div className="labelRow">
              <span className="label">
                ტელეფონის ნომერი
              </span>

              <span className="required">
                ALWAYS VISIBLE
              </span>
            </div>

            <strong>
              {phone || "—"}
            </strong>
          </div>

          <div className="infoBox">
            <div className="labelRow">
              <span className="label">
                ელფოსტა
              </span>

              <span className="optional">
                OPTIONAL
              </span>
            </div>

            <strong>
              {email || "—"}
            </strong>
          </div>
        </div>

        <div className="finderNotice">
          <div className="noticeIcon">
            i
          </div>

          <div>
            <strong>
              Finder View
            </strong>

            <p>
              სახელი, გვარი და ტელეფონის ნომერი
              მპოვნელისთვის ყოველთვის ხილულია.
              ელფოსტის ჩვენება მოგვიანებით შეგიძლიათ
              ჩართოთ ან გამორთოთ.
            </p>
          </div>
        </div>

        <div className="rulesGrid">
          <div className="rule">
            <div className="number">
              01
            </div>

            <div>
              <strong>
                ფიქსირებული კატეგორია
              </strong>

              <p>
                პროფილის ტიპი შექმნის შემდეგ
                აღარ შეიცვლება.
              </p>
            </div>
          </div>

          <div className="rule">
            <div className="number">
              02
            </div>

            <div>
              <strong>
                რედაქტირებადი მონაცემები
              </strong>

              <p>
                სახელი, ფოტო, აღწერა და სხვა
                ინფორმაცია მოგვიანებით შეგიძლიათ
                შეცვალოთ.
              </p>
            </div>
          </div>

          <div className="rule">
            <div className="number">
              03
            </div>

            <div>
              <strong>
                Finder View
              </strong>

              <p>
                მპოვნელს გამოუჩნდება მხოლოდ ის
                ინფორმაცია, რომელიც შესაბამის
                პროფილშია დაშვებული.
              </p>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .ownerCard {
          width: 100%;

          padding: 28px;

          border: 1px solid #dce6f1;
          border-radius: 18px;

          background: #ffffff;

          box-shadow:
            0 12px 32px
            rgba(30, 70, 120, 0.05);
        }

        .cardHeader {
          display: flex;
          align-items: flex-start;

          gap: 15px;

          padding-bottom: 22px;

          border-bottom:
            1px solid #e5ebf2;
        }

        .checkIcon {
          width: 44px;
          height: 44px;

          flex: 0 0 44px;

          display: grid;
          place-items: center;

          border-radius: 12px;

          background: #1266e9;

          color: #ffffff;

          font-size: 18px;
          font-weight: 900;
        }

        .eyebrow {
          display: block;

          color: #1266e9;

          font-size: 12px;
          font-weight: 900;

          letter-spacing: 0.8px;
        }

        .cardHeader h2 {
          margin: 6px 0 0;

          color: #243d57;

          font-size: 21px;
          line-height: 1.25;
        }

        .cardHeader p {
          margin: 7px 0 0;

          color: #738397;

          font-size: 14px;
          line-height: 1.6;
        }

        .ownerGrid {
          margin-top: 22px;

          display: grid;

          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 12px;
        }

        .infoBox {
          min-height: 92px;

          padding: 16px;

          border: 1px solid #dce5ef;
          border-radius: 12px;

          background: #fafcff;
        }

        .labelRow {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 10px;
        }

        .label {
          color: #65778b;

          font-size: 13px;
          font-weight: 750;
        }

        .required,
        .optional {
          padding: 4px 7px;

          border-radius: 999px;

          font-size: 10px;
          font-weight: 900;

          white-space: nowrap;
        }

        .required {
          background: #eaf2ff;
          color: #1266e9;
        }

        .optional {
          background: #f0f3f7;
          color: #7c8998;
        }

        .infoBox strong {
          display: block;

          margin-top: 13px;

          color: #263f59;

          font-size: 16px;
          font-weight: 850;

          word-break: break-word;
        }

        .finderNotice {
          margin-top: 18px;

          padding: 17px;

          display: flex;
          align-items: flex-start;

          gap: 11px;

          border: 1px solid #cfe0f6;
          border-radius: 13px;

          background: #f3f8ff;
        }

        .noticeIcon {
          width: 30px;
          height: 30px;

          flex: 0 0 30px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          background: #1266e9;

          color: #ffffff;

          font-size: 13px;
          font-weight: 900;
        }

        .finderNotice strong {
          display: block;

          color: #34516e;

          font-size: 15px;
        }

        .finderNotice p {
          margin: 5px 0 0;

          color: #6e8094;

          font-size: 14px;
          line-height: 1.6;
        }

        .rulesGrid {
          margin-top: 18px;

          display: grid;

          grid-template-columns:
            repeat(3, minmax(0, 1fr));

          gap: 11px;
        }

        .rule {
          min-height: 150px;

          padding: 16px;

          border: 1px solid #e0e7ef;
          border-radius: 13px;

          background: #ffffff;
        }

        .number {
          width: 36px;
          height: 36px;

          display: grid;
          place-items: center;

          border-radius: 10px;

          background: #edf4ff;

          color: #1266e9;

          font-size: 12px;
          font-weight: 900;
        }

        .rule strong {
          display: block;

          margin-top: 14px;

          color: #344d67;

          font-size: 14px;
          line-height: 1.35;
        }

        .rule p {
          margin: 7px 0 0;

          color: #75869a;

          font-size: 13px;
          line-height: 1.55;
        }

        @media (max-width: 750px) {
          .rulesGrid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .ownerCard {
            padding: 20px;
          }

          .ownerGrid {
            grid-template-columns: 1fr;
          }

          .cardHeader h2 {
            font-size: 19px;
          }

          .cardHeader p,
          .finderNotice p {
            font-size: 14px;
          }

          .label {
            font-size: 13px;
          }

          .infoBox strong {
            font-size: 16px;
          }
        }
      `}</style>
    </>
  );
}
