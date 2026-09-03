"use client";

import { useState } from "react";

type ProductKind = "dog" | "cat" | "keys" | "wallet" | "bag" | "suitcase" | "parking" | "emergency";

type ProductInfo = {
  icon: string;
  name: string;
  items: Array<[string, string, string]>;
};

const shared = {
  noApp: ["📱", "აპლიკაციის გარეშე:", "მპოვნელს არ სჭირდება აპლიკაცია ან რეგისტრაცია. საკმარისია QR კოდის დასკანერება ნებისმიერი მობილურიდან."] as [string, string, string],
  privacy: ["🔒", "კონფიდენციალურობის სრული კონტროლი:", "სავალდებულო ინფორმაციის მითითების შემდეგ, თავად წყვეტთ, რომელი დამატებითი ინფორმაცია გამოუჩნდეს მპოვნელს სკანირების შედეგად."] as [string, string, string],
  lost: ["🚨", "Lost Mode:", "ამ ფუნქციის საშუალებით თავად აკონტროლებთ, როდის გაააქტიუროთ პროფილი და მიანიჭოთ სტატუსი „დაიკარგა“. სკანირების შესახებ ინფორმაციას მიიღებთ ჩათში. მპოვნელს სურვილის შემთხვევაში შეუძლია ლოკაციის გაზიარება."] as [string, string, string],
  admin: ["👥", "ადმინისტრატორის დელეგირება:", "პროფილის მართვის ველში ერთ პროდუქტზე შეგიძლიათ დაამატოთ ერთი დამატებითი ადმინისტრატორი და თავად გადაწყვიტოთ, რომელი ფუნქციების მართვას ანდობთ."] as [string, string, string],
  support: ["📞", "24/7 მხარდაჭერა & შეძენა:", "ჩვენი გუნდი მუდამ თქვენს სამსახურშია. შეგიძლიათ საიტიდან დაჯავშნოთ ზარი, მოგვწეროთ ონლაინ ჩათის საშუალებით ან დაგვიკავშირდეთ ცხელ ხაზზე."] as [string, string, string],
};

