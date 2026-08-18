"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { supabase } from "@/lib/supabase";

type Lang = "ka" | "en";

type Tab =
  | "content"
  | "fields"
  | "sections"
  | "blocks"
  | "design"
  | "preview";

type JsonMap = Record<string, any>;

type RegistrationForm = {
  id: string;
  form_key: string;

  name_ka: string;
  name_en: string;

  description_ka: string | null;
  description_en: string | null;

  page_title_ka: string | null;
  page_title_en: string | null;

  subtitle_ka: string | null;
  subtitle_en: string | null;

  intro_text_ka: string | null;
  intro_text_en: string | null;

  footer_text_ka: string | null;
  footer_text_en: string | null;

  submit_button_ka: string;
  submit_button_en: string;

  success_message_ka: string | null;
  success_message_en: string | null;

  enabled: boolean;
  published: boolean;

  sort_order: number;

  theme: JsonMap;
  layout: JsonMap;
  typography: JsonMap;
  button_style: JsonMap;

  draft_version: number;
  published_version: number;

  updated_at: string;
};

type RegistrationField = {
  id: string;
  form_id: string;
  section_id: string | null;

  field_key: string;
  field_type: string;

  label_ka: string;
  label_en: string;

  placeholder_ka: string | null;
  placeholder_en: string | null;

  help_text_ka: string | null;
  help_text_en: string | null;

  enabled: boolean;
  required: boolean;
  editable: boolean;
  admin_only: boolean;

  visible_on_public_profile: boolean;
  user_can_control_visibility: boolean;

  sort_order: number;

  width: string;
  size: string;
  input_height: number;
  border_radius: number;

  label_size: number;
  input_text_size: number;
  help_text_size: number;

  margin_top: number;
  margin_bottom: number;

  font_family: string | null;
  font_weight: number;
  label_weight: number;

  options: any;
  validation: any;
  default_value: any;

  conditional_logic: any;
  visibility_rules: any;
  style: JsonMap;
};

type FormSection = {
  id: string;
  form_id: string;

  section_key: string;

  title_ka: string | null;
  title_en: string | null;

  description_ka: string | null;
  description_en: string | null;

  enabled: boolean;
  collapsible: boolean;
  default_open: boolean;

  sort_order: number;

  layout: JsonMap;
  typography: JsonMap;
};

type FormBlock = {
  id: string;
  form_id: string;
  section_id: string | null;

  block_type: string;

  title_ka: string | null;
  title_en: string | null;

  content_ka: string | null;
  content_en: string | null;

  enabled: boolean;
  sort_order: number;
  width: string;

  style: JsonMap;
};

const FIELD_TYPES = [
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
];

const WIDTHS = [
  "full",
  "half",
  "third",
  "quarter",
];

const FONT_OPTIONS = [
  "Inter",
  "Arial",
  "Georgia",
  "Times New Roman",
  "Verdana",
  "Trebuchet MS",
  "Tahoma",
  "Courier New",
];

const FORM_ICONS: Record<string, string> = {
  dog: "🐕",
  cat: "🐈",
  keys: "🔑",
  wallet: "👛",
  bag: "🎒",
  suitcase: "🧳",
  emergency: "🚑",
};

