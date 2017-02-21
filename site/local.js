

log = function(s) { console.log(s); }

cur_qst = null		// the currently displayed question


api = function(act, data, cb) {

	log("api >>--> "+act+" "+o2j(data));
	var url = "/api/?action="+act+"&data="+encodeURIComponent(o2j(data))
	$.get(url, function(r) {
		log("ajax <--<< "+o2j(r));
		cb(r)
	});
}


admin = localStorage.getItem("admin") === "true"

update_admin = function() {
	if(admin) {
		$(".admin").show();
		$(".active_false").show();
	}
	else {
		$(".admin").hide();
		$(".active_false").hide();
	}
}
clk_toggle_admin_controls = function() {
	admin = !admin;
	localStorage.setItem("admin", ""+admin)
	update_admin();
}


clk_new_topic = function() {
	log("new topic");
}

clk_submit = function() {
	var text = $("#other").val().trim()
	if(text) {
		api("createRsp", {qid: cur_qst.qid, text:text}, function(r) {
			reload()
		})
	}
}

clk_delete_response = function(evt) {
	var rsp = evt.target.parentElement.rsp;
	if(confirm("Are you sure you want to delete response "+rsp.rid)) {
		if(rsp && rsp !== "other") {
			api("deleteRsp", { rid: rsp.rid }, function(r) {
				reload()
			})
		}
	}
}


clk_edit_response = function(evt) {
	var rsp = evt.target.parentElement.rsp;
	if(rsp && rsp !== "other") {
		var txt = prompt("Edit the text of this response", rsp.text);
		if(txt) {
			api("updateRsp", { rid: rsp.rid, text: txt }, function(r) {
				reload()
			})
		}
	}
}

clk_toggle_active = function(evt) {
	var rsp = evt.target.parentElement.rsp;
	if(rsp && rsp !== "other") {
		api("updateRsp", { rid: rsp.rid, text: rsp.text, active: (!rsp.active) }, function(r) {
			reload()
		})
	}
}

clk_link = function(evt) {
	var rsp = evt.target.parentElement.rsp;
	if(rsp) {

		var qid = rsp.next_qid;
		if(qid) {
			if(!confirm("This response is already linked to question "+qid+".  Sure you want to continue?")) {
				return;
			}
		}
		var text = prompt("Enter the text of the next question or a question ID prefixed with #", "");
		if(!text || !text.trim()) {
			return;
		}

		text = text.trim();
		if(text == "null") {
			// clear link
			api("updateRsp", { rid: rsp.rid, next_qid: null }, function(r) {
				reload()
			})
		}
		else
		if( /^#[^\s]+$/.test(text) ) {
			// ID of an existing question
			var qid = text.substr(1)
			api("updateRsp", { rid: rsp.rid, next_qid: qid }, function(r) {
				reload()
			})
		}
		else {
			api("createQst", { text: text }, function(r) {
				var qid = r.qid;
				api("updateRsp", { rid: rsp.rid, next_qid: qid }, function(r) {
					jmp("/?qid="+qid)
				})
			})
		}
	}
	
}

clk_edit_question = function() {
	var qst = cur_qst
	var txt = prompt("Edit the text of this question", qst.text);
	if(txt) {
		api("updateQst", { qid: qst.qid, text: txt }, function(r) {
			reload()
		})
	}
}

clk = function(evt) {
	var k = "clk_" + evt.target.value.toId()
	log(k+"()")
	evt.preventDefault();
	var f = window[ k ]
	f.apply(this, arguments)
	return false;
}


response_chosen = function(el, qst, rsp) {

	$(el).find("x").each(function() {
		if(this.getAttribute("start_conf") !== null) {
			// this is a starting-confidence response.
			var s = "Initial confidence: " + toInt(rsp.text);
			localStorage.setItem("conf", s);
			$(".conf").html(s);
		}
		else
		if(this.getAttribute("end_conf") !== null) {
			// this is a subsequent or ending confidence response.
			var oldc = localStorage.getItem("conf");
			if(oldc !== null) {
				var s = "Confidence change: "+oldc+"% &rarr; "+toInt(rsp.text)+"%"
				localStorage.setItem("conf", s);
				$(".conf").html(s)
			}
		}

	});

	var qid = rsp.next_qid
	if(qid) {
		jmp("/?qid="+qid);
	}
	else {
		// end the conversation
		jmp("/?done=1");
	}

}

load_qst = function(qid) {
	log("load qst "+qid)
	cur_qst = null;
	api("getQst", {qid: qid}, function(r) {
		if(r.error) { jmp("/"); return }

		var qst = r.data
		cur_qst = qst

		replicate("tpl_qst", [qst], function(e, d, i) {
			$(e).find("input[type=button]").click(clk)
		});

		var rsps = qst.responses
		var a = []
		for(var k in rsps) {
			a.push(rsps[k])
		}
		replicate("tpl_rsp", a, function(e, d, i) {
			e.rsp = d;

			$(e).click(function(evt) {
				response_chosen(e, qst, d);
			})

			$(e).find("input[type=button]").click(clk)
		})
		update_admin();
		$(".page.talk").show();
	});
}

clear_conf = function() {
	log("clear_conf");
	localStorage.removeItem("conf")
	$(".conf").html("");
}


$(document).ready(function() {
	log("doc ready");

	$(".page").hide()

	$("input[type=button]").click(clk)

	replicate("tpl_qst", []);
	replicate("tpl_rsp", []);

	var qd = getQueryData()

	var qid = qd.qid
	if(qid) {
		$(".conf").html(localStorage.getItem("conf"));
		load_qst(qid)
	}
	else {
		clear_conf();
		if(qd.done) {
			$(".page.finish").show();
		}
		else {
			jmp("/?qid=q1");
			update_admin();
		}
	}

});



