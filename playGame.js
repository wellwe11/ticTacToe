import { startDialog } from "./startDialog.js";

export function createPlayerRound(game) {
  return {
    init: function () {
      this.bindEvents();
    },

    bindEvents: function () {
      this.playerInputHandler = this.playerInput.bind(this);

      game.individualButtons.forEach((button) => {
        button.addEventListener("click", this.playerInputHandler);
      });
    },

    playerInput: function (event) {
      if (!game.playerTwoActive) {
        game.genericPlayerInput(
          event,
          game.playerOneName,
          game.userInputValueOne,
          game.userScoreOne,
          game.playerTwoRound,
          this.playerInputHandler
        );
      }
    },
  };
}

export function createPlayerTwoRound(game) {
  return {
    init: function () {
      this.bindEvents();
    },

    bindEvents: function () {
      this.playerInputHandlerTwo = this.playerInputTwo.bind(this);

      game.individualButtons.forEach((button) => {
        button.addEventListener("click", this.playerInputHandlerTwo);
      });
    },

    playerInputTwo: function (event) {
      if (game.playerTwoActive) {
        game.genericPlayerInput(
          event,
          game.playerTwoName,
          game.userInputValueTwo,
          game.userScoreTwo,
          game.playerRound,
          this.playerInputHandlerTwo
        );
      }
    },
  };
}

export function createComputerRound(game) {
  return {
    init: function () {
      this.cacheDom();
      this.bindEvents();
    },

    cacheDom: function () {
      this.computerBtn = document.querySelector("#clickBtn");
    },

    bindEvents: function () {
      this.computerBtn.addEventListener(
        "click",
        this.triggerComputer.bind(this)
      );
    },

    catchBtn: function (number) {
      this.individualButton = document.querySelector(
        `#mainDiv button[data-initial='${number}']`
      );
      if (!this.individualButton) {
        console.log("button not found");
      }
    },

    triggerComputer: function () {
      game.trueStatement = false;
      while (!game.trueStatement && !game.someoneHasWon) {
        this.createNr();

        game.trueStatement = game.checkArray(game.gameBoardScore);
        if (game.trueStatement && this.individualButton) {
          this.individualButton.textContent = "O";
          this.individualButton.disabled = true;

          game.gameBoardScore.push(game.randomNr);
          game.computerScore.push(game.randomNr);

          game.declareWinner(game.computerScore, "Computer");

          break;
        }
        if (game.gameBoardScore.length > 8) {
          game.info.textContent = "Draww";
          break;
        }
      }
    },

    createNr: function () {
      game.randomNr = Math.floor(Math.random() * 9) + 1;

      this.catchBtn(game.randomNr);
    },
  };
}

