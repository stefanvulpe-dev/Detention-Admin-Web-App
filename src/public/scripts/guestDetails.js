const renderPrisonerCard = (firstName, lastName) => {
  const prisonerName = document.querySelector('.prisoner-name');
  prisonerName.innerHTML = `${firstName} ${lastName}`;

  const prisonerCard = document.querySelector('.prisoner__card');
  prisonerCard.classList.remove('hidden');
  prisonerCard.classList.add('visible');

  document.querySelector('.guest-main').classList.add('prisoner-selected');
};

const renderResultList = results => {
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
};

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

const deleteGuest = async guestString => {
  const guest = JSON.parse(decodeURIComponent(guestString));
  let text = `Vizitatorul ${guest.lastName} ${guest.firstName} urmeaza sa fie sters.`;
  if (confirm(text)) {
    const request = await fetch('/guests/delete-guest', {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        csrfToken: JSON.parse(localStorage.getItem('csrfToken')),
      },
      body: JSON.stringify(guest),
    });
    const response = await request.json();
    if (response.error) {
      console.log(response.message);
      return;
    }

    const guestCard = document.querySelector(`#guest${guest.id}`);
    guestCard.remove();
    const guests = JSON.parse(localStorage.getItem('guests'));
    const newGuests = guests.filter(element => element.id !== guest.id);
    localStorage.setItem('guests', JSON.stringify(newGuests));
    if (newGuests.length === 0) {
      nextPageButton.classList.remove('visible');
    }
  }
};

const editGuest = guestString => {};

const deleteAllGuests = () => {};

const showElement = element => {
  if (!element.classList.contains('visible')) {
    element.classList.add('visible');
  }
};

const renderGuestCard = async guest => {
  const listItem = document.createElement('li');
  listItem.classList.add('guest-main__list__card');
  listItem.id = `guest${guest.id}`;

  const request = await fetch(
    '/guests/get-photo?' +
      new URLSearchParams({
        guestId: guest.id,
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
        <span class="guest-main__list__card__info">${guest.lastName} ${
    guest.firstName
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
              onclick="editGuest(${JSON.stringify(guest)})">
        <img src="/assets/guest-details/pen.svg" alt="edit button">
      </button>
    </div>
  `;

  listItem.innerHTML = itemContent;
  return listItem;
};

const addDropdownEffect = guestCard => {
  const arrow = document.querySelector('.drop-arrow');
  arrow.addEventListener('click', () => {
    arrow.classList.toggle('extended');
    guestCard.classList.toggle('extended');
  });
};

const renderGuests = async guests => {
  for (const guest of guests) {
    const guestCard = await renderGuestCard(guest);
    guestList.insertBefore(guestCard, guestList.children[0]);
    addDropdownEffect(guestCard);
  }
  if (guests.length > 0) {
    showElement(nextPageButton);
  }
};

const closeDialog = id => {
  const dialog = document.querySelector(`#${id}`);
  const dialogForm = document.querySelector('.dialog__form');
  const fileUploadDetails = document.querySelector(`label[for='photo']`);
  fileUploadDetails.textContent = `Incarca o poza 📁`;
  dialogForm.reset();
  dialog.close();
};

const submitGuestDetails = async event => {
  event.preventDefault();
  const inputs = document.querySelectorAll(`#addGuests .dialog__form input`);

  const formData = new FormData();
  inputs.forEach(({ name, value }) => {
    if (name !== 'photo') {
      formData.append(name, value);
    }
  });

  const photo = document.querySelector('#photo');
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
    //form validation
    console.log(response.message);
  } else {
    const guestCard = await renderGuestCard(response.guest);
    guestList.insertBefore(guestCard, guestList.children[0]);
    addDropdownEffect(guestCard);
    let guests = JSON.parse(localStorage.getItem('guests')) ?? [];
    guests.push(response.guest);
    localStorage.setItem('guests', JSON.stringify(guests));
    closeDialog('addGuests');
    showElement(nextPageButton);
  }
};

(async () => {
  const prisoner = JSON.parse(localStorage.getItem('prisoner'));
  if (prisoner) {
    renderPrisonerCard(prisoner.firstName, prisoner.lastName);
  }
  const guests = JSON.parse(localStorage.getItem('guests'));
  if (guests) {
    await renderGuests(guests);
  }
})();
