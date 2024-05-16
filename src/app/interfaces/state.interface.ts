import * as p5 from "p5";
import { Display } from "./display.interface";
import { PhysicsObject } from "./physics-object.interface";

export class State {
  display: Display;
  objs: PhysicsObject[] = [];

  preload(s: p5) {

  }

  setup(s: p5) {
    this.display = new Display(s, document.documentElement.clientWidth, document.documentElement.clientHeight);

    for (let i = 1; i < 21; ++i) {
      let startPos = s.createVector(-200 + (30*i), 0);
      this.objs.push(new PhysicsObject(s, startPos.copy(), startPos.copy(), 0, s.color(255)));
    }
  }

  update(s: p5) {
    const w = document.documentElement.clientWidth;
    const h = document.documentElement.clientHeight
    const left = -(w / 2);
    const top = -(h / 2);

    if (s.mouseIsPressed) {
      let startPos = s.createVector(s.mouseX + left, s.mouseY + top);
      this.objs.push(new PhysicsObject(s, startPos.copy(), startPos.copy(), 0, s.color(255)));
    }

    let deltaTime = Math.min(s.deltaTime, 16.666);
    let stepSize = 4;
    for (let i = 0; i < stepSize; ++i) {
      this.updatePhysicsObjects(s, deltaTime / stepSize);
    }
  }

  updatePhysicsObjects(s: p5, dt: number) {
    let cy = 0;
    let cx = 0;
    let cr = (this.display.h / 2) - 50;

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

  draw(s: p5) {
    this.objs.forEach(obj => obj.draw(s));
  }
}