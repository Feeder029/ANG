function DisplayBilling(CONDITION){
    fetch("Billing.php?action=getbilling")
    .then(response=>response.json())
    .then(data=>{

        console.log(data)

        let display =  `
            <thead class="head-table">
                <tr id="head">
                        <th id="id-head">ID</th>
                        <th id="patient-head">PATIENT</th>
                        <th id="service-head">SERVICE</th>
                        <th id="method-head">METHOD</th>
                        <th id="amount-head">AMOUNT</th>
                        <th id="paid-head">PAID</th>
                        <th id="status-head">STATUS</th>
                        <th id="date-head">BILLING DATE</th>
                        <!-- <th id="time-head">TIME</th> -->
                        <th id="action-head">ACTION</th>
                </tr>
            </thead>
        `
        data.forEach(item => {

            if(item.STAT_Name==CONDITION||CONDITION=="ALL"){
                const imgSrc = item.image ? 
                `data:image/jpeg;base64,${item.image}` : 
                "/api/placeholder/100/100";
    
                display+=`
                    <tr id="data">
                        <td class="id">${item.BillingID}</td>
                        <td class="patient">
                            <img src="${imgSrc}" alt="">
                            <div class="patient-name">
                                <h2>${item.DisplayName}</h2> 
                                <p>${item.ACC_Email}</p> 
                            </div>
                        </td>
                        <td id="service"><p>${item.Services}</p></td>
                        <td id="method">${item.PM_Name}</td>
                        <td id="amount">${item.Amount}</td>
                        <td id="paid">${item.Payment}</td>
                        <td id="status" class="${item.STAT_Name}-status"><p>${item.STAT_Name}</p></td>
                        <td id="date">${(item.BILL_Date && item.BILL_Date !== '0000-00-00') ? item.BILL_Date : 'N/A'}</td>
                        <!-- <td id="time">8:00 PM</td> -->
                        <td class="action">
                            <button id="delete"><i class="fa-solid fa-trash"></i></button>
                            <button id="edit" class="viewmore" value="${item.BillingID}" popovertarget="myheader"><i class="fa-solid fa-pen-to-square"></i></i></button>
                        </td>
                    </tr>
                `               
            }
        });
    
        document.getElementById('billing').innerHTML = display; // Add to the HTML

        // Add event listeners to view buttons
        document.querySelectorAll('.viewmore').forEach(button => {
            button.addEventListener('click', function () {
                const value = this.value;
                const item = data.find(item => item.BillingID === value);
                
                if (!item) {
                    console.error('Billing record not found:', value);
                    return;
                }
                
                // Get the header element and update its text
                const popoverHeader = document.querySelector('.popover-header h2');
                if (popoverHeader) {
                    popoverHeader.textContent = 'View Billing Details';
                }
                
                // Select all necessary elements
                const clientInfo = document.getElementById('clientInfo');
                const Fee = document.getElementById('Fee');
                const paymentstatus = document.getElementById('paymentstatus');
                const paymentDetails = document.getElementById('paymentDetails');
                const billingDate = document.getElementById('billingDate');
                const payment = document.getElementById('payment');
                const paymentMethod = document.getElementById('paymentMethod');
                
                // Update the selected client area with the client information
                const selectedDiv = document.querySelector('.select-selected span');
                if (selectedDiv) {
                    const imgSrc = item.image ? 
                        `data:image/jpeg;base64,${item.image}` : 
                        "/api/placeholder/100/100";
                        
                    selectedDiv.innerHTML = `
                        <img src="${imgSrc}" class="profile-pic" alt="${item.DisplayName}">
                        <div class="client-info">
                            <div class="client-name">${item.DisplayName}</div>
                            <div class="client-details">${item.ACC_Email} • ${item.Services} • ${item.BILL_Date || 'N/A'}</div>
                        </div>
                    `;
                }
                
                // Set the values in the form
                if (Fee) Fee.value = item.Amount || '';
                
                // Update payment status dropdown
                if (paymentstatus) {
                    // Map status name to status ID
                    let statusId = '10'; // Default to Pending
                    if (item.STAT_Name === 'Paid') statusId = '8';
                    if (item.STAT_Name === 'Unpaid') statusId = '9';
                    paymentstatus.value = statusId;
                    
                    // Show/hide payment details based on status
                    if (item.STAT_Name === 'Paid' && paymentDetails) {
                        paymentDetails.classList.remove('hidden');
                    } else if (paymentDetails) {
                        paymentDetails.classList.add('hidden');
                    }
                }
                
                // Set billing date
                if (billingDate) billingDate.value = item.BILL_Date || '';
                
                // Set payment amount
                if (payment) payment.value = item.Payment || '';
                
                // Set payment method
                if (paymentMethod) {
                    // Map payment method name to ID (assuming IDs match the HTML options)
                    const methodMap = {
                        'Cash': '1',
                        'Credit Card': '2',
                        'GCash': '3',
                        'Bank Transfer': '4',
                        'Insurance': '5'
                    };
                    paymentMethod.value = methodMap[item.PM_Name] || '1';
                }
                
                // Change the submit button text to indicate editing
                const submitBtn = document.querySelector('.submit-btn');
                if (submitBtn) {
                    submitBtn.textContent = 'Update';
                    // Store the billing ID on the button for reference when updating
                    submitBtn.setAttribute('data-billing-id', item.BillingID);
                    // Change the button's onclick function to update instead of submit
                    submitBtn.onclick = function() {
                        UpdateBilling(item.BillingID);
                    };
                }
            });
        });
    }).catch(error=>console.error('Error fetching Biling.php data:', error))
}

