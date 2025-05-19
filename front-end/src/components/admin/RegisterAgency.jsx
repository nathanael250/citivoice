import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const RegisterAgency = () => {
    const [formData, setFormData] = useState({
        // Agency details
        name: '',
        description: '',
        address: '',
        phone: '',
        email: '',
        website: '',

        // Official details
        officialFirstName: '',
        officialLastName: '',
        officialEmail: '',
        officialPassword: '',
        officialConfirmPassword: '',
        officialPhone: ''
    });

    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1 for agency details, 2 for official details

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        // Validate agency details in step 1
        if (step === 1) {
            if (!formData.name || !formData.description || !formData.address || !formData.phone || !formData.email) {
                toast.error('Please fill in all required agency fields');
                return false;
            }
            return true;
        }

        // Validate official details in step 2
        if (step === 2) {
            if (!formData.officialFirstName || !formData.officialLastName || !formData.officialEmail ||
                !formData.officialPassword || !formData.officialPhone) {
                toast.error('Please fill in all required official fields');
                return false;
            }

            if (formData.officialPassword !== formData.officialConfirmPassword) {
                toast.error('Passwords do not match');
                return false;
            }

            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.officialEmail)) {
                toast.error('Please enter a valid email address');
                return false;
            }

            // Password strength validation
            if (formData.officialPassword.length < 8) {
                toast.error('Password must be at least 8 characters long');
                return false;
            }

            return true;
        }

        return false;
    };

    const handleNextStep = () => {
        if (validateForm()) {
            setStep(2);
        }
    };

    const handlePrevStep = () => {
        setStep(1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:7000/api/agencies',
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            toast.success('Agency and official account registered successfully!');

            // Reset form and go back to step 1
            setFormData({
                name: '',
                description: '',
                address: '',
                phone: '',
                email: '',
                website: '',
                officialFirstName: '',
                officialLastName: '',
                officialEmail: '',
                officialPassword: '',
                officialConfirmPassword: '',
                officialPhone: ''
            });
            setStep(1);
        } catch (error) {
            console.error('Error registering agency:', error);
            toast.error(error.response?.data?.error || 'Failed to register agency');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Register New Agency</h2>

            {step === 1 ? (
                // Step 1: Agency Details
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Agency Name*</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description*</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Address*</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone*</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email*</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Website</label>
                        <input
                            type="url"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="button"
                            onClick={handleNextStep}
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Next: Official Details
                        </button>
                    </div>
                </form>
            ) : (
                // Step 2: Official Details
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">First Name*</label>
                        <input
                            type="text"
                            name="officialFirstName"
                            value={formData.officialFirstName}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name*</label>
                        <input
                            type="text"
                            name="officialLastName"
                            value={formData.officialLastName}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email*</label>
                        <input
                            type="email"
                            name="officialEmail"
                            value={formData.officialEmail}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone*</label>
                        <input
                            type="text"
                            name="officialPhone"
                            value={formData.officialPhone}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password*</label>
                        <input
                            type="password"
                            name="officialPassword"
                            value={formData.officialPassword}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Confirm Password*</label>
                        <input
                            type="password"
                            name="officialConfirmPassword"
                            value={formData.officialConfirmPassword}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="pt-4 flex justify-between">
                        <button
                            type="button"
                            onClick={handlePrevStep}
                            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Back to Agency Details
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Registering...' : 'Register Agency & Official'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default RegisterAgency;
