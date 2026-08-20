"use client";

type ProductId =
  | "dog"
  | "cat"
  | "keys"
  | "wallet"
  | "luggage"
  | "bag";

type ProductItem = {
  id: ProductId;
  label: string;
  image?: string;
};

type PositionMap = {
  x?: number;
  y?: number;
  scale?: number;
};

type Props = {
  products?: ProductItem[];

  animated?: boolean;
  animationSeconds?: number;

  orbitScale?: number;
  productScale?: number;

  positions?: Partial<
    Record<ProductId, PositionMap>
  >;
};

const defaultProducts: ProductItem[] = [
  {
    id: "dog",
    label: "ძაღლი",
    image:
      "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=700&q=88",
  },
  {
    id: "cat",
    label: "კატა",
    image:
      "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=700&q=88",
  },
  {
    id: "keys",
    label: "სახლის + მანქანის გასაღები",
  },
  {
    id: "wallet",
    label: "საფულე",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=700&q=88",
  },
  {
    id: "luggage",
    label: "ჩემოდანი",
    image:
      "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=700&q=88",
  },
  {
    id: "bag",
    label: "ჩანთა",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=88",
  },
];

const defaultPositions: Record<
  ProductId,
  PositionMap
> = {
  dog: {
    x: 0,
    y: 0,
    scale: 100,
  },

  cat: {
    x: 0,
    y: 0,
    scale: 100,
  },

  keys: {
    x: 0,
    y: 0,
    scale: 100,
  },

  wallet: {
    x: 0,
    y: 0,
    scale: 100,
  },

  luggage: {
    x: 0,
    y: 0,
    scale: 100,
  },

  bag: {
    x: 0,
    y: 0,
    scale: 100,
  },
};

export default function ProductOrbit({
  products = defaultProducts,

  animated = true,
  animationSeconds = 18,

  orbitScale = 100,
  productScale = 100,

  positions = {},
}: Props) {
  return (
    <div className="ecosystem">
      <div
        className="orbit outer"
        style={{
          transform: `
            translate(-50%, -50%)
            scale(${orbitScale / 100})
          `,
        }}
      />

      <div
        className="orbit inner"
        style={{
          transform: `
            translate(-50%, -50%)
            scale(${orbitScale / 100})
          `,
        }}
      />

      <div
        className={
          animated
            ? "products animated"
            : "products"
        }
        style={{
          animationDuration: `${animationSeconds}s`,
        }}
      >
        {products.map((product) => {
          const config = {
            ...defaultPositions[product.id],
            ...positions[product.id],
          };

          const scale =
            ((config.scale || 100) *
              productScale) /
            10000;

          return (
            <article
              key={product.id}
              className={`product ${product.id}`}
              style={{
                transform: `
                  translate(
                    ${config.x || 0}px,
                    ${config.y || 0}px
                  )
                  scale(${scale})
                `,
              }}
            >
              <div className="image">
                {product.id === "keys" &&
                !product.image ? (
                  <KeysVisual />
                ) : (
                  <img
                    src={product.image}
                    alt={product.label}
                  />
                )}

                <div className="shade" />

                <div
                  className={`qrTag ${product.id}`}
                >
                  <span className="hole" />

                  <MiniQR />
                </div>

                {product.id ===
                  "luggage" && (
                  <span className="airport">
                    AIRPORT
                  </span>
                )}
              </div>

              <strong>
                {product.label}
              </strong>
            </article>
          );
        })}
      </div>

      <style jsx>{`
        .ecosystem {
          width: 590px;
          height: 600px;

          position: relative;

          margin: 0 auto;
        }

        .orbit {
          position: absolute;

          top: 50%;
          left: 50%;

          border-radius: 50%;

          transform-origin: center;
        }

        .outer {
          width: 500px;
          height: 500px;

          border:
            1px solid
            rgba(
              86,
              104,
              126,
              0.11
            );
        }

        .inner {
          width: 385px;
          height: 385px;

          border:
            1px dashed
            rgba(
              86,
              104,
              126,
              0.08
            );
        }

        .products {
          position: absolute;
          inset: 0;
        }

        .products.animated {
          animation:
            orbitMove
            18s
            ease-in-out
            infinite alternate;
        }

        @keyframes orbitMove {
          from {
            rotate: -1.1deg;
          }

          to {
            rotate: 1.1deg;
          }
        }

        .product {
          width: 116px;

          position: absolute;

          text-align: center;

          transform-origin: center;
        }

        .image {
          width: 116px;
          height: 92px;

          position: relative;

          overflow: hidden;

          border:
            4px solid
            rgba(
              255,
              255,
              255,
              0.95
            );

          border-radius: 18px;

          background: #e1e4e7;

          box-shadow:
            0 13px 28px
            rgba(
              31,
              41,
              54,
              0.11
            );
        }

        .image > img {
          width: 100%;
          height: 100%;

          object-fit: cover;
        }

        .shade {
          position: absolute;
          inset: 0;

          pointer-events: none;

          background:
            linear-gradient(
              180deg,
              transparent 58%,
              rgba(
                7,
                11,
                16,
                0.13
              )
            );
        }

        .product > strong {
          display: inline-block;

          max-width: 130px;

          margin-top: 8px;
          padding: 5px 8px;

          border:
            1px solid
            rgba(
              221,
              225,
              228,
              0.92
            );

          border-radius: 999px;

          color: #465260;

          background:
            rgba(
              255,
              255,
              255,
              0.9
            );

          font-size: 8px;
          font-weight: 800;
          line-height: 1.3;
        }

        .qrTag {
          width: 26px;
          height: 32px;

          position: absolute;

          display: grid;
          place-items: center;

          border-radius: 6px;

          background: white;

          box-shadow:
            0 4px 10px
            rgba(
              0,
              0,
              0,
              0.13
            );
        }

        .hole {
          width: 7px;
          height: 7px;

          position: absolute;

          top: -5px;

          border:
            1px solid #919ba5;

          border-radius: 50%;
        }

        .qrTag.dog,
        .qrTag.cat {
          left: 50%;
          bottom: -3px;

          transform:
            translateX(-50%)
            scale(0.7);
        }

        .qrTag.keys,
        .qrTag.wallet {
          right: 9px;
          bottom: 8px;

          transform:
            scale(0.72);
        }

        .qrTag.luggage {
          top: 12px;
          left: 50%;

          transform:
            translateX(-50%)
            scale(0.72);
        }

        .qrTag.bag {
          top: 17px;
          right: 13px;

          transform:
            scale(0.72);
        }

        .airport {
          position: absolute;

          left: 6px;
          bottom: 6px;

          padding: 4px 5px;

          border-radius: 999px;

          color: #42505f;

          background:
            rgba(
              255,
              255,
              255,
              0.88
            );

          font-size: 5px;
          font-weight: 900;
        }

        .dog {
          top: 25px;
          left: 92px;
        }

        .cat {
          top: 25px;
          right: 88px;
        }

        .keys {
          top: 236px;
          left: 2px;
        }

        .wallet {
          top: 236px;
          right: 2px;
        }

        .luggage {
          left: 93px;
          bottom: 28px;
        }

        .bag {
          right: 88px;
          bottom: 28px;
        }

        @media (max-width: 650px) {
          .ecosystem {
            width: 350px;
            height: 600px;
          }

          .outer {
            width: 330px;
            height: 330px;
          }

          .inner {
            width: 260px;
            height: 260px;
          }

          .product {
            width: 92px;
          }

          .image {
            width: 92px;
            height: 74px;
          }

          .product > strong {
            max-width: 105px;

            font-size: 6px;
          }

          .dog {
            left: 12px;
            top: 40px;
          }

          .cat {
            right: 12px;
            top: 40px;
          }

          .keys {
            left: -5px;
            top: 245px;
          }

          .wallet {
            right: -5px;
            top: 245px;
          }

          .luggage {
            left: 18px;
            bottom: 52px;
          }

          .bag {
            right: 18px;
            bottom: 52px;
          }
        }
      `}</style>
    </div>
  );
}

