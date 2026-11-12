import React, { useState } from 'react';
import api from '../../api/axios';
import { AlertOctagon, Loader2, CheckCircle2, PhoneCall } from 'lucide-react';
import Modal from '../common/Modal';

const SosButton = ({ onSosTriggered }) => {
  const [triggering, setTriggering] = useState(false);
  const [sosResult, setSosResult] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSosPress = () => {
    setShowConfirm(true);
  };

  const executeSos = async () => {
    setTriggering(true);

    const sendPayload = async (lat, lng, address) => {
      try {
        const res = await api.post('/incidents/sos', {
          latitude: lat,
          longitude: lng,
          address: address,
        });
        setSosResult(res.data);
        if (onSosTriggered) onSosTriggered(res.data);
      } catch (err) {
        alert('Failed to send SOS signal. Please call 112 immediately!');
      } finally {
        setTriggering(false);
        setShowConfirm(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          sendPayload(pos.coords.latitude, pos.coords.longitude, 'Live Emergency GPS Location');
        },
        () => {
          // Default fallback coordinates if GPS denied
          sendPayload(28.6139, 77.2090, 'Delhi EOC Grid (GPS Permission Denied)');
        },
        { timeout: 7000 }
      );
    } else {
      sendPayload(28.6139, 77.2090, 'Emergency Location Unknown');
    }
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <button
          onClick={handleSosPress}
          className="relative group p-6 sm:p-8 rounded-full bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-2xl shadow-red-600/40 hover:scale-105 active:scale-95 transition-all duration-300 border-4 border-red-500/50"
        >
          <div className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-25 group-hover:opacity-40" />
          <div className="relative flex flex-col items-center justify-center w-24 h-24 sm:w-28 sm:h-28">
            <AlertOctagon className="w-10 h-10 sm:w-12 sm:h-12 mb-1" />
            <span className="text-xl sm:text-2xl font-black tracking-widest">SOS</span>
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-90">One-Tap Help</span>
          </div>
        </button>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Confirm Emergency SOS Broadcast"
        maxWidth="max-w-md"
      >
        <div className="text-center p-2">
          <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
            <AlertOctagon className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Trigger Critical Emergency SOS?</h3>
          <p className="text-sm text-slate-600 mb-6">
            This will immediately transmit your GPS coordinates to the Disaster Operations Center and dispatch emergency rescue teams with top priority.
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => setShowConfirm(false)}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={executeSos}
              disabled={triggering}
              className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
            >
              {triggering ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Broadcasting...
                </>
              ) : (
                'CONFIRM SOS'
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Result Modal */}
      <Modal
        isOpen={!!sosResult}
        onClose={() => setSosResult(null)}
        title="SOS Alert Dispatched Successfully"
        maxWidth="max-w-md"
      >
        <div className="text-center p-2">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Rescue Units Alerted</h3>
          <p className="text-xs text-slate-500 mb-4">
            Your distress signal has been routed to the active Emergency Response Center.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs space-y-2 mb-6">
            <div><strong>Tracking Code:</strong> <span className="font-mono font-bold text-red-600">{sosResult?.trackingCode}</span></div>
            <div><strong>Severity:</strong> <span className="text-red-700 font-bold">{sosResult?.severity}</span></div>
            <div><strong>Recorded Location:</strong> {sosResult?.address}</div>
            <div><strong>Status:</strong> {sosResult?.status}</div>
          </div>

          <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-xs text-red-800 flex items-center gap-2 mb-6">
            <PhoneCall className="w-4 h-4 shrink-0 text-red-600" />
            <span>If you are in immediate life danger, also call <strong>112</strong> immediately.</span>
          </div>

          <button
            onClick={() => setSosResult(null)}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </Modal>
    </>
  );
};

export default SosButton;
