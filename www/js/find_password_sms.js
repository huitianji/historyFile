$(function(){
    //倒计时函数
//    function time(o,wTime){
//        if(wTime ==0){
//            //o.removeAttribute("disabled");
//            $(o).attr("disabled",false);
////            o.value = "点击获取";
//            $(o).val("点击获取");
//            $(o).removeClass("btn-disabled");
//        }else{
////            o.setAttribute("disabled",true);
//            $(o).attr("disabled",true);
//            $(o).addClass("btn-disabled");
////            o.value = "重新发送(" + wTime + ")";
//            $(o).val("重新发送(" + wTime + ")");
//            wTime --;
//            setTimeout(function(){time($(o),wTime)},1000)
//        }
//    }

    //
    $("input").blur(function(){
        var $parents = $(this).parents(".fild-group");
        $parents.find(".error-meg").addClass("onError");//添加错误
        var $value = $.trim(this.value);
        if($(this).is("#username")){
            if($value != ""){
                $parents.find(".error-meg").removeClass("onError");//清除错误
            }
        }
        if($(this).is("#smscode")){
            if($value == ""){
                $parents.find(".error-meg").show();
                $parents.find(".error-receive").html("验证码不能为空");
                $(this).addClass("error-border");
            }else{
                $parents.find(".error-meg").hide();
                $(this).removeClass("error-border");
                $parents.find(".error-meg").removeClass("onError");//清除错误
            }
        }
//        if($(this).is("#sendCode")){
//            /*执行发送验证码函数*/
//            var self = $(this);
//            var $btnClickCode = $("#sendCode");
//            $btnClickCode.attr("disabled",false);
//            self.on("click",function(){
//                var $telVal = $("#smscode").val();
//                console.log("ok")
////                $.ajax({
////                    url: "/regist/sendSms?username="+$telVal,
////                    type:"get",
////                    async: false,
////                    dataType:'json',
////                    success: function(data){
////                        if(data.errorCode ==0){
////                            setTimeout(function(){time($btnClickCode,data.data.needWaitTime)},1000);
////                        }else{
////                            console.log(data.errorMessage);
////                        }
////                    }
////                });
//            });
//        }
    });



    var findPsdSubmit = function(){
        $.ajax({
            url:'/password/validatorsms',
            data:{
                smscode: $('#smscode').val(),
                username: $('#username').val()
            },
            type:'POST',
            dataType:'json',
            success: function(data){
                if(data.errorCode == 301){
                    window.location.href = data.errorMessage;
                    return;
                }
                if(!data.errorCode){
                    window.location.href = '/password/validator';
                }else{
                    $('.login-msg').show();
                    $('.login-msg span.error-receive').text(data.errorMessage);
                }
            }
        });
    }

    $(".btn-reg").on("click",function(){
        $("#findPsdForm :input.required").trigger("blur");
        var $onError = $("#findPsdForm .onError").length;
        if($onError){
            return false;
        }
        findPsdSubmit();
    });





    var $errorRec = $(".add_error_box").find(".error-receive");
    if($errorRec.html() != ""){
        $(".add_error_box").css("display","block")
    }
});














