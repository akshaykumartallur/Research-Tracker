import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import UserData from '../components/UserData';
import PatentSearch from '../components/PatentSearch';

const UserPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    Patents: 0,
    Publications: 0,
    Conferences: 0,
    Events: 0
  });

  useEffect(() => {
    // Fetch user stats from API
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/user/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    
    fetchStats();
  }, []);

  const categories = [
    { 
      name: 'Patents', 
      icon: '🧪',
      key: 'patent_count',
      description: 'Manage your patent applications and intellectual property',
      bgColor: 'bg-blue-100'
    },
    { 
      name: 'Publications', 
      icon: '📚',
      key: 'publication_count',
      description: 'Track your research papers and publications',
      bgColor: 'bg-green-100'
    },
    { 
      name: 'Conferences', 
      icon: '🎤',
      key: 'conference_count',
      description: 'Organize your conference participations',
      bgColor: 'bg-purple-100'
    },
    { 
      name: 'Events', 
      icon: '📅',
      key: 'event_count',
      description: 'Manage research events and workshops',
      bgColor: 'bg-orange-100'
    }
  ];


  return (
    <>
    <div className="min-h-screen bg-gray-50 relative">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2072&q=80')] bg-cover bg-center opacity-20"></div>
      
      <div className="relative z-10">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">Welcome to Your Research Hub</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Centralized platform to manage all your research activities, from patents to publications
            </p>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {categories.map((category) => (
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
                    {stats[category.key] || 0} {stats[category.key] === 1 ? 'entry' : 'entries'}
                  </span>

                  <button
                    onClick={() => navigate(`/add${category.name.toLowerCase()}`)}
                    className="px-4 py-2 bg-white text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Add New
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <UserData />
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-bold">Research Tracker Pro</h3>
                <p className="text-gray-400 mt-1">Your complete research management solution</p>
              </div>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-white transition">Terms</a>
                <a href="#" className="text-gray-400 hover:text-white transition">Privacy</a>
                <a href="#" className="text-gray-400 hover:text-white transition">Contact</a>
              </div>
            </div>
            <div className="mt-6 text-center text-gray-400 text-sm">
              © {new Date().getFullYear()} Research Tracker Platform. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
    </>
  );
};

export default UserPage;