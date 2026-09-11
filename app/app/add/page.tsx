"use client";
import Link from "next/link";
const types = [
  ["🐕", "ძაღლი", "/register/dog"],
  ["🐈", "კატა", "/register/cat"],
  ["🚘", "მანქანა", "/register/car"],
  ["🧳", "ჩემოდანი", "/register/suitcase"],
  ["🔑", "გასაღები", "/register/key"],
  ["👛", "საფულე", "/register/wallet"],
  ["👜", "ჩანთა", "/register/bag"],
  ["✚", "Emergency", "/emergency/register"],
];
export default function Add() {
  return (
    <main className="sub">
      <div className="subw">
        <header>
          <small>ახალი პროფილი</small>
          <h1>რას იცავთ?</h1>
          <p>
            აირჩიეთ პროდუქტი. რეგისტრაციის ფორმა მხოლოდ არჩევის შემდეგ
            გაიხსნება.
          </p>
        </header>
        <section className="typegrid">
          {types.map(([i, n, h]) => (
            <Link key={n} href={h}>
              <span>{i}</span>
              <b>{n}</b>
              <em>›</em>
            </Link>
          ))}
        </section>
      </div>
      <Base />
    </main>
  );
}
function Base() {
  return (
    <style jsx global>{`
      .sub {
        min-height: 100vh;
        overflow-x: hidden;
        background: radial-gradient(circle at 10% 0, rgba(71,157,235,.24), transparent 34%), linear-gradient(180deg,#eaf5ff 0%,#f7fbff 45%,#eef2f6 100%);
        color: #173652;
        font-family: Inter, Arial, sans-serif;
      }
      .sub, .sub * {
        box-sizing: border-box;
      }
      .subw {
        width: min(480px, calc(100% - 24px));
        margin: auto;
        padding: 24px 0 94px;
      }
      .sub header small {
        color: #71869a;
        font-size: 11px;
        font-weight: 850;
        letter-spacing: 1px;
      }
      .sub h1 {
        margin: 5px 0 0;
        font-size: 27px;
      }
      .sub header p {
        margin: 8px 0 0;
        color: #708599;
        font-size: 13px;
        line-height: 1.5;
      }
      .typegrid {
        margin-top: 17px;
        display: grid;
        width: 100%;
        max-width: 100%;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 7px;
        overflow: hidden;
      }
      .typegrid a {
        width: 100%;
        min-width: 0;
        min-height: 58px;
        padding: 7px 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        border: 1px solid #dce6f0;
        border-radius: 13px;
        background: #fff;
        color: #173652;
        text-decoration: none;
        box-shadow: 0 6px 17px #173f6d0c;
      }
      .typegrid span {
        width: 34px;
        height: 34px;
        display: grid;
        place-items: center;
        flex: 0 0 34px;
        border-radius: 9px;
        background: #edf5ff;
        font-size: 17px;
      }
      .typegrid b {
        min-width: 0;
        flex: 1;
        font-size: 14px;
        line-height: 1.25;
        overflow-wrap: anywhere;
      }
      .typegrid em {
        width: 26px;
        height: 26px;
        display:grid;
        place-items:center;
        border-radius:9px;
        background:#159b65;
        color: #fff;
        flex:0 0 26px;
        font-size: 18px;
        font-style: normal;
      }
      @media (max-width: 330px) {.subw{padding-left:9px;padding-right:9px}.typegrid{gap:5px}.typegrid a{padding-left:6px;padding-right:6px}.typegrid b{font-size:12px}}
    `}</style>
  );
}
