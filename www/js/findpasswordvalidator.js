$(document).ready(function(){
	$('#changeEmail').click(function(){
		$(this).hide();
		if(window.question){
			$('#changeMibao').show();
		}else{
			$('#changeMibao').hide();
		}
		$('#mibaomail').show();
		$('#mibaoquestion').hide();
		$('#mibaoanswer').hide();
		$('#mibaotijiao').text('去邮箱验证');
	});

	$('#changeMibao').click(function(){
		$(this).hide();
		if(window.email){
			$('#changeEmail').show();
		}else{
			$('#changeEmail').hide();
		}
		$('#mibaoquestion').show();
		$('#mibaoanswer').show();
		$('#mibaomail').hide();
		$('#mibaotijiao').text('提交验证');
	});

	//根据状态隐藏对应输入框
	if(window.question){
		$('#changeMibao').click();
	}else if(window.email){
		$('#changeEmail').click();
	}

	var validateSecurQuestion = function(){
		$.ajax({
			url: '/password/find_password_mibao',
			data:{
				qid: $('#selectId').val(),
				answer: $('#mibaoanswer input').val()
			},
			type:'POST',
			dataType:'json',
			success:function(data){
				if (data.errorCode == 302) {
					window.location.href = data.errorMessage;
					return;
				}
				if (!data.errorCode) {
					window.location.reload();
				} else {
					$('#qTip').text(data.errorMessage);
					$('#mibaoanswer .error-meg').show();
				}
			}
		});
	}

	$('#mibaotijiao').click(function(){
		var val = $('#mibaoanswer input').val();
		if(!val){
			$('#qTip').text('请输入答案');
			$('#mibaoanswer .error-meg').show();
			return;
		}
		validateSecurQuestion();
	});

	$('#id5form').validate({
		rules:{
			realname:{
				minlength:2,
				maxlength:25,
				required:true
			},
			id5string:{
				minlength: 18,
				maxlength: 18,
				required: true
			}
		},
		errorPlacement: function(error, element){
			if(element.is('#realname')){
				element.parents('.fild-group').find('.error-meg span').text('请输入正确的姓名');
			};
			if(element.is('#id5string')){
				element.parents('.fild-group').find('.error-meg span').text('请输入正确的身份证号');
			}
			element.parents('.fild-group').find('.error-meg').show();
		},
		success:function(label,element){
			$(element).parents('.fild-group').find('.error-meg').hide();
		}
	});

	var id5validatorSubmit = function(){
		$.ajax({
			url: '/password/find_password_id5',
			type: 'POST',
			dataType: 'json',
			data: {
				realname: $('#realname').val(),
				id5: $('#id5string').val()
			},
			success: function(data){
				if (data.errorCode == 302) {
					window.location.href = data.errorMessage;
					return;
				}
				if(data.errorCode){
					$('#realname').parents('.fild-group').find('.error-meg span').text(data.errorMessage);
					$('#realname').parents('.fild-group').find('.error-meg').show();
				}else{
					window.location.reload();
				}
			}
		});
	}

	$('#id5validator').click(function(){
		if(!$('#id5form').valid()){
			return;
		}
		id5validatorSubmit();
	});
})