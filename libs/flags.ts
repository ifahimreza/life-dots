export function getFlagCodepoints(code: string) {
  const upper = code.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(upper)) return null;
  return upper
    .split("")
    .map((char) => (0x1f1e6 + char.charCodeAt(0) - 65).toString(16))
    .join("-");
}

export function getFlagSvgUrl(code: string) {
  const codepoints = getFlagCodepoints(code);
  if (!codepoints) return "";
  return `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${codepoints}.svg`;
}
