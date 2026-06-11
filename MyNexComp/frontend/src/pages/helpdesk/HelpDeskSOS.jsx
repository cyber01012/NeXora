import { useEffect, useState } from 'react';
import { helpDeskApi } from '../../services/HelpDesk/helpDeskApi';
import { toast } from 'sonner';

export default function CreateSOS() {
  const [natures, setNatures] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    callerPhone: '',
    province: '',
    district: '',
    town: '',
    area: '',
    city: '',
    complaintNatureId: '',
    priority: 'NORMAL',
    detail: ''
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadNatures();
  }, []);

  const loadNatures = async () => {
    try {
      const data = await helpDeskApi.sosNatures();
      setNatures(data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load emergency natures.');
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Caller name is required.');
      return;
    }
    if (!formData.callerPhone.trim()) {
      toast.error('Caller phone is required.');
      return;
    }
    if (!formData.province.trim()) {
      toast.error('Province is required.');
      return;
    }
    if (!formData.district.trim()) {
      toast.error('District is required.');
      return;
    }
    if (!formData.city.trim()) {
      toast.error('City is required.');
      return;
    }
    if (!formData.complaintNatureId) {
      toast.error('Emergency nature is required.');
      return;
    }
    if (!formData.detail.trim()) {
      toast.error('Emergency details are required.');
      return;
    }
    setShowConfirm(true);
  };

  const confirmTransmit = async () => {
    try {
      setSubmitting(true);
      await helpDeskApi.createSOS(formData);
      toast.success('SOS transmitted successfully.');
      setShowConfirm(false);
      setFormData({
        name: '',
        callerPhone: '',
        province: '',
        district: '',
        town: '',
        area: '',
        city: '',
        complaintNatureId: '',
        priority: 'NORMAL',
        detail: ''
      });
    } catch (err) {
      console.error(err);
      toast.error('Failed to transmit SOS.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* HEADER */}
      <div className="border border-red-500/30 bg-red-950/20 rounded-3xl p-6 shadow-[0_0_30px_rgba(239,68,68,0.1)] relative overflow-hidden">
        <div className="absolute right-6 top-6 text-5xl opacity-20">🚨</div>
        <h1 className="text-3xl font-bold text-red-400 tracking-widest drop-shadow-[0_0_10px_#ef4444] font-title">
          CREATE SOS REPORT
        </h1>
        <p className="text-red-300/60 mt-1 font-mono text-sm">
          [ EMERGENCY TRANSMISSION CONSOLE ]
        </p>
        <p className="text-cyan-500/40 text-xs font-mono tracking-widest mt-3">
          [ SECURE EMERGENCY RESPONSE BROADCAST NETWORK ]
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#071018] border border-cyan-500/20 rounded-3xl p-8 space-y-6 shadow-[0_0_20px_rgba(0,240,255,0.05)]"
      >
        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-xs font-mono text-cyan-400/70 tracking-wider">CALLER NAME</label>
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full bg-black/40 border border-cyan-500/20 rounded-xl px-4 py-3 text-cyan-100 placeholder-cyan-500/30 focus:outline-none focus:border-cyan-400 transition-colors font-mono"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono text-cyan-400/70 tracking-wider">CALLER PHONE</label>
            <input
              type="text"
              placeholder="e.g. +923001234567"
              value={formData.callerPhone}
              onChange={(e) => handleChange('callerPhone', e.target.value)}
              className="w-full bg-black/40 border border-cyan-500/20 rounded-xl px-4 py-3 text-cyan-100 placeholder-cyan-500/30 focus:outline-none focus:border-cyan-400 transition-colors font-mono"
            />
          </div>
        </div>

        <div className="border-t border-cyan-500/10 pt-4">
          <h3 className="text-xs font-mono text-cyan-400/50 tracking-widest mb-4">[ LOCATION METADATA ]</h3>
          <div className="grid md:grid-cols-3 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-cyan-400/60">PROVINCE</label>
              <input
                type="text"
                placeholder="Province"
                value={formData.province}
                onChange={(e) => handleChange('province', e.target.value)}
                className="w-full bg-black/40 border border-cyan-500/20 rounded-xl px-4 py-2.5 text-cyan-100 placeholder-cyan-500/30 focus:outline-none focus:border-cyan-400 transition-colors font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-cyan-400/60">DISTRICT</label>
              <input
                type="text"
                placeholder="District"
                value={formData.district}
                onChange={(e) => handleChange('district', e.target.value)}
                className="w-full bg-black/40 border border-cyan-500/20 rounded-xl px-4 py-2.5 text-cyan-100 placeholder-cyan-500/30 focus:outline-none focus:border-cyan-400 transition-colors font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-cyan-400/60">TOWN</label>
              <input
                type="text"
                placeholder="Town"
                value={formData.town}
                onChange={(e) => handleChange('town', e.target.value)}
                className="w-full bg-black/40 border border-cyan-500/20 rounded-xl px-4 py-2.5 text-cyan-100 placeholder-cyan-500/30 focus:outline-none focus:border-cyan-400 transition-colors font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-cyan-400/60">AREA</label>
              <input
                type="text"
                placeholder="Area/Neighborhood"
                value={formData.area}
                onChange={(e) => handleChange('area', e.target.value)}
                className="w-full bg-black/40 border border-cyan-500/20 rounded-xl px-4 py-2.5 text-cyan-100 placeholder-cyan-500/30 focus:outline-none focus:border-cyan-400 transition-colors font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-cyan-400/60">CITY</label>
              <input
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                className="w-full bg-black/40 border border-cyan-500/20 rounded-xl px-4 py-2.5 text-cyan-100 placeholder-cyan-500/30 focus:outline-none focus:border-cyan-400 transition-colors font-mono text-sm"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-cyan-500/10 pt-4 grid md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-xs font-mono text-cyan-400/70 tracking-wider">EMERGENCY NATURE</label>
            <select
              value={formData.complaintNatureId}
              onChange={(e) => handleChange('complaintNatureId', e.target.value)}
              className="w-full bg-black/40 border border-cyan-500/20 rounded-xl px-4 py-3 text-cyan-100 focus:outline-none focus:border-cyan-400 transition-colors font-mono text-sm"
            >
              <option value="" className="bg-gray-900 text-cyan-300">Select Nature</option>
              {natures.map((nature) => (
                <option key={nature.id} value={nature.id} className="bg-gray-900 text-cyan-100">
                  {nature.description || nature.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono text-red-400/70 tracking-wider">PRIORITY LEVEL</label>
            <select
              value={formData.priority}
              onChange={(e) => handleChange('priority', e.target.value)}
              className="w-full bg-black/40 border border-red-500/20 rounded-xl px-4 py-3 text-red-200 focus:outline-none focus:border-red-400 transition-colors font-mono text-sm"
            >
              <option value="NORMAL" className="bg-gray-900 text-cyan-300">NORMAL</option>
              <option value="HIGH" className="bg-gray-900 text-yellow-300 font-bold">HIGH</option>
              <option value="CRITICAL" className="bg-gray-900 text-red-400 font-bold">CRITICAL</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono text-cyan-400/70 tracking-wider">EMERGENCY DETAILS & DISPATCH NOTES</label>
          <textarea
            rows={4}
            placeholder="Type comprehensive details describing the incident..."
            value={formData.detail}
            onChange={(e) => handleChange('detail', e.target.value)}
            className="w-full bg-black/40 border border-cyan-500/20 rounded-xl px-4 py-3 text-cyan-100 placeholder-cyan-500/30 focus:outline-none focus:border-cyan-400 transition-colors font-mono text-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 rounded-xl bg-red-950/40 border border-red-500/50 text-red-400 font-bold tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-[0_0_20px_rgba(255,0,0,0.15)] text-sm font-mono"
        >
          🚨 TRANSMIT SOS BROADCAST
        </button>
      </form>

      {/* CONFIRM MODAL */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-[110] animate-fadeIn">
          <div className="w-[90%] max-w-md bg-[#071018] border border-red-500/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(255,0,0,0.25)] text-center">
            <div className="text-5xl animate-bounce mb-4">🚨</div>
            <h2 className="text-2xl font-bold text-red-400 tracking-widest font-title">
              CONFIRM TRANSMISSION
            </h2>
            <p className="text-red-300/70 text-sm mt-3 font-mono">
              Are you sure you want to broadcast this SOS alert to the responder network?
            </p>
            <div className="flex gap-4 mt-6">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 rounded-xl border border-cyan-500/20 text-cyan-300 hover:bg-cyan-500/10 transition-all font-mono text-xs"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={confirmTransmit}
                disabled={submitting}
                className="flex-1 py-3 rounded-xl bg-red-950/40 border border-red-500 text-red-400 hover:bg-red-500 hover:text-white transition-all font-mono text-xs"
              >
                {submitting ? 'TRANSMITTING...' : 'CONFIRM'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}