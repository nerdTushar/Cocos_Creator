import { _decorator, Component, Node } from 'cc';
import { GameGlobal } from './GameGlobal';
const { ccclass, property } = _decorator;

@ccclass('GameRules')
export class GameRules {
    public static checkGameRules() {
        for(let i=0; i < GameGlobal.listParentColorBox.length; i++){
            if(GameGlobal.listScriptColorBox[i].idColor == -1) continue;

            let currentColor = GameGlobal.listScriptColorBox[i].idColor;
            let indexRow = GameGlobal.listColumnLimit.find(index => {return i <= index});
            let idxArrColumn = getArrColumn();

            function getArrColumn(){
                for(let el of GameGlobal.listAllColumn) {
                    if(el.includes(i)) return el.indexOf(i);
                }
            }

            let arrRowFour = (indexRow - i >= 3) ? [i, i+1, i+2, i+3] : [];
            let arrColumnFour = (idxArrColumn >= 3) ? [i, i+GameGlobal.colomX*1, i+GameGlobal.colomX*2, i+GameGlobal.colomX*3] : [];
            let arrRowThree = (indexRow - i >= 2) ? [i, i+1, i+2] : [];
            let arrColumnThree = (idxArrColumn >= 2) ? [i, i+GameGlobal.colomX*1, i+GameGlobal.colomX*2] : [];
        
            if(arrRowFour.length > 0 && arrRowFour.every(checkEvery)){
                arrRowFour.forEach(idxRow => {
                    GameGlobal.scoreBox += 2;
                    GameGlobal.srcManager.labelValueScore.string = GameGlobal.scoreBox.toString();
                    GameGlobal.listScriptColorBox[idxRow].idColor = -1;
                    GameGlobal.listScriptColorBox[idxRow].spriteBox.color = GameGlobal.srcManager.colorDefault;
                })
            }

            if(arrColumnFour.length > 0 && arrColumnFour.every(checkEvery)){
                arrColumnFour.forEach(idxRow => {
                    GameGlobal.scoreBox += 2;
                    GameGlobal.srcManager.labelValueScore.string = GameGlobal.scoreBox.toString();
                    GameGlobal.listScriptColorBox[idxRow].idColor = -1;
                    GameGlobal.listScriptColorBox[idxRow].spriteBox.color = GameGlobal.srcManager.colorDefault;
                })
            }

            if(arrRowThree.length > 0 && arrRowThree.every(checkEvery)){
                arrRowThree.forEach(idxRow => {
                    GameGlobal.scoreBox += 1;
                    GameGlobal.srcManager.labelValueScore.string = GameGlobal.scoreBox.toString();
                    GameGlobal.listScriptColorBox[idxRow].idColor = -1;
                    GameGlobal.listScriptColorBox[idxRow].spriteBox.color = GameGlobal.srcManager.colorDefault;
                })
            }

            if(arrColumnThree.length > 0 && arrColumnThree.every(checkEvery)){
                arrColumnThree.forEach(idxRow => {
                    GameGlobal.scoreBox += 1;
                    GameGlobal.srcManager.labelValueScore.string = GameGlobal.scoreBox.toString();
                    GameGlobal.listScriptColorBox[idxRow].idColor = -1;
                    GameGlobal.listScriptColorBox[idxRow].spriteBox.color = GameGlobal.srcManager.colorDefault;
                })
            }

            function checkEvery(_idx){
                if(GameGlobal.listScriptColorBox[_idx].idColor == currentColor && GameGlobal.listScriptColorBox[_idx].idColor != -1) return true;
            }
        }

        this.getBoxToMove();
    }

    public static getBoxToMove(){
        for(let i=0; i < GameGlobal.maxBox; i++){
            if(i + GameGlobal.colomX > GameGlobal.maxBox - 1) continue;
            if(GameGlobal.listScriptColorBox[i + GameGlobal.colomX]!.idColor == -1){
                GameGlobal.listScriptColorBox[i + GameGlobal.colomX]!.spriteBox.color = GameGlobal.listScriptColorBox[i].spriteBox.color;
                GameGlobal.listScriptColorBox[i + GameGlobal.colomX]!.idColor = GameGlobal.listScriptColorBox[i].idColor;
                
                let isFirstRow = GameGlobal.listFirstRow.includes(i);

                if(isFirstRow && (GameGlobal.listScriptColorBox[i].idColor == -1)){
                    GameGlobal.listScriptColorBox[i]!.idColor = GameGlobal.srcManager.randomColor();
                    GameGlobal.listScriptColorBox[i]!.spriteBox.color = GameGlobal.srcManager.colorBox[GameGlobal.listScriptColorBox[i]!.idColor];
                }
            }else if(GameGlobal.listScriptColorBox[i].idColor == -1){
                GameGlobal.listScriptColorBox[i]!.idColor = GameGlobal.srcManager.randomColor();
                GameGlobal.listScriptColorBox[i]!.spriteBox.color = GameGlobal.srcManager.colorBox[GameGlobal.listScriptColorBox[i]!.idColor];
            }
        }
    }
}


