// Put login-btn for Login
const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.btn');
const LogBtn = document.querySelector('#login-btn');

registerBtn.addEventListener('click', () => {
    container.classList.add('active');
})

loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
})

LogBtn.addEventListener('click', () => {
    event.preventDefault(); // Prevent form from actually submitting

    const UsernameorEmail = document.querySelector('#User').value;
    const Password = document.querySelector('#password').value;

    Login(UsernameorEmail,Password);
})

// hide password
var pass;
function pass(){
    if(pass == 1){
        document.getElementById('password').type='password';
        document.getElementById('hidepassword').src='fa-solid fa-eye-slash';
        pass = 0;
    }
    else{
        document.getElementById('password').type='password';
        document.getElementById('hidepassword').src='';
        pass = 1;
    }
}


function Login(US,PA){
    fetch('../Dashboard/login.php', {
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
            window.location.href = '../../main/index.html';  // This will navigate to a new URL
        } else {
            console.error('Log4in failed:', data.message);
            alert("Incorrect Password or Email");
        }
    });
}

document.querySelector('#register-btn').addEventListener('click', (e) => {
    e.preventDefault(); // Prevent form submission

    const email = document.querySelector('#reg-email').value;
    const username = document.querySelector('#reg-username').value;
    const password = document.querySelector('#reg-password').value;

    fetch('../Dashboard/register.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            username: username,
            password: password
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            alert("Registered successfully. You can now log in.");
            container.classList.remove('active'); // go to login screen
        } else {
            alert("Registration failed: " + data.message);
        }
    });
});
