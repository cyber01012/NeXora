package nexora_backend.auth.util;

public final class SensitiveDataMasker {

    private SensitiveDataMasker() {
    }

    public static String maskCnic(String cnic) {
        if (cnic == null || cnic.length() < 4) {
            return null;
        }
        return "*****-*******-" + cnic.substring(cnic.length() - 1);
    }

    public static String maskPhone(String phone) {
        if (phone == null || phone.length() < 4) {
            return null;
        }
        return "****" + phone.substring(phone.length() - 4);
    }
}
