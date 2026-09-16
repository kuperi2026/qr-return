"use client";

import Link from "next/link";

const hub = [
  ["＋", "პროფილის რეგისტრაცია", "აირჩიეთ სასურველი პროფილი და დაიწყეთ რეგისტრაცია", "/login?source=app&next=%2Fapp%2Fadd", "blue"],
  ["▤", "პროფილების მართვა", "შექმნილი პროფილების ნახვა და მართვა", "/login?source=app&next=%2Fapp%2Fprofiles", "green"],
  ["♧", "სანდო პირი და უფლებები", "არჩეულ პროფილზე უსაფრთხო წვდომის მართვა", "/login?source=app&next=%2Faccount%2Fadmin%3Fsource%3Dapp", "violet"],
  ["▣", "QR პროდუქტების შეკვეთა", "აირჩიეთ და ონლაინ შეიძინეთ საჭირო QR პროდუქტი", "/app/store", "rose"],
  ["◇", "მომსახურება და პაკეტები", "გაეცანით პაკეტებს რეგისტრაციის გარეშე", "/account/subscriptions?source=app", "gold"],
];
export default function Products() {
  return (
    <main className="pc">
      <div className="pw">
        <header>
          <small>KOMPASI</small>
          <h1>შენი უსაფრთხო სივრცე</h1>
          <p>დაათვალიერე ფუნქციები თავისუფლად. რეგისტრაცია დაგჭირდება მხოლოდ პროფილის შექმნისას.</p>
        </header>
        <section className="authChoice" aria-label="ანგარიშში შესვლა ან რეგისტრაცია">
          <Link href="/signup?source=app" className="registerAction">
            <b>რეგისტრაცია</b><em>›</em>
          </Link>
          <Link href="/login?source=app" className="loginAction">
            <b>შესვლა</b><em>›</em>
          </Link>
        </section>
        <section>
          {hub.map(([icon, name, note, href, color]) => (
            <Link href={href} key={name} className={color}>
              <i>{icon}</i>
              <span>
                <b>{name}</b>
                <small>{note}</small>
              </span>
              <em>›</em>
            </Link>
          ))}
        </section>
      </div>
      <style jsx global>{`
        .pc {
          min-height: 100vh;
          overflow-x: hidden;
          background:radial-gradient(circle at 15% 5%,rgba(115,205,255,.28),transparent 32%),linear-gradient(180deg,#edf8ff 0%,#fbfeff 75%);
          color: #163a52;
          font-family: Inter, Arial, sans-serif;
        }
        .pc, .pc * {
          box-sizing: border-box;
        }
        .pw {
          width: min(480px, calc(100% - 24px));
          margin: auto;
          padding: 25px 0 94px;
        }
        .pc header small {
          color: #1478d4;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 1px;
        }
        .pc h1 {
          margin: 9px 0 0;
          max-width: 420px;
          font-size: 27px;
          line-height: 1.18;
        }
        .pc header p {
          margin: 8px 0 0;
          color: #758b99;
          font-size: 13px;
          line-height: 1.5;
        }
        .pc section {
          margin-top: 18px;
          width: 100%;
          max-width: 100%;
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
          overflow: hidden;
        }
        .pc .authChoice{margin-top:14px;gap:10px;overflow:visible}
        .pc .authChoice{grid-template-columns:1fr 1fr}
        .pc .authChoice a{min-height:60px;justify-content:space-between;border-color:#bdd9ec;box-shadow:0 10px 24px rgba(16,59,92,.08)}
        .pc .authChoice .registerAction{background:#1478d4;color:#fff}
        .pc .authChoice .loginAction{background:#fff;color:#103b5c}
        .pc .authChoice em{font-size:25px}
        .pc section a {
          width: 100%;
          min-width: 0;
          min-height: 82px;
          padding: 13px;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid #d9e5f0;
          border-radius: 20px;
          background:#fff;
          color: #173652;
          text-decoration: none;
          box-shadow:0 8px 24px rgba(16,59,92,.07);
        }
        .pc section i {
          width: 46px;
          height: 46px;
          display: grid;
          place-items: center;
          flex:0 0 46px;
          border-radius:14px;
          background: #edf5ff;
          font-size: 21px;
          font-style: normal;
        }
        .pc section span {
          min-width: 0;
          flex: 1;
        }
        .pc section b,
        .pc section small {
          display: block;
        }
        .pc section b {
          font-size: 16px;
        }
        .pc section small {
          margin-top: 5px;
          color: #778b9e;
          font-size: 12px;
          line-height: 1.45;
          line-height: 1.3;
        }
        .pc section em {
          color: #1763c2;
          font-size: 20px;
          font-style: normal;
        }
        .pc section a.green i{background:#e6f8ef;color:#08784a}
        .pc section a.violet i{background:#f0eaff;color:#6847c6}
        .pc section a.rose i{background:#ffeaf2;color:#bd356b}
        .pc section a.gold i{background:#fff2db;color:#9a6100}
        .pc section a:hover{border-color:#b9d8f8;transform:translateY(-1px);box-shadow:0 14px 30px rgba(4,42,91,.16)}
        @media (max-width: 380px) {
          .pc section {
            grid-template-columns: 1fr;
          }
          .pc section a {
            min-height: 72px;
          }
        }
      `}</style>
    </main>
  );
}
