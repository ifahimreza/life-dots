"use client";

import {useEffect, useMemo, useState} from "react";
import {Input} from "baseui/input";
import {Select} from "baseui/select";
import {DatePicker} from "baseui/datepicker";

const countryOptions = [
  {label: "Bangladesh", id: "bd", expectancy: 73},
  {label: "United States", id: "us", expectancy: 77},
  {label: "United Kingdom", id: "uk", expectancy: 80},
  {label: "Canada", id: "ca", expectancy: 82},
  {label: "Germany", id: "de", expectancy: 81},
  {label: "Nigeria", id: "ng", expectancy: 61}
];

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
        yearPercent: 0,
        yearsPassed: 0
      };
    }
    const now = new Date();
    const ageMs = now.getTime() - dob.getTime();
    const ageYears = ageMs / (1000 * 60 * 60 * 24 * 365.25);
    const yearPercent = clamp(Math.round((ageYears / expectancy) * 100), 0, 100);
    const yearsPassed = clamp(Math.floor(ageYears), 0, expectancy);
    return {
      yearPercent,
      yearsPassed
    };
  }, [dob, expectancy]);

  return (
    <main className="px-6 py-12">
      <section className="mx-auto flex w-full max-w-[820px] flex-col gap-8">
        <div className="rounded-[28px] bg-white p-6 shadow-soft dark:bg-neutral-900">
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
                searchable={false}
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
                />
              ) : (
                <Input value={dob ? dob.toISOString().split("T")[0] : ""} disabled />
              )}
            </div>
          </div>
        </div>

        <div className="rounded-[32px] bg-white p-8 shadow-soft dark:bg-neutral-900">
          <div className="flex justify-end text-sm font-medium text-neutral-500 dark:text-neutral-400">
            {progress.yearsPassed}/{expectancy} • {progress.yearPercent}%
          </div>
          <div className="mt-6">
            <DotsGrid total={expectancy} filled={progress.yearsPassed} />
          </div>
        </div>
      </section>
    </main>
  );
}
