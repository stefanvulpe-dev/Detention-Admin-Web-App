const visitDetailsForm = document.querySelector('#visitForm');

visitDetailsForm.addEventListener('submit', async event => {
  event.preventDefault();

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
    },
    body: JSON.stringify(reqBody),
  });

  const response = await request.json();

  if (response.error) {
    alert(`Error: ${response.message}`);
  } else {
    alert('Vizita programata cu succes!');
  }
});
