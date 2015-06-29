/*
fixedToBottom;
* */
$(function(){
    //新版项目详情页二维码层级关系
    var $versionOp = $(".version-project-record-list>p");
    $versionOp.find("a").hover(
            function(){
                var _this = $(this);
                _this.parent().addClass("z-index1");
            },
            function(){
                var _this = $(this);
                _this.parent().removeClass("z-index1");
            }
    );
    //end
    $('#login_name_2').on('click', function(event) {
        location.href = 'https://www.souyidai.com/myaccount/capital';
    });
    var $footer = $(".footer"),
        $mainOffsetHeight = $(".main-offsetHeight");

    $footer = typeof $(".footer")[0] != "undefined" ? $(".footer") : $("div[data-type='footer']");

    function fixedToBottom($footer,$main,$cls){//$footer低端导航//$cls添加的类定位低端
        var $wh = $(window).height(),
            $mainH = $main.height(),
            $ftH = $footer.height(),
            $bh = $mainH + $ftH;//整个页面的高度，$("html,body").height();
        if($mainH > ($wh-$ftH)){
            $footer.removeClass($cls);
        }else if($wh > $bh){
            $footer.addClass($cls);
        }
    }
    fixedToBottom($footer,$mainOffsetHeight,"fixedToBottom");
    $(window).resize(function(){
        fixedToBottom($footer,$mainOffsetHeight,"fixedToBottom");
    });
    window.setInterval(function(){fixedToBottom($footer,$mainOffsetHeight,"fixedToBottom");},500);

    //end
    //修改a标签href属性 将默认####->更新为 javascript:void(0);
    // {
    //     function aHrefFun(obj,oldSpace,newSpace){
    //         obj.each(function(){
    //             var _this = $(this),
    //                 $href = _this.attr("href");
    //             $href = $href.trim();
    //             if($href == oldSpace){
    //                 _this.attr("href",newSpace);
    //             }
    //         });
    //     }
    //     aHrefFun($("a"),"####","javascrpt:void(0)");
    //     window.setInterval(function(){ aHrefFun($("a"),"####","javascrpt:void(0)");},10);
    // }
    //end
    /*common->项目详情圆形进度条。。。*/
    function setProBarStyle(obj,objItself){

    //obj->$("div[data-type='ver-project-circle']");=====objItself ->"div[data-type='ver-project-circle']";//obj为circle大盒子

        obj.each(function(index, el) {
            var _this = $(this);
            var num = _this.find('span').text() * 3.6;
            if (num<=180) {
                _this.find("div[data-type='version-project-right']").css('transform', "rotate(" + num + "deg)");
            } else {
                $(this).find("div[data-type='version-project-right']").css('transform', "rotate(180deg)");
                $(this).find("div[data-type='version-project-left']").css('transform', "rotate(" + (num - 180) + "deg)");
            };
        });

        obj.find("span[data-type='version-project-cer-span']").each(function(i) {
            var $value = $(this).html();
            if ($value > 0 && $value <= 50) {
                $(this).parents(objItself).css("backgroundColor", "#ffd200");
            } else if ($value > 50 && $value < 100) {
                $(this).parents(objItself).css("backgroundColor", "#ff510d");
            } else if ($value == 100) {
                $(this).parents(objItself).css("backgroundColor", "#81c931");
            }
        });
    }
    //circle->width:48px/height:48px;
    var objProjectbox = $("div[data-type='ver-project-circle']"),
         objProjectItself = "div[data-type='ver-project-circle']";
    setProBarStyle(objProjectbox,objProjectItself);
    /*end*/

});
/*椭圆*/
/*
* 判断超过90%，外框显示红色
* */
var circleRender = function() {
    $('.circle').each(function(index, el) {
        var num = $(this).find('span').text() * 3.6;
        if (num<=180) {
            $(this).find('.right').css('transform', "rotate(" + num + "deg)");
        } else {
            $(this).find('.right').css('transform', "rotate(180deg)");
            $(this).find('.left').css('transform', "rotate(" + (num - 180) + "deg)");
        };
    });

    var $mask_span = $(".mask > span");
    $mask_span.each(function(i){
        var $value = $mask_span.eq(i).html();
        var browser=navigator.appName,
            b_version=navigator.appVersion,
            version=b_version.split(";");
        //trim_Version=version[1].replace(/[ ]/g,"");

        if(version[1] != undefined){
            var trim_Version=version[1].replace(/[ ]/g,"");
        }

        if($value >= 75&&$value < 100&&!(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE7.0")){
            $(this).parents(".circle").css("backgroundColor","#ff2802");
        }else if ($value >= 50 && $value < 100&&!(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE7.0")) {
            $(this).parents(".circle").css("backgroundColor","#ff9102");
        }else if($value == 100&&!(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE7.0")){
            $(this).parents(".circle").css("backgroundColor","#6db344");
        }
    });
}
$(function() {
    circleRender();
});
/*椭圆end*/
/*我要投资打通*/
$(function(){
    var $tender_item = $(".tender-item"),
        $subtraction = $(".subtraction"),
        $quickly = $(".quickly");
    $(document).on('mouseenter', ".tender-item", function(){
        $(this).addClass("tender-hover-bg");
    });
    $(document).on('mouseleave', ".tender-item", function(){
        $(this).removeClass("tender-hover-bg");
    });
//    $tender_item.click(function(){
//        $(this).removeClass("tender-hover-bg");
//        $(this).removeClass("subtraction-bg")
//        $(this).toggleClass("tender-active-bg");
//    });
    $(document).on('click', '.quickly' ,function(){
//        var $parents = $(this).parents(".tender-item");
//        $parents.removeClass("tender-hover-bg");
//        $parents.removeClass("tender-active-bg");
//        $parents.addClass("subtraction-bg");
        var index = $(this).parents(".tender-item").index();
        var $list = $(this).parents("#tender-items").find(".tender-item");
        for(var i= 0,len = $list.length;i<len; i++){
            $list.eq(i).removeClass("tender-active-bg");
        }
        $list.eq(index).addClass("tender-active-bg");
    });
    /*判断账户余额 - + 快速投标*/
    //console.log($("input[data-target='total']").val());
    var $balanceV = $("input[data-target='total']").val();//账户余额
    var $plus = $(".plus"),//减
        $subtract = $(".subtract"),//加
        $quicklyInput = $(".quickly-input"),//input框
        $btnSubmit  = $(".btn-submit");//提交按钮
    /*
//    $plus.on("click",function(){
//
//        var $quicklyInput = $(this).parent().find(".quickly-input");
//        var $newN = parseInt($quicklyInput.val());
//        if($newN > 100 ){
//            $newN = $newN -100;
//            $quicklyInput.val($newN);
//        }
//        if($newN <= 100){
//            $(this).addClass("displey-reduce");
//        }
//        if($newN <= $balanceV){
//            $(this).parent().find(".subtract").removeClass("displey-reduce");
//            $(this).parent().find(".bid").removeClass("msg-red").html("快速投标");
//            $(this).parent().find(".bid").addClass("big-bg-color");
//            if(!isUserName){
//                $(this).parent().find(".bid").addClass("btn-submit");
//            }
//        }
//
//
//    });
//    $subtract.on("click",function(){
//        var $quicklyInput = $(this).parent().find(".quickly-input");
//        var $newN = parseInt($quicklyInput.val());
//        if($newN < $balanceV){
//            $newN = $newN + 100;
//            $quicklyInput.val($newN);
//            $(this).parent().find(".plus").removeClass("displey-reduce");
//        }
//        if($newN >= $balanceV){
//            $(this).addClass("displey-reduce");
//
//            $(this).parent().find(".bid").addClass("msg-red").html("余额不足");
//            $(this).parent().find(".bid").removeClass("big-bg-color btn-submit");
//        }
//        //console.log($(this).parents(".tender-item").index())
//    });
//    $quicklyInput.blur(function(){
//        var $num = $(this).val();
//        if(parseInt($num) < parseInt($balanceV)){
//            $(this).parent().find(".subtract").removeClass("displey-reduce");
//            $(this).parent().find(".bid").removeClass("msg-red").html("快速投标");
//            $(this).parent().find(".bid").addClass("big-bg-color");
//            if(!isUserName){
//                $(this).parent().find(".bid").addClass("btn-submit");
//            }
//        }
//    });
*/
    /*我要投资打通加减(临时版)*/
    $(document).on("click", '.plus', function(){
//
        var $quicklyInput = $(this).parent().find(".quickly-input");
        var $newN = parseInt($quicklyInput.val());
        if($newN > 100 ){
            $newN = $newN -100;
            $quicklyInput.val($newN);
        }
        if($newN <= 100){
            $(this).addClass("displey-reduce");
        }
    });
    $(document).on("click", '.subtract', function(){
        var $quicklyInput = $(this).parent().find(".quickly-input");
        var $newN = parseInt($quicklyInput.val());
        $newN = $newN + 100;
        $quicklyInput.val($newN);
        $(this).parent().find(".plus").removeClass("displey-reduce");
    });
    /*我要投资打通加减(临时版)end*/
    /*判断用户名是否登录*/
    //var $loinUserName = $.trim($("input[data-type='login_user_name']").val());
    var isUserName = false;
    var $loginAfter = $('#login_after');
    if($loginAfter.css('display') != "none"){
        $(".bid").addClass("btn-submit");
        isUserName = false;
    }else{
        $(".bid").removeClass("btn-submit");
        isUserName = true;
    }
    if(isUserName){
        $(".bid").click(function(){
            alert("您还未登录，请登录后再操作");
        });
    }
    /////
});

/*
*drop-title 选项卡
* */
$(function(){
    var $drop_title = $("#drop-list .drop-title"),
         $drop_tender_box = $(".drop-tender-box");

    $drop_title.on("click","li",function(){
        var index = $(this).index(),
             $li = $(this).parent().find("li"),
             $tender_list = $(this).parent().next().find(".tender-list");
        for(var i= 0,len = $li.length;i<len;i++){
            $li.eq(i).removeClass("drop-active");
            $tender_list.eq(i).hide();
        }
        $(this).addClass("drop-active");
        $tender_list.eq(index).show();
    });
});

/////////////////
//console.log($mask_span.eq(6).html() > 90)
//console.log($(".tender-item").find(".circle").css("backgroundColor","red"))
//alert(navigator.appVersion)
//console.log(navigator.userAgent.indexOf("MSIE") > -1)
//var browser=navigator.appName;
//var b_version=navigator.appVersion;
//var version=b_version.split(";");
//var trim_Version=version[1].replace(/[ ]/g,"");
//if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE7.0")
//{
//    alert("IE 7.0");
//}
//else if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE6.0")
//{
//    alert("IE 6.0");
//}
/*我要投资打通*/
/*展开详细*/
$(function(){
    var $btn_minute_pull = $(".btn-minute-pull");
    var $strongHtml = $btn_minute_pull.find("strong").html();
    $(document).on("click",".btn-minute-pull",function(){
        var self = $(this),
            $parent =self.parent();
        $parent.toggleClass("btn-away-open");
        $parent.parent().toggleClass("open-border");
        if($parent.parent().next().css("display") == "none"){
            $parent.parent().next().show()
            self.find("strong").html("收起");
            heightAuto();
        }else{
            $parent.parent().next().hide();
            self.find("strong").html($strongHtml);
        }
    });
});

 /*
剩余期数、总期数换算
* */
function periodFun(){
    var $itemS = $(".inform-list .css-bar").find("strong");
    $itemS.each(function(i){
        var self = $(this);
        var $cssBar = $(".inform-list .css-bar").eq(i),
                $total = $(".inform-list .total-periods").eq(i),
                $surplus = $(".inform-list .surplus-periods").eq(i);
            var t = $total.html(),
                s = $surplus.html(),
                c = $cssBar.width(),
                x,
                proportion;
            x = (s*c)/t;
            proportion =(x/c)*100;
            $itemS.eq(i).css("width",proportion+"%")
    });
}
$(function(){
    periodFun();
//    var $itemS = $(".inform-list .css-bar").find("strong");
//    for(var i= 0,len = $itemS.length;i<len;i++){
//        (function(i){
//            var $cssBar = $(".inform-list .css-bar").eq(i),
//                $total = $(".inform-list .total-periods").eq(i),
//                $surplus = $(".inform-list .surplus-periods").eq(i);
//            var t = $total.html(),
//                s = $surplus.html(),
//                c = $cssBar.width(),
//                x,
//                proportion;
//            x = (s*c)/t;
//            proportion =(x/c)*100;
//            $itemS.eq(i).css("width",proportion+"%")
//        })(i)
//    }
});
/*
* 返回顶部/快速投标
* */
$(function(){
    var $backtop = $(".backtop").parent(),
        $pageQuickBid = $(".page-quick-bid").parent(),
        $pageDownload = $(".page-download").parent();

    $backtop.hide();
    $pageQuickBid.hide();
    $pageDownload.hide();
    $(window).scroll(function(){
        var $scrollTop = $(window).scrollTop();
        if($scrollTop > 50){//返回顶部
            $backtop.fadeIn(400);
            $pageDownload.fadeIn(400);
        }else{
            $backtop.fadeOut(200);
            $pageDownload.fadeOut(400);
        }
        if($scrollTop > 510){//快速投标
            $pageQuickBid.fadeIn(400);
        }else{
            $pageQuickBid.fadeOut(200);
        }
    });
    $backtop.click(function(){
        $("body,html").animate({scrollTop:"0px"},800);
    });
});
/*
* 快速投标加减法
* */
$(function(){
    ///////////闪动///////////
    function shake(ele,cls,times){
        var i= 0,t=false,o=ele.attr("class")+" ",c="",times=times||2;
        if(t) return;
        t = setInterval(function(){
            i++;
            c = i%2 ? o+cls :o;
            ele.attr("class",c);
            if(i == 2*times){
                clearInterval(t);
                ele.removeClass(cls);
            }
        },200);
    }
    //////////////////////
    var $remove = $(".btn-remove"),//减号
        $add = $(".btn-add"),//加号
        $inputNumber = $(".input-receive"),
        $available_money = $(".available-money"),//可用余额
        $message_one = $(".message-one"),//账户。message
        $message_two = $(".message-two"),//标message
        $left_over_case = $(".left-over-case"),//剩余可投
        $btn_bid_now = $(".btn-investment");

    var $leftOverHtml,$leftOverCase,
        $avaHtml,$avaMoney;
    if($available_money[0] != undefined){
         $avaHtml = $available_money.html();
         $avaMoney = $avaHtml.replace(",","");
        $avaMoney = parseInt($avaMoney);
    }
    //console.log($available_money[0] !=undefined)
    if($left_over_case[0] != undefined){
        $leftOverHtml = $left_over_case.html();
       $leftOverCase =$leftOverHtml.replace(",","");
        $leftOverCase = parseInt($leftOverCase);
    }
    //console.log($leftOverCase);
    /*
    $remove.click(function(){
        var $num =parseInt($inputNumber.val());
        if($num > 100){
            var $num =$num - 100;
            $inputNumber.val($num);
        }
        if($num <= 100){
            $(this).addClass("displey-reduce");
        }
        if($num < $avaMoney){
            $add.removeClass("displey-reduce");
            $message_one.hide();
            $btn_bid_now.removeClass("displey-reduce");
        }
        if($num <= $leftOverCase){
            $message_two.hide();
            $btn_bid_now.removeClass("displey-reduce");
        }
//        console.log($num + "="+$leftOverCase)
    });

    $add.click(function(){
        var $num =parseInt($inputNumber.val());
        if($leftOverCase != undefined){
            if($num < $avaMoney && $num <=$leftOverCase){
                var $num = $num + 100;
                $inputNumber.val($num);
            }
        }else{
            if($num < $avaMoney){
                var $num = $num + 100;
                $inputNumber.val($num);
            }
        }
        if($num >= $avaMoney){
            //console.log("falee");
            $(this).addClass("displey-reduce");
            shake($inputNumber,"shake-red",3);
            $message_one.show();
            $btn_bid_now.addClass("displey-reduce");
        }
        if($num > $leftOverCase){
            $(this).addClass("displey-reduce");
            shake($inputNumber,"shake-red",3);
            $message_two.show();
            $btn_bid_now.addClass("displey-reduce");
        }
        $remove.removeClass("displey-reduce");
    });

    //////////////$avaMoney账户余额   $leftOverCase剩余可投标
    $inputNumber.blur(function(){
        if(parseInt($inputNumber.val()) > 100){
            $remove.removeClass("displey-reduce");
        }
        if(parseInt($inputNumber.val()) < $avaMoney){
            $add.removeClass("displey-reduce");
            $message_one.hide();
        }
        if(parseInt($inputNumber.val()) < $leftOverCase){
            $add.removeClass("displey-reduce");
            $message_two.hide();
        }
    });
    */
    /*我要投资弹窗、标的详情加减（临时版）*/
    $remove.click(function(){
        var $num =parseInt($inputNumber.val());
        if($num > 100){
            var $num =$num - 100;
            $inputNumber.val($num);
        }
        if($num <= 100){
            $(this).addClass("displey-reduce");
        }

//        console.log($num + "="+$leftOverCase)
    });
    $add.click(function(){
        var $num =parseInt($inputNumber.val());
        var $num = $num + 100;
        $inputNumber.val($num);
        $remove.removeClass("displey-reduce");
    });
    /*我要投资弹窗、标的详情加减（临时版）end*/
    ////////////////
});
/*我的账户——资金明细*/
/*
*资金类型
* 其他/收起下拉菜单
* */
$(function(){
    var $otherType = $(".other-type");
    $otherType.click(function(){
        var $typeList = $(this).parents(".capital-aside").find(".toggle-type-list");
        if($typeList.css("display") == "none"){
            $typeList.css("display","block");
            $(this).addClass("ico-pull").html("收起")
        }else if($typeList.css("display") == "block"){
            $typeList.css("display","none");
            $(this).removeClass("ico-pull").html("其他");
        }

    });
    //console.log($("body"))
});

/*
* 弹窗
* */
//通用弹窗
var showComLayer = function ($popupMask,$popup){
    var $winW = $(window).width(),
        $winH =$(window).height(),
        $dH = $("body").height(),
        $document = $(document).height(),
        $left,$top;
    $popupMask.css({"width":$winW + "px","height":$document + "px"});
    $left = ($winW - $popup.width())/2;
    $top = ($winH - $popup.height())/2;
    $popup.css({"left":$left + "px","top":$top+$(window).scrollTop() + "px","display":"block"});
    $popupMask.show();
};
$(function(){
    //var $btnSubmit  = $(".btn-submit");//提交按钮
    var $btnSubmit = $(".bid");
    var $winW = $(window).width(),
        $winH =$(window).height(),
        $dH = $(document).height();
    var $popupMask = $(".popup-mask"),
        $popup = $(".popup"),
        $closed = $(".closed");
    var $left,$top;
    $btnSubmit.on("click",function(){
       var $newBtn = $(this).parent().find(".btn-submit")[0];
        if($newBtn != undefined){
            //showPopup();//显示弹窗
        }
    });
    //强制刷新本页window.location.Reload()
    //新版本跳过弹窗相关事件
    if (!$('.version-layer').hasClass('version-1')) {
        $popup.on("click",".reload-closed",function(){
            window.location.reload();
            $(this).parents(".popup").hide();
            $popupMask.hide();
        });
        $(document).on("click",".reload-closed",function(){
            window.location.reload();
            $(this).parents(".web-layer").hide();
            $popupMask.hide();
        });
        //关闭，不刷新
        $popup.on("click",".btn-return,.closed,.shut-down",function(){
            $(this).parents(".popup").hide();
            $popupMask.hide();
        });
        $(document).on("click",".btn-return,.closed,.shut-down",function(){
            $(this).parents(".web-layer").hide();
            $popupMask.hide();
        });
    }
    function showPopup(){
        var $winW = $(window).width(),
        $winH =$(window).height(),
        $dH = $(document).height();

        $popupMask.css({"width":$winW + "px","height":$dH + "px"});
        $left = ($winW - $popup.width())/2;
        $top = ($winH - $popup.height())/2;
        $popup.css({"left":$left + "px","top":$top + "px","display":"block"});
        $popupMask.show();
    }
    //同意阅读勾选，可点击按钮动作
    // $(".protocol-checkbox").on("click",function(){
    //     var self = $(this);
    //     var authCode = $('#authcode_input').val();
    //     var $conButton = self.parents(".checkedbox").find("input[data-type=confirm-submit]");
    //     if ($(this)[0].checked == false) {
    //         $conButton.attr("disabled", true);
    //         $conButton.addClass("btn-stop-click");
    //     } else {
    //         if (authCode != undefined) {
    //             if (authCode.length == 4) {
    //                 $conButton.attr("disabled", false);
    //                 $conButton.removeClass("btn-stop-click");
    //             }
    //         } else {
    //             $conButton.attr("disabled", false);
    //             $conButton.removeClass("btn-stop-click");
    //         }
    //     }
    // });
    /*我要投资表的详情金额验证*/
    //默认清除 禁用加减号样式
    function removeStyle(){
        var $as =  $(".btn-box-updown").children();
        for(var i= 0,len = $as.length;i<len;i++){
            $as.eq(i).removeClass("displey-reduce");
            $as.eq(i).find("span").removeClass("ico-down-failed");
            $as.eq(i).find("span").removeClass("ico-up-failed");
        }
    }
    //显示勾选框(协议框)。隐藏错误提示框
    function iframeHide(){
        $signErrormsg.hide();
        $dealRow.show();
    }
    var $sumInput = $(".sum-input");//文本框
    var $dealRow = $(".deal-row");//协议框
    var $signErrormsg = $(".sign-errormsg");//错误接收框
    $sumInput.on("change",function(){
        var self = $(this);
        var $val = self.val();
        //去除空格
        $val = $val.replace(/\s+/g,"");
        self.val($val);
        //
        var reg =  /^\d+(\.\d+)?$/;//验证仅仅输入整数
        if(!reg.test($val)){
            $dealRow.hide();
            $signErrormsg.addClass("error-msg-red").html("请输入整数").show();
        }else if($val > currentBalance){
            $dealRow.hide();
            $signErrormsg.addClass("error-msg-red").html("余额不足，请先<a href='/myaccount/capital/deposit'>充值</a>").show();
        }else if($val > amountBidAval){
            $dealRow.hide();
            $signErrormsg.addClass("error-msg-red").html("不能高于剩余可投金额（"+ amountBidAval +"元）").show();
        }
        // else if($val > parseFloat(amountUserLimit -amountAlreadyBid)){
        //     $dealRow.hide();
        //     $signErrormsg.addClass("error-msg-red").html("不能高于单人投标限额（"+amountUserLimit+"元）").show();
        // }
        else if($val < 1){
            $dealRow.hide();
            $signErrormsg.addClass("error-msg-red").html("投资额不能低于1元").show();
        }
        else{
            iframeHide();
            removeStyle();
        }
    });
    //加。上
    // 单用户投标金额上限(标额度的指);
//    var amountUserLimit =
//    // 当前用户可用余额
//    var currentBalance =
//    // 剩余可投金额
//    var amountBidAval =
    $(".btn-box-updown").on("click",".btn-css-up",function(){
        removeStyle();
        var $val = parseFloat($sumInput.val());
        var a = [amountUserLimit,currentBalance,amountBidAval];
        a.sort(function(a,b){return a-b;});//升序排列
        var $smallVal = a[0];
        $val = ($val + 100).toFixed(0);//解决parseFloat（相加相减） 的精度问题
        if($val< $smallVal){
            $sumInput.val($val);
            iframeHide();
        }else{
            $sumInput.val($smallVal);
            $(this).addClass("displey-reduce");
            $(this).find("span").addClass("ico-up-failed");
        }
    });
    //减。下
    $(".btn-box-updown").on("click",".btn-css-down",function(){
        removeStyle();
        var $val =parseFloat($sumInput.val());
        var a = [amountUserLimit,currentBalance,amountBidAval];
        a.sort(function(a,b){return a-b;});//升序排列
        var $smallVal = a[0];
        $val = ($val - 100).toFixed(0);//解决parseFloat（相加相减） 的精度问题
        if($val < 100){
            $sumInput.val(100);
            $(this).addClass("displey-reduce");
            $(this).find("span").addClass("ico-down-failed");
            iframeHide();
        }else if($val> $smallVal){//后添加..
            $sumInput.val($smallVal);
            iframeHide();
        }else{
            $sumInput.val($val);
            iframeHide();
        }
        //console.log($val);
    });
    /*end*/
    /*我的账户-红包*/
    var $redSwitch = $(".red-switch");
    function objHide(obj,cls){
        if(cls){
            obj.each(function(i){
                var self = $(this);
                self.removeClass(cls);
            });
        }else{
            obj.each(function(i){
                var self = $(this);
                self.hide();
            });
        }
    }
    $redSwitch.on("click","span",function(){
        var self = $(this);
        var index = self.index();
        objHide($redSwitch.find("span"),"blue-current");
        objHide(self.parent().next().children());
        self.addClass("blue-current");
        $redSwitch.next().children().eq(index).show();
    });
    /*我的账户-红包end*/
});
/*
*导航滑动效果
* */
$(function(){
    var $navLi = $(".nav-list > li");
    $navLi.find("a").mouseover(function(){
        var self = $(this).parent();
        self.addClass("nav-li-hover");

        var $navHover = $(this).parents(".nav-list").find(".nav-hover");
        $navHover.css({"width":self.width() + "px"});
        var $offsetLfet =  $(this).offset().left - $(".nav-list").offset().left;
        $navHover.stop().animate({"left":($offsetLfet -60) + "px"},200);
    });
    $navLi.find("a").mouseout(function(){
        var self = $(this).parent();
        var $navHover = $(this).parents(".nav-list").find(".nav-hover");
        self.removeClass("nav-li-hover");
        $navHover.css({"width":"0"});
    });
});
/*
* 分页
* */
$(function(){
    var $digital = $(".paging");
    $digital.on("mouseenter","a",function(){
        $(this).addClass("digital-hover");
    }).end()
        .on("mouseleave","a",function(){
            $(this).removeClass("digital-hover");
        });
});

/*
*首页轮播图
* */
$(function(){
    $(".gallery-ul").first().clone().appendTo($(".gallery-xs"));
    var $gallery_ul = $(".gallery-ul");
    var $gallery_xs = $(".gallery-xs");
    $gallery_xs.width($gallery_ul.width()*$gallery_ul.length);
    var iNow = 0;
    function autoM(){
        iNow ++;
        if(iNow >= $gallery_ul.length){
            iNow = 1;
            $gallery_xs.css({left:0+"px"})
        }
        $gallery_xs.stop().animate({left:-$gallery_ul.width()*iNow},1000);
        window.setTimeout(autoM,2000)
    }
    autoM();
});
/*
* 登录注册页
* */
//$(function(){
//    var $article_input = $(".article-input");
//    $(".ico-reg").on("click",function(){
//        if($(this).hasClass("input-checked")){
//            $(this).removeClass("input-checked");
//            $article_input.attr("checked",false);
//            //$article_input.attr("data-type","")
//        }else{
//            $(this).addClass("input-checked");
//            $article_input.attr("checked",true)
//        }
//    });
//});
/*
 * 免费获取验证码倒计时
 * */
//$(function(){
//    var $btnClickCode = $(".btn-click-code");
////    var wait = 5;
//    $btnClickCode.attr("disabled",false);
//    function time(o){
//        if(wait ==0){
//            o.removeAttribute("disabled");
//            o.value = "点击获取";
//            $(o).removeClass("btn-disabled");
//            wait = 5;
//        }else{
//            o.setAttribute("disabled",true);
//            $(o).addClass("btn-disabled");
//            o.value = "重新发送(" + wait + ")";
//            wait --;
//            setTimeout(function(){time(o)},1000)
//        }
//    }
//    $btnClickCode.click(function(){
//        var self = $(this)[0];
//        setTimeout(function(){time(self)},1000);
//        return false;
//    });
//});

/*
* 我的账户——借款列表选项卡
* 借款列表、历史借款
* */
$(function(){
    var $borrowSpan = $(".borrowing-tab > span");
    $borrowSpan.on("click",function(){
        var index = $(this).index();
        var $mainList = $(this).parents(".aside-right").find(".invest-main");
        for(var i= 0,len = $mainList.length;i<len;i++){
            $mainList.eq(i).hide();
            $(".borrowing-tab > span").eq(i).removeClass("headline-current");
        }
        $(this).addClass("headline-current");
        $mainList.eq(index).show();
    });
});
 /*
*折叠我要借款
* */
$(function(){

//    var $pre_trial = $(".pre-trial");
//    $pre_trial.find(".btn-editor").on("click",function(){
//        var $pre_row = $(this).parents(".pre-trial").next();
//        $(this).html("保存");
//        $(this).addClass("btn-preserve");
//        $pre_row.show();
//    });
    //var $pre_trial = $(".pre-trial .btn-editor").html("保存")

});
 /*
* 我要借款，select onchange
* */
//$(function(){
//    var $select = $(".select-change");
//    $select.change(function(){
//        var index = $(this).get(0).selectedIndex;
//        /*映射职业信息列*/
//        var $groupsDiv = $(this).parents(".checking").find(".groups-row>div");
//        for(var i = 0,len = $groupsDiv.length;i<len;i++){
//            $groupsDiv.eq(i).hide();
//        }
//        $groupsDiv.eq(index).show();
//        /*映射职业信息列*/
//    });
//});
/*
* 个人信息、基本资料 、婚姻状态为已婚 共贷人资料上传显示。否则隐藏
*
* */
//$(function(){
//    var $marital_status = $(".marital_status");
//    $marital_status.change(function(){
//        var $val = $(this).val();
//        if($val == "已婚"){
//            $(".total_others").css("display","none");
//        }else{
//            $(".total_others").css("display","block");
//        }
//    });
//});
/*我的账户充值*/
$(function(){
    var $bankItem = $(".choose-row .bank-item>label");
    $bankItem.on("click",function(){
        var index = $(this).parent().index();
        var $divs = $(".information>.remarks>div");
        for(var i= 0,len = $divs.length;i<len;i++){
            $divs.eq(i).hide();
            $('.rechargebankst-cft-infor').hide();
        }
        if ($(this).find('input').val() === 'tenpay') {
            $('.rechargebankst-cft-infor').show();
        } else {
            $divs.eq(index).show();
        }
    });
});
/*我的借款——还款*/
$(function(){
    $(".span-radio").on("click","input",function(){
       // repayRowFlag = 0;
//        var $radio = $(this).find("input[data-type=radio]");
        var $buttonRow = $(this).parents(".repay-left").next().find(".press-button-row");
        var $moneyRow =  $(this).parents(".repay-left").next().find("money-row");
        var $alsoDeal = $(this).parents(".repay-left").next().find(".also-deal");
        var $alsolen = $(this).parents(".repay-row").find(".also-deal");
        for(var i= 0,len = $alsolen.length;i<len;i++){
            $alsolen.eq(i).hide();
        }
        if($(this).attr("disabled") != "disabled"){
//            $moneyRow.css("display","block");
            $alsoDeal.show();
        }

    });
    //btn显示 radio添加disabled
    var $pressBtn = $(".repaymoney-row");
    for(var i= 0,len = $pressBtn.length;i<len;i++){
        if( $pressBtn.eq(i).find(".press-button-row").css("display") == "block"){
            $pressBtn.eq(i).find("input[data-type=radio]").attr("disabled","disabled")
        }
    }
    //
});
/*银行卡*/
$(function(){
    //目前支持银行
    var $onblur = $(".form-group").find("p[data-toggle=onfocus]");
    var $bankList = $(".bank-list");
    $onblur.on("click",function(e){
        var self = $(this);
        self.find('small').text('▲');
        self.addClass("border-radius");
        self.parents().next().show();
        e.stopPropagation();
    });
    $(document).on("click",function(){
       $bankList.hide();
       $onblur.find('small').text('▼');
        $onblur.removeClass("border-radius");
    })
    $bankList.on("click","a",function(){
        var self = $(this);
        var $saveImg = self.find("img").clone();
        var $acceptBox = self.parent().prev().find("p");
        $acceptBox.find('img').remove();
        $acceptBox.append($saveImg);
        self.parent().hide();
        $acceptBox.removeClass("border-radius");
    });
   //映射字体变大
    var $mapping = $(".form-group").find("input[data-toggle=mapping]");
    $mapping.on("keyup",function(){
        var self = $(this);
        var $saveValue = self.val();
        var $justlayer = self.parent().find(".just-layer");
        $justlayer.show();
        $justlayer.html($saveValue);
        if($saveValue == ""){
            $justlayer.hide();
        }
    });
    $mapping.on("blur",function(){
        var self = $(this);
        var $justlayer = self.parent().find(".just-layer");
        $justlayer.hide();
    });
    $mapping.on("focus",function(){
        var self = $(this);
        var $saveValue = self.val();
        if($saveValue == ""){
            return;
        }
        var $justlayer = self.parent().find(".just-layer");
        $justlayer.show();
    });
    //end
});
/*银行卡end*/
/*取现银行*/
$(function(){
    var $bankEvent = $(".bank-event");
    var disableSubmit = function(){
        $('#submitBtn').addClass('btn');
        //$('#submitBtn').addClass('btn-default-color');
        //$('#submitBtn').attr('disabled','disabled');
    }
    var enableSubmit = function(){
        $('#submitBtn').removeClass('btn-default-color');
        $('#submitBtn').removeAttr('disabled');
    }
    disableSubmit();
    $(document).on("click",".bank-event",function(){
        //$(this).toggleClass("cash-card-click");
        var self = $(this);
        if(self.hasClass("cash-card-click")){
            self.removeClass("cash-card-click");
        }else{
            var $bankEvents = $(".bank-event");
            for(var i= 0,len = $bankEvents.length;i<len;i++){
                $bankEvents.eq(i).removeClass("cash-card-click");
            }
            self.addClass("cash-card-click");
        }
        if($('.cash-card-click').length <= 0){
            disableSubmit();
        }else{
            enableSubmit();
        }
    });
    //添加银行卡
    var $defautlAddCard = $(".defautl-add-card");
    $defautlAddCard.on("mouseenter",function(){
        $(this).addClass("hover-bgcolor");
    });
    $defautlAddCard.on("mouseleave",function(){
        $(this).removeClass("hover-bgcolor");
    });
});
/*安全中心面包屑提示*/
// $(function(){
//     function countdown(delay,$breakTips){//倒计时
//         if(delay-- > 0){
//             $breakTips.stop().animate({"top":"0px"});
//             objTime.time=window.setTimeout(function(){countdown(delay,$breakTips)},1000);
//         }else{
//             $breakTips.stop().animate({"top":"-34px"});
//             return;
//         }
//     }
//     var $breakTips = $(".break-tips");
//     var objTime = {};
//     function btnSmallClosed(){
//         window.clearTimeout(objTime.time);
//         $breakTips.stop().animate({"top":"-34px"});
//     }
//     $(".btn-small-closed").on("click",function(){
//         btnSmallClosed();
//     });
// });
/*cms(关于我们-加入我们)（帮助中心某类提问）*/
function footerAutoFun($footer,$main,$cls){//$footer低端导航//$cls添加的类定位低端footerAutoFun($(".footer"),$(".main-offsetHeight"),"fixedToBottom");
    var $wh = $(window).height(),
        $mainH = $main.height(),
        $ftH = $footer.height(),
        $bh = $mainH + $ftH;//整个页面的高度，$("html,body").height();
    if($mainH > ($wh-$ftH)){
        $footer.removeClass($cls);
    }else if($wh > $bh){
        $footer.addClass($cls);
    }
}
$(function(){
//    var $personnelList = $(".personnel-list");
    var $jobsTitle = $(".jobs-title");
    $jobsTitle.on("click",function(){
       var self = $(this);
       var $jobsInfor = self.next();
       if($jobsInfor.css("display") == "block"){
           $jobsInfor.hide();
           self.find("em").removeClass("ico-cms-show");
       }else if($jobsInfor.css("display") == "none"){
           var $jobsInfors = $(".personnel-list").find(".jobs-infor");
           for(var i= 0,len = $jobsInfors.length;i<len;i++){
               $jobsInfors.eq(i).css("display","none");
               $(".jobs-title").eq(i).find("em").removeClass("ico-cms-show");
           }
           $jobsInfor.show();
           self.find("em").addClass("ico-cms-show");
       }

        footerAutoFun($(".footer"),$(".main-offsetHeight"),"fixedToBottom");
    });
   //如果从列表常见问题过来，需要跳转到对应问题
   function showQuestion(){
        var href = window.location.href;
        var anchorA = parseInt(href.substring(href.lastIndexOf('#')+1));
        anchorA = isNaN(anchorA)? "" : anchorA;
        if(anchorA != ""){
            var $jobsTitle = $(".helpc-listings-item-title");
            var $showP = $jobsTitle.filter("#"+anchorA);
            if($showP.length == 0) return;
            var $jobsInfors = $jobsTitle.next();
            for(var i= 0,len = $jobsInfors.length;i<len;i++){
               $jobsInfors.eq(i).hide();
               $jobsTitle.eq(i).removeClass("current");
            }
            $showP.addClass("current").next().show();
        }
    }
    showQuestion(); 
    //鼠标滑过事件
    $(".jobs-title").mouseenter(function(){
        $(this).addClass("jobs-hover");
    }).mouseleave(function(){
            $(this).removeClass("jobs-hover");
        });
    /*消息框折叠*/
    function eachFun(obj,cls){
        if(cls){
            obj.each(function(){
                $(this).removeClass(cls);
            });
        }else{
            obj.each(function(){
                $(this).hide();
            });
        }

    }
    var $account_msg_click = $(".account-msg-click");
    var $accont_show_infor = $(".accont-show-infor");
    var $accountStrongHtmls = $account_msg_click.find(".account-msg-action>strong").html();
    $account_msg_click.flag = 1;
    $account_msg_click.on("click",function(){
        if($account_msg_click.flag == 1){
            var _this = $(this);
            var $strongs = _this.find(".account-msg-action>strong");
            if(_this.next().css("display") == "block"){
                _this.next().hide();
                $strongs.html($accountStrongHtmls);
                _this.find(".account-msg-action>span").removeClass("ico-arrow-msg-bottom");
                _this.removeClass("account-msg-bg-none");

            }else if(_this.next().css("display") == "none"){
                _this.next().show();
                $account_msg_click.find(".account-msg-action>strong").html($accountStrongHtmls);
                eachFun($accont_show_infor);
                eachFun($account_msg_click,"account-msg-bg-none");
                eachFun($account_msg_click.find(".account-msg-action>span"),"ico-arrow-msg-bottom");
                $strongs.html("收起");
                _this.next().show();
                _this.addClass("account-msg-bg-none");
                _this.find(".account-msg-action>span").addClass("ico-arrow-msg-bottom");
                _this.find("p").removeClass("account-msg-theme");//去除加粗字体
            }
        }
        $account_msg_click.flag = 1;
    });
    $account_msg_click.on("mouseenter",function(){
        var _this = $(this);
        _this.addClass("account-msg-hover");
    });
    $account_msg_click.on("mouseleave",function(){
        var _this = $(this);
        _this.removeClass("account-msg-hover");
    });
    $account_msg_click.find("input[type='checkbox']").on("click",function(){
        $account_msg_click.flag = 0;
    });

    //全选、取消选项
    var $allCheckbox = $("a[data-type='all-checkbox']");
    $allCheckbox.find("input[type=checkbox]").on("click",function(){
        $(".information").find("input[type=checkbox]").prop("checked", this.checked);
    });
    /*消息框end*/
    /*文本框默认提示提示*/
    var $inputBox = $(".input-blur-focus");
    $inputBox.find(":input").blur(function(){
        var _this = $(this);
        var $newVal = _this[0].parents;//取值
        if(_this.val() == ""){
            _this.val($newVal);
            _this.css("color","#ccc");
        }
    }).focus(function(){
            var _this = $(this);
            var $val = _this.attr("data-value");
            _this[0].parents = $val;//存值
            if(_this.val() == $val){
                _this.val("");
                _this.css("color","#666");
            }
        });
    /**/
    /*新版sidebar*/
    var $sidebarWeixin = $("#sidebar-weixin");
    $sidebarWeixin.on("mouseenter",function(){
        $(".qr-codes").show();
    });
    $sidebarWeixin.on("mouseleave",function(){
        $(".qr-codes").hide();
    });
    var $sidebar_top = $("#sidebar-top");
    $sidebar_top.hide();
    $sidebar_top.click(function(){
        $("body,html").animate({scrollTop:"0px"},800);
    });
    $(window).scroll(function(){
        var $scrollTop = $(window).scrollTop();
        if($scrollTop > 50){//返回顶部
            $sidebar_top.fadeIn(400);
        }else{
            $sidebar_top.fadeOut(200);
        }
    });
    /*新版sidebar-end*/
    /*页面底部浮层*/
    var $home_pop_closed = $("#home-pop-closed");
    $home_pop_closed.on("click",function(){
        var _this = $(this);
        _this.parents("#home-pop").hide();
    });
    /*页面底部浮层end*/
    //产品介绍--首付贷、信易贷--talble
    {
        var $proin_title = $("span[data-type='proin-title']");

        function clsHideFun(obj,cls){
            if(cls){
                obj.each(function(i){
                    var self = $(this);
                    self.removeClass(cls);
                });
            }else{
                obj.each(function(i){
                    var self = $(this);
                    self.hide();
                });
            }
        }
        $proin_title.on("click","a",function(){
            var _this = $(this),
                index = _this.index();

            var $proin_talbe_item = $("div[data-type='proin-talbe']").children();

            clsHideFun($proin_title.find("a"),"current");
            _this.addClass("current");

            clsHideFun($proin_talbe_item);
            $proin_talbe_item.eq(index).show();
        });
    }
    //项目详情页=》项目详情、投资记录
    {
        var $version_project_absolute_row = $("div[data-type='version-project-absolute-row']");
        $version_project_absolute_row.children().on("click",function(){

            var _this = $(this),
                index = _this.index();

            eachFun($version_project_absolute_row.children(),"current");
            _this.addClass("current");

            eachFun($("div[data-type='version-project-table']").children());
            _this.parent().parent().next("div[data-type='version-project-table']").children().eq(index).show();

        });
    }
    //金融计算器
    {
        //金融计算器左侧菜单栏显示展开
        var $spanTitle = $("span[data-type='financial-cal-menu-title']");
        $spanTitle.on("click",function(){
            var _this = $(this);
            _this.find("em").toggleClass("current");
            _this.next("div").slideToggle();
        });
        //鼠标滑过
        $spanTitle.on("mouseenter",function(){
            $(this).addClass("hover");
        });
        $spanTitle.on("mouseleave",function(){
            $(this).removeClass("hover");
        });
        //
        //文本框失去焦点、获取焦点
        function blurFun(_this,cls,defaultCol,newCol,fontArial) {//fontArial字体、defaultCol默认颜色值、newCol新颜色值
            //var _this = $(this);
            var data_type = _this.attr("data-type");
            if(data_type == undefined) return;

            if(_this.val() == data_type || _this.val()==""){
                _this.val(data_type).css("color",defaultCol);
                if(fontArial){
                    _this.removeClass(fontArial);
                }
            }else{
                _this.css("color",newCol);
                if(fontArial){
                    _this.addClass(fontArial);
                }
            }
            //失去焦点删除文本框类（ver-input-visitor）
            _this.removeClass(cls);
        }
        function focusFun(_this,cls,newCol) {
            //var _this = $(this);
            var data_type = _this.attr("data-type");
            if(data_type == undefined) return;

            var $valTrim = _this.val().replace(/\s+/g,"");
            if($valTrim == data_type){
                _this.val("").css("color",newCol);
            }
            //获取焦点添加文本框类（ver-input-visitor）
            _this.addClass(cls);
        }
        //初始加载blurfun
        function initialLoad(objInput,cls,defaultCol,newCol,fontArial){
            objInput.each(function(i,item){
                var _this = $(this);
                blurFun(_this,cls,defaultCol,newCol,fontArial);
            });
        }

        var $financial_cal_textbox = $("div[data-type='financial-cal-textbox']");
        initialLoad($financial_cal_textbox.find(":input[type='text']"),"focus","#999","#333","default-arial");
        $financial_cal_textbox.find(":input[type='text']").on("blur",function(){
            var _this = $(this);
            blurFun(_this,"focus","#999","#333","default-arial");
        });
        $financial_cal_textbox.find(":input[type='text']").on("focus",function(){
            var _this = $(this);
            focusFun(_this,"focus","#333");
        });

    }
    //新手指引
    {
        //新手指引->新手福利-新手专享投资列表
        {
            var $details_item = $("div[data-type='details-item']");
            $details_item.on("mouseenter", '.item-list', function() {
                var _this = $(this);
                _this.addClass("item-list-hover-bg");
            });
            $details_item.on("mouseleave", '.item-list', function() {
                var _this = $(this);
                _this.removeClass("item-list-hover-bg");
            });
            $details_item.on('click', '.item-list', function(event) {
                //链接路径-跳转
                //window.open('/bid/detail/' + $(this).attr('data-href'), '_blank');
            });
            //introduction(简介)
            function introdFun(obj, cls) {
                obj.hover(
                    function() {
                        $(this).addClass(cls);
                    },
                    function() {
                        $(this).removeClass(cls);
                    }
                )
            };
            var $introduction = $("div[data-type='introduction']"),
                $faith = $("div[data-type='faith']");
            introdFun($introduction, "the-introduction-hover");
            introdFun($faith, "the-faith-hover");
        }
        //新手指引->圆形进度条
        {
            function setAppProcessStyle() {
                $('div[data-type="verxon2-circle"]').each(function(index, el) {
                    var num = $(this).find('span').text() * 3.6;
                    if (num <= 180) {
                        $(this).find('.verxon2-right').css({
                            'transform': "rotate(" + num + "deg)",
                            '-webkit-transform': "rotate(" + num + "deg)"
                        });
                    } else {
                        $(this).find('.verxon2-right').css({
                            'transform': "rotate(180deg)",
                            '-webkit-transform': "rotate(180deg)"
                        });
                        $(this).find('.verxon2-left').css({
                            'transform': "rotate(" + (num - 180) + "deg)",
                            '-webkit-transform': "rotate(" + (num - 180) + "deg)"
                        });
                    };
                });
                $("span[data-type='cerxon2-span']").each(function(i) {
                    var $value = $(this).html();
                    if ($value > 0 && $value <= 50) {
                        $(this).parents('div[data-type="verxon2-circle"]').css("backgroundColor", "#ffd200");
                    } else if ($value > 50 && $value < 100) {
                        $(this).parents('div[data-type="verxon2-circle"]').css("backgroundColor", "#ff510d");
                    } else if ($value == 100) {
                        $(this).parents('div[data-type="verxon2-circle"]').css("backgroundColor", "#81c931");
                    }
                });
            }
            setAppProcessStyle();
        }
        //新手指引-新手福利 -》选项卡
        {
            var $newbie_title = $("div[data-type='newbie-title']");
            $newbie_title.find("a").on("click",function(){
                var _this = $(this);
                $newbie_title.find("a").each(function(){
                    $(this).removeClass("current");
                });
                _this.addClass("current");

                var $newbie_table_children = $newbie_title.parent().parent().next("div").children();
                $newbie_table_children.each(function(){
                    $(this).hide();
                });
                $newbie_table_children.eq(_this.index()).show();
            });
        }
    }
    //改版-》帮助中心——常见问题分类右侧列表
    {
        var $helpc_list_title = $("span[data-type='helpc-list-item-title']");
        var $helpc_listings_box = $("div[data-type='helpc-listings-box']");
        $helpc_list_title.on("click",function(){
            var _this = $(this);

            var $helpc_nextDiv = _this.next("div");

            if($helpc_nextDiv.css("display") == "block"){
                _this.removeClass("current");
                $helpc_nextDiv.hide();
            }else if($helpc_nextDiv.css("display") == "none"){

                //关闭隐藏除本身之外的
                $helpc_listings_box
                    .find("span[data-type='helpc-list-item-title']").removeClass("current").end()
                    .find("div[data-type='helpc-listings-item-infor']").hide();

                $helpc_nextDiv.show();
                _this.addClass("current");
            }
            //
        });
        $helpc_list_title.hover(
            function(){
                $(this).addClass("hover");
            },
            function(){
                $(this).removeClass("hover");
            }
        );
    }
    //版权区-》改版
    {
        $("div[data-type='tail-ton-box']").find("a").on("mouseenter",function(){
            $(this).find("span").fadeIn(150)
        });
        $("div[data-type='tail-ton-box']").find("a").on("mouseleave",function(){
            $(this).find("span").fadeOut(150)
        });
    }
    //产品介绍（货基通投资流程）
    {
        var $cargotong_action = $("div[data-type='cargotong-action']");
        var $cargotong_picture_box = $("div[data-type='cargotong-picture-box']");
        $cargotong_action.children().on("mouseenter",function(){
            var _this = $(this),
                index = _this.index();

            $cargotong_action.children().each(function(){
                var _this = $(this);
                _this.removeClass("hover");
            });
            $cargotong_picture_box.children().each(function(){
                var _this = $(this);
                _this.hide();
            });
            _this.addClass("hover");
            $cargotong_picture_box.children().eq(index).show();
        });
    }
    //产品介绍（首付贷合作机构页面）
    {
        var $copagency_tab_title = $("span[data-type='copagency-tab-title']"),
            $copagency_tab_box = $("div[data-type='copagency-tab-box']");

        $copagency_tab_title.on("click","a",function(){
            var _this = $(this),
                index = _this.index();
            $copagency_tab_title.find("a").each(function(){
                $(this).removeClass("current");
            });
            $copagency_tab_box.children().each(function(){
                $(this).hide();
            });
            _this.addClass("current");
            $copagency_tab_box.children().eq(index).show();
        });
    }
});
//通用弹窗 内容区域==遮罩区域
var contentEqMask = function contentEqMask(){
    $("div[data-type='version-popup-mobel']").each(function(){
        var _this = $(this);
        var $version_popup_main = _this.find("div[data-type='version-popup-main']").height();
        _this.find("div[data-type='version-popup-mask']").height(parseInt($version_popup_main)+16);
    });
}

$(function(){
    //月薪宝介绍页
    tabFun(".mst-inner-box>a",".mst-tabbox>div");
    $("#computeCash").on("click",function(){
        if(cashValid()){
            var inputCash = parseInt($("#inputCash").val());
            $("#totalCash").html(inputCash*12+".00");
            $("#haveGotCash").html(inputCash*0.78+".00");
            $("#toGetCash").html(inputCash*0.66+".00");
        }
    });
    $("#inputCash").keyup(function(){
        var val = $(this).val(),
            reg = /[^\d]/g;
        if(reg.test(val)){
            $(this).val(val.replace(reg,''));
            return ;
        }
    });
    function cashValid(){
        var cash = $("#inputCash").val();
        if(cash<500){
            $(".verlayer-error").css({display:"block"}).children("span").html("金额不能小于500");
            return false;
        }
        if(cash >5000){
            $(".verlayer-error").css({display:"block"}).children("span").html("金额不能大于5000");
            return false;
        }
        if(cash%100 !== 0){
            $(".verlayer-error").css({display:"block"}).children("span").html("金额必须为100元整数倍递增");
            return false;
        }
        $(".verlayer-error").css({display:"none"})
        return true;
    }
    //提示语显示和消失的控制
    //聚焦时触发的事件
    $("input[type!=button]").on("focus", function(){
        var $this = $(this),
            defaultVal = $this.attr("data-text"),
            nowVal = $this.val();
        //显示高亮样式
        $this.addClass('ver-input-visitor');
        if(nowVal == defaultVal){
          //如果为默认值，则清空
          $this.val('');
        }
      });

     $("select,input[type!=button]").on("blur", function(){
        var $this = $(this),
        defaultVal = $this.attr("data-text"),
        value = $this.val();
        //当value为空、或者为默认值时：value为空、赋默认值
        if(value == "" || value == defaultVal){
          value = "";
          $this.val(defaultVal);
        }
    });
});
//tab标签点击 tabName->tab ，tabCon->对应的内容
function tabFun(tabName,tabCon){
    var $tabName = $(tabName),
        $tabCon = $(tabCon);
    $tabName.on("click",function(){
        var $this = $(this),
            ind = $this.index();
        $this.addClass("current").siblings().removeClass("current");
        $tabCon.eq(ind).css({display:"block"}).siblings().css({display:"none"});
    });
}



























