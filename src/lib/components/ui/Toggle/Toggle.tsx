import React from "react";
import "./Toggle.scss";

interface ToggleProps {
  checked?: boolean;
  onChange?: (value: string) => void;
  name?: string;
  size?: number;
}

export default function Toggle({ checked, name, onChange, size = 50 }: ToggleProps) {
  return (
    <div
      style={
        {
          "--toggle-switch-size": `${size}px`,
        } as React.CSSProperties
      }
      className="toggle-switch"
    >
      <input
        className="toggle-switch-input"
        type="checkbox"
        onChange={(e) => {
          onChange?.(e.target.value);
        }}
        id={name}
        checked={checked}
      />
      <label
        style={{
          width: size,
          height: size / 1.7,
        }}
        className="toggle-switch-label"
        htmlFor={name}
      />
    </div>
  );
}
