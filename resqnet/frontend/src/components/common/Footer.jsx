import React from 'react';
import { PhoneCall, ShieldCheck, HeartPulse, Flame, LifeBuoy } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-sm mt-auto">
      {/* Emergency Hotline Ticker */}
      <div className="bg-red-950/40 border-b border-red-900/50 py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider">
            <PhoneCall className="w-4 h-4 animate-bounce" />
            National Emergency Hotlines:
          </div>
          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-300">
            <span className="flex items-center gap-1.5"><strong className="text-white">112</strong> All Emergency</span>
            <span className="flex items-center gap-1.5"><Flame className="w-3.5 h-3.5 text-orange-400" /><strong className="text-white">101</strong> Fire Control</span>
            <span className="flex items-center gap-1.5"><HeartPulse className="w-3.5 h-3.5 text-rose-400" /><strong className="text-white">108</strong> Ambulance</span>
            <span className="flex items-center gap-1.5"><LifeBuoy className="w-3.5 h-3.5 text-sky-400" /><strong className="text-white">1070</strong> Disaster Mgmt EOC</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <p className="text-white font-extrabold text-base tracking-wide">
              ResQ<span className="text-red-500">Net</span>
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Connecting Emergencies. Coordinating Responses. Saving Time.
            </p>
          </div>
          <div className="text-xs text-slate-500 max-w-md">
            This platform is an open disaster coordination system built for educational and emergency demonstration purposes. In life-threatening emergencies, always dial 112 directly.
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Encrypted & Secured MVP</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
