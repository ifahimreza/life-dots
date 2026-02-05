import {
  DOT_STYLE_IDS,
  LanguageId,
  SelectOption,
  SUPPORTED_LANGUAGES
} from "./lifeDotsData";

export type UiStrings = {
  appTitle: string;
  lifeInWeeks: string;
  lifeInMonths: string;
  lifeInYears: string;
  weeksProgress: string;
  monthsProgress: string;
  yearsProgress: string;
  profileTitle: string;
  profileSubtitle: string;
  nameLabel: string;
  countryLabel: string;
  dobLabel: string;
  lifeExpectancyLabel: string;
  dotStyleLabel: string;
  viewModeLabel: string;
  languageLabel: string;
  saveChanges: string;
  close: string;
  settingsAria: string;
  xAriaLabel: string;
  download: string;
  downloadPng: string;
  downloadJpg: string;
  printPdf: string;
  standardPrintSize: string;
  usLetter: string;
  a4: string;
  inspiredByPrefix: string;
  inspiredByTitle: string;
  inspiredBySuffix: string;
  dotStyleClassic: string;
  dotStyleRainbow: string;
  languageDefault: string;
  languageEnglish: string;
  languageSpanish: string;
  languageFrench: string;
  languageJapanese: string;
  languageHindi: string;
  languageBangla: string;
};

