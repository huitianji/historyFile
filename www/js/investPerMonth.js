$(function(){
	var $unbind = $("#unbind"),              //δ��ģ��
		$start-bind = $("#start-bind"),      //��ʼ��ģ��
		$binded = $("#binded"),              //�Ѱ�ģ��
		$versionPopup = $(".version-popup"), //��������ģ�鹫��classnameģ��
		$version1Mask = $(".version1-mask"); //������
	$versionPopup.css({display:"none "});
	$version1Mask.css({display:"none "});
	$("#openInvestFun").on("click",function(){
		//�ж��Ƿ��Ѱ�
		$unbind.css({display:"block"});
	});
});