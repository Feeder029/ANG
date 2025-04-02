// // Calendar functionality
// const calendarGrid = document.getElementById('calendar-grid');
// const monthYearElement = document.querySelector('.month-year');
// const calendarPrevButton = document.querySelector('.calendar-header .prev');
// const calendarNextButton = document.querySelector('.calendar-header .next');

// let currentDate = new Date(2025, 2, 30); // Current date: March 30, 2025
// let currentMonth = currentDate.getMonth();
// let currentYear = currentDate.getFullYear();
// let selectedDate = new Date(2025, 2, 31); // March 31, 2025 (default selected date)

// // Initialize calendar
// generateCalendar(currentMonth, currentYear);

// // Event listeners for calendar navigation
// calendarPrevButton.addEventListener('click', function() {
//     currentMonth--;
//     if (currentMonth < 0) {
//         currentMonth = 11;
//         currentYear--;
//     }
//     generateCalendar(currentMonth, currentYear);
// });

// calendarNextButton.addEventListener('click', function() {
//     currentMonth++;
//     if (currentMonth > 11) {
//         currentMonth = 0;
//         currentYear++;
//     }
//     generateCalendar(currentMonth, currentYear);
// });

// // Function to generate calendar
// function generateCalendar(month, year) {
//     // Clear existing calendar
//     calendarGrid.innerHTML = '';
    
//     // Set month and year text
//     const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
//     monthYearElement.textContent = `${monthNames[month]} ${year}`;
    
//     // Add day headers
//     const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//     dayNames.forEach(day => {
//         const dayHeader = document.createElement('div');
//         dayHeader.className = 'calendar-day-header';
//         dayHeader.textContent = day;
//         calendarGrid.appendChild(dayHeader);
//     });
    
//     // Get first day of month and total days
//     const firstDay = new Date(year, month, 1).getDay();
//     const daysInMonth = new Date(year, month + 1, 0).getDate();
    
//     // Add empty cells for days before first day of month
//     for (let i = 0; i < firstDay; i++) {
//         const emptyDay = document.createElement('div');
//         emptyDay.className = 'calendar-day empty';
//         calendarGrid.appendChild(emptyDay);
//     }
    
//     // Add day cells
//     for (let i = 1; i <= daysInMonth; i++) {
//         const dayCell = document.createElement('div');
//         dayCell.className = 'calendar-day';
//         dayCell.textContent = i;
        
//         // Check if this date is in the past
//         const dateToCheck = new Date(year, month, i);
//         const isPastDate = dateToCheck < currentDate;
        
//         if (isPastDate) {
//             dayCell.classList.add('disabled');
//         } else {
//             // Check if this date matches the selected date
//             if (selectedDate && 
//                 i === selectedDate.getDate() && 
//                 month === selectedDate.getMonth() && 
//                 year === selectedDate.getFullYear()) {
//                 dayCell.classList.add('active');
//             }
            
//             // Add click event to select date (only for future dates)
//             dayCell.addEventListener('click', function() {
//                 // Remove active class from all days
//                 document.querySelectorAll('.calendar-day').forEach(day => {
//                     day.classList.remove('active');
//                 });
//                 // Add active class to clicked day
//                 dayCell.classList.add('active');
//                 selectedDate = new Date(year, month, i);
//             });
//         }
        
//         // Check if this date is today
//         if (i === currentDate.getDate() && 
//             month === currentDate.getMonth() && 
//             year === currentDate.getFullYear()) {
//             dayCell.classList.add('today');
//         }
        
//         calendarGrid.appendChild(dayCell);
//     }
// }

// // Time slot selection functionality
// const timeSlots = document.querySelectorAll('.time-slot');
// timeSlots.forEach(slot => {
//     slot.addEventListener('click', function() {
//         timeSlots.forEach(s => s.classList.remove('active'));
//         slot.classList.add('active');
//     });
// });

// // Procedure selection functionality
// const procedureItems = document.querySelectorAll('.procedure-item');
// procedureItems.forEach(item => {
//     item.addEventListener('click', function() {
//         procedureItems.forEach(i => i.classList.remove('active'));
//         item.classList.add('active');
//     });
// });

// // Procedure carousel navigation
// const proceduresContainer = document.getElementById('procedures');
// const procedurePrevButton = document.querySelector('.procedure-nav.prev');
// const procedureNextButton = document.querySelector('.procedure-nav.next');
// let procedureScrollPosition = 0;

// procedurePrevButton.addEventListener('click', function() {
//     procedureScrollPosition -= 200;
//     if (procedureScrollPosition < 0) procedureScrollPosition = 0;
//     proceduresContainer.style.transform = `translateX(-${procedureScrollPosition}px)`;
// });

