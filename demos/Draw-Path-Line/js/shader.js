var vertexShader = "#define GLSLIFY 1\nvarying vec4 vPosition;\n\nvoid main() {\n  vPosition = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n  gl_Position = vPosition;\n}\n"; // eslint-disable-line

var fragmentShader = "#define GLSLIFY 1\nuniform vec2 iResolution;\nuniform float iTime;\nuniform float iTimeDelta;\n\n#define PI 3.141592653589793\n#define PI2 PI * 2.\n#define N 20.\n#define bg vec3(0., 0.6627451, 0.6196078)\n\n#define M(x,y)             x0 = _x = x;   y0 = _y = y;\n#define L(x,y)             d = min(d, line(uv, vec2(_x,_y), vec2(x,y)) ); _x=x,_y=y;\n#define C(x1,y1,x2,y2,x,y) d = min(d, bezier(uv, vec2(_x,_y), vec2(x1,y1),vec2(x2,y2), vec2(x,y)) ); _x=x,_y=y;\n#define R(x,y,r)           d = min(d, circle(uv, vec2(x,y), r));\n#define Z                  d = min(d, line(uv, vec2(_x,_y), vec2(x0,y0)) );\n#define m(x,y)             M(_x+x,_y+y)\n#define l(x,y)             L(_x+x,_y+y)\n#define c(x1,y1,x2,y2,x,y) C(_x+x1,_y+y1,_x+x2,_y+y2,_x+x,_y+y)\n#define z                  Z\n\nvec2 interpolate(vec2 G1, vec2 G2, vec2 G3, vec2 G4, float t) {\n  vec2 A = G4-G1 + 3.*(G2-G3);\n  vec2 B = 3.*(G1-2.*G2+G3);\n  vec2 C = 3.*(G2-G1);\n  vec2 D = G1;\n  return t * (t * (t * A + B) + C) + D;\n}\n\nfloat line(vec2 p, vec2 a, vec2 b) {\n  vec2 pa = p - a;\n  vec2 ba = b - a;\n  vec2 dir = normalize(ba);\n  float t = clamp(dot(pa, dir), 0., length(ba));\n  vec2 pd = pa - dir * t;\n  return dot(pd, pd);\n}\n\nfloat bezier(vec2 uv, vec2 A, vec2 B, vec2 C, vec2 D) {\n  float d = 1e5;\n  vec2 p = A;\n  for (float t = 1.; t <= N; t++) {\n    vec2 q = interpolate(A, B, C, D, t/N);\n    float sd = line(uv, p, q);\n    d = min(d, sd );\n    p = q;\n\t}\n\treturn d;\n}\n\nfloat circles(vec2 uv, vec2 center, float radius, float dir, float width, float seg) {\n  vec2 uc = uv - center;\n  float dist = length(uc) - radius;\n  float dt = dir * iTime;\n  float angle = mod(atan(uc.y, uc.x) + dt * 2.5 + sin(dt * 4.0) / 1.0, PI2);\n  float oddity = mod(angle / PI2 * seg * 2.0, 2.0);\n  if (floor(mod(oddity, 2.0)) == 0.0) {\n    dist = 1e5;\n  }\n\treturn smoothstep(width - 1., width, sqrt(dist * dist));\n}\n\nfloat circle(vec2 uv, vec2 center, float radius) {\n  vec2 uc = uv - center;\n  float dist = length(uc) - radius;\n  return dist * dist;\n}\n\nvec3 drawPath(vec2 uv, vec3 color, float width, float blur) {\n  float d = 1e38;\n  float _x;\n  float _y;\n  float x0;\n  float y0;\n\n  M(-216., 120.);\n  C(-200., 60., -215., -80., -216., -90.);\n  C(-216., -90., -215., -110., -244., -108.);\n  float sd = smoothstep(width - blur, width, sqrt(d));\n  color = mix(vec3(114./255., 64./255., 76./255.), color, sd);\n\n  // 其他笔画\n  d = 1e38;\n  M(-248., 71.);\n  L(-184., 71.);\n  sd = smoothstep(width - blur, width, sqrt(d));\n  color = mix(vec3(251./255., 216./255., 188./255.), color, sd);\n\n  d = 1e38;\n  M(-256., -12.);\n  L(-188., 15.);\n\n  M(-150., 96.);\n  L(-96., 106.);\n  C(-30., 100., -48., 20., -88., 22.);\n\n  M(-118., 100.);\n  C(-118., 106., -114., 50., -156., 12.);\n\n  M(136., 112.);\n  C(136., 30., 116., -80., 30., -110.);\n  sd = smoothstep(width - blur, width, sqrt(d));\n  color = mix(vec3(114./255., 64./255., 76./255.), color, sd);\n\n  d = 1e38;\n  M(136., 112.);\n  C(136., 30., 156., -80., 236., -110.);\n  sd = smoothstep(width - blur, width, sqrt(d));\n  color = mix(vec3(1., 0.5, 0.48), color, sd);\n\n  d = 1e38;\n  R(-104., -60., 52.);\n  sd = smoothstep(width - blur, width, sqrt(d));\n  color = mix(vec3(251./255., 216./255., 188./255.), color, sd);\n\n  return color;\n}\n\nvec3 drawLoading(vec2 uv, vec3 color) {\n  float sd = circles(uv, vec2(0., 0.), 490., -0.1, 60., 30.);\n  color = mix(vec3(0.3, 0.7627451, 0.7196078), color, sd);\n\n  sd = circles(uv, vec2(0., 0.), 390., 1., 25., 1.);\n  color = mix(vec3(1.0), color, sd);\n\n  sd = circles(uv, vec2(0., 0.), 680., 0.1, 10., 0.5);\n  color = mix(vec3(0.6, 0.8627451, 0.8196078), color, sd);\n\n  sd = circles(uv, vec2(0., 0.), 580., -0.2, 6., 0.5);\n  color = mix(vec3(1.0), color, sd);\n\n  sd = circles(uv, vec2(0., 0.), 290., 0.5, 2., 4.);\n  color = mix(vec3(1.0), color, sd);\n\n  sd = circles(uv, vec2(-104., -60.), 28., -0.6, 5., 1.);\n  color = mix(vec3(1., 0.5, 0.48), color, sd);\n\n  return color;\n}\n\nvoid main() {\n  vec2 coord = gl_FragCoord.xy - iResolution.xy / 2.0;\n\n  // 颜色混合\n  vec3 color = bg;\n  color = drawPath(coord, color, 15.0, 1.0);\n  color = drawLoading(coord, color);\n\n  // 输出到屏幕\n  gl_FragColor = vec4(color, 1.0);\n}\n"; // eslint-disable-line

var Vector2 = THREE.Vector2;

var shader = {

  uniforms: {
    iResolution: {
      value: new Vector2(300, 150)
    },
    iTime: {
      value: 0.0
    },
    iTimeDelta: {
      value: 0.0
    },
  },

  vertexShader: vertexShader,

  fragmentShader: fragmentShader

};
