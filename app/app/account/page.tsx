"use client";
import Link from "next/link";
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
  ["◉", "პირადი ინფორმაცია", "Login, პაროლი და ანგარიშის მონაცემები", "/account/profile?source=app", "violet"],
  ["⌾", "უსაფრთხოება", "პაროლი, კოდური სიტყვა და დაცვა", "/account/security?source=app", "green"],
];
export default function Account() {
  return (
    <main className="sub">
      <div className="subw">
        <header>
          <small>KOMPASI ACCOUNT</small>
          <h1>ანგარიში</h1>
          <p>აირჩიეთ ინფორმაცია, რომლის ნახვა ან შეცვლა გსურთ.</p>
        </header>
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
      </div>
      <Base />
      <style>{`.sub{overflow-x:hidden;background:radial-gradient(circle at 20% 5%,rgba(83,174,242,.38),transparent 31%),linear-gradient(180deg,#0a4c8a 0%,#063b72 100%)}.subw{width:min(480px,calc(100% - 24px));padding:25px 0 96px}.sub header small{color:#bdddff;font-size:10px}.sub h1{color:#fff;font-size:27px}.sub header p{color:#d7ecff;font-size:12px}.accountMenu{width:100%;margin-top:18px;overflow:hidden;border:1px solid rgba(255,255,255,.85);border-radius:19px;background:linear-gradient(155deg,#fff,#f4f8ff);box-shadow:0 15px 34px rgba(1,30,66,.24)}.accountMenu a{min-width:0;min-height:76px;padding:11px 13px;display:flex;align-items:center;gap:11px;border-bottom:1px solid #e2eaf3;color:#173652;text-decoration:none}.accountMenu a:last-child{border:0}.accountMenu i{width:43px;height:43px;display:grid;place-items:center;flex:0 0 43px;border-radius:13px;background:#eaf3ff;color:#1266e9;font-size:18px;font-style:normal}.accountMenu a.violet i{background:#f0eaff;color:#6847c6}.accountMenu a.green i{background:#e7f8ef;color:#078353}.accountMenu a.gold i{background:#fff2df;color:#a86408}.accountMenu span{min-width:0;flex:1}.accountMenu b,.accountMenu small{display:block}.accountMenu b{font-size:14px}.accountMenu small{margin-top:4px;color:#71869a;font-size:10px;line-height:1.35}.accountMenu em{color:#1763c2;font-size:22px;font-style:normal}`}</style>
    </main>
  );
}
