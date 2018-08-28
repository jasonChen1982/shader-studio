var vertexShader = "#define GLSLIFY 1\nvarying vec4 vPosition;\n\nvoid main() {\n  vPosition = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n  gl_Position = vPosition;\n}\n"; // eslint-disable-line

var fragmentShader = "#define GLSLIFY 1\nuniform vec2 iResolution;\nuniform float iTime;\nuniform float iTimeDelta;\n\n// Created by inigo quilez - iq/2013\n// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.\n\n// Volumetric clouds. It performs level of detail (LOD) for faster rendering\n\nfloat noise( in vec3 x ) {\n  vec3 p = floor(x);\n  vec3 f = fract(x);\n\tf = f*f*(3.0-2.0*f);\n\n#if 1\n\tvec2 uv = (p.xy+vec2(37.0,17.0)*p.z) + f.xy;\n  vec2 rg = textureLod( iChannel0, (uv+ 0.5)/256.0, 0. ).yx;\n#else\n  ivec3 q = ivec3(p);\n\tivec2 uv = q.xy + ivec2(37,17)*q.z;\n\n\tvec2 rg = mix( mix( texelFetch( iChannel0, (uv           )&255, 0 ),\n\t\t\t\t         texelFetch( iChannel0, (uv+ivec2(1,0))&255, 0 ), f.x ),\n\t\t\t\t    mix( texelFetch( iChannel0, (uv+ivec2(0,1))&255, 0 ),\n\t\t\t\t         texelFetch( iChannel0, (uv+ivec2(1,1))&255, 0 ), f.x ), f.y ).yx;\n#endif\n\treturn -1.0+2.0*mix( rg.x, rg.y, f.z );\n}\n\nfloat map5( in vec3 p ) {\n\tvec3 q = p - vec3(0.0,0.1,1.0)*iTime;\n\tfloat f;\n  f  = 0.50000*noise( q ); q = q*2.02;\n  f += 0.25000*noise( q ); q = q*2.03;\n  f += 0.12500*noise( q ); q = q*2.01;\n  f += 0.06250*noise( q ); q = q*2.02;\n  f += 0.03125*noise( q );\n\treturn clamp( 1.5 - p.y - 2.0 + 1.75*f, 0.0, 1.0 );\n}\n\nfloat map4( in vec3 p ) {\n\tvec3 q = p - vec3(0.0,0.1,1.0)*iTime;\n\tfloat f;\n  f  = 0.50000*noise( q ); q = q*2.02;\n  f += 0.25000*noise( q ); q = q*2.03;\n  f += 0.12500*noise( q ); q = q*2.01;\n  f += 0.06250*noise( q );\n\treturn clamp( 1.5 - p.y - 2.0 + 1.75*f, 0.0, 1.0 );\n}\nfloat map3( in vec3 p ) {\n\tvec3 q = p - vec3(0.0,0.1,1.0)*iTime;\n\tfloat f;\n  f  = 0.50000*noise( q ); q = q*2.02;\n  f += 0.25000*noise( q ); q = q*2.03;\n  f += 0.12500*noise( q );\n\treturn clamp( 1.5 - p.y - 2.0 + 1.75*f, 0.0, 1.0 );\n}\nfloat map2( in vec3 p ) {\n\tvec3 q = p - vec3(0.0,0.1,1.0)*iTime;\n\tfloat f;\n  f  = 0.50000*noise( q ); q = q*2.02;\n  f += 0.25000*noise( q );;\n\treturn clamp( 1.5 - p.y - 2.0 + 1.75*f, 0.0, 1.0 );\n}\n\nvec3 sundir = normalize( vec3(-1.0,0.0,-1.0) );\n\nvec4 integrate( in vec4 sum, in float dif, in float den, in vec3 bgcol, in float t ) {\n  // lighting\n  vec3 lin = vec3(0.65,0.7,0.75)*1.4 + vec3(1.0, 0.6, 0.3)*dif;\n  vec4 col = vec4( mix( vec3(1.0,0.95,0.8), vec3(0.25,0.3,0.35), den ), den );\n  col.xyz *= lin;\n  col.xyz = mix( col.xyz, bgcol, 1.0-exp(-0.003*t*t) );\n  // front to back blending\n  col.a *= 0.4;\n  col.rgb *= col.a;\n  return sum + col*(1.0-sum.a);\n}\n\n#define MARCH(STEPS,MAPLOD) for(int i=0; i<STEPS; i++) { vec3  pos = ro + t*rd; if( pos.y<-3.0 || pos.y>2.0 || sum.a > 0.99 ) break; float den = MAPLOD( pos ); if( den>0.01 ) { float dif =  clamp((den - MAPLOD(pos+0.3*sundir))/0.6, 0.0, 1.0 ); sum = integrate( sum, dif, den, bgcol, t ); } t += max(0.05,0.02*t); }\n\nvec4 raymarch( in vec3 ro, in vec3 rd, in vec3 bgcol, in ivec2 px ) {\n\tvec4 sum = vec4(0.0);\n\n\tfloat t = 0.0;//0.05*texelFetch( iChannel0, px&255, 0 ).x;\n\n  MARCH(30,map5);\n  MARCH(30,map4);\n  MARCH(30,map3);\n  MARCH(30,map2);\n\n  return clamp( sum, 0.0, 1.0 );\n}\n\nmat3 setCamera( in vec3 ro, in vec3 ta, float cr ) {\n\tvec3 cw = normalize(ta-ro);\n\tvec3 cp = vec3(sin(cr), cos(cr),0.0);\n\tvec3 cu = normalize( cross(cw,cp) );\n\tvec3 cv = normalize( cross(cu,cw) );\n  return mat3( cu, cv, cw );\n}\n\nvec4 render( in vec3 ro, in vec3 rd, in ivec2 px ) {\n  // background sky\n\tfloat sun = clamp( dot(sundir,rd), 0.0, 1.0 );\n\tvec3 col = vec3(0.6,0.71,0.75) - rd.y*0.2*vec3(1.0,0.5,1.0) + 0.15*0.5;\n\tcol += 0.2*vec3(1.0,.6,0.1)*pow( sun, 8.0 );\n\n  // clouds\n  vec4 res = raymarch( ro, rd, col, px );\n  col = col*(1.0-res.w) + res.xyz;\n\n  // sun glare\n\tcol += 0.2*vec3(1.0,0.4,0.2)*pow( sun, 3.0 );\n\n  return vec4( col, 1.0 );\n}\n\nvoid main() {\n  vec2 p = (-iResolution.xy + 2.0*gl_FragCoord.xy)/ iResolution.y;\n\n  vec2 m = iMouse.xy/iResolution.xy;\n\n  // camera\n  vec3 ro = 4.0*normalize(vec3(sin(3.0*m.x), 0.4*m.y, cos(3.0*m.x)));\n\tvec3 ta = vec3(0.0, -1.0, 0.0);\n  mat3 ca = setCamera( ro, ta, 0.0 );\n  // ray\n  vec3 rd = ca * normalize( vec3(p.xy,1.5));\n\n  gl_FragColor = render( ro, rd, ivec2(gl_FragCoord-0.5) );\n}\n"; // eslint-disable-line

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
