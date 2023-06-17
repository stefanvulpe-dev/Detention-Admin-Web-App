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

  if (email === 'johndoe@gmail.com') {
    enableExtraFeatures();
  }

  const editProfileButton = document.querySelector('.profile__card-button');
  editProfileButton.addEventListener('click', () =>
    showDialogModal('editProfile', 'Editați-vă profilul', profileInputs, () =>
      submitNewProfile()
    )
  );
})();

const paginationLimit = 3;
let listItems = [];
let pageCount;
let currentPage = 1;
const nextButton = document.querySelector('#next-button');
const prevButton = document.querySelector('#prev-button');
const list = document.querySelector('.paginated-list');

async function renderHistory(visitsIds) {
  let request, response;

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

    const listItem = document.createElement('li');
    listItem.innerHTML = renderVisitCard(visit, prisoner, guests);
    listItems.push(listItem);
  }

  list.append(...listItems);
  pageCount = Math.ceil(listItems.length / paginationLimit);
  setCurrentPage(currentPage);

  prevButton.addEventListener('click', () => {
    setCurrentPage(currentPage - 1);
  });

  nextButton.addEventListener('click', () => {
    setCurrentPage(currentPage + 1);
  });

  if (pageCount === 0 || pageCount === 1) {
    nextButton.style.display = 'none';
    prevButton.style.display = 'none';
  }
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

function setCurrentPage(pageNumber) {
  currentPage = pageNumber;
  const prevRange = (pageNumber - 1) * paginationLimit;
  const nextRange = pageNumber * paginationLimit;

  handleButtons(pageNumber);

  listItems.forEach((item, index) => {
    if (index >= prevRange && index < nextRange) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
}

function handleButtons(pageNumber) {
  const nextButton = document.querySelector('#next-button');
  const prevButton = document.querySelector('#prev-button');

  if (pageNumber === 1) {
    prevButton.setAttribute('disabled', true);
  } else {
    prevButton.removeAttribute('disabled');
  }

  if (pageNumber === pageCount) {
    nextButton.setAttribute('disabled', true);
  } else {
    nextButton.removeAttribute('disabled');
  }
}

function enableExtraFeatures() {
  const customSelect = document.querySelector('.custom-select');
  customSelect.style.display = 'block';
  const importDataForm = document.querySelector('#importData');
  importDataForm.style.display = 'block';
  const fileInput = document.querySelector('#myFileUpload');
  const fileInputLabel = document.querySelector(
    `label[for='myFileUpload'] span`
  );
  const submitButton = document.querySelector('#importData button');

  fileInput.addEventListener('change', event => {
    event.preventDefault();
    if (fileInput.files[0].name.length > 20) {
      fileInputLabel.textContent =
        fileInput.files[0].name.slice(0, 10) +
        '...' +
        fileInput.files[0].name.slice(-6) +
        ' 📂';
    } else {
      fileInputLabel.textContent = fileInput.files[0].name + ' 📂';
    }
    submitButton.style.display = 'block';
  });

  importDataForm.addEventListener('submit', async event => {
    event.preventDefault();
    clearUploadErrors();

    const files = document.getElementById('myFileUpload').files;
    if (files.length > 0) {
      const file = files[0];
      const fileExtension = file.name.split('.').pop().toLowerCase();

      const formData = new FormData();
      formData.append('file', file);

      let request;

      if (fileExtension === 'json') {
        request = await fetch('/uploadJSON', {
          method: 'POST',
          body: formData,
          headers: { csrfToken: JSON.parse(localStorage.getItem('csrfToken')) },
        });
      } else if (fileExtension === 'csv') {
        request = await fetch('/uploadCSV', {
          method: 'POST',
          body: formData,
          headers: { csrfToken: JSON.parse(localStorage.getItem('csrfToken')) },
        });
      } else {
        showUploadErrors();
        return;
      }

      const response = await request.json();

      if (response.error) {
        showUploadErrors();
      } else {
        alert(response.message);
        window.location.reload();
      }
    } else {
      alert('The file was not uploaded correctly.');
    }
  });
}

function showUploadErrors() {
  const errorParagraph = document.querySelector('.upload-error');
  errorParagraph.style.display = 'block';
  const fileInputLabel = document.querySelector(`label[for='myFileUpload']`);
  fileInputLabel.classList.add('red-outline');
}

function clearUploadErrors() {
  const errorParagraph = document.querySelector('.upload-error');
  errorParagraph.style.display = 'none';
  const fileInputLabel = document.querySelector(`label[for='myFileUpload']`);
  fileInputLabel.classList.remove('red-outline');
}

function closeDialog(id) {
  const dialog = document.querySelector(`#${id}`);
  dialog.remove();
}

async function submitNewProfile() {
  clearErrors();
  const inputs = document.querySelectorAll(`#editProfile .dialog__form input`);

  const formData = new FormData();
  inputs.forEach(({ name, value }) => {
    if (name !== 'photo') {
      formData.append(name, value);
    }
  });

  const photo = document.querySelector('#editProfile .dialog__form #photo');
  formData.append('photo', photo.files[0]);

  const request = await fetch('/users/update-profile', {
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
    closeDialog('editProfile');
    window.location.reload();
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
  } else if (message.includes('photo')) {
    photoLabel = document.querySelector(`label[for='photo']`);
    photoLabel.classList.add('error-outline');
  } else if (message.includes('email')) {
    input = document.querySelector(`input[id='email']`);
    paragraph = document.querySelector(`p[data-error='email']`);
    paragraph.textContent = 'Email invalid';
  } else if (message.includes('password')) {
    input = document.querySelector(`input[id='password']`);
    paragraph = document.querySelector(`p[data-error='password']`);
    paragraph.textContent = 'Parola invalida';
  }
  input?.classList.add('error-outline');
  paragraph?.classList.add('visible');
}

function clearErrors() {
  const inputs = document.querySelectorAll(`#editProfile .dialog__form input`);
  const paragraphs = document.querySelectorAll(`#editProfile .dialog__form p`);
  const photoLabel = document.querySelector(`label[for='photo']`);
  inputs.forEach(input => {
    input.classList.remove('error-outline');
  });
  paragraphs.forEach(paragraph => {
    paragraph.classList.remove('visible');
  });
  photoLabel.classList.remove('error-outline');
}

const downloadSelect = document.querySelector('.download-options');

let initialSelectedIndex = downloadSelect.selectedIndex;

downloadSelect.addEventListener('change', async () => {
  const selectedValue = downloadSelect.value;

  try {
    if (!selectedValue) {
      return;
    }

    let filename;
    let contentType;
    let request;

    switch (selectedValue) {
      case 'CSV':
        filename = 'statistics.csv';
        contentType = 'text/csv';
        request = await fetch('/prisoners/get-info-csv', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            csrfToken: JSON.parse(localStorage.getItem('csrfToken')),
          },
        });
        break;
      case 'HTML':
        filename = 'statistics.html';
        contentType = 'text/html';
        request = await fetch('/prisoners/get-info-html', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            csrfToken: JSON.parse(localStorage.getItem('csrfToken')),
          },
        });
        break;
      case 'JSON':
        filename = 'statistics.json';
        contentType = 'application/json';
        request = await fetch('/prisoners/get-info-json', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            csrfToken: JSON.parse(localStorage.getItem('csrfToken')),
          },
        });
        break;
    }
    const response = await request.text();
    const blob = new Blob([response], { type: contentType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    downloadSelect.selectedIndex = initialSelectedIndex;
  } catch (error) {
    console.error('A apărut o eroare la cererea Fetch:', error);
  }
});
