import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAlerts } from '../../context/AlertContext';
import {
  Radio,
  Bell,
  LogOut,
  User,
  Shield,
  Truck,
  Building2,
  BarChart3,
  MapPin,
  AlertCircle,
  Menu,
  X
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout, isCitizen, isResponder, isAdmin } = useAuth();
  const { notifications, clearAllNotifications } = useAlerts();
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleBadge = () => {
    if (isAdmin) return <span className="px-2 py-0.5 text-xs font-bold bg-purple-100 text-purple-700 rounded-full border border-purple-200">EOC Admin</span>;
    if (isResponder) return <span className="px-2 py-0.5 text-xs font-bold bg-amber-100 text-amber-800 rounded-full border border-amber-200">Responder Unit</span>;
    return <span className="px-2 py-0.5 text-xs font-bold bg-blue-100 text-blue-700 rounded-full border border-blue-200">Citizen</span>;
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
              <Radio className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-wider text-white">ResQ<span className="text-red-500">Net</span></span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-tight hidden sm:block">Connecting Emergencies. Coordinating Responses.</p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
              Home
            </Link>
            <Link to="/shelters" className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-400" />
              Relief Shelters
            </Link>
            <Link to="/analytics" className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              Analytics
            </Link>
            <Link to="/track" className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-400" />
              Track Emergency
            </Link>

            {isAuthenticated && (
              <>
                <div className="h-5 w-px bg-slate-700 mx-2" />
                {isCitizen && (
                  <Link to="/citizen" className="px-3 py-2 text-sm font-bold text-white bg-blue-600/80 hover:bg-blue-600 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm">
                    <User className="w-4 h-4" />
                    Citizen Portal
                  </Link>
                )}
                {isResponder && (
                  <Link to="/responder" className="px-3 py-2 text-sm font-bold text-white bg-amber-600/90 hover:bg-amber-600 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm">
                    <Truck className="w-4 h-4" />
                    Responder Console
                  </Link>
                )}
                {isAdmin && (
                  <Link to="/admin" className="px-3 py-2 text-sm font-bold text-white bg-purple-600/90 hover:bg-purple-600 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm">
                    <Shield className="w-4 h-4" />
                    EOC Command
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Right Section: Notifications & User Profile */}
          <div className="flex items-center gap-3">
            {/* Live Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-600 text-[10px] font-black rounded-full flex items-center justify-center text-white ring-2 ring-slate-900 animate-pulse">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Notification Drawer */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50">
                  <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-slate-800/60">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Live Incident Feed ({notifications.length})</span>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-[11px] text-slate-400 hover:text-white hover:underline"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-800">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        No new broadcasts. Live emergency updates will appear here instantly.
                      </div>
                    ) : (
                      notifications.map(item => (
                        <div key={item.id} className="p-3 hover:bg-slate-800/40 transition-colors">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                              item.severity === 'CRITICAL' ? 'bg-red-900 text-red-300' : 'bg-slate-800 text-slate-300'
                            }`}>
                              {item.severity || item.type}
                            </span>
                            <span className="text-[10px] text-slate-500">{item.timestamp}</span>
                          </div>
                          <p className="text-xs font-semibold text-slate-200">{item.title}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{item.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Auth Controls */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="hidden lg:flex flex-col items-end">
                  <span className="text-sm font-semibold text-white leading-tight">{user?.fullName || user?.username}</span>
                  <div className="mt-0.5">{getRoleBadge()}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-sm font-bold bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 pt-2 pb-4 space-y-1">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Home
          </Link>
          <Link
            to="/shelters"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Relief Shelters
          </Link>
          <Link
            to="/analytics"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Analytics & Reports
          </Link>
          <Link
            to="/track"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Track Incident
          </Link>

          {isAuthenticated && (
            <div className="pt-2 border-t border-slate-800">
              {isCitizen && (
                <Link
                  to="/citizen"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-bold bg-blue-600 text-white mb-1"
                >
                  Citizen Portal
                </Link>
              )}
              {isResponder && (
                <Link
                  to="/responder"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-bold bg-amber-600 text-white mb-1"
                >
                  Responder Console
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-bold bg-purple-600 text-white mb-1"
                >
                  EOC Command Center
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
