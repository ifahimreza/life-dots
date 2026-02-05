"use client";

import {useEffect, useMemo, useRef, useState} from "react";
import AppFooter from "../components/AppFooter";
import AppHeader from "../components/AppHeader";
import FlagIcon from "../components/FlagIcon";
import ProfileDrawer from "../components/ProfileDrawer";
import ProgressCard from "../components/ProgressCard";
import {
  CountryOption,
  DotStyle,
  LanguageId,
  Profile,
  ViewMode,
  LEGACY_STORAGE_KEYS,
  STORAGE_KEY,
  countryCodes,
  lifeExpectancyByCountry,
  GRID_AXIS_OFFSET
} from "../lib/lifeDotsData";
import {
  UiStrings,
  buildDotStyleOptions,
  buildLanguageOptions,
  buildViewModeOptions,
  formatProgress,
  getViewTitle,
  getTranslations,
  resolveLocale
} from "../lib/i18n";
import useDotMetrics from "../lib/useDotMetrics";
import {getViewState} from "../lib/views";
import {
  PrintSize,
  buildExportFilename,
  downloadCanvasAsJpg,
  downloadCanvasAsPng,
  renderCardToCanvas,
  writePrintDocument
} from "../lib/dotExport";
import {getFlagSvgUrl} from "../lib/flags";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function parseProfile(raw: string): Profile | null {
  try {
    return JSON.parse(raw) as Profile;
  } catch {
    return null;
  }
}

