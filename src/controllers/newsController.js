/**
 *
 * @method GET
 * @path '/news/get-news'
 */
export const getNews = async (req, res) => {
  const request = await fetch(
    'https://newsapi.org/v2/everything?q=penitenciar OR închisoare&searchIn=title,description',
    {
      method: 'GET',
      headers: { 'X-Api-Key': '380a949a47574d3f9ed787e834821edb' },
    }
  );
  if (!request.ok) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        error: true,
        message: 'Error fetching news: ' + request.status,
      })
    );
  } else {
    const response = await request.json();
    const shuffledNews = response.articles.sort((a, b) => 0.5 - Math.random());
    const news = shuffledNews.slice(0, 4);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: false, news }));
  }
};
