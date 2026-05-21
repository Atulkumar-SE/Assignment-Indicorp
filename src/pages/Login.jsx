import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, UserCheck, KeyRound, Mail, ArrowRight, Wrench } from 'lucide-react';
import { getMechanics, loginUser } from '../utils/localStorageHelpers';
import { useToast } from '../components/Toast';

export default function Login() {
  const [isAdmin, setIsAdmin] = useState(false); // tab selector
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (isAdmin) {
      // Hardcoded Admin logic
      if (email.toLowerCase() === 'admin@gmail.com' && password === 'Admin@123') {
        const adminUser = {
          fullName: 'System Administrator',
          email: 'admin@gmail.com',
          avatar: ''
        };
        loginUser(adminUser, 'admin');
        showToast('Welcome back, Admin!', 'success');
        navigate('/admin');
      } else {
        setError('Invalid Admin credentials.');
        showToast('Admin login failed.', 'error');
      }
    } else {
      // Registered Mechanic credentials
      const mechanics = getMechanics();
      const mechanic = mechanics.find(
        (m) => m.email.toLowerCase() === email.toLowerCase() && m.passwordHash === password
      );

      if (mechanic) {
        loginUser(mechanic, 'mechanic');
        showToast(`Welcome back, ${mechanic.fullName}!`, 'success');
        navigate('/mechanic');
      } else {
        setError('Invalid mechanic credentials or account does not exist.');
        showToast('Mechanic login failed.', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center font-medium">
      <div className="w-full max-w-5xl bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row min-h-[600px] border border-slate-200">
        
        {/* Left Side Panel (SaaS Branding) */}
        <div className="w-full md:w-1/2 bg-slate-900 text-white p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle glowing radial background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/25">
              <Wrench className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg tracking-tight">TIMS Portal</h1>
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest leading-none">Workshop ERP</span>
            </div>
          </div>

          <div className="space-y-6 my-auto pt-8">
            <h2 className="text-3xl font-extrabold tracking-tight leading-tight lg:text-4xl">
              Automated <span className="text-blue-500">Tool Tracking</span> for High-Output Teams
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed font-normal">
              Register mechanics, track inventory serial levels, log issue records in real-time, and eliminate supply bottlenecking on the shop floor.
            </p>
            
            {/* Quick Metrics display */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800">
              <div>
                <p className="text-xl font-bold text-white leading-none">100%</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mt-1">Accuracy</p>
              </div>
              <div>
                <p className="text-xl font-bold text-white leading-none">Real-time</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mt-1">Updates</p>
              </div>
              <div>
                <p className="text-xl font-bold text-white leading-none">Zero</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mt-1">Paperwork</p>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-500 flex items-center justify-between">
            <span>&copy; {new Date().getFullYear()} TIMS. All rights reserved.</span>
            <span className="font-semibold text-slate-400">v1.2.0</span>
          </div>
        </div>

        {/* Right Side Panel (Login Form Box) */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto space-y-6">
            
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Account Sign In</h3>
              <p className="text-xs font-semibold text-slate-400 mt-1">Please select your portal and enter your credentials.</p>
            </div>

            {/* Login Mode Toggle Tabs */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl border border-slate-200/50">
              <button
                type="button"
                onClick={() => { setIsAdmin(false); setError(''); }}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 focus:outline-none ${
                  !isAdmin 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Mechanic Portal</span>
              </button>
              
              <button
                type="button"
                onClick={() => { setIsAdmin(true); setError(''); }}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 focus:outline-none ${
                  isAdmin 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Portal</span>
              </button>
            </div>

            {/* Form Box */}
            <form onSubmit={handleLogin} className="space-y-4">
              
              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder={isAdmin ? 'admin@gmail.com' : 'e.g. john@gmail.com'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 font-semibold transition-all"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 font-semibold transition-all"
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {error && (
                <div className="text-xs text-rose-500 font-bold bg-rose-50 border border-rose-100 p-3 rounded-xl">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5 focus:outline-none group mt-6"
              >
                <span>Access {isAdmin ? 'Admin Console' : 'Mechanic Catalog'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </form>

            {/* Quick Helper Credentials Banner for Dev ease */}
            {isAdmin ? (
              <div className="p-3 bg-blue-50/50 border border-blue-100/80 rounded-xl text-[11px] leading-relaxed text-blue-700">
                <span className="font-bold block mb-0.5">Quick Admin Credentials:</span>
                Email: <span className="font-bold font-mono">admin@gmail.com</span> &bull; Pass: <span className="font-bold font-mono">Admin@123</span>
              </div>
            ) : (
              <div className="p-3 bg-emerald-50/50 border border-emerald-100/80 rounded-xl text-[11px] leading-relaxed text-emerald-700">
                <span className="font-bold block mb-0.5">Quick Mechanic Credentials (Seeded):</span>
                Email: <span className="font-bold font-mono">john@gmail.com</span> &bull; Pass: <span className="font-bold font-mono">Password@123</span>
              </div>
            )}

            {/* Registration Prompt for mechanics */}
            {!isAdmin && (
              <p className="text-xs text-slate-400 font-semibold text-center mt-6">
                Are you a new mechanic?{' '}
                <Link to="/register" className="text-blue-600 hover:underline hover:text-blue-700">
                  Register Account
                </Link>
              </p>
            )}

          </div>
        </div>
        
      </div>
    </div>
  );
}
