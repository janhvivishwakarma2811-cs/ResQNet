import React, { useState } from 'react';
import { useAlerts } from '../../context/AlertContext';
import { AlertTriangle, Bell, X, ShieldAlert, ChevronRight } from 'lucide-react';

const AlertBanner = () => {
  const { activeAlerts } = useAlerts();
  const [dismissed, setDismissed] = useState(false);

  if (!activeAlerts || activeAlerts.length === 0 || dismissed) {
    return null;
  }

  const primaryAlert = activeAlerts[0];

  const getSeverityStyle = (sev) => {
    switch (sev) {
      case 'EVACUATE':
      case 'WARNING':
        return 'bg-gradient-to-r from-red-600 to-rose-700 text-white';
      case 'WATCH':
        return 'bg-gradient-to-r from-amber-500 to-orange-600 text-white';
      case 'ADVISORY':
      default:
        return 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white';
    }
  };

  return (
    <div className={`relative px-4 py-3 shadow-md ${getSeverityStyle(primaryAlert.severity)} animate-pulse-gentle`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="p-1.5 bg-white/20 rounded-lg shrink-0">
            <ShieldAlert className="w-5 h-5 animate-bounce" />
          </div>
          <div className="truncate">
            <span className="inline-block px-2 py-0.5 mr-2 text-xs font-black uppercase tracking-wider bg-white/25 rounded">
              {primaryAlert.severity} ALERT
            </span>
            <span className="font-bold mr-2">{primaryAlert.title}</span>
            <span className="text-sm opacity-90 hidden md:inline">{primaryAlert.message}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors"
            title="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertBanner;
