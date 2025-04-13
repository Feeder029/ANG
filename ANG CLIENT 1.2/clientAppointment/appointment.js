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

    ServiceDisplay();
    
    // Generate some random booked slots for demonstration
    generateRandomBookedSlots();
    
    // checkLoginStatus();

    setupEventListeners();
});

//Display all of the Services on the Database
function ServiceDisplay() {
    // Fetch the icon data first
    fetch('icon.json')
    .then(response => response.json())
    .then(iconData => {
        
        fetch('appointment.php') // Call the php which we will get the datas
        .then(response => response.json())
        .then(data => {
            let display = '';
            let i = 0; 

            if (data.length === 0) {
                // If there is no data, display the "No available services" message
                display = `<h2>There are no current available services.<h2>`;
            } else {

            data.forEach(item => {
                let stat = i === 0 ? "active" : ""; // Check if it's the first item

                // Find the corresponding icon for the procedure name
                let matchingIcon = iconData.find(icon => icon.process.toLowerCase() === item.S_NAME.toLowerCase());

                // Set the icon source (if a match is found, use it, otherwise use a default icon)
                let iconSrc = matchingIcon ? matchingIcon.icon : 'https://cdn-icons-png.flaticon.com/128/2932/2932475.png'; // Default icon

                display += `
                    <div class='procedure-card ${stat}' data-procedure="${item.S_ID}">     
                        <img src="${iconSrc}" alt="Tooth" class="procedure-icon">
                        <div class="procedure-name">${item.S_NAME}</div>
                        <div hidden class="procedure-id">${item.S_ID}</div>
                    </div>
                `; // Hidden so users can't see the ID

                i++;
            });
            }
            document.getElementById('procedure').innerHTML = display; // Add to the HTML
            
            // Add event listeners AFTER adding the elements to DOM
            document.querySelectorAll('.procedure-card').forEach(card => {
                card.addEventListener('click', function() {
                    selectProcedure(this); // Get what got clicked
                });
            });
        })
        .catch(error => console.error('Error fetching api.php data:', error));
    })
    .catch(error => console.error('Error fetching icon.json data:', error));
}


  
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
    // document.querySelectorAll('.procedure-card').forEach(card => {
    //     card.addEventListener('click', function() {
    //         selectProcedure(this);
    //     });
    // });
    
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
    const options2 = { year: 'numeric', month: '2-digit', day: '2-digit' }; 
    const GBDate= selectedDate.toLocaleDateString('en-GB', options2); 
    const [day, month, year] = GBDate.split('/');
    const DBDate= `${year}-${month}-${day}`;
    
    // Get procedure name
    const procedureElement = document.querySelector(`.procedure-card[data-procedure="${selectedProcedure}"]`);
    const procedureName = procedureElement.querySelector('.procedure-name').textContent;
    const procedureID = procedureElement.querySelector('.procedure-id').textContent;

    // Create confirmation message
    const message = `Do you want to proceed with the appointment on ${formattedDate} at ${selectedTime} for the procedure: ${procedureName}?`;


    Swal.fire({
        title: 'Confirm Appointment?',
        text: message,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Confirm',
        cancelButtonText: 'No, Cancel',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#aaa',
        reverseButtons: true // optional: swaps button positions
      }).then((result) => {
        if (result.isConfirmed) {

                 // Convertit to Military Time
     function convertToMilitaryTime(time) {
        let [timePart, modifier] = time.split(" ");
        let [hours, minutes] = timePart.split(":").map(Number);
    
        if (modifier === "PM" && hours < 12) {
            hours += 12; // Convert PM hours to military time
        }
        if (modifier === "AM" && hours === 12) {
            hours = 0; // Convert 12 AM to 0 hours
        }
    
        // Format hours and minutes to ensure two digits
        let formattedMilitaryTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
        return formattedMilitaryTime;
    }
    
    let formattedMilitaryTime = convertToMilitaryTime(selectedTime);
   
   AddAppointment(2,procedureID,DBDate,formattedMilitaryTime);
   
   // Mark the time slot as booked
   const dateKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`;
   if (!bookedSlots[dateKey]) {
       bookedSlots[dateKey] = [];
   }
   bookedSlots[dateKey].push(selectedTime);
   
   // Reset selections
   resetSelections();


        } else {
            return; 
        }
      });
      

}



function showError(message) {
    Swal.fire({
        title: 'Error',
        text: message,
        icon: 'error',
        position: 'top',
        toast: true,
        showConfirmButton: false,
        timer: 3000
    });
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

//Import Appointment to Database
function AddAppointment(PID, SID, ACD, ACT) {
    
    fetch('appointment.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            PatientID: PID,
            ServicesID: SID,
            APP_ChosenDate: ACD,
            APP_ChosenTime: ACT
        })
    })
    .then(response => {
        console.log("Response status:", response.status);
        return response.json();
    })
    .then(data => {
        console.log("Full response data:", data);
        if (data.appointment) {
            console.log("Appointment status:", data.appointment.status);
            console.log("Message:", data.appointment.message);
            
            if (data.appointment.status === 'success') {
                Swal.fire({
                    title: 'Success!',
                    text: 'You have successfully made an Appointment!',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3085d6',
                    backdrop: true
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: data.appointment.message,
                    icon: 'error',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#d33'
                });
            }

        } else {
            console.log("Unexpected response format:", data);
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
        Swal.fire({
            title: 'Error',
            text: "An error occurred while creating the appointment.",
            icon: 'error',
            position: 'top',
            toast: true,
            showConfirmButton: false,
            timer: 3000
        });
    });
}

function generateAndSaveQRCode(name) {


}