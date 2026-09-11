"use client";

import Link from "next/link";
const hub = [
  ["＋", "პროფილის რეგისტრაცია", "აირჩიეთ სასურველი პროფილი და დაიწყეთ რეგისტრაცია", "/app/add", "blue"],
  ["▤", "პროფილების მართვა", "უკვე შექმნილი პროფილების ნახვა და მართვა", "/app/profiles", "green"],
  ["◇", "მომსახურება და პაკეტები", "მართეთ მომსახურების ვადა და პაკეტი", "/account/subscriptions?source=app", "gold"],
];
export default function Products() {
  return (
    <main className="pc">
      <div className="pw">
        <header>
          <small>KOMPASI</small>
          <h1>აირჩიეთ სასურველი მოქმედება</h1>
          <p>ყველაფერი, რაც თქვენი QR პროფილების სამართავად გჭირდებათ.</p>
        </header>
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
          background:
            radial-gradient(circle at 10% 0, rgba(71,157,235,.24), transparent 34%),
            linear-gradient(180deg,#eaf5ff 0%,#f7fbff 45%,#eef2f6 100%);
          color: #173652;
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
          color: #1761bd;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 1px;
        }
        .pc h1 {
          margin: 5px 0 0;
          max-width: 420px;
          font-size: 27px;
          line-height: 1.18;
        }
        .pc header p {
          margin: 8px 0 0;
          color: #6e8398;
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
        .pc section a {
          width: 100%;
          min-width: 0;
          min-height: 94px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid #d9e5f0;
          border-radius: 18px;
          background: #fff;
          color: #173652;
          text-decoration: none;
          box-shadow: 0 10px 25px rgba(23,63,109,.09);
        }
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
        .pc section a.gold i{background:#fff2db;color:#9a6100}
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
