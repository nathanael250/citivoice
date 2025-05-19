import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Welcome to CitiVoice</h1>

            {currentUser ? (
                <div className="bg-white shadow-md rounded-lg p-6">
                    <p className="text-xl mb-4">
                        Hello, {currentUser.firstName} {currentUser.lastName}!
                    </p>
                    {currentUser.role === 'admin' && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                            <h2 className="text-xl font-semibold text-red-800">Admin Access</h2>
                            <p className="mt-2">You have admin privileges. Go to your dashboard to manage the system.</p>
                            <Link to="/admin" className="mt-4 inline-block px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                                Admin Dashboard
                            </Link>
                        </div>
                    )}

                    {currentUser.role === 'official' && (
                        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                            <h2 className="text-xl font-semibold text-blue-800">Official Access</h2>
                            <p className="mt-2">You have official privileges. Go to your dashboard to manage complaints.</p>
                            <Link to="/official" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                Official Dashboard
                            </Link>
                        </div>
                    )}

                    {currentUser.role === 'citizen' && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
                            <h2 className="text-xl font-semibold text-green-800">Citizen Portal</h2>
                            <p className="mt-2">You can submit and track complaints through our system.</p>
                            <Link to="/complaints/new" className="mt-4 inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mr-4">
                                Submit Complaint
                            </Link>
                            <Link to="/complaints" className="mt-4 inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                                My Complaints
                            </Link>
                        </div>
                    )}

                    <div className="mt-4">
                        <p className="text-gray-600">
                            Your role: <span className="font-semibold">{currentUser.role}</span>
                        </p>
                    </div>
                </div>
            ) : (
                <div className="bg-white shadow-md rounded-lg p-6">
                    <p className="text-xl mb-4">
                        Please log in to access the full features of CitiVoice.
                    </p>
                    <div className="flex space-x-4">
                        <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Login
                        </Link>
                        <Link to="/register" className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                            Register
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
