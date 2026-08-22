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
          min-height: 56px;

          padding: 8px 10px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 10px;

          box-sizing: border-box;

          border: 1px solid #dfe7ef;
          border-radius: 10px;

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

          gap: 5px;
        }

        .labelLine strong {
          color: #29445f;

          font-size: 12px;
          font-weight: 850;

          line-height: 1.25;
        }

        .alwaysVisible {
          padding: 2px 5px;

          border-radius: 999px;

          background: #e9f1ff;

          color: #0647c8;

          font-size: 7px;
          font-weight: 900;

          letter-spacing: 0.25px;

          line-height: 1.3;
        }

        .visibilityText p {
          margin: 2px 0 0;

          color: #8090a0;

          font-size: 10px;

          line-height: 1.3;
        }

        .toggleButton,
        .lockedToggle {
          flex: 0 0 auto;

          min-width: 72px;
          height: 32px;

          padding: 4px 6px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 6px;

          box-sizing: border-box;

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
          border-color: #bfd2ed;

          background: #eef5ff;
        }

        .lockedToggle {
          border: 1px solid #c8daf4;

          background: #eef5ff;
        }

        .toggleTrack,
        .lockedTrack {
          position: relative;

          width: 30px;
          height: 18px;

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

        .lockedTrack {
          background: #0647c8;
        }

        .toggleDot,
        .lockedDot {
          position: absolute;

          top: 3px;

          width: 12px;
          height: 12px;

          border-radius: 50%;

          background: #ffffff;

          box-shadow:
            0 1px 3px
            rgba(
              0,
              0,
              0,
              0.16
            );
        }

        .toggleDot {
          left: 3px;

          transition:
            transform 0.18s ease;
        }

        .toggleButton.on
        .toggleDot {
          transform:
            translateX(12px);
        }

        .lockedDot {
          right: 3px;
        }

        .toggleButton strong,
        .lockedToggle strong {
          min-width: 20px;

          font-size: 9px;
          font-weight: 900;
        }

        .toggleButton strong {
          color: #8796a5;
        }

        .toggleButton.on strong,
        .lockedToggle strong {
          color: #0647c8;
        }

        @media (
          max-width: 520px
        ) {
          .visibilityRow {
            min-height: 54px;

            padding: 8px 9px;
          }

          .visibilityText p {
            display: none;
          }

          .toggleButton,
          .lockedToggle {
            min-width: 68px;
          }
        }
      `}</style>
    </>
  );
}
