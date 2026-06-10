import { useEffect, useState } from 'react';
import LiveMap from '../../components/map/LiveMap';
import { responderApi } from '../../services/api';

export default function ResponderLiveMap() {
  const [tasks, setTasks] = useState([]);
  const [disasterMode, setDisasterMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    responderApi.tasks()
      .then(setTasks)
      .catch(() => [])
      .finally(() => setLoading(false));
    
    fetch('/api/disaster-mode/status')
      .then(res => res.json())
      .catch(() => ({ active: false }))
      .then(data => setDisasterMode(data.active));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="font-mono text-cyan-400 animate-pulse">[ LOADING TASKS... ]</div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-title text-glow-primary text-2xl tracking-wider">TASK MONITORING MAP</h1>
        <p className="font-mono text-xs text-cyan-500/60 mt-1">[ REAL-TIME TASK HEATMAP & LOCATION TRACKING ]</p>
      </div>

      <LiveMap
        markers={tasks}
        disasterMode={disasterMode}
        height="550px"
        showHeatmap={true}
        onMarkerClick={(task) => {
          alert(`Task: ${task.title}\nStatus: ${task.status}\nPriority: ${task.priority}`);
        }}
      />
    </div>
  );
}