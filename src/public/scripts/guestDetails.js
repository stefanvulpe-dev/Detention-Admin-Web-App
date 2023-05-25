function renderPrisonerCard(firstName, lastName) {
  const prisonerName = document.querySelector('.prisoner-name');
  prisonerName.innerHTML = `${firstName} ${lastName}`;

  const prisonerCard = document.querySelector('.prisoner__card');
  prisonerCard.classList.remove('hidden');
  prisonerCard.classList.add('visible');

  document.querySelector('.guest-main').classList.add('prisoner-selected');
}

function renderResultList(results) {
  const resultList = document.querySelector('.result-list');
  resultList.innerHTML = '';

  if (results.length === 0) {
    const listItem = document.createElement('li');
    listItem.textContent = `Nu s-au găsit rezultate...`;
    listItem.classList.add('title');
    resultList.appendChild(listItem);
  } else {
    const listItem = document.createElement('li');
    listItem.textContent = `Rezultate:`;
    listItem.classList.add('title');
    resultList.appendChild(listItem);
  }

  results.forEach(result => {
    const { firstName, lastName } = result;

    const listItem = document.createElement('li');
    listItem.textContent = `${firstName} ${lastName}`;
    listItem.classList.add('prisoner-option');
    resultList.appendChild(listItem);
  });

  resultList.classList.remove('hidden');
  resultList.classList.add('visible');

  document.querySelector('.search-bar').classList.remove('list-off');
  document.querySelector('.search-bar').classList.add('list-on');
}

const searchBar = document.querySelector('.search-bar');
const resultList = document.querySelector('.result-list');

searchBar.addEventListener('submit', async event => {
  event.preventDefault();
  const payload = event.target.elements['searchPrisoner'].value;

  let firstName, lastName;
  if (payload.includes(' ')) {
    [fullName, firstName, lastName] = payload.match(/(\w+)\s(\w+)/);
  } else {
    firstName = payload;
    lastName = '';
  }

  const request = await fetch('/prisoners/search-prisoner', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      csrfToken: JSON.parse(localStorage.getItem('csrfToken')),
    },
    body: JSON.stringify({
      firstName: firstName,
      lastName: lastName,
    }),
  });

  const response = await request.json();
  if (response.error) {
    alert(response.message);
  } else {
    event.target.reset();
    renderResultList(response);
  }
});

resultList.addEventListener('click', event => {
  if (event.target.classList.contains('prisoner-option')) {
    const [fullName, firstName, lastName] =
      event.target.textContent.match(/(\w+)\s(\w+)/);

    document.querySelector('.search-bar').classList.remove('list-on');
    document.querySelector('.search-bar').classList.add('list-off');

    localStorage.setItem('prisoner', JSON.stringify({ firstName, lastName }));
    renderPrisonerCard(firstName, lastName);
    resultList.innerHTML = '';
    resultList.classList.remove('visible');
    resultList.classList.add('hidden');
  }
});

const deletePrisonerCardButton = document.querySelector('.delete-card');
deletePrisonerCardButton.addEventListener('click', () => {
  const prisonerCard = document.querySelector('.prisoner__card');
  prisonerCard.classList.remove('visible');
  prisonerCard.classList.add('hidden');
  document.querySelector('.guest-main').classList.remove('prisoner-selected');
  localStorage.removeItem('prisoner');
});

const guestList = document.querySelector('.guest-main__list');
const nextPageButton = document.querySelector('.guest-main__list__next-page');

async function renderGuestCard(guest) {
  const listItem = document.createElement('li');
  listItem.classList.add('guest-main__list__card');
  listItem.id = `guest${guest.id}`;

  const request = await fetch(
    '/guests/get-photo?' +
      new URLSearchParams({
        photo: guest.photo,
      }),
    {
      method: 'GET',
      headers: {
        csrfToken: JSON.parse(localStorage.getItem('csrfToken')),
      },
    }
  );

  const response = await request.json();
  if (response.error) {
    console.log(response.message);
    return;
  }

  const itemContent = `<img src="${
    response.url
  }" alt="guest photo" class="guest-main__list__card__photo">
    <div class="guest-main__list__card__name">
      <p class="guest-main__list__card__label">
        Nume:
        <span class="guest-main__list__card__info">${guest.firstName} ${
    guest.lastName
  }</span>
      </p>
    </div>
    <div class="drop-arrow">
      <span class="vBar"></span>
      <span class="vBar"></span>
    </div>
    <div class="guest-main__list__card__dBirth">
      <p class="guest-main__list__card__label">
        Serie CI:
        <span class="guest-main__list__card__info">${
          guest.passportNumber
        }</span>
      </p>
    </div>
    <div class="guest-main__list__card__buttons">
      <button class="guest-main__list__card__buttons__delete" 
          onclick="deleteGuest('${encodeURIComponent(JSON.stringify(guest))}')">
        <img src="/assets/guest-details/trash.svg" alt="delete button">
      </button>
      <button class="guest-main__list__card__buttons__edit" 
          onclick="editGuest('${encodeURIComponent(JSON.stringify(guest))}')">
        <img src="/assets/guest-details/pen.svg" alt="edit button">
      </button>
    </div>
  `;

  listItem.innerHTML = itemContent;
  return listItem;
}

