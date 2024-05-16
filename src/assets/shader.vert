#ifdef GL_ES
precision mediump float;
#endif

precision highp float;
uniform mat4 uViewMatrix;
uniform mat4 uModelMatrix;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewProjectionMatrix;

attribute vec3 aPosition;
attribute vec2 aTexCoord;
attribute vec3 aNormal;

uniform float millis;

varying vec2 vTexCoord;
varying vec4 vNormal;

void main() {
  vTexCoord = aTexCoord;
  vTexCoord.y = 1. - vTexCoord.y;

  vec4 positionVec4 = vec4(aPosition, 1.0);



  // mat4 id = mat4(
  //   1., 0., 0., 0.,
  //   0., cos(millis/1000.), sin(millis/1000.), 0.,
  //   0., -sin(millis/1000.), cos(millis/1000.), 0.,
  //   0., 0., 0., 1.
  // );

  mat4 id = mat4(
    cos(millis/4000.), -sin(millis/4000.), 0., 0.,
    sin(millis/4000.), cos(millis/4000.), 0., 0.,
    0., 0., 1., 0.,
    0., 0., 0., 1.
  );

  // mat4 id = mat4(
  //   1., 0., 0., 0.,
  //   0., 1., 0., 0.,
  //   0., 0., 1., 0.,
  //   0., 0., 0., 1.
  // );

  vNormal = vec4(aNormal, 1.);
  
  gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
  // gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
 }