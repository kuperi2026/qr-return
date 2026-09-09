"use client";

type ProfileFor = "self" | "other" | "";

type Props = {
  profileFor: ProfileFor;
  setProfileFor: (value: ProfileFor) => void;

  onBack: () => void;
  onNext: () => void;
};

export default function EmergencyStep1({
  profileFor,
  setProfileFor,
  onBack,
  onNext,
}: Props) {
  const ready = profileFor !== "";

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
            აირჩიეთ, ვისთვის ქმნით Emergency პროფილს.
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

      <div className="actions emergencyStep1Actions">
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
