"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useParams } from "next/navigation";

import {
  createClient,
  type SupabaseClient,
} from "@supabase/supabase-js";

type ProductType =
  | "dog"
  | "cat"
  | "keys"
  | "wallet"
  | "bag"
  | "suitcase";

type Step = 1 | 2 | 3;

type Draft = {
  ownerFirstName: string;
  ownerLastName: string;
  ownerPhone: string;
  ownerEmail: string;

  tagCode: string;
  itemName: string;
  colour: string;

  sex: string;
  dateOfBirth: string;
  weight: string;

  brand: string;
  model: string;
  size: string;
  material: string;

  description: string;
  medicalInfo: string;
  behaviourNote: string;
  distinctiveFeatures: string;

  lostLocation: string;
  finderMessage: string;

  showEmail: boolean;
  showDescription: boolean;
  showMedicalInfo: boolean;
  showBehaviourNote: boolean;
  showLostLocation: boolean;
  showFinderMessage: boolean;

  liveChatEnabled: boolean;
};

const INITIAL_DRAFT: Draft = {
  ownerFirstName: "",
  ownerLastName: "",
  ownerPhone: "",
  ownerEmail: "",

  tagCode: "",
  itemName: "",
  colour: "",

  sex: "",
  dateOfBirth: "",
  weight: "",

  brand: "",
  model: "",
  size: "",
  material: "",

  description: "",
  medicalInfo: "",
  behaviourNote: "",
  distinctiveFeatures: "",

  lostLocation: "",
  finderMessage: "",

  showEmail: false,
  showDescription: true,
  showMedicalInfo: false,
  showBehaviourNote: false,
  showLostLocation: true,
  showFinderMessage: true,

  liveChatEnabled: true,
};

const PRODUCT_META: Record<
  ProductType,
  {
    label: string;
    emoji: string;
    slogan: string;
    subline: string;
  }
> = {
  dog: {
    label: "ძაღლი",
    emoji: "🐶",
    slogan:
      "ერთი სკანირება შეიძლება იყოს გზა სახლში დაბრუნებამდე.",
    subline:
      "ნუ ინერვიულებთ წინასწარ — მპოვნელს თქვენთან დაკავშირება მაქსიმალურად გავუმარტივოთ.",
  },

  cat: {
    label: "კატა",
    emoji: "🐱",
    slogan:
      "ერთი პატარა QR შეიძლება გახდეს ყველაზე მოკლე გზა პატრონამდე.",
    subline:
      "რაც უფრო მარტივია დაკავშირება, მით მეტია სწრაფად დაბრუნების შესაძლებლობა.",
  },

  keys: {
    label: "გასაღები",
    emoji: "🔑",
    slogan:
      "დაკარგული გასაღები ყოველთვის არ ნიშნავს დაკარგულ დღეს.",
    subline:
      "მპოვნელს მხოლოდ ერთი სკანირება სჭირდება თქვენთან დასაკავშირებლად.",
  },

  wallet: {
    label: "საფულე",
    emoji: "👛",
    slogan:
      "დაბრუნება იწყება ერთი სწორი კონტაქტით.",
    subline:
      "QR RETURN ამარტივებს მპოვნელსა და მფლობელს შორის პირველ ნაბიჯს.",
  },

  bag: {
    label: "ჩანთა",
    emoji: "👜",
    slogan:
      "რაც თქვენთვის მნიშვნელოვანია, ადვილად დასაბრუნებელი გახადეთ.",
    subline:
      "ნაკლები გაურკვევლობა, უფრო სწრაფი დაკავშირება.",
  },

  suitcase: {
    label: "ჩემოდანი",
    emoji: "🧳",
    slogan:
      "მოგზაურობა შეიძლება გაგრძელდეს — დაკარგული ჩემოდანი კი დაბრუნდეს.",
    subline:
      "ერთი QR მპოვნელიდან მფლობელამდე.",
  },
};

function createSupabaseClient() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_KEY;

  if (!url || !key) {
    return null;
  }

  return createClient(url, key);
}

function isProductType(
  value: string
): value is ProductType {
  return (
    value === "dog" ||
    value === "cat" ||
    value === "keys" ||
    value === "wallet" ||
    value === "bag" ||
    value === "suitcase"
  );
}

