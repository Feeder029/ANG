import { GetCookie } from '../../Cookies/cookies.js';

function DisplayBilling(){
    console.log("Getin")
        
    const PatientID = GetCookie('patientID');

    fetch('billing.php')
    .then(response=>response.json())
    .then(data=>{



        let display = `
                    <thead>
                        <tr>
                            <th>Billing Date</th>
                            <th>Service</th>
                            <th>Amount</th>
                            <th>Payment</th>
                            <th>Payment Method</th>
                            <th>Status</th>
                            <th>Receipt</th>
                        </tr>
                    </thead>`;

        data.forEach(item => {

            if(item.PatientID==PatientID){
                display+= `                    
                <tbody>
                 <tr>
                     <td>${item.BILL_Date}</td>
                     <td>${item.Services}</td>
                     <td>${item.Amount}</td>
                     <td>${item.Payment}</td>
                     <td>${item.PM_Name}</td>
                     <td>${item.STAT_Name}</td>
                     <td>
                         <button class="btn btn-download btn-tooltip" data-tooltip="Download Receipt">
                             <i class="fas fa-download"></i>
                         </button>
                     </td>
                 </tr>`
            }

        })

        document.getElementById('billings').innerHTML = display;
        

    }).catch(error=>console.error('Error fetching api.php data:', error))

    
}

DisplayBilling();