import React, { useState, useEffect } from 'react';

const ClientForm = ({ clientToEdit, onSave, onCancel }) => {
  const [client, setClient] = useState(clientToEdit || {
    firstName: '',
    lastName: '',
    phone: '',
    mapLink: '',
    whatsappLink: ''
  });

  // Sincronizar el estado local con clientToEdit cuando cambie
  useEffect(() => {
    if (clientToEdit) {
      setClient(clientToEdit);
    }
  }, [clientToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient(prev => {
      const updatedClient = { ...prev, [name]: value };
      // Si el campo que cambia es el teléfono, actualiza el whatsappLink
      if (name === 'phone') {
        updatedClient.whatsappLink = `https://wa.me/${value.replace(/\D/g, '')}`;
      }
      return updatedClient;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(client);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800">
        {clientToEdit ? 'Editar Cliente' : 'Nuevo Cliente'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            name="firstName"
            value={client.firstName}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Apellidos</label>
          <input
            type="text"
            name="lastName"
            value={client.lastName}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Teléfono</label>
        <input
          type="tel"
          name="phone"
          value={client.phone}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Link Google Maps</label>
        <input
          type="url"
          name="mapLink"
          value={client.mapLink}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Link WhatsApp</label>
        <input
          type="url"
          name="whatsappLink"
          value={client.whatsappLink}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          readOnly // Hacerlo de solo lectura ya que se genera automáticamente
        />
      </div>
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Guardar
        </button>
      </div>
    </form>
  );
};

export default ClientForm;
// DONE