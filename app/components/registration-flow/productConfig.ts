import type {
  ProductMeta,
  ProductType,
} from "./registrationTypes";

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
      "ნუ ინერვიულებთ წინასწარ — მპოვნელს თქვენთან დაკავშირება მაქსიმალურად გავუმარტივოთ.",
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
      "მოგზაურობა შეიძლება გაგრძელდეს — დაკარგული ჩემოდანი კი დაბრუნდეს.",
    subline:
      "ერთი QR მპოვნელიდან მფლობელამდე.",
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
    value === "suitcase"
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
    type === "suitcase"
  );
}

export function showModelField(
  type: ProductType
) {
  return (
    type === "bag" ||
    type === "suitcase"
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
    return "გთხოვთ შეავსოთ ძაღლის შესახებ ინფორმაცია.";
  }

  if (type === "cat") {
    return "გთხოვთ შეავსოთ კატის შესახებ ინფორმაცია.";
  }

  return `გთხოვთ შეავსოთ ${PRODUCT_META[type].label}ს შესახებ ინფორმაცია.`;
}
