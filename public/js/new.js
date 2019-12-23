const addQuestionBtn = document.getElementById('addQuestion');
let addOptionBtns;

let questionCounter = 1;

function addListeners() {
    addOptionBtns = document.querySelectorAll('.addOption');
    for (let i = 0; i < addOptionBtns.length; i++) {
        addOptionBtns[i].addEventListener('click', addOption)
    }
}

function addOption() {
    let questionNumber = this.classList[3].split('lvl');
    questionNumber = Number.parseInt(questionNumber[1]);
    let upperDiv = document.querySelector(`.options${questionNumber}`);
    let option = `<label for="option">Option</label>
                        <input type="text" name="option${questionNumber}" class="form-control" {{#if option}}value="{{option}}"
                         {{/if}} placeholder="Insert option here.." required>`

    let correctness = `<label for="correctness">Correctness</label>
                        <select class="form-control" name="correctness${questionNumber}" required>
                            <option value="false">False</option>
                            <option value="true">True</option>
                        </select>`
    let newElem1 = document.createElement('div')
    newElem1.classList.add('form-group');
    let newElem2 = document.createElement('div')
    newElem2.classList.add('form-group');
    newElem1.innerHTML = option;
    newElem2.innerHTML = correctness;
    upperDiv.appendChild(newElem1);
    upperDiv.appendChild(newElem2);
}

function addQuestion() {
    questionCounter += 1;
    let upperDiv = document.querySelector('.questions');
    let questionForm = `<hr>
                        <h5 style="text-align: center">Question ${questionCounter}</h5>
                        <div class="form-group">
                        <label for="title">Question title</label>
                        <input type="text" name="questionTitle" class="form-control" {{#if title}}value="{{title}}" {{/if}}
                         placeholder="Insert question title here.." required>
                        </div>
                        <div class="form-group">
                            <label for="maxPoints">Max points</label>
                            <input type="number" name="maxPoints" class="form-control" value="1" readonly>
                        </div>
                        <div class="form-group options${questionCounter}">
                        <h5>Options</h5>
                            <hr>
                            <div class="form-group">
                                <label for="option">Option</label>
                                <input type="text" name="option${questionCounter}" class="form-control" {{#if option}}value="{{option}}"
                                    {{/if}} placeholder="Insert option here.." required>
                            </div>
                            <div class="form-group">
                                <label for="correctness">Correctness</label>
                                <select class="form-control" name="correctness${questionCounter}" required>
                                    <option value="false">False</option>
                                    <option value="true">True</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="option">Option</label>
                                <input type="text" name="option${questionCounter}" class="form-control" {{#if option}}value="{{option}}"
                                    {{/if}} placeholder="Insert option here.." required>
                            </div>
                            <div class="form-group">
                                <label for="correctness">Correctness</label>
                                <select class="form-control" name="correctness${questionCounter}" required>
                                    <option value="false">False</option>
                                    <option value="true">True</option>
                                </select>
                            </div>
                        </div>
                        <button type="button" class="btn btn-primary addOption lvl${questionCounter}">Add Option</button>`
    let newElem = document.createElement('div')
    newElem.innerHTML = questionForm;
    upperDiv.appendChild(newElem);
    addListeners();

}

addQuestionBtn.addEventListener('click', addQuestion);
addListeners();