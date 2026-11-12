import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StatusToggle from '../components/responder/StatusToggle';
import IncidentActionCard from '../components/responder/IncidentActionCard';
import InteractiveMap from '../components/map/InteractiveMap';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import {
  Truck,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Radio,
  MapPin,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

const ResponderDashboard = () => {
  const { user } = useAuth();
  const [responderTeam, setResponderTeam] = useState(null);
  const [assignedIncidents, setAssignedIncidents] = useState([]);
  const [allIncidents, setAllIncidents] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchResponderData = async () => {
    try {
      // 1. Fetch responder team profile for current user
      const teamRes = await api.get(`/responders/user/${user.id}`);
      setResponderTeam(teamRes.data);

      // 2. Fetch assigned incidents for this team
      const [incRes, allIncRes, shRes] = await Promise.all([
        api.get(`/incidents/responder/${teamRes.data.id}`),
        api.get('/incidents'),
        api.get('/shelters'),
      ]);
      setAssignedIncidents(incRes.data);
      setAllIncidents(allIncRes.data);
      setShelters(shRes.data);
    } catch (err) {
      console.error('Failed to load responder dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchResponderData();
    }
  }, [user?.id]);

  const activeAssigned = assignedIncidents.filter(i => i.status !== 'RESOLVED' && i.status !== 'CANCELLED');
  const resolvedCount = assignedIncidents.filter(i => i.status === 'RESOLVED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
            <Truck className="w-4 h-4" />
            <span>Field Rescue Unit Operations Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {responderTeam?.teamName || 'Emergency Response Squad'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Specialization: <strong>{responderTeam?.specialization}</strong> &bull; Vehicle: <strong>{responderTeam?.vehicleType}</strong>
          </p>
        </div>

        <button
          onClick={fetchResponderData}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Operations Queue</span>
        </button>
      </div>

      {/* Unit Status Toggle & Operational Readiness KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8">
          {responderTeam && (
            <StatusToggle
              responderId={responderTeam.id}
              currentStatus={responderTeam.status}
              onStatusChange={(newStatus) => {
                setResponderTeam(prev => ({ ...prev, status: newStatus }));
              }}
            />
          )}
        </div>

        <div className="lg:col-span-4 grid grid-cols-2 gap-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-center">
            <div className="text-2xl font-black text-red-600">{activeAssigned.length}</div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">Active Dispatches</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-center">
            <div className="text-2xl font-black text-emerald-600">{resolvedCount}</div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">Missions Completed</div>
          </div>
        </div>
      </div>

      {/* Active Assigned Incidents Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Active Tactical Dispatch Queue ({activeAssigned.length})
            </h2>
            <p className="text-xs text-slate-500">
              Assigned emergencies requiring immediate mobilization, navigation, and on-scene stabilization.
            </p>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner message="Retrieving dispatched emergency calls..." />
        ) : activeAssigned.length === 0 ? (
          <EmptyState
            title="All Assigned Incidents Clear"
            message="Your unit currently has no pending active emergency calls assigned. Maintain readiness on standby."
            icon={CheckCircle2}
          />
        ) : (
          <div className="space-y-4">
            {activeAssigned.map((inc) => (
              <IncidentActionCard
                key={inc.id}
                incident={inc}
                responderTeam={responderTeam}
                onUpdateStatus={(updatedInc) => {
                  setAssignedIncidents(prev => prev.map(i => i.id === updatedInc.id ? updatedInc : i));
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Operations Tactical Map */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Regional Tactical Map
          </h2>
          <p className="text-xs text-slate-500">
            Real-time coordinates of active emergencies, relief shelters, and other units in your district.
          </p>
        </div>

        <InteractiveMap
          incidents={allIncidents}
          responders={responderTeam ? [responderTeam] : []}
          shelters={shelters}
          height="450px"
        />
      </div>
    </div>
  );
};

export default ResponderDashboard;
