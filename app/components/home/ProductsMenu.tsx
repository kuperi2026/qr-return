"use client";

import { useState } from "react";

type Product = {
  id: "dog" | "cat" | "keys" | "wallet" | "bag" | "suitcase" | "emergency";
  icon: string;
  nameKa: string;
  nameEn: string;
  shortKa: string;
  shortEn: string;
  descriptionKa: string;
  descriptionEn: string;
  featuresKa: string[];
  featuresEn: string[];
};

const products: Product[] = [
  {
    id: "dog", icon: "🐶", nameKa: "ძაღლი", nameEn: "Dog",
    shortKa: "QR ტეგი ძაღლის საყელოსთვის", shortEn: "QR tag for a dog collar",
    descriptionKa: "დაკარგვის შემთხვევაში მპოვნელი ხედავს ძაღლის ამოსაცნობ ინფორმაციას და პატრონთან დაკავშირების მის მიერ არჩეულ გზებს.",
    descriptionEn: "If the dog is lost, the finder sees identifying details and the contact options selected by the owner.",
    featuresKa: ["ფოტო და ამოსაცნობი ნიშნები", "სამედიცინო და ქცევითი ინფორმაცია", "Lost ON და სწრაფი კავშირი"],
    featuresEn: ["Photo and identifying details", "Medical and behavior information", "Lost ON and fast contact"],
  },
  {
    id: "cat", icon: "🐱", nameKa: "კატა", nameEn: "Cat",
    shortKa: "QR ტეგი კატის საყელოსთვის", shortEn: "QR tag for a cat collar",
    descriptionKa: "ერთი სკანირებით მპოვნელი იღებს კატის უსაფრთხოდ დაბრუნებისთვის საჭირო, მფლობელის მიერ შერჩეულ ინფორმაციას.",
    descriptionEn: "One scan gives the finder the owner-selected information needed for a safe return.",
    featuresKa: ["ფოტო და ამოსაცნობი ნიშნები", "სამედიცინო და ქცევითი ინფორმაცია", "Lost ON და სწრაფი კავშირი"],
    featuresEn: ["Photo and identifying details", "Medical and behavior information", "Lost ON and fast contact"],
  },
  {
    id: "keys", icon: "🔑", nameKa: "გასაღები", nameEn: "Keys",
    shortKa: "სახლისა და მანქანის გასაღებისთვის", shortEn: "For home and car keys",
    descriptionKa: "მპოვნელს შეუძლია დაგიკავშირდეთ ისე, რომ გასაღებზე თქვენი პირადი მისამართის დატანა საჭირო არ იყოს.",
    descriptionEn: "The finder can contact you without requiring your private address to be printed on the keys.",
    featuresKa: ["ნივთის აღწერა", "მფლობელის შეტყობინება", "ზარი, Live Chat და ლოკაცია"],
    featuresEn: ["Item description", "Owner message", "Call, Live Chat and location"],
  },
  {
    id: "wallet", icon: "👛", nameKa: "საფულე", nameEn: "Wallet",
    shortKa: "QR ბარათი საფულისა და დოკუმენტებისთვის", shortEn: "QR card for wallets and documents",
    descriptionKa: "თხელი QR ბარათი მპოვნელს პირდაპირ საფულის დაბრუნებისთვის განკუთვნილ ციფრულ გვერდზე გადაიყვანს.",
    descriptionEn: "A slim QR card takes the finder directly to the digital return page for the wallet.",
    featuresKa: ["მფლობელის ინსტრუქცია", "არჩეული საკონტაქტო გზები", "Lost ON და Scan ინფორმაცია"],
    featuresEn: ["Owner instructions", "Selected contact options", "Lost ON and scan information"],
  },
  {
    id: "bag", icon: "👜", nameKa: "ჩანთა", nameEn: "Bag",
    shortKa: "ჩანთისა და ზურგჩანთისთვის", shortEn: "For bags and backpacks",
    descriptionKa: "ჩანთის ამოცნობისა და დაბრუნებისთვის საჭირო ინფორმაცია მფლობელის კონტროლით გამოჩნდება.",
    descriptionEn: "The information needed to identify and return the bag appears under the owner’s control.",
    featuresKa: ["ფოტო და აღწერა", "მფლობელის მითითება", "კავშირი და ნებაყოფლობითი ლოკაცია"],
    featuresEn: ["Photo and description", "Owner instructions", "Contact and voluntary location"],
  },
  {
    id: "suitcase", icon: "🧳", nameKa: "ჩემოდანი", nameEn: "Suitcase",
    shortKa: "ჩემოდნისა და სამგზავრო ბარგისთვის", shortEn: "For suitcases and travel luggage",
    descriptionKa: "მოგზაურობისას დაკარგული ბარგის მპოვნელს მფლობელთან დაკავშირების მარტივი და უსაფრთხო გზა ექნება.",
    descriptionEn: "A finder of lost luggage gets a simple and secure way to contact its owner while travelling.",
    featuresKa: ["ბარგის ამოსაცნობი დეტალები", "მფლობელის შეტყობინება", "Scan ისტორია და უსაფრთხო კავშირი"],
    featuresEn: ["Luggage identification details", "Owner message", "Scan history and secure contact"],
  },
  {
    id: "emergency", icon: "✚", nameKa: "Emergency", nameEn: "Emergency",
    shortKa: "სამაჯური ადამიანის უსაფრთხოებისთვის", shortEn: "Bracelet for personal safety",
    descriptionKa: "საჭირო დროს სამაჯურის სკანირება აჩვენებს პროფილის მმართველის მიერ წინასწარ შერჩეულ მნიშვნელოვან ინფორმაციასა და Emergency კონტაქტებს.",
    descriptionEn: "When needed, scanning the bracelet shows important information and emergency contacts selected by the profile manager.",
    featuresKa: ["პროფილი საკუთარი ან მესამე პირისთვის", "ჯანმრთელობის მნიშვნელოვანი ინფორმაცია", "Emergency კონტაქტები"],
    featuresEn: ["Profile for yourself or another person", "Important medical information", "Emergency contacts"],
  },
];

export default function ProductsMenu({ ka }: { ka: boolean }) {
  const [selectedId, setSelectedId] = useState<Product["id"]>("dog");
  const selected = products.find((product) => product.id === selectedId) ?? products[0];
  const features = ka ? selected.featuresKa : selected.featuresEn;

  return (
    <section className="productsMenu">
      <div className="productsInner">
        <div className="menuHeading">
          <span>QR RETURN · PRODUCTS</span>
          <h2>{ka ? "შვიდი პროდუქტი — ერთი დაცული სისტემა." : "Seven products — one secure system."}</h2>
          <p>{ka ? "აირჩიეთ კატეგორია და ნახეთ პროდუქტის დანიშნულება და შესაძლებლობები." : "Choose a category to see its purpose and capabilities."}</p>
        </div>

        <div className="productLayout">
          <div className="productList" role="tablist" aria-label={ka ? "პროდუქტები" : "Products"}>
            {products.map((product) => {
              const active = product.id === selected.id;
              return (
                <button key={product.id} type="button" role="tab" aria-selected={active} className={active ? "active" : ""} onClick={() => setSelectedId(product.id)}>
                  <span>{product.icon}</span>
                  <strong>{ka ? product.nameKa : product.nameEn}</strong>
                  <small>{ka ? product.shortKa : product.shortEn}</small>
                </button>
              );
            })}
          </div>

          <article className="productDetail">
            <div className="productImage">
              <img src={`/products/models/${selected.id}.png`} alt={`${ka ? selected.nameKa : selected.nameEn} QR RETURN`} />
            </div>
            <div className="productCopy">
              <span>{ka ? selected.shortKa : selected.shortEn}</span>
              <h3>{ka ? selected.nameKa : selected.nameEn}</h3>
              <p>{ka ? selected.descriptionKa : selected.descriptionEn}</p>
              <ul>{features.map((feature) => <li key={feature}>✓ <b>{feature}</b></li>)}</ul>
              <div className="productLinks">
                <a href="/store">{ka ? "მაღაზიაში ნახვა" : "View in store"} →</a>
                <a href="/signup?next=%2Fstore">{ka ? "რეგისტრაცია" : "Register"}</a>
              </div>
            </div>
          </article>
        </div>
      </div>

      <style jsx>{`
        .productsMenu{position:relative;z-index:90;border-bottom:1px solid #d9e5f0;background:#f6f9fc;box-shadow:0 22px 50px rgba(5,42,80,.16)}
        .productsInner{width:calc(100% - 80px);max-width:1280px;margin:auto;padding:30px 0 34px}.menuHeading{text-align:center}.menuHeading>span{color:#0a5aaa;font-size:9px;font-weight:900;letter-spacing:1.4px}.menuHeading h2{margin:7px 0 0;color:#063b72;font-size:27px;letter-spacing:-.6px}.menuHeading p{margin:7px 0 0;color:#60768b;font-size:12px}
        .productLayout{margin-top:23px;display:grid;grid-template-columns:1fr 1.22fr;gap:18px}.productList{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}.productList button{min-height:76px;padding:12px;display:grid;grid-template-columns:32px 1fr;grid-template-rows:auto auto;column-gap:9px;align-content:center;border:1px solid #d7e3ee;border-radius:13px;background:#fff;color:#183f64;text-align:left;cursor:pointer;font-family:inherit;transition:.18s ease}.productList button:hover,.productList button.active{border-color:#0a5aaa;box-shadow:0 8px 22px rgba(6,59,114,.11);transform:translateY(-1px)}.productList button.active{background:#063b72;color:#fff}.productList button>span{grid-row:1/3;align-self:center;font-size:21px}.productList strong{font-size:13px}.productList small{margin-top:3px;color:#71859a;font-size:9px;line-height:1.3}.productList button.active small{color:rgba(255,255,255,.72)}
        .productDetail{min-height:332px;padding:16px;display:grid;grid-template-columns:.72fr 1fr;gap:22px;border:1px solid #d7e3ee;border-radius:17px;background:#fff}.productImage{min-height:290px;overflow:hidden;border-radius:12px;background:#eef3f7}.productImage img{width:100%;height:100%;object-fit:contain}.productCopy{padding:10px 9px 8px 0;color:#063b72}.productCopy>span{color:#6c8399;font-size:9px;font-weight:900;letter-spacing:.6px}.productCopy h3{margin:7px 0 9px;font-size:31px;letter-spacing:-1px}.productCopy p{margin:0;color:#496983;font-size:12px;line-height:1.65}.productCopy ul{margin:15px 0 0;padding:0;list-style:none}.productCopy li{padding:7px 0;border-top:1px solid #e3ebf2;color:#0a5aaa;font-size:10px}.productCopy li b{margin-left:6px;color:#234968}.productLinks{margin-top:14px;display:flex;gap:8px;flex-wrap:wrap}.productLinks a{min-height:40px;padding:0 15px;display:flex;align-items:center;border:1px solid #063b72;border-radius:9px;color:#fff;background:#063b72;font-size:10px;font-weight:900;text-decoration:none}.productLinks a:last-child{color:#063b72;background:#fff}
        @media(max-width:900px){.productsInner{width:calc(100% - 34px)}.productLayout{grid-template-columns:1fr}.productList{grid-template-columns:repeat(4,1fr)}.productList button{grid-template-columns:1fr;text-align:center}.productList button>span{grid-row:auto}.productList small{display:none}}
        @media(max-width:620px){.productsInner{width:calc(100% - 24px);padding:24px 0}.menuHeading h2{font-size:23px}.productList{display:flex;overflow-x:auto;padding-bottom:5px}.productList button{min-width:116px;min-height:68px}.productDetail{grid-template-columns:1fr;padding:12px}.productImage{min-height:210px;height:210px}.productCopy{padding:5px}.productCopy h3{font-size:27px}}
      `}</style>
    </section>
  );
}
