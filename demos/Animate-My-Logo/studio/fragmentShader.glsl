uniform vec2 iResolution;
uniform float iTime;
uniform float iTimeDelta;

#define cycle 1.5
#define scale .5
#define bg vec3(0, 0.6627451, 0.6196078)
#define PI 3.1415926
#define PI2 6.2831853

mat2 rotate(float deg) {
  return mat2(cos(deg), sin(deg), -sin(deg), cos(deg));
}

float sector(vec2 p, vec2 a, vec2 b, float width, float blur) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  vec2 dir = normalize(ba);
  float t = clamp(dot(pa, dir), 0., length(ba));
  float dist = length(pa - dir * t);
  return smoothstep(width - blur, width, dist);
}

void main() {
  // Normalized pixel coordinates (from 0 to 1)
  vec2 uv = (2.0 * gl_FragCoord.xy - iResolution.xy) / min(iResolution.y, iResolution.x);
  uv /= scale;

  // Time varying pixel color
  vec3 col = 0.5 + 0.5 * cos(iTime + uv.xyx + vec3(0, 2, 4));

  // Output to screen
  gl_FragColor = vec4(col, 1.0);
}
