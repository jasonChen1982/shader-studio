var width = window.innerWidth;
var height = window.innerHeight;

var xrViewer = new Tofu.Viewer({
  canvas: '#shader-studio',
  width: width,
  height: height,
});

var primerLayer = xrViewer.createLayer(Tofu.PrimerLayer);

var shaderPrimer = new Tofu.ShaderPrimer(shader);
shaderPrimer.material.uniforms.iResolution.value = new THREE.Vector2(width, height);
xrViewer.on('posttimeline', function(info) {
  var iTimeDelta = info.snippet / 1000;
  shaderPrimer.material.uniforms.iTime.value += iTimeDelta;
  shaderPrimer.material.uniforms.iTimeDelta.value = iTimeDelta;
});

primerLayer.add(shaderPrimer);

xrViewer.start();

