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
  localStorage.removeItem('prisoner');
});

const prisoner = JSON.parse(localStorage.getItem('prisoner'));
if(prisoner){
    renderPrisonerCard(prisoner.firstName,prisoner.lastName);
}