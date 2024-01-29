import { _decorator, Component, Node, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;
import {GameCtrl} from './GameCtrl';

@ccclass('GroundScript')
export class Ground extends Component {

    @property({type: Node})
    public ground: Node[] = [];

    public groundWidth: number;

    public tempStartLocation : Vec3[] = [];
   

    public gameCtrlSpeed = new GameCtrl;
    public gameSpeed: number;

    onLoad() {
        this.startUp();
    }

    startUp(){
        this.groundWidth = this.ground[0].getComponent(UITransform).width;

        let sum: number = 0;
        for(let i=0;i<this.ground.length;i++){
            this.tempStartLocation[i] = new Vec3(sum,-447.379,0);
            this.ground[i].setPosition(this.tempStartLocation[i]);
            sum += this.groundWidth;
        }
    }

    update(deltaTime: number) {
        this.gameSpeed = this.gameCtrlSpeed.speed;

        for(let i=0;i<this.ground.length;i++){
            this.tempStartLocation[i] = this.ground[i].position;
        }

        for(let i=0;i<this.ground.length;i++){
            this.tempStartLocation[i].x -= this.gameSpeed * deltaTime;
        }


        for(let i=0;i<this.ground.length;i++){
            if(this.tempStartLocation[i].x <= -this.groundWidth){
                let loc = 0;
                if(this.ground[i-1]){
                    loc = this.ground[i-1].position.x;
                }else{
                    loc = this.ground[this.ground.length-1].position.x;
                }
                this.tempStartLocation[i].x = loc+this.ground[i].getComponent(UITransform).width;
            }
        }

        for(let i=0;i<this.ground.length;i++){
            this.ground[i].setPosition(this.tempStartLocation[i]);
        }
    }
}


