(function() {

function Button(label, color, size) {
	this.Container_constructor();
	
	this.color = color;
	this.label = label;
	this.size = size;
	
	this.setup();
}
var p = createjs.extend(Button, createjs.Container);


p.setup = function() {
	var text = new createjs.Text(this.label, "20px Arial", "#000");
	text.textBaseline = "top";
	text.textAlign = "center";
	
	var width = text.getMeasuredWidth()+30;
	//var height = text.getMeasuredHeight()+20;
	
	text.x = width/2;
	text.y = 0;
	
	var background = new createjs.Shape();
	background.graphics.beginFill(this.color).drawCircle(text.x, text.y+10, this.size * 15);
	
	this.addChild(background, text); 
	this.on("click", this.handleClick);
	this.on("rollover", this.handleRollOver);
	this.on("rollout", this.handleRollOver);
	this.cursor = "pointer";

	this.mouseChildren = false;
	
	this.offset = Math.random()*10;
	this.count = 0;
} ;

p.handleClick = function (event) {
	if(role != homerole){
		return;
	}
	if(flags[role] != 1){
		return;
	}
	for (var i = 0; i < 3; i++){
		btype[i].alpha = 1;
	}
	btype[this.size - 1].alpha = 0.4;
	cursize = this.size;
	canvas2.onclick = this.addCircle.bind(this);
	canvas2.onmouseover = this.showCircle.bind(this);
	canvas2.onmousemove = this.showCircle.bind(this);
	canvas2.onmouseout = function () {
		stage2.removeChild(showcircle);
		stage2.update();
	}
	stage1.update();
} ;

p.handleRollOver = function(event) {
	if(role != homerole){
		return;
	}
	if(event.type == "rollover"){
		this.alpha = 0.4;
		return;
	}
	else
		this.alpha = cursize == this.size ? 0.4 : 1;
	stage1.update();
};

p.addCircle = function(event){
	if(dats[role][0] == 0){
		return;
	}
	if(((event.offsetX - (width / 2)) > 0) != role){
		alert("only put barriers in your area!");
		return;
	}
	if(Math.abs(event.offsetX - (width / 2)) < this.size * 15 ||
		(Math.abs(event.offsetX - (width / 2)) + this.size * 15) > 9 * width / 32){
		alert("the barrier will cross the boundary!");
		return;
	}
	if(dats[role][0] < price[this.size - 1]){
		alert("insufficient coins!");
		return;
	}
	dats[role][0] -= price[this.size - 1];
	stage2.children[role].children[3].text = dats[role][0];
	var c = new createjs.Shape();
	c.graphics.beginFill("#FE979C").drawCircle(event.offsetX, event.offsetY, this.size * 15);
	barriers[role].push(c);
	stage2.addChild(c);
	stage2.removeChild(showcircle);
	
	//send circle info to the other player
	socket.send(JSON.stringify({content:JSON.stringify({step:1,circle:{x:event.offsetX,y:event.offsetY,radius:this.size * 15}}), user:userid}))
	
	stage2.update();
}

p.showCircle = function (event) {
	if(dats[role][0] == 0){
		return;
	}
	if(homerole != role){
		return;
	}
	if(flags[role] != 1){
		return;
	}
	stage2.removeChild(showcircle);
	showcircle = new createjs.Shape();
	showcircle.graphics.beginFill("#FE979C").drawCircle(event.offsetX, event.offsetY, this.size * 15);
	showcircle.alpha = 1;
	stage2.addChild(showcircle);
	if(((event.offsetX - (width / 2)) > 0) != role){
		stage2.removeChild(showcircle);
		stage2.update();
		return;
	}
	if(Math.abs(event.offsetX - (width / 2)) < this.size * 15 ||
		(Math.abs(event.offsetX - (width / 2)) + this.size * 15) > 9 * width / 32){
		stage2.removeChild(showcircle);
		stage2.update();
		return;
	}

	stage2.update();
}

window.Button = createjs.promote(Button, "Container");
}());