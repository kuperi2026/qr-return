"use client";

import type {
  RegistrationStep,
} from "./registrationTypes";

type RegistrationProgressProps = {
  step: RegistrationStep;
  productLabel: string;
};

export default function RegistrationProgress({
  step,
  productLabel,
}: RegistrationProgressProps) {
  const steps = [
    {
      number: 1,
      label: "მფლობელი",
    },
    {
      number: 2,
      label: productLabel,
    },
    {
      number: 3,
      label: "შემოწმება",
    },
  ] as const;

  return (
    <>
      <section className="progress">
        {steps.map(
          (
            item,
            index
          ) => {
            const completed =
              step >
              item.number;

            const active =
              step ===
              item.number;

            return (
              <div
                className="progressPart"
                key={item.number}
              >
                <div
                  className={[
                    "progressStep",
                    completed
                      ? "completed"
                      : "",
                    active
                      ? "active"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <div className="stepCircle">
                    {completed
                      ? "✓"
                      : item.number}
                  </div>

                  <span>
                    {item.label}
                  </span>
                </div>

                {index <
                  steps.length -
                    1 && (
                  <div
                    className={[
                      "line",
                      completed
                        ? "filled"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  />
                )}
              </div>
            );
          }
        )}
      </section>

      <style jsx>{`
        .progress {
          position: relative;
          z-index: 2;

          width: 100%;
          max-width: 650px;

          margin: 25px auto 0;

          display: flex;
          align-items: center;
        }

        .progressPart {
          flex: 1;

          display: flex;
          align-items: center;
        }

        .progressPart:last-child {
          flex: 0 0 auto;
        }

        .progressStep {
          display: flex;
          align-items: center;

          gap: 8px;

          color:
            rgba(
              255,
              255,
              255,
              0.52
            );

          font-size: 13px;
          font-weight: 800;

          white-space: nowrap;
        }

        .stepCircle {
          width: 32px;
          height: 32px;

          display: grid;
          place-items: center;

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.35
            );

          border-radius: 50%;

          font-size: 12px;
          font-weight: 900;
        }

        .progressStep.active,
        .progressStep.completed {
          color: #ffffff;
        }

        .progressStep.active
          .stepCircle,
        .progressStep.completed
          .stepCircle {
          background: #ffffff;

          color: #0647c8;
        }

        .line {
          flex: 1;

          height: 2px;

          margin: 0 11px;

          background:
            rgba(
              255,
              255,
              255,
              0.22
            );
        }

        .line.filled {
          background:
            #ffffff;
        }

        @media (
          max-width: 600px
        ) {
          .progress {
            max-width: 320px;
          }

          .progressStep span {
            display: none;
          }

          .line {
            margin:
              0 7px;
          }
        }
      `}</style>
    </>
  );
}
