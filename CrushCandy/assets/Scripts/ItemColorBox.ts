import { _decorator, CCInteger, Color, Component, EventTouch, Node, Sprite, Vec3 } from 'cc';
import { GameGlobal } from './GameGlobal';
const { ccclass, property } = _decorator;

@ccclass('ItemColorBox')
export class ItemColorBox extends Component {
    @property(Node)
    nodeBox: Node = null!;

    @property(Sprite)
    spriteBox: Sprite = null!;

    @property(CCInteger)
    idBox: number = -1!;
    @property(CCInteger)
    idColor: number = -1!;
    @property(CCInteger)
    leftId: number = -1!;
    @property(CCInteger)
    rightId: number = -1!;
    @property(CCInteger)
    topId: number = -1!;
    @property(CCInteger)
    bottomId: number = -1!;

    defaultPos: Vec3 = null!;
    defaultWorldPos: Vec3 = null!;

    startEvent(){
        this.nodeBox.on(Node.EventType.TOUCH_MOVE, (event: EventTouch) => {
            let loc = event.getUILocation();

            if(!GameGlobal.srcManager.dragBox.active){
                GameGlobal.srcManager.dragBox.active = true;
                GameGlobal.srcManager.spriteBox.color = this.spriteBox.color;
                this.spriteBox.color = new Color(this.spriteBox.color.r, this.spriteBox.color.g, this.spriteBox.color.b, 1);
            }

            GameGlobal.srcManager.dragBox.setWorldPosition(new Vec3(loc.x, loc.y, 0));

            // rules move
            if(loc.x > (this.defaultWorldPos.x + GameGlobal.widthBox * 0.5) && this.rightId == -1){
                console.log(loc.x, (this.defaultWorldPos.x + GameGlobal.widthBox * 0.5));
                this.setDefaultPos();
            } 
            if(loc.x < (this.defaultWorldPos.x - GameGlobal.widthBox * 0.5) && this.leftId == -1){
                console.log(loc.x, (this.defaultWorldPos.x - GameGlobal.widthBox * 0.5));
                this.setDefaultPos();
            } 
            if(loc.y > (this.defaultWorldPos.y + GameGlobal.widthBox * 0.5) && this.topId == -1){
                console.log(loc.y, (this.defaultWorldPos.y + GameGlobal.widthBox * 0.5));
                this.setDefaultPos();
            } 
            if(loc.y < (this.defaultWorldPos.y - GameGlobal.widthBox * 0.8) && this.bottomId == -1){
                console.log(loc.y, (this.defaultWorldPos.y - GameGlobal.widthBox * 0.8));
                this.setDefaultPos();
            } 
        })

        this.nodeBox.on(Node.EventType.TOUCH_END, (event: EventTouch) => {
            this.setDefaultPos();
        })

        this.nodeBox.on(Node.EventType.TOUCH_CANCEL, (event: EventTouch) => {
            let loc = event.getUILocation();
            this.setDefaultPos();

            // rules move
            if(loc.x > (this.defaultWorldPos.x + GameGlobal.widthBox * 0.5) && this.rightId == -1) return;
            if(loc.x < (this.defaultWorldPos.x - GameGlobal.widthBox * 0.5) && this.leftId == -1) return;
            if(loc.y > (this.defaultWorldPos.y + GameGlobal.widthBox * 0.5) && this.topId == -1) return;
            if(loc.y < (this.defaultWorldPos.y - GameGlobal.widthBox * 0.8) && this.bottomId == -1) return;
        
            if(loc.x >= (this.defaultWorldPos.x + GameGlobal.widthBox * 0.5) && loc.x < (this.defaultWorldPos.x + (GameGlobal.widthBox*1.5))) this.changePosRight();
            else if(loc.x < (this.defaultWorldPos.x - GameGlobal.widthBox * 0.5) && loc.x > (this.defaultWorldPos.x - (GameGlobal.widthBox*1.5))) this.changePosLeft();
            else if(loc.y > (this.defaultWorldPos.y + GameGlobal.widthBox * 0.5) && loc.y < (this.defaultWorldPos.y + (GameGlobal.widthBox*1.5))) this.changePosTop();
            else if(loc.y < (this.defaultWorldPos.x - GameGlobal.widthBox * 0.8) && loc.x > (this.defaultWorldPos.y - (GameGlobal.widthBox*1.5))) this.changePosBottom();
        })
    }

    setDefaultPos(){
        this.spriteBox.color = new Color(this.spriteBox.color.r, this.spriteBox.color.g, this.spriteBox.color.b, 255);
        GameGlobal.srcManager.dragBox.active = false;
    }

    getDefaultPos(){
        this.defaultPos = this.nodeBox.getPosition();
        this.defaultWorldPos = this.nodeBox.getWorldPosition();
    }

    changePosRight(){
        let nextIdColor = GameGlobal.listScriptColorBox[this.rightId].idColor;

        GameGlobal.listScriptColorBox[this.rightId].spriteBox.color = this.spriteBox.color;
        GameGlobal.listScriptColorBox[this.rightId].idColor = this.idColor;
        this.spriteBox.color = GameGlobal.srcManager.colorBox[nextIdColor];
        this.idColor = nextIdColor;
    }

    changePosLeft(){
        let nextIdColor = GameGlobal.listScriptColorBox[this.leftId].idColor;

        GameGlobal.listScriptColorBox[this.leftId].spriteBox.color = this.spriteBox.color;
        GameGlobal.listScriptColorBox[this.leftId].idColor = this.idColor;
        this.spriteBox.color = GameGlobal.srcManager.colorBox[nextIdColor];
        this.idColor = nextIdColor;
    }

    changePosTop(){
        let nextIdColor = GameGlobal.listScriptColorBox[this.topId].idColor;

        GameGlobal.listScriptColorBox[this.topId].spriteBox.color = this.spriteBox.color;
        GameGlobal.listScriptColorBox[this.topId].idColor = this.idColor;
        this.spriteBox.color = GameGlobal.srcManager.colorBox[nextIdColor];
        this.idColor = nextIdColor;
    }

    changePosBottom(){
        let nextIdColor = GameGlobal.listScriptColorBox[this.bottomId].idColor;

        GameGlobal.listScriptColorBox[this.bottomId].spriteBox.color = this.spriteBox.color;
        GameGlobal.listScriptColorBox[this.bottomId].idColor = this.idColor;
        this.spriteBox.color = GameGlobal.srcManager.colorBox[nextIdColor];
        this.idColor = nextIdColor;
    }

    getSidePos(){
        this.setDefaultSidePos();

        // top
        if(this.idBox >= GameGlobal.colomX) this.topId = this.idBox - GameGlobal.colomX;

        // bottom
        if(this.idBox < (GameGlobal.colomX**2)-1) this.bottomId = this.idBox + GameGlobal.colomX;

        // left
        if(this.idBox > 0){
            if(this.idBox < GameGlobal.colomX) this.leftId = this.idBox-1;
            else if(this.idBox % GameGlobal.colomX > 0) this.leftId = this.idBox-1;
        }

        // right
        if((this.idBox+1) % GameGlobal.colomX > 0) this.rightId = this.idBox + 1;
    }

    setDefaultSidePos(){
        this.leftId = -1;
        this.rightId = -1;
        this.topId = -1;
        this.bottomId = -1;
    }
}