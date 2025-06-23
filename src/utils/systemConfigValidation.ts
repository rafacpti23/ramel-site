
// Utility function to validate URLs
export const validateUrl = (url: string): boolean => {
  if (!url) return true; // Empty URLs are allowed
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

// Validate all webhook URLs
export const validateWebhookUrls = (
  contactFormUrl: string,
  ticketResponseUrl: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (contactFormUrl && !validateUrl(contactFormUrl)) {
    errors.push("O formato da URL do webhook de contato é inválido.");
  }
  
  if (ticketResponseUrl && !validateUrl(ticketResponseUrl)) {
    errors.push("O formato da URL do webhook de ticket é inválido.");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
