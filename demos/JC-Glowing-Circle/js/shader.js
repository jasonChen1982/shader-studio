var vertexShader = "varying vec4 vPosition;void main(){vPosition=projectionMatrix*modelViewMatrix*vec4(position,1.0);gl_Position=vPosition;}";

var fragmentShader = "\n#define TWO_PI 6.28318530718\n#define N 64\n#define MAX_STEP 10\n#define MAX_DISTANCE 2.0\n#define EPSILON 1e-6\nuniform vec2 iResolution;uniform float iTime;uniform float iTimeDelta;const mat2 m=mat2(0.80,0.60,-0.60,0.80);float hash(float n){return fract(sin(n)*43758.5453);}float rand(vec2 co){return fract(sin(dot(co.xy,vec2(12.9898,78.233)))*43758.5453);}float noise(vec2 x){vec2 p=floor(x);vec2 f=fract(x);f=f*f*(3.0-2.0*f);float n=p.x+p.y*57.0;return mix(mix(hash(n+0.0),hash(n+1.0),f.x),mix(hash(n+57.0),hash(n+58.0),f.x),f.y);}float fbm(vec2 p){float f=0.0;f+=0.50000*noise(p);p=m*p*2.02;f+=0.25000*noise(p);p=m*p*2.03;f+=0.12500*noise(p);p=m*p*2.01;f+=0.06250*noise(p);p=m*p*2.04;f+=0.03125*noise(p);return f/0.984375;}float circleSDF(vec2 point,vec2 center,float r){return length(point-center)-r;}float rayMarching(vec2 p,vec2 rd){float t=0.;for(int i=0;i<MAX_STEP;i++){float sd=circleSDF(p+rd*t,vec2(0.),0.2);if(sd<EPSILON)return 2.0;t+=sd;if(t>=MAX_DISTANCE)return 0.;}return 0.;}float sample(vec2 p){float sum=0.0;for(int i=0;i<N;i++){float a=TWO_PI*(float(i)+rand(p))/float(N);sum+=rayMarching(p,vec2(cos(a),sin(a)));}return sum/float(N);}void main(){vec2 p=(2.0*gl_FragCoord.xy-iResolution.xy)/min(iResolution.y,iResolution.x);vec3 col=vec3(sample(p))+fbm(p+iTime*0.1);gl_FragColor=vec4(col,1.0);}";

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
