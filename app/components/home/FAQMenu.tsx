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
      <details className="faqGroup">
        <summary>{ka ? "ხშირად დასმული კითხვები" : "Frequently Asked Questions"}<span aria-hidden="true">+</span></summary>
        <div className="faqList">
          {items.map(([question, answer]) => (
            <details key={question}>
              <summary>{question}<span aria-hidden="true">+</span></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </details>
      <style jsx>{`
        .faqSection{width:100%;max-width:1160px;margin:28px auto 0;color:#fff;font-family:Arial,Helvetica,sans-serif}
        summary{list-style:none;cursor:pointer}summary::-webkit-details-marker{display:none}
        .faqGroup{border-top:1px solid #303b48;border-bottom:1px solid #303b48}
        .faqGroup>summary{min-height:60px;display:flex;justify-content:space-between;align-items:center;gap:20px;font-size:15px;font-weight:800}
        summary span{width:26px;height:26px;display:grid;place-items:center;flex:none;border:1px solid #506273;border-radius:50%;font-size:17px;font-weight:400}
        details[open]>summary>span{transform:rotate(45deg)}
        .faqList{padding:0 0 18px}.faqList details{border-top:1px solid #303b48}
        .faqList summary{min-height:48px;display:flex;align-items:center;justify-content:space-between;gap:18px;color:#dbe4ef;font-size:13px;line-height:1.4}
        .faqList p{max-width:800px;margin:0;padding:0 34px 17px 0;color:#aab7c5;font-size:12px;line-height:1.65}
        @media(max-width:540px){.faqSection{margin-top:28px}.faqGroup>summary{font-size:14px}.faqList summary{font-size:12px}}
      `}</style>
    </section>
  );
}
