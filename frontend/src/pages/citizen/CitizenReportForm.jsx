import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HUDCard from '../../components/ui/HUDCard';
import ProgressSteps from '../../components/ui/ProgressSteps';
import { citizenApi } from '../../services/api';
import { IncidentReportBuilder } from '../../utils/IncidentReportBuilder';

const ISSUE_TYPES = [
  { key: 'ELECTRICITY', value: 'ELECTRICITY', icon: '⚡', label: 'ELECTRICITY', color: '#fbbf24', natureId: 7 },
  { key: 'GAS', value: 'GAS', icon: '🔥', label: 'GAS', color: '#f97316', natureId: 8 },
  { key: 'ROAD', value: 'ROAD', icon: '🛣️', label: 'ROAD', color: '#60a5fa', natureId: 9 },
  { key: 'WATER', value: 'WATER', icon: '💧', label: 'WATER', color: '#22d3ee', natureId: 10 },
  { key: 'MEDICAL', value: 'MEDICAL', icon: '🏥', label: 'MEDICAL', color: '#4ade80', natureId: 1 },
];

const STEPS = ['TYPE', 'DETAILS', 'LOCATION', 'EVIDENCE', 'REVIEW'];

export default function CitizenReportForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');
  const [error, setError] = useState('');
  const [filePreview, setFilePreview] = useState(null);
  const [fileSelected, setFileSelected] = useState(null);

  const [formData, setFormData] = useState({
    type: '',
    natureId: null,
    detail: '',
    province: '',
    district: '',
    town: '',
    area: '',
    city: '',
    evidence: ''
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleTypeSelect = (typeValue, natureId) => {
    updateField('type', typeValue);
    updateField('natureId', natureId);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileSelected(file);
      setFilePreview(URL.createObjectURL(file));
      updateField('evidence', file.name);
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && !formData.type) {
      setError('Please select an issue type');
      return;
    }
    if (currentStep === 2 && !formData.detail.trim()) {
      setError('Please describe the issue');
      return;
    }
    if (currentStep === 3 && (!formData.city || !formData.area)) {
      setError('Please enter city and area');
      return;
    }
    setError('');
    setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError('');
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    
    try {
      const payload = new IncidentReportBuilder()
        .setType(formData.type)
        .setDescription(formData.detail)
        .setLocation(`${formData.area}, ${formData.city}`)
        .setCity(formData.city)
        .setArea(formData.area)
        .setProvince(formData.province || 'Sindh')
        .setDistrict(formData.district)
        .setTown(formData.town)
        .setEvidence(formData.evidence)
        .build();
      
      const result = await citizenApi.createReport(payload);
      setTrackingCode(result.trackingCode || `CIV-${Date.now()}`);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <HUDCard className="text-center py-12">
          <div className="text-6xl mb-4 animate-bounce">✅</div>
          <h2 className="font-title text-glow-primary text-2xl mb-2">REPORT SUBMITTED</h2>
          <p className="font-mono text-sm text-cyan-300 mb-2">
            Your report has been sent to Admin for review.
          </p>
          <div className="my-6 p-4 bg-cyan-900/30 rounded-lg inline-block border border-cyan-500/30">
            <p className="font-data text-[10px] text-cyan-400/60 tracking-wider">TRACKING CODE</p>
            <p className="font-mono text-2xl text-glow-primary tracking-wider">{trackingCode}</p>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/citizen/reports')}
              className="px-6 py-2 bg-cyan-500/20 border border-cyan-400 rounded-lg font-mono text-sm text-glow-primary hover:bg-cyan-500/30 transition-all"
            >
              VIEW MY REPORTS
            </button>
            <button
              onClick={() => {
                setSubmitted(false);
                setCurrentStep(1);
                setFormData({ type: '', natureId: null, detail: '', province: '', district: '', town: '', area: '', city: '', evidence: '' });
                setFilePreview(null);
                setFileSelected(null);
              }}
              className="px-6 py-2 bg-cyan-500/20 border border-cyan-400 rounded-lg font-mono text-sm text-cyan-300 hover:text-glow-primary transition-all"
            >
              SUBMIT ANOTHER
            </button>
          </div>
        </HUDCard>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-title text-glow-primary text-3xl tracking-wider">REPORT ISSUE</h1>
        <p className="font-mono text-[10px] text-cyan-500/60 mt-1 tracking-wider">
          [ CIVIC COMPLAINT FORM ]
        </p>
      </div>

      {/* Progress Steps - Claude Style */}
      <div className="flex items-center justify-between mb-8">
        {STEPS.map((label, idx) => (
          <div key={label} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-sm font-bold transition-all duration-300 ${
                  idx + 1 <= currentStep
                    ? 'bg-cyan-400 text-[var(--bg-dark)] shadow-[0_0_15px_cyan]'
                    : 'bg-[var(--bg3)] border border-cyan-500/30 text-cyan-500/50'
                }`}
              >
                {idx + 1}
              </div>
              <span
                className={`text-[9px] font-mono mt-2 tracking-wider ${
                  idx + 1 <= currentStep ? 'text-cyan-400' : 'text-cyan-500/40'
                }`}
              >
                {label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={`flex-1 h-px mx-2 transition-all duration-500 ${
                  idx + 1 < currentStep ? 'bg-cyan-400 shadow-[0_0_4px_cyan]' : 'bg-cyan-500/20'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Form Card - Claude Style Glassmorphism */}
      <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-6 relative overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.3)]">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60" />

        {/* Step 1: Select Type - Claude Style Cards */}
        {currentStep === 1 && (
          <div>
            <p className="font-mono text-[11px] text-cyan-400/60 mb-4 tracking-wider">SELECT INCIDENT TYPE</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {ISSUE_TYPES.map((type) => (
                <button
                  key={type.key}
                  onClick={() => handleTypeSelect(type.value, type.natureId)}
                  className={`group p-5 rounded-xl border transition-all duration-300 text-center ${
                    formData.type === type.value
                      ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_20px_rgba(0,240,255,0.15)] scale-[1.02]'
                      : 'border-cyan-500/20 hover:border-cyan-500/50 hover:bg-cyan-800/5'
                  }`}
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{type.icon}</div>
                  <p className="font-data text-sm" style={{ color: type.color }}>{type.label}</p>
                  <p className="font-mono text-[9px] text-cyan-400/50 mt-1">{type.value}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Description - Claude Style */}
        {currentStep === 2 && (
          <div>
            <p className="font-mono text-[11px] text-cyan-400/60 mb-2 tracking-wider">ISSUE DESCRIPTION</p>
            <textarea
              className="w-full bg-cyan-900/20 border border-cyan-500/20 rounded-xl p-4 font-mono text-sm text-cyan-200 focus:border-cyan-400 focus:outline-none transition-all resize-none"
              rows="6"
              placeholder="Describe your issue in detail..."
              value={formData.detail}
              onChange={(e) => updateField('detail', e.target.value)}
            />
            <p className="font-mono text-[9px] text-cyan-500/40 mt-2 text-right">
              {formData.detail.length} characters
            </p>
          </div>
        )}

        {/* Step 3: Location - Claude Style Grid */}
        {currentStep === 3 && (
          <div>
            <p className="font-mono text-[11px] text-cyan-400/60 mb-4 tracking-wider">LOCATION DETAILS</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[9px] text-cyan-400/60 mb-1">PROVINCE</label>
                <select
                  className="w-full bg-cyan-900/20 border border-cyan-500/20 rounded-lg p-2.5 font-mono text-sm text-cyan-200 focus:border-cyan-400 focus:outline-none"
                  value={formData.province}
                  onChange={(e) => updateField('province', e.target.value)}
                >
                  <option value="">Select Province</option>
                  <option value="Sindh">Sindh</option>
                  <option value="Punjab">Punjab</option>
                  <option value="KPK">KPK</option>
                  <option value="Balochistan">Balochistan</option>
                </select>
              </div>
              <div>
                <label className="block font-mono text-[9px] text-cyan-400/60 mb-1">DISTRICT</label>
                <input
                  type="text"
                  className="w-full bg-cyan-900/20 border border-cyan-500/20 rounded-lg p-2.5 font-mono text-sm text-cyan-200 focus:border-cyan-400 focus:outline-none"
                  value={formData.district}
                  onChange={(e) => updateField('district', e.target.value)}
                  placeholder="Karachi East"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-cyan-400/60 mb-1">TOWN</label>
                <input
                  type="text"
                  className="w-full bg-cyan-900/20 border border-cyan-500/20 rounded-lg p-2.5 font-mono text-sm text-cyan-200 focus:border-cyan-400 focus:outline-none"
                  value={formData.town}
                  onChange={(e) => updateField('town', e.target.value)}
                  placeholder="Korangi"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-cyan-400/60 mb-1">AREA / STREET</label>
                <input
                  type="text"
                  className="w-full bg-cyan-900/20 border border-cyan-500/20 rounded-lg p-2.5 font-mono text-sm text-cyan-200 focus:border-cyan-400 focus:outline-none"
                  value={formData.area}
                  onChange={(e) => updateField('area', e.target.value)}
                  placeholder="Korangi-2, Street 5"
                />
              </div>
              <div className="col-span-2">
                <label className="block font-mono text-[9px] text-cyan-400/60 mb-1">CITY</label>
                <input
                  type="text"
                  className="w-full bg-cyan-900/20 border border-cyan-500/20 rounded-lg p-2.5 font-mono text-sm text-cyan-200 focus:border-cyan-400 focus:outline-none"
                  value={formData.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  placeholder="Karachi"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Evidence Upload - Claude Style */}
        {currentStep === 4 && (
          <div>
            <p className="font-mono text-[11px] text-cyan-400/60 mb-2 tracking-wider">UPLOAD EVIDENCE</p>
            <label htmlFor="evidence-upload" className="block w-full cursor-pointer">
              <div className="border-2 border-dashed border-cyan-500/30 rounded-xl p-10 text-center hover:border-cyan-400 transition-all group bg-cyan-900/10">
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">📷</div>
                <p className="font-mono text-sm text-cyan-400/60">Click to open file explorer</p>
                <p className="font-mono text-[10px] text-cyan-500/40 mt-2">JPG, PNG, MP4 — Max 50MB</p>
              </div>
            </label>
            <input id="evidence-upload" type="file" accept="image/*,video/*" className="hidden" onChange={handleFileChange} />
            
            {filePreview && (
              <div className="mt-4 p-4 bg-cyan-900/30 rounded-xl border border-cyan-500/30">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-cyan-800/50 rounded-lg flex items-center justify-center text-2xl">📎</div>
                  <div className="flex-1">
                    <p className="font-mono text-sm text-cyan-200">{fileSelected?.name}</p>
                    <p className="font-mono text-[9px] text-cyan-400/60">{fileSelected?.size ? (fileSelected.size / 1024).toFixed(1) : 0} KB</p>
                  </div>
                  <button
                    onClick={() => {
                      setFilePreview(null);
                      setFileSelected(null);
                      updateField('evidence', '');
                    }}
                    className="px-3 py-1.5 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-xs hover:bg-red-500/30 transition-all"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 5: Review - Claude Style Summary */}
        {currentStep === 5 && (
          <div>
            <p className="font-mono text-[11px] text-cyan-400/60 mb-4 tracking-wider">REVIEW YOUR REPORT</p>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-cyan-900/20 rounded-lg border border-cyan-500/20">
                <span className="font-mono text-[10px] text-cyan-400/60">ISSUE TYPE</span>
                <span className="font-data text-sm text-glow-primary flex items-center gap-2">
                  {ISSUE_TYPES.find(t => t.value === formData.type)?.icon} {formData.type}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-cyan-900/20 rounded-lg border border-cyan-500/20">
                <span className="font-mono text-[10px] text-cyan-400/60">DESCRIPTION</span>
                <span className="font-mono text-xs text-cyan-200 max-w-[200px] truncate">{formData.detail || '—'}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-cyan-900/20 rounded-lg border border-cyan-500/20">
                <span className="font-mono text-[10px] text-cyan-400/60">LOCATION</span>
                <span className="font-mono text-xs text-cyan-200">{formData.area}, {formData.city}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-cyan-900/20 rounded-lg border border-cyan-500/20">
                <span className="font-mono text-[10px] text-cyan-400/60">EVIDENCE</span>
                <span className="font-mono text-xs text-cyan-200">{fileSelected?.name || 'No file attached'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="font-mono text-xs text-red-400">{error}</p>
          </div>
        )}

        {/* Navigation Buttons - Claude Style */}
        <div className="flex justify-between mt-6 pt-4 border-t border-[var(--border)]">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-6 py-2 rounded-lg font-mono text-sm transition-all ${
              currentStep === 1
                ? 'text-cyan-500/30 cursor-not-allowed'
                : 'bg-cyan-500/20 border border-cyan-400 text-cyan-400 hover:bg-cyan-500/30'
            }`}
          >
            ← BACK
          </button>

          {currentStep < STEPS.length ? (
            <button
              onClick={nextStep}
              className="px-6 py-2 bg-cyan-500/20 border border-cyan-400 rounded-lg font-mono text-sm text-glow-primary hover:bg-cyan-500/30 transition-all"
            >
              NEXT →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-8 py-2 bg-cyan-500/20 border border-cyan-400 rounded-lg font-mono text-sm text-glow-primary hover:bg-cyan-500/30 transition-all disabled:opacity-50"
            >
              {submitting ? 'SUBMITTING...' : '🚀 SUBMIT REPORT'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}