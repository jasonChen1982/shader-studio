var vertexShader = "varying vec4 vPosition;void main(){vPosition=projectionMatrix*modelViewMatrix*vec4(position,1.0);gl_Position=vPosition;}";

var fragmentShader = "uniform vec2 iResolution;uniform float iTime;uniform float iTimeDelta;float Line(vec2 p,vec2 a,vec2 b,float width,float blur){vec2 pa=p-a;vec2 ba=b-a;vec2 dir=normalize(ba);float t=clamp(dot(pa,dir),0.,length(ba));float dist=length(pa-dir*t);return smoothstep(width-blur,width,dist);}float errorPattern(vec2 uv,vec2 pos,float length,float thickness,float blur){float hl=length/2.;float l1=Line(uv,vec2(pos-hl),vec2(pos+hl),thickness,blur);float l2=Line(uv,vec2(pos.x-hl,pos.y+hl),vec2(pos.x+hl,pos.y-hl),thickness,blur);return min(l1,l2);}void main(){vec2 uv=(2.0*gl_FragCoord.xy-iResolution.xy)/min(iResolution.y,iResolution.x);vec2 ep=vec2(-1.,0.);float m=errorPattern(uv,ep,.5,.04,.007);vec2 buv=gl_FragCoord.xy/iResolution.xy;vec3 bg=0.5+0.5*cos(iTime+buv.xyx+vec3(0,2,4));bg=max(bg,vec3(0.4,0,0.4));vec2 fuv=fract((uv-ep)/0.7+0.5);vec3 front=0.5+0.5*cos(iTime+fuv.xyx+vec3(4,0,2));front=max(front,vec3(0.4,0,0.4));vec3 col=mix(front,bg,m);gl_FragColor=vec4(col,1.0);}";

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
