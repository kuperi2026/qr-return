"use client";

type PetHealthSectionProps = {
  medicalInfo: string;
  setMedicalInfo: (value: string) => void;

  behaviourNote: string;
  setBehaviourNote: (value: string) => void;

  description: string;
  setDescription: (value: string) => void;

  finderMessage: string;
  setFinderMessage: (value: string) => void;
};

export default function PetHealthSection({
  medicalInfo,
  setMedicalInfo,
  behaviourNote,
  setBehaviourNote,
  description,
  setDescription,
  finderMessage,
  setFinderMessage,
}: PetHealthSectionProps) {
  return (
    <>
      <section className="sectionCard">
        <div className="sectionHeader">
          <div className="sectionNumber">02</div>

          <div>
            <span>HEALTH &amp; NOTES</span>

            <h3>
              ჯანმრთელობა და დამატებითი ინფორმაცია
            </h3>

            <p>
              მიუთითეთ ინფორმაცია, რომელიც შეიძლება მნიშვნელოვანი იყოს
              მპოვნელისთვის ან ცხოველთან უსაფრთხოდ მოქცევისთვის.
            </p>
          </div>
        </div>

        <div className="formGrid">
          <div className="field full">
            <label>
              სამედიცინო ინფორმაცია
            </label>

            <textarea
              value={medicalInfo}
              onChange={(event) =>
                setMedicalInfo(event.target.value)
              }
              placeholder="მაგ. იღებს მედიკამენტს, აქვს ალერგია, განსაკუთრებული სამედიცინო საჭიროება..."
              rows={5}
            />

            <small>
              ეს ველი სავალდებულო არ არის.
            </small>
          </div>

          <div className="field full">
            <label>
              ქცევის შესახებ შენიშვნა
            </label>

            <textarea
              value={behaviourNote}
              onChange={(event) =>
                setBehaviourNote(event.target.value)
              }
              placeholder="მაგ. მეგობრულია, ეშინია უცხო ადამიანების, არ მიუახლოვდეთ სწრაფად..."
              rows={5}
            />

            <small>
              მიუთითეთ მხოლოდ ის, რაც მპოვნელს დაეხმარება ცხოველთან
              უსაფრთხოდ მოქცევაში.
            </small>
          </div>

          <div className="field full">
            <label>
              დამატებითი აღწერა
            </label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="მაგ. გამორჩეული ნიშანი, საყელო, ბეწვის თავისებურება ან სხვა დეტალი..."
              rows={4}
            />
          </div>

          <div className="field full">
            <label>
              შეტყობინება მპოვნელისთვის
            </label>

            <textarea
              value={finderMessage}
              onChange={(event) =>
                setFinderMessage(event.target.value)
              }
              placeholder="მაგ. გთხოვთ დამიკავშირდეთ. ძალიან მნიშვნელოვანია ჩემთვის მისი უსაფრთხოდ დაბრუნება."
              rows={4}
            />

            <small>
              ეს ტექსტი გამოჩნდება Finder View-ში, თუ მისი ჩვენება
              აქტიურია.
            </small>
          </div>
        </div>

        <div className="infoNote">
          <div className="infoIcon">i</div>

          <p>
            ყველა ველი, გარდა ცხოველის ძირითადი სახელისა, შეიძლება დარჩეს
            ცარიელი და მოგვიანებით შეივსოს ან შეიცვალოს.
          </p>
        </div>
      </section>

      <style jsx>{`
        .sectionCard {
          margin-top: 16px;
          padding: 25px;

          border: 1px solid #dce6f1;
          border-radius: 16px;

          background: #ffffff;

          box-shadow:
            0 12px 30px
            rgba(30, 70, 120, 0.05);
        }

        .sectionHeader {
          display: grid;
          grid-template-columns: 42px 1fr;

          align-items: flex-start;
          gap: 13px;

          padding-bottom: 21px;

          border-bottom: 1px solid #e7edf4;
        }

        .sectionNumber {
          width: 38px;
          height: 38px;

          display: grid;
          place-items: center;

          border-radius: 10px;

          background: #edf4ff;
          color: #1266e9;

          font-size: 10px;
          font-weight: 950;
        }

        .sectionHeader span {
          color: #1266e9;

          font-size: 8px;
          font-weight: 900;

          letter-spacing: 1.3px;
        }

        .sectionHeader h3 {
          margin: 5px 0 0;

          color: #223951;

          font-size: 18px;
        }

        .sectionHeader p {
          max-width: 590px;

          margin: 7px 0 0;

          color: #7c8998;

          font-size: 9px;
          line-height: 1.55;
        }

        .formGrid {
          margin-top: 23px;

          display: grid;
          gap: 18px;
        }

        .field {
          min-width: 0;
        }

        label {
          display: block;

          margin-bottom: 7px;

          color: #344a62;

          font-size: 10px;
          font-weight: 850;
        }

        textarea {
          width: 100%;

          padding: 13px 14px;

          resize: vertical;

          border: 1px solid #d5e0eb;
          border-radius: 11px;

          outline: none;

          background: #ffffff;
          color: #1f344b;

          font-family: inherit;
          font-size: 12px;
          line-height: 1.6;

          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        textarea::placeholder {
          color: #a7b1be;
        }

        textarea:focus {
          border-color: #1266e9;

          box-shadow:
            0 0 0 4px
            rgba(18, 102, 233, 0.08);
        }

        small {
          display: block;

          margin-top: 6px;

          color: #909dab;

          font-size: 8px;
          line-height: 1.45;
        }

        .infoNote {
          margin-top: 22px;
          padding: 13px 14px;

          display: flex;
          align-items: flex-start;

          gap: 9px;

          border: 1px solid #d4e3f7;
          border-radius: 11px;

          background: #f6f9ff;
        }

        .infoIcon {
          width: 23px;
          height: 23px;

          flex: 0 0 23px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          background: #e8f1ff;
          color: #1266e9;

          font-size: 9px;
          font-weight: 950;
        }

        .infoNote p {
          margin: 2px 0 0;

          color: #6f8095;

          font-size: 9px;
          line-height: 1.55;
        }

        @media (max-width: 600px) {
          .sectionCard {
            padding: 19px;
          }

          textarea {
            font-size: 16px;
          }
        }
      `}</style>
    </>
  );
}
