import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import { GameManager } from './GameManager';
import { ItemColorBox } from './ItemColorBox';

@ccclass('GameGlobal')
export class GameGlobal {
    // region var global
    static maxBox: number = 56;
    static colomX: number = 8;
    static colomY: number = 7;
    static listParentColorBox: Node[] = [];
    static listColorBox: Node[] = [];
    static listScriptColorBox: ItemColorBox[] = [];

    static listFirstRow: any;
    static listColumnLimit: number[] = [];
    static listRowLimit: number[] = [];
    static listAllRow: any[] = [];
    static listAllColumn: any[] = [];

    static widthBox = 85;
    static heightBox = 85;

    static hightScoreBox = 0;
    static scoreBox = 0;
    static timerBox = 0;

    static gameStop: boolean = false;
    // end region var global

    // region scriptGlobal
    static srcManager: GameManager = null!;
    // end region
}