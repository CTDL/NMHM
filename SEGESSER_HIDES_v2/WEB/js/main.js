document.addEventListener('DOMContentLoaded', init);

var data;
	
var hide1_overlays = [];
var hide2_overlays = [];

var viewer = OpenSeadragon({
	
		zoomInButton:   "zoom-in",
		zoomOutButton:  "zoom-out",
		homeButton:     "home",
		fullPageButton: "full-page",
		nextButton:     "next",
		previousButton: "previous",
	    showNavigator: false,
		autoHideControls:true,
		defaultZoomLevel: 1.8,
		minZoomLevel: 1.8,
		maxZoomLevel: 5,
		constrainDuringPan: true,
		visibilityRatio: 1,			
		gestureSettingsMouse: {
		
			scrollToZoom: false,
			clickToZoom: false,
			dblClickToZoom: false,
			pinchToZoom: false,
			flickEnabled: false,
		
		
		},
		gestureSettingsTouch: {
		
			scrollToZoom: false,
			clickToZoom: false,
			dblClickToZoom: false,
			pinchToZoom: false,
			flickEnabled: false,
		
		
		},

		//mouseNavEnabled: false,
		//zoomPerClick: 1,
		//zoomPerScroll: 1,
	    // debugMode: true,
	    id: "viewport",
	    prefixUrl: "../../../build/openseadragon/images/",
		
		tileSources: [{
			id: 0,
			height: 2200,
	        width:  5800,
	        tileSize: 256,
	        minLevel: 8,
	        getTileUrl: function( level, x, y ){
					//console.log( "tiles/segesser_one_256/TileGroup0/" + (level-8) + "-" + x + "-" + y + ".jpg");
	            	return "content/tiles/segesser_one_256/TileGroup0/" + (level-8) + "-" + x + "-" + y + ".jpg";
				},
			
			overlays: hide1_overlays,
		
		
			}, 
			{
				id: 1,
				height: 3200,
		        width:  10500,
		        tileSize: 256,
		        minLevel: 8,
			
		        getTileUrl: function( level, x, y ){
						return "content/tiles/segesser_two_256/TileGroup0/" + (level-8) + "-" + x + "-" + y + ".jpg";
					},
				
				overlays: hide2_overlays,
				
			}],
		sequenceMode: true

});

var prevZoom;
var prevBounds;
var currSource;
var prevTour_bounds = [];
var nextTour_bounds = [];
var currTour = 0;
var prevTour;
var currHighlight;
var currOverlay;
var tourSourceLoaded = false;

var minZoom = 1.8;
	
var zoomLevelCounter = 0;
var zoomLevelArray = [minZoom, 3, 4.5, 6.5, 8];
	
var isTourEnabled = false;
	
var intro = document.getElementById("intro");	
	
var intro_hide1Btn;
var intro_hide2Btn;
var intro_tourBtn;
	
var hide1Btn = document.getElementById("hide1");
hide1Btn.addEventListener("mousedown", function(){
	$(this).addClass('shadow');
	
	if (currHighlight !=null){
		closeHighlight();
	}
	if (isTourEnabled){
		closeTour();
	}
 	setTileSource(0);
		
}, false);
hide1Btn.addEventListener("mouseup", function(){
	if (currSource == 0){
		//do nothing
	} else {
		$(this).removeClass('shadow');
	}
}, false);
hide1Btn.addEventListener("mouseover", function(){
	if (currSource == 0){
		//do nothing
	} else {
		$(this).addClass('shadow');
	}
}, false);
hide1Btn.addEventListener("mouseout", function(){
	if (currSource == 0){
		//do nothing
	} else {
		$(this).removeClass('shadow');
	}
}, false);
	
var hide2Btn = document.getElementById("hide2");
hide2Btn.addEventListener("mousedown", function(){	
	$(this).addClass('shadow');
	
	if (currHighlight !=null){
		closeHighlight();
	}
	if (isTourEnabled){
		closeTour();
	}
 	setTileSource(1);
 }, false);
