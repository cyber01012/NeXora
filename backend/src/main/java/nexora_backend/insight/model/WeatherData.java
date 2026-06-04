package nexora_backend.insight.model;

import java.util.List;

public class WeatherData {
    private double temp;
    private double apparentTemp;
    private int humidity;
    private int rainChance;
    private String condition;
    private String dayNight;
    private List<RainPeriod> rainPeriods;

    public WeatherData(double temp, double apparentTemp, int humidity, int rainChance, 
                       String condition, String dayNight, List<RainPeriod> rainPeriods) {
        this.temp = temp;
        this.apparentTemp = apparentTemp;
        this.humidity = humidity;
        this.rainChance = rainChance;
        this.condition = condition;
        this.dayNight = dayNight;
        this.rainPeriods = rainPeriods;
    }

    public double getTemp() { return temp; }
    public double getApparentTemp() { return apparentTemp; }
    public int getHumidity() { return humidity; }
    public int getRainChance() { return rainChance; }
    public String getCondition() { return condition; }
    public String getDayNight() { return dayNight; }
    public List<RainPeriod> getRainPeriods() { return rainPeriods; }
    public boolean hasRainPeriods() { 
        return rainPeriods != null && !rainPeriods.isEmpty(); 
    }
}
