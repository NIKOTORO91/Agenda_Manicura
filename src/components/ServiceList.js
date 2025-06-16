import React, { useState } from 'react';

const ServiceList = ({ services, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Servicios Disponibles</h2>
        <input
          type="text"
          placeholder="Buscar servicio..."
          className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {filteredServices.length > 0 ? (
          filteredServices.map(service => (
            <div key={service.id} className="p-4 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium text-gray-900">{service.name}</h3>
                <p className="text-sm text-gray-500">
                  ${service.price} - {service.duration} minutos
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(service)}
                  className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(service.id)}
                  className="text-red-600 hover:text-red-900 text-sm font-medium"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="p-4 text-gray-500">No se encontraron servicios.</p>
        )}
      </div>
    </div>
  );
};

export default ServiceList;