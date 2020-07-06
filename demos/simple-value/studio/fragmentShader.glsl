uniform vec2 iResolution;
uniform float iTime;
uniform float iTimeDelta;

#define PI 3.1415926
#define PI2 6.2831853

mat2 rotate(float deg) {
  return mat2(cos(deg), sin(deg), -sin(deg), cos(deg));
}

void main() {
  // Normalized pixel coordinates (from 0 to 1)
  vec2 uv = gl_FragCoord.xy / iResolution.xy;

  uv = rotate( iTime/40.0*PI2 ) * uv;

  // Time varying pixel color
  vec3 col = 0.5 + 0.5 * cos(iTime + uv.xyx + vec3(0, 2, 4));

  // Output to screen
  gl_FragColor = vec4(col, 1.0);
}
