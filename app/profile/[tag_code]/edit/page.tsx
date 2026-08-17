"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";
import {
  useParams,
  useRouter,
} from "next/navigation";
import { supabase } from "@/lib/supabase";

type Profile = {
  tag_code: string;
  item_type: string;
  item_name: string | null;
  colour: string | null;

  sex: string | null;
  date_of_birth: string | null;
  weight: number | null;
  medical_info: string | null;

  brand: string | null;
  model: string | null;
  size: string | null;
  material: string | null;
  distinctive_features: string | null;
  description: string | null;

  photo_url: string | null;
  owner_photo_url: string | null;

  owner_name: string | null;
  owner_phone: string | null;
  owner_email: string | null;

  additional_contact_name: string | null;
  additional_contact_phone: string | null;
  additional_contact_email: string | null;

  finder_message: string | null;

  phone_enabled: boolean | null;
  whatsapp_enabled: boolean | null;
  live_chat_enabled: boolean | null;

  location_sharing_enabled: boolean | null;

  show_colour: boolean;
  show_sex: boolean;
  show_date_of_birth: boolean;
  show_weight: boolean;
  show_medical_info: boolean;

  show_brand: boolean;
  show_model: boolean;
  show_size: boolean;
  show_material: boolean;
  show_distinctive_features: boolean;
  show_description: boolean;

  show_photo: boolean;
  show_owner_photo: boolean;

  show_owner_phone: boolean;
  show_owner_email: boolean;

  show_additional_contact: boolean;

  show_finder_message: boolean;
  show_lost_seen_location: boolean;

  lost_seen_location: string | null;
};

type FormState = {
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

  owner_name: string;
  owner_phone: string;
  owner_email: string;

  additional_contact_name: string;
  additional_contact_phone: string;
  additional_contact_email: string;

  finder_message: string;
  lost_seen_location: string;
};

type VisibilityState = {
  show_colour: boolean;
  show_sex: boolean;
  show_date_of_birth: boolean;
  show_weight: boolean;
  show_medical_info: boolean;

  show_brand: boolean;
  show_model: boolean;
  show_size: boolean;
  show_material: boolean;
  show_distinctive_features: boolean;
  show_description: boolean;

  show_photo: boolean;
  show_owner_photo: boolean;

  show_owner_phone: boolean;
  show_owner_email: boolean;

  show_additional_contact: boolean;

  show_finder_message: boolean;
  show_lost_seen_location: boolean;
};

const BUCKET = "qr-return-images";

const MAX_IMAGE_SIZE =
  5 * 1024 * 1024;

const emptyForm: FormState = {
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

  owner_name: "",
  owner_phone: "",
  owner_email: "",

  additional_contact_name: "",
  additional_contact_phone: "",
  additional_contact_email: "",

  finder_message: "",
  lost_seen_location: "",
};

const defaultVisibility: VisibilityState = {
  show_colour: true,
  show_sex: true,
  show_date_of_birth: false,
  show_weight: false,
  show_medical_info: false,

  show_brand: true,
  show_model: true,
  show_size: false,
  show_material: false,
  show_distinctive_features: true,
  show_description: true,

  show_photo: true,
  show_owner_photo: false,

  show_owner_phone: true,
  show_owner_email: false,

  show_additional_contact: false,

  show_finder_message: true,
  show_lost_seen_location: true,
};

function cleanTag(tag: string) {
  return tag
    .trim()
    .replace(
      /[^a-zA-Z0-9_-]/g,
      "-"
    );
}

function safeExtension(
  file: File
) {
  const extension =
    file.name
      .split(".")
      .pop()
      ?.toLowerCase() ||
    "jpg";

  const allowed = [
    "jpg",
    "jpeg",
    "png",
    "webp",
    "gif",
    "heic",
    "heif",
  ];

  return allowed.includes(
    extension
  )
    ? extension
    : "jpg";
}

