"use client";

import EmergencySection from "./EmergencySection";
import { QRIcon, ShieldIcon } from "./HomeIcons";

type Props = { ka: boolean };

const categories = [
  { icon: "🐶", ka: "ძაღლი", en: "Dog", textKa: "QR პროფილი თქვენი ძაღლის უსაფრთხო დაბრუნებისთვის.", textEn: "A QR profile designed to help your dog return safely." },
  { icon: "🐱", ka: "კატა", en: "Cat", textKa: "მარტივი დაკავშირება კატის მპოვნელსა და პატრონს შორის.", textEn: "A simple connection between a finder and cat owner." },
  { icon: "🔑", ka: "გასაღები", en: "Keys", textKa: "ერთი სკანირება დაკარგული გასაღების დასაბრუნებლად.", textEn: "One scan can help return lost keys." },
  { icon: "👛", ka: "საფულე", en: "Wallet", textKa: "კონტაქტი პირადი ინფორმაციის ზედმეტი გამჟღავნების გარეშე.", textEn: "Make contact without exposing unnecessary personal data." },
  { icon: "👜", ka: "ჩანთა", en: "Bag", textKa: "თქვენ მიერ არჩეული ინფორმაცია და დაკავშირების გზები.", textEn: "Only the details and contact methods you choose." },
  { icon: "🧳", ka: "ჩემოდანი", en: "Suitcase", textKa: "მოგზაურობისას უფრო მარტივი პოვნა და დაკავშირება.", textEn: "Easier identification and contact while traveling." },
  { icon: "✚", ka: "Emergency", en: "Emergency", textKa: "მნიშვნელოვანი ინფორმაცია და საგანგებო კონტაქტები ერთ პროფილში.", textEn: "Essential information and emergency contacts in one profile." },
];

const features = [
  { icon: "◫", ka: "Live Chat", en: "Live Chat", textKa: "მპოვნელსა და მფლობელს შეუძლიათ უსაფრთხოდ მიწერონ ერთმანეთს.", textEn: "The finder and owner can communicate securely." },
  { icon: "☎", ka: "ზარი", en: "Phone Call", textKa: "მფლობელის არჩევანის შემთხვევაში გამოჩნდება პირდაპირი დარეკვის ღილაკი.", textEn: "A direct call button appears only when the owner enables it." },
  { icon: "⌖", ka: "ლოკაციის გაზიარება", en: "Location Sharing", textKa: "ორივე მხარე ლოკაციას მხოლოდ საკუთარი სურვილით აზიარებს.", textEn: "Either person shares a location only by choice." },
  { icon: "!", ka: "Lost ON", en: "Lost Mode", textKa: "დაკარგვის რეჟიმი აჩვენებს შესაბამის შეტყობინებას და დაბრუნების ფუნქციებს.", textEn: "Lost Mode shows the right message and return actions." },
  { icon: "◉", ka: "Scan შეტყობინება", en: "Scan Alert", textKa: "მფლობელი ხედავს, როდესაც მისი QR პროფილი დასკანერდება.", textEn: "The owner can see when the QR profile is scanned." },
  { icon: "✓", ka: "ინფორმაციის კონტროლი", en: "Privacy Control", textKa: "მფლობელი თავად წყვეტს, რა გამოჩნდეს საჯარო პროფილში.", textEn: "The owner decides exactly what appears publicly." },
];

