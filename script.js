// ========================================
// HAUNTED MEMORY — GAME SCRIPT
// ========================================


// ========================================
// DOM ELEMENTS
// ========================================

const startBtn = document.getElementById("startBtn");

const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const victoryScreen = document.getElementById("victoryScreen");

const restartBtn = document.getElementById("restartBtn");
const playAgainBtn = document.getElementById("playAgainBtn");

const gameBoard = document.getElementById("gameBoard");

const livesDisplay = document.getElementById("lives");
const pairsDisplay = document.getElementById("pairs");

const message = document.getElementById("message");

const jumpscare = document.getElementById("jumpscare");


// ========================================
// GAME DATA
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

let firstCard = null;
let secondCard = null;

let lockBoard = false;

let lives = 3;
let matchedPairs = 0;
let mistakes = 0;

let horrorTimer = null;
let hauntedEventTimer = null;


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
    pairsDisplay.textContent = matchedPairs;

    message.textContent =
        "Find the haunted pairs... but be careful. 👁️";

    createCards();

    startHorrorTimer();

    startHauntedEvents();
}


// ========================================
// CREATE CARDS
// ========================================

function createCards() {

    gameBoard.innerHTML = "";

    const cards = [...symbols, ...symbols];

    cards.sort(() => Math.random() - 0.5);

    cards.forEach(symbol => {

        const card = document.createElement("div");

        card.classList.add("card");

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
// FLIP CARD
// ========================================

function flipCard() {

    if (lockBoard) return;

    if (this === firstCard) return;
    triggerCardReaction(this);

    if (this.classList.contains("matched")) return;

    this.classList.add("flipped");

    if (!firstCard) {

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

    const firstSymbol =
        firstCard.querySelector(".card-front").textContent.trim();

    const secondSymbol =
        secondCard.querySelector(".card-front").textContent.trim();


    // ====================================
    // MATCH
    // ====================================

    if (firstSymbol === secondSymbol) {

        firstCard.classList.add("matched");
        secondCard.classList.add("matched");

        matchedPairs++;

        pairsDisplay.textContent = matchedPairs;

        message.textContent =
            "PAIR FOUND... 👁️";

        resetBoard();


        // ALL PAIRS FOUND
        if (matchedPairs === symbols.length) {

            stopHorrorTimer();
            stopHauntedEvents();

            setTimeout(() => {

                gameScreen.classList.add("hidden");

                victoryScreen.classList.remove("hidden");

            }, 700);

        }

    }


    // ====================================
    // WRONG PAIR
    // ====================================

    else {

        lives--;

        mistakes++;

        livesDisplay.textContent = lives;

        message.textContent =
            "IT SAW YOU... 👁️";


        firstCard.classList.add("wrong-card");
        secondCard.classList.add("wrong-card");


        gameScreen.classList.add("horror-flash");
        message.classList.add("creepy-message");


        setTimeout(() => {

            firstCard.classList.remove("wrong-card");
            secondCard.classList.remove("wrong-card");

            gameScreen.classList.remove("horror-flash");
            message.classList.remove("creepy-message");

        }, 700);


        setTimeout(() => {

            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");

        }, 1000);


        // GAME OVER
        if (lives === 0) {

            stopHorrorTimer();
            stopHauntedEvents();

            setTimeout(() => {

                gameScreen.classList.add("hidden");

                gameOverScreen.classList.remove("hidden");

            }, 1000);

            resetBoard();

            return;

        }


        resetBoard();

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

    if (gameScreen.classList.contains("hidden")) {
        return;
    }

    jumpscare.classList.remove("hidden");

    gameScreen.classList.add("screen-shake");


    setTimeout(() => {

        jumpscare.classList.add("hidden");

        gameScreen.classList.remove("screen-shake");

    }, 1000);

}


// ========================================
// HORROR TIMER
// ========================================

function startHorrorTimer() {

    stopHorrorTimer();

    horrorTimer = setTimeout(() => {

        triggerJumpscare();

    }, 10000);

}


function stopHorrorTimer() {

    clearTimeout(horrorTimer);

}


// ========================================
// RANDOM HAUNTED EVENTS
// ========================================

function startHauntedEvents() {

    stopHauntedEvents();

    scheduleNextHauntedEvent();

}


function stopHauntedEvents() {

    clearTimeout(hauntedEventTimer);

}


function scheduleNextHauntedEvent() {

    const randomDelay =
        Math.floor(Math.random() * 8000) + 7000;

    hauntedEventTimer = setTimeout(() => {

        triggerRandomHauntedEvent();

        scheduleNextHauntedEvent();

    }, randomDelay);

}


// ========================================
// RANDOM EVENT SELECTOR
// ========================================

function triggerRandomHauntedEvent() {

    if (gameScreen.classList.contains("hidden")) {
        return;
    }

    const eventNumber =
        Math.floor(Math.random() * 4);


    switch (eventNumber) {

        case 0:

            hauntedWhisper();

            break;


        case 1:

            hauntedFlash();

            break;


        case 2:

            hauntedShake();

            break;


        case 3:

            hauntedMessage();

            break;

    }

}


// ========================================
// EVENT 1 — WHISPER
// ========================================

function hauntedWhisper() {

    const oldMessage =
        message.textContent;

    message.textContent =
        "DON'T LOOK BEHIND YOU...";

    message.classList.add("creepy-message");


    setTimeout(() => {

        message.textContent = oldMessage;

        message.classList.remove("creepy-message");

    }, 1800);

}


// ========================================
// EVENT 2 — QUICK RED FLASH
// ========================================

function hauntedFlash() {

    gameScreen.classList.add("horror-flash");

    setTimeout(() => {

        gameScreen.classList.remove("horror-flash");

    }, 450);

}


// ========================================
// EVENT 3 — SCREEN SHAKE
// ========================================

function hauntedShake() {

    gameScreen.classList.add("screen-shake");

    setTimeout(() => {

        gameScreen.classList.remove("screen-shake");

    }, 500);

}


// ========================================
// EVENT 4 — RANDOM CREEPY MESSAGE
// ========================================

function hauntedMessage() {

    const messages = [

        "I'M WATCHING YOU... 👁️",

        "YOU HEARD THAT, RIGHT?",

        "DON'T MAKE A MISTAKE...",

        "SOMETHING IS MOVING...",

        "YOU ARE NOT ALONE...",

        "KEEP LOOKING...",

        "IT KNOWS YOUR MOVE..."

    ];

    const randomMessage =
        messages[
            Math.floor(Math.random() * messages.length)
        ];


    const oldMessage =
        message.textContent;


    message.textContent =
        randomMessage;

    message.classList.add("creepy-message");


    setTimeout(() => {

        message.textContent =
            oldMessage;

        message.classList.remove("creepy-message");

    }, 2000);

}


// ========================================
// BUTTON EVENTS
// ========================================

startBtn.addEventListener(
    "click",
    startGame
);


restartBtn.addEventListener(
    "click",
    startGame
);


playAgainBtn.addEventListener(
    "click",
    startGame
);
// ========================================
// SPECIAL HAUNTED CARD REACTIONS
// ========================================

function triggerCardReaction(card) {

    const symbol =
        card.querySelector(".card-front").textContent.trim();


    // 👁️ EYE
    if (symbol === "👁️") {

        message.textContent =
            "IT'S WATCHING YOU... 👁️";

        message.classList.add("creepy-message");

        setTimeout(() => {

            message.classList.remove("creepy-message");

        }, 1200);

    }


    // 💀 SKULL
    else if (symbol === "💀") {

        gameScreen.classList.add("screen-shake");

        message.textContent =
            "YOU SHOULD NOT HAVE TOUCHED THAT...";

        setTimeout(() => {

            gameScreen.classList.remove("screen-shake");

        }, 550);

    }


    // 🕷️ SPIDER
    else if (symbol === "🕷️") {

        gameScreen.classList.add("horror-flash");

        message.textContent =
            "SOMETHING CRAWLED PAST YOU...";

        setTimeout(() => {

            gameScreen.classList.remove("horror-flash");

        }, 350);

    }


    // 🩸 BLOOD
    else if (symbol === "🩸") {

        message.textContent =
            "THIS BLOOD IS STILL FRESH...";

        message.classList.add("creepy-message");

        setTimeout(() => {

            message.classList.remove("creepy-message");

        }, 1500);

    }


    // 👻 GHOST
    else if (symbol === "👻") {

        message.textContent =
            "DID YOU SEE THAT GHOST?";

        message.classList.add("creepy-message");

        setTimeout(() => {

            message.classList.remove("creepy-message");

        }, 1400);

    }


    // 🔮 CRYSTAL BALL
    else if (symbol === "🔮") {

        message.textContent =
            "IT KNOWS WHAT YOU'LL PICK NEXT...";

        message.classList.add("creepy-message");

        setTimeout(() => {

            message.classList.remove("creepy-message");

        }, 1600);

    }


    // 🕯️ CANDLE
    else if (symbol === "🕯️") {

        message.textContent =
            "THE FLAME IS FLICKERING...";

        message.classList.add("creepy-message");

        setTimeout(() => {

            message.classList.remove("creepy-message");

        }, 1300);

    }


    // 🌙 MOON
    else if (symbol === "🌙") {

        message.textContent =
            "THE NIGHT IS WATCHING...";

        message.classList.add("creepy-message");

        setTimeout(() => {

            message.classList.remove("creepy-message");

        }, 1300);

    }

}
