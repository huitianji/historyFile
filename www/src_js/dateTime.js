//new 
var GLOBAL_COUNTDOWN = {isCorrect: false};  //isCorrect 是否校正过，默认没有
//顶部倒计时、 标的列表页、详情页 倒计时
var countDownTimer = null;  //顶部倒计时timer
function investCountDown(){

    //记录需要倒计时的标
    var objectBidCD = {};

    clearTimeout(countDownTimer);
    
    function TimeCountdownFn(options){
        if(!options.opentime) return;
        options.localTime = options.localTime || new Date();
        countDownFn();

        function countDownFn() {
            var spanLocal = (new Date()).getTime() - options.localTime.getTime();   //毫秒数
            var nowTime = new Date(options.serverTime.getTime() + spanLocal);

            diffSecs = (options.opentime_sss - nowTime.getTime()) / 1000;
            var secs = Math.floor(diffSecs % 60);
            secs = secs<10? "0"+secs : secs;
            var mins = Math.floor((diffSecs / 60) % 60);
            mins = mins<10? "0"+mins : mins;
            var hours = Math.floor((diffSecs / 3600) % 24);
            var days = Math.floor((diffSecs / 3600) / 24);
            hours = hours + days * 24;
            hours = hours<10? "0"+hours : hours;

            arrTime = [hours, mins, secs];
            if(isNaN(hours*3600+mins*60+secs*1)){
                options.errorFn && options.errorFn();
                return;
            }

            if(secs == "00" && mins == "00" && hours == "00"){
                options.timerFn = null;
                options.afterFn && options.afterFn(options.opentime_sss);
                
            }else{
                options.timerFn && options.timerFn(arrTime, options.opentime_sss);
                   
                var $strong = $(".version-prompt strong");
                //60秒 重新获取服务器时间，进行校正
                if(hours*3600+mins*60+secs*1 == 60 && !GLOBAL_COUNTDOWN.isCorrect){
                    clearTimeout(countDownTimer);
                    GLOBAL_COUNTDOWN.isCorrect = true;
                    setTimeout(function(){
                        investCountDown();
                    },1000);
                    return;
                }

                objectBidCD[options.opentime_sss].cdTimer = setTimeout(function() {
                    countDownFn();
                }, 1000);
            }
           
        }
     
    }

    /*顶部倒计时 start*/
    var projectTime = {
        time: ["10:30", "14:30", "20:00"],
        serverTime: new Date()
    }
    $.get("/ajax/sysTime?format=yyyy-MM-dd HH:mm:ss:SSS&t="+Math.random(),{},function(data){
        var arrDate = data.split(/-|:|\s/);
        projectTime.serverTime = new Date(arrDate[0],arrDate[1]-1,arrDate[2],arrDate[3],arrDate[4],arrDate[5],arrDate[6]);
        if($(".version-project-button-size[data-countdown=1]").length>0){
            //普通标详情页
            bidDetailCDown(projectTime.serverTime);
        } else if($("div[data-countdown=2]").length>0){
            //定期宝详情页
            sPlanDetailCDown(projectTime.serverTime);
        }else{
            //投资页
            topCountDownFn();
            investCDown(projectTime.serverTime);
        }
    })
    
    projectTime.localTime = new Date();
    
    //顶部计时函数
    function topCountDownFn() {
        var spanLocal = (new Date()).getTime() - projectTime.localTime.getTime();   //本地时间所走的毫秒数
        var nowTime = new Date(projectTime.serverTime.getTime() + spanLocal);
        //根据本地消耗的时间得到服务器当前时间
        var nextTime = new Date(nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate(), nowTime.getHours(), nowTime.getMinutes(), nowTime.getSeconds());
        
        var diffSecs = 0;
        var arrSpan = [];
        for (var i = 0; i < projectTime.time.length; i++) {
            var arrTime = projectTime.time[i].split(':');
            nextTime.setHours(arrTime[0]);
            nextTime.setMinutes(arrTime[1]);
            nextTime.setSeconds(0);
            //如果下个场次的时间 大于 当前时间，则为下一场开标时间
            if (nextTime.getTime() - nowTime.getTime() > 0) {
                break;
            }
        }
        //如果projectTime.time的开标时间都小于当前时间，则下一场开标时间为下一天第一场开标时间
        if (i == projectTime.time.length) {
            setNextDate();
        }
        
        //如果当天是在节假日，需要过滤
        if(codes["holidays"][nextTime.getFullYear()]){
            while(codes["holidays"][nextTime.getFullYear()].indexOf(getFormatTime(nextTime.getMonth()+1)+''+getFormatTime(nextTime.getDate())) != -1){
                setNextDate();
            }    
        }        

        //置为第二天的第一个时间点
        function setNextDate(){
            nextTime.setDate(nextTime.getDate() + 1);
            var arrTime = projectTime.time[0].split(':');
            nextTime.setHours(arrTime[0]);
            nextTime.setMinutes(arrTime[1]);
            nextTime.setSeconds(0);
        }

        diffSecs = (nextTime.getTime() - nowTime.getTime()) / 1000;
        var secs = Math.floor(diffSecs % 60);
        secs = secs<10? "0"+secs : secs;
        var mins = Math.floor((diffSecs / 60) % 60);
        mins = mins<10? "0"+mins : mins;
        var hours = Math.floor((diffSecs / 3600) % 24);
        var days = Math.floor((diffSecs / 3600) / 24);
        hours = hours + days * 24;
        hours = hours<10? "0"+hours : hours;

        arrSpan = [hours, mins, secs];
        var $strong = $(".version-prompt strong");
        //60秒 重新获取服务器时间，进行校正
        if(hours*3600+mins*60+secs*1 == 60 && !GLOBAL_COUNTDOWN.isCorrect){
            GLOBAL_COUNTDOWN.isCorrect = true;
            for(var t in objectBidCD){
                clearTimeout(objectBidCD[t].cdTimer);
            }
            $strong.eq(0).html(arrSpan[0]).end().eq(1).html(arrSpan[1]).end().eq(2).html(arrSpan[2]);
            setTimeout(function(){
                investCountDown();
            },1000);
            return;
        }
        $strong.eq(0).html(arrSpan[0]).end().eq(1).html(arrSpan[1]).end().eq(2).html(arrSpan[2]);
        countDownTimer = setTimeout(function() {
            topCountDownFn();
        }, 1000)

    }
    function getFormatTime(t){
        return t<10 ? '0'+t : t;
    }
    /*倒计时 end*/

    //标的列表页倒计时
    function investCDown(serverTime){
        var timerFn = function(arrTime, opentime_sss){

            var mins = getFormatTime(arrTime[0]*60+arrTime[1]*1),
                seconds = getFormatTime(arrTime[0]*3600+arrTime[1]*60+arrTime[2]*1);

            var arrItem = objectBidCD[opentime_sss].arrBids,
                bidType = objectBidCD[opentime_sss].bidType;
            if(bidType == 1){
                var $show = GLOBAL_COUNTDOWN[opentime_sss],
                    $input = GLOBAL_COUNTDOWN['input'];
                if($show && $input) $input.val(mins+'分'+getFormatTime(arrTime[2]*1)+'秒');
            }
            for (var p = 0; p < arrItem.length; p++) {
                var $obj = arrItem[p];
                switch(bidType){
                    case 1:
                        if(seconds>60) continue;
                        $obj.val(seconds+'秒');
                        break;
                    case 2:
                        $obj.html(arrTime[0] + ":" + arrTime[1] + ":" + arrTime[2] );
                        break;
                }
            };

        }
        var afterFn_splan = function(obj){
            var $prop = obj.closest('.version-limited-proportion');
            var $limited = $prop.closest(".version-invest-limited");
            $limited.addClass('version-invest-full-scale'); 
            $limited.find(".version-limited-icon").remove();
            $prop.find(".version-limited-w190").remove();
            var investHtml = '';
            var rightHtml = '<div class="version-limited-state">
                <table border="0" cellspacing="0" cellpadding="0" class="version-limited-talbe">
                    <tbody>
                    <tr>
                        <td>
                            <span class="version-limited-push-money">'+investHtml+'</span>
                            <span class="version-limited-push-status">申请已结束</span>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>';

            $prop.append(rightHtml);
        }
        var afterFn_common = function(obj, opentime_sss){
            var $obj = obj,
                $show = GLOBAL_COUNTDOWN[opentime_sss],
                $input = GLOBAL_COUNTDOWN['input'];
            if($show && $input) $input.attr("disabled",false).removeClass('version-stop-btn disabled').addClass('version-btn-sureInvest').removeAttr("data-opentime").val("立即投资");
            $obj.val("投资").removeAttr('data-cd data-opentime');
        }
        var afterFn = function(opentime_sss){

            var succFn = function(){
                var arrItem = objectBidCD[opentime_sss].arrBids,
                    bidType = objectBidCD[opentime_sss].bidType;
                for (var j = 0; j < arrItem.length; j++) {
                    var $obj = arrItem[j];
                    switch(bidType){
                        case 1:
                            afterFn_common($obj, opentime_sss);
                            break;
                        case 2:
                            afterFn_splan($obj);
                            break;
                    }
                    
                }
            }

            //请求服务器时间 如果到服务器时间再进行放开投标按钮
            $.get("/ajax/sysTime?format=yyyy-MM-dd HH:mm:ss:SSS&t="+Math.random(),{},function(data){
                var arrDate = data.split(/-|:|\s/);
                var newDate = new Date(arrDate[0],arrDate[1]-1,arrDate[2],arrDate[3],arrDate[4],arrDate[5],arrDate[6]);
                var nSpan = newDate.getTime() - opentime_sss;
                // nSpan = nSpan < 0 ? (Math.abs(nSpan) + 200) : (nSpan > 200) ? nSpan : 200;
                nSpan = nSpan < 0 ? Math.abs(nSpan) : 0;
                setTimeout(succFn, nSpan);     //增加200ms再放开 2015.4.16 去掉200ms
            });

        }
        var errorFn = function(){
            setTimeout(function(){
                window.location.reload();
            },1000);
        }
        //普通标
        $("input[data-cd='countdown']").each(function(i,item){
            var $item = $(item);
            var arrDate = $item.attr('data-bidtime').split(/-|:|\s/),
                opentime = new Date(arrDate[0],arrDate[1]-1,arrDate[2],arrDate[3],arrDate[4],arrDate[5]),
                opentime_sss = opentime.getTime(),
                bid = $item.attr('data-bidid'),
                bidInfo = objectBidCD[opentime_sss];
            if(bidInfo) {
                bidInfo.arrBids.push($item);
            }else{
                objectBidCD[opentime_sss] = {};
                objectBidCD[opentime_sss].arrBids = [$item];
                objectBidCD[opentime_sss].bidType = 1;      //普通标
                GLOBAL_COUNTDOWN[opentime_sss] || (GLOBAL_COUNTDOWN[opentime_sss] = false);  
            }    
        });
        //定期宝
        $(".version-limited-restof[data-cd='countdown']").each(function(i,item){
            var $item = $(item),
                $em = $item.find("em:eq(0)"),
                optime = $item.attr('leftSec')*1000;
            if(isNaN(optime)) return;
            
            //如果存在timeType，说明传过来的是倒计时剩余的毫秒数，需要转变成开标时间（定期宝使用）
            var opentime_sss = serverTime.getTime() + optime,
                bid = $item.attr('data-bidid'),
                bidInfo = objectBidCD[opentime_sss];
            if(bidInfo) {
                bidInfo.arrBids.push($em);
            }else{
                objectBidCD[opentime_sss] = {};
                objectBidCD[opentime_sss].arrBids = [$em];
                objectBidCD[opentime_sss].bidType = 2;      //定期宝
            }
        })
        for(var opentime_sss in objectBidCD){

            var options = {
                opentime_sss: opentime_sss,
                opentime: new Date(opentime_sss),
                serverTime: serverTime,
                localTime: new Date(),
                timerFn: timerFn,
                afterFn: afterFn,
                errorFn: errorFn
            }
            TimeCountdownFn(options);

        }
        
    }

    //标的详情页倒计时
    function bidDetailCDown(serverTime){

        var timerFn = function(arrTime, opentime_sss){

            var mins = getFormatTime(arrTime[0]*60+arrTime[1]*1),
                seconds = getFormatTime(arrTime[0]*3600+arrTime[1]*60+arrTime[2]*1),
                arrItem = objectBidCD[opentime_sss].arrBids;
            for (var p = 0; p < arrItem.length; p++) {
                var $obj = arrItem[p],
                    $show = GLOBAL_COUNTDOWN[opentime_sss],
                    $input = GLOBAL_COUNTDOWN['input'],
                    showTime = mins+'分'+getFormatTime(arrTime[2]*1)+'秒';;
                if($show && $input) $input.val(showTime);
                $obj.val(showTime+"后可以投资");
            };
        }
        var afterFn = function(opentime_sss){

            var succFn = function(){
                if ($.cookie("syd_name") === undefined) {
                    $obj.removeClass('disabled').addClass('v-detail-login').attr("disabled",false).removeAttr("data-bidtime").val("登录后投资");
                }else{
                    var arrItem = objectBidCD[opentime_sss].arrBids;
                    for (var j = 0; j < arrItem.length; j++) {
                        var $obj = arrItem[j],
                            $show = GLOBAL_COUNTDOWN[opentime_sss],
                            $input = GLOBAL_COUNTDOWN['input'];
                        if($show && $input) $input.attr("disabled",false).removeClass('version-stop-btn disabled').addClass('version-btn-sureInvest').val("立即投资");
                        $obj.removeClass('disabled').addClass('v-detail-btnInvest').attr("disabled",false).val("立即投资").removeAttr("data-bidtime");
                    }
                }
            }

            //请求服务器时间 如果到服务器时间再进行放开投标按钮
            $.get("/ajax/sysTime?format=yyyy-MM-dd HH:mm:ss:SSS&t="+Math.random(),{},function(data){
                var arrDate = data.split(/-|:|\s/);
                var newDate = new Date(arrDate[0],arrDate[1]-1,arrDate[2],arrDate[3],arrDate[4],arrDate[5],arrDate[6]);
                var nSpan = newDate.getTime() - opentime_sss;
                // nSpan = nSpan < 0 ? (Math.abs(nSpan) + 200) : (nSpan > 200) ? nSpan : 200;
                nSpan = nSpan < 0 ? Math.abs(nSpan) : 0;
                setTimeout(succFn, nSpan);     //增加200ms再放开 2015.4.16 去掉200ms
            });
        }
        var errorFn = function(){
            setTimeout(function(){
                window.location.reload();
            },1000);
        }

        var $countDown = $(".version-project-button-size[data-countdown=1]");
        if($countDown.length == 1){
            var opentime_sss = parseInt($countDown.attr('data-bidtime')),
                bid = $countDown.attr('data-bidid'),
                bidInfo = objectBidCD[opentime_sss];

            if(bidInfo) {
                bidInfo.arrBids.push($item);
            }else{
                objectBidCD[opentime_sss] = {};
                objectBidCD[opentime_sss].arrBids = [$countDown.find("input:eq(0)")];
                GLOBAL_COUNTDOWN[opentime_sss] || (GLOBAL_COUNTDOWN[opentime_sss] = false);  
            }
            
            var options = {
                opentime_sss: opentime_sss,
                opentime: new Date(opentime_sss),
                serverTime: serverTime,
                localTime: new Date(),
                timerFn: timerFn,
                afterFn: afterFn,
                errorFn: errorFn
            }
            TimeCountdownFn(options);
        }

    }

    //定期宝的详情页倒计时
    function sPlanDetailCDown(serverTime){

        var timerFn = function(arrTime, opentime_sss){

            var mins = getFormatTime(arrTime[0]*60+arrTime[1]*1),
                seconds = getFormatTime(arrTime[0]*3600+arrTime[1]*60+arrTime[2]*1),
                arrItem = objectBidCD[opentime_sss].arrBids;
            for (var p = 0; p < arrItem.length; p++) {
                var $obj = arrItem[p],
                    $show = GLOBAL_COUNTDOWN[opentime_sss],
                    $input = GLOBAL_COUNTDOWN['input'],
                    showTime = mins+'分'+getFormatTime(arrTime[2]*1)+'秒';;
                if($show && $input) $input.val(showTime);
                $obj.val(showTime+"后可以投资");
            };
        }
        var afterFn = function(opentime_sss){

            var succFn = function(){
                if ($.cookie("syd_name") === undefined) {
                    $obj.parent().parent().html('<input type="button" class="version-btn-h30 v-detail-login " value="登录后投资" >');
                }else{
                    var arrItem = objectBidCD[opentime_sss].arrBids;
                    for (var j = 0; j < arrItem.length; j++) {
                        var $obj = arrItem[j],
                            $show = GLOBAL_COUNTDOWN[opentime_sss],
                            $input = GLOBAL_COUNTDOWN['input'];
                        if($show && $input) $input.attr("disabled",false).removeClass('version-stop-btn disabled').addClass('version-btn-sureInvest').val("立即投资");
                        $obj.parent().parent().html('<input type="button" class="version-btn-h30" data-type="btn-finance"  value="立即投资" >');
                    }
                }
            }

            //请求服务器时间 如果到服务器时间再进行放开投标按钮
            $.get("/ajax/sysTime?format=yyyy-MM-dd HH:mm:ss:SSS&t="+Math.random(),{},function(data){
                var arrDate = data.split(/-|:|\s/);
                var newDate = new Date(arrDate[0],arrDate[1]-1,arrDate[2],arrDate[3],arrDate[4],arrDate[5],arrDate[6]);
                var nSpan = newDate.getTime() - opentime_sss;
                nSpan = nSpan < 0 ? Math.abs(nSpan) : 0;
                // nSpan = nSpan < 0 ? (Math.abs(nSpan) + 200) : (nSpan > 200) ? nSpan : 200;
                setTimeout(succFn, nSpan);     //增加200ms再放开 2015.4.16 去掉200ms
            });
        }
        var errorFn = function(){
            setTimeout(function(){
                window.location.reload();
            },1000);
        }

        var $countDown = $("div[data-countdown=2]");
        if($countDown.length == 1){
            var opentime_sss = parseInt($countDown.attr('data-bidtime')),
                bid = $countDown.attr('data-bidid'),
                bidInfo = objectBidCD[opentime_sss];

            if(bidInfo) {
                bidInfo.arrBids.push($item);
            }else{
                objectBidCD[opentime_sss] = {};
                objectBidCD[opentime_sss].arrBids = [$countDown.find("input:eq(0)")];
                GLOBAL_COUNTDOWN[opentime_sss] || (GLOBAL_COUNTDOWN[opentime_sss] = false);  
            }
            
            var options = {
                opentime_sss: opentime_sss,
                opentime: new Date(opentime_sss),
                serverTime: serverTime,
                localTime: new Date(),
                timerFn: timerFn,
                afterFn: afterFn,
                errorFn: errorFn
            }
            TimeCountdownFn(options);
        }

    }

}


$(function() {
    investCountDown();
});
