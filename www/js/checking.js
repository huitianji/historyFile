/*
 * 注册验证
 * */
$(function() {
	 function ajaxJSON(aurl, theMethod,sync, adata, callback) {
        $.ajax({
            type: theMethod,
            url: aurl,
            data: adata,
            success: callback,
			async: sync,
            dataType: 'json'
        });
    };
	// 验证手机号是否注册
	var is_tel = false;
	function telName(name) {
		$.ajax({
			url : "/regist/isUsernameUsed",
			type : "POST",
			async : false,
			data : {
				username : name
			},
			dataType : 'json',
			success : function(data) {
				// console.log(data.errorCode)
				if (data.errorCode == 0) {
					// 执行
					is_tel = true;
				}
				if (data.errorCode == 1) {
					is_tel = false;
				}
			}
		});
		return is_tel;
	}
	
    var interval;
    function func(o, wTime) {
         interval = setInterval(function() {
             wTime--;
             if (wTime <= 0) {
                 $(o).val("点击获取");
                 $(o).attr("disabled", false);
                 $(o).removeClass("btn-disabled");
                 clearInterval(interval);
                 return;
             }
             $(o).addClass("btn-disabled");
             $(o).attr("disabled", true);
             $(o).val("重新发送(" + wTime + ")");
         }, 1000);
    }
	
    $("#sendCode").on("click",function(){
        var self = $(this);
        var $btnClickCode = $(".btn-click-code");
        var $telVal = $("#tel").val();
		var code = $('#code').val();
        func($btnClickCode,60);
        $.ajax({
            url : "/regist/sendSms",
            type : "POST",
            async : true,
            dataType : 'json',
            data : {
                username : $telVal,
				kaptcha: code
            },
            success : function(data) {

                if (data.errorCode == 0) {
                    if(interval != null){
                        clearInterval(interval);
                    }
                    func($btnClickCode,data.data.needWaitTime);
                } 
            }
        });
    });
    //
    $("#regForm :input").blur(function(){
        var $parents = $(this).parents(".fild-group");
        $parents.find(".error-meg").addClass("onError-empty");// 添加错误
        var $value = $.trim(this.value);

        if($value == ""){
            $parents.find(".error-meg").show();
            $parents.find(".error-receive").html("不能为空");
        }else{
            $parents.find(".error-meg").removeClass("onError-empty");
            //$parents.find(".error-meg").hide();
        }

    });

    //协议checkbox框
    var $article_input = $("#xieyi");
    $article_input.parents(".fild-group").find(".error-meg").addClass("onError");// 添加错误
    $(".article").on("click",".ico-checked",function(){
        var $parents = $(this).parents(".fild-group");
        if($(this).hasClass("input-checked")){
            $(this).removeClass("input-checked");
            $article_input.attr("checked",false);

            $parents.find(".error-meg").show();
            $parents.find(".ico-ok").css("display","none");
            $parents.find(".error-meg").addClass("onError");// 添加错误
            $parents.find(".error-receive").html("请选择协议框");
        }else{
            $(this).addClass("input-checked");
            $article_input.attr("checked",true);

            $parents.find(".ico-ok").css("display","block");
            $parents.find(".error-meg").hide();
            $parents.find(".error-meg").removeClass("onError");// 清除错误
        }
    });
    var telkey = false ;
    var codekey = false ;
    function activeSmsBotton(){
        if(telkey&&codekey){
            $("#sendCode").attr("disabled", false);
            $("#sendCode").removeClass("btn-disabled");
        }else{
	    $("#sendCode").attr("disabled", true);
            $("#sendCode").addClass("btn-disabled");
	}
    }
    //验证码验证发送短信
	/* 验证 */
	$("#regForm :input")
			.change(
					function() {
						var $parents = $(this).parents(".fild-group");
						$parents.find(".error-meg").addClass("onError");// 添加错误
						var $value = $.trim(this.value);						
						// 手机验证
						if ($(this).is("#tel")) {
							/* 检查用户名有没有注册 */
							telName($("#tel").val());
							// console.log(is_tel)
							// /
							var mobile = /^1[34578][0-9]{9}$/;
							var errMsg = "请输入正确的手机号";
							if (!/^1+/.test($value)) {
								$parents.find(".error-meg").show();
								$parents.find(".error-receive").html("目前只支持中国大陆地区的手机号");
								$(this).addClass("error-border");
								telkey=false;
                                activeSmsBotton();	
							} else if ($value == ""
									|| ($value != "" && !mobile.test($value))) {
								$parents.find(".error-meg").show();
								$parents.find(".error-receive").html(errMsg);
								$(this).addClass("error-border");
								telkey=false;
                                activeSmsBotton();
							} else if (!is_tel) {
								$parents.find(".error-meg").show();
								$parents.find(".error-receive").html(
										"已经被注册，请重新输入");
								telkey=false;
                                activeSmsBotton();
							} else {
								$parents.find(".ico-ok").show();
								$parents.find(".error-meg").hide();
								$(this).removeClass("error-border");
								$parents.find(".error-meg").removeClass(
										"onError");// 清除错误
								telkey=true;
								activeSmsBotton();
							}
						}
						

						// tel-code
						if ($(this).is("#tel-code")) {
							// var $val = $(this)
							if ($value == "") {
								$parents.find(".error-meg").show();
								$parents.find(".error-receive").html("验证码不能为空");
								$(this).addClass("error-border");
							} else {
								$parents.find(".error-meg").hide();
								$(this).removeClass("error-border");
								$parents.find(".error-meg").removeClass(
										"onError");// 清除错误
							}
						}
						// 密码验证
						if ($(this).is("#password")) {
							var $len = $.trim(this.value).length;
							// /^[a-zA-Z][A-Za-z0-9_]{5,19}$/ 字母数字或符号
							// /[0-9a-zA-Z`~!@#$%\^&*\(\)-_+={}|\[\];':\",\.\\\/\?\<\>]{10,}/包含字母、数字、符号中的三种，且长度超过10位
							// var
							// ps1=/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$])[0-9a-zA-Z!@#$]{10,20}$/
							// //强
							var ps1 = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$])[0-9a-zA-Z!@#$]{10,20}$/ // 强
							// ^((?=.*?\d)(?=.*?[A-Za-z])|(?=.*?\d)(?=.*?[!@#$%^&])|(?=.*?[A-Za-z])(?=.*?[!@#$%^&]))[\dA-Za-z!@#$%^&]{10,20}$
							// 中
							var $spans = $(this).parent().find(
									".pw-strength span");
							var p1 = ($value.search(/[a-zA-Z]/) != -1) ? 1 : 0;
							var p2 = ($value.search(/[0-9]/) != -1) ? 1 : 0;
							//var p3 = ($value.search(/[^A-Za-z0-9_]/) != -1) ? 1
									//: 0;
                            //~`!@#$%^&*()-_=+[{]}\|;:'",<.>/?
                            var p3 =($value.search(/[~`!@#$%^&*()_=+\[{\]}\|;:\'\",<.>\/?-]/) !=-1) ? 1 : 0;

                            var regp = /[^a-zA-Z0-9~`!@#$%^&*()_=+\[{\]}\|;:\'\",<.>\/?-]/;
							var pa = p1 + p2 + p3;
							if ($len < 6 || $len > 20 || $value == "") {
								$parents.find(".error-meg").show();
								$parents.find(".error-receive").html("密码长度为6-20个字符");
								$(this).addClass("error-border");
								for (var i = 0, len = $spans.length; i < len; i++) {
									$spans.eq(i).removeClass("week in strong");
								}
							}
                            else if(regp.test($value)){
                                $parents.find(".error-meg").show();
                                $parents.find(".error-receive").html("建议使用字母、数字和符号的组合，请勿使用特殊字符");
                                $(this).addClass("error-border");
                            }
                            else if (pa == 1) {
								for (var i = 0, len = $spans.length; i < len; i++) {
									$spans.eq(0).addClass("week");
									$spans.eq(i).removeClass("in strong");
								}
								//$parents.find(".error-receive").html("建议使用字母、数字和符号的组合");
								$(this).removeClass("error-border");
								$parents.find(".error-meg").removeClass("onError");//
                                $parents.find(".ico-ok").show();
                                $parents.find(".error-meg").hide();
							} else if ((pa == 2 || pa ==3) && $value.length < 10 ) {
								for (var i = 0, len = $spans.length; i < len; i++) {
									$spans.eq(0).addClass("in");
									$spans.eq(1).addClass("in");
									$spans.eq(i).removeClass("strong");
								}
								$parents.find(".ico-ok").show();
								//$parents.find(".error-receive").html("建议使用字母、数字和符号的组合");
								$parents.find(".error-meg").hide();
								$(this).removeClass("error-border");
								$parents.find(".error-meg").removeClass("onError");// 清除错误
							}
                            else if (pa == 3 && $value.length >=10) {
                                for (var i = 0, len = $spans.length; i < len; i++) {
                                    $spans.eq(i).addClass("strong");
                                }
                                $parents.find(".ico-ok").show();
                                $parents.find(".error-meg").hide();
                                $parents.find(".error-meg").removeClass("onError");// 清除错误
                            }
                            else {
								$parents.find(".ico-ok").show();
								$parents.find(".error-meg").hide();
								$(this).removeClass("error-border");
								$parents.find(".error-meg").removeClass("onError");// 清除错误
							}
						}
						// /两次输入密码
						if ($(this).is("#confirmpassword")) {
							if ($value == "") {
								$parents.find(".ico-ok").hide();
							} else if ($value != $.trim($("#password").val())) {
								$parents.find(".error-meg").show();
								$parents.find(".error-receive").html("两次密码不一致");
								$(this).addClass("error-border");
							} else {
								$parents.find(".ico-ok").show();
								$parents.find(".error-meg").hide();
								$(this).removeClass("error-border");
								$parents.find(".error-meg").removeClass(
										"onError");// 清除错误
							}
						}
						//图片验证码
						if($(this).is('#code')){
							var $code = $(this).val();
							var $codeOk = $(this).parent().next().find('.ico-ok');
							var $codeFalse = $(this).parent().next().find('.error-meg');
							var $codeFalseMessage = $(this).parent().next().find('.error-meg').find('.error-receive');
							var url = "/regist/isAuthcodeValid";
							ajaxJSON(url, 'POST', false,{auth_code:$code}, function (data) {
								if (data.errorCode == 1) {
									$codeFalse.show();
									$codeFalseMessage.text("图片验证码错误");
									$codeOk.hide();
									codekey = false;
									activeSmsBotton(); 
									$(this).addClass("error-border");
								} else {
									$codeOk.show();
									$codeFalse.hide();
									codekey = true;
									activeSmsBotton();
									$(this).removeClass("error-border");
									$parents.find(".error-meg").removeClass(
										"onError");// 清除错误
								}
							});						
						}
					}).keyup(function() {				
			}).focus(function() {
			});

	// 提交，最终验证。
	$("#reg-submit").click(function() {
        var $xieyi = $("#xieyi");
        if($xieyi[0].checked == false){
            $xieyi.parents(".fild-group").find(".error-meg").show();
            $xieyi.parents(".fild-group").find(".error-receive").html("请选择协议框");
        }
		$("#regForm :input.required").trigger("blur");
        var $onErrorEmpty = $("#regForm .onError-empty").length;
        if($onErrorEmpty){
            return false;
        }
		var $onError = $("#regForm .onError").length;
		if ($onError) {
			return false;
		}
		$("#reg-submit").attr('disabled',true);
		$('#reg-submit').addClass('btn-disabled');
		$.ajax({
			url : "/regist/doRegist",
			type : "POST",
			async : false,
			data : {
				username : $("#tel").val(),
				password : $("#password").val(),
				confirmpassword : $("#confirmpassword").val(),
				smscode : $("#tel-code").val(),
				kaptcha: $('#code').val()
			},
			dataType : 'json',
			success : function(data) {
				if (data.errorCode == 0) {					
					document.location.href = 'https://www.souyidai.com/guide/index.jsp';
					return;
				} else {
					//alert(data.errorMessage);
					$("#submitError").text(data.errorMessage);
					$("#submitError").show();
					$("#reg-submit").attr('disabled',false);
					$('#reg-submit').removeClass('btn-disabled');
					changeit();
				}

			}
		});

	});

});

//
$(function() {
	$input = $(".checking").find("input");
	for (var i = 0, len = $input.length; i < len; i++) {
		// console.log($input.eq(i))
		// if(event.keyCode==13)
		// {
		// for(var i=0;i <arr.length-1;i++) //循环到arr数组的长度减一，最后一个就不用循环了
		// {
		// if(arr[i]==src)
		// {
		// eval( "document.form."+arr[i+1]+ ".focus() ");
		// }
		// }
		// }
		// return false;
	}
});