// procedureNextButton.addEventListener('click', function() {
//     const maxScroll = proceduresContainer.scrollWidth - proceduresContainer.clientWidth;
//     procedureScrollPosition += 200;
//     if (procedureScrollPosition > maxScroll) procedureScrollPosition = maxScroll;
//     proceduresContainer.style.transform = `translateX(-${procedureScrollPosition}px)`;
// });

// // Tab navigation for schedule panel
// const tabItems = document.querySelectorAll('.tab-item');

// tabItems.forEach(tab => {
//     tab.addEventListener('click', function() {
//         tabItems.forEach(t => t.classList.remove('active'));
//         tab.classList.add('active');
        
//         // Filter appointments by status (in a real app, this would update the table)
//         const status = tab.getAttribute('data-tab');
//         console.log(`Filtering appointments by status: ${status}`);
        
//         // For demo purposes, we're just logging the action
//         if (status === 'all') {
//             // Show all appointments
//         } else {
//             // Filter appointments by status
//         }
//     });
// });

// // Book appointment button functionality
// const bookButton = document.querySelector('.book-btn');

// bookButton.addEventListener('click', function() {
//     // Get selected date, time, and procedure
//     const selectedTimeSlot = document.querySelector('.time-slot.active')?.textContent || '';
//     const selectedProcedure = document.querySelector('.procedure-item.active')?.querySelector('.procedure-name')?.textContent || '';
    
//     if (!selectedDate || !selectedTimeSlot || !selectedProcedure) {
//         alert('Please select a date, time, and procedure.');
//         return;
//     }
    
//     // Format date for display
//     const formattedDate = `${selectedDate.getDate().toString().padStart(2, '0')}/${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}/${selectedDate.getFullYear()}`;
    
//     // In a real app, this would send data to the server
//     alert(`Booking appointment for:\nDate: ${formattedDate}\nTime: ${selectedTimeSlot}\nProcedure: ${selectedProcedure}`);
    
//     // Switch to schedule panel to show the new appointment
//     // document.querySelector('.sidebar-item[data-panel="schedule"]').click();
// });

// Global variables
let selectedDate = null;
let selectedTime = null;
let selectedProcedure = null;
let bookedSlots = {}; // Will store dates and their booked time slots

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the calendar with Philippines time
    const now = new Date();
    // Convert to Philippines time (UTC+8)
    const philippinesTime = new Date(now.getTime() + (8 * 60 * 60 * 1000));
    populateCalendar(philippinesTime.getFullYear(), philippinesTime.getMonth());
    
    // Set up event handlers
    setupEventListeners();
    
    // Generate some random booked slots for demonstration
    generateRandomBookedSlots();
});

// Set up all event listeners
function setupEventListeners() {
    // Calendar navigation
    document.querySelector('.calendar-nav.prev').addEventListener('click', navigatePrevMonth);
    document.querySelector('.calendar-nav.next').addEventListener('click', navigateNextMonth);
    
    // Time slots selection
    document.querySelector('.time-slots').addEventListener('click', function(e) {
        if (e.target.classList.contains('time-slot') && !e.target.classList.contains('booked')) {
            selectTimeSlot(e.target);
        }
    });
    
    // Procedure selection
    document.querySelectorAll('.procedure-card').forEach(card => {
        card.addEventListener('click', function() {
            selectProcedure(this);
        });
    });
    
    // Book appointment button
    document.querySelector('.book-btn').addEventListener('click', validateAndBookAppointment);
}

// Calendar Functions
function populateCalendar(year, month) {
    const calendarGrid = document.getElementById('calendar-grid');
    calendarGrid.innerHTML = '';
    
    // Add day headers
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayNames.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });
    
    // Get first day of the month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Update month and year display
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    document.querySelector('.month-year').textContent = `${monthNames[month]} ${year}`;
    
    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDay.getDay(); i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyDay);
    }
    
    // Add days of the month
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day';
        dayCell.textContent = i;
        
        const currentDate = new Date(year, month, i);
        
        // Disable past dates
        if (currentDate < today) {
            dayCell.classList.add('disabled');
        } else {
            dayCell.addEventListener('click', function() {
                selectDate(this, year, month, i);
            });
        }
        
        calendarGrid.appendChild(dayCell);
    }
}

function navigatePrevMonth() {
    const currentMonth = document.querySelector('.month-year').textContent;
    const [monthName, year] = currentMonth.split(' ');
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let monthIndex = monthNames.indexOf(monthName);
    let yearNumber = parseInt(year);
    
    // Calculate previous month
    monthIndex--;
    if (monthIndex < 0) {
        monthIndex = 11;
        yearNumber--;
    }
    
    populateCalendar(yearNumber, monthIndex);
}

function navigateNextMonth() {
    const currentMonth = document.querySelector('.month-year').textContent;
    const [monthName, year] = currentMonth.split(' ');
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let monthIndex = monthNames.indexOf(monthName);
    let yearNumber = parseInt(year);
    
    // Calculate next month
    monthIndex++;
    if (monthIndex > 11) {
        monthIndex = 0;
        yearNumber++;
    }
    
    populateCalendar(yearNumber, monthIndex);
}

