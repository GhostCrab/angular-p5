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
      }
    }

    let canvas = new p5(sketch);
  }
}
