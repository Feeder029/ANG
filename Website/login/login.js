const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

registerBtn.addEventListener('click', () => {
    container.classList.add('active');
})

loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
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