function addDropdownEffect(guestCard) {
  const arrow = document.querySelector('.drop-arrow');
  arrow.addEventListener('click', () => {
    arrow.classList.toggle('extended');
    guestCard.classList.toggle('extended');
  });
}

async function renderGuests(guests) {
  for (const guest of guests) {
    const guestCard = await renderGuestCard(guest);
    guestList.insertBefore(guestCard, guestList.children[0]);
    addDropdownEffect(guestCard);
  }
  if (guests.length > 0) {
    showElement(nextPageButton);
  }
}

function showElement(element) {
  if (!element.classList.contains('visible')) {
    element.classList.add('visible');
  }
}

async function deleteGuest(guestString) {
  const guest = JSON.parse(decodeURIComponent(guestString));
  let text = `Vizitatorul ${guest.firstName} ${guest.lastName} urmeaza sa fie sters.`;
  if (confirm(text)) {
    await removePhoto(guest.photo);
    const guestCard = document.querySelector(`#guest${guest.id}`);
    guestCard.remove();
    const guests = JSON.parse(localStorage.getItem('guests'));
    const newGuests = guests.filter(element => element.id !== guest.id);
    localStorage.setItem('guests', JSON.stringify(newGuests));
    if (newGuests.length === 0) {
      nextPageButton.classList.remove('visible');
    }
  }
}

async function removePhoto(photo) {
  const request = await fetch(
    '/guests/delete-photo?' + new URLSearchParams({ photo }),
    {
      method: 'DELETE',
      headers: {
        csrfToken: JSON.parse(localStorage.getItem('csrfToken')),
      },
    }
  );

  const response = await request.json();
  if (response.error) {
    console.log(response.message);
  }
}

async function editGuest(guestString) {
  const guest = JSON.parse(decodeURIComponent(guestString));
  showDialogModal('editGuests', 'Introduceti datele personale', () =>
    submitNewGuestDetails(guest)
  );
  const dialog = document.querySelector('#editGuests');
  const inputs = dialog.querySelectorAll(`.dialog__form input[type='text']`);
  inputs.forEach(input => (input.value = guest[input.name]));
}

async function submitGuestDetails() {
  clearErrors();
  const inputs = document.querySelectorAll(`#addGuests .dialog__form input`);

  const formData = new FormData();
  inputs.forEach(({ name, value }) => {
    if (name !== 'photo') {
      formData.append(name, value);
    }
  });

  const photo = document.querySelector('#addGuests .dialog__form #photo');
  formData.append('photo', photo.files[0]);

  const request = await fetch('/guests/add-guest', {
    method: 'POST',
    headers: {
      csrfToken: JSON.parse(localStorage.getItem('csrfToken')),
    },
    body: formData,
  });

  const response = await request.json();

  if (response.error) {
    handleError(response.message);
  } else {
    let guests = JSON.parse(localStorage.getItem('guests')) ?? [];
    response.guest.id = guests.length;
    const guestCard = await renderGuestCard(response.guest);
    guestList.insertBefore(guestCard, guestList.children[0]);
    addDropdownEffect(guestCard);
    guests.push(response.guest);
    localStorage.setItem('guests', JSON.stringify(guests));
    closeDialog('addGuests');
    clearErrors();
    showElement(nextPageButton);
  }
}

