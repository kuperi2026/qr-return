"use client";

const STEPS = [
  ["01", "მიაკარი QR კოდი", "შეარჩიე პროდუქტი და მიამაგრე შესაბამის ნივთს, ცხოველს ან ავტომობილს."],
  ["02", "შექმენი პროფილი", "დაამატე საკონტაქტო ინფორმაცია და თავად მართე, რას ნახავს მპოვნელი."],
  ["03", "მიიღე კავშირი", "მპოვნელი ასკანერებს კოდს და გიკავშირდება ზარით ან დაცული ჩატით."],
];

export default function HomeLowerSection({ ka }: { ka: boolean }) {
  return (
    <section className="lower">
      <div className="accountStatement">
        <span>ONE ACCOUNT · ALL PRODUCTS</span>
        <p>{ka ? <>მართე ყველა პროდუქტი ერთი ანგარიშიდან. განაახლე ინფორმაცია <em>ნებისმიერ დროს</em> და თავად გადაწყვიტე, QR კოდის დასკანერებისას რა დამატებითი ინფორმაცია მიაწოდო მპოვნელს.</> : <>Manage every product from one account. Update information <em>at any time</em> and decide what a finder sees after scanning the QR code.</>}</p>
      </div>

      <div className="sectionHead">
        <span>HOW IT WORKS</span>
        <h2>{ka ? "სამი მარტივი ნაბიჯი უსაფრთხო კავშირამდე" : "Three simple steps to a safe connection"}</h2>
      </div>

      <div className="steps">
        {STEPS.map(([number, title, text]) => (
          <article key={number}>
            <span>{number}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>

      <div className="benefitArea">
        <div className="benefitIntro">
          <span>QR RETURN</span>
          <h2>{ka ? "საჭირო ფუნქციები — ზედმეტი სირთულის გარეშე" : "Essential features without unnecessary complexity"}</h2>
          <p>{ka ? "ერთი სისტემა ნივთებისთვის, ოთხფეხა მეგობრებისთვის, ავტომობილებისა და Emergency პროფილებისთვის." : "One system for belongings, pets, vehicles and Emergency profiles."}</p>
        </div>
      </div>

      <div className="support">
        <div>
          <span>24/7 SUPPORT</span>
          <h2>{ka ? "დახმარება ყოველთვის ახლოსაა" : "Help is always close"}</h2>
          <p>{ka ? "დაგვიკავშირდი შენთვის მოსახერხებელი გზით." : "Contact us in the way that works best for you."}</p>
        </div>
        <div className="supportActions">
          <a href="/book-call">📞 {ka ? "ზარის დაჯავშნა" : "Book a call"}<b>→</b></a>
          <a href="/support">💬 {ka ? "ჩატი" : "Chat"}<b>→</b></a>
        </div>
      </div>

      <style jsx global>{`
        .homeHero .heroActions,.homeHero .bottomAccountNote{display:none!important}
        .lower{padding:78px 40px 86px;background:#fff;color:#1d3651;font-family:Arial,Helvetica,sans-serif}.lower>*{width:100%;max-width:1160px;margin-left:auto;margin-right:auto}.accountStatement{padding:34px 44px;border-radius:24px;background:linear-gradient(135deg,#0b55a0,#083d79);box-shadow:0 22px 52px rgba(7,54,112,.2);text-align:center}.accountStatement>span,.sectionHead>span,.benefitIntro>span,.support>div>span{color:#8dccff;font-size:10px;font-weight:900;letter-spacing:1.5px}.accountStatement p{max-width:850px;margin:12px auto 0;color:#fff;font-size:clamp(17px,2vw,23px);font-weight:850;line-height:1.55}.accountStatement em{color:#ffd0d5;font-style:normal}.sectionHead{margin-top:82px;text-align:center}.sectionHead>span,.benefitIntro>span{color:#0e62c5}.sectionHead h2{max-width:650px;margin:10px auto 0;font-size:clamp(28px,3.4vw,42px);line-height:1.16;letter-spacing:-1.2px}.steps{margin-top:34px;display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.steps article{min-height:210px;padding:27px;border:1px solid #dce7f4;border-radius:20px;background:#f8fbff}.steps article>span{width:42px;height:42px;display:grid;place-items:center;border-radius:12px;background:#0d5fc2;color:#fff;font-size:12px;font-weight:900}.steps h3{margin:24px 0 0;font-size:19px}.steps p,.benefitIntro p,.support p{margin:8px 0 0;color:#6e8094;font-size:13px;line-height:1.65}.benefitArea{margin-top:82px;padding:48px;border-radius:28px;background:#f3f8ff;text-align:center}.benefitIntro{max-width:760px;margin:auto}.benefitIntro h2{margin:11px 0 0;font-size:clamp(27px,3vw,38px);line-height:1.18;letter-spacing:-1px}.support{margin-top:82px;padding:38px 42px;display:flex;align-items:center;justify-content:space-between;gap:30px;border:1px solid #d7e5f4;border-radius:24px}.support>div>span{color:#0e62c5}.support h2{margin:8px 0 0;font-size:29px}.supportActions{display:flex;gap:11px}.supportActions a{min-width:190px;min-height:58px;padding:0 18px;display:flex;align-items:center;justify-content:space-between;gap:14px;border-radius:15px;background:#0d5fc2;color:#fff;font-size:14px;font-weight:900;text-decoration:none}.supportActions a:last-child{background:#d93449}.supportActions b{font-size:19px}.supportActions a:hover{transform:translateY(-2px)}
        @media(max-width:800px){.lower{padding:54px 16px 62px}.accountStatement{padding:27px 20px}.steps{grid-template-columns:1fr}.steps article{min-height:0}.benefitArea{padding:28px 20px;grid-template-columns:1fr;gap:28px}.support{padding:28px 20px;display:block}.supportActions{margin-top:24px}.supportActions a{min-width:0;flex:1}.sectionHead,.benefitArea,.support{margin-top:56px}}
        @media(max-width:520px){.supportActions{display:grid}.supportActions a{width:100%}}
      `}</style>
    </section>
  );
}
