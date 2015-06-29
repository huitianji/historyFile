$(function() {
    var $version_part1_click = $(".version-part1-click");
    var $version_part2_click = $(".version-part2-click");
    var $version_table = $(".version-table");

    function eachFun(obj, cls) {
        obj.each(function(i) {
            $(this).removeClass(cls);
        });
    }

    function eachHideFun(obj) {
            obj.each(function(i) {
                $(this).hide();
            });
        }
        //
        /*全部近期已满标*/
        //
    $(document).on("mouseenter", ".version-part1-click,.version-part2-click", function() {
        var _this = $(this);
        _this.addClass("ver-bg-hover");
    });
    $(document).on("mouseleave", ".version-part1-click,.version-part2-click", function() {
        var _this = $(this);
        _this.removeClass("ver-bg-hover");
    });
    /*大table选项卡*/
    //    $version_table.on("click","a",function(){
    //        var _this = $(this);
    //        var index = _this.index();
    //        var $version_box = _this.parents(".version-invest-title").next().children();
    //        eachFun($version_table.find("a"),"current");
    //        _this.addClass("current");
    //        eachHideFun($version_box);
    //        $version_box.eq(index).show();
    //    });
    // progressColor();
    setProcessStyle();
    /*
     *tooltips
     * */
    /*动态生成tooltips层*/
    //    $("body").append($("<div  class='tool-tip'>" +
    //        "<div class='tool-tip-recive'>tooltips内容</div>" +
    //        "<p class='ar_up'></p>" +
    //        "<p class='ar_up_in'></p>" +
    //        "</div>"));
    //    /*动态生成tooltips-end*/
    //    var $tooltipcol = $(".tooltipcol");
    //    var $toolTip = $(".tool-tip");//tip浮层
    //    var $toolTipRecive = $(".tool-tip-recive");
    //
    //    $tooltipcol.on("mouseenter",function(){
    //        var _this = $(this);
    //        var $dataText = _this.attr("data-text");
    //        //_ll.getToolTip(key);
    //        $toolTipRecive.html($dataText);
    //        //$toolTipRecive.html(_ll.getToolTip($dataText));
    //        if(_this.hasClass("version-tooltip-css")){
    //            _this.addClass("version-tooltip-csshover");
    //        }
    //        $tooltipcol["flag"] = _this;
    //        var $left = _this.offset().left;
    //        var $top = _this.offset().top;
    //        var $toolTipW = $toolTip.width()/2;
    ////        console.log(_this.offset().left);
    ////        console.log(_this.width()/2)
    //        //_this.width()/2本身元素宽度的一半
    //        //-16箭头的总宽度
    //        //$toolTip.css({left:$left-$toolTipW,top:$top+_this.height()+8});
    //        $toolTip.css({left:($left-$toolTipW)-16+_this.width()/2,top:$top+_this.height()+8});
    //        $toolTip.show();
    //    });
    //
    //    $(document).on("mouseleave",".tooltipcol,.tool-tip",function(){
    //        //$toolTip.hide();
    //        $toolTip.hide();
    //        var $version_tooltip_css = $(".version-tooltip-css");
    //        if($version_tooltip_css){
    //            $version_tooltip_css.removeClass("version-tooltip-csshover");
    //        }
    //    });
    //    $(document).on("mouseenter",".tool-tip",function(){
    //        $toolTip.show();
    //        var $version_tooltip_css = $(".version-tooltip-css");
    //        if($version_tooltip_css){
    //            $tooltipcol["flag"].addClass("version-tooltip-csshover");
    //        }
    //    });
    /*tooltips-end*/
    /*circle*/

    /*circle-end*/
    /*右侧选项卡*/
    var $ver_system_table = $("div[data-type='ver-system-table']");
    $ver_system_table.on("click", "a", function() {
        var _this = $(this),
            index = _this.index();
        var $verTables = _this.parent().nextAll("div[data-type='system-items']").children();
        eachFun(_this.parent().find("a"), "ver-sys-current");
        eachHideFun($verTables);
        _this.addClass("ver-sys-current");
        $verTables.eq(index).show();
    });
    /*右侧选项卡end*/
    /*右侧右侧fixed*/
    var $verAside = $("div[data-type='ver-aside-position']");
    if ($verAside.length) {
        var $top = $verAside.offset().top;
        $(window).on("scroll", function() {
            var _this = $(this);
            if (_this.scrollTop() > ($top - 10)) {
                $verAside.addClass("ver-aside-fixed");
            } else {
                $verAside.removeClass("ver-aside-fixed");
            }
        });
    }

    /*end*/
    var indexNum = location.href.lastIndexOf('/');
    var currentIndex = parseInt(location.href.substring(indexNum + 1, indexNum + 2));
    currentIndex = currentIndex == "1" ? 1 : currentIndex == "2" ? 2 : currentIndex == "9" ? 9 : 0; 
    var isTransfer = 0; //0 非转让 ； 1 转让
    //获取填充公告、常见问题数据
    var faqUrl = '';
    var faqHref = '';
    switch(currentIndex){
        case 0: faqUrl = 'https://www.souyidai.com/fragment/invest_index.json';
                faqHref = 'https://help.souyidai.com/help/faq/invest_list/';
                isTransfer = 0;
            break;
        case 1: faqUrl = 'https://www.souyidai.com/fragment/transfer_index.json';
                faqHref = 'https://help.souyidai.com/help/faq/transfer_list/';
                isTransfer = 1;
            break;
        case 2: faqUrl = 'https://www.souyidai.com/fragment/small_index.json';
                faqHref = 'https://help.souyidai.com/help/faq/small/';
                isTransfer = 0;
            break;
        case 9: faqUrl = 'https://www.souyidai.com/fragment/mf_index.json';
                faqHref = 'https://help.souyidai.com/help/faq/JJCP/';
                isTransfer = 0;
            break;
    }

    $.get(faqUrl, {}, function(json) {
        var content = template('src_invest/notice', {
            announce: json.announce
        });
        $(".ver-system-content").empty().html(content);
        //常见问题
        var frequently = template('src_invest/questions', {
            questions: json.frequently_questions
        });
        $(".ver-question-list").eq(0).empty().html(frequently);

        $(".ver-more-announ:last a").attr("href", faqHref);
        //理财问题 暂时不用
        // var financial = template('src_invest/questions', { questions: json.financial_question });
        // $(".ver-question-list").eq(1).empty().html(financial);

        /*系统公告（执行函数）*/
        noticeFun();
    }, 'json')

    //获取填充周豪、月豪榜单
    function getRankList() {
        $.get('/ranking/list?t=' + Math.random() + '&limit=5&isTransfer=' + isTransfer, {}, function(json) {
                if (json.errorCode == 1) return;
                var month = template('src_invest/rankList', {
                    data: json.data.month
                });
                var week = template('src_invest/rankList', {
                    data: json.data.week
                });
                var $ranklist = $(".ver-ranklist");
                $ranklist.find("div[data-type='ver-ranklist-week']").show().html(week);
                $ranklist.find("div[data-type='ver-ranklist-month']").hide().html(month);

            }, 'json')
            //更多排行榜 链接暂时不用
            // var href = currentIndex == 0? "https://help.souyidai.com/help/invest/bid/": "https://help.souyidai.com/help/invest/transfer/";
            // $(".ver-more-announ:eq(2) a").attr("href",href);
    }

    //基金项目暂时没有排行榜
    if(currentIndex != 9){

        getRankList();
        //一分钟刷新排行榜
        setInterval(function() {
            getRankList();
        }, 1000 * 60)

    }else{
        //需要干掉排行榜
        $(".ver-aside-contents").find(".ver-sys-list").hide();
    }
});

