document.addEventListener("DOMContentLoaded", init);

var data;

var lastSectionAnchor;
var currSectionAnchor;
var currSection = 0;
var lastSlide;
var currSlide;

var lastSlideA;
var currSlideA;

var contentSlider;
var mapSlider;

var map_enabled = false;


function init() {
	
	var main = document.getElementById("main");
	main.style.left = (window.innerWidth/2)-960/2+"px";
	main.style.top = (window.innerHeight/2)-600/2+"px";

	$.get("data/data.xml", function(xml){
		data = $.xml2json(xml);
		console.log("data",data);		
			
		handleData(data);
		
		setupFP();
			
	    slideshow();
		
		setupSlider();
		
		
	});
	
		
}

function handleData(data){
	console.log("intro ",data);

	var source   = $("#template").html();//get the template
 	var template = Handlebars.compile(source); //compile template
 	//var context = {title: "My New Post", description: "This is my first post!"};//define data
	var context = data;
 	var html    = template(context); //pass data to template
	var content = document.getElementById("fullpage");
	$(content).html(html); //compile html
	
	console.log("html",content);
	
}

function setupFP(){
			
	var fp = fullpage.initialize('#fullpage', {
		lockAnchors: false,
		anchors: ['encounters', 'nation', 'newmexico', 'homelands'],
	    menu: '#menu-fp',
		navigation: false,
		showActiveTooltip: false,
		slidesNavigation: false,
		css3:true,
		
		//Accessibility
		keyboardScrolling: false,
		animateAnchor: false,
		//Design
		controlArrows: false,
		//Custom selectors
		sectionSelector: '.section',
		slideSelector: '.slide',
		lazyLoading: true,
		//events
		onLeave: function(index, nextIndex, direction){
			 console.log(index, nextIndex, direction);
	
			$(contentSlider).scrollTop(0);
			fullpage.silentMoveTo(lastSectionAnchor, 0);

	  		 var slideright = setTimeout(function(){
	  			 fullpage.moveTo(currSectionAnchor,1);
	  		 }, 2000); //waits two sec before slide
			 
		},
		afterLoad: function(anchorLink, index){
			console.log("afterload",anchorLink, index);	
			lastSectionAnchor = currSectionAnchor;
			currSectionAnchor = anchorLink;
			
			var img = $('.bottom-section-img');
			var story1 = document.getElementById('1');
			var story2 = document.getElementById('2');
			var story3 = document.getElementById('3');
			contentSlider = document.getElementById('content-slider');
			
			if (map_enabled){
				$('.map-container').zIndex(-1);
				if (currSectionAnchor != lastSectionAnchor){
					$("#"+lastSectionAnchor).removeClass('active');		
				}
				$("#map").removeClass('active');
				map_enabled = false;	
			}
			
			
			console.log(data.section[0].slides.slide[1].title);
			
			if (currSectionAnchor == 'encounters'){
				currSection = 0;
				img.attr('src','assets/story/section_title_one.png');
				story1.innerHTML = data.section[0].slides.slide[1].title;
				story2.innerHTML = data.section[0].slides.slide[2].title;
				story3.innerHTML = data.section[0].slides.slide[3].title;
			
			} else if(currSectionAnchor == 'nation'){
				currSection = 1;
				img.attr('src','assets/story/section_title_two.png');
				story1.innerHTML = data.section[1].slides.slide[1].title;
				story2.innerHTML = data.section[1].slides.slide[2].title;
				story3.innerHTML = data.section[1].slides.slide[3].title;
				
			} else if(currSectionAnchor == 'newmexico'){
				currSection = 2;
				img.attr('src','assets/story/section_title_three.png');
				story1.innerHTML = data.section[2].slides.slide[1].title;
				story2.innerHTML = data.section[2].slides.slide[2].title;
				story3.innerHTML = data.section[2].slides.slide[3].title;
				
			} else if(currSectionAnchor == 'homelands'){
				currSection = 3;
				img.attr('src','assets/story/section_title_four.png');
				story1.innerHTML = data.section[3].slides.slide[1].title;
				story2.innerHTML = data.section[3].slides.slide[2].title;
				story3.innerHTML = data.section[3].slides.slide[3].title;
			}
			
		  
		},
		afterRender: function(){
			
 			 fullpage.moveTo(currSectionAnchor,0);
			 
	  		 var slideright = setTimeout(function(){
	  			 fullpage.moveTo(currSectionAnchor,1);
	  		 }, 1500); //waits a sec before slide
			
		},
		afterResize: function(){},
		afterResponsive: function(isResponsive){},
		afterSlideLoad: function(anchorLink, index, slideAnchor, slideIndex){
			console.log("load", anchorLink, index, slideAnchor, slideIndex);
			lastSlideA = currSlideA;
			currSlideA = slideAnchor;
						
			console.log("currSlideA",currSlideA);
			
			$('#'+lastSlideA).removeClass('active');
			$('#'+currSlideA).addClass('active');
			$('#'+lastSlideA).parent().removeClass('active');
			$('#'+currSlideA).parent().addClass('active');
			
			if (currSlideA == 1){
				
				var content_container_id = data.section[currSection].slides.slide[1].id+"_content";
				var content_container=document.getElementById(content_container_id);
				contentSlider.innerHTML = content_container.innerHTML;
				$(contentSlider).show();
				
			} else if (currSlideA == 2){
				var content_container_id = data.section[currSection].slides.slide[2].id+"_content";
				var content_container=document.getElementById(content_container_id);
				contentSlider.innerHTML = content_container.innerHTML;
				$(contentSlider).show();
				
			} else if (currSlideA == 3){
				var content_container_id = data.section[currSection].slides.slide[3].id+"_content";
				var content_container=document.getElementById(content_container_id);
				contentSlider.innerHTML = content_container.innerHTML;
				$(contentSlider).show();
				
			} else {
				$(contentSlider).hide();
			}
			
						
		},
		onSlideLeave: function(anchorLink, index, slideIndex, direction, nextSlideIndex){
			console.log("leave",anchorLink, index, slideIndex, direction, nextSlideIndex);
			$(contentSlider).scrollTop(0);
			$(contentSlider).hide();
			
		}
	});
			
	
	$('.story').click(function(e){
		console.log("clicked"+this.id);
		lastSlide = currSlide;
		currSlide = this.id;
		
		e.preventDefault();				
		fullpage.moveTo(currSectionAnchor, this.id);
		
	});
	
	$('#map-btn').click(function(e){
		console.log("clicked "+this.children[0],currSectionAnchor);		
	
		if (map_enabled){
			$("#"+currSectionAnchor).addClass('active');
			$(this.children[0]).removeClass('active');
			$('.map-container').zIndex(1);
			map_enabled = false;
					
		} else {
			$("#"+currSectionAnchor).removeClass('active');
			$(this.children[0]).addClass('active');
			$('.map-container').zIndex(2);
			map_enabled = true;
		}
	
	});
	

}

