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
          <div className="stageAccent">
            <span>QR RETURN</span>
            <h2>{ka ? "QR ტექნოლოგიაზე დაფუძნებული უსაფრთხოების ეკოსისტემა." : "A safety ecosystem powered by QR technology."}</h2>
            <p className="leadCopy">{ka ? <>მართე ყველა პროდუქტი <strong>ერთი ანგარიშიდან</strong>, განაახლე ინფორმაცია <em>ნებისმიერ დროს</em> და <strong>თავად გადაწყვიტე</strong>, QR კოდის დასკანერებისას რა სახის დამატებითი ინფორმაცია მიაწოდო მპოვნელს.</> : <>Manage every product from <strong>one account</strong>, update information <em>at any time</em>, and <strong>decide for yourself</strong> what a finder sees after scanning the QR code.</>}</p>
            {ka && (
              <div className="detailCopy">
                <p><strong>მარტივი მართვა და ჩანაცვლება:</strong> ვინაიდან, <em>ემერჯენსი სამაჯური</em> განუკვთნილია ადამიანისთვის, მაქსიმალურ პერსონალურ უსაფრთხოებას მოითხოვს. შესაბამისად, ერთხელ გააქტიურებული QR პროფილი, სხვა ადამიანით ვერ ჩანაცვლედება. (მაგალითად, ნინოს პროფილს ვერ ვაქცევთ ნანას პროფილად). საჭირო <strong>სამედიცინო და საკონტაქტო ინფორმაციის განახლება</strong> კი ნებისმიერ დროს შეგიძლია.</p>
                <p>დანარჩენი პროდუქტის QR პროფილი <strong>ნებისმიერ დროს</strong> შეგიძლიათ იმავე კატეგორიის სხვა ნივთს ან ცხოველს დაუკავშიროთ. მაგალითად, ძაღლის შექმნილი პროფილი განაახლოთ და მას ახალი ძაღლის მონაცემები დაუკავშიროთ.</p>
                <p><strong>lost mode ფუნქცია</strong> გაძლევთ შესაძლებლობას, ჩართოთ მაშინ როდესაც თვლით, რომ ეს საჭიროა.</p>
                <p>თქვენ მიიღებთ შესაბამის <strong>სიგნალს</strong>, როდესაც QR პროფილი დასკანრედება.</p>
                <p><strong>სწრაფი და უსაფრთხო კავშირი:</strong> მპოვნელს შეუძლია დაგიკავშირდეთ მითითებულ <em>მობილურის ნომერზე</em> ან დაცული <strong>Live Chat-ით</strong>. სურვილის შემთხვევაში გაგიზიაროს თავისი <strong>ზუსტი მდებარეობა</strong>.</p>
              </div>
            )}
          </div>
          <article className="ecosystemCircle">
            <h1>{ka ? <>შექმენი შენი ციფრული QR პროფილი <strong>20 წამში.</strong></> : <>Create your digital QR profile in <strong>20 seconds.</strong></>}</h1>
          </article>
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
        .homeHeroInner{width:100%;max-width:1280px;margin:auto}.heroStage{min-height:560px;position:relative;display:flex;align-items:center;justify-content:center}
        .ecosystemCircle{width:min(385px,33vw);aspect-ratio:1;padding:48px;position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,.5);border-radius:50%;background:linear-gradient(145deg,rgba(255,255,255,.2),rgba(255,255,255,.065));box-shadow:0 28px 74px rgba(0,21,52,.34),inset 0 1px 0 rgba(255,255,255,.28);backdrop-filter:blur(15px);text-align:center}
        .ecosystemCircle:before,.ecosystemCircle:after{content:"";position:absolute;border-radius:50%;pointer-events:none}.ecosystemCircle:before{inset:17px;border:1px solid rgba(255,255,255,.14)}.ecosystemCircle:after{width:24px;height:24px;top:55px;right:48px;background:#b9e2ff;box-shadow:0 0 30px rgba(185,226,255,.8)}
        .ecosystemCircle h1{max-width:310px;margin:0;color:#fff;font-size:clamp(32px,3.35vw,46px);line-height:1.1;letter-spacing:-1.5px}.ecosystemCircle h1 strong{display:block;margin-top:8px;color:#c4e7ff}
        .stageAccent{width:74%;min-height:510px;margin-right:-25px;padding:38px 90px 38px 42px;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;border:1px solid rgba(255,255,255,.24);border-right:0;border-radius:30px 0 0 30px;background:linear-gradient(145deg,rgba(255,255,255,.11),rgba(2,44,87,.25));box-shadow:0 24px 55px rgba(0,21,52,.18);text-align:left}.stageAccent>span{color:#acd7fb;font-size:10px;font-weight:900;letter-spacing:2px}.stageAccent h2{max-width:720px;margin:12px 0 0;color:#fff;font-size:clamp(28px,3vw,40px);line-height:1.13;letter-spacing:-1.2px}.stageAccent .leadCopy{max-width:760px;margin:19px 0 0;color:rgba(255,255,255,.86);font-size:clamp(15px,1.35vw,18px);line-height:1.6}.stageAccent p strong{color:#fff}.stageAccent p em{color:#c7e7ff;font-style:italic;font-weight:800}
        .detailCopy{max-width:780px;margin-top:20px;padding-top:18px;display:grid;gap:8px;border-top:1px solid rgba(255,255,255,.2)}.detailCopy p{max-width:none;margin:0;color:rgba(255,255,255,.78);font-size:12px;line-height:1.52}.detailCopy strong{color:#fff}.detailCopy em{color:#c8e8ff;font-style:italic;font-weight:800}
        .productShowcase{margin-top:34px;padding:28px 24px 25px;border:1px solid rgba(255,255,255,.24);border-radius:26px;background:linear-gradient(145deg,rgba(255,255,255,.1),rgba(255,255,255,.045));box-shadow:0 24px 55px rgba(0,21,52,.18)}.productHeading{display:flex;align-items:flex-end;justify-content:space-between;gap:30px}.productHeading span{color:#b9ddfc;font-size:9px;font-weight:900;letter-spacing:1.4px;white-space:nowrap}.productHeading h2{max-width:690px;margin:0;font-size:clamp(22px,2.7vw,34px);line-height:1.2;text-align:right;letter-spacing:-1px}
        .productRail{margin-top:24px;display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:11px}.productItem{min-width:0;padding:9px 9px 14px;position:relative;display:flex;flex-direction:column;align-items:center;border:1px solid rgba(255,255,255,.38);border-radius:18px;color:#fff;background:linear-gradient(180deg,rgba(231,246,255,.18),rgba(255,255,255,.07));text-decoration:none;transition:transform .2s ease,background .2s ease,box-shadow .2s ease}.productItem:hover{transform:translateY(-6px);background:rgba(255,255,255,.16);box-shadow:0 18px 38px rgba(0,20,48,.24)}.productItem>small{position:absolute;top:13px;left:13px;z-index:1;color:#c7e5ff;font-size:8px;font-weight:900}.productImage{width:100%;height:145px;display:grid;place-items:center;overflow:hidden;border-radius:14px;background:radial-gradient(circle at 50% 42%,#fff 0%,#edf6fc 56%,#dbeaf4 100%)}.productImage img{width:92%;height:92%;display:block;object-fit:contain;filter:drop-shadow(0 10px 9px rgba(7,48,86,.16))}.productItem strong{margin-top:12px;color:#fff;font-size:14px;letter-spacing:.1px}
        .heroActions{margin-top:26px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:13px}.heroActions a{min-height:62px;display:flex;align-items:center;justify-content:center;gap:12px;border:1px solid rgba(255,255,255,.72);border-radius:16px;font-size:15px;font-weight:900;text-decoration:none;transition:transform .2s ease,box-shadow .2s ease}.heroActions a:hover{transform:translateY(-2px);box-shadow:0 15px 34px rgba(0,20,50,.22)}.primaryAction{color:#063b72;background:#fff}.secondaryAction{color:#fff;background:rgba(255,255,255,.09)}
        @media(max-width:900px){.heroStage{min-height:auto;flex-direction:column;justify-content:center;gap:22px}.stageAccent{width:100%;min-height:auto;margin:0;padding:34px;border-right:1px solid rgba(255,255,255,.2);border-radius:24px}.ecosystemCircle{width:min(390px,72vw);padding:clamp(42px,8vw,54px)}.productRail{display:flex;overflow-x:auto;padding:3px 2px 17px;scroll-snap-type:x proximity}.productItem{min-width:170px;scroll-snap-align:start}.productImage{height:150px}}
        @media(max-width:700px){.homeHero{padding:34px 14px 54px}.stageAccent{padding:27px}.stageAccent h2{font-size:29px}.stageAccent .leadCopy{font-size:15px}.detailCopy p{font-size:12px}.ecosystemCircle{width:100%;min-height:360px;aspect-ratio:auto;border-radius:50%;padding:45px 28px}.ecosystemCircle:after{width:16px;height:16px;top:42px;right:40px}.productShowcase{margin-top:34px;padding-top:24px}.productHeading{display:block;text-align:center}.productHeading h2{margin-top:10px;font-size:25px;text-align:center}.productRail{margin-top:19px}.productItem{min-width:150px}.heroActions{grid-template-columns:1fr;gap:10px;margin-top:18px}.heroActions a{min-height:58px}}
      `}</style>
    </section>
  );
}