Window.DisplayBilling = DisplayBilling;

// Function to handle billing updates
function UpdateBilling(billingId) {
    const Status = document.getElementById("paymentstatus").value;
    const PaymentMethod = document.getElementById("paymentMethod");
    const PMValue = PaymentMethod ? PaymentMethod.value : null;
    const Date = document.getElementById("billingDate")?.value;
    const PM = document.getElementById("payment")?.value || null;
    const Fee = document.getElementById("Fee")?.value;
    
    fetch('Billing.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'           
        },
        body: JSON.stringify({
            action: 'update',
            BillingID: billingId,
            StatusID: Status,
            PaymentMethodID: PMValue,
            BillingDate: Date,
            Amount: Fee,
            Payment: PM
        })
    })
    .then(response => {
        console.log("Response status:", response.status);
        return response.json();
    })
    .then(data => {
        console.log("Full response data:", data);

        if (data.status === 'success') {
            Main();

            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Billing has been successfully updated!',
                confirmButtonText: 'OK',
                zIndex: 9999     
            });

            // Reset the form and close the popover
            document.getElementById('myheader').hidePopover();
            ResetForm();
        } else {
            Swal.fire({
                title: 'Error',
                text: data.message || 'Failed to update billing',
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
            text: "An error occurred while updating the billing record.",
            icon: 'error',
            position: 'top',
            toast: true,
            showConfirmButton: false,
            timer: 3000
        });
    });
}

function ResetForm() {
    // Reset form fields
    document.querySelector('.select-selected span').innerHTML = 'Select client information';
    document.getElementById('Fee').value = '';
    document.getElementById('paymentstatus').value = '10'; // Default to Pending
    document.getElementById('paymentDetails').classList.add('hidden');
    document.getElementById('billingDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('payment').value = '';
    document.getElementById('paymentMethod').value = '1'; // Default to Cash
    
    // Reset submit button
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
        submitBtn.textContent = 'Submit';
        submitBtn.removeAttribute('data-billing-id');
        submitBtn.onclick = Submit;
    }
    
    // Reset header text
    const popoverHeader = document.querySelector('.popover-header h2');
    if (popoverHeader) {
        popoverHeader.textContent = 'Add Billing';
    }
}

// Add button click handler to reset form
document.getElementById('add-btn').addEventListener('click', function() {
    ResetForm();
});

function GetCount(){
    fetch("Billing.php?action=count")
    .then(response=>response.json())
    .then(data=>{

    let Paid = 0; 
    let Unpaid = 0;
    let Pending = 0;
    let Total = 0;

    data.forEach(item => {
    switch(item.STAT_Name) {
    case 'Paid':
        Paid = item.count;
      break;
    case 'Pending':
      Pending = item.count;
      break;
    case 'Unpaid':
        Unpaid = item.count;
      break;
    case 'ALL':
      Total = item.count;
      break;
    }
    });
        Count(Paid,Unpaid,Pending);
    }).catch(error=>console.error('Error fetching Pending.php data:', error))
}


let AppID = 0;

