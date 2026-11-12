import React, { useState } from 'react';
import api from '../../api/axios';
import Modal from '../common/Modal';
import { Radio, AlertTriangle, Send, Loader2, ShieldAlert } from 'lucide-react';

const SEVERITY_LEVELS = [
  { value: 'ADVISORY', label: 'Advisory', desc: 'Precautionary information for public' },
  { value: 'WATCH', label: 'Watch', desc: 'Conditions favorable for severe disaster' },
  { value: 'WARNING', label: 'Warning', desc: 'Severe hazard imminent or occurring' },
  { value: 'EVACUATE', label: 'Evacuate', desc: 'Immediate evacuation required' },
];

const BroadcastModal = ({ isOpen, onClose, onBroadcastCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    severity: 'WARNING',
    affectedArea: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.post('/broadcasts', formData);
      if (onBroadcastCreated) onBroadcastCreated(res.data);
      onClose();
      setFormData({ title: '', message: '', severity: 'WARNING', affectedArea: '' });
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to issue broadcast alert');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Issue Public Disaster Broadcast Alert"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
            {errorMsg}
          </div>
        )}

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Broadcast Headline / Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. FLASH FLOOD WARNING: Evacuate Riverbank Sector 4"
            className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Alert Severity Classification *
          </label>
          <div className="grid grid-cols-2 gap-2">
            {SEVERITY_LEVELS.map((s) => {
              const isSelected = formData.severity === s.value;
              return (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, severity: s.value })}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-red-600 bg-red-50 ring-2 ring-red-500 font-bold text-red-900'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-bold">{s.label}</div>
                  <div className="text-[10px] opacity-75">{s.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Affected Geographical Zone / District *
          </label>
          <input
            type="text"
            required
            value={formData.affectedArea}
            onChange={(e) => setFormData({ ...formData, affectedArea: e.target.value })}
            placeholder="e.g. Sectors 3, 4, 8 & Eastern Yamuna Floodplain"
            className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Public Safety Advisory Message *
          </label>
          <textarea
            rows={3}
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Instructions for citizens (e.g. Move immediately to high ground or designated stadium shelter. Avoid power lines...)"
            className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center gap-1.5"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Transmitting...
              </>
            ) : (
              <>
                <Radio className="w-3.5 h-3.5" />
                Broadcast Live Alert
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default BroadcastModal;
