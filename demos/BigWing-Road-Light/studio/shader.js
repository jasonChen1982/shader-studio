import vertexShader from './vertexShader.glsl';
import fragmentShader from './fragmentShader.glsl';
var Vector2 = THREE.Vector2;

var shader = {

  uniforms: {
    iResolution: {
      value: new Vector2(300, 150)
    },
    iMouse: {
      value: new Vector2(0, 0)
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
