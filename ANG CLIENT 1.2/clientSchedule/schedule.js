import { GetCookie } from '../../Cookies/cookies.js';

window.DisplaySchedule = DisplaySchedule;

document.addEventListener('DOMContentLoaded', function() {
    DisplaySchedule("ALL");
});

function DisplaySchedule(SID){
    
    const PatientID = GetCookie('patientID');

    const action = "schedules"
    

    fetch(`schedule.php?action=${action}`)
    .then(response=>response.json())
    .then(data=>{
        let display = ``;
        let mobiledisplay = ``;
        let a = 0;
        let B = 0;
        let CP = 0;
        let CD = 0;
        let RD= 0;

        data.forEach(item => {

            if(item.PatientID==PatientID){
                a++;

                switch (item.STAT_Name) {
                    case "Booked":
                      B++
                      break;
                    case "Complete":
                      CP++
                      break;
                    case "Cancelled":
                      CD++
                      break;
                    case "Reschedule":
                      RD++
                      break;
                }             

                if(item.STAT_Name==SID || SID == "ALL"){
                    const imgSrc = item.image ? 
                    `data:image/jpeg;base64,${item.image}` : 
                    "/api/placeholder/100/100";
                
                    display += `                        
                    <tr>
                    <td>${item.App_ChosenDate}</td>
                    <td>${item.App_ChosenTime}</td>
                    <td>${item.Services}</td>
                    <td>${item.STAT_Name}</td>
                    <td><img src="${imgSrc}" alt="QR Code" class="qr-code"></td>
                    <td>
                    <div class="action-buttons">
                    <button class="btn btn-cancel btn-tooltip" data-tooltip="Cancel Appointment" data-value="${item.AppointmentID}">
                    <i class="fas fa-times"></i>
                    </button>
                    <button class="btn btn-download btn-tooltip" data-tooltip="Download QR Code" data-qr="${item.image ? item.image : ''}" data-name="QRCODE_${item.App_ChosenDate.replace(/[\/\\:*?"<>|]/g, '_')}">
                    <i class="fas fa-download"></i>
                    </button>
                    </div>
                     </td>
                     </tr>`;

                     mobiledisplay += `
                        <div class="appointment-card">
                        <div class="card-header">
                            <div class="card-title">APPOINTMENT #${a}</div>
                            <div class="card-status status-pending">${item.STAT_Name}</div>
                        </div>
                        <div class="card-body">
                            <div class="card-info-item">
                                <div class="info-label">Date</div>
                                <div class="info-value">${item.App_ChosenDate}</div>
                            </div>
                            <div class="card-info-item">
                                <div class="info-label">Time</div>
                                <div class="info-value">${item.App_ChosenTime}</div>
                            </div>
                            <div class="card-info-item">
                                <div class="info-label">Procedure</div>
                                <div class="info-value">${item.STAT_Name}</div>
                            </div>
                        </div>
                        <div class="card-footer">
                            <img src="${imgSrc}" alt="QR Code" class="card-qr">
                            <div class="card-actions">
                                    <button class="btn btn-cancel btn-tooltip" data-tooltip="Cancel Appointment" data-value="${item.AppointmentID}">
                                    <i class="fas fa-times"></i>
                                </button>
                                     <button class="btn btn-download btn-tooltip" data-tooltip="Download QR Code" data-qr="${item.image ? item.image : ''}" data-name="QRCODE_${item.App_ChosenDate.replace(/[\/\\:*?"<>|]/g, '_')}">
                                    <i class="fas fa-download"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    `;
              }
            }
        })


        Counts(a, B, CP, CD, RD);

        document.getElementById('scheduletable').innerHTML = display; // Add to the HTML
        document.getElementById('mobile-view').innerHTML = mobiledisplay; // Add to the HTML

        
        document.querySelectorAll('.btn-cancel').forEach(function(button) {
            button.addEventListener('click', function() {
              const appointmentID = this.getAttribute('data-value');
              
              Swal.fire({
                title: 'Appointment Options',
                text: 'What would you like to do with this appointment?',
                icon: 'question',
                showCancelButton: true,
                showDenyButton: true,
                confirmButtonColor: '#d33',
                denyButtonColor: '#3085d6',
                cancelButtonColor: '#858585',
                confirmButtonText: 'Cancel Appointment',
                denyButtonText: 'Reschedule',
                cancelButtonText: 'Go Back'
              }).then((result) => {
                if (result.isConfirmed) {
                  // User clicked "Cancel Appointment"
                  CancelAppointment(6, appointmentID);
                } else if (result.isDenied) {
                  // User clicked "Reschedule"
                  CancelAppointment(7, appointmentID);
                }
                // If result.dismiss, user clicked "Go Back" or outside the dialog - no action needed
              });
            });
          });
          
        // Add event listeners to the download buttons
        const downloadButtons = document.querySelectorAll('.btn-download');
        downloadButtons.forEach(button => {
            button.addEventListener('click', function() {
                const qrData = this.getAttribute('data-qr');
                const fileName = this.getAttribute('data-name');
                
                if (qrData) {
                    // Create a link to download the image
                    const downloadLink = document.createElement('a');
                    downloadLink.href = `data:image/jpeg;base64,${qrData}`;
                    downloadLink.download = `${fileName}.jpg`;
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                } else {
                    console.log('No QR code available for download');
                    // Optionally add an alert to inform the user
                    alert('No QR code available for download');
                }
            });
        });

    }).catch(error=>console.error('Error fetching api.php data:', error))
}

