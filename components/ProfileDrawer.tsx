import {Input} from "baseui/input";
import {Select} from "baseui/select";
import {DatePicker} from "baseui/datepicker";
import {Drawer} from "baseui/drawer";
import type {FormEvent} from "react";
import {
  CountryOption,
  DotStyle,
  LanguageId,
  SelectOption,
  ViewMode
} from "../libs/lifeDotsData";
import {DEFAULT_THEME_ID} from "../libs/themes";
import type {ThemeId} from "../libs/themes";
import type {UiStrings} from "../libs/i18n";

type ProfileDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  mounted: boolean;
  isSignedIn: boolean;
  authEmail: string | null;
  hasAccess: boolean;
  isAuthLoading: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
  onUpgrade?: () => void;
  onSave: () => void;
  draftName: string;
  onDraftNameChange: (value: string) => void;
  draftCountry: string;
  onDraftCountryChange: (value: string) => void;
  draftDob: Date | null;
  onDraftDobChange: (value: Date | null) => void;
  draftLifeExpectancy: number;
  onDraftLifeExpectancyChange: (value: number) => void;
  draftDotStyle: DotStyle;
  onDraftDotStyleChange: (value: DotStyle) => void;
  draftThemeId: ThemeId;
  onDraftThemeChange: (value: ThemeId) => void;
  viewMode: ViewMode;
  onViewModeChange: (value: ViewMode) => void;
  draftLanguage: LanguageId;
  onDraftLanguageChange: (value: LanguageId) => void;
  countryOptions: CountryOption[];
  dotStyleOptions: SelectOption[];
  themeOptions: SelectOption[];
  viewModeOptions: SelectOption[];
  languageOptions: SelectOption[];
  strings: UiStrings;
};

