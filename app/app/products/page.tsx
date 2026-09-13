"use client";

import Link from "next/link";
import { useEffect } from "react";

const publicHub = [
  ["▣", "QR პროდუქტების შეკვეთა", "აირჩიეთ და ონლაინ შეიძინეთ საჭირო QR პროდუქტი", "/app/store", "rose"],
  ["◇", "მომსახურება და პაკეტები", "გაეცანით მომსახურების პირობებსა და პაკეტებს", "/login?source=app&next=%2Faccount%2Fsubscriptions%3Fsource%3Dapp", "gold"],
];
export default function Products() {
  useEffect(() => {
    document.body.classList.add("kompasiPublicEntry");
    return () => document.body.classList.remove("kompasiPublicEntry");
  }, []);

  return (
    <main className="pc">
      <div className="pw">
        <header>
          <small>KOMPASI</small>
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
          {publicHub.map(([icon, name, note, href, color]) => (
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
          padding: 25px 0 94px;
        }
        .pc header small {
          color: #bdddff;
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
          color: #d7ecff;
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
        .pc .authChoice a{min-height:68px;justify-content:space-between;border-color:rgba(255,255,255,.58);box-shadow:0 13px 30px rgba(0,28,67,.2)}
        .pc .authChoice .registerAction{background:#fff;color:#075dcc}
        .pc .authChoice .loginAction{background:rgba(3,48,94,.36);color:#fff}
        .pc .authChoice .loginAction small{color:#d7ecff}
        .pc .authChoice em{font-size:25px}
        body.kompasiPublicEntry{padding-bottom:0!important}
        body.kompasiPublicEntry .appDock,body.kompasiPublicEntry .notificationPill{display:none!important}
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
          background: linear-gradient(145deg,#fff,#f7fbff);
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
