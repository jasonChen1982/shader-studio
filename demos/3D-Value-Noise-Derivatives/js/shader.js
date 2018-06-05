var vertexShader = "varying vec4 vPosition;void main(){vPosition=projectionMatrix*modelViewMatrix*vec4(position,1.0);gl_Position=vPosition;}";

var fragmentShader = "uniform vec2 iResolution;uniform float iTime;uniform float iTimeDelta;float hash(vec3 p){p=50.0*fract(p*0.3183099+vec3(0.71,0.113,0.419));return-1.0+2.0*fract(p.x*p.y*p.z*(p.x+p.y+p.z));}vec4 noised(in vec3 x){vec3 p=floor(x);vec3 w=fract(x);vec3 u=w*w*w*(w*(w*6.0-15.0)+10.0);vec3 du=30.0*w*w*(w*(w-2.0)+1.0);float a=hash(p+vec3(0.0,0.0,0.0));float b=hash(p+vec3(1.0,0.0,0.0));float c=hash(p+vec3(0.0,1.0,0.0));float d=hash(p+vec3(1.0,1.0,0.0));float e=hash(p+vec3(0.0,0.0,1.0));float f=hash(p+vec3(1.0,0.0,1.0));float g=hash(p+vec3(0.0,1.0,1.0));float h=hash(p+vec3(1.0,1.0,1.0));float k0=a;float k1=b-a;float k2=c-a;float k3=e-a;float k4=a-b-c+d;float k5=a-c-e+g;float k6=a-b-e+f;float k7=-a+b+c-d+e-f-g+h;return vec4(k0+k1*u.x+k2*u.y+k3*u.z+k4*u.x*u.y+k5*u.y*u.z+k6*u.z*u.x+k7*u.x*u.y*u.z,du*vec3(k1+k4*u.y+k6*u.z+k7*u.y*u.z,k2+k5*u.z+k4*u.x+k7*u.z*u.x,k3+k6*u.x+k5*u.y+k7*u.x*u.y));}void mainImage(out vec4 fragColor,in vec2 fragCoord){vec2 p=(-iResolution.xy+2.0*fragCoord.xy)/iResolution.y;float an=0.5*iTime;vec3 ro=vec3(2.5*cos(an),1.0,2.5*sin(an));vec3 ta=vec3(0.0,1.0,0.0);vec3 ww=normalize(ta-ro);vec3 uu=normalize(cross(ww,vec3(0.0,1.0,0.0)));vec3 vv=normalize(cross(uu,ww));vec3 rd=normalize(p.x*uu+p.y*vv+1.5*ww);vec3 sc=vec3(0.0,1.0,0.0);float tmin=10000.0;vec3 nor=vec3(0.0);float occ=1.0;vec3 pos=vec3(0.0);float h=(0.0-ro.y)/rd.y;if(h>0.0){tmin=h;nor=vec3(0.0,1.0,0.0);pos=ro+h*rd;vec3 di=sc-pos;float l=length(di);occ=1.0-dot(nor,di/l)*1.0*1.0/(l*l);}vec3 ce=ro-sc;float b=dot(rd,ce);float c=dot(ce,ce)-1.0;h=b*b-c;if(h>0.0){h=-b-sqrt(h);if(h<tmin){tmin=h;nor=normalize(ro+h*rd-sc);occ=0.5+0.5*nor.y;}}vec3 col=vec3(0.9);if(tmin<100.0){pos=ro+tmin*rd;vec4 n=noised(12.0*pos);col=0.5+0.5*((p.x>0.0)?n.yzw:n.xxx);col=mix(col,vec3(0.9),1.0-exp(-0.003*tmin*tmin));}fragColor=vec4(col,1.0);}";

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
