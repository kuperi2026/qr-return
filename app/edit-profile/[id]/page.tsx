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
  behavior_note: string | null;
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

  lost: boolean | null;
  lost_at: string | null;
  lost_message: string | null;
  found_at: string | null;
};

function createSupabaseClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
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
    statusLoading,
    setStatusLoading,
  ] = useState(false);

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

  const [lost, setLost] =
    useState(false);

  const [
    lostMessage,
    setLostMessage,
  ] = useState("");

  const [
    lostAt,
    setLostAt,
  ] = useState<string | null>(
    null
  );

  const [
    foundAt,
    setFoundAt,
  ] = useState<string | null>(
    null
  );

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
          data: { user },
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
              behavior_note,
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
              active,
              lost,
              lost_at,
              lost_message,
              found_at
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
          loaded.weight !== null
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
          loaded.behavior_note || ""
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

        setLost(
          loaded.lost === true
        );

        setLostMessage(
          loaded.lost_message || ""
        );

        setLostAt(
          loaded.lost_at
        );

        setFoundAt(
          loaded.found_at
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
        data: updatedProfile,
        error,
      } =
        await supabase
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

            behavior_note:
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
          )
          .select("id")
          .maybeSingle();

      if (error) {
        throw error;
      }

      if (!updatedProfile) {
        throw new Error(
          "პროფილის განახლება ვერ დადასტურდა."
        );
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

  async function markAsLost() {
    if (
      !supabase ||
      !profile
    ) {
      return;
    }

    setStatusLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const now =
        new Date().toISOString();

      const {
        data: updatedProfile,
        error,
      } = await supabase
        .from("item")
        .update({
          lost: true,
          lost_at: now,
          lost_message:
            lostMessage.trim() ||
            null,
          found_at: null,
        })
        .eq("id", profile.id)
        .eq(
          "owner_id",
          profile.owner_id
        )
        .select(
          "id,lost,lost_at,lost_message,found_at"
        )
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (
        !updatedProfile ||
        updatedProfile.lost !== true
      ) {
        throw new Error(
          "Lost სტატუსის შეცვლა ვერ დადასტურდა."
        );
      }

      setLost(true);
      setLostAt(now);
      setFoundAt(null);

      setSuccessMessage(
        "პროფილი მონიშნულია დაკარგულად."
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Lost სტატუსის შეცვლა ვერ მოხერხდა."
      );
    } finally {
      setStatusLoading(false);
    }
  }

  async function markAsFound() {
    if (
      !supabase ||
      !profile
    ) {
      return;
    }

    setStatusLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const now =
        new Date().toISOString();

      const {
        data: updatedProfile,
        error,
      } = await supabase
        .from("item")
        .update({
          lost: false,
          found_at: now,
          lost_message: null,
        })
        .eq("id", profile.id)
        .eq(
          "owner_id",
          profile.owner_id
        )
        .select(
          "id,lost,lost_at,lost_message,found_at"
        )
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (
        !updatedProfile ||
        updatedProfile.lost !== false
      ) {
        throw new Error(
          "Found სტატუსის შეცვლა ვერ დადასტურდა."
        );
      }

      setLost(false);
      setFoundAt(now);

      setSuccessMessage(
        "პროფილი მონიშნულია დაბრუნებულად."
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Found სტატუსის შეცვლა ვერ მოხერხდა."
      );
    } finally {
      setStatusLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="statePage">
        პროფილი იტვირთება...
      </main>
    );
  }

  if (!profile) {
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
            უკან დაბრუნება
          </a>
        </div>
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
                მართეთ პროფილი, Finder View
                და Lost / Found სტატუსი.
              </p>
            </div>
          </section>

          <section
            className={
              lost
                ? "lostCard activeLost"
                : "lostCard"
            }
          >
            <div className="lostTop">
              <div>
                <span>
                  LOST / FOUND STATUS
                </span>

                <h2>
                  {lost
                    ? "პროფილი დაკარგულად არის მონიშნული"
                    : "პროფილი უსაფრთხოდ არის"}
                </h2>

                <p>
                  {lost
                    ? "Finder-ს შეუძლია დაგიკავშირდეთ და გაგიზიაროთ მდებარეობა."
                    : "თუ ნივთი ან ცხოველი დაიკარგა, აქედან ჩართეთ Lost რეჟიმი."}
                </p>
              </div>

              <div
                className={
                  lost
                    ? "statusPill lost"
                    : "statusPill safe"
                }
              >
                {lost
                  ? "LOST"
                  : "SAFE"}
              </div>
            </div>

            {!lost && (
              <>
                <label className="lostLabel">
                  შეტყობინება მპოვნელისთვის
                </label>

                <textarea
                  className="lostTextarea"
                  rows={4}
                  value={lostMessage}
                  onChange={(event) =>
                    setLostMessage(
                      event.target.value
                    )
                  }
                  placeholder="მაგ. გთხოვთ დამიკავშირდეთ. ძალიან მნიშვნელოვანია მისი უსაფრთხოდ დაბრუნება."
                />

                <button
                  type="button"
                  className="lostButton"
                  onClick={markAsLost}
                  disabled={
                    statusLoading
                  }
                >
                  {statusLoading
                    ? "სტატუსი იცვლება..."
                    : "Mark as Lost"}
                </button>
              </>
            )}

            {lost && (
              <>
                {lostMessage && (
                  <div className="lostMessageBox">
                    <span>
                      LOST MESSAGE
                    </span>

                    <p>
                      {lostMessage}
                    </p>
                  </div>
                )}

                {lostAt && (
                  <p className="dateLine">
                    Lost since:{" "}
                    {new Date(
                      lostAt
                    ).toLocaleString()}
                  </p>
                )}

                <button
                  type="button"
                  className="foundButton"
                  onClick={markAsFound}
                  disabled={
                    statusLoading
                  }
                >
                  {statusLoading
                    ? "სტატუსი იცვლება..."
                    : "✓ Mark as Found"}
                </button>
              </>
            )}

            {!lost &&
              foundAt && (
                <p className="dateLine">
                  Last found:{" "}
                  {new Date(
                    foundAt
                  ).toLocaleString()}
                </p>
              )}
          </section>

          <div className="lockedBox">
            <strong>
              🔒 {meta.emoji}{" "}
              {meta.label}
            </strong>

            <p>
              QR Code:{" "}
              {profile.tag_code}.
              კატეგორიის შეცვლა
              შეუძლებელია.
            </p>
          </div>

          {errorMessage && (
            <div className="message error">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="message success">
              ✓ {successMessage}
            </div>
          )}

          <form
            onSubmit={
              handleSubmit
            }
          >
            <section className="card">
              <h2>
                ძირითადი ინფორმაცია
              </h2>

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
                    onChange={(event) =>
                      setItemName(
                        event.target.value
                      )
                    }
                    required
                  />
                </Field>

                <Field label="ფერი">
                  <input
                    value={colour}
                    onChange={(event) =>
                      setColour(
                        event.target.value
                      )
                    }
                  />
                </Field>

                {isPet && (
                  <Field label="სქესი">
                    <select
                      value={sex}
                      onChange={(event) =>
                        setSex(
                          event.target.value
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
                      onChange={(event) =>
                        setDateOfBirth(
                          event.target.value
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
                      value={weight}
                      onChange={(event) =>
                        setWeight(
                          event.target.value
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
                    onChange={(event) =>
                      setPhoto(
                        event.target.value
                      )
                    }
                  />
                </Field>
              </div>
            </section>

            {isPet && (
              <section className="card">
                <h2>
                  ჯანმრთელობა და აღწერა
                </h2>

                <Field
                  label="სამედიცინო ინფორმაცია"
                  full
                >
                  <textarea
                    rows={4}
                    value={
                      medicalInfo
                    }
                    onChange={(event) =>
                      setMedicalInfo(
                        event.target.value
                      )
                    }
                  />
                </Field>

                <Field
                  label="ქცევის ინფორმაცია"
                  full
                >
                  <textarea
                    rows={4}
                    value={
                      behaviourNote
                    }
                    onChange={(event) =>
                      setBehaviourNote(
                        event.target.value
                      )
                    }
                  />
                </Field>

                <Field
                  label="აღწერა"
                  full
                >
                  <textarea
                    rows={4}
                    value={
                      description
                    }
                    onChange={(event) =>
                      setDescription(
                        event.target.value
                      )
                    }
                  />
                </Field>

                <Field
                  label="Finder Message"
                  full
                >
                  <textarea
                    rows={4}
                    value={
                      finderMessage
                    }
                    onChange={(event) =>
                      setFinderMessage(
                        event.target.value
                      )
                    }
                  />
                </Field>
              </section>
            )}

            <section className="card">
              <h2>
                Finder View
              </h2>

              <Toggle
                label="Email"
                checked={showEmail}
                onChange={
                  setShowEmail
                }
              />

              <Toggle
                label="Address"
                checked={
                  showAddress
                }
                onChange={
                  setShowAddress
                }
              />

              <Toggle
                label="Photo"
                checked={
                  showPetPhoto
                }
                onChange={
                  setShowPetPhoto
                }
              />

              {isPet && (
                <>
                  <Toggle
                    label="Medical info"
                    checked={
                      showMedicalInfo
                    }
                    onChange={
                      setShowMedicalInfo
                    }
                  />

                  <Toggle
                    label="Behaviour"
                    checked={
                      showBehaviourNote
                    }
                    onChange={
                      setShowBehaviourNote
                    }
                  />
                </>
              )}

              <Toggle
                label="Description"
                checked={
                  showDescription
                }
                onChange={
                  setShowDescription
                }
              />

              <Toggle
                label="Finder message"
                checked={
                  showFinderMessage
                }
                onChange={
                  setShowFinderMessage
                }
              />

              <Toggle
                label="Live Chat"
                checked={
                  liveChatEnabled
                }
                onChange={
                  setLiveChatEnabled
                }
              />

              <Toggle
                label="Profile active"
                checked={active}
                onChange={
                  setActive
                }
              />
            </section>

            <section className="saveBar">
              <div>
                <strong>
                  ცვლილებების შენახვა
                </strong>

                <p>
                  QR Code და category
                  არ შეიცვლება.
                </p>
              </div>

              <button
                type="submit"
                disabled={saving}
              >
                {saving
                  ? "ინახება..."
                  : "Save Changes"}
              </button>
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
          background: #f7faff;
        }

        .container {
          width: calc(100% - 40px);
          max-width: 900px;
          margin: auto;
        }

        .topbar {
          min-height: 74px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #e2e9f1;
        }

        .topbar a {
          text-decoration: none;
          font-weight: 900;
        }

        .back {
          color: #62768b;
          font-size: 9px;
        }

        .brand {
          color: #1266e9;
          font-size: 12px;
        }

        .hero {
          margin-top: 40px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .categoryIcon {
          width: 65px;
          height: 65px;
          display: grid;
          place-items: center;
          border: 1px solid #d8e4f2;
          border-radius: 16px;
          background: white;
          font-size: 31px;
        }

        .hero span {
          color: #1266e9;
          font-size: 7px;
          font-weight: 900;
        }

        .hero h1 {
          margin: 5px 0 0;
          color: #243d57;
          font-size: 29px;
        }

        .hero p {
          margin: 5px 0 0;
          color: #8090a2;
          font-size: 9px;
        }

        .lostCard {
          margin-top: 24px;
          padding: 22px;
          border: 1px solid #d8e4f2;
          border-radius: 16px;
          background: white;
        }

        .activeLost {
          border-color: #efc2c6;
          background: #fff8f8;
        }

        .lostTop {
          display: flex;
          justify-content: space-between;
          gap: 20px;
        }

        .lostTop span {
          color: #1266e9;
          font-size: 7px;
          font-weight: 900;
        }

        .lostTop h2 {
          margin: 6px 0 0;
          color: #29425d;
          font-size: 17px;
        }

        .lostTop p {
          margin: 6px 0 0;
          color: #8190a0;
          font-size: 9px;
        }

        .statusPill {
          height: fit-content;
          padding: 6px 9px;
          border-radius: 999px;
          font-size: 7px;
          font-weight: 950;
        }

        .statusPill.safe {
          background: #eaf2ff;
          color: #1266e9;
        }

        .statusPill.lost {
          background: #fbe6e8;
          color: #b7444e;
        }

        .lostLabel {
          display: block;
          margin-top: 18px;
          margin-bottom: 7px;
          color: #415873;
          font-size: 9px;
          font-weight: 850;
        }

        .lostTextarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #d6e1ec;
          border-radius: 10px;
          font-family: inherit;
        }

        .lostButton,
        .foundButton {
          min-height: 43px;
          margin-top: 12px;
          padding: 0 15px;
          border: 0;
          border-radius: 9px;
          font-weight: 900;
          cursor: pointer;
        }

        .lostButton {
          background: #c94d57;
          color: white;
        }

        .foundButton {
          background: #1266e9;
          color: white;
        }

        .lostMessageBox {
          margin-top: 16px;
          padding: 13px;
          border-radius: 10px;
          background: white;
          border: 1px solid #f0d5d8;
        }

        .lostMessageBox span {
          color: #b94c55;
          font-size: 7px;
          font-weight: 900;
        }

        .lostMessageBox p {
          margin: 6px 0 0;
          color: #674f52;
          font-size: 9px;
        }

        .dateLine {
          color: #8795a4;
          font-size: 8px;
        }

        .lockedBox,
        .message,
        .card,
        .saveBar {
          margin-top: 16px;
          padding: 20px;
          border: 1px solid #dce6f1;
          border-radius: 14px;
          background: white;
        }

        .lockedBox {
          background: #eef5ff;
        }

        .lockedBox strong {
          color: #29425d;
          font-size: 10px;
        }

        .lockedBox p {
          color: #74869a;
          font-size: 8px;
        }

        .message {
          font-size: 9px;
        }

        .message.error {
          background: #fff7f8;
          color: #a3434c;
        }

        .message.success {
          background: #f5fbf7;
          color: #397057;
        }

        .card h2 {
          margin: 0 0 18px;
          color: #29425d;
          font-size: 17px;
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        input,
        select,
        textarea {
          width: 100%;
          border: 1px solid #d5e0eb;
          border-radius: 10px;
          font-family: inherit;
          color: #29425d;
        }

        input,
        select {
          min-height: 46px;
          padding: 0 12px;
        }

        textarea {
          padding: 12px;
          resize: vertical;
          margin-bottom: 14px;
        }

        .saveBar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          background: #eef5ff;
        }

        .saveBar strong {
          color: #29425d;
          font-size: 11px;
        }

        .saveBar p {
          margin: 4px 0 0;
          color: #8291a1;
          font-size: 8px;
        }

        .saveBar button {
          min-height: 44px;
          padding: 0 16px;
          border: 0;
          border-radius: 9px;
          background: #1266e9;
          color: white;
          font-weight: 900;
          cursor: pointer;
        }

        .statePage {
          min-height: 100vh;
          display: grid;
          place-items: center;
          background: #f7faff;
          color: #718095;
        }

        .errorCard {
          padding: 30px;
          text-align: center;
          background: white;
          border-radius: 15px;
        }

        @media (max-width: 650px) {
          .grid {
            grid-template-columns: 1fr;
          }

          .lostTop,
          .saveBar {
            flex-direction: column;
            align-items: stretch;
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
        minHeight: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent:
          "space-between",
        borderBottom:
          "1px solid #e5ebf2",
      }}
    >
      <strong
        style={{
          color: "#3c536d",
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
        style={{
          width: "44px",
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
            background: "white",
            transform:
              checked
                ? "translateX(19px)"
                : "translateX(0)",
          }}
        />
      </button>
    </div>
  );
}
