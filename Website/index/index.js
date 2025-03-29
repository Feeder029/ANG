let menu = document.querySelector('#menu-icon');
let nav = document.querySelector('.nav');

menu.onclick = () => {
    menu.classList.toggle('fa-xmark');
    nav.classList.toggle('open');
}

