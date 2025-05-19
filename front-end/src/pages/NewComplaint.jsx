import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const NewComplaint = () => {
    const { currentUser, token } = useAuth();
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [files, setFiles] = useState([]);

    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            category: '',
            location: '',
            isAnonymous: false,
        },
        validationSchema: Yup.object({
            title: Yup.string().required('Title is required').max(100, 'Title must be 100 characters or less'),
            description: Yup.string().required('Description is required'),
            category: Yup.string().required('Category is required'),
            location: Yup.string(),
        }),
        onSubmit: async (values) => {
            if (!currentUser && !values.isAnonymous) {
                setError('You must be logged in to submit a complaint or select anonymous submission');
                return;
            }

            setSubmitting(true);
            setError(null);

            try {
                const formData = new FormData();
                formData.append('title', values.title);
                formData.append('description', values.description);
                formData.append('category', values.category);
                formData.append('location', values.location);
                formData.append('isAnonymous', values.isAnonymous);

                // Append files if any
                files.forEach((file) => {
                    formData.append('attachments', file);
                });

                const headers = {
                    'Content-Type': 'multipart/form-data',
                };

                if (token && !values.isAnonymous) {
                    headers.Authorization = `Bearer ${token}`;
                }

                const response = await axios.post('http://localhost:3000/api/complaints', formData, {
                    headers,
                });

                navigate(`/complaints/${response.data.id}`);
            } catch (err) {
                const errorMessage =
                    err.response?.data?.message ||
                    err.response?.data?.error ||
                    'Failed to submit complaint. Please try again.';

                setError(errorMessage);
            } finally {
                setSubmitting(false);
            }
        },
    });

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
    };

    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

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
                                    New Complaint
                                </span>
                            </div>
                        </li>
                    </ol>
                </nav>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Submit a New Complaint</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Please provide details about your complaint or issue.
                    </p>
                </div>

                {error && (
                    <div className="mx-4 my-4 bg-red-50 border-l-4 border-red-400 p-4">
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
                )}

                <div className="border-t border-gray-200">
                    <form onSubmit={formik.handleSubmit} className="px-4 py-5 sm:px-6">
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                            <div className="sm:col-span-6">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                    Title *
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        name="title"
                                        id="title"
                                        value={formik.values.title}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${formik.touched.title && formik.errors.title ? 'border-red-300' : ''
                                            }`}
                                    />
                                    {formik.touched.title && formik.errors.title && (
                                        <p className="mt-2 text-sm text-red-600">{formik.errors.title}</p>
                                    )}
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                    Category *
                                </label>
                                <div className="mt-1">
                                    <select
                                        id="category"
                                        name="category"
                                        value={formik.values.category}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${formik.touched.category && formik.errors.category ? 'border-red-300' : ''
                                            }`}
                                    >
                                        <option value="">Select a category</option>
                                        <option value="infrastructure">Infrastructure</option>
                                        <option value="public_services">Public Services</option>
                                        <option value="sanitation">Sanitation</option>
                                        <option value="transportation">Transportation</option>
                                        <option value="utilities">Utilities</option>
                                        <option value="safety">Safety & Security</option>
                                        <option value="environment">Environment</option>
                                        <option value="other">Other</option>
                                    </select>
                                    {formik.touched.category && formik.errors.category && (
                                        <p className="mt-2 text-sm text-red-600">{formik.errors.category}</p>
                                    )}
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                                    Location (optional)
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        name="location"
                                        id="location"
                                        value={formik.values.location}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        placeholder="Address or area where the issue is located"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-6">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                    Description *
                                </label>
                                <div className="mt-1">
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows="5"
                                        value={formik.values.description}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${formik.touched.description && formik.errors.description ? 'border-red-300' : ''
                                            }`}
                                        placeholder="Please provide a detailed description of the issue..."
                                    ></textarea>
                                    {formik.touched.description && formik.errors.description && (
                                        <p className="mt-2 text-sm text-red-600">{formik.errors.description}</p>
                                    )}
                                </div>
                            </div>

                            <div className="sm:col-span-6">
                                <label className="block text-sm font-medium text-gray-700">
                                    Attachments (optional)
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                    <div className="space-y-1 text-center">
                                        <svg
                                            className="mx-auto h-12 w-12 text-gray-400"
                                            stroke="currentColor"
                                            fill="none"
                                            viewBox="0 0 48 48"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <div className="flex text-sm text-gray-600">
                                            <label
                                                htmlFor="file-upload"
                                                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                            >
                                                <span>Upload files</span>
                                                <input
                                                    id="file-upload"
                                                    name="file-upload"
                                                    type="file"
                                                    className="sr-only"
                                                    multiple
                                                    onChange={handleFileChange}
                                                />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            PNG, JPG, GIF, PDF up to 10MB each
                                        </p>
                                    </div>
                                </div>
                                {files.length > 0 && (
                                    <ul className="mt-3 divide-y divide-gray-100 border border-gray-200 rounded-md">
                                        {files.map((file, index) => (
                                            <li key={index} className="flex items-center justify-between py-2 px-4 text-sm">
                                                <div className="flex items-center">
                                                    <svg className="h-5 w-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    <span className="truncate">{file.name}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile(index)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Remove
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {!currentUser && (
                                <div className="sm:col-span-6">
                                    <div className="relative flex items-start">
                                        <div className="flex items-center h-5">
                                            <input
                                                id="isAnonymous"
                                                name="isAnonymous"
                                                type="checkbox"
                                                checked={formik.values.isAnonymous}
                                                onChange={formik.handleChange}
                                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="isAnonymous" className="font-medium text-gray-700">
                                                Submit anonymously
                                            </label>
                                            <p className="text-gray-500">
                                                Your complaint will be submitted without your personal information.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <Link
                                to="/complaints"
                                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={submitting}
                                className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${submitting
                                        ? 'bg-blue-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                                    }`}
                            >
                                {submitting ? 'Submitting...' : 'Submit Complaint'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewComplaint;