function selectDate(dayElement, year, month, day) {
    // Remove active class from all days
    document.querySelectorAll('.calendar-day').forEach(day => {
        day.classList.remove('active');
    });
    
    // Add active class to selected day
    dayElement.classList.add('active');
    
    // Store selected date
    selectedDate = new Date(year, month, day);
    
    // Update time slots based on selected date
    updateTimeSlots(selectedDate);
}

// Time Slot Functions
function updateTimeSlots(date) {
    const timeSlots = document.querySelectorAll('.time-slot');
    const dateKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    
    // Reset all time slots
    timeSlots.forEach(slot => {
        slot.classList.remove('active', 'booked');
    });
    
    // Mark booked slots
    if (bookedSlots[dateKey]) {
        bookedSlots[dateKey].forEach(bookedTime => {
            const slot = Array.from(timeSlots).find(slot => slot.textContent === bookedTime);
            if (slot) {
                slot.classList.add('booked');
            }
        });
    }
    
    // Reset selected time
    selectedTime = null;
}

function selectTimeSlot(timeSlotElement) {
    // Remove active class from all time slots
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('active');
    });
    
    // Add active class to selected time slot
    timeSlotElement.classList.add('active');
    
    // Store selected time
    selectedTime = timeSlotElement.textContent;
}

// Procedure Functions
function selectProcedure(procedureElement) {
    // Remove active class from all procedures
    document.querySelectorAll('.procedure-card').forEach(card => {
        card.classList.remove('active');
    });
    
    // Add active class to selected procedure
    procedureElement.classList.add('active');
    
    // Store selected procedure
    selectedProcedure = procedureElement.getAttribute('data-procedure');
}

// Book Appointment Functions
function validateAndBookAppointment() {
    if (!selectedDate) {
        showError('Please select a date for your appointment.');
        return;
    }
    
    if (!selectedTime) {
        showError('Please select a time slot for your appointment.');
        return;
    }
    
    if (!selectedProcedure) {
        showError('Please select a procedure for your appointment.');
        return;
    }
    
    // All selections are valid, show confirmation
    bookAppointment();
}

function bookAppointment() {
    // Format the date for display
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = selectedDate.toLocaleDateString('en-US', options);
    
    // Get procedure name
    const procedureElement = document.querySelector(`.procedure-card[data-procedure="${selectedProcedure}"]`);
    const procedureName = procedureElement.querySelector('.procedure-name').textContent;
    
    // Create confirmation message
    const message = `
        Appointment Booked Successfully!
        
        Date: ${formattedDate}
        Time: ${selectedTime}
        Procedure: ${procedureName}
        
        Thank you for booking with us. We look forward to seeing you!
    `;
    
    // Show confirmation
    alert(message);
    
    // Mark the time slot as booked
    const dateKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`;
    if (!bookedSlots[dateKey]) {
        bookedSlots[dateKey] = [];
    }
    bookedSlots[dateKey].push(selectedTime);
    
    // Reset selections
    resetSelections();
}

function showError(message) {
    alert(`Error: ${message}`);
}

function resetSelections() {
    // Reset date
    document.querySelectorAll('.calendar-day').forEach(day => {
        day.classList.remove('active');
    });
    selectedDate = null;
    
    // Reset time
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('active');
    });
    selectedTime = null;
    
    // Reset procedure
    document.querySelectorAll('.procedure-card').forEach(card => {
        card.classList.remove('active');
    });
    selectedProcedure = null;
    
    // Update time slots
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('booked');
    });
}

// Helper function to generate random booked slots for demonstration
function generateRandomBookedSlots() {
    const now = new Date();
    // Convert to Philippines time (UTC+8)
    const philippinesTime = new Date(now.getTime() + (8 * 60 * 60 * 1000));
    
    // Generate bookings for the next 10 days
    for (let i = 0; i < 10; i++) {
        const bookingDate = new Date(philippinesTime);
        bookingDate.setDate(bookingDate.getDate() + i);
        
        const dateKey = `${bookingDate.getFullYear()}-${bookingDate.getMonth() + 1}-${bookingDate.getDate()}`;
        bookedSlots[dateKey] = [];
        
        // Randomly book 1-3 slots per day
        const numberOfBookings = Math.floor(Math.random() * 3) + 1;
        const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
        
        for (let j = 0; j < numberOfBookings; j++) {
            const randomIndex = Math.floor(Math.random() * timeSlots.length);
            bookedSlots[dateKey].push(timeSlots[randomIndex]);
            // Remove the booked slot to avoid duplicates
            timeSlots.splice(randomIndex, 1);
        }
    }
}