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
      localStorage.clear();
      window.location.replace('/views/login.html');
      alert('User logged out successfully.');
    }
  });
}

const heroMainLink = document.querySelector('.hero__main-link');
heroMainLink?.addEventListener('click', async event => {
  event.preventDefault();

  const request = await fetch('/users/get-profile', {
    method: 'GET',
    headers: {
      csrfToken: JSON.parse(localStorage.getItem('csrfToken')),
    },
  });

  const response = await request.json();
  if (response.error) {
    window.location.assign('/views/login.html');
  } else {
    window.location.assign('/views/guestsDetails.html');
  }
});

class Accordion {
  constructor(el) {
    this.el = el;
    this.summary = el.querySelector('.help__qa__question');
    this.content = el.querySelector('.help__qa__steps');

    this.animation = null;
    this.isClosing = false;
    this.isExpanding = false;
    this.summary.addEventListener('click', e => this.onClick(e));
  }

  onClick(e) {
    e.preventDefault();
    this.el.style.overflow = 'hidden';
    if (this.isClosing || !this.el.open) {
      this.open();
    } else if (this.isExpanding || this.el.open) {
      this.shrink();
    }
  }

  shrink() {
    this.isClosing = true;

    const startHeight = `${this.el.offsetHeight + 48}px`;
    const endHeight = `${this.summary.offsetHeight + 48}px`;

    if (this.animation) {
      this.animation.cancel();
    }

    this.animation = this.el.animate(
      {
        height: [startHeight, endHeight],
      },
      {
        duration: 400,
        easing: 'ease-out',
      }
    );

    this.animation.onfinish = () => this.onAnimationFinish(false);
    this.animation.oncancel = () => (this.isClosing = false);
  }

  open() {
    this.el.style.height = `${this.el.offsetHeight}px`;
    this.el.open = true;
    window.requestAnimationFrame(() => this.expand());
  }

  expand() {
    this.isExpanding = true;
    const startHeight = `${this.el.offsetHeight + 48}px`;
    const endHeight = `${
      this.summary.offsetHeight + this.content.offsetHeight + 48
    }px`;

    if (this.animation) {
      this.animation.cancel();
    }

    this.animation = this.el.animate(
      {
        height: [startHeight, endHeight],
      },
      {
        duration: 400,
        easing: 'ease-out',
      }
    );
    this.animation.onfinish = () => this.onAnimationFinish(true);
    this.animation.oncancel = () => (this.isExpanding = false);
  }

  onAnimationFinish(open) {
    this.el.open = open;
    this.animation = null;
    this.isClosing = false;
    this.isExpanding = false;
    this.el.style.height = this.el.style.overflow = '';
  }
}

document.querySelectorAll('.help__qa').forEach(el => {
  new Accordion(el);
});

const anchorLinks = document.querySelectorAll('a[href^="#"]');
anchorLinks.forEach(function (link) {
  link.addEventListener('click', function (event) {
    event.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

const fileInput = document.querySelector(`input[type='file']`);
fileInput?.addEventListener('change', () => {
  const file = fileInput.files[0];
  const fileUploadDetails = document.querySelector('#photo-label');
  fileUploadDetails.textContent = `${file.name} 📁`;
});

const profileLink = document.querySelector('a.profile-link');
const statsLink = document.querySelector('#stats-link');

requireAuth(profileLink, 'userProfile.html');
requireAuth(statsLink, 'statistics.html');

(async function () {
  const profilePicture = document.querySelector('img.person-logo');
  let request = await fetch('/users/get-profile', {
    method: 'GET',
    headers: {
      csrfToken: JSON.parse(localStorage.getItem('csrfToken')),
    },
  });
  let response = await request.json();

  if (response.error) {
    profilePicture.src = '/assets/header/person.jpg';
  } else {
    request = await fetch(
      '/photos/get-photo?' +
        new URLSearchParams({ photo: response.user.photo }),
      {
        method: 'GET',
        headers: { csrfToken: JSON.parse(localStorage.getItem('csrfToken')) },
      }
    );
    response = await request.json();
    profilePicture.src = response.url;
  }
})();

async function requireAuth(link, viewName) {
  link?.addEventListener('click', async event => {
    event.preventDefault();
    const request = await fetch('/users/get-profile', {
      method: 'GET',
      headers: {
        csrfToken: JSON.parse(localStorage.getItem('csrfToken')),
      },
    });

    const response = await request.json();
    if (response.error) {
      window.location.assign('/views/login.html');
    } else {
      window.location.assign(`/views/${viewName}`);
    }
  });
}
