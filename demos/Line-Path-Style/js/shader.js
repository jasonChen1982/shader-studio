var vertexShader = "#define GLSLIFY 1\nvarying vec4 vPosition;\n\nvoid main() {\n  vPosition = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n  gl_Position = vPosition;\n}\n"; // eslint-disable-line

var fragmentShader = "#define GLSLIFY 1\nuniform vec2 iResolution;\nuniform float iTime;\nuniform float iTimeDelta;\n\n#define N 20.\n#define bg vec3(0, 0.6627451, 0.6196078)\n\n#define M(x,y)             x0 = _x = x;   y0 = _y = y;\n#define L(x,y)             d = min(d, line(uv, vec2(_x,_y), vec2(x,y)) ); _x=x,_y=y;\n#define C(x1,y1,x2,y2,x,y) d = min(d, bezier(uv, vec2(_x,_y), vec2(x1,y1),vec2(x2,y2), vec2(x,y)) ); _x=x,_y=y;\n#define Z                  d = min(d, line(uv, vec2(_x,_y), vec2(x0,y0)) );\n#define m(x,y)             M(_x+x,_y+y)\n#define l(x,y)             L(_x+x,_y+y)\n#define c(x1,y1,x2,y2,x,y) C(_x+x1,_y+y1,_x+x2,_y+y2,_x+x,_y+y)\n#define z                  Z\n\nvec2 interpolate(vec2 G1, vec2 G2, vec2 G3, vec2 G4, float t)\n{\n    vec2 A = G4-G1 + 3.*(G2-G3),\n         B = 3.*(G1-2.*G2+G3),\n         C = 3.*(G2-G1),\n         D = G1;\n    return t * (t * (t * A + B) + C) + D;\n}\n\nfloat line(vec2 p, vec2 a, vec2 b) {\n  vec2 pa = p - a;\n  vec2 ba = b - a;\n  vec2 dir = normalize(ba);\n  float t = clamp(dot(pa, dir), 0., length(ba));\n  vec2 pd = pa - dir * t;\n  return dot(pd, pd);\n}\n\nfloat bezier( vec2 uv, vec2 A, vec2 B, vec2 C, vec2 D)\n{\n    float d = 1e5;\n    vec2 p = A;\n    for (float t = 1.; t <= N; t++) {\n        vec2 q = interpolate(A, B, C, D, t/N);\n        float l = line(uv, p, q);\n        d = min(d, l );\n\t\tp = q;\n\t}\n\treturn d;\n}\n\nfloat path(vec2 uv, float width, float blur) {\n  float d = 1e38, _x, _y, x0, y0;\n  float widthDiv2 = 200. / 2.;\n\n  M( -widthDiv2,0. );\n  L( 50.-widthDiv2,100. );\n  L( 100.-widthDiv2,0. );\n  L( 150.-widthDiv2,100. );\n  L( 200.-widthDiv2,0. );\n  C( 150.-widthDiv2,-120., 50.-widthDiv2,-120., -widthDiv2,0. );\n\n  return smoothstep(width - blur, width, sqrt(d));\n}\n\nvoid main() {\n  vec2 coord = gl_FragCoord.xy - iResolution.xy / 2.0;\n\n  // mix some color\n  vec3 color = bg;\n  float d = path(coord, 10.0, 1.0);\n  color = mix(vec3(1.0), color, d);\n\n  // Output to screen\n  gl_FragColor = vec4(color, 1.0);\n}\n"; // eslint-disable-line

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
