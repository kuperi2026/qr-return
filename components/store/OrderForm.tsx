"use client";

import { useState } from "react";

type Language = "ka" | "en";

export type StoreProduct = {
  id: string;
  nameKa: string;
  nameEn: string;
  price?: number | null;
};

type Props = {
  language?: Language;
  products?: StoreProduct[];
  onSubmit?: (data: OrderFormData) => Promise<void> | void;
};

export type OrderFormData = {
  productId: string;
  quantity: number;

  firstName: string;
  lastName: string;

  phone: string;
  secondaryPhone: string;

  email: string;

  addressLine1: string;
  addressLine2: string;

  city: string;
  stateRegion: string;
  postalCode: string;
  country: string;

  note: string;
};

const defaultProducts: StoreProduct[] = [
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

export default function OrderForm({
  language = "ka",
  products = defaultProducts,
  onSubmit,
}: Props) {
  const ka = language === "ka";

  const [form, setForm] = useState<OrderFormData>({
    productId: products[0]?.id || "",
    quantity: 1,

    firstName: "",
    lastName: "",

    phone: "",
    secondaryPhone: "",

    email: "",

    addressLine1: "",
    addressLine2: "",

    city: "",
    stateRegion: "",
    postalCode: "",
    country: "United States",

    note: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  function update<K extends keyof OrderFormData>(
    key: K,
    value: OrderFormData[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");

    if (
      !form.productId ||
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.phone.trim() ||
      !form.addressLine1.trim() ||
      !form.city.trim() ||
      !form.stateRegion.trim() ||
      !form.postalCode.trim() ||
      !form.country.trim()
    ) {
      setMessage(
        ka
          ? "გთხოვთ შეავსოთ ყველა აუცილებელი ველი."
          : "Please complete all required fields."
      );

      return;
    }

    try {
      setSubmitting(true);

      await onSubmit?.(form);

      setMessage(
        ka
          ? "შეკვეთის მონაცემები მზად არის გასაგზავნად."
          : "Order information is ready to submit."
      );
    } catch (error) {
      setMessage(
        ka
          ? "შეკვეთის დამუშავება ვერ მოხერხდა."
          : "The order could not be processed."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      className="orderForm"
      onSubmit={handleSubmit}
    >
      <div className="sectionHeader">
        <span>
          01 • PRODUCT
        </span>

        <h3>
          {ka
            ? "აირჩიეთ პროდუქტი"
            : "Choose your product"}
        </h3>
      </div>

      <div className="productGrid">
        {products.map((product) => {
          const selected =
            form.productId === product.id;

          return (
            <button
              key={product.id}
              type="button"
              className={
                selected
                  ? "product active"
                  : "product"
              }
              onClick={() =>
                update(
                  "productId",
                  product.id
                )
              }
            >
              <span className="radio">
                <i />
              </span>

              <div>
                <strong>
                  {ka
                    ? product.nameKa
                    : product.nameEn}
                </strong>

                <span>
                  {product.price == null
                    ? ka
                      ? "ფასი დაემატება"
                      : "Price coming soon"
                    : `$${product.price}`}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <FieldGroup
        title="02 • QUANTITY"
        heading={
          ka
            ? "რაოდენობა"
            : "Quantity"
        }
      >
        <label className="field quantity">
          <span>
            {ka
              ? "რამდენი გსურთ?"
              : "How many?"}
          </span>

          <input
            type="number"
            min={1}
            max={100}
            value={form.quantity}
            onChange={(event) =>
              update(
                "quantity",
                Math.max(
                  1,
                  Number(
                    event.target.value
                  ) || 1
                )
              )
            }
          />
        </label>
      </FieldGroup>

      <FieldGroup
        title="03 • CUSTOMER"
        heading={
          ka
            ? "მომხმარებლის ინფორმაცია"
            : "Customer information"
        }
      >
        <div className="twoColumns">
          <TextField
            label={
              ka ? "სახელი *" : "First name *"
            }
            value={form.firstName}
            onChange={(value) =>
              update(
                "firstName",
                value
              )
            }
          />

          <TextField
            label={
              ka ? "გვარი *" : "Last name *"
            }
            value={form.lastName}
            onChange={(value) =>
              update(
                "lastName",
                value
              )
            }
          />
        </div>

        <div className="twoColumns">
          <TextField
            label={
              ka
                ? "ტელეფონი *"
                : "Phone *"
            }
            value={form.phone}
            type="tel"
            placeholder="+1 ..."
            onChange={(value) =>
              update(
                "phone",
                value
              )
            }
          />

          <TextField
            label={
              ka
                ? "დამატებითი პირის ტელეფონი"
                : "Additional contact phone"
            }
            description={
              ka
                ? "Optional — ოჯახის წევრი ან სხვა სანდო პირი."
                : "Optional — family member or another trusted contact."
            }
            value={
              form.secondaryPhone
            }
            type="tel"
            placeholder="+1 ..."
            onChange={(value) =>
              update(
                "secondaryPhone",
                value
              )
            }
          />
        </div>

        <TextField
          label={
            ka
              ? "Email"
              : "Email"
          }
          value={form.email}
          type="email"
          placeholder="name@example.com"
          onChange={(value) =>
            update(
              "email",
              value
            )
          }
        />
      </FieldGroup>

      <FieldGroup
        title="04 • SHIPPING"
        heading={
          ka
            ? "მიწოდების მისამართი"
            : "Shipping address"
        }
      >
        <TextField
          label={
            ka
              ? "მისამართი *"
              : "Address *"
          }
          value={
            form.addressLine1
          }
          placeholder={
            ka
              ? "ქუჩა, სახლის ნომერი"
              : "Street address"
          }
          onChange={(value) =>
            update(
              "addressLine1",
              value
            )
          }
        />

        <TextField
          label={
            ka
              ? "Apartment / Unit"
              : "Apartment / Unit"
          }
          value={
            form.addressLine2
          }
          placeholder={
            ka
              ? "Optional"
              : "Optional"
          }
          onChange={(value) =>
            update(
              "addressLine2",
              value
            )
          }
        />

        <div className="twoColumns">
          <TextField
            label={
              ka
                ? "ქალაქი *"
                : "City *"
            }
            value={form.city}
            onChange={(value) =>
              update(
                "city",
                value
              )
            }
          />

          <TextField
            label={
              ka
                ? "შტატი / რეგიონი *"
                : "State / Region *"
            }
            value={
              form.stateRegion
            }
            onChange={(value) =>
              update(
                "stateRegion",
                value
              )
            }
          />
        </div>

        <div className="twoColumns">
          <TextField
            label={
              ka
                ? "ZIP / Postal Code *"
                : "ZIP / Postal Code *"
            }
            value={
              form.postalCode
            }
            onChange={(value) =>
              update(
                "postalCode",
                value
              )
            }
          />

          <TextField
            label={
              ka
                ? "ქვეყანა *"
                : "Country *"
            }
            value={
              form.country
            }
            onChange={(value) =>
              update(
                "country",
                value
              )
            }
          />
        </div>
      </FieldGroup>

      <FieldGroup
        title="05 • NOTE"
        heading={
          ka
            ? "დამატებითი ინფორმაცია"
            : "Additional information"
        }
      >
        <label className="field">
          <span>
            {ka
              ? "შენიშვნა"
              : "Order note"}
          </span>

          <textarea
            rows={4}
            value={form.note}
            placeholder={
              ka
                ? "თუ გაქვთ დამატებითი მოთხოვნა, ჩაწერეთ აქ..."
                : "Add any additional request here..."
            }
            onChange={(event) =>
              update(
                "note",
                event.target.value
              )
            }
          />
        </label>
      </FieldGroup>

      {message && (
        <div className="message">
          {message}
        </div>
      )}

      <div className="submitArea">
        <div>
          <span>
            QR RETURN ORDER
          </span>

          <strong>
            {ka
              ? "ფასები და გადახდა მოგვიანებით დაემატება."
              : "Pricing and payment will be added later."}
          </strong>
        </div>

        <button
          type="submit"
          disabled={submitting}
        >
          {submitting
            ? ka
              ? "მუშავდება..."
              : "Processing..."
            : ka
            ? "გაგრძელება"
            : "Continue"}
        </button>
      </div>

      <style jsx>{`
        .orderForm {
          width: 100%;
          display: grid;
          gap: 28px;
        }

        .sectionHeader span {
          color: #c84a50;

          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1.4px;
        }

        .sectionHeader h3 {
          margin: 6px 0 0;

          color: #27333f;

          font-size: 20px;
          font-weight: 750;
          letter-spacing: -0.7px;
        }

        .productGrid {
          display: grid;
          grid-template-columns:
            repeat(
              2,
              minmax(0, 1fr)
            );

          gap: 10px;
        }

        .product {
          min-height: 72px;

          padding: 13px;

          display: grid;
          grid-template-columns:
            auto 1fr;

          align-items: center;

          gap: 10px;

          border:
            1px solid #dfe4e8;

          border-radius: 12px;

          color: #35414c;
          background: white;

          text-align: left;

          cursor: pointer;

          transition:
            border-color
              0.18s ease,
            background
              0.18s ease;
        }

        .product.active {
          border-color:
            #8aa8d6;

          background:
            #f5f8fd;
        }

        .radio {
          width: 20px;
          height: 20px;

          display: grid;
          place-items: center;

          border:
            1px solid #c9d0d6;

          border-radius: 50%;

          background: white;
        }

        .radio i {
          width: 9px;
          height: 9px;

          border-radius: 50%;

          background:
            transparent;
        }

        .product.active
          .radio i {
          background:
            #225fc7;
        }

        .product strong,
        .product div > span {
          display: block;
        }

        .product strong {
          font-size: 10px;
          font-weight: 800;
        }

        .product div > span {
          margin-top: 4px;

          color: #929ba4;

          font-size: 8px;
        }

        .twoColumns {
          display: grid;

          grid-template-columns:
            repeat(
              2,
              minmax(0, 1fr)
            );

          gap: 11px;
        }

        .field {
          display: grid;

          gap: 6px;
        }

        .field > span {
          color: #596673;

          font-size: 9px;
          font-weight: 800;
        }

        .field input,
        .field textarea {
          width: 100%;

          padding:
            0 12px;

          outline: 0;

          border:
            1px solid #dce2e6;

          border-radius: 10px;

          color: #2d3945;

          background: #fbfcfc;

          font-family: inherit;
          font-size: 10px;
        }

        .field input {
          height: 44px;
        }

        .field textarea {
          padding-top: 11px;
          padding-bottom: 11px;

          resize: vertical;

          line-height: 1.6;
        }

        .field input:focus,
        .field textarea:focus {
          border-color:
            #88a9dc;

          background: white;

          box-shadow:
            0 0 0 3px
            rgba(
              34,
              95,
              199,
              0.06
            );
        }

        .quantity {
          max-width: 170px;
        }

        .message {
          padding: 12px 14px;

          border:
            1px solid #dce2e6;

          border-radius: 10px;

          color: #596674;
          background: #f8fafb;

          font-size: 9px;
        }

        .submitArea {
          padding: 18px;

          display: flex;
          align-items: center;
          justify-content:
            space-between;

          gap: 20px;

          border:
            1px solid #dfe4e8;

          border-radius: 14px;

          background: #f8f9fa;
        }

        .submitArea span,
        .submitArea strong {
          display: block;
        }

        .submitArea span {
          color: #c84a50;

          font-size: 7px;
          font-weight: 900;
        }

        .submitArea strong {
          margin-top: 5px;

          color: #5e6974;

          font-size: 9px;
        }

        .submitArea button {
          min-height: 43px;

          padding: 0 16px;

          border: 0;
          border-radius: 10px;

          color: white;
          background: #202b37;

          cursor: pointer;

          font-size: 9px;
          font-weight: 850;
        }

        .submitArea
          button:disabled {
          opacity: 0.6;
          cursor: default;
        }

        @media (
          max-width: 700px
        ) {
          .productGrid,
          .twoColumns {
            grid-template-columns:
              1fr;
          }

          .submitArea {
            align-items: stretch;
            flex-direction: column;
          }

          .submitArea button {
            width: 100%;
          }
        }
      `}</style>
    </form>
  );
}

function FieldGroup({
  title,
  heading,
  children,
}: {
  title: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section className="group">
      <div className="header">
        <span>{title}</span>
        <h3>{heading}</h3>
      </div>

      <div className="content">
        {children}
      </div>

      <style jsx>{`
        .group {
          padding-top: 4px;
        }

        .header {
          padding-bottom: 13px;

          border-bottom:
            1px solid #e5e9ec;
        }

        .header span {
          color: #a0a8b0;

          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .header h3 {
          margin: 5px 0 0;

          color: #303c47;

          font-size: 15px;
        }

        .content {
          padding-top: 14px;

          display: grid;

          gap: 12px;
        }
      `}</style>
    </section>
  );
}

function TextField({
  label,
  description,
  value,
  onChange,
  placeholder = "",
  type = "text",
}: {
  label: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="field">
      <div>
        <strong>{label}</strong>

        {description && (
          <span>
            {description}
          </span>
        )}
      </div>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
      />

      <style jsx>{`
        .field {
          display: grid;
          gap: 6px;
        }

        strong,
        span {
          display: block;
        }

        strong {
          color: #596673;

          font-size: 9px;
          font-weight: 800;
        }

        span {
          margin-top: 3px;

          color: #969fa8;

          font-size: 7px;
          line-height: 1.4;
        }

        input {
          width: 100%;
          height: 44px;

          padding: 0 12px;

          outline: 0;

          border:
            1px solid #dce2e6;

          border-radius: 10px;

          color: #2d3945;
          background: #fbfcfc;

          font-family: inherit;
          font-size: 10px;
        }

        input:focus {
          border-color:
            #88a9dc;

          background: white;

          box-shadow:
            0 0 0 3px
            rgba(
              34,
              95,
              199,
              0.06
            );
        }
      `}</style>
    </label>
  );
}
