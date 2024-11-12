export function binaryStringToHex(binaryString: string) {
  // Check if the string is a valid binary string
  if (!/^[01]+$/.test(binaryString)) {
    return "Invalid binary string";
  }

  // Pad the string with zeros to make it a multiple of 4 bits
  while (binaryString.length % 4 !== 0) {
    binaryString = "0" + binaryString;
  }

  let hexString = "";

  // Convert each group of 4 bits to a hex digit
  for (let i = 0; i < binaryString.length; i += 4) {
    const binaryDigit = binaryString.substr(i, 4);
    const decimalDigit = parseInt(binaryDigit, 2);
    hexString += decimalDigit.toString(16).toUpperCase();
  }

  return hexString;
}


export function binaryToUrlSafe(binaryString: string) {
  // Convert the binary string to a number
  const decimal = parseInt(binaryString, 2);

  // Convert the number to base36 (alphanumeric)
  return decimal.toString(36);
}

export function urlSafeToBinary(urlSafeString: string) {
  // Convert the base36 string to a decimal number
  const decimal = parseInt(urlSafeString, 36);

  // Convert the decimal number to binary
  return decimal.toString(2);
}

export function binaryToCharArray(binaryString: string) {
  let result: string[] = [];

  // Split the binary string into 8-bit chunks
  for (let i = 0; i < binaryString.length; i += 36) {
    const chunk = binaryString.slice(i, i + 36);

    result.push(`${binaryToUrlSafe(chunk)}`);
  }

  return result.join(',');
}

export function charArrayToBinaryArray(arrayString: string) {
  return arrayString.split(',').map(a=>urlSafeToBinary(a))
}