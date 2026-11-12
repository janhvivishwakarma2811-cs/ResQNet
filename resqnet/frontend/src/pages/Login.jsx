import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Radio, Lock, User, Loader2, ShieldCheck, Truck, Users } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleRedirect = (role) => {
    if (role === 'ROLE_ADMIN') navigate('/admin');
    else if (role === 'ROLE_RESPONDER') navigate('/responder');
    else navigate('/citizen');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const authData = await login(username, password);
      handleRedirect(authData.role);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Invalid username or password. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (roleType) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const authData = await demoLogin(roleType);
      handleRedirect(authData.role);
    } catch (err) {
      setErrorMsg('Failed to sign in with demo credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-red-600/30 mb-3">
            <Radio className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Sign In to ResQNet
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Access Citizen Portal, Rescue Dispatcher, or EOC Command Center
          </p>
        </div>

        {/* Demo 1-Click Role Login Shortcuts */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 text-center">
            One-Click Evaluator Demo Access
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemo('CITIZEN')}
              disabled={loading}
              className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 text-center transition-all flex flex-col items-center justify-center"
            >
              <Users className="w-4 h-4 text-blue-600 mb-1" />
              <span className="text-[11px] font-bold">Citizen</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemo('RESPONDER')}
              disabled={loading}
              className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-center transition-all flex flex-col items-center justify-center"
            >
              <Truck className="w-4 h-4 text-amber-600 mb-1" />
              <span className="text-[11px] font-bold">Responder</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemo('ADMIN')}
              disabled={loading}
              className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 text-center transition-all flex flex-col items-center justify-center"
            >
              <ShieldCheck className="w-4 h-4 text-purple-600 mb-1" />
              <span className="text-[11px] font-bold">EOC Admin</span>
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 text-center font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Username or Registered Email
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="citizen, responder@resqnet.org, or admin"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In with Credentials'
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-red-600 font-bold hover:underline">
            Register New Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
