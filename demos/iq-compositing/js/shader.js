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

  vertexShader: "\nvarying vec4 vPosition;\n\nvoid main() {\n  vPosition = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n  gl_Position = vPosition;\n}\n",

  fragmentShader: "uniform vec2 iResolution;\nuniform float iTime;\nuniform float iTimeDelta;\n\n// void main() {\n//   // Normalized pixel coordinates (from 0 to 1)\n//   vec2 uv = gl_FragCoord.xy / iResolution.xy;\n\n//   // Time varying pixel color\n//   vec3 col = 0.5 + 0.5 * cos(iTime + uv.xyx + vec3(0, 2, 4));\n\n//   // Output to screen\n//   gl_FragColor = vec4(col, 1.0);\n// }\n\n// The MIT License\n// Copyright © 2017 Inigo Quilez\n// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the \"Software\"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n\n// Compares compositing layers back to front and front to back. Inspired by ollj's https://www.shadertoy.com/view/4tscRf\n\n\n// enable to try back_to_front compositing\n//#define BACK_TO_FRONT\n\n\n\nconst float kGamma = 2.2;   // set this to 1.0 to see the wrong way to blend colors (the way Photoshop does)\n\nvec4 over( in vec4 a, in vec4 b ) {\n  return a + b*(1.0-a.w);\n}\n\nvec4 gamma2linear_premultalpha( vec4 c ) {\n  return vec4( pow( c.xyz, vec3(kGamma) )*c.w, c.w);\n}\n\nvec4 linear2gamma_premultalpha( vec4 c ) {\n  return vec4( pow(c.xyz/c.w,vec3(1.0/kGamma) ), 1.0 );\n}\n\nvoid main() {\n\tvec2 u = (2.0 * gl_FragCoord.xy - iResolution.xy) / min(iResolution.y, iResolution.x);\n\n  // patterns\n  float patChecker = mod(floor(3.0*u.x)+floor(3.0*u.y),2.0);\n  float patCircle1 = 1.0-smoothstep(-0.2,0.2,length(u-.4*sin(0.43*iTime+vec2(0.0,1.0)))-0.7);\n  float patCircle2 = 1.0-smoothstep(-0.2,0.2,length(u-.4*sin(0.41*iTime+vec2(3.0,2.0)))-0.7);\n  float patCircle3 = 1.0-smoothstep(-0.2,0.2,length(u-.4*sin(0.53*iTime+vec2(4.0,1.0)))-0.7);\n\n  // colors. Note gamma and premultiplication\n  vec4 c0 = gamma2linear_premultalpha(vec4(vec3(patChecker*.2+.7),1.0));\n  vec4 c1 = gamma2linear_premultalpha(vec4(.9,.1,.1,patCircle1));\n  vec4 c2 = gamma2linear_premultalpha(vec4(.1,.9,.1,patCircle2));\n  vec4 c3 = gamma2linear_premultalpha(vec4(.1,.1,.9,patCircle3));\n\n  vec4 cr;\n\n  // Compositing of layers!\n  //  First, back to front\n  //  Second, front to back\n  // These two versions below should result in the same image\n\n  #ifdef BACK_TO_FRONT\n    cr = c0;           // checkers background\n    cr = over(c1,cr);  // cover with red circle\n    cr = over(c2,cr);  // cover with green circle\n    cr = over(c3,cr);  // cover with blue circle\n  #else\n    cr = c3;           // blue circle\n    cr = over(cr,c2);  // over green circle\n    cr = over(cr,c1);  // over red circle\n    cr = over(cr,c0);  // over checkers background\n  #endif\n\n  // undo premultiply and gamma, for display\n  gl_FragColor = linear2gamma_premultalpha( cr );\n}\n"

};
