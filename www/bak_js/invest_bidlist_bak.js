//新版投资列表页
$(function() {

    //表单校验
    var formAuth = function(authConfig) {
        $.each(authConfig, function(index, item) {
            $.each(item.eventList, function(key, value) {
                $(document).on(key, item.id, value);
            });
        });
    };
    //按钮控制
    // var disBtn = function(el) {
    //     $(el).addClass('ver-stop-btn');
    //     $(el).attr("disabled",true);
    // };
    // var reBtn = function(el) {
    //     $(el).removeClass('ver-stop-btn');
    //     $(el).attr("disabled",false);
    // };
    //错误提示
    var errorMsgShow = function(el, msg) {
        var $parent = $(el).parent();
        if ($parent.find("input[data-cd='countdown']").length != 0) return;

        var errorDom = $parent.find('.ver-btn');
        errorDom.val(msg);
        disBtn(errorDom);

    };
    var errorMsgHide = function(el) {
        var $parent = $(el).parent();
        if ($parent.find("input[data-cd='countdown']").length != 0) return;

        var errorDom = $parent.find('.ver-btn');
        if (errorDom.parents('.version-item ').find('.version-novice').text() === '新手专享') {
            errorDom.val('新手投资');
        } else {
            errorDom.val('投资');
        }
        reBtn(errorDom);
    };
    //弹窗函数
    // var closePopup = function() {
    //     var $popupMask = $('.popup-mask'),
    //         $popup = $('.web-layer');

    //     $popup.removeClass('popup-in');
    //     $popup.addClass('popup-out');
    //     $('.main-offsetHeight').removeClass('back-blur');
    //     //虚化效果

    //     var t = setTimeout(function() {
    //         $popup.hide();
    //     }, 200);
    //     //$popup.hide();
    //     $popupMask.hide();
    // };

    // var showPopup = function(res, type) {
    //     var $winW = $(window).width(),
    //         $winH = $(window).height(),
    //         $dH = $(document).height();
    //     var $popupMask = $('.popup-mask'),
    //         $popup = $('.web-layer'),
    //         $closed = $('.shut-down');
    //     var $left, $top;

    //     $popup.removeClass('popup-out');
    //     renderModal(res, type);
    //     //根据请求结果处理弹窗内容

    //     $popupMask.css({
    //         'width': $winW + 'px',
    //         'height': $dH + 'px'
    //     });
    //     $left = ($winW - $popup.width()) / 2;
    //     $top = ($winH - $popup.height()) / 2;

    //     $popup.addClass('popup-in');
    //     $('.main-offsetHeight').addClass('back-blur');
    //     //虚化效果
    //     $popup.css({
    //         'left': $left + 'px',
    //         'top': $top + $(window).scrollTop() + 'px',
    //         'display': 'block'
    //     });

    //     $popupMask.show();
    // };
    //弹窗内容定制函数
    // var renderModal = function(res, type, realAmount, userBalance) {
    //     //var title = $('.ver-layer-h1');
    //     var bidContent = $('.ver-layer-content');
    //     var bidInfo = $('.ver-infor-status-box');
    //     var footer = $('.ver-layer-bottom');
    //     var bidContentTh = bidContent.find('.ver-layer-th');
    //     var bidContentInfor = bidContent.find('.ver-layer-infor');
    //     var popupAmount = parseInt($('#popupAmount').val());
    //     if (typeof(currentBalance) === 'undefined') {
    //         currentBalance = undefined;
    //     }
    //     var Balance = currentBalance || 0;

    //     if (res !== undefined) {
    //         //投标操作弹窗
    //         ////Title部分
    //         //title.find('span').text(codes.loan_type[res.data.bid.loanType] + res.data.bid.//title);
    //         //title.find('strong').hide();
    //         if (res.data.bid.isForFresh === 1) {
    //             //title.find('strong').text('新手专享').removeClass('version-zhuan').addClass('version-novice').attr('data-text', 'loan_newbie').show();
    //             $('.ver-layer-risk').text('投资有风险 投标需谨慎 每人仅限一次且不超过3000元');
    //         } else {
    //             $('.ver-layer-risk').text('投资有风险 投标需谨慎');
    //         }
    //         if (res.data.bid.isTransfer === 1) {
    //             //title.find('strong').text('转让').removeClass('version-novice').addClass('version-zhuan').attr('data-text', 'loan_tran').show();
    //         }
    //         //Th部分
    //         bidContentTh.find('strong:eq(0)').text((res.data.bid.investAnnualRate / 100).toFixed(2) + '%');
    //         bidContentTh.find('strong:eq(1)').text(res.data.bid.periodsFixed);
    //         bidContentTh.find('strong:eq(1)').next().text(res.data.bid.periodsUnit === 1 ? '个月' : '天');
    //         bidContentTh.find('.ver-vertical-middle em').text(codes.repayMode[res.data.bid.repayMode]);
    //         if (res.data.bid.isFixedRepay === 1) {
    //             bidContentTh.find('.ver-vertical-middle em').append('<i data-text="loan_date" class="version-mixed tooltipcol">固</i>');
    //         }
    //         if (typeof res.data.syhkDays !== 'undefined' && res.data.syhkDays !== 0) {
    //             bidContentTh.find('.ver-vertical-middle em').append('<i data-text="Tplus3" class="version-mixed tooltipcol">T+' + res.data.syhkDays + '</i>');
    //         }
    //         //Infor部分
    //         bidContentInfor.find('>div').hide();
    //         if (res.data.bid.isTransfer === 1) {
    //             res.data.interest = res.data.interest || 0;
    //             bidContentInfor.find('.infor-trans strong:eq(0)').text(fmtMoney(res.data.bid.amountFixed / 100));
    //             bidContentInfor.find('.infor-trans strong:eq(1)').text(fmtMoney(res.data.interest / 100));
    //             bidContentInfor.find('.infor-trans strong:eq(2)').text(fmtMoney(res.data.bid.amountFixed / 100 + res.data.interest / 100));
    //             bidContentInfor.find('.infor-trans').show();
    //         } else {
    //             if (res.data.hasCoupon === '0') {
    //                 //无可用红包
    //                 Balance = res.data.currentBalance / 100;
    //                 bidContentInfor.find('.infor-invest span').text(fmtMoney(popupAmount) + '元');
    //                 bidContentInfor.find('.infor-invest').show();
    //             } else if (res.data.hasCoupon === '2') {
    //                 //有红包不可用
    //                 bidContentInfor.find('.infor-invest span').text(fmtMoney(popupAmount) + '元');
    //                 bidContentInfor.find('.infor-invest').show();
    //                 Balance = res.data.currentBalance / 100;
    //             } else if (res.data.hasCoupon === '1') {
    //                 //有可用红包
    //                 var coupon = parseInt(res.data.couponAmount);
    //                 Balance = res.data.currentBalance / 100 + coupon;

    //                 bidContentInfor.find('.infor-coupon strong:eq(0)').text(fmtMoney(popupAmount - coupon));
    //                 bidContentInfor.find('.infor-coupon strong:eq(1)').text(fmtMoney(coupon));
    //                 bidContentInfor.find('.infor-coupon strong:eq(2)').text(fmtMoney(popupAmount));

    //                 bidContentInfor.find('.infor-coupon').show();
    //             }
    //             if (Balance < popupAmount) {
    //                 renderModal(undefined, 0, Balance);
    //             }
    //             //协议连接
    //             $('#agr_1').next().find('a').attr('href', 'https://www.souyidai.com/agreement/sample/' + res.data.bid.id);
    //             $('#agr_3').next().find('a').attr('href', 'https://www.souyidai.com/agreement/sample/' + res.data.bid.id);
    //         }
    //         //footer部分
    //         footer.find('.ver-btn').show();
    //         footer.find('.ver-btn:eq(2)').hide();

    //         bidInfo.hide();
    //         bidContent.show();
    //     } else {
    //         //提示弹窗
    //         ////title部分
    //         //title.find('span').text('');
    //         //title.find('strong').hide();
    //         var template = infoTemplate(type, popupAmount, userBalance, realAmount);
    //         bidInfo.html(template);

    //         footer.find('.ver-btn').hide();
    //         footer.find('.ver-btn:eq(2)').show();

    //         bidContent.hide();
    //         bidInfo.show();
    //     }
    // };
    // //提示信息模板
    // var infoTemplate = function(type, amount, balance, realAmount) {
    //     var codeSet = codes.local_tooltip;
    //     var templateArray = [
    //         '<div class="ver-layer-status pd-83-85"><span class="version-bigico ver-layer-img-false">&nbsp;</span><em>抱歉，您的余额不足，</em><a href="/myaccount/capital/deposit">立即充值</a></div><div class="ver-layer-message">您计划投资{{realAmount}}元，当前可用余额为{{balance}}元</div>',
    //         '<div class="ver-layer-status pd-83-85"><span class="version-bigico ver-layer-img-ok">&nbsp;</span><span class="ver-layer-msg">恭喜您，已成功投资</span><strong>{{realAmount}}</strong><em>元</em></div><div class="ver-layer-message">当前可用余额为{{balance}}元</div>',
    //         '<div class="ver-layer-status pd-83-85"><span class="version-bigico ver-layer-img-false">&nbsp;</span><em>Sorry,此标已投满,下次手要快哦!</em></div>',
    //         '<div class="ver-layer-status pd-83-85"><span class="version-bigico ver-layer-img-ok">&nbsp;</span><span class="ver-layer-msg">恭喜您，已成功投资</span><strong>{{realAmount}}</strong><em>元</em></div><div class="ver-layer-message">您计划投资{{amount}}元，但由于剩余可投金额不足，已为您成功投资{{realAmount}}元</div>',
    //         '<div class="ver-layer-status pd-83-85"><span class="version-bigico ver-layer-img-false">&nbsp;</span><em>不能超过标的可投金额</em></div><div class="ver-layer-message">您可以在投标时勾选"自动投满"选项</div>',
    //         '<div class="ver-layer-status pd-83-85"><span class="version-bigico ver-layer-img-false">&nbsp;</span><em><a href="https://passport.souyidai.com/?backurl=https://www.souyidai.com/invest">登录</a>后投标，新朋友请先</em><a href="https://passport.souyidai.com/regist.html?backurl=https://www.souyidai.com/invest">注册</a></div>',
    //         '<div class="ver-layer-status pd-83-85"><span class="version-bigico ver-layer-img-false">&nbsp;</span><em>此项目为新手专享，请查看其他项目</em></div><div class="ver-layer-message">累计投资未满3,000元即可投资，且每人仅限一次</div>',
    //         '<div class="ver-layer-status pd-83-85"><span class="version-bigico ver-layer-img-false">&nbsp;</span><em>系统繁忙，请稍候再试</em></div>',
    //         '<div class="ver-layer-status pd-83-85"><span class="version-bigico ver-layer-img-false">&nbsp;</span><em>输入投资金额不合法，最小投资金额1元！</em></div>',
    //         '<div class="ver-layer-status pd-83-85"><span class="version-bigico ver-layer-img-false">&nbsp;</span><em>无法给自己投资哈,去投其他标吧!</em></div>',
    //         '<div class="ver-layer-status pd-83-85"><span class="version-bigico ver-layer-img-false">&nbsp;</span><em>' + codeSet['seckill_tip'] + '</em></div>'
    //     ];
    //     var templateStr = templateArray[type].replace(/{{amount}}/, fmtMoney(amount));
    //     templateStr = templateStr.replace(/{{balance}}/, fmtMoney(balance / 100));
    //     templateStr = templateStr.replace(/{{realAmount}}/g, fmtMoney(realAmount / 100));
    //     return templateStr;
    // };
    //金钱格式化
    var fmtMoney = function(money, length) {
        if (length !== 0) {
            length = length | 2;
        }
        if (typeof money === 'number') {
            money = money.toFixed(length);
        }
        money = money.replace(/(\d)(?=(?:\d{3})+(?:\.\d+)?$)/g, "$1,");
        return money;
    };

    //右侧滚动条 不能到最底下
    $(window).scroll(function() {
        if ($(document).height() - ($(".ver-aside-fixed").height() + $(window).scrollTop()) <= 313) {
            $(".ver-aside-fixed").css({
                top: 'auto',
                bottom: '313px'
            });
        } else {
            $(".ver-aside-fixed").css({
                top: '10px',
                bottom: 'auto'
            });
        }
    }).trigger('scroll');

    //左半部分整体点击效果
    $(document).on('click', '.version-part1-click', function(event) {
        event.preventDefault();
        window.open($(this).find('.version-credit').attr('href'), '_blank');
    });
    //满标整体点击效果
    $(document).on('click', '.version-part2-click', function(event) {
        event.preventDefault();
        window.open($(this).find('.version-credit').attr('href'), '_blank');
    });
    //动态公告
    // $.get('/text/new-tip.htm?' + new Date().getTime(), function(data) {
    //     if (data !== '') {
    //         $('#tip_1').html(data);
    //     }
    // });
    // $.get('/text/transfer-tip.htm?' + new Date().getTime(), function(data) {
    //     if (data !== '') {
    //         $('#tip_2').html(data);
    //     }
    // });
    //关闭弹窗
    // $('.web-layer').on('click', '.shut-down', function(event) {
    //     if ($(this).parents('.web-layer').find('.version-bigico').hasClass('ver-layer-img-ok')) {
    //         var bidIdStr = 'bidIds=';
    //         var bidIdArr = {};
    //         $('.version-item-w279 .ver-btn:visible').not('.ver-gray-ec').not('.ver-gray-buy').each(function(index, el) {
    //             bidIdStr = bidIdStr + $(el).attr('data-bidid') + ',';
    //             bidIdArr[$(el).attr('data-bidid')] = $(el).parents('.version-item-w279');
    //         });
    //         $.ajax({
    //             url: '/invest/bidData',
    //             type: 'POST',
    //             data: bidIdStr,
    //             success: function(data) {
    //                 data = JSON.parse(data);
    //                 $('.version-enve-content span:eq(0) strong').text(fmtMoney(data.data.currentBalance / 100));
    //                 $('.version-enve-content span:eq(1) strong').text(fmtMoney(data.data.couponCount));
    //                 $.each(data.data, function(key, val) {
    //                     var listRight = bidIdArr[key] || 0;
    //                     if (listRight === 0) {
    //                         return
    //                     }
    //                     if (val.isTransfer) {
    //                         if (val.curUserBiddingAmount !== 0) {
    //                             listRight.find('.ver-btn').addClass('ver-gray-buy');
    //                             listRight.find('.ver-btn').data('disabled', 'disabled');
    //                             listRight.find('.ver-btn').val('已购买');
    //                         } else {
    //                             if (val.canBidAmount === 0) {
    //                                 listRight.find('.ver-btn').addClass('ver-gray-ec');
    //                                 listRight.find('.ver-btn').data('disabled', 'disabled');
    //                                 listRight.find('.ver-btn').val('转让成功');
    //                             }
    //                         }
    //                     } else {
    //                         if (val.status !== 11 && val.status !== 16) {
    //                             var bidStatus = '满标审核中';
    //                             if (val.isTransfer === 1) {
    //                                 bidStatus = '正常还款中';
    //                             }
    //                             if (val.curUserBiddingAmount === 0) {
    //                                 listRight.html('<div class="ver-cls-w77 relative"><div class="verxon-circle verxon-top-left" data-type="verxon-circle" style="background-color: rgb(129, 201, 49);"><div class="verxon-pie_left"><div class="verxon-left" style="transform: rotate(180deg);"></div></div><div class="verxon-pie_right"><div class="verxon-right" style="transform: rotate(180deg);"></div></div><div class="verxon-mask"><span data-type="cerxon-span">100</span>%</div></div></div><div class="ver-cls-w190"><table border="0" cellspacing="0" cellpadding="0" class="ver-push-box"><tbody><tr><td><span class="ver-push-status">' + bidStatus + '</span></td></tr></tbody></table></div>');
    //                             } else {
    //                                 listRight.html('<div class="ver-cls-w77 relative"><div class="verxon-circle verxon-top-left" data-type="verxon-circle" style="background-color: rgb(129, 201, 49);"><div class="verxon-pie_left"><div class="verxon-left" style="transform: rotate(180deg);"></div></div><div class="verxon-pie_right"><div class="verxon-right" style="transform: rotate(180deg);"></div></div><div class="verxon-mask"><span data-type="cerxon-span">100</span>%</div></div></div><div class="ver-cls-w190"><table border="0" cellspacing="0" cellpadding="0" class="ver-push-box"><tbody><tr><td><span class="ver-push-money"><strong>已投(元)</strong><a href="####" data-text="您在本投资项目累计投资金额" class="version-ico version-tooltip-css tooltipcol"></a>' + fmtMoney(val.curUserBiddingAmount / 100) + '</span><span class="ver-push-status">' + bidStatus + '</span></td></tr></tbody></table></div>');
    //                             }
    //                         } else {
    //                             if (val.status === 16) {
    //                                 return
    //                             } else {
    //                                 if (val.isForFresh === 1 && val.curUserBiddingAmount !== 0) {
    //                                     listRight.find('.ver-invest-money span:eq(0)').html('<strong class="">可投(元)<a href="####" data-text="bid_avail_money" class="version-ico version-tooltip-css tooltipcol"></a></strong>0.00');
    //                                 } else {
    //                                     listRight.find('.ver-invest-money span:eq(0)').html('<strong class="">可投(元)<a href="####" data-text="bid_avail_money" class="version-ico version-tooltip-css tooltipcol"></a></strong>' + fmtMoney(val.canBidAmount / 100));                                        
    //                                 }
    //                                 listRight.find('div[data-type="verxon-circle"] span').text((val.biddingPercent / 100).toString().substr(0, 2).replace('.', ''));
    //                                 $('div[data-type="verxon-circle"]').each(function(index, el) {
    //                                     var num = $(this).find('span').text() * 3.6;
    //                                     if (num <= 180) {
    //                                         $(this).find('.verxon-right').css('transform', "rotate(" + num + "deg)");
    //                                     } else {
    //                                         $(this).find('.verxon-right').css('transform', "rotate(180deg)");
    //                                         $(this).find('.verxon-left').css('transform', "rotate(" + (num - 180) + "deg)");
    //                                     };
    //                                 });
    //                                 $("span[data-type='cerxon-span']").each(function(i) {
    //                                     var $value = $(this).html();
    //                                     if ($value > 0 && $value <= 50) {
    //                                         $(this).parents('div[data-type="verxon-circle"]').css("backgroundColor", "#ffd200");
    //                                     } else if ($value > 50 && $value < 100) {
    //                                         $(this).parents('div[data-type="verxon-circle"]').css("backgroundColor", "#ff510d");
    //                                     } else if ($value == 100) {
    //                                         $(this).parents('div[data-type="verxon-circle"]').css("backgroundColor", "#81c931");
    //                                     }
    //                                 });
    //                                 if (!listRight.find('.ver-invest-money span:eq(1)').length && val.curUserBiddingAmount !== 0) {
    //                                     listRight.find('.ver-invest-money td').append('<span><strong class="">已投(元)<a href="####" data-text="bid_inv_already" class="version-ico version-tooltip-css tooltipcol"></a></strong>' + fmtMoney(val.curUserBiddingAmount / 100) + '</span>');
    //                                 } else {
    //                                     listRight.find('.ver-invest-money span:eq(1)').html('<span><strong class="">已投(元)<a href="####" data-text="bid_inv_already" class="version-ico version-tooltip-css tooltipcol"></a></strong>' + fmtMoney(val.curUserBiddingAmount / 100) + '</span>');
    //                                 }
    //                             }
    //                         }
    //                     }
    //                 });
    //             }
    //         });
    //     }
    //     closePopup();
    // });
    // //协议勾选
    // $('.web-layer').on('change', '.agreement:visible', function(event) {
    //     if ($(this).prop('checked')) {
    //         $('.btn-invest').removeClass('ver-stop-btn');
    //     } else {
    //         $('.btn-invest').addClass('ver-stop-btn');
    //     }
    // });
    // //输入校验
    // var investAuthConfig = [{
    //     id: '.ver-input-money',
    //     eventList: {
    //         blur: function(events) {
    //             var inputVal = parseInt($(this).val()) || 0;
    //             if (typeof(currentBalance) === 'undefined') {
    //                 currentBalance = undefined;
    //             }
    //             var balance = currentBalance || 0;
    //             var canBidAmount = parseFloat($(this).parents('.version-item-w279').find('.ver-invest-money span').attr('data-canbidamount'));

    //             if (inputVal === 0) {
    //                 errorMsgShow(this, '请输入整数');
    //                 $(this).val('0');
    //                 return;
    //             }
    //             if (inputVal > canBidAmount) {
    //                 errorMsgShow(this, '超过可投金额');
    //                 return;
    //             }
    //             if (inputVal > balance && balance !== 0) {
    //                 errorMsgShow(this, '可用余额不足');
    //                 return;
    //             }
    //             errorMsgHide(this);
    //         },
    //         focus: function(events) {
    //             errorMsgHide(this);
    //         },
    //         keyup: function(events) {
    //             var inputVal = $(this).val();
    //             var caret = inputVal.length - $(this)[0].selectionStart;
    //             inputVal = inputVal.replace(/[^\d.-]/g, "");
    //             inputVal = inputVal.replace(/^-/g, "");
    //             inputVal = inputVal.replace(/-|^\.|\d+(?:\.\d*){2,}/g, "");
    //             inputVal = inputVal.replace(/\./g, "");
    //             $(this).val(inputVal);
    //             $(this)[0].selectionStart = inputVal.length - caret;
    //             $(this)[0].selectionEnd = inputVal.length - caret;
    //         }
    //     }
    // }];
    // formAuth(investAuthConfig);
    // //投标操作弹窗
    // $(document).on('click', '.ver-invest-btns .ver-btn,.ver-transfer-btn .ver-btn', function(event) {
    //     if($(this).hasClass('ver-stop-btn')) return;

    //     var amountInput = $(this).parents('.ver-invest-btns').find('.ver-input-money');
    //     amountInput.trigger('blur');

    //     if ($(this).hasClass('ver-stop-btn')) {
    //         return;
    //     }
    //     if ($(this).attr('data-opentime') !== undefined) {
    //         return;
    //     }
    //     if ($(this).hasClass('ver-gray-buy')) {
    //         return;
    //     }
    //     if ($(this).hasClass('ver-gray-ec')) {
    //         return;
    //     }
    //     //判断用户名是否登录
    //     if ($.cookie("syd_name") === undefined) {
    //         showPopup(undefined, 5);
    //         return;
    //     }

    //     var amountNum = amountInput.val();
    //     if (amountNum === undefined) {
    //         amountNum = $(this).attr('data-amount');
    //     }
    //     var bidId = $(this).attr('data-bidid');
    //     var _this_ = this;

    //     disBtn(_this_);
    //     $('#popupAmount').val(amountNum);
    //     $('#popupBidId').val(bidId);

    //     $.ajax({
    //             url: '/bid/biddetail',
    //             type: 'POST',
    //             dataType: 'JSON',
    //             data: {
    //                 bidId: bidId,
    //                 amount: amountNum
    //             }
    //         })
    //         .done(function(data) {
    //             if (data.errorCode == 1) {
    //                 if (data.errorMessage == 'noLogin') {
    //                     showPopup(undefined, 5);
    //                 }
    //                 return;
    //             } else {
    //                 showPopup(data);
    //                 $('.agreement:visible').trigger('change');
    //             }
    //             //if (data.data.bid.isForFresh == 1 && !data.data.isFresh) {
    //             //    showPopup(undefined, 6);
    //            // } 
    //         })
    //         .fail(function() {
    //             showPopup(undefined, 7);
    //         })
    //         .always(function() {
    //             reBtn(_this_);
    //         });
    // });
    // //弹窗投资操作
    // $('.web-layer').on('click', '.btn-invest', function(event) {
    //     var amount = $('#popupAmount').val();
    //     var bidId = $('#popupBidId').val();
    //     var isFullAmountBuy = !$('.autoBid:visible').prop('checked');
    //     var authCode = '';
    //     if ($(this).hasClass('ver-stop-btn')) {
    //         return;
    //     }
    //     var _this_ = this;
    //     disBtn(_this_);

    //     $.ajax({
    //             url: '/bid/dobid',
    //             type: 'POST',
    //             dataType: 'JSON',
    //             data: {
    //                 bidId: bidId,
    //                 bidAmount: amount,
    //                 isFullAmountBuy: isFullAmountBuy,
    //                 authCode: authCode
    //             }
    //         })
    //         .done(function(data) {
    //             if (data.errorCode === 0) {
    //                 var retCode = data.data.retCode;
    //                 var realAmount = data.data.realAmount;
    //                 var userBalance = data.data.userBalance;

    //                 if (retCode === 0) {
    //                     if (amount > realAmount / 100) {
    //                         renderModal(undefined, 3, realAmount, userBalance);
    //                     } else {
    //                         renderModal(undefined, 1, realAmount, userBalance);
    //                     }
    //                 } else {
    //                     if (retCode == -1 || retCode == -2) {
    //                         renderModal(undefined, 8, realAmount, userBalance);
    //                     }
    //                     if (retCode == -4 || retCode == -3) {
    //                         renderModal(undefined, 7, realAmount, userBalance);
    //                     }
    //                     if (retCode == -5) {
    //                         renderModal(undefined, 9, realAmount, userBalance);
    //                     }
    //                     if (retCode == -6) {
    //                         renderModal(undefined, 6, realAmount, userBalance);
    //                     }
    //                     if (retCode == 15) {
    //                         renderModal(undefined, 0, realAmount, userBalance);
    //                     }
    //                     if (retCode == 36 || retCode == 34 || retCode == 52) {
    //                         renderModal(undefined, 2, realAmount, userBalance);
    //                     }
    //                     if (retCode == 32 || retCode == 33) {
    //                         renderModal(undefined, 4, realAmount, userBalance);
    //                     }
    //                     if (retCode == 37) {
    //                         renderModal(undefined, 10, realAmount, userBalance);
    //                     }
    //                     if (retCode == 38) {
    //                         renderModal(undefined, 6, realAmount, userBalance);
    //                     }
    //                 }
    //             } else {
    //                 renderModal(undefined, 7);
    //             }
    //         })
    //         .fail(function() {
    //             renderModal(undefined, 7);
    //         })
    //         .always(function() {
    //             reBtn(_this_);
    //         });

    // });
    //全局键盘监视
    // $(document).keypress(function(event) {
    //     var keycode = (event.keyCode ? event.keyCode : event.which);
    //     var activeDom = document.activeElement;
    //     var KEYCODE_ENTER = '13';
    //     var KEYCODE_ESC = '27';

    //     if (keycode == KEYCODE_ENTER) {
    //         if ($('.ver-layer-content').is(':visible')) {
    //             $('.btn-invest').trigger('click');
    //             return;
    //         }
    //         if ($('.ver-infor-status-box').is(':visible')) {
    //             $('.ver-layer-buttons .shut-down:visible').trigger('click');
    //             return;
    //         }
    //         if ($(activeDom).hasClass('ver-input-money')) {
    //             $(activeDom).parent().find('.ver-btn').trigger('click');
    //             $(activeDom).trigger('blur');
    //             return;
    //         }
    //     }
    //     if (keycode == KEYCODE_ESC) {
    //         if ($('.web-layer').is(':visible')) {
    //             $('.shut-down').trigger('click');
    //         }
    //     }
    // });

    // 列表页banner
    getBannerImg();
    function getBannerImg(){
        $.ajax({
            url: "https://help.souyidai.com/element/invest_banner/index.json",
            dataType: "jsonp",
            jsonp: "callback",
            jsonpCallback: "jsonpcallback",
            success: function(){
                
            }
        })
    }
});

