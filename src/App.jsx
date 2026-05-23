import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import MechanicDashboard from './pages/MechanicDashboard';
import IssueRegister from './pages/IssueRegister';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import { ToastProvider } from './components/Toast';
import { getCurrentSession, seedInitialData } from './utils/localStorageHelpers';

// Route Guard for logged-in sessions
function AuthGuard({ children, requiredRole }) {
  const session = getCurrentSession();
  
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && session.role !== requiredRole) {
    // Redirect wrong roles to their respective landing page
    return <Navigate to={session.role === 'admin' ? '/admin' : '/mechanic'} replace />;
  }

  return children;
}

// Redirect already logged-in users away from auth pages
function GuestGuard({ children }) {
  const session = getCurrentSession();

  if (session) {
    return <Navigate to={session.role === 'admin' ? '/admin' : '/mechanic'} replace />;
  }

  return children;
}

// Layout wrapper for in-app pages (Dashboard layout with sidebar & top nav)
function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Get dynamic titles for current page header
  const getPageTitle = (path) => {
    switch (path) {
      case '/admin':
        return 'Admin Dashboard';
      case '/mechanic':
        return 'Available Tools Catalog';
      case '/register-log':
        const session = getCurrentSession();
        return session?.role === 'admin' ? 'Global Issue Register' : 'My Issue Register';
      default:
        return 'TIMS Dashboard';
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content Pane */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <Navbar 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          pageTitle={getPageTitle(location.pathname)} 
        />
        
        {/* View Content Area */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Routes>
            <Route 
              path="/admin" 
              element={
                <AuthGuard requiredRole="admin">
                  <AdminDashboard />
                </AuthGuard>
              } 
            />
            <Route 
              path="/mechanic" 
              element={
                <AuthGuard requiredRole="mechanic">
                  <MechanicDashboard />
                </AuthGuard>
              } 
            />
            <Route 
              path="/register-log" 
              element={
                <AuthGuard>
                  <IssueRegister />
                </AuthGuard>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

// Router and Index seeding router setup
export default function App() {
  useEffect(() => {
    // Seed initial demo data when app loads
    seedInitialData();
  }, []);

  return (
    <ToastProvider>
      {/* <BrowserRouter basename="/Assignment-Indicorp"> */}
      <HashRouter>
        <Routes>
          {/* Guest Auth Gates */}
          <Route 
            path="/login" 
            element={
              <GuestGuard>
                <Login />
              </GuestGuard>
            } 
          />
          <Route 
            path="/register" 
            element={
              <GuestGuard>
                <Register />
              </GuestGuard>
            } 
          />

          {/* Root/Landing redirect logic */}
          <Route 
            path="/" 
            element={
              <AuthGuard>
                <Navigate to="/login" replace />
              </AuthGuard>
            } 
          />

          {/* Protected layout panels */}
          <Route path="/*" element={<DashboardLayout />} />
        </Routes>
        </HashRouter>
       {/* </BrowserRouter> */}
    </ToastProvider>
  );
}