export default function CompleteHomePage({ ka }: Props) {
  return (
    <>
      <section className="hero">
        <div className="heroInner">
          <div className="heroCopy">
            <span className="eyebrow">QR RETURN · SMART LOST &amp; FOUND</span>
            <h1>{ka ? "ერთი სკანირება შეიძლება გახდეს ყველაზე მოკლე გზა დაბრუნებამდე." : "One scan can become the shortest way back."}</h1>
            <p>{ka ? "QR RETURN აკავშირებს მპოვნელსა და მფლობელს — ნივთების, ცხოველებისა და Emergency პროფილებისთვის. აპლიკაციის ჩამოტვირთვა მპოვნელს არ სჭირდება." : "QR RETURN connects finders and owners for belongings, pets and Emergency profiles. The finder does not need an app."}</p>
            <div className="heroActions">
              <a className="whiteButton" href="/store">{ka ? "მაღაზიის ნახვა" : "View Store"} <span>→</span></a>
              <a className="glassButton" href="#how-it-works">{ka ? "როგორ მუშაობს" : "How It Works"}</a>
            </div>
            <div className="heroProof">
              <span>✓ {ka ? "აპლიკაცია არ სჭირდება" : "No app required"}</span>
              <span>✓ {ka ? "ინფორმაციას თქვენ აკონტროლებთ" : "You control your data"}</span>
              <span>✓ {ka ? "7 კატეგორია" : "7 categories"}</span>
            </div>
          </div>
          <div className="heroVisual" aria-hidden="true">
            <div className="orbit orbitOne" />
            <div className="orbit orbitTwo" />
            <div className="tag">
              <div className="tagTop"><span>QR RETURN</span><span>●</span></div>
              <div className="qrBox"><QRIcon size={90} /></div>
              <strong>{ka ? "დაასკანერე" : "SCAN ME"}</strong>
              <small>NEVER LOSE WHAT MATTERS</small>
            </div>
            <div className="floatCard pet">🐶 <span>DOG</span></div>
            <div className="floatCard keys">🔑 <span>KEYS</span></div>
            <div className="floatCard safe"><ShieldIcon /><span>PRIVATE</span></div>
          </div>
        </div>
      </section>

      <section className="whiteSection" id="how-it-works">
        <div className="shell">
          <SectionHeader index="01" eyebrow="HOW IT WORKS" title={ka ? "დაკარგულიდან დაბრუნებამდე — ოთხი მარტივი ნაბიჯი." : "From lost to returned in four simple steps."} text={ka ? "QR RETURN შექმნილია იმისთვის, რომ საჭირო მომენტში დაკავშირება იყოს სწრაფი, გასაგები და უსაფრთხო." : "QR RETURN makes contact fast, clear and secure when it matters."} />
          <div className="steps">
            <Step n="01" icon="▣" title={ka ? "აირჩიეთ პროდუქტი" : "Choose a Product"} text={ka ? "აირჩიეთ შესაბამისი კატეგორია და QR RETURN პროდუქტი." : "Choose the right category and QR RETURN product."} />
            <Step n="02" icon="⌁" title={ka ? "შექმენით პროფილი" : "Create a Profile"} text={ka ? "მიაბით QR კოდი თქვენს ნივთს, ცხოველს ან Emergency პროფილს." : "Connect the QR code to an item, pet or Emergency profile."} />
            <Step n="03" icon="⌕" title={ka ? "მპოვნელი ასკანირებს" : "Finder Scans"} text={ka ? "ტელეფონის კამერა ხსნის საჯარო გვერდს რეგისტრაციის გარეშე." : "A phone camera opens the public page without registration."} />
            <Step n="04" icon="↗" title={ka ? "იწყება დაბრუნება" : "Return Begins"} text={ka ? "ზარი, Live Chat ან ნებაყოფლობითი ლოკაცია აკავშირებს ორივე მხარეს." : "Call, Live Chat or optional location sharing connects both sides."} />
          </div>
        </div>
      </section>

      <section className="blueSection" id="products">
        <div className="shell">
          <SectionHeader light index="02" eyebrow="SEVEN CATEGORIES" title={ka ? "ერთი სისტემა — შვიდი მნიშვნელოვანი გამოყენება." : "One system for seven important uses."} text={ka ? "თითოეული QR პროფილი თავის კატეგორიას ეკუთვნის და დამოუკიდებლად იმართება." : "Each QR profile belongs to its own category and is managed independently."} />
          <div className="categoryGrid">
            {categories.map((item, index) => <article className={"categoryCard " + (index === 6 ? "emergencyCard" : "")} key={item.en}>
              <div className="categoryIcon">{item.icon}</div><span>0{index + 1}</span><h3>{ka ? item.ka : item.en}</h3><p>{ka ? item.textKa : item.textEn}</p>
            </article>)}
          </div>
        </div>
      </section>

      <section className="whiteSection">
        <div className="shell">
          <SectionHeader index="03" eyebrow="CORE FEATURES" title={ka ? "ყველაფერი, რაც სრულფასოვანი დაბრუნებისთვის არის საჭირო." : "Everything needed for a complete return experience."} text={ka ? "ყველა ფუნქცია მფლობელის კონტროლქვეშაა და მხოლოდ მისი არჩევანის შესაბამისად მუშაობს." : "Every feature remains under the owner's control."} />
          <div className="featureGrid">
            {features.map((item) => <article className="featureCard" key={item.en}><div className="featureIcon">{item.icon}</div><h3>{ka ? item.ka : item.en}</h3><p>{ka ? item.textKa : item.textEn}</p></article>)}
          </div>
        </div>
      </section>

      <section className="splitSection">
        <div className="shell splitGrid">
          <div className="splitIntro">
            <span className="eyebrow blueText">TWO SIDES · ONE CONNECTION</span>
            <h2>{ka ? "მფლობელსაც და მპოვნელსაც მარტივი გამოცდილება." : "A simple experience for both owner and finder."}</h2>
            <p>{ka ? "მპოვნელს ანგარიში არ სჭირდება. მფლობელი კი ყველაფერს ერთი დაცული ანგარიშიდან მართავს." : "The finder needs no account, while the owner manages everything securely."}</p>
          </div>
          <article className="roleCard ownerCard"><span className="roleLabel">{ka ? "მფლობელი" : "OWNER"}</span><div className="roleIcon">◉</div><h3>{ka ? "მართეთ ყველაფერი ერთ სივრცეში" : "Manage everything in one place"}</h3><ul><li>{ka ? "შეუზღუდავი QR პროფილები" : "Unlimited QR profiles"}</li><li>{ka ? "ინფორმაციისა და ხილვადობის რედაქტირება" : "Edit information and visibility"}</li><li>{ka ? "Lost ON, Scan ისტორია და შეტყობინებები" : "Lost Mode, scan history and alerts"}</li><li>{ka ? "Live Chat და ლოკაციის გაზიარება" : "Live Chat and location sharing"}</li></ul><a href="/signup">{ka ? "ანგარიშის შექმნა" : "Create Account"} →</a></article>
          <article className="roleCard finderCard"><span className="roleLabel">{ka ? "მპოვნელი" : "FINDER"}</span><div className="roleIcon">⌕</div><h3>{ka ? "დაასკანირეთ და დაეხმარეთ დაბრუნებაში" : "Scan and help it return"}</h3><ul><li>{ka ? "რეგისტრაცია არ არის საჭირო" : "No registration required"}</li><li>{ka ? "ხედავს მხოლოდ მფლობელის არჩეულ ინფორმაციას" : "Sees only owner-approved information"}</li><li>{ka ? "ზარი ან Live Chat ერთი შეხებით" : "Call or Live Chat in one tap"}</li><li>{ka ? "ლოკაციის ნებაყოფლობითი გაზიარება" : "Optional location sharing"}</li></ul><strong>{ka ? "დაასკანირე. დაუკავშირდი. დააბრუნე." : "Scan. Connect. Return."}</strong></article>
        </div>
      </section>

      <section className="emergencyWrap">
        <div className="shell emergencyGrid">
          <EmergencySection ka={ka} />
          <div className="emergencyPanel">
            <span>QR RETURN EMERGENCY</span><div className="bracelet"><i /><div><QRIcon size={60} /></div><i /></div>
            <h3>{ka ? "ინფორმაცია, რომელიც საჭირო დროს ხელმისაწვდომია." : "Information available when it matters."}</h3>
            <p>{ka ? "სამედიცინო და საკონტაქტო მონაცემებიდან გამოჩნდება მხოლოდ ის, რასაც მომხმარებელი წინასწარ აირჩევს." : "Only the medical and contact information selected by the user is shown."}</p>
          </div>
        </div>
      </section>

      <section className="privacySection">
        <div className="shell privacyGrid">
          <div className="privacyMark"><ShieldIcon /></div>
          <div><span className="eyebrow blueText">PRIVACY BY CHOICE</span><h2>{ka ? "თქვენი ინფორმაცია — თქვენი გადაწყვეტილება." : "Your information. Your decision."}</h2><p>{ka ? "საჯარო პროფილში სრული Tag Code არ ჩანს. მფლობელი თავად მართავს ტელეფონის, ელფოსტის, მისამართის, Live Chat-ისა და ლოკაციის ხილვადობას." : "The full Tag Code is never public. The owner controls phone, email, address, Live Chat and location visibility."}</p></div>
          <div className="privacyList"><span>✓ {ka ? "მხოლოდ არჩეული ინფორმაცია" : "Only selected information"}</span><span>✓ {ka ? "Tag Code დაფარულია" : "Tag Code masked"}</span><span>✓ {ka ? "ლოკაცია ნებაყოფლობითია" : "Location is voluntary"}</span></div>
        </div>
      </section>

      <section className="storeCta" id="how-to-order">
        <div className="shell ctaInner">
          <div><span className="eyebrow">QR RETURN STORE</span><h2>{ka ? "აირჩიეთ თქვენი QR RETURN." : "Choose your QR RETURN."}</h2><p>{ka ? "რეალური პროდუქტები, ფოტოები და ფასები მაღაზიაში ეტაპობრივად დაემატება. შვიდივე კატეგორია უკვე მზადაა." : "Products, photos and prices will be added progressively. All seven categories are ready."}</p></div>
          <div className="ctaActions"><a href="/store">{ka ? "მაღაზიის გახსნა" : "Open Store"} →</a><a href="/signup">{ka ? "რეგისტრაცია" : "Register"}</a></div>
        </div>
      </section>

      <section className="finalCta">
        <div className="shell finalInner"><div className="finalQr"><QRIcon size={54} /></div><div><span>QR RETURN</span><h2>{ka ? "დაკარგვა არ ნიშნავს დამშვიდობებას." : "Never lose what matters."}</h2><p>{ka ? "ერთი სწორი კავშირი შეიძლება გახდეს დაბრუნების დასაწყისი." : "One right connection can be the beginning of a return."}</p></div><a href="/signup">{ka ? "შექმენი ანგარიში" : "Create Account"} →</a></div>
      </section>

      <footer>
        <div className="shell footerTop"><div className="footerBrand"><div><QRIcon size={26} /></div><strong>QR RETURN<small>SMART LOST &amp; FOUND</small></strong></div><p>{ka ? "ნივთების, ცხოველებისა და Emergency პროფილების ერთიანი QR სისტემა." : "One QR system for belongings, pets and Emergency profiles."}</p><nav><a href="/store">{ka ? "მაღაზია" : "Store"}</a><a href="/signup">{ka ? "რეგისტრაცია" : "Register"}</a><a href="/login">{ka ? "შესვლა" : "Sign in"}</a><a href="/support">Live Chat</a></nav></div>
        <div className="shell footerBottom"><span>© 2026 QR RETURN</span><div><a href="/privacy">{ka ? "კონფიდენციალურობა" : "Privacy"}</a><a href="/terms">{ka ? "წესები" : "Terms"}</a></div></div>
      </footer>

      <style jsx>{`
        *{box-sizing:border-box}.shell{width:calc(100% - 48px);max-width:1180px;margin:auto}.hero{overflow:hidden;background:#1266e9;color:#fff}.heroInner{width:calc(100% - 48px);max-width:1180px;min-height:680px;margin:auto;display:grid;grid-template-columns:1.04fr .96fr;align-items:center;gap:70px;padding:74px 0}.eyebrow{font-size:11px;font-weight:900;letter-spacing:1.5px;color:#ffffffbd}.hero h1{max-width:700px;margin:15px 0 0;font-size:clamp(42px,5vw,68px);line-height:1.02;letter-spacing:-2.8px}.heroCopy>p{max-width:650px;margin:22px 0 0;color:#ffffffd3;font-size:16px;line-height:1.75}.heroActions{display:flex;gap:10px;flex-wrap:wrap;margin-top:30px}.heroActions a,.ctaActions a,.finalInner>a{min-height:50px;padding:0 20px;display:inline-flex;align-items:center;justify-content:center;gap:25px;border-radius:12px;font-size:13px;font-weight:900;text-decoration:none}.whiteButton{background:#fff;color:#1266e9}.glassButton{border:1px solid #ffffff66;background:#ffffff17;color:#fff}.heroProof{display:flex;flex-wrap:wrap;gap:14px;margin-top:26px;color:#ffffffc7;font-size:11px;font-weight:800}.heroVisual{height:500px;position:relative;display:grid;place-items:center}.orbit{position:absolute;border:1px solid #ffffff31;border-radius:50%}.orbitOne{width:440px;height:440px}.orbitTwo{width:340px;height:340px}.tag{width:245px;height:330px;position:relative;z-index:2;padding:24px;display:flex;align-items:center;flex-direction:column;border:1px solid #ffffff80;border-radius:36px;background:#fff;color:#1266e9;box-shadow:0 35px 90px #00378e7a;transform:rotate(-4deg)}.tagTop{width:100%;display:flex;justify-content:space-between;font-size:10px;font-weight:900}.qrBox{margin-top:38px;padding:16px;border:2px solid #1266e9;border-radius:18px}.tag>strong{margin-top:22px;font-size:18px}.tag>small{margin-top:8px;font-size:7px;font-weight:900;letter-spacing:1.3px}.floatCard{position:absolute;z-index:3;min-width:112px;padding:14px;display:flex;align-items:center;gap:9px;border:1px solid #ffffff70;border-radius:15px;background:#ffffffed;color:#1266e9;box-shadow:0 18px 40px #00378e50;font-size:25px;font-weight:900}.floatCard span{font-size:9px}.floatCard.pet{left:0;top:75px}.floatCard.keys{right:0;bottom:85px}.floatCard.safe{left:25px;bottom:35px}.floatCard.safe :global(svg){width:25px;height:25px}.whiteSection,.privacySection{padding:100px 0;background:#fff;color:#172b43}.blueSection,.emergencyWrap{padding:100px 0;background:#1266e9;color:#fff}.steps{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:38px}.step{min-height:235px;padding:23px;border:1px solid #dce6f4;border-radius:18px;background:#fff;box-shadow:0 14px 35px #0d4f9f0d}.stepTop{display:flex;justify-content:space-between;align-items:center}.stepTop span{color:#1266e9;font-size:10px;font-weight:900}.stepIcon{width:50px;height:50px;display:grid;place-items:center;border-radius:13px;background:#1266e9;color:#fff;font-size:23px}.step h3{margin:48px 0 0;font-size:18px}.step p,.featureCard p,.categoryCard p{margin:9px 0 0;color:#6f8096;font-size:13px;line-height:1.65}.categoryGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:38px}.categoryCard{min-height:230px;padding:21px;border:1px solid #ffffff38;border-radius:18px;background:#ffffff12;position:relative}.categoryCard>span{position:absolute;right:18px;top:18px;color:#ffffff70;font-size:10px;font-weight:900}.categoryIcon{width:58px;height:58px;display:grid;place-items:center;border-radius:16px;background:#fff;color:#1266e9;font-size:29px}.categoryCard h3{margin:32px 0 0;font-size:19px}.categoryCard p{color:#ffffffb9}.emergencyCard{background:#fff;color:#1266e9}.emergencyCard p{color:#60758f}.emergencyCard .categoryIcon{background:#1266e9;color:#fff}.featureGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:38px}.featureCard{min-height:230px;padding:23px;border:1px solid #dce6f4;border-radius:18px;background:#f8fbff}.featureIcon{width:54px;height:54px;display:grid;place-items:center;border-radius:15px;background:#1266e9;color:#fff;font-size:23px;font-weight:900}.featureCard h3{margin:32px 0 0;font-size:18px}.splitSection{padding:100px 0;background:#f4f8ff;color:#172b43}.splitGrid{display:grid;grid-template-columns:.8fr 1fr 1fr;gap:16px;align-items:stretch}.splitIntro{padding:22px 24px 22px 0}.blueText{color:#1266e9}.splitIntro h2,.privacyGrid h2{margin:15px 0 0;font-size:clamp(30px,3vw,43px);line-height:1.08;letter-spacing:-1.5px}.splitIntro p,.privacyGrid p{color:#647890;font-size:14px;line-height:1.75}.roleCard{min-height:430px;padding:27px;border-radius:21px}.ownerCard{background:#1266e9;color:#fff}.finderCard{border:1px solid #d9e4f3;background:#fff}.roleLabel{font-size:10px;font-weight:900;letter-spacing:1.3px}.roleIcon{width:56px;height:56px;margin-top:38px;display:grid;place-items:center;border-radius:16px;background:#fff;color:#1266e9;font-size:25px}.finderCard .roleIcon{background:#1266e9;color:#fff}.roleCard h3{margin:25px 0 0;font-size:22px;line-height:1.2}.roleCard ul{margin:23px 0 0;padding:0;list-style:none}.roleCard li{padding:10px 0;border-bottom:1px solid currentColor;color:inherit;font-size:12px;opacity:.85}.roleCard li:before{content:"✓";margin-right:8px;font-weight:900}.roleCard a{display:inline-block;margin-top:24px;color:#fff;font-size:12px;font-weight:900;text-decoration:none}.finderCard strong{display:block;margin-top:24px;color:#1266e9;font-size:12px}.emergencyGrid{display:grid;grid-template-columns:1.15fr .85fr;gap:70px;align-items:center}.emergencyPanel{min-height:440px;padding:36px;display:flex;align-items:center;flex-direction:column;justify-content:center;border:1px solid #ffffff36;border-radius:26px;background:#ffffff12;text-align:center}.emergencyPanel>span{font-size:10px;font-weight:900;letter-spacing:1.3px}.bracelet{margin:44px 0 35px;display:flex;align-items:center}.bracelet i{width:75px;height:30px;background:#fff}.bracelet div{width:105px;height:105px;display:grid;place-items:center;border-radius:24px;background:#fff;color:#1266e9;box-shadow:0 18px 45px #00378e55}.emergencyPanel h3{margin:0;font-size:24px}.emergencyPanel p{max-width:440px;color:#ffffffbd;font-size:13px;line-height:1.7}.privacyGrid{display:grid;grid-template-columns:120px 1fr .65fr;gap:35px;align-items:center}.privacyMark{width:100px;height:100px;display:grid;place-items:center;border-radius:28px;background:#1266e9;color:#fff}.privacyMark :global(svg){width:48px;height:48px}.privacyList{display:grid;gap:12px}.privacyList span{padding:14px;border:1px solid #dce6f4;border-radius:12px;color:#1266e9;font-size:12px;font-weight:850}.storeCta{padding:78px 0;background:#0c4fbd;color:#fff}.ctaInner{display:flex;align-items:center;justify-content:space-between;gap:35px}.ctaInner h2{margin:12px 0 0;font-size:38px}.ctaInner p{max-width:650px;color:#ffffffbf;font-size:13px;line-height:1.7}.ctaActions{display:flex;gap:9px;flex-wrap:wrap}.ctaActions a{background:#fff;color:#1266e9}.ctaActions a:last-child{border:1px solid #ffffff55;background:transparent;color:#fff}.finalCta{padding:58px 0;background:#1266e9;color:#fff}.finalInner{display:grid;grid-template-columns:80px 1fr auto;align-items:center;gap:25px}.finalQr{width:72px;height:72px;display:grid;place-items:center;border-radius:19px;background:#fff;color:#1266e9}.finalInner span{font-size:10px;font-weight:900;letter-spacing:1.3px}.finalInner h2{margin:5px 0 0;font-size:30px}.finalInner p{margin:7px 0 0;color:#ffffffbd;font-size:12px}.finalInner>a{background:#fff;color:#1266e9}footer{padding:55px 0 20px;background:#fff;color:#172b43}.footerTop{display:grid;grid-template-columns:240px 1fr auto;align-items:center;gap:30px}.footerBrand{display:flex;align-items:center;gap:10px}.footerBrand>div{width:45px;height:45px;display:grid;place-items:center;border-radius:12px;background:#1266e9;color:#fff}.footerBrand strong{font-size:15px}.footerBrand small{display:block;margin-top:3px;color:#8190a3;font-size:7px;letter-spacing:1px}.footerTop>p{max-width:430px;color:#6c7d91;font-size:12px}.footerTop nav,.footerBottom div{display:flex;gap:18px}.footerTop a,.footerBottom a{color:#1266e9;font-size:11px;font-weight:800;text-decoration:none}.footerBottom{margin-top:35px;padding-top:18px;display:flex;justify-content:space-between;border-top:1px solid #e2e8f0;color:#8492a5;font-size:10px}
        @media(max-width:1000px){.heroInner{grid-template-columns:1fr;max-width:760px}.heroVisual{max-width:560px;width:100%;margin:auto}.steps,.categoryGrid{grid-template-columns:repeat(2,1fr)}.splitGrid{grid-template-columns:1fr 1fr}.splitIntro{grid-column:1/-1}.emergencyGrid{grid-template-columns:1fr}.privacyGrid{grid-template-columns:100px 1fr}.privacyList{grid-column:1/-1;grid-template-columns:repeat(3,1fr)}.footerTop{grid-template-columns:1fr 1fr}.footerTop nav{grid-column:1/-1}}@media(max-width:700px){.shell,.heroInner{width:calc(100% - 24px)}.heroInner{min-height:auto;padding:60px 0}.hero h1{font-size:42px}.heroCopy>p{font-size:14px}.heroVisual{height:410px}.orbitOne{width:360px;height:360px}.orbitTwo{width:285px;height:285px}.tag{width:210px;height:290px}.floatCard{min-width:95px;padding:11px}.whiteSection,.blueSection,.splitSection,.emergencyWrap,.privacySection{padding:72px 0}.featureGrid,.splitGrid{grid-template-columns:1fr}.categoryGrid,.steps{grid-template-columns:1fr}.step{min-height:205px}.splitIntro{grid-column:auto}.roleCard{min-height:390px}.privacyGrid{grid-template-columns:1fr}.privacyList{grid-template-columns:1fr}.ctaInner{align-items:flex-start;flex-direction:column}.finalInner{grid-template-columns:65px 1fr}.finalInner>a{grid-column:1/-1}.footerTop{grid-template-columns:1fr}.footerTop nav{grid-column:auto;flex-wrap:wrap}.footerBottom{align-items:flex-start;flex-direction:column;gap:12px}}@media(max-width:460px){.hero h1{font-size:36px}.heroVisual{height:350px}.orbitOne{width:310px;height:310px}.orbitTwo{width:250px;height:250px}.tag{width:180px;height:250px;padding:18px}.qrBox{margin-top:25px;padding:10px}.qrBox :global(svg){width:70px;height:70px}.floatCard.safe{display:none}.floatCard.pet{left:-4px}.floatCard.keys{right:-4px}.ctaInner h2{font-size:31px}.finalInner h2{font-size:24px}.bracelet i{width:48px}}
      `}</style>
    </>
  );
}

