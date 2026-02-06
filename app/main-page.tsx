"use client";

import {useEffect, useMemo, useRef, useState} from "react";
import {useSearchParams} from "next/navigation";
import AppFooter from "../components/AppFooter";
import AppHeader from "../components/AppHeader";
import ExportModal from "../components/ExportModal";
import FlagIcon from "../components/FlagIcon";
import ProfileDrawer from "../components/ProfileDrawer";
import ProgressCard from "../components/ProgressCard";
import {
  CountryOption,
  GRID_AXIS_OFFSET,
  LanguageId
} from "../libs/lifeDotsData";
import {countryCodes, lifeExpectancyByCountry} from "../data/countries";
import {
  UiStrings,
  formatLocalePercent,
  buildDotStyleOptions,
  buildLanguageOptions,
  buildViewModeOptions,
  formatProgress,
  getViewTitle,
  getTranslations,
  resolveLanguageId,
  resolveLocale
} from "../libs/i18n";
import useDotMetrics from "../libs/useDotMetrics";
import {getViewState} from "../libs/views";
import {
  BASIC_THEME_IDS,
  DEFAULT_THEME_ID,
  applyTheme,
  getBasicThemes,
  buildThemeOptions,
  getTheme,
  THEMES
} from "../libs/themes";
import {useProfileState} from "../libs/useProfileState";
import {useDraftProfile} from "../libs/useDraftProfile";
import {DEFAULT_PROFILE_STATE, toProfileState} from "../libs/profile";
import {useSupabaseAuth} from "../libs/useSupabaseAuth";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

type FaqItem = {question: string; answer: string};

type LandingCopy = {
  introTitle: string;
  introBody: string;
  aboutLabel: string;
  aboutTitle: string;
  aboutBody: string;
  basicTitle: string;
  basicItems: string[];
  premiumTitle: string;
  premiumItems: string[];
  faqTitle: string;
  faqItems: FaqItem[];
  resourcesTitle: string;
};

