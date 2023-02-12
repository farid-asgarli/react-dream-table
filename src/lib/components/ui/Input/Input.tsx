import { ChangeEvent, InputHTMLAttributes, useEffect, useRef, useState } from "react";
import { useDataGridStaticContext } from "../../../context/DataGridStaticContext";
import { StringExtensions } from "../../../extensions/String";
import { cs } from "../../../utils/ConcatStyles";
import "./Input.scss";

export default function Input({
  defaultValue,
  onChange,
  disableIcon,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
  onChange?: (value: ChangeEvent<HTMLInputElement>["target"]["value"]) => void;
  disableIcon?: boolean;
}) {
  const [currentInputValue, setCurrentInputValue] = useState<string | undefined>((defaultValue as string) ?? StringExtensions.Empty);
  const [focused, setFocused] = useState<boolean>(false);

  const inputUpdateTimeout = useRef<NodeJS.Timeout | null>(null);

  const { icons } = useDataGridStaticContext();

  function clearUpdateTimeout() {
    if (inputUpdateTimeout.current) clearTimeout(inputUpdateTimeout.current);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCurrentInputValue(e.target.value);
    clearUpdateTimeout();
    inputUpdateTimeout.current = setTimeout(() => onChange?.(e.target.value), 600);
  }
  useEffect(() => {
    return () => {
      clearUpdateTimeout();
    };
  }, []);

  return (
    <div className={cs("input-wrapper", focused && "focused")}>
      {disableIcon === false && (
        <div className="input-icon-wrapper">
          <icons.Search className="input-icon" />
        </div>
      )}
      <input
        onFocus={(e) => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={handleInputChange}
        value={currentInputValue}
        className="basic-input"
        {...props}
      />
    </div>
  );
}
