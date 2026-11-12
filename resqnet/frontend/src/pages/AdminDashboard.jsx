import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useAlerts } from '../context/AlertContext';
import InteractiveMap from '../components/map/InteractiveMap';
import DispatchModal from '../components/admin/DispatchModal';
import BroadcastModal from '../components/admin/BroadcastModal';
import Modal from '../components/common/Modal';
import IncidentTracker from '../components/citizen/IncidentTracker';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import {
  ShieldAlert,
  Radio,
  Truck,
  Building2,
  Users,
  AlertTriangle,
  Send,
  Plus,
  Download,
  Search,
  Filter,
  CheckCircle2,
  Eye,
  Activity,
  Layers,
  FileSpreadsheet
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { fetchActiveAlerts } = useAlerts();

  const [stats, setStats] = useState({
    totalIncidents: 0,
    activeIncidents: 0,
    resolvedIncidents: 0,
    criticalIncidents: 0,
    totalRescuedPeople: 0,
    activeResponders: 0,
    totalShelterCapacity: 0,
    currentShelterOccupants: 0,
  });

  const [incidents, setIncidents] = useState([]);
  const [responders, setResponders] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [selectedIncidentForDispatch, setSelectedIncidentForDispatch] = useState(null);
  const [selectedIncidentForTimeline, setSelectedIncidentForTimeline] = useState(null);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  const fetchEocData = async () => {
    try {
      const [statsRes, incRes, respRes, shRes, resRes] = await Promise.all([
        api.get('/analytics/summary'),
        api.get('/incidents'),
        api.get('/responders'),
        api.get('/shelters'),
        api.get('/resources'),
      ]);
      setStats(statsRes.data);
      setIncidents(incRes.data);
      setResponders(respRes.data);
      setShelters(shRes.data);
      setResources(resRes.data);
    } catch (err) {
      console.error('Failed to load EOC data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEocData();
  }, []);

  const handleQuickStatusChange = async (incidentId, newStatus, note) => {
    try {
      const res = await api.put(`/incidents/${incidentId}/status`, {
        status: newStatus,
        note: note || `Dispatcher updated status to ${newStatus}`,
      });
      setIncidents(prev => prev.map(i => i.id === incidentId ? res.data : i));
      fetchEocData();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const exportCsv = () => {
    if (incidents.length === 0) return;
    const headers = ['TrackingCode,Title,Category,Severity,Status,AffectedCount,ContactPhone,Address,CreatedAt\n'];
    const rows = incidents.map(i =>
      `"${i.trackingCode}","${i.title.replace(/"/g, '""')}","${i.category}","${i.severity}","${i.status}",${i.affectedCount || 1},"${i.contactPhone}","${i.address.replace(/"/g, '""')}","${i.createdAt}"\n`
    );
    const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ResQNet_Incident_Log_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const filteredIncidents = incidents.filter(inc => {
    if (statusFilter !== 'ALL' && inc.status !== statusFilter) return false;
    if (severityFilter !== 'ALL' && inc.severity !== severityFilter) return false;
    if (categoryFilter !== 'ALL' && inc.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCode = inc.trackingCode?.toLowerCase().includes(q);
      const matchTitle = inc.title?.toLowerCase().includes(q);
      const matchAddr = inc.address?.toLowerCase().includes(q);
      if (!matchCode && !matchTitle && !matchAddr) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top EOC Command Header */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-red-500 uppercase tracking-widest mb-2">
            <Radio className="w-4 h-4 animate-ping" />
            <span>Emergency Operations Center (EOC) Master Command</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            National Disaster Dispatch & Triage Command
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Supervise real-time incident verification, algorithm-driven responder deployment, and public evacuation alerts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowBroadcastModal(true)}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center gap-2"
          >
            <Radio className="w-4 h-4" />
            <span>Broadcast Disaster Alert</span>
          </button>
          <button
            onClick={exportCsv}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Incident Log (CSV)</span>
          </button>
        </div>
      </div>

      {/* Real-Time KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Emergencies</div>
          <div className="text-3xl font-black text-red-600 mt-1">{stats.activeIncidents}</div>
          <div className="text-[10px] text-slate-400 mt-1">Requiring immediate response</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Critical Priority</div>
          <div className="text-3xl font-black text-rose-700 mt-1">{stats.criticalIncidents}</div>
          <div className="text-[10px] text-slate-400 mt-1">Severe threat to life</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Deployed Squads</div>
          <div className="text-3xl font-black text-blue-600 mt-1">{stats.activeResponders}</div>
          <div className="text-[10px] text-slate-400 mt-1">Units actively on missions</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Rescued</div>
          <div className="text-3xl font-black text-emerald-600 mt-1">{stats.totalRescuedPeople}</div>
          <div className="text-[10px] text-slate-400 mt-1">Verified evacuated victims</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm col-span-2 md:col-span-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Shelter Occupancy</div>
          <div className="text-2xl font-black text-purple-600 mt-1">
            {stats.currentShelterOccupants} / {stats.totalShelterCapacity}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {stats.totalShelterCapacity > 0 ? Math.round((stats.currentShelterOccupants / stats.totalShelterCapacity) * 100) : 0}% capacity utilized
          </div>
        </div>
      </div>

      {/* Live Operations Geospatial Map */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-red-600" />
              Live Tactical Operations Map
            </h2>
            <p className="text-xs text-slate-500">
              Interactive Leaflet GIS map visualizing incidents, units, and relief shelter radii.
            </p>
          </div>
        </div>

        <InteractiveMap
          incidents={incidents}
          responders={responders}
          shelters={shelters}
          height="500px"
          onSelectIncident={(inc) => setSelectedIncidentForTimeline(inc)}
        />
      </div>

      {/* Incident Triage & Management Command Table */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              Incident Triage & Smart Dispatch Queue ({filteredIncidents.length})
            </h2>
            <p className="text-xs text-slate-500">
              Review citizen distress calls, verify urgency, and dispatch the closest available responder units.
            </p>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-2xl">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Search Incidents</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Code, title, location..."
                className="w-full pl-8 pr-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Status Filter</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-1.5 px-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="REPORTED">REPORTED (Unverified)</option>
              <option value="VERIFIED">VERIFIED</option>
              <option value="DISPATCHED">DISPATCHED</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Severity Filter</label>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full py-1.5 px-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Category Filter</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full py-1.5 px-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              <option value="ALL">All Categories</option>
              <option value="FLOOD">Flood</option>
              <option value="FIRE">Fire</option>
              <option value="EARTHQUAKE">Earthquake</option>
              <option value="MEDICAL">Medical</option>
              <option value="ACCIDENT">Accident</option>
              <option value="BUILDING_COLLAPSE">Collapse</option>
            </select>
          </div>
        </div>

        {/* Incidents Table */}
        {loading ? (
          <LoadingSpinner message="Loading live emergency queue..." />
        ) : filteredIncidents.length === 0 ? (
          <EmptyState
            title="No Matching Incidents"
            message="No emergencies match the selected filter criteria."
          />
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
                <tr>
                  <th className="py-3 px-4">Tracking Code</th>
                  <th className="py-3 px-4">Emergency Incident</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assigned Unit</th>
                  <th className="py-3 px-4">Victims</th>
                  <th className="py-3 px-4 text-right">Triage Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredIncidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-red-600 whitespace-nowrap">
                      {inc.trackingCode}
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-bold text-slate-900 truncate">{inc.title}</div>
                      <div className="text-[11px] text-slate-500 truncate">{inc.address}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] text-white ${
                        inc.severity === 'CRITICAL' ? 'bg-red-600' :
                        inc.severity === 'HIGH' ? 'bg-orange-600' : 'bg-amber-500'
                      }`}>
                        {inc.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        inc.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' :
                        inc.status === 'IN_PROGRESS' ? 'bg-purple-100 text-purple-800' :
                        inc.status === 'DISPATCHED' ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {inc.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                      {inc.assignedResponder ? (
                        <span className="font-semibold text-slate-900">{inc.assignedResponder.teamName}</span>
                      ) : (
                        <span className="text-amber-600 font-medium">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-semibold">
                      {inc.affectedCount || 1}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap space-x-1">
                      {/* Smart Dispatch Button */}
                      {inc.status !== 'RESOLVED' && (
                        <button
                          onClick={() => setSelectedIncidentForDispatch(inc)}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors text-[11px]"
                        >
                          Dispatch
                        </button>
                      )}

                      {/* Verify Button */}
                      {inc.status === 'REPORTED' && (
                        <button
                          onClick={() => handleQuickStatusChange(inc.id, 'VERIFIED', 'Verified by EOC Dispatcher')}
                          className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors text-[11px]"
                        >
                          Verify
                        </button>
                      )}

                      {/* Details / Timeline Button */}
                      <button
                        onClick={() => setSelectedIncidentForTimeline(inc)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors text-[11px]"
                      >
                        Timeline
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Resource Inventory Table */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            Strategic Logistics & Rescue Inventory
          </h2>
          <p className="text-xs text-slate-500">Live availability of specialized disaster rescue equipment and emergency supplies.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {resources.map(res => (
            <div key={res.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                {res.category}
              </span>
              <h4 className="font-bold text-slate-900 text-xs mt-2">{res.name}</h4>
              <div className="text-xl font-black text-slate-800 mt-1">
                {res.availableQuantity} <span className="text-xs font-normal text-slate-500">/ {res.totalQuantity} {res.unit}</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1 truncate">
                Storage: {res.storageLocation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Dispatch Modal */}
      {selectedIncidentForDispatch && (
        <DispatchModal
          isOpen={!!selectedIncidentForDispatch}
          onClose={() => setSelectedIncidentForDispatch(null)}
          incident={selectedIncidentForDispatch}
          onDispatched={(updatedInc) => {
            setIncidents(prev => prev.map(i => i.id === updatedInc.id ? updatedInc : i));
            fetchEocData();
          }}
        />
      )}

      {/* Broadcast Alert Modal */}
      <BroadcastModal
        isOpen={showBroadcastModal}
        onClose={() => setShowBroadcastModal(false)}
        onBroadcastCreated={fetchActiveAlerts}
      />

      {/* Incident Timeline Modal */}
      <Modal
        isOpen={!!selectedIncidentForTimeline}
        onClose={() => setSelectedIncidentForTimeline(null)}
        title="Incident Operations Log & Timeline"
        maxWidth="max-w-2xl"
      >
        {selectedIncidentForTimeline && (
          <IncidentTracker
            incident={selectedIncidentForTimeline}
            onClose={() => setSelectedIncidentForTimeline(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default AdminDashboard;
