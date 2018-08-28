var vertexShader = "#define GLSLIFY 1\nvarying vec4 vPosition;\n\nvoid main() {\n  vPosition = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n  gl_Position = vPosition;\n}\n"; // eslint-disable-line

var fragmentShader = "#define GLSLIFY 1\nuniform vec2 iResolution;\nuniform float iTime;\nuniform float iTimeDelta;\n\nvoid main() {\n  // Normalized pixel coordinates (from 0 to 1)\n\tvec2 p = (2.0 * gl_FragCoord.xy - iResolution.xy) / min(iResolution.y, iResolution.x);\n\n  // background color\n  vec3 bcol = vec3(1.0, 0.8, 0.7 - 0.07 * p.y) * (1.0 - 0.25 * length(p));\n\n  // animate\n  float tt = mod(iTime, 1.5) / 1.5;\n  float ss = pow(tt, 0.2) * 0.5 + 0.5;\n  ss = 1.0 + ss * 0.5 * sin(tt * 6.2831 * 3.0 + p.y * 0.5) * exp(-tt * 4.0);\n  p *= vec2(0.5, 1.5) + ss * vec2(0.5, -0.5);\n\n  // shape\n\n  // p *= 0.8;\n  // p.y = -0.1 - p.y*1.2 + abs(p.x)*(1.0-abs(p.x));\n  // float r = length(p);\n\t// float d = 0.5;\n\n\tp.y -= 0.25;\n  float a = atan(p.x, p.y) / 3.141593;\n  float r = length(p);\n  float h = abs(a);\n  float d = (13.0 * h - 22.0 * h * h + 10.0 * h * h * h) / (6.0 - 5.0 * h);\n\n\t// color\n\tfloat s = 0.75 + 0.75 * p.x;\n\ts *= 1.0 - 0.4 * r;\n\ts = 0.3 + 0.7 * s;\n\ts *= 0.5 + 0.5 * pow( 1.0 - clamp(r/d, 0.0, 1.0 ), 0.1 );\n\tvec3 hcol = vec3(1.0, 0.5 * r, 0.3) * s;\n\n  vec3 col = mix(bcol, hcol, smoothstep(-0.01, 0.01, d-r));\n\n  gl_FragColor = vec4(col, 1.0);\n}\n"; // eslint-disable-line

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
