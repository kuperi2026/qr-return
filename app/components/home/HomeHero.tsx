"use client";

import { useState } from "react";

export default function HomeHero({ ka }: { ka: boolean }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <section className="homeHero">
      <div className="homeHeroInner">
        <div className="heroStage">
          <div className="stageAccent">
            <p className="leadCopy">{ka ? <>მართე ყველა პროდუქტი ერთი ანგარიშიდან, განაახლე ინფორმაცია <em>ნებისმიერ დროს</em> და თავად გადაწყვიტე, QR კოდის დასკანერებისას რა სახის დამატებითი ინფორმაცია მიაწოდო მპოვნელს.</> : <>Manage every product from one account, update information <em>at any time</em>, and decide what additional information a finder sees after scanning the QR code.</>}</p>
            <button className="detailsToggle" type="button" aria-expanded={showDetails} onClick={() => setShowDetails((current) => !current)}>
              {ka ? (showDetails ? "დახურვა" : "ვრცლად") : (showDetails ? "Close" : "Learn more")}
              <span aria-hidden="true">{showDetails ? "−" : "+"}</span>
            </button>
            {showDetails && ka && (
              <div className="detailCopy">
                <p><strong>მარტივი მართვა და ჩანაცვლება:</strong> ვინაიდან, ემერჯენსი სამაჯური განუკვთნილია ადამიანისთვის, მაქსიმალურ პერსონალურ უსაფრთხოებას მოითხოვს. შესაბამისად, ერთხელ გააქტიურებული QR პროფილი, სხვა ადამიანით ვერ ჩანაცვლედება. (მაგალითად, ნინოს პროფილს ვერ ვაქცევთ ნანას პროფილად). საჭირო სამედიცინო და საკონტაქტო ინფორმაციის განახლება კი ნებისმიერ დროს შეგიძლია.</p>
                <p>დანარჩენი პროდუქტის QR პროფილი ნებისმიერ დროს შეგიძლიათ იმავე კატეგორიის სხვა ნივთს ან ცხოველს დაუკავშიროთ. მაგალითად, ძაღლის შექმნილი პროფილი განაახლოთ და მას ახალი ძაღლის მონაცემები დაუკავშიროთ.</p>
                <p>lost mode ფუნქცია გაძლევთ შესაძლებლობას, ჩართოთ მაშინ როდესაც თვლით, რომ ეს საჭიროა.</p>
                <p>თქვენ მიიღებთ შესაბამის სიგნალს, როდესაც QR პროფილი დასკანრედება.</p>
                <p><strong>სწრაფი და უსაფრთხო კავშირი:</strong> მპოვნელს შეუძლია დაგიკავშირდეთ მითითებულ მობილურის ნომერზე ან დაცული Live Chat-ით. სურვილის შემთხვევაში გაგიზიაროს თავისი ზუსტი მდებარეობა.</p>
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
          <article className="dogProduct">
            <div className="dogVisual">
              <img src="/products/dog-smart-qr.png" alt={ka ? "ძაღლი QR RETURN-ის ჭკვიანი იარლიყით" : "Dog wearing a QR RETURN smart tag"} />
            </div>
            <div className="dogCopy">
              <h3>{ka ? "ჭკვიანი QR იარლიყი — ყველაზე ერთგულებისთვის!" : "A smart QR tag — for your most loyal friend!"}</h3>
              <a href="/store">{ka ? "შეძენა" : "Buy now"}<span aria-hidden="true">→</span></a>
            </div>
          </article>
        </section>

        <div className="heroActions">
          <a className="primaryAction" href="/store"><span aria-hidden="true">◆</span>{ka ? "მაღაზია" : "Store"}</a>
          <a className="secondaryAction" href="/signup"><span aria-hidden="true">●</span>{ka ? "რეგისტრაცია" : "Registration"}</a>
        </div>
      </div>

      <style jsx>{`
        .homeHero{min-height:calc(100vh - 86px);padding:54px 40px 86px;color:#fff;background:radial-gradient(circle at 21% 17%,rgba(78,166,238,.3),transparent 30%),linear-gradient(180deg,#0a4c8a 0%,#063b72 100%)}
        .homeHeroInner{width:100%;max-width:1120px;margin:auto}.heroStage{min-height:370px;position:relative;display:grid;grid-template-columns:minmax(0,1.55fr) minmax(260px,.65fr);align-items:center;gap:20px}
        .ecosystemCircle{width:100%;max-width:300px;aspect-ratio:1;margin:auto;padding:36px;position:relative;display:flex;align-items:center;justify-content:center;border:2px solid rgba(239,76,76,.85);border-radius:50%;background:linear-gradient(145deg,rgba(255,255,255,.18),rgba(255,255,255,.055));box-shadow:0 22px 55px rgba(0,21,52,.28),0 0 0 6px rgba(239,76,76,.07),inset 0 1px 0 rgba(255,255,255,.25);backdrop-filter:blur(15px);text-align:center}.ecosystemCircle:before{content:"";position:absolute;inset:13px;border:1px solid rgba(255,255,255,.17);border-radius:50%}
        .ecosystemCircle h1{max-width:235px;margin:0;color:#fff;font-size:clamp(27px,2.6vw,37px);line-height:1.1;letter-spacing:-1.1px}.ecosystemCircle h1 strong{display:block;margin-top:7px;color:#ffd0d0}
        .stageAccent{min-height:250px;padding:34px 38px;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,.3);border-radius:26px;background:linear-gradient(135deg,rgba(255,255,255,.14),rgba(3,49,94,.25));box-shadow:0 22px 52px rgba(0,21,52,.22),inset 0 1px 0 rgba(255,255,255,.22);text-align:center}.stageAccent:after{content:"";position:absolute;width:6px;height:72%;left:0;top:14%;border-radius:0 8px 8px 0;background:linear-gradient(#ff6a6a,#d73939)}.stageAccent .leadCopy{max-width:720px;margin:0;color:#fff;font-size:clamp(22px,2.25vw,31px);font-weight:850;line-height:1.48;letter-spacing:-.45px}.stageAccent p em{color:#ffd0d0;font-style:italic;font-weight:950}
        .stageAccent{flex-direction:column}.detailsToggle{min-width:126px;min-height:43px;margin-top:22px;padding:0 15px;display:flex;align-items:center;justify-content:center;gap:13px;border:1px solid rgba(255,255,255,.48);border-radius:999px;color:#fff;background:rgba(255,255,255,.09);font-family:inherit;font-size:12px;font-weight:900;cursor:pointer}.detailsToggle span{width:22px;height:22px;display:grid;place-items:center;border-radius:50%;color:#063b72;background:#fff;font-size:16px}.detailCopy{width:100%;margin-top:22px;padding-top:20px;display:grid;gap:22px;border-top:1px solid rgba(255,255,255,.2);animation:reveal .22s ease-out;text-align:left}.detailCopy p{max-width:none;margin:0;color:#fff;font-size:clamp(22px,2.25vw,31px);font-weight:850;line-height:1.48;letter-spacing:-.45px}.detailCopy strong{color:#fff;font-weight:850}@keyframes reveal{from{opacity:0;transform:translateY(-7px)}to{opacity:1;transform:none}}
        .productShowcase{margin-top:34px;padding:28px 24px;border:1px solid rgba(255,255,255,.24);border-radius:26px;background:linear-gradient(145deg,rgba(255,255,255,.1),rgba(255,255,255,.045));box-shadow:0 24px 55px rgba(0,21,52,.18)}.productHeading{display:flex;align-items:flex-end;justify-content:space-between;gap:30px}.productHeading span{color:#b9ddfc;font-size:9px;font-weight:900;letter-spacing:1.4px;white-space:nowrap}.productHeading h2{max-width:690px;margin:0;font-size:clamp(22px,2.7vw,34px);line-height:1.2;text-align:right;letter-spacing:-1px}
        .dogProduct{margin-top:26px;min-height:410px;display:grid;grid-template-columns:minmax(0,1.08fr) minmax(330px,.92fr);overflow:hidden;border-radius:24px;background:#fff;box-shadow:0 22px 50px rgba(0,20,50,.24)}.dogVisual{position:relative;min-height:410px;overflow:hidden;background:#dcefff}.dogVisual:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent 62%,rgba(255,255,255,.9) 100%);pointer-events:none}.dogVisual img{width:100%;height:100%;position:absolute;inset:0;object-fit:cover;object-position:center 58%}.dogCopy{position:relative;z-index:1;padding:52px 46px;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;color:#073d70}.dogCopy:before{content:"";width:62px;height:4px;margin-bottom:25px;border-radius:999px;background:#db3f51}.dogCopy h3{max-width:430px;margin:0;font-size:clamp(30px,4vw,49px);line-height:1.12;letter-spacing:-1.4px}.dogCopy a{min-width:148px;min-height:54px;margin-top:30px;padding:0 20px;display:inline-flex;align-items:center;justify-content:space-between;gap:24px;border-radius:14px;color:#fff;background:#d93449;box-shadow:0 13px 28px rgba(217,52,73,.25);font-size:16px;font-weight:900;text-decoration:none;transition:transform .2s ease,box-shadow .2s ease}.dogCopy a:hover{transform:translateY(-2px);box-shadow:0 17px 32px rgba(217,52,73,.32)}.dogCopy a span{font-size:22px}
        .heroActions{margin-top:26px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:13px}.heroActions a{min-height:62px;display:flex;align-items:center;justify-content:center;gap:12px;border:1px solid rgba(255,255,255,.72);border-radius:16px;font-size:15px;font-weight:900;text-decoration:none;transition:transform .2s ease,box-shadow .2s ease}.heroActions a:hover{transform:translateY(-2px);box-shadow:0 15px 34px rgba(0,20,50,.22)}.primaryAction{color:#063b72;background:#fff}.secondaryAction{color:#fff;background:rgba(255,255,255,.09)}
        @media(max-width:900px){.heroStage{min-height:auto;display:flex;flex-direction:column;justify-content:center;gap:22px}.stageAccent{order:1;width:100%;min-height:auto;padding:36px 30px}.ecosystemCircle{order:2;width:min(340px,74vw);max-width:340px}}
        @media(max-width:700px){.homeHero{padding:34px 14px 54px}.stageAccent{padding:31px 23px}.stageAccent h2{font-size:29px}.stageAccent .leadCopy,.detailCopy p{font-size:17px;line-height:1.55;letter-spacing:-.2px}.ecosystemCircle{width:min(300px,82vw)}.productShowcase{margin-top:34px;padding:24px 14px 14px}.productHeading{display:block;text-align:center}.productHeading h2{margin-top:10px;font-size:25px;text-align:center}.dogProduct{min-height:0;grid-template-columns:1fr}.dogVisual{min-height:330px}.dogVisual:after{background:linear-gradient(180deg,transparent 70%,#fff 100%)}.dogCopy{padding:30px 25px 34px;align-items:center;text-align:center}.dogCopy:before{margin-bottom:20px}.dogCopy h3{font-size:31px;letter-spacing:-.8px}.dogCopy a{margin-top:24px}.heroActions{grid-template-columns:1fr;gap:10px;margin-top:18px}.heroActions a{min-height:58px}}
      `}</style>
    </section>
  );
}
