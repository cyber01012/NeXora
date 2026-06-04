package nexora_backend.insight.model;

public class PrayerTimes {
    private String fajr;
    private String sunrise;
    private String dhuhr;
    private String asr;
    private String maghrib;
    private String isha;

    public PrayerTimes(String fajr, String sunrise, String dhuhr, 
                       String asr, String maghrib, String isha) {
        this.fajr = fajr;
        this.sunrise = sunrise;
        this.dhuhr = dhuhr;
        this.asr = asr;
        this.maghrib = maghrib;
        this.isha = isha;
    }

    public String getFajr() { return fajr; }
    public String getSunrise() { return sunrise; }
    public String getDhuhr() { return dhuhr; }
    public String getAsr() { return asr; }
    public String getMaghrib() { return maghrib; }
    public String getIsha() { return isha; }
}
