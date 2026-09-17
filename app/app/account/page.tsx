"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
const Base = () => (
  <style jsx global>{`
    .sub{min-height:100vh;background:#f4f7fb;color:#173652;font-family:Inter,Arial,sans-serif}
    .subw{width:min(560px,100%);margin:auto;padding:24px 13px 94px}
    .sub header small{color:#71869a;font-size:8px;font-weight:850;letter-spacing:1px}
    .sub h1{margin:5px 0 0;font-size:23px}
    .sub header p{margin:8px 0 0;color:#708599;font-size:10px;line-height:1.5}
  `}</style>
);
const links = [
  ["✎", "პირადი ინფორმაცია", "სახელი, გვარი, ელფოსტა და Login", "/account/profile?source=app", "violet"],
  ["⌾", "უსაფრთხოება", "პაროლი, კოდური სიტყვა და დაცვა", "/account/security?source=app", "green"],
  ["♢", "შეტყობინებები", "Push, QR სკანები, ჩათი და სიახლეები", "/account/notifications?source=app", "blue"],
  ["?", "დახმარება და კონტაქტი", "KOMPASI მხარდაჭერა 24/7", "/support?source=app", "gold"],
];
export default function Account() {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const [name, setName] = useState("KOMPASI მომხმარებელი");
  const [email, setEmail] = useState("");

  useEffect(() => {
    void supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.replace("/login?source=app&next=%2Fapp%2Faccount");
      if (user) {
        const fullName = [user.user_metadata?.first_name, user.user_metadata?.last_name].filter(Boolean).join(" ");
        setName(fullName || user.user_metadata?.full_name || "KOMPASI მომხმარებელი");
        setEmail(user.email || "");
      }
    });
  }, [router]);

  async function signOut() {
    if (signingOut) return;
    setSigningOut(true);
    await supabase.auth.signOut();
    window.localStorage.removeItem("kompasi-app-mode");
    router.replace("/login?source=app");
    router.refresh();
  }

  return (
    <main className="sub">
      <div className="subw">
        <header>
          <small>KOMPASI ACCOUNT</small>
          <h1>ანგარიში</h1>
          <p>მართეთ პირადი მონაცემები, უსაფრთხოება და აპის შეტყობინებები.</p>
        </header>
        <section className="accountIdentity">
          <span className="accountAvatar">{name.charAt(0).toUpperCase()}</span>
          <span className="accountCopy"><small>ACCOUNT OWNER</small><b>{name}</b><em>{email || "ელფოსტა არ არის დამატებული"}</em></span>
          <i>✓</i>
        </section>
        <div className="accountSectionTitle"><span>ანგარიშის მართვა</span><small>აირჩიეთ სასურველი განყოფილება</small></div>
        <section className="accountMenu">
          {links.map(([icon, a, b, h, color]) => (
            <Link href={h} key={a} className={color}>
              <i>{icon}</i>
              <span>
                <b>{a}</b>
                <small>{b}</small>
              </span>
              <em>›</em>
            </Link>
          ))}
        </section>
        <button className="appLogout" type="button" onClick={signOut} disabled={signingOut}>
          <i>↪</i><span><b>{signingOut ? "მიმდინარეობს გასვლა…" : "აპლიკაციიდან გასვლა"}</b><small>ანგარიშის უსაფრთხოდ დასრულება</small></span>
        </button>
      </div>
      <Base />
      <style>{`.sub{overflow-x:hidden;background:radial-gradient(circle at 88% 0%,rgba(27,197,157,.2),transparent 25%),radial-gradient(circle at 5% 8%,rgba(45,119,255,.34),transparent 31%),linear-gradient(180deg,#061a31 0%,#0a355c 100%)}.subw{width:min(480px,calc(100% - 24px));padding:26px 0 104px}.sub header small{color:#a9d2f4;font-size:9px}.sub h1{color:#fff;font-size:27px}.sub header p{max-width:390px;color:#d2e6f7;font-size:11px}.accountIdentity{position:relative;width:100%;min-height:91px;margin-top:17px;padding:14px;display:flex;align-items:center;gap:12px;overflow:hidden;border:1px solid rgba(255,255,255,.28);border-radius:21px;background:linear-gradient(145deg,rgba(21,103,174,.9),rgba(7,46,86,.94) 58%,rgba(8,122,99,.82));color:#fff;box-shadow:0 18px 40px rgba(0,15,34,.28),inset 0 1px 0 rgba(255,255,255,.18)}.accountIdentity:after{content:"";position:absolute;right:-33px;top:-51px;width:120px;height:120px;border:21px solid rgba(255,255,255,.06);border-radius:50%}.accountAvatar{width:57px;height:57px;display:grid;place-items:center;flex:0 0 57px;border:2px solid rgba(255,255,255,.72);border-radius:18px;background:linear-gradient(145deg,#298fe6,#0eac82);font-size:22px;font-weight:950;box-shadow:0 9px 22px rgba(0,20,44,.25)}.accountCopy{position:relative;z-index:1;min-width:0;flex:1}.accountCopy small,.accountCopy b,.accountCopy em{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.accountCopy small{color:#bfe2ff;font-size:7px;font-weight:950;letter-spacing:1px}.accountCopy b{margin-top:4px;font-size:16px}.accountCopy em{margin-top:5px;color:#d2e8f8;font-size:9px;font-style:normal}.accountIdentity>i{position:relative;z-index:1;width:27px;height:27px;display:grid;place-items:center;border-radius:9px;background:#fff;color:#08825d;font-size:12px;font-style:normal;font-weight:950}.accountSectionTitle{margin:19px 3px 8px;display:flex;align-items:flex-end;justify-content:space-between;gap:8px;color:#fff}.accountSectionTitle span{font-size:13px;font-weight:900}.accountSectionTitle small{color:#a9c7dc;font-size:8px}.accountMenu{width:100%;overflow:hidden;border:1px solid rgba(255,255,255,.85);border-radius:19px;background:linear-gradient(155deg,#fff,#f4f8ff);box-shadow:0 15px 34px rgba(1,30,66,.24)}.accountMenu a{min-width:0;min-height:70px;padding:10px 13px;display:flex;align-items:center;gap:11px;border-bottom:1px solid #e2eaf3;color:#173652;text-decoration:none}.accountMenu a:last-child{border:0}.accountMenu i{width:41px;height:41px;display:grid;place-items:center;flex:0 0 41px;border-radius:12px;background:#eaf3ff;color:#1266e9;font-size:17px;font-style:normal;font-weight:900}.accountMenu a.violet i{background:#f0eaff;color:#6847c6}.accountMenu a.green i{background:#e7f8ef;color:#078353}.accountMenu a.blue i{background:#e5f2ff;color:#0b6dcf}.accountMenu a.gold i{background:#fff2df;color:#a86408}.accountMenu span{min-width:0;flex:1}.accountMenu b,.accountMenu small{display:block}.accountMenu b{font-size:13px}.accountMenu small{margin-top:4px;color:#71869a;font-size:9px;line-height:1.35}.accountMenu em{color:#1763c2;font-size:22px;font-style:normal}.appLogout{width:100%;min-height:62px;margin-top:12px;padding:9px 13px;display:flex;align-items:center;gap:11px;border:1px solid #f3cfd3;border-radius:17px;background:#fff;color:#9f3340;text-align:left;font-family:inherit;box-shadow:0 10px 24px rgba(1,30,66,.16)}.appLogout:disabled{opacity:.65}.appLogout>i{width:39px;height:39px;display:grid;place-items:center;flex:0 0 39px;border-radius:12px;background:#fff0f1;color:#bd3746;font-size:18px;font-style:normal}.appLogout span{display:block}.appLogout b,.appLogout small{display:block}.appLogout b{font-size:12px}.appLogout small{margin-top:4px;color:#9c7479;font-size:9px}`}</style>
    </main>
  );
}
