function concatStringOnArrayOfStrings(array, string, i) {
    i %= array.length || 1;
    if (i < 0)
        i += array.length;
    if (array[i])
        array[i] = array[i].length == 0 ? string : array[i]+string;
    else
        array[i] = string;
}

export function parseCSVline(string, i = 0, escaped = false, array = []) {
    if (i == string.length)
        return array;
    const currentChar = string[i];
    if (escaped) {
        concatStringOnArrayOfStrings(array, currentChar, -1);
        return parseCSVline(string, ++i, false, array);
    }
    if (currentChar == ',')
        array.push('');
    else if (currentChar == '\\')
        escaped = true;
    else
        concatStringOnArrayOfStrings(array, currentChar, -1);
    return parseCSVline(string, ++i, escaped, array);
}

export function formatDateTime(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
