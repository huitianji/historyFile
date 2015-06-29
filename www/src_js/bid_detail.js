// 详情页面 玫瑰图
$(function() {
    if ($("#v-graphical-c1").not(":hidden").length == 0) return;

    function getByClass(className) {
        if (document.getElementsByClassName) {
            return document.getElementsByClassName(className);
        } else {
            var arr = [];
            var arrEle = document.getElementsByTagName("*");
            var reg = new RegExp("\\b" + className + "\\b");
            for (var i = 0; i < arrEle.length; i++) {
                if (reg.test(arrEle[i].className)) {
                    arr.push(arrEle[i]);
                }
            };
            return arr;
        }
    }
    var aSuggest = getByClass("v-suggest");
    var oC = document.getElementById("v-graphical-c1");

    var oGC = oC.getContext("2d");
    var aColor = ["#ffb528", "#77b816", "#15b9c3", "#57a2e3", "#ff6803"];
    var $graphical = $(".version-project-graphical");
    var score = $graphical.attr("score") / 10 || 3.5;
    var stableAblity = $graphical.attr("stableAblity") || 60;
    var repayAblity = $graphical.attr("repayAblity") || 60;
    var credit = $graphical.attr("credit") || 60;
    var asset = $graphical.attr("asset") || 60;
    var guarantee = $graphical.attr("guarantee") || 60;
    var aValue = [guarantee, repayAblity, credit, asset, stableAblity];

    for (var i = 0; i < aColor.length; i++) {
        oGC.beginPath();
        oGC.moveTo(205, 205);
        oGC.arc(205, 205, aValue[i] * 2, (-90 + 72 * i) * Math.PI / 180, (-90 + 72 * (i + 1)) * Math.PI / 180, false);
        oGC.fillStyle = oGC.strokeStyle = aColor[i];
        oGC.fill();
        oGC.stroke();
        oGC.closePath();
        //计算文字定位left、top
        var r = aValue[i]; 
        var x = Math.cos( (54- i*72)/180 * Math.PI) * r;
        var y = -Math.sin( (54- i*72)/180 * Math.PI) * r; 
        if(i == 0){
            x += 10;
            y -= 10;
        }
        if(i == 1){
            x += 25;
            y += 10;
        }
        if(i == 2){
            y += 30;
        }
        if(i == 3){
            x -= 25;
            y += 15;
        }
        if(i == 4){
            x -= 20;
            y -= 10;
        }
        aSuggest[i].style.left = 205 + x - 30 + 'px';
        aSuggest[i].style.top = 205 + y - 30 + 'px';
        aSuggest[i].getElementsByTagName("strong")[0].innerHTML = aValue[i];
    };
    for (var i = 0; i < aColor.length; i++) {
        oGC.beginPath();
        oGC.moveTo(205, 205);
        oGC.lineTo(205, 205);
        var x = 205 + Math.cos((18 + 72 * i) / 180 * Math.PI) * 205;
        var y = -Math.sin((18 + 72 * i) / 180 * Math.PI) * 205 + 205;
        oGC.lineTo(x, y);
        oGC.lineWidth = 4;
        oGC.strokeStyle = "#fff";
        oGC.stroke();
        oGC.closePath();
    };

    oGC.beginPath();
    oGC.moveTo(205, 205);
    oGC.arc(205, 205, 52, 0, 360 * Math.PI / 180, false);
    oGC.fillStyle = oGC.strokeStyle = "#fff";
    oGC.fill();
    oGC.stroke();
    oGC.closePath();

    oGC.lineWidth = 1;
    oGC.lineJoin = "round";
    var r = 4,
        R = 8,
        hY = 190,
        color = "#ff7800";
    var count = score;
    var half = count == Math.floor(count) ? false : Math.floor(count);
    for (var i = 0; i < 5; i++) {
        var type = "full";
        if (half) {
            if (i > half) {
                type = "none";
            } else if (i == half) {
                type = "half";
            }
        } else {
            if (i + 1 > count) {
                type = "none";
            }
        }
        drawStar(oGC, r, R, 165 + i * 20, hY, color, type);
    };

    function drawStar(cxt, r, R, x, y, color, type) {
        cxt.beginPath();
        switch (type) {
            case "none":
            case "full":
                cxt.moveTo(Math.cos(18 / 180 * Math.PI) * R + x, -Math.sin(18 / 180 * Math.PI) * R + y);
                for (var i = 0; i < 5; i++) {
                    cxt.lineTo(Math.cos((18 + i * 72) / 180 * Math.PI) * R + x, -Math.sin((18 + i * 72) / 180 * Math.PI) * R + y);
                    cxt.lineTo(Math.cos((54 + i * 72) / 180 * Math.PI) * r + x, -Math.sin((54 + i * 72) / 180 * Math.PI) * r + y);
                };
                if (type == "full") {
                    cxt.fillStyle = color;
                    cxt.fill();
                }
                break;
            case "half":
                cxt.moveTo(Math.cos(90 / 180 * Math.PI) * R + x, -Math.sin(90 / 180 * Math.PI) * R + y);
                //left
                for (var i = 0; i < 3; i++) {
                    cxt.lineTo(Math.cos((90 + i * 72) / 180 * Math.PI) * R + x, -Math.sin((90 + i * 72) / 180 * Math.PI) * R + y);
                    cxt.lineTo(Math.cos((126 + i * 72) / 180 * Math.PI) * r + x, -Math.sin((126 + i * 72) / 180 * Math.PI) * r + y);
                };
                cxt.closePath();
                cxt.fillStyle = color;
                cxt.fill();
                cxt.strokeStyle = color;
                cxt.stroke();

                //right
                cxt.beginPath();
                cxt.moveTo(Math.cos(90 / 180 * Math.PI) * R + x, -Math.sin(90 / 180 * Math.PI) * R + y);

                for (var i = 0; i < 3; i++) {
                    cxt.lineTo(Math.cos((90 - i * 72) / 180 * Math.PI) * R + x, -Math.sin((90 - i * 72) / 180 * Math.PI) * R + y);
                    cxt.lineTo(Math.cos((54 - i * 72) / 180 * Math.PI) * r + x, -Math.sin((54 - i * 72) / 180 * Math.PI) * r + y);
                };
                break;
        }

        cxt.closePath();
        cxt.strokeStyle = color;
        cxt.stroke();
    }

});


