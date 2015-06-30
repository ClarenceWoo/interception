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
	texts[0] = new createjs.Text("SCORE:", "25px Consolas", "#000");
	texts[1] = new createjs.Text(dats[this.role][1], "25px Consolas", "#000");
	texts[2] = new createjs.Text("COINS:", "25px Consolas", "#000");
	texts[3] = new createjs.Text("$"+dats[this.role][0], "25px Consolas", "#000");
	for ( var i = 0; i < 4; i++) {
		texts[i].textBaseline = "top";
		texts[i].textAlign = "center";
		width[i] = texts[i].getMeasuredWidth()+30;
		height[i] = texts[i].getMeasuredHeight()+20;
		texts[i].x = width[i] / 2 + (i==1?15:i==3?15:0);
		texts[i].y = i * 45;
		this.addChild(texts[i]);
	}
	this.mouseChildren = false;
	this.offset = Math.random()*10;
	this.count = 0;
};
window.Markboard = createjs.promote(Markboard, "Container");
}());