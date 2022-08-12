const player = (name, marker) => {
  // factory
  this.name = name;
  this.marker = marker;

  const getName = () => {
    return name;
  };

  const getMarker = () => {
    return marker;
  };
  return { getMarker, getName };
};

const gameBoard = (() => {
  // module
  let boardArray = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  const current = () => boardArray;

  const updateBoard = (index, player) => {
    // index [row, col]
    boardArray[index[0] - 1][index[1] - 1] = player.getMarker();
  };

  const clear = () => {
    boardArray = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
  }
  return {
    current,
    updateBoard,
    clear
  };
})();

const UI = (() => {
  const ui = document.querySelector(".UI");
  const buttons = document.querySelectorAll(".UI .player-one-marker button");
  const buttons2 = document.querySelectorAll(".UI .player-two-marker button");
  const start = document.querySelector(".UI .start");
  const game = document.querySelector(".game");
  let player1marker = "";
  let player2marker = "";

  // player one
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      select(button);
      player1marker = button.textContent;
    });
  });

  //player two
  buttons2.forEach((button) => {
    button.addEventListener("click", () => {
      select(button);
      player2marker = button.textContent;
    });
  });

  //start button
  start.addEventListener("click", () => {
    if (player1marker != "" && player2marker != "" && player1marker != player2marker) {
      ui.style.display = "none";
      game.style.display = "flex";
      startStatus();
    } else {
      return
    }
  });

  const select = (button) => {
    button.classList.add('selected');
    for (let sibling of button.parentNode.children) {
      if (sibling !== button) sibling.classList.remove('selected');
    }
  }

  const showUI = () => {
    ui.style.display = "flex";
    game.style.display = "none";
  };

  const startStatus = () => {
    return displayController.renderStatus("Player " + player1marker + "'s turn");
  }

  const playerTurn = () => {
    // playerOne to go first
    //[playerTwo, playerOne];
    return [player("Player " + player2marker, player2marker), player("Player " + player1marker, player1marker)]
  }

  return {
    playerTurn, startStatus, showUI
  };
})();

const displayController = (() => {
  // add event listener to each cell
  const status = document.querySelector(".game-status");
  const cells = document.querySelectorAll(".main-board > div div");
  const restart = document.querySelector(".change");
  const reset = document.querySelector(".reset");
  cells.forEach((cell) => {
    cell.addEventListener("click", (e) => {
      if (gameController.getEndGame()) return;

      if (cell.textContent.length == 0) {
        // what row and col the user pressed
        let index = [e.target.parentElement.dataset.row, e.target.dataset.col];
        console.log(index);
        gameController.playRound(index);
        // add bot?
        //gameController.playRound(randomIndex());

      } else {
        // want to color error cell
        cell.style.backgroundColor = "#e88b7b";
        const changeBackgroundBack = () => {
          cell.style.backgroundColor = "#faf0e6";
        }
        setTimeout(changeBackgroundBack, 900);
      }
    });
  });

  const randomIndex = () => {
    let emptyIndexes = [];
    // create a random index from the empty remaining indexes
    for(let row = 0; row<3; row++){
      for(let col = 0; col<3; col++){
        if (gameBoard.current()[row][col] == ""){
          emptyIndexes.push([(row+1).toString(),(col+1).toString()]);
        }
        }
      }
      //console.log(emptyIndexes);
      return emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)]
  }



  restart.addEventListener("click", (e) => {
    //restart game
    //bring UI back
    resetBoard();
    UI.showUI();
  });

  reset.addEventListener("click", (e) => {
    resetBoard();
  });

  const resetBoard = () => {
    gameController.reset();
    gameBoard.clear();
    UI.startStatus();
    renderBoard();
  }

  const renderBoard = () => {
    // updates the board
    for (i = 1; i < 4; i++) {
      // row
      for (j = 1; j < 4; j++) {
        // col
        let cell = document.querySelector(
          ".main-board .row-" + i + " .cell-" + j
        );
        cell.textContent = gameBoard.current()[i - 1][j - 1];
      }
    }
  };

  const renderStatus = (words) => {
    status.textContent = words;
  };

  return {
    renderBoard,
    renderStatus,
  };
})();

const gameController = (() => {
  let endGame = false;
  let round = 1;

  const checkWinner = (marker) => {
    // if the game board matches the winner moves
    for (i = 0; i < 3; i++) {
      // check row condition
      if (
        gameBoard.current()[i][0] == marker &&
        gameBoard.current()[i][1] == marker &&
        gameBoard.current()[i][2] == marker
      ) {
        return true;
      }
      //check col
      if (
        gameBoard.current()[0][i] == marker &&
        gameBoard.current()[1][i] == marker &&
        gameBoard.current()[2][i] == marker
      ) {
        return true;
      }
      // check diagonal condition
      if (
        (gameBoard.current()[0][0] == marker &&
          gameBoard.current()[1][1] == marker &&
          gameBoard.current()[2][2] == marker) ||
        (gameBoard.current()[0][2] == marker &&
          gameBoard.current()[1][1] == marker &&
          gameBoard.current()[2][0] == marker)
      ) {
        return true;
      }
    }
  };

  const playRound = (index) => {
    const playerTurn = UI.playerTurn();
    // alternate between players
    let currentPlayer = playerTurn[round % playerTurn.length];
    // update the board
    gameBoard.updateBoard(index, currentPlayer);
    // update the display
    displayController.renderBoard();
    // update for next round
    round += 1;
    displayController.renderStatus(getCurrentPlayer() + " 's turn");
    // check if theres a winner
    if (checkWinner(currentPlayer.getMarker())) {
      endGame = true;

      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 }
      });

      displayController.renderStatus(
        currentPlayer.getName() + " has won"
      );
      return;
    } else if (round == 10) {
      endGame = true;
      displayController.renderStatus("It's a tie!");
      return;
    }
  };

  const getCurrentPlayer = () => {
    const playerTurn = UI.playerTurn();
    let currentPlayer = playerTurn[round % playerTurn.length];
    return currentPlayer.getName();
  };

  const getEndGame = () => {
    return endGame;
  };

  const reset = () => {
    endGame = false;
    round = 1;
  };

  return {
    playRound,
    getEndGame,
    reset
  };
})();
