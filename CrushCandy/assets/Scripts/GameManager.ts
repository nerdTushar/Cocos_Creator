import { _decorator, Color, Component, instantiate, Node, Sprite, math, Label, CCInteger } from 'cc';
import { GameGlobal } from './GameGlobal';
import { ItemColorBox } from './ItemColorBox';
import { GameRules } from './GameRules';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Color) colorBox: Color[] = [];          // Color colorBox[]; -> array of colors(8)
    @property(Color) colorDefault: Color = null!;     // Color colorDefault; -> transparent color
                                                      // ! -> non-null assertion operator
    @property(Node) panelButtonPlay: Node = null!;    // Node panelButtonPlay; -> BgButton, ButtonPlay, ButtonReload, TitleHiScore, TitleCurrentScore, DragBox
    @property(Node) panelBox: Node = null!;           // Node panelBox; -> BgMatch - board

    @property(Node) nodeButtonPlay: Node = null!;     // Node nodeButtonPlay; -> ButtonPlay
    @property(Node) nodeButtonReload: Node = null!;   // Node nodeButtonReload; -> ButtonReload
    @property(Node) nodeLabelHi: Node = null!;        // Node nodeLabelHi; -> TitleHiScore
    @property(Node) nodeLabelCurrentScore: Node = null!;  // Node nodeLabelCurrentScore; -> TitleCurrentScore

    @property(Node) prefabBox: Node = null!;         // Node prefabBox; -> BoxColor
    @property(Node) prefabParentBox: Node = null!;   // Node prefabParentBox -> BoxParent

    @property(Node) dragBox: Node = null!;           // Node dragBox; -> DragBox
    @property(Sprite) spriteBox: Sprite = null!;     // Sprite spriteBox; -> DragBox

    @property(Label) labelValueScore: Label = null!;  // Label labelValueScore; -> ValueScore
    @property(Label) labelValueTimer: Label = null!;  // Label labelValueTimer; -> ValueTimer
    @property(Label) labelValueHiScore: Label = null!;  // Label labelValueHiScore; -> ValueHiScore
    @property(Label) labelValueCurrentScore: Label = null!;  // Label labelValueCurrentScore; -> ValueCurrentScore

    @property(CCInteger) timerNum: number;  // number timerNum;
    
    totalTime: number;  // number totalTime;

    callbackScheduleTime: any; // any callbackScheduleTime;
    callbackCheckGame: any;  // any callbackCheckGame;

    onLoad(){
        GameGlobal.srcManager = this;  // this -> object of GameManager Class i.e. {colorBox[], colorDefault etc.}
        GameGlobal.gameStop = false;
        this.totalTime = this.timerNum;
    }

    onPlayGame(){
        this.panelButtonPlay.active = false;
        this.createGridBox();
    }

    createGridBox(){
        this.panelBox.removeAllChildren();
        let arrRow = [];
        let arrColumn = [];

        GameGlobal.listFirstRow = [];
        for(let i=0; i < GameGlobal.colomX; i++){
            GameGlobal.listFirstRow.push(i);
        }

        for(let ix=0; ix < GameGlobal.maxBox; ix++){
            let parentBox: Node = instantiate(this.prefabParentBox);
            let box: Node = instantiate(this.prefabBox);
            let boxScript: ItemColorBox = parentBox.getComponent(ItemColorBox);

            parentBox!.parent = this.panelBox;
            parentBox!.name = "parentBox_" + ix.toString();
            box!.parent = parentBox;
            box!.name = "box_" + ix.toString();

            boxScript.nodeBox = box!;
            boxScript.spriteBox = box!.getComponent(Sprite)!;
            boxScript.idColor = this.randomColor();
            boxScript.spriteBox.color = this.colorBox[boxScript.idColor];
            boxScript.idBox = ix;

            boxScript.startEvent();
            boxScript.getSidePos();

            setTimeout(() => {
                boxScript.getDefaultPos();
            }, 20);

            GameGlobal.listParentColorBox.push(parentBox);
            GameGlobal.listColorBox.push(box);
            GameGlobal.listScriptColorBox.push(boxScript);

            arrRow.push(ix);
            if(ix == GameGlobal.colomX * (GameGlobal.listColumnLimit.length + 1) - 1){  // 7, 15, 23, 3, 39, 47, 55
                GameGlobal.listColumnLimit.push(ix);
                GameGlobal.listAllRow.push(arrRow);
                arrRow = [];
            }

            if(ix == GameGlobal.maxBox - (GameGlobal.colomX - GameGlobal.listRowLimit.length)){
                arrColumn = [];
                arrColumn.push(ix);
                for(let aix=1; aix < GameGlobal.colomY; aix++){
                    arrColumn.push(ix - (GameGlobal.colomX * aix));
                }

                GameGlobal.listRowLimit.push(ix);
                GameGlobal.listAllColumn.push(arrColumn);
            }
        }

        setTimeout(() => {
            this.runGameRules();
            this.countdownTimer();
        }, 20 * GameGlobal.maxBox)
    }

    randomColor(){
        return Math.floor(math.random() * this.colorBox.length);
    }

    runGameRules(){
        setInterval(() => {
            if(GameGlobal.gameStop) return;
            GameRules.checkGameRules();
        }, 100)
    }

    countdownTimer(){
        this.labelValueTimer.string = this.timerNum.toString();

        this.callbackScheduleTime = function() {
            this.timerNum--;
            this.labelValueTimer.string = this.timerNum.toString();

            if(this.timerNum == 0){
               this.unschedule(this.callbackScheduleTime);
               this.winGame();
            }
        }

        this.schedule(this.callbackScheduleTime, 1);
    }

    winGame(){
        GameGlobal.gameStop = true;
        this.panelButtonPlay.active = true;
        this.nodeButtonPlay.active = false;
        this.nodeButtonReload.active = true;
        this.nodeLabelHi.active = true;
        this.nodeLabelCurrentScore.active = true;

        this.labelValueHiScore.string = GameGlobal.hightScoreBox.toString();
        this.labelValueCurrentScore.string = GameGlobal.scoreBox.toString();

        if(GameGlobal.hightScoreBox <= GameGlobal.scoreBox){
            GameGlobal.hightScoreBox = GameGlobal.scoreBox;
        }

        this.cleanGame();
    }

    cleanGame(){
        clearInterval(this.callbackCheckGame);
        GameGlobal.scoreBox = 0;
        this.labelValueScore.string = "0";

        for(let boxScript of GameGlobal.listScriptColorBox){
            boxScript.idColor = -1;
            boxScript.spriteBox.color = GameGlobal.srcManager.colorDefault;
        }
    }

    onReloadGame(){
        GameGlobal.gameStop = false;
        this.panelButtonPlay.active = false;

        this.timerNum = this.totalTime;

        for(let boxScript of GameGlobal.listScriptColorBox){
            boxScript.idColor = GameGlobal.srcManager.randomColor();
            boxScript.spriteBox.color = GameGlobal.srcManager.colorBox[boxScript.idColor];
        }

        this.runGameRules();
        this.countdownTimer();
    }
}