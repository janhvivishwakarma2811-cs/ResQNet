import React, { useState } from 'react';
import api from '../../api/axios';
import RouteMap from '../map/RouteMap';
import Modal from '../common/Modal';
import {
  Navigation,
  PhoneCall,
  Users,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  Loader2,
  ShieldCheck,
  Radio
} from 'lucide-react';

const IncidentActionCard = ({
  incident,
  responderTeam,
  onUpdateStatus,
}) => {
  const [showRoute, setShowRoute] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [backupType, setBackupType] = useState('AMBULANCE');

  const handleStatusTransition = async (newStatus, defaultNote) => {
    setSubmitting(true);
    try {
      const note = noteText.trim() ? noteText.trim() : defaultNote;
      const res = await api.put(`/incidents/${incident.id}/status`, {
        status: newStatus,
        note: note,
      });
      setNoteText('');
      if (onUpdateStatus) onUpdateStatus(res.data);
    } catch (err) {
      alert('Failed to update incident status');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendBackupRequest = async () => {
    setSubmitting(true);
    try {
      await api.put(`/incidents/${incident.id}/status`, {
        status: incident.status,
        note: `BACKUP REQUEST: Responder unit requested urgent backup support: [${backupType}]`,
      });
      alert(`Backup request for ${backupType} sent to EOC Dispatch!`);
      setShowBackupModal(false);
    } catch (err) {
      alert('Failed to send backup request');
    } finally {
      setSubmitting(false);
    }
  };

  const isDispatched = incident.status === 'DISPATCHED';
  const isInProgress = incident.status === 'IN_PROGRESS';
  const isResolved = incident.status === 'RESOLVED';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-black text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
            {incident.trackingCode}
          </span>
          <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded ${
            incident.severity === 'CRITICAL' ? 'bg-red-600 text-white' :
            incident.severity === 'HIGH' ? 'bg-orange-600 text-white' : 'bg-amber-500 text-white'
          }`}>
            {incident.severity}
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
            {incident.category}
          </span>
        </div>

        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
          isResolved ? 'bg-emerald-100 text-emerald-800' :
          isInProgress ? 'bg-purple-100 text-purple-800 animate-pulse' :
          'bg-blue-100 text-blue-800'
        }`}>
          {incident.status}
        </span>
      </div>

      <h3 className="text-base font-bold text-slate-900 mb-1">{incident.title}</h3>
      <p className="text-xs text-slate-600 mb-4">{incident.description}</p>

      {/* Incident Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl mb-4">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
          <span className="truncate">{incident.address}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <PhoneCall className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span>Contact: <strong className="text-slate-800">{incident.contactPhone}</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>Trapped / Injured: <strong>{incident.affectedCount || 1} people</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Logged: {new Date(incident.createdAt).toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Field Notes Input */}
      {!isResolved && (
        <div className="mb-4">
          <input
            type="text"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Field notes (e.g. Navigating floodwaters, 3 victims stabilized...)"
            className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
        {/* Navigation Route Map Button */}
        <button
          type="button"
          onClick={() => setShowRoute(true)}
          className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 border border-blue-200"
        >
          <Navigation className="w-3.5 h-3.5 text-blue-600" />
          <span>Route & GPS Navigation</span>
        </button>

        {!isResolved && (
          <button
            type="button"
            onClick={() => setShowBackupModal(true)}
            className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 border border-amber-200"
          >
            <Radio className="w-3.5 h-3.5 text-amber-600" />
            <span>Request Backup</span>
          </button>
        )}

        <div className="flex-1" />

        {/* Workflow Progression Actions */}
        {isDispatched && (
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleStatusTransition('IN_PROGRESS', 'Rescue unit arrived on scene and initiated operations.')}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Truck className="w-3.5 h-3.5" />}
            <span>Mark Arrived On Scene</span>
          </button>
        )}

        {isInProgress && (
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleStatusTransition('RESOLVED', 'All victims evacuated, secured, and emergency resolved.')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
            <span>Complete & Mark Resolved</span>
          </button>
        )}

        {isResolved && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            <ShieldCheck className="w-4 h-4" />
            <span>Mission Resolved</span>
          </div>
        )}
      </div>

      {/* Route Map Modal */}
      <Modal
        isOpen={showRoute}
        onClose={() => setShowRoute(false)}
        title={`Live Tactical Route: ${responderTeam?.teamName || 'Your Unit'} → Incident`}
        maxWidth="max-w-4xl"
      >
        <div className="space-y-3">
          <RouteMap
            responderLat={responderTeam?.currentLatitude || 28.6139}
            responderLng={responderTeam?.currentLongitude || 77.2090}
            incidentLat={incident.latitude}
            incidentLng={incident.longitude}
            responderName={responderTeam?.teamName}
            incidentTitle={incident.title}
            height="450px"
          />
          <p className="text-xs text-slate-500 text-center">
            Navigation utilizes OpenStreetMap and OSRM turn-by-turn routing with automatic Haversine fallback.
          </p>
        </div>
      </Modal>

      {/* Backup Request Modal */}
      <Modal
        isOpen={showBackupModal}
        onClose={() => setShowBackupModal(false)}
        title="Request Additional Emergency Backup"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Select the reinforcement resources needed for <strong>{incident.trackingCode}</strong>:
          </p>
          <div className="space-y-2">
            {[
              { id: 'AMBULANCE', label: 'Advanced Trauma Ambulance (EMT)', desc: 'For severe medical injuries' },
              { id: 'FIRE_TENDER', label: 'Heavy Foam Fire Tender', desc: 'For chemical or structural fires' },
              { id: 'BOAT', label: 'Inflatable Rescue Boat & NDRF Divers', desc: 'For rising floodwaters' },
              { id: 'NDRF_COLLAPSE', label: 'NDRF Urban Search & Rescue Heavy Unit', desc: 'Concrete cutters and crane' },
            ].map(b => (
              <label
                key={b.id}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  backupType === b.id ? 'border-amber-500 bg-amber-50/50' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="backup"
                  value={b.id}
                  checked={backupType === b.id}
                  onChange={(e) => setBackupType(e.target.value)}
                  className="mt-0.5 text-amber-600 focus:ring-amber-500"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">{b.label}</div>
                  <div className="text-[10px] text-slate-500">{b.desc}</div>
                </div>
              </label>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowBackupModal(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={handleSendBackupRequest}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5"
            >
              {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>Transmit Backup Dispatch Request</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default IncidentActionCard;