export default function Home() {
  const [name, setName] = useState("");
  const [country, setCountry] = useState<string>("");
  const [dob, setDob] = useState<Date | null>(null);
  const [lifeExpectancy, setLifeExpectancy] = useState(80);
  const [hasCustomExpectancy, setHasCustomExpectancy] = useState(false);
  const [dotStyle, setDotStyle] = useState<DotStyle>("classic");
  const [language, setLanguage] = useState<LanguageId>("default");
  const [draftName, setDraftName] = useState("");
  const [draftCountry, setDraftCountry] = useState<string>("");
  const [draftDob, setDraftDob] = useState<Date | null>(null);
  const [draftLifeExpectancy, setDraftLifeExpectancy] = useState(80);
  const [draftHasCustomExpectancy, setDraftHasCustomExpectancy] = useState(false);
  const [draftDotStyle, setDraftDotStyle] = useState<DotStyle>("classic");
  const [draftLanguage, setDraftLanguage] = useState<LanguageId>("default");
  const [draftViewMode, setDraftViewMode] = useState<ViewMode>("weeks");
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("weeks");
  const [printSize, setPrintSize] = useState<PrintSize>("letter");
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const onboardingKey = "life-dots-onboarded";

  const navigatorLanguage = typeof navigator !== "undefined" ? navigator.language : "en";
  const resolvedLocale = useMemo(
    () => resolveLocale(language, navigatorLanguage),
    [language, navigatorLanguage]
  );
  const strings = useMemo<UiStrings>(
    () => getTranslations(language, navigatorLanguage),
    [language, navigatorLanguage]
  );
  const languageOptions = useMemo(() => buildLanguageOptions(strings), [strings]);
  const dotStyleOptions = useMemo(() => buildDotStyleOptions(strings), [strings]);
  const viewModeOptions = useMemo(() => buildViewModeOptions(strings), [strings]);

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

  const persistProfile = (profile: Profile) => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  };

  const defaultProfile: Profile = {
    name: "",
    country: "",
    dob: "",
    lifeExpectancy: 80,
    hasCustomExpectancy: false,
    dotStyle: "classic",
    language: "default",
    viewMode: "weeks"
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    let stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      for (const legacyKey of LEGACY_STORAGE_KEYS) {
        const legacyValue = window.localStorage.getItem(legacyKey);
        if (legacyValue) {
          stored = legacyValue;
          window.localStorage.setItem(STORAGE_KEY, legacyValue);
          window.localStorage.removeItem(legacyKey);
          break;
        }
      }
    }
    const profile = stored ? parseProfile(stored) : null;
    const nextProfile = profile ?? defaultProfile;
    const storedCountry = nextProfile.country || "";
    const storedLanguage = (nextProfile.language ?? "default") as LanguageId;
    const storedViewMode = (nextProfile.viewMode ?? "weeks") as ViewMode;
    const storedExpectancy =
      typeof nextProfile.lifeExpectancy === "number" ? nextProfile.lifeExpectancy : undefined;
    const defaultExpectancy =
      storedCountry ? (lifeExpectancyByCountry[storedCountry] ?? 80) : 80;
    const inferredHasCustom =
      storedExpectancy !== undefined && storedExpectancy !== defaultExpectancy;
    const nextHasCustom =
      typeof nextProfile.hasCustomExpectancy === "boolean"
        ? nextProfile.hasCustomExpectancy
        : inferredHasCustom;
    setName(nextProfile.name || "");
    setCountry(storedCountry);
    setDob(nextProfile.dob ? new Date(nextProfile.dob) : null);
    if (storedExpectancy !== undefined) {
      setLifeExpectancy(storedExpectancy);
    }
    setHasCustomExpectancy(nextHasCustom);
    if (nextProfile.dotStyle) {
      setDotStyle(nextProfile.dotStyle);
    }
    setLanguage(storedLanguage);
    setViewMode(storedViewMode);
    persistProfile(nextProfile);
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!hasHydrated) return;
    const profile: Profile = {
      name,
      country,
      dob: dob ? dob.toISOString() : "",
      lifeExpectancy,
      hasCustomExpectancy,
      dotStyle,
      language,
      viewMode
    };
    persistProfile(profile);
  }, [
    name,
    country,
    dob,
    lifeExpectancy,
    dotStyle,
    hasCustomExpectancy,
    language,
    viewMode,
    hasHydrated
  ]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!hasHydrated) return;
    const hasOnboarded = window.localStorage.getItem(onboardingKey);
    if (!hasOnboarded) {
      setIsModalOpen(true);
      window.localStorage.setItem(onboardingKey, "1");
    }
  }, [hasHydrated]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("lang", resolvedLocale);
  }, [resolvedLocale]);

  const countryOption = countryOptions.find((option) => option.id === country);
  useEffect(() => {
    if (!hasCustomExpectancy) {
      setLifeExpectancy(countryOption?.expectancy ?? 80);
    }
  }, [countryOption?.expectancy, hasCustomExpectancy]);

  const draftCountryOption = countryOptions.find((option) => option.id === draftCountry);
  useEffect(() => {
    if (!draftHasCustomExpectancy) {
      setDraftLifeExpectancy(draftCountryOption?.expectancy ?? 80);
    }
  }, [draftCountryOption?.expectancy, draftHasCustomExpectancy]);

  useEffect(() => {
    if (!isModalOpen) return;
    setDraftName(name);
    setDraftCountry(country);
    setDraftDob(dob);
    setDraftLifeExpectancy(lifeExpectancy);
    setDraftHasCustomExpectancy(hasCustomExpectancy);
    setDraftDotStyle(dotStyle);
    setDraftLanguage(language);
    setDraftViewMode(viewMode);
  }, [
    isModalOpen,
    name,
    country,
    dob,
    lifeExpectancy,
    hasCustomExpectancy,
    dotStyle,
    language,
    viewMode
  ]);

  const handleSave = () => {
    const nextProfile: Profile = {
      name: draftName.trim(),
      country: draftCountry,
      dob: draftDob ? draftDob.toISOString() : "",
      lifeExpectancy: draftLifeExpectancy,
      hasCustomExpectancy: draftHasCustomExpectancy,
      dotStyle: draftDotStyle,
      language: draftLanguage,
      viewMode: draftViewMode
    };
    setName(nextProfile.name);
    setCountry(nextProfile.country);
    setDob(draftDob);
    setLifeExpectancy(nextProfile.lifeExpectancy ?? 80);
    setHasCustomExpectancy(nextProfile.hasCustomExpectancy ?? false);
    setDotStyle(nextProfile.dotStyle ?? "classic");
    setLanguage(nextProfile.language ?? "default");
    setViewMode(nextProfile.viewMode ?? "weeks");
    persistProfile(nextProfile);
    setHasHydrated(true);
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
    setDraftHasCustomExpectancy(false);
    setDraftCountry(value);
  };

  const handleDraftLifeExpectancyChange = (value: number) => {
    setDraftHasCustomExpectancy(true);
    setDraftLifeExpectancy(value);
  };

  const flagCode = countryOption?.countryCode;
  const lifeExpectancyText = strings.lifeExpectancyLabel.replace(
    "{years}",
    String(expectancy)
  );
  const lifeExpectancyLine = lifeExpectancyText;
  const flagUrl = flagCode ? getFlagSvgUrl(flagCode) : "";

  const handleDownloadPng = async () => {
    const canvas = await renderCardToCanvas({
      total: viewState.totalUnits,
      filled: viewState.unitsPassed,
      perRow: viewState.perRow,
      dotStyle,
      dotSize: gridMetrics.dotSize,
      gap: gridMetrics.gap,
      title: viewTitle,
      weeksText: formatProgress(
        strings,
        viewMode,
        viewState.unitsPassed,
        viewState.totalUnits
      ),
      percentText: `${viewState.percent}%`,
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
      dotSize: gridMetrics.dotSize,
      gap: gridMetrics.gap,
      title: viewTitle,
      weeksText: formatProgress(
        strings,
        viewMode,
        viewState.unitsPassed,
        viewState.totalUnits
      ),
      percentText: `${viewState.percent}%`,
      footerText: lifeExpectancyLine,
      footerFlagUrl: flagUrl,
      scale: 3,
      background: "#ffffff"
    });
    downloadCanvasAsJpg(canvas, buildExportFilename(name, "jpg"));
  };

  const handlePrintPdf = () => {
    const printWindow = window.open("", "_blank", "noopener,noreferrer");
    if (!printWindow) return;
    const title = name ? `${name} — ${strings.appTitle}` : strings.appTitle;
    void (async () => {
      const canvas = await renderCardToCanvas({
        total: viewState.totalUnits,
        filled: viewState.unitsPassed,
        perRow: viewState.perRow,
        dotStyle,
        dotSize: gridMetrics.dotSize,
        gap: gridMetrics.gap,
        title: viewTitle,
        weeksText: formatProgress(
          strings,
          viewMode,
          viewState.unitsPassed,
          viewState.totalUnits
        ),
        percentText: `${viewState.percent}%`,
        footerText: lifeExpectancyLine,
        footerFlagUrl: flagUrl,
        scale: 2
      });
      canvas.toBlob((blob) => {
        if (!blob) {
          writePrintDocument(printWindow, canvas.toDataURL("image/png"), title, printSize);
          return;
        }
        const url = URL.createObjectURL(blob);
        writePrintDocument(printWindow, url, title, printSize);
        printWindow.addEventListener(
          "afterprint",
          () => {
            URL.revokeObjectURL(url);
          },
          {once: true}
        );
      }, "image/png");
    })();
  };

  return (
    <main className="min-h-screen py-6 flex flex-col">
      <section className="mx-auto flex w-full max-w-[860px] flex-1 flex-col gap-4 px-6">
        <AppHeader
          title={strings.appTitle}
          onOpenSettings={() => setIsModalOpen(true)}
          onDownloadPng={handleDownloadPng}
          onDownloadJpg={handleDownloadJpg}
          onPrintPdf={handlePrintPdf}
          printSize={printSize}
          onPrintSizeChange={setPrintSize}
          strings={strings}
        />

        <ProgressCard
          progressLabel={formatProgress(
            strings,
            viewMode,
            viewState.unitsPassed,
            viewState.totalUnits
          )}
          percent={viewState.percent}
          isCompactView={isCompactView}
          isMonthView={isMonthView}
          gridContainerRef={gridContainerRef}
          total={viewState.totalUnits}
          filled={viewState.unitsPassed}
          dotStyle={dotStyle}
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
      </section>
      <AppFooter strings={strings} />

      <ProfileDrawer
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mounted={mounted}
        onSave={handleSave}
        draftName={draftName}
        onDraftNameChange={setDraftName}
        draftCountry={draftCountry}
        onDraftCountryChange={handleDraftCountryChange}
        draftDob={draftDob}
        onDraftDobChange={setDraftDob}
        draftLifeExpectancy={draftLifeExpectancy}
        onDraftLifeExpectancyChange={handleDraftLifeExpectancyChange}
        draftDotStyle={draftDotStyle}
        onDraftDotStyleChange={setDraftDotStyle}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        draftLanguage={draftLanguage}
        onDraftLanguageChange={setDraftLanguage}
        countryOptions={countryOptions}
        dotStyleOptions={dotStyleOptions}
        viewModeOptions={viewModeOptions}
        languageOptions={languageOptions}
        strings={strings}
      />
    </main>
  );
}
