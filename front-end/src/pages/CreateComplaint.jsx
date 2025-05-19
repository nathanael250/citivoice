import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const CreateComplaint = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [agencies, setAgencies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        location: '',
        agencyId: ''
    });

    useEffect(() => {
        // Fetch agencies for dropdown
        const fetchAgencies = async () => {
            try {
                const response = await axios.get('http://localhost:7000/api/agencies');
                setAgencies(response.data);
            } catch (error) {
                console.error('Error fetching agencies:', error);
                toast.error('Failed to load agencies');
            }
        };

        fetchAgencies();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Make sure the token is included in the request
            const token = localStorage.getItem('token');
            
            const response = await axios.post(
                'http://localhost:7000/api/complaints', 
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            toast.success('Complaint submitted successfully!');
            
            // Redirect to the complaints list or the new complaint detail
            setTimeout(() => {
                navigate('/complaints');
            }, 2000);
            
        } catch (error) {
            console.error('Error submitting complaint:', error);
            toast.error(error.response?.data?.error || 'Failed to submit complaint');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Submit a New Complaint</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        <option value="">Select a category</option>
                        <option value="infrastructure">Infrastructure</option>
                        <option value="public_services">Public Services</option>
                        <option value="environment">Environment</option>
                        <option value="safety">Safety & Security</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700">Agency</label>
                    <select
                        name="agencyId"
                        value={formData.agencyId}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        <option value="">Select an agency</option>
                        {agencies.map(agency => (
                            <option key={agency.id} value={agency.id}>
                                {agency.name}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    ></textarea>
                </div>
                
                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Submitting...' : 'Submit Complaint'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateComplaint;
