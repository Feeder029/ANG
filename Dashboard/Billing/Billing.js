function DisplayBilling(CONDITION){


    fetch("Billing.php?action=getbilling")
    .then(response=>response.json())
    .then(data=>{

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
                        <td id="date">${item.BILL_Date}</td>
                        <!-- <td id="time">8:00 PM</td> -->
                        <td class="action">
                            <button id="edit"><i class="fa-solid fa-pen-to-square"></i></button>
                            <button id="delete"><i class="fa-solid fa-trash"></i></button>
                            <button id="view"><i class="fa-solid fa-eye"></i></button>
                        </td>
                    </tr>
                `               
            }

        });


        document.getElementById('billing').innerHTML = display; // Add to the HTML



    }).catch(error=>console.error('Error fetching Biling.php data:', error))


}

Window.DisplayBilling = DisplayBilling;

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
    var Status = document.getElementById("paymentstatus");
    var StatusValue = Status ? Status.value : null;
    
    var PaymentMethod = document.getElementById("paymentMethod");
    var PMValue = PaymentMethod ? PaymentMethod.value : null;
    
    var AM = document.getElementById("amount");
    var AMValue = AM ? AM.value : null;


    var Date = document.getElementById("billingDate")?.value || null;
    var PM = document.getElementById("payment")?.value || null;
    var Fee = document.getElementById("Fee")?.value || null;

    
    fetch('Billing.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'           
        },
        body: JSON.stringify({
            AppointmentID: AppIDs,
            StatusID: StatusValue,
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
                        confirmButtonText: 'OK',
                        zIndex: 9999     
                    });


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




function Main(){
    GetCount();
    AppointmentDropdown();
    DisplayBilling("ALL");
}

Main();




