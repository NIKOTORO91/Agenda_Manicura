import React from 'react';

const TimeSlotSelector = ({ selectedDate, appointments, clients, services, onSlotSelect, onAppointmentClick }) => {
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 9;
    const endHour = 18;
    const selectedDateISO = selectedDate.toISOString().split('T')[0];

    // Crear todos los slots de 30 minutos
    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push({
          time: timeString,
          available: true,
          isBooked: false, // Indica si el slot está ocupado por cualquier parte de una cita
          isStartOfAppointment: false, // Indica si este slot es el inicio de una cita
          appointmentInfo: null // Para guardar info de la cita si es el inicio
        });
      }
    }

    // Marcar slots ocupados por citas existentes
    appointments.forEach(app => {
      if (app.date === selectedDateISO) {
        const appStartTime = app.time;
        const appEndTime = app.endTime;

        const [startHourApp, startMinuteApp] = appStartTime.split(':').map(Number);
        const [endHourApp, endMinuteApp] = appEndTime.split(':').map(Number);

        const appStartDateTime = new Date(selectedDate);
        appStartDateTime.setHours(startHourApp, startMinuteApp, 0, 0);
        const appEndDateTime = new Date(selectedDate);
        appEndDateTime.setHours(endHourApp, endMinuteApp, 0, 0);

        let currentSlotTime = new Date(appStartDateTime);
        let i = 0;
        while (i < slots.length && slots[i].time !== appStartTime) {
          i++;
        }
        const startIndex = i;

        while (currentSlotTime.getTime() < appEndDateTime.getTime() && i < slots.length) {
          slots[i].available = false; // Este slot está ocupado
          slots[i].isBooked = true;
          if (i === startIndex) { // Solo el primer slot de la cita guarda la info y se marca como inicio
            slots[i].isStartOfAppointment = true;
            slots[i].appointmentInfo = {
              id: app.id,
              clientId: app.clientId,
              clientName: app.clientName,
              services: app.services,
              servicesDetails: app.servicesDetails,
              totalPrice: app.totalPrice,
              time: app.time,
              endTime: app.endTime,
              status: app.status || 'Agendado' // Incluir el status
            };
          }
          currentSlotTime.setMinutes(currentSlotTime.getMinutes() + 30);
          i++;
        }
      }
    });

    return slots;
  };

  const getStatusColorClass = (status) => {
    switch (status) {
      case 'Agendado':
        return 'bg-yellow-200 border-yellow-300 text-yellow-800';
      case 'Atendido':
        return 'bg-green-200 border-green-300 text-green-800';
      default:
        return 'bg-gray-200 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className="mt-6">
      <h3 className="font-medium text-lg mb-2">
        Horarios para {selectedDate.toLocaleDateString()}
      </h3>
      <div className="grid grid-cols-3 gap-2">
        {generateTimeSlots().map((slot, index) => (
          // Solo renderizamos el slot si está disponible o si es el inicio de una cita
          (slot.available || slot.isStartOfAppointment) && (
            <button
              key={index}
              onClick={() => slot.isStartOfAppointment ? onAppointmentClick(slot.appointmentInfo.id) : onSlotSelect(slot.time)}
              disabled={!slot.available && !slot.isStartOfAppointment} // Deshabilitar si está ocupado y no es el inicio de una cita
              className={`p-2 text-sm rounded-md border 
                ${slot.available 
                  ? 'border-gray-200 hover:bg-indigo-50 hover:border-indigo-200' 
                  : 'border-red-100 bg-red-50 text-gray-500'}
                ${slot.isStartOfAppointment ? getStatusColorClass(slot.appointmentInfo.status) + ' font-semibold cursor-pointer' : ''}
              `}
            >
              {slot.time}
              {slot.isStartOfAppointment && (
                <div className="block text-xs mt-1 text-left">
                  <p className="font-bold">
                    {slot.appointmentInfo.clientName} - ${parseFloat(slot.appointmentInfo.totalPrice).toFixed(2)} - {slot.appointmentInfo.status}
                  </p>
                  <p>{slot.appointmentInfo.time} - {slot.appointmentInfo.endTime}</p>
                  <ul className="list-disc list-inside">
                    {slot.appointmentInfo.servicesDetails.map(s => (
                      <li key={s.id}>{s.name}</li>
                    ))}
                  </ul>
                </div>
              )}
              {!slot.available && !slot.isStartOfAppointment && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  !
                </span>
              )}
            </button>
          )
        ))}
      </div>
    </div>
  );
};

export default TimeSlotSelector;
// DONE