const TRANSLATIONS: Record<Exclude<LanguageId, "default">, UiStrings> = {
  en: {
    appTitle: "Life Dots",
    lifeInWeeks: "Life in Weeks",
    lifeInMonths: "Life in Months",
    lifeInYears: "Life in Years",
    weeksProgress: "Weeks: {current}/{total}",
    monthsProgress: "Months: {current}/{total}",
    yearsProgress: "Years: {current}/{total}",
    profileTitle: "Profile",
    profileSubtitle: "One field at a time.",
    nameLabel: "Name",
    countryLabel: "Country",
    dobLabel: "Date of birth",
    lifeExpectancyLabel: "Life Expectancy {years}/YEARS",
    dotStyleLabel: "Dot style",
    viewModeLabel: "View mode",
    languageLabel: "Language (beta)",
    saveChanges: "Save changes",
    close: "Close",
    settingsAria: "Open profile settings",
    xAriaLabel: "Fahim Reza on X",
    download: "Download",
    downloadPng: "Download PNG",
    downloadJpg: "Download JPG",
    printPdf: "Print / Save PDF",
    standardPrintSize: "Standard Print Size",
    usLetter: "US Letter",
    a4: "A4",
    inspiredByPrefix: "Inspired by",
    inspiredByTitle: "Tim Urban’s “Your Life in Weeks”",
    inspiredBySuffix: "",
    dotStyleClassic: "Classic black",
    dotStyleRainbow: "Rainbow box",
    languageDefault: "Default (auto)",
    languageEnglish: "English",
    languageSpanish: "Spanish",
    languageFrench: "French",
    languageJapanese: "Japanese",
    languageHindi: "Hindi",
    languageBangla: "Bangla"
  },
  es: {
    appTitle: "Life Dots",
    lifeInWeeks: "La vida en semanas",
    lifeInMonths: "La vida en meses",
    lifeInYears: "La vida en años",
    weeksProgress: "Semanas: {current}/{total}",
    monthsProgress: "Meses: {current}/{total}",
    yearsProgress: "Años: {current}/{total}",
    profileTitle: "Perfil",
    profileSubtitle: "Un campo a la vez.",
    nameLabel: "Nombre",
    countryLabel: "País",
    dobLabel: "Fecha de nacimiento",
    lifeExpectancyLabel: "Esperanza de vida {years} años",
    dotStyleLabel: "Estilo de puntos",
    viewModeLabel: "Modo de vista",
    languageLabel: "Idioma (beta)",
    saveChanges: "Guardar cambios",
    close: "Cerrar",
    settingsAria: "Abrir configuración del perfil",
    xAriaLabel: "Fahim Reza en X",
    download: "Descargar",
    downloadPng: "Descargar PNG",
    downloadJpg: "Descargar JPG",
    printPdf: "Imprimir / Guardar PDF",
    standardPrintSize: "Tamaño estándar de impresión",
    usLetter: "Carta (EE. UU.)",
    a4: "A4",
    inspiredByPrefix: "Inspirado en",
    inspiredByTitle: "“Tu vida en semanas” de Tim Urban",
    inspiredBySuffix: "",
    dotStyleClassic: "Clásico negro",
    dotStyleRainbow: "Caja arcoíris",
    languageDefault: "Predeterminado (auto)",
    languageEnglish: "Inglés",
    languageSpanish: "Español",
    languageFrench: "Francés",
    languageJapanese: "Japonés",
    languageHindi: "Hindi",
    languageBangla: "Bangla"
  },
  fr: {
    appTitle: "Life Dots",
    lifeInWeeks: "La vie en semaines",
    lifeInMonths: "La vie en mois",
    lifeInYears: "La vie en années",
    weeksProgress: "Semaines : {current}/{total}",
    monthsProgress: "Mois : {current}/{total}",
    yearsProgress: "Années : {current}/{total}",
    profileTitle: "Profil",
    profileSubtitle: "Un champ à la fois.",
    nameLabel: "Nom",
    countryLabel: "Pays",
    dobLabel: "Date de naissance",
    lifeExpectancyLabel: "Espérance de vie {years} ans",
    dotStyleLabel: "Style de points",
    viewModeLabel: "Mode d’affichage",
    languageLabel: "Langue (bêta)",
    saveChanges: "Enregistrer",
    close: "Fermer",
    settingsAria: "Ouvrir les paramètres du profil",
    xAriaLabel: "Fahim Reza sur X",
    download: "Télécharger",
    downloadPng: "Télécharger PNG",
    downloadJpg: "Télécharger JPG",
    printPdf: "Imprimer / Enregistrer PDF",
    standardPrintSize: "Taille d’impression standard",
    usLetter: "Lettre US",
    a4: "A4",
    inspiredByPrefix: "Inspiré par",
    inspiredByTitle: "« Votre vie en semaines » de Tim Urban",
    inspiredBySuffix: "",
    dotStyleClassic: "Classique noir",
    dotStyleRainbow: "Boîte arc-en-ciel",
    languageDefault: "Par défaut (auto)",
    languageEnglish: "Anglais",
    languageSpanish: "Espagnol",
    languageFrench: "Français",
    languageJapanese: "Japonais",
    languageHindi: "Hindi",
    languageBangla: "Bangla"
  },
  ja: {
    appTitle: "Life Dots",
    lifeInWeeks: "人生を週で",
    lifeInMonths: "人生を月で",
    lifeInYears: "人生を年で",
    weeksProgress: "週: {current}/{total}",
    monthsProgress: "月: {current}/{total}",
    yearsProgress: "年: {current}/{total}",
    profileTitle: "プロフィール",
    profileSubtitle: "一度に1項目ずつ。",
    nameLabel: "名前",
    countryLabel: "国",
    dobLabel: "生年月日",
    lifeExpectancyLabel: "平均寿命 {years}年",
    dotStyleLabel: "ドットのスタイル",
    viewModeLabel: "表示モード",
    languageLabel: "言語（ベータ）",
    saveChanges: "変更を保存",
    close: "閉じる",
    settingsAria: "プロフィール設定を開く",
    xAriaLabel: "Fahim RezaのX",
    download: "ダウンロード",
    downloadPng: "PNGをダウンロード",
    downloadJpg: "JPGをダウンロード",
    printPdf: "印刷 / PDF保存",
    standardPrintSize: "標準印刷サイズ",
    usLetter: "レター（米国）",
    a4: "A4",
    inspiredByPrefix: "",
    inspiredByTitle: "Tim Urbanの「Your Life in Weeks」",
    inspiredBySuffix: "に着想",
    dotStyleClassic: "クラシック（黒）",
    dotStyleRainbow: "レインボー",
    languageDefault: "既定（自動）",
    languageEnglish: "英語",
    languageSpanish: "スペイン語",
    languageFrench: "フランス語",
    languageJapanese: "日本語",
    languageHindi: "ヒンディー語",
    languageBangla: "ベンガル語"
  },
  hi: {
    appTitle: "Life Dots",
    lifeInWeeks: "सप्ताहों में जीवन",
    lifeInMonths: "महीनों में जीवन",
    lifeInYears: "वर्षों में जीवन",
    weeksProgress: "सप्ताह: {current}/{total}",
    monthsProgress: "महीने: {current}/{total}",
    yearsProgress: "वर्ष: {current}/{total}",
    profileTitle: "प्रोफ़ाइल",
    profileSubtitle: "एक समय में एक फ़ील्ड।",
    nameLabel: "नाम",
    countryLabel: "देश",
    dobLabel: "जन्म तिथि",
    lifeExpectancyLabel: "औसत आयु {years} वर्ष",
    dotStyleLabel: "डॉट शैली",
    viewModeLabel: "देखने का तरीका",
    languageLabel: "भाषा (बीटा)",
    saveChanges: "परिवर्तन सहेजें",
    close: "बंद करें",
    settingsAria: "प्रोफ़ाइल सेटिंग खोलें",
    xAriaLabel: "X पर Fahim Reza",
    download: "डाउनलोड",
    downloadPng: "PNG डाउनलोड करें",
    downloadJpg: "JPG डाउनलोड करें",
    printPdf: "प्रिंट / PDF सहेजें",
    standardPrintSize: "मानक प्रिंट आकार",
    usLetter: "यूएस लेटर",
    a4: "A4",
    inspiredByPrefix: "",
    inspiredByTitle: "Tim Urban की “Your Life in Weeks”",
    inspiredBySuffix: "से प्रेरित",
    dotStyleClassic: "क्लासिक काला",
    dotStyleRainbow: "रेनबो बॉक्स",
    languageDefault: "डिफ़ॉल्ट (ऑटो)",
    languageEnglish: "अंग्रेज़ी",
    languageSpanish: "स्पेनिश",
    languageFrench: "फ़्रेंच",
    languageJapanese: "जापानी",
    languageHindi: "हिन्दी",
    languageBangla: "बंगाली"
  },
  bn: {
    appTitle: "Life Dots",
    lifeInWeeks: "সপ্তাহে জীবন",
    lifeInMonths: "মাসে জীবন",
    lifeInYears: "বছরে জীবন",
    weeksProgress: "সপ্তাহ: {current}/{total}",
    monthsProgress: "মাস: {current}/{total}",
    yearsProgress: "বছর: {current}/{total}",
    profileTitle: "প্রোফাইল",
    profileSubtitle: "একবারে একটি ক্ষেত্র।",
    nameLabel: "নাম",
    countryLabel: "দেশ",
    dobLabel: "জন্মতারিখ",
    lifeExpectancyLabel: "গড় আয়ু {years} বছর",
    dotStyleLabel: "ডট স্টাইল",
    viewModeLabel: "ভিউ মোড",
    languageLabel: "ভাষা (বেটা)",
    saveChanges: "পরিবর্তন সংরক্ষণ করুন",
    close: "বন্ধ করুন",
    settingsAria: "প্রোফাইল সেটিংস খুলুন",
    xAriaLabel: "X-এ Fahim Reza",
    download: "ডাউনলোড",
    downloadPng: "PNG ডাউনলোড করুন",
    downloadJpg: "JPG ডাউনলোড করুন",
    printPdf: "প্রিন্ট / PDF সংরক্ষণ",
    standardPrintSize: "স্ট্যান্ডার্ড প্রিন্ট সাইজ",
    usLetter: "ইউএস লেটার",
    a4: "A4",
    inspiredByPrefix: "",
    inspiredByTitle: "Tim Urban-এর “Your Life in Weeks”",
    inspiredBySuffix: "থেকে অনুপ্রাণিত",
    dotStyleClassic: "ক্লাসিক কালো",
    dotStyleRainbow: "রেইনবো বক্স",
    languageDefault: "ডিফল্ট (অটো)",
    languageEnglish: "ইংরেজি",
    languageSpanish: "স্প্যানিশ",
    languageFrench: "ফরাসি",
    languageJapanese: "জাপানি",
    languageHindi: "হিন্দি",
    languageBangla: "বাংলা"
  }
};

