import React, { useState, useEffect } from 'react';
import { getCalendarData, bookSlot } from '../utils/calendarData';
import './CalendarView.css';

const CalendarView = () => {
  const [calendarData, setCalendarData] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null);

  useEffect(() => {
    // Generate calendar data on component mount
    const data = getCalendarData();
    setCalendarData(data);
    
    // Set today as default selected date
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  }, []);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null); // Clear previous slot selection
    setBookingStatus(null); // Clear booking status
  };

  const handleSlotSelect = (slot) => {
    if (slot.available) {
      setSelectedSlot(slot);
      setBookingStatus(null); // Clear previous booking status
    }
  };

  const handleBookSlot = async () => {
    if (!selectedSlot) return;

    setIsLoading(true);
    try {
      const result = await bookSlot(selectedDate, selectedSlot.time24);
      setBookingStatus(result);
      
      if (result.success) {
        // In a real app, you might want to refresh the calendar data
        // to show the slot as unavailable
        setTimeout(() => {
          setSelectedSlot(null);
          setBookingStatus(null);
        }, 3000);
      }
    } catch (error) {
      setBookingStatus({
        success: false,
        message: 'Failed to book slot. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSelectedDayData = () => {
    return calendarData.find(day => day.date === selectedDate);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <h2>Schedule a Meeting</h2>
        <p>Select a date and time slot to book your appointment</p>
      </div>

      <div className="calendar-container">
        {/* Date Selection */}
        <div className="date-selection">
          <h3>Select Date</h3>
          <div className="date-grid">
            {calendarData.map((day) => (
              <button
                key={day.date}
                className={`date-card ${selectedDate === day.date ? 'selected' : ''}`}
                onClick={() => handleDateSelect(day.date)}
              >
                <div className="date-day-name">{day.dayName}</div>
                <div className="date-number">{day.dayNumber}</div>
                <div className="date-month">{day.month}</div>
                <div className="available-slots">
                  {day.slots.filter(slot => slot.available).length} available
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Time Slots */}
        <div className="time-slots">
          <h3>Available Times for {formatDate(selectedDate)}</h3>
          
          {getSelectedDayData() ? (
            <div className="slots-grid">
              {getSelectedDayData().slots.map((slot) => (
                <button
                  key={slot.id}
                  className={`time-slot ${!slot.available ? 'unavailable' : ''} ${
                    selectedSlot?.id === slot.id ? 'selected' : ''
                  }`}
                  onClick={() => handleSlotSelect(slot)}
                  disabled={!slot.available}
                >
                  <div className="slot-time">{slot.time}</div>
                  <div className="slot-duration">{slot.duration} min</div>
                  <div className="slot-price">${slot.price}</div>
                  {!slot.available && (
                    <div className="slot-status">Booked</div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="no-slots">No slots available for this date</div>
          )}
        </div>

        {/* Booking Section */}
        {selectedSlot && (
          <div className="booking-section">
            <div className="selected-slot-info">
              <h3>Selected Appointment</h3>
              <div className="slot-details">
                <p><strong>Date:</strong> {formatDate(selectedDate)}</p>
                <p><strong>Time:</strong> {selectedSlot.time}</p>
                <p><strong>Duration:</strong> {selectedSlot.duration} minutes</p>
                <p><strong>Price:</strong> ${selectedSlot.price}</p>
              </div>
              
              <button
                className="book-button"
                onClick={handleBookSlot}
                disabled={isLoading}
              >
                {isLoading ? 'Booking...' : 'Book Appointment'}
              </button>
            </div>
          </div>
        )}

        {/* Booking Status */}
        {bookingStatus && (
          <div className={`booking-status ${bookingStatus.success ? 'success' : 'error'}`}>
            {bookingStatus.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView; 