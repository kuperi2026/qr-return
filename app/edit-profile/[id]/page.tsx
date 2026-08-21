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

import {
  createClient,
  type SupabaseClient,
} from "@supabase/supabase-js";

type ProfileData = {
  id: string;
  owner_id: string;
  tag_code: string;
  item_type: string;
  pet_type: string | null;
  item_name: string | null;
  colour: string | null;
  sex: string | null;
  date_of_birth: string | null;
  weight: number | null;
  photo: string | null;
  medical_info: string | null;
  behaviour_note: string | null;
  description: string | null;
  finder_message: string | null;
  show_email: boolean | null;
  show_address: boolean | null;
  show_pet_photo: boolean | null;
  show_medical_info: boolean | null;
  show_behaviour_note: boolean | null;
  show_description: boolean | null;
  show_finder_message: boolean | null;
  live_chat_enabled: boolean | null;
  active: boolean | null;
};

function createSupabaseClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createClient(
    supabaseUrl,
    supabaseKey
  );
}

const CATEGORY_META: Record<
  string,
  {
    label: string;
    emoji: string;
  }
> = {
  dog: {
    label: "ძაღლი",
    emoji: "🐶",
  },

  cat: {
    label: "კატა",
    emoji: "🐱",
  },

  keys: {
    label: "გასაღები",
    emoji: "🔑",
  },

  wallet: {
    label: "საფულე",
    emoji: "👛",
  },

  suitcase: {
    label: "ჩემოდანი",
    emoji: "🧳",
  },

  bag: {
    label: "ჩანთა",
    emoji: "👜",
  },
};

