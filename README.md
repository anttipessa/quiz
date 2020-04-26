# BWA/TIETA12 coursework 

This project was a groupwork project done in WWW programming course at the Tampere University. Other members of the group were Henri Hakkarainen and Niki Väänänen. Also we had an initial state of the project which included for example the Mongoose models and mostly the user registration and login screens. Our group implemented the game and the management view + some of the tests found at the test-folder.

Techniques used at this project include for example the following:

- Node.js
- Express (backend)
- Handlebars (views)
- MongoDB and Mongoose (data models)
- Vagrant and Docker (setting up the environment)
- Mocha and Chai (unit tests)

This project follows the MVC software desing pattern.

<hr>

In the assignment, we gamify multi-choice questionnaire.
The assignment consists of three parts: the game, management view, and testing/documentation.

1. game - some mechanism for selecting the right answers

2. management implies CRUD operations: questions can be created, queried, modified, and deleted.

3. test your modifications, that is game and management view in particular, other tests can be implemented as well.

In the beginning of December, we will meet all the groups to check that each
group has some idea how to proceed.
In addition, we promote MIT licensing:
if you grant the license, your game may be integrated in the LukioPlussa project;
the project is funded by the Ministry of Education. Its aim is to provide free learning material
for high-school students, especially for the domains of mathematics and computer science.

### The project structure

```
.
├── app.js                  --> express app
├── router.js               --> main router that setups other routes
├── index.js                --> bwa app
├── package.json            --> app info and dependencies
├── controllers             --> controllers (handle e.g. routing)
│   ├── users.js            --> handles the user logic
│   ├── hello.js            --> the same as "minimal viable grader"
│   ├── questionnaire.js    --> handles the management view logic
│   └── game.js             --> handles the game logic
│── middleware              --> middleware
│   ├── auth.js             --> ...
│   ├── passport.js         --> ...
│   └── webpack.js          --> ...
├── models                  --> models that reflect the db schemes
│                               and take care of storing data
├── public                  --> location for public (static) files
│   ├── img                 --> for images
│   ├── js                  --> for javascript
│   │   ├── new.js          --> creates a new quiz
│   │   ├── quizgame.js     --> the quizgame
│   │   └── search.js       --> search function for the management view
│   └── css                 --> for styles
├── routes                  --> a dir for router modules
│   ├── hello.js            --> / (root) router
│   ├── game.js             --> /games router
│   ├── questionnaire.js    --> /questionnaire router
│   └── users.js            --> /users router
├── views                   --> views - visible parts
│   ├── error.hbs           --> error view
│   ├── hello.hbs           --> main view - "minimal viable grader"
│   ├── layouts             --> layouts - handlebar concept
│   │   └── layout.hbs      --> layout view, "template" to be rendered
│   ├── management          --> handlebar components for the management view
│   ├── game                --> handlebar components for the game and grading
│   └── partials            --> smaller handlebar components to be included in views
│── test                    --> tests
│   ├── assignment          --> tests for the management view, grader and game
│   ├── integration         --> integration tests
└── └── models              --> unit tests for models

```

## Game

The game is a quiz, where you select one answer per question and you can move to next question by clicking the "Next"-button. You can also go back to previous questions with the “Previous”-button. After you have answered all the questions, a grade button appears and clicking it automatically scores your quiz and shows the final score. The quizzes can be accessed from the navigation bar or through the path /games. The quizzes are only visible for registered users.

Game data is fetched from MongoDB and the questions and answer options come from that data-object. Answer options are randomized so that if the same quiz is launched multiple times, the order of the options for each question is not always the same. However, questions are shown in selected order.

## Management view

Management view gives the admin and teachers the ability to create, view, edit, delete (CRUD) and also search quizzes from the list of all the quizzes. Management view can be accessed from the navigation bar or through the path /questionnaires. Students are not allowed to acces the management view.

- (C) Clicking "Create.." displays a view where you can create a new quiz. Quiz is given a title and the amount of max submissions and then it can be given multiple different questions. More questions are added by clicking the "Add question"-button. Each question must be given at least two different options and the options a true/false value via the correctness of the option. More than two options can be added to a question by clicking the "Add option"-button. However, maximum of five (5) options can be given to a single question to keep the quiz-game view in control. Only one option per question is allowed to have correctness-value of true.
- (R) Clicking "Show" displays the selected quiz, with ability to see which answer is correct and how many points each question gives.
- (U) Clicking "Edit" lets you edit the fields in the selected quiz and save the modified values to the database. 
- (D) Clicking "Delete", opens a view from where you can delete the selected quiz.

The search function filters the shown quizzes based on the given input. 

## Tests and documentation

Our tests will focus on the management view and testing the game. They're located in the /test/assignment/ folder. 
- grade.test.js tests the grader
- management.test.js tests the management view

## Security concerns

NoSQL Injections 

In the management view, all form inputs are handled with express-sanitizer so that the user can not send malicious inputs to the application.

Brute-force attacks

The app uses bcrypt to hash the passwords.

Cross-site Scripting (XSS)

In the management view, all form inputs are handled with express-sanitizer so that the user can not send malicious inputs to the application.

Cross-Site Request Forgery (CSRF)

