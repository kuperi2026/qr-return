export default function HomeHero({ ka }: { ka: boolean }) {
  return (
    <section className="homeHero">
      <div className="homeHeroInner">
        <article className="ecosystemCard">
          <span className="eyebrow">✦ SMART SAFETY ECOSYSTEM ✦</span>
          <h1>
            {ka
              ? "ერთი ჭკვიანი QR ეკოსისტემა — სრული სიმშვიდე შენი ცხოვრებისთვის."
              : "One smart QR ecosystem — complete peace of mind for your life."}
          </h1>
          <p>
            {ka
              ? "ჩვენ შევქმენით უსაფრთხოების თანამედროვე სისტემა, რომელიც იცავს იმას, რაც ყველაზე მეტად გიყვარს. ჩვეულებრივ დროს შენი მონაცემები სრულიად კონფიდენციალურია — ხოლო საჭიროებისას, Lost Mode (დაკარგვის რეჟიმი) გაძლევს საშუალებას, მართო უსაფრთხოება ერთი თითის დაჭერით, ნებისმიერი ადგილიდან."
              : "We created a modern safety system that protects what you love most. Your information remains completely private during everyday use — and when needed, Lost Mode lets you manage protection with a single tap, from anywhere."}
          </p>
        </article>

        <div className="heroActions">
          <a className="primaryAction" href="/signup">
            <span aria-hidden="true">●</span>
            {ka ? "დაიწყე რეგისტრაცია" : "Start registration"}
          </a>
          <a className="secondaryAction" href="/store">
            <span aria-hidden="true">◆</span>
            {ka ? "ეწვიე მაღაზიას" : "Visit the store"}
          </a>
        </div>
      </div>

      <style jsx>{`
        .homeHero {
          min-height: calc(100vh - 86px);
          padding: 74px 40px 90px;
          display: flex;
          align-items: center;
          color: #fff;
          background:
            radial-gradient(circle at 50% 18%, rgba(75, 151, 221, .28), transparent 35%),
            linear-gradient(180deg, #0a4c8a 0%, #063b72 100%);
        }
        .homeHeroInner {
          width: 100%;
          max-width: 1120px;
          margin: auto;
        }
        .ecosystemCard {
          position: relative;
          overflow: hidden;
          padding: clamp(50px, 7vw, 82px) clamp(28px, 7vw, 92px);
          border: 1px solid rgba(255,255,255,.46);
          border-radius: 34px;
          background: linear-gradient(145deg, rgba(255,255,255,.17), rgba(255,255,255,.07));
          box-shadow: 0 30px 80px rgba(0, 24, 58, .34), inset 0 1px 0 rgba(255,255,255,.25);
          backdrop-filter: blur(14px);
          text-align: center;
        }
        .ecosystemCard::before {
          content: "";
          position: absolute;
          width: 330px;
          height: 330px;
          top: -230px;
          left: calc(50% - 165px);
          border-radius: 50%;
          background: rgba(255,255,255,.16);
          filter: blur(15px);
        }
        .eyebrow {
          position: relative;
          display: block;
          color: #cfe7ff;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 2.2px;
        }
        h1 {
          position: relative;
          max-width: 900px;
          margin: 24px auto 0;
          color: #fff;
          font-size: clamp(34px, 5vw, 60px);
          line-height: 1.15;
          letter-spacing: -1.8px;
        }
        p {
          position: relative;
          max-width: 830px;
          margin: 28px auto 0;
          color: rgba(255,255,255,.86);
          font-size: clamp(15px, 1.5vw, 18px);
          line-height: 1.8;
        }
        .heroActions {
          margin-top: 28px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }
        .heroActions a {
          min-height: 62px;
          padding: 0 25px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          border: 1px solid rgba(255,255,255,.72);
          border-radius: 16px;
          font-size: 15px;
          font-weight: 900;
          text-decoration: none;
          transition: transform .2s ease, box-shadow .2s ease, background .2s ease;
        }
        .heroActions a:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 34px rgba(0,20,50,.22);
        }
        .primaryAction { background: #fff; color: #063b72; }
        .primaryAction span { color: #1e78c8; font-size: 12px; }
        .secondaryAction { background: rgba(255,255,255,.09); color: #fff; }
        .secondaryAction span { color: #bfe0ff; font-size: 12px; }

        @media (max-width: 700px) {
          .homeHero {
            min-height: calc(100vh - 72px);
            padding: 38px 14px 54px;
            align-items: flex-start;
          }
          .ecosystemCard {
            padding: 43px 20px 45px;
            border-radius: 24px;
          }
          .eyebrow { font-size: 10px; letter-spacing: 1.4px; }
          h1 {
            margin-top: 18px;
            font-size: clamp(30px, 9vw, 39px);
            line-height: 1.18;
            letter-spacing: -1px;
          }
          p {
            margin-top: 21px;
            font-size: 15px;
            line-height: 1.72;
          }
          .heroActions {
            grid-template-columns: 1fr;
            gap: 11px;
            margin-top: 18px;
          }
          .heroActions a { min-height: 58px; font-size: 14px; }
        }
      `}</style>
    </section>
  );
}
