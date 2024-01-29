import { _decorator, Component, Label, input, Input, Color, tween } from 'cc';
import { ChooseBtns } from './ChooseBtns';
import { GAME_BOARDSIZE, GAME_EVENTS, eventTarget } from './Constants';
import { Players } from './Players';
import { WinningLine } from './WinningLine';
const { ccclass, property } = _decorator;
import { Result } from './Result';

enum PlayerTurn {
    PT_P1,
    PT_P2
}

enum GameState {
    GS_PLAYING,
    GS_END
}

let temp = 7;

let xWin = 0;
let oWin = 0;
let tie = 0;

let currentWinner = 0;

@ccclass('Board')
export class Board extends Component {

    @property({ type: ChooseBtns })
    chooseBtns: ChooseBtns[] = [];

    @property({ type: Players })
    public player: Players;

    public board: number[][] = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

    private currentPlayer: PlayerTurn;

    @property({ type: WinningLine })
    public winning: WinningLine;

    @property({
        type: Result
    })
    public resLabel: Result;


    onLoad() {
        this.registerEvents();
    }

    protected start(): void {
        this.init();
    }

    setCurState(value: GameState) {
        switch (value) {
            case GameState.GS_PLAYING:
                temp = 0;
                // this.gamePlay();
                break;
            case GameState.GS_END:
                temp = 1;
                this.gameOver();
                break;
        }
    }

    registerEvents() {
        input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        eventTarget.on(GAME_EVENTS.ON_PLAYER_MOVE, this.onPlayerMadeMove, this);
        this.setCurState(GameState.GS_PLAYING);
    }

    onMouseUp() {
        if (temp == 1)
            this.restartGame();
        console.log("Patodia");
    }

    restartGame() {
        eventTarget.on(GAME_EVENTS.ON_PLAYER_MOVE, this.onPlayerMadeMove, this);
        this.init();
        for (let i = 0; i < GAME_BOARDSIZE.row; i++) {
            for (let j = 0; j < GAME_BOARDSIZE.row; j++) {
                this.board[i][j] = 0;
            }
        }
    }

    onPlayerMadeMove(index) {
        var row = Math.floor(index / GAME_BOARDSIZE.row);
        var col = Math.floor(index % GAME_BOARDSIZE.col);
        var result = 0;
        if (this.currentPlayer == PlayerTurn.PT_P1) {
            result = 1;
            this.chooseBtns[index].onUpdateLabel("X");
        } else {
            result = 2;
            this.chooseBtns[index].onUpdateLabel("O");
        }
        this.board[row][col] = result;
        console.log("board " + this.board);
        this.checkWin();
        if (temp == 0)
            this.switchPlayer();
    }


    init() {
        for (let index = 0; index < this.chooseBtns.length; index++) {
            this.chooseBtns[index].reset();
        }
        if (currentWinner == 0) {
            this.currentPlayer = PlayerTurn.PT_P1;
            this.player.players[1].active = false;
        } else if (currentWinner == 1) {
            this.currentPlayer = PlayerTurn.PT_P1;
            this.player.players[1].active = false;
            this.player.players[0].active = true;
        } else if (currentWinner == 2) {
            this.currentPlayer = PlayerTurn.PT_P2;
            this.player.players[0].active = false;
            this.player.players[1].active = true;
        }

        this.setCurState(GameState.GS_PLAYING);
    }


    checkWin() {
        // Check rows
        for (let i = 0; i < GAME_BOARDSIZE.row; i++) {
            if (this.checkRow(i)) {
                this.handleWinningPlayer(this.board[i][0]);
                return;
            }
        }

        // Check columns
        for (let i = 0; i < GAME_BOARDSIZE.col; i++) {
            if (this.checkColumn(i)) {
                this.handleWinningPlayer(this.board[0][i]);
                return;
            }
        }

        // Check diagonals
        if (this.checkDiagonal(0, 0, 1, 1) || this.checkDiagonal(0, 2, 1, -1)) {
            this.handleWinningPlayer(this.board[1][1]);
            return;
        }

        // Check for a tie
        if (this.checkTie()) {
            this.setCurState(GameState.GS_END);
            console.log("It's a tie!");
        }
    }

