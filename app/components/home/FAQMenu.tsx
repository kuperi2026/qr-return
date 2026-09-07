"use client";

const FAQ_KA = [
  ["რა არის QR RETURN?", "QR RETURN არის QR-ზე დაფუძნებული სისტემა ნივთების, ცხოველების, ავტომობილებისა და Emergency პროფილებისთვის. QR კოდის დასკანერების შემდეგ მპოვნელს შეუძლია უსაფრთხოდ დაუკავშირდეს მფლობელს."],
  ["სჭირდება მპოვნელს რეგისტრაცია ან აპლიკაცია?", "არა. მპოვნელს არ სჭირდება რეგისტრაცია ან აპლიკაციის ჩამოტვირთვა — საკმარისია QR კოდის დასკანერება ნებისმიერი სმარტფონით."],
  ["ვინ განსაზღვრავს ხილულ ინფორმაციას?", "პროფილის მფლობელი თავად ირჩევს, რომელი დამატებითი ინფორმაცია გამოჩნდეს QR კოდის დასკანერებისას. სავალდებულო საკონტაქტო ინფორმაცია უზრუნველყოფს უსაფრთხო და რეალურ კავშირს."],
  ["შეიძლება რამდენიმე QR პროფილის მართვა?", "დიახ. ერთი ანგარიშიდან შეგიძლიათ მართოთ ყველა თქვენი QR RETURN პროდუქტი და განაახლოთ მათი ინფორმაცია ნებისმიერ დროს."],
  ["რა არის Lost Mode?", "Lost Mode პროფილს ანიჭებს სტატუსს „დაიკარგა“. მისი გააქტიურების შემდეგ მპოვნელი ხედავს თქვენს შეტყობინებას და თქვენ იღებთ ინფორმაციას QR კოდის დასკანერების შესახებ."],
  ["შეუძლია მპოვნელს ლოკაციის გაზიარება?", "დიახ. მპოვნელს შეუძლია სურვილის შემთხვევაში ერთი მოქმედებით გამოგიგზავნოთ ზუსტი ლოკაცია. ლოკაცია მისი თანხმობის გარეშე არ იგზავნება."],
  ["როგორ დამიკავშირდება მპოვნელი?", "პროფილის პარამეტრების მიხედვით, მპოვნელს შეუძლია დაგიკავშირდეთ ზარით ან QR RETURN-ის დაცული ჩატით."],
  ["შეიძლება QR კოდის სხვა პროდუქტზე გადატანა?", "შეგიძლიათ პროფილის მონაცემები განაახლოთ და QR კოდი იმავე კატეგორიის სხვა პროდუქტს დაუკავშიროთ. კატეგორიის შეცვლა რეგისტრაციის შემდეგ შეუძლებელია."],
  ["რატომ არ იცვლება პროდუქტის კატეგორია?", "კატეგორია პირველადი რეგისტრაციისას ფიქსირდება, რათა თითოეული QR კოდი სწორ პროგრამასა და შესაბამის მონაცემთა სტრუქტურას დაუკავშირდეს."],
  ["შეიძლება დამატებითი ადმინისტრატორის დამატება?", "დიახ. ერთ პროდუქტზე შეგიძლიათ დაამატოთ ერთი სანდო ადმინისტრატორი და თავად განსაზღვროთ, რომელი ფუნქციების მართვის უფლება ექნება."],
  ["რით განსხვავდება Emergency პროფილი?", "Emergency პროფილი განკუთვნილია გადაუდებელი შემთხვევებისთვის და შეიძლება მოიცავდეს სისხლის ჯგუფს, მნიშვნელოვან სამედიცინო ინფორმაციასა და Emergency Contact-ს."],
  ["როგორ მივიღო დახმარება?", "QR RETURN-ის მხარდაჭერა ხელმისაწვდომია ჩატით. ასევე შეგიძლიათ საიტიდან დაჯავშნოთ სატელეფონო ზარი და მიუთითოთ საკითხი, რომელზეც დახმარება გჭირდებათ."],
];

