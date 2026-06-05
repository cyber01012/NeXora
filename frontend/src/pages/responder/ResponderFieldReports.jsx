import { useEffect, useState } from 'react';
import { responderApi, forwardDecisionApi } from '../../services/api';
import {
  PhotoIcon,
  CheckCircleIcon,
  ClockIcon,
  XMarkIcon,
  ArrowPathIcon,
  UserIcon,
  CalendarIcon,
  MapPinIcon,
  DocumentTextIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

// ========== EVIDENCE MODAL COMPONENT ==========
const EvidenceModal = ({ evidence, onClose }) => {
  if (!evidence) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 animate-fadeIn" onClick={onClose}>
      <div className="max-w-4xl w-full mx-4 bg-[var(--bg2)] border border-cyan-500/30 rounded-2xl overflow-hidden animate-scaleIn" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-cyan-500/20 flex justify-between items-center">
          <h3 className="font-title text-glow-primary text-lg tracking-wider flex items-center gap-2">
            <PhotoIcon className="w-5 h-5" /> EVIDENCE
          </h3>
          <button onClick={onClose} className="text-cyan-400/60 hover:text-cyan-400 transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          {evidence.evidence && (
            <img 
              src={evidence.evidence} 
              alt="Evidence" 
              className="max-w-full max-h-[60vh] mx-auto rounded-lg"
              onError={(e) => { e.target.src = 'https://placehold.co/600x400/0a1628/06b6d4?text=No+Image'; }}
            />
          )}
          {evidence.description && (
            <div className="mt-4 p-3 bg-cyan-900/20 rounded-lg border border-cyan-500/20">
              <p className="font-mono text-[9px] text-cyan-400/60 mb-1 flex items-center gap-1">
                <DocumentTextIcon className="w-3 h-3" /> VOLUNTEER NOTES
              </p>
              <p className="font-mono text-sm text-cyan-200 leading-relaxed">{evidence.description}</p>
            </div>
          )}
          <div className="mt-4 flex justify-between text-[10px] font-mono text-cyan-400/60">
            <span>Submitted: {evidence.date ? `${evidence.date} ${evidence.time || ''}` : 'N/A'}</span>
            <span>Complaint ID: {evidence.forwardedComplaint?.forwardedComplainId || 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ========== FIELD REPORT CARD COMPONENT ==========
const FieldReportCard = ({ report, onViewEvidence, onConfirmComplete, isConfirming }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatTime = (time) => {
    if (!time) return 'N/A';
    return time;
  };

  const isCompleted = report.workerDecision === 'D' || report.completed === true;

  return (
    <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl overflow-hidden transition-all duration-300 hover:border-cyan-500/30">
      {/* Card Header */}
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-data text-md text-glow-primary">
                Complaint #{report.forwardedComplainId}
              </p>
              <span className={`text-[8px] px-1.5 py-0.5 rounded-full border ${
                isCompleted 
                  ? 'border-green-500/30 bg-green-500/10 text-green-400' 
                  : report.workerDecision === 'R'
                    ? 'border-red-500/30 bg-red-500/10 text-red-400'
                    : 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400'
              }`}>
                {isCompleted ? 'COMPLETED' : report.workerDecision === 'R' ? 'REJECTED' : 'PENDING CONFIRMATION'}
              </span>
            </div>
            <div className="flex flex-wrap gap-3 mt-2">
              <span className="font-mono text-[9px] text-cyan-400/60 flex items-center gap-1">
                <UserIcon className="w-3 h-3" /> {report.volunteerName || 'Volunteer'}
              </span>
              <span className="font-mono text-[9px] text-cyan-400/60 flex items-center gap-1">
                <CalendarIcon className="w-3 h-3" /> {formatDate(report.submittedAt)}
              </span>
              <span className="font-mono text-[9px] text-cyan-400/60 flex items-center gap-1">
                <ClockIcon className="w-3 h-3" /> {formatTime(report.submittedTime)}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              {report.evidenceCount > 0 && (
                <div className="flex items-center gap-1 text-[9px] font-mono text-cyan-400/60">
                  <PhotoIcon className="w-3 h-3" /> {report.evidenceCount}
                </div>
              )}
              <ArrowPathIcon className={`w-4 h-4 text-cyan-400/60 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
            </div>
          </div>
        </div>

        {/* Description Preview */}
        {report.description && (
          <p className="font-mono text-xs text-cyan-300 mt-3 line-clamp-2">
            {report.description}
          </p>
        )}
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-[var(--border)] p-4 bg-gradient-to-b from-[var(--bg3)]/20 to-transparent space-y-3 animate-fadeIn">
          {/* Full Description */}
          {report.description && (
            <div className="p-3 bg-cyan-900/10 rounded-lg border border-cyan-500/20">
              <p className="font-mono text-[9px] text-cyan-400/60 flex items-center gap-1 mb-1">
                <DocumentTextIcon className="w-3 h-3" /> VOLUNTEER NOTES
              </p>
              <p className="font-mono text-sm text-cyan-200 leading-relaxed">{report.description}</p>
            </div>
          )}

          {/* Location */}
          {report.locationAddress && (
            <div className="p-3 bg-cyan-900/10 rounded-lg border border-cyan-500/20">
              <p className="font-mono text-[9px] text-cyan-400/60 flex items-center gap-1 mb-1">
                <MapPinIcon className="w-3 h-3" /> LOCATION
              </p>
              <p className="font-mono text-sm text-cyan-200">{report.locationAddress}</p>
            </div>
          )}

          {/* Evidence Gallery */}
          {report.evidenceList && report.evidenceList.length > 0 && (
            <div>
              <p className="font-mono text-[9px] text-cyan-400/60 flex items-center gap-1 mb-2">
                <PhotoIcon className="w-3 h-3" /> EVIDENCE ({report.evidenceList.length})
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {report.evidenceList.map((ev, idx) => (
                  <div
                    key={ev.id || idx}
                    onClick={() => onViewEvidence(ev)}
                    className="aspect-square bg-cyan-900/20 rounded-lg border border-cyan-500/20 overflow-hidden cursor-pointer hover:border-cyan-400 hover:scale-105 transition-all duration-300 flex items-center justify-center group"
                  >
                    {ev.evidence ? (
                      <img 
                        src={ev.evidence} 
                        alt={`Evidence ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://placehold.co/200x200/0a1628/06b6d4?text=No+Image'; }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-cyan-400/60">
                        <PhotoIcon className="w-8 h-8 group-hover:scale-110 transition-transform" />
                        <span className="text-[8px] mt-1">No Preview</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confirm Button */}
          {!isCompleted && report.workerDecision !== 'R' && (
            <button
              onClick={() => onConfirmComplete(report.forwardedComplainId)}
              disabled={isConfirming}
              className="w-full py-2.5 bg-green-500/20 border border-green-500 rounded-lg font-mono text-sm text-green-400 hover:bg-green-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <CheckCircleIcon className="w-4 h-4" /> 
              {isConfirming ? 'CONFIRMING...' : 'CONFIRM COMPLETION'}
            </button>
          )}

          {/* Show if already completed */}
          {isCompleted && (
            <div className="w-full py-2.5 bg-green-500/10 border border-green-500/30 rounded-lg font-mono text-sm text-green-400 flex items-center justify-center gap-2">
              <CheckCircleIcon className="w-4 h-4" /> 
              TASK COMPLETED
            </div>
          )}

          {/* Show if rejected */}
          {report.workerDecision === 'R' && (
            <div className="w-full py-2.5 bg-red-500/10 border border-red-500/30 rounded-lg font-mono text-sm text-red-400 flex items-center justify-center gap-2">
              <XMarkIcon className="w-4 h-4" /> 
              EVIDENCE REJECTED — NEEDS REWORK
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ========== MAIN COMPONENT ==========
export default function ResponderFieldReports() {
  const [fieldReports, setFieldReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState(null);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    loadFieldReports();
  }, []);

  // Load real data from forward_decision table
  const loadFieldReports = async () => {
    setLoading(true);
    try {
      // Step 1: Get all evidence for this department from forward_decision
      const evidenceList = await forwardDecisionApi.getByDepartment().catch(() => []);
      
      if (!evidenceList || evidenceList.length === 0) {
        setFieldReports([]);
        setFilteredReports([]);
        setLoading(false);
        return;
      }

      // Step 2: Transform evidence into field reports
      const reports = evidenceList.map(ev => {
        const complaint = ev.forwardedComplaint || {};
        const worker = complaint.worker || {};
        
        return {
          id: ev.id,
          forwardedComplainId: complaint.forwardedComplainId,
          volunteerName: worker.name || 'Volunteer',
          description: ev.description,
          locationAddress: complaint.locationAddress || complaint.department?.deptAddress || 'Location not specified',
          submittedAt: ev.date,
          submittedTime: ev.time,
          evidenceCount: 1,
          evidenceList: [ev],
          workerDecision: complaint.workerDecision,
          completed: complaint.workerDecision === 'D'
        };
      });

      setFieldReports(reports);
      setFilteredReports(reports);
    } catch (error) {
      console.error('Failed to load field reports:', error);
      setFieldReports([]);
      setFilteredReports([]);
    } finally {
      setLoading(false);
    }
  };

  // Confirm completion - updates forwarded_complaint
  const handleConfirmComplete = async (complaintId) => {
    setConfirmingId(complaintId);
    try {
      await forwardDecisionApi.confirmCompletion(complaintId);
      
      // Update local state
      setFieldReports(prev => prev.map(r => 
        r.forwardedComplainId === complaintId 
          ? { ...r, workerDecision: 'D', completed: true } 
          : r
      ));
      
      alert('✅ Task marked as COMPLETED! Citizen and Admin will see the updated status.');
    } catch (error) {
      console.error('Failed to confirm completion:', error);
      alert('Failed to confirm completion. Please try again.');
    } finally {
      setConfirmingId(null);
    }
  };

  // Filter reports based on search and status
  useEffect(() => {
    let filtered = [...fieldReports];
    
    if (statusFilter !== 'ALL') {
      if (statusFilter === 'COMPLETED') {
        filtered = filtered.filter(r => r.completed === true);
      } else if (statusFilter === 'PENDING') {
        filtered = filtered.filter(r => !r.completed && r.workerDecision !== 'R');
      } else if (statusFilter === 'REJECTED') {
        filtered = filtered.filter(r => r.workerDecision === 'R');
      }
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r =>
        r.forwardedComplainId?.toString().includes(query) ||
        r.volunteerName?.toLowerCase().includes(query) ||
        r.locationAddress?.toLowerCase().includes(query) ||
        r.description?.toLowerCase().includes(query)
      );
    }
    
    setFilteredReports(filtered);
  }, [searchQuery, statusFilter, fieldReports]);

  const stats = {
    total: fieldReports.length,
    completed: fieldReports.filter(r => r.completed).length,
    pending: fieldReports.filter(r => !r.completed && r.workerDecision !== 'R').length,
    rejected: fieldReports.filter(r => r.workerDecision === 'R').length,
    totalEvidence: fieldReports.reduce((sum, r) => sum + (r.evidenceCount || 0), 0)
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <div className="font-mono text-cyan-400 animate-pulse tracking-wider">[ LOADING FIELD REPORTS... ]</div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="font-title text-glow-primary text-2xl tracking-wider">FIELD REPORTS</h1>
        <p className="font-mono text-xs text-cyan-500/60 mt-1">[ VOLUNTEER EVIDENCE & COMPLETION ]</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'TOTAL', value: stats.total, color: '#06b6d4', icon: '📋' },
          { label: 'COMPLETED', value: stats.completed, color: '#4ade80', icon: '✅' },
          { label: 'PENDING', value: stats.pending, color: '#fbbf24', icon: '⏳' },
          { label: 'REJECTED', value: stats.rejected, color: '#ef4444', icon: '❌' },
          { label: 'EVIDENCE', value: stats.totalEvidence, color: '#c084fc', icon: '📷' },
        ].map((stat, idx) => (
          <div
            key={stat.label}
            className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl p-3 text-center transition-all duration-300 hover:border-cyan-500/50 hover:scale-[1.02] animate-scaleIn"
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <span className="text-xl">{stat.icon}</span>
            <p className="font-data text-2xl mt-1" style={{ textShadow: `0 0 10px ${stat.color}`, color: stat.color }}>
              {stat.value}
            </p>
            <p className="font-mono text-[8px] text-cyan-400/60 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            className="w-full bg-cyan-900/20 border border-cyan-500/30 rounded-lg px-4 py-2.5 font-mono text-sm text-cyan-200 focus:border-cyan-400 focus:outline-none transition-all placeholder:text-cyan-500/30"
            placeholder="🔍 Search by complaint ID, volunteer name, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {['ALL', 'PENDING', 'COMPLETED', 'REJECTED'].map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-4 py-2 rounded-lg font-mono text-xs transition-all duration-300 ${
                statusFilter === filter
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(0,240,255,0.1)]'
                  : 'bg-cyan-900/10 text-cyan-400/60 hover:text-cyan-300 hover:bg-cyan-500/10'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      {filteredReports.length > 0 && (
        <div className="flex justify-between items-center">
          <p className="font-mono text-[9px] text-cyan-400/60">
            Showing {filteredReports.length} of {fieldReports.length} field reports
          </p>
        </div>
      )}

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-12 text-center">
          <div className="text-6xl mb-3 opacity-40">📝</div>
          <p className="font-mono text-sm text-gray-400">No field reports found</p>
          <p className="font-mono text-[10px] text-cyan-500/40 mt-1">Volunteer evidence will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReports.map((report, idx) => (
            <div key={report.id || report.forwardedComplainId} className="animate-slideInRight" style={{ animationDelay: `${idx * 0.03}s` }}>
              <FieldReportCard 
                report={report}
                onViewEvidence={(evidence) => setSelectedEvidence(evidence)}
                onConfirmComplete={handleConfirmComplete}
                isConfirming={confirmingId === report.forwardedComplainId}
              />
            </div>
          ))}
        </div>
      )}

      {/* Evidence Modal */}
      {selectedEvidence && (
        <EvidenceModal evidence={selectedEvidence} onClose={() => setSelectedEvidence(null)} />
      )}

      {/* Animations CSS */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideInRight { animation: slideInRight 0.4s ease-out forwards; opacity: 0; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out forwards; opacity: 0; }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}