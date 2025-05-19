import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHome from '../components/admin/AdminHome';
import ManageUsers from '../components/admin/ManageUsers';
import ManageAgencies from '../components/admin/ManageAgencies';
import RegisterAgency from '../components/admin/RegisterAgency';
import SystemSettings from '../components/admin/SystemSettings';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { currentUser } = useAuth();

    return (
        <div className="flex h-screen bg-gray-100">
            <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <div className="flex-1 overflow-auto">
                <header className="bg-white shadow">
                    <div className="px-4 py-6 sm:px-6 lg:px-8">
                        <button
                            type="button"
                            className="md:hidden mr-3 text-gray-500 hover:text-gray-600"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <span className="sr-only">Open sidebar</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <div className="flex items-center">
                            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                            <div className="ml-4 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                                ADMIN ONLY
                            </div>
                        </div>
                        <p className="mt-2 text-gray-600">
                            Logged in as: {currentUser?.firstName} {currentUser?.lastName} ({currentUser?.role})
                        </p>
                    </div>
                </header>

                <main className="px-4 py-6 sm:px-6 lg:px-8">
                    <Routes>
                        <Route path="/" element={<AdminHome />} />
                        <Route path="/users" element={<ManageUsers />} />
                        <Route path="/agencies" element={<ManageAgencies />} />
                        <Route path="/agencies/register" element={<RegisterAgency />} />
                        <Route path="/settings" element={<SystemSettings />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
