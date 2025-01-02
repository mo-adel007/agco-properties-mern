import he from 'he'

export default function formatRichText(text) {
  if (!text) return '';
  
  // Decode HTML entities
  let decodedText = he.decode(text);
  
  // Remove any remaining HTML tags while preserving line breaks
  decodedText = decodedText.replace(/<br\s*\/?>/gi, '\n');
  decodedText = decodedText.replace(/<\/p>/gi, '\n');
  decodedText = decodedText.replace(/<[^>]*>/g, '');
  
  return decodedText.trim();
}
