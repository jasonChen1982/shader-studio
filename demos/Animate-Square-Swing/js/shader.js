var vertexShader = "#define GLSLIFY 1\nvarying vec4 vPosition;\n\nvoid main() {\n  vPosition = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n  gl_Position = vPosition;\n}\n"; // eslint-disable-line

var fragmentShader = "#define GLSLIFY 1\nuniform vec2 iResolution;\nuniform float iTime;\nuniform float iTimeDelta;\n#define cycle 1.5\n#define PI 3.1415926\n\nvoid main() {\n  // Normalized pixel coordinates (from 0 to 1)\n\tvec2 p = (2.0 * gl_FragCoord.xy - iResolution.xy) / min(iResolution.y, iResolution.x);\n\n  // background color\n  vec3 bcol = vec3(0.29412, 0.70196, 0.63921) * (1.0 - 0.3 * length(p));\n\n  // animate\n  float tt = mod(iTime, cycle) / cycle;\n  float ss = 1.0 + 0.5 * sin(tt * PI * 6.0 + p.y * 0.5) * exp(-tt * 4.0);\n  p *= vec2(0.7, 1.5) + ss * vec2(0.3, -0.5);\n\n  // draw a square area\n  vec2 ap = abs(p);\n  float r = max(ap.x, ap.y);\n\tfloat d = 0.5;\n\n  // set color\n\tvec3 ccol = vec3(1.0, 1.0, 1.0);\n\n  // merge background color and square color, with a mix effect when d-r in [-0.1, 0.1]\n  vec3 col = mix(bcol, ccol, smoothstep(-0.002, 0.002, d-r));\n\n  // Output to screen\n  gl_FragColor = vec4(col, 1.0);\n}\n"; // eslint-disable-line

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
