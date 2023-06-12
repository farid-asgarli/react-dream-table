/// <reference types="react" />
import { Dayjs } from "dayjs";
import "dayjs/locale/az";
import "dayjs/locale/en";
import "dayjs/locale/ru";
export default function DayPicker({ selectedDate }: {
    selectedDate: Dayjs;
}): JSX.Element;
