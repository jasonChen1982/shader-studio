var vertexShader = "#define GLSLIFY 1\nvarying vec4 vPosition;\n\nvoid main() {\n  vPosition = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n  gl_Position = vPosition;\n}\n"; // eslint-disable-line

var fragmentShader = "#define GLSLIFY 1\nuniform vec2 iResolution;\nuniform float iTime;\nuniform float iTimeDelta;\n\nvec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ) {\n  return a + b*cos( 6.28318*(c*t+d) );\n}\n\nvoid main() {\n  // Normalized pixel coordinates (from 0 to 1)\n  vec2 p = gl_FragCoord.xy / iResolution.xy;\n\n  // animate\n  p.x += 0.01*iTime;\n\n  // compute colors\n  vec3                  col = pal( p.x, vec3(0.5,0.5,0.5), vec3(0.5,0.5,0.5), vec3(1.0,1.0,1.0), vec3(0.0,0.33,0.67) );\n  if( p.y > (1.0/7.0) ) col = pal( p.x, vec3(0.5,0.5,0.5), vec3(0.5,0.5,0.5), vec3(1.0,1.0,1.0), vec3(0.0,0.10,0.20) );\n  if( p.y > (2.0/7.0) ) col = pal( p.x, vec3(0.5,0.5,0.5), vec3(0.5,0.5,0.5), vec3(1.0,1.0,1.0), vec3(0.3,0.20,0.20) );\n  if( p.y > (3.0/7.0) ) col = pal( p.x, vec3(0.5,0.5,0.5), vec3(0.5,0.5,0.5), vec3(1.0,1.0,0.5), vec3(0.8,0.90,0.30) );\n  if( p.y > (4.0/7.0) ) col = pal( p.x, vec3(0.5,0.5,0.5), vec3(0.5,0.5,0.5), vec3(1.0,0.7,0.4), vec3(0.0,0.15,0.20) );\n  if( p.y > (5.0/7.0) ) col = pal( p.x, vec3(0.5,0.5,0.5), vec3(0.5,0.5,0.5), vec3(2.0,1.0,0.0), vec3(0.5,0.20,0.25) );\n  if( p.y > (6.0/7.0) ) col = pal( p.x, vec3(0.8,0.5,0.4), vec3(0.2,0.4,0.2), vec3(2.0,1.0,1.0), vec3(0.0,0.25,0.25) );\n\n  // band\n  float f = fract(p.y*7.0);\n  // borders\n  col *= smoothstep( 0.49, 0.47, abs(f-0.5) );\n  // shadowing\n  col *= 0.5 + 0.5*sqrt(4.0*f*(1.0-f));\n  // dithering\n  // col += (1.0/255.0)*texture( iChannel0, gl_FragCoord.xy/iChannelResolution[0].xy ).xyz;\n\n\tgl_FragColor = vec4( col, 1.0 );\n}\n"; // eslint-disable-line

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
