const navToggleButton = document.querySelector('.nav__toggle'); 
const navBar = document.querySelector('.header__nav'); 

navToggleButton.addEventListener('click', (e) => {
    navBar.classList.toggle('active'); 
    navToggleButton.classList.toggle('active');
});