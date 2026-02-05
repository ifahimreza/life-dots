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
} from "../lib/lifeDotsData";
import type {UiStrings} from "../lib/i18n";

type ProfileDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  mounted: boolean;
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
  viewMode: ViewMode;
  onViewModeChange: (value: ViewMode) => void;
  draftLanguage: LanguageId;
  onDraftLanguageChange: (value: LanguageId) => void;
  countryOptions: CountryOption[];
  dotStyleOptions: SelectOption[];
  viewModeOptions: SelectOption[];
  languageOptions: SelectOption[];
  strings: UiStrings;
};

export default function ProfileDrawer({
  isOpen,
  onClose,
  mounted,
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
  viewMode,
  onViewModeChange,
  draftLanguage,
  onDraftLanguageChange,
  countryOptions,
  dotStyleOptions,
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
      size="320px"
      animate
      autoFocus
      closeable
      showBackdrop
      overrides={{
        DrawerContainer: {
          style: {
            transitionDuration: "220ms",
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)"
          }
        },
        DrawerBody: {
          style: {
            padding: 0
          }
        }
      }}
    >
      <div className="w-full px-5 pb-5 pt-4">
        <form
          onSubmit={(event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            onSave();
          }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
              {strings.profileTitle}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold text-neutral-500 transition hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
            >
              {strings.close}
            </button>
          </div>
          <div className="grid gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
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
              <label className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
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
              <label className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
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
              <label className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
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
                className="w-full accent-neutral-900 dark:accent-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
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
              <label className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
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
              <label className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
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
              className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
            >
              {strings.saveChanges}
            </button>
          </div>
        </form>
      </div>
    </Drawer>
  );
}
