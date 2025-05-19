import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';

const OfficialReports = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalComplaints: 0,
        pendingComplaints: 0,
        inProgressComplaints: 0,
        resolvedComplaints: 0,
        rejectedComplaints: 0
    });
    const [timeframeStats, setTimeframeStats] = useState([]);
    const [categoryStats, setCategoryStats] = useState([]);
    const [timeframe, setTimeframe] = useState('month');
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchStats();
    }, [timeframe, dateRange]);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            const overallResponse = await axios.get(
                'http://localhost:7000/api/reports/agency/overview',
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            setStats(overallResponse.data);
            
            const timeframeResponse = await axios.get(
                `http://localhost:7000/api/reports/agency/timeframe?timeframe=${timeframe}&startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            setTimeframeStats(timeframeResponse.data);
            
            const categoryResponse = await axios.get(
                `http://localhost:7000/api/reports/agency/categories?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            setCategoryStats(categoryResponse.data);
            
        } catch (error) {
            console.error('Error fetching stats:', error);
            toast.error('Failed to load report data');
        } finally {
            setLoading(false);
        }
    };

    const handleTimeframeChange = (e) => {
        setTimeframe(e.target.value);
        
        const today = new Date();
        let startDate;
        
        switch (e.target.value) {
            case 'week':
                startDate = new Date(today.setDate(today.getDate() - 7));
                break;
            case 'month':
                startDate = new Date(today.setMonth(today.getMonth() - 1));
                break;
            case 'quarter':
                startDate = new Date(today.setMonth(today.getMonth() - 3));
                break;
            case 'year':
                startDate = new Date(today.setFullYear(today.getFullYear() - 1));
                break;
            default:
                startDate = new Date(today.setMonth(today.getMonth() - 1));
        }
        
        setDateRange({
            startDate: startDate.toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0]
        });
    };

    const handleDateChange = (e) => {
        setDateRange({
            ...dateRange,
            [e.target.name]: e.target.value
        });
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

    const statusData = [
        { name: 'Pending', value: stats.pendingComplaints },
        { name: 'In Progress', value: stats.inProgressComplaints },
        { name: 'Resolved', value: stats.resolvedComplaints },
        { name: 'Rejected', value: stats.rejectedComplaints }
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Reports & Analytics
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        View statistics and trends for complaints handled by your agency.
                    </p>
                </div>
                
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Total Complaints
                                    </dt>
                                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                        {stats.totalComplaints}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                        
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Pending
                                    </dt>
                                    <dd className="mt-1 text-3xl font-semibold text-yellow-500">
                                        {stats.pendingComplaints}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                        
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        In Progress
                                    </dt>
                                    <dd className="mt-1 text-3xl font-semibold text-blue-500">
                                        {stats.inProgressComplaints}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                        
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Resolved
                                    </dt>
                                    <dd className="mt-1 text-3xl font-semibold text-green-500">
                                        {stats.resolvedComplaints}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Complaint Trends
                    </h3>
                    <div className="mt-3 sm:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                        <select
                            value={timeframe}
                            onChange={handleTimeframeChange}
                            className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            <option value="week">Last Week</option>
                            <option value="month">Last Month</option>
                            <option value="quarter">Last Quarter</option>
                            <option value="year">Last Year</option>
                            <option value="custom">Custom Range</option>
                        </select>
                        
                        {timeframe === 'custom' && (
                            <div className="flex space-x-2">
                                <input
                                    type="date"
                                    name="startDate"
                                    value={dateRange.startDate}
                                    onChange={handleDateChange}
                                    className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                <span className="self-center">to</span>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={dateRange.endDate}
                                    onChange={handleDateChange}
                                    className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={timeframeStats}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="period" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="pending" name="Pending" fill="#FFBB28" />
                                <Bar dataKey="in_progress" name="In Progress" fill="#0088FE" />
                                <Bar dataKey="resolved" name="Resolved" fill="#00C49F" />
                                <Bar dataKey="rejected" name="Rejected" fill="#FF8042" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Complaints by Status
                        </h3>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => [`${value} complaints`, 'Count']} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Complaints by Category
                        </h3>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryStats}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="count"
                                        nameKey="category"
                                    >
                                        {categoryStats.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => [`${value} complaints`, 'Count']} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OfficialReports;
