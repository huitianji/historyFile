$(function(){ 
	
	Handlebars.registerHelper("withdrawStatusDesc", function(withdrawStatus) {
		if(withdrawStatus == 0) { 
			return "处理中";
		} else if (withdrawStatus == 1) { 
			return "提现成功";
		} else { 
			return "提现失败";
		}
	});
	
	var ele = $("#withdraw-detail-main");
	
	var $tpl = $("#tpl");
	function templateFun(data){
	    var source   =  $tpl.html();
	    var template = Handlebars.compile(source);
	    var html = template(data);
	    return html;
	}
	
    var $lastSevent = $(".type-data").find("a[data-type='lastSeven']");
    var $lastThirty = $(".type-data").find("a[data-type='lastThirty']");
    var $lastNinety = $(".type-data").find("a[data-type='lastNinety']");
    var $lastYear = $(".type-data").find("a[data-type='lastYear']");
	var $start = $(".type-data").find("input[data-target='start']");
	var $last = $(".type-data").find("input[data-target='last']");	
	
    var strData = new Date();
    var $strNowData = strData.getFullYear() + "-" +(strData.getMonth() + 1) + "-" + strData.getDate();	
	
    $lastSevent.click(function(){
        var $data = getlastDays(new Date(),7);
        $start.val($data);
        $last.val($strNowData);
        starDataAjax($start.val(),$last.val());
    });
    
    $lastThirty.click(function(){
        var $data = getlastDays(new Date(),30);
        $start.val($data);
        $last.val($strNowData);
        starDataAjax($start.val(),$last.val());
    });	
    
    $lastNinety.click(function(){
        var $data = getlastDays(new Date(),90);
        $start.val($data);
        $last.val($strNowData);
        starDataAjax($start.val(),$last.val());
    });
    
    $lastYear.click(function(){
        var $data = getLastYearYestdy(new Date());
        $start.val($data);
        $last.val($strNowData);
        starDataAjax($start.val(),$last.val());
    });    
	
    
    $start[0].onchange = function(){
    	var dateLast = $(".type-data").find("input[data-target='last']").val();
    	starDataAjax($(this).val() , dateLast);
    };
    
    $last[0].onchange = function(){
    	var dateStart = $(".type-data").find("input[data-target='start']").val();
    	starDataAjax(dateStart,$(this).val());
    };   
    
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
 
    starDataAjax = function(startDate,endDate){
        $.ajax({
            url : '/myaccount/capital/withdraw?isAjax=true',
            type : 'get',
            data : {
                startTime :startDate,
                endTime: endDate
            },
            dataType : 'json',
            beforeSend : function(xhr) {
                ele.html("<div id='ele-loading' style='height:240px; text-align:center;line-height:240px;'><img src='https://static.souyidai.com/www/images/loading.gif'/>加载中……</div>").show();
            },
            success : function(data) {
                ele.find("#ele-loading").hide();
                var html = templateFun(data.data);
                ele.html(html);
                showPagination($("#pagination_b"), data.totalRecords, 10);
            },
            error : function(xhr, type, exception) {
                ele.html("");
            }
        });
    };
    
    function showPagination(jq, total, pageSize) {
    	if (total <= pageSize) {
    		return false;
    	}
    	jq.pagination(total, {
    		'items_per_page' : pageSize,
    		'num_display_entries' : 4,
    		'num_edge_entries' : 2,
    		'current_page' : 0,
    		'link_to' : 'javascript:void(0);',
    		'prev_text' : "&nbsp;",
    		'next_text' : "&nbsp;",
    		'callback' : pagedCallback
    	});
    }
    
    function pagedCallback(index, jq) {
    	
    	var url = "/myaccount/capital/withdraw?isAjax=true"; 
    	var startDate = $start.val();
    	var endDate = $last.val();
    	
    	$.ajax({
    		url : url,
    		type : 'get',
    		data : {
    			"pageNo" : (index + 1) ,
    			"startTime": startDate,
    			"endTime": endDate
    		},
    		dataType : 'json',
    		beforeSend : function(xhr) {
    			ele.html("<div id='ele-loading' style='height:240px; text-align:center;line-height:240px;'><img src='https://static.souyidai.com/www/images/loading.gif'/>加载中……</div>").show();
    		},
    		success : function(data) {
                ele.find("#ele-loading").hide();
                var html = templateFun(data.data);
                ele.html(html);
                showPagination($("#pagination_b"), data.totalRecords, 10);
    		},
    		error : function(xhr, type, exception) {
    			ele.html("");
    		}
    	});
    }    
    
});
