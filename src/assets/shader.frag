#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vTexCoord;

void main() {
    // Make a blue color. In shaders, the RGB color goes from 0 - 1 instead of 0 - 255

    vec2 uv = vTexCoord;
    gl_FragColor = vec4(uv,1.0,1.0);
}