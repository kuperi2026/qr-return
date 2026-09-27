"use client";

import { useEffect, useRef, useState } from "react";
import InterfaceIcon from "../ui/InterfaceIcon";

export default function HomeSupportCards({ ka }: { ka: boolean }) {
  const [infoOpen, setInfoOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!infoOpen) return;
    const previous = document.body.style.overflow;
    const current = dialog.current;
    document.body.style.overflow = "hidden";
    current?.showModal();
    return () => { document.body.style.overflow = previous; current?.close(); };
  }, [infoOpen]);

  return <>
    <nav className="homeContactCards" aria-label={ka ? "ინფორმაცია და მხარდაჭერა" : "Information and support"}>
      <button className="contactTile" type="button" onClick={() => setInfoOpen(true)} aria-haspopup="dialog">
        <span className="contactIcon"><InterfaceIcon name="info" size={22}/></span>
        <span className="contactCopy"><strong>{ka ? "პროდუქტის შესახებ" : "About the product"}</strong><small>{ka ? "როგორ მუშაობს QR RETURN" : "How QR RETURN works"}</small></span>
        <span className="contactArrow"><InterfaceIcon name="arrow" size={17}/></span>
      </button>
      <a className="contactTile callTile" href="/book-call">
        <span className="contactIcon"><InterfaceIcon name="phone" size={22}/></span>
        <span className="contactCopy"><strong>{ka ? "24/7 მხარდაჭერა" : "24/7 support"}</strong><small>{ka ? "ზარის დაჯავშნა" : "Book a call"}</small></span>
        <span className="contactArrow"><InterfaceIcon name="arrow" size={17}/></span>
      </a>
      <a className="contactTile chatTile" href="/support">
        <span className="contactIcon"><InterfaceIcon name="chat" size={22}/></span>
        <span className="contactCopy"><strong>{ka ? "ონლაინ ჩათი" : "Online chat"}</strong><small>{ka ? "მოგვწერეთ ახლავე" : "Send us a message"}</small></span>
        <span className="contactArrow"><InterfaceIcon name="arrow" size={17}/></span>
      </a>
    </nav>

    <dialog ref={dialog} className="productDialog" aria-labelledby="product-info-title" onClose={() => setInfoOpen(false)} onClick={event => { if (event.target === event.currentTarget) setInfoOpen(false); }}>
      <div className="productDialogInner">
        <div className="dialogTop"><span>QR RETURN</span><button type="button" autoFocus onClick={() => setInfoOpen(false)} aria-label={ka ? "დახურვა" : "Close"}><InterfaceIcon name="close"/></button></div>
        <div className="dialogIntro"><span className="dialogSymbol"><InterfaceIcon name="info" size={26}/></span><p className="dialogEyebrow">{ka ? "მარტივი კავშირი, ერთი სკანით" : "One scan. A simple connection."}</p><h2 id="product-info-title">{ka ? "როგორ მუშაობს QR RETURN?" : "How does QR RETURN work?"}</h2><p>{ka ? "QR კოდი აკავშირებს მპოვნელსა და მფლობელს. თქვენ მართავთ პროფილს და წყვეტთ, რა ინფორმაცია გამოჩნდეს სკანირებისას." : "A QR code connects a finder with an owner. You manage the profile and choose which information is visible when scanned."}</p></div>
        <ol className="productSteps">
          <li><span>01</span><div><h3>{ka ? "შექმენით პროფილი" : "Create a profile"}</h3><p>{ka ? "დაამატეთ ინფორმაცია და აირჩიეთ დაკავშირების სასურველი გზა." : "Add your details and choose how you want to be contacted."}</p></div></li>
          <li><span>02</span><div><h3>{ka ? "დააკავშირეთ QR კოდი" : "Connect your QR code"}</h3><p>{ka ? "პროფილს დაუკავშირეთ შესაბამისი QR პროდუქტი." : "Link the appropriate QR product to your profile."}</p></div></li>
          <li><span>03</span><div><h3>{ka ? "სკანირება და დაკავშირება" : "Scan and connect"}</h3><p>{ka ? "მპოვნელი QR კოდს ტელეფონით სკანირებს — აპლიკაციის ჩამოტვირთვის გარეშე." : "The finder scans the QR code with a phone, without downloading an app."}</p></div></li>
        </ol>
        <div className="dialogFooter"><span>{ka ? "კითხვა გაქვთ?" : "Have a question?"}</span><a href="/support">{ka ? "მოგვწერეთ ჩათში" : "Chat with us"}<InterfaceIcon name="arrow" size={16}/></a></div>
      </div>
    </dialog>

    <style jsx>{`
      .homeContactCards{position:relative;z-index:2;width:min(1140px,calc(100vw - 48px));display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;font-family:var(--font-georgian),Arial,sans-serif}
      .contactTile{box-sizing:border-box;min-width:0;display:grid;grid-template-columns:42px minmax(0,1fr) 26px;align-items:center;gap:13px;min-height:112px;padding:21px 20px;border:1px solid #d0e6f3;border-radius:18px;background:#fff;color:#173e60;text-align:left;text-decoration:none;font:inherit;cursor:pointer;box-shadow:0 8px 20px #073c6315;transition:transform .18s,box-shadow .18s}
      .contactTile:hover{transform:translateY(-3px);box-shadow:0 12px 26px #062e652b}.contactTile:focus-visible{outline:3px solid #9ce7d4;outline-offset:4px}
      .contactIcon{height:42px;width:42px;display:grid;place-items:center;border-radius:12px;background:#e1f0fc;color:#126ea6}
      .contactCopy{min-width:0}.contactCopy strong{display:block;font-size:18px;line-height:1.6;font-weight:600;letter-spacing:0}.contactCopy small{display:block;margin-top:6px;font-size:14px;line-height:1.6;color:#496b84;letter-spacing:0}
      .contactArrow{height:26px;width:26px;display:grid;place-items:center;border:1px solid #cce1f0;border-radius:50%;color:#266b9a;background:#eff7fd}
      .callTile{background:#fff}.callTile .contactIcon{background:#dff1ed;color:#187967}
      .chatTile{background:#fff}.chatTile .contactIcon{background:#e6edfc;color:#3c64aa}
      .productDialog{width:min(600px,calc(100vw - 32px));max-height:calc(100svh - 40px);padding:0;border:1px solid #dbe5ed;border-radius:24px;box-shadow:0 30px 100px #071c4b44;color:#193954;background:#fff;font-family:var(--font-georgian),Arial,sans-serif;overflow:auto}.productDialog::backdrop{background:#0b243a99;backdrop-filter:blur(5px)}
      .productDialogInner{padding:26px 34px 0;background:linear-gradient(180deg,#eef7ff 0%,#fff 50%)}.dialogTop{display:flex;align-items:center;justify-content:space-between;gap:20px}.dialogTop>span{font-family:Arial,sans-serif;font-size:14px;font-weight:700;letter-spacing:.12em;color:#416079}.dialogTop button{width:36px;height:36px;border:1px solid #e1e8ed;border-radius:50%;display:grid;place-items:center;background:#f6f8fa;color:#526b80;cursor:pointer}.dialogIntro{padding-top:22px}.dialogSymbol{height:54px;width:54px;display:grid;place-items:center;border-radius:16px;background:#17688c;color:#fff}.dialogIntro .dialogEyebrow{font-size:14px;color:#28755e;margin:21px 0 8px;font-weight:600}.dialogIntro h2{font-size:28px;line-height:1.55;margin:0 0 12px;font-weight:600;letter-spacing:-.3px}.dialogIntro p{font-size:16px;line-height:1.9;margin:0;color:#49677d}.productSteps{list-style:none;padding:0;margin:24px 0}.productSteps li{display:flex;gap:15px;padding:17px 0;border-top:1px solid #e9eef3}.productSteps li>span{display:grid;place-items:center;flex:0 0 32px;width:32px;height:32px;border-radius:9px;background:#deeee7;color:#246d55;font-size:14px;font-weight:600}.productSteps li:first-child>span{background:#deedfa;color:#236aa0}.productSteps li:last-child>span{background:#e7eafa;color:#53669a}.productSteps h3{font-size:16px;line-height:1.7;font-weight:600;margin:0 0 5px}.productSteps p{font-size:14px;line-height:1.85;color:#516e82;margin:0}.dialogFooter{display:flex;align-items:center;justify-content:space-between;gap:14px;margin:0 -34px;padding:20px 34px;background:#eaf4f7;border-top:1px solid #d8e8ee;font-size:14px;color:#63788b}.dialogFooter a{display:inline-flex;align-items:center;gap:8px;color:#206c59;font-weight:600;text-decoration:none}.productDialog button:focus-visible,.dialogFooter a:focus-visible{outline:2px solid #2b7e9b;outline-offset:3px}
      @media(max-width:1000px){.homeContactCards{gap:10px}.contactTile{min-height:132px;padding:18px 15px;grid-template-columns:36px minmax(0,1fr) 23px;gap:10px}.contactIcon{height:36px;width:36px}.contactCopy strong{font-size:16px}.contactCopy small{font-size:14px}}
      @media(max-width:900px){.homeContactCards{grid-template-columns:1fr;width:calc(100vw - 40px);max-width:470px;gap:10px}.contactTile{min-height:102px;padding:16px 19px;grid-template-columns:40px minmax(0,1fr) 28px;gap:14px;border-radius:16px}.contactIcon{height:40px;width:40px}.contactCopy strong{font-size:17px}.contactCopy small{font-size:14px;margin-top:4px}.contactArrow{width:28px;height:28px}.productDialogInner{padding:20px 24px 0}.dialogIntro h2{font-size:25px}.dialogFooter{margin:0 -24px;padding:18px 24px}}
      @media(prefers-reduced-motion:reduce){.contactTile{transition:none}.contactTile:hover{transform:none}}
    `}</style>
  </>;
}
