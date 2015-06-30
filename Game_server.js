var http = require('http'), fs = require('fs'), md5 = require('MD5'), 
	webSocketServer = require('websocket').server, header = require('./header.js');
var first = true;
var clients = [];
var records = [];
readrec();

var server = http.createServer(function(req, res){
}).listen(header.port, header.address, function(){
	console.log('Game server running at http://' + header.address + ':' + header.port + '/');
});

var wsserver = new webSocketServer({
	httpServer:server
});
var umap = {}, pmap = {};
wsserver.on('request', function(request){
	var user = md5(String(Date.now ? Date.now() : (new Date().getTime())));
	var ret = {'from':'server', 'content':user};
	var connection = request.accept(null, request.origin);
	connection.sendUTF(JSON.stringify(ret));
	umap[user] = connection;
	//if (clients.length > 0){
	//}
	//else
	clients.push(user);
	console.log('clients queue:', clients);
	console.log('pmap:', pmap);
	connection.on('message', function(message){
		var data = JSON.parse(message.utf8Data);
		if(data.record !== undefined){
			console.log("rec recvd:"+data.record);
			records.push(data.record);
			console.log(records);
			if(records.length > 5){
				records.shift();
			}
			writerec();
		}
		if(data.req !== undefined && data.req == "rec"){
			umap[user].sendUTF(JSON.stringify({req:"rec",rec:records}));
		}
		if (pmap[data.user] === undefined){
			console.log('unpaired', data);
			if(data.tcode !== undefined){
				console.log("tcode:"+data.tcode);
				umap[user].tcode = data.tcode;
				var ind = -1;
				for(var i = 0; i < clients.length; i++){
					if(clients[i] == user)
						continue;
					if(umap[clients[i]].tcode !== undefined && umap[clients[i]].tcode == umap[user].tcode){
						ind = i;
						break;
					}
				}
				if(ind != -1){
					pmap[user] = clients[ind];
					pmap[clients[ind]] = user;
					//generate 2*2 random barriers
					var bar = ["initbar", [],[]];
					for(var j = 1; j < 3; j++)
					for(var k = 0; k < 2; k++)
					{
						var x, y;
						do{
							x = Math.random();
							x *= (9*960/32 - 30);
							x += 7*960/32 +15;
							x = (j == 1)?x:(960-x);
							y = Math.random();
							y *= (450 - 30)
							y += 15;}while((k != 0 ) && (checkx(x, y, j, bar)));
						bar[j][k] = [x, y];
					}
					console.log("pairing:"+user+" "+pmap[user]);
					umap[user].sendUTF(JSON.stringify(bar));
					umap[pmap[user]].sendUTF(JSON.stringify(bar));
					clients.splice(ind);
					clients.splice(clients.indexOf(user));
				}
				else
					console.log("no pair");
			}
		}
		else{
			console.log('paired', data);
			umap[pmap[data.user]].sendUTF(data.content);
		}
	});
	connection.on('close', function(connection){
		var left = pmap[user];
		if (left === undefined)
			clients.shift();
		else{
			clients.push(left);
			delete pmap[user];
			delete pmap[left];
			umap[left].sendUTF(JSON.stringify({signal:"close"}));
		}
		delete umap[user];
		console.log(user, 'close');
	});
});
function checkx(x, y, player, bar) {
	for(var i = 0; i<bar[player].length; i++){
		var xdist = Math.abs(x - bar[player][i][0]);
		var ydist = Math.abs(y - bar[player][i][1]);
		if(Math.sqrt(xdist*xdist+ydist*ydist) <= 30)
			return true;
	}
	return false;
};
function readrec(){
	var filerecs;
	filerecs = fs.readFileSync('./recs.txt', 'utf-8');
	console.log("fr:"+filerecs);
	records = (JSON.parse(filerecs).content);
};
function writerec(data) {
	var datastream = JSON.stringify({content:records});
	fs.writeFileSync('./recs.txt', datastream);
}