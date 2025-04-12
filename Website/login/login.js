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
    fetch('login.php', {
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
            console.error('Log4in failed:', data.message);
            alert("Incorrect Password or Email");
        }
    });
}