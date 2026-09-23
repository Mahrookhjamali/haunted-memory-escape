// ========================================
// ELEMENTS
// ========================================

const startButton = document.getElementById("startBtn");
const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");

const gameOverScreen = document.getElementById("gameOverScreen");
const victoryScreen = document.getElementById("victoryScreen");

const restartButton = document.getElementById("restartBtn");
const playAgainButton = document.getElementById("playAgainBtn");

const gameBoard = document.getElementById("gameBoard");

const livesDisplay = document.getElementById("lives");
const pairsDisplay = document.getElementById("pairs");
const message = document.getElementById("message");

const jumpscare = document.getElementById("jumpscare");


// ========================================
// SYMBOLS
// ========================================

const symbols = [
    "👁️",
    "🕷️",
    "💀",
    "🩸",
    "👻",
    "🕯️",
    "🌙",
    "🔮"
];


// ========================================
// GAME VARIABLES
// ========================================

let firstCard = null;
let secondCard = null;

let lockBoard = false;

let lives = 3;
let matchedPairs = 0;
let mistakes = 0;

let horrorTimer = null;


// ========================================
// START BUTTON
// ========================================

startButton.addEventListener("click", function () {

    startGame();

});


// ========================================
// START GAME
// ========================================

function startGame() {

    startScreen.classList.add("hidden");

    gameOverScreen.classList.add("hidden");

    victoryScreen.classList.add("hidden");

    jumpscare.classList.add("hidden");

    gameScreen.classList.remove("hidden");


    lives = 3;

    matchedPairs = 0;

    mistakes = 0;

    firstCard = null;

    secondCard = null;

    lockBoard = false;


    livesDisplay.textContent = lives;

    pairsDisplay.textContent = "0 / 8";

    message.textContent =
        "Find the haunted pairs... but be careful. 👁️";


    createCards();


    // Start jumpscare timer

    startHorrorTimer();

}


// ========================================
// CREATE CARDS
// ========================================

function createCards() {

    gameBoard.innerHTML = "";

    let cardSymbols = [];


    symbols.forEach(function (symbol) {

        cardSymbols.push(symbol);
        cardSymbols.push(symbol);

    });


    shuffle(cardSymbols);


    cardSymbols.forEach(function (symbol) {

        const card = document.createElement("div");

        card.classList.add("card");

        card.dataset.symbol = symbol;


        card.innerHTML = `

            <div class="card-inner">

                <div class="card-back">
                    ?
                </div>

                <div class="card-front">
                    ${symbol}
                </div>

            </div>

        `;


        card.addEventListener("click", flipCard);


        gameBoard.appendChild(card);

    });

}


// ========================================
// SHUFFLE
// ========================================

function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const randomIndex =
            Math.floor(Math.random() * (i + 1));


        [
            array[i],
            array[randomIndex]
        ] = [
            array[randomIndex],
            array[i]
        ];

    }

}


// ========================================
// FLIP CARD
// ========================================

function flipCard() {

    if (lockBoard) {
        return;
    }


    if (this === firstCard) {
        return;
    }


    if (this.classList.contains("matched")) {
        return;
    }


    this.classList.add("flipped");


    if (firstCard === null) {

        firstCard = this;

        return;

    }


    secondCard = this;

    lockBoard = true;


    checkMatch();

}


// ========================================
// CHECK MATCH
// ========================================

function checkMatch() {

    const isMatch =
        firstCard.dataset.symbol ===
        secondCard.dataset.symbol;


    // ====================================
    // CORRECT
    // ====================================

    if (isMatch) {

        firstCard.classList.add("matched");

        secondCard.classList.add("matched");


        matchedPairs++;


        pairsDisplay.textContent =
            `${matchedPairs} / 8`;


        message.textContent =
            "PAIR FOUND... 👁️";


        resetBoard();


        // VICTORY

        if (matchedPairs === 8) {

            stopHorrorTimer();


            setTimeout(function () {

                gameScreen.classList.add("hidden");

                victoryScreen.classList.remove("hidden");

            }, 700);

        }

    }


    // ====================================
    // WRONG
    // ====================================

    else {

        lives--;

        mistakes++;


        livesDisplay.textContent = lives;


        message.textContent =
            "Wrong pair... something noticed you. 👁️";


        gameScreen.classList.add("horror-flash");

        message.classList.add("creepy-message");


        setTimeout(function () {

            gameScreen.classList.remove("horror-flash");

            message.classList.remove("creepy-message");

        }, 500);


        setTimeout(function () {

            firstCard.classList.remove("flipped");

            secondCard.classList.remove("flipped");


            if (lives === 0) {

                stopHorrorTimer();


                gameScreen.classList.add("hidden");

                gameOverScreen.classList.remove("hidden");


                resetBoard();

                return;

            }


            resetBoard();

        }, 1000);

    }

}


// ========================================
// RESET BOARD
// ========================================

function resetBoard() {

    firstCard = null;

    secondCard = null;

    lockBoard = false;

}


// ========================================
// JUMPSCARE
// ========================================

function triggerJumpscare() {

    // Only during game

    if (gameScreen.classList.contains("hidden")) {
        return;
    }


    // Show jumpscare

    jumpscare.classList.remove("hidden");


    // Shake game

    gameScreen.classList.add("screen-shake");


    // Hide after 1 second

    setTimeout(function () {

        jumpscare.classList.add("hidden");

        gameScreen.classList.remove("screen-shake");

    }, 1000);

}


// ========================================
// JUMPSCARE TIMER
// ========================================

function startHorrorTimer() {

    stopHorrorTimer();


    // TEST VERSION:
    // Jumpscare after exactly 10 seconds

    horrorTimer = setTimeout(function () {

        triggerJumpscare();

    }, 10000);

}


// ========================================
// STOP TIMER
// ========================================

function stopHorrorTimer() {

    if (horrorTimer !== null) {

        clearTimeout(horrorTimer);

        horrorTimer = null;

    }

}


// ========================================
// TRY AGAIN
// ========================================

restartButton.addEventListener("click", function () {

    startGame();

});


// ========================================
// PLAY AGAIN
// ========================================

playAgainButton.addEventListener("click", function () {

    startGame();

});