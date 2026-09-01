const products = [
  { id: "dog", ka: "ძაღლი", en: "Dog" },
  { id: "cat", ka: "კატა", en: "Cat" },
  { id: "keys", ka: "გასაღები", en: "Keys" },
  { id: "wallet", ka: "საფულე", en: "Wallet" },
  { id: "bag", ka: "ჩანთა", en: "Bag" },
  { id: "suitcase", ka: "ჩემოდანი", en: "Suitcase" },
  { id: "emergency", ka: "Emergency", en: "Emergency" },
];

export default function HomeHero({ ka }: { ka: boolean }) {
  return (
    <section className="homeHero">
      <div className="homeHeroInner">
        <div className="heroStage">
          <article className="ecosystemCircle">
            <span className="eyebrow">✦ SMART SAFETY ECOSYSTEM ✦</span>
            <h1>{ka ? "ერთი ჭკვიანი QR ეკოსისტემა — სრული სიმშვიდე შენი ცხოვრებისთვის." : "One smart QR ecosystem — complete peace of mind for your life."}</h1>
            <p>{ka ? "ჩვენ შევქმენით უსაფრთხოების თანამედროვე სისტემა, რომელიც იცავს იმას, რაც ყველაზე მეტად გიყვარს. ჩვეულებრივ დროს შენი მონაცემები სრულიად კონფიდენციალურია — ხოლო საჭიროებისას, Lost Mode გაძლევს საშუალებას, მართო უსაფრთხოება ერთი შეხებით, ნებისმიერი ადგილიდან." : "We created a modern safety system that protects what you love most. Your information remains private during everyday use — and when needed, Lost Mode lets you manage protection with one tap, from anywhere."}</p>
          </article>
          <div className="stageAccent" aria-hidden="true">
            <span>QR</span><strong>RETURN</strong><small>ONE SYSTEM · SEVEN WAYS TO PROTECT</small>
          </div>
        </div>

        <section className="productShowcase" aria-label={ka ? "QR RETURN პროდუქტები" : "QR RETURN products"}>
          <div className="productHeading">
            <span>QR RETURN · PRODUCTS</span>
            <h2>{ka ? "ერთი სისტემა — ყველაფრისთვის, რაც მნიშვნელოვანია." : "One system — for everything that matters."}</h2>
          </div>
          <div className="productRail">
            {products.map((product, index) => (
              <a href="/store" className="productItem" key={product.id}>
                <small>{String(index + 1).padStart(2, "0")}</small>
                <span className="productImage"><img src={`/products/models/${product.id}.png`} alt={ka ? product.ka : product.en} /></span>
                <strong>{ka ? product.ka : product.en}</strong>
              </a>
            ))}
          </div>
        </section>

        <div className="heroActions">
          <a className="primaryAction" href="/store"><span aria-hidden="true">◆</span>{ka ? "მაღაზია" : "Store"}</a>
          <a className="secondaryAction" href="/signup"><span aria-hidden="true">●</span>{ka ? "რეგისტრაცია" : "Registration"}</a>
        </div>
      </div>

      <style jsx>{`
        .homeHero{min-height:calc(100vh - 86px);padding:54px 40px 86px;color:#fff;background:radial-gradient(circle at 21% 17%,rgba(78,166,238,.3),transparent 30%),linear-gradient(180deg,#0a4c8a 0%,#063b72 100%)}
        .homeHeroInner{width:100%;max-width:1280px;margin:auto}.heroStage{min-height:570px;position:relative;display:flex;align-items:center;justify-content:flex-start}
        .ecosystemCircle{width:min(570px,48vw);aspect-ratio:1;padding:64px;position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,.5);border-radius:50%;background:linear-gradient(145deg,rgba(255,255,255,.2),rgba(255,255,255,.065));box-shadow:0 34px 90px rgba(0,21,52,.37),inset 0 1px 0 rgba(255,255,255,.28);backdrop-filter:blur(15px);text-align:center}
        .ecosystemCircle:before,.ecosystemCircle:after{content:"";position:absolute;border-radius:50%;pointer-events:none}.ecosystemCircle:before{inset:17px;border:1px solid rgba(255,255,255,.14)}.ecosystemCircle:after{width:24px;height:24px;top:55px;right:48px;background:#b9e2ff;box-shadow:0 0 30px rgba(185,226,255,.8)}
        .eyebrow{color:#d3ebff;font-size:11px;font-weight:900;letter-spacing:1.8px}h1{max-width:470px;margin:22px auto 0;color:#fff;font-size:clamp(31px,3.35vw,48px);line-height:1.13;letter-spacing:-1.5px}p{max-width:445px;margin:22px auto 0;color:rgba(255,255,255,.83);font-size:14px;line-height:1.72}
        .stageAccent{width:54%;height:330px;margin-left:-32px;padding:0 40px 0 105px;display:flex;flex-direction:column;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,.2);border-left:0;border-radius:0 180px 180px 0;background:rgba(2,44,87,.28);text-align:center}.stageAccent span{color:rgba(255,255,255,.13);font-size:104px;font-weight:950;line-height:.8;letter-spacing:-9px}.stageAccent strong{margin-top:10px;font-size:clamp(30px,4vw,54px);letter-spacing:8px}.stageAccent small{margin-top:18px;color:#acd7fb;font-size:9px;font-weight:900;letter-spacing:1.7px}
        .productShowcase{margin-top:42px;padding-top:31px;border-top:1px solid rgba(255,255,255,.24)}.productHeading{display:flex;align-items:flex-end;justify-content:space-between;gap:30px}.productHeading span{color:#a9d7ff;font-size:9px;font-weight:900;letter-spacing:1.4px;white-space:nowrap}.productHeading h2{max-width:690px;margin:0;font-size:clamp(22px,2.7vw,36px);line-height:1.2;text-align:right;letter-spacing:-1px}
        .productRail{margin-top:24px;display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:10px}.productItem{min-width:0;padding:10px 10px 15px;position:relative;display:flex;flex-direction:column;align-items:center;border:1px solid rgba(255,255,255,.37);border-radius:90px 90px 18px 18px;color:#063b72;background:rgba(255,255,255,.96);box-shadow:0 15px 35px rgba(0,20,48,.17);text-decoration:none;transition:transform .2s ease,box-shadow .2s ease}.productItem:hover{transform:translateY(-7px);box-shadow:0 22px 44px rgba(0,20,48,.27)}.productItem>small{position:absolute;top:14px;left:16px;z-index:1;color:#6f8ba5;font-size:8px;font-weight:900}.productImage{width:100%;aspect-ratio:1;display:grid;place-items:center;overflow:hidden;border-radius:50%;background:linear-gradient(145deg,#f7fafc,#e8f0f6)}.productImage img{width:88%;height:88%;display:block;object-fit:contain}.productItem strong{margin-top:12px;font-size:14px}
        .heroActions{margin-top:26px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:13px}.heroActions a{min-height:62px;display:flex;align-items:center;justify-content:center;gap:12px;border:1px solid rgba(255,255,255,.72);border-radius:16px;font-size:15px;font-weight:900;text-decoration:none;transition:transform .2s ease,box-shadow .2s ease}.heroActions a:hover{transform:translateY(-2px);box-shadow:0 15px 34px rgba(0,20,50,.22)}.primaryAction{color:#063b72;background:#fff}.secondaryAction{color:#fff;background:rgba(255,255,255,.09)}
        @media(max-width:900px){.heroStage{min-height:auto;justify-content:center}.ecosystemCircle{width:min(620px,80vw);padding:clamp(42px,8vw,68px)}.stageAccent{display:none}.productRail{display:flex;overflow-x:auto;padding:3px 2px 17px;scroll-snap-type:x proximity}.productItem{min-width:165px;scroll-snap-align:start}}
        @media(max-width:700px){.homeHero{padding:34px 14px 54px}.ecosystemCircle{width:100%;min-height:430px;aspect-ratio:auto;border-radius:50%;padding:48px 28px}.ecosystemCircle:after{width:16px;height:16px;top:42px;right:40px}.eyebrow{font-size:9px;letter-spacing:1.2px}h1{margin-top:18px;font-size:clamp(29px,8.8vw,38px);line-height:1.16}p{margin-top:18px;font-size:13px;line-height:1.65}.productShowcase{margin-top:34px;padding-top:24px}.productHeading{display:block;text-align:center}.productHeading h2{margin-top:10px;font-size:25px;text-align:center}.productRail{margin-top:19px}.productItem{min-width:150px}.heroActions{grid-template-columns:1fr;gap:10px;margin-top:18px}.heroActions a{min-height:58px}}
      `}</style>
    </section>
  );
}
