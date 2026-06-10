package nexora_backend.insight.service;

import nexora_backend.insight.model.RainPeriod;
import nexora_backend.insight.model.RegionCoords;
import nexora_backend.insight.model.WeatherData;
import nexora_backend.insight.store.MockDataStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class WeatherService {

    @Autowired
    private MockDataStore mockDataStore;

    private final RestTemplate restTemplate = new RestTemplate();

    public WeatherData getWeather(String region) {
        RegionCoords coords = mockDataStore.getRegionCoords(region);

        String url = String.format(
            "https://api.open-meteo.com/v1/forecast?" +
            "latitude=%.4f&longitude=%.4f" +
            "&current=temperature_2m,apparent_temperature,relative_humidity_2m,is_day,weather_code" +
            "&hourly=temperature_2m,precipitation_probability" +
            "&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max" +
            "&timezone=Asia/Karachi&forecast_days=1",
            coords.getLat(), coords.getLon()
        );

        Map<String, Object> response = restTemplate.getForObject(url, Map.class);

        if (response == null || !response.containsKey("current")) {
            return new WeatherData(0, 0, 0, 0, "Service Unavailable", "day", new ArrayList<>());
        }

        Map<String, Object> current = (Map<String, Object>) response.get("current");
        double temp = current.containsKey("temperature_2m") ? ((Number) current.get("temperature_2m")).doubleValue() : 0.0;
        double apparentTemp = current.containsKey("apparent_temperature") ? ((Number) current.get("apparent_temperature")).doubleValue() : 0.0;
        int humidity = current.containsKey("relative_humidity_2m") ? ((Number) current.get("relative_humidity_2m")).intValue() : 0;
        int isDay = current.containsKey("is_day") ? ((Number) current.get("is_day")).intValue() : 1;
        int weatherCode = current.containsKey("weather_code") ? ((Number) current.get("weather_code")).intValue() : 0;

        int rainChance = 0;
        if (response.containsKey("daily")) {
            Map<String, Object> daily = (Map<String, Object>) response.get("daily");
            if (daily.containsKey("precipitation_probability_max")) {
                List<Number> dailyRain = (List<Number>) daily.get("precipitation_probability_max");
                if (!dailyRain.isEmpty()) {
                    rainChance = dailyRain.get(0).intValue();
                }
            }
        }

        List<RainPeriod> rainPeriods = new ArrayList<>();
        if (response.containsKey("hourly")) {
            Map<String, Object> hourly = (Map<String, Object>) response.get("hourly");
            rainPeriods = extractRainPeriods(hourly);
        }

        String condition = getWeatherCondition(weatherCode);
        String dayNight = isDay == 1 ? "day" : "night";

        return new WeatherData(temp, apparentTemp, humidity, rainChance, condition, dayNight, rainPeriods);
    }

    private List<RainPeriod> extractRainPeriods(Map<String, Object> hourly) {
        List<RainPeriod> periods = new ArrayList<>();
        if (hourly == null || !hourly.containsKey("time") || !hourly.containsKey("precipitation_probability")) {
            return periods;
        }

        List<String> times = (List<String>) hourly.get("time");
        List<Number> rainProbs = (List<Number>) hourly.get("precipitation_probability");
        
        if (times == null || rainProbs == null) return periods;

        String currentStart = null;
        String currentEnd = null;
        int currentMax = 0;

        for (int i = 0; i < Math.min(times.size(), rainProbs.size()); i++) {
            String time = times.get(i);
            int prob = rainProbs.get(i).intValue();

            if (prob >= 50) {
                if (currentStart == null) {
                    currentStart = time;
                    currentMax = prob;
                }
                currentEnd = time;
                currentMax = Math.max(currentMax, prob);
            } else {
                if (currentStart != null) {
                    periods.add(new RainPeriod(currentStart, currentEnd, currentMax));
                    currentStart = null;
                    currentEnd = null;
                    currentMax = 0;
                }
            }
        }

        if (currentStart != null) {
            periods.add(new RainPeriod(currentStart, currentEnd, currentMax));
        }

        return periods;
    }

    private String getWeatherCondition(int code) {
        return switch (code) {
            case 0 -> "Clear sky";
            case 1, 2, 3 -> "Partly cloudy";
            case 45, 48 -> "Foggy";
            case 51, 53, 55 -> "Drizzle";
            case 61, 63, 65 -> "Rainy";
            case 66, 67 -> "Freezing rain";
            case 71, 73, 75 -> "Snowy";
            case 77 -> "Snow grains";
            case 80, 81, 82 -> "Rain showers";
            case 85, 86 -> "Snow showers";
            case 95, 96, 99 -> "Thunderstorm";
            default -> "Unknown (" + code + ")";
        };
    }
}
