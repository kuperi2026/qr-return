"use client";

import type { ReactNode } from "react";

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
          გადაამოწმეთ თქვენი საკონტაქტო ინფორმაცია.
        </p>
      </div>

      <div className="accountNotice">
        <span className="accountCheck">✓</span>

        <div>
          <strong>
            ინფორმაცია მიღებულია თქვენი ანგარიშიდან
          </strong>

          <p>
            საჭიროების შემთხვევაში შეგიძლიათ აქვე განაახლოთ.
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
            სახელი, გვარი და ტელეფონი ყოველთვის ხილულია.
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

      <style jsx global>{`
        .stepTitle > span {
          color: #0647c8;

          font-size: 11px;
          font-weight: 900;

          letter-spacing: 0.8px;
        }

        .stepTitle h1 {
          margin: 5px 0 0;

          color: #203a55;

          font-size: 25px;
          font-weight: 900;

          line-height: 1.2;
        }

        .stepTitle p {
          margin: 6px 0 0;

          color: #718397;

          font-size: 13px;

          line-height: 1.5;
        }

        .accountNotice {
          width: 100%;

          margin-top: 16px;

          padding: 11px 13px;

          display: flex;

          align-items: center;

          gap: 10px;

          box-sizing: border-box;

          border:
            1px solid #d5e3f4;

          border-radius: 11px;

          background: #f7faff;
        }

        .accountCheck {
          width: 27px;
          height: 27px;

          flex: 0 0 27px;

          display: grid;

          place-items: center;

          border-radius: 50%;

          background: #0647c8;

          color: #ffffff;

          font-size: 12px;
          font-weight: 900;
        }

        .accountNotice strong {
          display: block;

          color: #304d69;

          font-size: 12px;
          font-weight: 850;

          line-height: 1.35;
        }

        .accountNotice p {
          margin: 2px 0 0;

          color: #7b8da0;

          font-size: 11px;

          line-height: 1.4;
        }

        .formGrid {
          width: 100%;

          margin-top: 18px;

          display: grid;

          grid-template-columns:
            repeat(
              2,
              minmax(0, 1fr)
            );

          column-gap: 22px;

          row-gap: 18px;

          align-items: start;
        }

        .field {
          width: 100%;

          min-width: 0;

          box-sizing: border-box;
        }

        .field label {
          display: block;

          min-height: 19px;

          margin:
            0 0 8px 2px;

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

          padding:
            0 16px;

          box-sizing: border-box;

          border:
            1.5px solid #d5e0eb;

          border-radius: 11px;

          background: #ffffff;

          color: #263f59;

          font-family: inherit;

          font-size: 15px;
          font-weight: 500;

          outline: none;

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
            rgba(
              6,
              71,
              200,
              0.08
            );
        }

        .finderNotice {
          width: 100%;

          margin-top: 16px;

          padding: 10px 12px;

          display: grid;

          grid-template-columns:
            26px minmax(0, 1fr);

          align-items: center;

          gap: 9px;

          box-sizing: border-box;

          border:
            1px solid #e1e8f0;

          border-radius: 10px;

          background: #f8fafc;
        }

        .finderIcon {
          width: 26px;
          height: 26px;

          display: grid;

          place-items: center;

          border-radius: 50%;

          background: #eaf2ff;

          color: #0647c8;

          font-size: 12px;
          font-weight: 900;
        }

        .finderText strong {
          display: block;

          color: #344f6a;

          font-size: 12px;
          font-weight: 850;
        }

        .finderText p {
          margin: 2px 0 0;

          color: #718397;

          font-size: 11px;

          line-height: 1.4;
        }

        .actions {
          width: 100%;

          margin-top: 18px;

          display: flex;

          justify-content: flex-end;
        }

        .primaryButton {
          min-width: 138px;

          height: 47px;

          padding:
            0 18px;

          display: inline-flex;

          align-items: center;

          justify-content: center;

          gap: 8px;

          border: 0;

          border-radius: 10px;

          background: #0647c8;

          color: #ffffff;

          font-family: inherit;

          font-size: 13px;
          font-weight: 850;

          cursor: pointer;

          box-shadow:
            0 8px 18px
            rgba(
              6,
              71,
              200,
              0.15
            );
        }

        .primaryButton span {
          font-size: 16px;
        }

        @media (
          max-width: 600px
        ) {
          .stepTitle h1 {
            font-size: 23px;
          }

          .formGrid {
            grid-template-columns: 1fr;

            row-gap: 16px;
          }

          .field input {
            height: 55px;

            min-height: 55px;

            font-size: 16px;
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
      <label>
        {label}
      </label>

      {children}
    </div>
  );
}
