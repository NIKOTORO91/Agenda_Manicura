import React, { useState } from 'react';
import ServiceSelector from './ServiceSelector';

const AppointmentForm = ({ clients, services, onCreate }) => {
  const [appointment, setAppointment] = useState({
    clientId: '',
    date: '',
    time: '',
    services: [],
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppointment(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceSelect = (selectedServices) => {
    setAppointment(prev => ({ ...prev, services: selectedServices }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(appointment);
    setAppointment({
      clientId: '',
      date: '',
      time: '',
      services: [],
      notes: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800">Nueva Cita</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700">Cliente</label>
        <select
          name="clientId"
          value={appointment.clientId}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        >
          <option value="">Seleccionar cliente</option>
          {clients.map(client => (
            <option key={client.id} value={client.id}>
              {client.firstName} {client.lastName}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha</label>
          <input
            type="date"
            name="date"
            value={appointment.date}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Hora</label>
          <input
            type="time"
            name="time"
            value={appointment.time}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
      </div>
      <ServiceSelector services={services} onSelect={handleServiceSelect} />
      <div>
        <label className="block text-sm font-medium text-gray-700">Notas</label>
        <textarea
          name="notes"
          value={appointment.notes}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Agendar Cita
      </button>
    </form>
  );
};

export default AppointmentForm;

// DONE