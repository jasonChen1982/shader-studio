// improved version of https://www.shadertoy.com/view/MlVSWc
// === SVG Player ====      short spec: https://www.w3.org/TR/2008/REC-SVGTiny12-20081222/paths.html

#define N 20.  // splines discretization. Lower it on slow GPUs
// absolute main SVG commands
#define M(x,y)             x0 = _x = x;   y0 = _y = y;
#define L(x,y)             d = min(d, line(uv, vec2(_x,_y), vec2(x,y)) ); _x=x,_y=y;
#define C(x1,y1,x2,y2,x,y) d = min(d, bezier(uv, vec2(_x,_y), vec2(x1,y1),vec2(x2,y2), vec2(x,y)) ); _x=x,_y=y;
#define H(x)               d = min(d, line(uv, vec2(_x,_y), vec2(x,_y)) ); _x=x;
#define V(y)               d = min(d, line(uv, vec2(_x,_y), vec2(_x,y)) ); _y=y;
#define Z                  d = min(d, line(uv, vec2(_x,_y), vec2(x0,y0)) );
// relative main SVG commands
#define m(x,y)             M(_x+x,_y+y)
#define l(x,y)             L(_x+x,_y+y)
#define c(x1,y1,x2,y2,x,y) C(_x+x1,_y+y1,_x+x2,_y+y2,_x+x,_y+y)
#define h(x)               H(_x+x)
#define v(y)               V(_y+y)
#define z                  Z

#define style(f,c)         fill=f; S=1.; COL = mod(vec4((c)/65536,(c)/256,c,1),256.)/255.;
#define path(cmd)          d = 1e38; cmd; draw(d,O);

float bezier(vec2,vec2,vec2,vec2,vec2);
float line(vec2,vec2,vec2);
void  draw(float,inout vec4);
const float FILL=1., CONTOUR=0.;
vec4 COL = vec4(0); float fill=FILL, S=1., contrast=1.;  // style state
float d = 1e38;   // global to allow unique distance field