hide2Btn.addEventListener("mouseup", function(){	
	if (currSource == 1){
		//do nothing
	} else {
		$(this).removeClass('shadow');
	}
}, false);
hide2Btn.addEventListener("mouseover", function(){	
	if (currSource == 1){
		//do nothing
	} else {
	 	$(this).addClass('shadow');
	}
}, false);
hide2Btn.addEventListener("mouseout", function(){	
	if (currSource == 1){
		//do nothing
	} else {
	 	$(this).removeClass('shadow');
	}
}, false);

var tourBtn = document.getElementById("tour");
tourBtn.addEventListener("mousedown", function(){
	$(this).addClass('shadow');
	setupTour();
}, false);
tourBtn.addEventListener("mouseup", function(){
	$(this).removeClass('shadow');
}, false);
tourBtn.addEventListener("mouseover", function(){
	$(this).addClass('shadow');
}, false);
tourBtn.addEventListener("mouseout", function(){
	$(this).removeClass('shadow');
}, false);
	
var templates = document.getElementById("templates");
	$(templates).fadeOut("slow");	

$(templates).click(function(){
	if (currHighlight !=null){
		closeHighlight();
	}

}).children().click(function(e) {
  return false;
});

	
var slider = document.getElementById('slide');

noUiSlider.create(slider, {
	start: [2],
	orientation: 'vertical',
	direction: 'rtl',	
	behaviour: 'tap-drag',
	//connect: [true, false],
	range: {
		'min': [2],
		'max': [8]
	},

});

var connect = slider.querySelectorAll('.noUi-connect');
var classes = ['noUi-handle','noUi-target','noUi-origin'];

for ( var i = 0; i < connect.length; i++ ) {
    connect[i].classList.add(classes[i]);
}

slider.noUiSlider.on('update', function ( values, handle ) {

	console.log(viewer.viewport.minZoomLevel);
	
	if ( handle ) {
		console.log(values[handle]);
	} else {
		console.log(values[handle]);
	}
	
	viewer.viewport.zoomTo(values[handle]);
		
	

});

function updateSliderRange ( min, max ) {
	slider.noUiSlider.updateOptions({
		start: min,
		range: {
			'min': min,
			'max': max
		}
	});
}

//function for zoom buttons
var zoominBtn = document.getElementById("zoom-in");
zoominBtn.addEventListener("click", function(){
	
	
	zoomLevelCounter += 1;
	if(zoomLevelCounter > zoomLevelArray.length-1){
		zoomLevelCounter = zoomLevelArray.length-1;
	}
	var zoomLevel = zoomLevelArray[zoomLevelCounter];
	
	slider.noUiSlider.set(zoomLevel);
	
});

var zoomoutBtn = document.getElementById("zoom-out");
zoomoutBtn.addEventListener("click", function(){
	zoomLevelCounter -= 1;
	if(zoomLevelCounter < 0){
		zoomLevelCounter = 0;
	}
	var zoomLevel = zoomLevelArray[zoomLevelCounter];
	
	slider.noUiSlider.set(zoomLevel);
	
});

function init(){

	$.get('content/segesser.xml', function(xml){
		data = $.xml2json(xml);
		console.log("data",data);
 	
		console.log("test",data.hide[0].highlights.highlight);

		setIntroData(data);	
	
		create_hide1Overlays();
		create_hide2Overlays();
		
		console.log("content loaded");
	
		//intro_hide1Btn
		intro_hide1Btn = document.getElementById("intro_hide1_btn");
		intro_hide1Btn.addEventListener("mouseover", function(){
			$(this).addClass('shadow');
		});
		intro_hide1Btn.addEventListener("mouseout", function(){
			$(this).removeClass('shadow');
		});
		intro_hide1Btn.addEventListener("mousedown", function(){
			$(this).addClass('shadow');
		});
	
		//intro_hide2Btn
		intro_hide2Btn = document.getElementById("intro_hide2_btn");
		intro_hide2Btn.addEventListener("mouseover", function(){
			$(this).addClass('shadow');
		});
		intro_hide2Btn.addEventListener("mouseout", function(){
			$(this).removeClass('shadow');
		});
		intro_hide2Btn.addEventListener("mousedown", function(){
			$(this).addClass('shadow');
		});
		
		//intro_tourBtn
		intro_tourBtn = document.getElementById("intro_tour");
		intro_tourBtn.addEventListener("mouseover", function(){
			$(this).addClass('shadow');
		});
		intro_tourBtn.addEventListener("mouseout", function(){
			$(this).removeClass('shadow');
		});
		intro_tourBtn.addEventListener("mousedown", function(){
			$(this).addClass('shadow');
		});
	
	});
	
}
		
