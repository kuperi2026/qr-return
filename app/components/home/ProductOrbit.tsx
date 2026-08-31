"use client";

import { QRIcon } from "./HomeIcons";

const products = [
  { ka: "ძაღლი", en: "Dog", position: "top" },
  { ka: "კატა", en: "Cat", position: "upperRight" },
  { ka: "გასაღები", en: "Keys", position: "lowerRight" },
  { ka: "საფულე", en: "Wallet", position: "bottom" },
  { ka: "ჩანთა", en: "Bag", position: "lowerLeft" },
  { ka: "ჩემოდანი", en: "Suitcase", position: "upperLeft" },
];

export default function ProductOrbit({ ka }: { ka: boolean }) {
  return (
    <div className="orbit" aria-label={ka ? "QR RETURN პროდუქტები" : "QR RETURN products"}>
      <div className="ring outerRing" aria-hidden="true" />
      <div className="ring innerRing" aria-hidden="true" />

      <div className="emergency">
        <span>EMERGENCY</span>
        <div><QRIcon size={34} /></div>
        <strong>{ka ? "სამაჯური" : "Bracelet"}</strong>
      </div>

      {products.map((product) => (
        <div className={`productName ${product.position}`} key={product.en}>
          <strong>{ka ? product.ka : product.en}</strong>
        </div>
      ))}

      <style jsx>{`
        .orbit{position:relative;width:min(760px,100%);aspect-ratio:1.3;margin:0 auto}.ring{position:absolute;left:50%;top:50%;border:1px solid rgba(255,255,255,.2);border-radius:50%;transform:translate(-50%,-50%)}.outerRing{width:78%;aspect-ratio:1}.innerRing{width:52%;aspect-ratio:1;border-color:rgba(255,255,255,.12)}.emergency{position:absolute;left:50%;top:50%;width:190px;height:190px;padding:24px;display:flex;flex-direction:column;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,.9);border-radius:50%;background:#fff;color:#063B72;box-shadow:0 24px 58px rgba(0,28,64,.28);transform:translate(-50%,-50%)}.emergency>span{font-size:8px;font-weight:900;letter-spacing:1.6px}.emergency>div{width:58px;height:58px;margin:13px 0 11px;display:grid;place-items:center;border-radius:16px;background:#063B72;color:#fff}.emergency>strong{font-size:18px;font-weight:900;letter-spacing:-.3px}.productName{position:absolute;min-width:142px;min-height:58px;padding:0 20px;display:flex;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,.36);border-radius:999px;background:rgba(255,255,255,.1);color:#fff;box-shadow:0 12px 30px rgba(0,28,64,.13);backdrop-filter:blur(10px)}.productName strong{font-size:17px;font-weight:850;letter-spacing:-.25px}.top{left:50%;top:3%;transform:translateX(-50%)}.bottom{left:50%;bottom:3%;transform:translateX(-50%)}.upperRight{right:3%;top:26%}.lowerRight{right:3%;bottom:26%}.upperLeft{left:3%;top:26%}.lowerLeft{left:3%;bottom:26%}
        @media(max-width:700px){.orbit{aspect-ratio:1/1.12}.outerRing{width:82%}.innerRing{width:52%}.emergency{width:150px;height:150px;padding:17px}.emergency>div{width:48px;height:48px;margin:9px 0}.emergency>strong{font-size:16px}.productName{min-width:105px;min-height:46px;padding:0 13px}.productName strong{font-size:14px}.top{top:2%}.bottom{bottom:2%}.upperRight{right:0;top:25%}.lowerRight{right:0;bottom:25%}.upperLeft{left:0;top:25%}.lowerLeft{left:0;bottom:25%}}
        @media(max-width:420px){.orbit{aspect-ratio:1/1.2}.emergency{width:132px;height:132px}.emergency>span{font-size:7px}.emergency>div{width:42px;height:42px;margin:7px 0}.emergency>strong{font-size:15px}.productName{min-width:88px;min-height:40px;padding:0 9px}.productName strong{font-size:12px}}
      `}</style>
    </div>
  );
}
