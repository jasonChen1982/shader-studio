import vertexShader from './vertexShader.glsl';
import fragmentShader from './fragmentShader.glsl';
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
    iHour: {
      value: 0.0
    },
    iMinute: {
      value: 0.0
    },
    iSecond: {
      value: 0.0
    },
  },

  vertexShader: vertexShader,

  fragmentShader: fragmentShader

};
