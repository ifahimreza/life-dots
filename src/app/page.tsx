"use client";

import {useEffect, useMemo, useState} from "react";
import {Input} from "baseui/input";
import {Select} from "baseui/select";
import {DatePicker} from "baseui/datepicker";
import {Drawer} from "baseui/drawer";

const countryCodes = [
  "AF",
  "AL",
  "DZ",
  "AS",
  "AD",
  "AO",
  "AI",
  "AQ",
  "AG",
  "AR",
  "AM",
  "AW",
  "AU",
  "AT",
  "AZ",
  "BS",
  "BH",
  "BD",
  "BB",
  "BY",
  "BE",
  "BZ",
  "BJ",
  "BM",
  "BT",
  "BO",
  "BQ",
  "BA",
  "BW",
  "BV",
  "BR",
  "IO",
  "BN",
  "BG",
  "BF",
  "BI",
  "KH",
  "CM",
  "CA",
  "CV",
  "KY",
  "CF",
  "TD",
  "CL",
  "CN",
  "CX",
  "CC",
  "CO",
  "KM",
  "CG",
  "CD",
  "CK",
  "CR",
  "CI",
  "HR",
  "CU",
  "CW",
  "CY",
  "CZ",
  "DK",
  "DJ",
  "DM",
  "DO",
  "EC",
  "EG",
  "SV",
  "GQ",
  "ER",
  "EE",
  "SZ",
  "ET",
  "FK",
  "FO",
  "FJ",
  "FI",
  "FR",
  "GF",
  "PF",
  "TF",
  "GA",
  "GM",
  "GE",
  "DE",
  "GH",
  "GI",
  "GR",
  "GL",
  "GD",
  "GP",
  "GU",
  "GT",
  "GG",
  "GN",
  "GW",
  "GY",
  "HT",
  "HM",
  "VA",
  "HN",
  "HK",
  "HU",
  "IS",
  "IN",
  "ID",
  "IR",
  "IQ",
  "IE",
  "IM",
  "IL",
  "IT",
  "JM",
  "JP",
  "JE",
  "JO",
  "KZ",
  "KE",
  "KI",
  "KP",
  "KR",
  "KW",
  "KG",
  "LA",
  "LV",
  "LB",
  "LS",
  "LR",
  "LY",
  "LI",
  "LT",
  "LU",
  "MO",
  "MG",
  "MW",
  "MY",
  "MV",
  "ML",
  "MT",
  "MH",
  "MQ",
  "MR",
  "MU",
  "YT",
  "MX",
  "FM",
  "MD",
  "MC",
  "MN",
  "ME",
  "MS",
  "MA",
  "MZ",
  "MM",
  "NA",
  "NR",
  "NP",
  "NL",
  "NC",
  "NZ",
  "NI",
  "NE",
  "NG",
  "NU",
  "NF",
  "MK",
  "MP",
  "NO",
  "OM",
  "PK",
  "PW",
  "PS",
  "PA",
  "PG",
  "PY",
  "PE",
  "PH",
  "PN",
  "PL",
  "PT",
  "PR",
  "QA",
  "RE",
  "RO",
  "RU",
  "RW",
  "BL",
  "SH",
  "KN",
  "LC",
  "MF",
  "PM",
  "VC",
  "WS",
  "SM",
  "ST",
  "SA",
  "SN",
  "RS",
  "SC",
  "SL",
  "SG",
  "SX",
  "SK",
  "SI",
  "SB",
  "SO",
  "ZA",
  "GS",
  "SS",
  "ES",
  "LK",
  "SD",
  "SR",
  "SJ",
  "SE",
  "CH",
  "SY",
  "TW",
  "TJ",
  "TZ",
  "TH",
  "TL",
  "TG",
  "TK",
  "TO",
  "TT",
  "TN",
  "TR",
  "TM",
  "TC",
  "TV",
  "UG",
  "UA",
  "AE",
  "GB",
  "US",
  "UM",
  "UY",
  "UZ",
  "VU",
  "VE",
  "VN",
  "VG",
  "VI",
  "WF",
  "EH",
  "YE",
  "ZM",
  "ZW"
];

const lifeExpectancyByCountry: Record<string, number> = {
  bd: 73,
  us: 77,
  gb: 80,
  ca: 82,
  de: 81,
  ng: 61
};

const countryNameFormatter = new Intl.DisplayNames(["en"], {type: "region"});

