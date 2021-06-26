uniform vec2 iResolution;
uniform float iTime;
uniform float iTimeDelta;

#define bg vec3(0, 0.6627451, 0.6196078)

float line(vec2 p, vec2 a, vec2 b, float width, float blur) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  vec2 dir = normalize(ba);
  float t = clamp(dot(pa, dir), 0., length(ba));
  vec2 pd = pa - dir * t;
  float d = dot(pd, pd);
  return smoothstep(width - blur, width, sqrt(d));
}

void main() {
  // 像素坐标系，屏幕中间为(0, 0)
  vec2 coord = gl_FragCoord.xy - iResolution.xy / 2.0;

  // 颜色混合
  vec3 color = bg;
  float d = line(coord, vec2(-50., 0.), vec2(50., -500.), 10., 1.);
  color = mix(vec3(1.0), color, d);

  // 输出到屏幕
  gl_FragColor = vec4(color, 1.0);
}
