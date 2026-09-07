"use client";

const itemsKa = [
  ["◆", "რა არის QR RETURN?", "QR RETURN არის QR-ზე დაფუძნებული სისტემა ნივთების, ცხოველების, ავტომობილებისა და Emergency პროფილებისთვის. მპოვნელს შეუძლია უსაფრთხოდ დაუკავშირდეს მფლობელს."],
  ["▣", "სჭირდება მპოვნელს რეგისტრაცია ან აპლიკაცია?", "არა. საკმარისია QR კოდის დასკანერება ნებისმიერი სმარტფონით."],
  ["◉", "ვინ განსაზღვრავს ხილულ ინფორმაციას?", "პროფილის მფლობელი თავად ირჩევს, რომელი დამატებითი ინფორმაცია გამოჩნდეს QR კოდის დასკანერებისას."],
  ["∞", "შეიძლება რამდენიმე QR პროფილის მართვა?", "დიახ. ერთი ანგარიშიდან შეგიძლიათ მართოთ ყველა თქვენი QR RETURN პროდუქტი და ნებისმიერ დროს განაახლოთ ინფორმაცია."],
  ["!", "რა არის Lost Mode?", "Lost Mode პროფილს ანიჭებს სტატუსს „დაიკარგა“, მპოვნელს აჩვენებს თქვენს შეტყობინებას და გაწვდით სკანირების ინფორმაციას."],
  ["⌖", "შეუძლია მპოვნელს ლოკაციის გაზიარება?", "დიახ. მპოვნელს შეუძლია საკუთარი სურვილით გამოგიგზავნოთ ზუსტი ლოკაცია. მდებარეობა თანხმობის გარეშე არ იგზავნება."],
  ["✆", "როგორ დამიკავშირდება მპოვნელი?", "პროფილის პარამეტრების მიხედვით, მპოვნელს შეუძლია დაგიკავშირდეთ ზარით ან QR RETURN-ის დაცული ჩატით."],
  ["↻", "შეიძლება QR კოდის სხვა პროდუქტზე გადატანა?", "შეგიძლიათ QR კოდი იმავე კატეგორიის სხვა პროდუქტს დაუკავშიროთ. კატეგორიის შეცვლა რეგისტრაციის შემდეგ შეუძლებელია."],
  ["▤", "რატომ არ იცვლება პროდუქტის კატეგორია?", "კატეგორია რეგისტრაციისას ფიქსირდება, რათა QR კოდი სწორ პროგრამასა და შესაბამის მონაცემებთან დარჩეს დაკავშირებული."],
  ["♙", "შეიძლება დამატებითი ადმინისტრატორის დამატება?", "დიახ. ერთ პროდუქტზე შეგიძლიათ დაამატოთ ერთი სანდო ადმინისტრატორი და თავად განსაზღვროთ მისი უფლებები."],
  ["+", "რით განსხვავდება Emergency პროფილი?", "Emergency პროფილი განკუთვნილია გადაუდებელი შემთხვევებისთვის და შეიძლება მოიცავდეს სისხლის ჯგუფს, სამედიცინო ინფორმაციასა და Emergency Contact-ს."],
  ["?", "როგორ მივიღო დახმარება?", "გამოიყენეთ მხარდაჭერის ჩატი ან დაჯავშნეთ სატელეფონო ზარი და მიუთითეთ საკითხი, რომელზეც დახმარება გჭირდებათ."],
];

const itemsEn = [
  ["◆", "What is QR RETURN?", "QR RETURN is a QR-based system for belongings, pets, vehicles and Emergency profiles. A finder can contact the owner safely."],
  ["▣", "Does the finder need an account or an app?", "No. The finder only needs to scan the QR code with any smartphone."],
  ["◉", "Who controls the visible information?", "The profile owner chooses which additional information appears after a QR scan."],
  ["∞", "Can I manage multiple QR profiles?", "Yes. Manage every QR RETURN product from one account and update information at any time."],
  ["!", "What is Lost Mode?", "Lost Mode marks the profile as lost, displays your message and provides scan information."],
  ["⌖", "Can a finder share their location?", "Yes. A finder can voluntarily share their precise location. It is never sent without consent."],
  ["✆", "How can a finder contact me?", "Depending on profile settings, a finder can call you or use QR RETURN's protected chat."],
  ["↻", "Can I move a QR code to another product?", "You can connect it to another product in the same category. The category cannot change after registration."],
  ["▤", "Why is the product category locked?", "The category is fixed so the QR code stays connected to the correct program and data structure."],
  ["♙", "Can I add another administrator?", "Yes. Add one trusted administrator per product and choose which permissions to delegate."],
  ["+", "What makes an Emergency profile different?", "It can include blood type, essential medical information and an emergency contact for urgent situations."],
  ["?", "How can I get support?", "Use support chat or book a call and tell us what you need help with."],
];

export default function ProductInfoMenu({ ka }: { ka: boolean }) {
  const items = ka ? itemsKa : itemsEn;
  return (
    <section className="productInfoMenu">
      <div className="menuInner">
        <div className="menuHeading">
          <span>PRODUCT INFORMATION</span>
          <h2>{ka ? "ხშირად დასმული კითხვები" : "Frequently Asked Questions"}</h2>
          <p>{ka ? "ყველაფერი, რაც QR RETURN-ის გამოყენებამდე უნდა იცოდეთ." : "Everything you need to know before using QR RETURN."}</p>
        </div>
        <div className="infoGrid">
          {items.map(([icon, title, text]) => (
            <article key={title}>
              <span aria-hidden="true">{icon}</span>
              <p><strong>{title}</strong>{text}</p>
            </article>
          ))}
        </div>
        <div className="links">
          <a href="/book-call">📞 {ka ? "ზარის დაჯავშნა" : "Book a call"}</a>
          <a href="/support">💬 {ka ? "ჩატი" : "Chat"}</a>
        </div>
      </div>
      <style jsx>{`
        .productInfoMenu{position:relative;z-index:90;padding:24px 32px 28px;border-bottom:1px solid #dce6ef;background:#fff;color:#1c324d;box-shadow:0 18px 35px rgba(0,35,70,.13)}.menuInner{max-width:1260px;margin:auto}.menuHeading span{color:#1266e9;font-size:9px;font-weight:900;letter-spacing:1.3px}.menuHeading h2{margin:5px 0 0;font-size:23px}.menuHeading p{margin:5px 0 15px;color:#708196;font-size:11px}.infoGrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px}.infoGrid article{padding:12px;display:grid;grid-template-columns:28px 1fr;gap:8px;border:1px solid #e1e8ef;border-radius:13px;background:#f8fbff}.infoGrid article>span{width:27px;height:27px;display:grid;place-items:center;border-radius:8px;background:#e8f2ff;color:#1266e9;font-size:13px;font-weight:900}.infoGrid p{margin:0;color:#60758a;font-size:11px;line-height:1.45}.infoGrid strong{display:block;margin-bottom:3px;color:#174f85;font-size:11px;line-height:1.35}.links{margin-top:11px;display:flex;gap:8px}.links a{padding:9px 13px;border-radius:9px;color:#fff;background:#0a4c8a;font-size:11px;font-weight:900;text-decoration:none}.links a:last-child{background:#d93449}@media(max-width:1000px){.infoGrid{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:760px){.productInfoMenu{padding:20px 14px}.infoGrid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:520px){.infoGrid{grid-template-columns:1fr}.links{flex-direction:column}.links a{text-align:center}}
      `}</style>
    </section>
  );
}
