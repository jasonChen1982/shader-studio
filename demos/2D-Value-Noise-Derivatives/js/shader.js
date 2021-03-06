var vertexShader = "#define GLSLIFY 1\nvarying vec4 vPosition;\n\nvoid main() {\n  vPosition = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n  gl_Position = vPosition;\n}\n"; // eslint-disable-line

var fragmentShader = "#define GLSLIFY 1\n// The MIT License\n// Copyright © 2017 Inigo Quilez\n// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the \"Software\"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n\n// Computes the analytic derivatives of a 2D Value Noise. This can be used for example to compute normals to a\n// terain based on Value Noise without approximating the gradient by haveing to take central differences (see\n// this shader: https://www.shadertoy.com/view/MdsSRs)\n\n// Value    Noise 2D, Derivatives: https://www.shadertoy.com/view/4dXBRH\n// Gradient Noise 2D, Derivatives: https://www.shadertoy.com/view/XdXBRH\n// Value    Noise 3D, Derivatives: https://www.shadertoy.com/view/XsXfRH\n// Gradient Noise 3D, Derivatives: https://www.shadertoy.com/view/4dffRH\n// Value    Noise 2D             : https://www.shadertoy.com/view/lsf3WH\n// Value    Noise 3D             : https://www.shadertoy.com/view/4sfGzS\n// Gradient Noise 2D             : https://www.shadertoy.com/view/XdXGW8\n// Gradient Noise 3D             : https://www.shadertoy.com/view/Xsl3Dl\n// Simplex  Noise 2D             : https://www.shadertoy.com/view/Msf3WH\n\nuniform vec2 iResolution;\nuniform float iTime;\nuniform float iTimeDelta;\n\nfloat hash(in vec2 p) {\n  p = 50.0 * fract(p * 0.3183099 + vec2(0.71, 0.113));\n  return -1.0 + 2.0 * fract(p.x * p.y * (p.x + p.y));\n}\n\n// return value noise (in x) and its derivatives (in yz)\nvec3 noised(in vec2 p) {\n  vec2 i = floor(p);\n  vec2 f = fract(p);\n\n  // quintic interpolation\n  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);\n  vec2 du = 30.0 * f * f * (f * (f - 2.0) + 1.0);\n\n  // cubic interpolation\n  // vec2 u = f*f*(3.0-2.0*f);\n  // vec2 du = 6.0*f*(1.0-f);\n\n  float va = hash(i + vec2(0.0, 0.0));\n  float vb = hash(i + vec2(1.0, 0.0));\n  float vc = hash(i + vec2(0.0, 1.0));\n  float vd = hash(i + vec2(1.0, 1.0));\n\n  float k0 = va;\n  float k1 = vb - va;\n  float k2 = vc - va;\n  float k4 = va - vb - vc + vd;\n\n  return vec3(va + (vb - va) * u.x + (vc - va) * u.y + (va - vb - vc + vd) * u.x * u.y, // value\n              du * (u.yx * (va - vb - vc + vd) + vec2(vb, vc) - va));                   // derivative\n}\n\nvoid main() {\n  // Normalized pixel coordinates (from 0 to 1)\n\tvec2 p = (2.0 * gl_FragCoord.xy - iResolution.xy) / min(iResolution.y, iResolution.x);\n\n  vec3 n = noised(8.0 * p);\n\n  vec3 col = 0.5 + 0.5 * ((p.x > 0.0) ? n.yzx : n.xxx);\n\n  gl_FragColor = vec4(col, 1.0);\n}\n"; // eslint-disable-line

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
