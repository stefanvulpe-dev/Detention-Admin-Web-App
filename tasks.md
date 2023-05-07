## Sign up Form

- Create `signup.html` based on `login.html`

## Reorganize scripts

- Combine `navToggle.js` and `toggles.js` in `utils.js`

## Create a new script that fetches resources from the server

1. Create new routes for login and signup on the server
2. Add event listener for form submisson on both `signup.html` and `login.html`
3. Add validation for each field using `joi` (on the server)
4. Clear form fields after submission or on close

```js
const form = document.querySelector('.form');

form.addEventListener('submit', async event => {
  event.preventDefault();
  /* event.target.elemnts[0] event.target.elemnts['email']  */

  // Send ajax request to server using fetch API
  const response = await fetch('/register', {
    mehod: 'POST',
    headers: {
        'Content-type': 'application/json'
    }
    body: JSON.stringify({name: event.target.elements['name'], ...})
  })
    const result = await response.json(); // {error: true, message: '...'}
    if (result.error) {

    } else {
        localStorage.setItem('authToken', JSON.stringify(result.authToken));
        localStorage.setItem('csrfToken', JSON.stringify(result.csrfToken));
    }
});
```

## Implement OAuth system

- User authorization using JWT [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- Validation on the server with CSRF tokens [csrf](https://www.npmjs.com/package/csrf)
  - Create a new table `sessions`: id, userId and csrfToken
  - Verify the csrfToken on every request (db query)
  - Delete the record when authToken expires or logout is performed

1. Register function

```js
export const register = async (req, res) => {
  const user = req.body;
  const { error } = joi
    .object({
      username: joi.string().min(3).max(30).required(),
      password: joi
        .string()
        .pattern(new RegExp('^[a-zA-Z0-9]{5,30}$'))
        .required(),
    })
    .validate(user);

  if (error) {

  }

  let result, accessToken;
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    user.password = hashedPassword;
    let repository = new UsersRepository();
    result = await repository.insert(user);
    accessToken = sign(result, process.env.ACCESS_SECRET_KEY!, {
      expiresIn: '7d',
    });
  } catch (err) {

  }
};
```

2. Login function

```js
export const login = async (req) => {
  const credentials = req.body;
  const { error } = joi
    .object({
      username: joi.string().min(5).max(30).required(),
      password: joi
        .string()
        .pattern(new RegExp('^[a-zA-Z0-9]{5,30}$'))
        .required(),
    })
    .validate(credentials);

  if (error) {

  }

  let accessToken;
  try {
    const result = await new UsersRepository().findByUserName(
      credentials.username,
    );
    if (!result.user) {
      throw new Error(`User ${credentials.username} has not been found`);
    }

    const match = await bcrypt.compare(
      credentials.password,
      result.user.password,
    );
    if (!match) {
      throw new Error('Incorrect password');
    }

    accessToken = sign(result.user, process.env.ACCESS_SECRET_KEY!, {
      expiresIn: '7d',
    });
  } catch (err) {

  }
};
```

3. CheckAuth function

```http
HTTP/ 1.1
Authorization: Bearer kvsljdfsdklgjeilrj
CSRFToken: ghjtjdicvmtmedl
```

```js
export const checkAuth = () => {
  //Parse request headers to get csrfToken and authToken

  if (!token) {
    return Response.badRequest({ message: 'Missing auhentication token' });
  }

  try {
    const decoded = verify(token, process.env.ACCESS_SECRET_KEY!);
    req.userId = (decoded as JwtPayload).id;
    next();
  } catch (err) {

  }
};
```

## Migrations

- Implement basic migration
- Implement alter users migration (with `role` column).
