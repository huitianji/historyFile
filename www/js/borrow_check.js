var souyidai = new Object();
$(function() {
    ///console.log(uploadJson)
});

//$(function(){
//    $.ajax({
//        url:"https://static.souyidai.com/www/uploadjson.js",
//        type:"get",
////        data:data,
//        beforeSend : function(xhr) {
//            //
//        },
//        dataType:"json",
//        success:function(data){
//            souyidai.uploadJson = data;
//        }
//    });
//});
/*预审测试板*/
$(function() {
    //    var $btnEditor = $(".btn-editor");
    //    $btnEditor.on("click",function(){
    //        var $currentDiv = $(this).parents(".demand-xs").find(".groups-row>div");
    //        if($currentDiv.length){
    //            for(var i= 0,len = $currentDiv.length;i<len;i++){
    //                if($currentDiv.eq(i).css("display") == "block"){
    //                    if($currentDiv.eq(i).find(".form-cs").val() == "undefined"){
    //                        return;
    //                    }
    //                    console.log("ok")
    //                    console.log($currentDiv.eq(i).find(".form-cs").val());
    //                }
    //            }
    //        }
    //    });
});
/*借款申请信息*/
$(function() {
    /**/
    var $buildings = $(".buildings");
    $buildings.trigger('change');
    var selectVal = $('select[name=periods]').val();
    $('select[name=periods]').val(selectVal);
    $buildings.on("change", function() {
        var housename = $(this).find("option:selected").attr("housename");
        var houseProvince = $(this).find("option:selected").attr("province");
        var houseProvinceCode = $(this).find("option:selected").attr("provincecode");
        var houseCity = $(this).find("option:selected").attr("city");
        var houseCityCode = $(this).find("option:selected").attr("citycode");
        $(this).parent().find("input[name=houseName]").val(housename);
        $(this).parent().find("input[name=houseProvince]").val(houseProvince);
        $(this).parent().find("input[name=houseProvinceCode]").val(houseProvinceCode);
        $(this).parent().find("input[name=houseCity]").val(houseCity);
        $(this).parent().find("input[name=houseCityCode]").val(houseCityCode);
        //buildPeriods借款期限
        var index = $(this).find("option:selected").attr("value")
        var $buidLen = buildPeriods[index];
        $(this).parents(".checking").find("select[name=periods]").empty();
        $(this).parents(".checking").find("select[name=periods]").append($("<option/>").text("请选择"));
        for (var i = 0, len = $buidLen.length; i < len; i++) {
            var arr = $buidLen[i];
            for (var key in arr) {
                $(this).parents(".checking").find("select[name=periods]").append($("<option/>").text(arr[key]).attr("value", key));
            }
        }
        //还款方式;repayMode
        if (buildRepayMode == "") {
            return;
        }
        var $buidRepayMode = buildRepayMode[index];
        $(this).parents(".checking").find("input[name=repayMode]").empty();
        $(this).parents(".checking").find("input[name=repayMode]").val($buidRepayMode[0].value);
        $(this).parents(".checking").find("input[name=repayMode]").next('span').text($buidRepayMode[0].name);
        // for (var i = 0, len = $buidRepayMode.length; i < len; i++) {
        //     var arr = $buidRepayMode[i];
        //     for (var key in arr) {
        //         $(this).parents(".checking").find("select[name=repayMode]").append($("<option/>").text(arr[key]).attr("value", key));
        //     }
        // }
    });
    /**/
    var $btn_preserve_one = $(".btn-preserve-one");
    $btn_preserve_one.on("click", function() {
        var self = $(this);
        var $preRow = $(this).parents(".demand-xs").find(".pre-row");
        //        console.log($preRow.find("input[name=title]").val())//purpose

        var data = {}
        $preRow.find("input,select,textarea").each(function(i) {
            if ($(this).attr("name") == undefined) {
                return;
            }
            if ($(this).val() == "请选择") {
                return;
            }
            data[$(this).attr("name")] = $(this).val();
        });

        //console.log(data)
        //
        $.ajax({
            url: "/borrow/apply/saveAjax",
            type: "post",
            data: data,
            beforeSend: function(xhr) {
                //
            },
            dataType: "json",
            success: function(data) {
                if (data.code == 0) {
                    $("#btn-submit").attr("href", "/borrow/apply/submit?bidId=" + data.bidId);
                    $("#bidV").val(data.bidId);
                    alert(data.bidId);
                    checkFormAll();
                }
            }
        });
        //
    });

});

