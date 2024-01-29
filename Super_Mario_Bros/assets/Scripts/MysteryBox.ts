import { _decorator, Component, DebugMode, Node, tween, v3, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MysteryBox')
export class MysteryBox extends Component {
    
    hit(){
       tween(this.node)
       .to(0.2,{position: new Vec3(this.node.getPosition().x,this.node.getPosition().y + 50)})
       .start()
       tween(this.node)
       .to(0.2,{position: new Vec3(this.node.getPosition().x,this.node.getPosition().y - 50)})
       .start()
    }
}


