const detailsInput = [
  {
    id: 'lastName',
    name: 'lastName',
    type: 'text',
    label: 'Nume',
    required: true,
  },
  {
    id: 'firstName',
    name: 'firstName',
    type: 'text',
    label: 'Prenume',
    required: true,
  },
  {
    id: 'nationalId',
    name: 'nationalId',
    type: 'text',
    label: 'CNP',
    required: true,
  },
  {
    id: 'passportNumber',
    name: 'passportNumber',
    type: 'text',
    label: 'Serie si numar C.I. / Pasaport',
    required: true,
  },
  {
    id: 'email',
    name: 'email',
    type: 'text',
    label: 'Email',
    required: true,
  },
  {
    id: 'relationship',
    name: 'relationship',
    type: 'text',
    label: 'Relatia cu condamnatul',
    required: true,
  },
];

const renderDialogModal = (id, title, onSubmit, onClose) => {
  const detailsForm = document.createElement('form');
  detailsForm.classList.add('dialog__form');

  const fragment = new DocumentFragment();

  detailsInput.forEach(element => {
    const fieldWrapper = document.createElement('div');
    fieldWrapper.classList.add('field-wrapper');

    let input, inputLabel;
    input = document.createElement('input');
    inputLabel = document.createElement('label');

    for (const prop of Object.keys(element)) {
      if (prop === 'label') {
        inputLabel.textContent = element[prop];
        inputLabel.htmlFor = element['id'];
      } else {
        input[prop] = element[prop];
      }
    }

    const errorParagraph = document.createElement('p');
    errorParagraph.classList.add('error-message');
    errorParagraph.setAttribute('data-error', input.id);

    fieldWrapper.append(inputLabel, input, errorParagraph);
    fragment.append(fieldWrapper);
  });

  let input, inputLabel;
  input = document.createElement('input');
  inputLabel = document.createElement('label');

  input.id = 'photo';
  input.name = 'photo';
  input.type = 'file';
  input.setAttribute('data-parent', id);
  input.accept = 'image/jpg, image/jpeg, image/png';

  inputLabel.textContent = 'Incarca o poza \u{1F4C1}';
  inputLabel.htmlFor = 'photo';
  inputLabel.setAttribute('data-parent', id);

  const submitButton = document.createElement('button');
  submitButton.classList.add('form-submit');
  submitButton.textContent = 'Submit';
  submitButton.type = 'submit';

  const fieldWrapper = document.createElement('div');
  fieldWrapper.classList.add('field-wrapper');

  fieldWrapper.append(inputLabel, input);

  const formFooter = document.createElement('div');
  formFooter.classList.add('form-footer');

  formFooter.append(fieldWrapper, submitButton);

  fragment.append(formFooter);
  detailsForm.append(fragment);

  detailsForm.addEventListener('submit', async event => {
    event.preventDefault();
    await onSubmit();
  });

  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('header-wrapper');

  const formTitle = document.createElement('h2');
  formTitle.classList.add('form-title');
  formTitle.textContent = title;

  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.classList.add('form-toggle');

  const bar = document.createElement('span');
  bar.classList.add('bar');

  closeButton.append(bar, bar.cloneNode(true));
  closeButton.addEventListener('click', onClose);

  headerWrapper.append(formTitle, closeButton);

  const dialogWindow = document.createElement('dialog');
  dialogWindow.classList.add('guest-dialog');

  dialogWindow.append(headerWrapper, detailsForm);
  dialogWindow.id = id;

  document.body.append(dialogWindow);
};

const showDialogModal = (id, title, onSubmit) => {
  renderDialogModal(id, title, onSubmit, () => closeDialog(id));

  const fileInput = document.querySelector(`input[data-parent='${id}']`);
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    const fileUploadDetails = document.querySelector(
      `label[data-parent='${id}']`
    );
    fileUploadDetails.textContent = `${file.name} 📁`;
  });

  const dialog = document.querySelector(`#${id}`);
  dialog.showModal();
};

(function () {
  const addButton = document.querySelector('#add-visitor');
  addButton.addEventListener('click', () =>
    showDialogModal(
      'addGuests',
      'Introduceti datele personale',
      submitGuestDetails
    )
  );
})();