export default function EditProfilePage() {
  const router = useRouter();
  const params = useParams();

  const rawId = params?.id;

  const profileId =
    typeof rawId === "string"
      ? rawId
      : "";

  const [supabase, setSupabase] =
    useState<SupabaseClient | null>(
      null
    );

  const [profile, setProfile] =
    useState<ProfileData | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const [itemName, setItemName] =
    useState("");

  const [colour, setColour] =
    useState("");

  const [sex, setSex] =
    useState("");

  const [
    dateOfBirth,
    setDateOfBirth,
  ] = useState("");

  const [weight, setWeight] =
    useState("");

  const [photo, setPhoto] =
    useState("");

  const [
    medicalInfo,
    setMedicalInfo,
  ] = useState("");

  const [
    behaviourNote,
    setBehaviourNote,
  ] = useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [
    finderMessage,
    setFinderMessage,
  ] = useState("");

  const [
    showEmail,
    setShowEmail,
  ] = useState(false);

  const [
    showAddress,
    setShowAddress,
  ] = useState(false);

  const [
    showPetPhoto,
    setShowPetPhoto,
  ] = useState(true);

  const [
    showMedicalInfo,
    setShowMedicalInfo,
  ] = useState(false);

  const [
    showBehaviourNote,
    setShowBehaviourNote,
  ] = useState(false);

  const [
    showDescription,
    setShowDescription,
  ] = useState(true);

  const [
    showFinderMessage,
    setShowFinderMessage,
  ] = useState(true);

  const [
    liveChatEnabled,
    setLiveChatEnabled,
  ] = useState(true);

  const [active, setActive] =
    useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const client =
          createSupabaseClient();

        if (!client) {
          setErrorMessage(
            "Supabase კავშირი არ არის კონფიგურირებული."
          );

          setLoading(false);
          return;
        }

        setSupabase(client);

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
          router.replace("/login");
          return;
        }

        if (!profileId) {
          setErrorMessage(
            "პროფილის ID ვერ მოიძებნა."
          );

          setLoading(false);
          return;
        }

        const {
          data,
          error,
        } = await client
          .from("item")
          .select(
            `
              id,
              owner_id,
              tag_code,
              item_type,
              pet_type,
              item_name,
              colour,
              sex,
              date_of_birth,
              weight,
              photo,
              medical_info,
              behaviour_note,
              description,
              finder_message,
              show_email,
              show_address,
              show_pet_photo,
              show_medical_info,
              show_behaviour_note,
              show_description,
              show_finder_message,
              live_chat_enabled,
              active
            `
          )
          .eq(
            "id",
            profileId
          )
          .eq(
            "owner_id",
            user.id
          )
          .single();

        if (error) {
          throw error;
        }

        const loaded =
          data as ProfileData;

        setProfile(loaded);

        setItemName(
          loaded.item_name || ""
        );

        setColour(
          loaded.colour || ""
        );

        setSex(
          loaded.sex || ""
        );

        setDateOfBirth(
          loaded.date_of_birth || ""
        );

        setWeight(
          loaded.weight !== null &&
          loaded.weight !== undefined
            ? String(
                loaded.weight
              )
            : ""
        );

        setPhoto(
          loaded.photo || ""
        );

        setMedicalInfo(
          loaded.medical_info || ""
        );

        setBehaviourNote(
          loaded.behaviour_note || ""
        );

        setDescription(
          loaded.description || ""
        );

        setFinderMessage(
          loaded.finder_message || ""
        );

        setShowEmail(
          Boolean(
            loaded.show_email
          )
        );

        setShowAddress(
          Boolean(
            loaded.show_address
          )
        );

        setShowPetPhoto(
          loaded.show_pet_photo !==
            false
        );

        setShowMedicalInfo(
          Boolean(
            loaded.show_medical_info
          )
        );

        setShowBehaviourNote(
          Boolean(
            loaded.show_behaviour_note
          )
        );

        setShowDescription(
          loaded.show_description !==
            false
        );

        setShowFinderMessage(
          loaded.show_finder_message !==
            false
        );

        setLiveChatEnabled(
          loaded.live_chat_enabled !==
            false
        );

        setActive(
          loaded.active !== false
        );
      } catch (error) {
        console.error(
          "Load profile error:",
          error
        );

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "პროფილის ჩატვირთვა ვერ მოხერხდა."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [
    profileId,
    router,
  ]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (
      !supabase ||
      !profile
    ) {
      setErrorMessage(
        "პროფილის მონაცემები ვერ მოიძებნა."
      );

      return;
    }

    if (!itemName.trim()) {
      setErrorMessage(
        "პროფილის სახელი სავალდებულოა."
      );

      return;
    }

    setSaving(true);

    try {
      const {
        error,
      } = await supabase
        .from("item")
        .update({
          item_name:
            itemName.trim(),

          colour:
            colour.trim() ||
            null,

          sex:
            sex || null,

          date_of_birth:
            dateOfBirth ||
            null,

          weight:
            weight
              ? Number(weight)
              : null,

          photo:
            photo.trim() ||
            null,

          medical_info:
            medicalInfo.trim() ||
            null,

          behaviour_note:
            behaviourNote.trim() ||
            null,

          description:
            description.trim() ||
            null,

          finder_message:
            finderMessage.trim() ||
            null,

          show_email:
            showEmail,

          show_address:
            showAddress,

          show_pet_photo:
            showPetPhoto,

          show_medical_info:
            showMedicalInfo,

          show_behaviour_note:
            showBehaviourNote,

          show_description:
            showDescription,

          show_finder_message:
            showFinderMessage,

          phone_enabled:
            true,

          live_chat_enabled:
            liveChatEnabled,

          active,
        })
        .eq(
          "id",
          profile.id
        )
        .eq(
          "owner_id",
          profile.owner_id
        );

      if (error) {
        throw error;
      }

      setSuccessMessage(
        "პროფილის ცვლილებები წარმატებით შეინახა."
      );
    } catch (error) {
      console.error(
        "Update profile error:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "პროფილის შენახვა ვერ მოხერხდა."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="statePage">
        პროფილი იტვირთება...

        <style jsx>{`
          .statePage {
            min-height: 100vh;

            display: grid;
            place-items: center;

            background: #f7faff;

            color: #718095;

            font-size: 11px;
          }
        `}</style>
      </main>
    );
  }

  if (
    !profile ||
    errorMessage
  ) {
    return (
      <main className="statePage">
        <div className="errorCard">
          <h1>
            პროფილი ვერ გაიხსნა
          </h1>

          <p>
            {errorMessage ||
              "პროფილი ვერ მოიძებნა."}
          </p>

          <a href="/my-profiles">
            ჩემს პროფილებზე დაბრუნება
          </a>
        </div>

        <style jsx>{`
          .statePage {
            min-height: 100vh;

            display: grid;
            place-items: center;

            padding: 25px;

            background: #f7faff;
          }

          .errorCard {
            width: 100%;
            max-width: 480px;

            padding: 30px;

            text-align: center;

            border: 1px solid #dce6f1;
            border-radius: 16px;

            background: #ffffff;
          }

          h1 {
            margin: 0;

            color: #243b54;

            font-size: 23px;
          }

          p {
            color: #7d8b9c;

            font-size: 10px;
          }

          a {
            display: inline-flex;

            margin-top: 15px;

            padding: 12px 15px;

            border-radius: 9px;

            background: #1266e9;

            color: white;

            font-size: 9px;

            text-decoration: none;
          }
        `}</style>
      </main>
    );
  }

  const meta =
    CATEGORY_META[
      profile.item_type
    ] || {
      label:
        profile.item_type,
      emoji: "QR",
    };

  const isPet =
    profile.item_type ===
      "dog" ||
    profile.item_type ===
      "cat";

  return (
    <>
      <main className="page">
        <div className="container">
          <header className="topbar">
            <a
              href="/my-profiles"
              className="back"
            >
              ← ჩემი პროფილები
            </a>

            <a
              href="/"
              className="brand"
            >
              QR RETURN
            </a>
          </header>

          <section className="hero">
            <div className="categoryIcon">
              {meta.emoji}
            </div>

            <div>
              <span>
                EDIT PROFILE
              </span>

              <h1>
                {profile.item_name ||
                  meta.label}
              </h1>

              <p>
                შეგიძლიათ შეცვალოთ პროფილის
                ინფორმაცია და Finder View-ის
                პარამეტრები.
              </p>
            </div>
          </section>

          <div className="lockedBox">
            <div className="lock">
              🔒
            </div>

            <div>
              <span>
                LOCKED QR CATEGORY
              </span>

              <h2>
                {meta.emoji}{" "}
                {meta.label}
              </h2>

              <p>
                QR კოდი{" "}
                <strong>
                  {profile.tag_code}
                </strong>{" "}
                უკვე დარეგისტრირებულია
                როგორც{" "}
                <strong>
                  {meta.label}
                </strong>
                . კატეგორიის შეცვლა
                შეუძლებელია.
              </p>
            </div>
          </div>

          {successMessage && (
            <div className="successBox">
              ✓ {successMessage}
            </div>
          )}

          <form
            onSubmit={
              handleSubmit
            }
          >
            <section className="card">
              <div className="cardHeader">
                <span>01</span>

                <div>
                  <h2>
                    ძირითადი ინფორმაცია
                  </h2>

                  <p>
                    პროფილის მონაცემების
                    რედაქტირება.
                  </p>
                </div>
              </div>

              <div className="grid">
                <Field
                  label={
                    isPet
                      ? "ცხოველის სახელი"
                      : "პროფილის სახელი"
                  }
                  full
                >
                  <input
                    value={itemName}
                    onChange={(
                      event
                    ) =>
                      setItemName(
                        event
                          .target
                          .value
                      )
                    }
                    required
                  />
                </Field>

                <Field label="ფერი">
                  <input
                    value={colour}
                    onChange={(
                      event
                    ) =>
                      setColour(
                        event
                          .target
                          .value
                      )
                    }
                  />
                </Field>

                {isPet && (
                  <Field label="სქესი">
                    <select
                      value={sex}
                      onChange={(
                        event
                      ) =>
                        setSex(
                          event
                            .target
                            .value
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

                      <option value="unknown">
                        არ არის მითითებული
                      </option>
                    </select>
                  </Field>
                )}

                {isPet && (
                  <Field label="დაბადების თარიღი">
                    <input
                      type="date"
                      value={
                        dateOfBirth
                      }
                      onChange={(
                        event
                      ) =>
                        setDateOfBirth(
                          event
                            .target
                            .value
                        )
                      }
                    />
                  </Field>
                )}

                {isPet && (
                  <Field label="წონა">
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={
                        weight
                      }
                      onChange={(
                        event
                      ) =>
                        setWeight(
                          event
                            .target
                            .value
                        )
                      }
                    />
                  </Field>
                )}

                <Field
                  label="ფოტოს URL"
                  full
                >
                  <input
                    type="url"
                    value={photo}
                    onChange={(
                      event
                    ) =>
                      setPhoto(
                        event
                          .target
                          .value
                      )
                    }
                    placeholder="https://..."
                  />
                </Field>
              </div>
            </section>

            {isPet && (
              <section className="card">
                <div className="cardHeader">
                  <span>02</span>

                  <div>
                    <h2>
                      ჯანმრთელობა და აღწერა
                    </h2>

                    <p>
                      დამატებითი ინფორმაცია
                      მპოვნელისთვის.
                    </p>
                  </div>
                </div>

                <div className="textareaGrid">
                  <Field
                    label="სამედიცინო ინფორმაცია"
                    full
                  >
                    <textarea
                      rows={4}
                      value={
                        medicalInfo
                      }
                      onChange={(
                        event
                      ) =>
                        setMedicalInfo(
                          event
                            .target
                            .value
                        )
                      }
                    />
                  </Field>

                  <Field
                    label="ქცევის შესახებ ინფორმაცია"
                    full
                  >
                    <textarea
                      rows={4}
                      value={
                        behaviourNote
                      }
                      onChange={(
                        event
                      ) =>
                        setBehaviourNote(
                          event
                            .target
                            .value
                        )
                      }
                    />
                  </Field>

                  <Field
                    label="დამატებითი აღწერა"
                    full
                  >
                    <textarea
                      rows={4}
                      value={
                        description
                      }
                      onChange={(
                        event
                      ) =>
                        setDescription(
                          event
                            .target
                            .value
                        )
                      }
                    />
                  </Field>

                  <Field
                    label="შეტყობინება მპოვნელისთვის"
                    full
                  >
                    <textarea
                      rows={4}
                      value={
                        finderMessage
                      }
                      onChange={(
                        event
                      ) =>
                        setFinderMessage(
                          event
                            .target
                            .value
                        )
                      }
                    />
                  </Field>
                </div>
              </section>
            )}

            <section className="card">
              <div className="cardHeader">
                <span>03</span>

                <div>
                  <h2>
                    Finder View
                  </h2>

                  <p>
                    დამატებითი ინფორმაციის
                    ხილვადობა.
                  </p>
                </div>
              </div>

              <div className="always">
                <strong>
                  ყოველთვის ხილული
                </strong>

                <p>
                  სახელი, გვარი და ტელეფონის
                  ნომერი მპოვნელისთვის
                  ყოველთვის ხელმისაწვდომია.
                </p>
              </div>

              <div className="toggles">
                <Toggle
                  label="ელფოსტა"
                  checked={
                    showEmail
                  }
                  onChange={
                    setShowEmail
                  }
                />

                <Toggle
                  label="მისამართი"
                  checked={
                    showAddress
                  }
                  onChange={
                    setShowAddress
                  }
                />

                <Toggle
                  label="ფოტო"
                  checked={
                    showPetPhoto
                  }
                  onChange={
                    setShowPetPhoto
                  }
                />

                {isPet && (
                  <Toggle
                    label="სამედიცინო ინფორმაცია"
                    checked={
                      showMedicalInfo
                    }
                    onChange={
                      setShowMedicalInfo
                    }
                  />
                )}

                {isPet && (
                  <Toggle
                    label="ქცევის ინფორმაცია"
                    checked={
                      showBehaviourNote
                    }
                    onChange={
                      setShowBehaviourNote
                    }
                  />
                )}

                <Toggle
                  label="დამატებითი აღწერა"
                  checked={
                    showDescription
                  }
                  onChange={
                    setShowDescription
                  }
                />

                {isPet && (
                  <Toggle
                    label="შეტყობინება მპოვნელისთვის"
                    checked={
                      showFinderMessage
                    }
                    onChange={
                      setShowFinderMessage
                    }
                  />
                )}
              </div>
            </section>

            <section className="card">
              <div className="cardHeader">
                <span>04</span>

                <div>
                  <h2>
                    კონტაქტი და სტატუსი
                  </h2>

                  <p>
                    Phone ყოველთვის აქტიურია.
                  </p>
                </div>
              </div>

              <div className="fixedPhone">
                <div>
                  <strong>
                    ☎ ტელეფონი
                  </strong>

                  <p>
                    ყოველთვის ხელმისაწვდომია
                    მპოვნელისთვის.
                  </p>
                </div>

                <span>
                  ACTIVE
                </span>
              </div>

              <Toggle
                label="QR RETURN Live Chat"
                checked={
                  liveChatEnabled
                }
                onChange={
                  setLiveChatEnabled
                }
              />

              <Toggle
                label="პროფილი აქტიურია"
                checked={active}
                onChange={
                  setActive
                }
              />
            </section>

            <section className="saveBar">
              <div>
                <span>
                  SAVE CHANGES
                </span>

                <h2>
                  ცვლილებების შენახვა
                </h2>

                <p>
                  QR კოდი და კატეგორია არ
                  შეიცვლება.
                </p>
              </div>

              <div className="saveActions">
                <a
                  href="/my-profiles"
                  className="cancel"
                >
                  გაუქმება
                </a>

                <button
                  type="submit"
                  disabled={
                    saving
                  }
                >
                  {saving
                    ? "ინახება..."
                    : "ცვლილებების შენახვა"}
                </button>
              </div>
            </section>
          </form>
        </div>
      </main>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;

          padding-bottom: 70px;

          background:
            radial-gradient(
              circle at 100% 0%,
              rgba(18,102,233,.06),
              transparent 28%
            ),
            #f7faff;
        }

        .container {
          width:
            calc(100% - 40px);

          max-width: 900px;

          margin: auto;
        }

        .topbar {
          min-height: 75px;

          display: flex;

          align-items: center;

          justify-content:
            space-between;

          border-bottom:
            1px solid #e2e9f1;
        }

        .topbar a {
          text-decoration: none;
        }

        .back {
          color: #61758a;

          font-size: 9px;

          font-weight: 850;
        }

        .brand {
          color: #1266e9;

          font-size: 12px;

          font-weight: 950;
        }

        .hero {
          margin-top: 45px;

          display: flex;

          align-items: center;

          gap: 17px;
        }

        .categoryIcon {
          width: 66px;
          height: 66px;

          flex: 0 0 66px;

          display: grid;

          place-items: center;

          border-radius: 17px;

          background: #ffffff;

          border:
            1px solid #dae5f2;

          font-size: 32px;
        }

        .hero span {
          color: #1266e9;

          font-size: 8px;

          font-weight: 900;

          letter-spacing: 1.3px;
        }

        .hero h1 {
          margin: 6px 0 0;

          color: #233b55;

          font-size: 31px;
        }

        .hero p {
          margin: 6px 0 0;

          color: #7e8da0;

          font-size: 9px;
        }

        .lockedBox {
          margin-top: 25px;

          padding: 18px;

          display: flex;

          gap: 12px;

          border:
            1px solid #cddff5;

          border-radius: 14px;

          background: #eef5ff;
        }

        .lock {
          width: 38px;
          height: 38px;

          flex: 0 0 38px;

          display: grid;

          place-items: center;

          border-radius: 10px;

          background: #ffffff;

          font-size: 17px;
        }

        .lockedBox span {
          color: #1266e9;

          font-size: 7px;

          font-weight: 900;
        }

        .lockedBox h2 {
          margin: 4px 0 0;

          color: #28425f;

          font-size: 15px;
        }

        .lockedBox p {
          margin: 5px 0 0;

          color: #718399;

          font-size: 8px;

          line-height: 1.5;
        }

        .successBox {
          margin-top: 16px;

          padding: 13px;

          border:
            1px solid #c5dfd1;

          border-radius: 11px;

          background: #f5fbf7;

          color: #397057;

          font-size: 9px;
        }

        .card {
          margin-top: 16px;

          padding: 24px;

          border:
            1px solid #dce6f1;

          border-radius: 16px;

          background: #ffffff;

          box-shadow:
            0 10px 27px
            rgba(30,70,120,.045);
        }

        .cardHeader {
          padding-bottom: 18px;

          display: flex;

          gap: 11px;

          border-bottom:
            1px solid #e7edf4;
        }

        .cardHeader > span {
          width: 34px;
          height: 34px;

          flex: 0 0 34px;

          display: grid;

          place-items: center;

          border-radius: 9px;

          background: #edf4ff;

          color: #1266e9;

          font-size: 9px;

          font-weight: 950;
        }

        .cardHeader h2 {
          margin: 0;

          color: #29425d;

          font-size: 16px;
        }

        .cardHeader p {
          margin: 4px 0 0;

          color: #8794a3;

          font-size: 8px;
        }

        .grid {
          margin-top: 20px;

          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 16px 14px;
        }

        .textareaGrid {
          margin-top: 20px;

          display: grid;

          gap: 16px;
        }

        input,
        select,
        textarea {
          width: 100%;

          border:
            1px solid #d5e0eb;

          border-radius: 10px;

          outline: none;

          background: white;

          color: #263e57;

          font-family: inherit;

          font-size: 11px;
        }

        input,
        select {
          min-height: 48px;

          padding: 0 13px;
        }

        textarea {
          padding: 12px 13px;

          resize: vertical;

          line-height: 1.5;
        }

        input:focus,
        select:focus,
        textarea:focus {
          border-color:
            #1266e9;

          box-shadow:
            0 0 0 4px
            rgba(18,102,233,.08);
        }

        .always {
          margin-top: 20px;

          padding: 13px;

          border:
            1px solid #d7e4f3;

          border-radius: 10px;

          background: #f7faff;
        }

        .always strong {
          color: #38516d;

          font-size: 9px;
        }

        .always p {
          margin: 4px 0 0;

          color: #8492a1;

          font-size: 8px;
        }

        .toggles {
          margin-top: 10px;
        }

        .fixedPhone {
          margin-top: 20px;

          padding: 13px;

          display: flex;

          align-items: center;

          justify-content:
            space-between;

          gap: 15px;

          border:
            1px solid #d5e3f4;

          border-radius: 10px;

          background: #f7faff;
        }

        .fixedPhone strong {
          color: #304a65;

          font-size: 10px;
        }

        .fixedPhone p {
          margin: 4px 0 0;

          color: #8795a5;

          font-size: 8px;
        }

        .fixedPhone > span {
          padding: 5px 8px;

          border-radius: 999px;

          background: #eaf2ff;

          color: #1266e9;

          font-size: 6px;

          font-weight: 900;
        }

        .saveBar {
          margin-top: 16px;

          padding: 21px 23px;

          display: flex;

          align-items: center;

          justify-content:
            space-between;

          gap: 20px;

          border:
            1px solid #cddff5;

          border-radius: 16px;

          background:
            linear-gradient(
              135deg,
              #f7faff,
              #edf5ff
            );
        }

        .saveBar span {
          color: #1266e9;

          font-size: 7px;

          font-weight: 900;
        }

        .saveBar h2 {
          margin: 5px 0 0;

          color: #29425d;

          font-size: 16px;
        }

        .saveBar p {
          margin: 5px 0 0;

          color: #8391a0;

          font-size: 8px;
        }

        .saveActions {
          display: flex;

          gap: 8px;
        }

        .saveActions a,
        .saveActions button {
          min-height: 43px;

          padding: 0 14px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 9px;

          font-family: inherit;

          font-size: 8px;

          font-weight: 900;

          text-decoration: none;
        }

        .cancel {
          border:
            1px solid #ccd9e7;

          background: #ffffff;

          color: #63768a;
        }

        .saveActions button {
          border: 0;

          background: #1266e9;

          color: white;

          cursor: pointer;
        }

        .saveActions button:disabled {
          opacity: .65;
        }

        @media (
          max-width: 650px
        ) {
          .grid {
            grid-template-columns:
              1fr;
          }

          .hero {
            align-items:
              flex-start;
          }

          .hero h1 {
            font-size: 26px;
          }

          .saveBar {
            flex-direction:
              column;

            align-items:
              stretch;
          }

          .saveActions a,
          .saveActions button {
            flex: 1;
          }
        }
      `}</style>
    </>
  );
}

function Field({
  label,
  full = false,
  children,
}: {
  label: string;
  full?: boolean;
  children: React.ReactNode;
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
          color: "#344a62",
          fontSize: "9px",
          fontWeight: 850,
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
    <div
      style={{
        minHeight: "62px",
        padding: "12px 2px",
        display: "flex",
        alignItems: "center",
        justifyContent:
          "space-between",
        gap: "15px",
        borderBottom:
          "1px solid #e4eaf1",
      }}
    >
      <strong
        style={{
          color: "#344b64",
          fontSize: "9px",
        }}
      >
        {label}
      </strong>

      <button
        type="button"
        onClick={() =>
          onChange(!checked)
        }
        aria-pressed={checked}
        style={{
          width: "45px",
          height: "25px",
          padding: "3px",
          border: 0,
          borderRadius: "999px",
          background:
            checked
              ? "#1266e9"
              : "#dce4ed",
          cursor: "pointer",
        }}
      >
        <span
          style={{
            width: "19px",
            height: "19px",
            display: "block",
            borderRadius: "50%",
            background: "#ffffff",
            transform:
              checked
                ? "translateX(20px)"
                : "translateX(0)",
            transition:
              "transform .2s ease",
          }}
        />
      </button>
    </div>
  );
}