const countryOptions = countryCodes.map((code) => {
  const id = code.toLowerCase();
  const flag = String.fromCodePoint(
    ...code.toUpperCase().split("").map((char) => 127397 + char.charCodeAt(0))
  );
  return {
    label: `${flag} ${countryNameFormatter.of(code) ?? code}`,
    id,
    expectancy: lifeExpectancyByCountry[id] ?? 80
  };
});

type Profile = {
  name: string;
  country: string;
  dob: string;
  lifeExpectancy?: number;
  hasCustomExpectancy?: boolean;
  dotStyle?: "classic" | "rainbow";
};

const STORAGE_KEY = "life-progress-profile";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

const rainbowColors = [
  "bg-red-400",
  "bg-orange-400",
  "bg-amber-400",
  "bg-yellow-400",
  "bg-lime-400",
  "bg-green-400",
  "bg-emerald-400",
  "bg-teal-400",
  "bg-cyan-400",
  "bg-sky-400",
  "bg-blue-400",
  "bg-indigo-400",
  "bg-violet-400",
  "bg-fuchsia-400",
  "bg-pink-400",
  "bg-rose-400"
];

function DotsGrid({
  total,
  filled,
  dotStyle,
  perRow,
  dotSize,
  gap
}: {
  total: number;
  filled: number;
  dotStyle: "classic" | "rainbow";
  perRow: number;
  dotSize: number;
  gap: number;
}) {
  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${perRow}, ${dotSize}px)`,
        gap: `${gap}px`
      }}
    >
      {Array.from({length: total}).map((_, index) => (
        <span
          key={index}
          style={{height: dotSize, width: dotSize}}
          className={`${
            dotStyle === "classic" ? "rounded-full" : "rounded-sm"
          } ${
            index < filled
              ? dotStyle === "classic"
                ? "bg-neutral-900 dark:bg-white"
                : rainbowColors[index % rainbowColors.length]
              : "bg-neutral-200 dark:bg-neutral-800"
          }`}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const [name, setName] = useState("");
  const [country, setCountry] = useState<string>("");
  const [dob, setDob] = useState<Date | null>(null);
  const [lifeExpectancy, setLifeExpectancy] = useState(80);
  const [hasCustomExpectancy, setHasCustomExpectancy] = useState(false);
  const [dotStyle, setDotStyle] = useState<"classic" | "rainbow">("classic");
  const [draftName, setDraftName] = useState("");
  const [draftCountry, setDraftCountry] = useState<string>("");
  const [draftDob, setDraftDob] = useState<Date | null>(null);
  const [draftLifeExpectancy, setDraftLifeExpectancy] = useState(80);
  const [draftHasCustomExpectancy, setDraftHasCustomExpectancy] = useState(false);
  const [draftDotStyle, setDraftDotStyle] = useState<"classic" | "rainbow">("classic");
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gridMetrics] = useState({dotSize: 10.38, gap: 5});

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    const profile = JSON.parse(stored) as Profile;
    const storedCountry = profile.country || "";
    const storedExpectancy =
      typeof profile.lifeExpectancy === "number" ? profile.lifeExpectancy : undefined;
    const defaultExpectancy = storedCountry ? (lifeExpectancyByCountry[storedCountry] ?? 80) : 80;
    const inferredHasCustom =
      storedExpectancy !== undefined && storedExpectancy !== defaultExpectancy;
    const nextHasCustom =
      typeof profile.hasCustomExpectancy === "boolean"
        ? profile.hasCustomExpectancy
        : inferredHasCustom;
    setName(profile.name || "");
    setCountry(storedCountry);
    setDob(profile.dob ? new Date(profile.dob) : null);
    if (storedExpectancy !== undefined) {
      setLifeExpectancy(storedExpectancy);
    }
    setHasCustomExpectancy(nextHasCustom);
    if (profile.dotStyle) {
      setDotStyle(profile.dotStyle);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const profile: Profile = {
      name,
      country,
      dob: dob ? dob.toISOString() : "",
      lifeExpectancy,
      hasCustomExpectancy,
      dotStyle
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [name, country, dob, lifeExpectancy, dotStyle, hasCustomExpectancy]);

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
  }, [isModalOpen, name, country, dob, lifeExpectancy, hasCustomExpectancy, dotStyle]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setName(draftName.trim());
    setCountry(draftCountry);
    setDob(draftDob);
    setLifeExpectancy(draftLifeExpectancy);
    setHasCustomExpectancy(draftHasCustomExpectancy);
    setDotStyle(draftDotStyle);
    setIsModalOpen(false);
  };

  const expectancy = clamp(lifeExpectancy, 1, 120);

  const progress = useMemo(() => {
    if (!dob) {
      return {
        percent: 0,
        weeksPassed: 0,
        totalWeeks: expectancy * 52
      };
    }
    const now = new Date();
    const ageMs = now.getTime() - dob.getTime();
    const ageYears = ageMs / (1000 * 60 * 60 * 24 * 365.25);
    const totalWeeks = expectancy * 52;
    const ageWeeks = ageYears * 52;
    const percent = clamp(Math.round((ageWeeks / totalWeeks) * 100), 0, 100);
    const weeksPassed = clamp(Math.floor(ageWeeks), 0, totalWeeks);
    return {
      percent,
      weeksPassed,
      totalWeeks
    };
  }, [dob, expectancy]);

  const formCard = (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white p-4 shadow-soft dark:bg-neutral-900"
    >
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Profile details
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Update your basics one step at a time.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(false)}
          className="rounded-full border border-neutral-200 px-2 py-1 text-xs font-semibold text-neutral-600 transition hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-500 dark:hover:text-white"
        >
          Close
        </button>
      </div>
      <div className="grid gap-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            Life expectancy ({draftLifeExpectancy} years)
          </label>
          <input
            type="range"
            min={1}
            max={120}
            step={1}
            value={draftLifeExpectancy}
            onChange={(event) => {
              setDraftHasCustomExpectancy(true);
              setDraftLifeExpectancy(Number(event.target.value));
            }}
            className="mt-2 w-full accent-neutral-900 dark:accent-white"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            Date of birth
          </label>
          <div className="mt-2">
            {mounted ? (
              <DatePicker
                value={draftDob}
                onChange={({date}) => {
                  const nextDate = Array.isArray(date) ? date[0] : (date as Date | null);
                  setDraftDob(nextDate ?? null);
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
                            zIndex: 60
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
        </div>
        <div>
          <Select
            options={[
              {id: "classic", label: "Classic black"},
              {id: "rainbow", label: "Rainbow box"}
            ]}
            value={
              draftDotStyle
                ? [
                    {
                      id: draftDotStyle,
                      label: draftDotStyle === "classic" ? "Classic black" : "Rainbow box"
                    }
                  ]
                : []
            }
            placeholder="Dot style"
            clearable={false}
            onChange={(params) =>
              setDraftDotStyle((params.value[0]?.id as "classic" | "rainbow") ?? "classic")
            }
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            value={draftName}
            onChange={(event) => setDraftName((event.target as HTMLInputElement).value)}
            placeholder="Name"
            clearable
          />
          <Select
            options={countryOptions}
            value={countryOptions.filter((option) => option.id === draftCountry)}
            placeholder="Country"
            searchable
            clearable
            onChange={(params) => {
              setDraftHasCustomExpectancy(false);
              setDraftCountry((params.value[0]?.id as string) ?? "");
            }}
          />
        </div>
      </div>
      <div className="mt-5 flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
        >
          Save changes
        </button>
      </div>
    </form>
  );

  return (
    <main className="min-h-screen py-6">
      <section className="mx-[60px] flex w-[860px] flex-col gap-4">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
            Life in Weeks
          </p>
          <div className="mt-3 text-sm font-semibold uppercase tracking-widest text-neutral-700 dark:text-neutral-200">
            {name || "Add your name in settings"}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-sm">Life Dots</h1>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center rounded-full border border-neutral-200 p-2 text-neutral-600 transition hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-500 dark:hover:text-white"
            aria-label="Open profile settings"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 6h3m-7.5 4h11m-7.5 4h3m-8 4h10M4 4h16v16H4z"
              />
            </svg>
          </button>
        </div>

        <div className="flex min-h-[60vh] max-h-[calc(100vh-220px)] flex-col rounded-md bg-white p-[30px] dark:bg-neutral-900">
          <div className="flex flex-wrap justify-end gap-x-3 text-sm font-medium text-neutral-500 dark:text-neutral-400">
            <span>
              Weeks: {progress.weeksPassed}/{progress.totalWeeks}
            </span>
            <span>{progress.percent}%</span>
          </div>
          <div className="mt-4 flex-1">
            <DotsGrid
              total={progress.totalWeeks}
              filled={progress.weeksPassed}
              dotStyle={dotStyle}
              perRow={52}
              dotSize={gridMetrics.dotSize}
              gap={gridMetrics.gap}
            />
          </div>
        </div>
      </section>

      <Drawer
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        anchor="right"
        size="520px"
        animate
        autoFocus
        closeable
        showBackdrop
        overrides={{}}
      >
        <div className="w-full max-w-[520px] p-6">{formCard}</div>
      </Drawer>
    </main>
  );
}
