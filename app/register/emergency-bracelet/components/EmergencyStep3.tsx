"use client";

type Relationship =
  | "parent"
  | "child"
  | "spouse"
  | "sibling"
  | "grandparent"
  | "caregiver"
  | "guardian"
  | "other"
  | "";

const relationshipLabels: Record<
  Exclude<Relationship, "">,
  string
> = {
  parent: "მშობელი",
  child: "შვილი",
  spouse: "მეუღლე",
  sibling: "და / ძმა",
  grandparent: "ბებია / ბაბუა",
  caregiver: "მომვლელი",
  guardian: "მეურვე",
  other: "სხვა",
};

type Props = {
  tagCode: string;

  ownerFirstName: string;
  ownerLastName: string;
  ownerPhone: string;
  ownerEmail: string;

  holderFirstName: string;
  holderLastName: string;
  holderBirthDate: string;
  holderSex: string;

  relationship: Relationship;
  customRelationship: string;

  setHolderFirstName: (value: string) => void;
  setHolderLastName: (value: string) => void;
  setHolderBirthDate: (value: string) => void;
  setHolderSex: (value: string) => void;

  setRelationship: (value: Relationship) => void;
  setCustomRelationship: (value: string) => void;

  onBack: () => void;
  onNext: () => void;
};

export default function EmergencyStep3({
  tagCode,

  ownerFirstName,
  ownerLastName,
  ownerPhone,
  ownerEmail,

  holderFirstName,
  holderLastName,
  holderBirthDate,
  holderSex,

  relationship,
  customRelationship,

  setHolderFirstName,
  setHolderLastName,
  setHolderBirthDate,
  setHolderSex,

  setRelationship,
  setCustomRelationship,

  onBack,
  onNext,
}: Props) {
  const ready =
    holderFirstName.trim() !== "" &&
    holderLastName.trim() !== "" &&
    relationship !== "" &&
    (
      relationship !== "other" ||
      customRelationship.trim() !== ""
    );

  return (
    <>
      <div className="heading">
        <div className="headingIcon">
          👥
        </div>

        <div>
          <span className="eyebrow">
            BRACELET HOLDER
          </span>

          <h1>
            ვის ეკუთვნის სამაჯური?
          </h1>

          <p>
            შეიყვანეთ იმ ადამიანის მონაცემები, ვისაც
            Emergency Bracelet ეკუთვნის.
          </p>
        </div>
      </div>

      <div className="creatorSummary">
        <div className="summaryItem">
          <span>
            პროფილის შემქმნელი
          </span>

          <strong>
            {ownerFirstName} {ownerLastName}
          </strong>
        </div>

        <div className="summaryItem">
          <span>
            საკონტაქტო ნომერი
          </span>

          <strong>
            {ownerPhone || "—"}
          </strong>
        </div>

        <div className="summaryItem">
          <span>
            QR CODE
          </span>

          <strong>
            {tagCode || "—"}
          </strong>
        </div>
      </div>

      <div className="nameWarning">
        <div>
          !
        </div>

        <p>
          <strong>
            სახელი შეიყვანეთ ყურადღებით.
          </strong>{" "}
          Emergency პროფილის შექმნის შემდეგ ამ პირის
          სახელის შეცვლა შესაძლებელი იქნება მხოლოდ ერთხელ,
          დამატებითი იდენტიფიკაციის შემდეგ.
        </p>
      </div>

      <div className="formGrid">
        <div className="field">
          <label>
            სახელი *
          </label>

          <input
            type="text"
            value={holderFirstName}
            onChange={(event) =>
              setHolderFirstName(
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
            value={holderLastName}
            onChange={(event) =>
              setHolderLastName(
                event.target.value
              )
            }
            placeholder="გვარი"
          />
        </div>

        <div className="field">
          <label>
            დაბადების თარიღი
          </label>

          <input
            type="date"
            value={holderBirthDate}
            onChange={(event) =>
              setHolderBirthDate(
                event.target.value
              )
            }
          />
        </div>

        <div className="field">
          <label>
            სქესი
          </label>

          <select
            value={holderSex}
            onChange={(event) =>
              setHolderSex(
                event.target.value
              )
            }
          >
            <option value="">
              აირჩიეთ
            </option>

            <option value="female">
              ქალი
            </option>

            <option value="male">
              კაცი
            </option>

            <option value="other">
              სხვა
            </option>
          </select>
        </div>
      </div>

      <section className="subSection">
        <div className="sectionTitle">
          <span>
            RELATIONSHIP · REQUIRED
          </span>

          <h3>
            რა კავშირი აქვს პროფილის შემქმნელს ამ პირთან?
          </h3>
        </div>

        <div className="relationshipGrid">
          {(
            Object.keys(
              relationshipLabels
            ) as Exclude<
              Relationship,
              ""
            >[]
          ).map((value) => (
            <button
              key={value}
              type="button"
              className={
                relationship === value
                  ? "relationshipButton selected"
                  : "relationshipButton"
              }
              onClick={() =>
                setRelationship(value)
              }
            >
              {relationshipLabels[value]}
            </button>
          ))}
        </div>

        {relationship === "other" && (
          <div className="singleField">
            <div className="field">
              <label>
                მიუთითეთ კავშირი *
              </label>

              <input
                type="text"
                value={customRelationship}
                onChange={(event) =>
                  setCustomRelationship(
                    event.target.value
                  )
                }
                placeholder="მაგ. ოჯახის მეგობარი"
              />
            </div>
          </div>
        )}
      </section>

      <div className="infoBox">
        <div className="infoIcon">
          ☎
        </div>

        <div>
          <strong>
            ძირითადი საკონტაქტო ნომერი
          </strong>

          <p>
            ამ პირისთვის ძირითად საკონტაქტო ნომრად გამოყენებული
            იქნება პროფილის შემქმნელის ნომერი:{" "}
            <strong>
              {ownerPhone || "—"}
            </strong>
          </p>
        </div>
      </div>

      <div className="infoBox">
        <div className="infoIcon">
          i
        </div>

        <div>
          <strong>
            ტელეფონი და ელფოსტა არ არის საჭირო
          </strong>

          <p>
            სამაჯურის მფლობელი შეიძლება იყოს ბავშვი, მოხუცი ან
            სხვა პირი, რომელსაც საკუთარი ტელეფონი ან ელფოსტა არ აქვს.
            პროფილის მართვა დარჩება შემქმნელის ანგარიშზე.
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
