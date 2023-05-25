const visitDetailsForm = document.querySelector('#visitForm');

visitDetailsForm.addEventListener('submit', async event => {
  event.preventDefault();

  let reqBody = {};
  const inputs = document.querySelectorAll(
    '#visitForm input, #visitForm textarea'
  );
  inputs.forEach(input => {
    const name = input.getAttribute('id');
    if (name === 'visitTime') {
      const time = moment(input.value, 'HH:mm');
      reqBody[name] = time.format('HH:mm:ss');
    } else {
      reqBody[name] = input.value;
    }
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
    alert(`Error: ${response.message}`);
  } else {
    localStorage.removeItem('prisoner');
    localStorage.removeItem('guests');
    window.location.replace('/');
    alert('Vizita a fost programata cu succes.');
  }
});
