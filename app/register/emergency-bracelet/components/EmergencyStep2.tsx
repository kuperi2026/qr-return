"use client";

type Props = {
  profileFor: "self" | "other" | "";

  ownerFirstName: string;
  ownerLastName: string;
  ownerPhone: string;
  ownerEmail: string;

  setOwnerFirstName: (value: string) => void;
  setOwnerLastName: (value: string) => void;
  setOwnerPhone: (value: string) => void;
  setOwnerEmail: (value: string) => void;

  tagCode: string;

  onBack: () => void;
  onNext: () => void;
};

export default function EmergencyStep2({
  profileFor,

  ownerFirstName,
  ownerLastName,
  ownerPhone,
  ownerEmail,

  setOwnerFirstName,
  setOwnerLastName,
  setOwnerPhone,
  setOwnerEmail,

  tagCode,

  onBack,
  onNext,
}: Props) {
  const ready =
    ownerFirstName.trim() !== "" &&
    ownerLastName.trim() !== "" &&
    ownerPhone.trim() !== "" &&
    ownerEmail.trim() !== "";

  return (
    <>
      <div className="heading">
        <div className="headingIcon">👤</div>

        <div>
          <span className="eyebrow">
            PROFILE CREATOR
          </span>

          <h1>შემქმნელის ინფორმაცია</h1>

          <p>
            ეს არის იმ ადამიანის ინფორმაცია, ვინც Emergency
            პროფილს ქმნის და მართავს.
          </p>
        </div>
      </div>

      <div className="topSummary">
        <div className="summaryItem">
          <span>QR CODE</span>
          <strong>{tagCode || "—"}</strong>
        </div>

        <div className="summaryItem">
          <span>PROFILE FOR</span>

          <strong>
            {profileFor === "self"
              ? "ჩემთვის"
              : "სხვა პირისთვის"}
          </strong>
        </div>
      </div>

      <div className="nameWarning">
        <div>!</div>

        <p>
          <strong>
            სახელი შეიყვანეთ ყურადღებით.
          </strong>{" "}
          Emergency პროფილის შექმნის შემდეგ სახელის შეცვლა
          შესაძლებელი იქნება მხოლოდ ერთხელ, დამატებითი
          იდენტიფიკაციის შემდეგ.
        </p>
      </div>

      <div className="formGrid">
        <div className="field">
          <label>სახელი *</label>

          <input
            type="text"
            value={ownerFirstName}
            onChange={(event) =>
              setOwnerFirstName(event.target.value)
            }
            placeholder="სახელი"
          />
        </div>

        <div className="field">
          <label>გვარი *</label>

          <input
            type="text"
            value={ownerLastName}
            onChange={(event) =>
              setOwnerLastName(event.target.value)
            }
            placeholder="გვარი"
          />
        </div>

        <div className="field">
          <label>ტელეფონის ნომერი *</label>

          <input
            type="tel"
            value={ownerPhone}
            onChange={(event) =>
              setOwnerPhone(event.target.value)
            }
            placeholder="+1 000 000 0000"
          />
        </div>

        <div className="field">
          <label>ელფოსტა *</label>

          <input
            type="email"
            value={ownerEmail}
            onChange={(event) =>
              setOwnerEmail(event.target.value)
            }
            placeholder="name@email.com"
          />
        </div>
      </div>

      <div className="infoBox">
        <div className="infoIcon">i</div>

        <div>
          <strong>
            პროფილის მმართველი
          </strong>

          <p>
            სახელი, გვარი, ტელეფონი და ელფოსტა ყოველთვის
            სავალდებულოა, მიუხედავად იმისა Emergency პროფილი
            თქვენთვის იქმნება თუ სხვა პირისთვის.
          </p>
        </div>
      </div>

      {profileFor === "other" && (
        <div className="infoBox">
          <div className="infoIcon">☎</div>

          <div>
            <strong>
              ძირითადი საკონტაქტო ნომერი
            </strong>

            <p>
              თუ სამაჯურის მფლობელს საკუთარი ტელეფონი არ აქვს,
              სწორედ ამ შემქმნელის ნომერი იქნება ძირითადი
              საკონტაქტო ნომერი.
            </p>
          </div>
        </div>
      )}

      <div className="actions">
        <button
          type="button"
          className="secondaryButton"
          onClick={onBack}
        >
          ← უკან
        </button>

        <button
          type="button"
          className="primaryButton"
          disabled={!ready}
          onClick={onNext}
        >
          გაგრძელება
          <span>→</span>
        </button>
      </div>
    </>
  );
}
