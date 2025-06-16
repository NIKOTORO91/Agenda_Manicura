import React, { useState } from 'react';
import ServiceForm from './ServiceForm';
import ServiceList from './ServiceList';

const ServiceManagement = ({ services, onAddService, onEditService, onDeleteService }) => {
  const [editingService, setEditingService] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleSave = (service) => {
    if (editingService) {
      onEditService({ ...editingService, ...service });
    } else {
      onAddService(service);
    }
    setEditingService(null);
    setShowForm(false);
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      {showForm ? (
        <ServiceForm 
          serviceToEdit={editingService} 
          onSave={handleSave} 
          onCancel={() => {
            setEditingService(null);
            setShowForm(false);
          }} 
        />
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Nuevo Servicio
        </button>
      )}
      <ServiceList 
        services={services} 
        onEdit={handleEdit}
        onDelete={onDeleteService}
      />
    </div>
  );
};

export default ServiceManagement;
// DONE