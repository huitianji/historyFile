$(function(){
    /*新版首页（简单三步，轻松获取好收益）*/
    var $stepsTitle = $(".steps-title");
    $stepsTitle.on("click","span",function(){
        var self = $(this),
            index = self.index();
        var $op = self.parent().next().find("p");
        var $stepSpan = $stepsTitle.find("span");
        for(var i= 0,len = $stepSpan.length;i<len;i++){
            $stepSpan.eq(i).removeClass("steps-gry");
            $stepSpan.eq(i).removeClass("step-current"+index);
            $op.eq(i).hide();
        }
        self.addClass("steps-gry");
        self.addClass("step-current"+index);
        $op.eq(index).show();
    });
    /*banner-轮播图*/
    {
//    var $shufCont = $(".shuffling-content");
//    $(".shuffling-content").find("p").eq(0).clone().appendTo($shufCont);
//    var $itemW = $(".shuffling-content").find("p").width();
//    var $len = $(".shuffling-content").find("p").length;
//    $shufCont.css("width",$itemW*$len + "px");//计算宽度
//    var $burnerRowA = $(".burner-row").find("a");
//    var $bannerBox = $(".banner-box");
//    var step = 0;
//    var time = null;
//    function auto(){
//        step ++;
//        if(step == $len){
//            step = 1;
//            $shufCont.css({"left":"0px"});
//        }
//        $shufCont.stop().animate({left:-$itemW*step},400);
//        //console.log(step);
//        for(var i= 0,len = $burnerRowA.length;i<len;i++){
//            $burnerRowA.eq(i).removeClass("ico-burner-current");
//        }
//        $burnerRowA.eq(step-1).addClass("ico-burner-current");
//        //console.log(step)
//        $bannerBox.removeClass("banner-bg1 banner-bg2");
//        $bannerBox.addClass("banner-bg"+step);
//    }
//   time = window.setInterval(auto,3000);
//    //左
//    $("#toward-left").on("click",function(){
//        step++;
//        if(step == $len){
//            step = 1;
//            $shufCont.css({"left":"0px"});
//        }
//        $shufCont.stop().animate({left:-$itemW*step},400,function(){
//            window.clearInterval(time);
//            step = step;
//            time = window.setInterval(auto,3000);
//        });
//        for(var i= 0,len = $burnerRowA.length;i<len;i++){
//            $burnerRowA.eq(i).removeClass("ico-burner-current");
//        }
//        $burnerRowA.eq(step-1).addClass("ico-burner-current");
//        //console.log(step);
//        $bannerBox.removeClass("banner-bg1 banner-bg2");
//        $bannerBox.addClass("banner-bg"+step);
//    });
//    //右
//    $("#toward-right").on("click",function(){
//        step--;
//        if(step == -1){
//            step = $len -2;
//            $shufCont.css({"left":-$itemW*($len-1)});
//        }
//        $shufCont.stop().animate({left:-$itemW*step},400,function(){
//            window.clearInterval(time);
//            step = step;
//            time = window.setInterval(auto,3000);
//        });
//        for(var i= 0,len = $burnerRowA.length;i<len;i++){
//            $burnerRowA.eq(i).removeClass("ico-burner-current");
//        }
//        $burnerRowA.eq(step-1).addClass("ico-burner-current");
//        $bannerBox.removeClass("banner-bg1 banner-bg2");
//        $bannerBox.addClass("banner-bg"+step);
//    });
//    //
//    $burnerRowA.on("click",function(){
//        var self = $(this);
//        var index = self.index()+1;
//       // console.log(index+"====");
//        $shufCont.stop().animate({left:-$itemW*index},400,function(){
//            window.clearInterval(time);
//            step = index;
//            time = window.setInterval(auto,3000);
//        });
//        for(var i= 0,len = $burnerRowA.length;i<len;i++){
//            $burnerRowA.eq(i).removeClass("ico-burner-current");
//        }
//        self.addClass("ico-burner-current");
//        console.log(index);
//        $bannerBox.removeClass("banner-bg1 banner-bg2");
//        $bannerBox.addClass("banner-bg"+index);
//    });
//    //
//    $(".shuffling-row").mouseenter(function(){
//        var self = $(this);
//        self.find(".arrows-row").show();
//    }).mouseleave(function(){
//            var self = $(this);
//            self.find(".arrows-row").hide();
//        });
    }
    /*新版banner淡入淡出*/
    var $bannerItem = $(".banner-ms>p"),
        $advBtn = $(".adv-button>a"),
        $advArrowLeft = $("#toward-left"),
        $advArrowRight = $("#toward-right"),
        $advArrow = $(".adv-arrow");
    var step = 0;
    var timeBanner = null;
    function removeClsFun(obj,cls){
        obj.each(function(){
            var self = $(this);
            self.removeClass(cls);
        });
    }
    function opacity0Fun(obj){
        obj.each(function(){
            var self = $(this);
            self.stop().animate({"opacity":"0","z-index":"0"},500);
        });
    }
    function switchFun(step){
        opacity0Fun($bannerItem);
        removeClsFun($advBtn,"ico-burner-current");
        $advBtn.eq(step).addClass("ico-burner-current");
    }
    function animateFun(index){
        $bannerItem.eq(index).stop().animate({"opacity":"1","z-index":"1"},500,function(){
            step = index;
            timeBanner = window.setInterval(bannerAutoFun,5000);
        });
    }
    function clearIntervalFun(){
        window.clearInterval(timeBanner);
    }
    $advBtn.on("click",function(){
        clearIntervalFun();
        var self = $(this);
        var index = self.index();
        opacity0Fun($bannerItem);
        //
        var newIndex = index;
        animateFun(newIndex);
        removeClsFun($advBtn,"ico-burner-current");
        self.addClass("ico-burner-current");
        step = newIndex;
        //console.log(step+"a====")
    });

    $advArrowRight.on("click",function(){
        clearIntervalFun();
        var self = $(this);
        step ++;
        if(step > $bannerItem.length-1){
            step = 0;
        }
        switchFun(step);
        var newStep = step;
        animateFun(newStep);
        //console.log("left==="+newStep);
    });
    $advArrowLeft.on("click",function(){
        clearIntervalFun();
        var self = $(this);
        step --;
        if(step < 0){
            step = $bannerItem.length-1
        }
        switchFun(step);
        var newStep = step;
        animateFun(newStep);
        //console.log("right==="+newStep);
    });
    function bannerAutoFun(){
        step ++;
        if(step > $bannerItem.length-1){
            step = 0;
        }
        switchFun(step);
        $bannerItem.eq(step).stop().animate({"opacity":"1","z-index":"1"},500);
        //console.log(step+"===auto");
    }
    timeBanner = window.setInterval(bannerAutoFun,5000);
    //mouseenter
    $bannerItem.on("mouseover",function(e){
        //clearIntervalFun();
        $advArrow.show();
    });
    $advArrow.on("mouseover",function(e){
        //clearIntervalFun();
        $advArrow.show();
    });
    $bannerItem.on("mouseout",function(e){
        $advArrow.hide();
        //timeBanner = window.setInterval(bannerAutoFun,2000);
    });
    /*媒体报道*/
//    var box=document.getElementById("medium-list"),can=true;
//    box.innerHTML+=box.innerHTML;
//    box.onmouseover=function(){can=false};
//    box.onmouseout=function(){can=true};
//    new function (){
//        var stop=box.scrollTop%61==0&&!can;
//        if(!stop){
//            box.scrollTop==parseInt(box.scrollHeight/2)?box.scrollTop=0:box.scrollTop++;
//        }
//        setTimeout(arguments.callee,box.scrollTop%61?5:2000);
//        //console.log(box.scrollTop)
//    };

    /*媒体报道end*/
});