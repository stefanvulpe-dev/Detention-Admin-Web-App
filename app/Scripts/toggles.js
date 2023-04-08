const arrow = document.querySelector('.drop-arrow')
const card = document.querySelector('.guest-main__list__card')

arrow.addEventListener('click', () => {
  arrow.classList.toggle('extended')
  card.classList.toggle('extended')
})
