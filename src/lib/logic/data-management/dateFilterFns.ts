import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { DefaultDateTemplate } from "../../static/constantProps";

dayjs.extend(customParseFormat);
const dayjsFormatted = (data: string) => dayjs(data, DefaultDateTemplate);

const equals = (data: string, filterValue: Dayjs) => filterValue.isSame(dayjsFormatted(data));

const contains = equals,
  startsWith = equals,
  endsWith = equals,
  equalsAlt = equals;

const notEquals = (data: string, filterValue: Dayjs) => !filterValue.isSame(dayjsFormatted(data));

const greaterThan = (data: string, filterValue: Dayjs) => filterValue.isBefore(dayjsFormatted(data));

const greaterThanOrEqualTo = (data: string, filterValue: Dayjs) => equals(data, filterValue) || greaterThan(data, filterValue);

const lessThan = (data: string, filterValue: Dayjs) => filterValue.isAfter(dayjsFormatted(data));

const lessThanOrEqualTo = (data: string, filterValue: Dayjs) => equals(data, filterValue) || lessThan(data, filterValue);

const between = (data: string, filterValues: [Dayjs, Dayjs]) => {
  const a = filterValues[0];
  const b = filterValues[1];
  if (!a && !b) return true;
  if (!a && b) return lessThan(data, b);
  else if (a && !b) return greaterThan(data, a);
  return lessThan(data, b) && greaterThan(data, a);
};

const betweenInclusive = (data: string, filterValues: [Dayjs, Dayjs]) => {
  const a = filterValues[0];
  const b = filterValues[1];
  if (!a && !b) return true;
  if (!a && b) return lessThanOrEqualTo(data, b);
  else if (a && !b) return greaterThanOrEqualTo(data, a);
  return lessThanOrEqualTo(data, b) && greaterThanOrEqualTo(data, a);
};

const empty = (data: string) => !data?.toString()?.trim();

const notEmpty = (data: string) => !!data?.toString()?.trim();

export const RDTDateFilters = {
  contains,
  empty,
  notEmpty,
  startsWith,
  endsWith,
  equals,
  notEquals,
  greaterThan,
  lessThan,
  greaterThanOrEqualTo,
  lessThanOrEqualTo,
  between,
  betweenInclusive,
  equalsAlt,
};
