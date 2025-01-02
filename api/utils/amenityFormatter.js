export function formatAmenities(amenities = {}) {
  return Object.keys(amenities).reduce((acc, key) => {
    if (amenities[key] === true) {
      acc[convertCamelCaseToWords(key)] = true;
    }
    return acc;
  }, {});
}
