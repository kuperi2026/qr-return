"use client";

function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <div
      style={{
        padding: "15px 0",
        borderBottom: "1px solid #DFDFE2",
      }}
    >
      <h3
        style={{
          margin: 0,
          color: "#2F3039",
          fontSize: "13px",
        }}
      >
        {question}
      </h3>

      <p
        style={{
          margin: "6px 0 0",
          color: "#63636C",
          fontSize: "11px",
          lineHeight: 1.65,
        }}
      >
        {answer}
      </p>
    </div>
  );
}

export default function FAQMenu({
  ka,
}: {
  ka: boolean;
}) {
  return (
    <section
      style={{
        background: "#F3F3F5",
        borderBottom: "1px solid #DFDFE2",
        boxShadow: "0 20px 45px rgba(23, 25, 35, 0.1)",
      }}
    >
      <div
        style={{
          width: "calc(100% - 80px)",
          maxWidth: "1240px",
          margin: "auto",
          padding: "38px 0 45px",
          display: "grid",
          gridTemplateColumns: ".7fr 1.3fr",
          gap: "55px",
        }}
      >
        <div
          style={{
            maxWidth: "620px",
          }}
        >
          <span
            style={{
              color: "#2F3039",
              fontSize: "9px",
              fontWeight: 900,
              letterSpacing: "1px",
            }}
          >
            03 · FAQ
          </span>

          <h2
            style={{
              margin: "8px 0 0",
              color: "#2F3039",
              fontSize: "25px",
              lineHeight: 1.15,
            }}
          >
            {ka
              ? "ხშირად დასმული კითხვები"
              : "Frequently Asked Questions"}
          </h2>
        </div>

        <div
          style={{
            borderTop: "1px solid #DFDFE2",
          }}
        >
          <FaqItem
            question={
              ka
                ? "რა არის QR RETURN?"
                : "What is QR RETURN?"
            }
            answer={
              ka
                ? "QR RETURN არის QR-ზე დაფუძნებული სისტემა ნივთების, ცხოველებისა და Emergency პროფილებისთვის."
                : "QR RETURN is a QR-based system for belongings, pets and Emergency profiles."
            }
          />

          <FaqItem
            question={
              ka
                ? "სჭირდება მპოვნელს რეგისტრაცია?"
                : "Does the finder need an account?"
            }
            answer={
              ka
                ? "არა. QR კოდის დასკანერებისთვის მპოვნელს რეგისტრაცია ან აპლიკაციის ჩამოტვირთვა არ სჭირდება."
                : "No. The finder does not need an account or an app."
            }
          />

          <FaqItem
            question={
              ka
                ? "ვინ განსაზღვრავს ხილულ ინფორმაციას?"
                : "Who controls visible information?"
            }
            answer={
              ka
                ? "პროფილის მფლობელი თავად ირჩევს, რომელი ინფორმაცია იყოს ხილული."
                : "The profile owner chooses what information is visible."
            }
          />

          <FaqItem
            question={
              ka
                ? "შეიძლება რამდენიმე QR პროფილის მართვა?"
                : "Can I manage multiple QR profiles?"
            }
            answer={
              ka
                ? "დიახ. ერთი ანგარიშიდან შესაძლებელია რამდენიმე QR პროფილის მართვა."
                : "Yes. Multiple QR profiles can be managed from one account."
            }
          />
        </div>
      </div>
    </section>
  );
}
