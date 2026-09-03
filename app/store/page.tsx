"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";
import ProductInfoSection from "./ProductInfoSection";

type Lang = "ka" | "en";

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

  gallery: unknown;

  stock_quantity: number;

  active: boolean;

  featured: boolean;

  sort_order: number;

  metadata: Record<
    string,
    unknown
  > | null;
};

type QuantityMap = Record<
  string,
  number
>;

export default function StorePage() {
  const router =
    useRouter();

  const [lang, setLang] =
    useState<Lang>("ka");

  const [
    products,
    setProducts,
  ] = useState<Product[]>([]);

  const [
    quantities,
    setQuantities,
  ] = useState<QuantityMap>(
    {}
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    buyingId,
    setBuyingId,
  ] = useState<string | null>(
    null
  );

  const [
    error,
    setError,
  ] = useState("");

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("all");

  const ka =
    lang === "ka";

  useEffect(() => {
    void loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");

      const {
        data,
        error: productsError,
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
          gallery,
          stock_quantity,
          active,
          featured,
          sort_order,
          metadata
        `)
        .eq(
          "active",
          true
        )
        .order(
          "sort_order",
          {
            ascending: true,
          }
        );

      if (productsError) {
        throw productsError;
      }

      const rows =
        (data ||
          []) as Product[];

      setProducts(rows);

      const initial:
        QuantityMap = {};

      rows.forEach(
        (product) => {
          initial[
            product.id
          ] = 1;
        }
      );

      setQuantities(
        initial
      );
    } catch (err) {
      console.error(
        "Store products error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : ka
          ? "პროდუქტების ჩატვირთვა ვერ მოხერხდა."
          : "Could not load products."
      );
    } finally {
      setLoading(false);
    }
  }

  const categories = [
    "dog", "cat", "keys", "wallet", "bag", "suitcase", "parking", "emergency",
  ];

  const filteredProducts =
    useMemo(() => {
      if (
        selectedCategory ===
        "all"
      ) {
        return products;
      }

      return products.filter(
        (product) =>
          product.category ===
          selectedCategory
      );
    }, [
      products,
      selectedCategory,
    ]);

  const featuredProducts =
    useMemo(
      () =>
        products.filter(
          (product) =>
            product.featured
        ),
      [products]
    );

  function getQuantity(
    productId: string
  ) {
    return (
      quantities[
        productId
      ] || 1
    );
  }

  function decreaseQuantity(
    product: Product
  ) {
    setQuantities(
      (current) => ({
        ...current,

        [product.id]:
          Math.max(
            1,
            (current[
              product.id
            ] || 1) - 1
          ),
      })
    );
  }

  function increaseQuantity(
    product: Product
  ) {
    setQuantities(
      (current) => ({
        ...current,

        [product.id]:
          Math.min(
            Math.max(
              product.stock_quantity,
              1
            ),
            (current[
              product.id
            ] || 1) + 1
          ),
      })
    );
  }

  async function buyNow(
    product: Product
  ) {
    if (
      product.stock_quantity <=
      0
    ) {
      return;
    }

    const quantity =
      getQuantity(
        product.id
      );

    const checkoutPath =
      `/store/checkout?product=${encodeURIComponent(
        product.slug
      )}` +
      `&quantity=${quantity}`;

    try {
      setBuyingId(
        product.id
      );

      const {
        data: { user },
        error: authError,
      } =
        await supabase.auth.getUser();

      if (authError) {
        console.error(
          "Store auth error:",
          authError
        );
      }

      /*
       * REGISTRATION / LOGIN REQUIRED
       */

      if (!user) {
        const redirect =
          encodeURIComponent(
            checkoutPath
          );

        router.push(
          `/login?redirect=${redirect}`
        );

        return;
      }

      /*
       * USER IS LOGGED IN
       */

      router.push(
        checkoutPath
      );
    } finally {
      setBuyingId(null);
    }
  }

  function formatPrice(
    product: Product
  ) {
    try {
      return new Intl.NumberFormat(
        "en-US",
        {
          style: "currency",

          currency:
            product.currency ||
            "USD",
        }
      ).format(
        Number(
          product.price
        )
      );
    } catch {
      return `$${Number(
        product.price
      ).toFixed(2)}`;
    }
  }

  const categoryMeta: Record<string, { ka: string; en: string; icon: string }> = {
    dog: { ka: "ძაღლი", en: "Dog", icon: "🐶" },
    cat: { ka: "კატა", en: "Cat", icon: "🐱" },
    keys: { ka: "გასაღები", en: "Keys", icon: "🔑" },
    wallet: { ka: "საფულე", en: "Wallet", icon: "👛" },
    bag: { ka: "ჩანთა", en: "Bag", icon: "👜" },
    suitcase: { ka: "ჩემოდანი", en: "Suitcase", icon: "🧳" },
    parking: { ka: "Parking", en: "Parking", icon: "🚘" },
    emergency: { ka: "Emergency", en: "Emergency", icon: "🆘" },
  };

  function categoryTitle(category: string) {
    return categoryMeta[category]?.[ka ? "ka" : "en"] || category;
  }

  function categoryIcon(category: string) {
    return categoryMeta[category]?.icon || "◈";
  }

  if (loading) {
    return (
      <main className="loading">
        <div className="loadingLogo">
          QR
        </div>

        <strong>
          QR RETURN
        </strong>

        <span>
          {ka
            ? "მაღაზია იტვირთება..."
            : "Loading store..."}
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

            background: #ffffff;
          }

          .loadingLogo {
            width: 54px;
            height: 54px;

            display: grid;
            place-items: center;

            border-radius: 15px;

            color: white;

            background:
              linear-gradient(
                135deg,
                #1465e8,
                #7655f7
              );

            font-weight: 900;
          }

          strong {
            color: #202b37;
          }

          span {
            font-size: 13px;
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="page">
      <header className="topbar">
        <Link
          href="/"
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
              OFFICIAL STORE
            </small>
          </span>
        </Link>

        <div className="topActions">
          <Link href="/my-profiles">
            {ka
              ? "ჩემი პროფილები"
              : "My Profiles"}
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
                ka
                  ? "active"
                  : ""
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
                !ka
                  ? "active"
                  : ""
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

      <section className="hero">
        <div className="heroInner">
          <div className="heroText">
            <span className="eyebrow">
              QR RETURN STORE
            </span>

            <h1>
              {ka
                ? "აირჩიეთ თქვენი QR RETURN"
                : "Choose Your QR RETURN"}
            </h1>

            <p>
              {ka
                ? "აირჩიეთ შესაბამისი QR RETURN კატეგორია. პროდუქტის დამატების შემდეგ შეძლებთ რაოდენობის არჩევასა და შეკვეთას."
                : "Choose a QR RETURN category. Once products are available, select a quantity and order securely."}
            </p>

            <div className="heroFeatures">
              <span>
                ✓ QR RETURN Profile
              </span>

              <span>
                ✓ Live Chat
              </span>

              <span>
                ✓ Location Sharing
              </span>

              <span>
                ✓ Owner Contact
              </span>
            </div>
          </div>

          <div className="heroVisual">
            <div className="visualCard mainCard">
              <span>
                QR
              </span>

              <strong>
                RETURN
              </strong>
            </div>

            <div className="visualCard smallCard one">
              🏷️
            </div>

            <div className="visualCard smallCard two">
              🔳
            </div>

            <div className="visualGlow" />
          </div>
        </div>
      </section>

      <ProductInfoSection />

      <div className="shell">
        {error && (
          <div className="error">
            ⚠ {error}
          </div>
        )}

        {!error &&
          featuredProducts.length >
            0 && (
            <section className="featured">
              <div className="sectionHeading">
                <div>
                  <span>
                    FEATURED
                  </span>

                  <h2>
                    {ka
                      ? "რჩეული პროდუქტები"
                      : "Featured Products"}
                  </h2>
                </div>

                <p>
                  {ka
                    ? "ყველაზე პოპულარული QR RETURN პროდუქტები."
                    : "Popular QR RETURN products."}
                </p>
              </div>

              <div className="featuredGrid">
                {featuredProducts.map(
                  (product) => (
                    <FeaturedProduct
                      key={
                        product.id
                      }
                      product={
                        product
                      }
                      language={
                        lang
                      }
                      price={formatPrice(
                        product
                      )}
                      quantity={getQuantity(
                        product.id
                      )}
                      buying={
                        buyingId ===
                        product.id
                      }
                      onMinus={() =>
                        decreaseQuantity(
                          product
                        )
                      }
                      onPlus={() =>
                        increaseQuantity(
                          product
                        )
                      }
                      onBuy={() =>
                        void buyNow(
                          product
                        )
                      }
                    />
                  )
                )}
              </div>
            </section>
          )}

        <section className="catalog">
          <div className="catalogHeading">
            <div>
              <span>
                SHOP
              </span>

              <h2>
                {ka
                  ? "ყველა პროდუქტი"
                  : "All Products"}
              </h2>
            </div>

            <div className="categoryFilters">
              <button
                type="button"
                className={
                  selectedCategory ===
                  "all"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setSelectedCategory(
                    "all"
                  )
                }
              >
                {ka
                  ? "ყველა"
                  : "All"}
              </button>

              {categories.map(
                (category) => (
                  <button
                    key={
                      category
                    }
                    type="button"
                    className={
                      selectedCategory ===
                      category
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setSelectedCategory(
                        category
                      )
                    }
                  >
                    {categoryIcon(
                      category
                    )}{" "}
                    {categoryTitle(
                      category
                    )}
                  </button>
                )
              )}
            </div>
          </div>

          {filteredProducts.length ===
          0 ? (
            <div className="empty">
              <div>
                ◈
              </div>

              <strong>
                {ka
                  ? "პროდუქტები მალე დაემატება"
                  : "Products are coming soon"}
              </strong>
            </div>
          ) : (
            <div className="productsGrid">
              {filteredProducts.map(
                (product) => (
                  <ProductCard
                    key={
                      product.id
                    }
                    product={
                      product
                    }
                    language={
                      lang
                    }
                    price={formatPrice(
                      product
                    )}
                    quantity={getQuantity(
                      product.id
                    )}
                    buying={
                      buyingId ===
                      product.id
                    }
                    onMinus={() =>
                      decreaseQuantity(
                        product
                      )
                    }
                    onPlus={() =>
                      increaseQuantity(
                        product
                      )
                    }
                    onBuy={() =>
                      void buyNow(
                        product
                      )
                    }
                  />
                )
              )}
            </div>
          )}
        </section>

        <section className="how">
          <div className="sectionHeading">
            <div>
              <span>
                HOW IT WORKS
              </span>

              <h2>
                {ka
                  ? "როგორ მუშაობს"
                  : "How It Works"}
              </h2>
            </div>
          </div>

          <div className="steps">
            <Step
              number="01"
              icon="◈"
              title={
                ka
                  ? "აირჩიეთ დიზაინი"
                  : "Choose a Design"
              }
              text={
                ka
                  ? "აირჩიეთ თქვენთვის შესაბამისი QR RETURN პროდუქტი."
                  : "Select the QR RETURN product that fits your needs."
              }
            />

            <Step
              number="02"
              icon="👤"
              title={
                ka
                  ? "შედით ანგარიშში"
                  : "Sign In"
              }
              text={
                ka
                  ? "შეძენისთვის QR RETURN ანგარიში აუცილებელია."
                  : "A QR RETURN account is required to purchase."
              }
            />

            <Step
              number="03"
              icon="💳"
              title={
                ka
                  ? "გადაიხადეთ"
                  : "Pay Securely"
              }
              text={
                ka
                  ? "Checkout-ზე აირჩევთ ხელმისაწვდომ გადახდის მეთოდს."
                  : "Choose an available payment method during checkout."
              }
            />

            <Step
              number="04"
              icon="📦"
              title={
                ka
                  ? "მიიღეთ შეკვეთა"
                  : "Receive Your Order"
              }
              text={
                ka
                  ? "შეკვეთის სტატუსს თქვენს ანგარიშში გააკონტროლებთ."
                  : "Track your order status from your account."
              }
            />
          </div>
        </section>

        <section className="accountNotice">
          <div className="accountIcon">
            👤
          </div>

          <div>
            <span>
              QR RETURN ACCOUNT
            </span>

            <h3>
              {ka
                ? "შეძენისთვის ანგარიში აუცილებელია"
                : "An Account Is Required to Purchase"}
            </h3>

            <p>
              {ka
                ? "თქვენი შეკვეთა, QR პროდუქტები და მომავალი აქტივაციები ერთ ანგარიშზე იქნება დაკავშირებული."
                : "Your orders, QR products, and future activations stay connected to one account."}
            </p>
          </div>

          <Link href="/login">
            {ka
              ? "შესვლა"
              : "Sign In"}{" "}
            →
          </Link>
        </section>
      </div>

      <footer className="footer">
        <div>
          <strong>
            QR RETURN
          </strong>

          <span>
            {ka
              ? "დაკარგვა არ ნიშნავს დამშვიდობებას."
              : "Never lose what matters."}
          </span>
        </div>

        <div className="footerLinks">
          <Link href="/">
            Home
          </Link>

          <Link href="/store">
            Store
          </Link>

          <Link href="/account/orders">
            Orders
          </Link>
        </div>
      </footer>

      <style jsx>{`
        .page {
          min-height: 100vh;

          color: #202b37;

          background: #ffffff;
        }

        .topbar {
          width:
            calc(
              100% - 36px
            );

          max-width: 1180px;

          min-height: 72px;

          margin: auto;

          display: flex;

          align-items: center;

          justify-content:
            space-between;

          gap: 15px;

          border-bottom:
            1px solid #e0e5e8;
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

          background:
            linear-gradient(
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

          font-size: 13px;

          font-weight: 900;

          letter-spacing: 1px;
        }

        .topActions {
          display: flex;

          align-items: center;

          gap: 5px;
        }

        .topActions
          :global(a) {
          min-height: 32px;

          padding:
            0 9px;

          display: flex;

          align-items: center;

          border:
            1px solid #dfe4e8;

          border-radius: 8px;

          color: #57646f;

          background: white;

          text-decoration: none;

          font-size: 11px;

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

          background:
            transparent;

          cursor: pointer;

          font-size: 11px;

          font-weight: 900;
        }

        .langs button.active {
          color: #1465e8;

          background: white;
        }

        .hero {
          overflow: hidden;
          position: relative;
          color: #ffffff;
          background: #0647c8;
        }

        .hero .eyebrow {
          color: #cfe0ff;
        }

        .heroInner {
          width:
            calc(
              100% - 40px
            );

          max-width: 1180px;

          min-height: 430px;

          margin: auto;

          display: grid;

          grid-template-columns:
            minmax(
              0,
              1fr
            )
            390px;

          align-items: center;

          gap: 50px;
        }

        .eyebrow,
        .sectionHeading span,
        .catalogHeading >
          div:first-child
          span,
        .accountNotice
          > div:nth-child(2)
          > span {
          color: #7655f7;

          font-size: 11px;

          font-weight: 900;

          letter-spacing: 1.3px;
        }

        .hero h1 {
          max-width: 650px;

          margin:
            9px 0 0;

          color: #ffffff;

          font-size:
            clamp(
              43px,
              6vw,
              68px
            );

          line-height: 0.98;

          letter-spacing: -3px;
        }

        .heroText > p {
          max-width: 580px;

          margin:
            17px 0 0;

          color: rgba(255, 255, 255, 0.84);

          font-size: 16px;

          line-height: 1.75;
        }

        .heroFeatures {
          margin-top: 21px;

          display: flex;

          flex-wrap: wrap;

          gap: 7px;
        }

        .heroFeatures span {
          padding:
            7px 9px;

          border:
            1px solid #e0e6ed;

          border-radius: 999px;

          color: #586570;

          background:
            rgba(
              255,
              255,
              255,
              0.85
            );

          font-size: 11px;

          font-weight: 850;
        }

        .heroVisual {
          height: 300px;

          position: relative;
        }

        .visualCard {
          position: absolute;

          display: grid;

          place-items: center;

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.8
            );

          background:
            rgba(
              255,
              255,
              255,
              0.9
            );

          box-shadow:
            0 28px 70px
            rgba(
              30,
              54,
              92,
              0.16
            );

          backdrop-filter:
            blur(10px);
        }

        .mainCard {
          width: 200px;

          height: 200px;

          left: 80px;

          top: 50px;

          z-index: 3;

          border-radius: 44px;

          transform:
            rotate(-8deg);
        }

        .mainCard span,
        .mainCard strong {
          position: absolute;
        }

        .mainCard span {
          top: 57px;

          color: #1465e8;

          font-size: 45px;

          font-weight: 950;
        }

        .mainCard strong {
          bottom: 52px;

          color: #7655f7;

          font-size: 15px;

          letter-spacing: 4px;
        }

        .smallCard {
          width: 94px;

          height: 94px;

          z-index: 4;

          border-radius: 28px;

          font-size: 38px;
        }

        .smallCard.one {
          left: 10px;

          top: 20px;

          transform:
            rotate(9deg);
        }

        .smallCard.two {
          right: 5px;

          bottom: 15px;

          transform:
            rotate(12deg);
        }

        .visualGlow {
          width: 250px;

          height: 250px;

          position: absolute;

          left: 70px;

          top: 25px;

          border-radius: 50%;

          background:
            rgba(
              118,
              85,
              247,
              0.12
            );

          filter:
            blur(30px);
        }

        .shell {
          width:
            calc(
              100% - 40px
            );

          max-width: 1180px;

          margin: auto;

          padding:
            65px 0 90px;
        }

        .error {
          padding: 13px;

          border:
            1px solid #efd2d4;

          border-radius: 10px;

          color: #9d4146;

          background: #fff5f5;

          font-size: 12px;
        }

        .featured,
        .catalog,
        .how {
          margin-top: 20px;
        }

        .catalog,
        .how {
          margin-top: 70px;
        }

        .sectionHeading,
        .catalogHeading {
          display: flex;

          align-items: flex-end;

          justify-content:
            space-between;

          gap: 25px;
        }

        .sectionHeading h2,
        .catalogHeading h2 {
          margin:
            5px 0 0;

          color: #293540;

          font-size: 27px;

          letter-spacing:
            -0.8px;
        }

        .sectionHeading > p {
          max-width: 400px;

          margin: 0;

          color: #89939d;

          font-size: 12px;
        }

        .featuredGrid {
          margin-top: 20px;

          display: grid;

          grid-template-columns:
            repeat(
              2,
              minmax(
                0,
                1fr
              )
            );

          gap: 14px;
        }

        .categoryFilters {
          display: flex;

          flex-wrap: wrap;

          justify-content:
            flex-end;

          gap: 5px;
        }

        .categoryFilters button {
          min-height: 31px;

          padding:
            0 10px;

          border:
            1px solid #dce2e6;

          border-radius: 999px;

          color: #68747f;

          background: white;

          cursor: pointer;

          font-size: 11px;

          font-weight: 850;
        }

        .categoryFilters
          button.active {
          color: white;

          border-color:
            #202b37;

          background:
            #202b37;
        }

        .productsGrid {
          margin-top: 20px;

          display: grid;

          grid-template-columns:
            repeat(
              3,
              minmax(
                0,
                1fr
              )
            );

          gap: 14px;
        }

        .empty {
          margin-top: 20px;

          padding:
            55px 20px;

          border:
            1px solid #e0e5e8;

          border-radius: 15px;

          color: #8a949d;

          background: white;

          text-align: center;
        }

        .empty div {
          font-size: 34px;
        }

        .empty strong {
          display: block;

          margin-top: 10px;
        }

        .steps {
          margin-top: 20px;

          display: grid;

          grid-template-columns:
            repeat(
              4,
              minmax(
                0,
                1fr
              )
            );

          gap: 10px;
        }

        .accountNotice {
          margin-top: 70px;

          padding: 23px;

          display: grid;

          grid-template-columns:
            auto
            minmax(
              0,
              1fr
            )
            auto;

          align-items: center;

          gap: 16px;

          border:
            1px solid #dbe5f4;

          border-radius: 17px;

          background:
            linear-gradient(
              135deg,
              #f8fbff,
              #f7f5ff
            );
        }

        .accountIcon {
          width: 54px;

          height: 54px;

          display: grid;

          place-items: center;

          border-radius: 14px;

          background: white;

          font-size: 23px;
        }

        .accountNotice h3 {
          margin:
            5px 0 0;

          color: #34404b;

          font-size: 15px;
        }

        .accountNotice p {
          max-width: 650px;

          margin:
            5px 0 0;

          color: #7e8992;

          font-size: 12px;

          line-height: 1.6;
        }

        .accountNotice
          :global(a) {
          min-height: 38px;

          padding:
            0 12px;

          display: flex;

          align-items: center;

          border-radius: 9px;

          color: white;

          background:
            #1465e8;

          text-decoration: none;

          font-size: 12px;

          font-weight: 900;
        }

        .footer {
          width:
            calc(
              100% - 40px
            );

          max-width: 1180px;

          min-height: 90px;

          margin: auto;

          display: flex;

          align-items: center;

          justify-content:
            space-between;

          gap: 20px;

          border-top:
            1px solid #dfe4e8;
        }

        .footer strong,
        .footer span {
          display: block;
        }

        .footer strong {
          color: #1465e8;

          font-size: 12px;
        }

        .footer span {
          margin-top: 3px;

          color: #929ca5;

          font-size: 11px;
        }

        .footerLinks {
          display: flex;

          gap: 12px;
        }

        .footerLinks
          :global(a) {
          color: #68747f;

          text-decoration: none;

          font-size: 11px;

          font-weight: 850;
        }

        @media (
          max-width: 900px
        ) {
          .heroInner {
            grid-template-columns:
              1fr
              300px;
          }

          .productsGrid {
            grid-template-columns:
              repeat(
                2,
                minmax(
                  0,
                  1fr
                )
              );
          }

          .steps {
            grid-template-columns:
              repeat(
                2,
                minmax(
                  0,
                  1fr
                )
              );
          }
        }

        @media (
          max-width: 700px
        ) {
          .topbar {
            padding:
              10px 0;

            align-items:
              flex-start;

            flex-direction:
              column;
          }

          .topActions {
            width: 100%;

            flex-wrap: wrap;
          }

          .heroInner {
            padding:
              50px 0;

            grid-template-columns:
              1fr;
          }

          .heroVisual {
            display: none;
          }

          .sectionHeading,
          .catalogHeading {
            align-items:
              flex-start;

            flex-direction:
              column;
          }

          .categoryFilters {
            justify-content:
              flex-start;
          }

          .featuredGrid,
          .productsGrid {
            grid-template-columns:
              1fr;
          }

          .accountNotice {
            grid-template-columns:
              1fr;
          }

          .accountNotice
            :global(a) {
            justify-self:
              flex-start;
          }
        }

        @media (
          max-width: 500px
        ) {
          .shell {
            width:
              calc(
                100% - 24px
              );
          }

          .heroInner {
            width:
              calc(
                100% - 24px
              );
          }

          .hero h1 {
            font-size: 42px;
          }

          .steps {
            grid-template-columns:
              1fr;
          }

          .footer {
            width:
              calc(
                100% - 24px
              );

            padding:
              20px 0;

            align-items:
              flex-start;

            flex-direction:
              column;
          }
        }
      `}</style>
    </main>
  );
}

function ProductCard({
  product,
  language,
  price,
  quantity,
  buying,
  onMinus,
  onPlus,
  onBuy,
}: {
  product: Product;

  language: Lang;

  price: string;

  quantity: number;

  buying: boolean;

  onMinus: () => void;

  onPlus: () => void;

  onBuy: () => void;
}) {
  const ka =
    language === "ka";

  const soldOut =
    product.stock_quantity <=
    0;

  return (
    <article className="productCard">
      <div className="imageArea">
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
              {({ dog:"🐶", cat:"🐱", keys:"🔑", wallet:"👛", bag:"👜", suitcase:"🧳", parking:"🚘", emergency:"🆘" } as Record<string,string>)[product.category] || "QR"}
            </span>

            <strong>
              QR
            </strong>
          </div>
        )}

        {product.featured && (
          <span className="featuredBadge">
            FEATURED
          </span>
        )}

        {soldOut && (
          <span className="soldBadge">
            SOLD OUT
          </span>
        )}
      </div>

      <div className="body">
        <div className="productTop">
          <div>
            <span className="category">
              {product.category}
            </span>

            <h3>
              {product.name}
            </h3>

            {product.design_name && (
              <strong className="design">
                {
                  product.design_name
                }
              </strong>
            )}
          </div>

          <strong className="price">
            {price}
          </strong>
        </div>

        {product.description && (
          <p>
            {
              product.description
            }
          </p>
        )}

        <div className="meta">
          <span>
            SKU:{" "}
            {product.sku}
          </span>

          <span>
            {soldOut
              ? ka
                ? "არ არის მარაგში"
                : "Out of stock"
              : ka
              ? `მარაგში: ${product.stock_quantity}`
              : `In stock: ${product.stock_quantity}`}
          </span>
        </div>

        <div className="buyRow">
          <div className="quantity">
            <button
              type="button"
              onClick={
                onMinus
              }
              disabled={
                quantity <= 1
              }
            >
              −
            </button>

            <strong>
              {quantity}
            </strong>

            <button
              type="button"
              onClick={
                onPlus
              }
              disabled={
                soldOut ||
                quantity >=
                  product.stock_quantity
              }
            >
              +
            </button>
          </div>

          <button
            type="button"
            className="buy"
            disabled={
              soldOut ||
              buying
            }
            onClick={
              onBuy
            }
          >
            {buying
              ? ka
                ? "იტვირთება..."
                : "Loading..."
              : ka
              ? "ყიდვა"
              : "Buy Now"}

            {!buying && (
              <span>
                →
              </span>
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        .productCard {
          overflow: hidden;

          border:
            1px solid #e0e5e8;

          border-radius: 16px;

          background: white;

          transition:
            transform
            0.18s ease,
            box-shadow
            0.18s ease;
        }

        .productCard:hover {
          transform:
            translateY(-3px);

          box-shadow:
            0 18px 45px
            rgba(
              30,
              54,
              92,
              0.08
            );
        }

        .imageArea {
          height: 225px;

          position: relative;

          overflow: hidden;

          background:
            linear-gradient(
              145deg,
              #edf4ff,
              #f3efff
            );
        }

        .imageArea img {
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
          font-size: 62px;
        }

        .placeholder strong {
          position: absolute;

          right: 15px;

          bottom: 13px;

          color:
            rgba(
              20,
              101,
              232,
              0.3
            );

          font-size: 30px;
        }

        .featuredBadge,
        .soldBadge {
          position: absolute;

          top: 11px;

          padding:
            6px 8px;

          border-radius: 999px;

          color: white;

          font-size: 5px;

          font-weight: 900;
        }

        .featuredBadge {
          left: 11px;

          background:
            #7655f7;
        }

        .soldBadge {
          right: 11px;

          background:
            #c84a50;
        }

        .body {
          padding: 16px;
        }

        .productTop {
          display: flex;

          align-items:
            flex-start;

          justify-content:
            space-between;

          gap: 14px;
        }

        .category {
          color: #7655f7;

          font-size: 13px;

          font-weight: 900;

          text-transform:
            uppercase;
        }

        h3 {
          margin:
            4px 0 0;

          color: #34404b;

          font-size: 14px;
        }

        .design {
          display: block;

          margin-top: 3px;

          color: #7e8992;

          font-size: 12px;
        }

        .price {
          flex: 0 0 auto;

          color: #202b37;

          font-size: 15px;
        }

        p {
          min-height: 40px;

          margin:
            10px 0 0;

          color: #7f8a94;

          font-size: 12px;

          line-height: 1.65;
        }

        .meta {
          margin-top: 12px;

          padding-top: 10px;

          display: flex;

          justify-content:
            space-between;

          gap: 8px;

          border-top:
            1px solid #edf0f2;
        }

        .meta span {
          color: #949da5;

          font-size: 13px;
        }

        .buyRow {
          margin-top: 14px;

          display: grid;

          grid-template-columns:
            auto
            minmax(
              0,
              1fr
            );

          gap: 8px;
        }

        .quantity {
          min-height: 42px;

          display: grid;

          grid-template-columns:
            32px
            32px
            32px;

          align-items: center;

          border:
            1px solid #dce2e6;

          border-radius: 9px;

          overflow: hidden;
        }

        .quantity button {
          height: 100%;

          border: 0;

          color: #53606b;

          background: #f8fafb;

          cursor: pointer;

          font-size: 14px;
        }

        .quantity button:disabled {
          opacity: 0.35;

          cursor: not-allowed;
        }

        .quantity strong {
          text-align: center;

          font-size: 13px;
        }

        .buy {
          min-height: 42px;

          padding:
            0 12px;

          display: flex;

          align-items: center;

          justify-content:
            space-between;

          border: 0;

          border-radius: 9px;

          color: white;

          background: #1465e8;

          cursor: pointer;

          font-size: 12px;

          font-weight: 900;
        }

        .buy:disabled {
          opacity: 0.5;

          cursor: not-allowed;
        }
      `}</style>
    </article>
  );
}

function FeaturedProduct({
  product,
  language,
  price,
  quantity,
  buying,
  onMinus,
  onPlus,
  onBuy,
}: {
  product: Product;

  language: Lang;

  price: string;

  quantity: number;

  buying: boolean;

  onMinus: () => void;

  onPlus: () => void;

  onBuy: () => void;
}) {
  const ka =
    language === "ka";

  const soldOut =
    product.stock_quantity <=
    0;

  return (
    <article className="featuredCard">
      <div className="visual">
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
            {({ dog:"🐶", cat:"🐱", keys:"🔑", wallet:"👛", bag:"👜", suitcase:"🧳", parking:"🚘", emergency:"🆘" } as Record<string,string>)[product.category] || "QR"}
          </div>
        )}
      </div>

      <div className="content">
        <span className="label">
          QR RETURN FEATURED
        </span>

        <h3>
          {product.name}
        </h3>

        {product.design_name && (
          <strong className="design">
            {
              product.design_name
            }
          </strong>
        )}

        <p>
          {product.description ||
            (ka
              ? "QR RETURN პროდუქტი."
              : "QR RETURN product.")}
        </p>

        <div className="price">
          {price}
        </div>

        <div className="actions">
          <div className="quantity">
            <button
              type="button"
              onClick={
                onMinus
              }
              disabled={
                quantity <= 1
              }
            >
              −
            </button>

            <strong>
              {quantity}
            </strong>

            <button
              type="button"
              onClick={
                onPlus
              }
              disabled={
                soldOut ||
                quantity >=
                  product.stock_quantity
              }
            >
              +
            </button>
          </div>

          <button
            type="button"
            className="buy"
            disabled={
              soldOut ||
              buying
            }
            onClick={
              onBuy
            }
          >
            {buying
              ? ka
                ? "იტვირთება..."
                : "Loading..."
              : ka
              ? "ახლავე ყიდვა"
              : "Buy Now"}{" "}
            →
          </button>
        </div>
      </div>

      <style jsx>{`
        .featuredCard {
          min-height: 270px;

          overflow: hidden;

          display: grid;

          grid-template-columns:
            45%
            minmax(
              0,
              1fr
            );

          border:
            1px solid #dfe4e8;

          border-radius: 18px;

          background: white;

          box-shadow:
            0 18px 45px
            rgba(
              30,
              54,
              92,
              0.05
            );
        }

        .visual {
          min-height: 270px;

          background:
            linear-gradient(
              145deg,
              #edf4ff,
              #f3efff
            );
        }

        .visual img {
          width: 100%;

          height: 100%;

          object-fit: cover;
        }

        .placeholder {
          width: 100%;

          height: 100%;

          display: grid;

          place-items: center;

          font-size: 70px;
        }

        .content {
          padding: 23px;

          display: flex;

          flex-direction: column;

          justify-content:
            center;
        }

        .label {
          color: #7655f7;

          font-size: 13px;

          font-weight: 900;

          letter-spacing: 1px;
        }

        h3 {
          margin:
            7px 0 0;

          color: #303c47;

          font-size: 20px;
        }

        .design {
          display: block;

          margin-top: 4px;

          color: #77838e;

          font-size: 12px;
        }

        p {
          margin:
            12px 0 0;

          color: #818c96;

          font-size: 12px;

          line-height: 1.7;
        }

        .price {
          margin-top: 15px;

          color: #202b37;

          font-size: 24px;

          font-weight: 900;
        }

        .actions {
          margin-top: 16px;

          display: grid;

          grid-template-columns:
            auto
            minmax(
              0,
              1fr
            );

          gap: 7px;
        }

        .quantity {
          min-height: 40px;

          display: grid;

          grid-template-columns:
            30px
            30px
            30px;

          border:
            1px solid #dce2e6;

          border-radius: 8px;

          overflow: hidden;
        }

        .quantity button {
          border: 0;

          background: #f7f9fa;

          cursor: pointer;
        }

        .quantity strong {
          display: grid;

          place-items: center;

          font-size: 12px;
        }

        .buy {
          border: 0;

          border-radius: 8px;

          color: white;

          background: #1465e8;

          cursor: pointer;

          font-size: 12px;

          font-weight: 900;
        }

        .buy:disabled {
          opacity: 0.5;
        }

        @media (
          max-width: 600px
        ) {
          .featuredCard {
            grid-template-columns:
              1fr;
          }

          .visual {
            min-height: 220px;
          }
        }
      `}</style>
    </article>
  );
}

function Step({
  number,
  icon,
  title,
  text,
}: {
  number: string;

  icon: string;

  title: string;

  text: string;
}) {
  return (
    <article className="step">
      <div className="top">
        <span className="number">
          {number}
        </span>

        <span className="icon">
          {icon}
        </span>
      </div>

      <strong>
        {title}
      </strong>

      <p>
        {text}
      </p>

      <style jsx>{`
        .step {
          min-height: 170px;

          padding: 17px;

          border:
            1px solid #e0e5e8;

          border-radius: 13px;

          background: white;
        }

        .top {
          display: flex;

          align-items: center;

          justify-content:
            space-between;
        }

        .number {
          color: #7655f7;

          font-size: 11px;

          font-weight: 900;
        }

        .icon {
          font-size: 19px;
        }

        strong {
          display: block;

          margin-top: 32px;

          color: #35414c;

          font-size: 11px;
        }

        p {
          margin:
            7px 0 0;

          color: #89939d;

          font-size: 12px;

          line-height: 1.6;
        }
      `}</style>
    </article>
  );
}
