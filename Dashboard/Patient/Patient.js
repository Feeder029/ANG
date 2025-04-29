function DisplayPatients(CONDITION){

    
    fetch("Patient.php?action=getpatient")
    .then(response=>response.json())
    .then(data=>{

        let display=`
            <thead id="head-table">
                <tr id="head">
                    <th id="id-head">ID</th>
                    <th>PATIENT</th>
                    <th id="gender-head">GENDER</th>
                    <th id="contact-head">CONTACT NO</th>
                    <th id="address-head">ADDRESS</th>
                    <th id="date-head">DATE CREATED</th>
                    <th id="status-head">STATUS</th>
                    <th id="action-head">ACTION</th>
                </tr>
            </thead>       
        `;

        data.forEach(item => {

            const imgSrc = item.image ? 
            `data:image/jpeg;base64,${item.image}` : 
            "/api/placeholder/100/100";


            if(item.STAT_Name==CONDITION||CONDITION=="ALL"){
                display+=`
                <tr id="data">
                  <td class="id">${item.PatientID}</td>
                  <td class="patient">
                      <img src="${imgSrc}" alt="">
                      <div class="patient-name">
                          <h2>${item.DisplayName}</h2>
                          <p>${item.ACC_Email}</p>
                      </div>
                  </td>
                  <td id="gender">${item.P_Gender}</td>
                  <td id="contact">${item.P_ContactNo}</td>
                  <td>${item.FullAddress}</td>
                  <td id="datecreated">${item.ACC_DateCreated}</td>
                  <td id="status" class="${item.STAT_Name}-status"><p>${item.STAT_Name}</p></td>
                  <td class="action">
                      <button id="edit"><i class="fa-solid fa-pen-to-square"></i></button>
                      <button id="delete"><i class="fa-solid fa-trash"></i></button>
                      <button id="view"><i class="fa-solid fa-eye"></i></button>
                  </td>
              </tr>           
              `;
            }

        });


        document.getElementById('patient').innerHTML = display; // Add to the HTML

    }).catch(error=>console.error('Error fetching Appointment.php data:', error))

}

window.DisplayPatients = DisplayPatients;


function GetCount(){
    fetch("Patient.php?action=count")
    .then(response=>response.json())
    .then(data=>{

    let Active = 0; 
    let Pending = 0;
    let Inactive = 0;
    let Total = 0;

    data.forEach(item => {
    switch(item.STAT_Name) {
    case 'Active':
      Active = item.count;
      break;
    case 'Pending':
      Pending = item.count;
      break;
    case 'Inactive':
      Inactive = item.count;
      break;
    case 'ALL':
      Total = item.count;
      break;
    }
    });
        Count(Active,Inactive,Pending);
    }).catch(error=>console.error('Error fetching Appointment.php data:', error))
}


function Count(active,inactive,pending ) {

    const pendingspan = document.querySelector('#pending-status span');
    const activespan = document.querySelector('#active-status span');
    const inactivespan = document.querySelector('#inactive-status span');
    
    activespan.textContent = active;
    inactivespan.textContent = inactive;
    pendingspan.textContent = pending;
}


DisplayPatients("ALL");
GetCount();