export default function ProfileDrawer({
  isOpen,
  onClose,
  mounted,
  isSignedIn,
  authEmail,
  hasAccess,
  isAuthLoading,
  onSignIn,
  onSignOut,
  onUpgrade,
  onSave,
  draftName,
  onDraftNameChange,
  draftCountry,
  onDraftCountryChange,
  draftDob,
  onDraftDobChange,
  draftLifeExpectancy,
  onDraftLifeExpectancyChange,
  draftDotStyle,
  onDraftDotStyleChange,
  draftThemeId,
  onDraftThemeChange,
  viewMode,
  onViewModeChange,
  draftLanguage,
  onDraftLanguageChange,
  countryOptions,
  dotStyleOptions,
  themeOptions,
  viewModeOptions,
  languageOptions,
  strings
}: ProfileDrawerProps) {
  const selectedCountry = countryOptions.find((option) => option.id === draftCountry);
  const baseExpectancy = selectedCountry?.expectancy;
  const rangePadding = 20;
  let minExpectancy = 1;
  let maxExpectancy = 120;
  if (typeof baseExpectancy === "number") {
    minExpectancy = Math.max(1, Math.round(baseExpectancy - rangePadding));
    maxExpectancy = Math.min(120, Math.round(baseExpectancy + rangePadding));
    if (draftLifeExpectancy < minExpectancy) {
      minExpectancy = Math.max(1, Math.floor(draftLifeExpectancy));
    }
    if (draftLifeExpectancy > maxExpectancy) {
      maxExpectancy = Math.min(120, Math.ceil(draftLifeExpectancy));
    }
  }

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      anchor="right"
      size="360px"
      animate
      autoFocus
      closeable
      showBackdrop
      overrides={{
        DrawerContainer: {
          style: {
            transitionDuration: "220ms",
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
            width: "100%",
            maxWidth: "100%",
            borderRadius: "0px",
            "@media screen and (min-width: 640px)": {
              width: "360px",
              maxWidth: "360px",
              borderRadius: "16px 0 0 16px"
            }
          }
        },
        DrawerBody: {
          style: {
            padding: 0
          }
        }
      }}
    >
      <div className="w-full px-4 pb-5 pt-4 sm:px-5">
        <form
          onSubmit={(event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            onSave();
          }}
          className="space-y-4"
        >
          <div className="rounded-2xl border border-surface bg-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-subtle">
                {strings.accountLabel}
              </h3>
              {hasAccess ? (
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  {strings.proActive}
                </span>
              ) : (
                <span className="rounded-full bg-neutral-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
                  {strings.proInactive}
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-muted">
              {isAuthLoading
                ? strings.authLoading
                : isSignedIn
                ? authEmail ?? strings.accountSignedIn
                : strings.accountPrompt}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {isSignedIn ? (
                <button
                  type="button"
                  onClick={onSignOut}
                  className="inline-flex items-center justify-center rounded-full border border-surface px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted transition hover:border-neutral-300 hover:text-neutral-900"
                >
                  {strings.signOut}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onSignIn}
                  className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-neutral-800"
                >
                  {strings.signIn}
                </button>
              )}
              {!hasAccess && onUpgrade ? (
                <button
                  type="button"
                  onClick={onUpgrade}
                  className="inline-flex items-center justify-center rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-neutral-800"
                >
                  {strings.upgradeToPro}
                </button>
              ) : null}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-main">
              {strings.profileTitle}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold text-muted transition hover:text-neutral-900"
            >
              {strings.close}
            </button>
          </div>
          <div className="grid gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                {strings.nameLabel}
              </label>
              <Input
                value={draftName}
                onChange={(event) =>
                  onDraftNameChange((event.target as HTMLInputElement).value)
                }
                placeholder={strings.nameLabel}
                clearable
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                {strings.countryLabel}
              </label>
              <Select
                options={countryOptions}
                value={countryOptions.filter((option) => option.id === draftCountry)}
                placeholder={strings.countryLabel}
                searchable
                clearable
                onChange={(params) =>
                  onDraftCountryChange((params.value[0]?.id as string) ?? "")
                }
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                {strings.dobLabel}
              </label>
              {mounted ? (
                <DatePicker
                  value={draftDob}
                  onChange={({date}) => {
                    const nextDate = Array.isArray(date) ? date[0] : (date as Date | null);
                    onDraftDobChange(nextDate ?? null);
                  }}
                  placeholder={strings.dobLabel}
                  minDate={new Date(1901, 0, 1)}
                  maxDate={new Date()}
                  overrides={{
                    Popover: {
                      props: {
                        overrides: {
                          Body: {
                            style: {
                              zIndex: 2000
                            }
                          }
                        }
                      }
                    }
                  }}
                />
              ) : (
                <Input value={draftDob ? draftDob.toISOString().split("T")[0] : ""} disabled />
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                {strings.lifeExpectancyLabel.replace(
                  "{years}",
                  String(draftLifeExpectancy)
                )}
              </label>
              <input
                type="range"
                min={minExpectancy}
                max={maxExpectancy}
                step={1}
                value={draftLifeExpectancy}
                onChange={(event) => onDraftLifeExpectancyChange(Number(event.target.value))}
                className="w-full accent-neutral-900"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                {strings.dotStyleLabel}
              </label>
              <Select
                options={dotStyleOptions}
                value={dotStyleOptions.filter((option) => option.id === draftDotStyle)}
                placeholder={strings.dotStyleLabel}
                clearable={false}
                onChange={(params) =>
                  onDraftDotStyleChange((params.value[0]?.id as DotStyle) ?? "classic")
                }
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                {strings.themeLabel}
              </label>
              {hasAccess ? (
                <Select
                  options={themeOptions}
                  value={themeOptions.filter((option) => option.id === draftThemeId)}
                  placeholder={strings.themeLabel}
                  clearable={false}
                  onChange={(params) =>
                    onDraftThemeChange((params.value[0]?.id as ThemeId) ?? DEFAULT_THEME_ID)
                  }
                />
              ) : (
                <div className="rounded-2xl border border-surface bg-white p-3 text-xs text-muted">
                  <p className="font-semibold text-main">{strings.themeLockedTitle}</p>
                  <p className="mt-1">{strings.themeLockedCta}</p>
                  {onUpgrade ? (
                    <button
                      type="button"
                      onClick={onUpgrade}
                      className="mt-3 inline-flex items-center justify-center rounded-full bg-neutral-900 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-neutral-800"
                    >
                      {strings.upgradeToPro}
                    </button>
                  ) : null}
                </div>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                {strings.viewModeLabel}
              </label>
              <Select
                options={viewModeOptions}
                value={viewModeOptions.filter((option) => option.id === viewMode)}
                placeholder={strings.viewModeLabel}
                clearable={false}
                onChange={(params) =>
                  onViewModeChange((params.value[0]?.id as ViewMode) ?? "weeks")
                }
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                {strings.languageLabel}
              </label>
              <Select
                options={languageOptions}
                value={languageOptions.filter((option) => option.id === draftLanguage)}
                placeholder={strings.languageLabel}
                clearable={false}
                onChange={(params) =>
                  onDraftLanguageChange((params.value[0]?.id as LanguageId) ?? "default")
                }
              />
            </div>
          </div>
          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={onSave}
              className="inline-flex w-full items-center justify-center rounded-full bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 sm:w-auto sm:py-2"
            >
              {strings.saveChanges}
            </button>
          </div>
        </form>
      </div>
    </Drawer>
  );
}
