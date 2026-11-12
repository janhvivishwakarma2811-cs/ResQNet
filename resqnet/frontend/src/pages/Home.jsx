import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useAlerts } from '../context/AlertContext';
import InteractiveMap from '../components/map/InteractiveMap';
import SosButton from '../components/citizen/SosButton';
import EmergencyReportModal from '../components/citizen/EmergencyReportModal';
import {
  AlertTriangle,
  Radio,
  MapPin,
  Building2,
  Users,
  ShieldCheck,
  Search,
  ArrowRight,
  Flame,
  Droplets,
  HeartPulse,
  Activity,
  Layers,
  Cpu
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated, isCitizen } = useAuth();
  const { activeAlerts } = useAlerts();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalIncidents: 0,
    activeIncidents: 0,
    resolvedIncidents: 0,
    totalRescuedPeople: 0,
    activeResponders: 0,
    totalShelterCapacity: 0,
    currentShelterOccupants: 0,
  });

  const [incidents, setIncidents] = useState([]);
  const [responders, setResponders] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [trackingCodeInput, setTrackingCodeInput] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, incRes, respRes, shRes] = await Promise.all([
          api.get('/analytics/summary'),
          api.get('/incidents'),
          api.get('/responders'),
          api.get('/shelters'),
        ]);
        setStats(statsRes.data);
        setIncidents(incRes.data);
        setResponders(respRes.data);
        setShelters(shRes.data);
      } catch (err) {
        console.error('Failed to load home data', err);
      }
    };
    fetchData();
  }, []);

  const handleTrackSearch = (e) => {
    e.preventDefault();
    if (trackingCodeInput.trim()) {
      navigate(`/track?code=${trackingCodeInput.trim()}`);
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Headlines & Quick Actions */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-950/80 border border-red-800/80 text-red-400 text-xs font-bold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span>REAL-TIME DISASTER RESPONSE & COORDINATION SYSTEM</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white">
                Connecting Emergencies.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-400">
                  Coordinating Responses.
                </span><br />
                Saving Time.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
                ResQNet bridges affected citizens, field rescue teams, and emergency operations dispatchers during floods, fires, structural hazards, and crises with sub-second WebSocket updates and interactive spatial intelligence.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => {
                    if (!isAuthenticated) navigate('/login');
                    else setShowReportModal(true);
                  }}
                  className="px-6 py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-sm rounded-xl shadow-xl shadow-red-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>REPORT AN EMERGENCY</span>
                </button>

                <Link
                  to="/shelters"
                  className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl border border-slate-700 transition-colors flex items-center gap-2"
                >
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <span>Find Relief Shelters</span>
                </Link>
              </div>

              {/* Public Incident Tracking Code Lookup Box */}
              <form onSubmit={handleTrackSearch} className="pt-2 max-w-lg">
                <div className="flex items-center bg-slate-800/90 border border-slate-700 rounded-xl p-1.5 focus-within:ring-2 focus-within:ring-red-500 transition-all">
                  <Search className="w-4 h-4 text-slate-400 ml-2.5 shrink-0" />
                  <input
                    type="text"
                    value={trackingCodeInput}
                    onChange={(e) => setTrackingCodeInput(e.target.value)}
                    placeholder="Enter Incident Tracking Code (e.g. RSQ-8492-1011)"
                    className="w-full bg-transparent border-none text-xs text-white placeholder-slate-400 px-3 py-1.5 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg transition-colors shrink-0"
                  >
                    Track
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Prominent SOS Button & Quick Stats */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-800/40 rounded-3xl border border-slate-700/50 backdrop-blur-md">
              <div className="text-center mb-4">
                <span className="text-xs font-black uppercase tracking-widest text-red-400">
                  IMMEDIATE THREAT PANIC BUTTON
                </span>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tap to transmit current GPS coordinates to EOC dispatchers
                </p>
              </div>

              <SosButton
                onSosTriggered={(newInc) => {
                  setIncidents(prev => [newInc, ...prev]);
                  setStats(prev => ({ ...prev, totalIncidents: prev.totalIncidents + 1, activeIncidents: prev.activeIncidents + 1 }));
                }}
              />

              <div className="mt-6 w-full pt-4 border-t border-slate-700/60 grid grid-cols-2 gap-3 text-center text-xs">
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700">
                  <div className="text-lg font-black text-red-400">{stats.activeIncidents}</div>
                  <div className="text-[10px] text-slate-400 font-medium">Active Emergencies</div>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700">
                  <div className="text-lg font-black text-emerald-400">{stats.totalRescuedPeople}</div>
                  <div className="text-[10px] text-slate-400 font-medium">Lives Rescued</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real-time KPI Stats Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-lg flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{stats.activeIncidents}</div>
              <div className="text-xs font-semibold text-slate-500">Active Incidents</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-lg flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{stats.activeResponders}</div>
              <div className="text-xs font-semibold text-slate-500">Rescue Units On Duty</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-lg flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{stats.totalRescuedPeople}</div>
              <div className="text-xs font-semibold text-slate-500">Citizens Evacuated</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-lg flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">
                {stats.currentShelterOccupants} / {stats.totalShelterCapacity}
              </div>
              <div className="text-xs font-semibold text-slate-500">Relief Shelter Occupancy</div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Geospatial Operations Map Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-600" />
              Live Interactive Emergency Operations Map
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Real-time positions of reported emergencies, active rescue squads, and safe relief shelters.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 font-semibold text-slate-700">
              <span className="w-3 h-3 rounded-full bg-red-600" /> Critical Danger
            </span>
            <span className="flex items-center gap-1 font-semibold text-slate-700">
              <span className="w-3 h-3 rounded-full bg-blue-600" /> Rescue Unit
            </span>
            <span className="flex items-center gap-1 font-semibold text-slate-700">
              <span className="w-3 h-3 rounded-full bg-emerald-600" /> Safe Zone
            </span>
          </div>
        </div>

        <InteractiveMap
          incidents={incidents}
          responders={responders}
          shelters={shelters}
          height="550px"
          onSelectIncident={(inc) => navigate(`/track?code=${inc.trackingCode}`)}
        />
      </section>

      {/* Active Public Safety Broadcasts Section */}
      {activeAlerts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Radio className="w-5 h-5 text-red-600 animate-pulse" />
              Active Public Disaster Advisories & Warnings
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeAlerts.map(alert => (
              <div
                key={alert.id}
                className="bg-white border-l-4 border-red-600 rounded-xl p-5 shadow-sm border border-slate-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black px-2 py-0.5 rounded bg-red-100 text-red-800 uppercase">
                    {alert.severity}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(alert.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">{alert.title}</h4>
                <p className="text-xs text-slate-600 mb-2">{alert.message}</p>
                <div className="text-[11px] font-semibold text-slate-500">
                  Target Zone: <span className="text-slate-800">{alert.affectedArea}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Emergency Report Modal */}
      <EmergencyReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onIncidentCreated={(newInc) => {
          setIncidents(prev => [newInc, ...prev]);
          setStats(prev => ({ ...prev, totalIncidents: prev.totalIncidents + 1, activeIncidents: prev.activeIncidents + 1 }));
        }}
      />
    </div>
  );
};

export default Home;
