// The MIT License
// Copyright © 2017 Inigo Quilez
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// Computes the analytic derivatives of a 2D Value Noise. This can be used for example to compute normals to a
// terain based on Value Noise without approximating the gradient by haveing to take central differences (see
// this shader: https://www.shadertoy.com/view/MdsSRs)

// Value    Noise 2D, Derivatives: https://www.shadertoy.com/view/4dXBRH
// Gradient Noise 2D, Derivatives: https://www.shadertoy.com/view/XdXBRH
// Value    Noise 3D, Derivatives: https://www.shadertoy.com/view/XsXfRH
// Gradient Noise 3D, Derivatives: https://www.shadertoy.com/view/4dffRH
// Value    Noise 2D             : https://www.shadertoy.com/view/lsf3WH
// Value    Noise 3D             : https://www.shadertoy.com/view/4sfGzS
// Gradient Noise 2D             : https://www.shadertoy.com/view/XdXGW8
// Gradient Noise 3D             : https://www.shadertoy.com/view/Xsl3Dl
// Simplex  Noise 2D             : https://www.shadertoy.com/view/Msf3WH

uniform vec2 iResolution;
uniform float iTime;
uniform float iTimeDelta;

float hash(in vec2 p) {
  p = 50.0 * fract(p * 0.3183099 + vec2(0.71, 0.113));
  return -1.0 + 2.0 * fract(p.x * p.y * (p.x + p.y));
}

// return value noise (in x) and its derivatives (in yz)
vec3 noised(in vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);

  // quintic interpolation
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  vec2 du = 30.0 * f * f * (f * (f - 2.0) + 1.0);

  // cubic interpolation
  // vec2 u = f*f*(3.0-2.0*f);
  // vec2 du = 6.0*f*(1.0-f);

  float va = hash(i + vec2(0.0, 0.0));
  float vb = hash(i + vec2(1.0, 0.0));
  float vc = hash(i + vec2(0.0, 1.0));
  float vd = hash(i + vec2(1.0, 1.0));

  float k0 = va;
  float k1 = vb - va;
  float k2 = vc - va;
  float k4 = va - vb - vc + vd;

  return vec3(va + (vb - va) * u.x + (vc - va) * u.y + (va - vb - vc + vd) * u.x * u.y, // value
              du * (u.yx * (va - vb - vc + vd) + vec2(vb, vc) - va));                   // derivative
}

void main() {
  // Normalized pixel coordinates (from 0 to 1)
	vec2 p = (2.0 * gl_FragCoord.xy - iResolution.xy) / min(iResolution.y, iResolution.x);

  vec3 n = noised(8.0 * p);

  vec3 col = 0.5 + 0.5 * ((p.x > 0.0) ? n.yzx : n.xxx);

  gl_FragColor = vec4(col, 1.0);
}
