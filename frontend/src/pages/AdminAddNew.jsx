import React from 'react';
import { useParams } from 'react-router-dom';
import PatentsForm from '../components/PatentsForm';
import PublicationsForm from '../components/PublicationsForm';
import EventsForm from '../components/EventsForm';
import ConferencesForm from '../components/ConferencesForm';

const AdminAddNew = () => {
  const { type } = useParams();

  const renderForm = () => {
    switch (type) {
      case 'patents':
        return <PatentsForm />;
      case 'publications':
        return <PublicationsForm />;
      case 'events':
        return <EventsForm />;
      case 'conferences':
        return <ConferencesForm />;
      default:
        return <p>Invalid type</p>;
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 capitalize">Add New {type}</h2>
      {renderForm()}
    </div>
  );
};

export default AdminAddNew;
