export type ProfileFor =
  | "self"
  | "other"
  | "";

export type Relationship =
  | "parent"
  | "child"
  | "spouse"
  | "sibling"
  | "grandparent"
  | "caregiver"
  | "guardian"
  | "other"
  | "";

export type EmergencyVisibility = {
  showName: boolean;
  showBirthDate: boolean;
  showSex: boolean;
  showBloodGroup: boolean;
  showAllergies: boolean;
  showConditions: boolean;
  showMedications: boolean;
  showMedicalNotes: boolean;
  showPrimaryContact: boolean;
  showSecondContact: boolean;
};

export type EmergencyContactData = {
  enabled: boolean;

  firstName: string;
  lastName: string;
  phone: string;
  relationship: string;
};

export type EmergencyMedicalData = {
  bloodGroup: string;
  allergies: string;
  medicalConditions: string;
  medications: string;
  medicalNotes: string;
};

export type EmergencyCreatorData = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

export type EmergencyHolderData = {
  firstName: string;
  lastName: string;

  birthDate: string;
  sex: string;

  relationship: Relationship;
  customRelationship: string;
};

export type EmergencyRegistrationData = {
  tagCode: string;

  profileType:
    "emergency_bracelet";

  profileFor: ProfileFor;

  creator: EmergencyCreatorData;

  holder: EmergencyHolderData;

  medical: EmergencyMedicalData;

  primaryContact: EmergencyContactData;

  secondaryContact: EmergencyContactData;

  visibility: EmergencyVisibility;

  security: {
    profileTypeLocked: boolean;
    profileForLocked: boolean;
    tagCodeLocked: boolean;
    holderIdentityLocked: boolean;

    holderFirstNameChangeUsed: boolean;
  };
};

export const relationshipLabels: Record<
  Exclude<
    Relationship,
    ""
  >,
  string
> = {
  parent: "მშობელი",
  child: "შვილი",
  spouse: "მეუღლე",
  sibling: "და / ძმა",
  grandparent: "ბებია / ბაბუა",
  caregiver: "მომვლელი",
  guardian: "მეურვე",
  other: "სხვა",
};

export const bloodGroups = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;
