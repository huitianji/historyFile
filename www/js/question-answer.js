$(function(){
    var $inputCollection = $("div[data-type='input-collection']");
    /*input(blur/focus)*/
    //_this:当前对象；color:颜色值；cls切换类
    function blurFun(_this,color,cls) {
        //var _this = $(this);
        var $newVal = _this[0].parent;//取值
        if(_this.val() == ""){
            _this.val($newVal);
            //_this.css("color","#ccc");
            _this.css("color",color);
        }
        /*失去焦点删除文本框类（ver-input-visitor）*/
        _this.removeClass(cls);
    }
    function focusFun(_this,color,cls) {
        //var _this = $(this);
        var $val = _this.attr("data-type");
        $val = $val.replace(/\s+/g,"");//清除获取值里面的空格
        var $valTrim = _this.val().replace(/\s+/g,"");
        _this[0].parent = $val;//存值
        if($valTrim == $val){
            _this.val("");
            //_this.css("color","#666");
            _this.css("color",color);
        }
        /*获取焦点添加文本框类（ver-input-visitor）*/
        _this.addClass(cls);
    }
    $inputCollection.find(":input[type='text']").on("blur",function(){
        var _this = $(this);
        blurFun(_this,"#ccc",'answer-seach-input-focus');
    });
    $inputCollection.find(":input[type='text']").on("focus",function(){
        var _this = $(this);
        focusFun(_this,"#666",'answer-seach-input-focus');
    });
    //###
    /*
    * 问答主页->选项卡
    * */
    function eachFun(obj,cls){
        if(cls){
            obj.each(function(){
                var _this = $(this);
                _this.removeClass(cls);
            });
            return;
        }
        obj.each(function(){
            var _this = $(this);
            _this.hide();
        });
    }
    var $questionA = $("div[data-type='question-title']").find("a");
    $questionA.on("click",function(){
        var _this = $(this),
            index = _this.index();
        var nextDiv = _this.parent().next("div").children();
         eachFun(nextDiv);
         eachFun($questionA,"question-visitor");
        _this.addClass("question-visitor");
         nextDiv.eq(index).show();
    });
    var activeTab = $("div[data-type='question-title'] .question-visitor");
    var activeIndex = $questionA.index(activeTab);
    $('.question-box').children().hide();
    $('.question-box').children().eq(activeIndex).show();
    /*
    * */
    $(".btnClose").on("click",function(){
        $("#footerbanner").fadeOut(200);
    });
    //理财问答增加图片banner
    var flickerAPI = "https://help.souyidai.com/element/answer_banner/index.json?jsoncallback=?";
    $.getJSON( flickerAPI, {
        tags: "",
        tagmode: "any",
        format: "jsonp"
    }).done(function( data ) {

    });
 });
var jsonpcallback = function(data){
    var $login_img = $("div[data-type='register-img']");
    if(data.length > 0){
        $login_img.find("a").attr("href",data[0].link);
        $login_img.find("img").attr("src",data[0].picture);
    }
}