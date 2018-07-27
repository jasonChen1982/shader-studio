uniform vec2 iResolution;
uniform float iTime;
uniform float iTimeDelta;

#define PI2 6.28318530718
#define SAMPLE_TIMES 64.
#define MAX_STEP 10

const mat2 m = mat2(0.80, 0.60, -0.60, 0.80);

float rand(vec2 co){
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float hash(float n) {
  return fract(sin(n) * 43758.5453);
}

float noise(vec2 x) {
  vec2 p = floor(x);
  vec2 f = fract(x);

  f = f * f * (3.0 - 2.0 * f);
  float n = p.x + p.y * 57.0;

  return mix(mix( hash(n + 0.0), hash(n + 1.0), f.x),
             mix( hash(n + 57.0), hash(n + 58.0), f.x), f.y);
}

float fbm( vec2 p ) {
  float f = 0.0;
  f += 0.50000*noise( p ); p = m*p*2.02;
  f += 0.25000*noise( p ); p = m*p*2.03;
  f += 0.12500*noise( p ); p = m*p*2.01;
  f += 0.06250*noise( p ); p = m*p*2.04;
  f += 0.03125*noise( p );
  return f / 0.984375;
}

float heartSDF(vec2 point) {
	// point.y -= 0.25;
  float a = atan(point.x, point.y) / 3.141593;
  float r = length(point);
  float h = abs(a);
  float d = 0.5*(13.0 * h - 22.0 * h * h + 10.0 * h * h * h) / (6.0 - 5.0 * h);
  return r-d;
}

float rayMarching(vec2 p, vec2 rd) {
  float t = 0.;
  float tt = iTime * 0.1;
  // reference @Milo Yip's method
  for (int i = 0; i < MAX_STEP; i++) {
    float sd = heartSDF(p + rd * t);
    if (sd < 0.001) return 1. + 1.5 * fbm(p - vec2(0., tt)) * sin(iTime * .8);
    t += sd;
    if (t >= 1.5) return 0.;
  }
  return 0.;
}


float sample(vec2 p) {
  float weight = 0.0;
  // montecarlo method
  for (float i = 0.; i < SAMPLE_TIMES; i++) {
    float a = PI2 * (i + rand(p) - 0.5) / SAMPLE_TIMES;
    weight += rayMarching(p, vec2(cos(a), sin(a)));
  }
  return weight / SAMPLE_TIMES;
}

void main() {
  // Normalized pixel coordinates (from 0 to 1)
	vec2 p = (2.0 * gl_FragCoord.xy - iResolution.xy) / min(iResolution.y, iResolution.x);

  // Time varying pixel color
  vec3 col = vec3(sample(p));

  // Output to screen
  gl_FragColor = vec4(col, 1.0);
}
