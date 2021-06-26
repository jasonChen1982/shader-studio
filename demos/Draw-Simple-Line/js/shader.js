var vertexShader = "#define GLSLIFY 1\nvarying vec4 vPosition;\n\nvoid main() {\n  vPosition = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n  gl_Position = vPosition;\n}\n"; // eslint-disable-line

var fragmentShader = "#define GLSLIFY 1\nuniform vec2 iResolution;\nuniform float iTime;\nuniform float iTimeDelta;\n\n#define bg vec3(0, 0.6627451, 0.6196078)\n\nfloat line(vec2 p, vec2 a, vec2 b, float width, float blur) {\n  vec2 pa = p - a;\n  vec2 ba = b - a;\n  vec2 dir = normalize(ba);\n  float t = clamp(dot(pa, dir), 0., length(ba));\n  vec2 pd = pa - dir * t;\n  float d = dot(pd, pd);\n  return smoothstep(width - blur, width, sqrt(d));\n}\n\nvoid main() {\n  // 像素坐标系，屏幕中间为(0, 0)\n  vec2 coord = gl_FragCoord.xy - iResolution.xy / 2.0;\n\n  // 颜色混合\n  vec3 color = bg;\n  float d = line(coord, vec2(-50., 0.), vec2(50., -500.), 10., 1.);\n  color = mix(vec3(1.0), color, d);\n\n  // 输出到屏幕\n  gl_FragColor = vec4(color, 1.0);\n}\n"; // eslint-disable-line

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
