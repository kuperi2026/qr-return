"use client";

import { useState } from "react";
import OrderForm, {
  type StoreProduct,
  type OrderFormData,
} from "@/components/store/OrderForm";

type Language = "ka" | "en";

type Props = {
  language?: Language;
};

const products: StoreProduct[] = [
  {
    id: "pet-tag",
    nameKa: "Pet QR Tag",
    nameEn: "Pet QR Tag",
    price: null,
  },
  {
    id: "item-tag",
    nameKa: "Item QR Tag",
    nameEn: "Item QR Tag",
    price: null,
  },
  {
    id: "emergency-bracelet",
    nameKa: "Emergency QR Bracelet",
    nameEn: "Emergency QR Bracelet",
    price: null,
  },
  {
    id: "luggage-tag",
    nameKa: "Luggage QR Tag",
    nameEn: "Luggage QR Tag",
    price: null,
  },
  {
    id: "wallet-card",
    nameKa: "Wallet QR Card",
    nameEn: "Wallet QR Card",
    price: null,
  },
];

export default function StoreSection({
  language = "ka",
}: Props) {
  const ka = language === "ka";

  const [showOrderForm, setShowOrderForm] =
    useState(false);

  async function handleOrder(
    data: OrderFormData
  ) {
    /*
      შემდეგ ეტაპზე აქ დავუკავშირებთ Supabase orders table-ს.
      ახლა მხოლოდ ფორმის მონაცემებს ვიღებთ.
    */

    console.log(
      "QR RETURN ORDER:",
      data
    );
  }

  return (
    <section
      id="shop"
      className="storeSection"
    >
      <div className="shell">
        <div className="heading">
          <span className="eyebrow">
            QR RETURN STORE
          </span>

          <h2>
            {ka
              ? "აირჩიეთ QR RETURN პროდუქტი."
              : "Choose your QR RETURN product."}
          </h2>

          <p>
            {ka
              ? "QR პროდუქტი დაუკავშირდება თქვენს QR RETURN ანგარიშსა და შესაბამის პროფილს."
              : "Your QR product will connect to your QR RETURN account and the relevant profile."}
          </p>
        </div>

        <div className="productGrid">
          {products.map(
            (product, index) => (
              <ProductCard
                key={product.id}
                index={index + 1}
                product={product}
                language={language}
                onBuy={() =>
                  setShowOrderForm(
                    true
                  )
                }
              />
            )
          )}
        </div>

        <div className="storeNote">
          <div>
            <span>
              PRODUCT AVAILABILITY
            </span>

            <strong>
              {ka
                ? "პროდუქტის ფოტოები და ფასები მალე დაემატება."
                : "Product photos and pricing will be added soon."}
            </strong>
          </div>

          <button
            type="button"
            onClick={() =>
              setShowOrderForm(
                true
              )
            }
          >
            {ka
              ? "შეკვეთის ფორმა"
              : "Order Form"}
          </button>
        </div>

        {showOrderForm && (
          <div className="orderArea">
            <div className="orderHeader">
              <div>
                <span>
                  QR RETURN ORDER
                </span>

                <h3>
                  {ka
                    ? "შეკვეთის ინფორმაცია"
                    : "Order information"}
                </h3>

                <p>
                  {ka
                    ? "აირჩიეთ პროდუქტი და შეავსეთ საკონტაქტო და მიწოდების ინფორმაცია."
                    : "Choose a product and complete your contact and shipping information."}
                </p>
              </div>

              <button
                type="button"
                className="close"
                onClick={() =>
                  setShowOrderForm(
                    false
                  )
                }
                aria-label={
                  ka
                    ? "დახურვა"
                    : "Close"
                }
              >
                ×
              </button>
            </div>

            <OrderForm
              language={language}
              products={products}
              onSubmit={
                handleOrder
              }
            />
          </div>
        )}
      </div>

      <style jsx>{`
        .storeSection {
          width: 100%;
          padding: 92px 0;

          background: #ffffff;
        }

        .shell {
          width:
            calc(100% - 56px);

          max-width: 1180px;

          margin: 0 auto;
        }

        .heading {
          max-width: 720px;
        }

        .eyebrow {
          color: #c84a50;

          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        h2 {
          margin: 10px 0 0;

          color: #202b37;

          font-size:
            clamp(
              36px,
              4vw,
              48px
            );

          font-weight: 680;
          line-height: 1.06;
          letter-spacing: -2px;
        }

        .heading p {
          max-width: 650px;

          margin: 15px 0 0;

          color: #737e89;

          font-size: 11px;
          line-height: 1.75;
        }

        .productGrid {
          margin-top: 42px;

          display: grid;

          grid-template-columns:
            repeat(
              3,
              minmax(0, 1fr)
            );

          gap: 16px;
        }

        .storeNote {
          margin-top: 22px;

          padding: 20px;

          display: flex;
          align-items: center;
          justify-content:
            space-between;

          gap: 20px;

          border:
            1px solid #e0e4e7;

          border-radius: 15px;

          background: #f7f8f8;
        }

        .storeNote span,
        .storeNote strong {
          display: block;
        }

        .storeNote span {
          color: #c84a50;

          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .storeNote strong {
          margin-top: 5px;

          color: #596571;

          font-size: 10px;
        }

        .storeNote button {
          min-height: 42px;

          padding: 0 15px;

          flex: 0 0 auto;

          border: 0;
          border-radius: 10px;

          color: white;
          background: #202b37;

          cursor: pointer;

          font-size: 9px;
          font-weight: 850;
        }

        .orderArea {
          margin-top: 28px;

          padding: 25px;

          border:
            1px solid #dfe4e8;

          border-radius: 18px;

          background: white;

          box-shadow:
            0 16px 40px
            rgba(
              32,
              43,
              55,
              0.05
            );
        }

        .orderHeader {
          margin-bottom: 28px;

          padding-bottom: 18px;

          display: flex;
          align-items: flex-start;
          justify-content:
            space-between;

          gap: 20px;

          border-bottom:
            1px solid #e5e9ec;
        }

        .orderHeader span {
          color: #c84a50;

          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1.2px;
        }

        .orderHeader h3 {
          margin: 6px 0 0;

          color: #28343f;

          font-size: 22px;
          letter-spacing: -0.7px;
        }

        .orderHeader p {
          max-width: 600px;

          margin: 7px 0 0;

          color: #828c96;

          font-size: 9px;
          line-height: 1.6;
        }

        .close {
          width: 38px;
          height: 38px;

          flex: 0 0 38px;

          border:
            1px solid #dfe4e8;

          border-radius: 50%;

          color: #66727d;
          background: white;

          cursor: pointer;

          font-size: 21px;
          font-weight: 300;
        }

        @media (
          max-width: 900px
        ) {
          .productGrid {
            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );
          }
        }

        @media (
          max-width: 650px
        ) {
          .storeSection {
            padding: 65px 0;
          }

          .shell {
            width:
              calc(100% - 28px);
          }

          .productGrid {
            grid-template-columns:
              1fr;
          }

          .storeNote {
            align-items: stretch;
            flex-direction: column;
          }

          .storeNote button {
            width: 100%;
          }

          .orderArea {
            padding: 17px;
          }
        }
      `}</style>
    </section>
  );
}

