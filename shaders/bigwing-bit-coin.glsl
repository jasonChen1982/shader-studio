// "HODL"
// by Martijn Steinrucken aka The Art of Code/BigWings - 2021
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
// Email: countfrolic@gmail.com
// Twitter: @The_ArtOfCode
// YouTube: youtube.com/TheArtOfCodeIsCool
// Facebook: https://www.facebook.com/groups/theartofcode/
//
// I had started a bitcoin texture a couple of years ago but
// never finished it. With the recent bullrun I got motivated
// again to finish it. I tried to use symmetries as much as possible
// but in the end, its still a shitload of manual tweaks because
// the thing really isn't as symmetrical as it looks. Oww well.
//
// Music: Fly Me To The Moon (prod. ibrahim) - Going Spaceward
// https://soundcloud.com/going-spaceward/fly-me-to-the-moon

//#define SHOW_COIN_TEXTURE
//#define SHOW_BACKGROUND
#if HW_PERFORMANCE!=0
#define USE_AA
#endif

#define MAX_STEPS 100
#define MAX_DIST 5.
#define SURF_DIST .001

#define S smoothstep

vec3 Transform(vec3 p) {
    vec4 pr = GetProgress(iTime, iMouse.xy/iResolution.xy);

    float a = 10.*pr.x-4.*pr.x*pr.x;

    p.xz *= Rot(pr.x*6.2832);
    p.yz *= Rot(a*6.2832);

    return p;
}

float GetDist(vec3 p) {

    p = Transform(p);

    float
        dist = length(p.xy),
        d = dist-.5,
        side = -sign(p.z);

    d = max(d, abs(p.z)-.03);

    p.x /= iResolution.x/iResolution.y;

    vec2 uv = vec2(p.x*side, p.y)+.5;
    d -= .003*texture(iChannel0, uv).r*S(.0, .01, abs(p.z));

    float a = atan(p.x, p.y)*200.;
    d += S(.025, .015, abs(p.z))*(sin(a)+sin(3.*a)*.25+sin(5.*a)*.0625)*.003;
    return d;
}

float RayMarch(vec3 ro, vec3 rd) {
	float dO=0.,dS;

    for(int i=0; i<MAX_STEPS; i++) {
    	vec3 p = ro + rd*dO;
        dS = GetDist(p);
        dO += dS;
        if(dO>MAX_DIST || abs(dS)<SURF_DIST) break;
    }

    return dO;
}

vec4 GetNormal(in vec3 p) {
    vec2 e = vec2(-1., 1.)*1e-3;
    float
        t1 = GetDist(p + e.yxx),
        t2 = GetDist(p + e.xxy),
        t3 = GetDist(p + e.xyx),
        t4 = GetDist(p + e.yyy),
        c = .25/e.y*(t1 + t2 + t3 + t4 - 4.0*GetDist(p));

    vec3 n = normalize(e.yxx*t1 + e.xxy*t2 + e.xyx*t3 + e.yyy*t4);

    return vec4(n, c);
}

vec3 GetRayDir(vec2 uv, vec3 p, vec3 l, float z) {
    vec3
        f = normalize(l-p),
        r = normalize(cross(vec3(0,1,0), f)),
        u = cross(f,r),
        c = f*z,
        i = c + uv.x*r + uv.y*u;

    return normalize(i);
}

vec3 Bg(vec3 rd, float lod) {

    lod = mix(5., 10., lod);

    vec3
        xy = textureLod(iChannel1, rd.xy+.5, lod).rgb,
        xz = textureLod(iChannel1, rd.xz+.5, lod).rgb,
        yz = textureLod(iChannel1, rd.yz+.5, lod).rgb;

    rd = abs(rd);

    return rd.x*yz + rd.y*xz + rd.z*xy+pow(rd.z*rd.z, 3.);
}

vec4 Render(vec2 frag, vec2 res) {
    vec2
        uv = (frag-.5*res.xy)/res.y,
        m = iMouse.xy/res.xy;

    vec4 pr = GetProgress(iTime, m);

    float
        t = pr.x,
        alpha = 0.,
        d;

    vec3
        ro = vec3(0, 0, -4)*mix(.2, 1., S(.5, 0., abs(t-.5))),
        rd = GetRayDir(uv, ro, vec3(0), 1.),
        col=vec3(0);

    vec2 i = RaySphere(ro, rd, vec3(0), .5);


    if(i.x>-1.) {
        d = RayMarch(ro, rd);

        if(d<MAX_DIST) {
            vec3 p = ro + rd * d;
            vec4 n = GetNormal(p);
            vec3 r = reflect(rd, n.xyz);

            p = Transform(p);

            float
                bump = WaveletNoise(p.xy*10.,3.,2.),
                dif = dot(n.xyz, normalize(vec3(1,2,3)))*.5+.5,
                dirt = 1.-max(0., -n.w);

            col = Bg(r, max(0., n.w))+dif*.03;
            col *= vec3(255,150,40)/255.;
            col *= pow(dirt, 10.);
            col *= mix(1., bump, .2);

            vec3 spec = vec3( pow(abs(r.y),10.) );
            spec *= mix(vec3(1), GetBgCol(iTime)*(1.-pr.z), step(r.y, 0.));
            col += spec;

            alpha = 1.;
        }
    }
    return vec4(col, alpha);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec3 col = vec3(0);

    #ifdef SHOW_COIN_TEXTURE
    col = texture(iChannel0, fragCoord.xy/iResolution.xy).rgb;
    #else
    #ifdef SHOW_BACKGROUND
    col = texture(iChannel1, fragCoord.xy/iResolution.xy).rgb;
    #else

    col = texture(iChannel1, fragCoord.xy/iResolution.xy).rgb;

    vec4 coin = Render(fragCoord, iResolution.xy);
    #ifdef USE_AA
    coin += Render(fragCoord+vec2(.5,0), iResolution.xy);
    coin += Render(fragCoord+vec2(0,.5), iResolution.xy);
    coin += Render(fragCoord+vec2(.5,.5), iResolution.xy);
    coin /= 4.;
    #endif

    col = mix(col, coin.rgb, coin.a);
    #endif
    #endif

    col = pow(col, vec3(.4545));	// gamma correction

    // vignette
    vec2 uv = (fragCoord.xy-iResolution.xy*.5)/iResolution.y;
    float d = dot(uv, uv);
    col /= d*d+1.;

    fragColor = vec4(col,1.0);
}
