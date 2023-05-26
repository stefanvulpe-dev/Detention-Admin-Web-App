const reviewForm = document.querySelector('#review_form');

reviewForm.addEventListener('submit', async event => {
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
    alert(`Error: ${response.message}`);
  } else {
    alert('Review transmis cu succes.');
  }
});
