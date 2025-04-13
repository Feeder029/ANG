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
        alert("Login Successful!");
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