
class Deck {
    deck = [];
    generateDeck() {
        const suits = ["D", "H", "C", "S"];
        for (let i = 0; i < suits.length; i++) {
            let numbers = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
            let suit = suits[i];
            for (let x = 0; x < numbers.length; x++) {
                let num = numbers[x];        
                this.deck.push(num + " " + suit);
            }
        }
    }

    drawCard() {
        const cardIndex = getRandomInt(this.deck.length);
        const cardDraw = this.deck[cardIndex];
        this.deck.splice(cardIndex, 1);
        if (this.deck.length === 0) {
            this.generateDeck();
            this.removeCardsInPlayFromDeck();
        }
        return cardDraw;
    }

    removeCardsInPlayFromDeck() {
        player.hand.forEach((c) => {
            this.deck.splice(this.deck.indexOf(c), 1);
        });
        computer.hand.forEach((c) => {
            this.deck.splice(this.deck.indexOf(c), 1);
        });
        this.deck.splice(this.deck.indexOf(document.getElementById("mainCard").innerText));
    }

    drawTestCard(c) {
        return this.deck[this.deck.indexOf(c)];
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

class Player {
    constructor(isPlayer) {
        this.isPlayer = isPlayer;
    }
    hand = [];
    amountofCards = this.hand.length;
    handElements = [];
    drewThisTurn = false;
    playedACard = false;
    cardStyle;
    handDiv;


    // Set variables and draw cards
    initialDraw() {
        this.cardStyle = this.isPlayer ? "" : "computerCard";
        this.handDiv = this.isPlayer ? "playerHand" : "computerHand";
        for (let x = 0; x < 8; x++) {
            this.hand.push(playingDeck.drawCard());
        }
    }

    showCards() {
        this.hand.forEach((c) => {
            this.addOneCard(c);
        });
    }

    addOneCard(c, isNew=false) {
        const newDiv = document.createElement("div");
        newDiv.className = "card " + this.cardStyle;
        const newP = document.createElement("p");
        newP.innerText = c;
        newDiv.appendChild(newP);

        // Card click
        newDiv.addEventListener("click", () => {
            if (gameOver) {
                return;
            }
            if (this.handDiv === "playerHand" && !isPlayerTurn) {
                return;
            }
            const mainCard = document.getElementById("mainCard");
            
            // Logic for different cards on valid play
            if (this.isAMatch(mainCard.innerText, newP.innerText)) {
                // Add to middle and remove from hand
                mainCard.innerText = newP.innerText;
                this.hand.splice(this.hand.indexOf(newP.innerText), 1);
                this.handElements.splice(this.handElements.indexOf(newDiv), 1);
                document.getElementById(this.handDiv).removeChild(newDiv);

                if (this.isPlayer) {
                    addActionMessage(`Player played: ${newP.innerText}`);
                }

                // 2's
                if (mainCard.innerText.split(" ")[0] === "2") {
                    twoCardDraw();
                }
                if (mainCard.innerText.split(" ")[0] !== "2" && countOfTwoCardsPlayed > 0) {
                    countOfTwoCardsPlayed = 0;
                }
                this.playedACard = true;

                // Jacks
                if (mainCard.innerText.split(" ")[0] === "J") {
                    endTurn(true);
                    addActionMessage("Skip a turn played.");
                // 8's
                } else if (mainCard.innerText.split(" ")[0] === "8" && isPlayerTurn) {
                    this.playerEightPlay();
                } else if (mainCard.innerText.split(" ")[0] === "8" && !isPlayerTurn) {
                    computer.chooseNewSuit();
                } else {
                    endTurn();
                }

                // ENDGAME
                if (player.hand.length === 0) {
                    turnIndicator.innerText = "PLAYER WINS";
                    gameOver = true;
                }
            }
        });
        // End logic for card play.

        // For when drawing from middle
        if (isNew) {
            this.hand.push(c);
        }
        this.handElements.push(newDiv);
        document.getElementById(this.handDiv).appendChild(newDiv);

        // Indicator highlight
        if (isPlayerTurn && isNew && countOfTwoCardsPlayed === 0) {
            toggleHighlight(true, newDiv, true);
            tempHighlightedDiv = newDiv;
        }
    }

    playerEightPlay() {
        needToChangeSuit = true;
        toggleSuitButtonsHidden();
        addActionMessage("Choose a suit.");
    }

    // Main card is the middle card. Current is the clicked card.
    isAMatch(mainC, currentC) {
        const mainNumAndSuit = mainC.split(" ");
        const currentNumAndSuit = currentC.split(" ");
        if (currentNumAndSuit[0] === "8") {
            return true;
        }
        if (mainNumAndSuit[0] === currentNumAndSuit[0] | mainNumAndSuit[1] === currentNumAndSuit[1]) {
            return true;
        }
        return false;
    }

}

// For when drawing a card to highlight for 1 turn
let tempHighlightedDiv = "";

class Computer extends Player {
    computerTurn() {
        let searchCard = "0";
        const mainCard = document.getElementById("mainCard").innerText;
        if (mainCard[0] === "2") {
            searchCard = "2";
        }
        if (!this.checkIfCanPlay(searchCard)) {
            document.getElementById("deckButton").click();
        
            if (!this.checkIfCanPlay()) {
                endTurn();
            }
        }
        if (this.hand.length === 0) {
            turnIndicator.innerText = "COMPUTER WINS";
            gameOver = true;
        }
    }

    checkIfCanPlay(searchForCard="0") {
        const mainCard = document.getElementById("mainCard").innerText;
        let cardToPlay = "";
        let foundCard = "";
        for (let i = 0; i < this.handElements.length; i++) {
            const card = this.handElements[i].children[0].innerText;

            // searchForCard is logic for finding 2's and 8's
            if (card[0] === searchForCard) {
                foundCard = this.handElements[i];
                break;
            }
            if (this.isAMatch(mainCard, card)) {
                cardToPlay = this.handElements[i];

                if (searchForCard === "0") {
                    break;
                }
                
            }

        }
        if (foundCard !== "") {
            const cText = foundCard.children[0].innerText;
            addActionMessage(`Computer played: ${cText}`);
            foundCard.click();
            return true;
        }
        if (cardToPlay !== "") {
            const cText = cardToPlay.children[0].innerText;
            addActionMessage(`Computer played: ${cText}`);
            cardToPlay.click();
            return true;
        }

        return false;

    }

    chooseNewSuit() {
        let h = [];
        let c = [];
        let s = [];
        let d = [];
        const collections = [h, c, s, d];
        this.hand.forEach((ca) => {
            switch (ca.split(" ")[1]) {
                case "H":
                    h.push(ca);
                    break;
                case "C":
                    c.push(ca);
                    break;
                case "D":
                    d.push(ca);
                    break;
                case "S":
                    s.push(ca);
                    break;
            }
        });
        let max = 0;
        let current = 0;
        collections.forEach((col) => {
            if (col.length > max) {
                max = col.length;
                current = col;
            }
        });
        eightPlayed(current[0].split(" ")[1]);
        
    }
}

// Global variables
let actionMessages = [];
const playingDeck = new Deck();
let player = null;
let computer = null;
let isPlayerTurn = true;
let controlsEnabled = true;
const turnIndicator = document.getElementById("turnIndicator");
let needToChangeSuit = false;
let gameOver = false;
let countOfTwoCardsPlayed = 0;
let initEight = false;

function startNewGame() {
    playingDeck.deck = [];
    playingDeck.generateDeck();
    resetMessages();
    
    if (player !== null) {
        player.handElements.forEach((d) => {
            document.getElementById(player.handDiv).removeChild(d);
        });
        computer.handElements.forEach((d) => {
            document.getElementById(computer.handDiv).removeChild(d);
        })
    }
    
    player = new Player(true);
    computer = new Computer(false);


    player.initialDraw();
    player.showCards();

    computer.initialDraw();
    computer.showCards();

    document.getElementById("mainCard").innerText = "1 H";
    document.getElementById("mainCard").innerText = playingDeck.drawCard();
    resetMessages();

    // Testing 
    //document.getElementById("mainCard").innerText = playingDeck.drawTestCard("2 H");
    const initCardNum = mainCard.innerText.split(" ")[0];
    if (initCardNum === "2") {
        twoCardDraw();
    } else if (initCardNum === "8") {
        initEight = true;
        player.playerEightPlay();
    }

    // Reset variables
    isPlayerTurn = true;
    controlsEnabled = true;
    gameOver = false;
    toggleSuitButtonsHidden();
    countOfTwoCardsPlayed = 0;

    turnIndicator.innerText = "Player Turn";
}

function addActionMessage(msg) {
    if (actionMessages.length === 3) {
        actionMessages.splice(0, 1);
    }
    actionMessages.push(msg);
    displayActionMessages();
}

function displayActionMessages() {
    const actionText = document.getElementById("actionText");
    actionText.innerText = actionMessages.join("\n");
}

function resetMessages() {
    actionMessages = [];
    document.getElementById("actionText").innerText = "";
}

function endTurn(jackPlayed=false) {
    if (gameOver) {
        return;
    }
    if (needToChangeSuit) {
        return;
    }
    if (isPlayerTurn && !player.drewThisTurn && !player.playedACard) {
        addActionMessage("Draw or play before ending turn.")
        toggleHighlight(true, document.getElementById("deckButton"));
        return;
    }
    isPlayerTurn = !isPlayerTurn;
    if (jackPlayed) {
        isPlayerTurn = !isPlayerTurn;
    }

    computer.drewThisTurn = false;
    player.playedACard = false;
    computer.playedACard = false;
    // Removing highlights
    toggleHighlight(false, document.getElementById("deckButton"));
    toggleHighlight(false, document.getElementById("turnButton"));
    if (tempHighlightedDiv !== "") {
        toggleHighlight(false, tempHighlightedDiv);
        tempHighlightedDiv = "";
    }
    
    turnIndicator.innerText = isPlayerTurn ? "Player Turn" : "Computer Turn";
    if (!isPlayerTurn) {
        computer.computerTurn();
    } else {
        player.drewThisTurn = false;
    }
    toggleSuitButtonsHidden();
}

function twoCardDraw() {
    if (countOfTwoCardsPlayed === 4) {
        countOfTwoCardsPlayed = 0;
    }
    countOfTwoCardsPlayed += 1;
    const cardsToDraw = 2 * countOfTwoCardsPlayed;
    const users = isPlayerTurn ? ["You", "computer"] : ["Computer", "you"];
    const s = users[0] === "Computer" ? "s" : "";
    addActionMessage(`${users[0]} make${s} ${users[1]} draw ${cardsToDraw} cards`);
    for (let i = 0; i < cardsToDraw; i++) {
        const cardToAdd = playingDeck.drawCard();
        if (!isPlayerTurn) {
            player.addOneCard(cardToAdd, "playerHand", true);
            player.drewThisTurn = true;
        } else {
            computer.addOneCard(cardToAdd, "computerHand", true);
            computer.drewThisTurn = true;
        }
    }
}
// Logic for drawing from middle
document.getElementById("deckButton").addEventListener("click", () => {
    if (gameOver) {
        return;
    }
    const handToAddTo = isPlayerTurn ? player : computer;
    if (handToAddTo.drewThisTurn) {
        return;
    }
    const cardToAdd = playingDeck.drawCard();
    if (isPlayerTurn) {
        player.addOneCard(cardToAdd, "playerHand", true);
        player.drewThisTurn = true;
        checkIfPlayerCanPlayAfterDraw();
    } else {
        computer.addOneCard(cardToAdd, "computerHand", true);
        computer.drewThisTurn = true;
    }

});

function checkIfPlayerCanPlayAfterDraw() {
    const main = document.getElementById("mainCard");
    const mainNum = main.innerText.split(" ")[0];
    const mainSuit = main.innerText.split(" ")[1];

    let canPlay = false;
    player.hand.forEach((c) => {
        let cNum = c.split(" ")[0];
        let cSuit = c.split(" ")[1];

        if (cNum === mainNum | cSuit === mainSuit) {
            canPlay = true;
            return;
        }
    });
    if (canPlay) {
        return;
    }
    // If player can't play then highlighting end turn button
    toggleHighlight(true, document.getElementById("turnButton"));

}

function eightPlayed(suit="0") {
    if (suit !== "0") {
        document.getElementById("mainCard").innerText = "8 " + suit;
    }
    addActionMessage(`Suit changed to: ${suit}`);
    needToChangeSuit = false;
    if (!initEight) {
        endTurn();
    }
}

function toggleSuitButtonsHidden() {
    const optsDiv = document.getElementById("eightPlayedOpts");
    const btns = Array.from(optsDiv.children);
    btns.forEach((b) => {
        b.hidden = !needToChangeSuit;
    });
    optsDiv.hidden = !optsDiv.hidden;
}

function toggleHighlight(highlight=false, el, yellow=false) {
    if (highlight) {
        el.style.border = "3px solid green";
    } else {
        el.style.border = "1px solid black";
    }
    if (yellow === true) {
        el.style.border = "3px solid yellow";
    }
}
 

// Initial game start
toggleSuitButtonsHidden();
startNewGame();
