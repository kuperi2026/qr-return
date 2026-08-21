"use client";

type FinderVisibilitySectionProps = {
  showEmail: boolean;
  setShowEmail: (value: boolean) => void;

  showAddress: boolean;
  setShowAddress: (value: boolean) => void;

  showPetPhoto: boolean;
  setShowPetPhoto: (value: boolean) => void;

  showMedicalInfo: boolean;
  setShowMedicalInfo: (value: boolean) => void;

  showBehaviourNote: boolean;
  setShowBehaviourNote: (value: boolean) => void;

  showDescription: boolean;
  setShowDescription: (value: boolean) => void;

  showFinderMessage: boolean;
  setShowFinderMessage: (value: boolean) => void;
};

export default function FinderVisibilitySection({
  showEmail,
  setShowEmail,
  showAddress,
  setShowAddress,
  showPetPhoto,
  setShowPetPhoto,
  showMedicalInfo,
  setShowMedicalInfo,
  showBehaviourNote,
  setShowBehaviourNote,
  showDescription,
  setShowDescription,
  showFinderMessage,
  setShowFinderMessage,
}: FinderVisibilitySectionProps) {
  return (
    <>
      <section className="sectionCard">
        <div className="sectionHeader">
          <div className="sectionNumber">03</div>

          <div>
            <span>FINDER VIEW</span>

            <h3>რას დაინახავს მპოვნელი?</h3>

            <p>
              ძირითადი საკონტაქტო ინფორმაცია ყოველთვის ხელმისაწვდომია.
              დამატებითი ინფორმაციის ჩვენებას თავად აკონტროლებთ.
            </p>
          </div>
        </div>

        <div className="alwaysVisible">
          <div className="alwaysTitle">
            <span className="lockIcon">✓</span>

            <div>
              <strong>ყოველთვის ხილული ინფორმაცია</strong>

              <p>
                ამ ველების გამორთვა შეუძლებელია.
              </p>
            </div>
          </div>

          <div className="requiredGrid">
            <RequiredItem
              label="სახელი"
              text="მფლობელის სახელი"
            />

            <RequiredItem
              label="გვარი"
              text="მფლობელის გვარი"
            />

            <RequiredItem
              label="ტელეფონი"
              text="მფლობელის ტელეფონის ნომერი"
            />
          </div>
        </div>

        <div className="optionalArea">
          <div className="optionalHeading">
            <span>OPTIONAL INFORMATION</span>

            <h4>
              დამატებითი ინფორმაციის ჩვენება
            </h4>

            <p>
              ჩართეთ მხოლოდ ის ინფორმაცია, რომლის ნახვაც გსურთ QR კოდის
              მპოვნელისთვის.
            </p>
          </div>

          <div className="toggleList">
            <ToggleRow
              label="ელფოსტა"
              text="მპოვნელს აჩვენოს თქვენი Email მისამართი."
              checked={showEmail}
              onChange={setShowEmail}
            />

            <ToggleRow
              label="მისამართი"
              text="მპოვნელს აჩვენოს თქვენს პროფილში მითითებული მისამართი."
              checked={showAddress}
              onChange={setShowAddress}
            />

            <ToggleRow
              label="ცხოველის ფოტო"
              text="Finder View-ში გამოჩნდეს ცხოველის ფოტო."
              checked={showPetPhoto}
              onChange={setShowPetPhoto}
            />

            <ToggleRow
              label="სამედიცინო ინფორმაცია"
              text="აჩვენეთ, თუ მპოვნელისთვის აუცილებელია ჯანმრთელობის შესახებ ინფორმაციის ცოდნა."
              checked={showMedicalInfo}
              onChange={setShowMedicalInfo}
            />

            <ToggleRow
              label="ქცევის შესახებ ინფორმაცია"
              text="აჩვენეთ ქცევის შენიშვნა უსაფრთხო მოპყრობისთვის."
              checked={showBehaviourNote}
              onChange={setShowBehaviourNote}
            />

            <ToggleRow
              label="დამატებითი აღწერა"
              text="აჩვენეთ ცხოველის დამატებითი აღწერა და განმასხვავებელი ნიშნები."
              checked={showDescription}
              onChange={setShowDescription}
            />

            <ToggleRow
              label="შეტყობინება მპოვნელისთვის"
              text="აჩვენეთ თქვენ მიერ დაწერილი პირადი შეტყობინება Finder View-ში."
              checked={showFinderMessage}
              onChange={setShowFinderMessage}
            />
          </div>
        </div>

        <div className="privacyNote">
          <div className="privacyIcon">✓</div>

          <div>
            <strong>თქვენ აკონტროლებთ დამატებით ინფორმაციას</strong>

            <p>
              ამ პარამეტრების შეცვლა მოგვიანებითაც შეგიძლიათ პროფილის
              რედაქტირების გვერდიდან.
            </p>
          </div>
        </div>
      </section>

      <style jsx>{`
        .sectionCard {
          margin-top: 16px;
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

          align-items: flex-start;

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

        .alwaysVisible {
          margin-top: 23px;

          padding: 18px;

          border: 1px solid #cfe0f6;
          border-radius: 13px;

          background: #f6f9ff;
        }

        .alwaysTitle {
          display: flex;
          align-items: flex-start;

          gap: 10px;
        }

        .lockIcon {
          width: 28px;
          height: 28px;

          flex: 0 0 28px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          background: #1266e9;
          color: #ffffff;

          font-size: 9px;
          font-weight: 950;
        }

        .alwaysTitle strong {
          display: block;

          color: #29425e;

          font-size: 10px;
          font-weight: 900;
        }

        .alwaysTitle p {
          margin: 3px 0 0;

          color: #7e8da0;

          font-size: 8px;
        }

        .requiredGrid {
          margin-top: 15px;

          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));

          gap: 10px;
        }

        .optionalArea {
          margin-top: 27px;
        }

        .optionalHeading > span {
          color: #1266e9;

          font-size: 8px;
          font-weight: 900;

          letter-spacing: 1.2px;
        }

        .optionalHeading h4 {
          margin: 5px 0 0;

          color: #2b415a;

          font-size: 14px;
        }

        .optionalHeading p {
          margin: 6px 0 0;

          color: #8491a0;

          font-size: 8px;
          line-height: 1.55;
        }

        .toggleList {
          margin-top: 14px;

          display: grid;

          border-top:
            1px solid #e2e9f1;
        }

        .privacyNote {
          margin-top: 22px;

          padding: 13px 14px;

          display: flex;
          align-items: flex-start;

          gap: 9px;

          border: 1px solid #d8e4f3;
          border-radius: 11px;

          background: #fafcff;
        }

        .privacyIcon {
          width: 23px;
          height: 23px;

          flex: 0 0 23px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          background: #e8f1ff;
          color: #1266e9;

          font-size: 8px;
          font-weight: 950;
        }

        .privacyNote strong {
          display: block;

          color: #52667c;

          font-size: 9px;
        }

        .privacyNote p {
          margin: 3px 0 0;

          color: #8996a5;

          font-size: 8px;
          line-height: 1.5;
        }

        @media (max-width: 650px) {
          .sectionCard {
            padding: 19px;
          }

          .requiredGrid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}

function RequiredItem({
  label,
  text,
}: {
  label: string;
  text: string;
}) {
  return (
    <>
      <div className="requiredItem">
        <div className="check">✓</div>

        <div>
          <strong>{label}</strong>
          <p>{text}</p>
        </div>
      </div>

      <style jsx>{`
        .requiredItem {
          min-height: 65px;

          padding: 11px;

          display: flex;
          align-items: center;

          gap: 8px;

          border: 1px solid #dbe7f5;
          border-radius: 10px;

          background: #ffffff;
        }

        .check {
          width: 24px;
          height: 24px;

          flex: 0 0 24px;

          display: grid;
          place-items: center;

          border-radius: 7px;

          background: #edf4ff;
          color: #1266e9;

          font-size: 8px;
          font-weight: 950;
        }

        strong {
          display: block;

          color: #344c66;

          font-size: 9px;
        }

        p {
          margin: 3px 0 0;

          color: #8b98a7;

          font-size: 7px;
          line-height: 1.4;
        }
      `}</style>
    </>
  );
}

function ToggleRow({
  label,
  text,
  checked,
  onChange,
}: {
  label: string;
  text: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <>
      <div className="toggleRow">
        <div className="toggleText">
          <strong>{label}</strong>
          <p>{text}</p>
        </div>

        <button
          type="button"
          className={
            checked
              ? "toggle active"
              : "toggle"
          }
          onClick={() =>
            onChange(!checked)
          }
          aria-pressed={checked}
        >
          <span />
        </button>
      </div>

      <style jsx>{`
        .toggleRow {
          min-height: 70px;

          padding: 13px 3px;

          display: flex;
          justify-content: space-between;
          align-items: center;

          gap: 18px;

          border-bottom:
            1px solid #e2e9f1;
        }

        .toggleText {
          min-width: 0;
        }

        .toggleText strong {
          display: block;

          color: #344b64;

          font-size: 10px;
        }

        .toggleText p {
          max-width: 520px;

          margin: 4px 0 0;

          color: #8996a5;

          font-size: 8px;
          line-height: 1.5;
        }

        .toggle {
          width: 45px;
          height: 25px;

          flex: 0 0 45px;

          padding: 3px;

          border: 0;
          border-radius: 999px;

          background: #dce4ed;

          cursor: pointer;

          transition:
            background 0.2s ease;
        }

        .toggle span {
          width: 19px;
          height: 19px;

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
          transform: translateX(20px);
        }
      `}</style>
    </>
  );
}
