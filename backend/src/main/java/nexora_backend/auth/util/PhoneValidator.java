package nexora_backend.auth.util;



/**
 * Validates Pakistani mobile/contact numbers.
 * Accepts: 03XXXXXXXXX, +923XXXXXXXXX, 923XXXXXXXXX (with optional spaces/dashes).
 */
public final class PhoneValidator {



    private PhoneValidator() {
    }

    public static boolean isValidFormat(String phone) {
        if (phone == null || phone.isBlank()) {
            return false;
        }
        String normalized = normalize(phone);
        return normalized.length() == 11 && normalized.startsWith("03") && normalized.chars().allMatch(Character::isDigit);
    }

    public static String normalize(String phone) {
        String digits = phone.replaceAll("[\\s-]", "").trim();
        if (digits.startsWith("+92")) {
            digits = "0" + digits.substring(3);
        } else if (digits.startsWith("92") && digits.length() == 12) {
            digits = "0" + digits.substring(2);
        }
        return digits;
    }
}
