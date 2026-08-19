"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Lang = "ka" | "en";

type OwnerAccount = {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string | null;
  photo: string | null;
};

type QrProfile = {
  id: string;
  item_name: string | null;
  item_type: string | null;
  pet_type: string | null;
  photo: string | null;
  tag_code: string | null;
  active: boolean | null;
};

export default function AccountPage() {
  const [lang, setLang] = useState<Lang>("ka");

  const [owner, setOwner] = useState<OwnerAccount | null>(null);
  const [profiles, setProfiles] = useState<QrProfile[]>([]);

  const [editing, setEditing] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const ka = lang === "ka";

  useEffect(() => {
    loadAccount();
  }, []);

  async function loadAccount() {
    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        window.location.href = "/login";
        return;
      }

      const { data: ownerData, error: ownerError } = await supabase
        .from("owner_accounts")
        .select(
          "user_id, first_name, last_name, email, phone, address, photo"
        )
        .eq("user_id", user.id)
        .maybeSingle();

      if (ownerError) {
        throw ownerError;
      }

      let finalOwner = ownerData as OwnerAccount | null;

      if (!finalOwner) {
        const newOwner = {
          user_id: user.id,
          first_name: user.user_metadata?.first_name ?? "",
          last_name: user.user_metadata?.last_name ?? "",
          email: user.email ?? "",
          phone: user.user_metadata?.phone ?? "",
          address: null,
          photo: null,
        };

        const { data: createdOwner, error: createError } = await supabase
          .from("owner_accounts")
          .insert(newOwner)
          .select(
            "user_id, first_name, last_name, email, phone, address, photo"
          )
          .single();

        if (createError) {
          throw createError;
        }

        finalOwner = createdOwner as OwnerAccount;
      }

      setOwner(finalOwner);

      setFirstName(finalOwner.first_name ?? "");
      setLastName(finalOwner.last_name ?? "");
      setPhone(finalOwner.phone ?? "");
      setAddress(finalOwner.address ?? "");

      const { data: profileData, error: profileError } = await supabase
        .from("item")
        .select(
          "id, item_name, item_type, pet_type, photo, tag_code, active"
        )
        .eq("owner_id", user.id);

      if (profileError) {
        throw profileError;
      }

      setProfiles((profileData ?? []) as QrProfile[]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : ka
          ? "ანგარიშის ჩატვირთვა ვერ მოხერხდა."
          : "Could not load account."
      );
    } finally {
      setLoading(false);
    }
  }

  async function uploadOwnerPhoto(userId: string) {
    if (!photoFile) {
      return owner?.photo ?? null;
    }

    const safeName = photoFile.name.replace(
      /[^a-zA-Z0-9._-]/g,
      "-"
    );

    const path = `${userId}/owner-${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("qr-return-images")
      .upload(path, photoFile);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from("qr-return-images")
      .getPublicUrl(path);

    return data.publicUrl;
  }

  async function saveOwner(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!firstName.trim() || !lastName.trim() || !phone.trim()) {
      setError(
        ka
          ? "სახელი, გვარი და ტელეფონი სავალდებულოა."
          : "First name, last name and phone are required."
      );
      return;
    }

    setSaving(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        window.location.href = "/login";
        return;
      }

      const photo = await uploadOwnerPhoto(user.id);

      const updates = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim(),
        address: address.trim() || null,
        photo,
        updated_at: new Date().toISOString(),
      };

      const { data, error: updateError } = await supabase
        .from("owner_accounts")
        .update(updates)
        .eq("user_id", user.id)
        .select(
          "user_id, first_name, last_name, email, phone, address, photo"
        )
        .single();

      if (updateError) {
        throw updateError;
      }

      setOwner(data as OwnerAccount);
      setEditing(false);

      setSuccess(
        ka
          ? "პროფილი წარმატებით განახლდა."
          : "Profile updated successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : ka
          ? "ცვლილებების შენახვა ვერ მოხერხდა."
          : "Could not save changes."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  function getType(profile: QrProfile) {
    if (profile.pet_type === "dog") {
      return {
        icon: "🐶",
        label: ka ? "ძაღლი" : "Dog",
      };
    }

    if (profile.pet_type === "cat") {
      return {
        icon: "🐱",
        label: ka ? "კატა" : "Cat",
      };
    }

    switch (profile.item_type) {
      case "keys":
        return {
          icon: "🔑",
          label: ka ? "გასაღები" : "Keys",
        };

      case "wallet":
        return {
          icon: "👛",
          label: ka ? "საფულე" : "Wallet",
        };

      case "bag":
        return {
          icon: "👜",
          label: ka ? "ჩანთა" : "Bag",
        };

      case "suitcase":
        return {
          icon: "🧳",
          label: ka ? "ჩემოდანი" : "Suitcase",
        };

      default:
        return {
          icon: "🏷️",
          label: ka ? "QR პროფილი" : "QR Profile",
        };
    }
  }

  if (loading) {
    return (
      <main className="statePage">
        {ka ? "იტვირთება..." : "Loading..."}
      </main>
    );
  }

  if (!owner) {
    return (
      <main className="statePage">
        {error ||
          (ka
            ? "მფლობელის პროფილი ვერ მოიძებნა."
            : "Owner profile not found.")}
      </main>
    );
  }

  return (
    <main className="page">
      <header className="header">
        <a href="/" className="brand">
          <div className="logo">QR</div>

          <div>
            <strong>QR RETURN</strong>
            <small>OWNER ACCOUNT</small>
          </div>
        </a>

        <div className="headerRight">
          <div className="languages">
            <button
              type="button"
              className={ka ? "active" : ""}
              onClick={() => setLang("ka")}
            >
              GEO
            </button>

            <button
              type="button"
              className={!ka ? "active" : ""}
              onClick={() => setLang("en")}
            >
              ENG
            </button>
          </div>

          <button
            type="button"
            className="logoutButton"
            onClick={handleLogout}
          >
            {ka ? "გასვლა" : "Sign out"}
          </button>
        </div>
      </header>

      <section className="container">
        <div className="pageTitle">
          <div>
            <div className="eyebrow">
              {ka ? "მფლობელის პროფილი" : "OWNER PROFILE"}
            </div>

            <h1>
              {owner.first_name} {owner.last_name}
            </h1>

            <p>
              {ka
                ? "მართეთ თქვენი პირადი ინფორმაცია, ადმინისტრატორი და ყველა QR პროფილი ერთი ანგარიშიდან."
                : "Manage your personal information, administrator and all QR profiles from one account."}
            </p>
          </div>
        </div>

        {error && <div className="errorBox">{error}</div>}
        {success && <div className="successBox">{success}</div>}

        <section className="ownerCard">
          <div className="ownerTop">
            <div className="ownerPhotoWrap">
              {owner.photo ? (
                <img
                  src={owner.photo}
                  alt={`${owner.first_name} ${owner.last_name}`}
                />
              ) : (
                <div className="ownerPlaceholder">👤</div>
              )}
            </div>

            <div className="ownerIdentity">
              <span>
                {ka ? "ანგარიშის მფლობელი" : "Account owner"}
              </span>

              <h2>
                {owner.first_name} {owner.last_name}
              </h2>

              <p>{owner.email}</p>
              <p>{owner.phone}</p>
            </div>

            {!editing && (
              <button
                type="button"
                className="editOwnerButton"
                onClick={() => {
                  setSuccess("");
                  setEditing(true);
                }}
              >
                ✏️ {ka ? "პროფილის რედაქტირება" : "Edit profile"}
              </button>
            )}
          </div>

          {!editing ? (
            <div className="ownerInfoGrid">
              <div className="infoBox">
                <span>{ka ? "სახელი" : "First name"}</span>
                <strong>{owner.first_name}</strong>
              </div>

              <div className="infoBox">
                <span>{ka ? "გვარი" : "Last name"}</span>
                <strong>{owner.last_name}</strong>
              </div>

              <div className="infoBox">
                <span>{ka ? "ელფოსტა" : "Email"}</span>
                <strong>{owner.email}</strong>
              </div>

              <div className="infoBox">
                <span>{ka ? "ტელეფონი" : "Phone"}</span>
                <strong>{owner.phone}</strong>
              </div>

              <div className="infoBox full">
                <span>
                  {ka
                    ? "მისამართი — ნებაყოფლობითი"
                    : "Address — optional"}
                </span>

                <strong>
                  {owner.address ||
                    (ka ? "არ არის მითითებული" : "Not provided")}
                </strong>
              </div>
            </div>
          ) : (
            <form className="editForm" onSubmit={saveOwner}>
              <div className="twoColumns">
                <label>
                  <span>{ka ? "სახელი" : "First name"} *</span>

                  <input
                    value={firstName}
                    onChange={(e) =>
                      setFirstName(e.target.value)
                    }
                    required
                  />
                </label>

                <label>
                  <span>{ka ? "გვარი" : "Last name"} *</span>

                  <input
                    value={lastName}
                    onChange={(e) =>
                      setLastName(e.target.value)
                    }
                    required
                  />
                </label>
              </div>

              <label>
                <span>{ka ? "ელფოსტა" : "Email"}</span>

                <input
                  value={owner.email}
                  disabled
                />

                <small>
                  {ka
                    ? "ელფოსტას ახლა არ ვცვლით — ეს Login-ის მისამართია."
                    : "Email is not editable here because it is used for login."}
                </small>
              </label>

              <label>
                <span>{ka ? "ტელეფონი" : "Phone"} *</span>

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  required
                />
              </label>

              <label>
                <span>
                  {ka
                    ? "მისამართი — ნებაყოფლობითი"
                    : "Address — optional"}
                </span>

                <input
                  value={address}
                  onChange={(e) =>
                    setAddress(e.target.value)
                  }
                />
              </label>

              <label>
                <span>
                  {ka
                    ? "პროფილის ფოტო"
                    : "Profile photo"}
                </span>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setPhotoFile(
                      e.target.files?.[0] ?? null
                    )
                  }
                />
              </label>

              <div className="formActions">
                <button
                  type="button"
                  className="cancelButton"
                  onClick={() => {
                    setFirstName(owner.first_name);
                    setLastName(owner.last_name);
                    setPhone(owner.phone);
                    setAddress(owner.address ?? "");
                    setPhotoFile(null);
                    setEditing(false);
                  }}
                >
                  {ka ? "გაუქმება" : "Cancel"}
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
                    ? "შენახვა"
                    : "Save changes"}
                </button>
              </div>
            </form>
          )}
        </section>

        <section className="adminCard">
          <div className="sectionHeader">
            <div>
              <span className="eyebrow">
                {ka ? "ადმინისტრატორი" : "ADMINISTRATOR"}
              </span>

              <h2>
                {ka
                  ? "დამატებითი ადმინისტრატორი"
                  : "Secondary administrator"}
              </h2>

              <p>
                {ka
                  ? "შეგიძლიათ დაამატოთ მაქსიმუმ ერთი ადმინისტრატორი. მისი უფლებები თქვენ გადაწყვიტეთ."
                  : "You may add one administrator and control their permissions."}
              </p>
            </div>

            <a href="/account/admin" className="manageButton">
              {ka ? "მართვა" : "Manage"} →
            </a>
          </div>

          <div className="adminNotice">
            <span>🔐</span>

            <p>
              {ka
                ? "ადმინისტრატორი ვერ დაამატებს სხვა ადმინისტრატორს და ვერ შეცვლის თქვენი ანგარიშის უსაფრთხოების მონაცემებს."
                : "The administrator cannot add another administrator or change your account security information."}
            </p>
          </div>
        </section>

        <section className="qrSection">
          <div className="qrHeader">
            <div>
              <span className="eyebrow">
                {ka ? "ჩემი QR პროფილები" : "MY QR PROFILES"}
              </span>

              <h2>
                {ka
                  ? "ცხოველები და ნივთები"
                  : "Pets and items"}
              </h2>

              <p>
                {ka
                  ? "ერთ ანგარიშზე შეგიძლიათ შექმნათ რამდენიც გსურთ იმდენი QR პროფილი."
                  : "Create as many QR profiles as you need under one account."}
              </p>
            </div>

            <a href="/add-profile" className="addProfileButton">
              + {ka ? "QR პროფილის დამატება" : "Add QR profile"}
            </a>
          </div>

          {profiles.length === 0 ? (
            <div className="emptyState">
              <div className="emptyIcon">🏷️</div>

              <h3>
                {ka
                  ? "ჯერ QR პროფილი არ გაქვთ"
                  : "No QR profiles yet"}
              </h3>

              <p>
                {ka
                  ? "აირჩიეთ ძაღლი, კატა, გასაღები, საფულე, ჩანთა ან ჩემოდანი."
                  : "Choose a dog, cat, keys, wallet, bag or suitcase."}
              </p>

              <a href="/add-profile">
                + {ka ? "პირველი პროფილის შექმნა" : "Create first profile"}
              </a>
            </div>
          ) : (
            <div className="profilesGrid">
              {profiles.map((profile) => {
                const type = getType(profile);

                return (
                  <article className="profileCard" key={profile.id}>
                    <div className="profileVisual">
                      {profile.photo ? (
                        <img
                          src={profile.photo}
                          alt={profile.item_name ?? ""}
                        />
                      ) : (
                        <div className="profilePlaceholder">
                          {type.icon}
                        </div>
                      )}

                      <span
                        className={
                          profile.active
                            ? "status lost"
                            : "status safe"
                        }
                      >
                        {profile.active
                          ? ka
                            ? "დაკარგულია"
                            : "Lost"
                          : ka
                          ? "უსაფრთხოდ"
                          : "Safe"}
                      </span>
                    </div>

                    <div className="profileBody">
                      <span className="profileType">
                        {type.label}
                      </span>

                      <h3>
                        {profile.item_name ||
                          (ka
                            ? "უსახელო პროფილი"
                            : "Unnamed profile")}
                      </h3>

                      {profile.tag_code && (
                        <p className="qrCode">
                          QR · {profile.tag_code}
                        </p>
                      )}

                      <div className="profileActions">
                        <a
                          href={`/edit-profile/${profile.id}`}
                        >
                          ✏️ {ka ? "რედაქტირება" : "Edit"}
                        </a>

                        {profile.tag_code && (
                          <a
                            href={`/profile/${profile.tag_code}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            👁 {ka ? "მპოვნელის ნახვა" : "Finder view"}
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </section>

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
          background: #f7f9fc;
        }

        input,
        button {
          font: inherit;
        }

        .page {
          min-height: 100vh;
          color: #101828;
          font-family: Inter, Arial, sans-serif;
          background:
            radial-gradient(
              circle at 7% 10%,
              rgba(20, 101, 232, 0.08),
              transparent 28%
            ),
            radial-gradient(
              circle at 94% 7%,
              rgba(118, 85, 247, 0.08),
              transparent 28%
            ),
            #f7f9fc;
        }

        .header {
          width: calc(100% - 36px);
          max-width: 1180px;
          min-height: 86px;
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #e4e7ec;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }

        .logo {
          width: 50px;
          height: 50px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: linear-gradient(
            135deg,
            #1465e8,
            #7655f7
          );
          color: white;
          font-weight: 900;
        }

        .brand strong {
          display: block;
          color: #1465e8;
          font-size: 21px;
          font-weight: 900;
        }

        .brand small {
          display: block;
          margin-top: 3px;
          color: #7655f7;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1.7px;
        }

        .headerRight {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .languages {
          padding: 4px;
          display: flex;
          border-radius: 10px;
          background: #eaecf0;
        }

        .languages button {
          padding: 8px 11px;
          border: 0;
          border-radius: 8px;
          background: transparent;
          color: #667085;
          font-size: 11px;
          font-weight: 900;
          cursor: pointer;
        }

        .languages .active {
          background: white;
          color: #1465e8;
        }

        .logoutButton {
          min-height: 40px;
          padding: 0 14px;
          border: 1px solid #d0d5dd;
          border-radius: 9px;
          background: white;
          color: #475467;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
        }

        .container {
          width: calc(100% - 36px);
          max-width: 1080px;
          margin: auto;
          padding: 58px 0 90px;
        }

        .pageTitle {
          margin-bottom: 32px;
        }

        .eyebrow {
          color: #7655f7;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 1.6px;
        }

        .pageTitle h1 {
          margin: 9px 0;
          font-size: clamp(38px, 5vw, 52px);
          line-height: 1.05;
          letter-spacing: -2px;
        }

        .pageTitle p,
        .sectionHeader p,
        .qrHeader p {
          margin: 0;
          max-width: 650px;
          color: #667085;
          font-size: 14px;
          line-height: 1.65;
        }

        .ownerCard,
        .adminCard,
        .qrSection {
          margin-top: 22px;
          padding: 28px;
          border: 1px solid #e4e7ec;
          border-radius: 22px;
          background: white;
          box-shadow: 0 12px 35px rgba(16, 24, 40, 0.05);
        }

        .ownerTop {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .ownerPhotoWrap {
          width: 78px;
          height: 78px;
          flex: 0 0 78px;
          overflow: hidden;
          border-radius: 20px;
        }

        .ownerPhotoWrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .ownerPlaceholder {
          width: 100%;
          height: 100%;
          display: grid;
          place-items: center;
          background: linear-gradient(
            135deg,
            #eef4ff,
            #f0edff
          );
          font-size: 34px;
        }

        .ownerIdentity {
          flex: 1;
        }

        .ownerIdentity > span {
          color: #7655f7;
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .ownerIdentity h2 {
          margin: 5px 0 6px;
          font-size: 25px;
        }

        .ownerIdentity p {
          margin: 3px 0;
          color: #667085;
          font-size: 12px;
        }

        .editOwnerButton,
        .manageButton,
        .addProfileButton {
          min-height: 44px;
          padding: 0 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #dbe7ff;
          border-radius: 10px;
          background: #f5f9ff;
          color: #1465e8;
          font-size: 12px;
          font-weight: 900;
          text-decoration: none;
          cursor: pointer;
        }

        .ownerInfoGrid {
          margin-top: 26px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .infoBox {
          padding: 15px;
          border: 1px solid #eaecf0;
          border-radius: 13px;
          background: #fafbfc;
        }

        .infoBox.full {
          grid-column: 1 / -1;
        }

        .infoBox span {
          display: block;
          margin-bottom: 5px;
          color: #98a2b3;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .infoBox strong {
          color: #344054;
          font-size: 14px;
        }

        .editForm {
          margin-top: 27px;
          display: flex;
          flex-direction: column;
          gap: 17px;
        }

        .twoColumns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        label > span {
          display: block;
          margin-bottom: 7px;
          color: #475467;
          font-size: 13px;
          font-weight: 800;
        }

        label small {
          display: block;
          margin-top: 5px;
          color: #98a2b3;
          font-size: 10px;
        }

        input {
          width: 100%;
          height: 50px;
          padding: 0 13px;
          border: 1px solid #d0d5dd;
          border-radius: 10px;
          background: white;
          outline: none;
        }

        input:focus {
          border-color: #84adff;
          box-shadow:
            0 0 0 3px rgba(20, 101, 232, 0.08);
        }

        input:disabled {
          background: #f2f4f7;
          color: #667085;
        }

        .formActions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .cancelButton,
        .saveButton {
          min-height: 46px;
          padding: 0 17px;
          border-radius: 10px;
          font-weight: 900;
          cursor: pointer;
        }

        .cancelButton {
          border: 1px solid #d0d5dd;
          background: white;
          color: #475467;
        }

        .saveButton {
          border: 0;
          background: linear-gradient(
            135deg,
            #1465e8,
            #7655f7
          );
          color: white;
        }

        .sectionHeader,
        .qrHeader {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 25px;
        }

        .sectionHeader h2,
        .qrHeader h2 {
          margin: 7px 0;
          font-size: 24px;
        }

        .adminNotice {
          margin-top: 20px;
          padding: 15px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          border-radius: 13px;
          background: #f2f4f7;
        }

        .adminNotice p {
          margin: 0;
          color: #667085;
          font-size: 12px;
          line-height: 1.55;
        }

        .addProfileButton {
          border: 0;
          background: linear-gradient(
            135deg,
            #1465e8,
            #7655f7
          );
          color: white;
        }

        .emptyState {
          margin-top: 24px;
          padding: 55px 25px;
          text-align: center;
          border: 1px dashed #cfd8e8;
          border-radius: 18px;
          background: #fafbfc;
        }

        .emptyIcon {
          width: 64px;
          height: 64px;
          margin: auto;
          display: grid;
          place-items: center;
          border-radius: 18px;
          background: #eef4ff;
          font-size: 30px;
        }

        .emptyState h3 {
          margin: 17px 0 7px;
        }

        .emptyState p {
          margin: 0 auto 18px;
          color: #667085;
          font-size: 13px;
        }

        .emptyState a {
          display: inline-flex;
          padding: 12px 16px;
          border-radius: 10px;
          background: #1465e8;
          color: white;
          font-size: 12px;
          font-weight: 900;
          text-decoration: none;
        }

        .profilesGrid {
          margin-top: 24px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .profileCard {
          overflow: hidden;
          border: 1px solid #e4e7ec;
          border-radius: 18px;
          background: white;
        }

        .profileVisual {
          height: 165px;
          position: relative;
          background: #eef4ff;
        }

        .profileVisual img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .profilePlaceholder {
          width: 100%;
          height: 100%;
          display: grid;
          place-items: center;
          background: linear-gradient(
            135deg,
            #eef4ff,
            #f0edff
          );
          font-size: 52px;
        }

        .status {
          position: absolute;
          right: 11px;
          top: 11px;
          padding: 6px 9px;
          border-radius: 999px;
          font-size: 9px;
          font-weight: 900;
        }

        .status.safe {
          background: #ecfdf3;
          color: #027a48;
        }

        .status.lost {
          background: #fff1f0;
          color: #b42318;
        }

        .profileBody {
          padding: 17px;
        }

        .profileType {
          color: #7655f7;
          font-size: 9px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .profileBody h3 {
          margin: 6px 0 8px;
          font-size: 20px;
        }

        .qrCode {
          margin: 0;
          color: #98a2b3;
          font-size: 10px;
        }

        .profileActions {
          margin-top: 15px;
          padding-top: 13px;
          display: flex;
          justify-content: space-between;
          gap: 8px;
          border-top: 1px solid #eaecf0;
        }

        .profileActions a {
          color: #1465e8;
          font-size: 10px;
          font-weight: 900;
          text-decoration: none;
        }

        .errorBox,
        .successBox {
          margin-bottom: 16px;
          padding: 13px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 800;
        }

        .errorBox {
          border: 1px solid #fecdca;
          background: #fff1f0;
          color: #b42318;
        }

        .successBox {
          border: 1px solid #abefc6;
          background: #ecfdf3;
          color: #027a48;
        }

        .statePage {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 30px;
          font-family: Inter, Arial, sans-serif;
          color: #667085;
          background: #f7f9fc;
        }

        @media (max-width: 900px) {
          .profilesGrid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 700px) {
          .ownerTop,
          .sectionHeader,
          .qrHeader {
            align-items: stretch;
            flex-direction: column;
          }

          .editOwnerButton,
          .manageButton,
          .addProfileButton {
            width: 100%;
          }

          .ownerInfoGrid,
          .twoColumns {
            grid-template-columns: 1fr;
          }

          .infoBox.full {
            grid-column: auto;
          }
        }

        @media (max-width: 560px) {
          .container {
            padding-top: 35px;
          }

          .ownerCard,
          .adminCard,
          .qrSection {
            padding: 20px;
          }

          .profilesGrid {
            grid-template-columns: 1fr;
          }

          .header {
            min-height: 76px;
          }

          .brand small {
            display: none;
          }
        }
      `}</style>
    </main>
  );
}
