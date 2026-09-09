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
  setTagCode: (value: string) => void;
  tagPrefilled: boolean;

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
  setTagCode,
  tagPrefilled,

  onBack,
  onNext,
}: Props) {
  const ready =
    tagCode.trim() !== "" &&
    ownerFirstName.trim() !== "" &&
    ownerLastName.trim() !== "" &&
    ownerPhone.trim() !== "" &&
    ownerEmail.trim() !== "";

  return (
    <>
      <div className="heading">
        <div className="headingIcon">👤</div>

        <div>
          <h1>შემქმნელის ინფორმაცია</h1>

          <p>
            შეავსეთ Emergency პროფილის მმართველის
            საკონტაქტო ინფორმაცია.
          </p>
        </div>
      </div>

      <div className="qrSection">
        <div className="field">
          <label>QR / Tag Code *</label>

          <input
            type="text"
            value={tagCode}
            onChange={(event) =>
              setTagCode(
                event.target.value
                  .toUpperCase()
                  .replace(/\s/g, "")
              )
            }
            placeholder="მაგ. EMR-000123"
            autoCapitalize="characters"
            autoComplete="off"
            readOnly={tagPrefilled}
          />
        </div>

        <div className="qrHelp qrProfileRule">
          <span>REQUIRED</span>

          <strong>
            თითოეულ სამაჯურს საკუთარი QR კოდი აქვს
          </strong>

          <p>
            Emergency პროფილი სხვა პირზე არ გადადის.
            რეგისტრაციის შემდეგ სახელისა და გვარის შეცვლა
            მხოლოდ ერთხელაა შესაძლებელი; შემდეგ პროფილში
            სხვა პირის მონაცემების შეტანა შეუძლებელია.
          </p>
        </div>
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
