import { GetCookie } from '../../Cookies/cookies.js';

// Global variables
let selectedDate = null;
let selectedTime = null;
let selectedServices = []; // Changed from selectedProcedure to an array of services
let bookedSlots = {
    // "2025-5-5": [`9:00 AM`, `1:00 PM`]
};
// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the calendar with Philippines time
    const now = new Date();
    // Convert to Philippines time (UTC+8)
    const philippinesTime = new Date(now.getTime() + (8 * 60 * 60 * 1000));
    populateCalendar(philippinesTime.getFullYear(), philippinesTime.getMonth());

    ServiceDisplay();
    GetTimeSlots();
    
    // Generate some random booked slots for demonstration
    // generateRandomBookedSlots();
    
    // checkLoginStatus();

    setupEventListeners();
});

//Display all of the Services on the Database
function ServiceDisplay() {
    // Fetch the icon data first
    fetch('icon.json')
    .then(response => response.json())
    .then(iconData => {
        
        fetch('appointment.php?action=getservices') // Call the php which we will get the datas
        .then(response => response.json())
        .then(data => {
            let display = '';
            let i = 0; 

            if (data.length === 0) {
                display = `<h2>There are no current available services.<h2>`;
            } else {


                data.forEach(item => {
                    // Find the corresponding icon for the procedure name
                    let matchingIcon = iconData.find(icon => icon.process.toLowerCase() === item.SER_Name.toLowerCase());

                    // Set the icon source (if a match is found, use it, otherwise use a default icon)
                    let iconSrc = matchingIcon ? matchingIcon.icon : 'https://cdn-icons-png.flaticon.com/128/2932/2932475.png'; // Default icon

                    display += `
                        <div class='procedure-card' data-procedure="${item.ServiceID}">     
                            <img src="${iconSrc}" alt="Tooth" class="procedure-icon">
                            <div class="procedure-name">${item.SER_Name}</div>
                            <div hidden class="procedure-id">${item.ServiceID}</div>
                        </div>
                    `; 

                    i++;
                });
            }
            document.getElementById('procedure').innerHTML = display; // Add to the HTML
            
            // Add event listeners AFTER adding the elements to DOM
            document.querySelectorAll('.procedure-card').forEach(card => {
                card.addEventListener('click', function() {
                    toggleProcedure(this); // Changed to toggle selection
                });
            });

            // Add event listener for clear button
            const clearButton = document.getElementById('clear-services');
            if (clearButton) {
                clearButton.addEventListener('click', clearServiceSelection);
            }
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
    console.log(bookedSlots)


// This will give you: "2025-5-5": ["9:00 AM", "1:00 PM"]

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

// New function to toggle procedure selection
function toggleProcedure(procedureElement) {
    const serviceId = procedureElement.getAttribute('data-procedure');
    
    // Toggle active class
    procedureElement.classList.toggle('active');
    
    // Update selectedServices array
    if (procedureElement.classList.contains('active')) {
        // Add service to the array if not already present
        if (!selectedServices.includes(serviceId)) {
            selectedServices.push(serviceId);
        }
    } else {
        // Remove service from the array
        const index = selectedServices.indexOf(serviceId);
        if (index > -1) {
            selectedServices.splice(index, 1);
        }
    }
    
    // Update selected services count display if it exists
    updateSelectedServicesCount();
}

// Function to clear all selected services
function clearServiceSelection() {
    // Remove active class from all procedures
    document.querySelectorAll('.procedure-card').forEach(card => {
        card.classList.remove('active');
    });
    
    // Clear the selectedServices array
    selectedServices = [];
    
    // Update selected services count display
    updateSelectedServicesCount();
}

// Update the count of selected services
function updateSelectedServicesCount() {
    const countElement = document.querySelector('.selected-services-count');
    if (countElement) {
        countElement.textContent = selectedServices.length;
    }
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
    
    if (selectedServices.length === 0) {
        showError('Please select at least one service for your appointment.');
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
    
    // Get procedure names
    let selectedServiceNames = [];
    selectedServices.forEach(serviceId => {
        const procedureElement = document.querySelector(`.procedure-card[data-procedure="${serviceId}"]`);
        if (procedureElement) {
            const procedureName = procedureElement.querySelector('.procedure-name').textContent;
            selectedServiceNames.push(procedureName);
        }
    });
    
    // Create confirmation message with all selected services
    const servicesText = selectedServiceNames.join(', ');
    const message = `Do you want to proceed with the appointment on ${formattedDate} at ${selectedTime} for the following services:\n${servicesText}?`;

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
            // Convert to Military Time
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
            const PatientID = GetCookie('patientID');
           
            // Create the appointment first, then associate services
            AddAppointment(PatientID, DBDate, formattedMilitaryTime);
           
            // Mark the time slot as booked
            const dateKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`;
            if (!bookedSlots[dateKey]) {
                bookedSlots[dateKey] = [];
            }
            bookedSlots[dateKey].push(selectedTime);
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
    
    // Reset procedures
    document.querySelectorAll('.procedure-card').forEach(card => {
        card.classList.remove('active');
    });
    selectedServices = [];
    
    // Update time slots
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('booked');
    });
}

//Import Appointment to Database
function AddAppointment(PID, ACD, ACT) {
    //appointment.php
    fetch('http://127.0.0.1:5000/update_database_qr', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            PID: PID,                  // Changed from PatientID to PID
            APP_ChosenDate: ACD,       // This matches the Flask endpoint
            APP_ChosenTime: ACT        // This matches the Flask endpoint
        })
    })
    .then(response => {
        console.log("Response status:", response.status);
        return response.json();
    })
    .then(data => {
        console.log("Full response data:", data);
        if (data.message && data.qr_path) {
            // Successfully generated QR code
            console.log("QR Path:", data.qr_path);
            
            console.log("Appointment ID:", data.appointment.id);
                
            // Add each selected service to the appointment
            let successCount = 0;
            let totalServices = selectedServices.length;
            let qrpath = data.qr_path;
            
            selectedServices.forEach((serviceId, index) => {
                AddServiceAppointment(data.appointment.id, serviceId, index === totalServices - 1, qrpath);
            });

        } else {
            Swal.fire({
                title: 'Error',
                text: data.error || "Unknown error occurred",
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#d33'
            });
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

function AddServiceAppointment(AppointmentID, ServiceID, isLastService, QR) {
    fetch('appointment.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            AppointmentID: AppointmentID,
            ServicesID: ServiceID
        })
    })
    .then(response => {
        console.log("Response status:", response.status);
        return response.json();
    })
    .then(data => {
        console.log("Full response data:", data);
        if (data.AS) {
            console.log("Appointment service status:", data.AS.status);
            console.log("Message:", data.AS.message);

            if (data.AS.status === 'success') {
                // Now we can also log the appointment service ID
                console.log("Appointment Service ID:", data.AS.id);
                
                // Only show success message after the last service is added
                if (isLastService) {
                    let qrpath = '../../'+QR;
                    console.log(qrpath);
                    Swal.fire({
                        title: 'Success!',
                        html: `
                          <p>You have successfully made an appointment! Save this QR and show it to the receptionist!</p>
                          <div>
                            <img src="${qrpath}" width="200" height="200" alt="QR image">
                          </div>
                          <div style="margin-top: 15px;">
                            <a href="${qrpath}" download="appointment-qr.png" class="swal2-confirm swal2-styled" 
                               style="display: inline-block; background-color: #28a745; color: white; 
                                      border-radius: 0.25em; padding: 0.625em 1.1em; margin: 0.3125em;
                                      font-size: 0.875em; font-weight: 500; text-decoration: none;">
                              Download QR
                            </a>
                          </div>
                        `,
                        showConfirmButton: true,
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#3085d6',
                        backdrop: true
                      });
                    // Reset selections after successful booking
                    resetSelections();
                }
            } else {
                Swal.fire({
                    title: 'Error',
                    text: data.AS.message,
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
            text: "An error occurred while adding service appointment to the appointment.",
            icon: 'error',
            position: 'top',
            toast: true,
            showConfirmButton: false,
            timer: 3000
        });
    });
}


function GetTimeSlots(){

    fetch('appointment.php?action=getunavailabletimeslots')
    .then(response=>response.json())
    .then(data=>{

        data.forEach(item=>{
            const TimeSlots = item.TimeSlots.replace(/`/g, '').split(',').map(slot => slot.trim());
            bookedSlots[item.FormattedDate] = TimeSlots;
        })
       
    })
    .catch(error => console.error('Error fetching icon.json data:', error));
}

