"use client";

import type {
  ReactNode,
} from "react";

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
        <span>STEP 1 OF 3</span>

        <h1>მფლობელის ინფორმაცია</h1>

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
            value={draft.ownerFirstName}
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
            value={draft.ownerLastName}
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
            value={draft.ownerPhone}
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
            value={draft.ownerEmail}
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

        <div className="finderText">
          <strong>Finder View</strong>

          <p>
            სახელი, გვარი და ტელეფონის ნომერი
            მპოვნელისთვის ყოველთვის ხილული
            იქნება. ელფოსტის ჩვენებას თქვენ
            აკონტროლებთ.
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
          margin: 6px 0 0;
          color: #203a55;
          font-size: 27px;
          font-weight: 900;
          line-height: 1.2;
        }

        .stepTitle p {
          max-width: 620px;
          margin: 8px 0 0;
          color: #718397;
          font-size: 14px;
          line-height: 1.55;
        }

        .accountNotice {
          width: 100%;
          margin-top: 20px;
          padding: 15px 17px;

          display: flex;
          align-items: flex-start;
          gap: 12px;

          box-sizing: border-box;

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
          line-height: 1.4;
        }

        .accountNotice p {
          margin: 4px 0 0;

          color: #718397;

          font-size: 13px;
          line-height: 1.5;
        }

        /* ================================
           OWNER INFORMATION FORM
           ================================ */

        .formGrid {
          width: 100%;

          margin-top: 23px;

          display: grid;

          grid-template-columns:
            minmax(0, 1fr)
            minmax(0, 1fr);

          column-gap: 22px;
          row-gap: 21px;

          align-items: start;

          box-sizing: border-box;
        }

        .field {
          width: 100%;
          min-width: 0;

          display: flex;
          flex-direction: column;

          box-sizing: border-box;
        }

        .field label {
          display: block;

          min-height: 19px;

          margin: 0 0 9px 2px;

          color: #344e68;

          font-size: 13px;
          font-weight: 800;
          line-height: 19px;
        }

        .field input {
          display: block;

          width: 100%;
          height: 56px;
          min-height: 56px;

          margin: 0;
          padding: 0 16px;

          box-sizing: border-box;

          border: 1.5px solid #d5e0eb;
          border-radius: 11px;

          background: #ffffff;
          color: #263f59;

          font-family: inherit;
          font-size: 15px;
          font-weight: 500;
          line-height: normal;

          outline: none;

          appearance: none;
          -webkit-appearance: none;

          transition:
            border-color 0.18s ease,
            box-shadow 0.18s ease,
            background 0.18s ease;
        }

        .field input:hover {
          border-color: #bdccda;
        }

        .field input:focus {
          border-color: #0647c8;

          background: #ffffff;

          box-shadow:
            0 0 0 4px
            rgba(6, 71, 200, 0.08);
        }

        /* ================================
           FINDER VIEW
           ================================ */

        .finderNotice {
          width: 100%;

          margin-top: 20px;
          padding: 15px 17px;

          display: grid;

          grid-template-columns:
            30px minmax(0, 1fr);

          align-items: start;
          column-gap: 12px;

          box-sizing: border-box;

          border: 1px solid #e3eaf2;
          border-radius: 12px;

          background: #f8fafc;
        }

        .finderIcon {
          width: 30px;
          height: 30px;

          display: grid;
          place-items: center;

          box-sizing: border-box;

          border: 1px solid #cfe0f5;
          border-radius: 50%;

          background: #eaf2ff;
          color: #0647c8;

          font-family:
            Arial,
            Helvetica,
            sans-serif;

          font-size: 13px;
          font-weight: 800;
          font-style: normal;
          line-height: 1;
        }

        .finderText {
          min-width: 0;
        }

        .finderText strong {
          display: block;

          margin: 0;

          color: #344f6a;

          font-size: 13px;
          font-weight: 850;
          line-height: 1.4;
        }

        .finderText p {
          max-width: 680px;

          margin: 4px 0 0;

          color: #718397;

          font-size: 12px;
          line-height: 1.55;
        }

        /* ================================
           ACTION
           ================================ */

        .actions {
          width: 100%;

          margin-top: 23px;

          display: flex;
          justify-content: flex-end;
        }

        .primaryButton {
          min-width: 142px;
          height: 48px;

          padding: 0 20px;

          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;

          box-sizing: border-box;

          border: 0;
          border-radius: 10px;

          background: #0647c8;
          color: #ffffff;

          font-family: inherit;
          font-size: 14px;
          font-weight: 850;

          cursor: pointer;

          box-shadow:
            0 8px 20px
            rgba(6, 71, 200, 0.17);

          transition:
            transform 0.18s ease,
            box-shadow 0.18s ease,
            background 0.18s ease;
        }

        .primaryButton:hover {
          background: #053eaf;

          transform: translateY(-1px);

          box-shadow:
            0 10px 24px
            rgba(6, 71, 200, 0.21);
        }

        .primaryButton:active {
          transform: translateY(0);
        }

        .primaryButton span {
          font-size: 17px;
          line-height: 1;
        }

        /* ================================
           RESPONSIVE
           ================================ */

        @media (max-width: 700px) {
          .formGrid {
            column-gap: 15px;
          }
        }

        @media (max-width: 600px) {
          .stepTitle h1 {
            font-size: 24px;
          }

          .formGrid {
            grid-template-columns: 1fr;

            row-gap: 18px;
          }

          .field input {
            height: 55px;
            min-height: 55px;

            font-size: 16px;
          }

          .finderNotice,
          .accountNotice {
            padding: 14px;
          }

          .actions {
            margin-top: 20px;
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
  children: ReactNode;
}) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
    </div>
  );
}
