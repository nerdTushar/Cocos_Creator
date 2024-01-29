import { _decorator, Component, Node, RigidBody2D, ERigidBody2DType, BoxCollider2D } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Camera')
export class Camera extends Component {
    @property({
        type: Node
    })
    public player: Node;

    public isCameraMove: boolean = false;

    update(){
        let target_position = this.player.getPosition();
        let current_position = this.node.getPosition();

        if(target_position.x > current_position.x){
            this.isCameraMove = true;
        }else{
            this.isCameraMove = false;
        }

        if(target_position.x <= current_position.x - 615){
            this.player.setPosition(current_position.x - 615,target_position.y);
        }

        if(this.isCameraMove){
            this.node.setPosition(target_position.x,current_position.y);
        }
    }
}