const LANDING_COPY: Record<Exclude<LanguageId, "default">, LandingCopy> = {
  en: {
    introTitle: "Your Life in Weeks",
    introBody:
      "Your Life in Weeks turns abstract time into something you can see. DotSpan visualizes each week as a dot, so long-term decisions feel clearer and easier to act on.",
    aboutLabel: "Time in perspective",
    aboutTitle: "See your life timeline in one clean view",
    aboutBody:
      "Each dot represents one week. Filled dots show time already lived, and open dots show what remains based on your date of birth and selected life expectancy.",
    basicTitle: "Basic features",
    basicItems: [
      "Your Life in Weeks, months, and years views",
      "Country-based life expectancy baseline",
      "Localized language and number formatting",
      "Private dashboard with Google sign-in"
    ],
    premiumTitle: "Premium features",
    premiumItems: [
      "Premium themes and visual styles",
      "PDF print export for planning and reflection",
      "Weekly reminder workflow",
      "Public share links for social and messaging"
    ],
    faqTitle: "FAQ",
    faqItems: [
      {
        question: "What is DotSpan?",
        answer:
          "DotSpan is a lifestyle app that helps you visualize Your Life in Weeks and stay accountable to the time you have."
      },
      {
        question: "Who should use DotSpan?",
        answer:
          "Anyone who wants simple accountability, including creators, builders, and people focused on lifestyle and wellness."
      },
      {
        question: "Is my data private?",
        answer:
          "Yes. Private pages are protected by login. Public sharing only happens when you explicitly create a share link."
      },
      {
        question: "What do I get with Plus?",
        answer:
          "Plus includes premium themes, PDF print, weekly reminders, and share tools."
      }
    ],
    resourcesTitle: "Resources"
  },
  es: {
    introTitle: "Your Life in Weeks",
    introBody:
      "La idea es simple: si la vida se muestra en semanas, el tiempo se vuelve visible y más fácil de entender. DotSpan es nuestra versión práctica de esa perspectiva, inspirada en Tim Urban (Wait But Why).",
    aboutLabel: "Sobre la vida",
    aboutTitle: "DotSpan hace fácil ver Your Life in Weeks",
    aboutBody:
      "DotSpan es una línea de tiempo clara. Abres la app, ves dónde va tu tiempo y eliges tu siguiente paso con menos ruido.",
    basicTitle: "Funciones básicas",
    basicItems: [
      "Vida en semanas, meses y años",
      "Base de esperanza de vida por país",
      "Idiomas y números localizados",
      "Panel privado con Google"
    ],
    premiumTitle: "Funciones premium",
    premiumItems: [
      "Temas y estilos premium",
      "Exportación PDF para planificar",
      "Recordatorio semanal",
      "Enlaces públicos para compartir"
    ],
    faqTitle: "Preguntas frecuentes",
    faqItems: [
      {question: "¿Qué es DotSpan?", answer: "DotSpan es una app visual de perspectiva del tiempo inspirada en Your Life in Weeks."},
      {question: "¿Para quién es?", answer: "Para personas que quieren responsabilidad simple en su vida diaria."},
      {question: "¿Mis datos son privados?", answer: "Sí. Las páginas privadas requieren inicio de sesión."},
      {question: "¿Qué incluye Plus?", answer: "Temas premium, PDF, recordatorios semanales y enlaces para compartir."}
    ],
    resourcesTitle: "Recursos"
  },
  fr: {
    introTitle: "Your Life in Weeks",
    introBody:
      "L’idée est simple : si la vie est affichée en semaines, le temps devient visible et plus concret. DotSpan est notre version pratique de cette perspective, inspirée des écrits de Tim Urban (Wait But Why).",
    aboutLabel: "À propos de la vie",
    aboutTitle: "DotSpan rend Your Life in Weeks facile à visualiser",
    aboutBody:
      "DotSpan est une vue simple du temps. Vous voyez votre progression et décidez la prochaine action avec clarté.",
    basicTitle: "Fonctionnalités de base",
    basicItems: [
      "Vie en semaines, mois et années",
      "Base d’espérance de vie par pays",
      "Langues et nombres localisés",
      "Tableau privé avec Google"
    ],
    premiumTitle: "Fonctionnalités premium",
    premiumItems: [
      "Thèmes premium",
      "Export PDF imprimable",
      "Rappel hebdomadaire",
      "Liens publics de partage"
    ],
    faqTitle: "FAQ",
    faqItems: [
      {question: "Qu’est-ce que DotSpan ?", answer: "DotSpan est une application visuelle inspirée par l’idée Your Life in Weeks."},
      {question: "À qui s’adresse DotSpan ?", answer: "Aux personnes qui veulent une responsabilisation simple et régulière."},
      {question: "Mes données sont-elles privées ?", answer: "Oui. Les pages privées sont protégées par authentification."},
      {question: "Que comprend Plus ?", answer: "Thèmes premium, PDF, rappels hebdomadaires et partage."}
    ],
    resourcesTitle: "Ressources"
  },
  ja: {
    introTitle: "Your Life in Weeks",
    introBody:
      "考え方はシンプルです。人生を週単位で可視化すると、時間を直感的に理解しやすくなります。DotSpan は Tim Urban（Wait But Why）の発想に着想を得た実用版です。",
    aboutLabel: "人生について",
    aboutTitle: "DotSpan で Your Life in Weeks を直感的に見える化",
    aboutBody:
      "DotSpan は時間の見通しをシンプルにします。今どこにいるかが分かり、次の一歩を決めやすくなります。",
    basicTitle: "基本機能",
    basicItems: [
      "週・月・年の表示切替",
      "国別の平均寿命ベース",
      "言語と数字のローカライズ",
      "Google サインインの非公開ダッシュボード"
    ],
    premiumTitle: "プレミアム機能",
    premiumItems: [
      "プレミアムテーマ",
      "PDF印刷エクスポート",
      "週次リマインダー",
      "共有リンク"
    ],
    faqTitle: "よくある質問",
    faqItems: [
      {question: "DotSpan とは？", answer: "Your Life in Weeks の考え方に着想を得た、時間の可視化アプリです。"},
      {question: "誰向けですか？", answer: "日常でやさしい自己管理をしたい人向けです。"},
      {question: "データは非公開ですか？", answer: "はい。非公開ページはログインで保護されます。"},
      {question: "Plus で何が増えますか？", answer: "テーマ、PDF、週次リマインダー、共有機能です。"}
    ],
    resourcesTitle: "参考リンク"
  },
  hi: {
    introTitle: "Your Life in Weeks",
    introBody:
      "विचार सीधा है: जब जीवन को सप्ताहों में देखते हैं, समय साफ़ दिखता है और समझना आसान होता है। DotSpan उसी दृष्टिकोण का हमारा practical रूप है, जो Tim Urban (Wait But Why) से प्रेरित है।",
    aboutLabel: "जीवन के बारे में",
    aboutTitle: "DotSpan के साथ Your Life in Weeks को साफ़ देखें",
    aboutBody:
      "DotSpan समय को आसान बनाता है। आप तुरंत देख सकते हैं कि आप कहाँ हैं और अगला कदम क्या होना चाहिए।",
    basicTitle: "बेसिक फीचर्स",
    basicItems: [
      "सप्ताह, महीने और वर्ष व्यू",
      "देश के आधार पर आयु अनुमान",
      "लोकल भाषा और नंबर सपोर्ट",
      "Google लॉगिन के साथ प्राइवेट डैशबोर्ड"
    ],
    premiumTitle: "प्रीमियम फीचर्स",
    premiumItems: [
      "प्रीमियम थीम",
      "PDF प्रिंट एक्सपोर्ट",
      "साप्ताहिक रिमाइंडर",
      "पब्लिक शेयर लिंक"
    ],
    faqTitle: "सामान्य प्रश्न",
    faqItems: [
      {question: "DotSpan क्या है?", answer: "यह Your Life in Weeks विचार से प्रेरित समय-दृष्टि ऐप है।"},
      {question: "किसके लिए है?", answer: "उन लोगों के लिए जो आसान accountability चाहते हैं।"},
      {question: "क्या डेटा प्राइवेट है?", answer: "हाँ, प्राइवेट पेज लॉगिन से सुरक्षित हैं।"},
      {question: "Plus में क्या मिलता है?", answer: "प्रीमियम थीम, PDF, साप्ताहिक रिमाइंडर और शेयर टूल।"}
    ],
    resourcesTitle: "संसाधन"
  },
  bn: {
    introTitle: "Your Life in Weeks",
    introBody:
      "ধারণাটি সহজ: জীবনকে সপ্তাহে দেখালে সময় চোখে দেখা যায় এবং বোঝা সহজ হয়। DotSpan হলো সেই দৃষ্টিভঙ্গির আমাদের ব্যবহারযোগ্য সংস্করণ, Tim Urban (Wait But Why) থেকে অনুপ্রাণিত।",
    aboutLabel: "জীবন সম্পর্কে",
    aboutTitle: "DotSpan দিয়ে Your Life in Weeks সহজে দেখুন",
    aboutBody:
      "DotSpan সময়কে পরিষ্কারভাবে দেখায়। আপনি কোথায় আছেন বুঝে পরের পদক্ষেপ ঠিক করতে পারেন।",
    basicTitle: "বেসিক ফিচার",
    basicItems: [
      "সপ্তাহ, মাস ও বছর ভিউ",
      "দেশভিত্তিক আয়ু অনুমান",
      "লোকাল ভাষা ও নাম্বার সাপোর্ট",
      "Google লগইনসহ প্রাইভেট ড্যাশবোর্ড"
    ],
    premiumTitle: "প্রিমিয়াম ফিচার",
    premiumItems: [
      "প্রিমিয়াম থিম",
      "PDF প্রিন্ট এক্সপোর্ট",
      "সাপ্তাহিক রিমাইন্ডার",
      "পাবলিক শেয়ার লিংক"
    ],
    faqTitle: "FAQ",
    faqItems: [
      {question: "DotSpan কী?", answer: "Your Life in Weeks ধারণা থেকে তৈরি একটি টাইম পার্সপেক্টিভ অ্যাপ।"},
      {question: "কারা ব্যবহার করবে?", answer: "যারা সহজ accountability চান তাদের জন্য।"},
      {question: "ডাটা কি প্রাইভেট?", answer: "হ্যাঁ, প্রাইভেট পেজ লগইন দিয়ে সুরক্ষিত।"},
      {question: "Plus তে কী আছে?", answer: "প্রিমিয়াম থিম, PDF, সাপ্তাহিক রিমাইন্ডার ও শেয়ার টুল।"}
    ],
    resourcesTitle: "রিসোর্স"
  }
};

