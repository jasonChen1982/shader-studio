var vertexShader = "varying vec4 vPosition;void main(){vPosition=projectionMatrix*modelViewMatrix*vec4(position,1.0);gl_Position=vPosition;}";

var fragmentShader = "uniform vec2 iResolution;uniform float iTime;uniform float iTimeDelta;const float kGamma=2.2;vec4 over(in vec4 a,in vec4 b){return a+b*(1.0-a.w);}vec4 gamma2linear_premultalpha(vec4 c){return vec4(pow(c.xyz,vec3(kGamma))*c.w,c.w);}vec4 linear2gamma_premultalpha(vec4 c){return vec4(pow(c.xyz/c.w,vec3(1.0/kGamma)),1.0);}void main(){vec2 u=(2.0*gl_FragCoord.xy-iResolution.xy)/min(iResolution.y,iResolution.x);float patChecker=mod(floor(3.0*u.x)+floor(3.0*u.y),2.0);float patCircle1=1.0-smoothstep(-0.2,0.2,length(u-.4*sin(0.43*iTime+vec2(0.0,1.0)))-0.7);float patCircle2=1.0-smoothstep(-0.2,0.2,length(u-.4*sin(0.41*iTime+vec2(3.0,2.0)))-0.7);float patCircle3=1.0-smoothstep(-0.2,0.2,length(u-.4*sin(0.53*iTime+vec2(4.0,1.0)))-0.7);vec4 c0=gamma2linear_premultalpha(vec4(vec3(patChecker*.2+.7),1.0));vec4 c1=gamma2linear_premultalpha(vec4(.9,.1,.1,patCircle1));vec4 c2=gamma2linear_premultalpha(vec4(.1,.9,.1,patCircle2));vec4 c3=gamma2linear_premultalpha(vec4(.1,.1,.9,patCircle3));vec4 cr;\n#ifdef BACK_TO_FRONT\ncr=c0;cr=over(c1,cr);cr=over(c2,cr);cr=over(c3,cr);\n#else\ncr=c3;cr=over(cr,c2);cr=over(cr,c1);cr=over(cr,c0);\n#endif\ngl_FragColor=linear2gamma_premultalpha(cr);}";

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
