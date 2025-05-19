import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import OfficialSidebar from '../components/official/OfficialSidebar';
import OfficialHome from '../components/official/OfficialHome';
import ManageComplaints from '../components/official/ManageComplaints';
import ComplaintDetail from '../components/official/ComplaintDetail';
import OfficialProfile from '../components/official/OfficialProfile';
import OfficialReports from '../components/official/OfficialReports';

const OfficialDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-100">
            <OfficialSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

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
                        <h1 className="text-3xl font-bold text-gray-900">Official Dashboard</h1>
                    </div>
                </header>

                <main className="px-4 py-6 sm:px-6 lg:px-8">
                    <Routes>
                        <Route path="/" element={<OfficialHome />} />
                        <Route path="/complaints" element={<ManageComplaints />} />
                        <Route path="/complaints/:id" element={<ComplaintDetail />} />
                        <Route path="/profile" element={<OfficialProfile />} />
                        <Route path="/reports" element={<OfficialReports />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default OfficialDashboard;
