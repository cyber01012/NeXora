import { useEffect, useState } from 'react';
import { responderApi, forwardDecisionApi } from '../../services/api';

// ========== STATUS BADGE ==========
const StatusBadge = ({ status }) => {
  const styles = {
    PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    ACCEPTED: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    WITH_VOLUNTEER: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    AWAITING_REVIEW: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    COMPLETED: 'bg-green-500/20 text-green-400 border-green-500/30',
    REJECTED: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  const s = styles[status] || styles.PENDING;
  const displayStatus = {
    WITH_VOLUNTEER: 'WITH VOLUNTEER',
    ACCEPTED: 'ACCEPTED',
    AWAITING_REVIEW: 'AWAITING REVIEW',
  }[status] || status;
  return (
    <span className={`px-3 py-1 rounded-full text-[11px] font-mono border ${s}`}>
      {displayStatus}
    </span>
  );
};

// ========== PRIORITY BADGE ==========
const PriorityBadge = ({ priority }) => {
  const colors = {
    HIGH: 'text-red-400 border-red-500/30 bg-red-500/10',
    MEDIUM: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
    LOW: 'text-green-400 border-green-500/30 bg-green-500/10',
  };
  const c = colors[priority] || colors.MEDIUM;
  return <span className={`px-2 py-0.5 rounded text-[9px] font-mono border ${c}`}>{priority || 'MEDIUM'}</span>;
};

// ========== SOS BADGE ==========
const SOSBadge = () => (
  <span className="px-2 py-0.5 rounded text-[9px] font-mono border bg-red-500/20 text-red-400 border-red-500/30 animate-pulse">
    🚨 SOS
  </span>
);

// ========== HELPER FUNCTIONS ==========
const getSafeString = (value) => {
  if (value === null || value === undefined) return 'N/A';
  if (typeof value === 'object') {
    if (value.deptName) return value.deptName;
    if (value.name) return value.name;
    return '';
  }
  return String(value);
};

const getCitizenName = (citizen) => {
  if (!citizen) return 'N/A';
  return citizen.fname || citizen.fullName || citizen.name || 'N/A';
};

const getCitizenPhone = (citizen) => {
  if (!citizen) return 'N/A';
  return citizen.phoneNum || citizen.phoneNumber || citizen.phone || 'N/A';
};

// ========== EVIDENCE IMAGE MODAL ==========
const EvidenceImageModal = ({ imageUrl, description, onClose }) => {
  if (!imageUrl) return null;

  const fullUrl = imageUrl.startsWith('http') ? imageUrl : `http://localhost:8080${imageUrl}`;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 animate-fadeIn" onClick={onClose}>
      <div className="max-w-4xl w-full mx-4 bg-[var(--bg2)] border border-cyan-500/30 rounded-2xl overflow-hidden animate-scaleIn" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-cyan-500/20 flex justify-between items-center">
          <h3 className="font-title text-glow-primary text-lg tracking-wider flex items-center gap-2">
            <span>📷</span> VOLUNTEER EVIDENCE
          </h3>
          <button onClick={onClose} className="text-cyan-400/60 hover:text-cyan-400 transition-colors text-2xl">&times;</button>
        </div>
        <div className="p-6">
          <img 
            src={fullUrl} 
            alt="Volunteer Evidence" 
            className="max-w-full max-h-[60vh] mx-auto rounded-lg"
            onError={(e) => { 
              e.target.src = 'https://placehold.co/600x400/0a1628/06b6d4?text=No+Image+Available'; 
            }}
          />
          {description && (
            <div className="mt-4 p-3 bg-cyan-900/20 rounded-lg border border-cyan-500/20">
              <p className="font-mono text-[9px] text-cyan-400/60 mb-1">VOLUNTEER NOTES</p>
              <p className="font-mono text-sm text-cyan-200 leading-relaxed">{description}</p>
            </div>
          )}
          <div className="mt-4 text-[10px] font-mono text-cyan-400/60 text-center">Click outside to close</div>
        </div>
      </div>
    </div>
  );
};

