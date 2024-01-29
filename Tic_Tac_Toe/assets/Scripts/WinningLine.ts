import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('WinningLine')
export class WinningLine extends Component {
    @property({type: Node})
    public winLine: Node[] = [];
}


