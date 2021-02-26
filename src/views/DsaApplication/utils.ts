/**
 * Return "maximum" progress value
 */
export function getMaxProgress(oldValue: string, newValue: string): string {
  const oldNumber = Number(oldValue);
  if (oldNumber === NaN) return oldValue;

  const newNumber = Number(newValue);
  if (newNumber === NaN) return newValue;

  return String(Math.max(oldNumber, newNumber));
}
