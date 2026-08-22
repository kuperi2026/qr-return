"use client";

import type {
  RegistrationDraft,
} from "./registrationTypes";

type OwnerStepProps = {
  draft: RegistrationDraft;

  update: <
    K extends keyof RegistrationDraft
  >(
    key: K,
    value: RegistrationDraft[K]
  ) => void;

  onNext: () => void;
};

export default function OwnerStep({
  draft,
  update,
  onNext,
}: OwnerStepProps) {
  return (
    <>
      <div className="stepTitle">
        <span>
          STEP 1 OF 3
        </span>

        <h1>
          მფლობელის ინფორმაცია
        </h1>

        <p>
          გადაამოწმეთ თქვენი საკონტაქტო
          ინფორმაცია. საჭიროების შემთხვევაში
          შეგიძლიათ აქვე განაახლოთ.
        </p>
      </div>

      <div className="accountNotice">
        <span className="accountCheck">
          ✓
        </span>

        <div>
          <strong>
            ინფორმაცია მიღებულია თქვენი
            ანგარიშიდან
          </strong>

          <p>
            პროდუქტის დამატებისას ანგარიშის
            თავიდან შექმნა საჭირო არ არის.
          </p>
        </div>
      </div>

      <div className="formGrid">
        <Field label="სახელი *">
          <input
            type="text"
            value={
              draft.ownerFirstName
            }
            onChange={(event) =>
              update(
                "ownerFirstName",
                event.target.value
              )
            }
            autoComplete="given-name"
          />
        </Field>

        <Field label="გვარი *">
          <input
            type="text"
            value={
              draft.ownerLastName
            }
            onChange={(event) =>
              update(
                "ownerLastName",
                event.target.value
              )
            }
            autoComplete="family-name"
          />
        </Field>

        <Field label="ტელეფონის ნომერი *">
          <input
            type="tel"
            value={
              draft.ownerPhone
            }
            onChange={(event) =>
              update(
                "ownerPhone",
                event.target.value
              )
            }
            autoComplete="tel"
          />
        </Field>

        <Field label="ელფოსტა *">
          <input
            type="email"
            value={
              draft.ownerEmail
            }
            onChange={(event) =>
              update(
                "ownerEmail",
                event.target.value
              )
            }
            autoComplete="email"
          />
        </Field>
      </div>

      <div className="finderNotice">
        <div className="finderIcon">
          i
        </div>

        <div>
          <strong>
            Finder View
          </strong>

          <p>
            სახელი, გვარი და ტელეფონის ნომერი
            მპოვნელისთვის ყოველთვის ხილული იქნება.
            ელფოსტის ჩვენებას თქვენ აკონტროლებთ.
          </p>
        </div>
      </div>

      <div className="actions">
        <button
          type="button"
          className="primaryButton"
          onClick={onNext}
        >
          გაგრძელება
          <span>→</span>
        </button>
      </div>

      <style jsx>{`
        .stepTitle > span {
          color: #0647c8;

          font-size: 12px;
          font-weight: 900;

          letter-spacing: 0.8px;
        }

        .stepTitle h1 {
          margin: 5px 0 0;

          color: #203a55;

          font-size: 27px;
          line-height: 1.2;
        }

        .stepTitle p {
          max-width: 620px;

          margin: 7px 0 0;

          color: #718397;

          font-size: 14px;
          line-height: 1.55;
        }

        .accountNotice {
          margin-top: 20px;

          padding: 15px;

          display: flex;
          align-items: flex-start;

          gap: 11px;

          border: 1px solid #cfe0f5;
          border-radius: 12px;

          background: #f4f8ff;
        }

        .accountCheck {
          width: 30px;
          height: 30px;

          flex: 0 0 30px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          background: #0647c8;

          color: #ffffff;

          font-size: 13px;
          font-weight: 900;
        }

        .accountNotice strong {
          display: block;

          color: #304d69;

          font-size: 14px;
          font-weight: 850;
        }

        .accountNotice p {
          margin: 4px 0 0;

          color: #718397;

          font-size: 13px;
          line-height: 1.5;
        }

        .formGrid {
          margin-top: 18px;

          display: grid;

          grid-template-columns:
            repeat(
              2,
              minmax(0, 1fr)
            );

          gap: 13px;
        }

        .field label {
          display: block;

          margin-bottom: 6px;

          color: #344e68;

          font-size: 13px;
          font-weight: 800;
        }

        .field input {
          width: 100%;
          min-height: 46px;

          padding: 0 13px;

          border:
            1px solid #d5e0eb;

          border-radius: 10px;

          background: #ffffff;

          color: #263f59;

          font-family: inherit;
          font-size: 14px;

          outline: none;

          transition:
            border-color 0.18s ease,
            box-shadow 0.18s ease;
        }

        .field input:focus {
          border-color: #0647c8;

          box-shadow:
            0 0 0 3px
            rgba(
              6,
              71,
              200,
              0.08
            );
        }

        .finderNotice {
          margin-top: 17px;

          padding: 14px;

          display: flex;
          align-items: flex-start;

          gap: 10px;

          border-radius: 11px;

          background: #f8fafc;
        }

        .finderIcon {
          width: 27px;
          height: 27px;

          flex: 0 0 27px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          background: #e8f1ff;

          color: #0647c8;

          font-size: 12px;
          font-weight: 900;
        }

        .finderNotice strong {
          display: block;

          color: #344f6a;

          font-size: 13px;
        }

        .finderNotice p {
          margin: 4px 0 0;

          color: #718397;

          font-size: 12px;
          line-height: 1.5;
        }

        .actions {
          margin-top: 22px;

          display: flex;
          justify-content: flex-end;
        }

        .primaryButton {
          min-height: 47px;

          padding: 0 19px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          gap: 9px;

          border: 0;

          border-radius: 10px;

          background: #0647c8;

          color: #ffffff;

          font-family: inherit;

          font-size: 14px;
          font-weight: 850;

          cursor: pointer;

          box-shadow:
            0 9px 20px
            rgba(
              6,
              71,
              200,
              0.16
            );
        }

        .primaryButton span {
          font-size: 17px;
        }

        @media (
          max-width: 620px
        ) {
          .stepTitle h1 {
            font-size: 23px;
          }

          .formGrid {
            grid-template-columns:
              1fr;
          }

          .actions {
            justify-content:
              stretch;
          }

          .primaryButton {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children:
    React.ReactNode;
}) {
  return (
    <div className="field">
      <label>
        {label}
      </label>

      {children}
    </div>
  );
}
