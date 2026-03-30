/**
 * Adds a specified alias to each field in a list of table fields.
 *
 * @param alias - The alias to prepend to each field in the format `alias.field`.
 * @param tableFields - An array of field names (strings) to which the alias should be added.
 *
 * @returns An array of strings where each field is prefixed with the specified alias.
 *
 * @example
 * // Input fields
 * const alias = 'user';
 * const tableFields = ['id', 'name', 'email'];
 *
 * // Add alias to fields
 * const result = addAliasToFields(alias, tableFields);
 * console.log(result); // Output: ['user.id', 'user.name', 'user.email']
 */
export function addAliasToFields(alias: string, tableFields: string[]) {
  const transformedArray = tableFields.map((field) => `${alias}.${field}`);
  return transformedArray;
}

/**
 * Retrieves specific fields (keys) from an object (typically a class instance) based on the provided mode.
 *
 * @template T - The type of the object (class instance) passed as `rootClass`.
 * @template R - The type of the keys of the object (`keyof T`).
 *
 * @param rootClass - The object or class instance from which keys are extracted.
 * @param mode - Determines the retrieval mode:
 *    - `'all'`: Returns all keys from the object.
 *    - `'custom'`: Returns only the keys specified in the `fields` array.
 * @param fields - An array of keys to retrieve when `mode` is `'custom'`. Defaults to an empty array.
 *
 * @returns An array of strings representing the selected keys.
 *
 * @example
 * // Define a class
 * class User {
 *   id: number = 0;
 *   name: string = '';
 *   email: string = '';
 * }
 *
 * // Create an instance of the class
 * const userInstance = new User();
 *
 * // Retrieve all keys
 * const allFields = getColumnFields(userInstance, 'all');
 * console.log(allFields); // Output: ['id', 'name', 'email']
 *
 * // Retrieve specific keys
 * const customFields = getColumnFields(userInstance, 'custom', ['id', 'email']);
 * console.log(customFields); // Output: ['id', 'email']
 *
 * // Retrieve custom keys with an empty fields array
 * const noFields = getColumnFields(userInstance, 'custom');
 * console.log(noFields); // Output: []
 */

export function getColumnFields<T extends object, R extends keyof T>(
  rootClass: T,
  mode: 'all' | 'custom',
  fields: R[] = [],
): string[] {
  const allKeys = Object.keys(rootClass) as R[];
  if (mode === 'all') {
    return allKeys.map((key) => key.toString());
  }
  if (mode === 'custom' && fields.length > 0) {
    const selectedKeys = allKeys.filter((key) => fields.includes(key));
    return selectedKeys.map((key) => key.toString());
  }
  return [];
}

/**
 * Filters the input object and returns the selected keys as an array of strings.
 * @param fieldsObject - The object containing key-value pairs.
 * @param keys - The keys to select from the object.
 * @returns An array of selected strings.
 */
export function getSelectedFields<T extends object, K extends keyof T>(
  fieldsObject: T,
  keys: K[],
): Array<T[K]> {
  if (!fieldsObject) {
    return [];
  }
  return keys.map((key) => fieldsObject[key]);
}
