import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ComplaintsList from './pages/ComplaintsList';
import ComplainDetail from './pages/ComplainDetail';
import CreateComplaint from './pages/CreateComplaint';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import OfficialDashboard from './pages/OfficialDashboard';
import AgenciesList from './pages/AgenciesList';
import AgencyDetail from './pages/AgencyDetail';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && currentUser.role?.toLowerCase() !== requiredRole.toLowerCase()) {
    return <Navigate to="/" />;
  }
  
  return children;
};

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  const userRole = currentUser.role?.toLowerCase();
  const hasAllowedRole = allowedRoles.some(role => role.toLowerCase() === userRole);
  
  if (!hasAllowedRole) {
    return <Navigate to="/" />;
  }
  
  return children;
};

const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbar = location.pathname === '/login' || location.pathname === '/register';
  const hideFooter = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className='min-h-screen flex flex-col'>
      {!hideNavbar && <Navbar />}
      <main className='flex-grow'>
        {children}
      </main>
      {!hideFooter &&
        <footer className='bg-gray-800 text-white p-4 text-center'>
          <p>© {new Date().getFullYear()} CitiVoice. All rights reserved.</p>
        </footer>
      }
    </div>
  );
};

function AppContent() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/complaints" element={<ComplaintsList />} />
          <Route path="/Complaints/:id" element={<ComplainDetail />} />
          <Route path="/agencies" element={<AgenciesList />} />
          <Route path="/agencies/:id" element={<AgencyDetail />} />
          
          <Route path="/complaints/new" element={
            <ProtectedRoute>
              <CreateComplaint />
            </ProtectedRoute>
          } />
          
          <Route path="/Profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/*" element={
            <RoleBasedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </RoleBasedRoute>
          } />
          
          <Route path="/official/*" element={
            <RoleBasedRoute allowedRoles={['official']}>
              <OfficialDashboard />
            </RoleBasedRoute>
          } />
          
          <Route path="*" element={
            <div className='flex flex-col items-center justify-center h-screen'>
              <h1 className='text-4xl font-bold mb-4'>404</h1>
              <h1 className='text-xl mb-8'>Page not found</h1>
              <button onClick={() => window.history.back()} className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
                Go Back
              </button>
            </div>
          } />
        </Routes>
      </Layout>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
