# Movie theater

This is final project of [**CS50W**](https://cs50.harvard.edu/web/2020/) course by Harvard.

## Table of contents

- [Movie theater](#movie-theater)
  - [Table of Content](#table-of-contents)
  - [Distinctiveness and Complexity](#distinctiveness-and-complexity)
    - [visitor](#visitor)
    - [normal](#normal)
    - [premium](#premium)
    - [Specific feature: Donation](#specific-feature--donation)
    - [Feature still under development: Comment, Donation](#feature-still-under-development--comment--donation)
  - [Installation and Usage](#installation-and-usage)
    - [Installation](#installation)
    - [Usage](#usage)
  - [Files Structure](#files-structure)
  - [Tech Stack](#tech-stack)
  - [Contributing](#contributing)
  - [License](#license)

## Distinctiveness and Complexity

The website has backend and frontend separately.

Backend will handle CRUD (Create, Read, Update, Delete) process, provide API links.

Frontend will handle client side, display data to user, update things following the API that backend provides.

The purpose of using Frontend/Backend separately is to make it easier when scale up.

As requirements, backend will use Django with Rest_Framework, language is Python. Frontend will use NextJS framework, with React library, language is Javascript.

We will have 3 typeps of user: **visitor**, **normal**, and **premium**.

And we have features: _watch video_, _read comments_, _comment_, _have avatar_, _have nickname_, _donate_, _modify login information_.

Details of each user types as below:

### visitor

They don't have account, just visit the page, and watch videos.

Feature can use: _watch videos_, _read Comments_, _register_, _donation_.

After regsiter, _visitor_ will become _normal_ user.

### normal

Can access all features that _visitor_ could.

Feature can use: _watch videos_, _read Comments_, _register_, _donation_, **comment**, **modify login information**.

After _donate_, _normal_ user will become _premium_ user.

### premium

Feature can use: _Watch videos_, _Read Comments_, _Register_, _Donation_, _comment_, _modify login information_, **avatar**, **nickname**, **modify avatar and nickname**.

### Specific feature: Donation

The donation will be made by [Blockchain](https://en.wikipedia.org/wiki/Blockchain).

### Limmitaiton and next improvements

In the current time, user can only comment, cannot delete or modify comment.

I already finished the backend api for modify and delete comment. But currently, I don't have enough time to implement it into frontend. In near futures, I will bring this project to production, and finish this feature.

At current time, the donation can only made via Binance Smart Chain (BSC), and only receive BUSD. In future production, I will update more chain and currencies.

The current UI is not that good. I finished project by myself, and haven't got the skill for UI design yet. But it will be improved in future.

We need backgroud job to delete Authentication Token after certain time that token alive.

## Installation and Usage

### Installation

First, install backend (Django) requirements by [pip](https://pypi.org/project/pip/)

```bash
(theater_backend)$ pip install -r requirements.txt
```

Second, install frontend (Next Js) requirements by [yarn](https://classic.yarnpkg.com/lang/en/docs/install)

```bash
(theater_frontend)$ yarn
```

### Usage

Start backend

```bash
(theater_backend)$ python manage.py migrate
(theater_backend)$ python manage.py runserver
```

Start frontend

```bash
(theater_frontend)$ yarn dev
```

_Note: For testing on server, copy `media` folder from backend into `public` folder in frontend_

## Files Structure

This section describes the files structure of the project and the purpose of each file.

```
.
├── README.md (You're reading this file)
├── theater_backend (Backend folder, contains all backend files)
│   ├── .gitignore
│   ├── api
│   │   ├── __init__.py
│   │   ├── admin.py (Register model for admin mainpulations)
│   │   ├── apps.py
│   │   ├── background_jobs.py (Auto delete token in background - not implimented yet)
│   │   ├── migrations (Models migrations)
│   │   │   ├── 0001_initial.py
│   │   │   └── __init__.py
│   │   ├── models.py
│   │   ├── serializers.py (serializer helper)
│   │   ├── templates
│   │   │   └── rest_framework
│   │   │       └── api.html (Template for RESTful API)
│   │   ├── tests.py
│   │   ├── urls.py (URL register)
│   │   └── views.py (functions for each URL)
│   ├── manage.py
│   ├── requirements.txt (Requirements for backend)
│   └── theater_backend
│       ├── __init__.py
│       ├── asgi.py
│       ├── settings.py (Settings)
│       ├── urls.py (Register URL for api app)
│       └── wsgi.py
└── theater_frontend (Frontend folder, contains all frontend files)
    ├── .eslintrc.json
    ├── .gitignore
    ├── components (Reusable components)
    │   ├── filmcard.js (Film card)
    │   ├── layout.js (General layout)
    │   └── navbar.js (Navbar)
    ├── lib (Reusable libraries)
    │   └── cookies.js (Cookies manipulation)
    ├── next.config.js
    ├── package-lock.json
    ├── package.json (Packages that required for project)
    ├── pages (Routes of website)
    │   ├── _app.js (init the app. Will not counted as page)
    │   ├── categories (Film filter by categories)
    │   │   ├── [id].js (query for route)
    │   │   └── index.js (if id is not specified, this page will show)
    │   ├── donate.js (Handle donations)
    │   ├── films
    │   │   ├── [id].js
    │   │   └── index.js
    │   ├── index.js (Hompage, order film from old to new)
    │   ├── login.js (Login)
    │   ├── new.js (Order film from new to old - home page reverted)
    │   ├── profile.js (User modify profile)
    │   └── register.js (Register for new account)
    ├── public (Public folder for page)
    │   ├── favicon.ico
    │   └── vercel.svg
    ├── README.md
    ├── styles (Styles, css. Not use this time, since we use Bootstrap)
    │   ├── globals.css
    │   └── Home.module.css
    └── yarn.lock
```

## Tech Stack

**Client:** [Next Js](https://nextjs.org/), [React Bootstrap](https://react-bootstrap.github.io/)

**Server:** [Django](https://www.djangoproject.com/), [RESTful API](https://restfulapi.net/)

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
