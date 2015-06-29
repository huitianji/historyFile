/*
*tooltips
* */
$(function(){
    /*动态生成tooltips层*/
    $("body").append($("<div  class='tool-tip'>" +
        "<div class='tool-tip-recive'>tooltips内容</div>" +
        "<p class='ar_up'></p>" +
        "<p class='ar_up_in'></p>" +
        "</div>"));
    /*动态生成tooltips-end*/
    var $tooltipcol = $(".tooltipcol");
    var $toolTip = $(".tool-tip");//tip浮层
    var $toolTipRecive = $(".tool-tip-recive");

    //$tooltipcol.on("mouseenter",function(){
    $(document).on("mouseenter",".tooltipcol",function(){//修复翻页刷新数据-》执行
        var _this = $(this);
        var $dataText = _this.attr("data-text");
        var $dataParams = _this.attr("data-param") ? _this.attr("data-param").split("@@") : [];
        //_ll.getToolTip(key);
        //$toolTipRecive.html($dataText);
        $toolTipRecive.html(_ll.fmtToolTip($dataText,$dataParams));
        /*
        *当前图标添加hover
        * */
        if(_this.hasClass("version-tooltip-css")){
            _this.addClass("version-tooltip-csshover");
        }
        $tooltipcol["flag"] = _this;

        var $left = _this.offset().left;
        var $top = _this.offset().top;
        var $toolTipW = $toolTip.width()/2;

        //_this.width()/2本身元素宽度的一半
        //-16箭头的总宽度
//        $toolTip.css({left:$left-$toolTipW,top:$top+_this.height()+8});
        $toolTip.css({left:($left-$toolTipW)-16+_this.width()/2,top:$top+_this.height()+8});
        $toolTip.show();
    });
    $(document).on("mouseleave",".tooltipcol,.tool-tip",function(){
        $toolTip.hide();
        var $version_tooltip_css = $(".version-tooltip-css");
        if($version_tooltip_css){
            $version_tooltip_css.removeClass("version-tooltip-csshover");
        }
    });
    $(document).on("mouseenter",".tool-tip",function(){
        $toolTip.show();
        var $version_tooltip_css = $(".version-tooltip-css");
        if($version_tooltip_css){
            $tooltipcol["flag"].addClass("version-tooltip-csshover");
        }
    });
    /*tooltips-end*/

});