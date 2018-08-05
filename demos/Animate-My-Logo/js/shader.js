var vertexShader = "varying vec4 vPosition;void main(){vPosition=projectionMatrix*modelViewMatrix*vec4(position,1.0);gl_Position=vPosition;}";

var fragmentShader = "uniform vec2 iResolution;uniform float iTime;uniform float iTimeDelta;\n#define cycle 1.5\n#define scale .5\n#define bg vec3(0, 0.6627451, 0.6196078)\n#define PI 3.1415926\n#define PI2 6.2831853\nmat2 rotate(float deg){return mat2(cos(deg),sin(deg),-sin(deg),cos(deg));}float sector(vec2 p,vec2 a,vec2 b,float width,float blur){vec2 pa=p-a;vec2 ba=b-a;vec2 dir=normalize(ba);float t=clamp(dot(pa,dir),0.,length(ba));float dist=length(pa-dir*t);return smoothstep(width-blur,width,dist);}void main(){vec2 uv=(2.0*gl_FragCoord.xy-iResolution.xy)/min(iResolution.y,iResolution.x);uv/=scale;vec3 col=0.5+0.5*cos(iTime+uv.xyx+vec3(0,2,4));gl_FragColor=vec4(col,1.0);}";

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
