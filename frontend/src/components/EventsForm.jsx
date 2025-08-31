import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrashIcon, PencilIcon, XCircleIcon } from '@heroicons/react/24/solid';

const EventForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location:'',
    date: '',
  });
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null);

  const fetchEvents = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/events/getEvents', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setEvents(res.data);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(
          `http://localhost:3000/api/events/update/${editId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        alert('Event updated successfully');
      } else {
        await axios.post(
          'http://localhost:3000/api/events/add',
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        alert('Event added successfully');
      }

      setFormData({ title: '', description: '',location:'', date: '' });
      setEditId(null);
      setError(null);
      fetchEvents();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save event');
      console.error('Error saving event:', err);
    }
  };

  const handleEdit = (event) => {
    setFormData({
      title: event.title,
      description: event.description,
      location: event.location,
      date: event.date.split('T')[0],
    });
    setEditId(event.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/events/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setEvents(events.filter((e) => e.id !== id));
      alert('Event deleted successfully');
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  };

  const cancelEdit = () => {
    setFormData({ title: '', description: '', date: '' });
    setEditId(null);
    setError(null);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {editId ? 'Update Event' : 'Add Event'}
          </h2>
          {editId && (
            <button type="button" onClick={cancelEdit} title="Cancel edit">
              <XCircleIcon className="h-6 w-6 text-red-500 hover:text-red-700" />
            </button>
          )}
        </div>
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
        type='text'
        value={formData.location}
        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        placeholder="Location"
        className="border border-gray-300 rounded p-2 mb-4 w-full"
        >
        </input>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="border border-gray-300 rounded p-2 mb-4 w-full"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {editId ? 'Update Event' : 'Add Event'}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>

      <div>
        <h2 className="text-xl font-semibold mb-4">Your Events</h2>
        {events.length === 0 ? (
          <p>No events found.</p>
        ) : (
          <ul className="space-y-4">
            {events.map((event) => (
              <li key={event.id} className="border p-4 rounded shadow relative">
                <button
                  onClick={() => handleDelete(event.id)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  title="Delete"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>

                <button
                  onClick={() => handleEdit(event)}
                  className="absolute bottom-2 right-2 text-blue-500 hover:text-blue-700"
                  title="Edit"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>

                <h3 className="font-bold">{event.title}</h3>
                <p><strong>Description:</strong> {event.description}</p>
                <p><strong>Location:</strong> {event.location}</p>
                <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EventForm;
