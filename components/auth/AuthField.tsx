"use client";

type Props = {
  label: string;
  value: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  description?: string;
  autoComplete?: string;
  onChange: (value: string) => void;
};

export default function AuthField({
  label,
  value,
  type = "text",
  placeholder = "",
  required = false,
  disabled = false,
  description,
  autoComplete,
  onChange,
}: Props) {
  return (
    <label className="field">
      <div className="labelRow">
        <strong>
          {label}
          {required && (
            <span className="required">*</span>
          )}
        </strong>
      </div>

      {description && (
        <p className="description">
          {description}
        </p>
      )}

      <input
        type={type}
        value={value}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(event) =>
          onChange(event.target.value)
        }
      />

      <style jsx>{`
        .field {
          width: 100%;

          display: grid;

          gap: 9px;
        }

        .labelRow {
          display: flex;

          align-items: center;

          justify-content: space-between;
        }

        strong {
          color: #4f5c68;

          font-size: 13px;

          font-weight: 850;

          line-height: 1.35;
        }

        .required {
          margin-left: 4px;

          color: #c84a50;
        }

        .description {
          margin: -2px 0 1px;

          color: #929ba4;

          font-size: 11px;

          line-height: 1.45;
        }

        /*
          მთავარი ცვლილება:

          ძველი იყო:
          height: 46px;

          ახალი არის:
          height: 68px;
        */

        input {
          width: 100%;

          height: 68px;

          padding: 0 18px;

          outline: 0;

          border:
            1px solid #dce2e6;

          border-radius: 12px;

          color: #2e3a45;

          background: #fbfcfc;

          font-family: inherit;

          font-size: 15px;

          font-weight: 500;

          line-height: normal;

          transition:
            border-color 0.16s ease,
            box-shadow 0.16s ease,
            background 0.16s ease;
        }

        input:hover {
          border-color: #c8d3dc;

          background: #ffffff;
        }

        input:focus {
          border-color: #8eaadb;

          background: #ffffff;

          box-shadow:
            0 0 0 4px
            rgba(34, 95, 199, 0.08);
        }

        input:disabled {
          opacity: 0.6;

          cursor: not-allowed;
        }

        input::placeholder {
          color: #abb3ba;
        }

        @media (max-width: 520px) {
          strong {
            font-size: 12px;
          }

          .description {
            font-size: 10px;
          }

          input {
            height: 62px;

            padding: 0 16px;

            font-size: 16px;
          }
        }
      `}</style>
    </label>
  );
}
