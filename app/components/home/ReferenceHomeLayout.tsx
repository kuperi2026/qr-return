"use client";

import { useEffect } from "react";

export default function ReferenceHomeLayout({ ka }: { ka: boolean }) {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>(".homeHeroInner");
    const stage = hero?.querySelector<HTMLElement>(".heroStage");
    const showcase = hero?.querySelector<HTMLElement>(".productShowcase");
    const support = stage?.querySelector<HTMLElement>(".heroSupport");
    const dogImage = showcase?.querySelector<HTMLImageElement>(
      ".dogProduct:nth-child(4) .dogVisual img"
    );
    if (!hero || !stage || !showcase || !support || !dogImage) return;

    let photo = hero.querySelector<HTMLElement>(".referenceWidePhoto");
    if (!photo) {
      photo = document.createElement("div");
      photo.className = "referenceWidePhoto";
      const image = document.createElement("img");
      image.src = dogImage.src;
      image.alt = ka
        ? "ძაღლი QR RETURN-ის პროფილით ტელეფონში"
        : "Dog with a QR RETURN profile on a phone";
      photo.appendChild(image);
      stage.after(photo);
    }
    showcase.after(support);
    const image = photo.querySelector("img");
    if (image) {
      image.alt = ka
        ? "ძაღლი QR RETURN-ის პროფილით ტელეფონში"
        : "Dog with a QR RETURN profile on a phone";
    }
  }, [ka]);

  return (
    <style jsx global>{`
      .homeHeader { background:#17659f !important; border-bottom:0 !important; }
      .homeHeaderInner {
        width:calc(100% - 70px) !important; max-width:1380px !important;
        min-height:155px !important; position:relative !important;
        display:flex !important; flex-direction:column !important;
        justify-content:center !important; gap:0 !important;
        padding:24px 0 9px !important;
      }
      .homeBrand { margin:0 auto 7px !important; text-align:center; }
      .homeBrandLogo { display:none !important; }
      .homeBrand strong {
        font:400 27px Georgia,serif !important; letter-spacing:2px !important;
      }
      .homeBrand span { margin-top:8px !important; color:#fff !important; }
      .homeNav { justify-content:center !important; gap:32px !important; }
      .homeNav button {
        padding:15px 0 7px !important; font:400 15px Georgia,serif !important;
      }
      .homeActions { position:absolute !important; right:0; top:24px; padding:0 !important; }

      .homeHero { padding:0 0 80px !important; overflow:hidden !important;
        color:#173652 !important; background:#fff !important; }
      .homeHeroInner { width:100% !important; max-width:none !important; }
      .heroStage { min-height:410px !important; display:flex !important;
        justify-content:center !important; align-items:center !important;
        gap:0 !important; transform:none !important; background:#17659f; }
      .ecosystemCircle { width:auto !important; max-width:900px !important;
        aspect-ratio:auto !important; min-height:0 !important; padding:20px !important;
        border:0 !important; border-radius:0 !important; background:none !important;
        box-shadow:none !important; transform:none !important; text-align:center; }
      .ecosystemCircle:before,.ecosystemCircle:after { display:none !important; }
      .ecosystemCircle h1 { max-width:900px !important; color:#fff !important;
        font:400 clamp(32px,3vw,48px)/1.33 Georgia,serif !important;
        letter-spacing:0 !important; }
      .ecosystemCircle h1 strong { display:block; margin:0 !important;
        color:#fff !important; font-weight:400 !important; }
      .referenceWidePhoto { width:100%; height:clamp(350px,35vw,540px);
        overflow:hidden; background:#b5d7f2; }
      .referenceWidePhoto img { width:100%; height:100%; object-fit:cover;
        object-position:center 48%; display:block; }

      .productShowcase { width:min(1320px,calc(100% - 60px)) !important;
        min-height:0 !important; margin:0 auto !important; padding:80px 0 45px !important;
        transform:none !important; overflow:visible !important;
        background:none !important; box-shadow:none !important; border-radius:0 !important; }
      .productHeading { width:100% !important; min-height:0 !important;
        margin:0 0 44px !important; padding:0 !important;
        display:block !important; text-align:center !important; border:0 !important; }
      .productHeading span { display:block !important; margin:0 0 17px !important;
        color:#17659f !important; font-size:14px !important; letter-spacing:2px; }
      .productHeading h2 { max-width:100% !important; margin:0 !important;
        color:#173652 !important; font:400 clamp(29px,2.8vw,42px)/1.35 Georgia,serif !important;
        text-align:center !important; }
      .productRail { margin:0 !important; padding:0 !important; display:grid !important;
        grid-template-columns:repeat(4,minmax(0,1fr)) !important;
        grid-template-rows:auto !important; gap:42px 24px !important;
        overflow:visible !important; align-items:start !important; }
      .productRail>.dogProduct,.productRail>.dogProduct:first-of-type {
        min-width:0 !important; width:100% !important; padding:0 !important;
        display:flex !important; flex-direction:column !important; align-items:stretch !important;
        justify-content:flex-start !important; overflow:visible !important;
        border:0 !important; border-radius:0 !important; background:none !important;
        box-shadow:none !important; transform:none !important; }
      .productRail>.dogProduct:hover { background:none !important; transform:none !important; }
      .productRail>.dogProduct .dogVisual {
        width:100% !important; height:auto !important; aspect-ratio:1.36 !important;
        min-height:0 !important; margin:0 !important; border:0 !important;
        border-radius:0 !important; background:#e7eff7 !important;
        box-shadow:none !important; overflow:hidden !important; }
      .productRail>.dogProduct .dogVisual img {
        width:100% !important; height:100% !important; object-fit:cover !important;
        animation:none !important; transform:none !important; }
      .productRail>.dogProduct .dogCopy {
        width:100% !important; min-height:0 !important; padding:16px 3px 0 !important;
        display:flex !important; align-items:center !important; text-align:center !important;
        color:#173652 !important; }
      .productRail>.dogProduct .dogCopy:before { display:none !important; }
      .productRail>.dogProduct .dogCopy h3 {
        color:#173652 !important; font:600 clamp(16px,1.35vw,20px)/1.5 Arial,sans-serif !important;
        text-shadow:none !important; }
      .productRail>.dogProduct .dogCopy a {
        min-height:40px !important; margin:13px auto 0 !important; padding:0 5px !important;
        border-radius:0 !important; border-bottom:1px solid #17659f !important;
        color:#17659f !important; background:none !important;
        box-shadow:none !important; font-size:14px !important; }
      .productRail>.dogProduct .productDetails { margin-top:15px !important; }
      .productRail>.dogProduct .productDetails summary {
        color:#173652 !important; background:#f0f5fa !important;
        border:1px solid #d7e5ef !important; }
      .productRail>.dogProduct .productDetailsBody {
        color:#173652 !important; background:#f0f5fa !important; }
      .heroSupport { width:min(1160px,calc(100% - 60px)) !important;
        max-width:none !important; margin:50px auto 0 !important;
        display:grid !important; grid-template-columns:repeat(3,minmax(0,1fr)) !important; }
      .supportCard { min-height:140px; color:#173652 !important;
        background:#f0f5fa !important; border:1px solid #d7e5ef !important;
        border-radius:0 !important; box-shadow:none !important; }
      .supportCard strong,.supportCard summary { color:#173652 !important; }
      .heroActions { width:min(700px,calc(100% - 40px)); margin:55px auto 0 !important; }
      .primaryAction { color:#fff !important; background:#17659f !important; }
      .secondaryAction { color:#17659f !important; background:#fff !important;
        border-color:#17659f !important; }
      .bottomAccountNote { width:min(1100px,calc(100% - 40px));
        margin:70px auto 0 !important; color:#173652 !important; text-align:center; }
      @media(max-width:900px) {
        .homeHeaderInner { width:calc(100% - 30px) !important; min-height:175px !important;
          padding:32px 0 15px !important; }
        .homeNav { gap:12px !important; flex-wrap:wrap; }
        .homeNav button { padding:8px 0 !important; font-size:13px !important; }
        .homeActions { top:5px; }
        .heroStage { min-height:340px !important; }
        .productRail { grid-template-columns:repeat(2,minmax(0,1fr)) !important;
          gap:35px 18px !important; }
        .heroSupport { grid-template-columns:1fr !important; }
        .productShowcase { width:calc(100% - 32px) !important; padding-top:60px !important; }
      }
      @media(max-width:600px) {
        .homeHeaderInner { min-height:190px !important; padding-top:43px !important; }
        .homeBrand strong { font-size:22px !important; }
        .homeNav { gap:6px 15px !important; }
        .homeNav button { font-size:12px !important; }
        .homeActions { transform:scale(.85); transform-origin:top right; }
        .heroStage { min-height:300px !important; padding:30px 18px; }
        .ecosystemCircle h1 { font-size:29px !important; }
        .referenceWidePhoto { height:280px; }
        .productHeading h2 { font-size:27px !important; }
        .productRail { gap:28px 12px !important; }
        .productRail>.dogProduct .dogVisual { aspect-ratio:1.08 !important; }
        .productRail>.dogProduct .dogCopy h3 { font-size:14px !important; }
        .heroSupport { width:calc(100% - 32px) !important; }
        .heroActions { grid-template-columns:repeat(2,1fr) !important; }
      }
    `}</style>
  );
}
