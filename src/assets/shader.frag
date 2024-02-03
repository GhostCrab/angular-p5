/*
#ifdef GL_ES
precision mediump float;
#endif

precision highp float;
uniform vec2 p;
uniform float r;
const int I = 500;
varying vec2 vTexCoord;

void main() {
  // vec2 c = p + gl_FragCoord.xy * r, z = c;
  // float n = 0.0;
  // for (int i = I; i > 0; i --) {
  //   if(z.x*z.x+z.y*z.y > 4.0) {
  //     n = float(i)/float(I);
  //     break;
  //   }
  //   z = vec2(z.x*z.x-z.y*z.y, 2.0*z.x*z.y) + c;
  // }
  // gl_FragColor = vec4(0.5-cos(n*17.0)/2.0,0.5-cos(n*13.0)/2.0,0.5-cos(n*23.0)/2.0,1.0);
  gl_FragColor = vec4(vTexCoord.x, vTexCoord.y, 0., 0.);
}

*/


precision mediump float; 
uniform vec2 noiseOffset;
uniform bool bButton; 
varying vec2 vTexCoord; 


float random1(in float x) {
  return fract(sin(x)*10000.0);
}

float random2 (in vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);
}

float random2 (in float x, in float y){
  return fract(sin(dot(vec2(x,y),vec2(12.9898,78.233)))*43758.5453123);
}

float randomGaussian(in vec2 st, in float mean, in float sdv) {
  const int N = 8;
  const float n2 = (float(N))/2.0;
  float x = st.x;
  float y = st.y;
  float sum = 0.0; 
  for (int i=0; i<N; i++){
    float xp = random2 (x, y);
    float yp = random2 (y, x);
    sum += random2 (xp, yp); 
    x = xp; 
    y = yp; 
  }
  sum = (sum-n2)/n2*sdv + mean;
  return sum; 
}



// Perlin noise ported from p5
float scaled_cosine (in float f){
  return 0.5 * (1.0 - cos(f * 3.14159265359));
}


// https://github.com/processing/p5.js/blob/main/src/math/noise.js#L101
float p5PerlinNoise (float x, float y, int noct, float falloff) {
  
  float xif = floor(x); 
  float yif = floor(y); 
  float xf = fract(x);
  float yf = fract(y);
  
  float rxf, ryf;
  float ampl = 0.5;
  float n1, n2;
  float r = 0.0;

  for (int o = 0; o < 10; o++) {
    if (o >= noct){
      break;
    }
    
    rxf = scaled_cosine(xf);
    ryf = scaled_cosine(yf);
      
    n1 =         random2 (xif    , yif    );
    n1 += rxf * (random2 (xif+1.0, yif    ) - n1);
    n2 =         random2 (xif    , yif+1.0);
    n2 += rxf * (random2 (xif+1.0, yif+1.0) - n2);
    n1 += ryf * (n2 - n1);
    
    r += n1 * ampl;
    ampl *= falloff;
    
    xif*= 2.0; 
    xf *= 2.0;
    yif*= 2.0; 
    yf *= 2.0;

    if (xf >= 1.0) {
      xif++; 
      xf--;
    }
    if (yf >= 1.0) {
      yif++;
      yf--;
    }
  }
  
  return r;
}






// Value Noise by Inigo Quilez
// https://www.shadertoy.com/view/lsf3WH
// https://www.shadertoy.com/view/XtXXD8
float hash (vec2 p) {
  return 2.0*fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453) - 1.0;
}

float iqNoise(in vec2 p ){
    vec2 i = floor( p );
    vec2 f = fract( p );
	vec2 u = f*f*(3.0-2.0*f);
    return mix( mix( hash( i + vec2(0.0,0.0) ), 
                     hash( i + vec2(1.0,0.0) ), u.x),
                mix( hash( i + vec2(0.0,1.0) ), 
                     hash( i + vec2(1.0,1.0) ), u.x), u.y);
}

