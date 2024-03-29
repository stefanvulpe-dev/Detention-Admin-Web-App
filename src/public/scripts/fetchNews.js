(async function () {
  const request = await fetch('/news/get-news', { method: 'GET' });
  const response = await request.json();
  if (response.error) {
    console.log(response.message);
    displayStandardImages();
  } else {
    renderNewsCards(response.news);
  }
  document.querySelector('.main__container').style.display = 'grid';
})();

function renderNewsCards(news) {
  const newsData = news.map(article => {
    const title = article.source.name;
    const content = article.title;
    const date = moment(article.publishedAt, 'YYYY-MM-DDThh:mm:ssZ').format(
      'DD MMMM YYYY'
    );
    const link = article.url;
    const image = article.urlToImage;
    return { title, content, date, link, image };
  });

  const newsCards = document.querySelectorAll('.card');
  newsCards.forEach((card, index) => {
    card.querySelector('.card__img').src = newsData[index].image;
    card.querySelector('.card__title').textContent = newsData[index].title;
    card.querySelector('.card__description').textContent =
      newsData[index].content;
    card
      .querySelector('.card__container-date time')
      .setAttribute(
        'datetime',
        moment(newsData[index].date, 'DD MMMM YYYY').format('YYYY-MM-DD')
      );
    card.querySelector('.card__container-date time').textContent =
      newsData[index].date;
    card.querySelector('.card__container-link').href = newsData[index].link;
  });
}

function displayStandardImages() {
  const slimCard1Img = document.querySelector('#slimCard1 .card__img');
  const wideCard1Img = document.querySelector('#wideCard1 .card__img');
  const slimCard2Img = document.querySelector('#slimCard2 .card__img');
  const wideCard2Img = document.querySelector('#wideCard2 .card__img');

  slimCard1Img.src = '/assets/acasa/police-landscape-1.webp';
  wideCard1Img.src = '/assets/acasa/police-portrait-1.webp';
  slimCard2Img.src = '/assets/acasa/police-landscape-2.webp';
  wideCard2Img.src = '/assets/acasa/police-portrait-2.webp';
}
