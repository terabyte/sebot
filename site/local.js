

log = function(s) { console.log(s); }

db = {
	seq: 0,
	topics: {
		"karma": { first_sq: "q1" }
	},
	questions: {
		"q1": {
			sq_id: "q1",
			text: "Do you have 5 minutes for a quick interview?",
			responses: [
				{ ir_id: "r2", active: true, text: "Yeah, sure!", next_sq_id: "q3"  },
				{ ir_id: "r4", active: true, text: "No, sorry.", next_sq_id: "q5"  },
			]
		}
	},
	responses: {},
}

db_save = function() { localStorage.setItem("db", o2j(db)) }


api = function(act, data, cb) {
	window[ "act_" + act ](data, cb)
}

act_getSQ = function(data, cb) {
	cb(db.questions[data.sq_id]);
}

clk_new_topic = function(evt) {
	log("new topic");
}

clk_continue = function(evt) {
}


$(document).ready(function() {

	log("doc ready");

	var json = localStorage.getItem("db");
	if(json) {
		db = j2o(json);
	}

	$("input[type=button]").click(function(evt) {
		window[ "clk_" + this.value.toId() ](evt);
	});
	$("input[data=other]").change(function(evt) {
		$("#other").show();
	});

	replicate("tpl_qst", []);
	replicate("tpl_rsp", []);

	api("getSQ", {sq_id: "q1"}, function(r) {
		fill(r);
	});

});


fill = function(qst) {
	log("qst="+o2j(qst))

	replicate("tpl_qst", [qst]);

	var rsps = qst.responses
	var a = []
	for(var k in rsps) {
		a.push(rsps[k])
	}
	replicate("tpl_rsp", a, function(e, d, i) {
		$(e).find("input").change(function() {
			$("#other").hide();
		});
	})
}



