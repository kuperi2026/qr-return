"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

type Lang = "ka" | "en";

type Category =
  | "dog"
  | "cat"
  | "suitcase"
  | "bag"
  | "wallet"
  | "keys";

type Account = {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
};

type QrProfile = {
  id: string;
  owner_id: string;
  tag_code: string;
  category: Category;

  owner_first_name: string;
  owner_last_name: string;
  owner_phone: string;
  owner_email: string;

  secondary_contact_first_name: string | null;
  secondary_contact_last_name: string | null;
  secondary_contact_phone: string | null;

  whatsapp_enabled: boolean;
  whatsapp_phone: string | null;
  live_chat_enabled: boolean;

  pet_name: string | null;
  color: string;
  weight: string | null;
  breed: string | null;
  medical_info: string | null;
  distinctive_features: string | null;
  last_seen_location: string | null;
  photo_url: string | null;

  item_name: string | null;
  brand: string | null;
  model: string | null;
  size: string | null;
  material: string | null;

  show_owner_email: boolean;
  show_secondary_contact: boolean;
  show_weight: boolean;
  show_breed: boolean;
  show_medical_info: boolean;
  show_distinctive_features: boolean;
  show_last_seen_location: boolean;

  active: boolean;
};

type QrLookup = {
  tag_code: string;
  category: Category;
  available: boolean;
};

const EMPTY_FORM = {
  owner_first_name: "",
  owner_last_name: "",
  owner_phone: "",
  owner_email: "",

  secondary_contact_first_name: "",
  secondary_contact_last_name: "",
  secondary_contact_phone: "",

  whatsapp_enabled: false,
  whatsapp_phone: "",
  live_chat_enabled: false,

  pet_name: "",
  color: "",
  weight: "",
  breed: "",
  medical_info: "",
  distinctive_features: "",
  last_seen_location: "",

  item_name: "",
  brand: "",
  model: "",
  size: "",
  material: "",

  show_owner_email: false,
  show_secondary_contact: false,
  show_weight: false,
  show_breed: false,
  show_medical_info: false,
  show_distinctive_features: true,
  show_last_seen_location: true,
};

function categoryLabel(
  category: Category,
  ka: boolean
) {
  const labels: Record<Category, [string, string]> = {
    dog: ["ძაღლი", "Dog"],
    cat: ["კატა", "Cat"],
    suitcase: ["ჩემოდანი", "Suitcase"],
    bag: ["ჩანთა", "Bag"],
    wallet: ["საფულე", "Wallet"],
    keys: ["გასაღებები", "Keys"],
  };

  return ka
    ? labels[category][0]
    : labels[category][1];
}

function categoryIcon(category: Category) {
  const icons: Record<Category, string> = {
    dog: "🐕",
    cat: "🐈",
    suitcase: "🧳",
    bag: "🎒",
    wallet: "👛",
    keys: "🔑",
  };

  return icons[category];
}

