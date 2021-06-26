uniform vec2 iResolution;
uniform float iTime;
uniform float iTimeDelta;

#define PI 3.141592653589793
#define PI2 PI * 2.
#define N 20.
#define bg vec3(0., 0.6627451, 0.6196078)

#define M(x,y)             x0 = _x = x;   y0 = _y = y;
#define L(x,y)             d = min(d, line(uv, vec2(_x,_y), vec2(x,y)) ); _x=x,_y=y;
#define C(x1,y1,x2,y2,x,y) d = min(d, bezier(uv, vec2(_x,_y), vec2(x1,y1),vec2(x2,y2), vec2(x,y)) ); _x=x,_y=y;
#define R(x,y,r)           d = min(d, circle(uv, vec2(x,y), r));
#define Z                  d = min(d, line(uv, vec2(_x,_y), vec2(x0,y0)) );
#define m(x,y)             M(_x+x,_y+y)
#define l(x,y)             L(_x+x,_y+y)
#define c(x1,y1,x2,y2,x,y) C(_x+x1,_y+y1,_x+x2,_y+y2,_x+x,_y+y)
#define z                  Z

vec2 interpolate(vec2 G1, vec2 G2, vec2 G3, vec2 G4, float t) {
  vec2 A = G4-G1 + 3.*(G2-G3);
  vec2 B = 3.*(G1-2.*G2+G3);
  vec2 C = 3.*(G2-G1);
  vec2 D = G1;
  return t * (t * (t * A + B) + C) + D;
}

float line(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  vec2 dir = normalize(ba);
  float t = clamp(dot(pa, dir), 0., length(ba));
  vec2 pd = pa - dir * t;
  return dot(pd, pd);
}

float bezier(vec2 uv, vec2 A, vec2 B, vec2 C, vec2 D) {
  float d = 1e5;
  vec2 p = A;
  for (float t = 1.; t <= N; t++) {
    vec2 q = interpolate(A, B, C, D, t/N);
    float sd = line(uv, p, q);
    d = min(d, sd );
    p = q;
	}
	return d;
}

float circles(vec2 uv, vec2 center, float radius, float dir, float width, float seg) {
  vec2 uc = uv - center;
  float dist = length(uc) - radius;
  float dt = dir * iTime;
  float angle = mod(atan(uc.y, uc.x) + dt * 2.5 + sin(dt * 4.0) / 1.0, PI2);
  float oddity = mod(angle / PI2 * seg * 2.0, 2.0);
  if (floor(mod(oddity, 2.0)) == 0.0) {
    dist = 1e5;
  }
	return smoothstep(width - 1., width, sqrt(dist * dist));
}

float circle(vec2 uv, vec2 center, float radius) {
  vec2 uc = uv - center;
  float dist = length(uc) - radius;
  return dist * dist;
}

vec3 drawPath(vec2 uv, vec3 color, float width, float blur) {
  float d = 1e38;
  float _x;
  float _y;
  float x0;
  float y0;

  M(-216., 120.);
  C(-200., 60., -215., -80., -216., -90.);
  C(-216., -90., -215., -110., -244., -108.);
  float sd = smoothstep(width - blur, width, sqrt(d));
  color = mix(vec3(114./255., 64./255., 76./255.), color, sd);

  // 其他笔画
  d = 1e38;
  M(-248., 71.);
  L(-184., 71.);
  sd = smoothstep(width - blur, width, sqrt(d));
  color = mix(vec3(251./255., 216./255., 188./255.), color, sd);

  d = 1e38;
  M(-256., -12.);
  L(-188., 15.);

  M(-150., 96.);
  L(-96., 106.);
  C(-30., 100., -48., 20., -88., 22.);

  M(-118., 100.);
  C(-118., 106., -114., 50., -156., 12.);

  M(136., 112.);
  C(136., 30., 116., -80., 30., -110.);
  sd = smoothstep(width - blur, width, sqrt(d));
  color = mix(vec3(114./255., 64./255., 76./255.), color, sd);

  d = 1e38;
  M(136., 112.);
  C(136., 30., 156., -80., 236., -110.);
  sd = smoothstep(width - blur, width, sqrt(d));
  color = mix(vec3(1., 0.5, 0.48), color, sd);

  d = 1e38;
  R(-104., -60., 52.);
  sd = smoothstep(width - blur, width, sqrt(d));
  color = mix(vec3(251./255., 216./255., 188./255.), color, sd);

  return color;
}

vec3 drawLoading(vec2 uv, vec3 color) {
  float sd = circles(uv, vec2(0., 0.), 490., -0.1, 60., 30.);
  color = mix(vec3(0.3, 0.7627451, 0.7196078), color, sd);

  sd = circles(uv, vec2(0., 0.), 390., 1., 25., 1.);
  color = mix(vec3(1.0), color, sd);

  sd = circles(uv, vec2(0., 0.), 680., 0.1, 10., 0.5);
  color = mix(vec3(0.6, 0.8627451, 0.8196078), color, sd);

  sd = circles(uv, vec2(0., 0.), 580., -0.2, 6., 0.5);
  color = mix(vec3(1.0), color, sd);

  sd = circles(uv, vec2(0., 0.), 290., 0.5, 2., 4.);
  color = mix(vec3(1.0), color, sd);

  sd = circles(uv, vec2(-104., -60.), 28., -0.6, 5., 1.);
  color = mix(vec3(1., 0.5, 0.48), color, sd);

  return color;
}

void main() {
  vec2 coord = gl_FragCoord.xy - iResolution.xy / 2.0;

  // 颜色混合
  vec3 color = bg;
  color = drawPath(coord, color, 15.0, 1.0);
  color = drawLoading(coord, color);

  // 输出到屏幕
  gl_FragColor = vec4(color, 1.0);
}
