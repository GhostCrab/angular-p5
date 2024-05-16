precision highp float;

uniform float millis;

const int I = 500;
varying vec2 vTexCoord;
varying vec4 vNormal;
void main() { 
  float t = abs(fract(vTexCoord.x * (millis / 1000.)) * 2. - 1.);
  // gl_FragColor = vec4(t);
  gl_FragColor = vec4(vNormal);
  // gl_FragColor = vec4(vTexCoord.x, vTexCoord.y, 0., 0.);
}