const productInfo: Record<ProductKind, ProductInfo> = {
  dog: { icon: "🐶", name: "ძაღლი", items: [
    ["⚡", "სწრაფი & მარტივი რეგისტრაცია:", "შექმენით ანგარიში, აირჩიეთ ძაღლის პროფილი და მიუთითეთ საჭირო ინფორმაცია."], shared.noApp, shared.privacy, shared.lost, shared.admin,
    ["🔄", "პროფილის რედაქტირება:", "პროფილის რედაქტირება ნებისმიერ დროს შეგიძლიათ. ძაღლის პროფილი შეგიძლიათ სხვა ძაღლის მონაცემებით ჩაანაცვლოთ. პროდუქტის კატეგორია არ იცვლება."], shared.support,
  ]},
  cat: { icon: "🐱", name: "კატა", items: [
    ["⚡", "სწრაფი & მარტივი რეგისტრაცია:", "შექმენით ანგარიში, აირჩიეთ კატის პროფილი და მიუთითეთ საჭირო ინფორმაცია."], shared.noApp, shared.privacy, shared.lost, shared.admin,
    ["🔄", "პროფილის რედაქტირება:", "პროფილის რედაქტირება ნებისმიერ დროს შეგიძლიათ. კატის პროფილი შეგიძლიათ სხვა კატის მონაცემებით ჩაანაცვლოთ. პროდუქტის კატეგორია არ იცვლება."], shared.support,
  ]},
  keys: { icon: "🔑", name: "გასაღები", items: [
    ["⚡", "სწრაფი & მარტივი რეგისტრაცია:", "შექმენით ანგარიში, აირჩიეთ გასაღების პროფილი და მიუთითეთ საჭირო ინფორმაცია."], shared.noApp, shared.privacy, shared.lost, shared.admin,
    ["🔄", "პროფილის რედაქტირება:", "პროფილის რედაქტირება ნებისმიერ დროს შეგიძლიათ. პროფილი შეგიძლიათ სხვა გასაღების მონაცემებით ჩაანაცვლოთ. პროდუქტის კატეგორია არ იცვლება."], shared.support,
  ]},
  wallet: { icon: "👛", name: "საფულე", items: [
    ["⚡", "სწრაფი & მარტივი რეგისტრაცია:", "შექმენით ანგარიში, აირჩიეთ საფულის პროფილი და მიუთითეთ საჭირო ინფორმაცია."], shared.noApp, shared.privacy, shared.lost, shared.admin,
    ["🔄", "პროფილის რედაქტირება:", "პროფილის რედაქტირება ნებისმიერ დროს შეგიძლიათ. პროფილი შეგიძლიათ სხვა საფულის მონაცემებით ჩაანაცვლოთ. პროდუქტის კატეგორია არ იცვლება."], shared.support,
  ]},
  bag: { icon: "🎒", name: "ჩანთა", items: [
    ["⚡", "სწრაფი & მარტივი რეგისტრაცია:", "შექმენით ანგარიში, აირჩიეთ ჩანთის პროფილი და მიუთითეთ საჭირო ინფორმაცია."], shared.noApp, shared.privacy, shared.lost, shared.admin,
    ["🔄", "პროფილის რედაქტირება:", "პროფილის რედაქტირება ნებისმიერ დროს შეგიძლიათ. პროფილი შეგიძლიათ სხვა ჩანთის მონაცემებით ჩაანაცვლოთ. პროდუქტის კატეგორია არ იცვლება."], shared.support,
  ]},
  suitcase: { icon: "🧳", name: "ჩემოდანი", items: [
    ["⚡", "სწრაფი & მარტივი რეგისტრაცია:", "შექმენით ანგარიში, აირჩიეთ ჩემოდნის პროფილი და მიუთითეთ საჭირო ინფორმაცია."], shared.noApp, shared.privacy, shared.lost, shared.admin,
    ["🔄", "პროფილის რედაქტირება:", "პროფილის რედაქტირება ნებისმიერ დროს შეგიძლიათ. პროფილი შეგიძლიათ სხვა ჩემოდნის მონაცემებით ჩაანაცვლოთ. პროდუქტის კატეგორია არ იცვლება."], shared.support,
  ]},
  parking: { icon: "🚘", name: "Parking", items: [
    ["⚡", "სწრაფი & მარტივი რეგისტრაცია:", "შექმენით ანგარიში, აირჩიეთ Parking პროფილი და მიუთითეთ ავტომობილთან დაკავშირებული საჭირო ინფორმაცია."], shared.noApp, shared.privacy,
    ["🚘", "სწრაფი კავშირი მძღოლთან:", "QR კოდის დასკანერების შემდეგ სხვა მძღოლს ან გამვლელს შეუძლია სწრაფად დაგიკავშირდეთ თქვენ მიერ არჩეული საშუალებით."], shared.admin,
    ["🔄", "პროფილის რედაქტირება:", "პროფილის რედაქტირება ნებისმიერ დროს შეგიძლიათ. პროფილი შეგიძლიათ სხვა ავტომობილის მონაცემებით ჩაანაცვლოთ. პროდუქტის კატეგორია არ იცვლება."], shared.support,
  ]},
  emergency: { icon: "🆘", name: "Emergency", items: [
    ["⚡", "სწრაფი & მარტივი რეგისტრაცია:", "შექმენით ანგარიში, აირჩიეთ Emergency პროფილი და მიუთითეთ აუცილებელი პირადი, სამედიცინო და საკონტაქტო ინფორმაცია."], shared.noApp, shared.privacy,
    ["🛡️", "Emergency პროფილის ხელმისაწვდომობა:", "თავად აკონტროლებთ პროფილის ხელმისაწვდომობას და იმას, თუ რა ინფორმაციას ნახავს დამსკანერებელი."], shared.admin,
    ["🔄", "პროფილის რედაქტირება:", "სამედიცინო და საკონტაქტო ინფორმაციის განახლება ნებისმიერ დროს შეგიძლიათ. ერთხელ გააქტიურებული Emergency პროფილი სხვა ადამიანზე არ გადადის."], shared.support,
  ]},
};

