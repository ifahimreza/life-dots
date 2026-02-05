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
  GRID_AXIS_OFFSET
} from "../libs/lifeDotsData";
import {countryCodes, lifeExpectancyByCountry} from "../data/countries";
import {
  UiStrings,
  buildDotStyleOptions,
  buildLanguageOptions,
  buildViewModeOptions,
  formatProgress,
  getViewTitle,
  getTranslations,
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
    language: draftLanguage,
    viewMode: draftViewMode
  } = draft;

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
  const availableThemes = useMemo(
    () => (hasAccess ? THEMES : [getTheme(DEFAULT_THEME_ID)]),
    [hasAccess]
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
      if (userId) {
        router.push("/dashboard");
      } else {
        setIsModalOpen(true);
      }
    }
  }, [hasHydrated, searchParams, userId, router]);

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
      theme: activeTheme,
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
      theme: activeTheme,
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
      weeksText: formatProgress(
        strings,
        viewMode,
        viewState.unitsPassed,
        viewState.totalUnits
      ),
      percentText: `${viewState.percent}%`,
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

  return (
    <main className="flex min-h-screen flex-col py-4 sm:py-6">
      <section className="mx-auto flex w-full max-w-[860px] flex-1 flex-col gap-4 px-4 sm:px-6">
        <AppHeader
          title={strings.appTitle}
          onOpenSettings={() => {
            if (userId) {
              router.push("/dashboard");
            } else {
              setIsModalOpen(true);
            }
          }}
          onDownloadPng={handleDownloadPng}
          onDownloadJpg={handleDownloadJpg}
          onDownloadPdf={hasAccess ? handleDownloadPdf : undefined}
          onProClick={handleUpgrade}
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
      </section>
      <AppFooter strings={strings} />

      {!userId ? (
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
          draftLanguage={draftLanguage}
          onDraftLanguageChange={(value) => updateDraft({language: value})}
          countryOptions={countryOptions}
          dotStyleOptions={dotStyleOptions}
          themeOptions={themeOptions}
          viewModeOptions={viewModeOptions}
          languageOptions={languageOptions}
          strings={strings}
        />
      ) : null}
    </main>
  );
}
