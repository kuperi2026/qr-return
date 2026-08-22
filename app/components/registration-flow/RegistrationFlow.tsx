"use client";

import {
  type ChangeEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createClient,
  type SupabaseClient,
} from "@supabase/supabase-js";

import RegistrationProgress from "./RegistrationProgress";
import OwnerStep from "./OwnerStep";
import ProductStep from "./ProductStep";
import FinderPreviewStep from "./FinderPreviewStep";

import {
  INITIAL_DRAFT,
  type ProductType,
  type RegistrationDraft,
  type RegistrationStep,
} from "./registrationTypes";

import {
  PRODUCT_META,
  isKeysType,
  isPetType,
} from "./productConfig";

type RegistrationFlowProps = {
  type: ProductType;
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

  return createClient(
    url,
    key
  );
}

function getFileExtension(
  file: File
) {
  const extension =
    file.name
      .split(".")
      .pop()
      ?.toLowerCase();

  if (
    extension === "jpg" ||
    extension === "jpeg"
  ) {
    return "jpg";
  }

  if (
    extension === "png"
  ) {
    return "png";
  }

  if (
    extension === "webp"
  ) {
    return "webp";
  }

  return "jpg";
}

export default function RegistrationFlow({
  type,
}: RegistrationFlowProps) {
  const meta =
    PRODUCT_META[type];

  const isPet =
    isPetType(type);

  const isKeys =
    isKeysType(type);

  const isBag =
    type === "bag";

  const isSuitcase =
    type === "suitcase";

  const [
    step,
    setStep,
  ] =
    useState<RegistrationStep>(
      1
    );

  const [
    draft,
    setDraft,
  ] =
    useState<RegistrationDraft>(
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
          data: {
            user,
          },
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

        let email =
          String(
            user.email ||
              ""
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
          console.error(
            "Owner account:",
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
          "Account load error:",
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

  function updateDraft<
    K extends keyof RegistrationDraft
  >(
    key: K,
    value: RegistrationDraft[K]
  ) {
    setDraft(
      (current) => ({
        ...current,
        [key]: value,
      })
    );
  }

  function goTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handlePhotoChange(
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
      5 *
      1024 *
      1024;

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

    setPhotoFile(
      file
    );

    setPhotoPreview(
      preview
    );

    updateDraft(
      "showPhoto",
      true
    );
  }

  function handlePhotoRemove() {
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

  async function uploadPhoto(
    client: SupabaseClient,
    userId: string
  ) {
    if (!photoFile) {
      return null;
    }

    const extension =
      getFileExtension(
        photoFile
      );

    const randomId =
      typeof crypto !==
        "undefined" &&
      "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random()
            .toString(36)
            .slice(2);

    const path =
      `${userId}/${type}/${Date.now()}-${randomId}.${extension}`;

    const {
      error:
        uploadError,
    } =
      await client.storage
        .from(
          "profile-photos"
        )
        .upload(
          path,
          photoFile,
          {
            upsert: false,

            cacheControl:
              "3600",

            contentType:
              photoFile.type,
          }
        );

    if (
      uploadError
    ) {
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
          path
        );

    return (
      publicData
        .publicUrl ||
      null
    );
  }

  function goToProductStep() {
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

    goTop();
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
        type === "dog"
      ) {
        setErrorMessage(
          "გთხოვთ შეავსოთ ძაღლის შესახებ ინფორმაცია."
        );
      } else if (
        type === "cat"
      ) {
        setErrorMessage(
          "გთხოვთ შეავსოთ კატის შესახებ ინფორმაცია."
        );
      } else {
        setErrorMessage(
          `გთხოვთ შეავსოთ ${meta.label}ს შესახებ ინფორმაცია.`
        );
      }

      return;
    }

    setStep(3);

    goTop();
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
        await client.auth.getUser();

      if (
        userError ||
        !user
      ) {
        throw new Error(
          "ანგარიშთან კავშირი ვერ მოიძებნა. გთხოვთ ხელახლა შეხვიდეთ."
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

      let photoUrl:
        | string
        | null =
        null;

      if (
        photoFile
      ) {
        photoUrl =
          await uploadPhoto(
            client,
            user.id
          );
      }

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
          draft
            .colour
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
          draft
            .showEmail,

        show_pet_photo:
          draft
            .showPhoto,

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
          .from(
            "item"
          )
          .insert(
            payload
          )
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
      <>
        <main className="loadingPage">
          <div className="loadingEmoji">
            {meta.emoji}
          </div>

          <strong>
            QR RETURN
          </strong>

          <span>
            იტვირთება...
          </span>
        </main>

        <style jsx>{`
          .loadingPage {
            min-height: 100vh;

            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            gap: 9px;

            background: #0647c8;

            color: #ffffff;
          }

          .loadingEmoji {
            font-size: 46px;
          }

          .loadingPage strong {
            font-size: 18px;
          }

          .loadingPage span {
            font-size: 14px;

            opacity: 0.75;
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <main className="registrationPage">
        <div
          className="emojiBackground"
          aria-hidden="true"
        >
          {backgroundItems.map(
            (
              _,
              index
            ) => (
              <span
                key={index}
                style={{
                  left: `${
                    (index *
                      31) %
                    100
                  }%`,

                  top: `${
                    (index *
                      43) %
                    100
                  }%`,

                  transform: `rotate(${
                    index *
                    18
                  }deg)`,
                }}
              >
                {meta.emoji}
              </span>
            )
          )}
        </div>

        <header className="registrationHeader">
          <a
            href="/"
            className="brand"
          >
            <span className="brandMark">
              QR
            </span>

            <span className="brandText">
              <strong>
                QR RETURN
              </strong>

              <small>
                SMART LOST &amp; FOUND
              </small>
            </span>
          </a>

          <a
            href="/register"
            className="changeProduct"
          >
            სხვა პროდუქტი
          </a>
        </header>

        <RegistrationProgress
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

        <section className="registrationCard">
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
              onNext={
                goToProductStep
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
                handlePhotoChange
              }
              onPhotoRemove={
                handlePhotoRemove
              }
              onBack={() => {
                setStep(1);

                goTop();
              }}
              onNext={
                goToPreview
              }
            />
          )}

          {step === 3 && (
            <FinderPreviewStep
              type={type}
              meta={meta}
              draft={draft}
              photoPreview={
                photoPreview
              }
              onBack={() => {
                setStep(2);

                goTop();
              }}
              onConfirm={
                createProfile
              }
              saving={
                saving
              }
            />
          )}
        </section>
      </main>

      <style jsx>{`
        .registrationPage {
          position: relative;

          min-height: 100vh;

          overflow: hidden;

          padding:
            0 20px 50px;

          background: #0647c8;
        }

        .emojiBackground {
          position: fixed;

          inset: 0;

          overflow: hidden;

          pointer-events: none;
        }

        .emojiBackground span {
          position: absolute;

          opacity: 0.055;

          font-size: 72px;

          filter:
            grayscale(1)
            brightness(5);
        }

        .registrationHeader {
          position: relative;

          z-index: 2;

          width: 100%;

          max-width: 960px;

          min-height: 72px;

          margin: 0 auto;

          display: flex;

          align-items: center;

          justify-content:
            space-between;

          gap: 20px;

          border-bottom:
            1px solid
            rgba(
              255,
              255,
              255,
              0.2
            );
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

          background: #ffffff;

          color: #0647c8;

          font-size: 13px;

          font-weight: 950;
        }

        .brandText strong,
        .brandText small {
          display: block;
        }

        .brandText strong {
          color: #ffffff;

          font-size: 18px;

          font-weight: 900;
        }

        .brandText small {
          margin-top: 2px;

          color:
            rgba(
              255,
              255,
              255,
              0.7
            );

          font-size: 11px;
        }

        .changeProduct {
          padding:
            10px 14px;

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.3
            );

          border-radius: 9px;

          color: #ffffff;

          font-size: 13px;

          font-weight: 800;

          text-decoration: none;
        }

        .marketingLine {
          position: relative;

          z-index: 2;

          width: 100%;

          max-width: 830px;

          margin:
            22px auto 16px;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 12px;

          color: #ffffff;

          text-align: center;
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
            rgba(
              255,
              255,
              255,
              0.72
            );

          font-size: 13px;
        }

        .registrationCard {
          position: relative;

          z-index: 2;

          width: 100%;

          max-width: 880px;

          margin: 0 auto;

          padding: 26px;

          border-radius: 20px;

          background: #ffffff;

          box-shadow:
            0 25px 60px
            rgba(
              0,
              24,
              77,
              0.28
            );
        }

        .errorBox {
          margin-bottom: 17px;

          padding:
            13px 14px;

          border-radius: 10px;

          background: #fff0f2;

          color: #a53e49;

          font-size: 14px;

          font-weight: 700;
        }

        @media (
          max-width: 600px
        ) {
          .registrationPage {
            padding:
              0 13px 30px;
          }

          .brandText small {
            display: none;
          }

          .brandText strong {
            font-size: 16px;
          }

          .changeProduct {
            padding:
              9px 11px;

            font-size: 12px;
          }

          .registrationCard {
            padding: 19px;

            border-radius: 16px;
          }

          .marketingLine {
            align-items:
              flex-start;

            text-align: left;
          }

          .marketingLine > span {
            font-size: 30px;
          }

          .marketingLine strong {
            font-size: 14px;
          }

          .marketingLine p {
            font-size: 12px;
          }
        }
      `}</style>
    </>
  );
}
