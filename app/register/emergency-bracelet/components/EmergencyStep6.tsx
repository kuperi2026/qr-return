"use client";

import { useState } from "react";

type Props = {
  tagCode: string;

  profileFor: "self" | "other" | "";

  holderName: string;
  holderBirthDate: string;
  holderSex: string;

  ownerFirstName: string;
  ownerLastName: string;
  ownerPhone: string;

  relationship: string;
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
  setShowName: (value: boolean) => void;

  showBirthDate: boolean;
  setShowBirthDate: (value: boolean) => void;

  showSex: boolean;
  setShowSex: (value: boolean) => void;

  showBloodGroup: boolean;
  setShowBloodGroup: (value: boolean) => void;

  showAllergies: boolean;
  setShowAllergies: (value: boolean) => void;

  showConditions: boolean;
  setShowConditions: (value: boolean) => void;

  showMedications: boolean;
  setShowMedications: (value: boolean) => void;

  showMedicalNotes: boolean;
  setShowMedicalNotes: (value: boolean) => void;

  showPrimaryContact: boolean;
  setShowPrimaryContact: (value: boolean) => void;

  showSecondContact: boolean;
  setShowSecondContact: (value: boolean) => void;

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
  const [liveChatEnabled, setLiveChatEnabled] =
    useState(true);

  const [missingModeEnabled, setMissingModeEnabled] =
    useState(false);

  const [locationSharingEnabled, setLocationSharingEnabled] =
    useState(true);

  const [missingMessage, setMissingMessage] =
    useState("");

  const ownerRelationship =
    profileFor === "self"
      ? "პროფილის მფლობელი"
      : relationship === "other"
        ? customRelationship
        : relationship || "საკონტაქტო პირი";

  function handleCreate() {
    console.log("EMERGENCY CONTACT SETTINGS", {
      phoneEnabled: true,
      liveChatEnabled,

      missingMode: {
        enabled: missingModeEnabled,
        message: missingMessage.trim(),
        locationSharingEnabled:
          missingModeEnabled &&
          locationSharingEnabled,
      },
    });

    onCreate();
  }

  return (
    <>
      <div className="heading">
        <div className="headingIcon">
          ✓
        </div>

        <div>
          <span className="eyebrow">
            VISIBILITY & PREVIEW
          </span>

          <h1>
            რას დაინახავს QR-ის დამსკანერებელი?
          </h1>

          <p>
            აირჩიეთ, რომელი ინფორმაცია და
            დაკავშირების მეთოდები გამოჩნდეს
            Emergency პროფილში.
          </p>
        </div>
      </div>

      <div className="lockedSummary">
        <div className="summaryItem">
          <span>
            QR CODE · LOCKED
          </span>

          <strong>
            {tagCode || "—"}
          </strong>
        </div>

        <div className="summaryItem">
          <span>
            PROFILE TYPE · LOCKED
          </span>

          <strong>
            Emergency Bracelet
          </strong>
        </div>

        <div className="summaryItem">
          <span>
            PROFILE FOR · LOCKED
          </span>

          <strong>
            {profileFor === "self"
              ? "ჩემთვის"
              : "სხვა პირისთვის"}
          </strong>
        </div>
      </div>

      {/* CONTACT METHODS */}

      <section className="contactMethodsSection">
        <div className="sectionTitle">
          <span>
            CONTACT METHODS
          </span>

          <h3>
            დაკავშირების მეთოდები
          </h3>
        </div>

        <div className="contactMethodGrid">
          <div className="contactMethod lockedMethod">
            <div>
              <span className="methodEyebrow">
                REQUIRED
              </span>

              <strong>
                ტელეფონი
              </strong>

              <p>
                ძირითადი საკონტაქტო ნომერი ყოველთვის
                ხელმისაწვდომია.
              </p>
            </div>

            <div className="alwaysOn">
              ALWAYS ON
            </div>
          </div>

          <div className="contactMethod">
            <div>
              <span className="methodEyebrow">
                OPTIONAL
              </span>

              <strong>
                Live Chat
              </strong>

              <p>
                QR-ის დამსკანერებელს შეეძლება
                პლატფორმის Live Chat-ის გამოყენება.
              </p>
            </div>

            <button
              type="button"
              className={
                liveChatEnabled
                  ? "methodToggle on"
                  : "methodToggle"
              }
              onClick={() =>
                setLiveChatEnabled(
                  !liveChatEnabled
                )
              }
            >
              {liveChatEnabled
                ? "ON"
                : "OFF"}
            </button>
          </div>
        </div>
      </section>

      {/* MISSING MODE */}

      <section className="missingModeSection">
        <div className="missingModeHeader">
          <div className="sectionTitle">
            <span>
              EMERGENCY / MISSING MODE
            </span>

            <h3>
              დაკარგული ან დახმარების საჭიროების რეჟიმი
            </h3>
          </div>

          <button
            type="button"
            className={
              missingModeEnabled
                ? "missingToggle on"
                : "missingToggle"
            }
            onClick={() =>
              setMissingModeEnabled(
                !missingModeEnabled
              )
            }
          >
            {missingModeEnabled
              ? "ON"
              : "OFF"}
          </button>
        </div>

        <p className="missingDescription">
          ჩვეულებრივ Emergency პროფილი ყოველთვის
          მუშაობს. ეს დამატებითი რეჟიმი გამოიყენება
          მაშინ, როცა პირი დაიკარგა ან განსაკუთრებული
          დახმარება სჭირდება.
        </p>

        {missingModeEnabled && (
          <div className="missingModeBody">
            <div className="field">
              <label>
                სპეციალური შეტყობინება
              </label>

              <textarea
                value={missingMessage}
                onChange={(event) =>
                  setMissingMessage(
                    event.target.value
                  )
                }
                placeholder="მაგ. ეს ადამიანი დაკარგულია. გთხოვთ დაუკავშირდეთ ოჯახის წევრს ან გაგვიზიაროთ მდებარეობა."
              />
            </div>

            <div className="locationSetting">
              <div>
                <strong>
                  ლოკაციის გაზიარება
                </strong>

                <p>
                  დამსკანერებელს შეეძლება ერთი
                  ღილაკით გამოგიგზავნოთ თავისი
                  მიმდინარე მდებარეობა.
                </p>
              </div>

              <button
                type="button"
                className={
                  locationSharingEnabled
                    ? "methodToggle on"
                    : "methodToggle"
                }
                onClick={() =>
                  setLocationSharingEnabled(
                    !locationSharingEnabled
                  )
                }
              >
                {locationSharingEnabled
                  ? "ON"
                  : "OFF"}
              </button>
            </div>
          </div>
        )}
      </section>

      {/* VISIBILITY + PREVIEW */}

      <div className="visibilityLayout">
        <section className="visibilityPanel">
          <div className="sectionTitle">
            <span>
              VISIBILITY
            </span>

            <h3>
              ინფორმაციის ჩვენება
            </h3>
          </div>

          <div className="visibilityGrid">
            <VisibilityRow
              title="სახელი და გვარი"
              value={showName}
              onChange={setShowName}
            />

            <VisibilityRow
              title="დაბადების თარიღი"
              value={showBirthDate}
              onChange={setShowBirthDate}
              disabled={!holderBirthDate}
            />

            <VisibilityRow
              title="სქესი"
              value={showSex}
              onChange={setShowSex}
              disabled={!holderSex}
            />

            <VisibilityRow
              title="სისხლის ჯგუფი"
              value={showBloodGroup}
              onChange={setShowBloodGroup}
              disabled={!bloodGroup}
            />

            <VisibilityRow
              title="ალერგიები"
              value={showAllergies}
              onChange={setShowAllergies}
              disabled={!allergies}
            />

            <VisibilityRow
              title="სამედიცინო მდგომარეობები"
              value={showConditions}
              onChange={setShowConditions}
              disabled={!medicalConditions}
            />

            <VisibilityRow
              title="მედიკამენტები"
              value={showMedications}
              onChange={setShowMedications}
              disabled={!medications}
            />

            <VisibilityRow
              title="სამედიცინო შენიშვნა"
              value={showMedicalNotes}
              onChange={setShowMedicalNotes}
              disabled={!medicalNotes}
            />

            <VisibilityRow
              title="დამატებითი Emergency Contact"
              value={showPrimaryContact}
              onChange={setShowPrimaryContact}
              disabled={!primaryContactEnabled}
            />

            <VisibilityRow
              title="მეორე დამატებითი კონტაქტი"
              value={showSecondContact}
              onChange={setShowSecondContact}
              disabled={!secondContactEnabled}
            />
          </div>
        </section>

        <section className="previewPanel">
          <div className="previewTop">
            <div className="previewMark">
              +
            </div>

            <div>
              <span>
                QR RETURN
              </span>

              <strong>
                EMERGENCY
              </strong>
            </div>
          </div>

          {missingModeEnabled && (
            <div className="missingPreview">
              <div className="missingBadge">
                EMERGENCY / MISSING
              </div>

              <strong>
                დახმარებაა საჭირო
              </strong>

              {missingMessage.trim() && (
                <p>
                  {missingMessage}
                </p>
              )}
            </div>
          )}

          {showName && (
            <h2>
              {holderName ||
                "Emergency Profile"}
            </h2>
          )}

          <div className="previewDetails">
            {showBirthDate &&
              holderBirthDate && (
                <PreviewRow
                  label="დაბადების თარიღი"
                  value={holderBirthDate}
                />
              )}

            {showSex &&
              holderSex && (
                <PreviewRow
                  label="სქესი"
                  value={
                    holderSex === "female"
                      ? "ქალი"
                      : holderSex === "male"
                        ? "კაცი"
                        : "სხვა"
                  }
                />
              )}

            {showBloodGroup &&
              bloodGroup && (
                <PreviewRow
                  label="სისხლის ჯგუფი"
                  value={bloodGroup}
                  important
                />
              )}

            {showAllergies &&
              allergies && (
                <PreviewBlock
                  label="ალერგიები"
                  value={allergies}
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
                  value={medications}
                />
              )}

            {showMedicalNotes &&
              medicalNotes && (
                <PreviewBlock
                  label="სამედიცინო შენიშვნა"
                  value={medicalNotes}
                />
              )}
          </div>

          <ContactPreview
            label="PROFILE MANAGER"
            name={`${ownerFirstName} ${ownerLastName}`}
            relationship={ownerRelationship}
            phone={ownerPhone}
          />

          {showPrimaryContact &&
            primaryContactEnabled && (
              <ContactPreview
                label="EMERGENCY CONTACT"
                name={`${emergencyFirstName} ${emergencyLastName}`}
                relationship={
                  emergencyRelationship
                }
                phone={emergencyPhone}
              />
            )}

          {showSecondContact &&
            secondContactEnabled && (
              <ContactPreview
                label="SECOND EMERGENCY CONTACT"
                name={`${secondFirstName} ${secondLastName}`}
                relationship={
                  secondRelationship
                }
                phone={secondPhone}
              />
            )}

          <div className="previewContactButtons">
            <a
              href={`tel:${ownerPhone}`}
              className="previewPhone"
            >
              ☎ დარეკვა
            </a>

            {liveChatEnabled && (
              <button
                type="button"
                className="previewChat"
              >
                ◉ Live Chat
              </button>
            )}
          </div>

          {missingModeEnabled &&
            locationSharingEnabled && (
              <button
                type="button"
                className="previewLocation"
              >
                ⌖ მდებარეობის გაზიარება
              </button>
            )}
        </section>
      </div>

      <div className="finalNotice">
        <div>
          !
        </div>

        <p>
          <strong>
            შექმნამდე გადაამოწმეთ ინფორმაცია.
          </strong>{" "}
          ტელეფონი ყოველთვის ხელმისაწვდომი იქნება.
          Live Chat-ის და Missing Mode-ის ჩართვა ან
          გამორთვა მომავალშიც შეგეძლებათ.
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
          onClick={handleCreate}
        >
          ✓ პროფილის შექმნა
        </button>
      </div>

      <style jsx global>{`
        .contactMethodsSection,
        .missingModeSection {
          margin-top: 18px;
          padding: 15px;

          border: 1px solid #dde6ef;
          border-radius: 13px;

          background: #ffffff;
        }

        .contactMethodGrid {
          margin-top: 12px;

          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 10px;
        }

        .contactMethod {
          min-height: 105px;

          padding: 12px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 12px;

          border: 1px solid #dce5ee;
          border-radius: 11px;

          background: #f9fbfd;
        }

        .lockedMethod {
          background: #f2f7ff;
          border-color: #cbdcf4;
        }

        .contactMethod strong {
          display: block;

          margin-top: 2px;

          color: #304a65;

          font-size: 14px;
          font-weight: 850;
        }

        .contactMethod p {
          max-width: 250px;

          margin: 4px 0 0;

          color: #718397;

          font-size: 11px;
          line-height: 1.4;
        }

        .methodEyebrow {
          color: #0747c9;

          font-size: 8px;
          font-weight: 900;

          letter-spacing: 0.8px;
        }

        .alwaysOn {
          min-width: 80px;
          min-height: 32px;

          padding: 0 9px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 999px;

          background: #0747c9;
          color: #ffffff;

          font-size: 9px;
          font-weight: 900;

          white-space: nowrap;
        }

        .methodToggle,
        .missingToggle {
          min-width: 68px;
          height: 34px;

          border: 1px solid #d5e0eb;
          border-radius: 999px;

          background: #f4f6f9;
          color: #81909f;

          font-size: 10px;
          font-weight: 900;

          cursor: pointer;
        }

        .methodToggle.on,
        .missingToggle.on {
          border-color: #0747c9;

          background: #0747c9;
          color: #ffffff;
        }

        .missingModeHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 15px;
        }

        .missingDescription {
          margin: 8px 0 0;

          max-width: 650px;

          color: #718397;

          font-size: 12px;
          line-height: 1.45;
        }

        .missingModeBody {
          margin-top: 14px;
          padding-top: 14px;

          border-top: 1px solid #e2e9f0;
        }

        .locationSetting {
          margin-top: 12px;
          padding: 11px 12px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 15px;

          border: 1px solid #dce5ee;
          border-radius: 10px;

          background: #f8fafc;
        }

        .locationSetting strong {
          color: #304a65;

          font-size: 13px;
          font-weight: 850;
        }

        .locationSetting p {
          max-width: 520px;

          margin: 3px 0 0;

          color: #718397;

          font-size: 11px;
          line-height: 1.4;
        }

        .missingPreview {
          margin: 12px 14px 0;
          padding: 11px;

          border: 1px solid #b9d3f5;
          border-radius: 10px;

          background: #edf5ff;
        }

        .missingBadge {
          display: inline-flex;

          padding: 4px 7px;

          border-radius: 999px;

          background: #0747c9;
          color: #ffffff;

          font-size: 7px;
          font-weight: 900;

          letter-spacing: 0.7px;
        }

        .missingPreview strong {
          display: block;

          margin-top: 6px;

          color: #24415f;

          font-size: 13px;
          font-weight: 900;
        }

        .missingPreview p {
          margin: 4px 0 0;

          color: #5e7388;

          font-size: 11px;
          line-height: 1.45;
        }

        .previewContactButtons {
          padding: 4px 14px 12px;

          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 7px;
        }

        .previewPhone,
        .previewChat {
          min-height: 38px;

          display: flex;
          align-items: center;
          justify-content: center;

          border: 0;
          border-radius: 8px;

          background: #0747c9;
          color: #ffffff;

          font-size: 10px;
          font-weight: 850;

          text-decoration: none;
          cursor: pointer;
        }

        .previewChat {
          background: #ffffff;
          color: #0747c9;

          border: 1px solid #bcd2ef;
        }

        .previewLocation {
          width: calc(100% - 28px);
          min-height: 38px;

          margin: 0 14px 14px;

          border: 1px solid #bdd3ef;
          border-radius: 8px;

          background: #edf5ff;
          color: #0747c9;

          font-size: 10px;
          font-weight: 850;

          cursor: pointer;
        }

        @media (max-width: 650px) {
          .contactMethodGrid {
            grid-template-columns: 1fr;
          }

          .contactMethod,
          .locationSetting {
            align-items: flex-start;
          }
        }
      `}</style>
    </>
  );
}

