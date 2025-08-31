import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminAddNewCard = ({ title, count }) => {
  const navigate = useNavigate();
  const type = title.toLowerCase();

  return (
    <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition-all border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
          {count ?? 0} entries
        </span>
      </div>
      <button
        onClick={() => navigate(`/adminAddNew/${type}`)}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
      >
        Add New {title}
      </button>
    </div>
  );
};

export default AdminAddNewCard;
