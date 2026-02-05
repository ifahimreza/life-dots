type LogoMarkProps = {
  size?: number;
  className?: string;
};

export default function LogoMark({size = 40, className}: LogoMarkProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="100" height="100" rx="22" fill="white" />
      <circle className="logo-dot dot-1" cx="25" cy="25" r="8" />
      <circle className="logo-dot dot-2" cx="50" cy="25" r="8" />
      <circle className="logo-dot dot-3" cx="75" cy="25" r="8" />
      <circle className="logo-dot dot-4" cx="25" cy="50" r="8" />
      <circle className="logo-dot dot-5" cx="50" cy="50" r="8" />
      <circle className="logo-dot dot-6" cx="75" cy="50" r="8" />
      <circle className="logo-dot dot-7" cx="25" cy="75" r="8" />
      <circle className="logo-dot dot-8" cx="50" cy="75" r="8" />
      <circle className="logo-dot dot-9" cx="75" cy="75" r="8" />
    </svg>
  );
}
