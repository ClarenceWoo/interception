(function() {
	
function Submit(role) {
	this.Container_constructor();
	
	this.role = role;
	
	this.setup();
}
var p = createjs.extend(Submit, createjs.Container);

p.setup = function () {
	var text = new createjs.Text((flags[2] == 0)?"START":(this.role==0?"LEFT":"RIGHT"), "25px Consolas", "#000");
	text.textBaseline = "top";
	text.textAlign = "center";
	
	//var img = new Image();
	//img.src = "./_assets/int/dir.png";
	//console.log("s:"+img);
	
	//this.addChild(img);
	//stage1.addChild(img);
	//console.log("s"+this);
	//console.log("ss"+stage1);
	
	var width = text.getMeasuredWidth()+30;
	var height = text.getMeasuredHeight()+20;
	
	text.x = width/2;
	text.y = 0;
	
	var background = new createjs.Shape();
	background.graphics.beginFill("#888").drawRoundRect(5,-10,90,45,10);
	
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
	if(flags[2] == 0){//isWaiting
		//send to the other player
		socket.send(JSON.stringify({content:JSON.stringify({step:0,startrole:role}),user:userid}));
		
		dats[0][0] -= 2;
		stage2.children[role].children[3].text = "$"+dats[role][0];
		flags[2] = 1;
		console.log("started"+role);
		text = new createjs.Text(role==0?"LEFT":"RIGHT", "25px Consolas", "#000");
		text.textBaseline = "top";
		text.textAlign = "center";
		text.x = (text.getMeasuredWidth()+30) / 2 + (text.text=="LEFT"?5:0);
		text.y = 0;
		submit.children[1] = text;
		flags[role] = 1;
		stage2.update();
		
		return;
	}
	else if(flags[2] == 1){//isSettingBarrier
		if(role != homerole){
			return;
		}
		if(flags[1 - role] == 0){//the other player is to set barrier
			role = 1 - role;
			flags[role] = 1;
			cursize = -1;
			for (var i = 0; i < 3; i++){
				btype[i].alpha = 1;
			}
			
			text = new createjs.Text(role==0?"LEFT":"RIGHT", "25px Consolas", "#000");
			text.textBaseline = "top";
			text.textAlign = "center";
			text.x = (text.getMeasuredWidth()+30) / 2 + (text.text=="LEFT"?5:0);
			text.y = 0;
			submit.children[1] = text;
			canvas2.onclick = function (){};
			canvas2.onmouseover = function (){};
			canvas2.onmousemove = function (){};
			
			//send to the other player
			socket.send(JSON.stringify({content:JSON.stringify({step:2}), user:userid}));
			
			stage1.update();
			return;
		}
		else if(flags[1 - role] == 1){//the other player has done setting
			flags[0] = 2;
			flags[1] = 2;
			flags[2] = 2;
			role = 1 - role;
			cursize = -1;
			for (var i = 0; i < 3; i++){
				btype[i].alpha = 1;
			}
			
			text = new createjs.Text(role==0?"LEFT":"RIGHT", "25px Consolas", "#000");
			text.textBaseline = "top";
			text.textAlign = "center";
			text.x = (text.getMeasuredWidth()+30) / 2 + (text.text=="LEFT"?5:0);
			text.y = 0;
			submit.children[1] = text;
			
			canvas2.onmouseover = function (){};
			canvas2.onmousemove = function (){};
			canvas2.onclick = this.putMissile.bind(this);
			
			
			//send to the other player
			socket.send(JSON.stringify({content:JSON.stringify({step:3}), user:userid}));
			
			return;
		}
	}
	else if(flags[2] == 2){//isPuttingMissile
		return;
	}
	else if(flags[2] == 3){//isDoneReputtingBarrier
		if(role != homerole){
			return;
		}
		flags[2] = 2;
		flags[role] = 2;
		flags[1 - role] = 2;
		role = 1 - role;
		cursize = -1;
		for (var i = 0; i < 3; i++){
			btype[i].alpha = 1;
		}
		//flags[role] = 4;
		text = new createjs.Text(role==0?"LEFT":"RIGHT", "25px Consolas", "#000");
		text.textBaseline = "top";
		text.textAlign = "center";
		text.x = (text.getMeasuredWidth()+30) / 2 + (text.text=="LEFT"?5:0);
		text.y = 0;
		this.children[1] = text;
		stage1.update();
		canvas2.onclick = this.putMissile.bind(this);
		
		//send to the other
		socket.send(JSON.stringify({content:JSON.stringify({step:7}), user:userid}));
		
		return;
	}
	else{
		return;
	}
	
} ;

p.handleRollOver = function(event) {
	this.alpha = (homerole!=role || flags[2]==2)?1:(event.type == "rollover" ? 0.4 : 1);
	stage1.update();
};

p.putMissile = function(event){
	if(homerole != role){
		return;
	}
	console.log("putmissile");
	if((Math.abs(event.offsetX - width / 2) + 15)>(3*width/8) ||
		(Math.abs(event.offsetX - width / 2) - 15)<(9*width/32) ||
		(role == 0) != (event.offsetX < width / 2)){
		alert("The missile will cross the boundary!");
		return;
	}
	else{
		var m = new createjs.Shape();
		m.graphics.beginFill("#FFFFFF").drawCircle(event.offsetX, event.offsetY, 15);
		missile = m;
		stage2.addChild(missile);
		
		var s1 = new createjs.Shape();
		s1.graphics.setStrokeStyle(2, 'round', 'round').beginStroke("#293047").arc(missile.graphics.command.x, missile.graphics.command.y, 20, 0, 2*Math.PI);
		s1.alpha = 0;
		shields[0] = s1;
		
		var s2 = new createjs.Shape();
		s2.graphics.setStrokeStyle(2, 'round', 'round').beginStroke("#293047").arc(missile.graphics.command.x, missile.graphics.command.y, 22, 0, 2*Math.PI);
		s2.alpha = 0;
		shields.push(s2);
		/*
		var s3 = new createjs.Shape();
		s3.graphics.setStrokeStyle(2, 'round', 'round').beginStroke("#293047").arc(missile.graphics.command.x, missile.graphics.command.y, 40, 0, 2*Math.PI);
		s3.alpha = 0;
		shields.push(s3);*/
		
		stage2.addChild(shields[0]);
		stage2.addChild(shields[1]);
		//stage2.addChild(shields[2]);
		dirline = new createjs.Shape();
		var mcenter = new createjs.Point(missile.graphics.command.x, missile.graphics.command.y);
		
		var dirarctan = Math.atan((event.offsetX - missile.graphics.command.x)/(event.offsetY - missile.graphics.command.y));
		var	xdest = missile.graphics.command.x + 45*Math.sin(dirarctan)*((event.offsetY - missile.graphics.command.y < 0)?-1:1);
		var	ydest = missile.graphics.command.y + 45*Math.cos(dirarctan)*((event.offsetY - missile.graphics.command.y < 0)?-1:1);
		dirline.graphics.clear().setStrokeStyle(3, 'round', 'round').beginStroke("#888888").moveTo(mcenter.x, mcenter.y).lineTo(xdest, ydest);
		stage2.addChild(dirline);
		
		canvas2.onmouseover = function (event) {
			var dirarctan = Math.atan((event.offsetX - missile.graphics.command.x)/(event.offsetY - missile.graphics.command.y));
			var xdest = missile.graphics.command.x + 45*Math.sin(dirarctan)*((event.offsetY - missile.graphics.command.y < 0)?-1:1);
			var ydest = missile.graphics.command.y + 45*Math.cos(dirarctan)*((event.offsetY - missile.graphics.command.y < 0)?-1:1);
			dirline.graphics.clear().setStrokeStyle(3, 'round', 'round').beginStroke("#888888").moveTo(mcenter.x, mcenter.y).lineTo(xdest, ydest);
			stage2.update();
		}
		canvas2.onmousemove = function (event) {
			var dirarctan = Math.atan((event.offsetX - missile.graphics.command.x)/(event.offsetY - missile.graphics.command.y));
			var xdest = missile.graphics.command.x + 45*Math.sin(dirarctan)*((event.offsetY - missile.graphics.command.y < 0)?-1:1);
			var ydest = missile.graphics.command.y + 45*Math.cos(dirarctan)*((event.offsetY - missile.graphics.command.y < 0)?-1:1);
			dirline.graphics.clear().setStrokeStyle(3, 'round', 'round').beginStroke("#888888").moveTo(mcenter.x, mcenter.y).lineTo(xdest, ydest);
			stage2.update();
		};
		
		//send to the other
		socket.send(JSON.stringify({content:JSON.stringify({step:4,missile:{x:missile.graphics.command.x,y:missile.graphics.command.y}}), user:userid}));
		
		canvas2.onclick = this.emit.bind(this);
		stage2.update();
	}
	return;
} ;

p.emit = function (event) {
	stage2.removeChild(dirline);
	console.log("h:"+homerole+"r:"+role);
	missile.status = 0;
	counted = [[], []];
	paused = 0;
	canvas2.onclick = function (){};
	var arctan = Math.atan((event.offsetX - missile.graphics.command.x)/(event.offsetY - missile.graphics.command.y));
	var xvelo = 5*Math.sin(arctan) * ((event.offsetY - missile.graphics.command.y < 0)?-1:1);
	var yvelo = 5*Math.cos(arctan) * ((event.offsetY - missile.graphics.command.y < 0)?-1:1);
	
	//send to the other
	socket.send(JSON.stringify({content:JSON.stringify({step:5,dir:{xv:xvelo, yv:yvelo}}), user:userid}));
	
	createjs.Ticker.on("tick", function(event){
		if(paused == 1){
			return;
		}
		missile.graphics.command.x += xvelo;
		missile.graphics.command.y += yvelo;
		/*for(var i = 0; i < 3; i++){
			shields[i].graphics.command.x += xvelo;
			shields[i].graphics.command.y += yvelo;
		}*/
		shields[0].graphics.command.x += xvelo;
		shields[0].graphics.command.y += yvelo;
		shields[1].graphics.command.x += xvelo;
		shields[1].graphics.command.y += yvelo;
		if((missile.graphics.command.y + 15) >= height){
			yvelo = 0 - yvelo;
		}
		else if((missile.graphics.command.y - 15) <= 0){
			yvelo = 0 - yvelo;
		}
		if(missile.graphics.command.x - 15 < width / 8){
			xvelo = 0 - xvelo;
		}
		else if(missile.graphics.command.x + 15 > 7 * width / 8){
			xvelo = 0 - xvelo;
		}
		var distance;
		var xdist;
		var ydist;
		for(var i = 0; i < barriers[role].length; i++){
			if(counted[role].indexOf(i) != -1)
			{
				continue;
			}
			xdist = Math.abs(missile.graphics.command.x - barriers[role][i].graphics.command.x);
			ydist = Math.abs(missile.graphics.command.y - barriers[role][i].graphics.command.y);
			distance = Math.sqrt(xdist*xdist + ydist*ydist);
			if(distance - 15 <= barriers[role][i].graphics.command.radius){
				counted[role].push(i);
				if(missile.status < 2)
					missile.status += 1;
			}
		}
		for(var i = 0; i < barriers[1 - role].length; i++){
			if(counted[1-role].indexOf(i) != -1)
			{
				continue;
			}
			xdist = Math.abs(missile.graphics.command.x - barriers[1 - role][i].graphics.command.x);
			ydist = Math.abs(missile.graphics.command.y - barriers[1 - role][i].graphics.command.y);
			distance = Math.sqrt(xdist*xdist + ydist*ydist);
			if(distance - 16 <= barriers[1 - role][i].graphics.command.radius){
				counted[1-role].push(i);
				missile.status -= 2;
			}
		}
		switch(missile.status){
			case 0 :	shields[0].alpha = shields[1].alpha = 0 //shields[2].alpha = 0;
						break;
			case 1 :	shields[0].alpha = 0.5;
						shields[1].alpha = 0;
						//shields[1].alpha = shields[2].alpha = 0;
						break;
			case 2 :	shields[0].alpha = 1;
						shields[1].alpha = 1;
						//shields[1].alpha = shields[2].alpha = 0;
						break;
			/*case 3 :	shields[0].alpha = 1;
						shields[1].alpha = 0.5;
						shields[2].alpha = 0;
						break;
			case 4 :	shields[0].alpha = shields[1].alpha = 1;
						shields[2].alpha = 0;
						break;
			case 5 :	shields[0].alpha = shields[1].alpha = 1;
						shields[2].alpha = 0.5;
						break;
			case 6 :	shields[0].alpha = shields[1].alpha = shields[2].alpha = 1;
						break;*/
			default:	paused = 1;
						missile.graphics.command.x += xvelo;
						missile.graphics.command.y += yvelo;
						shields[0].graphics.command.x += xvelo;
						shields[0].graphics.command.y += yvelo;
						shields[1].graphics.command.x += xvelo;
						shields[1].graphics.command.y += yvelo;
						stage2.update();
						alert("Missile intercepted!");
						lastresult = false;
						createjs.Ticker.removeAllEventListeners("tick");
						p.nextplayer();
						break;
		}
		if((role == 0) && (missile.graphics.command.x > 25 * width / 32) ||
			((role == 1) && (missile.graphics.command.x < 7 * width / 32)) ){
			paused = 1;
			dats[role][1] += 1;
			markboard[role].children[1].text = dats[role][1];
			console.log(missile.status);
			alert("Goal!");
			lastresult = true;
			createjs.Ticker.removeAllEventListeners("tick");
			p.nextplayer();
		}
		stage2.update();
	});
	createjs.Ticker.setFPS(60);
	
} ;

p.nextplayer = function () {
	console.log("next"+lastresult);
	stage2.removeChild(missile);
	stage2.removeChild(shields[0]);
	stage2.removeChild(shields[1]);
	if(lastresult){//win, loser +3 coins and set barriers
		failcount = 0;
		if(dats[role][1] == 3){
			alert((role==0?"LEFT":"RIGHT")+" player has scored 3, and has won the game.")
			window.location.reload();
		}
		role = 1 - role;
		dats[role][0] += 3;
		markboard[role].children[3].text = "$"+dats[role][0];
		flags[role] = 1;
		flags[2] = 3;
		text = new createjs.Text(role==0?"LEFT":"RIGHT", "25px Consolas", "#000");
		text.textBaseline = "top";
		text.textAlign = "center";
		text.x = (text.getMeasuredWidth()+30) / 2 + (text.text=="LEFT"?5:0);
		text.y = 0;
		submit.children[1] = text;
		canvas2.onclick = function (){};
		canvas2.onmouseover = function(){};
		canvas2.onmousemove = function(){};
		stage1.update();
		shields[0].alpha = 0;
		stage2.update();
	}
	else{//lose, change side
		failcount++;
		if(failcount == 10){
			alert("Everyone has consecutively failed 5 times, the game ends.\nWinner:"+(dats[0][1]>dats[1][1]?"LEFT":((dats[0][1]<dats[1][1]?"RIGHT":"EVEN"))));
			window.location.reload();
		}
		role = 1 - role;
		text = new createjs.Text(role==0?"LEFT":"RIGHT", "25px Consolas", "#000");
		text.textBaseline = "top";
		text.textAlign = "center";
		text.x = (text.getMeasuredWidth()+30) / 2 + (text.text=="LEFT"?5:0);
		text.y = 0;
		submit.children[1] = text;
		shields[0].alpha = 0;
		flags[2] = 2;
		canvas2.onclick = this.putMissile.bind(this);
		canvas2.onmouseover = function(){};
		canvas2.onmousemove = function(){};
		stage1.update();
		stage2.update();
	}
	return;
}

window.Submit = createjs.promote(Submit, "Container");
}());