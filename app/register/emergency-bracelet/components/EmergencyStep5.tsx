"use client";

type Props = {
  holderName: string;
  tagCode: string;

  ownerFirstName: string;
  ownerLastName: string;
  ownerPhone: string;

  primaryContactEnabled: boolean;
  setPrimaryContactEnabled: (value: boolean) => void;

  emergencyFirstName: string;
  emergencyLastName: string;
  emergencyPhone: string;
  emergencyRelationship: string;

  setEmergencyFirstName: (value: string) => void;
  setEmergencyLastName: (value: string) => void;
  setEmergencyPhone: (value: string) => void;
  setEmergencyRelationship: (value: string) => void;

  secondContactEnabled: boolean;
  setSecondContactEnabled: (value: boolean) => void;

  secondFirstName: string;
  secondLastName: string;
  secondPhone: string;
  secondRelationship: string;

  setSecondFirstName: (value: string) => void;
  setSecondLastName: (value: string) => void;
  setSecondPhone: (value: string) => void;
  setSecondRelationship: (value: string) => void;

  onBack: () => void;
  onNext: () => void;
};

export default function EmergencyStep5({
  holderName,
  tagCode,

  ownerFirstName,
  ownerLastName,
  ownerPhone,

  primaryContactEnabled,
  setPrimaryContactEnabled,

  emergencyFirstName,
  emergencyLastName,
  emergencyPhone,
  emergencyRelationship,

  setEmergencyFirstName,
  setEmergencyLastName,
  setEmergencyPhone,
  setEmergencyRelationship,

  secondContactEnabled,
  setSecondContactEnabled,

  secondFirstName,
  secondLastName,
  secondPhone,
  secondRelationship,

  setSecondFirstName,
  setSecondLastName,
  setSecondPhone,
  setSecondRelationship,

  onBack,
  onNext,
}: Props) {
  const primaryReady =
    !primaryContactEnabled ||
    (
      emergencyFirstName.trim() !== "" &&
      emergencyLastName.trim() !== "" &&
      emergencyPhone.trim() !== "" &&
      emergencyRelationship.trim() !== ""
    );

  const secondReady =
    !secondContactEnabled ||
    (
      secondFirstName.trim() !== "" &&
      secondLastName.trim() !== "" &&
      secondPhone.trim() !== "" &&
      secondRelationship.trim() !== ""
    );

  const ready =
    primaryReady &&
    secondReady;

  return (
    <>
      <div className="heading">
        <div className="headingIcon">
          ☎
        </div>

        <div>
          <span className="eyebrow">
            EMERGENCY CONTACTS
          </span>

          <h1>
            გადაუდებელი კონტაქტები
          </h1>

          <p>
            დამატებითი Emergency Contacts არჩევითია.
            პროფილის შემქმნელის ტელეფონი უკვე გამოიყენება
            ძირითად საკონტაქტო ნომრად.
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

      <div className="creatorContact">
        <div>
          <span>
            DEFAULT CONTACT
          </span>

          <strong>
            {ownerFirstName} {ownerLastName}
          </strong>

          <p>
            {ownerPhone || "—"}
          </p>
        </div>

        <span className="requiredBadge">
          ALWAYS AVAILABLE
        </span>
      </div>

      <section className="subSection firstSection">
        <div className="sectionWithToggle">
          <div className="sectionTitle">
            <span>
              PRIMARY CONTACT · OPTIONAL
            </span>

            <h3>
              დამატებითი Emergency Contact
            </h3>
          </div>

          <button
            type="button"
            className={
              primaryContactEnabled
                ? "miniToggle on"
                : "miniToggle"
            }
            onClick={() =>
              setPrimaryContactEnabled(
                !primaryContactEnabled
              )
            }
          >
            {primaryContactEnabled
              ? "ON"
              : "OFF"}
          </button>
        </div>

        {primaryContactEnabled && (
          <div className="formGrid">
            <div className="field">
              <label>
                სახელი *
              </label>

              <input
                type="text"
                value={emergencyFirstName}
                onChange={(event) =>
                  setEmergencyFirstName(
                    event.target.value
                  )
                }
                placeholder="სახელი"
              />
            </div>

            <div className="field">
              <label>
                გვარი *
              </label>

              <input
                type="text"
                value={emergencyLastName}
                onChange={(event) =>
                  setEmergencyLastName(
                    event.target.value
                  )
                }
                placeholder="გვარი"
              />
            </div>

            <div className="field">
              <label>
                ტელეფონის ნომერი *
              </label>

              <input
                type="tel"
                value={emergencyPhone}
                onChange={(event) =>
                  setEmergencyPhone(
                    event.target.value
                  )
                }
                placeholder="+1 000 000 0000"
              />
            </div>

            <div className="field">
              <label>
                კავშირი *
              </label>

              <input
                type="text"
                value={emergencyRelationship}
                onChange={(event) =>
                  setEmergencyRelationship(
                    event.target.value
                  )
                }
                placeholder="მაგ. დედა, მეუღლე, ექიმი..."
              />
            </div>
          </div>
        )}
      </section>

      <section className="subSection">
        <div className="sectionWithToggle">
          <div className="sectionTitle">
            <span>
              SECOND CONTACT · OPTIONAL
            </span>

            <h3>
              მეორე დამატებითი კონტაქტი
            </h3>
          </div>

          <button
            type="button"
            className={
              secondContactEnabled
                ? "miniToggle on"
                : "miniToggle"
            }
            onClick={() =>
              setSecondContactEnabled(
                !secondContactEnabled
              )
            }
          >
            {secondContactEnabled
              ? "ON"
              : "OFF"}
          </button>
        </div>

        {secondContactEnabled && (
          <div className="formGrid">
            <div className="field">
              <label>
                სახელი *
              </label>

              <input
                type="text"
                value={secondFirstName}
                onChange={(event) =>
                  setSecondFirstName(
                    event.target.value
                  )
                }
                placeholder="სახელი"
              />
            </div>

            <div className="field">
              <label>
                გვარი *
              </label>

              <input
                type="text"
                value={secondLastName}
                onChange={(event) =>
                  setSecondLastName(
                    event.target.value
                  )
                }
                placeholder="გვარი"
              />
            </div>

            <div className="field">
              <label>
                ტელეფონის ნომერი *
              </label>

              <input
                type="tel"
                value={secondPhone}
                onChange={(event) =>
                  setSecondPhone(
                    event.target.value
                  )
                }
                placeholder="+1 000 000 0000"
              />
            </div>

            <div className="field">
              <label>
                კავშირი *
              </label>

              <input
                type="text"
                value={secondRelationship}
                onChange={(event) =>
                  setSecondRelationship(
                    event.target.value
                  )
                }
                placeholder="მაგ. მამა, და, მომვლელი..."
              />
            </div>
          </div>
        )}
      </section>

      {!primaryContactEnabled &&
        !secondContactEnabled && (
          <div className="optionalNotice">
            <div>
              ✓
            </div>

            <p>
              დამატებითი Emergency Contact არ არის
              სავალდებულო. შეგიძლიათ პირდაპირ გააგრძელოთ.
            </p>
          </div>
        )}

      <div className="infoBox">
        <div className="infoIcon">
          i
        </div>

        <div>
          <strong>
            ძირითადი საკონტაქტო ნომერი
          </strong>

          <p>
            QR პროფილში ყოველთვის ხელმისაწვდომი იქნება
            პროფილის შემქმნელის ნომერი:{" "}
            <strong>
              {ownerPhone || "—"}
            </strong>
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
