# API.BOOKSHOP.COM

My default branch is for development of the frontend vue project `api.bookshop.com`

## Table of contents

- [Quick start](#quick-start)
- [What's included](#whats-included)
- [Running documentation locally](#running-documentation-locally)

## Quick start

Here are the link to some userful URL's:

- link to my [github repository](https://github.com/Damilolajim/api.bookshop.com.git)
- link to my [render.com endpoint collections](https://api-bookshop-com.onrender.com/v1)

## What's included

Within the [download](https://github.com/Damilolajim/api.bookshop.com/archive/refs/heads/main.zip) you'll find the following directories and files, logically grouping common assets and providing both compiled and minified variations.

<details>
  <summary>Project Structure</summary>

```text

api.bookshop.com/
├── config/
│   ├── db.js
│   └── config.env
│
├── controllers/
│   ├── cart.js
│   ├── course.js
│   └── error.js
│
├── middleware/
│   ├── cleanupData.js
│   └── joi.js
│
├── utilities/
│   ├── catchError.js
│   ├── heloper.js
│   ├── throwError.js
│   └── joi.js
│
├── .gitignore
├── app.js
├── package-lock.json
├── package.json
├── README.me
└── server.js

```

</details>

## Running documentation locally

1. Run `npm install` to install the Node.js dependencies
2. From the root `/api.bookshop.com` directory, run `npm run dev` to run the development version of the project
3. From the root `/api.bookshop.com` directory, run `npm start` to run the production version
4. import
5. Open `http://localhost:8000/` in your postman.
