"use client";

import {useEffect, useMemo, useState} from "react";
import {Input} from "baseui/input";
import {Select} from "baseui/select";
import {DatePicker} from "baseui/datepicker";
import {Dialog} from "@base-ui/react/dialog";

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
  dotStyle
}: {
  total: number;
  filled: number;
  dotStyle: "classic" | "rainbow";
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {Array.from({length: total}).map((_, index) => (
        <span
          key={index}
          className={`h-3 w-3 ${
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
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    const profile = JSON.parse(stored) as Profile;
    setName(profile.name || "");
    setCountry(profile.country || "");
    setDob(profile.dob ? new Date(profile.dob) : null);
    if (typeof profile.lifeExpectancy === "number") {
      setLifeExpectancy(profile.lifeExpectancy);
      setHasCustomExpectancy(true);
    }
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
      dotStyle
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [name, country, dob, lifeExpectancy, dotStyle]);

  const countryOption = countryOptions.find((option) => option.id === country);
  useEffect(() => {
    if (!hasCustomExpectancy) {
      setLifeExpectancy(countryOption?.expectancy ?? 80);
    }
  }, [countryOption?.expectancy, hasCustomExpectancy]);

  const expectancy = clamp(lifeExpectancy, 1, 120);

  const progress = useMemo(() => {
    if (!dob) {
      return {
        percent: 0,
        monthsPassed: 0,
        totalMonths: expectancy * 12
      };
    }
    const now = new Date();
    const ageMs = now.getTime() - dob.getTime();
    const ageYears = ageMs / (1000 * 60 * 60 * 24 * 365.25);
    const totalMonths = expectancy * 12;
    const ageMonths = ageYears * 12;
    const percent = clamp(Math.round((ageMonths / totalMonths) * 100), 0, 100);
    const monthsPassed = clamp(Math.floor(ageMonths), 0, totalMonths);
    return {
      percent,
      monthsPassed,
      totalMonths
    };
  }, [dob, expectancy]);

  const formCard = (
    <div className="rounded-2xl bg-white p-5 shadow-soft dark:bg-neutral-900">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <Dialog.Title className="text-lg font-semibold text-neutral-900 dark:text-white">
            Profile details
          </Dialog.Title>
          <Dialog.Description className="text-sm text-neutral-500 dark:text-neutral-400">
            Update your basics one step at a time.
          </Dialog.Description>
        </div>
        <Dialog.Close className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-600 transition hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-500 dark:hover:text-white">
          Close
        </Dialog.Close>
      </div>
      <div className="grid gap-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            Date of birth
          </label>
        </div>
        <div>
          {mounted ? (
            <DatePicker
              value={dob}
              onChange={({date}) => setDob(date as Date)}
              placeholder="Date of birth"
              minDate={new Date(1901, 0, 1)}
              maxDate={new Date()}
            />
          ) : (
            <Input value={dob ? dob.toISOString().split("T")[0] : ""} disabled />
          )}
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            Life expectancy ({expectancy} years)
          </label>
          <input
            type="range"
            min={1}
            max={120}
            step={1}
            value={expectancy}
            onChange={(event) => {
              setHasCustomExpectancy(true);
              setLifeExpectancy(Number(event.target.value));
            }}
            className="mt-2 w-full accent-neutral-900 dark:accent-white"
          />
        </div>
        <div>
          <Select
            options={[
              {id: "classic", label: "Classic black"},
              {id: "rainbow", label: "Rainbow box"}
            ]}
            value={dotStyle ? [{id: dotStyle, label: dotStyle === "classic" ? "Classic black" : "Rainbow box"}] : []}
            placeholder="Dot style"
            clearable={false}
            onChange={(params) => setDotStyle((params.value[0]?.id as "classic" | "rainbow") ?? "classic")}
          />
        </div>
        <div>
          <Input
            value={name}
            onChange={(event) => setName((event.target as HTMLInputElement).value)}
            placeholder="Name"
            clearable
          />
        </div>
        <div>
          <Select
            options={countryOptions}
            value={countryOptions.filter((option) => option.id === country)}
            placeholder="Country"
            searchable
            clearable
            onChange={(params) => {
              setHasCustomExpectancy(false);
              setCountry((params.value[0]?.id as string) ?? "");
            }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <main className="px-6 py-12">
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <section className="mx-auto flex w-full max-w-[820px] flex-col gap-6">
          <div className="flex justify-end">
            <Dialog.Trigger
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
            </Dialog.Trigger>
          </div>

          <div className="rounded-md bg-white p-4 dark:bg-neutral-900">
            <div className="flex justify-end text-sm font-medium text-neutral-500 dark:text-neutral-400">
              {progress.monthsPassed}/{progress.totalMonths} • {progress.percent}%
            </div>
            <div className="mt-6">
              <DotsGrid
                total={progress.totalMonths}
                filled={progress.monthsPassed}
                dotStyle={dotStyle}
              />
            </div>
          </div>
        </section>

        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 bg-neutral-950/60" />
          <Dialog.Viewport className="fixed inset-0 z-50 flex items-center justify-center px-6 py-10">
            <Dialog.Popup className="w-full max-w-[520px]">{formCard}</Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>
    </main>
  );
}
