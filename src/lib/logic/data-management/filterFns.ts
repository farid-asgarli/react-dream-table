import Fuse from "fuse.js";
import { StringExtensions } from "../../extensions/String";

const fuzzy = <TData extends Record<string, any> = {}>(collection: TData[], id: string, filterValue: string): TData[] => {
  const searchValue = filterValue.toLowerCase().toString();
  return new Fuse(collection, {
    keys: [id],
  })
    .search(searchValue)
    .flatMap((d) => d.item);
};

const contains = <TData extends Record<string, any> = {}>(data: TData, id: string, filterValue: string | number) =>
  data[id]?.toString().toLowerCase().trim().includes(filterValue.toString().toLowerCase().trim());

const startsWith = <TData extends Record<string, any> = {}>(data: TData, id: string, filterValue: string | number) =>
  data[id]?.toString().toLowerCase().trim().startsWith(filterValue.toString().toLowerCase().trim());

const endsWith = <TData extends Record<string, any> = {}>(data: TData, id: string, filterValue: string | number) =>
  data[id]?.toString().toLowerCase().trim().endsWith(filterValue.toString().toLowerCase().trim());

const equals = <TData extends Record<string, any> = {}>(data: TData, id: string, filterValue: string | number) =>
  data[id]?.toString().toLowerCase().trim() === filterValue.toString().toLowerCase().trim();

const equalsAlt = <TData extends Record<string, any> = {}>(data: TData, id: string, filterValue: string | number) =>
  data[id]?.toString() === filterValue.toString();

const notEquals = <TData extends Record<string, any> = {}>(data: TData, id: string, filterValue: string | number) =>
  data[id]?.toString().toLowerCase().trim() !== filterValue.toString().toLowerCase().trim();

const greaterThan = <TData extends Record<string, any> = {}>(data: TData, id: string, filterValue: string | number) =>
  !isNaN(+filterValue) && !isNaN(+data[id])
    ? +data[id] > +filterValue
    : data[id]?.toString().toLowerCase().trim() > filterValue.toString().toLowerCase().trim();

const greaterThanOrEqualTo = <TData extends Record<string, any> = {}>(data: TData, id: string, filterValue: string | number) =>
  equals(data, id, filterValue) || greaterThan(data, id, filterValue);

const lessThan = <TData extends Record<string, any> = {}>(data: TData, id: string, filterValue: string | number) =>
  !isNaN(+filterValue) && !isNaN(+data[id])
    ? +data[id] < +filterValue
    : data[id]?.toString().toLowerCase().trim() < filterValue.toString().toLowerCase().trim();

const lessThanOrEqualTo = <TData extends Record<string, any> = {}>(data: TData, id: string, filterValue: string | number) =>
  equals(data, id, filterValue) || lessThan(data, id, filterValue);

const between = <TData extends Record<string, any> = {}>(data: TData, id: string, filterValues: [string | number, string | number]) =>
  (([StringExtensions.Empty, undefined] as any[]).includes(filterValues[0]) || greaterThan(data, id, filterValues[0])) &&
  ((!isNaN(+filterValues[0]) && !isNaN(+filterValues[1]) && +filterValues[0] > +filterValues[1]) ||
    ([StringExtensions.Empty, undefined] as any[]).includes(filterValues[1]) ||
    lessThan(data, id, filterValues[1]));

const betweenInclusive = <TData extends Record<string, any> = {}>(
  data: TData,
  id: string,
  filterValues: [string | number, string | number]
) =>
  (([StringExtensions.Empty, undefined] as any[]).includes(filterValues[0]) || greaterThanOrEqualTo(data, id, filterValues[0])) &&
  ((!isNaN(+filterValues[0]) && !isNaN(+filterValues[1]) && +filterValues[0] > +filterValues[1]) ||
    ([StringExtensions.Empty, undefined] as any[]).includes(filterValues[1]) ||
    lessThanOrEqualTo(data, id, filterValues[1]));

const empty = <TData extends Record<string, any> = {}>(data: TData, id: string, _filterValue?: string | number) =>
  !data[id]?.toString()?.trim();

const notEmpty = <TData extends Record<string, any> = {}>(data: TData, id: string, _filterValue?: string | number) =>
  !!data[id]?.toString()?.trim();

export const RDTFilters = {
  contains,
  startsWith,
  endsWith,
  equals,
  equalsAlt,
  notEquals,
  greaterThan,
  lessThan,
  greaterThanOrEqualTo,
  lessThanOrEqualTo,
  between,
  betweenInclusive,
  fuzzy,
  empty,
  notEmpty,
};
