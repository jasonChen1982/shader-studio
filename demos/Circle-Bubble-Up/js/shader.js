var vertexShader = "#define GLSLIFY 1\nvarying vec4 vPosition;\n\nvoid main() {\n  vPosition = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n  gl_Position = vPosition;\n}\n"; // eslint-disable-line

var fragmentShader = "#define GLSLIFY 1\nuniform vec2 iResolution;\nuniform float iTime;\nuniform float iTimeDelta;\n\n// Created by inigo quilez - iq/2013\n// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.\n\nvoid main() {\n  // Normalized pixel coordinates (from 0 to 1)\n\tvec2 uv = (2.0 * gl_FragCoord.xy - iResolution.xy) / min(iResolution.y, iResolution.x);\n\n  // background\n\tvec3 color = vec3(0.8 + 0.2*uv.y);\n\n  // bubbles\n\tfor( int i=0; i<40; i++ ) {\n    // bubble seeds\n\t\tfloat pha =      sin(float(i)*546.13+1.0)*0.5 + 0.5;\n\t\tfloat siz = pow( sin(float(i)*651.74+5.0)*0.5 + 0.5, 4.0 );\n\t\tfloat pox =      sin(float(i)*321.55+4.1) * iResolution.x / iResolution.y;\n\n    // buble size, position and color\n\t\tfloat rad = 0.1 + 0.5*siz;\n\t\tvec2  pos = vec2( pox, -1.0-rad + (2.0+2.0*rad)*mod(pha+0.1*iTime*(0.2+0.8*siz),1.0));\n\t\tfloat dis = length( uv - pos );\n\t\tvec3  col = mix( vec3(0.94,0.3,0.0), vec3(0.1,0.4,0.8), 0.5+0.5*sin(float(i)*1.2+1.9));\n\t\t// col+= 8.0*smoothstep( rad*0.95, rad, dis );\n\n    // render\n\t\tfloat f = length(uv-pos)/rad;\n\t\tf = sqrt(clamp(1.0-f*f,0.0,1.0));\n\t\tcolor -= col.zyx *(1.0-smoothstep( rad*0.95, rad, dis )) * f;\n\t}\n\n  // vignetting\n\tcolor *= sqrt(1.5-0.5*length(uv));\n\n\tgl_FragColor = vec4(color,1.0);\n}\n"; // eslint-disable-line

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
