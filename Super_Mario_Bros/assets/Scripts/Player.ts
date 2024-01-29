import { _decorator, Animation, Component, SpriteFrame, EventKeyboard, Input, input, KeyCode, RigidBody2D, Sprite, Vec2, Collider2D, Contact2DType, IPhysics2DContact, tween, Vec3, BoxCollider2D, Label, CCInteger, UITransform } from 'cc';

import { Enemy } from './Enemy';
import { MysteryBox } from './MysteryBox';
const { ccclass, property } = _decorator;

let clipToPlay;

enum PlayerState {
    Alive,
    Dead
}

@ccclass('Player')
export class Player extends Component {

    public rigidBody: RigidBody2D = null;
    public moveDirection = 0;
    public jumpForce: number = 2300;
    public walkForce: number = 6;
    public playerDead: boolean = false;
    public timeOver: boolean = false;

    public marioSmallRightAnim: Animation;
    public marioBigRightAnim: Animation;

    public collider: Collider2D;

    @property({
        type: SpriteFrame
    })
    public smallmarioidle: SpriteFrame;

    @property({
        type: SpriteFrame
    })
    public bigmarioidle: SpriteFrame;

    @property({
        type: Enemy
    })
    public enemy: Enemy;

    @property({
        type: SpriteFrame
      })
    public playerDeath: SpriteFrame;

    public isJumpChance: boolean = true;
    public leftAnim: boolean = false;
    public rightAnim: boolean = false;
    public isMarioGrounded:boolean = true;
    public isMarioEnemyContact:boolean = false;
    public playerHealth: number = 1;
    public marioPoleContact: boolean = false;

    @property({
        type: Label
    })
    public scoreValue: Label;

    @property({
        type: Label
    })
    public coinsValue: Label;

    @property({
        type: Label
    })
    public timeValue: Label;

    @property({
        type: Sprite
    })
    public gameOverSprite: Sprite;

    public time: number = 0;
    public score: number = 0;
    public coins: number = 0;
    public gamesOver: boolean = false;
    public playerCurrentState = PlayerState.Alive;

