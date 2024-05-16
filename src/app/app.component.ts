import { Component, OnInit } from '@angular/core';
import * as p5 from 'p5';
import { Display } from './interfaces/display.interface';
import { PerlinShader } from './interfaces/perlin-shader.interface';
import { PhysicsObject } from './interfaces/physics-object.interface';
import { State } from './interfaces/state.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular-p5';

  perlinShader: PerlinShader = new PerlinShader();

  state: State = new State();
  font: p5.Font;

  ngOnInit() {
    const sketch = (s: p5) => {
      s.preload = () => {
        this.font = s.loadFont('./assets/JetBrainsMono-Regular.ttf');
        this.state.preload(s);
        // this.perlinShader.preload(s);
      }

      s.setup = () => {
        this.state.setup(s);
        // this.perlinShader.setup(s);

        s.frameRate(120);
        s.pixelDensity(1);
        s.noSmooth();
      }

      s.draw = () => {
        s.background(30);

        const w = document.documentElement.clientWidth;
        const h = document.documentElement.clientHeight
        const left = -(w / 2);
        const top = -(h / 2);

        // this.perlinShader.draw(s);

        s.resetShader();
        s.stroke(1);
        
        if (this.font) {
          const fontSize = 14;
          s.fill(255);
          s.textFont(this.font);
          s.textSize(fontSize);
          s.text(s.getTargetFrameRate(), left, top + ((fontSize + 2) * 1));
          s.text(s.frameCount, left, top + ((fontSize + 2) * 2));
          s.text(s.deltaTime.toFixed(2), left, top + ((fontSize + 2) * 3));
          s.text(((1 / s.deltaTime) * 1000).toFixed(2), left, top + ((fontSize + 2) * 4));
          s.text(this.state.objs.length, left, top + ((fontSize + 2) * 5));
        }

        this.state.update(s);
        this.state.draw(s);
        // if (0) {
        //   if (s.mouseIsPressed) {
        //     let startPos = s.createVector(s.mouseX + left, s.mouseY + top);
        //     this.state.objs.push(new PhysicsObject(s, startPos.copy(), startPos.copy(), 0, s.color(255)));
        //   }

        //   let deltaTime = Math.min(s.deltaTime, 16.666);
        //   let stepSize = 4;
        //   for (let i = 0; i < stepSize; ++i) {
        //     this.state.update(s, deltaTime / stepSize);
        //   }

        //   this.state.draw(s);
        // }

        // if (this.shaderTexture && this.shader) {

        //   this.shaderTexture.loadPixels();
        //   s.text(this.shaderTexture.pixels[(((20 * w) + 8) * 4)+0], left, top + ((14 + 2) * 7));
        //   s.text(this.shaderTexture.pixels[(((20 * w) + 8) * 4)+1], left, top + ((14 + 2) * 8));
        //   s.text(this.shaderTexture.pixels[(((20 * w) + 8) * 4)+2], left, top + ((14 + 2) * 9));
        //   s.text(this.shaderTexture.pixels[(((20 * w) + 8) * 4)+3], left, top + ((14 + 2) * 10));
        //   // for (let y = 0; y < h; y += 20) { 
        //   //   for (let x = 0; x < w; x += 20) { 
        //   //     let intensity = this.shaderTexture.pixels[((y * w) + x) * 4] - 128;
        //   //     let angle = Math.min(Math.max(((intensity* 1.1) / 128) * s.TWO_PI, -s.PI), s.PI);
        //   //     // let angle = ((intensity* 1.5) / 255) * s.TWO_PI;
        //   //     let cost = Math.cos(angle);
        //   //     let sint = Math.sin(angle);
        //   //     let xOff = (cost * 10) + (-sint * 10);
        //   //     let yOff = (sint * 10) + ( cost * 10);
        //   //     s.stroke(s.color(255-intensity, 255-intensity, 255));
        //   //     let curX = x - (w/2);
        //   //     let curY = y - (h/2);
        //   //     s.line(curX, curY, curX+xOff, curY+yOff);
        //   //     s.circle(curX+xOff, curY+yOff, 3);
        //   //   } 
        //   // }
        // }
      }
    }

    let canvas = new p5(sketch);
  }
}
