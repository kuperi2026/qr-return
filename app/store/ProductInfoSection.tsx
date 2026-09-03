"use client";

type InfoItem = [string, string, string];

const copyKa: InfoItem[] = [
  ["⚡", "სწრაფი & მარტივი რეგისტრაცია", "შექმენით ანგარიში, აირჩიეთ შესაბამისი პროდუქტის პროფილი და მიუთითეთ საჭირო ინფორმაცია."],
  ["📱", "აპლიკაციის გარეშე", "მპოვნელს არ სჭირდება აპლიკაცია ან რეგისტრაცია. საკმარისია QR კოდის დასკანერება ნებისმიერი მობილურიდან."],
  ["🔒", "კონფიდენციალურობის სრული კონტროლი", "სავალდებულო ინფორმაციის მითითების შემდეგ, თავად წყვეტთ, რომელი დამატებითი ინფორმაცია გამოუჩნდეს მპოვნელს სკანირების შედეგად."],
  ["🚨", "Lost Mode", "თავად აკონტროლებთ, როდის გაააქტიუროთ პროფილი და მიანიჭოთ სტატუსი „დაიკარგა“. სკანირების შესახებ ინფორმაციას მიიღებთ ჩათში, ხოლო მპოვნელს სურვილის შემთხვევაში შეუძლია ლოკაციის გაზიარება."],
  ["👥", "ადმინისტრატორის დელეგირება", "პროფილის მართვის ველში ერთ პროდუქტზე შეგიძლიათ დაამატოთ ერთი დამატებითი ადმინისტრატორი და თავად გადაწყვიტოთ, რომელი ფუნქციების მართვას ანდობთ."],
  ["🔄", "პროფილის რედაქტირება", "პროფილის რედაქტირება ნებისმიერ დროს შეგიძლიათ. ის შეგიძლიათ იმავე კატეგორიის სხვა ნივთის ან ცხოველის მონაცემებით ჩაანაცვლოთ. პროდუქტის კატეგორია არ იცვლება."],
  ["📞", "24/7 მხარდაჭერა & შეძენა", "ჩვენი გუნდი მუდამ თქვენს სამსახურშია. შეგიძლიათ საიტიდან დაჯავშნოთ ზარი, მოგვწეროთ ონლაინ ჩათის საშუალებით ან დაგვიკავშირდეთ ცხელ ხაზზე."],
];

const copyEn: InfoItem[] = [
  ["⚡", "Quick & easy registration", "Create an account, select the relevant product profile and enter the required information."],
  ["📱", "No app required", "A finder does not need an app or an account. Scanning the QR code with any smartphone is enough."],
  ["🔒", "Complete privacy control", "After entering the required information, you decide what additional details a finder can see after scanning."],
  ["🚨", "Lost Mode", "You control when the profile is activated and marked as lost. You receive scan information in chat, and the finder may voluntarily share their location."],
  ["👥", "Administrator delegation", "You may add one additional administrator per product and choose which functions they are allowed to manage."],
  ["🔄", "Editable profile", "Update the profile at any time or link it to another item or animal in the same category. The product category cannot be changed."],
  ["📞", "24/7 support & purchasing", "Book a call through the website, message us in online chat or contact our hotline."],
];

export default function ProductInfoSection({ ka }: { ka: boolean }) {
  const items = ka ? copyKa : copyEn;

  return (
    <section className="infoSection">
      <div className="heading">
        <span>PRODUCT INFORMATION</span>
        <h2>{ka ? "პროდუქტის შესახებ" : "About the product"}</h2>
      </div>

      <div className="infoCard">
        <h3>{ka ? "მთავარი შესაძლებლობები & უპირატესობები" : "Key features & benefits"}</h3>
        <ul>
          {items.map(([icon, title, text]) => (
            <li key={title}>
              <span className="icon" aria-hidden="true">{icon}</span>
              <p><strong>{title}</strong>{text}</p>
            </li>
          ))}
        </ul>

        <aside>
          <span aria-hidden="true">🆘</span>
          <p><strong>{ka ? "Emergency პროფილის გამონაკლისი" : "Emergency profile exception"}</strong>{ka ? "ერთხელ გააქტიურებული Emergency პროფილი სხვა ადამიანზე არ გადადის. პირადი, სამედიცინო და საკონტაქტო ინფორმაციის განახლება კი ნებისმიერ დროს შეგიძლიათ." : "Once activated, an Emergency profile cannot be transferred to another person. Personal, medical and contact information can still be updated at any time."}</p>
        </aside>
      </div>

      <style jsx>{`
        .infoSection{width:calc(100% - 36px);max-width:1180px;margin:54px auto 0}.heading span{color:#1266e9;font-size:10px;font-weight:900;letter-spacing:1.25px}.heading h2{margin:7px 0 18px;color:#1c324d;font-size:30px}.infoCard{padding:28px;border:1px solid #dce5ef;border-radius:22px;background:linear-gradient(145deg,#fff,#f6faff);box-shadow:0 16px 42px rgba(34,67,103,.08)}.infoCard h3{margin:0 0 21px;padding-bottom:16px;border-bottom:1px solid #e1e8ef;color:#1f3f60;font-size:20px}.infoCard ul{margin:0;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:13px;list-style:none}.infoCard li{padding:14px;display:grid;grid-template-columns:36px 1fr;gap:11px;border:1px solid #e4eaf0;border-radius:14px;background:#fff}.icon{width:36px;height:36px;display:grid;place-items:center;border-radius:11px;background:#edf5ff;font-size:18px}.infoCard p{margin:0;color:#617589;font-size:13px;line-height:1.6}.infoCard strong{display:block;margin-bottom:3px;color:#174f85;font-size:13px}.infoCard li:last-child{grid-column:1/-1}.infoCard li:last-child strong{color:#d93449}aside{margin-top:16px;padding:17px 18px;display:grid;grid-template-columns:40px 1fr;gap:12px;align-items:start;border:1px solid #ffd2d7;border-radius:15px;background:#fff5f6}aside>span{font-size:23px}aside strong{color:#b92e40}@media(max-width:760px){.infoCard ul{grid-template-columns:1fr}.infoCard li:last-child{grid-column:auto}}@media(max-width:560px){.infoSection{margin-top:42px}.heading h2{font-size:26px}.infoCard{padding:19px 14px}.infoCard h3{font-size:18px}}
      `}</style>
    </section>
  );
}
