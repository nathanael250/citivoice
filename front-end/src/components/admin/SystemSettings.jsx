import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SystemSettings = () => {
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState({
        siteName: 'CitiVoice',
        siteDescription: 'Citizen complaint management system',
        contactEmail: 'support@citivoice.com',
        contactPhone: '+1234567890',
        maxUploadSize: 5, // in MB
        allowedFileTypes: '.jpg,.jpeg,.png,.pdf,.doc,.docx',
        defaultPaginationLimit: 10,
        maintenanceMode: false,
        notificationSettings: {
            emailNotifications: true,
            pushNotifications: false,
            smsNotifications: false
        }
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await axios.get('http://localhost:7000/api/admin/settings', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setSettings(response.data);
        } catch (error) {
            console.error('Error fetching settings:', error);
            toast.error('Failed to load system settings');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.includes('.')) {
            // Handle nested properties (e.g., notificationSettings.emailNotifications)
            const [parent, child] = name.split('.');
            setSettings({
                ...settings,
                [parent]: {
                    ...settings[parent],
                    [child]: type === 'checkbox' ? checked : value
                }
            });
        } else {
            // Handle top-level properties
            setSettings({
                ...settings,
                [name]: type === 'checkbox' ? checked : value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.put(
                'http://localhost:7000/api/admin/settings',
                settings,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            toast.success('System settings updated successfully');
        } catch (error) {
            console.error('Error updating settings:', error);
            toast.error('Failed to update system settings');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">System Settings</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">General Settings</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">
                                Site Name
                            </label>
                            <input
                                type="text"
                                id="siteName"
                                name="siteName"
                                value={settings.siteName}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700">
                                Site Description
                            </label>
                            <input
                                type="text"
                                id="siteDescription"
                                name="siteDescription"
                                value={settings.siteDescription}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                                Contact Email
                            </label>
                            <input
                                type="email"
                                id="contactEmail"
                                name="contactEmail"
                                value={settings.contactEmail}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
                                Contact Phone
                            </label>
                            <input
                                type="text"
                                id="contactPhone"
                                name="contactPhone"
                                value={settings.contactPhone}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">File Upload Settings</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="maxUploadSize" className="block text-sm font-medium text-gray-700">
                                Maximum Upload Size (MB)
                            </label>
                            <input
                                type="number"
                                id="maxUploadSize"
                                name="maxUploadSize"
                                value={settings.maxUploadSize}
                                onChange={handleChange}
                                min="1"
                                max="50"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="allowedFileTypes" className="block text-sm font-medium text-gray-700">
                                Allowed File Types
                            </label>
                            <input
                                type="text"
                                id="allowedFileTypes"
                                name="allowedFileTypes"
                                value={settings.allowedFileTypes}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Comma-separated list of file extensions
                            </p>
                        </div>
                    </div>
                </div>

                <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Display Settings</h3>

                    <div>
                        <label htmlFor="defaultPaginationLimit" className="block text-sm font-medium text-gray-700">
                            Default Items Per Page
                        </label>
                        <select
                            id="defaultPaginationLimit"
                            name="defaultPaginationLimit"
                            value={settings.defaultPaginationLimit}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                        </select>
                    </div>
                </div>

                <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h3>

                    <div className="space-y-4">
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="emailNotifications"
                                    name="notificationSettings.emailNotifications"
                                    type="checkbox"
                                    checked={settings.notificationSettings.emailNotifications}
                                    onChange={handleChange}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="emailNotifications" className="font-medium text-gray-700">
                                    Email Notifications
                                </label>
                                <p className="text-gray-500">Send notifications via email</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="pushNotifications"
                                    name="notificationSettings.pushNotifications"
                                    type="checkbox"
                                    checked={settings.notificationSettings.pushNotifications}
                                    onChange={handleChange}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="pushNotifications" className="font-medium text-gray-700">
                                    Push Notifications
                                </label>
                                <p className="text-gray-500">Send browser push notifications</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="smsNotifications"
                                    name="notificationSettings.smsNotifications"
                                    type="checkbox"
                                    checked={settings.notificationSettings.smsNotifications}
                                    onChange={handleChange}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="smsNotifications" className="font-medium text-gray-700">
                                    SMS Notifications
                                </label>
                                <p className="text-gray-500">Send notifications via SMS (additional charges may apply)</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">System Maintenance</h3>

                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input
                                id="maintenanceMode"
                                name="maintenanceMode"
                                type="checkbox"
                                checked={settings.maintenanceMode}
                                onChange={handleChange}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="maintenanceMode" className="font-medium text-gray-700">
                                Maintenance Mode
                            </label>
                            <p className="text-gray-500">
                                When enabled, the site will display a maintenance message to all non-admin users
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                            </>
                        ) : 'Save Settings'}
                    </button>
                </div>
            </form>

            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
};

export default SystemSettings;
