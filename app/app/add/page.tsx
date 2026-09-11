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
      .subw {
        width: min(480px, 100%);
        margin: auto;
        padding: 24px 13px 94px;
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
        grid-template-columns: 1fr;
        gap: 7px;
      }
      .typegrid a {
        width: 100%;
        min-width: 0;
        min-height: 62px;
        padding: 8px 10px;
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
        width: 38px;
        height: 38px;
        display: grid;
        place-items: center;
        border-radius: 10px;
        background: #edf5ff;
        font-size: 18px;
      }
      .typegrid b {
        flex: 1;
        font-size: 14px;
      }
      .typegrid em {
        width: 29px;
        height: 29px;
        display:grid;
        place-items:center;
        border-radius:9px;
        background:#159b65;
        color: #fff;
        font-size: 20px;
        font-style: normal;
      }
      @media (max-width: 350px) {
        .typegrid {
          grid-template-columns: 1fr;
        }
      }
    `}</style>
  );
}
