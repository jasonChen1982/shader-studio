var vertexShader = "#define GLSLIFY 1\nvarying vec4 vPosition;\n\nvoid main() {\n  vPosition = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n  gl_Position = vPosition;\n}\n"; // eslint-disable-line

var fragmentShader = "#define GLSLIFY 1\nuniform vec2 iResolution;\nuniform float iTime;\nuniform float iTimeDelta;\n\nfloat Line(vec2 p, vec2 a, vec2 b, float width, float blur) {\n  vec2 pa = p - a;\n  vec2 ba = b - a;\n  vec2 dir = normalize(ba);\n  float t = clamp(dot(pa, dir), 0., length(ba));\n  float dist = length(pa - dir * t);\n  return smoothstep(width - blur, width, dist);\n}\n\n// Assemble an error pattern use line function\nfloat errorPattern(vec2 uv, vec2 pos, float length, float thickness, float blur) {\n  float hl = length / 2.;\n  float l1 = Line(uv, vec2(pos-hl), vec2(pos+hl), thickness, blur);\n  float l2= Line(uv, vec2(pos.x-hl, pos.y+hl), vec2(pos.x+hl, pos.y-hl), thickness, blur);\n  return min(l1, l2);\n}\n\nvoid main() {\n  // Normalized pixel coordinates (from 0 to 1)\n\tvec2 uv = (2.0 * gl_FragCoord.xy - iResolution.xy) / min(iResolution.y, iResolution.x);\n\n  // draw a error icon\n  vec2 ep = vec2(-1., 0.);\n  float m = errorPattern(uv, ep, .5, .04, .007);\n\n  // Time varying pixel color as a background color\n  vec2 buv = gl_FragCoord.xy / iResolution.xy;\n  vec3 bg = 0.5 + 0.5 * cos(iTime + buv.xyx + vec3(0, 2, 4));\n  bg = max(bg, vec3(0.4, 0, 0.4));\n\n  // setting frontground color\n  vec2 fuv = fract((uv - ep) / 0.7 + 0.5);\n  vec3 front = 0.5 + 0.5 * cos(iTime + fuv.xyx + vec3(4, 0, 2));\n  front = max(front, vec3(0.4, 0, 0.4));\n\n  // mix bg-front color\n  vec3 col = mix(front, bg, m);\n\n  // Output to screen\n  gl_FragColor = vec4(col, 1.0);\n}\n"; // eslint-disable-line

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
