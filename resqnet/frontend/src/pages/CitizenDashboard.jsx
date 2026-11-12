import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useAlerts } from '../context/AlertContext';
import SosButton from '../components/citizen/SosButton';
import EmergencyReportModal from '../components/citizen/EmergencyReportModal';
import IncidentTracker from '../components/citizen/IncidentTracker';
import InteractiveMap from '../components/map/InteractiveMap';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import {
  AlertTriangle,
  Radio,
  MapPin,
  Clock,
  PlusCircle,
  ShieldCheck,
  Building2,
  Users,
  Eye,
  ChevronRight
} from 'lucide-react';

const CitizenDashboard = () => {
  const { user } = useAuth();
  const { activeAlerts } = useAlerts();

  const [myIncidents, setMyIncidents] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);

  const fetchCitizenData = async () => {
    try {
      const [incRes, shRes] = await Promise.all([
        api.get('/incidents/my'),
        api.get('/shelters'),
      ]);
      setMyIncidents(incRes.data);
      setShelters(shRes.data);
    } catch (err) {
      console.error('Failed to load citizen data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCitizenData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider mb-2">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Citizen Emergency Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Welcome, {user?.fullName || user?.username}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Monitor your reported emergencies in real-time, trigger instant SOS alerts, and locate nearest safe relief shelters.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowReportModal(true)}
            className="px-5 py-3 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>REPORT EMERGENCY</span>
          </button>
        </div>
      </div>

      {/* SOS Panic Bar & Active Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Rapid SOS Trigger Widget */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
          <span className="text-xs font-black uppercase tracking-wider text-red-600 mb-1">
            Emergency SOS Trigger
          </span>
          <p className="text-xs text-slate-500 mb-6 max-w-xs">
            Immediately transmits your GPS coordinates to all on-duty rescue teams
          </p>
          <SosButton onSosTriggered={fetchCitizenData} />
        </div>

        {/* Active Public Disaster Advisories */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-red-600" />
              <h3 className="text-sm font-bold text-slate-900">Regional Emergency Advisories</h3>
            </div>
            <span className="text-xs font-semibold text-slate-400">{activeAlerts.length} Active</span>
          </div>

          {activeAlerts.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">
              No active red alert advisories in your area currently.
            </p>
          ) : (
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {activeAlerts.map(a => (
                <div key={a.id} className="p-3 rounded-xl bg-red-50/70 border border-red-200 text-xs">
                  <div className="flex items-center justify-between font-bold text-red-900 mb-1">
                    <span>{a.title}</span>
                    <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-red-200 text-red-800">{a.severity}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] mb-1">{a.message}</p>
                  <div className="text-[10px] text-slate-500 font-semibold">Zone: {a.affectedArea}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* My Reported Incidents Section */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              My Emergency Reports ({myIncidents.length})
            </h2>
            <p className="text-xs text-slate-500">Track active dispatch and live status updates for your logged incidents.</p>
          </div>
          <button
            onClick={() => setShowReportModal(true)}
            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <span>+ Report Another</span>
          </button>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading your emergency reports..." />
        ) : myIncidents.length === 0 ? (
          <EmptyState
            title="No Incidents Reported"
            message="You haven't submitted any emergency reports yet. If you need help, use the Report button or the SOS trigger."
            actionText="Report Emergency Now"
            onAction={() => setShowReportModal(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myIncidents.map(inc => (
              <div
                key={inc.id}
                className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all bg-slate-50/40 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                      {inc.trackingCode}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      inc.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' :
                      inc.status === 'IN_PROGRESS' ? 'bg-purple-100 text-purple-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {inc.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mb-1">{inc.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-3">{inc.description}</p>

                  <div className="text-[11px] text-slate-500 space-y-1 mb-4">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{inc.address}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Reported {new Date(inc.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedIncident(inc)}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Live Tracker & Timeline</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Relief Shelters Map Section */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            Nearby Relief Camps & Evacuation Shelters
          </h2>
          <p className="text-xs text-slate-500">Live capacity and supplies health for verified emergency safe zones.</p>
        </div>

        <InteractiveMap
          incidents={myIncidents}
          shelters={shelters}
          height="400px"
        />
      </div>

      {/* Emergency Report Modal */}
      <EmergencyReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onIncidentCreated={fetchCitizenData}
      />

      {/* Live Incident Tracking Modal */}
      <Modal
        isOpen={!!selectedIncident}
        onClose={() => setSelectedIncident(null)}
        title="Live Incident Operations Timeline"
        maxWidth="max-w-2xl"
      >
        {selectedIncident && (
          <IncidentTracker
            incident={selectedIncident}
            onClose={() => setSelectedIncident(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default CitizenDashboard;
