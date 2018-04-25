var vertexShader = "varying vec4 vPosition;void main(){vPosition=projectionMatrix*modelViewMatrix*vec4(position,1.0);gl_Position=vPosition;}";

var fragmentShader = "uniform vec2 iResolution;uniform float iTime;uniform float iTimeDelta;void main(){vec2 p=(2.0*gl_FragCoord.xy-iResolution.xy)/min(iResolution.y,iResolution.x);vec3 bcol=vec3(1.0,0.8,0.7-0.07*p.y)*(1.0-0.25*length(p));float tt=mod(iTime,1.5)/1.5;float ss=pow(tt,0.2)*0.5+0.5;ss=1.0+ss*0.5*sin(tt*6.2831*3.0+p.y*0.5)*exp(-tt*4.0);p*=vec2(0.5,1.5)+ss*vec2(0.5,-0.5);p.y-=0.25;float a=atan(p.x,p.y)/3.141593;float r=length(p);float h=abs(a);float d=(13.0*h-22.0*h*h+10.0*h*h*h)/(6.0-5.0*h);float s=0.75+0.75*p.x;s*=1.0-0.4*r;s=0.3+0.7*s;s*=0.5+0.5*pow(1.0-clamp(r/d,0.0,1.0),0.1);vec3 hcol=vec3(1.0,0.5*r,0.3)*s;vec3 col=mix(bcol,hcol,smoothstep(-0.01,0.01,d-r));gl_FragColor=vec4(col,1.0);}";

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
