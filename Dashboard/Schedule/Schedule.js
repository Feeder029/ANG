// Initial data
const scheduleData = [];

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



// Get the current date and find the Monday of the current week
function getMonday(date) {
    const day = date.getDay();
    // Adjust when day is 0 (Sunday)
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); 
    return new Date(date.setDate(diff));
}

// Current week start date (Monday of current week)
let currentWeekStart = getMonday(new Date());

// Time slots
const timeSlots = [
    { display: '09:00 AM', value: '09:00' },
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

// Format date as YYYY-MM-DD
function formatDateYMD(date) {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

// Format date as DD/MM/YYYY
function formatDateDMY(date) {
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
}

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
        dateNumber.textContent = formatDateDMY(date);
        
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
            const formattedDate = formatDateDMY(date);
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
    
    const startFormatted = formatDateDMY(currentWeekStart);
    const endFormatted = formatDateDMY(weekEnd);
    
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
    
    // Clear existing schedule data before fetching new data
    scheduleData.length = 0;
    
    // Get the end of the week for the date range
    const weekEnd = new Date(currentWeekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    // Call AddSchedule with updated date range
    AddSchedule(formatDateYMD(currentWeekStart), formatDateYMD(weekEnd));
});

// Navigate to next week
nextWeekBtn.addEventListener('click', function() {
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    
    // Clear existing schedule data before fetching new data
    scheduleData.length = 0;
    
    // Get the end of the week for the date range
    const weekEnd = new Date(currentWeekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    // Call AddSchedule with updated date range
    AddSchedule(formatDateYMD(currentWeekStart), formatDateYMD(weekEnd));
});

// Show modal when Add Schedule button is clicked
addScheduleBtn.addEventListener('click', function() {
    // Reset form
    scheduleForm.reset();
    
    // Set default date to current week's Monday
    const dateInput = document.getElementById('schedule-date');
    dateInput.value = formatDateYMD(currentWeekStart);
    
    // Set default end time to be one hour after start time
    startTimeSelect.value = '9:00';
    endTimeSelect.value = '10:00';
    
    // // Hide reason field initially
    // reasonGroup.style.display = 'none';
    
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

scheduleForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const dateInput = document.getElementById('schedule-date');
    const typeInput = document.getElementById('schedule-type');
    const titleInput = document.getElementById('schedule-title');
    const reasonInput = document.getElementById('schedule-reason');

    const dateParts = dateInput.value.split('-');
    const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

    const newSchedule = {
        date: formattedDate,
        startTime: startTimeSelect.value,
        endTime: endTimeSelect.value,
        type: typeInput.value,
        title: titleInput.value,
        reason: reasonInput.value
    };

    Swal.fire({
        title: 'Confirm Closure',
        text: `Are you sure you want to mark this schedule (${formattedDate} from ${newSchedule.startTime} to ${newSchedule.endTime}) as closed?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, confirm',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            SubmitClosure(newSchedule);
            generateCalendar();
            scheduleModal.style.display = 'none';
        }
    });
});

function formatTimeToHHMMSS(timeStr) {
    let [hour, minute] = timeStr.split(':').map(Number);
    hour = hour.toString().padStart(2, '0');
    minute = minute.toString().padStart(2, '0');
    return `${hour}:${minute}:00`;
  }

  function convertToMySQLDateFormat(dateStr) {
    const [month, day, year] = dateStr.split('/');
    return `${year}-${day.padStart(2, '0')}-${month.padStart(2, '0')}`;
  }

function SubmitClosure(newSchedule){
    
    console.log(newSchedule.date)

    let date = convertToMySQLDateFormat(newSchedule.date);
    console.log(date)

    let starttime = formatTimeToHHMMSS(newSchedule.startTime);
    let endtime = formatTimeToHHMMSS(newSchedule.endTime);

    console.log(starttime)

    let response = newSchedule.reason;

    fetch('Schedule.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Date: date,                
            StartTime: starttime,      
            EndTime: endtime,
            Reason: response
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
    })
    .then(text => {
        console.log('Raw server response:', text);
        // Try to parse as JSON if possible
        try {
            const data = JSON.parse(text);
            return data;
        } catch (e) {
            console.error('Failed to parse response as JSON:', e);
            throw new Error('Server returned invalid JSON: ' + text);
        }
    })
    .then(data => {
        if (data.status === "success") {
            Swal.fire({
                title: 'Success!',
                text: `You have closed your shop at ${date} on ${starttime} to ${endtime} successfully.`,
                icon: 'success',
                confirmButtonText: 'OK'
            });
            AddSchedule(formatDateYMD(currentWeekStart), formatDateYMD(weekEnd));
        } else {
            Swal.fire({
                title: 'Failed!',
                text: data.message || 'Unknown error occurred',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            AddSchedule(formatDateYMD(currentWeekStart), formatDateYMD(weekEnd));
        }
    })
    .catch(error => {
        console.error('Error updating schedule:', error);
        Swal.fire({
            title: 'Error',
            text: 'Failed to connect to server: ' + error.message,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    });
}

// Initialize end time options
startTimeSelect.dispatchEvent(new Event('change'));


function AddSchedule(startDate, endDate) {

    scheduleData.length = 0;

    console.log(startDate + endDate)

    // Fetch additional data with date parameters
    fetch(`Schedule.php?action=appointments&startDate=${startDate}&endDate=${endDate}`)
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                scheduleData.push({
                    date: item.ChosenDate,
                    startTime: item.ChosenTime,
                    endTime: item.EndTime,
                    type: 'appointment',
                    title: 'APPOINTMENT',
                    subtitle: `For ${item.DisplayName}`
                });
            });
            
            CancelSchedule(startDate, endDate); 
        })
        .catch(error => {
            console.error('Error fetching Schedule.php data:', error);
            CancelSchedule(startDate, endDate);
        });
}

function CancelSchedule(startDate, endDate) {

    console.log(startDate + endDate)


    fetch(`Schedule.php?action=closed&startDate=${startDate}&endDate=${endDate}`)
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                console.log(item)
                scheduleData.push({
                    date: item.ChosenDate,
                    startTime: item.ChosenTime,
                    endTime: item.EndTime,
                    type: 'closed',
                    title: 'CLOSED',
                    reason: `${item.US_Reason}`
                });
            });
            
            // Call generateCalendar AFTER the data is loaded
            generateCalendar();
        })
        .catch(error => {
            console.error('Error fetching Schedule.php data:', error);
            generateCalendar();
        });
}


// Initialize the calendar with the current week
const today = new Date();
currentWeekStart = getMonday(today);
const weekEnd = new Date(currentWeekStart);
weekEnd.setDate(weekEnd.getDate() + 6);

// Call AddSchedule with the current week's date range
AddSchedule(formatDateYMD(currentWeekStart), formatDateYMD(weekEnd));