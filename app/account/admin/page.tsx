"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Lang = "ka" | "en";

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

  const [savedProfileIds, setSavedProfileIds] = useState<number[]>([]);
  const [profiles, setProfiles] = useState<OwnerProfile[]>([]);
  const [profileAccess, setProfileAccess] = useState<Record<number, ProfileAccess>>({});
  const [openProfileId, setOpenProfileId] = useState<number | null>(null);

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
      setSavedProfileIds((rows ?? []).map(row => Number(row.item_id)));
      const next:Record<number,ProfileAccess>={}; ownerProfiles.forEach(p=>next[p.id]=emptyProfileAccess());
      (rows??[]).forEach(row=>next[row.item_id]={selected:true,adminEmail:row.admin_email,adminFirstName:row.admin_first_name??"",adminLastName:row.admin_last_name??"",adminPhone:row.admin_phone??"",active:row.active,can_view_profiles:true,can_edit_profiles:row.can_edit_profiles,can_manage_lost_mode:row.can_manage_lost_mode,can_manage_visibility:row.can_manage_visibility,can_manage_contacts:row.can_manage_contacts,can_manage_location:row.can_manage_location,can_manage_additional_contact:row.can_manage_additional_contact,can_use_live_chat:row.can_use_live_chat});
      const requested=Number(new URLSearchParams(window.location.search).get("profile"));
      if(Number.isFinite(requested)&&ownerProfiles.some(p=>p.id===requested)) {
        next[requested]={...(next[requested]??emptyProfileAccess()),selected:true};
        setOpenProfileId(requested);
      }
      setOpenProfileId(current => current ?? (ownerProfiles.some(p => p.id === requested) ? requested : ownerProfiles[0]?.id ?? null));
      setProfileAccess(next);
    } catch(err){setError(err instanceof Error?err.message:"მონაცემების ჩატვირთვა ვერ მოხერხდა.");}
    finally{setLoading(false);}
  }

  async function saveAdmin(event:FormEvent<HTMLFormElement>){
    event.preventDefault();setError("");setSuccess("");setSaving(true);
    try{
      const {data:{user},error:userError}=await supabase.auth.getUser();
      if(userError||!user){window.location.href="/login";return;}
      const chosen=profiles.filter(p=>p.id === openProfileId);
      if(!chosen.length) throw new Error("აირჩიეთ მინიმუმ ერთი QR პროფილი.");
      const payload=chosen.map(p=>{const a=profileAccess[p.id],mail=a.adminEmail.trim().toLowerCase();
        if(!a.adminFirstName.trim()||!a.adminLastName.trim()||!a.adminPhone.trim()) throw new Error(`${p.item_name||"QR პროფილი"} — შეავსეთ თანაადმინისტრატორის სახელი, გვარი და ტელეფონი.`);
        if(!mail) throw new Error(`${p.item_name||"QR პროფილი"} — დაამატეთ ელ-ფოსტა.`);
        if(mail===user.email?.toLowerCase()) throw new Error("საკუთარ თავს თანაადმინისტრატორად ვერ დაამატებთ.");
        return {owner_id:user.id,item_id:p.id,admin_email:mail,admin_first_name:a.adminFirstName.trim(),admin_last_name:a.adminLastName.trim(),admin_phone:a.adminPhone.trim(),active:a.active,can_view_profiles:true,can_edit_profiles:a.can_edit_profiles,can_manage_lost_mode:a.can_manage_lost_mode,can_manage_visibility:a.can_manage_visibility,can_manage_contacts:a.can_manage_contacts,can_manage_location:a.can_manage_location,can_manage_additional_contact:a.can_manage_additional_contact,can_use_live_chat:a.can_use_live_chat,updated_at:new Date().toISOString()};});
      const {error:saveError}=await supabase.from("profile_co_admins").upsert(payload,{onConflict:"item_id"});
      if(saveError) throw saveError;
      setSavedProfileIds(ids => Array.from(new Set([...ids, ...chosen.map(p => p.id)])));
      setSuccess(ka ? "ამ პროფილის თანაადმინისტრატორი და უფლებები შენახულია." : "Co-administrator and permissions saved for this profile.");
    }catch(err){setError(err instanceof Error?err.message:"შენახვა ვერ მოხერხდა.");}
    finally{setSaving(false);}
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
      setSavedProfileIds(ids => ids.filter(id => id !== itemId));
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
      <main className="coAdminPage statePage">
        {ka ? "იტვირთება..." : "Loading..."}
        <AdminStyles />
      </main>
    );
  }

  return (
    <main className="coAdminPage">
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
        <a href="/my-profiles" className="back">
          ← {ka ? "ჩემი პროფილები" : "My profiles"}
        </a>

        <div className="heading">
          <span className="heroBadge">QR RETURN · {ka ? "გაზიარებული მართვა" : "Shared management"}</span>
          <h1>
            {ka
              ? "პროფილის ადმინისტრატორი"
              : "Profile administrator"}
          </h1>

          <p>
            {ka
              ? "აირჩიეთ პროფილი, შეიყვანეთ სანდო პირის აუცილებელი მონაცემები და მონიშნეთ მისთვის საჭირო უფლებები."
              : "You can add only one co-administrator to each QR profile. You decide which profile they can access and which actions they can perform."}
          </p>
        </div>

        {error && <div className="errorBox" role="alert">{error}</div>}
        {success && <div className="successBox" role="status">{success}</div>}

        <form onSubmit={saveAdmin}>
          <fieldset disabled={saving || removing}>
          <section className="card">
            <div className="permissionsHeader">
              <div>
                <h2><span className="stepNumber">01</span>{ka ? "აირჩიეთ QR პროფილი" : "Choose a QR profile"}</h2>
                <p className="profileAccessIntro">
                  {ka
                    ? "გახსენით სასურველი პროფილი და შეავსეთ მხოლოდ აუცილებელი ველები."
                    : "Select the QR profile that the co-administrator will be allowed to manage."}
                </p>
              </div>
            </div>

            {profiles.length > 0 && <label className="profileChoice"><span>{ka ? "QR პროფილი" : "QR profile"}</span><select value={openProfileId ?? ""} disabled={saving || removing} onChange={event => { setOpenProfileId(Number(event.target.value)); setError(""); setSuccess(""); }}>{profiles.map(profile => <option key={profile.id} value={profile.id}>{profile.item_name || profile.tag_code || "QR"} · {profile.tag_code}</option>)}</select></label>}
            {profiles.length === 0 ? (
              <div className="emptyProductList">
                {ka ? "ჯერ არცერთი QR პროფილი არ გაქვთ." : "You do not have any QR profiles yet."}
              </div>
            ) : (
              <div className="productAccessList">
                {profiles.filter(profile => profile.id === openProfileId).map((profile) => {
                  const current = profileAccess[profile.id] ?? emptyProfileAccess();
                  const title = profile.item_name || (ka ? "უსახელო პროფილი" : "Unnamed profile");
                  const icon = profile.pet_type === "dog" ? "🐶" : profile.pet_type === "cat" ? "🐱" : "🏷️";

                  return (
                    <article className={`productAccessCard ${openProfileId === profile.id ? "selected" : ""}`} key={profile.id}>
                      <div className="productSelector">
                        <span className="productIcon">{profile.photo ? <img src={profile.photo} alt="" /> : icon}</span>
                        <span className="productIdentity">
                          <strong>{title}</strong>
                          <small>{profile.tag_code ? `QR · ${profile.tag_code}` : (ka ? "QR პროფილი" : "QR profile")}</small>
                        </span>
                      </div>

                      {openProfileId === profile.id && (
                        <div className="profileAdminPanel">
                          <div className="profileAdminHeading"><h3 className="profileAdminTitle"><span className="stepNumber">02</span>{ka ? "სანდო პირის მონაცემები" : "Trusted person details"}</h3></div>
                          <div className="profileContactGrid">
                            <label>
                              <span>{ka ? "სახელი" : "First name"} *</span>
                              <input value={current.adminFirstName} onChange={(e) => updateProfileAccess(profile.id, { adminFirstName: e.target.value })} required />
                            </label>
                            <label>
                              <span>{ka ? "გვარი" : "Last name"} *</span>
                              <input value={current.adminLastName} onChange={(e) => updateProfileAccess(profile.id, { adminLastName: e.target.value })} required />
                            </label>
                            <label>
                              <span>{ka ? "ტელეფონის ნომერი" : "Phone number"} *</span>
                              <input type="tel" value={current.adminPhone} onChange={(e) => updateProfileAccess(profile.id, { adminPhone: e.target.value })} placeholder="+995 5XX XX XX XX" required />
                            </label>
                            <label className="profileEmailField">
                              <span>{ka ? "ელ-ფოსტა" : "Email"} *</span>
                              <input type="email" value={current.adminEmail} onChange={(e) => updateProfileAccess(profile.id, { adminEmail: e.target.value })} placeholder="admin@example.com" required />
                            </label>
                          </div>
                          <p className="adminLinkNote">{ka ? "ელ-ფოსტა სანდო პირის ანგარიშს უსაფრთხოდ დაუკავშირდება." : "The email will securely link to the trusted person's account."}</p>
                          <h3 className="permissionTitle"><span className="stepNumber">03</span>{ka ? "რისი უფლება ექნება?" : "What can they do?"}</h3>
                          <div className="profilePermissionGrid">
                          <MiniPermission label={ka ? "რედაქტირება" : "Edit"} value={current.can_edit_profiles} onChange={(value) => updateProfileAccess(profile.id, { can_edit_profiles: value })} />
                          <MiniPermission label={ka ? "დაკარგვის რეჟიმი" : "Lost Mode"} value={current.can_manage_lost_mode} onChange={(value) => updateProfileAccess(profile.id, { can_manage_lost_mode: value })} />
                          <MiniPermission label={ka ? "ხილვადობა" : "Visibility"} value={current.can_manage_visibility} onChange={(value) => updateProfileAccess(profile.id, { can_manage_visibility: value })} />
                          <MiniPermission label={ka ? "კონტაქტები" : "Contacts"} value={current.can_manage_contacts} onChange={(value) => updateProfileAccess(profile.id, { can_manage_contacts: value })} />
                          <MiniPermission label={ka ? "ლოკაცია" : "Location"} value={current.can_manage_location} onChange={(value) => updateProfileAccess(profile.id, { can_manage_location: value })} />
                          <MiniPermission label={ka ? "დამატებითი კონტაქტი" : "Extra contact"} value={current.can_manage_additional_contact} onChange={(value) => updateProfileAccess(profile.id, { can_manage_additional_contact: value })} />
                          <MiniPermission label={ka ? "Live Chat" : "Live Chat"} value={current.can_use_live_chat} onChange={(value) => updateProfileAccess(profile.id, { can_use_live_chat: value })} />
                          </div>
                          {savedProfileIds.includes(profile.id) && <>
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
                          </>}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          </fieldset>
          <div className="actions">

            <div className="rightActions">
              <a href="/my-profiles" className="cancelButton">
                {ka ? "გაუქმება" : "Cancel"}
              </a>

              <button
                type="submit"
                className="saveButton"
                disabled={saving || removing || openProfileId === null}
              >
                {saving
                  ? ka
                    ? "ინახება..."
                    : "Saving..."
                  : ka ? "ამ პროფილის შენახვა" : "Save this profile"}
              </button>
            </div>
          </div>
        </form>
      </section>

      <AdminStyles />
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
      aria-pressed={value}
    >
      <span>{label}</span>
      <span className="miniPermissionDot" aria-hidden="true"><span>{value ? "✓" : ""}</span></span>
    </button>
  );
}

function AdminStyles() {
  return <style jsx global>{`
    .coAdminPage { min-height:100dvh; background:#f3f6fa; color:#193650; padding:0 20px 40px; }
    .coAdminPage * { box-sizing:border-box; }
    .coAdminPage fieldset { border:0; padding:0; margin:0; min-width:0; }
    .coAdminPage :is(button,input,select) { font:inherit; }
    .coAdminPage :is(button,a,input,select):focus-visible { outline:3px solid #87b9f7; outline-offset:3px; }
    .coAdminPage .header { max-width:820px; margin:auto; min-height:64px; display:flex; justify-content:space-between; align-items:center; }
    .coAdminPage .languages { display:flex; padding:3px; border:1px solid #dce5ef; background:white; border-radius:10px; }
    .coAdminPage .languages button { padding:7px 10px; border:0; border-radius:7px; color:#617389; background:transparent; cursor:pointer; font-size:12px; }
    .coAdminPage .languages .active { color:#1465d9; background:#edf4ff; }
    .coAdminPage .container { max-width:820px; margin:auto; }
    .coAdminPage .back { color:#1465d9; text-decoration:none; font-size:14px; }
    .coAdminPage .heading { margin:22px 0; }
    .coAdminPage .heading h1 { margin:0 0 10px; font-size:28px; line-height:1.4; }
    .coAdminPage .heading p { margin:0; font-size:14px; color:#617389; line-height:1.7; max-width:640px; }
    .coAdminPage .card { padding:24px; border:1px solid #dce5ef; border-radius:18px; background:white; box-shadow:0 8px 28px #18365006; }
    .coAdminPage .permissionsHeader h2 { margin:0 0 6px; font-size:18px; }
    .coAdminPage .profileAccessIntro { margin:0 0 20px; color:#617389; font-size:13px; line-height:1.6; }
    .coAdminPage label>span { display:block; margin-bottom:7px; color:#3f5872; font-size:13px; }
    .coAdminPage input,.coAdminPage select { width:100%; min-width:0; min-height:46px; padding:10px 12px; border:1px solid #d4dfec; border-radius:10px; background:#fff; color:#193650; font-size:16px; }
    .coAdminPage .profileChoice select { background:#f7faff; }
    .coAdminPage .productAccessList { margin-top:20px; }
    .coAdminPage .productSelector { display:flex; align-items:center; gap:12px; padding-bottom:18px; border-bottom:1px solid #e6edf4; }
    .coAdminPage .productIcon { width:46px; height:46px; display:grid; place-items:center; border-radius:12px; background:#edf4ff; font-size:24px; overflow:hidden; }
    .coAdminPage .productIcon img { width:100%; height:100%; object-fit:cover; }
    .coAdminPage .productIdentity { min-width:0; overflow-wrap:anywhere; }
    .coAdminPage .productIdentity strong,.coAdminPage .productIdentity small { display:block; }
    .coAdminPage .productIdentity strong { font-size:16px; }
    .coAdminPage .productIdentity small { margin-top:4px; color:#617389; font-size:12px; }
    .coAdminPage .profileAdminTitle,.coAdminPage .permissionTitle { margin:22px 0 16px; font-size:16px; }
    .coAdminPage .profileContactGrid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:16px; }
    .coAdminPage .adminLinkNote { margin:12px 0; color:#617389; font-size:12px; line-height:1.6; }
    .coAdminPage .profilePermissionGrid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; }
    .coAdminPage .miniPermission { display:flex; justify-content:space-between; align-items:center; gap:12px; padding:13px; min-height:48px; border:1px solid #dce5ef; border-radius:10px; background:#fff; color:#3f5872; text-align:left; font-size:14px; cursor:pointer; }
    .coAdminPage .miniPermission.on { border-color:#86b4ee; background:#edf4ff; color:#1256b0; }
    .coAdminPage .miniPermissionDot { width:22px; height:22px; flex-shrink:0; display:grid; place-items:center; border-radius:6px; background:#edf1f6; }
    .coAdminPage .miniPermission.on .miniPermissionDot { background:#1465d9; color:#fff; }
    .coAdminPage .profileRemoveButton { margin-top:26px; padding:10px 0; border:0; border-top:1px solid #edf1f6; background:white; color:#af3045; font-size:13px; cursor:pointer; }
    .coAdminPage .actions { margin-top:18px; }
    .coAdminPage .rightActions { display:flex; justify-content:flex-end; gap:12px; }
    .coAdminPage .cancelButton,.coAdminPage .saveButton { display:inline-flex; justify-content:center; align-items:center; padding:13px 18px; min-height:46px; border:1px solid #dce5ef; border-radius:10px; background:white; color:#3f5872; text-decoration:none; font-size:14px; cursor:pointer; }
    .coAdminPage .saveButton { background:#1465d9; border-color:#1465d9; color:white; }
    .coAdminPage button:disabled { opacity:.55; cursor:default; }
    .coAdminPage .errorBox,.coAdminPage .successBox { padding:14px; margin-bottom:16px; border-radius:10px; font-size:14px; line-height:1.6; overflow-wrap:anywhere; }
    .coAdminPage .errorBox { background:#fff1f2; color:#a52235; border:1px solid #fecaca; }
    .coAdminPage .successBox { background:#ecfdf5; color:#17644d; border:1px solid #b7e8d4; }
    .coAdminPage .emptyProductList { padding:24px; color:#617389; text-align:center; }
    .coAdminPage.statePage { display:grid; place-items:center; }
    body.kompasiAppMode .coAdminPage { padding-bottom:100px; }
    .coAdminPage { background:linear-gradient(150deg,#e9f2ff 0%,#f5f8ff 45%,#eef7fb 100%); }
    .coAdminPage .heading { padding:24px 28px; border-radius:20px; background:linear-gradient(115deg,#123c88,#1465d9); color:#fff; box-shadow:0 10px 28px #154c9b24; }
    .coAdminPage .heroBadge { display:inline-block; margin-bottom:12px; padding:6px 10px; border:1px solid #ffffff42; border-radius:7px; background:#ffffff14; color:#e1edff; font-size:11px; font-weight:700; letter-spacing:.4px; }
    .coAdminPage .heading h1 { color:#fff; font-size:27px; }
    .coAdminPage .heading p { color:#e0ebff; font-size:14px; }
    .coAdminPage .languages { display:flex; padding:4px; gap:4px; background:#fff; border:1px solid #cbdcf4; border-radius:10px; }
    .coAdminPage .languages button { border:0; border-radius:7px; padding:7px 11px; background:transparent; color:#526783; cursor:pointer; }
    .coAdminPage .languages button.active { color:#fff; background:#1465d9; }
    .coAdminPage .card { border-color:#cfdef3; box-shadow:0 12px 36px #234f8b0b; padding:24px; }
    .coAdminPage .permissionsHeader h2,.coAdminPage .profileAdminTitle,.coAdminPage .permissionTitle { display:flex; align-items:center; gap:10px; color:#123c88; font-size:17px; }
    .coAdminPage .stepNumber { display:inline-grid; place-items:center; flex-shrink:0; width:30px; height:30px; background:#e4efff; color:#1465d9; border-radius:9px; font-size:12px; font-weight:700; }
    .coAdminPage .profileAccessIntro { margin-bottom:14px; }
    .coAdminPage .profileChoice select { background:#edf4ff; border-color:#a7c5f0; font-weight:600; }
    .coAdminPage .productAccessList { margin-top:14px; }
    .coAdminPage .productSelector { padding:12px 14px; border:1px solid #c6dcfa; border-left:4px solid #1465d9; border-radius:12px; background:#f0f6ff; }
    .coAdminPage .productIcon { background:#fff; }
    .coAdminPage .productIdentity strong { color:#123c88; }
    .coAdminPage label>span { color:#28496b; font-weight:600; }
    .coAdminPage input { background:#f8faff; border-color:#cbdaf0; }
    .coAdminPage input:focus { background:#fff; border-color:#1465d9; }
    .coAdminPage .adminLinkNote { color:#47698b; }
    .coAdminPage .permissionTitle { border-top:1px solid #dce8f8; padding-top:20px; }
    .coAdminPage .miniPermission { background:#f5f8ff; border-color:#d3e1f5; color:#28496b; font-weight:600; padding:12px 14px; transition:background .15s,border-color .15s; }
    .coAdminPage .miniPermission:hover { border-color:#79a7e7; background:#eaf2ff; }
    .coAdminPage .miniPermission.on { background:#e3efff; border-color:#508ce0; color:#104b9e; }
    .coAdminPage .miniPermissionDot { width:40px; height:24px; padding:3px; border-radius:20px; background:#aabbd2; display:flex; align-items:center; }
    .coAdminPage .miniPermissionDot>span { width:18px; height:18px; border-radius:50%; background:white; box-shadow:0 1px 3px #19365030; display:grid; place-items:center; font-size:12px; color:#1465d9; }
    .coAdminPage .miniPermission.on .miniPermissionDot { background:#1465d9; }
    .coAdminPage .miniPermission.on .miniPermissionDot>span { transform:translateX(16px); }
    .coAdminPage .profileRemoveButton { background:#fff4f5; border:1px solid #f0cbd2; padding:10px 14px; border-radius:9px; margin-top:20px; }
    .coAdminPage .actions { padding:16px 18px; border:1px solid #c8dcf6; background:#e7f0ff; border-radius:14px; }
    .coAdminPage .saveButton { background:#1465d9; border-color:#1465d9; color:#fff; font-weight:700; box-shadow:0 4px 10px #1465d925; }
    .coAdminPage .saveButton:hover:not(:disabled) { background:#104fae; }
    @media(max-width:600px) { .coAdminPage { padding:0 14px 30px; }.coAdminPage .heading { padding:20px; }.coAdminPage .heading h1 { font-size:23px; }.coAdminPage .card { padding:18px; }.coAdminPage .profileContactGrid,.coAdminPage .profilePermissionGrid { grid-template-columns:1fr; }.coAdminPage .rightActions>* { flex:1; padding:12px 10px; }.coAdminPage .header { min-height:58px; }.coAdminPage .actions { padding:12px; } }
  `}</style>;
}
