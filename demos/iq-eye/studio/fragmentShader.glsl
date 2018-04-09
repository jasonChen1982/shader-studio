uniform vec2 iResolution;
uniform float iTime;
uniform float iTimeDelta;

void main() {
  // Normalized pixel coordinates (from 0 to 1)
  vec2 uv = gl_FragCoord.xy / iResolution.xy;

  // Time varying pixel color
  vec3 col = 0.5 + 0.5 * cos(iTime + uv.xyx + vec3(0, 2, 4));

  // Output to screen
  gl_FragColor = vec4(col, 1.0);
}
