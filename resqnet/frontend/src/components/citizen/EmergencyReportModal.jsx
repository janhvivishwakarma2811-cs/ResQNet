import React, { useState } from 'react';
import api from '../../api/axios';
import Modal from '../common/Modal';
import LocationPicker from '../map/LocationPicker';
import {
  AlertTriangle,
  Flame,
  Droplets,
  HeartPulse,
  Truck,
  Building,
  Wind,
  ShieldAlert,
  Loader2,
  CheckCircle2,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

const CATEGORIES = [
  { value: 'FLOOD', label: 'Flood / Waterlogging', icon: Droplets, color: 'text-blue-500' },
  { value: 'FIRE', label: 'Fire Outbreak', icon: Flame, color: 'text-orange-500' },
  { value: 'EARTHQUAKE', label: 'Earthquake / Tremor', icon: Building, color: 'text-amber-600' },
  { value: 'MEDICAL', label: 'Medical Emergency', icon: HeartPulse, color: 'text-red-500' },
  { value: 'ACCIDENT', label: 'Road / Transit Accident', icon: Truck, color: 'text-slate-600' },
  { value: 'BUILDING_COLLAPSE', label: 'Structural Collapse', icon: Building, color: 'text-amber-700' },
  { value: 'CYCLONE', label: 'Cyclone / Storm', icon: Wind, color: 'text-teal-600' },
  { value: 'OTHER', label: 'Other Hazard', icon: AlertTriangle, color: 'text-purple-600' },
];

const SEVERITIES = [
  { value: 'LOW', label: 'Low', desc: 'Minor hazard, no immediate danger', border: 'border-green-300', bg: 'bg-green-50 text-green-800' },
  { value: 'MEDIUM', label: 'Medium', desc: 'Significant damage, urgent attention', border: 'border-amber-300', bg: 'bg-amber-50 text-amber-800' },
  { value: 'HIGH', label: 'High', desc: 'Severe situation, injuries reported', border: 'border-orange-300', bg: 'bg-orange-50 text-orange-800' },
  { value: 'CRITICAL', label: 'Critical', desc: 'Life-threatening, immediate rescue needed', border: 'border-red-400', bg: 'bg-red-50 text-red-800' },
];

const EmergencyReportModal = ({ isOpen, onClose, onIncidentCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'FLOOD',
    severity: 'HIGH',
    description: '',
    affectedCount: 1,
    contactPhone: '',
    latitude: 28.6139,
    longitude: 77.2090,
    address: '',
    imageUrl: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successResult, setSuccessResult] = useState(null);

  const handleLocationChange = (lat, lng) => {
    setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
  };

  const handleAddressChange = (addr) => {
    setFormData((prev) => ({ ...prev, address: addr }));
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be under 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await api.post('/incidents', formData);
      setSuccessResult(res.data);
      if (onIncidentCreated) onIncidentCreated(res.data);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit emergency report. Please check fields.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccess = () => {
    setSuccessResult(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Report an Emergency Incident" maxWidth="max-w-3xl">
      {successResult ? (
        <div className="text-center py-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Emergency Report Logged</h3>
          <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto">
            Your emergency report has been registered in the ResQNet command system. Responders in your sector have been alerted.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 max-w-md mx-auto text-left text-sm space-y-2 mb-6">
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Tracking Code:</span>
              <strong className="font-mono text-red-600 text-base">{successResult.trackingCode}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Category:</span>
              <span className="font-semibold">{successResult.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Severity:</span>
              <span className="font-bold text-red-700">{successResult.severity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Location:</span>
              <span className="font-medium text-slate-700">{successResult.address}</span>
            </div>
          </div>

          <button
            onClick={handleCloseSuccess}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl transition-colors"
          >
            Done & Return to Dashboard
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200">
              {errorMsg}
            </div>
          )}

          {/* 1. Category Selection */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              1. Emergency Category *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = formData.category === cat.value;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.value })}
                    className={`p-3 rounded-xl border text-left flex flex-col items-center justify-center text-center transition-all ${
                      isSelected
                        ? 'border-red-600 bg-red-50/50 ring-2 ring-red-500 text-red-950 font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-red-600' : cat.color}`} />
                    <span className="text-xs">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Severity Selection */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              2. Severity Level *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SEVERITIES.map((sev) => {
                const isSelected = formData.severity === sev.value;
                return (
                  <button
                    key={sev.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, severity: sev.value })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? `border-slate-900 bg-slate-900 text-white shadow-md font-bold`
                        : `${sev.border} ${sev.bg} hover:opacity-90`
                    }`}
                  >
                    <div className="text-xs font-extrabold">{sev.label}</div>
                    <div className="text-[10px] opacity-80 mt-0.5">{sev.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Incident Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Emergency Headline / Short Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Flash Flood Stranding 5 Families in Lower Basin"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                People Trapped / Affected (Estimated) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.affectedCount}
                onChange={(e) => setFormData({ ...formData, affectedCount: parseInt(e.target.value) || 1 })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Contact Phone / Callback Number *
              </label>
              <input
                type="tel"
                required
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                placeholder="e.g. +91 9876543210"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Description of Emergency & Special Needs *
              </label>
              <textarea
                rows={3}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide details: water level, fire spread, injuries, trapped infants or elderly, obstacles..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
          </div>

          {/* 4. Interactive Location Picker with Map */}
          <div>
            <LocationPicker
              latitude={formData.latitude}
              longitude={formData.longitude}
              address={formData.address}
              onLocationChange={handleLocationChange}
              onAddressChange={handleAddressChange}
            />
          </div>

          {/* 5. Optional Incident Photo */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Optional Emergency Photo (Upload or image URL)
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <label className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer border border-slate-200 transition-colors w-full sm:w-auto justify-center">
                <Upload className="w-4 h-4 text-slate-500" />
                <span>Upload Incident Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </label>
              <span className="text-xs text-slate-400">or image URL:</span>
              <input
                type="url"
                value={formData.imageUrl.startsWith('data:') ? '' : formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/photo.jpg"
                className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-red-500 focus:outline-none w-full"
              />
            </div>
            {formData.imageUrl && (
              <div className="mt-3 relative inline-block">
                <img
                  src={formData.imageUrl}
                  alt="Incident preview"
                  className="w-32 h-20 object-cover rounded-xl border border-slate-200 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, imageUrl: '' })}
                  className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-0.5 text-xs"
                >
                  &times;
                </button>
              </div>
            )}
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-semibold text-sm rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Broadcasting to Responders...
                </>
              ) : (
                'SUBMIT EMERGENCY REPORT'
              )}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default EmergencyReportModal;
