import * as p5 from "p5";

export class Display {
  h: number;
  w: number;
  renderer: p5.Renderer;
  camera: p5.Camera;

  constructor(s: p5, w: number, h: number) {
    this.w = w;
    this.h = h;
    this.renderer = s.createCanvas(this.w, this.h, s.WEBGL);
    this.camera = s.createCamera();
  }
}