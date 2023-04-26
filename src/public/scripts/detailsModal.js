const detailsInput = [
  {
    id: 'first-name',
    name: 'first-name',
    type: 'text',
    label: 'Nume',
    required: true,
  },
  {
    id: 'last-name',
    name: 'laste-name',
    type: 'text',
    label: 'Prenume',
    required: true,
  },
  {
    id: 'cnp',
    name: 'cnp',
    type: 'number',
    label: 'CNP',
    required: true,
  },
  {
    id: 'series-number',
    name: 'series-number',
    type: 'text',
    label: 'Serie si numar C.I. / Pasaport',
    required: true,
  },
  {
    id: 'email',
    name: 'email',
    type: 'email',
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
]

const createOverlay = () => {
  const overlayElement = document.createElement('div')
  overlayElement.classList.add('overlay')
  overlayElement.classList.add('visible')
  document.body.append(overlayElement)
}

const toggleElement = (id) => {
  const element = document.querySelector(`#${id}`)
  element.classList.toggle('visible')
  const overlay = document.querySelector('.overlay')
  overlay.classList.toggle('visible')
}

const renderDialogModal = (id, title, onClose) => {
  const detailsForm = document.createElement('form')
  detailsForm.classList.add('dialog__form')

  const fragment = new DocumentFragment()

  detailsInput.forEach((element) => {
    const fieldWrapper = document.createElement('div')
    fieldWrapper.classList.add('field-wrapper')

    let input, inputLabel
    input = document.createElement('input')
    inputLabel = document.createElement('label')

    for (const prop of Object.keys(element)) {
      if (prop === 'label') {
        inputLabel.textContent = element[prop]
        inputLabel.htmlFor = element['id']
      } else {
        input[prop] = element[prop]
      }
    }
    fieldWrapper.append(inputLabel, input)
    fragment.append(fieldWrapper)
  })

  let input, inputLabel
  input = document.createElement('input')
  inputLabel = document.createElement('label')

  input.id = 'photo'
  input.name = 'photo'
  input.type = 'file'
  input.required = true

  inputLabel.textContent = 'Incarca o poza \u{1F4C1}'
  inputLabel.htmlFor = 'photo'

  const submitButton = document.createElement('button')
  submitButton.classList.add('form-submit')
  submitButton.textContent = 'Submit'
  submitButton.type = 'submit'

  const fieldWrapper = document.createElement('div')
  fieldWrapper.classList.add('field-wrapper')

  fieldWrapper.append(inputLabel, input)

  const formFooter = document.createElement('div')
  formFooter.classList.add('form-footer')

  formFooter.append(fieldWrapper, submitButton)

  fragment.append(formFooter)
  detailsForm.append(fragment)

  detailsForm.addEventListener('submit', (e) => {
    e.preventDefault()
    onSubmit(e.target.elements)
    e.target.reset()
    onClose(id)
  })

  const headerWrapper = document.createElement('div')
  headerWrapper.classList.add('header-wrapper')

  const formTitle = document.createElement('h2')
  formTitle.classList.add('form-title')
  formTitle.textContent = title

  const closeButton = document.createElement('button')
  closeButton.type = 'button'
  closeButton.classList.add('form-toggle')

  const bar = document.createElement('span')
  bar.classList.add('bar')

  closeButton.append(bar, bar.cloneNode(true))
  closeButton.addEventListener('click', onClose)

  headerWrapper.append(formTitle, closeButton)

  const dialogWindow = document.createElement('dialog')
  dialogWindow.classList.add('guest-dialog')

  dialogWindow.append(headerWrapper, detailsForm)
  dialogWindow.id = id
  dialogWindow.classList.add('visible')

  document.body.append(dialogWindow)
}

const showDialogModal = (id, title) => {
  const overlay = document.querySelector('.overlay')
  const isOverlayCreated = !!overlay

  if (!isOverlayCreated) {
    createOverlay()
  }

  const isDialogCreated = !!document.querySelector(`#${id}`)

  if (!isDialogCreated) {
    renderDialogModal(id, title, () => toggleElement(id))
  } else {
    toggleElement(id)
  }
}

;(function () {
  const addButton = document.querySelector('#add-visitor')
  addButton.addEventListener('click', () =>
    showDialogModal('addGuests', 'Introduceti datele personale')
  )
})()
