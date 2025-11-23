export const FormatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + " M"; // For millions
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + " k"; // For thousnads
  } else {
    return num;
  }
};
