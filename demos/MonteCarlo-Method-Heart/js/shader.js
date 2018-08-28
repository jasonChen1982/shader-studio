var vertexShader = "#define GLSLIFY 1\nvarying vec4 vPosition;\n\nvoid main() {\n  vPosition = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n  gl_Position = vPosition;\n}\n"; // eslint-disable-line

var fragmentShader = "#define GLSLIFY 1\nuniform vec2 iResolution;\nuniform float iTime;\nuniform float iTimeDelta;\n\n#define PI2 6.28318530718\n#define SAMPLE_TIMES 64.\n#define MAX_STEP 10\n\nconst mat2 m = mat2(0.80, 0.60, -0.60, 0.80);\n\nfloat rand(vec2 co){\n  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);\n}\n\nfloat hash(float n) {\n  return fract(sin(n) * 43758.5453);\n}\n\nfloat noise(vec2 x) {\n  vec2 p = floor(x);\n  vec2 f = fract(x);\n\n  f = f * f * (3.0 - 2.0 * f);\n  float n = p.x + p.y * 57.0;\n\n  return mix(mix( hash(n + 0.0), hash(n + 1.0), f.x),\n             mix( hash(n + 57.0), hash(n + 58.0), f.x), f.y);\n}\n\nfloat fbm( vec2 p ) {\n  float f = 0.0;\n  f += 0.50000*noise( p ); p = m*p*2.02;\n  f += 0.25000*noise( p ); p = m*p*2.03;\n  f += 0.12500*noise( p ); p = m*p*2.01;\n  f += 0.06250*noise( p ); p = m*p*2.04;\n  f += 0.03125*noise( p );\n  return f / 0.984375;\n}\n\nfloat heartSDF(vec2 point) {\n\t// point.y -= 0.25;\n  float a = atan(point.x, point.y) / 3.141593;\n  float r = length(point);\n  float h = abs(a);\n  float d = 0.5*(13.0 * h - 22.0 * h * h + 10.0 * h * h * h) / (6.0 - 5.0 * h);\n  return r-d;\n}\n\nfloat rayMarching(vec2 p, vec2 rd) {\n  float t = 0.;\n  float tt = iTime * 0.1;\n  // reference @Milo Yip's method\n  for (int i = 0; i < MAX_STEP; i++) {\n    float sd = heartSDF(p + rd * t);\n    if (sd < 0.001) return 1. + 1.5 * fbm(p - vec2(0., tt)) * sin(iTime * .8);\n    t += sd;\n    if (t >= 1.5) return 0.;\n  }\n  return 0.;\n}\n\nfloat sample(vec2 p) {\n  float weight = 0.0;\n  // montecarlo method\n  for (float i = 0.; i < SAMPLE_TIMES; i++) {\n    float a = PI2 * (i + rand(p) - 0.5) / SAMPLE_TIMES;\n    weight += rayMarching(p, vec2(cos(a), sin(a)));\n  }\n  return weight / SAMPLE_TIMES;\n}\n\nvoid main() {\n  // Normalized pixel coordinates (from 0 to 1)\n\tvec2 p = (2.0 * gl_FragCoord.xy - iResolution.xy) / min(iResolution.y, iResolution.x);\n\n  // Time varying pixel color\n  vec3 col = vec3(sample(p));\n\n  // Output to screen\n  gl_FragColor = vec4(col, 1.0);\n}\n"; // eslint-disable-line

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