function AppointmentDropdown(){

    fetch("../Appointment/Appointment.php?action=getappointment")
    .then(response=>response.json())
    .then(data=>{

        let display = ``;
        data.forEach(item=>{

            if(item.STAT_Name=="COMPLETE"&&item.BillingID==null){
                // console.log(item)

                const imgSrc = item.image ? 
                `data:image/jpeg;base64,${item.image}` : 
                "/api/placeholder/100/100";


                display += `<div class="select-item" onclick="selectClient(this, ${item.AppointmentID})">
                    <img src="${imgSrc}" class="profile-pic" alt="${item.DisplayName}">
                    <div class="client-info">
                    <div class="client-name">${item.DisplayName}</div>
                    <div class="client-details">${item.ACC_Email} • ${item.Services} • ${item.App_ChosenDate} • ${item.App_ChosenTime} </div>
                    </div>
                </div>`
            }

            document.getElementById('selectItems').innerHTML = display; // Add to the HTML

        })


    }).catch(error=>console.error('Error Fetching Dropdown Appointments: ', error))
}

function Count(paid,unpaid,pending) {

    const paidspan = document.querySelector('#paid-status span');
    const unpaidspan = document.querySelector('#unpaid-status span');
    const pendingspan = document.querySelector('#pending-status span');
    
    paidspan.textContent = paid;
    unpaidspan.textContent = unpaid;
    pendingspan.textContent = pending;
}

const today = new Date().toISOString().split('T')[0];
document.getElementById('billingDate').value = today;


function togglePaymentFields() {
    const status = document.getElementById('paymentstatus').value;
    const paymentDetails = document.getElementById('paymentDetails');
            
    if (status === '8') {
        paymentDetails.classList.remove('hidden');
    } else {
        paymentDetails.classList.add('hidden');
    }

}

function toggleDropdown() {
    const dropdownItems = document.getElementById('selectItems');
    if (dropdownItems.style.display === 'block') {
        dropdownItems.style.display = 'none';
    } else {
        dropdownItems.style.display = 'block';
    }
}

function selectClient(element, AppointmentID) {
    const selectedDiv = document.querySelector('.select-selected span');
    const clientInfo = document.getElementById('clientInfo');
    const content = element.querySelector('.client-info').cloneNode(true);
    const profilePic = element.querySelector('.profile-pic').cloneNode(true);
    
    // Clear the previous content and add the new one
    selectedDiv.innerHTML = '';
    selectedDiv.appendChild(profilePic);
    selectedDiv.appendChild(content);
    
    AppID = AppointmentID;
    
    // Hide dropdown
    document.getElementById('selectItems').style.display = 'none';
}

function Submit() {
    var AppIDs = AppID;  
    var Status = document.getElementById("paymentstatus").value;
    
    var PaymentMethod = document.getElementById("paymentMethod");
    var PMValue = PaymentMethod ? PaymentMethod.value : null;

    var Date = document.getElementById("billingDate")?.value;
    var PM = document.getElementById("payment")?.value || null;

    var Fee = document.getElementById("Fee")?.value;
    
    if(Status == 9 || Status == 10){
        Date = null
    } else {
    }
    
    fetch('Billing.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'           
        },
        body: JSON.stringify({
            AppointmentID: AppIDs,
            StatusID: Status,
            PaymentMethodID: PMValue,
            BillingDate: Date,
            Amount: Fee,
            Payment: PM
        })
    })
    .then(response => {
        console.log("Response status:", response.status);
        return response.json();
    })
    .then(data => {
        console.log("Full response data:", data);

            console.log("Appointment service status:", data.status);

            if (data.status === 'success') {        
                
                console.log(AppID);
                AppID = 0;
                Main();

                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Billing has been successfully added!',
                    confirmButtonText: 'OK'
                });

                document.getElementById('myheader').hidePopover();
                ResetForm();

                }
            else {
                Swal.fire({
                    title: 'Error',
                    text: data.message,
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
            text: "An error occurred while adding billing to the appointment.",
            icon: 'error',
            position: 'top',
            toast: true,
            showConfirmButton: false,
            timer: 3000
        });
    });
}

Window.Submit = Submit;
Window.selectClient = selectClient;


window.onclick = function(event) {
    if (!event.target.closest('.custom-select-container')) {
        document.getElementById('selectItems').style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    Main();
    
    // Add event listener for the add button to ensure proper form reset
    document.getElementById('add-btn').addEventListener('click', ResetForm);
});


function Main(){
    GetCount();
    AppointmentDropdown();
    DisplayBilling("ALL");
}