function checkBid() {
    if ($("#bidV").val() == '') {
        alert("请填写借款信息!");
        return false;
    }
}
/*个人信息*/
$(function() {
    var $btnPrePersonal = $(".btn-preserve-personal");
    $btnPrePersonal.on("click", function() {
        var $preRow = $(this).parents(".demand-xs").find(".pre-row");
        var $comData = $(this).parents(".demand-xs").find(".com-data");
        var $currentDiv = $(this).parents(".demand-xs").find(".groups-row>div");
        var data = {};
        $comData.find("input,select,textarea").each(function() {
            if ($(this).attr("name") == undefined) {
                return;
            }
            if ($(this).val() == "请选择") {
                return;
            }
            if ($(this).attr("type") == "radio") { //获取当前选择的单选按钮值
                data[$(this).attr("name")] = $(this).parent().find("input[type='radio']:checked").val();
            } else {
                data[$(this).attr("name")] = $(this).val();
            }
            //data[$(this).attr("name")] = $(this).val();
        });
        if ($currentDiv.length) {
            for (var i = 0, len = $currentDiv.length; i < len; i++) {
                if ($currentDiv.eq(i).css("display") == "block") {
                    //                    console.log($preRow.find("input[name=name]").val())
                    //                    console.log($currentDiv.eq(i).find(".form-cs").val());
                    //telephone/data-type="tel2"
                    var telephone = $currentDiv.eq(i).find("input[name=telephone]").val();
                    var tel2 = $currentDiv.eq(i).find("input[data-type=tel2]").val();
                    var tel3 = $currentDiv.eq(i).find("input[data-type=tel3]").val();
                    telephone = telephone + "-" + tel2 + " " + tel3;
                    $currentDiv.eq(i).find("input,select,textarea").each(function() {
                        if ($(this).attr("name") == undefined) {
                            return;
                        }
                        if ($(this).attr("type") == "radio") { //获取当前选择的单选按钮值
                            data[$(this).attr("name")] = $(this).parent().find("input[type='radio']:checked").val();
                        } else {
                            data[$(this).attr("name")] = $(this).val();
                        }
                        //data[$(this).attr("name")] = $(this).val();
                    });
                    data["telephone"] = telephone;
                    //
                }
            }
        }
        $.ajax({
            url: "/user/baseinfo",
            type: "post",
            data: data,
            beforeSend: function(xhr) {
                //
            },
            dataType: "json",
            success: function(data) {
                if (data.errorCode == 0) {
                    alert(data.data);
                    checkFormAll();
                }
            }
        });
        //
    });
});
//联系人信息btn-preserve-contacts
$(function() {
    var $btnPreserveContacts = $(".btn-preserve-contacts");
    $btnPreserveContacts.on("click", function() {
        var $preRow = $(this).parents(".demand-xs").find(".pre-row");
        var data = {}
        $preRow.find("input,select,textarea").each(function(i) {
            if ($(this).attr("name") == undefined) {
                return;
            }
            if ($(this).val() == "请选择") {
                return;
            }
            if ($(this).attr("type") == "radio") { //获取当前选择的单选按钮值
                data[$(this).attr("name")] = $(this).parent().find("input[type='radio']:checked").val();
            } else {
                data[$(this).attr("name")] = $(this).val();
            }
            //data[$(this).attr("name")] = $(this).val();
        });
        //
        $.ajax({
            url: "/user/contact",
            type: "post",
            data: data,
            beforeSend: function(xhr) {
                //
            },
            dataType: "json",
            success: function(data) {
                if (data.errorCode == 0) {
                    alert(data.data)
                    checkFormAll();
                }
            }
        });
        //
    });
});
//共待人信息btn-preserve-con-person
$(function() {
    var $btnPreserveConPerson = $(".btn-preserve-con-person");
    $btnPreserveConPerson.on("click", function() {
        var $comData = $(this).parents(".demand-xs").find(".com-data");
        var $currentDiv = $(this).parents(".demand-xs").find(".groups-row>div");
        var data = {};
        $comData.find("input,select,textarea").each(function() {
            if ($(this).attr("name") == undefined) {
                return;
            }
            if ($(this).val() == "请选择") {
                return;
            }
            if ($(this).attr("type") == "radio") { //获取当前选择的单选按钮值
                data[$(this).attr("name")] = $(this).parent().find("input[type='radio']:checked").val();
            } else {
                data[$(this).attr("name")] = $(this).val();
            }
            //data[$(this).attr("name")] = $(this).val();
        });
        //
        if ($currentDiv.length) {
            for (var i = 0, len = $currentDiv.length; i < len; i++) {
                if ($currentDiv.eq(i).css("display") == "block") {
                    //                    console.log($preRow.find("input[name=name]").val())
                    //                    console.log($currentDiv.eq(i).find(".form-cs").val());
                    //telephone/data-type="tel2"
                    var telephone = $currentDiv.eq(i).find("input[name='gdrCompanyEx.telephone']").val();
                    var tel2 = $currentDiv.eq(i).find("input[data-type=tel2]").val();
                    var tel3 = $currentDiv.eq(i).find("input[data-type=tel3]").val();
                    if (telephone != undefined) {
                        telephone = telephone + "-" + tel2 + " " + tel3;
                    };
                    //                    console.log(telephone)
                    $currentDiv.eq(i).find("input,select,textarea").each(function() {
                        if ($(this).attr("name") == undefined) {
                            return;
                        }
                        if ($(this).attr("type") == "radio") { //获取当前选择的单选按钮值
                            data[$(this).attr("name")] = $(this).parent().find("input[type='radio']:checked").val();
                        } else {
                            data[$(this).attr("name")] = $(this).val();
                        }
                        //data[$(this).attr("name")] = $(this).val();
                    });
                    //
                    data["gdrCompanyEx.telephone"] = telephone;
                }
            }
        }
        //
        $.ajax({
            url: "/user/gdrinfo",
            type: "post",
            data: data,
            beforeSend: function(xhr) {
                //
            },
            dataType: "json",
            success: function(data) {
                if (data.errorCode == 0) {
                    alert(data.data)
                    checkFormAll();
                }
            }
        });
        //
    });
});


