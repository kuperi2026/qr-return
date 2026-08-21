"use client";

type PetBasicInfoProps = {
  tagCode: string;
  setTagCode: (value: string) => void;

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
  tagCode,
  setTagCode,
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
          <div className="sectionNumber">03</div>

          <div>
            <span>QR PROFILE INFORMATION</span>

            <h3>ცხოველის ძირითადი ინფორმაცია</h3>

            <p>
              ჯერ მიუთითეთ შეძენილი QR RETURN კოდი, შემდეგ შეავსეთ
              ცხოველის ძირითადი მონაცემები.
            </p>
          </div>
        </div>

        <div className="qrBlock">
          <div className="qrBlockTop">
            <div className="qrIcon">
              QR
            </div>

            <div>
              <strong>QR / TAG CODE</strong>

              <p>
                შეიყვანეთ თქვენს QR პროდუქტზე მითითებული უნიკალური კოდი.
              </p>
            </div>
          </div>

          <div className="field">
            <label>
              QR კოდი
              <span>*</span>
            </label>

            <input
              type="text"
              value={tagCode}
              onChange={(event) =>
                setTagCode(
                  event.target.value
                    .toUpperCase()
                    .replace(/\s/g, "")
                )
              }
              placeholder="მაგ. QR-DOG-000123"
              autoComplete="off"
            />

            <small>
              ერთი QR კოდი შეიძლება დარეგისტრირდეს მხოლოდ ერთხელ.
              რეგისტრაციის შემდეგ ამ QR-ის კატეგორია აღარ შეიცვლება.
            </small>
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
                setDateOfBirth(event.target.value)
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
              ფოტოს ატვირთვის ფუნქციას Supabase Storage-თან ცალკე
              დავაკავშირებთ.
            </small>
          </div>
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

        .qrBlock {
          margin-top: 23px;
          padding: 18px;

          border: 1px solid #cbdff7;
          border-radius: 14px;

          background:
            linear-gradient(
              135deg,
              #f8fbff 0%,
              #eef5ff 100%
            );
        }

        .qrBlockTop {
          margin-bottom: 16px;

          display: flex;
          align-items: center;

          gap: 11px;
        }

        .qrIcon {
          width: 42px;
          height: 42px;

          flex: 0 0 42px;

          display: grid;
          place-items: center;

          border-radius: 11px;

          background: #1266e9;
          color: #ffffff;

          font-size: 9px;
          font-weight: 950;
        }

        .qrBlockTop strong {
          display: block;

          color: #27415f;

          font-size: 10px;
          font-weight: 900;

          letter-spacing: 0.6px;
        }

        .qrBlockTop p {
          margin: 4px 0 0;

          color: #78889a;

          font-size: 8px;
          line-height: 1.45;
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

          border: 1px solid #d5e0eb;
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