function create_hide1Overlays(){
	
	
		for (var i = 0; i < data.hide[0].highlights.highlight.length; i++){
		
			var highlight = data.hide[0].highlights.highlight[i];
			
			console.log("highlight", i, highlight, highlight.location.x);
		
		
			var img = document.createElement("img");
				img.className = "highlight_img";
				img.id = "hide1_highlight_"+i+"_img";
				img.src = highlight.image.source;
				
				
				console.log("styles:", highlight.image.width);
				

			 var x = Number(highlight.image.x);
			 var y = Number(highlight.image.y);
			
			 var width = Number(highlight.image.width);//0.1920 * 1.65 = 0.3168 hides1
			 var height = Number(highlight.image.height);//0.1200 * 1.65 = 0.198 hides1			 
			
	
			var overlayImg = {
				element: img,
				location: new OpenSeadragon.Rect(x,y,width,height),
				placement: OpenSeadragon.Placement.CENTER,
				checkResize: false,
				rotationMode: OpenSeadragon.OverlayRotationMode.EXACT
			};
			overlayImg.location.x = x;
			overlayImg.location.y = y;
			overlayImg.location.width = width;
			overlayImg.location.height = height;
			
		 console.log("rect:", overlayImg.location);
			

			var btn = document.createElement("div");
		        btn.className = "highlight";
		        btn.innerHTML = "+";
				btn.addEventListener("click", clickHighlight, false);	
				btn.addEventListener("mousedown", clickHighlight, false);			
				btn.id = "hide1_highlight_"+i;
				btn.overlay = overlayImg;
				btn.zoom = [highlight.zoom.level,highlight.zoom.x, highlight.zoom.y];
				btn.img = img;
				btn.hide = 0;
				btn.highlight = i;
			
				
   			var locx = Number(highlight.location.x);
   			var locy = Number(highlight.location.y);
			
			var overlay = {
				element: btn,
				location: new OpenSeadragon.Point(locx, locy),
				placement: OpenSeadragon.Placement.TOP_LEFT,
				checkResize: false,
				rotationMode: OpenSeadragon.OverlayRotationMode.EXACT				
				
			};
			
			overlay.location.x = locx;
			overlay.location.y = locy;
			
			console.log("overlay", overlay.location);
		
			
			hide1_overlays.push(overlay);
		
		}
		
	
	
}


