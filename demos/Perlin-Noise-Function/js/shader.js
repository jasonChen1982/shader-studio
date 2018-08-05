var vertexShader = "varying vec4 vPosition;void main(){vPosition=projectionMatrix*modelViewMatrix*vec4(position,1.0);gl_Position=vPosition;}";

var fragmentShader = "uniform vec2 iResolution;uniform float iTime;uniform float iTimeDelta;vec2 hash22(vec2 p){p=vec2(dot(p,vec2(312.3,123.2)),dot(p,vec2(134.5,321.7)));return-1.0+2.0*fract(sin(p)*4567.676);}float perlinNoise(vec2 p){vec2 pi=floor(p);vec2 pf=fract(p);vec2 w=pf*pf*(3.0-2.0*pf);return mix(mix(dot(hash22(pi+vec2(0.0,0.0)),pf-vec2(0.0,0.0)),dot(hash22(pi+vec2(1.0,0.0)),pf-vec2(1.0,0.0)),w.x),mix(dot(hash22(pi+vec2(0.0,1.0)),pf-vec2(0.0,1.0)),dot(hash22(pi+vec2(1.0,1.0)),pf-vec2(1.0,1.0)),w.x),w.y);}float hash(float n){return fract(sin(n)*93942.234);}float valueNoise(vec2 p){vec2 w=floor(p);vec2 k=fract(p);k=k*k*(3.-2.*k);float n=w.x*10.+w.y*48.;float a=hash(n);float b=hash(n+10.);float c=hash(n+48.);float d=hash(n+58.);return mix(mix(a,b,k.x),mix(c,d,k.x),k.y);}const mat2 mtx=mat2(0.80,0.60,-0.60,0.80);float fbm6(vec2 p){float f=0.0;f+=0.500000*valueNoise(p);p=mtx*p*2.02;f+=0.250000*valueNoise(p);p=mtx*p*2.03;f+=0.125000*valueNoise(p);p=mtx*p*2.01;f+=0.062500*valueNoise(p);p=mtx*p*2.04;f+=0.031250*valueNoise(p);p=mtx*p*2.01;f+=0.015625*valueNoise(p);return f/0.96875;}void main(){vec2 uv=(2.0*gl_FragCoord.xy-iResolution.xy)/min(iResolution.y,iResolution.x);vec3 col=vec3(0.);col+=fbm6(3.*uv);gl_FragColor=vec4(col,1.0);}";

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
