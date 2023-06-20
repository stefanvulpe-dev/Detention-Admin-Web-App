function showError(inputId, errorElement, errorMessage) {
  document.querySelector('.' + errorElement).classList.add('display-error');
  document.querySelector('.' + errorElement).innerHTML = errorMessage;
  document
    .querySelector('#' + inputId)
    .parentElement.classList.add('input-error');
  document
    .querySelector('#' + inputId)
    .parentElement.classList.remove('success');
}

function setSuccess(inputId) {
  document.querySelector('#' + inputId).parentElement.classList.add('success');
  document
    .querySelector('#' + inputId)
    .parentElement.classList.remove('input-error');
}

function clearError() {
  let errors = document.querySelectorAll('.validation-error');
  for (let error of errors) {
    error.classList.remove('display-error');
  }
}

const submitLoginForm = async event => {
  clearError();

  event.preventDefault();
  // Send ajax request to server using fetch API
  const request = await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      email: event.target.elements['email'].value,
      password: event.target.elements['password'].value,
    }),
  });

  const response = await request.json();

  if (response.error) {
    if (response.message.includes('email')) {
      showError('email', 'email-error', 'Adresa de email gresita!');
    } else {
      setSuccess('email');
    }
    if (response.message.includes('password')) {
      showError('password', 'password-error', 'Parola gresita!');
    } else {
      setSuccess('password');
    }
  } else {
    event.target.reset();
    localStorage.setItem('csrfToken', JSON.stringify(response.csrfToken));
    window.location.replace('/views/guestsDetails.html');
  }
};

const submitSignupForm = async event => {
  clearError();
  event.preventDefault();

  const inputs = document.querySelectorAll('#signup-form input');

  const formData = new FormData();
  inputs.forEach(({ name, value }) => {
    if (name !== 'photo') {
      formData.append(name, value);
    }
  });

  const photo = document.querySelector('#photo');
  formData.append('photo', photo.files[0]);

  const request = await fetch('/register', {
    method: 'POST',
    body: formData,
  });

  const response = await request.json();
  if (response.error) {
    if (response.message.includes('photo')) {
      showError('photo-label', 'photo-error', 'Incarcati o poza!');
    } else {
      setSuccess('photo-label');
    }
    if (response.message.includes('email')) {
      showError('email', 'email-error', 'Adresa de email gresita!');
    } else {
      setSuccess('email');
    }
    if (response.message.includes('password')) {
      showError(
        'password',
        'password-error',
        'Parola trebuie sa contina doar cifre si litere!'
      );
    } else {
      setSuccess('password');
    }
    if (response.message.includes('firstName')) {
      showError('firstName', 'first_name-error', 'Prenume invalid!');
    } else {
      setSuccess('firstName');
    }
    if (response.message.includes('lastName')) {
      showError('lastName', 'last_name-error', 'Nume invalid!');
    } else {
      setSuccess('lastName');
    }
  } else {
    event.target.reset();
    localStorage.setItem('csrfToken', JSON.stringify(response.csrfToken));
    window.location.replace('/views/guestsDetails.html');
  }
};

const signupForm = document.querySelector('#signup-form');
if (signupForm) {
  signupForm.addEventListener('submit', submitSignupForm);
  const file_input = document.querySelector('#photo');
  const fileInputLabel = document.querySelector(`label[for='photo']`);
  file_input.addEventListener('change', event => {
    event.preventDefault();
    if (file_input.files[0].name.length > 10) {
      fileInputLabel.textContent =
        file_input.files[0].name.slice(0, 10) +
        '...' +
        file_input.files[0].name.slice(-6) +
        ' 📂';
    } else {
      fileInputLabel.textContent = file_input.files[0].name + ' 📂';
    }
  });
}

const loginForm = document.querySelector('#login-form');
if (loginForm) {
  loginForm.addEventListener('submit', submitLoginForm);
}