const FAQ_EN = [
  ["What is QR RETURN?", "QR RETURN is a QR-based system for belongings, pets, vehicles and Emergency profiles. A finder can scan the code and contact the owner safely."],
  ["Does the finder need an account or an app?", "No. A finder only needs to scan the QR code with any smartphone."],
  ["Who controls the visible information?", "The profile owner chooses which additional information is visible after a scan."],
  ["Can I manage multiple QR profiles?", "Yes. You can manage all QR RETURN products from one account and update them at any time."],
  ["What is Lost Mode?", "Lost Mode marks a profile as lost, displays your finder message and lets you receive scan information."],
  ["Can a finder share their location?", "Yes. A finder may voluntarily share their precise location with one action."],
  ["How can a finder contact me?", "Depending on your settings, a finder can call you or use QR RETURN's protected chat."],
  ["Can I move a QR code to another product?", "You can update the profile for another product in the same category. The category cannot be changed after registration."],
  ["Why is the category locked?", "The category is fixed at registration so each QR code remains connected to the correct program and data structure."],
  ["Can I add another administrator?", "Yes. You can add one trusted administrator per product and choose which permissions to delegate."],
  ["What makes an Emergency profile different?", "It is designed for urgent situations and can include blood type, important medical details and an emergency contact."],
  ["How can I get support?", "Use the support chat or book a call through the website and tell us what you need help with."],
];

export default function FAQMenu({ ka }: { ka: boolean }) {
  const items = ka ? FAQ_KA : FAQ_EN;
  return (
    <section id="faq" className="faqSection">
      <div className="faqWrap">
        <header>
          <span>03 · FAQ</span>
          <h2>{ka ? "ხშირად დასმული კითხვები" : "Frequently Asked Questions"}</h2>
          <p>{ka ? "დააჭირეთ კითხვას პასუხის სანახავად." : "Select a question to view the answer."}</p>
          <a href="/support">{ka ? "სხვა კითხვა გაქვს? მოგვწერე" : "Have another question? Contact us"}<b>→</b></a>
        </header>

        <div className="faqList">
          {items.map(([question, answer], index) => (
            <details key={question} open={index === 0}>
              <summary><span>{String(index + 1).padStart(2, "0")}</span><strong>{question}</strong><b>+</b></summary>
              <div><p>{answer}</p></div>
            </details>
          ))}
        </div>
      </div>

      <style jsx>{`
        .faqSection{padding:82px 40px 92px;background:#f5f8fc;color:#1d3651;font-family:Arial,Helvetica,sans-serif}.faqWrap{width:100%;max-width:1160px;margin:auto;display:grid;grid-template-columns:.72fr 1.28fr;gap:76px;align-items:start}header{position:sticky;top:26px}header>span{color:#0d61c4;font-size:10px;font-weight:900;letter-spacing:1.5px}h2{max-width:370px;margin:11px 0 0;font-size:clamp(30px,3.7vw,45px);line-height:1.12;letter-spacing:-1.3px}header p{margin:14px 0 0;color:#748497;font-size:13px}header a{width:fit-content;margin-top:28px;padding-bottom:7px;display:flex;align-items:center;gap:18px;border-bottom:2px solid #d93449;color:#173653;font-size:12px;font-weight:900;text-decoration:none}header a b{color:#d93449;font-size:18px}.faqList{border-top:1px solid #cedae7}.faqList details{border-bottom:1px solid #cedae7;background:transparent}.faqList summary{min-height:72px;padding:0 4px;display:grid;grid-template-columns:38px 1fr 34px;align-items:center;gap:13px;cursor:pointer;list-style:none}.faqList summary::-webkit-details-marker{display:none}.faqList summary>span{color:#8b9aad;font-size:10px;font-weight:900}.faqList summary strong{font-size:15px;line-height:1.45}.faqList summary b{width:30px;height:30px;display:grid;place-items:center;border-radius:50%;background:#e5eef9;color:#0d61c4;font-size:19px;transition:transform .2s ease,background .2s ease}.faqList details[open] summary b{transform:rotate(45deg);background:#0d61c4;color:#fff}.faqList details div{padding:0 48px 22px 55px}.faqList details p{max-width:660px;margin:0;color:#687b90;font-size:13px;line-height:1.75;animation:reveal .2s ease-out}@keyframes reveal{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
        @media(max-width:800px){.faqSection{padding:60px 18px 70px}.faqWrap{grid-template-columns:1fr;gap:38px}header{position:static}h2{max-width:none}.faqList summary{min-height:68px;grid-template-columns:30px 1fr 30px;gap:9px}.faqList summary strong{font-size:14px}.faqList details div{padding:0 36px 20px 39px}}
      `}</style>
    </section>
  );
}
