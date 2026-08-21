"use client";

type PetBasicInfoProps = {
  itemName: string;
  setItemName: (value: string) => void;

  colour: string;
  setColour: (value: string) => void;

  sex: string;
  setSex: (value: string) => void;

  dateOfBirth: string;
  setDateOfBirth: (value: string) => void;

  weight: string;
  setWeight: (value: string) => void;

  photo: string;
  setPhoto: (value: string) => void;
};

export default function PetBasicInfo({
  itemName,
  setItemName,
  colour,
  setColour,
  sex,
  setSex,
  dateOfBirth,
  setDateOfBirth,
  weight,
  setWeight,
  photo,
  setPhoto,
}: PetBasicInfoProps) {
  return (
    <>
      <section className="sectionCard">
        <div className="sectionHeader">
          <div className="sectionNumber">01</div>

          <div>
            <span>PROFILE INFORMATION</span>
            <h3>ძირითადი ინფორმაცია</h3>
            <p>
              შეავსეთ ცხოველის ძირითადი მონაცემები. მოგვიანებით ამ
              ინფორმაციის შეცვლა შეძლებთ.
            </p>
          </div>
        </div>

        <div className="formGrid">
          <div className="field full">
            <label>
              ცხოველის სახელი
              <span>*</span>
            </label>

            <input
              type="text"
              value={itemName}
              onChange={(event) =>
                setItemName(event.target.value)
              }
              placeholder="მაგ. Luna"
            />

            <small>
              ეს იქნება პროფილის ძირითადი სახელი.
            </small>
          </div>

          <div className="field">
            <label>ფერი</label>

            <input
              type="text"
              value={colour}
              onChange={(event) =>
                setColour(event.target.value)
              }
              placeholder="მაგ. ყავისფერი"
            />
          </div>

          <div className="field">
            <label>სქესი</label>

            <select
              value={sex}
              onChange={(event) =>
                setSex(event.target.value)
              }
            >
              <option value="">
                აირჩიეთ
              </option>

              <option value="male">
                მამრი
              </option>

              <option value="female">
                მდედრი
              </option>

              <option value="unknown">
                არ არის მითითებული
              </option>
            </select>
          </div>

          <div className="field">
            <label>
              დაბადების თარიღი
            </label>

            <input
              type="date"
              value={dateOfBirth}
              onChange={(event) =>
                setDateOfBirth(
                  event.target.value
                )
              }
            />
          </div>

          <div className="field">
            <label>
              წონა
            </label>

            <div className="weightWrap">
              <input
                type="number"
                min="0"
                step="0.1"
                value={weight}
                onChange={(event) =>
                  setWeight(event.target.value)
                }
                placeholder="0.0"
              />

              <span>kg</span>
            </div>
          </div>

          <div className="field full">
            <label>
              ფოტო
            </label>

            <input
              type="url"
              value={photo}
              onChange={(event) =>
                setPhoto(event.target.value)
              }
              placeholder="https://..."
            />

            <small>
              ამ ეტაპზე შეგიძლიათ გამოიყენოთ ფოტოს URL. შემდეგ ეტაპზე
              Supabase Storage upload-საც დავამატებთ.
            </small>
          </div>
        </div>
      </section>

      <style jsx>{`
        .sectionCard {
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

          border-bottom:
            1px solid #e7edf4;
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
          max-width: 560px;

          margin: 7px 0 0;

          color: #7c8998;

          font-size: 9px;
          line-height: 1.55;
        }

        .formGrid {
          margin-top: 23px;

          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 18px 15px;
        }

        .field {
          min-width: 0;
        }

        .field.full {
          grid-column: 1 / -1;
        }

        label {
          display: block;

          margin-bottom: 7px;

          color: #344a62;

          font-size: 10px;
          font-weight: 850;
        }

        label span {
          margin-left: 3px;

          color: #1266e9;
        }

        input,
        select {
          width: 100%;
          min-height: 50px;

          padding: 0 14px;

          border:
            1px solid #d5e0eb;

          border-radius: 11px;

          outline: none;

          background: #ffffff;

          color: #1f344b;

          font-family: inherit;
          font-size: 12px;

          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        input::placeholder {
          color: #a7b1be;
        }

        input:focus,
        select:focus {
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

        .weightWrap {
          position: relative;
        }

        .weightWrap input {
          padding-right: 48px;
        }

        .weightWrap span {
          position: absolute;

          right: 15px;
          top: 50%;

          transform: translateY(-50%);

          color: #8997a6;

          font-size: 9px;
          font-weight: 850;

          pointer-events: none;
        }

        @media (max-width: 600px) {
          .sectionCard {
            padding: 19px;
          }

          .formGrid {
            grid-template-columns: 1fr;
          }

          .field.full {
            grid-column: auto;
          }

          input,
          select {
            font-size: 16px;
          }
        }
      `}</style>
    </>
  );
}
