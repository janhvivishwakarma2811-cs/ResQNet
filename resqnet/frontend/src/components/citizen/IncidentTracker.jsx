import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { wsService } from '../../api/websocket';
import {
  CheckCircle2,
  Clock,
  Truck,
  Shield,
  AlertCircle,
  Phone,
  MapPin,
  Calendar,
  Users
} from 'lucide-react';

const STATUS_STEPS = [
  { key: 'REPORTED', label: 'Reported', desc: 'Distress call received' },
  { key: 'VERIFIED', label: 'Verified', desc: 'Triage & sensor verification' },
  { key: 'DISPATCHED', label: 'Dispatched', desc: 'Rescue team mobilized' },
  { key: 'IN_PROGRESS', label: 'On Scene', desc: 'Active rescue & treatment' },
  { key: 'RESOLVED', label: 'Resolved', desc: 'Situation secured & victims safe' },
];

const IncidentTracker = ({ incident, onClose }) => {
  const [updates, setUpdates] = useState([]);
  const [currentIncident, setCurrentIncident] = useState(incident);
  const [loadingUpdates, setLoadingUpdates] = useState(true);

  useEffect(() => {
    if (!incident?.id) return;

    // Fetch initial timeline updates
    const fetchUpdates = async () => {
      try {
        const res = await api.get(`/incidents/${incident.id}/updates`);
        setUpdates(res.data);
      } catch (err) {
        console.error('Failed to load incident timeline', err);
      } finally {
        setLoadingUpdates(false);
      }
    };
    fetchUpdates();

    // Subscribe to live incident updates over WebSocket
    const unsub = wsService.subscribe(`/topic/incident/${incident.id}`, (newUpdate) => {
      setUpdates(prev => [...prev, newUpdate]);
      setCurrentIncident(prev => ({
        ...prev,
        status: newUpdate.newStatus,
      }));
    });

    return () => {
      unsub();
    };
  }, [incident?.id]);

  const getStepIndex = (status) => {
    const idx = STATUS_STEPS.findIndex(s => s.key === status);
    return idx === -1 ? 0 : idx;
  };

  const currentIdx = getStepIndex(currentIncident?.status);

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-black text-red-600 bg-red-100/80 px-2.5 py-1 rounded-lg">
              {currentIncident.trackingCode}
            </span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
              currentIncident.severity === 'CRITICAL' ? 'bg-red-600 text-white' :
              currentIncident.severity === 'HIGH' ? 'bg-orange-600 text-white' : 'bg-amber-500 text-white'
            }`}>
              {currentIncident.severity}
            </span>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-200 text-slate-800 rounded-lg">
            Category: {currentIncident.category}
          </span>
        </div>

        <h3 className="text-base font-bold text-slate-900 mb-1">{currentIncident.title}</h3>
        <p className="text-xs text-slate-600 mb-3">{currentIncident.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-3 border-t border-slate-200 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span className="truncate">{currentIncident.address}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span>{currentIncident.affectedCount || 1} people affected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Assigned: {currentIncident.assignedResponder?.teamName || 'Awaiting Unit'}</span>
          </div>
        </div>
      </div>

      {/* Progress Timeline Stepper */}
      <div className="px-2">
        <div className="relative">
          {/* Connector line */}
          <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-200 -z-0" />
          <div
            className="absolute top-4 left-4 h-0.5 bg-emerald-600 transition-all duration-500 -z-0"
            style={{ width: `${(currentIdx / (STATUS_STEPS.length - 1)) * 100}%` }}
          />

          <div className="flex items-center justify-between relative z-10">
            {STATUS_STEPS.map((step, idx) => {
              const isCompleted = idx <= currentIdx;
              const isCurrent = idx === currentIdx;

              return (
                <div key={step.key} className="flex flex-col items-center text-center max-w-[80px]">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors shadow-sm ${
                      isCompleted
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                        : 'bg-white border-2 border-slate-300 text-slate-400'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span className={`text-[11px] font-bold mt-2 leading-tight ${isCurrent ? 'text-slate-900' : 'text-slate-500'}`}>
                    {step.label}
                  </span>
                  <span className="text-[9px] text-slate-400 hidden sm:block mt-0.5">
                    {step.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Real Timeline Activity Log */}
      <div>
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          Real-Time Operations Log
        </h4>

        <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-56 overflow-y-auto bg-white">
          {updates.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400">
              No updates logged yet. Real-time entries will appear here.
            </div>
          ) : (
            updates.map((u) => (
              <div key={u.id} className="p-3 text-xs flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-slate-800">
                      {u.newStatus}
                    </span>
                    {u.updatedBy && (
                      <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        by {u.updatedBy.fullName || u.updatedBy.username}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600">{u.note}</p>
                </div>
                <span className="text-[10px] text-slate-400 whitespace-nowrap">
                  {new Date(u.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default IncidentTracker;
