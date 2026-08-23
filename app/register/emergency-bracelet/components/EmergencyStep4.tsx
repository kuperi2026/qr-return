"use client";

type Props = {
  holderName: string;
  tagCode: string;

  bloodGroup: string;
  allergies: string;
  medicalConditions: string;
  medications: string;
  medicalNotes: string;

  setBloodGroup: (value: string) => void;
  setAllergies: (value: string) => void;
  setMedicalConditions: (value: string) => void;
  setMedications: (value: string) => void;
  setMedicalNotes: (value: string) => void;

  onBack: () => void;
  onNext: () => void;
};

const bloodGroups = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];

export default function EmergencyStep4({
  holderName,
  tagCode,

  bloodGroup,
  allergies,
  medicalConditions,
  medications,
  medicalNotes,

  setBloodGroup,
  setAllergies,
  setMedicalConditions,
  setMedications,
  setMedicalNotes,

  onBack,
  onNext,
}: Props) {
  return (
    <>
      <div className="heading">
        <div className="headingIcon">
          +
        </div>

        <div>
          <span className="eyebrow">
            MEDICAL INFORMATION
          </span>

          <h1>
            სამედიცინო ინფორმაცია
          </h1>

          <p>
            დაამატეთ მხოლოდ ის ინფორმაცია, რომელიც
            გადაუდებელ სიტუაციაში შეიძლება მნიშვნელოვანი იყოს.
          </p>
        </div>
      </div>

      <div className="holderSummary">
        <div className="holderAvatar">
          👤
        </div>

        <div>
          <span>
            EMERGENCY PROFILE · {tagCode}
          </span>

          <strong>
            {holderName || "პროფილის მფლობელი"}
          </strong>

          <p>
            Emergency Bracelet
          </p>
        </div>
      </div>

      <section className="subSection firstSection">
        <div className="sectionTitle">
          <span>
            01 · BASIC MEDICAL
          </span>

          <h3>
            ძირითადი სამედიცინო ინფორმაცია
          </h3>
        </div>

        <div className="formGrid">
          <div className="field">
            <label>
              სისხლის ჯგუფი
            </label>

            <select
              value={bloodGroup}
              onChange={(event) =>
                setBloodGroup(
                  event.target.value
                )
              }
            >
              <option value="">
                აირჩიეთ
              </option>

              {bloodGroups.map((group) => (
                <option
                  key={group}
                  value={group}
                >
                  {group}
                </option>
              ))}
            </select>
          </div>

          <div className="optionalBox">
            <span>
              OPTIONAL
            </span>

            <strong>
              მხოლოდ საჭირო ინფორმაცია
            </strong>

            <p>
              სამედიცინო ველების შევსება სავალდებულო არ არის.
            </p>
          </div>
        </div>
      </section>

      <section className="subSection">
        <div className="sectionTitle">
          <span>
            02 · HEALTH DETAILS
          </span>

          <h3>
            ჯანმრთელობის მნიშვნელოვანი ინფორმაცია
          </h3>
        </div>

        <div className="textareaGrid">
          <div className="field">
            <label>
              ალერგიები
            </label>

            <textarea
              value={allergies}
              onChange={(event) =>
                setAllergies(
                  event.target.value
                )
              }
              placeholder="მაგ. პენიცილინი, თხილი..."
            />
          </div>

          <div className="field">
            <label>
              სამედიცინო მდგომარეობები
            </label>

            <textarea
              value={medicalConditions}
              onChange={(event) =>
                setMedicalConditions(
                  event.target.value
                )
              }
              placeholder="მნიშვნელოვანი მდგომარეობა ან დიაგნოზი"
            />
          </div>

          <div className="field">
            <label>
              მიმდინარე მედიკამენტები
            </label>

            <textarea
              value={medications}
              onChange={(event) =>
                setMedications(
                  event.target.value
                )
              }
              placeholder="მედიკამენტის დასახელება და საჭირო ინფორმაცია"
            />
          </div>

          <div className="field">
            <label>
              დამატებითი სამედიცინო შენიშვნა
            </label>

            <textarea
              value={medicalNotes}
              onChange={(event) =>
                setMedicalNotes(
                  event.target.value
                )
              }
              placeholder="სხვა მნიშვნელოვანი ინფორმაცია"
            />
          </div>
        </div>
      </section>

      <div className="infoBox">
        <div className="infoIcon">
          i
        </div>

        <div>
          <strong>
            კონფიდენციალურობის კონტროლი
          </strong>

          <p>
            ბოლო ნაბიჯზე მომხმარებელი თავად აირჩევს,
            ამ ინფორმაციიდან რა გამოჩნდეს QR კოდის
            სკანირებისას.
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
          onClick={onNext}
        >
          გაგრძელება
          <span>→</span>
        </button>
      </div>
    </>
  );
}
