var vertexShader = "varying vec4 vPosition;void main(){vPosition=projectionMatrix*modelViewMatrix*vec4(position,1.0);gl_Position=vPosition;}";

var fragmentShader = "uniform vec2 iResolution;uniform float iTime;uniform float iTimeDelta;uniform float iHour;uniform float iMinute;uniform float iSecond;\n#define cycle 1.5\n#define PI 3.1415926\n#define PI2 6.283185307179586\nmat2 rotate(float deg){return mat2(cos(deg),sin(deg),-sin(deg),cos(deg));}float line(vec2 p,vec2 a,vec2 b,float width,float blur){vec2 pa=p-a;vec2 ba=b-a;vec2 dir=normalize(ba);float t=clamp(dot(pa,dir),0.,length(ba));float dist=length(pa-dir*t);return smoothstep(width-blur,width,dist);}vec3 hourPointer(vec2 uv,vec3 color,float time){float rate=fract(time/12.0);mat2 m=rotate(rate*PI2);float d=line(uv,vec2(0,-0.03)*m,vec2(0,0.3)*m,0.02,0.005);color=mix(vec3(0),color,d);return color;}vec3 minutePointer(vec2 uv,vec3 color,float time){float rate=fract(time/60.0);mat2 m=rotate(rate*PI2);float d=line(uv,vec2(0,-0.04)*m,vec2(0,0.4)*m,0.015,0.005);color=mix(vec3(0),color,d);return color;}vec3 secondPointer(vec2 uv,vec3 color,float time){float rate=fract(time/60.0);mat2 m=rotate(rate*PI2);float d=line(uv,vec2(0,-0.05)*m,vec2(0,0.5)*m,0.005,0.005);color=mix(vec3(0.9921568,0.0666667,0.0666667),color,d);return color;}float circle(vec2 p,vec2 c,float radius,float blur){vec2 pc=p-c;float dist=length(pc);return smoothstep(radius-blur,radius,dist);}vec3 plate(vec2 uv,vec3 color){float d1=circle(uv,vec2(0),0.7,0.005);float d2=circle(uv,vec2(0),0.63,0.005);color=mix(vec3(0.4039215,0.8235294,0.7843137),color,d1);color=mix(vec3(1),color,d2);return color;}void main(){vec2 uv=(2.0*gl_FragCoord.xy-iResolution.xy)/min(iResolution.y,iResolution.x);float tt=mod(iTime,cycle)/cycle;float ss=1.0+0.5*sin(tt*PI*6.0+uv.y*0.5)*exp(-tt*4.0);uv*=vec2(0.7,1.5)+ss*vec2(0.3,-0.5);vec3 color=vec3(0,0.6627451,0.6196078);color=plate(uv,color);color=hourPointer(uv,color,iHour);color=minutePointer(uv,color,iMinute);color=secondPointer(uv,color,iSecond);gl_FragColor=vec4(color,1.0);}";

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
    iHour: {
      value: 0.0
    },
    iMinute: {
      value: 0.0
    },
    iSecond: {
      value: 0.0
    },
  },

  vertexShader: vertexShader,

  fragmentShader: fragmentShader

};
