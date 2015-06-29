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

    /*判断是否添加验证码*/
    $("#username").change(function () {
            var username = $(this).val();
            var codeBlock = $("#show-code");
            var url = "check/kaptcha";
            ajaxJSON(url, 'POST',true, {username:username}, function (data) {
                if (data.errorCode == 1) {
                    codeBlock.show();
                } else {
                    codeBlock.hide();
                }
            });
        }
    );

    //倒计时函数
    function time(o,wTime){
        if(wTime ==0){
            $(o).attr("disabled",false);
            $(o).val("点击获取");
            $(o).removeClass("btn-disabled");
        }else{
            $(o).attr("disabled",true);
            $(o).addClass("btn-disabled");
            $(o).val("重新发送(" + wTime + ")");
            wTime --;
            setTimeout(function(){time($(o),wTime)},1000)
        }
    }

    $("#sendCode").click(function () {
        $("#sendCode").attr("disabled",true);
        var username = $("#username").val();
        var kaptcha = $("#code").val();
        var $codeFalse = $('#errorMessageDiv');
        var $codeFalseMessage = $('#errorMessage');

        ajaxJSON(
            "/regist/sendSms",'POST',true, {username:username,kaptcha:kaptcha}, function(data){
                if(data.errorCode ==0){
                    setTimeout(function(){time("#sendCode",data.data.needWaitTime)},1000);
                    codeFalseMessage.hide();
                }else{
                    $("#sendCode").attr("disabled",false);
                    $codeFalse.show();
                    $codeFalseMessage.html(data.errorMessage);
                }
            }
        );
    });

    /*图形验证码*/
    $("#code").change(function () {
        var $code = $(this).val();
        var $codeOk = $("#smsErrorMessage");
        var $codeFalse = $('#errorMessageDiv');
        var $codeFalseMessage = $('#errorMessage');

        if ($("#show-code").is(":visible")) {
            var url = "/regist/isAuthcodeValid";
            ajaxJSON(url, 'POST', false,{auth_code:$code}, function (data) {
                if (data.errorCode == 1) {
                    $codeFalse.show();
                    $codeFalseMessage.html("验证码错误");
                    $codeOk.hide();
                } else {
                    $codeOk.show();
                    $codeFalse.hide();
                }
            });
        }

    });


    /*登录*/
    function login() {
        var data = {
            username: $("#username").val(),
            password: $("#password").val(),
            kaptcha: $("#code").val(),
            smscode: $('#tel-code').val(),
            rememberme: $(".article-input").attr("checked")
        };
        var url = "/login/jsonLogin";
        var $codeFalse = $('#errorMessageDiv');
        var $codeFalseMessage = $('#errorMessage');

        ajaxJSON(url, 'POST',false,data, function (data) {
            if (!$(".article-input").attr("checked")) {
                document.cookie = 'syd_login_name=; path=/; domain=.souyidai.com; expires=Thu, 01 Jan 1970 00:00:01 GMT';
            };
            switch (data.errorCode) {
                case 0:
                    $codeFalse.hide();
                    document.location.href = backUrl;
                    return;
                case 11:
                    $('#show-code').show();
                    break;
                case 13:
                    $('#show-sms-code').show();
                    $('#show-code').show();
                    break;
                default:
                    break;
            }
            $codeFalseMessage.html(data.errorMessage);
            $codeFalse.show();
        });
    };

    $('#login-submit').click(function() { login(); });
    $("#loginForm #password").keydown( function(e) {
            var key = e.which;
            if (key == 13) {
                login();
                return false;
            }
        }
        );
    //模拟checkbox
    var $article_input = $(".article-input");
    $(".ico-reg").on("click",function(){
        if($(this).hasClass("input-checked")){
            $(this).removeClass("input-checked");
            $article_input.attr("checked",false);
            //$article_input.attr("data-type","")
        }else{
            $(this).addClass("input-checked");
            $article_input.attr("checked",true)
        }
    });

});





