function create_hide2Overlays(){
	
	
	for (var i = 0; i < data.hide[1].highlights.highlight.length; i++){
		
		var highlight = data.hide[1].highlights.highlight[i];
		
		var img = document.createElement("img");
			img.className = "highlight_img";
			img.id = "hide2_highlight_"+i+"_img";
			img.src = highlight.image.source;
			

		 var x = Number(highlight.image.x);
		 var y = Number(highlight.image.y);
		 var width = Number(highlight.image.width);//0.1920 * 1.25 = 0.24 hides2
		 var height = Number(highlight.image.height);//0.1200 * 1.25 = 0.15 hides2
		 
		 
	
		var overlayImg = {
			element: img,
			location: new OpenSeadragon.Rect(x, y, width, height),
			placement: OpenSeadragon.Placement.CENTER,
			checkResize: false,
			rotationMode: OpenSeadragon.OverlayRotationMode.EXACT
		};
		
		overlayImg.location.x = x;
		overlayImg.location.y = y;
		overlayImg.location.width = width;
		overlayImg.location.height = height;

		var btn = document.createElement("div");
	        btn.className = "highlight";
	        btn.innerHTML = "+";
			btn.addEventListener("click", clickHighlight, false);	
			btn.addEventListener("mousedown", clickHighlight, false);			
					
			btn.id = "hide2_highlight_"+i;
			btn.overlay = overlayImg;
			btn.zoom = [highlight.zoom.level,highlight.zoom.x, highlight.zoom.y];
			btn.img = img;
			btn.hide = 1;
			btn.highlight = i;
			
   		var locx = Number(highlight.location.x);
   		var locy = Number(highlight.location.y);	
				
		var overlay = {
			element: btn,
			location: new OpenSeadragon.Point(locx, locy),
			placement: OpenSeadragon.Placement.TOP_LEFT,
			checkResize: false,
			rotationMode: OpenSeadragon.OverlayRotationMode.EXACT
		};
		
		overlay.location.x = locx;
		overlay.location.y = locy;
			
		
		hide2_overlays.push(overlay);
		
	}
}


viewer.addHandler('canvas-drag', function(){
	
	//remove overlays during drag
  	viewer.clearOverlays();
	
});

viewer.addHandler('canvas-drag-end', function(){
	
	//add overlays after drag
	showOverlays();
	
});

viewer.addHandler('open', function() {
	
	
	console.log("viewer loaded");
	console.log("src id:", viewer.source.id);
	
	currSource = viewer.source.id;
	
	viewer.tileSources[0].overlays = hide1_overlays;
	viewer.tileSources[1].overlays = hide2_overlays;
	
	
	if (isTourEnabled == true){
	  	viewer.clearOverlays();
	
	} 
	
	if (viewer.source.id == 0){
		
		$(hide1Btn).addClass('shadow');
		$(hide2Btn).removeClass('shadow');
		
		viewer.viewport.minZoomLevel = 1.8;	
		minZoom = 1.8;
		updateSliderRange(viewer.viewport.minZoomLevel,8.0);
		
		
		if (isTourEnabled == true){
			
			zoomTour(currTour);	
			tourSourceLoaded = false;	

			
		} else {
			
			var bounds = viewer.viewport.getHomeBounds();
			var point = new OpenSeadragon.Point(0.28, 0.2);
			viewer.viewport.panTo(point, true);
			viewer.viewport.zoomTo(1.8);
			
			
			
		}
		
		
	
	
	} else if (viewer.source.id == 1){
		
		$(hide1Btn).removeClass('shadow');
		$(hide2Btn).addClass('shadow');
		
		viewer.viewport.minZoomLevel = 2.1;
		minZoom = 2.1;
					
		updateSliderRange(viewer.viewport.minZoomLevel,8.0);	
	 	
		
		
		if (isTourEnabled == true){
			zoomTour(currTour);	
			tourSourceLoaded = false;	
		
			
		}  else {
			
		 	var point = new OpenSeadragon.Point(0.24, 0.155);
		 	viewer.viewport.panTo(point, true);		
			viewer.viewport.zoomTo(2.1);
			
		}
			
	 	
	
	}
	
	


});

function showOverlays(){
	
	if (currSource == 0){

		for (var i= 0; i < hide1_overlays.length; i++){
			viewer.addOverlay(hide1_overlays[i]);
			
		}
	} else if (currSource == 1){

		for (var j= 0; j < hide2_overlays.length; j++){
			viewer.addOverlay(hide2_overlays[j]);
		}

	}
	
}