$(function() {
    //登录
    $(".version-project-action").on('click',".v-detail-login",function() {
        window.location.href = "https://passport.souyidai.com/?backurl=" + location.href;
    });
    //注册登录
    $(".version-project-not-login a").filter(":even").attr("href", "https://passport.souyidai.com/?backurl=" + location.href)
        .end().filter(":odd").attr("href", "https://passport.souyidai.com/regist.html?backurl=" + location.href);
    //充值                                
    $(".v-btn-deposit").click(function() {
        window.location.href = "/myaccount/capital/deposit";
    })

    //检测并隐藏没有信息的字段
    $("p .version-project-specific-name").each(function() {
        if ($(this).text().replace(/(\s*)/g, "").length == 0) {
            $(this).parent().hide();
        } else if ($(this).text().indexOf("¥") >= 0 && parseInt($(this).text().replace(/[^\d]/g, "")) == 0) {
            $(this).parent().hide();
        } else if ($(this).text().indexOf("岁") > 0 && $(this).text().replace(/[^\d]/g, "").length == 0) {
            $(this).parent().hide();
        }else if ($(this).text().indexOf("null") >= 0 ) {
            $(this).parent().hide();
        }
    });

    //详情页常见问题
    $.get('/fragment/detail_index.json', {}, function(json) {
        //常见问题
        var frequently = template('src_invest/questions', {
            questions: json.frequently_questions
        });
        $(".version-project-com-problem-list ul").html(frequently);

        $(".version-project-com-more a").attr("href", "https://help.souyidai.com/help/faq/detail/");
    }, 'json');

});