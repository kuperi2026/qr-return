"use client";

import Link from "next/link";

const hub = [
  ["＋", "პროფილის რეგისტრაცია", "აირჩიეთ სასურველი პროფილი და დაიწყეთ რეგისტრაცია", "/app/add", "blue"],
  ["▤", "პროფილების მართვა", "შექმნილი პროფილების ნახვა და მართვა", "/app/profiles", "green"],
  ["♧", "სანდო პირი და უფლებები", "არჩეულ პროფილზე უსაფრთხო წვდომის მართვა", "/account/admin?source=app", "violet"],
  ["▣", "QR პროდუქტების შეკვეთა", "აირჩიეთ და ონლაინ შეიძინეთ საჭირო QR პროდუქტი", "/app/store", "rose"],
  ["◇", "მომსახურება და პაკეტები", "გაეცანით მომსახურების პირობებსა და პაკეტებს", "/account/subscriptions?source=app", "gold"],
];
export default function Products() {
  return (
    <main className="pc">
      <div className="pw">
        <header>
          <small><i /> KOMPASI CONTROL</small>
          <h1>ჰაბი</h1>
          <p>პროფილები, წვდომები და მომსახურება ერთ სივრცეში.</p>
        </header>
        <section>
          {hub.map(([icon, name, note, href, color], index) => (
            <Link href={href} key={name} className={`${color} ${index < 2 ? "featured" : "compact"}`}>
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
          background:
            radial-gradient(circle at 20% 5%,rgba(83,174,242,.38),transparent 31%),
            linear-gradient(180deg,#0a4c8a 0%,#063b72 100%);
          color: #fff;
          font-family: Inter, Arial, sans-serif;
        }
        .pc, .pc * {
          box-sizing: border-box;
        }
        .pw {
          width: min(480px, calc(100% - 24px));
          margin: auto;
          padding: 27px 0 104px;
        }
        .pc header small {
          display:flex;
          align-items:center;
          gap:7px;
          color: #a9f0d8;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 1.2px;
        }
        .pc header small i{width:7px;height:7px;border-radius:50%;background:#2bdca3;box-shadow:0 0 0 5px rgba(43,220,163,.12)}
        .pc h1 {
          margin: 11px 0 0;
          max-width: 420px;
          font-size: 31px;
          line-height: 1.18;
        }
        .pc header p {
          margin: 8px 0 0;
          max-width:390px;
          color: #c7dfef;
          font-size: 11px;
          line-height: 1.5;
        }
        .pc section {
          margin-top: 18px;
          width: 100%;
          max-width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
          overflow: visible;
        }
        .pc section a {
          width: 100%;
          min-width: 0;
          min-height: 82px;
          padding: 13px;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid rgba(255,255,255,.72);
          border-radius: 19px;
          background: linear-gradient(145deg,#fff,#f7fbff);
          color: #173652;
          text-decoration: none;
          box-shadow: 0 14px 30px rgba(1,25,57,.2),inset 0 1px 0 rgba(255,255,255,.8);
        }
        .pc section a.featured{min-height:148px;padding:15px;display:grid;grid-template-columns:1fr 24px;grid-template-rows:50px 1fr;background:linear-gradient(145deg,#ffffff,#eaf5ff);align-content:start}.pc section a.featured.green{background:linear-gradient(145deg,#effff8,#d9f5e8)}.pc section a.featured i{grid-column:1/3;width:50px;height:50px}.pc section a.featured span{grid-column:1;align-self:end}.pc section a.featured em{grid-column:2;align-self:end;justify-self:end}
        .pc section a.compact{grid-column:1/3;background:linear-gradient(145deg,#fff,#f4f8fc)}
        .pc section i {
          width: 50px;
          height: 50px;
          display: grid;
          place-items: center;
          flex: 0 0 50px;
          border-radius: 13px;
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
          font-size: 14px;
        }
        .pc section small {
          margin-top: 5px;
          color: #778b9e;
          font-size: 10px;
          line-height: 1.45;
          line-height: 1.3;
        }
        .pc section em {
          color: #1763c2;
          font-size: 20px;
          font-style: normal;
        }
        .pc section a.blue i{background:#e6f1ff;color:#075dcc}.pc section a.green i{background:#e6f8ef;color:#08784a}
        .pc section a.violet i{background:#f0eaff;color:#6847c6}
        .pc section a.rose i{background:#ffeaf2;color:#bd356b}
        .pc section a.gold i{background:#fff2db;color:#9a6100}
        .pc section a:hover{border-color:#b9d8f8;transform:translateY(-1px);box-shadow:0 14px 30px rgba(4,42,91,.16)}
        @media (max-width: 380px) {
          .pw{width:min(480px,calc(100% - 20px))}.pc section{gap:7px}.pc section a.featured{min-height:138px;padding:12px}.pc section a.featured b{font-size:12px}.pc section a.featured small{font-size:8px}.pc section a.compact{min-height:72px;padding:11px}.pc section i{width:44px;height:44px;flex-basis:44px}
        }
      `}</style>
    </main>
  );
}
