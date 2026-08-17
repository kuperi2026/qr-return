"use client";

import { FormEvent, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Language = "ka" | "en";
type Step = 1 | 2 | 3;

type CategoryKey =
  | "dog"
  | "cat"
  | "keys"
  | "wallet"
  | "suitcase"
  | "bag";

const categories = {
  dog: {
    icon: "🐕",
    ka: "ძაღლი",
    en: "Dog",
    itemType: "pet",
    petType: "dog",
    isPet: true,
  },
  cat: {
    icon: "🐈",
    ka: "კატა",
    en: "Cat",
    itemType: "pet",
    petType: "cat",
    isPet: true,
  },
  keys: {
    icon: "🔑",
    ka: "გასაღები",
    en: "Keys",
    itemType: "keys",
    petType: null,
    isPet: false,
  },
  wallet: {
    icon: "👛",
    ka: "საფულე",
    en: "Wallet",
    itemType: "wallet",
    petType: null,
    isPet: false,
  },
  suitcase: {
    icon: "🧳",
    ka: "ჩემოდანი",
    en: "Suitcase",
    itemType: "suitcase",
    petType: null,
    isPet: false,
  },
  bag: {
    icon: "🎒",
    ka: "ჩანთა",
    en: "Bag",
    itemType: "bag",
    petType: null,
    isPet: false,
  },
} as const;

type FormState = {
  tag_code: string;
  item_name: string;
  colour: string;

  sex: string;
  date_of_birth: string;
  weight: string;
  medical_info: string;

  brand: string;
  model: string;
  size: string;
  material: string;
  distinctive_features: string;

  description: string;

  owner_first_name: string;
  owner_last_name: string;
  owner_phone: string;
  owner_email: string;

  additional_contact_name: string;
  additional_contact_phone: string;
  additional_contact_email: string;

  contact_preference: string;

  finder_message: string;
  reward: string;
  lost_seen_location: string;
};

const initialForm: FormState = {
  tag_code: "",
  item_name: "",
  colour: "",

  sex: "",
  date_of_birth: "",
  weight: "",
  medical_info: "",

  brand: "",
  model: "",
  size: "",
  material: "",
  distinctive_features: "",

  description: "",

  owner_first_name: "",
  owner_last_name: "",
  owner_phone: "",
  owner_email: "",

  additional_contact_name: "",
  additional_contact_phone: "",
  additional_contact_email: "",

  contact_preference: "both",

  finder_message: "",
  reward: "",
  lost_seen_location: "",
};

export default function RegistrationPage() {
  const params = useParams();

  const rawType = Array.isArray(params.type)
    ? params.type[0]
    : params.type;

  const type: CategoryKey =
    rawType && rawType in categories
      ? (rawType as CategoryKey)
      : "dog";

  const category = categories[type];

  const [language, setLanguage] =
    useState<Language>("ka");

  const [step, setStep] =
    useState<Step>(1);

  const [form, setForm] =
    useState<FormState>(initialForm);

  const [showExtraProfile, setShowExtraProfile] =
    useState(false);

  const [showExtraContact, setShowExtraContact] =
    useState(false);

  const [
    locationSharingEnabled,
    setLocationSharingEnabled,
  ] = useState(false);

  const [itemPhoto, setItemPhoto] =
    useState<File | null>(null);

  const [ownerPhoto, setOwnerPhoto] =
    useState<File | null>(null);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  const ka = language === "ka";

  function updateField(
    name: keyof FormState,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function goTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function nextStep() {
    setError("");

    if (step === 1) {
      if (!form.tag_code.trim()) {
        setError(
          ka
            ? "გთხოვთ, მიუთითოთ QR კოდი."
            : "Please enter the QR code."
        );
        return;
      }

      if (!form.item_name.trim()) {
        setError(
          ka
            ? category.isPet
              ? "გთხოვთ, მიუთითოთ ცხოველის სახელი."
              : "გთხოვთ, მიუთითოთ ნივთის დასახელება."
            : category.isPet
            ? "Please enter the pet name."
            : "Please enter the item name."
        );
        return;
      }

      setStep(2);
      goTop();
      return;
    }

    if (step === 2) {
      if (!form.owner_first_name.trim()) {
        setError(
          ka
            ? "გთხოვთ, მიუთითოთ მფლობელის სახელი."
            : "Please enter the owner's first name."
        );
        return;
      }

      if (!form.owner_last_name.trim()) {
        setError(
          ka
            ? "გთხოვთ, მიუთითოთ მფლობელის გვარი."
            : "Please enter the owner's last name."
        );
        return;
      }

      if (!form.owner_phone.trim()) {
        setError(
          ka
            ? "გთხოვთ, მიუთითოთ მობილურის ნომერი."
            : "Please enter the phone number."
        );
        return;
      }

      if (!form.owner_email.trim()) {
        setError(
          ka
            ? "გთხოვთ, მიუთითოთ ელფოსტა."
            : "Please enter an email address."
        );
        return;
      }

      setStep(3);
      goTop();
    }
  }

  function previousStep() {
    setError("");

    setStep((current) =>
      current === 3 ? 2 : 1
    );

    goTop();
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (step !== 3) {
      nextStep();
      return;
    }

    setSaving(true);
    setError("");

    try {
      const payload = {
        tag_code:
          form.tag_code.trim(),

        item_type:
          category.itemType,

        pet_type:
          category.petType,

        item_name:
          form.item_name.trim(),

        colour:
          form.colour.trim() || null,

        sex:
          category.isPet
            ? form.sex || null
            : null,

        date_of_birth:
          category.isPet
            ? form.date_of_birth || null
            : null,

        weight:
          category.isPet &&
          form.weight.trim()
            ? Number(form.weight)
            : null,

        medical_info:
          category.isPet
            ? form.medical_info.trim() || null
            : null,

        brand:
          !category.isPet
            ? form.brand.trim() || null
            : null,

        model:
          !category.isPet
            ? form.model.trim() || null
            : null,

        size:
          !category.isPet
            ? form.size.trim() || null
            : null,

        material:
          !category.isPet
            ? form.material.trim() || null
            : null,

        distinctive_features:
          !category.isPet
            ? form.distinctive_features.trim() || null
            : null,

        description:
          form.description.trim() || null,

        owner_phone:
          form.owner_phone.trim(),

        owner_email:
          form.owner_email.trim(),

        finder_message:
          form.finder_message.trim() || null,

        contact_preference:
          form.contact_preference,

        location_sharing_enabled:
          locationSharingEnabled,

        owner_message_enabled:
          Boolean(form.finder_message.trim()),

        lost_seen_location:
          form.lost_seen_location.trim() || null,

        active: true,
      };

      const { error: saveError } =
        await supabase
          .from("item")
          .insert(payload);

      if (saveError) {
        console.error(
          "Supabase save error:",
          saveError
        );

        setError(
          ka
            ? `შენახვა ვერ მოხერხდა: ${saveError.message}`
            : `Save failed: ${saveError.message}`
        );

        return;
      }

      setSuccess(true);
      goTop();
    } catch (err) {
      console.error(
        "Registration error:",
        err
      );

      setError(
        ka
          ? "ინფორმაციის შენახვისას დაფიქსირდა შეცდომა."
          : "An error occurred while saving the information."
      );
    } finally {
      setSaving(false);
    }
  }

  if (success) {
    return (
      <main className="page">
        <Header
          ka={ka}
          language={language}
          setLanguage={setLanguage}
        />

        <section className="successPage">
          <div className="successIcon">
            ✓
          </div>

          <div className="smallLabel">
            QR RETURN
          </div>

          <h1>
            {ka
              ? "პროფილი წარმატებით შეიქმნა"
              : "Profile created successfully"}
          </h1>

          <p>
            {ka
              ? "ინფორმაცია წარმატებით შეინახა. პროფილის მონაცემების რედაქტირებას მომავალშიც შეძლებთ."
              : "Your information has been saved. You will be able to edit the profile later."}
          </p>

          <div className="successNotice">
            <strong>
              {ka
                ? "კატეგორია უცვლელია"
                : "Category is fixed"}
            </strong>

            <span>
              {ka
                ? `ეს QR კოდი რეგისტრირებულია კატეგორიაში „${category.ka}“. პროფილის მონაცემების შეცვლა შესაძლებელი იქნება, კატეგორიის — არა.`
                : `This QR code is registered as "${category.en}". Profile information can be changed later, but the category cannot be changed.`}
            </span>
          </div>

          <a
            href="/"
            className="primaryLink"
          >
            {ka
              ? "მთავარ გვერდზე დაბრუნება"
              : "Return to home"}
          </a>
        </section>

        <Styles />
      </main>
    );
  }

  return (
    <main className="page">
      <Header
        ka={ka}
        language={language}
        setLanguage={setLanguage}
      />

      <section className="registration">
        <div className="intro">
          <div className="categoryBox">
            {category.icon}
          </div>

          <div>
            <div className="smallLabel">
              QR RETURN
            </div>

            <h1>
              {ka
                ? "პროფილის შექმნა"
                : "Create profile"}
            </h1>

            <p>
              {ka
                ? "შეავსეთ ინფორმაცია, რომელიც დაკარგვის შემთხვევაში მპოვნელს თქვენთან დაკავშირებას გაუმარტივებს."
                : "Add information that will make it easier for a finder to contact you if your pet or item is lost."}
            </p>
          </div>
        </div>

        <div className="progress">
          <ProgressItem
            number="1"
            label={
              ka ? "პროფილი" : "Profile"
            }
            active={step >= 1}
            current={step === 1}
          />

          <div
            className={
              step >= 2
                ? "progressLine active"
                : "progressLine"
            }
          />

          <ProgressItem
            number="2"
            label={
              ka ? "მფლობელი" : "Owner"
            }
            active={step >= 2}
            current={step === 2}
          />

          <div
            className={
              step >= 3
                ? "progressLine active"
                : "progressLine"
            }
          />

          <ProgressItem
            number="3"
            label={
              ka ? "დასრულება" : "Finish"
            }
            active={step >= 3}
            current={step === 3}
          />
        </div>

        <form
          className="formCard"
          onSubmit={handleSubmit}
        >
          {step === 1 && (
            <>
              <StepHeader
                number="01"
                title={
                  ka
                    ? category.isPet
                      ? "ცხოველის ინფორმაცია"
                      : "ნივთის ინფორმაცია"
                    : category.isPet
                    ? "Pet information"
                    : "Item information"
                }
                description={
                  ka
                    ? "შეავსეთ ძირითადი ინფორმაცია. დამატებითი მონაცემების შევსება ნებაყოფლობითია."
                    : "Add the basic information. Additional details are optional."
                }
              />

              <Field
                label={
                  ka
                    ? "QR კოდი"
                    : "QR code"
                }
                value={form.tag_code}
                onChange={(value) =>
                  updateField(
                    "tag_code",
                    value
                  )
                }
                placeholder="LF-XXXXXX"
                required
              />

              <Field
                label={
                  category.isPet
                    ? ka
                      ? "სახელი"
                      : "Pet name"
                    : ka
                    ? "ნივთის დასახელება"
                    : "Item name"
                }
                value={form.item_name}
                onChange={(value) =>
                  updateField(
                    "item_name",
                    value
                  )
                }
                placeholder={
                  category.isPet
                    ? ka
                      ? "მაგ. ბობი"
                      : "Example: Bobby"
                    : ka
                    ? "მაგ. შავი საფულე"
                    : "Example: Black wallet"
                }
                required
              />

              <div className="twoColumns">
                <Field
                  label={
                    ka
                      ? "ფერი"
                      : "Colour"
                  }
                  value={form.colour}
                  onChange={(value) =>
                    updateField(
                      "colour",
                      value
                    )
                  }
                  placeholder={
                    ka
                      ? "მაგ. ყავისფერი"
                      : "Example: Brown"
                  }
                />

                {category.isPet ? (
                  <SelectField
                    label={
                      ka
                        ? "სქესი"
                        : "Sex"
                    }
                    value={form.sex}
                    onChange={(value) =>
                      updateField(
                        "sex",
                        value
                      )
                    }
                    options={[
                      {
                        value: "",
                        label: ka
                          ? "აირჩიეთ"
                          : "Select",
                      },
                      {
                        value: "male",
                        label: ka
                          ? "მამრობითი"
                          : "Male",
                      },
                      {
                        value: "female",
                        label: ka
                          ? "მდედრობითი"
                          : "Female",
                      },
                    ]}
                  />
                ) : (
                  <Field
                    label={
                      ka
                        ? "ბრენდი"
                        : "Brand"
                    }
                    value={form.brand}
                    onChange={(value) =>
                      updateField(
                        "brand",
                        value
                      )
                    }
                    placeholder={
                      ka
                        ? "მაგ. Samsonite"
                        : "Example: Samsonite"
                    }
                  />
                )}
              </div>

              <PhotoField
                label={
                  category.isPet
                    ? ka
                      ? "ცხოველის ფოტო — ნებაყოფლობითი"
                      : "Pet photo — optional"
                    : ka
                    ? "ნივთის ფოტო — ნებაყოფლობითი"
                    : "Item photo — optional"
                }
                file={itemPhoto}
                setFile={setItemPhoto}
                ka={ka}
              />

              <button
                type="button"
                className="optionalButton"
                onClick={() =>
                  setShowExtraProfile(
                    !showExtraProfile
                  )
                }
              >
                <span>
                  {showExtraProfile
                    ? "−"
                    : "+"}
                </span>

                {ka
                  ? "დამატებითი ინფორმაცია"
                  : "Additional information"}
              </button>

              {showExtraProfile && (
                <div className="optionalPanel">
                  {category.isPet ? (
                    <>
                      <div className="twoColumns">
                        <Field
                          label={
                            ka
                              ? "დაბადების თარიღი"
                              : "Date of birth"
                          }
                          type="date"
                          value={
                            form.date_of_birth
                          }
                          onChange={(value) =>
                            updateField(
                              "date_of_birth",
                              value
                            )
                          }
                        />

                        <Field
                          label={
                            ka
                              ? "წონა"
                              : "Weight"
                          }
                          type="number"
                          value={form.weight}
                          onChange={(value) =>
                            updateField(
                              "weight",
                              value
                            )
                          }
                          placeholder="12.5"
                        />
                      </div>

                      <TextArea
                        label={
                          ka
                            ? "სამედიცინო ინფორმაცია"
                            : "Medical information"
                        }
                        value={
                          form.medical_info
                        }
                        onChange={(value) =>
                          updateField(
                            "medical_info",
                            value
                          )
                        }
                      />
                    </>
                  ) : (
                    <>
                      <div className="twoColumns">
                        <Field
                          label={
                            ka
                              ? "მოდელი"
                              : "Model"
                          }
                          value={form.model}
                          onChange={(value) =>
                            updateField(
                              "model",
                              value
                            )
                          }
                        />

                        <Field
                          label={
                            ka
                              ? "ზომა"
                              : "Size"
                          }
                          value={form.size}
                          onChange={(value) =>
                            updateField(
                              "size",
                              value
                            )
                          }
                        />
                      </div>

                      <Field
                        label={
                          ka
                            ? "მასალა"
                            : "Material"
                        }
                        value={form.material}
                        onChange={(value) =>
                          updateField(
                            "material",
                            value
                          )
                        }
                      />

                      <TextArea
                        label={
                          ka
                            ? "განმასხვავებელი ნიშნები"
                            : "Distinctive features"
                        }
                        value={
                          form.distinctive_features
                        }
                        onChange={(value) =>
                          updateField(
                            "distinctive_features",
                            value
                          )
                        }
                      />
                    </>
                  )}

                  <TextArea
                    label={
                      ka
                        ? "დამატებითი აღწერა"
                        : "Additional description"
                    }
                    value={form.description}
                    onChange={(value) =>
                      updateField(
                        "description",
                        value
                      )
                    }
                  />
                </div>
              )}

              {error && (
                <ErrorMessage
                  text={error}
                />
              )}

              <div className="singleAction">
                <button
                  type="button"
                  className="nextButton"
                  onClick={nextStep}
                >
                  {ka
                    ? "შემდეგი"
                    : "Next"}{" "}
                  →
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <StepHeader
                number="02"
                title={
                  ka
                    ? "მფლობელის ინფორმაცია"
                    : "Owner information"
                }
                description={
                  ka
                    ? "მიუთითეთ საკონტაქტო ინფორმაცია, რომლის საშუალებითაც მპოვნელი შეძლებს თქვენთან დაკავშირებას."
                    : "Add the contact information the finder can use to reach you."
                }
              />

              <div className="twoColumns">
                <Field
                  label={
                    ka
                      ? "სახელი"
                      : "First name"
                  }
                  value={
                    form.owner_first_name
                  }
                  onChange={(value) =>
                    updateField(
                      "owner_first_name",
                      value
                    )
                  }
                  required
                />

                <Field
                  label={
                    ka
                      ? "გვარი"
                      : "Last name"
                  }
                  value={
                    form.owner_last_name
                  }
                  onChange={(value) =>
                    updateField(
                      "owner_last_name",
                      value
                    )
                  }
                  required
                />
              </div>

              <Field
                label={
                  ka
                    ? "ელფოსტა"
                    : "Email"
                }
                type="email"
                value={form.owner_email}
                onChange={(value) =>
                  updateField(
                    "owner_email",
                    value
                  )
                }
                placeholder="name@example.com"
                required
              />

              <Field
                label={
                  ka
                    ? "მობილურის ნომერი"
                    : "Phone number"
                }
                type="tel"
                value={form.owner_phone}
                onChange={(value) =>
                  updateField(
                    "owner_phone",
                    value
                  )
                }
                placeholder="+1 000 000 0000"
                required
              />

              <PhotoField
                label={
                  ka
                    ? "მფლობელის ფოტო — ნებაყოფლობითი"
                    : "Owner photo — optional"
                }
                file={ownerPhoto}
                setFile={setOwnerPhoto}
                ka={ka}
              />

              <SelectField
                label={
                  ka
                    ? "როგორ გსურთ მპოვნელმა დაგიკავშირდეთ?"
                    : "How should the finder contact you?"
                }
                value={
                  form.contact_preference
                }
                onChange={(value) =>
                  updateField(
                    "contact_preference",
                    value
                  )
                }
                options={[
                  {
                    value: "both",
                    label: ka
                      ? "Live Chat და ტელეფონი"
                      : "Live Chat & phone",
                  },
                  {
                    value: "chat",
                    label: "Live Chat",
                  },
                  {
                    value: "phone",
                    label: ka
                      ? "ტელეფონი"
                      : "Phone",
                  },
                ]}
              />

              <button
                type="button"
                className="optionalButton"
                onClick={() =>
                  setShowExtraContact(
                    !showExtraContact
                  )
                }
              >
                <span>
                  {showExtraContact
                    ? "−"
                    : "+"}
                </span>

                {ka
                  ? "დამატებითი საკონტაქტო პირი"
                  : "Additional contact person"}
              </button>

              {showExtraContact && (
                <div className="optionalPanel">
                  <Field
                    label={
                      ka
                        ? "სახელი და გვარი"
                        : "Full name"
                    }
                    value={
                      form.additional_contact_name
                    }
                    onChange={(value) =>
                      updateField(
                        "additional_contact_name",
                        value
                      )
                    }
                  />

                  <Field
                    label={
                      ka
                        ? "ტელეფონი"
                        : "Phone"
                    }
                    type="tel"
                    value={
                      form.additional_contact_phone
                    }
                    onChange={(value) =>
                      updateField(
                        "additional_contact_phone",
                        value
                      )
                    }
                  />

                  <Field
                    label={
                      ka
                        ? "ელფოსტა"
                        : "Email"
                    }
                    type="email"
                    value={
                      form.additional_contact_email
                    }
                    onChange={(value) =>
                      updateField(
                        "additional_contact_email",
                        value
                      )
                    }
                  />
                </div>
              )}

              {error && (
                <ErrorMessage
                  text={error}
                />
              )}

              <div className="actions">
                <button
                  type="button"
                  className="backButton"
                  onClick={previousStep}
                >
                  ←{" "}
                  {ka
                    ? "უკან"
                    : "Back"}
                </button>

                <button
                  type="button"
                  className="nextButton"
                  onClick={nextStep}
                >
                  {ka
                    ? "შემდეგი"
                    : "Next"}{" "}
                  →
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <StepHeader
                number="03"
                title={
                  ka
                    ? "ინფორმაცია მპოვნელისთვის"
                    : "Information for the finder"
                }
                description={
                  ka
                    ? "დაასრულეთ პროფილის შექმნა და სურვილის შემთხვევაში ჩართეთ ლოკაციის გაზიარება."
                    : "Finish creating the profile and optionally enable location sharing."
                }
              />

              <TextArea
                label={
                  ka
                    ? "შეტყობინება მპოვნელისთვის"
                    : "Message for the finder"
                }
                value={
                  form.finder_message
                }
                onChange={(value) =>
                  updateField(
                    "finder_message",
                    value
                  )
                }
              />

              <div className="twoColumns">
                <Field
                  label={
                    ka
                      ? "მპოვნელის ჯილდო — ნებაყოფლობითი"
                      : "Finder reward — optional"
                  }
                  type="number"
                  value={form.reward}
                  onChange={(value) =>
                    updateField(
                      "reward",
                      value
                    )
                  }
                />

                <Field
                  label={
                    ka
                      ? "ბოლო ნანახი ადგილი — ნებაყოფლობითი"
                      : "Last seen location — optional"
                  }
                  value={
                    form.lost_seen_location
                  }
                  onChange={(value) =>
                    updateField(
                      "lost_seen_location",
                      value
                    )
                  }
                />
              </div>

              <div className="settingCard">
                <div>
                  <strong>
                    {ka
                      ? "ლოკაციის გაზიარება"
                      : "Location sharing"}
                  </strong>

                  <p>
                    {ka
                      ? "თუ ფუნქციას ჩართავთ, QR კოდის დამსკანერებელს სურვილის შემთხვევაში შეეძლება გამოგიგზავნოთ თავისი მიმდინარე მდებარეობა. ლოკაცია ავტომატურად არ იგზავნება."
                      : "When enabled, the person scanning the QR code may choose to send you their current location. Location is never shared automatically."}
                  </p>
                </div>

                <button
                  type="button"
                  className={
                    locationSharingEnabled
                      ? "switch active"
                      : "switch"
                  }
                  onClick={() =>
                    setLocationSharingEnabled(
                      !locationSharingEnabled
                    )
                  }
                >
                  <span />
                </button>
              </div>

              <div className="summary">
                <div className="summaryIcon">
                  {category.icon}
                </div>

                <div>
                  <span>
                    {ka
                      ? "იქმნება პროფილი:"
                      : "Creating profile:"}
                  </span>

                  <strong>
                    {form.item_name ||
                      (ka
                        ? category.ka
                        : category.en)}
                  </strong>

                  <small>
                    {ka
                      ? "კატეგორია პროფილის შექმნის შემდეგ აღარ შეიცვლება. სხვა მონაცემების რედაქტირება მომავალშიც შესაძლებელი იქნება."
                      : "The category cannot be changed after profile creation. Other profile information can be edited later."}
                  </small>
                </div>
              </div>

              {error && (
                <ErrorMessage
                  text={error}
                />
              )}

              <div className="actions">
                <button
                  type="button"
                  className="backButton"
                  onClick={previousStep}
                >
                  ←{" "}
                  {ka
                    ? "უკან"
                    : "Back"}
                </button>

                <button
                  type="submit"
                  className="saveButton"
                  disabled={saving}
                >
                  {saving
                    ? ka
                      ? "ინახება..."
                      : "Saving..."
                    : ka
                    ? "პროფილის შენახვა"
                    : "Save profile"}
                </button>
              </div>
            </>
          )}
        </form>
      </section>

      <Styles />
    </main>
  );
}

function Header({
  ka,
  language,
  setLanguage,
}: {
  ka: boolean;
  language: Language;
  setLanguage: (
    language: Language
  ) => void;
}) {
  return (
    <header className="header">
      <a href="/" className="brand">
        <div className="brandMark">
          QR
        </div>

        <div>
          <div className="brandName">
            QR RETURN
          </div>

          <div className="brandSub">
            SMART LOST & FOUND
          </div>
        </div>
      </a>

      <div className="headerRight">
        <a
          href="/register"
          className="headerBack"
        >
          ← {ka ? "უკან" : "Back"}
        </a>

        <div className="language">
          <button
            type="button"
            className={
              language === "ka"
                ? "selected"
                : ""
            }
            onClick={() =>
              setLanguage("ka")
            }
          >
            GEO
          </button>

          <button
            type="button"
            className={
              language === "en"
                ? "selected"
                : ""
            }
            onClick={() =>
              setLanguage("en")
            }
          >
            ENG
          </button>
        </div>
      </div>
    </header>
  );
}

function ProgressItem({
  number,
  label,
  active,
  current,
}: {
  number: string;
  label: string;
  active: boolean;
  current: boolean;
}) {
  return (
    <div className="progressItem">
      <div
        className={[
          "progressCircle",
          active ? "active" : "",
          current ? "current" : "",
        ].join(" ")}
      >
        {number}
      </div>

      <span>{label}</span>
    </div>
  );
}

function StepHeader({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="stepHeader">
      <span>{number}</span>

      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="field">
      <span>
        {label}
        {required ? " *" : ""}
      </span>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={(event) =>
          onChange(event.target.value)
        }
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: {
    value: string;
    label: string;
  }[];
}) {
  return (
    <label className="field">
      <span>{label}</span>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
      >
        {options.map((option) => (
          <option
            key={option.value || "empty"}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>

      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
      />
    </label>
  );
}

function PhotoField({
  label,
  file,
  setFile,
  ka,
}: {
  label: string;
  file: File | null;
  setFile: (
    file: File | null
  ) => void;
  ka: boolean;
}) {
  return (
    <label className="photoField">
      <input
        type="file"
        accept="image/*"
        onChange={(event) =>
          setFile(
            event.target.files?.[0] ||
              null
          )
        }
      />

      <div className="photoPlus">
        +
      </div>

      <div className="photoText">
        <strong>{label}</strong>

        <span>
          {file
            ? file.name
            : ka
            ? "დააჭირეთ ფოტოს ასარჩევად"
            : "Click to choose a photo"}
        </span>
      </div>
    </label>
  );
}

function ErrorMessage({
  text,
}: {
  text: string;
}) {
  return (
    <div className="errorMessage">
      {text}
    </div>
  );
}

function Styles() {
  return (
    <style jsx global>{`
      * {
        box-sizing: border-box;
      }

      html {
        scroll-behavior: smooth;
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
        background: #f8fafc;
        color: #101828;
        font-family:
          Inter,
          -apple-system,
          BlinkMacSystemFont,
          "Segoe UI",
          Arial,
          sans-serif;
      }

      .header {
        width: calc(100% - 40px);
        max-width: 1080px;
        min-height: 82px;
        margin: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        border-bottom: 1px solid #e9edf2;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 11px;
        text-decoration: none;
      }

      .brandMark {
        width: 44px;
        height: 44px;
        display: grid;
        place-items: center;
        border-radius: 13px;
        background: #1465e8;
        color: white;
        font-size: 13px;
        font-weight: 900;
      }

      .brandName {
        color: #1465e8;
        font-size: 21px;
        font-weight: 900;
      }

      .brandSub {
        margin-top: 3px;
        color: #98a2b3;
        font-size: 7px;
        font-weight: 800;
        letter-spacing: 2px;
      }

      .headerRight {
        display: flex;
        align-items: center;
        gap: 15px;
      }

      .headerBack {
        color: #475467;
        text-decoration: none;
        font-size: 13px;
        font-weight: 700;
      }

      .language {
        display: flex;
        padding: 4px;
        border-radius: 10px;
        background: #edf0f4;
      }

      .language button {
        border: 0;
        padding: 7px 9px;
        border-radius: 7px;
        background: transparent;
        color: #7d8795;
        font-size: 9px;
        font-weight: 900;
        cursor: pointer;
      }

      .language button.selected {
        background: white;
        color: #1465e8;
      }

      .registration {
        width: calc(100% - 32px);
        max-width: 760px;
        margin: auto;
        padding: 48px 0 80px;
      }

      .intro {
        display: flex;
        align-items: flex-start;
        gap: 17px;
      }

      .categoryBox {
        width: 58px;
        height: 58px;
        flex: 0 0 58px;
        display: grid;
        place-items: center;
        border-radius: 18px;
        background: #eaf2ff;
        font-size: 32px;
      }

      .smallLabel {
        color: #1465e8;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 2px;
      }

      .intro h1 {
        margin: 8px 0;
        font-size: clamp(
          30px,
          5vw,
          44px
        );
        line-height: 1.05;
        letter-spacing: -1.8px;
      }

      .intro p {
        max-width: 620px;
        margin: 0;
        color: #667085;
        font-size: 14px;
        line-height: 1.6;
      }

      .progress {
        margin: 38px 0 25px;
        display: flex;
        align-items: center;
      }

      .progressItem {
        min-width: 78px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 7px;
      }

      .progressItem span {
        color: #7b8492;
        font-size: 10px;
        font-weight: 800;
      }

      .progressCircle {
        width: 34px;
        height: 34px;
        display: grid;
        place-items: center;
        border: 1px solid #d4dae2;
        border-radius: 50%;
        background: white;
        color: #98a2b3;
        font-size: 10px;
        font-weight: 900;
      }

      .progressCircle.active {
        border-color: #1465e8;
        background: #eaf2ff;
        color: #1465e8;
      }

      .progressCircle.current {
        background: #1465e8;
        color: white;
      }

      .progressLine {
        height: 1px;
        flex: 1;
        margin-bottom: 23px;
        background: #dce1e8;
      }

      .progressLine.active {
        background: #1465e8;
      }

      .formCard {
        padding: 30px;
        border: 1px solid #e2e7ed;
        border-radius: 24px;
        background: white;
      }

      .stepHeader {
        margin-bottom: 28px;
        display: flex;
        gap: 14px;
        align-items: flex-start;
      }

      .stepHeader > span {
        margin-top: 5px;
        color: #1465e8;
        font-size: 10px;
        font-weight: 900;
      }

      .stepHeader h2 {
        margin: 0;
        font-size: 23px;
      }

      .stepHeader p {
        margin: 7px 0 0;
        color: #7b8492;
        font-size: 12px;
        line-height: 1.55;
      }

      .twoColumns {
        display: grid;
        grid-template-columns:
          repeat(2, minmax(0, 1fr));
        gap: 14px;
      }

      .field {
        display: block;
        margin-bottom: 17px;
      }

      .field > span {
        display: block;
        margin-bottom: 7px;
        color: #344054;
        font-size: 12px;
        font-weight: 800;
      }

      .field input,
      .field select,
      .field textarea {
        width: 100%;
        border: 1px solid #d5dae1;
        border-radius: 12px;
        background: white;
        color: #101828;
        outline: none;
      }

      .field input,
      .field select {
        height: 54px;
        padding: 0 15px;
        font-size: 15px;
      }

      .field textarea {
        min-height: 105px;
        padding: 14px 15px;
        resize: vertical;
        line-height: 1.5;
        font-size: 14px;
      }

      .field input:focus,
      .field select:focus,
      .field textarea:focus {
        border-color: #1465e8;
        box-shadow:
          0 0 0 3px
          rgba(20, 101, 232, 0.08);
      }

      .photoField {
        min-height: 76px;
        margin-bottom: 17px;
        padding: 14px;
        display: flex;
        align-items: center;
        gap: 13px;
        border: 1px dashed #c7ced8;
        border-radius: 13px;
        background: #fafbfc;
        cursor: pointer;
      }

      .photoField input {
        display: none;
      }

      .photoPlus {
        width: 42px;
        height: 42px;
        flex: 0 0 42px;
        display: grid;
        place-items: center;
        border-radius: 11px;
        background: #eaf2ff;
        color: #1465e8;
        font-size: 22px;
      }

      .photoText {
        min-width: 0;
      }

      .photoField strong,
      .photoField span {
        display: block;
      }

      .photoField strong {
        color: #344054;
        font-size: 12px;
      }

      .photoField span {
        margin-top: 4px;
        color: #8a94a3;
        font-size: 11px;
      }

      .optionalButton {
        width: 100%;
        min-height: 52px;
        padding: 0 15px;
        display: flex;
        align-items: center;
        gap: 9px;
        border: 1px solid #e0e5eb;
        border-radius: 12px;
        background: #f8fafc;
        color: #344054;
        font-size: 12px;
        font-weight: 800;
        cursor: pointer;
      }

      .optionalButton span {
        color: #1465e8;
        font-size: 19px;
      }

      .optionalPanel {
        margin-top: 14px;
        padding: 19px;
        border-radius: 14px;
        background: #f8fafc;
      }

      .settingCard {
        margin-top: 4px;
        padding: 18px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 25px;
        border: 1px solid #e0e5eb;
        border-radius: 14px;
        background: #f9fafb;
      }

      .settingCard strong {
        color: #344054;
        font-size: 13px;
      }

      .settingCard p {
        max-width: 520px;
        margin: 6px 0 0;
        color: #7b8492;
        font-size: 11px;
        line-height: 1.55;
      }

      .switch {
        width: 50px;
        height: 29px;
        flex: 0 0 50px;
        padding: 3px;
        border: 0;
        border-radius: 30px;
        background: #cdd3db;
        cursor: pointer;
      }

      .switch span {
        display: block;
        width: 23px;
        height: 23px;
        border-radius: 50%;
        background: white;
        transition: 0.2s;
      }

      .switch.active {
        background: #1465e8;
      }

      .switch.active span {
        transform:
          translateX(21px);
      }

      .summary {
        margin-top: 18px;
        padding: 17px;
        display: flex;
        align-items: center;
        gap: 13px;
        border: 1px solid #dbe7f8;
        border-radius: 14px;
        background: #f3f7fd;
      }

      .summaryIcon {
        width: 46px;
        height: 46px;
        flex: 0 0 46px;
        display: grid;
        place-items: center;
        border-radius: 13px;
        background: white;
        font-size: 26px;
      }

      .summary span,
      .summary strong,
      .summary small {
        display: block;
      }

      .summary span {
        color: #7b8492;
        font-size: 10px;
      }

      .summary strong {
        margin-top: 2px;
        color: #1d2939;
        font-size: 14px;
      }

      .summary small {
        margin-top: 4px;
        color: #667085;
        font-size: 10px;
        line-height: 1.4;
      }

      .actions,
      .singleAction {
        margin-top: 28px;
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .singleAction {
        justify-content: flex-end;
      }

      .backButton,
      .nextButton,
      .saveButton {
        min-height: 54px;
        padding: 0 22px;
        border-radius: 12px;
        font-size: 13px;
        font-weight: 900;
        cursor: pointer;
      }

      .backButton {
        border: 1px solid #d5dae1;
        background: white;
        color: #475467;
      }

      .nextButton,
      .saveButton {
        margin-left: auto;
        border: 0;
        background: #1465e8;
        color: white;
      }

      .saveButton {
        min-width: 190px;
      }

      .saveButton:disabled {
        opacity: 0.6;
        cursor: wait;
      }

      .errorMessage {
        margin-top: 18px;
        padding: 13px 15px;
        border-radius: 11px;
        background: #fff1f1;
        color: #b42318;
        font-size: 12px;
        font-weight: 700;
      }

      .successPage {
        width: calc(100% - 32px);
        max-width: 620px;
        margin: auto;
        padding: 120px 0;
        text-align: center;
      }

      .successIcon {
        width: 70px;
        height: 70px;
        margin: 0 auto 24px;
        display: grid;
        place-items: center;
        border-radius: 50%;
        background: #e9f8ef;
        color: #16803b;
        font-size: 30px;
        font-weight: 900;
      }

      .successPage h1 {
        margin: 12px 0;
        font-size: 38px;
      }

      .successPage > p {
        color: #667085;
        line-height: 1.65;
      }

      .successNotice {
        margin-top: 24px;
        padding: 17px;
        border: 1px solid #dbe7f8;
        border-radius: 14px;
        background: #f3f7fd;
        text-align: left;
      }

      .successNotice strong,
      .successNotice span {
        display: block;
      }

      .successNotice strong {
        color: #1465e8;
        font-size: 12px;
      }

      .successNotice span {
        margin-top: 5px;
        color: #667085;
        font-size: 11px;
        line-height: 1.55;
      }

      .primaryLink {
        min-height: 54px;
        margin-top: 28px;
        padding: 0 22px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 12px;
        background: #1465e8;
        color: white;
        text-decoration: none;
        font-size: 13px;
        font-weight: 900;
      }

      @media (max-width: 600px) {
        .header {
          width: calc(100% - 24px);
          min-height: 72px;
        }

        .brandName {
          font-size: 18px;
        }

        .brandSub {
          display: none;
        }

        .brandMark {
          width: 40px;
          height: 40px;
        }

        .headerBack {
          display: none;
        }

        .registration {
          width: calc(100% - 20px);
          padding-top: 30px;
        }

        .intro {
          gap: 12px;
        }

        .categoryBox {
          width: 52px;
          height: 52px;
          flex-basis: 52px;
          font-size: 29px;
        }

        .intro h1 {
          font-size: 30px;
        }

        .intro p {
          font-size: 12px;
        }

        .progressItem {
          min-width: 64px;
        }

        .formCard {
          padding: 21px 15px;
          border-radius: 19px;
        }

        .twoColumns {
          grid-template-columns: 1fr;
          gap: 0;
        }

        .field input,
        .field select {
          height: 56px;
          font-size: 16px;
        }

        .field textarea {
          font-size: 16px;
        }

        .actions {
          display: grid;
          grid-template-columns:
            1fr 1.35fr;
        }

        .backButton,
        .nextButton,
        .saveButton {
          width: 100%;
          min-width: 0;
          margin: 0;
        }

        .singleAction {
          display: block;
        }

        .singleAction
          .nextButton {
          width: 100%;
        }

        .successPage {
          padding-top: 80px;
        }

        .successPage h1 {
          font-size: 31px;
        }
      }
    `}</style>
  );
}
