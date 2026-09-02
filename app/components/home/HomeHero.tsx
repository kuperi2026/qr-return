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
          <article className="ecosystemCircle circlePrimary">
            <h1>{ka ? <>შექმენი შენი ციფრული QR პროფილი <strong>20 წამში.</strong></> : <>Create your digital QR profile in <strong>20 seconds.</strong></>}</h1>
          </article>
          <div className="stageAccent">
            <span>QR RETURN</span>
            <p className="leadCopy">{ka ? <>მართე ყველა პროდუქტი <strong>ერთი ანგარიშიდან</strong>, განაახლე ინფორმაცია <em>ნებისმიერ დროს</em> და <strong>თავად გადაწყვიტე</strong>, QR კოდის დასკანერებისას რა სახის დამატებითი ინფორმაცია მიაწოდო მპოვნელს.</> : <>Manage every product from <strong>one account</strong>, update information <em>at any time</em>, and <strong>decide for yourself</strong> what a finder sees after scanning the QR code.</>}</p>
          </div>
          <article className="ecosystemCircle circleSecondary">
            <h2>{ka ? "QR ტექნოლოგიაზე დაფუძნებული უსაფრთხოების ეკოსისტემა." : "A safety ecosystem powered by QR technology."}</h2>
          </article>
        </div>

        {ka && (
          <div className="detailCopy">
            <p><strong>მარტივი მართვა და ჩანაცვლება:</strong> ვინაიდან, <em>ემერჯენსი სამაჯური</em> განუკვთნილია ადამიანისთვის, მაქსიმალურ პერსონალურ უსაფრთხოებას მოითხოვს. შესაბამისად, ერთხელ გააქტიურებული QR პროფილი, სხვა ადამიანით ვერ ჩანაცვლედება. (მაგალითად, ნინოს პროფილს ვერ ვაქცევთ ნანას პროფილად). საჭირო <strong>სამედიცინო და საკონტაქტო ინფორმაციის განახლება</strong> კი ნებისმიერ დროს შეგიძლია.</p>
            <p>დანარჩენი პროდუქტის QR პროფილი <strong>ნებისმიერ დროს</strong> შეგიძლიათ იმავე კატეგორიის სხვა ნივთს ან ცხოველს დაუკავშიროთ. მაგალითად, ძაღლის შექმნილი პროფილი განაახლოთ და მას ახალი ძაღლის მონაცემები დაუკავშიროთ.</p>
            <p><strong>lost mode ფუნქცია</strong> გაძლევთ შესაძლებლობას, ჩართოთ მაშინ როდესაც თვლით, რომ ეს საჭიროა.</p>
            <p>თქვენ მიიღებთ შესაბამის <strong>სიგნალს</strong>, როდესაც QR პროფილი დასკანრედება.</p>
            <p><strong>სწრაფი და უსაფრთხო კავშირი:</strong> მპოვნელს შეუძლია დაგიკავშირდეთ მითითებულ <em>მობილურის ნომერზე</em> ან დაცული <strong>Live Chat-ით</strong>. სურვილის შემთხვევაში გაგიზიაროს თავისი <strong>ზუსტი მდებარეობა</strong>.</p>
          </div>
        )}

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
        .homeHeroInner{width:100%;max-width:1380px;margin:auto}.heroStage{min-height:430px;position:relative;display:grid;grid-template-columns:minmax(250px,.8fr) minmax(440px,1.45fr) minmax(250px,.8fr);align-items:center;gap:14px}
        .ecosystemCircle{width:100%;max-width:330px;aspect-ratio:1;margin:auto;padding:38px;position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;border:2px solid rgba(239,76,76,.9);border-radius:50%;background:linear-gradient(145deg,rgba(255,255,255,.18),rgba(255,255,255,.055));box-shadow:0 25px 64px rgba(0,21,52,.3),0 0 0 8px rgba(239,76,76,.08),inset 0 1px 0 rgba(255,255,255,.25);backdrop-filter:blur(15px);text-align:center}
        .ecosystemCircle:before{content:"";position:absolute;inset:13px;border:1px solid rgba(255,255,255,.18);border-radius:50%;pointer-events:none}.circlePrimary:after,.circleSecondary:after{content:"";position:absolute;width:12px;height:12px;border-radius:50%;background:#ff6868;box-shadow:0 0 22px rgba(255,76,76,.9)}.circlePrimary:after{right:20px;top:72px}.circleSecondary:after{left:20px;bottom:72px}
        .ecosystemCircle h1,.ecosystemCircle h2{max-width:260px;margin:0;color:#fff;line-height:1.12;letter-spacing:-1px}.ecosystemCircle h1{font-size:clamp(27px,2.6vw,38px)}.ecosystemCircle h1 strong{display:block;margin-top:7px;color:#ffd0d0}.ecosystemCircle h2{font-size:clamp(23px,2.2vw,32px)}
        .stageAccent{min-height:330px;padding:46px 44px;position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,.34);border-radius:34px 92px 34px 92px;background:linear-gradient(135deg,rgba(255,255,255,.17),rgba(3,49,94,.28));box-shadow:0 28px 66px rgba(0,21,52,.27),inset 0 1px 0 rgba(255,255,255,.25);text-align:center}.stageAccent:before{content:"";position:absolute;width:190px;height:190px;top:-120px;right:-65px;border-radius:50%;background:rgba(239,76,76,.13)}.stageAccent:after{content:"";position:absolute;width:8px;height:72%;left:0;top:14%;border-radius:0 8px 8px 0;background:linear-gradient(#ff6a6a,#d73939)}.stageAccent>span{position:relative;color:#bfe0ff;font-size:10px;font-weight:900;letter-spacing:2px}.stageAccent .leadCopy{position:relative;max-width:650px;margin:19px 0 0;color:#fff;font-size:clamp(21px,2vw,29px);font-weight:650;line-height:1.52;letter-spacing:-.35px}.stageAccent p strong{color:#fff;font-weight:950;text-shadow:0 0 20px rgba(191,228,255,.3)}.stageAccent p em{color:#ffd0d0;font-style:italic;font-weight:900}
        .detailCopy{margin-top:20px;padding:24px 27px;display:grid;gap:9px;border:1px solid rgba(255,255,255,.2);border-radius:22px;background:rgba(2,44,87,.2)}.detailCopy p{max-width:none;margin:0;color:rgba(255,255,255,.78);font-size:13px;line-height:1.58}.detailCopy strong{color:#fff}.detailCopy em{color:#ffd0d0;font-style:italic;font-weight:800}
        .productShowcase{margin-top:34px;padding:28px 24px 25px;border:1px solid rgba(255,255,255,.24);border-radius:26px;background:linear-gradient(145deg,rgba(255,255,255,.1),rgba(255,255,255,.045));box-shadow:0 24px 55px rgba(0,21,52,.18)}.productHeading{display:flex;align-items:flex-end;justify-content:space-between;gap:30px}.productHeading span{color:#b9ddfc;font-size:9px;font-weight:900;letter-spacing:1.4px;white-space:nowrap}.productHeading h2{max-width:690px;margin:0;font-size:clamp(22px,2.7vw,34px);line-height:1.2;text-align:right;letter-spacing:-1px}
        .productRail{margin-top:24px;display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:11px}.productItem{min-width:0;padding:9px 9px 14px;position:relative;display:flex;flex-direction:column;align-items:center;border:1px solid rgba(255,255,255,.38);border-radius:18px;color:#fff;background:linear-gradient(180deg,rgba(231,246,255,.18),rgba(255,255,255,.07));text-decoration:none;transition:transform .2s ease,background .2s ease,box-shadow .2s ease}.productItem:hover{transform:translateY(-6px);background:rgba(255,255,255,.16);box-shadow:0 18px 38px rgba(0,20,48,.24)}.productItem>small{position:absolute;top:13px;left:13px;z-index:1;color:#c7e5ff;font-size:8px;font-weight:900}.productImage{width:100%;height:145px;display:grid;place-items:center;overflow:hidden;border-radius:14px;background:radial-gradient(circle at 50% 42%,#fff 0%,#edf6fc 56%,#dbeaf4 100%)}.productImage img{width:92%;height:92%;display:block;object-fit:contain;filter:drop-shadow(0 10px 9px rgba(7,48,86,.16))}.productItem strong{margin-top:12px;color:#fff;font-size:14px;letter-spacing:.1px}
        .heroActions{margin-top:26px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:13px}.heroActions a{min-height:62px;display:flex;align-items:center;justify-content:center;gap:12px;border:1px solid rgba(255,255,255,.72);border-radius:16px;font-size:15px;font-weight:900;text-decoration:none;transition:transform .2s ease,box-shadow .2s ease}.heroActions a:hover{transform:translateY(-2px);box-shadow:0 15px 34px rgba(0,20,50,.22)}.primaryAction{color:#063b72;background:#fff}.secondaryAction{color:#fff;background:rgba(255,255,255,.09)}
        @media(max-width:1080px){.heroStage{grid-template-columns:minmax(220px,.75fr) minmax(400px,1.4fr) minmax(220px,.75fr)}.ecosystemCircle{max-width:280px;padding:30px}.stageAccent{padding:38px 32px}.stageAccent .leadCopy{font-size:21px}}
        @media(max-width:900px){.heroStage{min-height:auto;display:flex;flex-direction:column;justify-content:center;gap:22px}.circlePrimary{order:1}.stageAccent{order:2;width:100%;min-height:auto;padding:38px 30px}.circleSecondary{order:3}.ecosystemCircle{width:min(330px,72vw);max-width:330px}.detailCopy{margin-top:24px}.productRail{display:flex;overflow-x:auto;padding:3px 2px 17px;scroll-snap-type:x proximity}.productItem{min-width:170px;scroll-snap-align:start}.productImage{height:150px}}
        @media(max-width:700px){.homeHero{padding:34px 14px 54px}.stageAccent{padding:34px 23px;border-radius:25px 60px 25px 60px}.stageAccent .leadCopy{font-size:20px}.detailCopy{padding:19px}.detailCopy p{font-size:12px}.ecosystemCircle{width:min(300px,82vw)}.productShowcase{margin-top:34px;padding-top:24px}.productHeading{display:block;text-align:center}.productHeading h2{margin-top:10px;font-size:25px;text-align:center}.productRail{margin-top:19px}.productItem{min-width:150px}.heroActions{grid-template-columns:1fr;gap:10px;margin-top:18px}.heroActions a{min-height:58px}}
      `}</style>
    </section>
  );
}
