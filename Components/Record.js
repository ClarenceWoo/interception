(function () {

function Record() {
	this.Container_constructor();
	
	this.setup();
}
var p = createjs.extend(Record, createjs.Container);

p.setup = function () {
	var text = new createjs.Text("RECORD", "20px Arial", "#000");
	text.textBaseline = "top";
	text.textAlign = "center";
	text.x = (text.getMeasuredWidth()+30)/2;
	text.y = 0;
	
	var background = new createjs.Shape();
	background.graphics.beginFill("#888").drawRoundRect(-5,-10,120,45,10);
	
	this.addChild(background, text);
	this.on("click", this.handleClick);
	this.on("rollover", this.handleRollOver);
	this.on("rollout", this.handleRollOver);
	this.cursor = "pointer";

	this.mouseChildren = false;
	
	this.offset = Math.random()*10;
	this.count = 0;
};

p.handleRollOver = function (event) {
	if(event.type == "rollover")
		this.alpha = 0.4;
	else
		this.alpha = 1;
	stage1.update();
};

p.handleClick = function (event) {
	socket.send(JSON.stringify({req:"rec"}));
};
window.Record = createjs.promote(Record, "Container");
}());