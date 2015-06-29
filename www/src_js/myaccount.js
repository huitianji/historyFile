//月定投浮层
$(function(){
    //月定投在 1.未登陆 2.登陆了但是月薪宝已经开启 3.一年内show过 任一条件下均不显示
    var Request = new Object();
    Request = getRequest();
    if(Request.hasOwnProperty("tomc")) {
        showYdt();
    }
    function showYdt(){
        if(getCookie("syd_name") != ''&&getCookie("ydt_freshman_guide") == '')
        {
            $.post("/myaccount/fixedmonth/fixedMonthStatus",{time: new Date().getTime()},function(data){
                if(data.data&&data.data==2){
                    return;
                }
                startExecForYdt();
                addCookie('ydt_freshman_guide','1',365);
            },"json");
        }
    }
    //show 月定投浮层
    function startExecForYdt(){
        var oFloats = document.getElementById("ydt_floats")
        var	oWrap = $(".ydt_dredge");
        var oClose = $(".ydt_floats_close");

        oFloats.style.display = "block";
        oWrap[0].style.opacity = "0";
        oWrap[0].style.filter = "alpha(opacity:0)";
        oWrap.show();

        var winH = $(window).height();
        var winW = $(window).width();
        var winS = $(window).scrollTop();
        winS = 0;
        var registerTop = (winH - oWrap.height()) / 2 + winS;
        var registerLeft = (winW - oWrap.width()) / 2;
        oWrap.css({
            top: registerTop + 'px',
            left: registerLeft + 'px'
        });
        startMove(oWrap[0], {
            opacity: 100
        }, {});

        oClose.on("click", function(ev, afterFn) {
            startMove(oFloats, {
                opacity: 0
            }, {
                time: 400
            });
            startMove(oWrap[0], {
                opacity: 0
            }, {
                time: 400,
                succFn: function() {
                    oWrap.hide();
                    $(oFloats).hide();
                    afterFn && afterFn();
                }
            })
        })
    }
    function getStyle(obj, attr) {
        return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj, false)[attr];
    }

    function startMove(obj, json, options) {
        options = options || {};
        options.type = options.type || 'linear';
        options.time = options.time || 800;

        var count = Math.round(options.time / 30);
        var oNow = {};
        var dis = {};
        for (var key in json) {
            if (key == 'opacity') {
                oNow[key] = Math.round(parseFloat(getStyle(obj, key) * 100));
                if (isNaN(oNow[key])) {
                    oNow[key] = 100;
                }
            } else {
                oNow[key] = parseInt(getStyle(obj, key));
            }

            if (!oNow[key]) {
                switch (key) {
                    case 'left':
                        oNow[key] = obj.offsetLeft;
                        break;
                    case 'top':
                        oNow[key] = obj.offsetTop;
                        break;
                    case 'width':
                        oNow[key] = obj.offsetWidth;
                        break;
                    case 'height':
                        oNow[key] = obj.offsetHeight;
                        break;
                }
            }

            dis[key] = json[key] - oNow[key];
        }

        var n = 0;
        clearInterval(obj.timer);
        obj.timer = setInterval(function() {
            n++;
            for (var key in json) {
                switch (options.type) {
                    case 'linear':
                        var a = n / count;
                        var iValue = oNow[key] + dis[key] * a;
                        break;
                    case 'ease-in':
                        var a = n / count;
                        var iValue = oNow[key] + dis[key] * a * a * a;
                        break;
                    case 'ease-out':
                        var a = 1 - n / count;
                        var iValue = oNow[key] + dis[key] * (1 - a * a * a);
                        break;
                }
                if (key == 'opacity') {
                    obj.style.opacity = iValue / 100;
                    obj.style.filter = 'alpha(opacity:' + iValue + ')';
                } else {
                    obj.style[key] = iValue + 'px';
                }
            }
            if (n == count) {
                clearInterval(obj.timer);
                options.succFn && options.succFn();
            }
        }, 30);
    }

    function addCookie(name,value,iDay){
        if(!iDay) return;

        var oDate=new Date();
        oDate.setDate(oDate.getDate()+iDay);
        document.cookie=name+'='+value+';path=/;expires='+oDate;
    }
    function getCookie(name){
        var cookies=document.cookie.split('; ');
        for(var i=0,len=cookies.length;i<len;i++){
            var arr=cookies[i].split('=');
            if(arr[0]==name) return arr[1];
        }
        return '';
    }
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
});

