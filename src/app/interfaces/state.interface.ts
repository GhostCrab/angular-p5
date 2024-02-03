import * as p5 from "p5";
import { IDisplay } from "./display.interface";
import { IPhysicsObject, PhysicsObject } from "./physics-object.interface";

export interface IState {
  display?: IDisplay;
  objs: IPhysicsObject[];

  update(s: p5, dt: number): void;
  draw(s: p5): void;
}

export class State implements IState {
  display?: IDisplay;
  objs: IPhysicsObject[] = [];

  update(s: p5, dt: number) {
    let cy = 0;
    let cx = 0;
    let cr = this.display ? (this.display.h / 2) - 50 : 0;
    if (this.display !== undefined) {
      PhysicsObject.setupCollisionGrid(this.objs, this.display.w, this.display.h);
      
      this.objs.forEach(obj => obj.applyGravity(.001));

      for (let y = 1; y < PhysicsObject.collisionGridHeight - 1; y++) {
        for (let x = 1; x < PhysicsObject.collisionGridWidth - 1; x++) {
          for (let i = 0; i < PhysicsObject.collisionGrid[(y * PhysicsObject.collisionGridWidth) + x]?.length || 0; i++) {
            let obj1 = PhysicsObject.collisionGrid[(y * PhysicsObject.collisionGridWidth) + x][i];
            for (let offY = y - 1; offY <= y + 1; offY++) {
              for (let offX = x - 1; offX <= x + 1; offX++) {
                for (let k = 0; k  < PhysicsObject.collisionGrid[(offY * PhysicsObject.collisionGridWidth) + offX]?.length || 0; k++) {
                  let obj2 = PhysicsObject.collisionGrid[(offY * PhysicsObject.collisionGridWidth) + offX][k];

                  if (obj1.index === obj2.index) continue;
                  obj1.collide(s, obj2);
                }
              }
            }
          }
        }
      }
      
      this.objs.forEach(obj => obj.constrain(s.createVector(cx, cy), cr));
      this.objs.forEach(obj => obj.update(s, dt));
    }
  }

  draw(s: p5) {
    this.objs.forEach(obj => obj.draw(s));
  }
}