var vertexShader = "#define GLSLIFY 1\nvarying vec4 vPosition;\n\nvoid main() {\n  vPosition = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n  gl_Position = vPosition;\n}\n"; // eslint-disable-line

var fragmentShader = "#define GLSLIFY 1\nuniform vec2 iResolution;\nuniform float iTime;\nuniform float iTimeDelta;\n\n// vec2 hash( in vec2 x ) {\n//   const vec2 k = vec2( 0.3183099, 0.3678794 );\n//   x = x*k + k.yx;\n//   return -1.0 + 2.0*fract( 16.0 * k*fract( x.x*x.y*(x.x+x.y)) );\n\n//     p = vec2( dot(p,vec2(127.1,311.7)),\n//               dot(p,vec2(269.5,183.3)));\n\n//     return -1.0 + 2.0 * fract(sin(p)*43758.5453123);\n// }\n\nvec2 hash22( vec2 p ) {\n  p = vec2( dot(p,vec2(312.3,123.2)),\n            dot(p,vec2(134.5,321.7)));\n\n  return -1.0 + 2.0 * fract(sin(p)*4567.676);\n}\n\nfloat perlinNoise(vec2 p) {\n    vec2 pi = floor(p);\n    vec2 pf = fract(p);\n\n    vec2 w = pf * pf * (3.0 - 2.0 * pf);\n\n    return mix(mix(dot(hash22(pi + vec2(0.0, 0.0)), pf - vec2(0.0, 0.0)),\n                   dot(hash22(pi + vec2(1.0, 0.0)), pf - vec2(1.0, 0.0)), w.x),\n               mix(dot(hash22(pi + vec2(0.0, 1.0)), pf - vec2(0.0, 1.0)),\n                   dot(hash22(pi + vec2(1.0, 1.0)), pf - vec2(1.0, 1.0)), w.x),\n               w.y);\n}\n\nfloat hash(float n) {\n  return fract(sin(n)*93942.234);\n}\n\nfloat valueNoise(vec2 p) {\n  vec2 w = floor(p);\n  vec2 k = fract(p);\n  k = k*k*(3.-2.*k); // smooth it\n\n  float n = w.x*10. + w.y*48.;\n\n  float a = hash(n);\n  float b = hash(n+10.);\n  float c = hash(n+48.);\n  float d = hash(n+58.);\n\n  return mix(\n    mix(a, b, k.x),\n    mix(c, d, k.x),\n    k.y);\n}\n\nconst mat2 mtx = mat2( 0.80,  0.60, -0.60,  0.80 );\n\nfloat fbm6( vec2 p ) {\n  float f = 0.0;\n\n  f += 0.500000*valueNoise( p ); p = mtx*p*2.02;\n  f += 0.250000*valueNoise( p ); p = mtx*p*2.03;\n  f += 0.125000*valueNoise( p ); p = mtx*p*2.01;\n  f += 0.062500*valueNoise( p ); p = mtx*p*2.04;\n  f += 0.031250*valueNoise( p ); p = mtx*p*2.01;\n  f += 0.015625*valueNoise( p );\n\n  return f/0.96875;\n}\n\nvoid main() {\n  // Normalized pixel coordinates (from 0 to 1)\n  vec2 uv = (2.0 * gl_FragCoord.xy - iResolution.xy) / min(iResolution.y, iResolution.x);\n\n  vec3 col = vec3(0.);\n  col += fbm6(3.*uv);\n\n  // Output to screen\n  gl_FragColor = vec4(col, 1.0);\n}\n"; // eslint-disable-line

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
