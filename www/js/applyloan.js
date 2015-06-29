
var GLOBAL_HOUSE_INFO = null;
function jsonpcallback(arr){
    GLOBAL_HOUSE_INFO = arr;
}

$(function(){
    //获取loanType
    var loc = window.location.href,
        con = loc.substr(loc.lastIndexOf("/")+1),
        loanType = 1,
        periods,
        city = codesAll.lp_city.items;
    var periods = codesAll.periods_sfd_dy.items;
    var city = codesAll.lp_city.items;
    switch(con){
        case "shoufudai.htm":loanType = 1;periods = codesAll.periods_sfd_dy.items;break;
        case "huanfangdai.htm":loanType = 3;periods = codesAll.periods_hfd.items;break;
        case "shuloudai.htm":loanType = 2;periods = codesAll.periods_sld.items;break;
        case "fangdidai.htm":loanType = 4;periods = codesAll.periods_dyxfd.items;break;
    }

    bindInputChange();
    //input输入控制
    function bindInputChange(){
        switch(loanType){
            case 1:
                bindInputError({
                    oinput : $("#amount"),
                    maxMoney : 100,
                    precent : 0.2,
                    errmsg : "借款金额最多可借{0}万元"
                });
                bindInputError({
                    oinput : $("#houseTotal"),
                    maxMoney : 1000,
                    errmsg : "房屋总价不能超过{0}万元"
                })
                break;
            case 2:
                bindInputError({
                    oinput : $("#amount"),
                    maxMoney : 300,
                    precent : 1.0,
                    errmsg : "借款金额最多可借{0}万元"
                });
                bindInputError({
                    oinput : $("#houseTotal"),
                    maxMoney : 1000,
                    errmsg : "房屋总价不能超过{0}万元"
                })
                break;
            case 3:
                bindInputError({
                    oinput : $("#amount"),
                    maxMoney : 300,
                    precent : 1.0,
                    errmsg : "借款金额最多可借{0}万元"
                });
                bindInputError({
                    oinput : $("#houseTotal"),
                    maxMoney : 1000,
                    errmsg : "房屋总价不能超过{0}万元"
                })
                break;
            case 4:
                bindInputError({
                    oinput : $("#amount"),
                    maxMoney : 1000,
                    precent : 0.7,
                    errmsg : "借款金额最多可借{0}万元"
                });
                bindInputError({
                    oinput : $("#houseTotal"),
                    maxMoney : 3000,
                    errmsg : "房屋总价不能超过{0}万元"
                })
                break;
        }
    }

    function bindInputError(options){
        var $input = options.oinput;
        var $error = options.$error || $(".frwhere-annotation");
        //input修改触发
        var inputChange = function(){
            
            var self = $(this);
            var reg = /[^\d]/g;
            var val = self.val();
            var maxMoney = options.maxMoney || 1000;
            if(options.precent && $("#houseTotal").val() != ""){
                var value = options.precent * $("#houseTotal").val();
                if(value < maxMoney){
                    maxMoney = value;
                }
            }

            $error.html('');
            if (reg.test(val)) {
                self.val(val.replace(reg, ''));
                return;
            }
            var newVal = val;
            if(newVal > maxMoney){
                newVal = self.val();
                $error.html(options.errmsg.replace(/\{0\}/g, Math.floor(maxMoney))).css("color", "#ee592f");
            }else{
                $error.html('').css("color", "");
            }
            
        };
        //input输入框事件
        $input.on("focus",function(ev){
            var self = $(this);
            if(isNaN(parseInt(self.val()))){
                self.val('');
            }else{
                inputChange.call(this, ev);
            }
        }).on("keyup",function(ev){
            inputChange.call(this, ev);
            return false;
        });
    }

    var form = $('.version-open-item[data-type!=houseName]');
    var isImgVali = false;  //isImgVali验证码是否通过
    // var tooltip = codesAll.local_tooltip.items.loan_appli_tips.codeName;
    // $('.frwhere-annotation').after('<div style="text-align: center;">'+tooltip+'</div>');
    var checkInput = function() {
        var userName = $('#userName').val();
        var mobile = $('#mobile').val();
        // var houseTotal = $('#houseTotal').val();
        // var amount = $('#amount').val();
        var errorBox = $('.frwhere-annotation');
        var city = $("#city").attr("data-val");
        var regNum = /^[1-9]\d{0,3}$/g;
        var codeValue = $("#code-value").val();
        var txtCode = $("#txtCode").val();
        errorBox.html('').css('color', '');

        if (!city) {
            errorBox.html('请选择城市').css('color', '#ee592f');
            return false;
        };
        var $otherContent = $(".other-content");
        if($otherContent.is(":visible")&&!$otherContent.val()){
            errorBox.html('请输入购房城市').css('color', '#ee592f');
            return false;
        }

        $("#houseTotal").trigger("keyup");
        if(errorBox.filter(":visible").html() != ""){
            return false;
        }
        $("#amount").trigger("keyup");
        if(errorBox.filter(":visible").html() != ""){
            return false;
        }

        // if(houseTotal !== '' && !regNum.test(houseTotal)){
        //     errorBox.html('房屋总价金额不正确').css('color', '#ee592f');
        //     return false;
        // };
        // if (houseTotal !== '' && houseTotal > 2000) {
        //     errorBox.html('房屋总价不能超过2000万元').css('color', '#ee592f');
        //     return false;
        // };
        
        // if (amount !== '' && amount > 1000) {
        //     errorBox.html('借款金额不能超过1000万元').css('color', '#ee592f');
        //     return false;
        // };

        var nameReg = /^[\u4E00-\u9FA5|·|•]{2,20}$/;
        if (userName === '' || !nameReg.test(userName)) {
            errorBox.html('请输入正确的姓名').css('color', '#ee592f');
            return false;
        };

        var regex = /^1[34578][0-9]{9}$/;
        if (!regex.test(mobile)) {
            errorBox.html('请输入有效的手机号').css('color', '#ee592f');
            return false;
        }

        if($(".frwhere-valid-column").css("left") == "0px"){
            if(!codeValue){
                errorBox.html('请输入图片验证码').css('color', '#ee592f');
            }else if(isImgVali == false){
                errorBox.html('图片验证码输入错误').css('color', '#ee592f');
            }else{
                $("#send-code").trigger("click");
            }
            return false;
            
        }else if(!txtCode){
            errorBox.html('请输入短信验证码').css('color', '#ee592f');
            return false;
        }
        return true;
    };
    var numSort = function sortNumber(a,b) {
        return a - b
    };
    var periodsArr = [];
    for (var i in periods) {
        periodsArr.push(parseInt(i));
    };
    periodsArr.sort(numSort);
    for (var k = 0; k < periodsArr.length; k++) {
        $('#periods .version-city-list').append('<a href="javascript:void(0)" data-val="' + periods[periodsArr[k]].codeValue + '">' + periods[periodsArr[k]].codeName + '</a>');
    };
    var cityArr = [];
    for (var i in city) {
        if (!city[i].hasOwnProperty('parentCode')) {
            cityArr.push(parseInt(i));
        }
    };
    cityArr.sort(numSort);
    for (var j = 0; j < cityArr.length; j++) {
        $('#city .version-city-list').append('<a href="javascript:void(0)" data-val="' + city[cityArr[j]].codeValue + '">' + city[cityArr[j]].codeName + '</a>');        
    };
    $('.frwhere-radio .frwhere-radio-column').on('click', function() {
        var _this = $(this);
        _this.parent().find('.checked').removeClass('checked');
        _this.find('.version-details-img').addClass('checked');
    });
    form.on('click', function(event) {
        var _this = $(this);
        var select = $('.version-bank-select');
        if (!select.is(event.target) && select.has(event.target).length === 0) {
            $('.version-bank-select').removeClass('version-bank-select').removeClass('version-open-focus');
        }
        _this.find('input').focus();
        _this.addClass('version-open-focus').addClass('version-bank-select');
        if($(this).attr("id") == "county"){
            $("#houseName").val("");
        }
        return false;
    });
    // $('input').on('blur', function() {
    //     var _this = $(this);
    //     $('.version-open-focus').removeClass('version-open-focus').removeClass('version-bank-select');;
    // });
    $(document).on('click', function(event) {
        var select = $('.version-bank-select');
        if (!select.is(event.target) && select.has(event.target).length === 0) {
            $('.version-bank-select').removeClass('version-bank-select').removeClass('version-open-focus');
        }
        $('.version-open-focus').removeClass('version-open-focus').removeClass('version-bank-select');
    });
    $('.version-city-list').on('click', 'a', function() {
        var _this = $(this);
        var val = _this.attr('data-val');
        var key = _this.text();
        var select = _this.parents('.version-open-item');
        if(select.attr('id') === 'city'){
            select.attr('data-val', val).find('.version-open-recive').html(key+'<span class="frwhere-stars" style="right:50px;">*</span>').css("color", "#333");
            $("#county").attr("data-val", "");
        }else{
            select.attr('data-val', val).find('.version-open-recive').html(key).css("color", "#333");
        }
        
        $('.version-bank-select').removeClass('version-bank-select').removeClass('version-open-focus');
        
        var $parent = _this.parent(),
            len = $parent.children("a").size();
        if($parent.hasClass("special-list")){
            var $otherContent = $(".other-content"),
                $frwhereStars = $otherContent.siblings(".frwhere-stars");

            if(_this.index() == len-1){
                $otherContent.css({display:"inline-block"}).siblings().css({display:"none"});
                $frwhereStars.css({display:"inline-block"});
                $("#county .ver-ico-url").removeClass("ico-bank-select-down");
                $('#county .version-city-list').html('').css({minHeight:"0",overflow:"hidden"});
                return false;
            }else{
                $otherContent.css({display:"none"}).siblings().css({display:"inline-block"});
                $frwhereStars.css({display:"none"});
                $("#county .version-city-list").addClass("ico-bank-select-down");
            }
        }

        if (select.attr('id') === 'city') {
            if(!$(this).hasClass("no-version-open-item")){
                $('#county .version-city-list').html('').css({minHeight:"204px",overflowY:"scroll"});
                $('#county .version-open-recive').text('区县');
                for (var i in city) {
                    if (city[i].hasOwnProperty('parentCode')) {
                        if (city[i].parentCode === val) {
                            $('#county .version-city-list').append('<a href="javascript:void(0)" data-val="' + city[i].codeValue + '">' + city[i].codeName + '</a>');
                        }
                    }
                };
            }
        }
        return false;
    });

    
    var $errorBox = $('.frwhere-annotation'),
        $frwhere =$(".frwhere-valid-column");
    //验证码
    $(".frwhere-authimg").on("click","img",function(){
        isImgVali = false;
        $(this).attr("src","/borrow2/borrow2/authimage.jpg?t="+new Date().getTime());
        return false;
    });

    //点击>发送短信验证码
    $("#send-code").click(function(){
        if(isImgVali == false) return;

        var mobile = $("#mobile").val();
        var regex = /^1[34578][0-9]{9}$/;
        if (!regex.test(mobile)) {
            $errorBox.html('请输入有效的手机号').css('color', '#ee592f');
            return false;
        }
        
        $("#resend-code").attr("disabled","disabled");
        var num = 60,
            mobile = $('#mobile').val(),
            codeValue = $('#code-value').val();
        $frwhere.animate({left:"-280px"},700,"swing");
        var countDown = setInterval(function(){
            if(num > 0){
                $("#resend-code").val(num+"秒");
                num --;
            }else{
                clearInterval(countDown);
                $("#resend-code").val("重新发送").removeAttr("disabled");
            }
        },1000);
        $.ajax({
            url:"/borrow2/borrow2/sendSms",
            type:"post",
            dataType:"json",
            data:{mobile:mobile,kaptcha:codeValue},
            success:function(data){
                
            }
        })
        return false;
        
    });
    //点击>重新发送
    $("#resend-code").click(function(){
        $frwhere.animate({left:"0"},700,"swing");
        $("#send-code").attr("disabled","disabled");
        $(".frwhere-authimg img").attr("src","/borrow2/borrow2/authimage.jpg?t="+new Date().getTime());
        $("#code-value").val('');
        return false;
    });
    //图片验证码比较
    $("#code-value").keyup(function(){
        var val = $(this).val();
        if(val.length == 4){
            codeCompare(val); 
        }
        return false;
    });
    function codeCompare(auth_code){
        $.ajax({
            url:"/borrow2/borrow2/isAuthcodeValid",
            type:"post",
            dataType:"json",
            async: false,
            data:{auth_code:auth_code},
            success:function(data){
                if(data.errorCode == 0){
                    isImgVali = true;
                    $errorBox.html('');
                    $("#send-code").removeAttr("disabled");
                    return true;
                }else{
                    isImgVali = false;
                    $errorBox.html('图片验证码输入错误').css('color', '#ee592f');
                    return false;
                }
            }
        });
    }
    $('.frwhere-submit input').on('click', function(){
        var houseType = $('.checked').attr('data-val');
        submitting.call(this,loanType,houseType);
        return false;
    });

    function submitting(loanType,houseType) {
        if(!loanType){
            return;
        }else if(loanType == 1 && !houseType){
            return;
        }
        var $this = $(this),
            txtCode = $("#txtCode").val();
        $('.frwhere-submit input').addClass('disabled').attr('disabled', true);
        if (!checkInput()) {
            $('.frwhere-submit input').removeClass('disabled').removeAttr('disabled');
            return false;
        }
        //根据是否选择其他城市，确定houseCountyCode的值
        var houseCountyCode = $(".other-content").is(":visible")?$(".other-content").val():$('#county').attr('data-val');

        //houseTotal: $('#houseTotal').val() * 1000000, -->去掉了
        $.ajax({
            url: '/borrow2/borrow2/saveApply',
            type: 'POST',
            dataType: 'json',
            data: {
                loanType: loanType,
                userName: $('#userName').val(),
                mobile: $('#mobile').val(),
                // idCard: $('#idCard').val(),
                houseCityCode: $('#city').attr('data-val'),
                houseCountyCode: houseCountyCode,
                houseName: $('#houseName').val(),
                amount: $('#amount').val() * 1000000,
                periods: $('#periods').attr('data-val'),
                houseType: houseType,
                code:txtCode,
                reference:$('#reference').val()
            }
        })
        .done(function(res) {
            if (res.errorCode === 0) {
                $this.val("申请成功");
                $('.frwhere-annotation').html('<em>*</em>搜易贷会在1个工作日内与您电话联系').css('color', '');
            } else {
                $('.frwhere-submit input').removeClass('disabled').removeAttr('disabled');
                if(res.errorMessage == "验证码输入错误，请重新获取"){
                    $('.frwhere-annotation').html("短信验证码输入错误").css('color', '#ee592f');
                }else{
                    $('.frwhere-annotation').html(res.errorMessage).css('color', '#ee592f');
                }
            }
        });
    };
    $(".choose-init").css({display: "block", height: "100px",  textAlign: "center",  lineHeight: "100px",  fontSize: "14px"});
    $("#txtCode").css({ textAlign: "left",  textIndent: "55px"});
    $("#code-value").css({ textAlign: "left",  textIndent: "5px"});


    //增加小区智能提示 15.6.3
    //增加页面script标签    
    $("head").append("<script src='https://static.souyidai.com/www/js/template.js' ><\/script>");
    $("head").append('<script type="text/template" id="houseList">{{each info as item i}}<a href="javascript:;">{{item.name}}</a>{{/each}}<\/script>');
    var $houseName = $("#houseName");
    $.ajax({
        url: 'https://help.souyidai.com/element/access_list/index.json',
        type: 'post',
        jsonp: 'jsonpcallback',
        dataType: 'jsonp',
        headers: { "Access-Control-Allow-Origin" : "*" },
        data: { t : Math.random() }
    });

    var $houseItem = $(".version-open-item[data-type='houseName']");
    $houseName.on("click", function(){
        var _this = $(this);
        _this.focus();
        $houseItem.addClass('version-open-focus').addClass('version-bank-select');
        return false;
    }).on("focus", function(){
        hIdx = 0;
        setHouseInfo();
        $('.version-open-focus').removeClass('version-open-focus version-bank-select');
    });

    var hIdx = 0;
    $houseName.on("keyup", function(ev){
        if(!$houseName.is(":focus")) return;

        setHouseInfo();
        var $a = $houseItem.find(".version-bank-list").find("a");
        if(ev.which == 13 && hIdx >= 0){
            $a.eq(hIdx).trigger("click");
            $houseName.trigger("blur");
            return;
        }
        if(ev.which == 38){
            hIdx--;
            if(hIdx < 0) hIdx = $a.length - 1;
            setStyle($a);
        }
        if(ev.which == 40){
            hIdx++;
            if(hIdx > $a.length - 1) hIdx = 0;
            setStyle($a);
        }        

    })
    function setStyle($a){
        //判断当前标签是否显示，如果没显示则调整scrollTop
        var top = $a.outerHeight(true);
        var $list = $houseItem.find(".version-bank-list");
        var scrollTop = $list.scrollTop();
        var thisNow = hIdx + 1;
        if(thisNow <= 4){
            if(scrollTop > top * (thisNow - 1)){
                $list.scrollTop( (thisNow - 1) * top );
            }
        }else{
            if(scrollTop < top * (thisNow - 4)){
                $list.scrollTop( top * (thisNow - 4) );   
            }else if(scrollTop > top * (thisNow - 1)){
                $list.scrollTop( top * (thisNow - 1) );   
            }
        }
        $a.css("backgroundColor", "").eq(hIdx).css("backgroundColor", "#f4fafd");
    }

    $houseItem.on("click", ".version-bank-list a", function(){
        $houseItem.removeClass('version-open-focus version-bank-select');
        $houseName.val($(this).html());
        return false;
    })

    function setHouseInfo(){
        if(!GLOBAL_HOUSE_INFO) return;

        $houseItem.find(".version-bank-list").html('');

        var str = $houseName.val();
        var cityVal = $("#city").attr("data-val");
        var data = $.parseJSON(GLOBAL_HOUSE_INFO[0].content.replace(/\'/g,'"'));
        var list = { info : [ ] };
        for (var i = 0; i < data.houseInfo.length; i++) {
            var item = data.houseInfo[i];
            if(cityVal == ""){
                break;
            }
            if(cityVal == data.houseInfo[i].cityId){
                list.info = selectByHouse(item.provinceList, str);
                break;
            }
        };
        var html = template("houseList", list);
        var $vList = $houseItem.find(".version-bank-list");
        $vList.html(html);
        $vList.find("a").css("backgroundColor", "").eq(hIdx).css("backgroundColor", "#f4fafd");
    }

    function selectByHouse(cityList, str){
        var countyVal = $("#county").attr("data-val");
        var arrInfo = [ ];
        if(!countyVal){
            for (var i = 0; i < cityList.length; i++) {
                arrInfo = arrInfo.concat(getList(cityList[i].houseList));
            }
        }else{
            for (var i = 0; i < cityList.length; i++) {
                if(countyVal == cityList[i].provinceId){
                    arrInfo = getList(cityList[i].houseList); 
                    break; 
                }
            };
        }
        

        function getList(list){
            if(!str) return list;

            var res = [ ];
            var reg = new RegExp(str, "g");
            for (var i = 0; i < list.length; i++) {
                if(reg.test(list[i].name)){
                    res.push(list[i]);
                }
            };
            return res;
        }

        return arrInfo;
        
    }
    $("input[type=text]").val("");
});
//行业化展示-首页
(function(){
    function itemSpan(obj,cls){
        if(cls){
            obj.each(function(i){
                $(this).removeClass(cls+i)
            });
        }else{
            obj.each(function(i){
                $(this).hide();
            });
        }
    }
    $(".frwhere-downpayment-right").on("mouseenter","a",function(){

        var _this = $(this),
            index = _this.index();
        changePage(_this,index);
    });
    function getRequest() {
        var strs;
        var url = location.search;
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for(var i = 0; i < strs.length; i ++) {
                theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    }
    function changePage(_this,index)
    {
        itemSpan($(".frwhere-downpayment-right>a"),"frwhere-downpayment-b");
        itemSpan($(".frwhere-downpayment-left").children());

        _this.addClass("frwhere-downpayment-b"+index);
        $(".frwhere-downpayment-left").children().eq(index).show();
    }
    var Request = new Object();
    Request = getRequest();
    var index = Request["index"];
    if(index){
        var _this = $(".frwhere-downpayment-right").children().eq(index-1);
        changePage(_this,index-1);
    }
    else
    {
        index=1;
        var _this = $(".frwhere-downpayment-right").children().eq(index-1);
        changePage(_this,index-1);
    }
})();

//算算更放心
$(function(){

    window.GLOBAL = {
        "type1": {  //先息后本
            "name": "先息后本",
            "counterRate": "0.02",  //手续费率
            "monthRate": {          //月费率
                "3": "0.016",
                "6": "0.014"
            }
        },
        "type2": {  //等额本息
            "name": "等额本息",
            "counterRate": "0.03",
            "monthRate": {
                "12": "0.0078",
                "24": "0.0078",
                "36": "0.0078"
            }
        },
        "type3": {  //等额本息
            "name": "先息后本",
            "counterRate": "0.02",
            "monthRate": {
                "3": "0.012",
                "6": "0.012"
            }
        },
        "type4": {  //等额本息
            "name": "先息后本",
            "counterRate": "0.03",
            "monthRate": {
                "9": "0.012",
                "12": "0.012"
            }
        },
        "fixLen": 2,    //精确小数点位数,
        initOptions: function(options){                 //初始化参数
            var options_copy = { };
            for(var item in options){
                options_copy[item] = options[item];
            }
            options_copy.type = options_copy.type || "type1";     //还款类型
            options_copy.month = options_copy.month || "3";       //还款期数
            options_copy.totalMoney = options_copy.totalMoney || "200000";    //还款总额
            return options_copy;
        },
        getRateFee: function(options){              //获取借款手续费
            options = this.initOptions(options);
            //手续费 = 借款总额 x 手续费率
            return this.fmtMoney(options.totalMoney * this[options.type].counterRate, this.fixLen, true);
        },
        fmtMoney: function(money, length, isYuan) {
            if (length !== 0) {
                length = length | 2;
            }
            if (typeof parseInt(money) === 'number' && !isYuan) {
                money = (money / 100).toFixed(length);
            }else{
                money = money.toFixed(length);
            }
            money = ('' + money).replace(/(\d)(?=(?:\d{3})+(?:\.\d+)?$)/g, "$1,");
            return money;
        },
        getRepayByEveryMonth: function(options){    //获取每月还款额
            options = this.initOptions(options);

            var repay = this[options.type].monthRate[options.month] * options.totalMoney;
            //先息后本：每月还款额 = 借款总额 x 月费率
            //等额本息：每月还款额 = 借款总额 x 月费率 + 借款总额 / 借款期限
            repay = options.type == "type1" ? repay : ( repay + options.totalMoney/options.month );
            return this.fmtMoney(repay, this.fixLen, true);
        },
        getRepayByLastMonth: function(options){     //获取最后一个月的还款额
            options = this.initOptions(options);

            var repay = this[options.type].monthRate[options.month] * options.totalMoney;
            //先息后本：最后一期还款 = 借款总额 x 月费率 + 借款总额
            //等额本息：最后一期还款 = 借款总额 x 月费率 + 借款总额 / 借款期限
            repay += options.type == "type1" ? options.totalMoney : options.totalMoney/options.month;
            return this.fmtMoney(repay, this.fixLen, true);
        },
        getTotalRepayMoney: function(options){
            options = this.initOptions(options);

            //先息后本： 还款总额 = 借款总额 x 月费率 x 借款期限 + 借款总额 + 借款总额 x 2%
            //等额本息： 还款总额 = 借款总额 x 月费率 x 借款期限 + 借款总额 + 借款总额 x 3%；
            var totalPay = options.totalMoney * this[options.type].monthRate[options.month] * options.month + options.totalMoney; 
            if(options.type == "type1" || options.type == "type3"){
                totalPay += options.totalMoney * 2 / 100; 
            }else{
                totalPay += options.totalMoney * 3 / 100; 
            }
            return this.fmtMoney(totalPay, this.fixLen, true);
        }
    }

    window.Slider = Slider;

    function Slider(options){

        this.oCalInput = options.oCalInput;
        this.oInitBg = options.oInitBg;
        this.oMove = options.oMove;
        this.oMoveBg = options.oMoveBg;
        this.oTempt = options.oTempt;
        this.oBox = options.oBox;   //最外层div
        this.oError = options.oError;   //错误提示
        this.mWidth = this.oMove.offsetWidth;
        this.move_halfW = parseInt(this.mWidth / 2);
        this.left = this.oInitBg.offsetLeft;
        this.minLeft = this.left - this.move_halfW;
        this.changeSucc = options.changeSucc;

        this.dyd = options.dyd;    //抵押贷标记

        this.slider = options.slider;
        this.slider.tWidth = this.oInitBg.offsetWidth;      //总长度
        this.slider.eLen = this.slider.tWidth / this.slider.arrSmall.length;

        //默认设置位置
        this.dd = options.dd;
        //当前arrCal中所在范围
        this.iNow = 0;

        //+、-按钮触发
        this.oRight = options.oRight;
        this.oLeft = options.oLeft;

        this.timer = null;  //触发input框后执行       
    }

    Slider.prototype.setArrCal = function(){

        //计算每小段控制的百分比
        var max = this.slider.eLen / this.slider.arrSmall[0] / 2;
        var start = this.slider.startValue;
        this.arrCal = [ { money : start, min : 0, max : max } ];
        for (var i = 0; i < this.slider.arrSmall.length; i++) {
            var item = this.slider.arrSmall[i];
            var dis = this.slider.eLen / item;  //每一小段的大小
            var disMoney = this.slider.arrMoney[i] / item;  //每一小段的钱数
            for (var j = 0; j < item; j++) {
                var min = max;
                start += disMoney;
                if(j == item - 1){
                    if(i == this.slider.arrSmall.length - 1){
                        max += dis / 2;
                    }else{
                        max += dis / 2 + (this.slider.eLen / this.slider.arrSmall[i + 1]) / 2;
                    }
                }else{
                    max += dis;
                }
                this.arrCal.push({ money: start, min: min, max: max });
            };
        };

    }

    //初始化
    Slider.prototype.init = function(){

        var _this = this;

        //绑定拖拽
        ~function bindDrag(){

            _this.oMove.onmousedown = function(ev){
                var oEv = ev || event;
                var x = oEv.clientX;
                var originLeft = this.offsetLeft; 

                document.onmousemove = function(ev){
                    var oEv = ev || event;
                    var spanX = oEv.clientX - x;
                    spanX += originLeft;

                    _this.showProgress(spanX);
                }
                document.onmouseup = function(ev){
                    document.onmousemove = document.onmouseup = null;
                    _this.oMove.releaseCapture && _this.oMove.releaseCapture();
                }

                _this.oMove.setCapture && _this.oMove.setCapture();
                return false;
            }
        }()
        //绑定左右按钮点击事件
        ~function bindLRClick(){

            $(_this.oRight).on('click', function(){
                _this.iNow += 1;
                _this.iNow = _this.iNow > _this.maxSmallLen ? _this.maxSmallLen: _this.iNow;
                _this.setInfo();
                return false;
            });
            $(_this.oLeft).on('click', function(){
                _this.iNow -= 1;
                _this.iNow = _this.iNow < 0 ? 0 : _this.iNow;
                _this.setInfo();
                return false;
            });

        }();

        //自定义触发事件           
        $(this.oCalInput).on("changeTemplate", function(){
            _this.loadTemplate();
        });
        //绑定input框触发事件
        $(this.oCalInput).on("input propertychange", function(){
            _this.timer = setTimeout(function(){
                _this.bindInputChange();
            }, 300);
        });

        //设置基础值
        this.setArrCal();
        this.showProgress(this.slider.tWidth/2 + this.dd);

        //计算滑动条总的小段数量
        this.maxSmallLen = 0;
        for (var i = 0; i < this.slider.arrSmall.length; i++) {
            this.maxSmallLen += this.slider.arrSmall[i];
        };

        //如果绑定外层box的点击事件
        $(this.oBox).on('click', function(ev){
            var spanX = ev.pageX - $(_this.oMoveBg).offset().left + _this.dd;
            _this.showProgress(spanX);
            return false;
        })
    }

    Slider.prototype.bindInputChange = function(){
        $(this.oError).hide();
        clearTimeout(this.timer);

        var inputVal = this.oCalInput.value;
        var reg = /^\d[0-9]{0,}$/g;
        if(!reg.test(inputVal)){
            inputVal = this.slider.startValue;
            $(this.oError).show();
        }

        if(inputVal > this.slider.endValue){
            inputVal = this.slider.endValue;
            $(this.oError).show();
        }else if(inputVal < this.slider.startValue){
            inputVal = this.slider.startValue;
            $(this.oError).show();
        }
        var start = this.slider.startValue;
        for (var i = 0; i < this.slider.arrMoney.length; i++) {
            var sMoney = this.slider.arrMoney[i];
            var end = start + sMoney;
            if(inputVal >= start && inputVal <= end){
                var dis = inputVal - start;
                var len = this.slider.eLen * i + dis / (end - start) * this.slider.eLen;
                //赋值iNow
                for (var j = this.arrCal.length - 1; j >= 0; j--) {
                    if(this.arrCal[j].money <= inputVal){
                        this.iNow = j;
                        break;
                    }
                };
                this.oMove.style.left = len + this.dd + 'px';
                this.oMoveBg.style.width = len + 'px';
                this.loadTemplate(inputVal);
                break;
            }
            start = end;
        };

        this.changeSucc && this.changeSucc();
    }

    Slider.prototype.showProgress = function(value){
        var spanX = value;
        if(spanX < this.minLeft){
            spanX = this.minLeft;
        }else if(spanX >= this.slider.tWidth - this.mWidth + this.left + this.move_halfW){
            spanX = this.slider.tWidth - this.mWidth + this.left + this.move_halfW;
        }

        var value = spanX - this.dd;
        var rValue = 0;
        var _this = this;
        this.getIdx(value);
        //给input解绑，否则IE8出问题触发propertychange事件
        $(this.oCalInput).off("propertychange");
        this.oCalInput.value = this.arrCal[this.iNow].money;
        //重新绑定一下input改变事件，否则IE8出问题
        $(this.oCalInput).on("propertychange", function(){
            _this.timer = setTimeout(function(){
                _this.bindInputChange();
            }, 300);
        });
        this.oMove.style.left = spanX + 'px';
        this.oMoveBg.style.width = value + 'px';
        $(this.oCalInput).trigger("changeTemplate");

        this.changeSucc && this.changeSucc();
    }

    Slider.prototype.getIdx = function(value){
        for(var i = 0; i < this.arrCal.length; i++){
            var res = this.arrCal[i];
            if(value >= res.min && value <= res.max){
                this.iNow = i;
                break;
            }
        }
    }

    Slider.prototype.setInfo = function(){

        this.oCalInput.value = this.arrCal[this.iNow].money;
        var moveLeft = (this.arrCal[this.iNow].min + this.arrCal[this.iNow].max) / 2;
        if(this.iNow == 0){
            //判断下段数，第一段left直接取min
            moveLeft = this.arrCal[this.iNow].min;
        }else if(this.iNow == this.maxSmallLen){
            //判断下段数，最后一段left直接取max
            moveLeft = this.arrCal[this.iNow].max;
        }
        this.oMove.style.left = moveLeft + this.dd + 'px';
        this.oMoveBg.style.width = moveLeft + 'px'; 
        $(this.oCalInput).trigger("changeTemplate");

        this.changeSucc && this.changeSucc();
    }

    //加载模板
    Slider.prototype.loadTemplate = function(inputVal){
        if(!this.oTempt) return;

        var inputVal = inputVal ? inputVal : this.oCalInput.value;
        var temp_list = [];
        var setList = function(arr,type){
            var oGL = GLOBAL[type];
            for(var item in oGL.monthRate){
                var rate = oGL.monthRate[item];
                var name = oGL.name;
                var obj = { month: item, rate: (rate * 100).toFixed(2) + '%', type: name };
                var options = { type: type, month: item, totalMoney: inputVal * 10000 };
                // obj.counterRate = GLOBAL.getRateFee(options);
                obj.counterRate = Math.round(oGL.counterRate * 100) + '%';
                // obj.everyMonthRepay = GLOBAL.getRepayByEveryMonth(options);
                obj.lastMonthRepay = GLOBAL.getTotalRepayMoney(options);
                console.log(obj)
                arr.push(obj);
            }
        }
        
        if(this.dyd){
            setList(temp_list,'type3');
            setList(temp_list,'type4');
            var html = template("tempt_month_li", { list: temp_list });
            this.oTempt.innerHTML = html;
        }else{
            setList(temp_list,'type1');
            setList(temp_list,'type2');
            var html = template("tempt_month_li", { list: temp_list });
            this.oTempt.innerHTML = html; 
        }
        
    }

});
//行业分析右侧浮动效果
$(function(){
    init();
    $(window).on("scroll",function(){
        init();
    }).on("resize",function(){
        init();
    }); 
    function init(){
        var $frwhereaside = $(".frwhere-aside"),
            $frwheremenu = $(".frwhere-menu"),
            $versiontail = $(".version-tail"),
            top = $frwhereaside.offset().top,
            left = $frwhereaside.offset().left+$frwhereaside.width()+11,
            height = $frwheremenu.height(),
            bottomTop = $versiontail.offset().top,
            scrollTop = $(window).scrollTop();
        if(scrollTop >= top-10){
            $frwheremenu.css({position:"fixed",left:left+"px",top:"10px"});
        }
        if(scrollTop + height+30 >= bottomTop){
            $frwheremenu.css({top:bottomTop-(scrollTop + height+32)+"px"});
        }
        if(scrollTop < top-10){
            $frwheremenu.css({position:"static"});
        }
    }
})