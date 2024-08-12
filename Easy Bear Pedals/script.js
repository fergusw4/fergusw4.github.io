var size = {
	x: $('#display').width(),
	y: $('#display').height()
};

var res = Math.ceil(size.y / size.y / 2);
var w = Math.ceil(size.x / res);
var h = Math.ceil(size.y / res);

var calch = (h * 1.5), // this is used in the animation, just caching math so I don't need to do it every frame.
    calcw = (w * 1.5); // ^^

var canvas = $('<canvas/>').attr({width: size.x, height: size.y}).appendTo('#display'),
    context = canvas.get(0).getContext("2d");

function setSize() {
	size = {
		x: $('#display').width(),
		y: $('#display').height()
	};

	res = Math.ceil(size.y / size.y / 2);
	w = Math.ceil(size.x / res);
	h = Math.ceil(size.y / res);
	calch = (h * 1.5),
		calcw = (w * 1.5);
	canvas.attr({width: size.x, height: size.y});
}

var startTime = new Date().getTime();
var currentTime = 0;

noise.seed(8);
//noise.seed(Math.random());

var color;	

// Cache colors to reduce work per frame -- Thanks Blake Bowen for this tip and a few others, hopefully performance will improve.
var color1 = [238,136,0,255];
var color2 = [237,102,0,255];
var color3 = [235,68,0,255];
var color4 = [0,102,99,255];
var color5 = [0,102,238,255];
var color6 = [255/2,255/2,255/2];

var imagedata = context.createImageData(size.x, size.y);
var buf = new ArrayBuffer(imagedata.data.length);

var buf8 = new Uint8ClampedArray(buf);
var data = new Uint32Array(imagedata.data.buffer);

function updateData(){
	imagedata = context.getImageData(0, 0, size.x, size.y);
	data = new Uint32Array(imagedata.data.buffer);
}

function draw(){
	var now = new Date().getTime();
	currentTime = (now - startTime) / 5000; // this variable will start at 0, and then will go up at a slow rate.  So 2 seconds into the animation will be like 0.002.
	// That variable is also responsable for the animation timing.  It iterates through the "z" axis of the Perlin Noise. I also move the perlin noise slowly on the x and y axis.

	for(var y = 0; y < size.y; y++){
		for(var x = 0; x < size.x; x++){
			var r = noise.simplex3((currentTime + x) / calcw, currentTime + y / calch, currentTime); // Figure out what this pixel looks like in the perlin noise
			
			// r will return a number between -1 and +1.  So for every .4 in between, I change the color.
			if(r >= -2 && r < -0.6){
				color = color1;
			} else if(r >= -0.6 && r < -0.2){
				color = color2;
			} else if(r >= -0.2 && r < 0.2){
				color = color3;
			} else if(r >= 0.2 && r < 0.6){
				color = color4;
			} else if(r >= 0.6 && r <= 2){
				color = color5;
			} else {
				color = color6;
			}
			
			// Set pixel data
			data[y * size.x + x] =
				(color[3]  << 24) |	// alpha
				(color[2] << 16) |	// blue
				(color[1] <<  8) |	// green
				color[0];		// red
		}
	}
	
	context.putImageData(imagedata, 0, 0); // Push the pixel data to the canvas

	requestFrame(draw); // Call this funtion again on the next animation frame.
}


window.requestFrame = (function(){
	return  window.requestAnimationFrame       ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame    ||
		function( callback ){
		window.setTimeout(callback, 1000 / 60);
	};
})();

draw();
$('#display').on('resize', setSize);