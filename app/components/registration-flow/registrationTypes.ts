export type ProductType =
  | "dog"
  | "cat"
  | "keys"
  | "wallet"
  | "bag"
  | "suitcase";

export type RegistrationStep =
  | 1
  | 2
  | 3;

export type RegistrationDraft = {
  ownerFirstName: string;
  ownerLastName: string;
  ownerPhone: string;
  ownerEmail: string;

  tagCode: string;
  itemName: string;
  colour: string;

  sex: string;
  dateOfBirth: string;
  weight: string;

  brand: string;
  model: string;
  size: string;
  material: string;

  description: string;
  medicalInfo: string;
  behaviourNote: string;
  distinctiveFeatures: string;

  lostLocation: string;
  finderMessage: string;

  showEmail: boolean;
  showPhoto: boolean;
  showDescription: boolean;
  showMedicalInfo: boolean;
  showBehaviourNote: boolean;
  showLostLocation: boolean;
  showFinderMessage: boolean;

  liveChatEnabled: boolean;
};

export type ProductMeta = {
  label: string;
  emoji: string;
  slogan: string;
  subline: string;
};

export const INITIAL_DRAFT: RegistrationDraft = {
  ownerFirstName: "",
  ownerLastName: "",
  ownerPhone: "",
  ownerEmail: "",

  tagCode: "",
  itemName: "",
  colour: "",

  sex: "",
  dateOfBirth: "",
  weight: "",

  brand: "",
  model: "",
  size: "",
  material: "",

  description: "",
  medicalInfo: "",
  behaviourNote: "",
  distinctiveFeatures: "",

  lostLocation: "",
  finderMessage: "",

  showEmail: false,
  showPhoto: true,
  showDescription: true,
  showMedicalInfo: false,
  showBehaviourNote: false,
  showLostLocation: true,
  showFinderMessage: true,

  liveChatEnabled: true,
};
