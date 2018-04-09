var width = window.innerWidth;
var height = window.innerHeight;

var xrViewer = new Tofu.XRViewer({
  canvas: '#shader-studio',
  width: width,
  height: height,
});

shader.uniforms.iResolution.value = new THREE.Vector2(width, height);
var primer = new ShaderPrimer(shader);

xrViewer.addPrimer(primer);

xrViewer.start();

