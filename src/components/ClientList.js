import React, { useState } from 'react';

const ClientList = ({ clients, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = clients.filter(client => 
    client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Clientes Registrados</h2>
        <input
          type="text"
          placeholder="Buscar cliente..."
          className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {filteredClients.length > 0 ? (
          filteredClients.map(client => (
            <div key={client.id} className="p-4 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium text-gray-900">{client.firstName} {client.lastName}</h3>
                <p className="text-sm text-gray-500">{client.phone}</p>
                <div className="mt-2 flex space-x-2">
                  {client.mapLink && (
                    <a
                      href={client.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded hover:bg-blue-200"
                    >
                      Ver Mapa
                    </a>
                  )}
                  {client.phone && ( // Usar client.phone para el enlace de WhatsApp
                    <a
                      href={`https://wa.me/${client.phone.replace(/\D/g, '')}`} // Limpiar el número de teléfono
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs bg-green-100 text-green-800 px-2.5 py-0.5 rounded hover:bg-green-200"
                    >
                      WhatsApp
                    </a>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(client)}
                  className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(client.id)}
                  className="text-red-600 hover:text-red-900 text-sm font-medium"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="p-4 text-gray-500">No se encontraron clientes.</p>
        )}
      </div>
    </div>
  );
};

export default ClientList;
// DONE