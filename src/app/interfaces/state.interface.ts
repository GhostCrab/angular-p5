import * as p5 from "p5";
import { IDisplay } from "./display.interface";
import { IPhysicsObject } from "./physics-object.interface";

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
    let cy = this.display ? this.display.h / 2 : 0;
    let cx = this.display ? this.display.w / 2 : 0;
    let cr = this.display ? (this.display.h / 2) - 50 : 0;
    if (this.display !== undefined) {
      this.objs.forEach(obj => obj.applyGravity(.001));

      for (let i = 0; i < this.objs.length; ++i) {
        for (let k = i + 1; k < this.objs.length; ++k) {
          this.objs[i].collide(s, this.objs[k]);
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