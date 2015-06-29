//$("#tpl-box").load("tpl.html");
var ele = $("#invest-detail");//接收数据盒子
var pageSize = 10;//每页显示10
///模板函数
/*templateFun*/
var $tpl = $("#tpl");
function templateFun(data){
    var source   =  $tpl.html();
    if(source){
        var template = Handlebars.compile(source);
        var html = template(data);
        $(html).appendTo($(ele));   
    }
}

////显示分页
/*showPage*/
function showPage(jq,total,pageSize,currentpage,indexOrTime,$stepSecond){
    jq.pagination(total, {
        'items_per_page' : pageSize,
        'num_display_entries' : 4,
        'num_edge_entries' : 3,
        'current_page' : 0,
        'prev_text' : "&nbsp;",
        'next_text' : "&nbsp;",
        'callback' : pageCallback
    });
    //$(jq).attr("data-type",index);
    $(jq).attr("data-type",indexOrTime);
    $(jq).attr("data-time",$stepSecond);
}

////分页回调函数(加载分页内容)
/*pageCallback*/
function pageCallback(pageNo,jq){
   //var $thisV = $(jq).attr("data-type");
    //alert(pageNo+1);
    var $thisV = $(jq).attr("data-type");
    var $stepSecond = $(jq).attr("data-time");
    $.ajax({
        url:"/myaccount/capital/detail?isAjax=true&"+$stepSecond+"="+$thisV+'&t='+Math.random(),
        type:"get",
        data:{
            pageNo:(pageNo+1),
            startTime: $(".type-data input[data-target=start]").val().replace(/^\s+|\s+$/g,''),
            endTime: $(".type-data input[data-target=last]").val().replace(/^\s+|\s+$/g,''),
            businessType: $(".type-list-active").find("a").attr("data-type"),
            t: Math.random()
        },
        beforeSend : function(xhr) {
            $(ele).html("<div id='ele-loading' style='height:240px; text-align:center;line-height:240px;'><img src='https://static.souyidai.com/www/images/loading.gif'/>加载中……</div>").show();
        },
        dataType:"json",
        success:function(data){
            $(ele).find("#ele-loading").hide();            
            for (var i = 0; i < data.data.list.length; i++) {
                var dataList = data.data.list[i];
                if(typeof dataList.inAmount == "number" && dataList.inAmount == 0){
                    dataList.inAmountZero = 1;  //如果为0，做特殊处理，模板那边使用
                }
                if(!dataList.detailInfoMap){
                    continue;
                }
                if(dataList.detailInfoMap.desc.indexOf("定期宝") != -1){
                    dataList.linkHref = "/fb/detail/"+dataList.detailInfoMap.descHref;
                }else{
                    dataList.linkHref = "/bid/detail/"+dataList.detailInfoMap.descHref;
                }
            };

            
            //调用模板
            templateFun(data.data);
            //格式化
            addFormat();
            //end
        }
    });

}
/*
 *type-list资金类型列表项
 * */
 $(function(){
    var $type_list = $(".type-list");
    //var $capital_aside = $(".capital-aside");
    $type_list.find("li").mouseenter(function(){
        $(this).addClass("type-list-hover");
    }).
        mouseleave(function(){
            $(this).removeClass("type-list-hover");
        });
    $type_list.on("click","li",function(){
        var index = $(this).index();
        var $liH = $(this).parents(".capital-aside").find("li");
        for(var i= 0,len = $liH.length;i<len;i++){
            $liH.eq(i).removeClass("type-list-active");
        }
        $(this).addClass("type-list-active");
        var self = $(this);
        var newIndex = self.find("a").attr("data-type");
        /*数据。。。*/
        showListType(newIndex);
        /////////////
        //console.log($(this).attr("data-type"))
    });
    /*默认显示全部的数据*/
    showListType(0)
    /*数据类型函数showListType*/
    function showListType(index){
        showList(ele,index);

    }
     /*数据加载列表showList*/
    function showList(ele,index){
        $(ele).empty();
        ///myaccount/capital/detail?isAjax=true
        $.ajax({
            url : '/myaccount/capital/detail?isAjax=true',
            type : 'get',
            data : {
                businessType:index,
                startTime: $(".type-data input[data-target=start]").val().replace(/^\s+|\s+$/g,''),
                endTime: $(".type-data input[data-target=last]").val().replace(/^\s+|\s+$/g,''),
                t: Math.random()
            },
            dataType : 'json',
            beforeSend : function(xhr) {
                $(ele).html("<div id='ele-loading' style='height:240px; text-align:center;line-height:240px;'><img src='https://static.souyidai.com/www/images/loading.gif'/>加载中……</div>").show();
            },
            success : function(data) {
                $(ele).find("#ele-loading").hide();            
                for (var i = 0; i < data.data.list.length; i++) {
                    var dataList = data.data.list[i];
                    if(typeof dataList.inAmount == "number" && dataList.inAmount == 0){
                        dataList.inAmountZero = 1;  //如果为0，做特殊处理，模板那边使用
                    }
                    if(!dataList.detailInfoMap){
                        continue;
                    }
                    if(dataList.detailInfoMap.desc.indexOf("定期宝") != -1){
                        dataList.linkHref = "/fb/detail/"+dataList.detailInfoMap.descHref;
                    }else{
                        dataList.linkHref = "/bid/detail/"+dataList.detailInfoMap.descHref;
                    }
                };
                
                //调用模板
                templateFun(data.data)
                //格式化
                addFormat();
                //调用分页函数
                var totalPage = data.data.totalRecords;
                //showPage($("div").find(".paging"),totalPage,pageSize,0,index);
                showPage($("div").find(".paging"),totalPage,pageSize,0,index,"businessType")
            },
            error : function(xhr, type, exception) {
                ele.html("");
            }
        });

    }
});

