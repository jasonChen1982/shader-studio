
varying vec4 vPosition;

void main() {
  vPosition = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  gl_Position = vPosition;
}
