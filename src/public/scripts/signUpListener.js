const form = document.getElementById('sign_up_form');

form.addEventListener('submit', async event => {
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
    }),
  });

  const result = await response.json();

  if (result.error) {
    alert(result.error);
    form.reset();
  } else {
    window.location.replace('login.html');
  }
});
