var vertexShader = "#define GLSLIFY 1\nvarying vec4 vPosition;\n\nvoid main() {\n  vPosition = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n  gl_Position = vPosition;\n}\n"; // eslint-disable-line

var fragmentShader = "#define GLSLIFY 1\n// The MIT License\n// Copyright © 2017 Inigo Quilez\n// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the \"Software\"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n\n// Computes the analytic derivatives of a 2D Gradient Noise\n\n// Value    Noise 2D, Derivatives: https://www.shadertoy.com/view/4dXBRH\n// Gradient Noise 2D, Derivatives: https://www.shadertoy.com/view/XdXBRH\n// Value    Noise 3D, Derivatives: https://www.shadertoy.com/view/XsXfRH\n// Gradient Noise 3D, Derivatives: https://www.shadertoy.com/view/4dffRH\n// Value    Noise 2D             : https://www.shadertoy.com/view/lsf3WH\n// Value    Noise 3D             : https://www.shadertoy.com/view/4sfGzS\n// Gradient Noise 2D             : https://www.shadertoy.com/view/XdXGW8\n// Gradient Noise 3D             : https://www.shadertoy.com/view/Xsl3Dl\n// Simplex  Noise 2D             : https://www.shadertoy.com/view/Msf3WH\n\nuniform vec2 iResolution;\nuniform float iTime;\nuniform float iTimeDelta;\n\nvec2 hash( in vec2 x ) {\n  const vec2 k = vec2( 0.3183099, 0.3678794 );\n  x = x*k + k.yx;\n  return -1.0 + 2.0*fract( 16.0 * k*fract( x.x*x.y*(x.x+x.y)) );\n}\n\nmat2 rotate(float deg) {\n  return mat2(cos(deg), sin(deg), -sin(deg), cos(deg));\n}\n\n// return gradient noise (in x) and its derivatives (in yz)\nvec3 noised( in vec2 p ) {\n  vec2 i = floor( p );\n  vec2 f = fract( p );\n\n  // quintic interpolation\n  vec2 u = f*f*f*(f*(f*6.0-15.0)+10.0);\n  vec2 du = 30.0*f*f*(f*(f-2.0)+1.0);\n\n  // cubic interpolation\n  // vec2 u = f*f*(3.0-2.0*f);\n  // vec2 du = 6.0*f*(1.0-f);\n\n  vec2 ga = hash( i + vec2(0.0,0.0) );\n  vec2 gb = hash( i + vec2(1.0,0.0) );\n  vec2 gc = hash( i + vec2(0.0,1.0) );\n  vec2 gd = hash( i + vec2(1.0,1.0) );\n\n  float va = dot( ga, f - vec2(0.0,0.0) );\n  float vb = dot( gb, f - vec2(1.0,0.0) );\n  float vc = dot( gc, f - vec2(0.0,1.0) );\n  float vd = dot( gd, f - vec2(1.0,1.0) );\n\n  return vec3(va + u.x*(vb-va) + u.y*(vc-va) + u.x*u.y*(va-vb-vc+vd),   // value\n              ga + u.x*(gb-ga) + u.y*(gc-ga) + u.x*u.y*(ga-gb-gc+gd) +  // derivatives\n              du * (u.yx*(va-vb-vc+vd) + vec2(vb,vc) - va));\n}\n\nvoid main() {\n  // Normalized pixel coordinates (from 0 to 1)\n\tvec2 p = (2.0 * gl_FragCoord.xy - iResolution.xy) / min(iResolution.y, iResolution.x);\n  p = p * rotate( iTime/41.0*6.2831853 );\n\n  vec3 n = noised(8.0 * p);\n\n  vec3 col = 0.5 + 0.5 * ((p.x > 0.0) ? n.yzx : n.xxx);\n\n  gl_FragColor = vec4(col, 1.0);\n}\n"; // eslint-disable-line

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
