$(function(){
    {
        function eachFun(obj,cls){
            obj.each(function(){
                var _this = $(this);
                _this.removeClass(cls);
            });
        };
        function hideFun(obj){
            obj.each(function(){
                var _this = $(this);
                _this.hide();
            });
        };
    }
    /*导航滑动效果*/
    {
        var $navLi = $("ul[data-type='nav-menu']> li>a");
        var $borrow_drop_down = $("ul[data-type='nav-menu']> li> div[data-type='borrow-drop-down']");

        $navLi.on("mouseenter",function(){
            var _this = $(this);

            var self = $(this).parent();
            self.addClass("nav-li-hover");

            var $navHover = $(this).parents("ul[data-type='nav-menu']").find(".nav-hover");
            $navHover.css({"width":self.width() + "px"});
            var $offsetLfet =  $(this).offset().left - $("ul[data-type='nav-menu']").offset().left;
            $navHover.stop().animate({"left":($offsetLfet -30) + "px"},200);

            _this.next().show();
        });
        $navLi.on("mouseleave",function(){
            var _this = $(this);

            var self = $(this).parent();
            var $navHover = $(this).parents("ul[data-type='nav-menu']").find(".nav-hover");
            self.removeClass("nav-li-hover");
            $navHover.css({"width":"0"});

            _this.next().hide();
        });
        //我要借款下拉
        $borrow_drop_down.on("mouseenter",function(){

            var _this = $(this);

            _this.show();
            _this.parent().addClass("nav-li-hover");

        });
        $borrow_drop_down.on("mouseleave",function(){

            var _this = $(this);

            _this.hide();
            _this.parent().removeClass("nav-li-hover");

        });


    }
    //
    /*head-js*/
    {
        var $weak_item_a = $("a[data-type='weak-item-a']"),
            $linesColor = $("span[data-type='lines-color']");
        function enterFun(_this){
            _this.addClass("weak-hover-border");
            _this.find("i[data-type='hover-tip-arrow']").addClass("ver-arrow-hover");
            _this.find("em[data-type='ico-tel-em']").addClass("ico-tel-hover");
            _this.css("color","#53a0e3");
            $linesColor.hide();
        }
        function leaveFun(_this){
            _this.removeClass("weak-hover-border");
            _this.find("i[data-type='hover-tip-arrow']").removeClass("ver-arrow-hover");
            _this.find("em[data-type='ico-tel-em']").removeClass("ico-tel-hover");
            _this.css("color","#333");
            $linesColor.show();
        }
        $weak_item_a.on("mouseenter",function(){
            var _this = $(this);
            enterFun(_this);
        });
        $weak_item_a.on("mouseleave",function(){
            var _this = $(this);
            leaveFun(_this);
        });
        //联系我们
        var $weak_item_a1 = $("a[data-type='weak-item-a1']");
        var $weak_contact_us = $("div[data-type='weak-contact-us']");
        $weak_item_a1.on("mouseenter",function(){
            var _this = $(this);
            enterFun(_this);
            $weak_contact_us.show();
        });
        $weak_contact_us.on("mouseenter",function(){
            var _this = $(this);
            $weak_contact_us.show();
            enterFun($weak_item_a1);
        });
        $(document).on("mouseleave","a[data-type='weak-item-a1'],div[data-type='weak-contact-us']",function(){
            var _this = $(this);
            leaveFun(_this);
            $weak_contact_us.hide();
            leaveFun($weak_item_a1);
        });
        //service-list客服。邮箱。微博
        var $service_list = $("div[data-type='service-list']");
        $service_list.on("mouseenter","a",function(){
            var _this = $(this),
                index = _this.index();
            _this.find("span").addClass("ico-service-h"+index);
        });
        $service_list.on("mouseleave","a",function(){
            var _this = $(this),
                index = _this.index();
            eachFun(_this.find("span"),"ico-service-h"+index);
        });
        //登录后状态
        var $after_logging = $("span[data-type='after-logging']"),
            $logging_up = $("div[data-type='logging-up']");
        $(document).on("mouseenter","span[data-type='after-logging'],div[data-type='logging-up']",function(){
            var _this = $(this);
            $logging_up.show();
            $after_logging.addClass("logging-down");
        });
        $(document).on("mouseleave","span[data-type='after-logging'],div[data-type='logging-up']",function(){
            var _this = $(this);
            $logging_up.hide();
            $after_logging.removeClass("logging-down");
        });
    }
    /*heead-js-end*/
    //footer
    {
        var $tail_any = $("div[data-type='tail-any']");
        $tail_any.children("a").on("mouseenter",function(){
            var _this = $(this),
                index = _this.index();
            $tail_any.children("a").each(function(i){
                $(this).removeClass("ico-ver-fight-"+i);
            });
            _this.addClass("ico-ver-fight-"+index)
            eachFun($tail_any.children("div").children(),"flicking-opcity");
            hideFun($tail_any.children("div").children());
            $tail_any.children("div").children().eq(index).addClass("flicking-opcity").show();
        });
        $tail_any.children("a").on("mouseleave",function(){
            var _this = $(this),
                index = _this.index();

            $tail_any.children("a").each(function(i){
                $(this).removeClass("ico-ver-fight-"+i);
            });
            eachFun($tail_any.children("div").children(),"flicking-opcity");
        });

        var $tail_weixin = $("a[data-type='tail-weixin']"),
            $micro = $("div[data-type='micro']");
        $tail_weixin.hover(function(){
                var _this = $(this);
                $micro.show();
            },
            function(){
                $micro.hide();
            }
        );
    }
});