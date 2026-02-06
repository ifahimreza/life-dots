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
  downloadPdf: string;
  themeLabel: string;
  themeLockedTitle: string;
  themeLockedCta: string;
  accountLabel: string;
  accountSignedIn: string;
  accountPrompt: string;
  authLoading: string;
  signIn: string;
  signOut: string;
  proActive: string;
  proInactive: string;
  upgradeToPro: string;
  inspiredByPrefix: string;
  inspiredByTitle: string;
  inspiredBySuffix: string;
  dotStyleClassic: string;
  dotStyleRainbow: string;
  dotStyleLineBar: string;
  menuSoundLabel: string;
  menuSoundOff: string;
  menuSoundSoft: string;
  menuSoundBright: string;
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
    appTitle: "DotSpan",
    lifeInWeeks: "Life in Weeks",
    lifeInMonths: "Life in Months",
    lifeInYears: "Life in Years",
    weeksProgress: "Weeks: {current}/{total}",
    monthsProgress: "Months: {current}/{total}",
    yearsProgress: "Years: {current}/{total}",
    profileTitle: "Settings",
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
    settingsAria: "Open settings",
    xAriaLabel: "Fahim Reza on X",
    download: "Download",
    downloadPng: "Download PNG",
    downloadJpg: "Download JPG",
    downloadPdf: "Print PDF",
    themeLabel: "Theme",
    themeLockedTitle: "More themes are in Plus.",
    themeLockedCta: "Upgrade to unlock the theme pack.",
    accountLabel: "Account",
    accountSignedIn: "Signed in",
    accountPrompt: "Sign in to sync your profile and unlock Plus.",
    authLoading: "Checking session...",
    signIn: "Sign in with Google",
    signOut: "Sign out",
    proActive: "Plus active",
    proInactive: "Basic",
    upgradeToPro: "Upgrade to Plus",
    inspiredByPrefix: "Inspired by",
    inspiredByTitle: "Tim Urban’s “Your Life in Weeks”",
    inspiredBySuffix: "",
    dotStyleClassic: "Black Dot",
    dotStyleRainbow: "Rainbow Box",
    dotStyleLineBar: "Line Bar",
    menuSoundLabel: "Menu sound",
    menuSoundOff: "Off",
    menuSoundSoft: "Soft",
    menuSoundBright: "Bright",
    languageDefault: "Default (auto)",
    languageEnglish: "English",
    languageSpanish: "Spanish",
    languageFrench: "French",
    languageJapanese: "Japanese",
    languageHindi: "Hindi",
    languageBangla: "Bangla"
  },
  es: {
    appTitle: "DotSpan",
    lifeInWeeks: "La vida en semanas",
    lifeInMonths: "La vida en meses",
    lifeInYears: "La vida en años",
    weeksProgress: "Semanas: {current}/{total}",
    monthsProgress: "Meses: {current}/{total}",
    yearsProgress: "Años: {current}/{total}",
    profileTitle: "Ajustes",
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
    settingsAria: "Abrir ajustes",
    xAriaLabel: "Fahim Reza en X",
    download: "Descargar",
    downloadPng: "Descargar PNG",
    downloadJpg: "Descargar JPG",
    downloadPdf: "Imprimir PDF",
    themeLabel: "Tema",
    themeLockedTitle: "Hay más temas en Plus.",
    themeLockedCta: "Actualiza para desbloquear el paquete de temas.",
    accountLabel: "Cuenta",
    accountSignedIn: "Sesión iniciada",
    accountPrompt: "Inicia sesión para sincronizar tu perfil y desbloquear Plus.",
    authLoading: "Comprobando sesión...",
    signIn: "Iniciar con Google",
    signOut: "Cerrar sesión",
    proActive: "Plus activo",
    proInactive: "Básico",
    upgradeToPro: "Mejorar a Plus",
    inspiredByPrefix: "Inspirado en",
    inspiredByTitle: "“Tu vida en semanas” de Tim Urban",
    inspiredBySuffix: "",
    dotStyleClassic: "Black Dot",
    dotStyleRainbow: "Rainbow Box",
    dotStyleLineBar: "Line Bar",
    menuSoundLabel: "Sonido del menú",
    menuSoundOff: "Apagado",
    menuSoundSoft: "Suave",
    menuSoundBright: "Brillante",
    languageDefault: "Predeterminado (auto)",
    languageEnglish: "Inglés",
    languageSpanish: "Español",
    languageFrench: "Francés",
    languageJapanese: "Japonés",
    languageHindi: "Hindi",
    languageBangla: "Bangla"
  },
  fr: {
    appTitle: "DotSpan",
    lifeInWeeks: "La vie en semaines",
    lifeInMonths: "La vie en mois",
    lifeInYears: "La vie en années",
    weeksProgress: "Semaines : {current}/{total}",
    monthsProgress: "Mois : {current}/{total}",
    yearsProgress: "Années : {current}/{total}",
    profileTitle: "Paramètres",
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
    settingsAria: "Ouvrir les paramètres",
    xAriaLabel: "Fahim Reza sur X",
    download: "Télécharger",
    downloadPng: "Télécharger PNG",
    downloadJpg: "Télécharger JPG",
    downloadPdf: "Imprimer PDF",
    themeLabel: "Thème",
    themeLockedTitle: "Plus de thèmes sont dans Plus.",
    themeLockedCta: "Passez à Plus pour débloquer les thèmes.",
    accountLabel: "Compte",
    accountSignedIn: "Connecté",
    accountPrompt: "Connectez-vous pour synchroniser votre profil et débloquer Plus.",
    authLoading: "Vérification de la session…",
    signIn: "Se connecter avec Google",
    signOut: "Se déconnecter",
    proActive: "Plus actif",
    proInactive: "Essentiel",
    upgradeToPro: "Passer à Plus",
    inspiredByPrefix: "Inspiré par",
    inspiredByTitle: "« Votre vie en semaines » de Tim Urban",
    inspiredBySuffix: "",
    dotStyleClassic: "Black Dot",
    dotStyleRainbow: "Rainbow Box",
    dotStyleLineBar: "Line Bar",
    menuSoundLabel: "Son du menu",
    menuSoundOff: "Désactivé",
    menuSoundSoft: "Doux",
    menuSoundBright: "Brillant",
    languageDefault: "Par défaut (auto)",
    languageEnglish: "Anglais",
    languageSpanish: "Espagnol",
    languageFrench: "Français",
    languageJapanese: "Japonais",
    languageHindi: "Hindi",
    languageBangla: "Bangla"
  },
  ja: {
    appTitle: "DotSpan",
    lifeInWeeks: "人生を週で",
    lifeInMonths: "人生を月で",
    lifeInYears: "人生を年で",
    weeksProgress: "週: {current}/{total}",
    monthsProgress: "月: {current}/{total}",
    yearsProgress: "年: {current}/{total}",
    profileTitle: "設定",
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
    settingsAria: "設定を開く",
    xAriaLabel: "Fahim RezaのX",
    download: "ダウンロード",
    downloadPng: "PNGをダウンロード",
    downloadJpg: "JPGをダウンロード",
    downloadPdf: "PDFを印刷",
    themeLabel: "テーマ",
    themeLockedTitle: "追加テーマはPlusで利用できます。",
    themeLockedCta: "アップグレードしてテーマを利用できます。",
    accountLabel: "アカウント",
    accountSignedIn: "サインイン済み",
    accountPrompt: "サインインしてプロフィール同期とPlusを解除。",
    authLoading: "セッション確認中…",
    signIn: "Googleでサインイン",
    signOut: "サインアウト",
    proActive: "Plus有効",
    proInactive: "ベーシック",
    upgradeToPro: "Plusにアップグレード",
    inspiredByPrefix: "",
    inspiredByTitle: "Tim Urbanの「Your Life in Weeks」",
    inspiredBySuffix: "に着想",
    dotStyleClassic: "Black Dot",
    dotStyleRainbow: "Rainbow Box",
    dotStyleLineBar: "Line Bar",
    menuSoundLabel: "メニュー音",
    menuSoundOff: "オフ",
    menuSoundSoft: "ソフト",
    menuSoundBright: "ブライト",
    languageDefault: "既定（自動）",
    languageEnglish: "英語",
    languageSpanish: "スペイン語",
    languageFrench: "フランス語",
    languageJapanese: "日本語",
    languageHindi: "ヒンディー語",
    languageBangla: "ベンガル語"
  },
  hi: {
    appTitle: "DotSpan",
    lifeInWeeks: "सप्ताहों में जीवन",
    lifeInMonths: "महीनों में जीवन",
    lifeInYears: "वर्षों में जीवन",
    weeksProgress: "सप्ताह: {current}/{total}",
    monthsProgress: "महीने: {current}/{total}",
    yearsProgress: "वर्ष: {current}/{total}",
    profileTitle: "सेटिंग्स",
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
    settingsAria: "सेटिंग्स खोलें",
    xAriaLabel: "X पर Fahim Reza",
    download: "डाउनलोड",
    downloadPng: "PNG डाउनलोड करें",
    downloadJpg: "JPG डाउनलोड करें",
    downloadPdf: "PDF प्रिंट करें",
    themeLabel: "थीम",
    themeLockedTitle: "अधिक थीम Plus में उपलब्ध हैं।",
    themeLockedCta: "थीम पैक अनलॉक करने के लिए अपग्रेड करें।",
    accountLabel: "खाता",
    accountSignedIn: "साइन इन",
    accountPrompt: "प्रोफ़ाइल सिंक और Plus अनलॉक करने के लिए साइन इन करें।",
    authLoading: "सेशन जांच रहे हैं...",
    signIn: "Google से साइन इन",
    signOut: "साइन आउट",
    proActive: "Plus सक्रिय",
    proInactive: "बेसिक",
    upgradeToPro: "Plus में अपग्रेड करें",
    inspiredByPrefix: "",
    inspiredByTitle: "Tim Urban की “Your Life in Weeks”",
    inspiredBySuffix: "से प्रेरित",
    dotStyleClassic: "Black Dot",
    dotStyleRainbow: "Rainbow Box",
    dotStyleLineBar: "Line Bar",
    menuSoundLabel: "मेनू साउंड",
    menuSoundOff: "बंद",
    menuSoundSoft: "सॉफ्ट",
    menuSoundBright: "ब्राइट",
    languageDefault: "डिफ़ॉल्ट (ऑटो)",
    languageEnglish: "अंग्रेज़ी",
    languageSpanish: "स्पेनिश",
    languageFrench: "फ़्रेंच",
    languageJapanese: "जापानी",
    languageHindi: "हिन्दी",
    languageBangla: "बंगाली"
  },
  bn: {
    appTitle: "DotSpan",
    lifeInWeeks: "সপ্তাহে জীবন",
    lifeInMonths: "মাসে জীবন",
    lifeInYears: "বছরে জীবন",
    weeksProgress: "সপ্তাহ: {current}/{total}",
    monthsProgress: "মাস: {current}/{total}",
    yearsProgress: "বছর: {current}/{total}",
    profileTitle: "সেটিংস",
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
    settingsAria: "সেটিংস খুলুন",
    xAriaLabel: "X-এ Fahim Reza",
    download: "ডাউনলোড",
    downloadPng: "PNG ডাউনলোড করুন",
    downloadJpg: "JPG ডাউনলোড করুন",
    downloadPdf: "PDF প্রিন্ট করুন",
    themeLabel: "থিম",
    themeLockedTitle: "আরও থিম Plus-তে আছে।",
    themeLockedCta: "থিম প্যাক আনলক করতে আপগ্রেড করুন।",
    accountLabel: "অ্যাকাউন্ট",
    accountSignedIn: "সাইন ইন",
    accountPrompt: "প্রোফাইল সিঙ্ক ও Plus আনলক করতে সাইন ইন করুন।",
    authLoading: "সেশন যাচাই হচ্ছে...",
    signIn: "Google দিয়ে সাইন ইন",
    signOut: "সাইন আউট",
    proActive: "Plus সক্রিয়",
    proInactive: "বেসিক",
    upgradeToPro: "Plus-তে আপগ্রেড করুন",
    inspiredByPrefix: "",
    inspiredByTitle: "Tim Urban-এর “Your Life in Weeks”",
    inspiredBySuffix: "থেকে অনুপ্রাণিত",
    dotStyleClassic: "Black Dot",
    dotStyleRainbow: "Rainbow Box",
    dotStyleLineBar: "Line Bar",
    menuSoundLabel: "মেনু সাউন্ড",
    menuSoundOff: "বন্ধ",
    menuSoundSoft: "সফট",
    menuSoundBright: "উজ্জ্বল",
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

export function formatLocaleNumber(value: number, locale: string) {
  return new Intl.NumberFormat(locale).format(value);
}

export function formatLocalePercent(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: 0
  }).format(value / 100);
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
  total: number,
  locale: string
) {
  const template =
    mode === "months"
      ? strings.monthsProgress
      : mode === "years"
      ? strings.yearsProgress
      : strings.weeksProgress;
  return template
    .replace("{current}", formatLocaleNumber(current, locale))
    .replace("{total}", formatLocaleNumber(total, locale));
}

export function formatLifeExpectancy(strings: UiStrings, years: number, locale: string) {
  return strings.lifeExpectancyLabel.replace(
    "{years}",
    formatLocaleNumber(years, locale)
  );
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
    label:
      id === "classic"
        ? strings.dotStyleClassic
        : id === "rainbow"
        ? strings.dotStyleRainbow
        : strings.dotStyleLineBar
  }));
}

export function buildViewModeOptions(strings: UiStrings): SelectOption[] {
  return [
    {id: "weeks", label: strings.lifeInWeeks},
    {id: "months", label: strings.lifeInMonths},
    {id: "years", label: strings.lifeInYears}
  ];
}
