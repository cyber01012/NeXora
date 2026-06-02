package nexora_backend.auth.util;

import java.util.regex.Pattern;

/**
 * Validates Pakistani mobile/contact numbers.
 * Accepts: 03XXXXXXXXX, +923XXXXXXXXX, 923XXXXXXXXX (with optional spaces/dashes).
 */
public final class PhoneValidator {

    private static final Pattern PHONE_PATTERN = Pattern.compile(
            "^(?:\\+92|92|0)?3[0-9]{2}[\\s-]?[0-9]{7}$"
    );

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
