const visitDetailsForm = document.querySelector('#visitForm');

visitDetailsForm.addEventListener('submit', async event => {
  event.preventDefault();
  let reqBody = {};

  for (const key of Object.keys(event.target.elements)) {
    if (key.length > 1) reqBody[key] = event.target.elements[key].value;
    // ^^^^^^^^^ (sa nu includa cifrele 0->6 din event.target.elements)
  }

  reqBody['guests'] = JSON.parse(localStorage.getItem('guests'));
  reqBody['prisoner'] = JSON.parse(localStorage.getItem('prisoner'));

  console.log(`Req body: ${JSON.stringify(reqBody)}`);

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
    alert('Detaliile sunt bune');
  }
});
