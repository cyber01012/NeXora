package nexora_backend.auth.util;

import java.util.regex.Pattern;

public final class CnicValidator {

    private static final Pattern CNIC_PATTERN = Pattern.compile("^\\d{5}-?\\d{7}-?\\d$");

    private CnicValidator() {
    }

    public static boolean isValidFormat(String cnic) {
        if (cnic == null || cnic.isBlank()) {
            return false;
        }
        return CNIC_PATTERN.matcher(cnic.trim()).matches();
    }

    public static String normalize(String cnic) {
        return cnic.replaceAll("-", "").trim();
    }
}
