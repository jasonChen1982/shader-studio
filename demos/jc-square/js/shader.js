var vertexShader = "varying vec4 vPosition;void main(){vPosition=projectionMatrix*modelViewMatrix*vec4(position,1.0);gl_Position=vPosition;}";

var fragmentShader = "uniform vec2 iResolution;uniform float iTime;uniform float iTimeDelta;\n#define cycle 1.5\n#define PI 3.1415926\nvoid main(){vec2 p=(2.0*gl_FragCoord.xy-iResolution.xy)/min(iResolution.y,iResolution.x);vec3 bcol=vec3(0.29412,0.70196,0.63921)*(1.0-0.3*length(p));float tt=mod(iTime,cycle)/cycle;float ss=1.0+0.5*sin(tt*PI*6.0+p.y*0.5)*exp(-tt*4.0);p*=vec2(0.7,1.5)+ss*vec2(0.3,-0.5);vec2 ap=abs(p);float r=max(ap.x,ap.y);float d=0.5;vec3 ccol=vec3(1.0,1.0,1.0);vec3 col=mix(bcol,ccol,smoothstep(-0.002,0.002,d-r));gl_FragColor=vec4(col,1.0);}";

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
