import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Modal from '../common/Modal';
import {
  Truck,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Send,
  Compass,
  Phone
} from 'lucide-react';

const DispatchModal = ({ isOpen, onClose, incident, onDispatched }) => {
  const [nearbyResponders, setNearbyResponders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [dispatchNote, setDispatchNote] = useState('');
  const [dispatching, setDispatching] = useState(false);

  useEffect(() => {
    if (!incident?.id || !isOpen) return;

    const fetchResponders = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/incidents/${incident.id}/nearby-responders`);
        setNearbyResponders(res.data);
        if (res.data.length > 0) {
          // Auto-select closest available responder
          const firstAvailable = res.data.find(r => r.status === 'AVAILABLE') || res.data[0];
          setSelectedTeamId(firstAvailable.id);
        }
      } catch (err) {
        console.error('Failed to load nearby responders', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResponders();
  }, [incident?.id, isOpen]);

  const handleDispatch = async () => {
    if (!selectedTeamId) return;
    setDispatching(true);
    try {
      const res = await api.post(`/incidents/${incident.id}/dispatch`, {
        responderTeamId: selectedTeamId,
        dispatchNote: dispatchNote.trim() || `Dispatched to emergency ${incident.trackingCode} at ${incident.address}`,
      });
      if (onDispatched) onDispatched(res.data);
      onClose();
    } catch (err) {
      alert('Failed to dispatch unit');
    } finally {
      setDispatching(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Smart Dispatch Unit: ${incident?.trackingCode || ''}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        {/* Incident summary brief */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs flex items-center justify-between gap-3">
          <div>
            <div className="font-bold text-slate-900">{incident?.title}</div>
            <div className="text-slate-500 mt-0.5">{incident?.address}</div>
          </div>
          <div className="text-right">
            <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] text-white ${
              incident?.severity === 'CRITICAL' ? 'bg-red-600' : 'bg-orange-500'
            }`}>
              {incident?.severity}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-500 font-semibold">
          Select rescue unit to deploy (ranked by Haversine radial distance from emergency coordinates):
        </p>

        {loading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="w-6 h-6 animate-spin text-red-600" />
          </div>
        ) : nearbyResponders.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed">
            No registered responder units available.
          </div>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {nearbyResponders.map((team) => {
              const isSelected = selectedTeamId === team.id;
              const isAvailable = team.status === 'AVAILABLE';

              return (
                <div
                  key={team.id}
                  onClick={() => setSelectedTeamId(team.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isAvailable ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        <span>{team.teamName}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                          isAvailable ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {team.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">{team.specialization} &bull; {team.vehicleType}</div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-black text-slate-900 flex items-center gap-1 justify-end">
                      <Compass className="w-3 h-3 text-blue-600" />
                      <span>{team.distanceKm} km away</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Active: {team.activeIncidentCount || 0} incidents
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Dispatcher Tactical Order / Field Brief
          </label>
          <input
            type="text"
            value={dispatchNote}
            onChange={(e) => setDispatchNote(e.target.value)}
            placeholder="e.g. Prioritize rooftop evacuation first. Carry lifejackets and medical stretchers."
            className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
            type="button"
            disabled={dispatching || !selectedTeamId}
            onClick={handleDispatch}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-1.5"
          >
            {dispatching ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Deploying Unit...
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                Transmit Tactical Dispatch
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DispatchModal;
