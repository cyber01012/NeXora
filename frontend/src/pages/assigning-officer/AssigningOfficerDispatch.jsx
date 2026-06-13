import { useEffect, useState } from 'react';
import { assigningOfficerApi } from '../../services/assigningOfficerApi';
import { toast } from 'sonner';

export default function AssigningOfficerDispatch() {
  const [reports, setReports] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL | SOS | CIVIC
  const [dispatching, setDispatching] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [dispatchForm, setDispatchForm] = useState({
    departmentId: '',
    priority: 'MEDIUM',
    remarks: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [pendingData, deptData] = await Promise.all([
        assigningOfficerApi.pendingReports().catch(() => []),
        assigningOfficerApi.activeDepartments().catch(() => []),
      ]);
      setReports(pendingData);
      setDepartments(deptData);
    } catch (err) {
      console.error('Failed to load dispatch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter(r => {
    if (filter === 'SOS') return r.reportType === 'SOS';
    if (filter === 'CIVIC') return r.reportType === 'CIVIC';
    return true;
  });

  const openDispatchModal = (report) => {
    setSelectedReport(report);
    setDispatchForm({
      departmentId: '',
      priority: report.priority || 'MEDIUM',
      remarks: '',
    });
    setModalOpen(true);
  };

  const handleDispatch = async () => {
    if (!dispatchForm.departmentId) {
      toast.error('Please select a department');
      return;
    }
    setDispatching(true);
    try {
      await assigningOfficerApi.dispatch({
        reportType: selectedReport.reportType,
        reportId: selectedReport.reportId,
        departmentId: parseInt(dispatchForm.departmentId),
        priority: dispatchForm.priority,
        remarks: dispatchForm.remarks,
      });
      toast.success(`${selectedReport.reportType} #${selectedReport.reportId} dispatched successfully!`);
      setModalOpen(false);
      // Remove from list
      setReports(prev => prev.filter(r =>
        !(r.reportType === selectedReport.reportType && r.reportId === selectedReport.reportId)
      ));
    } catch (err) {
      toast.error(err.message || 'Failed to dispatch');
    } finally {
      setDispatching(false);
    }
  };

  const getPriorityStyle = (priority) => {
    const styles = {
      HIGH: 'bg-red-500/20 text-red-400 border-red-500/30',
      MEDIUM: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      LOW: 'bg-green-500/20 text-green-400 border-green-500/30',
    };
    return styles[priority] || styles.MEDIUM;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <div className="font-mono text-cyan-400 animate-pulse tracking-wider">[ LOADING DISPATCH QUEUE... ]</div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="font-title text-glow-primary text-2xl tracking-wider">DISPATCH QUEUE</h1>
          <p className="font-mono text-xs text-cyan-500/60 mt-1">
            [ {filteredReports.length} PENDING REPORT{filteredReports.length !== 1 ? 'S' : ''} AWAITING DISPATCH ]
          </p>
        </div>
        {/* Filter Buttons */}
        <div className="flex gap-2">
          {['ALL', 'SOS', 'CIVIC'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg font-mono text-[10px] tracking-wider border transition-all duration-300 ${
                filter === f
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400 text-shadow-glow'
                  : 'bg-transparent border-cyan-500/20 text-cyan-500/60 hover:border-cyan-500/50 hover:text-cyan-400'
              }`}
            >
              {f === 'ALL' ? `ALL (${reports.length})` : f === 'SOS' ? `🚨 SOS (${reports.filter(r => r.reportType === 'SOS').length})` : `📄 CIVIC (${reports.filter(r => r.reportType === 'CIVIC').length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Report Cards */}
      <div className="space-y-3">
        {filteredReports.length > 0 ? filteredReports.map((report, idx) => (
          <div
            key={`${report.reportType}-${report.reportId}`}
            className="bg-[#0a1628]/80 border border-cyan-500/20 rounded-xl p-4 hover:border-cyan-500/50 transition-all duration-300 animate-slideInRight"
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <div className="flex justify-between items-start gap-4">
              {/* Left: Report Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{report.reportType === 'SOS' ? '🚨' : '📄'}</span>
                  <span className="font-title text-glow-primary text-sm tracking-wider">
                    {report.reportType} #{report.reportId}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono border ${getPriorityStyle(report.priority)}`}>
                    {report.priority}
                  </span>
                  {report.nature && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono border border-cyan-500/30 text-cyan-400 bg-cyan-500/10">
                      {report.nature}
                    </span>
                  )}
                </div>

                <p className="font-mono text-xs text-cyan-200/80 mb-2 line-clamp-2">{report.detail || 'No details provided'}</p>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-mono text-cyan-400/60">
                  {report.name && <span>👤 {report.name}</span>}
                  {report.phone && <span>📱 {report.phone}</span>}
                  {report.area && <span>📍 {report.area}</span>}
                  {report.city && <span>🏙️ {report.city}</span>}
                </div>
              </div>

              {/* Right: Dispatch Button */}
              <button
                onClick={() => openDispatchModal(report)}
                className="px-4 py-2 bg-cyan-500/20 border border-cyan-400 rounded-lg font-mono text-xs text-glow-primary hover:bg-cyan-500/30 transition-all duration-300 hover:scale-105 whitespace-nowrap flex items-center gap-2"
              >
                📤 DISPATCH
              </button>
            </div>
          </div>
        )) : (
          <div className="text-center py-16 bg-[#0a1628]/80 border border-cyan-500/20 rounded-xl">
            <span className="text-4xl mb-4 block">✅</span>
            <p className="font-mono text-cyan-400/60 text-sm">All reports have been dispatched</p>
            <p className="font-mono text-cyan-400/40 text-[10px] mt-1">No pending reports in the queue</p>
          </div>
        )}
      </div>

      {/* Dispatch Modal */}
      {modalOpen && selectedReport && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-[#0a1628] border border-cyan-500/30 rounded-2xl p-6 animate-scaleIn shadow-2xl shadow-cyan-500/10">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-title text-glow-primary text-lg tracking-wider">DISPATCH REPORT</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-cyan-400/60 hover:text-white transition-colors text-lg"
              >✕</button>
            </div>

            {/* Report Summary */}
            <div className="bg-cyan-900/20 border border-cyan-500/20 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <span>{selectedReport.reportType === 'SOS' ? '🚨' : '📄'}</span>
                <span className="font-mono text-sm text-cyan-200">{selectedReport.reportType} #{selectedReport.reportId}</span>
              </div>
              <p className="font-mono text-[10px] text-cyan-400/60 line-clamp-2">{selectedReport.detail}</p>
            </div>

            {/* Department Select */}
            <div className="mb-4">
              <label className="block font-mono text-[10px] text-cyan-400/60 tracking-wider mb-1.5">TARGET DEPARTMENT</label>
              <select
                value={dispatchForm.departmentId}
                onChange={e => setDispatchForm(prev => ({ ...prev, departmentId: e.target.value }))}
                className="w-full bg-[#050916] border border-cyan-500/30 rounded-lg px-3 py-2 font-mono text-xs text-cyan-200 focus:border-cyan-400 focus:outline-none transition-colors"
              >
                <option value="">— Select Department —</option>
                {departments.map(dept => (
                  <option key={dept.deptId} value={dept.deptId}>
                    {dept.deptName} ({dept.responderTypeCategory})
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Select */}
            <div className="mb-4">
              <label className="block font-mono text-[10px] text-cyan-400/60 tracking-wider mb-1.5">PRIORITY LEVEL</label>
              <div className="flex gap-2">
                {['HIGH', 'MEDIUM', 'LOW'].map(p => (
                  <button
                    key={p}
                    onClick={() => setDispatchForm(prev => ({ ...prev, priority: p }))}
                    className={`flex-1 px-3 py-2 rounded-lg font-mono text-[10px] tracking-wider border transition-all duration-200 ${
                      dispatchForm.priority === p
                        ? getPriorityStyle(p) + ' scale-105'
                        : 'bg-transparent border-cyan-500/20 text-cyan-500/60'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Remarks */}
            <div className="mb-5">
              <label className="block font-mono text-[10px] text-cyan-400/60 tracking-wider mb-1.5">DISPATCH REMARKS (OPTIONAL)</label>
              <textarea
                value={dispatchForm.remarks}
                onChange={e => setDispatchForm(prev => ({ ...prev, remarks: e.target.value }))}
                rows={3}
                placeholder="Add any notes for the responder department..."
                className="w-full bg-[#050916] border border-cyan-500/30 rounded-lg px-3 py-2 font-mono text-xs text-cyan-200 focus:border-cyan-400 focus:outline-none transition-colors resize-none placeholder:text-cyan-500/30"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 px-4 py-2 border border-cyan-500/30 rounded-lg font-mono text-xs text-cyan-400/60 hover:text-cyan-400 hover:border-cyan-400 transition-all duration-200"
              >
                CANCEL
              </button>
              <button
                onClick={handleDispatch}
                disabled={dispatching}
                className="flex-1 px-4 py-2 bg-cyan-500/20 border border-cyan-400 rounded-lg font-mono text-xs text-glow-primary hover:bg-cyan-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {dispatching ? (
                  <><div className="w-3 h-3 border border-cyan-400 border-t-transparent rounded-full animate-spin" /> DISPATCHING...</>
                ) : (
                  <>📤 CONFIRM DISPATCH</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .animate-slideInRight { animation: slideInRight 0.4s ease-out forwards; opacity: 0; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
}
