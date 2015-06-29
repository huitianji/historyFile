$(function(){
	var $unbind = $("#unbind"),              //未绑定模块
		$start-bind = $("#start-bind"),      //开始绑定模块
		$binded = $("#binded"),              //已绑定模块
		$versionPopup = $(".version-popup"), //以上三个模块公共classname模块
		$version1Mask = $(".version1-mask"); //背景层
	$versionPopup.css({display:"none "});
	$version1Mask.css({display:"none "});
	$("#openInvestFun").on("click",function(){
		//判断是否已绑卡
		$unbind.css({display:"block"});
	});
});