import React, { useState, useEffect } from 'react';
import ClientSelector from './ClientSelector';
import ServiceSelector from './ServiceSelector';
import Modal from './Modal'; // Importar el componente Modal

const AppointmentEditor = ({ 
  appointment, 
  clients, 
  services, 
  onUpdateAppointment, 
  onDeleteAppointment, 
  onCancel,
  appointments // Necesitamos todas las citas para la validación
}) => {
  const [currentAppointment, setCurrentAppointment] = useState(appointment);
  const [selectedClientId, setSelectedClientId] = useState(appointment.clientId);
  const [selectedServicesIds, setSelectedServicesIds] = useState(appointment.services);
  const [status, setStatus] = useState(appointment.status || 'Agendado');
  const [selectedDate, setSelectedDate] = useState(appointment.date);
  const [selectedTime, setSelectedTime] = useState(appointment.time);
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal

  useEffect(() => {
    if (appointment) {
      setCurrentAppointment(appointment);
      setSelectedClientId(appointment.clientId);
      setSelectedServicesIds(appointment.services);
      setStatus(appointment.status || 'Agendado');
      setSelectedDate(appointment.date);
      setSelectedTime(appointment.time);
    }
  }, [appointment]);

  const calculateEndTime = (date, time, currentServicesIds) => {
    if (!date || !time || currentServicesIds.length === 0) return '';
    
    const totalDuration = currentServicesIds.reduce((total, serviceId) => {
      const service = services.find(s => s.id === serviceId);
      return total + (service ? service.duration : 0);
    }, 0);
    
    const [hours, minutes] = time.split(':').map(Number);
    const startDateObj = new Date(date);
    startDateObj.setHours(hours, minutes);
    
    const endDateObj = new Date(startDateObj.getTime() + totalDuration * 60000);
    return endDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const calculateTotalPrice = (currentServicesIds) => {
    return currentServicesIds.reduce((total, serviceId) => {
      const service = services.find(s => s.id === serviceId);
      return total + (service ? parseFloat(service.price) : 0);
    }, 0);
  };

  const validateAppointmentOverlap = (newDate, newTime, newEndTime, currentAppointmentId) => {
    const newStartDateTime = new Date(`${newDate}T${newTime}`);
    const newEndDateTime = new Date(`${newDate}T${newEndTime}`);

    for (const app of appointments) {
      // Ignorar la cita que estamos editando
      if (app.id === currentAppointmentId) continue;

      const existingStartDateTime = new Date(`${app.date}T${app.time}`);
      const existingEndDateTime = new Date(`${app.date}T${app.endTime}`);

      // Comprobar si hay solapamiento
      if (
        (newStartDateTime < existingEndDateTime && newEndDateTime > existingStartDateTime)
      ) {
        return false; // Hay solapamiento
      }
    }
    return true; // No hay solapamiento
  };

  const performUpdate = (newStatus = status) => {
    setErrorMessage(''); // Limpiar mensajes de error previos

    const newCalculatedEndTime = calculateEndTime(selectedDate, selectedTime, selectedServicesIds);

    if (!validateAppointmentOverlap(selectedDate, selectedTime, newCalculatedEndTime, currentAppointment.id)) {
      setErrorMessage('¡Error! La fecha y hora seleccionadas se solapan con otra cita existente.');
      setIsModalOpen(true); // Abrir modal
      return;
    }

    const client = clients.find(c => c.id === selectedClientId);
    const updatedServicesDetails = selectedServicesIds.map(id => services.find(s => s.id === id));

    const updatedAppointment = {
      ...currentAppointment,
      clientId: selectedClientId,
      clientName: client ? `${client.firstName} ${client.lastName}` : 'Cliente Desconocido',
      date: selectedDate, // Actualizar fecha
      time: selectedTime, // Actualizar hora
      services: selectedServicesIds,
      servicesDetails: updatedServicesDetails,
      totalPrice: calculateTotalPrice(selectedServicesIds),
      endTime: newCalculatedEndTime, // Actualizar hora de fin
      status: newStatus // Usar el nuevo status
    };
    onUpdateAppointment(updatedAppointment);
  };

  const handleMarkAsAttended = () => {
    setStatus('Atendido'); // Actualizar el estado local
    performUpdate('Atendido'); // Ejecutar la actualización con el nuevo estado
  };

  const handleDelete = () => {
    if (status === 'Atendido') {
      setErrorMessage('No se puede eliminar una cita que ya ha sido Atendida.');
      setIsModalOpen(true); // Abrir modal
      return;
    }
    onDeleteAppointment(currentAppointment.id);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Editar Cita</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Hora Inicio</label>
          <input
            type="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600">Hora Fin Estimada: <span className="font-medium">{calculateEndTime(selectedDate, selectedTime, selectedServicesIds)}</span></p>
        <p className="text-sm text-gray-600">Costo Total Estimado: <span className="font-medium">${calculateTotalPrice(selectedServicesIds).toFixed(2)}</span></p>
        <p className="text-sm text-gray-600">Estado: <span className="font-medium">{status}</span></p>
      </div>

      {status === 'Agendado' && (
        <button
          onClick={handleMarkAsAttended}
          className="mb-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Marcar como Atendido
        </button>
      )}

      <div className="mb-4">
        <ClientSelector 
          clients={clients}
          selectedClient={selectedClientId}
          onSelectClient={setSelectedClientId}
          onNext={() => {}}
          onCancel={() => {}}
        />
      </div>

      <div className="mb-6">
        <ServiceSelector
          services={services}
          selectedServices={selectedServicesIds}
          onSelectServices={setSelectedServicesIds}
          onBack={() => {}}
          onSubmit={() => {}}
          onCancel={() => {}}
        />
      </div>

      <div className="flex justify-between space-x-3">
        <button
          onClick={handleDelete}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Eliminar Cita
        </button>
        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancelar
          </button>
          <button
            onClick={() => performUpdate()} // Llamar a performUpdate sin argumentos para usar el estado actual
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Actualizar Cita
          </button>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Error de Validación">
        <p>{errorMessage}</p>
      </Modal>
    </div>
  );
};

export default AppointmentEditor;
// DONE