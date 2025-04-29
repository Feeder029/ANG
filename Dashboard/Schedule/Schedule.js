// Initial data
const scheduleData = [
    { date: '01/04/2025', startTime: '10:00', endTime: '11:00', type: 'appointment', title: 'Appointment', subtitle: 'for Apollo Alff' },
    { date: '03/04/2025', startTime: '9:00', endTime: '13:00', type: 'closed', title: 'CLOSED', reason: 'due to Emergency' },
    { date: '03/04/2025', startTime: '13:00', endTime: '14:00', type: 'appointment', title: 'Appointment', subtitle: 'for Apollo Alff' },
    { date: '05/04/2025', startTime: '10:00', endTime: '11:00', type: 'appointment', title: 'Appointment', subtitle: 'for Apollo Alff' },
    { date: '06/04/2025', startTime: '10:00', endTime: '18:00', type: 'closed', title: 'CLOSED', reason: 'due to busy' }
];

// DOM elements
const calendarGrid = document.getElementById('calendar-grid');
const dateRangeElement = document.getElementById('date-range');
const prevWeekBtn = document.getElementById('prev-week');
const nextWeekBtn = document.getElementById('next-week');
const addScheduleBtn = document.getElementById('add-schedule-btn');
const scheduleModal = document.getElementById('schedule-modal');
const closeModalBtn = document.querySelector('.close');
const cancelBtn = document.getElementById('cancel-btn');
const scheduleForm = document.getElementById('schedule-form');
const scheduleTypeSelect = document.getElementById('schedule-type');
const reasonGroup = document.getElementById('reason-group');
const startTimeSelect = document.getElementById('start-time');
const endTimeSelect = document.getElementById('end-time');

// Current week start date (Monday)
let currentWeekStart = new Date(2025, 2, 31); // March 31, 2025

// Time slots
const timeSlots = [
    { display: '9:00 AM', value: '9:00' },
    { display: '10:00 AM', value: '10:00' },
    { display: '11:00 AM', value: '11:00' },
    { display: '12:00 PM', value: '12:00' },
    { display: '1:00 PM', value: '13:00' },
    { display: '2:00 PM', value: '14:00' },
    { display: '3:00 PM', value: '15:00' },
    { display: '4:00 PM', value: '16:00' },
    { display: '5:00 PM', value: '17:00' },
    { display: '6:00 PM', value: '18:00' }
];

// Generate calendar
function generateCalendar() {
    // Clear grid
    calendarGrid.innerHTML = '';

    // Add empty top-left cell
    const topLeftCell = document.createElement('div');
    topLeftCell.className = 'header-cell';
    calendarGrid.appendChild(topLeftCell);
    
    // Create date objects for the week
    const dates = [];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(currentWeekStart);
        date.setDate(date.getDate() + i);
        dates.push(date);
        
        // Add day header
        const headerCell = document.createElement('div');
        headerCell.className = 'header-cell';
        
        const dayName = document.createElement('div');
        dayName.className = 'day-name';
        dayName.textContent = days[i];
        
        const dateNumber = document.createElement('div');
        dateNumber.className = 'date-number';
        dateNumber.textContent = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        
        headerCell.appendChild(dayName);
        headerCell.appendChild(dateNumber);
        calendarGrid.appendChild(headerCell);
    }
    
    // Add time slots
    timeSlots.forEach((slot, index) => {
        // Add time cell
        const timeCell = document.createElement('div');
        timeCell.className = 'time-cell';
        timeCell.textContent = slot.display;
        calendarGrid.appendChild(timeCell);
        
        // Add cells for each day
        dates.forEach((date, dayIndex) => {
            const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
            const cell = document.createElement('div');
            cell.className = 'calendar-cell';
            
            // Check if there's an event for this time slot
            const events = findEvents(formattedDate, slot.value);
            
            events.forEach(event => {
                // Only create event element if this is the start time
                if (event.startTime === slot.value) {
                    const eventElement = document.createElement('div');
                    eventElement.className = `event ${event.type}`;
                    
                    // Calculate height based on duration
                    const startIndex = timeSlots.findIndex(t => t.value === event.startTime);
                    const endIndex = timeSlots.findIndex(t => t.value === event.endTime);
                    const duration = endIndex - startIndex;
                    
                    // Set height and top position
                    eventElement.style.height = `${duration * 60 - 8}px`;
                    
                    if (event.type === 'appointment') {
                        eventElement.innerHTML = `
                            <div class="event-title">${event.title}</div>
                            <div class="event-subtitle">${event.subtitle}</div>
                        `;
                    } else if (event.type === 'closed') {
                        eventElement.innerHTML = `
                            <div class="event-title">${event.title}</div>
                            <div class="event-subtitle">${event.reason}</div>
                        `;
                    }
                    
                    cell.appendChild(eventElement);
                    
                    // Add click event to edit
                    eventElement.addEventListener('click', function() {
                        openEditModal(event);
                    });
                }
            });
            
            calendarGrid.appendChild(cell);
        });
    });
    
    // Update date range display
    const weekEnd = new Date(currentWeekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    const startFormatted = `${currentWeekStart.getDate().toString().padStart(2, '0')}/${(currentWeekStart.getMonth() + 1).toString().padStart(2, '0')}/${currentWeekStart.getFullYear()}`;
    const endFormatted = `${weekEnd.getDate().toString().padStart(2, '0')}/${(weekEnd.getMonth() + 1).toString().padStart(2, '0')}/${weekEnd.getFullYear()}`;
    
    dateRangeElement.textContent = `${startFormatted} - ${endFormatted}`;
}

