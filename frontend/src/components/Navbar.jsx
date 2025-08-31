import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser } from 'react-icons/fi'; // icon for avatar

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // or use your auth clearing logic
    navigate('/login'); // redirect to login
  };

  return (
    <nav className="bg-green-700 text-white px-6 py-4 flex justify-between items-center shadow-md relative">
      <h1 className="text-xl font-bold">Research Tracker</h1>
      
      <div className="flex items-center space-x-6">
        <Link to="/addpatents" className="hover:underline">Patents</Link>
        <Link to="/addevents" className="hover:underline">Events</Link>
        <Link to="/addpublications" className="hover:underline">Publications</Link>
        <Link to="/addconferences" className="hover:underline">Conferences</Link>

        {/* Profile Icon */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-10 h-10 bg-white rounded-full text-green-700 flex items-center justify-center focus:outline-none hover:bg-green-100"
          >
            <FiUser size={20} />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-lg shadow-lg z-10">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 hover:bg-green-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