Our app is protected against CSRF with CSURF, which creates a token with req.csrfToken(), in requests that mutate state. This token is validated against the visitor's session or csrf cookie.

Our app also uses Helmet, which sets security related HTTP headers. 

---

## Installation

1. Install `nodejs` and `npm`, if not already installed.

2. Execute in the root, in the same place, where _package.json_-file is):

    ```
    npm install
    ```

3. **Copy** `.env.dist` in the root with the name `.env` (note the dot in the beginning of the file)

    ```
    cp -i .env.dist .env
    ```

    **Obs: If `.env`-file already exists, do not overwrite it!**

    **Note: Do not save `.env` file to the git repository - it contains sensitive data!**

    **Note: Do not modify `.env.dist` file. It is a model to be copied as .env, it neither must not contain any sensitive data!**

    Modify `.env` file and set the needed environment variables.

    In the real production environment, passwords need to be
    long and complex. Actually, after setting them, one does
    not need to memorize them or type them manually.

4. `Vagrantfile` is provided. It defines how the vagrant
   environment is set up, commands to be run:

    `vagrant up` //sets up the environment
    `vagrant ssh` //moves a user inside vagrant

    Inside vagrant, go to the directory `/bwa` and start the app:
    `npm start`

5. As an other alternative, `Dockerfile` is provided as well.
   Then, docker and docker-compile must be installed.
   In the root, give:

    ```
    docker-compose build && docker-compose up
    ```

    or

    ```
    docker-compose up --build
    ```

    The build phase should be needed only once. Later on you should omit the build phase and simply run:

    ```
    docker-compose up
    ```

    The container is started in the terminal and you can read what is written to console.log. The container is stopped with `Ctrl + C`.


    Sometimes, if you need to rebuild the whole docker container from the very beginning,
    it can be done with the following command:

    ```
    docker-compose build --no-cache --force-rm && docker-compose up
    ```

6. Docker container starts _bwa_ server and listens `http://localhost:3000/`

7) Docker container is stopped in the root dir with a command:

    ```
    docker-compose down
    ```

## Coding conventions

Project uses _express_ web app framework (https://expressjs.com/).
The application starts from `index.js` that in turn calls other modules.  
The actual _express_ application is created and configured in `app.js` and
routes in `router.js`.

The application complies with the _MVC_ model, where each route has
a corresponding _controller_ in the dir of `controllers`.
Controllers, in turn, use the models for getting and storing data.
The models centralize the operations of e.g. validation, sanitation
and storing of data (i.e., _business logic_) to one location.
Having such a structure also enables more standard testing.

As a _view_ component, the app uses _express-handlebars_;
actual views are put in the dir named `views`. It has two subdirectories:
`layouts` and `partials`.
`layouts` are whole pages, whereas `partials` are reusable smaller
snippets put in the `layouts` or other views. Views, layouts, and partials
use _handlebars_ syntax, and their extension is `.hbs`.
More information about _handlebars_ syntax can be found in: http://handlebarsjs.com/

Files such as images, _CSS_ styles, and clientside JavaScripts are under the `public` directory. When the app is run in a browser, the files are located under the`/`path, at the root of the server, so the views must refer to them using the absolute path. (For example, `<link rel =" stylesheet "href =" / css / style.css ">`) ** Note that `public` is not part of this path. **

The _mocha_ and _chai_ modules are used for testing and the tests can be found under the `test` directory.

##About coding policies

The project code aims to follow a consistent coding conventions
ensured by using the _eslint_ code validation tool. The primary purpose of the tool is to ensure that the project code follows more or less the generally accepted style of appropriate conventions, and that the code avoids known vulnerabilities and / or risky coding practices. In addition, the tool aims to standardize the appearance of code of all programmers involved in the project so that all code is easy to read and maintainable for non-original coders as well.

English is recommended for naming functions and variables and commenting on code. Git commit messages should also be written in English, but this is neither required nor monitored.

##Code style

The _eslint_ tool used is configured to require certain stylistic considerations that can reasonably be considered as opinion issues and may not necessarily be true or false. The intention is not to initiate any debate on the subject or upset anyone's mind, but to strive for uniformity in the appearance of the code, with no other motives.

This project follows the following coding styles:

-   indents with 4 spaces
-   the code block starting bracket `{` is in the same line as the block starting the function, clause or loop
-   the block terminating bracket `}` in the code block is always on its own line, except in cases where the whole block is on a single line
-   the _camelCase_ style is recommended for naming functions and variables
-   the variables should not be defined by using the `var` keyword, but the variables and constants are defined using the `let` and `const` keywords
-   each line of code ends with a semicolon `;`

You can check the style of your code by command:

` npm run lint `

_eslint_ can also correct some code errors and style violations automatically, but you shouldn't rely on this blindly. You can do this explicitly with the command:

` npm run lint:fix `

Naturally, it is easier to set up a code editor to monitor and correct the style during coding.

The project root directory contains the VSCode Editor configuration folder, where the appropriate settings are available for the editor. In addition, it contains plugin recommendations that VSCode will offer to install if the user so wishes. In addition, the project includes the _.editorconfig_ file, which allows you to easily import some of your settings to a number of other editors.
