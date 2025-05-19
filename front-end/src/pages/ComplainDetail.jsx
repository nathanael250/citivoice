import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ComplaintDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser, token } = useAuth();
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState('');
    const [submittingResponse, setSubmittingResponse] = useState(false);

    useEffect(() => {
        const fetchComplaint = async () => {
            try {
                const response = await axios.get(`http://localhost:7000/api/complaints/${id}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });
                setComplaint(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch complaint details. Please try again later.');
                setLoading(false);
            }
        };

        fetchComplaint();
    }, [id, token]);

    const handleSubmitResponse = async (e) => {
        e.preventDefault();
        if (!response.trim()) return;

        setSubmittingResponse(true);
        try {
            const responseData = await axios.post(
                `http://localhost:7000/api/complaints/${id}/responses`,
                { content: response },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

    
            setComplaint({
                ...complaint,
                responses: [...complaint.responses, responseData.data]
            });
            setResponse('');
        } catch (err) {
            setError('Failed to submit response. Please try again.');
        } finally {
            setSubmittingResponse(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            const response = await axios.patch(
                `http://localhost:7000/api/complaints/${id}`,
                { status: newStatus },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setComplaint({
                ...complaint,
                status: response.data.status
            });
        } catch (err) {
            setError('Failed to update complaint status. Please try again.');
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'in_progress':
                return 'bg-blue-100 text-blue-800';
            case 'resolved':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!complaint) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM10 11a1 1 0 00-1 1v1a1 1 0 002 0v-1a1 1 0 00-1-1zm0-7.5a1 1 0 00-1 1v3a1 1 0 002 0v-3a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">Complaint not found.</p>
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    <Link
                        to="/complaints"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Back to Complaints
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
                <nav className="flex" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-4">
                        <li>
                            <div>
                                <Link to="/" className="text-gray-400 hover:text-gray-500">
                                    <svg className="flex-shrink-0 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                    </svg>
                                    <span className="sr-only">Home</span>
                                </Link>
                            </div>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <svg className="flex-shrink-0 h-5 w-5 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                                </svg>
                                <Link to="/complaints" className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">Complaints</Link>
                            </div>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <svg className="flex-shrink-0 h-5 w-5 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                                </svg>
                                <span className="ml-4 text-sm font-medium text-gray-500" aria-current="page">
                                    {complaint.title}
                                </span>
                            </div>
                        </li>
                    </ol>
                </nav>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">{complaint.title}</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Complaint #{complaint.id} - {complaint.category}
                        </p>
                    </div>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(complaint.status)}`}>
                        {complaint.status.replace('_', ' ').charAt(0).toUpperCase() + complaint.status.replace('_', ' ').slice(1)}
                    </span>
                </div>
                <div className="border-t border-gray-200">
                    <dl>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Description</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{complaint.description}</dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Submitted by</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {complaint.submittedBy ? `${complaint.submittedBy.firstName} ${complaint.submittedBy.lastName}` : 'Anonymous'}
                            </dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Location</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{complaint.location || 'Not specified'}</dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Submitted on</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(complaint.createdAt)}</dd>
                        </div>
                        {complaint.assignedTo && (
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Assigned to</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {complaint.assignedTo.name}
                                </dd>
                            </div>
                        )}
                        {complaint.attachments && complaint.attachments.length > 0 && (
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Attachments</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                                        {complaint.attachments.map((attachment) => (
                                            <li key={attachment.id} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                                                <div className="w-0 flex-1 flex items-center">
                                                    <svg className="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="ml-2 flex-1 w-0 truncate">{attachment.filename}</span>
                                                </div>
                                                <div className="ml-4 flex-shrink-0">
                                                    <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:text-blue-500">
                                                        Download
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
            </div>

            {currentUser && currentUser.role === 'official' && (
                <div className="mt-6 bg-white shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Update complaint status</h3>
                        <div className="mt-5 flex flex-wrap gap-3">
                            <button
                                onClick={() => handleStatusChange('pending')}
                                disabled={complaint.status === 'pending'}
                                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${complaint.status === 'pending'
                                        ? 'bg-yellow-100 text-yellow-800 cursor-not-allowed'
                                        : 'text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500'
                                    }`}
                            >
                                Mark as Pending
                            </button>
                            <button
                                onClick={() => handleStatusChange('in_progress')}
                                disabled={complaint.status === 'in_progress'}
                                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${complaint.status === 'in_progress'
                                        ? 'bg-blue-100 text-blue-800 cursor-not-allowed'
                                        : 'text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                                    }`}
                            >
                                Mark as In Progress
                            </button>
                            <button
                                onClick={() => handleStatusChange('resolved')}
                                disabled={complaint.status === 'resolved'}
                                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${complaint.status === 'resolved'
                                        ? 'bg-green-100 text-green-800 cursor-not-allowed'
                                        : 'text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                                    }`}
                            >
                                Mark as Resolved
                            </button>
                            <button
                                onClick={() => handleStatusChange('rejected')}
                                disabled={complaint.status === 'rejected'}
                                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${complaint.status === 'rejected'
                                        ? 'bg-red-100 text-red-800 cursor-not-allowed'
                                        : 'text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                                    }`}
                            >
                                Mark as Rejected
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-6 bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Responses</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Communication history for this complaint.
                    </p>
                </div>
                <div className="border-t border-gray-200">
                    {complaint.responses && complaint.responses.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {complaint.responses.map((response) => (
                                <li key={response.id} className="px-4 py-4 sm:px-6">
                                    <div className="flex space-x-3">
                                        <div className="flex-shrink-0">
                                            <img
                                                className="h-10 w-10 rounded-full"
                                                src={response.respondedBy?.profilePicture || 'https://via.placeholder.com/40'}
                                                alt=""
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900">
                                                {response.respondedBy ? `${response.respondedBy.firstName} ${response.respondedBy.lastName}` : 'System'}
                                                <span className="text-sm text-gray-500"> - {response.respondedBy?.role || 'system'}</span>
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                <time dateTime={response.createdAt}>{formatDate(response.createdAt)}</time>
                                            </p>
                                            <div className="mt-2 text-sm text-gray-700">
                                                <p>{response.content}</p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="px-4 py-5 sm:px-6 text-center text-gray-500">
                            No responses yet.
                        </div>
                    )}
                </div>

                {/* Add response form for authenticated users */}
                {currentUser && (
                    <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                        <form onSubmit={handleSubmitResponse}>
                            <div>
                                <label htmlFor="response" className="block text-sm font-medium text-gray-700">
                                    Add a response
                                </label>
                                <div className="mt-1">
                                    <textarea
                                        id="response"
                                        name="response"
                                        rows="3"
                                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        placeholder="Enter your response..."
                                        value={response}
                                        onChange={(e) => setResponse(e.target.value)}
                                    ></textarea>
                                </div>
                            </div>
                            <div className="mt-3 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={submittingResponse || !response.trim()}
                                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${submittingResponse || !response.trim()
                                            ? 'bg-blue-300 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                                        }`}
                                >
                                    {submittingResponse ? 'Submitting...' : 'Submit Response'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComplaintDetail;
