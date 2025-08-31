import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/solid';

const ConferencesForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    conference_date: '',
  });
  const [conferences, setConferences] = useState([]);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null);

  const fetchConferences = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/conferences/getConferences', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setConferences(res.data);
    } catch (err) {
      console.error('Error fetching conferences:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(
          `http://localhost:3000/api/conferences/update/${editId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        alert('Conference updated successfully');
      } else {
        await axios.post(
          'http://localhost:3000/api/conferences/add',
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        alert('Conference added successfully');
      }

      setFormData({ title: '', description: '',location:'', conference_date: '' });
      setEditId(null);
      setError(null);
      fetchConferences();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save conference');
      console.error('Error saving conference:', err);
    }
  };

  const handleEdit = (conf) => {
    setFormData({
      title: conf.title,
      description: conf.description,
      location: conf.location,
      conference_date: conf.conference_date.split('T')[0],
    });
    setEditId(conf.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/conferences/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setConferences(conferences.filter((c) => c.id !== id));
      alert('Conference deleted successfully');
    } catch (err) {
      console.error('Error deleting conference:', err);
    }
  };

  useEffect(() => {
    fetchConferences();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editId ? 'Update Conference' : 'Add Conference'}
        </h2>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Title"
          className="border border-gray-300 rounded p-2 mb-4 w-full"
          required
        />
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Description"
          className="border border-gray-300 rounded p-2 mb-4 w-full"
          rows="3"
          required
        ></textarea>
        <input
        type="text"
        value={formData.location}
        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        placeholder="Location"
        className="border border-gray-300 rounded p-2 mb-4 w-full"
        required
        />
        <input
          type="date"
          value={formData.conference_date}
          onChange={(e) => setFormData({ ...formData, conference_date: e.target.value })}
          className="border border-gray-300 rounded p-2 mb-4 w-full"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editId ? 'Update Conference' : 'Add Conference'}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>

      <div>
        <h2 className="text-xl font-semibold mb-4">Your Conferences</h2>
        {conferences.length === 0 ? (
          <p>No conferences found.</p>
        ) : (
          <ul className="space-y-4">
            {conferences.map((conf) => (
              <li key={conf.id} className="border p-4 rounded shadow relative">
                <button
                  onClick={() => handleDelete(conf.id)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  title="Delete"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>

                <button
                  onClick={() => handleEdit(conf)}
                  className="absolute bottom-2 right-2 text-blue-500 hover:text-blue-700"
                  title="Edit"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>

                <h3 className="font-bold">{conf.title}</h3>
                <p><strong>Description:</strong> {conf.description}</p>
                <p><strong>Location:</strong> {conf.location}</p>
                <p><strong>Date:</strong> {new Date(conf.conference_date).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ConferencesForm;
