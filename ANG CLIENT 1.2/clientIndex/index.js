import { GetCookie } from '../../Cookies/cookies.js';
import { DeleteCookie } from '../../Cookies/cookies.js';


function checkLoginStatus() {
    console.log("Checklog");
    const patientId = GetCookie('ACCID');
    if (patientId) {
      console.log(`Patient ID ${patientId} is logged in`);
    } else {
        window.location.href = '../../Website/login_new/patient_login.html';  // This will navigate to a new URL
    }

    // DeleteCookie('ACCID');
}

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




document.addEventListener("DOMContentLoaded", function () {

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

    
});




