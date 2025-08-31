import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/solid';

const PublicationsForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    description: '',
    date: '',
  });

  const [publications, setPublications] = useState([]);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null); // For update mode

  const fetchPublications = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/publications/getPublications', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setPublications(res.data);
    } catch (err) {
      console.log('Error in fetching publications:', err);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: formData.title,
      authors: formData.authors,
      description: formData.description,
      date: formData.date,
    };

    try {
      if (editingId) {
        // Update mode
        await axios.put(`http://localhost:3000/api/publications/update/${editingId}`, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        alert('Publication updated successfully');
      } else {
        // Add mode
        await axios.post('http://localhost:3000/api/publications/add', payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        alert('Publication added successfully');
      }

      setFormData({ title: '', authors: '', description: '', date: '' });
      setEditingId(null);
      setError(null);
      fetchPublications();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      console.log('Error in saving publication:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this publication?')) return;

    try {
      await axios.delete(`http://localhost:3000/api/publications/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setPublications(publications.filter((pub) => pub.id !== id));
      alert('Publication deleted successfully');
    } catch (err) {
      console.log('Error in deleting publication:', err);
      setError('Failed to delete publication');
    }
  };

  const handleEdit = (pub) => {
    setEditingId(pub.id);
    setFormData({
      title: pub.title,
      authors: pub.authors,
      description: pub.description,
      date: pub.published_date.split('T')[0], // Format date
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ title: '', authors: '', description: '', date: '' });
    setError(null);
  };

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'Edit Publication' : 'Add New Publication'}
        </h2>

        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Title"
          className="border-2 border-gray-300 rounded-md p-2 mb-4 w-full"
          required
        />
        <input
          type="text"
          value={formData.authors}
          onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
          placeholder="Authors"
          className="border-2 border-gray-300 rounded-md p-2 mb-4 w-full"
          required
        />
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Description"
          className="border-2 border-gray-300 rounded-md p-2 mb-4 w-full"
          rows="4"
          required
        ></textarea>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="border-2 border-gray-300 rounded-md p-2 mb-4 w-full"
          required
        />

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {editingId ? 'Update Publication' : 'Add Publication'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>

      <div>
        <h2 className="text-xl font-semibold mb-4">Your Publications</h2>
        {publications.length === 0 ? (
          <p>No publications found.</p>
        ) : (
          <ul className="space-y-4">
            {publications.map((pub) => (
              <li key={pub.id} className="relative border p-4 rounded shadow">
                <button
                  onClick={() => handleDelete(pub.id)}
                  className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                  title="Delete Publication"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
                <h3 className="font-bold text-lg">{pub.title}</h3>
                <p><strong>Authors:</strong> {pub.authors}</p>
                <p><strong>Description:</strong> {pub.description}</p>
                <p><strong>Date:</strong> {new Date(pub.published_date).toLocaleDateString()}</p>

                <button
                  onClick={() => handleEdit(pub)}
                  className="absolute top-25 right-2 text-blue-600 hover:text-blue-800"
                  title="Edit Publication"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PublicationsForm;
