document.addEventListener('DOMContentLoaded', function () {
  // Smooth scroll behavior for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });
});

const arrow = document.querySelector('.drop-arrow');
const card = document.querySelector('.guest-main__list__card');

if (arrow) {
  arrow.addEventListener('click', () => {
    arrow.classList.toggle('extended');
    card.classList.toggle('extended');
  });
}

const navToggleButton = document.querySelector('.nav__toggle');
const navBar = document.querySelector('.header__nav');

navToggleButton.addEventListener('click', e => {
  navBar.classList.toggle('active');
  navToggleButton.classList.toggle('active');
});

const logoutButton = document.querySelector('#logout-button');
if (logoutButton) {
  logoutButton.addEventListener('click', async () => {
    const response = await fetch('/logout', {
      method: 'DELETE',
      headers: {
        csrfToken: JSON.parse(localStorage.getItem('csrfToken')),
      },
    });

    const result = await response.json();
    if (result.error) {
      console.log(result.message);
    } else {
      localStorage.removeItem('csrfToken');
      window.location.replace('/');
      alert('User logged out successfully.');
    }
  });
}

const heroMainLink = document.querySelector('.hero__main-link');
heroMainLink?.addEventListener('click', async event => {
  event.preventDefault();

  const response = await fetch('/views/guestsDetails.html', { method: 'GET' });

  if (!response.ok) {
    window.location.assign('/views/login.html');
  } else {
    window.location.assign('/views/guestsDetails.html');
  }
});
