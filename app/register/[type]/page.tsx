/* ========================================
   QR RETURN — PREMIUM FORM FIELDS
   ======================================== */

.formGrid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 22px;
  row-gap: 20px;
  align-items: start;
}

.formGrid > * {
  min-width: 0;
}

.full,
.fullWidth,
.spanTwo {
  grid-column: 1 / -1;
}

/* FIELD */

.field {
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field label {
  display: block;
  margin: 0 0 0 2px;

  color: #334b63;

  font-size: 13px;
  font-weight: 800;
  line-height: 1.35;
}

/* INPUT / SELECT / TEXTAREA */

.field input,
.field select,
.field textarea,
.formGrid input,
.formGrid select,
.formGrid textarea {
  width: 100% !important;
  max-width: none !important;

  margin: 0 !important;

  border: 1.5px solid #d8e2ec !important;
  border-radius: 12px !important;

  background: #fbfdff !important;
  color: #243d56 !important;

  font-family: inherit !important;
  font-size: 15px !important;
  font-weight: 500 !important;

  outline: none !important;

  box-sizing: border-box !important;

  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    background 0.18s ease;
}

/* STANDARD INPUT HEIGHT */

.field input,
.field select,
.formGrid input,
.formGrid select {
  height: 56px !important;
  min-height: 56px !important;

  padding: 0 16px !important;
}

/* TEXTAREA */

.field textarea,
.formGrid textarea {
  min-height: 118px !important;

  padding: 15px 16px !important;

  line-height: 1.55 !important;

  resize: vertical;
}

/* FOCUS */

.field input:focus,
.field select:focus,
.field textarea:focus,
.formGrid input:focus,
.formGrid select:focus,
.formGrid textarea:focus {
  border-color: #1266e9 !important;

  background: #ffffff !important;

  box-shadow:
    0 0 0 4px
    rgba(18, 102, 233, 0.09) !important;
}

/* PLACEHOLDER */

.field input::placeholder,
.field textarea::placeholder,
.formGrid input::placeholder,
.formGrid textarea::placeholder {
  color: #a2afbb !important;
  opacity: 1;
}

/* SELECT */

.field select,
.formGrid select {
  cursor: pointer;

  appearance: auto;
}

/* SMALL INFORMATION UNDER FIELD */

.fieldHint,
.help,
.hint {
  display: block;

  margin: 0 0 0 2px;

  color: #8493a2;

  font-size: 11px;
  font-weight: 500;
  line-height: 1.45;
}

/* SECTION */

.formSection {
  width: 100%;

  padding: 24px;

  border: 1px solid #e1e8ef;
  border-radius: 16px;

  background: #ffffff;
}

.formSection + .formSection {
  margin-top: 20px;
}

.formSectionTitle {
  margin-bottom: 19px;
}

.formSectionTitle h3 {
  margin: 0;

  color: #263f58;

  font-size: 17px;
  font-weight: 900;
}

.formSectionTitle p {
  margin: 5px 0 0;

  color: #7d8d9c;

  font-size: 12px;
  line-height: 1.5;
}

/* CARD */

.card {
  width: calc(100% - 32px);
  max-width: 920px;

  margin-left: auto;
  margin-right: auto;

  padding: 30px 32px;

  border: 1px solid #e0e8f0;
  border-radius: 18px;

  background: #ffffff;

  box-shadow:
    0 14px 38px
    rgba(28, 59, 95, 0.08);
}

/* STEP TITLE */

.stepTitle {
  margin-bottom: 25px;
}

.stepTitle h1,
.stepTitle h2 {
  margin: 0;

  color: #243d56;

  font-weight: 900;
  line-height: 1.25;
}

.stepTitle p {
  max-width: 650px;

  margin: 7px 0 0;

  color: #788999;

  font-size: 13px;
  line-height: 1.55;
}

/* BUTTON AREA */

.formActions,
.buttons {
  width: 100%;

  margin-top: 27px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 12px;
}

/* PHOTO AREA */

.photoUpload,
.photoUploader,
.photoBox {
  width: 100%;
  min-height: 180px;

  border: 1.5px dashed #c9d7e5;
  border-radius: 14px;

  background: #f8fbff;
}

/* TOGGLE ROWS */

.toggleRow,
.visibilityRow {
  width: 100%;
  min-height: 62px;

  padding: 13px 15px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 18px;

  border: 1px solid #e0e8f0;
  border-radius: 12px;

  background: #ffffff;
}

.toggleRow + .toggleRow,
.visibilityRow + .visibilityRow {
  margin-top: 10px;
}

/* ========================================
   TABLET
   ======================================== */

@media (max-width: 800px) {
  .card {
    width: calc(100% - 24px);

    padding: 26px 24px;
  }

  .formGrid {
    column-gap: 16px;
    row-gap: 18px;
  }
}

/* ========================================
   MOBILE
   ======================================== */

@media (max-width: 620px) {
  .card {
    width: calc(100% - 20px);

    padding: 23px 18px;

    border-radius: 16px;
  }

  .formGrid {
    grid-template-columns: 1fr;

    row-gap: 17px;
  }

  .full,
  .fullWidth,
  .spanTwo {
    grid-column: auto;
  }

  .field input,
  .field select,
  .formGrid input,
  .formGrid select {
    height: 54px !important;
    min-height: 54px !important;

    font-size: 16px !important;
  }

  .field textarea,
  .formGrid textarea {
    min-height: 110px !important;

    font-size: 16px !important;
  }

  .formActions,
  .buttons {
    flex-direction: column-reverse;
  }

  .formActions button,
  .buttons button {
    width: 100%;
  }
}
