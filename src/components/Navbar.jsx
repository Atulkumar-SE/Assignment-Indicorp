import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, User, LogOut, ChevronDown, Wrench, ShieldAlert } from 'lucide-react';
import { getCurrentSession, logoutUser } from '../utils/localStorageHelpers';
import { useToast } from './Toast';

export default function Navbar({ toggleSidebar, pageTitle }) {
  const session = getCurrentSession();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!session) return null;

  const isAdmin = session.role === 'admin';

  const handleLogout = () => {
    logoutUser();
    showToast('Logged out successfully', 'success');
    navigate('/login');
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6 shadow-sm">
      {/* Left side: Hamburger (mobile) + Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-slate-800 leading-tight">
            {pageTitle || 'Dashboard'}
          </h2>
          <span className="text-xs text-slate-400 font-medium hidden md:inline">
            Workshop Operations &bull; {formattedDate}
          </span>
        </div>
      </div>

      {/* Right side: Mock Notification + Profile dropdown */}
      <div className="flex items-center gap-4">
        {/* Mock Notification Bell */}
        <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all focus:outline-none hidden sm:block">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
        </button>

        {/* Divider */}
        <span className="w-px h-6 bg-slate-200 hidden sm:block"></span>

        {/* User Account Settings Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-50 transition-all focus:outline-none border border-transparent hover:border-slate-200/60"
          >
            {isAdmin ? (
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <ShieldAlert className="w-4 h-4" />
              </div>
            ) : (
              <img
                src={session.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde'}
                alt={session.fullName}
                className="w-8 h-8 rounded-lg object-cover ring-2 ring-slate-100"
                onError={(e) => {
                  e.target.src = 'https://api.dicebear.com/7.x/initials/svg?seed=' + session.fullName;
                }}
              />
            )}
            <div className="text-left hidden sm:block">
              <p className="text-xs font-semibold text-slate-700 leading-none">{session.fullName}</p>
              <p className="text-[10px] text-slate-400 font-medium leading-none mt-0.5 capitalize">{isAdmin ? 'Admin' : session.level}</p>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Box */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1 animate-fade-in">
              <div className="px-4 py-2 border-b border-slate-100 sm:hidden">
                <p className="text-xs font-semibold text-slate-700 truncate">{session.fullName}</p>
                <p className="text-[10px] text-slate-400 capitalize">{session.role}</p>
              </div>

              <div className="px-4 py-2 text-xs font-semibold text-slate-400 tracking-wider uppercase">
                Options
              </div>

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate('/register-log');
                }}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 w-full text-left transition-colors"
              >
                <Wrench className="w-4 h-4 text-slate-400" />
                <span>Issue Register</span>
              </button>

              <hr className="border-slate-100 my-1" />

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 w-full text-left transition-colors font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
