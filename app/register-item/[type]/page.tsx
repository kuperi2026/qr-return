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
  type User,
} from "@supabase/supabase-js";

type ProductType =
  | "dog"
  | "cat"
  | "keys"
  | "wallet"
  | "bag"
  | "suitcase";

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
  showPhoto: boolean;
  showDescription: boolean;
  showMedicalInfo: boolean;
  showBehaviourNote: boolean;
  showLostLocation: boolean;
  showFinderMessage: boolean;

  liveChatEnabled: boolean;
};

const PRODUCT_META: Record<
  ProductType,
  {
    label: string;
    emoji: string;
    slogan: string;
    secondSlogan: string;
  }
> = {
  dog: {
    label: "ძაღლი",
    emoji: "🐶",
    slogan:
      "ერთი სკანირება შეიძლება იყოს გზა სახლში დაბრუნებამდე.",
    secondSlogan:
      "ნუ დაკარგავთ იმედს — გაამარტივეთ მპოვნელთან დაკავშირება.",
  },

  cat: {
    label: "კატა",
    emoji: "🐱",
    slogan:
      "როცა სიტყვებით ვერ გეტყვის სად არის, QR პროფილს შეუძლია დაეხმაროს.",
    secondSlogan:
      "ერთი პატარა QR — უფრო სწრაფი გზა პატრონამდე.",
  },

  keys: {
    label: "გასაღები",
    emoji: "🔑",
    slogan:
      "დაკარგული გასაღები ყოველთვის არ ნიშნავს დაკარგულ დღეს.",
    secondSlogan:
      "მპოვნელს მიეცით მარტივი გზა თქვენთან დასაკავშირებლად.",
  },

  wallet: {
    label: "საფულე",
    emoji: "👛",
    slogan:
      "პირადი ნივთის დაბრუნება ერთი სწორი კონტაქტით შეიძლება დაიწყოს.",
    secondSlogan:
      "QR RETURN ამარტივებს პირველ და ყველაზე მნიშვნელოვან ნაბიჯს — დაკავშირებას.",
  },

  bag: {
    label: "ჩანთა",
    emoji: "👜",
    slogan:
      "რაც თქვენთვის მნიშვნელოვანია, მპოვნელისთვის ადვილად დასაბრუნებელი გახადეთ.",
    secondSlogan:
      "ნაკლები გაურკვევლობა. უფრო სწრაფი კონტაქტი.",
  },

  suitcase: {
    label: "ჩემოდანი",
    emoji: "🧳",
    slogan:
      "მოგზაურობა შეიძლება გაგრძელდეს — დაკარგული ჩემოდანი კი დაბრუნდეს.",
    secondSlogan:
      "ერთი სკანირება მპოვნელიდან მფლობელამდე.",
  },
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
  showPhoto: true,
  showDescription: true,
  showMedicalInfo: false,
  showBehaviourNote: false,
  showLostLocation: true,
  showFinderMessage: true,

  liveChatEnabled: true,
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

  const [step, setStep] =
    useState<1 | 2 | 3>(1);

  const [draft, setDraft] =
    useState<Draft>(INITIAL_DRAFT);

  const [user, setUser] =
    useState<User | null>(null);

  const [supabase, setSupabase] =
    useState<SupabaseClient | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const type: ProductType =
    isProductType(rawType)
      ? rawType
      : "dog";

  const meta =
    PRODUCT_META[type];

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

  const backgroundEmojis =
    useMemo(
      () =>
        Array.from({
          length: 18,
        }),
      []
    );

  useEffect(() => {
    async function loadUser() {
      try {
        const client =
          createSupabaseClient();

        if (!client) {
          setError(
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

        if (error || !user) {
          window.location.assign(
            "/login"
          );

          return;
        }

        setUser(user);

        setDraft((current) => ({
          ...current,

          ownerFirstName:
            String(
              user.user_metadata
                ?.first_name || ""
            ),

          ownerLastName:
            String(
              user.user_metadata
                ?.last_name || ""
            ),

          ownerPhone:
            String(
              user.user_metadata
                ?.phone ||
                user.phone ||
                ""
            ),

          ownerEmail:
            String(
              user.email || ""
            ),
        }));
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  function update<K extends keyof Draft>(
    key: K,
    value: Draft[K]
  ) {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function continueOwner() {
    setError("");

    if (!draft.ownerFirstName.trim()) {
      setError(
        "მფლობელის სახელი მიუთითეთ."
      );
      return;
    }

    if (!draft.ownerLastName.trim()) {
      setError(
        "მფლობელის გვარი მიუთითეთ."
      );
      return;
    }

    if (!draft.ownerPhone.trim()) {
      setError(
        "ტელეფონის ნომერი მიუთითეთ."
      );
      return;
    }

    if (supabase) {
      await supabase.auth.updateUser({
        data: {
          first_name:
            draft.ownerFirstName.trim(),

          last_name:
            draft.ownerLastName.trim(),

          phone:
            draft.ownerPhone.trim(),
        },
      });
    }

    setStep(2);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function continueProduct() {
    setError("");

    if (!draft.tagCode.trim()) {
      setError(
        "QR / Tag Code სავალდებულოა."
      );
      return;
    }

    if (!draft.itemName.trim()) {
      setError(
        isPet
          ? "ცხოველის სახელი მიუთითეთ."
          : "პროფილის სახელი მიუთითეთ."
      );
      return;
    }

    setStep(3);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function confirmProfile() {
    setError("");

    if (
      !supabase ||
      !user
    ) {
      setError(
        "ანგარიშთან კავშირი ვერ მოიძებნა."
      );
      return;
    }

    setSaving(true);

    try {
      const cleanTag =
        draft.tagCode
          .trim()
          .toUpperCase();

      const {
        data: existing,
        error: checkError,
      } =
        await supabase
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

      const {
        data: created,
        error: insertError,
      } =
        await supabase
          .from("item")
          .insert({
            owner_id:
              user.id,

            owner_first_name:
              draft.ownerFirstName.trim(),

            owner_last_name:
              draft.ownerLastName.trim(),

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
                ? draft.sex || null
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

            finder_message:
              draft.finderMessage.trim() ||
              null,

            lost_seen_location:
              draft.lostLocation.trim() ||
              null,

            show_owner_name:
              true,

            show_owner_phone:
              true,

            show_email:
              draft.showEmail,

            show_pet_photo:
              draft.showPhoto,

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

            lost:
              false,
          })
          .select(
            "tag_code"
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
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "პროფილის შექმნა ვერ მოხერხდა."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="loadingPage">
        იტვირთება...
      </main>
    );
  }

  return (
    <>
      <main className="page">
        <div className="emojiBackground">
          {backgroundEmojis.map(
            (_, index) => (
              <span
                key={index}
                style={{
                  left: `${
                    (index * 23) %
                    100
                  }%`,
                  top: `${
                    (index * 37) %
                    100
                  }%`,
                  transform: `rotate(${
                    index * 17
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
            <div className="logo">
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

        <section className="progress">
          <div
            className={
              step >= 1
                ? "progressItem active"
                : "progressItem"
            }
          >
            <b>1</b>
            <span>
              მფლობელი
            </span>
          </div>

          <div className="progressLine" />

          <div
            className={
              step >= 2
                ? "progressItem active"
                : "progressItem"
            }
          >
            <b>2</b>
            <span>
              {meta.label}
            </span>
          </div>

          <div className="progressLine" />

          <div
            className={
              step >= 3
                ? "progressItem active"
                : "progressItem"
            }
          >
            <b>3</b>
            <span>
              შემოწმება
            </span>
          </div>
        </section>

        <section className="slogan">
          <span>
            {meta.emoji}
          </span>

          <div>
            <strong>
              {meta.slogan}
            </strong>

            <p>
              {meta.secondSlogan}
            </p>
          </div>
        </section>

        <section className="formCard">
          {error && (
            <div className="error">
              {error}
            </div>
          )}

          {step === 1 && (
            <OwnerStep
              draft={draft}
              update={update}
              onNext={
                continueOwner
              }
            />
          )}

          {step === 2 && (
            <ProductStep
              type={type}
              meta={meta}
              draft={draft}
              update={update}
              onBack={() =>
                setStep(1)
              }
              onNext={
                continueProduct
              }
            />
          )}

          {step === 3 && (
            <PreviewStep
              type={type}
              meta={meta}
              draft={draft}
              onBack={() =>
                setStep(2)
              }
              onConfirm={
                confirmProfile
              }
              saving={saving}
            />
          )}
        </section>
      </main>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          position: relative;

          min-height: 100vh;

          overflow: hidden;

          padding:
            0 24px 55px;

          background:
            #0747c9;
        }

        .emojiBackground {
          position: fixed;
          inset: 0;

          overflow: hidden;

          pointer-events: none;
        }

        .emojiBackground span {
          position: absolute;

          opacity: .055;

          font-size: 70px;

          filter:
            grayscale(1)
            brightness(4);
        }

        .header {
          position: relative;
          z-index: 2;

          width: 100%;
          max-width: 980px;

          min-height: 76px;

          margin: auto;

          display: flex;
          align-items: center;
          justify-content:
            space-between;

          border-bottom:
            1px solid
            rgba(
              255,
              255,
              255,
              .2
            );
        }

        .brand {
          display: flex;
          align-items: center;

          gap: 10px;

          text-decoration: none;
        }

        .logo {
          width: 44px;
          height: 44px;

          display: grid;
          place-items: center;

          border-radius: 12px;

          background: white;

          color: #0747c9;

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
            rgba(
              255,
              255,
              255,
              .72
            );

          font-size: 11px;
        }

        .changeProduct {
          padding:
            11px 15px;

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              .32
            );

          border-radius: 10px;

          color: white;

          font-size: 14px;
          font-weight: 800;

          text-decoration: none;
        }

        .progress {
          position: relative;
          z-index: 2;

          width: 100%;
          max-width: 680px;

          margin:
            28px auto 0;

          display: flex;
          align-items: center;
        }

        .progressItem {
          display: flex;
          align-items: center;

          gap: 8px;

          color:
            rgba(
              255,
              255,
              255,
              .6
            );

          font-size: 13px;
          font-weight: 800;
        }

        .progressItem b {
          width: 32px;
          height: 32px;

          display: grid;
          place-items: center;

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              .35
            );

          border-radius: 50%;
        }

        .progressItem.active {
          color: white;
        }

        .progressItem.active b {
          background: white;

          color: #0747c9;
        }

        .progressLine {
          flex: 1;

          height: 1px;

          margin: 0 12px;

          background:
            rgba(
              255,
              255,
              255,
              .3
            );
        }

        .slogan {
          position: relative;
          z-index: 2;

          width: 100%;
          max-width: 880px;

          margin:
            28px auto 18px;

          display: flex;
          align-items: center;

          gap: 14px;

          color: white;

          text-align: center;

          justify-content: center;
        }

        .slogan > span {
          font-size: 38px;
        }

        .slogan strong {
          display: block;

          font-size: 17px;
        }

        .slogan p {
          margin: 4px 0 0;

          color:
            rgba(
              255,
              255,
              255,
              .75
            );

          font-size: 14px;
        }

        .formCard {
          position: relative;
          z-index: 2;

          width: 100%;
          max-width: 900px;

          margin: auto;

          padding: 30px;

          border-radius: 22px;

          background: white;

          box-shadow:
            0 25px 60px
            rgba(
              0,
              26,
              82,
              .28
            );
        }

        .error {
          margin-bottom: 18px;

          padding: 14px;

          border-radius: 11px;

          background: #fff1f2;

          color: #a53d48;

          font-size: 14px;
          font-weight: 700;
        }

        .loadingPage {
          min-height: 100vh;

          display: grid;
          place-items: center;

          background: #0747c9;

          color: white;

          font-size: 16px;
        }

        @media (
          max-width: 650px
        ) {
          .page {
            padding:
              0 14px 30px;
          }

          .brand small {
            display: none;
          }

          .changeProduct {
            font-size: 12px;
          }

          .progressItem span {
            display: none;
          }

          .formCard {
            padding: 20px;
          }

          .slogan {
            align-items:
              flex-start;

            text-align: left;
          }
        }
      `}</style>
    </>
  );
}

function OwnerStep({
  draft,
  update,
  onNext,
}: {
  draft: Draft;
  update: <K extends keyof Draft>(
    key: K,
    value: Draft[K]
  ) => void;
  onNext: () => void;
}) {
  return (
    <>
      <div className="title">
        <span>
          STEP 1 OF 3
        </span>

        <h1>
          მფლობელის ინფორმაცია
        </h1>

        <p>
          გადაამოწმეთ თქვენი
          საკონტაქტო ინფორმაცია.
        </p>
      </div>

      <div className="grid">
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

        <Field label="ელფოსტა">
          <input
            value={
              draft.ownerEmail
            }
            disabled
          />
        </Field>
      </div>

      <div className="tip">
        სახელი, გვარი და ტელეფონი
        მპოვნელისთვის ყოველთვის
        ხილული იქნება.
      </div>

      <div className="buttons end">
        <button
          type="button"
          onClick={onNext}
          className="primary"
        >
          გაგრძელება →
        </button>
      </div>

      <CommonStyles />
    </>
  );
}

function ProductStep({
  type,
  meta,
  draft,
  update,
  onBack,
  onNext,
}: {
  type: ProductType;
  meta: {
    label: string;
    emoji: string;
  };
  draft: Draft;
  update: <K extends keyof Draft>(
    key: K,
    value: Draft[K]
  ) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const pet =
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

  return (
    <>
      <div className="title">
        <span>
          STEP 2 OF 3
        </span>

        <h1>
          {meta.emoji}{" "}
          {meta.label}ს ინფორმაცია
        </h1>

        <p>
          შეავსეთ მხოლოდ ყველაზე
          საჭირო ინფორმაცია.
        </p>
      </div>

      <div className="grid">
        <Field
          label="QR / Tag Code *"
          full
        >
          <input
            value={draft.tagCode}
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
            pet
              ? "სახელი *"
              : "პროფილის სახელი *"
          }
        >
          <input
            value={draft.itemName}
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
            value={draft.colour}
            onChange={(e) =>
              update(
                "colour",
                e.target.value
              )
            }
          />
        </Field>

        {pet && (
          <>
            <Field label="სქესი">
              <select
                value={draft.sex}
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
                value={draft.weight}
                onChange={(e) =>
                  update(
                    "weight",
                    e.target.value
                  )
                }
              />
            </Field>
          </>
        )}

        {showBrand && (
          <Field label="ბრენდი">
            <input
              value={draft.brand}
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
              value={draft.model}
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
              value={draft.size}
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
              value={draft.material}
              onChange={(e) =>
                update(
                  "material",
                  e.target.value
                )
              }
            />
          </Field>
        )}

        <Field
          label="აღწერა"
          full
        >
          <textarea
            rows={3}
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

        {pet && (
          <>
            <Field
              label="სამედიცინო ინფორმაცია"
              full
            >
              <textarea
                rows={3}
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

            <Field
              label="ქცევის ინფორმაცია"
              full
            >
              <textarea
                rows={3}
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
          </>
        )}

        {!pet && (
          <Field
            label="განმასხვავებელი ნიშნები"
            full
          >
            <textarea
              rows={3}
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

        <Field
          label="დაკარგვის ადგილი"
          full
        >
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
            rows={3}
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

      <div className="visibility">
        <h2>
          რას გსურთ რომ დაინახოს
          მპოვნელმა?
        </h2>

        <div className="toggles">
          <Toggle
            label="ელფოსტა"
            checked={
              draft.showEmail
            }
            onChange={(v) =>
              update(
                "showEmail",
                v
              )
            }
          />

          <Toggle
            label="აღწერა"
            checked={
              draft.showDescription
            }
            onChange={(v) =>
              update(
                "showDescription",
                v
              )
            }
          />

          {pet && (
            <>
              <Toggle
                label="სამედიცინო ინფორმაცია"
                checked={
                  draft.showMedicalInfo
                }
                onChange={(v) =>
                  update(
                    "showMedicalInfo",
                    v
                  )
                }
              />

              <Toggle
                label="ქცევის ინფორმაცია"
                checked={
                  draft.showBehaviourNote
                }
                onChange={(v) =>
                  update(
                    "showBehaviourNote",
                    v
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
            onChange={(v) =>
              update(
                "showLostLocation",
                v
              )
            }
          />

          <Toggle
            label="Finder Message"
            checked={
              draft.showFinderMessage
            }
            onChange={(v) =>
              update(
                "showFinderMessage",
                v
              )
            }
          />

          <Toggle
            label="Live Chat"
            checked={
              draft.liveChatEnabled
            }
            onChange={(v) =>
              update(
                "liveChatEnabled",
                v
              )
            }
          />
        </div>
      </div>

      <div className="buttons">
        <button
          type="button"
          onClick={onBack}
          className="secondary"
        >
          ← უკან
        </button>

        <button
          type="button"
          onClick={onNext}
          className="primary"
        >
          Preview →
        </button>
      </div>

      <CommonStyles />
    </>
  );
}

function PreviewStep({
  type,
  meta,
  draft,
  onBack,
  onConfirm,
  saving,
}: {
  type: ProductType;
  meta: {
    label: string;
    emoji: string;
  };
  draft: Draft;
  onBack: () => void;
  onConfirm: () => void;
  saving: boolean;
}) {
  const pet =
    type === "dog" ||
    type === "cat";

  return (
    <>
      <div className="title center">
        <span>
          STEP 3 OF 3
        </span>

        <h1>
          რას ნახავს მპოვნელი
        </h1>

        <p>
          გადაამოწმეთ ინფორმაცია
          საბოლოო დადასტურებამდე.
        </p>
      </div>

      <div className="finderPreview">
        <div className="previewHero">
          <div className="bigEmoji">
            {meta.emoji}
          </div>

          <div>
            <span>
              QR RETURN PROFILE
            </span>

            <h2>
              {draft.itemName ||
                meta.label}
            </h2>

            <p>
              ნაპოვნია? დაუკავშირდით
              მფლობელს.
            </p>
          </div>
        </div>

        <div className="ownerPreview">
          <div>
            <span>
              მფლობელი
            </span>

            <strong>
              {
                draft.ownerFirstName
              }{" "}
              {
                draft.ownerLastName
              }
            </strong>
          </div>

          <div>
            <span>
              ტელეფონი
            </span>

            <strong>
              {draft.ownerPhone}
            </strong>
          </div>

          {draft.showEmail &&
            draft.ownerEmail && (
              <div>
                <span>
                  ელფოსტა
                </span>

                <strong>
                  {
                    draft.ownerEmail
                  }
                </strong>
              </div>
            )}
        </div>

        {draft.showDescription &&
          draft.description && (
            <PreviewBlock
              title="აღწერა"
              value={
                draft.description
              }
            />
          )}

        {pet &&
          draft.showMedicalInfo &&
          draft.medicalInfo && (
            <PreviewBlock
              title="სამედიცინო ინფორმაცია"
              value={
                draft.medicalInfo
              }
            />
          )}

        {pet &&
          draft.showBehaviourNote &&
          draft.behaviourNote && (
            <PreviewBlock
              title="ქცევის ინფორმაცია"
              value={
                draft.behaviourNote
              }
            />
          )}

        {draft.showLostLocation &&
          draft.lostLocation && (
            <PreviewBlock
              title="📍 დაკარგვის ადგილი"
              value={
                draft.lostLocation
              }
            />
          )}

        {draft.showFinderMessage &&
          draft.finderMessage && (
            <PreviewBlock
              title="მფლობელის შეტყობინება"
              value={
                draft.finderMessage
              }
            />
          )}

        <div className="contactPreview">
          <button type="button">
            ☎ დარეკვა
          </button>

          {draft.liveChatEnabled && (
            <button type="button">
              Live Chat
            </button>
          )}
        </div>
      </div>

      <div className="confirmation">
        ეს არის ინფორმაცია,
        რომელსაც QR კოდის
        მპოვნელი დაინახავს.
      </div>

      <div className="buttons">
        <button
          type="button"
          onClick={onBack}
          className="secondary"
        >
          ← რედაქტირება
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={saving}
          className="primary"
        >
          {saving
            ? "იქმნება..."
            : "✓ ვადასტურებ და ვქმნი პროფილს"}
        </button>
      </div>

      <CommonStyles />

      <style jsx>{`
        .finderPreview {
          max-width: 650px;

          margin: 25px auto 0;

          overflow: hidden;

          border:
            1px solid #d6e2ef;

          border-radius: 18px;

          background: #fff;
        }

        .previewHero {
          padding: 22px;

          display: flex;
          align-items: center;

          gap: 14px;

          background: #f2f6fc;
        }

        .bigEmoji {
          width: 58px;
          height: 58px;

          display: grid;
          place-items: center;

          border-radius: 15px;

          background: #0747c9;

          font-size: 29px;
        }

        .previewHero span {
          color: #0747c9;

          font-size: 11px;
          font-weight: 900;
        }

        .previewHero h2 {
          margin: 4px 0 0;

          color: #253e58;

          font-size: 22px;
        }

        .previewHero p {
          margin: 4px 0 0;

          color: #75869a;

          font-size: 13px;
        }

        .ownerPreview {
          padding: 18px;

          display: grid;

          grid-template-columns:
            repeat(
              2,
              minmax(0, 1fr)
            );

          gap: 10px;
        }

        .ownerPreview > div {
          padding: 13px;

          border-radius: 10px;

          background: #f7faff;
        }

        .ownerPreview span,
        .ownerPreview strong {
          display: block;
        }

        .ownerPreview span {
          color: #8190a1;

          font-size: 12px;
        }

        .ownerPreview strong {
          margin-top: 5px;

          color: #304b66;

          font-size: 14px;
        }

        .contactPreview {
          padding: 18px;

          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 9px;
        }

        .contactPreview button {
          min-height: 45px;

          border: 0;
          border-radius: 10px;

          background: #0747c9;

          color: white;

          font-size: 14px;
          font-weight: 800;
        }

        .confirmation {
          max-width: 650px;

          margin: 14px auto 0;

          padding: 12px;

          border-radius: 10px;

          background: #edf4ff;

          color: #0747c9;

          font-size: 13px;

          text-align: center;

          font-weight: 750;
        }
      `}</style>
    </>
  );
}

function PreviewBlock({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div
      style={{
        margin:
          "0 18px 10px",
        padding: "14px",
        borderRadius: "10px",
        background: "#f7faff",
      }}
    >
      <strong
        style={{
          display: "block",
          color: "#304b66",
          fontSize: "14px",
        }}
      >
        {title}
      </strong>

      <p
        style={{
          margin:
            "6px 0 0",
          color: "#718397",
          fontSize: "13px",
          lineHeight: 1.55,
        }}
      >
        {value}
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
      style={{
        gridColumn:
          full
            ? "1 / -1"
            : undefined,
      }}
    >
      <label
        style={{
          display: "block",
          marginBottom: "7px",
          color: "#344e69",
          fontSize: "14px",
          fontWeight: 800,
        }}
      >
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
      onClick={() =>
        onChange(!checked)
      }
      style={{
        minHeight: "54px",
        padding: "0 14px",
        display: "flex",
        alignItems: "center",
        justifyContent:
          "space-between",
        gap: "10px",
        border:
          "1px solid #dbe5ef",
        borderRadius:
          "10px",
        background: "#fff",
        color: "#405972",
        fontSize: "13px",
        fontWeight: 750,
        cursor: "pointer",
      }}
    >
      {label}

      <span
        style={{
          padding:
            "5px 9px",
          borderRadius:
            "999px",
          background:
            checked
              ? "#0747c9"
              : "#e5ebf2",
          color:
            checked
              ? "#fff"
              : "#738397",
          fontSize:
            "11px",
          fontWeight: 900,
        }}
      >
        {checked
          ? "ON"
          : "OFF"}
      </span>
    </button>
  );
}

function CommonStyles() {
  return (
    <style jsx global>{`
      .title > span {
        color: #0747c9;

        font-size: 12px;
        font-weight: 900;

        letter-spacing: .8px;
      }

      .title h1 {
        margin: 6px 0 0;

        color: #203a55;

        font-size: 27px;
      }

      .title p {
        margin: 7px 0 0;

        color: #74869a;

        font-size: 14px;
      }

      .title.center {
        text-align: center;
      }

      .grid {
        margin-top: 24px;

        display: grid;

        grid-template-columns:
          repeat(
            2,
            minmax(
              0,
              1fr
            )
          );

        gap: 15px;
      }

      .grid input,
      .grid select,
      .grid textarea {
        width: 100%;

        border:
          1px solid #d6e1ec;

        border-radius: 10px;

        background: #fff;

        color: #243e59;

        font-family: inherit;

        font-size: 15px;

        outline: none;
      }

      .grid input,
      .grid select {
        min-height: 48px;

        padding: 0 13px;
      }

      .grid textarea {
        padding: 12px 13px;

        resize: vertical;

        line-height: 1.5;
      }

      .grid input:focus,
      .grid select:focus,
      .grid textarea:focus {
        border-color: #0747c9;

        box-shadow:
          0 0 0 3px
          rgba(
            7,
            71,
            201,
            .08
          );
      }

      .tip {
        margin-top: 18px;

        padding: 12px 14px;

        border-radius: 10px;

        background: #eef5ff;

        color: #476681;

        font-size: 13px;
      }

      .visibility {
        margin-top: 22px;

        padding-top: 20px;

        border-top:
          1px solid #e5ebf2;
      }

      .visibility h2 {
        margin: 0;

        color: #29445f;

        font-size: 18px;
      }

      .toggles {
        margin-top: 14px;

        display: grid;

        grid-template-columns:
          repeat(
            2,
            minmax(
              0,
              1fr
            )
          );

        gap: 9px;
      }

      .buttons {
        margin-top: 24px;

        display: flex;
        justify-content:
          space-between;

        gap: 10px;
      }

      .buttons.end {
        justify-content:
          flex-end;
      }

      .buttons button {
        min-height: 48px;

        padding: 0 18px;

        border-radius: 10px;

        font-family: inherit;

        font-size: 14px;

        font-weight: 850;

        cursor: pointer;
      }

      .buttons .primary {
        border: 0;

        background: #0747c9;

        color: white;
      }

      .buttons .secondary {
        border:
          1px solid #cad8e6;

        background: white;

        color: #60748a;
      }

      @media (
        max-width:
          650px
      ) {
        .grid,
        .toggles {
          grid-template-columns:
            1fr;
        }

        .buttons {
          flex-direction:
            column;
        }

        .buttons button {
          width: 100%;
        }
      }
    `}</style>
  );
}
