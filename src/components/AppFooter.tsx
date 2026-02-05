import type {UiStrings} from "../lib/i18n";

type AppFooterProps = {
  strings: UiStrings;
};

export default function AppFooter({strings}: AppFooterProps) {
  return (
    <footer className="mx-auto w-full max-w-[860px] px-6 pb-6 pt-3">
      <div className="text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
        {strings.inspiredByPrefix ? `${strings.inspiredByPrefix} ` : ""}
        <a
          href="https://waitbutwhy.com/2014/05/life-weeks.html"
          target="_blank"
          rel="noreferrer"
          className="transition hover:text-neutral-600 dark:hover:text-neutral-200"
        >
          {strings.inspiredByTitle}
        </a>
        {strings.inspiredBySuffix ? ` ${strings.inspiredBySuffix}` : ""}
      </div>
    </footer>
  );
}
