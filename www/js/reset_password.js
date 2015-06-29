/*
 *验证密码
 * */
$(function() {
    $(".checking :input").keyup(function() {
        var $parents = $(this).parents(".fild-group");
        $parents.find(".error-meg").addClass("onError"); //添加错误
        var $spans = $('.pw-strength span');
        var $value = $.trim(this.value);

        if ($(this).is("#password")) {
            var $len = $.trim(this.value).length;
            var ps1 = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$])[0-9a-zA-Z!@#$]{10,20}$/ // 强
            var $spans = $(this).parent().find(
                ".pw-strength span");
            var p1 = ($value.search(/[a-zA-Z]/) != -1) ? 1 : 0;
            var p2 = ($value.search(/[0-9]/) != -1) ? 1 : 0;
            var p3 = ($value.search(/[~`!@#$%^&*()_=+\[{\]}\|;:\'\",<.>\/?-]/) != -1) ? 1 : 0;
            var regp = /[^a-zA-Z0-9~`!@#$%^&*()_=+\[{\]}\|;:\'\",<.>\/?-]/;
            var pa = p1 + p2 + p3;
            if ($len < 6) {
                $parents.find(".ico-ok").hide();
                $parents.find(".error-meg").hide();
                $(this).removeClass("error-border");
                $parents.find(".error-meg").removeClass("onError"); // 清除错误
            } else if ($len > 20 || $value == "") {
                $parents.find(".error-meg").show();
                $parents.find(".error-receive").html("密码长度为6-20个字符");
                $(this).addClass("error-border");
                for (var i = 0, len = $spans.length; i < len; i++) {
                    $spans.eq(i).removeClass("week in strong");
                }
            } else if (regp.test($value)) {
                $parents.find(".error-meg").show();
                $parents.find(".error-receive").html("建议使用字母、数字和符号的组合，请勿使用特殊字符");
                $(this).addClass("error-border");
            } else if (pa == 1) {
                for (var i = 0, len = $spans.length; i < len; i++) {
                    $spans.eq(0).addClass("week");
                    $spans.eq(i).removeClass("in strong");
                }
                $(this).removeClass("error-border");
                $parents.find(".error-meg").removeClass("onError");
                $parents.find(".ico-ok").show();
                $parents.find(".error-meg").hide();
            } else if ((pa == 2 || pa == 3) && $value.length < 10) {
                for (var i = 0, len = $spans.length; i < len; i++) {
                    $spans.eq(0).addClass("in");
                    $spans.eq(1).addClass("in");
                    $spans.eq(i).removeClass("strong");
                }
                $parents.find(".ico-ok").show();
                $parents.find(".error-meg").hide();
                $(this).removeClass("error-border");
                $parents.find(".error-meg").removeClass("onError"); // 清除错误
            } else if (pa == 3 && $value.length >= 10) {
                for (var i = 0, len = $spans.length; i < len; i++) {
                    $spans.eq(i).addClass("strong");
                }
                $parents.find(".ico-ok").show();
                $parents.find(".error-meg").hide();
                $parents.find(".error-meg").removeClass("onError"); // 清除错误
            } else {
                $parents.find(".ico-ok").show();
                $parents.find(".error-meg").hide();
                $(this).removeClass("error-border");
                $parents.find(".error-meg").removeClass("onError"); // 清除错误
            }
        }
        ///两次输入密码
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
                $parents.find(".error-meg").removeClass("onError"); //清除错误
            }
        }
        //
    });

    $("#password").blur(function() {
        var $parents = $(this).parents(".fild-group");
        $parents.find(".error-meg").addClass("onError"); //添加错误
        var $spans = $('.pw-strength span');
        var $value = $.trim(this.value);
        var $len = $.trim(this.value).length;
        if ($len < 6) {
            $parents.find(".error-meg").show();
            $parents.find(".error-receive").html("密码长度为6-20个字符");
            $(this).addClass("error-border");
            for (var i = 0, len = $spans.length; i < len; i++) {
                $spans.eq(i).removeClass("week in strong");
            }
        } else {
		    $parents.find(".error-meg").removeClass("onError");
		}
    });

    $('#reset').on("click", function() {
		$(".checking :input").trigger("blur");
        var $onError = $(".checking .onError").length;
        if ($onError) {
            return false;
        }

		$(".checking :input").trigger("keyup");
        $onError = $(".checking .onError").length;
        if ($onError) {
            return false;
        }

        $.ajax({
            url: "/password/reset",
            type: "POST",
            async: false,
            data: {
                username: $('#username').val(),
                newpassword: $('#password').val(),
                confirmpassword: $('#confirmpassword').val()
            },
            dataType: 'json',
            success: function(data) {
                if (data.errorCode == 302) {
                    window.location.href = data.errorMessage;
                    return;
                }
                if (data.errorCode == 0) {
                    //执行
                    window.location.href = "http://passport.souyidai.com/password/resetok";
                }
                if (data.errorCode == 1) {
                    alert(data.errorMessage);
                }
            }
        });
    });


    //
});