import { InputHTMLAttributes } from "react";
import "./Checkbox.css";
export default function Checkbox(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="checkbox-wrapper">
      <label>
        <input type="checkbox" checked {...props} />
      </label>
    </div>
  );
}
