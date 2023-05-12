const submitLoginForm = async event => {
  event.preventDefault();
  // Send ajax request to server using fetch API
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

  if (result.error) {
    alert('email or password wrong!');
  } else {
    event.target.reset();
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
    localStorage.setItem('csrfToken', JSON.stringify(result.csrfToken));
    window.location.replace('/views/guestsDetails.html');
  }
};

const signupForm = document.querySelector('#signup-form');
if (signupForm) {
  signupForm.addEventListener('submit', submitSignupForm);
}

const loginForm = document.querySelector('#login-form');
if (loginForm) {
  loginForm.addEventListener('submit', submitLoginForm);
}
