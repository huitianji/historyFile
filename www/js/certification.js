$(function(){
    //如果相应的radio选中，需要赋值
    $(".ver-simulation").each(function(i,item){
        $(this).closest('.ver-radio-box').find("input").attr("checked",true);
    });
    var hash = location.hash;
    if(hash != "" && !isNaN(parseInt(hash.substring(1)))){
        setStep(hash.substring(1)-1);
    }else{
        //根据当前进行步骤，显示下一个显示模块
        setStep(buildStep);    
    }

    //step:当前步骤；nextStep:下一步
    function setStep(step){
        $("body,html").scrollTop(0);
        var $row = $(".cer-guide-row");

        var nextStep = step;
        if(isRelation != 0){
            $(".cer-guide-step").removeClass('cer-four-columns').addClass('cer-five-columns');
            $row.eq(2).show();
            $(".cer-guide-arrow").eq(2).show();
        }else{
            $(".cer-guide-step").removeClass('cer-five-columns').addClass('cer-four-columns');
            $row.eq(2).hide();
            $(".cer-guide-arrow").eq(2).hide();
            nextStep = nextStep == 2? 3: nextStep;  //没有共贷人 直接到第四步
        }
        nextStep = nextStep >= 4? 3: nextStep;
        $(".cer-list").hide().eq(nextStep).show();
        $row.removeClass('cer-complete-guide-bgcolor').eq(nextStep).show().addClass('cer-complete-guide-bgcolor');
        
        //如果是走到资料上传这一步，且有共贷人信息，需要显示共贷人资料上传的信息
        if(nextStep == 3 && isRelation != 0){
            $(".cer-list").eq(4).show();
            //隐藏第一个下一步按钮
            $(".cer-list").eq(3).find(".ver-div-cols").hide();
        }else{
            $(".cer-list").eq(4).hide();
            //显示第一个下一步按钮
            $(".cer-list").eq(3).find(".ver-div-cols").show();
        }
        //控制是否禁用input
        setSaveBtnStyle(nextStep);
     }
    //绑定每个点击模块事件
    $(".cer-guide-row").not(":last").each(function(i, item){
        $(this).on("click",function(){
            var index = i;
            //指示标控制        
            $(".cer-guide-row").removeClass('cer-complete-guide-bgcolor').eq(index).addClass('cer-complete-guide-bgcolor');
            //模块控制
            $(".cer-list").hide().eq(index).show();
            //如果到了资料上传这一步，且有共贷人信息，需要显示资料上传的信息
            if(index == 3 && isRelation != 0){
                $(".cer-list").eq(4).show();
                //隐藏第一个下一步按钮
                $(".cer-list").eq(3).find(".ver-div-cols").hide();
            }else{
                $(".cer-list").eq(4).hide();
                //显示第一个下一步按钮
                $(".cer-list").eq(3).find(".ver-div-cols").show();
            }
            //控制是否禁用input
            setSaveBtnStyle(index);
        })
    })
    $(".cer-list").find(".btn-one-edit").on("click",function(){
        var $list = $(this).closest(".cer-list").not(":hidden");
        $list.find("input,select").removeClass('ver-input-disabled').attr("disabled",false);
        $list.find(".blue-btn").show();
        $(this).hide();
        //当前婚姻状态显示的话 需要判断添加共贷人
        var $marriage = $list.find("select[name=marriage]");
        if($marriage.length){
            $marriage.trigger("change");
        }
    })

    //判断按钮是否不让提交、是否显示编辑、是否显示下一步
    function setSaveBtnStyle(showStep){
        var $list = $(".cer-list").not(":hidden");
        var $btnDiv = $list.find(".ver-div-cols");
        var $edit = $btnDiv.find(".btn-one-edit");
        var $blue = $btnDiv.find(".blue-btn");
        var $save = $btnDiv.find(".btn-gray-save");
        $btnDiv.find("p").remove();

        var nextStep = (buildStep == 2 && isRelation == 0) ? 3 : buildStep;

        //下一步填写步骤 与 当前显示步骤
        if(showStep == nextStep){
            // 一致
            $list.find("input,select").removeClass('ver-input-disabled').attr("disabled",false);
            $blue.attr("disabled",false).show();
            $save.attr("disabled",false).show();
        }else if(showStep < nextStep){
            // 显示的步骤 已经完成
            $list.find("input,select").addClass('ver-input-disabled').attr("disabled",true);
            if(showStep == 3) {
                //如果完成步骤已经进行到资料上传，则 资料上传的按钮需要放开
                $blue.attr("disabled",false).show();
            }else{
                $save.hide();
                $blue.hide();
                $edit.attr("disabled",false).show();
            }
            
        }else{
            // 显示的步骤 还未完成
            $list.find("input,select").addClass('ver-input-disabled').attr("disabled",true);
            $blue.attr("disabled",true).show();
        }
        //如果是上传资料标签页
        if(showStep == 3){
            isShowPerson();
            isShowCommon();
        }
    }

    //点击到上传资料标签 主贷人资料上传信息联动
    function isShowPerson(){
        var $select = $('select[name="jobType"]');
        var $proposerDiv = $('#personUpload .uploadDiv');
        var $val = globalInfo.jobType;

        $proposerDiv.hide();
        if (globalInfo.jobType != '请选择') {
            var $personNow = null;      //当前显示的 uploadDiv
            var $add_uploadDiv = null;  //当前显示的 uploadDiv 下的非必填项div
            if($val == '工薪族'){
                $personNow = $proposerDiv.eq(0);
                $personNow.show();   
            }else{
                $personNow = $proposerDiv.eq(1);
                $personNow.show();
            }
            $add_uploadDiv = $personNow.find('.cer-upload-infor:eq(1)');
            
            //如果未婚 不显示婚姻证明，其他显示；
            if(globalInfo.marriageStatus == "2"){
                $personNow.find('.person_marriage').hide();
            }else{
                $personNow.find('.person_marriage').show();
            }
            //如果户籍地和居住地不同，居住证明必填显示 ，非必填不显示
            var $province0 = $("select[name='userAddresses.0.provinceId']");
            var $city0 = $("select[name='userAddresses.0.cityId']");
            var $province1 = $("select[name='userAddresses.1.provinceId']");
            var $city1 = $("select[name='userAddresses.1.cityId']");
            if(globalInfo.isSameAddress){
                $personNow.find('.person_live').hide();
                $add_uploadDiv.find('.person_live').show();
            }else{
                $personNow.find('.person_live').show();
                $add_uploadDiv.find('.person_live').hide();
            }

        } else {
            $proposerDiv.eq(0).show();
        }
    }

    //点击到上传资料标签 共贷人资料上传信息联动
    function isShowCommon() {
        var $proposerDiv = $('#commonUpload .uploadDiv');
        var $select = $('select[name="gdrCompanyEx.jobType"]');
        var $val = globalInfo.gdr_jobType;

        $proposerDiv.hide();
        if ($val != '请选择') {
            if($val == '工薪族'){
                $proposerDiv.eq(0).show();   
            }else if($val == '无工作'){
                $proposerDiv.eq(2).show();
            }else{
                $proposerDiv.eq(1).show();
            }
        } else {
            $proposerDiv.eq(0).show();
        }
    }

    $("input[type=text]").each(function(i,item){
        blurFun.call(this);
    })
    var $inputCorpora = $(".input-corpora");
    /*input(blur/focus)*/
    function blurFun() {
        var _this = $(this);
        var data_type = _this.attr("data-type");
        if(data_type == undefined) return;

        if(_this.val() == data_type || _this.val()==""){
            _this.val(data_type).css("color","#ccc");
        }else{
            _this.css("color","#666");
        }
        /*失去焦点删除文本框类（ver-input-visitor）*/
        _this.removeClass("ver-input-visitor");
    }
    function focusFun() {
        var _this = $(this);
        var data_type = _this.attr("data-type");
        if(data_type == undefined) return;

        var $valTrim = _this.val().replace(/\s+/g,"");
        if($valTrim == data_type){
            _this.val("").css("color","#666");
        }
        /*获取焦点添加文本框类（ver-input-visitor）*/
        _this.addClass("ver-input-visitor");
    }
    function inputOverFun(){
        var _this = $(this);
        _this.addClass("ver-input-hover");
    }
    function inputOutFun(){
        var _this = $(this);
        _this.removeClass("ver-input-hover");
    }
    $inputCorpora.find(":input[type='text']").on("blur",blurFun);
    $inputCorpora.find(":input[type='text']").on("focus",focusFun);

    $inputCorpora.find(":input[type='text']").on("mouseenter",inputOverFun);
    $inputCorpora.find(":input[type='text']").on("mouseleave",inputOutFun);
    /*关闭input-closed*/
    var $inputBoxed = $("input[data-input='input-box']");
    var $iClosed = $("i[data-closed='i-closed']");
    $inputBoxed.on("change",function(){
        var _this = $(this);
            _this.parent().find("i").show();
    });
    $iClosed.on("click",function(){
        var _this = $(this);
        var oInput = _this.parent().find("input[data-input='input-box']");
        var newInputVal = oInput.attr("data-type");
        newInputVal = newInputVal.replace(/\s+/g,"");//清除获取值里面的空格
        oInput.val(newInputVal);
        oInput.css("color","#ccc");
        if(oInput.val() == newInputVal){
            _this.hide();
        }else{
            //_this.show();
        }
        oInput.trigger('blur').focus();
    });
    /*单选按钮组*/
    var $radioBox = $("div[data-container='radio-box']");
    var $radioSigle = $radioBox.children();
    $radioSigle.on("click",function(){
        var _this = $(this);
        var index = _this.index();
        _this.parents("div[data-container='radio-box']").children().each(function(){
            var _this = $(this);
            _this.find("span[data-type='radio-img']").removeClass("ver-simulation");
            _this.closest('.ver-radio-box').find("input").attr("checked",false);
        });
        _this.find("span[data-type='radio-img']").addClass("ver-simulation");
        _this.closest('.ver-radio-box').find("input").attr("checked",true);

        //如果是家庭、工作联系人，联系人之间的关系（单选）需要验证
        var iClass = _this.find("span[data-type='radio-img']").hasClass("contact0") || _this.find("span[data-type='radio-img']").hasClass('contact1') || _this.find("span[data-type='radio-img']").hasClass('contact2');
        if(iClass){
            _this.closest('.ver-item').find('input:eq(0)').trigger('blur');
        }
    });
    /*个人信息职业类别联动(工薪、企业)*/
    var $personal_select_change = $("select[data-type='personal-select-change']");
    var $personalDiv = $("div[data-type='personal-professional-category']");
    $personal_select_change.on("change",function(){
        var _this = $(this);
        var $perVal = _this.find("option:selected").text();

        $personalDiv.children().each(function(){
            var _this = $(this);
            _this.hide();
        });
        if( $perVal == "请选择"){
            return;
        }
        if($perVal == "工薪族"){
            $personalDiv.children().eq(0).show();
        }else{
            $personalDiv.children().eq(1).show();
        }
    });
    $personal_select_change.trigger("change");
    /*共贷人信息职业类别联动(工薪、企业)*/
    var $were_select_change = $("select[data-type='were-select-change']");
    var $wereDiv = $("div[data-type='were-professional-category']");
    $were_select_change.on("change",function(){
        var _this = $(this);
        var $wereVal = _this.find("option:selected").text();

        $wereDiv.children().each(function(){
            var _this = $(this);
            _this.hide();
        });
        if( $wereVal == "请选择" || $wereVal =="无工作"){
            return;
        }
        if($wereVal == "工薪族"){
            $wereDiv.children().eq(0).show();
        }else{
            $wereDiv.children().eq(1).show();
        }
    });
    $were_select_change.trigger("change");
    /*个人信息（基本资料-》婚姻状态联动）*/
    var $marriage_select_change = $("select[data-type='marriage-select-change']");
    var $cerFamily = $("div[data-type='cer-family']");
    $cerFamily.each(function(){
        var _this = $(this);
        _this.hide();
    });
    $marriage_select_change.on("change",function(){
        var _this = $(this);
        var $marryVal = _this.find("option:selected").text();
        if($marryVal == "已婚"){
            $cerFamily.show();
        }else{
            $cerFamily.hide();
        }
    });
    $marriage_select_change.trigger("change");

    ///

    
    //婚姻状态为 已婚 -》添加共贷人默认为 配偶，不可改；否则去掉配偶这一项
    $("select[name=marriage]").change(function(ev, isUrl){
        
        var $gdrRelation = $("select[name=gdrRelation]");
        if($(this).val() == "1"){
            $gdrRelation.find("option[value=2]").remove().end().append('<option value="2">配偶</option>');
            $gdrRelation.val("2").attr("disabled", true);
        }else{
            $gdrRelation.find("option[value=2]").remove();
            if(!isUrl) {
                $gdrRelation.attr("disabled",false);
            }
        }
        
    }).trigger('change', true);

    //隐藏和显示提示信息
    function showOrHide(result, errMsg){
        if(result!=""){
            $(this).closest('.ver-item').find('.ver-check-correct').hide();
            $(this).closest('.ver-item').find('.ver-check-error').show().find("span").html(errMsg);
        }else{
            $(this).closest('.ver-item').find('.ver-check-correct').show();
            $(this).closest('.ver-item').find('.ver-check-error').hide();
        }
    }

    //特殊处理的验证 区号、电话号、分机号 
    $(".first_phone,.second_phone,.third_phone").blur(function(){
        if($(this).is(":hidden")) return;
        var $parent = $(this).parent(),
            $first = $parent.find(".first_phone"),
            $second = $parent.find(".second_phone"),
            $third = $parent.find(".third_phone");

        var res_first = validateFun({
            type: ['empty', 'firstPhone'],
            value: $first.val() == $first.attr("data-type") ? "" : $first.val()
        });
        res_first= res_first == "empty" ? "empty_1": res_first;
        var res_second = validateFun({
            type: ['empty', 'secondPhone'],
            value: $(this).val() == $second.attr("data-type") ? "" : $second.val()
        });
        res_second= res_second == "empty" ? "empty_2": res_second;
        var res_third = "";
        if($(this).hasClass("third_phone") && $(this).val()!=""){
            res_third = validateFun({
                type: ['thirdPhone'],
                value: $(this).val() == $(this).attr("data-type") ? "" : $(this).val()
            });
        }
        
        var result = res_first || res_second || res_third ;
        var vMsg = {"empty_1": "请输入区号", "firstPhone": "请输入正确的区号", "empty_2": "请输入电话号码", "secondPhone": "请输入正确的电话号码", "thirdPhone": "请输入正确的分机号"};
        showOrHide.call(this, result, vMsg[result]);
    })

    //特殊处理的验证 省、市、县 、街道
    //在省市县的验证时，需要验证联动的每一个选择框
    $(".sheng,.shi,.xian,.jiedao").blur(function(){
        if($(this).is(":hidden")) return;

        var $parent = $(this).closest('.ver-center');
        var $sheng = $parent.find('.sheng');
        var $shi = $parent.find('.shi');
        // var $xian = $parent.find('.xian');
        var $jiedao = $parent.find('.ver-input');

        var res_sheng = valiBySelect.call($sheng, $.trim($sheng.find("option:checked").text()));
        var res_shi = valiBySelect.call($shi, $.trim($shi.find("option:checked").text()));
        // var res_xian = valiBySelect.call($xian, $.trim($xian.find("option:checked").text()));
        var jiedao_value = $jiedao.val() == $jiedao.attr("data-type") ? "": $jiedao.val();
        var res_jiedao = validateFun({
                                type: ['empty', 'length'],
                                value: jiedao_value,
                                maxlen: 100
                          });
        // var result = res_sheng || res_shi || res_xian;
        var result = res_sheng || res_shi;
        if(result != ""){
            showOrHide.call(this, result, "请选择" + $(this).closest('.ver-item').find('.ver-name').text().replace('*',''));
        }else if(res_jiedao != ""){
            var vMsg = { "empty" : "请填写具体街道地址，具体至单元号", "length" : "请填写正确格式的具体街道地址，具体至单元号" };
            showOrHide.call(this, res_jiedao, vMsg[res_jiedao]);
        }else{
            showOrHide.call(this, "");
        }
    })

    //特殊处理的联动验证 联系人姓名、电话
    $(".vali_name,.vali_mobile").blur(function(){
        if($(this).is(":hidden")) return;
        var $parent = $(this).parent();
        var name = $(this).attr("name");
        var $name = $parent.find(".vali_name");
        var nameVal = $name.val();
        var $mobile = $parent.find(".vali_mobile");
        var mobileVal = $mobile.val();
       
        nameVal = nameVal == $name.attr("data-type") ? "": nameVal;
        mobileVal = mobileVal == $mobile.attr("data-type") ? "": mobileVal;

        //如果是其他联系人，有任何一项填写 需要验证
        if(name == "2.contactName" || name == "2.mobile"){
            if(nameVal == "" && mobileVal == "" && $(this).closest('.ver-item').find('.ver-radio-box input[type=radio][checked=checked]').length == 0){
                showOrHide.call(this, '');
                return; //如果 三项都没填写，则不需要验证
            }
        }

        var res_name = validateFun({
            type: ['empty','length'],
            value: nameVal,
            maxlen: 100
        });
        var res_mobile = validateFun({
            type: ['empty','mobile'],
            value: mobileVal
        });
        var result = res_name || res_mobile;
        var errMsg = $(this).closest('.ver-item').find('.ver-name').text().replace('*','');
        var vMsg = { "empty" : "请输入"+errMsg, "mobile" : "请输入正确的联系电话", "length" : "请输入正确的姓名", "relation": "请选择联系人关系" };
        
        //验证个人信息家庭、工作联系人 关系是否选中
        if(result == ""){
            if($(this).closest('.ver-item').find('.ver-radio-box input[type=radio][checked=checked]').val()){
                result = "";
            }else{
                result = "relation";
            }            
        }

        showOrHide.call(this, result, vMsg[result]);
    })

    //对下拉选择框的验证
    function valiBySelect(value){
        return validateFun({
                    type: ['selCompare'],
                    value: value,
                    compareVal: $.trim($(this).find("option:eq(0)").text())
                });
    }

    //radio验证
    function vilidateToRadio(){
        var $arrRadio = $("input[type=radio]");
        $arrRadio.each(function(i,item){
            var $span = $(this).parent().find("label");
            //如果是隐藏的不验证
            if($span.is(":hidden")){
                return;
            }
            var $radio_box = $(this).closest("div[data-container='radio-box']");
            var $radio_checked = $radio_box.find('input[type=radio][checked=checked]');
            var $radio_item = $radio_box.parent();
            var $msg = '请选择'+$radio_item.find('.ver-name').text().replace('*','');
            if($radio_checked.length == 0){
                $radio_item.find('.ver-check-correct').hide();
                $radio_item.find('.ver-check-error').show().find('span').html($msg);
            }else{
                $radio_item.find('.ver-check-error').hide();
                $radio_item.find('.ver-check-correct').show().find('span').html($msg);
            }
        })
    }

    //点击保存时，某区域做集体验证
    function valiToArea(){
        // vilidateToRadio();
        $(this).closest('.cer-list').find('input,select').blur();
        var errLen = 0, scrollTop = 2000;
        $(this).closest('.cer-list').find('.ver-item .ver-check-error').not(":hidden").each(function(i, item){
            ++errLen;
            if(errLen == 1){
                //记录下第一个错误的位置，定位过去
                scrollTop = $(this).offset().top - 10;
            }
        });

        if(errLen != 0) {
            $("body,html").scrollTop(scrollTop);
            showBtn.call(this);
            return false;
        }

        return true;
    }

    //控件去掉disabled
    function showBtn(){
        $(this).attr("disabled",false).removeClass("gray-btn").addClass("blue-btn").val("保存，下一步");  
    }
    //控件disable
    function disabledBtn(){
        $(this).attr("disabled",true).removeClass("blue-btn").addClass("gray-btn").val("正在提交..."); 
    }

    $("input,select").blur(function(){
        if($(this).is(":hidden")) return;
        //区号、电话号、分机号 联动验证需要特殊处理
        if($(this).hasClass('first_phone') || $(this).hasClass('second_phone') || $(this).hasClass('third_phone')) return;
        //省、市、县、街道 联动验证需要特殊处理
        if($(this).hasClass('sheng') || $(this).hasClass('shi') || $(this).hasClass('xian') || $(this).hasClass('jiedao')) return;
        //家庭联系人、电话 联动验证需要特殊处理
        if($(this).hasClass('vali_name') || $(this).hasClass('vali_mobile')) return;

        var name = $(this).attr("name"),
            $item = $(this).closest('.ver-item'),
            errorMsg = $item.find('.ver-name').text().replace('*',''),
            valiObj = {},
            isOk = false,
            value = $(this).val(),
            data_type = $(this).attr("data-type");
        var reg_clearDot = /\..*$/g,
            reg_money = /(\d)(?=(?:\d{3})+(?:\.\d+)?$)/g,
            reg_date = /\-(\d+)/g,
            reg_empty = /^\s+|\s+$/g,
            reg_all_empty = /\s+/g,
            reg_2point=/(\.\d{2}).*/g;  //清除2位小数后面的数

        if(name == "gdrRelation") return;   //是否添加共贷人 不做验证
        if(data_type == value) value="";

        //数据格式处理
        switch(name){
            case "houseUnitPrice":
            case "_amount":
            case "houseDownpayRate":
            case "houseBankPeriods":
            case "income":
            case "famIncome":
            case "famExpend":
            case "otIncome":
            case "comIncome":
            case "maxLimit":
            case "loanAmount":
            case "monthRepay":
            case "gdrCompanyEx.income":
            case "gdrCompanyEx.otIncome":
            case "gdrCompanyEx.boiComIncome":
            case "shares":
            case "gdrCompanyEx.boiShares":
            case "maxCardAge":
                value = value.replace(reg_clearDot,'').replace(reg_all_empty,'');     //清除小数点尾数
                break;
            //date 格式化 如：2014-1-2 格式修改成 2014-01-02    
            case "joinDate":    
            case "gdrCompanyEx.joinDate":
                value = value.replace(reg_date, function($0, $1){
                    return $1.length == 1 ? "-0"+$1 : $0 ;
                });
                break;
            case "houseArea":
                value = value.replace(reg_2point,function($0,$1){
                  return $1;
                }).replace(reg_all_empty,'');
                break;
            case "cardId":
            case "mobile":
            case "cardNum":
                value = value.replace(reg_all_empty, '');
                break;
        } 
        //如果是逗号隔开的money格式，需要清除逗号后再验证
        value = moneyFormat(0, name, value);

        //校验
        var formatError = "请输入正确的" + errorMsg;
        var emptyError = "请输入" + errorMsg;
        var vMsg = {"empty": emptyError, "selCompare": "请选择"+errorMsg};
        var result = "";
        if($(this)[0].tagName.toLowerCase() === "select"){
            //如果是select 验证是否选择
            result = valiBySelect.call(this, $.trim($(this).find("option:checked").text()));
        }else{
            switch(name){
                case "houseUnitPrice":
                case "_amount":
                case "income":
                case "famExpend":
                case "comIncome":
                case "famIncome":
                case "maxLimit":
                case "loanAmount":
                case "monthRepay":
                case "gdrCompanyEx.income":
                case "gdrCompanyEx.boiComIncome":
                    var vType = ['empty', 'int'];
                    result = validateFun({
                        type: vType,
                        value: value,
                        digit: 10
                    });
                    break;
                case "houseArea":
                    var vType = ['empty', 'decimal'];
                    result = validateFun({
                        type: vType,
                        value: value,
                        digit: 2
                    });
                    break;
                case "houseDownpayRate":
                case "shares":
                case "gdrCompanyEx.boiShares":
                case "maxCardAge":
                    var vType = ['empty', 'int100'];
                    result = validateFun({
                        type: vType,
                        value: value
                    });
                    break;
                case "houseBankPeriods":
                    var vType = ['empty', 'int30'];
                    result = validateFun({
                        type: vType,
                        value: value
                    });
                    break;
                case "cardNum":
                    var vType = ['empty','int'];
                    result = validateFun({
                        type: vType,
                        value: value,
                        digit: 2
                    });
                    break;
                case "name":
                    var vType = ['empty','length'];
                    result = validateFun({
                        type: vType,
                        value: value,
                        maxlen: 15
                    });
                    break;
                case "comName":
                case "title":
                case "department":
                case "address":
                case "comName":
                case "gdrCompanyEx.comName":
                case "gdrCompanyEx.department":
                case "gdrCompanyEx.title":
                case "gdrCompanyEx.address":
                    var vType = ['empty','length'];
                    result = validateFun({
                        type: vType,
                        value: value,
                        maxlen: 100
                    });
                    break;
                case "2.contactName":
                    var vType = ['length'];
                    result = validateFun({
                        type: vType,
                        value: value,
                        maxlen: 100
                    });
                    break;
                case "cardId":
                    var vType = ['empty','id'];
                    result = validateFun({
                        type: vType,
                        value: value
                    });
                    break;
                case "mobile":
                    var vType = ['empty','mobile'];
                    result = validateFun({
                        type: vType,
                        value: value
                    });
                    break;
                case "2.mobile":
                    var vType = ['mobile'];
                    result = validateFun({
                        type: vType,
                        value: value
                    });
                    break;
                case "joinDate":
                case "gdrCompanyEx.joinDate":
                    var vType = ['empty','date'];
                    result = validateFun({
                        type: vType,
                        value: value
                    });
                    break;
            }
        }
        //如果vMsg错误数组中没有定义，则默认显示格式错误的提示
        showOrHide.call(this, result, vMsg[result]? vMsg[result] : formatError);

        //校验成功，需要修改的数据格式
        if(result==""){
            value = moneyFormat(1, name, value);
            value = value == "" ? data_type : value;
            $(this).val(value);
        }
    })
    
    $("input[name=joinDate]").change(function(){
        $(this).trigger("blur");
    })

    //按照逗号隔开的金额处理
    function moneyFormat(type, name, value){
        var reg_money = /(\d)(?=(?:\d{3})+(?:\.\d+)?$)/g;
        switch(name){
            case "houseUnitPrice":
            case "houseArea":
            case "_amount":
            case "income":
            case "famIncome":
            case "famExpend":
            case "otIncome":
            case "comIncome":
            case "maxLimit":
            case "loanAmount":
            case "monthRepay":
            case "gdrCompanyEx.income":
            case "gdrCompanyEx.otIncome":
            case "gdrCompanyEx.boiComIncome":
                if(type == 1){
                    //如果type=1，则需要将money转化成逗号隔开的形式
                    return value.replace(reg_money,'$1,');
                }else{
                    //如果type=0，将money中逗号去掉
                    return value.replace(/,/g,'');
                }
                break;
        }
        return value;
    }
    
    //校验
    function validateFun(valiObj){
        var valiObj= valiObj || {};
        valiObj.type= valiObj.type || [];             //校验类型
        valiObj.value= valiObj.value || "";           //校验值
        valiObj.maxlen= valiObj.maxlen || 0;          //最大长度
        valiObj.compareVal= valiObj.compareVal || "";  //比较值
        valiObj.digit = valiObj.digit || 0;           //校验数字类型的最大长度

        var reg_int = new RegExp('^(' + (valiObj.digit <= 0 ? '0|' : '0|[1-9]\\d{0,' + valiObj.digit + '}') + ')$', 'g'),
            reg_int100 = /^(\d|[1-9]\d|100)$/g,
            reg_int30 = /^(\d|[12]\d|30)$/g,
            reg_empty = /^\s+|\s+$/;
            reg_mobile = /^1[34578][0-9]{9}$/,
            reg_id = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/,
            reg_date = /^[12]\d{3}\-\d{2}\-\d{2}$/g,
            reg_first_phone = /^0(?:[12]\d|\d{3})$/g,
            reg_second_phone = /^[1-9]\d{6,7}$/g,
            reg_third_phone = /^\d{1,10}$/g,
            reg_decimal = new RegExp('^\\d+(\\.\\d{'+ valiObj.digit +'})?$','g'); //验证整数或几位小数

        for (var i = 0; i < valiObj.type.length; i++) {
            var nowType = valiObj.type[i];
            switch(nowType){
                case 'int':
                    if(valiObj.value != "" && !reg_int.test(valiObj.value)){
                        return nowType;
                    }
                    break;
                case 'int100':
                    if(valiObj.value != "" && !reg_int100.test(valiObj.value)){
                        return nowType;
                    }
                    break;
                case 'int30':
                    if(valiObj.value != "" && !reg_int30.test(valiObj.value)){
                        return nowType;
                    }
                    break;
                case 'empty':
                    if(valiObj.value.replace(reg_empty,'') == ""){
                        return nowType;
                    }
                    break;
                case 'mobile':
                    if(valiObj.value != "" && !reg_mobile.test(valiObj.value)){
                        return nowType;
                    }
                    break;
                case "id":
                    if(valiObj.value != "" && !reg_id.test(valiObj.value)){
                        return nowType;
                    }
                    break;
                case "length":
                    if(valiObj.value != "" && !(valiObj.value.length > 0 && valiObj.value.length <= valiObj.maxlen)){
                        return nowType;
                    }
                    break;
                case "selCompare":
                    if(valiObj.value == valiObj.compareVal){
                        return nowType;
                    }
                    break;
                case "date":
                    if(valiObj.value != "" && !reg_date.test(valiObj.value)){
                        return nowType;
                    }
                    break;
                case "firstPhone":
                    if(valiObj.value != "" && !reg_first_phone.test(valiObj.value)){
                        return nowType;
                    }
                    break;
                case "secondPhone":
                    if(valiObj.value != "" && !reg_second_phone.test(valiObj.value)){
                        return nowType;
                    }
                    break;
                case "thirdPhone":
                    if(valiObj.value != "" && !reg_third_phone.test(valiObj.value)){
                        return nowType;
                    }
                    break;
                case "decimal":
                    if(valiObj.value != "" && !reg_decimal.test(valiObj.value)){
                        return nowType;
                    }
                    break;
            }
        };
        
        return "";
    }

    /////提交和保存

    ///btn-one
    $(".btn-one-submit").click(function(){
        btnOneClick.call(this, 1)
    })

    ///type=1；提交 需要验证，否则为 保存，不需要验证
    function btnOneClick(type){    
        disabledBtn.call(this);

        if(type == 1){
            var result = valiToArea.call(this);
            if(!result) return;
        }

        var data = {};
        $(this).closest('.cer-list').find("input,select,textarea").each(function(i) {
            var name = $(this).attr("name");
            var data_type = $(this).attr("data-type");
            
            if (name == undefined) {
                return;
            }
            data[name] = $(this).val();
            //如果值是提示的data-type值 则赋值为空
            data[name] = data[name] == data_type ? "" : data[name];
            //需要把金额类型的值中的逗号去掉
            data[name] = moneyFormat(0, name, data[name]);
        });
        data["loanType"] = $("input[name=loanType]").val();
        data["id"] = $("#bidV").val();

        var othis = this ;
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

                    $("#btn-submit").attr("href", "/borrow/apply/submit?bidId=" + data.data.bidId);
                    $("#bidV").val(data.data.bidId);
                    if(type == 1) {
                        buildStep = buildStep > 1? buildStep : 1;
                        setStepFn.call(othis,1);
                    }

                }else{
                    setSuccessInfo.call(othis,false);
                    showBtn.call(othis);
                }
            },
            error: function(){
                setSuccessInfo.call(othis,false);
                showBtn.call(othis);
            }
        });
    }

    ///btn-two
    $(".btn-two-submit").click(function(){
        btnTwoClick.call(this, 1)
    })
    $(".btn-two-save").click(function(){
        btnTwoClick.call(this, 0)
    });

    ///type=1；提交 需要验证，否则为 保存，不需要验证
    function btnTwoClick(type){       
        disabledBtn.call(this);   

        if(type == 1){
            var result = valiToArea.call(this);
            if(!result) return;
        }

        //个人信息 职业类别：根据职业类别做判断
        var zhiye = "";   
        if($("select[name='jobType']").is(":hidden")==false){
            zhiye = $("select[name='jobType']").val();
        }
        var data = {};
        $(this).closest('.cer-list').find("input,select,textarea").each(function(i) {
            var name = $(this).attr("name");
            var data_type = $(this).attr("data-type");
            var isPersonDiv = $(this).parents("div[data-type='personal-professional-category']").length==0?false:true;
            if(isPersonDiv){
                if(zhiye == 1 && $(this).parents("div[data-type='personal-wage-earners']").length==0){
                    return;
                }else if((zhiye == 2 || zhiye == 3) && $(this).parents("div[data-type='personal-business-soho']").length==0){
                    return;
                }
            }

            if (name == undefined) {
                return;
            }
            if ($(this).attr("type") == "radio") { //获取当前选择的单选按钮值
                data[name] = $(this).closest("div[data-container=radio-box]").find("input[type='radio'][checked=checked]").val();
            } else if(name === "gdrCompanyEx.telephone" || name === "telephone"){
                var tel1 = $(this).val();
                var $tel2 = $(this).parent().find('input:eq(1)');
                var tel2 = $tel2.val() == $tel2.attr("data-type")? "": $tel2.val();
                var $tel3 = $(this).parent().find('input:eq(2)');
                var tel3 = $tel3.val() == $tel3.attr("data-type")? "": $tel3.val();
                tel3 = tel3 == "" ? "": ("-" + tel3);
                data[name] = tel1 + '-' + tel2 + tel3 ;
            }else if(name == "userAddresses.0.county" || name == "userAddresses.1.county" || name == "county" || name == "gdrCompanyEx.county"){
                if($(this).val() == $(this).parent().find("option:eq(0)").text() || $(this).val() == "请选择"){
                    data[name] = '-';
                }else{
                    data[name] = $(this).val();
                }
            }else if(name == "2.type"){
                //如果是其他联系人，如果没有填写，则不需要data[name];
                if($(this).parent().find('.vali_name').val() == ""){
                    return;
                }
                data[name] = $(this).val();
            }else{
                data[name] = $(this).val();
            }
            //如果值是提示的data-type值 则赋值为空
            data[name] = data[name] == data_type ? "" : data[name];
            //需要把金额类型的值中的逗号去掉
            data[name] = moneyFormat(0, name, data[name]);            
        });

        var successLen = 0, //成功的个数，如果2个接口都成功，得到2
            failLen = 0;    //失败的个数，如果有一个接口不成功，则提示失败
        //个人信息提交
       $.ajax({
            url: "/user/baseinfo",
            type: "post",
            data: data,
            dataType: "json",
            success: function(data) {
                if (data.errorCode == 0){
                    successLen++;  
                } else{
                    failLen++;
                }
                successFn();
            }
        });
       //联系人提交
       $.ajax({
            url: "/user/contact",
            type: "post",
            data: data,
            dataType: "json",
            success: function(data) {
                if (data.errorCode == 0){
                    successLen++;  
                } else{
                    failLen++;
                }
                successFn();
            }
        });

       var othis = this;
       //提交成功提示
       function successFn(){
            if(successLen != 2){
                if(failLen != 0 ){
                    showBtn.call(othis);
                    setSuccessInfo.call(othis,false);
                }
                return;
            }

            //如果是保存草稿，则直接提示成功
            if(type == 0)  { setSuccessInfo.call(othis,true); return; }

            //如果是提交，则调用进行到哪一步的接口
            var nextStep = $("select[name=gdrRelation]").val();
            buildStep = buildStep > 2? buildStep : 2;
            isRelation = nextStep;

            //如果当前步骤为 增加共贷人，但修改时 不选择共贷人，需要修改当前步骤
            if(nextStep == 0 && buildStep == 3){
                buildStep = 2;
            }
            resetGlobalToMajor();
            setStepFn.call(othis, 2);
       }

    }

    ///btn-third-submit
    $(".btn-third-submit").click(function(){
        btnThirdClick.call(this, 1)
    })
    $(".btn-third-save").click(function(){
        btnThirdClick.call(this, 0)
    });

    ///type=1；提交 需要验证，否则为 保存，不需要验证
    function btnThirdClick(type){       
        disabledBtn.call(this);

        if(type == 1){
            var result = valiToArea.call(this);
            if(!result) return;
        }

        //共贷人 职业类别：根据职业类别做判断
        var zhiye = ""; 
        if($("select[name='gdrCompanyEx.jobType']").is(":hidden")==false){
            zhiye = $("select[name='gdrCompanyEx.jobType']").val();
        }
        var data = {};
        $(this).closest('.cer-list').find("input,select,textarea").each(function(i) {
            var name = $(this).attr("name");
            var data_type = $(this).attr("data-type");
            var isProfessDiv = $(this).parents("div[data-type='were-professional-category']").length==0?false:true;
            if(isProfessDiv){
                //如果是工薪族，且父级不是工薪族的div里，则不需要拿到数据
                if(zhiye == 1 && $(this).parents("div[data-type='were-wage-earners']").length==0){
                    return;
                }else if((zhiye == 2 || zhiye == 3) && $(this).parents("div[data-type='were-business-soho']").length==0){
                    return;
                }else if(zhiye == 4 && ($(this).parents("div[data-type='were-wage-earners']").length==1 || $(this).parents("div[data-type='were-business-soho']").length==1)){
                    return;
                } 
            }
            
            if (name == undefined || name == "") {
                return;
            }

            if ($(this).attr("type") == "radio") { //获取当前选择的单选按钮值
                data[name] = $(this).closest("div[data-container=radio-box]").find("input[type='radio'][checked=checked]").val();
            } else if(name === "gdrCompanyEx.telephone" || name === "telephone"){
                var tel1 = $(this).val();
                var $tel2 = $(this).parent().find('input:eq(1)');
                var tel2 = $tel2.val() == $tel2.attr("data-type")? "": $tel2.val();
                var $tel3 = $(this).parent().find('input:eq(2)');
                var tel3 = $tel3.val() == $tel3.attr("data-type")? "": $tel3.val();
                tel3 = tel3 == "" ? "": ("-" + tel3);
                data[name] = tel1 + '-' + tel2 + tel3 ;
            }else if(name == "userAddresses.0.county" || name == "userAddresses.1.county" || name == "county" || name == "gdrCompanyEx.county"){
                if($(this).val() == $(this).parent().find("option:eq(0)").text() || $(this).val() == "请选择"){
                    data[name] = '-';
                }else{
                    data[name] = $(this).val();
                }
            }else{
                data[name] = $(this).val();
            }
            //如果值是提示的data-type值 则赋值为空
            data[name] = data[name] == data_type ? "" : data[name];
            //需要把金额类型的值中的逗号去掉
            data[name] = moneyFormat(0, name, data[name]);
        });
        var othis = this;

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
                    if(type == 1) {
                        buildStep = buildStep > 3? buildStep : 3;
                        resetGlobalToGdr();
                        setStepFn.call(othis,3);
                    }else{
                        setSuccessInfo.call(othis,true); 
                        $(othis).removeClass("gray-btn").addClass("blue-btn").val("保存，下一步"); 
                    }

                }else{
                    setSuccessInfo.call(othis,false);
                    showBtn.call(othis);
                }
            },
            error: function(){
                setSuccessInfo.call(othis,false);
                showBtn.call(othis);
            }
        });

    }

    //上传提交
    $(".btn-four-submit,.btn-five-submit").click(function() {    
        disabledBtn.call(this);

        var msg = btnUploadClick();
        if(msg==""){
            buildStep = 4;
            setStepFn.call(this, false , function(){
                window.location.href = "/borrow/sfd_guide";
            });
            
        }else{
            showBtn.call(this);
            var errorMsg = msg == "first_error"? "请上传必要的申请人资料": "请上传必要的共贷人资料";
            setSuccessInfo.call(this, false, errorMsg);
        }
    });
    function btnUploadClick(){
        // return "";  //暂时不校验上传必填
        
        $(".btn-four-submit").parent().find("p").remove();
        $(".btn-five-submit").parent().find("p").remove();
        var $personUpload = $("#personUpload").not(":hidden");
        var $commonUpload = $("#commonUpload").not(":hidden");

        if($personUpload.length && !isRight($personUpload)){
            return "first_error";
        }
        if($commonUpload.length && !isRight($commonUpload)){
            return "second_error";
        }

        //验证必填资料是否都已经上传
        function isRight(othis){
            var $required = othis.find(".uploadDiv").not(":hidden").eq(0).find(".cer-upload-infor").eq(0);
            var needLen = $required.find(".cer-upload-item").not(":hidden").length;
            var nowLen = $required.find("span.cer-upload-success").not(":hidden").length;
            if(needLen != nowLen){
                return false;
            }else{
                return true;
            }
        }

        return "";
    }

    //进入调用进行到哪一步的接口
    function setStepFn(step, afterFn){
        var othis = this;
        $.ajax({
            url: '/borrow/save_loan_step',
            type: 'POST',
            dataType: 'json',
            data: { step : buildStep },
            success: function(data){
                
                if(data.errorCode == 0) {
                    setSuccessInfo.call(othis,true); 
                    $(othis).removeClass("gray-btn").addClass("blue-btn").val("保存，下一步"); 

                    setTimeout(function(){
                        step && setStep(step);
                        afterFn && afterFn();
                    },1000);
                                        
                }else{
                    showBtn.call(othis);
                }
            }
        })
    }

    //保存成功后调用，提示信息
    function setSuccessInfo(isSuccess, msg){
        var html = '<p style="text-align:center;color:#'+(isSuccess?"6CA64E":"EE5930")+';font-size: 20px;height: 30px;font-weight: bold;">'+ (msg? msg : (isSuccess ? "保存成功" : "保存失败")) +'</p>';
        $(this).parent().find("p").remove().end().prepend(html); 
    }

});