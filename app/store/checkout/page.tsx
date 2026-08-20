"use client";

import {
  FormEvent,
  Suspense,
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import { supabase } from "@/lib/supabase";

type Lang = "ka" | "en";
type ProductId = "tag" | "sticker";

type Product = {
  id: ProductId;
  name: string;
  price: number;
  icon: string;
};

const PRODUCTS: Record<ProductId, Product> = {
  tag: {
    id: "tag",
    name: "QR Tag",
    price: 9.99,
    icon: "🏷️",
  },

  sticker: {
    id: "sticker",
    name: "QR Sticker",
    price: 4.99,
    icon: "🔳",
  },
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [lang, setLang] = useState<Lang>("ka");

  const [userId, setUserId] =
    useState<string | null>(null);

  const [email, setEmail] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] =
    useState("United States");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  const ka = lang === "ka";

  const rawProduct =
    searchParams.get("product") || "tag";

  const productId: ProductId =
    rawProduct === "sticker"
      ? "sticker"
      : "tag";

  const product = PRODUCTS[productId];

  const rawQuantity = Number(
    searchParams.get("quantity") || "1"
  );

  const quantity =
    Number.isFinite(rawQuantity) &&
    rawQuantity >= 1
      ? Math.min(
          99,
          Math.floor(rawQuantity)
        )
      : 1;

  const subtotal = useMemo(
    () => product.price * quantity,
    [product.price, quantity]
  );

  useEffect(() => {
    void loadUser();
  }, []);

  async function loadUser() {
    try {
      setLoading(true);
      setError("");

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        throw authError;
      }

      if (!user) {
        const redirect = encodeURIComponent(
          `/store/checkout?product=${productId}&quantity=${quantity}`
        );

        router.push(
          `/login?redirect=${redirect}`
        );

        return;
      }

      setUserId(user.id);
      setEmail(user.email || "");

      const metadata =
        user.user_metadata || {};

      const possibleName =
        metadata.full_name ||
        metadata.name ||
        "";

      if (
        typeof possibleName === "string"
      ) {
        setName(possibleName);
      }

      const possiblePhone =
        metadata.phone || "";

      if (
        typeof possiblePhone === "string"
      ) {
        setPhone(possiblePhone);
      }
    } catch (err) {
      console.error(
        "Checkout auth error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : ka
          ? "მომხმარებლის მონაცემების ჩატვირთვა ვერ მოხერხდა."
          : "Could not load your account."
      );
    } finally {
      setLoading(false);
    }
  }

  function buildShippingAddress() {
    return [
      address.trim(),
      city.trim(),
      state.trim(),
      zip.trim(),
      country.trim(),
    ]
      .filter(Boolean)
      .join(", ");
  }

  async function submitOrder(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (submitting) {
      return;
    }

    if (!userId) {
      setError(
        ka
          ? "შეკვეთისთვის ანგარიშში შესვლა აუცილებელია."
          : "Please sign in before placing an order."
      );

      return;
    }

    if (!name.trim()) {
      setError(
        ka
          ? "შეიყვანეთ მიმღების სახელი."
          : "Enter the recipient name."
      );

      return;
    }

    if (!phone.trim()) {
      setError(
        ka
          ? "შეიყვანეთ ტელეფონის ნომერი."
          : "Enter a phone number."
      );

      return;
    }

    if (!address.trim()) {
      setError(
        ka
          ? "შეიყვანეთ მისამართი."
          : "Enter the street address."
      );

      return;
    }

    if (!city.trim()) {
      setError(
        ka
          ? "შეიყვანეთ ქალაქი."
          : "Enter the city."
      );

      return;
    }

    if (!state.trim()) {
      setError(
        ka
          ? "შეიყვანეთ შტატი/რეგიონი."
          : "Enter the state or region."
      );

      return;
    }

    if (!zip.trim()) {
      setError(
        ka
          ? "შეიყვანეთ ZIP / საფოსტო კოდი."
          : "Enter the ZIP / postal code."
      );

      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const shippingAddress =
        buildShippingAddress();

      const {
        data,
        error: insertError,
      } = await supabase
        .from("orders")
        .insert({
          user_id: userId,

          status: "pending",

          total_amount: Number(
            subtotal.toFixed(2)
          ),

          currency: "USD",

          shipping_name: name.trim(),

          shipping_address:
            shippingAddress,

          tracking_number: null,
        })
        .select("id")
        .single();

      if (insertError) {
        throw insertError;
      }

      if (!data?.id) {
        throw new Error(
          "Order ID was not returned."
        );
      }

      router.push(
        `/store/success?order=${encodeURIComponent(
          String(data.id)
        )}`
      );
    } catch (err) {
      console.error(
        "Create order error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : ka
          ? "შეკვეთის შექმნა ვერ მოხერხდა."
          : "Could not create your order."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <CheckoutLoading />;
  }

  return (
    <main className="page">
      <header className="topbar">
        <Link
          href="/store"
          className="brand"
        >
          <span className="logo">
            QR
          </span>

          <span>
            <strong>
              QR RETURN
            </strong>

            <small>
              SECURE CHECKOUT
            </small>
          </span>
        </Link>

        <div className="topActions">
          <Link href="/store">
            ←{" "}
            {ka
              ? "მაღაზია"
              : "Store"}
          </Link>

          <Link href="/account/orders">
            {ka
              ? "ჩემი შეკვეთები"
              : "My Orders"}
          </Link>

          <div className="langs">
            <button
              type="button"
              className={
                ka ? "active" : ""
              }
              onClick={() =>
                setLang("ka")
              }
            >
              GEO
            </button>

            <button
              type="button"
              className={
                !ka ? "active" : ""
              }
              onClick={() =>
                setLang("en")
              }
            >
              ENG
            </button>
          </div>
        </div>
      </header>

      <div className="shell">
        <header className="heading">
          <span className="eyebrow">
            QR RETURN CHECKOUT
          </span>

          <h1>
            {ka
              ? "შეკვეთის გაფორმება"
              : "Checkout"}
          </h1>

          <p>
            {ka
              ? "შეავსეთ მიწოდების ინფორმაცია და გადაამოწმეთ შეკვეთა."
              : "Enter your shipping information and review your order."}
          </p>
        </header>

        <form
          className="checkoutGrid"
          onSubmit={submitOrder}
        >
          <section className="formSide">
            <div className="sectionTitle">
              <span>01</span>

              <div>
                <strong>
                  {ka
                    ? "საკონტაქტო ინფორმაცია"
                    : "Contact Information"}
                </strong>

                <p>
                  {ka
                    ? "ინფორმაცია შეკვეთასთან დასაკავშირებლად."
                    : "Information used for your order."}
                </p>
              </div>
            </div>

            <div className="card">
              <div className="field full">
                <label>
                  {ka
                    ? "ელფოსტა"
                    : "Email"}
                </label>

                <input
                  value={email}
                  disabled
                  type="email"
                />
              </div>

              <div className="fields">
                <div className="field">
                  <label>
                    {ka
                      ? "მიმღების სახელი"
                      : "Recipient name"}
                  </label>

                  <input
                    value={name}
                    onChange={(event) =>
                      setName(
                        event.target.value
                      )
                    }
                    placeholder={
                      ka
                        ? "სახელი და გვარი"
                        : "Full name"
                    }
                    autoComplete="name"
                  />
                </div>

                <div className="field">
                  <label>
                    {ka
                      ? "ტელეფონი"
                      : "Phone"}
                  </label>

                  <input
                    value={phone}
                    onChange={(event) =>
                      setPhone(
                        event.target.value
                      )
                    }
                    placeholder="+1"
                    type="tel"
                    autoComplete="tel"
                  />
                </div>
              </div>
            </div>

            <div className="sectionTitle second">
              <span>02</span>

              <div>
                <strong>
                  {ka
                    ? "მიწოდების მისამართი"
                    : "Shipping Address"}
                </strong>

                <p>
                  {ka
                    ? "შეიყვანეთ მისამართი, სადაც შეკვეთა უნდა მიიღოთ."
                    : "Enter the address where you want to receive the order."}
                </p>
              </div>
            </div>

            <div className="card">
              <div className="field full">
                <label>
                  {ka
                    ? "ქუჩა და მისამართი"
                    : "Street address"}
                </label>

                <input
                  value={address}
                  onChange={(event) =>
                    setAddress(
                      event.target.value
                    )
                  }
                  placeholder={
                    ka
                      ? "მაგ. 123 Main Street, Apt 4"
                      : "123 Main Street, Apt 4"
                  }
                  autoComplete="street-address"
                />
              </div>

              <div className="fields">
                <div className="field">
                  <label>
                    {ka
                      ? "ქალაქი"
                      : "City"}
                  </label>

                  <input
                    value={city}
                    onChange={(event) =>
                      setCity(
                        event.target.value
                      )
                    }
                    placeholder="New York"
                    autoComplete="address-level2"
                  />
                </div>

                <div className="field">
                  <label>
                    {ka
                      ? "შტატი / რეგიონი"
                      : "State / Region"}
                  </label>

                  <input
                    value={state}
                    onChange={(event) =>
                      setState(
                        event.target.value
                      )
                    }
                    placeholder="NY"
                    autoComplete="address-level1"
                  />
                </div>
              </div>

              <div className="fields">
                <div className="field">
                  <label>
                    ZIP /{" "}
                    {ka
                      ? "საფოსტო კოდი"
                      : "Postal code"}
                  </label>

                  <input
                    value={zip}
                    onChange={(event) =>
                      setZip(
                        event.target.value
                      )
                    }
                    placeholder="10001"
                    autoComplete="postal-code"
                  />
                </div>

                <div className="field">
                  <label>
                    {ka
                      ? "ქვეყანა"
                      : "Country"}
                  </label>

                  <select
                    value={country}
                    onChange={(event) =>
                      setCountry(
                        event.target.value
                      )
                    }
                    autoComplete="country-name"
                  >
                    <option value="United States">
                      United States
                    </option>

                    <option value="Georgia">
                      Georgia
                    </option>

                    <option value="Canada">
                      Canada
                    </option>

                    <option value="United Kingdom">
                      United Kingdom
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {error && (
              <div className="error">
                ⚠ {error}
              </div>
            )}
          </section>

          <aside className="summary">
            <span className="summaryLabel">
              {ka
                ? "შეკვეთის შეჯამება"
                : "ORDER SUMMARY"}
            </span>

            <div className="product">
              <div className="productIcon">
                {product.icon}
              </div>

              <div>
                <strong>
                  {product.name}
                </strong>

                <span>
                  {quantity} × $
                  {product.price.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="summaryRow">
              <span>
                {ka
                  ? "პროდუქტი"
                  : "Product"}
              </span>

              <strong>
                {product.name}
              </strong>
            </div>

            <div className="summaryRow">
              <span>
                {ka
                  ? "რაოდენობა"
                  : "Quantity"}
              </span>

              <strong>
                {quantity}
              </strong>
            </div>

            <div className="summaryRow">
              <span>
                {ka
                  ? "ერთეულის ფასი"
                  : "Unit price"}
              </span>

              <strong>
                ${product.price.toFixed(2)}
              </strong>
            </div>

            <div className="divider" />

            <div className="total">
              <span>
                {ka
                  ? "ჯამი"
                  : "Total"}
              </span>

              <strong>
                ${subtotal.toFixed(2)}
              </strong>
            </div>

            <p className="note">
              {ka
                ? "ამ ეტაპზე შეკვეთა შეიქმნება Pending სტატუსით. ონლაინ გადახდის სისტემა შემდეგ ეტაპზე დაემატება."
                : "For now, the order will be created with Pending status. Online payment will be added in the next step."}
            </p>

            <button
              type="submit"
              className="submit"
              disabled={submitting}
            >
              <span>
                {submitting
                  ? ka
                    ? "იქმნება..."
                    : "Creating..."
                  : ka
                  ? "შეკვეთის დადასტურება"
                  : "Place Order"}
              </span>

              {!submitting && (
                <span>→</span>
              )}
            </button>

            <div className="secure">
              🔒{" "}
              {ka
                ? "QR RETURN Secure Checkout"
                : "QR RETURN Secure Checkout"}
            </div>
          </aside>
        </form>
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          color: #202b37;
          background: #f5f7f8;
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

        .topActions {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .topActions :global(a) {
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
          max-width: 1000px;

          margin: auto;
          padding: 50px 0 90px;
        }

        .heading {
          max-width: 700px;
        }

        .eyebrow {
          color: #7655f7;

          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1.2px;
        }

        .heading h1 {
          margin: 8px 0 0;

          font-size: clamp(
            37px,
            5vw,
            52px
          );

          letter-spacing: -2px;
        }

        .heading p {
          margin: 10px 0 0;

          color: #7d8791;

          font-size: 9px;
          line-height: 1.7;
        }

        .checkoutGrid {
          margin-top: 38px;

          display: grid;

          grid-template-columns:
            minmax(0, 1fr)
            310px;

          align-items: start;

          gap: 25px;
        }

        .sectionTitle {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .sectionTitle > span {
          width: 30px;
          height: 30px;

          flex: 0 0 30px;

          display: grid;
          place-items: center;

          border-radius: 8px;

          color: #1465e8;
          background: #eaf2ff;

          font-size: 7px;
          font-weight: 900;
        }

        .sectionTitle strong {
          display: block;

          color: #35414c;
          font-size: 11px;
        }

        .sectionTitle p {
          margin: 4px 0 0;

          color: #8a949d;

          font-size: 8px;
        }

        .sectionTitle.second {
          margin-top: 28px;
        }

        .card {
          margin-top: 14px;
          padding: 18px;

          border: 1px solid #dfe4e8;
          border-radius: 14px;

          background: white;
        }

        .fields {
          display: grid;

          grid-template-columns:
            repeat(
              2,
              minmax(0, 1fr)
            );

          gap: 11px;
        }

        .fields + .fields {
          margin-top: 12px;
        }

        .field.full {
          margin-bottom: 12px;
        }

        .field label {
          display: block;

          margin-bottom: 6px;

          color: #66727d;

          font-size: 7px;
          font-weight: 850;
        }

        .field input,
        .field select {
          width: 100%;
          min-height: 43px;

          padding: 0 11px;

          border: 1px solid #d7dde2;
          border-radius: 9px;

          outline: none;

          color: #35414c;
          background: white;

          font-size: 9px;
        }

        .field input:focus,
        .field select:focus {
          border-color: #1465e8;

          box-shadow:
            0 0 0 3px
            rgba(20, 101, 232, 0.08);
        }

        .field input:disabled {
          color: #89939c;
          background: #f5f7f8;
        }

        .error {
          margin-top: 15px;

          padding: 12px;

          border: 1px solid #efd2d4;
          border-radius: 9px;

          color: #9d4146;
          background: #fff5f5;

          font-size: 8px;
          line-height: 1.5;
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

        .product {
          margin-top: 17px;
          padding-bottom: 17px;

          display: flex;
          align-items: center;

          gap: 10px;

          border-bottom: 1px solid #edf0f2;
        }

        .productIcon {
          width: 47px;
          height: 47px;

          display: grid;
          place-items: center;

          border-radius: 11px;

          background: #eef4ff;

          font-size: 21px;
        }

        .product strong,
        .product span {
          display: block;
        }

        .product strong {
          color: #34404b;
          font-size: 10px;
        }

        .product span {
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
          margin: 18px 0;

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
          font-size: 22px;
        }

        .note {
          margin: 12px 0 0;

          color: #8b959e;

          font-size: 7px;
          line-height: 1.55;
        }

        .submit {
          width: 100%;
          min-height: 49px;

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

        .submit:disabled {
          opacity: 0.6;
          cursor: wait;
        }

        .secure {
          margin-top: 13px;

          color: #929ca5;

          text-align: center;

          font-size: 6px;
        }

        @media (max-width: 800px) {
          .checkoutGrid {
            grid-template-columns: 1fr;
          }

          .summary {
            position: static;
          }
        }

        @media (max-width: 600px) {
          .topbar {
            padding: 10px 0;

            align-items: flex-start;
            flex-direction: column;
          }

          .topActions {
            width: 100%;
            flex-wrap: wrap;
          }

          .shell {
            width: calc(100% - 24px);
            padding-top: 32px;
          }

          .fields {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}

function CheckoutLoading() {
  return (
    <main className="loading">
      <div>QR</div>

      <strong>
        QR RETURN
      </strong>

      <span>
        Loading checkout...
      </span>

      <style jsx>{`
        .loading {
          min-height: 100vh;

          display: flex;
          flex-direction: column;

          align-items: center;
          justify-content: center;

          gap: 8px;

          color: #7d8791;
          background: #f5f7f8;
        }

        .loading div {
          width: 52px;
          height: 52px;

          display: grid;
          place-items: center;

          border-radius: 14px;

          color: white;

          background: linear-gradient(
            135deg,
            #1465e8,
            #7655f7
          );

          font-weight: 900;
        }

        .loading strong {
          color: #202b37;
        }

        .loading span {
          font-size: 8px;
        }
      `}</style>
    </main>
  );
}
