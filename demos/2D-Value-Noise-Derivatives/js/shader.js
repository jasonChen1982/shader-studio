var vertexShader = "varying vec4 vPosition;void main(){vPosition=projectionMatrix*modelViewMatrix*vec4(position,1.0);gl_Position=vPosition;}";

var fragmentShader = "uniform vec2 iResolution;uniform float iTime;uniform float iTimeDelta;float hash(in vec2 p){p=50.0*fract(p*0.3183099+vec2(0.71,0.113));return-1.0+2.0*fract(p.x*p.y*(p.x+p.y));}vec3 noised(in vec2 p){vec2 i=floor(p);vec2 f=fract(p);vec2 u=f*f*f*(f*(f*6.0-15.0)+10.0);vec2 du=30.0*f*f*(f*(f-2.0)+1.0);float va=hash(i+vec2(0.0,0.0));float vb=hash(i+vec2(1.0,0.0));float vc=hash(i+vec2(0.0,1.0));float vd=hash(i+vec2(1.0,1.0));float k0=va;float k1=vb-va;float k2=vc-va;float k4=va-vb-vc+vd;return vec3(va+(vb-va)*u.x+(vc-va)*u.y+(va-vb-vc+vd)*u.x*u.y,du*(u.yx*(va-vb-vc+vd)+vec2(vb,vc)-va));}void main(){vec2 p=(2.0*gl_FragCoord.xy-iResolution.xy)/min(iResolution.y,iResolution.x);vec3 n=noised(8.0*p);vec3 col=0.5+0.5*((p.x>0.0)? n.yzx : n.xxx);gl_FragColor=vec4(col,1.0);}";

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
