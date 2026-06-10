import { useEffect, useState } from 'react';
import { assigningOfficerApi } from '../../services/assigningOfficerApi';
import { toast } from 'sonner';

export default function AssigningOfficerDepartments() {
  const [departments, setDepartments] = useState([]);
  const [responderTypes, setResponderTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('ALL'); // ALL | NGO | GOV

  const emptyForm = {
    deptName: '',
    responderTypeCategory: 'GOV',
    focalPersonName: '',
    focalPersonNumber: '',
    deptAddress: '',
    deptEmail: '',
    responderTypeId: '',
  };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [deptData, rtData] = await Promise.all([
        assigningOfficerApi.departments().catch(() => []),
        assigningOfficerApi.responderTypes().catch(() => []),
      ]);
      setDepartments(deptData);
      setResponderTypes(rtData);
    } catch (err) {
      console.error('Failed to load departments:', err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setForm(emptyForm);
    setEditMode(false);
    setEditId(null);
    setModalOpen(true);
  };

  const openEditModal = (dept) => {
    setForm({
      deptName: dept.deptName || '',
      responderTypeCategory: dept.responderTypeCategory || 'GOV',
      focalPersonName: dept.focalPersonName || '',
      focalPersonNumber: dept.focalPersonNumber || '',
      deptAddress: dept.deptAddress || '',
      deptEmail: dept.deptEmail || '',
      responderTypeId: dept.responderType?.id || '',
    });
    setEditMode(true);
    setEditId(dept.deptId);
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.deptName.trim()) {
      toast.error('Department name is required');
      return;
    }
    setSaving(true);
    try {
      if (editMode) {
        await assigningOfficerApi.updateDepartment(editId, form);
        toast.success('Department updated successfully');
      } else {
        await assigningOfficerApi.createDepartment(form);
        toast.success('Department created successfully');
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      toast.error(err.message || 'Failed to save department');
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (deptId, deptName) => {
    if (!confirm(`Deactivate "${deptName}"?`)) return;
    try {
      await assigningOfficerApi.deactivateDepartment(deptId);
      toast.success(`"${deptName}" deactivated`);
      loadData();
    } catch (err) {
      toast.error(err.message || 'Failed to deactivate');
    }
  };

  const filteredDepts = departments.filter(d => {
    if (filter === 'NGO') return d.responderTypeCategory === 'NGO';
    if (filter === 'GOV') return d.responderTypeCategory === 'GOV';
    return true;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <div className="font-mono text-cyan-400 animate-pulse tracking-wider">[ LOADING DEPARTMENTS... ]</div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="font-title text-glow-primary text-2xl tracking-wider">DEPARTMENT REGISTRY</h1>
          <p className="font-mono text-xs text-cyan-500/60 mt-1">
            [ {departments.length} DEPARTMENT{departments.length !== 1 ? 'S' : ''} REGISTERED ]
          </p>
        </div>
        <div className="flex gap-2">
          {/* Filter */}
          {['ALL', 'GOV', 'NGO'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg font-mono text-[10px] tracking-wider border transition-all duration-300 ${
                filter === f
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400'
                  : 'bg-transparent border-cyan-500/20 text-cyan-500/60 hover:border-cyan-500/50'
              }`}
            >
              {f}
            </button>
          ))}
          <button
            onClick={openAddModal}
            className="px-4 py-1.5 bg-cyan-500/20 border border-cyan-400 rounded-lg font-mono text-xs text-glow-primary hover:bg-cyan-500/30 transition-all duration-300 hover:scale-105 flex items-center gap-2"
          >
            + ADD DEPARTMENT
          </button>
        </div>
      </div>

      {/* Department Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDepts.length > 0 ? filteredDepts.map((dept, idx) => (
          <div
            key={dept.deptId}
            className={`bg-[#0a1628]/80 border rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] animate-scaleIn ${
              dept.active ? 'border-cyan-500/20 hover:border-cyan-500/50' : 'border-red-500/20 opacity-60'
            }`}
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            {/* Top Row */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold ${
                  dept.responderTypeCategory === 'NGO'
                    ? 'bg-purple-500/20 border border-purple-500/30 text-purple-400'
                    : 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
                }`}>
                  {dept.responderTypeCategory === 'NGO' ? '🏠' : '🏛️'}
                </div>
                <div>
                  <h3 className="font-mono text-sm text-cyan-200 font-medium">{dept.deptName}</h3>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                    dept.responderTypeCategory === 'NGO'
                      ? 'bg-purple-500/15 text-purple-400 border-purple-500/30'
                      : 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                  }`}>
                    {dept.responderTypeCategory}
                  </span>
                </div>
              </div>
              <div className={`w-2 h-2 rounded-full ${dept.active ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} title={dept.active ? 'Active' : 'Inactive'} />
            </div>

            {/* Details */}
            <div className="space-y-1.5 mb-3">
              {dept.focalPersonName && (
                <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400/60">
                  <span>👤</span> {dept.focalPersonName}
                </div>
              )}
              {dept.focalPersonNumber && (
                <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400/60">
                  <span>📱</span> {dept.focalPersonNumber}
                </div>
              )}
              {dept.deptAddress && (
                <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400/60">
                  <span>📍</span> {dept.deptAddress}
                </div>
              )}
              {dept.deptEmail && (
                <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400/60">
                  <span>✉️</span> {dept.deptEmail}
                </div>
              )}
              {dept.responderType && (
                <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400/60">
                  <span>🏷️</span> {dept.responderType.name}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-cyan-500/10">
              <button
                onClick={() => openEditModal(dept)}
                className="flex-1 px-2 py-1.5 rounded-lg font-mono text-[10px] bg-cyan-900/20 border border-cyan-500/20 text-cyan-400/70 hover:text-cyan-400 hover:border-cyan-400 transition-all duration-200"
              >
                ✏️ EDIT
              </button>
              {dept.active && (
                <button
                  onClick={() => handleDeactivate(dept.deptId, dept.deptName)}
                  className="flex-1 px-2 py-1.5 rounded-lg font-mono text-[10px] bg-red-900/10 border border-red-500/20 text-red-400/70 hover:text-red-400 hover:border-red-400 transition-all duration-200"
                >
                  ⛔ DEACTIVATE
                </button>
              )}
            </div>
          </div>
        )) : (
          <div className="col-span-full text-center py-16 bg-[#0a1628]/80 border border-cyan-500/20 rounded-xl">
            <span className="text-4xl mb-4 block">🏢</span>
            <p className="font-mono text-cyan-400/60 text-sm">No departments found</p>
            <button onClick={openAddModal} className="mt-3 px-4 py-2 bg-cyan-500/20 border border-cyan-400 rounded-lg font-mono text-xs text-glow-primary hover:bg-cyan-500/30 transition-all duration-300">
              + ADD FIRST DEPARTMENT
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-[#0a1628] border border-cyan-500/30 rounded-2xl p-6 animate-scaleIn shadow-2xl shadow-cyan-500/10 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-title text-glow-primary text-lg tracking-wider">
                {editMode ? 'EDIT DEPARTMENT' : 'ADD DEPARTMENT'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-cyan-400/60 hover:text-white transition-colors text-lg">✕</button>
            </div>

            {/* Category Toggle */}
            <div className="mb-4">
              <label className="block font-mono text-[10px] text-cyan-400/60 tracking-wider mb-1.5">CATEGORY</label>
              <div className="flex gap-2">
                {['GOV', 'NGO'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setForm(prev => ({ ...prev, responderTypeCategory: cat }))}
                    className={`flex-1 px-3 py-2 rounded-lg font-mono text-[11px] tracking-wider border transition-all duration-200 ${
                      form.responderTypeCategory === cat
                        ? cat === 'GOV' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                        : 'bg-transparent border-cyan-500/20 text-cyan-500/60'
                    }`}
                  >
                    {cat === 'GOV' ? '🏛️ GOVERNMENT' : '🏠 NGO'}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            {[
              { key: 'deptName', label: 'DEPARTMENT NAME', placeholder: 'e.g. K-Electric, Edhi Foundation' },
              { key: 'focalPersonName', label: 'FOCAL PERSON NAME', placeholder: 'e.g. Ahmed Raza' },
              { key: 'focalPersonNumber', label: 'FOCAL PERSON NUMBER', placeholder: 'e.g. 0300-1234567' },
              { key: 'deptAddress', label: 'ADDRESS', placeholder: 'e.g. Korangi Industrial Area, Karachi' },
              { key: 'deptEmail', label: 'EMAIL', placeholder: 'e.g. dept@example.com' },
            ].map(field => (
              <div key={field.key} className="mb-3">
                <label className="block font-mono text-[10px] text-cyan-400/60 tracking-wider mb-1.5">{field.label}</label>
                <input
                  type="text"
                  value={form[field.key]}
                  onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  className="w-full bg-[#050916] border border-cyan-500/30 rounded-lg px-3 py-2 font-mono text-xs text-cyan-200 focus:border-cyan-400 focus:outline-none transition-colors placeholder:text-cyan-500/30"
                />
              </div>
            ))}

            {/* Responder Type Dropdown */}
            <div className="mb-5">
              <label className="block font-mono text-[10px] text-cyan-400/60 tracking-wider mb-1.5">RESPONDER TYPE</label>
              <select
                value={form.responderTypeId}
                onChange={e => setForm(prev => ({ ...prev, responderTypeId: e.target.value }))}
                className="w-full bg-[#050916] border border-cyan-500/30 rounded-lg px-3 py-2 font-mono text-xs text-cyan-200 focus:border-cyan-400 focus:outline-none transition-colors"
              >
                <option value="">— Select Responder Type (Optional) —</option>
                {responderTypes.map(rt => (
                  <option key={rt.id} value={rt.id}>{rt.name}</option>
                ))}
              </select>
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
                onClick={handleSubmit}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-cyan-500/20 border border-cyan-400 rounded-lg font-mono text-xs text-glow-primary hover:bg-cyan-500/30 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <><div className="w-3 h-3 border border-cyan-400 border-t-transparent rounded-full animate-spin" /> SAVING...</>
                ) : editMode ? '💾 UPDATE' : '+ CREATE'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out forwards; opacity: 0; }
      `}</style>
    </div>
  );
}