function slideshow() {
	
	console.log('slideshow()');
	
	var slideshows = $('.slidesjs');
			
	for (var i=0; i < slideshows.length; i++){
		
		var id = "#"+slideshows[i].id;
		
        $(id).slidesjs({
			width: 420,
			height: 350,
			navigation: {
			  active: false,
			  effect: "fade",
			},
			pagination: {
			  active: false,
			  effect: "fade",
			},
			start: 0,
			play: {
			  active: false,
			  effect: "fade",
			  interval: 5000,
			  auto: true,
			  swap: false,
			  pauseOnHover: true,
			  restartDelay: 2500
		  	},

		  
        });
	
	}
	
}


function setupSlider(){
	
	mapSlider = document.getElementById('map-slider');

	noUiSlider.create(mapSlider, {
		start: [1],
		orientation: 'horizontal',
		direction: 'ltr',	
		snap: true,
		behaviour: 'tap-drag',
		
		range: {
			'min': 0,
			'5%': 1,
			'18%': 2,
			'31%': 3,
			'43%': 4,
			'55%': 5,
			'68%': 6,
			'80%': 7,
			'93%': 8,
			'max': 9,
			
		},

	});
	

	var connect = mapSlider.querySelectorAll('.noUi-connect');
	var classes = ['noUi-handle','noUi-target','noUi-origin', 'map-handle'];

	for ( var i = 0; i < connect.length; i++ ) {
	    connect[i].classList.add(classes[i]);
	}

	mapSlider.noUiSlider.on('update', function ( values, handle ) {

	
		if ( handle ) {
			console.log(values[handle]);
		} else {
			console.log(values[handle]);
			
			if(values[handle] == 0.00){
				mapSlider.noUiSlider.set([1.00, null]);	
						
			} else if (values[handle] == 1.00){
				updateLayer(1)
				
			} else if (values[handle] == 2.00){
				updateLayer(2);
				
			} else if (values[handle] == 3.00){
				updateLayer(3);
					
			} else if (values[handle] == 4.00){
				updateLayer(4);
					
			} else if (values[handle] == 5.00){
				updateLayer(5);
						
			} else if (values[handle] == 6.00){
				updateLayer(6);
						
			} else if (values[handle] == 7.00){
				updateLayer(7);
						
			} else if (values[handle] == 8.00){
				updateLayer(8);
					
			} else if (values[handle] == 9.00){
				mapSlider.noUiSlider.set([8.00, null]);
			}
		}
		
	});
	
}

function gotoMap(id){
	
	console.log(id);	
	if (!map_enabled){
		$('#map-btn').click();
	}
	mapSlider.noUiSlider.set([id, null]);	
	updateLayer(id);
}

function updateLayer(num) {
	
	var layers = $('.layer');
	console.log(layers, "id", num);
	
	for (var i = 0; i < layers.length; i++){
		var all = "#"+layers[i].id;
		$(all).hide();
		var btns = "#"+layers[i].id+"-btn";
		$(btns).removeClass('active');
	}
	
	var layer = document.getElementById('layer'+num);
	$(layer).show();
	
	var btn = document.getElementById('layer'+num+"-btn");
	$(btn).addClass('active');
	
}

function updateSliderValue (slider, value, handle) {
	slider.noUiSlider.set([value, handle]);	
}