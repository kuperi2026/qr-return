"use client";
import Link from "next/link";
const Base = () => (
  <style jsx global>{`
    .sub{min-height:100vh;background:#edf7ff;color:#173652;font-family:Inter,Arial,sans-serif}
    .subw{width:min(560px,100%);margin:auto;padding:24px 13px 94px}
    .sub header small{color:#71869a;font-size:8px;font-weight:850;letter-spacing:1px}
    .sub h1{margin:5px 0 0;font-size:23px}
    .sub header p{margin:8px 0 0;color:#708599;font-size:10px;line-height:1.5}
  `}</style>
);
export default function Chat() {
  return (
    <main className="sub">
      <div className="subw">
        <header>
          <small>უსაფრთხო კავშირი</small>
          <h1>Live Chat</h1>
          <p>საუბარი მხოლოდ არჩეული პროფილის გახსნის შემდეგ გამოჩნდება.</p>
        </header>
        <section className="menu">
          <Link href="/account/chat">
            <i>◌</i>
            <span>
              <b>აქტიური საუბრები</b>
              <small>მპოვნელების შეტყობინებები</small>
            </span>
            <em>›</em>
          </Link>
          <Link href="/account/messages">
            <i>✓</i>
            <span>
              <b>საუბრის ისტორია</b>
              <small>წინა შეტყობინებები</small>
            </span>
            <em>›</em>
          </Link>
        </section>
      </div>
      <Base />
      <Menu />
    </main>
  );
}
function Menu() {
  return (
    <style jsx global>{`
      .menu {
        margin-top: 18px;
        display: grid;
        gap: 8px;
      }
      .menu a {
        min-height: 67px;
        padding: 11px 14px;
        display: flex;
        align-items: center;
        gap: 11px;
        border: 1px solid #dce6f0;
        border-radius: 16px;
        background: #fff;
        color: #173652;
        text-decoration: none;
      }
      .menu i {
        width: 41px;
        height: 41px;
        display: grid;
        place-items: center;
        border-radius: 12px;
        background: #eaf3ff;
        color: #0e63c8;
        font-size: 18px;
        font-style: normal;
      }
      .menu span {
        flex: 1;
      }
      .menu b,
      .menu small {
        display: block;
      }
      .menu b {
        font-size: 11px;
      }
      .menu small {
        margin-top: 4px;
        color: #768a9e;
        font-size: 8px;
      }
      .menu em {
        font-size: 21px;
        font-style: normal;
        color: #1763c2;
      }
    `}</style>
  );
}
