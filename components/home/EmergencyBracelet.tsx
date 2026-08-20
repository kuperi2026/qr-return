"use client";

type Props = {
  scale?: number;
  rotate?: number;
  x?: number;
  y?: number;
};

export default function EmergencyBracelet({
  scale = 100,
  rotate = -4,
  x = 0,
  y = 0,
}: Props) {
  return (
    <div
      className="bracelet"
      style={{
        transform: `
          translate(${x}px, ${y}px)
          scale(${scale / 100})
          rotate(${rotate}deg)
        `,
      }}
    >
      <div className="strap red" />

      <div className="plate">
        <div className="emergencyText">
          + EMERGENCY QR
        </div>

        <QRCode />

        <div className="brand">
          QR RETURN
        </div>
      </div>

      <div className="strap blue" />

      <style jsx>{`
        .bracelet {
          width: 470px;
          height: 150px;

          display: flex;
          align-items: center;

          transform-origin: left center;
        }

        .strap {
          height: 48px;
          flex: 1;
        }

        .red {
          border-radius: 25px 0 0 25px;

          background: linear-gradient(
            180deg,
            #df4a50,
            #bd343b
          );
        }

        .blue {
          border-radius: 0 25px 25px 0;

          background: linear-gradient(
            180deg,
            #2e79bd,
            #155c9c
          );
        }

        .plate {
          width: 150px;
          height: 112px;
          flex: 0 0 150px;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          border: 4px solid #b9c0c6;
          border-radius: 24px;

          background: #ffffff;

          box-shadow:
            0 18px 34px
            rgba(29, 38, 49, 0.16);
        }

        .emergencyText {
          margin-bottom: 5px;

          color: #a44045;

          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.4px;
        }

        .brand {
          margin-top: 4px;

          color: #17212b;

          font-size: 6px;
          font-weight: 900;
          letter-spacing: 0.6px;
        }

        @media (max-width: 650px) {
          .bracelet {
            transform-origin: left center;
          }
        }
      `}</style>
    </div>
  );
}

function QRCode() {
  const active = [
    0, 1, 2,
    5, 6, 7,
    9, 11,
    13, 14,
    16, 18,
    20, 21, 22,
    24,
    26, 27, 28,
    30,
    32,
    34, 35, 36,
    38,
    40,
    42, 43, 44,
    46, 47, 48,
  ];

  return (
    <div className="qr">
      {Array.from({ length: 49 }).map((_, index) => (
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
          width: 58px;
          height: 58px;

          display: grid;
          grid-template-columns:
            repeat(7, 1fr);

          gap: 2px;
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
