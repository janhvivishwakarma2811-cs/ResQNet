import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import IncidentTracker from '../components/citizen/IncidentTracker';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { Search, MapPin, AlertCircle, ShieldAlert } from 'lucide-react';

const PublicTracker = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCode = searchParams.get('code') || '';

  const [trackingCode, setTrackingCode] = useState(initialCode);
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchIncident = async (code) => {
    if (!code || !code.trim()) return;
    setLoading(true);
    setErrorMsg(null);
    setSearched(true);
    try {
      const res = await api.get(`/incidents/track/${code.trim()}`);
      setIncident(res.data);
    } catch (err) {
      setIncident(null);
      setErrorMsg(err.response?.status === 404 ? 'No emergency incident found with this tracking code.' : 'Failed to look up incident.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialCode) {
      fetchIncident(initialCode);
    }
  }, [initialCode]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (trackingCode.trim()) {
      setSearchParams({ code: trackingCode.trim() });
      fetchIncident(trackingCode);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
          <MapPin className="w-8 h-8 text-red-600" />
          Track Emergency Status
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Enter your unique tracking code to view live responder dispatch, on-scene progress, and tactical updates.
        </p>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto">
        <div className="flex items-center bg-white border border-slate-300 rounded-2xl p-2 shadow-md focus-within:ring-2 focus-within:ring-red-500 transition-all">
          <Search className="w-5 h-5 text-slate-400 ml-2.5 shrink-0" />
          <input
            type="text"
            required
            value={trackingCode}
            onChange={(e) => setTrackingCode(e.target.value)}
            placeholder="e.g. RSQ-8492-1011"
            className="w-full bg-transparent border-none text-sm text-slate-800 placeholder-slate-400 px-3 py-1.5 focus:outline-none font-mono uppercase font-bold"
          />
          <button
            type="submit"
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors shrink-0"
          >
            Locate Incident
          </button>
        </div>
      </form>

      {/* Results View */}
      {loading ? (
        <LoadingSpinner message="Searching real-time operations database..." />
      ) : incident ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md">
          <IncidentTracker incident={incident} />
        </div>
      ) : searched ? (
        <EmptyState
          title="Incident Not Found"
          message={errorMsg || 'Please double check your tracking code format (e.g. RSQ-XXXX-XXXX).'}
          icon={ShieldAlert}
        />
      ) : null}
    </div>
  );
};

export default PublicTracker;
