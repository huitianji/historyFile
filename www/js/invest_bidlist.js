//新版投资列表页
$(function() {

    //表单校验
    var formAuth = function(authConfig) {
        $.each(authConfig, function(index, item) {
            $.each(item.eventList, function(key, value) {
                $(document).on(key, item.id, value);
            });
        });
    };
    //错误提示
    var errorMsgShow = function(el, msg) {
        var $parent = $(el).parent();
        if ($parent.find("input[data-cd='countdown']").length != 0) return;

        var errorDom = $parent.find('.ver-btn');
        errorDom.val(msg);
        disBtn(errorDom);

    };
    var errorMsgHide = function(el) {
        var $parent = $(el).parent();
        if ($parent.find("input[data-cd='countdown']").length != 0) return;

        var errorDom = $parent.find('.ver-btn');
        if (errorDom.parents('.version-item ').find('.version-novice').text() === '新手专享') {
            errorDom.val('新手投资');
        } else {
            errorDom.val('投资');
        }
        reBtn(errorDom);
    };
    //金钱格式化
    var fmtMoney = function(money, length) {
        if (length !== 0) {
            length = length | 2;
        }
        if (typeof money === 'number') {
            money = money.toFixed(length);
        }
        money = money.replace(/(\d)(?=(?:\d{3})+(?:\.\d+)?$)/g, "$1,");
        return money;
    };

    //右侧滚动条 不能到最底下
    $(window).scroll(function() {
        if ($(document).height() - ($(".ver-aside-fixed").height() + $(window).scrollTop()) <= 313) {
            $(".ver-aside-fixed").css({
                top: 'auto',
                bottom: '313px'
            });
        } else {
            $(".ver-aside-fixed").css({
                top: '10px',
                bottom: 'auto'
            });
        }
    }).trigger('scroll');

    //左半部分整体点击效果
    $(document).on('click', '.version-part1-click', function(event) {
        event.preventDefault();
        window.open($(this).find('.version-credit').attr('href'), '_blank');
    });
    //满标整体点击效果
    $(document).on('click', '.version-part2-click', function(event) {
        event.preventDefault();
        window.open($(this).find('.version-credit').attr('href'), '_blank');
    });

    // 列表页banner
    getBannerImg();
    function getBannerImg(){
        $.ajax({
            url: "https://help.souyidai.com/element/invest_banner/index.json",
            dataType: "jsonp",
            jsonp: "callback",
            jsonpCallback: "jsonpcallback",
            success: function(){
                
            }
        })
    }
});

function jsonpcallback(data){
    if ($('.version-table a').eq(0).hasClass('current')) {
        $(".version-banner a").attr("href",data[0]["link"]);
        $(".version-banner img").attr("src",data[0]["picture"]);
    } else if ($('.version-table a').eq(1).hasClass('current')) {
        $(".version-banner a").attr("href",data[2]["link"]);
        $(".version-banner img").attr("src",data[2]["picture"]);
    } else {
        $(".version-banner a").attr("href",data[1]["link"]);
        $(".version-banner img").attr("src",data[1]["picture"]);
    }
}

function showPagination(jq, total, pageSize, currentpage) {
    jq.pagination(total, {
        'items_per_page': pageSize,
        'num_display_entries': 4,
        'num_edge_entries': 2,
        'current_page': currentpage,
        'prev_text': "&nbsp;",
        'next_text': "&nbsp;",
        'callback': pagedCallback
    });

}

function pagedCallback(pageNo, jq) {
    textMaskLoading($(jq.parent().parent()));

    //如果是在投资、转让上半部分分页时，去掉预开标的timer提升性能
    if(jq.hasClass('online')){
        $("input[data-cd='countdown']").each(function(i,item){
            clearTimeout(item.cdTimer);
        });
    }
    

    var ht = $.ajax({
        url: jq.attr("url"),
        type: 'POST',
        data: getUrl(pageNo, jq),
        async: true,
        timeout: 10000,
        error: function() {
            textLoadingFasle();
        },
        success: function(ht) {
            if ($('.paging:visible').index(jq) === 1) {
                $(window).scrollTop($('.version-full-scale:visible').offset().top);
            } else {
                $(window).scrollTop($('.version-table').offset().top);
            }
            if ($(jq).hasClass("online")) {
                $(".version-pd9-lr.online").html(ht);
            } else {
                $(".version-pd9-lr.full").html(ht);
            }

            // progressColor();
            setProcessStyle();

            textLoadingHide();

            investCountDown();
        }
    }).responseText;

}

function getUrl(pageNo, jq) {
    var url1 = "pageNo=" + pageNo;
    url1 += "&isTransfer=" + jq.attr("isTransfer");
    url1 += "&isFresh=" + jq.attr("isFresh");
    url1 += "&isSmall=" + jq.attr("isSmall");
    if (jq.hasClass("online")) {
        var loanType = $(".ver-select-current.loanType").attr("loanType");
        var repayMode = $(".ver-select-current.repayMode").attr("repayMode");
        var guar = $(".ver-screen-oselect.guar").val();
        var sort = $(".ver-select-current.sort").attr("sort");
        var sortD = $(".ver-select-current.sort").attr("d");
        url1 += "&loanType=" + loanType;
        url1 += "&repayMode=" + repayMode;
        url1 += "&guar=" + guar;
        url1 += "&sort=" + sort;
        url1 += "&sortD=" + sortD;
    }
    return url1;
}

function _query() {
    var pp = $(".paging.online");
    pagedCallback(0, pp);
}

$().ready(function() {
    $("#charge1").on("click", function() {
        window.location.href = "/myaccount/capital/deposit"
    });

    $(".loanType").on("click", function() {
        $(".loanType").removeClass("ver-select-current");
        $(this).addClass("ver-select-current");
        _query();
    });
    $(".repayMode").on("click", function() {
        $(".repayMode").removeClass("ver-select-current");
        $(this).addClass("ver-select-current");
        _query();
    });
    $(".sort").on("click", function() {
        $(".ver-select-current.sort strong").remove();
        if (!$(this).hasClass('ver-select-current')) {
            $('.sort[sort="rate"]').attr('d', 0);
            $('.sort[sort="amount"]').attr('d', 1);
            $('.sort[sort="canBidAmount"]').attr('d', 1);
            $('.sort[sort="periods"]').attr('d', 1);
            $('.sort[sort="progress"]').attr('d', 0);
        }
        $(".sort").removeClass("ver-select-current");
        $(this).addClass("ver-select-current");
        if (!$(this).hasClass("default")) {
            $(this).attr("d", $(this).attr("d") == 1 ? 0 : 1);
            if ($(this).attr("d") == 0) {
                //添加箭头
                $(this).append("<strong>↑</strong>");
            } else {
                $(this).append("<strong>↓</strong>");
            }
        }
        _query();
    });
    $(".guar").on("change", function() {
        _query();
    });
});