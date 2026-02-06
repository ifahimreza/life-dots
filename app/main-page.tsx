"use client";

import {useEffect, useMemo, useRef, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import AppFooter from "../components/AppFooter";
import AppHeader from "../components/AppHeader";
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
  formatLifeExpectancy,
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
  buildExportFilename,
  downloadCanvasAsJpg,
  downloadCanvasAsPng,
  openPrintWindow,
  renderCardToCanvas
} from "../libs/dotExport";
import {getFlagSvgUrl} from "../libs/flags";
import {
  DEFAULT_THEME_ID,
  applyTheme,
  buildThemeOptions,
  getTheme,
  THEMES
} from "../libs/themes";
import {useProfileState} from "../libs/useProfileState";
import {useDraftProfile} from "../libs/useDraftProfile";
import {toProfileState} from "../libs/profile";
import {useSupabaseAuth} from "../libs/useSupabaseAuth";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

type FaqItem = {question: string; answer: string};

type LandingCopy = {
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
    aboutLabel: "About life",
    aboutTitle: "DotSpan makes Your Life in Week simple to see",
    aboutBody:
      "DotSpan is a clear timeline for real life. You open it, see where your time goes, and choose your next step with less stress and better focus.",
    basicTitle: "Basic features",
    basicItems: [
      "Life in weeks, months, and years",
      "Country-based life expectancy baseline",
      "Localized language and number display",
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
          "DotSpan is a lightweight time perspective app inspired by the idea of Your Life in Week."
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
        question: "What do I get with Pro?",
        answer:
          "Pro includes premium themes, PDF print, weekly reminders, and share tools."
      }
    ],
    resourcesTitle: "Resources"
  },
  es: {
    aboutLabel: "Sobre la vida",
    aboutTitle: "DotSpan hace fácil ver Your Life in Week",
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
      {question: "¿Qué es DotSpan?", answer: "DotSpan es una app visual de perspectiva del tiempo inspirada en Your Life in Week."},
      {question: "¿Para quién es?", answer: "Para personas que quieren responsabilidad simple en su vida diaria."},
      {question: "¿Mis datos son privados?", answer: "Sí. Las páginas privadas requieren inicio de sesión."},
      {question: "¿Qué incluye Pro?", answer: "Temas premium, PDF, recordatorios semanales y enlaces para compartir."}
    ],
    resourcesTitle: "Recursos"
  },
  fr: {
    aboutLabel: "À propos de la vie",
    aboutTitle: "DotSpan rend Your Life in Week facile à visualiser",
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
      {question: "Qu’est-ce que DotSpan ?", answer: "DotSpan est une application visuelle inspirée par l’idée Your Life in Week."},
      {question: "À qui s’adresse DotSpan ?", answer: "Aux personnes qui veulent une responsabilisation simple et régulière."},
      {question: "Mes données sont-elles privées ?", answer: "Oui. Les pages privées sont protégées par authentification."},
      {question: "Que comprend Pro ?", answer: "Thèmes premium, PDF, rappels hebdomadaires et partage."}
    ],
    resourcesTitle: "Ressources"
  },
  ja: {
    aboutLabel: "人生について",
    aboutTitle: "DotSpan で Your Life in Week を直感的に見える化",
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
      {question: "DotSpan とは？", answer: "Your Life in Week の考え方に着想を得た、時間の可視化アプリです。"},
      {question: "誰向けですか？", answer: "日常でやさしい自己管理をしたい人向けです。"},
      {question: "データは非公開ですか？", answer: "はい。非公開ページはログインで保護されます。"},
      {question: "Pro で何が増えますか？", answer: "テーマ、PDF、週次リマインダー、共有機能です。"}
    ],
    resourcesTitle: "参考リンク"
  },
  hi: {
    aboutLabel: "जीवन के बारे में",
    aboutTitle: "DotSpan के साथ Your Life in Week को साफ़ देखें",
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
      {question: "DotSpan क्या है?", answer: "यह Your Life in Week विचार से प्रेरित समय-दृष्टि ऐप है।"},
      {question: "किसके लिए है?", answer: "उन लोगों के लिए जो आसान accountability चाहते हैं।"},
      {question: "क्या डेटा प्राइवेट है?", answer: "हाँ, प्राइवेट पेज लॉगिन से सुरक्षित हैं।"},
      {question: "Pro में क्या मिलता है?", answer: "प्रीमियम थीम, PDF, साप्ताहिक रिमाइंडर और शेयर टूल।"}
    ],
    resourcesTitle: "संसाधन"
  },
  bn: {
    aboutLabel: "জীবন সম্পর্কে",
    aboutTitle: "DotSpan দিয়ে Your Life in Week সহজে দেখুন",
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
      {question: "DotSpan কী?", answer: "Your Life in Week ধারণা থেকে তৈরি একটি টাইম পার্সপেক্টিভ অ্যাপ।"},
      {question: "কারা ব্যবহার করবে?", answer: "যারা সহজ accountability চান তাদের জন্য।"},
      {question: "ডাটা কি প্রাইভেট?", answer: "হ্যাঁ, প্রাইভেট পেজ লগইন দিয়ে সুরক্ষিত।"},
      {question: "Pro তে কী আছে?", answer: "প্রিমিয়াম থিম, PDF, সাপ্তাহিক রিমাইন্ডার ও শেয়ার টুল।"}
    ],
    resourcesTitle: "রিসোর্স"
  }
};