function ProductCard({
  index,
  product,
  language,
  onBuy,
}: {
  index: number;
  product: StoreProduct;
  language: Language;
  onBuy: () => void;
}) {
  const ka = language === "ka";

  return (
    <article className="product">
      <div className="image">
        <div className="placeholder">
          <QRProductIcon />

          <span>
            {ka
              ? "პროდუქტის ფოტო"
              : "Product photo"}
          </span>
        </div>

        <span className="number">
          {String(index).padStart(
            2,
            "0"
          )}
        </span>
      </div>

      <div className="content">
        <span className="type">
          QR RETURN PRODUCT
        </span>

        <h3>
          {ka
            ? product.nameKa
            : product.nameEn}
        </h3>

        <div className="bottom">
          <strong>
            {product.price == null
              ? ka
                ? "ფასი მალე"
                : "Price soon"
              : `$${product.price}`}
          </strong>

          <button
            type="button"
            onClick={onBuy}
          >
            {ka
              ? "არჩევა"
              : "Select"}
          </button>
        </div>
      </div>

      <style jsx>{`
        .product {
          overflow: hidden;

          border:
            1px solid #e0e4e7;

          border-radius: 17px;

          background: white;

          box-shadow:
            0 10px 30px
            rgba(
              32,
              43,
              55,
              0.03
            );
        }

        .image {
          height: 210px;

          position: relative;

          overflow: hidden;

          background:
            linear-gradient(
              145deg,
              #eef1f3,
              #f8f9f8
            );
        }

        .placeholder {
          width: 100%;
          height: 100%;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content:
            center;

          gap: 10px;

          color: #a1abb4;
        }

        .placeholder
          :global(svg) {
          width: 44px;
          height: 44px;
        }

        .placeholder span {
          font-size: 8px;
          font-weight: 800;
        }

        .number {
          position: absolute;

          top: 14px;
          right: 14px;

          padding: 6px 8px;

          border-radius: 999px;

          color: #5d6873;
          background:
            rgba(
              255,
              255,
              255,
              0.9
            );

          font-size: 7px;
          font-weight: 900;
        }

        .content {
          padding: 17px;
        }

        .type {
          color: #c84a50;

          font-size: 6px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        h3 {
          margin: 7px 0 0;

          color: #2c3742;

          font-size: 14px;
        }

        .bottom {
          margin-top: 18px;

          padding-top: 13px;

          display: flex;
          align-items: center;
          justify-content:
            space-between;

          gap: 10px;

          border-top:
            1px solid #e8ebed;
        }

        .bottom strong {
          color: #68737e;

          font-size: 9px;
        }

        .bottom button {
          min-height: 34px;

          padding: 0 11px;

          border: 0;
          border-radius: 8px;

          color: white;
          background: #202b37;

          cursor: pointer;

          font-size: 8px;
          font-weight: 850;
        }
      `}</style>
    </article>
  );
}

function QRProductIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect
        x="3"
        y="3"
        width="6"
        height="6"
        rx="1"
      />

      <rect
        x="15"
        y="3"
        width="6"
        height="6"
        rx="1"
      />

      <rect
        x="3"
        y="15"
        width="6"
        height="6"
        rx="1"
      />

      <path d="M14 14h3v3h3v4h-6z" />
    </svg>
  );
}
