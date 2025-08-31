import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TopContributors = () => {
  const [contributors, setContributors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/api/admin/topContributors', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setContributors(res.data);
      } catch (err) {
        console.error('Error fetching top contributors:', err);
      }
    };

    fetchContributors();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden m-2">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-2">🏆</span> Top Contributors
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {contributors.map((contributor, index) => (
            <div
              key={index}
              className="text-center p-4 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow"
            >
              <img
                src="https://imgs.search.brave.com/McDN2pl6jexuNONeYLwPbweBYsImjQ0KffCFZEkANr0/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/cGl4YWJheS5jb20v/cGhvdG8vMjAxNS8w/Ny8xNy8yMi80My9z/dHVkZW50LTg0OTgy/NV82NDAuanBn"
                alt="Avatar"
                className="w-20 h-20 mx-auto rounded-full mb-3 object-cover border"
              />
              <h3 className="font-semibold text-gray-800">{contributor.name}</h3>
              <p className="text-sm text-gray-600">
                {contributor.contributionCount} contributions
              </p>
              <button
                onClick={() =>
                  navigate(`/admin/users/${contributor.name.replace(/\s+/g, '-').toLowerCase()}`)
                }
                className="mt-3 text-xs bg-white px-3 py-1 rounded-full shadow-sm hover:bg-gray-100"
              >
                View Profile
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopContributors;
