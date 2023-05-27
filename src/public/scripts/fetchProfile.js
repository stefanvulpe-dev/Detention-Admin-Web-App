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

  const { firstName, lastName, email, photo } = response.user;
  userName.textContent = firstName + ' ' + lastName;
  userEmail.textContent = email;
  profileTitle.textContent =
    'Hi, ' + firstName + ' ' + lastName + '. Welcome to your profile!';

  request = await fetch('/photos/get-photo?' + new URLSearchParams({ photo }), {
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

  request = await fetch(
    '/visits/get-history?' + new URLSearchParams({ firstName, lastName }),
    {
      method: 'GET',
      headers: { csrfToken: JSON.parse(localStorage.getItem('csrfToken')) },
    }
  );

  response = await request.json();
  if (response.error) {
    console.log(response.message);
  } else {
    await renderHistory(response.visitsIds);
  }
})();

async function renderHistory(visitsIds) {
  let request, response;
  let cardContent = '';
  for (const { id } of visitsIds) {
    request = await fetch(
      '/visits/get-visit?' + new URLSearchParams({ visitId: id }),
      {
        method: 'GET',
        headers: { csrfToken: JSON.parse(localStorage.getItem('csrfToken')) },
      }
    );

    response = await request.json();
    if (response.error) {
      console.log(response.message);
      return;
    }

    const visit = response.visit;

    request = await fetch(
      '/prisoners/get-prisoner?' + new URLSearchParams({ visitId: id }),
      {
        method: 'GET',
        headers: { csrfToken: JSON.parse(localStorage.getItem('csrfToken')) },
      }
    );

    response = await request.json();
    if (response.error) {
      console.log(response.message);
      return;
    }

    const prisoner = response.prisoner;

    request = await fetch(
      '/guests/get-guests?' + new URLSearchParams({ visitId: id }),
      {
        method: 'GET',
        headers: { csrfToken: JSON.parse(localStorage.getItem('csrfToken')) },
      }
    );

    response = await request.json();

    if (response.error) {
      console.log(response.message);
      return;
    }

    const guests = response.guests;

    cardContent += renderVisitCard(visit, prisoner, guests);
  }

  const history = document.querySelector('#visitsHistory');
  history.innerHTML = cardContent;
}

function renderVisitCard(visit, prisoner, guests) {
  const guestNames = guests
    .map(guest => guest.firstName + ' ' + guest.lastName)
    .join(', ');

  let hours = moment(visit.time, 'HH:mm:ss').format('HH');
  let minutes = moment(visit.time, 'HH:mm:ss').format('mm');

  if (hours === '00') {
    hours = '0';
  }

  if (minutes === '00') {
    minutes = '0';
  }

  return `<details class="help__qa">
          <summary class="help__qa__question">
            <div class="help__qa__question__arrow"></div>
            <h2 class="help__qa__question__text">
            Vizita ${moment(new Date(visit.date)).format('DD.MM.YYYY')}
            </h2>
          </summary>
          <ol class="help__qa__steps">
            <li class="help__qa__steps__step">
            Detinut: ${prisoner.firstName} ${prisoner.lastName}
            </li>
            <li class="help__qa__steps__step">
            Durata vizitei: ${hours} ore si ${minutes} minute 
            </li>
            <li class="help__qa__steps__step">
            Starea detinutului: ${visit.mood}
            </li>
            <li class="help__qa__steps__step">
            Natura vizitei: ${visit.nature}
            </li>
            <li class="help__qa__steps__step">
            Rezumatul discutiilor: ${visit.summary}
            </li>
            <li class="help__qa__steps__step">
            Obiecte furnizate: ${visit.objects}
            </li>
            <li class="help__qa__steps__step">
              ${guests.length > 1 ? 'Vizitatori' : 'Vizitator'}: ${guestNames}
            </li>
          </ol>
        </details>`;
}
