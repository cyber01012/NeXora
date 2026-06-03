import React, { useEffect } from 'react';
import { useDisasterMode } from '../../context/DisasterContext';
import { X, AlertTriangle } from 'lucide-react';
import DashboardGrid from './DashboardGrid';
import ChatWidget from './ChatWidget';
import './CivicPulse.css';

const PulseModal = ({ onClose }) => {
  const { isDisasterMode } = useDisasterMode();

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="pulse-backdrop" onClick={onClose}>
      <div className="pulse-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className={`pulse-modal-header ${isDisasterMode ? 'disaster' : ''}`}>
          <div className="pulse-modal-title">
            <span className="title-bracket">[</span>
            NEXORA CIVIC PULSE
            <span className="title-bracket">]</span>
          </div>
          <button className="pulse-close" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Disaster Banner */}
        {isDisasterMode && (
          <div className="disaster-banner">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-data text-[10px] tracking-[0.3em] uppercase">
              Disaster Mode Active — Critical Civic Alert
            </span>
            <AlertTriangle className="w-4 h-4" />
          </div>
        )}

        {/* Modal Content */}
        <div className="pulse-modal-content">
          <div className="pulse-layout">
            {/* Left: Dashboard */}
            <div className="pulse-dashboard-panel">
              <DashboardGrid />
            </div>

            {/* Right: Chat */}
            <div className="pulse-chat-panel">
              <ChatWidget />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PulseModal;