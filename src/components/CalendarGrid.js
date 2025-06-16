import React from 'react';

const CalendarGrid = ({ 
  currentDate, 
  selectedDate, 
  appointments, 
  onDateSelect,
  handlePrevMonth,
  handleNextMonth 
}) => {
  const renderDays = () => {
    const days = [];
    const startDate = new Date(currentDate);
    startDate.setDate(1);
    
    while (startDate.getDay() !== 1) {
      startDate.setDate(startDate.getDate() - 1);
    }
    
    for (let i = 0; i < 35; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === currentDate.getMonth();
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      const hasAppointments = appointments.some(
        app => app.date === date.toISOString().split('T')[0]
      );
      
      days.push(
        <div
          key={i}
          onClick={() => onDateSelect(date)}
          className={`p-2 border border-gray-200 min-h-16 cursor-pointer 
            ${isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'} 
            ${isSelected ? 'ring-2 ring-indigo-500' : ''}
            ${hasAppointments ? 'bg-indigo-50' : ''}`}
        >
          <div className="text-sm font-medium">
            {date.getDate()}
          </div>
          {hasAppointments && (
            <div className="w-2 h-2 bg-indigo-500 rounded-full mx-auto mt-1"></div>
          )}
        </div>
      );
    }
    return days;
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={handlePrevMonth}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          &lt;
        </button>
        <h2 className="text-xl font-semibold">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button 
          onClick={handleNextMonth}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          &gt;
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(day => (
          <div key={day} className="text-center font-medium text-gray-500 text-sm">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {renderDays()}
      </div>
    </>
  );
};

export default CalendarGrid;