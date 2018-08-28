var vertexShader = "#define GLSLIFY 1\nvarying vec4 vPosition;\nvarying vec2 vUv;\n\nvoid main() {\n  vUv = uv;\n  vPosition = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n  gl_Position = vPosition;\n}\n"; // eslint-disable-line

var fragmentShader = "#define GLSLIFY 1\nuniform vec2 iResolution;\nuniform float iSpeed;\nuniform float iTime;\nuniform float iTimeDelta;\nvarying vec2 vUv;\n#define PI 3.14159265359\n\nmat2 rotate2d(float _angle) {\n  return mat2(cos(_angle),-sin(_angle),\n  sin(_angle),cos(_angle));\n}\n\nfloat hash( vec2 p ) {\n  float h = dot(p,vec2(127.1,311.7));\n  return -1.0 + 2.0*fract(sin(h)*43758.5453123);\n}\n\nfloat noise( in vec2 p ) {\n  vec2 i = floor( p );\n  vec2 f = fract( p );\n  vec2 u = f*f*(3.0-2.0*f);\n  return mix( mix( hash( i + vec2(0.0,0.0) ),\n              hash( i + vec2(1.0,0.0) ), u.x),\n              mix( hash( i + vec2(0.0,1.0) ),\n              hash( i + vec2(1.0,1.0) ), u.x),\n          u.y);\n}\n\nfloat random(vec2 n, float offset ){\n  return .5 - fract(sin(dot(n.xy + vec2( offset, 0. ), vec2(12.9898, 78.233)))* 43758.5453);\n}\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / iResolution.xy;\n  vec3 orig = vec3(0.1);\n  uv -= 0.5;\n  uv = rotate2d( fract(iTime/40.0)*2.0*PI ) * uv;\n  uv += 0.5;\n  vec3 col1 = vec3(uv,1.0);\n  vec3 col2 = vec3(1,uv);\n  float t = abs(2.0 * fract(iTime/10.0) - 1.0);\n  vec3 col = mix(col1,col2,t);\n  float tn = iTime/5.0;\n  vec2 uvn = uv * 2.; // noise scale\n  float f  = noise( uvn + tn);\n  f *= 0.8;\n  col += f;\n  col -= 0.4;\n  col += vec3(.3 * random( vUv, .000001 * iSpeed * iTime ));\n  gl_FragColor = vec4(orig + col * 0.3, 1.0);\n}\n"; // eslint-disable-line

var Vector2 = THREE.Vector2;

var shader = {

  uniforms: {
    iResolution: {
      value: new Vector2(300, 150)
    },
    iTime: {
      value: 0.0
    },
    iSpeed: {
      value: 1.0
    },
    iTimeDelta: {
      value: 0.0
    },
  },

  vertexShader: vertexShader,

  fragmentShader: fragmentShader

};
