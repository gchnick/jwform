export const toLocaleDateString = (
  date: Date,
  locale?: Intl.LocalesArgument,
  options?: Intl.LocaleOptions,
): string => {
  return date.toLocaleDateString(
    locale ?? "en-US",
    options ?? {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    },
  );
};