export default function MainPage() {
  const {profileState, setProfileState, updateProfile, hasHydrated} = useProfileState();
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
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
  const {draft, updateDraft} = useDraftProfile(profileState, isModalOpen);

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
    () => (hasAccess ? THEMES : [getTheme(DEFAULT_THEME_ID)]),
    [hasAccess]
  );
  const themeOptions = useMemo(
    () => buildThemeOptions(availableThemes, strings.themeLabel),
    [availableThemes, strings.themeLabel]
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
    if (hasAccess) return;
    if (themeId !== DEFAULT_THEME_ID) {
      updateProfile({themeId: DEFAULT_THEME_ID});
    }
  }, [hasAccess, themeId, updateProfile]);

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

  const flagCode = countryOption?.countryCode;
  const lifeExpectancyText = formatLifeExpectancy(
    strings,
    expectancy,
    resolvedLocale
  );
  const lifeExpectancyLine = lifeExpectancyText;
  const flagUrl = flagCode ? getFlagSvgUrl(flagCode) : "";
  const progressLabel = formatProgress(
    strings,
    viewMode,
    viewState.unitsPassed,
    viewState.totalUnits,
    resolvedLocale
  );
  const percentLabel = formatLocalePercent(viewState.percent, resolvedLocale);

  const handleDownloadPng = async () => {
    const canvas = await renderCardToCanvas({
      total: viewState.totalUnits,
      filled: viewState.unitsPassed,
      perRow: viewState.perRow,
      dotStyle,
      theme: activeTheme,
      dotSize: gridMetrics.dotSize,
      gap: gridMetrics.gap,
      title: viewTitle,
      weeksText: progressLabel,
      percentText: percentLabel,
      footerText: lifeExpectancyLine,
      footerFlagUrl: flagUrl,
      scale: 3
    });
    downloadCanvasAsPng(canvas, buildExportFilename(name, "png"));
  };

  const handleDownloadJpg = async () => {
    const canvas = await renderCardToCanvas({
      total: viewState.totalUnits,
      filled: viewState.unitsPassed,
      perRow: viewState.perRow,
      dotStyle,
      theme: activeTheme,
      dotSize: gridMetrics.dotSize,
      gap: gridMetrics.gap,
      title: viewTitle,
      weeksText: progressLabel,
      percentText: percentLabel,
      footerText: lifeExpectancyLine,
      footerFlagUrl: flagUrl,
      scale: 3
    });
    downloadCanvasAsJpg(canvas, buildExportFilename(name, "jpg"));
  };

  const handleDownloadPdf = async () => {
    const canvas = await renderCardToCanvas({
      total: viewState.totalUnits,
      filled: viewState.unitsPassed,
      perRow: viewState.perRow,
      dotStyle,
      theme: activeTheme,
      dotSize: gridMetrics.dotSize,
      gap: gridMetrics.gap,
      title: viewTitle,
      weeksText: progressLabel,
      percentText: percentLabel,
      footerText: lifeExpectancyLine,
      footerFlagUrl: flagUrl,
      scale: 4
    });
    const imageUrl = canvas.toDataURL("image/png");
    openPrintWindow(imageUrl, buildExportFilename(name, "pdf"), "letter");
  };

  const handleUpgrade = () => {
    router.push("/pro");
  };

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
            onDownloadPng={handleDownloadPng}
            onDownloadJpg={handleDownloadJpg}
            onDownloadPdf={hasAccess ? handleDownloadPdf : undefined}
            onProClick={handleUpgrade}
            strings={strings}
          />

          <div className="rounded-[28px] bg-gradient-to-br from-[#b8eb7c]/45 via-[#f7cd63]/40 to-[#fc8fc6]/40 p-2 sm:p-3">
            <ProgressCard
              progressLabel={progressLabel}
              percentLabel={percentLabel}
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
              footerText={lifeExpectancyLine}
              axisPadding={isMonthView ? GRID_AXIS_OFFSET : 0}
              showAxis={isMonthView}
            />
          </div>
        </div>
      </section>

      <section className="w-full bg-white py-12 sm:py-16">
        <div className="mx-auto w-full max-w-[760px] px-6 sm:px-8">
          <article className="space-y-14">
            <section>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-subtle">{landingCopy.aboutLabel}</p>
              <h2 className="mt-3 text-2xl font-semibold text-main sm:text-3xl">
                {landingCopy.aboutTitle}
              </h2>
              <p className="mt-4 text-base leading-8 text-muted">
                <strong className="text-main">DotSpan</strong> {landingCopy.aboutBody}
              </p>
              <p className="mt-3 text-base leading-8 text-muted">
                Built on the mindset of <strong className="text-main">Your Life in Week</strong>, the
                interface stays minimal so the message is easy to read and remember.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-main sm:text-3xl">{landingCopy.basicTitle}</h2>
              <ul className="mt-4 space-y-2 text-base leading-8 text-muted">
                {landingCopy.basicItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-main sm:text-3xl">{landingCopy.premiumTitle}</h2>
              <ul className="mt-4 space-y-2 text-base leading-8 text-muted">
                {landingCopy.premiumItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {!hasAccess ? (
                <button
                  type="button"
                  onClick={handleUpgrade}
                  className="mt-5 inline-flex items-center rounded-full bg-[#4e55e0] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#4048d3]"
                >
                  See Pro
                </button>
              ) : null}
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
                  className="text-[#4e55e0] underline underline-offset-4"
                >
                  Your Life in Weeks
                </a>
                <a
                  href="https://waitbutwhy.com/2013/08/putting-time-in-perspective.html"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#4e55e0] underline underline-offset-4"
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
        hasAccess={hasAccess}
        isAuthLoading={isAuthLoading}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        onUpgrade={handleUpgrade}
        onSave={handleSave}
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
