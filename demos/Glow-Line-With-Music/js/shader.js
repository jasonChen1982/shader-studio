var vertexShader = "#define GLSLIFY 1\nvarying vec4 vPosition;\n\nvoid main() {\n  vPosition = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n  gl_Position = vPosition;\n}\n"; // eslint-disable-line

var fragmentShader = "#define GLSLIFY 1\nuniform vec2 iResolution;\nuniform float iTime;\nuniform float iTimeDelta;\n\n// The Universe Within - by Martijn Steinrucken aka BigWings 2018\n// countfrolic@gmail.com\n// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.\n\n// After listening to an interview with Michael Pollan on the Joe Rogan\n// podcast I got interested in mystic experiences that people seem to\n// have when using certain psycoactive substances.\n//\n// For best results, watch fullscreen, with music, in a dark room.\n//\n// I had an unused 'blockchain effect' lying around and used it as\n// a base for this effect. Uncomment the SIMPLE define to see where\n// this came from.\n//\n// Use the mouse to get some 3d parallax.\n\n// Music - Terrence McKenna Mashup - Jason Burruss Remixes\n// https://soundcloud.com/jason-burruss-remixes/terrence-mckenna-mashup\n//\n// YouTube video of this effect:\n// https://youtu.be/GAhu4ngQa48\n\n#define S(a, b, t) smoothstep(a, b, t)\n#define NUM_LAYERS 4.\n\n//#define SIMPLE\n\nfloat N21(vec2 p) {\t// Dave Hoskins - https://www.shadertoy.com/view/4djSRW\n\tvec3 p3  = fract(vec3(p.xyx) * vec3(443.897, 441.423, 437.195));\n  p3 += dot(p3, p3.yzx + 19.19);\n  return fract((p3.x + p3.y) * p3.z);\n}\n\nvec2 GetPos(vec2 id, float t) {\n  float n = N21(id);\n  float n1 = fract(n*10.);\n  float n2 = fract(n*100.);\n  float a = t+n;\n  return vec2(sin(a*n1), cos(a*n2))*.4;\n}\n\nfloat GetT(vec2 ro, vec2 rd, vec2 p) {\n\treturn dot(p-ro, rd);\n}\n\nfloat LineDist(vec3 a, vec3 b, vec3 p) {\n\treturn length(cross(b-a, p-a))/length(p-a);\n}\n\nfloat df_line( in vec2 a, in vec2 b, in vec2 p) {\n  vec2 pa = p - a, ba = b - a;\n\tfloat h = clamp(dot(pa,ba) / dot(ba,ba), 0., 1.);\n\treturn length(pa - ba * h);\n}\n\nfloat line(vec2 a, vec2 b, vec2 uv) {\n  float r1 = .02;\n  float r2 = .005;\n\n  float d = df_line(a, b, uv);\n  float d2 = length(a-b);\n  float fade = S(1.5, .5, d2);\n\n  fade += S(.05, .02, abs(d2-.75));\n  return S(r1, r2, d)*fade;\n}\n\nfloat NetLayer(vec2 st, float n, float t) {\n  vec2 id = floor(st)+n;\n\n  st = fract(st)-.5;\n\n  vec2 p = GetPos(id, t);\n  float d = length(st-p);\n  float m = 0.;\n  float sparkle = 0.;\n\n  for(float y=-1.; y<=1.; y++) {\n    for(float x=-1.; x<=1.; x++) {\n      vec2 offs = vec2(x,y);\n      vec2 p2 = offs+GetPos(id+offs, t);\n\n      m += line(p, p2, st);\n\n      d = length(st-p2);\n\n      float s = (.005/(d*d));\n      s *= S(1., .7, d);\n      float pulse = sin((p2.x-offs.x+p2.y-offs.y+t)*5.)*.4+.6;\n      pulse = pow(pulse, 20.);\n\n      s *= pulse;\n      sparkle += s;\n    }\n  }\n\n  vec2 pt = vec2(0,1)+GetPos(id+vec2(0,1), t);\n  vec2 pr = vec2(1,0)+GetPos(id+vec2(1,0), t);\n  vec2 pb = vec2(0,-1)+GetPos(id+vec2(0,-1), t);\n  vec2 pl = vec2(-1,0)+GetPos(id+vec2(-1,0), t);\n\n  m += line(pt, pr, st);\n\tm += line(pr, pb, st);\n  m += line(pb, pl, st);\n  m += line(pl, pt, st);\n\n  float sPhase = (sin(t+n)+sin(t*.1))*.25+.5;\n  sPhase += pow(sin(t*.1)*.5+.5, 50.)*5.;\n  m += sparkle*sPhase; // (*.5+.5);\n\n  return m;\n}\n\nvoid main() {\n  vec2 uv = (gl_FragCoord.xy - iResolution.xy*.5) / max(iResolution.y, iResolution.x);\n\t// vec2 uv = (2.0 * gl_FragCoord.xy - iResolution.xy) / max(iResolution.y, iResolution.x);\n\t// vec2 M = iMouse.xy/iResolution.xy-.5;\n\n  float t = iTime*.1;\n\n  float s = sin(t);\n  float c = cos(t);\n  mat2 rot = mat2(c, -s, s, c);\n  vec2 st = uv*rot;\n\t// M *= rot*2.;\n\n  float m = 0.;\n  for(float i=0.; i<1.; i+=1./NUM_LAYERS) {\n    float z = fract(t+i);\n    float size = mix(15., 1., z);\n    float fade = S(0., .6, z)*S(1., .8, z);\n\n    m += fade * NetLayer(st*size, i, iTime); // -M*z\n  }\n\n\t// float fft  = texelFetch( iChannel0, ivec2(.7,0), 0 ).x;\n  // float glow = -uv.y*fft*2.;\n\n  vec3 baseCol = vec3(s, cos(t*.4), -sin(t*.24))*.4+.6;\n  vec3 col = baseCol*m;\n  // col += baseCol;\n\n  #ifdef SIMPLE\n  uv *= 10.;\n  col = vec3(1)*NetLayer(uv, 0., iTime);\n  uv = fract(uv);\n  //if(uv.x>.98 || uv.y>.98) col += 1.;\n  #else\n  col *= 1.-dot(uv,uv);\n  t = mod(iTime, 230.);\n  col *= S(0., 20., t)*S(224., 200., t);\n  #endif\n\n  gl_FragColor = vec4(col,1);\n}\n"; // eslint-disable-line

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
