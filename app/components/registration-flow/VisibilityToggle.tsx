"use client";

type VisibilityToggleProps = {
  label: string;
  description?: string;
  value: boolean;
  onChange: (value: boolean) => void;
  locked?: boolean;
  lockedText?: string;
};

export default function VisibilityToggle({
  label,
  description,
  value,
  onChange,
  locked = false,
  lockedText = "ALWAYS VISIBLE",
}: VisibilityToggleProps) {
  return (
    <>
      <div
        className={[
          "visibilityRow",
          locked ? "locked" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="visibilityText">
          <div className="labelLine">
            <strong>{label}</strong>

            {locked && (
              <span className="alwaysVisible">
                {lockedText}
              </span>
            )}
          </div>

          {description && (
            <p>{description}</p>
          )}
        </div>

        {locked ? (
          <div
            className="lockedToggle"
            aria-label={`${label} ყოველთვის ხილულია`}
          >
            <span className="lockedTrack">
              <span className="lockedDot" />
            </span>

            <strong>ON</strong>
          </div>
        ) : (
          <button
            type="button"
            className={[
              "toggleButton",
              value ? "on" : "off",
            ].join(" ")}
            onClick={() =>
              onChange(!value)
            }
            aria-pressed={value}
            aria-label={`${label}: ${
              value ? "ON" : "OFF"
            }`}
          >
            <span className="toggleTrack">
              <span className="toggleDot" />
            </span>

            <strong>
              {value ? "ON" : "OFF"}
            </strong>
          </button>
        )}
      </div>

      <style jsx>{`
        .visibilityRow {
          width: 100%;
          min-height: 72px;

          padding: 13px 15px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 16px;

          border: 1px solid #dce6f0;
          border-radius: 12px;

          background: #ffffff;
        }

        .visibilityRow.locked {
          background: #f8fbff;
        }

        .visibilityText {
          min-width: 0;
          flex: 1;
        }

        .labelLine {
          display: flex;
          align-items: center;
          flex-wrap: wrap;

          gap: 8px;
        }

        .labelLine strong {
          color: #29445f;

          font-size: 14px;
          font-weight: 850;
          line-height: 1.3;
        }

        .alwaysVisible {
          padding: 4px 7px;

          border-radius: 999px;

          background: #e9f1ff;

          color: #0647c8;

          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.35px;
        }

        .visibilityText p {
          margin: 5px 0 0;

          color: #7b8da0;

          font-size: 12px;
          line-height: 1.45;
        }

        .toggleButton,
        .lockedToggle {
          flex: 0 0 auto;

          min-width: 91px;
          min-height: 38px;

          padding: 5px 8px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 8px;

          border-radius: 999px;
        }

        .toggleButton {
          border: 1px solid #d7e1eb;

          background: #f6f8fb;

          font-family: inherit;

          cursor: pointer;

          transition:
            background 0.18s ease,
            border-color 0.18s ease;
        }

        .toggleButton.on {
          border-color: #b7cff1;

          background: #eef5ff;
        }

        .toggleTrack,
        .lockedTrack {
          position: relative;

          width: 34px;
          height: 20px;

          display: block;

          border-radius: 999px;
        }

        .toggleTrack {
          background: #cbd5df;

          transition:
            background 0.18s ease;
        }

        .toggleButton.on
          .toggleTrack {
          background: #0647c8;
        }

        .toggleDot,
        .lockedDot {
          position: absolute;
          top: 3px;

          width: 14px;
          height: 14px;

          border-radius: 50%;

          background: #ffffff;

          box-shadow:
            0 1px 3px
            rgba(0, 0, 0, 0.18);
        }

        .toggleDot {
          left: 3px;

          transition:
            transform 0.18s ease;
        }

        .toggleButton.on
          .toggleDot {
          transform:
            translateX(14px);
        }

        .toggleButton strong {
          min-width: 25px;

          color: #8291a1;

          font-size: 10px;
          font-weight: 900;
        }

        .toggleButton.on strong {
          color: #0647c8;
        }

        .lockedToggle {
          border: 1px solid #c8daf4;

          background: #eef5ff;
        }

        .lockedTrack {
          background: #0647c8;
        }

        .lockedDot {
          right: 3px;
        }

        .lockedToggle strong {
          color: #0647c8;

          font-size: 10px;
          font-weight: 900;
        }

        @media (
          max-width: 520px
        ) {
          .visibilityRow {
            min-height: 68px;

            padding: 12px;
          }

          .labelLine strong {
            font-size: 13px;
          }

          .visibilityText p {
            font-size: 11px;
          }

          .toggleButton,
          .lockedToggle {
            min-width: 84px;
          }
        }
      `}</style>
    </>
  );
}
