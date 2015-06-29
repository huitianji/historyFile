/*
* 找回密码
* */
$(function(){
    //验证手机号是否存在
    var is_tel = false;
    function telName(name){
        $.ajax({
            url: "/password/isUsernameUsed",
            type:"POST",
            async: false,
            data: {username:name},
            dataType:'json',
            success: function(data){
                //console.log(data.errorCode)
                if(data.errorCode == 0){
                    //执行
                    is_tel = true;
                }
                if(data.errorCode == 1){
                    is_tel = false;
                }
            }
        });
    }

    var submitFindPsd = function(){
        $.ajax({
            url:'/password/findpassword',
            type:'POST',
            data:{
                username: $('#telname').val(),
                kaptcha: $('#code').val()
            },
            dataType:'json',
            success: function(data){
            	if (data.errorCode == 302) {
					window.location.href = data.errorMessage;
					return;
				}
                if(!data.errorCode){
                    window.location.reload();
                }else{
                	$("#auth_image").attr("src", "/authimage.jpg?" + Math.random());
                    $('.login-msg').show();
                    $('.login-msg span.error-receive').text(data.errorMessage);
                }
            }
        });
    }

    $("#tijiao").on("click",function(){
        $('.login-msg').hide();
        submitFindPsd();
    });

    var validateSmsSubmit = function(){
        $.ajax({
            url:'/password/find_password_sms',
            data:{
                smscode: $('#smscode').val(),
                username: $("#telname").val() || $('.fild-center').eq(0).find('p').text()
            },
            type:'POST',
            dataType:'json',
            success: function(data){
            	if (data.errorCode == 302) {
					window.location.href = data.errorMessage;
					return;
				}
                if(!data.errorCode){
                	window.location.reload();
                }else{
                    $('.login-msg').show();
                    $('.login-msg span.error-receive').text(data.errorMessage);
                }
            }
        });
    }

    $("#sendsms").on("click",function(){
        $('.login-msg').hide();
        validateSmsSubmit();
    });

    var $errorRec = $(".add_error_box").find(".error-receive");
    if($errorRec.html() != ""){
        $(".add_error_box").css("display","block")
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

    /*执行发送验证码函数*/
    var $btnClickCode = $("#sendCode");

    if(typeof(umobile) == 'undefined'){
        $btnClickCode.attr("disabled",true);
        $btnClickCode.addClass("btn-disabled");
    }
    $('#telname').on('input propertychange',function(){
        var val = $(this).val();
        var mobile = /^1[34578][0-9]{9}$/;
        if(mobile.test(val) && !$btnClickCode.attr("disabled")){
            $btnClickCode.attr("disabled",false);
            $btnClickCode.removeClass("btn-disabled");
        }
    });
    $("#sendCode").on("click",function(){
        $(this).addClass("btn-disabled");
        $(this).attr("disabled", true);
        func($btnClickCode,60);
        var $parents = $(this).parents(".fild-group");
        var $telVal = $("#telname").val() || $('.fild-center').eq(0).find('p').text();
            $.ajax({
                url: "/password/send_sms",
                type:"post",
                async: false,
                dataType:'json',
                data: {username:$telVal,time:new Date().getTime()},
                success: function(data){
                	if (data.errorCode == 302) {
    					window.location.href = data.errorMessage;
    					return;
    				}
                    if(data.errorCode == 0){
                        if(interval != null){
                            clearInterval(interval);
                        }
                        func($btnClickCode,data.data.needWaitTime);
                        $parents.find(".error-meg").hide();
                        $(this).removeClass("error-border");
                        //setTimeout(function(){time($btnClickCode,data.data.needWaitTime)},1000);
                    }else{
                        //console.log(data.data.desc);
                        if(data.data != undefined){
                            $parents.find(".error-meg").show();
                            $parents.find(".error-receive").html(data.data.desc);
                        } else {
                        	$parents.find(".error-meg").show();
                            $parents.find(".error-receive").html(data.errorMessage);
                        }
                    }
                }
            });
    });
});




















