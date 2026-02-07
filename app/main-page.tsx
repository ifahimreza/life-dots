"use client";

import {useEffect, useMemo, useRef, useState} from "react";
import {useSearchParams} from "next/navigation";
import AppFooter from "../components/AppFooter";
import AppHeader from "../components/AppHeader";
import ExportModal from "../components/ExportModal";
import FlagIcon from "../components/FlagIcon";
import ProfileDrawer from "../components/ProfileDrawer";
import ProgressCard from "../components/ProgressCard";
import UpgradeModal from "../components/UpgradeModal";
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
  formatProgress,
  getViewTitle,
  getTranslations,
  resolveLanguageId,
  resolveLocale
} from "../libs/i18n";
import useDotMetrics from "../libs/useDotMetrics";
import {getViewState} from "../libs/views";
import {applyTheme, getTheme} from "../libs/themes";
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
  trustTitle: string;
  trustBody: string;
  trustPoints: string[];
  plusTitle: string;
  plusBody: string;
  plusItems: string[];
  faqTitle: string;
  faqItems: FaqItem[];
  resourcesTitle: string;
};

const LANDING_COPY: Record<Exclude<LanguageId, "default">, LandingCopy> = {
  en: {
    introTitle: "Your Life in Weeks",
    introBody:
      "DotSpan turns the idea of Your Life in Weeks into a clear weekly map. Each dot is one week, so your timeline is visible at a glance and your next step is easier to choose.",
    trustTitle: "Built for real use, not hype",
    trustBody:
      "DotSpan does not track your location or claim to optimize your life with hidden scoring. You set your profile, see your timeline, and decide what matters this week.",
    trustPoints: [
      "Simple input: country, birth date, and life expectancy baseline.",
      "Transparent output: passed weeks, remaining weeks, and completion percent.",
      "Private by default: account pages require login."
    ],
    plusTitle: "Why people upgrade to Plus",
    plusBody:
      "Plus is for users who want a cleaner print workflow and ready-to-export outputs.",
    plusItems: [
      "Print-ready export (save as PDF from print view)",
      "Ready-for-print editor (size, paper, colors, typography)",
      "Paper presets for Letter and A4",
      "Purchase restore from billing"
    ],
    faqTitle: "FAQ",
    faqItems: [
      {
        question: "Is DotSpan really based on Your Life in Weeks?",
        answer:
          "Yes. DotSpan applies the Your Life in Weeks concept in a practical format you can revisit each week."
      },
      {
        question: "Does DotSpan track where my time goes automatically?",
        answer:
          "No. DotSpan is not a passive tracker. It gives you a visual timeline so you can make intentional decisions."
      },
      {
        question: "What do I get with Plus?",
        answer:
          "Plus includes print-ready export, the print editor, and paper presets for print output."
      },
      {
        question: "Is my data private?",
        answer:
          "Yes. Private pages are protected by login."
      }
    ],
    resourcesTitle: "Resources"
  },
  es: {
    introTitle: "Your Life in Weeks",
    introBody:
      "DotSpan convierte Your Life in Weeks en un mapa semanal claro. Cada punto es una semana y te ayuda a decidir el siguiente paso con perspectiva.",
    trustTitle: "Hecho para uso real, sin exageración",
    trustBody:
      "DotSpan no rastrea tu ubicación ni usa métricas ocultas. Tú defines tus datos y ves una línea de tiempo clara para decidir mejor.",
    trustPoints: [
      "Entrada simple: país, fecha de nacimiento y base de esperanza de vida.",
      "Salida transparente: semanas vividas, semanas restantes y porcentaje.",
      "Privado por defecto: páginas de cuenta con login."
    ],
    plusTitle: "Por qué la gente mejora a Plus",
    plusBody:
      "Plus está pensado para quienes quieren un flujo de impresión claro y exportación limpia.",
    plusItems: [
      "Exportación lista para imprimir (guardar como PDF)",
      "Editor para impresión (tamaño, papel, color, tipografía)",
      "Preajustes de papel Letter y A4",
      "Restaurar compra desde facturación"
    ],
    faqTitle: "Preguntas frecuentes",
    faqItems: [
      {question: "¿Está basado en Your Life in Weeks?", answer: "Sí. DotSpan aplica ese concepto en un formato práctico para uso semanal."},
      {question: "¿DotSpan rastrea mi tiempo automáticamente?", answer: "No. DotSpan no es un rastreador pasivo; es una vista para tomar mejores decisiones."},
      {question: "¿Qué incluye Plus?", answer: "Exportación para impresión, editor de impresión y preajustes de papel."},
      {question: "¿Mis datos son privados?", answer: "Sí. Las páginas privadas requieren inicio de sesión."}
    ],
    resourcesTitle: "Recursos"
  },
  fr: {
    introTitle: "Your Life in Weeks",
    introBody:
      "DotSpan transforme Your Life in Weeks en une vue hebdomadaire claire. Chaque point représente une semaine pour mieux décider de la suite.",
    trustTitle: "Conçu pour un usage réel",
    trustBody:
      "DotSpan n’utilise pas de suivi caché. Vous renseignez vos données, puis vous obtenez une vue simple et transparente de votre timeline.",
    trustPoints: [
      "Entrée simple: pays, date de naissance, espérance de vie.",
      "Sortie claire: semaines passées, semaines restantes, progression.",
      "Privé par défaut: accès compte via authentification."
    ],
    plusTitle: "Pourquoi passer à Plus",
    plusBody:
      "Plus convient aux personnes qui veulent un flux d’impression propre et un export fiable.",
    plusItems: [
      "Export imprimable (enregistrer en PDF)",
      "Éditeur d’impression (taille, papier, couleurs, typographie)",
      "Préréglages papier Letter et A4",
      "Restauration d’achat depuis la facturation"
    ],
    faqTitle: "FAQ",
    faqItems: [
      {question: "DotSpan suit-il automatiquement mon temps ?", answer: "Non. DotSpan n’est pas un tracker passif; c’est une vue claire pour agir avec intention."},
      {question: "Mes données sont-elles privées ?", answer: "Oui. Les pages privées sont protégées par authentification."},
      {question: "Que comprend Plus ?", answer: "Export imprimable, éditeur d’impression et préréglages papier."}
    ],
    resourcesTitle: "Ressources"
  },
  ja: {
    introTitle: "Your Life in Weeks",
    introBody:
      "DotSpan は Your Life in Weeks の考え方を、毎週使える実用的な形にしたアプリです。1つのドットが1週間を表し、時間の見通しを明確にします。",
    trustTitle: "誇張しない、実用重視",
    trustBody:
      "DotSpan は自動で行動を監視するツールではありません。あなたが入力した情報をもとに、週単位の見通しをわかりやすく表示します。",
    trustPoints: [
      "入力はシンプル: 国・生年月日・平均寿命。",
      "出力は透明: 経過週、残り週、進捗率。",
      "非公開ページはログイン保護。"
    ],
    plusTitle: "Plus にアップグレードする理由",
    plusBody:
      "Plus は、印刷向けの編集と出力を重視するユーザー向けです。",
    plusItems: [
      "印刷向けエクスポート（PDF保存）",
      "印刷エディター（サイズ・用紙・色・文字）",
      "Letter/A4 プリセット",
      "課金画面から購入復元"
    ],
    faqTitle: "よくある質問",
    faqItems: [
      {question: "自動で時間を計測しますか？", answer: "いいえ。DotSpan は受動トラッカーではなく、意図的な選択を助ける可視化ツールです。"},
      {question: "データは非公開ですか？", answer: "はい。非公開ページはログインで保護されます。"},
      {question: "Plus で何が増えますか？", answer: "印刷向けエクスポート、印刷エディター、用紙プリセットです。"}
    ],
    resourcesTitle: "参考リンク"
  },
  hi: {
    introTitle: "Your Life in Weeks",
    introBody:
      "DotSpan, Your Life in Weeks को practical तरीके से दिखाता है। हर डॉट एक सप्ताह है, ताकि समय साफ़ दिखे और अगला कदम चुनना आसान हो।",
    trustTitle: "सच्चा और स्पष्ट अनुभव",
    trustBody:
      "DotSpan कोई hidden tracker नहीं है। आप अपना डेटा भरते हैं और ऐप आपको साफ़ weekly perspective देता है।",
    trustPoints: [
      "Simple input: देश, जन्म तिथि, life expectancy baseline.",
      "Transparent output: बीते सप्ताह, बाकी सप्ताह, प्रगति प्रतिशत.",
      "Private pages login से सुरक्षित।"
    ],
    plusTitle: "लोग Plus क्यों लेते हैं",
    plusBody:
      "Plus उन users के लिए है जो clean print workflow और export output चाहते हैं।",
    plusItems: [
      "Print-ready export (print view से PDF)",
      "Print editor (size, paper, background, font)",
      "Letter और A4 paper presets",
      "Billing से purchase restore"
    ],
    faqTitle: "सामान्य प्रश्न",
    faqItems: [
      {question: "क्या DotSpan समय खुद track करता है?", answer: "नहीं। यह passive tracker नहीं है; यह decision clarity के लिए visual timeline है।"},
      {question: "क्या डेटा प्राइवेट है?", answer: "हाँ, प्राइवेट पेज लॉगिन से सुरक्षित हैं।"},
      {question: "Plus में क्या मिलता है?", answer: "Print-ready export, print editor और paper presets।"}
    ],
    resourcesTitle: "संसाधन"
  },
  bn: {
    introTitle: "Your Life in Weeks",
    introBody:
      "DotSpan, Your Life in Weeks ধারণাকে বাস্তবভাবে ব্যবহারযোগ্য করে। প্রতিটি ডট একটি সপ্তাহ, তাই সময় দেখা ও সিদ্ধান্ত নেওয়া সহজ হয়।",
    trustTitle: "বাস্তব ব্যবহার, বাড়াবাড়ি নয়",
    trustBody:
      "DotSpan আপনার সময় গোপনে ট্র্যাক করে না। আপনি তথ্য দেন, অ্যাপ পরিষ্কারভাবে সাপ্তাহিক টাইমলাইন দেখায়।",
    trustPoints: [
      "সহজ ইনপুট: দেশ, জন্মতারিখ, আয়ু baseline।",
      "স্বচ্ছ আউটপুট: কেটে যাওয়া সপ্তাহ, বাকি সপ্তাহ, অগ্রগতি।",
      "প্রাইভেট পেজ লগইন-প্রটেক্টেড।"
    ],
    plusTitle: "কেন Plus নেন ব্যবহারকারীরা",
    plusBody:
      "Plus তাদের জন্য, যারা পরিষ্কার print workflow এবং ভালো export চান।",
    plusItems: [
      "Print-ready export (print view থেকে PDF)",
      "Print editor (size, paper, background, font)",
      "Letter ও A4 paper presets",
      "Billing থেকে purchase restore"
    ],
    faqTitle: "FAQ",
    faqItems: [
      {question: "DotSpan কি সময় নিজে ট্র্যাক করে?", answer: "না। এটি passive tracker নয়; সিদ্ধান্তের জন্য visual timeline টুল।"},
      {question: "ডাটা কি প্রাইভেট?", answer: "হ্যাঁ, প্রাইভেট পেজ লগইন দিয়ে সুরক্ষিত।"},
      {question: "Plus তে কী আছে?", answer: "Print-ready export, print editor ও paper presets।"}
    ],
    resourcesTitle: "রিসোর্স"
  }
};

