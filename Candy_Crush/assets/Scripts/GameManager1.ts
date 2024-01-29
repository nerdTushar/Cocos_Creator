import { _decorator, CCInteger, Color, Component, EventTouch, EventTarget, tween, instantiate, Label, Node, Prefab, Sprite, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

const eventTarget = new EventTarget();

enum GameState {
    GAME_START,
    GAME_PLAYING,
    GAME_END
}

@ccclass('GameManager1')
export class GameManager extends Component {
    @property({
        type: Color
    })
    public candyColors: Color[] = [];

    @property({
        type: Prefab
    })
    public candyPrefab: Prefab;

    @property({
        type: Node
    })
    public playScreen: Node;
    @property({
        type: Node
    })
    public endScreen: Node;
    @property({
        type: Node
    })
    public gameScreen: Node;

    @property({
        type: CCInteger
    })
    public moves: number;

    @property({
        type: Label
    })
    public movesValue: Label;
    @property({
        type: Label
    })
    public gameScoreValue: Label;
    @property({
        type: Label
    })
    public gameHighScoreValue: Label;

    @property({
        type: Label
    })
    public endScoreValue: Label;
    @property({
        type: Label
    })
    public endHighScoreValue: Label;

    @property({
        type: Node
    })
    public candyBoard: Node;

    public recordArray: number[][] = [];
    // public recordPositionArray: Vec3[][] = [];
    public recordCandyArray: Node[][] = [];

    public row: number = 7;
    public col: number = 7;
    public candyWidth: number = 85;
    public candygap: number = 5;
    public defaultWorldPos: Vec3 = null!;
    public boardDefaultWorldPos: Vec3 = null!;

    public tweenDuration : number = 1.0; 

    public rightSwap: boolean = false;
    public leftSwap: boolean = false;
    public topSwap: boolean = false;
    public bottomSwap: boolean = false;

    public gameScore: number = 0;
    public gameHighScore: number = 0;

    onLoad(){
        this.setCurrentState(GameState.GAME_START);
        eventTarget.on('BurstColumnCandy', this.onBurstColumnCandy, this);
        eventTarget.on('blankColumnCandy', this.onBlankColumnCandy, this);
        eventTarget.on('BurstRowCandy', this.onBurstRowCandy, this);
        eventTarget.on('blankRowCandy', this.onBlankRowCandy, this);
    }

    setCurrentState(type: GameState){
        switch(type){
            case GameState.GAME_START:
                this.init();
                break;
            case GameState.GAME_PLAYING:
                this.gamePlaying();
                break;
            case GameState.GAME_END:
                this.gameOver();
                break;
        }
    }

    init(){
       this.playScreen.active = true;
       this.endScreen.active = false;
       this.gameScreen.active = false;
    }

    gameOver(){
        this.playScreen.active = false;
        this.endScreen.active = true;
        this.gameScreen.active = false;

        this.endScoreValue.string = this.gameScoreValue.string;
        this.endHighScoreValue.string = this.gameHighScoreValue.string;
    }

    onPlayGame(){
        this.setCurrentState(GameState.GAME_PLAYING);
    }

    onRetryGame(){
        this.moves = 10;

        this.gameScore = 0;
        this.gameScoreValue.string = this.gameScore.toString();

        this.candyBoard.removeAllChildren();

        this.recordArray = [];
        this.recordCandyArray = [];

        this.setCurrentState(GameState.GAME_PLAYING);
    }

    gamePlaying(){
        this.playScreen.active = false;
        this.endScreen.active = false;
        this.gameScreen.active = true;

        this.movesValue.string = this.moves.toString();

        this.createGrid();

        this.checkGameRules();
    }

    createGrid(){
        let x = -270;
        let y = 270;
        let tempColors = [];
        // let tempPosition = [];
        let tempCandy = [];

        for(let i=0; i < this.row; i++){
            tempColors = [];
            // tempPosition = [];
            tempCandy = [];
            for(let j=0; j < this.col; j++){
                // generate candy
                let candy = instantiate(this.candyPrefab);
                candy.parent = this.candyBoard;

                // set candy position
                candy.setPosition(x,y,0);
                let candyPosition = candy.position;
                // tempPosition.push(candyPosition);
                x = x + this.candyWidth + this.candygap;

                // set random candy color
                let idColor = this.randomColor();
                tempColors.push(idColor);
                candy.getComponent(Sprite).color = this.candyColors[idColor];

                // set candy node in array
                tempCandy.push(candy);

                // register touch event on individual candy and check for left, right, top, bottom move
                candy.on(Node.EventType.TOUCH_CANCEL, (event: EventTouch) => {

                    let uiLocation = event.getUILocation();
                    this.defaultWorldPos = candy.getWorldPosition();
                    this.boardDefaultWorldPos = this.candyBoard.getWorldPosition();

                    // right move
                    if(uiLocation.x > (this.defaultWorldPos.x + this.candyWidth * 0.5)){
                        console.log('right move');
                        this.swapColorsRight(candy);
                        this.moves--;
                        this.movesValue.string = this.moves.toString();
                        if(this.moves === 0){
                            setTimeout(() => {
                                this.setCurrentState(GameState.GAME_END);
                            },3000);
                        }
                        console.log(this.recordArray);
                    // left move
                    }else if(uiLocation.x < (this.defaultWorldPos.x - this.candyWidth * 0.5)){
                        console.log('left move');
                        this.swapColorsLeft(candy);
                        this.moves--;
                        this.movesValue.string = this.moves.toString();
                        if(this.moves === 0){
                            setTimeout(() => {
                                this.setCurrentState(GameState.GAME_END);
                            },3000);
                        }
                        console.log(this.recordArray);
                    // top move
                    }else if(uiLocation.y > (this.defaultWorldPos.y + this.candyWidth * 0.5) && uiLocation.y < (this.boardDefaultWorldPos.y + (this.candyWidth * 3.6))){
                        console.log('top move');
                        this.swapColorsTop(candy);
                        this.moves--;
                        this.movesValue.string = this.moves.toString();
                        if(this.moves === 0){
                            setTimeout(() => {
                                this.setCurrentState(GameState.GAME_END);
                            },3000);
                        }
                        console.log(this.recordArray);
                    // bottom move
                    }else if(uiLocation.y < (this.defaultWorldPos.y - this.candyWidth * 0.5) && uiLocation.y > (this.boardDefaultWorldPos.y - (this.candyWidth * 3.6))){
                        console.log('bottom move');
                        this.swapColorsBottom(candy);
                        this.moves--;
                        this.movesValue.string = this.moves.toString();
                        if(this.moves === 0){
                            setTimeout(() => {
                                this.setCurrentState(GameState.GAME_END);
                            },3000);
                        }
                        console.log(this.recordArray);
                    }
                }, this);
            }
            x = -270;
            y = y - this.candyWidth - this.candygap;
            this.recordArray.push(tempColors);
            // this.recordPositionArray.push(tempPosition);
            this.recordCandyArray.push(tempCandy);
        }
    }

    swapColorsRight(candy: Node){
        let curRow = Math.floor(candy.getSiblingIndex() / this.row);
        let curCol = Math.floor(candy.getSiblingIndex() % this.col);

        let curColorValue = this.recordArray[curRow][curCol];
        let rightColorValue = this.recordArray[curRow][curCol + 1];
        let rightCandy = this.recordCandyArray[curRow][curCol + 1];

        // check top
        if(curRow - 1 >= 0 && curRow - 2 >= 0){
            if(this.recordArray[curRow][curCol] === this.recordArray[curRow - 1][curCol + 1] && this.recordArray[curRow][curCol] === this.recordArray[curRow - 2][curCol + 1]){
                this.rightSwap = true;
            }
        }

        // check bottom
        if(curRow + 1 < this.row && curRow + 2 < this.row){
            if(this.recordArray[curRow][curCol] === this.recordArray[curRow + 1][curCol + 1] && this.recordArray[curRow][curCol] === this.recordArray[curRow + 2][curCol + 1]){
                this.rightSwap = true;
            }
        }

        // check right
        if(curCol + 2 < this.col && curCol + 3 < this.col){
            if(this.recordArray[curRow][curCol] === this.recordArray[curRow][curCol + 2] && this.recordArray[curRow][curCol] === this.recordArray[curRow][curCol + 3]){
                this.rightSwap = true;
            }
        }

        // check top bottom
        if(curRow - 1 >= 0 && curRow + 1 < this.row){
            if(this.recordArray[curRow][curCol] === this.recordArray[curRow - 1][curCol + 1] && this.recordArray[curRow][curCol] === this.recordArray[curRow + 1][curCol + 1]){
                this.rightSwap = true;
            }
        }

        if(rightCandy && this.rightSwap){
            let temp = curColorValue;
            curColorValue = rightColorValue;
            rightColorValue = temp;

            candy.getComponent(Sprite).color = this.candyColors[curColorValue];
            rightCandy.getComponent(Sprite).color = this.candyColors[rightColorValue];

            this.recordArray[curRow][curCol] = curColorValue;
            this.recordArray[curRow][curCol + 1] = rightColorValue;

            this.rightSwap = false;
        }else{
            return;
        }

        this.checkGameRules();
    }

    swapColorsLeft(candy: Node){
        let curRow = Math.floor(candy.getSiblingIndex() / this.row);
        let curCol = Math.floor(candy.getSiblingIndex() % this.col);

        let curColorValue = this.recordArray[curRow][curCol];
        let leftColorValue = this.recordArray[curRow][curCol - 1];
        let leftCandy = this.recordCandyArray[curRow][curCol - 1];

        // check top
        if(curRow - 1 >= 0 && curRow - 2 >= 0){
            if(this.recordArray[curRow][curCol] === this.recordArray[curRow - 1][curCol - 1] && this.recordArray[curRow][curCol] === this.recordArray[curRow - 2][curCol - 1]){
                this.leftSwap = true;
            }
        }

        // check bottom
        if(curRow + 1 < this.row && curRow + 2 < this.row){
            if(this.recordArray[curRow][curCol] === this.recordArray[curRow + 1][curCol - 1] && this.recordArray[curRow][curCol] === this.recordArray[curRow + 2][curCol - 1]){
                this.leftSwap = true;
            }
        }

        // check left
        if(curCol - 2 >= 0 && curCol - 3 >= 0){
            if(this.recordArray[curRow][curCol] === this.recordArray[curRow][curCol - 2] && this.recordArray[curRow][curCol] === this.recordArray[curRow][curCol - 3]){
                this.leftSwap = true;
            }
        }

        // check top bottom
        if(curRow - 1 >= 0 && curRow + 1 < this.row){
            if(this.recordArray[curRow][curCol] === this.recordArray[curRow - 1][curCol - 1] && this.recordArray[curRow][curCol] === this.recordArray[curRow + 1][curCol - 1]){
                this.leftSwap = true;
            }
        }

        if(leftCandy && this.leftSwap){
            let temp = curColorValue;
            curColorValue = leftColorValue;
            leftColorValue = temp;

            candy.getComponent(Sprite).color = this.candyColors[curColorValue];
            leftCandy.getComponent(Sprite).color = this.candyColors[leftColorValue];

            this.recordArray[curRow][curCol] = curColorValue;
            this.recordArray[curRow][curCol - 1] = leftColorValue;

            this.leftSwap = false;
        }else{
            return;
        }

        this.checkGameRules();
    }

    swapColorsTop(candy: Node){
        let curRow = Math.floor(candy.getSiblingIndex() / this.row);
        let curCol = Math.floor(candy.getSiblingIndex() % this.col);

        let curColorValue = this.recordArray[curRow][curCol];
        let topColorValue = this.recordArray[curRow - 1][curCol];
        let topCandy = this.recordCandyArray[curRow - 1][curCol];

        // check top
        if(curRow - 2 >= 0 && curRow - 3 >= 0){
            if(this.recordArray[curRow][curCol] === this.recordArray[curRow - 2][curCol] && this.recordArray[curRow][curCol] === this.recordArray[curRow - 3][curCol]){
                this.topSwap = true;
            }
        }

        // check right
        if(curCol + 1 < this.col && curCol + 2 < this.col){
            if(this.recordArray[curRow][curCol] === this.recordArray[curRow - 1][curCol + 1] && this.recordArray[curRow][curCol] === this.recordArray[curRow - 1][curCol + 2]){
                this.topSwap = true;
            }
        }

        // check left
        if(curCol - 1 >= 0 && curCol - 2 >= 0){
            if(this.recordArray[curRow][curCol] === this.recordArray[curRow - 1][curCol - 1] && this.recordArray[curRow][curCol] === this.recordArray[curRow - 1][curCol - 2]){
                this.topSwap = true;
            }
        }

        // check left right
        if(curCol - 1 >= 0 && curCol + 1 < this.col){
            if(this.recordArray[curRow][curCol] === this.recordArray[curRow - 1][curCol - 1] && this.recordArray[curRow][curCol] === this.recordArray[curRow - 1][curCol + 1]){
                this.topSwap = true;
            }
        }

        if(topCandy && this.topSwap){
            let temp = curColorValue;
            curColorValue = topColorValue;
            topColorValue = temp;

            candy.getComponent(Sprite).color = this.candyColors[curColorValue];
            topCandy.getComponent(Sprite).color = this.candyColors[topColorValue];

            this.recordArray[curRow][curCol] = curColorValue;
            this.recordArray[curRow - 1][curCol] = topColorValue;

            this.topSwap = false;
        }else{
            return;
        }

        this.checkGameRules();
    }

    swapColorsBottom(candy: Node){
        let curRow = Math.floor(candy.getSiblingIndex() / this.row);
        let curCol = Math.floor(candy.getSiblingIndex() % this.col);

        let curColorValue = this.recordArray[curRow][curCol];
        let bottomColorValue = this.recordArray[curRow + 1][curCol];
        let bottomCandy = this.recordCandyArray[curRow + 1][curCol];

        // check bottom
        if(curRow + 2 < this.row && curRow + 3 < this.row){
            if(this.recordArray[curRow][curCol] === this.recordArray[curRow + 2][curCol] && this.recordArray[curRow][curCol] === this.recordArray[curRow + 3][curCol]){
                this.bottomSwap = true;
            }
        }

        // check left
        if(curCol - 1 >= 0 && curCol - 2 >= 0){
            if(this.recordArray[curRow][curCol] === this.recordArray[curRow + 1][curCol - 1] && this.recordArray[curRow][curCol] === this.recordArray[curRow + 1][curCol - 2]){
                this.bottomSwap = true;
            }
        }

        // check right
        if(curCol + 1 < this.col && curCol + 2 < this.col){
            if(this.recordArray[curRow][curCol] === this.recordArray[curRow + 1][curCol + 1] && this.recordArray[curRow][curCol] === this.recordArray[curRow + 1][curCol + 2]){
                this.bottomSwap = true;
            }
        }

        // check left right
        if(curCol - 1 >= 0 && curCol + 1 < this.col){
            if(this.recordArray[curRow][curCol] === this.recordArray[curRow + 1][curCol - 1] && this.recordArray[curRow][curCol] === this.recordArray[curRow + 1][curCol + 1]){
                this.bottomSwap = true;
            }
        }

        if(bottomCandy && this.bottomSwap){
            let temp = curColorValue;
            curColorValue = bottomColorValue;
            bottomColorValue = temp;

            candy.getComponent(Sprite).color = this.candyColors[curColorValue];
            bottomCandy.getComponent(Sprite).color = this.candyColors[bottomColorValue];

            this.recordArray[curRow][curCol] = curColorValue;
            this.recordArray[curRow + 1][curCol] = bottomColorValue;

            this.bottomSwap = false;
        }else{
            return;
        }

        this.checkGameRules();
    }

    checkGameRules(){
        // check rows
        this.checkRows();

        // check columns
        this.checkCols();
    }

    checkRows(){
        let i=0;
        let j=0;
        let rowValue = -1;
        let temp = [];
        while(i < this.row){
            rowValue = this.recordArray[i][j];
            while(j < this.col - 2){
                if(rowValue === this.recordArray[i][j+1] && rowValue === this.recordArray[i][j+2]){

                    const startIndex = j;

                    j += 3;

                    while(j < this.col && rowValue === this.recordArray[i][j]){
                        j++;
                    }

                    for(let y=startIndex; y < j; y++){
                        tween(this.recordCandyArray[i][y])
                          .to(this.tweenDuration, {
                            scale: new Vec3(0.5, 0.5, 1)
                          })
                          .to(this.tweenDuration, {
                            scale: new Vec3(1, 1, 1)
                          })
                          .start();
                    }

                    this.gameScore += j - startIndex;
                    this.gameScoreValue.string = this.gameScore.toString();
                    if(this.gameHighScore < this.gameScore){
                        this.gameHighScore = this.gameScore;
                        this.gameHighScoreValue.string = this.gameHighScore.toString();
                    }

                    let objectBlank = {
                        i,
                        j,
                        startIndex
                    }

                    let object = {
                        temp,
                        i,
                        j : startIndex,
                        rowValue
                    }
                    
                    setTimeout(() => {
                        eventTarget.emit('blankRowCandy', objectBlank);
                    },2000);

                    setTimeout(() => {
                        eventTarget.emit('BurstRowCandy', object);
                    },2500);
                    
                    return;

                }else if(rowValue === this.recordArray[i][j+1] && rowValue !== this.recordArray[i][j+2]){
                    rowValue = this.recordArray[i][j+2];
                    j += 2;
                }else{
                    rowValue = this.recordArray[i][j+1];
                    j++;
                }
            }
            i++;
            j=0;
        }
    }

    checkCols(){
        let i=0;
        let j=0;
        let colValue = -1;
        let temp = [];
        while(j < this.col){
            colValue = this.recordArray[i][j];
            while(i < this.row - 2){
                if(colValue === this.recordArray[i+1][j] && colValue === this.recordArray[i+2][j]){

                    let startIndex = i;

                    for(let k=0; k < i; k++){
                        temp.push(this.recordArray[k][j]);
                    }

                    i += 3;

                    while(i < this.row && colValue === this.recordArray[i][j]){
                        i++;
                    }

                    for(let g=startIndex; g < i; g++){
                        tween(this.recordCandyArray[g][j])
                          .to(this.tweenDuration, {
                            scale: new Vec3(0.5, 0.5, 1)
                          })
                          .to(this.tweenDuration, {
                            scale: new Vec3(1, 1, 1)
                          })
                          .start();
                    }
 
                    this.gameScore += i - startIndex;
                    this.gameScoreValue.string = this.gameScore.toString();
                    if(this.gameHighScore < this.gameScore){
                        this.gameHighScore = this.gameScore;
                        this.gameHighScoreValue.string = this.gameHighScore.toString();
                    }

                    let object = {
                        temp,
                        i,
                        j,
                        startIndex
                    }
                    
                    setTimeout(() => {
                        eventTarget.emit('blankColumnCandy', object);
                    },2000);

                    setTimeout(() => {
                        eventTarget.emit('BurstColumnCandy', object);
                    },2500);

                    return;

                }else if(colValue === this.recordArray[i+1][j] && colValue !== this.recordArray[i+2][j]){
                    colValue = this.recordArray[i+2][j];
                    i += 2;
                }else{
                    colValue = this.recordArray[i+1][j];
                    i++;
                }
            }
            i=0;
            j++;
        }
    }

    onBurstRowCandy({temp, i, j, rowValue}){
        while(j < this.col && rowValue === this.recordArray[i][j]){

            for(let k=0; k<i; k++){
                temp.push(this.recordArray[k][j]);
            }

            for(let index=i; index >= 0; index--){
                if(temp.length === 0){
                    let colorsID = this.randomColor();
                    this.recordArray[index][j] = colorsID;
                    this.recordCandyArray[index][j].getComponent(Sprite).color = this.candyColors[colorsID];
                }else{
                    let element = temp.pop();
                    this.recordArray[index][j] = element;
                    this.recordCandyArray[index][j].getComponent(Sprite).color = this.candyColors[element];
                }
            }

            j++;
        }

        this.checkRows();
    }

    onBlankRowCandy({i, j, startIndex}){
        for(let y=startIndex; y < j; y++){
            this.recordCandyArray[i][y].getComponent(Sprite).color = this.candyBoard.getComponent(Sprite).color;
        }
    }

    onBurstColumnCandy({temp, i, j}){

        for(let index=i-1; index >= 0; index--){
            if(temp.length === 0){
                let colorsID = this.randomColor();
                this.recordArray[index][j] = colorsID;
                this.recordCandyArray[index][j].getComponent(Sprite).color = this.candyColors[colorsID];
            }else{
                let element = temp.pop();
                this.recordArray[index][j] = element;
                this.recordCandyArray[index][j].getComponent(Sprite).color = this.candyColors[element];
            }
        }

        this.checkCols();
    }

    onBlankColumnCandy({startIndex, i, j}){
        for(let f=startIndex; f < i; f++){
            this.recordCandyArray[f][j].getComponent(Sprite).color = this.candyBoard.getComponent(Sprite).color;
        }
    }

    randomColor(){
        return Math.floor(Math.random() * this.candyColors.length);  // 0 - 6
    }
}