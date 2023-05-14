function showError(inputId,errorElement, errorMessage){
  document.querySelector("." + errorElement).classList.add("display-error");
  document.querySelector("." + errorElement).innerHTML = errorMessage;
  document.querySelector("#" + inputId).parentElement.classList.add("input-error");
  document.querySelector("#" + inputId).parentElement.classList.remove("success");
}

function setSuccess(inputId){
  document.querySelector("#" + inputId).parentElement.classList.add("success");
  document.querySelector("#" + inputId).parentElement.classList.remove("input-error");

}

function clearError(){
  let errors = document.querySelectorAll(".error");
  for(let error of errors){
    error.classList.remove("display-error");
  }
}

const submitLoginForm = async event => {
  clearError();
  
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
    if(result.message.includes('email')){
      showError("email","email-error","Adresa de email gresita!");
    }else{
      setSuccess("email");
    }
    if(result.message.includes('password')){
      showError("password","password-error","Parola gresita!");
    }else{
      setSuccess("password");
    }
  } else {
    event.target.reset();
    localStorage.setItem('csrfToken', JSON.stringify(result.csrfToken));
    window.location.replace('/views/guestsDetails.html');
  }
};

const submitSignupForm = async event => {
  clearError();
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
console.log(result.message);
  if (result.error) {
    if(result.message.includes('email')){
      showError("email","email-error","Adresa de email gresita!");
    }else{
      setSuccess("email");
    }
    if(result.message.includes('password')){
      showError("password","password-error","Parola gresita!");
    }else{
      setSuccess("password");
    }
    if(result.message.includes('firstName')){
      showError("first_name","first_name-error","Prenume invalid!");
    }else{
      setSuccess("first_name");
    }
    if(result.message.includes('lastName')){
      showError("last_name","last_name-error","Nume invalid!");
    }else{
      setSuccess("last_name");
    }
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