function SectionHeader({ index, eyebrow, title, text, light=false }: { index:string; eyebrow:string; title:string; text:string; light?:boolean }) {
  return <div className={"sectionHeader " + (light ? "light" : "")}><span>{index} · {eyebrow}</span><div><h2>{title}</h2><p>{text}</p></div><style jsx>{`.sectionHeader>span{color:#1266e9;font-size:10px;font-weight:900;letter-spacing:1.4px}.sectionHeader>div{margin-top:12px;display:flex;justify-content:space-between;align-items:end;gap:35px}.sectionHeader h2{max-width:710px;margin:0;color:#172b43;font-size:clamp(30px,3.5vw,47px);line-height:1.08;letter-spacing:-1.7px}.sectionHeader p{max-width:400px;margin:0;color:#6b7e94;font-size:13px;line-height:1.7}.sectionHeader.light>span,.sectionHeader.light h2{color:#fff}.sectionHeader.light p{color:#ffffffbd}@media(max-width:700px){.sectionHeader>div{align-items:flex-start;flex-direction:column;gap:15px}}`}</style></div>
}

function Step({ n, icon, title, text }: { n:string; icon:string; title:string; text:string }) {
  return <article className="step"><div className="stepTop"><span>{n}</span><div className="stepIcon">{icon}</div></div><h3>{title}</h3><p>{text}</p></article>
}
