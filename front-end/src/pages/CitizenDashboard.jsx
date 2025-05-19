import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const CitizenDashboard = () => {
    const { currentUser } = useAuth();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Citizen Dashboard</h1>
            <div className="bg-white shadow-md rounded-lg p-6">
                <p className="text-xl">Welcome, {currentUser?.firstName || 'Citizen'}!</p>
                <p className="mt-4 text-lg">This is the citizen dashboard. This is where you can track your complaints and activities.</p>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                        <h2 className="text-xl font-semibold text-green-800">My Complaints</h2>
                        <p className="mt-2">View and track the status of your submitted complaints.</p>
                        <Link to="/complaints" className="mt-4 inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                            View Complaints
                        </Link>
                    </div>

                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-md">
                        <h2 className="text-xl font-semibold text-purple-800">Submit New Complaint</h2>
                        <p className="mt-2">Have an issue to report? Submit a new complaint.</p>
                        <Link to="/complaints/new" className="mt-4 inline-block px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                            New Complaint
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CitizenDashboard;
