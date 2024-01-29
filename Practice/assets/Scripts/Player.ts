import { _decorator, Component, Node, EventTarget, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

const eventTarget = new EventTarget();

@ccclass('Player')
export class Player extends Component {
    @property({
        type: Node
    })
    public playerNode: Player;

    onLoad(){
        this.registerEvents();
    }

    registerEvents(){
        eventTarget.on('Player_Jump', this.onPlayerJump, this);
    }

    onPlayerJump(){
        // const targetScale = new Vec3(2, 2, 1);
        tween(this.node)
        .to(1, {position: new Vec3(0, 252, 0)})
        .to(1, {position: new Vec3(0, 0, 0)})
        .start();
    }

    onClickedPlayer(){
        eventTarget.emit('Player_Jump');
    }

    // tween()
    // .target(this.node)
    // .to(1.0, { position: new Vec3(0, 10, 0) })
    // .by(1.0, { position: new Vec3(0, -10, 0) })
    // .delay(1.0)
    // .by(1.0, { position: new Vec3(0, -10, 0) })
    // .start()
}


