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


function Count(paid,unpaid,pending) {

    const paidspan = document.querySelector('#paid-status span');
    const unpaidspan = document.querySelector('#unpaid-status span');
    const pendingspan = document.querySelector('#pending-status span');
    
    paidspan.textContent = paid;
    unpaidspan.textContent = unpaid;
    pendingspan.textContent = pending;
}


GetCount();
DisplayBilling("ALL");