/**
 * 正在回款，正在投标，已结清选显卡
 */
// 查看详情show/hide
$(function() {
	$headline = $(".headline");
	$headline.on("click", "span", function() {
		var index = $(this).index();
		var $spans = $headline.find("span");
		for ( var i = 0, len = $spans.length; i < len; i++) {
			$headline.find("span").eq(i).removeClass("headline-current");
			$(this).parent().parent().find(".invest-main").eq(i).hide();
		}
		$(this).addClass("headline-current");
		var $divs = $(this).parent().parent().find(".invest-main");
		$divs.eq(index).show();
		// showSheet($divs, index);
	});
});

$(function() {
	var $screenSpan = $(".screen > span");
	$screenSpan.on("click", function() {
		$(this).parent().find("span.acrenn-active").removeClass("acrenn-active");
		$(this).addClass("acrenn-active");
		var $div = $(this).attr("title");
		$(this).parents("div.invest-main").find(".innerDiv:visible").hide();
		$("#" + $div + "Div").show();
	});
	// 鼠标滑过
	$screenSpan.mouseenter(function() {
		$(this).addClass("acrenn-hover");
	}).mouseleave(function() {
		$(this).removeClass("acrenn-hover");
	});
});

function showSheet(cols, index) {
	var ele = cols.eq(index);
	var url = [ "", "/myaccount/invest/ajax/bid", "/myaccount/invest/ajax/over" ];
	if ($.trim(ele.html()) == '') {
		$.ajax({
			url : url[index],
			type : 'get',
			data : { t : Math.random() },
			dataType : 'html',
			beforeSend : function(xhr) {

			},
			success : function(data) {
				ele.html(data).show();
				periodFun();
			},
			error : function(xhr, type, exception) {
				ele.html("");
			}
		});
	} else {
		ele.show();
	}
}

	function showPagination(jq) {
		var total=parseInt(jq.attr("total"),10);
		var pageSize=parseInt(jq.attr("pageSize"),10);
		var currentpage=parseInt(jq.attr("pageNo"),10);
		
		if (total <= pageSize) {
			return false;
		}
		jq.pagination(total, {
			'items_per_page' : pageSize,
			'num_display_entries' : 4,
			'num_edge_entries' : 2,
			'current_page' : currentpage-1,
			'link_to' : 'javascript:void(0);',
			'prev_text' : "&nbsp;",
			'next_text' : "&nbsp;",
			'callback' : pagedCallback
		});
		
		jq.on("mouseenter", "a", function() {
			$(this).addClass("digital-hover");
		}).end().on("mouseleave", "a", function() {
			$(this).removeClass("digital-hover");
		});
	}

	function pagedCallback(pageNo, jq) {
		var ele=jq.closest("div[name='ajaxPanel']");
		var url=ele.parent().find("input[name='ajaxUrl']").val();
		ajaxLoad(ele,pageNo,url);
	}
	
	function loadContent(ele,pageNo){
		var url=ele.find("input[name='ajaxUrl']").val();
		ajaxLoad(ele,pageNo,url);
	}
	
	function ajaxLoad(ele,pageNo,url){
		$.ajax({
			url : url,
			type : 'get',
			data : {
				"pageNo" : (pageNo + 1),
				t : Math.random()
			},
			dataType : 'html',
			beforeSend : function(xhr) {
				 textMaskLoading(ele);
			},
			success : function(data) {
				ele.html(data);
				textLoadingHide();
				showPagination(ele.find("div.paging"));
				periodFun();
			},
			error : function(xhr, type, exception) {
				textLoadingFasle();
			}
		});
	}
	