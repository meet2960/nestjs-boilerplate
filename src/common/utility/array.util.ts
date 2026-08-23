import _ from 'lodash';

/**
 * Finds an object in an array where the nested key path matches the given value.
 *
 * @param {Array<object>} array - The array to search.
 * @param {string} keyPath - Dot-separated key path (e.g., 'user.profile.name').
 * @param {*} value - The value to match.
 * @returns {object|null} - The matched object or null if not found.
 */
export function findObjFromArrByKey<T>(
  array: T[],
  keyPath: string,
  value: any,
): T | null {
  return array.find((obj) => _.get(obj, keyPath) === value) ?? null;
}

export function filterArrByKey<T>(
  array: T[],
  property: keyof T,
  value: T[keyof T],
): T[] {
  return _.filter(array, (item) => item[property] === value);
}

export function sortArrByKey<T>(array: T[], property: keyof T): T[] {
  return _.sortBy(array, property);
}

export function sortArrByMultipleKeys<T>(
  array: T[],
  keys: string[],
  sortOrder: 'asc' | 'desc' = 'asc',
): T[] {
  const iteratees = keys.map((key) => (item: any) => _.get(item, key));
  return _.orderBy(
    array,
    iteratees,
    keys.map(() => sortOrder),
  );
}

export function cleanCommaSeparatedString(input?: string | null) {
  if (input && _.includes(input, ',')) {
    return input
      ?.split(',')
      ?.map((item) => item.trim())
      ?.join(',');
  } else {
    return input?.trim();
  }
}
