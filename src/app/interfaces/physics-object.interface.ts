import * as p5 from "p5";

export interface IPhysicsObject {
  index: number;
  position: p5.Vector;
  lastPosition: p5.Vector;
  acceleration: p5.Vector;
  color: p5.Color;

  radius: number;

  applyGravity(grav: number): void;
  update(s: p5, dt: number): void;
  constrain(center: p5.Vector, r: number): void;
  collide(s: p5, obj: IPhysicsObject): void;
  draw(s: p5): void;
}

export class PhysicsObject implements IPhysicsObject {
  index: number;
  position: p5.Vector;
  lastPosition: p5.Vector;
  acceleration: p5.Vector;
  color: p5.Color;

  radius: number;

  private VELOCITY_DAMPENING: number = .750;

  static defaultRadius = 5;
  static collisionGrid: Array<Array<IPhysicsObject>>;
  static collisionGridSquareSize: number;
  static collisionGridHeight: number;
  static collisionGridWidth: number;

  static uniqueId = 0;

  constructor(s: p5, position: p5.Vector, lastPosition: p5.Vector, radius: number, color: p5.Color) {
    this.index = PhysicsObject.uniqueId++;
    this.position = position;
    this.lastPosition = lastPosition;
    this.acceleration = s.createVector(0, 0);
    this.radius = radius || PhysicsObject.defaultRadius;
    this.color = color;
  }

  update(s: p5, dt: number) {
    let displacement = p5.Vector.sub(this.position, this.lastPosition);
    
    this.acceleration.mult(dt * dt);

    let newPosition = p5.Vector.add(this.position, displacement).add(this.acceleration);

    this.lastPosition = this.position.copy();
    this.position = newPosition;
    this.acceleration.set(0, 0);
  }

  stop() {
    this.lastPosition = this.position.copy();
  }

  slowDown(ratio: number) {
    this.lastPosition = this.lastPosition.add(this.position.sub(this.lastPosition).mult(ratio));
  }

  draw(s: p5) {
    s.noStroke();
    s.fill(this.color);

    s.circle(this.position.x, this.position.y, this.radius*2);
  }

  applyGravity(grav: number) {
    this.acceleration.add(0, grav);
  }

  constrain(center: p5.Vector, r: number) {
    let v = p5.Vector.sub(center, this.position);
    let dist = v.mag();
    if (dist > r - this.radius) {
      v.div(dist);
      v.mult(r - this.radius);
      this.position = p5.Vector.sub(center, v);
    }
  }

  collide(s: p5, obj: IPhysicsObject) {
    const respCoef = 0.75;

    let v = p5.Vector.sub(this.position, obj.position);
    let dist2 = v.magSq();
    let minDist = this.radius + obj.radius;

    if (dist2 < minDist * minDist) {
      let dist = Math.sqrt(dist2);
      v.div(dist);
      let mr1 = this.radius / (this.radius + obj.radius);
      let mr2 = obj.radius / (this.radius + obj.radius);
      let delta = 0.5 * respCoef * (dist - minDist);

      let obj1Offset = v.copy();
      obj1Offset.mult(mr2 * delta);
      let obj2Offset = v.copy();
      obj2Offset.mult(mr1 * delta);

      this.position.sub(obj1Offset);
      obj.position.add(obj2Offset);
    }
  }

  static setupCollisionGrid(objs: IPhysicsObject[], fieldWidth: number, fieldHeight: number) {
    PhysicsObject.collisionGrid = new Array<Array<IPhysicsObject>>();
    PhysicsObject.collisionGridSquareSize = PhysicsObject.defaultRadius*2;
    PhysicsObject.collisionGridHeight = Math.ceil(fieldHeight / PhysicsObject.collisionGridSquareSize);
    PhysicsObject.collisionGridWidth = Math.ceil(fieldWidth / PhysicsObject.collisionGridSquareSize);

    for (const obj of objs) {
      let posX = Math.floor((obj.position.x + (fieldWidth / 2)) / PhysicsObject.collisionGridSquareSize),
          posY = Math.floor((obj.position.y + (fieldHeight / 2)) / PhysicsObject.collisionGridSquareSize);

      if (PhysicsObject.collisionGrid[(posY * PhysicsObject.collisionGridWidth) + posX] === undefined) {
        PhysicsObject.collisionGrid[(posY * PhysicsObject.collisionGridWidth) + posX] = new Array<IPhysicsObject>();
      }

      PhysicsObject.collisionGrid[(posY * PhysicsObject.collisionGridWidth) + posX].push(obj);
    }
  }
}