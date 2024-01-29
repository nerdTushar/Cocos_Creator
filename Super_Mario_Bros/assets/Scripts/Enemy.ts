import { _decorator, Collider2D, Component, Contact2DType, IPhysics2DContact } from 'cc';
const { ccclass, property } = _decorator;

let colliders;

@ccclass('Enemy')
export class Enemy extends Component {

    public isMarioEnemyTopContact: boolean = false;
    public isFindAnyCollider: boolean = false;
    public goombaSpeed: number = 60;
    public moveDirection: number = -1;

    onLoad(){
        this.onRegisterEvents();
    }

    onRegisterEvents(){
        colliders = this.node.getComponents(Collider2D);
        for(let collider of colliders){
          collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null){
        if(otherCollider.tag === 200 || otherCollider.tag === 2){
          this.isFindAnyCollider = false;
          this.moveDirection = this.moveDirection * -1;
        }
    }

    update(dt: number){
      if(!this.isFindAnyCollider){
        this.node.setPosition(this.node.getPosition().x + this.goombaSpeed * dt * this.moveDirection,this.node.getPosition().y);
      }
    }
}