function KeysVisual() {
  return (
    <div className="keys">
      <div className="houseKey">
        <span className="circle" />
        <span className="stem" />
        <span className="teeth" />
      </div>

      <div className="carKey">
        <span className="ring" />

        <div className="fob">
          <span />
          <span />
        </div>
      </div>

      <style jsx>{`
        .keys {
          width: 100%;
          height: 100%;

          position: relative;

          overflow: hidden;

          background:
            linear-gradient(
              145deg,
              #ece4d9,
              #f7f3ed
            );
        }

        .houseKey {
          position: absolute;

          left: 17px;
          top: 27px;

          transform:
            rotate(-19deg);
        }

        .circle {
          width: 29px;
          height: 29px;

          display: block;

          border:
            7px solid #c1a569;

          border-radius: 50%;
        }

        .stem {
          width: 52px;
          height: 8px;

          position: absolute;

          left: 24px;
          top: 11px;

          border-radius: 3px;

          background: #c1a569;
        }

        .teeth {
          width: 17px;
          height: 14px;

          position: absolute;

          left: 65px;
          top: 13px;

          border-right:
            6px solid #c1a569;

          border-bottom:
            6px solid #c1a569;
        }

        .carKey {
          position: absolute;

          right: 20px;
          bottom: 11px;

          transform:
            rotate(12deg);
        }

        .ring {
          width: 20px;
          height: 20px;

          position: absolute;

          top: -8px;
          left: 8px;

          border:
            4px solid #9ca4ad;

          border-radius: 50%;
        }

        .fob {
          width: 40px;
          height: 55px;

          padding: 12px 9px;

          display: grid;
          gap: 6px;

          border-radius: 11px;

          background:
            linear-gradient(
              145deg,
              #606a75,
              #2b3138
            );

          box-shadow:
            0 8px 15px
            rgba(
              24,
              30,
              37,
              0.18
            );
        }

        .fob span {
          height: 7px;

          border-radius: 999px;

          background: #9199a2;
        }
      `}</style>
    </div>
  );
}

function MiniQR() {
  const active = [
    0, 1, 2,
    4,
    6, 7, 8,
    10, 12,
    14, 15,
    17, 18,
    20, 21, 22,
    24,
  ];

  return (
    <div className="qr">
      {Array.from({
        length: 25,
      }).map((_, index) => (
        <span
          key={index}
          className={
            active.includes(index)
              ? "active"
              : ""
          }
        />
      ))}

      <style jsx>{`
        .qr {
          width: 24px;
          height: 24px;

          display: grid;

          grid-template-columns:
            repeat(5, 1fr);

          gap: 1.3px;
        }

        .qr span {
          background: #dfe4e8;
        }

        .qr span.active {
          background: #17212b;
        }
      `}</style>
    </div>
  );
}
