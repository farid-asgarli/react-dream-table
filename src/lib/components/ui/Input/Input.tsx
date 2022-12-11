import { ChangeEvent, InputHTMLAttributes, useRef, useState } from "react";
import { StringExtensions } from "../../../extensions/String";
import SearchIcon from "../../../icons/Search";
import { concatStyles } from "../../../utils/ConcatStyles";
import "./Input.css";

export default function Input({
  onChange,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  const [currentInputValue, setCurrentInputValue] = useState<string | undefined>(
    (props.defaultValue as string) ?? StringExtensions.Empty
  );
  const [focused, setFocused] = useState<boolean>(false);

  // function clearInput() {
  //   setCurrentInputValue(StringExtensions.Empty);
  // }

  const inputUpdateTimeout = useRef<NodeJS.Timeout | null>(null);

  function clearUpdateTimeout() {
    if (inputUpdateTimeout.current) clearTimeout(inputUpdateTimeout.current);
    inputUpdateTimeout.current = null;
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCurrentInputValue(e.target.value);
    clearUpdateTimeout();
    inputUpdateTimeout.current = setTimeout(async () => {
      onChange?.(e);
    }, 600);
  }
  return (
    <div className={concatStyles("table-text-input", focused && "focused")}>
      {/* <button
        type="button"
        // onClick={clearInput}
        className="clear-button"
        disabled={!(currentInputValue && currentInputValue.length > 0)}
      >
        <SearchIcon className="search-icon" />
      </button> */}
      <div className="search-icon-wrapper">
        <SearchIcon className="search-icon" />
      </div>
      <input
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={handleInputChange}
        value={currentInputValue}
        className="search-input"
        {...props}
      />
    </div>
  );
}
