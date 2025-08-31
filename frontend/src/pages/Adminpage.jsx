import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import Navbar from '../components/Navbar';
import TopContributors from '../components/TopContributors';
import RecentlyAdded from '../components/RecentlyAdded';

const AdminPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    patents: 0,
    publications: 0,
    conferences: 0,
    events: 0
  });

  const categories = [
    { 
      name: 'Patents', 
      icon: '🧪',
      description: 'Manage all patent applications',
      bgColor: 'bg-blue-100'
    },
    { 
      name: 'Publications', 
      icon: '📚',
      description: 'Oversee research publications',
      bgColor: 'bg-green-100'
    },
    { 
      name: 'Conferences', 
      icon: '🎤',
      description: 'Administer conference records',
      bgColor: 'bg-purple-100'
    },
    { 
      name: 'Events', 
      icon: '📅',
      description: 'Manage research events',
      bgColor: 'bg-orange-100'
    }
  ];

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3000/api/admin/entryCounts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 relative">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2072&q=80')] bg-cover bg-center opacity-10"></div>
      
      <div className="relative z-10">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive management of all research activities and user submissions
            </p>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {categories.map((category) => {
              const key = category.name.toLowerCase();
              return (
                <div 
                  key={category.name} 
                  className={`${category.bgColor} p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300`}
                >
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3">{category.icon}</span>
                    <h3 className="text-2xl font-semibold text-gray-800">{category.name}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-700">
                      {stats[key] || 0} entries
                    </span>
                    <div className="space-x-2">
                      <button
                        onClick={() => navigate(`/adminViewAll/${key}`)}
                        className="px-3 py-1 bg-white text-gray-800 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      >
                        View All
                      </button>
                      <button
                        onClick={() => navigate(`/adminAddNew/${key}`)}
                        className="px-3 py-1 bg-white text-gray-800 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      >
                        Add New
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Admin Tools and Recently Added Sections - Side by Side */}
          <div className="flex flex-col lg:flex-row gap-6 mb-16">
            {/* Admin Tools Section - Left Side (2/3 width on large screens) */}
            <div className="flex-1 lg:flex-[2]">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-full">
                <div className="p-6 md:p-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      Administration Tools
                    </span>
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 md:p-6 rounded-xl border border-blue-100">
                      <h3 className="text-lg md:text-xl font-semibold text-blue-800 mb-3 md:mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Admin Actions
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: 'Manage Users', path: '/admin/users', icon: '👥' },
                          { label: 'View Reports', path: '/admin/reports', icon: '📊' },
                          { label: 'Pending Approvals', path: '/admin/approvals', icon: '⏳' },
                          { label: 'System Settings', path: '/admin/settings', icon: '⚙️' }
                        ].map((item) => (
                          <motion.button
                            key={item.path}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate(item.path)}
                            className="bg-white p-2 md:p-3 rounded-lg shadow-xs hover:shadow-sm transition-all 
                                      border border-gray-100 hover:border-blue-200 flex flex-col items-center"
                          >
                            <span className="text-lg mb-1">{item.icon}</span>
                            <span className="text-sm font-medium">{item.label}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 md:p-6 rounded-xl border border-green-100">
                      <h3 className="text-lg md:text-xl font-semibold text-green-800 mb-3 md:mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Admin Activity
                      </h3>
                      <div className="space-y-3">
                        {[
                          "Manage patents, events, conferences, publications",
                          "Manage research reports",
                          "New user registration",
                          "Content moderation"
                        ].map((text, index) => (
                          <div key={index} className="flex items-start">
                            <div className="bg-green-100 p-1 rounded-full mr-3 mt-0.5">
                              <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <p className="text-gray-700 text-sm md:text-base">{text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            
            <div className="flex-1 lg:flex-[1]">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-full">
                <RecentlyAdded />
              </div>
            </div>
          </div>

       
        <div>
          <TopContributors />
        </div>
      </div>
      <footer className="bg-gray-900 text-white py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-bold">Research Tracker Admin</h3>
                <p className="text-gray-400 mt-1">Administrative control panel</p>
              </div>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-white transition">Admin Guide</a>
                <a href="#" className="text-gray-400 hover:text-white transition">System Logs</a>
                <a href="#" className="text-gray-400 hover:text-white transition">Support</a>
              </div>
            </div>
            <div className="mt-6 text-center text-gray-400 text-sm">
              © {new Date().getFullYear()} Research Tracker Platform. Admin version.
            </div>
          </div>
        </footer>
    </div>
  </div>
  );
}

export default AdminPage;

// 1. Patent Tracking & IP Management
// Patent Database Integration (WIPO, USPTO, EPO) – Auto-fill patent details.

// Patent Status Tracker (Filed, Published, Granted, Expired).

// Deadline Alerts (Renewals, oppositions, annuities).

// Inventor & Assignee Management (Track contributors & ownership).

// Prior Art Search Tool (Link to related patents/papers).

// Claim & Diagram Storage (Store key patent sections).