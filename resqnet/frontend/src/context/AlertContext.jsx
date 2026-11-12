import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { wsService } from '../api/websocket';

const AlertContext = createContext(null);

export const AlertProvider = ({ children }) => {
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [liveIncidents, setLiveIncidents] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const fetchActiveAlerts = useCallback(async () => {
    try {
      const res = await api.get('/broadcasts/active');
      setActiveAlerts(res.data);
    } catch (err) {
      console.error('Failed to load active broadcasts', err);
    }
  }, []);

  useEffect(() => {
    fetchActiveAlerts();

    // Connect WebSocket
    wsService.connect();

    // Listen for incoming alerts
    const unsubAlerts = wsService.subscribe('/topic/alerts', (newAlert) => {
      setActiveAlerts(prev => [newAlert, ...prev]);
      addNotification({
        id: Date.now(),
        type: 'BROADCAST',
        title: `EMERGENCY ALERT: ${newAlert.title}`,
        message: newAlert.message,
        severity: newAlert.severity,
        timestamp: new Date().toLocaleTimeString(),
      });
    });

    // Listen for new incidents or updates
    const unsubIncidents = wsService.subscribe('/topic/incidents', (incident) => {
      setLiveIncidents(prev => {
        const filtered = prev.filter(i => i.id !== incident.id);
        return [incident, ...filtered];
      });
      addNotification({
        id: Date.now(),
        type: 'INCIDENT',
        title: `Incident ${incident.trackingCode}: ${incident.status}`,
        message: `${incident.title} (${incident.severity}) - ${incident.address}`,
        severity: incident.severity,
        timestamp: new Date().toLocaleTimeString(),
      });
    });

    return () => {
      unsubAlerts();
      unsubIncidents();
    };
  }, [fetchActiveAlerts]);

  const addNotification = (item) => {
    setNotifications(prev => [item, ...prev.slice(0, 19)]);
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <AlertContext.Provider
      value={{
        activeAlerts,
        liveIncidents,
        notifications,
        fetchActiveAlerts,
        dismissNotification,
        clearAllNotifications,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export const useAlerts = () => useContext(AlertContext);