    checkRow(row: number): boolean {
        return this.board[row][0] !== 0 && this.board[row][0] === this.board[row][1] && this.board[row][1] === this.board[row][2];
    }

    checkColumn(col: number): boolean {
        return this.board[0][col] !== 0 && this.board[0][col] === this.board[1][col] && this.board[1][col] === this.board[2][col];
    }

    checkDiagonal(row: number, col: number, rowIncrement: number, colIncrement: number): boolean {
        const startCell = this.board[row][col];
        return startCell !== 0 && startCell === this.board[row + rowIncrement][col + colIncrement] && startCell === this.board[row + 2 * rowIncrement][col + 2 * colIncrement];
    }

    checkTie(): boolean {
        for (let i = 0; i < GAME_BOARDSIZE.row; i++) {
            for (let j = 0; j < GAME_BOARDSIZE.col; j++) {
                if (this.board[i][j] === 0) {
                    return false;
                }
            }
        }
        return true;
    }

    showPlayer(value: number) {
        if (value == 1) {
            xWin++;
            this.resLabel.res[0].getComponent(Label).string = '' + xWin;
            currentWinner = value;
        } else {
            oWin++;
            this.resLabel.res[1].getComponent(Label).string = '' + oWin;
            currentWinner = value;
            // player2 board
        }
    }

    handleWinningPlayer(player: number) {
        this.setCurState(GameState.GS_END);
        console.log("Player " + player + " wins!");
        this.showPlayer(player);
        if (this.checkRow(0)) {
            for (let i = 0; i < 3; i++)
                this.chooseBtns[i].getComponentInChildren(Label).color = new Color(255, 120, 0);
        } else if (this.checkRow(1)) {
            for (let i = 3; i < 6; i++)
                this.chooseBtns[i].getComponentInChildren(Label).color = new Color(255, 120, 0);
        } else if (this.checkRow(2)) {
            for (let i = 6; i < 9; i++)
                this.chooseBtns[i].getComponentInChildren(Label).color = new Color(255, 120, 0);
        } else if (this.checkColumn(0)) {
            for (let i = 0; i < 9; i += 3)
                this.chooseBtns[i].getComponentInChildren(Label).color = new Color(255, 120, 0);
        } else if (this.checkColumn(1)) {
            for (let i = 1; i < 9; i += 3)
                this.chooseBtns[i].getComponentInChildren(Label).color = new Color(255, 120, 0);
        } else if (this.checkColumn(2)) {
            for (let i = 2; i < 9; i += 3)
                this.chooseBtns[i].getComponentInChildren(Label).color = new Color(255, 120, 0);
        } else if (this.checkDiagonal(0, 2, 1, -1)) {
            for (let i = 2; i < 7; i += 2)
                this.chooseBtns[i].getComponentInChildren(Label).color = new Color(255, 120, 0);
        } else {
            for (let i = 0; i < 9; i += 4)
                this.chooseBtns[i].getComponentInChildren(Label).color = new Color(255, 120, 0);
        }
    }

    gameOver() {
        console.log("hello");
        eventTarget.off(GAME_EVENTS.ON_PLAYER_MOVE, this.onPlayerMadeMove, this);
        this.player.players[0].active = false;
        this.player.players[1].active = false;
        if (this.checkTie()) {
            tie++;
            this.resLabel.res[2].getComponent(Label).string = '' + tie;
            // print tie board
        }
    }

    switchPlayer() {
        if (this.currentPlayer == PlayerTurn.PT_P1) {
            this.currentPlayer = PlayerTurn.PT_P2;
            this.player.players[0].active = false;
            this.player.players[1].active = true;
        } else {
            this.currentPlayer = PlayerTurn.PT_P1;
            this.player.players[0].active = true;
            this.player.players[1].active = false;
        }
        //   this.currentPlayer = this.currentPlayer == PlayerTurn.PT_P1?PlayerTurn.PT_P2:PlayerTurn.PT_P1;
    }
}


