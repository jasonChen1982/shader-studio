var vertexShader = "#define GLSLIFY 1\nvarying vec4 vPosition;\n\nvoid main() {\n  vPosition = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n  gl_Position = vPosition;\n}\n"; // eslint-disable-line

var fragmentShader = "#define GLSLIFY 1\nuniform vec2 iResolution;\nuniform float iTime;\nuniform float iTimeDelta;\n\nfloat snoise(vec3 uv, float res) {\n\tvec3 s = vec3(1e0, 1e2, 1e3);\n\n\tuv *= res;\n\n\tvec3 uv0 = floor(mod(uv, res))*s;\n\tvec3 uv1 = floor(mod(uv+vec3(1.), res))*s;\n\n\tvec3 f = fract(uv);\n  f = f*f*(3.0-2.0*f);\n\n\tvec4 v = vec4(uv0.x+uv0.y+uv0.z, uv1.x+uv0.y+uv0.z,\n\t\t      \t    uv0.x+uv1.y+uv0.z, uv1.x+uv1.y+uv0.z);\n\n\tvec4 r = fract(sin(v*1e-1)*1e3);\n\tfloat r0 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);\n\n\tr = fract(sin((v + uv1.z - uv0.z)*1e-1)*1e3);\n\tfloat r1 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);\n\n\treturn mix(r0, r1, f.z)*2.-1.;\n}\n\nvoid main() {\n\tvec2 p = -.5 + gl_FragCoord.xy / iResolution.xy;\n\tp.x *= iResolution.x/iResolution.y;\n\n\tfloat color = 3.0 - (3.*length(2.*p));\n\n  // float z = fract(0.0001*iTime);\n  // float size = mix(5., 0., z);\n\n\tvec3 coord = vec3(atan(p.x,p.y)/6.2832+.5, length(p)*.4, .5);\n\n\tfor (int i = 1; i <= 7; i++) {\n\t\tfloat power = pow(2.0, float(i));\n\t\tcolor += (1.5 / power) * snoise(coord + vec3(0.,-iTime*.05, iTime*.01), power*16.);\n\t}\n\tgl_FragColor = vec4( color, pow(max(color,0.),2.)*0.4, pow(max(color,0.),3.)*0.15 , 1.0);\n}\n"; // eslint-disable-line

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
