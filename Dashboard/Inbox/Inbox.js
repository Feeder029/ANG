document.addEventListener('DOMContentLoaded', function() {
    // Call function to display appointments
    displayAppointments();

    // Get button elements
    const autoRemindersBtn = document.getElementById('autoRemindersBtn');
    const pendingRemindersSection = document.getElementById('pendingRemindersSection');
    const sendNotificationsBtn = document.getElementById('sendNotificationsBtn');
    
    // Check if elements exist before adding event listeners
    if (autoRemindersBtn) {
        // Auto-send reminders button click
        autoRemindersBtn.addEventListener('click', function() {
            if (pendingRemindersSection.style.display === 'none' || 
                pendingRemindersSection.style.display === '') {
                pendingRemindersSection.style.display = 'block';
                this.innerHTML = '<span>❌</span> Cancel Auto-Send';
                this.classList.remove('btn-primary');
                this.classList.add('btn-outline');
            } else {
                pendingRemindersSection.style.display = 'none';
                this.innerHTML = '<span>🔔</span> Auto-Send Reminders';
                this.classList.remove('btn-outline');
                this.classList.add('btn-primary');
            }
        });
    } else {
        console.warn("Element with ID 'autoRemindersBtn' not found");
    }
    
    // Add event listener for send notifications button if it exists
    if (sendNotificationsBtn) {
        sendNotificationsBtn.addEventListener('click', function() {
            const checkboxes = document.querySelectorAll('.appointment-checkbox:checked');
            if (checkboxes.length > 0) {
                // Alert each email address one by one
                checkboxes.forEach(checkbox => {
                    const appointmentItem = checkbox.closest('.appointment-item');
                    const emailElement = appointmentItem.querySelector('.appointment-email');
                    const nameElement = appointmentItem.querySelector('.appointment-name');
                    const appointmentDetails = appointmentItem.querySelector('.appointment-details').textContent;

                    // Split to get individual parts
                    const [dayAndTime, services] = appointmentDetails.split(' || Services: ');
                    const [day, time] = dayAndTime.split(' at ');
                    
                    // Assign to variables
                    const DayElement = day.trim();
                    const TimeElement = time.trim();
                    const ServicesElement = services.trim();
                                       
                    if (emailElement) {
                        const email = emailElement.textContent;
                        const name = nameElement ? nameElement.textContent : 'Patient';
                        SendEmail(email, name, DayElement, TimeElement, ServicesElement);
                    }
                });
                
                if (pendingRemindersSection) {
                    pendingRemindersSection.style.display = 'none';
                    if (autoRemindersBtn) {
                        autoRemindersBtn.innerHTML = '<span>🔔</span> Auto-Send Reminders';
                        autoRemindersBtn.classList.remove('btn-outline');
                        autoRemindersBtn.classList.add('btn-primary');
                    }
                }
            } else {
                alert('Please select at least one appointment to send reminders.');
            }
        });
    } else {
        console.warn("Element with ID 'sendNotificationsBtn' not found");
    }
});

