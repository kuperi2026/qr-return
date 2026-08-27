"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Lang = "ka" | "en";

type AdminRecord = {
  id: number;
  owner_id: string;
  admin_user_id: string | null;
  admin_email: string;

  can_view_profiles: boolean;
  can_edit_profiles: boolean;
  can_manage_lost_mode: boolean;
  can_manage_visibility: boolean;
  can_manage_contacts: boolean;
  can_manage_location: boolean;
  can_manage_additional_contact: boolean;
  can_use_live_chat: boolean;

  active: boolean;
};

type OwnerProfile = {
  id: number;
  item_name: string | null;
  item_type: string | null;
  pet_type: string | null;
  tag_code: string | null;
  photo: string | null;
};

type ProfileAccess = {
  selected: boolean;
  can_view_profiles: boolean;
  can_edit_profiles: boolean;
  can_manage_lost_mode: boolean;
  can_manage_visibility: boolean;
  can_manage_contacts: boolean;
  can_manage_location: boolean;
  can_manage_additional_contact: boolean;
  can_use_live_chat: boolean;
};

type ProfilePermission = Exclude<keyof ProfileAccess, "selected">;

const emptyProfileAccess = (): ProfileAccess => ({
  selected: false,
  can_view_profiles: true,
  can_edit_profiles: false,
  can_manage_lost_mode: false,
  can_manage_visibility: false,
  can_manage_contacts: false,
  can_manage_location: false,
  can_manage_additional_contact: false,
  can_use_live_chat: false,
});

