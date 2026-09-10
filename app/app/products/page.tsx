"use client";

import Link from "next/link";
const products = [
  ["dog", "🐕", "ძაღლი", "Lost Mode · Photo Match"],
  ["cat", "🐈", "კატა", "Lost Mode · Photo Match"],
  ["parking", "🚘", "ავტომობილი", "AI Parking Assistant"],
  ["suitcase", "🧳", "ჩემოდანი", "AI Finder · თარგმანი"],
  ["keys", "🔑", "გასაღები", "AI Finder Assistant"],
  ["wallet", "👛", "საფულე", "უსაფრთხო კავშირი"],
  ["bag", "👜", "ჩანთა", "AI Finder · თარგმანი"],
  ["emergency", "✚", "Emergency", "SOS Assistant · 112"],
];
export default function Products() {
  return (
    <main className="pc">
      <div className="pw">
        <header>
          <small>KOMPASI PRODUCTS</small>
          <h1>პროდუქტები</h1>
          <p>
            აირჩიეთ კატეგორია და დაარეგისტრირეთ ახალი პროფილი.
            არსებული პროფილების მართვა ხელმისაწვდომია „პროფილებში“.
          </p>
        </header>
        <section>
          {products.map(([type, icon, name, ai]) => (
            <Link href={"/app/products/" + type} key={type}>
              <i>{icon}</i>
              <span>
                <b>{name}</b>
                <small>{ai}</small>
              </span>
              <em>›</em>
            </Link>
          ))}
        </section>
      </div>
      <style jsx global>{`
        .pc {
          min-height: 100vh;
          background:
            radial-gradient(circle at 50% 0, #deedff, transparent 28%), #edf7ff;
          color: #173652;
          font-family: Inter, Arial, sans-serif;
        }
        .pw {
          width: min(560px, 100%);
          margin: auto;
          padding: 25px 13px 94px;
        }
        .pc header small {
          color: #1761bd;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 1px;
        }
        .pc h1 {
          margin: 5px 0 0;
          font-size: 24px;
        }
        .pc header p {
          margin: 8px 0 0;
          color: #6e8398;
          font-size: 10px;
          line-height: 1.5;
        }
        .pc section {
          margin-top: 18px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .pc section a {
          min-height: 91px;
          padding: 13px;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid #d9e5f0;
          border-radius: 17px;
          background: #fff;
          color: #173652;
          text-decoration: none;
          box-shadow: 0 7px 20px #173f6d0d;
        }
        .pc section i {
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          flex: 0 0 44px;
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
          font-size: 10px;
        }
        .pc section small {
          margin-top: 5px;
          color: #778b9e;
          font-size: 7px;
          line-height: 1.3;
        }
        .pc section em {
          color: #1763c2;
          font-size: 20px;
          font-style: normal;
        }
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
