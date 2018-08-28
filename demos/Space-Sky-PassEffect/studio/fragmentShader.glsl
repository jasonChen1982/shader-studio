uniform vec2 iResolution;
uniform float iSpeed;
uniform float iTime;
uniform float iTimeDelta;
varying vec2 vUv;
#define PI 3.14159265359

mat2 rotate2d(float _angle) {
  return mat2(cos(_angle),-sin(_angle),
  sin(_angle),cos(_angle));
}

float hash( vec2 p ) {
  float h = dot(p,vec2(127.1,311.7));
  return -1.0 + 2.0*fract(sin(h)*43758.5453123);
}

float noise( in vec2 p ) {
  vec2 i = floor( p );
  vec2 f = fract( p );
  vec2 u = f*f*(3.0-2.0*f);
  return mix( mix( hash( i + vec2(0.0,0.0) ),
              hash( i + vec2(1.0,0.0) ), u.x),
              mix( hash( i + vec2(0.0,1.0) ),
              hash( i + vec2(1.0,1.0) ), u.x),
          u.y);
}

float random(vec2 n, float offset ){
  return .5 - fract(sin(dot(n.xy + vec2( offset, 0. ), vec2(12.9898, 78.233)))* 43758.5453);
}

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  vec3 orig = vec3(0.1);
  uv -= 0.5;
  uv = rotate2d( fract(iTime/40.0)*2.0*PI ) * uv;
  uv += 0.5;
  vec3 col1 = vec3(uv,1.0);
  vec3 col2 = vec3(1,uv);
  float t = abs(2.0 * fract(iTime/10.0) - 1.0);
  vec3 col = mix(col1,col2,t);
  float tn = iTime/5.0;
  vec2 uvn = uv * 2.; // noise scale
  float f  = noise( uvn + tn);
  f *= 0.8;
  col += f;
  col -= 0.4;
  col += vec3(.3 * random( vUv, .000001 * iSpeed * iTime ));
  gl_FragColor = vec4(orig + col * 0.3, 1.0);
}
