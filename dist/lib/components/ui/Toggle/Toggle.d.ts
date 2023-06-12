/// <reference types="react" />
import "./Toggle.scss";
interface ToggleProps {
    checked?: boolean;
    onChange?: (value: string) => void;
    name?: string;
    size?: number;
}
export default function Toggle({ checked, name, onChange, size }: ToggleProps): JSX.Element;
export {};
