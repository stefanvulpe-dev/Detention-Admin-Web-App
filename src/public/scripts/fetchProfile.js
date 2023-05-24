(async function () {
  const userName = document.querySelector('.user-name');
  const userEmail = document.querySelector('.user-email');
  const profileTitle = document.querySelector('.profile__title');
  const profilePicture = document.querySelector('img.profile__card-photo');

  let request = await fetch('/users/get-profile', {
    method: 'GET',
    headers: {
      csrfToken: JSON.parse(localStorage.getItem('csrfToken')),
    },
  });

  let response = await request.json();
  if (response.error) {
    window.location.assign('/views/login.html');
    return;
  }

  const { firstName, lastName, email, photo } = response;
  userName.textContent = firstName + ' ' + lastName;
  userEmail.textContent = email;
  profileTitle.textContent =
    'Hi, ' + firstName + ' ' + lastName + '. Welcome to your profile!';

  request = await fetch('/users/get-profile-picture', {
    method: 'GET',
    headers: {
      csrfToken: JSON.parse(localStorage.getItem('csrfToken')),
    },
  });
  response = await request.json();

  if (response.error) {
    profilePicture.src = '/assets/header/person.jpg';
  } else {
    profilePicture.src = response.url;
  }
})();
