export type FAQCategory =
  | "general"
  | "qr"
  | "lost"
  | "contact"
  | "privacy"
  | "emergency"
  | "products"
  | "account"
  | "orders"
  | "support";

export type FAQItem = {
  id: number;
  category: FAQCategory;

  questionKa: string;
  answerKa: string;

  questionEn: string;
  answerEn: string;
};

export const faqCategories = [
  { id: "all", ka: "ყველა", en: "All" },
  { id: "general", ka: "ზოგადი", en: "General" },
  { id: "qr", ka: "QR და აქტივაცია", en: "QR & Activation" },
  { id: "lost", ka: "დაკარგვა და დაბრუნება", en: "Lost & Return" },
  { id: "contact", ka: "კავშირი", en: "Contact" },
  { id: "privacy", ka: "Privacy", en: "Privacy" },
  { id: "emergency", ka: "Emergency ID", en: "Emergency ID" },
  { id: "products", ka: "პროდუქტები", en: "Products" },
  { id: "account", ka: "ანგარიში", en: "Account" },
  { id: "orders", ka: "შეკვეთები", en: "Orders" },
  { id: "support", ka: "დახმარება", en: "Support" },
] as const;

export const faqItems: FAQItem[] = [
  {
    id: 1,
    category: "general",
    questionKa: "რა არის QR RETURN?",
    answerKa:
      "QR RETURN არის QR-ზე დაფუძნებული სისტემა, რომელიც ეხმარება მპოვნელს დაუკავშირდეს დაკარგული ნივთის ან ცხოველის მფლობელს.",
    questionEn: "What is QR RETURN?",
    answerEn:
      "QR RETURN is a QR-based system designed to help a finder connect with the owner of a lost item or pet.",
  },
  {
    id: 2,
    category: "general",
    questionKa: "როგორ მუშაობს QR RETURN?",
    answerKa:
      "QR კოდის დასკანერების შემდეგ მპოვნელი გადადის შესაბამის პროფილზე და ხედავს მხოლოდ იმ ინფორმაციასა და საკონტაქტო შესაძლებლობებს, რომლებიც მფლობელს აქვს ნებადართული.",
    questionEn: "How does QR RETURN work?",
    answerEn:
      "After scanning the QR code, the finder opens the associated profile and sees only the information and contact options allowed by the owner.",
  },
  {
    id: 3,
    category: "general",
    questionKa: "მპოვნელს აპის ჩამოტვირთვა სჭირდება?",
    answerKa:
      "არა. QR კოდის დასკანერება შესაძლებელია ჩვეულებრივი სმარტფონის კამერით.",
    questionEn: "Does the finder need an app?",
    answerEn:
      "No. The QR code can be scanned with a standard smartphone camera.",
  },
  {
    id: 4,
    category: "general",
    questionKa: "რისთვის შეიძლება QR RETURN-ის გამოყენება?",
    answerKa:
      "სისტემა შეიძლება გამოყენებულ იქნას შინაური ცხოველებისთვის, გასაღებებისთვის, საფულეებისთვის, ჩანთებისთვის, ჩემოდნებისთვის და სხვა თავსებადი ნივთებისთვის.",
    questionEn: "What can I use QR RETURN for?",
    answerEn:
      "It can be used for pets, keys, wallets, bags, luggage, and other compatible belongings.",
  },
  {
    id: 5,
    category: "general",
    questionKa: "QR RETURN GPS ტრეკერია?",
    answerKa:
      "არა. QR RETURN-ის ძირითადი სისტემა QR კოდზე მუშაობს. მდებარეობის გაზიარება შესაძლებელია მაშინ, როდესაც მპოვნელი შესაბამის ფუნქციას გამოიყენებს და მოწყობილობა ნებართვას მისცემს.",
    questionEn: "Is QR RETURN a GPS tracker?",
    answerEn:
      "No. The core QR RETURN system is QR-based. Location can be shared when a finder uses the location-sharing feature and grants device permission.",
  },

  {
    id: 6,
    category: "qr",
    questionKa: "რა ხდება QR კოდის დასკანერებისას?",
    answerKa:
      "იხსნება QR კოდთან დაკავშირებული პროფილი, საიდანაც მპოვნელს შეუძლია ნახოს ნებადართული ინფორმაცია და ხელმისაწვდომი საკონტაქტო მეთოდები.",
    questionEn: "What happens when the QR code is scanned?",
    answerEn:
      "The linked profile opens, allowing the finder to view permitted information and available contact options.",
  },
  {
    id: 7,
    category: "qr",
    questionKa: "როგორ გავააქტიურებ QR კოდს?",
    answerKa:
      "QR-ის აქტივაციის პროცესი დააკავშირებს კონკრეტულ კოდს თქვენს ანგარიშსა და არჩეულ პროფილთან.",
    questionEn: "How do I activate a QR code?",
    answerEn:
      "The activation process links a specific QR code to your account and selected profile.",
  },
  {
    id: 8,
    category: "qr",
    questionKa: "თითოეულ პროდუქტს უნიკალური QR კოდი ექნება?",
    answerKa:
      "დიახ. აქტივირებადი QR პროდუქტები უნდა იყოს დაკავშირებული უნიკალურ კოდთან, რათა სწორი პროფილი გაიხსნას.",
    questionEn: "Will each product have a unique QR code?",
    answerEn:
      "Yes. Activatable QR products should be linked to a unique code so the correct profile opens.",
  },
  {
    id: 9,
    category: "qr",
    questionKa: "შემიძლია ერთ ანგარიშზე რამდენიმე QR მქონდეს?",
    answerKa:
      "დიახ. ერთი ანგარიში შეიძლება გამოყენებულ იქნას რამდენიმე QR პროფილის სამართავად.",
    questionEn: "Can I have multiple QR codes on one account?",
    answerEn:
      "Yes. One account can be used to manage multiple QR profiles.",
  },
  {
    id: 10,
    category: "qr",
    questionKa: "QR კოდი იწურება?",
    answerKa:
      "თავად დაბეჭდილი QR კოდი ავტომატურად არ იწურება; მისი მუშაობა დამოკიდებულია დაკავშირებული პროფილისა და სისტემის სტატუსზე.",
    questionEn: "Does the QR code expire?",
    answerEn:
      "The printed QR code itself does not automatically expire; its functionality depends on the linked profile and system status.",
  },

  {
    id: 11,
    category: "lost",
    questionKa: "რა გავაკეთო ნივთის დაკარგვისას?",
    answerKa:
      "თქვენი ანგარიშიდან შესაბამის პროფილზე შეგიძლიათ ჩართოთ დაკარგვის რეჟიმი და განაახლოთ მპოვნელისთვის საჭირო ინფორმაცია.",
    questionEn: "What should I do if I lose an item?",
    answerEn:
      "From your account, you can enable lost mode on the relevant profile and update the information intended for the finder.",
  },
  {
    id: 12,
    category: "lost",
    questionKa: "რა არის Lost Mode?",
    answerKa:
      "Lost Mode არის პროფილის მდგომარეობა, რომელიც შეიძლება გამოყენებულ იქნას დაკარგვის შემთხვევაში მპოვნელისთვის შესაბამისი ინფორმაციისა და მოქმედებების საჩვენებლად.",
    questionEn: "What is Lost Mode?",
    answerEn:
      "Lost Mode is a profile state that can be used when something is lost to show the finder relevant information and actions.",
  },
  {
    id: 13,
    category: "lost",
    questionKa: "შემიძლია დავწერო სად დაიკარგა ნივთი?",
    answerKa:
      "დიახ. პროფილში შესაძლებელია დაკარგვასთან დაკავშირებული ინფორმაციის, მათ შორის ბოლო ცნობილი ადგილის, შენახვა, თუ ეს ფუნქცია ჩართულია.",
    questionEn: "Can I add where the item was lost?",
    answerEn:
      "Yes. A profile can store loss-related information, including the last known location, when that feature is enabled.",
  },
  {
    id: 14,
    category: "lost",
    questionKa: "შემიძლია მპოვნელს ჯილდო შევთავაზო?",
    answerKa:
      "დიახ, თუ Reward ფუნქცია ჩართულია. ჯილდოს შეთავაზება არჩევითია.",
    questionEn: "Can I offer a finder reward?",
    answerEn:
      "Yes, when the Reward feature is enabled. Offering a reward is optional.",
  },
  {
    id: 15,
    category: "lost",
    questionKa: "დაბრუნების შემდეგ რა გავაკეთო?",
    answerKa:
      "შეგიძლიათ გამორთოთ Lost Mode და პროფილი ჩვეულებრივ მდგომარეობაში დააბრუნოთ.",
    questionEn: "What do I do after my item is returned?",
    answerEn:
      "You can turn off Lost Mode and return the profile to its normal state.",
  },

  {
    id: 16,
    category: "contact",
    questionKa: "როგორ დამიკავშირდება მპოვნელი?",
    answerKa:
      "ხელმისაწვდომი მეთოდები შეიძლება მოიცავდეს Live Chat-ს, ტელეფონს, WhatsApp-ს ან სხვა ჩართულ საკონტაქტო საშუალებას.",
    questionEn: "How can a finder contact me?",
    answerEn:
      "Available methods may include Live Chat, phone, WhatsApp, or another enabled contact option.",
  },
  {
    id: 17,
    category: "contact",
    questionKa: "შეიძლება ჩემი ნომერი დამალული იყოს?",
    answerKa:
      "საკონტაქტო პარამეტრები ისე შეიძლება იყოს მოწყობილი, რომ მომხმარებელმა აირჩიოს რომელი მეთოდი გამოჩნდეს.",
    questionEn: "Can my phone number stay hidden?",
    answerEn:
      "Contact settings can be configured so the user chooses which contact methods are displayed.",
  },
  {
    id: 18,
    category: "contact",
    questionKa: "რა არის Live Chat?",
    answerKa:
      "Live Chat არის QR RETURN-ის შიდა საკომუნიკაციო ფუნქცია, რომელიც შეიძლება გამოყენებულ იქნას მპოვნელისა და შესაბამისი მხარის დასაკავშირებლად.",
    questionEn: "What is Live Chat?",
    answerEn:
      "Live Chat is QR RETURN's internal communication feature that can be used to connect a finder with the relevant party.",
  },
  {
    id: 19,
    category: "contact",
    questionKa: "შეიძლება პირდაპირ დარეკვა?",
    answerKa:
      "თუ მფლობელს დარეკვის ფუნქცია ჩართული აქვს, Call ღილაკს შეუძლია ტელეფონის დარეკვის ინტერფეისის გახსნა წინასწარ მითითებული ნომრით.",
    questionEn: "Can the finder call directly?",
    answerEn:
      "If calling is enabled by the owner, the Call button can open the phone dialer with the configured number ready.",
  },
  {
    id: 20,
    category: "contact",
    questionKa: "Email-ით დაკავშირება შეიძლება?",
    answerKa:
      "დიახ, თუ Email საკონტაქტო მეთოდად ჩართულია.",
    questionEn: "Can someone contact me by email?",
    answerEn:
      "Yes, when email is enabled as a contact method.",
  },

  {
    id: 21,
    category: "privacy",
    questionKa: "ვინ ხედავს ჩემს პირად ინფორმაციას?",
    answerKa:
      "საჯარო QR პროფილზე უნდა გამოჩნდეს მხოლოდ ის ინფორმაცია, რომელიც შესაბამისი კონფიდენციალურობის პარამეტრებით არის ნებადართული.",
    questionEn: "Who can see my personal information?",
    answerEn:
      "A public QR profile should display only information permitted by the relevant privacy settings.",
  },
  {
    id: 22,
    category: "privacy",
    questionKa: "შემიძლია ინფორმაცია დავმალო?",
    answerKa:
      "დიახ. შესაბამისი პროფილის პარამეტრებიდან შესაძლებელია ხელმისაწვდომი ინფორმაციისა და საკონტაქტო მეთოდების კონტროლი.",
    questionEn: "Can I hide information?",
    answerEn:
      "Yes. Available profile information and contact methods can be controlled through the relevant profile settings.",
  },
  {
    id: 23,
    category: "privacy",
    questionKa: "მპოვნელს ჩემი სრული ანგარიში გამოუჩნდება?",
    answerKa:
      "არა. Finder გვერდი და მფლობელის პირადი Account სხვადასხვა დანიშნულების ნაწილებია.",
    questionEn: "Can the finder see my full account?",
    answerEn:
      "No. The finder-facing page and the owner's private account serve different purposes.",
  },
  {
    id: 24,
    category: "privacy",
    questionKa: "ლოკაცია ავტომატურად იგზავნება?",
    answerKa:
      "არა. ბრაუზერის მიერ მდებარეობის გაზიარებას მომხმარებლის ნებართვა სჭირდება.",
    questionEn: "Is location shared automatically?",
    answerEn:
      "No. Browser-based location sharing requires the user's permission.",
  },
  {
    id: 25,
    category: "privacy",
    questionKa: "შემიძლია მოგვიანებით Privacy პარამეტრების შეცვლა?",
    answerKa:
      "დიახ. მხარდაჭერილი პარამეტრები პროფილის მართვის ნაწილიდან შეიძლება შეიცვალოს.",
    questionEn: "Can I change my privacy settings later?",
    answerEn:
      "Yes. Supported settings can be changed from the profile management area.",
  },

  {
    id: 26,
    category: "emergency",
    questionKa: "რა არის Emergency ID?",
    answerKa:
      "Emergency ID არის საგანგებო ინფორმაციის პროფილი, რომელიც შეიძლება შეიცავდეს მომხმარებლის მიერ ნებადართულ Emergency Contact-სა და მნიშვნელოვან ინფორმაციას.",
    questionEn: "What is Emergency ID?",
    answerEn:
      "Emergency ID is an emergency information profile that can contain user-approved emergency contact and important information.",
  },
  {
    id: 27,
    category: "emergency",
    questionKa: "Emergency ID ექიმს ცვლის?",
    answerKa:
      "არა. Emergency ID საინფორმაციო ინსტრუმენტია და არ ცვლის პროფესიულ სამედიცინო შეფასებას ან დახმარებას.",
    questionEn: "Does Emergency ID replace a doctor?",
    answerEn:
      "No. Emergency ID is an information tool and does not replace professional medical assessment or care.",
  },
  {
    id: 28,
    category: "emergency",
    questionKa: "შეიძლება Emergency Contact დავამატო?",
    answerKa:
      "დიახ. Emergency პროფილში შეიძლება არსებობდეს შესაბამისი საგანგებო კონტაქტის ველი.",
    questionEn: "Can I add an emergency contact?",
    answerEn:
      "Yes. An Emergency profile can include an appropriate emergency contact field.",
  },
  {
    id: 29,
    category: "emergency",
    questionKa: "შეიძლება ალერგიის ინფორმაცია დავამატო?",
    answerKa:
      "თუ შესაბამისი ველი ხელმისაწვდომია, მომხმარებელს შეუძლია მნიშვნელოვანი სამედიცინო ინფორმაციის მითითება.",
    questionEn: "Can I add allergy information?",
    answerEn:
      "When the relevant field is available, the user can provide important medical information.",
  },
  {
    id: 30,
    category: "emergency",
    questionKa: "Emergency QR-ს აპი სჭირდება?",
    answerKa:
      "არა. მიზანია QR პროფილი ჩვეულებრივი QR სკანირებით იყოს ხელმისაწვდომი.",
    questionEn: "Does Emergency QR require an app?",
    answerEn:
      "No. The goal is for the QR profile to be accessible through a standard QR scan.",
  },

  {
    id: 31,
    category: "products",
    questionKa: "რა ტიპის QR პროდუქტები იქნება?",
    answerKa:
      "დაგეგმილი კატეგორიები შეიძლება მოიცავდეს Pet Tag-ს, ნივთებისთვის QR Tag-ს და Emergency QR პროდუქტებს.",
    questionEn: "What types of QR products will be available?",
    answerEn:
      "Planned categories may include pet tags, QR tags for belongings, and Emergency QR products.",
  },
  {
    id: 32,
    category: "products",
    questionKa: "ძაღლისთვის QR ბრელოკი იქნება?",
    answerKa:
      "Pet კატეგორიაში შეიძლება გამოყენებულ იქნას საყელურზე დასამაგრებელი QR Tag.",
    questionEn: "Will there be a QR tag for dogs?",
    answerEn:
      "The pet category can use a QR tag designed to attach to a collar.",
  },
  {
    id: 33,
    category: "products",
    questionKa: "კატისთვისაც შეიძლება გამოყენება?",
    answerKa:
      "დიახ, შესაბამისი ზომისა და გამოყენების პირობების მქონე Pet QR Tag შეიძლება კატისთვისაც იყოს განკუთვნილი.",
    questionEn: "Can it be used for cats?",
    answerEn:
      "Yes. A suitably sized pet QR tag can also be intended for cats.",
  },
  {
    id: 34,
    category: "products",
    questionKa: "ჩემოდანზე შეიძლება QR RETURN-ის გამოყენება?",
    answerKa:
      "დიახ. Luggage პროფილი შეიძლება დაუკავშირდეს ჩემოდანზე განთავსებულ QR Tag-ს.",
    questionEn: "Can I use QR RETURN on luggage?",
    answerEn:
      "Yes. A luggage profile can be linked to a QR tag placed on a suitcase.",
  },
  {
    id: 35,
    category: "products",
    questionKa: "ფოტოები საიტზე რეალური პროდუქტის იქნება?",
    answerKa:
      "პროდუქტის საბოლოო ფოტოები შეიძლება დაემატოს პროდუქტის მზადყოფნის შემდეგ; საიტის სტრუქტურა შეიძლება წინასწარ მომზადდეს.",
    questionEn: "Will the website show real product photos?",
    answerEn:
      "Final product photos can be added when the products are ready while the website structure is prepared in advance.",
  },

  {
    id: 36,
    category: "account",
    questionKa: "ანგარიშის შექმნა აუცილებელია?",
    answerKa:
      "QR პროფილების მფლობელის მხრიდან მართვისთვის ანგარიში შეიძლება იყოს საჭირო, ხოლო მპოვნელს მხოლოდ QR-ის სკანირებისთვის ანგარიში არ სჭირდება.",
    questionEn: "Do I need an account?",
    answerEn:
      "An account may be required for an owner to manage QR profiles, while a finder does not need an account simply to scan a QR code.",
  },
  {
    id: 37,
    category: "account",
    questionKa: "ერთი ანგარიშიდან რამდენიმე ნივთის მართვა შეიძლება?",
    answerKa:
      "დიახ. სისტემა შეიძლება ერთ ანგარიშს რამდენიმე დაკავშირებული QR პროფილის მართვის საშუალებას აძლევდეს.",
    questionEn: "Can I manage several items from one account?",
    answerEn:
      "Yes. The system can allow one account to manage multiple linked QR profiles.",
  },
  {
    id: 38,
    category: "account",
    questionKa: "პროფილის ინფორმაციის შეცვლა შეიძლება?",
    answerKa:
      "დიახ. შესაბამისი Edit Profile ფუნქციიდან მხარდაჭერილი მონაცემების განახლება შეიძლება.",
    questionEn: "Can I edit profile information?",
    answerEn:
      "Yes. Supported information can be updated through the relevant Edit Profile function.",
  },
  {
    id: 39,
    category: "account",
    questionKa: "შემიძლია პროფილის ფოტოს შეცვლა?",
    answerKa:
      "თუ ფოტო ატვირთვის ფუნქცია ჩართულია შესაბამის პროფილზე, მისი განახლება შესაძლებელი იქნება.",
    questionEn: "Can I change a profile photo?",
    answerEn:
      "When photo upload is enabled for the relevant profile, it can be updated.",
  },
  {
    id: 40,
    category: "account",
    questionKa: "პაროლი თუ დამავიწყდა?",
    answerKa:
      "ანგარიშის სისტემაში დაგეგმილია პაროლის აღდგენის სტანდარტული პროცესი.",
    questionEn: "What if I forget my password?",
    answerEn:
      "The account system is intended to support a standard password recovery process.",
  },

  {
    id: 41,
    category: "orders",
    questionKa: "საიტიდან QR პროდუქტის ყიდვა შესაძლებელი იქნება?",
    answerKa:
      "QR RETURN-ის დაგეგმილ Store სისტემაში მომხმარებელს შეეძლება ხელმისაწვდომი პროდუქტების ნახვა და შეძენის პროცესის გავლა.",
    questionEn: "Will I be able to buy QR products on the website?",
    answerEn:
      "The planned QR RETURN Store is intended to let users browse available products and complete a purchase flow.",
  },
  {
    id: 42,
    category: "orders",
    questionKa: "შეკვეთის შემდეგ რა ხდება?",
    answerKa:
      "საბოლოო პროცესი მოიცავს შეკვეთის დადასტურებას, დამუშავებას და პროდუქტის ტიპის მიხედვით QR-ის აქტივაციის შესაბამის ნაბიჯს.",
    questionEn: "What happens after I order?",
    answerEn:
      "The final flow is intended to include order confirmation, processing, and an appropriate QR activation step depending on the product.",
  },
  {
    id: 43,
    category: "orders",
    questionKa: "Shipping-ის სტატუსის ნახვა შემეძლება?",
    answerKa:
      "Store-ის დაგეგმილ არქიტექტურაში My Orders და შეკვეთის სტატუსების მხარდაჭერაა გათვალისწინებული.",
    questionEn: "Will I be able to see shipping status?",
    answerEn:
      "The planned Store architecture includes support for My Orders and order statuses.",
  },
  {
    id: 44,
    category: "orders",
    questionKa: "რამდენიმე პროდუქტის ერთად ყიდვა შეიძლება?",
    answerKa:
      "Cart სისტემის დანერგვის შემდეგ შესაძლებელი იქნება მხარდაჭერილი პროდუქტებისა და რაოდენობების ერთ შეკვეთაში დამატება.",
    questionEn: "Can I buy several products together?",
    answerEn:
      "Once the Cart system is implemented, supported products and quantities can be added to one order.",
  },
  {
    id: 45,
    category: "orders",
    questionKa: "პროდუქტის მიღების შემდეგ QR როგორ დაუკავშირდება ჩემს ანგარიშს?",
    answerKa:
      "ამისთვის დაგეგმილია Activation პროცესი, რომელიც კონკრეტულ Tag Code-ს შესაბამის ანგარიშსა და პროფილს დაუკავშირებს.",
    questionEn: "How will the QR connect to my account after delivery?",
    answerEn:
      "A planned activation process will link the specific Tag Code to the appropriate account and profile.",
  },

  {
    id: 46,
    category: "support",
    questionKa: "თუ QR არ იხსნება, რა გავაკეთო?",
    answerKa:
      "ჯერ შეამოწმეთ ინტერნეტკავშირი და სცადეთ QR-ის ხელახლა დასკანერება. თუ პრობლემა გაგრძელდება, გამოიყენეთ QR RETURN Support.",
    questionEn: "What should I do if the QR does not open?",
    answerEn:
      "Check the internet connection and scan the QR again. If the problem continues, contact QR RETURN Support.",
  },
  {
    id: 47,
    category: "support",
    questionKa: "თუ QR დაზიანდა?",
    answerKa:
      "თუ კოდი აღარ იკითხება, შეიძლება საჭირო გახდეს QR პროდუქტის ან შესაბამისი კოდის ჩანაცვლება.",
    questionEn: "What if the QR code is damaged?",
    answerEn:
      "If the code can no longer be scanned, the QR product or associated code may need to be replaced.",
  },
  {
    id: 48,
    category: "support",
    questionKa: "Support-ს როგორ დავუკავშირდე?",
    answerKa:
      "ხელმისაწვდომობის მიხედვით Support-თან დაკავშირება შესაძლებელი იქნება საიტზე მითითებული Live Chat, ტელეფონის ან Email მეთოდებით.",
    questionEn: "How can I contact Support?",
    answerEn:
      "Depending on availability, Support can be reached through the Live Chat, phone, or email methods shown on the website.",
  },
  {
    id: 49,
    category: "support",
    questionKa: "შეიძლება Support-ს ფოტო გავუგზავნო?",
    answerKa:
      "თუ Support Chat-ში ფაილებისა და ფოტოების ატვირთვის ფუნქცია ჩართულია, შესაბამისი მასალის გაგზავნა შესაძლებელი იქნება.",
    questionEn: "Can I send a photo to Support?",
    answerEn:
      "When file and photo uploads are enabled in Support Chat, relevant material can be sent there.",
  },
  {
    id: 50,
    category: "support",
    questionKa: "FAQ-ში პასუხი თუ ვერ ვიპოვე?",
    answerKa:
      "შეგიძლიათ გამოიყენოთ Support-ის ხელმისაწვდომი საკონტაქტო მეთოდი და მოგვწეროთ კონკრეტული კითხვა.",
    questionEn: "What if I cannot find my answer in the FAQ?",
    answerEn:
      "You can use an available Support contact method and send your specific question.",
  },
];
