var vertexShader = "#define GLSLIFY 1\nvarying vec4 vPosition;\n\nvoid main() {\n  vPosition = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n  gl_Position = vPosition;\n}\n"; // eslint-disable-line

var fragmentShader = "#define GLSLIFY 1\nuniform vec2 iResolution;\nuniform float iTime;\nuniform float iTimeDelta;\n\n// The MIT License\n// Copyright © 2013 Inigo Quilez\n// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the \"Software\"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n\n// Value Noise (http://en.wikipedia.org/wiki/Value_noise), not to be confused with Perlin's\n// Noise, is probably the simplest way to generate noise (a random smooth signal with\n// mostly all its energy in the low frequencies) suitable for procedural texturing/shading,\n// modeling and animation.\n//\n// It produces lowe quality noise than Gradient Noise (https://www.shadertoy.com/view/XdXGW8)\n// but it is slightly faster to compute. When used in a fractal construction, the blockyness\n// of Value Noise gets qcuikly hidden, making it a very popular alternative to Gradient Noise.\n//\n// The principle is to create a virtual grid/latice all over the plane, and assign one\n// random value to every vertex in the grid. When querying/requesting a noise value at\n// an arbitrary point in the plane, the grid cell in which the query is performed is\n// determined (line 30), the four vertices of the grid are determined and their random\n// value fetched (lines 35 to 38) and then bilinearly interpolated (lines 35 to 38 again)\n// with a smooth interpolant (line 31 and 33).\n\n// Value    Noise 2D, Derivatives: https://www.shadertoy.com/view/4dXBRH\n// Gradient Noise 2D, Derivatives: https://www.shadertoy.com/view/XdXBRH\n// Value    Noise 3D, Derivatives: https://www.shadertoy.com/view/XsXfRH\n// Gradient Noise 3D, Derivatives: https://www.shadertoy.com/view/4dffRH\n// Value    Noise 2D             : https://www.shadertoy.com/view/lsf3WH\n// Value    Noise 3D             : https://www.shadertoy.com/view/4sfGzS\n// Gradient Noise 2D             : https://www.shadertoy.com/view/XdXGW8\n// Gradient Noise 3D             : https://www.shadertoy.com/view/Xsl3Dl\n// Simplex  Noise 2D             : https://www.shadertoy.com/view/Msf3WH\n// Wave     Noise 2D             : https://www.shadertoy.com/view/tldSRj\n\n// varying vec2 vUv;\n\n#define PI 3.1415926\n#define PI2 6.2831853\n\nmat2 rotate(float deg) {\n  return mat2(cos(deg), sin(deg), -sin(deg), cos(deg));\n}\n\nfloat hash(vec2 p) {\n  float h = dot(p,vec2(127.1,311.7));\n  return -1.0 + 2.0*fract(sin(h)*43758.5453123);\n}\n\n// cheap value noise https://www.shadertoy.com/view/lsf3WH\nfloat noise(in vec2 p) {\n  vec2 i = floor( p );\n  vec2 f = fract( p );\n\n  vec2 u = f*f*(3.0-2.0*f);\n\n  // return i.y;\n  return mix( mix( hash( i + vec2(0.0,0.0) ),\n                   hash( i + vec2(1.0,0.0) ), u.x),\n              mix( hash( i + vec2(0.0,1.0) ),\n                   hash( i + vec2(1.0,1.0) ), u.x), u.y);\n}\n\nvoid main() {\n  vec2 p = gl_FragCoord.xy / iResolution.xy;\n\n\tvec2 uv = p*vec2(iResolution.x/iResolution.y,1.0);\n\n  // rotate uv space\n  uv -= 0.5;\n  uv = uv * rotate( iTime/40.0*6.2831853 );\n  uv += 0.5;\n\n  // 4 corner grad blue/pink\n  vec3 col1 = vec3(uv,1.0);\n\n  // 4 corner grad pink/orang\n  vec3 col2 = vec3(1.0,uv);\n\n  // mix over time\n  float t = abs(2.0 * fract(iTime/10.0) - 1.0);\n  vec3 col = mix(col1,col2,t);\n\n  // noise clouds additive blend\n  // f returns in -1 - 1 range\n  // simple 1 octave\n  float tn = iTime/5.0;\n  vec2 uvn = uv * 20.0; // noise scale\n  float f  = noise( uvn + tn);\n  f *= 0.8;\n  col += f;\n  // darker\n  col -= 0.4;\n\n  gl_FragColor = vec4(vec3(f), 1.0);\n}\n"; // eslint-disable-line

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