export default function FullFormBuilderPage() {
  const [lang, setLang] =
    useState<Lang>("ka");

  const [tab, setTab] =
    useState<Tab>("content");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [isAdmin, setIsAdmin] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [forms, setForms] =
    useState<RegistrationForm[]>([]);

  const [selectedFormId, setSelectedFormId] =
    useState("");

  const [fields, setFields] =
    useState<RegistrationField[]>([]);

  const [sections, setSections] =
    useState<FormSection[]>([]);

  const [blocks, setBlocks] =
    useState<FormBlock[]>([]);

  const [previewLang, setPreviewLang] =
    useState<Lang>("ka");

  const [previewDevice, setPreviewDevice] =
    useState<"desktop" | "mobile">("desktop");

  const [showAddField, setShowAddField] =
    useState(false);

  const [showAddSection, setShowAddSection] =
    useState(false);

  const [showAddBlock, setShowAddBlock] =
    useState(false);

  const ka = lang === "ka";

  const selectedForm = useMemo(
    () =>
      forms.find(
        (item) =>
          item.id === selectedFormId
      ) || null,
    [forms, selectedFormId]
  );

  const sortedFields = useMemo(
    () =>
      [...fields].sort(
        (a, b) =>
          a.sort_order -
          b.sort_order
      ),
    [fields]
  );

  const sortedSections = useMemo(
    () =>
      [...sections].sort(
        (a, b) =>
          a.sort_order -
          b.sort_order
      ),
    [sections]
  );

  const sortedBlocks = useMemo(
    () =>
      [...blocks].sort(
        (a, b) =>
          a.sort_order -
          b.sort_order
      ),
    [blocks]
  );

  useEffect(() => {
    async function start() {
      setLoading(true);
      setError("");

      const {
        data: userData,
        error: userError,
      } =
        await supabase.auth.getUser();

      if (
        userError ||
        !userData.user
      ) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const {
        data: adminData,
        error: adminError,
      } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq(
          "user_id",
          userData.user.id
        )
        .maybeSingle();

      if (adminError) {
        setError(
          adminError.message
        );
        setLoading(false);
        return;
      }

      if (!adminData) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      setIsAdmin(true);

      await loadForms();

      setLoading(false);
    }

    void start();
  }, []);

  useEffect(() => {
    if (!selectedFormId) {
      return;
    }

    void loadBuilderData(
      selectedFormId
    );
  }, [selectedFormId]);

  async function loadForms() {
    const {
      data,
      error: loadError,
    } = await supabase
      .from("registration_forms")
      .select("*")
      .order(
        "sort_order",
        {
          ascending: true,
        }
      );

    if (loadError) {
      setError(
        loadError.message
      );
      return;
    }

    const loaded =
      (data ||
        []) as RegistrationForm[];

    setForms(loaded);

    if (
      !selectedFormId &&
      loaded.length > 0
    ) {
      setSelectedFormId(
        loaded[0].id
      );
    }
  }

  async function loadBuilderData(
    formId: string
  ) {
    setError("");
    setSuccess("");

    const [
      fieldResult,
      sectionResult,
      blockResult,
    ] = await Promise.all([
      supabase
        .from(
          "registration_form_fields"
        )
        .select("*")
        .eq(
          "form_id",
          formId
        )
        .order(
          "sort_order",
          {
            ascending: true,
          }
        ),

      supabase
        .from(
          "registration_form_sections"
        )
        .select("*")
        .eq(
          "form_id",
          formId
        )
        .order(
          "sort_order",
          {
            ascending: true,
          }
        ),

      supabase
        .from(
          "registration_form_blocks"
        )
        .select("*")
        .eq(
          "form_id",
          formId
        )
        .order(
          "sort_order",
          {
            ascending: true,
          }
        ),
    ]);

    if (fieldResult.error) {
      setError(
        fieldResult.error.message
      );
    }

    if (sectionResult.error) {
      setError(
        sectionResult.error.message
      );
    }

    if (blockResult.error) {
      setError(
        blockResult.error.message
      );
    }

    setFields(
      (fieldResult.data ||
        []) as RegistrationField[]
    );

    setSections(
      (sectionResult.data ||
        []) as FormSection[]
    );

    setBlocks(
      (blockResult.data ||
        []) as FormBlock[]
    );
  }

  function patchForm(
    patch: Partial<RegistrationForm>
  ) {
    if (!selectedForm) {
      return;
    }

    setForms((current) =>
      current.map((form) =>
        form.id ===
        selectedForm.id
          ? {
              ...form,
              ...patch,
            }
          : form
      )
    );
  }

  function patchFormJson(
    key:
      | "theme"
      | "layout"
      | "typography"
      | "button_style",
    patch: JsonMap
  ) {
    if (!selectedForm) {
      return;
    }

    patchForm({
      [key]: {
        ...(selectedForm[
          key
        ] || {}),
        ...patch,
      },
    } as Partial<RegistrationForm>);
  }

  function patchField(
    id: string,
    patch: Partial<RegistrationField>
  ) {
    setFields((current) =>
      current.map((field) =>
        field.id === id
          ? {
              ...field,
              ...patch,
            }
          : field
      )
    );
  }

  function patchFieldStyle(
    field: RegistrationField,
    patch: JsonMap
  ) {
    patchField(field.id, {
      style: {
        ...(field.style ||
          {}),
        ...patch,
      },
    });
  }

  function patchSection(
    id: string,
    patch: Partial<FormSection>
  ) {
    setSections((current) =>
      current.map((section) =>
        section.id === id
          ? {
              ...section,
              ...patch,
            }
          : section
      )
    );
  }

  function patchBlock(
    id: string,
    patch: Partial<FormBlock>
  ) {
    setBlocks((current) =>
      current.map((block) =>
        block.id === id
          ? {
              ...block,
              ...patch,
            }
          : block
      )
    );
  }

  async function saveEverything() {
    if (!selectedForm) {
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const {
        error: formError,
      } = await supabase
        .from(
          "registration_forms"
        )
        .update({
          name_ka:
            selectedForm.name_ka,
          name_en:
            selectedForm.name_en,

          description_ka:
            selectedForm.description_ka,
          description_en:
            selectedForm.description_en,

          page_title_ka:
            selectedForm.page_title_ka,
          page_title_en:
            selectedForm.page_title_en,

          subtitle_ka:
            selectedForm.subtitle_ka,
          subtitle_en:
            selectedForm.subtitle_en,

          intro_text_ka:
            selectedForm.intro_text_ka,
          intro_text_en:
            selectedForm.intro_text_en,

          footer_text_ka:
            selectedForm.footer_text_ka,
          footer_text_en:
            selectedForm.footer_text_en,

          submit_button_ka:
            selectedForm.submit_button_ka,
          submit_button_en:
            selectedForm.submit_button_en,

          success_message_ka:
            selectedForm.success_message_ka,
          success_message_en:
            selectedForm.success_message_en,

          enabled:
            selectedForm.enabled,

          theme:
            selectedForm.theme,
          layout:
            selectedForm.layout,
          typography:
            selectedForm.typography,
          button_style:
            selectedForm.button_style,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          selectedForm.id
        );

      if (formError) {
        throw new Error(
          formError.message
        );
      }

      for (const section of sections) {
        const {
          error:
            sectionError,
        } = await supabase
          .from(
            "registration_form_sections"
          )
          .update({
            title_ka:
              section.title_ka,
            title_en:
              section.title_en,

            description_ka:
              section.description_ka,
            description_en:
              section.description_en,

            enabled:
              section.enabled,

            collapsible:
              section.collapsible,

            default_open:
              section.default_open,

            sort_order:
              section.sort_order,

            layout:
              section.layout,

            typography:
              section.typography,

            updated_at:
              new Date().toISOString(),
          })
          .eq(
            "id",
            section.id
          );

        if (sectionError) {
          throw new Error(
            sectionError.message
          );
        }
      }

      for (const field of fields) {
        const {
          error:
            fieldError,
        } = await supabase
          .from(
            "registration_form_fields"
          )
          .update({
            section_id:
              field.section_id,

            field_type:
              field.field_type,

            label_ka:
              field.label_ka,
            label_en:
              field.label_en,

            placeholder_ka:
              field.placeholder_ka,
            placeholder_en:
              field.placeholder_en,

            help_text_ka:
              field.help_text_ka,
            help_text_en:
              field.help_text_en,

            enabled:
              field.enabled,

            required:
              field.required,

            editable:
              field.editable,

            admin_only:
              field.admin_only,

            visible_on_public_profile:
              field.visible_on_public_profile,

            user_can_control_visibility:
              field.user_can_control_visibility,

            sort_order:
              field.sort_order,

            width:
              field.width,

            size:
              field.size,

            input_height:
              field.input_height,

            border_radius:
              field.border_radius,

            label_size:
              field.label_size,

            input_text_size:
              field.input_text_size,

            help_text_size:
              field.help_text_size,

            margin_top:
              field.margin_top,

            margin_bottom:
              field.margin_bottom,

            font_family:
              field.font_family,

            font_weight:
              field.font_weight,

            label_weight:
              field.label_weight,

            options:
              field.options,

            validation:
              field.validation,

            conditional_logic:
              field.conditional_logic,

            visibility_rules:
              field.visibility_rules,

            style:
              field.style,

            updated_at:
              new Date().toISOString(),
          })
          .eq(
            "id",
            field.id
          );

        if (fieldError) {
          throw new Error(
            fieldError.message
          );
        }
      }

      for (const block of blocks) {
        const {
          error:
            blockError,
        } = await supabase
          .from(
            "registration_form_blocks"
          )
          .update({
            section_id:
              block.section_id,

            block_type:
              block.block_type,

            title_ka:
              block.title_ka,
            title_en:
              block.title_en,

            content_ka:
              block.content_ka,
            content_en:
              block.content_en,

            enabled:
              block.enabled,

            sort_order:
              block.sort_order,

            width:
              block.width,

            style:
              block.style,

            updated_at:
              new Date().toISOString(),
          })
          .eq(
            "id",
            block.id
          );

        if (blockError) {
          throw new Error(
            blockError.message
          );
        }
      }

      setSuccess(
        ka
          ? "ყველა ცვლილება შენახულია."
          : "All changes saved."
      );

      await loadForms();
      await loadBuilderData(
        selectedForm.id
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

  async function publishForm() {
    if (!selectedForm) {
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await saveEverything();

      const {
        data: userData,
      } =
        await supabase.auth.getUser();

      const nextVersion =
        Number(
          selectedForm.published_version ||
            1
        ) + 1;

      const snapshot = {
        form: selectedForm,
        sections,
        fields,
        blocks,
      };

      await supabase
        .from(
          "registration_form_versions"
        )
        .insert({
          form_id:
            selectedForm.id,

          version_number:
            nextVersion,

          snapshot,

          created_by:
            userData.user?.id ||
            null,
        });

      const {
        error:
          publishError,
      } = await supabase
        .from(
          "registration_forms"
        )
        .update({
          published: true,

          published_version:
            nextVersion,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          selectedForm.id
        );

      if (publishError) {
        throw new Error(
          publishError.message
        );
      }

      patchForm({
        published: true,
        published_version:
          nextVersion,
      });

      setSuccess(
        ka
          ? "ფორმა გამოქვეყნდა."
          : "Form published."
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

  async function addField(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!selectedForm) {
      return;
    }

    const form =
      event.currentTarget;

    const data =
      new FormData(form);

    const fieldKey =
      String(
        data.get(
          "field_key"
        ) || ""
      ).trim();

    const labelKa =
      String(
        data.get(
          "label_ka"
        ) || ""
      ).trim();

    const labelEn =
      String(
        data.get(
          "label_en"
        ) || ""
      ).trim();

    if (
      !fieldKey ||
      !labelKa ||
      !labelEn
    ) {
      setError(
        ka
          ? "Field key და ორივე ენის სახელი სავალდებულოა."
          : "Field key and both labels are required."
      );

      return;
    }

    const {
      error:
        insertError,
    } = await supabase
      .from(
        "registration_form_fields"
      )
      .insert({
        form_id:
          selectedForm.id,

        section_id:
          String(
            data.get(
              "section_id"
            ) || ""
          ) || null,

        field_key:
          fieldKey,

        field_type:
          String(
            data.get(
              "field_type"
            ) || "text"
          ),

        label_ka:
          labelKa,

        label_en:
          labelEn,

        enabled: true,

        required: false,

        editable: true,

        sort_order:
          fields.length + 1,

        width: "full",

        size:
          "medium",

        input_height: 44,

        border_radius: 10,

        label_size: 13,

        input_text_size: 14,

        help_text_size: 11,

        font_family:
          "Inter",

        font_weight: 400,

        label_weight: 700,
      });

    if (insertError) {
      setError(
        insertError.message
      );
      return;
    }

    form.reset();

    setShowAddField(
      false
    );

    await loadBuilderData(
      selectedForm.id
    );

    setSuccess(
      ka
        ? "ახალი ველი დაემატა."
        : "Field added."
    );
  }

  async function deleteField(
    field:
      RegistrationField
  ) {
    if (
      !confirm(
        ka
          ? `წავშალოთ „${field.label_ka}“?`
          : `Delete "${field.label_en}"?`
      )
    ) {
      return;
    }

    const {
      error:
        deleteError,
    } = await supabase
      .from(
        "registration_form_fields"
      )
      .delete()
      .eq(
        "id",
        field.id
      );

    if (deleteError) {
      setError(
        deleteError.message
      );
      return;
    }

    setFields((current) =>
      current.filter(
        (item) =>
          item.id !==
          field.id
      )
    );
  }

  async function addSection(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!selectedForm) {
      return;
    }

    const form =
      event.currentTarget;

    const data =
      new FormData(form);

    const key =
      String(
        data.get(
          "section_key"
        ) || ""
      ).trim();

    if (!key) {
      return;
    }

    const {
      error:
        insertError,
    } = await supabase
      .from(
        "registration_form_sections"
      )
      .insert({
        form_id:
          selectedForm.id,

        section_key:
          key,

        title_ka:
          String(
            data.get(
              "title_ka"
            ) || ""
          ),

        title_en:
          String(
            data.get(
              "title_en"
            ) || ""
          ),

        enabled: true,

        sort_order:
          sections.length + 1,
      });

    if (insertError) {
      setError(
        insertError.message
      );
      return;
    }

    form.reset();

    setShowAddSection(
      false
    );

    await loadBuilderData(
      selectedForm.id
    );
  }

  async function deleteSection(
    section:
      FormSection
  ) {
    if (
      !confirm(
        ka
          ? `წავშალოთ სექცია „${section.title_ka || section.section_key}“?`
          : `Delete section "${section.title_en || section.section_key}"?`
      )
    ) {
      return;
    }

    const {
      error:
        deleteError,
    } = await supabase
      .from(
        "registration_form_sections"
      )
      .delete()
      .eq(
        "id",
        section.id
      );

    if (deleteError) {
      setError(
        deleteError.message
      );
      return;
    }

    await loadBuilderData(
      selectedFormId
    );
  }

  async function addBlock(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!selectedForm) {
      return;
    }

    const form =
      event.currentTarget;

    const data =
      new FormData(form);

    const {
      error:
        insertError,
    } = await supabase
      .from(
        "registration_form_blocks"
      )
      .insert({
        form_id:
          selectedForm.id,

        section_id:
          String(
            data.get(
              "section_id"
            ) || ""
          ) || null,

        block_type:
          String(
            data.get(
              "block_type"
            ) || "text"
          ),

        title_ka:
          String(
            data.get(
              "title_ka"
            ) || ""
          ),

        title_en:
          String(
            data.get(
              "title_en"
            ) || ""
          ),

        content_ka:
          String(
            data.get(
              "content_ka"
            ) || ""
          ),

        content_en:
          String(
            data.get(
              "content_en"
            ) || ""
          ),

        enabled: true,

        sort_order:
          blocks.length + 1,

        width: "full",
      });

    if (insertError) {
      setError(
        insertError.message
      );
      return;
    }

    form.reset();

    setShowAddBlock(
      false
    );

    await loadBuilderData(
      selectedForm.id
    );
  }

  async function deleteBlock(
    block:
      FormBlock
  ) {
    const {
      error:
        deleteError,
    } = await supabase
      .from(
        "registration_form_blocks"
      )
      .delete()
      .eq(
        "id",
        block.id
      );

    if (deleteError) {
      setError(
        deleteError.message
      );
      return;
    }

    setBlocks((current) =>
      current.filter(
        (item) =>
          item.id !==
          block.id
      )
    );
  }

  if (loading) {
    return (
      <main className="statePage">
        <div className="loader" />

        <strong>
          Form Builder
          იტვირთება...
        </strong>

        <Styles />
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="statePage">
        <div className="lock">
          🔒
        </div>

        <h1>
          Admin წვდომაა
          საჭირო
        </h1>

        <a
          href="/login"
          className="loginLink"
        >
          შესვლა
        </a>

        <Styles />
      </main>
    );
  }

  return (
    <main className="page">
      <header className="topHeader">
        <a
          href="/admin"
          className="brand"
        >
          <div className="logo">
            QR
          </div>

          <div>
            <strong>
              QR RETURN
            </strong>

            <small>
              FORM BUILDER
            </small>
          </div>
        </a>

        <div className="headerActions">
          <button
            type="button"
            className="saveButton"
            onClick={
              saveEverything
            }
            disabled={saving}
          >
            {saving
              ? "..."
              : "💾 Save"}
          </button>

          <button
            type="button"
            className="publishButton"
            onClick={
              publishForm
            }
            disabled={saving}
          >
            🚀 Publish
          </button>

          <div className="languages">
            <button
              type="button"
              className={
                ka
                  ? "active"
                  : ""
              }
              onClick={() =>
                setLang("ka")
              }
            >
              GEO
            </button>

            <button
              type="button"
              className={
                !ka
                  ? "active"
                  : ""
              }
              onClick={() =>
                setLang("en")
              }
            >
              ENG
            </button>
          </div>
        </div>
      </header>

      <section className="builderLayout">
        <aside className="formSidebar">
          <div className="sidebarTitle">
            <span>
              REGISTRATION
            </span>

            <h2>
              {ka
                ? "ფორმები"
                : "Forms"}
            </h2>
          </div>

          <div className="formList">
            {forms.map(
              (form) => (
                <button
                  key={
                    form.id
                  }
                  type="button"
                  className={
                    form.id ===
                    selectedFormId
                      ? "formItem active"
                      : "formItem"
                  }
                  onClick={() => {
                    setSelectedFormId(
                      form.id
                    );

                    setTab(
                      "content"
                    );
                  }}
                >
                  <span className="formEmoji">
                    {FORM_ICONS[
                      form.form_key
                    ] || "📝"}
                  </span>

                  <span className="formInfo">
                    <strong>
                      {ka
                        ? form.name_ka
                        : form.name_en}
                    </strong>

                    <small>
                      {form.published
                        ? "Published"
                        : "Draft"}
                    </small>
                  </span>
                </button>
              )
            )}
          </div>
        </aside>

        <section className="builderMain">
          {!selectedForm ? (
            <div className="empty">
              აირჩიეთ ფორმა
            </div>
          ) : (
            <>
              <div className="builderIntro">
                <div>
                  <span className="eyebrow">
                    {
                      selectedForm.form_key
                    }
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

                <div className="formState">
                  <span
                    className={
                      selectedForm.enabled
                        ? "green"
                        : "gray"
                    }
                  />

                  {selectedForm.enabled
                    ? "Enabled"
                    : "Disabled"}
                </div>
              </div>

              <div className="tabs">
                <TabButton
                  active={
                    tab ===
                    "content"
                  }
                  onClick={() =>
                    setTab(
                      "content"
                    )
                  }
                  icon="✏️"
                  text="Content"
                />

                <TabButton
                  active={
                    tab ===
                    "fields"
                  }
                  onClick={() =>
                    setTab(
                      "fields"
                    )
                  }
                  icon="📝"
                  text="Fields"
                />

                <TabButton
                  active={
                    tab ===
                    "sections"
                  }
                  onClick={() =>
                    setTab(
                      "sections"
                    )
                  }
                  icon="📚"
                  text="Sections"
                />

                <TabButton
                  active={
                    tab ===
                    "blocks"
                  }
                  onClick={() =>
                    setTab(
                      "blocks"
                    )
                  }
                  icon="💬"
                  text="Text Blocks"
                />

                <TabButton
                  active={
                    tab ===
                    "design"
                  }
                  onClick={() =>
                    setTab(
                      "design"
                    )
                  }
                  icon="🎨"
                  text="Design"
                />

                <TabButton
                  active={
                    tab ===
                    "preview"
                  }
                  onClick={() =>
                    setTab(
                      "preview"
                    )
                  }
                  icon="👁️"
                  text="Preview"
                />
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

              {tab ===
                "content" && (
                <ContentEditor
                  form={
                    selectedForm
                  }
                  patchForm={
                    patchForm
                  }
                />
              )}

              {tab ===
                "fields" && (
                <FieldsEditor
                  fields={
                    sortedFields
                  }
                  sections={
                    sortedSections
                  }
                  patchField={
                    patchField
                  }
                  patchFieldStyle={
                    patchFieldStyle
                  }
                  deleteField={
                    deleteField
                  }
                  showAdd={
                    showAddField
                  }
                  setShowAdd={
                    setShowAddField
                  }
                  addField={
                    addField
                  }
                />
              )}

              {tab ===
                "sections" && (
                <SectionsEditor
                  sections={
                    sortedSections
                  }
                  patchSection={
                    patchSection
                  }
                  deleteSection={
                    deleteSection
                  }
                  showAdd={
                    showAddSection
                  }
                  setShowAdd={
                    setShowAddSection
                  }
                  addSection={
                    addSection
                  }
                />
              )}

              {tab ===
                "blocks" && (
                <BlocksEditor
                  blocks={
                    sortedBlocks
                  }
                  sections={
                    sortedSections
                  }
                  patchBlock={
                    patchBlock
                  }
                  deleteBlock={
                    deleteBlock
                  }
                  showAdd={
                    showAddBlock
                  }
                  setShowAdd={
                    setShowAddBlock
                  }
                  addBlock={
                    addBlock
                  }
                />
              )}

              {tab ===
                "design" && (
                <DesignEditor
                  form={
                    selectedForm
                  }
                  patchFormJson={
                    patchFormJson
                  }
                />
              )}

              {tab ===
                "preview" && (
                <Preview
                  form={
                    selectedForm
                  }
                  sections={
                    sortedSections
                  }
                  fields={
                    sortedFields
                  }
                  blocks={
                    sortedBlocks
                  }
                  previewLang={
                    previewLang
                  }
                  setPreviewLang={
                    setPreviewLang
                  }
                  previewDevice={
                    previewDevice
                  }
                  setPreviewDevice={
                    setPreviewDevice
                  }
                />
              )}
            </>
          )}
        </section>
      </section>

      <Styles />
    </main>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  text,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  text: string;
}) {
  return (
    <button
      type="button"
      className={
        active
          ? "tab active"
          : "tab"
      }
      onClick={onClick}
    >
      <span>{icon}</span>
      {text}
    </button>
  );
}

function ContentEditor({
  form,
  patchForm,
}: {
  form: RegistrationForm;
  patchForm: (
    patch: Partial<RegistrationForm>
  ) => void;
}) {
  return (
    <div className="editorPanel">
      <PanelTitle
        icon="✏️"
        title="Form Content"
        text="Edit every visible sentence and message."
      />

      <div className="twoColumn">
        <TextInput
          label="Form name GEO"
          value={
            form.name_ka
          }
          onChange={(value) =>
            patchForm({
              name_ka:
                value,
            })
          }
        />

        <TextInput
          label="Form name ENG"
          value={
            form.name_en
          }
          onChange={(value) =>
            patchForm({
              name_en:
                value,
            })
          }
        />

        <TextInput
          label="Page title GEO"
          value={
            form.page_title_ka ||
            ""
          }
          onChange={(value) =>
            patchForm({
              page_title_ka:
                value,
            })
          }
        />

        <TextInput
          label="Page title ENG"
          value={
            form.page_title_en ||
            ""
          }
          onChange={(value) =>
            patchForm({
              page_title_en:
                value,
            })
          }
        />

        <TextInput
          label="Subtitle GEO"
          value={
            form.subtitle_ka ||
            ""
          }
          onChange={(value) =>
            patchForm({
              subtitle_ka:
                value,
            })
          }
        />

        <TextInput
          label="Subtitle ENG"
          value={
            form.subtitle_en ||
            ""
          }
          onChange={(value) =>
            patchForm({
              subtitle_en:
                value,
            })
          }
        />

        <TextArea
          label="Intro text GEO"
          value={
            form.intro_text_ka ||
            ""
          }
          onChange={(value) =>
            patchForm({
              intro_text_ka:
                value,
            })
          }
        />

        <TextArea
          label="Intro text ENG"
          value={
            form.intro_text_en ||
            ""
          }
          onChange={(value) =>
            patchForm({
              intro_text_en:
                value,
            })
          }
        />

        <TextInput
          label="Submit button GEO"
          value={
            form.submit_button_ka
          }
          onChange={(value) =>
            patchForm({
              submit_button_ka:
                value,
            })
          }
        />

        <TextInput
          label="Submit button ENG"
          value={
            form.submit_button_en
          }
          onChange={(value) =>
            patchForm({
              submit_button_en:
                value,
            })
          }
        />

        <TextArea
          label="Success message GEO"
          value={
            form.success_message_ka ||
            ""
          }
          onChange={(value) =>
            patchForm({
              success_message_ka:
                value,
            })
          }
        />

        <TextArea
          label="Success message ENG"
          value={
            form.success_message_en ||
            ""
          }
          onChange={(value) =>
            patchForm({
              success_message_en:
                value,
            })
          }
        />

        <TextArea
          label="Footer text GEO"
          value={
            form.footer_text_ka ||
            ""
          }
          onChange={(value) =>
            patchForm({
              footer_text_ka:
                value,
            })
          }
        />

        <TextArea
          label="Footer text ENG"
          value={
            form.footer_text_en ||
            ""
          }
          onChange={(value) =>
            patchForm({
              footer_text_en:
                value,
            })
          }
        />
      </div>
    </div>
  );
}

function FieldsEditor({
  fields,
  sections,
  patchField,
  patchFieldStyle,
  deleteField,
  showAdd,
  setShowAdd,
  addField,
}: {
  fields: RegistrationField[];
  sections: FormSection[];

  patchField: (
    id: string,
    patch: Partial<RegistrationField>
  ) => void;

  patchFieldStyle: (
    field: RegistrationField,
    patch: JsonMap
  ) => void;

  deleteField: (
    field: RegistrationField
  ) => void;

  showAdd: boolean;
  setShowAdd: (
    value: boolean
  ) => void;

  addField: (
    event:
      FormEvent<HTMLFormElement>
  ) => void;
}) {
  return (
    <div className="editorPanel">
      <div className="panelTitleRow">
        <PanelTitle
          icon="📝"
          title="Fields"
          text="Add, remove and completely redesign fields."
        />

        <button
          type="button"
          className="addButton"
          onClick={() =>
            setShowAdd(
              !showAdd
            )
          }
        >
          + Add Field
        </button>
      </div>

      {showAdd && (
        <form
          className="addForm"
          onSubmit={
            addField
          }
        >
          <div className="threeColumn">
            <TextInputName
              label="Field key"
              name="field_key"
            />

            <label className="formControl">
              <span>
                Field type
              </span>

              <select
                name="field_type"
                defaultValue="text"
              >
                {FIELD_TYPES.map(
                  (type) => (
                    <option
                      key={
                        type
                      }
                      value={
                        type
                      }
                    >
                      {type}
                    </option>
                  )
                )}
              </select>
            </label>

            <label className="formControl">
              <span>
                Section
              </span>

              <select
                name="section_id"
                defaultValue=""
              >
                <option value="">
                  No section
                </option>

                {sections.map(
                  (section) => (
                    <option
                      key={
                        section.id
                      }
                      value={
                        section.id
                      }
                    >
                      {section.title_en ||
                        section.section_key}
                    </option>
                  )
                )}
              </select>
            </label>

            <TextInputName
              label="Label GEO"
              name="label_ka"
            />

            <TextInputName
              label="Label ENG"
              name="label_en"
            />
          </div>

          <button
            type="submit"
            className="primaryButton"
          >
            Add field
          </button>
        </form>
      )}

      <div className="itemStack">
        {fields.map(
          (field) => (
            <article
              key={
                field.id
              }
              className="builderCard"
            >
              <div className="cardHeader">
                <div>
                  <span className="typeBadge">
                    {
                      field.field_type
                    }
                  </span>

                  <strong>
                    {
                      field.label_ka
                    }
                  </strong>

                  <small>
                    {
                      field.field_key
                    }
                  </small>
                </div>

                <div className="switches">
                  <Toggle
                    label="Visible"
                    checked={
                      field.enabled
                    }
                    onChange={(
                      checked
                    ) =>
                      patchField(
                        field.id,
                        {
                          enabled:
                            checked,
                        }
                      )
                    }
                  />

                  <Toggle
                    label="Required"
                    checked={
                      field.required
                    }
                    onChange={(
                      checked
                    ) =>
                      patchField(
                        field.id,
                        {
                          required:
                            checked,
                        }
                      )
                    }
                  />
                </div>
              </div>

              <div className="threeColumn">
                <TextInput
                  label="Label GEO"
                  value={
                    field.label_ka
                  }
                  onChange={(value) =>
                    patchField(
                      field.id,
                      {
                        label_ka:
                          value,
                      }
                    )
                  }
                />

                <TextInput
                  label="Label ENG"
                  value={
                    field.label_en
                  }
                  onChange={(value) =>
                    patchField(
                      field.id,
                      {
                        label_en:
                          value,
                      }
                    )
                  }
                />

                <label className="formControl">
                  <span>
                    Type
                  </span>

                  <select
                    value={
                      field.field_type
                    }
                    onChange={(e) =>
                      patchField(
                        field.id,
                        {
                          field_type:
                            e.target
                              .value,
                        }
                      )
                    }
                  >
                    {FIELD_TYPES.map(
                      (type) => (
                        <option
                          key={
                            type
                          }
                          value={
                            type
                          }
                        >
                          {type}
                        </option>
                      )
                    )}
                  </select>
                </label>

                <TextInput
                  label="Placeholder GEO"
                  value={
                    field.placeholder_ka ||
                    ""
                  }
                  onChange={(value) =>
                    patchField(
                      field.id,
                      {
                        placeholder_ka:
                          value,
                      }
                    )
                  }
                />

                <TextInput
                  label="Placeholder ENG"
                  value={
                    field.placeholder_en ||
                    ""
                  }
                  onChange={(value) =>
                    patchField(
                      field.id,
                      {
                        placeholder_en:
                          value,
                      }
                    )
                  }
                />

                <label className="formControl">
                  <span>
                    Section
                  </span>

                  <select
                    value={
                      field.section_id ||
                      ""
                    }
                    onChange={(e) =>
                      patchField(
                        field.id,
                        {
                          section_id:
                            e.target
                              .value ||
                            null,
                        }
                      )
                    }
                  >
                    <option value="">
                      No section
                    </option>

                    {sections.map(
                      (
                        section
                      ) => (
                        <option
                          key={
                            section.id
                          }
                          value={
                            section.id
                          }
                        >
                          {section.title_en ||
                            section.section_key}
                        </option>
                      )
                    )}
                  </select>
                </label>

                <TextArea
                  label="Help text GEO"
                  value={
                    field.help_text_ka ||
                    ""
                  }
                  onChange={(value) =>
                    patchField(
                      field.id,
                      {
                        help_text_ka:
                          value,
                      }
                    )
                  }
                />

                <TextArea
                  label="Help text ENG"
                  value={
                    field.help_text_en ||
                    ""
                  }
                  onChange={(value) =>
                    patchField(
                      field.id,
                      {
                        help_text_en:
                          value,
                      }
                    )
                  }
                />

                <label className="formControl">
                  <span>
                    Width
                  </span>

                  <select
                    value={
                      field.width
                    }
                    onChange={(e) =>
                      patchField(
                        field.id,
                        {
                          width:
                            e.target
                              .value,
                        }
                      )
                    }
                  >
                    {WIDTHS.map(
                      (width) => (
                        <option
                          key={
                            width
                          }
                          value={
                            width
                          }
                        >
                          {width}
                        </option>
                      )
                    )}
                  </select>
                </label>

                <NumberInput
                  label="Order"
                  value={
                    field.sort_order
                  }
                  onChange={(value) =>
                    patchField(
                      field.id,
                      {
                        sort_order:
                          value,
                      }
                    )
                  }
                />

                <NumberInput
                  label="Input height"
                  value={
                    field.input_height
                  }
                  onChange={(value) =>
                    patchField(
                      field.id,
                      {
                        input_height:
                          value,
                      }
                    )
                  }
                />

                <NumberInput
                  label="Border radius"
                  value={
                    field.border_radius
                  }
                  onChange={(value) =>
                    patchField(
                      field.id,
                      {
                        border_radius:
                          value,
                      }
                    )
                  }
                />

                <label className="formControl">
                  <span>
                    Font
                  </span>

                  <select
                    value={
                      field.font_family ||
                      "Inter"
                    }
                    onChange={(e) =>
                      patchField(
                        field.id,
                        {
                          font_family:
                            e.target
                              .value,
                        }
                      )
                    }
                  >
                    {FONT_OPTIONS.map(
                      (font) => (
                        <option
                          key={
                            font
                          }
                          value={
                            font
                          }
                        >
                          {font}
                        </option>
                      )
                    )}
                  </select>
                </label>

                <NumberInput
                  label="Label size"
                  value={
                    field.label_size
                  }
                  onChange={(value) =>
                    patchField(
                      field.id,
                      {
                        label_size:
                          value,
                      }
                    )
                  }
                />

                <NumberInput
                  label="Input text size"
                  value={
                    field.input_text_size
                  }
                  onChange={(value) =>
                    patchField(
                      field.id,
                      {
                        input_text_size:
                          value,
                      }
                    )
                  }
                />

                <ColorInput
                  label="Background"
                  value={
                    field.style
                      ?.background ||
                    "#ffffff"
                  }
                  onChange={(value) =>
                    patchFieldStyle(
                      field,
                      {
                        background:
                          value,
                      }
                    )
                  }
                />

                <ColorInput
                  label="Border"
                  value={
                    field.style
                      ?.border_color ||
                    "#d0d5dd"
                  }
                  onChange={(value) =>
                    patchFieldStyle(
                      field,
                      {
                        border_color:
                          value,
                      }
                    )
                  }
                />

                <ColorInput
                  label="Text"
                  value={
                    field.style
                      ?.text_color ||
                    "#101828"
                  }
                  onChange={(value) =>
                    patchFieldStyle(
                      field,
                      {
                        text_color:
                          value,
                      }
                    )
                  }
                />
              </div>

              <div className="advancedRow">
                <Toggle
                  label="User can edit"
                  checked={
                    field.editable
                  }
                  onChange={(
                    checked
                  ) =>
                    patchField(
                      field.id,
                      {
                        editable:
                          checked,
                      }
                    )
                  }
                />

                <Toggle
                  label="Public profile"
                  checked={
                    field.visible_on_public_profile
                  }
                  onChange={(
                    checked
                  ) =>
                    patchField(
                      field.id,
                      {
                        visible_on_public_profile:
                          checked,
                      }
                    )
                  }
                />

                <Toggle
                  label="User visibility control"
                  checked={
                    field.user_can_control_visibility
                  }
                  onChange={(
                    checked
                  ) =>
                    patchField(
                      field.id,
                      {
                        user_can_control_visibility:
                          checked,
                      }
                    )
                  }
                />
              </div>

              <div className="cardFooter">
                <button
                  type="button"
                  className="dangerButton"
                  onClick={() =>
                    void deleteField(
                      field
                    )
                  }
                >
                  🗑 Delete
                </button>
              </div>
            </article>
          )
        )}
      </div>
    </div>
  );
}

function SectionsEditor({
  sections,
  patchSection,
  deleteSection,
  showAdd,
  setShowAdd,
  addSection,
}: {
  sections: FormSection[];
  patchSection: (
    id: string,
    patch: Partial<FormSection>
  ) => void;
  deleteSection: (
    section: FormSection
  ) => void;
  showAdd: boolean;
  setShowAdd: (
    value: boolean
  ) => void;
  addSection: (
    event:
      FormEvent<HTMLFormElement>
  ) => void;
}) {
  return (
    <div className="editorPanel">
      <div className="panelTitleRow">
        <PanelTitle
          icon="📚"
          title="Sections"
          text="Organize your registration form."
        />

        <button
          type="button"
          className="addButton"
          onClick={() =>
            setShowAdd(
              !showAdd
            )
          }
        >
          + Add Section
        </button>
      </div>

      {showAdd && (
        <form
          className="addForm"
          onSubmit={
            addSection
          }
        >
          <div className="threeColumn">
            <TextInputName
              label="Section key"
              name="section_key"
            />

            <TextInputName
              label="Title GEO"
              name="title_ka"
            />

            <TextInputName
              label="Title ENG"
              name="title_en"
            />
          </div>

          <button className="primaryButton">
            Add section
          </button>
        </form>
      )}

      <div className="itemStack">
        {sections.map(
          (section) => (
            <article
              key={
                section.id
              }
              className="builderCard"
            >
              <div className="cardHeader">
                <div>
                  <strong>
                    {section.title_en ||
                      section.section_key}
                  </strong>

                  <small>
                    {
                      section.section_key
                    }
                  </small>
                </div>

                <Toggle
                  label="Enabled"
                  checked={
                    section.enabled
                  }
                  onChange={(
                    checked
                  ) =>
                    patchSection(
                      section.id,
                      {
                        enabled:
                          checked,
                      }
                    )
                  }
                />
              </div>

              <div className="threeColumn">
                <TextInput
                  label="Title GEO"
                  value={
                    section.title_ka ||
                    ""
                  }
                  onChange={(value) =>
                    patchSection(
                      section.id,
                      {
                        title_ka:
                          value,
                      }
                    )
                  }
                />

                <TextInput
                  label="Title ENG"
                  value={
                    section.title_en ||
                    ""
                  }
                  onChange={(value) =>
                    patchSection(
                      section.id,
                      {
                        title_en:
                          value,
                      }
                    )
                  }
                />

                <NumberInput
                  label="Order"
                  value={
                    section.sort_order
                  }
                  onChange={(value) =>
                    patchSection(
                      section.id,
                      {
                        sort_order:
                          value,
                      }
                    )
                  }
                />

                <TextArea
                  label="Description GEO"
                  value={
                    section.description_ka ||
                    ""
                  }
                  onChange={(value) =>
                    patchSection(
                      section.id,
                      {
                        description_ka:
                          value,
                      }
                    )
                  }
                />

                <TextArea
                  label="Description ENG"
                  value={
                    section.description_en ||
                    ""
                  }
                  onChange={(value) =>
                    patchSection(
                      section.id,
                      {
                        description_en:
                          value,
                      }
                    )
                  }
                />
              </div>

              <div className="advancedRow">
                <Toggle
                  label="Collapsible"
                  checked={
                    section.collapsible
                  }
                  onChange={(
                    checked
                  ) =>
                    patchSection(
                      section.id,
                      {
                        collapsible:
                          checked,
                      }
                    )
                  }
                />

                <Toggle
                  label="Open by default"
                  checked={
                    section.default_open
                  }
                  onChange={(
                    checked
                  ) =>
                    patchSection(
                      section.id,
                      {
                        default_open:
                          checked,
                      }
                    )
                  }
                />
              </div>

              <div className="cardFooter">
                <button
                  type="button"
                  className="dangerButton"
                  onClick={() =>
                    void deleteSection(
                      section
                    )
                  }
                >
                  🗑 Delete
                </button>
              </div>
            </article>
          )
        )}
      </div>
    </div>
  );
}

function BlocksEditor({
  blocks,
  sections,
  patchBlock,
  deleteBlock,
  showAdd,
  setShowAdd,
  addBlock,
}: {
  blocks: FormBlock[];
  sections: FormSection[];
  patchBlock: (
    id: string,
    patch: Partial<FormBlock>
  ) => void;
  deleteBlock: (
    block: FormBlock
  ) => void;
  showAdd: boolean;
  setShowAdd: (
    value: boolean
  ) => void;
  addBlock: (
    event:
      FormEvent<HTMLFormElement>
  ) => void;
}) {
  return (
    <div className="editorPanel">
      <div className="panelTitleRow">
        <PanelTitle
          icon="💬"
          title="Custom Text Blocks"
          text="Add instructions, warnings, notices and headings."
        />

        <button
          className="addButton"
          type="button"
          onClick={() =>
            setShowAdd(
              !showAdd
            )
          }
        >
          + Add Block
        </button>
      </div>

      {showAdd && (
        <form
          className="addForm"
          onSubmit={
            addBlock
          }
        >
          <div className="threeColumn">
            <label className="formControl">
              <span>
                Type
              </span>

              <select
                name="block_type"
                defaultValue="text"
              >
                <option value="text">
                  Text
                </option>
                <option value="heading">
                  Heading
                </option>
                <option value="notice">
                  Notice
                </option>
                <option value="warning">
                  Warning
                </option>
                <option value="info">
                  Info
                </option>
                <option value="divider">
                  Divider
                </option>
                <option value="spacer">
                  Spacer
                </option>
              </select>
            </label>

            <label className="formControl">
              <span>
                Section
              </span>

              <select name="section_id">
                <option value="">
                  No section
                </option>

                {sections.map(
                  (
                    section
                  ) => (
                    <option
                      key={
                        section.id
                      }
                      value={
                        section.id
                      }
                    >
                      {section.title_en ||
                        section.section_key}
                    </option>
                  )
                )}
              </select>
            </label>

            <TextInputName
              label="Title GEO"
              name="title_ka"
            />

            <TextInputName
              label="Title ENG"
              name="title_en"
            />

            <TextInputName
              label="Content GEO"
              name="content_ka"
            />

            <TextInputName
              label="Content ENG"
              name="content_en"
            />
          </div>

          <button className="primaryButton">
            Add block
          </button>
        </form>
      )}

      <div className="itemStack">
        {blocks.map(
          (block) => (
            <article
              key={
                block.id
              }
              className="builderCard"
            >
              <div className="cardHeader">
                <div>
                  <span className="typeBadge">
                    {
                      block.block_type
                    }
                  </span>

                  <strong>
                    {block.title_en ||
                      block.content_en ||
                      "Text Block"}
                  </strong>
                </div>

                <Toggle
                  label="Visible"
                  checked={
                    block.enabled
                  }
                  onChange={(
                    checked
                  ) =>
                    patchBlock(
                      block.id,
                      {
                        enabled:
                          checked,
                      }
                    )
                  }
                />
              </div>

              <div className="twoColumn">
                <TextInput
                  label="Title GEO"
                  value={
                    block.title_ka ||
                    ""
                  }
                  onChange={(value) =>
                    patchBlock(
                      block.id,
                      {
                        title_ka:
                          value,
                      }
                    )
                  }
                />

                <TextInput
                  label="Title ENG"
                  value={
                    block.title_en ||
                    ""
                  }
                  onChange={(value) =>
                    patchBlock(
                      block.id,
                      {
                        title_en:
                          value,
                      }
                    )
                  }
                />

                <TextArea
                  label="Content GEO"
                  value={
                    block.content_ka ||
                    ""
                  }
                  onChange={(value) =>
                    patchBlock(
                      block.id,
                      {
                        content_ka:
                          value,
                      }
                    )
                  }
                />

                <TextArea
                  label="Content ENG"
                  value={
                    block.content_en ||
                    ""
                  }
                  onChange={(value) =>
                    patchBlock(
                      block.id,
                      {
                        content_en:
                          value,
                      }
                    )
                  }
                />
              </div>

              <div className="cardFooter">
                <button
                  type="button"
                  className="dangerButton"
                  onClick={() =>
                    void deleteBlock(
                      block
                    )
                  }
                >
                  🗑 Delete
                </button>
              </div>
            </article>
          )
        )}
      </div>
    </div>
  );
}

function DesignEditor({
  form,
  patchFormJson,
}: {
  form: RegistrationForm;
  patchFormJson: (
    key:
      | "theme"
      | "layout"
      | "typography"
      | "button_style",
    patch: JsonMap
  ) => void;
}) {
  const typography =
    form.typography ||
    {};

  const theme =
    form.theme ||
    {};

  const layout =
    form.layout ||
    {};

  const button =
    form.button_style ||
    {};

  return (
    <div className="editorPanel">
      <PanelTitle
        icon="🎨"
        title="Design & Typography"
        text="Change font, size, shape, spacing and colors."
      />

      <h3 className="subHeading">
        Typography
      </h3>

      <div className="threeColumn">
        <label className="formControl">
          <span>
            Main font
          </span>

          <select
            value={
              typography.font_family ||
              "Inter"
            }
            onChange={(e) =>
              patchFormJson(
                "typography",
                {
                  font_family:
                    e.target
                      .value,
                  body_font_family:
                    e.target
                      .value,
                  field_font_family:
                    e.target
                      .value,
                }
              )
            }
          >
            {FONT_OPTIONS.map(
              (font) => (
                <option
                  key={
                    font
                  }
                  value={
                    font
                  }
                >
                  {font}
                </option>
              )
            )}
          </select>
        </label>

        <label className="formControl">
          <span>
            Title font
          </span>

          <select
            value={
              typography.title_font_family ||
              "Inter"
            }
            onChange={(e) =>
              patchFormJson(
                "typography",
                {
                  title_font_family:
                    e.target
                      .value,
                }
              )
            }
          >
            {FONT_OPTIONS.map(
              (font) => (
                <option
                  key={
                    font
                  }
                  value={
                    font
                  }
                >
                  {font}
                </option>
              )
            )}
          </select>
        </label>

        <NumberInput
          label="Title size"
          value={
            typography.title_size ||
            38
          }
          onChange={(value) =>
            patchFormJson(
              "typography",
              {
                title_size:
                  value,
              }
            )
          }
        />

        <NumberInput
          label="Body size"
          value={
            typography.body_size ||
            14
          }
          onChange={(value) =>
            patchFormJson(
              "typography",
              {
                body_size:
                  value,
              }
            )
          }
        />

        <NumberInput
          label="Label size"
          value={
            typography.label_size ||
            13
          }
          onChange={(value) =>
            patchFormJson(
              "typography",
              {
                label_size:
                  value,
              }
            )
          }
        />

        <NumberInput
          label="Input text size"
          value={
            typography.input_text_size ||
            14
          }
          onChange={(value) =>
            patchFormJson(
              "typography",
              {
                input_text_size:
                  value,
              }
            )
          }
        />
      </div>

      <h3 className="subHeading">
        Form layout
      </h3>

      <div className="threeColumn">
        <NumberInput
          label="Max width"
          value={
            layout.max_width ||
            900
          }
          onChange={(value) =>
            patchFormJson(
              "layout",
              {
                max_width:
                  value,
              }
            )
          }
        />

        <NumberInput
          label="Card radius"
          value={
            layout.card_radius ||
            22
          }
          onChange={(value) =>
            patchFormJson(
              "layout",
              {
                card_radius:
                  value,
              }
            )
          }
        />

        <NumberInput
          label="Card padding"
          value={
            layout.card_padding ||
            28
          }
          onChange={(value) =>
            patchFormJson(
              "layout",
              {
                card_padding:
                  value,
              }
            )
          }
        />

        <NumberInput
          label="Field gap"
          value={
            layout.field_gap ||
            14
          }
          onChange={(value) =>
            patchFormJson(
              "layout",
              {
                field_gap:
                  value,
              }
            )
          }
        />
      </div>

      <h3 className="subHeading">
        Colors
      </h3>

      <div className="threeColumn">
        <ColorInput
          label="Page background"
          value={
            theme.page_background ||
            "#f7f9fc"
          }
          onChange={(value) =>
            patchFormJson(
              "theme",
              {
                page_background:
                  value,
              }
            )
          }
        />

        <ColorInput
          label="Card background"
          value={
            theme.card_background ||
            "#ffffff"
          }
          onChange={(value) =>
            patchFormJson(
              "theme",
              {
                card_background:
                  value,
              }
            )
          }
        />

        <ColorInput
          label="Text"
          value={
            theme.text_color ||
            "#101828"
          }
          onChange={(value) =>
            patchFormJson(
              "theme",
              {
                text_color:
                  value,
              }
            )
          }
        />

        <ColorInput
          label="Primary"
          value={
            theme.primary_color ||
            "#1465e8"
          }
          onChange={(value) =>
            patchFormJson(
              "theme",
              {
                primary_color:
                  value,
              }
            )
          }
        />

        <ColorInput
          label="Border"
          value={
            theme.border_color ||
            "#e4e7ec"
          }
          onChange={(value) =>
            patchFormJson(
              "theme",
              {
                border_color:
                  value,
              }
            )
          }
        />
      </div>

      <h3 className="subHeading">
        Submit Button
      </h3>

      <div className="threeColumn">
        <NumberInput
          label="Height"
          value={
            button.height ||
            48
          }
          onChange={(value) =>
            patchFormJson(
              "button_style",
              {
                height:
                  value,
              }
            )
          }
        />

        <NumberInput
          label="Radius"
          value={
            button.radius ||
            12
          }
          onChange={(value) =>
            patchFormJson(
              "button_style",
              {
                radius:
                  value,
              }
            )
          }
        />

        <ColorInput
          label="Background"
          value={
            button.background ||
            "#1465e8"
          }
          onChange={(value) =>
            patchFormJson(
              "button_style",
              {
                background:
                  value,
              }
            )
          }
        />

        <ColorInput
          label="Text"
          value={
            button.text_color ||
            "#ffffff"
          }
          onChange={(value) =>
            patchFormJson(
              "button_style",
              {
                text_color:
                  value,
              }
            )
          }
        />
      </div>
    </div>
  );
}

function Preview({
  form,
  sections,
  fields,
  blocks,
  previewLang,
  setPreviewLang,
  previewDevice,
  setPreviewDevice,
}: {
  form: RegistrationForm;
  sections: FormSection[];
  fields: RegistrationField[];
  blocks: FormBlock[];
  previewLang: Lang;
  setPreviewLang: (
    value: Lang
  ) => void;
  previewDevice:
    | "desktop"
    | "mobile";
  setPreviewDevice: (
    value:
      | "desktop"
      | "mobile"
  ) => void;
}) {
  const isKa =
    previewLang === "ka";

  return (
    <div className="editorPanel">
      <div className="previewToolbar">
        <div>
          <button
            type="button"
            className={
              previewLang ===
              "ka"
                ? "toolActive"
                : ""
            }
            onClick={() =>
              setPreviewLang(
                "ka"
              )
            }
          >
            GEO
          </button>

          <button
            type="button"
            className={
              previewLang ===
              "en"
                ? "toolActive"
                : ""
            }
            onClick={() =>
              setPreviewLang(
                "en"
              )
            }
          >
            ENG
          </button>
        </div>

        <div>
          <button
            type="button"
            className={
              previewDevice ===
              "desktop"
                ? "toolActive"
                : ""
            }
            onClick={() =>
              setPreviewDevice(
                "desktop"
              )
            }
          >
            🖥 Desktop
          </button>

          <button
            type="button"
            className={
              previewDevice ===
              "mobile"
                ? "toolActive"
                : ""
            }
            onClick={() =>
              setPreviewDevice(
                "mobile"
              )
            }
          >
            📱 Mobile
          </button>
        </div>
      </div>

      <div className="previewStage">
        <div
          className={
            previewDevice ===
            "mobile"
              ? "previewPhone"
              : "previewDesktop"
          }
          style={{
            background:
              form.theme
                ?.page_background ||
              "#f7f9fc",

            fontFamily:
              form.typography
                ?.font_family ||
              "Inter",
          }}
        >
          <div
            className="previewForm"
            style={{
              maxWidth:
                previewDevice ===
                "mobile"
                  ? "100%"
                  : `${
                      form.layout
                        ?.max_width ||
                      900
                    }px`,

              borderRadius:
                `${
                  form.layout
                    ?.card_radius ||
                  22
                }px`,

              padding:
                `${
                  form.layout
                    ?.card_padding ||
                  28
                }px`,

              background:
                form.theme
                  ?.card_background ||
                "#ffffff",

              color:
                form.theme
                  ?.text_color ||
                "#101828",
            }}
          >
            <h1
              style={{
                fontFamily:
                  form.typography
                    ?.title_font_family ||
                  "Inter",

                fontSize:
                  `${
                    form.typography
                      ?.title_size ||
                    38
                  }px`,
              }}
            >
              {isKa
                ? form.page_title_ka
                : form.page_title_en}
            </h1>

            <p>
              {isKa
                ? form.subtitle_ka
                : form.subtitle_en}
            </p>

            {sections
              .filter(
                (section) =>
                  section.enabled
              )
              .map(
                (
                  section
                ) => {
                  const sectionFields =
                    fields.filter(
                      (field) =>
                        field.enabled &&
                        field.section_id ===
                          section.id
                    );

                  const sectionBlocks =
                    blocks.filter(
                      (block) =>
                        block.enabled &&
                        block.section_id ===
                          section.id
                    );

                  return (
                    <section
                      key={
                        section.id
                      }
                      className="previewSection"
                    >
                      <h2>
                        {isKa
                          ? section.title_ka
                          : section.title_en}
                      </h2>

                      <p>
                        {isKa
                          ? section.description_ka
                          : section.description_en}
                      </p>

                      {sectionBlocks.map(
                        (
                          block
                        ) => (
                          <PreviewBlock
                            key={
                              block.id
                            }
                            block={
                              block
                            }
                            isKa={
                              isKa
                            }
                          />
                        )
                      )}

                      <div className="previewGrid">
                        {sectionFields.map(
                          (
                            field
                          ) => (
                            <PreviewField
                              key={
                                field.id
                              }
                              field={
                                field
                              }
                              isKa={
                                isKa
                              }
                            />
                          )
                        )}
                      </div>
                    </section>
                  );
                }
              )}

            <button
              type="button"
              className="previewSubmit"
              style={{
                height:
                  `${
                    form.button_style
                      ?.height ||
                    48
                  }px`,

                borderRadius:
                  `${
                    form.button_style
                      ?.radius ||
                    12
                  }px`,

                background:
                  form.button_style
                    ?.background ||
                  form.theme
                    ?.primary_color ||
                  "#1465e8",

                color:
                  form.button_style
                    ?.text_color ||
                  "#ffffff",
              }}
            >
              {isKa
                ? form.submit_button_ka
                : form.submit_button_en}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewField({
  field,
  isKa,
}: {
  field: RegistrationField;
  isKa: boolean;
}) {
  const widthClass =
    `width-${field.width}`;

  return (
    <div
      className={`previewField ${widthClass}`}
      style={{
        marginTop:
          field.margin_top,

        marginBottom:
          field.margin_bottom,

        fontFamily:
          field.font_family ||
          "Inter",
      }}
    >
      <label
        style={{
          fontSize:
            field.label_size,

          fontWeight:
            field.label_weight,

          color:
            field.style
              ?.label_color ||
            "#344054",
        }}
      >
        {isKa
          ? field.label_ka
          : field.label_en}

        {field.required &&
          " *"}
      </label>

      {field.field_type ===
      "textarea" ? (
        <textarea
          readOnly
          placeholder={
            (isKa
              ? field.placeholder_ka
              : field.placeholder_en) ||
            ""
          }
          style={{
            minHeight:
              Math.max(
                field.input_height,
                90
              ),

            borderRadius:
              field.border_radius,

            fontSize:
              field.input_text_size,

            background:
              field.style
                ?.background ||
              "#ffffff",

            borderColor:
              field.style
                ?.border_color ||
              "#d0d5dd",

            color:
              field.style
                ?.text_color ||
              "#101828",
          }}
        />
      ) : field.field_type ===
        "select" ? (
        <select
          style={{
            height:
              field.input_height,

            borderRadius:
              field.border_radius,
          }}
        >
          <option>
            Select...
          </option>
        </select>
      ) : field.field_type ===
          "checkbox" ||
        field.field_type ===
          "toggle" ? (
        <div className="previewCheck">
          <input
            type="checkbox"
            readOnly
          />
          <span>
            {isKa
              ? field.help_text_ka
              : field.help_text_en}
          </span>
        </div>
      ) : (
        <input
          readOnly
          type={
            [
              "email",
              "tel",
              "number",
              "date",
            ].includes(
              field.field_type
            )
              ? field.field_type
              : "text"
          }
          placeholder={
            (isKa
              ? field.placeholder_ka
              : field.placeholder_en) ||
            ""
          }
          style={{
            height:
              field.input_height,

            borderRadius:
              field.border_radius,

            fontSize:
              field.input_text_size,

            background:
              field.style
                ?.background ||
              "#ffffff",

            borderColor:
              field.style
                ?.border_color ||
              "#d0d5dd",

            color:
              field.style
                ?.text_color ||
              "#101828",
          }}
        />
      )}

      {(isKa
        ? field.help_text_ka
        : field.help_text_en) && (
        <small
          style={{
            fontSize:
              field.help_text_size,
          }}
        >
          {isKa
            ? field.help_text_ka
            : field.help_text_en}
        </small>
      )}
    </div>
  );
}

function PreviewBlock({
  block,
  isKa,
}: {
  block: FormBlock;
  isKa: boolean;
}) {
  if (
    block.block_type ===
    "divider"
  ) {
    return <hr />;
  }

  if (
    block.block_type ===
    "spacer"
  ) {
    return (
      <div
        style={{
          height: 24,
        }}
      />
    );
  }

  return (
    <div
      className={`previewBlock ${block.block_type}`}
    >
      {block.title_ka ||
      block.title_en ? (
        <strong>
          {isKa
            ? block.title_ka
            : block.title_en}
        </strong>
      ) : null}

      <p>
        {isKa
          ? block.content_ka
          : block.content_en}
      </p>
    </div>
  );
}

function PanelTitle({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="panelTitle">
      <span>
        {icon}
      </span>

      <div>
        <h2>
          {title}
        </h2>

        <p>
          {text}
        </p>
      </div>
    </div>
  );
}

function TextInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
}) {
  return (
    <label className="formControl">
      <span>
        {label}
      </span>

      <input
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
      />
    </label>
  );
}

function TextInputName({
  label,
  name,
}: {
  label: string;
  name: string;
}) {
  return (
    <label className="formControl">
      <span>
        {label}
      </span>

      <input
        name={name}
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
}) {
  return (
    <label className="formControl">
      <span>
        {label}
      </span>

      <textarea
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
      />
    </label>
  );
}

function NumberInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (
    value: number
  ) => void;
}) {
  return (
    <label className="formControl">
      <span>
        {label}
      </span>

      <input
        type="number"
        value={value}
        onChange={(e) =>
          onChange(
            Number(
              e.target.value
            )
          )
        }
      />
    </label>
  );
}

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
}) {
  return (
    <label className="formControl">
      <span>
        {label}
      </span>

      <div className="colorControl">
        <input
          type="color"
          value={value}
          onChange={(e) =>
            onChange(
              e.target.value
            )
          }
        />

        <input
          value={value}
          onChange={(e) =>
            onChange(
              e.target.value
            )
          }
        />
      </div>
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (
    value: boolean
  ) => void;
}) {
  return (
    <label className="toggleControl">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) =>
          onChange(
            e.target.checked
          )
        }
      />

      <span>
        {label}
      </span>
    </label>
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
        background: #f4f6fa;
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
      }

      .topHeader {
        min-height: 74px;
        padding: 0 22px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
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
        background: linear-gradient(135deg,#1465e8,#7655f7);
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
        letter-spacing: 1.5px;
      }

      .headerActions {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .saveButton,
      .publishButton {
        min-height: 38px;
        padding: 0 12px;
        border: 0;
        border-radius: 9px;
        font-size: 9px;
        font-weight: 900;
        cursor: pointer;
      }

      .saveButton {
        background: #eef4ff;
        color: #1465e8;
      }

      .publishButton {
        background: #1465e8;
        color: white;
      }

      .languages {
        padding: 4px;
        display: flex;
        background: #eaecf0;
        border-radius: 9px;
      }

      .languages button {
        padding: 7px 9px;
        border: 0;
        border-radius: 7px;
        background: transparent;
        color: #667085;
        font-size: 8px;
        font-weight: 900;
        cursor: pointer;
      }

      .languages button.active {
        background: white;
        color: #1465e8;
      }

      .builderLayout {
        min-height: calc(100vh - 74px);
        display: grid;
        grid-template-columns: 240px minmax(0,1fr);
      }

      .formSidebar {
        border-right: 1px solid #e4e7ec;
        background: white;
      }

      .sidebarTitle {
        padding: 21px 15px 12px;
      }

      .sidebarTitle span,
      .eyebrow {
        color: #7655f7;
        font-size: 8px;
        font-weight: 900;
        letter-spacing: 1.4px;
      }

      .sidebarTitle h2 {
        margin: 4px 0 0;
        font-size: 20px;
      }

      .formList {
        padding: 5px 8px 20px;
      }

      .formItem {
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

      .formItem.active {
        background: #f1efff;
      }

      .formEmoji {
        width: 36px;
        height: 36px;
        display: grid;
        place-items: center;
        border-radius: 10px;
        background: #eef4ff;
        font-size: 17px;
      }

      .formInfo strong,
      .formInfo small {
        display: block;
      }

      .formInfo strong {
        color: #344054;
        font-size: 10px;
      }

      .formInfo small {
        margin-top: 2px;
        color: #98a2b3;
        font-size: 7px;
      }

      .builderMain {
        min-width: 0;
        padding: 26px;
      }

      .builderIntro {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 20px;
      }

      .builderIntro h1 {
        margin: 6px 0 5px;
        font-size: 32px;
        letter-spacing: -1.4px;
      }

      .builderIntro p {
        margin: 0;
        max-width: 650px;
        color: #667085;
        font-size: 10px;
        line-height: 1.5;
      }

      .formState {
        padding: 8px 10px;
        border: 1px solid #e4e7ec;
        border-radius: 8px;
        background: white;
        color: #667085;
        font-size: 8px;
      }

      .formState span {
        width: 7px;
        height: 7px;
        margin-right: 5px;
        display: inline-block;
        border-radius: 50%;
      }

      .green {
        background: #12b76a;
      }

      .gray {
        background: #98a2b3;
      }

      .tabs {
        margin-top: 20px;
        padding: 5px;
        display: flex;
        gap: 4px;
        overflow-x: auto;
        border-radius: 11px;
        background: #e9edf3;
      }

      .tab {
        min-height: 37px;
        padding: 0 11px;
        display: flex;
        align-items: center;
        gap: 5px;
        border: 0;
        border-radius: 8px;
        background: transparent;
        color: #667085;
        font-size: 8px;
        font-weight: 850;
        white-space: nowrap;
        cursor: pointer;
      }

      .tab.active {
        background: white;
        color: #1465e8;
        box-shadow: 0 2px 8px rgba(16,24,40,.06);
      }

      .editorPanel {
        margin-top: 16px;
        padding: 20px;
        border: 1px solid #e4e7ec;
        border-radius: 16px;
        background: white;
      }

      .panelTitleRow {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
      }

      .panelTitle {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .panelTitle > span {
        width: 39px;
        height: 39px;
        display: grid;
        place-items: center;
        border-radius: 10px;
        background: #eef4ff;
        font-size: 17px;
      }

      .panelTitle h2 {
        margin: 0;
        font-size: 15px;
      }

      .panelTitle p {
        margin: 3px 0 0;
        color: #98a2b3;
        font-size: 8px;
      }

      .subHeading {
        margin: 24px 0 12px;
        padding-bottom: 8px;
        border-bottom: 1px solid #eaecf0;
        color: #475467;
        font-size: 11px;
      }

      .twoColumn,
      .threeColumn {
        margin-top: 16px;
        display: grid;
        gap: 11px;
      }

      .twoColumn {
        grid-template-columns: repeat(2,1fr);
      }

      .threeColumn {
        grid-template-columns: repeat(3,1fr);
      }

      .formControl > span {
        margin-bottom: 5px;
        display: block;
        color: #475467;
        font-size: 8px;
        font-weight: 800;
      }

      .formControl input,
      .formControl textarea,
      .formControl select {
        width: 100%;
        padding: 9px 10px;
        border: 1px solid #d0d5dd;
        border-radius: 8px;
        outline: none;
        background: white;
        color: #101828;
        font-size: 10px;
      }

      .formControl textarea {
        min-height: 80px;
        resize: vertical;
      }

      .formControl input:focus,
      .formControl textarea:focus,
      .formControl select:focus {
        border-color: #84adf0;
        box-shadow: 0 0 0 3px rgba(20,101,232,.07);
      }

      .addButton,
      .primaryButton {
        border: 0;
        border-radius: 9px;
        background: #1465e8;
        color: white;
        font-size: 8px;
        font-weight: 900;
        cursor: pointer;
      }

      .addButton {
        min-height: 35px;
        padding: 0 11px;
      }

      .primaryButton {
        margin-top: 13px;
        min-height: 37px;
        padding: 0 13px;
      }

      .addForm {
        margin-top: 14px;
        padding: 15px;
        border: 1px dashed #cbd7e9;
        border-radius: 11px;
        background: #f8faff;
      }

      .itemStack {
        margin-top: 14px;
        display: grid;
        gap: 10px;
      }

      .builderCard {
        padding: 15px;
        border: 1px solid #e4e7ec;
        border-radius: 13px;
        background: #fbfcfe;
      }

      .cardHeader {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 13px;
      }

      .cardHeader > div:first-child {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .cardHeader strong,
      .cardHeader small {
        display: block;
      }

      .cardHeader strong {
        color: #344054;
        font-size: 10px;
      }

      .cardHeader small {
        color: #98a2b3;
        font-size: 7px;
      }

      .typeBadge {
        padding: 5px 7px;
        border-radius: 6px;
        background: #eef4ff;
        color: #1465e8;
        font-size: 7px;
        font-weight: 900;
        text-transform: uppercase;
      }

      .switches,
      .advancedRow {
        display: flex;
        align-items: center;
        gap: 13px;
        flex-wrap: wrap;
      }

      .advancedRow {
        margin-top: 14px;
        padding-top: 11px;
        border-top: 1px solid #eaecf0;
      }

      .toggleControl {
        display: flex;
        align-items: center;
        gap: 5px;
        color: #475467;
        font-size: 7px;
      }

      .toggleControl input {
        width: auto;
      }

      .cardFooter {
        margin-top: 13px;
        display: flex;
        justify-content: flex-end;
      }

      .dangerButton {
        padding: 6px 8px;
        border: 0;
        border-radius: 7px;
        background: #fff1f0;
        color: #b42318;
        font-size: 7px;
        font-weight: 850;
        cursor: pointer;
      }

      .colorControl {
        display: grid;
        grid-template-columns: 42px 1fr;
        gap: 6px;
      }

      .colorControl input[type="color"] {
        padding: 3px;
      }

      .previewToolbar {
        display: flex;
        justify-content: space-between;
        gap: 12px;
      }

      .previewToolbar > div {
        padding: 4px;
        display: flex;
        gap: 4px;
        border-radius: 8px;
        background: #eaecf0;
      }

      .previewToolbar button {
        padding: 7px 9px;
        border: 0;
        border-radius: 6px;
        background: transparent;
        color: #667085;
        font-size: 8px;
        cursor: pointer;
      }

      .previewToolbar .toolActive {
        background: white;
        color: #1465e8;
      }

      .previewStage {
        margin-top: 16px;
        padding: 22px;
        display: grid;
        place-items: center;
        overflow-x: auto;
        border-radius: 13px;
        background: #e9edf3;
      }

      .previewDesktop {
        width: 100%;
        min-height: 650px;
        padding: 35px;
      }

      .previewPhone {
        width: 390px;
        max-width: 100%;
        min-height: 680px;
        padding: 18px;
        border: 8px solid #101828;
        border-radius: 30px;
      }

      .previewForm {
        margin: auto;
        border: 1px solid #e4e7ec;
      }

      .previewForm h1 {
        margin: 0;
      }

      .previewForm > p {
        color: #667085;
      }

      .previewSection {
        margin-top: 25px;
      }

      .previewSection h2 {
        margin: 0 0 5px;
        font-size: 18px;
      }

      .previewSection > p {
        margin: 0 0 14px;
        color: #667085;
        font-size: 11px;
      }

      .previewGrid {
        display: grid;
        grid-template-columns: repeat(12,1fr);
        gap: 12px;
      }

      .previewField {
        grid-column: span 12;
      }

      .width-half {
        grid-column: span 6;
      }

      .width-third {
        grid-column: span 4;
      }

      .width-quarter {
        grid-column: span 3;
      }

      .previewField label {
        margin-bottom: 5px;
        display: block;
      }

      .previewField input,
      .previewField textarea,
      .previewField select {
        width: 100%;
        padding: 9px;
        border-width: 1px;
        border-style: solid;
        outline: none;
      }

      .previewField small {
        margin-top: 4px;
        display: block;
        color: #667085;
      }

      .previewCheck {
        display: flex;
        align-items: center;
        gap: 7px;
      }

      .previewCheck input {
        width: auto;
      }

      .previewBlock {
        margin: 12px 0;
        padding: 10px;
        border-radius: 8px;
      }

      .previewBlock.notice,
      .previewBlock.info {
        background: #eff8ff;
      }

      .previewBlock.warning {
        background: #fffaeb;
      }

      .previewBlock p {
        margin: 4px 0 0;
        font-size: 11px;
      }

      .previewSubmit {
        margin-top: 24px;
        padding: 0 20px;
        border: 0;
        font-weight: 900;
      }

      .errorBox,
      .successBox {
        margin-top: 12px;
        padding: 9px;
        border-radius: 8px;
        font-size: 8px;
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

      .statePage {
        min-height: 100vh;
        padding: 30px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #f4f6fa;
        font-family: Inter,Arial,sans-serif;
        text-align: center;
      }

      .lock {
        font-size: 42px;
      }

      .loginLink {
        margin-top: 12px;
        padding: 10px 14px;
        border-radius: 9px;
        background: #1465e8;
        color: white;
        text-decoration: none;
      }

      .loader {
        width: 35px;
        height: 35px;
        margin-bottom: 10px;
        border: 3px solid #e4e7ec;
        border-top-color: #1465e8;
        border-radius: 50%;
        animation: spin .8s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      @media(max-width:1000px) {
        .threeColumn {
          grid-template-columns: repeat(2,1fr);
        }
      }

      @media(max-width:850px) {
        .builderLayout {
          grid-template-columns: 1fr;
        }

        .formSidebar {
          border-right: 0;
          border-bottom: 1px solid #e4e7ec;
        }

        .formList {
          display: flex;
          overflow-x: auto;
        }

        .formItem {
          min-width: 175px;
        }
      }

      @media(max-width:600px) {
        .builderMain {
          padding: 14px 10px;
        }

        .topHeader {
          padding: 0 10px;
        }

        .brand small {
          display: none;
        }

        .saveButton,
        .publishButton {
          padding: 0 8px;
          font-size: 7px;
        }

        .twoColumn,
        .threeColumn {
          grid-template-columns: 1fr;
        }

        .panelTitleRow,
        .builderIntro,
        .cardHeader,
        .previewToolbar {
          align-items: flex-start;
          flex-direction: column;
        }

        .width-half,
        .width-third,
        .width-quarter {
          grid-column: span 12;
        }
      }
    `}</style>
  );
}
