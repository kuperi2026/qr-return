"use client";

import type {
  ProductMeta,
  ProductType,
  RegistrationDraft,
} from "./registrationTypes";

type FinderPreviewStepProps = {
  type: ProductType;
  meta: ProductMeta;
  draft: RegistrationDraft;
  photoPreview: string;
  onBack: () => void;
  onConfirm: () => void;
  saving: boolean;
};

export default function FinderPreviewStep({
  type,
  meta,
  draft,
  photoPreview,
  onBack,
  onConfirm,
  saving,
}: FinderPreviewStepProps) {
  const isPet =
    type === "dog" ||
    type === "cat";

  return (
    <>
      <div className="previewTitle">
        <span>STEP 3 OF 3</span>

        <h1>რას ნახავს მპოვნელი</h1>

        <p>
          გადაამოწმეთ ინფორმაცია პროფილის შექმნამდე.
        </p>
      </div>

      <section className="finderPreview">
        <div className="previewHero">
          <div className="photoArea">
            {draft.showPhoto && photoPreview ? (
              <img
                src={photoPreview}
                alt={draft.itemName || meta.label}
              />
            ) : (
              <div className="emojiFallback">
                {meta.emoji}
              </div>
            )}
          </div>

          <div className="heroContent">
            <span className="qrLabel">
              QR RETURN
            </span>

            <h2>
              {draft.itemName || meta.label}
            </h2>

            <p>
              მპოვნელს შეუძლია აქედან დაგიკავშირდეთ.
            </p>
          </div>
        </div>

        <div className="ownerGrid">
          <PreviewItem
            label="მფლობელი"
            value={`${draft.ownerFirstName} ${draft.ownerLastName}`}
          />

          <PreviewItem
            label="ტელეფონი"
            value={draft.ownerPhone}
          />

          {draft.showEmail &&
            draft.ownerEmail && (
              <PreviewItem
                label="ელფოსტა"
                value={draft.ownerEmail}
              />
            )}
        </div>

        <div className="detailGrid">
          {draft.showDescription &&
            draft.description && (
              <PreviewBlock
                title="აღწერა"
                value={draft.description}
              />
            )}

          {isPet &&
            draft.showMedicalInfo &&
            draft.medicalInfo && (
              <PreviewBlock
                title="სამედიცინო ინფორმაცია"
                value={draft.medicalInfo}
              />
            )}

          {isPet &&
            draft.showBehaviourNote &&
            draft.behaviourNote && (
              <PreviewBlock
                title="ქცევის ინფორმაცია"
                value={draft.behaviourNote}
              />
            )}

          {!isPet &&
            draft.distinctiveFeatures && (
              <PreviewBlock
                title="განმასხვავებელი ნიშნები"
                value={draft.distinctiveFeatures}
              />
            )}

          {draft.showLostLocation &&
            draft.lostLocation && (
              <PreviewBlock
                title="📍 დაკარგვის ადგილი"
                value={draft.lostLocation}
              />
            )}

          {draft.showFinderMessage &&
            draft.finderMessage && (
              <PreviewBlock
                title="მფლობელის შეტყობინება"
                value={draft.finderMessage}
                highlighted
              />
            )}
        </div>

        <div className="contactActions">
          <button
            type="button"
            className="contactButton"
          >
            ☎ დარეკვა
          </button>

          {draft.liveChatEnabled && (
            <button
              type="button"
              className="contactButton secondary"
            >
              Live Chat
            </button>
          )}
        </div>
      </section>

      <div className="confirmationNotice">
        <div className="confirmIcon">
          ✓
        </div>

        <div>
          <strong>
            საბოლოო შემოწმება
          </strong>

          <p>
            ზუსტად ამ ინფორმაციას დაინახავს QR კოდის მპოვნელი.
          </p>
        </div>
      </div>

      <div className="previewActions">
        <button
          type="button"
          className="backButton"
          onClick={onBack}
          disabled={saving}
        >
          ← რედაქტირება
        </button>

        <button
          type="button"
          className="confirmButton"
          onClick={onConfirm}
          disabled={saving}
        >
          {saving
            ? "პროფილი იქმნება..."
            : "✓ პროფილის შექმნა"}
        </button>
      </div>

      <style jsx>{`
        .previewTitle {
          text-align: center;
        }

        .previewTitle > span {
          color: #0647c8;

          font-size: 11px;
          font-weight: 900;

          letter-spacing: 0.8px;
        }

        .previewTitle h1 {
          margin: 5px 0 0;

          color: #203a55;

          font-size: 25px;
          font-weight: 900;

          line-height: 1.2;
        }

        .previewTitle p {
          margin: 5px 0 0;

          color: #718397;

          font-size: 12px;
          line-height: 1.45;
        }

        .finderPreview {
          max-width: 620px;

          margin: 16px auto 0;

          overflow: hidden;

          border: 1px solid #d9e3ee;

          border-radius: 15px;

          background: #ffffff;

          box-shadow:
            0 10px 26px
            rgba(25, 60, 100, 0.05);
        }

        .previewHero {
          padding: 13px 14px;

          display: flex;
          align-items: center;

          gap: 12px;

          background:
            linear-gradient(
              135deg,
              #f7faff,
              #eef5ff
            );
        }

        .photoArea {
          width: 64px;
          height: 64px;

          flex: 0 0 64px;

          overflow: hidden;

          border-radius: 14px;

          background: #0647c8;
        }

        .photoArea img {
          width: 100%;
          height: 100%;

          display: block;

          object-fit: cover;
        }

        .emojiFallback {
          width: 100%;
          height: 100%;

          display: grid;

          place-items: center;

          font-size: 30px;
        }

        .heroContent {
          min-width: 0;
        }

        .qrLabel {
          display: block;

          color: #0647c8;

          font-size: 9px;
          font-weight: 900;

          letter-spacing: 0.7px;
        }

        .heroContent h2 {
          margin: 3px 0 0;

          color: #29445f;

          font-size: 19px;
          font-weight: 900;

          line-height: 1.2;

          word-break: break-word;
        }

        .heroContent p {
          margin: 3px 0 0;

          color: #738599;

          font-size: 11px;

          line-height: 1.4;
        }

        .ownerGrid {
          padding: 10px 12px 6px;

          display: grid;

          grid-template-columns:
            repeat(
              2,
              minmax(0, 1fr)
            );

          gap: 7px;
        }

        .ownerItem {
          min-width: 0;

          padding: 9px 10px;

          border-radius: 9px;

          background: #f7faff;
        }

        .ownerItem span,
        .ownerItem strong {
          display: block;
        }

        .ownerItem span {
          color: #8493a3;

          font-size: 9px;
          font-weight: 750;
        }

        .ownerItem strong {
          margin-top: 2px;

          color: #314b66;

          font-size: 12px;
          font-weight: 850;

          word-break: break-word;
        }

        .detailGrid {
          padding: 4px 12px 10px;

          display: grid;

          grid-template-columns:
            repeat(
              2,
              minmax(0, 1fr)
            );

          gap: 7px;
        }

        .previewBlock {
          min-width: 0;

          padding: 9px 10px;

          border:
            1px solid #edf1f5;

          border-radius: 9px;

          background: #fbfcfe;
        }

        .previewBlock.highlighted {
          border-color: #cfe0f6;

          background: #f2f7ff;
        }

        .previewBlock strong {
          display: block;

          color: #314b66;

          font-size: 11px;
          font-weight: 850;
        }

        .previewBlock p {
          margin: 3px 0 0;

          color: #718397;

          font-size: 11px;

          line-height: 1.4;

          white-space: pre-wrap;
        }

        .contactActions {
          padding: 10px 12px;

          display: grid;

          grid-template-columns:
            repeat(
              2,
              minmax(0, 1fr)
            );

          gap: 7px;

          border-top:
            1px solid #e7edf4;
        }

        .contactButton {
          height: 40px;

          border: 0;

          border-radius: 9px;

          background: #0647c8;

          color: #ffffff;

          font-family: inherit;

          font-size: 12px;
          font-weight: 850;
        }

        .contactButton.secondary {
          border:
            1px solid #cbdcf2;

          background: #f2f7ff;

          color: #0647c8;
        }

        .confirmationNotice {
          max-width: 620px;

          margin: 10px auto 0;

          padding: 10px 12px;

          display: flex;

          align-items: center;

          gap: 9px;

          box-sizing: border-box;

          border:
            1px solid #d3e2f5;

          border-radius: 10px;

          background: #f7faff;
        }

        .confirmIcon {
          width: 25px;
          height: 25px;

          flex: 0 0 25px;

          display: grid;

          place-items: center;

          border-radius: 50%;

          background: #0647c8;

          color: #ffffff;

          font-size: 11px;
          font-weight: 900;
        }

        .confirmationNotice strong {
          display: block;

          color: #304b66;

          font-size: 11px;
          font-weight: 850;
        }

        .confirmationNotice p {
          margin: 2px 0 0;

          color: #718397;

          font-size: 10px;

          line-height: 1.4;
        }

        .previewActions {
          max-width: 620px;

          margin: 14px auto 0;

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 9px;
        }

        .backButton,
        .confirmButton {
          height: 45px;

          padding: 0 16px;

          border-radius: 9px;

          font-family: inherit;

          font-size: 12px;
          font-weight: 850;

          cursor: pointer;
        }

        .backButton {
          border:
            1px solid #d4dfeb;

          background: #ffffff;

          color: #62768b;
        }

        .confirmButton {
          border: 0;

          background: #0647c8;

          color: #ffffff;

          box-shadow:
            0 8px 18px
            rgba(
              6,
              71,
              200,
              0.14
            );
        }

        .backButton:disabled,
        .confirmButton:disabled {
          cursor: not-allowed;

          opacity: 0.6;
        }

        @media (
          max-width: 620px
        ) {
          .previewTitle h1 {
            font-size: 23px;
          }

          .ownerGrid,
          .detailGrid {
            grid-template-columns:
              1fr;
          }

          .photoArea {
            width: 58px;
            height: 58px;

            flex-basis: 58px;
          }

          .previewActions {
            flex-direction:
              column-reverse;
          }

          .backButton,
          .confirmButton {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}

function PreviewItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="ownerItem">
      <span>
        {label}
      </span>

      <strong>
        {value || "—"}
      </strong>
    </div>
  );
}

function PreviewBlock({
  title,
  value,
  highlighted = false,
}: {
  title: string;
  value: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={
        highlighted
          ? "previewBlock highlighted"
          : "previewBlock"
      }
    >
      <strong>
        {title}
      </strong>

      <p>
        {value}
      </p>
    </div>
  );
}
