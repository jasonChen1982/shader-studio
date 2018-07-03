var vertexShader = "varying vec4 vPosition;void main(){vPosition=projectionMatrix*modelViewMatrix*vec4(position,1.0);gl_Position=vPosition;}";

var fragmentShader = "uniform vec2 iResolution;uniform float iTime;uniform float iTimeDelta;float snoise(vec3 uv,float res){vec3 s=vec3(1e0,1e2,1e3);uv*=res;vec3 uv0=floor(mod(uv,res))*s;vec3 uv1=floor(mod(uv+vec3(1.),res))*s;vec3 f=fract(uv);f=f*f*(3.0-2.0*f);vec4 v=vec4(uv0.x+uv0.y+uv0.z,uv1.x+uv0.y+uv0.z,uv0.x+uv1.y+uv0.z,uv1.x+uv1.y+uv0.z);vec4 r=fract(sin(v*1e-1)*1e3);float r0=mix(mix(r.x,r.y,f.x),mix(r.z,r.w,f.x),f.y);r=fract(sin((v+uv1.z-uv0.z)*1e-1)*1e3);float r1=mix(mix(r.x,r.y,f.x),mix(r.z,r.w,f.x),f.y);return mix(r0,r1,f.z)*2.-1.;}void main(){vec2 p=-.5+gl_FragCoord.xy/iResolution.xy;p.x*=iResolution.x/iResolution.y;float color=3.0-(3.*length(2.*p));vec3 coord=vec3(atan(p.x,p.y)/6.2832+.5,length(p)*.4,.5);for(int i=1;i<=7;i++){float power=pow(2.0,float(i));color+=(1.5/power)*snoise(coord+vec3(0.,-iTime*.05,iTime*.01),power*16.);}gl_FragColor=vec4(color,pow(max(color,0.),2.)*0.4,pow(max(color,0.),3.)*0.15,1.0);}";

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
