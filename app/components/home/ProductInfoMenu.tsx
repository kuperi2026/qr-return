"use client";

const itemsKa = [
  ["⚡", "სწრაფი & მარტივი რეგისტრაცია", "ანგარიშისა და შესაბამისი პროდუქტის პროფილის შექმნას მხოლოდ რამდენიმე ნაბიჯი სჭირდება."],
  ["📱", "აპლიკაციის გარეშე", "მპოვნელს არ სჭირდება აპლიკაცია ან რეგისტრაცია — საკმარისია QR კოდის ნებისმიერი მობილურით დასკანერება."],
  ["🔒", "კონფიდენციალურობის სრული კონტროლი", "თავად წყვეტთ, რომელი დამატებითი ინფორმაცია გამოუჩნდეს მპოვნელს სკანირებისას."],
  ["🚨", "Lost Mode", "თავად ააქტიურებთ სტატუსს „დაიკარგა“, იღებთ სკანირების ინფორმაციას ჩათში და მპოვნელს შეუძლია ლოკაციის გაზიარება."],
  ["👥", "ადმინისტრატორის დელეგირება", "ერთ პროდუქტზე შეგიძლიათ დაამატოთ ერთი დამატებითი ადმინისტრატორი და განსაზღვროთ მისი უფლებები."],
  ["🔄", "პროფილის რედაქტირება", "ინფორმაცია ნებისმიერ დროს განაახლეთ ან პროფილი იმავე კატეგორიის სხვა ნივთს ან ცხოველს დაუკავშირეთ. კატეგორია არ იცვლება."],
  ["📞", "24/7 მხარდაჭერა & შეძენა", "დაჯავშნეთ ზარი, მოგვწერეთ ონლაინ ჩათში ან დაგვიკავშირდით ცხელ ხაზზე."],
];

const itemsEn = [
  ["⚡", "Quick & easy registration", "Create an account and the relevant product profile in just a few steps."],
  ["📱", "No app required", "A finder only needs to scan the QR code with any smartphone."],
  ["🔒", "Complete privacy control", "You decide what additional information a finder sees after scanning."],
  ["🚨", "Lost Mode", "Mark a profile as lost, receive scan updates in chat and allow voluntary location sharing."],
  ["👥", "Administrator delegation", "Add one additional administrator per product and define their permissions."],
  ["🔄", "Editable profile", "Update details or connect the profile to another item in the same category. The category cannot change."],
  ["📞", "24/7 support & purchasing", "Book a call, message us in online chat or contact our hotline."],
];

export default function ProductInfoMenu({ ka }: { ka: boolean }) {
  const items = ka ? itemsKa : itemsEn;

  return (
    <section className="productInfoMenu">
      <div className="menuInner">
        <div className="menuHeading">
          <span>PRODUCT INFORMATION</span>
          <h2>{ka ? "მთავარი შესაძლებლობები & უპირატესობები" : "Key features & benefits"}</h2>
        </div>
        <div className="infoGrid">
          {items.map(([icon, title, text]) => (
            <article key={title}>
              <span aria-hidden="true">{icon}</span>
              <p><strong>{title}</strong>{text}</p>
            </article>
          ))}
        </div>
        <aside>
          <span aria-hidden="true">🆘</span>
          <p><strong>{ka ? "Emergency პროფილის გამონაკლისი" : "Emergency profile exception"}</strong>{ka ? "ერთხელ გააქტიურებული Emergency პროფილი სხვა ადამიანზე არ გადადის. პირადი, სამედიცინო და საკონტაქტო ინფორმაციის განახლება ნებისმიერ დროს შეგიძლიათ." : "Once activated, an Emergency profile cannot be transferred to another person. Its personal, medical and contact details remain editable."}</p>
        </aside>
        <div className="links">
          <a href="/book-call">📞 {ka ? "ზარის დაჯავშნა" : "Book a call"}</a>
          <a href="/support">💬 {ka ? "ონლაინ ჩათი" : "Online chat"}</a>
        </div>
      </div>
      <style jsx>{`
        .productInfoMenu{position:relative;z-index:90;padding:26px 32px 30px;border-bottom:1px solid #dce6ef;background:#fff;color:#1c324d;box-shadow:0 18px 35px rgba(0,35,70,.13)}.menuInner{max-width:1260px;margin:auto}.menuHeading span{color:#1266e9;font-size:9px;font-weight:900;letter-spacing:1.3px}.menuHeading h2{margin:5px 0 17px;font-size:24px}.infoGrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px}.infoGrid article{padding:12px;display:grid;grid-template-columns:30px 1fr;gap:9px;border:1px solid #e1e8ef;border-radius:13px;background:#f8fbff}.infoGrid article>span{font-size:17px}.infoGrid p,aside p{margin:0;color:#60758a;font-size:12px;line-height:1.5}.infoGrid strong,aside strong{display:block;margin-bottom:2px;color:#174f85;font-size:12px}.infoGrid article:last-child{grid-column:span 2}aside{margin-top:10px;padding:12px 14px;display:grid;grid-template-columns:30px 1fr;gap:8px;border:1px solid #ffd2d7;border-radius:13px;background:#fff5f6}aside strong{color:#b92e40}.links{margin-top:12px;display:flex;gap:9px}.links a{padding:10px 14px;border-radius:10px;color:#fff;background:#0a4c8a;font-size:12px;font-weight:900;text-decoration:none}.links a:last-child{background:#d93449}@media(max-width:900px){.infoGrid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:600px){.productInfoMenu{padding:22px 14px}.infoGrid{grid-template-columns:1fr}.infoGrid article:last-child{grid-column:auto}.links{flex-direction:column}.links a{text-align:center}}
      `}</style>
    </section>
  );
}
