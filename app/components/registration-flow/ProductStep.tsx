"use client";

import type {
  ChangeEvent,
  ReactNode,
} from "react";

import PhotoUploader from "./PhotoUploader";
import VisibilityToggle from "./VisibilityToggle";

import {
  getProductFormText,
  isPetType,
  showBrandField,
  showMaterialField,
  showModelField,
  showSizeField,
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

  update: <
    K extends keyof RegistrationDraft
  >(
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
  const pet =
    isPetType(type);

  const showBrand =
    showBrandField(type);

  const showModel =
    showModelField(type);

  const showSize =
    showSizeField(type);

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
          {getProductFormText(
            type
          )}
        </p>
      </div>

      {/* BASIC INFO */}

      <section className="formSection">
        <div className="sectionHeader">
          <span>
            01
          </span>

          <div>
            <strong>
              ძირითადი ინფორმაცია
            </strong>

            <p>
              შეავსეთ პროდუქტის ან
              ცხოველის ამოსაცნობად საჭირო
              ინფორმაცია.
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
              value={
                draft.tagCode
              }
              onChange={(
                event
              ) =>
                update(
                  "tagCode",
                  event.target.value
                    .toUpperCase()
                    .replace(
                      /\s/g,
                      ""
                    )
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
              value={
                draft.itemName
              }
              onChange={(
                event
              ) =>
                update(
                  "itemName",
                  event.target.value
                )
              }
              placeholder={
                type === "dog"
                  ? "მაგ. Max"
                  : type === "cat"
                  ? "მაგ. Luna"
                  : "მაგ. ჩემი ნივთი"
              }
            />
          </Field>

          <Field label="ფერი">
            <input
              type="text"
              value={
                draft.colour
              }
              onChange={(
                event
              ) =>
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
                  value={
                    draft.sex
                  }
                  onChange={(
                    event
                  ) =>
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
                  onChange={(
                    event
                  ) =>
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
                  value={
                    draft.weight
                  }
                  onChange={(
                    event
                  ) =>
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
                value={
                  draft.brand
                }
                onChange={(
                  event
                ) =>
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
                value={
                  draft.model
                }
                onChange={(
                  event
                ) =>
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
                value={
                  draft.size
                }
                onChange={(
                  event
                ) =>
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
                value={
                  draft.material
                }
                onChange={(
                  event
                ) =>
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
      </section>

      {/* PHOTO */}

      <section className="formSection">
        <div className="sectionHeader">
          <span>
            02
          </span>

          <div>
            <strong>
              ფოტო
            </strong>

            <p>
              კარგი ფოტო მპოვნელისთვის
              ამოცნობას მნიშვნელოვნად
              ამარტივებს.
            </p>
          </div>
        </div>

        <PhotoUploader
          preview={
            photoPreview
          }
          showPhoto={
            draft.showPhoto
          }
          onChange={
            onPhotoChange
          }
          onRemove={
            onPhotoRemove
          }
          onVisibilityChange={(
            value
          ) =>
            update(
              "showPhoto",
              value
            )
          }
        />
      </section>

      {/* ADDITIONAL INFO */}

      <section className="formSection">
        <div className="sectionHeader">
          <span>
            03
          </span>

          <div>
            <strong>
              დამატებითი ინფორმაცია
            </strong>

            <p>
              დაამატეთ ის ინფორმაცია,
              რომელიც მპოვნელისთვის
              სასარგებლო იქნება.
            </p>
          </div>
        </div>

        <div className="formGrid">
          <Field label="აღწერა">
            <textarea
              rows={3}
              value={
                draft.description
              }
              onChange={(
                event
              ) =>
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
                onChange={(
                  event
                ) =>
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
                onChange={(
                  event
                ) =>
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
                onChange={(
                  event
                ) =>
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
              onChange={(
                event
              ) =>
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
              onChange={(
                event
              ) =>
                update(
                  "finderMessage",
                  event.target.value
                )
              }
              placeholder="მაგ. გთხოვთ დამიკავშირდეთ. დიდი მადლობა დახმარებისთვის."
            />
          </Field>
        </div>
      </section>

      {/* FINDER VIEW */}

      <section className="formSection">
        <div className="sectionHeader">
          <span>
            04
          </span>

          <div>
            <strong>
              რას დაინახავს მპოვნელი
            </strong>

            <p>
              სახელი, გვარი და
              ტელეფონის ნომერი ყოველთვის
              ხილულია. დანარჩენი
              ინფორმაცია თქვენ
              აკონტროლებთ.
            </p>
          </div>
        </div>

        <div className="visibilityGrid">
          <VisibilityToggle
            label="სახელი და გვარი"
            description="მპოვნელისთვის ყოველთვის ხილულია."
            value={true}
            onChange={() => {}}
            locked
          />

          <VisibilityToggle
            label="ტელეფონის ნომერი"
            description="მპოვნელისთვის ყოველთვის ხილულია."
            value={true}
            onChange={() => {}}
            locked
          />

          <VisibilityToggle
            label="ელფოსტა"
            description="აჩვენეთ თქვენი ელფოსტა მპოვნელისთვის."
            value={
              draft.showEmail
            }
            onChange={(
              value
            ) =>
              update(
                "showEmail",
                value
              )
            }
          />

          <VisibilityToggle
            label="ფოტო"
            description="აჩვენეთ დამატებული ფოტო Finder View-ში."
            value={
              draft.showPhoto
            }
            onChange={(
              value
            ) =>
              update(
                "showPhoto",
                value
              )
            }
          />

          <VisibilityToggle
            label="აღწერა"
            description="აჩვენეთ დამატებული აღწერა."
            value={
              draft.showDescription
            }
            onChange={(
              value
            ) =>
              update(
                "showDescription",
                value
              )
            }
          />

          {pet && (
            <>
              <VisibilityToggle
                label="სამედიცინო ინფორმაცია"
                description="აჩვენეთ მხოლოდ მაშინ, თუ ეს მპოვნელისთვის მნიშვნელოვანია."
                value={
                  draft.showMedicalInfo
                }
                onChange={(
                  value
                ) =>
                  update(
                    "showMedicalInfo",
                    value
                  )
                }
              />

              <VisibilityToggle
                label="ქცევის შესახებ ინფორმაცია"
                description="აჩვენეთ ინფორმაცია ცხოველის ქცევის შესახებ."
                value={
                  draft.showBehaviourNote
                }
                onChange={(
                  value
                ) =>
                  update(
                    "showBehaviourNote",
                    value
                  )
                }
              />
            </>
          )}

          <VisibilityToggle
            label="დაკარგვის ადგილი"
            description="აჩვენეთ სად დაიკარგა ან ბოლოს სად ნახეთ."
            value={
              draft.showLostLocation
            }
            onChange={(
              value
            ) =>
              update(
                "showLostLocation",
                value
              )
            }
          />

          <VisibilityToggle
            label="შეტყობინება მპოვნელისთვის"
            description="აჩვენეთ თქვენ მიერ დაწერილი შეტყობინება."
            value={
              draft.showFinderMessage
            }
            onChange={(
              value
            ) =>
              update(
                "showFinderMessage",
                value
              )
            }
          />

          <VisibilityToggle
            label="Live Chat"
            description="მპოვნელმა შეძლოს თქვენთან Live Chat-ის დაწყება."
            value={
              draft.liveChatEnabled
            }
            onChange={(
              value
            ) =>
              update(
                "liveChatEnabled",
                value
              )
            }
          />
        </div>
      </section>

      {/* ACTIONS */}

      <div className="actions">
        <button
          type="button"
          className="backButton"
          onClick={
            onBack
          }
        >
          ← უკან
        </button>

        <button
          type="button"
          className="primaryButton"
          onClick={
            onNext
          }
        >
          შემოწმება

          <span>
            →
          </span>
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
          width: 30px;
          height: 30px;

          flex: 0 0 30px;

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

          font-size: 15px;
          font-weight: 850;
        }

        .sectionHeader p {
          max-width: 620px;

          margin: 3px 0 0;

          color: #8190a0;

          font-size: 12px;
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
          grid-column:
            1 / -1;
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
            border-color
              0.18s ease,
            box-shadow
              0.18s ease;
        }

        .field input,
        .field select {
          min-height: 45px;

          padding:
            0 12px;
        }

        .field textarea {
          min-height: 82px;

          padding:
            10px 12px;

          resize: vertical;

          line-height: 1.45;
        }

        .field input:focus,
        .field select:focus,
        .field textarea:focus {
          border-color:
            #0647c8;

          box-shadow:
            0 0 0 3px
            rgba(
              6,
              71,
              200,
              0.08
            );
        }

        .visibilityGrid {
          display: grid;

          grid-template-columns:
            repeat(
              2,
              minmax(0, 1fr)
            );

          gap: 10px;
        }

        .actions {
          margin-top: 23px;

          display: flex;
          align-items: center;
          justify-content:
            space-between;

          gap: 12px;
        }

        .backButton,
        .primaryButton {
          min-height: 47px;

          padding:
            0 18px;

          display: inline-flex;
          align-items: center;
          justify-content:
            center;

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

          background:
            #ffffff;

          color:
            #64788d;
        }

        .primaryButton {
          border: 0;

          background:
            #0647c8;

          color:
            #ffffff;

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
          max-width: 700px
        ) {
          .visibilityGrid {
            grid-template-columns:
              1fr;
          }
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
            grid-column:
              auto;
          }

          .actions {
            flex-direction:
              column-reverse;
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
