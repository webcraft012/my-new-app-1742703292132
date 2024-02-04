/**
 * Creates a reverse mapping of a record.
 * @param record - The record to create a reverse mapping of.
 * @returns The reverse mapping.

 */
export const createReverseMapping = <
  K extends string | number,
  V extends string | number,
>(
  record: Record<K, V>,
): Record<V, K> => {
  const reverse: Record<string | number, K> = {};
  for (const [key, value] of Object.entries(record)) {
    reverse[value as V] = key as K;
  }
  return reverse as Record<V, K>;
};
