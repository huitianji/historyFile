	$(function(){
	    var $repayRow = $(".repay-row");
	    $repayRow.on("click",function(){
	    	if($(this).find("input[name='resultCode']").val()!=0){
	    		return false;
	    	}
	    	if($(this).hasClass("repay-click")){
	    		$(this).removeClass("repay-click");
	    	}else{
	    		$(this).addClass("repay-click");
	    	}
	    	//计算总金额
	    	var amountStr="";
	    	$repayRow.filter(".repay-click").each(function(){
	    		amountStr+=$.trim($(this).find("input[name='total']").val())+",";
	    	});
	    	calTotalAmount($(".balance-adequate span.so-payment strong"),amountStr);
	    });
	});

    /**
	 * 作用:计算总值（之所以没有用parseFloat直接相加，是因为parseFloat的最大值小于long）
	 * ele 计算结果要赋值的元素
	 * str 前端用，拼接起来的一个字符串
	 * callback 需要异步处理相关数据函数
	 **/
	function calTotalAmount(ele, str, callback) {
		$.ajax({
			url : '/ajax/cal_amount',
			type : 'get',
			data : {
				"strAmount" : str
			},
			dataType : 'json',
			success : function(data) {
				if (ele.is("input")) {
					ele.val(data.data);
				} else {
					ele.text(data.data);
				}
			},
			complete : callback,
			error : function(xhr, type, exception) {
				if (ele.is("input")) {
					ele.val("NaN");
				} else {
					ele.text("NaN");
				}
			}
		});
	}
	$(function() {
		$("#confirm-repay").click(function() {
			var bidId = [];
			var amount = [];
			var partAmount = [];
			var repayWay = [];
			var total=0;
			$(".repay-click").each(function(index, domEle) {
				bidId[index] = $(this).find("input[name='bidId']").val();
				amount[index] = $(this).find("input[name='total']").val();
				partAmount[index] = $(this).find("input[name='partAmount']").val();
				repayWay[index] = $(this).find("input[name='repayWay']").val();
				total+=(amount[index]);
			});
			var ele = $(this).parent();
			if(total<=0){
				ele.find("a:last-child").html("请选择要还款的债权");
				return false;
			}
			$.ajax({
				url : '/repay/ajax/action',
				type : 'post',
				data : {
					"bidId" : bidId.join(","),
					"amount" : amount.join(","),
					"partAmount" : partAmount.join(","),
					"repayWay" : repayWay.join(",")
				},
				dataType : 'json',
				beforeSend : function() {
					maskDiv().show();
					ele.find("a:last-child").html('还款操作中，请稍后……');
				},
				success : function(data) {
					if (data.code == "1") {
						var jsonArr=eval(data.list);
						var form="";
						for(var i=0;i<jsonArr.length;i++){
							form+="<input type='hidden' name='resultBidId' value='"+jsonArr[i].bidId+"'><input type='hidden' name='resultCode' value='"+jsonArr[i].msg+"'>";
						}
						ele.find("a:last-child").html("页面正在跳转……");
						$("#repayForm").html(form).submit();
					}else{
						ele.find("a:last-child").html(data.msg);
					}
				},
				error : function(xhr, type, exception) {
					maskDiv().hide();
					ele.find("a:last-child").html("");
				}
			});

		});
	});

	function maskDiv() {
		var $winW = $(window).width(), $dH = $("body").height();
		return $(".popup-mask").css({
			"width" : $winW + "px",
			"height" : $dH + "px"
		});
	}