function setProcessStyle() {
    $('div[data-type="verxon-circle"]').each(function(index, el) {
        var num = $(this).find('span').text() * 3.6;
        if (num <= 180) {
            $(this).find('.verxon-right').css('transform', "rotate(" + num + "deg)");
        } else {
            $(this).find('.verxon-right').css('transform', "rotate(180deg)");
            $(this).find('.verxon-left').css('transform', "rotate(" + (num - 180) + "deg)");
        };
    });
    $("span[data-type='cerxon-span']").each(function(i) {
        var $value = $(this).html();
        if ($value > 0 && $value <= 50) {
            $(this).parents('div[data-type="verxon-circle"]').css("backgroundColor", "#ffd200");
        } else if ($value > 50 && $value < 100) {
            $(this).parents('div[data-type="verxon-circle"]').css("backgroundColor", "#ff510d");
        } else if ($value == 100) {
            $(this).parents('div[data-type="verxon-circle"]').css("backgroundColor", "#81c931");
        }
    });
}

var progressColor = function() {
    /*进度条百分百换算*/
    var $ver_bar_progress = $(".ver-bar-progress");
    var $ver_bar_text = $(".ver-bar-text");
    $ver_bar_text.each(function(i) {
        var _this = $(this);
        _this.parent().find(".ver-bar-progress").css("width", _this.html());
    });
};
/*列表局部遮罩loading*/
var textMaskLoading = function textMaskLoading(obj) {
    textLoadingHide();
    obj.css({
        "position": "relative"
    });
    var textMask = $("<div class='version-text-mask'></div>"),
        textLoading = $("<div class='version-text-loading'>&nbsp;<img data-type='img-loading-status' src='https://static.souyidai.com/www/images/version/loading.gif'></div>");
    obj.append(textMask);
    obj.append(textLoading);
    var objW = obj.width(),
        objH = obj.height();
    textMask.css({
        "width": objW,
        "height": objH
    });
    textLoading.css({
        "width": objW,
        "height": objH,
        "line-height": objH + "px"
    });
};
//textMaskLoading($("div[data-type='version-part-box']"));
//$(".version-text-loading>img").attr("src","https://static.souyidai.com/www/images/version/loading_false.gif")
var textLoadingFasle = function textLoadingFasle() {
    //$("img[data-type='img-loading-status']").attr("src","https://static.souyidai.com/www/images/version/loading_false.gif");
    $(".version-text-loading").html("");
    $(".version-text-loading").html("加载失败，请检查网络连接后<a href='javascript:window.location.reload();' style='font-size: 20px;'>刷新页面</a> ");
};
var textLoadingHide = function textLoadingHide() {
    if (typeof $(".version-text-mask")[0] !== "undefined") {
        $(".version-text-mask").remove();
        $(".version-text-loading").remove();
    }
};
/*end*/
/*系统公告(单条滚动)*/
var noticeFun = function noticeFun() {
        var _wrap = $('div[data-type="ver-system-wap"]'); //定义滚动区域
        var _interval = 3000; //定义滚动间隙时间
        var _moving; //需要清除的动画

        _wrap.hover(function() {
            clearInterval(_moving); //当鼠标在滚动区域中时，停止滚动
        }, function() {
            _moving = setInterval(function() {
                    var _field = _wrap.find('div:first'); //此变量不可放置于函数起始处，li(div)(ver-system-item):first取值是变化的
                    var _h = _field.height(); //取得每次滚动高度
                    //var _h = 50;//取固定高度50px
                    _field.animate({
                        marginTop: -_h + 'px'
                    }, 600, function() { //通过取负margin值，隐藏第一行
                        _field.css('marginTop', 0).appendTo(_wrap); //隐藏后，将该行的margin值置零，并插入到最后，实现无缝滚动
                    })
                }, _interval) //滚动间隔时间取决于_interval
        }).trigger('mouseleave'); //函数载入时，模拟执行mouseleave，即自动滚动
    }
    /*系统公告end*/