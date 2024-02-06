import * as p5 from 'p5';

export class PerlinShader {
  shader: p5.Shader;
  shaderTexture: p5.Graphics;

  preload(s: p5) {
    this.shader = s.loadShader('./assets/perlin-shader.vert', './assets/perlin-shader.frag');
  }

  setup(s: p5) {
    this.shaderTexture = s.createGraphics(document.documentElement.clientWidth, document.documentElement.clientHeight, s.WEBGL);
    this.shaderTexture.loadPixels();
    this.shaderTexture.noStroke();

    this.shader.setUniform('p', [-0.74364388703, 0.13182590421]);
  }

  draw(s: p5) {
    const w = document.documentElement.clientWidth;
    const h = document.documentElement.clientHeight
    const left = -(w / 2);
    const top = -(h / 2);

    this.shaderTexture.shader(this.shader);
    this.shaderTexture.rect(0, 0, w, h);

    s.stroke(0);
    s.texture(this.shaderTexture);
    s.rect(left, top, w, h);

    // this.shaderTexture.loadPixels();
    // s.text(this.shaderTexture.pixels[(((20 * w) + 8) * 4)+0], left, top + ((14 + 2) * 7));
    // s.text(this.shaderTexture.pixels[(((20 * w) + 8) * 4)+1], left, top + ((14 + 2) * 8));
    // s.text(this.shaderTexture.pixels[(((20 * w) + 8) * 4)+2], left, top + ((14 + 2) * 9));
    // s.text(this.shaderTexture.pixels[(((20 * w) + 8) * 4)+3], left, top + ((14 + 2) * 10));
    // for (let y = 0; y < h; y += 20) { 
    //   for (let x = 0; x < w; x += 20) { 
    //     let intensity = this.shaderTexture.pixels[((y * w) + x) * 4] - 128;
    //     let angle = Math.min(Math.max(((intensity* 1.1) / 128) * s.TWO_PI, -s.PI), s.PI);
    //     // let angle = ((intensity* 1.5) / 255) * s.TWO_PI;
    //     let cost = Math.cos(angle);
    //     let sint = Math.sin(angle);
    //     let xOff = (cost * 10) + (-sint * 10);
    //     let yOff = (sint * 10) + ( cost * 10);
    //     s.stroke(s.color(255-intensity, 255-intensity, 255));
    //     let curX = x - (w/2);
    //     let curY = y - (h/2);
    //     s.line(curX, curY, curX+xOff, curY+yOff);
    //     s.circle(curX+xOff, curY+yOff, 3);
    //   } 
    // }
  }
}