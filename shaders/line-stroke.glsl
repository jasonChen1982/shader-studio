// revers: This is fork of iq's "Fourier - interpolation" [ https://www.shadertoy.com/view/4lGSDw ].
//         It compares Fourier (green line) with Catmull-Rom (black line) interpolation.
//         Fourier version produces more round shape, but is slower (over 3 times on my video card)
//         than Catmull-Rom.
//
//         Comment out SHOW_CATMULL_ROM / SHOW_FOURIER to see a single curve.


// Created by inigo quilez - iq/2017
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

// A set of 38 points gets interpolated by computing the DFT (Discrete Fourier Transform)
// and then its inverse, and evaluating the it at more than 38 points. This results in
// an interpolation sort of made of cosine/sine waves. Would be nice to do a regular
// Hermite spline interpolation as well to compare.
//
// More info: http://www.iquilezles.org/www/articles/fourier/fourier.htm
//
// Original drawing (kind of), here:
// https://mir-s3-cdn-cf.behance.net/project_modules/disp/831a237863325.560b2e6f92480.png



//--------------------------------------------------------------------------------------
// Additions by revers:

#define SHOW_CATMULL_ROM
#define SHOW_FOURIER

/**
 * Tension. Default Catmul-Rom matrix
 * has tension equal to 0.5.
 *
 * Values below 0.5 will cause sharp edges,
 * values above 0.5 will produce more curly lines.
 */
#define T 0.7

/**
 * Catmull-Rom Matrix
 */
const mat4 CRM = mat4(-T,        2.0 - T,  T - 2.0,         T,
                       2.0 * T,  T - 3.0,  3.0 - 2.0 * T,  -T,
                      -T,        0.0,      T,               0.0,
                       0.0,      1.0,      0.0,             0.0);
/**
 * Catmull-Rom Spline Interpolation
 */
vec2 interpolate(vec2 G1, vec2 G2, vec2 G3, vec2 G4, float t) {
    vec2 A = G1 * CRM[0][0] + G2 * CRM[0][1] + G3 * CRM[0][2] + G4 * CRM[0][3];
    vec2 B = G1 * CRM[1][0] + G2 * CRM[1][1] + G3 * CRM[1][2] + G4 * CRM[1][3];
    vec2 C = G1 * CRM[2][0] + G2 * CRM[2][1] + G3 * CRM[2][2] + G4 * CRM[2][3];
    vec2 D = G1 * CRM[3][0] + G2 * CRM[3][1] + G3 * CRM[3][2] + G4 * CRM[3][3];

    return t * (t * (t * A + B) + C) + D;
}
//=======================================================================================

float sdSegmentSq(vec2 p, vec2 a, vec2 b) {
	vec2 pa = p - a, ba = b - a;
	float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
	vec2 d = pa - ba * h;
	return dot(d, d);
}

float sdPointSq(vec2 p, vec2 a) {
	vec2 d = p - a;
	return dot(d, d);
}

vec2 cmul(vec2 a, vec2 b) {
	return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}

