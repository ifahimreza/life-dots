import {getFlagSvgUrl} from "../libs/flags";

type FlagIconProps = {
  code: string;
  size?: number;
  className?: string;
};

export default function FlagIcon({code, size = 14, className = ""}: FlagIconProps) {
  const url = getFlagSvgUrl(code);
  if (!url) return null;
  return (
    <img
      src={url}
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      loading="lazy"
      className={className}
    />
  );
}
