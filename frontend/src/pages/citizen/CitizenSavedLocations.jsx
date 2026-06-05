import { useEffect, useState } from 'react';
import { citizenApi } from '../../services/api';

// Location Icon Component
const LocationIcon = ({ label }) => {
  const icons = {
    HOME: { icon: '🏠', color: '#fbbf24', label: 'HOME' },
    WORK: { icon: '🏢', color: '#60a5fa', label: 'WORK' },
    OTHER: { icon: '📍', color: '#22d3ee', label: 'OTHER' },
  };
  const i = icons[label] || icons.OTHER;
  return (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: `${i.color}15`, border: `1px solid ${i.color}30` }}>
      {i.icon}
    </div>
  );
};

export default function CitizenSavedLocations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [formData, setFormData] = useState({
    label: 'HOME',
    address: '',
    latitude: '',
    longitude: '',
    isDefault: false
  });

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      const data = await citizenApi.savedLocations();
      setLocations(data || []);
    } catch (err) {
      console.error('Failed to load locations:', err);
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleAdd = async () => {
    if (!formData.address.trim()) {
      showMessage('Please enter an address', 'error');
      return;
    }
    
    try {
      const payload = {
        label: formData.label,
        address: formData.address,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        isDefault: formData.isDefault
      };
      
      await citizenApi.addLocation(payload);
      showMessage('Location added successfully!', 'success');
      setAdding(false);
      resetForm();
      loadLocations();
    } catch (err) {
      console.error('Failed to add location:', err);
      showMessage('Failed to add location. Please try again.', 'error');
    }
  };

  const handleUpdate = async () => {
    if (!formData.address.trim()) {
      showMessage('Please enter an address', 'error');
      return;
    }
    
    try {
      const payload = {
        label: formData.label,
        address: formData.address,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        isDefault: formData.isDefault
      };
      
      await citizenApi.updateLocation(editingId, payload);
      showMessage('Location updated successfully!', 'success');
      setEditingId(null);
      resetForm();
      loadLocations();
    } catch (err) {
      console.error('Failed to update location:', err);
      showMessage('Failed to update location.', 'error');
    }
  };

  const handleDelete = async (id, label) => {
    if (confirm(`Are you sure you want to delete "${label}" location?`)) {
      try {
        await citizenApi.deleteLocation(id);
        showMessage('Location deleted successfully!', 'success');
        loadLocations();
      } catch (err) {
        console.error('Failed to delete location:', err);
        showMessage('Failed to delete location.', 'error');
      }
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await citizenApi.setDefaultLocation(id);
      showMessage('Default location updated!', 'success');
      loadLocations();
    } catch (err) {
      console.error('Failed to set default:', err);
      showMessage('Failed to set default location.', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      label: 'HOME',
      address: '',
      latitude: '',
      longitude: '',
      isDefault: false
    });
  };

  const startEdit = (loc) => {
    setEditingId(loc.id);
    setFormData({
      label: loc.label,
      address: loc.address,
      latitude: loc.latitude || '',
      longitude: loc.longitude || '',
      isDefault: loc.isDefault || false
    });
    setAdding(false);
  };

  const cancelForm = () => {
    setAdding(false);
    setEditingId(null);
    resetForm();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <div className="font-mono text-cyan-400 animate-pulse tracking-wider">[ LOADING LOCATIONS... ]</div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-title text-glow-primary text-2xl tracking-wider">SAVED LOCATIONS</h1>
          <p className="font-mono text-xs text-cyan-500/60 mt-1">[ QUICK ACCESS TO YOUR FREQUENT ADDRESSES ]</p>
        </div>
        {!adding && !editingId && (
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-400 rounded-lg font-mono text-sm text-glow-primary hover:bg-cyan-500/30 transition-all duration-300 hover:scale-[1.02]"
          >
            <span className="text-lg">+</span> ADD LOCATION
          </button>
        )}
      </div>

      {/* Success/Error Message */}
      {message.text && (
        <div className={`p-3 rounded-lg ${message.type === 'success' ? 'bg-green-500/20 border border-green-500/50 text-green-400' : 'bg-red-500/20 border border-red-500/50 text-red-400'} font-mono text-sm`}>
          {message.text}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl p-3 text-center">
          <p className="font-mono text-[9px] text-gray-500">TOTAL</p>
          <p className="font-data text-xl text-glow-primary">{locations.length}</p>
        </div>
        <div className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl p-3 text-center">
          <p className="font-mono text-[9px] text-gray-500">DEFAULT</p>
          <p className="font-data text-xl text-yellow-400">{locations.filter(l => l.isDefault).length}</p>
        </div>
        <div className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl p-3 text-center">
          <p className="font-mono text-[9px] text-gray-500">ADDRESSES</p>
          <p className="font-data text-xl text-cyan-400">{locations.length}</p>
        </div>
      </div>

      {/* Add/Edit Form */}
      {(adding || editingId) && (
        <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60" />
          
          <h3 className="font-title text-glow-primary text-sm tracking-wider mb-4">
            {editingId ? 'EDIT LOCATION' : 'ADD NEW LOCATION'}
          </h3>
          
          <div className="space-y-3">
            <div>
              <label className="block font-mono text-[9px] text-cyan-400/60 mb-1 tracking-wider">LABEL</label>
              <select
                className="w-full bg-cyan-900/20 border border-cyan-500/20 rounded-lg p-2.5 font-mono text-sm text-cyan-200 focus:border-cyan-400 focus:outline-none"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              >
                <option value="HOME">🏠 HOME</option>
                <option value="WORK">🏢 WORK</option>
                <option value="OTHER">📍 OTHER</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-[9px] text-cyan-400/60 mb-1 tracking-wider">ADDRESS</label>
              <input
                type="text"
                className="w-full bg-cyan-900/20 border border-cyan-500/20 rounded-lg p-2.5 font-mono text-sm text-cyan-200 focus:border-cyan-400 focus:outline-none"
                placeholder="Street address, area, city..."
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-mono text-[9px] text-cyan-400/60 mb-1">LATITUDE (Optional)</label>
                <input
                  type="number"
                  step="any"
                  className="w-full bg-cyan-900/20 border border-cyan-500/20 rounded-lg p-2 font-mono text-sm text-cyan-200 focus:border-cyan-400 focus:outline-none"
                  placeholder="24.8607"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-cyan-400/60 mb-1">LONGITUDE (Optional)</label>
                <input
                  type="number"
                  step="any"
                  className="w-full bg-cyan-900/20 border border-cyan-500/20 rounded-lg p-2 font-mono text-sm text-cyan-200 focus:border-cyan-400 focus:outline-none"
                  placeholder="67.0011"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isDefault"
                className="w-4 h-4 rounded border-cyan-500/30 bg-cyan-900/20 checked:bg-cyan-400"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
              />
              <label htmlFor="isDefault" className="font-mono text-xs text-cyan-300">
                Set as default location
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={editingId ? handleUpdate : handleAdd}
                className="flex-1 py-2 bg-cyan-500/20 border border-cyan-400 rounded-lg font-mono text-sm text-glow-primary hover:bg-cyan-500/30 transition-all"
              >
                {editingId ? 'UPDATE LOCATION' : 'SAVE LOCATION'}
              </button>
              <button
                onClick={cancelForm}
                className="flex-1 py-2 bg-gray-500/20 border border-gray-500 rounded-lg font-mono text-sm text-gray-400 hover:bg-gray-500/30 transition-all"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Locations List */}
      {locations.length === 0 && !adding && !editingId ? (
        <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-12 text-center">
          <div className="text-6xl mb-3 opacity-40">📍</div>
          <p className="font-mono text-sm text-gray-400">No saved locations yet</p>
          <button
            onClick={() => setAdding(true)}
            className="inline-block mt-4 text-sm text-cyan-400 hover:underline transition-all"
          >
            Add your first location →
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {locations.map((loc) => (
            <div 
              key={loc.id} 
              className={`bg-[var(--bg2)] border rounded-xl p-4 transition-all duration-300 ${
                loc.isDefault ? 'border-cyan-500/50 shadow-[0_0_15px_rgba(0,240,255,0.1)]' : 'border-[var(--border)] hover:border-cyan-500/30'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <LocationIcon label={loc.label} />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-data text-md text-glow-primary">{loc.label}</p>
                      {loc.isDefault && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                          DEFAULT
                        </span>
                      )}
                    </div>
                    <p className="font-mono text-sm text-gray-300 mt-1 max-w-md">{loc.address}</p>
                    {loc.latitude && loc.longitude && (
                      <p className="font-mono text-[9px] text-gray-500 mt-2">
                        📍 {typeof loc.latitude === 'number' ? loc.latitude.toFixed(4) : loc.latitude}, {typeof loc.longitude === 'number' ? loc.longitude.toFixed(4) : loc.longitude}
                      </p>
                    )}
                    <p className="font-mono text-[9px] text-gray-600 mt-1">
                      Added on {new Date(loc.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!loc.isDefault && (
                    <button
                      onClick={() => handleSetDefault(loc.id)}
                      className="text-[10px] font-mono text-cyan-400/70 hover:text-cyan-400 transition-colors px-2 py-1"
                      title="Set as default"
                    >
                      ⭐ DEFAULT
                    </button>
                  )}
                  <button
                    onClick={() => startEdit(loc)}
                    className="text-[10px] font-mono text-blue-400/70 hover:text-blue-400 transition-colors px-2 py-1"
                  >
                    ✏️ EDIT
                  </button>
                  <button
                    onClick={() => handleDelete(loc.id, loc.label)}
                    className="text-[10px] font-mono text-red-400/70 hover:text-red-400 transition-colors px-2 py-1"
                  >
                    🗑️ DELETE
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}