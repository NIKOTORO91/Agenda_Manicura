import React, { useState, useEffect } from 'react';
import ClientSelector from './ClientSelector';
import ServiceSelector from './ServiceSelector';

const AppointmentWizard = ({ 
  selectedSlot, 
  clients, 
  services, 
  onCreateAppointment, 
  onCancel,
  appointments // Necesitamos todas las citas para la validación
}) => {
  const [step, setStep] = useState(1);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [selectedServicesIds, setSelectedServicesIds] = useState([]);
  const [clientWarning, setClientWarning] = useState('');

  useEffect(() => {
    if (selectedClientId && appointments) {
      const clientPendingAppointments = appointments.filter(app => 
        app.clientId === selectedClientId && 
        app.status === 'Agendado'
      );

      if (clientPendingAppointments.length > 1) {
        const client = clients.find(c => c.id === selectedClientId);
        if (client) {
          setClientWarning(
            `El cliente ${client.firstName} ${client.lastName} tiene más de 1 Cita Agendada.`
          );
        }
      } else if (clientPendingAppointments.length === 1) {
        const client = clients.find(c => c.id === selectedClientId);
        const pendingApp = clientPendingAppointments[0];
        if (client && pendingApp) {
          setClientWarning(
            `El cliente ${client.firstName} ${client.lastName} tiene una cita agendada para el día ${pendingApp.date} y hora ${pendingApp.time}.`
          );
        }
      } else {
        setClientWarning('');
      }
    } else {
      setClientWarning('');
    }
  }, [selectedClientId, appointments, clients]);

  const calculateEndTime = () => {
    if (!selectedSlot || selectedServicesIds.length === 0) return '';
    
    const totalDuration = selectedServicesIds.reduce((total, serviceId) => {
      const service = services.find(s => s.id === serviceId);
      return total + (service ? service.duration : 0);
    }, 0);
    
    const [hours, minutes] = selectedSlot.time.split(':').map(Number);
    const startDate = new Date(selectedSlot.date);
    startDate.setHours(hours, minutes);
    
    const endDate = new Date(startDate.getTime() + totalDuration * 60000);
    return endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const calculateTotalPrice = () => {
    return selectedServicesIds.reduce((total, serviceId) => {
      const service = services.find(s => s.id === serviceId);
      return total + (service ? parseFloat(service.price) : 0);
    }, 0);
  };

  const handleCreateAppointment = () => {
    const client = clients.find(c => c.id === selectedClientId);
    const selectedServicesDetails = selectedServicesIds.map(id => services.find(s => s.id === id));

    onCreateAppointment({
      clientId: selectedClientId,
      clientName: client ? `${client.firstName} ${client.lastName}` : 'Cliente Desconocido',
      date: selectedSlot.date,
      time: selectedSlot.time,
      endTime: calculateEndTime(),
      services: selectedServicesIds,
      servicesDetails: selectedServicesDetails,
      totalPrice: calculateTotalPrice(),
      status: 'Agendado' // Estado inicial
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Cita para {selectedSlot.date} a las {selectedSlot.time}
        </h2>
        <p className="text-sm text-gray-500">
          Duración estimada: {calculateEndTime() ? `${selectedSlot.time} - ${calculateEndTime()}` : 'Selecciona servicios'}
        </p>
      </div>

      {clientWarning && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline"> {clientWarning}</span>
        </div>
      )}

      {step === 1 && (
        <ClientSelector 
          clients={clients}
          selectedClient={selectedClientId}
          onSelectClient={setSelectedClientId}
          onNext={() => selectedClientId && setStep(2)}
          onCancel={onCancel}
        />
      )}

      {step === 2 && (
        <ServiceSelector
          services={services}
          selectedServices={selectedServicesIds}
          onSelectServices={setSelectedServicesIds}
          onBack={() => setStep(1)}
          onSubmit={handleCreateAppointment}
          onCancel={onCancel}
        />
      )}
    </div>
  );
};

export default AppointmentWizard;
// DONE