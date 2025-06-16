import React, { useState } from 'react';

const AppointmentSearch = ({ appointments, clients, services, onSelectAppointment }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term.length > 2) { // Buscar solo si el término tiene al menos 3 caracteres
      const filteredAppointments = appointments.filter(app => {
        // Asegurarse de que app.servicesDetails exista antes de intentar mapear
        const servicesNames = app.servicesDetails ? app.servicesDetails.map(s => s.name.toLowerCase()).join(' ') : '';

        return (app.clientName && app.clientName.toLowerCase().includes(term)) || 
               servicesNames.includes(term) || 
               (app.date && app.date.includes(term));
      });
      setSearchResults(filteredAppointments);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Buscar Citas</h2>
      <input
        type="text"
        placeholder="Buscar por cliente, servicio o fecha..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />

      {searchResults.length > 0 && (
        <div className="mt-4 border-t border-gray-200 pt-4 max-h-60 overflow-y-auto">
          <h3 className="font-medium text-gray-700 mb-2">Resultados:</h3>
          <ul className="space-y-2">
            {searchResults.map(app => (
              <li 
                key={app.id} 
                className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
                onClick={() => onSelectAppointment(app.id)}
              >
                <p className="font-medium">{app.clientName}</p>
                <p className="text-sm text-gray-600">{app.date} {app.time} - {app.endTime}</p>
                <p className="text-xs text-gray-500">Servicios: {app.servicesDetails ? app.servicesDetails.map(s => s.name).join(', ') : 'N/A'}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      {searchTerm.length > 2 && searchResults.length === 0 && (
        <p className="mt-4 text-gray-500 text-sm">No se encontraron citas.</p>
      )}
    </div>
  );
};

export default AppointmentSearch;
// DONE