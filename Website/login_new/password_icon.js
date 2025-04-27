const togglePassword = document.getElementById('toggle-password');
const passwordInput = document.getElementById('login-password');

togglePassword.addEventListener('click', function () {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    // Switch between eye and eye-slash
    this.classList.toggle('fa-eye');
    this.classList.toggle('fa-eye-slash');
});