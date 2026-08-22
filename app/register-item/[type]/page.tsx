"use client";

import {
  ChangeEvent,
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
  showPhoto: boolean;
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
  showPhoto: true,
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
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
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

  const meta =
    PRODUCT_META[type];

  const isPet =
    type === "dog" ||
    type === "cat";

  const isKeys =
    type === "keys";

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

  /* PHOTO */

  const [
    photoFile,
    setPhotoFile,
  ] =
    useState<File | null>(
      null
    );

  const [
    photoPreview,
    setPhotoPreview,
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
    return () => {
      if (
        photoPreview.startsWith(
          "blob:"
        )
      ) {
        URL.revokeObjectURL(
          photoPreview
        );
      }
    };
  }, [photoPreview]);

  useEffect(() => {
    async function loadAccount() {
      try {
        const client =
          createSupabaseClient();

        if (!client) {
          setErrorMessage(
            "Supabase კავშირი ვერ მოიძებნა."
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

        let firstName =
          String(
            user.user_metadata
              ?.first_name || ""
          );

        let lastName =
          String(
            user.user_metadata
              ?.last_name || ""
          );

        let phone =
          String(
            user.user_metadata
              ?.phone ||
              user.phone ||
              ""
          );

        let email =
          String(
            user.email || ""
          );

        try {
          const {
            data:
              ownerAccount,
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

          if (
            ownerAccount
          ) {
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

            email =
              ownerAccount
                .email ||
              email;
          }
        } catch (
          ownerError
        ) {
          console.log(
            ownerError
          );
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
              email,
          })
        );
      } catch (error) {
        console.error(
          error
        );

        setErrorMessage(
          "ანგარიშის ინფორმაციის ჩატვირთვა ვერ მოხერხდა."
        );
      } finally {
        setLoading(
          false
        );
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

  function selectPhoto(
    event:
      ChangeEvent<HTMLInputElement>
  ) {
    setErrorMessage("");

    const file =
      event.target
        .files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      setErrorMessage(
        "ფოტო უნდა იყოს JPG, PNG ან WEBP ფორმატში."
      );

      event.target.value =
        "";

      return;
    }

    const maxSize =
      5 * 1024 * 1024;

    if (
      file.size >
      maxSize
    ) {
      setErrorMessage(
        "ფოტოს მაქსიმალური ზომაა 5 MB."
      );

      event.target.value =
        "";

      return;
    }

    if (
      photoPreview.startsWith(
        "blob:"
      )
    ) {
      URL.revokeObjectURL(
        photoPreview
      );
    }

    const preview =
      URL.createObjectURL(
        file
      );

    setPhotoFile(file);
    setPhotoPreview(
      preview
    );
    updateDraft(
      "showPhoto",
      true
    );
  }

  function removePhoto() {
    if (
      photoPreview.startsWith(
        "blob:"
      )
    ) {
      URL.revokeObjectURL(
        photoPreview
      );
    }

    setPhotoFile(null);
    setPhotoPreview("");
  }

  async function uploadProfilePhoto(
    client: SupabaseClient,
    userId: string
  ) {
    if (!photoFile) {
      return null;
    }

    const extension =
      photoFile.name
        .split(".")
        .pop()
        ?.toLowerCase() ||
      "jpg";

    const safeType =
      type.replace(
        /[^a-z0-9-]/g,
        ""
      );

    const fileName =
      `${userId}/${safeType}/${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const {
      error:
        uploadError,
    } =
      await client.storage
        .from(
          "profile-photos"
        )
        .upload(
          fileName,
          photoFile,
          {
            cacheControl:
              "3600",
            upsert: false,
          }
        );

    if (uploadError) {
      throw new Error(
        `ფოტოს ატვირთვა ვერ მოხერხდა: ${uploadError.message}`
      );
    }

    const {
      data:
        publicData,
    } =
      client.storage
        .from(
          "profile-photos"
        )
        .getPublicUrl(
          fileName
        );

    return (
      publicData
        .publicUrl ||
      null
    );
  }

  async function goToStepTwo() {
    setErrorMessage("");

    if (
      !draft
        .ownerFirstName
        .trim()
    ) {
      setErrorMessage(
        "გთხოვთ მიუთითოთ სახელი."
      );
      return;
    }

    if (
      !draft
        .ownerLastName
        .trim()
    ) {
      setErrorMessage(
        "გთხოვთ მიუთითოთ გვარი."
      );
      return;
    }

    if (
      !draft
        .ownerPhone
        .trim()
    ) {
      setErrorMessage(
        "გთხოვთ მიუთითოთ ტელეფონის ნომერი."
      );
      return;
    }

    if (
      !draft
        .ownerEmail
        .trim()
    ) {
      setErrorMessage(
        "გთხოვთ მიუთითოთ ელფოსტა."
      );
      return;
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
      !draft
        .tagCode
        .trim()
    ) {
      setErrorMessage(
        "QR / Tag Code სავალდებულოა."
      );
      return;
    }

    if (
      !draft
        .itemName
        .trim()
    ) {
      if (
        type === "cat"
      ) {
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

      const {
        data: {
          user,
        },
        error:
          userError,
      } =
        await client
          .auth
          .getUser();

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
        data:
          existing,
        error:
          checkError,
      } =
        await client
          .from("item")
          .select("id")
          .ilike(
            "tag_code",
            cleanTag
          )
          .maybeSingle();

      if (
        checkError
      ) {
        throw checkError;
      }

      if (
        existing
      ) {
        throw new Error(
          "ეს QR კოდი უკვე დარეგისტრირებულია."
        );
      }

      /*
        PHOTO UPLOAD
      */

      const photoUrl =
        await uploadProfilePhoto(
          client,
          user.id
        );

      const payload = {
        owner_id:
          user.id,

        owner_phone:
          draft
            .ownerPhone
            .trim(),

        owner_email:
          draft
            .ownerEmail
            .trim(),

        tag_code:
          cleanTag,

        item_type:
          type,

        pet_type:
          isPet
            ? type
            : null,

        item_name:
          draft
            .itemName
            .trim(),

        photo:
          photoUrl,

        colour:
          draft.colour
            .trim() ||
          null,

        sex:
          isPet
            ? draft.sex ||
              null
            : null,

        date_of_birth:
          isPet
            ? draft
                .dateOfBirth ||
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
          draft.brand
            .trim()
            ? draft.brand
                .trim()
            : null,

        model:
          (isBag ||
            isSuitcase) &&
          draft.model
            .trim()
            ? draft.model
                .trim()
            : null,

        size:
          (isBag ||
            isSuitcase) &&
          draft.size
            .trim()
            ? draft.size
                .trim()
            : null,

        material:
          !isPet &&
          !isKeys &&
          draft.material
            .trim()
            ? draft.material
                .trim()
            : null,

        description:
          draft
            .description
            .trim() ||
          null,

        medical_info:
          isPet
            ? draft
                .medicalInfo
                .trim() ||
              null
            : null,

        behaviour_note:
          isPet
            ? draft
                .behaviourNote
                .trim() ||
              null
            : null,

        distinctive_features:
          !isPet
            ? draft
                .distinctiveFeatures
                .trim() ||
              null
            : null,

        lost_seen_location:
          draft
            .lostLocation
            .trim() ||
          null,

        finder_message:
          draft
            .finderMessage
            .trim() ||
          null,

        show_email:
          draft.showEmail,

        show_pet_photo:
          draft.showPhoto,

        show_description:
          draft
            .showDescription,

        show_medical_info:
          isPet
            ? draft
                .showMedicalInfo
            : false,

        show_behaviour_note:
          isPet
            ? draft
                .showBehaviourNote
            : false,

        show_finder_message:
          draft
            .showFinderMessage,

        phone_enabled:
          true,

        live_chat_enabled:
          draft
            .liveChatEnabled,

        active:
          true,
      };

      const {
        data:
          created,
        error:
          insertError,
      } =
        await client
          .from("item")
          .insert(payload)
          .select(
            "id,tag_code"
          )
          .single();

      if (
        insertError
      ) {
        throw insertError;
      }

      window.location.assign(
        `/registration-success?type=${type}&tag=${encodeURIComponent(
          created.tag_code
        )}`
      );
    } catch (error) {
      console.error(
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
        {meta.emoji}
        <span>
          იტვირთება...
        </span>

        <style jsx>{`
          .loadingPage {
            min-height: 100vh;
            display: grid;
            place-items: center;
            align-content: center;
            gap: 12px;
            background: #0647c8;
            color: white;
            font-size: 42px;
          }

          .loadingPage span {
            font-size: 15px;
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

            <strong>
              QR RETURN
            </strong>
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
            <div className="errorBox">
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
              photoPreview={
                photoPreview
              }
              onPhotoChange={
                selectPhoto
              }
              onPhotoRemove={
                removePhoto
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
              photoPreview={
                photoPreview
              }
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
  const list = [
    "მფლობელი",
    productLabel,
    "შემოწმება",
  ];

  return (
    <div className="progress">
      {list.map(
        (
          label,
          index
        ) => {
          const number =
            index + 1;

          const complete =
            step >
            number;

          const active =
            step ===
            number;

          return (
            <div
              className="progressPiece"
              key={label}
            >
              <div
                className={`progressStep ${
                  complete
                    ? "complete"
                    : ""
                } ${
                  active
                    ? "active"
                    : ""
                }`}
              >
                <b>
                  {complete
                    ? "✓"
                    : number}
                </b>

                <span>
                  {label}
                </span>
              </div>

              {index < 2 && (
                <div
                  className={`progressLine ${
                    step >
                    number
                      ? "complete"
                      : ""
                  }`}
                />
              )}
            </div>
          );
        }
      )}
    </div>
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
      <Title
        step="STEP 1 OF 3"
        title="მფლობელის ინფორმაცია"
        text="გადაამოწმეთ ან განაახლეთ თქვენი საკონტაქტო ინფორმაცია."
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
  photoPreview,
  onPhotoChange,
  onPhotoRemove,
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

  photoPreview: string;

  onPhotoChange:
    (
      event:
        ChangeEvent<HTMLInputElement>
    ) => void;

  onPhotoRemove:
    () => void;

  back: () => void;

  next: () => void;
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
      <Title
        step="STEP 2 OF 3"
        title={`${meta.emoji} ${meta.label}`}
        text={
          type === "cat"
            ? "გთხოვთ შეავსოთ კატის შესახებ ინფორმაცია."
            : type === "dog"
            ? "გთხოვთ შეავსოთ ძაღლის შესახებ ინფორმაცია."
            : `გთხოვთ შეავსოთ ${meta.label}ს შესახებ ინფორმაცია.`
        }
      />

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
            pet
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

        {pet && (
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

      <PhotoUploader
        preview={
          photoPreview
        }
        showPhoto={
          draft.showPhoto
        }
        onChange={
          onPhotoChange
        }
        onRemove={
          onPhotoRemove
        }
        onVisibilityChange={(
          value
        ) =>
          update(
            "showPhoto",
            value
          )
        }
      />

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

        {pet ? (
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

        {pet && (
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
          />
        </Field>
      </div>

      <div className="visibility">
        <h2>
          რას დაინახავს მპოვნელი
        </h2>

        <div className="toggleGrid">
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
            label="ფოტო"
            checked={
              draft.showPhoto
            }
            onChange={(v) =>
              update(
                "showPhoto",
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
                label="ქცევის შესახებ ინფორმაცია"
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

function PhotoUploader({
  preview,
  showPhoto,
  onChange,
  onRemove,
  onVisibilityChange,
}: {
  preview: string;

  showPhoto: boolean;

  onChange:
    (
      event:
        ChangeEvent<HTMLInputElement>
    ) => void;

  onRemove:
    () => void;

  onVisibilityChange:
    (value: boolean) =>
      void;
}) {
  return (
    <section className="photoSection">
      <div>
        <h2>
          ფოტო
        </h2>

        <p>
          დაამატეთ ფოტო, რათა
          მპოვნელმა უფრო მარტივად
          ამოიცნოს.
        </p>
      </div>

      {!preview ? (
        <label className="uploadBox">
          <div className="uploadPlus">
            +
          </div>

          <strong>
            ფოტოს დამატება
          </strong>

          <span>
            JPG, PNG ან WEBP · მაქს. 5 MB
          </span>

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={
              onChange
            }
          />
        </label>
      ) : (
        <div className="photoPreviewBox">
          <img
            src={preview}
            alt="არჩეული ფოტო"
          />

          <div className="photoActions">
            <label>
              ფოტოს შეცვლა

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={
                  onChange
                }
              />
            </label>

            <button
              type="button"
              onClick={
                onRemove
              }
            >
              წაშლა
            </button>
          </div>

          <button
            type="button"
            className="photoVisibility"
            onClick={() =>
              onVisibilityChange(
                !showPhoto
              )
            }
          >
            მპოვნელისთვის ფოტო:
            <b>
              {showPhoto
                ? " ON"
                : " OFF"}
            </b>
          </button>
        </div>
      )}
    </section>
  );
}

function PreviewStep({
  type,
  meta,
  draft,
  photoPreview,
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

  photoPreview: string;

  back: () => void;

  confirm: () => void;

  saving: boolean;
}) {
  const pet =
    type === "dog" ||
    type === "cat";

  return (
    <>
      <Title
        step="STEP 3 OF 3"
        title="რას ნახავს მპოვნელი"
        text="თუ ყველაფერი სწორია, დაადასტურეთ პროფილის შექმნა."
      />

      <div className="finderPreview">
        {draft.showPhoto &&
        photoPreview ? (
          <img
            src={
              photoPreview
            }
            className="finderPhoto"
            alt=""
          />
        ) : (
          <div className="finderEmoji">
            {meta.emoji}
          </div>
        )}

        <h2>
          {draft.itemName}
        </h2>

        <PreviewBlock
          title="მფლობელი"
          value={`${draft.ownerFirstName} ${draft.ownerLastName}`}
        />

        <PreviewBlock
          title="ტელეფონი"
          value={
            draft.ownerPhone
          }
        />

        {draft.showEmail &&
          draft.ownerEmail && (
            <PreviewBlock
              title="ელფოსტა"
              value={
                draft.ownerEmail
              }
            />
          )}

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
              title="ქცევის შესახებ ინფორმაცია"
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

        <div className="previewButtons">
          <button>
            ☎ დარეკვა
          </button>

          {draft.liveChatEnabled && (
            <button>
              Live Chat
            </button>
          )}
        </div>
      </div>

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

function Title({
  step,
  title,
  text,
}: {
  step: string;
  title: string;
  text: string;
}) {
  return (
    <div className="stepTitle">
      <span>
        {step}
      </span>

      <h1>
        {title}
      </h1>

      <p>
        {text}
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
    (value: boolean) =>
      void;
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
            ? "on"
            : ""
        }
      >
        {checked
          ? "ON"
          : "OFF"}
      </b>
    </button>
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
    <div className="previewBlock">
      <span>
        {title}
      </span>

      <strong>
        {value}
      </strong>
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
        padding: 0 18px 50px;
        background: #0647c8;
      }

      .emojiLayer {
        position: fixed;
        inset: 0;
        pointer-events: none;
      }

      .emojiLayer span {
        position: absolute;
        opacity: .055;
        font-size: 70px;
      }

      .header {
        position: relative;
        z-index: 2;
        max-width: 920px;
        min-height: 70px;
        margin: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid rgba(255,255,255,.2);
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 10px;
        color: white;
        text-decoration: none;
      }

      .brandMark {
        width: 42px;
        height: 42px;
        display: grid;
        place-items: center;
        background: white;
        color: #0647c8;
        border-radius: 11px;
        font-weight: 950;
      }

      .changeProduct {
        color: white;
        border: 1px solid rgba(255,255,255,.3);
        padding: 10px 14px;
        border-radius: 9px;
        text-decoration: none;
        font-size: 13px;
      }

      .progress {
        position: relative;
        z-index: 2;
        max-width: 620px;
        margin: 24px auto 0;
        display: flex;
        align-items: center;
      }

      .progressPiece {
        flex: 1;
        display: flex;
        align-items: center;
      }

      .progressPiece:last-child {
        flex: 0;
      }

      .progressStep {
        display: flex;
        align-items: center;
        gap: 7px;
        color: rgba(255,255,255,.55);
        font-size: 13px;
        font-weight: 800;
        white-space: nowrap;
      }

      .progressStep b {
        width: 31px;
        height: 31px;
        display: grid;
        place-items: center;
        border: 1px solid rgba(255,255,255,.35);
        border-radius: 50%;
      }

      .progressStep.active,
      .progressStep.complete {
        color: white;
      }

      .progressStep.active b,
      .progressStep.complete b {
        background: white;
        color: #0647c8;
      }

      .progressLine {
        flex: 1;
        height: 2px;
        margin: 0 10px;
        background: rgba(255,255,255,.2);
      }

      .progressLine.complete {
        background: white;
      }

      .marketingLine {
        position: relative;
        z-index: 2;
        max-width: 820px;
        margin: 20px auto 15px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 11px;
        text-align: center;
        color: white;
      }

      .marketingLine > span {
        font-size: 34px;
      }

      .marketingLine strong {
        display: block;
        font-size: 16px;
      }

      .marketingLine p {
        margin: 4px 0 0;
        color: rgba(255,255,255,.72);
        font-size: 13px;
      }

      .card {
        position: relative;
        z-index: 2;
        max-width: 880px;
        margin: auto;
        padding: 25px;
        border-radius: 20px;
        background: white;
        box-shadow: 0 25px 60px rgba(0,25,80,.28);
      }

      .errorBox {
        margin-bottom: 15px;
        padding: 13px;
        border-radius: 9px;
        background: #fff0f2;
        color: #a33e49;
        font-size: 14px;
      }

      .stepTitle span {
        color: #0647c8;
        font-size: 12px;
        font-weight: 900;
      }

      .stepTitle h1 {
        margin: 5px 0 0;
        color: #203a55;
        font-size: 26px;
      }

      .stepTitle p {
        margin: 6px 0 0;
        color: #718397;
        font-size: 14px;
      }

      .formGrid {
        margin-top: 18px;
        display: grid;
        grid-template-columns: repeat(2,minmax(0,1fr));
        gap: 12px;
      }

      .formGrid.three {
        grid-template-columns: repeat(3,minmax(0,1fr));
      }

      .field.full {
        grid-column: 1 / -1;
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
        border: 1px solid #d5e0eb;
        border-radius: 9px;
        font: inherit;
        font-size: 14px;
        outline: none;
      }

      .field input,
      .field select {
        height: 44px;
        padding: 0 12px;
      }

      .field textarea {
        padding: 10px 12px;
        resize: vertical;
      }

      .photoSection {
        margin-top: 18px;
        padding-top: 18px;
        border-top: 1px solid #e4ebf3;
      }

      .photoSection h2 {
        margin: 0;
        color: #29445f;
        font-size: 18px;
      }

      .photoSection p {
        margin: 4px 0 12px;
        color: #74869a;
        font-size: 13px;
      }

      .uploadBox {
        min-height: 115px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border: 2px dashed #b9cce4;
        border-radius: 12px;
        background: #f7faff;
        cursor: pointer;
      }

      .uploadBox input,
      .photoActions input {
        display: none;
      }

      .uploadPlus {
        width: 36px;
        height: 36px;
        display: grid;
        place-items: center;
        border-radius: 50%;
        background: #0647c8;
        color: white;
        font-size: 23px;
      }

      .uploadBox strong {
        margin-top: 7px;
        color: #29445f;
        font-size: 14px;
      }

      .uploadBox span {
        margin-top: 3px;
        color: #8090a1;
        font-size: 12px;
      }

      .photoPreviewBox {
        display: grid;
        grid-template-columns: 130px 1fr;
        gap: 14px;
        align-items: center;
      }

      .photoPreviewBox img {
        width: 130px;
        height: 100px;
        object-fit: cover;
        border-radius: 12px;
      }

      .photoActions {
        display: flex;
        gap: 8px;
      }

      .photoActions label,
      .photoActions button {
        padding: 10px 13px;
        border-radius: 9px;
        font: inherit;
        font-size: 13px;
        font-weight: 800;
        cursor: pointer;
      }

      .photoActions label {
        background: #0647c8;
        color: white;
      }

      .photoActions button {
        border: 1px solid #d5e0eb;
        background: white;
        color: #66798e;
      }

      .photoVisibility {
        margin-top: 10px;
        border: 0;
        background: #eef5ff;
        color: #42627f;
        padding: 9px 11px;
        border-radius: 8px;
        cursor: pointer;
      }

      .visibility {
        margin-top: 18px;
        padding-top: 17px;
        border-top: 1px solid #e4ebf3;
      }

      .visibility h2 {
        margin: 0;
        color: #29445f;
        font-size: 18px;
      }

      .toggleGrid {
        margin-top: 12px;
        display: grid;
        grid-template-columns: repeat(3,minmax(0,1fr));
        gap: 8px;
      }

      .toggle {
        min-height: 48px;
        padding: 0 11px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border: 1px solid #dce5ef;
        border-radius: 9px;
        background: white;
        color: #405972;
        font: inherit;
        font-size: 13px;
        cursor: pointer;
      }

      .toggle b {
        padding: 5px 8px;
        border-radius: 999px;
        background: #e5ebf2;
        color: #748599;
        font-size: 10px;
      }

      .toggle b.on {
        background: #0647c8;
        color: white;
      }

      .actions {
        margin-top: 21px;
        display: flex;
        justify-content: space-between;
        gap: 9px;
      }

      .actions.right {
        justify-content: flex-end;
      }

      .actions button {
        min-height: 45px;
        padding: 0 17px;
        border-radius: 9px;
        font: inherit;
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
        border: 1px solid #cad7e5;
        background: white;
        color: #607489;
      }

      .finderPreview {
        max-width: 600px;
        margin: 20px auto 0;
        padding: 18px;
        border: 1px solid #d6e2ee;
        border-radius: 15px;
        text-align: center;
      }

      .finderPhoto {
        width: 130px;
        height: 130px;
        object-fit: cover;
        border-radius: 50%;
      }

      .finderEmoji {
        width: 80px;
        height: 80px;
        margin: auto;
        display: grid;
        place-items: center;
        border-radius: 50%;
        background: #0647c8;
        font-size: 38px;
      }

      .finderPreview h2 {
        color: #29445f;
      }

      .previewBlock {
        margin-top: 8px;
        padding: 11px;
        border-radius: 9px;
        background: #f7faff;
        text-align: left;
      }

      .previewBlock span,
      .previewBlock strong {
        display: block;
      }

      .previewBlock span {
        color: #8190a1;
        font-size: 11px;
      }

      .previewBlock strong {
        margin-top: 4px;
        color: #314b66;
        font-size: 13px;
      }

      .previewButtons {
        margin-top: 12px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }

      .previewButtons button {
        min-height: 42px;
        border: 0;
        border-radius: 9px;
        background: #0647c8;
        color: white;
        font-weight: 800;
      }

      @media(max-width:700px) {
        .formGrid,
        .formGrid.three,
        .toggleGrid {
          grid-template-columns: 1fr;
        }

        .photoPreviewBox {
          grid-template-columns: 1fr;
        }

        .progressStep span {
          display: none;
        }
      }
    `}</style>
  );
}
