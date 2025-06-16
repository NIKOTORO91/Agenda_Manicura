import React, { useState, useEffect } from 'react';
import clientsData from './mock/clients';
import servicesData from './mock/services';
import appointmentsData from './mock/appointments';
import CalendarView from './components/CalendarView';
import ClientManagement from './components/ClientManagement';
import ServiceManagement from './components/ServiceManagement';

const App = () => {
  // Inicializar estados con datos de localStorage o mocks si no hay nada
  const [clients, setClients] = useState(() => {
    const savedClients = localStorage.getItem('nailSchedulerClients');
    return savedClients ? JSON.parse(savedClients) : clientsData;
  });
  const [services, setServices] = useState(() => {
    const savedServices = localStorage.getItem('nailSchedulerServices');
    return savedServices ? JSON.parse(savedServices) : servicesData;
  });
  const [appointments, setAppointments] = useState(() => {
    const savedAppointments = localStorage.getItem('nailSchedulerAppointments');
    return savedAppointments ? JSON.parse(savedAppointments) : appointmentsData;
  });

  const [currentView, setCurrentView] = useState('calendar');

  // Guardar datos en localStorage cada vez que cambian
  useEffect(() => {
    localStorage.setItem('nailSchedulerClients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('nailSchedulerServices', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('nailSchedulerAppointments', JSON.stringify(appointments));
  }, [appointments]);

  const handleAddClient = (newClient) => {
    const clientWithId = { ...newClient, id: Date.now() };
    setClients(prevClients => [...prevClients, clientWithId]);
  };

  const handleEditClient = (updatedClient) => {
    setClients(prevClients => prevClients.map(c => c.id === updatedClient.id ? updatedClient : c));
  };

  const handleDeleteClient = (clientId) => {
    setClients(prevClients => prevClients.filter(c => c.id !== clientId));
    setAppointments(prevAppointments => prevAppointments.filter(a => a.clientId !== clientId));
  };

  const handleAddService = (newService) => {
    const serviceWithId = { ...newService, id: Date.now() };
    setServices(prevServices => [...prevServices, serviceWithId]);
  };

  const handleEditService = (updatedService) => {
    setServices(prevServices => prevServices.map(s => s.id === updatedService.id ? updatedService : s));
  };

  const handleDeleteService = (serviceId) => {
    setServices(prevServices => prevServices.filter(s => s.id !== serviceId));
    setAppointments(prevAppointments => prevAppointments.filter(a => !a.services.includes(serviceId)));
  };

  const handleAddAppointment = (newAppointment) => {
    const appointmentWithId = {
      ...newAppointment,
      id: Date.now(),
      date: new Date(newAppointment.date).toISOString().split('T')[0]
    };
    setAppointments(prevAppointments => [...prevAppointments, appointmentWithId]);
  };

  const handleUpdateAppointment = (updatedAppointment) => {
    setAppointments(prevAppointments => prevAppointments.map(app => app.id === updatedAppointment.id ? updatedAppointment : app));
  };

  const handleDeleteAppointment = (appointmentId) => {
    setAppointments(prevAppointments => prevAppointments.filter(app => app.id !== appointmentId));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">NailScheduler Pro</h1>
          <nav className="flex space-x-4">
            <button
              onClick={() => setCurrentView('calendar')}
              className={`px-3 py-2 rounded-md ${currentView === 'calendar' ? 'bg-indigo-800' : 'hover:bg-indigo-700'}`}
            >
              Calendario
            </button>
            <button
              onClick={() => setCurrentView('clients')}
              className={`px-3 py-2 rounded-md ${currentView === 'clients' ? 'bg-indigo-800' : 'hover:bg-indigo-700'}`}
            >
              Clientes
            </button>
            <button
              onClick={() => setCurrentView('services')}
              className={`px-3 py-2 rounded-md ${currentView === 'services' ? 'bg-indigo-800' : 'hover:bg-indigo-700'}`}
            >
              Servicios
            </button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-4 space-y-6">
        {currentView === 'calendar' && (
          <CalendarView
            appointments={appointments}
            clients={clients}
            services={services}
            onCreateAppointment={handleAddAppointment}
            onUpdateAppointment={handleUpdateAppointment}
            onDeleteAppointment={handleDeleteAppointment}
          />
        )}

        {currentView === 'clients' && (
          <ClientManagement
            clients={clients}
            onAddClient={handleAddClient}
            onEditClient={handleEditClient}
            onDeleteClient={handleDeleteClient}
          />
        )}

        {currentView === 'services' && (
          <ServiceManagement
            services={services}
            onAddService={handleAddService}
            onEditService={handleEditService}
            onDeleteService={handleDeleteService}
          />
        )}
      </main>
    </div>
  );
};

export default App;
// DONE