// Find events for a specific date and time
function findEvents(date, time) {
    return scheduleData.filter(event => {
        if (event.date !== date) return false;
        
        const startHour = parseInt(event.startTime.split(':')[0]);
        const endHour = parseInt(event.endTime.split(':')[0]);
        const timeHour = parseInt(time.split(':')[0]);
        
        return timeHour >= startHour && timeHour < endHour;
    });
}

// Open edit modal with event data
function openEditModal(event) {
    const dateInput = document.getElementById('schedule-date');
    const typeInput = document.getElementById('schedule-type');
    const titleInput = document.getElementById('schedule-title');
    const reasonInput = document.getElementById('schedule-reason');
    
    // Convert date format from DD/MM/YYYY to YYYY-MM-DD
    const dateParts = event.date.split('/');
    const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    
    dateInput.value = formattedDate;
    typeInput.value = event.type;
    startTimeSelect.value = event.startTime;
    endTimeSelect.value = event.endTime;
    
    if (event.type === 'appointment') {
        titleInput.value = `${event.title} ${event.subtitle}`;
        reasonGroup.style.display = 'none';
    } else {
        titleInput.value = event.title;
        reasonInput.value = event.reason;
        reasonGroup.style.display = 'block';
    }
    
    // Show modal
    scheduleModal.style.display = 'block';
}

// Navigate to previous week
prevWeekBtn.addEventListener('click', function() {
    currentWeekStart.setDate(currentWeekStart.getDate() - 7);
    generateCalendar();
});

// Navigate to next week
nextWeekBtn.addEventListener('click', function() {
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    generateCalendar();
});

// Show modal when Add Schedule button is clicked
addScheduleBtn.addEventListener('click', function() {
    // Reset form
    scheduleForm.reset();
    
    // Set default date to current week's Monday
    const dateInput = document.getElementById('schedule-date');
    const formattedDate = `${currentWeekStart.getFullYear()}-${(currentWeekStart.getMonth() + 1).toString().padStart(2, '0')}-${currentWeekStart.getDate().toString().padStart(2, '0')}`;
    dateInput.value = formattedDate;
    
    // Set default end time to be one hour after start time
    startTimeSelect.value = '9:00';
    endTimeSelect.value = '10:00';
    
    // Hide reason field initially
    reasonGroup.style.display = 'none';
    
    // Show modal
    scheduleModal.style.display = 'block';
});

// Update end time options based on start time
startTimeSelect.addEventListener('change', function() {
    const startIndex = timeSlots.findIndex(t => t.value === this.value);
    
    // Clear end time options
    endTimeSelect.innerHTML = '';
    
    // Add options starting from one hour after start time
    for (let i = startIndex + 1; i < timeSlots.length; i++) {
        const option = document.createElement('option');
        option.value = timeSlots[i].value;
        option.textContent = timeSlots[i].display;
        endTimeSelect.appendChild(option);
    }
    
    // Select first option
    if (endTimeSelect.options.length > 0) {
        endTimeSelect.selectedIndex = 0;
    }
});

// Close modal when X is clicked
closeModalBtn.addEventListener('click', function() {
    scheduleModal.style.display = 'none';
});

// Close modal when Cancel is clicked
cancelBtn.addEventListener('click', function() {
    scheduleModal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target === scheduleModal) {
        scheduleModal.style.display = 'none';
    }
});

// Show/hide reason field based on schedule type
scheduleTypeSelect.addEventListener('change', function() {
    if (this.value === 'closed') {
        reasonGroup.style.display = 'block';
    } else {
        reasonGroup.style.display = 'none';
    }
});

// Handle form submission
scheduleForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const dateInput = document.getElementById('schedule-date');
    const typeInput = document.getElementById('schedule-type');
    const titleInput = document.getElementById('schedule-title');
    const reasonInput = document.getElementById('schedule-reason');
    
    // Convert date format from YYYY-MM-DD to DD/MM/YYYY
    const dateParts = dateInput.value.split('-');
    const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
    
    const newSchedule = {
        date: formattedDate,
        startTime: startTimeSelect.value,
        endTime: endTimeSelect.value,
        type: typeInput.value,
        title: titleInput.value
    };
    
    if (typeInput.value === 'appointment') {
        // Extract subtitle from title (assuming format "Appointment for Apollo Alff")
        const titleParts = titleInput.value.split(' for ');
        if (titleParts.length > 1) {
            newSchedule.title = titleParts[0];
            newSchedule.subtitle = 'for ' + titleParts[1];
        } else {
            newSchedule.subtitle = '';
        }
    } else if (typeInput.value === 'closed') {
        newSchedule.reason = reasonInput.value || 'due to closure';
    }
    
    // Add to schedule data
    scheduleData.push(newSchedule);
    
    // Regenerate calendar
    generateCalendar();
    
    // Close modal
    scheduleModal.style.display = 'none';
});

// Initialize calendar
generateCalendar();

// Initialize end time options
startTimeSelect.dispatchEvent(new Event('change'));
