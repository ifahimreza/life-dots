import {Input} from "baseui/input";
import {Select} from "baseui/select";
import {DatePicker} from "baseui/datepicker";
import {Drawer} from "baseui/drawer";
import type {FormEvent} from "react";
import {useEffect, useMemo, useState} from "react";
import {
  CountryOption,
  DotStyle,
  SelectOption
} from "../libs/lifeDotsData";
import {formatLifeExpectancy, type UiStrings} from "../libs/i18n";
import {getMenuSoundMode, setMenuSoundMode, type MenuSoundMode} from "../libs/hoverSound";

type ProfileDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  mounted: boolean;
  isSignedIn: boolean;
  authEmail: string | null;
  isAuthLoading: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
  onSave: () => void;
  onReset: () => void;
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
  locale: string;
  countryOptions: CountryOption[];
  dotStyleOptions: SelectOption[];
  strings: UiStrings;
};

export default function ProfileDrawer({
  isOpen,
  onClose,
  mounted,
  isSignedIn,
  authEmail,
  isAuthLoading,
  onSignIn,
  onSignOut,
  onSave,
  onReset,
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
  locale,
  countryOptions,
  dotStyleOptions,
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

  const [menuSound, setMenuSound] = useState<MenuSoundMode>("soft");
  useEffect(() => {
    setMenuSound(getMenuSoundMode());
  }, []);

  const menuSoundOptions = useMemo(
    () => [
      {id: "off", label: strings.menuSoundOff},
      {id: "soft", label: strings.menuSoundSoft},
      {id: "bright", label: strings.menuSoundBright}
    ],
    [strings.menuSoundBright, strings.menuSoundOff, strings.menuSoundSoft]
  );

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
                size="compact"
                overrides={{
                  Root: {
                    style: {
                      backgroundColor: "transparent",
                      borderColor: "rgba(15, 23, 42, 0.12)",
                      borderTopLeftRadius: "14px",
                      borderTopRightRadius: "14px",
                      borderBottomLeftRadius: "14px",
                      borderBottomRightRadius: "14px"
                    }
                  },
                  Input: {
                    style: {
                      fontSize: "13px",
                      paddingLeft: "12px",
                      paddingRight: "12px",
                      paddingTop: "10px",
                      paddingBottom: "10px",
                      color: "#0f172a"
                    }
                  },
                  ClearIcon: {
                    style: {color: "#94a3b8"}
                  }
                }}
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
                size="compact"
                onChange={(params) =>
                  onDraftCountryChange((params.value[0]?.id as string) ?? "")
                }
                overrides={{
                  ControlContainer: {
                    style: {
                      minHeight: "40px",
                      borderTopLeftRadius: "14px",
                      borderTopRightRadius: "14px",
                      borderBottomLeftRadius: "14px",
                      borderBottomRightRadius: "14px",
                      backgroundColor: "transparent",
                      borderColor: "rgba(15, 23, 42, 0.12)",
                      boxShadow: "none"
                    }
                  },
                  Input: {
                    style: {fontSize: "13px"}
                  },
                  Placeholder: {
                    style: {fontSize: "13px", color: "#94a3b8"}
                  },
                  SingleValue: {
                    style: {fontSize: "13px"}
                  },
                  ValueContainer: {
                    style: {paddingLeft: "12px", paddingRight: "12px"}
                  },
                  IconsContainer: {
                    style: {paddingRight: "8px"}
                  }
                }}
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
                  size="compact"
                  overrides={{
                    Input: {
                      style: {
                        borderTopLeftRadius: "14px",
                        borderTopRightRadius: "14px",
                        borderBottomLeftRadius: "14px",
                        borderBottomRightRadius: "14px",
                        backgroundColor: "transparent",
                        borderColor: "rgba(15, 23, 42, 0.12)",
                        minHeight: "40px",
                        fontSize: "13px",
                        color: "#0f172a",
                        paddingLeft: "12px",
                        paddingRight: "12px"
                      }
                    },
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
                <Input
                  value={draftDob ? draftDob.toISOString().split("T")[0] : ""}
                  disabled
                  size="compact"
                  overrides={{
                    Root: {
                      style: {
                        backgroundColor: "transparent",
                        borderColor: "rgba(15, 23, 42, 0.12)",
                        borderTopLeftRadius: "14px",
                        borderTopRightRadius: "14px",
                        borderBottomLeftRadius: "14px",
                        borderBottomRightRadius: "14px"
                      }
                    },
                    Input: {
                      style: {
                        fontSize: "13px",
                        paddingLeft: "12px",
                        paddingRight: "12px",
                        paddingTop: "10px",
                        paddingBottom: "10px",
                        color: "#0f172a"
                      }
                    }
                  }}
                />
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                {formatLifeExpectancy(strings, draftLifeExpectancy, locale)}
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
                size="compact"
                onChange={(params) =>
                  onDraftDotStyleChange((params.value[0]?.id as DotStyle) ?? "classic")
                }
                overrides={{
                  ControlContainer: {
                    style: {
                      minHeight: "40px",
                      borderTopLeftRadius: "14px",
                      borderTopRightRadius: "14px",
                      borderBottomLeftRadius: "14px",
                      borderBottomRightRadius: "14px",
                      backgroundColor: "transparent",
                      borderColor: "rgba(15, 23, 42, 0.12)",
                      boxShadow: "none"
                    }
                  },
                  Input: {style: {fontSize: "13px"}},
                  Placeholder: {style: {fontSize: "13px", color: "#94a3b8"}},
                  SingleValue: {style: {fontSize: "13px"}},
                  ValueContainer: {style: {paddingLeft: "12px", paddingRight: "12px"}},
                  IconsContainer: {style: {paddingRight: "8px"}}
                }}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                {strings.menuSoundLabel}
              </label>
              <Select
                options={menuSoundOptions}
                value={menuSoundOptions.filter((option) => option.id === menuSound)}
                placeholder={strings.menuSoundLabel}
                clearable={false}
                size="compact"
                onChange={(params) => {
                  const next =
                    (params.value[0]?.id as MenuSoundMode | undefined) ?? "soft";
                  setMenuSound(next);
                  setMenuSoundMode(next);
                }}
                overrides={{
                  ControlContainer: {
                    style: {
                      minHeight: "40px",
                      borderTopLeftRadius: "14px",
                      borderTopRightRadius: "14px",
                      borderBottomLeftRadius: "14px",
                      borderBottomRightRadius: "14px",
                      backgroundColor: "transparent",
                      borderColor: "rgba(15, 23, 42, 0.12)",
                      boxShadow: "none"
                    }
                  },
                  Input: {style: {fontSize: "13px"}},
                  Placeholder: {style: {fontSize: "13px", color: "#94a3b8"}},
                  SingleValue: {style: {fontSize: "13px"}},
                  ValueContainer: {style: {paddingLeft: "12px", paddingRight: "12px"}},
                  IconsContainer: {style: {paddingRight: "8px"}}
                }}
              />
            </div>
          </div>
          <div className="flex flex-wrap justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onReset}
              className="inline-flex w-full items-center justify-center rounded-full border border-surface bg-white px-4 py-2.5 text-sm font-semibold text-main transition hover:bg-neutral-100 sm:w-auto sm:py-2"
            >
              Reset
            </button>
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
