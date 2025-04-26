import { GetCookie } from '../../Cookies/cookies.js';
import { DeleteCookie } from '../../Cookies/cookies.js';


function checkLoginStatus() {
    console.log("Checklog");
    const patientId = GetCookie('ACCID');
    const PatientID = GetCookie('patientID');
    const Cookie = GetCookie('CookieValue');

    if (PatientID) {
      console.log(`Patient ID ${patientId} and ${PatientID} is logged in`);
    } else {
        window.location.href = '../../Website/login_new/patient_login.html';  // This will navigate to a new URL
    }

    // DeleteCookie('ACCID');
}
function Logout(){
const logout = document.querySelectorAll(".Logout");

logout.forEach(button => {
    button.addEventListener("click", () => {
        Swal.fire({
            title: 'Confirm Logout?',
            text: "Do you want to Logout?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Confirm',
            cancelButtonText: 'No, Cancel',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#aaa',
            reverseButtons: true // optional: swaps button positions
          }).then((result) => {
            if (result.isConfirmed) {
                DeleteCookie('ACCID');
                window.location.href = '../../Website/login_new/patient_login.html';  // This will navigate to a new URL        
        } });
    });
});
}
document.addEventListener("DOMContentLoaded", function () {
    const patientId = GetCookie('ACCID');


    console.log("Eventopen");

    checkLoginStatus();
    
    const links = document.querySelectorAll(".sidebar ul button");
    const iframe = document.querySelector("iframe");
    
    // Set default active link and iframe source if none is active
    if (!document.querySelector(".sidebar ul button.active")) {
        links[0].classList.add("active");
        iframe.src = links[0].getAttribute("href");
    }
    
    // Add click event listeners to each sidebar button
    links.forEach(link => {
        link.addEventListener("click", function (event) {
            // Remove active class from all links
            links.forEach(l => l.classList.remove("active"));
            
            // Add active class to clicked link
            this.classList.add("active");
            
            // Update iframe source
            iframe.src = this.getAttribute("href");
            
            // Prevent default link behavior
            event.preventDefault();
        });
    });

    Profile();
    
});

function Profile(){
const patientId = GetCookie('patientID');
    
    fetch('index.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ PatientID: patientId })
    })
    .then(res => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
    })
    .then(data => {
        let display = "";

        if (data.status === 'success') {
            // Create image source using the base64 data from the API
            const imgSrc = data.Patient.Profile ? 
                          `data:image/jpeg;base64,${data.Patient.Profile}` : 
                          "../img/posa.jpg"; // Fallback to default image if no profile
        
            display += `
            <img src="${imgSrc}" alt="Profile Image" id="profile-img">
                <div class="profile-id">
                    <h3 id="name">${data.Patient.Name}</h3>
                    <p id="position">${data.Patient.Username}</p>
                </div>
                <details class="profile-dropdown">
                <summary><i class='bx bx-chevron-down'></i></summary>
                <div class="dropdown-content">
                        <button>Profile</button>
                        <button>Settings</button>
                        <button class="Logout">Logout</button>
                </div>
            </details>`;
        
            document.getElementById('profiles').innerHTML = display; // Add to the HTML
            
            Logout();
        
            console.log('Welcome:'+data.message);
        }
    })
    .catch(error => {
        console.error('Login error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Something Went Wrong!',
            text: ''
        });
    });
}