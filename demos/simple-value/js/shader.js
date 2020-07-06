var vertexShader = "#define GLSLIFY 1\nvarying vec4 vPosition;\n\nvoid main() {\n  vPosition = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n  gl_Position = vPosition;\n}\n"; // eslint-disable-line

var fragmentShader = "#define GLSLIFY 1\nuniform vec2 iResolution;\nuniform float iTime;\nuniform float iTimeDelta;\n\n#define PI 3.1415926\n#define PI2 6.2831853\n\nmat2 rotate(float deg) {\n  return mat2(cos(deg), sin(deg), -sin(deg), cos(deg));\n}\n\nvoid main() {\n  // Normalized pixel coordinates (from 0 to 1)\n  vec2 uv = gl_FragCoord.xy / iResolution.xy;\n\n  uv = rotate( iTime/40.0*PI2 ) * uv;\n\n  // Time varying pixel color\n  vec3 col = 0.5 + 0.5 * cos(iTime + uv.xyx + vec3(0, 2, 4));\n\n  // Output to screen\n  gl_FragColor = vec4(col, 1.0);\n}\n"; // eslint-disable-line

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
