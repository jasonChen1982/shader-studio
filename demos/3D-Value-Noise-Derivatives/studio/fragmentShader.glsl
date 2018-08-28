// The MIT License
// Copyright © 2017 Inigo Quilez
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


// Computes the analytic derivatives of a 3D Value Noise. This can be used for example to compute normals to a
// 3d rocks based on Value Noise without approximating the gradient by haveing to take central differences (see
// this shader: https://www.shadertoy.com/view/XttSz2)


// Value    Noise 2D, Derivatives: https://www.shadertoy.com/view/4dXBRH
// Gradient Noise 2D, Derivatives: https://www.shadertoy.com/view/XdXBRH
// Value    Noise 3D, Derivatives: https://www.shadertoy.com/view/XsXfRH
// Gradient Noise 3D, Derivatives: https://www.shadertoy.com/view/4dffRH
// Value    Noise 2D             : https://www.shadertoy.com/view/lsf3WH
// Value    Noise 3D             : https://www.shadertoy.com/view/4sfGzS
// Gradient Noise 2D             : https://www.shadertoy.com/view/XdXGW8
// Gradient Noise 3D             : https://www.shadertoy.com/view/Xsl3Dl
// Simplex  Noise 2D             : https://www.shadertoy.com/view/Msf3WH

uniform vec2 iResolution;
uniform float iTime;
uniform float iTimeDelta;

float hash(vec3 p) {
  p  = 50.0*fract( p*0.3183099 + vec3(0.71,0.113,0.419));
  return -1.0+2.0*fract( p.x*p.y*p.z*(p.x+p.y+p.z) );
}


// return value noise (in x) and its derivatives (in yzw)
vec4 noised( in vec3 x ) {
  vec3 p = floor(x);
  vec3 w = fract(x);


  // quintic interpolation
  vec3 u = w*w*w*(w*(w*6.0-15.0)+10.0);
  vec3 du = 30.0*w*w*(w*(w-2.0)+1.0);

  // cubic interpolation
  // vec3 u = w*w*(3.0-2.0*w);
  // vec3 du = 6.0*w*(1.0-w);

  float a = hash(p+vec3(0.0,0.0,0.0));
  float b = hash(p+vec3(1.0,0.0,0.0));
  float c = hash(p+vec3(0.0,1.0,0.0));
  float d = hash(p+vec3(1.0,1.0,0.0));
  float e = hash(p+vec3(0.0,0.0,1.0));
  float f = hash(p+vec3(1.0,0.0,1.0));
  float g = hash(p+vec3(0.0,1.0,1.0));
  float h = hash(p+vec3(1.0,1.0,1.0));

  float k0 =   a;
  float k1 =   b - a;
  float k2 =   c - a;
  float k3 =   e - a;
  float k4 =   a - b - c + d;
  float k5 =   a - c - e + g;
  float k6 =   a - b - e + f;
  float k7 = - a + b + c - d + e - f - g + h;

  return vec4( k0 + k1*u.x + k2*u.y + k3*u.z + k4*u.x*u.y + k5*u.y*u.z + k6*u.z*u.x + k7*u.x*u.y*u.z,
                du * vec3( k1 + k4*u.y + k6*u.z + k7*u.y*u.z,
                          k2 + k5*u.z + k4*u.x + k7*u.z*u.x,
                          k3 + k6*u.x + k5*u.y + k7*u.x*u.y ) );
}

void main() {
  // Normalized pixel coordinates (from 0 to 1)
	vec2 p = (2.0 * gl_FragCoord.xy - iResolution.xy) / min(iResolution.y, iResolution.x);

  // camera movement
	float an = 0.5*iTime;
	vec3 ro = vec3( 2.5*cos(an), 1.0, 2.5*sin(an) );
  vec3 ta = vec3( 0.0, 1.0, 0.0 );
  // camera matrix
  vec3 ww = normalize( ta - ro );
  vec3 uu = normalize( cross(ww,vec3(0.0,1.0,0.0) ) );
  vec3 vv = normalize( cross(uu,ww));
	// create view ray
	vec3 rd = normalize( p.x*uu + p.y*vv + 1.5*ww );

  // sphere center
	vec3 sc = vec3(0.0,1.0,0.0);

  // raytrace
	float tmin = 10000.0;
	vec3  nor = vec3(0.0);
	float occ = 1.0;
	vec3  pos = vec3(0.0);

	// raytrace-plane
	float h = (0.0-ro.y)/rd.y;
	if( h>0.0 ) {
		tmin = h;
		nor = vec3(0.0,1.0,0.0);
		pos = ro + h*rd;
		vec3 di = sc - pos;
		float l = length(di);
		occ = 1.0 - dot(nor,di/l)*1.0*1.0/(l*l);
	}

	// raytrace-sphere
	vec3  ce = ro - sc;
	float b = dot( rd, ce );
	float c = dot( ce, ce ) - 1.0;
	h = b*b - c;
	if( h>0.0 ) {
		h = -b - sqrt(h);
		if( h<tmin ) {
			tmin=h;
			nor = normalize(ro+h*rd-sc);
			occ = 0.5 + 0.5*nor.y;
		}
	}

  // shading/lighting
	vec3 col = vec3(0.9);
	if( tmin<100.0 ) {
    pos = ro + tmin*rd;

    vec4 n = noised( 12.0*pos );
    col = 0.5 + 0.5*((p.x>0.0)?n.yzw:n.xxx);

		col = mix( col, vec3(0.9), 1.0-exp( -0.003*tmin*tmin ) );
	}

	gl_FragColor = vec4( col, 1.0 );
}
