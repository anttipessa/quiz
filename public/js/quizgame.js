'use strict'

loadGameData();

// Initializing some variables
let game, title, titleText, slides, currentSlide;

const quizContainer = document.getElementById('quiz');
const submitButton = document.getElementById('grade');
const previousButton = document.getElementById('previous');
const nextButton = document.getElementById('next');
const form = document.getElementById('submitForm');

previousButton.addEventListener('click', showPreviousSlide);
nextButton.addEventListener('click', showNextSlide);
submitButton.addEventListener('click', updateForm);

async function loadGameData() {
    const data_uri = `/games/data/${document.location.pathname.split('/').pop()}`;
    try {
        const response = await fetch(data_uri);
        game = await handleResponse(response);
        buildQuiz();
    } catch (error) {
        handleError(error + " " + data_uri);
    }
}

function buildQuiz() {
    const output = [];

    function randomize(array) {
        for (let i = 0; i < array.length; i++) {
            const j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    game.questions.forEach((currentQuestion, questionNumber) => {
        const answers = [];
        // Randomize answer options
        randomize(currentQuestion.options);
        currentQuestion.options.forEach(option => {
            answers.push(
                `<label>
                 <input type='radio' name='question${questionNumber}'
                  value='${option.option}'> ${option.option}
                 </label>`
            );
        })
        output.push(
            `<div class='slide'>
             <div class='question'> ${currentQuestion.title}</div>
             <div class='answers'> ${answers.join('')} </div>
           </div>`
        );
    });

    let card = document.querySelector('.card');
    let trackerElem = document.createElement('div');
    trackerElem.classList.add('card-footer', 'text-center');
    let trackerText = `<ol class="track-progress">`;
    for (let i = 0; i < game.questions.length; i++) {
        trackerText += `<li class="todo" id=bar${i + 1}>
                        <span>${i + 1}</span>
                        <li>`
    }
    trackerText += '</ol>';
    trackerElem.innerHTML = trackerText;
    card.appendChild(trackerElem);

    quizContainer.innerHTML = output.join('');

    title = document.getElementById('title')
    titleText = document.createTextNode(game.title)
    title.appendChild(titleText)
    slides = document.querySelectorAll('.slide');
    currentSlide = 0;
    showSlide(0);
}

function showSlide(n) {
    slides[currentSlide].classList.remove('active-slide');
    slides[n].classList.add('active-slide');
    currentSlide = n;

    if (currentSlide === 0) {
        previousButton.style.display = 'none';
    } else {
        previousButton.style.display = 'inline-block';
    }

    if (currentSlide === slides.length - 1) {
        nextButton.style.display = 'none';
        submitButton.style.display = 'inline-block';
    } else {
        nextButton.style.display = 'inline-block';
        submitButton.style.display = 'none';
    }
}

function showNextSlide() {
    let trackerElem = document.getElementById(`bar${currentSlide + 1}`)
    if (trackerElem.classList.contains('todo')) {
        trackerElem.classList.remove('todo')
        trackerElem.classList.add('done')
    }

    showSlide(currentSlide + 1);
}

function showPreviousSlide() {
    let trackerElem = document.getElementById(`bar${currentSlide}`)
    if (trackerElem.classList.contains('done')) {
        trackerElem.classList.remove('done')
        trackerElem.classList.add('todo')
    }
    showSlide(currentSlide - 1);
}

function updateForm() {
    let trackerElem = document.getElementById(`bar${currentSlide + 1}`)
    if (trackerElem.classList.contains('todo')) {
        trackerElem.classList.remove('todo')
        trackerElem.classList.add('done')
    }

    const answerContainers = quizContainer.querySelectorAll(".answers");

    game.questions.forEach((currentQuestion, questionNumber) => {
        // Find selected answer
        const answerContainer = answerContainers[questionNumber];
        const selector = `input[name=question${questionNumber}]:checked`;
        const userAnswer = (answerContainer.querySelector(selector) || {}).value;
        let node = document.createElement('INPUT')
        node.setAttribute('type', 'radio')
        node.setAttribute('name', `question${questionNumber}`)
        node.setAttribute('value', userAnswer)
        node.setAttribute('checked', 'checked')
        node.classList.add('hiddenButton')
        form.appendChild(node)
    });
}

async function handleResponse(response) {
    const contentType = response.headers.get('content-type');

    if (!contentType.includes('application/json')) {
        throw new Error(`Sorry, content-type '${contentType}' not supported`);
    }

    if (!response.ok) {
        return Promise.reject({
            status: response.status,
            statusText: response.statusText
        });
    }

    return await response.json();
}

function handleError(error) {
    throw new Error('Error occurred!')
}