export const getReqData = req => {
  return new Promise((resolve, reject) => {
    try {
      let body = '';

      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', () => {
        resolve(body);
      });
    } catch (err) {
      reject(err);
    }
  });
};

export const parseCookies = req => {
  const list = {};
  const cookieHeader = req.headers?.cookie;
  if (!cookieHeader) {
    return list;
  }

  cookieHeader.split(`;`).forEach(function (cookie) {
    let [name, ...rest] = cookie.split(`=`);
    name = name?.trim();
    if (!name) {
      return;
    }
    const value = rest.join(`=`).trim();
    if (!value) {
      return;
    }
    list[name] = decodeURIComponent(value);
  });

  return list;
};
