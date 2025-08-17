import React, { useState, useEffect } from 'react';
import { getCalendarData, bookSlot } from '../utils/calendarData';
import './ENSCalendar.css';

const ENSCalendar = ({ walletAddress, ensName, onDisconnect }) => {
  const [calendarData, setCalendarData] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [viewMode, setViewMode] = useState('owner'); // 'owner' or 'visitor'

  useEffect(() => {
    const data = getCalendarData();
    setCalendarData(data);
    
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  }, []);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setBookingStatus(null);
  };

  const handleSlotSelect = (slot) => {
    if (slot.available) {
      setSelectedSlot(slot);
      setBookingStatus(null);
    }
  };

  const handleBookSlot = async () => {
    if (!selectedSlot) return;

    setIsLoading(true);
    try {
      const result = await bookSlot(selectedDate, selectedSlot.time24);
      setBookingStatus(result);
      
      if (result.success) {
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

  const calendarSubdomain = ensName ? `calendar.${ensName}` : `calendar.${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}.eth`;

  return (
    <div className="ens-calendar">
      {/* ENS Header */}
      <div className="ens-header">
        <div className="ens-info">
          <div className="ens-avatar">
            {ensName ? ensName.charAt(0).toUpperCase() : '?'}
          </div>
          <div className="ens-details">
            <h1 className="ens-name">{ensName || 'Unnamed ENS'}</h1>
            <p className="ens-address">{walletAddress}</p>
            <div className="calendar-url">
              <span className="url-label">Calendar URL:</span>
              <span className="url-value">{calendarSubdomain}</span>
            </div>
          </div>
        </div>
        <button className="disconnect-button" onClick={onDisconnect}>
          Disconnect
        </button>
      </div>

      {/* Calendar Owner Controls */}
      {viewMode === 'owner' && (
        <div className="owner-controls">
          <div className="control-section">
            <h3>Your Calendar Settings</h3>
            <div className="settings-grid">
              <div className="setting-item">
                <label>Calendar URL</label>
                <div className="url-display">
                  <span>{calendarSubdomain}</span>
                  <button className="copy-button" onClick={() => navigator.clipboard.writeText(calendarSubdomain)}>
                    📋
                  </button>
                </div>
              </div>
              <div className="setting-item">
                <label>Public Calendar</label>
                <div className="toggle-switch">
                  <input type="checkbox" id="public-calendar" defaultChecked />
                  <label htmlFor="public-calendar"></label>
                </div>
              </div>
              <div className="setting-item">
                <label>Default Price</label>
                <input type="number" defaultValue="40" min="0" className="price-input" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Interface */}
      <div className="calendar-interface">
        <div className="calendar-header">
          <h2>Schedule with {ensName || 'this person'}</h2>
          <p>Select a date and time to book your appointment</p>
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
                <h3>Book Appointment with {ensName || 'this person'}</h3>
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

      {/* Footer with ENS info */}
      <div className="calendar-footer">
        <p>Powered by ENS Calendar • {calendarSubdomain}</p>
      </div>
    </div>
  );
};

export default ENSCalendar; 