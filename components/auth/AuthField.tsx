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
            <span className="required">
              *
            </span>
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
          gap: 6px;
        }

        .labelRow {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        strong {
          color: #4f5c68;

          font-size: 9px;
          font-weight: 850;
        }

        .required {
          margin-left: 3px;

          color: #c84a50;
        }

        .description {
          margin: 0;

          color: #929ba4;

          font-size: 7px;
          line-height: 1.45;
        }

        input {
          width: 100%;
          height: 46px;

          padding: 0 12px;

          outline: 0;

          border:
            1px solid #dce2e6;

          border-radius: 10px;

          color: #2e3a45;
          background: #fbfcfc;

          font-family: inherit;
          font-size: 10px;

          transition:
            border-color 0.16s ease,
            box-shadow 0.16s ease,
            background 0.16s ease;
        }

        input:focus {
          border-color: #8eaadb;

          background: #ffffff;

          box-shadow:
            0 0 0 3px
            rgba(
              34,
              95,
              199,
              0.06
            );
        }

        input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        input::placeholder {
          color: #abb3ba;
        }
      `}</style>
    </label>
  );
}
