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

export default function OwnerProfileEditPage() {
  const [lang, setLang] = useState<Lang>("ka");
  const ka = lang === "ka";

  const [owner, setOwner] = useState<OwnerAccount | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [photo, setPhoto] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadOwner();
  }, []);

  async function loadOwner() {
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

      const { data, error } = await supabase
        .from("owner_accounts")
        .select(
          "user_id, first_name, last_name, email, phone, address, photo"
        )
        .eq("user_id", user.id)
        .single();

      if (error) {
        throw error;
      }

      const record = data as OwnerAccount;

      setOwner(record);

      setFirstName(record.first_name ?? "");
      setLastName(record.last_name ?? "");
      setPhone(record.phone ?? "");
      setAddress(record.address ?? "");
      setPhoto(record.photo ?? "");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : ka
          ? "მფლობელის პროფილის ჩატვირთვა ვერ მოხერხდა."
          : "Could not load owner profile."
      );
    } finally {
      setLoading(false);
    }
  }

  async function uploadPhoto(userId: string) {
    if (!photoFile) {
      return photo || null;
    }

    const safeName = photoFile.name.replace(
      /[^a-zA-Z0-9._-]/g,
      "-"
    );

    const path = `${userId}/owner-${Date.now()}-${safeName}`;

    const { error } = await supabase.storage
      .from("qr-return-images")
      .upload(path, photoFile);

    if (error) {
      throw error;
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

      const newPhoto = await uploadPhoto(user.id);

      const updates = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim(),
        address: address.trim() || null,
        photo: newPhoto,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("owner_accounts")
        .update(updates)
        .eq("user_id", user.id)
        .select(
          "user_id, first_name, last_name, email, phone, address, photo"
        )
        .single();

      if (error) {
        throw error;
      }

      const updatedOwner = data as OwnerAccount;

      setOwner(updatedOwner);
      setPhoto(updatedOwner.photo ?? "");
      setPhotoFile(null);

      setSuccess(
        ka
          ? "მფლობელის პროფილი წარმატებით განახლდა."
          : "Owner profile updated successfully."
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
        <a href="/account" className="brand">
          <div className="logo">QR</div>

          <div>
            <strong>QR RETURN</strong>
            <small>OWNER PROFILE</small>
          </div>
        </a>

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
      </header>

      <section className="container">
        <a href="/account" className="back">
          ← {ka ? "მფლობელის ანგარიში" : "Owner account"}
        </a>

        <div className="heading">
          <div className="ownerIcon">👤</div>

          <div>
            <div className="eyebrow">
              {ka ? "მფლობელის პროფილი" : "OWNER PROFILE"}
            </div>

            <h1>
              {ka
                ? "პირადი ინფორმაციის რედაქტირება"
                : "Edit personal information"}
            </h1>

            <p>
              {ka
                ? "ეს ინფორმაცია გამოიყენება თქვენს QR პროფილებში. მპოვნელისთვის რა გამოჩნდება, თითოეულ QR პროფილში ცალკე გადაწყდება."
                : "This information is used across your QR profiles. Finder visibility is controlled separately for each QR profile."}
            </p>
          </div>
        </div>

        <div className="infoNotice">
          <span>ℹ️</span>

          <div>
            <strong>
              {ka
                ? "ერთი Owner Profile ყველა QR პროფილისთვის"
                : "One Owner Profile for all QR profiles"}
            </strong>

            <p>
              {ka
                ? "სახელი, გვარი, ტელეფონი, მისამართი და ფოტო აქ ინახება ცენტრალურად. თითოეულ ძაღლზე ან ნივთზე თავიდან შეყვანა აღარ დაგჭირდებათ."
                : "Your name, phone, address and photo are stored centrally and reused across your QR profiles."}
            </p>
          </div>
        </div>

        <form onSubmit={saveOwner}>
          <section className="card">
            <div className="profileTop">
              <div className="photoWrap">
                {photo ? (
                  <img
                    src={photo}
                    alt={`${firstName} ${lastName}`}
                  />
                ) : (
                  <div className="photoPlaceholder">👤</div>
                )}
              </div>

              <div>
                <span className="eyebrow">
                  {ka ? "ანგარიშის მფლობელი" : "ACCOUNT OWNER"}
                </span>

                <h2>
                  {firstName} {lastName}
                </h2>

                <p>{owner.email}</p>
              </div>
            </div>

            <label>
              <span>
                {ka ? "პროფილის ფოტო" : "Profile photo"}
              </span>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setPhotoFile(e.target.files?.[0] ?? null)
                }
              />
            </label>
          </section>

          <section className="card">
            <div className="sectionTitle">
              <span>01</span>

              <h2>
                {ka
                  ? "ძირითადი ინფორმაცია"
                  : "Basic information"}
              </h2>
            </div>

            <div className="twoColumns">
              <label>
                <span>{ka ? "სახელი" : "First name"} *</span>

                <input
                  type="text"
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
                  type="text"
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
                type="email"
                value={owner.email}
                disabled
              />

              <small>
                {ka
                  ? "ელფოსტა გამოიყენება Login-ისთვის და ამ გვერდიდან არ იცვლება."
                  : "Email is used for sign-in and cannot be changed from this page."}
              </small>
            </label>

            <label>
              <span>{ka ? "მობილური ტელეფონი" : "Mobile phone"} *</span>

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
                type="text"
                value={address}
                onChange={(e) =>
                  setAddress(e.target.value)
                }
              />

              <small>
                {ka
                  ? "მისამართი მპოვნელისთვის მხოლოდ მაშინ გამოჩნდება, თუ კონკრეტულ QR პროფილში ჩართავთ Address ON."
                  : "Your address is only shown if you enable Address visibility on a specific QR profile."}
              </small>
            </label>
          </section>

          <section className="card securityLinkCard">
            <div>
              <span className="eyebrow">
                {ka ? "უსაფრთხოება" : "SECURITY"}
              </span>

              <h2>
                {ka
                  ? "პირადი ნომერი და კოდური სიტყვა"
                  : "Personal ID and code word"}
              </h2>

              <p>
                {ka
                  ? "ეს მონაცემები აქ არ ჩანს და მპოვნელისთვის არასდროს გამოჩნდება."
                  : "These details are hidden here and are never shown to finders."}
              </p>
            </div>

            <a href="/account/security">
              🔐 {ka ? "უსაფრთხოების მართვა" : "Manage security"} →
            </a>
          </section>

          {error && (
            <div className="errorBox">
              {error}
            </div>
          )}

          {success && (
            <div className="successBox">
              ✓ {success}
            </div>
          )}

          <div className="actions">
            <a href="/account">
              {ka ? "გაუქმება" : "Cancel"}
            </a>

            <button
              type="submit"
              disabled={saving}
            >
              {saving
                ? ka
                  ? "ინახება..."
                  : "Saving..."
                : ka
                ? "ცვლილებების შენახვა"
                : "Save changes"}
            </button>
          </div>
        </form>
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
          color: #101828;
          font-family: Inter, Arial, sans-serif;
        }

        input,
        button {
          font: inherit;
        }

        .page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 8% 10%,
              rgba(20, 101, 232, 0.07),
              transparent 28%
            ),
            radial-gradient(
              circle at 94% 8%,
              rgba(118, 85, 247, 0.07),
              transparent 28%
            ),
            #f7f9fc;
        }

        .statePage {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 30px;
          color: #667085;
        }

        .header {
          width: calc(100% - 36px);
          max-width: 950px;
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

        .brand strong,
        .brand small {
          display: block;
        }

        .brand strong {
          color: #1465e8;
          font-size: 21px;
          font-weight: 900;
        }

        .brand small {
          margin-top: 3px;
          color: #7655f7;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1.6px;
        }

        .languages {
          padding: 4px;
          display: flex;
          border-radius: 10px;
          background: #eaecf0;
        }

        .languages button {
          padding: 8px 10px;
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

        .container {
          width: calc(100% - 36px);
          max-width: 800px;
          margin: auto;
          padding: 50px 0 90px;
        }

        .back {
          color: #667085;
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
        }

        .heading {
          margin: 36px 0 24px;
          display: flex;
          align-items: center;
          gap: 17px;
        }

        .ownerIcon {
          width: 70px;
          height: 70px;
          flex: 0 0 70px;
          display: grid;
          place-items: center;
          border-radius: 19px;
          background: linear-gradient(
            135deg,
            #eef4ff,
            #f0edff
          );
          font-size: 33px;
        }

        .eyebrow {
          color: #7655f7;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        .heading h1 {
          margin: 6px 0;
          font-size: 34px;
        }

        .heading p {
          margin: 0;
          color: #667085;
          font-size: 12px;
          line-height: 1.6;
        }

        .infoNotice {
          margin-bottom: 20px;
          padding: 16px;
          display: flex;
          gap: 11px;
          border: 1px solid #dbe7ff;
          border-radius: 14px;
          background: #f5f9ff;
        }

        .infoNotice strong {
          font-size: 12px;
        }

        .infoNotice p {
          margin: 4px 0 0;
          color: #667085;
          font-size: 10px;
          line-height: 1.55;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .card {
          padding: 27px;
          border: 1px solid #e4e7ec;
          border-radius: 20px;
          background: white;
          box-shadow: 0 10px 28px rgba(16, 24, 40, 0.04);
        }

        .profileTop {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .photoWrap {
          width: 82px;
          height: 82px;
          flex: 0 0 82px;
          overflow: hidden;
          border-radius: 20px;
        }

        .photoWrap img,
        .photoPlaceholder {
          width: 100%;
          height: 100%;
        }

        .photoWrap img {
          object-fit: cover;
        }

        .photoPlaceholder {
          display: grid;
          place-items: center;
          background: #eef4ff;
          font-size: 34px;
        }

        .profileTop h2 {
          margin: 5px 0 4px;
          font-size: 23px;
        }

        .profileTop p {
          margin: 0;
          color: #667085;
          font-size: 11px;
        }

        .sectionTitle {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 20px;
        }

        .sectionTitle > span {
          width: 31px;
          height: 31px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          background: #eef4ff;
          color: #1465e8;
          font-size: 9px;
          font-weight: 900;
        }

        .sectionTitle h2 {
          margin: 0;
          font-size: 20px;
        }

        .twoColumns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 13px;
        }

        label {
          display: block;
          margin-top: 18px;
        }

        label > span {
          display: block;
          margin-bottom: 7px;
          color: #475467;
          font-size: 12px;
          font-weight: 800;
        }

        label small {
          display: block;
          margin-top: 5px;
          color: #98a2b3;
          font-size: 10px;
          line-height: 1.5;
        }

        input {
          width: 100%;
          height: 50px;
          padding: 0 13px;
          border: 1px solid #d0d5dd;
          border-radius: 10px;
          outline: none;
          background: white;
        }

        input:disabled {
          background: #f2f4f7;
          color: #667085;
        }

        input:focus {
          border-color: #84adff;
          box-shadow: 0 0 0 3px rgba(20, 101, 232, 0.08);
        }

        .securityLinkCard {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
        }

        .securityLinkCard h2 {
          margin: 5px 0;
          font-size: 19px;
        }

        .securityLinkCard p {
          margin: 0;
          color: #667085;
          font-size: 10px;
        }

        .securityLinkCard a {
          flex: 0 0 auto;
          padding: 11px 13px;
          border-radius: 9px;
          background: #f5f9ff;
          color: #1465e8;
          font-size: 10px;
          font-weight: 900;
          text-decoration: none;
        }

        .errorBox,
        .successBox {
          padding: 13px;
          border-radius: 10px;
          font-size: 11px;
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

        .actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .actions a,
        .actions button {
          min-height: 48px;
          padding: 0 17px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          font-size: 11px;
          font-weight: 900;
          text-decoration: none;
        }

        .actions a {
          color: #667085;
        }

        .actions button {
          border: 0;
          background: linear-gradient(
            135deg,
            #1465e8,
            #7655f7
          );
          color: white;
          cursor: pointer;
        }

        .actions button:disabled {
          opacity: 0.65;
        }

        @media (max-width: 620px) {
          .twoColumns {
            grid-template-columns: 1fr;
          }

          .securityLinkCard {
            align-items: stretch;
            flex-direction: column;
          }

          .securityLinkCard a {
            text-align: center;
          }

          .card {
            padding: 21px;
          }

          .heading h1 {
            font-size: 28px;
          }
        }
      `}</style>
    </main>
  );
}
