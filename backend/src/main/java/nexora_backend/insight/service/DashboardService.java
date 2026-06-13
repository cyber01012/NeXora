package nexora_backend.insight.service;

import nexora_backend.insight.composite.*;
import nexora_backend.insight.model.*;
import nexora_backend.insight.store.MockDataStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import nexora_backend.insight.model.PowerSchedule;
import nexora_backend.insight.model.RainPeriod;
import nexora_backend.insight.util.TimeClassifier;

import java.util.ArrayList;
import java.util.List;

@Service
public class DashboardService {

    @Autowired private WeatherService weatherService;
    @Autowired private PrayerService prayerService;
    @Autowired private MockDataStore mockDataStore;

    /**
     * Builds the composite tree for a region
     * CORE of Composite Pattern implementation
     */
    public AreaDashboard buildDashboard(String region) {
        List<CivicComponent> cards = new ArrayList<>();

        // 1. Prayer Times Card (same for all Karachi, real API)
        PrayerTimes prayer = prayerService.getPrayerTimes();
        cards.add(new InfoCard("Prayer Times", "religious", List.of(
            new DataLeaf("Fajr", "prayer", prayer.getFajr()),
            new DataLeaf("Sunrise", "prayer", prayer.getSunrise()),
            new DataLeaf("Dhuhr", "prayer", prayer.getDhuhr()),
            new DataLeaf("Asr", "prayer", prayer.getAsr()),
            new DataLeaf("Maghrib", "prayer", prayer.getMaghrib()),
            new DataLeaf("Isha", "prayer", prayer.getIsha())
        )));

        // 2. Weather Card (region-specific, real API)
        WeatherData weather = weatherService.getWeather(region);
        List<CivicComponent> weatherLeaves = new ArrayList<>();
        weatherLeaves.add(new DataLeaf("Temperature", "weather", weather.getTemp() + "°C"));
        weatherLeaves.add(new DataLeaf("Feels Like", "weather", weather.getApparentTemp() + "°C"));
        weatherLeaves.add(new DataLeaf("Humidity", "weather", weather.getHumidity() + "%"));
        weatherLeaves.add(new DataLeaf("Rain Chance", "weather", weather.getRainChance() + "%"));
        if (weather.hasRainPeriods()) {
            for (RainPeriod period : weather.getRainPeriods()) {
                weatherLeaves.add(new DataLeaf(
                    "Rain Period", 
                    "weather", 
                    TimeClassifier.formatTime(period.getStart()) + " - " + 
                    TimeClassifier.formatTime(period.getEnd()) + " (" + period.getMaxChance() + "%)"
                ));
            }
        }
        cards.add(new InfoCard("Weather", "civic", weatherLeaves));

        // 3. Load Shedding Card (region-specific, mock data)
        PowerSchedule power = mockDataStore.getPowerSchedule(region);
        List<CivicComponent> powerLeaves = new ArrayList<>();
        for (String slot : power.getSlots()) {
            powerLeaves.add(new DataLeaf("Slot", "power", slot));
        }
        cards.add(new InfoCard("Load Shedding", "power", powerLeaves));

        // Build root composite
        return new AreaDashboard(region, cards);
    }
}