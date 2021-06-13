var vertexShader = "#define GLSLIFY 1\nvarying vec4 vPosition;\n\nvoid main() {\n  vPosition = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n  gl_Position = vPosition;\n}\n"; // eslint-disable-line

var fragmentShader = "#define GLSLIFY 1\nuniform vec2 iResolution;\nuniform float iTime;\nuniform float iTimeDelta;\n\n// makes a pseudorandom number between 0 and 1\nfloat hash(float n) {\n  return fract(sin(n));\n}\n\n// smoothsteps a grid of random numbers at the integers\nfloat noise(vec2 p) {\n  vec2 w = floor(p);\n  vec2 k = fract(p);\n  k = k*k*(3.-2.*k); // smooth it\n\n  float n = w.x*10. + w.y*48.;\n\n  float a = hash(n);\n  float b = hash(n+10.);\n  float c = hash(n+48.);\n  float d = hash(n+58.);\n\n  return mix(\n    mix(a, b, k.x),\n    mix(c, d, k.x),\n    k.y);\n}\n\n// float hash(vec2 p)  // replace this by something better\n// {\n//     p  = 5.0*fract( p*0.3183099 + vec2(0.71,0.113));\n//     return fract( p.x*p.y*(p.x+p.y) );\n// }\n\n// float noise( in vec2 p )\n// {\n//     vec2 i = floor( p );\n//     vec2 f = fract( p );\n\n// \tvec2 u = f*f*(3.0-2.0*f);\n\n//     return mix( mix( hash( i + vec2(0.0,0.0) ),\n//                      hash( i + vec2(1.0,0.0) ), u.x),\n//                 mix( hash( i + vec2(0.0,1.0) ),\n//                      hash( i + vec2(1.0,1.0) ), u.x), u.y);\n// }\n\n// rotation matrix\nmat2 m = mat2(0.6,0.8,-0.8,0.6);\n\nvec2 hash2( float n ) {\n    return fract(sin(vec2(n,n+1.0))*vec2(13.5453123,31.1459123));\n}\n\nconst mat2 mtx = mat2( 0.80,  0.60, -0.60,  0.80 );\n\nfloat fbm4( vec2 p ) {\n    float f = 0.0;\n\n    f += 0.5000*(-1.0+2.0*noise( p )); p = mtx*p*2.02;\n    f += 0.2500*(-1.0+2.0*noise( p )); p = mtx*p*2.03;\n    f += 0.1250*(-1.0+2.0*noise( p )); p = mtx*p*2.01;\n    f += 0.0625*(-1.0+2.0*noise( p ));\n\n    return f/0.9375;\n}\n\nfloat fbm6( vec2 p ) {\n    float f = 0.0;\n\n    f += 0.500000*noise( p ); p = mtx*p*2.02;\n    f += 0.250000*noise( p ); p = mtx*p*2.03;\n    f += 0.125000*noise( p ); p = mtx*p*2.01;\n    f += 0.062500*noise( p ); p = mtx*p*2.04;\n    f += 0.031250*noise( p ); p = mtx*p*2.01;\n    f += 0.015625*noise( p );\n\n    return f/0.96875;\n}\n\nfloat func( vec2 q, out vec2 o, out vec2 n ) {\n    float ql = length( q );\n    q.x += 0.05*sin(0.11*iTime+ql*4.0);\n    q.y += 0.05*sin(0.13*iTime+ql*4.0);\n    q *= 0.7 + 0.2*cos(0.05*iTime);\n\n    q = (q+1.0)*0.5;\n\n    o.x = 0.5 + 0.5*fbm4( vec2(2.0*q*vec2(1.0,1.0)          )  );\n    o.y = 0.5 + 0.5*fbm4( vec2(2.0*q*vec2(1.0,1.0)+vec2(5.2))  );\n\n    float ol = length( o );\n    o.x += 0.02*sin(0.11*iTime*ol)/ol;\n    o.y += 0.02*sin(0.13*iTime*ol)/ol;\n\n    n.x = fbm6( vec2(4.0*o*vec2(1.0,1.0)+vec2(9.2))  );\n    n.y = fbm6( vec2(4.0*o*vec2(1.0,1.0)+vec2(5.7))  );\n\n    vec2 p = 4.0*q + 4.0*n;\n\n    float f = 0.5 + 0.5*fbm4( p );\n\n    f = mix( f, f*f*f*3.5, f*abs(n.x) );\n\n    float g = 0.5+0.5*sin(4.0*p.x)*sin(4.0*p.y);\n    f *= 1.0-0.5*pow( g, 8.0 );\n\n    return f;\n}\n\nfloat funcs( in vec2 q ) {\n    vec2 t1, t2;\n    return func(q,t1,t2);\n}\n\nvoid main() {\n  // Normalized pixel coordinates (from 0 to 1)\n  vec2 p = gl_FragCoord.xy / iResolution.xy;\n  vec2 of = hash2( float(iTime)*1113.1 + gl_FragCoord.x + gl_FragCoord.y*119.1 );\n\tvec2 q = (-iResolution.xy + 2.0*(gl_FragCoord.xy+of)) /iResolution.y;\n\n  vec2 o, n;\n  float f = func(q, o, n);\n  vec3 col = vec3(0.0);\n\n  col = mix( vec3(0.002,0.9,0.9), vec3(0.01,0.8,0.8), f );\n  col = mix( col, vec3(0.9,0.9,0.9), dot(n,n) );\n  col = mix( col, vec3(0.5,0.2,0.2), 0.5*o.y*o.y );\n\n  col = mix( col, vec3(0.0,0.2,0.4), 0.5*smoothstep(1.2,1.3,abs(n.y)+abs(n.x)) );\n\n  col *= f*2.0;\n\n  vec2 ex = vec2( 1.0 / iResolution.x, 0.0 );\n  vec2 ey = vec2( 0.0, 1.0 / iResolution.y );\n\tvec3 nor = normalize( vec3( funcs(q+ex) - f, ex.x, funcs(q+ey) - f ) );\n\n  vec3 lig = normalize( vec3( 0.9, -0.2, -0.4 ) );\n  float dif = clamp( 0.3+0.7*dot( nor, lig ), 0.0, 1.0 );\n\n  vec3 bdrf;\n  bdrf  = vec3(0.85,0.90,0.95)*(nor.y*0.5+0.5);\n  bdrf += vec3(0.15,0.10,0.05)*dif;\n\n  bdrf  = vec3(0.85,0.90,0.95)*(nor.y*0.5+0.5);\n  bdrf += vec3(0.15,0.10,0.05)*dif;\n\n  col *= bdrf;\n\n  col = vec3(1.0)-col;\n\n  col = col*col;\n\n  col *= vec3(1.2,1.25,1.2);\n\n\tcol *= 0.5 + 0.5 * sqrt(16.0*p.x*p.y*(1.0-p.x)*(1.0-p.y));\n\n  // Output to screen\n  gl_FragColor = vec4(col, 1.0);\n}\n"; // eslint-disable-line

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
