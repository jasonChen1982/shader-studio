
varying vec4 vPosition;
varying vec2 vUv;

void main() {
  vUv = uv;
  vPosition = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  gl_Position = vPosition;
}