export default function MainPage() {
  const {profileState, setProfileState, updateProfile, hasHydrated} = useProfileState();
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
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
    language
  } = profileState;
  const {
    name: draftName,
    country: draftCountry,
    dob: draftDob,
    lifeExpectancy: draftLifeExpectancy,
    hasCustomExpectancy: draftHasCustomExpectancy,
    dotStyle: draftDotStyle
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
  const activeTheme = useMemo(() => getTheme(), []);

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
    language
  ]);

  useEffect(() => {
    if (!hasHydrated) return;
    if (searchParams?.get("settings") === "1") {
      setIsModalOpen(true);
    }
    if (searchParams?.get("upgrade") === "1") {
      setIsUpgradeModalOpen(true);
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
      dotStyle: DEFAULT_PROFILE_STATE.dotStyle
    }));
  };

  const expectancy = clamp(lifeExpectancy, 1, 120);
  const viewState = useMemo(() => getViewState("weeks", dob, expectancy), [dob, expectancy]);
  const gridRows = Math.max(1, Math.ceil(viewState.totalUnits / viewState.perRow));
  const isMonthView = false;
  const gridMetrics = useDotMetrics(
    gridContainerRef,
    viewState.perRow,
    gridRows,
    1,
    viewState.fit ?? "both",
    viewState.maxDotSize,
    viewState.gapRatio
  );
  const viewTitle = getViewTitle(strings, "weeks");
  const columnStep = viewState.columnStep;
  const rowStep = viewState.rowStep;
  const isCompactView = false;

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
        language,
        viewMode: "weeks"
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

  const progressLabel = formatProgress(strings, "weeks", viewState.unitsPassed, viewState.totalUnits, resolvedLocale);
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
            onOpenUpgrade={() => {
              setIsUpgradeModalOpen(true);
            }}
            isSignedIn={Boolean(userId)}
            hasAccess={hasAccess}
            authEmail={authEmail}
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

      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        supabase={supabaseClient}
        userId={userId}
        email={authEmail}
        name={name}
        hasAccess={hasAccess}
        onSignIn={handleSignIn}
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
              <h2 className="mt-3 text-2xl font-semibold text-main sm:text-3xl">
                {landingCopy.trustTitle}
              </h2>
              <p className="mt-4 text-base leading-8 text-muted">
                {landingCopy.trustBody}
              </p>
              <ul className="mt-4 space-y-2 text-base leading-8 text-muted">
                {landingCopy.trustPoints.map((point) => (
                  <li key={point}>• {point}</li>
                ))}
              </ul>
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
                {landingCopy.plusTitle}
              </h2>
              <p className="mt-4 text-base leading-8 text-muted">{landingCopy.plusBody}</p>
              <ul className="mt-3 space-y-2 text-base leading-8 text-muted">
                {landingCopy.plusItems.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
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
        locale={resolvedLocale}
        countryOptions={countryOptions}
        dotStyleOptions={dotStyleOptions}
        strings={strings}
      />
    </main>
  );
}
