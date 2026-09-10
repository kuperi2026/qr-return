"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
const meta: Record<string, [string, string, string]> = {
  dog: ["🐕", "ძაღლი", "Lost Mode და AI Photo Match"],
  cat: ["🐈", "კატა", "Lost Mode და AI Photo Match"],
  parking: ["🚘", "ავტომობილი", "AI Parking Assistant"],
  suitcase: ["🧳", "ჩემოდანი", "AI Finder და თარგმანი"],
  keys: ["🔑", "გასაღები", "AI Finder Assistant"],
  wallet: ["👛", "საფულე", "უსაფრთხო კავშირი"],
  bag: ["👜", "ჩანთა", "AI Finder და თარგმანი"],
  emergency: ["✚", "Emergency", "SOS Assistant და 112"],
};
export default function ProductType() {
  const { type } = useParams<{ type: string }>();
  const m = meta[type] || ["⌁", "პროდუქტი", "KOMPASI AI"];
  const register =
    type === "emergency"
      ? "/register/emergency-bracelet?source=app"
      : "/register-item/" + type + "?source=app";
  return (
    <main className="th">
      <div className="tw">
        <Link className="back" href="/app/products">
          ← პროდუქტები
        </Link>
        <header>
          <i>{m[0]}</i>
          <div>
            <small>{m[2]}</small>
            <h1>{m[1]}</h1>
          </div>
        </header>
        <Link className="new" href={register}>
          <span>
            <small>{m[1]}ს კატეგორია</small>
            <b>პროფილის რეგისტრაცია</b>
          </span>
          <em>＋</em>
        </Link>
        <div className="empty registration-note">
          <b>აქ მხოლოდ ახალი პროფილის რეგისტრაცია ხდება</b>
          <span>რეგისტრირებული პროფილები და მართვის ყველა ღილაკი თავმოყრილია „პროფილებში“.</span>
          <Link href="/app/profiles">ჩემი პროფილების მართვა →</Link>
        </div>
      </div>
      <style jsx global>{`
        .th {
          min-height: 100vh;
          background: #f4f7fb;
          color: #173652;
          font-family: Inter, Arial, sans-serif;
        }
        .tw {
          width: min(560px, 100%);
          margin: auto;
          padding: 20px 13px 94px;
        }
        .back {
          color: #1761bd;
          text-decoration: none;
          font-size: 9px;
          font-weight: 850;
        }
        .th header {
          margin-top: 16px;
          display: flex;
          align-items: center;
          gap: 13px;
        }
        .th header > i {
          width: 55px;
          height: 55px;
          display: grid;
          place-items: center;
          border-radius: 17px;
          background: linear-gradient(145deg, #eaf4ff, #fff);
          font-size: 25px;
          font-style: normal;
          box-shadow: 0 8px 20px #173f6d12;
        }
        .th header small {
          color: #6553ce;
          font-size: 8px;
          font-weight: 850;
        }
        .th h1 {
          margin: 4px 0 0;
          font-size: 23px;
        }
        .new {
          min-height: 64px;
          margin-top: 18px;
          padding: 11px 15px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 16px;
          background: linear-gradient(135deg, #096be0, #354fd1);
          color: #fff;
          text-decoration: none;
          box-shadow: 0 10px 24px #1557c233;
        }
        .new small,
        .new b {
          display: block;
        }
        .new small {
          color: #cce3ff;
          font-size: 8px;
        }
        .new b {
          margin-top: 4px;
          font-size: 11px;
        }
        .new em {
          font-size: 22px;
          font-style: normal;
        }
        .title {
          margin: 20px 3px 9px;
          display: flex;
          justify-content: space-between;
        }
        .title b {
          font-size: 11px;
        }
        .title small {
          padding: 3px 7px;
          border-radius: 999px;
          background: #e6f0fb;
          color: #1761bd;
          font-size: 8px;
        }
        .th section {
          display: grid;
          gap: 8px;
        }
        .th section > a {
          min-height: 76px;
          padding: 10px 13px 10px 10px;
          display: flex;
          align-items: center;
          gap: 11px;
          border: 1px solid #dce6f0;
          border-radius: 16px;
          background: #fff;
          color: #173652;
          text-decoration: none;
        }
        .photo {
          width: 52px;
          height: 52px;
          display: grid;
          place-items: center;
          flex: 0 0 52px;
          overflow: hidden;
          border-radius: 13px;
          background: #edf5ff;
          font-size: 21px;
        }
        .photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .th section > a > div:nth-child(2) {
          min-width: 0;
          flex: 1;
        }
        .th section small,
        .th section b {
          display: block;
        }
        .th section small {
          color: #788c9f;
          font-size: 8px;
        }
        .th section b {
          margin-top: 4px;
          font-size: 11px;
        }
        .th section em {
          display: inline-block;
          margin-top: 5px;
          padding: 3px 6px;
          border-radius: 999px;
          font-size: 7px;
          font-style: normal;
          font-weight: 850;
        }
        .ok {
          background: #e6f8ef;
          color: #08784a;
        }
        .lost {
          background: #fff0f0;
          color: #c13742;
        }
        .th section strong {
          color: #1761bd;
          font-size: 21px;
        }
        .empty {
          margin-top: 20px;
          display: grid;
          gap: 6px;
          color: #7a8da0;
          text-align: center;
          font-size: 9px;
        }
        .empty b {
          color: #304c68;
          font-size: 11px;
        }
      `}</style>
    </main>
  );
}
