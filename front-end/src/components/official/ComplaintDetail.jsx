import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ComplaintDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [response, setResponse] = useState('');
    const [submittingResponse, setSubmittingResponse] = useState(false);
    const [statusUpdate, setStatusUpdate] = useState('');

    useEffect(() => {
        fetchComplaintDetails();
    }, [id]);

    const fetchComplaintDetails = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `http://localhost:7000/api/complaints/${id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            setComplaint(response.data);
            setStatusUpdate(response.data.status);
        } catch (error) {
            console.error('Error fetching complaint details:', error);
            toast.error('Failed to load complaint details');
            navigate('/official/complaints');
        } finally {
            setLoading(false);
        }
    };

    const handleResponseSubmit = async (e) => {
        e.preventDefault();
        
        if (!response.trim()) {
            toast.error('Response cannot be empty');
            return;
        }
        
        try {
            setSubmittingResponse(true);
            const token = localStorage.getItem('token');
            await axios.post(
                `http://localhost:7000/api/complaints/${id}/responses`,
                { content: response },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            toast.success('Response submitted successfully');
            setResponse('');
            fetchComplaintDetails(); // Refresh the complaint details to show the new response
        } catch (error) {
            console.error('Error submitting response:', error);
            toast.error('Failed to submit response');
        } finally {
            setSubmittingResponse(false);
        }
    };

    const handleStatusUpdate = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:7000/api/complaints/${id}/status`,
                { status: statusUpdate },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            toast.success(`Complaint status updated to ${statusUpdate.replace('_', ' ')}`);
            setComplaint({ ...complaint, status: statusUpdate });
        } catch (error) {
            console.error('Error updating complaint status:', error);
            toast.error('Failed to update complaint status');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!complaint) {
        return (
            <div className="text-center py-10">
                <h2 className="text-2xl font-bold text-gray-900">Complaint not found</h2>
                <p className="mt-2 text-gray-600">The complaint you're looking for doesn't exist or you don't have permission to view it.</p>
                <button
                    onClick={() => navigate('/official/complaints')}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Back to Complaints
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Complaint Details
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        ID: {complaint.id}
                    </p>
                </div>
                <button
                    onClick={() => navigate('/official/complaints')}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Back to List
                </button>
            </div>
            
            <div className="border-t border-gray-200">
                <dl>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                            Title
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {complaint.title}
                        </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                            Submitted by
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {complaint.submittedBy?.firstName} {complaint.submittedBy?.lastName} ({complaint.submittedBy?.email})
                        </dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                            Date Submitted
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {new Date(complaint.createdAt).toLocaleString()}
                        </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                            Status
                        </dt>
                        <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                            <div className="flex items-center">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full mr-3
                                    ${complaint.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                    complaint.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 
                                    complaint.status === 'resolved' ? 'bg-green-100 text-green-800' : 
                                    'bg-red-100 text-red-800'}`}
                                >
                                    {complaint.status.replace('_', ' ')}
                                </span>
                                
                                <select
                                    value={statusUpdate}
                                    onChange={(e) => setStatusUpdate(e.target.value)}
                                    className="mr-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                                
                                <button
                                    onClick={handleStatusUpdate}
                                    disabled={statusUpdate === complaint.status}
                                    className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                                        statusUpdate === complaint.status ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    Update Status
                                                                </button>
                            </div>
                        </dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                            Category
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {complaint.category}
                        </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                            Location
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {complaint.location}
                        </dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                            Description
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {complaint.description}
                        </dd>
                    </div>
                    
                    {complaint.attachments && complaint.attachments.length > 0 && (
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Attachments
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                                    {complaint.attachments.map((attachment) => (
                                        <li key={attachment.id} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                                            <div className="w-0 flex-1 flex items-center">
                                                <svg className="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                                                </svg>
                                                <span className="ml-2 flex-1 w-0 truncate">
                                                    {attachment.filename}
                                                </span>
                                            </div>
                                            <div className="ml-4 flex-shrink-0">
                                                <a href={attachment.fileUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-indigo-600 hover:text-indigo-500">
                                                    View
                                                </a>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </dd>
                        </div>
                    )}
                </dl>
            </div>
            
            {/* Responses section */}
            <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Responses
                </h3>
                <div className="mt-4 space-y-4">
                    {complaint.responses && complaint.responses.length > 0 ? (
                        complaint.responses.map((response) => (
                            <div key={response.id} className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between">
                                    <div className="font-medium text-gray-900">
                                        {response.respondedBy?.firstName} {response.respondedBy?.lastName}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {new Date(response.createdAt).toLocaleString()}
                                    </div>
                                </div>
                                <div className="mt-2 text-sm text-gray-700">
                                    {response.content}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">No responses yet.</p>
                    )}
                </div>
            </div>
            
            {/* Add response form */}
            <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Add Response
                </h3>
                <form onSubmit={handleResponseSubmit} className="mt-4">
                    <div>
                        <label htmlFor="response" className="sr-only">
                            Response
                        </label>
                        <textarea
                            id="response"
                            name="response"
                            rows="4"
                            value={response}
                            onChange={(e) => setResponse(e.target.value)}
                            className="shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                            placeholder="Write your response here..."
                        ></textarea>
                    </div>
                    <div className="mt-3 flex justify-end">
                        <button
                            type="submit"
                            disabled={submittingResponse || !response.trim()}
                            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                                (submittingResponse || !response.trim()) ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {submittingResponse ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Submitting...
                                </>
                            ) : 'Submit Response'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ComplaintDetail;
