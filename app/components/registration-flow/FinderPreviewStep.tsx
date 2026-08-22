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
      <div className="stepTitle center">
        <span>
          STEP 3 OF 3
        </span>

        <h1>
          რას ნახავს მპოვნელი
        </h1>

        <p>
          გადაამოწმეთ ინფორმაცია საბოლოო
          დადასტურებამდე. თუ ყველაფერი სწორია,
          შექმენით პროფილი.
        </p>
      </div>

      <section className="finderPreview">
        <div className="previewHero">
          <div className="photoArea">
            {draft.showPhoto &&
            photoPreview ? (
              <img
                src={photoPreview}
                alt={draft.itemName}
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
              {draft.itemName ||
                meta.label}
            </h2>

            <p>
              იპოვეთ? მფლობელთან დაკავშირება
              შეგიძლიათ ქვემოთ მოცემული
              საშუალებებით.
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
                value={
                  draft.ownerEmail
                }
              />
            )}
        </div>

        {draft.showDescription &&
          draft.description && (
            <PreviewBlock
              title="აღწერა"
              value={
                draft.description
              }
            />
          )}

        {isPet &&
          draft.showMedicalInfo &&
          draft.medicalInfo && (
            <PreviewBlock
              title="სამედიცინო ინფორმაცია"
              value={
                draft.medicalInfo
              }
            />
          )}

        {isPet &&
          draft.showBehaviourNote &&
          draft.behaviourNote && (
            <PreviewBlock
              title="ქცევის შესახებ ინფორმაცია"
              value={
                draft.behaviourNote
              }
            />
          )}

        {!isPet &&
          draft.distinctiveFeatures && (
            <PreviewBlock
              title="განმასხვავებელი ნიშნები"
              value={
                draft.distinctiveFeatures
              }
            />
          )}

        {draft.showLostLocation &&
          draft.lostLocation && (
            <PreviewBlock
              title="📍 დაკარგვის ადგილი"
              value={
                draft.lostLocation
              }
            />
          )}

        {draft.showFinderMessage &&
          draft.finderMessage && (
            <PreviewBlock
              title="მფლობელის შეტყობინება"
              value={
                draft.finderMessage
              }
              highlighted
            />
          )}

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
              className="contactButton"
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
            ეს არის ინფორმაცია, რომელსაც QR
            კოდის მპოვნელი დაინახავს. თუ რამეს
            შეცვლა გსურთ, დაბრუნდით რედაქტირებაზე.
          </p>
        </div>
      </div>

      <div className="actions">
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
            : "✓ ვადასტურებ და ვქმნი პროფილს"}
        </button>
      </div>

      <style jsx>{`
        .stepTitle {
          max-width: 660px;

          margin: 0 auto;

          text-align: center;
        }

        .stepTitle > span {
          color: #0647c8;

          font-size: 12px;
          font-weight: 900;

          letter-spacing: 0.8px;
        }

        .stepTitle h1 {
          margin: 6px 0 0;

          color: #203a55;

          font-size: 28px;
          line-height: 1.2;
        }

        .stepTitle p {
          margin: 7px 0 0;

          color: #718397;

          font-size: 14px;
          line-height: 1.55;
        }

        .finderPreview {
          max-width: 650px;

          margin: 22px auto 0;

          overflow: hidden;

          border: 1px solid #d7e2ee;
          border-radius: 18px;

          background: #ffffff;

          box-shadow:
            0 12px 30px
            rgba(
              25,
              60,
              100,
              0.06
            );
        }

        .previewHero {
          padding: 18px;

          display: flex;
          align-items: center;

          gap: 15px;

          background:
            linear-gradient(
              135deg,
              #f3f7fd,
              #eef5ff
            );
        }

        .photoArea {
          width: 82px;
          height: 82px;

          flex: 0 0 82px;

          overflow: hidden;

          border-radius: 18px;

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

          color: #ffffff;

          font-size: 39px;
        }

        .heroContent {
          min-width: 0;
        }

        .qrLabel {
          display: block;

          color: #0647c8;

          font-size: 11px;
          font-weight: 900;

          letter-spacing: 0.8px;
        }

        .heroContent h2 {
          margin: 5px 0 0;

          color: #29445f;

          font-size: 23px;
          line-height: 1.2;

          word-break: break-word;
        }

        .heroContent p {
          max-width: 430px;

          margin: 5px 0 0;

          color: #738599;

          font-size: 13px;
          line-height: 1.5;
        }

        .ownerGrid {
          padding: 15px;

          display: grid;

          grid-template-columns:
            repeat(
              2,
              minmax(0, 1fr)
            );

          gap: 9px;
        }

        .ownerItem {
          padding: 12px;

          border-radius: 10px;

          background: #f7faff;
        }

        .ownerItem span,
        .ownerItem strong {
          display: block;
        }

        .ownerItem span {
          color: #8493a3;

          font-size: 11px;
          font-weight: 700;
        }

        .ownerItem strong {
          margin-top: 4px;

          color: #314b66;

          font-size: 14px;
          font-weight: 800;

          word-break: break-word;
        }

        .previewBlock {
          margin: 0 15px 9px;

          padding: 13px;

          border-radius: 10px;

          background: #f8fafc;
        }

        .previewBlock.highlighted {
          border: 1px solid #cfe0f6;

          background: #f2f7ff;
        }

        .previewBlock strong {
          display: block;

          color: #314b66;

          font-size: 13px;
          font-weight: 850;
        }

        .previewBlock p {
          margin: 5px 0 0;

          color: #718397;

          font-size: 13px;
          line-height: 1.55;

          white-space: pre-wrap;
        }

        .contactActions {
          padding: 15px;

          display: grid;

          grid-template-columns:
            repeat(
              2,
              minmax(0, 1fr)
            );

          gap: 9px;

          border-top:
            1px solid #e7edf4;
        }

        .contactButton {
          min-height: 44px;

          border: 0;
          border-radius: 10px;

          background: #0647c8;

          color: #ffffff;

          font-family: inherit;

          font-size: 14px;
          font-weight: 850;

          cursor: default;
        }

        .confirmationNotice {
          max-width: 650px;

          margin: 14px auto 0;

          padding: 13px 14px;

          display: flex;
          align-items: flex-start;

          gap: 10px;

          border: 1px solid #cfe0f6;
          border-radius: 11px;

          background: #f4f8ff;
        }

        .confirmIcon {
          width: 28px;
          height: 28px;

          flex: 0 0 28px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          background: #0647c8;

          color: #ffffff;

          font-size: 12px;
          font-weight: 900;
        }

        .confirmationNotice strong {
          display: block;

          color: #304b66;

          font-size: 13px;
          font-weight: 850;
        }

        .confirmationNotice p {
          margin: 4px 0 0;

          color: #718397;

          font-size: 12px;
          line-height: 1.5;
        }

        .actions {
          max-width: 650px;

          margin: 22px auto 0;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 10px;
        }

        .backButton,
        .confirmButton {
          min-height: 47px;

          padding: 0 18px;

          border-radius: 10px;

          font-family: inherit;

          font-size: 14px;
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
            0 9px 20px
            rgba(
              6,
              71,
              200,
              0.16
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
          .stepTitle h1 {
            font-size: 24px;
          }

          .previewHero {
            align-items: flex-start;
          }

          .photoArea {
            width: 68px;
            height: 68px;

            flex-basis: 68px;
          }

          .emojiFallback {
            font-size: 32px;
          }

          .ownerGrid {
            grid-template-columns:
              1fr;
          }

          .actions {
            flex-direction: column-reverse;
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
