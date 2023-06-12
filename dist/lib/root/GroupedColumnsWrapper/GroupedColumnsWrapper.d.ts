/// <reference types="react" />
import { GroupedColumnHeaderDefinition } from "../../types/Utils";
import "./GroupedColumnsWrapper.scss";
interface GroupedColumnsWrapperProps {
    groupedColumnHeaders: GroupedColumnHeaderDefinition[] | undefined;
    children: React.ReactNode;
}
export default function GroupedColumnsWrapper({ groupedColumnHeaders, children }: GroupedColumnsWrapperProps): JSX.Element;
export {};
