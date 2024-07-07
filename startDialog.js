import {
  createGame,
  createPlayerRound,
  createPlayerTwoRound,
  createComputerRound,
} from "./playGame.js";

export const startDialog = (function () {
  return {
    init: function () {
      this.cacheDom();
      this.bindEvents();
      this.render();
      this.showDialog();
    },
    cacheDom: function () {
      this.dialog = document.getElementById("initialInfo");
      this.dialogInputs = document.querySelectorAll(
        "input[type='text'][name='playerName']"
      );
      this.vsPlayer = document.getElementById("vsPlayer");
      this.vsComputer = document.getElementById("vsComputer");
      this.playerTwoSelected = document.getElementById("player2");
      this.playerOneSelected = document.getElementById("player1");
      this.secondPlayerInputText = document.querySelector(
        "label[for='player2']"
      );
      this.firstPlayerInputText = document.querySelector(
        "label[for='player1']"
      );
      this.letsGoBtn = document.getElementById("letsGoBtn");
    },
    bindEvents: function () {
      this.vsPlayer.addEventListener("change", this.render.bind(this));
      this.vsComputer.addEventListener("change", this.render.bind(this));
      this.letsGoBtn.addEventListener(
        "click",
        this.letsGoBtnClicked.bind(this)
      );
    },
    render: function () {
      if (!this.vsPlayer.checked && !this.vsComputer.checked) {
        this.playerOneSelected.disabled = true;
        this.playerTwoSelected.disabled = true;
        this.playerOneSelected.style.display = "none";
        this.playerTwoSelected.style.display = "none";
        this.firstPlayerInputText.style.display = "none";
        this.secondPlayerInputText.style.display = "none";
      }
      if (this.vsPlayer.checked) {
        this.playerTwoSelected.style.display = "";
        this.secondPlayerInputText.style.display = "";

        this.firstPlayerInputText.style.display = "";
        this.playerOneSelected.style.display = "";

        this.playerOneSelected.disabled = false;
        this.playerTwoSelected.disabled = false;

        this.dialog.style.animation = "resize 0.3s ease-in-out forwards";

        this.dialogInputs.forEach(
          (input) => (input.style.color = "black"),
          (input.style.animation = "textSlide 0.5s ease-in-out forwards")
        );

        this.dialogInputs.style.color = "black";
      } else if (this.vsComputer.checked) {
        this.playerTwoSelected.style.display = "none";
        this.secondPlayerInputText.style.display = "none";
        this.playerTwoSelected.disabled = true;

        this.firstPlayerInputText.style.display = "";
        this.playerOneSelected.style.display = "";

        this.playerOneSelected.disabled = false;
      }
    },

    showDialog: function () {
      if (this.dialog) {
        this.dialog.showModal();
      }
    },

    letsGoBtnClicked: function (event) {
      event.preventDefault();
      if (
        (this.vsComputer.checked && this.playerOneSelected.value.length > 0) ||
        (this.vsPlayer.checked &&
          this.playerOneSelected.value.length > 0 &&
          this.playerTwoSelected.value.length > 0)
      ) {
        this.dialog.close();
        const game = createGame();
        game.init();
      }
    },
  };
})();

startDialog.init();
