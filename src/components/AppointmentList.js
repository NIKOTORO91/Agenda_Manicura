import React from 'react';

const AppointmentList = ({ appointments, clients, services }) => {
  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client ? `${client.firstName} ${client.lastName}` : 'Cliente no encontrado';
  };

  const getServiceNames = (serviceIds) => {
    return serviceIds.map(id => {
      const service = services.find(s => s.id === id);
      return service ? service.name : 'Servicio no encontrado';
    }).join(', ');
  };

  const sendReminder = (client) => {
    const message = `Recordatorio: Tienes una cita programada. Gracias por confiar en nosotros.`;
    if (client.whatsappLink) {
      window.open(`${client.whatsappLink}?text=${encodeURIComponent(message)}`, '_blank');
    } else if (client.phone) {
      alert(`SMS enviado a ${client.phone}: ${message}`);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Citas Programadas</h2>
      <div className="space-y-4">
        {appointments.map(appointment => {
          const client = clients.find(c => c.id === appointment.clientId);
          return (
            <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{getClientName(appointment.clientId)}</h3>
                  <p className="text-sm text-gray-500">
                    {appointment.date} a las {appointment.time}
                  </p>
                  <p className="text-sm mt-1">
                    <span className="font-medium">Servicios:</span> {getServiceNames(appointment.services)}
                  </p>
                  {appointment.notes && (
                    <p className="text-sm mt-1">
                      <span className="font-medium">Notas:</span> {appointment.notes}
                    </p>
                  )}
                </div>
                {client && (
                  <button
                    onClick={() => sendReminder(client)}
                    className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded hover:bg-green-200"
                  >
                    Enviar Recordatorio
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AppointmentList;