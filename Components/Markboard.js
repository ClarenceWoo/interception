(function () {
	
function Markboard(role) {
	this.Container_constructor();
	
	this.role = role;
	
	this.setup();
}
var p = createjs.extend(Markboard, createjs.Container);

p.setup = function(){
	var texts = [];
	var width = [];
	var height = [];
	texts[0] = new createjs.Text("SCORE:", "20px Arial", "#000");
	texts[1] = new createjs.Text(dats[this.role][1], "20px Arial", "#000");
	texts[2] = new createjs.Text("COINS:", "20px Arial", "#000");
	texts[3] = new createjs.Text(dats[this.role][0], "20px Arial", "#000");
	for ( var i = 0; i < 4; i++) {
		texts[i].textBaseline = "top";
		texts[i].textAlign = "center";
		width[i] = texts[i].getMeasuredWidth()+30;
		height[i] = texts[i].getMeasuredHeight()+20;
		texts[i].x = width[i] / 2;
		texts[i].y = i * 45;
		this.addChild(texts[i]);
	}
	this.mouseChildren = false;
	this.offset = Math.random()*10;
	this.count = 0;
};
window.Markboard = createjs.promote(Markboard, "Container");
}());