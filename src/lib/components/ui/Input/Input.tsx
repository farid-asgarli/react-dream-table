import { ChangeEvent, InputHTMLAttributes, useRef, useState } from "react";
import { useTableContext } from "../../../context/TableContext";
import { StringExtensions } from "../../../extensions/String";
import { cs } from "../../../utils/ConcatStyles";
import "./Input.css";

export default function Input({
  onChange,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
  onChange?: (value: ChangeEvent<HTMLInputElement>["target"]["value"]) => void;
}) {
  const [currentInputValue, setCurrentInputValue] = useState<string | undefined>(
    (props.defaultValue as string) ?? StringExtensions.Empty
  );
  const [focused, setFocused] = useState<boolean>(false);

  // function clearInput() {
  //   setCurrentInputValue(StringExtensions.Empty);
  // }

  const inputUpdateTimeout = useRef<NodeJS.Timeout | null>(null);

  const { icons } = useTableContext();

  function clearUpdateTimeout() {
    if (inputUpdateTimeout.current) clearTimeout(inputUpdateTimeout.current);
    inputUpdateTimeout.current = null;
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCurrentInputValue(e.target.value);
    clearUpdateTimeout();
    inputUpdateTimeout.current = setTimeout(async () => {
      onChange?.(e.target.value);
    }, 600);
  }
  return (
    <div className={cs("table-text-input", focused && "focused")}>
      {/* <button
        type="button"
        // onClick={clearInput}
        className="clear-button"
        disabled={!(currentInputValue && currentInputValue.length > 0)}
      >
        <SearchIcon className="search-icon" />
      </button> */}
      <div className="search-icon-wrapper">
        <icons.Search className="search-icon" />
      </div>
      <input
        onFocus={(e) => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={handleInputChange}
        value={currentInputValue}
        className="search-input"
        {...props}
      />
    </div>
  );
}
