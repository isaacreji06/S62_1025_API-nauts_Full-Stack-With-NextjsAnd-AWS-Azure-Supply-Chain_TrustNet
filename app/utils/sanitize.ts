// app/utils/sanitize.ts

/**
 * Basic HTML sanitization to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  if (!input) return input;

  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .replace(/\\/g, "&#x5C;")
    .replace(/`/g, "&#96;");
}

/**
 * Sanitize for display in HTML (allows basic formatting but prevents scripts)
 */
export function sanitizeForDisplay(input: string): string {
  if (!input) return input;

  // Allow basic formatting but remove scripts and dangerous tags
  const sanitized = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/on\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");

  return sanitized;
}

/**
 * Validate and sanitize phone numbers
 */
export function sanitizePhone(phone: string): string {
  if (!phone) return phone;

  // Remove all non-digit characters except +
  const sanitized = phone.replace(/[^\d+]/g, "");

  // Basic validation for Indian phone numbers
  if (sanitized.startsWith("+91") && sanitized.length !== 13) {
    throw new Error("Invalid Indian phone number format");
  }

  if (sanitized.startsWith("91") && sanitized.length !== 12) {
    throw new Error("Invalid Indian phone number format");
  }

  if (
    !sanitized.startsWith("+") &&
    !sanitized.startsWith("91") &&
    sanitized.length !== 10
  ) {
    throw new Error("Invalid phone number format");
  }

  return sanitized;
}