function clickHighlight(){			
	
	console.log("clicked");
	console.log(this.id);
	console.log(this.hide);
	
	
	if (data.hide[this.hide].highlights.highlight.length > 0){
		setHighlightData(data.hide[this.hide].highlights.highlight[this.highlight]);
		
	} else {
		setHighlightData(data.hide[this.hide].highlights.highlight);
		
	}
						
	
	if (this.innerHTML == "+"){
		
		currHighlight = this;
		
		
		prevZoom = viewer.viewport.getZoom();
		
		prevBounds = viewer.viewport.getBounds();
		this.innerHTML = "-";
		
  	  	$(templates).fadeIn("slow");
		templates.style.zIndex = 2;
		
		$("#tour-placeholder").hide();
		$("#highlight-placeholder").show();
		
		
		zoomHighlight(this);
		
		
		
	} else{
		
		closeHighlight();
		
	}
				
	
	
}

function zoomHighlight(btn){
							
	var zoomLevel = btn.zoom[0];
	var zoomX = btn.zoom[1];
	var zoomY = btn.zoom[2];
			
	currOverlay = btn.overlay;
	viewer.addOverlay(currOverlay);
	
	
	slider.noUiSlider.set(zoomLevel);
	
	var point = new OpenSeadragon.Point(zoomX, zoomY);
	point.x = zoomX;
	point.y = zoomY;

		
	viewer.viewport.zoomTo(zoomLevel,point, false);
	

}

function closeHighlight(){
	
	console.log(minZoom, prevZoom);
	slider.noUiSlider.set(prevZoom);
	
 	$(templates).fadeOut("slow");
	templates.style.zIndex = 0;
	
	currHighlight.innerHTML = "+";
	viewer.removeOverlay(currOverlay.element);				
	viewer.viewport.fitBounds(prevBounds);	
	currHighlight = null;	
	
	
}



function enableHides(id){
	
 	$(intro).fadeOut("slow");
	intro.style.zIndex = -1;
 
	
	if (id == "hide1"){
		setTileSource(0);
	} else if (id == "hide2"){
		setTileSource(1);
	} else if (id == "tour"){
		setupTour();
	  	
	}

}

function setTileSource(id){
	viewer.goToPage(id);
}

function setIntroData(data){
	console.log("intro ",data);

	var source   = $("#intro-template").html();//get the template
 	var template = Handlebars.compile(source); //compile template
 	//var context = {title: "My New Post", description: "This is my first post!"};//define data
	var context = data;
 	var html    = template(context); //pass data to template
	var content = document.getElementById("intro");
	$(content).html(html); //compile html
	
	console.log("intro html",html);
	
}



function setHighlightData(data){
	console.log(data, "clicked");

	var source   = $("#highlight-template").html();//get the template
 	var template = Handlebars.compile(source); //compile template
 	//var context = {title: "My New Post", description: "This is my first post!"};//define data
	var context = data;
 	var html    = template(context); //pass data to template
	var content = document.getElementById("highlight-placeholder");
	$(content).html(html); //compile html

}



function setupTour(){
	
	
	if (isTourEnabled==false){
		isTourEnabled = true;
		
		tourBtn.innerHTML = "close tour";
	
		console.log("setup tour");
		
		$("#tour-placeholder").show();
		$("#highlight-placeholder").hide();
		$('#controls').fadeOut("slow");
	
	  	$(templates).fadeIn("slow");
		templates.style.zIndex = 6;
		
	  	viewer.clearOverlays();
		
		setTileSource(0);
		
		currTour = 0;
		
		setTourData(currTour);	
				
		setTourSource(currTour);
		
		
	} else {
		closeTour();
		
	}
	

}


function setTourData(id){
	
	console.log(data);
	var source   = $("#tour-template").html();//get the template
 	var template = Handlebars.compile(source); //compile template
	var context = data.tour.highlights.highlight[id];
 	var html    = template(context); //pass data to template
	var content = document.getElementById("tour-placeholder");
	$(content).html(html); //compile html		

}

function setTourSource(id){	
	
	//get xml data for id
	var tour = data.tour.highlights.highlight[id];
	var source = Number(tour.tileSource);

	
	//switch to tile source in xml
	if (currSource != source){
		setTileSource(source);
		tourSourceLoaded = true;
	} 
	
}

