var vertexShader = "#define GLSLIFY 1\nvarying vec4 vPosition;\n\nvoid main() {\n  vPosition = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n  gl_Position = vPosition;\n}\n"; // eslint-disable-line

var fragmentShader = "#define GLSLIFY 1\nuniform vec2 iResolution;\nuniform float iTime;\nuniform float iTimeDelta;\n\nfloat hash( float n ) { return fract(sin(n)*753.5453123); }\n\n//---------------------------------------------------------------\n// value noise, and its analytical derivatives\n//---------------------------------------------------------------\n\nvec4 noised( in vec3 x ) {\n  vec3 p = floor(x);\n  vec3 w = fract(x);\n  vec3 u = w*w*w*(w*(w*6.0-15.0)+10.0);\n  vec3 du = 30.0*w*w*(w*(w-2.0)+1.0);\n\n  float n = p.x + p.y*157.0 + 113.0*p.z;\n\n  float a = hash(n+  0.0);\n  float b = hash(n+  1.0);\n  float c = hash(n+157.0);\n  float d = hash(n+158.0);\n  float e = hash(n+113.0);\n\tfloat f = hash(n+114.0);\n  float g = hash(n+270.0);\n  float h = hash(n+271.0);\n\n  float k0 =   a;\n  float k1 =   b - a;\n  float k2 =   c - a;\n  float k3 =   e - a;\n  float k4 =   a - b - c + d;\n  float k5 =   a - c - e + g;\n  float k6 =   a - b - e + f;\n  float k7 = - a + b + c - d + e - f - g + h;\n\n  return vec4( k0 + k1*u.x + k2*u.y + k3*u.z + k4*u.x*u.y + k5*u.y*u.z + k6*u.z*u.x + k7*u.x*u.y*u.z,\n               du * (vec3(k1,k2,k3) + u.yzx*vec3(k4,k5,k6) + u.zxy*vec3(k6,k4,k5) + k7*u.yzx*u.zxy ));\n}\n\nvec4 sdBox( vec3 p, vec3 b ) { // distance and normal\n  vec3 d = abs(p) - b;\n  float x = min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));\n  vec3  n = step(d.yzx,d.xyz)*step(d.zxy,d.xyz)*sign(p);\n  return vec4( x, n );\n}\n\nvec4 fbmd( in vec3 x ) {\n  const float scale  = 1.5;\n\n  float a = 0.0;\n  float b = 0.5;\n\tfloat f = 1.0;\n  vec3 d = vec3(0.0);\n  for( int i=0; i<8; i++ ) {\n    vec4 n = noised(f*x*scale);\n    a += b*n.x;           // accumulate values\n    d += b*n.yzw*f*scale; // accumulate derivatives\n    b *= 0.5;             // amplitude decrease\n    f *= 1.8;             // frequency increase\n  }\n\n\treturn vec4( a, d );\n}\n\nvec4 map( in vec3 p ) {\n\tvec4 d1 = fbmd( p );\n  d1.x -= 0.37;\n\td1.x *= 0.7;\n  d1.yzw = normalize(d1.yzw);\n\n  // clip to box\n  vec4 d2 = sdBox( p, vec3(1.5) );\n  return (d1.x>d2.x) ? d1 : d2;\n}\n\n// ray-box intersection in box space\nvec2 iBox( in vec3 ro, in vec3 rd, in vec3 rad ) {\n  vec3 m = 1.0/rd;\n  vec3 n = m*ro;\n  vec3 k = abs(m)*rad;\n  vec3 t1 = -n - k;\n  vec3 t2 = -n + k;\n\tfloat tN = max( max( t1.x, t1.y ), t1.z );\n\tfloat tF = min( min( t2.x, t2.y ), t2.z );\n\tif( tN > tF || tF < 0.0) return vec2(-1.0);\n\treturn vec2( tN, tF );\n}\n\n// raymarch\nvec4 interesect( in vec3 ro, in vec3 rd ) {\n\tvec4 res = vec4(-1.0);\n\n  // bounding volume\n  vec2 dis = iBox( ro, rd, vec3(1.5) );\n  if( dis.y<0.0 ) return res;\n\n  // raymarch\n  float tmax = dis.y;\n  float t = dis.x;\n\tfor( int i=0; i<128; i++ ) {\n    vec3 pos = ro + t*rd;\n\t\tvec4 hnor = map( pos );\n    res = vec4(t,hnor.yzw);\n\n\t\tif( hnor.x<0.001 ) break;\n\t\tt += hnor.x;\n    if( t>tmax ) break;\n\t}\n\n\tif( t>tmax ) res = vec4(-1.0);\n\treturn res;\n}\n\nvoid main() {\n  // Normalized pixel coordinates (from -1 to 1)\n\tvec2 p = (2.0 * gl_FragCoord.xy - iResolution.xy) / min(iResolution.y, iResolution.x);\n\n\t// camera anim\n  float an = 0.1*iTime;\n\tvec3 ro = 3.0*vec3( cos(an), 0.8, sin(an) );\n\tvec3 ta = vec3( 0.0 );\n\n  // camera matrix\n\tvec3 cw = normalize( ta-ro );\n\tvec3 cu = normalize( cross(cw,vec3(0.0,1.0,0.0)) );\n\tvec3 cv = normalize( cross(cu,cw) );\n\tvec3 rd = normalize( p.x*cu + p.y*cv + 1.7*cw );\n\n\t// render\n\tvec3 col = vec3(1.0);\n  vec4 tnor = interesect( ro, rd );\n  vec3 nor = tnor.yzw;\n\tfloat t = tnor.x;\n\n  if( t>0.0 ) {\n    col = mix( vec3(0.05,0.2,0.3), vec3(1.0,0.95,0.85), 0.5+0.5*nor.y );\n  }\n\n  col = sqrt(col);\n\n  gl_FragColor = vec4(col, 1.0);\n}\n"; // eslint-disable-line

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
