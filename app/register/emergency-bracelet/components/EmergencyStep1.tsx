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
      <div className="heading emergencyChoiceHeading">
        <div className="headingIcon">✚</div>

        <h1>
          აირჩიეთ, ვისთვის ქმნით Emergency პროფილს.
        </h1>

        <div className="emergencySignals" aria-label="Emergency პროფილის ნიშნები">
          <span>SOS</span>
          <span>MEDICAL ID</span>
          <span>24/7</span>
        </div>
      </div>

      <div className="choiceGrid emergencyChoiceGrid">
        <button
          type="button"
          className={
            profileFor === "self"
              ? "choice emergencyChoice active"
              : "choice emergencyChoice"
          }
          onClick={() =>
            setProfileFor("self")
          }
        >
          <div className="choiceIcon">
            👤
          </div>

          <h2>პირველი პირისთვის</h2>
        </button>

        <button
          type="button"
          className={
            profileFor === "other"
              ? "choice emergencyChoice active"
              : "choice emergencyChoice"
          }
          onClick={() =>
            setProfileFor("other")
          }
        >
          <div className="choiceIcon">
            👥
          </div>

          <h2>მესამე პირისთვის</h2>
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
