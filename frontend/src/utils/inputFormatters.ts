/** Pakistani CNIC display format: XXXXX-XXXXXXX-X */
export const CNIC_PLACEHOLDER = "42201-1234567-1";
export const PHONE_PLACEHOLDER = "0300-1234567";
export const EMAIL_PLACEHOLDER = "name@example.com";
export const USERNAME_PLACEHOLDER = "your_username";
export const LOGIN_IDENTIFIER_HINT = `Email (${EMAIL_PLACEHOLDER}), phone (${PHONE_PLACEHOLDER}), or username (${USERNAME_PLACEHOLDER})`;

export function formatCnicInput(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 13);
  if (digits.length <= 5) {
    return digits;
  }
  if (digits.length <= 12) {
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }
  return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
}

export function formatPhoneInput(raw: string): string {
  let digits = raw.replace(/\D/g, "");

  if (digits.startsWith("92") && digits.length > 2) {
    digits = `0${digits.slice(2)}`;
  } else if (digits.startsWith("923") && digits.length > 3) {
    digits = `0${digits.slice(3)}`;
  }

  if (digits.length > 0 && !digits.startsWith("0") && digits.startsWith("3")) {
    digits = `0${digits}`;
  }

  digits = digits.slice(0, 11);

  if (digits.length <= 4) {
    return digits;
  }
  return `${digits.slice(0, 4)}-${digits.slice(4)}`;
}

export function stripCnicFormatting(value: string): string {
  return value.replace(/\D/g, "");
}

export function stripPhoneFormatting(value: string): string {
  return value.replace(/\D/g, "");
}

export function isCompleteCnic(value: string): boolean {
  return /^\d{5}-\d{7}-\d$/.test(value);
}

export function isCompletePhone(value: string): boolean {
  const digits = stripPhoneFormatting(value);
  return /^03\d{9}$/.test(digits);
}

/** Applies phone formatting while typing; leaves email and username unchanged. */
export function formatLoginIdentifierInput(raw: string): string {
  if (raw.includes("@") || /^[a-zA-Z]/.test(raw)) {
    return raw.replace(/\s/g, "");
  }

  const digits = raw.replace(/\D/g, "");
  if (digits.length === 0) {
    return raw.replace(/\s/g, "");
  }

  if (digits.startsWith("03") || (digits.startsWith("0") && digits.length <= 4)) {
    return formatPhoneInput(raw);
  }

  return raw.replace(/\s/g, "");
}

/** Normalizes login identifier before sending to the API. */
export function normalizeLoginIdentifier(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return trimmed;
  }

  if (trimmed.includes("@") || /^[a-zA-Z]/.test(trimmed)) {
    return trimmed;
  }

  const digits = stripPhoneFormatting(trimmed);
  if (digits.startsWith("03") && digits.length === 11) {
    return digits;
  }

  return trimmed.replace(/\s/g, "");
}
