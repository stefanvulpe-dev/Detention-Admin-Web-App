const reviewForm = document.querySelector('#review_form');

reviewForm.addEventListener('submit', async event => {
  clearErrors();
  event.preventDefault();

  let reqBody = {};
  const inputs = document.querySelectorAll(
    '#review_form input, #review_form textarea'
  );
  inputs.forEach(({ name, value }) => {
    reqBody[name] = value;
  });

  const request = await fetch('/contact/send', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(reqBody),
  });

  const response = await request.json();

  if (response.error) {
    handleError(response.message);
  } else {
    window.location.replace('/');
    alert('Review transmis cu succes.');
  }
});

function handleError(message) {
  let input, paragraph, errorMessage;
  if (message.includes('firstName')) {
    input = document.querySelector(`#review_form input[name='firstName']`);
    paragraph = document.querySelector('.firstName-error');
    errorMessage = 'Numele este invalid.';
  } else if (message.includes('lastName')) {
    input = document.querySelector(`#review_form input[name='lastName']`);
    paragraph = document.querySelector('.lastName-error');
    errorMessage = 'Prenumele este invalid.';
  } else if (message.includes('email')) {
    input = document.querySelector(`#review_form input[name='email']`);
    paragraph = document.querySelector('.email-error');
    errorMessage = 'Email-ul este invalid.';
  } else if (message.includes('suggestions')) {
    input = document.querySelector(`#review_form textarea[name='suggestions']`);
    paragraph = document.querySelector('.suggestions-error');
    errorMessage = 'Formatul sugestiilor este invalid.';
  }
  input === undefined
    ? alert('Eroare la introducerea de date.')
    : showError(input, paragraph, errorMessage);
}

function showError(input, paragraph, message) {
  input.classList.add('error-border');
  paragraph.innerHTML = message;
  paragraph.classList.add('visible');
}

function clearErrors() {
  let paragraphErrors = document.querySelectorAll('.visible');
  for (let error of paragraphErrors) {
    error.classList.remove('visible');
  }

  let borderErrors = document.querySelectorAll('.error-border');
  for (let error of borderErrors) {
    error.classList.remove('error-border');
  }
}
