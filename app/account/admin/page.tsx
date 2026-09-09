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
  adminEmail: string;
  adminFirstName: string;
  adminLastName: string;
  adminPhone: string;
  active: boolean;
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
  adminEmail: "",
  adminFirstName: "",
  adminLastName: "",
  adminPhone: "",
  active: true,
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
  const [editingProfiles, setEditingProfiles] = useState<Record<number, boolean>>({});

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
    setLoading(true); setError("");
    try {
      const { data:{user}, error:userError }=await supabase.auth.getUser();
      if(userError||!user){window.location.href="/login";return;}
      const {data:profileRows,error:profilesError}=await supabase.from("item").select("id,item_name,item_type,pet_type,tag_code,photo").eq("owner_id",user.id).order("id");
      if(profilesError) throw profilesError;
      const ownerProfiles=(profileRows??[]) as OwnerProfile[]; setProfiles(ownerProfiles);
      const {data:rows,error:rowsError}=await supabase.from("profile_co_admins").select("*").eq("owner_id",user.id);
      if(rowsError) throw rowsError;
      const next:Record<number,ProfileAccess>={}; ownerProfiles.forEach(p=>next[p.id]=emptyProfileAccess());
      (rows??[]).forEach(row=>next[row.item_id]={selected:true,adminEmail:row.admin_email,adminFirstName:row.admin_first_name??"",adminLastName:row.admin_last_name??"",adminPhone:row.admin_phone??"",active:row.active,can_view_profiles:true,can_edit_profiles:row.can_edit_profiles,can_manage_lost_mode:row.can_manage_lost_mode,can_manage_visibility:row.can_manage_visibility,can_manage_contacts:row.can_manage_contacts,can_manage_location:row.can_manage_location,can_manage_additional_contact:row.can_manage_additional_contact,can_use_live_chat:row.can_use_live_chat});
      const requested=Number(new URLSearchParams(window.location.search).get("profile"));
      if(Number.isFinite(requested)&&ownerProfiles.some(p=>p.id===requested)) next[requested]={...(next[requested]??emptyProfileAccess()),selected:true};
      setProfileAccess(next);
    } catch(err){setError(err instanceof Error?err.message:"მონაცემების ჩატვირთვა ვერ მოხერხდა.");}
    finally{setLoading(false);}
  }

  async function saveAdmin(event:FormEvent<HTMLFormElement>){
    event.preventDefault();setError("");setSuccess("");setSaving(true);
    try{
      const {data:{user},error:userError}=await supabase.auth.getUser();
      if(userError||!user){window.location.href="/login";return;}
      const chosen=profiles.filter(p=>profileAccess[p.id]?.selected);
      if(!chosen.length) throw new Error("აირჩიეთ მინიმუმ ერთი QR პროფილი.");
      const payload=chosen.map(p=>{const a=profileAccess[p.id],mail=a.adminEmail.trim().toLowerCase();
        if(!a.adminFirstName.trim()||!a.adminLastName.trim()||!a.adminPhone.trim()) throw new Error(`${p.item_name||"QR პროფილი"} — შეავსეთ თანაადმინისტრატორის სახელი, გვარი და ტელეფონი.`);
        if(!mail) throw new Error(`${p.item_name||"QR პროფილი"} — დაამატეთ ელ-ფოსტა.`);
        if(mail===user.email?.toLowerCase()) throw new Error("საკუთარ თავს თანაადმინისტრატორად ვერ დაამატებთ.");
        return {owner_id:user.id,item_id:p.id,admin_email:mail,admin_first_name:a.adminFirstName.trim(),admin_last_name:a.adminLastName.trim(),admin_phone:a.adminPhone.trim(),active:a.active,can_view_profiles:true,can_edit_profiles:a.can_edit_profiles,can_manage_lost_mode:a.can_manage_lost_mode,can_manage_visibility:a.can_manage_visibility,can_manage_contacts:a.can_manage_contacts,can_manage_location:a.can_manage_location,can_manage_additional_contact:a.can_manage_additional_contact,can_use_live_chat:a.can_use_live_chat,updated_at:new Date().toISOString()};});
      const {error:saveError}=await supabase.from("profile_co_admins").upsert(payload,{onConflict:"item_id"});
      if(saveError) throw saveError;
      setSuccess("თანაადმინისტრატორის მონაცემები და უფლებები წარმატებით შეინახა.");await loadAdmin();
    }catch(err){setError(err instanceof Error?err.message:"შენახვა ვერ მოხერხდა.");}
    finally{setSaving(false);}
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

  async function removeProfileAdmin(itemId: number, profileName: string) {
    const confirmed = window.confirm(
      ka
        ? `ნამდვილად გსურთ „${profileName}“ პროფილიდან თანაადმინისტრატორის წაშლა?`
        : `Remove the co-administrator from “${profileName}”?`
    );
    if (!confirmed) return;

    setRemoving(true);
    setError("");
    setSuccess("");

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        window.location.href = "/login";
        return;
      }

      const { error: deleteError } = await supabase
        .from("profile_co_admins")
        .delete()
        .eq("owner_id", user.id)
        .eq("item_id", itemId);
      if (deleteError) throw deleteError;

      setProfileAccess((current) => ({
        ...current,
        [itemId]: emptyProfileAccess(),
      }));
      setSuccess(ka ? "თანაადმინისტრატორი წარმატებით წაიშალა." : "Co-administrator removed.");
    } catch (err) {
      setError(err instanceof Error ? err.message : ka ? "წაშლა ვერ მოხერხდა." : "Could not remove co-administrator.");
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
        <div aria-hidden="true" />

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
          <h1>
            {ka
              ? "თანაადმინისტრატორის რეგისტრაცია და უფლებები"
              : "Co-administrator registration and permissions"}
          </h1>

          <p>
            {ka
              ? "თითოეულ QR პროფილზე შეგიძლიათ დაამატოთ მხოლოდ ერთი თანაადმინისტრატორი. თავად განსაზღვრავთ, რომელ პროფილზე ექნება წვდომა და რა მოქმედებების შესრულება შეეძლება."
              : "You can add only one co-administrator to each QR profile. You decide which profile they can access and which actions they can perform."}
          </p>
        </div>

        <div className="importantNotice">
          <div className="noticeIcon">🔐</div>

          <div>
            <strong>
              {ka
                ? "მფლობელი ყოველთვის მთავარი მმართველია"
                : "The Owner always remains in control"}
            </strong>

            <p>
              {ka
                ? "თანაადმინისტრატორს არ შეუძლია სხვა ადმინისტრატორის დამატება, უსაფრთხოების მონაცემების შეცვლა, ანგარიშის წაშლა ან მფლობელის ჩანაცვლება."
                : "The administrator cannot add another admin, change your security information, delete your account or replace the Owner."}
            </p>
          </div>
        </div>

        {error && <div className="errorBox">{error}</div>}
        {success && <div className="successBox">{success}</div>}

        <form onSubmit={saveAdmin}>
          <section className="card">
            <div className="permissionsHeader">
              <div>
                <h2>{ka ? "თანაადმინისტრატორის წვდომა QR პროფილებზე" : "Co-administrator access to QR profiles"}</h2>
                <p className="profileAccessIntro">
                  {ka
                    ? "აირჩიეთ QR პროფილი ან პროფილები, რომელთა მართვის უფლებას თანაადმინისტრატორს ანიჭებთ."
                    : "Select the QR profile or profiles that the co-administrator will be allowed to manage."}
                </p>
              </div>
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
                        <div className="profileAdminPanel">
                          <div className="profileAdminHeading">
                            <h3 className="profileAdminTitle">{ka ? "თანაადმინისტრატორის მონაცემები და უფლებები" : "Co-administrator details and permissions"}</h3>
                            <button
                              type="button"
                              className="editProfileAdminButton"
                              onClick={() => setEditingProfiles((currentEditing) => ({
                                ...currentEditing,
                                [profile.id]: !currentEditing[profile.id],
                              }))}
                            >
                              {editingProfiles[profile.id]
                                ? ka ? "რედაქტირება ჩართულია" : "Editing enabled"
                                : ka ? "რედაქტირება" : "Edit"}
                            </button>
                          </div>
                          <p className="profileEditNote">{ka ? "შეგიძლიათ შეცვალოთ ნებისმიერი მონაცემი ან მინიჭებული უფლება." : "You can edit any detail or assigned permission."}</p>
                          <div className="profileContactGrid">
                            <label>
                              <span>{ka ? "სახელი" : "First name"} *</span>
                              <input value={current.adminFirstName} onChange={(e) => updateProfileAccess(profile.id, { adminFirstName: e.target.value })} disabled={Boolean(current.adminEmail) && !editingProfiles[profile.id]} required />
                            </label>
                            <label>
                              <span>{ka ? "გვარი" : "Last name"} *</span>
                              <input value={current.adminLastName} onChange={(e) => updateProfileAccess(profile.id, { adminLastName: e.target.value })} disabled={Boolean(current.adminEmail) && !editingProfiles[profile.id]} required />
                            </label>
                            <label>
                              <span>{ka ? "ტელეფონის ნომერი" : "Phone number"} *</span>
                              <input type="tel" value={current.adminPhone} onChange={(e) => updateProfileAccess(profile.id, { adminPhone: e.target.value })} placeholder="+995 5XX XX XX XX" disabled={Boolean(current.adminEmail) && !editingProfiles[profile.id]} required />
                            </label>
                            <label className="profileEmailField">
                              <span>{ka ? "ელ-ფოსტა" : "Email"} *</span>
                              <input type="email" value={current.adminEmail} onChange={(e) => updateProfileAccess(profile.id, { adminEmail: e.target.value })} placeholder="admin@example.com" disabled={Boolean(current.adminEmail) && !editingProfiles[profile.id]} required />
                            </label>
                          </div>
                          <p className="adminLinkNote">{ka ? "ელ-ფოსტა თანაადმინისტრატორის ანგარიშს დაუკავშირდება." : "The email will be linked to the co-administrator account."}</p>
                          {profiles.length > 1 && (
                            <label className="copyProfileField">
                              <span>{ka ? "თუ იმავე თანაადმინისტრატორის დამატება სხვა პროფილებზეც, იგივე უფლებებით გსურთ, მონიშნეთ სასურველი პროფილები. სხვა შემთხვევაში შესაბამის პროფილში ინფორმაცია ცალკე შეავსეთ." : "To add the same co-administrator to other profiles with the same permissions, select the desired profiles. Otherwise, enter the information separately in the relevant profile."}</span>
                              <select defaultValue="" onChange={(event) => {
                                const targetId = Number(event.target.value);
                                if (!targetId) return;
                                setProfileAccess((existing) => ({
                                  ...existing,
                                  [targetId]: { ...current, selected: true }
                                }));
                                event.target.value = "";
                              }}>
                                <option value="">{ka ? "აირჩიეთ სხვა QR პროფილი" : "Select another QR profile"}</option>
                                {profiles.filter((item) => item.id !== profile.id).map((item) => (
                                  <option key={item.id} value={item.id}>{item.item_name || (ka ? "უსახელო პროფილი" : "Unnamed profile")}</option>
                                ))}
                              </select>
                            </label>
                          )}
                          <button
                            type="button"
                            className="profileRemoveButton"
                            disabled={removing}
                            onClick={() => removeProfileAdmin(profile.id, title)}
                          >
                            {removing
                              ? ka ? "იშლება..." : "Removing..."
                              : ka ? "თანაადმინისტრატორის წაშლა" : "Remove co-administrator"}
                          </button>
                          <div className="profilePermissionGrid">
                          <MiniPermission label={ka ? "რედაქტირება" : "Edit"} value={current.can_edit_profiles} onChange={(value) => updateProfileAccess(profile.id, { can_edit_profiles: value })} disabled={Boolean(current.adminEmail) && !editingProfiles[profile.id]} />
                          <MiniPermission label={ka ? "დაკარგვის რეჟიმი" : "Lost Mode"} value={current.can_manage_lost_mode} onChange={(value) => updateProfileAccess(profile.id, { can_manage_lost_mode: value })} disabled={Boolean(current.adminEmail) && !editingProfiles[profile.id]} />
                          <MiniPermission label={ka ? "ხილვადობა" : "Visibility"} value={current.can_manage_visibility} onChange={(value) => updateProfileAccess(profile.id, { can_manage_visibility: value })} disabled={Boolean(current.adminEmail) && !editingProfiles[profile.id]} />
                          <MiniPermission label={ka ? "კონტაქტები" : "Contacts"} value={current.can_manage_contacts} onChange={(value) => updateProfileAccess(profile.id, { can_manage_contacts: value })} disabled={Boolean(current.adminEmail) && !editingProfiles[profile.id]} />
                          <MiniPermission label={ka ? "ლოკაცია" : "Location"} value={current.can_manage_location} onChange={(value) => updateProfileAccess(profile.id, { can_manage_location: value })} disabled={Boolean(current.adminEmail) && !editingProfiles[profile.id]} />
                          <MiniPermission label={ka ? "დამატებითი კონტაქტი" : "Extra contact"} value={current.can_manage_additional_contact} onChange={(value) => updateProfileAccess(profile.id, { can_manage_additional_contact: value })} disabled={Boolean(current.adminEmail) && !editingProfiles[profile.id]} />
                          <MiniPermission label={ka ? "Live Chat" : "Live Chat"} value={current.can_use_live_chat} onChange={(value) => updateProfileAccess(profile.id, { can_use_live_chat: value })} disabled={Boolean(current.adminEmail) && !editingProfiles[profile.id]} />
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <div className="actions">

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
                  : ka ? "ცვლილებების შენახვა" : "Save changes"}
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
          background: #063b72;
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
            radial-gradient(circle at 21% 17%, rgba(78, 166, 238, 0.3), transparent 30%),
            linear-gradient(180deg, #0a4c8a 0%, #063b72 100%);
        }

        .header {
          width: calc(100% - 36px);
          max-width: 1000px;
          min-height: 86px;
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.22);
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
          color: #d9edff;
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
          color: #ffffff;
          font-size: clamp(38px, 5vw, 48px);
          letter-spacing: -2px;
        }

        .heading p {
          margin: 0;
          color: #e2f1ff;
          font-size: 16px;
          line-height: 1.65;
        }

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
          background: #ffffff;
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
          color: #173a67;
          font-size: 17px;
          line-height: 1.4;
        }

        .importantNotice p {
          margin: 7px 0 0;
          color: #405b78;
          font-size: 15px;
          line-height: 1.6;
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
          margin-top: 8px;
          color: #52677f;
          font-size: 15px;
          font-weight: 650;
          line-height: 1.55;
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
          margin: 7px 0 9px;
          color: #173a67;
          font-size: 26px;
          line-height: 1.3;
        }

        .permissionsHeader p {
          color: #52677f;
          font-size: 16px;
          line-height: 1.6;
        }

        .profileAccessIntro {
          color: #0a58ca !important;
          font-size: 16px !important;
          font-weight: 750;
        }

        .permissionList {
          margin-top: 24px;
          display: flex;
          flex-direction: column;
        }

        .permissionRow {
          padding: 21px 0;
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
          background: #eaf3ff;
          color: #0a58ca;
          font-size: 21px;
        }

        .permissionText {
          flex: 1;
        }

        .permissionText strong {
          display: block;
          color: #173a67;
          font-size: 17px;
          line-height: 1.4;
        }

        .permissionText p {
          margin: 6px 0 0;
          color: #52677f;
          font-size: 15px;
          line-height: 1.6;
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

        .profileAdminPanel{padding:18px;border-top:1px solid #dbe7f5;background:#f8fbff}
        .profileAdminHeading{display:flex;align-items:center;justify-content:space-between;gap:14px}
        .profileAdminTitle{margin:0;color:#173a67;font-size:20px;line-height:1.35}
        .editProfileAdminButton{flex:0 0 auto;min-height:42px;padding:0 15px;border:1px solid #8bb8ee;border-radius:10px;background:#0a58ca;color:#fff;font-size:14px;font-weight:900;cursor:pointer}
        .editProfileAdminButton:hover{background:#0849a8}
        .profileContactGrid input:disabled{background:#eef2f6;color:#667085;cursor:not-allowed}
        .profileEditNote{margin:6px 0 16px;color:#52677f;font-size:14px;line-height:1.55}
        .profileContactGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
        .profileContactGrid label span{font-size:14px;color:#24486f;font-weight:800}
        .profileContactGrid input{background:#fff;font-size:16px}
        .adminLinkNote{margin:10px 0 0;color:#0a58ca;font-size:14px;font-weight:700}
        .copyProfileField{display:block;margin-top:16px;padding:14px;border:1px solid #b9d4f5;border-radius:11px;background:#eef6ff}
        .copyProfileField span{display:block;margin-bottom:8px;color:#173a67;font-size:14px;font-weight:850}
        .copyProfileField select{width:100%;min-height:46px;padding:0 12px;border:1px solid #a9c9f4;border-radius:9px;background:#fff;color:#173a67;font-size:15px}
        .profileRemoveButton{margin-top:16px;min-height:44px;padding:0 14px;border:1px solid #f0a7a2;border-radius:10px;background:#fff1f0;color:#b42318;font-size:14px;font-weight:850;cursor:pointer}
        .profileRemoveButton:disabled{opacity:.6;cursor:not-allowed}
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

          .profilePermissionGrid,
          .profileContactGrid {
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
      {icon && <div className="permissionIcon">{icon}</div>}

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
