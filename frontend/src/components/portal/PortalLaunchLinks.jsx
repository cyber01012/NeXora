import { Link } from 'react-router-dom';

/** Quick entry points to Citizen / Responder portals (use on any page). */
export default function PortalLaunchLinks({ className = '' }) {
  return (
    <div className={`flex flex-wrap gap-4 font-data text-sm ${className}`}>
      <Link to="/citizen" className="px-4 py-2 hud-glass rounded border-hud text-glow-primary">
        Citizen Portal
      </Link>
      <Link to="/responder" className="px-4 py-2 hud-glass rounded border-hud text-glow-primary">
        Responder Portal
      </Link>
    </div>
  );
}
