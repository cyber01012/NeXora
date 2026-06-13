import { useEffect, useState } from 'react';
import LiveMap from '../../components/map/LiveMap';
import { citizenApi } from '../../services/api';

export default function CitizenLiveMap() {
  const [reports, setReports] = useState([]);
  const [zones, setZones] = useState([]);
  const [disasterMode, setDisasterMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      citizenApi.disasterZones().catch(() => []),
      citizenApi.myReports().catch(() => [])
    ]).then(([zonesData, reportsData]) => {
      setZones(zonesData);
      setReports(reportsData);
      setLoading(false);
    }).catch(() => setLoading(false));

    fetch('/api/disaster-mode/status')
      .then(res => res.json())
      .catch(() => ({ active: false }))
      .then(data => setDisasterMode(data.active));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="font-mono text-cyan-400 animate-pulse">[ LOADING MAP DATA... ]</div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-title text-glow-primary text-2xl tracking-wider">LIVE DISASTER MAP</h1>
        <p className="font-mono text-xs text-cyan-500/60 mt-1">[ REAL-TIME INCIDENT HEATMAP & ZONE MONITORING ]</p>
      </div>

      <LiveMap
        markers={reports}
        zones={zones}
        disasterMode={disasterMode}
        height="550px"
        showHeatmap={true}
        onMarkerClick={(report) => {
          alert(`Report: ${report.trackingCode || report.id}\nStatus: ${report.status}\nLocation: ${report.locationAddress}`);
        }}
      />
    </div>
  );
}