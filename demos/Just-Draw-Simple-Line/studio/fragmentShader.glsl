uniform vec2 iResolution;
uniform float iTime;
uniform float iTimeDelta;

float Line(vec2 p, vec2 a, vec2 b, float width, float blur) {
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

  // Get more smooth edge and setting line width
  float l1 = Line(uv, vec2(-0.5), vec2(0.5), .1, 0.01);
  float l2= Line(uv, vec2(-0.5, 0.5), vec2(0.5, -0.5), .1, 0.01);

  // union all lines
  float m = min(l1, l2);

  // setting background color
  vec3 bg = vec3(0.2549, 0.7215, 0.5098);

  // setting frontground color
  vec3 front = vec3(1);

  // mix bg-front color
  vec3 col = mix(front, bg, m);

  // Output to screen
  gl_FragColor = vec4(col, 1.0);
}