export default function AccountPage() {
  const [lang, setLang] = useState<Lang>("ka");
  const ka = lang === "ka";

  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");

  const [account, setAccount] =
    useState<Account | null>(null);

  const [profiles, setProfiles] =
    useState<QrProfile[]>([]);

  const [authMode, setAuthMode] =
    useState<"login" | "register">("login");

  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [qrCode, setQrCode] =
    useState("");

  const [qrLookup, setQrLookup] =
    useState<QrLookup | null>(null);

  const [showAddProfile, setShowAddProfile] =
    useState(false);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [form, setForm] =
    useState(EMPTY_FORM);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const editingProfile = useMemo(
    () =>
      profiles.find(
        (profile) =>
          profile.id === editingId
      ) || null,
    [profiles, editingId]
  );

  useEffect(() => {
    async function init() {
      setLoading(true);

      const {
        data,
      } = await supabase.auth.getSession();

      const user =
        data.session?.user;

      if (!user) {
        setLoading(false);
        return;
      }

      setUserId(user.id);

      await loadAccount(user.id);
      await loadProfiles(user.id);

      setLoading(false);
    }

    void init();
  }, []);

  async function loadAccount(uid: string) {
    const {
      data,
      error,
    } = await supabase
      .from("owner_accounts")
      .select(`
        user_id,
        first_name,
        last_name,
        email
      `)
      .eq("user_id", uid)
      .maybeSingle();

    if (error) {
      setError(error.message);
      return;
    }

    setAccount(
      data as Account | null
    );
  }

  async function loadProfiles(uid: string) {
    const {
      data,
      error,
    } = await supabase
      .from("qr_profiles")
      .select("*")
      .eq("owner_id", uid)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      setError(error.message);
      return;
    }

    setProfiles(
      (data || []) as QrProfile[]
    );
  }

  async function register(
    event: FormEvent
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      password.length < 6
    ) {
      setError(
        ka
          ? "შეავსეთ ყველა ველი. პაროლი უნდა შეიცავდეს მინიმუმ 6 სიმბოლოს."
          : "Complete all fields. Password must contain at least 6 characters."
      );

      return;
    }

    const {
      data,
      error,
    } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          first_name:
            firstName.trim(),
          last_name:
            lastName.trim(),
        },
      },
    });

    if (error) {
      setError(error.message);
      return;
    }

    const user = data.user;

    if (!user) {
      setError(
        ka
          ? "ანგარიში ვერ შეიქმნა."
          : "Account could not be created."
      );
      return;
    }

    if (!data.session) {
      setSuccess(
        ka
          ? "ანგარიში შეიქმნა. შეამოწმეთ ელფოსტა და დაადასტურეთ რეგისტრაცია, შემდეგ შედით."
          : "Account created. Check your email, confirm registration, then sign in."
      );

      setAuthMode("login");
      return;
    }

    const {
      error: accountError,
    } = await supabase
      .from("owner_accounts")
      .insert({
        user_id: user.id,
        first_name:
          firstName.trim(),
        last_name:
          lastName.trim(),
        email:
          email.trim().toLowerCase(),
      });

    if (accountError) {
      setError(
        accountError.message
      );
      return;
    }

    setUserId(user.id);

    await loadAccount(user.id);
    await loadProfiles(user.id);

    setPassword("");
  }

  async function login(
    event: FormEvent
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const {
      data,
      error,
    } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

    if (error) {
      setError(error.message);
      return;
    }

    const user = data.user;

    if (!user) {
      return;
    }

    setUserId(user.id);

    const {
      data: existing,
    } = await supabase
      .from("owner_accounts")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!existing) {
      const meta =
        user.user_metadata || {};

      const {
        error: createAccountError,
      } = await supabase
        .from("owner_accounts")
        .insert({
          user_id: user.id,
          first_name:
            meta.first_name ||
            firstName ||
            "User",
          last_name:
            meta.last_name ||
            lastName ||
            "",
          email:
            user.email ||
            email.trim().toLowerCase(),
        });

      if (createAccountError) {
        setError(
          createAccountError.message
        );
        return;
      }
    }

    await loadAccount(user.id);
    await loadProfiles(user.id);

    setPassword("");
  }

  async function logout() {
    await supabase.auth.signOut();

    setUserId("");
    setAccount(null);
    setProfiles([]);
    setShowAddProfile(false);
    setEditingId(null);
    setQrLookup(null);
  }

  async function lookupQr() {
    setError("");
    setSuccess("");
    setQrLookup(null);

    if (!qrCode.trim()) {
      return;
    }

    const {
      data,
      error,
    } = await supabase.rpc(
      "lookup_qr_tag",
      {
        p_tag_code:
          qrCode.trim(),
      }
    );

    if (error) {
      setError(error.message);
      return;
    }

    const result =
      data?.[0] as QrLookup | undefined;

    if (!result) {
      setError(
        ka
          ? "QR კოდი ვერ მოიძებნა."
          : "QR code was not found."
      );

      return;
    }

    if (!result.available) {
      setError(
        ka
          ? "ეს QR უკვე გააქტიურებულია."
          : "This QR is already activated."
      );

      return;
    }

    setQrLookup(result);

    setForm({
      ...EMPTY_FORM,

      owner_first_name:
        account?.first_name || "",

      owner_last_name:
        account?.last_name || "",

      owner_email:
        account?.email || "",
    });
  }

  async function saveNewProfile(
    event: FormEvent
  ) {
    event.preventDefault();

    if (
      !userId ||
      !qrLookup
    ) {
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (
        !form.owner_first_name.trim() ||
        !form.owner_last_name.trim() ||
        !form.owner_phone.trim() ||
        !form.owner_email.trim() ||
        !form.color.trim()
      ) {
        throw new Error(
          ka
            ? "მფლობელის სახელი, გვარი, ტელეფონი, Email და ფერი სავალდებულოა."
            : "Owner name, phone, email and color are required."
        );
      }

      if (
        (qrLookup.category === "dog" ||
          qrLookup.category === "cat") &&
        !form.pet_name.trim()
      ) {
        throw new Error(
          ka
            ? "ცხოველის სახელი სავალდებულოა."
            : "Pet name is required."
        );
      }

      const {
        error,
      } = await supabase
        .from("qr_profiles")
        .insert({
          owner_id: userId,

          tag_code:
            qrLookup.tag_code,

          category:
            qrLookup.category,

          owner_first_name:
            form.owner_first_name.trim(),

          owner_last_name:
            form.owner_last_name.trim(),

          owner_phone:
            form.owner_phone.trim(),

          owner_email:
            form.owner_email.trim(),

          secondary_contact_first_name:
            form.secondary_contact_first_name.trim() ||
            null,

          secondary_contact_last_name:
            form.secondary_contact_last_name.trim() ||
            null,

          secondary_contact_phone:
            form.secondary_contact_phone.trim() ||
            null,

          whatsapp_enabled:
            form.whatsapp_enabled,

          whatsapp_phone:
            form.whatsapp_enabled
              ? form.whatsapp_phone.trim() ||
                null
              : null,

          live_chat_enabled:
            form.live_chat_enabled,

          pet_name:
            form.pet_name.trim() ||
            null,

          color:
            form.color.trim(),

          weight:
            form.weight.trim() ||
            null,

          breed:
            form.breed.trim() ||
            null,

          medical_info:
            form.medical_info.trim() ||
            null,

          distinctive_features:
            form.distinctive_features.trim() ||
            null,

          last_seen_location:
            form.last_seen_location.trim() ||
            null,

          item_name:
            form.item_name.trim() ||
            null,

          brand:
            form.brand.trim() ||
            null,

          model:
            form.model.trim() ||
            null,

          size:
            form.size.trim() ||
            null,

          material:
            form.material.trim() ||
            null,

          show_owner_email:
            form.show_owner_email,

          show_secondary_contact:
            form.show_secondary_contact,

          show_weight:
            form.show_weight,

          show_breed:
            form.show_breed,

          show_medical_info:
            form.show_medical_info,

          show_distinctive_features:
            form.show_distinctive_features,

          show_last_seen_location:
            form.show_last_seen_location,
        });

      if (error) {
        throw error;
      }

      await loadProfiles(userId);

      setSuccess(
        ka
          ? "QR პროფილი წარმატებით გააქტიურდა."
          : "QR profile activated successfully."
      );

      setShowAddProfile(false);
      setQrLookup(null);
      setQrCode("");
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : String(err)
      );
    } finally {
      setSaving(false);
    }
  }

  function startEdit(
    profile: QrProfile
  ) {
    setEditingId(profile.id);

    setForm({
      owner_first_name:
        profile.owner_first_name,

      owner_last_name:
        profile.owner_last_name,

      owner_phone:
        profile.owner_phone,

      owner_email:
        profile.owner_email,

      secondary_contact_first_name:
        profile.secondary_contact_first_name ||
        "",

      secondary_contact_last_name:
        profile.secondary_contact_last_name ||
        "",

      secondary_contact_phone:
        profile.secondary_contact_phone ||
        "",

      whatsapp_enabled:
        profile.whatsapp_enabled,

      whatsapp_phone:
        profile.whatsapp_phone ||
        "",

      live_chat_enabled:
        profile.live_chat_enabled,

      pet_name:
        profile.pet_name || "",

      color:
        profile.color || "",

      weight:
        profile.weight || "",

      breed:
        profile.breed || "",

      medical_info:
        profile.medical_info || "",

      distinctive_features:
        profile.distinctive_features ||
        "",

      last_seen_location:
        profile.last_seen_location ||
        "",

      item_name:
        profile.item_name || "",

      brand:
        profile.brand || "",

      model:
        profile.model || "",

      size:
        profile.size || "",

      material:
        profile.material || "",

      show_owner_email:
        profile.show_owner_email,

      show_secondary_contact:
        profile.show_secondary_contact,

      show_weight:
        profile.show_weight,

      show_breed:
        profile.show_breed,

      show_medical_info:
        profile.show_medical_info,

      show_distinctive_features:
        profile.show_distinctive_features,

      show_last_seen_location:
        profile.show_last_seen_location,
    });
  }

  async function saveEdit(
    event: FormEvent
  ) {
    event.preventDefault();

    if (
      !editingProfile ||
      !userId
    ) {
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    if (
      !form.owner_first_name.trim() ||
      !form.owner_last_name.trim() ||
      !form.owner_phone.trim() ||
      !form.owner_email.trim() ||
      !form.color.trim()
    ) {
      setError(
        ka
          ? "მფლობელის სახელი, გვარი, ტელეფონი, Email და ფერი სავალდებულოა."
          : "Owner name, phone, email and color are required."
      );
      setSaving(false);
      return;
    }

    if (
      (editingProfile.category === "dog" ||
        editingProfile.category === "cat") &&
      !form.pet_name.trim()
    ) {
      setError(
        ka
          ? "ცხოველის სახელი სავალდებულოა."
          : "Pet name is required."
      );
      setSaving(false);
      return;
    }

    const {
      error,
    } = await supabase
      .from("qr_profiles")
      .update({
        owner_first_name:
          form.owner_first_name.trim(),

        owner_last_name:
          form.owner_last_name.trim(),

        owner_phone:
          form.owner_phone.trim(),

        owner_email:
          form.owner_email.trim(),

        secondary_contact_first_name:
          form.secondary_contact_first_name.trim() ||
          null,

        secondary_contact_last_name:
          form.secondary_contact_last_name.trim() ||
          null,

        secondary_contact_phone:
          form.secondary_contact_phone.trim() ||
          null,

        whatsapp_enabled:
          form.whatsapp_enabled,

        whatsapp_phone:
          form.whatsapp_enabled
            ? form.whatsapp_phone.trim() ||
              null
            : null,

        live_chat_enabled:
          form.live_chat_enabled,

        pet_name:
          form.pet_name.trim() ||
          null,

        color:
          form.color.trim(),

        weight:
          form.weight.trim() ||
          null,

        breed:
          form.breed.trim() ||
          null,

        medical_info:
          form.medical_info.trim() ||
          null,

        distinctive_features:
          form.distinctive_features.trim() ||
          null,

        last_seen_location:
          form.last_seen_location.trim() ||
          null,

        item_name:
          form.item_name.trim() ||
          null,

        brand:
          form.brand.trim() ||
          null,

        model:
          form.model.trim() ||
          null,

        size:
          form.size.trim() ||
          null,

        material:
          form.material.trim() ||
          null,

        show_owner_email:
          form.show_owner_email,

        show_secondary_contact:
          form.show_secondary_contact,

        show_weight:
          form.show_weight,

        show_breed:
          form.show_breed,

        show_medical_info:
          form.show_medical_info,

        show_distinctive_features:
          form.show_distinctive_features,

        show_last_seen_location:
          form.show_last_seen_location,
      })
      .eq("id", editingProfile.id)
      .eq("owner_id", userId);

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    await loadProfiles(userId);

    setEditingId(null);

    setSuccess(
      ka
        ? "პროფილი განახლდა."
        : "Profile updated."
    );

    setSaving(false);
  }

  if (loading) {
    return (
      <main className="center">
        {ka ? "იტვირთება..." : "Loading..."}
        <PageStyles />
      </main>
    );
  }

  if (!account) {
    return (
      <main className="authPage">
        <section className="authCard">
          <div className="brand">
            <div className="brandMark">
              QR
            </div>

            <div>
              <strong>
                QR RETURN
              </strong>

              <small>
                MY ACCOUNT
              </small>
            </div>
          </div>

          <div className="tabs">
            <button
              type="button"
              className={
                authMode === "login"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setAuthMode("login")
              }
            >
              {ka
                ? "შესვლა"
                : "Sign in"}
            </button>

            <button
              type="button"
              className={
                authMode === "register"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setAuthMode("register")
              }
            >
              {ka
                ? "რეგისტრაცია"
                : "Register"}
            </button>
          </div>

          <form
            onSubmit={
              authMode === "register"
                ? register
                : login
            }
          >
            {authMode === "register" && (
              <>
                <Field
                  label={
                    ka
                      ? "სახელი"
                      : "First name"
                  }
                  value={firstName}
                  required
                  onChange={
                    setFirstName
                  }
                />

                <Field
                  label={
                    ka
                      ? "გვარი"
                      : "Last name"
                  }
                  value={lastName}
                  required
                  onChange={
                    setLastName
                  }
                />
              </>
            )}

            <Field
              type="email"
              label="Email"
              value={email}
              required
              onChange={setEmail}
            />

            <Field
              type="password"
              label={
                ka
                  ? "პაროლი"
                  : "Password"
              }
              value={password}
              required
              onChange={setPassword}
            />

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

            <button
              type="submit"
              className="primary authSubmit"
            >
              {authMode === "register"
                ? ka
                  ? "ანგარიშის შექმნა"
                  : "Create account"
                : ka
                ? "შესვლა"
                : "Sign in"}
            </button>
          </form>
        </section>

        <PageStyles />
      </main>
    );
  }

  return (
    <main className="accountPage">
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
              MY ACCOUNT
            </small>
          </div>
        </a>

        <div className="headerRight">
          <button
            type="button"
            onClick={() =>
              setLang(
                ka ? "en" : "ka"
              )
            }
            className="lang"
          >
            {ka ? "ENG" : "GEO"}
          </button>

          <button
            type="button"
            className="logout"
            onClick={logout}
          >
            {ka
              ? "გასვლა"
              : "Sign out"}
          </button>
        </div>
      </header>

      <section className="container">
        <div className="welcomeTop">
          <div>
            <span>
              {ka
                ? "მოგესალმებით"
                : "Welcome"}
            </span>

            <h1>
              {account.first_name}{" "}
              {account.last_name}
            </h1>

            <p>
              {account.email}
            </p>
          </div>

          <button
            type="button"
            className="addButton"
            onClick={() => {
              setShowAddProfile(true);
              setEditingId(null);
              setQrLookup(null);
              setQrCode("");

              setForm({
                ...EMPTY_FORM,
                owner_first_name:
                  account.first_name,
                owner_last_name:
                  account.last_name,
                owner_email:
                  account.email,
              });
            }}
          >
            +{" "}
            {ka
              ? "QR პროფილის დამატება"
              : "Add QR profile"}
          </button>
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

        {showAddProfile && (
          <section className="panel">
            {!qrLookup ? (
              <>
                <h2>
                  {ka
                    ? "დაამატეთ QR"
                    : "Add QR"}
                </h2>

                <p>
                  {ka
                    ? "შეიყვანეთ პროდუქტზე დაბეჭდილი QR კოდი. სისტემა ავტომატურად განსაზღვრავს კატეგორიას."
                    : "Enter the QR code printed on the product. The system will determine its category automatically."}
                </p>

                <div className="qrLookup">
                  <input
                    value={qrCode}
                    placeholder="DOG-TEST001"
                    onChange={(event) =>
                      setQrCode(
                        event.target.value
                      )
                    }
                  />

                  <button
                    type="button"
                    onClick={lookupQr}
                  >
                    {ka
                      ? "შემოწმება"
                      : "Check"}
                  </button>
                </div>
              </>
            ) : (
              <ProfileForm
                ka={ka}
                category={
                  qrLookup.category
                }
                tagCode={
                  qrLookup.tag_code
                }
                form={form}
                setForm={setForm}
                saving={saving}
                onSubmit={
                  saveNewProfile
                }
                onCancel={() => {
                  setShowAddProfile(false);
                  setQrLookup(null);
                }}
              />
            )}
          </section>
        )}

        {editingProfile && (
          <section className="panel">
            <ProfileForm
              ka={ka}
              category={
                editingProfile.category
              }
              tagCode={
                editingProfile.tag_code
              }
              form={form}
              setForm={setForm}
              saving={saving}
              editing
              onSubmit={saveEdit}
              onCancel={() =>
                setEditingId(null)
              }
            />
          </section>
        )}

        <section className="profilesSection">
          <h2>
            {ka
              ? "ჩემი QR პროფილები"
              : "My QR Profiles"}
          </h2>

          {profiles.length === 0 ? (
            <div className="empty">
              <div>🏷️</div>

              <strong>
                {ka
                  ? "ჯერ არცერთი QR პროფილი არ გაქვთ."
                  : "You do not have any QR profiles yet."}
              </strong>
            </div>
          ) : (
            <div className="profileGrid">
              {profiles.map(
                (profile) => (
                  <article
                    key={profile.id}
                    className="profileCard"
                  >
                    <div className="profileIcon">
                      {categoryIcon(
                        profile.category
                      )}
                    </div>

                    <div className="profileCategory">
                      {categoryLabel(
                        profile.category,
                        ka
                      )}
                    </div>

                    <h3>
                      {profile.pet_name ||
                        profile.item_name ||
                        profile.tag_code}
                    </h3>

                    <div className="tag">
                      {profile.tag_code}
                    </div>

                    <div className="profileActions">
                      <button
                        type="button"
                        onClick={() =>
                          startEdit(
                            profile
                          )
                        }
                      >
                        ✏️{" "}
                        {ka
                          ? "რედაქტირება"
                          : "Edit"}
                      </button>

                      <a
                        href={`/q/${encodeURIComponent(
                          profile.tag_code
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        👁{" "}
                        {ka
                          ? "QR გვერდი"
                          : "QR Page"}
                      </a>
                    </div>
                  </article>
                )
              )}
            </div>
          )}
        </section>
      </section>

      <PageStyles />
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
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
        required={required}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
      />
    </label>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
  disabled = false,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (
    checked: boolean
  ) => void;
  disabled?: boolean;
}) {
  return (
    <label
      className={
        disabled
          ? "toggleRow disabled"
          : "toggleRow"
      }
    >
      <div>
        <strong>{label}</strong>

        {description && (
          <small>
            {description}
          </small>
        )}
      </div>

      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) =>
          onChange(
            event.target.checked
          )
        }
      />
    </label>
  );
}

function ProfileForm({
  ka,
  category,
  tagCode,
  form,
  setForm,
  saving,
  editing = false,
  onSubmit,
  onCancel,
}: {
  ka: boolean;
  category: Category;
  tagCode: string;
  form: typeof EMPTY_FORM;
  setForm: React.Dispatch<
    React.SetStateAction<
      typeof EMPTY_FORM
    >
  >;
  saving: boolean;
  editing?: boolean;
  onSubmit: (
    event: FormEvent
  ) => void;
  onCancel: () => void;
}) {
  const pet =
    category === "dog" ||
    category === "cat";

  function update<
    K extends keyof typeof EMPTY_FORM
  >(
    key: K,
    value:
      (typeof EMPTY_FORM)[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="formTitle">
        <div>
          <span>
            {categoryIcon(
              category
            )}{" "}
            {categoryLabel(
              category,
              ka
            )}
          </span>

          <h2>
            {editing
              ? ka
                ? "პროფილის რედაქტირება"
                : "Edit profile"
              : ka
              ? "QR პროფილის შექმნა"
              : "Create QR profile"}
          </h2>
        </div>

        <div className="lockedQr">
          🔒 {tagCode}
        </div>
      </div>

      <div className="notice">
        {ka
          ? "QR კოდი და კატეგორია ფიქსირებულია. ამავე კატეგორიის ფარგლებში პროფილის სხვა მონაცემების შეცვლა შეგიძლიათ."
          : "The QR code and category are locked. Other profile details may be updated within this category."}
      </div>

      <h3 className="sectionTitle">
        {ka
          ? "მფლობელის ინფორმაცია"
          : "Owner information"}
      </h3>

      <div className="formGrid">
        <Field
          label={
            ka
              ? "სახელი"
              : "First name"
          }
          required
          value={
            form.owner_first_name
          }
          onChange={(value) =>
            update(
              "owner_first_name",
              value
            )
          }
        />

        <Field
          label={
            ka
              ? "გვარი"
              : "Last name"
          }
          required
          value={
            form.owner_last_name
          }
          onChange={(value) =>
            update(
              "owner_last_name",
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
          required
          value={
            form.owner_phone
          }
          onChange={(value) =>
            update(
              "owner_phone",
              value
            )
          }
        />

        <Field
          type="email"
          label="Email"
          required
          value={
            form.owner_email
          }
          onChange={(value) =>
            update(
              "owner_email",
              value
            )
          }
        />
      </div>

      <div className="requiredContact">
        <strong>
          📞{" "}
          {ka
            ? "ტელეფონი სავალდებულოა"
            : "Phone is required"}
        </strong>

        <span>
          {ka
            ? "QR-ის დასკანერებისას მპოვნელს ყოველთვის ექნება მფლობელთან დარეკვის ღილაკი."
            : "The finder will always have a Call Owner button after scanning the QR."}
        </span>
      </div>

      <h3 className="sectionTitle">
        {ka
          ? "დაკავშირების მეთოდები"
          : "Contact methods"}
      </h3>

      <div className="toggleGrid">
        <Toggle
          label={
            ka
              ? "📞 ტელეფონი"
              : "📞 Phone"
          }
          description={
            ka
              ? "ყოველთვის ჩართული"
              : "Always enabled"
          }
          checked
          disabled
          onChange={() => {}}
        />

        <Toggle
          label="🟢 WhatsApp"
          description={
            ka
              ? "მპოვნელს WhatsApp-ით დაკავშირების უფლება"
              : "Allow the finder to contact you on WhatsApp"
          }
          checked={
            form.whatsapp_enabled
          }
          onChange={(value) =>
            update(
              "whatsapp_enabled",
              value
            )
          }
        />

        <Toggle
          label="💬 Live Chat"
          description={
            ka
              ? "მპოვნელმა QR RETURN-ში მოგწეროთ"
              : "Allow the finder to message you through QR RETURN"
          }
          checked={
            form.live_chat_enabled
          }
          onChange={(value) =>
            update(
              "live_chat_enabled",
              value
            )
          }
        />
      </div>

      {form.whatsapp_enabled && (
        <div className="whatsappBox">
          <Field
            label={
              ka
                ? "WhatsApp ნომერი — სურვილისამებრ"
                : "WhatsApp number — optional"
            }
            value={
              form.whatsapp_phone
            }
            onChange={(value) =>
              update(
                "whatsapp_phone",
                value
              )
            }
          />

          <p>
            {ka
              ? "თუ ცალკე ნომერს არ მიუთითებთ, სისტემა გამოიყენებს ზემოთ მითითებულ მფლობელის ტელეფონს."
              : "If you leave this blank, the owner's phone number above will be used."}
          </p>
        </div>
      )}

      <h3 className="sectionTitle">
        {ka
          ? "დამატებითი საკონტაქტო პირი — სურვილისამებრ"
          : "Additional contact — optional"}
      </h3>

      <div className="formGrid">
        <Field
          label={
            ka
              ? "სახელი"
              : "First name"
          }
          value={
            form.secondary_contact_first_name
          }
          onChange={(value) =>
            update(
              "secondary_contact_first_name",
              value
            )
          }
        />

        <Field
          label={
            ka
              ? "გვარი"
              : "Last name"
          }
          value={
            form.secondary_contact_last_name
          }
          onChange={(value) =>
            update(
              "secondary_contact_last_name",
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
          value={
            form.secondary_contact_phone
          }
          onChange={(value) =>
            update(
              "secondary_contact_phone",
              value
            )
          }
        />
      </div>

      <h3 className="sectionTitle">
        {pet
          ? ka
            ? "ცხოველის ინფორმაცია"
            : "Pet information"
          : ka
          ? "ნივთის ინფორმაცია"
          : "Item information"}
      </h3>

      {pet ? (
        <div className="formGrid">
          <Field
            label={
              ka
                ? "სახელი"
                : "Name"
            }
            required
            value={
              form.pet_name
            }
            onChange={(value) =>
              update(
                "pet_name",
                value
              )
            }
          />

          <Field
            label={
              ka
                ? "ფერი"
                : "Color"
            }
            required
            value={form.color}
            onChange={(value) =>
              update(
                "color",
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
            value={form.weight}
            onChange={(value) =>
              update(
                "weight",
                value
              )
            }
          />

          <Field
            label={
              ka
                ? "ჯიში"
                : "Breed"
            }
            value={form.breed}
            onChange={(value) =>
              update(
                "breed",
                value
              )
            }
          />
        </div>
      ) : (
        <div className="formGrid">
          <Field
            label={
              ka
                ? "ნივთის სახელი"
                : "Item name"
            }
            value={
              form.item_name
            }
            onChange={(value) =>
              update(
                "item_name",
                value
              )
            }
          />

          <Field
            label={
              ka
                ? "ფერი"
                : "Color"
            }
            required
            value={form.color}
            onChange={(value) =>
              update(
                "color",
                value
              )
            }
          />

          <Field
            label={
              ka
                ? "ბრენდი"
                : "Brand"
            }
            value={form.brand}
            onChange={(value) =>
              update(
                "brand",
                value
              )
            }
          />

          <Field
            label={
              ka
                ? "მოდელი"
                : "Model"
            }
            value={form.model}
            onChange={(value) =>
              update(
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
              update(
                "size",
                value
              )
            }
          />

          <Field
            label={
              ka
                ? "მასალა"
                : "Material"
            }
            value={
              form.material
            }
            onChange={(value) =>
              update(
                "material",
                value
              )
            }
          />
        </div>
      )}

      <div className="longFields">
        {pet && (
          <label className="field">
            <span>
              {ka
                ? "სამედიცინო ინფორმაცია"
                : "Medical information"}
            </span>

            <textarea
              value={
                form.medical_info
              }
              onChange={(event) =>
                update(
                  "medical_info",
                  event.target.value
                )
              }
            />
          </label>
        )}

        <label className="field">
          <span>
            {ka
              ? "დამატებითი / განმასხვავებელი ნიშნები"
              : "Distinctive features"}
          </span>

          <textarea
            value={
              form.distinctive_features
            }
            onChange={(event) =>
              update(
                "distinctive_features",
                event.target.value
              )
            }
          />
        </label>

        <label className="field">
          <span>
            {ka
              ? "ბოლოს ნანახი ადგილი"
              : "Last seen location"}
          </span>

          <input
            value={
              form.last_seen_location
            }
            onChange={(event) =>
              update(
                "last_seen_location",
                event.target.value
              )
            }
          />
        </label>
      </div>

      <h3 className="sectionTitle">
        {ka
          ? "რა გამოჩნდეს QR-ის დასკანერებისას?"
          : "What should appear after scanning the QR?"}
      </h3>

      <div className="mandatory">
        <strong>
          {ka
            ? "სავალდებულოდ გამოჩნდება:"
            : "Always visible:"}
        </strong>

        <span>
          ✓{" "}
          {ka
            ? "მფლობელის სახელი და გვარი"
            : "Owner full name"}
        </span>

        <span>
          ✓{" "}
          {ka
            ? "მფლობელის ტელეფონი"
            : "Owner phone"}
        </span>

        <span>
          ✓{" "}
          {ka
            ? "ფერი"
            : "Color"}
        </span>
      </div>

      <div className="toggleGrid visibility">
        <Toggle
          label={
            ka
              ? "Email-ის გამოჩენა"
              : "Show email"
          }
          checked={
            form.show_owner_email
          }
          onChange={(value) =>
            update(
              "show_owner_email",
              value
            )
          }
        />

        <Toggle
          label={
            ka
              ? "დამატებითი საკონტაქტო პირის გამოჩენა"
              : "Show additional contact"
          }
          checked={
            form.show_secondary_contact
          }
          onChange={(value) =>
            update(
              "show_secondary_contact",
              value
            )
          }
        />

        {pet && (
          <>
            <Toggle
              label={
                ka
                  ? "წონის გამოჩენა"
                  : "Show weight"
              }
              checked={
                form.show_weight
              }
              onChange={(value) =>
                update(
                  "show_weight",
                  value
                )
              }
            />

            <Toggle
              label={
                ka
                  ? "ჯიშის გამოჩენა"
                  : "Show breed"
              }
              checked={
                form.show_breed
              }
              onChange={(value) =>
                update(
                  "show_breed",
                  value
                )
              }
            />

            <Toggle
              label={
                ka
                  ? "სამედიცინო ინფორმაციის გამოჩენა"
                  : "Show medical information"
              }
              checked={
                form.show_medical_info
              }
              onChange={(value) =>
                update(
                  "show_medical_info",
                  value
                )
              }
            />
          </>
        )}

        <Toggle
          label={
            ka
              ? "დამატებითი ნიშნების გამოჩენა"
              : "Show distinctive features"
          }
          checked={
            form.show_distinctive_features
          }
          onChange={(value) =>
            update(
              "show_distinctive_features",
              value
            )
          }
        />

        <Toggle
          label={
            ka
              ? "ბოლოს ნანახი ადგილის გამოჩენა"
              : "Show last seen location"
          }
          checked={
            form.show_last_seen_location
          }
          onChange={(value) =>
            update(
              "show_last_seen_location",
              value
            )
          }
        />
      </div>

      <div className="formActions">
        <button
          type="button"
          className="secondary"
          onClick={onCancel}
        >
          {ka
            ? "გაუქმება"
            : "Cancel"}
        </button>

        <button
          type="submit"
          className="primary"
          disabled={saving}
        >
          {saving
            ? "..."
            : editing
            ? ka
              ? "ცვლილებების შენახვა"
              : "Save changes"
            : ka
            ? "QR-ის გააქტიურება"
            : "Activate QR"}
        </button>
      </div>
    </form>
  );
}

function PageStyles() {
  return (
    <style jsx global>{`
      * {
        box-sizing: border-box;
      }

      html,
      body {
        margin: 0;
        padding: 0;
      }

      body {
        background: #f5f7fb;
      }

      button,
      input,
      textarea {
        font: inherit;
      }

      .authPage,
      .accountPage,
      .center {
        min-height: 100vh;
        font-family:
          Inter,
          Arial,
          sans-serif;
        color: #101828;
      }

      .center,
      .authPage {
        display: grid;
        place-items: center;
        padding: 24px;
      }

      .authPage {
        background:
          radial-gradient(
            circle at 90% 10%,
            rgba(118,85,247,.14),
            transparent 30%
          ),
          #f5f7fb;
      }

      .authCard {
        width: 100%;
        max-width: 440px;
        padding: 30px;
        border: 1px solid #e4e7ec;
        border-radius: 22px;
        background: white;
        box-shadow:
          0 20px 60px rgba(16,24,40,.08);
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 10px;
        color: inherit;
        text-decoration: none;
      }

      .brandMark {
        width: 47px;
        height: 47px;
        display: grid;
        place-items: center;
        border-radius: 13px;
        background:
          linear-gradient(
            135deg,
            #1465e8,
            #7655f7
          );
        color: white;
        font-size: 12px;
        font-weight: 900;
      }

      .brand strong,
      .brand small {
        display: block;
      }

      .brand strong {
        color: #1465e8;
        font-size: 19px;
        font-weight: 900;
      }

      .brand small {
        margin-top: 3px;
        color: #7655f7;
        font-size: 8px;
        font-weight: 900;
        letter-spacing: 1.7px;
      }

      .tabs {
        margin: 27px 0 21px;
        padding: 4px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4px;
        border-radius: 10px;
        background: #f2f4f7;
      }

      .tabs button {
        padding: 11px;
        border: 0;
        border-radius: 8px;
        background: transparent;
        cursor: pointer;
      }

      .tabs button.active {
        background: white;
        color: #1465e8;
        font-weight: 900;
        box-shadow:
          0 3px 10px rgba(16,24,40,.06);
      }

      .field {
        margin-bottom: 14px;
        display: block;
      }

      .field > span {
        margin-bottom: 7px;
        display: block;
        color: #475467;
        font-size: 13px;
        font-weight: 800;
      }

      .field input,
      .field textarea {
        width: 100%;
        padding: 12px;
        border: 1px solid #d0d5dd;
        border-radius: 10px;
        background: white;
        color: #101828;
        outline: none;
        font-size: 14px;
      }

      .field textarea {
        min-height: 96px;
        resize: vertical;
      }

      .field input:focus,
      .field textarea:focus {
        border-color: #1465e8;
        box-shadow:
          0 0 0 3px rgba(20,101,232,.08);
      }

      .primary,
      .secondary {
        min-height: 44px;
        padding: 0 18px;
        border-radius: 10px;
        font-weight: 900;
        cursor: pointer;
      }

      .primary {
        border: 0;
        background: #1465e8;
        color: white;
      }

      .secondary {
        border: 1px solid #d0d5dd;
        background: white;
        color: #475467;
      }

      .authSubmit {
        width: 100%;
        margin-top: 8px;
      }

      .error,
      .success {
        margin: 12px 0;
        padding: 11px 13px;
        border-radius: 9px;
        font-size: 12px;
        line-height: 1.5;
      }

      .error {
        border: 1px solid #fecdca;
        background: #fff1f0;
        color: #b42318;
      }

      .success {
        border: 1px solid #abefc6;
        background: #ecfdf3;
        color: #067647;
      }

      .accountPage {
        background: #f5f7fb;
      }

      .header {
        min-height: 78px;
        padding: 0 28px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #e4e7ec;
        background: white;
      }

      .headerRight {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .lang,
      .logout {
        padding: 9px 11px;
        border-radius: 8px;
        cursor: pointer;
      }

      .lang {
        border: 1px solid #e4e7ec;
        background: white;
      }

      .logout {
        border: 0;
        background: #f2f4f7;
      }

      .container {
        width: calc(100% - 30px);
        max-width: 1080px;
        margin: auto;
        padding: 46px 0 80px;
      }

      .welcomeTop {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 22px;
      }

      .welcomeTop span {
        color: #7655f7;
        font-size: 11px;
        font-weight: 900;
      }

      .welcomeTop h1 {
        margin: 6px 0 3px;
        font-size: 36px;
      }

      .welcomeTop p {
        margin: 0;
        color: #667085;
        font-size: 13px;
      }

      .addButton {
        padding: 13px 17px;
        border: 0;
        border-radius: 11px;
        background: #1465e8;
        color: white;
        font-weight: 900;
        cursor: pointer;
      }

      .panel {
        margin-top: 28px;
        padding: 26px;
        border: 1px solid #e4e7ec;
        border-radius: 18px;
        background: white;
      }

      .panel > h2 {
        margin-top: 0;
      }

      .panel > p {
        color: #667085;
        line-height: 1.6;
      }

      .qrLookup {
        display: flex;
        gap: 8px;
      }

      .qrLookup input {
        flex: 1;
        min-height: 45px;
        padding: 0 12px;
        border: 1px solid #d0d5dd;
        border-radius: 9px;
      }

      .qrLookup button {
        padding: 0 18px;
        border: 0;
        border-radius: 9px;
        background: #1465e8;
        color: white;
        font-weight: 900;
        cursor: pointer;
      }

      .profilesSection {
        margin-top: 40px;
      }

      .profilesSection > h2 {
        font-size: 23px;
      }

      .profileGrid {
        display: grid;
        grid-template-columns:
          repeat(3, 1fr);
        gap: 13px;
      }

      .profileCard {
        padding: 20px;
        border: 1px solid #e4e7ec;
        border-radius: 17px;
        background: white;
      }

      .profileIcon {
        width: 52px;
        height: 52px;
        display: grid;
        place-items: center;
        border-radius: 14px;
        background: #eef4ff;
        font-size: 26px;
      }

      .profileCategory {
        margin-top: 16px;
        color: #7655f7;
        font-size: 10px;
        font-weight: 900;
        text-transform: uppercase;
      }

      .profileCard h3 {
        margin: 5px 0;
        font-size: 19px;
      }

      .tag {
        color: #667085;
        font-size: 10px;
        font-weight: 800;
      }

      .profileActions {
        margin-top: 18px;
        display: flex;
        gap: 7px;
      }

      .profileActions button,
      .profileActions a {
        flex: 1;
        padding: 9px;
        border: 1px solid #e4e7ec;
        border-radius: 8px;
        background: white;
        color: #344054;
        font-size: 10px;
        font-weight: 800;
        text-align: center;
        text-decoration: none;
        cursor: pointer;
      }

      .empty {
        min-height: 180px;
        display: grid;
        place-items: center;
        align-content: center;
        gap: 8px;
        border: 1px dashed #d0d5dd;
        border-radius: 15px;
        color: #98a2b3;
        text-align: center;
      }

      .empty > div {
        font-size: 35px;
      }

      .formTitle {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
      }

      .formTitle > div > span {
        color: #7655f7;
        font-size: 11px;
        font-weight: 900;
      }

      .formTitle h2 {
        margin: 5px 0 0;
      }

      .lockedQr {
        padding: 8px 10px;
        border-radius: 8px;
        background: #f2f4f7;
        color: #475467;
        font-size: 10px;
        font-weight: 900;
      }

      .notice {
        margin: 18px 0 25px;
        padding: 11px 13px;
        border: 1px solid #b2ccff;
        border-radius: 9px;
        background: #eff8ff;
        color: #175cd3;
        font-size: 11px;
        line-height: 1.5;
      }

      .sectionTitle {
        margin: 28px 0 13px;
        padding-bottom: 8px;
        border-bottom: 1px solid #eaecf0;
        color: #344054;
        font-size: 15px;
      }

      .formGrid {
        display: grid;
        grid-template-columns:
          repeat(2, 1fr);
        gap: 0 13px;
      }

      .longFields {
        margin-top: 4px;
      }

      .requiredContact {
        margin-top: 6px;
        padding: 13px;
        border: 1px solid #b2ddff;
        border-radius: 10px;
        background: #eff8ff;
        color: #175cd3;
      }

      .requiredContact strong,
      .requiredContact span {
        display: block;
      }

      .requiredContact strong {
        font-size: 12px;
      }

      .requiredContact span {
        margin-top: 4px;
        font-size: 10px;
        line-height: 1.45;
      }

      .toggleGrid {
        display: grid;
        grid-template-columns:
          repeat(2, 1fr);
        gap: 9px;
      }

      .toggleRow {
        min-height: 60px;
        padding: 11px 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        border: 1px solid #e4e7ec;
        border-radius: 11px;
        color: #475467;
        background: white;
      }

      .toggleRow strong,
      .toggleRow small {
        display: block;
      }

      .toggleRow strong {
        font-size: 12px;
      }

      .toggleRow small {
        margin-top: 3px;
        color: #98a2b3;
        font-size: 9px;
        line-height: 1.4;
      }

      .toggleRow input {
        width: 19px;
        height: 19px;
      }

      .toggleRow.disabled {
        background: #f8fafc;
      }

      .whatsappBox {
        margin-top: 11px;
        padding: 15px;
        border: 1px solid #abefc6;
        border-radius: 11px;
        background: #ecfdf3;
      }

      .whatsappBox p {
        margin: -5px 0 0;
        color: #067647;
        font-size: 10px;
        line-height: 1.5;
      }

      .mandatory {
        padding: 14px;
        display: grid;
        gap: 7px;
        border-radius: 11px;
        background: #ecfdf3;
        color: #067647;
        font-size: 11px;
      }

      .mandatory strong {
        font-size: 12px;
      }

      .visibility {
        margin-top: 13px;
      }

      .formActions {
        margin-top: 28px;
        display: flex;
        justify-content: flex-end;
        gap: 8px;
      }

      @media (max-width: 760px) {
        .welcomeTop {
          align-items: flex-start;
          flex-direction: column;
        }

        .addButton {
          width: 100%;
        }

        .profileGrid {
          grid-template-columns: 1fr;
        }

        .formGrid,
        .toggleGrid {
          grid-template-columns: 1fr;
        }

        .qrLookup {
          flex-direction: column;
        }

        .qrLookup button {
          min-height: 44px;
        }

        .formTitle {
          align-items: flex-start;
          flex-direction: column;
        }
      }
    `}</style>
  );
}