/*预审测试板end*/
/*
 * 联动、申请人上传资料(职业类别)
 * */
$(function() {
    var $select = $(".proposer-select-change");
    var $proposerDiv = $("#proposer>div");
    $select.change(function() {
        var index = $(this).get(0).selectedIndex;
        var $val = $(this).find("option:selected").text();
        //        console.log($(this).find("option").attr("selected",true))
        /*映射职业信息列*/
        var $groupsDiv = $(this).parents(".checking").find(".groups-row>div");
        for (var i = 0, len = $groupsDiv.length; i < len; i++) {
            $groupsDiv.eq(i).hide();
        }
        //        $groupsDiv.eq(index).show();
        if ($val != '请选择') {
            if ($val == "工薪族") {
                $groupsDiv.eq(0).show();
            } else {
                $groupsDiv.eq(1).show();
            }
        }
        /*映射职业信息列end*/
        /*映射申请人上传资料*/
        //        console.log($(this).val())
        //        var $proposerDiv = $("#proposer>div");
        if ($val != '请选择') {
            $('#propserUpload').css('display', 'block');
            for (var i = 0, len = $proposerDiv.length; i < len; i++) {
            $proposerDiv.eq(i).hide();
            }
            $proposerDiv.eq(index-1).show();
        }else{
            $('#propserUpload').css('display', 'none');
        }
        /*映射申请人上传资料end*/
    });
    /*默认选中状态显示*/
    var $default_per = $select.find("option:selected").text();
    var $personal_information_div = $(".personal_information>div");
    $('#propserUpload').css('display', 'none');
    for (var i = 0, len = $personal_information_div.length; i < len; i++) {
        $personal_information_div.eq(i).hide();
    }
    //上传。。
    for (var i = 0, len = $proposerDiv.length; i < len; i++) {
        $proposerDiv.eq(i).hide();
    }
    //
    if ($default_per != '请选择') {
        $('#propserUpload').css('display', 'block');
        if ($default_per == "工薪族") {
            $personal_information_div.eq(0).show();
            $proposerDiv.eq(0).show();
        } else if ($default_per == "企业主") {
            $personal_information_div.eq(1).show();
            $proposerDiv.eq(1).show();
        } else if ($default_per == "个体户") {
            $proposerDiv.eq(2).show();
            $personal_information_div.eq(1).show();
        }
    }
    /*申请人上传默认选中映射*/
});
/*
 * 联动共待人，上传资料
 * */
$(function() {
    var $othersSelect = $(".others-select-change");
    var $proposerDiv = $("#common-people>div");
    $othersSelect.change(function() {
        var index = $(this).get(0).selectedIndex;
        var $val = $(this).find("option:selected").text();
        /*映射职业信息列*/
        var $groupsDiv = $(this).parents(".checking").find(".groups-row>div");
        for (var i = 0, len = $groupsDiv.length; i < len; i++) {
            $groupsDiv.eq(i).hide();
        }
        //$groupsDiv.eq(index).show();
        if ($val != '请选择') {
            if ($val == "工薪族") {
                $groupsDiv.eq(0).show();
            } else if ($val == "无工作") {
                $groupsDiv.eq(2).show();
            } else {
                $groupsDiv.eq(1).show();
            }
        }
        /*映射职业信息列end*/
        /*映射申请人上传资料*/
        //        var $proposerDiv = $("#common-people>div");
        if ($val != '请选择') {
            $('#commonUpload').css('display', 'block');
            for (var i = 0, len = $proposerDiv.length; i < len; i++) {
                $proposerDiv.eq(i).hide();
            }
            $proposerDiv.eq(index-1).show();
            /*映射申请人上传资料end*/
        }else{
            $('#commonUpload').css('display', 'none');
        }
    });
    /*默认选中状态显示*/
    var $default_otherPper = $othersSelect.find("option:selected").text();
    var $there_information_div = $(".there_information>div");
    $('#commonUpload').css('display', 'none');
    for (var i = 0, len = $there_information_div.length; i < len; i++) {
        $there_information_div.eq(i).hide();
    }
    //共待人上传
    for (var i = 0, len = $proposerDiv.length; i < len; i++) {
        $proposerDiv.eq(i).hide();
    }
    if ($default_otherPper != '请选择') {
        $('#commonUpload').css('display', 'block');
        if ($default_otherPper == "工薪族") { //0
            $proposerDiv.eq(0).show();
            $there_information_div.eq(0).show();
        } else if ($default_otherPper == "无工作") { //3
            $proposerDiv.eq(3).show();
            $there_information_div.eq(2).show();
        } else if ($default_otherPper == "企业主") { //1
            $proposerDiv.eq(1).show();
            $there_information_div.eq(1).show();
        } else if ($default_otherPper == "个体户") { //2
            $proposerDiv.eq(2).show();
            $there_information_div.eq(1).show();
        }
    }
});
/*婚姻状态*/
$(function() {
    var $marital_status = $(".marital_status");
    $(".total_others").css("display", "none"); //默认隐藏
    $marital_status.change(function() {
        //console.log($(this).find("option:selected").text())
        //var $val = $(this).val();
        var $val = $(this).find("option:selected").text();
        /*映射共待人资料，共待人上传是否存在*/
        if ($val == "已婚") {
            $(".total_others").css("display", "block");
        } else {
            $(".total_others").css("display", "none");
        }
        /*映射共待人资料，共待人上传,是否存在end*/
        /*婚姻状态提交资料*/
        var index = $(this).get(0).selectedIndex;
        var $marital_status = $(".marital-status");
        for (var i = 0, len = $marital_status.length; i < len; i++) {

            var $newMar = $marital_status.eq(i).children();
            for (var t = 0, lent = $newMar.length; t < lent; t++) {
                $newMar.eq(t).hide();
            }
            $newMar.eq(index).show();
        }
        /*婚姻状态提交资料end*/
    });
    /*设置默认selected（默认选中婚姻）*/
    var $defaultV = $marital_status.find("option:selected").text();
    if ($defaultV == "已婚") {
        $(".total_others").css("display", "block");
    }
});
/*
 *弹窗测试
 * */