function displayAppointments() {
    // Check if pendingRemindersSection exists before attempting to populate it
    const pendingRemindersSection = document.getElementById('pendingRemindersSection');
    if (!pendingRemindersSection) {
        console.error("Element with ID 'pendingRemindersSection' not found");
        return;
    }

    // Show loading indicator
    pendingRemindersSection.innerHTML = '<div class="loading">Loading appointments...</div>';

    fetch("../Appointment/Appointment.php?action=getappointment")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (!Array.isArray(data) || data.length === 0) {
                pendingRemindersSection.innerHTML = '<div class="no-appointments">No upcoming appointments found.</div>';
                return;
            }
            
            let display = `
            <div class="pending-header">
                <h3>Tomorrow & Today's Appointments</h3>
                <button class="btn btn-success" id="sendNotificationsBtn">
                    <span>✉️</span> Send Selected Notifications
                </button>
            </div>
            <div class="appointments-container">
            `;

            let appointmentsFound = false;
            
            data.forEach(item => {
                let today = new Date();
                let tomorrow = new Date();
                tomorrow.setDate(today.getDate() + 1);
                
                // Format today and tomorrow as 'Month DD YYYY'
                let options = { year: 'numeric', month: 'long', day: '2-digit' };
                let todayStr = today.toLocaleDateString('en-US', options).replace(',', '');
                let tomorrowStr = tomorrow.toLocaleDateString('en-US', options).replace(',', '');
                
                if (item.App_ChosenDate === todayStr || item.App_ChosenDate === tomorrowStr) {
                    appointmentsFound = true;
                    
                    // Determine if appointment is today or tomorrow for display
                    const appointmentDay = item.App_ChosenDate === todayStr ? "Today" : "Tomorrow";
                    
                    display += `
                    <div class="appointment-item">
                        <input type="checkbox" class="appointment-checkbox" checked>
                        <div class="appointment-info">
                            <div class="appointment-title"><span class="appointment-name">${item.DisplayName}</span> | <span class="appointment-email">${item.ACC_Email}</span></div>
                            <div class="appointment-details">${appointmentDay} at ${item.App_ChosenTime || 'N/A'} || Services: ${item.Services}</div>
                        </div>
                    </div>`;
                }
            });
            
            display += `</div>`;
            
            if (!appointmentsFound) {
                display = '<div class="no-appointments">No appointments scheduled for today or tomorrow.</div>';
            }

            pendingRemindersSection.innerHTML = display;
            
            // Re-attach event listener to the newly created button
            const newSendNotificationsBtn = document.getElementById('sendNotificationsBtn');
            if (newSendNotificationsBtn) {
                newSendNotificationsBtn.addEventListener('click', function() {
                    const checkboxes = document.querySelectorAll('.appointment-checkbox:checked');
                    if (checkboxes.length > 0) {
                        let sentCount = 0;
                        const totalToSend = checkboxes.length;

                        checkboxes.forEach(checkbox => {
                            const appointmentItem = checkbox.closest('.appointment-item');
                            const emailElement = appointmentItem.querySelector('.appointment-email');
                            const nameElement = appointmentItem.querySelector('.appointment-name');

                            const appointmentDetails = appointmentItem.querySelector('.appointment-details').textContent;

                            // Split to get individual parts
                            const [dayAndTime, services] = appointmentDetails.split(' || Services: ');
                            const [day, time] = dayAndTime.split(' at ');
                            
                            // Assign to variables
                            const DayElement = day.trim();
                            const TimeElement = time.trim();
                            const ServicesElement = services.trim();
                            
                            if (emailElement) {
                                const email = emailElement.textContent;
                                const name = nameElement ? nameElement.textContent : 'Patient';
                                
                                // Call SendEmail function with proper parameters
                                SendEmail(email, name, DayElement, TimeElement, ServicesElement)
                                    .then(success => {
                                        sentCount++;
                                        if (sentCount === totalToSend) {
                                            // All emails have been processed
                                            Swal.fire({
                                                icon: 'success',
                                                title: 'Reminder Emails Sent',
                                                text: `Successfully sent ${sentCount} reminder emails.`
                                            });
                                            
                                            // Reset UI
                                            pendingRemindersSection.style.display = 'none';
                                            const autoRemindersBtn = document.getElementById('autoRemindersBtn');
                                            if (autoRemindersBtn) {
                                                autoRemindersBtn.innerHTML = '<span>🔔</span> Auto-Send Reminders';
                                                autoRemindersBtn.classList.remove('btn-outline');
                                                autoRemindersBtn.classList.add('btn-primary');
                                            }
                                        }
                                    });
                            }
                        });
                    } else {
                        alert('Please select at least one appointment to send reminders.');
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error fetching appointment data:', error);
            pendingRemindersSection.innerHTML = `<div class="error">Error loading appointments: ${error.message}</div>`;
        });
}

function SendEmail(email, name, date, time, service) {
    console.log(email)
    return new Promise((resolve, reject) => {
        fetch('inbox.php?action=sendemail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, name: name, date: date, time: time, service:service})
        })
        .then(res => {
            if (!res.ok) throw new Error(`Server error: ${res.status}`);
            return res.json();
        })
        .then(data => {
            if (data.success) {
                console.log(`Email sent successfully to ${email}`);
                resolve(true);
            } else {
                console.error(`Failed to send email to ${email}: ${data.message}`);
                Swal.fire({
                    icon: 'error',
                    title: 'Email Sending Failed',
                    text: data.message || 'Could not send reminder email'
                });
                resolve(false);
            }
        })
        .catch(error => {
            console.error('Email sending error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Something Went Wrong!',
                text: error.message || 'Failed to send email reminder'
            });
            resolve(false);
        });
    });
}