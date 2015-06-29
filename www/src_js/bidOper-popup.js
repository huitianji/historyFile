$(function() {

	if(window.location.pathname.toLowerCase().indexOf("/invest/9") != -1){
		return false;
	}

	var $MainBody = $(".main-offsetHeight"); //最外层div，控制虚化效果
	var $Main = $(".version-popup-main:not([data-type])"), //内容弹出层
		$Floats = $(".version1-mask"), //遮罩层
		// $Popup = $(".version-popup[class='version-bidInvest']"), //内容弹层父级 货基
		$Popup = $(".version-popup:not([data-type])"), //内容弹层父级
		$partBox = $(".online");

	//弹出层 相关方法
	var popup = {
		//显示并控制弹出层位置
		showPopup: function() {
			var winW = $(window).width(),
				winH = $(window).height(),
				dW = $(document).width(),
				dH = $(document).height(),
				left = (winW - $Popup.width()) / 2,
				top = (winH - $Popup.height()) / 2;

			$Main.show();
			$Floats.show().css("width", dW + 'px').css("height", dH + 'px');
			$Popup.show().css("top", top + $(window).scrollTop() + 'px').css("left", left + 'px');
			$MainBody.addClass('back-blur');
			commonFn.loadTemplate();
			$(".version-popup-mask").height($Main.height() + 16);
		},
		//隐藏弹出层
		hidePopup: function() {
			//如果存在弹出层倒计时，关闭时去掉计时器
			if(typeof GLOBAL_COUNTDOWN == 'object'){
				var gcd = GLOBAL_COUNTDOWN;
				for(var i in gcd){
					if(i != "isCorrect"){
						gcd[i] = false;
					}
				}
			}
			$Main.hide();
			$Floats.hide();
			$Popup.hide();
			$MainBody.removeClass('back-blur');
			commonFn.reBtn();
		},
		//单行 11 失败 - 撤销失败，系统繁忙 
		showTranFailBusy: function() {
			config.mycalculate.popupStatus = 0; //显示结果弹层
			config.serverObj.errorCode = 4; //未登录错误
			config.mycalculate.errorId = 11; //单行错误提示
			popup.showPopup();
		},
		//单行 22 失败 - 转让项目撤销失败，已被人购买 
		showTranFailSold: function() {
			config.mycalculate.popupStatus = 0; //显示结果弹层
			config.serverObj.errorCode = 4; //未登录错误
			config.mycalculate.errorId = 22; //单行错误提示
			popup.showPopup();
		},
		//单行 6 失败 - 投资金额有误
		showMoneyError: function() {
			config.mycalculate.popupStatus = 0; //显示结果弹层
			config.serverObj.errorCode = 4;
			config.mycalculate.errorId = 6;
			popup.showPopup();
		},
		//单行 5 失败 - 转让标已过期或被撤销
		showBidRevoke: function() {
			config.mycalculate.popupStatus = 0; //显示结果弹层
			config.serverObj.errorCode = 4;
			config.mycalculate.errorId = 5;
			popup.showPopup();
		},
		//单行 4 失败 - 未登录 
		showNoLogin: function() {
			config.baseInfo.typeName = "快速登录";
			config.mycalculate.popupStatus = 0; //显示结果弹层
			config.serverObj.errorCode = 4; //未登录错误
			config.mycalculate.errorId = 4; //单行错误提示
			popup.showPopup();
		},
		//单行 3 失败 - 系统繁忙
		showSystemBusy: function() {
			config.mycalculate.popupStatus = 0; //显示结果弹层
			config.serverObj.errorCode = 4;
			config.mycalculate.errorId = 3;
			popup.showPopup();
		},
		//单行 2 失败 - 项目已满标
		showInvestFull: function() {
			config.mycalculate.popupStatus = 0; //显示结果弹层
			config.serverObj.errorCode = 4;
			config.mycalculate.errorId = 2;
			popup.showPopup();
		},
		//单行 1 失败 - 不能投资自己转让的项目
		showCannotInvestOwner: function() {
			config.mycalculate.popupStatus = 0; //显示结果弹层
			config.serverObj.errorCode = 4;
			config.mycalculate.errorId = 1;
			popup.showPopup();
		},
		//1 失败 - 账户余额不足
		showBalanceLess: function() {
			config.mycalculate.popupStatus = 0; //显示结果弹层
			config.serverObj.errorCode = 1;
			popup.showPopup();
		},
		//2 失败 - 标剩余金额不足
		showBidBalanceLess: function() {
			config.mycalculate.popupStatus = 0;
			config.serverObj.errorCode = 2;
			popup.showPopup();
		},
		//3 失败 - 投资失败，投资条件不符 （新手专享）
		showNewConditionError: function() {
			config.mycalculate.popupStatus = 0;
			config.serverObj.errorCode = 3;
			config.mycalculate.errorId = 1;
			popup.showPopup();
		},
		//3 失败 - 投资失败，投资条件不符 （秒杀标条件）
		showSecConditionError: function() {
			config.mycalculate.popupStatus = 0;
			config.serverObj.errorCode = 3;
			config.mycalculate.errorId = 2;
			popup.showPopup();
		},
		// 投资成功
		showSuccess: function() {
			config.mycalculate.popupStatus = 0;
			config.serverObj.errorCode = 0;
			popup.showPopup();

			if (config.baseInfo.url == 5 || config.baseInfo.url == 6) {
				$(".version-btn-closePopup,.version-popup-closed a").on("successClick", function() {
					//投资、转让页面绑定关闭时刷新列表事件	
					window.location.reload();
				});
			}
		},
		//撤销转让成功
		showRevokeSuccess: function() {
			config.mycalculate.popupStatus = 0;
			config.serverObj.errorCode = 6;
			popup.showPopup();
		}
	};
	//公用方法
	var commonFn = {
		//投资、转让按钮禁用
		disBtn: function() {
			$(this).attr("disabled", true).addClass('ver-stop-btn').addClass('disabled');
		},
		//投资、转让按钮解除禁用
		reBtn: function() {
			$(".ver-stop-btn").each(function(i,item){
				// if(item.value == "投资" || item.value == "新手投资" || item.value == "立即投资" || item.value == "购买转让" || item.value == "购买转让项目" || item.value == "即将开始"){
					$(item).attr("disabled", false).removeClass('ver-stop-btn').removeClass('disabled');
				// }
			});
		},
		//加载弹出层template
		loadTemplate: function() {
			var content = template("src_popup/popup_content", config);
			$Main.html(content);
		},
		//加载红包详情template
		loadHongbaoTemplate: function() {
			var content = template("src_popup/show_Hongbao_detail", config);
			$(".version-popup-start .version-popup-ul[data-popup-type='hongbao']").html(content);
		},
		//根据红包计算使用余额 金额单位：分
		getUsedMoney: function(money, hongbao) {
			var usedMoney = money;
			hongbao && (usedMoney -= hongbao);
			$("#v_usedMoney").html(commonFn.fmtMoney(usedMoney));
			return usedMoney;
		},
		//格式化金额 isYuan: 单位是否是元，是 不进行整除，正常逗号分隔输出
		fmtMoney: function(money, length, isYuan) {
			if (length !== 0) {
				length = length | 2;
			}
			if (typeof parseInt(money) === 'number' && !isYuan) {
				money = (money / 100).toFixed(length);
			}
			money = ('' + money).replace(/(\d)(?=(?:\d{3})+(?:\.\d+)?$)/g, "$1,");
			return money;
		},
		//比较是否可用的红包
		getIsCheckedCouponList: function(couponList) {
			if(!couponList) return;

			config.mycalculate.chooseCouponUserId = 0;			//系统默认使用红包ID
			var arr = [], hasCouponUse = false;
			for (var i = 0; i < couponList.length; i++) {
				var expiredTime = new Date(couponList[i].expiredTime);
				couponList[i].expiredDate = commonFn.addZero(expiredTime.getFullYear()) + '-' + commonFn.addZero(expiredTime.getMonth() + 1) + '-' + commonFn.addZero(expiredTime.getDate());
				if (couponList[i].minBidAmount <= config.mycalculate.investMoney) {
					couponList[i].isChecked = true;
					hasCouponUse = true;
				} else {
					couponList[i].isChecked = false;
				}
				arr.push(couponList[i]);
			};
			if(couponList.length > 0){
				if(!hasCouponUse){
					//如果有红包，但无可用
					config.serverObj.data.hasCoupon = 2;			//无可用红包				
				}else{
					//如果有红包，且可用
					config.serverObj.data.hasCoupon = 1;			//有红包，且可用
				}
			}

			if(config.serverObj.data.hasCoupon == 1){
				config.mycalculate.auto_checked = "";
			}else{
				config.mycalculate.auto_checked = "checked=checked";
			}
			return arr;
		},
		addZero: function(t) {
			return t < 10 ? '0' + t : t;
		},
		//参数：标余额、计划、限额、账户余额、红包list
		//return 根据当前可用红包，增加到用户可投金额
		addCurrentBalanceByMaxCoupon: function(balanceMoney, planMoney, limitMoney, accountMoney, couponList){
			if(!couponList || couponList.length == 0) return;

			var newCouponList = [];
			for (var i = 0; i < couponList.length; i++) {
				var minAmount = couponList[i].minBidAmount;
				var cutCouponMinAmount = couponList[i].minBidAmount - couponList[i].amount;
				if(minAmount <= balanceMoney && minAmount <= planMoney && minAmount <= limitMoney && cutCouponMinAmount <= accountMoney){
					newCouponList.push(couponList[i]);
				}
			}
			if(newCouponList.length == 0) return;

			var canUseMaxCoupon = 0;					//能使用的最大红包
			for (var i = 0; i < newCouponList.length; i++) {
				var coupon = newCouponList[i];
				if(canUseMaxCoupon < coupon.amount){
					canUseMaxCoupon = coupon.amount;
				}
			};
			config.serverObj.data.currentBalance += canUseMaxCoupon;
		}, 
		//根据标余额、计划、限额、账户余额 值大小，设置config以加载template
		setConfigByCompare: function(balanceMoney, planMoney, limitMoney, accountMoney) {
			config.mycalculate.reminder = null;
			//返回：1-余额最小；2-计划最小；3-限额最小 object对象
			var resObj = commonFn.getMinByCompare(balanceMoney, planMoney, limitMoney, accountMoney);
			resObj.min = Math.floor(resObj.min/100)*100;
			switch (resObj.result) {
				case 1:
					config.mycalculate.reminder = 3;
					config.mycalculate.investMoney = resObj.min; //计算过后的投资金额
					break;
				case 2:
					config.mycalculate.investMoney = resObj.min; //计算过后的投资金额
					break;
				case 3:
					config.mycalculate.reminder = 2;
					//如果限额小于每个项目总的限额 说明剩余的金额不够
					// if(limitMoney < config.mycalculate.projectLimitMoney){
					// 	config.mycalculate.reminder = 3;
					// }
					config.mycalculate.investMoney = resObj.min; //计算过后的投资金额
					break;
				case 4:
					config.mycalculate.reminder = 1;
					config.mycalculate.investMoney = resObj.min; //计算过后的投资金额
					break;
			}
			config.mycalculate.usedAmount = config.mycalculate.investMoney;
		},
		//计算 余额、计划、限额 值大小 ; 单位：分
		//返回：1-余额最小；2-计划最小；3-限额最小 object对象
		getMinByCompare: function(balanceMoney, planMoney, limitMoney, accountMoney) {
			var min = planMoney,
				result = 2;
			if (min > balanceMoney) {
				min = balanceMoney;
				result = 1;
			}
			if(min > accountMoney){
				min = accountMoney;
				result = 4;
			}
			if (min > limitMoney) {
				min = limitMoney;
				result = 3;
			}
			return {
				result: result,
				min: min
			};
		},
		resultConfig: {
			"35": popup.showMoneyError, //投资金额有误 
			"-3": popup.showSystemBusy,
			"-4": popup.showSystemBusy,
			"-5": popup.showCannotInvestOwner, //不能自己投自己
			"51": popup.showCannotInvestOwner, //不能自己投自己
			"38": popup.showNewConditionError, //新手专享
			"15": popup.showBalanceLess, //标剩余金额不足，且未勾选扫尾
			"31": popup.showInvestFull, //标满了
			"34": popup.showInvestFull, //标满了
			"36": popup.showInvestFull, //标满了
			"52": popup.showInvestFull, //标满了
			"32": popup.showBidBalanceLess, //不能超过标的可投金额，可勾选自动投满
			"33": popup.showBidBalanceLess, //不能超过标的可投金额，可勾选自动投满
			"37": popup.showSecConditionError, //秒杀条件不符
			"99": popup.showSystemBusy
		},
		//将格式化的金额恢复到正确金额，便于计算
		resetMoney: function(formatMoney) {
			return ('' + formatMoney).replace(/,/g, '');
		},
		isIE8: function(){
			return !$.support.changeBubbles;	//如果不支持，则为IE8及以下浏览器
		},
		//对红包数组排序
		sortToHongbao: function(arr, s, e, orderBy, field){
			orderBy = orderBy || "down";

		    if( s > e) return [ ];
		    if( s == e) return [ arr[s] ];
		    if( s == e-1) {
		    	if(orderBy == "down"){
		        	//降序
		    		if(arr[s][field] > arr[e][field]){
			            return [ arr[e], arr[s] ];
			        }else{
			            return [ arr[s], arr[e] ];
			        }
		    	}else{
		        	//升序
		    		if(arr[s][field] < arr[e][field]){
			            return [ arr[e], arr[s] ];
			        }else{
			            return [ arr[s], arr[e] ];
			        }
		    	}
		        
		    }
		    var n = Math.floor( (s+e)/2 ) ;
		    var arr1 = commonFn.sortToHongbao( arr, s, n, orderBy, field);
		    var arr2 = commonFn.sortToHongbao( arr, n+1, e, orderBy, field);
		    var result = [ ];
		    
		    while( arr1.length>0 || arr2.length>0){
		        if(arr1.length == 0){
		            result = result.concat(arr2); 
		            break;
		        }
		        if(arr2.length == 0){
		            result =result.concat(arr1); 
		            break;
		        }

		        if(orderBy == "down"){
		        	//降序
		        	if(arr1[0][field] >arr2[0][field]){
			            result.push( arr2.shift() );
			        }else{
			            result.push( arr1.shift() );
			        }
		        }else{
		        	//升序
		        	if(arr1[0][field] <arr2[0][field]){
			            result.push( arr2.shift() );
			        }else{
			            result.push( arr1.shift() );
			        }
		        }
		        
		    }

		    return result;

		},
		//显示canvas已被投资进度
		setCanvas :function (oCircle, $span){
			if(!oCircle.getContext) return;
			
			//项目完成进度
			var oGC = oCircle.getContext("2d");
			var objColor = { "zero" : "#e7e6e6", "small" : "#ffd200", "midium" : "#ff510d", "big" : "#81c931" };
			var arrCircle = [];
			var x = 38, y = 40, lineWidth = 4, radius = 24;
			if($(oCircle).attr("progress-detail") == "1"){
				//如果是详情页的进度条
				x = y = 26;
				radius = 22;
			}
			if($(oCircle).attr("data-dqb") == "true"){
				//如果是列表中的定期宝 需要向下一些
				y = 50;
			}
			oGC.clearRect(0, 0, $(oCircle).width(), $(oCircle).height());
			var bili = oCircle.getAttribute("data-precent") * 1;
			if($span.html() == ""){
				$span.html(bili);	
			} 
			var type = bili == 0 ? "zero" : (bili > 0 && bili < 50 ? "small" : bili >= 50 && bili < 100 ? "midium" : "big"); 
			arrCircle.push( { "color" : objColor[type], "circle" : bili } );
			arrCircle.push( { "color" : "#ececec", "circle" : 100 - bili } );
			var isIE8 = !$.support.changeBubbles;	//如果不支持，则为IE8及以下浏览器

			var lastAngle = 0;
			for (var i = 0; i < arrCircle.length; i++) {
				if(lastAngle == 270) break;

				var angle = arrCircle[i].circle / 100 * 360;
				var start = i == 0 ? -90 : lastAngle;
				var end = lastAngle = start + angle;
				if(end == 270 && isIE8) end = -90;	//该处为了兼容ie8下： -90 到 270 整圆画不出来的bug
				oGC.beginPath();
				oGC.arc(x, y, radius, start / 180 * Math.PI, end / 180 * Math.PI);
				oGC.strokeStyle = arrCircle[i].color;
				oGC.lineWidth = lineWidth;
				oGC.stroke();
				oGC.closePath();
			};
		},
		fmtTime : function(time){
			var date = new Date(time * 1);
			return date.getFullYear() + '-' + commonFn.addZero( date.getMonth() + 1 ) + "-" + commonFn.addZero( date.getDate() );
		}

	}

	//弹出层公用使用的 绑定元素事件
	function bindElementEvent() {

		//同意协议选择框 按钮事件
		$Main.on("click", "#v_chk_promiss", function() {
			if ($(this).is(":checked")) {
				$(".version-btn-sureInvest").attr("disabled", false).removeClass('disabled');
			} else {
				$(".version-btn-sureInvest").attr("disabled", true).addClass('disabled');
			}
		});
		//关闭弹出层
		$Main.on("click", ".version-btn-closePopup,.version-popup-closed a", function() {
			//投资、转让页面绑定关闭时刷新列表事件，如果有disabled的按钮(说明是预开标)则关闭时也不局部刷新
			if ((config.baseInfo.url == 1 || config.baseInfo.url == 2) && $Main.find("input.disabled").length == 0 && config.mycalculate.popupStatus != 5) {
				refreshList();
			}

			popup.hidePopup();
			$(this).trigger("successClick").unbind('successClick');
			return false;
		});

		//document的click事件 隐藏红包详情，隐藏折价按钮显示
		$(document).on("click", function(ev) {
			if(config.baseInfo.url == 1 || config.baseInfo.url == 5){
				$(".version-popup-start .version-popup-recive").not(":hidden").trigger("click", [true]);
			}
			if(config.baseInfo.url == 3){
				$(".version-popup-rate").not(":hidden").trigger("click", [true]);
			}
		})

		//keyup
		$(document).on("keyup",function(ev){

			if(ev.keyCode == 13){
				if($Main.not(":hidden").length == 1){
					var $sure = $(".version-btn-sureInvest"),
						$close = $(".version-btn-closePopup");
					//如果弹出层出现
					if($sure.not(":hidden").length == 1){
						//如果有投资或撤销的确定按钮
						$sure.trigger('click');
					}else if($("input[data-cdtime='1']").length == 0 && $close.not(":hidden").length){
						//否则 关闭确定按钮，触发
						$close.trigger('click');	
					}
				}else{
					if(config.baseInfo.url == 1){
						var $active = $(document.activeElement);
						if($active.hasClass('ver-input-money')){
							$active.parent().find(".ver-btn").trigger("click");
						}
					}else if(config.baseInfo.url == 5){
						var $active = $(document.activeElement).parent();
						if($active.hasClass('version-project-input-box')){
							$(".v-detail-btnInvest").trigger("click");
						}
					}else if(config.baseInfo.url == 6){
						var $active = $(document.activeElement).parent();
						if($active.hasClass('version-project-input-box')){
							$("input[data-type='btn-finance']").trigger("click");
						}						
					}
				}
			}else if(ev.keyCode == 27){
				if($Main.not(":hidden").length == 1){
					$(".version-btn-closePopup").trigger("click");
				}
			}
		})

		//弹出层关闭按钮旋转
		var userAgent = window.navigator.userAgent;
		if(userAgent.indexOf("MSIE 6.0") != -1 || userAgent.indexOf("MSIE 7.0") != -1 || userAgent.indexOf("MSIE 8.0") != -1 || userAgent.indexOf("MSIE 9.0") != -1){
			// var barRoate = false;
			// $Main.on("mouseenter",".version-popup-closed a",function(){
			// 	if(barRoate) return;
			//     barRoate = true;
			// 	var self = $(this).find("em")[0];
			// 	var rotate = 0;
			// 	var left = parseInt($(self).css("marginLeft")) || 0;
			// 	var top = parseInt($(self).css("marginTop")) || 0;
			// 	function roateFn(){
			// 		rotate += 15;
			//         var radian = rotate*Math.PI/180;
			// 	    var W=Math.abs(Math.sin(radian)*14)+Math.abs(Math.cos(radian)*14); 
			// 	    self.style.marginLeft = (left-(W-14)/2)+'px';
			// 	    self.style.marginTop = (top-(W-14)/2)+'px';

			//         self.style.filter = "progid:DXImagetransform.Microsoft.Matrix(M11="+Math.cos(radian)+",M12=-"+Math.sin(radian)+",M21="+Math.sin(radian)+",M22="+Math.cos(radian)+",SizingMethod='auto expand');"
			// 		setTimeout(function(){
			// 	        if(rotate >= 180){
			// 	        	barRoate = false;
			// 			    self.style.marginLeft = '18px';
			// 			    self.style.marginTop = '18px';
			// 	            return;
			// 	        }else{
			// 	        	roateFn();
			// 	        }
			// 	    },30);
					
			//     }
			// 	roateFn();
			// });
		}else{
			var oStyleKeyFrames = document.createElement("style");
			oStyleKeyFrames.innerHTML = "
		        .version-popup-closed a em{
		        	-webkit-transition: all 0.3s linear;
			        -ms-transition: all 0.3s linear;
			        -moz-transition: all 0.3s linear; 
			        transition: all 0.3s linear; 
		        }
		        .version-popup-closed a:hover em{
		        	-webkit-transform: rotate(90deg);
		            -moz-transform: rotate(90deg);
		            -ms-transform: rotate(90deg);
		            transform: rotate(90deg);
		        }";
	        document.getElementsByTagName("head")[0].appendChild(oStyleKeyFrames);
		}

	}
	bindElementEvent();

	//弹出层使用的模板配置config
	var config = {
		baseInfo: {
			url: 1 //默认1 - 投资列表
		},
		mycalculate: {

		},
		serverObj: {
			data: {}
		},
		codes: {
			repayMode: codes.repayMode,
			local_tooltip: codes.local_tooltip,
			globalRules: codes.globalRules
		}
	};
	//判断当前是哪个页面
	var pathname = window.location.pathname.toLowerCase();
	switch (pathname) {
		case "/invest":
		case "/invest/":
		case "/invest/0":
		case "/invest/2":
			config.baseInfo.url = 1; //投资列表 	-> 1
			config.baseInfo.bidOperType = 0; //标的操作类型  -> 0 新标
			config.baseInfo.btnName = "确认投资";
			break;
		case "/invest/1":
			config.baseInfo.url = 2; //投资转让列表 	-> 2
			config.baseInfo.bidOperType = 1; //标的操作类型  -> 1 转让
			config.baseInfo.btnName = "确认投资";
			break;
		case "/myaccount/invest/list":
			config.baseInfo.url = 3; //我的账户 - 投资列表 -> 3
			config.baseInfo.bidOperType = 1; //标的操作类型  -> 1 转让
			config.baseInfo.btnName = "确定转让";
			break;
		case "/myaccount/transfer/list":
			config.baseInfo.url = 4; //我的账户 - 债权转让列表 -> 4
			config.baseInfo.bidOperType = 1; //标的操作类型  -> 1 转让
			config.baseInfo.btnName = "确定撤销";
			break;
	}
	//项目详情页面
	if(pathname.indexOf("/bid/detail/") != -1){
		config.baseInfo.url = 5;
		config.baseInfo.bidOperType = globalConfig.isTransfer == "1"? 1 : 0;
		config.baseInfo.btnName = "确认投资";
		config.baseInfo.bid = pathname.substring(pathname.lastIndexOf('/') + 1);
		config.baseInfo.typeName = $.trim($(".version-basic-title strong:eq(0)").html());
		config.mycalculate.notUseCoupon = false;	//是否不能使用红包 默认false 可以；true 不可以（新手标、秒杀标、定期宝）
		//是否为新手标
		if(globalConfig.isForFresh == "1"){
			config.mycalculate.notUseCoupon = true;
		}
		//是否为秒杀标
		if(globalConfig.isSeckill == "1"){
			config.mycalculate.notUseCoupon = true;
		}		
		//是否为抵押
		if(globalConfig.hasMortgage > 0){
			config.mycalculate.isMortgage = true;
		}else{
			config.mycalculate.isMortgage = false;
		}
	}else if(pathname.indexOf("/fb/detail/") != -1){
		config.baseInfo.url = 6; 				//投资详情页 - 定期宝 -> 6
		config.baseInfo.bidOperType = 0; 		//标的操作类型  -> 0 新标
		config.baseInfo.typeName = $.trim($(".version-basic-title").attr("data-text"));
		config.baseInfo.btnName = "确认投资";
		config.baseInfo.bid = pathname.substring(pathname.lastIndexOf('/') + 1);
		config.mycalculate.notUseCoupon = true;	//是否能使用红包 默认false 可以；true 不可以（新手标、秒杀标、定期宝）
	}
	config.mycalculate.registerUrl = config.mycalculate.loginUrl = "https://passport.souyidai.com/?backurl="+ location.href;

	window.setCvsProgress = setCvsProgress;	//抛出接口
	//计算进度条
	function setCvsProgress($parent){
		var isIE8 = commonFn.isIE8();
		setTimeout(function(){
			//如果翻页，则只会重新加载翻页后的进度条
			var $progress = $parent ? $parent.find(".cvs-circle-progress") : $(".cvs-circle-progress");
			$progress.each(function(i, item){
				isIE8 && G_vmlCanvasManager.initElement(item);
				commonFn.setCanvas(item, $(item).next().find(".span-circle-progress"));
			});
		}, 50);
	}
	setCvsProgress();

	//投资列表、转让列表公用方法
	if (config.baseInfo.url == 1 || config.baseInfo.url == 2 || config.baseInfo.url == 5 || config.baseInfo.url == 6) {

		//绑定用户基本信息
		var bindUserBaseInfo = function(options){

			$.ajax({
				url: '/export/invest/userData',
				type: 'Get',
				async: options.async,	//加载页面时加载为异步，投资按钮触发时为同步方式
				dataType: 'json',
				data: { t: Math.random() }
			})
			.done(function(json) {
				if(json.errorCode != 0) return;

				var couponMoney = commonFn.fmtMoney(json.data.couponAmount,2);
				//列表页 显示红包 和 余额
				if(config.baseInfo.url == 1 || config.baseInfo.url == 2){
					$(".version-red-envelope").show();
					$("strong[data-class='v-pp-balance']").html(commonFn.fmtMoney(json.data.currentBalance,2));
					$("strong[data-class='v-pp-coupon']").html(couponMoney);
				}else if(config.baseInfo.url == 5 || config.baseInfo.url == 6){
					//详情页 红包
					$("a[data-detail-hb=1]").html(couponMoney);
				}

				options.succFn && options.succFn(json);
			})

		}

		//请求基本数据
		var getBaseInfo = function(options){

			bindUserBaseInfo({
				async: options.async,
				succFn: function(data){

					config.serverObj = data;

					config.mycalculate.popupStatus = 1; //显示投资弹层
					config.mycalculate.auto_disabled = "";
					config.mycalculate.chooseCouponUserId = 0;	//系统默认使用红包
					if(config.serverObj.data.couponList.length > 0){
						config.serverObj.data.hasCoupon = 1;	//有红包
						config.serverObj.data.couponList = commonFn.sortToHongbao( config.serverObj.data.couponList, 0, config.serverObj.data.couponList.length-1, 'down', 'minBidAmount');
					}else{
						config.serverObj.data.hasCoupon = 0;	//无红包
					}

					//加息
					for(var i = 0; i < config.serverObj.data.raiseInterestCouponList.length; i++){
						var objItem = config.serverObj.data.raiseInterestCouponList[i];
						objItem.expiredTime = commonFn.fmtTime(objItem.expiredTime);
					}
					// config.serverObj.data.raiseInterestCouponList = [
					// 	{ interestId : 1, expiredDate : '2015-01-02', minBidAmount : "100", amount : '100' },
					// 	{ interestId : 2, expiredDate : '2015-12-02', minBidAmount : "100", amount : '50' }
					// ];

				}
			})

		}
		if ($.cookie("syd_name") == undefined) {
			$(".version-red-envelope").hide();
		}else{
			$(".version-red-envelope").show();
			getBaseInfo({async: true});
		}		

		var dobidAjax = function(options) {
			commonFn.disBtn.call($(".version-btn-sureInvest"));

			$.ajax({
					url: '/bid/dobid',
					type: 'POST',
					dataType: 'JSON',
					data: options.data
				})
				.done(function(data) {
					config.serverObj.errorCode = data.errorCode;
					if(data.errorCode == 1){
						if(data.errorMessage == "noLogin"){
							popup.showNoLogin();
							return;
						}
						popup.showSystemBusy();
						return;
					}

					if (data.errorCode === 0) {
						var retCode = data.data.retCode;
						var realAmount = data.data.realAmount;
						// var userBalance = data.data.userBalance;

						config.mycalculate.usedAmount = data.data.realAmount;
						if (retCode === 0) {
							if (config.baseInfo.bidOperType == 0 && config.mycalculate.investMoney > realAmount) {
								config.mycalculate.result_reminder = true; //结果弹出层提醒，true 是,false 否
							}
							//如果是转让标投资成功，需要修改一下投资金额
							config.mycalculate.investMoney = data.data.realAmount;
							//使用余额 = 投资金额 - 使用红包金额
							config.mycalculate.usedAmount = config.mycalculate.investMoney - data.data.couponAmount;
							//使用红包金额
							config.serverObj.data.couponAmount = data.data.couponAmount;
							popup.showSuccess();
							//成功 刷新基本信息
							getBaseInfo && getBaseInfo({ async: true });
						} else {
							//失败提示
							if(commonFn.resultConfig[retCode]){
								commonFn.resultConfig[retCode]();
							}else{
								popup.showSystemBusy();
							}
						}
					} else {
						popup.showSystemBusy();
					}
				})
				.fail(function() {
					popup.showSystemBusy();
				})
				.always(function() {
					commonFn.reBtn();
				});
		}

		//刷新列表请求的接口 - 新标、转让标
		var refreshListAjax = function(options){
			$.ajax({
				url: '/invest/bidData',
				type: 'POST',
				dataType: 'json',
				data: { bidIds: options.bidIds, isTransfer: options.isTransfer}
			})
			.done(function(data) {				
				options.succFn && options.succFn(data);
			})
			.fail(function() {
				
			})
		}
		//刷新列表接口 - 定期宝
		var refreshSPlanListAjax = function(options){
			$.ajax({
				url: '/fb/listData',
				type: 'POST',
				dataType: 'json',
				data: { fbIds: options.fbIds}
			})
			.done(function(data) {				
				options.succFn && options.succFn(data);
			})
			.fail(function() {
				
			})
		}

	}

	//我的账户（投资列表 和 债权转让 列表公用事件和方法）
	if (config.baseInfo.url == 3 || config.baseInfo.url == 4) {

		var getRevokeTransferAjax = function() {
			//1 投资列表、0 债权转让列表
			$.ajax({
					url: '/myaccount/transfer/interest/' + config.baseInfo.bid + '/' + config.baseInfo.cancleType + '?t=' + Math.random(),
					type: 'Get',
					dataType: 'json'
				})
				.done(function(data) {
					if (!data.data) {
						popup.showSystemBusy();
						return;
					}

					config.serverObj = data;

					// 收益损失/增加 = 实际本金  -  转让本金
					config.mycalculate.changeMoney = Math.abs(config.serverObj.data.actualPrincipal - config.serverObj.data.principal);
					// 转让价格 = 传过来的转让价格 + 转让结息
					config.serverObj.data.actualPrincipal += config.serverObj.data.interest;
					// 预计回款 = 实际本金 - 转让手续费
					config.mycalculate.returnMoney = config.serverObj.data.actualPrincipal - config.serverObj.data.transferFee;
					//计算转出类型
					var discount = config.serverObj.data.discountRate;
					config.mycalculate.transfer_type = discount == 10000 ? 0 : discount < 10000 ? 1 : 2;
					var time = new Date(config.serverObj.data.expireTime);
					var spanLocal = config.serverObj.data.expireTime - (new Date()).getTime(); //毫秒数

					diffSecs = spanLocal / 1000;
					var secs = Math.floor(diffSecs % 60);
					secs = secs < 10 ? "0" + secs : secs;
					var mins = Math.floor((diffSecs / 60) % 60);
					mins = mins < 10 ? "0" + mins : mins;
					var hours = Math.floor((diffSecs / 3600) % 24);
					var days = Math.floor((diffSecs / 3600) / 24);
					hours = hours + days * 24;
					hours = hours < 10 ? "0" + hours : hours;

					config.mycalculate.expireHours = hours; //过期时间 时
					config.mycalculate.expireMinutes = mins; //过期时间 分
					config.mycalculate.expireSeconds = secs; //过期时间 秒

					popup.showPopup();
				})
				.fail(function() {
					popup.showTranFailBusy();
				})
				.always(function() {
					
				});	
		}

		var sureRevokeAjax = function(options) {
			//确定撤销  cancleType: 0 债权转让撤销；1 投资列表撤销
			$.ajax({
				url: "/myaccount/invest/cancle/" + config.baseInfo.bid + "/" + config.baseInfo.cancleType,
				type: 'get',
				data: {
					t: Math.random()
				},
				dataType: 'json',
				success: function(data) {
					if (data.result == 1) {
						popup.showRevokeSuccess();
						options.succFn && options.succFn();
					} else {
						popup.showTranFailBusy();
					}
				},
				error: function() {
					popup.showTranFailBusy();
				}
			});

		}

	}

	//我的投资新标、项目详情 公用接口和方法
	if(config.baseInfo.url == 1 || config.baseInfo.url == 5){

		//对“截止日期”排序
		$Main.on("click",".version-popup-start[data-popup-type='hongbao'] .version-popup-expiredTime",function(){
			orderByHongbao.call(this,"expiredTime");
			return false;
		})
		//对“起投金额”排序
		$Main.on("click",".version-popup-start[data-popup-type='hongbao'] .version-popup-minBidAmount",function(){
			orderByHongbao.call(this,"minBidAmount");
			return false;
		})
		//对“红包金额”排序
		$Main.on("click",".version-popup-start[data-popup-type='hongbao'] .version-popup-amount",function(){
			orderByHongbao.call(this,"amount");
			return false;
		})
		//排序公用方法
		var orderByHongbao = function(field){
			var $img = $(this).find(".certifi-img");
			var orderBy = $img.hasClass('icon-down')? "down" : "up";
			$(".version-popup-an .version-popup-updown").removeClass('current').find("em").removeClass('icon-down').removeClass('icon-up');
			if(orderBy == "down"){
				$img.removeClass('icon-down').addClass('icon-up').closest('.version-popup-updown').addClass('current');
			}else{
				$img.removeClass('icon-up').addClass('icon-down').closest('.version-popup-updown').addClass('current');
			}

			config.serverObj.data.couponList = commonFn.sortToHongbao( config.serverObj.data.couponList, 0, config.serverObj.data.couponList.length-1, orderBy, field);
			commonFn.loadHongbaoTemplate();
		}

		//绑定一些元素触发事件
		var bindElementEvent = function() {

			//使用红包的 展开、收缩 按钮事件
			$Main.on("click", ".version-popup-start .version-popup-recive", function(ev, hide) {
				var $i = $(this).find("i");
				//没有展开标签，说明无可用红包或无红包
				if ($i.length == 0) return false;

				var $thisStart = $(this).closest('.version-popup-start');
				var nowType = $thisStart.attr("data-popup-type");
				if ($i.hasClass('an') || hide) {
					$i.removeClass('an');
					$thisStart.find(".version-popup-an").hide();
				} else {
					$i.addClass('an');
					$thisStart.find(".version-popup-an").show();
				}
				//隐藏其他显示的弹出层
				var arrType = ["hongbao", "jiaxi"];
				for (var j = 0; j < arrType.length; j++) {
					if(arrType[j] != nowType){
						var $start = $('.version-popup-start[data-popup-type="' + arrType[j] + '"]');
						var $findi = $start.find(".version-popup-recive").find("i");
						
						if(!$findi.hasClass('an')) continue;
						$findi.removeClass('an');
						$start.find(".version-popup-an").hide();
					}
				};

				return false;
			});

			//选择红包事件
			$Main.on("click", ".version-popup-ul[data-popup-type='hongbao'] p", function(ev, hide) {
				var self = $(this);
				//如果没有a元素 表示不可以点击选择
				if (!self.children(":first").is("a")) return false;
				//否则 进行选择
				var hongbao = $.trim(self.find("strong:eq(0)").html()) * 100;
				var $check = $("#auto_1");
				if(hongbao == 0){
					var showMoney = "自动匹配";
					$check.attr({"disabled": false}).closest('span').removeClass('version-popup-checkbox-invalid');
				}else{
					var showMoney = commonFn.fmtMoney(hongbao,2) + '元';
					$check.prop("checked", false).attr({"disabled": true}).closest('span').addClass('version-popup-checkbox-invalid');
				}

				var $hongbao = self.closest('.version-popup-start').find(".version-popup-recive");
				$hongbao.find("strong:eq(0)").html(showMoney);
				config.mycalculate.chooseCouponUserId = self.attr("data-hbid");
				commonFn.getUsedMoney(config.mycalculate.investMoney, hongbao);

				//删除样式
				self.parent().find("p>a").each(function(i,item){
					var oThis = $(this);
					oThis.removeClass("active");
				})
				self.find("a").addClass('active');

				self.closest('.version-popup-start').find(".version-popup-recive").trigger("click", [true]);
			});

			//选择加息券事件
			$Main.on("click", ".version-popup-ul[data-popup-type='jiaxi'] p", function() {
				var self = $(this);
				//如果没有a元素 表示不可以点击选择
				if (!self.children(":first").is("a")) return false;
				//否则 进行选择
				var jiaxi = $.trim(self.find("strong:eq(0)").html());
				if(jiaxi == ""){
					var showMoney = "请选择加息券";
				}else{
					var showMoney = '加息' + jiaxi;
				}

				var $jiaxi = self.closest('.version-popup-start').find(".version-popup-recive");
				$jiaxi.find("strong:eq(0)").html(showMoney).attr("data-id", self.attr("data-jxid"));
				// commonFn.getUsedMoney(config.mycalculate.investMoney, jiaxi);

				//删除样式
				self.parent().find("p>a").each(function(i,item){
					var oThis = $(this);
					oThis.removeClass("active");
				})
				self.find("a").addClass('active');

				self.closest('.version-popup-start').find(".version-popup-recive").trigger("click", [true]);
			});			
		}
		bindElementEvent();

		//设置红包ul的height，如果小于4个 控制高度
		var setHongbaoUlHeight = function(){
			var couponLen = config.serverObj.data.couponList.length;
			if(couponLen < 4){
				$hbUl = $(".version-popup-ul[data-popup-type=hongbao]");
				$hbUl.css('height', $hbUl.children().length * 33 +'px');
			}
		}
		//设置加息券ul的height，如果小于4个 控制高度
		var setJiaXiUlHeight = function(){
			var interestLen = config.serverObj.data.raiseInterestCouponList.length;
			if(interestLen < 4){
				$itUl = $(".version-popup-ul[data-popup-type=jiaxi]");
				$itUl.css('height', $itUl.children().length * 33 +'px');
			}
		}

		//提交
		var bidSubmitInvest = function() {
			var params = {
					bidId: config.baseInfo.bid,
					bidAmount: config.mycalculate.investMoney, //投资金额
					isFullAmountBuy: !$('#auto_1').is(":checked"), //是否扫尾	false - 扫尾 ；true - 不扫尾
					authCode: '',
					couponUserId: config.mycalculate.chooseCouponUserId,
					// 0 不用红包 1 系统自动 2 用自己选择的红包
					// isUseCoupon: config.serverObj.data.hasCoupon == 1 ? (config.mycalculate.chooseCouponUserId == 0? 1 : 2) : 0
					// update 15.2.6 如果未获取到红包或者没有红包，默认系统自动使用红包
					isUseCoupon: config.serverObj.data.hasCoupon == 1 ? (config.mycalculate.chooseCouponUserId == 0? 1 : 2) : 1
			};
			//显示加息券的页面 且 还未选择过加息券
			if(config.mycalculate.showInterest){
				//加息券ID
				var jxid = $(".version-popup-start[data-popup-type='jiaxi']").find(".version-popup-recive strong:eq(0)").attr("data-id");
				if(jxid != -1 && config.mycalculate.useInterest == 0){
					params.raiseInterestCouponId = jxid;
				} 
			}
			dobidAjax({
				data: params
			})
		};

	}

	//我的投资转让标、项目详情 公用接口和方法
	if(config.baseInfo.url == 2 || config.baseInfo.url == 5){

		//同意协议选择框 按钮事件
		$Main.on("click", "em[check-type='popup-transfer-checked']", function() {
			var $this = $(this),
				$arrCheck = $(".vertransfer-one-confoot").find("em[check-type='popup-transfer-checked']");

			if ($this.hasClass('checked')) {
				$this.removeClass('checked');
			} else {
				$this.addClass('checked');
			}

			if($arrCheck.eq(1).hasClass('checked')){
				$(".version-btn-sureInvest").attr("disabled", false).removeClass('disabled');
			}else{
				$(".version-btn-sureInvest").attr("disabled", true).addClass('disabled');
			}
		});
		var tabIsFirst = true;
		//全部购买、部分购买切换
		$Main.on("click", ".vertransfer-one-table .vertransfer-one-title p span", function(){
			var $this = $(this);
			if($this.hasClass('current') || $this.hasClass('disabled')) return;

			var $parent = $this.parent(),
				$showParent = $('.vertransfer-one-list').children(),
				thisIdx = $this.index(".vertransfer-one-title p span");

			$parent.children("span").removeClass('current');
			$this.addClass('current');

			if(thisIdx == 0){
				$showParent.eq(0).show();
				$showParent.eq(1).hide();
				$("#popup-vertransfer-actualPrice").html(commonFn.fmtMoney(config.serverObj.data.amount, 2));
			}else if(thisIdx == 1){
				$showParent.eq(0).hide();
				$showParent.eq(1).show();
				transferChange.call($("#btn-vertransfer-partmoney"));
			}
			
		}).on("mouseenter", ".vertransfer-one-table .vertransfer-one-title p span", function(){
			var $this = $(this);
			if($this.hasClass('disabled')) return;

			$this.addClass('hover');
		}).on("mouseleave", ".vertransfer-one-table .vertransfer-one-title p span", function(){
			var $this = $(this);
			if($this.hasClass('disabled')) return;

			$this.removeClass('hover');
		});
		//转让本金输入框控制Popup
		$Main.on("focus", "#btn-vertransfer-partmoney", function(){
			$this = $(this);
			$this.parent().addClass('focus');
			if(tabIsFirst) {
				$this.val('');
				tabIsFirst = false;
			}
		}).on("blur", "#btn-vertransfer-partmoney", function(){
			$this = $(this);
			$this.parent().removeClass('focus');
		});
		var transferTimer = null;
		//input修改触发
		var transferChange = function(){
			clearTimeout(transferTimer);

			var self = $(this);
			var reg = /[^\d]/g;
			var val = self.val();
			var $tips = $("#span-buy-part-tips");
			var maxVal = config.baseInfo.planInvestMoney;
			if($tips.not(":hidden").length && Math.round(val * 100) > maxVal){
				$(this).val(val.substring(0, self.val().length-1));
				return;
			}else{
				$tips.hide();

				if (!tabIsFirst && reg.test(val)) {
					self.val(val.replace(reg, ''));
					val = self.val();
				}
				if(Math.round(val * 100) > maxVal){
					$tips.css("display", "inline-block").find('span[span-type="buy-span-tips"]').html("投资金额不能大于转让金额");
				}else{
					$tips.hide();

					if(val == "") val = 0;

					transferTimer = setTimeout(function(){
						bidDetailAjax({
							succFn : updateBidInfo,
							principal : Math.round(val * 100)
						})

					}, 300)
				}
			}

		};
		//根据input本金的改动动态修改当前利率、结息
		var updateBidInfo = function(data){
			var bidStatus = data.data.bidTransfer.status;
			if (bidStatus == 2) {
				//已被转让
				popup.showInvestFull();
				return;
			} else if (bidStatus == 3 || bidStatus == 4) {
				//已经过期、主动撤销
				popup.showBidRevoke();
				return;
			}
			var $input = $("#btn-vertransfer-partmoney"),
				$changeMoney = $("#popup-vertransfer-changeMoney"),
				$jiexi = $("#popup-vertransfer-jiexi"),
				$actualPrice = $("#popup-vertransfer-actualPrice");

			$changeMoney.html(commonFn.fmtMoney(Math.abs(data.data.principalDiscount), 2));
			$jiexi.html(commonFn.fmtMoney(data.data.interest, 2));
			$actualPrice.html(commonFn.fmtMoney(data.data.amount, 2));
		}

		var bidDetailAjax = function(options) {
			$.ajax({
					url: '/transfer/biddetail',
					type: 'POST',
					dataType: 'JSON',
					data: {
						bidId: config.baseInfo.bid,
						principal: options.principal || config.baseInfo.planInvestMoney
					},
					error: function() {
						popup.showSystemBusy();
					}
				})
				.done(function(data) {
					if (data.errorCode == 1) {
						if (data.errorMessage == 'noLogin') {
							popup.showNoLogin();
						}else{
							popup.showSystemBusy();
						}
						return;
					}
					if($.type(data.data) != "object"){
						popup.showSystemBusy();
						return;
					}

					options.succFn && options.succFn(data);

				})
				.fail(function() {
					popup.showSystemBusy();
				})
				.always(function() {
					commonFn.reBtn();
				});
		}

		var bidDetailTransferSuccFn = function(data) {

			config.serverObj = data;
			var bidStatus = config.serverObj.data.bidTransfer.status;
			if (bidStatus == 2) {
				//已被转让
				popup.showInvestFull();
				return;
			} else if (bidStatus == 3 || bidStatus == 4) {
				//已经过期、主动撤销
				popup.showBidRevoke();
				return;
			}

			config.mycalculate.popupStatus = 2; //显示转让标弹层
			var discountPrice = config.serverObj.data.principalDiscount; //折扣价格
			config.mycalculate.transfer_type = discountPrice < 0 ? 1 : discountPrice > 0 ? 3 : 2; //1-降价;2-原价;3-涨价
			// if (config.serverObj.data.bidTransfer.leftDay > 0) {
			// 	config.serverObj.data.bidTransfer.leftMonth += 1;
			// }
			//为了跟新标弹出层公用上面基础信息，需要把拿到的值转一下
			config.serverObj.data.bid = {
				repayMode: config.serverObj.data.bidTransfer.repayMode,
				isFixedRepay: config.serverObj.data.bidTransfer.isFixedRepay //还款方式
			}
			tabIsFirst = true;
			popup.showPopup();

			//弹出层显示后绑定input限制
			$("#btn-vertransfer-partmoney").off("input propertychange").on("input propertychange", function(){
				transferChange.call(this);
			})
		}

		//提交
		var bidSubmitTransfer = function() {
			var $input = $("#btn-vertransfer-partmoney");
			var $tips = $("#span-buy-part-tips");
			var investMoney = $input.not(":hidden").length == 1 ? $input.val() * 100 : config.baseInfo.planInvestMoney;
			if($input.not(":hidden").length){
				if($tips.not(":hidden").length){
					return;
				}
				if($input.val() < 100){
					$tips.css("display", "inline-block").find('span[span-type="buy-span-tips"]').html("投资金额不能小于100元");
					return;
				}
			}			

			transferdobidAjax({
				data: {
					bidId: config.baseInfo.bid,
					principal: investMoney, //本金金额
					isFullAmountBuy: !$(".vertransfer-one-confoot").find("em[check-type='popup-transfer-checked']:eq(0)").hasClass('checked') //是否扫尾 false 扫尾
				}
			})

		};


		var transferdobidAjax = function(options) {
			commonFn.disBtn.call($(".version-btn-sureInvest"));

			$.ajax({
					url: '/transfer/dobid',
					type: 'POST',
					dataType: 'JSON',
					data: options.data
				})
				.done(function(data) {
					config.serverObj.errorCode = data.errorCode;
					if(data.errorCode == 1){
						if(data.errorMessage == "noLogin"){
							popup.showNoLogin();
							return;
						}
						popup.showSystemBusy();
						return;
					}

					if (data.errorCode === 0) {
						var retCode = data.data.retCode;
						var realAmount = data.data.realAmount;
						// var userBalance = data.data.userBalance;

						config.mycalculate.usedAmount = data.data.realAmount;
						if (retCode === 0) {
							if (config.baseInfo.bidOperType == 0 && config.mycalculate.investMoney > realAmount) {
								config.mycalculate.result_reminder = true; //结果弹出层提醒，true 是,false 否
							}
							//如果是转让标投资成功，需要修改一下投资金额
							config.mycalculate.investMoney = data.data.realPrincipal;	//投资本金
							//使用余额 = 投资金额 
							config.mycalculate.usedAmount = data.data.realAmount;	//使用余额
							//使用红包金额
							config.serverObj.data.couponAmount = 0;
							popup.showSuccess();
							//成功 刷新基本信息
							getBaseInfo && getBaseInfo({ async: true });
						} else {
							//失败提示
							if(commonFn.resultConfig[retCode]){
								commonFn.resultConfig[retCode]();
							}else{
								popup.showSystemBusy();
							}
						}
					} else {
						popup.showSystemBusy();
					}
				})
				.fail(function() {
					popup.showSystemBusy();
				})
				.always(function() {
					commonFn.reBtn();
				});
		}


	}

	//投资列表 使用方法和事件
	if (config.baseInfo.url == 1) {

		// 输入框控制事件
		$partBox.on("keyup",".ver-input-money", function() {
			var self = $(this);
			var reg = /[^\d]/g;
			var val = self.val();
			if (reg.test(val)) {
				self.val(val.replace(reg, ''));
			}
			//项目最大金额  去掉金额控制 15.3.12
			// var detailMaxMoney = self.closest('.version-item').find(".version-infor .version-infor-list:eq(1)").find(".version-second .version-num").text().replace(/,/g,'')*1;
			// if(val > detailMaxMoney){
			// 	self.val(val.substring(0,val.length-1));
			// }
		});

		//新标投资按钮
		$partBox.on("click", ".ver-invest-btns .ver-btn", function() {
			
			var self = $(this);
			var $input = self.parent().find(".ver-input-money");
			var inputVal = parseInt($input.val());
			if(isNaN(inputVal) || inputVal == 0){
				$input.val("").focus();
				return;
			}

			//判断用户名是否登录
			if ($.cookie("syd_name") === undefined) {
				popup.showNoLogin();
				return;
			}
			//如果没有数据 需要重新获取，否则就是未登录
			if(!config.serverObj) getBaseInfo({ async: false});

			var $item = self.closest('.version-item');
			config.mycalculate.notUseCoupon = false;
			config.baseInfo.typeName = $.trim($item.find('.ver-top a').text());
			//剩余账户金额
			config.serverObj.data.currentBalance = parseInt($.trim($("strong[data-class='v-pp-balance']").html().replace(/,/g,'')) * 100);
			//余额不足1元，充值引导
			if (config.serverObj.data.currentBalance < 100) {
				popup.showBalanceLess();
				return;
			}

			//加息券暂时隐藏
			// config.mycalculate.showInterest = false;
			// config.mycalculate.useInterest = 0;

			//是否有加息提示
			var secBid = $item.find("strong[data-text='loan_seckill']:visible").length;
			var hasAddRate = $item.find(".version-second:eq(0)").attr("hasAddRate");
			// 如果是秒杀标 或者标已经存在加息 不显示加息券
			if(secBid > 0 || hasAddRate == "true"){
				config.mycalculate.showInterest = false;
				config.mycalculate.useInterest = 0;
			}else{
				var raise = self.attr("data-raise");
				if(raise == 0){
					// raise=0 说明未使用过加息券
					config.mycalculate.showInterest = true;
					config.mycalculate.useInterest = 0;
				}else if(raise > 0){
					// raise有值 说明已经使用过加息券
					config.mycalculate.showInterest = true;
					config.mycalculate.useInterest = raise/100;
				}else if(raise == undefined){
					config.mycalculate.showInterest = false;
				}
			}

			commonFn.disBtn.call(self);

			config.mycalculate.popupStatus = 1; //显示投资弹层
			config.serverObj.data.bid = {};
			config.baseInfo.bid = self.attr("data-bidid");
			config.baseInfo.planInvestMoney = inputVal * 100;
			var $list = $item.find(".version-infor .version-infor-list");
			//还款利率
			config.serverObj.data.bid.lilv = $.trim($list.filter(":eq(0)").find(".version-second .version-num").text());
			//还款期限
			config.serverObj.data.bid.qixian = $.trim($list.filter(":eq(3)").find(".version-second").text());
			var $second = $list.filter(":eq(4)").find(".version-second");
			//还款方式
			config.serverObj.data.bid.fangshi = $.trim($second.find(".version-text").text());

			if (config.baseInfo.planInvestMoney <= 0) {
				//如果计划金额计算出来小于等于0  做提醒
				popup.showMoneyError();
				return;
			}
			var limitMoney = 0;	//限额
			//项目总金额
			var totalProjectMoney = $.trim($list.filter(":eq(1)").find(".version-second .version-num").text().replace(/,/g,''))*1;
			//获取最小限额
			$table = self.parent().parent().find(".ver-invest-money tbody tr:eq(0) td:eq(0)");
			limitMoney = parseInt( $table.find("span:eq(0)").attr("data-canbidamount").replace(/,/g,'')) * 100;
			//标的剩余金额
			config.mycalculate.surplusMoney = $item.attr("data-remainingamounts");
			//单用户投资最小限额 - 需要计算 
			if ($item.attr("data-ialres-type") == "2") {
				//按百分比计算
				config.mycalculate.projectLimitMoney = Math.floor( totalProjectMoney * ($item.attr("data-ialres-val") / 100) / 100 )*100;
			} else if ($item.attr("data-ialres-type") == "1") {
				//按值计算
				config.mycalculate.projectLimitMoney = $item.attr("data-ialres-val");
			}
			//是否为新手标
			if($item.attr("data-isforfresh") == "1"){
				config.mycalculate.showInterest = false;
				config.mycalculate.notUseCoupon = true;
			}
			//是否为秒杀标
			if($item.attr("data-isseckill") == "1"){
				config.mycalculate.showInterest = false;
				config.mycalculate.notUseCoupon = true;
			}
			//是否为抵押
			if($item.attr("data-hasMortgage") > 0){
				config.mycalculate.isMortgage = true;
			}else{
				config.mycalculate.isMortgage = false;
			}
			//用户已投金额
			config.serverObj.data.bid.curUserBiddingAmount = $.trim($table.find("span:eq(1)").attr("data-biddingamount"));
			if(isNaN(limitMoney)) limitMoney = 0;
			if (limitMoney <= 0) {
				//如果投资金额计算出来小于等于0  做提醒
				popup.showBidBalanceLess();
				return;
			}
			commonFn.addCurrentBalanceByMaxCoupon(config.mycalculate.surplusMoney, config.baseInfo.planInvestMoney, limitMoney, config.serverObj.data.currentBalance, config.serverObj.data.couponList);
			commonFn.setConfigByCompare(config.mycalculate.surplusMoney, config.baseInfo.planInvestMoney, limitMoney, config.serverObj.data.currentBalance);
			//对红包数据改造
			config.serverObj.data.couponList = commonFn.getIsCheckedCouponList(config.serverObj.data.couponList);
			//判断是否是预开标
			if(self.attr("data-opentime")){
				config.mycalculate.isPre = true;

				var arrDate = self.attr('data-bidtime').split(/-|:|\s/),
	                opentime = new Date(arrDate[0],arrDate[1]-1,arrDate[2],arrDate[3],arrDate[4],arrDate[5]),
	                opentime_sss = opentime.getTime();

				if(typeof GLOBAL_COUNTDOWN === 'object' && !GLOBAL_COUNTDOWN[opentime_sss]){
					GLOBAL_COUNTDOWN[opentime_sss] = true;
				}
			}else{
				config.mycalculate.isPre = false;
			}

			popup.showPopup();
			if(typeof GLOBAL_COUNTDOWN === 'object'){
				GLOBAL_COUNTDOWN['input'] = $("input[data-cdtime='1']");
			}

			setHongbaoUlHeight();	
			setJiaXiUlHeight();
		});

		//手机专享
		$partBox.on("click", ".ver-invest-btns input[data-mobile='1']", function(){
			config.mycalculate.popupStatus = 5; //显示新手专享弹层
			config.baseInfo.typeName = "手机专享投资";
			popup.showPopup();

		});

		//提交
		$Main.on("click", ".version-btn-sureInvest", bidSubmitInvest);

		//刷新列表
		var refreshList = function(){
			var bidIds = "", bidIdArr=[] ;
			$(".ver-invest-btns input").each(function(i,item){
				var self = $(this);
				var bid = self.attr("data-bidid");
				if(bid){
					bidIds += bid + ',';
					bidIdArr[bid] = self.parents('.version-item-w279');
				}
			})
			refreshListAjax({
				bidIds: bidIds,
				isTransfer: 0,
				succFn: function(data){
					$.each(data.data, function(key, val) {
						if(val.status != 11 && val.status != 12) return;

						var listRight = bidIdArr[key];
						var $item = listRight.closest('.version-item');
						if(val.status == 11){
							var itemTips = $item.attr("data-ialres-type") == "1"? "bid_avail_yuan": "bid_avail_percent";
							var param = listRight.find('.ver-invest-money span:eq(0) strong a').attr("data-param");
							var $investBtn = listRight.find(".ver-invest-btns .ver-btn");
							if($investBtn.attr("data-raise") != undefined){
								$investBtn.attr("data-raise", val.curUserRaiseInterest);	//加息券标记
							}
							if(val.curUserRaiseInterest != 0 && $item.find(".inrlabel").length == 0){
								//如果列表没有加息提示，则 增加一条加息提示
								$item.find(".version-second:eq(0)").append('<span class="inrlabel"><span>+' + val.curUserRaiseInterest/100 + '%</span><span class="ar_up"></span></span>');
							}
							listRight.find('.ver-invest-money span:eq(0)').html('<strong class="">可投金额(元)<a href="javascript:;" data-text="'+itemTips+'" data-param="'+param+'" class="version-ico version-tooltip-css tooltipcol"></a></strong>' + commonFn.fmtMoney(val.canBidAmount, 2));
							var precent = val.biddingPercent / 100.00;
							// 0-99 向上取整；99-100 向下取整
							if(precent < 99 && precent > 0){
								precent = Math.ceil(precent);
							}else if(precent >= 100){
								precent = 100;
							}else{
								precent = Math.floor(precent);
							}
							var circle = listRight.find(".cvs-circle-progress").attr("data-precent", precent);
							var $span = circle.next().find(".span-circle-progress");
							$span.html(precent);
							commonFn.setCanvas(circle[0], $span);
							// var $circle = listRight.find("div[data-type='verxon-circle']");
							// var $bili = $circle.find("span[data-type='cerxon-span']");
							// $bili.text(precent);

							// var num = precent * 3.6;
							// if (num <= 180) {
							// 	$circle.find('.verxon-right').css('transform', "rotate(" + num + "deg)");
							// } else {
							// 	$circle.find('.verxon-right').css('transform', "rotate(180deg)");
							// 	$circle.find('.verxon-left').css('transform', "rotate(" + (num - 180) + "deg)");
							// };
							// var bili_color = "";
							// if (precent > 0 && precent <= 50) {
							// 	bili_color ="#ffd200";
							// } else if (precent > 50 && precent < 100) {
							// 	bili_color ="#ff510d";
							// } else if (precent == 100) {
							// 	bili_color ="#81c931";
							// }
							// $circle.css("backgroundColor", bili_color);
							if (!listRight.find('.ver-invest-money span:eq(1)').length && val.curUserBiddingAmount !== 0) {
								listRight.find('.ver-invest-money td').append('<span><strong class="">已投金额(元)<a href="####" data-text="bid_inv_already" class="version-ico version-tooltip-css tooltipcol"></a></strong>' + commonFn.fmtMoney(val.curUserBiddingAmount, 2) + '</span>');
							} else {
								listRight.find('.ver-invest-money span:eq(1)').html('<span><strong class="">已投金额(元)<a href="####" data-text="bid_inv_already" class="version-ico version-tooltip-css tooltipcol"></a></strong>' + commonFn.fmtMoney(val.curUserBiddingAmount, 2) + '</span>');
							}
							//修改标的剩余金额
							listRight.parent().attr("data-remainingamounts",val.remainingAmounts);
							//修改已投金额
							listRight.find(".ver-invest-money tbody tr:eq(0) td:eq(0)").find("span:eq(1)").attr("data-biddingamount",val.curUserBiddingAmount/100);
							//修改限额
							listRight.find(".ver-invest-money tbody span:eq(0)").attr("data-canbidamount", val.canBidAmount/100);
							return;
						}else if(val.status == 12){
							var bidStatus = '满标审核中';
							if (val.curUserBiddingAmount === 0) {
								listRight.html('<div class="ver-cls-w77 relative"><canvas class="cvs-circle-progress" data-precent="100" width="77" height="80"></canvas><div class="verxon-mask-progress"><span data-type="cerxon-span" class="span-circle-progress">100</span>%</div></div><div class="ver-cls-w190"><table border="0" cellspacing="0" cellpadding="0" class="ver-push-box"><tbody><tr><td><span class="ver-push-status">' + bidStatus + '</span></td></tr></tbody></table></div>');
							} else {
								if(val.curUserRaiseInterest != 0 && $item.find(".inrlabel").length == 0){
									//如果列表没有加息提示，则 增加一条加息提示
									$item.find(".version-second:eq(0)").append('<span class="inrlabel"><span>+' + val.curUserRaiseInterest/100 + '%</span><span class="ar_up"></span></span>');
								}
								listRight.html('<div class="ver-cls-w77 relative"><canvas class="cvs-circle-progress" data-precent="100" width="77" height="80"></canvas><div class="verxon-mask-progress"><span data-type="cerxon-span" class="span-circle-progress">100</span>%</div></div><div class="ver-cls-w190"><table border="0" cellspacing="0" cellpadding="0" class="ver-push-box"><tbody><tr><td><span class="ver-push-money"><strong>已投金额(元)</strong><a href="####" data-text="您在本投资项目累计投资金额" class="version-ico version-tooltip-css tooltipcol"></a>' + commonFn.fmtMoney(val.curUserBiddingAmount, 2) + '</span><span class="ver-push-status">' + bidStatus + '</span></td></tr></tbody></table></div>');
							}
							var circle = listRight.find(".cvs-circle-progress");
							var $span = circle.next().find(".span-circle-progress");
							commonFn.isIE8() && G_vmlCanvasManager.initElement(circle[0]);
							commonFn.setCanvas(circle[0], $span);
						}
				
					});

				}
			})
			var fbIds = "", fidIdArr = [];
			$(".version-limited-btns input").each(function(i,item){
				var self = $(this);
				var bid = self.attr("fbId-data");
				if(bid){
					fbIds += ','+ bid;
					fidIdArr[bid] = self.parents(".version-limited-proportion");
				}
			})
			refreshSPlanListAjax({
				fbIds: fbIds.substring(1),
				succFn: function(data){
					for(var key in data.data){
						var item = data.data[key];
						var $prop = fidIdArr[key];
						if($prop){
							var precent = item.biddingPercent/100.00;
							precent = precent <= 99? Math.ceil(precent) : Math.floor(precent);
							
							var circle = $prop.find(".cvs-circle-progress").attr("data-precent", precent);
							var $span = circle.next().find(".span-circle-progress");
							$span.html(precent);
							commonFn.setCanvas(circle[0], $span);

							// var $circle = $prop.find("div[data-type='verxon-circle']");
							// var $bili = $circle.find("span[data-type='cerxon-span']");
							// $bili.text(precent);
							if(precent == 100){
								//如果已满
								var $limited = $prop.closest(".version-invest-limited");
								$limited.addClass('version-invest-full-scale');	
								$limited.find(".version-limited-icon").remove();
								$prop.find(".version-limited-w190").remove();
								var investHtml = '';
	                            if(item.curUserBiddingAmount){
	                            	investHtml = '<strong>已投金额(元)</strong><a href="javascript:;" data-text="bid_inv_already" class="version-ico version-tooltip-css tooltipcol"></a><em>'+commonFn.fmtMoney(item.curUserBiddingAmount)+'</em>';
	                            }
								var rightHtml = '<div class="version-limited-state">
	                                <table border="0" cellspacing="0" cellpadding="0" class="version-limited-talbe">
	                                    <tbody>
	                                    <tr>
	                                        <td>
	                                            <span class="version-limited-push-money">'+investHtml+'</span>
	                                            <span class="version-limited-push-status">收益累计中</span>
	                                        </td>
	                                    </tr>
	                                    </tbody>
	                                </table>
	                            </div>';

	                            $prop.append(rightHtml);

							}

							// var num = precent * 3.6;
							// if (num <= 180) {
							// 	$circle.find('.verxon-right').css('transform', "rotate(" + num + "deg)");
							// } else {
							// 	$circle.find('.verxon-right').css('transform', "rotate(180deg)");
							// 	$circle.find('.verxon-left').css('transform', "rotate(" + (num - 180) + "deg)");
							// };
							// var bili_color = "";
							// if (precent > 0 && precent <= 50) {
							// 	bili_color ="#ffd200";
							// } else if (precent > 50 && precent < 100) {
							// 	bili_color ="#ff510d";
							// } else if (precent == 100) {
							// 	bili_color ="#81c931";
							// }
							// $circle.css("backgroundColor", bili_color);							
						}
					}
					
				}
			})
		};

	}

	//转让列表 使用方法和事件
	if (config.baseInfo.url == 2) {

		$partBox.on("click", ".vertransfer-action .version-btn-h30", function() {
			//判断用户名是否登录
			if ($.cookie("syd_name") === undefined) {
				popup.showNoLogin();
				return;
			}
			//如果没有数据 需要重新获取，否则就是未登录
			if(!config.serverObj) getBaseInfo({ async: false});

			var self = $(this);
			var $item = self.closest('.version-item');

			//是否为抵押
			if($item.attr("data-hasMortgage") > 0){
				config.mycalculate.isMortgage = true;
			}else{
				config.mycalculate.isMortgage = false;
			}
			config.baseInfo.bid = self.attr("data-bidid");
			config.baseInfo.typeName = $.trim($item.find('.ver-top a').text());
			config.baseInfo.planInvestMoney = $item.find('span[data-type="transfer-benjin"]').attr("remainPrincipal").replace(/,/g, '');
			//余额小于投资的 (转让标金额 和 100)的最小值，充值引导
			var minMoney = config.baseInfo.planInvestMoney < 100 ? config.baseInfo.planInvestMoney : 100 ;
			if (config.serverObj.data.currentBalance < minMoney) {
				popup.showBalanceLess();
				return;
			}

			commonFn.disBtn.call(self);
			bidDetailAjax({
				succFn: bidDetailTransferSuccFn
			})

		});
		//提交
		$Main.on("click", ".version-btn-sureInvest", bidSubmitTransfer);
					 
		//刷新列表
		var refreshList = function(){
			var bidIds = "", bidIdArr=[] ;
			$(".version-item-w279 input").each(function(i,item){
				var self = $(this);
				var bid = self.attr("data-bidid");
				if(bid){
					bidIds += bid + ',';
					bidIdArr[bid] = self.parents('.version-item-w279');
				}
			});
			refreshListAjax({
				bidIds: bidIds,
				isTransfer: 1,
				succFn: function(data){
					$.each(data.data, function(key, val) {
						var btnStr = "", msg = "";
						var listRight = bidIdArr[key];
						if(!listRight) return;

						switch(val.status){
							case 1: btnStr = "购买转让";
								break;
							case 2: btnStr = "转让成功"; 
								break;
							case 3: 
							case 4: btnStr = "已撤销";
								break;
						}
						if(val.status == 1 || val.status == 2){
							var $item = listRight.closest('.version-item');
							var itemTips = "bid_sum_tran";
							var param = listRight.find('.ver-invest-money span:eq(0) strong a').attr("data-param");
							listRight.find('.ver-invest-money span:eq(0)').html('<strong>可投金额(元)<a href="javascript:;" data-text="'+itemTips+'" data-param="'+param+'" class="version-ico version-tooltip-css tooltipcol"></a></strong> ' + commonFn.fmtMoney(val.remainAmount, 2));
							var precent = val.biddingPercent / 100.00;
							// 0-99 向上取整；99-100 向下取整
							if(precent < 99 && precent > 0){
								precent = Math.ceil(precent);
							}else{
								precent = Math.floor(precent);
							}

							var circle = listRight.find(".cvs-circle-progress").attr("data-precent", precent);
							var $span = circle.next().find(".span-circle-progress");
							$span.html(precent);
							commonFn.setCanvas(circle[0], $span);
							// var $circle = listRight.find("div[data-type='verxon-circle']");
							// var $bili = $circle.find("span[data-type='cerxon-span']");
							// $bili.text(precent);

							// var num = precent * 3.6;
							// if (num <= 180) {
							// 	$circle.find('.verxon-right').css('transform', "rotate(" + num + "deg)");
							// } else {
							// 	$circle.find('.verxon-right').css('transform', "rotate(180deg)");
							// 	$circle.find('.verxon-left').css('transform', "rotate(" + (num - 180) + "deg)");
							// };
							// var bili_color = "";
							// if (precent > 0 && precent <= 50) {
							// 	bili_color ="#ffd200";
							// } else if (precent > 50 && precent < 100) {
							// 	bili_color ="#ff510d";
							// } else if (precent == 100) {
							// 	bili_color ="#81c931";
							// }
							// $circle.css("backgroundColor", bili_color);
							if (!listRight.find('.ver-invest-money span:eq(1)').length && val.curUserBiddingAmount !== 0) {
								listRight.find('.ver-invest-money td').append('<span><strong class="">已投金额(元)<a href="####" data-text="bid_inv_already_tran" class="version-ico version-tooltip-css tooltipcol"></a></strong> ' + commonFn.fmtMoney(val.curUserBiddingAmount, 2) + '</span>');
							} else {
								listRight.find('.ver-invest-money span:eq(1)').html('<span><strong class="">已投金额(元)<a href="####" data-text="bid_inv_already_tran" class="version-ico version-tooltip-css tooltipcol"></a></strong> ' + commonFn.fmtMoney(val.curUserBiddingAmount, 2) + '</span>');
							}
							//修改标的剩余金额
							// listRight.parent().attr("data-remainingamounts",val.remainingAmounts);
							// //修改已投金额
							// listRight.find(".ver-invest-money tbody tr:eq(0) td:eq(0)").find("span:eq(1)").attr("data-biddingamount",val.curUserBiddingAmount/100);
							// //修改限额
							// listRight.find(".ver-invest-money tbody span:eq(0)").attr("data-canbidamount", val.canBidAmount/100);
							$item.find('span[data-type="transfer-benjin"]').attr("remainPrincipal", val.remainPrincipal);
						}
						if(val.status != 1){
							listRight.find('.vertransfer-action input').addClass('disabled').attr("disabled",true).val(btnStr).end();
						}				
					});
					
				}
			})
		}

	}

	//我的账户 投资列表
	if (config.baseInfo.url == 3) {
		var getTransferByAjax = function() {
			$.ajax({
				url: "/myaccount/invest/interest/" + config.baseInfo.bid + "/" + config.serverObj.data.discountRate,
				type: 'get',
				data: {
					t: Math.random()
				},
				dataType: 'json',
				success: function(data) {
					if (!data.data) {
						popup.showSystemBusy();
						return;
					}

					config.serverObj = data;
					config.mycalculate.popupStatus = 3; //我的账户转让弹出层
					// 收益损失/增加 = 实际本金  -  转让本金
					config.mycalculate.changeMoney = Math.abs(config.serverObj.data.actualPrincipal - config.serverObj.data.principal);
					// 转让价格 = 传过来的转让价格 + 转让结息
					config.serverObj.data.actualPrincipal += config.serverObj.data.interest;
					// 预计回款 = 实际本金 - 转让手续费
					config.mycalculate.returnMoney = config.serverObj.data.actualPrincipal - config.serverObj.data.transferFee;

					//计算转出类型
					var discount = config.serverObj.data.discountRate;
					config.mycalculate.transfer_type = discount == 10000 ? 0 : discount < 10000 ? 1 : 2;

					popup.showPopup();
					//如果受让人利率低于固定利率 需要禁用按钮
					if(config.serverObj.data.actualYearRate < config.codes.globalRules.tran_raise_rate_limit){
						$(".version-btn-sureInvest").attr("disabled",true).addClass('disabled');
					}
					
				}
			});
		};

		var bindElementEvent = function() {
			$Main.on("click", ".version-popup-item-title>p a", function() {
				config.serverObj.data.discountRate = $(this).attr("data-defaultBili");
				getTransferByAjax();
			});
			//选择折价按钮显示事件
			$Main.on("click", ".version-popup-rate", function(ev, hide) {
				var self = $(this);

				if (self.find("i").hasClass('an') || hide) {
					self.find("i").removeClass("an");
					self.parent().find(".version-popup-rate-list").hide();
				} else {
					self.find("i").addClass("an");
					self.parent().find(".version-popup-rate-list").show();
				}
				return false;
			});
			//选择折价下拉触发事件
			$Main.on("click", ".version-popup-rate-list a", function() {
				var self = $(this);
				//修改打折比例时触发计算收益、受让人利率
				config.serverObj.data.discountRate = $.trim(self.text()).replace("%", '') * 100;
				getTransferByAjax();
			});
		};
		bindElementEvent();

		//转让按钮
		$(".information").on("click", ".btn-transfer", function() {
			config.mycalculate.popupStatus = 3;
			config.baseInfo.bid = $(this).attr("data-id");
			var $list = $(this).closest('.borrow-list');
			config.baseInfo.typeName = $.trim($list.find("table tbody td:eq(0) div:eq(0) a").text());
			config.serverObj.data.discountRate = "10000";
			config.mycalculate.thisObj = $list.find(".modify-table:eq(1) tbody td:eq(0)");
			getTransferByAjax();
		});

		//确定撤销
		$Main.on("click", ".version-btn-sureInvest", function() {
			if(config.mycalculate.popupStatus == 3){
				//确定转让
				sureTransferSubmit();
			}else{
				//确定撤销
				sureRevokeAjax({
					succFn: function(){
						config.mycalculate.thisObj && config.mycalculate.thisObj.html('<span style="color: #ff7d5a">已撤销</span>');
					}
				});
			}
			
		});

		//撤销
		$(".information").on("click", ".btn-cancle", function() {
			config.mycalculate.popupStatus = 4;
			config.baseInfo.bid = $(this).attr("data-id");
			config.baseInfo.cancleType = 1;
			var $list = $(this).closest('.borrow-list');
			config.baseInfo.typeName = $list.find("table tbody td:eq(0) div:eq(0) a").text();
			config.mycalculate.thisObj = $list.find(".modify-table:eq(1) tbody td:eq(0)");

			getRevokeTransferAjax();
		});

		//确定转让
		var sureTransferSubmit = function(){
			commonFn.disBtn.call($(".version-btn-sureInvest"));
			$.ajax({
				url: "/myaccount/invest/transfer/" + config.baseInfo.bid + "/" + config.serverObj.data.discountRate,
				type: 'get',
				data: {
					t: Math.random()
				},
				dataType: 'json',
				success: function(data) {
					if (data.result == 1) {
						popup.hidePopup();
						config.mycalculate.thisObj && config.mycalculate.thisObj.html('<div><span class="transfer-in">转让中</span></div><a href="javascript:;" data-id="'+config.baseInfo.bid+'" class="btn-cancle">撤销转让</a>');
					} else {
						popup.showSystemBusy();
					}
				},
				error: function() {
					popup.showSystemBusy();
				}
			});
		}

	}

	//我的账户 债权转让 
	if (config.baseInfo.url == 4) {
		//撤销转让
		$(".information").on("click", ".btn-cancle-0", function() {
			config.mycalculate.popupStatus = 4;
			config.baseInfo.bid = $(this).attr("data-id");
			config.baseInfo.cancleType = 0;
			var $list = $(this).closest('.borrow-list');
			config.baseInfo.typeName = $list.find("table tbody td:eq(0) div:eq(0) a").text();
			config.mycalculate.thisObj = $list.find(".modify-table:eq(1) tbody td:eq(0)");

			getRevokeTransferAjax();
		});

		//确定撤销
		$Main.on("click", ".version-btn-sureInvest", function() {
			commonFn.disBtn.call($(".version-btn-sureInvest"));
			sureRevokeAjax({
				succFn: function(){
					if(config.mycalculate.thisObj){
						config.mycalculate.thisObj.html('<span class="transfer-cancle">已取消</span>');
						config.mycalculate.thisObj.closest(".borrow-list").find("p:eq(4),p:eq(5),p:eq(6)").html("-");
					}
				}
			});
		});
	}

	//新标转让标、定期宝 项目详情
	if(config.baseInfo.url == 5 || config.baseInfo.url == 6){

		var detailTimer = null;
		var detailMaxMoney = $.trim($(".version-project-list-item:eq(3) .version-project-text strong").text()).replace(/,/g,'')*1;
		var $error = $(".version-project-input-error span");
		//计算收益事件
		var getDetailInfo = function(money, succFn) {
			if(isNaN(parseInt(money))) return;
			var $subsidy = $(".version-project-subsidiary");	//如果不显示收益
			if($subsidy.not(":hidden").length == 0){
				$(".layout-right").children().eq(0).css("margin-top", "0");
				return;
			}

			var ajaxUrl = config.baseInfo.url == 5 ? '/ajax/cal_receipt?bidId=' + config.baseInfo.bid + '&amount=' + money 
							: '/ajax/cal_product_receipt?productId=' + config.baseInfo.bid + '&amount=' + money + '&productType=' + $(".layout-right").attr("fbType");
			var data = { t : Math.random() };
			var $rate = $("#hid_bid_rate");
			if($rate){
				data.investRate = $rate.val();
				var $raiseRate = $(".v-detail-btnInvest[data-raise]");
				if($raiseRate){
					data.raiseRate = $raiseRate.attr("data-raise");
				}
			}
			$.ajax({
					url: ajaxUrl,
					type: 'POST',
					dataType: 'json',
					data: data
				})
				.done(function(json) {
					if(!json.data.list) return;

					for (var i = 0; i < json.data.list.length; i++) {
						var item = json.data.list[i];
						var date = null;
						if(config.baseInfo.url == 5){
							date = new Date(item.periodDate);
							item.money = item.interest + item.principal + item.subsidyInterest + item.subsidyPrincipal;
						}else{
							date = new Date(item.endDate);
							item.money = item.interest + item.principal;
						}
						item.date = commonFn.addZero(date.getFullYear()) + '-' + commonFn.addZero(date.getMonth() + 1) + '-' + commonFn.addZero(date.getDate());
					}
					var content = template("src_detail/profit_detail", json);
					$(".version-project-reimb-list").empty().html(content);
					var subMoney = commonFn.fmtMoney(money, 2);
					var actualMoney = commonFn.fmtMoney(json.data.total - money, 2);
					if(config.baseInfo.bidOperType == 1){	//如果是转让项目，则计划投资显示实际支付金额
						subMoney = $.trim($(".version-project-price-money strong").html());
						actualMoney = commonFn.fmtMoney(json.data.total - subMoney.replace(/,/g, '') * 100, 2);
					}
					$(".version-project-sub-left .version-project-sub-num").html(subMoney);
					$(".version-project-sub-right .version-project-sub-num").html(actualMoney);
					succFn && succFn();

				})
				.fail(function() {

				})
				.always(function() {

				});
		};

		//展开按钮事件
		$(".version-project-reimb").on("click", ".version-project-an-row", function() {
			$(this).hide().parent().find(".v-invest-listOpen").show();
		}).on("mouseenter", ".version-project-an-row", function(){
			//增加一个动态展开收缩效果
			var $img = $(".v-open-profit")[0];
			AnimationJs.startMove($img, {top: 20}, {
				time: 180,
				type: "ease-in",
				succFn: function(){
					AnimationJs.startMove($img, {top: 8}, {
						time: 240,
						type: "linear",
						succFn: function(){
							AnimationJs.startMove($img, {top: 12},{
								time: 150,
								type: "ease-in"
							})
						}
					})
				}
			});

		});

		//input修改触发
		var inputChange = function(){
			clearTimeout(detailTimer);
			
			var self = $(this);
			var reg = /[^\d]/g;
			var val = self.val();
			if (reg.test(val)) {
				self.val(val.replace(reg, ''));
				return;
			}
			var newVal = config.baseInfo.url == 5? val : val*1000;	//如果是定期宝，需要乘以1000
			if(newVal > detailMaxMoney){
				self.val(val.substring(0, val.length-1));
				newVal = config.baseInfo.url == 5? val : val*1000;	//如果是定期宝，需要乘以1000
				$error.html("投资金额不能超过可投金额");
			}else{
				$error.html('');
			}

			detailTimer = setTimeout(function(){
				var $investMoney = $(".version-project-confirm-money span");
				if($investMoney.length){
					newVal = newVal*1 + $investMoney.html().replace(/,/g,'')*1;
				}
				
				getDetailInfo(newVal*100);
			},500);
		};

		//input输入框事件
		$(".version-project-input-box input").on("focus",function(){
			var self = $(this);
			self.addClass('version-project-arial').parent().addClass('version-project-shadow');
			if(isNaN(parseInt(self.val()))){
				self.val('');
			}
		}).on("input",function(){	//input兼容 Firefox、Chrome、ie9+  //注意：IE9下删除计数时是有bug的
			inputChange.call(this);
		}).on("propertychange",function(){	//propertychange兼容 ie系
			inputChange.call(this);
		}).on("blur",function(){
			var self = $(this);
			self.parent().removeClass('version-project-shadow');
			if(self.val() == ""){
				self.val(self.attr("data-text")).removeClass('version-project-arial');
			}
		});

		//新标投资、定期宝显示的右侧收益展示
		var showProfitToRight = function(){
			var defaultAmount = 0;
			var $investMoney = $(".version-project-confirm-money span");
			if($investMoney.length){
				defaultAmount = $investMoney.html().replace(/,/g,'')*1;
			}else{
				defaultAmount = detailMaxMoney > 10000? 10000: detailMaxMoney;
			}
			getDetailInfo(defaultAmount*100);	//默认显示的收益
		}

	}

	//项目详情 - 新标、转让标
	if(config.baseInfo.url == 5){
		
		if(config.baseInfo.bidOperType == 1){
			config.baseInfo.planInvestMoney = parseInt($(".version-project-price-money").attr("data"));
			getDetailInfo(config.baseInfo.planInvestMoney);	//默认显示转让金额的收益
			//转让提交
			$Main.on("click", ".version-btn-sureInvest", bidSubmitTransfer);

		}else{
			showProfitToRight();
			//新标提交
			$Main.on("click", ".version-btn-sureInvest", bidSubmitInvest);
		}

		//绑定立即投资按钮事件
		$(".version-project-action").on("click",".v-detail-btnInvest",function(){

			$input = $(".version-project-input-box input");
			config.baseInfo.planInvestMoney = $input.val() * 100;
			if(isNaN(config.baseInfo.planInvestMoney)){
				$input.focus();
				return;
			}
			config.mycalculate.popupStatus = 1; //显示投资弹层
			//如果没有数据 需要重新获取，否则就是未登录
			if(!config.serverObj) getBaseInfo({ async: false});


			//判断用户名是否登录
			if ($.cookie("syd_name") === undefined) {
				popup.showNoLogin();
				return;
			}

			//剩余账户金额
			config.serverObj.data.currentBalance = globalConfig.currentBalance * 100;
			//余额不足1元，充值引导
			if (config.serverObj.data.currentBalance < 100) {
				popup.showBalanceLess();
				return;
			}
			var self = $(this);
			commonFn.disBtn.call(self);

			config.serverObj.data.bid = {};
			var $item = $('.version-project-list');
			// config.baseInfo.typeName = $.trim($item.find('.ver-top a').text());
			var $list = $item.find(".version-project-list-item");
			//还款利率
			var $lilv = $list.filter(":eq(0)").find(".version-project-text strong");
			config.serverObj.data.bid.lilv = $lilv.eq(1).length == 0 ? $.trim($lilv.eq(0).text()) : $.trim($lilv.eq(0).text()) + '+' + $.trim($lilv.eq(1).text());
			//还款期限
			config.serverObj.data.bid.qixian = $.trim($list.filter(":eq(1)").find(".version-project-text").text().replace(/\s+/g,''));
			var $second = $list.filter(":eq(4)").find(".version-second");
			//还款方式
			config.serverObj.data.bid.fangshi = $.trim($list.filter(":eq(2)").find(".version-project-text em").text());

			//项目总金额
			var totalProjectMoney = $.trim($list.filter(":eq(3)").find(".version-project-text strong").text().replace(/,/g,''));

			if (config.baseInfo.planInvestMoney <= 0) {
				//如果计划金额计算出来小于等于0  做提醒
				popup.showMoneyError();
				return;
			}
			//标的剩余金额
			config.mycalculate.surplusMoney = globalConfig.amountBidAval*100;
			//用户已投金额
			config.serverObj.data.bid.curUserBiddingAmount = globalConfig.amountAlreadyBid;
			//单用户投资最小限额 - 需要计算 
			if (globalConfig.bidBaseLimitAmount.type == 2) {
				//按百分比计算
				config.mycalculate.projectLimitMoney = Math.floor( totalProjectMoney * (globalConfig.bidBaseLimitAmount.val / 100) / 100) * 100;
			} else if (globalConfig.bidBaseLimitAmount.type == 1) {
				//按值计算
				config.mycalculate.projectLimitMoney = globalConfig.bidBaseLimitAmount.val;
			}
			//现有可投限额 = 去掉该用户已投后的投资最小限额
			var limitMoney = config.mycalculate.projectLimitMoney - config.serverObj.data.bid.curUserBiddingAmount * 100;
			if(isNaN(limitMoney)) limitMoney = 0;
			if (limitMoney <= 0) {
				//如果投资金额计算出来小于等于0  做提醒
				popup.showBidBalanceLess();
				return;
			}
			commonFn.addCurrentBalanceByMaxCoupon(config.mycalculate.surplusMoney, config.baseInfo.planInvestMoney, limitMoney, config.serverObj.data.currentBalance, config.serverObj.data.couponList);
			commonFn.setConfigByCompare(config.mycalculate.surplusMoney, config.baseInfo.planInvestMoney, limitMoney, config.serverObj.data.currentBalance);
			//对红包数据改造
			config.serverObj.data.couponList = commonFn.getIsCheckedCouponList(config.serverObj.data.couponList);
			
			//判断是否是预开标
			if(self.attr("data-bidtime")){
				config.mycalculate.isPre = true;
				var opentime_sss = self.attr("data-bidtime");
	                				
				if(typeof GLOBAL_COUNTDOWN === 'object' && !GLOBAL_COUNTDOWN[opentime_sss]){
					GLOBAL_COUNTDOWN[opentime_sss] = true;
				}
			}else{
				config.mycalculate.isPre = false;
			}

			//加息券暂时隐藏
			// config.mycalculate.showInterest = false;
			// config.mycalculate.useInterest = 0;

			//是否有加息提示
			var secBid = $(".version-basic-title").find("strong[data-text='loan_seckill']:visible").length;
			var hasAddRate = self.attr("hasAddRate");
			// 如果是秒杀标 或者标已经存在加息 或 新手专享 不显示加息券
			if(secBid > 0 || hasAddRate == "true" || globalConfig.isForFresh == "1" || globalConfig.isSeckill == "1"){
				config.mycalculate.showInterest = false;
			}else{
				var raise = self.attr("data-raise");
				if(raise == 0){
					// raise=0 说明未使用过加息券
					config.mycalculate.showInterest = true;
					config.mycalculate.useInterest = 0;
				}else if(raise > 0){
					// raise有值 说明已经使用过加息券
					config.mycalculate.showInterest = true;
					config.mycalculate.useInterest = raise/100;
				}else if(raise == undefined){
					config.mycalculate.showInterest = false;
				}
			}

			popup.showPopup();
			$(".version-project-input-box input").trigger("blur");
			if(typeof GLOBAL_COUNTDOWN === 'object'){
				GLOBAL_COUNTDOWN['input'] = $("input[data-cdtime='1']");
			}
			setHongbaoUlHeight();
			setJiaXiUlHeight();
		})

		//绑定购买转让按钮事件
		$(".v-detail-btnTransfer").on("click",function(){
			//判断用户名是否登录
			if ($.cookie("syd_name") === undefined) {
				popup.showNoLogin();
				return;
			}
			//剩余账户金额
			config.serverObj.data.currentBalance = globalConfig.currentBalance * 100;
			config.baseInfo.planInvestMoney = $.trim($(".version-project-transfer-price .version-project-price-money").attr("data"));
			//余额小于投资的 (转让标金额 和 100)的最小值，充值引导
			var minMoney = config.baseInfo.planInvestMoney < 100 ? config.baseInfo.planInvestMoney : 100 ;
			if (config.serverObj.data.currentBalance < minMoney) {
				popup.showBalanceLess();
				return;
			}

			var self = $(this);
			commonFn.disBtn.call(self);

			bidDetailAjax({
				succFn: bidDetailTransferSuccFn
			})			

		})

	}

	//投资详情页 - 定期宝
	if(config.baseInfo.url == 6){

		var dosubAjax = function(options) {
			commonFn.disBtn.call($(".version-btn-sureInvest"));

			$.ajax({
					url: '/fb/dosub',
					type: 'POST',
					dataType: 'JSON',
					data: options.data
				})
				.done(function(data) {
					config.serverObj.errorCode = data.errorCode;
					if(data.errorCode == 1){
						if(data.errorMessage == "noLogin"){
							popup.showNoLogin();
							return;
						}
						popup.showSystemBusy();
						return;
					}

					if (data.errorCode === 0) {
						var retCode = data.data.retCode;
						var realAmount = data.data.realAmount;
						// var userBalance = data.data.userBalance;

						config.mycalculate.usedAmount = data.data.realAmount;
						if (retCode === 0) {
							//如果是转让标投资成功，需要修改一下投资金额
							config.mycalculate.investMoney = data.data.realAmount;
							//使用余额 = 投资金额
							config.mycalculate.usedAmount = config.mycalculate.investMoney;
							config.serverObj.data.couponAmount = 0;
							popup.showSuccess();
							//成功 刷新基本信息
							getBaseInfo && getBaseInfo({ async: true });
						} else {
							//失败提示
							if(commonFn.resultConfig[retCode]){
								commonFn.resultConfig[retCode]();
							}else{
								popup.showSystemBusy();
							}
						}
					} else {
						popup.showSystemBusy();
					}
				})
				.fail(function() {
					popup.showSystemBusy();
				})
				.always(function() {
					commonFn.reBtn();
				});
		}
		var bidSubmitSPlan = function(){
			dosubAjax({
				data: {
					fbId: config.baseInfo.bid,
					amount: config.mycalculate.investMoney / 100, //投资金额
					isFullAmountSub: true, //是否扫尾	false - 扫尾 ；true - 不扫尾
					authCode: ''
				}
			})
		}
		showProfitToRight();
		//弹出层提交绑定
		$Main.on("click", ".version-btn-sureInvest", bidSubmitSPlan);
		
		$(".version-project-action").on("click","input[data-type='btn-finance']",function(){
			$input = $(".version-project-input-box input");
			config.baseInfo.planInvestMoney = $input.val() * 100 * 1000;	//定期宝以“千”为单位
			if(isNaN(config.baseInfo.planInvestMoney)){
				$input.focus();
				return;
			}
			config.mycalculate.popupStatus = 1; //显示投资弹层
			//如果没有数据 需要重新获取，否则就是未登录
			if(!config.serverObj) getBaseInfo({ async: false});

			//判断用户名是否登录
			if ($.cookie("syd_name") === undefined) {
				popup.showNoLogin();
				return;
			}

			//剩余账户金额
			config.serverObj.data.currentBalance = globalConfig.currentBalance * 100;
			//余额不足1元，充值引导
			if (config.serverObj.data.currentBalance < 100) {
				popup.showBalanceLess();
				return;
			}
			var self = $(this);
			commonFn.disBtn.call(self);

			config.serverObj.data.bid = {};
			var $item = $('.version-project-list');
			var $list = $item.find(".version-project-list-item");
			//还款利率
			var $lilv = $list.filter(":eq(0)").find(".version-project-text strong");
			config.serverObj.data.bid.lilv = $lilv.eq(1).length == 0 ? $.trim($lilv.eq(0).text()) : $.trim($lilv.eq(0).text()) + '+' + $.trim($lilv.eq(1).text());
			//还款期限
			config.serverObj.data.bid.qixian = $.trim($list.filter(":eq(1)").find(".version-project-text").text().replace(/\s+/g,''));
			var $second = $list.filter(":eq(4)").find(".version-second");
			//还款方式
			config.serverObj.data.bid.fangshi = $.trim($list.filter(":eq(2)").find(".version-project-text em").text());

			//项目总金额
			var totalProjectMoney = $.trim($list.filter(":eq(3)").find(".version-project-text strong").text().replace(/,/g,''));

			if (config.baseInfo.planInvestMoney <= 0) {
				//如果计划金额计算出来小于等于0  做提醒
				popup.showMoneyError();
				return;
			}
			//标的剩余金额
			config.mycalculate.surplusMoney = globalConfig.amountBidAval*100;
			//用户已投金额
			config.serverObj.data.bid.curUserBiddingAmount = globalConfig.amountAlreadyBid;
			//单用户投资最小限额 - 需要计算 
			if (globalConfig.bidBaseLimitAmount.type == 2) {
				//按百分比计算
				config.mycalculate.projectLimitMoney = Math.floor( totalProjectMoney * (globalConfig.bidBaseLimitAmount.val / 100) / 100) * 100;
			} else if (globalConfig.bidBaseLimitAmount.type == 1) {
				//按值计算
				config.mycalculate.projectLimitMoney = globalConfig.bidBaseLimitAmount.val;
			}
			//现有可投限额 = 去掉该用户已投后的投资最小限额
			var limitMoney = config.mycalculate.projectLimitMoney - config.serverObj.data.bid.curUserBiddingAmount * 100;
			if(isNaN(limitMoney)) limitMoney = 0;
			if (limitMoney <= 0) {
				//如果投资金额计算出来小于等于0  做提醒
				popup.showBidBalanceLess();
				return;
			}
			// commonFn.addCurrentBalanceByMaxCoupon(config.mycalculate.surplusMoney, config.baseInfo.planInvestMoney, limitMoney, config.serverObj.data.currentBalance, config.serverObj.data.couponList);
			// commonFn.setConfigByCompare(config.mycalculate.surplusMoney, config.baseInfo.planInvestMoney, limitMoney, config.serverObj.data.currentBalance);
			config.mycalculate.investMoney = config.mycalculate.usedAmount = config.baseInfo.planInvestMoney;
			//对红包数据改造
			// config.serverObj.data.couponList = commonFn.getIsCheckedCouponList(config.serverObj.data.couponList);
			//无红包
			config.serverObj.data.hasCoupon = 0;

			//判断是否是预开标
			if(self.attr("data-opentime")){
				config.mycalculate.isPre = true;

				var arrDate = self.attr('data-bidtime').split(/-|:|\s/),
	                opentime = new Date(arrDate[0],arrDate[1]-1,arrDate[2],arrDate[3],arrDate[4],arrDate[5]),
	                opentime_sss = opentime.getTime();

				if(typeof GLOBAL_COUNTDOWN === 'object' && !GLOBAL_COUNTDOWN[opentime_sss]){
					GLOBAL_COUNTDOWN[opentime_sss] = true;
				}
			}else{
				config.mycalculate.isPre = false;
			}

			popup.showPopup();
			if(typeof GLOBAL_COUNTDOWN === 'object'){
				GLOBAL_COUNTDOWN['input'] = $("input[data-cdtime='1']");
			}

			// setHongbaoUlHeight();
		})
	}

})