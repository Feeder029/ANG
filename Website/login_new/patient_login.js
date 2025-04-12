document.getElementById("show-register").addEventListener("click", function() {
    document.getElementById("login-box").style.display = "none";
    document.getElementById("register-box").style.display = "block";
});

document.getElementById("show-login").addEventListener("click", function() {
    document.getElementById("register-box").style.display = "none";
    document.getElementById("login-box").style.display = "block";
});

// Login Form Validation
document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    if (email === "" || password === "") {
        alert("Please fill in all fields.");
    } else {
        Login(email,password);
    }
});

// Register Form Validation
document.getElementById("register-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const firstname = document.getElementById("firstname").value;
    const lastname = document.getElementById("lastname").value;
    const gender = document.getElementById("gender").value;
    const email = document.getElementById("register-email").value;
    const phone = document.getElementById("phone").value;

    if (!firstname || !lastname || !gender || !email || !phone) {
        alert("Please fill in all required fields.");
    } else {
        alert("Registration Successful!");
    }
});

function Login(US,PA){
    fetch('patient_login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            USEREMAIL: US,
            PASS: PA
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            console.log('Welcome:', data.Acc.Username);
            window.location.href = '../../ANG CLIENT 1.2/clientIndex/index.html';  // This will navigate to a new URL
        } else {
            console.error('Login failed:', data.message);
            alert("Incorrect Password or Email");
        }
    });
}