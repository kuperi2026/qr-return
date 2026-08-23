"use client";

type ProfileFor = "self" | "other" | "";

type Props = {
  tagCode: string;
  setTagCode: (value: string) => void;

  profileFor: ProfileFor;
  setProfileFor: (value: ProfileFor) => void;

  onBack: () => void;
  onNext: () => void;
};

export default function EmergencyStep1({
  tagCode,
  setTagCode,
  profileFor,
  setProfileFor,
  onBack,
  onNext,
}: Props) {
  const ready =
    tagCode.trim() !== "" &&
    profileFor !== "";

  return (
    <>
      <div className="heading">
        <div className="headingIcon">+</div>

        <div>
          <span className="eyebrow">
            EMERGENCY PROFILE
          </span>

          <h1>ვისთვის ქმნით პროფილს?</h1>

          <p>
            აირჩიეთ პროფილის ტიპი და შეიყვანეთ თქვენი
            Emergency Bracelet-ის QR კოდი.
          </p>
        </div>
      </div>

      <div className="qrSection">
        <div className="field">
          <label>QR კოდი *</label>

          <input
            type="text"
            value={tagCode}
            onChange={(event) =>
              setTagCode(
                event.target.value.toUpperCase()
              )
            }
            placeholder="მაგ. EMR-000123"
            autoComplete="off"
          />
        </div>

        <div className="qrHelp">
          <span>REQUIRED</span>

          <strong>
            თითოეულ სამაჯურს საკუთარი QR კოდი აქვს
          </strong>

          <p>
            კოდი დაფიქსირდება კონკრეტულ Emergency
            პროფილზე და სხვა კატეგორიად აღარ შეიცვლება.
          </p>
        </div>
      </div>

      <div className="choiceGrid">
        <button
          type="button"
          className={
            profileFor === "self"
              ? "choice active"
              : "choice"
          }
          onClick={() =>
            setProfileFor("self")
          }
        >
          <div className="choiceTop">
            <span>01</span>

            <div className="choiceCircle">
              {profileFor === "self"
                ? "✓"
                : "→"}
            </div>
          </div>

          <div className="choiceIcon">
            👤
          </div>

          <h2>ჩემთვის</h2>

          <p>
            Emergency Bracelet და პროფილი
            განკუთვნილია თქვენთვის.
          </p>
        </button>

        <button
          type="button"
          className={
            profileFor === "other"
              ? "choice active"
              : "choice"
          }
          onClick={() =>
            setProfileFor("other")
          }
        >
          <div className="choiceTop">
            <span>02</span>

            <div className="choiceCircle">
              {profileFor === "other"
                ? "✓"
                : "→"}
            </div>
          </div>

          <div className="choiceIcon">
            👥
          </div>

          <h2>სხვა პირისთვის</h2>

          <p>
            ბავშვის, ოჯახის წევრის, მოხუცის ან სხვა
            პირის Emergency Bracelet.
          </p>
        </button>
      </div>

      <div className="infoBox">
        <div className="infoIcon">i</div>

        <div>
          <strong>
            QR კოდი ორივე შემთხვევაში სავალდებულოა
          </strong>

          <p>
            შემდეგ ეტაპზე პროფილის მმართველის
            ინფორმაცია გამოყენებული იქნება Owner
            Account-იდან.
          </p>
        </div>
      </div>

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
