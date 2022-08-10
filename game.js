const gameBoard = (() => {
    // module
    let boardArray = [["", "", ""], ["", "", ""], ["", "", ""]]
    const current = () => boardArray;

    const updateBoard = (index, player) => {
        // index [row, col]
        boardArray[index[0]-1][index[1]-1] = player.getMarker();
    }
    return {
        current, updateBoard
    };
})();


const player = (name, marker) => {
    // factory
    this.name = name;
    this.marker = marker;

    const getMarker = () => {
        return marker;
    };
    return { getMarker };
};


const displayController = (() => {
    // add event listener to each cell
    const cells = document.querySelectorAll(".main-board > div div");
    cells.forEach(cell => {
        cell.addEventListener("click", (e) => {

            // if cell empty place player marker down
            if(cell.textContent.length == 0){
                //cell.textContent = "G!"
                // what row and col the user pressed
                let index = [e.target.parentElement.dataset.row,e.target.dataset.col];
                console.log(index);
                gameController.playRound(index);
            }else{
                cell.style.backgroundColor = "red";

            }
            // else full do nothing
            
        });
    });
    
    const renderBoard = () => {
        // updates the board 
        for (i = 1; i < 4; i++) {
            // row
            for (j = 1; j < 4; j++) {
                // col
                let cell = document.querySelector(".main-board .row-" + (i) + " .cell-" + (j));
                cell.textContent = gameBoard.current()[i-1][j-1];
            }
        }

    }
    return {
        renderBoard
    };
})();


const gameController = (() => {
    const playerOne = player('Player 1', "x");
    const playerTwo = player('Player 2', "o");

    let round = 1;

    // playerOne to go first
    playerTurn = [playerTwo, playerOne];

    const playRound = (index) => {
        if(round == 10) return

        // alternate between players
        let currentPlayer = playerTurn[round % playerTurn.length];

        // update the board
        gameBoard.updateBoard(index, currentPlayer);

        // update the display
        displayController.renderBoard();

        // update for next round
        round+=1;
    }

    return {
        playRound
    };
})();
