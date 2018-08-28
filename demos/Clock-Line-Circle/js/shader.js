var vertexShader = "#define GLSLIFY 1\nvarying vec4 vPosition;\n\nvoid main() {\n  vPosition = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n  gl_Position = vPosition;\n}\n"; // eslint-disable-line

var fragmentShader = "#define GLSLIFY 1\nuniform vec2 iResolution;\nuniform float iTime;\nuniform float iTimeDelta;\n\nuniform float iHour;\nuniform float iMinute;\nuniform float iSecond;\n\n#define cycle 1.5\n#define scale .5\n#define bg vec3(0, 0.6627451, 0.6196078)\n#define PI 3.1415926\n#define PI2 6.2831853\n\nmat2 rotate(float deg) {\n  return mat2(cos(deg), sin(deg), -sin(deg), cos(deg));\n}\n\nfloat line(vec2 p, vec2 a, vec2 b, float width, float blur) {\n  vec2 pa = p - a;\n  vec2 ba = b - a;\n  vec2 dir = normalize(ba);\n  float t = clamp(dot(pa, dir), 0., length(ba));\n  float dist = length(pa - dir * t);\n  return smoothstep(width - blur, width, dist);\n}\n\nvec3 hourPointer(vec2 uv, vec3 color, float time) {\n  float rate = fract(time / 12.0);\n  mat2 m = rotate(rate * PI2);\n  float d = line(uv, vec2(0,-0.03) * m, vec2(0,0.3) * m, 0.02, 0.005);\n  color = mix(vec3(0), color, d);\n  return color;\n}\nvec3 minutePointer(vec2 uv, vec3 color, float time) {\n  float rate = fract(time / 60.0);\n  mat2 m = rotate(rate * PI2);\n  float d = line(uv, vec2(0,-0.04) * m, vec2(0,0.4) * m, 0.015, 0.005);\n  color = mix(vec3(0), color, d);\n  return color;\n}\nvec3 secondPointer(vec2 uv, vec3 color, float time) {\n  float rate = fract(time / 60.0);\n  mat2 m = rotate(rate * PI2);\n  float d = line(uv, vec2(0,-0.05) * m, vec2(0,0.5) * m, 0.005, 0.005);\n  color = mix(vec3(0.9921568,0.0666667,0.0666667), color, d);\n  return color;\n}\n\nfloat circle(vec2 p, vec2 c, float radius, float blur) {\n  vec2 pc = p - c;\n  float dist = length(pc);\n  return smoothstep(radius - blur, radius, dist);\n}\n\nvec3 plate(vec2 uv, vec3 color) {\n  float d1 = circle(uv, vec2(0), 0.7, 0.005);\n  float d2 = circle(uv, vec2(0), 0.63, 0.005);\n\n  color = mix(vec3(0.4039215, 0.8235294, 0.7843137), color, d1);\n  color = mix(vec3(1), color, d2);\n\n  float r = length(uv);\n  float a = atan(uv.x, uv.y);\n  float ss = PI / 30.;\n  float hs = PI / 6.;\n  float st = fract(a / ss);\n  float mst = min(abs(1.-st), st);\n  float ht = fract(a / hs);\n  float mht = min(abs(1.-ht), ht);\n\n  if (r > 0.58 && r < 0.6 && mst < 0.06) {\n    float sd = smoothstep(0.06 - 0.03, 0.06, mst);\n    color = mix(vec3(0), color, sd);\n  }\n  if (r > 0.55 && r < 0.6 && mht < 0.1) {\n    float hd = smoothstep(0.1 - 0.03, 0.1, mst);\n    color = mix(vec3(0), color, hd);\n  }\n\n  return color;\n}\n\nvec3 shadow(vec2 uv, vec3 color, vec2 c, vec2 d, float dist) {\n  d = normalize(d);\n  float l = dot(uv, d);\n  float w = length(uv - d * l);\n  float rate = l / dist;\n  if (w > 0.7 || rate <= 0. || rate >= 1.) return color;\n\n  vec3 pm = mix(color, vec3(0), 0.12);\n  color = mix(pm, color, rate);\n  return color;\n}\n\nvoid main() {\n  // Normalized pixel coordinates (from 0 to 1)\n  vec2 uv = (2.0 * gl_FragCoord.xy - iResolution.xy) / min(iResolution.y, iResolution.x);\n  uv /= scale;\n\n  // animate\n  float tt = mod(iTime, cycle) / cycle;\n  float ss = 1.0 + 0.5 * sin(tt * PI * 6.0 + uv.y * 0.5) * exp(-tt * 4.0);\n  uv *= vec2(0.7, 1.5) + ss * vec2(0.3, -0.5);\n\n  // mix some color\n  vec3 color = bg;\n  color = plate(uv, color);\n  color = hourPointer(uv, color, iHour);\n  color = minutePointer(uv, color, iMinute);\n  color = secondPointer(uv, color, iSecond);\n  color = shadow(uv, color, vec2(0), vec2(1, -1), 1.4);\n\n  // Output to screen\n  gl_FragColor = vec4(color, 1.0);\n}\n"; // eslint-disable-line

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
    iHour: {
      value: 0.0
    },
    iMinute: {
      value: 0.0
    },
    iSecond: {
      value: 0.0
    },
  },

  vertexShader: vertexShader,

  fragmentShader: fragmentShader

};
