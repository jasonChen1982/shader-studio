var vertexShader = "#define GLSLIFY 1\nvarying vec4 vPosition;\n\nvoid main() {\n  vPosition = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n  gl_Position = vPosition;\n}\n"; // eslint-disable-line

var fragmentShader = "#define GLSLIFY 1\n#define TWO_PI 6.28318530718\n#define N 64\n#define MAX_STEP 10\n#define MAX_DISTANCE 2.0\n#define EPSILON 1e-6\n\nuniform vec2 iResolution;\nuniform float iTime;\nuniform float iTimeDelta;\n\nconst mat2 m = mat2(0.80, 0.60, -0.60, 0.80);\n\nfloat hash(float n) {\n  return fract(sin(n) * 43758.5453);\n}\n\nfloat rand(vec2 co){\n  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);\n}\n\nfloat noise(vec2 x) {\n  vec2 p = floor(x);\n  vec2 f = fract(x);\n\n  f = f * f * (3.0 - 2.0 * f);\n\n  float n = p.x + p.y * 57.0;\n\n  return mix(mix( hash(n + 0.0), hash(n + 1.0), f.x),\n             mix( hash(n + 57.0), hash(n + 58.0), f.x), f.y);\n}\n\nfloat fbm( vec2 p ) {\n  float f = 0.0;\n\n  f += 0.50000*noise( p ); p = m*p*2.02;\n  f += 0.25000*noise( p ); p = m*p*2.03;\n  f += 0.12500*noise( p ); p = m*p*2.01;\n  f += 0.06250*noise( p ); p = m*p*2.04;\n  f += 0.03125*noise( p );\n\n  return f / 0.984375;\n}\n\nfloat circleSDF(vec2 point, vec2 center, float r) {\n  return length(point - center) - r;\n}\n\nfloat rayMarching(vec2 p, vec2 rd) {\n  float t = 0.;\n  for (int i = 0; i < MAX_STEP; i++) {\n    float sd = circleSDF(p + rd * t, vec2(0.), 0.2);\n    if (sd < EPSILON) return 2.0;\n    t += sd;\n    if (t >= MAX_DISTANCE) return 0.;\n  }\n  return 0.;\n}\n\nfloat sample(vec2 p) {\n  float sum = 0.0;\n  for (int i = 0; i < N; i++) {\n    float a = TWO_PI * (float(i) + rand(p)) / float(N);\n    sum += rayMarching(p, vec2(cos(a), sin(a)));\n  }\n  return sum / float(N);\n}\n\nvoid main() {\n  // Normalized pixel coordinates (from 0 to 1)\n\tvec2 p = (2.0 * gl_FragCoord.xy - iResolution.xy) / min(iResolution.y, iResolution.x);\n\n  // Time varying pixel color\n  vec3 col = vec3(sample(p)) + fbm(p + iTime * 0.1);\n\n  // Output to screen\n  gl_FragColor = vec4(col, 1.0);\n}\n"; // eslint-disable-line

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
