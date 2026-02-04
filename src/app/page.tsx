"use client";

import {useEffect, useMemo, useState} from "react";
import {Input} from "baseui/input";
import {Select} from "baseui/select";
import {DatePicker} from "baseui/datepicker";

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
};

const STORAGE_KEY = "life-progress-profile";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function DotsGrid({
  total,
  filled
}: {
  total: number;
  filled: number;
}) {
  return (
    <div className="grid grid-cols-10 gap-2 sm:grid-cols-12">
      {Array.from({length: total}).map((_, index) => (
        <span
          key={index}
          className={`h-3 w-3 rounded-full ${
            index < filled ? "bg-neutral-900 dark:bg-white" : "bg-neutral-200 dark:bg-neutral-800"
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
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    const profile = JSON.parse(stored) as Profile;
    setName(profile.name || "");
    setCountry(profile.country || "");
    setDob(profile.dob ? new Date(profile.dob) : null);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const profile: Profile = {
      name,
      country,
      dob: dob ? dob.toISOString() : ""
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [name, country, dob]);

  const countryOption = countryOptions.find((option) => option.id === country);
  const expectancy = countryOption?.expectancy ?? 80;

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
    <div className="rounded-[28px] bg-white p-6 shadow-soft dark:bg-neutral-900">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Profile details</h2>
        <button
          type="button"
          onClick={() => setIsModalOpen(false)}
          className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-600 transition hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-500 dark:hover:text-white"
        >
          Close
        </button>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
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
            onChange={(params) => setCountry((params.value[0]?.id as string) ?? "")}
          />
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
      </div>
    </div>
  );

  return (
    <main className="px-6 py-12">
      {isModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/60 px-6 py-10"
          role="dialog"
          aria-modal="true"
          aria-label="Profile details"
        >
          <div className="w-full max-w-[820px]">{formCard}</div>
        </div>
      ) : null}
      <section className="mx-auto flex w-full max-w-[820px] flex-col gap-8">
        {!isModalOpen ? formCard : null}

        <div className="rounded-md bg-white p-4 dark:bg-neutral-900">
          <div className="flex justify-end text-sm font-medium text-neutral-500 dark:text-neutral-400">
            {progress.monthsPassed}/{progress.totalMonths} • {progress.percent}%
          </div>
          <div className="mt-6">
            <DotsGrid total={progress.totalMonths} filled={progress.monthsPassed} />
          </div>
        </div>
      </section>
    </main>
  );
}
