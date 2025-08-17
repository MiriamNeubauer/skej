// Generate dummy calendar data with free time slots
export const generateDummyCalendarData = (days = 7) => {
  const calendarData = [];
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const dayData = {
      date: date.toISOString().split('T')[0], // YYYY-MM-DD format
      dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
      dayNumber: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      slots: generateTimeSlots(date)
    };
    
    calendarData.push(dayData);
  }
  
  return calendarData;
};

// Generate time slots for a specific day
const generateTimeSlots = (date) => {
  const slots = [];
  const isWeekend = date.getDay() === 0 || date.getDay() === 6; // Sunday or Saturday
  
  // Different schedules for weekdays vs weekends
  const startHour = isWeekend ? 10 : 9; // 10 AM on weekends, 9 AM on weekdays
  const endHour = isWeekend ? 18 : 20; // 6 PM on weekends, 8 PM on weekdays
  
  for (let hour = startHour; hour < endHour; hour++) {
    // Generate 2 slots per hour (30-minute intervals)
    for (let minute = 0; minute < 60; minute += 30) {
      const slotTime = new Date(date);
      slotTime.setHours(hour, minute, 0, 0);
      
      // Randomly make some slots unavailable (30% chance on weekdays, 20% on weekends)
      const isAvailable = Math.random() > (isWeekend ? 0.2 : 0.3);
      
      const slot = {
        id: `${date.toISOString().split('T')[0]}-${hour.toString().padStart(2, '0')}-${minute.toString().padStart(2, '0')}`,
        time: slotTime.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }),
        time24: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
        available: isAvailable,
        duration: 30, // 30 minutes
        price: isWeekend ? 50 : 40 // Different pricing for weekends
      };
      
      slots.push(slot);
    }
  }
  
  return slots;
};

// Get available slots for a specific date
export const getAvailableSlots = (date) => {
  const calendarData = generateDummyCalendarData();
  const dayData = calendarData.find(day => day.date === date);
  return dayData ? dayData.slots.filter(slot => slot.available) : [];
};

// Get all calendar data
export const getCalendarData = () => {
  return generateDummyCalendarData();
};

// Check if a slot is available
export const isSlotAvailable = (date, time) => {
  const slots = getAvailableSlots(date);
  return slots.some(slot => slot.time24 === time);
};

// Book a slot (for demo purposes)
export const bookSlot = (date, time) => {
  console.log(`Booking slot for ${date} at ${time}`);
  // In a real app, this would make an API call
  return {
    success: true,
    bookingId: `booking-${Date.now()}`,
    message: 'Slot booked successfully!'
  };
}; 