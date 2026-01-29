const FRACTIONS: Record<string, string> = {
  "1/4": "¼",
  "1/3": "⅓",
  "1/2": "½",
  "2/3": "⅔",
  "3/4": "¾",
  "1/5": "⅕",
  "2/5": "⅖",
  "3/5": "⅗",
  "4/5": "⅘",
  "1/6": "⅙",
  "5/6": "⅚",
  "1/7": "⅐",
  "1/8": "⅛",
  "3/8": "⅜",
  "5/8": "⅝",
  "7/8": "⅞",
  "1/9": "⅑",
  "1/10": "⅒",
};

const fractionRegex = new RegExp(
  `(^|\\s)(${Object.keys(FRACTIONS).map((f) => f.replace("/", "\\/")).join("|")})(?=\\s|$)`,
  "g",
);

export const useFractionNormalizer = () => {
  const normalizeFractions = (value: string) =>
    value.replace(
      fractionRegex,
      (_match, prefix: string, fraction: string) => `${prefix}${FRACTIONS[fraction] ?? fraction}`,
    );

  return { normalizeFractions };
};
