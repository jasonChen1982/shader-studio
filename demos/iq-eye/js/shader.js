var vertexShader = "#define GLSLIFY 1\nvarying vec4 vPosition;\n\nvoid main() {\n  vPosition = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n  gl_Position = vPosition;\n}\n"; // eslint-disable-line

var fragmentShader = "#define GLSLIFY 1\n// Created by beautypi - beautypi/2012\n// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.\n\nuniform vec2 iResolution;\nuniform float iTime;\nuniform float iTimeDelta;\n\nconst mat2 m = mat2(0.80, 0.60, -0.60, 0.80);\n\nfloat hash(float n) {\n    return fract(sin(n) * 43758.5453);\n}\n\nfloat noise(in vec2 x) {\n    vec2 p = floor(x);\n    vec2 f = fract(x);\n\n    f = f * f * (3.0 - 2.0 * f);\n\n    float n = p.x + p.y * 57.0;\n\n    return mix(mix( hash(n + 0.0), hash(n + 1.0), f.x),\n               mix( hash(n + 57.0), hash(n + 58.0), f.x), f.y);\n}\n\nfloat fbm( vec2 p ) {\n    float f = 0.0;\n\n    f += 0.50000*noise( p ); p = m*p*2.02;\n    f += 0.25000*noise( p ); p = m*p*2.03;\n    f += 0.12500*noise( p ); p = m*p*2.01;\n    f += 0.06250*noise( p ); p = m*p*2.04;\n    f += 0.03125*noise( p );\n\n    return f / 0.984375;\n}\n\nfloat length2( vec2 p ) {\n    vec2 q = p*p*p*p;\n    return pow( q.x + q.y, 1.0 / 4.0 );\n}\n\nvoid main() {\n  vec2 q = gl_FragCoord.xy / iResolution.xy;\n  vec2 p = -1.0 + 2.0 * q;\n  p.x *= iResolution.x / iResolution.y;\n\n  float r = length( p );\n  float a = atan( p.y, p.x );\n\n  float dd = 0.2 * sin(4.0 * iTime);\n  float ss = 1.0 + clamp(1.0 - r, 0.0, 1.0) * dd;\n\n  r *= ss;\n\n  vec3 col = vec3(0.0, 0.3, 0.4);\n\n  float f = fbm( 5.0 * p );\n  col = mix( col, vec3(0.2, 0.5, 0.4), f );\n\n  col = mix( col, vec3(0.9, 0.6, 0.2), 1.0 - smoothstep(0.2, 0.6, r) );\n\n  a += 0.05 * fbm( 20.0 * p );\n\n  f = smoothstep( 0.3, 1.0, fbm( vec2(20.0 * a, 6.0 * r) ) );\n  col = mix( col, vec3(1.0, 1.0, 1.0), f );\n\n  f = smoothstep( 0.4, 0.9, fbm( vec2(15.0 * a,10.0 * r) ) );\n  col *= 1.0 - 0.5 * f;\n\n  col *= 1.0 - 0.25 * smoothstep( 0.6, 0.8, r );\n\n  f = 1.0 - smoothstep( 0.0, 0.6, length2( mat2(0.6, 0.8, -0.8, 0.6) * (p - vec2(0.3, 0.5) ) * vec2(1.0, 2.0)) );\n\n  col += vec3(1.0, 0.9, 0.9) * f * 0.985;\n\n  col *= vec3(0.8 + 0.2 * cos(r * a));\n\n  f = 1.0-smoothstep( 0.2, 0.25, r );\n  col = mix( col, vec3(0.0), f );\n\n  f = smoothstep( 0.79, 0.82, r );\n  col = mix( col, vec3(1.0), f );\n\n  col *= 0.5 + 0.5 * pow(16.0 * q.x * q.y * (1.0 - q.x) * (1.0 - q.y), 0.1);\n\n  gl_FragColor = vec4( col, 1.0 );\n}\n"; // eslint-disable-line

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
