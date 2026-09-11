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
  ["შეტყობინებები", "ბოლო აქტივობა", "/account/notifications"],
  ["პირადი ინფორმაცია", "ანგარიშის მონაცემები", "/account/profile"],
  ["უსაფრთხოება", "პაროლი და დაცვა", "/account/security"],
  ["თანაადმინისტრატორი", "წვდომები და უფლებები", "/account/admin"],
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
          {links.map(([a, b, h]) => (
            <Link href={h} key={a}>
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
      <style>{`.accountMenu{margin-top:18px;overflow:hidden;border:1px solid #dce6f0;border-radius:17px;background:#fff}.accountMenu a{min-height:61px;padding:12px 15px;display:flex;align-items:center;border-bottom:1px solid #e5ecf3;color:#173652;text-decoration:none}.accountMenu a:last-child{border:0}.accountMenu span{flex:1}.accountMenu b,.accountMenu small{display:block}.accountMenu b{font-size:11px}.accountMenu small{margin-top:4px;color:#778b9e;font-size:8px}.accountMenu em{color:#1763c2;font-size:21px;font-style:normal}`}</style>
    </main>
  );
}
