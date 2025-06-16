import React, { useState } from 'react';
import CalendarGrid from './CalendarGrid';
import TimeSlotSelector from './TimeSlotSelector';
import AppointmentWizard from './AppointmentWizard';
import AppointmentEditor from './AppointmentEditor';
import AppointmentSearch from './AppointmentSearch';

const CalendarView = ({ appointments, clients, services, onCreateAppointment, onUpdateAppointment, onDeleteAppointment }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [editingAppointmentId, setEditingAppointmentId] = useState(null);

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setEditingAppointmentId(null);
  };

  const handleAppointmentClick = (appointmentId) => {
    setEditingAppointmentId(appointmentId);
    setSelectedSlot(null);
    setSelectedDate(null);
  };

  const appointmentToEdit = appointments.find(app => app.id === editingAppointmentId);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <AppointmentSearch
        appointments={appointments}
        clients={clients}
        services={services}
        onSelectAppointment={handleAppointmentClick}
      />

      {!editingAppointmentId && (
        <>
          <CalendarGrid
            currentDate={currentDate}
            selectedDate={selectedDate}
            appointments={appointments}
            handlePrevMonth={handlePrevMonth}
            handleNextMonth={handleNextMonth}
            onDateSelect={handleDateSelect}
          />

          {selectedDate && !selectedSlot && (
            <TimeSlotSelector
              selectedDate={selectedDate}
              appointments={appointments}
              clients={clients}
              services={services}
              onSlotSelect={(time) => setSelectedSlot({
                date: selectedDate.toISOString().split('T')[0],
                time
              })}
              onAppointmentClick={handleAppointmentClick}
            />
          )}
        </>
      )}

      {selectedSlot && typeof onCreateAppointment === 'function' && (
        <AppointmentWizard
          selectedSlot={selectedSlot}
          clients={clients}
          services={services}
          onCreateAppointment={(appointment) => {
            onCreateAppointment(appointment);
            setSelectedSlot(null);
            setSelectedDate(null);
          }}
          onCancel={() => setSelectedSlot(null)}
        />
      )}

      {editingAppointmentId && appointmentToEdit && (
        <AppointmentEditor
          appointment={appointmentToEdit}
          clients={clients}
          services={services}
          appointments={appointments} // Pasamos la lista completa de citas
          onUpdateAppointment={(updatedApp) => {
            onUpdateAppointment(updatedApp);
            setEditingAppointmentId(null);
            setSelectedDate(null);
          }}
          onDeleteAppointment={(appId) => {
            onDeleteAppointment(appId);
            setEditingAppointmentId(null);
            setSelectedDate(null);
          }}
          onCancel={() => setEditingAppointmentId(null)}
        />
      )}
    </div>
  );
};

export default CalendarView;
// DONE