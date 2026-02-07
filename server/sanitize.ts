const CONTROL_CHARS = /[\u0000-\u001F\u007F-\u009F]/g;

export const sanitizeInput = (value: string, maxLength = 500) => {
  if (!value) {
    return '';
  }
  const trimmed = value.replace(CONTROL_CHARS, '').trim();
  return trimmed.length > maxLength ? trimmed.slice(0, maxLength) : trimmed;
};
