var vertexShader = "varying vec4 vPosition;void main(){vPosition=projectionMatrix*modelViewMatrix*vec4(position,1.0);gl_Position=vPosition;}";

var fragmentShader = "uniform vec2 iResolution;uniform float iTime;uniform float iTimeDelta;float Line(vec2 p,vec2 a,vec2 b,float width,float blur){vec2 pa=p-a;vec2 ba=b-a;vec2 dir=normalize(ba);float t=clamp(dot(pa,dir),0.,length(ba));float dist=length(pa-dir*t);return smoothstep(width-blur,width,dist);}void main(){vec2 uv=(2.0*gl_FragCoord.xy-iResolution.xy)/min(iResolution.y,iResolution.x);float l1=Line(uv,vec2(-0.5),vec2(0.5),.1,0.01);float l2=Line(uv,vec2(-0.5,0.5),vec2(0.5,-0.5),.1,0.01);float m=min(l1,l2);vec3 bg=vec3(0.2549,0.7215,0.5098);vec3 front=vec3(1);vec3 col=mix(front,bg,m);gl_FragColor=vec4(col,1.0);}";

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
