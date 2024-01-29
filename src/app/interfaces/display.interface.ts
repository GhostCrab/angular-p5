import * as p5 from "p5";

export interface IDisplay {
  h: number;
  w: number;
  renderer?: p5.Renderer;
}

export class Display implements IDisplay {
  h: number;
  w: number;
  renderer: p5.Renderer;

  constructor(s: p5, w: number, h: number) {
    this.w = w;
    this.h = h;
    this.renderer = s.createCanvas(this.w, this.h);
  }
}