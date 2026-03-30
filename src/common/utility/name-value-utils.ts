import type { INameValueArr } from '../entity/INameValue';

export function createNameValueArray(
  dataList: string | undefined | null,
): INameValueArr {
  const returnValue: INameValueArr = [];
  if (!dataList) return returnValue;
  if (dataList) {
    const dataArr = dataList
      ?.split(',')
      .filter((i) => i.length !== 0)
      .map((item) => ({
        name: item.trim(),
        value: item.trim(),
      }));

    return returnValue.concat(dataArr);
  }
  return returnValue;
}

export function createNameValueArrayFromData<T>(
  dataList: T[],
  nameKey: keyof T,
  valueKey: keyof T,
): INameValueArr {
  const returnValue: INameValueArr = [];
  if (!dataList) return returnValue;
  if (dataList) {
    const dataArr = dataList.map((item) => ({
      name: item[nameKey] as string,
      value: item[valueKey] as string,
    }));

    return returnValue.concat(dataArr);
  }

  return returnValue;
}

/**
 * Extracts the `value` field from an array of name-value objects.
 *
 * @param arr - Array of objects with shape { name: string, value: string }
 * @returns Array of `value` strings
 */
export function extractValuesFromNameValueArray(arr: INameValueArr): string[] {
  return arr.map((item) => item.value);
}
