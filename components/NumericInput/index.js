import { useCallback } from "react";

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`);

function escape(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default function NumericInput({ value, onChange }) {
  const onChangeFilter = useCallback(
    (event) => {
      const val = event.target.value.replace(/,/g, ".");
      if (val === "" || inputRegex.test(escape(val))) {
        onChange(val);
      }
    },
    [value, onChange]
  );
  return (
    <input
      value={value}
      onChange={onChangeFilter}
      inputMode="decimal"
      title="Token Amount"
      autoComplete="off"
      autoCorrect="off"
      type="text"
      pattern="^[0-9]*[.,]?[0-9]*$"
      placeholder={"0.0"}
      minLength={1}
      maxLength={79}
      spellCheck="false"
    />
  );
}
