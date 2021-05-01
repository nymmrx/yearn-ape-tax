import { formatUnits as legacyFormatUnits } from "@ethersproject/units";

export function formatUnits(value, unit, limit) {
  if (!value || !unit) return undefined;
  const formatted = legacyFormatUnits(value, unit);
  if (!limit) return formatted;
  const [whole, decimal] = formatted.split(".");
  if (decimal.length < limit) return formatted;
  return `${whole}.${decimal.substr(0, limit)}`;
}