function jsonpcallback(data){
    if ($('.version-table a').eq(0).hasClass('current')) {
        $(".version-banner a").attr("href",data[0]["link"]);
        $(".version-banner img").attr("src",data[0]["picture"]);
    } else if ($('.version-table a').eq(1).hasClass('current')) {
        $(".version-banner a").attr("href",data[2]["link"]);
        $(".version-banner img").attr("src",data[2]["picture"]);
    } else {
        $(".version-banner a").attr("href",data[1]["link"]);
        $(".version-banner img").attr("src",data[1]["picture"]);
    }
}

function showPagination(jq, total, pageSize, currentpage) {
    //            if (total <= pageSize) {
    //                return false;
    //            }
    jq.pagination(total, {
        'items_per_page': pageSize,
        'num_display_entries': 4,
        'num_edge_entries': 2,
        'current_page': currentpage,
        'prev_text': "&nbsp;",
        'next_text': "&nbsp;",
        'callback': pagedCallback
    });

    //如果是在投资、转让上半部分分页时，重新计算数量
    // if(jq.hasClass('online')){
    //     total = total>99? "99+" : total;
    //     $(".version-table a.current span").html(total); 
    // }
}

function pagedCallback(pageNo, jq) {
    textMaskLoading($(jq.parent().parent()));

    //如果是在投资、转让上半部分分页时，去掉预开标的timer提升性能
    if(jq.hasClass('online')){
        $("input[data-cd='countdown']").each(function(i,item){
            clearTimeout(item.cdTimer);
        });
    }
    

    var ht = $.ajax({
        url: jq.attr("url"),
        type: 'POST',
        data: getUrl(pageNo, jq),
        async: true,
        timeout: 10000,
        error: function() {
            textLoadingFasle();
        },
        success: function(ht) {
            if ($('.paging:visible').index(jq) === 1) {
                $(window).scrollTop($('.version-full-scale:visible').offset().top);
            } else {
                $(window).scrollTop($('.version-table').offset().top);
            }
            if ($(jq).hasClass("online")) {
                $(".version-pd9-lr.online").html(ht);
            } else {
                $(".version-pd9-lr.full").html(ht);
            }

            // progressColor();
            setProcessStyle();

            textLoadingHide();

            investCountDown();
        }
    }).responseText;

}

