"use client";

type Props = {
  children: React.ReactNode;

  type?: "button" | "submit" | "reset";

  loading?: boolean;
  disabled?: boolean;

  loadingText?: string;

  onClick?: () => void;
};

export default function AuthButton({
  children,

  type = "button",

  loading = false,
  disabled = false,

  loadingText = "Please wait...",

  onClick,
}: Props) {
  return (
    <button
      type={type}
      disabled={
        disabled ||
        loading
      }
      onClick={onClick}
    >
      {loading
        ? loadingText
        : children}

      <style jsx>{`
        button {
          width: 100%;
          min-height: 46px;

          padding: 0 16px;

          border: 0;
          border-radius: 10px;

          color: white;
          background: #202b37;

          cursor: pointer;

          font-family: inherit;
          font-size: 9px;
          font-weight: 850;

          transition:
            transform 0.15s ease,
            opacity 0.15s ease,
            background 0.15s ease;
        }

        button:hover:not(:disabled) {
          background: #18212b;

          transform:
            translateY(-1px);
        }

        button:active:not(:disabled) {
          transform:
            translateY(0);
        }

        button:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }
      `}</style>
    </button>
  );
}
