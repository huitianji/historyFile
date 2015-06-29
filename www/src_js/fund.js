    (function() {

        var pathname = window.location.pathname.toLowerCase();
        if(pathname.indexOf("/invest/9") == -1 && pathname.indexOf("/myaccount/fund/overview") == -1 && pathname.indexOf("/fb/fund/detail") == -1){
            return false;
        }
        //基金列表页 显示用户红包
        if(pathname.indexOf("/invest/9") != -1){ 
            //格式化金额 isYuan: 单位是否是元，是 不进行整除，正常逗号分隔输出
            var fmtMoney = function(money, length, isYuan) {
                if (length !== 0) {
                    length = length | 2;
                }
                if (typeof parseInt(money) === 'number' && !isYuan) {
                    money = (money / 100).toFixed(length);
                }
                money = ('' + money).replace(/(\d)(?=(?:\d{3})+(?:\.\d+)?$)/g, "$1,");
                return money;
            }

            //绑定用户基本信息
            var bindUserBaseInfo = function(options){

                $.ajax({
                    url: '/export/invest/userData',
                    type: 'Get',
                    dataType: 'json',
                    data: { t: Math.random() }
                })
                .done(function(json) {
                    if(json.errorCode != 0) return;

                    //列表页 显示红包 和 余额
                    $(".version-red-envelope").show();
                    $("strong[data-class='v-pp-balance']").html(fmtMoney(json.data.currentBalance,2));
                    $("strong[data-class='v-pp-coupon']").html(fmtMoney(json.data.couponAmount,2));

                })

            }

            bindUserBaseInfo();
        }

        var $MainBody = $(".main-offsetHeight"), //最外层div，控制虚化效果
            $Floats = $(".version1-mask"); //遮罩层

        //货基内容
        var $Main = $(".version-popup-main.popup-huoji"), //内容弹出层
            $fundPopup = $(".version-popup.popup-huoji"); //货基弹出层

        //货基成功
        var $MainSucc = $(".version-popup-main.popup-huoji-succ"),
            $fundPopupSucc = $(".version-popup.popup-huoji-succ");

        //货基失败
        var $MainFail = $(".version-popup-main.popup-huoji-fail"),
            $fundPopupFail = $(".version-popup.popup-huoji-fail");

        //显示隐藏开户信息
        var $redirect = $("[data-type='popup-redirect']"),
            $sydOpen = $(".version-open-syd");

        var popup = {
            //显示并控制弹出层位置
            showFundPopup: function() {
                $Main.show();
                var winW = $(window).width(),
                    winH = $(window).height(),
                    dW = $(document).width(),
                    dH = $(document).height(),
                    left = (winW - $fundPopup.width()) / 2,
                    top = (winH - $fundPopup.height()) / 2;

                $Floats.show().css("width", dW + 'px').css("height", dH + 'px');
                $fundPopup.show().css("top", top + $(window).scrollTop() + 'px').css("left", left + 'px');
                $MainBody.addClass('back-blur');
                contentEqMask();
            },
            //隐藏弹出层
            hideFundPopup: function() {
                $Main.hide();
                $Floats.hide();
                $fundPopup.hide();
                $MainBody.removeClass('back-blur');
                contentEqMask();
            },
            showKaihu: function() {
                $redirect.hide();
                $sydOpen.show();
                contentEqMask();
            },
            hideKaihu: function() {
                $redirect.show();
                $sydOpen.hide();
                contentEqMask();
            },
            showSucc: function() {
                $MainSucc.show();
                var winW = $(window).width(),
                    winH = $(window).height(),
                    dW = $(document).width(),
                    dH = $(document).height(),
                    left = (winW - $fundPopupSucc.width()) / 2,
                    top = (winH - $fundPopupSucc.height()) / 2;

                $Floats.show().css("width", dW + 'px').css("height", dH + 'px');
                $fundPopupSucc.show().css("top", top + $(window).scrollTop() + 'px').css("left", left + 'px');
                $MainBody.addClass('back-blur');
                contentEqMask();
            },
            hideSucc: function() {
                $MainSucc.hide();
                $Floats.hide();
                $fundPopupSucc.hide();
                $MainBody.removeClass('back-blur');
            },
            showFail: function(errorMsg) {
                $MainFail.show();
                var winW = $(window).width(),
                    winH = $(window).height(),
                    dW = $(document).width(),
                    dH = $(document).height(),
                    left = (winW - $fundPopupFail.width()) / 2,
                    top = (winH - $fundPopupFail.height()) / 2;

                $Floats.show().css("width", dW + 'px').css("height", dH + 'px');
                $fundPopupFail.show().css("top", top + $(window).scrollTop() + 'px').css("left", left + 'px');
                $MainBody.addClass('back-blur');
                errorMsg && $fundPopupFail.find(".version-open-statecopy").html(errorMsg)
                contentEqMask();
            },
            hideFail: function() {
                $MainFail.hide();
                $Floats.hide();
                $fundPopupFail.hide();
                $MainBody.removeClass('back-blur');
            }
        };
        // popup.showFail();

        // popup.showFundPopup();

        // 关闭按钮事件
        $(".version-popup-closed[data-type='huoji-close']").unbind("click").on("click", function() {
            if(!$fundPopup.is(":hidden")) popup.hideFundPopup();
            if(!$fundPopupSucc.is(":hidden")) popup.hideSucc();
            if(!$fundPopupFail.is(":hidden")) popup.hideFail();

            return false;
        })

        //立刻开户、
        $("input[data-type='fund-account']").on("click", function(ev) {
            var $this = $(this);
            // 1 验证是否登录
            if ($.cookie("syd_name") === undefined) {
                window.location.href = "https://passport.souyidai.com/?backurl=" + document.URL;
            }

            $this.addClass('disabled').attr("disabled", true);
            // 2 验证是否实名认证
            $.ajax({
                    url: '/invest/fund/getUserInfo',
                    type: 'POST',
                    dataType: 'json',
                    data: { t: Math.random() }
                })
                .done(function(data) {
                    if (data.errorCode == 0) {
                        popup.showFundPopup();
                        //绑定姓名、身份证
                        $("span[data-type='popup-name']").html(data.data.realName);
                        $("span[data-type='popup-id5']").html(data.data.id5);
                        // 3 验证是否绑定银行卡
                        // 4 查询是否有银行卡，如果有检查是否有对应的开通银行，有则绑定
                        var banks = data.data.bankcardList;
                        var isBreak = false;
                        for (var i = 0; i < banks.length; i++) {
                            for (var j = 0; j < arrBank.banks.length; j++) {
                                if (banks[i].bankCode == arrBank.banks[j].ID) {
                                    var $thisBank = $selList.find("a[data-value=" + banks[i].bankCode + "]");
                                    //将最新的银行卡号绑过来
                                    if (isBreak == false && $thisBank.attr("data-openway") != 0) {
                                        $selText.html(banks[i].bank);
                                        $selItem.attr("data-value", banks[i].bankCode);
                                        $("#popup_id").val(banks[i].cardId).closest(".version-open-item").addClass('version-open-visitor');
                                        isBreak = true;
                                    }
                                    //给对应的银行卡加上绑定的开号
                                    $thisBank.attr("data-cardId", banks[i].cardId);
                                }
                            }
                        }

                    } else if (data.errorCode == 1) {
                        if (data.errorMessage == "noLogin") {
                            window.location.href = "https://passport.souyidai.com/?backurl=" + document.URL;
                        } else {
                            popup.showFail("您需要先进行实名认证，才可以开通基金账户，现在就去<a href='/myaccount/safecenter' target='_blank'>实名认证</a>");
                        }
                    }
                })
                .fail(function() {
                    // popup.showFail("网络出错，请重试");
                })
                .always(function() {
                    $this.removeClass('disabled').attr("disabled", false);
                });

        })

        //立刻购买
        $("input[data-type='fund-buy']").on("click", function(){
            var $this = $(this);
            var $inputInvest = null;

            //详情页 验证输入金额
            $inputInvest = $("input[data-type='fund-input-invest']");
            var money = $inputInvest.val() * 1;
            if(isNaN(money) || money < 100){
                $inputInvest.focus();
                return;
            }

            $this.addClass('disabled').attr("disabled", true);
            $.ajax({
                url: '/fb/doSubFund',
                type: 'POST',
                dataType: 'json',
                data: { amount: $inputInvest.val() }
            })
            .done(function(data) {
                if(data.errorCode == 0){
                    var str = data.data ? "预计从" + data.data + "开始计算收益。" : $("span[data-type='profit-date-tips']").html();
                    alert('购买成功：' + str);
                    window.location.reload();
                }else{
                    if(data.errorMessage == "noLogin"){
                        window.location.href = "https://passport.souyidai.com/?backurl=" + document.URL;
                    }else{
                        alert(data.errorMessage);
                    }
                }
            })
            .always(function(){
                $this.removeClass('disabled').attr("disabled", false);
            })
            
        })

        //文本框验证
        $fundPopup.on("focus", "input[type=text]", function() {
            var $this = $(this),
                $item = $this.closest('.version-open-item'),
                defaultVal = $this.attr("data-text"),
                nowVal = $this.val();

            //显示高亮样式
            $item.addClass('version-open-focus').removeClass('version-open-border-false version-open-visitor');
            if (nowVal == defaultVal) {
                //如果为默认值，则清空
                $this.val('');
            }
        }).on("blur", "input[type=text]", function() {
            if ($(this).attr("data-error") == "undefined") return;

            var $this = $(this),
                aType = $this.attr("data-type").split(/\,/g),
                digit = $this.attr("digit") || '',
                defaultVal = $this.attr("data-text"),
                value = $this.val(),
                length = $this.attr("data-length"),
                data_name = $this.attr("data-name"),
                $item = $this.closest('.version-open-item');

            //清除前后空格
            $this.val($.trim(value));
            //重新获取value
            value = $this.val();

            //当value为空、或者为默认值时：value为空、赋默认值、如果是Input需要清除高亮样式
            if (value == "" || value == defaultVal) {
                value = "";
                $this.val(defaultVal);
                $item.removeClass('version-open-focus').addClass('version-open-border-false');
            } else {
                $item.removeClass('version-open-focus').addClass('version-open-visitor'); //否则，只移除高亮，文字颜色不变
            }

            var options = {
                value: value,
                type: aType,
                digit: digit,
                maxlen: length
            };
            var result = validateFun(options); //得到校验结果
            //如果失败，不为空
            if (result != "" && typeof result == "object") {
                //显示错误提示信息
                $item.removeClass('version-open-focus').addClass('version-open-border-false');
            }
        })

        //设置银行下拉列表
        var arrBank = $.parseJSON('{ "banks" : ' + codes.fundBanks.hjbank.replace(/\'/g, '\"') + '}');
        var strHtml = "";
        for (var i = 0; i < arrBank.banks.length; i++) {
            var thisBank = arrBank.banks[i];
            if (thisBank.status == "0") {
                strHtml += '<span ';
            } else {
                strHtml += '<a href="javascript:;" ';
            }
            strHtml += 'data-value="' + thisBank.ID + '" data-href="' + thisBank.href + '" data-openway="' + thisBank.openWay + '">' + thisBank.name;
            if (thisBank.status == "0") {
                strHtml += '</span>';
            } else {
                strHtml += '</a>';
            }

        }
        $(".version-bank-list").html("").html(strHtml);

        //银行卡下拉事件
        var $selList = $(".version-bank-list"),
            $selText = $(".version-open-recive"),
            $selItem = $selText.closest('.version-open-item'),
            isClick = false;
        $(document).on("click", function(ev) {
            if ($fundPopup.not(":hidden").length) {
                $selItem.removeClass('version-bank-select');
                if (isClick && $selItem.attr("data-value") == "") {
                    isClick = false;
                    $selItem.addClass('version-open-border-false');
                }
            }
        });

        $selItem.on("click", function() {
                var $this = $(this);

                isClick = true;
                $this.removeClass('version-open-border-false').toggleClass('version-bank-select');
                return false;
            })
            //快捷方式
        $selList.on("click", "a[data-openway='1']", function() {
                popup.showKaihu();
                clickBank.call(this);
                var cardId = $(this).attr("data-cardId");
                if (cardId) {
                    $("#popup_id").val(cardId).closest('.version-open-item').removeClass('version-open-border-false');
                    $selItem.removeClass('version-open-border-false');
                } else {
                    $("#popup_id").val($("#popup_id").attr("data-text"));
                    $selItem.removeClass('version-bank-select');
                }
                return false;
            })
            //非快捷方式
        $selList.on("click", "a[data-openway='0']", function() {
            var $this = $(this);
            popup.hideKaihu();
            var cardId = $(this).attr("data-cardId");
            if (cardId) { 
                $("#popup_id").val(cardId).closest('.version-open-item').removeClass('version-open-border-false');
                $selItem.removeClass('version-open-border-false');
            } else {
                $("#popup_id").val($("#popup_id").attr("data-text"));
                $selItem.removeClass('version-bank-select');
            }
            clickBank.call(this);
            return false;
        })

        $("#popup-bankHref").on("click", function(){
            var $this = $(this);
            if (!validateByAll()) return false;

            $.ajax({
                url: '/invest/fund/getFundActive',
                type: 'POST',
                dataType: 'json',
                data: getJson()
            })
            .done(function(data) {
                if(data.errorCode == 0){
                    var $form = $("#form-huoji");
                    var jsonStr = $.parseJSON(data.data.resultStr);
                    $form.attr("action", jsonStr.postUrl)
                    $form.find("input[name='sign']").val(jsonStr.sign);
                    $form.find("input[name='reqdata']").val(jsonStr.reqdata);
                    $form.find("input[name='channelcode']").val(jsonStr.channelcode);
                    $form.submit();
                }
            })
            
        })

        function clickBank() {
            var $this = $(this);
            $selText.html($this.html());
            $selItem.attr("data-value", $this.attr("data-value")).removeClass('version-bank-select');
        }

        //验证码相关事件
        var smsTimer = null;
        $(".version-btn-code[data-type='validate-code']").on("click", function() {
            var self = $(this);
            if (self.hasClass('isTiming')) return;

            $("input[type=text][id!='popup-sms']").trigger("blur");
            isClick = true;
            $(document).trigger('click');
            $("#popup-sms").closest('.version-open-item').removeClass('version-open-border-false');
            if ($(".version-popup[data-type='version-popup-mobel']").find(".version-open-item").hasClass("version-open-border-false")) return false;

            //获取短信验证码
            var times = 60;
            self.val("重新获取(" + (times--) + ")").addClass('isTiming').css("color", "#999");
            smsTimer = setInterval(function() {
                if (times == 0) {
                    clearInterval(smsTimer);
                    self.val("重新获取").removeClass('isTiming').css("color", "#333");
                    return;
                }
                self.val("重新获取(" + (times--) + ")");
            }, 1000);

            $.ajax({
                url: '/invest/fund/sendFundSms',
                type: 'POST',
                dataType: 'json',
                data: getJson()
            })
            .done(function(data) {
                // 失败
                if (data.errorCode != 0) {
                    if (data.errorMessage != "noLogin") {
                        alert(data.errorMessage);
                    } else {
                        window.location.href = "https://passport.souyidai.com/?backurl=" + document.URL;
                    }
                }
            })

        });

        //拿json参数
        function getJson() {
            return {
                "username": $('span[data-type="popup-name"]').html(),
                "id5": $('span[data-type="popup-id5"]').html(),
                "mobile": $('#popup-mobile').val(),
                "bankcarid": $("#popup_id").val(),
                "bankname": $(".version-open-recive").html(),
                "bankcode": $('span[data-type="popup-bank-carid"]').attr("data-value")
            }
        }

        //选择协议验证
        var $checked = $("em[data-type='popup-check']");
        $checked.on("click", function() {
            var $this = $(this);

            if ($this.hasClass("checked")) {
                $this.removeClass('checked');
            } else {
                $this.addClass('checked');
            }
            return false;
        })

        //开户按钮事件
        $(".version-open-btn[data-type='popup-submit'] a").on("click", function() {
            if (!validateByAll()) return;

            var jsonData = getJson();
            jsonData.smscode = $("#popup-sms").val();

            $.ajax({
                    url: '/invest/fund/openAccount',
                    type: 'POST',
                    dataType: 'json',
                    data: jsonData
                })
                .done(function(data) {
                    // 成功
                    if (data.errorCode == 0) {
                        setTimeout(function() {
                            window.location.reload();
                        }, 3000);
                        popup.hideFundPopup();
                        popup.showSucc();
                    } else {
                        if (data.errorMessage != "noLogin") {
                            popup.hideFundPopup();
                            popup.showFail(data.errorMessage);
                        } else {
                            window.location.href = "https://passport.souyidai.com/?backurl=" + document.URL;
                        }
                    }
                })
        })

        //整体验证
        function validateByAll() {
            $("input[type=text]").not(":hidden").trigger("blur");
            isClick = true;
            $(document).trigger('click');

            if ($(".version-popup[data-type='version-popup-mobel']").find(".version-open-item").not(":hidden").hasClass("version-open-border-false")) return false;

            if (!$checked.eq(0).hasClass('checked')) {
                alert("请阅读并同意权益须知");
                return false;
            }
            if (!$checked.eq(1).hasClass('checked')) {
                alert("请阅读并同意服务协议");
                return false;
            }

            return true;
        }


        function contentEqMask() {
            $("div[data-type='version-popup-mobel']").each(function() {
                var _this = $(this);
                var $version_popup_main = _this.find("div[data-type='version-popup-main']").height();
                _this.find("div[data-type='version-popup-mask']").height(parseInt($version_popup_main) + 16);
            });
        }


        //校验
        function validateFun(valiObj) {
            var valiObj = valiObj || {};
            valiObj.type = valiObj.type || []; //校验类型
            valiObj.value = valiObj.value || ""; //校验值
            valiObj.maxlen = valiObj.maxlen || 0; //最大长度
            valiObj.compareVal = valiObj.compareVal || ""; //比较值
            valiObj.digit = valiObj.digit || 0; //校验数字类型的最大长度

            var reg_int = new RegExp('^(' + (valiObj.digit <= 0 ? '0|' : '0|[1-9]\\d{0,' + (valiObj.digit - 1) + '}') + ')$', 'g'),
                reg_int100 = /^(\d|[1-9]\d|100)$/g,
                reg_int30 = /^(\d|[12]\d|30)$/g,
                reg_empty = /^\s+|\s+$/;
            reg_mobile = /^1[34578][0-9]{9}$/,
                reg_id = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/,
                reg_date = /^[12]\d{3}\-\d{2}\-\d{2}$/g,
                reg_first_phone = /^0(?:[12]\d|\d{3})$/g,
                reg_second_phone = /^[1-9]\d{6,7}$/g,
                reg_third_phone = /^\d{1,10}$/g,
                reg_decimal = new RegExp('^\\d+(\\.\\d{' + valiObj.digit + '})?$', 'g'), //验证整数或几位小数
                reg_email = /\w+@[0-9a-z\-]+(\.[a-z]{2,6}){1,2}/g;

            for (var i = 0; i < valiObj.type.length; i++) {
                var nowType = valiObj.type[i];
                switch (nowType) {
                    case 'int':
                        if (valiObj.value != "" && !reg_int.test(valiObj.value.replace(/\,/g, ''))) {
                            return {
                                errorType: nowType,
                                iNum: i
                            };
                        }
                        break;
                    case 'int100':
                        if (valiObj.value != "" && !reg_int100.test(valiObj.value)) {
                            return {
                                errorType: nowType,
                                iNum: i
                            };
                        }
                        break;
                    case 'int30':
                        if (valiObj.value != "" && !reg_int30.test(valiObj.value)) {
                            return {
                                errorType: nowType,
                                iNum: i
                            };
                        }
                        break;
                    case 'empty':
                        if (valiObj.value.replace(reg_empty, '') == "") {
                            return {
                                errorType: nowType,
                                iNum: i
                            };
                        }
                        break;
                    case 'mobile':
                        if (valiObj.value != "" && !reg_mobile.test(valiObj.value)) {
                            return {
                                errorType: nowType,
                                iNum: i
                            };
                        }
                        break;
                    case "id":
                        if (valiObj.value != "" && !reg_id.test(valiObj.value)) {
                            return {
                                errorType: nowType,
                                iNum: i
                            };
                        }
                        break;
                    case "length":
                        if (valiObj.value != "" && !(valiObj.value.length > 0 && valiObj.value.length <= valiObj.maxlen)) {
                            return {
                                errorType: nowType,
                                iNum: i
                            };
                        }
                        break;
                    case "selCompare":
                        if (valiObj.value == valiObj.compareVal) {
                            return {
                                errorType: nowType,
                                iNum: i
                            };
                        }
                        break;
                    case "date":
                        if (valiObj.value != "" && !reg_date.test(valiObj.value)) {
                            return {
                                errorType: nowType,
                                iNum: i
                            };
                        }
                        break;
                    case "firstPhone":
                        if (valiObj.value != "" && !reg_first_phone.test(valiObj.value)) {
                            return {
                                errorType: nowType,
                                iNum: i
                            };
                        }
                        break;
                    case "secondPhone":
                        if (valiObj.value != "" && !reg_second_phone.test(valiObj.value)) {
                            return {
                                errorType: nowType,
                                iNum: i
                            };
                        }
                        break;
                    case "thirdPhone":
                        if (valiObj.value != "" && !reg_third_phone.test(valiObj.value)) {
                            return {
                                errorType: nowType,
                                iNum: i
                            };
                        }
                        break;
                    case "decimal":
                        if (valiObj.value != "" && !reg_decimal.test(valiObj.value)) {
                            return {
                                errorType: nowType,
                                iNum: i
                            };
                        }
                    case "email":
                        if (valiObj.value != "" && !reg_email.test(valiObj.value)) {
                            return {
                                errorType: nowType,
                                iNum: i
                            };
                        }
                        break;
                }
            };

            return "";
        }


    })();