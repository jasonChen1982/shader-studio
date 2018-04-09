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

  vertexShader: "\nvarying vec4 vPosition;\n\nvoid main() {\n  vPosition = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n  gl_Position = vPosition;\n}\n",

  fragmentShader: "uniform vec2 iResolution;\nuniform float iTime;\nuniform float iTimeDelta;\n\nvoid main() {\n  // Normalized pixel coordinates (from 0 to 1)\n  vec2 uv = gl_FragCoord.xy / iResolution.xy;\n\n  // Time varying pixel color\n  vec3 col = 0.5 + 0.5 * cos(iTime + uv.xyx + vec3(0, 2, 4));\n\n  // Output to screen\n  gl_FragColor = vec4(col, 1.0);\n}\n"

};
