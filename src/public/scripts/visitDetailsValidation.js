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

const visitDetailsForm = document.querySelector('#visitForm');

visitDetailsForm.addEventListener('submit', async event => {
  event.preventDefault();
  clearError();
  let reqBody = {};
  const inputs = document.querySelectorAll(
    '#visitForm input, #visitForm textarea'
  );
  inputs.forEach(input => {
    const name = input.getAttribute('id');
    reqBody[name] = input.value;
  });

  reqBody['guests'] = JSON.parse(localStorage.getItem('guests'));
  reqBody['prisoner'] = JSON.parse(localStorage.getItem('prisoner'));

  const request = await fetch('/visits/add-visit', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      csrfToken: JSON.parse(localStorage.getItem('csrfToken')),
    },
    body: JSON.stringify(reqBody),
  });

  const response = await request.json();

  if (response.error) {
    if (response.message.includes('visitDate')) {
      showError('visitDate', 'visitDate-error', 'Dată indisponibilă!');
    } else {
      setSuccess('visitDate');
    }
    if (response.message.includes('objectData')) {
      showError('objectData', 'objectData-error', 'Caractere nepermise!');
    } else {
      setSuccess('objectData');
    }
    if (response.message.includes('visitTime')) {
      showError(
        'visitTime',
        'visitTime-error',
        'Introduceți o durata validă! (ex:00h:30m)'
      );
    } else {
      setSuccess('visitTime');
    }
    if (response.message.includes('prisonerMood')) {
      showError('prisonerMood', 'prisonerMood-error', 'Caractere nepermise!');
    } else {
      setSuccess('prisonerMood');
    }
    if (response.message.includes('visitNature')) {
      showError('visitNature', 'visitNature-error', 'Caractere nepermise!');
    } else {
      setSuccess('visitNature');
    }
    if (response.message.includes('summary')) {
      showError('summary', 'summary-error', 'Caractere nepermise!');
    } else {
      setSuccess('summary');
    }
  } else {
    event.target.reset();
    localStorage.removeItem('prisoner');
    localStorage.removeItem('guests');
    window.location.replace('/');
    alert('Vizita a fost programata cu succes.');
  }
});