// ========== TASK DETAIL MODAL ==========
const TaskDetailModal = ({ task, volunteers, onClose, onAccept, onReject, onAssignVolunteer, onConfirmComplete, isProcessing, selectedVolunteer, setSelectedVolunteer }) => {
  const [rejectReason, setRejectReason] = useState('');
  const [showVolunteerList, setShowVolunteerList] = useState(false);
  const [confirmRemarks, setConfirmRemarks] = useState('');
  const [evidenceData, setEvidenceData] = useState(null);
  const [loadingEvidence, setLoadingEvidence] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (task) {
      loadEvidence();
    }
  }, [task]);

  const loadEvidence = async () => {
    setLoadingEvidence(true);
    try {
      const taskId = task.forwardedComplainId || task.id;
      const evidenceList = await forwardDecisionApi.getByComplaint(taskId).catch(() => []);
      if (evidenceList && evidenceList.length > 0) {
        setEvidenceData(evidenceList[0]);
      }
    } catch (error) {
      console.error('Failed to load evidence:', error);
    } finally {
      setLoadingEvidence(false);
    }
  };

  if (!task) return null;

  const isPending = task.status === 'PENDING';
  const isAccepted = task.status === 'ACCEPTED';
  const isWithVolunteer = task.status === 'WITH_VOLUNTEER';
  const isAwaitingReview = task.status === 'AWAITING_REVIEW';
  const isCompleted = task.status === 'COMPLETED';
  const isRejected = task.status === 'REJECTED';
  const isSOS = task.sosId != null;
  const isAnonymous = task.anonymousId != null;

  const evidenceUrl = evidenceData?.evidence || evidenceData?.evidenceImage || evidenceData?.imagePath;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 animate-fadeIn" onClick={onClose}>
      <div className="w-full max-w-3xl max-h-[90vh] mx-4 bg-[var(--bg2)] border border-cyan-500/30 rounded-2xl overflow-hidden animate-scaleIn flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className={`p-4 border-b border-cyan-500/20 flex justify-between items-center bg-gradient-to-r ${isSOS ? 'from-red-900/20' : 'from-cyan-900/20'} to-transparent`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${isSOS ? 'bg-red-500/20' : 'bg-cyan-500/20'}`}>
              {isSOS ? '🚨' : '📋'}
            </div>
            <div>
              <h3 className="font-title text-glow-primary text-lg tracking-wider">
                {isSOS ? 'SOS EMERGENCY TASK' : 'TASK DETAILS'}
              </h3>
              <p className="font-mono text-[9px] text-cyan-400/60">Task #{task.forwardedComplainId || task.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-cyan-400/60 hover:text-cyan-400 transition-colors text-2xl">&times;</button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Status Header */}
          <div className={`rounded-xl p-4 border ${isSOS ? 'bg-red-900/10 border-red-500/20' : 'bg-cyan-900/10 border-cyan-500/20'}`}>
            <div className="flex justify-between items-start flex-wrap gap-3">
              <div>
                <p className="font-mono text-[9px] text-cyan-400/60">REPORT ID</p>
                <p className="font-data text-xl text-glow-primary">
                  #{isSOS ? `SOS-${task.sosId}` : task.reportId || task.forwardedComplainId || task.id}
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {isSOS && <SOSBadge />}
                <StatusBadge status={task.status} />
                <PriorityBadge priority={task.priority || (isSOS ? 'HIGH' : 'MEDIUM')} />
                {/* <PriorityBadge priority={task.priority || 'MEDIUM'} /> */}
              </div>
            </div>
            {isSOS && (
              <p className="font-mono text-xs text-red-400 mt-2 animate-pulse">
                ⚠️ This is an EMERGENCY SOS report. Immediate action required!
              </p>
            )}
          </div>

          {/* Description */}
          <div className="bg-cyan-900/10 rounded-xl p-4 border border-cyan-500/20">
            <p className="font-mono text-[9px] text-cyan-400/60 mb-2 flex items-center gap-1"><span>📝</span> DESCRIPTION</p>
            <p className="font-mono text-sm text-cyan-200 leading-relaxed">{task.remarks || task.description || 'No description provided'}</p>
          </div>

          {/* Citizen Information */}
          <div className="bg-cyan-900/10 rounded-xl p-4 border border-cyan-500/20">
            <p className="font-mono text-[9px] text-cyan-400/60 mb-2 flex items-center gap-1"><span>👤</span> CITIZEN INFORMATION</p>
            <div className="grid grid-cols-2 gap-3">
              <div><p className="font-mono text-[8px] text-cyan-400/60">NAME</p><p className="font-mono text-sm text-cyan-200">{getCitizenName(task.citizen)}</p></div>
              <div><p className="font-mono text-[8px] text-cyan-400/60">PHONE</p><p className="font-mono text-sm text-cyan-200">{getCitizenPhone(task.citizen)}</p></div>
            </div>
          </div>

          {/* Location & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-cyan-900/10 rounded-xl p-4 border border-cyan-500/20">
              <p className="font-mono text-[9px] text-cyan-400/60 mb-1 flex items-center gap-1"><span>📍</span> LOCATION</p>
              <p className="font-mono text-sm text-cyan-200">{task.department?.deptAddress || 'N/A'}</p>
            </div>
            <div className="bg-cyan-900/10 rounded-xl p-4 border border-cyan-500/20">
              <p className="font-mono text-[9px] text-cyan-400/60 mb-1 flex items-center gap-1"><span>📅</span> SUBMITTED ON</p>
              <p className="font-mono text-sm text-cyan-200">{task.submitDate || 'N/A'}</p>
            </div>
          </div>

          {/* Department */}
          <div className="bg-cyan-900/10 rounded-xl p-4 border border-cyan-500/20">
            <p className="font-mono text-[9px] text-cyan-400/60 mb-1 flex items-center gap-1"><span>🏢</span> DEPARTMENT</p>
            <p className="font-mono text-sm text-cyan-200">{getSafeString(task.department)}</p>
          </div>

          {/* Evidence Section */}
          {(isAwaitingReview || isCompleted || isWithVolunteer) && (
            <div className={`rounded-xl p-4 border ${
              isAwaitingReview ? 'bg-orange-500/10 border-orange-500/30' : 
              isCompleted ? 'bg-green-500/10 border-green-500/30' : 
              'bg-purple-500/10 border-purple-500/30'
            }`}>
              <p className="font-mono text-[9px] text-cyan-400/60 mb-2 flex items-center gap-1">
                <span>📷</span> VOLUNTEER EVIDENCE
              </p>

              {loadingEvidence ? (
                <div className="text-center py-4">
                  <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="font-mono text-[9px] text-cyan-400/60 mt-2">Loading evidence...</p>
                </div>
              ) : evidenceUrl ? (
                <div>
                  <div 
                    className="relative group cursor-pointer overflow-hidden rounded-lg mb-3"
                    onClick={() => setSelectedImage({ url: evidenceUrl, description: evidenceData?.description })}
                  >
                    <img 
                      src={evidenceUrl.startsWith('http') ? evidenceUrl : `http://localhost:8080${evidenceUrl}`}
                      alt="Evidence" 
                      className="w-full max-h-48 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => { 
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/400x200/0a1628/06b6d4?text=No+Image'; 
                      }}
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                      <span className="text-cyan-400 text-sm">Click to enlarge</span>
                    </div>
                  </div>
                  {evidenceData?.description && (
                    <p className="font-mono text-xs text-cyan-300 mt-2">{evidenceData.description}</p>
                  )}
                  <p className="font-mono text-[9px] text-cyan-400/60 mt-2">
                    Submitted: {evidenceData?.date} {evidenceData?.time}
                  </p>
                </div>
              ) : (
                <div className="bg-cyan-900/20 rounded-lg p-3 text-center">
                  <p className="font-mono text-[9px] text-cyan-400/60">No evidence uploaded yet</p>
                </div>
              )}
            </div>
          )}

          {/* Volunteer Info */}
          {(isWithVolunteer || isAwaitingReview || isCompleted) && task.worker && (
            <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/30">
              <p className="font-mono text-[9px] text-cyan-400/60 mb-1 flex items-center gap-1"><span>👥</span> ASSIGNED VOLUNTEER</p>
              <p className="font-mono text-sm text-purple-400">{task.worker.name}</p>
              <p className="font-mono text-[9px] text-cyan-400/60">📞 {task.worker.phoneNumber || 'N/A'}</p>
            </div>
          )}

          {/* Action Buttons */}
          {isPending && (
            <div className="flex gap-3 pt-3">
              <button onClick={() => onAccept(task.forwardedComplainId || task.id)} disabled={isProcessing} className="flex-1 py-3 bg-green-500/20 border border-green-500 rounded-xl font-mono text-sm text-green-400 hover:bg-green-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                <span>✓</span> ACCEPT TASK
              </button>
              <div className="flex-1">
                <input type="text" placeholder="Rejection reason" className="w-full mb-2 bg-red-900/20 border border-red-500/30 rounded-lg px-3 py-2 text-sm text-red-200 placeholder:text-red-500/30" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
                <button onClick={() => onReject(task.forwardedComplainId || task.id, rejectReason)} disabled={isProcessing || !rejectReason} className="w-full py-2 bg-red-500/20 border border-red-500 rounded-xl font-mono text-sm text-red-400 hover:bg-red-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  <span>✗</span> REJECT TASK
                </button>
              </div>
            </div>
          )}

          {isAccepted && !isWithVolunteer && (
            <div className="space-y-3 pt-3">
              <div className="bg-cyan-900/10 rounded-xl p-4 border border-cyan-500/20 text-center">
                <p className="font-mono text-sm text-blue-400 mb-3">✅ Task Accepted! Now assign to a volunteer:</p>
                {!showVolunteerList ? (
                  <button onClick={() => setShowVolunteerList(true)} className="px-4 py-2 bg-cyan-500/20 border border-cyan-400 rounded-lg font-mono text-sm text-glow-primary">
                    📋 SHOW MY VOLUNTEERS
                  </button>
                ) : (
                  <div className="space-y-2">
                    <select 
                      className="w-full bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-2 font-mono text-sm text-cyan-200"
                      value={selectedVolunteer}
                      onChange={(e) => setSelectedVolunteer(e.target.value)}
                    >
                      <option value="">Select a volunteer...</option>
                      {volunteers.map(vol => (
                        <option key={vol.usernameCreated || vol.username} value={vol.usernameCreated || vol.username}>
                          {vol.name} - {vol.department?.deptName || 'No Department'}
                        </option>
                      ))}
                    </select>
                    <button 
                      onClick={() => onAssignVolunteer(task.forwardedComplainId || task.id, selectedVolunteer)} 
                      disabled={!selectedVolunteer || isProcessing}
                      className="w-full py-2 bg-purple-500/20 border border-purple-500 rounded-lg font-mono text-sm text-purple-400 hover:bg-purple-500/30 transition-all disabled:opacity-50"
                    >
                      {isProcessing ? 'ASSIGNING...' : '➡ ASSIGN TO VOLUNTEER'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {isWithVolunteer && (
            <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/30 text-center">
              <p className="font-mono text-sm text-purple-400">👤 Task assigned to volunteer: {task.worker?.name || task.workerName || 'Unknown'}</p>
              <p className="font-mono text-xs text-cyan-400/60 mt-2">⏳ Volunteer is working on this task. Once completed, evidence will be submitted for your review.</p>
            </div>
          )}

          {isAwaitingReview && (
            <div className="space-y-3 pt-3">
              <div className="bg-orange-500/10 rounded-xl p-4 border border-orange-500/30">
                <p className="font-mono text-sm text-orange-400 mb-3">📋 Volunteer has submitted evidence. Please review and confirm completion:</p>
                <textarea 
                  placeholder="Add remarks (optional)" 
                  className="w-full bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-2 font-mono text-sm text-cyan-200"
                  rows="2"
                  value={confirmRemarks}
                  onChange={(e) => setConfirmRemarks(e.target.value)}
                />
                <button 
                  onClick={() => onConfirmComplete(task.forwardedComplainId || task.id, confirmRemarks)} 
                  disabled={isProcessing}
                  className="w-full mt-3 py-2 bg-green-500/20 border border-green-500 rounded-lg font-mono text-sm text-green-400 hover:bg-green-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? 'CONFIRMING...' : '✓ CONFIRM COMPLETION'}
                </button>
              </div>
            </div>
          )}

          {isCompleted && (
            <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/30 text-center">
              <p className="font-mono text-sm text-green-400">🎉 Task Completed Successfully!</p>
              <p className="font-mono text-xs text-cyan-400/60 mt-2">Citizen and Admin can see this task as COMPLETED.</p>
            </div>
          )}

          {isRejected && (
            <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/30 text-center">
              <p className="font-mono text-sm text-red-400">❌ Task Rejected</p>
              {task.remarks && <p className="font-mono text-xs text-red-400/60 mt-1">Reason: {task.remarks}</p>}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-cyan-500/20 bg-cyan-900/10">
          <button onClick={onClose} className="w-full py-2.5 bg-cyan-500/20 border border-cyan-400 rounded-xl font-mono text-sm text-glow-primary hover:bg-cyan-500/30 transition-all">CLOSE</button>
        </div>
      </div>

      {selectedImage && (
        <EvidenceImageModal 
          imageUrl={selectedImage.url} 
          description={selectedImage.description}
          onClose={() => setSelectedImage(null)} 
        />
      )}
    </div>
  );
};

// ========== MAIN COMPONENT ==========
export default function ResponderTasks() {
  const [tasks, setTasks] = useState([]);
  const [history, setHistory] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [activeTab, setActiveTab] = useState('PENDING');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState('');

  useEffect(() => { loadData(); }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'HISTORY') {
        const historyData = await responderApi.taskHistory().catch(() => []);
        setHistory(historyData || []);
      } else {
        const tasksData = await responderApi.tasks(activeTab).catch(() => []);
        setTasks(tasksData || []);
      }
      const volunteersData = await responderApi.workers().catch(() => []);
      setVolunteers(volunteersData || []);
    } catch (error) { 
      console.error('Failed to load:', error); 
      setMessage({ text: 'Failed to load tasks', type: 'error' }); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleAccept = async (taskId) => {
    setActionLoading(true);
    try {
      await responderApi.accept(taskId);
      setMessage({ text: 'Task accepted! Status: ACCEPTED', type: 'success' });
      setSelectedTask(null);
      loadData();
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) { 
      setMessage({ text: 'Failed to accept task', type: 'error' }); 
    } finally { 
      setActionLoading(false); 
    }
  };

  const handleReject = async (taskId, reason) => {
    if (!reason) { 
      setMessage({ text: 'Please provide a rejection reason', type: 'error' }); 
      return; 
    }
    setActionLoading(true);
    try {
      await responderApi.reject(taskId, reason);
      setMessage({ text: 'Task rejected', type: 'success' });
      setSelectedTask(null);
      loadData();
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) { 
      setMessage({ text: 'Failed to reject task', type: 'error' }); 
    } finally { 
      setActionLoading(false); 
    }
  };

  const handleAssignVolunteer = async (taskId, volunteerUsername) => {
    if (!volunteerUsername) {
      setMessage({ text: 'Please select a volunteer', type: 'error' });
      return;
    }
    setActionLoading(true);
    try {
      await responderApi.assignToVolunteer(taskId, volunteerUsername);
      setMessage({ text: 'Task assigned to volunteer successfully!', type: 'success' });
      setSelectedTask(null);
      setSelectedVolunteer('');
      loadData();
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) { 
      console.error('Assign failed:', error);
      setMessage({ text: 'Failed to assign task', type: 'error' }); 
    } finally { 
      setActionLoading(false); 
    }
  };

  const handleConfirmComplete = async (taskId, remarks) => {
    setActionLoading(true);
    try {
      await responderApi.confirmCompletion(taskId, remarks);
      setMessage({ text: 'Task marked as COMPLETED! Citizen and Admin will see the update.', type: 'success' });
      setSelectedTask(null);
      loadData();
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) { 
      console.error('Confirm failed:', error);
      setMessage({ text: 'Failed to confirm completion', type: 'error' }); 
    } finally { 
      setActionLoading(false); 
    }
  };

  const getTaskStatus = (task) => {
    if (task.workerDecision === 'D') return 'COMPLETED';
    if (task.deptDecision === 'R') return 'REJECTED';
    if (task.acceptedByWorker === true && task.workerDecision === null) return 'AWAITING_REVIEW';
    if (task.assignedToWorker === true) return 'WITH_VOLUNTEER';
    if (task.deptDecision === 'D') return 'ACCEPTED';
    return 'PENDING';
  };

  const tabs = [
    { key: 'PENDING', label: 'PENDING', icon: '⏳', count: tasks.filter(t => getTaskStatus(t) === 'PENDING').length },
    { key: 'ACTIVE', label: 'ACTIVE', icon: '🔄', count: tasks.filter(t => getTaskStatus(t) === 'ACCEPTED' || getTaskStatus(t) === 'WITH_VOLUNTEER' || getTaskStatus(t) === 'AWAITING_REVIEW').length },
    { key: 'HISTORY', label: 'HISTORY', icon: '📜', count: history.length },
  ];

  const displayData = activeTab === 'HISTORY' ? history : tasks;

  const getDisplayStatus = (task) => {
    if (task.workerDecision === 'D') return 'COMPLETED';
    if (task.deptDecision === 'R') return 'REJECTED';
    if (task.acceptedByWorker === true && task.workerDecision === null) return 'AWAITING_REVIEW';
    if (task.assignedToWorker === true) return 'WITH_VOLUNTEER';
    if (task.deptDecision === 'D') return 'ACCEPTED';
    return 'PENDING';
  };

  if (loading) {
    return <div className="flex flex-col items-center justify-center h-96 gap-4"><div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" /><div className="font-mono text-cyan-400 animate-pulse">[ LOADING TASKS... ]</div></div>;
  }

  return (
    <div className="space-y-5">
      <div><h1 className="font-title text-glow-primary text-2xl tracking-wider">TASK MANAGEMENT</h1><p className="font-mono text-xs text-cyan-500/60 mt-1">[ ACCEPT, ASSIGN & TRACK ]</p></div>

      {message.text && <div className={`p-3 rounded-lg animate-slideInRight ${message.type === 'success' ? 'bg-green-500/20 border border-green-500/50 text-green-400' : 'bg-red-500/20 border border-red-500/50 text-red-400'}`}>{message.text}</div>}

      <div className="flex gap-2 border-b border-[var(--border)] pb-2">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-4 py-2 rounded-lg font-mono text-sm transition-all flex items-center gap-2 ${activeTab === tab.key ? 'text-cyan-400 bg-cyan-500/10 border-b-2 border-cyan-400 -mb-[9px]' : 'text-gray-500 hover:text-cyan-300'}`}>
            <span>{tab.icon}</span> {tab.label} <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/20">{tab.count}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl p-3 text-center"><p className="font-mono text-[8px] text-gray-500">PENDING</p><p className="font-data text-xl text-yellow-400">{tabs[0].count}</p></div>
        <div className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl p-3 text-center"><p className="font-mono text-[8px] text-gray-500">ACTIVE</p><p className="font-data text-xl text-cyan-400">{tabs[1].count}</p></div>
      </div>

      {displayData.length === 0 ? (
        <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-12 text-center"><div className="text-5xl mb-3 opacity-40">📋</div><p className="font-mono text-sm text-gray-400">No {activeTab.toLowerCase()} tasks</p></div>
      ) : (
        <div className="space-y-3">
          {displayData.map((task) => {
            const status = getDisplayStatus(task);
            const isSOS = task.sosId != null;
            return (
              <div key={task.forwardedComplainId || task.id} 
                className={`bg-[var(--bg2)] border rounded-xl p-4 transition-all duration-300 hover:border-cyan-500/30 cursor-pointer ${
                  isSOS ? 'border-red-500/30 hover:border-red-500/50' : 'border-[var(--border)]'
                }`}
                onClick={() => setSelectedTask({ ...task, status })}
              >
                <div className="flex justify-between items-start flex-wrap gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`font-data text-md ${isSOS ? 'text-red-400 text-glow-red' : 'text-glow-primary'}`}>
                        {isSOS ? `🚨 SOS-${task.sosId}` : `Task #${task.forwardedComplainId || task.id}`}
                      </p>
                      {isSOS && <SOSBadge />}
                      <StatusBadge status={status} />
                      <PriorityBadge priority={task.priority || 'MEDIUM'} />
                    </div>
                    <p className="font-mono text-sm text-cyan-200 mt-2 line-clamp-1">{task.remarks || task.title || 'Complaint'}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-[10px] font-mono text-cyan-400/60">
                      <span>🏢 {getSafeString(task.department)}</span>
                      <span>👤 {getCitizenName(task.citizen)}</span>
                      <span>📅 {task.submitDate || 'N/A'}</span>
                      {isSOS && <span className="text-red-400 animate-pulse">⚠️ EMERGENCY</span>}
                    </div>
                  </div>
                  <div className="text-xs text-cyan-400/40">Click to view →</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedTask && (
        <TaskDetailModal 
          task={selectedTask}
          volunteers={volunteers}
          onClose={() => { setSelectedTask(null); setSelectedVolunteer(''); }}
          onAccept={handleAccept}
          onReject={handleReject}
          onAssignVolunteer={handleAssignVolunteer}
          onConfirmComplete={handleConfirmComplete}
          isProcessing={actionLoading}
          selectedVolunteer={selectedVolunteer}
          setSelectedVolunteer={setSelectedVolunteer}
        />
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideInRight { animation: slideInRight 0.3s ease-out forwards; opacity: 0; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out forwards; opacity: 0; }
        .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
        .text-glow-red { text-shadow: 0 0 10px rgba(239, 68, 68, 0.5); }
      `}</style>
    </div>
  );
}