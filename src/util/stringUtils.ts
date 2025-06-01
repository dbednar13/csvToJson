export function trimPropertyName(
  isTrimHeaderFieldWhiteSpace: boolean,
  value: string
): string {
  if (isTrimHeaderFieldWhiteSpace) {
    return value.replace(/\s/g, '');
  }
  return value.trim();
}

export function getValueFormatByType(
  value: string | undefined
): string | number | boolean {
  let retVal: string | number | boolean | undefined = value;
  if (value === undefined || value === '') {
    retVal = '';
  } else if (
    !isNaN(Number(value)) &&
    typeof value === 'string' &&
    value.trim() !== ''
  ) {
    retVal = Number(value);
  } else if (value === 'true' || value === 'false') {
    retVal = value === 'true';
  }
  return retVal!;
}

export default {
  trimPropertyName,
  getValueFormatByType,
};
