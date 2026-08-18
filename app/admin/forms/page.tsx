"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Lang = "ka" | "en";

type RegistrationForm = {
  id: string;
  form_key: string;
  name_ka: string;
  name_en: string;
  description_ka: string | null;
  description_en: string | null;
  enabled: boolean;
  submit_button_ka: string;
  submit_button_en: string;
  success_message_ka: string | null;
  success_message_en: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

type RegistrationField = {
  id: string;
  form_id: string;
  field_key: string;
  field_type:
    | "text"
    | "email"
    | "tel"
    | "number"
    | "date"
    | "textarea"
    | "select"
    | "radio"
    | "checkbox"
    | "toggle"
    | "file"
    | "image"
    | "qr_code";
  label_ka: string;
  label_en: string;
  placeholder_ka: string | null;
  placeholder_en: string | null;
  help_text_ka: string | null;
  help_text_en: string | null;
  section_key: string | null;
  section_title_ka: string | null;
  section_title_en: string | null;
  enabled: boolean;
  required: boolean;
  editable: boolean;
  admin_only: boolean;
  visible_on_public_profile: boolean;
  user_can_control_visibility: boolean;
  sort_order: number;
  options: unknown;
  validation: unknown;
  default_value: unknown;
  created_at: string;
  updated_at: string;
};

type EditableField = RegistrationField & {
  dirty?: boolean;
};

const fieldTypes = [
  "text",
  "email",
  "tel",
  "number",
  "date",
  "textarea",
  "select",
  "radio",
  "checkbox",
  "toggle",
  "file",
  "image",
  "qr_code",
] as const;

export default function RegistrationFormsAdminPage() {
  const [lang, setLang] = useState<Lang>("ka");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [forms, setForms] = useState<RegistrationForm[]>([]);
  const [selectedFormId, setSelectedFormId] = useState("");
  const [fields, setFields] = useState<EditableField[]>([]);

  const [showAddField, setShowAddField] = useState(false);

  const [newField, setNewField] = useState({
    field_key: "",
    field_type: "text" as RegistrationField["field_type"],
    label_ka: "",
    label_en: "",
    placeholder_ka: "",
    placeholder_en: "",
    help_text_ka: "",
    help_text_en: "",
    required: false,
    enabled: true,
    sort_order: 1,
  });

  const ka = lang === "ka";

  const selectedForm = useMemo(
    () => forms.find((form) => form.id === selectedFormId) || null,
    [forms, selectedFormId]
  );

  useEffect(() => {
    async function start() {
      setLoading(true);
      setError("");

      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData.user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const { data: adminData, error: adminError } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", userData.user.id)
        .maybeSingle();

      if (adminError) {
        setError(adminError.message);
        setLoading(false);
        return;
      }

      if (!adminData) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      setIsAdmin(true);

      const { data: formData, error: formError } = await supabase
        .from("registration_forms")
        .select(`
          id,
          form_key,
          name_ka,
          name_en,
          description_ka,
          description_en,
          enabled,
          submit_button_ka,
          submit_button_en,
          success_message_ka,
          success_message_en,
          sort_order,
          created_at,
          updated_at
        `)
        .order("sort_order", { ascending: true });

      if (formError) {
        setError(formError.message);
        setLoading(false);
        return;
      }

      const loadedForms = (formData || []) as RegistrationForm[];

      setForms(loadedForms);

      if (loadedForms.length > 0) {
        setSelectedFormId(loadedForms[0].id);
      }

      setLoading(false);
    }

    void start();
  }, []);

  useEffect(() => {
    if (!selectedFormId || !isAdmin) {
      setFields([]);
      return;
    }

    void loadFields(selectedFormId);
  }, [selectedFormId, isAdmin]);

  async function loadFields(formId: string) {
    setError("");
    setSuccess("");

    const { data, error: fieldError } = await supabase
      .from("registration_form_fields")
      .select(`
        id,
        form_id,
        field_key,
        field_type,
        label_ka,
        label_en,
        placeholder_ka,
        placeholder_en,
        help_text_ka,
        help_text_en,
        section_key,
        section_title_ka,
        section_title_en,
        enabled,
        required,
        editable,
        admin_only,
        visible_on_public_profile,
        user_can_control_visibility,
        sort_order,
        options,
        validation,
        default_value,
        created_at,
        updated_at
      `)
      .eq("form_id", formId)
      .order("sort_order", { ascending: true });

    if (fieldError) {
      setError(fieldError.message);
      return;
    }

    setFields((data || []) as EditableField[]);
  }

  function updateField(
    id: string,
    patch: Partial<EditableField>
  ) {
    setFields((current) =>
      current.map((field) =>
        field.id === id
          ? {
              ...field,
              ...patch,
              dirty: true,
            }
          : field
      )
    );
  }

  async function saveFields() {
    if (!selectedForm) {
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const dirtyFields = fields.filter((field) => field.dirty);

      for (const field of dirtyFields) {
        const { error: updateError } = await supabase
          .from("registration_form_fields")
          .update({
            field_type: field.field_type,
            label_ka: field.label_ka,
            label_en: field.label_en,
            placeholder_ka: field.placeholder_ka || null,
            placeholder_en: field.placeholder_en || null,
            help_text_ka: field.help_text_ka || null,
            help_text_en: field.help_text_en || null,
            enabled: field.enabled,
            required: field.required,
            editable: field.editable,
            admin_only: field.admin_only,
            visible_on_public_profile:
              field.visible_on_public_profile,
            user_can_control_visibility:
              field.user_can_control_visibility,
            sort_order: Number(field.sort_order) || 0,
            updated_at: new Date().toISOString(),
          })
          .eq("id", field.id);

        if (updateError) {
          throw new Error(updateError.message);
        }
      }

      await loadFields(selectedForm.id);

      setSuccess(
        ka
          ? "ცვლილებები წარმატებით შეინახა."
          : "Changes saved successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : String(err)
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleFormEnabled() {
    if (!selectedForm) {
      return;
    }

    setError("");
    setSuccess("");

    const next = !selectedForm.enabled;

    const { error: updateError } = await supabase
      .from("registration_forms")
      .update({
        enabled: next,
        updated_at: new Date().toISOString(),
      })
      .eq("id", selectedForm.id);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setForms((current) =>
      current.map((form) =>
        form.id === selectedForm.id
          ? {
              ...form,
              enabled: next,
            }
          : form
      )
    );

    setSuccess(
      next
        ? ka
          ? "ფორმა ჩაირთო."
          : "Form enabled."
        : ka
        ? "ფორმა გამოირთო."
        : "Form disabled."
    );
  }

  async function addField(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedForm) {
      return;
    }

    const fieldKey = newField.field_key.trim();
    const labelKa = newField.label_ka.trim();
    const labelEn = newField.label_en.trim();

    if (!fieldKey || !labelKa || !labelEn) {
      setError(
        ka
          ? "Field key, ქართული სახელი და ინგლისური სახელი სავალდებულოა."
          : "Field key, Georgian label and English label are required."
      );
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    const { error: insertError } = await supabase
      .from("registration_form_fields")
      .insert({
        form_id: selectedForm.id,
        field_key: fieldKey,
        field_type: newField.field_type,
        label_ka: labelKa,
        label_en: labelEn,
        placeholder_ka:
          newField.placeholder_ka.trim() || null,
        placeholder_en:
          newField.placeholder_en.trim() || null,
        help_text_ka:
          newField.help_text_ka.trim() || null,
        help_text_en:
          newField.help_text_en.trim() || null,
        enabled: newField.enabled,
        required: newField.required,
        editable: true,
        admin_only: false,
        visible_on_public_profile: false,
        user_can_control_visibility: false,
        sort_order: Number(newField.sort_order) || fields.length + 1,
      });

    if (insertError) {
      setError(insertError.message);
      setSaving(false);
      return;
    }

    setNewField({
      field_key: "",
      field_type: "text",
      label_ka: "",
      label_en: "",
      placeholder_ka: "",
      placeholder_en: "",
      help_text_ka: "",
      help_text_en: "",
      required: false,
      enabled: true,
      sort_order: fields.length + 2,
    });

    setShowAddField(false);

    await loadFields(selectedForm.id);

    setSuccess(
      ka
        ? "ახალი ველი დაემატა."
        : "New field added."
    );

    setSaving(false);
  }

  async function deleteField(field: EditableField) {
    if (
      !window.confirm(
        ka
          ? `წავშალოთ ველი „${field.label_ka}“?`
          : `Delete field "${field.label_en}"?`
      )
    ) {
      return;
    }

    setError("");
    setSuccess("");

    const { error: deleteError } = await supabase
      .from("registration_form_fields")
      .delete()
      .eq("id", field.id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setFields((current) =>
      current.filter((item) => item.id !== field.id)
    );

    setSuccess(
      ka
        ? "ველი წაიშალა."
        : "Field deleted."
    );
  }

  async function updateFormText(
    patch: Partial<RegistrationForm>
  ) {
    if (!selectedForm) {
      return;
    }

    setForms((current) =>
      current.map((form) =>
        form.id === selectedForm.id
          ? {
              ...form,
              ...patch,
            }
          : form
      )
    );
  }

  async function saveFormSettings() {
    if (!selectedForm) {
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    const { error: updateError } = await supabase
      .from("registration_forms")
      .update({
        name_ka: selectedForm.name_ka,
        name_en: selectedForm.name_en,
        description_ka: selectedForm.description_ka || null,
        description_en: selectedForm.description_en || null,
        submit_button_ka: selectedForm.submit_button_ka,
        submit_button_en: selectedForm.submit_button_en,
        success_message_ka:
          selectedForm.success_message_ka || null,
        success_message_en:
          selectedForm.success_message_en || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", selectedForm.id);

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    setSuccess(
      ka
        ? "ფორმის პარამეტრები შენახულია."
        : "Form settings saved."
    );

    setSaving(false);
  }

  if (loading) {
    return (
      <main className="statePage">
        <div className="loader" />

        <strong>
          {ka
            ? "Registration Forms იტვირთება..."
            : "Loading Registration Forms..."}
        </strong>

        <Styles />
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="statePage">
        <div className="lock">🔒</div>

        <h1>
          {ka
            ? "Admin წვდომაა საჭირო"
            : "Admin access required"}
        </h1>

        <p>
          {ka
            ? "ამ გვერდის გამოყენება მხოლოდ QR RETURN ადმინისტრატორს შეუძლია."
            : "Only a QR RETURN administrator can use this page."}
        </p>

        <a href="/login" className="loginLink">
          {ka ? "შესვლა" : "Sign in"}
        </a>

        <Styles />
      </main>
    );
  }

  return (
    <main className="page">
      <header className="header">
        <a href="/admin" className="brand">
          <div className="logo">QR</div>

          <div>
            <strong>QR RETURN</strong>
            <small>REGISTRATION FORMS</small>
          </div>
        </a>

        <div className="headerRight">
          <a href="/admin" className="backButton">
            ← {ka ? "Admin" : "Admin"}
          </a>

          <div className="languages">
            <button
              type="button"
              className={ka ? "active" : ""}
              onClick={() => setLang("ka")}
            >
              GEO
            </button>

            <button
              type="button"
              className={!ka ? "active" : ""}
              onClick={() => setLang("en")}
            >
              ENG
            </button>
          </div>
        </div>
      </header>

      <section className="layout">
        <aside className="sidebar">
          <div className="sidebarHeader">
            <span className="eyebrow">
              FORM MANAGER
            </span>

            <h2>
              {ka
                ? "ფორმები"
                : "Forms"}
            </h2>
          </div>

          <div className="formList">
            {forms.map((form) => (
              <button
                type="button"
                key={form.id}
                className={
                  form.id === selectedFormId
                    ? "formButton active"
                    : "formButton"
                }
                onClick={() =>
                  setSelectedFormId(form.id)
                }
              >
                <span className="formIcon">
                  {form.form_key === "dog"
                    ? "🐕"
                    : form.form_key === "cat"
                    ? "🐈"
                    : form.form_key === "keys"
                    ? "🔑"
                    : form.form_key === "wallet"
                    ? "👛"
                    : form.form_key === "bag"
                    ? "🎒"
                    : form.form_key === "suitcase"
                    ? "🧳"
                    : form.form_key === "emergency"
                    ? "🚑"
                    : "📝"}
                </span>

                <span className="formCopy">
                  <strong>
                    {ka
                      ? form.name_ka
                      : form.name_en}
                  </strong>

                  <small>
                    {form.enabled
                      ? ka
                        ? "აქტიური"
                        : "Active"
                      : ka
                      ? "გამორთული"
                      : "Disabled"}
                  </small>
                </span>

                <i
                  className={
                    form.enabled
                      ? "status active"
                      : "status"
                  }
                />
              </button>
            ))}
          </div>
        </aside>

        <section className="content">
          {!selectedForm ? (
            <div className="empty">
              {ka
                ? "აირჩიეთ ფორმა."
                : "Select a form."}
            </div>
          ) : (
            <>
              <div className="pageHeader">
                <div>
                  <span className="eyebrow">
                    REGISTRATION FORM
                  </span>

                  <h1>
                    {ka
                      ? selectedForm.name_ka
                      : selectedForm.name_en}
                  </h1>

                  <p>
                    {ka
                      ? selectedForm.description_ka
                      : selectedForm.description_en}
                  </p>
                </div>

                <button
                  type="button"
                  className={
                    selectedForm.enabled
                      ? "formStatus enabled"
                      : "formStatus"
                  }
                  onClick={toggleFormEnabled}
                >
                  {selectedForm.enabled
                    ? ka
                      ? "● ფორმა ჩართულია"
                      : "● Form enabled"
                    : ka
                    ? "○ ფორმა გამორთულია"
                    : "○ Form disabled"}
                </button>
              </div>

              {error && (
                <div className="errorBox">
                  ⚠ {error}
                </div>
              )}

              {success && (
                <div className="successBox">
                  ✓ {success}
                </div>
              )}

              <section className="panel">
                <div className="panelHeader">
                  <div>
                    <span className="panelIcon">⚙️</span>

                    <div>
                      <h2>
                        {ka
                          ? "ფორმის ძირითადი პარამეტრები"
                          : "Form Settings"}
                      </h2>

                      <p>
                        {ka
                          ? "სახელი, აღწერა და ღილაკების ტექსტები."
                          : "Name, description and button text."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="settingsGrid">
                  <label>
                    <span>ქართული სახელი</span>

                    <input
                      value={selectedForm.name_ka}
                      onChange={(event) =>
                        void updateFormText({
                          name_ka:
                            event.target.value,
                        })
                      }
                    />
                  </label>

                  <label>
                    <span>English name</span>

                    <input
                      value={selectedForm.name_en}
                      onChange={(event) =>
                        void updateFormText({
                          name_en:
                            event.target.value,
                        })
                      }
                    />
                  </label>

                  <label className="wide">
                    <span>ქართული აღწერა</span>

                    <textarea
                      value={
                        selectedForm.description_ka || ""
                      }
                      onChange={(event) =>
                        void updateFormText({
                          description_ka:
                            event.target.value,
                        })
                      }
                    />
                  </label>

                  <label className="wide">
                    <span>English description</span>

                    <textarea
                      value={
                        selectedForm.description_en || ""
                      }
                      onChange={(event) =>
                        void updateFormText({
                          description_en:
                            event.target.value,
                        })
                      }
                    />
                  </label>

                  <label>
                    <span>
                      Submit button GEO
                    </span>

                    <input
                      value={
                        selectedForm.submit_button_ka
                      }
                      onChange={(event) =>
                        void updateFormText({
                          submit_button_ka:
                            event.target.value,
                        })
                      }
                    />
                  </label>

                  <label>
                    <span>
                      Submit button ENG
                    </span>

                    <input
                      value={
                        selectedForm.submit_button_en
                      }
                      onChange={(event) =>
                        void updateFormText({
                          submit_button_en:
                            event.target.value,
                        })
                      }
                    />
                  </label>
                </div>

                <button
                  type="button"
                  className="primaryButton"
                  disabled={saving}
                  onClick={saveFormSettings}
                >
                  {saving
                    ? "..."
                    : ka
                    ? "ფორმის პარამეტრების შენახვა"
                    : "Save form settings"}
                </button>
              </section>

              <section className="panel">
                <div className="panelHeader">
                  <div>
                    <span className="panelIcon">📝</span>

                    <div>
                      <h2>
                        {ka
                          ? "ფორმის ველები"
                          : "Form Fields"}
                      </h2>

                      <p>
                        {ka
                          ? "აქედან მართავთ რომელ ველს ხედავს მომხმარებელი და რომელია სავალდებულო."
                          : "Control which fields users see and which are required."}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="addButton"
                    onClick={() =>
                      setShowAddField((current) => !current)
                    }
                  >
                    +{" "}
                    {ka
                      ? "ახალი ველი"
                      : "Add field"}
                  </button>
                </div>

                {showAddField && (
                  <form
                    className="newFieldForm"
                    onSubmit={addField}
                  >
                    <h3>
                      {ka
                        ? "ახალი ველის დამატება"
                        : "Add New Field"}
                    </h3>

                    <div className="newFieldGrid">
                      <label>
                        <span>Field key</span>

                        <input
                          value={newField.field_key}
                          placeholder="example: owner_phone"
                          onChange={(event) =>
                            setNewField((current) => ({
                              ...current,
                              field_key:
                                event.target.value,
                            }))
                          }
                        />
                      </label>

                      <label>
                        <span>
                          {ka
                            ? "ველის ტიპი"
                            : "Field type"}
                        </span>

                        <select
                          value={newField.field_type}
                          onChange={(event) =>
                            setNewField((current) => ({
                              ...current,
                              field_type:
                                event.target
                                  .value as RegistrationField["field_type"],
                            }))
                          }
                        >
                          {fieldTypes.map((type) => (
                            <option
                              value={type}
                              key={type}
                            >
                              {type}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label>
                        <span>
                          ქართული სახელი
                        </span>

                        <input
                          value={newField.label_ka}
                          onChange={(event) =>
                            setNewField((current) => ({
                              ...current,
                              label_ka:
                                event.target.value,
                            }))
                          }
                        />
                      </label>

                      <label>
                        <span>
                          English label
                        </span>

                        <input
                          value={newField.label_en}
                          onChange={(event) =>
                            setNewField((current) => ({
                              ...current,
                              label_en:
                                event.target.value,
                            }))
                          }
                        />
                      </label>

                      <label>
                        <span>
                          Placeholder GEO
                        </span>

                        <input
                          value={
                            newField.placeholder_ka
                          }
                          onChange={(event) =>
                            setNewField((current) => ({
                              ...current,
                              placeholder_ka:
                                event.target.value,
                            }))
                          }
                        />
                      </label>

                      <label>
                        <span>
                          Placeholder ENG
                        </span>

                        <input
                          value={
                            newField.placeholder_en
                          }
                          onChange={(event) =>
                            setNewField((current) => ({
                              ...current,
                              placeholder_en:
                                event.target.value,
                            }))
                          }
                        />
                      </label>

                      <label>
                        <span>
                          {ka
                            ? "რიგითობა"
                            : "Order"}
                        </span>

                        <input
                          type="number"
                          value={newField.sort_order}
                          onChange={(event) =>
                            setNewField((current) => ({
                              ...current,
                              sort_order:
                                Number(event.target.value),
                            }))
                          }
                        />
                      </label>
                    </div>

                    <div className="newFieldOptions">
                      <label>
                        <input
                          type="checkbox"
                          checked={newField.enabled}
                          onChange={(event) =>
                            setNewField((current) => ({
                              ...current,
                              enabled:
                                event.target.checked,
                            }))
                          }
                        />

                        {ka
                          ? "ჩართული"
                          : "Enabled"}
                      </label>

                      <label>
                        <input
                          type="checkbox"
                          checked={newField.required}
                          onChange={(event) =>
                            setNewField((current) => ({
                              ...current,
                              required:
                                event.target.checked,
                            }))
                          }
                        />

                        {ka
                          ? "სავალდებულო"
                          : "Required"}
                      </label>
                    </div>

                    <div className="newFieldActions">
                      <button
                        type="button"
                        className="secondaryButton"
                        onClick={() =>
                          setShowAddField(false)
                        }
                      >
                        {ka
                          ? "გაუქმება"
                          : "Cancel"}
                      </button>

                      <button
                        type="submit"
                        className="primaryButton"
                        disabled={saving}
                      >
                        {saving
                          ? "..."
                          : ka
                          ? "ველის დამატება"
                          : "Add field"}
                      </button>
                    </div>
                  </form>
                )}

                <div className="fieldList">
                  {fields.map((field) => (
                    <article
                      className="fieldCard"
                      key={field.id}
                    >
                      <div className="fieldTop">
                        <div className="fieldIdentity">
                          <div className="fieldType">
                            {field.field_type}
                          </div>

                          <div>
                            <strong>
                              {ka
                                ? field.label_ka
                                : field.label_en}
                            </strong>

                            <small>
                              {field.field_key}
                            </small>
                          </div>
                        </div>

                        <div className="fieldTopActions">
                          <label className="switchRow">
                            <span>
                              {ka
                                ? "გამოჩენა"
                                : "Enabled"}
                            </span>

                            <input
                              type="checkbox"
                              checked={field.enabled}
                              onChange={(event) =>
                                updateField(field.id, {
                                  enabled:
                                    event.target.checked,
                                })
                              }
                            />
                          </label>

                          <label className="switchRow">
                            <span>
                              Required
                            </span>

                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={(event) =>
                                updateField(field.id, {
                                  required:
                                    event.target.checked,
                                })
                              }
                            />
                          </label>
                        </div>
                      </div>

                      <div className="fieldGrid">
                        <label>
                          <span>
                            ქართული სახელი
                          </span>

                          <input
                            value={field.label_ka}
                            onChange={(event) =>
                              updateField(field.id, {
                                label_ka:
                                  event.target.value,
                              })
                            }
                          />
                        </label>

                        <label>
                          <span>
                            English label
                          </span>

                          <input
                            value={field.label_en}
                            onChange={(event) =>
                              updateField(field.id, {
                                label_en:
                                  event.target.value,
                              })
                            }
                          />
                        </label>

                        <label>
                          <span>
                            Placeholder GEO
                          </span>

                          <input
                            value={
                              field.placeholder_ka || ""
                            }
                            onChange={(event) =>
                              updateField(field.id, {
                                placeholder_ka:
                                  event.target.value,
                              })
                            }
                          />
                        </label>

                        <label>
                          <span>
                            Placeholder ENG
                          </span>

                          <input
                            value={
                              field.placeholder_en || ""
                            }
                            onChange={(event) =>
                              updateField(field.id, {
                                placeholder_en:
                                  event.target.value,
                              })
                            }
                          />
                        </label>

                        <label>
                          <span>
                            {ka
                              ? "ტიპი"
                              : "Type"}
                          </span>

                          <select
                            value={field.field_type}
                            onChange={(event) =>
                              updateField(field.id, {
                                field_type:
                                  event.target
                                    .value as RegistrationField["field_type"],
                              })
                            }
                          >
                            {fieldTypes.map((type) => (
                              <option
                                value={type}
                                key={type}
                              >
                                {type}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label>
                          <span>
                            {ka
                              ? "რიგითობა"
                              : "Order"}
                          </span>

                          <input
                            type="number"
                            value={field.sort_order}
                            onChange={(event) =>
                              updateField(field.id, {
                                sort_order:
                                  Number(event.target.value),
                              })
                            }
                          />
                        </label>
                      </div>

                      <div className="advancedOptions">
                        <label>
                          <input
                            type="checkbox"
                            checked={field.editable}
                            onChange={(event) =>
                              updateField(field.id, {
                                editable:
                                  event.target.checked,
                              })
                            }
                          />

                          {ka
                            ? "მომხმარებელს შეუძლია რედაქტირება"
                            : "User can edit"}
                        </label>

                        <label>
                          <input
                            type="checkbox"
                            checked={
                              field.visible_on_public_profile
                            }
                            onChange={(event) =>
                              updateField(field.id, {
                                visible_on_public_profile:
                                  event.target.checked,
                              })
                            }
                          />

                          {ka
                            ? "საჯარო პროფილზე გამოჩენა"
                            : "Show on public profile"}
                        </label>

                        <label>
                          <input
                            type="checkbox"
                            checked={
                              field.user_can_control_visibility
                            }
                            onChange={(event) =>
                              updateField(field.id, {
                                user_can_control_visibility:
                                  event.target.checked,
                              })
                            }
                          />

                          {ka
                            ? "მომხმარებელი მართავს გამოჩენას"
                            : "User controls visibility"}
                        </label>
                      </div>

                      <div className="fieldFooter">
                        {field.dirty ? (
                          <span className="unsaved">
                            •{" "}
                            {ka
                              ? "შეუნახავი ცვლილება"
                              : "Unsaved changes"}
                          </span>
                        ) : (
                          <span />
                        )}

                        <button
                          type="button"
                          className="deleteButton"
                          onClick={() =>
                            void deleteField(field)
                          }
                        >
                          🗑{" "}
                          {ka
                            ? "წაშლა"
                            : "Delete"}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="saveBar">
                  <div>
                    <strong>
                      {ka
                        ? "ფორმის ველების ცვლილებები"
                        : "Form field changes"}
                    </strong>

                    <span>
                      {ka
                        ? "Save-ის შემდეგ მონაცემები Supabase-ში შეინახება."
                        : "Changes will be stored in Supabase after saving."}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="primaryButton"
                    disabled={
                      saving ||
                      !fields.some((field) => field.dirty)
                    }
                    onClick={saveFields}
                  >
                    {saving
                      ? "..."
                      : ka
                      ? "ყველა ცვლილების შენახვა"
                      : "Save all changes"}
                  </button>
                </div>
              </section>
            </>
          )}
        </section>
      </section>

      <Styles />
    </main>
  );
}

function Styles() {
  return (
    <style jsx global>{`
      * {
        box-sizing: border-box;
      }

      html,
      body {
        margin: 0;
        padding: 0;
      }

      body {
        background: #f5f7fb;
      }

      button,
      input,
      textarea,
      select {
        font: inherit;
      }

      .page {
        min-height: 100vh;
        color: #101828;
        font-family: Inter, Arial, sans-serif;
        background:
          radial-gradient(
            circle at 100% 0%,
            rgba(118, 85, 247, 0.09),
            transparent 24%
          ),
          #f5f7fb;
      }

      .header {
        min-height: 76px;
        padding: 0 22px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #e4e7ec;
        background: white;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 10px;
        text-decoration: none;
      }

      .logo {
        width: 43px;
        height: 43px;
        display: grid;
        place-items: center;
        border-radius: 13px;
        background: linear-gradient(
          135deg,
          #1465e8,
          #7655f7
        );
        color: white;
        font-size: 11px;
        font-weight: 900;
      }

      .brand strong,
      .brand small {
        display: block;
      }

      .brand strong {
        color: #1465e8;
        font-size: 17px;
        font-weight: 900;
      }

      .brand small {
        margin-top: 2px;
        color: #7655f7;
        font-size: 8px;
        font-weight: 900;
        letter-spacing: 1.6px;
      }

      .headerRight {
        display: flex;
        align-items: center;
        gap: 9px;
      }

      .backButton {
        padding: 8px 10px;
        border: 1px solid #e4e7ec;
        border-radius: 8px;
        background: white;
        color: #475467;
        font-size: 9px;
        font-weight: 850;
        text-decoration: none;
      }

      .languages {
        padding: 4px;
        display: flex;
        border-radius: 9px;
        background: #eaecf0;
      }

      .languages button {
        padding: 7px 9px;
        border: 0;
        border-radius: 7px;
        background: transparent;
        color: #667085;
        font-size: 9px;
        font-weight: 900;
        cursor: pointer;
      }

      .languages button.active {
        background: white;
        color: #1465e8;
      }

      .layout {
        min-height: calc(100vh - 76px);
        display: grid;
        grid-template-columns: 255px minmax(0, 1fr);
      }

      .sidebar {
        border-right: 1px solid #e4e7ec;
        background: white;
      }

      .sidebarHeader {
        padding: 22px 17px 13px;
      }

      .eyebrow {
        color: #7655f7;
        font-size: 8px;
        font-weight: 900;
        letter-spacing: 1.3px;
      }

      .sidebarHeader h2 {
        margin: 5px 0 0;
        font-size: 21px;
      }

      .formList {
        padding: 5px 9px 18px;
      }

      .formButton {
        width: 100%;
        margin-bottom: 5px;
        padding: 10px;
        display: flex;
        align-items: center;
        gap: 9px;
        border: 0;
        border-radius: 11px;
        background: transparent;
        text-align: left;
        cursor: pointer;
      }

      .formButton:hover {
        background: #f7f8fc;
      }

      .formButton.active {
        background: #f2f0ff;
      }

      .formIcon {
        width: 37px;
        height: 37px;
        flex: 0 0 37px;
        display: grid;
        place-items: center;
        border-radius: 10px;
        background: #eef4ff;
        font-size: 18px;
      }

      .formCopy {
        min-width: 0;
        flex: 1;
      }

      .formCopy strong,
      .formCopy small {
        display: block;
      }

      .formCopy strong {
        color: #344054;
        font-size: 10px;
      }

      .formCopy small {
        margin-top: 3px;
        color: #98a2b3;
        font-size: 7px;
      }

      .status {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #d0d5dd;
      }

      .status.active {
        background: #12b76a;
      }

      .content {
        min-width: 0;
        padding: 28px;
      }

      .pageHeader {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 20px;
      }

      .pageHeader > div:first-child {
        max-width: 650px;
      }

      .pageHeader h1 {
        margin: 7px 0 6px;
        font-size: 34px;
        letter-spacing: -1.5px;
      }

      .pageHeader p {
        margin: 0;
        color: #667085;
        font-size: 11px;
        line-height: 1.55;
      }

      .formStatus {
        padding: 9px 12px;
        border: 1px solid #d0d5dd;
        border-radius: 9px;
        background: white;
        color: #667085;
        font-size: 9px;
        font-weight: 850;
        cursor: pointer;
      }

      .formStatus.enabled {
        border-color: #abefc6;
        background: #ecfdf3;
        color: #067647;
      }

      .panel {
        margin-top: 19px;
        padding: 20px;
        border: 1px solid #e4e7ec;
        border-radius: 16px;
        background: white;
        box-shadow: 0 8px 28px rgba(16, 24, 40, 0.035);
      }

      .panelHeader {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
      }

      .panelHeader > div:first-child {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .panelIcon {
        width: 39px;
        height: 39px;
        display: grid;
        place-items: center;
        border-radius: 10px;
        background: #eef4ff;
        font-size: 17px;
      }

      .panelHeader h2 {
        margin: 0;
        font-size: 15px;
      }

      .panelHeader p {
        margin: 3px 0 0;
        color: #98a2b3;
        font-size: 8px;
      }

      .settingsGrid,
      .fieldGrid,
      .newFieldGrid {
        margin-top: 17px;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 11px;
      }

      label > span {
        margin-bottom: 5px;
        display: block;
        color: #475467;
        font-size: 8px;
        font-weight: 800;
      }

      input,
      textarea,
      select {
        width: 100%;
        padding: 9px 10px;
        border: 1px solid #d0d5dd;
        border-radius: 8px;
        outline: none;
        background: white;
        color: #101828;
        font-size: 10px;
      }

      input:focus,
      textarea:focus,
      select:focus {
        border-color: #84adf0;
        box-shadow: 0 0 0 3px rgba(20, 101, 232, 0.08);
      }

      textarea {
        min-height: 75px;
        resize: vertical;
      }

      .wide {
        grid-column: 1 / -1;
      }

      .primaryButton,
      .secondaryButton,
      .addButton,
      .deleteButton {
        border: 0;
        cursor: pointer;
      }

      .primaryButton {
        margin-top: 14px;
        padding: 10px 14px;
        border-radius: 9px;
        background: #1465e8;
        color: white;
        font-size: 9px;
        font-weight: 900;
      }

      .primaryButton:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }

      .secondaryButton {
        padding: 9px 13px;
        border: 1px solid #d0d5dd;
        border-radius: 8px;
        background: white;
        color: #475467;
        font-size: 9px;
        font-weight: 800;
      }

      .addButton {
        padding: 9px 12px;
        border-radius: 9px;
        background: #1465e8;
        color: white;
        font-size: 9px;
        font-weight: 900;
      }

      .newFieldForm {
        margin-top: 17px;
        padding: 16px;
        border: 1px dashed #cdd8ed;
        border-radius: 12px;
        background: #f8faff;
      }

      .newFieldForm h3 {
        margin: 0;
        font-size: 13px;
      }

      .newFieldOptions {
        margin-top: 12px;
        display: flex;
        gap: 18px;
        flex-wrap: wrap;
      }

      .newFieldOptions label,
      .advancedOptions label {
        display: flex;
        align-items: center;
        gap: 6px;
        color: #475467;
        font-size: 8px;
      }

      .newFieldOptions input,
      .advancedOptions input,
      .switchRow input {
        width: auto;
      }

      .newFieldActions {
        margin-top: 14px;
        display: flex;
        justify-content: flex-end;
        gap: 8px;
      }

      .fieldList {
        margin-top: 17px;
        display: grid;
        gap: 10px;
      }

      .fieldCard {
        padding: 15px;
        border: 1px solid #e4e7ec;
        border-radius: 13px;
        background: #fbfcfe;
      }

      .fieldTop {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 14px;
      }

      .fieldIdentity {
        display: flex;
        align-items: center;
        gap: 9px;
      }

      .fieldType {
        min-width: 47px;
        padding: 6px 7px;
        border-radius: 7px;
        background: #eef4ff;
        color: #1465e8;
        font-size: 7px;
        font-weight: 900;
        text-align: center;
        text-transform: uppercase;
      }

      .fieldIdentity strong,
      .fieldIdentity small {
        display: block;
      }

      .fieldIdentity strong {
        color: #344054;
        font-size: 11px;
      }

      .fieldIdentity small {
        margin-top: 3px;
        color: #98a2b3;
        font-size: 7px;
      }

      .fieldTopActions {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .switchRow {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .switchRow span {
        margin: 0;
        font-size: 7px;
      }

      .fieldGrid {
        margin-top: 14px;
        grid-template-columns: repeat(3, 1fr);
      }

      .advancedOptions {
        margin-top: 13px;
        padding-top: 11px;
        display: flex;
        gap: 18px;
        flex-wrap: wrap;
        border-top: 1px solid #eaecf0;
      }

      .fieldFooter {
        margin-top: 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .unsaved {
        color: #b54708;
        font-size: 7px;
        font-weight: 800;
      }

      .deleteButton {
        padding: 6px 8px;
        border-radius: 7px;
        background: #fff1f0;
        color: #b42318;
        font-size: 7px;
        font-weight: 800;
      }

      .saveBar {
        margin-top: 16px;
        padding: 13px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 14px;
        border-radius: 11px;
        background: #f4f7fb;
      }

      .saveBar strong,
      .saveBar span {
        display: block;
      }

      .saveBar strong {
        color: #344054;
        font-size: 9px;
      }

      .saveBar span {
        margin-top: 3px;
        color: #98a2b3;
        font-size: 7px;
      }

      .saveBar .primaryButton {
        margin-top: 0;
        flex: 0 0 auto;
      }

      .errorBox,
      .successBox {
        margin-top: 14px;
        padding: 10px;
        border-radius: 9px;
        font-size: 9px;
      }

      .errorBox {
        border: 1px solid #fecdca;
        background: #fff1f0;
        color: #b42318;
      }

      .successBox {
        border: 1px solid #abefc6;
        background: #ecfdf3;
        color: #067647;
      }

      .empty {
        min-height: 300px;
        display: grid;
        place-items: center;
        color: #98a2b3;
        font-size: 11px;
      }

      .statePage {
        min-height: 100vh;
        padding: 30px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #f5f7fb;
        color: #344054;
        font-family: Inter, Arial, sans-serif;
        text-align: center;
      }

      .lock {
        font-size: 42px;
      }

      .statePage p {
        max-width: 420px;
        color: #667085;
        font-size: 11px;
      }

      .loginLink {
        margin-top: 10px;
        padding: 10px 14px;
        border-radius: 9px;
        background: #1465e8;
        color: white;
        font-size: 9px;
        font-weight: 900;
        text-decoration: none;
      }

      .loader {
        width: 35px;
        height: 35px;
        margin-bottom: 10px;
        border: 3px solid #e4e7ec;
        border-top-color: #1465e8;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      @media (max-width: 900px) {
        .layout {
          grid-template-columns: 1fr;
        }

        .sidebar {
          border-right: 0;
          border-bottom: 1px solid #e4e7ec;
        }

        .formList {
          display: flex;
          overflow-x: auto;
        }

        .formButton {
          min-width: 185px;
        }

        .fieldGrid {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      @media (max-width: 600px) {
        .content {
          padding: 18px 12px;
        }

        .pageHeader,
        .panelHeader,
        .fieldTop,
        .saveBar {
          align-items: flex-start;
          flex-direction: column;
        }

        .settingsGrid,
        .fieldGrid,
        .newFieldGrid {
          grid-template-columns: 1fr;
        }

        .fieldTopActions {
          width: 100%;
          justify-content: space-between;
        }

        .saveBar .primaryButton {
          width: 100%;
        }
      }
    `}</style>
  );
}