void mainImage(out vec4 fragColor, vec2 fragCoord) {
	float e = 1.0 / iResolution.x;
	vec2 uv = fragCoord / iResolution.x;

    vec3 col = vec3(1.0);

    const int NUM = 41;

    vec2 path[NUM];

    //------------------------------------------------------
    // path
    //------------------------------------------------------
    {
        path[ 0] = vec2( 0.098, 0.062 );
        path[ 1] = vec2( 0.098, 0.062 );
        path[ 2] = vec2( 0.352, 0.073 );
        path[ 3] = vec2( 0.422, 0.136 );
        path[ 4] = vec2( 0.371, 0.085 );
        path[ 5] = vec2( 0.449, 0.140 );
        path[ 6] = vec2( 0.352, 0.187 );
        path[ 7] = vec2( 0.379, 0.202 );
        path[ 8] = vec2( 0.398, 0.202 );
        path[ 9] = vec2( 0.266, 0.198 );
        path[10] = vec2( 0.318, 0.345 );
        path[11] = vec2( 0.402, 0.359 );
        path[12] = vec2( 0.361, 0.425 );
        path[13] = vec2( 0.371, 0.521 );
        path[14] = vec2( 0.410, 0.491 );
        path[15] = vec2( 0.410, 0.357 );
        path[16] = vec2( 0.502, 0.482 );
        path[17] = vec2( 0.529, 0.435 );
        path[18] = vec2( 0.426, 0.343 );
        path[19] = vec2( 0.449, 0.343 );
        path[20] = vec2( 0.504, 0.335 );
        path[21] = vec2( 0.664, 0.355 );
        path[22] = vec2( 0.748, 0.208 );
        path[23] = vec2( 0.738, 0.277 );
        path[24] = vec2( 0.787, 0.308 );
        path[25] = vec2( 0.748, 0.183 );
        path[26] = vec2( 0.623, 0.081 );
        path[27] = vec2( 0.557, 0.099 );
        path[28] = vec2( 0.648, 0.116 );
        path[29] = vec2( 0.598, 0.116 );
        path[30] = vec2( 0.566, 0.195 );
        path[31] = vec2( 0.584, 0.228 );
        path[32] = vec2( 0.508, 0.083 );
        path[33] = vec2( 0.457, 0.140 );
        path[34] = vec2( 0.508, 0.130 );
        path[35] = vec2( 0.625, 0.071 );
        path[36] = vec2( 0.818, 0.093 );
        path[37] = vec2( 0.951, 0.066 );
        path[38] = vec2( 0.547, 0.081 );
        path[39] = vec2( 0.098, 0.062 );
        path[40] = vec2( 0.098, 0.062 );
    }

	//------------------------------------------------------
	// draw path
	//------------------------------------------------------
	{
		vec2 d = vec2(1000.0);
		for (int i = 0; i < (NUM - 1); i++) {
			vec2 a = path[i + 0];
			vec2 b = path[i + 1];
			d = min(d, vec2(sdSegmentSq(uv, a, b), sdPointSq(uv, a)));
		}
		d.x = sqrt(d.x);
		d.y = sqrt(min(d.y, sdPointSq(uv, path[NUM - 1])));
		col = mix(col, vec3(0.9, 0.2, 0.0), 1.0 - smoothstep(5.0 * e, 6.0 * e, d.y));
	}

#ifdef SHOW_CATMULL_ROM
	//------------------------------------------------------
	// Catmull-Rom interpolation
	// (added by revers)
	//------------------------------------------------------
	{
		float d = 1e5;
		float ani = min(mod((12.0 + iTime) / 10.1, 1.3), 1.0) * float(NUM);

		vec2 p = path[0];

		for (int i = 0; i < NUM - 3; i++) {
			float fi = float(i);

			if (fi > ani) {
				break;
			}
			vec2 A = path[i + 0];
			vec2 B = path[i + 1];
			vec2 C = path[i + 2];
			vec2 D = path[i + 3];

			for (float t = 0.0; t <= 1.01; t += 0.1) {
				vec2 q = interpolate(A, B, C, D, t);

				d = min(d, sdSegmentSq(uv, p, q));
				p = q;

				if (fi + t > ani) {
					break;
				}
			}
		}
		d = sqrt(d);

		col = mix(col, vec3(0.1, 0.1, 0.2), 1.0 - smoothstep(0.0 * e, 2.0 * e, d));
		col *= 0.75 + 0.25 * smoothstep(0.0, 0.13, sqrt(d));
	}
#endif

#ifdef SHOW_FOURIER
    vec2 p = uv;
    //------------------------------------------------------
   // compute fourier transform of the path
   //------------------------------------------------------
	vec2 fcsX[20];
	vec2 fcsY[20];
	for (int k = 0; k < 20; k++) {
		vec2 fcx = vec2(0.0);
		vec2 fcy = vec2(0.0);
		for (int i = 1; i < NUM - 2; i++) {
			float an = -6.283185 * float(k) * float(i - 1) / float(NUM - 3);
			vec2 ex = vec2(cos(an), sin(an));
			fcx += path[i].x * ex;
			fcy += path[i].y * ex;
		}
		fcsX[k] = fcx;
		fcsY[k] = fcy;
	}
    //------------------------------------------------------
    // inverse transform with 6x evaluation points
    //------------------------------------------------------
	{
		float ani = min(mod((12.0 + iTime) / 10.1, 1.3), 1.0);
		float d = 1000.0;
		vec2 oq;

		for (int i = 0; i < 256; i++) {
			float h = ani * float(i) / 256.0;
			vec2 q = vec2(0.0);

			for (int k = 0; k < 20; k++) {
				float w = (k == 0 || k == 19) ? 1.0 : 2.0;

				float an = -6.283185 * float(k) * h;
				vec2 ex = vec2(cos(an), sin(an));
				q.x += w * dot(fcsX[k], ex) / float(NUM - 3);
				q.y += w * dot(fcsY[k], ex) / float(NUM - 3);
			}
			if (i != 0)
				d = min(d, sdSegmentSq(p, q, oq));
			oq = q;
		}
		d = sqrt(d);
		col = mix(col, vec3(0.1, 0.8, 0.2), 1.0 - smoothstep(0.0 * e, 2.0 * e, d));
		col *= 0.75 + 0.25 * smoothstep(0.0, 0.13, sqrt(d));
	}
#endif
    //------------------------------------------------------

	col *= 1.0 - 0.3 * length(fragCoord / iResolution.xy - 0.5);
	fragColor = vec4(col, 1.0);
}
