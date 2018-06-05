var vertexShader = "varying vec4 vPosition;void main(){vPosition=projectionMatrix*modelViewMatrix*vec4(position,1.0);gl_Position=vPosition;}";

var fragmentShader = "uniform vec2 iResolution;uniform float iTime;uniform float iTimeDelta;float hash(float n){return fract(sin(n)*753.5453123);}vec4 noised(in vec3 x){vec3 p=floor(x);vec3 w=fract(x);vec3 u=w*w*w*(w*(w*6.0-15.0)+10.0);vec3 du=30.0*w*w*(w*(w-2.0)+1.0);float n=p.x+p.y*157.0+113.0*p.z;float a=hash(n+0.0);float b=hash(n+1.0);float c=hash(n+157.0);float d=hash(n+158.0);float e=hash(n+113.0);float f=hash(n+114.0);float g=hash(n+270.0);float h=hash(n+271.0);float k0=a;float k1=b-a;float k2=c-a;float k3=e-a;float k4=a-b-c+d;float k5=a-c-e+g;float k6=a-b-e+f;float k7=-a+b+c-d+e-f-g+h;return vec4(k0+k1*u.x+k2*u.y+k3*u.z+k4*u.x*u.y+k5*u.y*u.z+k6*u.z*u.x+k7*u.x*u.y*u.z,du*(vec3(k1,k2,k3)+u.yzx*vec3(k4,k5,k6)+u.zxy*vec3(k6,k4,k5)+k7*u.yzx*u.zxy));}vec4 sdBox(vec3 p,vec3 b){vec3 d=abs(p)-b;float x=min(max(d.x,max(d.y,d.z)),0.0)+length(max(d,0.0));vec3 n=step(d.yzx,d.xyz)*step(d.zxy,d.xyz)*sign(p);return vec4(x,n);}vec4 fbmd(in vec3 x){const float scale=1.5;float a=0.0;float b=0.5;float f=1.0;vec3 d=vec3(0.0);for(int i=0;i<8;i++){vec4 n=noised(f*x*scale);a+=b*n.x;d+=b*n.yzw*f*scale;b*=0.5;f*=1.8;}return vec4(a,d);}vec4 map(in vec3 p){vec4 d1=fbmd(p);d1.x-=0.37;d1.x*=0.7;d1.yzw=normalize(d1.yzw);vec4 d2=sdBox(p,vec3(1.5));return(d1.x>d2.x)? d1 : d2;}vec2 iBox(in vec3 ro,in vec3 rd,in vec3 rad){vec3 m=1.0/rd;vec3 n=m*ro;vec3 k=abs(m)*rad;vec3 t1=-n-k;vec3 t2=-n+k;float tN=max(max(t1.x,t1.y),t1.z);float tF=min(min(t2.x,t2.y),t2.z);if(tN>tF||tF<0.0)return vec2(-1.0);return vec2(tN,tF);}vec4 interesect(in vec3 ro,in vec3 rd){vec4 res=vec4(-1.0);vec2 dis=iBox(ro,rd,vec3(1.5));if(dis.y<0.0)return res;float tmax=dis.y;float t=dis.x;for(int i=0;i<2;i++){vec3 pos=ro+t*rd;vec4 hnor=map(pos);res=vec4(t,hnor.yzw);if(hnor.x<0.001)break;t+=hnor.x;if(t>tmax)break;}if(t>tmax)res=vec4(-1.0);return res;}\n#ifdef SHOW_NUMERICAL_NORMALS\nvec3 calcNormal(in vec3 pos){vec2 eps=vec2(0.0001,0.0);vec3 nor=vec3(map(pos+eps.xyy).x-map(pos-eps.xyy).x,map(pos+eps.yxy).x-map(pos-eps.yxy).x,map(pos+eps.yyx).x-map(pos-eps.yyx).x);return normalize(nor);}\n#endif\nvec3 forwardSF(float i,float n){const float PI=3.141592653589793238;const float PHI=1.618033988749894848;float phi=2.0*PI*fract(i/PHI);float zi=1.0-(2.0*i+1.0)/n;float sinTheta=sqrt(1.0-zi*zi);return vec3(cos(phi)*sinTheta,sin(phi)*sinTheta,zi);}float calcAO(in vec3 pos,in vec3 nor){float ao=0.0;for(int i=0;i<32;i++){vec3 ap=forwardSF(float(i),32.0);float h=hash(float(i));ap*=sign(dot(ap,nor))*h*0.25;ao+=clamp(map(pos+nor*0.001+ap).x*3.0,0.0,1.0);}ao/=32.0;return clamp(ao*5.0,0.0,1.0);}void main(){vec2 p=(2.0*gl_FragCoord.xy-iResolution.xy)/min(iResolution.y,iResolution.x);float an=0.1*iTime;vec3 ro=3.0*vec3(cos(an),0.8,sin(an));vec3 ta=vec3(0.0);vec3 cw=normalize(ta-ro);vec3 cu=normalize(cross(cw,vec3(0.0,1.0,0.0)));vec3 cv=normalize(cross(cu,cw));vec3 rd=normalize(p.x*cu+p.y*cv+1.7*cw);vec3 col=vec3(1.0);vec4 tnor=interesect(ro,rd);float t=tnor.x;if(t>0.0){vec3 pos=ro+t*rd;\n#ifndef SHOW_NUMERICAL_NORMALS\nvec3 nor=tnor.yzw;\n#else\nvec3 nor=calcNormal(pos);\n#endif\nfloat occ=calcAO(pos,nor);float fre=clamp(1.0+dot(rd,nor),0.0,1.0);float fro=clamp(dot(nor,-rd),0.0,1.0);col=mix(vec3(0.05,0.2,0.3),vec3(1.0,0.95,0.85),0.5+0.5*nor.y);col+=10.0*pow(fro,12.0)*(0.04+0.96*pow(fre,5.0));col*=pow(vec3(occ),vec3(1.0,1.1,1.1));}col=sqrt(col);gl_FragColor=vec4(col,1.0);}";

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