function CancelAppointment(StatID, AppID){
    fetch(`schedule.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            AppointmentID: AppID,
            StatusID: StatID
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Appointment updated successfully');
            // Show success message
            Swal.fire({
                title: 'Success!',
                text: StatID == 6 ? 'Appointment cancelled successfully.' : 'Appointment rescheduled successfully.',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                DisplaySchedule("ALL");
                // location.reload();
            });
        } else {
            console.error('Error updating appointment:', data.error || 'Unknown error');
            // Show error message
            Swal.fire({
                title: 'Error',
                text: data.error || 'Failed to update appointment. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    })
    .catch(error => {
        console.error('Error updating appointment:', error);
        // Show error message
        Swal.fire({
            title: 'Error',
            text: 'Failed to connect to server. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    });
}

function Counts(a, B, CP, CD, RD){
// Select all span elements with class "tab-count"
  const allCountSpan = document.querySelector('[data-tab="all"] .tab-count');
  const bookedCountSpan = document.querySelector('[data-tab="confirmed"] .tab-count');
  const completedCountSpan = document.querySelector('[data-tab="completed"] .tab-count');
  const cancelledCountSpan = document.querySelector('[data-tab="cancelled"] .tab-count');
  const rescheduledCountSpan = document.querySelector('[data-tab="rescheduled"] .tab-count');
  
  // Update the text content with the new counts
  allCountSpan.textContent = a;
  bookedCountSpan.textContent = B;
  completedCountSpan.textContent = CP;
  cancelledCountSpan.textContent = CD;
  rescheduledCountSpan.textContent = RD;
}





























// document.addEventListener('DOMContentLoaded', function() {
//     // Sidebar navigation functionality
//     const sidebarItems = document.querySelectorAll('.sidebar-item');
//     const panelContents = document.querySelectorAll('.panel-content');
    
//     sidebarItems.forEach(item => {
//         item.addEventListener('click', function() {
//             // Remove active class from all sidebar items and panels
//             sidebarItems.forEach(i => i.classList.remove('active'));
//             panelContents.forEach(p => p.classList.remove('active'));
            
//             // Add active class to clicked item
//             item.classList.add('active');
            
//             // Show corresponding panel
//             const panelId = item.getAttribute('data-panel') + '-panel';
//             document.getElementById(panelId).classList.add('active');
//         });
//     });
    
//     // Calendar functionality
//     const calendarGrid = document.getElementById('calendar-grid');
//     const monthYearElement = document.querySelector('.month-year');
//     const calendarPrevButton = document.querySelector('.calendar-header .prev');
//     const calendarNextButton = document.querySelector('.calendar-header .next');
    
//     let currentDate = new Date(2025, 2, 30); // Current date: March 30, 2025
//     let currentMonth = currentDate.getMonth();
//     let currentYear = currentDate.getFullYear();
//     let selectedDate = new Date(2025, 2, 31); // March 31, 2025 (default selected date)
    
//     // Initialize calendar
//     generateCalendar(currentMonth, currentYear);
    
//     // Event listeners for calendar navigation
//     calendarPrevButton.addEventListener('click', function() {
//         currentMonth--;
//         if (currentMonth < 0) {
//             currentMonth = 11;
//             currentYear--;
//         }
//         generateCalendar(currentMonth, currentYear);
//     });
    
//     calendarNextButton.addEventListener('click', function() {
//         currentMonth++;
//         if (currentMonth > 11) {
//             currentMonth = 0;
//             currentYear++;
//         }
//         generateCalendar(currentMonth, currentYear);
//     });
    
//     // Function to generate calendar
//     function generateCalendar(month, year) {
//         // Clear existing calendar
//         calendarGrid.innerHTML = '';
        
//         // Set month and year text
//         const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
//         monthYearElement.textContent = `${monthNames[month]} ${year}`;
        
//         // Add day headers
//         const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//         dayNames.forEach(day => {
//             const dayHeader = document.createElement('div');
//             dayHeader.className = 'calendar-day-header';
//             dayHeader.textContent = day;
//             calendarGrid.appendChild(dayHeader);
//         });
        
//         // Get first day of month and total days
//         const firstDay = new Date(year, month, 1).getDay();
//         const daysInMonth = new Date(year, month + 1, 0).getDate();
        
//         // Add empty cells for days before first day of month
//         for (let i = 0; i < firstDay; i++) {
//             const emptyDay = document.createElement('div');
//             emptyDay.className = 'calendar-day empty';
//             calendarGrid.appendChild(emptyDay);
//         }
        
//         // Add day cells
//         for (let i = 1; i <= daysInMonth; i++) {
//             const dayCell = document.createElement('div');
//             dayCell.className = 'calendar-day';
//             dayCell.textContent = i;
            
//             // Check if this date is in the past
//             const dateToCheck = new Date(year, month, i);
//             const isPastDate = dateToCheck < currentDate;
            
//             if (isPastDate) {
//                 dayCell.classList.add('disabled');
//             } else {
//                 // Check if this date matches the selected date
//                 if (selectedDate && 
//                     i === selectedDate.getDate() && 
//                     month === selectedDate.getMonth() && 
//                     year === selectedDate.getFullYear()) {
//                     dayCell.classList.add('active');
//                 }
                
//                 // Add click event to select date (only for future dates)
//                 dayCell.addEventListener('click', function() {
//                     // Remove active class from all days
//                     document.querySelectorAll('.calendar-day').forEach(day => {
//                         day.classList.remove('active');
//                     });
//                     // Add active class to clicked day
//                     dayCell.classList.add('active');
//                     selectedDate = new Date(year, month, i);
//                 });
//             }
            
//             // Check if this date is today
//             if (i === currentDate.getDate() && 
//                 month === currentDate.getMonth() && 
//                 year === currentDate.getFullYear()) {
//                 dayCell.classList.add('today');
//             }
            
//             calendarGrid.appendChild(dayCell);
//         }
//     }
    
//     // Time slot selection functionality
//     const timeSlots = document.querySelectorAll('.time-slot');
//     timeSlots.forEach(slot => {
//         slot.addEventListener('click', function() {
//             timeSlots.forEach(s => s.classList.remove('active'));
//             slot.classList.add('active');
//         });
//     });
    
//     // Procedure selection functionality
//     const procedureItems = document.querySelectorAll('.procedure-item');
//     procedureItems.forEach(item => {
//         item.addEventListener('click', function() {
//             procedureItems.forEach(i => i.classList.remove('active'));
//             item.classList.add('active');
//         });
//     });
    
//     // Procedure carousel navigation
//     const proceduresContainer = document.getElementById('procedures');
//     const procedurePrevButton = document.querySelector('.procedure-nav.prev');
//     const procedureNextButton = document.querySelector('.procedure-nav.next');
//     let procedureScrollPosition = 0;
    
//     procedurePrevButton.addEventListener('click', function() {
//         procedureScrollPosition -= 200;
//         if (procedureScrollPosition < 0) procedureScrollPosition = 0;
//         proceduresContainer.style.transform = `translateX(-${procedureScrollPosition}px)`;
//     });
    
//     procedureNextButton.addEventListener('click', function() {
//         const maxScroll = proceduresContainer.scrollWidth - proceduresContainer.clientWidth;
//         procedureScrollPosition += 200;
//         if (procedureScrollPosition > maxScroll) procedureScrollPosition = maxScroll;
//         proceduresContainer.style.transform = `translateX(-${procedureScrollPosition}px)`;
//     });
    
//     // Tab navigation for schedule panel
//     const tabItems = document.querySelectorAll('.tab-item');
    
//     tabItems.forEach(tab => {
//         tab.addEventListener('click', function() {
//             tabItems.forEach(t => t.classList.remove('active'));
//             tab.classList.add('active');
            
//             // Filter appointments by status (in a real app, this would update the table)
//             const status = tab.getAttribute('data-tab');
//             console.log(`Filtering appointments by status: ${status}`);
            
//             // For demo purposes, we're just logging the action
//             if (status === 'all') {
//                 // Show all appointments
//             } else {
//                 // Filter appointments by status
//             }
//         });
//     });
    
//     // Book appointment button functionality
//     const bookButton = document.querySelector('.book-btn');
    
//     bookButton.addEventListener('click', function() {
//         // Get selected date, time, and procedure
//         const selectedTimeSlot = document.querySelector('.time-slot.active')?.textContent || '';
//         const selectedProcedure = document.querySelector('.procedure-item.active')?.querySelector('.procedure-name')?.textContent || '';
        
//         if (!selectedDate || !selectedTimeSlot || !selectedProcedure) {
//             alert('Please select a date, time, and procedure.');
//             return;
//         }
        
//         // Format date for display
//         const formattedDate = `${selectedDate.getDate().toString().padStart(2, '0')}/${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}/${selectedDate.getFullYear()}`;
        
//         // In a real app, this would send data to the server
//         alert(`Booking appointment for:\nDate: ${formattedDate}\nTime: ${selectedTimeSlot}\nProcedure: ${selectedProcedure}`);
        
//         // Switch to schedule panel to show the new appointment
//         // document.querySelector('.sidebar-item[data-panel="schedule"]').click();
//     });
    
//     // Search functionality
//     const searchInput = document.querySelector('.search-input');
    
//     searchInput.addEventListener('input', function() {
//         const searchTerm = searchInput.value.toLowerCase();
        
//         // In a real app, this would filter the appointments table
//         console.log(`Searching for: ${searchTerm}`);
//     });
    
//     // Date range filter
//     const fromDateInput = document.querySelector('.from-date');
//     const toDateInput = document.querySelector('.to-date');
    
//     [fromDateInput, toDateInput].forEach(input => {
//         input.addEventListener('change', function() {
//             const fromDate = fromDateInput.value;
//             const toDate = toDateInput.value;
            
//             if (fromDate && toDate) {
//                 // this would filter the appointments table by date range
//                 console.log(`Filtering appointments from ${fromDate} to ${toDate}`);
//             }
//         });
//     });
    
//     // Button actions for appointments
//     const cancelButtons = document.querySelectorAll('.btn-cancel');
//     const downloadButtons = document.querySelectorAll('.btn-download');
    
//     cancelButtons.forEach(button => {
//         button.addEventListener('click', function() {
//             const row = button.closest('tr');
//             const date = row.cells[0].textContent;
//             const time = row.cells[1].textContent;
            
//             if (confirm(`Are you sure you want to cancel your appointment on ${date} at ${time}?`)) {
//                 // In a real app, this would send a cancellation request to the server
//                 alert('Appointment cancelled.');
                
//                 // Update status in the table
//                 row.cells[3].textContent = 'CANCELLED';
//             }
//         });
//     });
    
//     downloadButtons.forEach(button => {
//         button.addEventListener('click', function() {
//             // In a real app, this would trigger the download of the QR code
//             alert('QR Code download started.');
//         });
//     });
    
//     // Dark mode toggle
//     const darkModeToggle = document.querySelector('.user-panel .icon:first-child');
    
//     darkModeToggle.addEventListener('click', function() {
//         document.body.classList.toggle('dark-mode');
        
//         // Toggle icon
//         const icon = darkModeToggle.querySelector('i');
//         if (icon.classList.contains('fa-moon')) {
//             icon.classList.remove('fa-moon');
//             icon.classList.add('fa-sun');
//         } else {
//             icon.classList.remove('fa-sun');
//             icon.classList.add('fa-moon');
//         }
//     });
// });

// document.addEventListener('DOMContentLoaded', function() {
//     // Edit profile button functionality
//     const editProfileBtn = document.querySelector('.edit-profile-btn');
//     const inputs = document.querySelectorAll('.field-input');
//     const selects = document.querySelectorAll('.dropdown-select');
    
//     editProfileBtn.addEventListener('click', function() {
//         if (editProfileBtn.textContent === 'EDIT PROFILE') {
//             // Enable editing
//             inputs.forEach(input => {
//                 input.removeAttribute('readonly');
//                 input.style.backgroundColor = 'white';
//             });
            
//             selects.forEach(select => {
//                 select.disabled = false;
//                 select.style.backgroundColor = 'white';
//             });
            
//             editProfileBtn.textContent = 'SAVE PROFILE';
//             editProfileBtn.style.backgroundColor = '#4a90e2';
//         } else {
//             // Disable editing and save (in a real app, would send data to server)
//             inputs.forEach(input => {
//                 input.setAttribute('readonly', true);
//                 input.style.backgroundColor = '#f0f0f0';
//             });
            
//             selects.forEach(select => {
//                 select.disabled = true;
//                 select.style.backgroundColor = '#f0f0f0';
//             });
            
//             editProfileBtn.textContent = 'EDIT PROFILE';
//             editProfileBtn.style.backgroundColor = '#10b981';
            
//             // Here would be code to save the data
//             alert('Profile information saved!');
//         }
//     });
    
//     // Change profile picture button
//     const changeProfileBtn = document.querySelector('.change-profile-btn');
//     changeProfileBtn.addEventListener('click', function() {
//         // In a real app, would open file picker
//         alert('Profile picture change functionality would be implemented here');
//     });
    
//     // Simulating data loading
//     setTimeout(() => {
//         // Populate fields with dummy data
//         document.querySelector('.user-name').textContent = 'LASTNAME';
        
//         // Populate form fields (would typically come from an API)
//         const dummyData = {
//             firstName: '',
//             lastName: '',
//             middleName: '',
//             suffix: '',
//             gender: '',
//             age: '',
//             dob: '',
//             houseNo: '',
//             lotNo: '',
//             street: '',
//             barangay: '',
//             city: '',
//             province: '',
//             email: '',
//             facebook: '',
//             contact: ''
//         };
        
//         // Apply data to fields
        
//     }, 500);
// });
