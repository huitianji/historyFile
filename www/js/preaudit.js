$.fn.extend({
	"none" : function(){
		$(this).css("display", "none");
	},
	"block" : function() {
		$(this).css("display", "block");
	},
	"disable" : function() {
		$(this).attr("disabled","disabled");
	},
	"enable" : function() {
		$(this).removeAttr("disabled");
	},
	"id" : function() {
		return $(this).attr("id");
	}
});
$(function() {
	var syd = new Object();
	syd.version = $("body").attr("version");
	var answers = {};
	function init() {
		$("#N").closest(".fild-group").none();
		$("#O").disable();
	}
	function add_answer(id, value, version) {
		if (answers[id] == null) {
			answers[id] = [];
		}
		var answer = {};
		answer["time"] = new Date().getTime();
		answer["version"] = syd.version;
		answer["contents"] = value;
		answers[id].push(answer);
	}
	$(":radio").change(function() {
		add_answer($(this).attr("name"), $(this).val());
	})
	$("input").focus(function() {
		if (this.origin_value != null) {
			$(this).val(this.origin_value);
		}
		if (this.alert == null) {
			this.alert = $(this).closest(".fild-group").children(".error-box:eq(0)");
		}
		this.alert.children(".error-meg:eq(0)").none();
	})
	$("#M").change(function() {
		if ($(this).val() == "-1") {
			$("#N,#O").disable();
			return;
		}
		var childs = $(this).children();
		for (var i = childs.length - 1; i >= 0; --i) {
			$("#" + childs.eq(i).attr("child")).closest(".fild-group").none();
		}
		var child = $(this).children("[value=" + $(this).val() + "]").attr("child");
		$("#" + child).enable();
		$("#" + child).closest(".fild-group").block();
	})
	$("select").bind({
		"change" : function() {
			if ($(this).val() != "-1") {
				$(this).closest(".fild-group").children(".error-box:eq(0)").children().none();
				add_answer($(this).id(), $(this).val(), $(this).attr("version"));
			}
		},
		"blur" : function() {
            if ($(this).val() == "-1") {
            	$(this).closest(".fild-group").find(".error-meg:eq(0)").block();
            	$(this).closest(".fild-group").find(".ico-ok:eq(0)").none();
			} else {
				$(this).closest(".fild-group").find(".error-meg:eq(0)").none();
				$(this).closest(".fild-group").find(".ico-ok:eq(0)").block();
			}
		}
	});
	$("#A").change(function() {
		var a = $("#A").val();
		var links = $("#A>[value=" + a + "]").attr("link");
		$("#C").children(":gt(0)").remove();
		if (typeof(links) != "undefined") {
			var arr = links.split(";");
			for (var key in arr) {
				var val = arr[key].split(",")[0];
				$("#C").append("<option value='" + val + "'>" + val + "个月</option>");
			}
		}
	});
	$("input").bind("copy cut paste",function(e){
        return false;
    });
    $(":radio").click(function() {
    	$(this).closest(".fild-group").find(".ico-ok").block();
    });
	$("input:not(#U,#V,:radio,#phone,#sms_code)").bind({
		"keyup" : function() {
			var res, id = $(this).id();
			if (id == "D" || id == "E") {
			    res = input_num_check($(this));
			} else {
				res = input_int_check($(this));
			}
			if (res == true) {
				this.alert.children(".error-meg:eq(0)").none();
			} else {
				this.alert.find(".error-receive:eq(0)").text(res);
				this.alert.children(".error-meg:eq(0)").block();
				this.alert.children(".ico-ok").none();
			}
			if (this.content == null || $(this).val() != this.content) {
				add_answer(id, $(this).val());
			}
			this.content = $(this).val();
		},
		"blur" : function() {
			var res = input_num_check($(this)), id = $(this).id();
			if (this.alert == null) {
				this.alert = $(this).closest(".fild-group").children(".error-box:eq(0)");
			}
			if (res == true) {
				this.origin_value = $(this).val();
				this.alert.children(".error-meg:eq(0)").none();
				this.alert.children(".ico-ok").block();
				if (id == "D" || id == "E") {
				    res = input_num_format($(this));
				} else {
					res = input_int_format($(this));
				}
				if (res != false) {
					$(this).val(res);
				}
			} else {
				this.alert.find(".error-receive:eq(0)").text(res);
				this.alert.children(".error-meg:eq(0)").block();
			}
		}
	});
	
	function run(time, flag) {	
		var inter = setInterval(function(){
			$("#code").attr("value", flag + "(" + time + "秒)")
			if (time-- <= 0) {
				clearInterval(inter);
				$("#code").attr("value", "获取验证码");
				$("#code").removeAttr("disabled");
			}
	    }, 1000);
	} 
	$("#U,#V").keyup(function() {
		var obj = $(this).closest(".fild-group").children(".error-box:eq(0)");
		if ($(this).val().length != 0) {
			add_answer($(this).id(), $(this).val());
		}
	})
	
	$("#U").blur(function() {
		var val = $(this).val();
		var nregex =  /[\u4E00-\u9FA5]{1,10}((·|•)?[\u4E00-\u9FA5]{1,8})*/;
		var obj = $(this).closest(".fild-group").children(".error-box:eq(0)");
		if (nregex.test(val)) {
			obj.children(".error-meg:eq(0)").none();
			obj.children(".ico-ok").block();
			add_answer($(this).id(), $(this).val());
		} else {
			obj.find(".error-receive:eq(0)").text("请填写真实姓名");
			obj.children(".error-meg:eq(0)").block();
		}
	});
	$("#V").blur(function() {
		var val = $(this).val();
		var idregex = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/;
		var obj = $(this).closest(".fild-group").children(".error-box:eq(0)");
		if (idregex.test(val)) {
			obj.children(".error-meg:eq(0)").none();
			obj.children(".ico-ok").block();
			add_answer($(this).id(), $(this).val());
		} else {
			obj.find(".error-receive:eq(0)").text("请填写有效的身份证号");
			obj.children(".error-meg:eq(0)").block();
		}
	});
	$("#phone").keyup(function() {
		var val = $(this).val();
		val = val.replace(/^0|[^\d+]/g,"");
		$(this).val(val);
	});
	$("#phone").blur(function() {
		var val = $(this).val();
		var pregex = /^1[34578][0-9]{9}$/;
		var obj = $(this).closest(".fild-group").children(".error-box:eq(0)");
		if (pregex.test(val)) {
			obj.children(".error-meg:eq(0)").none();
			obj.children(".ico-ok").block();
		} else {
			obj.find(".error-receive:eq(0)").text("请填写正确的手机号");
			obj.children(".error-meg:eq(0)").block();
		}
	})
	$("#code").click(function() {
		$("#phone").closest(".fild-group").find(".error-meg").none();
		var val = $("#phone").val();
		var regex = /^1[34578][0-9]{9}$/;
		if (regex.test(val)) {
			$("#code").attr("disabled", "true");
			$.post("/shoufudai/get_code", {phone_num : val}, function(resp){  
		        if (resp.errorCode == 0) {
		        	alert("短信已下发");
		        	run(resp.data.needWaitTime, "重新获取");
		        } else {
		        	alert(resp.errorMessage.message);
		        	run(resp.errorMessage.needWaitTime, "重新获取");
		        }
			}, "json"); 
		} else {
			$("#phone").closest(".fild-group").find(".error-meg").block();
		}
	})

	$("#S,#T").closest(".fild-group").hide();
	$("#K").change(function() {
		if ($(this).val() == '1') {
			$("#S,#T").closest(".fild-group").show();
		} else {
			$("#S,#T").closest(".fild-group").hide();
		}
	});
	$(".btn-borrow-submit").click(function() {
		$("select,input").each(function() {
			if (this.origin_value != null) {
				$(this).val(this.origin_value);
			}
			$(this).trigger("blur");
		})
		var rl = $(":radio:checked").length;
		if (rl == 0) {
			$(":radio").closest(".fild-group").find(".error-receive:eq(0)").text("请选择");
			$(":radio").closest(".fild-group").find(".error-meg:eq(0)").block();
		}
		if ($(".fild-group:visible .error-meg:visible").length == 0) {
			var phone = $("#phone").val();
			var code_num = $("#sms_code").val();
			$.post("/shoufudai/save_all", {content : JSON.stringify(answers), phone_num : phone, id5 : $("#V").val(), sms_code : code_num, jd_param_p : $("#jd_param_p").val(), jd_param_s : $("#jd_param_s").val()}, function(resp) {
				if (resp.errorCode == 0) {
					window.location.href="/shoufudai/aip_suc";
				} else {
					alert(resp.errorMessage);
				}
			}, "json");
		}
	});
	function input_num_common_check(ele) {
		if (!(ele instanceof jQuery && ele.attr("type") == "text")) {
		    return;
		}
		var num = ele.val();
		if (num == "") {
			return "请输入" + ele.parent().prev("label").text();
			//return "内容不能为空";
		}
	    var regex = /[^\d.-]/;
	    if (regex.test(num)) {
	    	ele.val(num.replace(/[^\d.-]/g, ''));
	        return "只能输入数字";
	    } 
	    regex = /^-/;
	    if (regex.test(num)) {
	        ele.val(num.replace(/^-/g, ''));
	        return "只能输入正数";
	    } 
	    return true;
	}

	function input_num_check(ele) {
		var res = input_num_common_check(ele);
		if (res == true) {
			var num = ele.val();
	        regex = /-|^\.|\d+(?:\.\d*){2,}/;
	        if (regex.test(num)) {
	            ele.val(num.replace(/-|^\.|\d+(?:\.\d*){2,}/g, ''));
	            return "只能输入数字";
	        }
	        return true;
		}
		return res;
	}
	
	function input_common_format(ele) {
		if (!(ele instanceof jQuery && ele.attr("type") == "text" && input_num_common_check(ele))) {
		    return false;
		}
		var val = ele.val();
		var regex = /^0+(\d+.*)/;
		val = val.replace(regex, "$1");
		regex = /(\.\d)\d*/;
		return val.replace(regex, "$1");
	}

	function input_num_format(ele) {
		var res = input_common_format(ele);
		if (res == false) {
			return false;
		}
		var regex = /(\d+)\.$/;
		res = res.replace(regex, "$1");
		regex = /(\d)(?=(?:\d{3})+(?:\.\d+)?$)/g;
		return res.replace(regex, "$1,");
	}

	function input_int_format(ele) {
		var res = input_common_format(ele);
		if (res == false) {
			return false;
		}
		var regex= /(.)(?=(?:\d{3})+$)/g;
		return res.replace(regex, "$1,");
	}

	function input_int_check(ele) {
		var res = input_num_common_check(ele);
		if (res == true) {
			var num = ele.val();
	        regex = /\./;
	        if (regex.test(num)) {
	            ele.val(num.replace(/\./g, ''));
	            return "只能输入整数";
	        }
	        return true;
		}
		return res;
	}
	init();
});