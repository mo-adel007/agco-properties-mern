export const convertCamelCaseToWords = (str) => {
  // Add space between camel case words and capitalize first letter
  const formatted = str.replace(/([A-Z])/g, ' $1').trim();
  // Capitalize first letter and rest of the words
  return formatted.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