export const createGame = function () {
  const game = {
    winningCombinations: [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
      [1, 5, 9],
      [3, 5, 7],
    ],

    //shared
    gameBoardScore: [],
    trueStatement: false, // COMPUTERS GREENLIGHT FOR NEW NUMBER
    someoneHasWon: false,
    initialData: null, // EACHS BUTTONS NUMBER STORED
    pvp: null,

    // player
    userScoreOne: [], // PLAYER ONE SCORE
    userInputValueOne: null,
    playerOneName: null,
    playerHighScoreOne: 0,

    // player2
    userScoreTwo: [], // PLAYER TWO SCORE
    userInputValueTwo: null,
    playerTwoName: null,
    playerTwoActive: false,
    playerHighScoreTwo: 0,

    //computer
    computerScore: [], // COMPUTER SCORE
    randomNr: null, // COMPUTERS SELECTED BUTTON
    computerHighScore: 0,

    init: function () {
      this.cacheDom();
      this.bindEvents();
      this.checkCurrentPlayer(); // KEEP ABOVE RENDER TO AVOID COMPUTERS/PLAYER2S NAME
      this.render();
      this.resetButtons();
    },

    cacheDom: function () {
      this.buttons = document.querySelectorAll(".individualDivs");
      this.individualButtons = document.querySelectorAll(".mainDiv button");
      this.playerScoreBoard = document.getElementById("playerScoreInfo");
      this.computerScoreBoard = document.getElementById("computerScoreInfo");
      this.winningCombo = document.getElementById("winningCombo");
      this.resetBtn = document.getElementById("resetBtn");
      this.ticTacToeDiv = document.getElementById("ticTacToe");
      this.info = document.getElementById("info");
    },
    bindEvents: function () {
      this.resetBtn.addEventListener("click", this.resetAll.bind(this));

      this.playerOneName = startDialog.playerOneSelected.value;
      this.playerTwoName = startDialog.playerTwoSelected.value;
    },
    render: function () {
      this.ticTacToeDiv.style.visibility = "visible";
      this.playerScoreBoard.textContent = `${this.playerOneName}s score: ${this.playerHighScoreOne}`;
      if (this.pvp) {
        this.computerScoreBoard.textContent = `${this.playerTwoName}s score: ${this.playerHighScoreTwo}`;
      } else if (!this.pvp) {
        console.log(this.pvp);
        this.computerScoreBoard.textContent = `Computers score: ${this.computerHighScore}`;
      }
    },

    resetAll: function () {
      this.gameBoardScore = [];
      this.computerScore = [];
      this.userScoreOne = [];
      this.userScoreTwo = [];

      this.randomNr = null;
      this.userInputValueOne = null;
      this.userInputValueTwo = null;

      this.trueStatement = false;
      this.someoneHasWon = false;
      this.playerTwoActive = false;

      this.buttons.forEach((button) => {
        // make buttons previously clicked by computer clickable
        button.disabled = false;
        // make previously clicked buttons content back to nrs..
        this.initialData = button.getAttribute("data-initial");
        button.textContent = this.initialData;
      });

      this.winningCombo.textContent = "";
      this.info.textContent = "";

      this.unbindEvents(this.playerInputHandler);
      this.unbindEvents(this.playerInputHandlerTwo);

      if (this.pvp) {
        this.playerRound.init();
        this.playerTwoRound.init();
      } else {
        this.playerRound.init();
        this.computerRound.init();
      }
    },

    resetButtons: function () {
      this.buttons.forEach((button) => {
        this.initialData = button.getAttribute("data-initial");
        button.textContent = this.initialData;
      });
    },

    // computer array check-function
    checkArray: function (array) {
      if (array.includes(this.randomNr)) {
        if (this.gameBoardScore.length > 8) {
          this.info.textContent = "Draw!";
        }
        console.log(
          `Computer rolled ${this.randomNr}. We already have that. Rolling again...`
        );
        return false; // ? false computer re-rolls
      } else {
        return true; // ? true computer pushes number to array
      }
    },

    declareWinner: function (winnerNr, variableName) {
      for (let combo of this.winningCombinations) {
        if (combo.every((num) => winnerNr.includes(num))) {
          if (variableName === "Computer") {
            this.winningCombo.textContent = `Computer has won with the numbers ${combo}!`;
            this.computerHighScore += 1;
          } else if (variableName === this.playerOneName) {
            this.playerHighScoreOne += 1;
            this.winningCombo.textContent = `${this.playerOneName} has won with the numbers ${combo}!`;
          } else if (variableName === this.playerTwoName) {
            this.playerHighScoreTwo += 1;
            this.winningCombo.textContent = `${this.playerTwoName} has won with the numbers ${combo}!`;
          }
          this.playerScoreBoard.textContent = `${this.playerOneName}s score: ${this.playerHighScoreOne}`;
          if (this.pvp) {
            this.computerScoreBoard.textContent = `${this.playerTwoName}s score: ${this.playerHighScoreTwo}`;
          } else if (!this.pvp) {
            this.computerScoreBoard.textContent = `Computers score: ${this.computerHighScore}`;
          }
          this.someoneHasWon = true;
        }
      }
    },

    checkCurrentPlayer: function () {
      this.playerRound = createPlayerRound(this);
      if (startDialog.vsPlayer.checked) {
        this.playerTwoRound = createPlayerTwoRound(this);

        this.pvp = true;
        // this.playerTwoRound.init();
      } else if (startDialog.vsComputer.checked) {
        this.computerRound = createComputerRound(this);

        this.pvp = false;
        this.computerRound.init();
      }
      this.playerRound.init();
    },

    genericPlayerInput: function (
      event,
      user,
      userInputValue,
      userScore,
      userProfileNext,
      unbindProfile
    ) {
      // if bug causes userInputValue to be X or O:
      // userInputValue = parseInt(event.target.getAttribute("data-initial"));
      // v else v
      userInputValue = parseInt(event.target.textContent);
      console.log(userInputValue);

      // check if number is real number
      if (!Number(userInputValue)) {
        console.log("ERROR: userInputValue isNaN");
      }

      if (
        !this.gameBoardScore.includes(userInputValue) &&
        !this.someoneHasWon &&
        !isNaN(userInputValue)
      ) {
        this.gameBoardScore.push(userInputValue);
        userScore.push(userInputValue);

        this.declareWinner(userScore, user);

        if (!this.pvp) {
          this.computerRound.computerBtn.click(this);
        } else if (this.pvp) {
          user === this.playerOneName
            ? (this.playerTwoActive = true)
            : (this.playerTwoActive = false);

          this.unbindEvents(unbindProfile);
          event.target.textContent = user === this.playerOneName ? "X" : "O";
          userInputValue = null;
          console.log(this.gameBoardScore);
          if (!this.someoneHasWon) {
            userProfileNext.init();
          }
        }
      } else if (this.gameBoardScore.length > 8) {
        console.log("ERROR: array full");
      } else {
        this.info.textContent = isNaN(userInputValue)
          ? console.log("ERROR: number isNaN")
          : "";
      }
    },

    unbindEvents: function (playerHandler) {
      this.individualButtons.forEach((button) => {
        button.removeEventListener("click", playerHandler);
      });
    },
  };

  return game;
};
