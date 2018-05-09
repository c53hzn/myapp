$(".menuBarQuater").click(function(){
  var that = this;
  var menuChild_0 = this.children[0];
  var menuChild_1 = this.children[1];
  if(menuChild_1.style.display == "block"){
  	that.style.backgroundColor = "transparent";
  	menuChild_0.style.color = "white";
    menuChild_1.style.display = "none";
  }else{
  	that.style.backgroundColor = "#FFAD86";
  	menuChild_0.style.color = "black";
    menuChild_1.style.display = "block";
  }
});
$(".menuBarQuater").mouseover(function(){
  var that = this;
  var menuChild_0 = this.children[0];
  var menuChild_1 = this.children[1];
  that.style.backgroundColor = "#FFAD86";
  menuChild_0.style.color = "black";
  menuChild_1.style.display = "block";
});
$(".menuBarQuater").mouseout(function(){
  var that = this;
  var menuChild_0 = this.children[0];
  var menuChild_1 = this.children[1];
  that.style.backgroundColor = "transparent";
  menuChild_0.style.color = "white";
  menuChild_1.style.display = "none";
});
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
