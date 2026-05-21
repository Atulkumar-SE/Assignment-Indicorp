import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wrench, 
  ClipboardList, 
  LogOut, 
  ShieldAlert, 
  User, 
  Menu,
  X 
} from 'lucide-react';
import { getCurrentSession, logoutUser } from '../utils/localStorageHelpers';
import { useToast } from './Toast';

export default function Sidebar({ isOpen, toggleSidebar }) {
  const session = getCurrentSession();
  const navigate = useNavigate();
  const { showToast } = useToast();

  if (!session) return null;

  const isAdmin = session.role === 'admin';

  const handleLogout = () => {
    logoutUser();
    showToast('Logged out successfully', 'success');
    navigate('/login');
  };

  // Nav link configuration based on roles
  const links = isAdmin 
    ? [
        { to: '/admin', label: 'Admin Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { to: '/register-log', label: 'Issue Register', icon: <ClipboardList className="w-5 h-5" /> }
      ]
    : [
        { to: '/mechanic', label: 'Tool Catalog', icon: <Wrench className="w-5 h-5" /> },
        { to: '/register-log', label: 'My Issue Log', icon: <ClipboardList className="w-5 h-5" /> }
      ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          onClick={toggleSidebar}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-slate-900 border-r border-slate-800 text-slate-300 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <Wrench className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white leading-none">TIMS Portal</h1>
              <span className="text-[10px] text-blue-400 font-semibold tracking-wider uppercase">Tool Manager</span>
            </div>
          </div>
          {/* Close button on mobile */}
          <button 
            onClick={toggleSidebar}
            className="lg:hidden p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 mx-4 my-6 rounded-xl bg-slate-950/50 border border-slate-800/60 flex items-center gap-3">
          {isAdmin ? (
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/25 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
          ) : (
            <img 
              src={session.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde'} 
              alt={session.fullName} 
              className="w-10 h-10 rounded-lg object-cover ring-2 ring-blue-500/20 shrink-0"
              onError={(e) => {
                e.target.src = 'https://api.dicebear.com/7.x/initials/svg?seed=' + session.fullName;
              }}
            />
          )}
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-white truncate">{session.fullName}</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${isAdmin ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
              <span className="text-xs text-slate-400 font-medium capitalize">
                {isAdmin ? 'System Admin' : session.level}
              </span>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => {
                if (window.innerWidth < 1024) toggleSidebar();
              }}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/15'
                    : 'hover:bg-slate-800 hover:text-white text-slate-400'
                }`
              }
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800/80">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-all focus:outline-none"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
