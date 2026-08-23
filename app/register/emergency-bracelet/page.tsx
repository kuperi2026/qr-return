"use client";

import {
  useState,
  type ReactNode,
} from "react";

type ProfileFor =
  | "self"
  | "other"
  | "";

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

export default function EmergencyBraceletPage() {
  const [step, setStep] = useState(1);

  /* STEP 1 */

  const [tagCode, setTagCode] =
    useState("");

  const [
    profileFor,
    setProfileFor,
  ] =
    useState<ProfileFor>("");

  /* STEP 2 — CREATOR */

  const [
    ownerFirstName,
    setOwnerFirstName,
  ] = useState("");

  const [
    ownerLastName,
    setOwnerLastName,
  ] = useState("");

  const [
    ownerPhone,
    setOwnerPhone,
  ] = useState("");

  const [
    ownerEmail,
    setOwnerEmail,
  ] = useState("");

  /* STEP 3 — HOLDER */

  const [
    holderFirstName,
    setHolderFirstName,
  ] = useState("");

  const [
    holderLastName,
    setHolderLastName,
  ] = useState("");

  const [
    holderBirthDate,
    setHolderBirthDate,
  ] = useState("");

  const [
    holderSex,
    setHolderSex,
  ] = useState("");

  const [
    relationship,
    setRelationship,
  ] =
    useState<Relationship>("");

  const [
    customRelationship,
    setCustomRelationship,
  ] = useState("");

  /* STEP 4 — MEDICAL */

  const [
    bloodGroup,
    setBloodGroup,
  ] = useState("");

  const [
    allergies,
    setAllergies,
  ] = useState("");

  const [
    medicalConditions,
    setMedicalConditions,
  ] = useState("");

  const [
    medications,
    setMedications,
  ] = useState("");

  const [
    medicalNotes,
    setMedicalNotes,
  ] = useState("");

  /* STEP 5 — CONTACTS */

  const [
    primaryContactEnabled,
    setPrimaryContactEnabled,
  ] = useState(false);

  const [
    emergencyFirstName,
    setEmergencyFirstName,
  ] = useState("");

  const [
    emergencyLastName,
    setEmergencyLastName,
  ] = useState("");

  const [
    emergencyPhone,
    setEmergencyPhone,
  ] = useState("");

  const [
    emergencyRelationship,
    setEmergencyRelationship,
  ] = useState("");

  const [
    secondContactEnabled,
    setSecondContactEnabled,
  ] = useState(false);

  const [
    secondFirstName,
    setSecondFirstName,
  ] = useState("");

  const [
    secondLastName,
    setSecondLastName,
  ] = useState("");

  const [
    secondPhone,
    setSecondPhone,
  ] = useState("");

  const [
    secondRelationship,
    setSecondRelationship,
  ] = useState("");

  /* STEP 6 — VISIBILITY */

  const [
    showName,
    setShowName,
  ] = useState(true);

  const [
    showBirthDate,
    setShowBirthDate,
  ] = useState(true);

  const [
    showSex,
    setShowSex,
  ] = useState(false);

  const [
    showBloodGroup,
    setShowBloodGroup,
  ] = useState(true);

  const [
    showAllergies,
    setShowAllergies,
  ] = useState(true);

  const [
    showConditions,
    setShowConditions,
  ] = useState(true);

  const [
    showMedications,
    setShowMedications,
  ] = useState(true);

  const [
    showMedicalNotes,
    setShowMedicalNotes,
  ] = useState(false);

  const [
    showPrimaryContact,
    setShowPrimaryContact,
  ] = useState(true);

  const [
    showSecondContact,
    setShowSecondContact,
  ] = useState(false);

  const stepOneReady =
    tagCode.trim() !== "" &&
    profileFor !== "";

  const ownerReady =
    ownerFirstName.trim() !== "" &&
    ownerLastName.trim() !== "" &&
    ownerPhone.trim() !== "" &&
    ownerEmail.trim() !== "";

  const holderReady =
    holderFirstName.trim() !== "" &&
    holderLastName.trim() !== "" &&
    relationship !== "" &&
    (
      relationship !== "other" ||
      customRelationship.trim() !== ""
    );

  const primaryComplete =
    !primaryContactEnabled ||
    (
      emergencyFirstName.trim() !== "" &&
      emergencyLastName.trim() !== "" &&
      emergencyPhone.trim() !== "" &&
      emergencyRelationship.trim() !== ""
    );

  const secondComplete =
    !secondContactEnabled ||
    (
      secondFirstName.trim() !== "" &&
      secondLastName.trim() !== "" &&
      secondPhone.trim() !== "" &&
      secondRelationship.trim() !== ""
    );

  const contactsReady =
    primaryComplete &&
    secondComplete;

  const holderName =
    profileFor === "self"
      ? `${ownerFirstName} ${ownerLastName}`.trim()
      : `${holderFirstName} ${holderLastName}`.trim();

  function goToStep(
    number: number
  ) {
    setStep(number);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function continueFromOwner() {
    if (!ownerReady) {
      return;
    }

    if (
      profileFor === "self"
    ) {
      setHolderFirstName(
        ownerFirstName
      );

      setHolderLastName(
        ownerLastName
      );

      goToStep(4);

      return;
    }

    goToStep(3);
  }

  function finishProfile() {
    const payload = {
      tagCode:
        tagCode
          .trim()
          .toUpperCase(),

      profileType:
        "emergency_bracelet",

      profileFor,

      creator: {
        firstName:
          ownerFirstName.trim(),

        lastName:
          ownerLastName.trim(),

        phone:
          ownerPhone.trim(),

        email:
          ownerEmail.trim(),
      },

      holder: {
        firstName:
          profileFor === "self"
            ? ownerFirstName.trim()
            : holderFirstName.trim(),

        lastName:
          profileFor === "self"
            ? ownerLastName.trim()
            : holderLastName.trim(),

        birthDate:
          holderBirthDate,

        sex:
          holderSex,
      },

      relationship:
        profileFor === "other"
          ? relationship
          : null,

      customRelationship:
        profileFor === "other" &&
        relationship === "other"
          ? customRelationship.trim()
          : null,

      medical: {
        bloodGroup,
        allergies,
        medicalConditions,
        medications,
        medicalNotes,
      },

      contacts: {
        primary:
          primaryContactEnabled
            ? {
                firstName:
                  emergencyFirstName,

                lastName:
                  emergencyLastName,

                phone:
                  emergencyPhone,

                relationship:
                  emergencyRelationship,
              }
            : null,

        secondary:
          secondContactEnabled
            ? {
                firstName:
                  secondFirstName,

                lastName:
                  secondLastName,

                phone:
                  secondPhone,

                relationship:
                  secondRelationship,
              }
            : null,
      },

      visibility: {
        showName,
        showBirthDate,
        showSex,
        showBloodGroup,
        showAllergies,
        showConditions,
        showMedications,
        showMedicalNotes,
        showPrimaryContact,
        showSecondContact,
      },

      security: {
        profileTypeLocked: true,
        profileForLocked: true,
        tagCodeLocked: true,
        holderIdentityLocked: true,
        holderFirstNameChangeUsed: false,
      },
    };

    console.log(
      "EMERGENCY PROFILE:",
      payload
    );

    alert(
      "ფორმა მზადაა. შემდეგ ეტაპზე Supabase-ში შენახვას მივაბამთ."
    );
  }

  return (
    <>
      <main className="page">
        <header className="topbar">
          <a
            href="/"
            className="brand"
          >
            <div className="brandMark">
              QR
            </div>

            <div className="brandText">
              <strong>
                QR RETURN
              </strong>

              <span>
                SMART LOST &amp; FOUND
              </span>
            </div>
          </a>

          <a
            href="/register"
            className="topButton"
          >
            ← პროდუქტები
          </a>
        </header>

        <section className="card">
          <div className="progressRow">
            <span>
              EMERGENCY REGISTRATION
            </span>

            <div className="progressTrack">
              <div
                className="progressFill"
                style={{
                  width:
                    `${(step / 6) * 100}%`,
                }}
              />
            </div>

            <strong>
              STEP {step} OF 6
            </strong>
          </div>

          {/* STEP 1 */}

          {step === 1 && (
            <>
              <Heading
                icon="+"
                eyebrow="EMERGENCY PROFILE"
                title="ვისთვის ქმნით პროფილს?"
                text="აირჩიეთ პროფილის ტიპი და შეიყვანეთ თქვენი Emergency Bracelet-ის QR კოდი."
              />

              <div className="qrSection">
                <Field label="QR კოდი *">
                  <input
                    type="text"
                    value={tagCode}
                    onChange={(e) =>
                      setTagCode(
                        e.target.value
                          .toUpperCase()
                      )
                    }
                    placeholder="მაგ. EMR-000123"
                    autoComplete="off"
                  />
                </Field>

                <div className="qrHelp">
                  <span>
                    REQUIRED
                  </span>

                  <strong>
                    თითოეულ სამაჯურს საკუთარი QR კოდი აქვს
                  </strong>

                  <p>
                    ეს კოდი კონკრეტულ Emergency პროფილთან დაფიქსირდება
                    და რეგისტრაციის შემდეგ სხვა კატეგორიაზე ვერ გადავა.
                  </p>
                </div>
              </div>

              <div className="choiceGrid">
                <ChoiceCard
                  number="01"
                  icon="👤"
                  title="ჩემთვის"
                  text="Emergency Bracelet და პროფილი განკუთვნილია თქვენთვის."
                  active={
                    profileFor ===
                    "self"
                  }
                  onClick={() => {
                    setProfileFor(
                      "self"
                    );

                    setRelationship(
                      ""
                    );

                    setCustomRelationship(
                      ""
                    );
                  }}
                />

                <ChoiceCard
                  number="02"
                  icon="👥"
                  title="სხვა პირისთვის"
                  text="ბავშვის, ოჯახის წევრის, მოხუცის ან სხვა პირის Emergency Bracelet."
                  active={
                    profileFor ===
                    "other"
                  }
                  onClick={() =>
                    setProfileFor(
                      "other"
                    )
                  }
                />
              </div>

              <InfoBox
                title="QR კოდი ორივე შემთხვევაში სავალდებულოა"
                text="პროფილი ვერ შეიქმნება QR კოდის გარეშე. მოგვიანებით შევამოწმებთ, რომ კოდი არსებობს, არის Emergency Bracelet-ის და ჯერ არ არის გამოყენებული."
              />

              <Actions
                backHref="/register"
                nextDisabled={
                  !stepOneReady
                }
                onNext={() =>
                  goToStep(2)
                }
              />
            </>
          )}

          {/* STEP 2 */}

          {step === 2 && (
            <>
              <Heading
                icon="👤"
                eyebrow="PROFILE CREATOR"
                title="შემქმნელის ინფორმაცია"
                text="ეს მონაცემები ყოველთვის სავალდებულოა, მიუხედავად იმისა პროფილს თქვენთვის ქმნით თუ სხვა პირისთვის."
              />

              <div className="topSummary">
                <SummaryItem
                  label="QR CODE"
                  value={
                    tagCode
                  }
                />

                <SummaryItem
                  label="PROFILE FOR"
                  value={
                    profileFor ===
                    "self"
                      ? "ჩემთვის"
                      : "სხვა პირისთვის"
                  }
                />
              </div>

              {profileFor ===
                "self" && (
                <div className="nameWarning">
                  <div>
                    !
                  </div>

                  <p>
                    <strong>
                      სახელი შეიყვანეთ ყურადღებით.
                    </strong>{" "}
                    Emergency პროფილის შექმნის შემდეგ სახელის შეცვლა
                    შესაძლებელი იქნება მხოლოდ ერთხელ, დამატებითი
                    იდენტიფიკაციის შემდეგ.
                  </p>
                </div>
              )}

              <div className="formGrid">
                <Field label="სახელი *">
                  <input
                    value={
                      ownerFirstName
                    }
                    onChange={(e) =>
                      setOwnerFirstName(
                        e.target.value
                      )
                    }
                    placeholder="სახელი"
                  />
                </Field>

                <Field label="გვარი *">
                  <input
                    value={
                      ownerLastName
                    }
                    onChange={(e) =>
                      setOwnerLastName(
                        e.target.value
                      )
                    }
                    placeholder="გვარი"
                  />
                </Field>

                <Field label="ტელეფონის ნომერი *">
                  <input
                    type="tel"
                    value={
                      ownerPhone
                    }
                    onChange={(e) =>
                      setOwnerPhone(
                        e.target.value
                      )
                    }
                    placeholder="+1 000 000 0000"
                  />
                </Field>

                <Field label="ელფოსტა *">
                  <input
                    type="email"
                    value={
                      ownerEmail
                    }
                    onChange={(e) =>
                      setOwnerEmail(
                        e.target.value
                      )
                    }
                    placeholder="name@email.com"
                  />
                </Field>
              </div>

              <InfoBox
                title="ძირითადი საკონტაქტო პირი"
                text="თუ Emergency პროფილი სხვა პირისთვის იქმნება და მას საკუთარი ტელეფონი არ აქვს, ძირითად საკონტაქტო ნომრად პროფილის შემქმნელის ნომერი გამოიყენება."
              />

              <Actions
                onBack={() =>
                  goToStep(1)
                }
                nextDisabled={
                  !ownerReady
                }
                onNext={
                  continueFromOwner
                }
              />
            </>
          )}

          {/* STEP 3 */}

          {step === 3 &&
            profileFor ===
              "other" && (
              <>
                <Heading
                  icon="👥"
                  eyebrow="BRACELET HOLDER"
                  title="ვის ეკუთვნის სამაჯური?"
                  text="სახელი, გვარი და შემქმნელთან კავშირი სავალდებულოა. საკუთარი ტელეფონი ან ელფოსტა ამ პირს არ სჭირდება."
                />

                <div className="creatorSummary">
                  <SummaryItem
                    label="შემქმნელი"
                    value={`${ownerFirstName} ${ownerLastName}`}
                  />

                  <SummaryItem
                    label="საკონტაქტო ნომერი"
                    value={
                      ownerPhone
                    }
                  />

                  <SummaryItem
                    label="QR კოდი"
                    value={
                      tagCode
                    }
                  />
                </div>

                <div className="nameWarning">
                  <div>
                    !
                  </div>

                  <p>
                    <strong>
                      სახელი შეიყვანეთ ყურადღებით.
                    </strong>{" "}
                    პროფილის შექმნის შემდეგ ამ ადამიანის სახელის შეცვლა
                    შესაძლებელი იქნება მხოლოდ ერთხელ, უსაფრთხოების
                    დამატებითი შემოწმების შემდეგ.
                  </p>
                </div>

                <div className="formGrid">
                  <Field label="სახელი *">
                    <input
                      value={
                        holderFirstName
                      }
                      onChange={(e) =>
                        setHolderFirstName(
                          e.target.value
                        )
                      }
                      placeholder="სახელი"
                    />
                  </Field>

                  <Field label="გვარი *">
                    <input
                      value={
                        holderLastName
                      }
                      onChange={(e) =>
                        setHolderLastName(
                          e.target.value
                        )
                      }
                      placeholder="გვარი"
                    />
                  </Field>

                  <Field label="დაბადების თარიღი">
                    <input
                      type="date"
                      value={
                        holderBirthDate
                      }
                      onChange={(e) =>
                        setHolderBirthDate(
                          e.target.value
                        )
                      }
                    />
                  </Field>

                  <Field label="სქესი">
                    <select
                      value={
                        holderSex
                      }
                      onChange={(e) =>
                        setHolderSex(
                          e.target.value
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
                  </Field>
                </div>

                <section className="subSection">
                  <SectionTitle
                    eyebrow="RELATIONSHIP · REQUIRED"
                    title="რა კავშირი აქვს შემქმნელს ამ პირთან?"
                  />

                  <div className="relationshipGrid">
                    {(
                      Object.keys(
                        relationshipLabels
                      ) as Exclude<
                        Relationship,
                        ""
                      >[]
                    ).map(
                      (value) => (
                        <button
                          key={
                            value
                          }
                          type="button"
                          className={
                            relationship ===
                            value
                              ? "relationshipButton selected"
                              : "relationshipButton"
                          }
                          onClick={() =>
                            setRelationship(
                              value
                            )
                          }
                        >
                          {
                            relationshipLabels[
                              value
                            ]
                          }
                        </button>
                      )
                    )}
                  </div>

                  {relationship ===
                    "other" && (
                    <div className="singleField">
                      <Field label="მიუთითეთ კავშირი *">
                        <input
                          value={
                            customRelationship
                          }
                          onChange={(e) =>
                            setCustomRelationship(
                              e.target
                                .value
                            )
                          }
                          placeholder="მაგ. ოჯახის მეგობარი"
                        />
                      </Field>
                    </div>
                  )}
                </section>

                <InfoBox
                  title="საკონტაქტო ნომერი"
                  text={`ამ პროფილის ძირითადი საკონტაქტო ნომერი იქნება ${ownerPhone || "პროფილის შემქმნელის ნომერი"}. დამატებითი Emergency Contacts მოგვიანებით სურვილისამებრ დაემატება.`}
                />

                <Actions
                  onBack={() =>
                    goToStep(2)
                  }
                  nextDisabled={
                    !holderReady
                  }
                  onNext={() =>
                    goToStep(4)
                  }
                />
              </>
            )}

          {/* STEP 4 */}

          {step === 4 && (
            <>
              <Heading
                icon="+"
                eyebrow="MEDICAL INFORMATION"
                title="სამედიცინო ინფორმაცია"
                text="ეს ინფორმაცია არჩევითია. დაამატეთ მხოლოდ ის, რაც გადაუდებელ სიტუაციაში შეიძლება მნიშვნელოვანი იყოს."
              />

              <ProfileSummary
                name={
                  holderName
                }
                tagCode={
                  tagCode
                }
              />

              <section className="subSection firstSection">
                <SectionTitle
                  eyebrow="01 · BASIC MEDICAL"
                  title="ძირითადი სამედიცინო ინფორმაცია"
                />

                <div className="formGrid">
                  <Field label="სისხლის ჯგუფი">
                    <select
                      value={
                        bloodGroup
                      }
                      onChange={(e) =>
                        setBloodGroup(
                          e.target.value
                        )
                      }
                    >
                      <option value="">
                        აირჩიეთ
                      </option>

                      {bloodGroups.map(
                        (group) => (
                          <option
                            key={
                              group
                            }
                            value={
                              group
                            }
                          >
                            {group}
                          </option>
                        )
                      )}
                    </select>
                  </Field>

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
                <SectionTitle
                  eyebrow="02 · HEALTH DETAILS"
                  title="ჯანმრთელობის მნიშვნელოვანი ინფორმაცია"
                />

                <div className="textareaGrid">
                  <Field label="ალერგიები">
                    <textarea
                      value={
                        allergies
                      }
                      onChange={(e) =>
                        setAllergies(
                          e.target.value
                        )
                      }
                      placeholder="მაგ. პენიცილინი, თხილი..."
                    />
                  </Field>

                  <Field label="სამედიცინო მდგომარეობები">
                    <textarea
                      value={
                        medicalConditions
                      }
                      onChange={(e) =>
                        setMedicalConditions(
                          e.target.value
                        )
                      }
                      placeholder="მნიშვნელოვანი მდგომარეობა"
                    />
                  </Field>

                  <Field label="მიმდინარე მედიკამენტები">
                    <textarea
                      value={
                        medications
                      }
                      onChange={(e) =>
                        setMedications(
                          e.target.value
                        )
                      }
                      placeholder="მედიკამენტები"
                    />
                  </Field>

                  <Field label="დამატებითი სამედიცინო შენიშვნა">
                    <textarea
                      value={
                        medicalNotes
                      }
                      onChange={(e) =>
                        setMedicalNotes(
                          e.target.value
                        )
                      }
                      placeholder="სხვა მნიშვნელოვანი ინფორმაცია"
                    />
                  </Field>
                </div>
              </section>

              <InfoBox
                title="კონფიდენციალურობის კონტროლი"
                text="ბოლო ნაბიჯზე თავად აირჩევთ, ამ ინფორმაციიდან რა გამოჩნდება QR კოდის სკანირებისას."
              />

              <Actions
                onBack={() =>
                  goToStep(
                    profileFor ===
                      "other"
                      ? 3
                      : 2
                  )
                }
                onNext={() =>
                  goToStep(5)
                }
              />
            </>
          )}

          {/* STEP 5 */}

          {step === 5 && (
            <>
              <Heading
                icon="☎"
                eyebrow="EMERGENCY CONTACTS"
                title="გადაუდებელი კონტაქტები"
                text="Emergency Contacts არჩევითია. ძირითადი საკონტაქტო ნომერი უკვე პროფილის შემქმნელის ნომერია."
              />

              <ProfileSummary
                name={
                  holderName
                }
                tagCode={
                  tagCode
                }
              />

              <div className="creatorContact">
                <div>
                  <span>
                    DEFAULT CONTACT
                  </span>

                  <strong>
                    {ownerFirstName} {ownerLastName}
                  </strong>

                  <p>
                    {ownerPhone}
                  </p>
                </div>

                <span className="requiredBadge">
                  ALWAYS AVAILABLE
                </span>
              </div>

              <section className="subSection firstSection">
                <div className="sectionWithToggle">
                  <SectionTitle
                    eyebrow="PRIMARY CONTACT · OPTIONAL"
                    title="დამატებითი Emergency Contact"
                  />

                  <MiniToggle
                    value={
                      primaryContactEnabled
                    }
                    onChange={
                      setPrimaryContactEnabled
                    }
                  />
                </div>

                {primaryContactEnabled && (
                  <div className="formGrid">
                    <Field label="სახელი *">
                      <input
                        value={
                          emergencyFirstName
                        }
                        onChange={(e) =>
                          setEmergencyFirstName(
                            e.target
                              .value
                          )
                        }
                        placeholder="სახელი"
                      />
                    </Field>

                    <Field label="გვარი *">
                      <input
                        value={
                          emergencyLastName
                        }
                        onChange={(e) =>
                          setEmergencyLastName(
                            e.target
                              .value
                          )
                        }
                        placeholder="გვარი"
                      />
                    </Field>

                    <Field label="ტელეფონის ნომერი *">
                      <input
                        type="tel"
                        value={
                          emergencyPhone
                        }
                        onChange={(e) =>
                          setEmergencyPhone(
                            e.target
                              .value
                          )
                        }
                        placeholder="+1 000 000 0000"
                      />
                    </Field>

                    <Field label="კავშირი *">
                      <input
                        value={
                          emergencyRelationship
                        }
                        onChange={(e) =>
                          setEmergencyRelationship(
                            e.target
                              .value
                          )
                        }
                        placeholder="მაგ. დედა, მეუღლე..."
                      />
                    </Field>
                  </div>
                )}
              </section>

              <section className="subSection">
                <div className="sectionWithToggle">
                  <SectionTitle
                    eyebrow="SECOND CONTACT · OPTIONAL"
                    title="მეორე დამატებითი კონტაქტი"
                  />

                  <MiniToggle
                    value={
                      secondContactEnabled
                    }
                    onChange={
                      setSecondContactEnabled
                    }
                  />
                </div>

                {secondContactEnabled && (
                  <div className="formGrid">
                    <Field label="სახელი *">
                      <input
                        value={
                          secondFirstName
                        }
                        onChange={(e) =>
                          setSecondFirstName(
                            e.target
                              .value
                          )
                        }
                        placeholder="სახელი"
                      />
                    </Field>

                    <Field label="გვარი *">
                      <input
                        value={
                          secondLastName
                        }
                        onChange={(e) =>
                          setSecondLastName(
                            e.target
                              .value
                          )
                        }
                        placeholder="გვარი"
                      />
                    </Field>

                    <Field label="ტელეფონის ნომერი *">
                      <input
                        type="tel"
                        value={
                          secondPhone
                        }
                        onChange={(e) =>
                          setSecondPhone(
                            e.target
                              .value
                          )
                        }
                        placeholder="+1 000 000 0000"
                      />
                    </Field>

                    <Field label="კავშირი *">
                      <input
                        value={
                          secondRelationship
                        }
                        onChange={(e) =>
                          setSecondRelationship(
                            e.target
                              .value
                          )
                        }
                        placeholder="მაგ. მამა, მომვლელი..."
                      />
                    </Field>
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
                      დამატებითი Emergency Contact არ დაგიმატებიათ.
                      შეგიძლიათ პირდაპირ გააგრძელოთ.
                    </p>
                  </div>
                )}

              <Actions
                onBack={() =>
                  goToStep(4)
                }
                nextDisabled={
                  !contactsReady
                }
                onNext={() =>
                  goToStep(6)
                }
              />
            </>
          )}

          {/* STEP 6 */}

          {step === 6 && (
            <>
              <Heading
                icon="✓"
                eyebrow="VISIBILITY & PREVIEW"
                title="რას დაინახავს QR-ის დამსკანერებელი?"
                text="აირჩიეთ, რომელი ინფორმაცია გამოჩნდეს Emergency პროფილში."
              />

              <div className="lockedSummary">
                <SummaryItem
                  label="QR CODE · LOCKED"
                  value={
                    tagCode
                  }
                />

                <SummaryItem
                  label="PROFILE TYPE · LOCKED"
                  value="Emergency Bracelet"
                />

                <SummaryItem
                  label="PROFILE FOR · LOCKED"
                  value={
                    profileFor ===
                    "self"
                      ? "ჩემთვის"
                      : "სხვა პირისთვის"
                  }
                />
              </div>

              <div className="visibilityLayout">
                <section className="visibilityPanel">
                  <SectionTitle
                    eyebrow="VISIBILITY"
                    title="ინფორმაციის ჩვენება"
                  />

                  <div className="visibilityGrid">
                    <VisibilityRow
                      title="სახელი და გვარი"
                      value={
                        showName
                      }
                      onChange={
                        setShowName
                      }
                    />

                    <VisibilityRow
                      title="დაბადების თარიღი"
                      value={
                        showBirthDate
                      }
                      onChange={
                        setShowBirthDate
                      }
                      disabled={
                        !holderBirthDate
                      }
                    />

                    <VisibilityRow
                      title="სქესი"
                      value={
                        showSex
                      }
                      onChange={
                        setShowSex
                      }
                      disabled={
                        !holderSex
                      }
                    />

                    <VisibilityRow
                      title="სისხლის ჯგუფი"
                      value={
                        showBloodGroup
                      }
                      onChange={
                        setShowBloodGroup
                      }
                      disabled={
                        !bloodGroup
                      }
                    />

                    <VisibilityRow
                      title="ალერგიები"
                      value={
                        showAllergies
                      }
                      onChange={
                        setShowAllergies
                      }
                      disabled={
                        !allergies
                      }
                    />

                    <VisibilityRow
                      title="სამედიცინო მდგომარეობები"
                      value={
                        showConditions
                      }
                      onChange={
                        setShowConditions
                      }
                      disabled={
                        !medicalConditions
                      }
                    />

                    <VisibilityRow
                      title="მედიკამენტები"
                      value={
                        showMedications
                      }
                      onChange={
                        setShowMedications
                      }
                      disabled={
                        !medications
                      }
                    />

                    <VisibilityRow
                      title="სამედიცინო შენიშვნა"
                      value={
                        showMedicalNotes
                      }
                      onChange={
                        setShowMedicalNotes
                      }
                      disabled={
                        !medicalNotes
                      }
                    />

                    <VisibilityRow
                      title="დამატებითი Emergency Contact"
                      value={
                        showPrimaryContact
                      }
                      onChange={
                        setShowPrimaryContact
                      }
                      disabled={
                        !primaryContactEnabled
                      }
                    />

                    <VisibilityRow
                      title="მეორე დამატებითი კონტაქტი"
                      value={
                        showSecondContact
                      }
                      onChange={
                        setShowSecondContact
                      }
                      disabled={
                        !secondContactEnabled
                      }
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
                      {holderName ||
                        "Emergency Profile"}
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
                            holderSex ===
                            "female"
                              ? "ქალი"
                              : holderSex ===
                                  "male"
                                ? "კაცი"
                                : "სხვა"
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
                          important
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
                          label="სამედიცინო შენიშვნა"
                          value={
                            medicalNotes
                          }
                        />
                      )}
                  </div>

                  <ContactPreview
                    label="PROFILE MANAGER"
                    name={`${ownerFirstName} ${ownerLastName}`}
                    relationship={
                      profileFor ===
                      "other"
                        ? relationship ===
                          "other"
                          ? customRelationship
                          : relationship
                            ? relationshipLabels[
                                relationship
                              ]
                            : "საკონტაქტო პირი"
                        : "პროფილის მფლობელი"
                    }
                    phone={
                      ownerPhone
                    }
                  />

                  {showPrimaryContact &&
                    primaryContactEnabled && (
                      <ContactPreview
                        label="EMERGENCY CONTACT"
                        name={`${emergencyFirstName} ${emergencyLastName}`}
                        relationship={
                          emergencyRelationship
                        }
                        phone={
                          emergencyPhone
                        }
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
                        phone={
                          secondPhone
                        }
                      />
                    )}
                </section>
              </div>

              <div className="finalNotice">
                <div>
                  ✓
                </div>

                <p>
                  QR კოდი, Emergency კატეგორია და პროფილის პირის
                  იდენტობა შექმნის შემდეგ ჩაიკეტება. სახელი შეიძლება
                  შეიცვალოს მხოლოდ ერთხელ დამატებითი იდენტიფიკაციის
                  შემდეგ; სხვა რედაქტირებადი ინფორმაცია მომავალშიც
                  შეგეძლებათ განაახლოთ.
                </p>
              </div>

              <div className="finalActions">
                <button
                  type="button"
                  className="secondaryButton"
                  onClick={() =>
                    goToStep(5)
                  }
                >
                  ← უკან
                </button>

                <button
                  type="button"
                  className="createButton"
                  onClick={
                    finishProfile
                  }
                >
                  ✓ პროფილის შექმნა
                </button>
              </div>
            </>
          )}
        </section>
      </main>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
        }

        button,
        input,
        select,
        textarea {
          font: inherit;
        }

        .page {
          min-height: 100vh;
          padding: 0 20px 38px;
          background: #0747c9;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Arial,
            sans-serif;
        }

        .topbar {
          width: 100%;
          max-width: 940px;
          height: 72px;
          margin: 0 auto;

          display: flex;
          align-items: center;
          justify-content: space-between;

          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .brandMark {
          width: 42px;
          height: 42px;

          display: grid;
          place-items: center;

          border-radius: 11px;
          background: #ffffff;
          color: #0747c9;

          font-size: 13px;
          font-weight: 950;
        }

        .brandText strong,
        .brandText span {
          display: block;
        }

        .brandText strong {
          color: #ffffff;
          font-size: 18px;
          font-weight: 950;
        }

        .brandText span {
          margin-top: 2px;
          color: rgba(255, 255, 255, 0.72);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.8px;
        }

        .topButton {
          min-height: 40px;
          padding: 0 14px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          border: 1px solid rgba(255, 255, 255, 0.34);
          border-radius: 10px;

          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;

          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
        }

        .card {
          width: 100%;
          max-width: 820px;

          margin: 26px auto 0;
          padding: 27px;

          border-radius: 21px;
          background: #ffffff;

          box-shadow: 0 24px 56px rgba(0, 24, 77, 0.25);
        }

        .progressRow {
          display: flex;
          align-items: center;
          gap: 12px;

          color: #0747c9;

          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.8px;
        }

        .progressTrack {
          flex: 1;
          height: 5px;

          overflow: hidden;

          border-radius: 20px;
          background: #e4ebf4;
        }

        .progressFill {
          height: 100%;

          border-radius: 20px;
          background: #0747c9;

          transition: width 0.2s ease;
        }

        .progressRow strong {
          white-space: nowrap;
        }

        .heading {
          margin-top: 18px;

          display: flex;
          align-items: center;
          gap: 13px;
        }

        .headingIcon {
          width: 50px;
          height: 50px;
          flex: 0 0 50px;

          display: grid;
          place-items: center;

          border-radius: 13px;

          background: #0747c9;
          color: #ffffff;

          font-size: 23px;
          font-weight: 800;
        }

        .eyebrow {
          display: block;
          margin-bottom: 3px;

          color: #0747c9;

          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .heading h1 {
          margin: 0;

          color: #203a55;

          font-size: 29px;
          font-weight: 900;
          line-height: 1.15;
        }

        .heading p {
          margin: 4px 0 0;

          color: #718397;

          font-size: 14px;
          line-height: 1.45;
        }

        .qrSection {
          margin-top: 21px;

          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;

          align-items: end;
        }

        .qrHelp {
          min-height: 83px;
          padding: 11px 13px;

          border: 1px solid #cbdcf4;
          border-radius: 11px;

          background: #f2f6fc;
        }

        .qrHelp span {
          color: #0747c9;

          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.8px;
        }

        .qrHelp strong {
          display: block;

          margin-top: 3px;

          color: #304a65;

          font-size: 12px;
          font-weight: 850;
        }

        .qrHelp p {
          margin: 3px 0 0;

          color: #718397;

          font-size: 10px;
          line-height: 1.4;
        }

        .choiceGrid {
          margin-top: 18px;

          display: grid;

          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .choice {
          min-height: 130px;
          padding: 15px 16px;

          display: flex;
          flex-direction: column;

          border: 1px solid #0b52d6;
          border-radius: 14px;

          background: #0b52d6;
          color: #ffffff;

          text-align: left;
          cursor: pointer;
        }

        .choice.active {
          background: #063fae;

          box-shadow: 0 0 0 4px rgba(7, 71, 201, 0.1);
        }

        .choiceTop {
          display: flex;
          justify-content: space-between;
        }

        .choiceTop > span {
          color: rgba(255, 255, 255, 0.72);
          font-size: 10px;
          font-weight: 900;
        }

        .choiceCircle {
          width: 27px;
          height: 27px;

          display: grid;
          place-items: center;

          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;

          background: rgba(255, 255, 255, 0.12);
        }

        .choiceIcon {
          margin-top: 9px;
          font-size: 24px;
        }

        .choice h2 {
          margin: 7px 0 0;

          color: #ffffff;

          font-size: 20px;
          font-weight: 900;
        }

        .choice p {
          margin: 5px 0 0;

          color: rgba(255, 255, 255, 0.86);

          font-size: 13px;
          line-height: 1.4;
        }

        .infoBox,
        .optionalNotice,
        .finalNotice,
        .nameWarning {
          margin-top: 18px;
          padding: 10px 12px;

          display: flex;
          align-items: center;
          gap: 9px;

          border: 1px solid #cbdcf4;
          border-radius: 10px;

          background: #f2f6fc;
        }

        .nameWarning {
          border-color: #d8e2ee;
          background: #fbfcfe;
        }

        .infoIcon,
        .optionalNotice > div,
        .finalNotice > div,
        .nameWarning > div {
          width: 28px;
          height: 28px;
          flex: 0 0 28px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          background: #0747c9;
          color: #ffffff;

          font-size: 11px;
          font-weight: 900;
        }

        .infoBox strong {
          display: block;

          color: #304a65;

          font-size: 13px;
          font-weight: 850;
        }

        .infoBox p,
        .optionalNotice p,
        .finalNotice p,
        .nameWarning p {
          margin: 2px 0 0;

          color: #718397;

          font-size: 12px;
          line-height: 1.4;
        }

        .nameWarning p strong {
          color: #304a65;
        }

        .topSummary,
        .lockedSummary {
          margin-top: 19px;
          padding: 12px 14px;

          display: grid;
          gap: 10px;

          border-radius: 10px;
          background: #0747c9;
        }

        .topSummary {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .lockedSummary {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .formGrid,
        .textareaGrid {
          margin-top: 17px;

          display: grid;

          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .field {
          min-width: 0;
        }

        .field label {
          display: block;
          margin: 0 0 7px 2px;

          color: #344e68;

          font-size: 14px;
          font-weight: 850;
        }

        .field input,
        .field select {
          width: 100%;
          height: 56px;

          padding: 0 15px;

          border: 1.5px solid #d5e0eb;
          border-radius: 10px;

          background: #ffffff;
          color: #263f59;

          font-size: 15px;
          outline: none;
        }

        .field textarea {
          width: 100%;
          min-height: 94px;

          padding: 12px 14px;

          resize: vertical;

          border: 1.5px solid #d5e0eb;
          border-radius: 10px;

          color: #263f59;

          font-size: 14px;
          line-height: 1.45;

          outline: none;
        }

        .field input:focus,
        .field select:focus,
        .field textarea:focus {
          border-color: #0747c9;

          box-shadow: 0 0 0 4px rgba(7, 71, 201, 0.08);
        }

        .creatorSummary {
          margin-top: 19px;
          padding: 12px 14px;

          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;

          border-radius: 10px;
          background: #0747c9;
        }

        .summaryItem span,
        .summaryItem strong {
          display: block;
        }

        .summaryItem span {
          color: rgba(255, 255, 255, 0.68);

          font-size: 9px;
        }

        .summaryItem strong {
          margin-top: 3px;

          color: #ffffff;

          font-size: 12px;

          overflow-wrap: anywhere;
        }

        .subSection {
          margin-top: 18px;
          padding-top: 16px;

          border-top: 1px solid #e1e8f0;
        }

        .firstSection {
          margin-top: 20px;
        }

        .sectionTitle > span {
          color: #0747c9;

          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.9px;
        }

        .sectionTitle h3 {
          margin: 4px 0 0;

          color: #304a65;

          font-size: 17px;
          font-weight: 850;
        }

        .relationshipGrid {
          margin-top: 11px;

          display: grid;

          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 7px;
        }

        .relationshipButton {
          min-height: 46px;

          border: 1px solid #d7e2ed;
          border-radius: 9px;

          background: #ffffff;
          color: #536a81;

          font-size: 12px;
          font-weight: 800;

          cursor: pointer;
        }

        .relationshipButton.selected {
          border-color: #0747c9;

          background: #edf4ff;
          color: #0747c9;
        }

        .singleField {
          margin-top: 12px;
        }

        .holderSummary {
          margin-top: 19px;
          padding: 12px 14px;

          display: flex;
          align-items: center;
          gap: 10px;

          border-radius: 11px;

          background: #0747c9;
        }

        .holderAvatar {
          width: 38px;
          height: 38px;

          display: grid;
          place-items: center;

          border-radius: 10px;

          background: rgba(255, 255, 255, 0.15);
        }

        .holderSummary span,
        .holderSummary strong,
        .holderSummary p {
          display: block;
        }

        .holderSummary span {
          color: rgba(255, 255, 255, 0.68);

          font-size: 9px;
          font-weight: 900;
        }

        .holderSummary strong {
          margin-top: 2px;

          color: #ffffff;
          font-size: 15px;
        }

        .holderSummary p {
          margin: 2px 0 0;

          color: rgba(255, 255, 255, 0.75);

          font-size: 10px;
        }

        .optionalBox {
          min-height: 56px;
          padding: 9px 12px;

          display: flex;
          flex-direction: column;
          justify-content: center;

          border: 1px solid #dce5ee;
          border-radius: 10px;

          background: #f8fafd;
        }

        .optionalBox span {
          color: #0747c9;

          font-size: 8px;
          font-weight: 900;
        }

        .optionalBox strong {
          margin-top: 2px;

          color: #304a65;

          font-size: 12px;
        }

        .optionalBox p {
          margin: 2px 0 0;

          color: #7a8999;

          font-size: 10px;
        }

        .creatorContact {
          margin-top: 19px;
          padding: 12px 14px;

          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;

          border-radius: 11px;

          background: #0747c9;
        }

        .creatorContact span,
        .creatorContact strong,
        .creatorContact p {
          display: block;
        }

        .creatorContact > div > span {
          color: rgba(255, 255, 255, 0.7);

          font-size: 8px;
          font-weight: 900;
        }

        .creatorContact strong {
          margin-top: 2px;

          color: #ffffff;

          font-size: 14px;
        }

        .creatorContact p {
          margin: 2px 0 0;

          color: rgba(255, 255, 255, 0.82);

          font-size: 12px;
        }

        .requiredBadge {
          padding: 6px 8px;

          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 999px;

          background: rgba(255, 255, 255, 0.12);

          color: #ffffff !important;

          font-size: 8px !important;
          font-weight: 900;
        }

        .sectionWithToggle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
        }

        .miniToggle {
          width: 70px;
          height: 34px;

          border: 1px solid #d5e0eb;
          border-radius: 999px;

          background: #f4f6f9;
          color: #8090a0;

          font-size: 10px;
          font-weight: 900;

          cursor: pointer;
        }

        .miniToggle.on {
          border-color: #0747c9;

          background: #0747c9;
          color: #ffffff;
        }

        .actions,
        .finalActions {
          margin-top: 20px;

          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .secondaryButton,
        .primaryButton,
        .createButton {
          min-height: 47px;
          padding: 0 18px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          border-radius: 10px;

          font-size: 14px;
          font-weight: 850;

          text-decoration: none;
          cursor: pointer;
        }

        .secondaryButton {
          border: 1px solid #d6e1ec;

          background: #ffffff;
          color: #64788d;
        }

        .primaryButton,
        .createButton {
          border: 0;

          background: #0747c9;
          color: #ffffff;

          box-shadow: 0 8px 18px rgba(7, 71, 201, 0.16);
        }

        .primaryButton {
          min-width: 145px;
        }

        .createButton {
          min-width: 170px;
        }

        .primaryButton:disabled {
          background: #b8c5d5;

          box-shadow: none;

          cursor: not-allowed;
        }

        .visibilityLayout {
          margin-top: 20px;

          display: grid;

          grid-template-columns: 1fr 0.9fr;
          gap: 14px;

          align-items: start;
        }

        .visibilityPanel,
        .previewPanel {
          border: 1px solid #dde6ef;
          border-radius: 13px;

          background: #ffffff;
        }

        .visibilityPanel {
          padding: 15px;
        }

        .visibilityGrid {
          margin-top: 12px;

          display: grid;
          gap: 7px;
        }

        .visibilityRow {
          min-height: 50px;
          padding: 7px 9px;

          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;

          border: 1px solid #e1e8ef;
          border-radius: 9px;

          background: #fbfcfe;
        }

        .visibilityRow.disabled {
          opacity: 0.48;
        }

        .visibilityRow strong {
          color: #344e68;

          font-size: 12px;
          font-weight: 820;
        }

        .visibilityToggle {
          min-width: 64px;
          height: 30px;

          border: 1px solid #d3dde7;
          border-radius: 999px;

          background: #f3f5f8;
          color: #82909e;

          font-size: 9px;
          font-weight: 900;

          cursor: pointer;
        }

        .visibilityToggle.on {
          border-color: #0747c9;

          background: #0747c9;
          color: #ffffff;
        }

        .previewPanel {
          overflow: hidden;

          box-shadow: 0 10px 24px rgba(30, 70, 120, 0.06);
        }

        .previewTop {
          padding: 13px 14px;

          display: flex;
          align-items: center;
          gap: 9px;

          background: #0747c9;
          color: #ffffff;
        }

        .previewMark {
          width: 34px;
          height: 34px;

          display: grid;
          place-items: center;

          border-radius: 9px;

          background: #ffffff;
          color: #0747c9;

          font-size: 22px;
        }

        .previewTop span,
        .previewTop strong {
          display: block;
        }

        .previewTop span {
          color: rgba(255, 255, 255, 0.7);

          font-size: 8px;
          font-weight: 900;
        }

        .previewTop strong {
          margin-top: 1px;
          font-size: 13px;
        }

        .previewPanel > h2 {
          margin: 14px 14px 0;

          color: #263f59;

          font-size: 19px;
        }

        .previewDetails {
          padding: 10px 14px 12px;

          display: grid;
          gap: 7px;
        }

        .previewRow {
          min-height: 42px;
          padding: 7px 9px;

          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;

          border-radius: 8px;

          background: #f5f8fc;
        }

        .previewRow.important {
          background: #edf4ff;
        }

        .previewRow span {
          color: #7b8b9c;
          font-size: 10px;
        }

        .previewRow strong {
          color: #304a65;
          font-size: 12px;
        }

        .previewBlock {
          padding: 8px 9px;

          border-radius: 8px;

          background: #f8fafc;
        }

        .previewBlock span,
        .previewBlock strong {
          display: block;
        }

        .previewBlock span {
          color: #8493a2;

          font-size: 9px;
          font-weight: 800;
        }

        .previewBlock strong {
          margin-top: 3px;

          color: #3b536b;

          font-size: 11px;
          line-height: 1.4;
        }

        .contactPreview {
          margin: 0 14px 10px;
          padding: 10px;

          border: 1px solid #cfe0f5;
          border-radius: 9px;

          background: #f2f7ff;
        }

        .contactPreview > span {
          color: #0747c9;

          font-size: 8px;
          font-weight: 900;
        }

        .contactPreview h3 {
          margin: 3px 0 0;

          color: #304a65;

          font-size: 13px;
        }

        .contactPreview p {
          margin: 2px 0 0;

          color: #718397;

          font-size: 10px;
        }

        .contactPreview a {
          margin-top: 7px;
          height: 34px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 8px;

          background: #0747c9;
          color: #ffffff;

          font-size: 10px;
          font-weight: 850;

          text-decoration: none;
        }

        @media (max-width: 760px) {
          .visibilityLayout,
          .qrSection {
            grid-template-columns: 1fr;
          }

          .creatorSummary,
          .lockedSummary {
            grid-template-columns: 1fr;
          }

          .relationshipGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 600px) {
          .page {
            padding: 0 12px 26px;
          }

          .topbar {
            height: 66px;
          }

          .brandText span {
            display: none;
          }

          .card {
            margin-top: 18px;
            padding: 19px 15px;

            border-radius: 16px;
          }

          .progressRow > span {
            display: none;
          }

          .heading h1 {
            font-size: 24px;
          }

          .heading p {
            font-size: 13px;
          }

          .choiceGrid,
          .formGrid,
          .textareaGrid,
          .topSummary {
            grid-template-columns: 1fr;
          }

          .actions,
          .finalActions {
            flex-direction: column-reverse;
          }

          .secondaryButton,
          .primaryButton,
          .createButton {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}

function Heading({
  icon,
  eyebrow,
  title,
  text,
}: {
  icon: string;
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="heading">
      <div className="headingIcon">
        {icon}
      </div>

      <div>
        <span className="eyebrow">
          {eyebrow}
        </span>

        <h1>{title}</h1>

        <p>{text}</p>
      </div>
    </div>
  );
}

function ChoiceCard({
  number,
  icon,
  title,
  text,
  active,
  onClick,
}: {
  number: string;
  icon: string;
  title: string;
  text: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={
        active
          ? "choice active"
          : "choice"
      }
      onClick={onClick}
    >
      <div className="choiceTop">
        <span>{number}</span>

        <div className="choiceCircle">
          {active ? "✓" : "→"}
        </div>
      </div>

      <div className="choiceIcon">
        {icon}
      </div>

      <h2>{title}</h2>

      <p>{text}</p>
    </button>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
    </div>
  );
}

function InfoBox({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="infoBox">
      <div className="infoIcon">
        i
      </div>

      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="sectionTitle">
      <span>{eyebrow}</span>
      <h3>{title}</h3>
    </div>
  );
}

function SummaryItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="summaryItem">
      <span>{label}</span>
      <strong>{value || "—"}</strong>
    </div>
  );
}

function ProfileSummary({
  name,
  tagCode,
}: {
  name: string;
  tagCode: string;
}) {
  return (
    <div className="holderSummary">
      <div className="holderAvatar">
        👤
      </div>

      <div>
        <span>
          EMERGENCY PROFILE · {tagCode}
        </span>

        <strong>
          {name ||
            "პროფილის მფლობელი"}
        </strong>

        <p>
          Emergency Bracelet
        </p>
      </div>
    </div>
  );
}

function MiniToggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (
    value: boolean
  ) => void;
}) {
  return (
    <button
      type="button"
      className={
        value
          ? "miniToggle on"
          : "miniToggle"
      }
      onClick={() =>
        onChange(!value)
      }
    >
      {value ? "ON" : "OFF"}
    </button>
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
  onChange: (
    value: boolean
  ) => void;
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
      <strong>{title}</strong>

      <button
        type="button"
        className={
          value &&
          !disabled
            ? "visibilityToggle on"
            : "visibilityToggle"
        }
        disabled={disabled}
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
      <span>{label}</span>
      <strong>{value}</strong>
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
      <span>{label}</span>
      <strong>{value}</strong>
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
      <span>{label}</span>

      <h3>{name}</h3>

      <p>{relationship}</p>

      <a href={`tel:${phone}`}>
        ☎ {phone}
      </a>
    </div>
  );
}

function Actions({
  onBack,
  backHref,
  onNext,
  nextDisabled = false,
}: {
  onBack?: () => void;
  backHref?: string;
  onNext: () => void;
  nextDisabled?: boolean;
}) {
  return (
    <div className="actions">
      {backHref ? (
        <a
          href={backHref}
          className="secondaryButton"
        >
          ← უკან
        </a>
      ) : (
        <button
          type="button"
          className="secondaryButton"
          onClick={onBack}
        >
          ← უკან
        </button>
      )}

      <button
        type="button"
        className="primaryButton"
        disabled={nextDisabled}
        onClick={onNext}
      >
        გაგრძელება
        <span>→</span>
      </button>
    </div>
  );
}
