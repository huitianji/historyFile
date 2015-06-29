$(function() {


    var gTarget;
    var showPopup = function($popupMask, $popup) {
        var $winW = $(window).width(),
            $winH = $(window).height(),
            $dH = $("body").height(),
            $left, $top;
        $popupMask.css({
            "width": $winW + "px",
            "height": $dH + "px"
        });
        $left = ($winW - $popup.width()) / 2;
        $top = ($winH - $popup.height()) / 2;
        $popup.css({
            "left": $left + "px",
            "top": $top + $(window).scrollTop() + "px",
            "display": "block"
        });
        $popupMask.show();
    };

    var hidePopup = function() {
        $("#popup_mask").hide();
        if (gTarget !== undefined) {
            gTarget.hide();
            gTarget = undefined;
        }
    }

    $(".load_div").click(function() {
        var target = $(this).attr("load_iv");
        hidePopup();
        show_div(target);
    });

    var show_div = function(target) {
        gTarget = $("#" + target);
        gTarget.parent().next().html("");
        $("#" + target + " input").val("");
        $("#" + target + " select").val("");
        $('#' + target + ' label.error-msg').text('');
        showPopup($("#popup_mask"), gTarget);
        var formName = "#" + target + "_form";
        var form = $(formName);
        form.validate({
            errorClass: "error-msg error-msg-default",
            errorPlacement: function(error, element) {
                element.parents('.from-center').find('span.error-msg.error-msg-default').hide();
                element.after(error);
            },
            success: function(element) {
                element.parents('.from-center').find('span.error-msg.error-msg-default').show();
                element.remove();
            }
        });

    }

    $(".cancelButton").click(function() {
        hidePopup();
    });

    $(".closePopUp").click(function() {
        hidePopup();
    });

    $("body").on('click', 'a[targetdiv]', function() {
        var target = $(this).attr("targetdiv");
        if (target === undefined) {
            return;
        }
        if (target === 'modify_authorize_phone_1_div') {
            if ($('#idAuthStatus strong').hasClass('ico-setting-success')) {
                show_div(target);
            }else{
                show_div('modify_authorize_phone_3_div');
            }
            return;
        };
        show_div(target);
    });

    $('.safety-item').mouseover(function() {
        $(this).css({
            'background-color': '#ffffff'
        });
        if ($(this).find('.safety-status.hover-status').length > 0) {
            $(this).find('.safety-status').hide();
            $(this).find('.safety-status.hover-status').show();
        }
    });
    $('.safety-item').mouseout(function() {
        $(this).css({
            'background-color': '#f9f9f9'
        });
        if ($(this).find('.safety-status.hover-status').length > 0) {
            $(this).find('.safety-status').show();
            $(this).find('.safety-status.hover-status').hide();
        }
    });

    var init_show = location.href.split('#')[1];
    if (init_show) {
        switch (init_show) {
            case 'authorize_id_div':
                $('#idAuthStatus .movement a').click();
                break;
            case 'set_deal_password_div':
                $('#dealPassStatus .movement a').click();
                break;
            default:
                break;
        }
    }


    //映射字体变大
    var id_code = $("input[name=id5]");
    var id_code_layer = $("#id_code_layer");

    var zoomIdCode = function(val) {
        if (!val) {
            return;
        }
        id_code_layer.show();
        var val = val.toString();
        var sub_length = [6, 4, 4, 4];
        var lay_text = '';
        var sub_count = 0;
        for (var i = 0; i < val.length; i += sub_length[sub_count - 1]) {
            lay_text += val.substring(i, i + sub_length[sub_count]);
            lay_text += ' ';
            sub_count++;
        }
        id_code_layer.html(lay_text);
    }

    id_code.on("keyup", function() {
        zoomIdCode($(this).val());
    });
    id_code.on("blur", function() {
        id_code_layer.hide();
    });
    id_code.on("focus", function() {
        zoomIdCode($(this).val());
    });

    /**
     * 初始化密保问题列表
     **/
    (function() {
        var questions = codes.securityQuestion;
        for (var key in questions) {
            var option = $('<option>').val(key).text(questions[key]);
            $('select.question').append(option);
        }
        $('select.question').val('');
    })();

    var reloadPage = function(target) {
        location.reload();
        return;
        var successtip = target.attr("successtip")
        if (successtip !== undefined) {
            countdown(5, content);
        }
    };

    var ajaxPost = function(target, url, data, successCallback) {
        var errorMessage = target.parent().next();

        $.ajax({
            type: "POST",
            url: url,
            data: data,
            dataType: 'json',
            success: function(resp) {
                setDisabledFalse(target);
                if (resp) {
                    if (resp.errorCode === 0) {
                        if (successCallback && 'function' == (typeof successCallback))
                            successCallback();
                    } else {
                        var message = resp.errorMessage;
                        if (resp.errorMessage.JSON_ERRORMSG_NAME !== undefined) {
                            message = resp.errorMessage.JSON_ERRORMSG_NAME;
                        } else if (resp.errorMessage.code !== undefined) {
                            message = resp.errorMessage.code;
                        }
                        errorMessage.html(message);
                    }
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                setDisabledFalse(target);
                var message = "网络可能有问题，请稍后再试。";
                errorMessage.html(message);
            }
        });
    }

    var sendSmsTimer = function(o, wTime) {
        var obj = $(o);
        if (wTime == 0) {
            obj.html("点击获取");
            setDisabledFalse(obj);
        } else {
            obj.html("重新发送(" + wTime + ")");
            setDisabled(obj);
            wTime--;
            setTimeout(function() {
                sendSmsTimer(o, wTime)
            }, 1000);
        }
    };

    $(".sendSmsCode").click(function() {
        var button = $(this);
        if (button.attr("disabled") !== undefined && button.attr("disabled") === "disabled") {
            return false;
        }
        setDisabled(button);
        var inputData = {
            '_': (new Date()).getTime()
        };
        var url = button.attr("href");
        sendSmsTimer(this, 60);
        ajaxPost(button, url, inputData);
        return false;
    });

    $(".changeSmsCode").click(function() {
        var button = $(this);
        var id5 = $('#modify_authorize_phone_1_div_form input[name=id5]').val();
        if (button.attr("disabled") !== undefined && button.attr("disabled") === "disabled") {
            return false;
        }
        setDisabled(button);
        var inputData = {
            'id5': id5
        };
        var url = button.attr("href");
        sendSmsTimer(this, 60);
        ajaxPost(button, url, inputData);
        return false;
    });

    $(".newSmsCode").click(function() {
        var button = $(this);
        var newmobile = $('#modify_authorize_phone_2_div_form input[name=newmobile]').val();
        if (button.attr("disabled") !== undefined && button.attr("disabled") === "disabled") {
            return false;
        }
        setDisabled(button);
        var inputData = {
            'newmobile': newmobile
        };
        var url = button.attr("href");
        sendSmsTimer(this, 60);
        ajaxPost(button, url, inputData);
        return false;
    });

    var setDisabled = function(obj) {
        obj.attr("disabled", true);
        obj.addClass("btn-nouse-disabled");
    };

    var setDisabledFalse = function(obj) {
        obj.attr("disabled", false);
        obj.removeClass("btn-nouse-disabled");
    };

    $(".saveButton").click(function() {
        var button = $(this);
        var blockName = button.attr("blockname");
        var formName = "#" + blockName + "_form";
        var form = $(formName);
        if (!form.valid()) {
            return false;
        }
        var inputData = {};
        if (button.attr("disabled") !== undefined && button.attr("disabled") === "disabled") {
            return false;
        }
        setDisabled(button);

        var blockName = button.attr("blockname");
        var inputs = $("#" + blockName + " :input");
        $.each(inputs, function(index, object) {
            var o = $(object);
            inputData[o.attr("name")] = o.val();
        });
        var url = button.attr("href");
        var successCallback = eval($(this).attr('callback'));
        ajaxPost(button, url, inputData, successCallback);
        return false;
    });

    function showTip(tip) {
        $('.break-tips strong').text(tip);
        $('.break-tips').show();
        $('.break-tips').animate({
            height: '32px'
        });
        setTimeout(hideTip, 5000);
    }

    function hideTip() {
        $('.break-tips').animate({
            height: '0px'
        }, 'normal', function() {
            $(this).hide();
        });
    }

    $('.btn-small-closed').click(hideTip);

    function nickAuthed() {
        var nick = $('#modify_nickname_div_form input[name=nickname]').val();
        $('#nickStatus').find('.safety-status.hover-status').remove();
        $('#nickStatus .safety-name .ico-borrow').removeClass('ico-setting-default');
        $('#nickStatus .safety-name .ico-borrow').addClass('ico-setting-success');
        if ($('#nickStatus').find('.safety-status.not-enabled').length > 0) {
            levelIncrease();
        }
        showTip('恭喜您，昵称保存成功!');
        $('#nickStatus').find('.safety-status').removeClass('not-enabled');
        var show_nick = (function(nick) {
            var $star = '';
            for (var i = 0; i < nick.length - 2; i++) {
                $star += '*';
            }
            return nick.substring(0, 1) + $star + nick.substring(nick.length - 1, nick.length)
        })(nick);
        $('#nickStatus').find('.safety-status').text(show_nick);
        $('#nickStatus span.movement').remove();
        hidePopup();
    }

    function passModify() {
        hidePopup();
        showTip('恭喜您，密码修改成功!');
    }

    function dealPassSetted() {
        $('#dealPassStatus').find('.safety-status.hover-status').remove();
        $('#dealPassStatus .safety-name .ico-borrow').removeClass('ico-setting-default');
        $('#dealPassStatus .safety-name .ico-borrow').addClass('ico-setting-success');
        if ($('#dealPassStatus').find('.safety-status.not-enabled').length > 0) {
            levelIncrease();
            showTip('恭喜您，密码设置成功!');
            $('#dealPassStatus').find('.safety-status').removeClass('not-enabled');
            $('#dealPassStatus').find('.safety-status').text('**********');
            $('#dealPassStatus .movement').replaceWith('\
            <span class="movement">\
                <a href="javascript:void(0);" targetdiv="modify_deal_password_div">修改</a>\
                &nbsp;&nbsp;\
                <a href="javascript:void(0);" targetdiv="find_back_deal_password_div1">找回</a>\
            </span>\
            ');
        } else {
            showTip('恭喜您，密码修改成功!');
        }
        hidePopup();
    }

    function questionSetted() {
        var question = $('select.question option:selected[value!=""]').text();
        $('#securityQuestion').find('.safety-status.hover-status').remove();
        $('#securityQuestion .safety-name .ico-borrow').removeClass('ico-setting-default');
        $('#securityQuestion .safety-name .ico-borrow').addClass('ico-setting-success');
        if ($('#securityQuestion').find('.safety-status.not-enabled').length > 0) {
            levelIncrease();
            showTip('恭喜您，安全保护问题设置成功!');
        } else {
            showTip('恭喜您，安全保护问题修改成功!');
        }
        $('#securityQuestion').find('.safety-status').removeClass('not-enabled');
        $('#securityQuestion').find('.safety-status').text(question);
        $('#securityQuestion span.movement').html('<a href="javascript:void(0);" targetdiv="' + targetdiv + '">修改</a>');
        hidePopup();
    }

    function idAuthed() {
        var name = $('input[name=realname]').val();
        $('#idAuthStatus').find('.safety-status.hover-status').remove();
        $('#idAuthStatus .safety-name .ico-borrow').removeClass('ico-setting-default');
        $('#idAuthStatus .safety-name .ico-borrow').addClass('ico-setting-success');
        showTip('实名认证请求提交成功');
        $('#idAuthStatus').find('.safety-status').removeClass('not-enabled');
        var show_name = name.substring(0, 1);
        for (var i = 0; i < name.length - 1; i++) {
            show_name += '*';
        }
        $('#idAuthStatus').find('.safety-status').text(show_name);
        $('#idAuthStatus span.movement').remove();
        //设置交易密码和修改安全保护问题的拦截要去掉
        $('#dealPassStatus .movement a[targetdiv=set_deal_password_div2]').attr('targetdiv', 'set_deal_password_div');
        $('#securityQuestion .movement a[targetdiv=modify_security_qeustion_div2]').attr('targetdiv', 'modify_security_qeustion_div1');
        hidePopup();
    }

    function cellAuthed() {
        var phone = $('#modify_authorize_phone_2_div_form input[name=newmobile]').val();
        $('#cellAuthStatus').find('.safety-status.hover-status').remove();
        $('#cellAuthStatus .safety-name .ico-borrow').removeClass('ico-setting-default');
        $('#cellAuthStatus .safety-name .ico-borrow').addClass('ico-setting-success');
        if ($('#cellAuthStatus').find('.safety-status.not-enabled').length > 0) {
            levelIncrease();
        }
        $('#cellAuthStatus').find('.safety-status').removeClass('not-enabled');
        $('#cellAuthStatus').find('.safety-status').text(phone.substring(0, 3) + '****' + phone.substring(7, 11));
        $('#cellAuthStatus span.movement').html('<a href="javascript:void(0);" targetdiv="modify_authorize_phone_1_div">修改</a>');
        hidePopup();
        show_div('bid_result_suc');
    }
    function cellAuthedNext () {
        hidePopup();
        show_div('modify_authorize_phone_2_div');
    }

    function emailAuthed() {
        var email = $('input[name=email]').val() || $('input[name=newemail]').val();
        $('#emailAuthStatus').find('.safety-status.hover-status').remove();
        $('#emailAuthStatus').find('.safety-status').removeClass('not-enabled');
        //$('#emailAuthStatus').find('.safety-status').text('等待验证');
        //$('#emailAuthStatus span.movement').html('<a href="javascript:void(0);" targetdiv="modify_authorize_mail_div">重新认证</a>');
        var email_info = mailSuffix[email.substring(email.indexOf('@') + 1)];
        if (email_info) {
            $('.email_url').show();
            $('.email_text').hide();
            $('.email_url').attr('href', email_info.url);
            $('.email_url').attr('target', 'blank');
            $('.email_url').text(email_info.suffix + '邮箱');
        } else {
            $('.email_url').hide();
            $('.email_text').show();
        }
        hidePopup();
        show_div('send_authorize_email_div');
        reEmailSend(60);
    }

    function levelIncrease() {
        var level = $('#security_level').attr('level');
        level++;
        $('#security_level').attr('level', level);
        if (level <= 2) {
            return;
        }
        if (level <= 5) {
            $('#security_level span').removeClass('security-low');
            $('.safety-level em').text('中');
            $('#levelMessage').text('建议您启用更多安全设置，以保障账户和资金安全');
            $('#levelMessage').removeClass('text-low');
            $('#levelMessage').addClass('text-middle');
            for (var i = 0; i < level; i++) {
                $('#security_level span:eq(' + i + ')').addClass('security-middle');
            }
            return;
        }
        $('#security_level span').removeClass('security-middle');
        $('#levelMessage').text('搜易贷为您提供银行级别的账户和资金安全保障');
        $('#levelMessage').removeClass('text-middle');
        $('#levelMessage').addClass('text-high');
        $('.ico-borrow').removeClass('ico-advice');
        $('.ico-borrow').addClass('ico-security');
        $('.safety-level em').text('高');
        for (var i = 0; i < level; i++) {
            $('#security_level span:eq(' + i + ')').addClass('security-high');
        }
    }
    /*    jQuery.validator.setDefaults({
        debug: true,
        success: "valid"
    });
*/
    jQuery.extend(jQuery.validator.messages, {
        required: "必填字段",
        remote: "请修正该字段",
        email: "请输入正确格式的电子邮件",
        url: "请输入合法的网址",
        date: "请输入合法的日期",
        dateISO: "请输入合法的日期 (ISO).",
        number: "请输入合法的数字",
        digits: "只能输入整数",
        creditcard: "请输入合法的信用卡号",
        equalTo: "请再次输入相同的值",
        accept: "请输入拥有合法后缀名的字符串",
        maxlength: jQuery.validator.format("请输入一个 长度最多是 {0} 的字符串"),
        minlength: jQuery.validator.format("请输入一个 长度最少是 {0} 的字符串"),
        rangelength: jQuery.validator.format("请输入 一个长度介于 {0} 和 {1} 之间的字符串"),
        range: jQuery.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),
        max: jQuery.validator.format("请输入一个最大为{0} 的值"),
        min: jQuery.validator.format("请输入一个最小为{0} 的值")
    });

    var checkDate = function(datestring) {
        year = datestring.substring(0, 4);
        month = datestring.substring(4, 6);
        day = datestring.substring(6, 8);
        var myDate = new Date();
        myDate.setFullYear(year, (month - 1), day);

        return ((myDate.getMonth() + 1) == month && day < 32);
    }
    var checkIdCardNo = function(num) {
        var factorArr = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1);
        var error;
        var varArray = new Array();
        var intValue;
        var lngProduct = 0;
        var intCheckDigit;
        var intStrLen = num.length;
        var idNumber = num;
        // initialize
        if (intStrLen != 18) {
            return false;
        }
        for (i = 0; i < intStrLen; i++) {
            varArray[i] = idNumber.charAt(i);
            if ((varArray[i] < '0' || varArray[i] > '9') && (i != 17)) {
                return false;
            } else if (i < 17) {
                varArray[i] = varArray[i] * factorArr[i];
            }
        }
        var date8 = idNumber.substring(6, 14);
        if (checkDate(date8) == false) {
            //error = "身份证中日期信息不正确！.";
            //alert(error);
            return false;
        }
        // calculate the sum of the products
        for (i = 0; i < 17; i++) {
            lngProduct = lngProduct + varArray[i];
        }
        // calculate the check digit
        intCheckDigit = 12 - lngProduct % 11;
        switch (intCheckDigit) {
            case 10:
                intCheckDigit = 'X';
                break;
            case 11:
                intCheckDigit = 0;
                break;
            case 12:
                intCheckDigit = 1;
                break;
        }
        // check last digit
        if (varArray[17].toUpperCase() != intCheckDigit) {
            //error = "身份证效验位错误!...正确为： " + intCheckDigit + ".";
            //alert(error);
            return false;
        }
        return true;
    };
    //重新发送邮件
    var reEmailSend = function(times) {
        var reSendNum = setInterval(function() {
            $('#resendEmail').text('重新发送(' + times + ')');
            times--;
            if (times == 0) {
                $('#resendEmail').removeClass('disabled');
                clearInterval(reSendNum);
                $('#resendEmail').text('重新发送');
            }
        }, 1000);
    }
    $('#resendEmail').click(function(event) {
        if (!$(this).hasClass('disabled')) {
            $.ajax({
                url: '/myaccount/resend_email',
                type: 'POST',
            })
                .done(function() {
                    $('#resendEmail').addClass('disabled');
                    reEmailSend(60);
                })
                .fail(function() {
                    $('#resendEmail').addClass('disabled');
                    reEmailSend(60);
                })
        }
    });
    jQuery.validator.addMethod("isIdCardNo", function(value, element) {
        return this.optional(element) || (checkIdCardNo(value));
    }, "请正确填写身份证号码");

    jQuery.validator.addMethod("isMobile", function(value, element) {
        var tel = /^1[34578][0-9]{9}$/;
        return this.optional(element) || (tel.test(value));
    }, "请正确填写手机号码");

    jQuery.validator.addMethod("isNickName", function(value, element) {
        var tel = /^[a-zA-Z][a-zA-Z0-9-_]{3,14}$/;
        return this.optional(element) || (tel.test(value));
    }, '请正确填写昵称，4-15个字符，可由英文、数字、"-"和"_"组成，必须以字母开头');

    jQuery.validator.addMethod("isZipCode", function(value, element) {
        var tel = /^[0-9]{6}$/;
        return this.optional(element) || (tel.test(value));
    }, "请正确填写邮政编码");

});
