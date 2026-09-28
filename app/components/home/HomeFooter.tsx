"use client";

import { useEffect, useRef, useState } from "react";
import { QRIcon } from "./HomeIcons";
import InterfaceIcon from "../ui/InterfaceIcon";
import FAQMenu from "./FAQMenu";

export default function HomeFooter({ ka }: { ka: boolean }) {
  const [faqOpen, setFaqOpen] = useState(false);
  const faqDialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const openFromHash = () => {
      if (window.location.hash === "#faq") setFaqOpen(true);
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  useEffect(() => {
    if (!faqOpen) return;
    const current = faqDialog.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    current?.showModal();
    return () => {
      document.body.style.overflow = previousOverflow;
      current?.close();
    };
  }, [faqOpen]);

  return (
    <footer className="siteFooter">
      <div className="siteFooterInner">
        <div className="siteFooterTop">
          <div className="footerIdentity">
            <a href="/" className="footerBrand" aria-label="QR RETURN">
              <span className="footerBrandIcon" aria-hidden="true"><QRIcon size={25} /></span>
              <span className="footerBrandWords"><strong>QR RETURN</strong><small>SMART LOST &amp; FOUND</small></span>
            </a>
            <p>{ka ? "მყისიერი კავშირი — საჭირო დროს, საჭირო ადამიანთან." : "An instant connection — at the right time, with the right person."}</p>
          </div>

          <nav aria-labelledby="footer-navigation">
            <h2 id="footer-navigation">{ka ? "ნავიგაცია" : "Navigation"}</h2>
            <ul>
              <li><a href="/">{ka ? "მთავარი" : "Home"}</a></li>
              <li><a href="/store">{ka ? "ონლაინ შეძენა" : "Online store"}</a></li>
              <li><a href="/signup">{ka ? "რეგისტრაცია" : "Registration"}</a></li>
              <li><a href="/my-profiles">{ka ? "ჩემი პროფილები" : "My profiles"}</a></li>
            </ul>
          </nav>

          <nav aria-labelledby="footer-support">
            <h2 id="footer-support">{ka ? "დახმარება" : "Help & support"}</h2>
            <ul>
              <li><a href="/support">{ka ? "ონლაინ ჩათი" : "Online chat"}</a></li>
              <li><a href="/book-call">{ka ? "ზარის დაჯავშნა" : "Book a call"}</a></li>
              <li><button type="button" onClick={() => setFaqOpen(true)} aria-haspopup="dialog">{ka ? "ხშირად დასმული კითხვები" : "Frequently asked questions"}</button></li>
              <li><a className="footerEmail" href="mailto:hello@qrreturn.com">hello@qrreturn.com</a></li>
            </ul>
          </nav>
        </div>

        <div className="siteFooterBottom">
          <p><span>© {new Date().getFullYear()} QR RETURN</span><span>{ka ? "ყველა უფლება დაცულია." : "All rights reserved."}</span></p>
          <a href="#top" onClick={event => { event.preventDefault(); window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" }); }}>{ka ? "თავში დაბრუნება" : "Back to top"}<span className="footerUp"><InterfaceIcon name="arrow" size={15} /></span></a>
        </div>
      </div>

      <dialog ref={faqDialog} className="footerFaqDialog" aria-label={ka ? "ხშირად დასმული კითხვები" : "Frequently asked questions"} onClose={() => setFaqOpen(false)} onClick={event => { if (event.target === event.currentTarget) setFaqOpen(false); }}>
        <div className="footerFaqTop"><span>QR RETURN</span><button type="button" autoFocus onClick={() => setFaqOpen(false)} aria-label={ka ? "დახურვა" : "Close"}><InterfaceIcon name="close" /></button></div>
        {faqOpen && <div className="footerFaqBody"><FAQMenu ka={ka} /></div>}
      </dialog>

      <style jsx>{`
        .siteFooter{background:#073565;color:#fff;padding:42px 28px 20px;font-family:var(--font-georgian),Arial,sans-serif}
        .siteFooterInner{max-width:1140px;margin:0 auto}
        .siteFooterTop{display:grid;grid-template-columns:1.4fr 1fr 1.15fr;gap:clamp(32px,5vw,76px);align-items:start}
        .footerBrand{display:inline-flex;align-items:center;gap:11px;color:#fff;text-decoration:none}
        .footerBrandIcon{width:44px;height:44px;display:grid;place-items:center;border:1px solid #44b9ec;border-radius:12px;background:#159be7;color:#fff}
        .footerBrandWords{display:flex;flex-direction:column;gap:5px;font-family:Arial,sans-serif}
        .footerBrandWords strong{font-size:20px;line-height:1.15;letter-spacing:-.3px}
        .footerBrandWords small{font-size:10px;line-height:1.3;letter-spacing:1.2px;font-weight:600;color:#c1e5fb}
        .footerIdentity p{max-width:285px;margin:17px 0 0;color:#d7e5f2;font-size:14px;line-height:1.85}
        .siteFooter nav h2{margin:0 0 13px;color:#fff;font-size:15px;line-height:1.6;font-weight:600}
        .siteFooter ul{list-style:none;padding:0;margin:0;display:grid;gap:3px}
        .siteFooter li{min-width:0}
        .siteFooter nav a,.siteFooter nav button{display:inline-block;max-width:100%;padding:5px 0;border:0;background:none;color:#d7e5f2;font-family:inherit;font-size:14px;line-height:1.65;text-align:left;text-decoration:none;cursor:pointer;overflow-wrap:anywhere}
        .siteFooter nav a:hover,.siteFooter nav button:hover{color:#fff;text-decoration:underline;text-underline-offset:4px}
        .siteFooter .footerEmail{font-family:Arial,sans-serif;letter-spacing:.1px}
        .siteFooter a:focus-visible,.siteFooter button:focus-visible{outline:2px solid #93dcff;outline-offset:5px;border-radius:3px}
        .siteFooterBottom{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-top:28px;padding-top:18px;border-top:1px solid #ffffff26;color:#c5d8ea}
        .siteFooterBottom p{display:flex;flex-wrap:wrap;gap:8px 18px;margin:0;font-size:12px;line-height:1.7}
        .siteFooterBottom>a{display:inline-flex;align-items:center;gap:8px;padding:5px 0;color:#d7e5f2;text-decoration:none;font-size:12px;line-height:1.7;white-space:nowrap}
        .siteFooterBottom>a:hover{color:#fff}
        .footerUp{display:inline-flex;transform:rotate(-90deg)}
        .footerFaqDialog{width:min(800px,calc(100vw - 32px));max-height:calc(100svh - 40px);box-sizing:border-box;padding:0;border:1px solid #dae5ee;border-radius:20px;background:#f5f8fc;color:#17212f;box-shadow:0 28px 90px #061b4055;overflow:auto;font-family:var(--font-georgian),Arial,sans-serif}
        .footerFaqDialog::backdrop{background:#071c3d99;backdrop-filter:blur(4px)}
        .footerFaqTop{position:sticky;top:0;z-index:2;display:flex;justify-content:space-between;align-items:center;gap:20px;padding:15px 24px;background:#f5f8fc;border-bottom:1px solid #dce6ef}
        .footerFaqTop>span{font-family:Arial,sans-serif;font-size:13px;font-weight:700;letter-spacing:1px;color:#33546c}
        .footerFaqTop button{width:36px;height:36px;display:grid;place-items:center;border:1px solid #d4e0ea;border-radius:50%;background:#fff;color:#17212f;cursor:pointer}
        .footerFaqBody :global(.faqSection){padding:24px 28px 30px;font-family:var(--font-georgian),Arial,sans-serif}
        .footerFaqBody :global(.faqWrap){display:block}
        .footerFaqBody :global(header){position:static;margin-bottom:24px}
        .footerFaqBody :global(header>span){display:none}
        .footerFaqBody :global(header h2){max-width:none;margin:0;font-size:24px;line-height:1.6;letter-spacing:0}
        .footerFaqBody :global(header p){color:#496173;font-size:14px}
        .footerFaqBody :global(header a){font-size:14px;margin-top:16px}
        .footerFaqBody :global(.faqList summary){padding-top:10px;padding-bottom:10px}
        .footerFaqBody :global(.faqList summary strong){font-size:15px;line-height:1.65}
        .footerFaqBody :global(.faqList details p){font-size:14px;line-height:1.85;color:#374151}
        @media(max-width:800px){.siteFooter{padding:32px 24px 18px}.siteFooterTop{grid-template-columns:1fr 1fr;gap:28px 32px}.footerIdentity{grid-column:1/-1}.footerIdentity p{max-width:440px;margin-top:12px}.siteFooterBottom{margin-top:24px}}
        @media(max-width:480px){.siteFooter{padding:30px 20px 18px}.siteFooterTop{gap:26px 20px;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr)}.siteFooter nav h2{font-size:14px}.siteFooter nav a,.siteFooter nav button{font-size:14px;line-height:1.7;padding:7px 0}.siteFooterBottom{align-items:flex-start;gap:14px;flex-direction:column}.siteFooterBottom p{gap:4px 12px}.footerFaqTop{padding:12px 18px}.footerFaqBody :global(.faqSection){padding:20px 18px 24px}.footerFaqBody :global(header h2){font-size:22px}.footerFaqBody :global(.faqList summary){grid-template-columns:24px minmax(0,1fr) 28px;gap:7px}.footerFaqBody :global(.faqList details div){padding:0 0 18px 31px}}
      `}</style>
    </footer>
  );
}
