import { GetCookie } from '../../Cookies/cookies.js';


window.DisplayBilling = DisplayBilling;

document.addEventListener('DOMContentLoaded', function() {
    DisplayBilling("ALL");
});

function DisplayBilling(Status){

    const PatientID = GetCookie('patientID');

    fetch('billing.php')
    .then(response=>response.json())
    .then(data=>{

        let a = 0;
        let PD = 0;
        let UP = 0;
        let PND = 0;

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

        let mobiledisplay =  '';

        data.forEach(item => {

            if(item.PatientID==PatientID){

                a++;
                switch (item.STAT_Name) {
                    case "Paid":
                      PD++
                      break;
                    case "Unpaid":
                      UP++
                      break;
                    case "Pending":
                      PND++
                      break;
                }             

                if(item.STAT_Name==Status || Status == "ALL" ){
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

                     mobiledisplay+=`
                                         <div class="billing-card">
                        <div class="card-header">
                            <div class="card-title">BILLING #1</div>
                            <div class="card-status status-paid">${item.STAT_Name}</div>
                        </div>
                        <div class="card-body">
                            <div class="card-info-item">
                                <div class="info-label">Date</div>
                                <div class="info-value">${item.BILL_Date}</div>
                            </div>
                            <div class="card-info-item">
                                <div class="info-label">Service</div>
                                <div class="info-value">${item.Services}</div>
                            </div>
                            <div class="card-info-item">
                                <div class="info-label">Amount</div>
                                <div class="info-value">${item.Amount}</div>
                            </div>
                            <div class="card-info-item">
                                <div class="info-label">Payment</div>
                                <div class="info-value">${item.Payment}</div>
                            </div>
                            <div class="card-info-item">
                                <div class="info-label">Method</div>
                                <div class="info-value">${item.PM_Name}</div>
                            </div>
                        </div>
                        <div class="card-footer">
                            <div class="card-actions">
                                <button class="btn btn-download btn-tooltip" data-tooltip="Download Receipt">
                                    <i class="fas fa-download"></i>
                                </button>
                            </div>
                        </div>
                    </div>  
                     `
                }
            }
        })

        Counts(a,PD,UP,PND);
        
        document.getElementById('mobile-view').innerHTML = mobiledisplay;
        document.getElementById('billings').innerHTML = display;
        

    }).catch(error=>console.error('Error fetching api.php data:', error))

    
}


function Counts(a,PD,UP,PND){
  // Select all span elements with class "tab-count" based on data-tab attributes
  const allCountSpan = document.querySelector('[data-tab="all"] .tab-count');
  const pendingCountSpan = document.querySelector('[data-tab="pending"] .tab-count');
  const paidCountSpan = document.querySelector('[data-tab="paid"] .tab-count');
  const unpaidCountSpan = document.querySelector('[data-tab="unpaid"] .tab-count');
  
  // Update the text content with the new counts
  allCountSpan.textContent = a;
  pendingCountSpan.textContent = PD;
  paidCountSpan.textContent = UP;
  unpaidCountSpan.textContent = PND;
}

DisplayBilling();