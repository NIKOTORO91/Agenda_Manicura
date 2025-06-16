import React, { useState } from 'react';

const ServiceSelector = ({ services, selectedServices, onSelectServices, onBack, onSubmit, onCancel }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleService = (serviceId) => {
    onSelectServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId) 
        : [...prev, serviceId]
    );
  };

  const calculateTotal = () => {
    return selectedServices.reduce((total, serviceId) => {
      const service = services.find(s => s.id === serviceId);
      // Asegurarse de que el precio sea un número antes de sumar
      return total + (service ? parseFloat(service.price) : 0);
    }, 0);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-700">Seleccionar Servicios</h3>
      <input
        type="text"
        placeholder="Buscar servicio..."
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-md p-2">
        {filteredServices.length > 0 ? (
          filteredServices.map(service => (
            <div 
              key={service.id}
              onClick={() => toggleService(service.id)}
              className={`p-3 border rounded-md cursor-pointer ${
                selectedServices.includes(service.id) 
                  ? 'border-indigo-500 bg-indigo-50' 
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex justify-between">
                <span className="font-medium">{service.name}</span>
                <span>${service.price}</span>
              </div>
              <div className="text-sm text-gray-500">{service.duration} minutos</div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm p-2">No se encontraron servicios.</p>
        )}
      </div>
      <div className="pt-2 border-t">
        <div className="flex justify-between font-medium">
          <span>Total:</span>
          <span>${calculateTotal().toFixed(2)}</span> {/* Formatear a 2 decimales */}
        </div>
      </div>
      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Atrás
        </button>
        <div className="space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={onSubmit}
            disabled={selectedServices.length === 0}
            className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
              selectedServices.length > 0 
                ? 'bg-indigo-600 hover:bg-indigo-700' 
                : 'bg-indigo-300 cursor-not-allowed'
            }`}
          >
            Confirmar Cita
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceSelector;
// DONE