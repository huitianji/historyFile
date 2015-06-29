
// 辅助方法，金额格式化
template.helper('fmtMoney', function(money, length) {
	if (length !== 0) {
		length = length | 2;
	}
	if (typeof parseInt(money) === 'number') {
		money = (money / 100).toFixed(length);
	}
	money = money.replace(/(\d)(?=(?:\d{3})+(?:\.\d+)?$)/g, "$1,");
	return money;
});
// 辅助方法，排名不同top背景不同
template.helper('getRanklistClass', function(i){
    return i==0? "em-first": (i!=1 && i!=2)? "version-arrow-hui": "";
});

//replace替换
template.helper('replace', function(srcString, replaceStr, newVal){
	return srcString.replace(replaceStr,newVal);
});


//格式化时间 type-1: 精确到天；type-2：精确到分；type-3：精确到秒
template.helper('fmtTime', function(time, type) {
	var date = new Date(time * 1);
	type = type || 1;
	function addZero(t){
		return t < 10 ? '0' + t : t;
	}
	var year = date.getFullYear(), 
		month = addZero( date.getMonth() + 1 ), 
		date = addZero( date.getDate() ), 
		hours = addZero( date.getHours() ),
		mins = addZero( date.getMinutes() );
	var res = year + '-' + month + "-" + date;
	switch(type){
		case 1 :
			break;
		case 2 : res += ' ' + hours + ':' + mins; 
			break;
		case 3 :
			break;
		default : 
			break;
	}
	return res;	
});