(function($){
    'use strict';

    var commonFn = {

        fmtMoney: function(money, length, isYuan) {
            if (length !== 0) {
                length = length | 2;
            }
            if (typeof parseInt(money) === 'number' && !isYuan) {
                money = (money / 100).toFixed(length);
            }else{
                money = (money * 1).toFixed(length);
            }
            money = ('' + money).replace(/(\d)(?=(?:\d{3})+(?:\.\d+)?$)/g, "$1,");
            return money;
        },
        getErrorHtml: function(hClass){
            hClass = hClass ? hClass : ""; 
            return '<span class="accview-load-failed ' + hClass + '">加载失败，<a href="javascript:;" onclick="javascript:window.location.reload();" >立即刷新</a></span>';
         }

    }

    template.helper('fmtMoney', function(money, length, isYuan){
        return commonFn.fmtMoney(money, length, isYuan);
    });
    // $(".acc-view-item").on("click", function(){
    //     $(this).find(".acc-view-picgif:eq(0)").find("a:eq(0) .acc-view-picgif-status").click();
    // })
    $(".acc-view-information").on("click", function(){
        $(this).prev().find("a:eq(0) .acc-view-picgif-status").click();
    })
    //加载tooltips
    ~function(){
        var tips = codes && codes.local_tooltip;
        $("[data-text]").each(function(i, item){
            var $this = $(this);
            var text = $this.attr("data-text");
            var show = "";
            if(tips && tips[text]){
                show = tips[text];
            }
            $this.attr("data-text", show);
        });
        
    }();
    // 我的投资 列表数据
    ~function(){
        var arrType = ["normal", "transfer", "dqb", "fund"];
        // 普通标、转让、理财
        for (var i = 0; i < arrType.length; i++) {
            getAjaxData(arrType[i]);
        };

        function getAjaxData(type){
            $.ajax({
                url : "/myaccount/portal/ajax/get_my_invest/"+type,
                type : "POST",
                data : { type : type },
                dataType : 'json'
            }).done(function(json){
                if(json.errorCode == 0){
                    var templateId = type == "fund" ? "myProjectFund" : "myProject";
                    var html = template("src_overview/" + templateId, json.data);
                    $(".acc-view-information[data-type='project-" + type + "']").html(html);
                }
            }).fail(function(){  
               $(".acc-view-information[data-type='project-" + type + "']").closest('.acc-view-item').html(commonFn.getErrorHtml("line-height98"));
            });
        }
    }();
    
     // 我的投资 查询数据
    ~function(){
        getAjaxData1();
        function getAjaxData1(){
            $.ajax({
                url : "/myaccount/portal/ajax/get_my_invest/capital",
                type : "POST",
                dataType : 'json',
                data: { t: Math.random() }
            }).done(function(json){
                if(json.errorCode == 0){
                    fillInfo(json.data);
                    //总待收
                    $(".acc-view-calendar").find("em[data-type='calender-total']").html( commonFn.fmtMoney(json.data.willGainInterest + json.data.willGainPrincipal, 2));
                    setTimeout(setCanvasMap, 50);
                }
            }).fail(function(){
                $(".acc-view-amount-change").html(commonFn.getErrorHtml());
            });
        }
        function fillInfo(data){
            for(var item in data){
                var $item = $("#" + item);

                var oldVal = $.trim($item.html()),
                    newVal = commonFn.fmtMoney(data[item], 2) + '';
                if( oldVal == ""){
                    $item.html(newVal);
                }else{
                    $item.html(oldVal.replace("0.00", newVal));
                }
                $item.filter("[data-money]").attr("data-money", data[item]/100);
            }
        }
    }();
    
    window.mysyd = function(){ alert("syd"); }

    // 我的投资 列表效果
    ~function(){

        var isSupCss3 = supportCss3("transition");
        //如果支持transition 则走css3
        if(isSupCss3 == true){
            $(".acc-view-item").on("mouseenter mouseleave", function(){
                $(this).toggleClass('mouseenter');
                changeGif($(this).find(".acc-view-picgif-hover img"));
            })
            return;
        }

        //如果不支持transition 走js效果
        $(".acc-view-item").on("mouseenter", function(){
            //切换gif
            changeGif($(this).find(".acc-view-picgif-default img"));
            //右侧效果
            $.proxy(enter, this)();

        }).on("mouseleave", function(){
            //切换gif
            changeGif($(this).find(".acc-view-picgif-default img"));
            //右侧效果
            $.proxy(leave, this)();

        });

        function changeGif($img){
            //切换gif
            var src = $img.attr("src");
            $img.attr("src", $img.attr("_src")).attr("_src", src);
        }
        function enter(){
            $(this).find(".acc-view-picgif-name").css("color", "#53a0e3");
            AnimationJs.startMove($(this).find(".acc-view-information").get(0), { marginLeft: 24 }, {
                time : 200,
                type : 'linear'
            });
        }
        function leave(){
            $(this).find(".acc-view-picgif-name").css("color", "");
            AnimationJs.startMove($(this).find(".acc-view-information").get(0), { marginLeft: 34 }, {
                time : 200,
                type : 'linear'
            });
        }

        /**
         * 判断浏览器是否支持某一个CSS3属性
         * @param  {String} 属性名称
         * @return {Boolean} true/false
         * @version 1.0
         * @author ydr.me
         * 2014年4月4日14:47:19
         */
         
        function supportCss3(style) {
            var prefix = ['webkit', 'Moz', 'ms', 'o'],
                i,
                humpString = [],
                htmlStyle = document.documentElement.style,
                _toHumb = function (string) {
                    return string.replace(/-(\w)/g, function ($0, $1) {
                        return $1.toUpperCase();
                    });
                };
         
            for (i in prefix)
                humpString.push(_toHumb(prefix[i] + '-' + style));
         
            humpString.push(_toHumb(style));
         
            for (i in humpString)
                if (humpString[i] in htmlStyle) return true;
         
            return false;
        }
    }();

    // 日历
    ~function(){
        //绑定日历立即投资按钮
        $(".acc-view-calendar").on("click", "input[data-type='version-btn-invest']", function(){
            window.location.href = "/invest";
        });

        //获取左侧月汇总数据
        function getLeftTotalData(){
            $.ajax({
                url: '/myaccount/portal/ajax/get_receipt_month',
                type: 'POST',
                dataType: 'json',
                data: {t: Math.random()}
            })
            .done(function(data) {
                if(data.errorCode == 0){
                    var sHtml = '';
                    var $leftTotal = $("#cal-left-totalMonth");
                    for (var i = 0; i < data.data.length; i++) {
                        var item = data.data[i];
                        sHtml += '<a href="javascript:;"><em>' + commonFn.fmtMoney(item.amount, 2) + '</em><span>' + item.monthStr + '</span></a>';
                    };
                    if(sHtml != ''){
                        $leftTotal.html(sHtml);
                        initCalender();
                    }else{
                        sHtml = '<div class="accview-debt-collection"><span>没有回款</span><span class="accview-debt-btns"><input type="button" class="version-btn-h30" data-type="version-btn-invest" value="立即投资"></span></div>';
                        $leftTotal.parent().append($(sHtml));
                        $leftTotal.remove();
                        var instance = new Calender("invest-calender");
                        instance.setCalender(instance.today.getMonth() + 1);
                    }
                }
            }).fail(function(){
                $(".acc-view-calendar").html(commonFn.getErrorHtml("line-height403"));  
            });
            
        }
        getLeftTotalData();
        
        function Calender(id){
            this.$oCalender = $("#" + id);
            this.nowDate = new Date();      //显示的当前月份的日期
            this.today = new Date();        //今天的日期
            this.iNow = 0;       //当前显示的是第几个月的数据
            this.$leftTotal = $("#cal-left-totalMonth");
            this.$arrLeftMonth =  this.$leftTotal.find("a");  //左侧月汇总数据的a标签
            this.$position = this.$oCalender.closest('.accview-calendar-poistionab');    //控制左右移动的日历div 
            this.$oLast = $("#cal-last-month");
            this.$oNext = $("#cal-next-month");
            this.dayNum = 0;
            this.isFront = false;   //是否是前进？true 是；false 否
            this.clickDate = 0;     //点击的哪一天，如果没有 默认为0
            this.isNextDate = false;   //是否是点击下个月的某天触发
            this.cacheMonthData = { };    //缓存，存放每个月的项目数据，如果有则无需请求后台
            this.cacheDateData = { };    //缓存，存放每天的项目数据，如果有则无需请求后台

            //如果左侧有月份数据，则nowDate重置到存在数据的第一个月
            if(this.$leftTotal.length){
                var year = this.$leftTotal.find("a:eq(0) span").html();
                var arrYear = year.split("-");
                this.nowDate.setFullYear(arrYear[0], arrYear[1] - 1);
                this.$arrLeftMonth.eq(this.iNow).addClass('current');
            }
        }

        Calender.prototype = {

            setNextMonth : function(){
                this.setMonth(this.nowDate.getMonth() + 1);
                this.setCalender();
            },
            setLastMonth : function(){
                this.setMonth(this.nowDate.getMonth() - 1);
                this.setCalender();
            },
            setMonth : function(month, year){
                var beforeNow = this.iNow;
                var nowMonth = this.nowDate.getFullYear() * 12 + this.nowDate.getMonth();
                var setMonth = month;
                if(year){
                    setMonth += year * 12;
                }else{
                    setMonth += this.nowDate.getFullYear() * 12;
                }
                var spanMonth = setMonth - nowMonth;
                this.isFront = spanMonth >= 0 ? true : false;
                this.iNow += spanMonth;

                this.setLeftClassToTotalData(beforeNow);
                year && this.nowDate.setFullYear(year);
                this.nowDate.setMonth(month);
            },
            setLeftClassToTotalData : function(beforeNow){
                //设置左侧按月汇总数据样式
                this.$arrLeftMonth.eq(beforeNow).removeClass('current');
                this.$arrLeftMonth.eq(this.iNow).addClass('current');
                //判断当前标签是否显示，如果没显示则调整scrollTop
                var top = this.$arrLeftMonth.eq(0).outerHeight(true);
                var scrollTop = this.$leftTotal.scrollTop();
                var thisNow = this.iNow + 1;
                if(thisNow <= 10){
                    if(scrollTop > top * (thisNow - 1)){
                        this.$leftTotal.scrollTop( (thisNow - 1) * top );
                    }
                }else{
                    if(scrollTop < top * (thisNow - 10)){
                        this.$leftTotal.scrollTop( top * (thisNow - 10) );   
                    }else if(scrollTop > top * (thisNow - 1)){
                        this.$leftTotal.scrollTop( top * (thisNow - 1) );   
                    }
                }
            },
            //获得这个月第一天是周几 [ 0 - 6]
            getWeekDay : function(date){
                var cloneDate = this.clone(date);
                cloneDate.setDate(1);
                return cloneDate.getDay();
            },
            //获得这个月最后一天的日期 [28 - 31]
            getLastDate : function(date){
                var cloneDate = this.clone(date);
                cloneDate.setMonth(cloneDate.getMonth() + 1);
                cloneDate.setDate(0);
                return cloneDate;
            },
            //获得上个月的最后一天的日期 [28 - 31]
            getLastMonthLastDay : function(date){
                var cloneDate = this.clone(date);
                cloneDate.setDate(0);
                return cloneDate.getDate();
            },
            setCalender : function(month, year, succFn){
                this.dayNum = 0;
                var arrWeek = ["7", "1", "2", "3", "4", "5", "6"];
                var arrCalHtml = [ ];
                //存下之前的position
                var oldPosition = $("<div>").html(this.$position.html()).addClass(this.$position.attr("class"));
                month && this.setMonth(month - 1, year);
                var weekDay = arrWeek[ this.getWeekDay(this.nowDate) ]; //7
                var lastDate = this.getLastDate(this.nowDate);
                var lastDay = lastDate.getDate();   //31
                var lastWeekDay = arrWeek[ lastDate.getDay() ]; //2
                var lastMonLastDay = this.getLastMonthLastDay(this.nowDate);    //28

                //加载当月1号之前的显示日期
                arrCalHtml.push(this.createArrLi({
                        start : lastMonLastDay - (weekDay - 1) + 1,
                        end : lastMonLastDay,
                        commonLiHtml : "<span>@value</span>",
                        weekLiHtml : "<em>@value</em>"
                    })
                )
                //获取月显示的数据
                var nextMonthDayNum = 42 - (weekDay - 1) - lastDay;     //下个月需要显示的天数
                var beiginTime = this.clone(this.nowDate);
                beiginTime.setDate(1);
                var endTime = this.clone(this.nowDate)
                endTime.setMonth(endTime.getMonth() + 1);
                endTime.setDate(nextMonthDayNum);
                var json = this.getMonthData(beiginTime.getTime(), endTime.getTime());

                //加载本月显示的日期
                var This = this;
                arrCalHtml.push(this.createArrLi({
                        start : 1,
                        end : lastDay,
                        weekDay : weekDay - 1,
                        month : This.nowDate.getMonth() == 12? 0 : This.nowDate.getMonth(),
                        commonLiHtml : "<a href='javascript:;' class='@hrefClass'>@value</a>",
                        weekLiHtml : "<a href='javascript:;' class='@hrefClass'><strong>@value</strong></a>"
                    })
                )
                //加载下个月显示的日期
                arrCalHtml.push(this.createArrLi({
                        start : 1,
                        end : nextMonthDayNum,
                        weekDay : lastWeekDay,
                        month : (This.nowDate.getMonth() + 1) == 12 ? 0 : (This.nowDate.getMonth() + 1),
                        year : This.nowDate.getFullYear() + 1,
                        commonLiHtml : "<a href='javascript:;' class='@hrefClass'><span>@value</span></a>",
                        weekLiHtml : "<a href='javascript:;' class='@hrefClass'><em>@value</em></a>"
                    })
                )
                this.$oCalender.html(arrCalHtml.join(''));

                document.getElementById("invest-cal-month").innerHTML = this.nowDate.getFullYear() + '-' + this.addZero(this.nowDate.getMonth() + 1);
                this.setClassToDay(json);
                this.isHasClickBtn();
                //显示月待收
                this.$position.find(".accview-calendar-title em").html( this.$leftTotal.find(".current em").html() );

                var pWidth = this.$position.width(),
                    targetLeft = !this.isFront ? -pWidth : pWidth;
                this.$position.css("left", targetLeft + 'px');
                $(oldPosition).css("left", 0).appendTo(this.$position.parent());

                AnimationJs.startMove( this.$position[0], { left : 0 }, {
                    time : 600,
                    type : "ease-out"
                });
                AnimationJs.startMove( $(oldPosition)[0], { left : -targetLeft }, {
                    time : 600,
                    type : "ease-out", 
                    succFn : function(){
                        $(oldPosition).remove();
                        This.clickDateFn( { date: This.nowDate.getDate(), month : This.nowDate.getMonth(), year : This.nowDate.getFullYear() }, This.isFront );
                        if(This.$oCalender.find("li[data-month]").find("a.border").length == 0){
                            $(".accview-daycollect .accview-debt-collection span:eq(0)").html("当月没有回款");
                        }else{
                            $(".accview-daycollect .accview-debt-collection span:eq(0)").html("当日没有回款");
                        }
                    }
                });
            },
            setClassToDay : function(json){
                var $arrLi = this.$oCalender.find("li[data-month]"),
                    todayMonth = this.today.getMonth(),
                    todayDate = this.today.getDate(),
                    todayYear = this.today.getFullYear(),
                    isToday = false;    //是否设置当前选中样式

                for (var j = 0; j < $arrLi.length; j++) {

                    var $li = $arrLi.eq(j),
                        $a = $li.find("a"),
                        month = $li.attr("data-month"),
                        date = $li.attr("data-date"),
                        year = $li.attr("data-year");

                    if(!json || !json.data) break;

                    for (var i = 0; i < json.data.length; i++) {
                        var arrDate = new Date( json.data[i] ),
                            borderMonth = arrDate.getMonth(),
                            borderDate = arrDate.getDate();

                        //如果当天有回款，设置class
                        if( borderMonth == month && borderDate == date){
                            $a.attr("data-border", 'true').addClass('border');     //data-border 标记有回款的日期
                            break;
                        }
                    };

                    //默认当天的样式
                    if(!this.isNextDate && !isToday && month == todayMonth && date == todayDate && year == todayYear){
                        $a.removeClass().addClass('today');
                        this.nowDate.setDate(date);
                        isToday = true;
                    }
                    
                };

                //如果今天不在当月内，则选取当月第一个有回款的当天做today
                if(!this.isNextDate && !isToday){
                    var $border = $arrLi.find("a.border").eq(0);
                    if($border.length){
                        this.nowDate.setDate( $border.parent().attr("data-date") );
                        $border.removeClass().addClass('today');
                    }        
                    
                }
            },
            isHasClickBtn : function(){
                //判断能否点击前进后退按钮
                var $lastParent = this.$oLast.parent(),
                    $nextParent = this.$oNext.parent(),
                    thisMonth = this.nowDate.getMonth(),
                    thisYear = this.nowDate.getFullYear(),
                    todayMonth = this.today.getMonth(),
                    todayYear = this.today.getFullYear();
                if(this.$arrLeftMonth.length){
                    var arrLastDate = this.$arrLeftMonth.last().find("span").html().split("-");
                    var lastYear = arrLastDate[0];
                    var lastMonth = arrLastDate[1];
                }else{
                    var lastYear = 0;
                }

                if(this.$leftTotal.length){
                    var year = this.$leftTotal.find("a:eq(0) span").html();
                    var arrYear = year.split("-");
                    todayMonth = arrYear[1] - 1;
                    todayYear = arrYear[0];
                }
                //前进控制
                if(thisMonth == todayMonth && thisYear == todayYear){
                    $lastParent.hide();
                }else{
                    $lastParent.show();
                }
                //后退控制
                if( lastYear == 0 || (thisMonth == parseInt(lastMonth) - 1 && thisYear == lastYear ) ){
                    $nextParent.hide();
                }else{
                    $nextParent.show();
                }
            },
            //点击某天时触发事件
            clickDateFn : function(options, isFront){
                if(this.clickDate != 0) return;
                if(options.month > this.nowDate.getMonth() && !this.$oNext.is(":visible")) return;     //this.$oNext.is(":visible") 如果可以点击下一个月
                
                if( options.month == 0 && this.nowDate.getMonth() == 11  ||  options.month > this.nowDate.getMonth() ){
                    this.nowDate.setDate(options.date);
                    this.isNextDate = true;
                    this.setNextMonth();
                }else{
                    this.clickDate = options.date;
                    if(this.isNextDate){
                        this.$oCalender.find("li[data-month]").filter("[data-date=" + this.clickDate + "]").eq(0).find("a").removeClass().addClass('today');
                    }
                    this.isNextDate = false;
                    var d = new Date( options.year, options.month, options.date);
                    var jsonData = this.getDateData( d );
                    this.setDataToDay(jsonData, isFront);
                }
                
            },
            setDataToDay : function(json, isFront){
                var $pos = $("#cal-date-receive"),
                    data_len = $pos.attr("data-length") || "0",
                    isEmpty = !json.data.list.length,
                    dateTotal = ( json.data && json.data.total ) || 0,
                    posWidth = 254;

                if(json.data.total == 0) isEmpty = true;

                var parentHtml = "<div class='accview-positionab'>";
                parentHtml += '     <span class="accview-daycoll-title">'
                parentHtml += '         <em>' + commonFn.fmtMoney(dateTotal, 2) + '</em>'
                parentHtml += '         <span>日待收</span>'
                parentHtml += '     </span>'
                parentHtml += '     <span class="accview-daycoll-title gray">'
                parentHtml += '         <em>待收回款</em>'
                parentHtml += '         <span>项目编号</span>'
                parentHtml += '     </span>'
                parentHtml += '</div>'
                var $newPosition = $(parentHtml);

                if(isEmpty){
                    if(data_len == "0"){
                        //如果json为空对象，且当前显示为无回款，则不作处理
                        this.clickDate = 0;
                        return;
                    }else if(data_len == "1"){
                        //需要做切换处理
                        $pos.attr("data-length", 0);
                        var itemHtml = "<div class='accview-debt-collection'>";
                        itemHtml += '<span>当日没有回款</span><span class="accview-debt-btns"><input type="button" class="version-btn-h30" data-type="version-btn-invest" value="立即投资"></span>';
                        itemHtml += "</div>";
                    }
                }else{
                    //如果有新数据
                    $pos.attr("data-length", 1);
                    var itemHtml = "<div class='accview-daycoll-list'>";
                    for(var i = 0; i < json.data.list.length; i++){
                        var item = json.data.list[i];
                        var itemHref = item.productType == 0 ? "/bid/detail/" : "/fb/detail/";  //0:普通标 1：定期宝
                        var money = commonFn.fmtMoney( item.principal + item.interest + item.subsidyPrincipal + item.subsidyInterest + item.raiseInterest + item.actualRaiseInterest , 2 );
                        itemHtml += '<span><em>' + money + '</em><a target="_blank" href="' + itemHref + item.newbidId + '">' + item.title + '</a></span>';
                    }
                    itemHtml += "</div>";
                }

                var $oldPosition = $pos.find(".accview-positionab:eq(0)");
                $newPosition.append(itemHtml);
                $pos.append($newPosition);

                var w = isFront ? posWidth : -posWidth;
                $newPosition.css("left", w);
                $oldPosition.css("left", 0);
                var This = this;
                AnimationJs.startMove( $newPosition[0], { left : 0 }, {
                    time : 600,
                    type : "ease-out"
                });
                AnimationJs.startMove( $oldPosition[0], { left : -w }, {
                    time : 600,
                    type : "ease-out", 
                    succFn : function(){
                        $oldPosition.remove();
                        This.clickDate = 0;
                    }
                });
                
            },
            getMonthData : function(beigin, end){
                //得到每个月的数据
                //如果缓存有数据，走缓存
                var objMonthData = this.cacheMonthData[ this.nowDate.getFullYear() + '' + this.addZero( this.nowDate.getMonth() ) ];
                if(objMonthData){
                    return objMonthData;
                }

                var This = this;
                //否则通过ajax请求获取
                $.ajax({
                    url: '/myaccount/portal/ajax/get_receipt_days',
                    type: 'POST',
                    dataType: 'json',
                    async: false,
                    data: { begin : beigin, end : end }
                })
                .done(function(data) {
                    if(data.errorCode == 0){
                        This.cacheMonthData[This.nowDate.getFullYear() + '' + This.addZero( This.nowDate.getMonth() ) ] = data;
                    }
                })

                return this.cacheMonthData[ this.nowDate.getFullYear() + '' + this.addZero( this.nowDate.getMonth() ) ];
            },
            getDateData : function(date){
                //得到每天的数据
                //如果缓存有数据，走缓存
                var objDateData = this.cacheDateData[ date.getFullYear() + '' + this.addZero( date.getMonth() ) + '' + this.addZero( date.getDate() ) ];
                if(objDateData){
                    return objDateData;
                }

                var This = this;
                //否则通过ajax请求获取
                $.ajax({
                    url: '/myaccount/portal/ajax/get_day_receipt',
                    type: 'POST',
                    dataType: 'json',
                    async: false,
                    data: { date : date.getTime() }
                })
                .done(function(data) {
                    if(data.errorCode == 0){
                        This.cacheDateData[ date.getFullYear() + '' + This.addZero( date.getMonth() ) + '' + This.addZero( date.getDate() ) ] = data;
                    }
                });

                return this.cacheDateData[ date.getFullYear() + '' + this.addZero( date.getMonth() ) + '' + this.addZero( date.getDate() ) ];
            },
            createArrLi : function(options){
                var forDay = options.weekDay || 0;      //for循环中的每天是周几
                var arrLiHtml = [ ];
                var year = options.year || this.nowDate.getFullYear();
                for(var i = options.start; i <= options.end; i++){
                    var optionsToLi = { value : i, liHtml : options.commonLiHtml, year : year, month : options.month };
                    this.dayNum++;
                    forDay++;
                    if(forDay == 6 || forDay == 7){
                        if(forDay == 7) forDay = 0;
                        optionsToLi.liHtml = options.weekLiHtml || optionsToLi.liHtml;
                    }
                    options.everyFn && options.everyFn(optionsToLi);
                    arrLiHtml.push(this.createLi(optionsToLi));
                }
                return arrLiHtml.join("");
            },
            createLi : function(optionsToLi){
                var optMonth = optionsToLi.month != undefined ? ( " data-month=" + optionsToLi.month ) : "";
                var hrefClass = optionsToLi.hrefClass || "";
                var liHtml = "<li " + optMonth + " data-date=" + optionsToLi.value + " data-year=" + optionsToLi.year + ">" + optionsToLi.liHtml.replace(/@value/, optionsToLi.value).replace(/@hrefClass/, hrefClass) + "</li>";
                return liHtml;
            },
            clone : function(date){
                return new Date(date.getTime());
            },
            addZero : function(t){
                return t < 10 ? '0' + t : t;
            },
            constructor : Calender

        }

        function initCalender(){
            var arrMonth = document.getElementById("cal-left-totalMonth").getElementsByTagName("a");
            var instance = new Calender("invest-calender");
            instance.setCalender();

            var oLast = document.getElementById("cal-last-month");
            var oNext = document.getElementById("cal-next-month");
            oLast.onclick = function(){
                instance.setLastMonth();
            }
            oNext.onclick = function(){
                instance.setNextMonth();
            }

            for(var i = 0; i < arrMonth.length; i++){
                arrMonth[i].onclick = function(){
                    var aSpan = this.getElementsByTagName("span");
                    var arrDate = $.trim(aSpan[0].innerHTML).split("-");
                    if((instance.nowDate.getMonth() == arrDate[1] - 1) && instance.nowDate.getFullYear() == arrDate[0] ) return;

                    instance.setCalender(parseInt(arrDate[1], 10), arrDate[0]);
                }
            }
            $(".accview-calendar-fixed").on("click", "li a", function(){
                var $this = $(this),
                    $parentLi = $this.closest('li'),
                    $currentLi = $("#invest-calender").find("li").children('a.today').parent();
                var $today = $("#invest-calender").find('a[class="today"]'),
                    this_date = $parentLi.attr("data-date"),
                    this_month = $parentLi.attr("data-month"),
                    this_year = $parentLi.attr("data-year");

                if($currentLi.length && this_month == $currentLi.attr("data-month") && this_date == $currentLi.attr("data-date")) return;

                $today.removeClass('today');
                $today.attr("data-border") == "true" && $today.addClass('border');
                $this[0].className = "today";
                instance.clickDateFn( { date: this_date, month : this_month, year : this_year }, parseInt(this_date) > parseInt($currentLi.attr("data-date")) ? true : false );
            });

        }

    }();

    // 我的资产canvas图
    function setCanvasMap(){
        var canvas = document.getElementById('cvs-accview-circular');
        if(!canvas.getContext) return;

        var $arrData = $(".accview-circular-aside .accview-circular-number"),
            oGC = canvas.getContext("2d"),
            aColor = [ "#64b2e9", "#ffb324", "#81cb50" ],   //可用余额、冻结金额、待收本金 颜色色值
            canvasW = 264,          //canvas宽度
            canvasH = 246,          //canvas高度
            radius = 88,            //圆环中心半径
            strokeWidth = 22,       //圆环边框宽度
            radiusX = canvasW / 2,  //圆环x中心点坐标
            radiusY = canvasH / 2,  //圆环y中心点坐标
            spanWidth = 1,          //间隙度数
            minPrecent = 1/120;     //扇形最小显示度数比例（3度）
        canvas.setAttribute("width", canvasW);
        canvas.setAttribute("height", canvasH);
        var arrAngle = [],  //弧度数组
            total = 0;      //总金额
        for(var i = 0; i < $arrData.length; i++){
            arrAngle.push( $arrData.eq(i).attr("data-money") * 1 );
            total += arrAngle[i];
        }
        /* todo */
        // arrAngle = [ 1111, 1111, 1111];
        // total = 3333;
        /* end todo */
        var lastVal = 0;

        if(total == 0){
            //如果总金额为0，弧度均分
            for (var i = 0; i < arrAngle.length; i++) {
                arrAngle[i] = 1 / arrAngle.length;            
            }
        }else{
            var arrMin = [ ], arrNormal = [ ];  //arrMin 小于minPrecent最小值的索引数组记录；arrNormal 正常值的索引数组记录
            for (var i = 0; i < arrAngle.length; i++) {
                //如果小于最小值，记录索引
                if( arrAngle[i] / total < minPrecent){
                    arrMin.push(i);
                }else{
                    arrNormal.push(i);
                }
            };

            //如果有两个小于最小值
            if(arrMin.length == 2){
                arrAngle[arrNormal[0]] = 1 - minPrecent * 2;    
                arrAngle[arrMin[0]] = arrAngle[arrMin[1]] = minPrecent; //设置为最小值
            }else if(arrMin.length == 1){
                //如果有一个小于最小值
                var num1 = arrNormal[0];
                var num2 = arrNormal[1];
                var numTotal = arrAngle[num1] + arrAngle[num2];
                //正常索引数据按比例分配弧度
                arrAngle[num1] = arrAngle[num1] / numTotal * (1 - minPrecent);  
                arrAngle[num2] = arrAngle[num2] / numTotal * (1 - minPrecent);
                arrAngle[arrMin[0]] = minPrecent;
            }else{
                //如果三个都为正常值，则正常分配弧度
                for (var i = 0; i < arrAngle.length; i++) {
                    arrAngle[i] = arrAngle[i] / total;
                }
            }
        }
        

        for(var i = 0; i < arrAngle.length; i++){
            var angleVal = arrAngle[i] * 360;
            var start = i == 0 ? -90 : lastVal;
            var end = start + angleVal - spanWidth;
            oGC.beginPath();
            oGC.arc(radiusX, radiusY, radius, start * Math.PI / 180, end * Math.PI / 180);
            oGC.lineWidth = strokeWidth;
            oGC.strokeStyle = aColor[i];
            oGC.stroke();
            oGC.closePath();

            //间隙
            lastVal = end + spanWidth;    
            oGC.beginPath();
            oGC.arc(radiusX, radiusY, radius, end * Math.PI / 180, lastVal * Math.PI / 180);
            oGC.lineWidth = strokeWidth;
            oGC.strokeStyle = "#fff";
            oGC.stroke();
            oGC.closePath();          
            
        }
    };
        
    // 折线图收益展示
    ~function(){
        // 路径配置
        require.config({
            paths: {
                echarts: 'https://static.souyidai.com/www/js/echartsJs'
            }
        }); 

        // 使用
        require(
            [
                'echarts',
                'echarts/chart/line' // 使用柱状图就加载line模块，按需加载
            ],
            function (ec) {
                // 基于准备好的dom，初始化echarts图表
                var myChart = ec.init(document.getElementById('echarts-profit')); 
                
                var option = {
                    title : {
                        show : false,
                        text: '',
                        subtext: '',
                        // x: "225",
                        textStyle: {
                            fontSize: "12",
                            fontWeight: "normal"
                        }
                    },
                    tooltip : {
                        trigger: 'axis',
                        textStyle : {
                            fontSize : "12",
                            color : "#fff"
                        },
                        formatter : function(params, ticket, callback){
                            var val = commonFn.fmtMoney(params[0].value, 2, true);
                            return params[0].name + '<br>' + '收益：' + val + '元';                     
                        }
                    },
                    legend: {
                        show : false,
                        data:['搜易贷收益走势图']
                    },
                    toolbox: {
                        show : false,
                        feature : {
                            mark : {show: true},
                            dataView : {show: true, readOnly: false},
                            magicType : {show: true, type: ['line', 'bar']},
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    grid : {
                      x : "16",
                      x2 : '16',
                      y : "16",
                      y2 : "40",
                      borderColor : "#fff"

                    },
                    calculable : true,
                    dataZoom : {
                      show : true,
                      start : 67,
                      end : 100,
                      fillerColor : '#ffb224',
                      handleSize : 8,
                      height : 12,
                      backgroundColor : '#ececec',
                      zoomLock : false
                    },
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : [],
                            splitLine : { 
                                show : false
                            }
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            axisLabel : {
                                margin : '-30'
                            },
                            splitArea: { 
                                show : true,
                                areaStyle : {
                                    color: [
                                        'rgba(255,255,255,1)',
                                        'rgba(247,247,247,1)'
                                    ]
                                }         
                            },
                            splitLine : {
                                lineStyle : {
                                    color: ['#eee'],
                                    width: 1,
                                    type: 'solid'
                                }      
                                
                            }
                        }
                    ],
                    series : [
                        {
                            name:'收益',
                            type:'line',
                            data:[],
                            // markPoint : {
                            //     data : [
                            //         {type : 'max', name: '最大值'},
                            //         {type : 'min', name: '最小值'}
                            //     ]
                            // },
                            // markLine : {
                            //     data : [
                            //         {type : 'average', name: '平均值'}
                            //     ]
                            // },
                            axisLabel : {
                                formatter : function(value){
                                    return commonFn.fmtMoney(value, 2, true);
                                }
                            }
                        }
                    ]
                }; 

                option.xAxis[0].data = [];
                option.series[0].data = [];
                $.ajax({
                    url: '/myaccount/portal/ajax/get_my_invest/gainAmount90',
                    type: 'POST',
                    dataType: 'json',
                    data: { t: Math.random() }
                })
                .done(function(json) {
                    var graphData = $.parseJSON(json.data && json.data.graphData);
                    $("#testFor90data").html(json.graphData);
                    for(var item in graphData){
                        option.xAxis[0].data.push( item.substring(5) );
                        option.series[0].data.push( graphData[item]/100.00 );
                    }
                    // 为echarts对象加载数据 
                    myChart.setOption(option);
                }).fail(function(){
                    $(".acc-view-graph").html(commonFn.getErrorHtml());
                });
                
            }
                    
        );

    }();

})(jQuery);

