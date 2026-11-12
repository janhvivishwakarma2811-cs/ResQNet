import React, { useState } from 'react';
import api from '../../api/axios';
import { Truck, CheckCircle2, AlertCircle, Coffee, PowerOff } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'AVAILABLE', label: 'Available', color: 'bg-emerald-600 text-white', icon: CheckCircle2 },
  { value: 'ON_SCENE', label: 'On Scene', color: 'bg-purple-600 text-white', icon: Truck },
  { value: 'BUSY', label: 'Busy / Ops', color: 'bg-amber-600 text-white', icon: AlertCircle },
  { value: 'OFF_DUTY', label: 'Off Duty', color: 'bg-slate-700 text-white', icon: PowerOff },
];

const StatusToggle = ({ responderId, currentStatus, onStatusChange }) => {
  const [updating, setUpdating] = useState(false);

  const handleSelect = async (status) => {
    if (status === currentStatus) return;
    setUpdating(true);
    try {
      await api.put(`/responders/${responderId}/status`, { status });
      if (onStatusChange) onStatusChange(status);
    } catch (err) {
      alert('Failed to update responder status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white shadow-md">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Unit Readiness Status
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-slate-800 text-slate-300">
          {currentStatus}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {STATUS_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isActive = currentStatus === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              disabled={updating}
              onClick={() => handleSelect(opt.value)}
              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                isActive
                  ? `${opt.color} shadow-lg ring-2 ring-white/20`
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StatusToggle;
