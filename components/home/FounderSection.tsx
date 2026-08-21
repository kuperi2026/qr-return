"use client";

interface FounderSectionProps {
  language?: "ka" | "en";
}

export default function FounderSection({
  language = "ka",
}: FounderSectionProps) {
  const ka = language === "ka";

  return (
    <section className="founder" id="founder">
      <div className="inner">
        <div className="intro">
          <span className="number">01</span>

          <span className="eyebrow">
            {ka ? "დამფუძნებლისგან" : "FROM THE FOUNDER"}
          </span>

          <h2>
            {ka
              ? "იდეა, რომელიც ერთი მარტივი შეკითხვიდან დაიწყო."
              : "An idea that started with one simple question."}
          </h2>
        </div>

        <article className="letter">
          {ka ? (
            <>
              <p className="lead">
                QR RETURN-ის იდეა ერთი მარტივი შეკითხვიდან გაჩნდა:
                რა ხდება მაშინ, როდესაც ადამიანი კარგავს მისთვის
                მნიშვნელოვან ნივთს, საყვარელ ცხოველს, ან როდესაც
                გადაუდებელ სიტუაციაში მის შესახებ აუცილებელი ინფორმაცია
                ხელმისაწვდომი არ არის?
              </p>

              <p>
                ხშირად მპოვნელს დახმარება ნამდვილად სურს, მაგრამ არ იცის,
                ვის დაუკავშირდეს. დაკარგულ ცხოველს არ შეუძლია პატრონის
                ვინაობის თქმა, ნივთზე კი ხშირად არ არსებობს ინფორმაცია,
                რომელიც მის დაბრუნებას გაამარტივებს.
              </p>

              <p>
                Emergency სამაჯურის შემთხვევაში თითოეულ წუთსაც შეიძლება
                დიდი მნიშვნელობა ჰქონდეს — განსაკუთრებით მაშინ, როდესაც
                ადამიანი თავად ვერ ახერხებს საკუთარი სახელის,
                ჯანმრთელობის მდგომარეობის ან ოჯახის წევრის საკონტაქტო
                ინფორმაციის თქმას.
              </p>

              <div className="statement">
                <span>QR RETURN</span>

                <strong>
                  ერთი მარტივი და უსაფრთხო სისტემა, რომელიც საჭირო
                  მომენტში ადამიანებს სწრაფად აკავშირებს.
                </strong>
              </div>

              <p>
                QR RETURN აერთიანებს სამ მნიშვნელოვან მიმართულებას:
                დაკარგული ნივთების დაბრუნებას, საყვარელი ცხოველების დაცვას
                და ადამიანებისთვის განკუთვნილ Emergency პროფილებს.
              </p>

              <p>
                QR კოდის დასკანერებით მპოვნელს ან დამხმარე ადამიანს შეუძლია
                ნახოს მხოლოდ ის ინფორმაცია, რომლის გაზიარებაც მომხმარებელმა
                წინასწარ აირჩია, და დაუკავშირდეს მფლობელს, ოჯახის წევრს ან
                საგანგებო საკონტაქტო პირს.
              </p>

              <p>
                პროდუქტის მთავარი ღირებულება მხოლოდ QR კოდში არ არის.
                მისი მნიშვნელობა არის{" "}
                <strong>სწრაფად აღმოჩენილი სწორი კავშირი</strong> მაშინ,
                როდესაც დრო, უსაფრთხოება და ინფორმაცია ყველაზე მეტად
                გვჭირდება.
              </p>

              <p>
                ჩემთვის განსაკუთრებით მნიშვნელოვანია, რომ მომხმარებელი
                თავად აკონტროლებდეს საკუთარ ინფორმაციას — რას აზიარებს,
                ვის აჩვენებს და როგორ შეიძლება მასთან დაკავშირება. ამიტომ
                QR RETURN-ის საფუძველია სიმარტივე, უსაფრთხოება,
                კონფიდენციალურობა და ნდობა.
              </p>

              <p>
                QR RETURN ჩემთვის უბრალოდ პროდუქტი ან ტექნოლოგიური
                პლატფორმა არ არის. ჩემი მიზანია, ის გახდეს პატარა, მაგრამ
                მნიშვნელოვანი დამცავი რგოლი ადამიანებს, მათ საყვარელ
                ცხოველებსა და მათთვის ძვირფას ნივთებს შორის — რადგან ზოგჯერ
                დასაბრუნებლად ან დასახმარებლად მხოლოდ ერთი სწორი კავშირია
                საჭირო.
              </p>

              <p className="thanks">
                მადლობა, რომ ენდობით QR RETURN-ს.
              </p>
            </>
          ) : (
            <>
              <p className="lead">
                QR RETURN began with one simple question: what happens
                when someone loses something important, a beloved pet,
                or needs urgent help when essential information is not
                immediately available?
              </p>

              <p>
                Often, the finder genuinely wants to help but does not
                know whom to contact. A lost pet cannot identify its
                owner, and a lost item usually carries no information
                that makes its return easier.
              </p>

              <p>
                QR RETURN was created as a simple and secure system that
                helps establish the right connection at the moment it is
                needed most.
              </p>

              <p>
                The platform brings together lost belongings, pet
                protection and Emergency profiles while allowing users
                to control exactly what information they choose to share.
              </p>

              <p>
                Its value is not simply the QR code itself. Its value is
                the connection it can create when time, safety and the
                right information matter most.
              </p>
            </>
          )}

          <footer className="signature">
            <div className="signatureMark">NK</div>

            <div>
              <strong>Nino Kuprava</strong>
              <span>Founder &amp; CEO</span>
              <small>QR RETURN</small>
            </div>
          </footer>
        </article>
      </div>

      <style jsx>{`
        .founder {
          padding: 96px 0;
          background: #ffffff;
        }

        .inner {
          width: calc(100% - 56px);
          max-width: 1180px;
          margin: 0 auto;

          display: grid;
          grid-template-columns: 0.78fr 1.22fr;
          gap: 82px;
          align-items: start;
        }

        .intro {
          position: sticky;
          top: 110px;
        }

        .number {
          display: block;
          color: #1266e9;
          font-size: 13px;
          font-weight: 900;
        }

        .eyebrow {
          display: block;
          margin-top: 21px;

          color: #788595;
          font-size: 11px;
          font-weight: 850;
          letter-spacing: 1.6px;
        }

        h2 {
          max-width: 430px;
          margin: 14px 0 0;

          color: #142338;
          font-size: clamp(38px, 4vw, 53px);
          line-height: 1.06;
          letter-spacing: -2.4px;
        }

        .letter {
          padding-left: 40px;
          border-left: 1px solid #e2e7ed;
        }

        p {
          margin: 0 0 19px;
          color: #667487;

          font-size: 14px;
          line-height: 1.82;
        }

        .lead {
          color: #29394d;
          font-size: 16px;
          line-height: 1.78;
        }

        p strong {
          color: #26374b;
          font-weight: 750;
        }

        .statement {
          margin: 31px 0;
          padding: 25px 27px;

          border: 1px solid #e2e9f6;
          border-radius: 16px;

          background: linear-gradient(
            135deg,
            #f4f8ff 0%,
            #f8f7ff 100%
          );
        }

        .statement span {
          display: block;
          color: #1266e9;

          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        .statement strong {
          display: block;
          margin-top: 9px;

          color: #25364b;
          font-size: 18px;
          line-height: 1.52;
        }

        .thanks {
          margin-top: 28px;
          color: #293a4f;
          font-weight: 750;
        }

        .signature {
          margin-top: 40px;
          padding-top: 27px;

          display: flex;
          align-items: center;
          gap: 14px;

          border-top: 1px solid #e5e9ee;
        }

        .signatureMark {
          width: 48px;
          height: 48px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          color: #ffffff;
          background: linear-gradient(135deg, #1266e9, #7255f5);

          font-size: 13px;
          font-weight: 900;
        }

        .signature strong,
        .signature span,
        .signature small {
          display: block;
        }

        .signature strong {
          color: #203146;
          font-size: 15px;
        }

        .signature span {
          margin-top: 3px;
          color: #677588;
          font-size: 12px;
        }

        .signature small {
          margin-top: 2px;
          color: #1266e9;

          font-size: 9px;
          font-weight: 850;
          letter-spacing: 1px;
        }

        @media (max-width: 850px) {
          .inner {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .intro {
            position: static;
          }

          .letter {
            padding-left: 0;
            border-left: 0;
          }
        }

        @media (max-width: 650px) {
          .founder {
            padding: 70px 0;
          }

          .inner {
            width: calc(100% - 28px);
          }

          h2 {
            font-size: 37px;
          }

          p {
            font-size: 14px;
          }

          .lead {
            font-size: 15px;
          }

          .statement {
            padding: 21px;
          }

          .statement strong {
            font-size: 17px;
          }
        }
      `}</style>
    </section>
  );
}
