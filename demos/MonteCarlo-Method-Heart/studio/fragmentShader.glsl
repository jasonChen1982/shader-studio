uniform vec2 iResolution;
uniform float iTime;
uniform float iTimeDelta;

#define TWO_PI 6.28318530718
#define N 64
#define MAX_STEP 10
#define MAX_DISTANCE 2.0
#define EPSILON 1e-6

float rand(vec2 co){
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float heartSDF(vec2 point) {
	point.y -= 0.25;
  float a = atan(point.x, point.y) / 3.141593;
  float r = length(point);
  float h = abs(a);
  float d = (13.0 * h - 22.0 * h * h + 10.0 * h * h * h) / (6.0 - 5.0 * h);
  return r-d;
}

float rayMarching(vec2 p, vec2 rd) {
  float t = 0.;
  // montecarlo
  for (int i = 0; i < MAX_STEP; i++) {
    float sd = heartSDF(p + rd * t);
    if (sd < EPSILON) return 2.0;
    t += sd;
    if (t >= MAX_DISTANCE) return 0.;
  }
  return 0.;
}


float sample(vec2 p) {
  float sum = 0.0;
  for (int i = 0; i < N; i++) {
    float a = TWO_PI * (float(i) + rand(p)) / float(N);
    sum += rayMarching(p, vec2(cos(a), sin(a)));
  }
  return sum / float(N);
}

void main() {
  // Normalized pixel coordinates (from 0 to 1)
	vec2 p = (2.0 * gl_FragCoord.xy - iResolution.xy) / min(iResolution.y, iResolution.x);

  // Time varying pixel color
  vec3 col = vec3(sample(p));

  // Output to screen
  gl_FragColor = vec4(col, 1.0);
}
