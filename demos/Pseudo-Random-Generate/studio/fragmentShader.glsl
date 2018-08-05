uniform vec2 iResolution;
uniform float iTime;
uniform float iTimeDelta;

// makes a pseudorandom number between 0 and 1
float hash(float n) {
  return fract(sin(n)*93942.234);
}

// smoothsteps a grid of random numbers at the integers
float noise(vec2 p) {
  vec2 w = floor(p);
  vec2 k = fract(p);
  k = k*k*(3.-2.*k); // smooth it

  float n = w.x*10. + w.y*48.;

  float a = hash(n);
  float b = hash(n+10.);
  float c = hash(n+48.);
  float d = hash(n+58.);

  return mix(
    mix(a, b, k.x),
    mix(c, d, k.x),
    k.y);
}

// rotation matrix
mat2 m = mat2(0.6,0.8,-0.8,0.6);

vec2 hash2( float n ) {
    return fract(sin(vec2(n,n+1.0))*vec2(13.5453123,31.1459123));
}

const mat2 mtx = mat2( 0.80,  0.60, -0.60,  0.80 );

float fbm4( vec2 p ) {
    float f = 0.0;

    f += 0.5000*(-1.0+2.0*noise( p )); p = mtx*p*2.02;
    f += 0.2500*(-1.0+2.0*noise( p )); p = mtx*p*2.03;
    f += 0.1250*(-1.0+2.0*noise( p )); p = mtx*p*2.01;
    f += 0.0625*(-1.0+2.0*noise( p ));

    return f/0.9375;
}

float fbm6( vec2 p ) {
    float f = 0.0;

    f += 0.500000*noise( p ); p = mtx*p*2.02;
    f += 0.250000*noise( p ); p = mtx*p*2.03;
    f += 0.125000*noise( p ); p = mtx*p*2.01;
    f += 0.062500*noise( p ); p = mtx*p*2.04;
    f += 0.031250*noise( p ); p = mtx*p*2.01;
    f += 0.015625*noise( p );

    return f/0.96875;
}

float func( vec2 q, out vec2 o, out vec2 n ) {
    float ql = length( q );
    q.x += 0.05*sin(0.11*iTime+ql*4.0);
    q.y += 0.05*sin(0.13*iTime+ql*4.0);
    q *= 0.7 + 0.2*cos(0.05*iTime);

    q = (q+1.0)*0.5;

    o.x = 0.5 + 0.5*fbm4( vec2(2.0*q*vec2(1.0,1.0)          )  );
    o.y = 0.5 + 0.5*fbm4( vec2(2.0*q*vec2(1.0,1.0)+vec2(5.2))  );

    float ol = length( o );
    o.x += 0.02*sin(0.11*iTime*ol)/ol;
    o.y += 0.02*sin(0.13*iTime*ol)/ol;


    n.x = fbm6( vec2(4.0*o*vec2(1.0,1.0)+vec2(9.2))  );
    n.y = fbm6( vec2(4.0*o*vec2(1.0,1.0)+vec2(5.7))  );

    vec2 p = 4.0*q + 4.0*n;

    float f = 0.5 + 0.5*fbm4( p );

    f = mix( f, f*f*f*3.5, f*abs(n.x) );

    float g = 0.5+0.5*sin(4.0*p.x)*sin(4.0*p.y);
    f *= 1.0-0.5*pow( g, 8.0 );

    return f;
}

float funcs( in vec2 q ) {
    vec2 t1, t2;
    return func(q,t1,t2);
}


void main() {
  // Normalized pixel coordinates (from 0 to 1)
  vec2 p = gl_FragCoord.xy / iResolution.xy;
  vec2 of = hash2( float(iTime)*1113.1 + gl_FragCoord.x + gl_FragCoord.y*119.1 );
	vec2 q = (-iResolution.xy + 2.0*(gl_FragCoord.xy+of)) /iResolution.y;

  vec2 o, n;
  float f = func(q, o, n);
  vec3 col = vec3(0.0);


  col = mix( vec3(0.002,0.9,0.9), vec3(0.01,0.8,0.8), f );
  col = mix( col, vec3(0.9,0.9,0.9), dot(n,n) );
  col = mix( col, vec3(0.5,0.2,0.2), 0.5*o.y*o.y );


  col = mix( col, vec3(0.0,0.2,0.4), 0.5*smoothstep(1.2,1.3,abs(n.y)+abs(n.x)) );

  col *= f*2.0;

  vec2 ex = vec2( 1.0 / iResolution.x, 0.0 );
  vec2 ey = vec2( 0.0, 1.0 / iResolution.y );
	vec3 nor = normalize( vec3( funcs(q+ex) - f, ex.x, funcs(q+ey) - f ) );

  vec3 lig = normalize( vec3( 0.9, -0.2, -0.4 ) );
  float dif = clamp( 0.3+0.7*dot( nor, lig ), 0.0, 1.0 );

  vec3 bdrf;
  bdrf  = vec3(0.85,0.90,0.95)*(nor.y*0.5+0.5);
  bdrf += vec3(0.15,0.10,0.05)*dif;

  bdrf  = vec3(0.85,0.90,0.95)*(nor.y*0.5+0.5);
  bdrf += vec3(0.15,0.10,0.05)*dif;

  col *= bdrf;

  col = vec3(1.0)-col;

  col = col*col;

  col *= vec3(1.2,1.25,1.2);

	col *= 0.5 + 0.5 * sqrt(16.0*p.x*p.y*(1.0-p.x)*(1.0-p.y));

  // Output to screen
  gl_FragColor = vec4(col, 1.0);
}
