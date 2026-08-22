"use client";

import type { ChangeEvent, ReactNode } from "react";

import PhotoUploader from "./PhotoUploader";

import {
  getProductFormText,
  showBrandField,
  showMaterialField,
  showModelField,
  showSizeField,
  isPetType,
} from "./productConfig";

import type {
  ProductMeta,
  ProductType,
  RegistrationDraft,
} from "./registrationTypes";

type ProductStepProps = {
  type: ProductType;

  meta: ProductMeta;

  draft: RegistrationDraft;

  update: <K extends keyof RegistrationDraft>(
    key: K,
    value: RegistrationDraft[K]
  ) => void;

  photoPreview: string;

  onPhotoChange: (
    event: ChangeEvent<HTMLInputElement>
  ) => void;

  onPhotoRemove: () => void;

  onBack: () => void;

  onNext: () => void;
};

export default function ProductStep({
  type,
  meta,
  draft,
  update,
  photoPreview,
  onPhotoChange,
  onPhotoRemove,
  onBack,
  onNext,
}: ProductStepProps) {
  const pet = isPetType(type);

  const showBrand = showBrandField(type);

  const showModel = showModelField(type);

  const showSize = showSizeField(type);

  const showMaterial =
    showMaterialField(type);

  return (
    <>
      <div className="stepTitle">
        <span>
          STEP 2 OF 3
        </span>

        <h1>
          <span className="productEmoji">
            {meta.emoji}
          </span>

          {meta.label}
        </h1>

        <p>
          {getProductFormText(type)}
        </p>
      </div>

      <div className="formSection">
        <div className="sectionHeader">
          <span>01</span>

          <div>
            <strong>
              ძირითადი ინფორმაცია
            </strong>

            <p>
              შეავსეთ ინფორმაცია, რომელიც
              დაგეხმარებათ პროფილის
              იდენტიფიცირებაში.
            </p>
          </div>
        </div>

        <div className="formGrid">
          <Field
            label="QR / Tag Code *"
            full
          >
            <input
              type="text"
              value={draft.tagCode}
              onChange={(event) =>
                update(
                  "tagCode",
                  event.target.value
                    .toUpperCase()
                    .replace(/\s/g, "")
                )
              }
              placeholder="მაგ. QR-000123"
              autoCapitalize="characters"
            />
          </Field>

          <Field
            label={
              pet
                ? "სახელი *"
                : "პროფილის სახელი *"
            }
          >
            <input
              type="text"
              value={draft.itemName}
              onChange={(event) =>
                update(
                  "itemName",
                  event.target.value
                )
              }
              placeholder={
                pet
                  ? type === "dog"
                    ? "მაგ. Max"
                    : "მაგ. Luna"
                  : "მაგ. ჩემი ჩანთა"
              }
            />
          </Field>

          <Field label="ფერი">
            <input
              type="text"
              value={draft.colour}
              onChange={(event) =>
                update(
                  "colour",
                  event.target.value
                )
              }
              placeholder="მაგ. შავი"
            />
          </Field>

          {pet && (
            <>
              <Field label="სქესი">
                <select
                  value={draft.sex}
                  onChange={(event) =>
                    update(
                      "sex",
                      event.target.value
                    )
                  }
                >
                  <option value="">
                    აირჩიეთ
                  </option>

                  <option value="male">
                    მამრი
                  </option>

                  <option value="female">
                    მდედრი
                  </option>
                </select>
              </Field>

              <Field label="დაბადების თარიღი">
                <input
                  type="date"
                  value={
                    draft.dateOfBirth
                  }
                  onChange={(event) =>
                    update(
                      "dateOfBirth",
                      event.target.value
                    )
                  }
                />
              </Field>

              <Field label="წონა">
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={draft.weight}
                  onChange={(event) =>
                    update(
                      "weight",
                      event.target.value
                    )
                  }
                  placeholder="კგ"
                />
              </Field>
            </>
          )}

          {showBrand && (
            <Field label="ბრენდი">
              <input
                type="text"
                value={draft.brand}
                onChange={(event) =>
                  update(
                    "brand",
                    event.target.value
                  )
                }
                placeholder="ბრენდი"
              />
            </Field>
          )}

          {showModel && (
            <Field label="მოდელი">
              <input
                type="text"
                value={draft.model}
                onChange={(event) =>
                  update(
                    "model",
                    event.target.value
                  )
                }
                placeholder="მოდელი"
              />
            </Field>
          )}

          {showSize && (
            <Field label="ზომა">
              <input
                type="text"
                value={draft.size}
                onChange={(event) =>
                  update(
                    "size",
                    event.target.value
                  )
                }
                placeholder="ზომა"
              />
            </Field>
          )}

          {showMaterial && (
            <Field label="მასალა">
              <input
                type="text"
                value={draft.material}
                onChange={(event) =>
                  update(
                    "material",
                    event.target.value
                  )
                }
                placeholder="მასალა"
              />
            </Field>
          )}
        </div>
      </div>

      <div className="formSection">
        <div className="sectionHeader">
          <span>02</span>

          <div>
            <strong>
              ფოტო
            </strong>

            <p>
              კარგი ფოტო მპოვნელისთვის
              ამოცნობას ამარტივებს.
            </p>
          </div>
        </div>

        <PhotoUploader
          preview={photoPreview}
          showPhoto={draft.showPhoto}
          onChange={onPhotoChange}
          onRemove={onPhotoRemove}
          onVisibilityChange={(value) =>
            update(
              "showPhoto",
              value
            )
          }
        />
      </div>

      <div className="formSection">
        <div className="sectionHeader">
          <span>03</span>

          <div>
            <strong>
              დამატებითი ინფორმაცია
            </strong>

            <p>
              დაამატეთ მხოლოდ ის ინფორმაცია,
              რომელიც მპოვნელს რეალურად
              დაეხმარება.
            </p>
          </div>
        </div>

        <div className="formGrid">
          <Field
            label={
              pet
                ? "აღწერა"
                : "აღწერა / დამატებითი ინფორმაცია"
            }
          >
            <textarea
              rows={3}
              value={draft.description}
              onChange={(event) =>
                update(
                  "description",
                  event.target.value
                )
              }
              placeholder={
                pet
                  ? "მოკლე აღწერა"
                  : "ნივთის მოკლე აღწერა"
              }
            />
          </Field>

          {pet ? (
            <Field label="ქცევის შესახებ ინფორმაცია">
              <textarea
                rows={3}
                value={
                  draft.behaviourNote
                }
                onChange={(event) =>
                  update(
                    "behaviourNote",
                    event.target.value
                  )
                }
                placeholder="მაგ. მეგობრულია, შეიძლება შეშინდეს ხმაურისგან..."
              />
            </Field>
          ) : (
            <Field label="განმასხვავებელი ნიშნები">
              <textarea
                rows={3}
                value={
                  draft.distinctiveFeatures
                }
                onChange={(event) =>
                  update(
                    "distinctiveFeatures",
                    event.target.value
                  )
                }
                placeholder="ნიშნები, რომლითაც ნივთის ამოცნობა მარტივია"
              />
            </Field>
          )}

          {pet && (
            <Field label="სამედიცინო ინფორმაცია">
              <textarea
                rows={3}
                value={
                  draft.medicalInfo
                }
                onChange={(event) =>
                  update(
                    "medicalInfo",
                    event.target.value
                  )
                }
                placeholder="ალერგია, მედიკამენტი ან სხვა მნიშვნელოვანი ინფორმაცია"
              />
            </Field>
          )}

          <Field label="დაკარგვის ადგილი">
            <input
              type="text"
              value={
                draft.lostLocation
              }
              onChange={(event) =>
                update(
                  "lostLocation",
                  event.target.value
                )
              }
              placeholder="მაგ. Central Park, New York"
            />
          </Field>

          <Field
            label="შეტყობინება მპოვნელისთვის"
            full
          >
            <textarea
              rows={3}
              value={
                draft.finderMessage
              }
              onChange={(event) =>
                update(
                  "finderMessage",
                  event.target.value
                )
              }
              placeholder="მაგ. გთხოვთ დამიკავშირდეთ. დიდი მადლობა დახმარებისთვის."
            />
          </Field>
        </div>
      </div>

      <div className="actions">
        <button
          type="button"
          className="backButton"
          onClick={onBack}
        >
          ← უკან
        </button>

        <button
          type="button"
          className="primaryButton"
          onClick={onNext}
        >
          შემოწმება
          <span>→</span>
        </button>
      </div>

      <style jsx>{`
        .stepTitle > span {
          color: #0647c8;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.8px;
        }

        .stepTitle h1 {
          margin: 5px 0 0;

          display: flex;
          align-items: center;

          gap: 8px;

          color: #203a55;

          font-size: 27px;
          line-height: 1.2;
        }

        .productEmoji {
          font-size: 29px;
        }

        .stepTitle p {
          max-width: 620px;

          margin: 7px 0 0;

          color: #718397;

          font-size: 14px;
          line-height: 1.55;
        }

        .formSection {
          margin-top: 20px;

          padding-top: 18px;

          border-top:
            1px solid #e4ebf3;
        }

        .sectionHeader {
          margin-bottom: 14px;

          display: flex;
          align-items: flex-start;

          gap: 10px;
        }

        .sectionHeader > span {
          width: 29px;
          height: 29px;

          flex: 0 0 29px;

          display: grid;
          place-items: center;

          border-radius: 8px;

          background: #edf4ff;

          color: #0647c8;

          font-size: 10px;
          font-weight: 900;
        }

        .sectionHeader strong {
          display: block;

          color: #304a65;

          font-size: 14px;
          font-weight: 850;
        }

        .sectionHeader p {
          margin: 3px 0 0;

          color: #8190a0;

          font-size: 11px;
          line-height: 1.45;
        }

        .formGrid {
          display: grid;

          grid-template-columns:
            repeat(
              2,
              minmax(0, 1fr)
            );

          gap: 12px;
        }

        .field.full {
          grid-column: 1 / -1;
        }

        .field label {
          display: block;

          margin-bottom: 6px;

          color: #344e68;

          font-size: 13px;
          font-weight: 800;
        }

        .field input,
        .field select,
        .field textarea {
          width: 100%;

          border:
            1px solid #d5e0eb;

          border-radius: 10px;

          background: #ffffff;

          color: #263f59;

          font-family: inherit;
          font-size: 14px;

          outline: none;

          transition:
            border-color 0.18s ease,
            box-shadow 0.18s ease;
        }

        .field input,
        .field select {
          min-height: 45px;

          padding: 0 12px;
        }

        .field textarea {
          min-height: 86px;

          padding: 11px 12px;

          resize: vertical;
        }

        .field input:focus,
        .field select:focus,
        .field textarea:focus {
          border-color: #0647c8;

          box-shadow:
            0 0 0 3px
            rgba(
              6,
              71,
              200,
              0.08
            );
        }

        .actions {
          margin-top: 23px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 12px;
        }

        .backButton,
        .primaryButton {
          min-height: 47px;

          padding: 0 18px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          gap: 8px;

          border-radius: 10px;

          font-family: inherit;

          font-size: 14px;
          font-weight: 850;

          cursor: pointer;
        }

        .backButton {
          border:
            1px solid #d6e1ec;

          background: #ffffff;

          color: #64788d;
        }

        .primaryButton {
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

        .primaryButton span {
          font-size: 17px;
        }

        @media (
          max-width: 650px
        ) {
          .stepTitle h1 {
            font-size: 23px;
          }

          .formGrid {
            grid-template-columns:
              1fr;
          }

          .field.full {
            grid-column: auto;
          }

          .actions {
            flex-direction: column-reverse;
          }

          .backButton,
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
  full = false,
}: {
  label: string;
  children: ReactNode;
  full?: boolean;
}) {
  return (
    <div
      className={
        full
          ? "field full"
          : "field"
      }
    >
      <label>
        {label}
      </label>

      {children}
    </div>
  );
}
