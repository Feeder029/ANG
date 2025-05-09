let menu = document.querySelector('#menu-icon');
let nav = document.querySelector('.nav');

menu.onclick = () => {
    menu.classList.toggle('fa-circle-xmark');
    nav.classList.toggle('open');
}




// for service button
const moreButton = document.querySelector('.more-service');
  let isVisible = false;

  moreButton.addEventListener('click', () => {
    const serviceBoxes = document.querySelectorAll('.service-box');

    serviceBoxes.forEach((box, index) => {
      // Skip the first 6 services (assumed to be always visible)
      if (index >= 6) {
        if (isVisible) {
          box.classList.add('hidden-service'); // hide
        } else {
          box.classList.remove('hidden-service'); // show
        }
      }
    });

    moreButton.textContent = isVisible ? 'More Services' : 'Hide Services';
    isVisible = !isVisible;
  });