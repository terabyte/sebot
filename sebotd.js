

// Standard node.js modules
var exec = require("child_process").exec;
var spawn = require("child_process").spawn;
var util = require("util");
var fs = require("fs");
var path = require("path");
var http = require('http')
var url = require("url")
var querystring = require('querystring');

// 3rd partynode.js modules
var send = require("send");

// Sleepless Inc. modules
require("sleepless")
require("g")("log5");

var PORT = toInt(process.argv[2]) || 12345

var app = http.createServer(function(req, res) {
	var u = url.parse(req.url)
	var path = u.pathname

	if(path == "/api/") {
		var qa = querystring.parse(u.query)
		I("API: "+o2j(qa))

		res.writeHead(200, {"Content-Type": "application/json" });

		var p = spawn( "/usr/bin/python", [ "request.py" ])

		p.stdin.write(o2j(qa));
		p.stdout.pipe(res);
		p.stdin.end();

		p.on("close", function(code) {
			if(code != 0) {
				E("Python return code: "+code);
			}
			res.end();
		});

		return
	}

	I(req.method+" "+path);
	send(req, "./site"+path).pipe(res)		// send static file

}).listen(PORT, function() {
	I("Listening on "+PORT);
})

