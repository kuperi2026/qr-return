import type {
  ProductMeta,
  ProductType,
} from "./registrationTypes";

export type AppRegistrationHeroType = ProductType | "emergency";

export const APP_REGISTRATION_HERO: Record<AppRegistrationHeroType, { title: string; use: string; promise: string; image: string }> = {
  dog: { title: "ძაღლი", use: "ძაღლის საყელოსთვის", promise: "დაკარგული ოთხფეხა მეგობრის სწრაფად ამოცნობისა და პატრონთან დაკავშირების მარტივი გზა.", image: "/products/models/dog.png" },
  cat: { title: "კატა", use: "კატის საყელოსთვის", promise: "ერთი სკანირებით მპოვნელი ხედავს უსაფრთხო დაბრუნებისთვის საჭირო, მფლობელის მიერ შერჩეულ ინფორმაციას.", image: "/products/models/cat.png" },
  keys: { title: "გასაღები", use: "სახლისა და მანქანის გასაღებისთვის", promise: "მპოვნელს შეუძლია დაგიკავშირდეთ გასაღებზე პირადი მისამართის დატანის გარეშე.", image: "/products/models/keys.png" },
  wallet: { title: "საფულე", use: "საფულისა და დოკუმენტებისთვის", promise: "თხელი QR ბარათი კეთილსინდისიერ მპოვნელს თქვენთან დაკავშირების მარტივ გზას აძლევს.", image: "/products/models/wallet.png" },
  bag: { title: "ჩანთა", use: "ჩანთისა და ზურგჩანთისთვის", promise: "დაკარგული ჩანთის ამოცნობისა და დაბრუნებისთვის საჭირო ინფორმაცია ერთ ციფრულ პროფილში.", image: "/products/models/bag.png" },
  suitcase: { title: "ჩემოდანი", use: "ჩემოდნისა და სამგზავრო ბარგისთვის", promise: "მოგზაურობისას დაკარგული ბარგის მპოვნელთან ან თანამშრომელთან სწრაფი კავშირის შესაძლებლობა.", image: "/products/models/suitcase.png" },
  parking: { title: "Parking QR", use: "ავტომობილის უსაფრთხო კავშირისთვის", promise: "ერთი სკანირებით სხვა მძღოლი უსაფრთხოდ დაგიკავშირდებათ — პირადი მონაცემების გასაჯაროების გარეშე.", image: "/home/burgundy-premium-parking.svg" },
  emergency: { title: "Emergency", use: "ადამიანის უსაფრთხოებისთვის", promise: "საჭირო დროს ხელმისაწვდომი მნიშვნელოვანი ინფორმაცია და Emergency კონტაქტები.", image: "/products/models/emergency.png" },
};

export const PRODUCT_META: Record<
  ProductType,
  ProductMeta
> = {
  dog: {
    label: "ძაღლი",
    emoji: "🐶",
    slogan:
      "ერთი სკანირება შეიძლება იყოს გზა სახლში დაბრუნებამდე.",
    subline:
      "ნუ ინერვიულებთ წინასწარ — შეავსეთ პროფილი და მპოვნელს თქვენთან დაკავშირება გაუმარტივდება.",
  },

  cat: {
    label: "კატა",
    emoji: "🐱",
    slogan:
      "ერთი პატარა QR შეიძლება გახდეს ყველაზე მოკლე გზა პატრონამდე.",
    subline:
      "რაც უფრო მარტივია დაკავშირება, მით მეტია სწრაფად დაბრუნების შესაძლებლობა.",
  },

  keys: {
    label: "გასაღები",
    emoji: "🔑",
    slogan:
      "დაკარგული გასაღები ყოველთვის არ ნიშნავს დაკარგულ დღეს.",
    subline:
      "მპოვნელს მხოლოდ ერთი სკანირება სჭირდება თქვენთან დასაკავშირებლად.",
  },

  wallet: {
    label: "საფულე",
    emoji: "👛",
    slogan:
      "დაბრუნება იწყება ერთი სწორი კონტაქტით.",
    subline:
      "QR RETURN ამარტივებს მპოვნელსა და მფლობელს შორის პირველ ნაბიჯს.",
  },

  bag: {
    label: "ჩანთა",
    emoji: "👜",
    slogan:
      "რაც თქვენთვის მნიშვნელოვანია, ადვილად დასაბრუნებელი გახადეთ.",
    subline:
      "ნაკლები გაურკვევლობა, უფრო სწრაფი დაკავშირება.",
  },

  suitcase: {
    label: "ჩემოდანი",
    emoji: "🧳",
    slogan:
      "იმოგზაურეთ მშვიდად — ჭკვიანი QR იარლიყი მოგზაურობის მოყვარულთათვის!",
    subline: "",
  },
  parking: {
    label: "მანქანა / Parking",
    emoji: "🚘",
    slogan:
      "ერთი სკანირება — სწრაფი კავშირი ავტომობილის მფლობელთან.",
    subline:
      "პარკირებისას მპოვნელს შეუძლია უსაფრთხოდ დაგიკავშირდეთ ზარით ან ჩატით.",
  },
};

export function isProductType(
  value: string
): value is ProductType {
  return (
    value === "dog" ||
    value === "cat" ||
    value === "keys" ||
    value === "wallet" ||
    value === "bag" ||
    value === "suitcase" ||
    value === "parking"
  );
}

export function isPetType(
  type: ProductType
) {
  return (
    type === "dog" ||
    type === "cat"
  );
}

export function isKeysType(
  type: ProductType
) {
  return type === "keys";
}

export function showBrandField(
  type: ProductType
) {
  return (
    type === "wallet" ||
    type === "bag" ||
    type === "suitcase" ||
    type === "parking"
  );
}

export function showModelField(
  type: ProductType
) {
  return (
    type === "bag" ||
    type === "suitcase" ||
    type === "parking"
  );
}

export function showSizeField(
  type: ProductType
) {
  return (
    type === "bag" ||
    type === "suitcase"
  );
}

export function showMaterialField(
  type: ProductType
) {
  return (
    type === "wallet" ||
    type === "bag" ||
    type === "suitcase"
  );
}

export function getProductFormText(
  type: ProductType
) {
  if (type === "dog") {
    return "შეავსეთ ცხოველის ამოსაცნობად საჭირო ინფორმაცია.";
  }

  if (type === "cat") {
    return "შეავსეთ ცხოველის ამოსაცნობად საჭირო ინფორმაცია.";
  }

  return `გთხოვთ შეავსოთ ${PRODUCT_META[type].label}ს შესახებ ინფორმაცია.`;
}
