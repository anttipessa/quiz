/*
 * Onko mahdollista saada tämä js-tiedosto linkitettyä views/game/game.hbs
 * tiedoston sriptiin, siten, että koodi luettaisiin täältä eikä olisi koodattu sinne?
 */
// let game = {{{ game }}}
console.log(game)

function buildQuiz() {
    const output = [];

    // for each question...
    game.questions.forEach((currentQuestion, questionNumber) => {
        const answers = [];

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
             <div class='question'> ${currentQuestion.title} </div>
             <div class='answers'> ${answers.join('')} </div>
           </div>`
        );
    });
    // finally combine our output list into one string of HTML and put it on the page
    quizContainer.innerHTML = output.join('');
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
    showSlide(currentSlide + 1);
}

function showPreviousSlide() {
    showSlide(currentSlide - 1);
}
const quizContainer = document.getElementById('quiz');
const resultsContainer = document.getElementById('results');
const submitButton = document.getElementById('grade');
const form = document.getElementById('submitForm');
const title = document.getElementById('title')
const titleText = document.createTextNode(game.title)
title.appendChild(titleText)

// display quiz right away
buildQuiz();

const previousButton = document.getElementById('previous');
const nextButton = document.getElementById('next');
const slides = document.querySelectorAll('.slide');
let currentSlide = 0;

showSlide(0);

previousButton.addEventListener('click', showPreviousSlide);
nextButton.addEventListener('click', showNextSlide);
submitButton.addEventListener('click', updateForm);

function updateForm() {
    const answerContainers = quizContainer.querySelectorAll(".answers");

    // for each question...
    game.questions.forEach((currentQuestion, questionNumber) => {
        // find selected answer
        const answerContainer = answerContainers[questionNumber];
        const selector = `input[name=question${questionNumber}]:checked`;
        const userAnswer = (answerContainer.querySelector(selector) || {}).value;
        console.log(selector)
        console.log(userAnswer)
        let node = document.createElement('INPUT')
        node.setAttribute('type', 'radio')
        node.setAttribute('name', `question${questionNumber}`)
        node.setAttribute('value', userAnswer)
        node.setAttribute('checked', 'checked')
        node.classList.add('hiddenButton')
        form.appendChild(node)
    });
}