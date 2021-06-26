var width = window.innerWidth * 1.5;
var height = window.innerHeight * 1.5;
var clockDate = new Date();

function calculateClock() {
  clockDate.setTime(Date.now());

  var ms = clockDate.getMilliseconds() / 1000;
  var second = clockDate.getSeconds() + ms;
  var minute = clockDate.getMinutes() + second / 60;
  var hour = clockDate.getHours() + minute / 60;
  return {
    hour: hour,
    minute: minute,
    second: second,
  };
}

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

  // var nt = calculateClock();
  // shaderPrimer.material.uniforms.iHour.value = nt.hour;
  // shaderPrimer.material.uniforms.iMinute.value = nt.minute;
  // shaderPrimer.material.uniforms.iSecond.value = nt.second;
});

primerLayer.add(shaderPrimer);

xrViewer.start();
