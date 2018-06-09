uniform vec2 iResolution;
uniform float iTime;
uniform float iTimeDelta;
#define cycle 1.5
#define PI 3.1415926

void main() {
  // Normalized pixel coordinates (from 0 to 1)
	vec2 p = (2.0 * gl_FragCoord.xy - iResolution.xy) / min(iResolution.y, iResolution.x);

  // background color
  vec3 bcol = vec3(0.29412, 0.70196, 0.63921) * (1.0 - 0.3 * length(p));

  // animate
  float tt = mod(iTime, cycle) / cycle;
  float ss = 1.0 + 0.5 * sin(tt * PI * 6.0 + p.y * 0.5) * exp(-tt * 4.0);
  p *= vec2(0.7, 1.5) + ss * vec2(0.3, -0.5);

  // draw a circle area
  float r = length(p);
	float d = 0.5;

  // set color
	vec3 ccol = vec3(1.0, 1.0, 1.0);

  // merge background color and circle color, with a mix effect when d-r in [-0.1, 0.1]
  vec3 col = mix(bcol, ccol, smoothstep(-0.002, 0.002, d-r));

  // Output to screen
  gl_FragColor = vec4(col, 1.0);
}
