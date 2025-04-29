function GetAppointment(Condition){

    fetch("Appointment.php?action=getappointment")
    .then(response=>response.json())
    .then(data=>{


        let display = `
            <thead class="head-table" >
                <tr id="head">
                    <th id="patient-head">PATIENT</th>
                    <th id="date-head">DATE</th>
                    <th id="time-head">TIME</th>
                    <th id="procedure-head">SERVICES</th>
                    <th id="status-head">STATUS</th>
                    <th id="datesubmit-head">DATE SUBMITTED</th>
                    <th id="action-head">ACTION</th>
                </tr>
            </thead>       
        `

        

        data.forEach(item => {


            if(item.STAT_Name==Condition||Condition=="ALL"){
                const imgSrc = item.image ? 
                `data:image/jpeg;base64,${item.image}` : 
                "/api/placeholder/100/100";
    
                display += `
                    <tr id="data">
                        <td class="patient">
                            <img src="${imgSrc}" alt="">
                            <div class="patient-name">
                                <h2>${item.DisplayName}</h2>
                                <p>${item.ACC_Email}</p>
                            </div>
                        </td>
                        <td id="date">${item.App_ChosenDate}</td>
                        <td id="time">${item.App_ChosenTime}</td>
                        <td id="procedure"><p>${item.Services}</p></td>
                        <td id="status" class="${item.STAT_Name}-status"><p>${item.STAT_Name}</p></td>
                        <td id="submitdate">${item.SubmissionDate} <BR> ${item.SubmissionTime}</td>
                        <td class="action">
                            <button id="edit"><i class="fa-solid fa-pen-to-square"></i></button>
                            <button id="delete"><i class="fa-solid fa-trash"></i></button>
                            <button id="view"><i class="fa-solid fa-eye"></i></button>
                        </td>
                    </tr>
                `
            }


        });

        document.getElementById('AppointmentList').innerHTML = display; // Add to the HTML

    }).catch(error=>console.error('Error fetching Appointment.php data:', error))

}

window.DisplaySchedule = GetAppointment;


function GetCount(){
    fetch("Appointment.php?action=count")
    .then(response=>response.json())
    .then(data=>{

    let Booked = 0; 
    let Complete = 0;
    let Cancelled = 0;
    let Reschedule = 0;
    let Total = 0;

    data.forEach(item => {
    switch(item.STAT_Name) {
    case 'Booked':
      Booked = item.count;
      break;
    case 'Complete':
      Complete = item.count;
      break;
    case 'Cancelled':
      Cancelled = item.count;
      break;
    case 'Reschedule':
      Reschedule = item.count;
      break;
    case 'ALL':
      Total = item.count;
      break;
    }
    });
     
        Count(Booked,Complete,Cancelled,Reschedule);
    }).catch(error=>console.error('Error fetching Appointment.php data:', error))
}


function Count(booked, completed, cancelled, rescheduled) {

    const bookedSpan = document.querySelector('#book-status span');
    const completedSpan = document.querySelector('#complete-status span');
    const cancelledSpan = document.querySelector('#cancel-status span');
    const rescheduledSpan = document.querySelector('#resched-status span');
    
    bookedSpan.textContent = booked;
    completedSpan.textContent = completed;
    cancelledSpan.textContent = cancelled;
    rescheduledSpan.textContent = rescheduled;
}

GetAppointment("ALL");
GetCount();
