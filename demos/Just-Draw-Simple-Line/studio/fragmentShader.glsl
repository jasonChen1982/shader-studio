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

// Assemble an error pattern use line function
float errorPattern(vec2 uv, vec2 pos, float length, float thickness, float blur) {
  float hl = length / 2.;
  float l1 = Line(uv, vec2(pos-hl), vec2(pos+hl), thickness, blur);
  float l2= Line(uv, vec2(pos.x-hl, pos.y+hl), vec2(pos.x+hl, pos.y-hl), thickness, blur);
  return min(l1, l2);
}

void main() {
  // Normalized pixel coordinates (from 0 to 1)
	vec2 uv = (2.0 * gl_FragCoord.xy - iResolution.xy) / min(iResolution.y, iResolution.x);

  // draw a error icon
  vec2 ep = vec2(-1., 0.);
  float m = errorPattern(uv, ep, .5, .04, .007);

  // Time varying pixel color as a background color
  vec2 buv = gl_FragCoord.xy / iResolution.xy;
  vec3 bg = 0.5 + 0.5 * cos(iTime + buv.xyx + vec3(0, 2, 4));
  bg = max(bg, vec3(0.4, 0, 0.4));

  // setting frontground color
  vec2 fuv = fract((uv - ep) / 0.7 + 0.5);
  vec3 front = 0.5 + 0.5 * cos(iTime + fuv.xyx + vec3(4, 0, 2));
  front = max(front, vec3(0.4, 0, 0.4));

  // mix bg-front color
  vec3 col = mix(front, bg, m);

  // Output to screen
  gl_FragColor = vec4(col, 1.0);
}
