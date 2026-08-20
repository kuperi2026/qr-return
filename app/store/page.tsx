"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Lang = "ka" | "en";
type ProductId = "tag" | "sticker";

type Product = {
  id: ProductId;
  nameKa: string;
  nameEn: string;
  descriptionKa: string;
  descriptionEn: string;
  price: number;
  icon: string;
  badgeKa: string;
  badgeEn: string;
};

const PRODUCTS: Product[] = [
  {
    id: "tag",
    nameKa: "QR Tag",
    nameEn: "QR Tag",
    descriptionKa:
      "გამძლე QR ტეგი ძაღლისთვის, კატისთვის, ჩანთისთვის, ჩემოდნისთვის, გასაღებისთვის და სხვა ნივთებისთვის.",
    descriptionEn:
      "Durable QR tag for pets, bags, luggage, keys and other belongings.",
    price: 9.99,
    icon: "🏷️",
    badgeKa: "ყველაზე პოპულარული",
    badgeEn: "Most Popular",
  },
  {
    id: "sticker",
    nameKa: "QR Sticker",
    nameEn: "QR Sticker",
    descriptionKa:
      "QR სტიკერი საფულისთვის, ლეპტოპისთვის, ტელეფონის ქეისისთვის და სხვა ნივთებისთვის.",
    descriptionEn:
      "QR sticker for wallets, laptops, phone cases and other belongings.",
    price: 4.99,
    icon: "🔳",
    badgeKa: "მარტივი და მსუბუქი",
    badgeEn: "Simple & Lightweight",
  },
];

