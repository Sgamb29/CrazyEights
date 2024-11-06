



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
        // TODO: Logic for if deck is empty
        if (this.deck.length === 0) {
            this.generateDeck();
            this.removeCardsInPlay();
        }
        return cardDraw;
    }

    removeCardsInPlay() {
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

    hand = [];
    amountofCards = this.hand.length;
    handDivs = [];
    drewThisTurn = false;
    playedACard = false;

    initialDraw() {
        for (let x = 0; x < 8; x++) {
            this.hand.push(playingDeck.drawCard());
        }
    }

    showCards(compOrPlayerCard, compOrPlayerHand) {
        this.hand.forEach((c) => {
            this.addOneCard(c, compOrPlayerCard, compOrPlayerHand);
        });
    }

    addOneCard(c, compOrPlayerCard, compOrPlayerHand, isNew=false) {
        const newDiv = document.createElement("div");
        newDiv.className = "card " + compOrPlayerCard;
        const newP = document.createElement("p");
        newP.innerText = c;
        newDiv.appendChild(newP);

        // Logic for when a card is played
        newDiv.addEventListener("click", () => {
            if (gameOver) {
                return;
            }
            if (compOrPlayerHand === "playerHand" & !isPlayerTurn) {
                return;
            }
            const mainCard = document.getElementById("mainCard");
            
            if (this.isAMatch(mainCard.innerText, newP.innerText)) {
                mainCard.innerText = newP.innerText;
                this.hand.splice(this.hand.indexOf(newP.innerText), 1);

                this.handDivs.splice(this.handDivs.indexOf(newDiv), 1);
                document.getElementById(compOrPlayerHand).removeChild(newDiv);

                if (mainCard.innerText.split(" ")[0] === "2") {
                    twoCardDraw();
                }
                if (mainCard.innerText.split(" ")[0] !== "2" & countOfTwoCardsPlayed > 0) {
                    countOfTwoCardsPlayed = 0;
                }
                this.playedACard = true;

                if (mainCard.innerText.split(" ")[0] === "J") {
                    endTurn(true);
                    actionText.innerText = "Skip a turn played.";
                } else if (mainCard.innerText.split(" ")[0] === "8" & isPlayerTurn) {
                    needToChangeSuit = true;
                    toggleSuitButtonsHidden();
                    actionText.innerText = "Choose a suit.";
                } else if (mainCard.innerText.split(" ")[0] === "8" & !isPlayerTurn) {
                    computer.chooseNewSuit();
                } else {
                    endTurn();
                }
                

                if (player.hand.length === 0) {
                    turnIndicator.innerText = "PLAYER WINS";
                    gameOver = true;
                }
            }
        });
        if (isNew) {
            this.hand.push(c);
        }
        this.handDivs.push(newDiv);
        document.getElementById(compOrPlayerHand).appendChild(newDiv);
    }

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

class Computer extends Player {

    canPlay = false;

    computerTurn() {
        let searchCard = "0";
        const mainCard = document.getElementById("mainCard").innerText;
        if (mainCard[0] === "2") {
            searchCard = "2";
        }
        this.checkIfCanPlay(searchCard);
        
        if (!this.canPlay) {
            document.getElementById("deckButton").click();
            this.checkIfCanPlay();
        }
        if (!this.canPlay) {
            endTurn();
        }
        this.canPlay = false;

        if (this.hand.length === 0) {
            turnIndicator.innerText = "COMPUTER WINS";
            gameOver = true;
        }
    }

    checkIfCanPlay(searchForCard="0") {
        const mainCard = document.getElementById("mainCard").innerText;
        let cardToPlay = "";
        let foundCard = "";
        for (let i = 0; i < this.handDivs.length; i++) {
            const card = this.handDivs[i].children[0].innerText;

            // searchForCard is logic for finding 2's and 8's
            if (card[0] === searchForCard) {
                foundCard = this.handDivs[i];
            }
            if (this.isAMatch(mainCard, card)) {
                cardToPlay = this.handDivs[i];

                if (searchForCard === "0") {
                    break;
                }
                
            }

        }
        if (foundCard !== "") {
            this.canPlay = true;
            foundCard.click();
            return;
        }
        if (cardToPlay !== "" ) {
            this.canPlay = true;
            cardToPlay.click();
        }

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

const actionText = document.getElementById("actionText");

const playingDeck = new Deck();
let player = new Player();
let computer = new Computer();

let isPlayerTurn = true;
let controlsEnabled = true;

const turnIndicator = document.getElementById("turnIndicator");

let gameOver = false;

function startNewGame() {
    playingDeck.deck = [];
    playingDeck.generateDeck();

    player.handDivs.forEach((d) => {
        document.getElementById("playerHand").removeChild(d);
    });
    computer.handDivs.forEach((d) => {
        document.getElementById("computerHand").removeChild(d);
    })

    player = new Player();
    computer = new Computer();

    

    player.initialDraw();
    player.showCards("playerCard", "playerHand");

    computer.initialDraw("computerCard");
    computer.showCards("computerCard", "computerHand");

    document.getElementById("mainCard").innerText = playingDeck.drawCard();

    actionText.innerText = "";

    // Testing, undefined means the card's in a hand.
    //document.getElementById("mainCard").innerText = playingDeck.drawTestCard("2 H");
    const initCardNum = mainCard.innerText.split(" ")[0];
    if (initCardNum === "2") {
        twoCardDraw();
    } else if (initCardNum === "8") {

    }

    isPlayerTurn = true;
    controlsEnabled = true;
    gameOver = false;

    turnIndicator.innerText = "Player Turn";
}

function endTurn(jackPlayed=false) {
    if (gameOver) {
        return;
    }
    if (needToChangeSuit) {
        return;
    }
    if (isPlayerTurn & !player.drewThisTurn & !player.playedACard) {
        actionText.innerText = "Player must draw or play a card before ending turn.";
        return;
    }
    isPlayerTurn = !isPlayerTurn;
    if (jackPlayed) {
        isPlayerTurn = !isPlayerTurn;
    }
    computer.drewThisTurn = false;
    player.playedACard = false;
    computer.playedACard = false;
    
    
    turnIndicator.innerText = isPlayerTurn ? "Player Turn" : "Computer Turn";
    if (!isPlayerTurn) {
        computer.computerTurn();
    } else {
        player.drewThisTurn = false;
    }
}

// For when a 2 card is played
let countOfTwoCardsPlayed = 0;
function twoCardDraw() {
    if (countOfTwoCardsPlayed === 4) {
        countOfTwoCardsPlayed = 0;
    }
    countOfTwoCardsPlayed += 1;
    const cardsToDraw = 2 * countOfTwoCardsPlayed;
    const users = isPlayerTurn ? ["You", "computer"] : ["Computer", "you"];
    const s = users[0] === "Computer" ? "s" : "";
    actionText.innerText = `${users[0]} make${s} ${users[1]} draw ${cardsToDraw} cards`;
    for (let i = 0; i < cardsToDraw; i++) {
        const cardToAdd = playingDeck.drawCard();
        if (!isPlayerTurn) {
            player.addOneCard(cardToAdd, "playerCard", "playerHand", true);
            player.drewThisTurn = true;
        } else {
            computer.addOneCard(cardToAdd, "computerCard", "computerHand", true);
            computer.drewThisTurn = true;
        }
    }
    

}
// Logic for drawing cards
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
        player.addOneCard(cardToAdd, "playerCard", "playerHand", true);
        player.drewThisTurn = true;
    } else {
        computer.addOneCard(cardToAdd, "computerCard", "computerHand", true);
        computer.drewThisTurn = true;
    }

});

let needToChangeSuit = false;
function eightPlayed(suit="0") {

    if (suit !== "0") {
        document.getElementById("mainCard").innerText = "+ " + suit;
    }


    actionText.innerText = `Suit changed to: ${suit}`;
    if (isPlayerTurn) {
        toggleSuitButtonsHidden();
    }
    
    
    needToChangeSuit = false;
    endTurn();

}

function toggleSuitButtonsHidden() {
    const optsDiv = document.getElementById("eightPlayedOpts");
    const btns = Array.from(optsDiv.children);
    btns.forEach((b) => {
        b.hidden = !b.hidden;
    });
    optsDiv.hidden = ! optsDiv.hidden;
}
 

// Initial game start
startNewGame();

toggleSuitButtonsHidden();