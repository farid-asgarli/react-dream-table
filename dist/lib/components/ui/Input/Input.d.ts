import { ChangeEvent, InputHTMLAttributes } from "react";
import "./Input.scss";
export default function Input({ defaultValue, onChange, disableIcon, ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
    onChange?: (value: ChangeEvent<HTMLInputElement>["target"]["value"]) => void;
    disableIcon?: boolean;
}): JSX.Element;
