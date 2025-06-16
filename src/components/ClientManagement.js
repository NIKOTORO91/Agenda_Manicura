import React, { useState } from 'react';
import ClientForm from './ClientForm';
import ClientList from './ClientList';

const ClientManagement = ({ clients, onAddClient, onEditClient, onDeleteClient }) => {
  const [editingClient, setEditingClient] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleSave = (client) => {
    if (editingClient) {
      onEditClient({ ...editingClient, ...client });
    } else {
      onAddClient(client);
    }
    setEditingClient(null);
    setShowForm(false);
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      {showForm ? (
        <ClientForm 
          clientToEdit={editingClient} 
          onSave={handleSave} 
          onCancel={() => {
            setEditingClient(null);
            setShowForm(false);
          }} 
        />
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Nuevo Cliente
        </button>
      )}
      <ClientList 
        clients={clients} 
        onEdit={handleEdit}
        onDelete={onDeleteClient}
      />
    </div>
  );
};

export default ClientManagement;