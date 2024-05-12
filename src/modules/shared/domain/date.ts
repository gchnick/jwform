export const toLocaleDateString = (
  date: Date,
  locale?: Intl.LocalesArgument,
  options?: Intl.LocaleOptions,
): string => {
  const _date = new Date(date);
  return _date.toLocaleDateString(
    locale ?? "en-US",
    options ?? {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    },
  );
};