var showPopup = function($popupMask, $popup) {
    var $winW = $(window).width(),
        $winH = $(window).height(),
        $dH = $("body").height(),
        $document = $(document).height(),
        $left, $top;
    $popupMask.css({
        "width": $winW + "px",
        "height": $document + "px"
    });
    $left = ($winW - $popup.width()) / 2;
    $top = ($winH - $popup.height()) / 2;
    $popup.css({
        "left": $left + "px",
        "top": $top + $(window).scrollTop() + "px",
        "display": "block"
    });
    $popupMask.show();
}
$(function() {
    //    var $oa = $("#oa");
    //    $oa.on("click",function(){
    //        showPopup($(".popup-mask"),$(".borrow-layer"));
    //    });
    var $mask = $(".popup-mask"),
        $layer = $(".borrow-layer"),
        $content = $("#content"),
        $uploadImg = $("#uploadImg");
    var $proposer = $("#proposer"); //申请人
    var $commonPeople = $("#common-people"); //共贷人
    $layer.on("click", "#btn-closed,.btn-cancel", function() {
        $(this).parents(".borrow-layer").hide();
        $mask.hide();
    });
    //申请人
    $proposer.find(".section-row").on("click", "a", function(e) {
        $content.empty();
        $uploadImg.attr('src', 'https://static.souyidai.com/www/images/uploadpic/DEFAULT.jpg');
        var self = $(this);
        $layer[0].parent = self;
        /*清空(上次选择文件数据)数据*/
        $(".default-format").show();
        $(".upload-format").hide();
        /*清空数据end*/
        hasChildren(self, $mask, $layer); //调用弹窗。。。
        $(".btn-select-file").addClass("proposer-upload");
        $(".btn-select-file").removeClass("commonPeople-upload");
        //var $selectHidden = self.find(".select-hidden>span");

        //        if($selectHidden.length){
        //            $(".single-item").hide();
        //            var $multipleItem = $(".multiple-item");
        //            $multipleItem.show();
        //            $multipleItem.empty();
        //            $multipleItem.append($("<option/>").text("请选择"));
        //            for(var i= 0,len = $selectHidden.length;i<len;i++){
        //                $(".multiple-item").append($("<option/>").text($selectHidden.eq(i).html()));
        //            }
        //            showPopup($mask,$layer);
        //        }else{
        //            $(".single-item").show();
        //            $(".multiple-item").hide();
        //            //传值
        //            $(".single-item").html(self.text());
        //            var $key = self.text();
        //            //console.log($key)
        //            var $newContent = souyidai.uploadJson[$key].content;
        ////            console.log(souyidai.uploadJson['银行开户许可证 ']);
        //           souyidai.cerCol = souyidai.uploadJson[$key].cerCol;
        //            souyidai.cerName = $key;
        //            //console.log(souyidai.cerCol)
        //            $content.html($newContent);
        //            showPopup($mask,$layer);
        //        }

    });
    //共待人
    $commonPeople.find(".section-row").on("click", "a", function(e) {
        $content.empty();
        $uploadImg.attr('src', 'https://static.souyidai.com/www/images/uploadpic/DEFAULT.jpg');
        var self = $(this);
        $layer[0].parent = self;
        /*清空(上次选择文件数据)数据*/
        $(".default-format").show();
        $(".upload-format").hide();
        /*清空数据end*/
        hasChildren(self, $mask, $layer); //调用弹窗...
        $(".btn-select-file").removeClass("proposer-upload");
        $(".btn-select-file").addClass("commonPeople-upload");
    });
    //判断是否有孩子select...
    function hasChildren(self, $mask, $layer) {
        var $selectHidden = self.find(".select-hidden>span");
        if ($selectHidden.length) {
            $(".single-item").hide();
            var $multipleItem = $(".multiple-item");
            $multipleItem.show();
            $multipleItem.empty();
            $multipleItem.append($("<option/>").text("请选择"));
            for (var i = 0, len = $selectHidden.length; i < len; i++) {
                $(".multiple-item").append($("<option/>").text($selectHidden.eq(i).html()));
            }
            //有下拉选项默认选择文件不可点击
            //            $("#btnSelectFile").get(0).setAttribute("disabled",true);
            $("#btnSelectFile").attr("disabled", true);
            $("#btnSelectFile").addClass("btn-default-file-color"); //禁用上传文件按钮
            showPopup($mask, $layer); //调用弹窗
        } else {
            $(".single-item").show();
            $(".multiple-item").hide();
            //传值
            $(".single-item").html(self.text());
            var $key = self.text();
            //console.log($key)
            var $newContent = uploadJson[$key].content;
            var $newImg = 'https://static.souyidai.com/www/images/uploadpic/'+uploadJson[$key].pic+'.jpg';
            //            console.log(souyidai.uploadJson['银行开户许可证 ']);
            souyidai.cerCol = uploadJson[$key].cerCol;
            souyidai.cerName = $key;
            //console.log(souyidai.cerCol)
            $content.html($newContent);
            $uploadImg.attr('src', $newImg);
            //单项-》默认选择文件可点击
            //            $("#btnSelectFile").get(0).removeAttribute("disabled");
            $("#btnSelectFile").attr("disabled", false);
            $("#btnSelectFile").removeClass("btn-default-file-color"); //开启上传文件按钮
            showPopup($mask, $layer); //调用弹窗
        }
    }
    //取消上传的文件
    var $btnUpClosed = $("#btn-close-upload");
    $btnUpClosed.on("click", function() {
        $(this).parent().hide();
        $(this).parent().parent().find(".default-format").show();
        ///
        $(this).parents("body").find("#sydiframe").remove();
        $(this).parents("body").find("#syduploadbox").remove();
        ///
    });
    //弹层下拉菜单
    var $multipleItem = $(".multiple-item");
    $multipleItem.on("change", function() {
        var $selectVal = $(this).find("option:selected").html();
        if ($selectVal == "请选择") {
            $content.empty();
            $uploadImg.attr('src', 'https://static.souyidai.com/www/images/uploadpic/DEFAULT.jpg');
            //$("#btnSelectFile").get(0).setAttribute("disabled",true);
            $("#btnSelectFile").attr("disabled", true);
            $("#btnSelectFile").addClass("btn-default-file-color"); //禁用上传文件按钮
            return;
        }
        if ($selectVal != "") {
            //            $("#btnSelectFile").get(0).removeAttribute("disabled");
            $("#btnSelectFile").attr("disabled", false);
            $("#btnSelectFile").removeClass("btn-default-file-color"); //开启上传文件按钮
        }
        var $newContent = uploadJson[$selectVal].content;
        var $newImg = 'https://static.souyidai.com/www/images/uploadpic/'+uploadJson[$key].pic+'.jpg';
        souyidai.cerCol = uploadJson[$selectVal].cerCol;
        souyidai.cerName = $selectVal;
        $content.html($newContent);
        $uploadImg.attr('src', $newImg);
        //console.log(souyidai.cerCol);
        //console.log($newContent)
    });
    /*补充资料replenish*/
    var $addProposer = $("#add-proposer"); //申请人
    var $addCommonPeople = $("#add-common-people"); //共贷人
    //console.log($proposer.find(".section-row"));
    $addProposer.find(".section-row").on("click", "a", function(e) {

        $content.empty();
        $uploadImg.attr('src', 'https://static.souyidai.com/www/images/uploadpic/DEFAULT.jpg');
        var self = $(this);
        $layer[0].parent = self;
        addFun(self, $mask, $layer);
        $(".btn-select-file").addClass("add-proposer-upload");
        $(".btn-select-file").removeClass("add-commonPeople-upload");
    });
    $addCommonPeople.find(".section-row").on("click", "a", function(e) {
        $content.empty();
        $uploadImg.attr('src', 'https://static.souyidai.com/www/images/uploadpic/DEFAULT.jpg');
        var self = $(this);
        $layer[0].parent = self;
        addFun(self, $mask, $layer);
        $(".btn-select-file").removeClass("add-proposer-upload");
        $(".btn-select-file").addClass("add-commonPeople-upload");
    });

    function addFun(self, $mask, $layer) {
        var $selectHidden = self.find(".select-hidden>span");

        $(".single-item").show();
        $(".multiple-item").hide();
        //传值
        $(".single-item").html(self.text());
        var $key = self.text();
        //console.log($key)
        var $newContent = uploadJson[$key].content;
        var $newImg = 'https://static.souyidai.com/www/images/uploadpic/'+uploadJson[$key].pic+'.jpg';
        //            console.log(souyidai.uploadJson['银行开户许可证 ']);
        souyidai.cerCol = uploadJson[$key].cerCol;
        souyidai.cerName = $key;
        //console.log(souyidai.cerCol)
        $content.html($newContent);
        $uploadImg.attr('src', $newImg);
        showPopup($mask, $layer);

    }
    /*补充资料end*/
});
/*上传*/
$(function() {
    //ajax
    function uploadAjax(url, data) {
        $.upload({
            // 上传地址
            url: url,
            // 文件域名字
            //            fileName: souyidai.filedata,//'filedata',
            // 其他表单数据
            params: data,
            // 上传完成后, 返回json, text
            dataType: 'json',
            // 上传之前回调,return true表示可继续上传
            onSend: function() {
                return true;
            },
            // 上传之后回调
            onComplate: function(data) {
                //                alert(data);
                if (data.errorCode == 0) {
                    var $parents = $(".borrow-layer")[0].parent;
                    $parents.addClass("upload-success");
                    $parents.find("span").addClass("ico-true");

                    $parents.removeClass("upload-failed");
                    $parents.find("span").removeClass("ico-warning");
                } else {
                    var $parents = $(".borrow-layer")[0].parent;
                    $parents.addClass("upload-failed");
                    $parents.find("span").addClass("ico-warning");

                    $parents.removeClass("upload-success");
                    $parents.find("span").removeClass("ico-true");
                }
                checkFormAll();
            }
        });
    }
    //申请人
    $(document).on("click", ".proposer-upload", function() {
        /*移除*/
        $("body").find("#sydiframe").remove();
        $("body").find("#syduploadbox").remove();
        /*移除end*/
        //        console.log(souyidai.cerName);
        //        console.log(souyidai.cerCol);
        var url = "/user/upload",
            data = {
                cerCol: souyidai.cerCol,
                cerName: souyidai.cerName
            };
        uploadAjax(url, data);
    });
    //共贷人commonPeople-upload
    $(document).on("click", ".commonPeople-upload", function() {
        /*移除*/
        $("body").find("#sydiframe").remove();
        $("body").find("#syduploadbox").remove();
        /*移除end*/
        var url = "/user/gdr_upload",
            data = {
                cerCol: souyidai.cerCol,
                cerName: souyidai.cerName
            };
        uploadAjax(url, data);
    });
    //
    $(document).on("click", ".btn-upload", function() {
        //alert($(".borrow-layer")[0].parent.html());
        $("#syduploadbox").submit();
        $(this).parents(".borrow-layer").hide();
        $(this).parents(".borrow-layer").prev().hide();
    });
    /*补充资料*/
    $(document).on("click", ".add-proposer-upload", function() {
        /*移除*/
        $("body").find("#sydiframe").remove();
        $("body").find("#syduploadbox").remove();
        /*移除end*/
        //        console.log(souyidai.cerName);
        //        console.log(souyidai.cerCol);
        var url = "/user/upload",
            data = {
                cerCol: souyidai.cerCol,
                cerName: souyidai.cerName,
                classify: "1"
            };
        //        console.log(data);
        uploadAjax(url, data);
    });
    $(document).on("click", ".add-commonPeople-upload", function() {
        /*移除*/
        $("body").find("#sydiframe").remove();
        $("body").find("#syduploadbox").remove();
        /*移除end*/
        var url = "/user/gdr_upload",
            data = {
                cerCol: souyidai.cerCol,
                cerName: souyidai.cerName,
                classify: "1"
            };
        uploadAjax(url, data);
    });
    /*补充资料end*/
    /*折叠*/
    var $footer = $(".footer"),
        $mainOffsetHeight = $(".main-offsetHeight");
    var fixedToBottom = function($footer, $main, $cls) { //$footer低端导航//$cls添加的类定位低端
            var $wh = $(window).height(),
                $mainH = $main.height(),
                $ftH = $footer.height(),
                $bh = $mainH + $ftH; //整个页面的高度，$("html,body").height();
            if ($mainH > ($wh - $ftH)) {
                $footer.removeClass($cls);
            } else if ($wh > $bh) {
                $footer.addClass($cls);
            }
        }
        /**/
    var $preTrial = $(".pre-trial"); //标题盒子
    var $preRow = $(".pre-row"); //信息列表
    var $editor = $(".editor");
    var flag = 1;
    $preTrial.on("click", function() {
        var self = $(this);
        if (flag == 1) {
            var $newPreRow = self.parent().find(".pre-row");
            if ($newPreRow.css("display") == "none") {
                for (var i = 0, len = $preRow.length; i < len; i++) {
                    $preRow.eq(i).hide();
                    $editor.find("em").html("编辑");
                    $('.unedited').css('display', 'block');
                }
                $newPreRow.show();
                self.find('.unedited').css('display', 'none');
                self.find(".caption-state>a>em").html("保存");
            } else if ($newPreRow.css("display") == "block") {
                $newPreRow.hide();
                self.find(".caption-state>a>em").html("编辑");
            }
            fixedToBottom($footer, $(".main-offsetHeight"), "fixedToBottom");
        }
        flag = 1;
    });
    //编辑、保存按钮
    $editor.on("click", function() {
        flag = 0;
    });
    /*折叠end*/
    /*列表-单个元素提交*/
    //申请借款人ajax
    function singleLoanAjax(data) {
        $.ajax({
            url: "/borrow/apply/saveAjax",
            type: "post",
            data: data,
            beforeSend: function(xhr) {
                //
            },
            dataType: "json",
            success: function(data) {
                if (data.errorCode == 0) {
                    //                    self.parents(".main").find(".btn-borrow-submit").attr("href","/borrow/apply/submit?bidId="+data.data.bidId);
                    //                    $("#bidV").val(data.data.bidId);
                    alert(data.data.bidId);
                    checkFormAll();
                }
            }
        });
    }
    // 个人信息ajax
    function singlePersonalAjax(data) {
        $.ajax({
            url: "/user/baseinfo",
            type: "post",
            data: data,
            beforeSend: function(xhr) {
                //
            },
            dataType: "json",
            success: function(data) {
                if (data.errorCode == 0) {
                    alert(data.data);
                    checkFormAll();
                }
            }
        });
    }
    //联系人信息ajax
    function singleContactAjax(data) {
        $.ajax({
            url: "/user/contact",
            type: "post",
            data: data,
            beforeSend: function(xhr) {
                //
            },
            dataType: "json",
            success: function(data) {
                if (data.errorCode == 0) {
                    alert(data.data);
                    checkFormAll();
                }
            }
        });
    }
    //共待人信息ajax
    function singleTotalOthers(data) {
        $.ajax({
            url: "/user/gdrinfo",
            type: "post",
            data: data,
            beforeSend: function(xhr) {
                //
            },
            dataType: "json",
            success: function(data) {
                if (data.errorCode == 0) {
                    alert(data.data);
                    checkFormAll();
                }
            }
        });
    }
    //借款申请信息
    var newdata = {};
    $("#borrowing-information").on("change", "input,select,textarea", function() {
        newdata = {};
        var self = $(this);
        if ($(this).val() == "请选择") {
            return;
        }
        newdata[self.attr("name")] = self.val();
        //singleLoanAjax(newdata);
    });
    //个人信息
    $("#personal-details").on("change", "input,select,textarea", function() {
        newdata = {};
        var self = $(this);
        if ($(this).val() == "请选择") {
            return;
        }
        newdata[self.attr("name")] = self.val();
        //singlePersonalAjax(newData);
    });
    //联系人信息
    $("#contact-information").on("change", "input,select,textarea", function() {
        newdata = {};
        var self = $(this);
        if ($(this).val() == "请选择") {
            return;
        }
        newdata[self.attr("name")] = self.val();
        //singleContactAjax(newData);
    });
    /*end*/
    //共待人信息
    $("#total-others").on("change", "input,select,textarea", function() {
        newdata = {};
        var self = $(this);
        if ($(this).val() == "请选择") {
            return;
        }
        newdata[self.attr("name")] = self.val();
        //singleTotalOthers(newData);
    });
});
$(function() {
    //格式化数字
    /**
	$(".sum-money").each(function(index, el) {
        this.text = $(this).val();
        $(el).val(this.text.replace(/(\d)(?=(?:\d{3})+(?:\.\d+)?$)/g, "$1,"));
    });

    $(".sum-money").focus(function() {
        if (typeof(this.text) != "undefined") {
            $(this).val(this.text);
        }
    });
    **/
    //$(".sum-money").blur(function() {
        //checkText($(this));
    //    var tmp = this.text;
    //    this.text = $(this).val();
      //  this.text = this.text.replace(/^0+(\d+.*)/g, "$1");
       // this.text = this.text.replace(/(\.\d)\d*/g, "$1");
     //   this.text = this.text.replace(/(\d+)\.$/g, "$1");
    //    $(this).val(this.text.replace(/(\d)(?=(?:\d{3})+(?:\.\d+)?$)/g, "$1,"));
    //});
	
    $('input,select,textarea').blur(function(event) {
        var errorBox = $(this).closest('.fild-group').children('.error-box:eq(0)');
        var inputText = $(this).val();
        var inputName = this.getAttribute('name');
        var id = $(this).closest('.fild-group').children('label').text();
        errorBox.find('.ico-ok').css('display', 'block');
        errorBox.find('.error-meg').css('display', 'none');

        if (inputText == '') {
            errorBox.find('.error-meg').css('display', 'block');
            errorBox.find('.error-receive').text('请填写' + id).show();
        };
        if (inputText == '请选择') {
            errorBox.find('.error-meg').css('display', 'block');
            errorBox.find('.error-receive').text('请选择' + id).show();
        };
        if (inputName == 'name') {
            var nregex = /^[\u4E00-\u9FA5]{2,10}$/;
            if (!nregex.test(inputText)) {
                errorBox.find('.error-meg').css('display', 'block');
                errorBox.find('.error-receive').text('请填写真实姓名').show();
            };
        };
        if (inputName == 'mobile') {
            var pregex = /^1[34578][0-9]{9}$/;
            if (!pregex.test(inputText)) {
                errorBox.find('.error-meg').css('display', 'block');
                errorBox.find('.error-receive').text('请填写正确的手机号').show();
            };
        };
        if (inputName == 'cardId') {
            var idregex = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/;
            if (!idregex.test(inputText)) {
                errorBox.find('.error-meg').css('display', 'block');
                errorBox.find('.error-receive').text('请填写有效的身份证号').show();
            };
        };
    });
    var firstLoad = $('#bidV').val();
    if (firstLoad != '') {
        checkFormAll();
    };
});
var checkFormAll = function() {
    var checkResult = [];
    var submitStatus = true;
    checkResult[0] = checkFormbyId('borrowing-information');
    checkResult[1] = checkFormbyId('personal-details');
    checkResult[2] = checkFormbyId('contact-information');
    checkResult[3] = chekcUploadFormbyId('propserUpload');
    if ($('#common-info').css('display') != 'none') {
        checkResult[4] = checkFormbyId('common-info');
        checkResult[5] = chekcUploadFormbyId('commonUpload');
    };
    for (var i = 0; i < checkResult.length; i++) {
        if (!checkResult[i]) {
            submitStatus = false;
        }
    };
    if (submitStatus) {
        $('#btn-submit').removeClass('btn-disabled');
    }
}
var checkFormbyId = function(formId) {
    var isComplete = true;
    $('#' + formId + ' input:text[type!=hidden]').each(function(index, el) {
        var errorBox = $(el).closest('.fild-group').children('.error-box:eq(0)');
        var id = $(el).closest('.fild-group').children('label').text();
        if ($(el).val() == '') {
            errorBox.find('.error-meg').css('display', 'block');
            errorBox.find('.error-receive').text('请填写' + id).show();
            isComplete = false;
        } else {
            errorBox.find('.ico-ok').css('display', 'block');
            errorBox.find('.error-meg').css('display', 'none');
        }
    });
    $('#' + formId + ' input:radio[type!=hidden]').each(function(index, el) {
        var errorBox = $(el).closest('.fild-group').children('.error-box:eq(0)');
        var id = $(el).closest('.fild-group').children('label').text();
        var name = el.getAttribute('name');
        if ($('[name=\"' + name + '\"]:checked').val() == undefined) {
            errorBox.find('.error-meg').css('display', 'block');
            errorBox.find('.error-receive').text('请填写' + id).show();
            isComplete = false;
        } else {
            errorBox.find('.ico-ok').css('display', 'block');
            errorBox.find('.error-meg').css('display', 'none');
        }
    });
    $('#' + formId + ' select[type!=hidden]').each(function(index, el) {
        var errorBox = $(el).closest('.fild-group').children('.error-box:eq(0)');
        var id = $(el).closest('.fild-group').children('label').text();
        if ($(el).val() == '请选择') {
            errorBox.find('.error-meg').css('display', 'block');
            errorBox.find('.error-receive').text('请选择' + id).show();
            isComplete = false;
        } else {
            errorBox.find('.ico-ok').css('display', 'block');
            errorBox.find('.error-meg').css('display', 'none');
        }
    });
    $('#' + formId + ' textarea[type!=hidden]').each(function(index, el) {
        var errorBox = $(el).closest('.fild-group').children('.error-box:eq(0)');
        var id = $(el).closest('.fild-group').children('label').text();
        if ($(el).val() == '') {
            errorBox.find('.error-meg').css('display', 'block');
            errorBox.find('.error-receive').text('请填写' + id).show();
            isComplete = false;
        } else {
            errorBox.find('.ico-ok').css('display', 'block');
            errorBox.find('.error-meg').css('display', 'none');
        }
    });
    if (isComplete) {
        $('#' + formId + ' .unedited').text('已完成');
        $('#' + formId + ' .unedited').css('color', 'green');
    };
    return isComplete;
}
var chekcUploadFormbyId = function(formId) {
    var isComplete = true;
    var activeDiv = '';
    var divLengh = $('#' + formId + ' .pre-row>div').length;
    $('#' + formId + ' .pre-row>div').each(function(index, el) {
        if ($(el).css('display') == 'block') {
            activeDiv = $(el);
        };
    });
    activeDiv.find('.section-row').each(function(index, el) {
        if (divLengh == index + 1) {
            return false;
        };
        $(el).find('a').each(function(index, el) {
            if (!$(el).hasClass('upload-success')) {
                isComplete = false;
            }
        });
    });
    if (isComplete) {
        $('#' + formId + ' .unedited').text('已完成');
        $('#' + formId + ' .unedited').css('color', 'green');
    };
    return isComplete;
}