"use client";

import type {
  ChangeEvent,
} from "react";

type PhotoUploaderProps = {
  preview: string;

  showPhoto: boolean;

  onChange: (
    event:
      ChangeEvent<HTMLInputElement>
  ) => void;

  onRemove: () => void;

  onVisibilityChange: (
    value: boolean
  ) => void;
};

export default function PhotoUploader({
  preview,
  showPhoto,
  onChange,
  onRemove,
  onVisibilityChange,
}: PhotoUploaderProps) {
  return (
    <>
      <section className="photoSection">
        <div className="photoHeader">
          <div>
            <span className="eyebrow">
              PHOTO
            </span>

            <h2>
              ფოტოს დამატება
            </h2>

            <p>
              დაამატეთ ფოტო, რათა მპოვნელმა
              უფრო მარტივად ამოიცნოს თქვენი
              ცხოველი ან ნივთი.
            </p>
          </div>

          <button
            type="button"
            className={
              showPhoto
                ? "visibilityButton on"
                : "visibilityButton"
            }
            onClick={() =>
              onVisibilityChange(
                !showPhoto
              )
            }
          >
            <span>
              მპოვნელისთვის
            </span>

            <strong>
              {showPhoto
                ? "ON"
                : "OFF"}
            </strong>
          </button>
        </div>

        {!preview ? (
          <label className="uploadBox">
            <div className="uploadIcon">
              +
            </div>

            <strong>
              ფოტოს დამატება
            </strong>

            <p>
              დააჭირეთ ფოტოს ასარჩევად
            </p>

            <small>
              JPG, PNG ან WEBP · მაქსიმუმ 5 MB
            </small>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={onChange}
            />
          </label>
        ) : (
          <div className="previewCard">
            <div className="imageWrap">
              <img
                src={preview}
                alt="არჩეული ფოტო"
              />
            </div>

            <div className="previewContent">
              <div>
                <span className="ready">
                  ✓ ფოტო დამატებულია
                </span>

                <h3>
                  ფოტო მზადაა
                </h3>

                <p>
                  ეს ფოტო გამოჩნდება Finder Preview-ში,
                  თუ ფოტოს ჩვენება ჩართულია.
                </p>
              </div>

              <div className="photoActions">
                <label className="changeButton">
                  ფოტოს შეცვლა

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={onChange}
                  />
                </label>

                <button
                  type="button"
                  className="removeButton"
                  onClick={onRemove}
                >
                  წაშლა
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      <style jsx>{`
        .photoSection {
          margin-top: 20px;
          padding-top: 18px;

          border-top:
            1px solid #e4ebf3;
        }

        .photoHeader {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;

          gap: 18px;
        }

        .eyebrow {
          display: block;

          color: #0647c8;

          font-size: 11px;
          font-weight: 900;

          letter-spacing: 0.9px;
        }

        .photoHeader h2 {
          margin: 5px 0 0;

          color: #29445f;

          font-size: 18px;
          line-height: 1.2;
        }

        .photoHeader p {
          max-width: 540px;

          margin: 6px 0 0;

          color: #74869a;

          font-size: 13px;
          line-height: 1.55;
        }

        .visibilityButton {
          min-width: 125px;
          min-height: 44px;

          padding: 0 12px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 10px;

          border: 1px solid #d6e1ec;
          border-radius: 10px;

          background: #ffffff;

          color: #65778b;

          font-family: inherit;

          cursor: pointer;
        }

        .visibilityButton span {
          font-size: 11px;
          font-weight: 750;
        }

        .visibilityButton strong {
          padding: 5px 8px;

          border-radius: 999px;

          background: #e5ebf2;

          color: #748599;

          font-size: 10px;
          font-weight: 900;
        }

        .visibilityButton.on {
          border-color: #b7cff1;

          background: #f5f9ff;
        }

        .visibilityButton.on strong {
          background: #0647c8;

          color: #ffffff;
        }

        .uploadBox {
          min-height: 130px;

          margin-top: 14px;

          padding: 20px;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          border:
            2px dashed #b9cce4;

          border-radius: 14px;

          background: #f8fbff;

          text-align: center;

          cursor: pointer;

          transition:
            border-color .18s ease,
            background .18s ease;
        }

        .uploadBox:hover {
          border-color: #0647c8;

          background: #f2f7ff;
        }

        .uploadBox input {
          display: none;
        }

        .uploadIcon {
          width: 40px;
          height: 40px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          background: #0647c8;

          color: #ffffff;

          font-size: 24px;
          font-weight: 500;
        }

        .uploadBox strong {
          margin-top: 9px;

          color: #29445f;

          font-size: 14px;
          font-weight: 850;
        }

        .uploadBox p {
          margin: 4px 0 0;

          color: #718397;

          font-size: 13px;
        }

        .uploadBox small {
          margin-top: 5px;

          color: #8a99a9;

          font-size: 11px;
        }

        .previewCard {
          margin-top: 14px;

          padding: 13px;

          display: grid;

          grid-template-columns:
            135px 1fr;

          gap: 16px;

          align-items: center;

          border:
            1px solid #dbe5ef;

          border-radius: 14px;

          background: #f9fbfe;
        }

        .imageWrap {
          width: 135px;
          height: 105px;

          overflow: hidden;

          border-radius: 11px;

          background: #e9eef5;
        }

        .imageWrap img {
          width: 100%;
          height: 100%;

          display: block;

          object-fit: cover;
        }

        .previewContent {
          min-width: 0;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 16px;
        }

        .ready {
          color: #16815a;

          font-size: 11px;
          font-weight: 900;
        }

        .previewContent h3 {
          margin: 5px 0 0;

          color: #29445f;

          font-size: 16px;
        }

        .previewContent p {
          max-width: 420px;

          margin: 5px 0 0;

          color: #74869a;

          font-size: 12px;
          line-height: 1.5;
        }

        .photoActions {
          display: flex;
          align-items: center;

          gap: 7px;

          flex: 0 0 auto;
        }

        .changeButton,
        .removeButton {
          min-height: 40px;

          padding: 0 12px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          border-radius: 9px;

          font-family: inherit;

          font-size: 12px;
          font-weight: 850;

          cursor: pointer;

          white-space: nowrap;
        }

        .changeButton {
          background: #0647c8;

          color: #ffffff;
        }

        .changeButton input {
          display: none;
        }

        .removeButton {
          border:
            1px solid #d6e1ec;

          background: #ffffff;

          color: #66798e;
        }

        @media (
          max-width: 700px
        ) {
          .photoHeader {
            flex-direction: column;
          }

          .visibilityButton {
            width: 100%;
          }

          .previewCard {
            grid-template-columns: 1fr;
          }

          .imageWrap {
            width: 100%;
            height: 190px;
          }

          .previewContent {
            align-items: flex-start;
            flex-direction: column;
          }

          .photoActions {
            width: 100%;
          }

          .changeButton,
          .removeButton {
            flex: 1;
          }
        }
      `}</style>
    </>
  );
}