export default function RegisterItemPage() {
  const params = useParams();

  const rawType =
    typeof params?.type === "string"
      ? params.type.toLowerCase()
      : "";

  const type: ProductType =
    isProductType(rawType)
      ? rawType
      : "dog";

  const meta = PRODUCT_META[type];

  const isPet =
    type === "dog" ||
    type === "cat";

  const isKeys =
    type === "keys";

  const isWallet =
    type === "wallet";

  const isBag =
    type === "bag";

  const isSuitcase =
    type === "suitcase";

  const [step, setStep] =
    useState<Step>(1);

  const [draft, setDraft] =
    useState<Draft>(
      INITIAL_DRAFT
    );

  const [
    supabase,
    setSupabase,
  ] =
    useState<SupabaseClient | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] =
    useState("");

  const backgroundItems =
    useMemo(
      () =>
        Array.from({
          length: 20,
        }),
      []
    );

  useEffect(() => {
    async function loadAccount() {
      try {
        const client =
          createSupabaseClient();

        if (!client) {
          setErrorMessage(
            "Supabase კავშირი არ არის კონფიგურირებული."
          );

          return;
        }

        setSupabase(client);

        const {
          data: { user },
          error,
        } =
          await client.auth.getUser();

        if (
          error ||
          !user
        ) {
          window.location.assign(
            "/login"
          );

          return;
        }

        /*
          პირველ რიგში auth metadata-ს ვიყენებთ.
          თუ owner_accounts-შიც გაქვთ მონაცემები,
          ქვემოთ ასევე ვცდილობთ იქიდან წამოღებას.
        */

        let firstName =
          String(
            user.user_metadata
              ?.first_name ||
              ""
          );

        let lastName =
          String(
            user.user_metadata
              ?.last_name ||
              ""
          );

        let phone =
          String(
            user.user_metadata
              ?.phone ||
              user.phone ||
              ""
          );

        const email =
          String(
            user.email || ""
          );

        const {
          data: ownerAccount,
        } =
          await client
            .from(
              "owner_accounts"
            )
            .select(
              "first_name,last_name,phone,email"
            )
            .eq(
              "id",
              user.id
            )
            .maybeSingle();

        if (ownerAccount) {
          firstName =
            ownerAccount
              .first_name ||
            firstName;

          lastName =
            ownerAccount
              .last_name ||
            lastName;

          phone =
            ownerAccount
              .phone ||
            phone;
        }

        setDraft(
          (current) => ({
            ...current,

            ownerFirstName:
              firstName,

            ownerLastName:
              lastName,

            ownerPhone:
              phone,

            ownerEmail:
              ownerAccount
                ?.email ||
              email,
          })
        );
      } catch (error) {
        console.error(
          "Account load error:",
          error
        );

        setErrorMessage(
          "ანგარიშის ინფორმაციის ჩატვირთვა ვერ მოხერხდა."
        );
      } finally {
        setLoading(false);
      }
    }

    loadAccount();
  }, []);

  function updateDraft<
    K extends keyof Draft
  >(
    key: K,
    value: Draft[K]
  ) {
    setDraft(
      (current) => ({
        ...current,
        [key]: value,
      })
    );
  }

  async function goToStepTwo() {
    setErrorMessage("");

    if (
      !draft.ownerFirstName.trim()
    ) {
      setErrorMessage(
        "გთხოვთ მიუთითოთ სახელი."
      );

      return;
    }

    if (
      !draft.ownerLastName.trim()
    ) {
      setErrorMessage(
        "გთხოვთ მიუთითოთ გვარი."
      );

      return;
    }

    if (
      !draft.ownerPhone.trim()
    ) {
      setErrorMessage(
        "გთხოვთ მიუთითოთ ტელეფონის ნომერი."
      );

      return;
    }

    if (
      !draft.ownerEmail.trim()
    ) {
      setErrorMessage(
        "გთხოვთ მიუთითოთ ელფოსტა."
      );

      return;
    }

    /*
      Owner ინფორმაცია ინახება auth metadata-ში,
      რათა მომავალ რეგისტრაციაზეც მზად დახვდეს.
    */

    if (supabase) {
      const {
        error,
      } =
        await supabase.auth.updateUser({
          data: {
            first_name:
              draft.ownerFirstName.trim(),

            last_name:
              draft.ownerLastName.trim(),

            phone:
              draft.ownerPhone.trim(),

            contact_email:
              draft.ownerEmail.trim(),
          },
        });

      if (error) {
        console.error(
          "Owner metadata update:",
          error
        );
      }
    }

    setStep(2);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function goToPreview() {
    setErrorMessage("");

    if (
      !draft.tagCode.trim()
    ) {
      setErrorMessage(
        "QR / Tag Code სავალდებულოა."
      );

      return;
    }

    if (
      !draft.itemName.trim()
    ) {
      if (type === "cat") {
        setErrorMessage(
          "გთხოვთ შეავსოთ კატის შესახებ ინფორმაცია."
        );
      } else if (
        type === "dog"
      ) {
        setErrorMessage(
          "გთხოვთ შეავსოთ ძაღლის შესახებ ინფორმაცია."
        );
      } else {
        setErrorMessage(
          `გთხოვთ შეავსოთ ${meta.label}ს შესახებ ინფორმაცია.`
        );
      }

      return;
    }

    setStep(3);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function createProfile() {
    setErrorMessage("");
    setSaving(true);

    try {
      const client =
        supabase ||
        createSupabaseClient();

      if (!client) {
        throw new Error(
          "Supabase კავშირი ვერ მოიძებნა."
        );
      }

      /*
        მნიშვნელოვანია:
        საბოლოო ღილაკზე ხელახლა ვამოწმებთ session-ს.
      */

      const {
        data: {
          user,
        },
        error: userError,
      } =
        await client.auth.getUser();

      if (
        userError ||
        !user
      ) {
        throw new Error(
          "სესია დასრულებულია. გთხოვთ ხელახლა შეხვიდეთ ანგარიშში."
        );
      }

      const cleanTag =
        draft.tagCode
          .trim()
          .toUpperCase();

      const {
        data: existing,
        error: checkError,
      } =
        await client
          .from("item")
          .select("id")
          .ilike(
            "tag_code",
            cleanTag
          )
          .maybeSingle();

      if (checkError) {
        throw checkError;
      }

      if (existing) {
        throw new Error(
          "ეს QR კოდი უკვე დარეგისტრირებულია."
        );
      }

      /*
        აქ ვიყენებთ უკვე არსებულ item ველებს.
      */

      const payload = {
        owner_id:
          user.id,

        owner_phone:
          draft.ownerPhone.trim(),

        owner_email:
          draft.ownerEmail.trim(),

        tag_code:
          cleanTag,

        item_type:
          type,

        pet_type:
          isPet
            ? type
            : null,

        item_name:
          draft.itemName.trim(),

        colour:
          draft.colour.trim() ||
          null,

        sex:
          isPet
            ? draft.sex ||
              null
            : null,

        date_of_birth:
          isPet
            ? draft.dateOfBirth ||
              null
            : null,

        weight:
          isPet &&
          draft.weight
            ? Number(
                draft.weight
              )
            : null,

        brand:
          !isPet &&
          !isKeys &&
          draft.brand.trim()
            ? draft.brand.trim()
            : null,

        model:
          (isBag ||
            isSuitcase) &&
          draft.model.trim()
            ? draft.model.trim()
            : null,

        size:
          (isBag ||
            isSuitcase) &&
          draft.size.trim()
            ? draft.size.trim()
            : null,

        material:
          !isPet &&
          !isKeys &&
          draft.material.trim()
            ? draft.material.trim()
            : null,

        description:
          draft.description.trim() ||
          null,

        medical_info:
          isPet
            ? draft.medicalInfo.trim() ||
              null
            : null,

        behaviour_note:
          isPet
            ? draft.behaviourNote.trim() ||
              null
            : null,

        distinctive_features:
          !isPet
            ? draft.distinctiveFeatures.trim() ||
              null
            : null,

        lost_seen_location:
          draft.lostLocation.trim() ||
          null,

        finder_message:
          draft.finderMessage.trim() ||
          null,

        /*
          არსებული ON/OFF ლოგიკა
        */

        show_email:
          draft.showEmail,

        show_description:
          draft.showDescription,

        show_medical_info:
          isPet
            ? draft.showMedicalInfo
            : false,

        show_behaviour_note:
          isPet
            ? draft.showBehaviourNote
            : false,

        show_finder_message:
          draft.showFinderMessage,

        phone_enabled:
          true,

        live_chat_enabled:
          draft.liveChatEnabled,

        active:
          true,
      };

      const {
        data: created,
        error: insertError,
      } =
        await client
          .from("item")
          .insert(payload)
          .select(
            "id,tag_code"
          )
          .single();

      if (insertError) {
        throw insertError;
      }

      window.location.assign(
        `/registration-success?type=${type}&tag=${encodeURIComponent(
          created.tag_code
        )}`
      );
    } catch (error) {
      console.error(
        "Create profile error:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "პროფილის შექმნა ვერ მოხერხდა."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="loadingPage">
        <div className="loader">
          <div>
            {meta.emoji}
          </div>

          <span>
            იტვირთება...
          </span>
        </div>

        <style jsx>{`
          .loadingPage {
            min-height: 100vh;

            display: grid;
            place-items: center;

            background:
              #0647c8;
          }

          .loader {
            text-align: center;

            color: white;

            font-size: 15px;
          }

          .loader div {
            font-size: 42px;

            margin-bottom: 10px;
          }
        `}</style>
      </main>
    );
  }

  return (
    <>
      <main className="page">
        <div className="emojiLayer">
          {backgroundItems.map(
            (_, index) => (
              <span
                key={index}
                style={{
                  left: `${
                    (index * 31) %
                    100
                  }%`,

                  top: `${
                    (index * 43) %
                    100
                  }%`,

                  transform: `rotate(${
                    index * 18
                  }deg)`,
                }}
              >
                {meta.emoji}
              </span>
            )
          )}
        </div>

        <header className="header">
          <a
            href="/"
            className="brand"
          >
            <div className="brandMark">
              QR
            </div>

            <div>
              <strong>
                QR RETURN
              </strong>

              <small>
                SMART LOST &amp; FOUND
              </small>
            </div>
          </a>

          <a
            href="/register"
            className="changeProduct"
          >
            სხვა პროდუქტი
          </a>
        </header>

        <Progress
          step={step}
          productLabel={
            meta.label
          }
        />

        <section className="marketingLine">
          <span>
            {meta.emoji}
          </span>

          <div>
            <strong>
              {meta.slogan}
            </strong>

            <p>
              {meta.subline}
            </p>
          </div>
        </section>

        <section className="card">
          {errorMessage && (
            <div
              className="errorBox"
              role="alert"
            >
              {errorMessage}
            </div>
          )}

          {step === 1 && (
            <OwnerStep
              draft={draft}
              update={
                updateDraft
              }
              next={
                goToStepTwo
              }
            />
          )}

          {step === 2 && (
            <ProductStep
              type={type}
              meta={meta}
              draft={draft}
              update={
                updateDraft
              }
              back={() =>
                setStep(1)
              }
              next={
                goToPreview
              }
            />
          )}

          {step === 3 && (
            <PreviewStep
              type={type}
              meta={meta}
              draft={draft}
              back={() =>
                setStep(2)
              }
              confirm={
                createProfile
              }
              saving={saving}
            />
          )}
        </section>
      </main>

      <PageStyles />
    </>
  );
}

function Progress({
  step,
  productLabel,
}: {
  step: Step;
  productLabel: string;
}) {
  const steps = [
    {
      number: 1,
      label: "მფლობელი",
    },
    {
      number: 2,
      label: productLabel,
    },
    {
      number: 3,
      label: "შემოწმება",
    },
  ];

  return (
    <section className="progress">
      {steps.map(
        (
          item,
          index
        ) => {
          const completed =
            step >
            item.number;

          const active =
            step ===
            item.number;

          return (
            <div
              className="progressPart"
              key={
                item.number
              }
            >
              <div
                className={`progressStep ${
                  completed
                    ? "completed"
                    : ""
                } ${
                  active
                    ? "active"
                    : ""
                }`}
              >
                <div className="stepCircle">
                  {completed
                    ? "✓"
                    : item.number}
                </div>

                <span>
                  {item.label}
                </span>
              </div>

              {index < 2 && (
                <div
                  className={`line ${
                    step >
                    item.number
                      ? "filled"
                      : ""
                  }`}
                />
              )}
            </div>
          );
        }
      )}
    </section>
  );
}

function OwnerStep({
  draft,
  update,
  next,
}: {
  draft: Draft;

  update: <
    K extends keyof Draft
  >(
    key: K,
    value: Draft[K]
  ) => void;

  next: () => void;
}) {
  return (
    <>
      <StepTitle
        eyebrow="STEP 1 OF 3"
        title="მფლობელის ინფორმაცია"
        description="გადაამოწმეთ ან განაახლეთ თქვენი საკონტაქტო ინფორმაცია."
      />

      <div className="formGrid">
        <Field label="სახელი *">
          <input
            value={
              draft.ownerFirstName
            }
            onChange={(e) =>
              update(
                "ownerFirstName",
                e.target.value
              )
            }
          />
        </Field>

        <Field label="გვარი *">
          <input
            value={
              draft.ownerLastName
            }
            onChange={(e) =>
              update(
                "ownerLastName",
                e.target.value
              )
            }
          />
        </Field>

        <Field label="ტელეფონი *">
          <input
            value={
              draft.ownerPhone
            }
            onChange={(e) =>
              update(
                "ownerPhone",
                e.target.value
              )
            }
          />
        </Field>

        <Field label="ელფოსტა *">
          <input
            type="email"
            value={
              draft.ownerEmail
            }
            onChange={(e) =>
              update(
                "ownerEmail",
                e.target.value
              )
            }
          />
        </Field>
      </div>

      <div className="smallNotice">
        სახელი, გვარი და ტელეფონი
        მპოვნელისთვის ყოველთვის
        ხილული იქნება.
      </div>

      <div className="actions right">
        <button
          type="button"
          className="primaryButton"
          onClick={next}
        >
          გაგრძელება →
        </button>
      </div>
    </>
  );
}

function ProductStep({
  type,
  meta,
  draft,
  update,
  back,
  next,
}: {
  type: ProductType;

  meta: {
    label: string;
    emoji: string;
  };

  draft: Draft;

  update: <
    K extends keyof Draft
  >(
    key: K,
    value: Draft[K]
  ) => void;

  back: () => void;
  next: () => void;
}) {
  const isPet =
    type === "dog" ||
    type === "cat";

  const showBrand =
    type === "wallet" ||
    type === "bag" ||
    type === "suitcase";

  const showModel =
    type === "bag" ||
    type === "suitcase";

  const showSize =
    type === "bag" ||
    type === "suitcase";

  const showMaterial =
    type === "wallet" ||
    type === "bag" ||
    type === "suitcase";

  const descriptionText =
    type === "cat"
      ? "გთხოვთ შეავსოთ კატის შესახებ ინფორმაცია."
      : type === "dog"
      ? "გთხოვთ შეავსოთ ძაღლის შესახებ ინფორმაცია."
      : `გთხოვთ შეავსოთ ${meta.label}ს შესახებ ინფორმაცია.`;

  return (
    <>
      <StepTitle
        eyebrow="STEP 2 OF 3"
        title={`${meta.emoji} ${meta.label}`}
        description={
          descriptionText
        }
      />

      <div className="compactSection">
        <h2>
          ძირითადი ინფორმაცია
        </h2>

        <div className="formGrid three">
          <Field
            label="QR / Tag Code *"
            full
          >
            <input
              value={
                draft.tagCode
              }
              onChange={(e) =>
                update(
                  "tagCode",
                  e.target.value
                    .toUpperCase()
                    .replace(
                      /\s/g,
                      ""
                    )
                )
              }
              placeholder="QR-000123"
            />
          </Field>

          <Field
            label={
              isPet
                ? "სახელი *"
                : "პროფილის სახელი *"
            }
          >
            <input
              value={
                draft.itemName
              }
              onChange={(e) =>
                update(
                  "itemName",
                  e.target.value
                )
              }
            />
          </Field>

          <Field label="ფერი">
            <input
              value={
                draft.colour
              }
              onChange={(e) =>
                update(
                  "colour",
                  e.target.value
                )
              }
            />
          </Field>

          {isPet && (
            <>
              <Field label="სქესი">
                <select
                  value={
                    draft.sex
                  }
                  onChange={(e) =>
                    update(
                      "sex",
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    აირჩიეთ
                  </option>

                  <option value="male">
                    მამრი
                  </option>

                  <option value="female">
                    მდედრი
                  </option>
                </select>
              </Field>

              <Field label="დაბადების თარიღი">
                <input
                  type="date"
                  value={
                    draft.dateOfBirth
                  }
                  onChange={(e) =>
                    update(
                      "dateOfBirth",
                      e.target.value
                    )
                  }
                />
              </Field>

              <Field label="წონა">
                <input
                  type="number"
                  step="0.1"
                  value={
                    draft.weight
                  }
                  onChange={(e) =>
                    update(
                      "weight",
                      e.target.value
                    )
                  }
                  placeholder="kg"
                />
              </Field>
            </>
          )}

          {showBrand && (
            <Field label="ბრენდი">
              <input
                value={
                  draft.brand
                }
                onChange={(e) =>
                  update(
                    "brand",
                    e.target.value
                  )
                }
              />
            </Field>
          )}

          {showModel && (
            <Field label="მოდელი">
              <input
                value={
                  draft.model
                }
                onChange={(e) =>
                  update(
                    "model",
                    e.target.value
                  )
                }
              />
            </Field>
          )}

          {showSize && (
            <Field label="ზომა">
              <input
                value={
                  draft.size
                }
                onChange={(e) =>
                  update(
                    "size",
                    e.target.value
                  )
                }
              />
            </Field>
          )}

          {showMaterial && (
            <Field label="მასალა">
              <input
                value={
                  draft.material
                }
                onChange={(e) =>
                  update(
                    "material",
                    e.target.value
                  )
                }
              />
            </Field>
          )}
        </div>
      </div>

      <div className="compactSection">
        <h2>
          დამატებითი ინფორმაცია
        </h2>

        <div className="formGrid">
          <Field label="აღწერა">
            <textarea
              rows={2}
              value={
                draft.description
              }
              onChange={(e) =>
                update(
                  "description",
                  e.target.value
                )
              }
            />
          </Field>

          {isPet ? (
            <Field label="ქცევის შესახებ ინფორმაცია">
              <textarea
                rows={2}
                value={
                  draft.behaviourNote
                }
                onChange={(e) =>
                  update(
                    "behaviourNote",
                    e.target.value
                  )
                }
              />
            </Field>
          ) : (
            <Field label="განმასხვავებელი ნიშნები">
              <textarea
                rows={2}
                value={
                  draft.distinctiveFeatures
                }
                onChange={(e) =>
                  update(
                    "distinctiveFeatures",
                    e.target.value
                  )
                }
              />
            </Field>
          )}

          {isPet && (
            <Field label="სამედიცინო ინფორმაცია">
              <textarea
                rows={2}
                value={
                  draft.medicalInfo
                }
                onChange={(e) =>
                  update(
                    "medicalInfo",
                    e.target.value
                  )
                }
              />
            </Field>
          )}

          <Field label="დაკარგვის ადგილი">
            <input
              value={
                draft.lostLocation
              }
              onChange={(e) =>
                update(
                  "lostLocation",
                  e.target.value
                )
              }
              placeholder="მაგ. Central Park, New York"
            />
          </Field>

          <Field
            label="შეტყობინება მპოვნელისთვის"
            full
          >
            <textarea
              rows={2}
              value={
                draft.finderMessage
              }
              onChange={(e) =>
                update(
                  "finderMessage",
                  e.target.value
                )
              }
              placeholder="გთხოვთ დამიკავშირდეთ..."
            />
          </Field>
        </div>
      </div>

      <div className="compactSection">
        <h2>
          რას დაინახავს მპოვნელი
        </h2>

        <p className="sectionDescription">
          სახელი, გვარი და ტელეფონი
          ყოველთვის ხილულია. დანარჩენი
          თქვენ აკონტროლებთ.
        </p>

        <div className="toggleGrid">
          <Toggle
            label="ელფოსტა"
            checked={
              draft.showEmail
            }
            onChange={(value) =>
              update(
                "showEmail",
                value
              )
            }
          />

          <Toggle
            label="აღწერა"
            checked={
              draft.showDescription
            }
            onChange={(value) =>
              update(
                "showDescription",
                value
              )
            }
          />

          {isPet && (
            <>
              <Toggle
                label="სამედიცინო ინფორმაცია"
                checked={
                  draft.showMedicalInfo
                }
                onChange={(value) =>
                  update(
                    "showMedicalInfo",
                    value
                  )
                }
              />

              <Toggle
                label="ქცევის შესახებ ინფორმაცია"
                checked={
                  draft.showBehaviourNote
                }
                onChange={(value) =>
                  update(
                    "showBehaviourNote",
                    value
                  )
                }
              />
            </>
          )}

          <Toggle
            label="დაკარგვის ადგილი"
            checked={
              draft.showLostLocation
            }
            onChange={(value) =>
              update(
                "showLostLocation",
                value
              )
            }
          />

          <Toggle
            label="Finder Message"
            checked={
              draft.showFinderMessage
            }
            onChange={(value) =>
              update(
                "showFinderMessage",
                value
              )
            }
          />

          <Toggle
            label="Live Chat"
            checked={
              draft.liveChatEnabled
            }
            onChange={(value) =>
              update(
                "liveChatEnabled",
                value
              )
            }
          />
        </div>
      </div>

      <div className="actions">
        <button
          type="button"
          className="secondaryButton"
          onClick={back}
        >
          ← უკან
        </button>

        <button
          type="button"
          className="primaryButton"
          onClick={next}
        >
          შემოწმება →
        </button>
      </div>
    </>
  );
}

function PreviewStep({
  type,
  meta,
  draft,
  back,
  confirm,
  saving,
}: {
  type: ProductType;

  meta: {
    label: string;
    emoji: string;
  };

  draft: Draft;

  back: () => void;

  confirm: () => void;

  saving: boolean;
}) {
  const isPet =
    type === "dog" ||
    type === "cat";

  return (
    <>
      <StepTitle
        eyebrow="STEP 3 OF 3"
        title="რას ნახავს მპოვნელი"
        description="ეს არის საბოლოო Preview. თუ ყველაფერი სწორია, დაადასტურეთ პროფილის შექმნა."
        center
      />

      <section className="finderPreview">
        <div className="previewHeader">
          <div className="previewEmoji">
            {meta.emoji}
          </div>

          <div>
            <span>
              QR RETURN
            </span>

            <h2>
              {draft.itemName ||
                meta.label}
            </h2>

            <p>
              იპოვეთ? დაუკავშირდით
              მფლობელს.
            </p>
          </div>
        </div>

        <div className="ownerPreview">
          <PreviewItem
            label="მფლობელი"
            value={`${draft.ownerFirstName} ${draft.ownerLastName}`}
          />

          <PreviewItem
            label="ტელეფონი"
            value={
              draft.ownerPhone
            }
          />

          {draft.showEmail &&
            draft.ownerEmail && (
              <PreviewItem
                label="ელფოსტა"
                value={
                  draft.ownerEmail
                }
              />
            )}
        </div>

        {draft.showDescription &&
          draft.description && (
            <PreviewBlock
              title="აღწერა"
              text={
                draft.description
              }
            />
          )}

        {isPet &&
          draft.showMedicalInfo &&
          draft.medicalInfo && (
            <PreviewBlock
              title="სამედიცინო ინფორმაცია"
              text={
                draft.medicalInfo
              }
            />
          )}

        {isPet &&
          draft.showBehaviourNote &&
          draft.behaviourNote && (
            <PreviewBlock
              title="ქცევის შესახებ ინფორმაცია"
              text={
                draft.behaviourNote
              }
            />
          )}

        {draft.showLostLocation &&
          draft.lostLocation && (
            <PreviewBlock
              title="📍 დაკარგვის ადგილი"
              text={
                draft.lostLocation
              }
            />
          )}

        {draft.showFinderMessage &&
          draft.finderMessage && (
            <PreviewBlock
              title="მფლობელის შეტყობინება"
              text={
                draft.finderMessage
              }
            />
          )}

        <div className="previewContacts">
          <button type="button">
            ☎ დარეკვა
          </button>

          {draft.liveChatEnabled && (
            <button type="button">
              Live Chat
            </button>
          )}
        </div>
      </section>

      <div className="actions">
        <button
          type="button"
          className="secondaryButton"
          onClick={back}
        >
          ← რედაქტირება
        </button>

        <button
          type="button"
          className="primaryButton"
          onClick={confirm}
          disabled={saving}
        >
          {saving
            ? "იქმნება..."
            : "✓ ვადასტურებ და ვქმნი პროფილს"}
        </button>
      </div>
    </>
  );
}

function StepTitle({
  eyebrow,
  title,
  description,
  center = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  center?: boolean;
}) {
  return (
    <div
      className={
        center
          ? "stepTitle center"
          : "stepTitle"
      }
    >
      <span>
        {eyebrow}
      </span>

      <h1>
        {title}
      </h1>

      <p>
        {description}
      </p>
    </div>
  );
}

function Field({
  label,
  full = false,
  children,
}: {
  label: string;
  full?: boolean;
  children:
    React.ReactNode;
}) {
  return (
    <div
      className={
        full
          ? "field full"
          : "field"
      }
    >
      <label>
        {label}
      </label>

      {children}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange:
    (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      className="toggle"
      onClick={() =>
        onChange(!checked)
      }
    >
      <span>
        {label}
      </span>

      <b
        className={
          checked
            ? "toggleState on"
            : "toggleState"
        }
      >
        {checked
          ? "ON"
          : "OFF"}
      </b>
    </button>
  );
}

function PreviewItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
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
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="previewBlock">
      <strong>
        {title}
      </strong>

      <p>
        {text}
      </p>
    </div>
  );
}

function PageStyles() {
  return (
    <style jsx global>{`
      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
      }

      .page {
        position: relative;

        min-height: 100vh;

        overflow: hidden;

        padding:
          0 20px 50px;

        background: #0647c8;
      }

      .emojiLayer {
        position: fixed;
        inset: 0;

        overflow: hidden;

        pointer-events: none;
      }

      .emojiLayer span {
        position: absolute;

        opacity: .055;

        font-size: 72px;

        filter:
          grayscale(1)
          brightness(5);
      }

      .header {
        position: relative;
        z-index: 2;

        width: 100%;
        max-width: 960px;

        min-height: 72px;

        margin: auto;

        display: flex;
        align-items: center;
        justify-content:
          space-between;

        border-bottom:
          1px solid
          rgba(255,255,255,.2);
      }

      .brand {
        display: flex;
        align-items: center;

        gap: 10px;

        text-decoration: none;
      }

      .brandMark {
        width: 43px;
        height: 43px;

        display: grid;
        place-items: center;

        border-radius: 11px;

        background: #fff;

        color: #0647c8;

        font-size: 13px;
        font-weight: 950;
      }

      .brand strong,
      .brand small {
        display: block;
      }

      .brand strong {
        color: white;

        font-size: 18px;
      }

      .brand small {
        margin-top: 2px;

        color:
          rgba(255,255,255,.7);

        font-size: 11px;
      }

      .changeProduct {
        padding: 10px 14px;

        border:
          1px solid
          rgba(255,255,255,.3);

        border-radius: 9px;

        color: white;

        font-size: 13px;
        font-weight: 800;

        text-decoration: none;
      }

      .progress {
        position: relative;
        z-index: 2;

        width: 100%;
        max-width: 650px;

        margin: 25px auto 0;

        display: flex;
        align-items: center;
      }

      .progressPart {
        flex: 1;

        display: flex;
        align-items: center;
      }

      .progressPart:last-child {
        flex: 0 0 auto;
      }

      .progressStep {
        display: flex;
        align-items: center;

        gap: 8px;

        color:
          rgba(255,255,255,.52);

        font-size: 13px;
        font-weight: 800;

        white-space: nowrap;
      }

      .stepCircle {
        width: 32px;
        height: 32px;

        display: grid;
        place-items: center;

        border:
          1px solid
          rgba(255,255,255,.35);

        border-radius: 50%;

        font-size: 12px;
      }

      .progressStep.active,
      .progressStep.completed {
        color: white;
      }

      .progressStep.active
        .stepCircle {
        background: white;

        color: #0647c8;
      }

      .progressStep.completed
        .stepCircle {
        background: #ffffff;

        color: #0647c8;
      }

      .line {
        flex: 1;

        height: 2px;

        margin: 0 11px;

        background:
          rgba(255,255,255,.22);
      }

      .line.filled {
        background: white;
      }

      .marketingLine {
        position: relative;
        z-index: 2;

        width: 100%;
        max-width: 830px;

        margin: 22px auto 16px;

        display: flex;
        align-items: center;
        justify-content: center;

        gap: 12px;

        text-align: center;

        color: white;
      }

      .marketingLine > span {
        font-size: 35px;
      }

      .marketingLine strong {
        display: block;

        font-size: 16px;
      }

      .marketingLine p {
        margin: 4px 0 0;

        color:
          rgba(255,255,255,.72);

        font-size: 13px;
      }

      .card {
        position: relative;
        z-index: 2;

        width: 100%;
        max-width: 880px;

        margin: auto;

        padding: 26px;

        border-radius: 20px;

        background: #ffffff;

        box-shadow:
          0 25px 60px
          rgba(0,24,77,.28);
      }

      .errorBox {
        margin-bottom: 17px;

        padding: 13px 14px;

        border-radius: 10px;

        background: #fff0f2;

        color: #a53e49;

        font-size: 14px;
        font-weight: 700;
      }

      .stepTitle > span {
        color: #0647c8;

        font-size: 12px;
        font-weight: 900;

        letter-spacing: .8px;
      }

      .stepTitle h1 {
        margin: 5px 0 0;

        color: #203a55;

        font-size: 27px;
      }

      .stepTitle p {
        margin: 6px 0 0;

        color: #718397;

        font-size: 14px;
        line-height: 1.5;
      }

      .stepTitle.center {
        text-align: center;
      }

      .compactSection {
        margin-top: 20px;

        padding-top: 18px;

        border-top:
          1px solid #e4ebf3;
      }

      .compactSection h2 {
        margin: 0;

        color: #2b4661;

        font-size: 18px;
      }

      .sectionDescription {
        margin: 5px 0 0;

        color: #75869a;

        font-size: 13px;
      }

      .formGrid {
        margin-top: 15px;

        display: grid;

        grid-template-columns:
          repeat(
            2,
            minmax(0,1fr)
          );

        gap: 12px;
      }

      .formGrid.three {
        grid-template-columns:
          repeat(
            3,
            minmax(0,1fr)
          );
      }

      .field.full {
        grid-column:
          1 / -1;
      }

      .field label {
        display: block;

        margin-bottom: 6px;

        color: #344e68;

        font-size: 13px;
        font-weight: 800;
      }

      .field input,
      .field select,
      .field textarea {
        width: 100%;

        border:
          1px solid #d5e0eb;

        border-radius: 9px;

        background: #fff;

        color: #263f59;

        font-family: inherit;

        font-size: 14px;

        outline: none;
      }

      .field input,
      .field select {
        min-height: 44px;

        padding: 0 12px;
      }

      .field textarea {
        padding: 10px 12px;

        resize: vertical;

        line-height: 1.45;
      }

      .field input:focus,
      .field select:focus,
      .field textarea:focus {
        border-color: #0647c8;

        box-shadow:
          0 0 0 3px
          rgba(6,71,200,.08);
      }

      .smallNotice {
        margin-top: 16px;

        padding: 11px 13px;

        border-radius: 9px;

        background: #eef5ff;

        color: #4b6782;

        font-size: 13px;
      }

      .toggleGrid {
        margin-top: 13px;

        display: grid;

        grid-template-columns:
          repeat(
            3,
            minmax(0,1fr)
          );

        gap: 8px;
      }

      .toggle {
        min-height: 50px;

        padding: 0 12px;

        display: flex;
        align-items: center;
        justify-content:
          space-between;

        gap: 8px;

        border:
          1px solid #dce5ef;

        border-radius: 9px;

        background: white;

        color: #405972;

        font-family: inherit;

        font-size: 13px;
        font-weight: 750;

        text-align: left;

        cursor: pointer;
      }

      .toggleState {
        padding: 5px 8px;

        border-radius: 999px;

        background: #e5ebf2;

        color: #748599;

        font-size: 10px;

        white-space: nowrap;
      }

      .toggleState.on {
        background: #0647c8;

        color: white;
      }

      .actions {
        margin-top: 22px;

        display: flex;
        align-items: center;
        justify-content:
          space-between;

        gap: 10px;
      }

      .actions.right {
        justify-content:
          flex-end;
      }

      .actions button {
        min-height: 46px;

        padding: 0 18px;

        border-radius: 9px;

        font-family: inherit;

        font-size: 14px;
        font-weight: 850;

        cursor: pointer;
      }

      .primaryButton {
        border: 0;

        background: #0647c8;

        color: white;
      }

      .secondaryButton {
        border:
          1px solid #cad7e5;

        background: white;

        color: #607489;
      }

      .finderPreview {
        max-width: 640px;

        margin: 22px auto 0;

        overflow: hidden;

        border:
          1px solid #d6e2ee;

        border-radius: 16px;

        background: #fff;
      }

      .previewHeader {
        padding: 18px;

        display: flex;
        align-items: center;

        gap: 13px;

        background: #f2f6fc;
      }

      .previewEmoji {
        width: 54px;
        height: 54px;

        display: grid;
        place-items: center;

        border-radius: 13px;

        background: #0647c8;

        font-size: 28px;
      }

      .previewHeader span {
        color: #0647c8;

        font-size: 11px;
        font-weight: 900;
      }

      .previewHeader h2 {
        margin: 3px 0 0;

        color: #29445f;

        font-size: 21px;
      }

      .previewHeader p {
        margin: 3px 0 0;

        color: #75869a;

        font-size: 13px;
      }

      .ownerPreview {
        padding: 15px;

        display: grid;

        grid-template-columns:
          repeat(
            2,
            minmax(0,1fr)
          );

        gap: 8px;
      }

      .ownerPreview > div {
        padding: 11px;

        border-radius: 9px;

        background: #f7faff;
      }

      .ownerPreview span,
      .ownerPreview strong {
        display: block;
      }

      .ownerPreview span {
        color: #8190a1;

        font-size: 11px;
      }

      .ownerPreview strong {
        margin-top: 4px;

        color: #314b66;

        font-size: 13px;
      }

      .previewBlock {
        margin: 0 15px 9px;

        padding: 12px;

        border-radius: 9px;

        background: #f7faff;
      }

      .previewBlock strong {
        display: block;

        color: #314b66;

        font-size: 13px;
      }

      .previewBlock p {
        margin: 5px 0 0;

        color: #718397;

        font-size: 13px;
        line-height: 1.5;
      }

      .previewContacts {
        padding: 15px;

        display: grid;

        grid-template-columns:
          1fr 1fr;

        gap: 8px;
      }

      .previewContacts button {
        min-height: 43px;

        border: 0;

        border-radius: 9px;

        background: #0647c8;

        color: white;

        font-size: 13px;
        font-weight: 800;
      }

      @media (
        max-width: 760px
      ) {
        .formGrid.three,
        .toggleGrid {
          grid-template-columns:
            repeat(
              2,
              minmax(0,1fr)
            );
        }
      }

      @media (
        max-width: 600px
      ) {
        .page {
          padding:
            0 13px 28px;
        }

        .brand small {
          display: none;
        }

        .progressStep span {
          display: none;
        }

        .card {
          padding: 19px;
        }

        .formGrid,
        .formGrid.three,
        .toggleGrid {
          grid-template-columns:
            1fr;
        }

        .stepTitle h1 {
          font-size: 23px;
        }

        .actions {
          flex-direction:
            column;
        }

        .actions button {
          width: 100%;
        }
      }
    `}</style>
  );
}
