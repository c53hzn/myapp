function toFixate(){
	$("#float_menubar").attr("class", "menuBarFixated");
	$("#float_middlePart").attr("class", "middlePartFixated");
}
function toNotFixate(){
	$("#float_menubar").attr("class", "menuBar");
	$("#float_middlePart").attr("class", "middlePart");
}
$(document).scroll(
	function(){
		if( $(window).width() <401){
			if( $(document).scrollTop() > 120){
				toFixate();
			}
			else{toNotFixate();}
		}
		else if( $(document).scrollTop() > 150){
			toFixate();
		}
		else{toNotFixate();
		}
	}
);
