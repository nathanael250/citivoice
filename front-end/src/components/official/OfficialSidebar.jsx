import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const OfficialSidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const location = useLocation();
    const { currentUser, logout } = useAuth();
    
    const navigation = [
        { name: 'Dashboard', href: '/official', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { name: 'Complaints', href: '/official/complaints', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
        { name: 'Reports', href: '/official/reports', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
        { name: 'Profile', href: '/official/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    ];

    return (
        <>
            <div
                className={`fixed inset-0 flex z-40 md:hidden ${
                    sidebarOpen ? 'opacity-100 ease-in-out duration-300' : 'opacity-0 ease-in-out duration-300 pointer-events-none'
                }`}
            >
                <div
                    className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ${
                        sidebarOpen ? 'opacity-100 ease-in-out duration-300' : 'opacity-0 ease-in-out duration-300'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                ></div>

                <div className={`relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-indigo-700 transition ease-in-out duration-300 transform ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                        <button
                            type="button"
                            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <span className="sr-only">Close sidebar</span>
                            <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex-shrink-0 flex items-center px-4">
                        <img
                            className="h-8 w-auto"
                            src="/logo-white.svg"
                            alt="CitiVoice"
                        />
                    </div>
                    <div className="mt-5 flex-1 h-0 overflow-y-auto">
                        <nav className="px-2 space-y-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                                        location.pathname === item.href || (item.href !== '/official' && location.pathname.startsWith(item.href))
                                            ? 'bg-indigo-800 text-white'
                                            : 'text-indigo-100 hover:bg-indigo-600'
                                    }`}
                                >
                                    <svg
                                        className="mr-4 h-6 w-6 text-indigo-300"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                                    </svg>
                                    {item.name}
                                </Link>
                            ))}
                            <button
                                onClick={logout}
                                className="w-full group flex items-center px-2 py-2 text-base font-medium rounded-md text-indigo-100 hover:bg-indigo-600"
                            >
                                <svg
                                    className="mr-4 h-6 w-6 text-indigo-300"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Logout
                            </button>
                        </nav>
                    </div>
                </div>

                <div className="flex-shrink-0 w-14" aria-hidden="true">
                </div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden md:flex md:flex-shrink-0">
                <div className="flex flex-col w-64">
                    <div className="flex flex-col h-0 flex-1">
                        <div className="flex items-center h-16 flex-shrink-0 px-4 bg-indigo-700">
                            <img
                                className="h-8 w-auto"
                                src="/logo-white.svg"
                                alt="CitiVoice"
                            />
                        </div>
                        <div className="flex-1 flex flex-col overflow-y-auto">
                            <nav className="flex-1 px-2 py-4 bg-indigo-700 space-y-1">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                            location.pathname === item.href || (item.href !== '/official' && location.pathname.startsWith(item.href))
                                                ? 'bg-indigo-800 text-white'
                                                : 'text-indigo-100 hover:bg-indigo-600'
                                        }`}
                                    >
                                        <svg
                                            className="mr-3 h-6 w-6 text-indigo-300"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                                        </svg>
                                        {item.name}
                                    </Link>
                                ))}
                                <button
                                    onClick={logout}
                                    className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-indigo-100 hover:bg-indigo-600"
                                >
                                    <svg
                                        className="mr-3 h-6 w-6 text-indigo-300"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Logout
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OfficialSidebar;