function VisibilityRow({
  title,
  value,
  onChange,
  disabled = false,
}: {
  title: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div
      className={
        disabled
          ? "visibilityRow disabled"
          : "visibilityRow"
      }
    >
      <strong>
        {title}
      </strong>

      <button
        type="button"
        disabled={disabled}
        className={
          value && !disabled
            ? "visibilityToggle on"
            : "visibilityToggle"
        }
        onClick={() =>
          onChange(!value)
        }
      >
        {value && !disabled
          ? "ON"
          : "OFF"}
      </button>
    </div>
  );
}

function PreviewRow({
  label,
  value,
  important = false,
}: {
  label: string;
  value: string;
  important?: boolean;
}) {
  return (
    <div
      className={
        important
          ? "previewRow important"
          : "previewRow"
      }
    >
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

      <strong>
        {value}
      </strong>
    </div>
  );
}

function ContactPreview({
  label,
  name,
  relationship,
  phone,
}: {
  label: string;
  name: string;
  relationship: string;
  phone: string;
}) {
  return (
    <div className="contactPreview">
      <span>
        {label}
      </span>

      <h3>
        {name || "—"}
      </h3>

      <p>
        {relationship || "საკონტაქტო პირი"}
      </p>

      <a href={`tel:${phone}`}>
        ☎ {phone || "—"}
      </a>
    </div>
  );
}
