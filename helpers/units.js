import { formatUnits as legacyFormatUnits } from "@ethersproject/units";
import BigNumber from "bignumber.js";

const DigitsFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 18,
});

export function formatUnits(value, unit, limit) {
  if (!value || !unit) return undefined;
  if (value instanceof BigNumber) {
    value = value.toString();
    if (value.indexOf(".") > -1) {
      value = value.slice(0, value.indexOf("."));
    }
  }
  const formatted = legacyFormatUnits(value, unit);
  if (!limit) return DigitsFormatter.format(formatted);
  const [whole, decimal] = formatted.split(".");
  if (decimal.length < limit) return formatted;
  return DigitsFormatter.format(`${whole}.${decimal.substr(0, limit)}`);
}
