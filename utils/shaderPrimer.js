
function ShaderPrimer(shader) {
  Tofu.Primer.call(this);

  this.uniforms = THREE.UniformsUtils.clone(shader.uniforms);

  this.pigmentMat = new THREE.ShaderMaterial({
    uniforms: this.uniforms,
    vertexShader: shader.vertexShader,
    fragmentShader: shader.fragmentShader,
  });

  this.pigment = new THREE.Mesh(this.pigmentGeo, this.pigmentMat);

  this.scene.add(this.pigment);
}

ShaderPrimer.prototype = Object.create(Tofu.Primer.prototype);

/**
 * render this primer
 * @param {WebGLRenderer} renderer put webgl renderer
 * @param {WebGLRenderTarget} rednerTarget render to which buffer
 */
ShaderPrimer.prototype.render = function(renderer, rednerTarget) {
  renderer.render(this.scene, this.camera, rednerTarget);
};
