"use client";

export default function HomeFooter({ ka }: { ka: boolean }) {
  return (
    <footer className="footer">
      <div className="footerTop">
        <div className="brandColumn">
          <a href="/" className="brand">
            <span className="logo">QR</span>
            <span><strong>QR RETURN</strong><small>SMART LOST &amp; FOUND</small></span>
          </a>
          <p>{ka ? "მყისიერი კავშირი — საჭირო დროს, საჭირო ადამიანთან." : "An instant connection — at the right time, with the right person."}</p>
        </div>

        <nav>
          <h3>{ka ? "ნავიგაცია" : "Navigation"}</h3>
          <a href="/">{ka ? "მთავარი" : "Home"}</a>
          <a href="/store">{ka ? "ონლაინ შეძენა" : "Online store"}</a>
          <a href="/register">{ka ? "რეგისტრაცია" : "Registration"}</a>
          <a href="/my-profiles">{ka ? "ჩემი პროფილები" : "My profiles"}</a>
        </nav>

        <nav>
          <h3>{ka ? "მხარდაჭერა" : "Support"}</h3>
          <a href="/support">{ka ? "ჩატი" : "Chat"}</a>
          <a href="/book-call">{ka ? "ზარის დაჯავშნა" : "Book a call"}</a>
          <a href="mailto:hello@qrreturn.com">hello@qrreturn.com</a>
          <a href="/support">24/7 Support</a>
        </nav>

        <nav>
          <h3>{ka ? "ინფორმაცია" : "Information"}</h3>
          <a href="#faq">{ka ? "ხშირად დასმული კითხვები" : "FAQ"}</a>
          <a href="/privacy">{ka ? "კონფიდენციალურობა" : "Privacy"}</a>
          <a href="/terms">{ka ? "წესები და პირობები" : "Terms & conditions"}</a>
        </nav>
      </div>

      <div className="footerBottom">
        <span>© {new Date().getFullYear()} QR RETURN</span>
        <span>{ka ? "ყველა უფლება დაცულია." : "All rights reserved."}</span>
        <div><a href="#" aria-label="Facebook">f</a><a href="#" aria-label="Instagram">◎</a><a href="#" aria-label="TikTok">♪</a></div>
      </div>

      <style jsx>{`
        .footer{padding:68px 40px 24px;background:#080b0f;color:#fff;font-family:Arial,Helvetica,sans-serif}.footerTop,.footerBottom{width:100%;max-width:1160px;margin:auto}.footerTop{display:grid;grid-template-columns:1.55fr repeat(3,1fr);gap:64px}.brand{display:flex;align-items:center;gap:12px;color:#fff;text-decoration:none}.logo{width:47px;height:47px;display:grid;place-items:center;border-radius:12px;background:#fff;color:#0a4c8a;font-size:15px;font-weight:950}.brand>span:last-child{display:flex;flex-direction:column}.brand strong{font-size:19px;letter-spacing:.2px}.brand small{margin-top:3px;color:#84bce9;font-size:8px;font-weight:900;letter-spacing:1.2px}.brandColumn p{max-width:300px;margin:23px 0 0;color:#9ca7b3;font-size:13px;line-height:1.7}.footer h3{margin:0 0 20px;color:#fff;font-size:12px;font-weight:900;letter-spacing:.5px}.footer nav{display:flex;flex-direction:column;align-items:flex-start}.footer nav a{margin:0 0 13px;color:#aab3bd;font-size:12px;line-height:1.4;text-decoration:none;transition:color .18s ease}.footer nav a:hover{color:#fff}.footerBottom{margin-top:54px;padding-top:22px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:20px;border-top:1px solid #252a31;color:#78818b;font-size:10px}.footerBottom>span:nth-child(2){text-align:center}.footerBottom div{display:flex;justify-content:flex-end;gap:9px}.footerBottom a{width:31px;height:31px;display:grid;place-items:center;border:1px solid #30363e;border-radius:50%;color:#fff;font-size:12px;font-weight:900;text-decoration:none}.footerBottom a:hover{border-color:#fff;background:#fff;color:#080b0f}
        @media(max-width:850px){.footerTop{grid-template-columns:1.4fr 1fr;gap:42px}.footerBottom{grid-template-columns:1fr auto}.footerBottom>span:nth-child(2){display:none}}
        @media(max-width:540px){.footer{padding:50px 20px 22px}.footerTop{grid-template-columns:1fr;gap:34px}.brandColumn{padding-bottom:8px}.footer h3{margin-bottom:15px}.footerBottom{margin-top:40px;grid-template-columns:1fr}.footerBottom div{justify-content:flex-start}}
      `}</style>
    </footer>
  );
}
