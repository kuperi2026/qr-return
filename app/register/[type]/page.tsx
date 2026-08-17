"use client";

import { FormEvent, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Language = "ka" | "en";
type Step = 1 | 2 | 3;

type CategoryKey =
  | "dog"
  | "cat"
  | "keys"
  | "wallet"
  | "suitcase"
  | "bag";

const categories = {
  dog: {
    icon: "🐕",
    ka: "ძაღლი",
    en: "Dog",
    itemType: "pet",
    petType: "dog",
    isPet: true,
  },
  cat: {
    icon: "🐈",
    ka: "კატა",
    en: "Cat",
    itemType: "pet",
    petType: "cat",
    isPet: true,
  },
  keys: {
    icon: "🔑",
    ka: "გასაღები",
    en: "Keys",
    itemType: "keys",
    petType: null,
    isPet: false,
  },
  wallet: {
    icon: "👛",
    ka: "საფულე",
    en: "Wallet",
    itemType: "wallet",
    petType: null,
    isPet: false,
  },
  suitcase: {
    icon: "🧳",
    ka: "ჩემოდანი",
    en: "Suitcase",
    itemType: "suitcase",
    petType: null,
    isPet: false,
  },
  bag: {
    icon: "🎒",
    ka: "ჩანთა",
    en: "Bag",
    itemType: "bag",
    petType: null,
    isPet: false,
  },
} as const;

type FormState = {
  tag_code: string;
  item_name: string;
  colour: string;

  sex: string;
  date_of_birth: string;
  weight: string;
  medical_info: string;

  brand: string;
  model: string;
  size: string;
  material: string;
  distinctive_features: string;

  description: string;

  owner_first_name: string;
  owner_last_name: string;
  owner_phone: string;
  owner_email: string;

  additional_contact_name: string;
  additional_contact_phone: string;
  additional_contact_email: string;

  contact_preference: string;

  finder_message: string;
  reward: string;
  lost_seen_location: string;
};

const initialForm: FormState = {
  tag_code: "",
  item_name: "",
  colour: "",

  sex: "",
  date_of_birth: "",
  weight: "",
  medical_info: "",

  brand: "",
  model: "",
  size: "",
  material: "",
  distinctive_features: "",

  description: "",

  owner_first_name: "",
  owner_last_name: "",
  owner_phone: "",
  owner_email: "",

  additional_contact_name: "",
  additional_contact_phone: "",
  additional_contact_email: "",

  contact_preference: "both",

  finder_message: "",
  reward: "",
  lost_seen_location: "",
};

export default function RegistrationPage() {
  const params = useParams();

  const rawType = Array.isArray(params.type)
    ? params.type[0]
    : params.type;

  const type: CategoryKey =
    rawType && rawType in categories
      ? (rawType as CategoryKey)
      : "dog";

  const category = categories[type];

  const [language, setLanguage] =
    useState<Language>("ka");

  const [step, setStep] =
    useState<Step>(1);

  const [form, setForm] =
    useState<FormState>(initialForm);

  const [showExtraProfile, setShowExtraProfile] =
    useState(false);

  const [showExtraContact, setShowExtraContact] =
    useState(false);

  const [
    locationSharingEnabled,
    setLocationSharingEnabled,
  ] = useState(false);

  const [itemPhoto, setItemPhoto] =
    useState<File | null>(null);

  const [ownerPhoto, setOwnerPhoto] =
    useState<File | null>(null);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  const ka = language === "ka";

  function updateField(
    name: keyof FormState,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function nextStep() {
    setError("");

    if (step === 1) {
      if (!form.tag_code.trim()) {
        setError(
          ka
            ? "გთხოვთ, მიუთითოთ QR კოდი."
            : "Please enter the QR code."
        );
        return;
      }

      if (!form.item_name.trim()) {
        setError(
          ka
            ? category.isPet
              ? "გთხოვთ, მიუთითოთ ცხოველის სახელი."
              : "გთხოვთ, მიუთითოთ ნივთის დასახელება."
            : category.isPet
            ? "Please enter the pet name."
            : "Please enter the item name."
        );
        return;
      }

      setStep(2);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    if (step === 2) {
      if (!form.owner_first_name.trim()) {
        setError(
          ka
            ? "გთხოვთ, მიუთითოთ მფლობელის სახელი."
            : "Please enter the owner's first name."
        );
        return;
      }

      if (!form.owner_last_name.trim()) {
        setError(
          ka
            ? "გთხოვთ, მიუთითოთ მფლობელის გვარი."
            : "Please enter the owner's last name."
        );
        return;
      }

      if (!form.owner_email.trim()) {
        setError(
          ka
            ? "გთხოვთ, მიუთითოთ ელფოსტა."
            : "Please enter an email address."
        );
        return;
      }

      setStep(3);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  function previousStep() {
    setError("");

    setStep((current) =>
      current === 3 ? 2 : 1
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