function isSupportedLanguage(language: string): language is Exclude<LanguageId, "default"> {
  return (SUPPORTED_LANGUAGES as string[]).includes(language) && language !== "default";
}

export function resolveLanguageId(
  language: LanguageId,
  navigatorLanguage?: string
): Exclude<LanguageId, "default"> {
  if (language !== "default") return language;
  if (!navigatorLanguage) return "en";
  const normalized = navigatorLanguage.toLowerCase();
  const base = normalized.split("-")[0];
  return isSupportedLanguage(base) ? base : "en";
}

export function resolveLocale(language: LanguageId, navigatorLanguage?: string) {
  if (language === "default") {
    return navigatorLanguage || "en";
  }
  return language;
}

export function getTranslations(language: LanguageId, navigatorLanguage?: string) {
  const resolved = resolveLanguageId(language, navigatorLanguage);
  return TRANSLATIONS[resolved];
}

export function getViewTitle(strings: UiStrings, mode: "weeks" | "months" | "years") {
  if (mode === "months") return strings.lifeInMonths;
  if (mode === "years") return strings.lifeInYears;
  return strings.lifeInWeeks;
}

export function formatProgress(
  strings: UiStrings,
  mode: "weeks" | "months" | "years",
  current: number,
  total: number
) {
  const template =
    mode === "months"
      ? strings.monthsProgress
      : mode === "years"
      ? strings.yearsProgress
      : strings.weeksProgress;
  return template
    .replace("{current}", String(current))
    .replace("{total}", String(total));
}

export function formatLifeExpectancy(strings: UiStrings, years: number) {
  return strings.lifeExpectancyLabel.replace("{years}", String(years));
}

export function buildLanguageOptions(strings: UiStrings): SelectOption[] {
  return [
    {id: "default", label: strings.languageDefault},
    {id: "en", label: strings.languageEnglish},
    {id: "es", label: strings.languageSpanish},
    {id: "fr", label: strings.languageFrench},
    {id: "ja", label: strings.languageJapanese},
    {id: "hi", label: strings.languageHindi},
    {id: "bn", label: strings.languageBangla}
  ];
}

export function buildDotStyleOptions(strings: UiStrings): SelectOption[] {
  return DOT_STYLE_IDS.map((id) => ({
    id,
    label: id === "classic" ? strings.dotStyleClassic : strings.dotStyleRainbow
  }));
}

export function buildViewModeOptions(strings: UiStrings): SelectOption[] {
  return [
    {id: "weeks", label: strings.lifeInWeeks},
    {id: "months", label: strings.lifeInMonths},
    {id: "years", label: strings.lifeInYears}
  ];
}