const order = Object.keys(productInfo) as ProductKind[];

export default function ProductInfoSection() {
  const [selected, setSelected] = useState<ProductKind>("dog");
  const current = productInfo[selected];

  return (
    <section className="infoSection">
      <div className="heading">
        <span>PRODUCT INFORMATION</span>
        <h2>პროდუქტების შესახებ</h2>
        <p>აირჩიეთ პროდუქტი და გაეცანით მის მთავარ შესაძლებლობებსა და უპირატესობებს.</p>
      </div>

      <div className="selector" role="tablist" aria-label="QR RETURN პროდუქტები">
        {order.map((kind) => (
          <button key={kind} type="button" role="tab" aria-selected={selected === kind} className={selected === kind ? "active" : ""} onClick={() => setSelected(kind)}>
            <span aria-hidden="true">{productInfo[kind].icon}</span>{productInfo[kind].name}
          </button>
        ))}
      </div>

      <article className="details" role="tabpanel">
        <div className="detailsTitle"><span aria-hidden="true">{current.icon}</span><div><small>QR RETURN · {current.name}</small><h3>მთავარი შესაძლებლობები &amp; უპირატესობები</h3></div></div>
        <ul>{current.items.map(([icon, title, text]) => <li key={title}><span className="itemIcon" aria-hidden="true">{icon}</span><p><strong>{title}</strong>{text}</p></li>)}</ul>
      </article>

      <style jsx>{`
        .infoSection{width:calc(100% - 36px);max-width:1180px;margin:70px auto 0}.heading span,.detailsTitle small{color:#1266e9;font-size:10px;font-weight:900;letter-spacing:1.25px}.heading h2{margin:8px 0 0;color:#1c324d;font-size:30px}.heading p{max-width:650px;margin:10px 0 0;color:#718095;font-size:14px;line-height:1.65}.selector{margin-top:28px;display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:9px}.selector button{min-height:76px;padding:10px 6px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;border:1px solid #dce5ef;border-radius:14px;color:#52677c;background:#fff;font-family:inherit;font-size:12px;font-weight:850;cursor:pointer;transition:.2s ease}.selector button>span{font-size:21px}.selector button:hover,.selector button.active{border-color:#1266e9;color:#0d5bd0;background:#edf5ff;box-shadow:0 8px 22px rgba(18,102,233,.1);transform:translateY(-2px)}.details{margin-top:18px;padding:30px;border:1px solid #dce5ef;border-radius:22px;background:linear-gradient(145deg,#fff,#f5f9fe);box-shadow:0 18px 48px rgba(34,67,103,.09)}.detailsTitle{display:flex;align-items:center;gap:16px;padding-bottom:22px;border-bottom:1px solid #e1e8ef}.detailsTitle>span{width:52px;height:52px;display:grid;place-items:center;border-radius:15px;background:#eaf3ff;font-size:27px}.detailsTitle h3{margin:5px 0 0;color:#1f3f60;font-size:22px}.details ul{margin:24px 0 0;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;list-style:none}.details li{min-height:112px;padding:17px;display:grid;grid-template-columns:38px 1fr;gap:12px;border:1px solid #e2e9f0;border-radius:16px;background:#fff}.itemIcon{width:38px;height:38px;display:grid;place-items:center;border-radius:12px;background:#edf5ff;font-size:19px}.details p{margin:0;color:#5f7387;font-size:14px;line-height:1.62}.details strong{display:block;margin-bottom:4px;color:#174f85;font-size:14px}.details li:last-child{grid-column:1/-1;min-height:auto}.details li:last-child strong{color:#d93449}@media(max-width:900px){.selector{grid-template-columns:repeat(4,1fr)}.details ul{grid-template-columns:1fr}.details li:last-child{grid-column:auto}}@media(max-width:560px){.infoSection{margin-top:46px}.selector{grid-template-columns:repeat(2,1fr)}.details{padding:20px 15px}.detailsTitle h3{font-size:19px}.details li{padding:14px}.heading h2{font-size:26px}}
      `}</style>
    </section>
  );
}
