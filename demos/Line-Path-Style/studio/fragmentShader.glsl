uniform vec2 iResolution;
uniform float iTime;
uniform float iTimeDelta;

#define N 20.
#define bg vec3(0, 0.6627451, 0.6196078)

#define M(x,y)             x0 = _x = x;   y0 = _y = y;
#define L(x,y)             d = min(d, line(uv, vec2(_x,_y), vec2(x,y)) ); _x=x,_y=y;
#define C(x1,y1,x2,y2,x,y) d = min(d, bezier(uv, vec2(_x,_y), vec2(x1,y1),vec2(x2,y2), vec2(x,y)) ); _x=x,_y=y;
#define Z                  d = min(d, line(uv, vec2(_x,_y), vec2(x0,y0)) );
#define m(x,y)             M(_x+x,_y+y)
#define l(x,y)             L(_x+x,_y+y)
#define c(x1,y1,x2,y2,x,y) C(_x+x1,_y+y1,_x+x2,_y+y2,_x+x,_y+y)
#define z                  Z

vec2 interpolate(vec2 G1, vec2 G2, vec2 G3, vec2 G4, float t)
{
    vec2 A = G4-G1 + 3.*(G2-G3),
         B = 3.*(G1-2.*G2+G3),
         C = 3.*(G2-G1),
         D = G1;
    return t * (t * (t * A + B) + C) + D;
}

float line(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  vec2 dir = normalize(ba);
  float t = clamp(dot(pa, dir), 0., length(ba));
  vec2 pd = pa - dir * t;
  return dot(pd, pd);
}

float bezier( vec2 uv, vec2 A, vec2 B, vec2 C, vec2 D)
{
    float d = 1e5;
    vec2 p = A;
    for (float t = 1.; t <= N; t++) {
        vec2 q = interpolate(A, B, C, D, t/N);
        float l = line(uv, p, q);
        d = min(d, l );
		p = q;
	}
	return d;
}

float path(vec2 uv, float width, float blur) {
  float d = 1e38, _x, _y, x0, y0;
  float widthDiv2 = 200. / 2.;

  M( -widthDiv2,0. );
  L( 50.-widthDiv2,100. );
  L( 100.-widthDiv2,0. );
  L( 150.-widthDiv2,100. );
  L( 200.-widthDiv2,0. );
  C( 150.-widthDiv2,-120., 50.-widthDiv2,-120., -widthDiv2,0. );

  return smoothstep(width - blur, width, sqrt(d));
}

void main() {
  vec2 coord = gl_FragCoord.xy - iResolution.xy / 2.0;

  // mix some color
  vec3 color = bg;
  float d = path(coord, 10.0, 1.0);
  color = mix(vec3(1.0), color, d);

  // Output to screen
  gl_FragColor = vec4(color, 1.0);
}
