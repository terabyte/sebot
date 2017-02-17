

// Standard node.js modules
var exec = require("child_process").exec;
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

var app = http.createServer(function onRequest (req, res) {
	var u = url.parse(req.url)
	var path = u.pathname
	I(req.method+" "+path);

	if(path.startsWith("/api/")) {
		var qa = querystring.parse(u.query)
		I("API: "+o2j(qa))
		return
	}

	send(req, "./site"+path).pipe(res)		// send static file

}).listen(12345)