/*
* 日期格式化
* */
var format = function(time, format){
    var t = new Date(time);
    var tf = function(i){return (i < 10 ? '0' : '') + i};
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){
        switch(a){
            case 'yyyy':
                return tf(t.getFullYear());
                break;
            case 'MM':
                return tf(t.getMonth() + 1);
                break;
            case 'mm':
                return tf(t.getMinutes());
                break;
            case 'dd':
                return tf(t.getDate());
                break;
            case 'HH':
                return tf(t.getHours());
                break;
            case 'ss':
                return tf(t.getSeconds());
                break;
        }
    })
}
////////////////////
/*
*数字金额格式化
* */
var fmoney = function(s)
{
    if(parseInt(s)>=100){
        s = s.toString();
        s = s.substring(0, s.length-2) +"."+ s.substring(s.length, s.length-2);
        var l = s.split(".")[0].split("").reverse(),
            r = s.split(".")[1];
        //console.log(l);
        t = "";
        for(var i= 0;i< l.length;i++){
            t +=l[i] +((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
        }
        return t.split("").reverse().join("")+"."+r;

    }else if(100>parseInt(s) && parseInt(s)>=10){
        return   "0."+s;
    }else{
        return "0.0" + s;
    }
//
}
//var str = "109984";
//console.log(fmoney(str))
////////////////
//alert(format(new Date().getTime(), 'yyyy-MM-dd HH:mm:ss'))
//console.log(format(1405050615000,'yyyy-MM-dd HH:mm'));
function addFormat(){
    for(var i= 0,len = $("#tpl-ul>li").length;i<len;i++){
        var $span = $("#tpl-ul>li").eq(i).find("span");
        var $item = format(parseInt($span.eq(0).html()),'yyyy-MM-dd HH:mm');
        //时间
        $span.eq(0).html($item);
        //收入
        // console.log($span.eq(2).html())
        if($span.eq(2).html() != "&nbsp;"){
            $span.eq(2).html(fmoney($span.eq(2).html()));
        }
        //支出
        if($span.eq(3).html() != "&nbsp;"){
            $span.eq(3).html(fmoney($span.eq(3).html()));
        }
        //余额
        $span.eq(4).html(fmoney($span.eq(4).html()));
        //类型
        if($span.eq(1).html() == ""){
            $span.eq(1).html("&nbsp;")
        };
        //详细
        var details=$span.eq(5).html().replace(/^\s+|\s+$/g,'');
        if($span.eq(5).children().length==0 && details.indexOf('*')!=-1){
            $span.eq(5).html(details.substring(0, details.indexOf(' ')+1) + '尾号' + details.substring(details.lastIndexOf(' ')+1));
        }
       
    }
}

{
/*金额格式化*/
//var str = 8931;
//function fmoney(s, n)
//{
//    n = n > 0 && n <= 20 ? n : 2;
//    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
//    var l = s.split(".")[0].split("").reverse(),
//        r = s.split(".")[1];
//    t = "";
//    for(i = 0; i < l.length; i ++ )
//    {
//        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
//    }
//    return t.split("").reverse().join("") + "." + r;
//}
//console.log(fmoney(str));
}

/*
 * 时间范围
 *最近7天
 * 最近30天
 * 最近90天
 * 最近1年
 * */
$(function(){
    //最近1年
    function getLastYearYestdy(date){
        var strYear = date.getFullYear() - 1;
        var strDay = date.getDate();
        var strMonth = date.getMonth()+1;
        if(strMonth<10)
        {
            strMonth="0"+strMonth;
        }
        if(strDay<10)
        {
            strDay="0"+strDay;
        }
        datastr = strYear+"-"+strMonth+"-"+strDay;
        return datastr;
    }
    //最近几天
    function getlastDays(nowDaty,step){
        //
        var a = new Date(nowDaty);
        a = a.valueOf();
        a = a - step*24*60*60*1000;
        a = new Date(a);
        var m = a.getMonth() + 1;
        if(m.toString().length == 1){
            m = "0"+ m;
        }
        var d = a.getDate();
        if(d.toString().length == 1){
            d = "0" + d;
        }
        return a.getFullYear() + "-" + m + "-" + d;
    }
    var $lastSevent = $(".type-data").find("a[data-type='lastSeven']"),
        $lastThirty = $(".type-data").find("a[data-type='lastThirty']"),
        $lastNinety = $(".type-data").find("a[data-type='lastNinety']"),
        $lastYear = $(".type-data").find("a[data-type='lastYear']");
    var $start = $(".type-data").find("input[data-target='start']");
    var $last = $(".type-data").find("input[data-target='last']");
    var strData = new Date();
    var nowMoth = (strData.getMonth() + 1);
    var nowDate = strData.getDate();
    if(nowMoth<10){
        nowMoth = "0" + nowMoth;
    }
    if(nowDate<10){
        nowDate = "0" + nowDate;
    }
    //var $strNowData = strData.getFullYear() + "-" +(strData.getMonth() + 1) + "-" + strData.getDate();
    var $strNowData = strData.getFullYear() + "-" +nowMoth + "-" + nowDate;

    $lastSevent.click(function(){
        var $data = getlastDays(new Date(),7);
        $start.val($data);
        $last.val($strNowData);
        
        spaceDateAjax($start.val());

    });
    $lastThirty.click(function(){
        var $data = getlastDays(new Date(),30);
        $start.val($data);
        $last.val($strNowData);
         
        spaceDateAjax($start.val());
    });

//        var b = new Date($start.val());
//        var e = new Date($last.val());
//        spaceDateAjax(b.getTime(),e.getTime());

    $lastNinety.click(function(){
       
        var $data = getlastDays(new Date(),90);
        $start.val($data);
        $last.val($strNowData);
        spaceDateAjax($start.val());
    });
    $lastYear.click(function(){
        var $data = getLastYearYestdy(new Date());
        $start.val($data);
        $last.val($strNowData);
        spaceDateAjax($start.val());
    });
    $start[0].onchange = function(){
        starDataAjax($(this).val());
    }
    $last[0].onchange = function(){
        endDataAjax($(this).val());
    }
    ///
    /*starDataAjax*/
    starDataAjax = function(dataTime){
        $.ajax({
            url : '/myaccount/capital/detail?isAjax=true',
            type : 'get',
            data : {
                startTime :dataTime,
                businessType: $(".type-list li.type-list-active a").attr("data-type"),
                t: Math.random()
            },
            dataType : 'json',
            beforeSend : function(xhr) {
                $(ele).html("<div id='ele-loading' style='height:240px; text-align:center;line-height:240px;'><img src='https://static.souyidai.com/www/images/loading.gif'/>加载中……</div>").show();
            },
            success : function(data) {
                $(ele).find("#ele-loading").hide();
                for (var i = 0; i < data.data.list.length; i++) {
                    var dataList = data.data.list[i];
                    if(typeof dataList.inAmount == "number" && dataList.inAmount == 0){
                        dataList.inAmountZero = 1;  //如果为0，做特殊处理，模板那边使用
                    }
                    if(!dataList.detailInfoMap){
                        continue;
                    }
                    if(dataList.detailInfoMap.desc.indexOf("定期宝") != -1){
                        dataList.linkHref = "/fb/detail/"+dataList.detailInfoMap.descHref;
                    }else{
                        dataList.linkHref = "/bid/detail/"+dataList.detailInfoMap.descHref;
                    }
                };
                
                //调用模板
                templateFun(data.data);
                //格式化
                addFormat();
                //调用分页函数
                var totalPage = data.data.totalRecords;
                showPage($("div").find(".paging"),totalPage,pageSize,0,dataTime,"startTime");

            },
            error : function(xhr, type, exception) {
                ele.html("");
            }
        });
    }
    /*endDataAjax*/
    endDataAjax = function(dataTime){
        $.ajax({
            url : '/myaccount/capital/detail?isAjax=true',
            type : 'get',
            data : {
                endTime :dataTime,
                businessType: $(".type-list li.type-list-active a").attr("data-type"),
                t: Math.random()
            },
            dataType : 'json',
            beforeSend : function(xhr) {
                $(ele).html("<div id='ele-loading' style='height:240px; text-align:center;line-height:240px;'><img src='https://static.souyidai.com/www/images/loading.gif'/>加载中……</div>").show();
            },
            success : function(data) {
                $(ele).find("#ele-loading").hide();
                for (var i = 0; i < data.data.list.length; i++) {
                    var dataList = data.data.list[i];
                    if(typeof dataList.inAmount == "number" && dataList.inAmount == 0){
                        dataList.inAmountZero = 1;  //如果为0，做特殊处理，模板那边使用
                    }
                    if(!dataList.detailInfoMap){
                        continue;
                    }
                    if(dataList.detailInfoMap.desc.indexOf("定期宝") != -1){
                        dataList.linkHref = "/fb/detail/"+dataList.detailInfoMap.descHref;
                    }else{
                        dataList.linkHref = "/bid/detail/"+dataList.detailInfoMap.descHref;
                    }
                };
                
                //调用模板
                templateFun(data.data)
                //格式化
                addFormat();
                //调用分页函数
                var totalPage = data.data.totalRecords;
                showPage($("div").find(".paging"),totalPage,pageSize,0,dataTime,"endTime");
            },
            error : function(xhr, type, exception) {
                ele.html("");
            }
        });
    }
    /*dataAjax时间段*/
    spaceDateAjax = function(starTime){
        $.ajax({
            url : '/myaccount/capital/detail?isAjax=true',
            type : 'get',
            data : {
                startTime :starTime,
                businessType: $(".type-list-active").find("a").attr("data-type"),
                t: Math.random()
            },
            dataType : 'json',
            beforeSend : function(xhr) {
                $(ele).html("<div id='ele-loading' style='height:240px; text-align:center;line-height:240px;'><img src='https://static.souyidai.com/www/images/loading.gif'/>加载中……</div>").show();
            },
            success : function(data) {
                $(ele).find("#ele-loading").hide();
                for (var i = 0; i < data.data.list.length; i++) {
                    var dataList = data.data.list[i];
                    if(typeof dataList.inAmount == "number" && dataList.inAmount == 0){
                        dataList.inAmountZero = 1;  //如果为0，做特殊处理，模板那边使用
                    }
                    if(!dataList.detailInfoMap){
                        continue;
                    }
                    if(dataList.detailInfoMap.desc.indexOf("定期宝") != -1){
                        dataList.linkHref = "/fb/detail/"+dataList.detailInfoMap.descHref;
                    }else{
                        dataList.linkHref = "/bid/detail/"+dataList.detailInfoMap.descHref;
                    }
                };

                //调用模板
                templateFun(data.data)
                //格式化
                addFormat();
                //调用分页函数
                var totalPage = data.data.totalRecords;
                showPage($("div").find(".paging"),totalPage,pageSize,0,starTime,"startTime");
            },
            error : function(xhr, type, exception) {
                ele.html("");
            }
        });
    }
    /**/
});

//startTime

////显示分页
/*showPage*/
//showPageTime = function(jq,total,pageSize,currentpage,dataTime,$stepSecond){
//    jq.pagination(total, {
//        'items_per_page' : pageSize,
//        'num_display_entries' : 4,
//        'num_edge_entries' : 3,
//        'current_page' : 0,
//        'prev_text' : "&nbsp;",
//        'next_text' : "&nbsp;",
//        'callback' : pageCallbackTime
//    });
//    $(jq).attr("data-type",dataTime);
//    $(jq).attr("data-time",$stepSecond);
//}
//showPageEndTime = function(jq,total,pageSize,currentpage,dataTime){
//    jq.pagination(total, {
//        'items_per_page' : pageSize,
//        'num_display_entries' : 4,
//        'num_edge_entries' : 3,
//        'current_page' : 0,
//        'prev_text' : "&nbsp;",
//        'next_text' : "&nbsp;",
//        'callback' : pageCallbackEndTime
//    });
//    $(jq).attr("data-type",dataTime);
//}
////分页回调函数(加载分页内容)
/*pageCallback*/
//pageCallbackTime = function (pageNo,jq){
//    var $thisV = $(jq).attr("data-type");
//    var $stepSecond = $(jq).attr("data-time");
//    $.ajax({
//        url:"/myaccount/capital/detail?isAjax=true&"+$stepSecond+"="+$thisV,
//        type:"get",
//        data:{
//            pageNo:pageNo
//        },
//        beforeSend : function(xhr) {
//            $(ele).html("<div id='ele-loading' style='height:240px; text-align:center;line-height:240px;'><img src='https://static.souyidai.com/www/images/loading.gif'/>加载中……</div>").show();
//        },
//        dataType:"json",
//        success:function(data){
//            $(ele).find("#ele-loading").hide();
//            //调用模板
//            templateFun(data.data);
//            //格式化
//            addFormat();
//            //end
//        }
//    });
//
//}
//pageCallbackEndTime = function (pageNo,jq){
//    var $thisV = $(jq).attr("data-type");
//    $.ajax({
//        url:"/myaccount/capital/detail?isAjax=true&endTime="+$thisV,
//        type:"get",
//        data:{
//            pageNo:pageNo
//        },
//        beforeSend : function(xhr) {
//            $(ele).html("<div id='ele-loading' style='height:240px; text-align:center;line-height:240px;'><img src='https://static.souyidai.com/www/images/loading.gif'/>加载中……</div>").show();
//        },
//        dataType:"json",
//        success:function(data){
//            $(ele).find("#ele-loading").hide();
//            //调用模板
//            templateFun(data.data);
//            //格式化
//            addFormat();
//            //end
//        }
//    });
//
//}
//var d = new Date("2014-7-14");
//console.log(d.getTime())