// === SVG drawing ===============================================================
void SVG(vec2 uv, inout vec4 O)
{
    float _x, _y, x0, y0; // d = 1e38;
    uv *= 400.;                             // scaling
    contrast = 1.;

// Copy-paste your SVG pathes here.  Slight adaptations :
//  - add () around command params and  comma between points,
//  - split polylines and polybéziers into sets of 1 vs 3 pairs of coordinates
//  - path( style( FILL/CONTOUR, color(hexa) )
//          commands
//        )

// nvidia logo from https://upload.wikimedia.org/wikipedia/fr/4/47/Nvidia_%28logo%29.svg

    path( style(FILL,0x74b71b)              // left exterior arc
        M( 82.2115,102.414  )
        C( 82.2115,102.414, 104.7155,69.211, 149.6485,65.777 )
        L( 149.6485,53.73   )
        C( 99.8795,57.727, 56.7818,99.879,  56.7818,99.879   )
        C( 56.7818,99.879, 81.1915,170.445, 149.6485,176.906 )
        L( 149.6485,164.102 )
        C( 99.4105,157.781, 82.2115,102.414, 82.2115,102.414 )
        z
    )

    path( style(FILL,0x74b71b)            // left interior arc
    	M( 149.6485,138.637 )
    	L( 149.6485,150.363 )
    	C( 111.6805,143.594, 101.1415,104.125, 101.1415,104.125 )
    	C( 101.1415,104.125, 119.3715,83.93,   149.6485,80.656  )
    	L( 149.6485,93.523  )
    	C( 149.6255,93.523, 149.6095,93.516,  149.5905,93.516   )
    	C( 133.6995,91.609, 121.2855,106.453,  121.2855,106.453 )
    	C( 121.2855,106.453, 128.2425,131.445, 149.6485,138.637 )
    )

    path( style(FILL,0x74b71b)            // right main plate
    	M( 149.6485,31.512  )
    	L( 149.6485,53.73   )
    	C( 151.1095,53.617,  152.5705,53.523,  154.0395,53.473  )
    	C( 210.6215,51.566,  247.4885,99.879,  247.4885,99.879  )
    	C( 247.4885,99.879,  205.1455,151.367, 161.0315,151.367 )
    	C( 156.9885,151.367, 153.2035,150.992, 149.6485,150.363 )
    	L( 149.6485,164.102 )
    	C( 152.6885,164.488, 155.8405,164.715, 159.1295,164.715 )
    	C( 200.1805,164.715, 229.8675,143.75,  258.6135,118.937 )
    	C( 263.3795,122.754, 282.8915,132.039, 286.9025,136.105 )
    	C( 259.5705,158.988, 195.8715,177.434, 159.7585,177.434 )
    	C( 156.2775,177.434, 152.9345,177.223, 149.6485,176.906 )
    	L( 149.6485,196.211 )
    	L( 305.6805,196.211 )
    	L( 305.6805,31.512  )
    	L( 149.6485,31.512  )
    	z
    )

    path( style(FILL,0x74b71b)            // right interior arc
    	M( 149.6485,80.656  )
    	L( 149.6485,65.777  )
    	C( 151.0945,65.676, 152.5515,65.598, 154.0395,65.551     )
    	C( 194.7275,64.273, 221.4225,100.516, 221.4225,100.516   )
    	C( 221.4225,100.516, 192.5905,140.559, 161.6765,140.559  )
    	C( 157.2275,140.559, 153.2385,139.844, 149.6485,138.637  )
    	L( 149.6485,93.523  )
    	C( 165.4885,95.437, 168.6765,102.434, 178.1995,118.309   )
    	L( 199.3795,100.449 )
    	C( 199.3795,100.449, 183.9185,80.172, 157.8555,80.172    )
    	C( 155.0205,80.172, 152.3095,80.371, 149.6485,80.656     )
    )
}

// --- spline interpolation ( inspired from revers https://www.shadertoy.com/view/MlGSz3 )
vec2 interpolate(vec2 G1, vec2 G2, vec2 G3, vec2 G4, float t)
{
    vec2 A = G4-G1 + 3.*(G2-G3),
         B = 3.*(G1-2.*G2+G3),
         C = 3.*(G2-G1),
         D = G1;
    return t * (t * (t * A + B) + C) + D;
}


float line(vec2 p, vec2 a, vec2 b)
{
	vec2 pa = p - a, ba = b - a,
	     d = pa - ba * clamp(dot(pa, ba) / dot(ba, ba) , 0., 1.); // distance to segment
    if  ( (a.y>p.y) != (b.y>p.y) &&
           pa.x < ba.x * pa.y / ba.y ) S = -S;     // track interior vs exterior
	return dot(d,d); //length(d);                  // optimization by deferring sqrt
}
// interior detection (sign S): ( thanks TimoKinnunen https://www.shadertoy.com/view/4lySWd )
// see http://web.archive.org/web/20161116163747/https://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html - previously on https://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

float bezier( vec2 uv, vec2 A, vec2 B, vec2 C, vec2 D)
{
    //float d = 1e5;                               // for global field
    vec2 p = A;
    for (float t = 1.; t <= N; t++) {
        vec2 q = interpolate(A, B, C, D, t/N);
        float l = line(uv, p, q);
        d = min(d, l );
		p = q;
	}
	return d;
}

void draw(float d, inout vec4 O)
{
    d = min(sqrt(d)*contrast*2.,1.);             // optimization by deferring sqrt here
    O = mix(COL, O, fill>0. ? .5+.5*S*d : d);    // paint
}

void mainImage(out vec4 O, vec2 U)
{
    O = vec4(1);
    vec2 R = iResolution.xy;
    U.y = R.y-U.y; U /= R.x;
	SVG( U, O );
}
