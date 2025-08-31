import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiClock, FiFileText, FiBook, FiCalendar, FiAward } from 'react-icons/fi';


const RecentlyAdded = () => {
  const [recentItems, setRecentItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRecentItems = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:3000/api/admin/recentlyAdded', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setRecentItems(response.data);
    } catch (err) {
      console.error('Error fetching recent items:', err);
      alert('Failed to fetch recent items. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentItems();
  }, []);

  const getIconForType = (type) => {
    switch (type) {
      case 'publication':
        return <FiBook className="text-blue-500 text-xl" />;
      case 'patent':
        return <FiAward className="text-green-500 text-xl" />;
      case 'conference':
        return <FiCalendar className="text-purple-500 text-xl" />;
      case 'event':
        return <FiCalendar className="text-orange-500 text-xl" />;
      default:
        return <FiFileText className="text-gray-500 text-xl" />;
    }
  };

  return (
    <div className="h-full px-4 md:px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <FiClock className="mr-2 text-indigo-600" />
          Recently Added
        </h2>
        <button 
          onClick={fetchRecentItems}
          className="text-sm bg-indigo-50 text-indigo-600 px-3 py-1 rounded-md hover:bg-indigo-100 transition-colors"
        >
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : recentItems.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <FiFileText className="mx-auto text-3xl text-gray-400 mb-3" />
          <p className="text-gray-500">No recent items found</p>
          <button 
            onClick={fetchRecentItems}
            className="mt-3 text-sm text-indigo-600 hover:text-indigo-800"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6 overflow-y-auto" style={{ maxHeight: '43vh' }}>
          {recentItems.map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              className=" bg-blue-50 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-indigo-200"
            >
              <div className="flex items-start">
                <div className="bg-indigo-50 p-3 rounded-xl mr-4 flex-shrink-0">
                  {getIconForType(item.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">{item.title}</h3>
                    <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full capitalize">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">{item.description}</p>
                  <div className="flex items-center mt-3 text-xs text-gray-500 gap-2 flex-wrap">
                    <span>{new Date(item.added_date).toLocaleDateString()}</span>
                    <span className="text-gray-300">•</span>
                    <span>{new Date(item.added_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentlyAdded;