export default function StorePage() {
  const router = useRouter();

  const [lang, setLang] = useState<Lang>("ka");
  const [productId, setProductId] =
    useState<ProductId>("tag");
  const [quantity, setQuantity] = useState(1);

  const ka = lang === "ka";

  const selectedProduct = useMemo(
    () =>
      PRODUCTS.find(
        (product) => product.id === productId
      ) || PRODUCTS[0],
    [productId]
  );

  const subtotal = selectedProduct.price * quantity;

  function decreaseQuantity() {
    setQuantity((current) =>
      Math.max(1, current - 1)
    );
  }

  function increaseQuantity() {
    setQuantity((current) =>
      Math.min(99, current + 1)
    );
  }

  function continueOrder() {
    const params = new URLSearchParams({
      product: selectedProduct.id,
      quantity: String(quantity),
    });

    router.push(
      `/store/checkout?${params.toString()}`
    );
  }

  return (
    <main className="page">
      <header className="topbar">
        <Link href="/" className="brand">
          <span className="logo">QR</span>

          <span>
            <strong>QR RETURN</strong>
            <small>STORE</small>
          </span>
        </Link>

        <nav className="nav">
          <Link href="/my-profiles">
            {ka ? "ჩემი პროფილები" : "My Profiles"}
          </Link>

          <Link href="/account/orders">
            {ka ? "ჩემი შეკვეთები" : "My Orders"}
          </Link>

          <div className="langs">
            <button
              type="button"
              className={ka ? "active" : ""}
              onClick={() => setLang("ka")}
            >
              GEO
            </button>

            <button
              type="button"
              className={!ka ? "active" : ""}
              onClick={() => setLang("en")}
            >
              ENG
            </button>
          </div>
        </nav>
      </header>

      <div className="shell">
        <section className="hero">
          <span className="eyebrow">
            QR RETURN STORE
          </span>

          <h1>
            {ka
              ? "დაიცავი ის, რაც შენთვის მნიშვნელოვანია."
              : "Protect what matters to you."}
          </h1>

          <p>
            {ka
              ? "აირჩიე QR Tag ან QR Sticker. თითოეული QR კოდი უკავშირდება შენს QR RETURN პროფილს და ეხმარება მპოვნელს სწრაფად დაგიკავშირდეს."
              : "Choose a QR Tag or QR Sticker. Each QR code connects to your QR RETURN profile so a finder can quickly reach you."}
          </p>
        </section>

        <section className="storeGrid">
          <div className="products">
            <div className="sectionHeading">
              <span>01</span>

              <div>
                <strong>
                  {ka
                    ? "აირჩიე პროდუქტი"
                    : "Choose a product"}
                </strong>

                <p>
                  {ka
                    ? "აირჩიე შენთვის სასურველი QR ფორმატი."
                    : "Select the QR format that works best for you."}
                </p>
              </div>
            </div>

            <div className="productGrid">
              {PRODUCTS.map((product) => {
                const selected =
                  product.id === productId;

                return (
                  <button
                    key={product.id}
                    type="button"
                    className={
                      selected
                        ? "productCard selected"
                        : "productCard"
                    }
                    onClick={() =>
                      setProductId(product.id)
                    }
                  >
                    <div className="productTop">
                      <div className="productIcon">
                        {product.icon}
                      </div>

                      <span className="check">
                        {selected ? "✓" : ""}
                      </span>
                    </div>

                    <span className="badge">
                      {ka
                        ? product.badgeKa
                        : product.badgeEn}
                    </span>

                    <h2>
                      {ka
                        ? product.nameKa
                        : product.nameEn}
                    </h2>

                    <p>
                      {ka
                        ? product.descriptionKa
                        : product.descriptionEn}
                    </p>

                    <strong className="price">
                      ${product.price.toFixed(2)}
                    </strong>
                  </button>
                );
              })}
            </div>

            <div className="sectionHeading quantityHeading">
              <span>02</span>

              <div>
                <strong>
                  {ka ? "რაოდენობა" : "Quantity"}
                </strong>

                <p>
                  {ka
                    ? "აირჩიე რამდენი ცალი გჭირდება."
                    : "Choose how many you need."}
                </p>
              </div>
            </div>

            <div className="quantityBox">
              <button
                type="button"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
              >
                −
              </button>

              <div>
                <strong>{quantity}</strong>

                <span>
                  {ka ? "ცალი" : "item(s)"}
                </span>
              </div>

              <button
                type="button"
                onClick={increaseQuantity}
                disabled={quantity >= 99}
              >
                +
              </button>
            </div>
          </div>

          <aside className="summary">
            <span className="summaryLabel">
              {ka
                ? "შეკვეთის შეჯამება"
                : "ORDER SUMMARY"}
            </span>

            <div className="summaryProduct">
              <div className="summaryIcon">
                {selectedProduct.icon}
              </div>

              <div>
                <strong>
                  {ka
                    ? selectedProduct.nameKa
                    : selectedProduct.nameEn}
                </strong>

                <span>
                  {quantity} × $
                  {selectedProduct.price.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="summaryRow">
              <span>
                {ka ? "რაოდენობა" : "Quantity"}
              </span>

              <strong>{quantity}</strong>
            </div>

            <div className="summaryRow">
              <span>
                {ka
                  ? "ერთეულის ფასი"
                  : "Unit price"}
              </span>

              <strong>
                ${selectedProduct.price.toFixed(2)}
              </strong>
            </div>

            <div className="divider" />

            <div className="total">
              <span>
                {ka ? "ჯამი" : "Subtotal"}
              </span>

              <strong>
                ${subtotal.toFixed(2)}
              </strong>
            </div>

            <p className="shippingNote">
              {ka
                ? "მიწოდების ღირებულება გამოითვლება Checkout-ის დროს."
                : "Shipping will be calculated during checkout."}
            </p>

            <button
              type="button"
              className="continueButton"
              onClick={continueOrder}
            >
              {ka
                ? "შეკვეთის გაგრძელება"
                : "Continue to Checkout"}

              <span>→</span>
            </button>

            <div className="security">
              <span>🔒</span>

              <p>
                {ka
                  ? "შენი შეკვეთის ინფორმაცია დაცულია."
                  : "Your order information is protected."}
              </p>
            </div>
          </aside>
        </section>

        <section className="benefits">
          <Benefit
            number="01"
            title={
              ka
                ? "ერთი სკანირება"
                : "One Scan"
            }
            text={
              ka
                ? "მპოვნელს მხოლოდ QR კოდის დასკანერება სჭირდება."
                : "The finder only needs to scan the QR code."
            }
          />

          <Benefit
            number="02"
            title={
              ka
                ? "პირადი მონაცემების კონტროლი"
                : "Privacy Control"
            }
            text={
              ka
                ? "შენ აკონტროლებ რა ინფორმაცია გამოჩნდება."
                : "You control what information is visible."
            }
          />

          <Benefit
            number="03"
            title="Live Chat"
            text={
              ka
                ? "მპოვნელს შეუძლია პირდაპირ პლატფორმიდან მოგწეროს."
                : "A finder can message you directly through the platform."
            }
          />

          <Benefit
            number="04"
            title={
              ka
                ? "ლოკაციის გაზიარება"
                : "Location Sharing"
            }
            text={
              ka
                ? "მპოვნელს შეუძლია ერთი ღილაკით გაგიზიაროს მდებარეობა."
                : "A finder can share their location with one tap."
            }
          />
        </section>
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #f5f7f8;
          color: #202b37;
        }

        .topbar {
          width: calc(100% - 36px);
          max-width: 1100px;
          min-height: 72px;
          margin: auto;

          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;

          border-bottom: 1px solid #e0e5e8;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 9px;
          text-decoration: none;
        }

        .logo {
          width: 43px;
          height: 43px;

          display: grid;
          place-items: center;

          border-radius: 12px;

          color: white;
          background: linear-gradient(
            135deg,
            #1465e8,
            #7655f7
          );

          font-size: 11px;
          font-weight: 900;
        }

        .brand strong,
        .brand small {
          display: block;
        }

        .brand strong {
          color: #1465e8;
          font-size: 13px;
        }

        .brand small {
          margin-top: 2px;
          color: #7655f7;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .nav {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .nav :global(a) {
          min-height: 32px;
          padding: 0 9px;

          display: flex;
          align-items: center;

          border: 1px solid #dfe4e8;
          border-radius: 8px;

          color: #57646f;
          background: white;

          text-decoration: none;
          font-size: 7px;
          font-weight: 850;
        }

        .langs {
          padding: 3px;
          display: flex;
          gap: 2px;
          border-radius: 8px;
          background: #e9edf0;
        }

        .langs button {
          min-width: 34px;
          min-height: 27px;

          border: 0;
          border-radius: 6px;

          color: #7d8791;
          background: transparent;

          cursor: pointer;
          font-size: 7px;
          font-weight: 900;
        }

        .langs button.active {
          color: #1465e8;
          background: white;
        }

        .shell {
          width: calc(100% - 40px);
          max-width: 1050px;

          margin: auto;
          padding: 55px 0 90px;
        }

        .hero {
          max-width: 720px;
        }

        .eyebrow {
          color: #7655f7;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1.3px;
        }

        .hero h1 {
          margin: 8px 0 0;

          color: #202b37;

          font-size: clamp(
            38px,
            5vw,
            57px
          );

          line-height: 1.03;
          letter-spacing: -2.3px;
        }

        .hero p {
          max-width: 660px;

          margin: 15px 0 0;

          color: #7b8690;

          font-size: 10px;
          line-height: 1.75;
        }

        .storeGrid {
          margin-top: 45px;

          display: grid;
          grid-template-columns:
            minmax(0, 1fr) 310px;

          align-items: start;
          gap: 25px;
        }

        .sectionHeading {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .sectionHeading > span {
          width: 29px;
          height: 29px;

          flex: 0 0 29px;

          display: grid;
          place-items: center;

          border-radius: 8px;

          color: #1465e8;
          background: #eaf2ff;

          font-size: 7px;
          font-weight: 900;
        }

        .sectionHeading strong {
          display: block;

          color: #35414c;
          font-size: 11px;
        }

        .sectionHeading p {
          margin: 4px 0 0;

          color: #8a949d;
          font-size: 8px;
        }

        .productGrid {
          margin-top: 15px;

          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 12px;
        }

        .productCard {
          min-height: 260px;

          padding: 18px;

          border: 1px solid #dde3e7;
          border-radius: 15px;

          color: inherit;
          background: white;

          cursor: pointer;
          text-align: left;

          transition:
            border-color 0.2s ease,
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .productCard:hover {
          transform: translateY(-2px);

          box-shadow:
            0 12px 30px
            rgba(16, 24, 40, 0.06);
        }

        .productCard.selected {
          border: 2px solid #1465e8;

          box-shadow:
            0 12px 35px
            rgba(20, 101, 232, 0.1);
        }

        .productTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .productIcon {
          width: 54px;
          height: 54px;

          display: grid;
          place-items: center;

          border-radius: 14px;

          background: #f0f4f8;

          font-size: 25px;
        }

        .check {
          width: 25px;
          height: 25px;

          display: grid;
          place-items: center;

          border-radius: 999px;

          color: white;
          background: #1465e8;

          font-size: 9px;
          font-weight: 900;
        }

        .badge {
          width: fit-content;

          margin-top: 18px;
          padding: 5px 7px;

          display: block;

          border-radius: 999px;

          color: #6941c6;
          background: #f4f3ff;

          font-size: 6px;
          font-weight: 900;
        }

        .productCard h2 {
          margin: 9px 0 0;

          color: #303c47;
          font-size: 17px;
        }

        .productCard p {
          min-height: 51px;

          margin: 8px 0 0;

          color: #7d8791;

          font-size: 8px;
          line-height: 1.6;
        }

        .price {
          display: block;

          margin-top: 17px;

          color: #202b37;

          font-size: 18px;
        }

        .quantityHeading {
          margin-top: 28px;
        }

        .quantityBox {
          width: 190px;
          min-height: 60px;

          margin-top: 14px;
          padding: 7px;

          display: grid;
          grid-template-columns:
            43px 1fr 43px;

          align-items: center;
          gap: 5px;

          border: 1px solid #dde3e7;
          border-radius: 12px;

          background: white;
        }

        .quantityBox button {
          height: 43px;

          border: 0;
          border-radius: 9px;

          color: #33404b;
          background: #f0f3f5;

          cursor: pointer;

          font-size: 18px;
          font-weight: 700;
        }

        .quantityBox button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .quantityBox div {
          text-align: center;
        }

        .quantityBox strong,
        .quantityBox span {
          display: block;
        }

        .quantityBox strong {
          font-size: 15px;
        }

        .quantityBox span {
          margin-top: 2px;

          color: #909aa3;
          font-size: 6px;
        }

        .summary {
          position: sticky;
          top: 20px;

          padding: 20px;

          border: 1px solid #dfe4e8;
          border-radius: 16px;

          background: white;

          box-shadow:
            0 18px 45px
            rgba(16, 24, 40, 0.06);
        }

        .summaryLabel {
          color: #7655f7;

          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .summaryProduct {
          margin-top: 17px;
          padding-bottom: 17px;

          display: flex;
          align-items: center;
          gap: 10px;

          border-bottom: 1px solid #edf0f2;
        }

        .summaryIcon {
          width: 46px;
          height: 46px;

          display: grid;
          place-items: center;

          border-radius: 11px;

          background: #eef4ff;

          font-size: 21px;
        }

        .summaryProduct strong,
        .summaryProduct span {
          display: block;
        }

        .summaryProduct strong {
          color: #34404b;
          font-size: 10px;
        }

        .summaryProduct span {
          margin-top: 4px;

          color: #8b959e;
          font-size: 7px;
        }

        .summaryRow {
          margin-top: 14px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 10px;
        }

        .summaryRow span {
          color: #7e8992;
          font-size: 8px;
        }

        .summaryRow strong {
          color: #44515c;
          font-size: 8px;
        }

        .divider {
          margin: 17px 0;

          border-top: 1px solid #e8ecef;
        }

        .total {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .total span {
          color: #34404b;
          font-size: 10px;
          font-weight: 850;
        }

        .total strong {
          color: #202b37;
          font-size: 21px;
        }

        .shippingNote {
          margin: 8px 0 0;

          color: #939ca5;

          font-size: 7px;
          line-height: 1.5;
        }

        .continueButton {
          width: 100%;
          min-height: 48px;

          margin-top: 18px;
          padding: 0 15px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          border: 0;
          border-radius: 10px;

          color: white;
          background: #1465e8;

          cursor: pointer;

          font-size: 8px;
          font-weight: 900;
        }

        .continueButton span {
          font-size: 15px;
        }

        .security {
          margin-top: 13px;

          display: flex;
          align-items: center;
          justify-content: center;

          gap: 5px;
        }

        .security p {
          margin: 0;

          color: #929ca5;
          font-size: 6px;
        }

        .benefits {
          margin-top: 65px;

          display: grid;
          grid-template-columns:
            repeat(4, minmax(0, 1fr));

          gap: 10px;
        }

        @media (max-width: 850px) {
          .storeGrid {
            grid-template-columns: 1fr;
          }

          .summary {
            position: static;
          }

          .benefits {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 600px) {
          .topbar {
            padding: 10px 0;

            align-items: flex-start;
            flex-direction: column;
          }

          .nav {
            width: 100%;
            flex-wrap: wrap;
          }

          .shell {
            width: calc(100% - 24px);
            padding-top: 35px;
          }

          .hero h1 {
            font-size: 38px;
          }

          .productGrid {
            grid-template-columns: 1fr;
          }

          .benefits {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}

function Benefit({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <article className="benefit">
      <span>{number}</span>

      <strong>{title}</strong>

      <p>{text}</p>

      <style jsx>{`
        .benefit {
          min-height: 145px;

          padding: 16px;

          border: 1px solid #e0e5e8;
          border-radius: 13px;

          background: white;
        }

        span {
          color: #1465e8;

          font-size: 7px;
          font-weight: 900;
        }

        strong {
          display: block;

          margin-top: 19px;

          color: #35414c;
          font-size: 10px;
        }

        p {
          margin: 7px 0 0;

          color: #87919a;

          font-size: 7px;
          line-height: 1.6;
        }
      `}</style>
    </article>
  );
}
