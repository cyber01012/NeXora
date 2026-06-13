package nexora_backend.insight.util;

public class TimeClassifier {

    public static String classifyTime(String isoTime) {
        int hour = Integer.parseInt(isoTime.substring(11, 13));

        if (hour >= 5 && hour < 12) return "morning";
        if (hour >= 12 && hour < 17) return "afternoon";
        if (hour >= 17 && hour < 20) return "evening";
        if (hour >= 20 || hour < 5) return "night";

        return "unknown";
    }

    public static String formatTime(String isoTime) {
        int hour = Integer.parseInt(isoTime.substring(11, 13));
        int minute = Integer.parseInt(isoTime.substring(14, 16));

        String ampm = hour >= 12 ? "PM" : "AM";
        int displayHour = hour > 12 ? hour - 12 : (hour == 0 ? 12 : hour);

        return String.format("%d:%02d %s", displayHour, minute, ampm);
    }
}
