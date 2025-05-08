const step1 = document.getElementById('step-1');
const step2 = document.getElementById('step-2');
const step3 = document.getElementById('step-3');

const nextBtn1 = document.getElementById('next-btn-1');
const nextBtn2 = document.getElementById('next-btn-2');
const backBtn1 = document.getElementById('back-btn-1');
const backBtn2 = document.getElementById('back-btn-2');

nextBtn1.addEventListener('click', function() {
    step1.style.display = 'none';
    step2.style.display = 'block';
});

backBtn1.addEventListener('click', function() {
    step2.style.display = 'none';
    step1.style.display = 'block';
});

nextBtn2.addEventListener('click', function() {
    step2.style.display = 'none';
    step3.style.display = 'block';
});

backBtn2.addEventListener('click', function() {
    step3.style.display = 'none';
    step2.style.display = 'block';
});