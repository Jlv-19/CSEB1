// Initial set of questions
const initialQuestions = [
    {
        questionText: "What is the capital of France?",
        options: ["Berlin", "Madrid", "Paris", "Rome"],
        correctAnswer: "Paris"
    },
    {
        questionText: "What is 2 + 2?",
        options: ["3", "4", "5", "6"],
        correctAnswer: "4"
    },
    {
        questionText: "Which is the largest planet?",
        options: ["Earth", "Mars", "Jupiter", "Saturn"],
        correctAnswer: "Jupiter"
    },
    {
        questionText: "Who developed JavaScript?",
        options: ["Brendan Eich", "James Gosling", "Bjarne Stroustrup", "Guido van Rossum"],
        correctAnswer: "Brendan Eich"
    },
    // Add more questions if needed...
];

let currentQuestionIndex = 0;
let score = 0;
let questions = [];  // To hold either the initial or loaded questions

// Shuffle the questions array
function shuffleQuestions() {
    questions.sort(() => Math.random() - 0.5);  // Shuffle array randomly
    questions = questions.slice(0, 10);  // Limit to 10 random questions
}

// Load the current question
function loadQuestion() {
    if (currentQuestionIndex < questions.length) {
        const question = questions[currentQuestionIndex];
        document.getElementById('question-text').textContent = question.questionText;

        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';  // Clear previous options

        question.options.forEach(option => {
            const optionButton = document.createElement('button');
            optionButton.textContent = option;
            optionButton.classList.add('option-btn');
            optionButton.onclick = () => checkAnswer(option, optionButton); // Pass button for styling
            optionsContainer.appendChild(optionButton);
        });
    } else {
        showScore();  // When all questions are answered, show the score
    }
}

// Check if the selected answer is correct
function checkAnswer(selectedOption, selectedButton) {
    const correctAnswer = questions[currentQuestionIndex].correctAnswer;
    const options = document.querySelectorAll('.option-btn');

    // Disable all buttons after selection to prevent multiple clicks
    options.forEach(option => option.disabled = true);

    if (selectedOption === correctAnswer) {
        score++;
        selectedButton.classList.add('selected-correct'); // Add green color for correct answer
    } else {
        selectedButton.classList.add('selected-incorrect'); // Add red color for incorrect answer
        // Highlight the correct answer in green
        const correctButton = Array.from(options).find(button => button.textContent === correctAnswer);
        correctButton.classList.add('selected-correct');
    }

    currentQuestionIndex++;
    setTimeout(() => loadQuestion(), 1000); // Wait 1 second before loading next question
}

// Show the score
function showScore() {
    document.getElementById('question-container').style.display = 'none';
    document.getElementById('score-container').style.display = 'block';
    const userName = localStorage.getItem('userName');
    document.getElementById('score-text').textContent = `Congratulations, ${userName}! Your final score: ${score}`;
}

// Restart the quiz
function restartQuiz() {
    score = 0;
    currentQuestionIndex = 0;
    shuffleQuestions();
    document.getElementById('score-container').style.display = 'none';
    document.getElementById('question-container').style.display = 'block';
    loadQuestion();
}

// Start the quiz with user input (name)
function startQuiz() {
    const userName = document.getElementById('user-name').value.trim();
    if (userName) {
        localStorage.setItem('userName', userName);  // Store the name in localStorage
        document.getElementById('user-info').style.display = 'none';  // Hide the input
        document.getElementById('question-container').style.display = 'block';  // Show the quiz
        loadQuestions();  // Load the questions (either from JSON or the default list)
    } else {
        alert('Please enter your name!');
    }
}

// Load questions dynamically from a JSON file
function loadQuestions() {
    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            // If there is a dynamic JSON file, use it; otherwise, fall back to initial questions
            questions = data.length > 0 ? data : initialQuestions;
            shuffleQuestions();  // Shuffle and limit to 10 questions
            loadQuestion();
        })
        .catch(err => {
            console.error('Error loading questions from JSON:', err);
            // If the JSON file fails, fall back to the initial set of questions
            questions = initialQuestions;
            shuffleQuestions();  // Shuffle and limit to 10 questions
            loadQuestion();
        });
}

// Initialize the page
document.getElementById('start-btn').onclick = startQuiz;
document.getElementById('next-btn').onclick = loadQuestion;
document.getElementById('restart-btn').onclick = restartQuiz;
