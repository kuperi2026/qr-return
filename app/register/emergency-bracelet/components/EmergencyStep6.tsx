"use client";

import type {
  Dispatch,
  SetStateAction,
} from "react";

import type {
  ProfileFor,
  Relationship,
} from "./emergencyTypes";

type Props = {
  tagCode: string;

  profileFor: ProfileFor;

  holderName: string;
  holderBirthDate: string;
  holderSex: string;

  ownerFirstName: string;
  ownerLastName: string;
  ownerPhone: string;

  relationship: Relationship;
  customRelationship: string;

  bloodGroup: string;
  allergies: string;
  medicalConditions: string;
  medications: string;
  medicalNotes: string;

  primaryContactEnabled: boolean;

  emergencyFirstName: string;
  emergencyLastName: string;
  emergencyPhone: string;
  emergencyRelationship: string;

  secondContactEnabled: boolean;

  secondFirstName: string;
  secondLastName: string;
  secondPhone: string;
  secondRelationship: string;

  showName: boolean;
  setShowName:
    Dispatch<SetStateAction<boolean>>;

  showBirthDate: boolean;
  setShowBirthDate:
    Dispatch<SetStateAction<boolean>>;

  showSex: boolean;
  setShowSex:
    Dispatch<SetStateAction<boolean>>;

  showBloodGroup: boolean;
  setShowBloodGroup:
    Dispatch<SetStateAction<boolean>>;

  showAllergies: boolean;
  setShowAllergies:
    Dispatch<SetStateAction<boolean>>;

  showConditions: boolean;
  setShowConditions:
    Dispatch<SetStateAction<boolean>>;

  showMedications: boolean;
  setShowMedications:
    Dispatch<SetStateAction<boolean>>;

  showMedicalNotes: boolean;
  setShowMedicalNotes:
    Dispatch<SetStateAction<boolean>>;

  showPrimaryContact: boolean;
  setShowPrimaryContact:
    Dispatch<SetStateAction<boolean>>;

  showSecondContact: boolean;
  setShowSecondContact:
    Dispatch<SetStateAction<boolean>>;

  onBack: () => void;
  onCreate: () => void;
};

