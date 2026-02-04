import {Input} from "baseui/input";
import {Select} from "baseui/select";
import {DatePicker} from "baseui/datepicker";
import {Drawer} from "baseui/drawer";
import type {FormEvent} from "react";
import {
  CountryOption,
  DotStyle,
  LanguageId,
  dotStyleOptions,
  languageOptions
} from "../lib/lifeDotsData";

type ProfileDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  mounted: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
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
  draftLanguage: LanguageId;
  onDraftLanguageChange: (value: LanguageId) => void;
  countryOptions: CountryOption[];
};

export default function ProfileDrawer({
  isOpen,
  onClose,
  mounted,
  onSubmit,
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
  draftLanguage,
  onDraftLanguageChange,
  countryOptions
}: ProfileDrawerProps) {
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
      overrides={{}}
    >
      <div className="w-full p-6">
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-semibold text-neutral-900 dark:text-white">
                Profile
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                One field at a time.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold text-neutral-500 transition hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
            >
              Close
            </button>
          </div>
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                Name
              </label>
              <Input
                value={draftName}
                onChange={(event) =>
                  onDraftNameChange((event.target as HTMLInputElement).value)
                }
                placeholder="Name"
                clearable
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                Country
              </label>
              <Select
                options={countryOptions}
                value={countryOptions.filter((option) => option.id === draftCountry)}
                placeholder="Country"
                searchable
                clearable
                onChange={(params) =>
                  onDraftCountryChange((params.value[0]?.id as string) ?? "")
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                Date of birth
              </label>
              {mounted ? (
                <DatePicker
                  value={draftDob}
                  onChange={({date}) => {
                    const nextDate = Array.isArray(date) ? date[0] : (date as Date | null);
                    onDraftDobChange(nextDate ?? null);
                  }}
                  placeholder="Date of birth"
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
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                Life expectancy ({draftLifeExpectancy} years)
              </label>
              <input
                type="range"
                min={1}
                max={120}
                step={1}
                value={draftLifeExpectancy}
                onChange={(event) => onDraftLifeExpectancyChange(Number(event.target.value))}
                className="w-full accent-neutral-900 dark:accent-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                Dot style
              </label>
              <Select
                options={dotStyleOptions}
                value={dotStyleOptions.filter((option) => option.id === draftDotStyle)}
                placeholder="Dot style"
                clearable={false}
                onChange={(params) =>
                  onDraftDotStyleChange((params.value[0]?.id as DotStyle) ?? "classic")
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                Language (beta)
              </label>
              <Select
                options={languageOptions}
                value={languageOptions.filter((option) => option.id === draftLanguage)}
                placeholder="Language"
                clearable={false}
                onChange={(params) =>
                onDraftLanguageChange((params.value[0]?.id as LanguageId) ?? "default")
              }
            />
          </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </Drawer>
  );
}
