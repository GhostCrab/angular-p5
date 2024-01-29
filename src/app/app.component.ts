import { Component, OnInit } from '@angular/core';
import * as p5 from 'p5';
import { Display } from './interfaces/display.interface';
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

  state: IState = new State();

  ngOnInit() {
    const sketch = (s: p5) => {
      
      s.preload = () => {}

      s.setup = () => {
        this.state.display = new Display(s, document.documentElement.clientWidth, document.documentElement.clientHeight);

        s.frameRate(120);

        for (let i = 1; i < 21; ++i) {
          let startPos = s.createVector(300 + (30*i), this.state.display.h / 2);
          this.state.objs.push(new PhysicsObject(s, startPos.copy(), startPos.copy(), 20, s.color(255)));
        }
      }

      s.draw = () => {
        s.background(30);
        
        s.fill(255);
        s.text(s.getTargetFrameRate(), 3, 20);
        s.text(s.frameCount, 3, 40);
        s.text(s.deltaTime.toFixed(2), 3, 60);
        s.text(((1 / s.deltaTime) * 1000).toFixed(2), 3, 80);
        s.text(this.state.objs.length, 3, 100);

        if (s.mouseIsPressed) {
          let startPos = s.createVector(s.mouseX, s.mouseY);
          this.state.objs.push(new PhysicsObject(s, startPos.copy(), startPos.copy(), 20, s.color(255)));
        }

        let stepSize = 10;
        for (let i = 0; i < stepSize; ++i) {
          this.state.update(s, s.deltaTime / stepSize);
        }
        this.state.draw(s);
      }
    }

    let canvas = new p5(sketch);
  }
}
