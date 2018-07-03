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

  float n = w.x + w.y*57.;

  float a = hash(n);
  float b = hash(n+1.);
  float c = hash(n+57.);
  float d = hash(n+58.);

  return mix(
    mix(a, b, k.x),
    mix(c, d, k.x),
    k.y);
}

// rotation matrix
mat2 m = mat2(0.6,0.8,-0.8,0.6);

// fractional brownian motion (i.e. photoshop clouds)
float fbm(vec2 p) {
  float f = 0.;
  f += 0.5000*noise(p); p *= 2.02*m;
  f += 0.2500*noise(p); p *= 2.01*m;
  f += 0.1250*noise(p); p *= 2.03*m;
  f += 0.0625*noise(p);
  f /= 0.9375;
  return f;
}

float pattern( in vec2 p ) {
  vec2 q = vec2( fbm( p + vec2(0.0,0.0) ),
                 fbm( p + vec2(5.2,1.3) ) );
  return fbm( p + 4.0*q );
}

float pattern2( in vec2 p ) {
  vec2 q = vec2( fbm( p + vec2(0.0,0.0) ),
                  fbm( p + vec2(5.2,1.3) ) );

  vec2 r = vec2( fbm( p + 4.0*q + vec2(1.7,9.2) ),
                  fbm( p + 4.0*q + vec2(8.3,2.8) ) );

  return fbm( p + 4.0*r );
}

void main() {
  // Normalized pixel coordinates (from 0 to 1)
  vec2 p = gl_FragCoord.xy / iResolution.xy;

  float t = iTime * .009;

  vec2 a = vec2(fbm(p+t*3.), fbm(p-t*3.+8.1));
  vec2 b = vec2(fbm(p+t*4. + a*7. + 3.1), fbm(p-t*4. + a*7. + 91.1));
  float c = fbm(b*9. + t*20.);

  // float tt = pattern2(p);

  // float c = fbm(p + fbm(p + 125. * fbm(p + tt) - t));

  // increase contrast
  c = smoothstep(0.15, 0.98, c);

  // mix in some color
  vec3 col = vec3(c);
  // col.gr += vec2(tt, fbm(p + tt));

  // Output to screen
  gl_FragColor = vec4(col, 1.0);
}
