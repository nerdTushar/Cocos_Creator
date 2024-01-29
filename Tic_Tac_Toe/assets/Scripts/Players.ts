import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Players')
export class Players extends Component {
    @property({
        type: Node
    })
    public players: Node[] = [];
}


