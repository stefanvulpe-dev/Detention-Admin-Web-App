const detailsInputs = [
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
    type: 'select',
    label: 'Relatia cu condamnatul',
    options: [
      'Ruda de gradul I',
      'Ruda de gradul II',
      'Prieten',
      'Avocat',
      'Psiholog',
    ],
    required: true,
  },
];

const userDetailsInputs = [
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
    id: 'relationship',
    name: 'relationship',
    type: 'select',
    label: 'Relatia cu condamnatul',
    options: [
      'Ruda de gradul I',
      'Ruda de gradul II',
      'Prieten',
      'Avocat',
      'Psiholog',
    ],
    required: true,
  },
];

const profileInputs = [
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
    id: 'email',
    name: 'email',
    type: 'text',
    label: 'Email',
    required: true,
  },
  {
    id: 'password',
    name: 'password',
    type: 'password',
    label: 'Password',
    required: true,
  },
];

const renderDialogModal = (id, title, inputs, onSubmit, onClose) => {
  const detailsForm = document.createElement('form');
  detailsForm.classList.add('dialog__form');

  const fragment = new DocumentFragment();

  inputs.forEach(element => {
    if (element.type === 'select') {
      const selectWrapper = document.createElement('div');
      selectWrapper.classList.add('select-wrapper');

      const select = document.createElement('select');
      select.id = element.id;
      select.name = element.name;

      //default option
      const option = document.createElement('option');
      option.value = '';
      option.selected = true;
      option.disabled = true;
      option.hidden = true;
      option.textContent = 'Alege o optiune';

      select.append(option);

      element.options.forEach(option => {
        const selectOption = document.createElement('option');
        selectOption.value = option;
        selectOption.textContent = option;

        select.append(selectOption);
      });

      selectWrapper.append(select);

      const fieldWrapper = document.createElement('div');
      fieldWrapper.classList.add('field-wrapper');

      const label = document.createElement('label');
      label.textContent = element.label;
      label.htmlFor = element.id;

      const errorParagraph = document.createElement('p');
      errorParagraph.classList.add('error-message');
      errorParagraph.setAttribute('data-error', element.id);

      fieldWrapper.append(label, selectWrapper, errorParagraph);
      fragment.append(fieldWrapper);
      return;
    }

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

  let submitButton, formFooter;

  if (id === 'addGuests' || id === 'editGuests' || id === 'editProfile') {
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

    submitButton = document.createElement('button');

    const fieldWrapper = document.createElement('div');
    fieldWrapper.classList.add('field-wrapper');

    fieldWrapper.append(inputLabel, input);

    formFooter = document.createElement('div');
    formFooter.append(fieldWrapper, submitButton);
  } else {
    submitButton = document.createElement('button');
    formFooter = document.createElement('div');
    formFooter.append(submitButton);
  }

  submitButton.classList.add('form-submit');
  submitButton.textContent = 'Submit';
  submitButton.type = 'submit';

  formFooter.classList.add('form-footer');

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

function getExtensionFile(file) {
  const lastIndex = file.lastIndexOf('.');
  if (lastIndex !== -1) {
    const extension = file.slice(lastIndex);
    return extension;
  }
  return '';
}

const showDialogModal = (id, title, inputs, onSubmit) => {
  renderDialogModal(id, title, inputs, onSubmit, () => closeDialog(id));

  if (id === 'addGuests' || id === 'editGuests' || id === 'editProfile') {
    const fileInput = document.querySelector(`input[data-parent='${id}']`);
    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      const fileUploadDetails = document.querySelector(
        `label[data-parent='${id}']`
      );
      if (file.name.length > 10) {
        fileUploadDetails.textContent =
        file.name.slice(0, 10) +
          '...' +
          file.name.slice(-6) +
          ' 📂';
      } else {
        fileUploadDetails.textContent = file.name + ' 📂';
      }
    });
  }

  const dialog = document.querySelector(`#${id}`);
  dialog.showModal();
};

(function () {
  const addButton = document.querySelector('#add-visitor');
  addButton?.addEventListener('click', () =>
    showDialogModal(
      'addGuests',
      'Introduceti datele personale',
      detailsInputs,
      submitGuestDetails
    )
  );
})();


