import React, { useState } from 'react';

const ClientSelector = ({ clients, selectedClient, onSelectClient, onNext, onCancel }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = clients.filter(client => 
    client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-700">Seleccionar Cliente</h3>
      <input
        type="text"
        placeholder="Buscar cliente..."
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-md p-2">
        {filteredClients.length > 0 ? (
          filteredClients.map(client => (
            <div 
              key={client.id}
              onClick={() => onSelectClient(client.id)}
              className={`p-3 border rounded-md cursor-pointer ${
                selectedClient === client.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="font-medium">{client.firstName} {client.lastName}</div>
              <div className="text-sm text-gray-500">{client.phone}</div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm p-2">No se encontraron clientes.</p>
        )}
      </div>
      <div className="flex justify-between pt-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          onClick={onNext}
          disabled={!selectedClient}
          className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
            selectedClient ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-300 cursor-not-allowed'
          }`}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default ClientSelector;