export default function EmergencyStep6({
  tagCode,

  profileFor,

  holderName,
  holderBirthDate,
  holderSex,

  ownerFirstName,
  ownerLastName,
  ownerPhone,

  relationship,
  customRelationship,

  bloodGroup,
  allergies,
  medicalConditions,
  medications,
  medicalNotes,

  primaryContactEnabled,

  emergencyFirstName,
  emergencyLastName,
  emergencyPhone,
  emergencyRelationship,

  secondContactEnabled,

  secondFirstName,
  secondLastName,
  secondPhone,
  secondRelationship,

  showName,
  setShowName,

  showBirthDate,
  setShowBirthDate,

  showSex,
  setShowSex,

  showBloodGroup,
  setShowBloodGroup,

  showAllergies,
  setShowAllergies,

  showConditions,
  setShowConditions,

  showMedications,
  setShowMedications,

  showMedicalNotes,
  setShowMedicalNotes,

  showPrimaryContact,
  setShowPrimaryContact,

  showSecondContact,
  setShowSecondContact,

  onBack,
  onCreate,
}: Props) {
  const liveChatEnabled = true;

  const relationshipText =
    relationship === "other"
      ? customRelationship
      : relationship;

  const primaryContactName =
    `${emergencyFirstName} ${emergencyLastName}`.trim();

  const secondContactName =
    `${secondFirstName} ${secondLastName}`.trim();

  function toggle(
    value: boolean,
    setter:
      Dispatch<SetStateAction<boolean>>
  ) {
    setter(!value);
  }

  function openLiveChat() {
    if (!tagCode.trim()) {
      alert(
        "Live Chat-ის გასახსნელად QR კოდი სავალდებულოა."
      );

      return;
    }

    window.location.href =
      `/live-chat/emergency/${encodeURIComponent(
        tagCode.trim().toUpperCase()
      )}`;
  }

  return (
    <>
      <div className="heading">
        <div className="headingIcon">
          ✓
        </div>

        <div>
          <span className="eyebrow">
            STEP 6
          </span>

          <h1>
            პროფილის გადახედვა
          </h1>

          <p>
            აირჩიეთ რომელი ინფორმაცია
            გამოჩნდება Emergency პროფილზე.
          </p>
        </div>
      </div>

      <div className="lockedSummary">
        <div className="summaryItem">
          <span>
            QR CODE
          </span>

          <strong>
            {tagCode || "—"}
          </strong>
        </div>

        <div className="summaryItem">
          <span>
            PROFILE
          </span>

          <strong>
            Emergency Bracelet
          </strong>
        </div>

        <div className="summaryItem">
          <span>
            PROFILE FOR
          </span>

          <strong>
            {profileFor === "self"
              ? "ჩემთვის"
              : "სხვა პირისთვის"}
          </strong>
        </div>
      </div>

      <div className="finalNotice">
        <div>
          !
        </div>

        <p>
          ყურადღებით გადაამოწმეთ
          ინფორმაცია პროფილის შექმნამდე.
          Emergency პროფილი დაკავშირებული
          იქნება ამ QR კოდთან და პროფილის
          კატეგორიის შეცვლა შეუძლებელი იქნება.
        </p>
      </div>

      <div className="visibilityLayout">
        <section className="visibilityPanel">
          <div className="sectionTitle">
            <span>
              VISIBILITY
            </span>

            <h3>
              რა გამოჩნდეს QR-ის
              დასკანერებისას?
            </h3>
          </div>

          <div className="visibilityGrid">

            <VisibilityRow
              label="სახელი და გვარი"
              value={showName}
              onClick={() =>
                toggle(
                  showName,
                  setShowName
                )
              }
            />

            <VisibilityRow
              label="დაბადების თარიღი"
              value={showBirthDate}
              onClick={() =>
                toggle(
                  showBirthDate,
                  setShowBirthDate
                )
              }
            />

            <VisibilityRow
              label="სქესი"
              value={showSex}
              onClick={() =>
                toggle(
                  showSex,
                  setShowSex
                )
              }
            />

            <VisibilityRow
              label="სისხლის ჯგუფი"
              value={showBloodGroup}
              onClick={() =>
                toggle(
                  showBloodGroup,
                  setShowBloodGroup
                )
              }
            />

            <VisibilityRow
              label="ალერგიები"
              value={showAllergies}
              onClick={() =>
                toggle(
                  showAllergies,
                  setShowAllergies
                )
              }
            />

            <VisibilityRow
              label="სამედიცინო მდგომარეობები"
              value={showConditions}
              onClick={() =>
                toggle(
                  showConditions,
                  setShowConditions
                )
              }
            />

            <VisibilityRow
              label="მედიკამენტები"
              value={showMedications}
              onClick={() =>
                toggle(
                  showMedications,
                  setShowMedications
                )
              }
            />

            <VisibilityRow
              label="დამატებითი სამედიცინო ინფორმაცია"
              value={showMedicalNotes}
              onClick={() =>
                toggle(
                  showMedicalNotes,
                  setShowMedicalNotes
                )
              }
            />

            <VisibilityRow
              label="Emergency Contact"
              value={
                primaryContactEnabled &&
                showPrimaryContact
              }
              disabled={
                !primaryContactEnabled
              }
              onClick={() => {
                if (
                  primaryContactEnabled
                ) {
                  toggle(
                    showPrimaryContact,
                    setShowPrimaryContact
                  );
                }
              }}
            />

            <VisibilityRow
              label="მეორე Emergency Contact"
              value={
                secondContactEnabled &&
                showSecondContact
              }
              disabled={
                !secondContactEnabled
              }
              onClick={() => {
                if (
                  secondContactEnabled
                ) {
                  toggle(
                    showSecondContact,
                    setShowSecondContact
                  );
                }
              }}
            />

          </div>
        </section>

        <section className="previewPanel">
          <div className="previewTop">
            <div className="previewMark">
              +
            </div>

            <div>
              <strong>
                EMERGENCY PROFILE
              </strong>

              <span>
                QR RETURN
              </span>
            </div>
          </div>

          {showName && (
            <h2>
              {holderName || "—"}
            </h2>
          )}

          <div className="previewDetails">

            {showBirthDate &&
              holderBirthDate && (
                <PreviewRow
                  label="დაბადების თარიღი"
                  value={
                    holderBirthDate
                  }
                />
              )}

            {showSex &&
              holderSex && (
                <PreviewRow
                  label="სქესი"
                  value={
                    holderSex
                  }
                />
              )}

            {showBloodGroup &&
              bloodGroup && (
                <PreviewRow
                  label="სისხლის ჯგუფი"
                  value={
                    bloodGroup
                  }
                />
              )}

            {showAllergies &&
              allergies && (
                <PreviewBlock
                  label="ალერგიები"
                  value={
                    allergies
                  }
                />
              )}

            {showConditions &&
              medicalConditions && (
                <PreviewBlock
                  label="სამედიცინო მდგომარეობები"
                  value={
                    medicalConditions
                  }
                />
              )}

            {showMedications &&
              medications && (
                <PreviewBlock
                  label="მედიკამენტები"
                  value={
                    medications
                  }
                />
              )}

            {showMedicalNotes &&
              medicalNotes && (
                <PreviewBlock
                  label="დამატებითი ინფორმაცია"
                  value={
                    medicalNotes
                  }
                />
              )}

          </div>

          <div className="contactPreview">
            <span className="contactLabel">
              ძირითადი საკონტაქტო პირი
            </span>

            <strong>
              {ownerFirstName}{" "}
              {ownerLastName}
            </strong>

            <p>
              {ownerPhone || "—"}
            </p>

            {profileFor === "other" &&
              relationshipText && (
                <small>
                  კავშირი:{" "}
                  {relationshipText}
                </small>
              )}
          </div>

          {primaryContactEnabled &&
            showPrimaryContact && (
              <div className="contactPreview">
                <span className="contactLabel">
                  EMERGENCY CONTACT
                </span>

                <strong>
                  {primaryContactName ||
                    "—"}
                </strong>

                <p>
                  {emergencyPhone ||
                    "—"}
                </p>

                {emergencyRelationship && (
                  <small>
                    კავშირი:{" "}
                    {
                      emergencyRelationship
                    }
                  </small>
                )}
              </div>
            )}

          {secondContactEnabled &&
            showSecondContact && (
              <div className="contactPreview">
                <span className="contactLabel">
                  SECOND EMERGENCY CONTACT
                </span>

                <strong>
                  {secondContactName ||
                    "—"}
                </strong>

                <p>
                  {secondPhone || "—"}
                </p>

                {secondRelationship && (
                  <small>
                    კავშირი:{" "}
                    {
                      secondRelationship
                    }
                  </small>
                )}
              </div>
            )}

          <div className="contactMethods">
            <a
              href={
                ownerPhone
                  ? `tel:${ownerPhone}`
                  : undefined
              }
              className="contactMethod"
            >
              <span className="methodIcon">
                ☎
              </span>

              <div>
                <small>
                  PHONE
                </small>

                <strong>
                  დარეკვა
                </strong>
              </div>
            </a>

            {liveChatEnabled && (
              <button
                type="button"
                className="contactMethod chatButton"
                onClick={
                  openLiveChat
                }
              >
                <span className="methodIcon">
                  ●
                </span>

                <div>
                  <small>
                    LIVE CHAT
                  </small>

                  <strong>
                    ჩათის გახსნა
                  </strong>
                </div>
              </button>
            )}
          </div>
        </section>
      </div>

      <div className="nameWarning">
        <div>
          !
        </div>

        <p>
          პროფილის მფლობელის სახელი
          ყურადღებით შეიყვანეთ. სახელის
          შეცვლის უფლება შეზღუდული იქნება.
          სხვა რედაქტირებადი ინფორმაცია
          მოგვიანებით პროფილიდან შეგეძლებათ
          განაახლოთ.
        </p>
      </div>

      <div className="finalActions">
        <button
          type="button"
          className="secondaryButton"
          onClick={onBack}
        >
          ← უკან
        </button>

        <button
          type="button"
          className="createButton"
          onClick={onCreate}
        >
          Emergency პროფილის შექმნა
        </button>
      </div>

      <style jsx>{`
        .contactMethods {
          padding: 4px 14px 15px;
          display: grid;
          grid-template-columns:
            repeat(
              2,
              minmax(0, 1fr)
            );
          gap: 9px;
        }

        .contactMethod {
          min-height: 58px;
          padding: 10px 12px;

          display: flex;
          align-items: center;

          gap: 9px;

          border: 0;
          border-radius: 10px;

          background: #0747c9;
          color: #ffffff;

          text-align: left;
          text-decoration: none;

          cursor: pointer;

          font-family: inherit;
        }

        .chatButton {
          width: 100%;
        }

        .methodIcon {
          width: 34px;
          height: 34px;

          flex: 0 0 34px;

          display: grid;
          place-items: center;

          border-radius: 9px;

          background:
            rgba(
              255,
              255,
              255,
              0.15
            );

          font-size: 16px;
        }

        .contactMethod small,
        .contactMethod strong {
          display: block;
        }

        .contactMethod small {
          color:
            rgba(
              255,
              255,
              255,
              0.7
            );

          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.7px;
        }

        .contactMethod strong {
          margin-top: 2px;

          color: #ffffff;

          font-size: 12px;
          font-weight: 850;
        }

        .contactLabel {
          display: block;

          margin-bottom: 4px;

          color: #0747c9;

          font-size: 8px;
          font-weight: 900;

          letter-spacing: 0.8px;
        }

        .contactPreview strong,
        .contactPreview p,
        .contactPreview small {
          display: block;
        }

        .contactPreview strong {
          color: #304a65;
          font-size: 13px;
        }

        .contactPreview p {
          margin: 3px 0 0;

          color: #526b84;
          font-size: 12px;
        }

        .contactPreview small {
          margin-top: 3px;

          color: #8190a0;
          font-size: 10px;
        }

        @media (
          max-width: 600px
        ) {
          .contactMethods {
            grid-template-columns:
              1fr;
          }
        }
      `}</style>
    </>
  );
}

type VisibilityRowProps = {
  label: string;
  value: boolean;
  onClick: () => void;
  disabled?: boolean;
};

function VisibilityRow({
  label,
  value,
  onClick,
  disabled = false,
}: VisibilityRowProps) {
  return (
    <div
      className={
        disabled
          ? "visibilityRow disabled"
          : "visibilityRow"
      }
    >
      <strong>
        {label}
      </strong>

      <button
        type="button"
        className={
          value
            ? "visibilityToggle on"
            : "visibilityToggle"
        }
        onClick={onClick}
        disabled={disabled}
      >
        {value ? "ON" : "OFF"}
      </button>
    </div>
  );
}

function PreviewRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="previewRow">
      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>
    </div>
  );
}

function PreviewBlock({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="previewBlock">
      <span>
        {label}
      </span>

      <p>
        {value}
      </p>
    </div>
  );
}
