import { Component, OnInit } from '@angular/core';
import * as p5 from 'p5';
import { Display } from './interfaces/display.interface';
import { PerlinShader } from './interfaces/perlin-shader.interface';
import { PhysicsObject } from './interfaces/physics-object.interface';
import { IState, State } from './interfaces/state.interface';

function vh(percent: number) {
  var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  return ((percent * h) / 100) - 1;
}

function vw(percent: number) {
  var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  return ((percent * w) / 100) - 1;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular-p5';

  perlinShader: PerlinShader = new PerlinShader();

  state: IState = new State();
  font: p5.Font;

  ngOnInit() {
    const sketch = (s: p5) => {
      s.preload = () => {
        this.font = s.loadFont('./assets/JetBrainsMono-Regular.ttf');
        // this.perlinShader.preload(s);
      }

      s.setup = () => {
        this.state.display = new Display(s, document.documentElement.clientWidth, document.documentElement.clientHeight);

        // this.perlinShader.setup(s);

        s.frameRate(120);
        s.pixelDensity(1);
        s.noSmooth();

        for (let i = 1; i < 21; ++i) {
          let startPos = s.createVector(-200 + (30*i), 0);
          this.state.objs.push(new PhysicsObject(s, startPos.copy(), startPos.copy(), 0, s.color(255)));
        }
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

        if (0) {
          if (s.mouseIsPressed) {
            let startPos = s.createVector(s.mouseX + left, s.mouseY + top);
            this.state.objs.push(new PhysicsObject(s, startPos.copy(), startPos.copy(), 0, s.color(255)));
          }

          let deltaTime = Math.min(s.deltaTime, 16.666);
          let stepSize = 4;
          for (let i = 0; i < stepSize; ++i) {
            this.state.update(s, deltaTime / stepSize);
          }

          this.state.draw(s);
        }
      }
    }

    let canvas = new p5(sketch);
  }
}
