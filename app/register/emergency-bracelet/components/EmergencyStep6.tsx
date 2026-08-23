"use client";

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
  const ownerRelationship =
    profileFor === "self"
      ? "პროფილის მფლობელი"
      : relationship === "other"
        ? customRelationship
        : relationship || "საკონტაქტო პირი";

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
            აირჩიეთ, რომელი ინფორმაცია გამოჩნდეს
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

          {showName && (
            <h2>
              {holderName || "Emergency Profile"}
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
                  value={medicalConditions}
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
                relationship={emergencyRelationship}
                phone={emergencyPhone}
              />
            )}

          {showSecondContact &&
            secondContactEnabled && (
              <ContactPreview
                label="SECOND EMERGENCY CONTACT"
                name={`${secondFirstName} ${secondLastName}`}
                relationship={secondRelationship}
                phone={secondPhone}
              />
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
          QR კოდი, Emergency კატეგორია და პროფილის პირის
          იდენტობა შექმნის შემდეგ ჩაიკეტება. სახელის შეცვლა
          შესაძლებელი იქნება მხოლოდ ერთხელ, დამატებითი
          იდენტიფიკაციის შემდეგ.
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
          ✓ პროფილის შექმნა
        </button>
      </div>
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

      <a
        href={`tel:${phone}`}
      >
        ☎ {phone || "—"}
      </a>
    </div>
  );
}
