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
  // Send ajax request to server using fetch API
  console.log('Event here...');
  const response = await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      email: event.target.elements['email'].value,
      password: event.target.elements['password'].value,
    }),
  });

  const result = await response.json();

  console.log(result);

  if (result.error) {
    alert('email or password wrong!');
  } else {
    event.target.reset();
    localStorage.setItem('authToken', JSON.stringify(result.authToken));
    localStorage.setItem('csrfToken', JSON.stringify(result.csrfToken));
    window.location.replace('/views/guestsDetails.html');
  }
};

const submitSignupForm = async event => {
  event.preventDefault();
  let first_name = event.target.elements['first_name'].value;
  let last_name = event.target.elements['last_name'].value;
  let email = event.target.elements['email'].value;
  let password = event.target.elements['password'].value;
  // let photo = document.getElementById('file-upload').files[0];

  // if (photo.size > 5 * 1024 * 1024) {
  //   alert('Photo needs to be maximum 5MB!');
  //   return;
  // }

  const response = await fetch('/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      firstName: first_name,
      lastName: last_name,
      email: email,
      password: password,
      photo: '',
    }),
  });

  const result = await response.json();

  if (result.error) {
    alert(result.message);
    //handleErrors(result.message)
    // if (message.contains("email")) {

    //}
  } else {
    event.target.reset();
    localStorage.setItem('authToken', JSON.stringify(result.authToken));
    localStorage.setItem('csrfToken', JSON.stringify(result.csrfToken));
    window.location.replace('/views/guestsDetails.html');
  }
};

const signupForm = document.querySelector('#sign_up_form');
if (signupForm) {
  signupForm.addEventListener('submit', submitSignupForm);
}

const loginForm = document.querySelector('#login-form');
if (loginForm) {
  loginForm.addEventListener('submit', submitLoginForm);
}

const logoutButton = document.querySelector('#logout-button');
if (logoutButton) {
  logoutButton.addEventListener('click', async () => {
    const response = await fetch('/logout', {
      method: 'DELETE',
      headers: {
        csrfToken: JSON.parse(localStorage.getItem('csrfToken')),
        authorization: `Bearer ${JSON.parse(
          localStorage.getItem('authToken')
        )}`,
      },
    });

    const result = await response.json();
    if (result.error) {
      console.log(result.message);
    } else {
      localStorage.removeItem('csrfToken');
      localStorage.removeItem('authToken');
      alert(result.message);
      window.location.replace('/views/index.html');
    }
  });
}
