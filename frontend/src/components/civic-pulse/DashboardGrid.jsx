import React, { useState, useEffect } from 'react';
import { useDisasterMode } from '../../context/DisasterContext';
import { 
  Cloud, Zap, Moon, Droplets, Thermometer,
  MapPin, Clock, ChevronDown, AlertTriangle,
  Loader2
} from 'lucide-react';
import './CivicPulse.css';

const DashboardGrid = () => {
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('gulshan-e-iqbal');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isDisasterMode } = useDisasterMode();

  useEffect(() => {
    fetch('http://localhost:8080/api/regions')
      .then(res => res.json())
      .then(data => setRegions(data))
      .catch(err => console.error("Error fetching regions:", err));
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8080/api/dashboard?region=${selectedRegion}`)
      .then(res => res.json())
      .then(data => {
        setDashboardData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching dashboard:", err);
        setLoading(false);
      });
  }, [selectedRegion]);

  if (loading && !dashboardData) {
    return (
      <div className="loading-state">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary-glow)]" />
        <span className="mt-4 font-data text-sm tracking-widest uppercase text-[var(--primary-400)]">
          Syncing Regional Data...
        </span>
      </div>
    );
  }

  // Extract data from composite tree structure
  const prayerCard = dashboardData?.children?.find(c => c.title === 'Prayer Times');
  const weatherCard = dashboardData?.children?.find(c => c.title === 'Weather');
  const powerCard = dashboardData?.children?.find(c => c.title === 'Load Shedding');

  const getLeafValue = (card, leafTitle) => {
    return card?.children?.find(l => l.title === leafTitle)?.data || '--';
  };

  return (
    <div className="dashboard-container">
      {/* === HEADER: Date, Time, City === */}
      <div className={`dashboard-header ${isDisasterMode ? 'disaster' : ''}`}>
        <div className="header-left">
          <MapPin className="w-4 h-4 text-[var(--primary-400)]" />
          <span className="header-city font-data tracking-widest">KARACHI</span>
          <span className="header-divider" />
          <span className="header-date font-mono text-xs tracking-wider text-[var(--primary-400)]/60">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
            }).toUpperCase()}
          </span>
        </div>
        <div className="header-right">
          <Clock className="w-4 h-4 text-[var(--primary-400)]" />
          <span className="header-time font-data text-lg tracking-wider">
            {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* === PRAYER TIMES STRIP === */}
      {prayerCard && (
        <div className={`prayer-strip ${isDisasterMode ? 'disaster' : ''}`}>
          <div className="prayer-strip-inner">
            <Moon className="w-4 h-4 text-[var(--primary-400)]" />
            <span className="prayer-label font-data text-[10px] tracking-widest uppercase">Prayer Times</span>
            <div className="prayer-times">
              {['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map(prayer => (
                <div key={prayer} className="prayer-item">
                  <span className="prayer-name font-mono text-[9px] uppercase tracking-wider text-[var(--primary-400)]/50">
                    {prayer}
                  </span>
                  <span className="prayer-value font-data text-sm tracking-wide">
                    {getLeafValue(prayerCard, prayer)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* === REGION SELECTOR === */}
      <div className="region-selector-bar">
        <div className="region-selector-inner">
          <MapPin className="w-4 h-4 text-[var(--primary-400)]" />
          <label className="font-data text-[10px] tracking-widest uppercase text-[var(--primary-400)]/60">
            Operational Region
          </label>
          <div className="region-select-wrapper">
            <select 
              value={selectedRegion} 
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="region-select"
            >
              {regions.map(r => (
                <option key={r} value={r}>
                  {r.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 region-select-icon" />
          </div>
        </div>
      </div>

      {/* === DASHBOARD CARDS === */}
      <div className="dashboard-grid">
        {/* WEATHER CARD */}
        {weatherCard && (
          <div className={`civic-card weather ${isDisasterMode ? 'disaster' : ''}`}>
            <div className="card-header">
              <Cloud className="w-5 h-5 text-[var(--primary-400)]" />
              <span className="card-title font-data text-xs tracking-widest uppercase">Weather</span>
              {isDisasterMode && <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />}
            </div>
            <div className="card-body">
              <div className="weather-main">
                <Thermometer className="w-6 h-6 text-[var(--primary-400)]" />
                <span className="weather-temp font-data text-3xl tracking-tight">
                  {getLeafValue(weatherCard, 'Temperature')}
                </span>
              </div>
              <div className="weather-details">
                <div className="data-row">
                  <span className="data-label font-mono text-[9px] uppercase tracking-wider">Feels Like</span>
                  <span className="data-value font-data text-sm text-[var(--primary-300)]">{getLeafValue(weatherCard, 'Feels Like')}</span>
                </div>
                <div className="data-row">
                  <span className="data-label font-mono text-[9px] uppercase tracking-wider">Humidity</span>
                  <span className="data-value font-data text-sm">{getLeafValue(weatherCard, 'Humidity')}</span>
                </div>
                <div className="data-row">
                  <span className="data-label font-mono text-[9px] uppercase tracking-wider">Rain Chance</span>
                  <span className="data-value font-data text-sm flex items-center gap-2">
                    <Droplets className="w-3 h-3" />
                    {getLeafValue(weatherCard, 'Rain Chance')}
                  </span>
                </div>
                {/* Rain periods if any */}
                {weatherCard.children?.filter(l => l.title === 'Rain Period').map((period, i) => (
                  <div key={i} className="data-row rain-period">
                    <span className="data-label font-mono text-[9px] uppercase tracking-wider">Period {i+1}</span>
                    <span className="data-value font-mono text-xs text-[var(--primary-400)]">{period.data}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* LOAD SHEDDING CARD */}
        {powerCard && (
          <div className={`civic-card power ${isDisasterMode ? 'disaster' : ''}`}>
            <div className="card-header">
              <Zap className="w-5 h-5 text-[var(--primary-400)]" />
              <span className="card-title font-data text-xs tracking-widest uppercase">Load Shedding</span>
            </div>
            <div className="card-body">
              <div className="power-status">
                <div className="power-indicator" />
                <span className="power-status-text font-mono text-[10px] uppercase tracking-widest text-[var(--primary-400)]/60">
                  Schedule Active
                </span>
              </div>
              <div className="power-slots">
                {powerCard.children?.map((slot, i) => (
                  <div key={i} className="power-slot">
                    <Clock className="w-3 h-3 text-[var(--primary-400)]/40" />
                    <span className="slot-time font-data text-sm tracking-wide">{slot.data}</span>
                    <span className="slot-label font-mono text-[8px] uppercase tracking-wider text-[var(--primary-400)]/40">
                      Slot {i + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardGrid;