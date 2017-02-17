

// Standard node.js modules
var exec = require("child_process").exec;
var util = require("util");
var fs = require("fs");
var path = require("path");
var http = require('http')
var url = require("url")

// 3rd partynode.js modules
var send = require("send");

// Sleepless Inc. modules
require("sleepless")
require("g")("log5");

var app = http.createServer(function onRequest (req, res) {
	var u = url.parse(req);
	I("u="+o2j(u));
	send(req, u.pathname).pipe(res)
}).listen(12345)

