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
type PaymentMethod = "stripe" | "tbc" | "bog";

type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  design_name: string | null;
  description: string | null;
  sku: string;
  price: number;
  currency: string;
  image_url: string | null;
  stock_quantity: number;
  active: boolean;
};

type ShippingForm = {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [lang, setLang] = useState<Lang>("ka");

  const [product, setProduct] =
    useState<Product | null>(null);

  const [userId, setUserId] =
    useState<string | null>(null);

  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("stripe");

  const [form, setForm] =
    useState<ShippingForm>({
      fullName: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "United States",
    });

  const ka = lang === "ka";

  const productSlug =
    searchParams.get("product") || "";

  const rawQuantity =
    Number(searchParams.get("quantity") || "1");

  const quantity =
    Number.isFinite(rawQuantity) && rawQuantity >= 1
      ? Math.min(99, Math.floor(rawQuantity))
      : 1;

  useEffect(() => {
    void initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productSlug]);

  async function initialize() {
    try {
      setLoading(true);
      setError("");

      /*
       * 1. USER MUST BE LOGGED IN
       */

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        throw authError;
      }

      if (!user) {
        const currentPath =
          `/store/checkout?product=${encodeURIComponent(
            productSlug
          )}&quantity=${quantity}`;

        router.replace(
          `/login?redirect=${encodeURIComponent(
            currentPath
          )}`
        );

        return;
      }

      setUserId(user.id);
      setEmail(user.email || "");

      /*
       * 2. PRODUCT IS REQUIRED
       */

      if (!productSlug) {
        router.replace("/store");
        return;
      }

      /*
       * 3. LOAD PRODUCT FROM SUPABASE
       */

      const {
        data: productData,
        error: productError,
      } = await supabase
        .from("products")
        .select(`
          id,
          slug,
          name,
          category,
          design_name,
          description,
          sku,
          price,
          currency,
          image_url,
          stock_quantity,
          active
        `)
        .eq("slug", productSlug)
        .eq("active", true)
        .maybeSingle();

      if (productError) {
        throw productError;
      }

      if (!productData) {
        setError(
          ka
            ? "პროდუქტი ვერ მოიძებნა."
            : "Product not found."
        );

        return;
      }

      const selectedProduct =
        productData as Product;

      if (
        selectedProduct.stock_quantity <
        quantity
      ) {
        setError(
          ka
            ? "არჩეული რაოდენობა მარაგში არ არის."
            : "The selected quantity is not available."
        );

        return;
      }

      setProduct(selectedProduct);
    } catch (err) {
      console.error(
        "Checkout initialization error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : ka
          ? "Checkout-ის ჩატვირთვა ვერ მოხერხდა."
          : "Could not load checkout."
      );
    } finally {
      setLoading(false);
    }
  }

  const subtotal = useMemo(() => {
    if (!product) return 0;

    return (
      Number(product.price) *
      quantity
    );
  }, [product, quantity]);

  /*
   * Shipping ჯერ 0 გვაქვს.
   * მოგვიანებით შეგვიძლია ქვეყნების მიხედვით
   * ცალკე shipping rates დავამატოთ.
   */

  const shipping = 0;

  const total =
    subtotal + shipping;

  function formatMoney(
    amount: number,
    currency?: string
  ) {
    try {
      return new Intl.NumberFormat(
        "en-US",
        {
          style: "currency",
          currency:
            currency || "USD",
        }
      ).format(amount);
    } catch {
      return `$${amount.toFixed(2)}`;
    }
  }

  function updateField(
    field: keyof ShippingForm,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function validateForm() {
    if (!form.fullName.trim()) {
      return ka
        ? "შეიყვანეთ სახელი და გვარი."
        : "Enter your full name.";
    }

    if (!form.phone.trim()) {
      return ka
        ? "შეიყვანეთ ტელეფონის ნომერი."
        : "Enter your phone number.";
    }

    if (!form.address.trim()) {
      return ka
        ? "შეიყვანეთ მისამართი."
        : "Enter your address.";
    }

    if (!form.city.trim()) {
      return ka
        ? "შეიყვანეთ ქალაქი."
        : "Enter your city.";
    }

    if (!form.country.trim()) {
      return ka
        ? "შეიყვანეთ ქვეყანა."
        : "Enter your country.";
    }

    return "";
  }

  async function createPendingOrder() {
    if (!product || !userId) {
      throw new Error(
        "Product or user is missing."
      );
    }

    /*
     * Order number
     */

    const orderNumber =
      `QR-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 7)
        .toUpperCase()}`;

    /*
     * IMPORTANT:
     * products table არის ჩვენი source of truth.
     * ფასი client-ის URL-იდან არ მოდის.
     */

    const orderPayload = {
      user_id: userId,

      order_number: orderNumber,

      status: "pending",

      payment_status: "pending",

      payment_provider: paymentMethod,

      payment_currency:
        product.currency || "USD",

      payment_amount: total,

      subtotal,

      total,

      quantity,

      product_id: product.id,

      product_name: product.name,

      product_sku: product.sku,

      shipping_name: form.fullName.trim(),

      shipping_email: email,

      shipping_phone: form.phone.trim(),

      shipping_address: form.address.trim(),

      shipping_city: form.city.trim(),

      shipping_state: form.state.trim(),

      shipping_zip: form.zip.trim(),

      shipping_country: form.country.trim(),

      payment_metadata: {
        product_slug: product.slug,
        design_name:
          product.design_name,
        category: product.category,
      },
    };

    const {
      data,
      error: orderError,
    } = await supabase
      .from("orders")
      .insert(orderPayload)
      .select()
      .single();

    if (orderError) {
      throw orderError;
    }

    return data;
  }

  async function startStripePayment(
    orderId: string | number
  ) {
    if (!product) {
      throw new Error(
        "Product is missing."
      );
    }

    const response =
      await fetch(
        "/api/checkout",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            productId:
              product.slug,

            productSlug:
              product.slug,

            quantity,

            orderId:
              String(orderId),

            customerEmail:
              email,

            shippingName:
              form.fullName,

            shippingPhone:
              form.phone,

            shippingAddress:
              form.address,

            shippingCity:
              form.city,

            shippingState:
              form.state,

            shippingZip:
              form.zip,

            shippingCountry:
              form.country,
          }),
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
          "Stripe checkout could not be created."
      );
    }

    if (!data.url) {
      throw new Error(
        "Stripe Checkout URL was not returned."
      );
    }

    window.location.href =
      data.url;
  }

  async function startTbcPayment(
    orderId: string | number
  ) {
    if (!product) {
      throw new Error(
        "Product is missing."
      );
    }

    const response =
      await fetch(
        "/api/payments/tbc",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            productId:
              product.slug,

            productSlug:
              product.slug,

            quantity,

            orderId:
              String(orderId),

            language:
              ka ? "KA" : "EN",
          }),
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
          "TBC payment could not be created."
      );
    }

    if (!data.approvalUrl) {
      throw new Error(
        "TBC approval URL was not returned."
      );
    }

    window.location.href =
      data.approvalUrl;
  }

  async function startBogPayment(
    orderId: string | number
  ) {
    if (!product) {
      throw new Error(
        "Product is missing."
      );
    }

    const response =
      await fetch(
        "/api/payments/bog",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            productId:
              product.slug,

            productSlug:
              product.slug,

            quantity,

            orderId:
              String(orderId),

            language:
              ka ? "ka" : "en",

            customerEmail:
              email,

            shipping: form,
          }),
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
          "Bank of Georgia payment could not be created."
      );
    }

    if (!data.redirectUrl) {
      throw new Error(
        "Bank of Georgia payment URL was not returned."
      );
    }

    window.location.href =
      data.redirectUrl;
  }

  async function handleSubmit(
    event: FormEvent
  ) {
    event.preventDefault();

    if (
      submitting ||
      !product ||
      !userId
    ) {
      return;
    }

    const validationError =
      validateForm();

    if (validationError) {
      setError(
        validationError
      );
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      /*
       * First create PENDING order.
       * Payment confirmation later changes it to PAID.
       */

      const order =
        await createPendingOrder();

      const orderId =
        order.id;

      if (
        paymentMethod ===
        "stripe"
      ) {
        await startStripePayment(
          orderId
        );
        return;
      }

      if (
        paymentMethod ===
        "tbc"
      ) {
        await startTbcPayment(
          orderId
        );
        return;
      }

      if (
        paymentMethod ===
        "bog"
      ) {
        await startBogPayment(
          orderId
        );
      }
    } catch (err) {
      console.error(
        "Checkout submit error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : ka
          ? "გადახდის დაწყება ვერ მოხერხდა."
          : "Could not start payment."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="loadingPage">
        <div className="loader">
          <span>QR</span>
        </div>

        <strong>
          QR RETURN
        </strong>

        <p>
          {ka
            ? "Checkout იტვირთება..."
            : "Loading checkout..."}
        </p>

        <style jsx>{`
          .loadingPage {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #f5f7f8;
            color: #7d8791;
          }

          .loader {
            width: 58px;
            height: 58px;
            display: grid;
            place-items: center;
            border-radius: 16px;
            color: white;
            background: linear-gradient(
              135deg,
              #1465e8,
              #7655f7
            );
            font-weight: 900;
          }

          strong {
            margin-top: 10px;
            color: #26323d;
          }

          p {
            font-size: 10px;
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="page">
      <header className="header">
        <Link
          href="/store"
          className="brand"
        >
          <span className="brandLogo">
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

        <div className="headerRight">
          <span className="secure">
            🔒{" "}
            {ka
              ? "უსაფრთხო გადახდა"
              : "Secure Checkout"}
          </span>

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
        <Link
          href="/store"
          className="back"
        >
          ←{" "}
          {ka
            ? "მაღაზიაში დაბრუნება"
            : "Back to Store"}
        </Link>

        <div className="title">
          <span>
            QR RETURN CHECKOUT
          </span>

          <h1>
            {ka
              ? "შეკვეთის გაფორმება"
              : "Complete Your Order"}
          </h1>

          <p>
            {ka
              ? "შეამოწმეთ პროდუქტი, შეავსეთ მიწოდების ინფორმაცია და აირჩიეთ გადახდის მეთოდი."
              : "Review your product, enter shipping details, and choose a payment method."}
          </p>
        </div>

        {error && (
          <div className="error">
            <strong>⚠</strong>
            <span>{error}</span>
          </div>
        )}

        {!product ? (
          <div className="notFound">
            <div>◈</div>

            <h2>
              {ka
                ? "პროდუქტი ვერ მოიძებნა"
                : "Product Not Found"}
            </h2>

            <Link href="/store">
              {ka
                ? "მაღაზიაში დაბრუნება"
                : "Return to Store"}
            </Link>
          </div>
        ) : (
          <form
            onSubmit={
              handleSubmit
            }
          >
            <div className="checkoutGrid">
              <div className="left">
                <section className="card productCard">
                  <div className="sectionLabel">
                    01 ·{" "}
                    {ka
                      ? "პროდუქტი"
                      : "PRODUCT"}
                  </div>

                  <div className="product">
                    <div className="productImage">
                      {product.image_url ? (
                        <img
                          src={
                            product.image_url
                          }
                          alt={
                            product.name
                          }
                        />
                      ) : (
                        <div className="placeholder">
                          <span>
                            {product.category ===
                            "sticker"
                              ? "🔳"
                              : "🏷️"}
                          </span>

                          <strong>
                            QR
                          </strong>
                        </div>
                      )}
                    </div>

                    <div className="productInfo">
                      <span className="category">
                        {
                          product.category
                        }
                      </span>

                      <h2>
                        {product.name}
                      </h2>

                      {product.design_name && (
                        <strong className="design">
                          {
                            product.design_name
                          }
                        </strong>
                      )}

                      <span className="sku">
                        SKU:{" "}
                        {product.sku}
                      </span>

                      <div className="stock">
                        ✓{" "}
                        {ka
                          ? `მარაგში: ${product.stock_quantity}`
                          : `In stock: ${product.stock_quantity}`}
                      </div>
                    </div>

                    <div className="productPrice">
                      <strong>
                        {formatMoney(
                          Number(
                            product.price
                          ),
                          product.currency
                        )}
                      </strong>

                      <span>
                        × {quantity}
                      </span>
                    </div>
                  </div>
                </section>

                <section className="card">
                  <div className="sectionLabel">
                    02 ·{" "}
                    {ka
                      ? "მიწოდების ინფორმაცია"
                      : "SHIPPING INFORMATION"}
                  </div>

                  <div className="formGrid">
                    <label className="full">
                      <span>
                        {ka
                          ? "სახელი და გვარი"
                          : "Full Name"}
                        *
                      </span>

                      <input
                        value={
                          form.fullName
                        }
                        onChange={(e) =>
                          updateField(
                            "fullName",
                            e.target.value
                          )
                        }
                        placeholder={
                          ka
                            ? "სახელი გვარი"
                            : "First and last name"
                        }
                      />
                    </label>

                    <label>
                      <span>
                        Email
                      </span>

                      <input
                        value={email}
                        disabled
                      />
                    </label>

                    <label>
                      <span>
                        {ka
                          ? "ტელეფონი"
                          : "Phone"}
                        *
                      </span>

                      <input
                        value={
                          form.phone
                        }
                        onChange={(e) =>
                          updateField(
                            "phone",
                            e.target.value
                          )
                        }
                        placeholder="+1..."
                      />
                    </label>

                    <label className="full">
                      <span>
                        {ka
                          ? "მისამართი"
                          : "Street Address"}
                        *
                      </span>

                      <input
                        value={
                          form.address
                        }
                        onChange={(e) =>
                          updateField(
                            "address",
                            e.target.value
                          )
                        }
                        placeholder={
                          ka
                            ? "ქუჩა, სახლის/ბინის ნომერი"
                            : "Street, house or apartment"
                        }
                      />
                    </label>

                    <label>
                      <span>
                        {ka
                          ? "ქალაქი"
                          : "City"}
                        *
                      </span>

                      <input
                        value={
                          form.city
                        }
                        onChange={(e) =>
                          updateField(
                            "city",
                            e.target.value
                          )
                        }
                      />
                    </label>

                    <label>
                      <span>
                        {ka
                          ? "შტატი / რეგიონი"
                          : "State / Region"}
                      </span>

                      <input
                        value={
                          form.state
                        }
                        onChange={(e) =>
                          updateField(
                            "state",
                            e.target.value
                          )
                        }
                      />
                    </label>

                    <label>
                      <span>
                        {ka
                          ? "ZIP / საფოსტო კოდი"
                          : "ZIP / Postal Code"}
                      </span>

                      <input
                        value={
                          form.zip
                        }
                        onChange={(e) =>
                          updateField(
                            "zip",
                            e.target.value
                          )
                        }
                      />
                    </label>

                    <label>
                      <span>
                        {ka
                          ? "ქვეყანა"
                          : "Country"}
                        *
                      </span>

                      <select
                        value={
                          form.country
                        }
                        onChange={(e) =>
                          updateField(
                            "country",
                            e.target.value
                          )
                        }
                      >
                        <option>
                          United States
                        </option>

                        <option>
                          Georgia
                        </option>

                        <option>
                          Canada
                        </option>

                        <option>
                          United Kingdom
                        </option>

                        <option>
                          Germany
                        </option>

                        <option>
                          France
                        </option>

                        <option>
                          Italy
                        </option>

                        <option>
                          Spain
                        </option>
                      </select>
                    </label>
                  </div>
                </section>

                <section className="card">
                  <div className="sectionLabel">
                    03 ·{" "}
                    {ka
                      ? "გადახდის მეთოდი"
                      : "PAYMENT METHOD"}
                  </div>

                  <div className="paymentMethods">
                    <button
                      type="button"
                      className={
                        paymentMethod ===
                        "stripe"
                          ? "payment active"
                          : "payment"
                      }
                      onClick={() =>
                        setPaymentMethod(
                          "stripe"
                        )
                      }
                    >
                      <span className="paymentIcon">
                        💳
                      </span>

                      <span className="paymentText">
                        <strong>
                          Card / Stripe
                        </strong>

                        <small>
                          {ka
                            ? "საერთაშორისო ბარათით გადახდა"
                            : "International card payment"}
                        </small>
                      </span>

                      <span className="radio">
                        {paymentMethod ===
                        "stripe"
                          ? "●"
                          : "○"}
                      </span>
                    </button>

                    <button
                      type="button"
                      className={
                        paymentMethod ===
                        "tbc"
                          ? "payment active"
                          : "payment"
                      }
                      onClick={() =>
                        setPaymentMethod(
                          "tbc"
                        )
                      }
                    >
                      <span className="paymentIcon tbc">
                        TBC
                      </span>

                      <span className="paymentText">
                        <strong>
                          TBC Bank
                        </strong>

                        <small>
                          {ka
                            ? "TBC Checkout"
                            : "TBC Checkout"}
                        </small>
                      </span>

                      <span className="radio">
                        {paymentMethod ===
                        "tbc"
                          ? "●"
                          : "○"}
                      </span>
                    </button>

                    <button
                      type="button"
                      className={
                        paymentMethod ===
                        "bog"
                          ? "payment active"
                          : "payment"
                      }
                      onClick={() =>
                        setPaymentMethod(
                          "bog"
                        )
                      }
                    >
                      <span className="paymentIcon bog">
                        BOG
                      </span>

                      <span className="paymentText">
                        <strong>
                          Bank of Georgia
                        </strong>

                        <small>
                          {ka
                            ? "საქართველოს ბანკით გადახდა"
                            : "Bank of Georgia payment"}
                        </small>
                      </span>

                      <span className="radio">
                        {paymentMethod ===
                        "bog"
                          ? "●"
                          : "○"}
                      </span>
                    </button>
                  </div>

                  <div className="paymentNote">
                    🔒{" "}
                    {ka
                      ? "QR RETURN არ ინახავს თქვენი ბარათის მონაცემებს."
                      : "QR RETURN does not store your card details."}
                  </div>
                </section>
              </div>

              <aside className="summary">
                <div className="summaryCard">
                  <span className="summaryLabel">
                    {ka
                      ? "შეკვეთის შეჯამება"
                      : "ORDER SUMMARY"}
                  </span>

                  <div className="summaryProduct">
                    <div>
                      <strong>
                        {product.name}
                      </strong>

                      {product.design_name && (
                        <span>
                          {
                            product.design_name
                          }
                        </span>
                      )}

                      <small>
                        {quantity} ×{" "}
                        {formatMoney(
                          Number(
                            product.price
                          ),
                          product.currency
                        )}
                      </small>
                    </div>

                    <strong>
                      {formatMoney(
                        subtotal,
                        product.currency
                      )}
                    </strong>
                  </div>

                  <div className="line" />

                  <div className="row">
                    <span>
                      {ka
                        ? "პროდუქტი"
                        : "Subtotal"}
                    </span>

                    <strong>
                      {formatMoney(
                        subtotal,
                        product.currency
                      )}
                    </strong>
                  </div>

                  <div className="row">
                    <span>
                      {ka
                        ? "მიწოდება"
                        : "Shipping"}
                    </span>

                    <strong className="free">
                      {shipping === 0
                        ? ka
                          ? "უფასო"
                          : "Free"
                        : formatMoney(
                            shipping,
                            product.currency
                          )}
                    </strong>
                  </div>

                  <div className="line" />

                  <div className="total">
                    <span>
                      {ka
                        ? "სულ"
                        : "Total"}
                    </span>

                    <strong>
                      {formatMoney(
                        total,
                        product.currency
                      )}
                    </strong>
                  </div>

                  <button
                    type="submit"
                    className="payButton"
                    disabled={
                      submitting
                    }
                  >
                    {submitting
                      ? ka
                        ? "გადახდა იტვირთება..."
                        : "Starting payment..."
                      : ka
                      ? "გადახდა"
                      : "Pay Now"}

                    {!submitting && (
                      <span>
                        →
                      </span>
                    )}
                  </button>

                  <div className="accountInfo">
                    <span>✓</span>

                    <p>
                      {ka
                        ? "შეკვეთა დაკავშირებული იქნება თქვენს QR RETURN ანგარიშთან."
                        : "This order will be linked to your QR RETURN account."}
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          </form>
        )}
      </div>

      <footer>
        <strong>
          QR RETURN
        </strong>

        <span>
          {ka
            ? "დაკარგვა არ ნიშნავს დამშვიდობებას."
            : "Never lose what matters."}
        </span>
      </footer>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #f5f7f8;
          color: #25313c;
        }

        .header {
          width: calc(100% - 40px);
          max-width: 1180px;
          min-height: 72px;
          margin: auto;

          display: flex;
          align-items: center;
          justify-content: space-between;

          border-bottom: 1px solid #dfe5e9;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 9px;
          text-decoration: none;
        }

        .brandLogo {
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

        .headerRight {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .secure {
          color: #74808a;
          font-size: 7px;
          font-weight: 800;
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
          background: transparent;
          color: #7d8791;
          cursor: pointer;
          font-size: 7px;
          font-weight: 900;
        }

        .langs button.active {
          background: white;
          color: #1465e8;
        }

        .shell {
          width: calc(100% - 40px);
          max-width: 1180px;
          margin: auto;
          padding: 38px 0 80px;
        }

        .back {
          color: #6d7983;
          text-decoration: none;
          font-size: 8px;
          font-weight: 800;
        }

        .title {
          margin-top: 28px;
        }

        .title > span,
        .sectionLabel,
        .summaryLabel {
          color: #7655f7;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1.2px;
        }

        .title h1 {
          margin: 7px 0 0;
          color: #27333e;
          font-size: 38px;
          letter-spacing: -1.5px;
        }

        .title p {
          max-width: 620px;
          margin: 8px 0 0;
          color: #7e8992;
          font-size: 9px;
          line-height: 1.7;
        }

        .error {
          margin-top: 22px;
          padding: 13px 15px;

          display: flex;
          gap: 8px;

          border: 1px solid #efcfd1;
          border-radius: 10px;

          background: #fff4f4;
          color: #9e4147;

          font-size: 8px;
        }

        .checkoutGrid {
          margin-top: 30px;

          display: grid;

          grid-template-columns:
            minmax(0, 1fr)
            350px;

          align-items: start;

          gap: 18px;
        }

        .left {
          display: grid;
          gap: 14px;
        }

        .card,
        .summaryCard {
          padding: 22px;

          border: 1px solid #dfe5e9;
          border-radius: 16px;

          background: white;
        }

        .product {
          margin-top: 17px;

          display: grid;

          grid-template-columns:
            115px
            minmax(0, 1fr)
            auto;

          align-items: center;

          gap: 17px;
        }

        .productImage {
          height: 115px;

          overflow: hidden;

          border-radius: 13px;

          background: linear-gradient(
            145deg,
            #edf4ff,
            #f3efff
          );
        }

        .productImage img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .placeholder {
          width: 100%;
          height: 100%;

          display: grid;
          place-items: center;

          position: relative;
        }

        .placeholder span {
          font-size: 39px;
        }

        .placeholder strong {
          position: absolute;
          right: 8px;
          bottom: 7px;

          color: rgba(
            20,
            101,
            232,
            0.3
          );

          font-size: 17px;
        }

        .category {
          color: #7655f7;
          font-size: 6px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .productInfo h2 {
          margin: 5px 0 0;
          font-size: 18px;
        }

        .design {
          display: block;
          margin-top: 3px;
          color: #6f7b86;
          font-size: 9px;
        }

        .sku {
          display: block;
          margin-top: 8px;
          color: #9aa3aa;
          font-size: 6px;
        }

        .stock {
          margin-top: 7px;
          color: #27845c;
          font-size: 7px;
          font-weight: 800;
        }

        .productPrice {
          text-align: right;
        }

        .productPrice strong,
        .productPrice span {
          display: block;
        }

        .productPrice strong {
          font-size: 17px;
        }

        .productPrice span {
          margin-top: 4px;
          color: #87919a;
          font-size: 8px;
        }

        .formGrid {
          margin-top: 18px;

          display: grid;

          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 12px;
        }

        label {
          display: block;
        }

        label.full {
          grid-column: 1 / -1;
        }

        label > span {
          display: block;

          margin-bottom: 6px;

          color: #68747f;

          font-size: 7px;
          font-weight: 850;
        }

        input,
        select {
          width: 100%;
          min-height: 43px;

          box-sizing: border-box;

          padding: 0 11px;

          border: 1px solid #dce2e6;
          border-radius: 9px;

          outline: none;

          color: #35414c;
          background: white;

          font-size: 9px;
        }

        input:focus,
        select:focus {
          border-color: #1465e8;
          box-shadow: 0 0 0 3px
            rgba(20, 101, 232, 0.08);
        }

        input:disabled {
          background: #f4f6f7;
          color: #8c969e;
        }

        .paymentMethods {
          margin-top: 18px;

          display: grid;

          gap: 8px;
        }

        .payment {
          width: 100%;

          padding: 12px;

          display: grid;

          grid-template-columns:
            45px
            minmax(0, 1fr)
            auto;

          align-items: center;

          gap: 10px;

          border: 1px solid #dce2e6;
          border-radius: 11px;

          background: white;

          text-align: left;
          cursor: pointer;
        }

        .payment.active {
          border-color: #1465e8;
          box-shadow: 0 0 0 3px
            rgba(20, 101, 232, 0.06);
        }

        .paymentIcon {
          width: 42px;
          height: 42px;

          display: grid;
          place-items: center;

          border-radius: 10px;

          background: #f1f5fb;

          font-size: 17px;
          font-weight: 900;
        }

        .paymentIcon.tbc {
          color: white;
          background: #00a5df;
          font-size: 9px;
        }

        .paymentIcon.bog {
          color: white;
          background: #ef5b2a;
          font-size: 8px;
        }

        .paymentText strong,
        .paymentText small {
          display: block;
        }

        .paymentText strong {
          color: #34404b;
          font-size: 9px;
        }

        .paymentText small {
          margin-top: 3px;
          color: #8b959d;
          font-size: 7px;
        }

        .radio {
          color: #1465e8;
          font-size: 13px;
        }

        .paymentNote {
          margin-top: 12px;

          padding: 10px;

          border-radius: 8px;

          color: #73808a;
          background: #f6f8fa;

          font-size: 7px;
        }

        .summary {
          position: sticky;
          top: 20px;
        }

        .summaryProduct {
          margin-top: 18px;

          display: flex;
          justify-content: space-between;
          gap: 15px;
        }

        .summaryProduct
          > div
          > strong,
        .summaryProduct span,
        .summaryProduct small {
          display: block;
        }

        .summaryProduct
          > div
          > strong {
          font-size: 10px;
        }

        .summaryProduct span {
          margin-top: 3px;
          color: #76828c;
          font-size: 8px;
        }

        .summaryProduct small {
          margin-top: 5px;
          color: #969fa7;
          font-size: 7px;
        }

        .summaryProduct
          > strong {
          font-size: 11px;
        }

        .line {
          height: 1px;

          margin: 17px 0;

          background: #e8ecef;
        }

        .row {
          margin-top: 10px;

          display: flex;
          justify-content: space-between;

          color: #707c86;

          font-size: 8px;
        }

        .row strong {
          color: #3a4651;
        }

        .row .free {
          color: #27845c;
        }

        .total {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .total span {
          font-size: 10px;
          font-weight: 900;
        }

        .total strong {
          color: #1465e8;
          font-size: 23px;
        }

        .payButton {
          width: 100%;
          min-height: 48px;

          margin-top: 20px;
          padding: 0 15px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          border: 0;
          border-radius: 10px;

          color: white;

          background: linear-gradient(
            135deg,
            #1465e8,
            #7655f7
          );

          cursor: pointer;

          font-size: 9px;
          font-weight: 900;
        }

        .payButton:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .accountInfo {
          margin-top: 14px;

          display: flex;
          gap: 7px;

          color: #76828c;
        }

        .accountInfo span {
          color: #27845c;
        }

        .accountInfo p {
          margin: 0;
          font-size: 7px;
          line-height: 1.5;
        }

        .notFound {
          margin-top: 30px;

          padding: 60px 20px;

          border: 1px solid #dfe5e9;
          border-radius: 16px;

          background: white;

          text-align: center;
        }

        .notFound > div {
          font-size: 35px;
        }

        .notFound h2 {
          margin-top: 10px;
        }

        .notFound :global(a) {
          display: inline-flex;

          margin-top: 12px;
          padding: 10px 14px;

          border-radius: 8px;

          color: white;
          background: #1465e8;

          text-decoration: none;
          font-size: 8px;
          font-weight: 900;
        }

        footer {
          width: calc(100% - 40px);
          max-width: 1180px;

          min-height: 90px;

          margin: auto;

          display: flex;
          align-items: center;
          justify-content: space-between;

          border-top: 1px solid #dfe5e9;
        }

        footer strong {
          color: #1465e8;
          font-size: 11px;
        }

        footer span {
          color: #8c969e;
          font-size: 7px;
        }

        @media (max-width: 850px) {
          .checkoutGrid {
            grid-template-columns: 1fr;
          }

          .summary {
            position: static;
          }
        }

        @media (max-width: 600px) {
          .header {
            padding: 10px 0;
            align-items: flex-start;
            flex-direction: column;
            gap: 10px;
          }

          .shell {
            width: calc(100% - 24px);
          }

          .title h1 {
            font-size: 31px;
          }

          .product {
            grid-template-columns:
              85px
              minmax(0, 1fr);
          }

          .productImage {
            height: 85px;
          }

          .productPrice {
            grid-column: 1 / -1;
            text-align: left;
          }

          .formGrid {
            grid-template-columns: 1fr;
          }

          label.full {
            grid-column: auto;
          }

          footer {
            width: calc(100% - 24px);
            padding: 20px 0;

            align-items: flex-start;
            flex-direction: column;

            gap: 6px;
          }
        }
      `}</style>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <main
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            background: "#f5f7f8",
          }}
        >
          Loading checkout...
        </main>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