    onLoad() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyPressed, this);
        input.on(Input.EventType.KEY_UP, this.onKeyReleased, this);
        this.rigidBody = this.node.getComponent(RigidBody2D);
        this.rigidBody.linearDamping = 0.1;

        this.marioSmallRightAnim = this.node.getChildByName("Small").getComponent(Animation);
        this.marioBigRightAnim = this.node.getChildByName("Big").getComponent(Animation);

        this.onRegisterEvents();
    }

    onRegisterEvents(){
        this.collider = this.node.getComponent(Collider2D);
        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onMarioBeginContact, this);
        this.collider.on(Contact2DType.END_CONTACT, this.onMarioEndContact, this);
    }

    onMarioBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null){
        
        // mario contacts with ground
        if(otherCollider.tag === 500){
            this.isMarioGrounded = true;
        // mario contacts with pipe bottom
        }else if(otherCollider.tag === 200){
            this.isMarioGrounded = true;
        // mario contacts with goomba top
        }else if(otherCollider.tag === 1){
            this.score += 100;
            this.scoreValue.string = this.score.toString();
            this.enemy.isFindAnyCollider = true;
            otherCollider.node.setScale(1,0.5);
            selfCollider.node.getComponent(RigidBody2D).applyForceToCenter(new Vec2(0, 3000), true);
            setTimeout(() => {
             otherCollider.node.setScale(0,0);
            },300);
        // small mario contacts with goomba bottom
        }else if(otherCollider.tag === 2 && this.playerHealth === 1){
            this.enemy.isFindAnyCollider = true;
            this.isMarioEnemyContact = true;
            this.node.getChildByName("Small").getComponent(Animation).stop();
            this.node.getChildByName('Small').getComponent(Sprite).spriteFrame = this.playerDeath;
            tween(this.node)
              .to(0.3, {
                position: new Vec3(this.node.getPosition().x, this.node.getPosition().y + 100)
              })
              .start();
            this.node.getComponent(BoxCollider2D).group = 3;
            this.node.getComponent(RigidBody2D).gravityScale = 10;
            this.gameOver();
        // big mario contacts with goomba bottom
        }else if(otherCollider.tag === 2 && this.playerHealth === 2){
            this.enemy.isFindAnyCollider = true;
            this.node.getComponent(BoxCollider2D).size.y = 50;
            this.node.getComponent(BoxCollider2D).offset.y = 0;
            this.playerHealth = 1;
            tween(this.node.getChildByName('Big'))
              .to(0.8, {
                scale: new Vec3(this.node.getChildByName('Big').getScale().x, 1)
              })
              .start();
            setTimeout(() => {
              this.node.getChildByName('Big').active = false;
              this.node.getChildByName('Small').active = true;
            },1000);
            this.node.getChildByName("Small").getComponent(Animation).stop();
        // small mario contacts with mushroom
        }else if(otherCollider.tag === 400 && !Number(otherCollider.node.getComponentInChildren(UITransform).node.name)){
            otherCollider.node.getComponentInChildren(UITransform).node.name = '1';
            this.score += 100;
            this.scoreValue.string = this.score.toString();
            this.playerHealth = 2;
            this.node.getChildByName('Small').active = false;
            this.node.getChildByName('Big').active = true;
            this.node.getComponent(BoxCollider2D).size.y = 100;
            this.node.getComponent(BoxCollider2D).offset.y = 25;
            tween(this.node.getChildByName('Big'))
                .to(1.2, {
                scale: new Vec3(this.node.getChildByName('Big').getScale().x, 2)
                })
                .start();
                
            tween(otherCollider.node)
                .to(0.8, {
                position: new Vec3(otherCollider.node.getPosition().x, otherCollider.node.getPosition().y - 50)
                })
                .start();
        // small mario contacts with mystery box
        }else if(otherCollider.tag === 600 && this.playerHealth === 1){
          if(otherCollider.node.getParent().name === 'MysteryBlockCoin'){
            this.coins += 1;
            this.coinsValue.string = this.coins.toString();
            if(this.coins % 5 === 0){
                this.score += 100;
                this.scoreValue.string = this.score.toString();
            }
            tween(otherCollider.node.getParent().getChildByName('Coin'))
              .to(0.7, {
                position: new Vec3(otherCollider.node.getParent().getChildByName('Coin').getPosition().x, otherCollider.node.getParent().getChildByName('Coin').getPosition().y + 150)
              })
              .start();
              setTimeout(() => {
                otherCollider.node.getParent().getChildByName('Coin').active = false;
              },700);
          }else if(otherCollider.node.getParent().name === 'MysteryBlockMushroom'){
            tween(otherCollider.node.getParent().getChildByName('MagicMushroom'))
              .to(1.2, {
                position: new Vec3(otherCollider.node.getParent().getChildByName('MagicMushroom').getPosition().x, otherCollider.node.getParent().getChildByName('MagicMushroom').getPosition().y + 50)
              })
              .start();
          }
          otherCollider.node.getParent().getChildByName('EmptyBlock').active = true;
          otherCollider.node.getParent().name = 'Tushar';
        // big mario contacts with mystery box
        }else if(otherCollider.tag === 600 && this.playerHealth === 2){
            if(otherCollider.node.getParent().name === 'MysteryBlockCoin' || otherCollider.node.getParent().name === 'MysteryBlockMushroom'){
                this.coins += 1;
                this.coinsValue.string = this.coins.toString();
                if(this.coins % 5 === 0){
                    this.score += 100;
                    this.scoreValue.string = this.score.toString();
                }
                tween(otherCollider.node.getParent().getChildByName('Coin'))
                  .to(0.7, {
                    position: new Vec3(otherCollider.node.getParent().getChildByName('Coin').getPosition().x, otherCollider.node.getParent().getChildByName('Coin').getPosition().y + 150)
                  })
                  .start();
                  setTimeout(() => {
                    otherCollider.node.getParent().getChildByName('Coin').active = false;
                  },700);
              }
            otherCollider.node.getParent().getChildByName('EmptyBlock').active = true;
            otherCollider.node.getParent().name = 'Tushar';
        // mario contacts with flag pole
        }else if(otherCollider.tag === 700){
            this.marioPoleContact = true;
            tween(otherCollider.node.getParent().getChildByName('Flag'))
              .to(1.2, {
                position: new Vec3(otherCollider.node.getParent().getChildByName('Flag').getPosition().x, otherCollider.node.getParent().getChildByName('Flag').getPosition().y - 380)
              })
              .start();
            
            tween(this.node)
              .to(0, {
                position: new Vec3(this.node.getPosition().x + 100, this.node.getPosition().y)
              })
              .start();

              if(this.playerHealth === 1){
                clipToPlay = this.marioSmallRightAnim.clips[0];
                this.marioSmallRightAnim.play(clipToPlay.name);
              }else{
                clipToPlay = this.marioBigRightAnim.clips[0];
                this.marioBigRightAnim.play(clipToPlay.name);
              }

              setTimeout(() => {
                tween(this.node)
                  .to(0.8, {
                    position: new Vec3(this.node.getPosition().x + 225, this.node.getPosition().y)
                  })
                  .start();
              },500);

              setTimeout(() => {
                  this.node.active = false;
                  this.gameOver();
              },1500);
        }
    }

    onMarioEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null){
        if(otherCollider.tag === 200)
          this.isMarioGrounded = true;
        else
          this.isMarioGrounded = false;
    }

    onKeyPressed(event: EventKeyboard) {
        if(this.playerCurrentState == PlayerState.Dead) return;
        switch (event.keyCode) {
            case KeyCode.ARROW_RIGHT:
                this.rightAnim = true;
                if(!this.isMarioEnemyContact && !this.marioPoleContact){
                    this.moveDirection = 1;
                    if(this.node.getScale().x < 0){
                        this.node.setScale(-1 * this.node.scale.x, this.node.scale.y);
                    }
                    if(this.isMarioGrounded){
                        if(this.playerHealth === 1){
                            clipToPlay = this.marioSmallRightAnim.clips[0];
                            this.marioSmallRightAnim.play(clipToPlay.name);
                        }else{
                            clipToPlay = this.marioBigRightAnim.clips[0];
                            this.marioBigRightAnim.play(clipToPlay.name);
                        }
                    }
                }
                break;
            case KeyCode.ARROW_LEFT:
                this.leftAnim = true;
                if(!this.isMarioEnemyContact && !this.marioPoleContact){
                    this.moveDirection = -1;
                    if(this.node.getScale().x > 0){
                        this.node.setScale(-1 * this.node.scale.x, this.node.scale.y);
                    }
                    if(this.isMarioGrounded){
                        if(this.playerHealth === 1){
                            clipToPlay = this.marioSmallRightAnim.clips[0];
                            this.marioSmallRightAnim.play(clipToPlay.name);
                        }else{
                            clipToPlay = this.marioBigRightAnim.clips[0];
                            this.marioBigRightAnim.play(clipToPlay.name);
                        }
                    }
                }
                break;
            case KeyCode.ARROW_UP:
                if(this.isMarioGrounded){
                    this.isJumpChance = true;
                }
                if(!this.isMarioEnemyContact && this.isJumpChance && !this.marioPoleContact){
                    this.isJumpChance = false;
                    this.rigidBody.applyForceToCenter(new Vec2(0, this.jumpForce), true);
                    if(this.playerHealth === 1){
                        clipToPlay = this.marioSmallRightAnim.clips[1];
                        this.marioSmallRightAnim.play(clipToPlay.name);
                    }else{
                        clipToPlay = this.marioBigRightAnim.clips[1];
                        this.marioBigRightAnim.play(clipToPlay.name);
                    }
                }
                setTimeout(() => {
                    if(this.rightAnim){
                        if(this.playerHealth === 1){
                            clipToPlay = this.marioSmallRightAnim.clips[0];
                            this.marioSmallRightAnim.play(clipToPlay.name);
                        }else{
                            clipToPlay = this.marioBigRightAnim.clips[0];
                            this.marioBigRightAnim.play(clipToPlay.name);
                        }
                    }
                },500);
                setTimeout(() => {
                    if(this.leftAnim){
                        if(this.playerHealth === 1){
                            clipToPlay = this.marioSmallRightAnim.clips[0];
                            this.marioSmallRightAnim.play(clipToPlay.name);
                        }else{
                            clipToPlay = this.marioBigRightAnim.clips[0];
                            this.marioBigRightAnim.play(clipToPlay.name);
                        }
                    }
                },500);
                break;
        }
    }

    onKeyReleased(event: EventKeyboard) {
        if(this.playerCurrentState == PlayerState.Dead) return;
        switch (event.keyCode) {
            case KeyCode.ARROW_RIGHT:
                this.rightAnim = false;
                this.moveDirection = 0;
                if(!this.marioPoleContact){
                    if(this.playerHealth === 1){
                        this.marioSmallRightAnim.stop();
                        this.node.getChildByName("Small").getComponent(Sprite).spriteFrame = this.smallmarioidle;
                    }else{
                        this.marioBigRightAnim.stop();
                        this.node.getChildByName("Big").getComponent(Sprite).spriteFrame = this.bigmarioidle;
                    }
                    if(this.node.getScale().x < 0){
                        this.node.setScale(-1 * this.node.scale.x, this.node.scale.y);
                    }
                }
                break;
            case KeyCode.ARROW_LEFT:
                this.leftAnim = false;
                this.moveDirection = 0;
                if(!this.isMarioEnemyContact && !this.marioPoleContact){
                    if(this.playerHealth === 1){
                        this.marioSmallRightAnim.stop();
                        this.node.getChildByName("Small").getComponent(Sprite).spriteFrame = this.smallmarioidle;
                    }else{
                        this.marioBigRightAnim.stop();
                        this.node.getChildByName("Big").getComponent(Sprite).spriteFrame = this.bigmarioidle;
                    }
                    if(this.node.getScale().x > 0){
                        this.node.setScale(-1 * this.node.scale.x, this.node.scale.y);
                    }
                }
                break;
            case KeyCode.ARROW_UP:
                if(this.isMarioGrounded){
                    this.isJumpChance = true;
                }
                break;
        } 
    }

    onRetry(){
        window.location.reload();
    }

    gameOver(){
        this.enemy.isFindAnyCollider = true;
        this.isMarioEnemyContact = true;
        this.node.getChildByName("Small").getComponent(Animation).stop();
        this.node.getChildByName('Small').getComponent(Sprite).spriteFrame = this.playerDeath;
        tween(this.node)
            .to(0.3, {
            position: new Vec3(this.node.getPosition().x, this.node.getPosition().y + 100)
            })
            .start();
        this.node.getComponent(BoxCollider2D).group = 3;
        this.node.getComponent(RigidBody2D).gravityScale = 10;
        this.gamesOver = true;
        this.playerCurrentState = PlayerState.Dead;
        this.gameOverSprite.node.active = true;
        this.gameOverSprite.node.getChildByName('GOScoreValue').getComponent(Label).string = this.score.toString();
    }

    update(dt: number) {
        if (!this.isMarioEnemyContact && !this.marioPoleContact && (this.moveDirection < 0 || this.moveDirection > 0)) {
            // this.rigidBody.applyForceToCenter(new Vec2(this.moveDirection * this.walkForce, 0), true);
            this.rigidBody.linearVelocity = new Vec2(this.moveDirection * this.walkForce, this.rigidBody.linearVelocity.y);
        }else{
            const retardationForce = 1;
            const oppositeForce = -Math.sign(this.rigidBody.linearVelocity.x) * retardationForce;
            this.rigidBody.linearVelocity = new Vec2(oppositeForce, this.rigidBody.linearVelocity.y);
        }

        if(!this.gamesOver){
            this.time += 2.0 * dt;
            this.timeValue.string = Math.ceil(this.time).toString();
        }

        // mario jumps on well
        if(this.node.getPosition().y <= -360 && !this.playerDead){
            this.playerDead = true;
            this.gameOver();
        }

        // time over
        if(Math.ceil(this.time) === 300 && !this.timeOver){
            this.timeOver = true;
            this.gameOver();
        }
    }
}