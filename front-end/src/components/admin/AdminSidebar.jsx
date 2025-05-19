import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === `/admin${path}` ?
            'bg-blue-800 text-white' :
            'text-blue-100 hover:bg-blue-700';
    };

    return (
        <>
            {/* Mobile sidebar */}
            <div
                className={`md:hidden fixed inset-0 z-40 bg-gray-600 bg-opacity-75 transition-opacity ease-linear duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setSidebarOpen(false)}
            />

            <div
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-blue-900 overflow-y-auto transition duration-300 transform md:translate-x-0 md:static md:inset-0 ${sidebarOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'
                    }`}
            >
                <div className="flex items-center justify-between px-4 py-6">
                    <div className="flex items-center">
                        <img src="logo.svg" alt="CitiVoice" className="h-8 w-auto" />
                        <span className="ml-2 text-xl font-semibold text-white">Admin</span>
                    </div>
                    <button
                        type="button"
                        className="md:hidden text-white hover:text-gray-200"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <span className="sr-only">Close sidebar</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <nav className="mt-5 px-2 space-y-1">
                    <Link
                        to="/admin"
                        className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive('/')}`}
                    >
                        <svg className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Dashboard
                    </Link>

                    <Link
                        to="/admin/users"
                        className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive('/users')}`}
                    >
                        <svg className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        Manage Users
                    </Link>

                    <Link
                        to="/admin/agencies"
                        className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive('/agencies')}`}
                    >
                        <svg className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Manage Agencies
                    </Link>

                    <Link
                        to="/admin/settings"
                        className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive('/settings')}`}
                    >
                        <svg className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Settings
                    </Link>
                </nav>
            </div>
        </>
    );
};

export default AdminSidebar;