export default function AdminPage() {
  const [lang, setLang] = useState<Lang>("ka");

  const [admin, setAdmin] = useState<AdminRecord | null>(null);
  const [email, setEmail] = useState("");

  const [canViewProfiles, setCanViewProfiles] = useState(true);
  const [canEditProfiles, setCanEditProfiles] = useState(false);
  const [canManageLostMode, setCanManageLostMode] = useState(false);
  const [canManageVisibility, setCanManageVisibility] = useState(false);
  const [canManageContacts, setCanManageContacts] = useState(false);
  const [canManageLocation, setCanManageLocation] = useState(false);
  const [canManageAdditionalContact, setCanManageAdditionalContact] =
    useState(false);
  const [canUseLiveChat, setCanUseLiveChat] = useState(false);

  const [active, setActive] = useState(true);
  const [profiles, setProfiles] = useState<OwnerProfile[]>([]);
  const [profileAccess, setProfileAccess] = useState<Record<number, ProfileAccess>>({});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const ka = lang === "ka";

  useEffect(() => {
    loadAdmin();
  }, []);

  async function loadAdmin() {
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

      const { data, error: adminError } = await supabase
        .from("owner_admins")
        .select(`
          id,
          owner_id,
          admin_user_id,
          admin_email,
          can_view_profiles,
          can_edit_profiles,
          can_manage_lost_mode,
          can_manage_visibility,
          can_manage_contacts,
          can_manage_location,
          can_manage_additional_contact,
          can_use_live_chat,
          active
        `)
        .eq("owner_id", user.id)
        .maybeSingle();

      if (adminError) {
        throw adminError;
      }

      if (data) {
        const record = data as AdminRecord;

        setAdmin(record);
        setEmail(record.admin_email);

        setCanViewProfiles(record.can_view_profiles);
        setCanEditProfiles(record.can_edit_profiles);
        setCanManageLostMode(record.can_manage_lost_mode);
        setCanManageVisibility(record.can_manage_visibility);
        setCanManageContacts(record.can_manage_contacts);
        setCanManageLocation(record.can_manage_location);
        setCanManageAdditionalContact(
          record.can_manage_additional_contact
        );
        setCanUseLiveChat(record.can_use_live_chat);

        setActive(record.active);
      }

      const { data: profileRows, error: profilesError } = await supabase
        .from("item")
        .select("id, item_name, item_type, pet_type, tag_code, photo")
        .eq("owner_id", user.id)
        .order("id", { ascending: true });

      if (profilesError) throw profilesError;

      const ownerProfiles = (profileRows ?? []) as OwnerProfile[];
      setProfiles(ownerProfiles);

      const nextAccess: Record<number, ProfileAccess> = {};
      ownerProfiles.forEach((profile) => {
        nextAccess[profile.id] = emptyProfileAccess();
      });

      if (data) {
        const { data: accessRows, error: accessError } = await supabase
          .from("owner_admin_profile_access")
          .select("item_id, can_view_profiles, can_edit_profiles, can_manage_lost_mode, can_manage_visibility, can_manage_contacts, can_manage_location, can_manage_additional_contact, can_use_live_chat")
          .eq("owner_admin_id", data.id);

        if (accessError) throw accessError;

        (accessRows ?? []).forEach((row) => {
          nextAccess[row.item_id] = { ...row, selected: true } as ProfileAccess;
        });
      }

      setProfileAccess(nextAccess);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : ka
          ? "ადმინისტრატორის ინფორმაციის ჩატვირთვა ვერ მოხერხდა."
          : "Could not load administrator."
      );
    } finally {
      setLoading(false);
    }
  }

  async function saveAdmin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError(
        ka
          ? "ადმინისტრატორის ელფოსტა სავალდებულოა."
          : "Administrator email is required."
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

      if (cleanEmail === user.email?.toLowerCase()) {
        setError(
          ka
            ? "საკუთარ თავს ადმინისტრატორად ვერ დაამატებთ."
            : "You cannot add yourself as the administrator."
        );
        return;
      }

      const payload = {
        owner_id: user.id,
        admin_email: cleanEmail,

        can_view_profiles: canViewProfiles,
        can_edit_profiles: canEditProfiles,
        can_manage_lost_mode: canManageLostMode,
        can_manage_visibility: canManageVisibility,
        can_manage_contacts: canManageContacts,
        can_manage_location: canManageLocation,
        can_manage_additional_contact: canManageAdditionalContact,
        can_use_live_chat: canUseLiveChat,

        active,
        updated_at: new Date().toISOString(),
      };

      let savedAdmin: AdminRecord;

      if (admin) {
        const { data, error: updateError } = await supabase
          .from("owner_admins")
          .update(payload)
          .eq("id", admin.id)
          .eq("owner_id", user.id)
          .select()
          .single();

        if (updateError) {
          throw updateError;
        }

        savedAdmin = data as AdminRecord;
        setAdmin(savedAdmin);
      } else {
        const { data, error: insertError } = await supabase
          .from("owner_admins")
          .insert(payload)
          .select()
          .single();

        if (insertError) {
          throw insertError;
        }

        savedAdmin = data as AdminRecord;
        setAdmin(savedAdmin);
      }

      const selectedAccess = profiles
        .filter((profile) => profileAccess[profile.id]?.selected)
        .map((profile) => ({
          owner_admin_id: savedAdmin.id,
          owner_id: user.id,
          item_id: profile.id,
          ...profileAccess[profile.id],
          selected: undefined,
          updated_at: new Date().toISOString(),
        }));

      const { error: clearAccessError } = await supabase
        .from("owner_admin_profile_access")
        .delete()
        .eq("owner_admin_id", savedAdmin.id);

      if (clearAccessError) throw clearAccessError;

      if (selectedAccess.length > 0) {
        const cleanAccess = selectedAccess.map(({ selected: _selected, ...row }) => row);
        const { error: accessSaveError } = await supabase
          .from("owner_admin_profile_access")
          .insert(cleanAccess);
        if (accessSaveError) throw accessSaveError;
      }

      setSuccess(
        ka
          ? "ადმინისტრატორის პარამეტრები წარმატებით შეინახა."
          : "Administrator settings saved successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : ka
          ? "ადმინისტრატორის შენახვა ვერ მოხერხდა."
          : "Could not save administrator."
      );
    } finally {
      setSaving(false);
    }
  }

  async function removeAdmin() {
    if (!admin) return;

    const confirmed = window.confirm(
      ka
        ? "ნამდვილად გსურთ ადმინისტრატორის წაშლა?"
        : "Are you sure you want to remove this administrator?"
    );

    if (!confirmed) return;

    setRemoving(true);
    setError("");
    setSuccess("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        window.location.href = "/login";
        return;
      }

      const { error: deleteError } = await supabase
        .from("owner_admins")
        .delete()
        .eq("id", admin.id)
        .eq("owner_id", user.id);

      if (deleteError) {
        throw deleteError;
      }

      setAdmin(null);
      setEmail("");

      setCanViewProfiles(true);
      setCanEditProfiles(false);
      setCanManageLostMode(false);
      setCanManageVisibility(false);
      setCanManageContacts(false);
      setCanManageLocation(false);
      setCanManageAdditionalContact(false);
      setCanUseLiveChat(false);

      setActive(true);
      setProfileAccess((current) => {
        const cleared: Record<number, ProfileAccess> = {};
        Object.keys(current).forEach((id) => {
          cleared[Number(id)] = emptyProfileAccess();
        });
        return cleared;
      });

      setSuccess(
        ka
          ? "ადმინისტრატორი წაიშალა."
          : "Administrator removed."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : ka
          ? "ადმინისტრატორის წაშლა ვერ მოხერხდა."
          : "Could not remove administrator."
      );
    } finally {
      setRemoving(false);
    }
  }

  function updateProfileAccess(itemId: number, change: Partial<ProfileAccess>) {
    setProfileAccess((current) => ({
      ...current,
      [itemId]: { ...(current[itemId] ?? emptyProfileAccess()), ...change },
    }));
  }

  if (loading) {
    return (
      <main className="statePage">
        {ka ? "იტვირთება..." : "Loading..."}
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
            <small>ADMIN ACCESS</small>
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
          ← {ka ? "მფლობელის პროფილი" : "Owner profile"}
        </a>

        <div className="heading">
          <div className="eyebrow">
            {ka ? "დამატებითი ადმინისტრატორი" : "SECONDARY ADMIN"}
          </div>

          <h1>
            {ka
              ? "ადმინისტრატორის მართვა"
              : "Manage administrator"}
          </h1>

          <p>
            {ka
              ? "თქვენს ანგარიშს შეიძლება ჰყავდეს მაქსიმუმ ერთი დამატებითი ადმინისტრატორი. თავად გადაწყვიტეთ, რისი უფლება ექნება."
              : "Your account can have one secondary administrator. You decide exactly what they are allowed to manage."}
          </p>
        </div>

        <div className="importantNotice">
          <div className="noticeIcon">🔐</div>

          <div>
            <strong>
              {ka
                ? "Owner ყოველთვის მთავარი მმართველია"
                : "The Owner always remains in control"}
            </strong>

            <p>
              {ka
                ? "ადმინისტრატორს არ შეუძლია სხვა Admin-ის დამატება, თქვენი უსაფრთხოების მონაცემების შეცვლა, ანგარიშის წაშლა ან Owner-ის შეცვლა."
                : "The administrator cannot add another admin, change your security information, delete your account or replace the Owner."}
            </p>
          </div>
        </div>

        {error && <div className="errorBox">{error}</div>}
        {success && <div className="successBox">{success}</div>}

        <form onSubmit={saveAdmin}>
          <section className="card">
            <div className="cardTitle">
              <div className="adminAvatar">
                {admin ? "👤" : "+"}
              </div>

              <div>
                <span>
                  {admin
                    ? ka
                      ? "დამატებული ადმინისტრატორი"
                      : "CURRENT ADMIN"
                    : ka
                    ? "ახალი ადმინისტრატორი"
                    : "NEW ADMIN"}
                </span>

                <h2>
                  {admin
                    ? admin.admin_email
                    : ka
                    ? "დაამატეთ ადმინისტრატორი"
                    : "Add administrator"}
                </h2>
              </div>
            </div>

            <label className="emailField">
              <span>
                {ka
                  ? "ადმინისტრატორის ელფოსტა"
                  : "Administrator email"}{" "}
                *
              </span>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />

              <small>
                {ka
                  ? "ეს იქნება იმ ადამიანის ელფოსტა, რომელსაც ანგარიშის მართვის უფლებას აძლევთ."
                  : "Enter the email of the person you want to authorize."}
              </small>
            </label>
          </section>

          <section className="card">
            <div className="permissionsHeader">
              <div>
                <span className="eyebrow">{ka ? "პროდუქტები" : "PRODUCTS"}</span>
                <h2>{ka ? "რომელ პროფილებზე ექნება წვდომა?" : "Which profiles can the Admin access?"}</h2>
                <p>
                  {ka
                    ? `აირჩიეთ ერთი, რამდენიმე ან ყველა. ამჟამად გაქვთ ${profiles.length} QR პროფილი.`
                    : `Choose one, several or all. You currently have ${profiles.length} QR profiles.`}
                </p>
              </div>
              {profiles.length > 0 && (
                <button
                  type="button"
                  className="selectAllButton"
                  onClick={() => {
                    const allSelected = profiles.every((profile) => profileAccess[profile.id]?.selected);
                    const next: Record<number, ProfileAccess> = {};
                    profiles.forEach((profile) => {
                      next[profile.id] = {
                        ...(profileAccess[profile.id] ?? emptyProfileAccess()),
                        selected: !allSelected,
                      };
                    });
                    setProfileAccess((current) => ({ ...current, ...next }));
                  }}
                >
                  {profiles.every((profile) => profileAccess[profile.id]?.selected)
                    ? ka ? "ყველას მოხსნა" : "Clear all"
                    : ka ? "ყველას არჩევა" : "Select all"}
                </button>
              )}
            </div>

            {profiles.length === 0 ? (
              <div className="emptyProductList">
                {ka ? "ჯერ არცერთი QR პროფილი არ გაქვთ." : "You do not have any QR profiles yet."}
              </div>
            ) : (
              <div className="productAccessList">
                {profiles.map((profile) => {
                  const current = profileAccess[profile.id] ?? emptyProfileAccess();
                  const title = profile.item_name || (ka ? "უსახელო პროფილი" : "Unnamed profile");
                  const icon = profile.pet_type === "dog" ? "🐶" : profile.pet_type === "cat" ? "🐱" : "🏷️";

                  return (
                    <article className={`productAccessCard ${current.selected ? "selected" : ""}`} key={profile.id}>
                      <button
                        type="button"
                        className="productSelector"
                        onClick={() => updateProfileAccess(profile.id, { selected: !current.selected })}
                      >
                        <span className="productIcon">{profile.photo ? <img src={profile.photo} alt="" /> : icon}</span>
                        <span className="productIdentity">
                          <strong>{title}</strong>
                          <small>{profile.tag_code ? `QR · ${profile.tag_code}` : (ka ? "QR პროფილი" : "QR profile")}</small>
                        </span>
                        <span className="productCheck">{current.selected ? "✓" : "+"}</span>
                      </button>

                      {current.selected && (
                        <div className="profilePermissionGrid">
                          <MiniPermission label={ka ? "ნახვა" : "View"} value={current.can_view_profiles} locked onChange={() => {}} />
                          <MiniPermission label={ka ? "რედაქტირება" : "Edit"} value={current.can_edit_profiles} disabled={!canEditProfiles} onChange={(value) => updateProfileAccess(profile.id, { can_edit_profiles: value })} />
                          <MiniPermission label="Lost Mode" value={current.can_manage_lost_mode} disabled={!canManageLostMode} onChange={(value) => updateProfileAccess(profile.id, { can_manage_lost_mode: value })} />
                          <MiniPermission label={ka ? "ხილვადობა" : "Visibility"} value={current.can_manage_visibility} disabled={!canManageVisibility} onChange={(value) => updateProfileAccess(profile.id, { can_manage_visibility: value })} />
                          <MiniPermission label={ka ? "კონტაქტები" : "Contacts"} value={current.can_manage_contacts} disabled={!canManageContacts} onChange={(value) => updateProfileAccess(profile.id, { can_manage_contacts: value })} />
                          <MiniPermission label={ka ? "ლოკაცია" : "Location"} value={current.can_manage_location} disabled={!canManageLocation} onChange={(value) => updateProfileAccess(profile.id, { can_manage_location: value })} />
                          <MiniPermission label={ka ? "დამატებითი კონტაქტი" : "Extra contact"} value={current.can_manage_additional_contact} disabled={!canManageAdditionalContact} onChange={(value) => updateProfileAccess(profile.id, { can_manage_additional_contact: value })} />
                          <MiniPermission label="Live Chat" value={current.can_use_live_chat} disabled={!canUseLiveChat} onChange={(value) => updateProfileAccess(profile.id, { can_use_live_chat: value })} />
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <section className="card">
            <div className="permissionsHeader">
              <div>
                <span className="eyebrow">
                  {ka ? "უფლებები" : "PERMISSIONS"}
                </span>

                <h2>
                  {ka
                    ? "რისი უფლება ექნება Admin-ს?"
                    : "What can this Admin do?"}
                </h2>

                <p>
                  {ka
                    ? "ყველა უფლება დამოუკიდებელია. ჩართეთ მხოლოდ ის, რაც ნამდვილად გსურთ."
                    : "Every permission is independent. Enable only what you want to allow."}
                </p>
              </div>
            </div>

            <div className="permissionList">
              <PermissionToggle
                icon="👁️"
                title={
                  ka
                    ? "QR პროფილების ნახვა"
                    : "View QR profiles"
                }
                description={
                  ka
                    ? "დაინახოს თქვენი ძაღლის, კატის და ნივთების პროფილები."
                    : "View your pet and item QR profiles."
                }
                value={canViewProfiles}
                onChange={setCanViewProfiles}
                locked
              />

              <PermissionToggle
                icon="✏️"
                title={
                  ka
                    ? "პროფილების რედაქტირება"
                    : "Edit profiles"
                }
                description={
                  ka
                    ? "შეცვალოს ძაღლის, კატის ან ნივთის ინფორმაცია."
                    : "Edit pet or item profile information."
                }
                value={canEditProfiles}
                onChange={setCanEditProfiles}
              />

              <PermissionToggle
                icon="🚨"
                title={
                  ka
                    ? "Lost Mode-ის მართვა"
                    : "Manage Lost Mode"
                }
                description={
                  ka
                    ? "მონიშნოს პროფილი დაკარგულად ან უსაფრთხოდ."
                    : "Mark a profile as lost or safe."
                }
                value={canManageLostMode}
                onChange={setCanManageLostMode}
              />

              <PermissionToggle
                icon="👁"
                title={
                  ka
                    ? "მპოვნელისთვის ხილვადობის მართვა"
                    : "Manage finder visibility"
                }
                description={
                  ka
                    ? "შეცვალოს, რა ინფორმაცია გამოუჩნდება QR-ის მპოვნელს."
                    : "Control which information the finder can see."
                }
                value={canManageVisibility}
                onChange={setCanManageVisibility}
              />

              <PermissionToggle
                icon="📞"
                title={
                  ka
                    ? "კონტაქტის მეთოდების მართვა"
                    : "Manage contact methods"
                }
                description={
                  ka
                    ? "მართოს Phone, WhatsApp და სხვა საკონტაქტო მეთოდები."
                    : "Manage Phone, WhatsApp and other contact options."
                }
                value={canManageContacts}
                onChange={setCanManageContacts}
              />

              <PermissionToggle
                icon="📍"
                title={
                  ka
                    ? "Location Sharing-ის მართვა"
                    : "Manage location sharing"
                }
                description={
                  ka
                    ? "ჩართოს ან გამორთოს მპოვნელის ლოკაციის გაზიარება."
                    : "Enable or disable finder location sharing."
                }
                value={canManageLocation}
                onChange={setCanManageLocation}
              />

              <PermissionToggle
                icon="👥"
                title={
                  ka
                    ? "დამატებითი საკონტაქტო პირის მართვა"
                    : "Manage additional contact"
                }
                description={
                  ka
                    ? "კონკრეტულ QR პროფილზე დაამატოს ან შეცვალოს დამატებითი საკონტაქტო პირი."
                    : "Manage the additional contact for a QR profile."
                }
                value={canManageAdditionalContact}
                onChange={setCanManageAdditionalContact}
              />

              <PermissionToggle
                icon="💬"
                title={
                  ka
                    ? "Live Chat-ის გამოყენება"
                    : "Use Live Chat"
                }
                description={
                  ka
                    ? "ნახოს და უპასუხოს მპოვნელის Live Chat შეტყობინებებს."
                    : "View and answer finder Live Chat messages."
                }
                value={canUseLiveChat}
                onChange={setCanUseLiveChat}
              />
            </div>
          </section>

          <section className="card">
            <div className="accountAccess">
              <div>
                <span className="eyebrow">
                  {ka ? "წვდომა" : "ACCESS"}
                </span>

                <h2>
                  {ka
                    ? "Admin-ის საერთო წვდომა"
                    : "Administrator access"}
                </h2>

                <p>
                  {ka
                    ? "შეგიძლიათ დროებით გაუთიშოთ Admin-ს მთელი წვდომა მისი წაშლის გარეშე."
                    : "Temporarily disable all admin access without removing the administrator."}
                </p>
              </div>

              <button
                type="button"
                className={`bigToggle ${active ? "on" : ""}`}
                onClick={() => setActive((current) => !current)}
              >
                <span />
              </button>
            </div>

            <div
              className={`accessStatus ${
                active ? "activeStatus" : "inactiveStatus"
              }`}
            >
              {active
                ? ka
                  ? "● Admin აქტიურია"
                  : "● Admin access is ON"
                : ka
                ? "● Admin გათიშულია"
                : "● Admin access is OFF"}
            </div>
          </section>

          <div className="actions">
            {admin && (
              <button
                type="button"
                className="removeButton"
                onClick={removeAdmin}
                disabled={removing}
              >
                {removing
                  ? ka
                    ? "იშლება..."
                    : "Removing..."
                  : ka
                  ? "Admin-ის წაშლა"
                  : "Remove Admin"}
              </button>
            )}

            <div className="rightActions">
              <a href="/account" className="cancelButton">
                {ka ? "გაუქმება" : "Cancel"}
              </a>

              <button
                type="submit"
                className="saveButton"
                disabled={saving}
              >
                {saving
                  ? ka
                    ? "ინახება..."
                    : "Saving..."
                  : admin
                  ? ka
                    ? "ცვლილებების შენახვა"
                    : "Save changes"
                  : ka
                  ? "Admin-ის დამატება"
                  : "Add Admin"}
              </button>
            </div>
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
              circle at 8% 10%,
              rgba(20, 101, 232, 0.08),
              transparent 28%
            ),
            radial-gradient(
              circle at 94% 8%,
              rgba(118, 85, 247, 0.08),
              transparent 28%
            ),
            #f7f9fc;
        }

        .header {
          width: calc(100% - 36px);
          max-width: 1000px;
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
          background: linear-gradient(135deg, #1465e8, #7655f7);
          color: white;
          font-size: 14px;
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
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1.7px;
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

        .container {
          width: calc(100% - 36px);
          max-width: 850px;
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
          margin: 36px 0 26px;
        }

        .eyebrow {
          color: #7655f7;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        .heading h1 {
          margin: 8px 0 11px;
          font-size: clamp(38px, 5vw, 48px);
          letter-spacing: -2px;
        }

        .heading p,
        .permissionsHeader p,
        .accountAccess p {
          margin: 0;
          color: #667085;
          font-size: 14px;
          line-height: 1.65;
        }

        .importantNotice {
          margin-bottom: 22px;
          padding: 17px;
          display: flex;
          align-items: flex-start;
          gap: 13px;
          border: 1px solid #dbe7ff;
          border-radius: 15px;
          background: #f5f9ff;
        }

        .noticeIcon {
          width: 38px;
          height: 38px;
          flex: 0 0 38px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          background: white;
        }

        .importantNotice strong {
          color: #344054;
          font-size: 13px;
        }

        .importantNotice p {
          margin: 5px 0 0;
          color: #667085;
          font-size: 12px;
          line-height: 1.55;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .card {
          padding: 28px;
          border: 1px solid #e4e7ec;
          border-radius: 21px;
          background: white;
          box-shadow: 0 10px 30px rgba(16, 24, 40, 0.04);
        }

        .cardTitle {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .adminAvatar {
          width: 55px;
          height: 55px;
          display: grid;
          place-items: center;
          border-radius: 15px;
          background: linear-gradient(135deg, #eef4ff, #f0edff);
          color: #1465e8;
          font-size: 24px;
          font-weight: 900;
        }

        .cardTitle span {
          color: #7655f7;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1.4px;
        }

        .cardTitle h2 {
          margin: 4px 0 0;
          font-size: 21px;
        }

        .emailField {
          display: block;
          margin-top: 24px;
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
          margin-top: 6px;
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
        }

        input:focus {
          border-color: #84adff;
          box-shadow: 0 0 0 3px rgba(20, 101, 232, 0.08);
        }

        .permissionsHeader h2,
        .accountAccess h2 {
          margin: 7px 0;
          font-size: 23px;
        }

        .permissionList {
          margin-top: 24px;
          display: flex;
          flex-direction: column;
        }

        .permissionRow {
          padding: 17px 0;
          display: flex;
          align-items: center;
          gap: 13px;
          border-top: 1px solid #eaecf0;
        }

        .permissionRow:first-child {
          border-top: 0;
          padding-top: 0;
        }

        .permissionIcon {
          width: 42px;
          height: 42px;
          flex: 0 0 42px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: #f2f4f7;
          font-size: 18px;
        }

        .permissionText {
          flex: 1;
        }

        .permissionText strong {
          display: block;
          color: #344054;
          font-size: 13px;
        }

        .permissionText p {
          margin: 4px 0 0;
          color: #98a2b3;
          font-size: 11px;
          line-height: 1.45;
        }

        .toggle {
          width: 48px;
          height: 27px;
          flex: 0 0 48px;
          padding: 3px;
          border: 0;
          border-radius: 999px;
          background: #d0d5dd;
          cursor: pointer;
        }

        .toggle span {
          width: 21px;
          height: 21px;
          display: block;
          border-radius: 50%;
          background: white;
          transition: transform 0.2s ease;
        }

        .toggle.on {
          background: #1465e8;
        }

        .toggle.on span {
          transform: translateX(21px);
        }

        .toggle.locked {
          opacity: 0.75;
          cursor: default;
        }

        .accountAccess {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
        }

        .bigToggle {
          width: 56px;
          height: 31px;
          flex: 0 0 56px;
          padding: 3px;
          border: 0;
          border-radius: 999px;
          background: #d0d5dd;
          cursor: pointer;
        }

        .bigToggle span {
          width: 25px;
          height: 25px;
          display: block;
          border-radius: 50%;
          background: white;
          transition: transform 0.2s ease;
        }

        .bigToggle.on {
          background: #12b76a;
        }

        .bigToggle.on span {
          transform: translateX(25px);
        }

        .accessStatus {
          margin-top: 16px;
          padding: 11px 13px;
          border-radius: 10px;
          font-size: 11px;
          font-weight: 900;
        }

        .activeStatus {
          background: #ecfdf3;
          color: #027a48;
        }

        .inactiveStatus {
          background: #f2f4f7;
          color: #667085;
        }

        .actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
        }

        .rightActions {
          margin-left: auto;
          display: flex;
          gap: 10px;
        }

        .cancelButton,
        .saveButton,
        .removeButton {
          min-height: 47px;
          padding: 0 18px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 900;
          text-decoration: none;
          cursor: pointer;
        }

        .cancelButton {
          border: 1px solid #d0d5dd;
          background: white;
          color: #475467;
        }

        .saveButton {
          border: 0;
          background: linear-gradient(135deg, #1465e8, #7655f7);
          color: white;
        }

        .removeButton {
          border: 1px solid #fecdca;
          background: #fff6f5;
          color: #b42318;
        }

        .saveButton:disabled,
        .removeButton:disabled {
          opacity: 0.65;
        }

        .errorBox,
        .successBox {
          margin-bottom: 15px;
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

        .selectAllButton {
          padding: 10px 14px;
          border: 1px solid #c7d7fe;
          border-radius: 10px;
          background: #eef4ff;
          color: #175cd3;
          font-size: 12px;
          font-weight: 900;
          cursor: pointer;
        }

        .productAccessList {
          display: grid;
          gap: 12px;
          margin-top: 22px;
        }

        .productAccessCard {
          overflow: hidden;
          border: 1px solid #e4e7ec;
          border-radius: 16px;
          background: #fff;
          transition: 0.2s ease;
        }

        .productAccessCard.selected {
          border-color: #84adff;
          box-shadow: 0 8px 24px rgba(20, 101, 232, 0.1);
        }

        .productSelector {
          width: 100%;
          padding: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          border: 0;
          background: transparent;
          text-align: left;
          cursor: pointer;
        }

        .productIcon {
          width: 48px;
          height: 48px;
          flex: 0 0 48px;
          display: grid;
          place-items: center;
          overflow: hidden;
          border-radius: 13px;
          background: #f2f4f7;
          font-size: 23px;
        }

        .productIcon img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .productIdentity {
          min-width: 0;
          flex: 1;
        }

        .productIdentity strong,
        .productIdentity small {
          display: block;
        }

        .productIdentity small {
          margin-top: 4px;
          color: #667085;
          font-size: 11px;
          font-weight: 700;
        }

        .productCheck {
          width: 30px;
          height: 30px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #eef4ff;
          color: #1465e8;
          font-weight: 900;
        }

        .selected .productCheck {
          background: #1465e8;
          color: white;
        }

        .profilePermissionGrid {
          padding: 14px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
          border-top: 1px solid #eaecf0;
          background: #f8faff;
        }

        .miniPermission {
          padding: 10px 11px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          border: 1px solid #e4e7ec;
          border-radius: 10px;
          background: white;
          color: #344054;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
        }

        .miniPermission.on {
          border-color: #84adff;
          background: #eef4ff;
          color: #175cd3;
        }

        .miniPermission:disabled {
          opacity: 0.48;
          cursor: not-allowed;
        }

        .miniPermissionDot {
          width: 18px;
          height: 18px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #eaecf0;
          font-size: 10px;
        }

        .miniPermission.on .miniPermissionDot {
          background: #1465e8;
          color: white;
        }

        .emptyProductList {
          margin-top: 20px;
          padding: 22px;
          border-radius: 12px;
          background: #f2f4f7;
          color: #667085;
          text-align: center;
          font-size: 12px;
          font-weight: 800;
        }

        .statePage {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 30px;
          background: #f7f9fc;
          color: #667085;
          font-family: Inter, Arial, sans-serif;
        }

        @media (max-width: 650px) {
          .card {
            padding: 21px;
          }

          .accountAccess {
            align-items: flex-start;
          }

          .actions {
            align-items: stretch;
            flex-direction: column;
          }

          .rightActions {
            width: 100%;
            margin-left: 0;
          }

          .rightActions > * {
            flex: 1;
          }

          .removeButton {
            width: 100%;
          }

          .profilePermissionGrid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}

function MiniPermission({
  label,
  value,
  onChange,
  disabled = false,
  locked = false,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  locked?: boolean;
}) {
  return (
    <button
      type="button"
      className={`miniPermission ${value ? "on" : ""}`}
      onClick={() => !locked && onChange(!value)}
      disabled={disabled || locked}
    >
      <span>{label}</span>
      <span className="miniPermissionDot">{value ? "✓" : "−"}</span>
    </button>
  );
}

function PermissionToggle({
  icon,
  title,
  description,
  value,
  onChange,
  locked = false,
}: {
  icon: string;
  title: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
  locked?: boolean;
}) {
  return (
    <div className="permissionRow">
      <div className="permissionIcon">{icon}</div>

      <div className="permissionText">
        <strong>{title}</strong>
        <p>{description}</p>
      </div>

      <button
        type="button"
        className={`toggle ${value ? "on" : ""} ${
          locked ? "locked" : ""
        }`}
        onClick={() => {
          if (!locked) {
            onChange(!value);
          }
        }}
        disabled={locked}
        aria-pressed={value}
      >
        <span />
      </button>
    </div>
  );
}
