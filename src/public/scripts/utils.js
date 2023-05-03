const arrow = document.querySelector('.drop-arrow');
const card = document.querySelector('.guest-main__list__card');

const navToggleButton = document.querySelector('.nav__toggle');
const navBar = document.querySelector('.header__nav');

if (arrow) {
  arrow.addEventListener('click', () => {
    arrow.classList.toggle('extended');
    card.classList.toggle('extended');
  });
}

if (navToggleButton) {
  navToggleButton.addEventListener('click', e => {
    navBar.classList.toggle('active');
    navToggleButton.classList.toggle('active');
  });
}
const submitLoginForm = async event => {
  event.preventDefault();
  /* event.target.elemnts[0] event.target.elemnts['email']  */

  // Send ajax request to server using fetch API
  const response = await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ email: event.target.elements['email'].value , password: event.target.elements['password'].value }),
  });

  const result = await response.json(); // {error: true, message: '...'}
  if (result.error) {
    alert("email or password wrong!");
  } else {
    localStorage.setItem('authToken', JSON.stringify(result.authToken));
    localStorage.setItem('csrfToken', JSON.stringify(result.csrfToken));
    window.location = "/views/guestsDetails.html";
  }
};

const submitSignupForm = async event => {
  event.preventDefault();
  /* event.target.elemnts[0] event.target.elemnts['email']  */

  // Send ajax request to server using fetch API
  const response = await fetch('/register', {
    mehod: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ name: event.target.elements['name'] }),
  });
  const result = await response.json(); // {error: true, message: '...'}
  if (result.error) {
  } else {
    localStorage.setItem('authToken', JSON.stringify(result.authToken));
    localStorage.setItem('csrfToken', JSON.stringify(result.csrfToken));
  }
};

const form = document.querySelector('.container__form');
form.addEventListener ('submit',submitLoginForm);