package nexora_backend.insight.service;

import nexora_backend.insight.model.PrayerTimes;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class PrayerService {

    private final RestTemplate restTemplate = new RestTemplate();

    public PrayerTimes getPrayerTimes() {
        String url = "https://api.aladhan.com/v1/timings?" +
                     "latitude=24.8607&longitude=67.0011&" +
                     "method=1&school=1&timezonestring=Asia/Karachi";

        Map<String, Object> response = restTemplate.getForObject(url, Map.class);
        Map<String, Object> data = (Map<String, Object>) response.get("data");
        Map<String, Object> timings = (Map<String, Object>) data.get("timings");

        return new PrayerTimes(
            formatTime((String) timings.get("Fajr")),
            formatTime((String) timings.get("Sunrise")),
            formatTime((String) timings.get("Dhuhr")),
            formatTime((String) timings.get("Asr")),
            formatTime((String) timings.get("Maghrib")),
            formatTime((String) timings.get("Isha"))
        );
    }

    private String formatTime(String time24) {
        try {
            String[] parts = time24.split(":");
            int hours = Integer.parseInt(parts[0]);
            int minutes = Integer.parseInt(parts[1]);
            String period = hours >= 12 ? "PM" : "AM";
            hours = hours % 12;
            if (hours == 0) hours = 12;
            return String.format("%d:%02d %s", hours, minutes, period);
        } catch (Exception e) {
            return time24;
        }
    }
}
