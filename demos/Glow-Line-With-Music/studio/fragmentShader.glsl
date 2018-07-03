uniform vec2 iResolution;
uniform float iTime;
uniform float iTimeDelta;

// The Universe Within - by Martijn Steinrucken aka BigWings 2018
// countfrolic@gmail.com
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

// After listening to an interview with Michael Pollan on the Joe Rogan
// podcast I got interested in mystic experiences that people seem to
// have when using certain psycoactive substances.
//
// For best results, watch fullscreen, with music, in a dark room.
//
// I had an unused 'blockchain effect' lying around and used it as
// a base for this effect. Uncomment the SIMPLE define to see where
// this came from.
//
// Use the mouse to get some 3d parallax.

// Music - Terrence McKenna Mashup - Jason Burruss Remixes
// https://soundcloud.com/jason-burruss-remixes/terrence-mckenna-mashup
//
// YouTube video of this effect:
// https://youtu.be/GAhu4ngQa48

#define S(a, b, t) smoothstep(a, b, t)
#define NUM_LAYERS 4.

//#define SIMPLE

float N21(vec2 p) {	// Dave Hoskins - https://www.shadertoy.com/view/4djSRW
	vec3 p3  = fract(vec3(p.xyx) * vec3(443.897, 441.423, 437.195));
  p3 += dot(p3, p3.yzx + 19.19);
  return fract((p3.x + p3.y) * p3.z);
}

vec2 GetPos(vec2 id, float t) {
  float n = N21(id);
  float n1 = fract(n*10.);
  float n2 = fract(n*100.);
  float a = t+n;
  return vec2(sin(a*n1), cos(a*n2))*.4;
}

float GetT(vec2 ro, vec2 rd, vec2 p) {
	return dot(p-ro, rd);
}

float LineDist(vec3 a, vec3 b, vec3 p) {
	return length(cross(b-a, p-a))/length(p-a);
}

float df_line( in vec2 a, in vec2 b, in vec2 p) {
  vec2 pa = p - a, ba = b - a;
	float h = clamp(dot(pa,ba) / dot(ba,ba), 0., 1.);
	return length(pa - ba * h);
}

float line(vec2 a, vec2 b, vec2 uv) {
  float r1 = .02;
  float r2 = .005;

  float d = df_line(a, b, uv);
  float d2 = length(a-b);
  float fade = S(1.5, .5, d2);

  fade += S(.05, .02, abs(d2-.75));
  return S(r1, r2, d)*fade;
}

float NetLayer(vec2 st, float n, float t) {
  vec2 id = floor(st)+n;

  st = fract(st)-.5;

  vec2 p = GetPos(id, t);
  float d = length(st-p);
  float m = 0.;
  float sparkle = 0.;

  for(float y=-1.; y<=1.; y++) {
    for(float x=-1.; x<=1.; x++) {
      vec2 offs = vec2(x,y);
      vec2 p2 = offs+GetPos(id+offs, t);

      m += line(p, p2, st);

      d = length(st-p2);

      float s = (.005/(d*d));
      s *= S(1., .7, d);
      float pulse = sin((p2.x-offs.x+p2.y-offs.y+t)*5.)*.4+.6;
      pulse = pow(pulse, 20.);

      s *= pulse;
      sparkle += s;
    }
  }


  vec2 pt = vec2(0,1)+GetPos(id+vec2(0,1), t);
  vec2 pr = vec2(1,0)+GetPos(id+vec2(1,0), t);
  vec2 pb = vec2(0,-1)+GetPos(id+vec2(0,-1), t);
  vec2 pl = vec2(-1,0)+GetPos(id+vec2(-1,0), t);

  m += line(pt, pr, st);
	m += line(pr, pb, st);
  m += line(pb, pl, st);
  m += line(pl, pt, st);

  float sPhase = (sin(t+n)+sin(t*.1))*.25+.5;
  sPhase += pow(sin(t*.1)*.5+.5, 50.)*5.;
  m += sparkle*sPhase; // (*.5+.5);

  return m;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - iResolution.xy*.5) / max(iResolution.y, iResolution.x);
	// vec2 uv = (2.0 * gl_FragCoord.xy - iResolution.xy) / max(iResolution.y, iResolution.x);
	// vec2 M = iMouse.xy/iResolution.xy-.5;

  float t = iTime*.1;

  float s = sin(t);
  float c = cos(t);
  mat2 rot = mat2(c, -s, s, c);
  vec2 st = uv*rot;
	// M *= rot*2.;

  float m = 0.;
  for(float i=0.; i<1.; i+=1./NUM_LAYERS) {
    float z = fract(t+i);
    float size = mix(15., 1., z);
    float fade = S(0., .6, z)*S(1., .8, z);

    m += fade * NetLayer(st*size, i, iTime); // -M*z
  }

	// float fft  = texelFetch( iChannel0, ivec2(.7,0), 0 ).x;
  // float glow = -uv.y*fft*2.;

  vec3 baseCol = vec3(s, cos(t*.4), -sin(t*.24))*.4+.6;
  vec3 col = baseCol*m;
  // col += baseCol;

  #ifdef SIMPLE
  uv *= 10.;
  col = vec3(1)*NetLayer(uv, 0., iTime);
  uv = fract(uv);
  //if(uv.x>.98 || uv.y>.98) col += 1.;
  #else
  col *= 1.-dot(uv,uv);
  t = mod(iTime, 230.);
  col *= S(0., 20., t)*S(224., 200., t);
  #endif

  gl_FragColor = vec4(col,1);
}
