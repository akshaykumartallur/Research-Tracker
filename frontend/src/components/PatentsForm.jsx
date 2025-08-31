import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/solid';

const PatentsForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [patents, setPatents] = useState([]);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null); // null = not editing

  const fetchPatents = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/patents/getPatent', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setPatents(res.data);
    } catch (err) {
      console.log('Error in fetching patents:', err);
      setError('Failed to fetch patents');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title?.trim() || !description?.trim() || !date?.trim()) {
      setError('All fields are required');
      return;
    }

    try {
      if (editingId) {
        // Edit mode
        await axios.put(
          `http://localhost:3000/api/patents/update/${editingId}`,
          { title, description, date },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        setPatents(
          patents.map((patent) =>
            patent.id === editingId ? { ...patent, title, description, date } : patent
          )
        );
        alert('Patent updated successfully');
      } else {
        // Add mode
        const res = await axios.post(
          'http://localhost:3000/api/patents/add',
          { title, description, date },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setPatents([...patents, { id: res.data.patentId, title, description, date }]);
        alert('Patent added successfully');
      }

      // Reset form
      setTitle('');
      setDescription('');
      setDate('');
      setEditingId(null);
      setError('');
    } catch (err) {
      console.log('Error in saving patent:', err);
      setError('Failed to save patent');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this patent?')) return;

    try {
      await axios.delete(`http://localhost:3000/api/patents/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setPatents(patents.filter((patent) => patent.id !== id));
      alert('Patent deleted successfully');
    } catch (err) {
      console.log('Error in deleting patent:', err);
      setError('Failed to delete patent');
    }
  };

  const handleEdit = (patent) => {
    setEditingId(patent.id);
    setTitle(patent.title || '');
    setDescription(patent.description || '');
    setDate(patent.date ? patent.date.split('T')[0] : '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setDate('');
    setError('');
  };

  useEffect(() => {
    fetchPatents();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Patent Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {editingId ? 'Edit Patent' : 'Add New Patent'}
        </h2>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter patent title"
          className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
          required
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter patent description"
          className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 resize-y focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
          rows={4}
          required
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
          required
        />

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300"
          >
            {editingId ? 'Update Patent' : 'Add Patent'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="bg-gray-400 text-white px-6 py-3 rounded-md hover:bg-gray-500 transition duration-300"
            >
              Cancel
            </button>
          )}
        </div>

        {error && <p className="text-red-600 mt-2">{error}</p>}
      </form>

      {/* Patent Cards */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patents.map((patent) => (
          <div
            key={patent.id}
            className="relative bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-200 transform hover:scale-105"
          >
            <button
              onClick={() => handleDelete(patent.id)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              title="Delete Patent"
            >
              <TrashIcon className="h-6 w-6" />
            </button>

            <button
              onClick={() => handleEdit(patent)}
              className="absolute top-12 right-2 text-blue-500 hover:text-blue-700 mt-10"
              title="Edit Patent"
            >
              <PencilIcon className="h-6 w-6" />
            </button>

            <h3 className="text-xl font-semibold text-gray-800 mb-2">{patent.title}</h3>
            <p className="text-gray-600 text-sm">{patent.description}</p>
            <p className="text-gray-500 text-xs mt-2">
              Date: {new Date(patent.date).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatentsForm;