float iqPerlinNoise (in vec2 p, int noct, float falloff){
  vec2 uv = p; 
  mat2 m = mat2( 1.6, 1.2, -1.2, 1.6 );
  float ampl = falloff;
  float f = 0.0;
  
  for (int o = 0; o < 10; o++) {
    if (o >= noct){
      break;
    }
    f += iqNoise( uv ) * ampl;
    ampl *= falloff;
    uv = m*uv;
  }
 
  f = 0.5 + 0.5*f;
  return f; 
}

void main() { 
  vec2 coord = vTexCoord; 
  
  // gl_FragColor = vec4(coord.x, 0.00, 0.55, 1.00 ); 
  // float r = random2(coord); 
  // float r = randomGaussian(coord, 0.5, 0.2); 

  float nx = (coord.x * 2.0) + noiseOffset.x;
  float ny = coord.y + noiseOffset.y;
  float r = 0.0; 
  float sc = 10.0; 

  if (!bButton){
    vec2 p = vec2(nx, ny);
    r = iqPerlinNoise (sc*p, 5, 0.5);
  } else {
    r = p5PerlinNoise (sc*nx, sc*ny, 5, 0.5);
  }
  
 
  gl_FragColor = vec4(r,r,r, 1.0); 
}

























/*
// Voronoise by Inigo Quilez
// https://www.shadertoy.com/view/Xd23Dh

vec3 hash3(in vec2 p ) {
    vec3 q = vec3( dot(p,vec2(127.1,311.7)),
				   dot(p,vec2(269.5,183.3)), 
				   dot(p,vec2(419.2,371.9)) );
	return fract(sin(q)*43758.5453);
}

float voronoise( in vec2 p, float u, float v ){
	float k = 1.0+63.0*pow(1.0-v,6.0);
    vec2 i = floor(p);
    vec2 f = fract(p);
	vec2 a = vec2(0.0,0.0);
    for( int y=-2; y<=2; y++ ) {
      for( int x=-2; x<=2; x++ ) {
          vec2  g = vec2( x, y );
          vec3  o = hash3( i + g )*vec3(u,u,1.0);
          vec2  d = g - f + o.xy;
          float w = pow( 1.0-smoothstep(0.0,1.4142135,length(d)), k );
          a += vec2(o.z*w,w);
      }
    }
    return a.x/a.y;
}


float iqVoroPerlinNoise (in vec2 p, float u, float v, int noct, float falloff) {
  float ampl = falloff;
  float r = 0.0;
  float sc = 1.0; 
  for (int o = 0; o < 10; o++) {
    if (o >= noct){
      break;
    }
    float n1 = voronoise(sc*p, u, v);
    r += n1 * ampl;
    ampl *= falloff;
    sc *= 2.0; 
  }
  return r;
}

*/







/*
// 2D Perlin Noise by Stefan Gustavson.
// Distributed under the MIT license.
// https://github.com/stegu/webgl-noise

vec4 mod289(vec4 x){
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec4 permute(vec4 x){
  return mod289(((x*34.0)+10.0)*x);
}
vec4 taylorInvSqrt(vec4 r){
  return 1.79284291400159 - 0.85373472095314 * r;
}
vec2 fade(vec2 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}

// Gustavson Perlin noise
float GustavsonPerlinNoise(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod289(Pi); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;

  vec4 i = permute(permute(ix) + iy);
  vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0 ;
  vec4 gy = abs(gx) - 0.5 ;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;

  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);

  float d00 = dot(g00,g00);
  float d01 = dot(g01,g01);
  float d10 = dot(g10,g10);
  float d11 = dot(g11,g11);
  
  vec4 norm = taylorInvSqrt(vec4(d00, d01, d10, d11));
  g00 *= norm.x;  
  g01 *= norm.y;  
  g10 *= norm.z;  
  g11 *= norm.w;  

  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));

  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return n_xy;
}

  // vec2 perlinCoord = vec2(coord.x*10.0, coord.y*10.0);
  // float r = 0.5 + GustavsonPerlinNoise(perlinCoord);
*/
