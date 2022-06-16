"use strict"

const questionNumber = document.getElementsByClassName("question-number")[0];
const leftArrow = document.getElementsByClassName("left-arrow")[0];
const rightArrow = document.getElementsByClassName("right-arrow")[0];
const problemStatement = document.getElementsByClassName("problem-statement")[0];
const answers = document.getElementsByClassName("answer");
const checkAnswerButton = document.getElementsByClassName("check-answer-button")[0];
const checkAnswerDialog = document.getElementsByClassName("check-answer-dialog")[0];
const problemDiv = document.getElementsByClassName("problem")[0];
const seeResultsButton = document.getElementsByClassName("see-results")[0];
const endResults = document.getElementsByClassName("end-results")[0];
const resultsTable = document.getElementsByClassName("results-table")[0];
const resultsTableHTML = resultsTable.innerHTML;
const numberCorrect = document.getElementsByClassName("number-correct")[0];

class Problem {
    constructor(statement, answers, checkAnswerExplanation, correctAnswer) {
        this.statement = statement;
        this.answers = answers;
        this.checkAnswerExplanation = checkAnswerExplanation;
        this.correctAnswer = correctAnswer;
    }
}

const problemList = [];

const dataJSON = 
    [
        {
            "statement": "Which pair of quantities represent scalar quantities?",
            "answers": [
                    "displacement and velocity", "displacement and time", "energy and velocity", "energy and time"
            ],
            "checkAnswerExplanation": "Energy and time are scalar quantities.",
            "correctAnswer": "4"
        },
        {
            "statement": "A sailboat on a lake sails 40. meters north and then sails 40. meters due east. Compared to its starting position, the new position of the sailboat is",
            "answers": [
                    "40. m due east", "40. m due north", "57 m northeast", "80. m northeast"
            ],
            "checkAnswerExplanation": "40*sqrt(2) = 57",
            "correctAnswer": "3"
        },
        {
            "statement": "A ball is thrown straight upward from the surface of Earth. Which statement best describes the ball's velocity and acceleration at the top of its flight?",
            "answers": [
                    "Both velocity and acceleration are zero.", "Velocity is zero and acceleration is nonzero.", "Velocity is nonzero and acceleration is zero.", "Both velocity and acceleration are not zero."
            ],
            "checkAnswerExplanation": "The ball is neither moving up nor down so velocity is zero but acceleration is constant in free fall.",
            "correctAnswer": "2"
        },
        {
            "statement": "As a student runs a plastic comb through her hair, the comb acquires a negative electric charge. This charge results from the transfer of",
            "answers": [
                    "protons from the comb to her hair", "protons from her hair to the comb", "electrons from the comb to her hair", "electrons from her hair to the comb"
            ],
            "checkAnswerExplanation": "Acquiring a negative charge means acquiring more electrons.",
            "correctAnswer": "4"
        },
        {
            "statement": "How would the mass and weight of an object on the Moon compare to the mass and weight of the same object on Earth?",
            "answers": [
                    "Mass and weight would both be less on the Moon.", "Mass would be the same but its weight would be less on the Moon.", "Mass would be less on the Moon and its weight would be the same.", "Mass and weight would both be the same on the Moon."
            ],
            "checkAnswerExplanation": "Mass is conserved but the magnitude of gravity is lower on the moon and so the weight would be less.",
            "correctAnswer": "2"
        }
    ];

for (let i = 0; i < dataJSON.length; i++) {
    problemList.push(new Problem(dataJSON[i].statement, dataJSON[i].answers, dataJSON[i].checkAnswerExplanation, dataJSON[i].correctAnswer));
}

const userAnswers = new Array(problemList.length);

function selectAnswer(id) {
    answers[id].parentNode.style.backgroundColor = "#646fd4";
    answers[id].style.color = "ghostwhite";
}

function eraseAnswerSelection() {
    for (let i = 0; i < answers.length; i++) {
        answers[i].parentNode.style.backgroundColor = "";
        answers[i].style.color = "";
    }
}

function swapCheckAnswer() {
    if (checkAnswerButton.innerHTML == "Check answer") {
        checkAnswerDialog.style.display = "block";
        checkAnswerButton.innerHTML = "Hide answer";
    } else {
        checkAnswerDialog.style.display = "none";
        checkAnswerButton.innerHTML = "Check answer";
    }
}

function setProblem(id) {
    questionNumber.innerHTML = id + 1;
    problemStatement.innerHTML = problemList[id].statement;

    for (let i = 0; i < answers.length; i++) {
        answers[i].innerHTML = problemList[id].answers[i];
    }

    eraseAnswerSelection();

    if (userAnswers[id] !== undefined) {
        selectAnswer(userAnswers[id]);
    } else {
        eraseAnswerSelection();
    }

    checkAnswerDialog.innerHTML = problemList[id].checkAnswerExplanation;

    checkAnswerButton.innerHTML = "Check answer";
    checkAnswerDialog.style.display = "none";
}

let currentID = 0;
setProblem(currentID);

leftArrow.addEventListener("click", () => {
    if (currentID > 0) {
        currentID--;
        setProblem(currentID);
    }
});

rightArrow.addEventListener("click", () => {
    if (currentID < problemList.length - 1) {
        currentID++;
        setProblem(currentID);
    }
});

for (let i = 0; i < answers.length; i++) {
    answers[i].parentNode.parentNode.addEventListener("click", () => {
        eraseAnswerSelection();
        selectAnswer(i);
        userAnswers[currentID] = i;
    });
}

checkAnswerButton.addEventListener("click", () => {
    swapCheckAnswer();
});

function resetTable() {
    resultsTable.innerHTML = resultsTableHTML;
}

seeResultsButton.addEventListener("click", () => {
    problemDiv.style.display = "none";
    endResults.style.display = "block";
    seeResultsButton.style.display = "none";
    const correctnessArray = userAnswers.map((currentValue, index) => {
        if (problemList[index].correctAnswer == currentValue + 1) {
            return true;
        } else {
            return false;
        }
    });
    resetTable();
    for (let i = 0; i < correctnessArray.length; i++) {
        const row = document.createElement("tr");
        const index = document.createElement("td");
        const correctness = document.createElement("td");
        const goBack = document.createElement("td");
        const goBackButton = document.createElement("a");
        goBackButton.classList.add("goBackButton");
        goBackButton.addEventListener("click", () => {
            endResults.style.display = "none";
            problemDiv.style.display = "block";
            seeResultsButton.style.display = "flex";
            currentID = i;
            setProblem(i);
        });
        goBackButton.innerHTML = "Go back";
        goBack.appendChild(goBackButton);
        index.innerHTML = i + 1;
        switch (correctnessArray[i]) {
            case true:
                correctness.innerHTML = "True";
                break;
            case false:
                correctness.innerHTML = "False";
                break;
            default:
                correctness.innerHTML = "";
        }
        row.appendChild(index);
        row.appendChild(correctness);
        row.appendChild(goBack);
        resultsTable.appendChild(row);
        numberCorrect.innerHTML = correctnessArray.filter((value) => {
            return value == true;
        }).length / correctnessArray.length * 100 + "%";
    }
});