async function submitNewGuestDetails(guest) {
  clearErrors();
  const inputs = document.querySelectorAll(`#editGuests .dialog__form input`);

  const formData = new FormData();
  inputs.forEach(({ name, value }) => {
    if (name !== 'photo') {
      formData.append(name, value);
    }
  });

  const photo = document.querySelector(`#editGuests .dialog__form #photo`);
  formData.append('photo', photo.files[0]);

  const request = await fetch('/guests/edit-guest', {
    method: 'PUT',
    headers: {
      csrfToken: JSON.parse(localStorage.getItem('csrfToken')),
    },
    body: formData,
  });

  const response = await request.json();

  if (response.error) {
    handleError(response.message);
  } else {
    await removePhoto(guest.photo);
    const guestCard = document.querySelector(`#guest${guest.id}`);
    guestCard.remove();
    response.guest.id = guest.id;
    const newGuestCard = await renderGuestCard(response.guest);
    guestList.insertBefore(newGuestCard, guestList.children[0]);
    addDropdownEffect(guestCard);
    let guests = JSON.parse(localStorage.getItem('guests'));
    const index = guests.findIndex(element => element.id === guest.id);
    guests[index] = response.guest;
    localStorage.setItem('guests', JSON.stringify(guests));
    closeDialog('editGuests');
    clearErrors();
    showElement(nextPageButton);
  }
}

function handleError(message) {
  let input, paragraph, photoLabel;
  if (message.includes('firstName')) {
    input = document.querySelector(`input[id='firstName']`);
    paragraph = document.querySelector(`p[data-error='firstName']`);
    paragraph.textContent = 'Nume invalid';
  } else if (message.includes('lastName')) {
    input = document.querySelector(`input[id='lastName']`);
    paragraph = document.querySelector(`p[data-error='lastName']`);
    paragraph.textContent = 'Prenume invalid';
  } else if (message.includes('passportNumber')) {
    input = document.querySelector(`input[id='passportNumber']`);
    paragraph = document.querySelector(`p[data-error='passportNumber']`);
    paragraph.textContent = 'Serie CI invalida';
  } else if (message.includes('photo')) {
    photoLabel = document.querySelector(`label[for='photo']`);
    photoLabel.classList.add('error-outline');
  } else if (message.includes('nationalId')) {
    input = document.querySelector(`input[id='nationalId']`);
    paragraph = document.querySelector(`p[data-error='nationalId']`);
    paragraph.textContent = 'CNP invalid';
  } else if (message.includes('email')) {
    input = document.querySelector(`input[id='email']`);
    paragraph = document.querySelector(`p[data-error='email']`);
    paragraph.textContent = 'Email invalid';
  }
  input?.classList.add('error-outline');
  paragraph?.classList.add('visible');
}

function clearErrors() {
  const inputs = document.querySelectorAll(`.dialog__form input`);
  const paragraphs = document.querySelectorAll(`.dialog__form p`);
  const photoLabel = document.querySelector(`label[for='photo']`);
  inputs.forEach(input => {
    input.classList.remove('error-outline');
  });
  paragraphs.forEach(paragraph => {
    paragraph.classList.remove('visible');
  });
  photoLabel?.classList.remove('error-outline');
}

function closeDialog(id) {
  const dialog = document.querySelector(`#${id}`);
  dialog.remove();
}

(async function () {
  const prisoner = JSON.parse(localStorage.getItem('prisoner'));
  if (prisoner) {
    renderPrisonerCard(prisoner.firstName, prisoner.lastName);
  }
  const guests = JSON.parse(localStorage.getItem('guests'));
  if (guests) {
    await renderGuests(guests);
  }
  const deleteButton = document.querySelector('#deleteButton');
  deleteButton.addEventListener('click', async () => {
    let text = 'Sunteti sigur ca doriti sa stergeti toti vizitatorii?';
    if (confirm(text)) {
      const guestsArr = JSON.parse(localStorage.getItem('guests'));
      for (const guest of guestsArr) {
        await removePhoto(guest.photo);
        const guestCard = document.querySelector(`#guest${guest.id}`);
        guestCard.remove();
      }
      localStorage.removeItem('guests');
      nextPageButton.classList.remove('visible');
    }
  });
  nextPageButton.addEventListener('click', event => {
    event.preventDefault();
    const prisoner = JSON.parse(localStorage.getItem('prisoner'));
    const guests = JSON.parse(localStorage.getItem('guests')) ?? [];

    if (!prisoner || guests.length === 0) {
      alert('Nu ati introdus toate datele necesare vizitei!');
      return;
    }

    window.location.assign('/views/visitDetails.html');
  });
})();
