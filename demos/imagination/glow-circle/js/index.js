var width = window.innerWidth;
var height = window.innerHeight;

var xrViewer = new Tofu.XRViewer({
  canvas: 'webgl',
  width: width,
  height: height,
});

var primer = new ShaderPrimer(glowShader);

// xrViewer.primerLayer.renderToScreen = true;

xrViewer.addPrimer(primer);

xrViewer.start();


// const float dots = 40.; //number of lights
// const float radius = .25; //radius of light ring
// const float brightness = 0.02;

// //convert HSV to RGB
// vec3 hsv2rgb(vec3 c){
//     vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
//     vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
//     return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
// }

// void mainImage( out vec4 fragColor, in vec2 fragCoord ) {

// 	vec2 p=(fragCoord.xy-.5*iResolution.xy)/min(iResolution.x,iResolution.y);
//     vec3 c=vec3(0,0,0.1); //background color

//     for(float i=0.;i<dots; i++){

// 		//read frequency for this dot from audio input channel
// 		//based on its index in the circle
// 		float vol =  texture(iChannel0, vec2(i/dots, 0.0)).x;
// 		float b = vol * brightness;

// 		//get location of dot
//         float x = radius*cos(2.*3.14*float(i)/dots);
//         float y = radius*sin(2.*3.14*float(i)/dots);
//         vec2 o = vec2(x,y);

// 		//get color of dot based on its index in the
// 		//circle + time to rotate colors
// 		vec3 dotCol = hsv2rgb(vec3((i - iTime*10.)/dots,1.,0.9));

//         //get brightness of this pixel based on distance to dot
// 		c += b/(length(p-o))*dotCol;
//     }

//     //black circle overlay
// 	float dist = distance(p , vec2(0));
// 	//c = c * smoothstep(0.26, 0.28, dist);

// 	fragColor = vec4(c,1);
// }



// #define WAVES 3.0

// void mainImage( out vec4 fragColor, in vec2 fragCoord )
// {
//     vec2 uvNorm = fragCoord.xy / iResolution.xy;
// 	vec2 uv = -1.0 + 2.0 * uvNorm;
//     float time = iTime * 10.3;

//   	vec4 color = vec4(0.0);
//     vec3 colorLine = vec3(1.0, 1.0, 1.0);
//     float epaisLine = 0.002;

//     for(float i=0.0; i<WAVES; i++){
// 		float sizeDif = (i * 4.0);
//         colorLine = vec3(1.0 - (i*0.2));


// 		//SiriWave
//         float K = 4.0;
//         float B = 10.0;//Nb waves
//         float x = uv.x * 2.5;
//         float att = (1.0 - (i*0.2)) * 0.3;//Force waves
//         float posOnde = uv.y + (att*pow((K/(K+pow(x, K))), K) * cos((B*x)-(time+(i*2.5))));

//         //Line
//         float difEpais = epaisLine + ((epaisLine/WAVES)*i);
//         vec3 line = smoothstep( 0.0, 1.0, abs(epaisLine / posOnde)) * colorLine;
//         color += vec4(line, smoothstep( 0.0, 1., abs(epaisLine / posOnde)) * colorLine );
//     }



//     fragColor = color;