export default function MainPage() {
  const {profileState, setProfileState, updateProfile, hasHydrated} = useProfileState();
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const {
    supabase: supabaseClient,
    userId,
    email: authEmail,
    hasAccess,
    profile: remoteProfile,
    isLoading: isAuthLoading,
    profileLoaded,
    signInWithGoogle,
    signOut
  } = useSupabaseAuth({redirectPath: "/", fetchProfile: true});
  const {draft, setDraft, updateDraft} = useDraftProfile(profileState, isModalOpen);

  const {
    name,
    country,
    dob,
    profession,
    discovery,
    lifeExpectancy,
    hasCustomExpectancy,
    dotStyle,
    themeId,
    language,
    viewMode
  } = profileState;
  const {
    name: draftName,
    country: draftCountry,
    dob: draftDob,
    lifeExpectancy: draftLifeExpectancy,
    hasCustomExpectancy: draftHasCustomExpectancy,
    dotStyle: draftDotStyle,
    themeId: draftThemeId,
    viewMode: draftViewMode
  } = draft;

  const navigatorLanguage = typeof navigator !== "undefined" ? navigator.language : "en";
  const resolvedLocale = useMemo(
    () => resolveLocale(language, navigatorLanguage),
    [language, navigatorLanguage]
  );
  const contentLanguage = useMemo(
    () => resolveLanguageId(language, navigatorLanguage),
    [language, navigatorLanguage]
  );
  const strings = useMemo<UiStrings>(
    () => getTranslations(language, navigatorLanguage),
    [language, navigatorLanguage]
  );
  const landingCopy = useMemo(
    () => LANDING_COPY[contentLanguage] ?? LANDING_COPY.en,
    [contentLanguage]
  );
  const languageOptions = useMemo(() => buildLanguageOptions(strings), [strings]);
  const dotStyleOptions = useMemo(() => buildDotStyleOptions(strings), [strings]);
  const viewModeOptions = useMemo(() => buildViewModeOptions(strings), [strings]);
  const availableThemes = useMemo(
    () =>
      ["aurora", "sunset", "classic"]
        .map((id) => THEMES.find((theme) => theme.id === id))
        .filter((theme): theme is (typeof THEMES)[number] => Boolean(theme)),
    []
  );
  const themeOptions = useMemo(
    () => buildThemeOptions(availableThemes),
    [availableThemes]
  );
  const activeTheme = useMemo(() => getTheme(themeId), [themeId]);

  const countryOptions = useMemo<CountryOption[]>(() => {
    const formatter = new Intl.DisplayNames([resolvedLocale], {type: "region"});
    return countryCodes.map((code) => {
      const id = code.toLowerCase();
      const name = formatter.of(code) ?? code;
      return {
        label: (
          <span className="inline-flex items-center gap-2">
            <FlagIcon code={code} size={14} className="rounded-sm" />
            <span>{name}</span>
          </span>
        ),
        id,
        name,
        countryCode: code,
        expectancy: lifeExpectancyByCountry[id] ?? 80
      };
    });
  }, [resolvedLocale]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    applyTheme(activeTheme);
  }, [activeTheme]);

  useEffect(() => {
    if (!BASIC_THEME_IDS.includes(themeId)) {
      updateProfile({themeId: DEFAULT_THEME_ID});
    }
  }, [themeId, updateProfile]);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!userId) return;
    if (!profileLoaded) return;
    const timeout = window.setTimeout(() => {
      void syncProfileToSupabase(userId);
    }, 600);
    return () => window.clearTimeout(timeout);
  }, [
    hasHydrated,
    userId,
    profileLoaded,
    name,
    country,
    dob,
    lifeExpectancy,
    hasCustomExpectancy,
    dotStyle,
    themeId,
    language,
    viewMode
  ]);

  useEffect(() => {
    if (!hasHydrated) return;
    if (searchParams?.get("settings") === "1") {
      setIsModalOpen(true);
    }
  }, [hasHydrated, searchParams]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("lang", resolvedLocale);
  }, [resolvedLocale]);

  const countryOption = countryOptions.find((option) => option.id === country);
  useEffect(() => {
    if (!hasCustomExpectancy) {
      updateProfile({lifeExpectancy: countryOption?.expectancy ?? 80});
    }
  }, [countryOption?.expectancy, hasCustomExpectancy, updateProfile]);

  const draftCountryOption = countryOptions.find((option) => option.id === draftCountry);
  useEffect(() => {
    if (!draftHasCustomExpectancy) {
      updateDraft({lifeExpectancy: draftCountryOption?.expectancy ?? 80});
    }
  }, [draftCountryOption?.expectancy, draftHasCustomExpectancy, updateDraft]);

  const handleSave = () => {
    setProfileState({
      ...draft,
      name: draftName.trim()
    });
    setIsModalOpen(false);
  };

  const handleResetDraft = () => {
    setDraft((prev) => ({
      ...prev,
      name: DEFAULT_PROFILE_STATE.name,
      country: DEFAULT_PROFILE_STATE.country,
      dob: DEFAULT_PROFILE_STATE.dob,
      lifeExpectancy: DEFAULT_PROFILE_STATE.lifeExpectancy,
      hasCustomExpectancy: DEFAULT_PROFILE_STATE.hasCustomExpectancy,
      dotStyle: DEFAULT_PROFILE_STATE.dotStyle,
      themeId: DEFAULT_PROFILE_STATE.themeId,
      viewMode: DEFAULT_PROFILE_STATE.viewMode
    }));
  };

  const expectancy = clamp(lifeExpectancy, 1, 120);
  const viewState = useMemo(
    () => getViewState(viewMode, dob, expectancy),
    [dob, expectancy, viewMode]
  );
  const gridRows = Math.max(1, Math.ceil(viewState.totalUnits / viewState.perRow));
  const isMonthView = viewMode === "months";
  const gridMetrics = useDotMetrics(
    gridContainerRef,
    viewState.perRow,
    gridRows,
    1,
    viewState.fit ?? "both",
    viewState.maxDotSize,
    viewState.gapRatio
  );
  const viewTitle = getViewTitle(strings, viewMode);
  const columnStep = viewState.columnStep;
  const rowStep = viewState.rowStep;
  const isCompactView = viewMode !== "weeks";

  const handleDraftCountryChange = (value: string) => {
    updateDraft({country: value, hasCustomExpectancy: false});
  };

  const handleDraftLifeExpectancyChange = (value: number) => {
    updateDraft({lifeExpectancy: value, hasCustomExpectancy: true});
  };

  const isLocalProfileEmpty = () => !name && !country && !dob;

  useEffect(() => {
    if (!remoteProfile) return;
    if (isLocalProfileEmpty()) {
      setProfileState(toProfileState(remoteProfile));
    }
  }, [remoteProfile, setProfileState]);

  const syncProfileToSupabase = async (userId: string) => {
    if (!supabaseClient) return;
    const payload = {
      id: userId,
      name: name || null,
      email: authEmail || null,
      profile: {
        name,
        country,
        dob: dob ? dob.toISOString() : "",
        profession,
        discovery,
        lifeExpectancy,
        hasCustomExpectancy,
        dotStyle,
        themeId,
        language,
        viewMode
      }
    };
    await supabaseClient.from("profiles").upsert(payload, {onConflict: "id"});
  };

  const handleSignIn = async () => {
    await signInWithGoogle();
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const progressLabel = formatProgress(
    strings,
    viewMode,
    viewState.unitsPassed,
    viewState.totalUnits,
    resolvedLocale
  );
  const percentLabel = formatLocalePercent(viewState.percent, resolvedLocale);

  const faqItems = useMemo(
    () => landingCopy.faqItems,
    [landingCopy]
  );

  const faqSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer
        }
      }))
    }),
    [faqItems]
  );

  return (
    <main className="flex min-h-screen flex-col">
      <section className="w-full py-4 sm:py-6">
        <div className="mx-auto flex w-full max-w-[860px] flex-col gap-4 px-4 sm:px-6">
          <AppHeader
            title={strings.appTitle}
            onOpenSettings={() => {
              setIsModalOpen(true);
            }}
            isSignedIn={Boolean(userId)}
            hasAccess={hasAccess}
            authEmail={authEmail}
            themeId={themeId}
            strings={strings}
          />

          <div className="rounded-[28px] bg-white p-2 sm:p-3">
            <ProgressCard
              progressLabel={progressLabel}
              percentLabel={percentLabel}
              onOpenExport={() => setIsExportModalOpen(true)}
              strings={strings}
              isCompactView={isCompactView}
              isMonthView={isMonthView}
              gridContainerRef={gridContainerRef}
              total={viewState.totalUnits}
              filled={viewState.unitsPassed}
              dotStyle={dotStyle}
              theme={activeTheme}
              perRow={viewState.perRow}
              dotSize={gridMetrics.dotSize}
              gap={gridMetrics.gap}
              columnStep={columnStep}
              rowStep={rowStep}
              name={name}
              viewTitle={viewTitle}
              axisPadding={isMonthView ? GRID_AXIS_OFFSET : 0}
              showAxis={isMonthView}
            />
          </div>
        </div>
      </section>

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        hasAccess={hasAccess}
        name={name}
        total={viewState.totalUnits}
        filled={viewState.unitsPassed}
        perRow={viewState.perRow}
        dotStyle={dotStyle}
        theme={activeTheme}
        dotSize={gridMetrics.dotSize}
        gap={gridMetrics.gap}
        title={viewTitle}
        weeksText={progressLabel}
        percentText={percentLabel}
      />

      <section className="w-full bg-white py-12 sm:py-16">
        <div className="mx-auto w-full max-w-[760px] px-6 sm:px-8">
          <article className="space-y-14">
            <section>
              <h2 className="text-2xl font-semibold text-main sm:text-3xl">
                {landingCopy.introTitle}
              </h2>
              <p className="mt-4 text-base leading-8 text-muted">
                {landingCopy.introBody}
              </p>
            </section>

            <section>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-subtle">{landingCopy.aboutLabel}</p>
              <h2 className="mt-3 text-2xl font-semibold text-main sm:text-3xl">
                {landingCopy.aboutTitle}
              </h2>
              <p className="mt-4 text-base leading-8 text-muted">
                {landingCopy.aboutBody}
              </p>
              <p className="mt-3 text-base leading-8 text-muted">
                DotSpan is inspired by Tim Urban&rsquo;s <strong className="text-main">Your Life in Weeks</strong>,
                with a minimal interface designed for focus, reflection, and better planning.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-main sm:text-3xl">
                Life moves one week at a time
              </h2>
              <p className="mt-4 text-base leading-8 text-muted">
                Most people plan in years but live in days. The dot view bridges that gap. You can
                see long-term direction while still making small weekly choices.
              </p>
              <p className="mt-3 text-base leading-8 text-muted">
                Instead of vague pressure, you get a concrete timeline: where you are now, what is
                still ahead, and what deserves attention this week.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-main sm:text-3xl">
                A simple weekly reset
              </h2>
              <ul className="mt-4 space-y-2 text-base leading-8 text-muted">
                <li>Look at your timeline for 60 seconds before planning your week.</li>
                <li>Choose one meaningful action for health, work, and relationships.</li>
                <li>Close the week with a short reflection on what actually mattered.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-main sm:text-3xl">
                Weekly reflection prompts
              </h2>
              <ul className="mt-4 space-y-2 text-base leading-8 text-muted">
                <li>What am I postponing that would improve my life if done this week?</li>
                <li>Where am I spending time by default instead of by intention?</li>
                <li>What is one small change that future me will thank me for?</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-main sm:text-3xl">{landingCopy.faqTitle}</h2>
              <div className="mt-5 divide-y divide-surface border-y border-surface">
                {faqItems.map((item) => (
                  <article key={item.question} className="py-5">
                    <h3 className="text-base font-semibold text-main">{item.question}</h3>
                    <p className="mt-2 text-base leading-7 text-muted">{item.answer}</p>
                  </article>
                ))}
              </div>
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{__html: JSON.stringify(faqSchema)}}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-main sm:text-3xl">{landingCopy.resourcesTitle}</h2>
              <div className="mt-4 grid gap-2 text-base">
                <a
                  href="https://waitbutwhy.com/2014/05/life-weeks.html"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#00c565] underline underline-offset-4"
                >
                  Your Life in Weeks
                </a>
                <a
                  href="https://waitbutwhy.com/2013/08/putting-time-in-perspective.html"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#00c565] underline underline-offset-4"
                >
                  Putting Time in Perspective
                </a>
              </div>
            </section>
          </article>
        </div>
      </section>
      <AppFooter
        strings={strings}
        languageOptions={languageOptions}
        languageValue={language}
        onLanguageChange={(value) => updateProfile({language: value})}
      />

      <ProfileDrawer
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mounted={mounted}
        isSignedIn={Boolean(userId)}
        authEmail={authEmail}
        isAuthLoading={isAuthLoading}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        onSave={handleSave}
        onReset={handleResetDraft}
        draftName={draftName}
        onDraftNameChange={(value) => updateDraft({name: value})}
        draftCountry={draftCountry}
        onDraftCountryChange={handleDraftCountryChange}
        draftDob={draftDob}
        onDraftDobChange={(value) => updateDraft({dob: value})}
        draftLifeExpectancy={draftLifeExpectancy}
        onDraftLifeExpectancyChange={handleDraftLifeExpectancyChange}
        draftDotStyle={draftDotStyle}
        onDraftDotStyleChange={(value) => updateDraft({dotStyle: value})}
        draftThemeId={draftThemeId}
        onDraftThemeChange={(value) => updateDraft({themeId: value})}
        viewMode={draftViewMode}
        onViewModeChange={(value) => updateDraft({viewMode: value})}
        locale={resolvedLocale}
        countryOptions={countryOptions}
        dotStyleOptions={dotStyleOptions}
        themeOptions={themeOptions}
        viewModeOptions={viewModeOptions}
        strings={strings}
      />
    </main>
  );
}
