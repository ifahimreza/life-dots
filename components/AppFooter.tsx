import type {UiStrings} from "../libs/i18n";

type AppFooterProps = {
  strings: UiStrings;
};

export default function AppFooter({strings}: AppFooterProps) {
  return (
    <footer className="mx-auto w-full max-w-[860px] px-4 pb-5 pt-2 sm:px-6 sm:pb-6 sm:pt-3">
      <div className="text-center text-[9px] font-semibold uppercase tracking-[0.18em] text-subtle sm:text-[10px]">
        {strings.inspiredByPrefix ? `${strings.inspiredByPrefix} ` : ""}
        <a
          href="https://waitbutwhy.com/2014/05/life-weeks.html"
          target="_blank"
          rel="noreferrer"
          className="transition hover:text-neutral-600"
        >
          {strings.inspiredByTitle}
        </a>
        {strings.inspiredBySuffix ? ` ${strings.inspiredBySuffix}` : ""}
      </div>
    </footer>
  );
}
