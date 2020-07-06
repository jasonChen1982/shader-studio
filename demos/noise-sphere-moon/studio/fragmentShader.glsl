uniform vec2 iResolution;
uniform float iTime;
uniform float iTimeDelta;

float hash( float n ) { return fract(sin(n)*753.5453123); }


//---------------------------------------------------------------
// value noise, and its analytical derivatives
//---------------------------------------------------------------

vec4 noised( in vec3 x ) {
  vec3 p = floor(x);
  vec3 w = fract(x);
  vec3 u = w*w*w*(w*(w*6.0-15.0)+10.0);
  vec3 du = 30.0*w*w*(w*(w-2.0)+1.0);

  float n = p.x + p.y*157.0 + 113.0*p.z;

  float a = hash(n+  0.0);
  float b = hash(n+  1.0);
  float c = hash(n+157.0);
  float d = hash(n+158.0);
  float e = hash(n+113.0);
	float f = hash(n+114.0);
  float g = hash(n+270.0);
  float h = hash(n+271.0);

  float k0 =   a;
  float k1 =   b - a;
  float k2 =   c - a;
  float k3 =   e - a;
  float k4 =   a - b - c + d;
  float k5 =   a - c - e + g;
  float k6 =   a - b - e + f;
  float k7 = - a + b + c - d + e - f - g + h;

  return vec4( k0 + k1*u.x + k2*u.y + k3*u.z + k4*u.x*u.y + k5*u.y*u.z + k6*u.z*u.x + k7*u.x*u.y*u.z,
               du * (vec3(k1,k2,k3) + u.yzx*vec3(k4,k5,k6) + u.zxy*vec3(k6,k4,k5) + k7*u.yzx*u.zxy ));
}

vec4 sdBox( vec3 p, vec3 b ) { // distance and normal
  vec3 d = abs(p) - b;
  float x = min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
  vec3  n = step(d.yzx,d.xyz)*step(d.zxy,d.xyz)*sign(p);
  return vec4( x, n );
}

vec4 fbmd( in vec3 x ) {
  const float scale  = 1.5;

  float a = 0.0;
  float b = 0.5;
	float f = 1.0;
  vec3 d = vec3(0.0);
  for( int i=0; i<8; i++ ) {
    vec4 n = noised(f*x*scale);
    a += b*n.x;           // accumulate values
    d += b*n.yzw*f*scale; // accumulate derivatives
    b *= 0.5;             // amplitude decrease
    f *= 1.8;             // frequency increase
  }

	return vec4( a, d );
}

vec4 map( in vec3 p ) {
	vec4 d1 = fbmd( p );
  d1.x -= 0.37;
	d1.x *= 0.7;
  d1.yzw = normalize(d1.yzw);

  // clip to box
  vec4 d2 = sdBox( p, vec3(1.5) );
  return (d1.x>d2.x) ? d1 : d2;
}

// ray-box intersection in box space
vec2 iBox( in vec3 ro, in vec3 rd, in vec3 rad ) {
  vec3 m = 1.0/rd;
  vec3 n = m*ro;
  vec3 k = abs(m)*rad;
  vec3 t1 = -n - k;
  vec3 t2 = -n + k;
	float tN = max( max( t1.x, t1.y ), t1.z );
	float tF = min( min( t2.x, t2.y ), t2.z );
	if( tN > tF || tF < 0.0) return vec2(-1.0);
	return vec2( tN, tF );
}

// raymarch
vec4 interesect( in vec3 ro, in vec3 rd ) {
	vec4 res = vec4(-1.0);

  // bounding volume
  vec2 dis = iBox( ro, rd, vec3(1.5) );
  if( dis.y<0.0 ) return res;

  // raymarch
  float tmax = dis.y;
  float t = dis.x;
	for( int i=0; i<128; i++ ) {
    vec3 pos = ro + t*rd;
		vec4 hnor = map( pos );
    res = vec4(t,hnor.yzw);

		if( hnor.x<0.001 ) break;
		t += hnor.x;
    if( t>tmax ) break;
	}

	if( t>tmax ) res = vec4(-1.0);
	return res;
}

void main() {
  // Normalized pixel coordinates (from -1 to 1)
	vec2 p = (2.0 * gl_FragCoord.xy - iResolution.xy) / min(iResolution.y, iResolution.x);

	// camera anim
  float an = 0.1*iTime;
	vec3 ro = 3.0*vec3( cos(an), 0.8, sin(an) );
	vec3 ta = vec3( 0.0 );

  // camera matrix
	vec3 cw = normalize( ta-ro );
	vec3 cu = normalize( cross(cw,vec3(0.0,1.0,0.0)) );
	vec3 cv = normalize( cross(cu,cw) );
	vec3 rd = normalize( p.x*cu + p.y*cv + 1.7*cw );

	// render
	vec3 col = vec3(1.0);
  vec4 tnor = interesect( ro, rd );
  vec3 nor = tnor.yzw;
	float t = tnor.x;

  if( t>0.0 ) {
    col = mix( vec3(0.05,0.2,0.3), vec3(1.0,0.95,0.85), 0.5+0.5*nor.y );
  }

  col = sqrt(col);

  gl_FragColor = vec4(col, 1.0);
}
