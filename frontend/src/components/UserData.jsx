import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserData = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/api/user/entries', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEntries(res.data);
      } catch (err) {
        console.error('Error fetching entries:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2072&q=80')] bg-cover bg-center opacity-20"></div>
      <div className="relative z-10 flex justify-center items-center min-h-screen">
        <div className="text-2xl font-semibold text-gray-700">Loading your research entries...</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2072&q=80')] bg-cover bg-center opacity-20"></div>
      
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl shadow-xl p-6 backdrop-blur-sm bg-opacity-90">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2 text-center">Your Research Entries</h2>
            
            {entries.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">No entries found. Start by adding your research work!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">SI NO</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Type</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Title</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Description</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {entries.map((entry, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            entry.type === 'Patent' ? 'bg-blue-100 text-blue-800' :
                            entry.type === 'Publication' ? 'bg-green-100 text-green-800' :
                            entry.type === 'Conference' ? 'bg-purple-100 text-purple-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {entry.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entry.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{entry.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(entry.entry_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserData;