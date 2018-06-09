var width = window.innerWidth;
var height = window.innerHeight;

var xrViewer = new Tofu.XRViewer({
  canvas: '#shader-studio',
  width: width,
  height: height,
});

var primer = new ShaderPrimer(shader);
primer.pigmentMat.uniforms.iResolution.value = new THREE.Vector2(width, height);
xrViewer.on('posttimeline', function(info) {
  var iTimeDelta = info.snippet / 1000;
  primer.pigmentMat.uniforms.iTime.value += iTimeDelta;
  primer.pigmentMat.uniforms.iTimeDelta.value = iTimeDelta;
});

xrViewer.addPrimer(primer);

xrViewer.start();

