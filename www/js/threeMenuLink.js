$(function(){
    function threeMenuLink($province,$city,$district){
        //var url = "/c/province";
//        $.getJSON(url,function(data){
//            var data = data.data;
//            $(data).each(function(i){
//                $province.append($("<option/>").text($(this)[0].name).attr("value",$(this)[0].code));
//            });
//            //console.log(data.data[0].name);
//        });
        $(areaCode.PROVINCE).each(function(i){
            $province.append($("<option/>").text($(this)[0].name).attr("value",$(this)[0].code));
        });
        //一级联动二级菜单
        $province.on("change",function(){
            $city.empty();
            $city.append($("<option/>").text("-请选择城市-").attr("value","-1"));
            if($(this).val() == "province"){
                var $proviceCode = -1;
            }
            if($(this).val() != "province"){
                var $proviceCode = $(this).val();
            }
            var url = "/c/city?province=" + $proviceCode;
//            $.getJSON(url,function(data){
//                var data = data.data;
//                $(data).each(function(i){
//                    $city.append($("<option/>").text($(this)[0].name).attr("value",$(this)[0].code));
//                });
//            });
            var data = areaCode.CITY[$proviceCode];
            $(data).each(function(i){
                $city.append($("<option/>").text($(this)[0].name).attr("value",$(this)[0].code));
            });
            //console.log(url);
        });
        //二级联动三级菜单
        $city.on("change",function(){
            $district.empty();
            $district.append($("<option/>").text("-请选择区县-").attr("value","-1"));
            //if($(this).val() != "-1"){
                var $cityCode = $(this).val();
           // }
//            var url = "/c/county?city=" + $cityCode;
//            $.getJSON(url,function(data){
//                var data = data.data;
//                $(data).each(function(i){
//                    $district.append($("<option/>").text($(this)[0].name).attr("value",$(this)[0].code));
//                });
//            });
            var data=areaCode.COUNTY[$cityCode];
            $(data).each(function(i){
                $district.append($("<option/>").text($(this)[0].name).attr("value",$(this)[0].code));
            });
            //console.log(url);
        });
    }

    var $threeMenuLine = $(".threeMenuLine");
    for(var i=0,len = $threeMenuLine.length;i<len;i++){
        var index = $(this).index();
        (function(i){
            var $sheng = $threeMenuLine.eq(i).find(".sheng");
            var $shi = $threeMenuLine.eq(i).find(".shi");
            var $xian = $threeMenuLine.eq(i).find(".xian");
            threeMenuLink($sheng,$shi,$xian);
            changePassValue($sheng,$shi,$xian)
        })(i)
    }
    //

    function change($self){
        var $input = $self.parent().find("input");
        var $optionText = $self.find("option:selected").html();
        $input.attr("value",$optionText);
    };
    function changePassValue($province,$city,$district){
        $province.on("change",function(){
            var self = $(this);
            var $hideInput= self.parents(".threeMenuLine").find("input[data-type='opt']");
            for(var t=0,len=$hideInput.length;t<len;t++){
                $hideInput.eq(t).attr("value","");
            }
            change(self);
        });
        $city.on("change",function(){
            var self = $(this);
            change(self);
        });
        $district.on("change",function(){
            var self = $(this);
            change(self);
        });
    }
});