function zoomTour(id){				
		
	//get xml data for id
	var tour = data.tour.highlights.highlight[id];
	var source = Number(tour.tileSource);
	var zoomLevel = Number(tour.zoom.level);
	var zoomX = Number(tour.zoom.x);
	var zoomY = Number(tour.zoom.y);
	
	
	//set slider position
	slider.noUiSlider.set(zoomLevel);
	
	
	//create xy point
	var point = new OpenSeadragon.Point(zoomX, zoomY);
	point.x = zoomX;
	point.y = zoomY;

	//zoom to point
	viewer.viewport.zoomTo(zoomLevel,point, false);	
	
	
	console.log("zoom tour:",point);
		
		
}

function fwdTour(id){				
		
	//get xml data for id
	var tour = data.tour.highlights.highlight[id];
	var source = Number(tour.tileSource);
	var zoomLevel = Number(tour.fwd.level);
	var zoomX = Number(tour.fwd.x);
	var zoomY = Number(tour.fwd.y);
	
	
	//set slider position
	slider.noUiSlider.set(zoomLevel);
	
	
	//create xy point
	var point = new OpenSeadragon.Point(zoomX, zoomY);
	point.x = zoomX;
	point.y = zoomY;

	//zoom to point
	viewer.viewport.zoomTo(zoomLevel,point, false);	
	
	
	console.log("fwd tour:",point);
		
		
}

function reverseTour(id){				
		
	//get xml data for id
	var tour = data.tour.highlights.highlight[id];
	var source = Number(tour.tileSource);
	var zoomLevel = Number(tour.reverse.level);
	var zoomX = Number(tour.reverse.x);
	var zoomY = Number(tour.reverse.y);
	
	
	//set slider position
	slider.noUiSlider.set(zoomLevel);
	
	
	//create xy point
	var point = new OpenSeadragon.Point(zoomX, zoomY);
	point.x = zoomX;
	point.y = zoomY;

	//zoom to point
	viewer.viewport.zoomTo(zoomLevel,point, false);	
	
	
	console.log("rev tour:",point);
		
		
}




function prevTour(){	
	nextTour_bounds[currTour] = viewer.viewport.getBounds();
	

	var len = data.tour.highlights.highlight.length;
	
	currTour -= 1;
	
	if(currTour < 0){
		currTour = len-1;
	}
	
	setTourData(currTour);	
	setTourSource(currTour);
	
	if (tourSourceLoaded == false){
		reverseTour(currTour);
	}
	
	//viewer.viewport.fitBounds(prevTour_bounds[currTour]);		
	
	

}

function nextTour(){		
	
	prevTour_bounds[currTour] = viewer.viewport.getBounds();
	
		
	var len = data.tour.highlights.highlight.length;
	
	currTour += 1;	
		
	
	if(currTour > len-1) {
		currTour = 0;
	}
	
	
	console.log(currTour);
	setTourData(currTour);	
	setTourSource(currTour);	
	if (tourSourceLoaded ==false){
		fwdTour(currTour);
	}
	
	
	//viewer.viewport.fitBounds(nextTour_bounds[currTour]);		
	
	
	
}


function closeTour(){		

	
	templates.style.zIndex = -2;
 	$(templates).fadeOut("slow");
	
	tourBtn.innerHTML = "take a tour";
	
	$('#controls').fadeIn("slow");
	
	showOverlays();
	isTourEnabled = false;
	

}




Handlebars.registerHelper('splitlist', function(list) {
  var newArray = list.split(";");
  var html = [];
  
  $.each(newArray, function(prop, value){
        html.push(value+"</br>");
   })
	
   var str = html.join("");
	

   return new Handlebars.SafeString(str);
});

Handlebars.registerHelper('current', function() {
	var len = data.tour.highlights.highlight.length;
	var id;

	for (var i=0; i < len; i++){
		id = i;

		if (id == currTour){

			break;
		}

	}


	return id+1;

});

Handlebars.registerHelper('length', function() {
	var len = data.tour.highlights.highlight.length;
	return len;
});
	


