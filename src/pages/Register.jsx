import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, Shield, Lock, ArrowLeft, KeyRound, Check, X, ShieldAlert } from 'lucide-react';
import { validateRegistration, cleanMobileInput } from '../utils/validations';
import { saveMechanic, getMechanics } from '../utils/localStorageHelpers';
import { useToast } from '../components/Toast';

// A collection of clean avatar illustrations for workshop personnel
const AVATARS = [
  { id: 'av-1', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=120' },
  { id: 'av-2', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120' },
  { id: 'av-3', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=120' },
  { id: 'av-4', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120' },
  { id: 'av-5', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=120' },
  { id: 'av-6', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120' }
];

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    level: 'Expert',
    password: '',
    confirmPassword: '',
    avatar: AVATARS[0].url
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Password requirements real-time markers
  const [pwdMetrics, setPwdMetrics] = useState({
    hasLength: false,
    hasLetters: false,
    hasNumbers: false,
    hasSpecial: false
  });

  useEffect(() => {
    const pwd = formData.password;
    setPwdMetrics({
      hasLength: pwd.length >= 8,
      hasLetters: /[A-Za-z]/.test(pwd),
      hasNumbers: /\d/.test(pwd),
      hasSpecial: /[@$!%*#?&]/.test(pwd)
    });
  }, [formData.password]);

  const handleMobileChange = (e) => {
    const cleaned = cleanMobileInput(e.target.value);
    setFormData(prev => ({ ...prev, mobile: cleaned }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setErrors({});

    // Validate inputs
    const { isValid, errors: validationErrors } = validateRegistration(formData);
    
    if (!isValid) {
      setErrors(validationErrors);
      showToast('Please fix the errors on the form.', 'error');
      return;
    }

    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        mobile: formData.mobile,
        level: formData.level,
        avatar: formData.avatar,
        passwordHash: formData.password
      };
      
      saveMechanic(payload);
      showToast('Registration successful! Please login.', 'success');
      navigate('/login');
    } catch (err) {
      showToast(err.message || 'Registration failed.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center font-medium py-10 px-4">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row border border-slate-200">
        
        {/* Brand visual panel */}
        <div className="w-full md:w-5/12 bg-slate-900 text-white p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>

          <div className="my-auto space-y-5 py-8">
            <span className="text-[10px] bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20 px-3 py-1 rounded-full uppercase tracking-wider inline-block">
              Technician Portal
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
              Create Your Mechanic Profile
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed font-normal">
              Register as an authorized mechanic to unlock tool checkouts, request items instantly, and manage your inventory logs.
            </p>
          </div>

          <div className="text-xs text-slate-500">
            Authorized technician registration terminal. TIMS Workshop System.
          </div>
        </div>

        {/* Form Box */}
        <div className="w-full md:w-7/12 p-8 sm:p-10 bg-white">
          <div className="max-w-md w-full mx-auto space-y-6">
            
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Mechanic Signup</h3>
              <p className="text-xs font-semibold text-slate-400 mt-1">Please provide correct workshop details.</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    className={`w-full pl-10 pr-4 py-2 rounded-xl border bg-slate-50/50 text-sm text-slate-800 focus:outline-none focus:ring-2 font-semibold transition-all ${
                      errors.fullName 
                        ? 'border-rose-300 focus:ring-rose-100 focus:border-rose-400' 
                        : 'border-slate-200 focus:ring-blue-100 focus:border-blue-500'
                    }`}
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
                {errors.fullName && <span className="text-[11px] text-rose-500 font-semibold mt-1 block">{errors.fullName}</span>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="john@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className={`w-full pl-10 pr-4 py-2 rounded-xl border bg-slate-50/50 text-sm text-slate-800 focus:outline-none focus:ring-2 font-semibold transition-all ${
                        errors.email 
                          ? 'border-rose-300 focus:ring-rose-100 focus:border-rose-400' 
                          : 'border-slate-200 focus:ring-blue-100 focus:border-blue-500'
                      }`}
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                  {errors.email && <span className="text-[11px] text-rose-500 font-semibold mt-1 block">{errors.email}</span>}
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. 9876543210"
                      value={formData.mobile}
                      onChange={handleMobileChange}
                      className={`w-full pl-10 pr-4 py-2 rounded-xl border bg-slate-50/50 text-sm text-slate-800 focus:outline-none focus:ring-2 font-semibold transition-all ${
                        errors.mobile 
                          ? 'border-rose-300 focus:ring-rose-100 focus:border-rose-400' 
                          : 'border-slate-200 focus:ring-blue-100 focus:border-blue-500'
                      }`}
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                  {errors.mobile && <span className="text-[11px] text-rose-500 font-semibold mt-1 block">{errors.mobile}</span>}
                </div>
              </div>

              {/* Mechanic Level selection */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Level of Mechanic
                </label>
                <div className="relative">
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 font-semibold transition-all appearance-none"
                  >
                    <option value="Expert">Expert (5+ Years Experience)</option>
                    <option value="Medium">Medium (2-5 Years Experience)</option>
                    <option value="New Recruit">New Recruit (0-2 Years Experience)</option>
                    <option value="Trainee">Trainee (Apprentice/Student)</option>
                  </select>
                  <Shield className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Select Profile Avatar
                </label>
                <div className="flex gap-2.5 overflow-x-auto py-1">
                  {AVATARS.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, avatar: av.url }))}
                      className={`relative w-11 h-11 rounded-lg border-2 overflow-hidden bg-slate-100 focus:outline-none transition-all ${
                        formData.avatar === av.url ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-200'
                      }`}
                    >
                      <img src={av.url} alt="Technician" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className={`w-full pl-10 pr-4 py-2 rounded-xl border bg-slate-50/50 text-sm text-slate-800 focus:outline-none focus:ring-2 font-semibold transition-all ${
                        errors.password 
                          ? 'border-rose-300 focus:ring-rose-100 focus:border-rose-400' 
                          : 'border-slate-200 focus:ring-blue-100 focus:border-blue-500'
                      }`}
                    />
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                  {errors.password && <span className="text-[11px] text-rose-500 font-semibold mt-1 block leading-normal">{errors.password}</span>}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Confirm Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className={`w-full pl-10 pr-4 py-2 rounded-xl border bg-slate-50/50 text-sm text-slate-800 focus:outline-none focus:ring-2 font-semibold transition-all ${
                        errors.confirmPassword 
                          ? 'border-rose-300 focus:ring-rose-100 focus:border-rose-400' 
                          : 'border-slate-200 focus:ring-blue-100 focus:border-blue-500'
                      }`}
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                  {errors.confirmPassword && <span className="text-[11px] text-rose-500 font-semibold mt-1 block">{errors.confirmPassword}</span>}
                </div>
              </div>

              {/* Password checklist */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-[11px] font-semibold text-slate-500">
                <span className="text-slate-400 block mb-0.5 text-[10px] font-bold uppercase tracking-wider">Password Requirements:</span>
                
                <div className="flex items-center gap-1.5">
                  {pwdMetrics.hasLength ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <X className="w-3.5 h-3.5 text-slate-300" />}
                  <span className={pwdMetrics.hasLength ? 'text-emerald-700' : ''}>At least 8 characters long</span>
                </div>
                
                <div className="flex items-center gap-1.5">
                  {pwdMetrics.hasLetters ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <X className="w-3.5 h-3.5 text-slate-300" />}
                  <span className={pwdMetrics.hasLetters ? 'text-emerald-700' : ''}>Contains alphabetic letters</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {pwdMetrics.hasNumbers ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <X className="w-3.5 h-3.5 text-slate-300" />}
                  <span className={pwdMetrics.hasNumbers ? 'text-emerald-700' : ''}>Contains numeric digits (0-9)</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {pwdMetrics.hasSpecial ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <X className="w-3.5 h-3.5 text-slate-300" />}
                  <span className={pwdMetrics.hasSpecial ? 'text-emerald-700' : ''}>Contains a special character (@$!%*#?&)</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-1 focus:outline-none"
              >
                <span>Register Account</span>
              </button>
            </form>

            <p className="text-xs text-slate-400 font-semibold text-center mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline hover:text-blue-700">
                Sign In
              </Link>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}
