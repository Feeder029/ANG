function GetNumbers(){

    fetch("Dashboard.php?action=getnumbers")
    .then(response=>response.json())
    .then(data=>{

        let AccClass = "";
        let AppClass = "";
        let RevenueClass = "";

        let headerdisplay = "";
        let statsdisplay = "";

        data.forEach(item => {


            AccClass = ClassStatement(item.PatientGrowthPercentage)
            AppClass = ClassStatement(item.AppointmentGrowthPercentage)
            RevenueClass = ClassStatement(item.RevenueGrowthPercentage)
            

            headerdisplay += `<div class="header-left">
            <p>Good Morning/Evening,</p>
            <h1>Dr. Alvin Gumafelix</h1>
            <p>Dentist, BDS, BChD</p>
            <p>You have total <span class="appointment-count">${item.TodayAppointment} appointments</span> today.</p>
            </div>`;

            statsdisplay += `            <div class="stat-card">
                <div class="stat-icon icon-patients">
                    <i class="fa-solid fa-users"></i>
                </div>
                <div class="stat-details">
                    <h3>TOTAL PATIENTS/ACCOUNTS</h3>
                    <p class="number">${item.ThisMonth}</p>
                    <p class="trend ${AccClass}"> ${item.PatientGrowthPercentage}% from last month</p>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon icon-appointments">
                    <i class="fa-solid fa-calendar"></i>
                </div>
                <div class="stat-details">
                    <h3>TOTAL APPOINTMENTS</h3>
                    <p class="number">${item.AppointmentThisMonth}</p>
                    <p class="trend ${AppClass}">${item.AppointmentGrowthPercentage}% from last month</p>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon icon-services">
                    <i class="fa-solid fa-stethoscope"></i>
                </div>
                <div class="stat-details">
                    <h3>TOTAL SERVICES</h3>
                    <p class="number">${item.Services}</p>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon icon-revenue">
                    <i class="fa-solid fa-dollar-sign"></i>
                </div>
                <div class="stat-details">
                    <h3>REVENUE</h3>
                    <p class="number">₱${item.RevenueThisMonth}</p>
                    <p class="trend ${RevenueClass}">+${item.RevenueGrowthPercentage}% from last month</p>
                </div>
            </div>
        `
        });

        document.getElementById('headerpost').innerHTML = headerdisplay; 
        document.getElementById('stats').innerHTML = statsdisplay; 

    }).catch(error=>console.error('Error fetching Appointment.php data:', error))
}

function GetAppointment(){

    fetch("../Appointment/Appointment.php?action=getappointment")
    .then(response=>response.json())
    .then(data=>{

        let display = "";
        let  i = 0;
        data.forEach(item => {

            let today = new Date().toLocaleDateString("en-US", {
                timeZone: "Asia/Manila",
                year: "numeric",
                month: "short",
                day: "2-digit"
            }).replace(",", "");
            

            if(item.STAT_Name=="BOOKED"&&i<6&&item.App_ChosenDate == today){

 
                display += `<div class="appointment-item">
                            <div class="appointment-time">
                                <span class="time">${item.App_ChosenTime}</span>
                                <span class="date">${item.App_ChosenDate}</span>
                            </div>
                            <div class="appointment-details">
                                <p class="patient-name">${item.DisplayName}</p>
                                <p class="service-type">${item.Services}</p>
                            </div>
                            <span class="badge badge-confirmed">Confirmed</span>
                </div>`;

                i++;
            }
        });

        document.getElementById('sixappointment').innerHTML = display; // Add to the HTML

    }).catch(error=>console.error('Error fetching Appointment.php data:', error))
}


function PendingAccounts(){

    fetch("../Patient/Patient.php?action=getpatient")
    .then(response=>response.json())
    .then(data=>{

        let display = `
        <thead>
            <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Action</th>
            </tr>
        </thead>`;

        console.log(data)

        data.forEach(item => {
            display += `
            
            
            
            `
        })

    }).catch(error=>console.error('Error Fetching Accounts.php: ', error))

    
}


function ClassStatement(item){

    let classname = 'd';

    if(item>0){
        classname = "Positive";
    } else if(item<0){
        classname = "Negative";
    } else {
        classname = "Neutral";
    }
    return classname
}

GetNumbers();
GetAppointment();
PendingAccounts();