import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import InteractiveMap from '../components/map/InteractiveMap';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  Building2,
  Users,
  PhoneCall,
  MapPin,
  Plus,
  ShieldCheck,
  AlertCircle,
  Package,
  Loader2
} from 'lucide-react';

const SheltersPage = () => {
  const { isAdmin } = useAuth();
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);

  // New shelter modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newShelter, setNewShelter] = useState({
    name: '',
    address: '',
    latitude: 28.6139,
    longitude: 77.2090,
    capacity: 200,
    currentOccupants: 0,
    suppliesStatus: 'ADEQUATE',
    contactPerson: '',
    contactPhone: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Edit occupancy modal
  const [editShelter, setEditShelter] = useState(null);
  const [updatedOccupants, setUpdatedOccupants] = useState(0);

  const fetchShelters = async () => {
    try {
      const res = await api.get('/shelters');
      setShelters(res.data);
    } catch (err) {
      console.error('Failed to load shelters', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShelters();
  }, []);

  const handleCreateShelter = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/shelters', newShelter);
      setShowAddModal(false);
      setNewShelter({
        name: '',
        address: '',
        latitude: 28.6139,
        longitude: 77.2090,
        capacity: 200,
        currentOccupants: 0,
        suppliesStatus: 'ADEQUATE',
        contactPerson: '',
        contactPhone: '',
      });
      fetchShelters();
    } catch (err) {
      alert('Failed to register shelter');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateOccupancy = async (e) => {
    e.preventDefault();
    if (!editShelter) return;
    setSubmitting(true);
    try {
      await api.put(`/shelters/${editShelter.id}/occupancy`, {
        occupants: updatedOccupants,
      });
      setEditShelter(null);
      fetchShelters();
    } catch (err) {
      alert('Failed to update occupancy');
    } finally {
      setSubmitting(false);
    }
  };

  const totalCapacity = shelters.reduce((acc, s) => acc + (s.capacity || 0), 0);
  const totalOccupants = shelters.reduce((acc, s) => acc + (s.currentOccupants || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
            <Building2 className="w-4 h-4" />
            <span>Emergency Evacuation Safe Zones</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Relief Camps & Safe Shelters Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Live occupancy meters, emergency supplies readiness, and geospatial safe haven mapping during disasters.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Relief Camp</span>
          </button>
        )}
      </div>

      {/* Aggregate Capacity KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase">Active Shelters</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{shelters.length} Facilities</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase">Total Shelter Capacity</div>
          <div className="text-2xl font-black text-blue-600 mt-1">{totalCapacity} Beds</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase">Current Evacuees Housed</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{totalOccupants} People</div>
        </div>
      </div>

      {/* Interactive Map of Shelters */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-600" />
          Interactive Relief Shelter Spatial Map
        </h2>
        <InteractiveMap
          shelters={shelters}
          height="450px"
        />
      </div>

      {/* Shelter Directory Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">
          Verified Relief Camp Facilities ({shelters.length})
        </h2>

        {loading ? (
          <LoadingSpinner message="Loading shelter registry..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {shelters.map((s) => {
              const rate = Math.round(((s.currentOccupants || 0) / (s.capacity || 1)) * 100);
              const colorClass = rate > 90 ? 'bg-red-600' : rate > 70 ? 'bg-amber-500' : 'bg-emerald-600';

              return (
                <div
                  key={s.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                        s.suppliesStatus === 'ADEQUATE' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {s.suppliesStatus} SUPPLIES
                      </span>
                      <span className="text-xs font-bold text-slate-500">{rate}% Full</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base mb-1">{s.name}</h3>
                    <p className="text-xs text-slate-500 mb-4">{s.address}</p>

                    {/* Progress Bar */}
                    <div className="space-y-1 mb-4">
                      <div className="flex justify-between text-xs text-slate-600 font-semibold">
                        <span>Occupancy</span>
                        <span>{s.currentOccupants} / {s.capacity}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${colorClass}`}
                          style={{ width: `${Math.min(100, rate)}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1 pt-3 border-t border-slate-100 mb-4">
                      <div><strong>Coordinator:</strong> {s.contactPerson || 'EOC Duty Officer'}</div>
                      <div className="flex items-center gap-1.5">
                        <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
                        <span>{s.contactPhone || '112 Direct'}</span>
                      </div>
                    </div>
                  </div>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        setEditShelter(s);
                        setUpdatedOccupants(s.currentOccupants);
                      }}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
                    >
                      Update Occupancy Count
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Shelter Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Register New Evacuation Safe Zone"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateShelter} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Facility Name *</label>
            <input
              type="text"
              required
              value={newShelter.name}
              onChange={(e) => setNewShelter({ ...newShelter, name: e.target.value })}
              placeholder="e.g. North District Indoor Stadium"
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Street Address *</label>
            <input
              type="text"
              required
              value={newShelter.address}
              onChange={(e) => setNewShelter({ ...newShelter, address: e.target.value })}
              placeholder="e.g. Sector 12, Main Ring Road"
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                required
                value={newShelter.latitude}
                onChange={(e) => setNewShelter({ ...newShelter, latitude: parseFloat(e.target.value) })}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                required
                value={newShelter.longitude}
                onChange={(e) => setNewShelter({ ...newShelter, longitude: parseFloat(e.target.value) })}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Total Capacity (Beds) *</label>
              <input
                type="number"
                required
                min="1"
                value={newShelter.capacity}
                onChange={(e) => setNewShelter({ ...newShelter, capacity: parseInt(e.target.value) || 1 })}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Supplies Status</label>
              <select
                value={newShelter.suppliesStatus}
                onChange={(e) => setNewShelter({ ...newShelter, suppliesStatus: e.target.value })}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="ADEQUATE">ADEQUATE</option>
                <option value="LOW">LOW</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Contact Officer</label>
              <input
                type="text"
                value={newShelter.contactPerson}
                onChange={(e) => setNewShelter({ ...newShelter, contactPerson: e.target.value })}
                placeholder="Major K. Rao"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Phone Helpline</label>
              <input
                type="tel"
                value={newShelter.contactPhone}
                onChange={(e) => setNewShelter({ ...newShelter, contactPhone: e.target.value })}
                placeholder="+91-9876543210"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow"
            >
              Save Relief Shelter
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Occupancy Modal */}
      <Modal
        isOpen={!!editShelter}
        onClose={() => setEditShelter(null)}
        title={`Update Occupants: ${editShelter?.name || ''}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleUpdateOccupancy} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Current Headcount / Occupants (Max: {editShelter?.capacity})
            </label>
            <input
              type="number"
              min="0"
              max={editShelter?.capacity}
              required
              value={updatedOccupants}
              onChange={(e) => setUpdatedOccupants(parseInt(e.target.value) || 0)}
              className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setEditShelter(null)}
              className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow"
            >
              Update Occupancy
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SheltersPage;