function getUrl(pageNo, jq) {
    var url1 = "pageNo=" + pageNo;
    url1 += "&isTransfer=" + jq.attr("isTransfer");
    url1 += "&isFresh=" + jq.attr("isFresh");
    url1 += "&isSmall=" + jq.attr("isSmall");
    if (jq.hasClass("online")) {
        var loanType = $(".ver-select-current.loanType").attr("loanType");
        var repayMode = $(".ver-select-current.repayMode").attr("repayMode");
        var guar = $(".ver-screen-oselect.guar").val();
        var sort = $(".ver-select-current.sort").attr("sort");
        var sortD = $(".ver-select-current.sort").attr("d");
        url1 += "&loanType=" + loanType;
        url1 += "&repayMode=" + repayMode;
        url1 += "&guar=" + guar;
        url1 += "&sort=" + sort;
        url1 += "&sortD=" + sortD;
    }
    return url1;
}

function _query() {
    var pp = $(".paging.online");
    pagedCallback(0, pp);
}

$().ready(function() {
    $("#charge1").on("click", function() {
        window.location.href = "/myaccount/capital/deposit"
    });

    $(".loanType").on("click", function() {
        $(".loanType").removeClass("ver-select-current");
        $(this).addClass("ver-select-current");
        _query();
    });
    $(".repayMode").on("click", function() {
        $(".repayMode").removeClass("ver-select-current");
        $(this).addClass("ver-select-current");
        _query();
    });
    $(".sort").on("click", function() {
        $(".ver-select-current.sort strong").remove();
        if (!$(this).hasClass('ver-select-current')) {
            $('.sort[sort="rate"]').attr('d', 0);
            $('.sort[sort="amount"]').attr('d', 1);
            $('.sort[sort="canBidAmount"]').attr('d', 1);
            $('.sort[sort="periods"]').attr('d', 1);
            $('.sort[sort="progress"]').attr('d', 0);
        }
        $(".sort").removeClass("ver-select-current");
        $(this).addClass("ver-select-current");
        if (!$(this).hasClass("default")) {
            $(this).attr("d", $(this).attr("d") == 1 ? 0 : 1);
            if ($(this).attr("d") == 0) {
                //添加箭头
                $(this).append("<strong>↑</strong>");
            } else {
                $(this).append("<strong>↓</strong>");
            }
        }
        _query();
    });
    $(".guar").on("change", function() {
        _query();
    });
});