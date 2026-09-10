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
        background: #f4f7fb;
        color: #173652;
        font-family: Inter, Arial, sans-serif;
      }
      .subw {
        width: min(560px, 100%);
        margin: auto;
        padding: 24px 13px 94px;
      }
      .sub header small {
        color: #71869a;
        font-size: 8px;
        font-weight: 850;
        letter-spacing: 1px;
      }
      .sub h1 {
        margin: 5px 0 0;
        font-size: 23px;
      }
      .sub header p {
        margin: 8px 0 0;
        color: #708599;
        font-size: 10px;
        line-height: 1.5;
      }
      .typegrid {
        margin-top: 17px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }
      .typegrid a {
        min-height: 82px;
        padding: 13px;
        display: flex;
        align-items: center;
        gap: 10px;
        border: 1px solid #dce6f0;
        border-radius: 16px;
        background: #fff;
        color: #173652;
        text-decoration: none;
        box-shadow: 0 6px 17px #173f6d0c;
      }
      .typegrid span {
        width: 42px;
        height: 42px;
        display: grid;
        place-items: center;
        border-radius: 12px;
        background: #edf5ff;
        font-size: 20px;
      }
      .typegrid b {
        flex: 1;
        font-size: 10px;
      }
      .typegrid em {
        color: #1763c2;
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
