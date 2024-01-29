import { _decorator, Button, Color, Component, Label, tween, Vec3 } from 'cc';
import { eventTarget, GAME_EVENTS } from './Constants';
const { ccclass, property } = _decorator;


@ccclass('ChooseBtns')
export class ChooseBtns extends Component {

    @property({type:Label})
    btnLabel:Label;

    index:number;

    protected onLoad(): void {
        this.index = this.node.getSiblingIndex();
    }

    onUpdateLabel(input){
        this.btnLabel.node.setScale(0,0,0);
        this.btnLabel.string = input;
        tween(this.btnLabel.node)
        .to(0.2,{scale:Vec3.ONE},{easing:"bounceOut"})
        .start()
        this.node.getComponent(Button).interactable = false;
    }

    reset(){
        this.btnLabel.string = "";
        this.btnLabel.color = new Color(0,0,0);
        this.node.getComponent(Button).interactable = true;
    }

    onClickBtn(){
       eventTarget.emit(GAME_EVENTS.ON_PLAYER_MOVE,this.index);
    }

   
}