async function uploadImage(
  file: File,
  folder:
    | "items"
    | "owners",
  tagCode: string
) {
  if (
    !file.type.startsWith(
      "image/"
    )
  ) {
    throw new Error(
      "INVALID_IMAGE_TYPE"
    );
  }

  if (
    file.size >
    MAX_IMAGE_SIZE
  ) {
    throw new Error(
      "IMAGE_TOO_LARGE"
    );
  }

  const extension =
    safeExtension(file);

  const uniquePart =
    typeof crypto !==
      "undefined" &&
    "randomUUID" in
      crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}`;

  const filePath =
    `${folder}/${cleanTag(
      tagCode
    )}-${uniquePart}.${extension}`;

  const {
    error: uploadError,
  } = await supabase.storage
    .from(BUCKET)
    .upload(
      filePath,
      file,
      {
        cacheControl:
          "3600",
        contentType:
          file.type,
        upsert: false,
      }
    );

  if (uploadError) {
    throw uploadError;
  }

  const { data } =
    supabase.storage
      .from(BUCKET)
      .getPublicUrl(
        filePath
      );

  return data.publicUrl;
}

export default function EditProfilePage() {
  const params =
    useParams();

  const router =
    useRouter();

  const rawTag =
    params?.tag_code;

  const tagCode =
    Array.isArray(rawTag)
      ? rawTag[0]
      : typeof rawTag ===
        "string"
      ? rawTag
      : "";

  const [
    profile,
    setProfile,
  ] =
    useState<Profile | null>(
      null
    );

  const [form, setForm] =
    useState<FormState>(
      emptyForm
    );

  const [
    visibility,
    setVisibility,
  ] =
    useState<VisibilityState>(
      defaultVisibility
    );

  const [
    locationSharingEnabled,
    setLocationSharingEnabled,
  ] = useState(false);

  const [
    phoneEnabled,
    setPhoneEnabled,
  ] = useState(true);

  const [
    whatsappEnabled,
    setWhatsappEnabled,
  ] = useState(false);

  const [
    liveChatEnabled,
    setLiveChatEnabled,
  ] = useState(true);

  const [
    itemPhoto,
    setItemPhoto,
  ] =
    useState<File | null>(
      null
    );

  const [
    ownerPhoto,
    setOwnerPhoto,
  ] =
    useState<File | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  useEffect(() => {
    async function loadProfile() {
      if (!tagCode) {
        setError(
          "QR კოდი ვერ მოიძებნა."
        );

        setLoading(false);
        return;
      }

      const decodedTag =
        decodeURIComponent(
          tagCode
        );

      const {
        data,
        error:
          fetchError,
      } = await supabase
        .from("item")
        .select("*")
        .eq(
          "tag_code",
          decodedTag
        )
        .maybeSingle();

      if (fetchError) {
        setError(
          `პროფილის ჩატვირთვა ვერ მოხერხდა: ${fetchError.message}`
        );

        setLoading(false);
        return;
      }

      if (!data) {
        setError(
          "ამ QR კოდზე პროფილი არ მოიძებნა."
        );

        setLoading(false);
        return;
      }

      const current =
        data as Profile;

      setProfile(
        current
      );

      setForm({
        item_name:
          current.item_name ||
          "",

        colour:
          current.colour ||
          "",

        sex:
          current.sex || "",

        date_of_birth:
          current.date_of_birth ||
          "",

        weight:
          current.weight !==
            null &&
          current.weight !==
            undefined
            ? String(
                current.weight
              )
            : "",

        medical_info:
          current.medical_info ||
          "",

        brand:
          current.brand || "",

        model:
          current.model || "",

        size:
          current.size || "",

        material:
          current.material ||
          "",

        distinctive_features:
          current.distinctive_features ||
          "",

        description:
          current.description ||
          "",

        owner_name:
          current.owner_name ||
          "",

        owner_phone:
          current.owner_phone ||
          "",

        owner_email:
          current.owner_email ||
          "",

        additional_contact_name:
          current.additional_contact_name ||
          "",

        additional_contact_phone:
          current.additional_contact_phone ||
          "",

        additional_contact_email:
          current.additional_contact_email ||
          "",

        finder_message:
          current.finder_message ||
          "",

        lost_seen_location:
          current.lost_seen_location ||
          "",
      });

      setVisibility({
        show_colour:
          current.show_colour ??
          true,

        show_sex:
          current.show_sex ??
          true,

        show_date_of_birth:
          current.show_date_of_birth ??
          false,

        show_weight:
          current.show_weight ??
          false,

        show_medical_info:
          current.show_medical_info ??
          false,

        show_brand:
          current.show_brand ??
          true,

        show_model:
          current.show_model ??
          true,

        show_size:
          current.show_size ??
          false,

        show_material:
          current.show_material ??
          false,

        show_distinctive_features:
          current.show_distinctive_features ??
          true,

        show_description:
          current.show_description ??
          true,

        show_photo:
          current.show_photo ??
          true,

        show_owner_photo:
          current.show_owner_photo ??
          false,

        show_owner_phone:
          current.show_owner_phone ??
          true,

        show_owner_email:
          current.show_owner_email ??
          false,

        show_additional_contact:
          current.show_additional_contact ??
          false,

        show_finder_message:
          current.show_finder_message ??
          true,

        show_lost_seen_location:
          current.show_lost_seen_location ??
          true,
      });

      setPhoneEnabled(
        current.phone_enabled ??
          true
      );

      setWhatsappEnabled(
        current.whatsapp_enabled ??
          false
      );

      setLiveChatEnabled(
        current.live_chat_enabled ??
          true
      );

      setLocationSharingEnabled(
        Boolean(
          current.location_sharing_enabled
        )
      );

      setLoading(false);
    }

    loadProfile();
  }, [tagCode]);

  function updateField(
    field: keyof FormState,
    value: string
  ) {
    setForm(
      (current) => ({
        ...current,
        [field]: value,
      })
    );
  }

  function toggleVisibility(
    field:
      keyof VisibilityState
  ) {
    setVisibility(
      (current) => ({
        ...current,
        [field]:
          !current[field],
      })
    );
  }

  function validateImage(
    file: File | null
  ) {
    if (!file) {
      return true;
    }

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      setError(
        "გთხოვთ აირჩიოთ სურათის ფაილი."
      );

      return false;
    }

    if (
      file.size >
      MAX_IMAGE_SIZE
    ) {
      setError(
        "ფოტოს ზომა არ უნდა აღემატებოდეს 5 MB-ს."
      );

      return false;
    }

    return true;
  }

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!profile) {
      return;
    }

    setError("");
    setSuccess("");

    if (
      !form.item_name.trim()
    ) {
      setError(
        "სახელი ან ნივთის დასახელება სავალდებულოა."
      );

      return;
    }

    if (
      !form.owner_phone.trim()
    ) {
      setError(
        "მფლობელის ტელეფონი სავალდებულოა."
      );

      return;
    }

    if (
      !form.owner_email.trim()
    ) {
      setError(
        "მფლობელის ელფოსტა სავალდებულოა."
      );

      return;
    }

    if (
      !validateImage(
        itemPhoto
      ) ||
      !validateImage(
        ownerPhoto
      )
    ) {
      return;
    }

    if (
      !phoneEnabled &&
      !whatsappEnabled &&
      !liveChatEnabled
    ) {
      setError(
        "აირჩიე დაკავშირების მინიმუმ ერთი მეთოდი."
      );

      return;
    }

    setSaving(true);

    try {
      let photoUrl =
        profile.photo_url;

      let ownerPhotoUrl =
        profile.owner_photo_url;

      if (itemPhoto) {
        photoUrl =
          await uploadImage(
            itemPhoto,
            "items",
            profile.tag_code
          );
      }

      if (ownerPhoto) {
        ownerPhotoUrl =
          await uploadImage(
            ownerPhoto,
            "owners",
            profile.tag_code
          );
      }

      const isPet =
        profile.item_type ===
          "dog" ||
        profile.item_type ===
          "cat";

      const payload = {
        item_name:
          form.item_name.trim(),

        colour:
          form.colour.trim() ||
          null,

        sex:
          isPet
            ? form.sex ||
              null
            : null,

        date_of_birth:
          isPet
            ? form.date_of_birth ||
              null
            : null,

        weight:
          isPet &&
          form.weight.trim()
            ? Number(
                form.weight
              )
            : null,

        medical_info:
          isPet
            ? form.medical_info.trim() ||
              null
            : null,

        brand:
          !isPet
            ? form.brand.trim() ||
              null
            : null,

        model:
          !isPet
            ? form.model.trim() ||
              null
            : null,

        size:
          !isPet
            ? form.size.trim() ||
              null
            : null,

        material:
          !isPet
            ? form.material.trim() ||
              null
            : null,

        distinctive_features:
          !isPet
            ? form.distinctive_features.trim() ||
              null
            : null,

        description:
          form.description.trim() ||
          null,

        photo_url:
          photoUrl,

        owner_photo_url:
          ownerPhotoUrl,

        owner_name:
          form.owner_name.trim() ||
          null,

        owner_phone:
          form.owner_phone.trim(),

        owner_email:
          form.owner_email.trim(),

        additional_contact_name:
          form.additional_contact_name.trim() ||
          null,

        additional_contact_phone:
          form.additional_contact_phone.trim() ||
          null,

        additional_contact_email:
          form.additional_contact_email.trim() ||
          null,

        finder_message:
          form.finder_message.trim() ||
          null,

        lost_seen_location:
          form.lost_seen_location.trim() ||
          null,

        phone_enabled:
          phoneEnabled,

        whatsapp_enabled:
          whatsappEnabled,

        live_chat_enabled:
          liveChatEnabled,

        location_sharing_enabled:
          locationSharingEnabled,

        ...visibility,
      };

      const {
        error:
          updateError,
      } = await supabase
        .from("item")
        .update(payload)
        .eq(
          "tag_code",
          profile.tag_code
        );

      if (updateError) {
        setError(
          `ცვლილებების შენახვა ვერ მოხერხდა: ${updateError.message}`
        );

        setSaving(false);
        return;
      }

      setSuccess(
        "ცვლილებები წარმატებით შეინახა."
      );

      setTimeout(() => {
        router.push(
          `/profile/${encodeURIComponent(
            profile.tag_code
          )}`
        );
      }, 800);
    } catch (err) {
      console.error(err);

      setError(
        "ცვლილებების შენახვისას დაფიქსირდა შეცდომა."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <>
        <main className="center">
          <h1>
            QR RETURN
          </h1>

          <p>
            პროფილი იტვირთება...
          </p>
        </main>

        <Styles />
      </>
    );
  }

  if (
    error &&
    !profile
  ) {
    return (
      <>
        <main className="center">
          <h1>
            QR RETURN
          </h1>

          <div className="error">
            {error}
          </div>
        </main>

        <Styles />
      </>
    );
  }

  if (!profile) {
    return null;
  }

  const isPet =
    profile.item_type ===
      "dog" ||
    profile.item_type ===
      "cat";

  return (
    <>
      <main className="page">
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
                EDIT PROFILE
              </small>
            </div>
          </a>

          <a
            href={`/profile/${encodeURIComponent(
              profile.tag_code
            )}`}
            className="back"
          >
            ← პროფილზე დაბრუნება
          </a>
        </header>

        <section className="content">
          <div className="intro">
            <div>
              <div className="eyebrow">
                QR RETURN
              </div>

              <h1>
                პროფილის რედაქტირება
              </h1>

              <p>
                შეგიძლია დაამატო ის ინფორმაციაც,
                რომელიც რეგისტრაციის დროს არ შეგივსია.
              </p>
            </div>
          </div>

          <div className="locked">
            QR კოდი:{" "}
            <strong>
              {profile.tag_code}
            </strong>

            <span>
              კატეგორია და QR კოდი უცვლელია.
            </span>
          </div>

          <form
            className="card"
            onSubmit={
              handleSubmit
            }
          >
            <SectionTitle
              number="01"
              title={
                isPet
                  ? "ცხოველის სრული ინფორმაცია"
                  : "ნივთის სრული ინფორმაცია"
              }
              text="შეავსე ან შეცვალე ნებისმიერი ინფორმაცია."
            />

            <Field
              label={
                isPet
                  ? "სახელი *"
                  : "ნივთის დასახელება *"
              }
              value={
                form.item_name
              }
              onChange={(
                value
              ) =>
                updateField(
                  "item_name",
                  value
                )
              }
            />

            <OptionalField
              label="ფერი"
              value={
                form.colour
              }
              onChange={(
                value
              ) =>
                updateField(
                  "colour",
                  value
                )
              }
              visible={
                visibility.show_colour
              }
              onToggle={() =>
                toggleVisibility(
                  "show_colour"
                )
              }
            />

            <PhotoEditor
              title={
                isPet
                  ? "ცხოველის ფოტო"
                  : "ნივთის ფოტო"
              }
              currentUrl={
                profile.photo_url
              }
              file={
                itemPhoto
              }
              setFile={
                setItemPhoto
              }
              visible={
                visibility.show_photo
              }
              onToggle={() =>
                toggleVisibility(
                  "show_photo"
                )
              }
            />

            {isPet ? (
              <>
                <OptionalSelect
                  label="სქესი"
                  value={
                    form.sex
                  }
                  onChange={(
                    value
                  ) =>
                    updateField(
                      "sex",
                      value
                    )
                  }
                  visible={
                    visibility.show_sex
                  }
                  onToggle={() =>
                    toggleVisibility(
                      "show_sex"
                    )
                  }
                  options={[
                    {
                      value:
                        "",
                      label:
                        "აირჩიე",
                    },
                    {
                      value:
                        "male",
                      label:
                        "მამრობითი",
                    },
                    {
                      value:
                        "female",
                      label:
                        "მდედრობითი",
                    },
                  ]}
                />

                <OptionalField
                  label="დაბადების თარიღი"
                  type="date"
                  value={
                    form.date_of_birth
                  }
                  onChange={(
                    value
                  ) =>
                    updateField(
                      "date_of_birth",
                      value
                    )
                  }
                  visible={
                    visibility.show_date_of_birth
                  }
                  onToggle={() =>
                    toggleVisibility(
                      "show_date_of_birth"
                    )
                  }
                />

                <OptionalField
                  label="წონა"
                  type="number"
                  value={
                    form.weight
                  }
                  onChange={(
                    value
                  ) =>
                    updateField(
                      "weight",
                      value
                    )
                  }
                  visible={
                    visibility.show_weight
                  }
                  onToggle={() =>
                    toggleVisibility(
                      "show_weight"
                    )
                  }
                />

                <OptionalTextArea
                  label="სამედიცინო ინფორმაცია"
                  value={
                    form.medical_info
                  }
                  onChange={(
                    value
                  ) =>
                    updateField(
                      "medical_info",
                      value
                    )
                  }
                  visible={
                    visibility.show_medical_info
                  }
                  onToggle={() =>
                    toggleVisibility(
                      "show_medical_info"
                    )
                  }
                />
              </>
            ) : (
              <>
                <OptionalField
                  label="ბრენდი"
                  value={
                    form.brand
                  }
                  onChange={(
                    value
                  ) =>
                    updateField(
                      "brand",
                      value
                    )
                  }
                  visible={
                    visibility.show_brand
                  }
                  onToggle={() =>
                    toggleVisibility(
                      "show_brand"
                    )
                  }
                />

                <OptionalField
                  label="მოდელი"
                  value={
                    form.model
                  }
                  onChange={(
                    value
                  ) =>
                    updateField(
                      "model",
                      value
                    )
                  }
                  visible={
                    visibility.show_model
                  }
                  onToggle={() =>
                    toggleVisibility(
                      "show_model"
                    )
                  }
                />

                <OptionalField
                  label="ზომა"
                  value={
                    form.size
                  }
                  onChange={(
                    value
                  ) =>
                    updateField(
                      "size",
                      value
                    )
                  }
                  visible={
                    visibility.show_size
                  }
                  onToggle={() =>
                    toggleVisibility(
                      "show_size"
                    )
                  }
                />

                <OptionalField
                  label="მასალა"
                  value={
                    form.material
                  }
                  onChange={(
                    value
                  ) =>
                    updateField(
                      "material",
                      value
                    )
                  }
                  visible={
                    visibility.show_material
                  }
                  onToggle={() =>
                    toggleVisibility(
                      "show_material"
                    )
                  }
                />

                <OptionalTextArea
                  label="განმასხვავებელი ნიშნები"
                  value={
                    form.distinctive_features
                  }
                  onChange={(
                    value
                  ) =>
                    updateField(
                      "distinctive_features",
                      value
                    )
                  }
                  visible={
                    visibility.show_distinctive_features
                  }
                  onToggle={() =>
                    toggleVisibility(
                      "show_distinctive_features"
                    )
                  }
                />
              </>
            )}

            <OptionalTextArea
              label="დამატებითი აღწერა"
              value={
                form.description
              }
              onChange={(
                value
              ) =>
                updateField(
                  "description",
                  value
                )
              }
              visible={
                visibility.show_description
              }
              onToggle={() =>
                toggleVisibility(
                  "show_description"
                )
              }
            />

            <div className="divider" />

            <SectionTitle
              number="02"
              title="მფლობელის ინფორმაცია"
              text="სავალდებულო მონაცემები და კონფიდენციალურობის კონტროლი."
            />

            <Field
              label="სახელი და გვარი"
              value={
                form.owner_name
              }
              onChange={(
                value
              ) =>
                updateField(
                  "owner_name",
                  value
                )
              }
            />

            <RequiredVisibilityField
              label="ტელეფონი *"
              type="tel"
              value={
                form.owner_phone
              }
              onChange={(
                value
              ) =>
                updateField(
                  "owner_phone",
                  value
                )
              }
              visible={
                visibility.show_owner_phone
              }
              onToggle={() =>
                toggleVisibility(
                  "show_owner_phone"
                )
              }
            />

            <RequiredVisibilityField
              label="ელფოსტა *"
              type="email"
              value={
                form.owner_email
              }
              onChange={(
                value
              ) =>
                updateField(
                  "owner_email",
                  value
                )
              }
              visible={
                visibility.show_owner_email
              }
              onToggle={() =>
                toggleVisibility(
                  "show_owner_email"
                )
              }
            />

            <PhotoEditor
              title="მფლობელის ფოტო"
              currentUrl={
                profile.owner_photo_url
              }
              file={
                ownerPhoto
              }
              setFile={
                setOwnerPhoto
              }
              visible={
                visibility.show_owner_photo
              }
              onToggle={() =>
                toggleVisibility(
                  "show_owner_photo"
                )
              }
            />

            <div className="contactMethods">
              <div className="contactMethodsHeader">
                <strong>
                  დაკავშირების მეთოდები
                </strong>

                <p>
                  მონიშნე ერთი, ორი ან სამივე.
                </p>
              </div>

              <ContactMethod
                icon="📞"
                title="მობილური"
                description="მპოვნელს შეუძლია პირდაპირ დაგირეკოს."
                active={
                  phoneEnabled
                }
                onClick={() =>
                  setPhoneEnabled(
                    !phoneEnabled
                  )
                }
              />

              <ContactMethod
                icon="🟢"
                title="WhatsApp"
                description="WhatsApp გამოიყენებს შენს მითითებულ მობილურის ნომერს."
                active={
                  whatsappEnabled
                }
                onClick={() =>
                  setWhatsappEnabled(
                    !whatsappEnabled
                  )
                }
              />

              <ContactMethod
                icon="💬"
                title="Live Chat"
                description="მპოვნელს შეუძლია დაგიკავშირდეს QR Return-ის Live Chat-ით."
                active={
                  liveChatEnabled
                }
                onClick={() =>
                  setLiveChatEnabled(
                    !liveChatEnabled
                  )
                }
              />
            </div>

            <div className="optionalGroup">
              <div className="optionalHeader">
                <div>
                  <strong>
                    დამატებითი საკონტაქტო პირი
                  </strong>

                  <p>
                    მაგალითად ოჯახის წევრი ან მეგობარი.
                  </p>
                </div>

                <VisibilityToggle
                  active={
                    visibility.show_additional_contact
                  }
                  onClick={() =>
                    toggleVisibility(
                      "show_additional_contact"
                    )
                  }
                />
              </div>

              <Field
                label="სახელი და გვარი"
                value={
                  form.additional_contact_name
                }
                onChange={(
                  value
                ) =>
                  updateField(
                    "additional_contact_name",
                    value
                  )
                }
              />

              <Field
                label="ტელეფონი"
                type="tel"
                value={
                  form.additional_contact_phone
                }
                onChange={(
                  value
                ) =>
                  updateField(
                    "additional_contact_phone",
                    value
                  )
                }
              />

              <Field
                label="ელფოსტა"
                type="email"
                value={
                  form.additional_contact_email
                }
                onChange={(
                  value
                ) =>
                  updateField(
                    "additional_contact_email",
                    value
                  )
                }
              />
            </div>

            <div className="divider" />

            <SectionTitle
              number="03"
              title="ინფორმაცია მპოვნელისთვის"
              text="შენ თვითონ აკონტროლებ რას ნახავს მპოვნელი."
            />

            <OptionalTextArea
              label="შეტყობინება მპოვნელისთვის"
              value={
                form.finder_message
              }
              onChange={(
                value
              ) =>
                updateField(
                  "finder_message",
                  value
                )
              }
              visible={
                visibility.show_finder_message
              }
              onToggle={() =>
                toggleVisibility(
                  "show_finder_message"
                )
              }
            />

            <OptionalField
              label="ბოლო ნანახი ადგილი"
              value={
                form.lost_seen_location
              }
              onChange={(
                value
              ) =>
                updateField(
                  "lost_seen_location",
                  value
                )
              }
              visible={
                visibility.show_lost_seen_location
              }
              onToggle={() =>
                toggleVisibility(
                  "show_lost_seen_location"
                )
              }
            />

            <div className="locationBox">
              <div>
                <strong>
                  ლოკაციის გაზიარება
                </strong>

                <p>
                  მპოვნელმა სურვილის შემთხვევაში შეძლოს თავისი მიმდინარე ლოკაციის გამოგზავნა.
                </p>
              </div>

              <VisibilityToggle
                active={
                  locationSharingEnabled
                }
                onClick={() =>
                  setLocationSharingEnabled(
                    !locationSharingEnabled
                  )
                }
              />
            </div>

            {error && (
              <div className="error">
                {error}
              </div>
            )}

            {success && (
              <div className="success">
                {success}
              </div>
            )}

            <div className="actions">
              <a
                href={`/profile/${encodeURIComponent(
                  profile.tag_code
                )}`}
                className="cancelButton"
              >
                გაუქმება
              </a>

              <button
                type="submit"
                className="saveButton"
                disabled={
                  saving
                }
              >
                {saving
                  ? "ინახება..."
                  : "ცვლილებების შენახვა"}
              </button>
            </div>
          </form>
        </section>

        <Styles />
      </main>
    </>
  );
}

function SectionTitle({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="sectionTitle">
      <b>
        {number}
      </b>

      <div>
        <h2>
          {title}
        </h2>

        <p>
          {text}
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  type?: string;
}) {
  return (
    <label className="field">
      <span>
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(
          event
        ) =>
          onChange(
            event.target.value
          )
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
  onChange: (
    value: string
  ) => void;
  options: {
    value: string;
    label: string;
  }[];
}) {
  return (
    <label className="field">
      <span>
        {label}
      </span>

      <select
        value={value}
        onChange={(
          event
        ) =>
          onChange(
            event.target.value
          )
        }
      >
        {options.map(
          (option) => (
            <option
              key={
                option.value ||
                "empty"
              }
              value={
                option.value
              }
            >
              {option.label}
            </option>
          )
        )}
      </select>
    </label>
  );
}

function OptionalField({
  label,
  value,
  onChange,
  visible,
  onToggle,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  visible: boolean;
  onToggle: () => void;
  type?: string;
}) {
  return (
    <div className="visibilityField">
      <div className="visibilityHeader">
        <span>
          {label}
        </span>

        <VisibilityToggle
          active={
            visible
          }
          onClick={
            onToggle
          }
        />
      </div>

      <input
        type={type}
        value={value}
        onChange={(
          event
        ) =>
          onChange(
            event.target.value
          )
        }
      />

      <small>
        მპოვნელისთვის ჩვენება:{" "}
        <b>
          {visible
            ? "ON"
            : "OFF"}
        </b>
      </small>
    </div>
  );
}

function RequiredVisibilityField({
  label,
  value,
  onChange,
  visible,
  onToggle,
  type,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  visible: boolean;
  onToggle: () => void;
  type: string;
}) {
  return (
    <OptionalField
      label={label}
      type={type}
      value={value}
      onChange={onChange}
      visible={visible}
      onToggle={onToggle}
    />
  );
}

function OptionalSelect({
  label,
  value,
  onChange,
  visible,
  onToggle,
  options,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  visible: boolean;
  onToggle: () => void;
  options: {
    value: string;
    label: string;
  }[];
}) {
  return (
    <div className="visibilityField">
      <div className="visibilityHeader">
        <span>
          {label}
        </span>

        <VisibilityToggle
          active={
            visible
          }
          onClick={
            onToggle
          }
        />
      </div>

      <select
        value={value}
        onChange={(
          event
        ) =>
          onChange(
            event.target.value
          )
        }
      >
        {options.map(
          (option) => (
            <option
              key={
                option.value ||
                "empty"
              }
              value={
                option.value
              }
            >
              {option.label}
            </option>
          )
        )}
      </select>

      <small>
        მპოვნელისთვის ჩვენება:{" "}
        <b>
          {visible
            ? "ON"
            : "OFF"}
        </b>
      </small>
    </div>
  );
}

function OptionalTextArea({
  label,
  value,
  onChange,
  visible,
  onToggle,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="visibilityField">
      <div className="visibilityHeader">
        <span>
          {label}
        </span>

        <VisibilityToggle
          active={
            visible
          }
          onClick={
            onToggle
          }
        />
      </div>

      <textarea
        value={value}
        onChange={(
          event
        ) =>
          onChange(
            event.target.value
          )
        }
      />

      <small>
        მპოვნელისთვის ჩვენება:{" "}
        <b>
          {visible
            ? "ON"
            : "OFF"}
        </b>
      </small>
    </div>
  );
}

function PhotoEditor({
  title,
  currentUrl,
  file,
  setFile,
  visible,
  onToggle,
}: {
  title: string;
  currentUrl:
    | string
    | null;
  file: File | null;
  setFile: (
    value: File | null
  ) => void;
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="photoEditor">
      <div className="visibilityHeader">
        <span>
          {title}
        </span>

        <VisibilityToggle
          active={
            visible
          }
          onClick={
            onToggle
          }
        />
      </div>

      {currentUrl && (
        <img
          src={
            currentUrl
          }
          alt=""
        />
      )}

      <label className="upload">
        <input
          type="file"
          accept="image/*"
          onChange={(
            event
          ) =>
            setFile(
              event.target
                .files?.[0] ||
                null
            )
          }
        />

        {file
          ? `✓ ${file.name}`
          : currentUrl
          ? "ფოტოს შეცვლა"
          : "ფოტოს დამატება"}
      </label>

      <small>
        ფოტო სავალდებულო არ არის • მაქს. 5 MB
      </small>
    </div>
  );
}

function ContactMethod({
  icon,
  title,
  description,
  active,
  onClick,
}: {
  icon: string;
  title: string;
  description: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={
        active
          ? "contactMethod active"
          : "contactMethod"
      }
      onClick={
        onClick
      }
      aria-pressed={
        active
      }
    >
      <div className="contactMethodIcon">
        {icon}
      </div>

      <div className="contactMethodText">
        <strong>
          {title}
        </strong>

        <span>
          {description}
        </span>
      </div>

      <div
        className={
          active
            ? "contactCheck active"
            : "contactCheck"
        }
      >
        {active
          ? "✓"
          : ""}
      </div>
    </button>
  );
}

function VisibilityToggle({
  active,
  onClick,
}: {
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={
        active
          ? "switch active"
          : "switch"
      }
      onClick={
        onClick
      }
    >
      <span />
    </button>
  );
}

function Styles() {
  return (
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
        background: #f8fafc;
        color: #101828;
        font-family: Inter, Arial, sans-serif;
      }

      .header {
        width: calc(100% - 32px);
        max-width: 1050px;
        min-height: 78px;
        margin: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #e8ecf1;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 10px;
        text-decoration: none;
      }

      .logo {
        width: 43px;
        height: 43px;
        display: grid;
        place-items: center;
        border-radius: 13px;
        background: #1465e8;
        color: white;
        font-size: 12px;
        font-weight: 900;
      }

      .brand strong {
        display: block;
        color: #1465e8;
        font-size: 20px;
      }

      .brand small {
        display: block;
        color: #98a2b3;
        font-size: 7px;
        letter-spacing: 2px;
      }

      .back {
        color: #475467;
        text-decoration: none;
        font-size: 12px;
        font-weight: 800;
      }

      .content {
        width: calc(100% - 24px);
        max-width: 760px;
        margin: auto;
        padding: 45px 0 80px;
      }

      .eyebrow {
        color: #1465e8;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 2px;
      }

      .intro h1 {
        margin: 8px 0;
        font-size: 38px;
      }

      .intro p {
        margin: 0;
        color: #667085;
        font-size: 13px;
      }

      .locked {
        margin: 24px 0;
        padding: 14px 16px;
        border-radius: 13px;
        background: #eef4ff;
        color: #344054;
        font-size: 12px;
      }

      .locked span {
        display: block;
        margin-top: 4px;
        color: #667085;
        font-size: 10px;
      }

      .card {
        padding: 28px;
        border: 1px solid #e2e7ed;
        border-radius: 23px;
        background: white;
      }

      .sectionTitle {
        display: flex;
        gap: 12px;
        margin-bottom: 23px;
      }

      .sectionTitle > b {
        color: #1465e8;
        font-size: 11px;
      }

      .sectionTitle h2 {
        margin: 0;
        font-size: 21px;
      }

      .sectionTitle p {
        margin: 5px 0 0;
        color: #7b8492;
        font-size: 11px;
      }

      .divider {
        height: 1px;
        margin: 32px 0;
        background: #edf0f3;
      }

      .field,
      .visibilityField {
        display: block;
        margin-bottom: 17px;
      }

      .field > span,
      .visibilityHeader > span {
        display: block;
        color: #344054;
        font-size: 14px;
        font-weight: 800;
      }

      .field > span {
        margin-bottom: 8px;
      }

      .field input,
      .field select,
      .visibilityField input,
      .visibilityField select,
      .visibilityField textarea {
        width: 100%;
        border: 1px solid #d5dae1;
        border-radius: 12px;
        background: white;
        outline: none;
      }

      .field input,
      .field select,
      .visibilityField input,
      .visibilityField select {
        height: 54px;
        padding: 0 14px;
      }

      .visibilityField textarea {
        min-height: 105px;
        padding: 14px;
        resize: vertical;
      }

      .visibilityHeader {
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
      }

      .visibilityField small {
        display: block;
        margin-top: 6px;
        color: #98a2b3;
        font-size: 10px;
      }

      .visibilityField small b {
        color: #1465e8;
      }

      .contactMethods {
        margin: 20px 0;
        padding: 18px;
        border-radius: 15px;
        background: #f8fafc;
        border: 1px solid #e0e5eb;
      }

      .contactMethodsHeader {
        margin-bottom: 13px;
      }

      .contactMethodsHeader strong {
        display: block;
        color: #344054;
        font-size: 14px;
      }

      .contactMethodsHeader p {
        margin: 5px 0 0;
        color: #7b8492;
        font-size: 10px;
      }

      .contactMethod {
        width: 100%;
        min-height: 64px;
        margin-top: 9px;
        padding: 11px 13px;
        display: flex;
        align-items: center;
        gap: 12px;
        border: 1px solid #dce2e9;
        border-radius: 13px;
        background: white;
        text-align: left;
        cursor: pointer;
      }

      .contactMethod.active {
        border-color: #1465e8;
        background: #f3f7fd;
      }

      .contactMethodIcon {
        width: 40px;
        height: 40px;
        flex: 0 0 40px;
        display: grid;
        place-items: center;
        border-radius: 11px;
        background: #eef4ff;
        font-size: 18px;
      }

      .contactMethodText {
        flex: 1;
      }

      .contactMethodText strong {
        display: block;
        color: #344054;
        font-size: 13px;
      }

      .contactMethodText span {
        display: block;
        margin-top: 4px;
        color: #7b8492;
        font-size: 10px;
        line-height: 1.4;
      }

      .contactCheck {
        width: 23px;
        height: 23px;
        flex: 0 0 23px;
        display: grid;
        place-items: center;
        border: 1px solid #cdd4dd;
        border-radius: 7px;
        background: white;
        color: white;
        font-size: 12px;
        font-weight: 900;
      }

      .contactCheck.active {
        border-color: #1465e8;
        background: #1465e8;
      }

      .optionalGroup {
        margin-top: 20px;
        padding: 18px;
        border-radius: 15px;
        background: #f8fafc;
      }

      .optionalHeader {
        margin-bottom: 17px;
        display: flex;
        justify-content: space-between;
        gap: 15px;
      }

      .optionalHeader strong {
        font-size: 14px;
      }

      .optionalHeader p {
        margin: 4px 0 0;
        color: #98a2b3;
        font-size: 10px;
      }

      .photoEditor {
        margin-bottom: 18px;
        padding: 16px;
        border: 1px dashed #c7ced8;
        border-radius: 14px;
        background: #fafbfc;
      }

      .photoEditor img {
        width: 100px;
        height: 100px;
        margin: 12px 0;
        border-radius: 15px;
        object-fit: cover;
      }

      .upload {
        min-height: 44px;
        padding: 0 14px;
        display: inline-flex;
        align-items: center;
        border-radius: 10px;
        background: #eaf2ff;
        color: #1465e8;
        font-size: 11px;
        font-weight: 800;
        cursor: pointer;
      }

      .upload input {
        display: none;
      }

      .photoEditor small {
        display: block;
        margin-top: 8px;
        color: #98a2b3;
        font-size: 10px;
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
        transform: translateX(21px);
      }

      .locationBox {
        padding: 17px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        border-radius: 14px;
        background: #f8fafc;
      }

      .locationBox strong {
        font-size: 14px;
      }

      .locationBox p {
        margin: 5px 0 0;
        color: #7b8492;
        font-size: 10px;
        line-height: 1.5;
      }

      .error,
      .success {
        margin-top: 20px;
        padding: 14px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 800;
      }

      .error {
        background: #fff1f1;
        color: #b42318;
      }

      .success {
        background: #ecfdf3;
        color: #027a48;
      }

      .actions {
        margin-top: 28px;
        display: grid;
        grid-template-columns: 1fr 1.5fr;
        gap: 10px;
      }

      .cancelButton,
      .saveButton {
        min-height: 54px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 900;
        text-decoration: none;
      }

      .cancelButton {
        border: 1px solid #d5dae1;
        color: #475467;
      }

      .saveButton {
        border: 0;
        background: #1465e8;
        color: white;
        cursor: pointer;
      }

      .saveButton:disabled {
        opacity: 0.6;
      }

      .center {
        padding-top: 130px;
        text-align: center;
        font-family: Arial, sans-serif;
      }

      @media (max-width: 600px) {
        .back {
          display: none;
        }

        .content {
          padding-top: 28px;
        }

        .intro h1 {
          font-size: 29px;
        }

        .card {
          padding: 20px 14px;
        }

        .actions {
          grid-template-columns: 1fr;
        }

        .field input,
        .field select,
        .visibilityField input,
        .visibilityField select,
        .visibilityField textarea {
          font-size: 16px;
        }
      }
    `}</style>
  );
}
