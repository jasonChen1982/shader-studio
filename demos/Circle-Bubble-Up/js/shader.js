var vertexShader = "varying vec4 vPosition;void main(){vPosition=projectionMatrix*modelViewMatrix*vec4(position,1.0);gl_Position=vPosition;}";

var fragmentShader = "uniform vec2 iResolution;uniform float iTime;uniform float iTimeDelta;void main(){vec2 uv=(2.0*gl_FragCoord.xy-iResolution.xy)/min(iResolution.y,iResolution.x);vec3 color=vec3(0.8+0.2*uv.y);for(int i=0;i<40;i++){float pha=sin(float(i)*546.13+1.0)*0.5+0.5;float siz=pow(sin(float(i)*651.74+5.0)*0.5+0.5,4.0);float pox=sin(float(i)*321.55+4.1)*iResolution.x/iResolution.y;float rad=0.1+0.5*siz;vec2 pos=vec2(pox,-1.0-rad+(2.0+2.0*rad)*mod(pha+0.1*iTime*(0.2+0.8*siz),1.0));float dis=length(uv-pos);vec3 col=mix(vec3(0.94,0.3,0.0),vec3(0.1,0.4,0.8),0.5+0.5*sin(float(i)*1.2+1.9));float f=length(uv-pos)/rad;f=sqrt(clamp(1.0-f*f,0.0,1.0));color-=col.zyx*(1.0-smoothstep(rad*0.95,rad,dis))*f;}color*=sqrt(1.5-0.5*length(uv));gl_FragColor=vec4(color,1.0);}";

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
